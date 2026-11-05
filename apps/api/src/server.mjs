import { createServer as createHttpServer } from "node:http";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { demoPayload } from "./content.mjs";
import { buildDashboard, moduleRegistry } from "./data/dashboard.mjs";
import { constitutionalPrinciples, governanceLayers, charterAmendments, accountabilityRecords, publicGoodProjects, institutionalDesignModels, safeguardParameters, digitalLegacyClauses, digitalLegacyConsentMatrix } from "./data/governance.mjs";
import { transitionHorizons, transitionStages, institutions, institutionalRelationships, publicServices, publicServiceSafetyBoundaries } from "./data/iran.mjs";
import { archiveBoundary, archivePeriods, archiveDisciplines, archiveRegions, archiveDossiers, archiveSyntheticSources, editorialWorkflow } from "./data/archive.mjs";
import { sourceDocuments, evidenceClaims, unresolvedQuestions } from "./data/evidence.mjs";
import { verificationBands, accessPolicies, rejectedProofCatalogue } from "./data/assurance.mjs";
import { buildLevelDashboard, buildLevelsIndex, buildInfluenceOverview, buildInfluenceGuards, authorizeAction } from "./data/civic-levels.mjs";
import { evaluateAssurancePolicy, validateClaimProvenance, calculateTimelineMetrics, validateHistoricalDossierCsv, computeSafeguardProfile } from "@cep/schemas";
import { matchesBilingualQuery, normalizeSearchText } from "@cep/localization";

const HERE = dirname(fileURLToPath(import.meta.url));
const SAMPLE_CSV_PATH = resolve(HERE, "../../../data/synthetic/synthetic-deceased-archive-sample.csv");

const SCHEMA_VERSION = "1.0.0";
const MAX_QUERY_LENGTH = 120;

const EPISTEMIC_NOTICE = {
  fa: "همهٔ محتوا ساختگی، پیشنهادی یا ارجاعی است. هیچ ادعای تأییدشده‌ای دربارهٔ افراد، نهادها یا روندهای واقعی مطرح نمی‌شود.",
  en: "All content is synthetic, proposed, or referential. No verified claim about real people, institutions, or processes is made."
};

function sendJson(response, statusCode, payload, extraHeaders = {}) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Cross-Origin-Resource-Policy": "same-origin",
    ...extraHeaders
  });
  response.end(JSON.stringify(payload));
}

function envelope(data, meta = {}) {
  return {
    mode: "synthetic-demo",
    schemaVersion: SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    epistemicNotice: EPISTEMIC_NOTICE,
    data,
    ...meta
  };
}

/**
 * Validates and sanitizes a raw query string.
 * Returns { ok, params } or { ok: false, error } with zero internal detail leakage.
 */
export function parseQuery(searchParams) {
  const params = {};
  for (const [key, rawValue] of searchParams.entries()) {
    if (!/^[a-zA-Z][a-zA-Z0-9_-]{0,31}$/.test(key)) {
      return { ok: false, error: "invalid_query_parameter" };
    }
    if (rawValue.length > MAX_QUERY_LENGTH) {
      return { ok: false, error: "query_too_long" };
    }
    // Reject control characters and common injection probes; allow Persian text.
    if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(rawValue)) {
      return { ok: false, error: "invalid_characters" };
    }
    if (/(<script|javascript:|\$where|__proto__|constructor\[)/i.test(rawValue)) {
      return { ok: false, error: "invalid_characters" };
    }
    params[key] = rawValue.trim();
  }
  return { ok: true, params };
}

function pickBilingual(text) {
  return text;
}

/* ------------------------------------------------------------------ *
 * Archive querying (Module 05)
 * ------------------------------------------------------------------ */
