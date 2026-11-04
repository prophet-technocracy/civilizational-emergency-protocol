// Department C — Iran Transition Architecture
// Transition horizons, institutional directory, dependency map, public service directory.
// Every entry is proposed / hypothetical / unverified. Nothing here is operational.

export const transitionHorizons = Object.freeze([
  {
    id: "EMERGENCY-180D",
    key: "emergency-180d",
    title: { fa: "فاز اضطراری ۱۸۰ روزه", en: "180-Day Emergency Phase" },
    durationLabel: { fa: "حدود ۶ ماه", en: "Roughly 6 months" },
    framing: {
      fa: "دورهٔ کوتاه تثبیت حداقلی: بازگرداندن کارکردهای پایه، جلوگیری از فروپاشی خدمات و ایجاد امکان گفت‌وگوی عمومی. این دوره جایگزین قانون اساسی دائمی نیست.",
      en: "A short stabilization window: restore basic functions, prevent service collapse, and make public deliberation possible. It is not a substitute for a permanent constitution."
    },
    epistemicStatus: "proposed",
    sourceRef: "CLM-013"
  },
  {
    id: "TRANSITION-23Y",
    key: "transition-2-3y",
    title: { fa: "افق گذار ۲ تا ۳ ساله", en: "2–3 Year Transition Horizon" },
    durationLabel: { fa: "۲۴ تا ۳۶ ماه (برآورد تحلیلی)", en: "24–36 months (analytical estimate)" },
    framing: {
      fa: "دورهٔ تدوین و تصویب چارچوب دائمی، بازسازی نهادهای نظارتی و انتقال تدریجی اختیارات. بازهٔ زمانی یک برآورد تحلیلی است، نه تعهد یا پیش‌بینی قطعی.",
      en: "A period for drafting and adopting a permanent framework, rebuilding oversight institutions, and phased transfer of authority. The duration is an analytical estimate, not a commitment or forecast."
    },
    epistemicStatus: "hypothetical",
    sourceRef: "CLM-013"
  },
  {
    id: "CONSTITUTIONAL-LONGTERM",
    key: "constitutional-longterm",
    title: { fa: "افق بلندمدت نهادی", en: "Long-Term Institutional Horizon" },
    durationLabel: { fa: "پس از تصویب چارچوب دائمی", en: "After adopting a permanent framework" },
    framing: {
      fa: "تثبیت رویه‌ها، بازبینی دوره‌ای، و انتقال از «وضعیت گذار» به «نظم عادی» با سازوکارهای عادی قانون‌گذاری و نظارت.",
      en: "Consolidating practices, periodic review, and moving from 'transition status' to 'ordinary order' with normal legislative and oversight mechanisms."
    },
    epistemicStatus: "proposed",
    sourceRef: "CLM-013"
  }
]);

