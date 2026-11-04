import { useMemo, useState } from "react";
import { useApi } from "../lib/api.js";
import { t, formatNumber, labelFor } from "../i18n.js";
import { SectionHeader, Card, StateBlock, Badge, Callout, Empty, Stat, FieldList, Toast } from "../components/ui.jsx";

const CATEGORY_LABELS = {
  "identity-and-records": { fa: "هویت و اسناد", en: "Identity & records" },
  tax: { fa: "مالیات", en: "Tax" },
  "social-insurance": { fa: "بیمهٔ اجتماعی", en: "Social insurance" },
  statistics: { fa: "آمار", en: "Statistics" },
  emergency: { fa: "اضطراری", en: "Emergency" }
};

export default function PublicServices({ lang, dict }) {
  const { status, payload, reload } = useApi("/api/v1/public-services");
  const [category, setCategory] = useState("all");
  const [copied, setCopied] = useState("");

  const services = useMemo(() => {
    if (!payload) return [];
    return payload.data.services.filter((service) => category === "all" || service.category === category);
  }, [payload, category]);

  async function copyUrl(service) {
    try {
      await navigator.clipboard.writeText(service.url);
      setCopied(t({ fa: "نشانی رونوشت شد — پیش از استفاده، اصالت آن را بررسی کنید.", en: "Address copied — verify its authenticity before use." }, lang));
    } catch {
      setCopied(t({ fa: "رونوشت ممکن نشد. نشانی را دستی یادداشت کنید.", en: "Copy unavailable. Note the address manually." }, lang));
    }
  }

  if (status !== "ready") {
    return (
      <>
        <SectionHeader eyebrow={`${dict.modules} ۰۹`} title={dict.breadcrumbHome} />
        <StateBlock status={status} lang={lang} onRetry={reload} />
      </>
    );
  }

  const { boundaries, directoryState, notice } = payload.data;
  const categories = [...new Set(payload.data.services.map((service) => service.category))];

  return (
    <>
      <SectionHeader
        eyebrow={`${dict.modules} ۰۹ · ${t({ fa: "پیوندهای عمومی منتشرشده", en: "Published public links" }, lang)}`}
        title={t({ fa: "راهنمای خدمات عمومی", en: "Public Service Directory" }, lang)}
        lede={t(
          {
            fa: "فهرستی از پیوندهای عمومی و توضیح کاربرد هر یک. هیچ ادعای یکپارچگی فنی، همکاری رسمی یا نمایندگی وجود ندارد.",
            en: "A list of public links and what each is used for. There is no claim of technical integration, official partnership, or representation."
          },
          lang
        )}
      />

      <Callout tone="danger" title={t({ fa: "مرزهای ایمنی این بخش", en: "Safety boundaries of this section" }, lang)}>
        <p>{t(notice, lang)}</p>
        <ul className="tight-list">
          {boundaries.map((boundary) => (
            <li key={boundary.id}>
              {t(boundary.text, lang)}{" "}
              {boundary.severity === "gated" ? <Badge tone="warn">{t({ fa: "دروازه‌دار", en: "Gated" }, lang)}</Badge> : null}
            </li>
          ))}
        </ul>
      </Callout>

      <div className="grid grid--inline">
        <Stat label={t({ fa: "ورودی‌های فهرست", en: "Listed entries" }, lang)} value={formatNumber(payload.data.services.length, lang)} lang={lang} />
        <Stat label={t({ fa: "تأییدنشده", en: "Unverified" }, lang)} value={formatNumber(directoryState.unverifiedEntries, lang)} tone="warn" lang={lang} />
        <Stat label={t({ fa: "یکپارچگی API", en: "API integration" }, lang)} value={formatNumber(0, lang)} tone="good" lang={lang} />
        <Stat label={t({ fa: "کاوش زنده", en: "Live probing" }, lang)} value={formatNumber(0, lang)} tone="good" lang={lang} />
      </div>

      <Card
        title={t({ fa: "فهرست خدمات", en: "Service entries" }, lang)}
        actions={
          <label className="field">
            <span>{t({ fa: "دسته", en: "Category" }, lang)}</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">{dict.all}</option>
              {categories.map((key) => (
                <option key={key} value={key}>
                  {t(CATEGORY_LABELS[key] ?? { fa: key, en: key }, lang)}
                </option>
              ))}
            </select>
          </label>
        }
      >
        {services.length === 0 ? (
          <Empty lang={lang} />
        ) : (
          <div className="service-grid">
            {services.map((service) => (
              <article key={service.id} className="service">
                <div className="service__head">
                  <h3>{t(service.title, lang)}</h3>
                  <Badge tone={service.urlStatus === "unverified" ? "warn" : "info"}>{labelFor(service.urlStatus, lang)}</Badge>
                </div>
                <p>{t(service.description, lang)}</p>
                <p className="mono service__url" dir="ltr">{service.url}</p>
                <div className="chip-row">
                  <Badge tone="neutral">{t(CATEGORY_LABELS[service.category] ?? { fa: service.category, en: service.category }, lang)}</Badge>
                  <Badge tone="good">
                    {t({ fa: "ادعای یکپارچگی:", en: "Integration claim:" }, lang)} {service.integrationClaim ? dict.yes : dict.no}
                  </Badge>
                  <Badge tone="neutral">
                    {t({ fa: "دادهٔ ارسالی:", en: "Data sent:" }, lang)} {t(service.dataRequested, lang)}
                  </Badge>
                </div>
                <ul className="tight-list">
                  {service.cautions.map((caution, index) => (
                    <li key={index}>{t(caution, lang)}</li>
                  ))}
                </ul>
                <p className="muted">
                  {t({ fa: "آخرین بررسی:", en: "Last checked:" }, lang)} {service.lastChecked ?? t({ fa: "هرگز — هیچ بررسی زنده‌ای انجام نشده", en: "Never — no live check performed" }, lang)}
                </p>
                <div className="service__actions">
                  {service.urlVerified ? (
                    <a className="btn btn--ghost" href={service.url} target="_blank" rel="noopener noreferrer nofollow">
                      {t({ fa: "گشودن پیوند خارجی", en: "Open external link" }, lang)}
                      <span className="sr-only"> ({t({ fa: "در زبانهٔ تازه، در صورت اطمینان از اصالت", en: "in a new tab, if you trust the authenticity" }, lang)})</span>
                    </a>
                  ) : (
                    // Unverified entries are shown as text, not as a clickable
                    // endorsement: a prototype must not hand a visitor a link
                    // whose authenticity nobody has confirmed.
                    <p className="service__url-unverified">
                      <span className="mono">{service.url}</span>{" "}
                      <span className="muted">
                        {t(
                          {
                            fa: "— نمایش متنی؛ پیوند فعال نشده تا اصالت دامنه تأیید شود",
                            en: "— shown as text; the link stays inactive until the domain is confirmed"
                          },
                          lang
                        )}
                      </span>
                    </p>
                  )}
                  <button type="button" className="btn btn--ghost" onClick={() => copyUrl(service)}>
                    {t({ fa: "رونوشت نشانی", en: "Copy address" }, lang)}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </Card>

      <Card
        title={t({ fa: "وضعیت فنی این راهنما", en: "Technical state of this directory" }, lang)}
        subtitle={t({ fa: "همهٔ مقادیر از پیکربندی واقعی این نمونه خوانده می‌شود.", en: "All values are read from this prototype's real configuration." }, lang)}
      >
        <FieldList
          rows={[
            { label: t({ fa: "نوع یکپارچگی", en: "Integration type" }, lang), value: labelFor(directoryState.integrationType, lang) },
            { label: t({ fa: "شمارش API زنده انجام شد؟", en: "Live API enumeration performed?" }, lang), value: directoryState.liveApiEnumerationPerformed ? dict.yes : dict.no },
            { label: t({ fa: "ضبط HAR انجام شد؟", en: "HAR capture performed?" }, lang), value: directoryState.harCapturePerformed ? dict.yes : dict.no },
            { label: t({ fa: "جاسازی iframe استفاده شد؟", en: "Iframe embedding used?" }, lang), value: directoryState.iframeEmbeddingUsed ? dict.yes : dict.no },
            { label: t({ fa: "ورودی تأییدشده", en: "Verified entries" }, lang), value: formatNumber(directoryState.verifiedEntries, lang) }
          ]}
        />
        <p className="muted">
          {t(
            {
              fa: "برای انتشار واقعی، هر ورودی باید با اجازهٔ صریح متولی راستی‌آزمایی و تاریخ‌گذاری شود. تا آن زمان برچسب «تأییدنشده» باقی می‌ماند.",
              en: "For any real publication, each entry must be verified and dated with explicit custodian permission. Until then the 'unverified' label stays."
            },
            lang
          )}
        </p>
      </Card>

      <Toast message={copied} onClose={() => setCopied("")} />
    </>
  );
}
