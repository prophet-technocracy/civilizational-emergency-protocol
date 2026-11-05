// Simulation reducer tests.
//
// The interactive panels are only honest if their refusals are real, so every
// guard is tested here rather than trusted to the UI: an out-of-scope action
// must change nothing except the audit entry that records the refusal.
import assert from "node:assert/strict";
import test from "node:test";
import {
  createSession,
  isRecused,
  reduceSession,
  selectBallot,
  selectDisclosedAttributes,
  selectTask
} from "../src/lib/demoSession.mjs";

const DELEGATIONS = [
  {
    id: "DLG-VALID",
    scope: ["cast-political-ballot"],
    weight: 1,
    consentGiven: true,
    startsAt: "2025-10-01T00:00:00Z",
    expiresAt: "2026-10-01T00:00:00Z"
  },
  {
    id: "DLG-EXPIRED",
    scope: ["cast-political-ballot"],
    weight: 1,
    consentGiven: true,
    startsAt: "2025-02-01T00:00:00Z",
    expiresAt: "2025-12-31T00:00:00Z"
  },
  {
    id: "DLG-OTHER-SCOPE",
    scope: ["submit-citizen-proposal"],
    weight: 1,
    consentGiven: true,
    startsAt: "2025-05-01T00:00:00Z",
    expiresAt: "2027-05-01T00:00:00Z"
  }
];

const TASKS = [{ id: "TASK-X", budget: { allocated: 1000, spent: 200 } }];
const context = {
  franchise: true,
  citizenId: "CIT-SYN-004",
  committeeId: "COM-SYN-01",
  delegations: DELEGATIONS,
  tasks: TASKS
};

const run = (state, action, ctx = context) => reduceSession(state, { ...action, level: action.level ?? 3, context: ctx });
const last = (state) => state.audit[0];
const analyse = (state) => ({ seq: state.seq, audit: state.audit });

const withoutBookkeeping = (state) => {
  const { seq, audit, ...rest } = state;
  return rest;
};

test("a new session starts empty and claims nothing", () => {
  const session = createSession();
  assert.equal(session.ballot.cast, false);
  assert.deepEqual(session.audit, []);
  assert.equal(session.seq, 0);
  assert.deepEqual(session.decisions, []);
});

test("a valid delegation adds one ballot at the session weight", () => {
  const session = run(createSession(), { type: "toggle-delegation", delegationId: "DLG-VALID" });
  assert.equal(last(session).outcome, "recorded");
  assert.equal(selectBallot(session, context).total, 2);
  const off = run(session, { type: "toggle-delegation", delegationId: "DLG-VALID" });
  assert.equal(selectBallot(off, context).total, 1);
});

test("expired and out-of-scope delegations are refused and change no weight", () => {
  for (const id of ["DLG-EXPIRED", "DLG-OTHER-SCOPE"]) {
    const before = createSession();
    const session = run(before, { type: "toggle-delegation", delegationId: id });
    assert.equal(last(session).outcome, "blocked", id);
    assert.equal(last(session).blocked, true);
    assert.equal(selectBallot(session, context).total, 1);
    assert.deepEqual(withoutBookkeeping(session), withoutBookkeeping(before));
  }
});

test("a ballot can be cast once and then withdrawn", () => {
  let session = run(createSession(), { type: "cast-ballot" });
  assert.equal(session.ballot.cast, true);
  assert.ok(session.ballot.castAt);
  const again = run(session, { type: "cast-ballot" });
  assert.equal(last(again).outcome, "blocked");
  assert.match(last(again).message.en, /already cast/i);
  session = run(again, { type: "withdraw-ballot" });
  assert.equal(session.ballot.cast, false);
  assert.equal(session.ballot.castAt, null);
});

test("only level 3 may cast a political ballot", () => {
  for (const level of [1, 2, 4, 5]) {
    const session = run(createSession(), { type: "cast-ballot", level });
    assert.equal(session.ballot.cast, false, `level ${level} cast a ballot`);
    assert.equal(last(session).outcome, "blocked");
  }
});

test("a session without franchise cannot cast", () => {
  const session = run(createSession(), { type: "cast-ballot" }, { ...context, franchise: false });
  assert.equal(session.ballot.cast, false);
  assert.equal(last(session).outcome, "blocked");
});

