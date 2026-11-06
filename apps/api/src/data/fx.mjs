// What the interface says about the rate, and what the rate does to the numbers.
//
// Two separate jobs, deliberately kept apart:
//
//   buildFxStatus      — provenance. Where the rate came from, when, and how it
//                        can be wrong. Nothing here is arithmetic.
//   buildFxSensitivity — consequence. What the supply ceiling becomes at the
//                        rate in force, and at rates ±10/20/30 %, so the reader
//                        can see the ceiling move before it moves.
//
// The rule the maintainer set: every calculation that depends on the rate uses
// the rate the screen prints. So the response carries both the rate and the list
// of figures it was applied to, and the ceiling below is recomputed from the same
// number rather than re-using the frozen reference.

import { computeSupplyCeiling, REFERENCE_DATA, HMMT_DEFINITION } from "@cep/domain-models";
import { basket, circulatingSupply, ceiling as referenceCeiling } from "./hmmt.mjs";

const round2 = (value) => Math.round(value * 100) / 100;
const pct = (value) => Math.round(value * 1e6) / 1e6;

const STATE_LABEL = {
  fresh: { fa: "تازه — خوانده‌شده از منبع", en: "Fresh — read from the source" },
  stale: { fa: "کهنه — آخرین خوانش معتبر، منبع در دسترس نیست", en: "Stale — last good read, source unreachable" },
  suspect: { fa: "مشکوک — خوانش رد شد، نرخ پیشین معتبر است", en: "Suspect — reading rejected, previous rate still in force" },
  reference: { fa: "مرجع — مقدار تعهدشده در سند، نه نرخ زنده", en: "Reference — the committed figure in the document, not a live rate" }
};

const SOURCE_NOTES = [
  {
    fa: "نرخ از ویجت عمومی navasan.tech خوانده می‌شود؛ نرخ رسمی نیست و منبع آن را خودش گزارش می‌کند.",
    en: "The rate is read from navasan.tech's public widget; it is not an official rate and is reported by the source itself."
  },
  {
    fa: "نرخ بازار آزاد در ایران روزانه چند درصد حرکت می‌کند؛ هر عددی که از این نرخ مشتق شود به‌همان اندازه بی‌ثبات است.",
    en: "The Iranian free-market rate moves by percent per day; every figure derived from it is exactly that unstable."
  },
  {
    fa: "اگر خوانش تازه در دسترس نباشد، نرخ پیشین با برچسب «کهنه» نشان داده می‌شود و هرگز بی‌صدا جایگزین نمی‌شود.",
    en: "When a fresh reading is unavailable, the previous rate is shown labelled stale and is never silently substituted."
  },
  {
    fa: "این سرویس داده‌ای را به سرورهای دیگر نمی‌فرستد و نرخ را در پایگاه‌داده ذخیره نمی‌کند؛ فقط در حافظه و برای کوتاه‌مدت.",
    en: "The service sends nothing to other servers and stores no rate in a database; it is held in memory, briefly."
  }
];

/**
 * @param {object} snapshot the service snapshot (see fx/service.mjs)
 */
export function buildFxStatus(snapshot) {
  const status = snapshot?.status ?? "reference";
  const rate = Number(snapshot?.usdToman ?? REFERENCE_DATA.fxFreeMarketTomanPerUsd);
  const referenceRate = REFERENCE_DATA.fxFreeMarketTomanPerUsd;
  return {
    rate: { tomanPerUsd: rate, usdPerToman: pct(1 / rate) },
    status,
    statusLabel: STATE_LABEL[status] ?? STATE_LABEL.reference,
    isLive: status === "fresh" || status === "stale",
    isUsable: Number.isFinite(rate) && rate > 0,
    asOf: snapshot?.asOf ?? REFERENCE_DATA.asOf,
    fetchedAt: snapshot?.fetchedAt ?? null,
    ageMs: snapshot?.ageMs ?? null,
    ttlMs: snapshot?.ttlMs ?? null,
    expired: snapshot?.expired ?? true,
    source: snapshot?.source ?? null,
    sourceUrl: "https://www.navasan.tech/module.php",
    sourceDate: snapshot?.sourceDate ?? null,
    sourceTime: snapshot?.sourceTime ?? null,
    change: snapshot?.change ?? null,
    previousRate: snapshot?.previousRate ?? null,
    reject: snapshot?.lastReject ?? null,
    rejectCount: snapshot?.rejects ?? 0,
    reference: {
      rate: referenceRate,
      asOf: REFERENCE_DATA.asOf,
      deltaFromReference: pct(rate / referenceRate - 1),
      note: {
        fa: "مقدار تعهدشده در HMMT-FACT-CHECK.md (SRC-FX)؛ کفِ قابل دفاع، نه ادعای امروز.",
        en: "The figure committed in HMMT-FACT-CHECK.md (SRC-FX): a defensible floor, not today's claim."
      }
    },
    rows: snapshot?.rows ?? null,
    notes: SOURCE_NOTES,
    limitations: [
      {
        fa: "ویجت عمومی ممکن است نرخ «شخص» و «شرکت» را جدا گزارش کند؛ این پروژه دلار بازار آزاد را مبنا می‌گیرد و تفاوت را پنهان نمی‌کند.",
        en: "The public widget reports personal and corporate dollars separately; this project uses the free-market dollar and does not hide the spread."
      },
      {
        fa: "در دسترس بودن منبع به شبکه و فیلترینگ بستگی دارد؛ نبودِ آن یک خرابی است، نه یک نرخ.",
        en: "Source availability depends on the network and on filtering; its absence is a fault, not a rate."
      },
      {
        fa: "تست‌ها و اسکریپت‌های بازبینی به شبکه وصل نمی‌شوند؛ مقدار پیش‌فرض همان نرخ مرجع است.",
        en: "Tests and audit scripts never touch the network; their default is the reference rate."
      }
    ]
  };
}

