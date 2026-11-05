// HMMT demo data: a synthetic ledger, the supply views and the simulation
// endpoints behind `#/bank`.
//
// The ledger is invented. It exists so the arithmetic in `hmmt.mjs` can be
// inspected end to end — deposit → mint, redemption → burn, proof of reserve,
// phase gates — and so the refusals (ceiling reached, queued redemption) are
// reachable in the interface instead of being described in prose.

import {
  ASSET_TIERS,
  HAIRCUT_POLICY,
  HMMT_DEFINITION,
  HMMT_INVARIANTS,
  REFERENCE_DATA,
  computeBasket,
  computeSupplyCeiling,
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

/** Synthetic deposits. `settled` entries have minted tokens; `pending` have not. */
export const hmmtDeposits = Object.freeze([
  { id: "DEP-SYN-0001", at: "2026-08-02T08:10:00Z", toman: 120e12, status: "settled", channel: { fa: "شعبهٔ آزمایشی", en: "Pilot branch" } },
  { id: "DEP-SYN-0002", at: "2026-08-14T11:42:00Z", toman: 240e12, status: "settled", channel: { fa: "شعبهٔ آزمایشی", en: "Pilot branch" } },
  { id: "DEP-SYN-0003", at: "2026-08-29T09:05:00Z", toman: 60e12, status: "settled", channel: { fa: "شعبهٔ آزمایشی", en: "Pilot branch" } },
  { id: "DEP-SYN-0004", at: "2026-09-09T14:20:00Z", toman: 500e12, status: "settled", channel: { fa: "پنجرهٔ خزانه", en: "Treasury window" } },
  { id: "DEP-SYN-0005", at: "2026-09-27T10:31:00Z", toman: 300e12, status: "settled", channel: { fa: "شعبهٔ آزمایشی", en: "Pilot branch" } },
  { id: "DEP-SYN-0006", at: "2026-10-12T13:55:00Z", toman: 180e12, status: "settled", channel: { fa: "پنجرهٔ خزانه", en: "Treasury window" } },
  { id: "DEP-SYN-0007", at: "2026-10-26T09:44:00Z", toman: 80e12, status: "pending", channel: { fa: "شعبهٔ آزمایشی", en: "Pilot branch" } }
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
    perPersonCapTokens: phases[0].perPersonCapTokens,
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
export function simulateHmmt({ action, amount }) {
  const value = Number(amount);
  if (action === "convert") {
    const result = convertTomanToHmmt({
      toman: value,
      feeBps: HMMT_FEE_BPS,
      ceilingTokens: ceiling.ceilingTokens,
      circulatingTokens: circulatingSupply
    });
    return {
      action,
      input: { toman: Number.isFinite(value) ? value : null },
      result,
      after: result.allowed
        ? proofOfReserve({
            circulatingTokens: result.newCirculatingTokens,
            tomanReserve: tomanReserve + value,
            ceilingTokens: ceiling.ceilingTokens,
            netBackingUsd: basket.netUsd
          })
        : null
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
      input: { tokens: Number.isFinite(value) ? value : null },
      result,
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
  return { action, input: { amount: Number.isFinite(value) ? value : null }, result: { allowed: false, code: "unknown-action", reason: { fa: "کنش شناخته نشد.", en: "Unknown action." } }, after: null };
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