export const transitionStages = Object.freeze([
  {
    id: "STG-01",
    horizonKey: "emergency-180d",
    orderIndex: 1,
    title: { fa: "تثبیت خدمات پایه", en: "Stabilize Basic Services" },
    summary: {
      fa: "حفظ کارکرد آب، برق، بهداشت و ارتباطات با مدیریت موقت و انتشار عمومی وضعیت هر بخش.",
      en: "Maintain water, power, health, and communications under interim management with public status reporting for each sector."
    },
    sectorKey: "services",
    dependencies: [],
    responsibleInstitutions: ["INTERIM-SERVICE-COORDINATION"],
    milestones: [
      { fa: "گزارش عمومی وضعیت بخش‌ها", en: "Public sector status report" },
      { fa: "تعیین متولی موقت هر سرویس", en: "Interim custodian for each service" }
    ],
    uncertainty: {
      fa: "بالا — هیچ‌یک از این گام‌ها اجرا نشده و صرفاً طراحی است.",
      en: "High — none of these steps has been executed; this is design only."
    },
    epistemicStatus: "proposed",
    sourceRefs: ["CLM-013"]
  },
  {
    id: "STG-02",
    horizonKey: "emergency-180d",
    orderIndex: 2,
    title: { fa: "منع بازداشت خودسرانه و حفاظت از جان", en: "Prevent Arbitrary Detention and Protect Life" },
    summary: {
      fa: "اعلام فوری ممنوعیت بازداشت بدون حکم قابل بازبینی و ایجاد مسیر ثبت و پیگیری موارد.",
      en: "Immediately prohibit detention without reviewable order and create a route to record and follow up cases."
    },
    sectorKey: "rights",
    dependencies: ["STG-01"],
    responsibleInstitutions: ["INTERIM-LEGAL-PROTECTION", "INDEPENDENT-AUDIT-OFFICE"],
    milestones: [
      { fa: "انتشار عمومی فهرست اقدامات ممنوع", en: "Publish the list of prohibited actions" },
      { fa: "مسیر ثبت شکایت با حداقل داده", en: "Minimum-data complaint route" }
    ],
    uncertainty: {
      fa: "بسیار بالا — امکان‌سنجی حقوقی و اجرایی تأیید نشده است.",
      en: "Very high — legal and practical feasibility is unverified."
    },
    epistemicStatus: "proposed",
    sourceRefs: ["CLM-001", "CLM-013"]
  },
  {
    id: "STG-03",
    horizonKey: "emergency-180d",
    orderIndex: 3,
    title: { fa: "آزادی زندانیان سیاسی و رفع محدودیت رسانه", en: "Release Political Prisoners and Lift Media Restrictions" },
    summary: {
      fa: "بازبینی پرونده‌های مبتنی بر عقیده و بازگرداندن دسترسی آزاد به اطلاعات و اینترنت.",
      en: "Review opinion-based cases and restore open access to information and the internet."
    },
    sectorKey: "rights",
    dependencies: ["STG-02"],
    responsibleInstitutions: ["INTERIM-LEGAL-PROTECTION"],
    milestones: [
      { fa: "فهرست عمومی پرونده‌های بازبینی‌شده (بدون دادهٔ شخصی)", en: "Public list of reviewed cases (no personal data)" }
    ],
    uncertainty: {
      fa: "بالا — نیازمند همکاری نهادهای قضایی موجود است.",
      en: "High — requires cooperation from existing judicial bodies."
    },
    epistemicStatus: "proposed",
    sourceRefs: ["CLM-013"]
  },
  {
    id: "STG-04",
    horizonKey: "emergency-180d",
    orderIndex: 4,
    title: { fa: "شفاف‌سازی دارایی‌های عمومی", en: "Disclose Public Assets" },
    summary: {
      fa: "انتشار فهرست دارایی‌های عمومی، شرکت‌های تحت کنترل نهادهای قدرت و قراردادهای بزرگ.",
      en: "Publish public assets, entities controlled by power institutions, and major contracts."
    },
    sectorKey: "economy",
    dependencies: ["STG-01"],
    responsibleInstitutions: ["INDEPENDENT-AUDIT-OFFICE", "INTERIM-SERVICE-COORDINATION"],
    milestones: [
      { fa: "ثبت اولیهٔ دارایی‌ها با منبع", en: "Initial asset register with sources" }
    ],
    uncertainty: {
      fa: "متوسط — داده‌ها پراکنده و کیفیت آن‌ها نامعلوم است.",
      en: "Moderate — data is scattered and its quality unknown."
    },
    epistemicStatus: "proposed",
    sourceRefs: ["CLM-013"]
  },
  {
    id: "STG-05",
    horizonKey: "emergency-180d",
    orderIndex: 5,
    title: { fa: "گفت‌وگوی عمومی و انتشار پیش‌نویس چارچوب", en: "Public Deliberation and Draft Framework Publication" },
    summary: {
      fa: "انتشار عمومی پیش‌نویس چارچوب دائمی و سازوکار دریافت نظر، بدون ادعای همه‌پرسی.",
      en: "Publish the draft permanent framework and a feedback mechanism, without claiming a referendum."
    },
    sectorKey: "governance",
    dependencies: ["STG-02", "STG-03"],
    responsibleInstitutions: ["DELIBERATIVE-ASSEMBLY", "PRINCIPLE-GUARDIAN"],
    milestones: [
      { fa: "انتشار پیش‌نویس دو‌زبانه", en: "Bilingual draft publication" },
      { fa: "گزارش عمومی بازخوردها", en: "Public feedback report" }
    ],
    uncertainty: {
      fa: "بالا — سازوکار دریافت نظر هنوز طراحی نشده است.",
      en: "High — the feedback mechanism is not yet designed."
    },
    epistemicStatus: "proposed",
    sourceRefs: ["CLM-013", "CLM-010"]
  },
  {
    id: "STG-06",
    horizonKey: "transition-2-3y",
    orderIndex: 6,
    title: { fa: "تدوین چارچوب دائمی و تضمین تفکیک کارکردها", en: "Draft Permanent Framework with Separation of Functions" },
    summary: {
      fa: "تدوین متن نهایی چارچوب با تفکیک روشن کارکردها و شرط خاتمه برای همهٔ اختیارات.",
      en: "Finalize the framework with clear separation of functions and sunset clauses for all authorities."
    },
    sectorKey: "governance",
    dependencies: ["STG-05"],
    responsibleInstitutions: ["DELIBERATIVE-ASSEMBLY", "CONSTITUTIONAL-CHAMBER", "PRINCIPLE-GUARDIAN"],
    milestones: [
      { fa: "متن نهایی دو‌زبانه", en: "Final bilingual text" },
      { fa: "بازبینی مستقل حقوقی", en: "Independent legal review" }
    ],
    uncertainty: {
      fa: "بالا — فرایند تصویب و مشروعیت‌سنجی هنوز تعریف نشده است.",
      en: "High — the adoption and legitimacy process is undefined."
    },
    epistemicStatus: "proposed",
    sourceRefs: ["CLM-013", "CLM-003"]
  },
  {
    id: "STG-07",
    horizonKey: "transition-2-3y",
    orderIndex: 7,
    title: { fa: "بازسازی نهادهای نظارتی", en: "Rebuild Oversight Institutions" },
    summary: {
      fa: "ایجاد نهادهای حسابرسی، بازبینی قضایی و بازبینی مستقل با اختیارات و بودجهٔ شفاف.",
      en: "Establish audit, judicial review, and independent review bodies with transparent mandates and budgets."
    },
    sectorKey: "governance",
    dependencies: ["STG-06"],
    responsibleInstitutions: ["INDEPENDENT-AUDIT-OFFICE", "CONSTITUTIONAL-CHAMBER"],
    milestones: [
      { fa: "اساسنامهٔ نهاد حسابرسی", en: "Audit institution charter" }
    ],
    uncertainty: {
      fa: "متوسط — نیازمند نیروی انسانی متخصص و مستقل است.",
      en: "Moderate — requires independent specialist capacity."
    },
    epistemicStatus: "proposed",
    sourceRefs: ["CLM-003"]
  },
  {
    id: "STG-08",
    horizonKey: "transition-2-3y",
    orderIndex: 8,
    title: { fa: "اصلاح نظام قضایی و دسترسی به عدالت", en: "Judicial Reform and Access to Justice" },
    summary: {
      fa: "بازبینی ساختار قضایی، استقلال قاضی، و ایجاد مسیر دسترسی برابر به دادخواهی.",
      en: "Review judicial structure, judicial independence, and equal access to remedy."
    },
    sectorKey: "rights",
    dependencies: ["STG-07"],
    responsibleInstitutions: ["CONSTITUTIONAL-CHAMBER"],
    milestones: [
      { fa: "گزارش عمومی استقلال قضایی", en: "Public judicial independence report" }
    ],
    uncertainty: {
      fa: "بسیار بالا — سنجه‌های استقلال قضایی مورد اختلاف است.",
      en: "Very high — judicial independence metrics are contested."
    },
    epistemicStatus: "disputed",
    sourceRefs: ["CLM-013"]
  },
  {
    id: "STG-09",
    horizonKey: "transition-2-3y",
    orderIndex: 9,
    title: { fa: "اقتصاد شفاف و بازسازی خدمات عمومی", en: "Transparent Economy and Public Service Rebuilding" },
    summary: {
      fa: "بودجه‌ریزی شفاف، انتشار قراردادها و بازسازی خدمات شهری و روستایی.",
      en: "Transparent budgeting, publication of contracts, and rebuilding urban and rural services."
    },
    sectorKey: "economy",
    dependencies: ["STG-04", "STG-07"],
    responsibleInstitutions: ["INTERIM-SERVICE-COORDINATION", "INDEPENDENT-AUDIT-OFFICE"],
    milestones: [
      { fa: "بودجهٔ عمومی قابل بازبینی", en: "Reviewable public budget" }
    ],
    uncertainty: {
      fa: "بالا — وضعیت اقتصادی و تحریم‌ها نامعلوم است.",
      en: "High — the economic and sanctions situation is unknown."
    },
    epistemicStatus: "hypothetical",
    sourceRefs: ["CLM-013"]
  },
  {
    id: "STG-10",
    horizonKey: "constitutional-longterm",
    orderIndex: 10,
    title: { fa: "تثبیت نظم عادی و بازبینی دوره‌ای", en: "Consolidate Ordinary Order and Periodic Review" },
    summary: {
      fa: "انتقال به سازوکارهای عادی قانون‌گذاری، پایان وضعیت گذار و بازبینی دوره‌ای اصول.",
      en: "Move to ordinary legislative mechanisms, end transition status, and review principles periodically."
    },
    sectorKey: "governance",
    dependencies: ["STG-06", "STG-08", "STG-09"],
    responsibleInstitutions: ["DELIBERATIVE-ASSEMBLY", "PRINCIPLE-GUARDIAN"],
    milestones: [
      { fa: "اعلام پایان وضعیت گذار", en: "Declare the end of transition status" }
    ],
    uncertainty: {
      fa: "بسیار بالا — تعریف «پایان گذار» خودش محل اختلاف است.",
      en: "Very high — the definition of 'end of transition' is itself contested."
    },
    epistemicStatus: "hypothetical",
    sourceRefs: ["CLM-013"]
  }
]);

