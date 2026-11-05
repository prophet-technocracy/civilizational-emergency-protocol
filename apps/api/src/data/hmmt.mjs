// HMMT demo data: a synthetic ledger, the supply views and the simulation
// endpoints behind `#/bank`.
//
// The ledger is invented. It exists so the arithmetic in `hmmt.mjs` can be
// inspected end to end — deposit → mint, redemption → burn, proof of reserve,
// phase gates — and so the refusals (ceiling reached, queued redemption) are
// reachable in the interface instead of being described in prose.

import {
  ASSET_TIERS,
  CAP_INVARIANTS,
  CAP_POLICIES,
  CAP_POLICY_DEFAULT_ID,
  HAIRCUT_POLICY,
  HMMT_DEFINITION,
  HMMT_INVARIANTS,
  REFERENCE_DATA,
  CIVIC_LEVELS,
  capLadder,
  checkLevelCap,
  computeBasket,
  computeSupplyCeiling,
  resolveLevelCap,
  convertTomanToHmmt,
  distributionPhases,
  proofOfReserve,
  redeemHmmtToToman
} from "@cep/domain-models";

export const HMMT_AS_OF = "2026-10-29T12:00:00Z";
export const HMMT_FEE_BPS = 20;
const TOMAN_PER_TOKEN = HMMT_DEFINITION.tomanPerToken;

export const HMMT_NOTICE = {
  fa: "HMMT یک طراحی پیشنهادی است: پول قانونی، سپردهٔ بانکی یا اوراق بهادار نیست و هیچ نهاد دولتی آن را تأیید نکرده است. دفتر کل زیر ساختگی و محلی است و هیچ توکنی در هیچ زنجیره‌ای ساخته نشده.",
  en: "HMMT is a design proposal: not legal tender, a bank deposit or a security, and authorised by no governmental body. The ledger below is synthetic and local, and no token exists on any chain."
};

/**
 * Synthetic entities and holders behind the ledger. An entity carries its
 * audited budget because one of the cap policies computes its cap from it;
 * a person carries nothing, because the private channel keeps no identity.
 */
export const hmmtEntities = Object.freeze([
  { id: "ENT-SYN-01", level: 4, name: { fa: "خزانه‌داری نمونهٔ الف", en: "Sample Treasury A" }, budgetToman: 1200e12, officer: "OFF-SYN-01", registration: "REG-SYN-01" },
  { id: "ENT-SYN-02", level: 4, name: { fa: "شرکت زیرساخت نمونه", en: "Sample Infrastructure Company" }, budgetToman: 2400e12, officer: "OFF-SYN-02", registration: "REG-SYN-02" },
  { id: "ENT-SYN-03", level: 4, name: { fa: "صندوق توسعهٔ ساختگی", en: "Synthetic Development Fund" }, budgetToman: 600e12, officer: "OFF-SYN-03", registration: "REG-SYN-03" },
  { id: "ENT-SYN-04", level: 4, name: { fa: "خزانه‌داری نمونهٔ ب", en: "Sample Treasury B" }, budgetToman: 6000e12, officer: "OFF-SYN-04", registration: "REG-SYN-04" },
  { id: "ENT-SYN-05", level: 4, name: { fa: "گروه فنی نمونهٔ آب و فاضلاب", en: "Sample Water & Sanitation Group" }, budgetToman: 3000e12, officer: "OFF-SYN-05", registration: "REG-SYN-05" },
  { id: "ENT-SYN-06", level: 4, name: { fa: "بنیاد زیرساخت ساختگی", en: "Synthetic Infrastructure Foundation" }, budgetToman: 1800e12, officer: "OFF-SYN-06", registration: "REG-SYN-06" },
  { id: "ENT-SYN-07", level: 4, name: { fa: "مرکز دادهٔ نمونه", en: "Sample Data Centre" }, budgetToman: 800e12, officer: "OFF-SYN-07", registration: "REG-SYN-07" }
]);

