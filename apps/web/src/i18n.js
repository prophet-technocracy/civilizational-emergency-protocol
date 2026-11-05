// Bilingual UI dictionary + formatting helpers for the CEP interface.
// Persian is the default (RTL); English is a first-class switchable locale (LTR).

export const MODULES = [
  { id: "dashboard", number: 1, icon: "dashboard", title: { fa: "پیشخوان تمدنی", en: "Civilization Dashboard" }, short: { fa: "پیشخوان", en: "Dashboard" } },
  { id: "governance", number: 2, icon: "governance", title: { fa: "حکمرانی و منشور", en: "Governance & Constitution" }, short: { fa: "حکمرانی", en: "Governance" } },
  { id: "transition", number: 3, icon: "transition", title: { fa: "معماری گذار ایران", en: "Iran Transition Architecture" }, short: { fa: "گذار", en: "Transition" } },
  { id: "institutions", number: 4, icon: "institutions", title: { fa: "کارپوشهٔ نهادها", en: "Institutional Directory" }, short: { fa: "نهادها", en: "Institutions" } },
  { id: "historical-archive", number: 5, icon: "archive", title: { fa: "بایگانی تاریخی", en: "Historical Archive" }, short: { fa: "بایگانی", en: "Archive" } },
  { id: "research", number: 6, icon: "research", title: { fa: "کتابخانهٔ پژوهش و شواهد", en: "Research & Evidence Library" }, short: { fa: "شواهد", en: "Evidence" } },
  { id: "verification", number: 7, icon: "verification", title: { fa: "تضمین دسترسی پنج‌سطحی", en: "Five-Band Assurance" }, short: { fa: "تضمین دسترسی", en: "Assurance" } },
  { id: "accountability", number: 8, icon: "accountability", title: { fa: "پاسخگویی و شفافیت", en: "Accountability & Transparency" }, short: { fa: "پاسخگویی", en: "Accountability" } },
  { id: "public-services", number: 9, icon: "services", title: { fa: "راهنمای خدمات عمومی", en: "Public Service Directory" }, short: { fa: "خدمات عمومی", en: "Services" } },
  { id: "projects", number: 10, icon: "projects", title: { fa: "پروژه‌های نفع عمومی", en: "Public-Good Projects" }, short: { fa: "پروژه‌ها", en: "Projects" } },
  { id: "simulations", number: 11, icon: "lab", title: { fa: "آزمایشگاه طراحی نهادی", en: "Institutional Design Lab" }, short: { fa: "آزمایشگاه", en: "Design Lab" } },
  { id: "digital-legacy", number: 12, icon: "legacy", title: { fa: "میراث دیجیتال و اصل ۲۰", en: "Digital Legacy & Principle 20" }, short: { fa: "میراث دیجیتال", en: "Digital Legacy" } }
];

export const DEPARTMENTS = {
  "DEPT-A": { fa: "الف — معماری", en: "A — Architecture" },
  "DEPT-B": { fa: "ب — حکمرانی", en: "B — Governance" },
  "DEPT-C": { fa: "ج — گذار ایران", en: "C — Iran Transition" },
  "DEPT-D": { fa: "د — تاریخ", en: "D — History & Archives" },
  "DEPT-E": { fa: "ه — تضمین دسترسی", en: "E — Assurance" },
  "DEPT-F": { fa: "و — شواهد", en: "F — Evidence" },
  "DEPT-G": { fa: "ز — تجربهٔ کاربری", en: "G — Experience" },
  "DEPT-H": { fa: "ح — امنیت و حسابرسی", en: "H — Security & Audit" }
};

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(value) {
  return String(value ?? "").replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

export function formatNumber(value, lang) {
  if (value === null || value === undefined) return "—";
  return lang === "fa" ? toPersianDigits(value) : String(value);
}

/** Picks the active-language string from a `{ fa, en }` pair. */
export function t(value, lang) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value;
  return value[lang] ?? value.fa ?? value.en ?? "";
}

