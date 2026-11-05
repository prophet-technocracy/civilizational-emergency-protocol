// The three layers that turn a coverage map into a programme: the light beside
// every principle, the projects that can turn an amber light green, and the
// referendum arithmetic that must refuse to declare a winner it does not have.
//
// These tests are deliberately adversarial: they try to fund without a ballot,
// award without the cap, deliver without an audit, and win without quorum.
import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer } from "../src/server.mjs";
import { computeReferendumOutcome } from "../src/data/referendum.mjs";

const server = createServer();
let baseUrl;

before(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
});

const get = async (path) => {
  const response = await fetch(`${baseUrl}${path}`);
  assert.equal(response.status, 200, `${path} did not answer 200`);
  return (await response.json()).data;
};

/* ------------------------------- the light rail ------------------------------ */

test("every one of the 113 principles carries a light, and the weights are harsh on purpose", async () => {
  const data = await get("/api/v1/principles");
  const { principles, lights, summary } = data;

  assert.deepEqual(lights.order, ["green", "amber", "red", "grey"]);
  assert.equal(principles.length, 113);
  for (const principle of principles) {
    assert.ok(lights.order.includes(principle.light), `${principle.id} has no light`);
    const definition = lights.definitions.find((entry) => entry.id === principle.light);
    assert.equal(definition.status, principle.coverage, `${principle.id} light and coverage disagree`);
  }

  // Counts are derivable from the rows, not typed in twice.
  const derived = { green: 0, amber: 0, red: 0, grey: 0 };
  for (const principle of principles) derived[principle.light] += 1;
  assert.deepEqual(lights.counts, derived);
  assert.equal(Object.values(derived).reduce((sum, value) => sum + value, 0), 113);

  // The weight that matters: a principle only represented counts for a tenth.
  const weights = Object.fromEntries(lights.definitions.map((entry) => [entry.id, entry.weight]));
  assert.equal(weights.green, 1);
  assert.equal(weights.amber, 0.1, "an amber light must not count as half a principle");
  assert.equal(weights.red, 0);
  assert.equal(weights.grey, null, "grey is excluded, not scored as zero");

  // Readiness: greens plus a tenth of ambers, over everything an interface can do.
  const expected = (derived.green + derived.amber * 0.1) / (113 - derived.grey);
  assert.equal(lights.readiness, Math.round(expected * 1000) / 1000);
  assert.equal(lights.counted, 113 - derived.grey);
  assert.equal(lights.excluded, derived.grey);
  assert.ok(lights.readiness > 0.2 && lights.readiness < 0.4, "a covenant at 30 % is the honest number; if it moves, check why");

  // The band must be the one the score falls into, and the top band is unreachable.
  assert.equal(lights.band.id, "building");
  assert.ok(lights.bands.every((band) => band.label.fa && band.label.en));
  assert.equal(lights.band.id === "live", false, "nothing here may claim Live");
  assert.ok(lights.liveRequires.fa.includes("بیرون") && lights.liveRequires.en.includes("outside"));

  // The four statuses still add up, so the light layer cannot drift from them.
  assert.equal(Object.values(summary.counts).reduce((sum, value) => sum + value, 0), 113);
  assert.equal(summary.demonstrated, derived.green);
  assert.equal(summary.represented, derived.amber);
  assert.equal(summary.gaps, derived.red);
  assert.equal(summary.beyondSoftware, derived.grey);

  // Every chapter gets its own reading, and none of them is Live either.
  for (const chapter of data.chapters) {
    assert.ok(chapter.readiness >= 0 && chapter.readiness <= 1, `${chapter.id} has no readiness`);
    assert.ok(chapter.band.fa && chapter.band.en);
    assert.notEqual(chapter.band.id, "live");
  }
});

/* --------------------------------- programme -------------------------------- */

