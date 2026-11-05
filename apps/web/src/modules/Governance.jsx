import { useMemo, useState } from "react";
import { useApi } from "../lib/api.js";
import { t, formatNumber, labelFor } from "../i18n.js";
import { SectionHeader, Card, StateBlock, EpistemicBadge, Badge, Callout, Empty, Disclosure, FieldList, Toast } from "../components/ui.jsx";

export default function Governance({ lang, dict, navigate, openProvenance }) {
  const { status, payload, reload } = useApi("/api/v1/governance");
  const [activeLayer, setActiveLayer] = useState(null);
  const [toast, setToast] = useState("");
  const [sampleChoice, setSampleChoice] = useState(null);

  const postureRows = useMemo(() => {
    if (!payload) return [];
    const posture = payload.data.constitutionalPosture;
    return [
      { label: t({ fa: "دولت است؟", en: "Is it a government?" }, lang), value: t({ fa: "خیر", en: "No" }, lang) },
      { label: t({ fa: "مرجع انتخابات است؟", en: "Is it an election authority?" }, lang), value: t({ fa: "خیر", en: "No" }, lang) },
      { label: t({ fa: "قیمومیت عمومی دارد؟", en: "Does it hold a public mandate?" }, lang), value: t({ fa: "خیر — هیچ مرجعی ثبت نشده", en: "No — none recorded" }, lang) },
      { label: t({ fa: "وضعیت تصویب", en: "Ratification status" }, lang), value: labelFor(posture.ratificationStatus, lang) }
    ];
  }, [payload, lang]);

  if (status !== "ready") {
    return (
      <>
        <SectionHeader eyebrow={`${dict.modules} ۰۲`} title={dict.breadcrumbHome} />
        <StateBlock status={status} lang={lang} onRetry={reload} />
      </>
    );
  }

  const { principles, layers, amendments, deliberationDemo, separationOfPowers } = payload.data;

  return (
    <>
      <SectionHeader
        eyebrow={`${dict.modules} ۰۲ · ${t({ fa: "طرح پیشنهادی", en: "Proposed framework" }, lang)}`}
        title={t({ fa: "حکمرانی و منشور", en: "Governance & Constitution" }, lang)}
        lede={t(
          {
            fa: "ده اصل پیشنهادی، پنج لایهٔ نهادی و مسیر اصلاح. این متن یک پیش‌نویس مدنی است، نه یک قانون یا مصوبهٔ رأی‌گیری‌شده.",
            en: "Ten proposed principles, five institutional layers, and an amendment trail. This is a civic draft, not a law or a voted decision."
          },
          lang
        )}
      />

      <Callout tone="danger" title={t({ fa: "وضعیت مشروعیت", en: "Legitimacy status" }, lang)}>
        <p>{t(payload.data.constitutionalPosture.notice, lang)}</p>
        <FieldList rows={postureRows} />
      </Callout>

      <Card
        title={t({ fa: "ده اصل بنیادین", en: "Ten foundational principles" }, lang)}
        subtitle={t({ fa: "هر اصل، برچسب وضعیت معرفتی خود را دارد.", en: "Each principle carries its own epistemic label." }, lang)}
      >
        <div className="principle-grid">
          {principles.map((principle) => (
            <article key={principle.id} className="principle">
              <div className="principle__head">
                <span className="principle__num">{formatNumber(principle.number, lang)}</span>
                <div>
                  <h3>{t(principle.title, lang)}</h3>
                  <EpistemicBadge status={principle.epistemicStatus} lang={lang} />
                </div>
              </div>
              <p>{t(principle.body, lang)}</p>
              <button
                type="button"
                className="link-btn"
                onClick={() =>
                  openProvenance({
                    id: principle.sourceRef,
                    label: t(principle.title, lang),
                    rows: [
                      { label: dict.source, value: principle.sourceRef },
                      { label: dict.section, value: `§Principle ${principle.number}` },
                      { label: dict.reviewer, value: dict.notRecorded }
                    ],
                    epistemicStatus: principle.epistemicStatus,
                    contradictions: []
                  })
                }
              >
                {dict.inspectProvenance} · {principle.sourceRef}
              </button>
            </article>
          ))}
        </div>
      </Card>

      <Card
        title={t({ fa: "تفکیک کارکردها", en: "Separation of functions" }, lang)}
        subtitle={t(separationOfPowers.note, lang)}
      >
        <ol className="lane-list">
          {separationOfPowers.described.map((lane, index) => (
            <li key={index} className="lane">
              <span className="lane__index">{formatNumber(index + 1, lang)}</span>
              <span className="lane__label">{t(lane, lang)}</span>
            </li>
          ))}
        </ol>
        <p className="muted">
          {t(
            {
              fa: "هیچ کارکردی نباید هم‌زمان قاعده بسازد و بر خود نظارت کند. در این نمونه، هیچ‌یک از این کارکردها نیروی انسانی یا اختیار قانونی ندارد.",
              en: "No single function should both set rules and supervise itself. In this prototype, none of these functions has staff or legal authority."
            },
            lang
          )}
        </p>
      </Card>

      <Card title={t({ fa: "پنج لایهٔ نهادی", en: "Five institutional layers" }, lang)}>
        <div className="layer-stack">
          {layers.map((layer) => {
            const isOpen = activeLayer === layer.id;
            return (
              <div key={layer.id} className={`layer ${isOpen ? "layer--open" : ""}`}>
                <button
                  type="button"
                  className="layer__toggle"
                  aria-expanded={isOpen}
                  onClick={() => setActiveLayer(isOpen ? null : layer.id)}
                >
                  <span>{t(layer.name, lang)}</span>
                  <span className="layer__meta">
                    {t({ fa: "سختی تغییر:", en: "Change difficulty:" }, lang)} {layer.changeDifficulty}
                    <span aria-hidden="true" className="chev">
                      {isOpen ? "▴" : "▾"}
                    </span>
                  </span>
                </button>
                {isOpen ? (
                  <div className="layer__body">
                    <p>{t(layer.purpose, lang)}</p>
                    <div className="chip-row">
                      {layer.exampleInstitutions.map((id) => (
                        <Badge key={id} tone="info">
                          {id}
                        </Badge>
                      ))}
                      <Badge tone={layer.isOperational ? "good" : "warn"}>
                        {t({ fa: "وضعیت:", en: "Status:" }, lang)}{" "}
                        {layer.isOperational ? t({ fa: "عملیاتی", en: "Operational" }, lang) : t({ fa: "فقط پیشنهاد", en: "Proposal only" }, lang)}
                      </Badge>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        <button type="button" className="link-btn" onClick={() => navigate("institutions")}>
          {t({ fa: "دیدن نهادها در کارپوشه", en: "Open institutions in the directory" }, lang)} →
        </button>
      </Card>

      <Card
        title={t({ fa: "ثبت اصلاحیه‌ها", en: "Amendment register" }, lang)}
        subtitle={t({ fa: "هیچ اصلاحیه‌ای تصویب عمومی نشده است.", en: "No amendment has been publicly ratified." }, lang)}
      >
        {amendments.length === 0 ? (
          <Empty lang={lang} />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <caption className="sr-only">{t({ fa: "فهرست اصلاحیه‌ها", en: "List of amendments" }, lang)}</caption>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">{t({ fa: "بخش", en: "Section" }, lang)}</th>
                  <th scope="col">{t({ fa: "خلاصه", en: "Summary" }, lang)}</th>
                  <th scope="col">{t({ fa: "وضعیت مخزن", en: "Repository status" }, lang)}</th>
                  <th scope="col">{t({ fa: "وضعیت تصویب", en: "Ratification" }, lang)}</th>
                </tr>
              </thead>
              <tbody>
                {amendments.map((amendment) => (
                  <tr key={amendment.id}>
                    <td className="mono">{amendment.id}</td>
                    <td>{amendment.section}</td>
                    <td>
                      {t(amendment.summary, lang)}
                      {amendment.dispute ? (
                        <p className="inline-warn">{t(amendment.dispute, lang)}</p>
                      ) : null}
                    </td>
                    <td>
                      <Badge tone="info">{labelFor(amendment.repositoryStatus, lang)}</Badge>
                    </td>
                    <td>
                      <Badge tone="danger">{labelFor(amendment.ratificationStatus, lang)}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card
        title={t({ fa: "نمایش گفت‌وگوی عمومی", en: "Public deliberation demonstration" }, lang)}
        subtitle={t({ fa: "بدون ثبت نظر، بدون شمارش آرا، بدون ساخت حمایت.", en: "No comment storage, no vote count, no manufactured support." }, lang)}
      >
        <Callout tone="warn">{t(deliberationDemo.notice, lang)}</Callout>
        <ul className="question-list">
          {deliberationDemo.sampleQuestions.map((question, index) => (
            <li key={index}>
              <p>{t(question, lang)}</p>
              <div className="chip-row">
                <button
                  type="button"
                  className={`btn btn--ghost ${sampleChoice === `${index}-a` ? "is-active" : ""}`}
                  aria-pressed={sampleChoice === `${index}-a`}
                  onClick={() => setSampleChoice(`${index}-a`)}
                >
                  {t({ fa: "گزینهٔ الف (نمایشی)", en: "Option A (illustrative)" }, lang)}
                </button>
                <button
                  type="button"
                  className={`btn btn--ghost ${sampleChoice === `${index}-b` ? "is-active" : ""}`}
                  aria-pressed={sampleChoice === `${index}-b`}
                  onClick={() => setSampleChoice(`${index}-b`)}
                >
                  {t({ fa: "گزینهٔ ب (نمایشی)", en: "Option B (illustrative)" }, lang)}
                </button>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => {
                    setToast(
                      t(
                        {
                          fa: "در مرورگر شما ثبت شد — هیچ داده‌ای ارسال نشد و هیچ شمارشی ساخته نشد.",
                          en: "Saved in your browser only — no data was sent and no tally was produced."
                        },
                        lang
                      )
                    );
                    setSampleChoice(null);
                  }}
                >
                  {t({ fa: "ثبت نمایشی", en: "Record (demo)" }, lang)}
                </button>
              </div>
            </li>
          ))}
        </ul>
        <p className="muted">{dict.demoActionNotice}</p>
      </Card>

      <Disclosure summary={t({ fa: "سوابق تصمیم‌های مرتبط با اصلاحیه", en: "Decision records for amendments" }, lang)}>
        <ul className="tight-list">
          {payload.data.decisionHistory.map((record) => (
            <li key={record.id}>
              <strong>{record.id}</strong> — {record.newVersion} · {labelFor(record.reviewStatus, lang)} · {t(record.changeSummary, lang)}
            </li>
          ))}
        </ul>
        <button type="button" className="link-btn" onClick={() => navigate("accountability")}>
          {t({ fa: "گزارش پاسخگویی کامل", en: "Full accountability log" }, lang)} →
        </button>
      </Disclosure>

      <Toast message={toast} lang={lang} onClose={() => setToast("")} />
    </>
  );
}