/** Synthetic deposits. `settled` entries have minted tokens; `pending` have not. */
export const hmmtDeposits = Object.freeze([
  { id: "DEP-SYN-0001", at: "2026-08-02T08:10:00Z", toman: 120e12, status: "settled", level: 4, entityId: "ENT-SYN-01", channel: { fa: "شعبهٔ آزمایشی", en: "Pilot branch" } },
  { id: "DEP-SYN-0002", at: "2026-08-14T11:42:00Z", toman: 240e12, status: "settled", level: 4, entityId: "ENT-SYN-02", channel: { fa: "شعبهٔ آزمایشی", en: "Pilot branch" } },
  { id: "DEP-SYN-0003", at: "2026-08-29T09:05:00Z", toman: 60e12, status: "settled", level: 4, entityId: "ENT-SYN-03", channel: { fa: "شعبهٔ آزمایشی", en: "Pilot branch" } },
  // Two personal deposits at the personal cap: the private channel records a
  // holder reference, never a name.
  { id: "DEP-SYN-0008", at: "2026-09-04T10:12:00Z", toman: 50e9, status: "settled", level: 2, holderRef: "HLD-SYN-01", channel: { fa: "کانال خصوصی", en: "Private channel" } },
  { id: "DEP-SYN-0009", at: "2026-09-06T17:48:00Z", toman: 50e9, status: "settled", level: 3, holderRef: "HLD-SYN-02", channel: { fa: "کانال خصوصی", en: "Private channel" } },
  { id: "DEP-SYN-0004", at: "2026-09-09T14:20:00Z", toman: 500e12, status: "settled", level: 4, entityId: "ENT-SYN-04", channel: { fa: "پنجرهٔ خزانه", en: "Treasury window" } },
  { id: "DEP-SYN-0005", at: "2026-09-27T10:31:00Z", toman: 300e12, status: "settled", level: 4, entityId: "ENT-SYN-05", channel: { fa: "شعبهٔ آزمایشی", en: "Pilot branch" } },
  { id: "DEP-SYN-0006", at: "2026-10-12T13:55:00Z", toman: 180e12, status: "settled", level: 4, entityId: "ENT-SYN-06", channel: { fa: "پنجرهٔ خزانه", en: "Treasury window" } },
  { id: "DEP-SYN-0007", at: "2026-10-26T09:44:00Z", toman: 80e12, status: "pending", level: 4, entityId: "ENT-SYN-07", channel: { fa: "شعبهٔ آزمایشی", en: "Pilot branch" } }
]);

/** Synthetic redemptions. `queued` means the request waits for cash, not that it was refused. */
export const hmmtRedemptions = Object.freeze([
  { id: "RED-SYN-0001", at: "2026-09-30T15:02:00Z", tokens: 25, status: "settled" },
  { id: "RED-SYN-0002", at: "2026-10-18T12:26:00Z", tokens: 15, status: "settled" },
  { id: "RED-SYN-0003", at: "2026-10-28T16:40:00Z", tokens: 12, status: "queued", reason: { fa: "پنجرهٔ نقدینگی روزانه پر شده است.", en: "The daily cash window is exhausted." } }
]);

const round2 = (value) => Math.round(value * 100) / 100;
const round6 = (value) => Math.round(value * 1e6) / 1e6;

const settledDeposits = hmmtDeposits.filter((entry) => entry.status === "settled");
const settledRedemptions = hmmtRedemptions.filter((entry) => entry.status === "settled");
const queuedRedemptions = hmmtRedemptions.filter((entry) => entry.status === "queued");

const depositGrossTokens = settledDeposits.reduce((sum, entry) => sum + entry.toman / TOMAN_PER_TOKEN, 0);
const depositFeeTokens = (depositGrossTokens * HMMT_FEE_BPS) / 10000;
const mintedTokens = depositGrossTokens - depositFeeTokens;
const burnedTokens = settledRedemptions.reduce((sum, entry) => sum + entry.tokens, 0);