test("poll answers are stored per poll and can be changed", () => {
  let session = run(createSession(), { type: "answer-poll", pollId: "POLL-1", optionId: "yes" });
  assert.equal(session.polls["POLL-1"], "yes");
  session = run(session, { type: "answer-poll", pollId: "POLL-1", optionId: "no" });
  assert.equal(session.polls["POLL-1"], "no");
  const invalid = run(session, { type: "answer-poll", pollId: "POLL-1" });
  assert.equal(last(invalid).outcome, "blocked");
});

test("a citizen proposal needs a usable title", () => {
  const short = run(createSession(), { type: "submit-proposal", title: "کم" });
  assert.equal(last(short).outcome, "blocked");
  assert.equal(short.proposals.length, 0);
  const good = run(short, { type: "submit-proposal", title: "پیشنهاد نمونه برای شبکهٔ آب", domain: "infrastructure" });
  assert.equal(good.proposals.length, 1);
  assert.equal(good.proposals[0].id, "CIT-PROP-001");
  assert.equal(good.proposals[0].domain, "infrastructure");
});

test("consent can be granted and withdrawn", () => {
  let session = run(createSession(), { type: "set-consent", consentId: "CNS-1", granted: true });
  assert.equal(session.consents["CNS-1"], true);
  session = run(session, { type: "set-consent", consentId: "CNS-1", granted: false });
  assert.equal(session.consents["CNS-1"], false);
});

test("disclosed attributes start from the fixture and toggle individually", () => {
  const fallback = ["qualification-domain", "verification-status"];
  assert.deepEqual(selectDisclosedAttributes(createSession(), fallback), fallback);
  const removed = run(createSession(), { type: "toggle-attribute", attribute: "verification-status", fallbackAttributes: fallback });
  assert.deepEqual(removed.disclosedAttributes, ["qualification-domain"]);
  const added = run(removed, { type: "toggle-attribute", attribute: "verification-status", fallbackAttributes: fallback });
  assert.deepEqual(added.disclosedAttributes, ["qualification-domain", "verification-status"]);
  const nowhere = run(createSession(), { type: "toggle-attribute", attribute: "verification-status" });
  assert.equal(last(nowhere).outcome, "blocked");
});

test("a private service request is recorded only with a real subject", () => {
  const empty = run(createSession(), { type: "request-service", subject: "  " });
  assert.equal(last(empty).outcome, "blocked");
  const good = run(empty, { type: "request-service", subject: "گواهی اشتغال" });
  assert.equal(good.requests.length, 1);
  assert.equal(good.requests[0].state, "submitted-simulated");
});

test("organization work needs acceptance before spend or delivery", () => {
  const level4 = (action, state = createSession()) => run(state, { ...action, level: 4 });
  const spendFirst = level4({ type: "log-spend", taskId: "TASK-X", amount: 300 });
  assert.equal(last(spendFirst).outcome, "blocked");
  const deliverFirst = level4({ type: "submit-deliverable", taskId: "TASK-X", title: "گزارش نمونه" });
  assert.equal(last(deliverFirst).outcome, "blocked");

  const accepted = level4({ type: "accept-task", taskId: "TASK-X" });
  const spend = level4({ type: "log-spend", taskId: "TASK-X", amount: 300 }, accepted);
  assert.equal(last(spend).outcome, "recorded");
  assert.equal(selectTask(spend, TASKS[0]).spend, 300);

  const overBudget = level4({ type: "log-spend", taskId: "TASK-X", amount: 5000 }, accepted);
  assert.equal(last(overBudget).outcome, "blocked");
  const negative = level4({ type: "log-spend", taskId: "TASK-X", amount: -5 }, accepted);
  assert.equal(last(negative).outcome, "blocked");

  const delivered = level4({ type: "submit-deliverable", taskId: "TASK-X", title: "گزارش ایمنی سازه" }, spend);
  assert.equal(last(delivered).outcome, "recorded");
  assert.equal(selectTask(delivered, TASKS[0]).deliverable, "گزارش ایمنی سازه");
});

test("an organization can never exercise its members' ballots", () => {
  const session = run(createSession(), { type: "attempt-member-ballot", taskId: "TASK-X", level: 4 });
  assert.equal(last(session).outcome, "blocked");
  assert.match(last(session).message.en, /cannot exercise/i);
  assert.deepEqual(withoutBookkeeping(session), withoutBookkeeping(createSession()));
});

