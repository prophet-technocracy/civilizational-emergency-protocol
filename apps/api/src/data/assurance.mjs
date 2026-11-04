// Department E — Five-Band Verification & Access Architecture
// Bands authorize individual ACTIONS on specific resources. They never rank people.

export const verificationBands = Object.freeze([
  {
    bandNumber: 1,
    id: "BAND-1",
    name: { fa: "سطح ۱ — دسترسی عمومی", en: "Band 1 — Public Access" },
    question: {
      fa: "آیا این اطلاعات عمومی است و می‌توان بدون شناسایی منتشر شود؟",
      en: "Is this information public and publishable without identifying anyone?"
    },
    minimumEvidence: { fa: "هیچ — بدون حساب، بدون کوکی، بدون شناسایی.", en: "None — no account, no cookie, no identification." },
    permittedActions: [
      { fa: "خواندن منشور و اسناد عمومی", en: "Reading the charter and public documents" },
      { fa: "جستجو در بایگانی ساختگی", en: "Searching the synthetic archive" },
      { fa: "مشاهدهٔ فهرست پیوندهای عمومی", en: "Viewing the public link list" }
    ],
    notImplied: { fa: "این سطح هیچ هویتی اثبات نمی‌کند و هیچ دسترسی ویژه‌ای نمی‌دهد.", en: "This band proves no identity and grants no privileged access." },
    safeguards: [{ fa: "بدون ردیابی، بدون اثر انگشت مرورگر، بدون ثبت IP.", en: "No tracking, no browser fingerprinting, no IP logging." }],
    isSimulated: false,
    realImplementation: { fa: "همین سامانه در همین سطح کار می‌کند (فقط خواندنی).", en: "This system operates at exactly this band (read-only)." },
    linkedClaims: ["CLM-003"]
  },
  {
    bandNumber: 2,
    id: "BAND-2",
    name: { fa: "سطح ۲ — نشست شبه‌ناشناس", en: "Band 2 — Pseudonymous Session" },
    question: {
      fa: "آیا کاربر می‌تواند بدون افشای هویت واقعی، نشستی پایدار داشته باشد؟",
      en: "Can a user hold a stable session without disclosing real identity?"
    },
    minimumEvidence: { fa: "یک کلید نشست (passkey) که با هیچ نام واقعی پیوند ندارد.", en: "One session key (passkey) linked to no real name." },
    permittedActions: [
      { fa: "ذخیرهٔ ترجیحات نمایشی در مرورگر", en: "Saving display preferences in the browser" },
      { fa: "پیگیری موضوعات مورد علاقه بدون افشای هویت", en: "Following topics without disclosing identity" }
    ],
    notImplied: { fa: "نشست شبه‌ناشناس، تابعیت، اقامت یا یکتایی شخص را اثبات نمی‌کند.", en: "A pseudonymous session proves no citizenship, residence, or unique personhood." },
    safeguards: [{ fa: "کلید نشست قابل حذف فوری و فاقد دادهٔ هویتی است.", en: "The session key is instantly deletable and carries no identity data." }],
    isSimulated: true,
    realImplementation: { fa: "هیچ سامانهٔ نشست واقعی در این نمونه مستقر نشده است.", en: "No real session system is deployed in this prototype." },
    linkedClaims: ["CLM-003", "CLM-011"]
  },
  {
    bandNumber: 3,
    id: "BAND-3",
    name: { fa: "سطح ۳ — گواهی ویژگی محدود", en: "Band 3 — Limited Attribute Proof" },
    question: {
      fa: "آیا برای یک کنش مشخص، فقط همان ویژگی لازم اثبات می‌شود؟",
      en: "For one specific action, is only the necessary attribute proven?"
    },
    minimumEvidence: { fa: "گواهی انتخابی از یک صادرکنندهٔ معتبر برای یک ویژگی خاص.", en: "A selective credential from a trusted issuer for one specific attribute." },
    permittedActions: [
      { fa: "ارسال نظر در گفت‌وگوی عمومی با گواهی عضویت", en: "Submitting a comment in public deliberation with a membership credential" },
      { fa: "دسترسی به اسناد پژوهشی محدود با گواهی نقش", en: "Accessing restricted research documents with a role credential" }
    ],
    notImplied: { fa: "گواهی ویژگی، هویت کامل، رتبهٔ اجتماعی یا حق رأی نمی‌دهد.", en: "An attribute credential grants no full identity, social rank, or voting right." },
    safeguards: [
      { fa: "افشای حداقلی: فقط «بله/خیر» ویژگی، نه مقدار خام.", en: "Minimal disclosure: only a yes/no attribute, never the raw value." },
      { fa: "هر گواهی هدف‌دار و دارای تاریخ انقضا است.", en: "Every credential is purpose-bound and expiring." }
    ],
    isSimulated: true,
    realImplementation: { fa: "هیچ صادرکنندهٔ گواهی واقعی وجود ندارد؛ فقط شبیه‌سازی.", en: "No real credential issuer exists; simulation only." },
    linkedClaims: ["CLM-003", "CLM-011"]
  },
  {
    bandNumber: 4,
    id: "BAND-4",
    name: { fa: "سطح ۴ — نقش سازمانی محدود", en: "Band 4 — Scoped Organizational Role" },
    question: {
      fa: "آیا کاربر نمایندهٔ یک نقش سازمانی مشخص و محدود است؟",
      en: "Is the user acting under a specific, bounded organizational role?"
    },
    minimumEvidence: { fa: "قرارداد نقش محدود با دامنهٔ روشن و مدت معین.", en: "A scoped role contract with a clear domain and fixed duration." },
    permittedActions: [
      { fa: "بازبینی یک پروندهٔ پیش‌نویس در حوزهٔ نقش", en: "Reviewing a draft dossier within the role's domain" },
      { fa: "ثبت نظر کارشناسی در سابقهٔ بازبینی", en: "Recording an expert opinion in the review record" }
    ],
    notImplied: { fa: "نقش سازمانی، دسترسی به پایگاه‌داده‌های خصوصی دیگران یا اختیار سیاسی نمی‌دهد.", en: "An organizational role grants no access to others' private databases or political authority." },
    safeguards: [
      { fa: "تفکیک وظایف: بازبین نباید سازندهٔ همان اثر باشد.", en: "Separation of duties: the reviewer must not be the author of the same work." },
      { fa: "هر کنش در گزارش الحاق‌گرا ثبت می‌شود.", en: "Every action is recorded in the append-oriented log." }
    ],
    isSimulated: true,
    realImplementation: { fa: "همهٔ نقش‌ها در این نمونه ساختگی و بدون اختیار واقعی‌اند.", en: "All roles in this prototype are synthetic and carry no real authority." },
    linkedClaims: ["CLM-003", "CLM-011"]
  },
  {
    bandNumber: 5,
    id: "BAND-5",
    name: { fa: "سطح ۵ — مدیریت سیستم با کنترل دوگانه", en: "Band 5 — System Administration with Dual Control" },
    question: {
      fa: "آیا یک کنش فنی پرخطر با کنترل دوگانه و نظارت مستقل انجام می‌شود؟",
      en: "Is a high-risk technical action carried out under dual control and independent oversight?"
    },
    minimumEvidence: { fa: "دو تأیید مستقل + نقش فنی محدود + بازبینی مستقل.", en: "Two independent approvals + a scoped technical role + independent review." },
    permittedActions: [
      { fa: "تغییر پیکربندی استقرار (در آینده و با تأیید دوگانه)", en: "Changing deployment configuration (future, with dual approval)" },
      { fa: "چرخش کلیدها با ثبت کامل", en: "Rotating keys with full recording" }
    ],
    notImplied: { fa: "حتی سطح ۵ هم اجازهٔ دسترسی به دادهٔ شخصی یا تغییر سابقه را نمی‌دهد.", en: "Even Band 5 grants no access to personal data or the ability to alter records." },
    safeguards: [
      { fa: "هیچ کنش سطح ۵ در این نمونه واقعاً اجرا نمی‌شود.", en: "No Band 5 action is actually executed in this prototype." },
      { fa: "کنترل دوگانه الزامی است و یک نفر نمی‌تواند تنها عمل کند.", en: "Dual control is mandatory; no single person can act alone." }
    ],
    isSimulated: true,
    realImplementation: { fa: "همهٔ کنش‌ها فقط شبیه‌سازی هستند.", en: "All actions are simulation only." },
    linkedClaims: ["CLM-003", "CLM-011"]
  }
]);

