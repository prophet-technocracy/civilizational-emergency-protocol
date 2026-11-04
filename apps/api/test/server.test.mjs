import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer, parseQuery, queryArchive, globalSearch, getCsvGateReport } from "../src/server.mjs";

const server = createServer();
let baseUrl;

before(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

/* ------------------------------- legacy contract ------------------------------ */

test("health endpoint reports service status without exposing environment details", async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("demo endpoint is explicitly synthetic and contains no person records", async () => {
  const response = await fetch(`${baseUrl}/api/v1/demo`);
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(payload.mode, "synthetic-demo");
  assert.match(payload.notice, /نمونهٔ محلی/);
  assert.ok(Array.isArray(payload.modules));
  assert.ok(payload.modules.every((module) => module.status === "planned"));
  assert.ok(payload.modules.every((module) => !("person" in module)));
});

test("API routes reject non-GET requests", async () => {
  for (const method of ["POST", "PUT", "PATCH", "DELETE"]) {
    const response = await fetch(`${baseUrl}/api/v1/dashboard`, { method });
    assert.equal(response.status, 405, `${method} must be rejected`);
    assert.equal(response.headers.get("allow"), "GET");
    assert.deepEqual(await response.json(), { error: "method_not_allowed" });
  }
});

test("unknown routes do not disclose server internals", async () => {
  const response = await fetch(`${baseUrl}/api/v1/unknown`);
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: "not_found" });
});

/* -------------------------------- envelopes -------------------------------- */

const MODULE_ROUTES = [
  "/api/v1/health",
  "/api/v1/dashboard",
  "/api/v1/modules",
  "/api/v1/governance",
  "/api/v1/transition",
  "/api/v1/institutions",
  "/api/v1/archive",
  "/api/v1/sources",
  "/api/v1/evidence",
  "/api/v1/verification",
  "/api/v1/accountability",
  "/api/v1/public-services",
  "/api/v1/projects",
  "/api/v1/simulations",
  "/api/v1/digital-legacy"
];

test("every module route returns a read-only synthetic envelope", async () => {
  for (const route of MODULE_ROUTES) {
    const response = await fetch(`${baseUrl}${route}`);
    assert.equal(response.status, 200, route);
    const payload = await response.json();
    assert.equal(payload.mode, "synthetic-demo", route);
    assert.equal(payload.schemaVersion, "1.0.0", route);
    assert.ok(payload.epistemicNotice.fa && payload.epistemicNotice.en, route);
    assert.ok(payload.data && typeof payload.data === "object", route);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(response.headers.get("referrer-policy"), "no-referrer");
  }
});

test("twelve modules are registered in order", async () => {
  const response = await fetch(`${baseUrl}/api/v1/dashboard`);
  const { data } = await response.json();
  assert.equal(data.modules.length, 12);
  assert.deepEqual(
    data.modules.map((module) => module.number),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  );
  assert.deepEqual(
    data.modules.map((module) => module.id),
    [
      "dashboard",
      "governance",
      "transition",
      "institutions",
      "historical-archive",
      "research",
      "verification",
      "accountability",
      "public-services",
      "projects",
      "simulations",
      "digital-legacy"
    ]
  );
});

/* ------------------------------ constitutional ----------------------------- */

test("dashboard never asserts governmental, electoral or ratified authority", async () => {
  const { data } = await (await fetch(`${baseUrl}/api/v1/dashboard`)).json();
  assert.equal(data.constitutionalPosture.isGovernment, false);
  assert.equal(data.constitutionalPosture.isElectionAuthority, false);
  assert.equal(data.constitutionalPosture.hasPublicMandate, false);
  assert.equal(data.constitutionalPosture.hasOperationalProgress, false);
  assert.equal(data.archiveIntegrity.livingPersonRecords, 0);
  assert.equal(data.archiveIntegrity.requiredColumns, 77);
  assert.ok(data.figures.every((figure) => figure.derived === true));
});

test("governance reports an unratified draft and no appointments", async () => {
  const { data } = await (await fetch(`${baseUrl}/api/v1/governance`)).json();
  assert.equal(data.constitutionalPosture.ratificationStatus, "none-recorded");
  assert.equal(data.principles.length, 10);
  assert.ok(data.amendments.every((amendment) => amendment.ratificationStatus === "not-ratified"));
  assert.equal(data.deliberationDemo.isReal, false);
});

