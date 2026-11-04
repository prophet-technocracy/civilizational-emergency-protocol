// Department D — Historical Intelligence & Archives
// Explicitly SYNTHETIC, deceased-only dossiers exercising the archival feature set.
// These archetypes correspond to no real person. No living-person data exists here.

export const archiveBoundary = Object.freeze({
  notice: {
    fa: "همهٔ پرونده‌های زیر ساختگی و خیالی‌اند و تنها برای آزمون ساختار بایگانی ایجاد شده‌اند. هیچ پروندهٔ فرد زنده پذیرفته نمی‌شود.",
    en: "Every dossier below is synthetic and fictional, created only to test archival structure. No living-person record is accepted."
  },
  rules: [
    {
      fa: "فقط پروندهٔ افراد فوت‌شده با منبع قابل ارجاع پذیرفته می‌شود.",
      en: "Only deceased persons with traceable sources are accepted."
    },
    {
      fa: "کد پایدار از نام استخراج نمی‌شود؛ شناسه‌ها تصادفی هستند.",
      en: "Stable codes are not derived from names; identifiers are random."
    },
    {
      fa: "انتشار پروندهٔ واقعی نیازمند دروازه‌های مجوز و بازبینی انسانی است.",
      en: "Publishing a real dossier requires licence and human review gates."
    }
  ],
  livingPersonRule: {
    fa: "ردیف با status غیر از «فوت‌شده» در اعتبارسنجی شکست می‌خورد.",
    en: "Any row whose status is not 'deceased' fails validation."
  }
});

export const archivePeriods = Object.freeze([
  { id: "classical", label: { fa: "دوران کلاسیک", en: "Classical Era" }, range: { fa: "سدۀ ۹ تا ۱۲ میلادی", en: "9th–12th century CE" } },
  { id: "medieval", label: { fa: "دوران میانه", en: "Medieval Era" }, range: { fa: "سدۀ ۱۳ تا ۱۷ میلادی", en: "13th–17th century CE" } },
  { id: "constitutional", label: { fa: "دوران مشروطه", en: "Constitutional Era" }, range: { fa: "۱۸۵۰ تا ۱۹۲۵ میلادی", en: "1850–1925 CE" } },
  { id: "modern-deceased", label: { fa: "دوران معاصر (فوت‌شدگان)", en: "Modern Era (deceased)" }, range: { fa: "۱۹۲۵ تا امروز", en: "1925 to present" } }
]);

export const archiveDisciplines = Object.freeze([
  { id: "mathematics", label: { fa: "ریاضیات و نجوم", en: "Mathematics & Astronomy" } },
  { id: "medicine", label: { fa: "پزشکی و بهداشت عمومی", en: "Medicine & Public Health" } },
  { id: "literature", label: { fa: "ادبیات و زبان", en: "Literature & Language" } },
  { id: "philosophy", label: { fa: "فلسفه و الهیات", en: "Philosophy & Theology" } },
  { id: "constitutionalism", label: { fa: "مشروطه‌خواهی و حقوق", en: "Constitutionalism & Law" } },
  { id: "engineering", label: { fa: "مهندسی و آب", en: "Engineering & Water" } },
  { id: "social-reform", label: { fa: "اصلاح اجتماعی و آموزش", en: "Social Reform & Education" } }
]);

export const archiveRegions = Object.freeze([
  { id: "khorasan", label: { fa: "خراسان", en: "Khorasan" } },
  { id: "central-plateau", label: { fa: "فلات مرکزی", en: "Central Plateau" } },
  { id: "azerbaijan", label: { fa: "آذربایجان", en: "Azerbaijan" } },
  { id: "fars", label: { fa: "فارس", en: "Fars" } },
  { id: "gilan-mazandaran", label: { fa: "گیلان و مازندران", en: "Gilan & Mazandaran" } }
]);

