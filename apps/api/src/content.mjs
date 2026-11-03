// Deliberately synthetic demo content. Never substitute user-supplied dossiers here.
export const demoPayload = Object.freeze({
  mode: "synthetic-demo",
  notice:
    "نمونهٔ محلی و آزمایشی است؛ هیچ داده یا ادعای تأییدشده‌ای دربارهٔ افراد، نهادها یا روندهای واقعی در این نسخه ارائه نمی‌شود.",
  modules: Object.freeze([
    Object.freeze({
      id: "overview",
      title: "نمای کلی",
      description: "ساختار نمایشی برای توضیح مفاهیم و پیوند به منابعی که بعداً بررسی خواهند شد.",
      status: "planned"
    }),
    Object.freeze({
      id: "institutions",
      title: "راهنمای نهادها",
      description: "نمونهٔ رابط؛ هنوز هیچ نهاد یا مسئولیت واقعی در این بخش ثبت نشده است.",
      status: "planned"
    }),
    Object.freeze({
      id: "knowledge",
      title: "کتابخانهٔ دانش",
      description: "نمونهٔ رابط؛ محتوای تاریخی فقط پس از بررسی منبع و مجوز انتشار افزوده می‌شود.",
      status: "planned"
    })
  ])
});
