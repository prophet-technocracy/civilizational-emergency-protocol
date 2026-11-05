// HMMT — Hezar Miliyard Toman (هزار میلیارد تومان): supply, backing and
// conversion arithmetic.
//
// One token is defined as exactly 1,000,000,000,000 toman. That definition is
// the anchor of the whole design: the token is a toman-denominated unit, so its
// dollar value floats with the free-market rate while its toman value is fixed
// by definition.
//
// Everything here is pure and the numbers are inputs, not constants hidden in
// code. Three rules are structural rather than configurable, and each is
// asserted in the tests:
//
//   1. No token exists without a matching toman deposit. Minting is a balance-
//      sheet exchange, never a grant.
//   2. Circulating supply can never exceed the asset-backed ceiling.
//   3. A haircut chain converts a headline "resource wealth" figure into a
//      backing number. A gross in-situ estimate is never used as backing.

export const HMMT_DEFINITION = Object.freeze({
  code: "HMMT",
  nameFa: "هزار میلیارد تومان",
  nameEn: "Thousand Billion Toman",
  tomanPerToken: 1e12,
  /** 1 HMMT = 1e9 base units → one base unit is 1,000 toman. */
  decimals: 9,
  baseUnitToman: 1000,
  status: "proposed-design",
  legalPosture: {
    fa: "این طراحی پیشنهادی است. HMMT پول قانونی، سپردهٔ بانکی، اوراق بهادار یا تعهد قابل‌معامله نیست و هیچ نهاد دولتی آن را تأیید نکرده است.",
    en: "This is a design proposal. HMMT is not legal tender, a bank deposit, a security, or a tradeable claim, and no governmental body has authorised it."
  },
  network: {
    firstStage: { chain: "TON", standard: "Jetton (TEP-74)", reason: { fa: "شفافیت عمومی و هزینهٔ پایین تراکنش در مرحلهٔ اول.", en: "Public verifiability and low transaction cost in stage one." } },
    targetStage: {
      chain: "permissioned sovereign chain",
      reason: { fa: "انتقال به زنجیرهٔ اختصاصی با همان دفتر کل و امکان خروج کاربر.", en: "Migration to a dedicated chain with the same ledger and a user exit path." },
      exitCriteria: [
        { fa: "انتشار ریشهٔ اثبات ذخیره در هر دو زنجیره در دورهٔ هم‌پوشانی.", en: "Publish the proof-of-reserve root on both chains during the overlap." },
        { fa: "امکان خروج یک‌طرفهٔ دارنده بدون اجازهٔ میزبان.", en: "Holders can exit unilaterally, with no host permission." },
        { fa: "کد قرارداد و آزمون‌های آن به‌صورت مستقل بازبینی شده باشد.", en: "Contract code and tests independently reviewed." }
      ]
    }
  }
});

/** Verified reference data. Each figure carries its source and its epistemic status. */
export const REFERENCE_DATA = Object.freeze({
  asOf: "2026-10-29",
  fxFreeMarketTomanPerUsd: 269305,
  fxOfficialTomanPerUsd: 173660.9,
  gdpUsd: 371.1e9,
  householdWealthUsd: 3e12,
  oilReservesBillionBarrels: 208.6,
  gasReservesTcm: 34,
  sources: [
    { id: "SRC-FX", value: { fa: "۲۶۹٬۳۰۵ تومان برای هر دلار، بازار آزاد", en: "269,305 toman per USD, free market" }, asOf: "2026-10-29", status: "source-reported", note: { fa: "نرخ بازار آزاد؛ نرخ رسمی ۱۷۳٬۶۶۱ تومان است.", en: "Free-market rate; the official rate is 173,661 toman." } },
    { id: "SRC-GDP", value: { fa: "۳۷۱٫۱ میلیارد دلار تولید ناخالص داخلی (۲۰۲۵)", en: "USD 371.1 bn nominal GDP (2025)" }, asOf: "2025", status: "source-reported", note: { fa: "تولید ناخالص داخلی یک جریان است، نه دارایی؛ در پشتوانه شمرده نمی‌شود.", en: "GDP is a flow, not an asset; it is excluded from backing." } },
    { id: "SRC-RESOURCES", value: { fa: "۲۷٫۳ تریلیون دلار ثروت منابع و معادن (برآورد رسمی ایران)", en: "USD 27.3 tn natural and mineral wealth (official Iranian estimate)" }, asOf: "2025", status: "source-reported", note: { fa: "ارزش ناخالص در جا، بدون کسر هزینهٔ استخراج و تنزیل زمانی؛ همین عدد در زنجیرهٔ کسر تعدیل می‌شود.", en: "Gross in-situ value before extraction cost and time discount; the haircut chain exists to adjust exactly this figure." } },
    { id: "SRC-OIL", value: { fa: "۲۰۸٫۶ میلیارد بشکه ذخیرهٔ اثبات‌شدهٔ نفت (پایان ۲۰۲۴)", en: "208.6 bn barrels proven oil reserves (end-2024)" }, asOf: "2024", status: "source-reported", note: { fa: "منبع: OPEC Annual Statistical Bulletin 2025.", en: "Source: OPEC Annual Statistical Bulletin 2025." } },
    { id: "SRC-WEALTH", value: { fa: "۳ تریلیون دلار ثروت خصوصی خانوارها", en: "USD 3 tn private household wealth" }, asOf: "2025", status: "source-reported", note: { fa: "ثروت خصوصی است، نه دارایی عمومی؛ به همین دلیل پشتوانهٔ توکن عمومی نمی‌شود.", en: "Private wealth, not public assets, so it cannot back a public token." } },
    { id: "SRC-RESERVES", value: { fa: "ذخایر ارزی در دسترس بانک مرکزی: برآورد تأییدنشده", en: "Accessible central-bank FX reserves: unverified estimate" }, asOf: "2026", status: "unverified-estimate", note: { fa: "هیچ گزارش عمومی معتبری برای این رقم وجود ندارد؛ پیش‌فرض، وزن صفر دارد.", en: "No credible public report exists for this figure; it carries zero weight by default." } }
  ]
});