export const institutions = Object.freeze([
  {
    id: "PRINCIPLE-GUARDIAN",
    name: { fa: "نگهبان اصول", en: "Principle Guardian Council" },
    category: "principles-oversight",
    purpose: {
      fa: "پاسداری از اصول غیرقابل مذاکره و بررسی انطباق قواعد با آن‌ها.",
      en: "Guard non-negotiable principles and test rules for consistency with them."
    },
    basis: {
      fa: "پیشنهادی — هیچ سند حقوقی لازم‌الاجرایی وجود ندارد.",
      en: "Proposed — no enforceable legal instrument exists."
    },
    responsibilities: [
      { fa: "بازبینی انطباق با اصول", en: "Review consistency with principles" },
      { fa: "انتشار عمومی نظر مشورتی", en: "Publish advisory opinions" }
    ],
    dependsOn: [],
    oversight: [{ fa: "بازبینی مستقل بیرونی و شفافیت کامل", en: "External independent review and full transparency" }],
    accountability: [{ fa: "انتشار نظر و امکان اعتراض عمومی", en: "Publication of opinions and a public objection route" }],
    sunset: { fa: "بازبینی دوره‌ای هر ۵ سال (پیشنهادی)", en: "Periodic review every 5 years (proposed)" },
    epistemicStatus: "proposed",
    sourceRefs: ["CLM-003"],
    isOperational: false
  },
  {
    id: "DELIBERATIVE-ASSEMBLY",
    name: { fa: "مجلس گفت‌وگوی عمومی", en: "Deliberative Assembly" },
    category: "legislative",
    purpose: {
      fa: "تدوین قواعد عمومی با انتشار کامل متن، مذاکرات و ثبت شفاف آرا.",
      en: "Draft general rules with full publication of text, deliberations, and transparent vote records."
    },
    basis: { fa: "پیشنهادی — سازوکار انتخاب و مشروعیت‌سنجی تعریف نشده است.", en: "Proposed — the selection and legitimacy mechanism is undefined." },
    responsibilities: [
      { fa: "تدوین قوانین", en: "Draft legislation" },
      { fa: "نظارت بر اجرا", en: "Oversee execution" },
      { fa: "تصویب بودجه", en: "Adopt the budget" }
    ],
    dependsOn: ["PRINCIPLE-GUARDIAN"],
    oversight: [{ fa: "بازبینی قضایی و حسابرسی مستقل", en: "Judicial review and independent audit" }],
    accountability: [{ fa: "انتشار کامل مذاکرات و آرا", en: "Full publication of deliberations and votes" }],
    sunset: { fa: "دوره‌های انتخاباتی مشخص با سقف دوره (پیشنهادی)", en: "Fixed electoral terms with term limits (proposed)" },
    epistemicStatus: "proposed",
    sourceRefs: ["CLM-003"],
    isOperational: false
  },
  {
    id: "INTERIM-SERVICE-COORDINATION",
    name: { fa: "هماهنگی موقت خدمات", en: "Interim Service Coordination" },
    category: "executive-interim",
    purpose: {
      fa: "حفظ کارکرد پایهٔ خدمات در فاز اضطراری با اختیارات محدود و زمان‌دار.",
      en: "Maintain basic service function during the emergency phase under bounded, time-limited authority."
    },
    basis: { fa: "پیشنهادی و موقت — بدون اختیار قانون‌گذاری.", en: "Proposed and temporary — no legislative authority." },
    responsibilities: [
      { fa: "هماهنگی آب، برق، بهداشت", en: "Coordinate water, power, health" },
      { fa: "گزارش عمومی روزانه", en: "Daily public reporting" }
    ],
    dependsOn: [],
    oversight: ["INDEPENDENT-AUDIT-OFFICE", "DELIBERATIVE-ASSEMBLY"],
    accountability: [{ fa: "گزارش اجباری و پایان خودکار اختیارات", en: "Mandatory reporting and automatic expiry of authority" }],
    sunset: { fa: "۱۸۰ روز با تمدید صریح و محدود", en: "180 days with explicit, bounded renewal" },
    epistemicStatus: "proposed",
    sourceRefs: ["CLM-013"],
    isOperational: false
  },
  {
    id: "INTERIM-LEGAL-PROTECTION",
    name: { fa: "حفاظت حقوقی موقت", en: "Interim Legal Protection" },
    category: "rights-protection",
    purpose: {
      fa: "ثبت و پیگیری موارد نقض حقوق پایه و ایجاد مسیر دادخواهی حداقلی.",
      en: "Record and follow up basic-rights violations and provide a minimum remedy route."
    },
    basis: { fa: "پیشنهادی — نیازمند همکاری نهادهای موجود.", en: "Proposed — requires cooperation from existing bodies." },
    responsibilities: [
      { fa: "ثبت موارد نقض", en: "Record violations" },
      { fa: "پیگیری دادخواهی", en: "Follow up remedy" }
    ],
    dependsOn: [],
    oversight: ["INDEPENDENT-AUDIT-OFFICE"],
    accountability: [{ fa: "گزارش عمومی تجمیعی بدون دادهٔ شخصی", en: "Aggregate public reporting without personal data" }],
    sunset: { fa: "تا استقرار نظام قضایی عادی", en: "Until the ordinary judicial system is established" },
    epistemicStatus: "proposed",
    sourceRefs: ["CLM-013"],
    isOperational: false
  },
  {
    id: "CONSTITUTIONAL-CHAMBER",
    name: { fa: "اتاق بازبینی قانون اساسی", en: "Constitutional Review Chamber" },
    category: "judicial-review",
    purpose: {
      fa: "بررسی انطباق اقدامات با چارچوب و اعلام بطلان اقدام خارج از صلاحیت.",
      en: "Test acts against the framework and void acts beyond competence."
    },
    basis: { fa: "پیشنهادی.", en: "Proposed." },
    responsibilities: [
      { fa: "بازبینی انطباق", en: "Consistency review" },
      { fa: "رسیدگی به اختلاف صلاحیت", en: "Adjudicate competence disputes" }
    ],
    dependsOn: ["PRINCIPLE-GUARDIAN"],
    oversight: [{ fa: "بازبینی مستقل و انتشار کامل آرا", en: "Independent review and full publication of rulings" }],
    accountability: [{ fa: "انتشار استدلال کامل هر رأی", en: "Publish full reasoning for every ruling" }],
    sunset: { fa: "دائمی با بازبینی رویه (پیشنهادی)", en: "Permanent with practice review (proposed)" },
    epistemicStatus: "proposed",
    sourceRefs: ["CLM-003"],
    isOperational: false
  },
  {
    id: "INDEPENDENT-AUDIT-OFFICE",
    name: { fa: "دفتر حسابرسی مستقل", en: "Independent Audit Office" },
    category: "audit",
    purpose: {
      fa: "حسابرسی مالی، فنی و حقوقی مستقل و انتشار عمومی یافته‌ها.",
      en: "Independent financial, technical, and legal audit with public findings."
    },
    basis: { fa: "پیشنهادی.", en: "Proposed." },
    responsibilities: [
      { fa: "حسابرسی مالی", en: "Financial audit" },
      { fa: "حسابرسی فنی و امنیتی", en: "Technical and security audit" }
    ],
    dependsOn: [],
    oversight: [{ fa: "بازبینی بیرونی همتایان", en: "External peer review" }],
    accountability: [{ fa: "انتشار کامل یافته‌ها و روش کار", en: "Publish findings and methodology in full" }],
    sunset: { fa: "دائمی با چرخش دوره‌ای رهبری", en: "Permanent with rotating leadership" },
    epistemicStatus: "proposed",
    sourceRefs: ["CLM-003"],
    isOperational: false
  },
  {
    id: "PUBLIC-SERVICE-DIRECTORY",
    name: { fa: "راهنمای خدمات عمومی (این سامانه)", en: "Public Service Directory (this system)" },
    category: "information",
    purpose: {
      fa: "فهرست کردن پیوندهای عمومی منتشرشده و توضیح آن‌ها، بدون ادعای یکپارچگی فنی.",
      en: "List and describe published public links, with no claim of technical integration."
    },
    basis: { fa: "نمونهٔ نمایشی محلی؛ فهرست دامنه‌ها تأییدنشده است.", en: "Local demonstrator; the domain list is unverified." },
    responsibilities: [{ fa: "نمایش برچسب وضعیت هر ورودی", en: "Display a status label for each entry" }],
    dependsOn: [],
    oversight: ["INDEPENDENT-AUDIT-OFFICE"],
    accountability: [{ fa: "هشدار صریح دربارهٔ تأییدنشده بودن", en: "Explicit notice that entries are unverified" }],
    sunset: { fa: "بازبینی هنگام هر تغییر دامنه", en: "Review on any domain change" },
    epistemicStatus: "unverified",
    sourceRefs: ["CLM-005", "CLM-012"],
    isOperational: false
  }
]);

