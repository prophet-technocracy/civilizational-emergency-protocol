// Synthetic civic-governance fixtures (Departments B & F).
// Nothing here is a ratified law, a vote, an appointment, or an operational record.

export const constitutionalPrinciples = Object.freeze([
  {
    id: "P-01",
    number: 1,
    title: { fa: "منشور پیش‌نویس است، نه قانون", en: "The Charter Is a Draft, Not Law" },
    body: {
      fa: "این سند پیش‌نویس یک کوشش مدنی است. هیچ رأی، نصاب، تصویب یا قیمومیت عمومی برای آن ثبت نشده و هیچ نهادی را منصوب نمی‌کند.",
      en: "This document is a civic draft. No vote, quorum, ratification, or public mandate is recorded, and it appoints no institution."
    },
    epistemicStatus: "source-verified",
    sourceRef: "CLM-010"
  },
  {
    id: "P-02",
    number: 2,
    title: { fa: "کرامت و عدم رتبه‌بندی انسان", en: "Dignity and No Ranking of Humans" },
    body: {
      fa: "هیچ انسان یا گروهی بر پایهٔ ارزش تاریخی، اعتبار اجتماعی، نژاد، دین، جنسیت، قومیت یا نگرش سیاسی رتبه‌بندی نمی‌شود.",
      en: "No person or group is ranked by supposed historical worth, social credit, ethnicity, religion, gender, or political opinion."
    },
    epistemicStatus: "source-verified",
    sourceRef: "CLM-001"
  },
  {
    id: "P-03",
    number: 3,
    title: { fa: "تفکیک کارکردها", en: "Separation of Functions" },
    body: {
      fa: "قانون‌گذاری، اجرا، نظارت قضایی و حسابرسی مستقل باید از یکدیگر جدا بمانند تا هیچ کارکردی نتواند هم‌زمان قاعده بسازد و بر خود نظارت کند.",
      en: "Rule-making, execution, judicial review, and independent audit must be separated so no single function can both set rules and supervise itself."
    },
    epistemicStatus: "proposed",
    sourceRef: "CLM-003"
  },
  {
    id: "P-04",
    number: 4,
    title: { fa: "امکان خروج و بازپس‌گیری", en: "Exit and Revocation" },
    body: {
      fa: "هر سازوکار اضطراری باید دارای تاریخ انقضا یا شرط خاتمه باشد و بتواند توسط نهاد مستقل بازپس گرفته شود.",
      en: "Every emergency mechanism must carry a sunset date or termination condition and be revocable by an independent body."
    },
    epistemicStatus: "proposed",
    sourceRef: "CLM-003"
  },
  {
    id: "P-05",
    number: 5,
    title: { fa: "شفافیت معایب و گزینه‌های جایگزین", en: "Visible Trade-offs and Alternatives" },
    body: {
      fa: "هر پیشنهاد باید مسئله، گزینه‌های جایگزین، محدودیت‌ها و اثر حقوقی خود را پیش از هر تصویب احتمالی نشان دهد.",
      en: "Every proposal must state its problem, alternatives, limitations, and rights impact before any possible ratification."
    },
    epistemicStatus: "proposed",
    sourceRef: "CLM-002"
  },
  {
    id: "P-06",
    number: 6,
    title: { fa: "مشارکت داوطلبانه و ناشناس", en: "Voluntary, Anonymous Participation" },
    body: {
      fa: "هیچ شهروندی برای دیدن اطلاعات عمومی، اعلام نظر یا خواندن منشور ملزم به ساخت حساب کاربری، ارائهٔ شماره تلفن یا افشای موقعیت مکانی نیست.",
      en: "No citizen must create an account, supply a phone number, or disclose location to read public information or express a view."
    },
    epistemicStatus: "source-verified",
    sourceRef: "CLM-004"
  },
  {
    id: "P-07",
    number: 7,
    title: { fa: "حداقل‌گرایی داده", en: "Data Minimalism" },
    body: {
      fa: "هیچ دادهٔ شخصی نباید گردآوری شود مگر آنکه برای یک کنش مشخص و محدود، ضروری و متناسب باشد.",
      en: "No personal data may be collected unless necessary and proportionate to a specific, bounded action."
    },
    epistemicStatus: "source-verified",
    sourceRef: "CLM-004"
  },
  {
    id: "P-08",
    number: 8,
    title: { fa: "استقلال بازبینی", en: "Independent Review" },
    body: {
      fa: "هر بخش مهندسی که کار حساس می‌سازد نباید خودش آن را تأیید کند؛ بازبینی به بخش مستقل سپرده می‌شود.",
      en: "No department that builds sensitive work approves it; review is delegated to an independent department."
    },
    epistemicStatus: "proposed",
    sourceRef: "CLM-003"
  },
  {
    id: "P-09",
    number: 9,
    title: { fa: "صداقت معرفتی", en: "Epistemic Honesty" },
    body: {
      fa: "هر گزاره باید وضعیت معرفتی خود را برچسب بزند و تکرار یک ادعا توسط هوش مصنوعی یا رسانه، آن را «تأییدشده» نمی‌کند.",
      en: "Every statement labels its epistemic status; repetition by AI or media never turns a claim into a verified fact."
    },
    epistemicStatus: "proposed",
    sourceRef: "CLM-002"
  },
  {
    id: "P-10",
    number: 10,
    title: { fa: "اصل ۲۰ — حق بر پروندهٔ هستی", en: "Principle 20 — The Right to One's Existence Dossier" },
    body: {
      fa: "هر انسان حق دارد بر پروندهٔ هستی خویش آگاه باشد، آن را اصلاح کند و از شبیه‌سازی صدا، چهره و عاملیت پس از مرگ خود جلوگیری کند.",
      en: "Every person has the right to know, correct, and restrict their own existence dossier, and to refuse voice, likeness, or posthumous agency simulation."
    },
    epistemicStatus: "source-reported",
    sourceRef: "CLM-009"
  }
]);

