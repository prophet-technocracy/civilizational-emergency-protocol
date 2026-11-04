// Department F — Data Science & Evidence Office
// Source Registry + Claim Registry + Unresolved Questions.
// All records are synthetic fixtures authored for this prototype.

export const sourceDocuments = Object.freeze([
  Object.freeze({
    id: "SRC-001",
    title: {
      fa: "پروتکل اضطرار تمدنی — پیش‌نویس منشور بنیان‌گذار",
      en: "Civilizational Emergency Protocol — Founding Charter Draft"
    },
    authorOrIssuer: { fa: "کوشش داوطلبانهٔ جامعهٔ CEP", en: "CEP volunteer drafting circle" },
    publicationDate: "2025-11-01",
    version: "v1.0-draft",
    classification: "primary-proposal",
    language: "fa, en",
    pageCount: 12,
    licenseStatus: "repository-public",
    reuseDecision: "publishable-full-text",
    verificationStatus: "source-verified",
    limitations: {
      fa: "این سند پیش‌نویس یک تلاش مدنی است و هیچ مصوبه، رأی یا تأیید عمومی برای آن ثبت نشده است.",
      en: "This is a volunteer civil-society draft. No public vote, quorum, or ratification is recorded."
    },
    custodyNote: {
      fa: "نگهداری در مخزن عمومی CEP با تاریخچهٔ کامل تغییرات.",
      en: "Held in the public CEP repository with full revision history."
    },
    usedByClaims: ["CLM-001", "CLM-002", "CLM-010"]
  }),
  Object.freeze({
    id: "SRC-002",
    title: {
      fa: "طراحی تأیید هویت و کنترل دسترسی پنج‌سطحی",
      en: "Verification and Access Assurance Design (Five Bands)"
    },
    authorOrIssuer: { fa: "کارگروه امنیت و حقوق CEP", en: "CEP security & rights working group" },
    publicationDate: "2025-11-20",
    version: "v0.4-draft",
    classification: "internal-design",
    language: "fa, en",
    pageCount: 9,
    licenseStatus: "repository-public",
    reuseDecision: "publishable-full-text",
    verificationStatus: "source-verified",
    limitations: {
      fa: "طراحی فنی است؛ هیچ سازوکار تأییدشدهٔ عملیاتی یا آزمون میدانی برای آن انجام نشده.",
      en: "A design document only; no operational verification system or field test exists."
    },
    custodyNote: {
      fa: "مخزن CEP، مسیر docs/iran/.",
      en: "CEP repository under docs/iran/."
    },
    usedByClaims: ["CLM-003", "CLM-004", "CLM-011"]
  }),
  Object.freeze({
    id: "SRC-003",
    title: {
      fa: "طرح راهنمای خدمات عمومی ایران",
      en: "Iran Public Service Directory Plan"
    },
    authorOrIssuer: { fa: "کارگروه گذار ایران", en: "Iran transition working group" },
    publicationDate: "2025-11-28",
    version: "v0.3-draft",
    classification: "internal-plan",
    language: "fa, en",
    pageCount: 6,
    licenseStatus: "repository-public",
    reuseDecision: "publishable-full-text",
    verificationStatus: "source-verified",
    limitations: {
      fa: "هیچ درگاه دولتی مورد کاوش زنده قرار نگرفته و هیچ API خصوصی مستند نشده است.",
      en: "No government portal was probed live and no private API was documented."
    },
    custodyNote: {
      fa: "مخزن CEP، مسیر docs/iran/.",
      en: "CEP repository under docs/iran/."
    },
    usedByClaims: ["CLM-005", "CLM-012"]
  }),
  Object.freeze({
    id: "SRC-004",
    title: {
      fa: "گزارش کشف و اجرا: بازبینی منابع و مجموعه‌داده‌ها",
      en: "Discovery and Execution Report: Source & Dataset Audit"
    },
    authorOrIssuer: { fa: "کمیتهٔ پژوهش CEP", en: "CEP research committee" },
    publicationDate: "2025-12-04",
    version: "v1.1",
    classification: "internal-audit",
    language: "fa",
    pageCount: 18,
    licenseStatus: "repository-public",
    reuseDecision: "publishable-summary-only",
    verificationStatus: "source-verified",
    limitations: {
      fa: "خلاصهٔ بازبینی داخلی است؛ فایل‌های CSV و PDF اصلی مجوز انتشار در این مخزن را ندارند.",
      en: "An internal audit summary; the underlying CSVs and PDFs are not licensed for this repository."
    },
    custodyNote: {
      fa: "مخزن CEP، مسیر docs/iran/.",
      en: "CEP repository under docs/iran/."
    },
    usedByClaims: ["CLM-006", "CLM-007", "CLM-013"]
  }),
  Object.freeze({
    id: "SRC-005",
    title: {
      fa: "مجموعهٔ آزمون ساختگی بایگانی تاریخی (۷۷ ستون)",
      en: "Synthetic Historical Archive Fixture Set (77-column)"
    },
    authorOrIssuer: { fa: "بخش تاریخ و بایگانی CEP", en: "CEP historical & archives department" },
    publicationDate: "2026-01-10",
    version: "fixture-v1",
    classification: "synthetic-fixture",
    language: "fa, en",
    pageCount: 3,
    licenseStatus: "repository-public",
    reuseDecision: "publishable-full-text",
    verificationStatus: "synthetic-fixture",
    limitations: {
      fa: "تمامی پرونده‌ها خیالی و ساختگی‌اند و هیچ ارتباطی با افراد واقعی ندارند.",
      en: "All dossiers are fictional and have no correspondence to any real person."
    },
    custodyNote: {
      fa: "ذخیره در data/synthetic/ با برچسب صریح ساختگی.",
      en: "Stored in data/synthetic/ with an explicit synthetic label."
    },
    usedByClaims: ["CLM-008", "CLM-014"]
  }),
  Object.freeze({
    id: "SRC-006",
    title: {
      fa: "یادداشت پژوهشی: اصل ۲۰ و پروندهٔ هستی",
      en: "Research Note: Principle 20 and the Existence Dossier Concept"
    },
    authorOrIssuer: { fa: "کمیتهٔ پژوهش CEP", en: "CEP research committee" },
    publicationDate: "2026-01-22",
    version: "v0.2-draft",
    classification: "research-note",
    language: "fa, en",
    pageCount: 7,
    licenseStatus: "repository-public",
    reuseDecision: "publishable-full-text",
    verificationStatus: "source-reported",
    limitations: {
      fa: "مفهومی و اکتشافی است؛ هیچ پیاده‌سازی فنی، تولید صدا یا شبیه‌سازی شخص تأیید نشده است.",
      en: "Conceptual and exploratory; no technical implementation, voice synthesis, or person simulation is approved."
    },
    custodyNote: { fa: "مخزن CEP.", en: "CEP repository." },
    usedByClaims: ["CLM-009", "CLM-015"]
  }),
  Object.freeze({
    id: "SRC-007",
    title: {
      fa: "مجموعهٔ رسمی قوانین و مقررات خدمات عمومی (ارجاع نمونه)",
      en: "Official Public Service Regulations Compendium (sample reference)"
    },
    authorOrIssuer: { fa: "ناشر عمومی (ارجاع نمونه، تأیید نشده)", en: "Public publisher (sample reference, unverified)" },
    publicationDate: "2024-06-15",
    version: "unverified-edition",
    classification: "external-reference",
    language: "fa",
    pageCount: null,
    licenseStatus: "unverified",
    reuseDecision: "cite-index-only-no-republication",
    verificationStatus: "unverified",
    limitations: {
      fa: "هویت ناشر، ویرایش و حقوق بازنشر تأیید نشده است؛ تنها به‌عنوان فهرست ارجاع استفاده می‌شود.",
      en: "Publisher identity, edition, and republication rights are unverified; index citation only."
    },
    custodyNote: {
      fa: "هیچ نسخه‌ای در مخزن نگهداری نمی‌شود.",
      en: "No copy is retained in the repository."
    },
    usedByClaims: ["CLM-016"]
  })
]);