export const UI = {
  fa: {
    actions: "عملیات",
    dir: "rtl",
    skip: "پرش به محتوای اصلی",
    brand: "سامانهٔ عامل مدنی",
    levelsNav: "پنج سطح شهروندی",
    brandAccent: "CEP",
    subtitle: "پروتکل اضطرار تمدنی · نمونهٔ زیرساخت مدنی",
    demoTitle: "نمونهٔ نمایشی محلی و فقط‌خواندنی",
    demoBody:
      "همهٔ داده‌ها ساختگی است. CEP نه دولت است، نه مرجع انتخابات، نه نهاد نمایندگی و نه دارای قیمومیت عمومی. هیچ دادهٔ فرد زنده یا دادهٔ شخصی در این سامانه وجود ندارد.",
    demoDismiss: "بستن هشدار",
    demoReopen: "نمایش هشدار",
    readOnly: "فقط GET · بدون کوکی و ردیابی",
    searchHint: "Ctrl + K",
    modules: "بخش‌ها",
    menu: "فهرست بخش‌ها",
    theme: "پوسته",
    themeLight: "روشن",
    themeDark: "تیره",
    language: "زبان",
    languageSwitch: "English",
    breadcrumbHome: "پیشخوان",
    provenance: "منشأ و استناد",
    inspectProvenance: "بررسی منشأ",
    provenanceTitle: "زنجیرهٔ منشأ و استناد",
    provenanceClose: "بستن",
    epistemicStatus: "وضعیت معرفتی",
    source: "سند منبع",
    sourceVersion: "نسخه",
    section: "بخش / صفحه",
    publicationDate: "تاریخ انتشار",
    reviewer: "وضعیت بازبینی",
    confidence: "ارزیابی اطمینان",
    contradictions: "تناقض‌های شناخته‌شده",
    revisionHistory: "تاریخچهٔ بازبینی",
    noContradictions: "تناقضی ثبت نشده است.",
    openInResearch: "مشاهده در کتابخانهٔ شواهد",
    loading: "در حال بارگذاری…",
    loadError: "بارگذاری این بخش ممکن نشد.",
    retry: "تلاش دوباره",
    of: "از",
    all: "همه",
    reset: "بازنشانی",
    filter: "صافی",
    search: "جستجو",
    searchInModule: "جستجو در این بخش…",
    viewDetails: "جزئیات",
    back: "بازگشت",
    show: "نمایش",
    hide: "پنهان",
    yes: "بله",
    no: "خیر",
    none: "هیچ",
    notRecorded: "ثبت نشده",
    illustrative: "نمایشی",
    synthetic: "ساختگی",
    sourceVerified: "تأییدشده در منبع",
    footer:
      "CEP یک کوشش مدنی است، نه دولت. این نمونه برای بازبینی انسانی و آزمون پذیرش ساخته شده و استقرار عمومی آن مسدود تا دروازه‌های انسانی است.",
    footerMeta: "شاخهٔ نشست: arena/4c526f6a · نسخهٔ طرح‌واره ۱٫۰٫۰",
    governanceNote: "هیچ رأی، نصاب یا تصویبی برای هیچ بخشی از این سامانه ثبت نشده است.",
    empty: "موردی برای نمایش نیست.",
    copied: "پیوند رونوشت شد",
    simulated: "شبیه‌سازی‌شده",
    demoActionNotice: "این کنش در مرورگر شما شبیه‌سازی می‌شود و هیچ داده‌ای ارسال نمی‌گردد.",
    close: "بستن",
    keyFindings: "یافته‌های کلیدی",
    metrics: "سنجه‌ها",
    notice: "توجه"
  },
  en: {
    actions: "Actions",
    dir: "ltr",
    skip: "Skip to main content",
    brand: "Civilizational Operating System",
    levelsNav: "Five civic levels",
    brandAccent: "CEP",
    subtitle: "Civilizational Emergency Protocol · civic infrastructure prototype",
    demoTitle: "Local read-only synthetic demonstrator",
    demoBody:
      "All data is synthetic. CEP is not a government, election authority, representative body, or holder of a public mandate. No living-person records or personal data exist in this system.",
    demoDismiss: "Dismiss notice",
    demoReopen: "Show notice",
    readOnly: "GET only · no cookies, no tracking",
    searchHint: "Ctrl + K",
    modules: "Sections",
    menu: "Section menu",
    theme: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    language: "Language",
    languageSwitch: "فارسی",
    breadcrumbHome: "Dashboard",
    provenance: "Provenance",
    inspectProvenance: "Inspect provenance",
    provenanceTitle: "Evidence provenance & citation chain",
    provenanceClose: "Close",
    epistemicStatus: "Epistemic status",
    source: "Source document",
    sourceVersion: "Version",
    section: "Section / page",
    publicationDate: "Publication date",
    reviewer: "Review status",
    confidence: "Confidence assessment",
    contradictions: "Known contradictions",
    revisionHistory: "Revision history",
    noContradictions: "No contradiction recorded.",
    openInResearch: "Open in evidence library",
    loading: "Loading…",
    loadError: "This section could not be loaded.",
    retry: "Retry",
    of: "of",
    all: "All",
    reset: "Reset",
    filter: "Filter",
    search: "Search",
    searchInModule: "Search within this section…",
    viewDetails: "Details",
    back: "Back",
    show: "Show",
    hide: "Hide",
    yes: "Yes",
    no: "No",
    none: "None",
    notRecorded: "Not recorded",
    illustrative: "Illustrative",
    synthetic: "Synthetic",
    sourceVerified: "Source-verified",
    footer:
      "CEP is a civic effort, not a government. This prototype exists for human review and acceptance testing; public deployment is gated pending human review.",
    footerMeta: "Session branch: arena/4c526f6a · schema v1.0.0",
    governanceNote: "No vote, quorum, or ratification is recorded for any part of this system.",
    empty: "Nothing to display.",
    copied: "Link copied",
    simulated: "Simulated",
    demoActionNotice: "This action is simulated in your browser; no data is submitted anywhere.",
    close: "Close",
    keyFindings: "Key findings",
    metrics: "Metrics",
    notice: "Notice"
  }
};