export const governanceLayers = Object.freeze([
  {
    id: "LAYER-01",
    name: { fa: "لایهٔ اصول", en: "Principles Layer" },
    purpose: {
      fa: "ارزش‌ها و محدودیت‌های غیرقابل مذاکره‌ای که هیچ اکثریتی نمی‌تواند لغو کند.",
      en: "Non-negotiable values and constraints that no majority may revoke."
    },
    exampleInstitutions: ["PRINCIPLE-GUARDIAN"],
    changeDifficulty: "very-high",
    isOperational: false,
    epistemicStatus: "proposed"
  },
  {
    id: "LAYER-02",
    name: { fa: "لایهٔ قانون‌گذاری", en: "Legislative Layer" },
    purpose: {
      fa: "تدوین قواعد عمومی با انتشار کامل متن، مذاکرات و رأی‌گیری ثبت‌شده.",
      en: "Drafting general rules with full publication of text, deliberation, and recorded votes."
    },
    exampleInstitutions: ["DELIBERATIVE-ASSEMBLY"],
    changeDifficulty: "high",
    isOperational: false,
    epistemicStatus: "proposed"
  },
  {
    id: "LAYER-03",
    name: { fa: "لایهٔ اجرا", en: "Executive Layer" },
    purpose: {
      fa: "اجرای قوانین با اختیارات محدود، قابل تفویض و تحت نظارت مستمر.",
      en: "Administering law under bounded, delegable, continuously supervised authority."
    },
    exampleInstitutions: ["TRANSITION-ADMINISTRATION"],
    changeDifficulty: "medium",
    isOperational: false,
    epistemicStatus: "proposed"
  },
  {
    id: "LAYER-04",
    name: { fa: "لایهٔ نظارت قضایی", en: "Judicial Review Layer" },
    purpose: {
      fa: "تطبیق اقدامات با اصول و قوانین و اعلام بطلان اقدامات خارج از صلاحیت.",
      en: "Testing actions against principles and law, and voiding acts outside competence."
    },
    exampleInstitutions: ["CONSTITUTIONAL-CHAMBER"],
    changeDifficulty: "very-high",
    isOperational: false,
    epistemicStatus: "proposed"
  },
  {
    id: "LAYER-05",
    name: { fa: "لایهٔ حسابرسی مستقل", en: "Independent Audit Layer" },
    purpose: {
      fa: "بازرسی مالی، فنی و حقوقی مستقل و انتشار عمومی یافته‌ها.",
      en: "Independent financial, technical, and legal inspection with public findings."
    },
    exampleInstitutions: ["INDEPENDENT-AUDIT-OFFICE"],
    changeDifficulty: "medium",
    isOperational: false,
    epistemicStatus: "proposed"
  }
]);

export const charterAmendments = Object.freeze([
  {
    id: "AMD-001",
    targetDocument: "FOUNDING-CHARTER.md",
    section: "§4 Separation of Functions",
    summary: {
      fa: "افزودن الزام «شرط خاتمهٔ خودکار» برای هر اختیار اضطراری.",
      en: "Add a mandatory automatic sunset clause to every emergency authority."
    },
    rationale: {
      fa: "جلوگیری از تبدیل وضعیت اضطراری موقت به ساختار دائمی.",
      en: "Prevent temporary emergency arrangements from becoming permanent structures."
    },
    proposedByRole: { fa: "کارگروه حقوق", en: "Rights working group" },
    date: "2026-02-08",
    repositoryStatus: "merged-draft",
    ratificationStatus: "not-ratified",
    reviewRecord: "REV-005"
  },
  {
    id: "AMD-002",
    targetDocument: "GOVERNANCE.md",
    section: "§Review Gates",
    summary: {
      fa: "الزام بازبینی مستقل توسط بخشی که اثرگذار بر کار نیست.",
      en: "Require independent review by a department that did not build the work."
    },
    rationale: {
      fa: "به‌کارگیری اصل تفکیک کارکردها در فرایند مهندسی نرم‌افزار.",
      en: "Apply the separation-of-functions principle to the engineering process."
    },
    proposedByRole: { fa: "دفتر معماری", en: "Architecture office" },
    date: "2026-02-19",
    repositoryStatus: "merged-draft",
    ratificationStatus: "not-ratified",
    reviewRecord: "REV-006"
  },
  {
    id: "AMD-003",
    targetDocument: "FOUNDING-CHARTER.md",
    section: "§Principle 20",
    summary: {
      fa: "تصریح منع شبیه‌سازی صدا و چهره و منع عاملیت سیاسی پس از مرگ.",
      en: "Explicitly ban voice/likeness simulation and posthumous political agency."
    },
    rationale: {
      fa: "برخی خوانش‌ها امکان بازسازی دیجیتال را «حق بازماندگان» تلقی کرده بودند.",
      en: "Some readings treated digital reconstruction as a right of surviving relatives."
    },
    proposedByRole: { fa: "کمیتهٔ پژوهش", en: "Research committee" },
    date: "2026-03-02",
    repositoryStatus: "proposed",
    ratificationStatus: "not-ratified",
    dispute: {
      fa: "مورد اختلاف بین گروه پژوهش و گروه حقوق؛ نیازمند بازبینی انسانی دو‌زبانه.",
      en: "Disputed between the research and legal groups; requires bilingual human review."
    },
    reviewRecord: "REV-003"
  }
]);

