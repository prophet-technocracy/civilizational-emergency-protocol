// The partial-coverage programme: what turns an amber light green.
//
// Forty-seven principles of the mother file are marked «پوشش جزئی»: the idea is
// present in data or design, but no surface enacts it. That status was a
// diagnosis without a route out of itself. This module gives it one, and it does
// so with three hard gates rather than a wish list:
//
//   1. a ballot, with quorum and threshold arithmetic, before any money moves;
//   2. a budget that must pass the level-4 entity cap in the HMMT cap ladder;
//   3. a contract of a named type (مضاربه), with the loss on the capital side.
//
// A project is a claim about the *next* version of this prototype, not about the
// world: delivering it flips one principle from amber to green on `#/principles`
// and nothing else. Every number here is synthetic and every date is a draft.

import { CAP_POLICY_DEFAULT_ID, checkLevelCap } from "@cep/domain-models";
import { principles } from "./principles.mjs";
import { hmmtEntities } from "./hmmt.mjs";

export const PROGRAMME_NOTICE = Object.freeze({
  fa: "این برنامه یک صفِ کاری برای خودِ نمونه است، نه بودجهٔ واقعی و نه قرارداد واقعی. هر پروژه یک اصل «پوشش جزئی» را هدف می‌گیرد و تنها با تحویلِ داوری‌شده آن اصل را سبز می‌کند.",
  en: "This programme is a work queue for the prototype itself — not a real budget and not a real contract. Each project targets one Partially covered principle and turns it green only when a reviewed delivery lands."
});

export const CONTRACT_TERMS = Object.freeze({
  id: "CONTRACT-MUDARABAH-DRAFT",
  type: "mudarabah",
  label: { fa: "مضاربهٔ نمونه", en: "Synthetic mudarabah" },
  status: "proposed-configurable",
  authorizedBy: "DEC-SYN-0042",
  terms: {
    fa: [
      "سرمایه از صندوق برنامه می‌آید و کار از پیمانکار سطح ۴؛ پیمانکار آورندهٔ کار است، نه سرمایه‌گذار.",
      "سود به نسبت توافق‌شده تقسیم می‌شود و پیش از آغاز در برگهٔ رأی همان پروژه منتشر می‌شود.",
      "زیانِ پولی بر سرمایه‌گذار است؛ پیمانکار در بدترین حالت کار و زمان خود را از دست می‌دهد.",
      "هیچ پیش‌پرداختی پیش از عبور از برگهٔ رأی و تأیید سقف سطح ۴ پرداخت نمی‌شود.",
      "تحویل بدون گزارش حسابرسی، تحویل شمرده نمی‌شود و چراغ اصل را تغییر نمی‌دهد."
    ],
    en: [
      "Capital comes from the programme fund and work from a level-4 contractor: the contractor brings labour, not capital.",
      "Profit is split on the ratio agreed and published on that project's ballot before work starts.",
      "Monetary loss falls on the capital provider; at worst the contractor loses the work and the time.",
      "No advance is paid before the ballot passes and the level-4 cap check clears.",
      "A delivery without an audit report is not a delivery, and it moves no principle's light."
    ]
  },
  profitShareNote: {
    fa: "سهم سود در هر پروژه جداگانه است و در همین صفحه دیده می‌شود؛ نرخ یکسان و پنهانی وجود ندارد.",
    en: "The profit share is per project and shown on this page; there is no single hidden rate."
  }
});

// The gates are stated once here, and the API computes whether each project
// actually clears them. A rule that is not computed is a poster.
export const PROGRAMME_RULES = Object.freeze([
  {
    id: "ballot-before-money",
    fa: "بدون برگهٔ رأیِ گذشته، هیچ بودجه‌ای آزاد نمی‌شود.",
    en: "No budget is released without a passed ballot.",
    check: "funded ⇒ ballot.result === \"passed\""
  },
  {
    id: "cap-before-award",
    fa: "بودجهٔ هر پروژه باید از سقف سطح ۴ همان نهاد بگذرد، با همان نردبان سرمایه‌ای که بانک منتشر می‌کند.",
    en: "Every budget must clear the level-4 cap of its own entity, using the same cap ladder the bank publishes.",
    check: "checkLevelCap(level 4, amount, entity budget).allowed === true"
  },
  {
    id: "level-four-only",
    fa: "پیمانکار فقط از سطح ۴ است؛ سطح ۵ تصمیم می‌گیرد و اجرا نمی‌کند.",
    en: "Contractors come from level 4 only; level 5 decides, it does not execute.",
    check: "contractor.level === 4"
  },
  {
    id: "loss-on-capital",
    fa: "در مضاربه زیان پولی بر سرمایه‌گذار است؛ قراردادی که زیان را به پیمانکار ببرد پذیرفته نیست.",
    en: "In mudarabah monetary loss sits with the capital provider; a contract that pushes loss onto the contractor is refused.",
    check: "contract === \"mudarabah\" && lossBearing === \"capital-provider\""
  },
  {
    id: "delivery-needs-audit",
    fa: "تحویل باید گزارش حسابرسی داشته باشد؛ وگرنه چراغ اصل بالا نمی‌رود.",
    en: "A delivery needs an audit report, or the principle's light does not rise.",
    check: "state === \"delivered\" ⇒ audit rows ≥ 2 with a review row"
  }
]);