export const EPISTEMIC = {
  "source-verified": { fa: "تأییدشده در منبع", en: "Source-verified", tone: "good" },
  "source-reported": { fa: "گزارش‌شده در منبع", en: "Source-reported", tone: "info" },
  proposed: { fa: "پیشنهادی", en: "Proposed", tone: "neutral" },
  hypothetical: { fa: "فرضی", en: "Hypothetical", tone: "warn" },
  disputed: { fa: "مورد اختلاف", en: "Disputed", tone: "danger" },
  unverified: { fa: "تأییدنشده", en: "Unverified", tone: "danger" },
  "synthetic-fixture": { fa: "دادهٔ ساختگی", en: "Synthetic fixture", tone: "synthetic" }
};

export const REVIEW_STATUS = {
  draft: { fa: "پیش‌نویس", en: "Draft" },
  "pending-human-review": { fa: "در انتظار بازبینی انسانی", en: "Pending human review" },
  "editorial-reviewed": { fa: "بازبینی ویرایشی‌شده", en: "Editorial-reviewed" },
  "disputed-interpretation": { fa: "تفسیر مورد اختلاف", en: "Disputed interpretation" },
  "blocked-gate": { fa: "مسدود تا دروازه", en: "Blocked at gate" },
  "synthetic-demo": { fa: "نمایشی ساختگی", en: "Synthetic demo" }
};