/**
 * Asset tiers. `status` decides how much of a tier may count:
 * audited ×1, source-reported ×0.5, unverified-estimate ×0.
 */
export const ASSET_TIERS = Object.freeze([
  {
    id: "T1",
    name: { fa: "ذخایر پولی در دسترس", en: "Accessible liquid reserves" },
    grossUsd: 15e9,
    status: "unverified-estimate",
    sourceId: "SRC-RESERVES",
    note: { fa: "نقدشونده‌ترین رده، اما کم‌ترین شفافیت عمومی.", en: "Most liquid tier, least publicly verifiable." }
  },
  {
    id: "T2",
    name: { fa: "دارایی‌های قابل‌فروش دولتی", en: "Marketable state assets" },
    grossUsd: 120e9,
    status: "unverified-estimate",
    sourceId: null,
    note: { fa: "ساختمان‌ها، شرکت‌های دولتی و طلا؛ نیازمند ثبت و ارزیابی مستقل.", en: "Buildings, state enterprises and gold; needs a registry and independent valuation." }
  },
  {
    id: "T3",
    name: { fa: "منابع در جا (نفت، گاز، معدن)", en: "In-situ resources (oil, gas, minerals)" },
    grossUsd: 27.3e12,
    status: "source-reported",
    sourceId: "SRC-RESOURCES",
    note: { fa: "بزرگ‌ترین رقم و کم‌ترین نقدشوندگی؛ بیشترین کسر روی این رده اعمال می‌شود.", en: "Largest figure, least liquid; this tier absorbs the heaviest haircuts." }
  }
]);

/**
 * The haircut chain. Every step is visible, ordered and configurable; the point
 * is that a 27.3 trillion headline becomes a defensible backing number instead
 * of a marketing figure.
 */
export const HAIRCUT_POLICY = Object.freeze({
  id: "HC-DRAFT-01",
  status: "proposed-configurable",
  authorizedBy: "DEC-SYN-0041",
  steps: [
    { id: "recovery-factor", kind: "multiply", factor: 0.25, appliesTo: ["T3"], label: { fa: "ضریب بازیافت اقتصادی (۲۵٪)", en: "Economically recoverable fraction (25%)" }, rationale: { fa: "بخشی از ذخیره که با فناوری و قیمت امروز قابل استخراج است.", en: "The share of the reserve extractable at today's technology and prices." } },
    { id: "extraction-cost", kind: "deduct", factor: 0.45, appliesTo: ["T3"], label: { fa: "کسر هزینهٔ استخراج و توسعه (۴۵٪)", en: "Extraction and development cost (45%)" }, rationale: { fa: "ارزش در جا با هزینهٔ رساندن به بازار یکی نیست.", en: "In-situ value is not value delivered to market." } },
    { id: "time-value", kind: "multiply", factor: 0.75, appliesTo: ["T1", "T2", "T3"], label: { fa: "ارزش زمانی تولید ۴۰ ساله", en: "Time value over a 40-year production horizon" }, rationale: { fa: "ارزش امروزِ تولیدی که در چهار دهه پخش می‌شود.", en: "Present value of output spread over four decades." } },
    { id: "legal-transfer", kind: "multiply", factor: 0.5, appliesTo: ["T2", "T3"], label: { fa: "قابلیت انتقال حقوقی (۵۰٪)", en: "Legal transferability (50%)" }, rationale: { fa: "تحریم، مالکیت مورد اختلاف و محدودیت صادرات.", en: "Sanctions, disputed ownership and export limits." } },
    { id: "asset-liquidity", kind: "multiply", factor: 0.85, appliesTo: ["T2"], label: { fa: "کسر نقدشوندگی (۱۵٪)", en: "Liquidity discount (15%)" }, rationale: { fa: "فروش دارایی دولتی همیشه با تخفیف و زمان همراه است.", en: "Selling state assets always costs time and a discount." } }
  ],
  verificationMultipliers: { audited: 1, "source-reported": 0.5, "unverified-estimate": 0 },
  /** Why a tier's own status caps what it may contribute, whatever its size. */
  verificationRationale: {
    audited: { fa: "رده‌ای که حسابرس مستقل تأیید کرده است، کامل شمرده می‌شود.", en: "A tier an independent auditor has signed counts in full." },
    "source-reported": { fa: "رقمی که فقط از یک منبع رسمی گزارش شده، نیمی از خودش می‌شمارد.", en: "A figure reported by an official source but not audited counts at half." },
    "unverified-estimate": { fa: "رقمی که منبع قابل بررسی ندارد، هرچقدر بزرگ باشد صفر می‌شمارد.", en: "A figure with no checkable source counts as zero, however large it is." }
  },
  /** Stress scenarios applied to the whole basket, used by the risk view. */
  stress: {
    "fx-halves": { id: "fx-halves", label: { fa: "نصف شدن ارزش تومان", en: "Toman halves in value" }, fxFactor: 0.5 },
    "resources-30": { id: "resources-30", label: { fa: "کاهش ۳۰٪ ارزش منابع", en: "Resource values fall 30%" }, tierFactor: { T3: 0.7 } }
  }
});