export const institutionalRelationships = Object.freeze([
  { id: "REL-01", from: "DELIBERATIVE-ASSEMBLY", to: "INTERIM-SERVICE-COORDINATION", type: "oversight", label: { fa: "نظارت و پاسخگویی", en: "Oversight and accountability" }, epistemicStatus: "proposed" },
  { id: "REL-02", from: "INDEPENDENT-AUDIT-OFFICE", to: "INTERIM-SERVICE-COORDINATION", type: "audit", label: { fa: "حسابرسی مستقل", en: "Independent audit" }, epistemicStatus: "proposed" },
  { id: "REL-03", from: "CONSTITUTIONAL-CHAMBER", to: "DELIBERATIVE-ASSEMBLY", type: "judicial-review", label: { fa: "بازبینی انطباق", en: "Consistency review" }, epistemicStatus: "proposed" },
  { id: "REL-04", from: "PRINCIPLE-GUARDIAN", to: "CONSTITUTIONAL-CHAMBER", type: "reference", label: { fa: "مرجع اصول", en: "Principles reference" }, epistemicStatus: "proposed" },
  { id: "REL-05", from: "PRINCIPLE-GUARDIAN", to: "DELIBERATIVE-ASSEMBLY", type: "reference", label: { fa: "بازبینی پیش از تصویب", en: "Pre-adoption review" }, epistemicStatus: "proposed" },
  { id: "REL-06", from: "INDEPENDENT-AUDIT-OFFICE", to: "INTERIM-LEGAL-PROTECTION", type: "audit", label: { fa: "حسابرسی رعایت حقوق", en: "Rights-compliance audit" }, epistemicStatus: "proposed" },
  { id: "REL-07", from: "PUBLIC-SERVICE-DIRECTORY", to: "INTERIM-SERVICE-COORDINATION", type: "information", label: { fa: "ارجاع اطلاعاتی (بدون یکپارچگی)", en: "Information reference (no integration)" }, epistemicStatus: "unverified" },
  { id: "REL-08", from: "DELIBERATIVE-ASSEMBLY", to: "CONSTITUTIONAL-CHAMBER", type: "appointment-limit", label: { fa: "منع انتصاب متقابل", en: "Mutual appointment ban" }, epistemicStatus: "proposed" }
]);