test("accountability log refuses to claim cryptographic immutability", async () => {
  const { data } = await (await fetch(`${baseUrl}/api/v1/accountability`)).json();
  assert.ok(data.auditEvents.length > 0);
  assert.ok(data.auditEvents.every((event) => event.cryptographicImmutabilityClaim === false));
  assert.match(data.immutabilityNotice.en, /append-oriented/i);
  // Reference chain integrity
  for (let index = 1; index < data.auditEvents.length; index += 1) {
    assert.equal(data.auditEvents[index].previousEventId, data.auditEvents[index - 1].id);
  }
});

/* -------------------------------- transition ------------------------------- */

test("transition separates the 180-day phase from the 2-3 year horizon", async () => {
  const { data } = await (await fetch(`${baseUrl}/api/v1/transition`)).json();
  const emergency = data.stages.filter((stage) => stage.horizonKey === "emergency-180d");
  const transition = data.stages.filter((stage) => stage.horizonKey === "transition-2-3y");
  assert.ok(emergency.length > 0);
  assert.ok(transition.length > 0);
  assert.equal(emergency.length + transition.length + data.stages.filter((s) => s.horizonKey === "constitutional-longterm").length, data.stages.length);
  assert.equal(data.metrics.dependenciesValid, true);
  assert.ok(data.stages.every((stage) => typeof stage.epistemicStatus === "string"));
  assert.match(data.disclaimer.fa, /۱۸۰ روزه/);
});

test("transition metrics count milestones from the fixtures", async () => {
  const { data } = await (await fetch(`${baseUrl}/api/v1/transition`)).json();
  const expected = data.stages.reduce((sum, stage) => sum + stage.milestones.length, 0);
  assert.equal(data.metrics.totalMilestones, expected);
});

/* -------------------------------- archive --------------------------------- */

test("archive exposes only deceased synthetic dossiers", async () => {
  const { data } = await (await fetch(`${baseUrl}/api/v1/archive`)).json();
  assert.equal(data.counts.living, 0);
  assert.equal(data.counts.total, data.counts.synthetic);
  assert.ok(data.results.length > 0);
  assert.ok(data.results.every((dossier) => dossier.status === "deceased"));
  assert.ok(data.results.every((dossier) => dossier.epistemicStatus === "synthetic-fixture"));
  assert.equal(data.schema.requiredColumns, 77);
});

test("dossier dates keep each year glued to its calendar", async () => {
  // These strings sit in a narrow card and wrap. A space between the year and
  // "خورشیدی"/"میلادی" leaves the unit orphaned on the next line ("... / 1924"
  // ending a line), so the pair is joined with a non-breaking space.
  const { data } = await (await fetch(`${baseUrl}/api/v1/archive`)).json();
  const displays = data.results.flatMap((dossier) => [dossier.birth, dossier.death]);
  assert.ok(displays.length > 0);
  for (const display of displays) {
    assert.doesNotMatch(display.fa, /[۰-۹] (خورشیدی|میلادی)/);
    assert.doesNotMatch(display.en, /\d (SH|CE)/);
    assert.match(display.fa, /\u00a0(خورشیدی|میلادی)/);
  }
});

test("archive supports bilingual search across Persian and English names", async () => {
  const fa = await (await fetch(`${baseUrl}/api/v1/archive?q=${encodeURIComponent("کاشانی")}`)).json();
  assert.ok(fa.data.results.length >= 1);
  assert.equal(fa.data.results[0].id, "SYN-HIST-001");

  const en = await (await fetch(`${baseUrl}/api/v1/archive?q=Nishaburi`)).json();
  assert.ok(en.data.results.length >= 1);
  assert.equal(en.data.results[0].id, "SYN-HIST-002");

  // Arabic yeh/kaf and ZWNJ tolerance
  const arabicYeh = await (await fetch(`${baseUrl}/api/v1/archive?q=${encodeURIComponent("نيشابوري")}`)).json();
  assert.ok(arabicYeh.data.results.length >= 1);
});

test("archive filters by era, discipline and region", async () => {
  const medicine = await (await fetch(`${baseUrl}/api/v1/archive?field=medicine`)).json();
  assert.ok(medicine.data.results.every((dossier) => dossier.discipline.id === "medicine"));

  const khorasan = await (await fetch(`${baseUrl}/api/v1/archive?region=khorasan`)).json();
  assert.ok(khorasan.data.results.every((dossier) => dossier.region.id === "khorasan"));

  const constitutional = await (await fetch(`${baseUrl}/api/v1/archive?era=constitutional`)).json();
  assert.ok(constitutional.data.results.every((dossier) => dossier.period.id === "constitutional"));
});