// One project per partial principle. The deliverable is always a surface this
// repository could actually build next — that is what makes the light believable.
const RAW = [
  {
    id: "PRG-SYN-001",
    principleId: "P-013",
    surface: "accountability",
    title: { fa: "پروندهٔ دادرسی با زنجیرهٔ شواهد", en: "A case docket with an evidence chain" },
    scope: {
      fa: "هر پرونده یک زنجیرهٔ شواهد دارد: هر سند، سازنده، تاریخ و بازبین خودش را نشان می‌دهد و پنجرهٔ اعتراض دارد.",
      en: "Each case carries an evidence chain: every document shows its author, date and reviewer, and has an appeal window."
    },
    deliverable: {
      fa: "سطح کارکننده در ماژول پاسخگویی: پرونده، شواهد، بازبین، پنجرهٔ اعتراض.",
      en: "A working surface in Accountability: docket, evidence, reviewer, appeal window."
    },
    estimate: { tokens: 0.6, months: 4 },
    contractor: { entityId: "ENT-SYN-03", level: 4, contract: "mudarabah", profitShare: 0.3 },
    ballot: { id: "BAL-SYN-101", quorum: 0.35, threshold: 0.55, cast: 0.41, inFavour: 0.66, invalid: 0.01, result: "passed" },
    state: "in-execution",
    audit: [
      { date: "2026-05-04", actor: "OFF-SYN-03", note: { fa: "پیشنهاد ثبت شد و به صف رأی رفت.", en: "Proposal recorded and queued for ballot." } },
      { date: "2026-05-19", actor: "POOL-SYN-BALLOT", note: { fa: "برگهٔ رأی با مشارکت ۰٫۴۱ و ۰٫۶۶ موافق گذشت.", en: "Ballot passed with 0.41 turnout and 0.66 in favour." } },
      { date: "2026-06-02", actor: "FUND-SYN-PROGRAMME", note: { fa: "بودجه پس از تأیید سقف سطح ۴ آزاد شد.", en: "Budget released after the level-4 cap check." } }
    ]
  },
  {
    id: "PRG-SYN-002",
    principleId: "Z-10",
    surface: "simulations",
    title: { fa: "دفتر انقضای اختیارات اضطراری", en: "A sunset register for emergency powers" },
    scope: {
      fa: "هر اختیار اضطراری یک تاریخ انقضا، یک شرط بازپس‌گیری و یک بازبین دارد؛ هیچ اختیاری بدون تاریخ در دفتر نمی‌نشیند.",
      en: "Every emergency power has an expiry date, a revocation trigger and a reviewer; no power enters the register undated."
    },
    deliverable: {
      fa: "سطح کارکننده در آزمایشگاه: دفتر انقضا با آزمون ردِ اختیار بدون تاریخ.",
      en: "A working surface in the Lab: the register plus a test that refuses an undated power."
    },
    estimate: { tokens: 0.25, months: 2 },
    contractor: { entityId: "ENT-SYN-07", level: 4, contract: "mudarabah", profitShare: 0.25 },
    ballot: { id: "BAL-SYN-102", quorum: 0.3, threshold: 0.55, cast: 0.38, inFavour: 0.72, invalid: 0, result: "passed" },
    state: "delivered",
    audit: [
      { date: "2026-03-11", actor: "OFF-SYN-07", note: { fa: "پیشنهاد ثبت شد.", en: "Proposal recorded." } },
      { date: "2026-03-24", actor: "POOL-SYN-BALLOT", note: { fa: "برگهٔ رأی گذشت.", en: "Ballot passed." } },
      { date: "2026-05-06", actor: "AUD-SYN-014", note: { fa: "تحویل با گزارش حسابرسی پذیرفته شد؛ چراغ اصل بالا رفت.", en: "Delivery accepted with an audit report; the principle's light rose." } }
    ]
  },
  {
    id: "PRG-SYN-003",
    principleId: "P-005",
    surface: "institutions",
    title: { fa: "دفتر خدمات هر گره", en: "A service ledger per node" },
    scope: {
      fa: "هر گره نهادی خدمات خودش را منتشر می‌کند و فهرست مرکزی فقط بازتاب می‌دهد؛ تمرکززدایی در داده دیده می‌شود، نه در متن.",
      en: "Each institutional node publishes its own services and the directory only mirrors them; decentralisation appears in the data, not in prose."
    },
    deliverable: {
      fa: "کارپوشهٔ نهادها با دفتر خدمات هر گره و آزمون ناهم‌خوانی با فهرست مرکزی.",
      en: "The institution dossier gains a per-node service ledger, plus a drift test against the central index."
    },
    estimate: { tokens: 0.45, months: 3 },
    contractor: { entityId: "ENT-SYN-06", level: 4, contract: "mudarabah", profitShare: 0.3 },
    ballot: { id: "BAL-SYN-103", quorum: 0.3, threshold: 0.55, cast: 0.36, inFavour: 0.61, invalid: 0.01, result: "passed" },
    state: "funded",
    audit: [
      { date: "2026-06-08", actor: "OFF-SYN-06", note: { fa: "پیشنهاد ثبت شد.", en: "Proposal recorded." } },
      { date: "2026-06-21", actor: "POOL-SYN-BALLOT", note: { fa: "برگهٔ رأی گذشت و بودجه آزاد شد.", en: "Ballot passed and the budget was released." } }
    ]
  },
  {
    id: "PRG-SYN-004",
    principleId: "P-098",
    surface: "referendum",
    title: { fa: "ابزار رفراندوم با حساب نصاب", en: "A referendum tool with quorum arithmetic" },
    scope: {
      fa: "چهار پرسش پی‌درپی، هر یک با نصاب، آستانه و ناظر مستقل؛ نتیجه پیش از شمارش اعلام می‌شود و ابطال‌ها جدا شمرده می‌شوند.",
      en: "Four sequential questions, each with quorum, threshold and independent observers; the rule is published before the count and invalid ballots are counted apart."
    },
    deliverable: {
      fa: "سطح کارکننده: زنجیرهٔ چهار پرسش، ماشین‌حساب نصاب، و ثبت اینکه این نمونه مرجع انتخاباتی نیست.",
      en: "A working surface: the four-question chain, the quorum calculator, and a recorded statement that this prototype is not an election authority."
    },
    estimate: { tokens: 1.2, months: 6 },
    contractor: { entityId: "ENT-SYN-02", level: 4, contract: "mudarabah", profitShare: 0.35 },
    ballot: { id: "BAL-SYN-104", quorum: 0.4, threshold: 0.6, cast: 0.47, inFavour: 0.71, invalid: 0.01, result: "passed" },
    state: "in-execution",
    audit: [
      { date: "2026-07-02", actor: "OFF-SYN-02", note: { fa: "پیشنهاد ثبت شد.", en: "Proposal recorded." } },
      { date: "2026-07-16", actor: "POOL-SYN-BALLOT", note: { fa: "برگهٔ رأی با آستانهٔ بالاتر گذشت.", en: "Ballot passed at the higher threshold." } },
      { date: "2026-07-30", actor: "FUND-SYN-PROGRAMME", note: { fa: "بودجه آزاد شد؛ اجرا آغاز شد.", en: "Budget released; execution began." } }
    ]
  },
  {
    id: "PRG-SYN-005",
    principleId: "P-091",
    surface: "governance",
    title: { fa: "دفتر اصلاح میثاق", en: "An amendment register for the covenant" },
    scope: {
      fa: "هر اصلاح یک نسخهٔ کامل، یک تفاوت قابل خواندن، آستانهٔ تصویب و تاریخ اجرا دارد؛ اصلاح بی‌تفاوت ثبت نمی‌شود.",
      en: "Each amendment has a full version, a readable diff, a ratification threshold and an effective date; an amendment without a diff is refused."
    },
    deliverable: {
      fa: "منشور با دفتر اصلاح و تفاوت نسخه‌ها؛ آزمون ردِ اصلاح بدون تفاوت.",
      en: "The charter gains an amendment register with version diffs, plus a test refusing an amendment without one."
    },
    estimate: { tokens: 0.5, months: 3 },
    contractor: { entityId: "ENT-SYN-01", level: 4, contract: "mudarabah", profitShare: 0.3 },
    ballot: { id: "BAL-SYN-105", quorum: 0.35, threshold: 0.55, cast: 0.39, inFavour: 0.58, invalid: 0.02, result: "passed" },
    state: "balloted",
    audit: [
      { date: "2026-08-05", actor: "OFF-SYN-01", note: { fa: "پیشنهاد ثبت شد.", en: "Proposal recorded." } },
      { date: "2026-08-18", actor: "POOL-SYN-BALLOT", note: { fa: "برگهٔ رأی گذشت؛ هنوز بودجه‌ای آزاد نشده.", en: "Ballot passed; no budget released yet." } }
    ]
  },
  {
    id: "PRG-SYN-006",
    principleId: "P-041",
    surface: "research",
    title: { fa: "نقشهٔ مالکیت رسانه", en: "A media ownership map" },
    scope: {
      fa: "خوشه‌های رسانه‌ای و هم‌پوشانی مالکیت با یک آستانهٔ اعلام‌شده؛ تمرکز پیش از انتشار نامشروع اعلام می‌شود، نه بعد از آن.",
      en: "Media clusters and ownership overlap against a published threshold; concentration is flagged before publication, not after."
    },
    deliverable: {
      fa: "کتابخانهٔ پژوهش با نقشهٔ خوشه‌ها و نوردهی هم‌پوشانی مالکیت.",
      en: "The research library gains a cluster map and an ownership-overlap shading."
    },
    estimate: { tokens: 0.7, months: 5 },
    contractor: { entityId: "ENT-SYN-05", level: 4, contract: "mudarabah", profitShare: 0.3 },
    ballot: { id: "BAL-SYN-106", quorum: 0.35, threshold: 0.55, cast: 0.28, inFavour: 0.63, invalid: 0.01, result: "pending" },
    state: "proposed",
    audit: [
      { date: "2026-09-09", actor: "OFF-SYN-05", note: { fa: "پیشنهاد ثبت شد و در انتظار برگهٔ رأی است.", en: "Proposal recorded, awaiting ballot." } }
    ]
  },
  {
    id: "PRG-SYN-007",
    principleId: "P-061",
    surface: "services",
    title: { fa: "دفتر رضایت درمانی", en: "A health consent ledger" },
    scope: {
      fa: "هر خدمت درمانی با حداقل داده و رضایت مشخص؛ دسترسی بدون رضایت در همان لایه رد می‌شود.",
      en: "Every health service carries minimum data and explicit consent; access without consent is refused at the same layer."
    },
    deliverable: {
      fa: "راهنمای خدمات با دفتر رضایت و آزمون ردِ دسترسی بی‌رضایت.",
      en: "The service directory gains a consent ledger and a test that refuses consentless access."
    },
    estimate: { tokens: 0.9, months: 6 },
    contractor: { entityId: "ENT-SYN-03", level: 4, contract: "mudarabah", profitShare: 0.32 },
    ballot: { id: "BAL-SYN-107", quorum: 0.4, threshold: 0.6, cast: 0.44, inFavour: 0.69, invalid: 0.01, result: "passed" },
    state: "in-execution",
    audit: [
      { date: "2026-06-27", actor: "OFF-SYN-03", note: { fa: "پیشنهاد ثبت شد.", en: "Proposal recorded." } },
      { date: "2026-07-11", actor: "POOL-SYN-BALLOT", note: { fa: "برگهٔ رأی گذشت.", en: "Ballot passed." } },
      { date: "2026-07-25", actor: "FUND-SYN-PROGRAMME", note: { fa: "بودجه آزاد شد.", en: "Budget released." } }
    ]
  },
  {
    id: "PRG-SYN-008",
    principleId: "P-071",
    surface: "projects",
    title: { fa: "نقشهٔ توان اکولوژیک", en: "An ecological capacity map" },
    scope: {
      fa: "هر منطقه یک سقف توان دارد و پروژه‌ای که از آن بگذرد در همان صفحه رد می‌شود، با عدد و منبع.",
      en: "Each region has a capacity ceiling, and a project that exceeds it is refused on the page, with the number and the source."
    },
    deliverable: {
      fa: "پروژه‌های نفع عمومی با سقف توان هر منطقه و ردِ مستند.",
      en: "Public-interest projects gain per-region capacity ceilings and a documented refusal."
    },
    estimate: { tokens: 0.8, months: 6 },
    contractor: { entityId: "ENT-SYN-06", level: 4, contract: "mudarabah", profitShare: 0.3 },
    ballot: { id: "BAL-SYN-108", quorum: 0.35, threshold: 0.55, cast: 0.4, inFavour: 0.6, invalid: 0.02, result: "passed" },
    state: "funded",
    audit: [
      { date: "2026-08-13", actor: "OFF-SYN-06", note: { fa: "پیشنهاد ثبت شد.", en: "Proposal recorded." } },
      { date: "2026-08-29", actor: "POOL-SYN-BALLOT", note: { fa: "برگهٔ رأی گذشت و بودجه آزاد شد.", en: "Ballot passed and the budget was released." } }
    ]
  },
  {
    id: "PRG-SYN-009",
    principleId: "P-081",
    surface: "verification",
    title: { fa: "درگاه تصمیم انسانی", en: "A human-decision gate" },
    scope: {
      fa: "هر توصیهٔ الگوریتمی بدون تصمیم نام‌دار انسانی با دلیل، معتبر نیست؛ سامانه می‌تواند پیشنهاد بدهد و نمی‌تواند حکم کند.",
      en: "No algorithmic recommendation counts without a named human decision and its reasons; the system may propose and may not rule."
    },
    deliverable: {
      fa: "تضمین دسترسی با درگاه تصمیم انسانی و آزمون ردِ حکم الگوریتمی.",
      en: "Assurance gains the human-decision gate and a test refusing an algorithmic ruling."
    },
    estimate: { tokens: 0.35, months: 3 },
    contractor: { entityId: "ENT-SYN-07", level: 4, contract: "mudarabah", profitShare: 0.28 },
    ballot: { id: "BAL-SYN-109", quorum: 0.3, threshold: 0.55, cast: 0.35, inFavour: 0.74, invalid: 0, result: "passed" },
    state: "delivered",
    audit: [
      { date: "2026-04-06", actor: "OFF-SYN-07", note: { fa: "پیشنهاد ثبت شد.", en: "Proposal recorded." } },
      { date: "2026-04-20", actor: "POOL-SYN-BALLOT", note: { fa: "برگهٔ رأی گذشت.", en: "Ballot passed." } },
      { date: "2026-06-15", actor: "AUD-SYN-021", note: { fa: "تحویل با گزارش حسابرسی پذیرفته شد.", en: "Delivery accepted with an audit report." } }
    ]
  },
  {
    id: "PRG-SYN-010",
    principleId: "P-010",
    surface: "research",
    title: { fa: "صف نقد با گزارش انتشار", en: "A critique queue with a publishing log" },
    scope: {
      fa: "هر نقد بی‌فیلتر منتشر می‌شود و گزارش انتشار نشان می‌دهد چه چیزی حذف نشده؛ تأخیر هم ثبت می‌شود.",
      en: "Criticism publishes unfiltered, and the publishing log shows what was not removed; delays are recorded too."
    },
    deliverable: {
      fa: "کتابخانهٔ پژوهش با صف نقد، گزارش انتشار و ثبت تأخیر.",
      en: "Research gains a critique queue, a publishing log and delay recording."
    },
    estimate: { tokens: 0.3, months: 2 },
    contractor: { entityId: "ENT-SYN-01", level: 4, contract: "mudarabah", profitShare: 0.25 },
    ballot: { id: "BAL-SYN-110", quorum: 0.4, threshold: 0.55, cast: 0.22, inFavour: 0.7, invalid: 0.01, result: "failed-quorum" },
    state: "proposed",
    audit: [
      { date: "2026-09-18", actor: "OFF-SYN-01", note: { fa: "برگهٔ رأی به نصاب نرسید؛ پروژه در صف ماند.", en: "The ballot missed quorum; the project stays queued." } }
    ]
  },
  {
    id: "PRG-SYN-011",
    principleId: "P-100",
    surface: "archive",
    title: { fa: "دفتر تصویب زنجیره‌ای", en: "A chained ratification ledger" },
    scope: {
      fa: "هر نسخهٔ تصویب‌شده ریشهٔ هش نسخهٔ پیشین را نگه می‌دارد؛ تغییر گذشته ممکن نیست و تلاش برای آن ثبت می‌شود.",
      en: "Every ratified version keeps the hash root of the previous one; the past cannot be rewritten, and attempts are recorded."
    },
    deliverable: {
      fa: "بایگانی با زنجیرهٔ نسخه‌ها و آزمون ردِ بازنویسی گذشته.",
      en: "The archive gains the version chain and a test refusing a rewrite of the past."
    },
    estimate: { tokens: 0.4, months: 3 },
    contractor: { entityId: "ENT-SYN-04", level: 4, contract: "mudarabah", profitShare: 0.3 },
    ballot: { id: "BAL-SYN-111", quorum: 0.35, threshold: 0.55, cast: 0.37, inFavour: 0.62, invalid: 0.01, result: "passed" },
    state: "funded",
    audit: [
      { date: "2026-09-01", actor: "OFF-SYN-04", note: { fa: "پیشنهاد ثبت شد.", en: "Proposal recorded." } },
      { date: "2026-09-15", actor: "POOL-SYN-BALLOT", note: { fa: "برگهٔ رأی گذشت و بودجه آزاد شد.", en: "Ballot passed and the budget was released." } }
    ]
  },
  {
    id: "PRG-SYN-012",
    principleId: "P-014",
    surface: "institutions",
    title: { fa: "ثبت انجمن بدون افشای هویت", en: "An association registry without identity exposure" },
    scope: {
      fa: "عضویت با اثباتِ عضویت تأیید می‌شود، نه با انتشار نام؛ انجمن بی‌صورت نمی‌ماند و عضو بی‌نام هم لو نمی‌رود.",
      en: "Membership is proven without publishing names: the association is not invisible and the member is not exposed."
    },
    deliverable: {
      fa: "کارپوشهٔ نهادها با ثبت انجمن و اثبات عضویت حداقلی.",
      en: "The institution dossier gains an association registry with a minimum-disclosure membership proof."
    },
    estimate: { tokens: 0.55, months: 4 },
    contractor: { entityId: "ENT-SYN-05", level: 4, contract: "mudarabah", profitShare: 0.3 },
    ballot: { id: "BAL-SYN-112", quorum: 0.35, threshold: 0.55, cast: 0.33, inFavour: 0.57, invalid: 0.02, result: "pending" },
    state: "proposed",
    audit: [
      { date: "2026-10-02", actor: "OFF-SYN-05", note: { fa: "پیشنهاد ثبت شد و در انتظار برگهٔ رأی است.", en: "Proposal recorded, awaiting ballot." } }
    ]
  },
  {
    id: "PRG-SYN-013",
    principleId: "Z-01",
    surface: "transition",
    title: { fa: "دفتر اختیارِ دولت انتقالی", en: "A mandate register for the transition government" },
    scope: {
      fa: "هر اختیار موقت یک تاریخ آغاز، یک انقضای سخت، یک فهرست کارِ ممنوع و یک شرط خاتمه دارد؛ اختیار بی‌تاریخ یا بی‌پایان در دفتر نمی‌نشیند.",
      en: "Every provisional authority carries a start date, a hard expiry, a list of prohibited acts and a termination trigger; an undated or open-ended authority never enters the register."
    },
    deliverable: {
      fa: "سطح کارکننده در صفحهٔ گذار: دفتر اختیار با آزمون ردِ اختیار بی‌تاریخ و آزمون خاتمهٔ خودکار در تاریخ انقضا.",
      en: "A working surface on the transition page: the register, a test that refuses an undated authority, and a test that terminates one at its expiry date."
    },
    estimate: { tokens: 0.4, months: 3 },
    contractor: { entityId: "ENT-SYN-01", level: 4, contract: "mudarabah", profitShare: 0.3 },
    ballot: { id: "BAL-SYN-113", quorum: 0.4, threshold: 0.55, cast: 0.46, inFavour: 0.73, invalid: 0.01, result: "passed" },
    state: "in-execution",
    audit: [
      { date: "2026-06-14", actor: "OFF-SYN-01", note: { fa: "پیشنهاد ثبت شد و به صف رأی رفت.", en: "Proposal recorded and queued for ballot." } },
      { date: "2026-06-29", actor: "POOL-SYN-BALLOT", note: { fa: "برگهٔ رأی با مشارکت ۰٫۴۶ و ۰٫۷۳ موافق گذشت.", en: "Ballot passed with 0.46 turnout and 0.73 in favour." } },
      { date: "2026-07-13", actor: "FUND-SYN-PROGRAMME", note: { fa: "بودجه پس از تأیید سقف سطح ۴ آزاد شد؛ اجرا آغاز شد.", en: "Budget released after the level-4 cap check; execution began." } }
    ]
  },
  {
    id: "PRG-SYN-014",
    principleId: "Z-05",
    surface: "simulations",
    title: { fa: "فهرست کارِ ممنوع دولت انتقالی", en: "The transition government's list of prohibited acts" },
    scope: {
      fa: "کارهایی که دولت موقت در هیچ حالتی نمی‌تواند انجام دهد، به‌صورت ردیف‌های آزمون‌پذیر نوشته می‌شوند: تعلیق دادگاه، ممنوعیت رسانه، تمدید خود، و هر اختیاری که خاتمهٔ خودش را به تأخیر بیندازد.",
      en: "What the provisional government may never do is written as testable rows: suspending a court, banning a medium, extending itself, and any power that postpones its own termination."
    },
    deliverable: {
      fa: "آزمایشگاه با فهرست ممنوعیت‌ها و آزمون ردِ هر کنشی که خاتمهٔ خود را به تأخیر می‌اندازد.",
      en: "The lab gains the prohibition list plus a test that refuses any action postponing its own termination."
    },
    estimate: { tokens: 0.45, months: 3 },
    contractor: { entityId: "ENT-SYN-07", level: 4, contract: "mudarabah", profitShare: 0.28 },
    ballot: { id: "BAL-SYN-114", quorum: 0.4, threshold: 0.6, cast: 0.42, inFavour: 0.7, invalid: 0.02, result: "passed" },
    state: "funded",
    audit: [
      { date: "2026-09-22", actor: "OFF-SYN-07", note: { fa: "پیشنهاد ثبت شد.", en: "Proposal recorded." } },
      { date: "2026-10-06", actor: "POOL-SYN-BALLOT", note: { fa: "برگهٔ رأی با آستانهٔ ۰٫۶ گذشت و بودجه آزاد شد.", en: "Ballot passed at the 0.6 threshold and the budget was released." } }
    ]
  }
];

