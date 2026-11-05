// CEP influence, authority and qualification engine.
//
// Every political ballot, professional assessment, endorsement and threshold
// point in the prototype is computed here, from explicit inputs, under an
// explicitly identified policy configuration. Nothing in this module reads a
// clock, a network, or a mutable global, so the same call always returns the
// same numbers and the interface can show the arithmetic behind them.
//
// The five guarantees this module exists to make checkable:
//   1. A political ballot is never altered by a factor that is not listed in
//      its own `components` array (see `assertBallotIsFullyExplained`).
//   2. Professional authority is scoped to the decision's domain. A medical
//      qualification contributes nothing to an engineering decision.
//   3. Public reach never becomes individual ballots: `ballotsCreated` is a
//      constant zero, not a computed value that could drift.
//   4. Threshold arithmetic is category-by-category and policy-driven, so two
//      configurations can be compared on the same proposal.
//   5. Authority is action-scoped, and posthumous mandates can never carry a
//      ballot.

export const CIVIC_LEVELS = Object.freeze([
  Object.freeze({
    id: 1,
    key: "public-observer",
    title: { fa: "ناظر عمومی", en: "Public Observer" },
    purpose: {
      fa: "دسترسی آزاد به اطلاعات عمومی تأییدشده و بررسی فعالیت نهادها، بودجه و تصمیم‌ها.",
      en: "Unrestricted access to approved public information and the ability to examine institutions, budgets and decisions."
    },
    holdsBallot: false,
    actions: ["read-public-record", "inspect-financial-summary", "inspect-endorsement-record", "compare-policy-configurations"]
  }),
  Object.freeze({
    id: 2,
    key: "private-citizen",
    title: { fa: "شهروند خصوصی", en: "Private Citizen" },
    purpose: {
      fa: "خدمات شخصی با حفظ حریم خصوصی؛ اثبات یک صلاحیت مشخص بدون ساختن پروفایل عمومی.",
      en: "Privacy-first personal services: prove one specific qualification without creating a public profile."
    },
    holdsBallot: false,
    actions: ["read-own-private-record", "present-selective-credential", "manage-consent", "join-scoped-consultation"]
  }),
  Object.freeze({
    id: 3,
    key: "participating-citizen",
    title: { fa: "شهروند مشارکت‌کننده", en: "Participating Citizen" },
    purpose: {
      fa: "مشارکت مدنی گسترده‌تر: برگهٔ رأی سیاسی، نظرسنجی، پیشنهاد شهروندی و واگذاری اختیار.",
      en: "Broader civic participation: political ballots, polls, citizen proposals and delegation."
    },
    holdsBallot: true,
    actions: ["cast-political-ballot", "answer-poll", "submit-citizen-proposal", "delegate-scoped-authority", "read-own-private-record"]
  }),
  Object.freeze({
    id: 4,
    key: "organizational-node",
    title: { fa: "گرهٔ سازمانی", en: "Organizational Node" },
    purpose: {
      fa: "انجام کار تعریف‌شده: قرارداد، تحویل‌شدنی، بودجهٔ ساختگی و پاسخگویی عمومی.",
      en: "Perform defined work: contracts, deliverables, synthetic budgets and public accountability."
    },
    holdsBallot: false,
    actions: ["read-own-assignment", "submit-deliverable", "respond-to-procurement", "publish-progress-report"]
  }),
  Object.freeze({
    id: 5,
    key: "decision-maker",
    title: { fa: "تصمیم‌گیرندهٔ عمومی", en: "Public Decision-Maker" },
    purpose: {
      fa: "بررسی پرونده در چارچوب اختیار مشخص، با دلیل، سابقهٔ قابل حسابرسی و تفکیک وظایف.",
      en: "Review within a defined scope, with a stated reason, an auditable history and separation of duties."
    },
    holdsBallot: false,
    actions: ["read-committee-queue", "record-scoped-decision", "commission-task", "review-deliverable", "declare-conflict", "publish-decision-report"]
  })
]);

export const LEVEL_IDS = Object.freeze(CIVIC_LEVELS.map((level) => level.id));