test("archive rejects unknown filter values instead of silently ignoring them", async () => {
  for (const query of ["era=invented", "field=invented", "region=invented"]) {
    const response = await fetch(`${baseUrl}/api/v1/archive?${query}`);
    assert.equal(response.status, 400, query);
    const body = await response.json();
    assert.equal(body.error, "invalid_filter");
  }
});

test("dossier detail includes citations, conflicts and revision history", async () => {
  const response = await fetch(`${baseUrl}/api/v1/archive/SYN-HIST-001`);
  assert.equal(response.status, 200);
  const { data } = await response.json();
  assert.equal(data.dossier.id, "SYN-HIST-001");
  assert.ok(data.dossier.citations.length > 0);
  assert.ok(data.dossier.conflictingAccounts.length > 0);
  assert.ok(data.dossier.revisionHistory.length > 0);
  assert.ok(data.dossier.flags.length > 0);
  assert.equal(data.dossier.status, "deceased");
});

test("unknown dossier ids return 404 without leaking internals", async () => {
  const response = await fetch(`${baseUrl}/api/v1/archive/SYN-HIST-999`);
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: "dossier_not_found" });
});

test("csv gate report proves zero living rows and a closed publication gate", async () => {
  const report = getCsvGateReport();
  assert.equal(report.schemaValid, true);
  assert.equal(report.livingRows, 0);
  assert.equal(report.highReidentificationRows, 0);
  assert.equal(report.publicationGatePassed, false);
  assert.ok(report.rowCount >= 3);
});

test("queryArchive rejects a non-existent era programmatically", () => {
  const result = queryArchive({ era: "invalid-era" });
  assert.equal(result.ok, false);
  assert.equal(result.errors[0].field, "era");
});

/* --------------------------------- evidence -------------------------------- */

test("every claim resolves to a registered source", async () => {
  const { data } = await (await fetch(`${baseUrl}/api/v1/evidence`)).json();
  const sourceIds = new Set(data.sources.map((source) => source.id));
  assert.ok(data.claims.length > 0);
  for (const claim of data.claims) {
    assert.ok(sourceIds.has(claim.sourceDocumentId), `${claim.id} → ${claim.sourceDocumentId}`);
    assert.ok(claim.sourceVersion);
    assert.ok(claim.pageOrSection);
    assert.ok(claim.reviewerStatus);
    assert.ok(claim.confidence.fa && claim.confidence.en);
    assert.ok(Array.isArray(claim.revisionHistory) && claim.revisionHistory.length > 0);
  }
});

test("provenance validation reports every claim as valid", async () => {
  const { data } = await (await fetch(`${baseUrl}/api/v1/sources`)).json();
  assert.ok(data.validationSummary.length > 0);
  assert.ok(data.validationSummary.every((summary) => summary.allValid), JSON.stringify(data.validationSummary));
});

test("contradiction explorer surfaces disputed claims", async () => {
  const { data } = await (await fetch(`${baseUrl}/api/v1/evidence`)).json();
  assert.ok(data.contradictionPairs.length > 0);
  for (const pair of data.contradictionPairs) {
    assert.ok(pair.contradictions.length > 0);
    assert.ok(pair.contradictions.every((item) => typeof item.with === "string"));
  }
});

test("unresolved questions exist and are never marked resolved", async () => {
  const { data } = await (await fetch(`${baseUrl}/api/v1/evidence`)).json();
  assert.ok(data.unresolvedQuestions.length >= 5);
  assert.ok(data.unresolvedQuestions.every((question) => question.status !== "resolved"));
});

/* -------------------------------- assurance -------------------------------- */

test("band one actions are open with no account or proof", async () => {
  const response = await fetch(`${baseUrl}/api/v1/verification/evaluate?action=VIEW-PUBLIC-DOCS`);
  assert.equal(response.status, 200);
  const { data } = await response.json();
  assert.equal(data.evaluation.decision, "ALLOW");
  assert.equal(data.evaluation.minimumBandRequired, 1);
});

test("higher bands alone do not unlock a scoped action", async () => {
  const response = await fetch(`${baseUrl}/api/v1/verification/evaluate?action=REVIEW-DRAFT-DOSSIER&band=5`);
  const { data } = await response.json();
  assert.equal(data.evaluation.decision, "DENY_INSUFFICIENT_ASSURANCE");
  assert.ok(data.evaluation.missingProofs.includes("org_role_contract"));
});