export const circulatingSupply = round2(mintedTokens - burnedTokens);
export const tomanReserve = round2(settledDeposits.reduce((sum, entry) => sum + entry.toman, 0) - settledRedemptions.reduce((sum, entry) => sum + entry.tokens * TOMAN_PER_TOKEN, 0));
const queuedTokens = round2(queuedRedemptions.reduce((sum, entry) => sum + entry.tokens, 0));
/** The bank pays redemptions out of a daily cash window, not out of thin air. */
export const cashWindowToman = 40e12;
const redemptionFeeToman = settledRedemptions.reduce((sum, entry) => sum + (entry.tokens * TOMAN_PER_TOKEN * HMMT_FEE_BPS) / 10000, 0);

export const basket = computeBasket();
export const ceiling = computeSupplyCeiling({ basket });

/** Ledger summary: what the bank holds, what it owes, and what it has queued. */
export function buildHmmtLedger() {
  return {
    asOf: HMMT_AS_OF,
    synthetic: true,
    feeBps: HMMT_FEE_BPS,
    cashWindowToman,
    entries: [
      ...hmmtDeposits.map((entry) => ({
        ...entry,
        kind: "deposit",
        capTokens: resolveLevelCap({
          policyId: CAP_POLICY_DEFAULT_ID,
          level: entry.level,
          entityBudgetToman: entry.entityId ? hmmtEntities.find((entity) => entity.id === entry.entityId)?.budgetToman : undefined,
          ceilingTokens: ceiling.ceilingTokens
        }).capTokens,
        // Settled deposits report the tokens they actually minted (net of the
        // fee); a pending deposit has minted nothing and reports null.
        tokens: entry.status === "settled" ? round6((entry.toman / TOMAN_PER_TOKEN) * (1 - HMMT_FEE_BPS / 10000)) : null
      })),
      ...hmmtRedemptions.map((entry) => ({
        ...entry,
        kind: "redemption",
        toman: round2(entry.tokens * TOMAN_PER_TOKEN),
        reason: entry.reason ?? null
      }))
    ].sort((a, b) => (a.at < b.at ? 1 : -1)),
    totals: {
      depositsSettledToman: round2(settledDeposits.reduce((sum, entry) => sum + entry.toman, 0)),
      depositsPendingToman: round2(hmmtDeposits.filter((entry) => entry.status === "pending").reduce((sum, entry) => sum + entry.toman, 0)),
      mintedTokens: round2(mintedTokens),
      burnedTokens: round2(burnedTokens),
      queuedTokens,
      queuedToman: round2(queuedTokens * TOMAN_PER_TOKEN),
      feeRevenueToman: round2(depositFeeTokens * TOMAN_PER_TOKEN + redemptionFeeToman)
    },
    notes: [
      { fa: "واریز «در انتظار» هنوز توکن نساخته است؛ فقط واریز تسویه‌شده می‌شمارد.", en: "A pending deposit has minted nothing; only settled deposits count." },
      { fa: "کارمزد در واحد توکن کسر می‌شود و تومانِ متناظر در ذخیره می‌ماند؛ همین مازاد، درآمد عملیاتی بانک است.", en: "The fee is deducted in tokens, so the matching toman stays in reserve; that surplus is the bank's operating revenue." },
      { fa: "درخواست در صف، رد نشده است: با ترتیب زمانی و به‌محض رسیدن نقدینگی پرداخت می‌شود.", en: "A queued request is not a refusal: it is paid in timestamp order as cash arrives." }
    ]
  };
}

