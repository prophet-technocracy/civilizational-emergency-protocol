// CEP Multilingual & Persian RTL / English LTR Infrastructure
// Supports Persian numeral formatting, dual-calendar labels,
// Arabic/Persian character normalization for search, and UI localization.

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(input) {
  return String(input ?? "").replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export function toLatinDigits(input) {
  return String(input ?? "")
    .replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

export function formatLocalizedNumber(value, lang = "fa") {
  if (value === null || value === undefined) return "";
  return lang === "fa" ? toPersianDigits(value) : String(value);
}

/**
 * Normalizes Persian and English text for tolerant bilingual search:
 * - Unifies Arabic Yeh/Kaf (ي/ك) to Persian Yeh/Kaf (ی/ک)
 * - Removes zero-width non-joiner (ZWNJ) and diacritics for matching
 * - Converts Persian digits to Latin digits and lowercases Latin text
 */
export function normalizeSearchText(text) {
  if (!text) return "";
  return toLatinDigits(String(text))
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/ة/g, "ه")
    .replace(/\u200c/g, " ")
    .replace(/[\u064B-\u065F]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function matchesBilingualQuery(query, candidateStrings = []) {
  const normQuery = normalizeSearchText(query);
  if (!normQuery) return true;
  return candidateStrings.some((candidate) =>
    normalizeSearchText(candidate).includes(normQuery)
  );
}

export const EPISTEMIC_LABELS = Object.freeze({
  "source-verified": {
    fa: "تأییدشده در منبع عمومی",
    en: "Source-Verified",
    tone: "verified"
  },
  "source-reported": {
    fa: "گزارش‌شده در منبع",
    en: "Source-Reported",
    tone: "reported"
  },
  proposed: {
    fa: "پیشنهادی (تأییدنشدنی به‌عنوان قانون)",
    en: "Proposed (Unratified)",
    tone: "proposed"
  },
  hypothetical: {
    fa: "فرضی / شبیه‌سازی تحلیلی",
    en: "Hypothetical / Illustrative",
    tone: "hypothetical"
  },
  disputed: {
    fa: "مورد اختلاف در منابع",
    en: "Disputed Across Sources",
    tone: "disputed"
  },
  unverified: {
    fa: "بررسی‌نشده / نیازمند بازبینی",
    en: "Unverified / Pending Review",
    tone: "unverified"
  },
  "synthetic-fixture": {
    fa: "دادهٔ آزمایشی ساختگی",
    en: "Synthetic Demo Fixture",
    tone: "synthetic"
  }
});

export const UI_DICTIONARY = Object.freeze({
  fa: {
    dir: "rtl",
    lang: "fa",
    appName: "سامانهٔ عامل مدنی CEP",
    appSubtitle: "پروتکل اضطرار تمدنی · نمونهٔ زیرساخت دانش، حکمرانی و پاسخگویی",
    safetyBannerTitle: "حالت نمایشی محلی و خواندنی (Synthetic Demo):",
    safetyBannerText:
      "تمامی داده‌ها آزمایشی و ساختگی است. CEP یک دولت، مرجع انتخابات، نهاد نمایندگی یا دارای قیمومیت عمومی نیست. هیچ دادهٔ شخصی یا پروندهٔ افراد زنده در این سامانه وجود ندارد.",
    searchPlaceholder: "جستجو در نهادها، بایگانی تاریخی، ادعاها، منشور و خدمات (Ctrl+K)...",
    provenanceDrawerTitle: "زنجیرهٔ منشأ و استناد علمی (Provenance)",
    inspectProvenance: "بررسی منشأ و منبع",
    switchLanguage: "English (LTR)",
    toggleThemeLight: "پوستهٔ روشن",
    toggleThemeDark: "پوستهٔ تیره (کنترل مأموریت)",
    readOnlyBadge: "خواندنی (GET Only) · بدون ردیابی",
    noDeadButtonsNotice: "عملیات شبیه‌سازی‌شده در حافظهٔ محلی مرورگر (بدون ارسال دادهٔ شخصی)"
  },
  en: {
    dir: "ltr",
    lang: "en",
    appName: "CEP Civilizational Operating System",
    appSubtitle: "Civilizational Emergency Protocol · Open Civic Infrastructure Prototype",
    safetyBannerTitle: "Local Read-Only Synthetic Prototype:",
    safetyBannerText:
      "All records are synthetic fixtures. CEP is not a government, election authority, representative body, or holder of a public mandate. Zero personal data or living-person records are stored.",
    searchPlaceholder: "Search institutions, historical dossiers, claims, charter & services (Ctrl+K)...",
    provenanceDrawerTitle: "Evidence Provenance & Citation Chain",
    inspectProvenance: "Inspect Provenance",
    switchLanguage: "فارسی (RTL)",
    toggleThemeLight: "Light Paper Mode",
    toggleThemeDark: "Mission-Control Dark",
    readOnlyBadge: "Read-Only (GET Only) · Zero Tracking",
    noDeadButtonsNotice: "Simulated local demonstration action (zero external mutation or PII)"
  }
});