test("scoped action is allowed only with the correct purpose-bound proof", async () => {
  const response = await fetch(
    `${baseUrl}/api/v1/verification/evaluate?action=REVIEW-DRAFT-DOSSIER&band=4&proofs=org_role_contract`
  );
  const { data } = await response.json();
  assert.equal(data.evaluation.decision, "ALLOW_SCOPED_SIMULATION");
  assert.equal(data.evaluation.minimumBandRequired, 4);
  assert.ok(data.evaluation.separationOfConcerns.audit);
});

test("prohibited actions are refused even at band five", async () => {
  for (const action of [
    "ACCESS-LIVING-PERSON-DATA",
    "CAST-BINDING-VOTE",
    "ASSIGN-SOCIAL-CREDIT",
    "GENERATE-POSTHUMOUS-VOICE"
  ]) {
    const response = await fetch(`${baseUrl}/api/v1/verification/evaluate?action=${action}&band=5`);
    const { data } = await response.json();
    assert.equal(data.evaluation.decision, "PROHIBITED_BY_CHARTER", action);
  }
});

test("telegram, location and social-credit proofs are flagged as rejected", async () => {
  const response = await fetch(
    `${baseUrl}/api/v1/verification/evaluate?action=SUBMIT-PUBLIC-COMMENT&band=3&proofs=telegram_citizenship,ai_location_photo_challenge,social_credit_score,selective_credential`
  );
  const { data } = await response.json();
  const codes = data.evaluation.rejectedProofWarnings.map((warning) => warning.code).sort();
  assert.deepEqual(codes, [
    "REJECTED_AI_LOCATION_CHALLENGE",
    "REJECTED_SOCIAL_CREDIT",
    "REJECTED_TELEGRAM_CITIZENSHIP"
  ]);
});

test("verification evaluation validates its own input", async () => {
  const missing = await fetch(`${baseUrl}/api/v1/verification/evaluate`);
  assert.equal(missing.status, 400);

  const badBand = await fetch(`${baseUrl}/api/v1/verification/evaluate?action=VIEW-PUBLIC-DOCS&band=9`);
  assert.equal(badBand.status, 400);

  const unknown = await fetch(`${baseUrl}/api/v1/verification/evaluate?action=NOPE`);
  const { data } = await unknown.json();
  assert.equal(data.evaluation.decision, "DENY");
  assert.equal(data.evaluation.code, "UNKNOWN_ACTION");
});

/* ------------------------------ public services ---------------------------- */

test("public service directory claims no integration and no live probing", async () => {
  const { data } = await (await fetch(`${baseUrl}/api/v1/public-services`)).json();
  assert.equal(data.directoryState.integrationType, "static-public-links-only");
  assert.equal(data.directoryState.liveApiEnumerationPerformed, false);
  assert.equal(data.directoryState.harCapturePerformed, false);
  assert.equal(data.directoryState.iframeEmbeddingUsed, false);
  assert.equal(data.directoryState.verifiedEntries, 0);
  assert.ok(data.services.every((service) => service.integrationClaim === false));
  assert.ok(data.services.every((service) => service.url.startsWith("https://") || service.url.startsWith("tel:")));
});

/* --------------------------------- projects -------------------------------- */

test("no public-good project grants governance privilege", async () => {
  const { data } = await (await fetch(`${baseUrl}/api/v1/projects`)).json();
  assert.ok(data.projects.length > 0);
  assert.ok(data.projects.every((project) => project.governancePrivilegeGranted === false));
  assert.equal(data.incentivePolicy.governancePurchasable, false);
  assert.equal(data.incentivePolicy.weightedVoting, false);
  assert.equal(data.incentivePolicy.financialInfluence, false);
});

/* -------------------------------- simulations ------------------------------ */

test("institutional design lab presents hypothetical models only", async () => {
  const { data } = await (await fetch(`${baseUrl}/api/v1/simulations`)).json();
  assert.equal(data.models.length, 4);
  assert.ok(data.models.every((model) => model.epistemicStatus === "hypothetical"));
  assert.equal(data.parameters.length, 4);
  assert.ok(data.defaultProfile.indicators.length > 0);
});

test("safeguard evaluation is deterministic and bounded", async () => {
  const a = await (await fetch(`${baseUrl}/api/v1/simulations/evaluate?sunsetDays=60&reviewIntervalDays=30&supermajority=75&decentralization=50`)).json();
  const b = await (await fetch(`${baseUrl}/api/v1/simulations/evaluate?sunsetDays=60&reviewIntervalDays=30&supermajority=75&decentralization=50`)).json();
  assert.deepEqual(a.data.profile.indicators, b.data.profile.indicators);
  assert.ok(a.data.profile.indicators.every((indicator) => indicator.value >= 0 && indicator.value <= 100));
  assert.equal(a.data.illustrativeOnly, true);
});