export const accountabilityRecords = Object.freeze({
  auditEvents: [
    {
      id: "EVT-001",
      previousEventId: null,
      timestamp: "2026-01-04T09:12:00Z",
      actionType: "content-publication",
      targetEntity: "docs/iran/IMPLEMENTATION-PLAN.md",
      changeSummary: { fa: "انتشار نقشهٔ اجرای برای بازبینی عمومی.", en: "Published the implementation plan for public review." },
      responsibleProcessOrRole: { fa: "ویرایشگر فنی", en: "Technical editor" },
      reason: { fa: "شفافیت و دریافت بازخورد پیش از هر اجرا.", en: "Transparency and feedback before any execution." },
      previousVersion: "—",
      newVersion: "v1.0",
      reviewStatus: "editorial-reviewed",
      approvalStatus: "human-reviewed",
      cryptographicImmutabilityClaim: false
    },
    {
      id: "EVT-002",
      previousEventId: "EVT-001",
      timestamp: "2026-01-10T14:40:00Z",
      actionType: "fixture-addition",
      targetEntity: "data/synthetic/synthetic-deceased-archive-sample.csv",
      changeSummary: { fa: "افزودن سه پروندهٔ آشکارا ساختگی برای آزمون اسکیما.", en: "Added three explicitly synthetic dossiers to test the schema." },
      responsibleProcessOrRole: { fa: "بخش تاریخ و بایگانی", en: "Historical & archives department" },
      reason: { fa: "آزمون اسکیمای ۷۷ ستونی بدون استفاده از دادهٔ واقعی.", en: "Test the 77-column schema without real-world data." },
      previousVersion: "—",
      newVersion: "fixture-v1",
      reviewStatus: "editorial-reviewed",
      approvalStatus: "human-reviewed",
      cryptographicImmutabilityClaim: false
    },
    {
      id: "EVT-003",
      previousEventId: "EVT-002",
      timestamp: "2026-01-18T11:05:00Z",
      actionType: "design-revision",
      targetEntity: "docs/iran/VERIFICATION-AND-ACCESS-CONTROL-DESIGN.md",
      changeSummary: { fa: "افزودن فهرست اثبات‌های ردشده (تلگرام، عکس مکان، امتیاز اجتماعی).", en: "Added the rejected-proofs list (Telegram, location photo, social credit)." },
      responsibleProcessOrRole: { fa: "کارگروه امنیت", en: "Security working group" },
      reason: { fa: "پیشگیری از سازوکارهای تبعیض‌آمیز و خطرآفرین.", en: "Prevent discriminatory and physically risky mechanisms." },
      previousVersion: "v0.3-draft",
      newVersion: "v0.4-draft",
      reviewStatus: "editorial-reviewed",
      approvalStatus: "human-reviewed",
      cryptographicImmutabilityClaim: false
    },
    {
      id: "EVT-004",
      previousEventId: "EVT-003",
      timestamp: "2026-02-08T16:22:00Z",
      actionType: "amendment-proposed",
      targetEntity: "FOUNDING-CHARTER.md §4",
      changeSummary: { fa: "طرح اصلاحیهٔ شرط خاتمهٔ خودکار.", en: "Proposed the automatic-sunset amendment." },
      responsibleProcessOrRole: { fa: "کارگروه حقوق", en: "Rights working group" },
      reason: { fa: "جلوگیری از دائمی‌شدن اختیارات اضطراری.", en: "Prevent emergency powers becoming permanent." },
      previousVersion: "draft-2025-11",
      newVersion: "AMD-001-proposed",
      reviewStatus: "pending-human-review",
      approvalStatus: "not-approved",
      cryptographicImmutabilityClaim: false
    },
    {
      id: "EVT-005",
      previousEventId: "EVT-004",
      timestamp: "2026-03-02T08:55:00Z",
      actionType: "amendment-disputed",
      targetEntity: "FOUNDING-CHARTER.md §Principle 20",
      changeSummary: { fa: "ثبت اختلاف نظر دربارهٔ دامنهٔ منع شبیه‌سازی.", en: "Recorded a disagreement over the scope of the simulation ban." },
      responsibleProcessOrRole: { fa: "کمیتهٔ پژوهش", en: "Research committee" },
      reason: { fa: "ثبت شفاف اختلاف به‌جای پنهان کردن آن.", en: "Record the disagreement transparently rather than hide it." },
      previousVersion: "v0.2-draft",
      newVersion: "AMD-003-disputed",
      reviewStatus: "disputed-interpretation",
      approvalStatus: "blocked",
      cryptographicImmutabilityClaim: false
    },
    {
      id: "EVT-006",
      previousEventId: "EVT-005",
      timestamp: "2026-03-19T10:30:00Z",
      actionType: "prototype-release",
      targetEntity: "apps/web + apps/api",
      changeSummary: { fa: "انتشار نسخهٔ نمایشی محلی و خواندنی دوازده‌بخشی.", en: "Released the local read-only twelve-module demonstrator." },
      responsibleProcessOrRole: { fa: "بخش‌های مهندسی A–H", en: "Engineering departments A–H" },
      reason: { fa: "امکان بازبینی انسانی و آزمون پذیرش.", en: "Enable human review and acceptance testing." },
      previousVersion: "scaffold-f0d724d",
      newVersion: "prototype-v0.1",
      reviewStatus: "editorial-reviewed",
      approvalStatus: "not-approved-for-public-deployment",
      cryptographicImmutabilityClaim: false
    }
  ],
  immutabilityNotice: {
    fa: "این گزارش یک گزارش برنامه‌ای معمولی و «الحاق‌گرا» است؛ ادعای تغییرناپذیری رمزنگاری‌شده یا زنجیرهٔ بلوکی برای آن مطرح نمی‌شود.",
    en: "This is an ordinary append-oriented application log. No cryptographic immutability or blockchain claim is made about it."
  },
  conflictsOfInterest: [
    {
      id: "COI-001",
      person: { fa: "بازبین ارشد (نقش نمایشی)", en: "Senior reviewer (illustrative role)" },
      declaredInterest: { fa: "نویسندهٔ یکی از اسناد طراحی است.", en: "Authored one of the design documents." },
      affectedItems: ["docs/iran/VERIFICATION-AND-ACCESS-CONTROL-DESIGN.md"],
      mitigation: { fa: "بازبینی به عضو مستقل واگذار شد.", en: "Review reassigned to an independent member." },
      status: "mitigated"
    },
    {
      id: "COI-002",
      person: { fa: "ویرایشگر بایگانی (نقش نمایشی)", en: "Archive editor (illustrative role)" },
      declaredInterest: { fa: "علاقهٔ پژوهشی به یکی از حوزه‌های موضوعی آرشیو.", en: "Research interest in one of the archive's subject areas." },
      affectedItems: ["historical-archive"],
      mitigation: { fa: "همهٔ پرونده‌ها ساختگی‌اند و بازبینی دوم الزامی است.", en: "All dossiers are synthetic and second review is mandatory." },
      status: "declared"
    }
  ],
  reviewRecords: [
    {
      id: "REV-001",
      targetType: "security-design",
      targetId: "docs/iran/VERIFICATION-AND-ACCESS-CONTROL-DESIGN.md",
      reviewerRole: { fa: "بازبین مستقل امنیت (DEPT-H)", en: "Independent security reviewer (DEPT-H)" },
      reviewType: "adversarial-review",
      outcome: "approved-with-conditions",
      conditionsOrDissent: { fa: "همهٔ سطوح بالای ۲ تنها در حالت شبیه‌سازی باقی بمانند.", en: "All bands above 2 must remain simulation-only." },
      reviewedAt: "2026-01-19"
    },
    {
      id: "REV-002",
      targetType: "dataset-boundary",
      targetId: "data/synthetic/",
      reviewerRole: { fa: "بازبین حریم خصوصی (DEPT-H)", en: "Privacy reviewer (DEPT-H)" },
      reviewType: "privacy-audit",
      outcome: "approved",
      conditionsOrDissent: { fa: "تأیید شد که هیچ پروندهٔ فرد زنده در مخزن نیست.", en: "Confirmed that no living-person record is present in the repository." },
      reviewedAt: "2026-01-26"
    },
    {
      id: "REV-003",
      targetType: "amendment",
      targetId: "AMD-003",
      reviewerRole: { fa: "کارگروه حقوق", en: "Rights working group" },
      reviewType: "legal-scope-review",
      outcome: "dissent-recorded",
      conditionsOrDissent: { fa: "مخالفت با تفسیر موسع از «حق بازماندگان».", en: "Disagreement with a broad reading of 'rights of survivors'." },
      reviewedAt: "2026-03-05"
    },
    {
      id: "REV-004",
      targetType: "accessibility",
      targetId: "apps/web",
      reviewerRole: { fa: "بازبین دسترس‌پذیری (DEPT-G)", en: "Accessibility reviewer (DEPT-G)" },
      reviewType: "a11y-audit",
      outcome: "approved",
      conditionsOrDissent: { fa: "پیمایش با صفحه‌کلید و پشتیبانی RTL/LTR تأیید شد.", en: "Keyboard navigation and RTL/LTR support verified." },
      reviewedAt: "2026-03-21"
    },
    {
      id: "REV-005",
      targetType: "amendment",
      targetId: "AMD-001",
      reviewerRole: { fa: "دفتر معماری", en: "Architecture office" },
      reviewType: "consistency-review",
      outcome: "approved",
      conditionsOrDissent: { fa: "سازگار با اصل ۴؛ بدون نیاز به تغییر.", en: "Consistent with Principle 4; no change required." },
      reviewedAt: "2026-02-10"
    },
    {
      id: "REV-006",
      targetType: "amendment",
      targetId: "AMD-002",
      reviewerRole: { fa: "بازبین مستقل امنیت", en: "Independent security reviewer" },
      reviewType: "process-review",
      outcome: "approved-with-conditions",
      conditionsOrDissent: { fa: "الزام ثبت نام بازبین در هر تصمیم.", en: "Require the reviewer's name in every decision record." },
      reviewedAt: "2026-02-21"
    }
  ]
});

