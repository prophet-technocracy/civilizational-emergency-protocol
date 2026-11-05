// Canonical Persian institutional vocabulary for CEP.
//
// Every entry names one preferred Persian term, its English counterpart, and
// the variants that must not appear in interface copy. The variants are the
// mistakes a translator actually makes here: a full space where a half-space
// (نیم‌فاصله) belongs, an Arabic letter instead of the Persian one, or a
// synonym that quietly renames an institution across screens.
//
// The markdown version of this table lives in docs/localization/PERSIAN-GLOSSARY.md;
// this module is the machine-readable copy that the tests enforce.

export const ARABIC_VARIANTS = Object.freeze({
  "\u064A": "ی", // ARABIC YEH → FARSI YEH
  "\u0643": "ک", // ARABIC KAF → KEHEH
  "\u0629": "ه", // TEH MARBUTA → HEH
  "\u0649": "ی", // ALEF MAKSURA → FARSI YEH
  "\u06C0": "هٔ" // HEH WITH YEH ABOVE → HEH + hamza above (rare in copy)
});

export const GLOSSARY = Object.freeze([
  {
    id: "level",
    fa: "سطح",
    en: "Level",
    avoid: ["لایه"],
    note: {
      fa: "«لایه» فقط برای لایه‌های حکمرانی به کار می‌رود، نه برای پنج سطح شهروندی.",
      en: "«لایه» (layer) is reserved for the governance layers, not the five civic levels."
    }
  },
  {
    id: "ballot",
    fa: "برگهٔ رأی",
    en: "Ballot",
    avoid: ["برگ رأی", "برگه رأی", "برگه‌ی رأی", "رأی برگه"],
    note: {
      fa: "همیشه با همزه و کسرهٔ اضافه؛ «برگه رأی» با فاصلهٔ کامل نادرست است.",
      en: "Always written with the ezafe; a plain space is a misspelling."
    }
  },
  {
    id: "weighting-policy",
    fa: "سیاست وزن‌دهی",
    en: "Weighting policy",
    avoid: ["سیاست وزن دهی", "سیاست وزن"],
    note: {
      fa: "«سیاست» جمع‌بندی یک قاعدهٔ قابل تنظیم است؛ پیش از تصویب، پیش‌نویس خوانده می‌شود.",
      en: "A policy is a configurable rule set; before adoption it is labelled a draft."
    }
  },
  {
    id: "qualification",
    fa: "واجد آستانه",
    en: "Qualified",
    avoid: ["پذیرفته‌شده", "تأیید نهایی"],
    note: {
      fa: "عبور از آستانهٔ امتیاز، تصویب حقوقی نیست.",
      en: "Passing a scoring threshold is not legal adoption."
    }
  },
  {
    id: "endorsement",
    fa: "تأیید عمومی",
    en: "Public endorsement",
    avoid: ["امضا", "حمایت مردمی"],
    note: {
      fa: "تأیید عمومی با برگهٔ رأی یکی نیست و به آن تبدیل نمی‌شود.",
      en: "An endorsement is not a ballot and never becomes one."
    }
  },
  {
    id: "reach",
    fa: "دسترسی عمومی",
    en: "Public reach",
    avoid: ["نفوذ", "شهرت‌سنجی"],
    note: {
      fa: "دسترسی، اندازهٔ مخاطب است؛ نه وزن رأی.",
      en: "Reach measures audience, not voting weight."
    }
  },
  {
    id: "delegation",
    fa: "واگذاری اختیار",
    en: "Delegation",
    avoid: ["وکالت", "توکیل"],
    note: {
      fa: "واگذاری همیشه دامنه و تاریخ پایان دارد.",
      en: "A delegation always carries a scope and an expiry date."
    }
  },
  {
    id: "digital-estate",
    fa: "پروندهٔ هستی",
    en: "Digital estate",
    avoid: ["پرونده وجودی", "میراث دیجیتال"],
    note: {
      fa: "«میراث دیجیتال» نام ماژول است؛ دادهٔ خصوصی «پروندهٔ هستی» نام دارد.",
      en: "«میراث دیجیتال» is the module name; the private dataset is the digital estate."
    }
  },
  {
    id: "synthetic",
    fa: "ساختگی",
    en: "Synthetic",
    avoid: ["جعلی", "نمونه‌ای"],
    note: {
      fa: "«ساختگی» یعنی دادهٔ آزمون؛ «جعلی» اتهام است.",
      en: "Synthetic means test data; «fake» is an accusation."
    }
  },
  {
    id: "backing",
    fa: "پشتوانه",
    en: "Backing",
    avoid: ["ضمانت", "تضمین ارزش"],
    note: {
      fa: "پشتوانه دارایی‌ای است که توکن در برابر آن ساخته می‌شود؛ «ضمانت» یک تعهد حقوقی است و اینجا وجود ندارد.",
      en: "Backing is the asset a token is minted against; «ضمانت» would be a legal guarantee, which does not exist here."
    }
  },
  {
    id: "supply-ceiling",
    fa: "سقف عرضه",
    en: "Supply ceiling",
    avoid: ["حداکثر عرضه", "سقف کل"],
    note: {
      fa: "سقف عرضه از پشتوانهٔ خالص می‌آید و هدف رشد نیست.",
      en: "The ceiling follows from the net backing; it is not a growth target."
    }
  },
  {
    id: "mother-file",
    fa: "سند مادر",
    en: "Mother file",
    avoid: ["فایل مادر", "سند اصلی"],
    note: {
      fa: "«فن‌سالاری اصلاح‌شده» یک پیش‌نویس است؛ «سند اصلی» خواندنش یعنی ادعای تصویب.",
      en: "«Revised Technocracy» is a draft; calling it the «original» implies ratification."
    }
  },
  {
    id: "coverage",
    fa: "پوشش",
    en: "Coverage",
    avoid: ["کاوریج", "پوشش‌دهی"],
    note: {
      fa: "پوشش در این پروژه یعنی یک سطح کارکننده یا یک ردیف داده؛ نه انطباق حقوقی با سند.",
      en: "Coverage here means a working surface or an existing record, not legal compliance."
    }
  },
  {
    id: "personal-cap",
    fa: "سقف شخصی",
    en: "Personal cap",
    avoid: ["سقف فردی", "سقف هر شخص"],
    note: {
      fa: "از سطح شهروندی می‌آید، نه از هویت؛ سطح ۲ و ۳ سقف یکسانی دارند تا مشارکت سقف نگذرد.",
      en: "It comes from the civic level, not from identity; levels 2 and 3 share one cap so participation cannot buy headroom."
    }
  },
  {
    id: "level-cap",
    fa: "سقف هر سطح",
    en: "Per-level cap",
    avoid: ["سقف لایه", "سقف هر لایه"],
    note: {
      fa: "«لایه» برای لایه‌های حکمرانی است؛ سقف به سطح شهروندی می‌چسبد و فقط خرید را محدود می‌کند.",
      en: "«لایه» belongs to the governance layers; the cap attaches to the civic level and limits acquisition only."
    }
  },
  {
    id: "circulating-supply",
    fa: "عرضهٔ در گردش",
    en: "Circulating supply",
    avoid: ["عرضه در گردش", "عرضهٔ جاری"],
    note: {
      fa: "همیشه با همزه و کسرهٔ اضافه؛ فقط از واریز تسویه‌شده ساخته می‌شود.",
      en: "Always written with the ezafe; it exists only because settled toman was deposited."
    }
  },
  {
    id: "redemption",
    fa: "بازخرید",
    en: "Redemption",
    avoid: ["بازخریداری", "خرید مجدد"],
    note: {
      fa: "بازخرید در صف می‌نشیند و هرگز تعلیق نمی‌شود؛ توقف اضطراری فقط صدور تازه را می‌بندد.",
      en: "Redemption queues; it is never suspended. An emergency pause stops new issuance only."
    }
  },
  {
    id: "proof-of-reserve",
    fa: "اثبات ذخیره",
    en: "Proof of reserve",
    avoid: ["گواهی ذخیره", "اثبات پشتوانه"],
    note: {
      fa: "اثبات ذخیره فقط یک ریشهٔ هش منتشر می‌کند؛ هیچ دادهٔ هویتی روی زنجیره نوشته نمی‌شود.",
      en: "Proof of reserve publishes one hash root; no identity data is written on-chain."
    }
  },
  {
    id: "haircut-chain",
    fa: "زنجیرهٔ کسر",
    en: "Haircut chain",
    avoid: ["تخفیف ارزش"],
    note: {
      fa: "هر کسر ضریب و دلیل خودش را دارد و ترتیب آن‌ها ثابت است.",
      en: "Every haircut carries its own factor and reason, and the order is fixed."
    }
  },
  {
    id: "non-binding",
    fa: "غیرالزام‌آور",
    en: "Non-binding",
    avoid: ["غیر الزام آور", "بدون الزام"],
    note: {
      fa: "با نیم‌فاصله نوشته می‌شود.",
      en: "Written with the zero-width non-joiner."
    }
  }
]);

