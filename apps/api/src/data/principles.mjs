// Coverage map for the mother file («فن‌سالاری اصلاح‌شده»): every principle in
// that draft, and what this prototype actually does about it.
//
// The mother file is a draft national covenant, not an adopted text. This table
// therefore records *coverage of a prototype*, never compliance with a law: a
// principle can be demonstrated by a screen, represented only as data, or be
// outside what any interface can do (a court, a police force, a health system).
// The four statuses are defined once below and reused by the API, the screen and
// the docs, so the numbers cannot drift apart.

export const MOTHER_FILE = Object.freeze({
  title: { fa: "فن‌سالاری اصلاح‌شده — میثاق ملی پیشنهادی", en: "Revised Technocracy — a proposed national covenant" },
  pages: 84,
  chapters: 11,
  principles: 113,
  sourceNote: {
    fa: "سند مادر یک پیش‌نویس است: هیچ رأی، نصاب یا تصویبی برای آن ثبت نشده. این صفحه پوشش یک نمونهٔ نرم‌افزاری را می‌سنجد، نه انطباق حقوقی با آن سند.",
    en: "The mother file is a draft: no vote, quorum or ratification is recorded for it. This screen measures what a software prototype covers, not legal compliance with that text."
  }
});

// Statuses, in the order the screen and the summary present them.
export const COVERAGE_STATUSES = Object.freeze([
  {
    id: "covered",
    label: { fa: "پوشش کامل", en: "Covered" },
    note: {
      fa: "یک سطح کارکننده در همین نمونه سازوکار اصل را نشان می‌دهد، هرچند با دادهٔ ساختگی.",
      en: "A working surface in this prototype demonstrates the principle's mechanism, with synthetic data."
    }
  },
  {
    id: "partial",
    label: { fa: "پوشش جزئی", en: "Partial" },
    note: {
      fa: "اصل در داده یا طراحی حاضر است، اما نمونه نمی‌تواند آن را اجرا کند.",
      en: "The principle is present in data or design, but the prototype cannot enact it."
    }
  },
  {
    id: "gap",
    label: { fa: "جای خالی", en: "Gap" },
    note: {
      fa: "نرم‌افزار می‌تواند آن را نشان دهد و هنوز نشان نمی‌دهد؛ کار بعدی است، نه ادعا.",
      en: "Software could show it, and does not yet; it is next work, not a claim."
    }
  },
  {
    id: "outside",
    label: { fa: "بیرون از دامنهٔ نرم‌افزار", en: "Beyond software" },
    note: {
      fa: "اجرای آن به قانون، دادگاه، نیرو یا بودجهٔ واقعی نیاز دارد؛ رابط تنها می‌تواند ارجاع دهد.",
      en: "Enforcing it needs law, courts, forces or a real budget; an interface can only cite it."
    }
  }
]);

// The light beside every principle — the part that turns a coverage map into a
// constitution that can be *read at a glance*. Four colours, four meanings, and
// a weight that is deliberately harsh:
//
//   green  1.0  a working surface demonstrates the mechanism
//   amber  0.1  present in data or design only — a tenth, not a half
//   red    0.0  software could show it and does not
//   grey    —   no interface can deliver it; taken out of the denominator
//
// The 0.1 is the whole argument of this page. A principle that is "in the
// design" is not half done, and counting it as half would let the prototype
// declare itself two-thirds complete while nothing is enforced anywhere.
export const PRINCIPLE_LIGHTS = Object.freeze([
  {
    id: "green",
    status: "covered",
    tone: "good",
    weight: 1,
    label: { fa: "سبز", en: "Green" },
    means: {
      fa: "یک سطح کارکننده سازوکار اصل را نشان می‌دهد، هرچند با دادهٔ ساختگی.",
      en: "A working surface demonstrates the mechanism, with synthetic data."
    },
    turnsOn: { fa: "فقط با تحویلِ داوری‌شدهٔ یک سطح کارکننده.", en: "Only by an audited delivery of a working surface." }
  },
  {
    id: "amber",
    status: "partial",
    tone: "warn",
    weight: 0.1,
    label: { fa: "کهربایی", en: "Amber" },
    means: {
      fa: "اصل در داده یا طراحی هست و در هیچ سطحی اجرا نمی‌شود؛ یک‌دهم شمرده می‌شود.",
      en: "The principle is present in data or design and enacted nowhere; it counts for a tenth."
    },
    turnsOn: { fa: "با پروژهٔ رأی‌داده‌شده و بودجه‌دار «برنامهٔ پوشش جزئی».", en: "Through a balloted, funded project in the partial-coverage programme." }
  },
  {
    id: "red",
    status: "gap",
    tone: "danger",
    weight: 0,
    label: { fa: "سرخ", en: "Red" },
    means: {
      fa: "نرم‌افزار می‌توانست آن را نشان دهد و هنوز نمی‌دهد؛ کار بعدی است، نه ادعا.",
      en: "Software could show it and does not yet; it is next work, not a claim."
    },
    turnsOn: { fa: "با ساختن همان سطح، پیش از هر چیز دیگری.", en: "By building that surface, before anything else." }
  },
  {
    id: "grey",
    status: "outside",
    tone: "neutral",
    weight: null,
    excluded: true,
    label: { fa: "خاکستری", en: "Grey" },
    means: {
      fa: "اجرای آن به قانون، دادگاه، نیرو یا بودجهٔ واقعی نیاز دارد؛ از مخرج خارج است و سبز شدنش ادعای بی‌مبنا می‌شود.",
      en: "Enforcing it needs law, courts, forces or a real budget; it is out of the denominator, and calling it green would be an unsupported claim."
    },
    turnsOn: { fa: "هیچ‌گاه با نرم‌افزار؛ فقط با نهاد واقعی.", en: "Never with software; only with a real institution." }
  }
]);

const LIGHT_BY_STATUS = Object.freeze(
  Object.fromEntries(PRINCIPLE_LIGHTS.map((light) => [light.status, light]))
);

// Readiness bands. The top band is unreachable in this repository on purpose.
export const READINESS_BANDS = Object.freeze([
  { id: "draft", max: 0.25, label: { fa: "طرح", en: "Draft" } },
  { id: "building", max: 0.5, label: { fa: "در ساخت", en: "Under construction" } },
  { id: "nearing", max: 0.8, label: { fa: "نزدیک", en: "Nearing" } },
  { id: "almost", max: 0.999, label: { fa: "تقریباً کامل", en: "Almost complete" } },
  { id: "live", max: 1, label: { fa: "زنده", en: "Live" } }
]);

export function bandFor(readiness) {
  const band = READINESS_BANDS.find((entry) => readiness <= entry.max);
  return band ?? READINESS_BANDS[READINESS_BANDS.length - 1];
}

// The score a set of rows deserves, with the grey ones out of the denominator.
export function readinessOf(rows) {
  const counted = rows.filter((row) => LIGHT_BY_STATUS[row.coverage]?.excluded !== true);
  const denominator = counted.length;
  const score = denominator === 0
    ? 0
    : counted.reduce((sum, row) => sum + (LIGHT_BY_STATUS[row.coverage]?.weight ?? 0), 0) / denominator;
  return {
    readiness: Math.round(score * 1000) / 1000,
    counted: denominator,
    excluded: rows.length - denominator
  };
}