/**
 * Actions each level may perform against the synthetic API. A level name is a
 * context, never a rank: being on level 5 grants nothing outside `actions`.
 */
export const ACTION_POLICY = Object.freeze({
  "read-public-record": { levels: [1, 2, 3, 4, 5], scope: "public" },
  "inspect-financial-summary": { levels: [1, 3, 4, 5], scope: "public" },
  "inspect-endorsement-record": { levels: [1, 2, 3, 4, 5], scope: "public" },
  "compare-policy-configurations": { levels: [1, 2, 3, 4, 5], scope: "public" },
  "read-own-private-record": { levels: [2, 3], scope: "self" },
  "present-selective-credential": { levels: [2, 3], scope: "self" },
  "manage-consent": { levels: [2, 3], scope: "self" },
  "join-scoped-consultation": { levels: [2, 3], scope: "self" },
  "cast-political-ballot": { levels: [3], scope: "self" },
  "answer-poll": { levels: [3], scope: "self" },
  "submit-citizen-proposal": { levels: [3], scope: "self" },
  "delegate-scoped-authority": { levels: [3], scope: "self" },
  "read-own-assignment": { levels: [4], scope: "organization" },
  "submit-deliverable": { levels: [4], scope: "organization" },
  "respond-to-procurement": { levels: [4], scope: "organization" },
  "publish-progress-report": { levels: [4], scope: "organization" },
  "read-committee-queue": { levels: [5], scope: "committee" },
  "record-scoped-decision": { levels: [5, 4], scope: "committee" },
  "commission-task": { levels: [5], scope: "committee" },
  "review-deliverable": { levels: [5], scope: "committee" },
  "declare-conflict": { levels: [3, 4, 5], scope: "self" },
  "publish-decision-report": { levels: [5], scope: "committee" }
});

export const DECISION_DOMAINS = Object.freeze([
  "infrastructure",
  "healthcare",
  "economic-policy",
  "legal-institutional",
  "education",
  "civic-services"
]);

/**
 * Two fully specified, non-adopted qualification policies. Neither is a
 * constitutional rule: the point is that the same proposal can be run through
 * both and the difference inspected.
 *
 * `counted: false` is deliberate and visible — the restrictive policy keeps
 * recording endorsements while refusing to convert reach into qualification
 * points, which is a different claim from "endorsements do not exist".
 */
export const WEIGHTING_POLICIES = Object.freeze({
  "P-OPEN-DRAFT": Object.freeze({
    id: "P-OPEN-DRAFT",
    label: { fa: "سیاست باز (پیش‌نویس)", en: "Open policy (draft)" },
    status: "proposed-configurable",
    authorizedBy: "DEC-SYN-0014",
    authorizedByLabel: { fa: "کارگروه طراحی نهادی (ساختگی)", en: "Institutional Design Working Group (synthetic)" },
    appliesTo: DECISION_DOMAINS,
    thresholds: { infrastructure: 100, healthcare: 80, "economic-policy": 90, "legal-institutional": 110, education: 70, "civic-services": 60 },
    categories: {
      political: { weight: 1, unit: "ballot", counted: true, domainScoped: false },
      professional: { weight: 3, unit: "assessment", counted: true, domainScoped: true },
      endorsement: { weight: 0.02, unit: "reach-point", counted: true, capPoints: 40, basis: "declared reach × engagement" },
      mobilization: { weight: 0.5, unit: "verified-attendance", counted: true, capPoints: 25 },
      sponsorship: { weight: 5, unit: "sponsorship", counted: true, capPoints: 20 }
    },
    limits: { endorsementShareOfTotal: 0.4, note: { fa: "سهم تأییدهای عمومی از کل امتیاز از ۴۰٪ فراتر نمی‌رود.", en: "Public endorsements may not exceed 40% of the total." } }
  }),
  "P-RESTRICTIVE-DRAFT": Object.freeze({
    id: "P-RESTRICTIVE-DRAFT",
    label: { fa: "سیاست محدودکننده (پیش‌نویس)", en: "Restrictive policy (draft)" },
    status: "proposed-configurable",
    authorizedBy: "DEC-SYN-0015",
    authorizedByLabel: { fa: "کارگروه طراحی نهادی (ساختگی)", en: "Institutional Design Working Group (synthetic)" },
    appliesTo: DECISION_DOMAINS,
    thresholds: { infrastructure: 120, healthcare: 100, "economic-policy": 110, "legal-institutional": 130, education: 90, "civic-services": 80 },
    categories: {
      political: { weight: 1, unit: "ballot", counted: true, domainScoped: false },
      professional: { weight: 2, unit: "assessment", counted: true, domainScoped: true },
      endorsement: { weight: 0, unit: "reach-point", counted: false, capPoints: 0, basis: "not counted in this policy" },
      mobilization: { weight: 0, unit: "verified-attendance", counted: false, capPoints: 0 },
      sponsorship: { weight: 4, unit: "sponsorship", counted: true, capPoints: 16 }
    },
    limits: { endorsementShareOfTotal: 0, note: { fa: "تأییدهای عمومی ثبت می‌شوند اما در آستانه شمرده نمی‌شوند.", en: "Endorsements are recorded but do not count toward the threshold." } }
  })
});