export const accessPolicies = Object.freeze([
  {
    actionId: "VIEW-PUBLIC-DOCS",
    title: { fa: "خواندن اسناد عمومی", en: "Reading public documents" },
    resource: "public-documents",
    minimumBand: 1,
    requiredProofs: [],
    purposeLimitation: { fa: "فقط خواندن؛ بدون جمع‌آوری داده.", en: "Read only; no data collection." },
    expiryPolicy: { fa: "نامحدود برای اطلاعات عمومی", en: "Unlimited for public information" },
    isConstitutionallyProhibited: false,
    category: "public",
    description: { fa: "سطح ۱ برای همه باز است و هیچ ورود یا حسابی لازم ندارد.", en: "Band 1 is open to all and needs no login or account." }
  },
  {
    actionId: "SEARCH-SYNTHETIC-ARCHIVE",
    title: { fa: "جستجو در بایگانی ساختگی", en: "Searching the synthetic archive" },
    resource: "synthetic-archive",
    minimumBand: 1,
    requiredProofs: [],
    purposeLimitation: { fa: "فقط پرونده‌های ساختگی و فوت‌شدگان.", en: "Synthetic and deceased records only." },
    expiryPolicy: { fa: "نامحدود", en: "Unlimited" },
    isConstitutionallyProhibited: false,
    category: "public",
    description: { fa: "جستجوی دوزبانه بدون هیچ شناسایی.", en: "Bilingual search with zero identification." }
  },
  {
    actionId: "SAVE-DISPLAY-PREFERENCES",
    title: { fa: "ذخیرهٔ ترجیحات نمایشی", en: "Saving display preferences" },
    resource: "local-browser-preferences",
    minimumBand: 2,
    requiredProofs: ["passkey_session"],
    purposeLimitation: { fa: "فقط روی مرورگر خود کاربر.", en: "Only in the user's own browser." },
    expiryPolicy: { fa: "تا حذف توسط کاربر", en: "Until the user deletes it" },
    isConstitutionallyProhibited: false,
    category: "session",
    description: { fa: "شبه‌ناشناس، بدون نام واقعی.", en: "Pseudonymous, with no real name." }
  },
  {
    actionId: "SUBMIT-PUBLIC-COMMENT",
    title: { fa: "ارسال نظر در گفت‌وگوی عمومی", en: "Submitting a comment in public deliberation" },
    resource: "deliberation-feedback",
    minimumBand: 3,
    requiredProofs: ["selective_credential"],
    purposeLimitation: { fa: "فقط برای یک فرایند مشورتی مشخص.", en: "For one specified consultation process only." },
    expiryPolicy: { fa: "پایان فرایند مشورتی", en: "End of the consultation process" },
    isConstitutionallyProhibited: false,
    category: "participation",
    description: { fa: "گواهی عضویت، نه هویت کامل و نه رأی.", en: "A membership credential, not full identity and not a vote." }
  },
  {
    actionId: "REVIEW-DRAFT-DOSSIER",
    title: { fa: "بازبینی پیش‌نویس پرونده", en: "Reviewing a draft dossier" },
    resource: "draft-dossiers",
    minimumBand: 4,
    requiredProofs: ["org_role_contract"],
    purposeLimitation: { fa: "فقط در حوزهٔ نقش و فقط نسخهٔ پیش‌نویس.", en: "Within the role's domain and draft versions only." },
    expiryPolicy: { fa: "پایان دورهٔ نقش (حداکثر ۹۰ روز)", en: "End of the role term (max 90 days)" },
    isConstitutionallyProhibited: false,
    category: "editorial",
    description: { fa: "تفکیک وظایف: بازبین نباید نویسنده باشد.", en: "Separation of duties: reviewers must not be authors." }
  },
  {
    actionId: "ROTATE-DEPLOYMENT-KEYS",
    title: { fa: "چرخش کلیدهای استقرار", en: "Rotating deployment keys" },
    resource: "deployment-configuration",
    minimumBand: 5,
    requiredProofs: ["dual_control_approval", "org_role_contract"],
    purposeLimitation: { fa: "فقط عملیات فنی مشخص و زمان‌دار.", en: "Specified, time-bounded technical operation only." },
    expiryPolicy: { fa: "یک‌بارمصرف و ۶۰ دقیقه", en: "Single-use, 60 minutes" },
    isConstitutionallyProhibited: false,
    category: "administration",
    description: { fa: "کنترل دوگانه الزامی؛ در این نمونه اجرا نمی‌شود.", en: "Dual control required; not executed in this prototype." }
  },
  {
    actionId: "ACCESS-LIVING-PERSON-DATA",
    title: { fa: "دسترسی به دادهٔ افراد زنده", en: "Accessing living-person data" },
    resource: "living-person-data",
    minimumBand: 5,
    requiredProofs: [],
    purposeLimitation: { fa: "هیچ هدفی مجاز نیست.", en: "No purpose is permissible." },
    expiryPolicy: { fa: "هرگز", en: "Never" },
    isConstitutionallyProhibited: true,
    category: "prohibited",
    prohibitionReason: {
      fa: "دادهٔ افراد زنده در این سامانه وجود ندارد و دسترسی به آن، حتی با بالاترین سطح، ممنوع است.",
      en: "Living-person data does not exist in this system, and access to it is prohibited even at the highest band."
    },
    description: { fa: "ممنوع مطلق — نمونه‌ای برای آزمون مرز قانونی.", en: "Absolutely prohibited — a test of the constitutional boundary." }
  },
  {
    actionId: "CAST-BINDING-VOTE",
    title: { fa: "ثبت رأی الزام‌آور", en: "Casting a binding vote" },
    resource: "binding-election",
    minimumBand: 5,
    requiredProofs: [],
    purposeLimitation: { fa: "خارج از حدود اختیار CEP.", en: "Outside CEP's competence." },
    expiryPolicy: { fa: "هرگز", en: "Never" },
    isConstitutionallyProhibited: true,
    category: "prohibited",
    prohibitionReason: {
      fa: "CEP مرجع انتخابات نیست و هیچ رأی الزام‌آوری ثبت نمی‌کند. ادعای برگزاری رأی، جعل مشروعیت است.",
      en: "CEP is not an election authority and records no binding vote. Claiming to run a vote would fabricate legitimacy."
    },
    description: { fa: "ممنوع مطلق — آزمون مرز مشروعیت.", en: "Absolutely prohibited — a test of the legitimacy boundary." }
  },
  {
    actionId: "ASSIGN-SOCIAL-CREDIT",
    title: { fa: "تخصیص امتیاز اجتماعی", en: "Assigning a social-credit score" },
    resource: "citizen-score",
    minimumBand: 5,
    requiredProofs: [],
    purposeLimitation: { fa: "هیچ هدفی مجاز نیست.", en: "No purpose is permissible." },
    expiryPolicy: { fa: "هرگز", en: "Never" },
    isConstitutionallyProhibited: true,
    category: "prohibited",
    prohibitionReason: {
      fa: "رتبه‌بندی انسان‌ها بر پایهٔ اعتبار اجتماعی، با کرامت انسانی و منشور CEP در تضاد کامل است.",
      en: "Ranking people by social credit is fundamentally incompatible with human dignity and the CEP charter."
    },
    description: { fa: "ممنوع مطلق.", en: "Absolutely prohibited." }
  },
  {
    actionId: "GENERATE-POSTHUMOUS-VOICE",
    title: { fa: "تولید صدای فرد فوت‌شده", en: "Generating a deceased person's voice" },
    resource: "voice-simulation",
    minimumBand: 5,
    requiredProofs: [],
    purposeLimitation: { fa: "خارج از حدود اختیار؛ ممنوع مطلق.", en: "Outside competence; absolutely prohibited." },
    expiryPolicy: { fa: "هرگز", en: "Never" },
    isConstitutionallyProhibited: true,
    category: "prohibited",
    prohibitionReason: {
      fa: "اصل ۲۰ تولید صدا و چهرهٔ فرد را ممنوع می‌کند؛ هیچ کد یا میان‌بری برای این کار وجود ندارد.",
      en: "Principle 20 prohibits voice and likeness generation; no code or shortcut exists for it."
    },
    description: { fa: "ممنوع مطلق — آزمون بند اصل ۲۰.", en: "Absolutely prohibited — a Principle 20 boundary test." }
  }
]);

