// Tests for the influence, authority and qualification engine.
//
// These are the tests that make the section 4 guarantees checkable rather than
// rhetorical: a ballot cannot carry an undisclosed factor, reach cannot become
// ballots, professional authority cannot cross domains, and the same proposal
// really does change outcome when the policy changes.
import assert from "node:assert/strict";
import test from "node:test";
import {
  ACTION_POLICY,
  CIVIC_LEVELS,
  INFLUENCE_GUARDS,
  POLICY_IDS,
  WEIGHTING_POLICIES,
  assertBallotIsFullyExplained,
  authorizeAction,
  comparePolicies,
  computeEndorsementReach,
  computePoliticalBallot,
  computeProfessionalWeight,
  evaluatePosthumousMandate,
  getPolicy,
  qualifyProposal,
  validateDelegation
} from "../influence.mjs";

const AT = "2026-01-01T00:00:00Z";

test("five civic levels are defined, and only participating citizens hold a ballot", () => {
  assert.equal(CIVIC_LEVELS.length, 5);
  assert.deepEqual(
    CIVIC_LEVELS.map((level) => level.id),
    [1, 2, 3, 4, 5]
  );
  assert.deepEqual(
    CIVIC_LEVELS.filter((level) => level.holdsBallot).map((level) => level.id),
    [3]
  );
});

test("every level declares at least four actions and none is a superset of all others", () => {
  for (const level of CIVIC_LEVELS) {
    assert.ok(level.actions.length >= 4, `level ${level.id} too thin`);
    for (const actionId of level.actions) {
      assert.ok(ACTION_POLICY[actionId], `level ${level.id} lists unknown action ${actionId}`);
      assert.ok(
        ACTION_POLICY[actionId].levels.includes(level.id),
        `action ${actionId} does not permit level ${level.id}`
      );
    }
  }
  const level5 = new Set(CIVIC_LEVELS[4].actions);
  const missingFrom5 = CIVIC_LEVELS.flatMap((level) => level.actions).filter((action) => !level5.has(action));
  assert.ok(missingFrom5.length > 0, "level 5 must not be an omnipotent superset");
});

test("a base political ballot is one ballot, fully explained", () => {
  const ballot = computePoliticalBallot({ voterId: "V-001" }, "P-OPEN-DRAFT");
  assert.equal(ballot.total, 1);
  assert.equal(ballot.components.length, 1);
  assert.deepEqual(assertBallotIsFullyExplained(ballot), { ok: true, explained: 1, total: 1 });
});

test("no configuration can produce a ballot whose components do not sum to the total", () => {
  const cases = [
    { voterId: "V-002", franchise: true },
    { voterId: "V-003", franchise: false },
    {
      voterId: "V-004",
      delegations: [
        { id: "D-1", weight: 2, scope: ["cast-political-ballot"], consentGiven: true, startsAt: "2025-01-01T00:00:00Z", expiresAt: "2027-01-01T00:00:00Z" },
        { id: "D-2", weight: 5, scope: ["cast-political-ballot"], consentGiven: true, revoked: true, startsAt: "2025-01-01T00:00:00Z", expiresAt: "2027-01-01T00:00:00Z" },
        { id: "D-3", weight: 9, scope: ["submit-citizen-proposal"], consentGiven: true, startsAt: "2025-01-01T00:00:00Z", expiresAt: "2027-01-01T00:00:00Z" }
      ]
    }
  ];
  for (const policyId of POLICY_IDS) {
    for (const input of cases) {
      const ballot = computePoliticalBallot(input, policyId);
      const check = assertBallotIsFullyExplained(ballot);
      assert.ok(check.ok, `${policyId}/${input.voterId}: ${check.explained} ≠ ${check.total}`);
      assert.equal(ballot.ballotsCreatedByAdvocacy, 0);
      assert.equal(ballot.endorsementContribution, 0);
    }
  }
});