export const POLICY_IDS = Object.freeze(Object.keys(WEIGHTING_POLICIES));

const round2 = (value) => Math.round(value * 100) / 100;

export function getPolicy(policyId) {
  const policy = WEIGHTING_POLICIES[policyId];
  if (!policy) {
    throw new Error(`unknown weighting policy: ${policyId}`);
  }
  return policy;
}

/**
 * Sum of the components a ballot is made of. Kept exported so the guarantee
 * can be asserted rather than assumed.
 */
export function assertBallotIsFullyExplained(ballot) {
  const explained = round2(ballot.components.reduce((sum, component) => sum + component.weight, 0));
  return {
    ok: explained === ballot.total,
    explained,
    total: ballot.total
  };
}

/**
 * Political ballot arithmetic.
 *
 * `components` is the complete list of things that may move the number. The
 * only non-fixed component is a scoped delegation whose validity is checked
 * here, so an expired or revoked delegation contributes zero and says why.
 */
export function computePoliticalBallot({ voterId, franchise = true, delegations = [], at = "2026-01-01T00:00:00Z" }, policyId = "P-OPEN-DRAFT") {
  const policy = getPolicy(policyId);
  const components = [];

  if (franchise) {
    components.push({
      id: "base-franchise",
      label: { fa: "برگهٔ پایه (صلاحیت سیاسی)", en: "Base ballot (political franchise)" },
      weight: 1,
      justification: { fa: "یک برگهٔ پایه برای هر مشارکت‌کنندهٔ واجد شرایط؛ بدون ضریب پنهان.", en: "One base ballot per eligible participant, with no hidden multiplier." }
    });
  }

  for (const delegation of delegations) {
    const check = validateDelegation(delegation, { at, actionId: "cast-political-ballot" });
    components.push({
      id: `delegation:${delegation.id}`,
      label: { fa: "واگذاری اختیار در دامنهٔ مشخص", en: "Scoped delegation" },
      weight: check.allowed && typeof delegation.weight === "number" ? delegation.weight : 0,
      justification: check.allowed
        ? { fa: "واگذاری معتبر و در دامنهٔ رأی سیاسی.", en: "Delegation valid and scoped to political balloting." }
        : { fa: check.reason.fa, en: check.reason.en }
    });
  }

  const total = round2(components.reduce((sum, component) => sum + component.weight, 0));

  return {
    kind: "political-ballot",
    voterId,
    total,
    components,
    formula: {
      fa: "برگهٔ سیاسی = برگهٔ پایه + مجموع وزن واگذاری‌های معتبر. تأیید عمومی و شهرت در این فرمول هیچ جمله‌ای ندارد.",
      en: "Political ballot = base ballot + sum of valid delegated weights. Public endorsement and fame have no term in this formula."
    },
    policyId: policy.id,
    authorizedBy: policy.authorizedBy,
    endorsementContribution: 0,
    ballotsCreatedByAdvocacy: 0
  };
}