test("safeguard evaluation rejects out-of-range parameters", async () => {
  for (const query of [
    "sunsetDays=800",
    "reviewIntervalDays=0",
    "supermajority=10",
    "decentralization=95",
    "sunsetDays=abc"
  ]) {
    const response = await fetch(`${baseUrl}/api/v1/simulations/evaluate?${query}`);
    assert.equal(response.status, 400, query);
  }
});

/* ------------------------------- digital legacy ---------------------------- */

test("digital legacy is separated from the archive and forbids simulation", async () => {
  const { data } = await (await fetch(`${baseUrl}/api/v1/digital-legacy`)).json();
  assert.equal(data.archiveSeparation.mergedAtAnyPoint, false);
  assert.equal(data.archiveSeparation.archiveIsDeceasedOnly, true);
  assert.equal(data.clauses.length, 7);
  assert.ok(data.hardProhibitions.length >= 3);
  assert.ok(data.hardProhibitions.some((item) => /voice|صدا/i.test(item.en + item.fa)));
  const forbidden = data.consentMatrix.filter((row) => row.allowed === false).map((row) => row.scenario.en);
  assert.ok(forbidden.some((scenario) => /voice/i.test(scenario)));
  assert.ok(forbidden.some((scenario) => /vote/i.test(scenario)));
});

/* --------------------------------- search ---------------------------------- */

test("global search spans multiple modules and is empty for blank queries", async () => {
  const blank = await (await fetch(`${baseUrl}/api/v1/search?q=`)).json();
  assert.equal(blank.data.total, 0);

  const persian = await (await fetch(`${baseUrl}/api/v1/search?q=${encodeURIComponent("پرونده")}`)).json();
  const modules = new Set(persian.data.results.map((result) => result.module));
  assert.ok(modules.size >= 2, `expected multiple modules, got ${[...modules]}`);

  const english = await (await fetch(`${baseUrl}/api/v1/search?q=telegram`)).json();
  assert.ok(english.data.results.some((result) => result.module === "research"));
});

test("globalSearch helper is pure and case-insensitive", () => {
  const lower = globalSearch("nishaburi").total;
  const upper = globalSearch("NISHABURI").total;
  assert.equal(lower, upper);
  assert.ok(lower >= 1);
});

/* -------------------------------- hardening -------------------------------- */

test("malformed query parameters are rejected with 400", async () => {
  const responses = await Promise.all([
    fetch(`${baseUrl}/api/v1/archive?q=${"a".repeat(300)}`),
    fetch(`${baseUrl}/api/v1/archive?__proto__=x`),
    fetch(`${baseUrl}/api/v1/search?q=${encodeURIComponent("<script>alert(1)</script>")}`),
    fetch(`${baseUrl}/api/v1/archive?bad%20key=1`)
  ]);
  for (const response of responses) {
    assert.equal(response.status, 400);
  }
});

test("responses carry defensive headers and no cookies", async () => {
  const response = await fetch(`${baseUrl}/api/v1/dashboard`);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("referrer-policy"), "no-referrer");
  assert.equal(response.headers.get("cross-origin-resource-policy"), "same-origin");
  assert.equal(response.headers.get("set-cookie"), null);
});

test("parseQuery accepts Persian text and rejects control characters", () => {
  const ok = parseQuery(new URLSearchParams("q=%DA%A9%D8%A7%D8%B4%D8%A7%D9%86%DB%8C"));
  assert.equal(ok.ok, true);
  assert.equal(ok.params.q, "کاشانی");

  const control = parseQuery(new URLSearchParams({ q: "a\u0007b" }));
  assert.equal(control.ok, false);

  const tooLong = parseQuery(new URLSearchParams({ q: "x".repeat(200) }));
  assert.equal(tooLong.ok, false);
  assert.equal(tooLong.error, "query_too_long");
});

test("no endpoint exposes a living-person identifier or hash field", async () => {
  const bodies = await Promise.all(
    MODULE_ROUTES.map(async (route) => (await fetch(`${baseUrl}${route}`)).text())
  );
  for (const body of bodies) {
    assert.doesNotMatch(body, /existence_dossiers_living/);
    assert.doesNotMatch(body, /full_name_living/i);
    assert.doesNotMatch(body, /"status"\s*:\s*"living"/);
    assert.doesNotMatch(body, /\b(?:national_id|social_security_number|biometric_template)\b/i);
  }
});