/** Ceiling, circulating supply and the distance between them. */
export function buildHmmtSupply() {
  const utilisation = circulatingSupply / ceiling.ceilingTokens;
  const phases = distributionPhases({ ceilingTokens: ceiling.ceilingTokens });
  const currentPhase = phases.find((phase) => circulatingSupply <= phase.cumulativeTokens) ?? phases.at(-1);
  return {
    definition: HMMT_DEFINITION,
    ceiling: {
      tokens: ceiling.ceilingTokens,
      usdPerToken: ceiling.usdPerToken,
      usdValue: round2(ceiling.ceilingTokens * ceiling.usdPerToken),
      fxRate: ceiling.fxRate,
      formula: ceiling.formula
    },
    circulating: {
      tokens: circulatingSupply,
      tomanValue: round2(circulatingSupply * TOMAN_PER_TOKEN),
      usdValue: round2((circulatingSupply * TOMAN_PER_TOKEN) / ceiling.fxRate),
      utilisation: Math.round(utilisation * 1e6) / 1e6,
      remainingTokens: round2(ceiling.ceilingTokens - circulatingSupply)
    },
    phases,
    currentPhaseId: currentPhase.id,
    capPolicyId: CAP_POLICY_DEFAULT_ID,
    perPersonCapTokens: phases[0].perPersonCapTokens,
    ladder: capLadder({ ceilingTokens: ceiling.ceilingTokens }),
    sources: REFERENCE_DATA.sources,
    asOf: HMMT_AS_OF
  };
}

/** The backing basket, tier by tier, with every haircut step visible. */
export function buildHmmtBacking() {
  return {
    policy: HAIRCUT_POLICY,
    tiers: ASSET_TIERS,
    verificationRationale: HAIRCUT_POLICY.verificationRationale,
    basket,
    ceiling: ceiling.ceilingTokens,
    referenceData: {
      asOf: REFERENCE_DATA.asOf,
      fxFreeMarketTomanPerUsd: REFERENCE_DATA.fxFreeMarketTomanPerUsd,
      fxOfficialTomanPerUsd: REFERENCE_DATA.fxOfficialTomanPerUsd,
      gdpUsd: REFERENCE_DATA.gdpUsd,
      householdWealthUsd: REFERENCE_DATA.householdWealthUsd,
      oilReservesBillionBarrels: REFERENCE_DATA.oilReservesBillionBarrels,
      gasReservesTcm: REFERENCE_DATA.gasReservesTcm,
      sources: REFERENCE_DATA.sources
    },
    excluded: [basket.gdpExcluded, basket.privateWealthExcluded]
  };
}

/** Proof of reserve, plus the two ratios and the invariants they test. */
export function buildHmmtReserve() {
  const proof = proofOfReserve({
    circulatingTokens: circulatingSupply,
    tomanReserve,
    ceilingTokens: ceiling.ceilingTokens,
    netBackingUsd: basket.netUsd
  });
  return {
    ...proof,
    tomanReserveValueUsd: round2(tomanReserve / ceiling.fxRate),
    netBackingUsd: basket.netUsd,
    queuedTokens,
    queuedToman: round2(queuedTokens * TOMAN_PER_TOKEN),
    invariants: [...proof.invariants, ...HMMT_INVARIANTS.map((item) => ({ id: item.id, ok: true, statement: { fa: item.fa, en: item.en }, design: true }))],
    notice: HMMT_NOTICE,
    asOf: HMMT_AS_OF
  };
}

/**
 * Simulates one operation and reports the state it would leave behind, so a
 * refusal is visible as a refusal rather than as a silently clamped number.
 */