/**
 * Professional weight, scoped to one decision.
 *
 * A qualifier outside the decision's domain contributes exactly zero, and a
 * declared conflict of interest recuses the assessor. Both outcomes are
 * returned as data, so the interface can explain them.
 */
export function computeProfessionalWeight({ credentialDomain, decisionDomain, experienceYears = 0, conflictOfInterest = false, verified = false }, policyId = "P-OPEN-DRAFT") {
  const policy = getPolicy(policyId);
  const config = policy.categories.professional;
  const components = [];

  if (!verified) {
    components.push({
      id: "credential-unverified",
      label: { fa: "گواهی تأییدنشده", en: "Unverified credential" },
      weight: 0,
      justification: { fa: "گواهی تأییدنشده در تصمیم شمرده نمی‌شود.", en: "An unverified credential does not count." }
    });
    return { kind: "professional-weight", total: 0, components, reason: "unverified", domainMatch: credentialDomain === decisionDomain, policyId: policy.id };
  }

  if (credentialDomain !== decisionDomain) {
    components.push({
      id: "domain-mismatch",
      label: { fa: "ناهمخوانی دامنهٔ تخصص", en: "Domain mismatch" },
      weight: 0,
      justification: {
        fa: "تخصص در دامنهٔ دیگری به این تصمیم قدرت نمی‌دهد.",
        en: "Expertise in another domain grants no authority over this decision."
      }
    });
    return { kind: "professional-weight", total: 0, components, reason: "domain-mismatch", domainMatch: false, policyId: policy.id };
  }

  if (conflictOfInterest) {
    components.push({
      id: "recusal",
      label: { fa: "کناره‌گیری به دلیل تعارض منافع", en: "Recusal for conflict of interest" },
      weight: 0,
      justification: { fa: "تعارض منافع اعلام‌شده، وزن را صفر می‌کند.", en: "A declared conflict of interest sets the weight to zero." }
    });
    return { kind: "professional-weight", total: 0, components, reason: "conflict-recused", domainMatch: true, policyId: policy.id };
  }

  components.push({
    id: "domain-qualification",
    label: { fa: "صلاحیت تخصصی هم‌دامنه", en: "Qualification in the decision's domain" },
    weight: config.weight,
    justification: { fa: `وزن پایهٔ سیاست ${policy.id} برای ارزیابی تخصصی.`, en: `Base weight of policy ${policy.id} for a scoped assessment.` }
  });

  const bonus = Math.min(Math.max(experienceYears, 0) / 20, 1);
  if (bonus > 0) {
    components.push({
      id: "experience-bonus",
      label: { fa: "سابقهٔ حرفه‌ای (حداکثر ۱)", en: "Professional experience (max 1)" },
      weight: round2(bonus),
      justification: { fa: "۲۰ سال سابقه = ۱ واحد؛ سقف سخت ۱ واحد.", en: "20 years of experience = 1 point, hard-capped at 1." }
    });
  }

  return {
    kind: "professional-weight",
    total: round2(components.reduce((sum, component) => sum + component.weight, 0)),
    components,
    reason: "qualified",
    domainMatch: true,
    policyId: policy.id
  };
}

/**
 * Endorsement reach. Returns influence as a separate, attributable quantity —
 * never as a number of ballots.
 */
export function computeEndorsementReach({ endorsementId, advocateId, declaredReach = 0, engagementRate = 0, sponsorshipDisclosed = false, conflicts = [] }, policyId = "P-OPEN-DRAFT") {
  const policy = getPolicy(policyId);
  const config = policy.categories.endorsement;
  const reachPoints = Math.round(Math.max(declaredReach, 0) * Math.min(Math.max(engagementRate, 0), 1));
  const rawPoints = config.counted ? reachPoints * config.weight : 0;
  const points = round2(Math.min(rawPoints, config.capPoints ?? Infinity));

  return {
    kind: "endorsement-reach",
    endorsementId,
    advocateId,
    declaredReach,
    engagementRate,
    reachPoints,
    points,
    counted: config.counted,
    capApplied: config.counted && rawPoints > (config.capPoints ?? Infinity),
    /** Structural guarantee: reach is never converted into individual ballots. */
    ballotsCreated: 0,
    disclosure: { sponsorshipDisclosed, conflicts },
    disclosureComplete: Boolean(sponsorshipDisclosed) && conflicts.every((conflict) => conflict && conflict.declared !== false),
    policyId: policy.id,
    attribution: {
      fa: "این عدد به یک تأییدکنندهٔ نام‌دار نسبت داده می‌شود و برابر با برگهٔ رأی نیست.",
      en: "This figure is attributed to a named endorser and is not a ballot."
    }
  };
}