export function queryArchive(params) {
  const q = params.q ?? "";
  const era = params.era ?? "all";
  const field = params.field ?? "all";
  const region = params.region ?? "all";
  const flagsOnly = params.flags === "1" || params.flags === "true";

  const validEras = new Set(["all", ...archivePeriods.map((p) => p.id)]);
  const validFields = new Set(["all", ...archiveDisciplines.map((d) => d.id)]);
  const validRegions = new Set(["all", ...archiveRegions.map((r) => r.id)]);

  const errors = [];
  if (!validEras.has(era)) errors.push({ field: "era", allowed: [...validEras] });
  if (!validFields.has(field)) errors.push({ field: "field", allowed: [...validFields] });
  if (!validRegions.has(region)) errors.push({ field: "region", allowed: [...validRegions] });
  if (errors.length > 0) return { ok: false, errors };

  const results = archiveDossiers.filter((dossier) => {
    if (era !== "all" && dossier.period.id !== era) return false;
    if (field !== "all" && dossier.discipline.id !== field && !dossier.secondaryDisciplines.some((s) => s.id === field)) return false;
    if (region !== "all" && dossier.region.id !== region) return false;
    if (flagsOnly && dossier.flags.length === 0) return false;
    if (!q) return true;

    const haystack = [
      dossier.name.fa,
      dossier.name.en,
      ...dossier.alternateNames.flatMap((n) => [n.fa, n.en]),
      ...dossier.majorWorks.flatMap((w) => [w.title.fa, w.title.en]),
      ...dossier.tags,
      ...dossier.occupations.flatMap((o) => [o.fa, o.en]),
      dossier.biography.fa,
      dossier.biography.en,
      dossier.region.label.fa,
      dossier.region.label.en,
      dossier.discipline.label.fa,
      dossier.discipline.label.en
    ];
    return matchesBilingualQuery(q, haystack);
  });

  const summaries = results.map((d) => ({
    id: d.id,
    name: d.name,
    alternateNames: d.alternateNames,
    status: d.status,
    period: d.period,
    discipline: d.discipline,
    region: d.region,
    birth: d.birth.display,
    death: d.death.display,
    occupations: d.occupations,
    worksCount: d.majorWorks.length,
    citationsCount: d.citations.length,
    conflictCount: d.conflictingAccounts.length,
    openFlags: d.flags.filter((f) => f.status === "open").length,
    editorialReview: d.editorialReview,
    syntheticLabel: d.syntheticLabel,
    epistemicStatus: d.epistemicStatus,
    tags: d.tags
  }));

  return {
    ok: true,
    data: {
      boundary: archiveBoundary,
      filters: {
        periods: archivePeriods,
        disciplines: archiveDisciplines,
        regions: archiveRegions,
        applied: { q, era, field, region, flagsOnly }
      },
      results: summaries,
      counts: {
        total: archiveDossiers.length,
        matched: summaries.length,
        synthetic: archiveDossiers.filter((d) => d.epistemicStatus === "synthetic-fixture").length,
        living: 0
      },
      editorialWorkflow,
      syntheticSources: archiveSyntheticSources,
      schema: {
        requiredColumns: 77,
        validatorScript: "scripts/validation/validate-historical-csv.mjs"
      }
    }
  };
}

/* ------------------------------------------------------------------ *
 * 77-column CSV gate report (Module 05 integrity panel)
 * ------------------------------------------------------------------ */
let cachedGateReport = null;
export function getCsvGateReport() {
  if (cachedGateReport) return cachedGateReport;
  let report;
  try {
    const csv = readFileSync(SAMPLE_CSV_PATH, "utf8");
    const result = validateHistoricalDossierCsv(csv, {
      hasPublicationLicenseConfirmation: false,
      hasHumanEditorialSignOff: false
    });
    report = {
      file: "data/synthetic/synthetic-deceased-archive-sample.csv",
      schemaValid: result.valid,
      rowCount: result.rowCount,
      livingRows: result.stats.livingRowCount,
      highReidentificationRows: result.stats.highReidentificationCount,
      missingCitationRows: result.stats.missingSourceHintCount,
      publicationGatePassed: result.publicationGatePassed,
      warnings: result.warnings,
      errors: result.errors,
      gateState: result.publicationGatePassed
        ? { fa: "باز — مجوز و بازبینی انسانی ثبت شده است.", en: "Open — licence and human review are recorded." }
        : { fa: "بسته — مجوز بازنشر و بازبینی انسانی انسانی ثبت نشده است.", en: "Closed — no republication licence or human sign-off is recorded." }
    };
  } catch {
    report = {
      file: "data/synthetic/synthetic-deceased-archive-sample.csv",
      schemaValid: false,
      rowCount: 0,
      livingRows: 0,
      highReidentificationRows: 0,
      missingCitationRows: 0,
      publicationGatePassed: false,
      warnings: [],
      errors: ["fixture_unavailable"],
      gateState: { fa: "قابل محاسبه نیست.", en: "Not computable." }
    };
  }
  cachedGateReport = report;
  return report;
}