export const PROGRAMME_STATES = Object.freeze([
  { id: "proposed", label: { fa: "پیشنهاد", en: "Proposed" }, note: { fa: "ثبت شده و در انتظار برگهٔ رأی.", en: "Recorded, awaiting a ballot." } },
  { id: "balloted", label: { fa: "رأی‌داده‌شده", en: "Balloted" }, note: { fa: "برگهٔ رأی گذشت و در انتظار آزادسازی بودجه.", en: "The ballot passed, awaiting budget release." } },
  { id: "funded", label: { fa: "بودجه‌دار", en: "Funded" }, note: { fa: "بودجه پس از تأیید سقف سطح ۴ آزاد شده است.", en: "Budget released after the level-4 cap check." } },
  { id: "in-execution", label: { fa: "در اجرا", en: "In execution" }, note: { fa: "کار آغاز شده و تحویل هنوز داوری نشده است.", en: "Work has begun; the delivery has not been reviewed." } },
  { id: "delivered", label: { fa: "تحویل‌شده", en: "Delivered" }, note: { fa: "تحویل با گزارش حسابرسی پذیرفته شده است.", en: "Delivery accepted with an audit report." } }
]);

const STATE_ORDER = PROGRAMME_STATES.map((state) => state.id);
const PRINCIPLE_BY_ID = new Map(principles.map((principle) => [principle.id, principle]));