export function simulateHmmt({ action, amount, level, policyId, entityId }) {
  const value = Number(amount);
  const policy = policyId ?? CAP_POLICY_DEFAULT_ID;
  const entity = entityId ? hmmtEntities.find((item) => item.id === entityId) ?? null : null;

  if (action === "convert") {
    const requestedLevel = Number(level);
    const requested = Number.isFinite(value) ? value : 0;
    const cap = checkLevelCap({
      policyId: policy,
      level: requestedLevel,
      // The cap is checked against the *requested* amount, which is stricter
      // than the net amount: the fee can never push a holder past the cap.
      amountTokens: requested,
      entityBudgetToman: entity?.budgetToman,
      ceilingTokens: ceiling.ceilingTokens
    });
    const conversion = convertTomanToHmmt({
      toman: requested * TOMAN_PER_TOKEN,
      feeBps: HMMT_FEE_BPS,
      ceilingTokens: ceiling.ceilingTokens,
      circulatingTokens: circulatingSupply
    });

    const shield = {
      action,
      level: Number.isInteger(requestedLevel) ? requestedLevel : null,
      policyId: policy,
      entity: entity ? { id: entity.id, budgetToman: entity.budgetToman } : null,
      input: { tokens: Number.isFinite(value) ? value : null }
    };

    // Which limit binds? A holder is stopped by the smaller of their level cap
    // and the system's remaining ceiling capacity. Reporting the wrong one
    // would send them to fix a number that was never the problem.
    if (!cap.allowed) {
      const capValue = cap.resolved?.capTokens ?? null;
      const capacity = ceiling.ceilingTokens - circulatingSupply;
      if (capValue !== null && capacity < capValue) {
        return {
          ...shield,
          result: { allowed: false, code: "ceiling-reached", capacity, reason: conversion.reason ?? null },
          cap: cap.resolved ?? null,
          after: null
        };
      }
      return {
        ...shield,
        result: {
          allowed: false,
          code: cap.code,
          reason: cap.reason,
          capTokens: cap.capTokens ?? capValue,
          headroomTokens: cap.headroomTokens ?? null,
          excessTokens: cap.excessTokens ?? null,
          requires: cap.resolved?.requires ?? null
        },
        cap: cap.resolved ?? null,
        after: null
      };
    }
    if (!conversion.allowed) {
      return { ...shield, result: conversion, cap: cap.resolved, after: null };
    }
    return {
      ...shield,
      result: conversion,
      cap: cap.resolved,
      capHeadroomTokens: round6(cap.headroomTokens ?? 0),
      after: proofOfReserve({
        circulatingTokens: conversion.newCirculatingTokens,
        tomanReserve: tomanReserve + requested * TOMAN_PER_TOKEN,
        ceilingTokens: ceiling.ceilingTokens,
        netBackingUsd: basket.netUsd
      })
    };
  }

  if (action === "redeem") {
    const result = redeemHmmtToToman({
      tokens: value,
      feeBps: HMMT_FEE_BPS,
      circulatingTokens: circulatingSupply,
      tomanReserve,
      cashWindowToman
    });
    return {
      action,
      level: null,
      policyId: policy,
      input: { tokens: Number.isFinite(value) ? value : null },
      result,
      // Stated on the payload, not only in the docs: an exit is never gated.
      cap: { capKind: "not-applicable", note: { fa: "بازخرید سقف سطح ندارد.", en: "Redemption has no level cap." } },
      after: result.allowed
        ? proofOfReserve({
            circulatingTokens: result.newCirculatingTokens,
            tomanReserve: tomanReserve - result.netToman,
            ceilingTokens: ceiling.ceilingTokens,
            netBackingUsd: basket.netUsd
          })
        : null
    };
  }

  return {
    action,
    level: null,
    policyId: policy,
    input: { tokens: Number.isFinite(value) ? value : null },
    result: { allowed: false, code: "unknown-action", reason: { fa: "کنش شناخته نشد.", en: "Unknown action." } },
    after: null
  };
}

const levelTitle = (level) => CIVIC_LEVELS.find((item) => item.id === level)?.title ?? { fa: String(level), en: String(level) };

/**
 * The cap ladder under every draft policy, resolved for the demo's entities.
 * Shown as a comparison table so "diverse and flexible" is inspectable rather
 * than asserted.
 */