export const archiveDossiers = Object.freeze([
  {
    id: "SYN-HIST-001",
    personId: "SYNP-001",
    syntheticLabel: "SYNTHETIC FIXTURE — fictional archetype",
    name: { fa: "پروانهٔ کاشانی", en: "Parvaneh Kashani" },
    alternateNames: [
      { fa: "پروانه خانم کاشانی (صورت فرضی)", en: "Parvaneh Khanom Kashani (illustrative form)" },
      { fa: "پ. کاشانی", en: "P. Kashani" }
    ],
    status: "deceased",
    period: { id: "constitutional", label: { fa: "دوران مشروطه", en: "Constitutional Era" } },
    discipline: { id: "constitutionalism", label: { fa: "مشروطه‌خواهی و حقوق", en: "Constitutionalism & Law" } },
    secondaryDisciplines: [{ id: "social-reform", label: { fa: "اصلاح اجتماعی و آموزش", en: "Social Reform & Education" } }],
    region: { id: "central-plateau", label: { fa: "فلات مرکزی", en: "Central Plateau" } },
    birth: { display: { fa: "۱۲۴۷ خورشیدی / ۱۸۶۸ میلادی (تخمینی)", en: "1247 SH / 1868 CE (approximate)" }, place: { fa: "کاشان (فرضی)", en: "Kashan (illustrative)" }, precision: "year-approximate" },
    death: { display: { fa: "۱۳۰۳ خورشیدی / ۱۹۲۴ میلادی (تخمینی)", en: "1303 SH / 1924 CE (approximate)" }, place: { fa: "تهران (فرضی)", en: "Tehran (illustrative)" }, precision: "year-approximate" },
    occupations: [{ fa: "نویسندهٔ حقوقی", en: "Legal essayist" }, { fa: "بنیان‌گذار مدرسه (فرضی)", en: "School founder (illustrative)" }],
    biography: {
      fa: "شخصیتی کاملاً ساختگی که برای آزمون بایگانی ساخته شده است. در این روایت خیالی، او رساله‌ای دربارهٔ تفکیک قوا و آیین‌نامهٔ انجمن‌های محلی نوشت و مدرسه‌ای فرضی بنیان گذاشت. هیچ‌یک از این جزئیات به فرد واقعی اشاره ندارد.",
      en: "An entirely fabricated figure created to test the archive. In this fictional narrative, she wrote a treatise on separation of powers and regulations for local associations, and founded an illustrative school. None of these details refer to a real person."
    },
    majorWorks: [
      { id: "SYNW-001", title: { fa: "رسالهٔ تفکیک قوا و انجمن‌های ایالتی (ساختگی)", en: "Treatise on Separation of Powers and Provincial Associations (synthetic)" }, year: "1907 (illustrative)", authenticity: "synthetic" },
      { id: "SYNW-002", title: { fa: "رسالهٔ قوانین بلدیه (فرضی)", en: "Treatise on Municipal Law (illustrative)" }, year: "1909 (illustrative)", authenticity: "synthetic" },
      { id: "SYNW-003", title: { fa: "دفتر آموزش همگانی (فرضی)", en: "Notebook on Public Education (illustrative)" }, year: "1915 (illustrative)", authenticity: "synthetic" }
    ],
    importantEvents: [
      { id: "SYNE-001", year: "1907 (illustrative)", event: { fa: "نگارش رسالهٔ فرضی دربارهٔ تفکیک قوا.", en: "Writing the illustrative treatise on separation of powers." }, epistemicStatus: "synthetic-fixture" },
      { id: "SYNE-002", year: "1911 (illustrative)", event: { fa: "تأسیس مدرسهٔ فرضی دخترانه در کاشان.", en: "Founding an illustrative girls' school in Kashan." }, epistemicStatus: "synthetic-fixture" }
    ],
    relationships: [
      { id: "SYNREL-001", type: "teacher", targetName: { fa: "استاد فرضی الف", en: "Illustrative Mentor A" }, note: { fa: "رابطهٔ ساختگی برای آزمون نمودار.", en: "Synthetic relation for graph testing." } },
      { id: "SYNREL-002", type: "student", targetName: { fa: "شاگرد فرضی ب", en: "Illustrative Student B" }, note: { fa: "رابطهٔ ساختگی.", en: "Synthetic relation." } },
      { id: "SYNREL-003", type: "institutional-affiliation", targetName: { fa: "انجمن فرضی مطالعات مشروطه", en: "Illustrative Constitutional Studies Association" }, note: { fa: "نهاد ساختگی.", en: "Synthetic institution." } }
    ],
    citations: [
      { id: "SYNCIT-001", sourceId: "SYNSRC-101", sourceTitle: { fa: "گردآوردهٔ ساختگی مطالعات مشروطه", en: "Illustrative Compendium of Constitutional Studies" }, pageOrSection: "ص. ۴۲ / p. 42", sourceType: "synthetic-secondary", reliability: "synthetic-only", note: { fa: "منبع ساختگی برای آزمون فهرست استناد.", en: "Synthetic source used to test the citation list." } },
      { id: "SYNCIT-002", sourceId: "SYNSRC-104", sourceTitle: { fa: "فهرست فرضی مطبوعات دورهٔ مشروطه", en: "Illustrative Register of Constitutional-Era Press" }, pageOrSection: "سطر ۱۲ / entry 12", sourceType: "synthetic-index", reliability: "synthetic-only", note: { fa: "فقط برای آزمون نمایش نسخه.", en: "Only to test version display." } }
    ],
    sourceReliability: { level: "synthetic-only", rationale: { fa: "همهٔ منابع ساختگی‌اند؛ هیچ ارزش تاریخی واقعی ندارند.", en: "All sources are synthetic; they carry no real historical value." } },
    conflictingAccounts: [
      {
        id: "SYNCON-001",
        topic: { fa: "تاریخ نگارش رسالهٔ دوم", en: "Date of the second treatise" },
        accountA: { claim: { fa: "منبع ساختگی الف: ۱۹۰۷.", en: "Synthetic source A: 1907." }, sourceId: "SYNSRC-101" },
        accountB: { claim: { fa: "منبع ساختگی ب: ۱۹۰۹.", en: "Synthetic source B: 1909." }, sourceId: "SYNSRC-104" },
        status: "unresolved-in-fixture",
        note: { fa: "تناقض عمدی برای آزمون ابزار مقایسه.", en: "Deliberate contradiction to test the comparison tool." }
      }
    ],
    editorialReview: { status: "synthetic-demo", lastReviewDate: "2026-01-25", reviewerRole: { fa: "ویرایشگر بایگانی (نقش نمایشی)", en: "Archive editor (illustrative role)" } },
    revisionHistory: [
      { version: "v1", date: "2026-01-10", change: { fa: "ایجاد پروندهٔ ساختگی.", en: "Created the synthetic dossier." }, author: { fa: "بخش بایگانی", en: "Archives department" } },
      { version: "v2", date: "2026-01-25", change: { fa: "افزودن تناقض عمدی و فهرست استناد.", en: "Added the deliberate contradiction and citation list." }, author: { fa: "ویرایشگر بایگانی", en: "Archive editor" } }
    ],
    flags: [
      { id: "SYNFLAG-001", type: "missing-information", note: { fa: "جزئیات آموزش اولیه در منابع ساختگی موجود نیست.", en: "Early education details are absent from synthetic sources." }, raisedBy: "system-audit", status: "open" },
      { id: "SYNFLAG-002", type: "contradictory-information", note: { fa: "اختلاف تاریخ در دو منبع ساختگی ثبت شده است.", en: "A date conflict between two synthetic sources is recorded." }, raisedBy: "system-audit", status: "open" }
    ],
    tags: ["synthetic", "constitutionalism", "education", "women"],
    epistemicStatus: "synthetic-fixture",
    linkedClaim: "CLM-014"
  },
  {
    id: "SYN-HIST-002",
    personId: "SYNP-002",
    syntheticLabel: "SYNTHETIC FIXTURE — fictional archetype",
    name: { fa: "ابوالفضل نیشابوری", en: "Abu al-Fadl Nishaburi" },
    alternateNames: [
      { fa: "ابوالفضل محمد نیشابوری (صورت فرضی)", en: "Abu al-Fadl Muhammad Nishaburi (illustrative form)" }
    ],
    status: "deceased",
    period: { id: "medieval", label: { fa: "دوران میانه", en: "Medieval Era" } },
    discipline: { id: "mathematics", label: { fa: "ریاضیات و نجوم", en: "Mathematics & Astronomy" } },
    secondaryDisciplines: [{ id: "philosophy", label: { fa: "فلسفه و الهیات", en: "Philosophy & Theology" } }],
    region: { id: "khorasan", label: { fa: "خراسان", en: "Khorasan" } },
    birth: { display: { fa: "۴۲۱ خورشیدی / ۱۰۴۲ میلادی (تخمینی)", en: "421 SH / 1042 CE (approximate)" }, place: { fa: "نیشابور (فرضی)", en: "Nishapur (illustrative)" }, precision: "decade-approximate" },
    death: { display: { fa: "۴۹۴ خورشیدی / ۱۱۱۵ میلادی (تخمینی)", en: "494 SH / 1115 CE (approximate)" }, place: { fa: "مرو (فرضی)", en: "Merv (illustrative)" }, precision: "decade-approximate" },
    occupations: [{ fa: "منجم", en: "Astronomer" }, { fa: "هندسه‌دان", en: "Geometer" }],
    biography: {
      fa: "شخصیتی کاملاً ساختگی. در این روایت خیالی او در رصدخانه‌ای فرضی کار می‌کرد و جدول‌های مثلثاتی تدوین کرد. هیچ بخشی از این روایت مستند به فرد واقعی نیست.",
      en: "An entirely fabricated figure. In this fictional narrative he worked at an illustrative observatory and compiled trigonometric tables. No part of this narrative documents a real person."
    },
    majorWorks: [
      { id: "SYNW-004", title: { fa: "زیج نیشابوری (فرضی)", en: "Nishapur Zij (illustrative)" }, year: "1090 (illustrative)", authenticity: "synthetic" },
      { id: "SYNW-005", title: { fa: "رسالهٔ مقاطع مخروطی (ساختگی)", en: "Treatise on Conic Sections (synthetic)" }, year: "1085 (illustrative)", authenticity: "synthetic" }
    ],
    importantEvents: [
      { id: "SYNE-003", year: "1080 (illustrative)", event: { fa: "پیوستن به رصدخانهٔ فرضی.", en: "Joining an illustrative observatory." }, epistemicStatus: "synthetic-fixture" }
    ],
    relationships: [
      { id: "SYNREL-004", type: "teacher", targetName: { fa: "استاد فرضی ج", en: "Illustrative Mentor C" }, note: { fa: "رابطهٔ ساختگی.", en: "Synthetic relation." } },
      { id: "SYNREL-005", type: "student", targetName: { fa: "شاگرد فرضی د", en: "Illustrative Student D" }, note: { fa: "رابطهٔ ساختگی.", en: "Synthetic relation." } }
    ],
    citations: [
      { id: "SYNCIT-003", sourceId: "SYNSRC-102", sourceTitle: { fa: "تاریخ فرضی رصدخانه‌های خراسان", en: "Illustrative History of Khorasan Observatories" }, pageOrSection: "ج. ۲، ص. ۷۷ / vol. 2, p. 77", sourceType: "synthetic-secondary", reliability: "synthetic-only", note: { fa: "منبع ساختگی.", en: "Synthetic source." } }
    ],
    sourceReliability: { level: "synthetic-only", rationale: { fa: "منبع کاملاً ساختگی.", en: "Source is entirely synthetic." } },
    conflictingAccounts: [
      {
        id: "SYNCON-002",
        topic: { fa: "نسبت فصل چهارم زیج", en: "Attribution of the Zij's fourth chapter" },
        accountA: { claim: { fa: "منبع ساختگی الف: نگارش خود او.", en: "Synthetic source A: his own authorship." }, sourceId: "SYNSRC-102" },
        accountB: { claim: { fa: "منبع ساختگی ب: نگارش شاگردی در مرو.", en: "Synthetic source B: written by a student in Merv." }, sourceId: "SYNSRC-105" },
        status: "unresolved-in-fixture",
        note: { fa: "برای آزمون «انتساب مورد اختلاف».", en: "Tests the 'disputed attribution' feature." }
      }
    ],
    editorialReview: { status: "synthetic-demo", lastReviewDate: "2026-01-25", reviewerRole: { fa: "ویرایشگر بایگانی (نقش نمایشی)", en: "Archive editor (illustrative role)" } },
    revisionHistory: [
      { version: "v1", date: "2026-01-10", change: { fa: "ایجاد پروندهٔ ساختگی.", en: "Created the synthetic dossier." }, author: { fa: "بخش بایگانی", en: "Archives department" } }
    ],
    flags: [
      { id: "SYNFLAG-003", type: "missing-information", note: { fa: "فهرست کامل آثار در منابع ساختگی نیامده است.", en: "A complete work list is absent from the synthetic sources." }, raisedBy: "system-audit", status: "open" }
    ],
    tags: ["synthetic", "mathematics", "astronomy", "khorasan"],
    epistemicStatus: "synthetic-fixture",
    linkedClaim: "CLM-014"
  },
  {
    id: "SYN-HIST-003",
    personId: "SYNP-003",
    syntheticLabel: "SYNTHETIC FIXTURE — fictional archetype",
    name: { fa: "سهراب تبریزی", en: "Sohrab Tabrizi" },
    alternateNames: [{ fa: "دکتر س. تبریزی (صورت فرضی)", en: "Dr. S. Tabrizi (illustrative form)" }],
    status: "deceased",
    period: { id: "modern-deceased", label: { fa: "دوران معاصر (فوت‌شدگان)", en: "Modern Era (deceased)" } },
    discipline: { id: "medicine", label: { fa: "پزشکی و بهداشت عمومی", en: "Medicine & Public Health" } },
    secondaryDisciplines: [{ id: "engineering", label: { fa: "مهندسی و آب", en: "Engineering & Water" } }],
    region: { id: "azerbaijan", label: { fa: "آذربایجان", en: "Azerbaijan" } },
    birth: { display: { fa: "۱۲۷۴ خورشیدی / ۱۸۹۵ میلادی", en: "1274 SH / 1895 CE" }, place: { fa: "تبریز (فرضی)", en: "Tabriz (illustrative)" }, precision: "exact-year" },
    death: { display: { fa: "۱۳۴۸ خورشیدی / ۱۹۶۹ میلادی", en: "1348 SH / 1969 CE" }, place: { fa: "شیراز (فرضی)", en: "Shiraz (illustrative)" }, precision: "exact-year" },
    occupations: [{ fa: "پزشک", en: "Physician" }, { fa: "طراح بهداشت روستایی", en: "Rural health planner" }],
    biography: {
      fa: "شخصیتی کاملاً ساختگی. در این روایت خیالی او شبکه‌ای برای بهداشت آب و ثبت علل مرگ‌ومیر طراحی کرد. هیچ ارتباطی با فرد واقعی ندارد.",
      en: "An entirely fabricated figure. In this fictional narrative he designed a water-sanitation and mortality-registration network. It corresponds to no real person."
    },
    majorWorks: [
      { id: "SYNW-006", title: { fa: "راهنمای بهداری روستایی (فرضی)", en: "Rural Health Handbook (illustrative)" }, year: "1946 (illustrative)", authenticity: "synthetic" },
      { id: "SYNW-007", title: { fa: "گزارش بهسازی آب آشامیدنی (فرضی)", en: "Drinking-Water Improvement Report (illustrative)" }, year: "1951 (illustrative)", authenticity: "synthetic" }
    ],
    importantEvents: [
      { id: "SYNE-004", year: "1946 (illustrative)", event: { fa: "انتشار راهنمای فرضی بهداری روستایی.", en: "Publication of the illustrative rural health handbook." }, epistemicStatus: "synthetic-fixture" }
    ],
    relationships: [
      { id: "SYNREL-006", type: "teacher", targetName: { fa: "استاد فرضی ه", en: "Illustrative Mentor E" }, note: { fa: "رابطهٔ ساختگی.", en: "Synthetic relation." } },
      { id: "SYNREL-007", type: "institutional-affiliation", targetName: { fa: "بیمارستان آموزشی فرضی تبریز", en: "Illustrative Teaching Hospital of Tabriz" }, note: { fa: "نهاد ساختگی.", en: "Synthetic institution." } }
    ],
    citations: [
      { id: "SYNCIT-004", sourceId: "SYNSRC-103", sourceTitle: { fa: "بایگانی ساختگی تاریخ بهداشت عمومی", en: "Synthetic Archive of Public Health History" }, pageOrSection: "ص. ۱۱۸ / p. 118", sourceType: "synthetic-secondary", reliability: "synthetic-only", note: { fa: "منبع ساختگی.", en: "Synthetic source." } },
      { id: "SYNCIT-005", sourceId: "SYNSRC-106", sourceTitle: { fa: "گزارش فرضی سلامت استان فارس", en: "Illustrative Fars Province Health Report" }, pageOrSection: "جدول ۳ / table 3", sourceType: "synthetic-report", reliability: "synthetic-only", note: { fa: "منبع ساختگی.", en: "Synthetic source." } }
    ],
    sourceReliability: { level: "synthetic-only", rationale: { fa: "همهٔ منابع ساختگی‌اند.", en: "All sources are synthetic." } },
    conflictingAccounts: [
      {
        id: "SYNCON-003",
        topic: { fa: "دامنهٔ اجرای طرح بهداشت ۱۹۴۶", en: "Reach of the 1946 sanitation plan" },
        accountA: { claim: { fa: "منبع ساختگی الف: ۱۲ روستا.", en: "Synthetic source A: 12 villages." }, sourceId: "SYNSRC-103" },
        accountB: { claim: { fa: "منبع ساختگی ب: ۱۸ روستا.", en: "Synthetic source B: 18 villages." }, sourceId: "SYNSRC-106" },
        status: "unresolved-in-fixture",
        note: { fa: "اختلاف عددی عمدی برای آزمون مقایسه.", en: "A deliberate numeric discrepancy to test comparison." }
      }
    ],
    editorialReview: { status: "synthetic-demo", lastReviewDate: "2026-01-25", reviewerRole: { fa: "ویرایشگر بایگانی (نقش نمایشی)", en: "Archive editor (illustrative role)" } },
    revisionHistory: [
      { version: "v1", date: "2026-01-10", change: { fa: "ایجاد پروندهٔ ساختگی.", en: "Created the synthetic dossier." }, author: { fa: "بخش بایگانی", en: "Archives department" } },
      { version: "v2", date: "2026-01-25", change: { fa: "افزودن استناد دوم.", en: "Added a second citation." }, author: { fa: "ویرایشگر بایگانی", en: "Archive editor" } }
    ],
    flags: [
      { id: "SYNFLAG-004", type: "contradictory-information", note: { fa: "اختلاف در شمار روستاهای تحت پوشش.", en: "Disagreement on the number of covered villages." }, raisedBy: "system-audit", status: "open" }
    ],
    tags: ["synthetic", "medicine", "public-health", "water"],
    epistemicStatus: "synthetic-fixture",
    linkedClaim: "CLM-014"
  },
  {
    id: "SYN-HIST-004",
    personId: "SYNP-004",
    syntheticLabel: "SYNTHETIC FIXTURE — fictional archetype",
    name: { fa: "مریم گیلانی", en: "Maryam Gilani" },
    alternateNames: [{ fa: "مریم خانم گیلانی (صورت فرضی)", en: "Maryam Khanom Gilani (illustrative form)" }],
    status: "deceased",
    period: { id: "constitutional", label: { fa: "دوران مشروطه", en: "Constitutional Era" } },
    discipline: { id: "literature", label: { fa: "ادبیات و زبان", en: "Literature & Language" } },
    secondaryDisciplines: [{ id: "social-reform", label: { fa: "اصلاح اجتماعی و آموزش", en: "Social Reform & Education" } }],
    region: { id: "gilan-mazandaran", label: { fa: "گیلان و مازندران", en: "Gilan & Mazandaran" } },
    birth: { display: { fa: "۱۲۵۹ خورشیدی / ۱۸۸۰ میلادی (تخمینی)", en: "1259 SH / 1880 CE (approximate)" }, place: { fa: "رشت (فرضی)", en: "Rasht (illustrative)" }, precision: "year-approximate" },
    death: { display: { fa: "۱۳۲۰ خورشیدی / ۱۹۴۱ میلادی (تخمینی)", en: "1320 SH / 1941 CE (approximate)" }, place: { fa: "تهران (فرضی)", en: "Tehran (illustrative)" }, precision: "year-approximate" },
    occupations: [{ fa: "شاعر", en: "Poet" }, { fa: "روزنامه‌نگار (فرضی)", en: "Journalist (illustrative)" }],
    biography: {
      fa: "شخصیتی کاملاً ساختگی برای آزمون دستهٔ ادبیات و فیلتر منطقهٔ گیلان. هیچ اثر یا زندگی واقعی در این پرونده توصیف نمی‌شود.",
      en: "An entirely fabricated figure used to test the literature category and the Gilan region filter. No real work or life is described."
    },
    majorWorks: [
      { id: "SYNW-008", title: { fa: "دفتر شعر فرضی «نسیم شمالی»", en: "Illustrative Poetry Collection 'Northern Breeze'" }, year: "1918 (illustrative)", authenticity: "synthetic" }
    ],
    importantEvents: [
      { id: "SYNE-005", year: "1918 (illustrative)", event: { fa: "انتشار مجموعهٔ فرضی شعر.", en: "Publication of the illustrative poetry collection." }, epistemicStatus: "synthetic-fixture" }
    ],
    relationships: [
      { id: "SYNREL-008", type: "colleague", targetName: { fa: "نویسندهٔ فرضی و", en: "Illustrative Writer W" }, note: { fa: "رابطهٔ ساختگی.", en: "Synthetic relation." } }
    ],
    citations: [
      { id: "SYNCIT-006", sourceId: "SYNSRC-104", sourceTitle: { fa: "فهرست فرضی مطبوعات دورهٔ مشروطه", en: "Illustrative Register of Constitutional-Era Press" }, pageOrSection: "سطر ۳۱ / entry 31", sourceType: "synthetic-index", reliability: "synthetic-only", note: { fa: "منبع ساختگی.", en: "Synthetic source." } }
    ],
    sourceReliability: { level: "synthetic-only", rationale: { fa: "منبع ساختگی.", en: "Synthetic source." } },
    conflictingAccounts: [],
    editorialReview: { status: "synthetic-demo", lastReviewDate: "2026-01-25", reviewerRole: { fa: "ویرایشگر بایگانی (نقش نمایشی)", en: "Archive editor (illustrative role)" } },
    revisionHistory: [
      { version: "v1", date: "2026-01-10", change: { fa: "ایجاد پروندهٔ ساختگی.", en: "Created the synthetic dossier." }, author: { fa: "بخش بایگانی", en: "Archives department" } }
    ],
    flags: [
      { id: "SYNFLAG-005", type: "missing-information", note: { fa: "هیچ استناد اولیهٔ ساختگی برای آثار موجود نیست.", en: "No synthetic primary citation exists for the works." }, raisedBy: "system-audit", status: "open" }
    ],
    tags: ["synthetic", "literature", "gilan", "poetry"],
    epistemicStatus: "synthetic-fixture",
    linkedClaim: "CLM-014"
  }
]);