const round2 = (value) => Math.round(value * 100) / 100;
// Ratios keep six decimals: rounding 0.0072 to 0.01 would turn "0.7 % of the
// ceiling in use" into "1 %", which is a different claim.
const round6 = (value) => Math.round(value * 1e6) / 1e6;
const num = (value) => (Number.isFinite(value) ? value : 0);

/** Applies the haircut chain to one tier and returns every step, in order. */
export function applyHaircuts(tier, policy = HAIRCUT_POLICY) {
  let value = num(tier.grossUsd);
  const steps = [];
  for (const step of policy.steps) {
    if (!step.appliesTo.includes(tier.id)) continue;
    const before = value;
    value = step.kind === "deduct" ? value * (1 - step.factor) : value * step.factor;
    steps.push({ id: step.id, label: step.label, factor: step.factor, kind: step.kind, before, after: value });
  }
  const multiplier = policy.verificationMultipliers[tier.status] ?? 0;
  const verified = value * multiplier;
  steps.push({
    id: "verification",
    // The status itself is rendered by the interface, translated: putting the
    // raw enum into the label leaked "unverified-estimate" into Persian copy.
    label: { fa: "ضریب اعتبارسنجی", en: "Verification multiplier" },
    factor: multiplier,
    kind: "multiply",
    before: value,
    after: verified
  });
  return {
    tierId: tier.id,
    name: tier.name,
    status: tier.status,
    grossUsd: num(tier.grossUsd),
    netUsd: round2(verified),
    counted: multiplier > 0,
    steps
  };
}

/**
 * The whole backing basket. `includeUnverified` only changes which tiers are
 * reported, never the arithmetic: an unverified tier always contributes zero.
 */
export function computeBasket({ policy = HAIRCUT_POLICY, tiers = ASSET_TIERS } = {}) {
  const lines = tiers.map((tier) => applyHaircuts(tier, policy));
  const netUsd = lines.reduce((sum, line) => sum + line.netUsd, 0);
  const grossUsd = lines.reduce((sum, line) => sum + line.grossUsd, 0);
  // Only the tiers that can be counted have a gross figure worth quoting: a
  // 27.3 tn headline next to a 0 net contribution is a marketing slide.
  const countedGrossUsd = lines.filter((line) => line.counted).reduce((sum, line) => sum + line.grossUsd, 0);
  return {
    policyId: policy.id,
    policyStatus: policy.status,
    lines,
    grossUsd: round2(grossUsd),
    countedGrossUsd: round2(countedGrossUsd),
    netUsd: round2(netUsd),
    /** How much of the counted gross figure survives the chain. */
    survivalRatio: countedGrossUsd > 0 ? round6(netUsd / countedGrossUsd) : 0,
    excludedTiers: lines.filter((line) => !line.counted).map((line) => line.tierId),
    gdpExcluded: {
      valueUsd: REFERENCE_DATA.gdpUsd,
      reason: { fa: "تولید ناخالص داخلی یک جریان سالانه است؛ پشتوانهٔ ذخیره نمی‌شود.", en: "GDP is an annual flow; it is not reserve backing." }
    },
    privateWealthExcluded: {
      valueUsd: REFERENCE_DATA.householdWealthUsd,
      reason: { fa: "ثروت خصوصی شهروندان دارایی عمومی نیست و ضبط نمی‌شود.", en: "Citizens' private wealth is not a public asset and is not seized." }
    }
  };
}

