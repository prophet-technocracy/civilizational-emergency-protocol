// Copy for the HMMT bank screen. Figures are formatted at render time; the
// numbers written into sentences here are the design's fixed definitions
// (one unit = one thousand billion toman), not live data.
export const bankFa = {
  navLabel: "بانک HMMT",
  eyebrow: "زیرساخت پولی · طراحی پیشنهادی",
  title: "HMMT: یک واحد، سه عدد",
  lede:
    "هر واحد HMMT دقیقاً هزار میلیارد تومان است. عرضهٔ در گردش از سقف پشتوانهٔ حسابرسی‌شده فراتر نمی‌رود و هر توکن تازه فقط در برابر تومانِ واریزشده ساخته می‌شود.",
  proposalBadge: "طراحی پیشنهادی، نه پول قانونی",
  asOf: "تاریخ داده",
  currency: "دلار",
  networks: {
    TON: "TON",
    "permissioned sovereign chain": "زنجیرهٔ اختصاصی مجوزدار"
  },
  syntheticLedger: "دفتر کل ساختگی",
  tableRegion: "جدول",
  notTender: "این صفحه یک طراحی را نشان می‌دهد: هیچ توکنی در هیچ زنجیره‌ای ساخته نشده و هیچ سپرده‌ای پذیرفته نمی‌شود.",
  notTenderTitle: "این صفحه یک طراحی است، نه یک سامانهٔ مالی",
  statuses: {
    audited: "حسابرسی‌شده",
    "source-reported": "گزارش‌شده از منبع",
    "unverified-estimate": "برآورد تأییدنشده"
  },

  definition: {
    title: "تعریف واحد",
    name: "نام",
    tomanPerToken: "ارزش اسمی",
    decimals: "رقم اعشار",
    baseUnit: "کوچک‌ترین واحد",
    networkFirst: "شبکهٔ مرحلهٔ اول",
    networkTarget: "شبکهٔ هدف",
    pegNote:
      "ارزش واحد به تومان ثابت است؛ ارزش دلاری آن با نرخ بازار آزاد شناور می‌شود. به همین دلیل سقف عرضه هم به تومان و هم به دلار گزارش می‌شود.",
    exitCriteria: "شرط‌های خروج از زنجیرهٔ اول"
  },

  supply: {
    title: "سقف عرضه و عرضهٔ در گردش",
    lede: "این دو عدد یکی نیستند و فاصلهٔ میانشان همان چیزی است که باید توضیح داده شود.",
    ceiling: "سقف عرضه",
    circulating: "عرضهٔ در گردش",
    utilisation: "بهره‌برداری از سقف",
    remaining: "ظرفیت باقی‌مانده",
    ceilingNote: "بیشترین توکنی که پشتوانهٔ خالص اجازه می‌دهد؛ هدف رشد نیست.",
    circulatingNote: "فقط از تومانِ واریزشدهٔ تسویه‌شده ساخته شده است.",
    phase: "مرحلهٔ توزیع",
    perPersonCap: "سقف شخصی",
    perPersonCapNote: "سقف شخصی سطح ۲ و ۳ یکسان است و با مشارکت بیشتر نمی‌شود؛ داده‌ای برای شناسایی افراد نگه داشته نمی‌شود.",
    usdValue: "ارزش دلاری",
    tomanValue: "ارزش تومانی",
    fxRate: "نرخ مبنای دلار",
    formula: "فرمول",
    sourceTitle: "منبع هر رقم",
    source: "منبع",
    status: "وضعیت",
    value: "مقدار",
    note: "یادداشت"
  },

  chain: {
    title: "از رقم ناخالص منابع تا سقف عرضه",
    lede: "رقم ۲۷٫۳ تریلیون دلاری ارزش منابع در جا است، نه پشتوانه. زنجیرهٔ کسر این فاصله را عدد به عدد نشان می‌دهد.",
    gross: "ارزش ناخالص منابع در جا",
    grossNote: "فقط ردهٔ شمرده‌شده (T3) · USD",
    net: "پشتوانهٔ خالص پس از کسر",
    survival: "بازماندهٔ رقم ناخالص",
    ceiling: "سقف عرضه",
    perToken: "ارزش دلاری هر واحد",
    openTable: "دیدن زنجیرهٔ کسر",
    closeTable: "بستن جدول",
    excludedTitle: "آنچه شمرده نمی‌شود",
    excludedGdp: "تولید ناخالص داخلی",
    excludedWealth: "ثروت خصوصی خانوارها"
  },

  haircut: {
    title: "زنجیرهٔ کسر",
    lede: "هر کسر با ضریب و دلیل خودش آمده است. این پارامترها پیش‌نویس و قابل تنظیم‌اند؛ عدد جادویی نیست.",
    policy: "سیاست",
    draft: "پیش‌نویس قابل تنظیم",
    tier: "ردهٔ دارایی",
    gross: "مبلغ ناخالص",
    step: "کسر",
    factor: "ضریب",
    net: "خالص",
    status: "وضعیت اعتبارسنجی",
    excluded: "شمرده نمی‌شود",
    counted: "شمرده می‌شود",
    verification: "ضریب اعتبارسنجی",
    rationale: "دلیل",
    tierNote: "یادداشت رده",
    chainNote: "ترتیب کسرها حفظ می‌شود: ابتدا بازیافت، بعد هزینه، بعد ارزش زمانی، بعد انتقال حقوقی و در پایان ضریب اعتبارسنجی."
  },

  reserve: {
    title: "اثبات ذخیره",
    lede: "دو پرسش جدا: آیا برای هر توکن در گردش تومان هست؟ و آیا سقف با دارایی پوشش داده می‌شود؟",
    reserveRatio: "نسبت ذخیرهٔ تومانی",
    assetCoverage: "پوشش دارایی",
    utilisation: "سهم عرضه از سقف",
    tomanReserve: "ذخیرهٔ تومانی",
    netBacking: "پشتوانهٔ خالص",
    queued: "در صف بازخرید",
    invariantsTitle: "قاعده‌هایی که نباید تغییر کنند",
    ok: "برقرار",
    broken: "نقض‌شده",
    design: "قاعدهٔ ساختاری",
    statusHealthy: "سالم",
    statusReserve: "کمبود ذخیرهٔ تومانی",
    statusAsset: "کمبود پشتوانهٔ دارایی",
    hashRoot: "ریشهٔ هش منتشرشده",
    hashRootNote: "اثبات ذخیره فقط یک ریشهٔ هش منتشر می‌کند؛ هیچ دادهٔ هویتی روی زنجیره نوشته نمی‌شود."
  },

  caps: {
    title: "سقف هر سطح",
    lede: "سقف خرید برای هر سطح از نقش و مدرک آن می‌آید، نه از ارزش فرد. سه سیاست پیش‌نویس کنار هم آمده‌اند تا تفاوتشان دیده شود؛ هیچ‌کدام تصویب نشده است.",
    level: "سطح",
    cap: "سقف خرید",
    requires: "مدرک لازم",
    noProof: "بدون مدرک اضافی",
    disclosure: "اعلام دارایی و کنارگذاری",
    notEligible: "واحد نمی‌گیرد",
    noBudget: "بدون بودجهٔ حسابرسی‌شده محاسبه نمی‌شود",
    hardCap: "سقف سخت اعمال شد",
    draft: "پیش‌نویس قابل تنظیم",
    defaultPolicy: "سیاست پیش‌فرض",
    basis: "مبنا",
    basedOn: "بر پایهٔ",
    invariantsTitle: "قاعده‌های سقف‌بندی",
    recordedUnder:
      "ردیف‌های دفتر کل با سیاست پیش‌فرض ثبت شده‌اند و هر ردیف سقف خودش را همراه دارد؛ سیاست‌های دیگر همان ردیف‌ها را مجاز نمی‌دانستند."
  },

  requirements: {
    "ballot-credential": "مدرک رأی",
    "entity-registration": "ثبت نهاد با افسر پاسخگو",
    "audited-budget": "بودجهٔ سالانهٔ حسابرسی‌شده",
    "mandate-record": "سند اختیار"
  },

  sim: {
    title: "شبیه‌ساز تبدیل و بازخرید",
    lede: "مبلغ را به واحد HMMT وارد کنید. هر پاسخ یا انجام می‌شود یا دلیل انجام‌نشدنش را می‌گوید.",
    action: "کنش",
    level: "سطح شهروندی",
    capPolicy: "سیاست سقف",
    entity: "نهاد",
    capForLevel: "سقف این سطح",
    noCapForRedeem: "بازخرید سقف سطح ندارد",
    excess: "بیش از سقف",
    presetOverCap: "بیش از سقف این سطح",
    convert: "تبدیل تومان به HMMT",
    redeem: "بازخرید HMMT به تومان",
    amount: "مقدار (HMMT)",
    amountHint: "۱ HMMT برابر هزار میلیارد تومان است.",
    tomanEquivalent: "معادل تومانی",
    presets: "مقدارهای آماده",
    presetCap: "سقف این سطح",
    presetOne: "یک واحد",
    presetHalf: "نیم واحد",
    presetFive: "پنج واحد",
    presetOver: "بیش از عرضهٔ در گردش",
    presetOverCeiling: "بیش از سقف عرضه",
    submit: "اجرای شبیه‌سازی",
    running: "در حال محاسبه…",
    reset: "پاک کردن",
    resultTitle: "نتیجه",
    fee: "کارمزد",
    reserveRequired: "ارزش دلاری سپرده",
    netTokens: "توکن خالص",
    netToman: "تومان خالص",
    newCirculating: "عرضهٔ در گردش پس از این کنش",
    afterTitle: "وضعیت ذخیره پس از این کنش",
    failureTitle: "انجام نشد",
    parsedAs: "مقدار خوانده‌شده",
    amountProblem: {
      empty: "مقداری وارد نشده است.",
      "not-a-number": "این ورودی عدد نیست؛ رقم‌های لاتین، فارسی یا عربی بپذیرید.",
      "zero-or-negative": "مقدار باید بزرگ‌تر از صفر باشد.",
      "ambiguous-separator": "یک جداکننده و سه رقم پس از آن دو معنا دارد: ۱۰۰۰ یا ۱٫۰۰۰. برای اعشار از ٫ و برای گروه سه‌رقمی از ٬ استفاده کنید."
    },
    error: "ارتباط با کارساز برقرار نشد. دوباره تلاش کنید.",
    codes: {
      converted: "تبدیل انجام شد",
      redeemed: "بازخرید انجام شد",
      queue: "در صف بازخرید",
      "ceiling-reached": "سقف پشتوانه اجازه نمی‌دهد",
      "over-level-cap": "بیش از سقف این سطح",
      "level-not-eligible": "این سطح واحد نمی‌گیرد",
      "entity-budget-required": "سقف نهاد بدون بودجه محاسبه نمی‌شود",
      "exceeds-circulating": "بیش از عرضهٔ در گردش",
      "invalid-amount": "مبلغ نامعتبر",
      "unknown-action": "کنش ناشناخته"
    },
    codeNotes: {
      queue: "رد نشده است: با ترتیب زمانی پرداخت می‌شود.",
      "ceiling-reached": "ظرفیت باقی‌مانده در کنار پاسخ گزارش می‌شود.",
      "exceeds-circulating": "توکنی که وجود ندارد قابل بازخرید نیست.",
      "invalid-amount": "مبلغ باید مثبت باشد."
    }
  },

  ledger: {
    title: "دفتر کل ساختگی",
    lede: "هر ردیف یک واریز یا بازخرید ساختگی است؛ جمع‌ها از همین ردیف‌ها ساخته می‌شوند.",
    entries: "ردیف‌ها",
    kind: "نوع",
    id: "شناسه",
    at: "زمان",
    deposit: "واریز",
    redemption: "بازخرید",
    toman: "تومان",
    tokens: "توکن",
    status: "وضعیت",
    settled: "تسویه‌شده",
    pending: "در انتظار",
    queued: "در صف",
    totals: "جمع‌ها",
    depositsSettled: "واریز تسویه‌شده",
    depositsPending: "واریز در انتظار",
    minted: "توکن ساخته‌شده",
    burned: "توکن سوخته",
    queuedToman: "تومان در صف",
    feeRevenue: "درآمد کارمزد",
    cashWindow: "پنجرهٔ نقدینگی روزانه"
  },

  phases: {
    title: "مراحل توزیع",
    lede: "هیچ مرحله‌ای بدون گذر از شرط خودش باز نمی‌شود؛ سهم پیش‌آغاز، فروش اولیه و اعطای رایگان وجود ندارد.",
    phase: "مرحله",
    window: "سهم این مرحله",
    cumulative: "سقف تجمعی",
    gate: "شرط عبور",
    current: "مرحلهٔ جاری",
    notYet: "باز نشده"
  },

  design: {
    title: "معماری و حاکمیت",
    lede: "شبکه، حاکمیت و قاعده‌های ساختاری در یک نگاه.",
    networkTitle: "زنجیره",
    firstStage: "مرحلهٔ اول",
    targetStage: "مرحلهٔ هدف",
    reason: "دلیل",
    exitTitle: "شرط‌های خروج از مرحلهٔ اول",
    governanceTitle: "تقارن حاکمیت",
    invariantsTitle: "قاعده‌های ساختاری",
    ledgerNoteTitle: "آنچه این صفحه انجام نمی‌دهد",
    ledgerNote:
      "هیچ توکنی ساخته نمی‌شود، هیچ پرداختی انجام نمی‌شود، هیچ کیف پولی به کار نمی‌رود و هیچ دادهٔ فردی در هیچ مرحله‌ای خوانده نمی‌شود."
  }
};