export const publicGoodProjects = Object.freeze([
  {
    id: "PRJ-001",
    title: { fa: "بایگانی تاریخی فاقد دادهٔ افراد زنده", en: "Living-Person-Free Historical Archive" },
    objectives: {
      fa: "ساخت بایگانی‌ای که تنها پرونده‌های افراد فوت‌شده و با منبع مشخص را می‌پذیرد و هرگز دادهٔ افراد زنده را در خود جای نمی‌دهد.",
      en: "Build an archive that accepts only deceased persons with traceable sources, and never holds living-person data."
    },
    workstream: "historical-intelligence",
    deliverables: [
      { fa: "اسکیمای ۷۷ ستونی با اعتبارسنج اجرایی", en: "77-column schema with an executable validator" },
      { fa: "خط لولهٔ دروازهٔ انسانی برای مجوز انتشار", en: "Human gate pipeline for publication rights" },
      { fa: "رابط جستجو و مقایسهٔ روایت‌های متناقض", en: "Search and conflicting-accounts comparison interface" }
    ],
    milestones: [
      { id: "MS-001a", title: { fa: "تعریف اسکیما", en: "Define schema" }, status: "complete", evidence: { fa: "data/schemas/historical-dossier-77col.schema.json", en: "data/schemas/historical-dossier-77col.schema.json" } },
      { id: "MS-001b", title: { fa: "اعتبارسنج خودکار", en: "Automated validator" }, status: "complete", evidence: { fa: "scripts/validation/validate-historical-csv.mjs", en: "scripts/validation/validate-historical-csv.mjs" } },
      { id: "MS-001c", title: { fa: "مجوز بازنشر منابع بیرونی", en: "External republication rights" }, status: "blocked", evidence: { fa: "نیازمند دروازهٔ انسانی G-01", en: "Requires human gate G-01" } }
    ],
    publicDocumentation: "docs/iran/DISCOVERY-AND-EXECUTION-REPORT.md",
    evidenceOfCompletion: {
      fa: "آزمون‌های خودکار و اسکریپت اعتبارسنجی از اجرای موفق گزارش می‌دهند؛ پرونده‌های واقعی هنوز پذیرفته نشده‌اند.",
      en: "Automated tests and the validation script report success; real records are not yet accepted."
    },
    reviewStatus: "partially-verified",
    governancePrivilegeGranted: false,
    incentiveNotice: {
      fa: "مشارکت در این پروژه هیچ حق حکمرانی، رأی وزنی یا دسترسی ویژه‌ای ایجاد نمی‌کند.",
      en: "Contributing to this project grants no governance rights, weighted vote, or privileged access."
    }
  },
  {
    id: "PRJ-002",
    title: { fa: "کتابخانهٔ شواهد با زنجیرهٔ منشأ", en: "Evidence Library with Provenance Chains" },
    objectives: {
      fa: "هر ادعا به سند، نسخه، صفحه و وضعیت بازبینی متصل شود و تناقض‌ها آشکار بمانند.",
      en: "Link every claim to a document, version, page, and review status, keeping contradictions visible."
    },
    workstream: "evidence-intelligence",
    deliverables: [
      { fa: "ثبت منابع و ادعاها", en: "Source and claim registries" },
      { fa: "نمایشگر تناقض", en: "Contradiction explorer" },
      { fa: "داشبورد پرسش‌های بی‌پاسخ", en: "Unresolved questions dashboard" }
    ],
    milestones: [
      { id: "MS-002a", title: { fa: "ثبت ۷ منبع و ۱۶ ادعا", en: "Register 7 sources and 16 claims" }, status: "complete", evidence: { fa: "apps/api/src/data/evidence.mjs", en: "apps/api/src/data/evidence.mjs" } },
      { id: "MS-002b", title: { fa: "اعتبارسنجی زنجیرهٔ منشأ در آزمون", en: "Provenance validation in tests" }, status: "complete", evidence: { fa: "packages/schemas/index.mjs#validateClaimProvenance", en: "packages/schemas/index.mjs#validateClaimProvenance" } },
      { id: "MS-002c", title: { fa: "بازبینی دو‌زبانهٔ انسانی همهٔ برچسب‌ها", en: "Human bilingual review of all labels" }, status: "in-progress", evidence: { fa: "در انتظار بازبین انسانی", en: "Awaiting a human reviewer" } }
    ],
    publicDocumentation: "agents/RESEARCH-STANDARDS.md",
    evidenceOfCompletion: {
      fa: "همهٔ ادعاها به منبع موجود ارجاع می‌دهند و آزمون خودکار این پیوند را بررسی می‌کند.",
      en: "Every claim points to an existing source, and an automated test checks the link."
    },
    reviewStatus: "partially-verified",
    governancePrivilegeGranted: false,
    incentiveNotice: {
      fa: "پژوهشگران هیچ امتیاز حکمرانی یا حق رأی وزنی به‌دست نمی‌آورند.",
      en: "Researchers gain no governance score or weighted voting right."
    }
  },
  {
    id: "PRJ-003",
    title: { fa: "راهنمای ایمن خدمات عمومی", en: "Safe Public Service Directory" },
    objectives: {
      fa: "فهرست کردن پیوندهای عمومی منتشرشده با برچسب وضعیت راستی‌آزمایی، بدون کاوش زنده یا ادعای یکپارچگی.",
      en: "List published public links with verification labels, without live probing or integration claims."
    },
    workstream: "iran-transition",
    deliverables: [
      { fa: "فهرست پیوندهای عمومی", en: "Public link catalogue" },
      { fa: "برچسب وضعیت راستی‌آزمایی", en: "Verification-status labels" },
      { fa: "هشدار مرزهای ایمنی", en: "Safety boundary notices" }
    ],
    milestones: [
      { id: "MS-003a", title: { fa: "تدوین فهرست نمونه", en: "Draft sample catalogue" }, status: "complete", evidence: { fa: "apps/api/src/data/iran.mjs", en: "apps/api/src/data/iran.mjs" } },
      { id: "MS-003b", title: { fa: "راستی‌آزمایی مالکیت دامنه‌ها", en: "Verify domain ownership" }, status: "blocked", evidence: { fa: "نیازمند اجازهٔ صریح متولی (UQ-04)", en: "Requires explicit custodian permission (UQ-04)" } }
    ],
    publicDocumentation: "docs/iran/PUBLIC-SERVICE-DIRECTORY-PLAN.md",
    evidenceOfCompletion: {
      fa: "همهٔ ورودی‌ها با برچسب «تأییدنشده» و بدون ادعای یکپارچگی نمایش داده می‌شوند.",
      en: "All entries display an 'unverified' label with no integration claim."
    },
    reviewStatus: "blocked-on-gate",
    governancePrivilegeGranted: false,
    incentiveNotice: {
      fa: "این فهرست هیچ نفع مالی، اولویت دسترسی یا حق حکمرانی ایجاد نمی‌کند.",
      en: "This directory creates no financial benefit, access priority, or governance right."
    }
  },
  {
    id: "PRJ-004",
    title: { fa: "آزمایشگاه شفافیت نهادی", en: "Institutional Transparency Laboratory" },
    objectives: {
      fa: "مقایسهٔ شفاف مدل‌های نهادی و آزمایش اثر شرط خاتمه و تفکیک کارکردها.",
      en: "Transparently compare institutional models and test sunset and separation effects."
    },
    workstream: "governance-engineering",
    deliverables: [
      { fa: "مقایسه‌گر مدل‌های نهادی", en: "Institutional model comparator" },
      { fa: "تنظیم‌گر پارامترهای مهارتی", en: "Safeguard parameter tuner" },
      { fa: "ثبت محدودیت‌های شبیه‌سازی", en: "Simulation limitations record" }
    ],
    milestones: [
      { id: "MS-004a", title: { fa: "چهار مدل نمونه", en: "Four illustrative models" }, status: "complete", evidence: { fa: "apps/api/src/data/governance.mjs", en: "apps/api/src/data/governance.mjs" } },
      { id: "MS-004b", title: { fa: "مقایسهٔ برچسب‌دار با محدودیت‌ها", en: "Labelled comparison with limits" }, status: "complete", evidence: { fa: "Module 11 رابط", en: "Module 11 interface" } }
    ],
    publicDocumentation: "docs/architecture/MODULE-MAP.md",
    evidenceOfCompletion: {
      fa: "همهٔ مقایسه‌ها برچسب «فرضی/شبیه‌سازی» دارند و هیچ نتیجه‌ای به‌عنوان توصیهٔ قطعی ارائه نمی‌شود.",
      en: "All comparisons carry a 'hypothetical/simulation' label; no result is presented as a definitive recommendation."
    },
    reviewStatus: "verified",
    governancePrivilegeGranted: false,
    incentiveNotice: {
      fa: "مشارکت در طراحی نهادی هیچ مزیت انتخاباتی یا مالی ایجاد نمی‌کند.",
      en: "Contributing to institutional design creates no electoral or financial advantage."
    }
  }
]);