/** Supply ceiling in tokens, from the net basket and the toman definition. */
export function computeSupplyCeiling({ basket, fxRate = REFERENCE_DATA.fxFreeMarketTomanPerUsd, definition = HMMT_DEFINITION }) {
  const usdPerToken = definition.tomanPerToken / fxRate;
  const tokens = basket.netUsd / usdPerToken;
  return {
    ceilingTokens: Math.floor(tokens),
    fractionalTokens: round2(tokens),
    usdPerToken: round2(usdPerToken),
    fxRate,
    formula: {
      fa: "سقف عرضه = پشتوانهٔ خالص به دلار ÷ ارزش دلاری هر واحد؛ ارزش دلاری هر واحد = هزار میلیارد تومان ÷ نرخ دلار",
      en: "Ceiling = net backing in USD ÷ USD value of one unit; USD value of one unit = one thousand billion toman ÷ FX rate"
    }
  };
}

/** Convert deposited toman into tokens. The only path by which tokens are created. */
export function convertTomanToHmmt({ toman, fxRate = REFERENCE_DATA.fxFreeMarketTomanPerUsd, feeBps = 20, ceilingTokens, circulatingTokens = 0, definition = HMMT_DEFINITION }) {
  const amount = num(toman);
  if (!(amount > 0)) {
    return { allowed: false, code: "invalid-amount", reason: { fa: "مبلغ باید مثبت باشد.", en: "The amount must be positive." } };
  }
  const grossTokens = amount / definition.tomanPerToken;
  const feeTokens = (grossTokens * feeBps) / 10000;
  const netTokens = grossTokens - feeTokens;
  const capacity = ceilingTokens === undefined ? Infinity : ceilingTokens - circulatingTokens;
  if (netTokens > capacity) {
    return {
      allowed: false,
      code: "ceiling-reached",
      reason: {
        fa: "ظرفیت پشتوانهٔ تأییدشده برای این مقدار کافی نیست؛ تبدیل در پنجرهٔ بعدی و به‌صورت نسبی انجام می‌شود.",
        en: "Verified backing capacity is insufficient for this amount; conversion moves to the next window and is pro-rated."
      },
      capacity
    };
  }
  return {
    allowed: true,
    code: "converted",
    toman: amount,
    // Token amounts keep six decimals: at 20 bps the fee on a 0.05 HMMT
    // conversion is 0.0001 HMMT, which two decimals would round away.
    grossTokens: round6(grossTokens),
    feeBps,
    feeTokens: round6(feeTokens),
    netTokens: round6(netTokens),
    reserveRequiredUsd: round2(amount / fxRate),
    newCirculatingTokens: round6(circulatingTokens + netTokens),
    remainingCapacity: ceilingTokens === undefined ? Infinity : round2(capacity - netTokens),
    note: {
      fa: "توکن تازه فقط در برابر تومان واریزشده ساخته می‌شود؛ این یک مبادلهٔ ترازنامه‌ای است، نه اعطا.",
      en: "New tokens are created only against deposited toman: a balance-sheet exchange, not a grant."
    }
  };
}

/** Redeem tokens for toman. Burns the token and releases the reserve. */
export function redeemHmmtToToman({ tokens, fxRate = REFERENCE_DATA.fxFreeMarketTomanPerUsd, feeBps = 20, circulatingTokens = 0, tomanReserve, cashWindowToman, definition = HMMT_DEFINITION }) {
  const amount = num(tokens);
  if (!(amount > 0)) {
    return { allowed: false, code: "invalid-amount", reason: { fa: "مقدار توکن باید مثبت باشد.", en: "The token amount must be positive." } };
  }
  if (amount > circulatingTokens) {
    return { allowed: false, code: "exceeds-circulating", reason: { fa: "بیش از عرضهٔ در گردش است.", en: "More than the circulating supply." } };
  }
  const grossToman = amount * definition.tomanPerToken;
  const feeToman = (grossToman * feeBps) / 10000;
  const netToman = grossToman - feeToman;
  // Two separate limits can push a request into the queue: the reserve itself,
  // and the daily cash window (a liquidity-management rule, not a solvency
  // rule). Neither one refuses the claim: the request is ordered by timestamp.
  const cashWindow = num(cashWindowToman) > 0 ? Math.min(num(tomanReserve === undefined ? Infinity : tomanReserve), num(cashWindowToman)) : num(tomanReserve === undefined ? Infinity : tomanReserve);
  if (netToman > cashWindow) {
    const windowBound = num(cashWindowToman) > 0 && num(cashWindowToman) <= num(tomanReserve === undefined ? Infinity : tomanReserve);
    return {
      allowed: false,
      code: "queue",
      reason: windowBound
        ? {
            fa: "پنجرهٔ نقدینگی روزانهٔ بانک پر شده است؛ درخواست در صف بازخرید با ترتیب زمانی ثبت می‌شود و پول آن کنار گذاشته می‌شود.",
            en: "The bank's daily cash window is exhausted; the request enters the redemption queue in timestamp order, with its funds earmarked."
          }
        : {
            fa: "ذخیرهٔ نقدی امروز کافی نیست؛ درخواست در صف بازخرید با ترتیب زمانی ثبت می‌شود.",
            en: "Today's cash reserve is insufficient; the request enters the redemption queue in timestamp order."
          },
      limit: windowBound ? "cash-window" : "reserve",
      availableToman: Number.isFinite(cashWindow) ? round2(cashWindow) : null,
      queuedToman: round2(netToman)
    };
  }
  return {
    allowed: true,
    code: "redeemed",
    tokens: round6(amount),
    grossToman: round2(grossToman),
    feeToman: round2(feeToman),
    netToman: round2(netToman),
    feeBps,
    newCirculatingTokens: round6(circulatingTokens - amount),
    reserveReleasedUsd: round2(netToman / fxRate)
  };
}