// The surfaces a principle can point at. `route: null` means the whole interface.
const SURFACES = Object.freeze({
  interface: { route: null, label: { fa: "خود رابط دوزبانه", en: "The bilingual interface" } },
  dashboard: { route: "dashboard", label: { fa: "پیشخوان تمدنی", en: "Civilization dashboard" } },
  governance: { route: "governance", label: { fa: "حکمرانی و منشور", en: "Governance & charter" } },
  transition: { route: "transition", label: { fa: "معماری گذار", en: "Transition architecture" } },
  institutions: { route: "institutions", label: { fa: "کارپوشهٔ نهادها", en: "Institutional directory" } },
  archive: { route: "historical-archive", label: { fa: "بایگانی تاریخی", en: "Historical archive" } },
  research: { route: "research", label: { fa: "کتابخانهٔ شواهد", en: "Evidence library" } },
  verification: { route: "verification", label: { fa: "تضمین دسترسی", en: "Five-band assurance" } },
  accountability: { route: "accountability", label: { fa: "پاسخگویی", en: "Accountability" } },
  services: { route: "public-services", label: { fa: "خدمات عمومی", en: "Public services" } },
  projects: { route: "projects", label: { fa: "پروژه‌های نفع عمومی", en: "Public-good projects" } },
  simulations: { route: "simulations", label: { fa: "آزمایشگاه طراحی", en: "Design lab" } },
  legacy: { route: "digital-legacy", label: { fa: "میراث دیجیتال", en: "Digital legacy" } },
  levels: { route: "levels", label: { fa: "پنج سطح شهروندی", en: "Five civic levels" } },
  bank: { route: "bank", label: { fa: "بانک HMMT", en: "HMMT bank" } }
});

export const PRINCIPLE_CHAPTERS = Object.freeze([
  { id: "zero", number: 0, title: { fa: "فصل صفر: دولت انتقالی و پروتکل گذار", en: "Chapter 0: the transitional government" }, range: { fa: "اصل ۰٫۱ تا ۰٫۱۳", en: "Principles 0.1–0.13" } },
  { id: "foundations", number: 1, title: { fa: "فصل اول: اصول کلی و مبانی زیرساختی", en: "Chapter 1: foundations" }, range: { fa: "اصل ۱ تا ۷", en: "Principles 1–7" } },
  { id: "rights", number: 2, title: { fa: "فصل دوم: حقوق بنیادین و دارایی‌های نوین", en: "Chapter 2: fundamental rights and new assets" }, range: { fa: "اصل ۸ تا ۲۰", en: "Principles 8–20" } },
  { id: "power", number: 3, title: { fa: "فصل سوم: ساختار قدرت و گره‌های اجرایی", en: "Chapter 3: power structure and executive nodes" }, range: { fa: "اصل ۲۱ تا ۳۰", en: "Principles 21–30" } },
  { id: "economy", number: 4, title: { fa: "فصل چهارم: نظام اقتصادی دانش‌بنیان", en: "Chapter 4: the knowledge economy" }, range: { fa: "اصل ۳۱ تا ۴۰", en: "Principles 31–40" } },
  { id: "knowledge", number: 5, title: { fa: "فصل پنجم: دانش، رسانه و فرهنگ", en: "Chapter 5: knowledge, media, culture" }, range: { fa: "اصل ۴۱ تا ۵۰", en: "Principles 41–50" } },
  { id: "security", number: 6, title: { fa: "فصل ششم: امنیت ملی و دیپلماسی شبکه‌ای", en: "Chapter 6: national security and network diplomacy" }, range: { fa: "اصل ۵۱ تا ۶۰", en: "Principles 51–60" } },
  { id: "welfare", number: 7, title: { fa: "فصل هفتم: سلامت، رفاه و تأمین آتیه", en: "Chapter 7: health, welfare, pensions" }, range: { fa: "اصل ۶۱ تا ۷۰", en: "Principles 61–70" } },
  { id: "environment", number: 8, title: { fa: "فصل هشتم: توسعهٔ پایدار و محیط زیست", en: "Chapter 8: sustainable development and environment" }, range: { fa: "اصل ۷۱ تا ۸۰", en: "Principles 71–80" } },
  { id: "justice", number: 9, title: { fa: "فصل نهم: قضاوت، دادرسی و صیانت از قانون", en: "Chapter 9: judiciary and rule of law" }, range: { fa: "اصل ۸۱ تا ۹۰", en: "Principles 81–90" } },
  { id: "revision", number: 10, title: { fa: "فصل دهم: بازنگری، اضطرار و پایداری میثاق", en: "Chapter 10: revision, emergency, durability" }, range: { fa: "اصل ۹۱ تا ۱۰۰", en: "Principles 91–100" } }
]);