export function buildHmmtCaps() {
  const biggestEntity = hmmtEntities.reduce((winner, entity) => (entity.budgetToman > winner.budgetToman ? entity : winner), hmmtEntities[0]);
  return {
    defaultPolicyId: CAP_POLICY_DEFAULT_ID,
    levels: [1, 2, 3, 4, 5].map((level) => ({ level, title: levelTitle(level) })),
    policies: CAP_POLICIES.map((policy) => ({
      id: policy.id,
      label: policy.label,
      status: policy.status,
      authorizedBy: policy.authorizedBy,
      basis: policy.basis,
      summary: policy.summary,
      cells: [1, 2, 3, 4, 5].map((level) => {
        const resolved = resolveLevelCap({
          policyId: policy.id,
          level,
          ceilingTokens: ceiling.ceilingTokens,
          // The entity-scaled policy needs a number to be comparable; the
          // biggest registered entity is used and named in the cell.
          entityBudgetToman: biggestEntity.budgetToman
        });
        return {
          level,
          code: resolved.code,
          capTokens: resolved.capTokens,
          capKind: resolved.capKind,
          requires: resolved.requires,
          disclosure: resolved.disclosure,
          note: resolved.note,
          hardCapApplied: resolved.hardCapApplied,
          entityId: level === 4 && resolved.capKind === "formula" ? biggestEntity.id : null,
          entityName: level === 4 && resolved.capKind === "formula" ? biggestEntity.name : null,
          entityBudgetToman: level === 4 && resolved.capKind === "formula" ? biggestEntity.budgetToman : null
        };
      })
    })),
    entities: hmmtEntities,
    // One flat lookup for the interface: every (policy, level, entity) triple
    // the simulator can ask about, resolved once on the server so the client
    // never re-implements the formula.
    matrix: CAP_POLICIES.flatMap((policy) =>
      [1, 2, 3, 4, 5].flatMap((level) => {
        const usesEntity = Boolean(policy.levels[level]?.formula);
        const budgets = usesEntity ? hmmtEntities.map((entity) => ({ entityId: entity.id, budgetToman: entity.budgetToman })) : [{ entityId: null, budgetToman: undefined }];
        return budgets.map(({ entityId, budgetToman }) => {
          const resolved = resolveLevelCap({ policyId: policy.id, level, ceilingTokens: ceiling.ceilingTokens, entityBudgetToman: budgetToman });
          return {
            policyId: policy.id,
            level,
            entityId,
            code: resolved.code,
            capTokens: resolved.capTokens,
            capKind: resolved.capKind,
            requires: resolved.requires ?? null,
            disclosure: resolved.disclosure ?? false,
            hardCapApplied: resolved.hardCapApplied ?? false
          };
        });
      })
    ),
    invariants: CAP_INVARIANTS,
    notes: [
      { fa: "سطح ۲ و ۳ در همهٔ سیاست‌ها سقف یکسان دارند؛ مشارکت سقف مالی نمی‌خرد.", en: "Levels 2 and 3 carry the same cap under every policy; participation buys no financial headroom." },
      { fa: "سقف نهاد به اعضای نهاد نمی‌رسد و برای هر عضو، سقف شخصی خودش اعمال می‌شود.", en: "An entity's cap does not reach its members; each member keeps the personal cap." },
      { fa: "سقف فقط خرید را محدود می‌کند؛ بازخرید هرگز به سطح وابسته نیست.", en: "A cap limits acquisition only; redemption never depends on a level." }
    ],
    asOf: HMMT_AS_OF
  };
}

/** One payload for the bank screen. */
export function buildHmmtOverview() {
  return {
    notice: HMMT_NOTICE,
    asOf: HMMT_AS_OF,
    supply: buildHmmtSupply(),
    backing: buildHmmtBacking(),
    reserve: buildHmmtReserve(),
    ledger: buildHmmtLedger(),
    caps: buildHmmtCaps(),
    design: {
      status: HMMT_DEFINITION.status,
      network: HMMT_DEFINITION.network,
      invariants: HMMT_INVARIANTS,
      governanceAsymmetry: {
        fa: "کاهش سقف عرضه فوری اجرا می‌شود؛ افزایش سقف نیازمند رأی اکثریت ویژه و مهلت ۳۰ روزه است.",
        en: "Lowering the supply ceiling takes effect immediately; raising it needs a supermajority and a 30-day timelock."
      }
    }
  };
}
