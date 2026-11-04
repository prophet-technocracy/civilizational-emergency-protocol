// CEP Validation Schemas, 77-Column CSV Gate Validator,
// Five-Band Assurance Evaluator, Provenance Validator & Timeline Engine

import { EPISTEMIC_STATUSES, STATEMENT_TYPES } from "@cep/domain-models";

// Exact 77 headers audited in docs/iran/DISCOVERY-AND-EXECUTION-REPORT.md
export const HISTORICAL_DOSSIER_77_HEADERS = Object.freeze([
  "dossier_id",
  "subject_code",
  "name",
  "alternate_names",
  "epithet",
  "status",
  "birth_year",
  "birth_year_display",
  "birth_place",
  "birth_country_modern",
  "death_year",
  "death_year_display",
  "death_place",
  "date_precision",
  "century",
  "era",
  "dynasty_or_state",
  "region",
  "modern_country",
  "ethnolinguistic_background",
  "gender",
  "religion_or_worldview",
  "languages_of_work",
  "primary_field",
  "secondary_fields",
  "roles",
  "record_type",
  "historicity",
  "patrons_or_courts",
  "teachers_or_influences",
  "students_or_influenced",
  "associated_institutions",
  "major_works",
  "work_01",
  "work_02",
  "work_03",
  "work_04",
  "work_05",
  "work_06",
  "work_07",
  "work_08",
  "work_09",
  "work_10",
  "major_achievements",
  "achievement_01",
  "achievement_02",
  "achievement_03",
  "achievement_04",
  "achievement_05",
  "achievement_06",
  "contribution_to_humanity",
  "contribution_summary",
  "eponyms",
  "notable_firsts",
  "translated_into",
  "global_reception",
  "disputed_attribution",
  "source_hint",
  "confidence",
  "tags",
  "principle_20_link",
  "authorship_claim",
  "corpus_survival",
  "legacy_rights_status",
  "custodian_or_heirs",
  "simulation_consent_default",
  "posthumous_participation_scope",
  "digital_death_choice_default",
  "authenticity_risk",
  "applicable_clauses",
  "international_law_anchor",
  "layered_identity_note",
  "cognitive_backup_note",
  "reidentification_risk",
  "deidentification_note",
  "data_as_of",
  "notes"
]);

/**
 * RFC-4180 compatible CSV line parser supporting quoted fields with commas.
 */
export function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

/**
 * Validates a 77-column Historical Dossier CSV dataset against CEP's strict
 * privacy, provenance, and publication gates (CEP-IRAN-003 & CEP-IRAN-005).
 */