export const institutionalDesignModels = Object.freeze([
  {
    id: "MODEL-PARLIAMENTARY",
    name: { fa: "نظام پارلمانی", en: "Parliamentary System" },
    summary: {
      fa: "دولت از دل مجلس برمی‌خیزد و در برابر آن پاسخ‌گوست؛ رئیس دولت معمولاً نخست‌وزیر است.",
      en: "The executive emerges from and answers to the legislature; the head of government is usually a prime minister."
    },
    traits: {
      executiveSelection: { fa: "انتخاب توسط مجلس", en: "Chosen by the legislature" },
      accountability: { fa: "رأی عدم اعتماد سریع", en: "Rapid no-confidence removal" },
      stability: { fa: "پایین‌تر؛ تغییر مکرر دولت", en: "Lower; frequent government turnover" },
      minorityProtection: { fa: "متوسط؛ وابسته به نظام انتخاباتی", en: "Moderate; depends on the electoral system" }
    },
    strengths: [{ fa: "پاسخگویی سریع اجرا به مجلس", en: "Fast executive accountability to the legislature" }],
    risks: [{ fa: "بی‌ثباتی اجرایی و بن‌بست بودجه", en: "Executive instability and budget deadlock" }],
    safeguardsNeeded: [{ fa: "آستانهٔ روشن عدم اعتماد و بودجهٔ اضطراری مقید", en: "Clear no-confidence thresholds and a bounded emergency budget" }],
    historicalExamples: { fa: "مثال‌های تطبیقی متعدد در قرن بیستم", en: "Various twentieth-century comparative examples" },
    epistemicStatus: "hypothetical"
  },
  {
    id: "MODEL-PRESIDENTIAL",
    name: { fa: "نظام ریاستی", en: "Presidential System" },
    summary: {
      fa: "رئیس اجرا و مجلس هر دو جداگانه انتخاب می‌شوند و دوره‌های ثابت دارند.",
      en: "The executive and legislature are elected separately with fixed terms."
    },
    traits: {
      executiveSelection: { fa: "انتخاب مستقیم", en: "Direct election" },
      accountability: { fa: "کندتر؛ ابزار محدود برکناری", en: "Slower; limited removal tools" },
      stability: { fa: "بالاتر در دورهٔ ثابت", en: "Higher within a fixed term" },
      minorityProtection: { fa: "وابسته به دادگاه قانون اساسی", en: "Depends on a constitutional court" }
    },
    strengths: [{ fa: "ثبات دوره و تفکیک روشن", en: "Term stability and clear separation" }],
    risks: [{ fa: "بن‌بست ساختاری و گرایش به تمرکز قدرت", en: "Structural deadlock and a tendency toward concentrated power" }],
    safeguardsNeeded: [{ fa: "دادگاه قانون اساسی قوی و سقف دورهٔ سخت", en: "A strong constitutional court and hard term limits" }],
    historicalExamples: { fa: "نمونه‌های تطبیقی در آمریکای شمالی و جنوبی", en: "Comparative examples in North and South America" },
    epistemicStatus: "hypothetical"
  },
  {
    id: "MODEL-SEMI",
    name: { fa: "نظام نیمه‌ریاستی", en: "Semi-Presidential System" },
    summary: {
      fa: "رئیس‌جمهور منتخب مستقیم با نخست‌وزیر پاسخ‌گو به مجلس هم‌زیستی می‌کنند.",
      en: "A directly elected president coexists with a prime minister answerable to the legislature."
    },
    traits: {
      executiveSelection: { fa: "دو‌گانه", en: "Dual" },
      accountability: { fa: "متوسط تا سریع", en: "Moderate to fast" },
      stability: { fa: "متوسط؛ خطر هم‌زیستی تنش‌آمیز", en: "Moderate; risk of tense cohabitation" },
      minorityProtection: { fa: "متوسط", en: "Moderate" }
    },
    strengths: [{ fa: "انعطاف در بحران و توازن دو مرکز", en: "Crisis flexibility and balance between two centres" }],
    risks: [{ fa: "ابهام مسئولیت و کشمکش صلاحیت", en: "Diffuse responsibility and jurisdictional conflict" }],
    safeguardsNeeded: [{ fa: "تفکیک صریح صلاحیت‌ها و داوری مستقل", en: "Explicit competence allocation and independent arbitration" }],
    historicalExamples: { fa: "نمونه‌های تطبیقی در اروپا و آسیا", en: "Comparative examples in Europe and Asia" },
    epistemicStatus: "hypothetical"
  },
  {
    id: "MODEL-DECENTRALIZED",
    name: { fa: "نظام غیرمتمرکز / فدرال", en: "Decentralized / Federal System" },
    summary: {
      fa: "اختیارات میان مرکز و واحدهای سرزمینی تقسیم می‌شود و قانون اساسی سهم هر سطح را تعیین می‌کند.",
      en: "Powers are divided between centre and territorial units, with the constitution allocating each level's share."
    },
    traits: {
      executiveSelection: { fa: "چند‌سطحی", en: "Multi-level" },
      accountability: { fa: "نزدیک‌تر به شهروند", en: "Closer to the citizen" },
      stability: { fa: "بالا با قواعد روشن", en: "High with clear rules" },
      minorityProtection: { fa: "بالا در سطح محلی", en: "High at the local level" }
    },
    strengths: [{ fa: "کاهش تمرکز و تنوع‌پذیری محلی", en: "Less concentration and local adaptability" }],
    risks: [{ fa: "نابرابری منطقه‌ای و تکه‌تکه شدن استانداردها", en: "Regional inequality and fragmented standards" }],
    safeguardsNeeded: [{ fa: "حداقل استانداردهای ملی و سازوکار تسویهٔ مالی", en: "National minimum standards and fiscal equalization" }],
    historicalExamples: { fa: "نمونه‌های تطبیقی فدرال", en: "Comparative federal examples" },
    epistemicStatus: "hypothetical"
  }
]);