/* ------------------------------------------------------------------ *
 * Cross-module search
 * ------------------------------------------------------------------ */
export function globalSearch(query) {
  const q = query ?? "";
  if (!normalizeSearchText(q)) {
    return { query: q, total: 0, results: [] };
  }

  const results = [];

  for (const dossier of archiveDossiers) {
    const haystack = [
      dossier.name.fa,
      dossier.name.en,
      ...dossier.alternateNames.flatMap((n) => [n.fa, n.en]),
      ...dossier.majorWorks.flatMap((w) => [w.title.fa, w.title.en]),
      ...dossier.tags,
      ...dossier.occupations.flatMap((o) => [o.fa, o.en]),
      dossier.period.label.fa,
      dossier.period.label.en,
      dossier.discipline.label.fa,
      dossier.discipline.label.en,
      dossier.region.label.fa,
      dossier.region.label.en,
      dossier.biography.fa,
      dossier.biography.en
    ];
    if (matchesBilingualQuery(q, haystack)) {
      results.push({
        module: "historical-archive",
        moduleNumber: 5,
        kind: { fa: "پروندهٔ ساختگی", en: "Synthetic dossier" },
        id: dossier.id,
        title: dossier.name,
        subtitle: { fa: `${dossier.period.label.fa} · ${dossier.discipline.label.fa}`, en: `${dossier.period.label.en} · ${dossier.discipline.label.en}` },
        epistemicStatus: dossier.epistemicStatus,
        target: { view: "historical-archive", recordId: dossier.id }
      });
    }
  }

  for (const institution of institutions) {
    const haystack = [
      institution.name.fa,
      institution.name.en,
      institution.purpose.fa,
      institution.purpose.en,
      ...institution.responsibilities.flatMap((r) => [r.fa, r.en])
    ];
    if (matchesBilingualQuery(q, haystack)) {
      results.push({
        module: "institutions",
        moduleNumber: 4,
        kind: { fa: "نهاد پیشنهادی", en: "Proposed institution" },
        id: institution.id,
        title: institution.name,
        subtitle: { fa: institution.category, en: institution.category },
        epistemicStatus: institution.epistemicStatus,
        target: { view: "institutions", recordId: institution.id }
      });
    }
  }

  for (const claim of evidenceClaims) {
    const haystack = [claim.claim.fa, claim.claim.en, claim.id, claim.classification];
    if (matchesBilingualQuery(q, haystack)) {
      results.push({
        module: "research",
        moduleNumber: 6,
        kind: { fa: "ادعا با زنجیرهٔ منشأ", en: "Claim with provenance" },
        id: claim.id,
        title: claim.claim,
        subtitle: { fa: `منبع ${claim.sourceDocumentId} · ${claim.pageOrSection}`, en: `Source ${claim.sourceDocumentId} · ${claim.pageOrSection}` },
        epistemicStatus: claim.verificationStatus,
        target: { view: "research", recordId: claim.id }
      });
    }
  }

  for (const principle of constitutionalPrinciples) {
    const haystack = [principle.title.fa, principle.title.en, principle.body.fa, principle.body.en];
    if (matchesBilingualQuery(q, haystack)) {
      results.push({
        module: "governance",
        moduleNumber: 2,
        kind: { fa: `اصل ${principle.number}`, en: `Principle ${principle.number}` },
        id: principle.id,
        title: principle.title,
        subtitle: { fa: "منشور پیش‌نویس", en: "Draft charter" },
        epistemicStatus: principle.epistemicStatus,
        target: { view: "governance", recordId: principle.id }
      });
    }
  }

  for (const stage of transitionStages) {
    const haystack = [stage.title.fa, stage.title.en, stage.summary.fa, stage.summary.en];
    if (matchesBilingualQuery(q, haystack)) {
      results.push({
        module: "transition",
        moduleNumber: 3,
        kind: { fa: "مرحلهٔ گذار", en: "Transition stage" },
        id: stage.id,
        title: stage.title,
        subtitle: { fa: stage.horizonKey, en: stage.horizonKey },
        epistemicStatus: stage.epistemicStatus,
        target: { view: "transition", recordId: stage.id }
      });
    }
  }

  for (const service of publicServices) {
    const haystack = [service.title.fa, service.title.en, service.description.fa, service.description.en, service.category];
    if (matchesBilingualQuery(q, haystack)) {
      results.push({
        module: "public-services",
        moduleNumber: 9,
        kind: { fa: "خدمت عمومی (تأییدنشده)", en: "Public service (unverified)" },
        id: service.id,
        title: service.title,
        subtitle: { fa: service.url, en: service.url },
        epistemicStatus: service.epistemicStatus,
        target: { view: "public-services", recordId: service.id }
      });
    }
  }

  for (const project of publicGoodProjects) {
    const haystack = [project.title.fa, project.title.en, project.objectives.fa, project.objectives.en];
    if (matchesBilingualQuery(q, haystack)) {
      results.push({
        module: "projects",
        moduleNumber: 10,
        kind: { fa: "پروژهٔ نفع عمومی", en: "Public-good project" },
        id: project.id,
        title: project.title,
        subtitle: { fa: project.workstream, en: project.workstream },
        epistemicStatus: project.reviewStatus === "verified" ? "source-verified" : "proposed",
        target: { view: "projects", recordId: project.id }
      });
    }
  }

  for (const clause of digitalLegacyClauses) {
    const haystack = [clause.title.fa, clause.title.en, clause.summary.fa, clause.summary.en];
    if (matchesBilingualQuery(q, haystack)) {
      results.push({
        module: "digital-legacy",
        moduleNumber: 12,
        kind: { fa: `بند ${clause.clauseNumber} اصل ۲۰`, en: `Principle 20 clause ${clause.clauseNumber}` },
        id: clause.id,
        title: clause.title,
        subtitle: { fa: "میراث دیجیتال", en: "Digital legacy" },
        epistemicStatus: clause.epistemicStatus,
        target: { view: "digital-legacy", recordId: clause.id }
      });
    }
  }

  for (const source of sourceDocuments) {
    const haystack = [source.title.fa, source.title.en, source.id, source.authorOrIssuer.fa, source.authorOrIssuer.en];
    if (matchesBilingualQuery(q, haystack)) {
      results.push({
        module: "research",
        moduleNumber: 6,
        kind: { fa: "سند منبع", en: "Source document" },
        id: source.id,
        title: source.title,
        subtitle: { fa: `${source.id} · ${source.version}`, en: `${source.id} · ${source.version}` },
        epistemicStatus: source.verificationStatus,
        target: { view: "research", recordId: source.id }
      });
    }
  }

  return { query: q, total: results.length, results };
}