export function validateHistoricalDossierCsv(csvText, options = {}) {
  const {
    hasPublicationLicenseConfirmation = false,
    hasHumanEditorialSignOff = false
  } = options;

  const errors = [];
  const warnings = [];
  const lines = String(csvText ?? "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    return {
      valid: false,
      publicationGatePassed: false,
      rowCount: 0,
      errors: ["CSV input is empty"],
      warnings: [],
      stats: {}
    };
  }

  const headers = parseCsvLine(lines[0]).map((h) => h.trim());
  if (headers.length !== HISTORICAL_DOSSIER_77_HEADERS.length) {
    errors.push(
      `Expected exactly ${HISTORICAL_DOSSIER_77_HEADERS.length} headers, found ${headers.length}`
    );
  } else {
    for (let i = 0; i < HISTORICAL_DOSSIER_77_HEADERS.length; i += 1) {
      if (headers[i] !== HISTORICAL_DOSSIER_77_HEADERS[i]) {
        errors.push(
          `Header mismatch at column ${i + 1}: expected '${HISTORICAL_DOSSIER_77_HEADERS[i]}', found '${headers[i]}'`
        );
      }
    }
  }

  const seenDossierIds = new Set();
  const seenSubjectCodes = new Set();
  let livingRowCount = 0;
  let highReidentificationCount = 0;
  let denormalizedWorkDuplicateRows = 0;
  let missingSourceHintCount = 0;

  for (let rowIndex = 1; rowIndex < lines.length; rowIndex += 1) {
    const values = parseCsvLine(lines[rowIndex]);
    if (values.length !== headers.length) {
      errors.push(
        `Row ${rowIndex}: expected ${headers.length} columns, found ${values.length}`
      );
      continue;
    }

    const row = {};
    for (let c = 0; c < headers.length; c += 1) {
      row[headers[c]] = values[c].trim();
    }

    // Hard Rule 1: Unique identifiers
    if (!row.dossier_id) {
      errors.push(`Row ${rowIndex}: missing dossier_id`);
    } else if (seenDossierIds.has(row.dossier_id)) {
      errors.push(`Row ${rowIndex}: duplicate dossier_id '${row.dossier_id}'`);
    } else {
      seenDossierIds.add(row.dossier_id);
    }

    if (!row.subject_code) {
      errors.push(`Row ${rowIndex}: missing subject_code`);
    } else if (seenSubjectCodes.has(row.subject_code)) {
      errors.push(`Row ${rowIndex}: duplicate subject_code '${row.subject_code}'`);
    } else {
      seenSubjectCodes.add(row.subject_code);
    }

    // Hard Rule 2: Explicit exclusion of living individuals
    if (row.status.toLowerCase() !== "deceased") {
      livingRowCount += 1;
      errors.push(
        `Row ${rowIndex} (${row.dossier_id}): CRITICAL PRIVACY VIOLATION — status='${row.status}'. All living-person records are strictly prohibited.`
      );
    }

    // Hard Rule 3: High re-identification risk rejection
    if (row.reidentification_risk.toUpperCase() === "HIGH") {
      highReidentificationCount += 1;
      errors.push(
        `Row ${rowIndex} (${row.dossier_id}): CRITICAL PRIVACY VIOLATION — reidentification_risk='HIGH'.`
      );
    }

    // Check name-derived hash warning
    if (/^HASH_|^NAME_HASH/i.test(row.subject_code)) {
      warnings.push(
        `Row ${rowIndex} (${row.dossier_id}): subject_code appears name-derived; replace with opaque random internal ID before publication.`
      );
    }

    // Check denormalized work duplication (major_works vs work_01..10)
    const slotWorks = [];
    for (let w = 1; w <= 10; w += 1) {
      const key = `work_${String(w).padStart(2, "0")}`;
      if (row[key]) slotWorks.push(row[key]);
    }
    if (row.major_works && slotWorks.length > 0) {
      const normalizedMajor = row.major_works.toLowerCase();
      const hasOverlap = slotWorks.some((sw) => normalizedMajor.includes(sw.toLowerCase()));
      if (hasOverlap) {
        denormalizedWorkDuplicateRows += 1;
        warnings.push(
          `Row ${rowIndex} (${row.dossier_id}): denormalized overlap between 'major_works' and 'work_01..10'; importer must deduplicate.`
        );
      }
    }

    // Check citation presence
    if (!row.source_hint) {
      missingSourceHintCount += 1;
      warnings.push(`Row ${rowIndex} (${row.dossier_id}): missing source_hint citation.`);
    }
  }

  const schemaValid = errors.length === 0;
  const publicationGatePassed =
    schemaValid &&
    hasPublicationLicenseConfirmation === true &&
    hasHumanEditorialSignOff === true &&
    missingSourceHintCount === 0;

  return {
    valid: schemaValid,
    publicationGatePassed,
    rowCount: Math.max(0, lines.length - 1),
    errors,
    warnings,
    stats: {
      livingRowCount,
      highReidentificationCount,
      denormalizedWorkDuplicateRows,
      missingSourceHintCount,
      hasPublicationLicenseConfirmation,
      hasHumanEditorialSignOff
    }
  };
}

/**
 * Validates an EvidenceClaim provenance record per Part VI Section 12.
 */