export const safeguardParameters = Object.freeze([
  {
    id: "EMERGENCY-SUNSET-DAYS",
    label: { fa: "سقف مدت اختیار اضطراری", en: "Emergency Power Sunset Ceiling" },
    unit: { fa: "روز", en: "days" },
    min: 15,
    max: 540,
    defaultValue: 180,
    effect: {
      fa: "کاهش این مقدار، عمر اختیارات اضطراری را کوتاه و نیاز به بازتصویب را بیشتر می‌کند.",
      en: "Lowering this shortens emergency authority and requires more re-authorization."
    }
  },
  {
    id: "REVIEW-INTERVAL-DAYS",
    label: { fa: "فاصلهٔ بازبینی مستقل", en: "Independent Review Interval" },
    unit: { fa: "روز", en: "days" },
    min: 7,
    max: 365,
    defaultValue: 90,
    effect: {
      fa: "کوتاه‌تر شدن فاصله، شفافیت را افزایش و سرعت تصمیم را کاهش می‌دهد.",
      en: "Shorter intervals increase transparency and slow decision speed."
    }
  },
  {
    id: "SUPERMAJORITY-THRESHOLD",
    label: { fa: "آستانهٔ اکثریت لازم", en: "Required Supermajority Threshold" },
    unit: { fa: "درصد", en: "percent" },
    min: 50,
    max: 90,
    defaultValue: 66,
    effect: {
      fa: "آستانهٔ بالاتر حفاظت از اقلیت را بیشتر و سرعت تصویب را کمتر می‌کند.",
      en: "A higher threshold strengthens minority protection and slows adoption."
    }
  },
  {
    id: "DECENTRALIZATION-SHARE",
    label: { fa: "سهم اختیارات واگذارشده به سطوح محلی", en: "Share of Authority Delegated to Local Levels" },
    unit: { fa: "درصد", en: "percent" },
    min: 0,
    max: 80,
    defaultValue: 35,
    effect: {
      fa: "افزایش سهم محلی، پاسخگویی را نزدیک‌تر و هماهنگی ملی را سخت‌تر می‌کند.",
      en: "More local authority brings accountability closer and complicates national coordination."
    }
  }
]);