/* ------------------------------------------------------------------ *
 * Route table
 * ------------------------------------------------------------------ */
function routeTable(params, pathname) {
  switch (pathname) {
    case "/api/v1/dashboard":
      return { status: 200, body: envelope(buildDashboard()) };

    case "/api/v1/modules":
      return { status: 200, body: envelope({ modules: moduleRegistry }) };

    case "/api/v1/governance":
      return {
        status: 200,
        body: envelope({
          constitutionalPosture: {
            isGovernment: false,
            isElectionAuthority: false,
            hasPublicMandate: false,
            ratificationStatus: "none-recorded",
            notice: {
              fa: "منشور CEP پیش‌نویس است. هیچ رأی، نصاب یا تصویبی برای آن ثبت نشده و هیچ مقامی منصوب نمی‌کند.",
              en: "The CEP charter is a draft. No vote, quorum, or ratification is recorded, and it appoints no official."
            }
          },
          principles: constitutionalPrinciples,
          layers: governanceLayers,
          amendments: charterAmendments,
          separationOfPowers: {
            described: [
              { fa: "قانون‌گذاری", en: "Rule-making" },
              { fa: "اجرا", en: "Execution" },
              { fa: "نظارت قضایی", en: "Judicial review" },
              { fa: "حسابرسی مستقل", en: "Independent audit" }
            ],
            note: {
              fa: "این تفکیک یک طرح پیشنهادی است، نه ساختار موجود.",
              en: "This separation is a proposal, not an existing structure."
            }
          },
          decisionHistory: accountabilityRecords.auditEvents.filter((e) => e.actionType.includes("amendment")),
          deliberationDemo: {
            isReal: false,
            notice: {
              fa: "این یک نمایش رابط است؛ هیچ نظر واقعی ثبت نمی‌شود و هیچ شمارش آرا یا حمایتی ساخته نمی‌شود.",
              en: "This is an interface demonstration; no real comment is stored and no vote or support tally is produced."
            },
            sampleQuestions: [
              { fa: "آیا شرط خاتمه برای همهٔ اختیارات اضطراری الزامی باشد؟", en: "Should a sunset clause be mandatory for all emergency authorities?" },
              { fa: "آستانهٔ بازبینی مستقل چگونه تعیین شود؟", en: "How should the independent review threshold be set?" }
            ]
          }
        })
      };

    case "/api/v1/transition": {
      const metrics = calculateTimelineMetrics(transitionStages);
      return {
        status: 200,
        body: envelope({
          horizons: transitionHorizons,
          stages: transitionStages,
          metrics,
          disclaimer: {
            fa: "افق ۱۸۰ روزه و افق ۲ تا ۳ ساله دو چیز جداگانه‌اند. هیچ تاریخ انتخاباتی، تقویم اجرایی یا پیش‌بینی قطعی ارائه نمی‌شود.",
            en: "The 180-day phase and the 2–3 year horizon are distinct. No election date, execution calendar, or definitive forecast is offered."
          }
        })
      };
    }

    case "/api/v1/institutions":
      return {
        status: 200,
        body: envelope({
          institutions,
          relationships: institutionalRelationships,
          notice: {
            fa: "هیچ نهادی در این فهرست وجود خارجی، بودجه یا اختیار قانونی ندارد. همه پیشنهادی یا ساختگی‌اند.",
            en: "No institution in this list has real existence, budget, or legal authority. All are proposed or synthetic."
          }
        })
      };

    case "/api/v1/archive": {
      const result = queryArchive(params);
      if (!result.ok) {
        return { status: 400, body: { error: "invalid_filter", details: result.errors } };
      }
      return { status: 200, body: envelope({ ...result.data, gate: getCsvGateReport() }) };
    }

    case "/api/v1/sources":
      return {
        status: 200,
        body: envelope({
          sources: sourceDocuments,
          provenanceRules: [
            { fa: "هر ادعا باید به سند، نسخه، بخش و وضعیت بازبینی متصل باشد.", en: "Every claim must link to a document, version, section, and review status." },
            { fa: "تکرار یک ادعا هرگز آن را تأییدشده نمی‌کند.", en: "Repetition of a claim never makes it verified." },
            { fa: "تناقض‌ها حذف نمی‌شوند؛ نمایش داده می‌شوند.", en: "Contradictions are not removed; they are displayed." }
          ],
          validationSummary: sourceDocuments.map((source) => {
            const checks = evidenceClaims
              .filter((claim) => claim.sourceDocumentId === source.id)
              .map((claim) => ({ claimId: claim.id, ...validateClaimProvenance(claim, new Set(sourceDocuments.map((s) => s.id))) }));
            return {
              sourceId: source.id,
              claimsChecked: checks.length,
              allValid: checks.every((c) => c.valid),
              errors: checks.flatMap((c) => c.errors)
            };
          })
        })
      };

    case "/api/v1/evidence":
      return {
        status: 200,
        body: envelope({
          claims: evidenceClaims,
          sources: sourceDocuments,
          unresolvedQuestions,
          contradictionPairs: evidenceClaims
            .filter((claim) => claim.knownContradictions.length > 0)
            .map((claim) => ({
              claimId: claim.id,
              claim: claim.claim,
              verificationStatus: claim.verificationStatus,
              contradictions: claim.knownContradictions
            }))
        })
      };

    case "/api/v1/verification": {
      return {
        status: 200,
        body: envelope({
          bands: verificationBands,
          policies: accessPolicies,
          rejectedProofs: rejectedProofCatalogue,
          simulationNotice: {
            fa: "این شبیه‌ساز فقط منطق سیاست را نشان می‌دهد. هیچ هویت، گواهی یا نشست واقعی ایجاد نمی‌شود و هیچ دادهٔ شخصی ارسال نمی‌گردد.",
            en: "This simulator only demonstrates policy logic. No real identity, credential, or session is created and no personal data is submitted."
          },
          guards: [
            { fa: "سطوح، مجوز کنش می‌دهند؛ نه رتبهٔ افراد.", en: "Bands authorize actions, not people." },
            { fa: "سطح بالاتر بدون گواهی مرتبط، مجوز ایجاد نمی‌کند.", en: "A higher band alone grants nothing without the relevant proof." },
            { fa: "دسترسی به دادهٔ افراد زنده، رأی الزام‌آور، امتیاز اجتماعی و تولید صدای فرد فوت‌شده ممنوع مطلق‌اند.", en: "Access to living-person data, binding votes, social-credit scores, and deceased-voice generation are absolutely prohibited." }
          ]
        })
      };
    }

    case "/api/v1/verification/evaluate": {
      if (!params.action) {
        return { status: 400, body: { error: "missing_action_parameter", hint: "action=<policyId>" } };
      }
      const band = params.band === undefined ? 1 : Number(params.band);
      if (!Number.isInteger(band) || band < 1 || band > 5) {
        return { status: 400, body: { error: "invalid_band", allowed: [1, 2, 3, 4, 5] } };
      }
      const proofs = (params.proofs ?? "").split(",").map((p) => p.trim()).filter(Boolean);
      if (proofs.length > 8) {
        return { status: 400, body: { error: "too_many_proofs" } };
      }
      const evaluation = evaluateAssurancePolicy(accessPolicies, {
        actionId: params.action,
        presentedBand: band,
        presentedProofs: proofs
      });
      return {
        status: 200,
        body: envelope({
          request: { actionId: params.action, presentedBand: band, presentedProofs: proofs },
          evaluation,
          simulationOnly: true
        })
      };
    }

    case "/api/v1/levels":
      return {
        status: 200,
        body: envelope({
          ...buildLevelsIndex(),
          guards: buildInfluenceGuards(),
          demoNotice: {
            fa: "پنج سطح، پنج بافت دسترسی و مسئولیت‌اند؛ رتبهٔ برتری افراد نیستند. همهٔ رکوردها ساختگی‌اند و هیچ کنشی الزام‌آور نیست.",
            en: "The five levels are access and responsibility contexts, not a ranking of people. All records are synthetic and no action is binding."
          }
        })
      };

    case "/api/v1/influence":
      return { status: 200, body: envelope(buildInfluenceOverview()) };

    case "/api/v1/accountability":
      return {
        status: 200,
        body: envelope({
          auditEvents: accountabilityRecords.auditEvents,
          immutabilityNotice: accountabilityRecords.immutabilityNotice,
          conflictsOfInterest: accountabilityRecords.conflictsOfInterest,
          reviewRecords: accountabilityRecords.reviewRecords,
          decisions: charterAmendments.map((a) => ({ id: a.id, section: a.section, summary: a.summary, repositoryStatus: a.repositoryStatus, ratificationStatus: a.ratificationStatus })),
          honestyGuards: [
            { fa: "این گزارش «الحاق‌گرا» است، نه تغییرناپذیر رمزنگاری‌شده.", en: "This log is append-oriented, not cryptographically immutable." },
            { fa: "هیچ رأی یا تصویب واقعی در این سوابق وجود ندارد.", en: "No real vote or ratification exists in these records." }
          ]
        })
      };

    case "/api/v1/public-services":
      return {
        status: 200,
        body: envelope({
          services: publicServices,
          boundaries: publicServiceSafetyBoundaries,
          directoryState: {
            integrationType: "static-public-links-only",
            liveApiEnumerationPerformed: false,
            harCapturePerformed: false,
            iframeEmbeddingUsed: false,
            unverifiedEntries: publicServices.filter((s) => s.urlStatus === "unverified").length,
            verifiedEntries: 0
          },
          notice: {
            fa: "این فهرست از روی ارجاع‌های عمومی تدوین شده و هیچ کاوش زنده یا آزمایشی روی سامانه‌های دولتی انجام نشده است.",
            en: "This list is compiled from public references; no live probing or testing of government systems was performed."
          }
        })
      };

    case "/api/v1/projects":
      return {
        status: 200,
        body: envelope({
          projects: publicGoodProjects,
          incentivePolicy: {
            governancePurchasable: false,
            weightedVoting: false,
            financialInfluence: false,
            notice: {
              fa: "مشارکت در هیچ پروژه‌ای حق حکمرانی، رأی وزنی یا دسترسی ویژه ایجاد نمی‌کند.",
              en: "Contributing to any project grants no governance right, weighted vote, or privileged access."
            }
          }
        })
      };

    case "/api/v1/simulations":
      return {
        status: 200,
        body: envelope({
          models: institutionalDesignModels,
          parameters: safeguardParameters,
          defaultProfile: computeSafeguardProfile({}),
          notice: {
            fa: "همهٔ سناریوها فرضی‌اند. این آزمایشگاه هیچ توصیهٔ قطعی، پیش‌بینی یا گزینهٔ «برنده» ارائه نمی‌دهد.",
            en: "All scenarios are hypothetical. This lab offers no definitive recommendation, prediction, or 'winning' option."
          },
          comparisonDisclaimer: {
            fa: "مقایسهٔ مدل‌ها بر پایهٔ ویژگی‌های ساختاری است، نه عملکرد واقعی هیچ کشور مشخصی.",
            en: "Model comparison rests on structural features, not the actual performance of any particular country."
          }
        })
      };

    case "/api/v1/digital-legacy":
      return {
        status: 200,
        body: envelope({
          scopeNotice: {
            fa: "این بخش کاملاً از بایگانی تاریخی جدا است. پروندهٔ هستی یک مفهوم پژوهشی دربارهٔ زندگی زنده است، نه آرشیو فوت‌شدگان.",
            en: "This section is entirely separate from the historical archive. The existence dossier is a research concept about living life, not a deceased-person archive."
          },
          clauses: digitalLegacyClauses,
          consentMatrix: digitalLegacyConsentMatrix,
          hardProhibitions: [
            { fa: "تولید صدا، چهره یا ویدئوی شبیه‌سازی‌شده — ممنوع مطلق.", en: "Voice, likeness, or video simulation — absolutely prohibited." },
            { fa: "رأی یا اعلام موضع سیاسی به نام فرد فوت‌شده — ممنوع مطلق.", en: "Voting or political statements for a deceased person — absolutely prohibited." },
            { fa: "بارگذاری آرشیو شخصی، پیام، دادهٔ زیستی یا املاک دیجیتال توسط وارثان — در این نمونه پذیرفته نمی‌شود.", en: "Uploading personal archives, messages, biometric data, or digital estates by heirs — not accepted here." }
          ],
          archiveSeparation: {
            archiveModuleApi: "/api/v1/archive",
            archiveIsDeceasedOnly: true,
            digitalLegacyIsLivingConcept: true,
            mergedAtAnyPoint: false
          }
        })
      };

    case "/api/v1/simulations/evaluate": {
      const numeric = {
        sunsetDays: params.sunsetDays === undefined ? 180 : Number(params.sunsetDays),
        reviewIntervalDays: params.reviewIntervalDays === undefined ? 90 : Number(params.reviewIntervalDays),
        supermajority: params.supermajority === undefined ? 66 : Number(params.supermajority),
        decentralization: params.decentralization === undefined ? 35 : Number(params.decentralization)
      };
      if (!Object.values(numeric).every((value) => Number.isFinite(value))) {
        return { status: 400, body: { error: "invalid_parameter" } };
      }
      if (numeric.sunsetDays < 15 || numeric.sunsetDays > 540) {
        return { status: 400, body: { error: "sunset_days_out_of_range", allowed: [15, 540] } };
      }
      if (numeric.reviewIntervalDays < 7 || numeric.reviewIntervalDays > 365) {
        return { status: 400, body: { error: "review_interval_out_of_range", allowed: [7, 365] } };
      }
      if (numeric.supermajority < 50 || numeric.supermajority > 90) {
        return { status: 400, body: { error: "supermajority_out_of_range", allowed: [50, 90] } };
      }
      if (numeric.decentralization < 0 || numeric.decentralization > 80) {
        return { status: 400, body: { error: "decentralization_out_of_range", allowed: [0, 80] } };
      }
      return { status: 200, body: envelope({ profile: computeSafeguardProfile(numeric), illustrativeOnly: true }) };
    }

    case "/api/v1/search":
      return { status: 200, body: envelope(globalSearch(params.q ?? "")) };

    default:
      return null;
  }
}

