import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import {
  HISTORICAL_DOSSIER_77_HEADERS,
  calculateTimelineMetrics,
  computeSafeguardProfile,
  evaluateAssurancePolicy,
  parseCsvLine,
  validateClaimProvenance,
  validateHistoricalDossierCsv
} from "../index.mjs";

const ROOT = resolve(import.meta.dirname, "../../..");
const SAMPLE_CSV = resolve(ROOT, "data/synthetic/synthetic-deceased-archive-sample.csv");

const POLICY_FIXTURE = [
  {
    actionId: "PUBLIC",
    minimumBand: 1,
    requiredProofs: [],
    resource: "public",
    isConstitutionallyProhibited: false,
    purposeLimitationEn: "read",
    expiryPolicy: "unlimited"
  },
  {
    actionId: "SCOPED",
    minimumBand: 4,
    requiredProofs: ["org_role_contract"],
    resource: "drafts",
    isConstitutionallyProhibited: false,
    purposeLimitationEn: "draft review",
    expiryPolicy: "90 days"
  },
  {
    actionId: "FORBIDDEN",
    minimumBand: 5,
    requiredProofs: [],
    resource: "living-data",
    isConstitutionallyProhibited: true,
    prohibitionReasonFa: "ممنوع",
    prohibitionReasonEn: "prohibited",
    purposeLimitationEn: "none",
    expiryPolicy: "never"
  }
];

test("seventy-seven header constant matches the audited schema", () => {
  assert.equal(HISTORICAL_DOSSIER_77_HEADERS.length, 77);
  assert.equal(HISTORICAL_DOSSIER_77_HEADERS[0], "dossier_id");
  assert.equal(HISTORICAL_DOSSIER_77_HEADERS[5], "status");
  assert.equal(HISTORICAL_DOSSIER_77_HEADERS[76], "notes");
  assert.equal(new Set(HISTORICAL_DOSSIER_77_HEADERS).size, 77, "headers must be unique");
});

test("csv line parser honours quoting, embedded commas and escaped quotes", () => {
  assert.deepEqual(parseCsvLine("a,b,c"), ["a", "b", "c"]);
  assert.deepEqual(parseCsvLine('a,"b,still b",c'), ["a", "b,still b", "c"]);
  assert.deepEqual(parseCsvLine('a,"say ""hi""",c'), ["a", 'say "hi"', "c"]);
  assert.deepEqual(parseCsvLine(""), [""]);
});

test("the committed synthetic sample passes the schema and safety gates", () => {
  const csv = readFileSync(SAMPLE_CSV, "utf8");
  const report = validateHistoricalDossierCsv(csv);
  assert.equal(report.valid, true, JSON.stringify(report.errors));
  assert.equal(report.stats.livingRowCount, 0);
  assert.equal(report.stats.highReidentificationCount, 0);
  assert.ok(report.rowCount >= 3);
});

test("publication remains gated until licence and human sign-off exist", () => {
  const csv = readFileSync(SAMPLE_CSV, "utf8");
  assert.equal(validateHistoricalDossierCsv(csv).publicationGatePassed, false);
  assert.equal(
    validateHistoricalDossierCsv(csv, { hasPublicationLicenseConfirmation: true }).publicationGatePassed,
    false,
    "licence alone is not enough"
  );
  assert.equal(
    validateHistoricalDossierCsv(csv, { hasHumanEditorialSignOff: true }).publicationGatePassed,
    false,
    "sign-off alone is not enough"
  );
  assert.equal(
    validateHistoricalDossierCsv(csv, {
      hasPublicationLicenseConfirmation: true,
      hasHumanEditorialSignOff: true
    }).publicationGatePassed,
    true
  );
});

test("a living-person row fails the gate regardless of other quality", () => {
  const header = HISTORICAL_DOSSIER_77_HEADERS.join(",");
  const row = HISTORICAL_DOSSIER_77_HEADERS.map((key) =>
    key === "status" ? "living" : key === "dossier_id" ? "SYN-LIVING-001" : key === "subject_code" ? "RNG_1" : "x"
  ).join(",");
  const report = validateHistoricalDossierCsv(`${header}\n${row}\n`);
  assert.equal(report.valid, false);
  assert.equal(report.stats.livingRowCount, 1);
  assert.ok(report.errors.some((error) => error.includes("CRITICAL PRIVACY VIOLATION")));
});