export const digitalLegacyClauses = Object.freeze([
  {
    id: "P20-C1",
    clauseNumber: 1,
    title: { fa: "حق آگاهی", en: "Right to Awareness" },
    summary: {
      fa: "هر انسان حق دارد بداند چه داده‌ای دربارهٔ او نگهداری می‌شود و از کدام منبع آمده است.",
      en: "Every person may know what data about them is held and which source it came from."
    },
    consentRequirement: { fa: "برای پروندهٔ زندهٔ فرد، رضایت صریح او الزامی است.", en: "For a living person's dossier, their explicit consent is required." },
    revocationRule: { fa: "درخواست آگاهی هرگز قابل رد نیست.", en: "An awareness request can never be refused." },
    ethicalLegalRisk: { fa: "خطر افشای داده‌های دیگران در پاسخ به درخواست آگاهی.", en: "Risk of exposing third-party data when answering an awareness request." },
    prohibitedInPrototype: { fa: "هیچ پروندهٔ فرد زنده‌ای در این نمونه وجود ندارد.", en: "No living-person dossier exists in this prototype." },
    epistemicStatus: "source-reported"
  },
  {
    id: "P20-C2",
    clauseNumber: 2,
    title: { fa: "حق اصلاح", en: "Right to Correction" },
    summary: {
      fa: "دادهٔ نادرست باید قابل اصلاح باشد و تاریخچهٔ اصلاح حفظ شود.",
      en: "Incorrect data must be correctable, with the correction history preserved."
    },
    consentRequirement: { fa: "اصلاح به درخواست صاحب پرونده یا نمایندهٔ قانونی او.", en: "Correction at the request of the dossier subject or their lawful representative." },
    revocationRule: { fa: "اصلاح پیشین حذف نمی‌شود؛ نسخهٔ تازه ثبت می‌گردد.", en: "Prior corrections are not deleted; a new version is recorded." },
    ethicalLegalRisk: { fa: "خطر بازنویسی تاریخ به‌نفع قدرت.", en: "Risk of history being rewritten in favour of power." },
    prohibitedInPrototype: { fa: "فقط تاریخچهٔ اصلاح پرونده‌های ساختگی نمایش داده می‌شود.", en: "Only correction history for synthetic dossiers is shown." },
    epistemicStatus: "source-reported"
  },
  {
    id: "P20-C3",
    clauseNumber: 3,
    title: { fa: "حق محدودسازی", en: "Right to Restriction" },
    summary: {
      fa: "صاحب پرونده می‌تواند دامنهٔ استفاده از دادهٔ خود را محدود کند.",
      en: "The subject may restrict the scope of use of their own data."
    },
    consentRequirement: { fa: "هر استفادهٔ تازه نیازمند اجازهٔ جداگانه است.", en: "Each new use requires separate permission." },
    revocationRule: { fa: "محدودسازی بی‌درنگ اعمال می‌شود.", en: "Restriction applies without delay." },
    ethicalLegalRisk: { fa: "خطر دور زدن محدودیت از طریق واسطه‌های ثالث.", en: "Risk of circumventing restrictions through third parties." },
    prohibitedInPrototype: { fa: "هیچ کنترل واقعی دسترسی وجود ندارد.", en: "No real access control exists." },
    epistemicStatus: "proposed"
  },
  {
    id: "P20-C4",
    clauseNumber: 4,
    title: { fa: "منع شبیه‌سازی صدا و چهره", en: "Ban on Voice and Likeness Simulation" },
    summary: {
      fa: "هیچ صدا، چهره یا رفتار فرد نباید بدون رضایت صریح و برای هیچ هدف سیاسی بازسازی شود.",
      en: "No person's voice, likeness, or behaviour may be reconstructed without explicit consent, for any political purpose."
    },
    consentRequirement: { fa: "در این نمونه هیچ رضایتی برای شبیه‌سازی پذیرفته نمی‌شود.", en: "No simulation consent is accepted in this prototype at all." },
    revocationRule: { fa: "رضایت (در صورت وجود در آینده) همیشه قابل بازپس‌گیری است.", en: "Consent (if ever allowed) is always revocable." },
    ethicalLegalRisk: { fa: "جعل عمیق، جعل هویت و دستکاری سیاسی پس از مرگ.", en: "Deepfakes, identity fraud, and posthumous political manipulation." },
    prohibitedInPrototype: { fa: "کاملاً ممنوع؛ هیچ کد تولید صدا یا تصویر وجود ندارد.", en: "Fully prohibited; no voice or image generation code exists." },
    epistemicStatus: "source-reported"
  },
  {
    id: "P20-C5",
    clauseNumber: 5,
    title: { fa: "منع عاملیت پس از مرگ", en: "Ban on Posthumous Agency" },
    summary: {
      fa: "هیچ فرد فوت‌شده‌ای نمی‌تواند رأی دهد، اظهارنظر سیاسی کند یا امضا نماید.",
      en: "No deceased person may vote, issue political statements, or sign on anyone's behalf."
    },
    consentRequirement: { fa: "رضایت پیش از مرگ نیز عاملیت پس از مرگ ایجاد نمی‌کند.", en: "Pre-death consent still creates no posthumous agency." },
    revocationRule: { fa: "وارثان نمی‌توانند عاملیت را احیا کنند.", en: "Heirs cannot revive agency." },
    ethicalLegalRisk: { fa: "سوءاستفاده از نام فرد برای مشروعیت‌بخشی.", en: "Using a person's name to manufacture legitimacy." },
    prohibitedInPrototype: { fa: "هیچ سازوکار عاملیتی وجود ندارد.", en: "No agency mechanism exists." },
    epistemicStatus: "source-reported"
  },
  {
    id: "P20-C6",
    clauseNumber: 6,
    title: { fa: "تفکیک از بایگانی تاریخی", en: "Separation from the Historical Archive" },
    summary: {
      fa: "پروندهٔ هستی زنده و بایگانی تاریخی فوت‌شدگان دو سامانهٔ جدا با اهداف و حاکمیت حقوقی متفاوت‌اند.",
      en: "Living existence dossiers and the deceased historical archive are two separate systems with different purposes and legal governance."
    },
    consentRequirement: { fa: "پروندهٔ زنده نیازمند رضایت؛ بایگانی نیازمند منبع و مجوز انتشار.", en: "A living dossier needs consent; the archive needs sources and publication rights." },
    revocationRule: { fa: "هیچ ادغامی بدون تصمیم حقوقی مستقل مجاز نیست.", en: "No merger is permitted without an independent legal decision." },
    ethicalLegalRisk: { fa: "خطر آمیختن دادهٔ زنده با روایت تاریخی و ایجاد سوءبرداشت.", en: "Risk of mixing living data with historical narrative and causing misreading." },
    prohibitedInPrototype: { fa: "دو بخش کاملاً جدا با مسیرهای جداگانه.", en: "Two fully separate sections with distinct routes." },
    epistemicStatus: "proposed"
  },
  {
    id: "P20-C7",
    clauseNumber: 7,
    title: { fa: "حاکمیت حقوقی و پاسخگویی", en: "Legal Governance and Accountability" },
    summary: {
      fa: "هر پردازش باید دارای پایهٔ حقوقی، مسیر شکایت و بازبین مستقل باشد.",
      en: "Every processing operation needs a legal basis, a complaint route, and an independent reviewer."
    },
    consentRequirement: { fa: "پایهٔ حقوقی و رضایت هر دو لازم است.", en: "Both legal basis and consent are required." },
    revocationRule: { fa: "شکایت باید ظرف مهلت مشخص بررسی شود.", en: "Complaints must be reviewed within a defined period." },
    ethicalLegalRisk: { fa: "خطر نبود مرجع رسیدگی در وضعیت گذار.", en: "Risk of no adjudicating authority during a transition." },
    prohibitedInPrototype: { fa: "هیچ سازوکار شکایت واقعی پیاده‌سازی نشده است.", en: "No real complaint mechanism is implemented." },
    epistemicStatus: "hypothetical"
  }
]);