function principleRef(principleId) {
  const principle = PRINCIPLE_BY_ID.get(principleId);
  if (!principle) throw new Error(`programme references unknown principle: ${principleId}`);
  return principle;
}

function capFor(entityId, tokens) {
  const entity = hmmtEntities.find((entry) => entry.id === entityId);
  if (!entity) throw new Error(`programme references unknown entity: ${entityId}`);
  const check = checkLevelCap({
    policyId: CAP_POLICY_DEFAULT_ID,
    level: 4,
    amountTokens: tokens,
    entityBudgetToman: entity.budgetToman
  });
  return {
    entityId,
    entityName: entity.name,
    policyId: CAP_POLICY_DEFAULT_ID,
    allowed: check.allowed === true,
    code: check.code ?? null,
    headroomTokens: check.headroomTokens ?? null,
    capTokens: check.resolved?.capTokens ?? null
  };
}

function decorate(raw) {
  const principle = principleRef(raw.principleId);
  const cap = capFor(raw.contractor.entityId, raw.estimate.tokens);
  const hasReview = raw.audit.some((row) => row.actor.startsWith("AUD-") || /حسابرس/.test(row.note.fa));
  const gates = {
    ballotPassed: raw.ballot.result === "passed",
    capCleared: cap.allowed,
    levelFour: raw.contractor.level === 4,
    mudarabah: raw.contractor.contract === "mudarabah",
    auditOnDelivery: raw.state !== "delivered" || (raw.audit.length >= 2 && hasReview)
  };
  const stateIndex = STATE_ORDER.indexOf(raw.state);
  // The gates are asserted, not assumed: a project that does not clear them is
  // reported as blocked here, and the API test fails the build if one slips through.
  const blockedBy = [];
  if (stateIndex >= STATE_ORDER.indexOf("funded") && !gates.ballotPassed) blockedBy.push("ballot-before-money");
  if (stateIndex >= STATE_ORDER.indexOf("funded") && !gates.capCleared) blockedBy.push("cap-before-award");
  if (!gates.levelFour) blockedBy.push("level-four-only");
  if (!gates.mudarabah) blockedBy.push("loss-on-capital");
  if (!gates.auditOnDelivery) blockedBy.push("delivery-needs-audit");

  return {
    ...raw,
    principle: {
      id: principle.id,
      title: principle.title,
      chapter: principle.chapter,
      coverage: principle.coverage,
      light: principle.light ?? null
    },
    flipsTo: "green",
    flipsOnlyWhen: "delivered",
    gates,
    blockedBy,
    cap,
    progress: { index: stateIndex, of: STATE_ORDER.length, state: raw.state }
  };
}