test("high re-identification risk rows are rejected", () => {
  const header = HISTORICAL_DOSSIER_77_HEADERS.join(",");
  const row = HISTORICAL_DOSSIER_77_HEADERS.map((key) => {
    if (key === "status") return "deceased";
    if (key === "dossier_id") return "SYN-HIGH-001";
    if (key === "subject_code") return "RNG_2";
    if (key === "reidentification_risk") return "HIGH";
    if (key === "source_hint") return "citation";
    return "x";
  }).join(",");
  const report = validateHistoricalDossierCsv(`${header}\n${row}\n`);
  assert.equal(report.valid, false);
  assert.equal(report.stats.highReidentificationCount, 1);
});

test("header count and order mismatches are reported, not ignored", () => {
  const short = HISTORICAL_DOSSIER_77_HEADERS.slice(0, 70).join(",");
  const report = validateHistoricalDossierCsv(`${short}\n`);
  assert.equal(report.valid, false);
  assert.ok(report.errors.some((error) => error.includes("Expected exactly 77 headers")));
});

test("name-derived subject codes raise a replacement warning", () => {
  const header = HISTORICAL_DOSSIER_77_HEADERS.join(",");
  const row = HISTORICAL_DOSSIER_77_HEADERS.map((key) => {
    if (key === "status") return "deceased";
    if (key === "dossier_id") return "SYN-HASH-001";
    if (key === "subject_code") return "HASH_ABCDEF";
    if (key === "reidentification_risk") return "LOW";
    if (key === "source_hint") return "citation";
    return "x";
  }).join(",");
  const report = validateHistoricalDossierCsv(`${header}\n${row}\n`);
  assert.equal(report.valid, true);
  assert.ok(report.warnings.some((warning) => warning.includes("name-derived")));
});

test("duplicate identifiers are rejected", () => {
  const header = HISTORICAL_DOSSIER_77_HEADERS.join(",");
  const build = (id) =>
    HISTORICAL_DOSSIER_77_HEADERS.map((key) => {
      if (key === "status") return "deceased";
      if (key === "dossier_id") return id;
      if (key === "subject_code") return "RNG_DUP";
      if (key === "reidentification_risk") return "LOW";
      if (key === "source_hint") return "citation";
      return "x";
    }).join(",");
  const report = validateHistoricalDossierCsv(`${header}\n${build("SYN-D1")}\n${build("SYN-D1")}\n`);
  assert.equal(report.valid, false);
  assert.ok(report.errors.some((error) => error.includes("duplicate dossier_id")));
});

test("empty csv input fails safely instead of throwing", () => {
  const report = validateHistoricalDossierCsv("");
  assert.equal(report.valid, false);
  assert.equal(report.rowCount, 0);
});

/* ------------------------------ claim provenance --------------------------- */

const VALID_CLAIM = {
  id: "CLM-TEST",
  claim: { fa: "گزارهٔ آزمایشی", en: "Test claim" },
  classification: "fact",
  sourceDocumentId: "SRC-TEST",
  sourceVersion: "v1",
  pageOrSection: "§1",
  publicationDate: "2026-01-01",
  verificationStatus: "source-verified",
  reviewerStatus: "editorial-reviewed",
  confidence: { fa: "بالا", en: "High" },
  knownContradictions: [],
  lastReviewed: "2026-01-02",
  revisionHistory: [{ version: "v1", date: "2026-01-01", change: { fa: "ثبت", en: "Entry" } }]
};

test("a complete claim passes provenance validation", () => {
  const result = validateClaimProvenance(VALID_CLAIM, new Set(["SRC-TEST"]));
  assert.deepEqual(result, { valid: true, errors: [] });
});

test("claims referencing unknown sources are rejected", () => {
  const result = validateClaimProvenance(VALID_CLAIM, new Set(["SRC-OTHER"]));
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("Unknown sourceDocumentId")));
});

test("ai-only claims can never be source-verified", () => {
  const result = validateClaimProvenance({ ...VALID_CLAIM, reviewerStatus: "ai-unreviewed" });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("cannot be marked source-verified")));
});

test("unsupported vocabularies and missing revisions are rejected", () => {
  assert.equal(validateClaimProvenance({ ...VALID_CLAIM, classification: "vibes" }).valid, false);
  assert.equal(validateClaimProvenance({ ...VALID_CLAIM, verificationStatus: "trust-me" }).valid, false);
  assert.equal(validateClaimProvenance({ ...VALID_CLAIM, revisionHistory: [] }).valid, false);
  assert.equal(validateClaimProvenance({ ...VALID_CLAIM, knownContradictions: "none" }).valid, false);
  assert.equal(validateClaimProvenance(null).valid, false);
});

/* ------------------------------ assurance policy --------------------------- */

test("band-one actions need no proof at all", () => {
  const result = evaluateAssurancePolicy(POLICY_FIXTURE, { actionId: "PUBLIC", presentedBand: 1 });
  assert.equal(result.decision, "ALLOW");
  assert.equal(result.code, "PUBLIC_BAND_1_OPEN");
});