test("a revoked delegation contributes zero and says why", () => {
  const ballot = computePoliticalBallot(
    {
      voterId: "V-005",
      delegations: [
        { id: "D-9", weight: 3, scope: ["cast-political-ballot"], consentGiven: true, revoked: true, startsAt: "2025-01-01T00:00:00Z", expiresAt: "2027-01-01T00:00:00Z" }
      ]
    },
    "P-OPEN-DRAFT"
  );
  const delegated = ballot.components.find((component) => component.id === "delegation:D-9");
  assert.equal(delegated.weight, 0);
  assert.match(delegated.justification.en, /revoked/i);
  assert.equal(ballot.total, 1);
});

test("an expired delegation grants nothing", () => {
  const result = validateDelegation(
    { id: "D-10", scope: ["cast-political-ballot"], consentGiven: true, startsAt: "2024-01-01T00:00:00Z", expiresAt: "2025-01-01T00:00:00Z" },
    { at: AT, actionId: "cast-political-ballot" }
  );
  assert.equal(result.allowed, false);
  assert.equal(result.code, "expired");
  assert.equal(result.transfers.length, 0);
});

test("a delegation cannot transfer authority outside its recorded scope", () => {
  const delegation = {
    id: "D-11",
    scope: ["cast-political-ballot"],
    consentGiven: true,
    startsAt: "2025-01-01T00:00:00Z",
    expiresAt: "2027-01-01T00:00:00Z"
  };
  assert.equal(validateDelegation(delegation, { at: AT, actionId: "cast-political-ballot" }).allowed, true);
  const outOfScope = validateDelegation(delegation, { at: AT, actionId: "submit-deliverable" });
  assert.equal(outOfScope.allowed, false);
  assert.equal(outOfScope.code, "out-of-scope");
  assert.deepEqual(outOfScope.transfers, []);
});

test("professional weight is scoped to the decision domain", () => {
  const inDomain = computeProfessionalWeight(
    { credentialDomain: "healthcare", decisionDomain: "healthcare", verified: true, experienceYears: 10 },
    "P-OPEN-DRAFT"
  );
  const outOfDomain = computeProfessionalWeight(
    { credentialDomain: "healthcare", decisionDomain: "infrastructure", verified: true, experienceYears: 30 },
    "P-OPEN-DRAFT"
  );
  assert.equal(inDomain.total, 3.5);
  assert.equal(outOfDomain.total, 0);
  assert.equal(outOfDomain.reason, "domain-mismatch");
});

test("an unverified credential and a declared conflict both reduce weight to zero", () => {
  const unverified = computeProfessionalWeight({ credentialDomain: "education", decisionDomain: "education", verified: false });
  const conflicted = computeProfessionalWeight({ credentialDomain: "education", decisionDomain: "education", verified: true, conflictOfInterest: true });
  assert.equal(unverified.total, 0);
  assert.equal(unverified.components[0].id, "credential-unverified");
  assert.equal(conflicted.total, 0);
  assert.equal(conflicted.reason, "conflict-recused");
});

test("experience bonus is hard-capped at one point", () => {
  const junior = computeProfessionalWeight({ credentialDomain: "economic-policy", decisionDomain: "economic-policy", verified: true, experienceYears: 0 });
  const veteran = computeProfessionalWeight({ credentialDomain: "economic-policy", decisionDomain: "economic-policy", verified: true, experienceYears: 60 });
  assert.equal(junior.total, 3);
  assert.equal(veteran.total, 4);
});

test("endorsement reach is capped and never creates a ballot", () => {
  const reach = computeEndorsementReach(
    { endorsementId: "E-001", advocateId: "A-001", declaredReach: 250000, engagementRate: 0.5, sponsorshipDisclosed: true },
    "P-OPEN-DRAFT"
  );
  assert.equal(reach.reachPoints, 125000);
  assert.equal(reach.points, 40); // capped by policy
  assert.equal(reach.capApplied, true);
  assert.equal(reach.ballotsCreated, 0);
  assert.equal(reach.disclosureComplete, true);
});

test("the restrictive policy records endorsements without counting them", () => {
  const reach = computeEndorsementReach(
    { endorsementId: "E-002", advocateId: "A-002", declaredReach: 90000, engagementRate: 0.6, sponsorshipDisclosed: false },
    "P-RESTRICTIVE-DRAFT"
  );
  assert.equal(reach.counted, false);
  assert.equal(reach.points, 0);
  assert.equal(reach.ballotsCreated, 0);
  assert.equal(reach.disclosureComplete, false);
});