export const evidenceClaims = Object.freeze([
  Object.freeze({
    id: "CLM-001",
    claim: {
      fa: "CEP در سند منشور، خود را مجموعه‌ای مدنی و نه یک دولت یا مرجع انتخاباتی معرفی می‌کند.",
      en: "CEP describes itself in its charter as a civic effort, not a government or electoral authority."
    },
    classification: "fact",
    sourceDocumentId: "SRC-001",
    sourceVersion: "v1.0-draft",
    pageOrSection: "§1.2 Non-Authority Clause",
    publicationDate: "2025-11-01",
    verificationStatus: "source-verified",
    reviewerStatus: "editorial-reviewed",
    confidence: { fa: "بالا — متن اصلی در دسترس و واژه‌ها صریح است.", en: "High — primary text is available and explicit." },
    knownContradictions: [],
    lastReviewed: "2026-01-15",
    revisionHistory: [
      { version: "v1", date: "2025-11-01", change: { fa: "ثبت اولیه", en: "Initial entry" } },
      { version: "v2", date: "2026-01-15", change: { fa: "افزودن ارجاع دقیق به بند", en: "Added precise clause citation" } }
    ],
    linkedModules: ["governance", "dashboard"]
  }),
  Object.freeze({
    id: "CLM-002",
    claim: {
      fa: "اصل ۲۰ مربوط به حق انسان بر پروندهٔ هستی خویش است و به هیچ رأی، رتبه یا نمرهٔ اجتماعی وابسته نیست.",
      en: "Principle 20 concerns a person's right over their own existence dossier and depends on no vote, rank, or social score."
    },
    classification: "author-statement",
    sourceDocumentId: "SRC-001",
    sourceVersion: "v1.0-draft",
    pageOrSection: "§Principle 20",
    publicationDate: "2025-11-01",
    verificationStatus: "source-verified",
    reviewerStatus: "editorial-reviewed",
    confidence: { fa: "بالا — متن اصل در منشور نقل شده است.", en: "High — principle text quoted in the charter." },
    knownContradictions: [],
    lastReviewed: "2026-01-15",
    revisionHistory: [{ version: "v1", date: "2025-11-01", change: { fa: "ثبت اولیه", en: "Initial entry" } }],
    linkedModules: ["digital-legacy", "governance"]
  }),
  Object.freeze({
    id: "CLM-003",
    claim: {
      fa: "سطوح پنج‌گانه، مجوز «کنش» می‌دهند و هیچ رتبهٔ کلی برای «شخص» تعریف نمی‌کنند.",
      en: "The five bands authorize actions, and define no global ranking of persons."
    },
    classification: "design-statement",
    sourceDocumentId: "SRC-002",
    sourceVersion: "v0.4-draft",
    pageOrSection: "§2 Band Model",
    publicationDate: "2025-11-20",
    verificationStatus: "source-verified",
    reviewerStatus: "editorial-reviewed",
    confidence: { fa: "بالا — طراحی صریحاً کنش‌محور است.", en: "High — design is explicitly action-scoped." },
    knownContradictions: [],
    lastReviewed: "2026-01-18",
    revisionHistory: [{ version: "v1", date: "2025-11-20", change: { fa: "ثبت اولیه", en: "Initial entry" } }],
    linkedModules: ["verification"]
  }),
  Object.freeze({
    id: "CLM-004",
    claim: {
      fa: "مالکیت حساب تلگرام به‌عنوان مدرک تابعیت یا یکتایی شخص پذیرفته نمی‌شود.",
      en: "Telegram account control is not accepted as proof of citizenship or unique personhood."
    },
    classification: "fact",
    sourceDocumentId: "SRC-002",
    sourceVersion: "v0.4-draft",
    pageOrSection: "§4 Rejected Proof Types",
    publicationDate: "2025-11-20",
    verificationStatus: "source-verified",
    reviewerStatus: "editorial-reviewed",
    confidence: { fa: "بالا — در فهرست صریح ردها آمده است.", en: "High — appears in the explicit rejected-proofs list." },
    knownContradictions: [],
    lastReviewed: "2026-01-18",
    revisionHistory: [{ version: "v1", date: "2025-11-20", change: { fa: "ثبت اولیه", en: "Initial entry" } }],
    linkedModules: ["verification"]
  }),
  Object.freeze({
    id: "CLM-005",
    claim: {
      fa: "راهنمای خدمات عمومی تنها پیوندهای عمومی منتشرشده را فهرست می‌کند و ادعای یکپارچگی فنی با سامانه‌های دولتی ندارد.",
      en: "The public service directory lists only published public links and claims no technical integration with government systems."
    },
    classification: "design-statement",
    sourceDocumentId: "SRC-003",
    sourceVersion: "v0.3-draft",
    pageOrSection: "§Scope",
    publicationDate: "2025-11-28",
    verificationStatus: "source-verified",
    reviewerStatus: "editorial-reviewed",
    confidence: { fa: "متوسط تا بالا — دامنهٔ کار مشخص شده است.", en: "Medium-high — scope is explicitly bounded." },
    knownContradictions: [],
    lastReviewed: "2026-01-20",
    revisionHistory: [{ version: "v1", date: "2025-11-28", change: { fa: "ثبت اولیه", en: "Initial entry" } }],
    linkedModules: ["public-services"]
  }),
  Object.freeze({
    id: "CLM-006",
    claim: {
      fa: "مجموعه‌دادهٔ اصلی شامل ردیف‌هایی از افراد زنده است که انتشار آن‌ها در این مخزن ممنوع شده است.",
      en: "The source dataset includes rows concerning living persons, whose publication in this repository is prohibited."
    },
    classification: "fact",
    sourceDocumentId: "SRC-004",
    sourceVersion: "v1.1",
    pageOrSection: "§3 Data Classification",
    publicationDate: "2025-12-04",
    verificationStatus: "source-verified",
    reviewerStatus: "editorial-reviewed",
    confidence: { fa: "بالا — بازبینی داخلی مستند است.", en: "High — internal audit is documented." },
    knownContradictions: [],
    lastReviewed: "2026-01-21",
    revisionHistory: [{ version: "v1", date: "2025-12-04", change: { fa: "ثبت اولیه", en: "Initial entry" } }],
    linkedModules: ["historical-archive", "dashboard"]
  }),
  Object.freeze({
    id: "CLM-007",
    claim: {
      fa: "طرح ۷۷ ستونی، ساختار پروندهٔ تاریخی را تعریف می‌کند اما به‌تنهایی مجوز انتشار محتوا نیست.",
      en: "The 77-column schema defines dossier structure but is not, by itself, a publication license."
    },
    classification: "interpretation",
    sourceDocumentId: "SRC-004",
    sourceVersion: "v1.1",
    pageOrSection: "§5 Schema",
    publicationDate: "2025-12-04",
    verificationStatus: "source-verified",
    reviewerStatus: "editorial-reviewed",
    confidence: { fa: "بالا — تفکیک ساختار از مجوز در گزارش آمده است.", en: "High — the report separates structure from permission." },
    knownContradictions: [],
    lastReviewed: "2026-01-21",
    revisionHistory: [{ version: "v1", date: "2025-12-04", change: { fa: "ثبت اولیه", en: "Initial entry" } }],
    linkedModules: ["historical-archive"]
  }),
  Object.freeze({
    id: "CLM-008",
    claim: {
      fa: "پرونده‌های نمایش‌داده‌شده در بایگانی، ساختگی و فاقد هرگونه ارتباط با افراد واقعی هستند.",
      en: "Dossiers shown in the archive are synthetic and correspond to no real person."
    },
    classification: "fact",
    sourceDocumentId: "SRC-005",
    sourceVersion: "fixture-v1",
    pageOrSection: "Row-level synthetic_label",
    publicationDate: "2026-01-10",
    verificationStatus: "synthetic-fixture",
    reviewerStatus: "editorial-reviewed",
    confidence: { fa: "قطعی نسبت به ساختگی بودن؛ فاقد ارزش تاریخی واقعی.", en: "Certain as to synthetic status; of no real historical value." },
    knownContradictions: [],
    lastReviewed: "2026-01-25",
    revisionHistory: [{ version: "v1", date: "2026-01-10", change: { fa: "ثبت اولیه", en: "Initial entry" } }],
    linkedModules: ["historical-archive"]
  }),
  Object.freeze({
    id: "CLM-009",
    claim: {
      fa: "اصل ۲۰ بر رضایت صریح، حق بازپس‌گیری و منع شبیه‌سازی صدا و چهره تأکید دارد.",
      en: "Principle 20 emphasizes explicit consent, the right to revocation, and a ban on voice and likeness simulation."
    },
    classification: "author-statement",
    sourceDocumentId: "SRC-006",
    sourceVersion: "v0.2-draft",
    pageOrSection: "§Clauses 4–6",
    publicationDate: "2026-01-22",
    verificationStatus: "source-reported",
    reviewerStatus: "pending-human-review",
    confidence: { fa: "متوسط — یادداشت پژوهشی است، نه متن حقوقی نهایی.", en: "Medium — a research note, not final legal text." },
    knownContradictions: [],
    lastReviewed: "2026-01-26",
    revisionHistory: [{ version: "v1", date: "2026-01-22", change: { fa: "ثبت اولیه", en: "Initial entry" } }],
    linkedModules: ["digital-legacy"]
  }),
  Object.freeze({
    id: "CLM-010",
    claim: {
      fa: "هیچ رأی، نصاب یا تصویب عمومی برای منشور CEP ثبت نشده است.",
      en: "No vote, quorum, or public ratification is recorded for the CEP charter."
    },
    classification: "fact",
    sourceDocumentId: "SRC-001",
    sourceVersion: "v1.0-draft",
    pageOrSection: "§1.4 Ratification Status",
    publicationDate: "2025-11-01",
    verificationStatus: "source-verified",
    reviewerStatus: "editorial-reviewed",
    confidence: { fa: "بالا — وضعیت «پیش‌نویس» در سند صریح است.", en: "High — 'draft' status is explicit in the document." },
    knownContradictions: [],
    lastReviewed: "2026-01-15",
    revisionHistory: [{ version: "v1", date: "2025-11-01", change: { fa: "ثبت اولیه", en: "Initial entry" } }],
    linkedModules: ["governance", "dashboard"]
  }),
  Object.freeze({
    id: "CLM-011",
    claim: {
      fa: "هیچ سامانهٔ تأیید هویت واقعی مستقر نشده و سطح ۳ به بالا تنها در شبیه‌سازی بررسی می‌شود.",
      en: "No real identity verification system is deployed; bands 3 and above exist only as a simulation."
    },
    classification: "design-statement",
    sourceDocumentId: "SRC-002",
    sourceVersion: "v0.4-draft",
    pageOrSection: "§6 Status of Implementation",
    publicationDate: "2025-11-20",
    verificationStatus: "source-verified",
    reviewerStatus: "editorial-reviewed",
    confidence: { fa: "بالا — سند وضعیت پیاده‌سازی را تصریح می‌کند.", en: "High — the document states implementation status explicitly." },
    knownContradictions: [],
    lastReviewed: "2026-01-18",
    revisionHistory: [{ version: "v1", date: "2025-11-20", change: { fa: "ثبت اولیه", en: "Initial entry" } }],
    linkedModules: ["verification", "dashboard"]
  }),
  Object.freeze({
    id: "CLM-012",
    claim: {
      fa: "دامنه‌های نمونهٔ درگاه‌های دولتی تأیید نشده‌اند و ممکن است تغییر کنند یا متعلق به نهاد دیگری باشند.",
      en: "Sample government portal domains are unverified and may change or belong to another party."
    },
    classification: "speculation",
    sourceDocumentId: "SRC-003",
    sourceVersion: "v0.3-draft",
    pageOrSection: "§Candidate Domains",
    publicationDate: "2025-11-28",
    verificationStatus: "unverified",
    reviewerStatus: "pending-human-review",
    confidence: { fa: "پایین — هیچ راستی‌آزمایی زنده انجام نشده است.", en: "Low — no live verification was performed." },
    knownContradictions: [
      {
        with: "CLM-016",
        note: {
          fa: "ارجاع نمونهٔ بیرونی نیز همان دامنه‌ها را تأیید نکرده است.",
          en: "The external sample reference does not confirm the same domains either."
        }
      }
    ],
    lastReviewed: "2026-01-20",
    revisionHistory: [{ version: "v1", date: "2025-11-28", change: { fa: "ثبت اولیه", en: "Initial entry" } }],
    linkedModules: ["public-services"]
  }),
  Object.freeze({
    id: "CLM-013",
    claim: {
      fa: "ظرفیت گذار در بازهٔ ۱۸۰ روزهٔ اضطراری و افق ۲ تا ۳ ساله به‌صورت جداگانه تحلیل شده است.",
      en: "Transition capacity is analyzed separately across the 180-day emergency phase and the 2–3 year horizon."
    },
    classification: "interpretation",
    sourceDocumentId: "SRC-004",
    sourceVersion: "v1.1",
    pageOrSection: "§7 Transition Horizons",
    publicationDate: "2025-12-04",
    verificationStatus: "source-verified",
    reviewerStatus: "editorial-reviewed",
    confidence: { fa: "متوسط — تفکیک افق‌ها مستند است، اما برآوردها تحلیلی‌اند.", en: "Medium — horizon split is documented, but estimates are analytical." },
    knownContradictions: [],
    lastReviewed: "2026-01-22",
    revisionHistory: [{ version: "v1", date: "2025-12-04", change: { fa: "ثبت اولیه", en: "Initial entry" } }],
    linkedModules: ["transition"]
  }),
  Object.freeze({
    id: "CLM-014",
    claim: {
      fa: "پرونده‌های ساختگی نمونه به‌طور عمدی شامل تناقض میان منابع هستند تا سامانهٔ مقایسه آزموده شود.",
      en: "Sample synthetic dossiers deliberately contain cross-source contradictions so the comparison tool can be tested."
    },
    classification: "interpretation",
    sourceDocumentId: "SRC-005",
    sourceVersion: "fixture-v1",
    pageOrSection: "disputed_attribution column",
    publicationDate: "2026-01-10",
    verificationStatus: "synthetic-fixture",
    reviewerStatus: "editorial-reviewed",
    confidence: { fa: "قطعی نسبت به ساختگی بودن.", en: "Certain as to synthetic status." },
    knownContradictions: [],
    lastReviewed: "2026-01-25",
    revisionHistory: [{ version: "v1", date: "2026-01-10", change: { fa: "ثبت اولیه", en: "Initial entry" } }],
    linkedModules: ["historical-archive"]
  }),
  Object.freeze({
    id: "CLM-015",
    claim: {
      fa: "مفهوم «پروندهٔ هستی» نیازمند چارچوب حقوقی مستقل و رضایت فردی است و نباید با بایگانی تاریخی آمیخته شود.",
      en: "The 'existence dossier' concept requires an independent legal framework and individual consent, and must not be merged with the historical archive."
    },
    classification: "proposal",
    sourceDocumentId: "SRC-006",
    sourceVersion: "v0.2-draft",
    pageOrSection: "§Separation from Archive",
    publicationDate: "2026-01-22",
    verificationStatus: "proposed",
    reviewerStatus: "pending-human-review",
    confidence: { fa: "متوسط — پیشنهاد مفهومی است.", en: "Medium — a conceptual proposal." },
    knownContradictions: [],
    lastReviewed: "2026-01-26",
    revisionHistory: [{ version: "v1", date: "2026-01-22", change: { fa: "ثبت اولیه", en: "Initial entry" } }],
    linkedModules: ["digital-legacy", "historical-archive"]
  }),
  Object.freeze({
    id: "CLM-016",
    claim: {
      fa: "فهرست نمونهٔ خدمات عمومی بر پایهٔ یک مجموعهٔ مقرراتی بیرونی تهیه شده که نسخهٔ آن تأیید نشده است.",
      en: "The sample public service list is based on an external regulations compendium whose edition is unverified."
    },
    classification: "hypothesis",
    sourceDocumentId: "SRC-007",
    sourceVersion: "unverified-edition",
    pageOrSection: "unindexed",
    publicationDate: "2024-06-15",
    verificationStatus: "disputed",
    reviewerStatus: "blocked-gate",
    confidence: { fa: "پایین — نسخه و حقوق بازنشر تأیید نشده است.", en: "Low — edition and republication rights are unverified." },
    knownContradictions: [
      {
        with: "CLM-012",
        note: {
          fa: "فهرست دامنه‌ها با ارجاع نمونهٔ بیرونی هم‌خوانی کامل ندارد.",
          en: "The domain list does not fully agree with the external sample reference."
        }
      }
    ],
    lastReviewed: "2026-01-20",
    revisionHistory: [{ version: "v1", date: "2025-12-12", change: { fa: "ثبت اولیه", en: "Initial entry" } }],
    linkedModules: ["public-services"]
  })
]);