test("a decision needs a reason and stays marked non-binding", () => {
  const level5 = (action, state = createSession()) => run(state, { ...action, level: 5 });
  const short = level5({ type: "record-decision", proposalId: "PROP-1", reason: "کوتاه", committeeId: "COM-SYN-01" });
  assert.equal(last(short).outcome, "blocked");
  assert.equal(short.decisions.length, 0);

  const recorded = level5(
    { type: "record-decision", proposalId: "PROP-1", reason: "امتیاز از آستانه گذشت و شواهد کافی بود.", actor: "COM-M-01", committeeId: "COM-SYN-01" },
    short
  );
  assert.equal(last(recorded).outcome, "recorded");
  assert.equal(recorded.decisions[0].kind, "synthetic-not-binding");
  assert.equal(recorded.decisions[0].by, "COM-M-01");
});

test("a committee cannot decide another committee's case", () => {
  const session = run(
    createSession(),
    { type: "record-decision", proposalId: "PROP-1", reason: "دلیل کافی برای ثبت این تصمیم نمونه.", committeeId: "COM-OTHER" },
    { ...context, level: 5 }
  );
  assert.equal(last(session).outcome, "blocked");
  assert.equal(session.decisions.length, 0);
});

test("a conflict declaration recuses the member and can be withdrawn", () => {
  const declared = run(createSession(), { type: "declare-conflict", actorId: "COM-M-02", level: 5 });
  assert.equal(isRecused(declared, "COM-M-02"), true);
  const cleared = run(declared, { type: "declare-conflict", actorId: "COM-M-02", level: 5 });
  assert.equal(isRecused(cleared, "COM-M-02"), false);
});

test("commissioning a task records the organization and proposal", () => {
  const session = run(createSession(), { type: "commission-task", organizationId: "ORG-SYN-02", proposalId: "PROP-1", level: 5 });
  assert.equal(last(session).outcome, "recorded");
  assert.equal(session.commissions[0].organizationId, "ORG-SYN-02");
  assert.equal(session.commissions[0].id, "TASK-SIM-001");
});

test("an out-of-scope attempt is refused with the engine's reason", () => {
  const session = run(createSession(), { type: "attempt-out-of-scope", actionId: "read-own-private-record", level: 5 });
  assert.equal(last(session).outcome, "blocked");
  assert.ok(last(session).message.fa.length > 0 && last(session).message.en.length > 0);
});

test("unknown actions are refused rather than ignored", () => {
  const session = run(createSession(), { type: "grant-immunity" });
  assert.equal(last(session).outcome, "blocked");
  assert.match(last(session).message.en, /unknown/i);
});

test("reset returns a clean session", () => {
  const dirty = run(run(createSession(), { type: "cast-ballot" }), { type: "answer-poll", pollId: "P", optionId: "yes" });
  const clean = reduceSession(dirty, { type: "reset", level: 3 });
  assert.deepEqual(clean, createSession());
});

test("the audit trail is newest-first and bounded", () => {
  let session = createSession();
  for (let index = 0; index < 70; index += 1) {
    session = run(session, { type: "answer-poll", pollId: `P-${index}`, optionId: "yes" });
  }
  assert.equal(session.audit.length, 60);
  assert.equal(session.audit[0].id, "SIM-070");
  assert.equal(session.audit[0].seq, 70);
  assert.ok(Date.parse(session.audit[0].at) > Date.parse(session.audit[1].at));
});

test("every audit entry is bilingual and timestamped", () => {
  const session = run(createSession(), { type: "cast-ballot" });
  for (const entry of session.audit) {
    assert.ok(entry.message.fa.length > 3, entry.id);
    assert.ok(entry.message.en.length > 3, entry.id);
    assert.ok(Number.isFinite(Date.parse(entry.at)), entry.id);
  }
});

test("a refusal never mutates anything but the audit trail", () => {
  const start = run(createSession(), { type: "cast-ballot" });
  const before = withoutBookkeeping(start);
  for (const action of [
    { type: "cast-ballot" },
    { type: "toggle-delegation", delegationId: "DLG-EXPIRED" },
    { type: "submit-proposal", title: "کم" },
    { type: "attempt-member-ballot", level: 4 },
    { type: "record-decision", proposalId: "P", reason: "کم", level: 5 }
  ]) {
    const after = run(start, action);
    assert.equal(last(after).outcome, "blocked", action.type);
    assert.deepEqual(withoutBookkeeping(after), before, action.type);
  }
  assert.ok(analyse(start).audit.length >= 1);
});