export const rejectedProofCatalogue = Object.freeze([
  {
    id: "telegram_citizenship",
    label: { fa: "حساب تلگرام به‌عنوان اثبات تابعیت", en: "Telegram account as proof of citizenship" },
    whyRejected: {
      fa: "کنترل یک حساب پیام‌رسان فقط همان حساب را نشان می‌دهد و نه تابعیت، نه یکتایی شخص و نه اهلیت رأی. شمارهٔ تلفن هم قابل خرید است.",
      en: "Control of a messaging account proves only that account — not citizenship, unique personhood, or voting eligibility. Phone numbers can be bought."
    },
    category: "identity-inference"
  },
  {
    id: "ai_location_photo_challenge",
    label: { fa: "چالش عکس/موقعیت مکانی با مصاحبهٔ هوش مصنوعی", en: "Photo/location challenge with AI interview" },
    whyRejected: {
      fa: "افشای موقعیت مکانی خطر فیزیکی ایجاد می‌کند و آزمون‌های تصویری، افراد کم‌سواد، سالمند و بدون گوشی هوشمند را حذف می‌کند.",
      en: "Location disclosure creates physical risk, and image tests exclude people with low literacy, older people, and those without smartphones."
    },
    category: "physical-risk"
  },
  {
    id: "social_credit_score",
    label: { fa: "امتیاز اعتبار اجتماعی یا رتبهٔ شهروندی", en: "Social credit or citizen ranking" },
    whyRejected: {
      fa: "رتبه‌بندی انسان‌ها بر پایهٔ رفتار یا عقیده، ابزار کنترل سیاسی است و با کرامت برابر در تضاد است.",
      en: "Ranking people by behaviour or opinion is a tool of political control and contradicts equal dignity."
    },
    category: "dignity-violation"
  },
  {
    id: "influence_wallet_token",
    label: { fa: "کیف پول، توکن یا کمک مالی به‌عنوان نفوذ سیاسی", en: "Wallet, token, or donation as political influence" },
    whyRejected: {
      fa: "اجازه دادن به پول برای خرید نفوذ، همان فسادی را بازتولید می‌کند که گذار می‌خواهد پایان دهد.",
      en: "Letting money buy influence reproduces exactly the corruption the transition aims to end."
    },
    category: "corruption"
  },
  {
    id: "peer_tier_private_db_unlock",
    label: { fa: "تأیید کاربر رده‌بالاتر برای باز کردن پایگاه‌دادهٔ خصوصی", en: "Higher-tier user approval to unlock a private database" },
    whyRejected: {
      fa: "هیچ رده‌ای مجوز دسترسی به پایگاه‌دادهٔ دیگران را نمی‌دهد؛ این کار نیازمند اجازهٔ صاحب داده و پایهٔ حقوقی است.",
      en: "No tier authorizes access to another party's database; that requires the data owner's permission and a legal basis."
    },
    category: "unauthorized-access"
  }
]);