/**
 * Proof of reserve: two different questions, deliberately kept apart.
 * `reserveRatio` asks whether circulating tokens have toman behind them today
 * (must be ≥ 1). `assetCoverage` asks whether the whole ceiling is backed by
 * assets (must be ≥ 1 for the ceiling to be honest).
 */
export function proofOfReserve({ circulatingTokens, tomanReserve, fxRate = REFERENCE_DATA.fxFreeMarketTomanPerUsd, ceilingTokens, netBackingUsd, definition = HMMT_DEFINITION }) {
  const tomanNeeded = num(circulatingTokens) * definition.tomanPerToken;
  const reserveRatio = tomanNeeded > 0 ? num(tomanReserve) / tomanNeeded : null;
  const tokensBackedByAssets = num(netBackingUsd) / (definition.tomanPerToken / fxRate);
  const assetCoverage = num(ceilingTokens) > 0 ? tokensBackedByAssets / num(ceilingTokens) : null;
  const utilisation = num(ceilingTokens) > 0 ? num(circulatingTokens) / num(ceilingTokens) : null;

  const invariants = [
    {
      id: "reserve-at-least-one",
      ok: reserveRatio === null || reserveRatio >= 1,
      statement: { fa: "نسبت ذخیرهٔ تومانی برای عرضهٔ در گردش هرگز کمتر از ۱ نیست.", en: "The toman reserve ratio for circulating supply is never below 1." }
    },
    {
      id: "no-unbacked-mint",
      ok: num(circulatingTokens) <= num(ceilingTokens),
      statement: { fa: "عرضهٔ در گردش از سقف پشتوانه فراتر نمی‌رود.", en: "Circulating supply never exceeds the asset-backed ceiling." }
    },
    {
      id: "ceiling-asymmetry",
      ok: true,
      statement: { fa: "کاهش سقف فوری است؛ افزایش سقف نیازمند رأی اکثریت ویژه و مهلت ۳۰ روزه.", en: "Lowering the ceiling is immediate; raising it needs a supermajority and a 30-day timelock." }
    }
  ];

  const status = invariants.every((invariant) => invariant.ok)
    ? "healthy"
    : reserveRatio !== null && reserveRatio >= 1
      ? "asset-shortfall"
      : "reserve-shortfall";

  return {
    circulatingTokens: round2(num(circulatingTokens)),
    tomanReserve: round2(num(tomanReserve)),
    reserveRatio: reserveRatio === null ? null : round6(reserveRatio),
    ceilingTokens: round2(num(ceilingTokens)),
    assetCoverage: assetCoverage === null ? null : round6(assetCoverage),
    utilisation: utilisation === null ? null : round6(utilisation),
    status,
    invariants
  };
}

/** Distribution by gated phases. No premine, no sale, no airdrop. */
export function distributionPhases({ ceilingTokens, perPersonCapTokens = DEFAULT_PERSON_CAP }) {
  const phases = [
    { id: "P0", share: 0.02, label: { fa: "پایلوت محدود", en: "Limited pilot" }, gate: { fa: "بازبینی مستقل قرارداد و دو گزارش اثبات ذخیره.", en: "Independent contract review plus two proof-of-reserve reports." } },
    { id: "P1", share: 0.10, label: { fa: "مرحلهٔ اول", en: "Phase one" }, gate: { fa: "یک فصل کامل حسابرسی پشتوانه و صف بازخرید سالم.", en: "A full quarter of backing audits and a healthy redemption queue." } },
    { id: "P2", share: 0.35, label: { fa: "مرحلهٔ دوم", en: "Phase two" }, gate: { fa: "ماندگاری نسبت ذخیره در سه ماه و بازبینی مستقل.", en: "Reserve ratio held for three months and an independent review." } },
    { id: "P3", share: 1.00, label: { fa: "عمومی", en: "General" }, gate: { fa: "ماندیت حقوقی روشن و تصویب سازوکار حاکمیتی.", en: "A clear legal mandate and an adopted governance mechanism." } }
  ];
  let previous = 0;
  return phases.map((phase) => {
    const cumulative = ceilingTokens * phase.share;
    const line = { ...phase, cumulativeTokens: round2(cumulative), windowTokens: round2(cumulative - previous), perPersonCapTokens };
    previous = cumulative;
    return line;
  });
}