export function createServer() {
  return createHttpServer((request, response) => {
    const method = request.method ?? "GET";
    const url = new URL(request.url ?? "/", "http://local.invalid");
    const pathname = url.pathname;

    if (method !== "GET") {
      response.setHeader("Allow", "GET");
      sendJson(response, 405, { error: "method_not_allowed" });
      return;
    }

    const parsed = parseQuery(url.searchParams);
    if (!parsed.ok) {
      sendJson(response, 400, { error: parsed.error });
      return;
    }

    if (pathname === "/health") {
      sendJson(response, 200, { status: "ok" });
      return;
    }

    if (pathname === "/api/v1/demo") {
      sendJson(response, 200, demoPayload);
      return;
    }

    if (pathname === "/api/v1/health") {
      sendJson(
        response,
        200,
        envelope({
          status: "ok",
          mode: "synthetic-demo",
          readOnly: true,
          modules: moduleRegistry.length,
          schemaVersion: SCHEMA_VERSION
        })
      );
      return;
    }

    const query = parsed.params;

    // /api/v1/levels/:id
    const levelMatch = pathname.match(/^\/api\/v1\/levels\/([1-5])$/);
    if (levelMatch) {
      const policyId = query.policy ?? "P-OPEN-DRAFT";
      if (!["P-OPEN-DRAFT", "P-RESTRICTIVE-DRAFT"].includes(policyId)) {
        sendJson(response, 400, { error: "unknown_policy", allowed: ["P-OPEN-DRAFT", "P-RESTRICTIVE-DRAFT"] });
        return;
      }
      sendJson(response, 200, envelope(buildLevelDashboard(levelMatch[1], { policyId })));
      return;
    }

    // /api/v1/influence/authorize — action-scoped check, enforced here rather
    // than only in the interface, so a client cannot opt out of the boundary.
    const authorizeMatch = pathname.match(/^\/api\/v1\/influence\/authorize$/);
    if (authorizeMatch) {
      const level = Number(query.level);
      if (!query.action) {
        sendJson(response, 400, { error: "missing_action_parameter", hint: "action=<actionId>&level=<1-5>" });
        return;
      }
      if (!Number.isInteger(level) || level < 1 || level > 5) {
        sendJson(response, 400, { error: "invalid_level", allowed: [1, 2, 3, 4, 5] });
        return;
      }
      const result = authorizeAction({
        level,
        actionId: query.action,
        actor: query.actor ? String(query.actor).slice(0, 64) : null,
        resource: query.resource ? { ownerId: String(query.resource).slice(0, 64), organizationId: String(query.resource).slice(0, 64), committeeId: String(query.resource).slice(0, 64) } : null
      });
      sendJson(response, result.allowed ? 200 : 403, envelope({ request: { level, actionId: query.action }, result }));
      return;
    }

    // /api/v1/influence/qualify?proposal=&policy=
    const qualifyMatch = pathname.match(/^\/api\/v1\/influence\/qualify$/);
    if (qualifyMatch) {
      const policyId = query.policy ?? "P-OPEN-DRAFT";
      if (!["P-OPEN-DRAFT", "P-RESTRICTIVE-DRAFT"].includes(policyId)) {
        sendJson(response, 400, { error: "unknown_policy", allowed: ["P-OPEN-DRAFT", "P-RESTRICTIVE-DRAFT"] });
        return;
      }
      if (!query.proposal) {
        sendJson(response, 400, { error: "missing_proposal_parameter" });
        return;
      }
      const overview = buildInfluenceOverview();
      const proposal = overview.proposals.find((item) => item.id === query.proposal);
      if (!proposal) {
        sendJson(response, 404, { error: "proposal_not_found" });
        return;
      }
      const result = proposal.results.find((item) => item.policyId === policyId);
      sendJson(response, 200, envelope({ proposal: { id: proposal.id, title: proposal.title, domain: proposal.domain, contributions: proposal.contributions }, result }));
      return;
    }

    // /api/v1/archive/:id
    const archiveMatch = pathname.match(/^\/api\/v1\/archive\/([A-Za-z0-9_-]{1,64})$/);
    if (archiveMatch) {
      const dossier = archiveDossiers.find((d) => d.id === archiveMatch[1]);
      if (!dossier) {
        sendJson(response, 404, { error: "dossier_not_found" });
        return;
      }
      sendJson(response, 200, envelope({ dossier, boundary: archiveBoundary, syntheticSources: archiveSyntheticSources }));
      return;
    }

    const routed = routeTable(parsed.params, pathname);
    if (routed) {
      sendJson(response, routed.status, routed.body);
      return;
    }

    sendJson(response, 404, { error: "not_found" });
  });
}

const isEntrypoint =
  process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isEntrypoint) {
  const port = Number.parseInt(process.env.PORT ?? "3001", 10);
  const server = createServer();
  server.listen(port, "0.0.0.0", () => {
    console.log(`CEP demo API listening on 0.0.0.0:${port} (synthetic, read-only)`);
  });
}

export { pickBilingual, moduleRegistry };
