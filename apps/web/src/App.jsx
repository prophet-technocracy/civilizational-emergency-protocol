import { useEffect, useState } from "react";

function isDemoPayload(value) {
  return (
    value &&
    value.mode === "synthetic-demo" &&
    typeof value.notice === "string" &&
    Array.isArray(value.modules) &&
    value.modules.every(
      (module) =>
        typeof module.id === "string" &&
        typeof module.title === "string" &&
        typeof module.description === "string" &&
        module.status === "planned"
    )
  );
}

export default function App() {
  const [payload, setPayload] = useState(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();

    async function loadDemo() {
      try {
        const response = await fetch("/api/v1/demo", {
          headers: { Accept: "application/json" },
          signal: controller.signal
        });
        if (!response.ok) throw new Error("API response was not successful");

        const result = await response.json();
        if (!isDemoPayload(result)) throw new Error("Unexpected demo payload");
        setPayload(result);
        setState("ready");
      } catch (error) {
        if (error.name !== "AbortError") setState("error");
      }
    }

    loadDemo();
    return () => controller.abort();
  }, []);

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="صفحهٔ اصلی نمونهٔ CEP">
          <span className="brand-mark" aria-hidden="true">چ</span>
          <span className="brand-name">زیرساخت مدنی CEP</span>
        </a>
        <nav aria-label="پیمایش اصلی">
          <a href="#modules">بخش‌های پیشنهادی</a>
          <a href="#principles">اصول نمونه</a>
        </nav>
        <span className="preview-pill"><span className="pulse" /> پیش‌نمایش محلی</span>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> نمونهٔ فنی، نه خدمت عمومی</p>
            <h1 id="hero-title">دانش عمومی،<br /><em>با منشأ روشن.</em></h1>
            <p className="hero-intro">
              پوستهٔ اولیه‌ای برای نمایش اطلاعات عمومیِ مستند، قابل بررسی و دسترس‌پذیر.
              این نسخه فقط ساختار رابط و اتصال خواندنی به API را نشان می‌دهد.
            </p>
            <a className="primary-link" href="#modules">
              دیدن بخش‌های نمونه <span aria-hidden="true">←</span>
            </a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            <div className="art-center"><span>CEP</span><small>نمونه</small></div>
            <span className="art-dot dot-one" />
            <span className="art-dot dot-two" />
            <span className="art-dot dot-three" />
          </div>
        </section>

        <section className="demo-notice" aria-labelledby="notice-title">
          <div className="notice-symbol" aria-hidden="true">i</div>
          <div className="notice-content">
            <h2 id="notice-title">اطلاعیهٔ شفافیت</h2>
            <p>
              {payload?.notice ??
                "این پیش‌نمایش فقط از دادهٔ ساختگی استفاده می‌کند و هنوز محتوای واقعی یا تأییدشده‌ای ندارد."}
            </p>
          </div>
          <span className="notice-tag">دادهٔ نمایشی</span>
        </section>

        <section className="modules-section" id="modules" aria-labelledby="modules-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">ساختار پیشنهادی</p>
              <h2 id="modules-title">از کجا شروع می‌کنیم؟</h2>
            </div>
            <p className="section-note">این کارت‌ها قابلیت‌های پیشنهادی‌اند، نه ادعای وجود یا تأیید اطلاعات.</p>
          </div>

          {state === "loading" && (
            <p className="api-state" role="status" aria-live="polite">در حال بارگذاری نمونهٔ محلی…</p>
          )}
          {state === "error" && (
            <p className="api-state api-error" role="alert">
              اتصال به API نمونه برقرار نشد. بخش‌های پیشنهادی در این نسخه بارگذاری نشده‌اند.
            </p>
          )}
          {state === "ready" && (
            <div className="module-grid">
              {payload.modules.map((module, index) => (
                <article className="module-card" key={module.id}>
                  <div className={`module-icon icon-${index + 1}`} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="module-card-heading">
                    <h3>{module.title}</h3>
                    <span className="planned-tag">در مرحلهٔ طرح</span>
                  </div>
                  <p>{module.description}</p>
                  <span className="card-arrow" aria-hidden="true">↗</span>
                </article>
              ))}
            </div>
          )}
          <div className="api-footnote" role="status" aria-live="polite">
            <span className={`status-indicator ${state === "ready" ? "is-on" : ""}`} />
            {state === "ready" ? "اتصال خواندنی به API نمونه برقرار است" : "وضعیت API نمونه"}
            <code>GET /api/v1/demo</code>
          </div>
        </section>

        <section className="principles" id="principles" aria-labelledby="principles-title">
          <div className="principles-heading">
            <span className="principles-index">01 / 03</span>
            <h2 id="principles-title">نمونه با سه محدودیت روشن ساخته شده است</h2>
          </div>
          <div className="principle-list">
            <article><span>الف</span><div><h3>منبع قبل از ادعا</h3><p>محتوای آینده باید به منبع قابل بررسی پیوند داشته باشد.</p></div></article>
            <article><span>ب</span><div><h3>بدون حساب کاربری</h3><p>این پوسته اطلاعات شخصی یا سیاسی از بازدیدکننده نمی‌گیرد.</p></div></article>
            <article><span>پ</span><div><h3>نمونه، نه مرجع رسمی</h3><p>این پیش‌نمایش نمایندهٔ هیچ جامعه یا نهاد عمومی نیست.</p></div></article>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>CEP · نمونهٔ محلی</span>
        <span>محتوای تأییدشده‌ای در این نسخه منتشر نشده است.</span>
      </footer>
    </div>
  );
}