test("the programme targets partial principles only, at level 4, under mudarabah", async () => {
  const data = await get("/api/v1/programme");
  const { projects, contract, rules, states, summary, notice } = data;

  assert.ok(notice.fa.includes("نمونه") && notice.en.includes("prototype"));
  assert.equal(contract.type, "mudarabah");
  assert.equal(rules.length, 5);
  assert.deepEqual(states.map((state) => state.id), ["proposed", "balloted", "funded", "in-execution", "delivered"]);

  const principlesById = new Map((await get("/api/v1/principles")).principles.map((row) => [row.id, row]));
  const ids = new Set();
  for (const project of projects) {
    assert.equal(ids.has(project.id), false, `duplicate project id ${project.id}`);
    ids.add(project.id);

    // A project exists to close one amber light, and only an amber one.
    const principle = principlesById.get(project.principleId);
    assert.ok(principle, `${project.id} points at unknown principle ${project.principleId}`);
    assert.equal(principle.coverage, "partial", `${project.id} targets a principle that is not partial`);
    assert.equal(project.principle.light, "amber");
    assert.equal(project.flipsTo, "green");
    assert.equal(project.flipsOnlyWhen, "delivered");

    // Work is done by level 4, and the contractor brings labour, not capital.
    assert.equal(project.contractor.level, 4, `${project.id} hires outside level 4`);
    assert.equal(project.contractor.contract, "mudarabah");
    assert.ok(project.contractor.profitShare > 0 && project.contractor.profitShare < 1);

    // The budget clears the same cap ladder the bank publishes.
    assert.equal(project.cap.allowed, true, `${project.id} exceeds the level-4 cap`);
    assert.ok(project.estimate.tokens > 0 && project.estimate.months > 0);
    assert.ok(project.estimate.tokens <= project.cap.capTokens, `${project.id} is above its own cap`);
    assert.ok(project.title.fa && project.title.en && project.scope.fa && project.deliverable.en);

    // No project is reported as blocked: if one is, the build must say why here.
    assert.deepEqual(project.blockedBy, [], `${project.id} is blocked by ${project.blockedBy.join(", ")}`);
  }

  // The gate that matters most: money never precedes the ballot.
  for (const project of projects) {
    const funded = ["funded", "in-execution", "delivered"].includes(project.state);
    if (funded) assert.equal(project.ballot.result, "passed", `${project.id} was funded without a passed ballot`);
    if (project.state === "delivered") {
      assert.ok(project.audit.some((row) => row.actor.startsWith("AUD-")), `${project.id} was delivered without a review`);
      assert.ok(project.audit.length >= 2);
    }
    // Audit rows move forward in time; a project cannot be reviewed before it exists.
    const dates = project.audit.map((row) => row.date);
    assert.deepEqual(dates, [...dates].sort(), `${project.id} has out-of-order audit rows`);
  }

  // One refused ballot proves the arithmetic is not decoration.
  const refused = projects.filter((project) => project.ballot.result !== "passed");
  assert.ok(refused.length >= 1, "every ballot passing is a smell, not a programme");
  assert.ok(refused.every((project) => project.state === "proposed"));

  // Summary is derived, and it admits how much it leaves out.
  assert.equal(summary.projects, projects.length);
  assert.equal(
    Object.values(summary.byState).reduce((sum, value) => sum + value, 0),
    projects.length
  );
  const tokens = projects.reduce((sum, project) => sum + project.estimate.tokens, 0);
  assert.ok(Math.abs(summary.tokens - Math.round(tokens * 100) / 100) < 1e-9);
  assert.equal(summary.delivered, projects.filter((project) => project.state === "delivered").length);
  assert.equal(summary.partialTargets, summary.represented ?? 47);
  assert.equal(summary.uncoveredByProgramme, summary.partialTargets - projects.length);
  assert.ok(summary.uncoveredByProgramme > 0, "the programme cannot pretend to cover the whole amber backlog");
  assert.equal(methodCovers(data.method), true);
});

function methodCovers(method) {
  return method.fa.length > 40 && method.en.length > 40;
}

/* -------------------------------- referendum -------------------------------- */