const hasLetters = (text) => /[\p{L}]/u.test(text);

/** Arabic letter variants that should be Persian. */
export function findArabicVariants(text) {
  const found = [];
  for (const [from, to] of Object.entries(ARABIC_VARIANTS)) {
    if (String(text).includes(from)) found.push({ from, to });
  }
  return found;
}

/** Glossary terms whose discouraged variant appears in the text. */
export function findGlossaryViolations(text, lang = "fa") {
  if (lang !== "fa") return [];
  const value = String(text ?? "");
  return GLOSSARY.filter((entry) => entry.avoid.some((variant) => value.includes(variant))).map((entry) => entry.id);
}

/**
 * Strings that are legitimately identical in both languages: identifiers,
 * acronyms, and units. Everything else must differ.
 */
const IDENTICAL_ALLOWED = /^[A-Z0-9._\-·\s/]+$/;

export function looksLikeIdentifier(text) {
  const value = String(text ?? "").trim();
  if (!value) return true;
  if (!hasLetters(value)) return true;
  return IDENTICAL_ALLOWED.test(value);
}

/** Flattens a locale object into `path → string` pairs. */
export function flattenStrings(value, prefix = "") {
  if (typeof value === "string") return [[prefix, value]];
  if (value === null || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, nested]) =>
    flattenStrings(nested, prefix ? `${prefix}.${key}` : key)
  );
}