/** Shock ladder, in percent. Symmetric on purpose: appreciation breaks the rules too. */
export const FX_SHOCKS = Object.freeze([-30, -20, -10, 0, 10, 20, 30]);

/**
 * The ceiling at the rate in force, and at shocked rates.
 *
 * @param {object} snapshot
 * @param {object} [options]
 * @param {number} [options.circulatingTokens] tokens actually in existence
 * @param {number} [options.ratifiedCeilingTokens] the ceiling governance adopted
 */
export function buildFxSensitivity(
  snapshot,
  { circulatingTokens = circulatingSupply, ratifiedCeilingTokens = referenceCeiling.ceilingTokens } = {}
) {
  const status = buildFxStatus(snapshot);
  const liveRate = status.rate.tomanPerUsd;
  const at = (rate) => {
    const computed = computeSupplyCeiling({ basket, fxRate: rate });
    return {
      fxRate: rate,
      ceilingTokens: computed.ceilingTokens,
      usdPerToken: computed.usdPerToken,
      // Invariant 2 says supply never exceeds the ceiling. In the appreciation
      // direction the ceiling falls under the float, so the row has to be able
      // to say that out loud instead of showing a negative remainder.
      coversFloat: computed.ceilingTokens >= circulatingTokens,
      shortfallTokens: Math.max(0, round2(circulatingTokens - computed.ceilingTokens)),
      // The separate failure the ratified ceiling introduces: governance fixes a
      // number in toman terms, the rate then moves, and the fixed number can end
      // up above what the backing supports. Nothing is insolvent yet — but the
      // remaining headroom is fictional, and a bank that does not say so is
      // selling a ceiling it cannot honour.
      belowRatifiedCeiling: computed.ceilingTokens < ratifiedCeilingTokens,
      overIssueRiskTokens: Math.max(0, round2(ratifiedCeilingTokens - computed.ceilingTokens))
    };
  };

  const live = at(liveRate);
  const reference = at(REFERENCE_DATA.fxFreeMarketTomanPerUsd);

  const ladder = FX_SHOCKS.map((shockPercent) => {
    const rate = Math.round(liveRate * (1 + shockPercent / 100));
    return { shockPercent, ...at(rate) };
  });

  return {
    asOf: status.asOf,
    status: status.status,
    isLive: status.isLive,
    rate: status.rate,
    rateContext: {
      source: status.source,
      sourceUrl: status.sourceUrl,
      fetchedAt: status.fetchedAt,
      ageMs: status.ageMs,
      expired: status.expired,
      reference: status.reference
    },
    live,
    reference,
    ratifiedCeilingTokens,
    deltaFromReferenceTokens: round2(live.ceilingTokens - reference.ceilingTokens),
    circulatingTokens,
    ladder,
    // The figures the rate was applied to, named, so nobody has to guess which
    // numbers moved when the rate moves.
    appliedTo: [
      { field: "ceiling.ceilingTokens", fa: "سقف عرضه (تعداد توکن)", en: "Supply ceiling (tokens)" },
      { field: "ceiling.usdPerToken", fa: "ارزش دلاری هر توکن", en: "USD value per token" },
      { field: "circulating.usdValue", fa: "ارزش دلاری عرضهٔ در گردش", en: "USD value of circulating supply" },
      { field: "reserve.tomanReserveValueUsd", fa: "ارزش دلاری ذخیرهٔ تومانی", en: "USD value of the toman reserve" }
    ],
    definition: {
      tomanPerToken: HMMT_DEFINITION.tomanPerToken,
      note: {
        fa: "یک توکن دقیقاً هزار میلیارد تومان است؛ ارزش تومانی ثابت و ارزش دلاری شناور است، پس هر تغییر نرخ مستقیماً در سقف ظاهر می‌شود.",
        en: "One token is exactly one thousand billion toman; its toman value is fixed and its dollar value floats, so every rate move lands directly on the ceiling."
      }
    },
    formula: referenceCeiling.formula,
    limitations: [
      {
        fa: "این جدول فقط سقف حسابی را نشان می‌دهد؛ سقف تصویب‌شده توسط حاکمیت تعیین می‌شود و با نرخ حرکت نمی‌کند.",
        en: "This table shows the arithmetic ceiling only; the ratified ceiling is set by governance and does not move with the rate."
      },
      {
        fa: "پشتوانهٔ خالص دلاری در این محاسبه ثابت فرض شده است؛ اگر خودِ پشتوانه ریالی باشد، دو حرکت روی هم سوار می‌شوند.",
        en: "Net USD backing is held constant here; if the backing itself is rial-denominated, the two moves compound."
      },
      {
        fa: "شوک‌ها فرض‌های نمایشی‌اند (±۱۰ تا ±۳۰ درصد) و پیش‌بینی نیستند.",
        en: "The shocks are demonstrative assumptions (±10 to ±30 %), not forecasts."
      },
      {
        fa: "ردیف «سقف تصویب‌شده» نشان می‌دهد سقف ثابتِ تومانی، وقتی ریال تقویت شود، از سقف پشتوانه بالاتر می‌افتد؛ آن ردیف از دست رفت، نه از دست دادن پول.",
        en: "The ratified-ceiling row shows the fixed toman ceiling ending up above the backed ceiling when the rial strengthens; that row is room lost, not money lost."
      }
    ]
  };
}