test("the referendum instrument publishes the rule, then counts — and refuses when the rule says no", async () => {
  const data = await get("/api/v1/referendum");
  const { posture, sequence, rehearsals, gateList, summary, method } = data;

  // The posture is in the payload, not only in the page.
  assert.equal(posture.isElectionAuthority, false);
  assert.equal(posture.isGovernment, false);
  assert.equal(posture.holdsVoterRoll, false);
  assert.equal(posture.recordsRealBallots, false);
  assert.match(posture.notice.fa, /مرجع انتخاباتی/);
  assert.match(posture.notice.en, /electoral authority/i);

  // Four questions, in order, chained by dependency.
  assert.equal(sequence.length, 4);
  assert.deepEqual(sequence.map((question) => question.order), [1, 2, 3, 4]);
  sequence.forEach((question, index) => {
    assert.ok(question.question.fa && question.question.en);
    assert.ok(question.why.fa.length > 20 && question.why.en.length > 20);
    assert.ok(question.options.length >= 2);
    assert.equal(question.observers, "required");
    if (index > 0) assert.deepEqual(question.dependsOn, [sequence[index - 1].id]);
  });

  // Every reopened gate is named, and none of them is closed.
  assert.equal(gateList.length, 7);
  assert.ok(gateList.some((gate) => gate.id === "voter-roll"));
  assert.ok(gateList.some((gate) => gate.id === "no-standing-power"));

  // The rehearsals: one refusal by quorum, one refusal by threshold.
  assert.equal(rehearsals.length, 4);
  for (const rehearsal of rehearsals) {
    assert.equal(rehearsal.synthetic, true);
    const shares = Object.values(rehearsal.shares);
    assert.ok(Math.abs(shares.reduce((sum, value) => sum + value, 0) - 1) < 1e-6, "valid shares must sum to one");
    assert.ok(rehearsal.note.fa && rehearsal.note.en);
  }
  const quorumFailure = rehearsals.find((entry) => entry.outcome === "failed-quorum");
  assert.ok(quorumFailure, "no rehearsal refuses on quorum — the instrument would never say no");
  assert.equal(quorumFailure.quorumMet, false);
  assert.equal(quorumFailure.accepted, false);
  assert.ok(quorumFailure.reasons.some((reason) => /نصاب/.test(reason.fa)));

  const runoff = rehearsals.find((entry) => entry.outcome === "runoff");
  assert.ok(runoff, "no rehearsal produces a runoff");
  assert.equal(runoff.accepted, false);
  assert.ok(runoff.leader.share < runoff.threshold || runoff.decisionRule === "majority-of-valid");

  assert.equal(summary.questions, 4);
  assert.equal(summary.accepted + summary.refused, rehearsals.length);
  assert.ok(summary.accepted >= 1 && summary.refused >= 1, "an instrument that always passes is a brochure");
  assert.ok(method.fa.length > 40 && method.en.length > 40);
});

test("the quorum arithmetic is a pure function and it refuses malformed input", () => {
  const ok = computeReferendumOutcome({
    castShare: 0.6,
    invalidShare: 0.02,
    votes: { yes: 0.4, no: 0.18 },
    decisionRule: "majority-of-valid",
    quorum: 0.5,
    threshold: 0.55
  });
  assert.equal(ok.ok, true);
  assert.equal(ok.accepted, true);
  assert.equal(ok.leader.id, "yes");
  // Shares are published to three decimals, so the test checks the published number.
  assert.equal(ok.leader.share, Math.round((0.4 / 0.58) * 1000) / 1000);
  assert.equal(ok.validShare, 0.58);

  // Below quorum: no winner, whatever the split.
  const below = computeReferendumOutcome({ castShare: 0.3, votes: { yes: 0.25, no: 0.05 }, quorum: 0.5 });
  assert.equal(below.accepted, false);
  assert.equal(below.outcome, "failed-quorum");

  // Exactly at quorum counts as met, and exactly at threshold does not clear a
  // supermajority — the boundary is not flattering.
  const boundary = computeReferendumOutcome({ castShare: 0.5, votes: { yes: 0.3, no: 0.2 }, decisionRule: "supermajority", quorum: 0.5, threshold: 0.6 });
  assert.equal(boundary.quorumMet, true);
  assert.equal(boundary.accepted, false);
  assert.equal(boundary.outcome, "runoff");

  // Malformed input is refused rather than guessed at.
  assert.equal(computeReferendumOutcome({ castShare: 1.4, votes: { a: 1, b: 1 } }).code, "invalid-turnout");
  assert.equal(computeReferendumOutcome({ castShare: 0.5, votes: { a: 1 } }).code, "needs-two-options");
  assert.equal(computeReferendumOutcome({ castShare: 0.5, votes: { a: 0, b: 0 } }).code, "no-votes");
});