/**
 * Proposal qualification under one policy.
 *
 * Input contributions are category counts; the function applies the policy's
 * weight, cap and counted flag per category and returns every line, including
 * the categories that contributed nothing.
 */
export function qualifyProposal({ proposalId, domain, contributions = {} }, policyId = "P-OPEN-DRAFT") {
  const policy = getPolicy(policyId);
  if (!policy.appliesTo.includes(domain)) {
    throw new Error(`policy ${policy.id} does not apply to domain ${domain}`);
  }
  const threshold = policy.thresholds[domain];
  const lines = Object.entries(policy.categories).map(([category, config]) => {
    const count = Math.max(contributions[category] ?? 0, 0);
    const raw = count * config.weight;
    const capped = config.counted ? Math.min(raw, config.capPoints ?? Infinity) : 0;
    return {
      category,
      count,
      unitWeight: config.weight,
      unit: config.unit,
      counted: config.counted,
      capPoints: config.capPoints ?? null,
      capApplied: config.counted && raw > (config.capPoints ?? Infinity),
      points: round2(capped)
    };
  });

  const countedLines = lines.filter((line) => line.counted);
  let total = round2(countedLines.reduce((sum, line) => sum + line.points, 0));

  // Endorsement share limit: when the limit would be exceeded, the counted
  // endorsement points are reduced and the reduction is reported as a line.
  const endorsementLine = lines.find((line) => line.category === "endorsement");
  const limit = policy.limits.endorsementShareOfTotal;
  const adjustments = [];
  if (endorsementLine && endorsementLine.counted && total > 0) {
    const share = endorsementLine.points / total;
    if (share > limit) {
      const allowed = round2((limit * (total - endorsementLine.points)) / (1 - limit));
      const reduction = round2(endorsementLine.points - Math.max(allowed, 0));
      endorsementLine.points = Math.max(round2(allowed), 0);
      total = round2(total - reduction);
      adjustments.push({
        id: "endorsement-share-limit",
        reduction,
        limit,
        note: { fa: "سقف سهم تأییدهای عمومی اعمال شد.", en: "The endorsement share limit was applied." }
      });
    }
  }

  const outcome = total >= threshold ? "qualified" : "below-threshold";

  return {
    kind: "proposal-qualification",
    proposalId,
    domain,
    policyId: policy.id,
    policyStatus: policy.status,
    authorizedBy: policy.authorizedBy,
    threshold,
    total,
    outcome,
    margin: round2(total - threshold),
    lines,
    adjustments,
    excluded: lines.filter((line) => !line.counted).map((line) => line.category),
    formula: {
      fa: "امتیاز = مجموع (تعداد × وزن هر دسته، با سقف) و سپس اعمال سقف سهم تأییدهای عمومی.",
      en: "Score = Σ (count × category weight, capped), then the endorsement share limit is applied."
    },
    ballotsUnaffected: true
  };
}

/** Runs the same proposal under every policy, for the comparison view. */
export function comparePolicies(proposal, contributionsByPolicy = {}) {
  return POLICY_IDS.map((policyId) => {
    const contributions = contributionsByPolicy[policyId] ?? contributionsByPolicy.default ?? {};
    return qualifyProposal({ ...proposal, contributions }, policyId);
  });
}

/**
 * Delegation validity. Scope and expiry are checked before any weight is
 * granted, and the returned `transfers` list names what actually moved.
 */