const CONTRIBUTIONS = {
  political: 40,
  professional: 6,
  endorsement: 48000,
  mobilization: 30,
  sponsorship: 2
};
const PROPOSAL = { proposalId: "PROP-SYN-001", domain: "infrastructure" };

test("the same proposal changes outcome under the two policy configurations", () => {
  const open = qualifyProposal({ ...PROPOSAL, contributions: CONTRIBUTIONS }, "P-OPEN-DRAFT");
  const restrictive = qualifyProposal({ ...PROPOSAL, contributions: CONTRIBUTIONS }, "P-RESTRICTIVE-DRAFT");

  assert.equal(open.outcome, "qualified");
  assert.equal(restrictive.outcome, "below-threshold");
  assert.ok(open.total > restrictive.total);
  // The categories that did not count are reported, not silently dropped.
  assert.deepEqual(restrictive.excluded.sort(), ["endorsement", "mobilization"]);
  assert.deepEqual(open.excluded, []);
});

test("every qualification line is reproducible from count × weight", () => {
  for (const policyId of POLICY_IDS) {
    const result = qualifyProposal({ ...PROPOSAL, contributions: CONTRIBUTIONS }, policyId);
    const policy = getPolicy(policyId);
    for (const line of result.lines) {
      assert.equal(line.unitWeight, policy.categories[line.category].weight);
      if (!line.counted) {
        assert.equal(line.points, 0);
      } else if (!line.capApplied) {
        assert.equal(line.points, Math.round(line.count * line.unitWeight * 100) / 100);
      }
    }
    const sum = Math.round(result.lines.filter((line) => line.counted).reduce((total, line) => total + line.points, 0) * 100) / 100;
    assert.ok(Math.abs(sum - result.total) <= 0.05, `${policyId}: lines sum ${sum} vs total ${result.total}`);
  }
});

test("the endorsement share limit is applied and reported when it binds", () => {
  const result = qualifyProposal(
    { ...PROPOSAL, contributions: { political: 5, professional: 0, endorsement: 48000, mobilization: 0, sponsorship: 0 } },
    "P-OPEN-DRAFT"
  );
  // 5 political points + 40 endorsement points = 45 → endorsements are 88% of the total.
  const adjustment = result.adjustments.find((item) => item.id === "endorsement-share-limit");
  assert.ok(adjustment, "expected the share limit to bind");
  assert.ok(result.total < 45);
  const endorsementLine = result.lines.find((line) => line.category === "endorsement");
  assert.ok(endorsementLine.points <= 40 * 0.4 + 1);
});

test("qualification refuses a domain the policy does not cover", () => {
  assert.throws(() => qualifyProposal({ proposalId: "X", domain: "interplanetary", contributions: {} }, "P-OPEN-DRAFT"), /does not apply/);
});

test("comparePolicies returns one result per configuration, in a stable order", () => {
  const results = comparePolicies(PROPOSAL, { default: CONTRIBUTIONS });
  assert.deepEqual(
    results.map((result) => result.policyId),
    POLICY_IDS
  );
  assert.notEqual(results[0].total, results[1].total);
});

test("a threshold is met by an exact margin and reported as zero", () => {
  const result = qualifyProposal({ proposalId: "PROP-SYN-002", domain: "civic-services", contributions: { political: 60 } }, "P-OPEN-DRAFT");
  assert.equal(result.threshold, 60);
  assert.equal(result.total, 60);
  assert.equal(result.margin, 0);
  assert.equal(result.outcome, "qualified");
});

test("posthumous mandates can never carry a ballot", () => {
  const attempt = evaluatePosthumousMandate({
    subjectId: "SUBJ-001",
    priorConsent: true,
    scopes: ["cast-political-ballot", "publish-memoir"],
    reviewRecords: 3,
    requestedAction: "cast-political-ballot"
  });
  assert.equal(attempt.allowed, false);
  assert.equal(attempt.code, "ballot-not-delegable");
  assert.equal(attempt.ballotTransfer, "prohibited");
});