test("a high band without the purpose-bound proof is denied", () => {
  const result = evaluateAssurancePolicy(POLICY_FIXTURE, { actionId: "SCOPED", presentedBand: 5 });
  assert.equal(result.decision, "DENY_INSUFFICIENT_ASSURANCE");
  assert.ok(result.missingProofs.includes("org_role_contract"));
});

test("the scoped action succeeds only with matching band and proof", () => {
  const result = evaluateAssurancePolicy(POLICY_FIXTURE, {
    actionId: "SCOPED",
    presentedBand: 4,
    presentedProofs: ["org_role_contract"]
  });
  assert.equal(result.decision, "ALLOW_SCOPED_SIMULATION");
});

test("constitutionally prohibited actions are refused even with maximum band", () => {
  const result = evaluateAssurancePolicy(POLICY_FIXTURE, {
    actionId: "FORBIDDEN",
    presentedBand: 5,
    presentedProofs: ["dual_control_approval", "org_role_contract"]
  });
  assert.equal(result.decision, "PROHIBITED_BY_CHARTER");
  assert.equal(result.minimumBandRequired, null);
});

test("rejected proofs are surfaced as warnings and never count as valid", () => {
  const result = evaluateAssurancePolicy(POLICY_FIXTURE, {
    actionId: "SCOPED",
    presentedBand: 4,
    presentedProofs: ["telegram_citizenship", "social_credit_score"]
  });
  assert.equal(result.decision, "DENY_INSUFFICIENT_ASSURANCE");
  const codes = result.rejectedProofWarnings.map((warning) => warning.code).sort();
  assert.deepEqual(codes, ["REJECTED_SOCIAL_CREDIT", "REJECTED_TELEGRAM_CITIZENSHIP"]);
  assert.ok(result.rejectedProofWarnings.every((warning) => warning.reasonFa && warning.reasonEn));
});

test("unknown actions fail closed", () => {
  const result = evaluateAssurancePolicy(POLICY_FIXTURE, { actionId: "NOT-A-POLICY" });
  assert.equal(result.decision, "DENY");
  assert.equal(result.code, "UNKNOWN_ACTION");
  assert.equal(evaluateAssurancePolicy(POLICY_FIXTURE, {}).code, "UNKNOWN_ACTION");
});

/* --------------------------------- timeline -------------------------------- */

test("timeline metrics validate dangling dependencies", () => {
  const stages = [
    { id: "A", horizonKey: "emergency-180d", milestones: [1, 2], dependencies: [] },
    { id: "B", horizonKey: "transition-2-3y", milestones: [1], dependencies: ["A"] },
    { id: "C", horizonKey: "constitutional-longterm", milestones: [], dependencies: ["MISSING"] }
  ];
  const metrics = calculateTimelineMetrics(stages);
  assert.equal(metrics.totalStages, 3);
  assert.equal(metrics.totalMilestones, 3);
  assert.equal(metrics.dependenciesValid, false);
  assert.deepEqual(metrics.unresolvedDependencies, [{ stageId: "C", missingDependencyId: "MISSING" }]);
  assert.deepEqual(metrics.horizonCounts, {
    "emergency-180d": 1,
    "transition-2-3y": 1,
    "constitutional-longterm": 1
  });
});

test("timeline metrics reject non-array input", () => {
  assert.throws(() => calculateTimelineMetrics("nope"), /must be an array/);
});

/* ----------------------------- safeguard profile --------------------------- */

test("safeguard profile is bounded and deterministic", () => {
  const a = computeSafeguardProfile({ sunsetDays: 30, reviewIntervalDays: 200, supermajority: 88, decentralization: 75 });
  const b = computeSafeguardProfile({ sunsetDays: 30, reviewIntervalDays: 200, supermajority: 88, decentralization: 75 });
  assert.deepEqual(a, b);
  assert.ok(a.indicators.every((indicator) => indicator.value >= 0 && indicator.value <= 100));
  assert.ok(a.tensionPairs.length > 0);
});

test("safeguard profile clamps out-of-range input and flags no-false-certainty", () => {
  const extreme = computeSafeguardProfile({ sunsetDays: 10000, reviewIntervalDays: -50, supermajority: 999, decentralization: -100 });
  assert.equal(extreme.inputs.sunsetDays, 540);
  assert.equal(extreme.inputs.reviewIntervalDays, 7);
  assert.equal(extreme.inputs.supermajority, 90);
  assert.equal(extreme.inputs.decentralization, 0);
  assert.match(extreme.disclaimer.en, /not predictions/i);
});