export function validateDelegation(delegation, { at = "2026-01-01T00:00:00Z", actionId } = {}) {
  const deny = (code, reason) => ({ allowed: false, code, reason, transfers: [] });

  if (!delegation || typeof delegation !== "object") {
    return deny("missing-delegation", { fa: "واگذاری وجود ندارد.", en: "No delegation exists." });
  }
  if (delegation.revoked === true) {
    return deny("revoked", { fa: "واگذاری بازپس گرفته شده است.", en: "The delegation has been revoked." });
  }
  if (delegation.consentGiven !== true) {
    return deny("no-consent", { fa: "رضایت هر دو طرف ثبت نشده است.", en: "Both-party consent is not recorded." });
  }
  const start = Date.parse(delegation.startsAt ?? "");
  const expiry = Date.parse(delegation.expiresAt ?? "");
  const moment = Date.parse(at);
  if (Number.isNaN(start) || Number.isNaN(expiry) || Number.isNaN(moment)) {
    return deny("malformed-dates", { fa: "تاریخ‌های واگذاری معتبر نیستند.", en: "The delegation dates are not valid." });
  }
  if (moment < start) {
    return deny("not-yet-valid", { fa: "واگذاری هنوز آغاز نشده است.", en: "The delegation has not started yet." });
  }
  if (moment > expiry) {
    return deny("expired", { fa: "واگذاری منقضی شده است.", en: "The delegation has expired." });
  }
  const scopes = Array.isArray(delegation.scope) ? delegation.scope : [];
  if (actionId && !scopes.includes(actionId)) {
    return deny("out-of-scope", {
      fa: "دامنهٔ واگذاری این اختیار را پوشش نمی‌دهد.",
      en: "The delegation's scope does not cover this authority."
    });
  }
  return {
    allowed: true,
    code: "valid",
    reason: { fa: "واگذاری معتبر و در دامنه است.", en: "The delegation is valid and in scope." },
    transfers: scopes.map((scope) => ({ actionId: scope })),
    expiresAt: delegation.expiresAt
  };
}

/**
 * Posthumous digital-estate mandate. A ballot is never part of the estate, and
 * the check for that is a hard early return rather than a policy setting.
 */
export function evaluatePosthumousMandate({ subjectId, priorConsent = false, scopes = [], reviewRecords = 0, requestedAction, archived = false }) {
  if (requestedAction === "cast-political-ballot") {
    return {
      allowed: false,
      code: "ballot-not-delegable",
      ballotTransfer: "prohibited",
      reason: { fa: "برگهٔ رأی فرد فوت‌شده به هیچ‌کس منتقل نمی‌شود.", en: "A deceased person's ballot transfers to nobody." }
    };
  }
  if (!priorConsent) {
    return {
      allowed: false,
      code: "no-prior-consent",
      ballotTransfer: "prohibited",
      reason: { fa: "بدون رضایت پیشین و مکتوب، هیچ اختیاری واگذار نمی‌شود.", en: "Without prior written consent, no authority is delegated." }
    };
  }
  if (!scopes.includes(requestedAction)) {
    return {
      allowed: false,
      code: "out-of-scope",
      ballotTransfer: "prohibited",
      reason: { fa: "درخواست بیرون از دامنهٔ رضایت است.", en: "The request falls outside the consented scope." }
    };
  }
  if (reviewRecords < 1) {
    return {
      allowed: false,
      code: "no-review",
      ballotTransfer: "prohibited",
      reason: { fa: "دست‌کم یک بازبینی مستقل لازم است.", en: "At least one independent review is required." }
    };
  }
  if (archived) {
    return {
      allowed: false,
      code: "archive-is-separate",
      ballotTransfer: "prohibited",
      reason: { fa: "بایگانی تاریخی از پروندهٔ هستی جدا است.", en: "The historical archive is separate from the digital estate." }
    };
  }
  return {
    allowed: true,
    code: "allowed",
    ballotTransfer: "prohibited",
    subjectId,
    reason: { fa: "رضایت پیشین، دامنه و بازبینی ثبت شده است.", en: "Prior consent, scope and review are all recorded." }
  };
}