export function validateClaimProvenance(claim, sourceIds = new Set()) {
  if (!claim || typeof claim !== "object") {
    return { valid: false, errors: ["Claim must be an object"] };
  }

  const errors = [];

  // Bilingual text fields may be supplied either as flattened `...Fa`/`...En`
  // pairs or as a single `{ fa, en }` object. Both shapes are canonical.
  const textPairs = [
    ["claimText", claim.claimTextFa, claim.claimTextEn, claim.claim],
    ["confidenceAssessment", claim.confidenceAssessmentFa, claim.confidenceAssessmentEn, claim.confidence]
  ];

  for (const [name, flatFa, flatEn, bilingual] of textPairs) {
    const fromFlat = typeof flatFa === "string" && flatFa.trim() && typeof flatEn === "string" && flatEn.trim();
    const fromObject =
      bilingual &&
      typeof bilingual === "object" &&
      typeof bilingual.fa === "string" &&
      bilingual.fa.trim() &&
      typeof bilingual.en === "string" &&
      bilingual.en.trim();
    if (!fromFlat && !fromObject) {
      errors.push(`Missing bilingual ${name} (expected {...Fa,...En} or { fa, en })`);
    }
  }

  for (const field of [
    "id",
    "classification",
    "sourceDocumentId",
    "sourceVersion",
    "pageOrSection",
    "publicationDate",
    "verificationStatus",
    "reviewerStatus",
    "lastReviewed"
  ]) {
    if (typeof claim[field] !== "string" || claim[field].trim().length === 0) {
      errors.push(`Invalid or empty provenance field '${field}'`);
    }
  }

  if (!STATEMENT_TYPES.includes(claim.classification)) {
    errors.push(`Unsupported statement classification '${claim.classification}'`);
  }

  if (!EPISTEMIC_STATUSES.includes(claim.verificationStatus)) {
    errors.push(`Unsupported verificationStatus '${claim.verificationStatus}'`);
  }

  if (sourceIds.size > 0 && !sourceIds.has(claim.sourceDocumentId)) {
    errors.push(`Unknown sourceDocumentId '${claim.sourceDocumentId}'`);
  }

  if (!Array.isArray(claim.knownContradictions)) {
    errors.push("knownContradictions must be an array");
  }

  if (!Array.isArray(claim.revisionHistory) || claim.revisionHistory.length === 0) {
    errors.push("revisionHistory must be a non-empty array");
  }

  // AI consensus safeguard: AI agents repeating a claim never makes it source-verified
  if (
    claim.verificationStatus === "source-verified" &&
    claim.reviewerStatus === "ai-unreviewed"
  ) {
    errors.push(
      "Epistemic violation: AI-generated claims cannot be marked source-verified without human verification"
    );
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Evaluates an action request under the Five-Band Access-Assurance Architecture
 * (docs/iran/VERIFICATION-AND-ACCESS-CONTROL-DESIGN.md).
 * Authorizes individual actions on specific resources — never ranks people.
 */
export const REJECTED_PROOF_TYPES = Object.freeze({
  telegram_citizenship: {
    code: "REJECTED_TELEGRAM_CITIZENSHIP",
    reasonFa:
      "مالکیت حساب تلگرام فقط کنترل آن حساب در آن لحظه را نشان می‌دهد و هرگز دلیل تابعیت، هویت یکتا یا حق رأی نیست.",
    reasonEn:
      "Telegram account control proves only control of that account at that moment—never citizenship, unique personhood, or voting eligibility."
  },
  ai_location_photo_challenge: {
    code: "REJECTED_AI_LOCATION_CHALLENGE",
    reasonFa:
      "چالش عکس/موقعیت مکانی و مصاحبهٔ هوش مصنوعی برای اثبات شهروندی به‌دلیل خطر امنیتی، تبعیض و افشای مکان ممنوع است.",
    reasonEn:
      "AI interviews and timed photo/location challenges are prohibited due to physical safety risks, location exposure, and exclusion."
  },
  social_credit_score: {
    code: "REJECTED_SOCIAL_CREDIT",
    reasonFa:
      "امتیازدهی اعتبار اجتماعی یا رتبه‌بندی شهروندان با منشور CEP و کرامت انسانی در تضاد کامل است.",
    reasonEn:
      "Social-credit scoring and cross-context reputation rankings are strictly prohibited by the CEP Founding Charter."
  },
  influence_wallet_token: {
    code: "REJECTED_WALLET_INFLUENCE",
    reasonFa:
      "کیف پول، توکن یا کمک مالی هرگز نمی‌تواند حق رأی، نفوذ سیاسی یا دسترسی ویژه بخرد.",
    reasonEn:
      "Wallets, tokens, or financial deposits can never purchase governance influence, voting rights, or privileged access."
  },
  peer_tier_private_db_unlock: {
    code: "REJECTED_PEER_DB_UNLOCK",
    reasonFa:
      "تأیید یک کاربر رده‌بالاتر هرگز مجوز دسترسی به پایگاه‌داده‌های خصوصی دیگران نیست.",
    reasonEn:
      "Approval by a higher-band user never authorizes access to private databases without owner authority and legal basis."
  }
});

export function evaluateAssurancePolicy(policyCatalogue, request) {
  const { actionId, presentedBand = 1, presentedProofs = [] } = request ?? {};
  const policy = policyCatalogue.find((item) => item.actionId === actionId);

  if (!policy) {
    return {
      decision: "DENY",
      code: "UNKNOWN_ACTION",
      actionId: actionId ?? null,
      minimumBandRequired: null,
      reasonFa: "عملیات درخواستی در سیاست‌های دسترسی تعریف نشده است (پیش‌فرض: بستن دسترسی).",
      reasonEn: "Requested action is not defined in access policies (fail-closed default).",
      rejectedProofWarnings: [],
      separationOfConcerns: null
    };
  }

  // Check if any presented proofs are prohibited anti-patterns
  const rejectedProofWarnings = [];
  const validProofs = [];

  for (const proof of presentedProofs) {
    if (REJECTED_PROOF_TYPES[proof]) {
      rejectedProofWarnings.push(REJECTED_PROOF_TYPES[proof]);
    } else {
      validProofs.push(proof);
    }
  }

  // Check if the action itself is constitutionally prohibited in CEP
  if (policy.isConstitutionallyProhibited) {
    return {
      decision: "PROHIBITED_BY_CHARTER",
      code: "CONSTITUTIONAL_BOUNDARY",
      actionId: policy.actionId,
      titleFa: policy.titleFa,
      titleEn: policy.titleEn,
      minimumBandRequired: null,
      reasonFa: policy.prohibitionReasonFa,
      reasonEn: policy.prohibitionReasonEn,
      rejectedProofWarnings,
      separationOfConcerns: {
        authentication: "N/A — Action outside CEP scope",
        attributeAssurance: "No credential or score can authorize this action in CEP",
        authorization: "DENIED (Constitutional Guardrail)",
        audit: "Attempted prohibited action type noted without logging personal identity"
      }
    };
  }

  // Band 1 public actions are always open without any account or proof
  if (policy.minimumBand === 1) {
    return {
      decision: "ALLOW",
      code: "PUBLIC_BAND_1_OPEN",
      actionId: policy.actionId,
      titleFa: policy.titleFa,
      titleEn: policy.titleEn,
      minimumBandRequired: 1,
      reasonFa:
        "این عملیات در سطح ۱ (دسترسی عمومی) قرار دارد و بدون حساب کاربری، شناسایی یا تلگرام برای همه باز است.",
      reasonEn:
        "This action is in Band 1 (Public Access) and is open to everyone without an account, identification, or Telegram.",
      rejectedProofWarnings,
      separationOfConcerns: {
        authentication: "None required (Anonymous Session)",
        attributeAssurance: "None required",
        authorization: `Allowed on resource '${policy.resource}' (Public Read-Only)`,
        audit: "Zero visitor tracking or click profiling"
      }
    };
  }

  const bandNumeric = Number(presentedBand) || 1;
  const missingProofs = policy.requiredProofs.filter((req) => !validProofs.includes(req));

  if (bandNumeric < policy.minimumBand || missingProofs.length > 0) {
    return {
      decision: "DENY_INSUFFICIENT_ASSURANCE",
      code: "MINIMUM_EVIDENCE_MISSING",
      actionId: policy.actionId,
      titleFa: policy.titleFa,
      titleEn: policy.titleEn,
      minimumBandRequired: policy.minimumBand,
      missingProofs,
      reasonFa: `این عملیات نیازمند سطح تضمین ${policy.minimumBand} و گواهی‌های اختصاصی (${policy.requiredProofs.join(", ")}) است. سطح بالاتر به‌تنهایی بدون گواهی مرتبط مجوز ایجاد نمی‌کند.`,
      reasonEn: `This action requires Band ${policy.minimumBand} and purpose-specific proofs (${policy.requiredProofs.join(", ")}). Higher band status alone does not grant blanket access.`,
      rejectedProofWarnings,
      separationOfConcerns: {
        authentication: validProofs.includes("passkey_session")
          ? "Pseudonymous session key verified"
          : "Unauthenticated or missing session key",
        attributeAssurance:
          missingProofs.length > 0
            ? `Missing required purpose-bound proof(s): ${missingProofs.join(", ")}`
            : "Required attributes present",
        authorization: `Denied for '${policy.resource}' (Purpose: ${policy.purposeLimitationEn})`,
        audit: "Minimal denial event recorded (no PII retained)"
      }
    };
  }

  return {
    decision: "ALLOW_SCOPED_SIMULATION",
    code: "SCOPED_ACTION_AUTHORIZED",
    actionId: policy.actionId,
    titleFa: policy.titleFa,
    titleEn: policy.titleEn,
    minimumBandRequired: policy.minimumBand,
    missingProofs: [],
    reasonFa: `مجوز موردی و زمان‌دار برای «${policy.titleFa}» صادر شد (${policy.expiryPolicy}). این مجوز هیچ دسترسی به سایر پایگاه‌داده‌ها یا امتیاز سیاسی ایجاد نمی‌کند.`,
    reasonEn: `Purpose-limited, expiring authorization granted for "${policy.titleEn}" (${policy.expiryPolicy}). Grants zero access to unrelated databases and zero political status.`,
    rejectedProofWarnings,
    separationOfConcerns: {
      authentication: "Session control verified without inferring legal identity or citizenship",
      attributeAssurance: `Verified minimum proofs: ${policy.requiredProofs.join(", ")}`,
      authorization: `Authorized strictly for '${policy.resource}' (${policy.expiryPolicy})`,
      audit: `Append-oriented audit record required (Scope: ${policy.resource}, Expiry: ${policy.expiryPolicy})`
    }
  };
}

/**
 * Calculates timeline metrics and validates stage dependencies without
 * converting proposed durations into actual calendar election dates.
 */
export function calculateTimelineMetrics(stages) {
  if (!Array.isArray(stages)) {
    throw new Error("Stages must be an array");
  }

  const stageIds = new Set(stages.map((s) => s.id));
  const unresolvedDependencies = [];
  const horizonCounts = {
    "emergency-180d": 0,
    "transition-2-3y": 0,
    "constitutional-longterm": 0
  };
  let totalMilestones = 0;

  for (const stage of stages) {
    if (stage.horizonKey in horizonCounts) {
      horizonCounts[stage.horizonKey] += 1;
    }
    totalMilestones += Array.isArray(stage.milestones) ? stage.milestones.length : 0;

    for (const depId of stage.dependencies ?? []) {
      if (!stageIds.has(depId)) {
        unresolvedDependencies.push({ stageId: stage.id, missingDependencyId: depId });
      }
    }
  }

  return {
    totalStages: stages.length,
    totalMilestones,
    horizonCounts,
    dependenciesValid: unresolvedDependencies.length === 0,
    unresolvedDependencies
  };
}

/**
 * Computes an ILLUSTRATIVE safeguard profile for the Institutional Design Lab.
 * These are transparent arithmetic trade-off indicators for interface
 * exploration only. They are NOT predictions, measurements, or policy scores,
 * and must never be presented as evidence about any real country.
 */
export function computeSafeguardProfile(input = {}) {
  const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value)));
  const sunsetDays = clamp(input.sunsetDays ?? 180, 15, 540);
  const reviewIntervalDays = clamp(input.reviewIntervalDays ?? 90, 7, 365);
  const supermajority = clamp(input.supermajority ?? 66, 50, 90);
  const decentralization = clamp(input.decentralization ?? 35, 0, 80);

  const scale = (value, min, max) => Math.round(((value - min) / (max - min)) * 100);

  const indicators = [
    {
      id: "temporary-authority",
      label: {
        fa: "موقتی بودن اختیارات اضطراری",
        en: "Temporariness of emergency authority"
      },
      value: 100 - scale(sunsetDays, 15, 540),
      direction: {
        fa: "هرچه سقف کوتاه‌تر، احتمال دائمی‌شدن کمتر — به بهای نیاز بیشتر به بازتصویب.",
        en: "A shorter ceiling reduces entrenchment risk at the cost of more frequent re-authorization."
      }
    },
    {
      id: "review-density",
      label: { fa: "تراکم بازبینی مستقل", en: "Independent review density" },
      value: 100 - scale(reviewIntervalDays, 7, 365),
      direction: {
        fa: "بازبینی مکرر شفافیت را بالا می‌برد و سرعت تصمیم را کاهش می‌دهد.",
        en: "Frequent review raises transparency and slows decision speed."
      }
    },
    {
      id: "minority-protection",
      label: { fa: "حفاظت از اقلیت", en: "Minority protection" },
      value: scale(supermajority, 50, 90),
      direction: {
        fa: "آستانهٔ بالاتر، حفاظت بیشتر و انعطاف کمتر در تصمیم‌گیری فوری.",
        en: "A higher threshold means more protection and less agility in urgent decisions."
      }
    },
    {
      id: "local-accountability",
      label: { fa: "پاسخگویی محلی", en: "Local accountability" },
      value: scale(decentralization, 0, 80),
      direction: {
        fa: "واگذاری بیشتر، پاسخگویی را نزدیک‌تر و هماهنگی ملی را دشوارتر می‌کند.",
        en: "More delegation brings accountability closer and national coordination harder."
      }
    },
    {
      id: "coordination-capacity",
      label: { fa: "ظرفیت هماهنگی ملی", en: "National coordination capacity" },
      value: 100 - Math.round(scale(decentralization, 0, 80) * 0.7),
      direction: {
        fa: "تمرکز بیشتر، هماهنگی سریع‌تر — با خطر فاصله گرفتن از شهروند.",
        en: "More centralization means faster coordination — with a risk of distance from the citizen."
      }
    }
  ];

  const tensionPairs = [];
  if (sunsetDays < 90 && reviewIntervalDays > 180) {
    tensionPairs.push({
      fa: "سقف کوتاه اختیارات با فاصلهٔ بازبینی بلند هم‌خوان نیست: اختیار زودتر پایان می‌یابد تا زمانی که بازبینی شود.",
      en: "A short sunset ceiling is inconsistent with a long review interval: authority expires before it is reviewed."
    });
  }
  if (supermajority > 80 && decentralization > 65) {
    tensionPairs.push({
      fa: "آستانهٔ بسیار بالا همراه با واگذاری گسترده، خطر بن‌بست چندسطحی را افزایش می‌دهد.",
      en: "A very high threshold combined with broad delegation raises the risk of multi-level deadlock."
    });
  }
  if (tensionPairs.length === 0) {
    tensionPairs.push({
      fa: "در این ترکیب، تنش ساختاری آشکاری دیده نمی‌شود — که به معنای نبود خطر نیست.",
      en: "No obvious structural tension appears in this combination — which does not mean no risk exists."
    });
  }

  return {
    inputs: { sunsetDays, reviewIntervalDays, supermajority, decentralization },
    indicators,
    tensionPairs,
    disclaimer: {
      fa: "این اعداد صرفاً یک نمایش رابط برای درک بده‌بستان‌های طراحی‌اند. آن‌ها پیش‌بینی، سنجهٔ عملکرد یا امتیاز هیچ کشوری نیستند.",
      en: "These numbers are purely an interface demonstration of design trade-offs. They are not predictions, performance measures, or scores for any country."
    }
  };
}