export const digitalLegacyConsentMatrix = Object.freeze([
  {
    scenario: { fa: "شخص زنده پروندهٔ خود را می‌سازد", en: "A living person creates their own dossier" },
    allowed: true,
    note: { fa: "در این نمونه فنی پیاده‌سازی نشده؛ فقط در سطح طراحی.", en: "Not implemented in this prototype; design level only." }
  },
  {
    scenario: { fa: "بستگان پروندهٔ فرد فوت‌شده را برای آرشیو بسازند", en: "Relatives create a dossier for a deceased person for the archive" },
    allowed: "conditional",
    note: { fa: "تنها در بایگانی تاریخی، با منبع و مجوز انتشار و برچسب ساختگی تا زمان دروازهٔ انسانی.", en: "Historical archive only, with sources and publication rights, and synthetic labelling until the human gate passes." }
  },
  {
    scenario: { fa: "تولید صدای فرد فوت‌شده", en: "Generate a deceased person's voice" },
    allowed: false,
    note: { fa: "ممنوع مطلق؛ هیچ کد یا API تولید صدا وجود ندارد.", en: "Absolutely prohibited; no voice generation code or API exists." }
  },
  {
    scenario: { fa: "تولید تصویر یا ویدئوی شبیه‌سازی‌شده از فرد", en: "Generate a simulated image or video of a person" },
    allowed: false,
    note: { fa: "ممنوع مطلق.", en: "Absolutely prohibited." }
  },
  {
    scenario: { fa: "ثبت رأی یا اعلام موضع سیاسی به نام فرد فوت‌شده", en: "Cast a vote or issue a political statement for a deceased person" },
    allowed: false,
    note: { fa: "ممنوع مطلق؛ خارج از حدود اختیار CEP.", en: "Absolutely prohibited; outside CEP's competence." }
  },
  {
    scenario: { fa: "بارگذاری آرشیو شخصی، پیام یا دادهٔ زیستی توسط وارثان", en: "Upload personal archives, messages, or biometric data by heirs" },
    allowed: false,
    note: { fa: "در این نمونه هیچ ورودی دادهٔ شخصی پذیرفته نمی‌شود.", en: "No personal data input is accepted in this prototype." }
  },
  {
    scenario: { fa: "بازپس‌گیری رضایت (در مدل آیندهٔ پیشنهادی)", en: "Revoke consent (in the proposed future model)" },
    allowed: true,
    note: { fa: "در مدل پیشنهادی همیشه ممکن است؛ در نمونه فعلی چیزی برای بازپس‌گیری وجود ندارد.", en: "Always possible in the proposed model; in this prototype there is nothing to revoke." }
  }
]);