export const HMMT_INVARIANTS = Object.freeze([
  { id: "mint-only-against-deposit", fa: "هیچ توکنی بدون واریز تومانِ متناظر ساخته نمی‌شود.", en: "No token exists without a matching toman deposit." },
  { id: "no-premine", fa: "سهم پیش‌آغاز، فروش اولیه یا اعطای رایگان وجود ندارد.", en: "No premine, no initial sale, no free allocation." },
  { id: "no-in-situ-marketing", fa: "رقم ناخالص منابع هرگز به‌عنوان پشتوانه تبلیغ نمی‌شود.", en: "The gross resource figure is never presented as backing." },
  { id: "gdp-not-backing", fa: "تولید ناخالص داخلی و ثروت خصوصی پشتوانهٔ توکن نیستند.", en: "GDP and private wealth are not token backing." },
  { id: "redemption-never-frozen", fa: "توقف اضطراری فقط صدور تازه را می‌بندد؛ بازخرید باز می‌ماند.", en: "An emergency pause stops new issuance only; redemption stays open." },
  { id: "no-identity-on-chain", fa: "هیچ دادهٔ هویتی روی زنجیره نوشته نمی‌شود؛ اثبات ذخیره فقط ریشهٔ هش است.", en: "No identity data is written on-chain; proof of reserve publishes a hash root only." },
  { id: "exit-path", fa: "مسیر خروج از زنجیرهٔ اول پیش از راه‌اندازی منتشر می‌شود.", en: "The exit path from the first chain is published before launch." }
]);

/* ------------------------------------------------------------------ *
 * Per-level caps (سقف هر سطح)
 *
 * The cap on how much of the unit one holder may acquire follows the five
 * civic levels — but not as a reward ladder. Two rules keep it honest:
 *
 *   1. Levels 2 and 3 carry the *same* personal cap in every policy. Taking
 *      part in governance must never buy a larger financial position.
 *   2. A cap above the personal one is not a privilege of a person: it needs a
 *      proof that does not exist for persons (an entity registration with a
 *      published budget, or a mandate record with disclosure).
 *
 * Everything here is a labelled configurable draft (`proposed-configurable`)
 * until a recorded decision adopts it, exactly like the haircut parameters.
 * ------------------------------------------------------------------ */

/** The entity-scaled policy is the default: it derives the cap from evidence. */
export const CAP_POLICY_DEFAULT_ID = "CAP-ENTITY-SCALED-DRAFT";

export const CAP_INVARIANTS = Object.freeze([
  {
    id: "observers-hold-nothing",
    fa: "سطح ۱ (ناظر عمومی) هیچ واحدی نمی‌گیرد؛ دسترسی او فقط خواندن است.",
    en: "Level 1 (public observer) acquires nothing; its access is read-only."
  },
  {
    id: "participation-never-pays",
    fa: "سطح ۲ و سطح ۳ در هر سیاست سقف یکسانی دارند: مشارکت در حکمرانی هرگز سقف مالی نمی‌خرد.",
    en: "Levels 2 and 3 carry the same cap in every policy: taking part in governance never buys financial headroom."
  },
  {
    id: "no-cap-without-proof",
    fa: "سقفی بالاتر از سقف شخصی فقط با مدرکی به دست می‌آید که برای شخص وجود ندارد: ثبت نهاد با بودجهٔ منتشرشده یا سند اختیار.",
    en: "A cap above the personal one requires a proof that does not exist for persons: an entity registration with a published budget, or a mandate record."
  },
  {
    id: "caps-limit-acquisition-only",
    fa: "سقف سطح فقط مقدار خرید را محدود می‌کند؛ بازخرید هرگز به سطح وابسته نیست.",
    en: "A level cap limits what may be acquired; redemption never depends on a level."
  },
  {
    id: "org-cap-is-not-a-person-cap",
    fa: "سقف نهاد به اعضای آن نهاد نمی‌رسد؛ هر عضو سقف شخصی خودش را دارد.",
    en: "An entity's cap does not flow to its members; every member keeps their own personal cap."
  },
  {
    id: "caps-are-drafts",
    fa: "هر سیاست سقف پیش‌نویس قابل تنظیم است و تا تصویب، فقط پیشنهاد خوانده می‌شود.",
    en: "Every cap policy is a configurable draft and is described as a proposal until adopted."
  }
]);