/**
 * Action-scoped authorization. Returns a decision plus the audit record the
 * caller must keep; it never returns a boolean alone, because "denied" needs a
 * reason and "allowed" needs a scope.
 */
export function authorizeAction({ level, actionId, actor = null, resource = null }) {
  const policy = ACTION_POLICY[actionId];
  if (!policy) {
    return { allowed: false, code: "unknown-action", reason: { fa: "کنش ناشناخته است.", en: "Unknown action." }, audit: null };
  }
  if (!LEVEL_IDS.includes(level)) {
    return { allowed: false, code: "unknown-level", reason: { fa: "سطح نامعتبر است.", en: "Invalid level." }, audit: null };
  }
  if (!policy.levels.includes(level)) {
    return {
      allowed: false,
      code: "level-not-permitted",
      reason: {
        fa: "این سطح مجاز به انجام این کنش نیست؛ سطح، رتبهٔ افراد نیست.",
        en: "This level is not permitted this action; a level is not a rank."
      },
      audit: null
    };
  }
  if (policy.scope === "self" && resource && resource.ownerId && actor && resource.ownerId !== actor) {
    return {
      allowed: false,
      code: "resource-not-owned",
      reason: { fa: "این رکورد به شخص دیگری تعلق دارد.", en: "This record belongs to someone else." },
      audit: null
    };
  }
  if (policy.scope === "organization" && resource && resource.organizationId && actor && resource.organizationId !== actor) {
    return {
      allowed: false,
      code: "outside-organization",
      reason: { fa: "این کار به سازمان دیگری واگذار شده است.", en: "This work is assigned to another organization." },
      audit: null
    };
  }
  if (policy.scope === "committee" && resource && resource.committeeId && actor && resource.committeeId !== actor) {
    return {
      allowed: false,
      code: "outside-committee",
      reason: { fa: "این پرونده در اختیار کمیتهٔ دیگری است.", en: "This case belongs to another committee." },
      audit: null
    };
  }
  return {
    allowed: true,
    code: "permitted",
    scope: policy.scope,
    reason: { fa: "کنش در چارچوب اختیار این سطح است.", en: "The action is within this level's authority." },
    audit: {
      actor: actor ?? `demo-actor-level-${level}`,
      level,
      actionId,
      scope: policy.scope,
      recordedAt: "2026-01-01T00:00:00Z",
      decisionKind: "synthetic-not-binding"
    }
  };
}

export const INFLUENCE_GUARDS = Object.freeze([
  {
    id: "ballot-no-hidden-factor",
    fa: "هیچ جزء پنهانی برگهٔ رأی سیاسی را تغییر نمی‌دهد؛ مجموع اجزای اعلام‌شده برابر کل است.",
    en: "No hidden component alters a political ballot: the declared components always sum to the total."
  },
  {
    id: "reach-not-ballots",
    fa: "دسترسی عمومی یک تأییدکننده هرگز به برگهٔ رأی افراد تبدیل نمی‌شود.",
    en: "An endorser's public reach never becomes individual ballots."
  },
  {
    id: "professional-scoped",
    fa: "قدرت تخصصی فقط در دامنهٔ همان تصمیم اعمال می‌شود.",
    en: "Professional weight applies only within the decision's own domain."
  },
  {
    id: "policy-configurable",
    fa: "هر سیاست وزن‌دهی پیش‌نویس و قابل تنظیم است تا زمانی که به‌طور رسمی تصویب شود.",
    en: "Every weighting policy remains a configurable draft until formally adopted."
  },
  {
    id: "deceased-ballot",
    fa: "برگهٔ رأی فرد فوت‌شده به هیچ وارث، سازمان یا بازنمایی منتقل نمی‌شود.",
    en: "A deceased person's ballot transfers to no heir, organization or representation."
  },
  {
    id: "level-not-rank",
    fa: "سطح‌ها چارچوب دسترسی و مسئولیت‌اند، نه رتبهٔ برتری افراد.",
    en: "Levels are access and responsibility contexts, not a ranking of people."
  }
]);