export const programmeProjects = Object.freeze(RAW.map(decorate));

export function buildProgramme() {
  const projects = programmeProjects.map((project) => ({ ...project }));
  const totals = projects.reduce(
    (acc, project) => {
      acc.projects += 1;
      acc.tokens = Math.round((acc.tokens + project.estimate.tokens) * 100) / 100;
      acc.months = Math.max(acc.months, project.estimate.months);
      acc.byState[project.state] = (acc.byState[project.state] ?? 0) + 1;
      if (project.state === "delivered") {
        acc.delivered += 1;
        acc.tokensDelivered = Math.round((acc.tokensDelivered + project.estimate.tokens) * 100) / 100;
      }
      return acc;
    },
    { projects: 0, tokens: 0, tokensDelivered: 0, months: 0, delivered: 0, byState: {} }
  );

  const partial = principles.filter((principle) => principle.coverage === "partial");
  return {
    notice: PROGRAMME_NOTICE,
    contract: CONTRACT_TERMS,
    rules: PROGRAMME_RULES,
    states: PROGRAMME_STATES,
    projects,
    summary: {
      ...totals,
      // How much of the amber backlog this queue would actually clear.
      partialTargets: partial.length,
      targeted: projects.length,
      uncoveredByProgramme: partial.length - projects.length,
      wouldFlip: projects.filter((project) => project.state === "delivered").length,
      blocked: projects.filter((project) => project.blockedBy.length > 0).map((project) => project.id)
    },
    method: {
      fa: "هر پروژه یک اصل «پوشش جزئی» را هدف می‌گیرد، از برگهٔ رأی و سقف سطح ۴ می‌گذرد و تنها با تحویلِ حسابرسی‌شده آن اصل را سبز می‌کند. پروژه‌ای که یکی از این دروازه‌ها را رد نکند در فهرست «مسدود» می‌آید، نه در فهرست «در اجرا».",
      en: "Each project targets one Partially covered principle, clears a ballot and the level-4 cap, and turns that principle green only on an audited delivery. A project that fails a gate appears under Blocked, not under In execution."
    }
  };
}

export function buildProgrammeProject(id) {
  const project = programmeProjects.find((entry) => entry.id === id);
  if (!project) return null;
  return { project, contract: CONTRACT_TERMS, rules: PROGRAMME_RULES, states: PROGRAMME_STATES };
}