// Enum labels for machine-readable slugs returned by the API. The slug itself
// stays available on the record; the UI never shows a raw slug to a reader.
export const ENUM_LABELS = {
  // governance / ratification
  "none-recorded": { fa: "هیچ موردی ثبت نشده", en: "None recorded" },
  "not-ratified": { fa: "تصویب‌نشده", en: "Not ratified" },
  // accountability
  "not-approved": { fa: "تأییدنشده", en: "Not approved" },
  "not-approved-for-public-deployment": { fa: "تأییدنشده برای استقرار عمومی", en: "Not approved for public deployment" },
  "human-reviewed": { fa: "بازبینی‌شده توسط انسان", en: "Human-reviewed" },
  "dissent-recorded": { fa: "مخالفت ثبت‌شده", en: "Dissent recorded" },
  "content-publication": { fa: "انتشار محتوا", en: "Content publication" },
  "design-revision": { fa: "بازنگری طراحی", en: "Design revision" },
  "fixture-addition": { fa: "افزودن دادهٔ نمونه", en: "Fixture addition" },
  "prototype-release": { fa: "انتشار نمونهٔ اولیه", en: "Prototype release" },
  // verification / access policy
  "synthetic-archive": { fa: "بایگانی ساختگی", en: "Synthetic archive" },
  "public-documents": { fa: "اسناد عمومی", en: "Public documents" },
  "deployment-configuration": { fa: "پیکربندی استقرار", en: "Deployment configuration" },
  "local-browser-preferences": { fa: "تنظیمات محلی مرورگر", en: "Local browser preferences" },
  "deliberation-feedback": { fa: "بازخورد هماندیشی", en: "Deliberation feedback" },
  "living-person-data": { fa: "دادهٔ فرد زنده", en: "Living-person data" },
  "identity-inference": { fa: "استنتاج هویت", en: "Identity inference" },
  "unauthorized-access": { fa: "دسترسی غیرمجاز", en: "Unauthorized access" },
  "voice-simulation": { fa: "شبیه‌سازی صدا", en: "Voice simulation" },
  "dignity-violation": { fa: "نقض کرامت", en: "Dignity violation" },
  "physical-risk": { fa: "خطر فیزیکی", en: "Physical risk" },
  "draft-dossiers": { fa: "پرونده‌های پیش‌نویس", en: "Draft dossiers" },
  // archive access
  "rights-protection": { fa: "حفاظت از حقوق", en: "Rights protection" },
  "judicial-review": { fa: "بازبینی قضایی", en: "Judicial review" },
  "principles-oversight": { fa: "نظارت بر اصول", en: "Principles oversight" },
  "executive-interim": { fa: "اجرایی موقت", en: "Executive (interim)" },
  // research / editions
  "cite-index-only-no-republication": { fa: "فقط ارجاع به نمایه؛ بازنشر ممنوع", en: "Cite index only, no republication" },
  "publishable-full-text": { fa: "متن کامل قابل انتشار", en: "Full text publishable" },
  "publishable-summary-only": { fa: "فقط خلاصه قابل انتشار", en: "Summary only publishable" },
  "unverified-edition": { fa: "نسخهٔ تأییدنشده", en: "Unverified edition" },
  "fixture-v1": { fa: "دادهٔ نمونه، نگارش ۱", en: "Fixture v1" },
  "v0.2-draft": { fa: "پیش‌نویس ۰٫۲", en: "Draft v0.2" },
  "v0.3-draft": { fa: "پیش‌نویس ۰٫۳", en: "Draft v0.3" },
  "v0.4-draft": { fa: "پیش‌نویس ۰٫۴", en: "Draft v0.4" },
  "v1.0-draft": { fa: "پیش‌نویس ۱٫۰", en: "Draft v1.0" },
  "v1.1": { fa: "نگارش ۱٫۱", en: "v1.1" },
  // services
  "static-public-links-only": { fa: "فقط پیوندهای عمومی ثابت", en: "Static public links only" },
  "public-telephone-number": { fa: "شمارهٔ تلفن عمومی", en: "Public telephone number" },
  // governance / accountability statuses
  "proposed": { fa: "پیشنهادی", en: "Proposed" },
  "merged-draft": { fa: "پیش‌نویس ادغام‌شده", en: "Merged draft" },
  "blocked": { fa: "مسدود", en: "Blocked" },
  "blocked-on-gate": { fa: "مسدود تا دروازه", en: "Blocked at gate" },
  "open": { fa: "باز", en: "Open" },
  "mitigated": { fa: "کاهش‌یافته", en: "Mitigated" },
  "declared": { fa: "اعلام‌شده", en: "Declared" },
  "complete": { fa: "کامل", en: "Complete" },
  "in-progress": { fa: "در جریان", en: "In progress" },
  "verified": { fa: "تأییدشده", en: "Verified" },
  "unverified": { fa: "تأییدنشده", en: "Unverified" },
  "deceased": { fa: "درگذشته", en: "Deceased" },
  "synthetic-demo": { fa: "نمایشی ساختگی", en: "Synthetic demo" },
  "synthetic-fixture": { fa: "دادهٔ نمونهٔ ساختگی", en: "Synthetic fixture" },
  "source-verified": { fa: "تأییدشده از منبع", en: "Source-verified" },
  "source-reported": { fa: "گزارش‌شده در منبع", en: "Source-reported" },
  "synthetic-only": { fa: "فقط ساختگی", en: "Synthetic only" },
  "disputed": { fa: "مورد اختلاف", en: "Disputed" },
  "unindexed": { fa: "فهرست‌نشده", en: "Unindexed" },
  "partially-answered": { fa: "تا حدی پاسخ‌داده‌شده", en: "Partially answered" },
  "approved": { fa: "تأییدشده", en: "Approved" },
  "approved-with-conditions": { fa: "تأیید مشروط", en: "Approved with conditions" },
  "informational": { fa: "اطلاعی", en: "Informational" },
  "gated": { fa: "دروازه‌دار", en: "Gated" },
  // institution / relationship categories
  "legislative": { fa: "قانون‌گذاری", en: "Legislative" },
  "rights-protection": { fa: "حفاظت از حقوق", en: "Rights protection" },
  "audit": { fa: "حسابرسی", en: "Audit" },
  "information": { fa: "اطلاع‌رسانی", en: "Information" },
  "prohibited": { fa: "ممنوع", en: "Prohibited" },
  "corruption": { fa: "فساد", en: "Corruption" },
  "identity-and-records": { fa: "هویت و سوابق", en: "Identity and records" },
  "tax": { fa: "مالیات", en: "Tax" },
  "social-insurance": { fa: "بیمهٔ اجتماعی", en: "Social insurance" },
  "statistics": { fa: "آمار", en: "Statistics" },
  "emergency": { fa: "اضطراری", en: "Emergency" },
  "public": { fa: "عمومی", en: "Public" },
  // source / relationship types
  "oversight": { fa: "نظارت", en: "Oversight" },
  "reference": { fa: "ارجاع", en: "Reference" },
  "appointment-limit": { fa: "محدودیت انتصاب", en: "Appointment limit" },
  "synthetic-primary": { fa: "منبع اولیهٔ ساختگی", en: "Synthetic primary" },
  "synthetic-secondary": { fa: "منبع ثانویهٔ ساختگی", en: "Synthetic secondary" },
  "synthetic-index": { fa: "نمایهٔ ساختگی", en: "Synthetic index" },
  "synthetic-report": { fa: "گزارش ساختگی", en: "Synthetic report" },
  // access-control decisions
  PROHIBITED_BY_CHARTER: { fa: "ممنوع به‌موجب منشور", en: "Prohibited by charter" },
  ALLOWED: { fa: "مجاز", en: "Allowed" },
  DENIED: { fa: "رد‌شده", en: "Denied" },
  REQUIRES_REVIEW: { fa: "نیازمند بازبینی", en: "Requires review" },
  ALLOWED_WITH_GATE: { fa: "مجاز با دروازه", en: "Allowed with gate" },
  // projects
  "partially-verified": { fa: "تا حدی تأییدشده", en: "Partially verified" }
};