test("posthumous mandates need prior consent, scope and review", () => {
  const base = { subjectId: "SUBJ-002", priorConsent: true, scopes: ["publish-memoir"], reviewRecords: 1, requestedAction: "publish-memoir" };
  assert.equal(evaluatePosthumousMandate(base).allowed, true);
  assert.equal(evaluatePosthumousMandate({ ...base, priorConsent: false }).code, "no-prior-consent");
  assert.equal(evaluatePosthumousMandate({ ...base, scopes: ["release-letters"] }).code, "out-of-scope");
  assert.equal(evaluatePosthumousMandate({ ...base, reviewRecords: 0 }).code, "no-review");
  assert.equal(evaluatePosthumousMandate({ ...base, archived: true }).code, "archive-is-separate");
  for (const result of [base, { ...base, priorConsent: false }, { ...base, reviewRecords: 0 }]) {
    assert.equal(evaluatePosthumousMandate(result).ballotTransfer, "prohibited");
  }
});

test("level 1 cannot read a private record and the refusal carries a reason", () => {
  const denied = authorizeAction({ level: 1, actionId: "read-own-private-record", actor: "L1", resource: { ownerId: "L1" } });
  assert.equal(denied.allowed, false);
  assert.equal(denied.code, "level-not-permitted");
  assert.ok(denied.reason.fa.length > 0 && denied.reason.en.length > 0);
  assert.equal(denied.audit, null);
});

test("level 2 cannot read somebody else's private record", () => {
  const denied = authorizeAction({ level: 2, actionId: "read-own-private-record", actor: "CIT-1", resource: { ownerId: "CIT-2" } });
  assert.equal(denied.allowed, false);
  assert.equal(denied.code, "resource-not-owned");
});

test("level 4 is confined to its own organization", () => {
  const allowed = authorizeAction({ level: 4, actionId: "submit-deliverable", actor: "ORG-1", resource: { organizationId: "ORG-1" } });
  const denied = authorizeAction({ level: 4, actionId: "submit-deliverable", actor: "ORG-1", resource: { organizationId: "ORG-2" } });
  assert.equal(allowed.allowed, true);
  assert.equal(allowed.audit.scope, "organization");
  assert.equal(denied.allowed, false);
  assert.equal(denied.code, "outside-organization");
});

test("level 5 actions are scoped, reasoned and audited", () => {
  for (const actionId of ["record-scoped-decision", "commission-task", "review-deliverable"]) {
    const result = authorizeAction({ level: 5, actionId, actor: "COM-1", resource: { committeeId: "COM-1" } });
    assert.equal(result.allowed, true, actionId);
    assert.equal(result.audit.decisionKind, "synthetic-not-binding");
    assert.ok(result.audit.recordedAt);
    assert.ok(result.audit.scope);
  }
  const wrongCommittee = authorizeAction({ level: 5, actionId: "record-scoped-decision", actor: "COM-1", resource: { committeeId: "COM-2" } });
  assert.equal(wrongCommittee.allowed, false);
});

test("unknown actions and levels fail closed", () => {
  assert.equal(authorizeAction({ level: 3, actionId: "grant-immunity" }).code, "unknown-action");
  assert.equal(authorizeAction({ level: 9, actionId: "answer-poll" }).code, "unknown-level");
});

test("guards are bilingual and non-empty", () => {
  assert.ok(INFLUENCE_GUARDS.length >= 5);
  for (const guard of INFLUENCE_GUARDS) {
    assert.ok(guard.id.length > 0);
    assert.ok(guard.fa.length > 20 && guard.en.length > 20, guard.id);
  }
});

test("every policy is labelled as a configurable draft with an authorizing record", () => {
  for (const policyId of POLICY_IDS) {
    const policy = WEIGHTING_POLICIES[policyId];
    assert.equal(policy.status, "proposed-configurable");
    assert.match(policy.authorizedBy, /^DEC-SYN-/);
    assert.ok(policy.label.fa && policy.label.en);
    assert.ok(policy.limits.note.fa && policy.limits.note.en);
  }
});