export const CAP_POLICIES = Object.freeze([
  {
    id: "CAP-LADDER-DRAFT",
    label: { fa: "نردبان دسترسی", en: "Access ladder" },
    status: "proposed-configurable",
    authorizedBy: "DEC-SYN-0042",
    basis: { fa: "نقش و مدرک", en: "Role and proof" },
    summary: {
      fa: "سقف هر سطح از نقش و مدرک آن می‌آید. سقف نهاد ثابت است و به بودجهٔ حسابرسی‌شدهٔ آن گره نمی‌خورد.",
      en: "Each level's cap follows its role and its proof. The entity cap is fixed and does not scale with its audited budget."
    },
    levels: {
      1: {
        capTokens: 0,
        requires: null,
        note: { fa: "ناظر عمومی فقط می‌خواند؛ هیچ واحد و هیچ سپرده‌ای ندارد.", en: "A public observer only reads: no units, no deposit." }
      },
      2: {
        capTokens: 0.05,
        requires: null,
        note: { fa: "کانال خصوصی، بدون ثبت هویت؛ سقف با خود کانال اعمال می‌شود.", en: "Private channel, no identity retained; the channel enforces the cap." }
      },
      3: {
        capTokens: 0.05,
        requires: "ballot-credential",
        note: { fa: "همان سقف سطح ۲؛ مدرک رأی سقف مالی نمی‌افزاید.", en: "The same cap as level 2; a ballot credential adds no financial headroom." }
      },
      4: {
        capTokens: 1000,
        requires: "entity-registration",
        note: { fa: "نهاد ثبت‌شده با افسر پاسخگو؛ سقف ثابت است و به اعضای نهاد نمی‌رسد.", en: "A registered entity with an accountable officer; the cap is fixed and does not reach its members." }
      },
      5: {
        capTokens: 0.05,
        requires: "mandate-record",
        disclosure: true,
        note: { fa: "سقف شخصی، به‌علاوهٔ اعلام دارایی و کنارگذاری در تصمیم‌های پولی.", en: "The personal cap, plus a declared holding and recusal on monetary decisions." }
      }
    }
  },
  {
    id: "CAP-ENTITY-SCALED-DRAFT",
    label: { fa: "نهاد مقیاس‌دار", en: "Scaled entity" },
    status: "proposed-configurable",
    authorizedBy: "DEC-SYN-0042",
    basis: { fa: "بودجهٔ حسابرسی‌شده", en: "Audited budget" },
    summary: {
      fa: "سقف نهاد از بودجهٔ سالانهٔ حسابرسی‌شده‌اش محاسبه می‌شود (۲۰٪ بودجه) و به سقف سخت ۱٬۰۰۰ واحد و سهم ۲۵٪ از سقف عرضه محدود است. سقف شخصی تغییر نمی‌کند.",
      en: "An entity's cap is computed from its audited annual budget (20 %), bounded by a hard cap of 1,000 units and 25 % of the supply ceiling. Personal caps are unchanged."
    },
    levels: {
      1: { capTokens: 0, requires: null, note: { fa: "ناظر عمومی فقط می‌خواند.", en: "A public observer only reads." } },
      2: { capTokens: 0.05, requires: null, note: { fa: "کانال خصوصی، بدون ثبت هویت.", en: "Private channel, no identity retained." } },
      3: { capTokens: 0.05, requires: "ballot-credential", note: { fa: "همان سقف سطح ۲.", en: "The same cap as level 2." } },
      4: {
        formula: { share: 0.2, hardCapTokens: 1000, ceilingShare: 0.25 },
        requires: "audited-budget",
        note: { fa: "بدون بودجهٔ حسابرسی‌شده سقفی محاسبه نمی‌شود؛ نهاد تا آن زمان صفر است.", en: "No audited budget means no computed cap; the entity's cap is zero until then." }
      },
      5: {
        capTokens: 0.05,
        requires: "mandate-record",
        disclosure: true,
        note: { fa: "سقف شخصی، به‌علاوهٔ اعلام دارایی و کنارگذاری.", en: "The personal cap, plus declaration and recusal." }
      }
    }
  },
  {
    id: "CAP-PILOT-STRICT-DRAFT",
    label: { fa: "پایلوت محدود", en: "Strict pilot" },
    status: "proposed-configurable",
    authorizedBy: "DEC-SYN-0042",
    basis: { fa: "کم‌ترین مواجهه", en: "Minimum exposure" },
    summary: {
      fa: "برای مرحلهٔ پایلوت: سقف شخصی یک‌پنجم و سقف نهاد یک‌دهم نردبان. عمداً تنگ است تا هزینهٔ خطا در شروع کم باشد.",
      en: "For the pilot phase: a fifth of the personal cap and a tenth of the entity cap of the ladder. Deliberately tight so an early mistake is cheap."
    },
    levels: {
      1: { capTokens: 0, requires: null, note: { fa: "ناظر عمومی فقط می‌خواند.", en: "A public observer only reads." } },
      2: { capTokens: 0.01, requires: null, note: { fa: "کانال خصوصی، بدون ثبت هویت.", en: "Private channel, no identity retained." } },
      3: { capTokens: 0.01, requires: "ballot-credential", note: { fa: "همان سقف سطح ۲.", en: "The same cap as level 2." } },
      4: { capTokens: 100, requires: "entity-registration", note: { fa: "یک‌دهم سقف نردبان.", en: "A tenth of the ladder's entity cap." } },
      5: { capTokens: 0.01, requires: "mandate-record", disclosure: true, note: { fa: "سقف شخصی، به‌علاوهٔ اعلام دارایی.", en: "The personal cap, plus declaration." } }
    }
  }
]);

/** The cap the design uses when nothing else is chosen. */
export const DEFAULT_PERSON_CAP = CAP_POLICIES[0].levels[2].capTokens;