/**
 * Renders a machine slug for humans. Known slugs get a localized label;
 * unknown ones falling back to the raw slug is intentional (never hide data).
 */
export function labelFor(value, lang) {
  if (value === null || value === undefined || value === "") return "—";
  return ENUM_LABELS[value] ? t(ENUM_LABELS[value], lang) : String(value);
}

const PERSIAN_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

/**
 * Formats an ISO date (or ISO date-time) for readers.
 * fa → Gregorian date in Persian month names; en → ISO day. No timezone
 * shifts, no Intl data dependency, and unknown input is returned untouched
 * so a malformed fixture never disappears from the interface.
 */
export function formatDate(value, lang = "fa", withTime = false) {
  if (!value || typeof value !== "string") return value ?? "—";
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/);
  if (!match) return value;
  const [, year, month, day, hour, minute] = match;
  const monthIndex = Number(month) - 1;
  const dayNumber = Number(day);
  if (!PERSIAN_MONTHS[monthIndex] || Number.isNaN(dayNumber)) return value;
  // Minutes stay Latin (`:04`), matching how clocks are set on Iranian devices.
  const clock = withTime && hour ? ` · ${formatNumber(Number(hour), lang)}:${minute}` : "";
  if (lang === "fa") {
    return `${formatNumber(dayNumber, lang)} ${PERSIAN_MONTHS[monthIndex]} ${formatNumber(Number(year), lang)}${clock}`;
  }
  return `${dayNumber} ${PERSIAN_MONTHS[monthIndex]} ${year}${clock}`;
}

