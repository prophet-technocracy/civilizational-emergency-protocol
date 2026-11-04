import { useState } from "react";
import { useApi } from "../lib/api.js";
import { t, formatNumber } from "../i18n.js";
import { SectionHeader, Card, StateBlock, Badge, Callout, Empty, FieldList, Disclosure } from "../components/ui.jsx";

export default function DigitalLegacy({ lang, dict, navigate }) {
  const { status, payload, reload } = useApi("/api/v1/digital-legacy");
  const [activeClause, setActiveClause] = useState(null);

  if (status !== "ready") {
    return (
      <>
        <SectionHeader eyebrow={`${dict.modules} ۱۲`} title={dict.breadcrumbHome} />
        <StateBlock status={status} lang={lang} onRetry={reload} />
      </>
    );
  }

  const { scopeNotice, clauses, consentMatrix, hardProhibitions, archiveSeparation } = payload.data;

  return (
    <>
      <SectionHeader
        eyebrow={`${dict.modules} ۱۲ · ${t({ fa: "مفهوم پژوهشی، جدا از بایگانی", en: "Research concept, separate from the archive" }, lang)}`}
        title={t({ fa: "میراث دیجیتال و اصل ۲۰", en: "Digital Legacy & Principle 20" }, lang)}
        lede={t(
          {
            fa: "«پروندهٔ هستی» یک مفهوم پژوهشی دربارهٔ حق انسان بر دادهٔ زندگی خودش است. این بخش هیچ ارتباطی با بایگانی تاریخی فوت‌شدگان ندارد.",
            en: "The 'existence dossier' is a research concept about a person's right over data about their own life. This section bears no relation to the deceased historical archive."
          },
          lang
        )}
      />

      <Callout tone="danger" title={t({ fa: "تفکیک مطلق از بایگانی", en: "Absolute separation from the archive" }, lang)}>
        <p>{t(scopeNotice, lang)}</p>
        <FieldList
          rows={[
            { label: t({ fa: "مسیر بایگانی تاریخی", en: "Historical archive route" }, lang), value: archiveSeparation.archiveModuleApi },
            { label: t({ fa: "بایگانی فقط فوت‌شدگان؟", en: "Archive deceased-only?" }, lang), value: archiveSeparation.archiveIsDeceasedOnly ? dict.yes : dict.no },
            { label: t({ fa: "پروندهٔ هستی مفهوم زنده است؟", en: "Existence dossier a living concept?" }, lang), value: archiveSeparation.digitalLegacyIsLivingConcept ? dict.yes : dict.no },
            { label: t({ fa: "در هیچ نقطه‌ای ادغام شده‌اند؟", en: "Merged at any point?" }, lang), value: archiveSeparation.mergedAtAnyPoint ? dict.yes : `${dict.no} — ${t({ fa: "هرگز", en: "never" }, lang)}` }
          ]}
        />
        <button type="button" className="link-btn" onClick={() => navigate("historical-archive")}>
          {t({ fa: "رفتن به بایگانی تاریخی (بخش جدا)", en: "Go to the historical archive (separate section)" }, lang)} →
        </button>
      </Callout>

      <Card
        title={t({ fa: "ممنوعیت‌های مطلق این بخش", en: "Absolute prohibitions in this section" }, lang)}
        subtitle={t({ fa: "هیچ‌یک از این موارد پیاده‌سازی نشده و هیچ میان‌بری برای آن‌ها وجود ندارد.", en: "None of these is implemented and no shortcut exists for any of them." }, lang)}
      >
        <ul className="prohibition-list">
          {hardProhibitions.map((item, index) => (
            <li key={index}>
              <span aria-hidden="true" className="prohibition__icon">
                ✕
              </span>
              {t(item, lang)}
            </li>
          ))}
        </ul>
        <p className="muted">
          {t(
            {
              fa: "این سامانه هیچ کد تولید صدا، تصویر، ویدئو یا شبیه‌سازی شخصیت ندارد. بارگذاری دادهٔ شخصی، پیام یا آرشیو خانوادگی نیز پذیرفته نمی‌شود.",
              en: "This system contains no voice, image, video, or persona simulation code. Uploading personal data, messages, or family archives is also not accepted."
            },
            lang
          )}
        </p>
      </Card>

      <Card
        title={t({ fa: "هفت بند اصل ۲۰", en: "The seven clauses of Principle 20" }, lang)}
        subtitle={t({ fa: "روی هر بند کلیک کنید تا جزئیات حقوقی و ریسک‌های آن را ببینید.", en: "Click a clause to view its legal detail and risks." }, lang)}
      >
        <ol className="clause-list">
          {clauses.map((clause) => {
            const isOpen = activeClause === clause.id;
            return (
              <li key={clause.id} className={`clause ${isOpen ? "clause--open" : ""}`}>
                <button
                  type="button"
                  className="clause__toggle"
                  aria-expanded={isOpen}
                  onClick={() => setActiveClause(isOpen ? null : clause.id)}
                >
                  <span className="clause__num">{formatNumber(clause.clauseNumber, lang)}</span>
                  <span className="clause__title">{t(clause.title, lang)}</span>
                  <span className="clause__status">{t(clause.epistemicStatus, lang)}</span>
                  <span aria-hidden="true">{isOpen ? "▴" : "▾"}</span>
                </button>
                {isOpen ? (
                  <div className="clause__body">
                    <p>{t(clause.summary, lang)}</p>
                    <FieldList
                      rows={[
                        { label: t({ fa: "الزام رضایت", en: "Consent requirement" }, lang), value: t(clause.consentRequirement, lang) },
                        { label: t({ fa: "قاعدهٔ بازپس‌گیری", en: "Revocation rule" }, lang), value: t(clause.revocationRule, lang) },
                        { label: t({ fa: "ریسک حقوقی و اخلاقی", en: "Ethical and legal risk" }, lang), value: t(clause.ethicalLegalRisk, lang) },
                        {
                          label: t({ fa: "در این نمونه", en: "In this prototype" }, lang),
                          value: t(clause.prohibitedInPrototype, lang)
                        }
                      ]}
                    />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      </Card>

      <Card
        title={t({ fa: "ماتریس رضایت و مجازبودن", en: "Consent and permissibility matrix" }, lang)}
        subtitle={t({ fa: "چه کسی، چه چیزی، تحت چه شرطی — و چه چیزی مطلقاً ممنوع است.", en: "Who may do what, under which condition — and what is absolutely prohibited." }, lang)}
      >
        <div className="table-wrap">
          <table className="data-table">
            <caption className="sr-only">{t({ fa: "ماتریس رضایت", en: "Consent matrix" }, lang)}</caption>
            <thead>
              <tr>
                <th scope="col">{t({ fa: "سناریو", en: "Scenario" }, lang)}</th>
                <th scope="col">{t({ fa: "وضعیت", en: "Status" }, lang)}</th>
                <th scope="col">{t({ fa: "شرط / یادداشت", en: "Condition / note" }, lang)}</th>
              </tr>
            </thead>
            <tbody>
              {consentMatrix.map((row, index) => (
                <tr key={index}>
                  <td>{t(row.scenario, lang)}</td>
                  <td>
                    <Badge tone={row.allowed === true ? "good" : row.allowed === "conditional" ? "warn" : "danger"}>
                      {row.allowed === true
                        ? t({ fa: "مجاز", en: "Permitted" }, lang)
                        : row.allowed === "conditional"
                          ? t({ fa: "مشروط", en: "Conditional" }, lang)
                          : t({ fa: "ممنوع", en: "Prohibited" }, lang)}
                    </Badge>
                  </td>
                  <td>{t(row.note, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title={t({ fa: "پرسش‌های باز این حوزه", en: "Open questions in this area" }, lang)}>
        <ul className="notice-list">
          <li>
            {t(
              {
                fa: "چارچوب حقوقی رضایت و بازپس‌گیری هنوز تدوین نشده است (UQ-05).",
                en: "The legal framework for consent and revocation is not yet drafted (UQ-05)."
              },
              lang
            )}
          </li>
          <li>
            {t(
              {
                fa: "مرز میان «آرشیو شخصی خانوادگی» و «پروندهٔ هستی» نیازمند تصمیم انسانی مستقل است.",
                en: "The boundary between a 'family archive' and an 'existence dossier' requires an independent human decision."
              },
              lang
            )}
          </li>
          <li>
            {t(
              {
                fa: "بدون نهاد رسیدگی مستقل، هیچ سازوکار شکایتی واقعی وجود ندارد.",
                en: "Without an independent adjudicating body, there is no real complaint mechanism."
              },
              lang
            )}
          </li>
        </ul>
      </Card>

      <Disclosure summary={t({ fa: "چرا شبیه‌سازی صدا و چهره مطلقاً ممنوع است؟", en: "Why voice and likeness simulation is absolutely prohibited" }, lang)}>
        <p>
          {t(
            {
              fa: "شبیه‌سازی صدا و چهرهٔ یک فرد فوت‌شده می‌تواند برای جعل هویت، ساخت موضع سیاسی جعلی، دستکاری تاریخ و فشار بر بازماندگان استفاده شود. هیچ سطح دسترسی، رضایت خانوادگی یا حقوق ارثی نمی‌تواند این خطر را جبران کند.",
              en: "Simulating a deceased person's voice and likeness can be used for identity fraud, fabricating political positions, manipulating history, and pressuring survivors. No access band, family consent, or inheritance right can offset that risk."
            },
            lang
          )}
        </p>
        <p className="muted">
          {t(
            {
              fa: "به همین دلیل، این نمونه هیچ API، هیچ کتابخانه و هیچ مسیر کدی برای تولید صدا یا تصویر ندارد.",
              en: "For this reason, this prototype has no API, no library, and no code path for voice or image generation."
            },
            lang
          )}
        </p>
      </Disclosure>

      {clauses.length === 0 ? <Empty lang={lang} /> : null}
    </>
  );
}