export const publicServices = Object.freeze([
  {
    id: "SVC-01",
    title: { fa: "درگاه خدمات الکترونیک دولت", en: "Government E-Services Portal" },
    category: "identity-and-records",
    description: {
      fa: "درگاه عمومی برای برخی خدمات اداری. ورودی نمونه؛ مالکیت دامنه و صحت آن تأیید نشده است.",
      en: "A public portal for some administrative services. Sample entry; domain ownership and accuracy are unverified."
    },
    url: "https://my.gov.ir",
    urlStatus: "unverified",
    lastChecked: null,
    integrationClaim: false,
    dataRequested: { fa: "هیچ — این سامانه هیچ داده‌ای به آن ارسال نمی‌کند.", en: "None — this system sends no data to it." },
    cautions: [
      { fa: "پیش از استفاده، آدرس رسمی را از منبع مستقل تأیید کنید.", en: "Confirm the official address from an independent source before use." },
      { fa: "هرگز کد ملی یا رمز یک‌بارمصرف را در سامانه‌های ناشناس وارد نکنید.", en: "Never enter a national ID or one-time code into an unknown system." }
    ],
    epistemicStatus: "unverified"
  },
  {
    id: "SVC-02",
    title: { fa: "سامانهٔ مالیات", en: "Tax Administration System" },
    category: "tax",
    description: {
      fa: "ورودی نمونه برای خدمات مالیاتی. هیچ کاوش زنده یا آزمون API انجام نشده است.",
      en: "Sample entry for tax services. No live probing or API testing was performed."
    },
    url: "https://tax.gov.ir",
    urlStatus: "unverified",
    lastChecked: null,
    integrationClaim: false,
    dataRequested: { fa: "هیچ.", en: "None." },
    cautions: [{ fa: "پیش از ورود اطلاعات مالی، اصالت دامنه را بررسی کنید.", en: "Verify the domain's authenticity before entering financial information." }],
    epistemicStatus: "unverified"
  },
  {
    id: "SVC-03",
    title: { fa: "خدمات بیمهٔ تأمین اجتماعی", en: "Social Security Insurance Services" },
    category: "social-insurance",
    description: {
      fa: "ورودی نمونه برای خدمات بیمه‌ای. وضعیت فعلی سامانه نامعلوم است.",
      en: "Sample entry for insurance services. Current system status is unknown."
    },
    url: "https://eservices.tamin.ir",
    urlStatus: "unverified",
    lastChecked: null,
    integrationClaim: false,
    dataRequested: { fa: "هیچ.", en: "None." },
    cautions: [{ fa: "شمارهٔ بیمه‌ای خود را تنها در درگاه تأییدشده وارد کنید.", en: "Enter your insurance number only on a verified portal." }],
    epistemicStatus: "unverified"
  },
  {
    id: "SVC-04",
    title: { fa: "آمار و اطلاعات کشاورزی", en: "Agricultural Statistics Portal" },
    category: "statistics",
    description: {
      fa: "ورودی نمونه برای آمار بخش کشاورزی. هیچ داده‌ای از آن استخراج یا بازنشر نشده است.",
      en: "Sample entry for agricultural statistics. No data was extracted or republished."
    },
    url: "https://amak.mrud.ir",
    urlStatus: "unverified",
    lastChecked: null,
    integrationClaim: false,
    dataRequested: { fa: "هیچ.", en: "None." },
    cautions: [{ fa: "کیفیت و نسخهٔ آمار تأیید نشده است.", en: "Statistical quality and edition are unverified." }],
    epistemicStatus: "unverified"
  },
  {
    id: "SVC-05",
    title: { fa: "شمارهٔ اضطراری ۱۱۵ (اورژانس)", en: "Emergency Number 115 (Ambulance)" },
    category: "emergency",
    description: {
      fa: "شمارهٔ تلفنی اضطراری عمومی. این ورودی پیوند اینترنتی نیست و در این سامانه هیچ تماسی برقرار نمی‌شود.",
      en: "A public emergency telephone number. This is not a web link and no call is placed by this system."
    },
    url: "tel:115",
    urlStatus: "public-telephone-number",
    lastChecked: null,
    integrationClaim: false,
    dataRequested: { fa: "هیچ.", en: "None." },
    cautions: [{ fa: "در شرایط اضطراری واقعی، از خط تلفن خود استفاده کنید.", en: "In a real emergency, use your own telephone line." }],
    epistemicStatus: "source-reported"
  }
]);