/**
 * Formats "part of whole" counts (e.g. "7 of 10" / "۷ از ۱۰").
 *
 * A slash is the wrong separator for this: Persian and Arabic-Indic digits
 * carry bidi class AN, and a neutral character between two AN runs resolves to
 * right-to-left, so `7 / 10` prints visually as `10 / 7` in the RTL layout —
 * the ratio silently reads backwards. A word separator ("از" / "of") is a
 * strong right-to-left run, so it keeps the pair in reading order in both
 * scripts without needing markup or invisible isolate characters.
 */
export function formatRatio(part, whole, lang = "fa") {
  const joiner = lang === "fa" ? " از " : " of ";
  return `${formatNumber(part, lang)}${joiner}${formatNumber(whole, lang)}`;
}

export const FLAG_TYPES = {
  "missing-information": { fa: "کمبود اطلاعات", en: "Missing information" },
  "contradictory-information": { fa: "اطلاعات متناقض", en: "Contradictory information" }
};

export const MILESTONE_STATUS = {
  complete: { fa: "کامل", en: "Complete", tone: "good" },
  "in-progress": { fa: "در جریان", en: "In progress", tone: "info" },
  blocked: { fa: "مسدود", en: "Blocked", tone: "danger" },
  planned: { fa: "برنامه‌ریزی‌شده", en: "Planned", tone: "neutral" }
};

export const HORIZONS = {
  "emergency-180d": { fa: "فاز اضطراری ۱۸۰ روزه", en: "180-day emergency phase", tone: "emergency" },
  "transition-2-3y": { fa: "افق گذار ۲ تا ۳ ساله", en: "2–3 year transition horizon", tone: "transition" },
  "constitutional-longterm": { fa: "افق بلندمدت نهادی", en: "Long-term institutional horizon", tone: "longterm" }
};

export const RELATION_TYPES = {
  oversight: { fa: "نظارت", en: "Oversight" },
  audit: { fa: "حسابرسی", en: "Audit" },
  "judicial-review": { fa: "بازبینی قضایی", en: "Judicial review" },
  reference: { fa: "مرجع اصول", en: "Principles reference" },
  information: { fa: "ارجاع اطلاعاتی", en: "Information reference" },
  "appointment-limit": { fa: "منع انتصاب متقابل", en: "Appointment limit" }
};

export const BAND_TONES = ["public", "session", "attribute", "role", "admin"];