export const unresolvedQuestions = Object.freeze([
  Object.freeze({
    id: "UQ-01",
    question: {
      fa: "چه کسی و با چه سازوکاری مجوز بازنشر اسناد تاریخی بیرونی را تأیید می‌کند؟",
      en: "Who verifies republication rights for external historical documents, and through what mechanism?"
    },
    blocks: ["historical-archive", "public-services"],
    status: "open",
    owner: { fa: "کارگروه حقوق و بایگانی", en: "Rights & archives working group" },
    linkedSources: ["SRC-004", "SRC-007"],
    nextStep: {
      fa: "دریافت تأیید کتبی از متولیان منبع و ثبت آن به‌عنوان دروازهٔ انسانی.",
      en: "Obtain written confirmation from source custodians and record it as a human gate."
    }
  }),
  Object.freeze({
    id: "UQ-02",
    question: {
      fa: "مرز دقیق میان «پیشنهاد فنی» و «ادعای تاریخی» در رابط کاربری چگونه سنجیده می‌شود؟",
      en: "How is the boundary between a technical proposal and a historical claim measured in the interface?"
    },
    blocks: ["governance", "transition"],
    status: "partially-answered",
    owner: { fa: "دفتر شواهد", en: "Evidence office" },
    linkedSources: ["SRC-001", "SRC-002"],
    nextStep: {
      fa: "افزودن بازبینی دو‌زبانهٔ انسانی برای هر برچسب معرفتی.",
      en: "Add human bilingual review for every epistemic label."
    }
  }),
  Object.freeze({
    id: "UQ-03",
    question: {
      fa: "در نبود سامانهٔ تأیید هویت، سطح ۴ و ۵ در آینده چگونه و توسط چه نهادی اعطا می‌شود؟",
      en: "Absent a verification system, how and by which institution would bands 4 and 5 eventually be granted?"
    },
    blocks: ["verification"],
    status: "open",
    owner: { fa: "کارگروه امنیت", en: "Security working group" },
    linkedSources: ["SRC-002"],
    nextStep: {
      fa: "تدوین سند حقوقی مستقل پیش از هر پیاده‌سازی.",
      en: "Draft an independent legal instrument before any implementation."
    }
  }),
  Object.freeze({
    id: "UQ-04",
    question: {
      fa: "کدام دامنه‌های عمومی برای راهنمای خدمات واقعاً متعلق به نهاد مربوطه هستند؟",
      en: "Which public domains in the service directory genuinely belong to the institution they claim?"
    },
    blocks: ["public-services"],
    status: "blocked",
    owner: { fa: "کارگروه گذار", en: "Transition working group" },
    linkedSources: ["SRC-003", "SRC-007"],
    nextStep: {
      fa: "راستی‌آزمایی با اجازهٔ صریح متولی؛ تا آن زمان برچسب «تأییدنشده» حفظ می‌شود.",
      en: "Verify with explicit custodian permission; keep the 'unverified' label until then."
    }
  }),
  Object.freeze({
    id: "UQ-05",
    question: {
      fa: "برای اصل ۲۰ چه چارچوب رضایت و بازپس‌گیری‌ای از نظر حقوقی لازم است؟",
      en: "What consent and revocation framework is legally required for Principle 20?"
    },
    blocks: ["digital-legacy"],
    status: "open",
    owner: { fa: "کمیتهٔ پژوهش", en: "Research committee" },
    linkedSources: ["SRC-006"],
    nextStep: {
      fa: "مشورت با حقوقدانان مستقل و سازمان‌های حقوق بشر.",
      en: "Consult independent legal experts and human-rights organizations."
    }
  })
]);