const entryForLevel = (policy, level) => policy?.levels?.[level] ?? policy?.levels?.[String(level)] ?? null;

/**
 * Resolves the cap for one level under one policy. A formula-based level (an
 * entity scaled by its audited budget) needs the budget; without it the answer
 * is "no cap computed", never a generous default.
 */
export function resolveLevelCap({ policyId = CAP_POLICY_DEFAULT_ID, level, entityBudgetToman, ceilingTokens, definition = HMMT_DEFINITION } = {}) {
  const policy = CAP_POLICIES.find((item) => item.id === policyId);
  if (!policy) {
    return { ok: false, code: "unknown-cap-policy", policyId, known: CAP_POLICIES.map((item) => item.id) };
  }
  const numericLevel = Number(level);
  if (!Number.isInteger(numericLevel) || numericLevel < 1 || numericLevel > 5) {
    return { ok: false, code: "invalid-level", level, allowed: [1, 2, 3, 4, 5] };
  }
  const entry = entryForLevel(policy, numericLevel);
  if (!entry) return { ok: false, code: "invalid-level", level: numericLevel };

  const common = {
    ok: true,
    policyId: policy.id,
    policyStatus: policy.status,
    authorizedBy: policy.authorizedBy,
    basis: policy.basis,
    level: numericLevel,
    requires: entry.requires ?? null,
    disclosure: entry.disclosure ?? false,
    note: entry.note
  };

  if (!entry.formula) {
    return { ...common, code: "resolved", capKind: "fixed", capTokens: num(entry.capTokens), formula: null, hardCapApplied: false };
  }

  const budget = num(entityBudgetToman);
  if (!(budget > 0)) {
    return { ...common, code: "entity-budget-required", capKind: "formula", capTokens: null, formula: entry.formula, hardCapApplied: false };
  }
  const byBudget = (budget / definition.tomanPerToken) * entry.formula.share;
  const byHardCap = entry.formula.hardCapTokens ?? Infinity;
  const byCeiling = entry.formula.ceilingShare && num(ceilingTokens) > 0 ? num(ceilingTokens) * entry.formula.ceilingShare : Infinity;
  const raw = Math.min(byBudget, byHardCap, byCeiling);
  return {
    ...common,
    code: "resolved",
    capKind: "formula",
    capTokens: round6(raw),
    uncappedTokens: round6(byBudget),
    entityBudgetToman: budget,
    formula: entry.formula,
    hardCapApplied: raw < byBudget
  };
}

/** Checks an acquisition against the level cap. Redemption never calls this. */
export function checkLevelCap({ policyId = CAP_POLICY_DEFAULT_ID, level, amountTokens, entityBudgetToman, ceilingTokens } = {}) {
  const resolved = resolveLevelCap({ policyId, level, entityBudgetToman, ceilingTokens });
  if (!resolved.ok) return { allowed: false, code: resolved.code, resolved, reason: null };

  const amount = num(amountTokens);
  if (!(amount > 0)) {
    return { allowed: false, code: "invalid-amount", resolved, reason: { fa: "مبلغ باید مثبت باشد.", en: "The amount must be positive." } };
  }
  if (resolved.code === "entity-budget-required") {
    return {
      allowed: false,
      code: "entity-budget-required",
      resolved,
      headroomTokens: 0,
      reason: {
        fa: "برای این سطح، سقف از بودجهٔ حسابرسی‌شدهٔ نهاد محاسبه می‌شود؛ بدون آن سقفی وجود ندارد.",
        en: "At this level the cap is computed from the entity's audited budget; without it there is no cap."
      }
    };
  }
  if (!(resolved.capTokens > 0)) {
    return {
      allowed: false,
      code: "level-not-eligible",
      resolved,
      headroomTokens: 0,
      reason: {
        fa: "این سطح واحد نمی‌گیرد؛ دسترسی آن فقط خواندن است.",
        en: "This level holds no units; its access is read-only."
      }
    };
  }
  if (amount > resolved.capTokens) {
    return {
      allowed: false,
      code: "over-level-cap",
      resolved,
      capTokens: resolved.capTokens,
      excessTokens: round6(amount - resolved.capTokens),
      headroomTokens: resolved.capTokens,
      // No numerals here: the interface renders the cap in the reader's digits.
      reason: {
        fa: "مبلغ از سقف این سطح بیشتر است. سقف سطح فقط مقدار خرید را محدود می‌کند و با مشارکت بیشتر نمی‌شود.",
        en: "The amount is above this level's cap. A level cap limits what may be acquired and does not grow with participation."
      }
    };
  }
  return { allowed: true, code: "within-level-cap", resolved, capTokens: resolved.capTokens, headroomTokens: round6(resolved.capTokens - amount) };
}

/** The whole ladder under one policy, for the comparison table. */
export function capLadder({ policyId = CAP_POLICY_DEFAULT_ID, ceilingTokens, entityBudgetToman } = {}) {
  return [1, 2, 3, 4, 5].map((level) => resolveLevelCap({ policyId, level, ceilingTokens, entityBudgetToman }));
}
