// Copy for the shell: the parts of the frame that are not a module — the
// breadcrumb, the way home, and the page shown for an address that does not exist.
// «مسیر صفحه» is the accepted term for a breadcrumb (glossary: no rejected form
// recorded yet; keep this wording if the entry is added).
export const shellFa = {
  breadcrumb: "مسیر صفحه",
  home: "مرکز",
  // Global search (the command palette). Every state has its own words: an
  // outage must never read as "nothing found".
  search: {
    label: "جستجوی سراسری",
    placeholder: "جستجوی نهاد، پرونده، ادعا، اصل یا خدمت…",
    results: "نتایج جستجو",
    searching: "در حال جستجو…",
    prompt: "برای جستجو در همهٔ دوازده بخش، دست‌کم دو نویسه بنویسید.",
    emptyFor: "برای «{query}» چیزی یافت نشد. واژهٔ دیگری را بیازمایید.",
    error: "جستجو انجام نشد. ارتباط با سرور برقرار نیست.",
    retry: "تلاش دوباره",
    close: "بستن جستجو"
  },
  // The render-error fallback. It says what it knows and what it does not.
  // The footer's facts. The version, the commit and the schema are identifiers:
  // they stay in Latin digits even in the Persian interface (glossary rule 3).
  build: {
    version: "نسخه",
    commit: "ساخت",
    schema: "طرح‌وارهٔ داده",
    unknown: "نامعلوم"
  },
  crash: {
    eyebrow: "خطای نمایش",
    title: "این بخش نمایش داده نشد",
    body:
      "یک خطا در نمایش این صفحه رخ داد. هیچ داده‌ای ارسال یا ثبت نشد؛ این نمونه فقط‌خواندنی است. می‌توانید دوباره بیازمایید یا به مرکز بازگردید.",
    retry: "تلاش دوباره",
    hub: "بازگشت به مرکز"
  },
  notFound: {
    eyebrow: "یافت نشد",
    title: "این صفحه را نیافتیم",
    body:
      "ممکن است نشانی اشتباه نوشته شده باشد یا به رکوردی اشاره کند که در این نمونه وجود ندارد. این تلاش هیچ چیزی را تغییر نداد.",
    hub: "بازگشت به مرکز",
    levels: "دیدن پنج سطح شهروندی",
    search: "جستجو در سامانه"
  }
};
