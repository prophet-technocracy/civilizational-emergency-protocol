import assert from "node:assert/strict";
import test from "node:test";
import {
  ENTITY_CATALOGUE,
  EPISTEMIC_STATUSES,
  STATEMENT_TYPES,
  validateEntityShape
} from "../index.mjs";

const ENTITY_NAMES = Object.keys(ENTITY_CATALOGUE);

test("catalogue defines exactly the seventeen core entities", () => {
  assert.equal(ENTITY_NAMES.length, 17);
  assert.deepEqual(ENTITY_NAMES, [
    "HistoricalPerson",
    "HistoricalDossier",
    "HistoricalSource",
    "SourceDocument",
    "EvidenceClaim",
    "Institution",
    "InstitutionalRole",
    "TransitionStage",
    "Project",
    "ProjectMilestone",
    "GovernanceProposal",
    "Amendment",
    "ReviewRecord",
    "VerificationBand",
    "AccessPolicy",
    "AuditEvent",
    "DigitalLegacyConcept"
  ]);
});

test("every entity declares a primary key and at least one required field", () => {
  for (const name of ENTITY_NAMES) {
    const spec = ENTITY_CATALOGUE[name];
    assert.ok(spec.tableName && spec.primaryKey, name);
    assert.ok(Array.isArray(spec.requiredFields) && spec.requiredFields.length > 0, name);
    assert.ok(
      spec.requiredFields.includes(spec.primaryKey),
      `${name} must require its own primary key`
    );
  }
});

test("unknown entities are rejected rather than silently accepted", () => {
  assert.equal(validateEntityShape("MadeUpEntity", {}).valid, false);
  assert.equal(validateEntityShape("", {}).valid, false);
});

test("shape validation reports missing fields without throwing", () => {
  const result = validateEntityShape("Institution", { id: "X" });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("missing required field")));
  assert.equal(validateEntityShape("Institution", null).valid, false);
});

test("historical records are rejected unless explicitly deceased", () => {
  const base = Object.fromEntries(
    ENTITY_CATALOGUE.HistoricalPerson.requiredFields.map((field) => [field, "x"])
  );
  assert.equal(validateEntityShape("HistoricalPerson", { ...base, status: "deceased", isSynthetic: true }).valid, true);
  const living = validateEntityShape("HistoricalPerson", { ...base, status: "living", isSynthetic: true });
  assert.equal(living.valid, false);
  assert.ok(living.errors.some((error) => error.includes("only deceased records are permitted")));
});

test("projects may never grant governance privilege", () => {
  const base = Object.fromEntries(
    ENTITY_CATALOGUE.Project.requiredFields.map((field) => [field, "x"])
  );
  assert.equal(validateEntityShape("Project", { ...base, governancePrivilegeGranted: false }).valid, true);
  const granted = validateEntityShape("Project", { ...base, governancePrivilegeGranted: true });
  assert.equal(granted.valid, false);
});

test("proposals may never claim community ratification", () => {
  const base = Object.fromEntries(
    ENTITY_CATALOGUE.GovernanceProposal.requiredFields.map((field) => [field, "x"])
  );
  assert.equal(validateEntityShape("GovernanceProposal", { ...base, isCommunityRatified: false }).valid, true);
  assert.equal(validateEntityShape("GovernanceProposal", { ...base, isCommunityRatified: true }).valid, false);
});

test("audit events may never claim cryptographic immutability", () => {
  const base = Object.fromEntries(
    ENTITY_CATALOGUE.AuditEvent.requiredFields.map((field) => [field, "x"])
  );
  assert.equal(validateEntityShape("AuditEvent", { ...base, cryptographicImmutabilityClaim: false }).valid, true);
  assert.equal(validateEntityShape("AuditEvent", { ...base, cryptographicImmutabilityClaim: true }).valid, false);
});

test("epistemic and statement vocabularies are frozen and exhaustive", () => {
  assert.ok(Object.isFrozen(EPISTEMIC_STATUSES));
  assert.ok(Object.isFrozen(STATEMENT_TYPES));
  for (const required of [
    "source-verified",
    "source-reported",
    "proposed",
    "hypothetical",
    "disputed",
    "unverified",
    "synthetic-fixture"
  ]) {
    assert.ok(EPISTEMIC_STATUSES.includes(required), required);
  }
});