export const archiveSyntheticSources = Object.freeze([
  { id: "SYNSRC-101", title: { fa: "گردآوردهٔ ساختگی مطالعات مشروطه", en: "Illustrative Compendium of Constitutional Studies" }, type: "synthetic-secondary", edition: "fixture-edition", reliability: "none-real" },
  { id: "SYNSRC-102", title: { fa: "تاریخ فرضی رصدخانه‌های خراسان", en: "Illustrative History of Khorasan Observatories" }, type: "synthetic-secondary", edition: "fixture-edition", reliability: "none-real" },
  { id: "SYNSRC-103", title: { fa: "بایگانی ساختگی تاریخ بهداشت عمومی", en: "Synthetic Archive of Public Health History" }, type: "synthetic-secondary", edition: "fixture-edition", reliability: "none-real" },
  { id: "SYNSRC-104", title: { fa: "فهرست فرضی مطبوعات دورهٔ مشروطه", en: "Illustrative Register of Constitutional-Era Press" }, type: "synthetic-index", edition: "fixture-edition", reliability: "none-real" },
  { id: "SYNSRC-105", title: { fa: "یادداشت ساختگی حاشیهٔ نسخهٔ خطی", en: "Synthetic Manuscript Marginal Note" }, type: "synthetic-primary", edition: "fixture-edition", reliability: "none-real" },
  { id: "SYNSRC-106", title: { fa: "گزارش فرضی سلامت استان فارس", en: "Illustrative Fars Province Health Report" }, type: "synthetic-report", edition: "fixture-edition", reliability: "none-real" }
]);