// [id, source number (Persian), chapter, Persian title, English title, status, surface, Persian note, English note]
const RAW = [
  ["Z-01", "صفر ممیز یک", "zero", "مدت، حدود و خاتمهٔ دولت انتقالی", "A dated, bounded transition government", "partial", "transition",
    "فازهای گذار در همین صفحه تاریخ‌دار و موقت‌اند، اما نمونه دولتی تشکیل نمی‌دهد.",
    "The transition phases here carry dates and end, but the prototype forms no government."],
  ["Z-02", "صفر ممیز دو", "zero", "مشروعیت از ارادهٔ مستقیم شهروندان", "Legitimacy from citizens' direct will", "partial", "levels",
    "سطح ۳ تا ۵ رأی، تفویض و نصاب را محاسبه می‌کنند؛ هیچ رأی واقعی ثبت نمی‌شود.",
    "Levels 3–5 compute ballots, delegation and quorum; no real vote is recorded."],
  ["Z-03", "صفر ممیز سه", "zero", "سه رکن هم‌تراز و متقابل‌ناظر", "Three equal, mutually watching pillars", "covered", "governance",
    "لایه‌های حکمرانی و تفکیک کارکردها در همین ماژول و در منشور پیش‌نویس آمده است.",
    "Governance layers and separated functions are shown here and in the draft charter."],
  ["Z-04", "صفر ممیز چهار", "zero", "ترکیب و شرایط عضویت ارکان", "Membership and selection conditions", "covered", "levels",
    "صلاحیت، ارزیابی حرفه‌ای و آستانه در سطوح ۴ و ۵ بازمحاسبه می‌شود.",
    "Qualification, professional assessment and thresholds are recomputed at levels 4–5."],
  ["Z-05", "صفر ممیز پنج", "zero", "حدود اختیارات و ممنوعیت‌های دولت انتقالی", "The transition government's limits", "partial", "simulations",
    "آزمایشگاه اختیار زمان‌دار و قابل بازپس‌گیری را می‌سنجد؛ سقف قانونی را اجرا نمی‌کند.",
    "The lab weighs time-boxed, revocable authority; it does not enforce a statutory limit."],
  ["Z-06", "صفر ممیز شش", "zero", "نظارت عمومی و حق مداخلهٔ شهروندان", "Public oversight and citizens' right to intervene", "covered", "accountability",
    "گزارش عمومی، دفتر تضاد منافع و ردیف‌های حسابرسی در دسترس‌اند.",
    "Public reports, a conflict register and audit rows are on the page."],
  ["Z-07", "صفر ممیز هفت", "zero", "مدیریت بحران و اختیارات اضطراری", "Crisis management in the transition", "partial", "simulations",
    "سناریوی اضطرار با انقضا و نصاب سنجیده می‌شود؛ هیچ وضعیت اضطراری اعلام نمی‌شود.",
    "An emergency scenario is weighed with sunset and quorum; nothing is ever declared."],
  ["Z-08", "صفر ممیز هشت", "zero", "نظام مالی موقت و قابل ممیزی", "A temporary, auditable financial system", "covered", "bank",
    "دفتر کل ساختگی با کارمزد ۲۰ bps و نسبت ذخیره، همان نظام موقت را نشان می‌دهد.",
    "A synthetic ledger with a 20 bps fee and a reserve ratio shows that interim system."],
  ["Z-09", "صفر ممیز نه", "zero", "مشارکت عمومی در طراحی ساختار جدید", "Public participation in designing institutions", "covered", "simulations",
    "آزمایشگاه طراحی نهادی، گزینه‌ها و هزینهٔ هر انتخاب را کنار هم می‌گذارد.",
    "The design lab puts options and their costs side by side."],
  ["Z-10", "صفر ممیز ده", "zero", "اختیارات اضطراری مهارشده", "Emergency powers that stay contained", "partial", "simulations",
    "قاعدهٔ انقضا و بازپس‌گیری در طراحی هست؛ سازوکار الزام‌آور وجود ندارد.",
    "The sunset-and-revocation rule is in the design; no binding mechanism exists."],
  ["Z-11", "صفر ممیز یازده", "zero", "انتقال نهایی قدرت، ثبت‌شده و غیرقابل بازگشت", "A recorded, irreversible handover of power", "gap", "transition",
    "پروتکل امضا و ثبت تحویل قدرت در داده نیست؛ افزودنی است به صفحهٔ گذار.",
    "No signed, recorded handover protocol exists in the data; it belongs on the transition page."],
  ["Z-12", "صفر ممیز دوازده", "zero", "ثبات اجتماعی و حفاظت از زندگی روزمره", "Social stability and daily life", "outside", null,
    "حفظ معیشت و نظم عمومی کار دولت و نیروهای واقعی است، نه کار یک رابط.",
    "Keeping livelihoods and public order is work for a real government and police, not an interface."],
  ["Z-13", "صفر ممیز سیزده", "zero", "حقیقت، حافظهٔ جمعی و مواجهه با گذشته", "Truth, collective memory, facing the past", "covered", "archive",
    "بایگانی تاریخی با مرز انتشار و گردش‌کار ویرایشی، همان مواجههٔ مستند است.",
    "The historical archive, with a publication boundary and editorial workflow, is that documented reckoning."],

  ["P-001", "اول", "foundations", "ماهیت و منشأ حاکمیت", "The source of sovereignty", "partial", "bank",
    "دفتر کل توزیع‌شده در بانک فقط نمایشی است؛ هیچ زنجیرهٔ واقعی و هیچ مالکیتی ثبت نمی‌شود.",
    "The bank's distributed ledger is a depiction; no real chain and no ownership is recorded."],
  ["P-002", "دوم", "foundations", "ابزار حاکمیت: سامانهٔ جامع مردم‌سالاری هوشمند", "A single smart civic platform", "covered", "levels",
    "پنج سطح، رأی و تفویض را با محاسبهٔ باز و قابل بازبینی نشان می‌دهند؛ داده ساختگی است.",
    "The five levels show ballots and delegation with open, recomputable arithmetic; the data is synthetic."],
  ["P-003", "سوم", "foundations", "روش علمی به‌جای آرمان‌گرایی", "Method over ideology", "covered", "research",
    "هر ادعا وضعیت epistemic و پرسش باز خودش را دارد؛ برچسب‌ها قابل فیلترند.",
    "Every claim carries an epistemic status and open questions, filterable on the page."],
  ["P-004", "چهارم", "foundations", "زبان، خط و هویت ملی", "Language, script, national identity", "covered", "interface",
    "فارسی پیش‌فرض، RTL کامل، واژه‌نامهٔ الزام‌آور و انگلیسی به‌عنوان زبان دوم.",
    "Persian is the default with full RTL, an enforced glossary, and English as a first-class second locale."],
  ["P-005", "پنجم", "foundations", "تمرکززدایی جغرافیایی و اداری", "Geographic and administrative decentralisation", "partial", "institutions",
    "کارپوشهٔ نهادها ساختار توزیع‌شده را توصیف می‌کند؛ خدمات واقعی در کار نیست.",
    "The directory describes a distributed structure; no real service is delivered."],
  ["P-006", "ششم", "foundations", "عدالت توزیع‌شده و فرصت‌های برابر", "Distributed justice and equal opportunity", "partial", "levels",
    "وزن تخصصی و آستانه‌ها قابل بازمحاسبه‌اند؛ برابری فرصت واقعی سنجیده نمی‌شود.",
    "Professional weight and thresholds can be recomputed; real equality of opportunity is not measured."],
  ["P-007", "هفتم", "foundations", "صیانت از خرد جمعی و مقابله با اخبار جعلی", "Protecting collective judgement from disinformation", "covered", "verification",
    "پنج باند تضمین، اثبات‌های ردشده و ادعاهای حل‌نشده نشان می‌دهند چه چیزی اثبات نشده است.",
    "Five assurance bands, a rejected-proof catalogue and open questions show what is not proven."],

  ["P-008", "هشتم", "rights", "حق کرامت و تأمین پایهٔ زندگی", "Dignity and a basic livelihood", "gap", "services",
    "راهنمای خدمات، اعتبار پایه و سهم ارزش افزودهٔ ملی را نشان نمی‌دهد؛ افزودنی است.",
    "The service directory shows no basic credit or national value-added share; it could."],
  ["P-009", "نهم", "rights", "مصونیت حریم خصوصی و مالکیت داده", "Privacy and ownership of one's data", "covered", "verification",
    "هیچ دادهٔ شخصی یا فرد زنده در سامانه نیست، کوکی و ردیابی نیست، و باندها حداقل داده را می‌گویند.",
    "No personal or living-person data exists here, no cookies or tracking, and the bands state the data minimum."],
  ["P-010", "دهم", "rights", "آزادی تفکر، بیان و نقد ساختاری", "Freedom of thought, speech, structural critique", "partial", "research",
    "کتابخانه نقد و ادعا را جای می‌دهد؛ انتشار واقعی و پالایش صفر چیزی است که نمونه نمی‌تواند تضمین کند.",
    "The library holds critique and claims; real publishing and zero filtering are beyond a prototype."],
  ["P-011", "یازدهم", "rights", "دسترسی به دانش جهانی و آموزش", "Access to knowledge and education", "partial", "research",
    "فهرست منابع و ادعاها باز است؛ سامانهٔ آموزش اجرا نمی‌شود.",
    "Sources and claims are open; no education system is operated."],
  ["P-012", "دوازدهم", "rights", "مالکیت نوین بر دارایی فیزیکی و دیجیتال", "Ownership of physical and digital assets", "partial", "legacy",
    "پروندهٔ هستی مدیریت میراث را نشان می‌دهد؛ شناسهٔ مالکیت ثبت نمی‌شود.",
    "The digital-estate file shows legacy handling; no ownership identifier is registered."],
  ["P-013", "سیزدهم", "rights", "دادرسی عادلانه بر پایهٔ شفافیت داده", "Fair trial through transparent evidence", "partial", "accountability",
    "ردیف‌های حسابرسی و گزارش عمومی شفافیت را نشان می‌دهند؛ دادگاهی وجود ندارد.",
    "Audit rows and public reports demonstrate transparency; there is no court."],
  ["P-014", "چهاردهم", "rights", "حق تشکل‌یابی در انجمن‌ها", "The right to form associations", "partial", "institutions",
    "نهادها و گره‌های ساختگی فهرست شده‌اند؛ عضویت و ثبت واقعی نیست.",
    "Synthetic institutions and nodes are listed; membership and registration are not real."],
  ["P-015", "پانزدهم", "rights", "حق بر سلامت جامع", "The right to health", "partial", "services",
    "خدمات بهداشتی در فهرست آمده؛ پروندهٔ سلامت و درمان واقعی وجود ندارد.",
    "Health services appear in the directory; no health record or care exists."],
  ["P-016", "شانزدهم", "rights", "حق بر اشتغال هوشمند", "The right to meaningful work", "gap", "services",
    "بازار کار و تطبیق مهارت در داده نیست؛ می‌تواند به همین فهرست اضافه شود.",
    "No labour market or skill matching in the data; it could join this directory."],
  ["P-017", "هفدهم", "rights", "حقوق کودکان و نوجوانان", "Rights of children and adolescents", "gap", "legacy",
    "حق فراموش شدن دیجیتال کودک در پروندهٔ هستی دیده نشده؛ جای کار دارد.",
    "A child's right to be forgotten is absent from the estate file; there is room for it."],
  ["P-018", "هجدهم", "rights", "حق بر اوقات فراغت و توسعهٔ فردی", "Leisure and personal development", "outside", null,
    "تأمین فراغت و زیرساخت فرهنگی کار بودجه و شهرداری است.",
    "Leisure and cultural infrastructure are budget and municipal work."],
  ["P-019", "نوزدهم", "rights", "مصونیت در برابر تجسس غیرقانونی", "Immunity from unlawful surveillance", "covered", "verification",
    "بدون ردیابی، بدون اثر انگشت مرورگر، بدون ثبت IP؛ اثبات‌های ناقض رد می‌شوند.",
    "No tracking, no browser fingerprinting, no IP logging; intrusive proofs are rejected."],
  ["P-020", "بیستم", "rights", "هویت پویا و مالکیت میراث دیجیتال پس از مرگ", "A dynamic identity and digital legacy", "covered", "legacy",
    "ماژول ۱۲ پروندهٔ هستی، وصیت و انتقال را با سناریوی ساختگی نشان می‌دهد.",
    "Module 12 shows the estate file, the will and the transfer with synthetic cases."],

  ["P-021", "بیست و یکم", "power", "نفی تمرکز قدرت و حاکمیت گره‌های تخصصی", "No concentration of power; expert nodes", "covered", "institutions",
    "کارپوشهٔ نهادها گره‌ها، دامنهٔ اختیار و مسئول پاسخگو را برای هر نهاد نشان می‌دهد.",
    "The directory shows each node's scope and its accountable officer."],
  ["P-022", "بیست و دوم", "power", "مجلس نخبگان (مرجع تدوین منطق شبکه)", "An assembly of experts that drafts the rules", "partial", "levels",
    "کمیته، پیشنهاد و تصمیم در سطح ۵ شبیه‌سازی شده؛ مجلس واقعی نیست.",
    "A committee, proposals and decisions are simulated at level 5; no real assembly."],
  ["P-023", "بیست و سوم", "power", "هستهٔ مرکزی هماهنگ‌کننده", "A coordinating core", "partial", "governance",
    "لایه‌های حکمرانی نقش هماهنگ‌کننده را توصیف می‌کنند؛ میان‌افزار اجرایی وجود ندارد.",
    "Governance layers describe a coordinating role; no operational middleware."],
  ["P-024", "بیست و چهارم", "power", "گزینش مدیران بر پایهٔ کارنامه", "Selecting managers by record", "covered", "levels",
    "ارزیابی حرفه‌ای، آستانه و disqualification در سطح ۴ بازمحاسبه می‌شوند.",
    "Professional assessment, thresholds and disqualification are recomputed at level 4."],
  ["P-025", "بیست و پنجم", "power", "شفافیت مالی مطلق (خزانهٔ هوشمند)", "Absolute financial transparency", "partial", "bank",
    "دفتر کل و اثبات ذخیره قابل بازبینی‌اند؛ خزانهٔ ملی واقعی و بودجهٔ گره‌ها نیست.",
    "The ledger and proof of reserve are inspectable; it is not a national treasury."],
  ["P-026", "بیست و ششم", "power", "نظام قضایی هوشمند و عدالت توزیع‌شده", "A smart judicial node", "partial", "accountability",
    "قاعدهٔ انسان در حلقه در طراحی آمده؛ هیچ پرونده و حکمی وجود ندارد.",
    "The human-in-the-loop rule is in the design; no case or ruling exists."],
  ["P-027", "بیست و هفتم", "power", "نیروهای صیانت ملی", "A national protection force", "outside", null,
    "فرماندهی، تجهیزات و دفاع کار نهاد نظامی است.",
    "Command, equipment and defence are work for a military institution."],
  ["P-028", "بیست و هشتم", "power", "مدیریت منابع طبیعی و شناسنامهٔ اراضی", "Natural resources and a land registry", "gap", "projects",
    "پروژه‌ها به زمین و آب می‌پردازند؛ شناسنامهٔ دیجیتال اراضی در داده نیست.",
    "Projects touch land and water; no digital land registry exists in the data."],
  ["P-029", "بیست و نهم", "power", "دیپلماسی شبکه و روابط بین‌الملل", "Network diplomacy", "outside", null,
    "سیاست خارجی و سفارت، کار وزارت خارجه است.",
    "Foreign policy and embassies are a foreign ministry's work."],
  ["P-030", "سی ام", "power", "نظام حل تعارض و امنیت کدهای حاکمیتی", "Resolving conflicts between governance codes", "partial", "simulations",
    "آزمایشگاه تعارض میان گزینه‌ها را نشان می‌دهد؛ مرجع تفسیر الزام‌آور نیست.",
    "The lab shows conflicts between options; it is not a binding authority."],
  ["P-031", "سی و یکم", "economy", "واحد پول نوین و حذف نقدینگی فیزیکی", "The new unit, and the end of physical cash", "covered", "bank",
    "همت دقیقاً همین است: یک واحد با تعریف ثابت، سقف عرضه و دفتر کل باز.",
    "HEMMAT is exactly this: one unit with a fixed definition, a supply ceiling and an open ledger."],
  ["P-032", "سی و دوم", "economy", "گذار از بانکداری سنتی به تأمین مالی مستقیم", "From intermediated banking to direct finance", "covered", "bank",
    "تبدیل و بازخرید بی‌واسطه با کارمزد ۲۰ bps و صف پرداخت، همان گذار در مقیاس کوچک است.",
    "Direct convert and redeem at a 20 bps fee, with a payment queue, is that transition at small scale."],
  ["P-033", "سی و سوم", "economy", "نظام مالیاتی هوشمند و لحظه‌ای", "Instant, embedded taxation", "gap", "bank",
    "مالیات در داده نیست؛ فقط کارمزد ۲۰ bps که مالیات نیست و نباید با آن اشتباه شود.",
    "No tax exists in the data; only the 20 bps fee, which is not a tax and must not be confused with one."],
  ["P-034", "سی و چهارم", "economy", "مدیریت شفاف بودجه و خزانه", "A transparent budget and treasury", "partial", "accountability",
    "ردیف‌های حسابرسی و گزارش عمومی دیده می‌شوند؛ تراز بودجه و خزانه در داده نیست.",
    "Audit rows and public reports exist; no budget balance or treasury flows."],
  ["P-035", "سی و پنجم", "economy", "مالکیت مشاع ملی بر منابع استراتژیک", "Collective ownership of strategic resources", "partial", "bank",
    "سقف عرضه از پشتوانهٔ منابع با زنجیرهٔ کسر می‌آید؛ خود منابع در سامانه ثبت نمی‌شوند.",
    "The ceiling derives from resource backing through the haircut chain; the resources themselves are not registered."],
  ["P-036", "سی و ششم", "economy", "صیانت از مالکیت معنوی", "Intellectual property", "gap", "legacy",
    "ثبت اثر و امارهٔ مالکیت در پروندهٔ هستی نیست؛ افزودنی است.",
    "No work registration or presumption of ownership in the estate file; it could be added."],
  ["P-037", "سی و هفتم", "economy", "بازرگانی بین‌المللی و گمرک خودکار", "International trade and automated customs", "outside", null,
    "گمرک و بازرسی کالا کار نهاد اجرایی و مرز است.",
    "Customs and goods inspection are executive and border work."],
  ["P-038", "سی و هشتم", "economy", "مقابلهٔ ساختاری با احتکار و سوداگری زمین", "Countering hoarding and land speculation", "gap", "projects",
    "مالیات تصاعدی زمین معطل در داده نیست؛ می‌تواند کنار پروژه‌ها بیاید.",
    "No progressive tax on idle land in the data; it could sit beside the projects."],
  ["P-039", "سی و نهم", "economy", "امنیت حقوقی و تضمین سرمایهٔ مولد", "Legal security for productive capital", "outside", null,
    "تضمین حقوقی سرمایه به دادگاه، ثبت و قانون نیاز دارد.",
    "Legal security for capital requires courts, registries and statute."],
  ["P-040", "چهلم", "economy", "حسابرسی اجتماعی و محیط‌زیستی واحدهای اقتصادی", "Social and environmental audit of firms", "partial", "accountability",
    "حسابرسی و ردپا به‌صورت ادعا و ردیف حسابرسی هست؛ پایش زندهٔ صنعت نیست.",
    "Audit and footprint appear as claims and audit rows; no live industrial monitoring."],

  ["P-041", "چهل و یکم", "knowledge", "نفی انحصار رسانه‌ای و رسانه‌های خوشه‌ای", "No media monopoly; clustered media", "partial", "research",
    "منابع متعدد و قابل بازبینی‌اند؛ رسانه و انتشار واقعی وجود ندارد.",
    "Sources are plural and inspectable; there is no media outlet and no real publishing."],
  ["P-042", "چهل و دوم", "knowledge", "نظام آموزشی هوشمند و شخصی‌سازی‌شده", "A smart, personalised education system", "gap", "research",
    "مسیر یادگیری و محتوای آموزشی در داده نیست؛ افزودنی است به کتابخانه.",
    "No learning path or curriculum in the data; it could join the library."],
  ["P-043", "چهل و سوم", "knowledge", "صیانت از میراث فرهنگی و زبان فارسی", "Cultural heritage and the Persian language", "covered", "archive",
    "پرونده‌های تاریخی، زبان فارسی به‌عنوان زبان پیش‌فرض و واژه‌نامهٔ الزام‌آور.",
    "Historical dossiers, Persian as the default language, and an enforced glossary."],
  ["P-044", "چهل و چهارم", "knowledge", "آزادی نقد و امنیت افشاگران", "Freedom to critique; protection for whistleblowers", "partial", "accountability",
    "نقد و ثبت شکایت مدل شده؛ حفاظت واقعی از افشاگر نیاز به قانون دارد.",
    "Critique and complaints are modelled; real whistleblower protection needs law."],
  ["P-045", "چهل و پنجم", "knowledge", "پیوند دانش و هنر (صنایع خلاق)", "Knowledge and the arts", "outside", null,
    "حمایت از هنرمند، حق امتیاز و بازار اثر کار نهاد فرهنگی و بودجه است.",
    "Supporting artists, royalties and cultural markets are cultural-budget work."],
  ["P-046", "چهل و ششم", "knowledge", "تربیت بدنی و سلامت جسمانی", "Sport and physical health", "partial", "verification",
    "قاعدهٔ حداقل داده، پایش بدن را ممنوع می‌کند؛ خود ورزش در سامانه نیست.",
    "The data-minimum rule forbids body monitoring; sport itself is not here."],
  ["P-047", "چهل و هفتم", "knowledge", "اخلاق در هوش مصنوعی و فناوری‌زیست", "Ethics of AI and biotech", "covered", "interface",
    "هیچ تصمیمی خودکار گرفته نمی‌شود، هر ادعا برچسب معرفتی دارد، و انسان در حلقه اعلام شده است.",
    "Nothing is decided automatically, every claim carries an epistemic label, and the human in the loop is stated."],
  ["P-048", "چهل و هشتم", "knowledge", "حقوق اقلیت‌های فکری و مذهبی", "Rights of intellectual and religious minorities", "partial", "interface",
    "رابط هیچ کس را رتبه‌بندی نمی‌کند و دوزبانه است؛ تضمین حقوقی ابزار رابط نیست.",
    "The interface ranks no one and is bilingual; legal guarantees are not an interface's tool."],
  ["P-049", "چهل و نهم", "knowledge", "گردشگری دانش‌محور و دیپلماسی فرهنگی", "Knowledge tourism and cultural diplomacy", "outside", null,
    "روادید، امنیت و زیرساخت سفر کار نهادهای اجرایی است.",
    "Visas, security and travel infrastructure are executive work."],
  ["P-050", "پنجاهم", "knowledge", "حق بر آرامش روانی و سکوت دیجیتال", "Digital quiet", "partial", "interface",
    "سامانه ردیابی و اعلان اجباری ندارد و آفلاین به‌طور کامل کار می‌کند؛ سکوت را تضمین نمی‌کند.",
    "The app has no tracking or push pressure and works offline; it cannot guarantee quiet."],

  ["P-051", "پنجاه و یکم", "security", "بازتعریف امنیت ملی", "Redefining national security", "outside", null,
    "امنیت زیرساخت حیاتی و مرز، کار نهادهای امنیتی است.",
    "Critical-infrastructure and border security are security institutions' work."],
  ["P-052", "پنجاه و دوم", "security", "گره صیانت ملی", "The national protection node", "outside", null,
    "فرماندهی نظامی زیر نظر غیرنظامی در یک رابط قابل نمایش نیست.",
    "Civilian command of armed forces cannot be shown in an interface."],
  ["P-053", "پنجاه و سوم", "security", "صیانت از حریم خصوصی در برابر نهادهای امنیتی", "Privacy against security agencies", "partial", "verification",
    "دسترسی کمینه، مستند و زیر نظارت قضایی در باندها مدل شده؛ نهاد امنیتی وجود ندارد.",
    "Least-privilege, documented, judicially supervised access is modelled in the bands; no agency exists."],
  ["P-054", "پنجاه و چهارم", "security", "دیپلماسی داده‌محور", "Data-driven diplomacy", "outside", null,
    "مذاکره و معاهده کار دستگاه دیپلماسی است.",
    "Negotiation and treaties are diplomacy's work."],
  ["P-055", "پنجاه و پنجم", "security", "صیانت از ایرانیان خارج از کشور", "Protecting Iranians abroad", "outside", null,
    "حمایت کنسولی به شبکهٔ سفارت و خدمات حقوقی واقعی نیاز دارد.",
    "Consular protection needs embassies and real legal services."],
  ["P-056", "پنجاه و ششم", "security", "پناهندگی علمی و جذب نخبگان", "Scientific asylum", "outside", null,
    "روادید، اقامت و حمایت قانونی بیرون از دامنهٔ این نمونه است.",
    "Visas, residence and legal protection are outside this prototype's scope."],
  ["P-057", "پنجاه و هفتم", "security", "امنیت زنجیرهٔ تأمین و خودکفایی", "Supply-chain security", "outside", null,
    "موجودی انبار، مسیر تأمین و ذخیرهٔ راهبردی در داده نیست و کار عملیات است.",
    "Inventory, routes and strategic reserves are operational work, absent from the data."],
  ["P-058", "پنجاه و هشتم", "security", "مقابله با تروریسم و جرایم سازمان‌یافته", "Counter-terrorism and organised crime", "outside", null,
    "الگوهای مشکوک به‌عنوان سرنخ، نه دلیل، کار نهاد قضایی و امنیتی است.",
    "Suspicious patterns as leads, not proof, are judicial and security work."],
  ["P-059", "پنجاه و نهم", "security", "پدافند غیرعامل و مدیریت بحران", "Civil defence and disaster management", "partial", "simulations",
    "سناریوی بحران و زمان‌بندی واکنش سنجیده می‌شود؛ عملیات امداد وجود ندارد.",
    "Crisis scenarios and response timing are weighed; there is no relief operation."],
  ["P-060", "شصتم", "security", "صیانت از محیط زیست به‌عنوان امنیت ملی", "Environment as national security", "partial", "projects",
    "پروژه‌ها اثر زیست‌محیطی و ادعای پایش دارند؛ پایش واقعی نیست.",
    "Projects carry environmental impact and monitoring claims; nothing is really monitored."],

  ["P-061", "شصت و یکم", "welfare", "حق بر سلامت جامع و پزشکی فردمحور", "Health and person-centred medicine", "partial", "services",
    "خدمات سلامت در فهرست آمده؛ پروندهٔ درمانی و رضایت آگاهانه در سامانه نیست.",
    "Health services are listed; no medical record or informed consent exists here."],
  ["P-062", "شصت و دوم", "welfare", "نظام بیمهٔ هوشمند", "Smart insurance", "gap", "services",
    "پوشش ریسک و قرارداد بیمه در داده نیست؛ افزودنی است.",
    "No risk cover or insurance contract in the data; it could be added."],
  ["P-063", "شصت و سوم", "welfare", "رفاه اجتماعی و اعتبار معیشتی", "Welfare and a livelihood credit", "gap", "services",
    "اعتبار معیشتی، آستانهٔ فقر و واجدین شرایط در داده نیست.",
    "No livelihood credit, poverty line or eligibility data."],
  ["P-064", "شصت و چهارم", "welfare", "تأمین آتیه و بازنشستگی پویا", "Pensions and future provision", "gap", "services",
    "کف تضمین‌شده و ذخیرهٔ اعتبار در داده نیست.",
    "No guaranteed floor or credit reserve in the data."],
  ["P-065", "شصت و پنجم", "welfare", "حقوق توانخواهان و عدالت در دسترسی", "Disability rights and access equity", "covered", "interface",
    "کنتراست AA، پیمایش با صفحه‌کلید، هدف لمسی ۲۴ پیکسل، صفر ایراد axe در دو تم و دو زبان.",
    "AA contrast, keyboard-only paths, 24 px targets, zero axe violations across themes and languages."],
  ["P-066", "شصت و ششم", "welfare", "صیانت از خانواده و حقوق کودکان", "Family protection and children's rights", "outside", null,
    "حمایت خانواده و سرپرستی کودک کار مددکاری، دادگاه و قانون است.",
    "Family support and custody are social-work, court and statute work."],
  ["P-067", "شصت و هفتم", "welfare", "مدیریت دوران سالمندی", "Ageing and care", "gap", "services",
    "مراقبت، خانهٔ سالمندان و مشارکت سالمند در داده نیست.",
    "No care, housing or participation data for older people."],
  ["P-068", "شصت و هشتم", "welfare", "حق بر سلامت روان و شادی عمومی", "Mental health and public wellbeing", "outside", null,
    "سیاست سلامت روان و شاخص‌های تجمیعی کار نهاد سلامت است.",
    "Mental-health policy and aggregate indicators are a health institution's work."],
  ["P-069", "شصت و نهم", "welfare", "تغذیهٔ سالم و امنیت غذایی", "Nutrition and food security", "outside", null,
    "زنجیرهٔ غذا و شناسنامهٔ سلامت محصول کار نهاد نظارت غذایی است.",
    "Food chains and product health records are food-safety regulators' work."],
  ["P-070", "هفتادم", "welfare", "مدیریت مواد مخدر و آسیب‌های اجتماعی", "Drug policy and social harm", "outside", null,
    "درمان، کاهش آسیب و بازپروری کار نهاد درمانی و مددکاری است.",
    "Treatment, harm reduction and rehabilitation are health and social-work tasks."],

  ["P-071", "هفتاد و یکم", "environment", "آمایش سرزمین بر پایهٔ توان اکولوژیک", "Land-use planning within ecological capacity", "partial", "projects",
    "پروژه‌ها ظرفیت و اثر زمین را ادعا می‌کنند؛ آمایش واقعی نیست.",
    "Projects claim land capacity and impact; no real spatial plan."],
  ["P-072", "هفتاد و دوم", "environment", "حق بر آب و مدیریت منابع آبی", "Water rights and water management", "gap", "projects",
    "حوضهٔ آبریز، سهم و کیفیت آب در داده نیست؛ جای کار است.",
    "No basin, allocation or water-quality data; there is room for it."],
  ["P-073", "هفتاد و سوم", "environment", "شهرهای هوشمند و بوم‌زیست‌های نوین", "Smart cities and new habitats", "outside", null,
    "ساخت شهر، حمل‌ونقل و مسکن کار شهرداری و بودجهٔ عمرانی است.",
    "Building cities, transport and housing is municipal and capital-budget work."],
  ["P-074", "هفتاد و چهارم", "environment", "گذار به انرژی‌های پاک", "Transition to clean energy", "partial", "projects",
    "پروژهٔ انرژی تجدیدپذیر با ظرفیت و اثر در فهرست هست؛ شبکهٔ برق نیست.",
    "A renewable project with capacity and impact is listed; there is no grid."],
  ["P-075", "هفتاد و پنجم", "environment", "صیانت از تنوع زیستی و حقوق طبیعت", "Biodiversity and rights of nature", "outside", null,
    "ارزش حقوقی مستقل طبیعت نیازمند قانون و دادگاه است.",
    "Independent legal standing for nature requires statute and courts."],
  ["P-076", "هفتاد و ششم", "environment", "مدیریت پسماند و اقتصاد چرخشی", "Waste and the circular economy", "outside", null,
    "جمع‌آوری، بازیافت و مسئولیت تولیدکننده کار عملیات شهری است.",
    "Collection, recycling and producer responsibility are municipal operations."],
  ["P-077", "هفتاد و هفتم", "environment", "حق بر هوای پاک و سکوت محیطی", "Clean air and environmental quiet", "outside", null,
    "پایشگر آلودگی و پاسخ به تخلف کار نهاد محیط زیست است.",
    "Pollution monitoring and enforcement are an environment agency's work."],
  ["P-078", "هفتاد و هشتم", "environment", "امنیت غذایی و کشاورزی دانش‌محور", "Food security and knowledge-based farming", "outside", null,
    "آب، بذر، زمین و معیشت کشاورز کار وزارت کشاورزی است.",
    "Water, seed, land and farm livelihoods are agriculture-ministry work."],
  ["P-079", "هفتاد و نهم", "environment", "پدافند زیستی و مقابله با تغییرات اقلیمی", "Biodefence and climate adaptation", "partial", "simulations",
    "سناریوی اقلیمی سخت در آزمایشگاه سنجیده می‌شود؛ تاب‌آوری واقعی ساخته نمی‌شود.",
    "A hard climate scenario is weighed in the lab; real resilience is not built."],
  ["P-080", "هشتادم", "environment", "حقوق نسل‌های آینده بر منابع", "Future generations' claim on resources", "partial", "bank",
    "سقف عرضه از پشتوانه می‌آید و سهم نسل آینده در زنجیرهٔ کسر دیده شده؛ صندوق ثروت واقعی نیست.",
    "The ceiling follows backing and the haircut chain carries a future share; no real wealth fund."],

  ["P-081", "هشتاد و یکم", "justice", "دادرسی یاری‌دار الگوریتمی و حاکمیت قاضی انسانی", "Algorithm-assisted trial, human judgment", "partial", "simulations",
    "قاعدهٔ «هیچ تصمیم خودکار» در طراحی و برچسب‌ها هست؛ دادگاهی وجود ندارد.",
    "The no-automatic-decision rule lives in the design and labels; there is no court."],
  ["P-082", "هشتاد و دوم", "justice", "شناسنامهٔ حقوقی و شفافیت پرونده‌ها", "Case transparency for parties and observers", "partial", "accountability",
    "شفافیت و استثناهای آن مدل شده؛ پروندهٔ واقعی در سامانه نیست.",
    "Transparency and its exceptions are modelled; no real case file exists."],
  ["P-083", "هشتاد و سوم", "justice", "وکالت هوشمند و برابری در دفاع", "Equal access to counsel", "gap", "services",
    "وکیل پایه و مشاورهٔ حقوقی در فهرست خدمات نیست؛ افزودنی است.",
    "No baseline counsel or legal aid in the service list; it could be added."],
  ["P-084", "هشتاد و چهارم", "justice", "جرم‌انگاری نوین و جبران خسارت", "Restorative justice", "outside", null,
    "مجازات، جبران و بازپروری کار قانون و دادگاه است.",
    "Sentencing, compensation and rehabilitation are statute and court work."],
  ["P-085", "هشتاد و پنجم", "justice", "صیانت از قانون اساسی (میثاق ملی)", "Guarding the covenant", "partial", "governance",
    "منشور پیش‌نویس با وضعیت معرفتی و سابقهٔ تغییر نگه داشته می‌شود؛ صیانت قضایی نیست.",
    "The draft charter is kept with epistemic status and change history; no judicial review."],
  ["P-086", "هشتاد و ششم", "justice", "پلیس هوشمند و کشف علمی جرم", "Smart policing under judicial oversight", "outside", null,
    "پلیس، بازداشت و تفتیش بیرون از دامنهٔ یک رابط است.",
    "Police, detention and search are beyond an interface's scope."],
  ["P-087", "هشتاد و هفتم", "justice", "دادرسی فرامرزی و حقوق بین‌الملل", "Cross-border justice", "outside", null,
    "دادگاه بین‌المللی و استرداد کار معاهده و دیپلماسی است.",
    "International courts and extradition are treaty and diplomacy work."],
  ["P-088", "هشتاد و هشتم", "justice", "حقوق بزهکاران نادم و پاکسازی پیشینه", "Rehabilitation and clearing of records", "outside", null,
    "پاکسازی پیشینه نیازمند سامانهٔ قضایی و قانون است.",
    "Clearing records needs a judicial system and statute."],
  ["P-089", "هشتاد و نهم", "justice", "استقلال قوهٔ قضاییه", "Judicial independence", "partial", "governance",
    "تفکیک کارکرد و استقلال حسابرسی در منشور پیش‌نویس آمده؛ نهاد قضایی وجود ندارد.",
    "Separation of functions and independent audit appear in the draft charter; no judiciary exists."],
  ["P-090", "نودم", "justice", "حق بر نظارت همگانی و دادخواهی مدنی", "Public oversight and civil complaint", "partial", "accountability",
    "گزارش عمومی و ردیف حسابرسی قابل پیگیری‌اند؛ سامانهٔ شکایت واقعی نیست.",
    "Public reports and audit rows are traceable; no real complaint system."],

  ["P-091", "نود و یکم", "revision", "خوداصلاحی و به‌روزرسانی میثاق", "Self-amendment of the covenant", "partial", "governance",
    "منشور نسخه، تاریخ و وضعیت هر اصل را نگه می‌دارد؛ فرایند اصلاح تصویب نمی‌شود.",
    "The charter keeps a version, date and status per principle; no amendment is ratified."],
  ["P-092", "نود و دوم", "revision", "پروتکل بقای ملی در شرایط اضطراری", "National survival protocol in emergencies", "partial", "simulations",
    "سناریوی بحران با زمان‌بندی و قید بررسی می‌شود؛ پروتکل الزام‌آور نیست.",
    "Emergency scenarios are weighed with timing and limits; no binding protocol."],
  ["P-093", "نود و سوم", "revision", "گذار از نظام سنتی به حاکمیت شبکه", "Migration to network governance", "covered", "transition",
    "فازهای گذار، گام‌ها، ریسک‌ها و وابستگی‌ها با وضعیت صریح «اجرا نشده» آمده است.",
    "Transition phases, steps, risks and dependencies are shown, each marked not executed."],
  ["P-094", "نود و چهارم", "revision", "مهاجرت اقتصادی و جایگزینی دارایی‌ها", "Asset migration", "partial", "bank",
    "تبدیل تومان به همت با کارمزد و صف طراحی شده؛ هیچ دارایی واقعی منتقل نمی‌شود.",
    "Toman-to-HEMMAT conversion with fee and queue is designed; no real asset moves."],
  ["P-095", "نود و پنجم", "revision", "صیانت از حاکمیت ملی در برابر مداخلهٔ خارجی", "Sovereignty against foreign interference", "outside", null,
    "پاسخ به مداخله کار نهاد امنیتی و حقوقی است.",
    "Responding to interference is security and legal work."],
  ["P-096", "نود و ششم", "revision", "حق بر مهاجرت و خروج از شبکه", "The right to leave the network", "partial", "bank",
    "بازخرید هرگز با سطح یا تعلیق صدور بسته نمی‌شود؛ در بدترین حالت در صف می‌نشیند.",
    "Redemption is never capped by a level or blocked by an issuance pause; at worst it queues."],
  ["P-097", "نود و هفتم", "revision", "تعامل با اپوزیسیون و منتقدان", "A digital roundtable with critics", "partial", "simulations",
    "آزمایشگاه جای گزینهٔ مخالف را باز می‌کند؛ میزگرد واقعی نیست.",
    "The lab opens room for the opposing option; it is not a real roundtable."],
  ["P-098", "نود و هشتم", "revision", "رفراندوم تغییر بنیادین", "Referendum on fundamental change", "partial", "levels",
    "نصاب و رأی محاسبه‌پذیر است؛ رأی‌گیری واقعی و مخفی وجود ندارد.",
    "Quorum and tallies are computable; there is no real secret ballot."],
  ["P-099", "نود و نهم", "revision", "سوگند وفاداری به میثاق", "An oath to the covenant", "gap", "governance",
    "متن و ثبت سوگند در داده نیست؛ افزودنی است کنار منشور.",
    "No oath text or register in the data; it could sit beside the charter."],
  ["P-100", "صدم", "revision", "پایداری میثاق و میراث آیندگان", "Durability and the inheritance of the future", "partial", "archive",
    "نسخه‌ها، تاریخ‌ها و پرونده‌ها می‌مانند؛ پایداری نهادی واقعی ادعا نمی‌شود.",
    "Versions, dates and dossiers persist; no real institutional durability is claimed."]
];