export const publicServiceSafetyBoundaries = Object.freeze([
  {
    id: "BND-01",
    text: {
      fa: "هیچ درگاه دولتی در جریان ساخت این نمونه به‌صورت زنده کاوش، آزمون یا ضبط نشده است.",
      en: "No government portal was live-probed, tested, or captured while building this prototype."
    },
    severity: "informational"
  },
  {
    id: "BND-02",
    text: {
      fa: "این فهرست هیچ API خصوصی، مسیر پنهان یا روش دور زدن احراز هویت را افشا نمی‌کند.",
      en: "This directory discloses no private API, hidden route, or authentication bypass."
    },
    severity: "informational"
  },
  {
    id: "BND-03",
    text: {
      fa: "هیچ ادعای یکپارچگی فنی، همکاری رسمی یا نمایندگی از سوی هیچ نهادی مطرح نمی‌شود.",
      en: "No technical integration, official partnership, or representation by any institution is claimed."
    },
    severity: "informational"
  },
  {
    id: "BND-04",
    text: {
      fa: "همهٔ ورودی‌ها باید پیش از انتشار واقعی با اجازهٔ صریح متولی راستی‌آزمایی شوند.",
      en: "Every entry must be verified with explicit custodian permission before any real publication."
    },
    severity: "gated"
  }
]);