export const editorialWorkflow = Object.freeze({
  stages: [
    { id: "WF-1", label: { fa: "پیش‌نویس ساختگی", en: "Synthetic draft" }, description: { fa: "پروندهٔ نمونه بدون ادعای واقعی بودن.", en: "A sample dossier with no claim to reality." }, allowedNext: ["WF-2"] },
    { id: "WF-2", label: { fa: "بازبینی منبع", en: "Source review" }, description: { fa: "بررسی حضور استناد برای هر ادعای اصلی.", en: "Check that every main claim has a citation." }, allowedNext: ["WF-3", "WF-4"] },
    { id: "WF-3", label: { fa: "در انتظار بازبینی انسانی", en: "Pending human review" }, description: { fa: "نیازمند بازبین انسانی دو‌زبانه.", en: "Requires a bilingual human reviewer." }, allowedNext: ["WF-5"] },
    { id: "WF-4", label: { fa: "علامت‌گذاری نقص اطلاعات", en: "Flagged for missing information" }, description: { fa: "پرونده با برچسب کمبود داده باز می‌ماند.", en: "Dossier stays open with a missing-data label." }, allowedNext: ["WF-2"] },
    { id: "WF-5", label: { fa: "آمادهٔ انتشار (پس از دروازه‌ها)", en: "Ready for publication (after gates)" }, description: { fa: "فقط پس از مجوز بازنشر و تأیید انسانی.", en: "Only after republication rights and human sign-off." }, allowedNext: [] }
  ],
  currentStage: "WF-1",
  notice: {
    fa: "هیچ پروندهٔ واقعی از مرحلهٔ ۱ عبور نکرده است؛ همهٔ پرونده‌های نمایشی در همان مرحلهٔ ساختگی باقی می‌مانند.",
    en: "No real dossier has passed stage 1; all demonstrator dossiers remain at the synthetic stage."
  }
});