const surfaces = (id) => {
  if (!id) return null;
  const surface = SURFACES[id];
  if (!surface) throw new Error(`unknown principle surface: ${id}`);
  return { id, route: surface.route, label: surface.label };
};

export const principles = Object.freeze(
  RAW.map(([id, label, chapter, fa, en, status, surface, noteFa, noteEn]) => ({
    id,
    label: { fa: label, en: id.startsWith("Z-") ? `0.${Number(id.slice(2))}` : String(Number(id.slice(2))) },
    chapter,
    title: { fa, en },
    coverage: status,
    light: LIGHT_BY_STATUS[status].id,
    surface: surfaces(surface),
    note: { fa: noteFa, en: noteEn }
  }))
);

export const PRINCIPLE_COVERAGE_QUESTION = Object.freeze({
  fa: "این نمونه چه چیزی از سند مادر را نشان می‌دهد، و چه چیزی را هرگز نمی‌تواند نشان دهد؟",
  en: "What does this prototype demonstrate from the mother file, and what can it never demonstrate?"
});

export function buildPrinciples() {
  const counts = Object.fromEntries(COVERAGE_STATUSES.map((status) => [status.id, 0]));
  for (const principle of principles) counts[principle.coverage] += 1;

  const byChapter = PRINCIPLE_CHAPTERS.map((chapter) => {
    const rows = principles.filter((principle) => principle.chapter === chapter.id);
    const chapterCounts = Object.fromEntries(COVERAGE_STATUSES.map((status) => [status.id, 0]));
    for (const row of rows) chapterCounts[row.coverage] += 1;
    return { ...chapter, principles: rows, counts: chapterCounts };
  });

  const lightCounts = Object.fromEntries(PRINCIPLE_LIGHTS.map((light) => [light.id, 0]));
  for (const principle of principles) lightCounts[principle.light] += 1;
  const overall = readinessOf(principles);
  const band = bandFor(overall.readiness);

  return {
    motherFile: MOTHER_FILE,
    question: PRINCIPLE_COVERAGE_QUESTION,
    statuses: COVERAGE_STATUSES,
    // The light rail: one dot per principle, the weights that make the score
    // honest, and the band the whole covenant currently sits in.
    lights: {
      order: PRINCIPLE_LIGHTS.map((light) => light.id),
      definitions: PRINCIPLE_LIGHTS,
      counts: lightCounts,
      readiness: overall.readiness,
      counted: overall.counted,
      excluded: overall.excluded,
      band: { id: band.id, label: band.label },
      bands: READINESS_BANDS,
      // What "live" would mean, stated so nobody can claim it by accident.
      liveRequires: {
        fa: "همهٔ اصل‌ها سبز، و تصویب واقعی بیرون از این سامانه؛ این نمونه هیچ‌گاه ادعای «زنده» نمی‌کند.",
        en: "Every principle green and a real ratification outside this system; this prototype never claims Live."
      }
    },
    // Flat list for clients that filter; the chapters keep the reading order.
    principles,
    chapters: byChapter.map((chapter) => ({
      ...chapter,
      readiness: readinessOf(chapter.principles).readiness,
      band: bandFor(readinessOf(chapter.principles).readiness).label
    })),
    summary: {
      total: principles.length,
      counts,
      // Coverage that a screen can be held to: the two statuses that are claims.
      demonstrated: counts.covered,
      represented: counts.partial,
      gaps: counts.gap,
      beyondSoftware: counts.outside
    },
    method: {
      fa: "هر اصل تنها با اشاره به یک سطح کارکننده یا یک دادهٔ موجود «پوشش کامل» گرفته است؛ آنچه نمونه نمی‌تواند انجام دهد «بیرون از دامنهٔ نرم‌افزار» ثبت شده و آنچه می‌توانست و نکرده «جای خالی» است.",
      en: "A principle earns Covered only by pointing at a working surface or an existing record. What a prototype cannot do is recorded as Beyond software; what it could do and does not yet is a Gap."
    }
  };
}
