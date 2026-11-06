import { useMemo, useState } from "react";
import { useApi } from "../lib/api.js";
import { t, formatNumber, HORIZONS } from "../i18n.js";
import { SectionHeader, Card, StateBlock, EpistemicBadge, Badge, Callout, Empty, Stat, Disclosure } from "../components/ui.jsx";

const SECTORS = [
  { id: "all", label: { fa: "همهٔ بخش‌ها", en: "All sectors" } },
  { id: "services", label: { fa: "خدمات پایه", en: "Basic services" } },
  { id: "rights", label: { fa: "حقوق و عدالت", en: "Rights & justice" } },
  { id: "governance", label: { fa: "حکمرانی", en: "Governance" } },
  { id: "economy", label: { fa: "اقتصاد", en: "Economy" } }
];

export default function Transition({ lang, dict, navigate, openProvenance }) {
  const { status, payload, error, reload } = useApi("/api/v1/transition");
  const [sector, setSector] = useState("all");
  const [horizon, setHorizon] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const stages = useMemo(() => {
    if (!payload) return [];
    return payload.data.stages.filter((stage) => {
      if (sector !== "all" && stage.sectorKey !== sector) return false;
      if (horizon !== "all" && stage.horizonKey !== horizon) return false;
      return true;
    });
  }, [payload, sector, horizon]);

  if (status !== "ready") {
    return (
      <>
        <SectionHeader eyebrow={`${dict.modules} ۰۳`} title={dict.breadcrumbHome} />
        <StateBlock status={status} lang={lang} onRetry={reload} error={error} />
      </>
    );
  }

  const { horizons, metrics, disclaimer } = payload.data;

  return (
    <>
      <SectionHeader
        eyebrow={`${dict.modules} ۰۳ · ${t({ fa: "افق‌های زمانی جداگانه", en: "Distinct time horizons" }, lang)}`}
        title={t({ fa: "معماری گذار ایران", en: "Iran Transition Architecture" }, lang)}
        lede={t(
          {
            fa: "فاز اضطراری ۱۸۰ روزه و افق گذار ۲ تا ۳ ساله دو چیز متفاوت‌اند. این صفحه هر دو را جدا نشان می‌دهد و هیچ تاریخ انتخاباتی یا تقویم اجرایی ارائه نمی‌دهد.",
            en: "The 180-day emergency phase and the 2–3 year transition horizon are different things. This page keeps them apart and offers no election date or execution calendar."
          },
          lang
        )}
      />

      <Callout tone="danger" title={t({ fa: "محدودهٔ این تحلیل", en: "Scope of this analysis" }, lang)}>
        <p>{t(disclaimer, lang)}</p>
      </Callout>

      <div className="grid grid--inline">
        <Stat label={t({ fa: "مراحل طراحی‌شده", en: "Designed stages" }, lang)} value={formatNumber(metrics.totalStages, lang)} lang={lang} />
        <Stat label={t({ fa: "نقاط عطف", en: "Milestones" }, lang)} value={formatNumber(metrics.totalMilestones, lang)} lang={lang} />
        <Stat
          label={t({ fa: "یکپارچگی وابستگی‌ها", en: "Dependency integrity" }, lang)}
          value={metrics.dependenciesValid ? t({ fa: "معتبر", en: "Valid" }, lang) : t({ fa: "ناقص", en: "Broken" }, lang)}
          tone={metrics.dependenciesValid ? "good" : "danger"} lang={lang} />
        <Stat
          label={t({ fa: "اجراشده در واقعیت", en: "Executed in reality" }, lang)}
          value={formatNumber(0, lang)}
          note={t({ fa: "هیچ مرحله‌ای اجرا نشده است.", en: "No stage has been executed." }, lang)} lang={lang} />
      </div>

      <div className="horizon-grid">
        {horizons.map((item) => (
          <article key={item.id} className={`horizon horizon--${HORIZONS[item.key]?.tone ?? "transition"}`}>
            <div className="horizon__top">
              <span className="horizon__duration">{t(item.durationLabel, lang)}</span>
              <EpistemicBadge status={item.epistemicStatus} lang={lang} />
            </div>
            <h2>{t(item.title, lang)}</h2>
            <p>{t(item.framing, lang)}</p>
            <button
              type="button"
              className="link-btn"
              onClick={() =>
                openProvenance({
                  id: item.sourceRef,
                  label: t(item.title, lang),
                  rows: [
                    { label: dict.source, value: item.sourceRef },
                    { label: dict.section, value: "§7 Transition Horizons" },
                    { label: dict.reviewer, value: "editorial-reviewed" }
                  ],
                  epistemicStatus: item.epistemicStatus,
                  contradictions: []
                })
              }
            >
              {dict.inspectProvenance}
            </button>
          </article>
        ))}
      </div>

      <Card
        title={t({ fa: "خط زمانی مراحل", en: "Stage timeline" }, lang)}
        subtitle={t({ fa: "وابستگی‌ها و عدم‌قطعیت هر مرحله صریح است.", en: "Each stage states its dependencies and uncertainty." }, lang)}
        actions={
          <div className="filter-group">
            <label className="field">
              <span>{t({ fa: "افق", en: "Horizon" }, lang)}</span>
              <select value={horizon} onChange={(event) => setHorizon(event.target.value)}>
                <option value="all">{t({ fa: "همهٔ افق‌ها", en: "All horizons" }, lang)}</option>
                {horizons.map((item) => (
                  <option key={item.id} value={item.key}>
                    {t(item.title, lang)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>{t({ fa: "بخش", en: "Sector" }, lang)}</span>
              <select value={sector} onChange={(event) => setSector(event.target.value)}>
                {SECTORS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {t(item.label, lang)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        }
      >
        {stages.length === 0 ? (
          <Empty lang={lang} />
        ) : (
          <ol className="stage-list">
            {stages.map((stage) => {
              const isOpen = expanded === stage.id;
              return (
                <li key={stage.id} className={`stage stage--${HORIZONS[stage.horizonKey]?.tone ?? "transition"}`}>
                  <div className="stage__rail" aria-hidden="true">
                    <span className="stage__index">{formatNumber(stage.orderIndex, lang)}</span>
                  </div>
                  <div className="stage__body">
                    <div className="stage__head">
                      <div>
                        <h3>{t(stage.title, lang)}</h3>
                        <div className="chip-row">
                          <Badge tone="info">{t(HORIZONS[stage.horizonKey] ?? { fa: stage.horizonKey, en: stage.horizonKey }, lang)}</Badge>
                          <Badge tone="neutral">{t(SECTORS.find((s) => s.id === stage.sectorKey)?.label ?? { fa: stage.sectorKey, en: stage.sectorKey }, lang)}</Badge>
                          <EpistemicBadge status={stage.epistemicStatus} lang={lang} />
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn--ghost"
                        aria-expanded={isOpen}
                        onClick={() => setExpanded(isOpen ? null : stage.id)}
                      >
                        {isOpen ? dict.hide : dict.viewDetails}
                      </button>
                    </div>
                    <p>{t(stage.summary, lang)}</p>
                    {isOpen ? (
                      <div className="stage__detail">
                        <h4 className="minor-heading">{t({ fa: "نقاط عطف", en: "Milestones" }, lang)}</h4>
                        <ul className="tight-list">
                          {stage.milestones.map((milestone, index) => (
                            <li key={index}>{t(milestone, lang)}</li>
                          ))}
                        </ul>
                        <h4 className="minor-heading">{t({ fa: "وابستگی‌ها", en: "Dependencies" }, lang)}</h4>
                        {stage.dependencies.length === 0 ? (
                          <p className="muted">{dict.none}</p>
                        ) : (
                          <div className="chip-row">
                            {stage.dependencies.map((dep) => (
                              <Badge key={dep} tone="neutral">
                                {dep}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <h4 className="minor-heading">{t({ fa: "نهادهای مسئول (پیشنهادی)", en: "Responsible institutions (proposed)" }, lang)}</h4>
                        <div className="chip-row">
                          {stage.responsibleInstitutions.map((id) => (
                            <Badge key={id} tone="info">
                              {id}
                            </Badge>
                          ))}
                        </div>
                        <Callout tone="warn" title={t({ fa: "عدم‌قطعیت", en: "Uncertainty" }, lang)}>
                          {t(stage.uncertainty, lang)}
                        </Callout>
                        <button type="button" className="link-btn" onClick={() => navigate("institutions")}>
                          {t({ fa: "بررسی نهادهای مرتبط", en: "Review related institutions" }, lang)} →
                        </button>
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </Card>

      <Disclosure summary={t({ fa: "چرا این دو افق نباید در هم آمیزند؟", en: "Why the two horizons must not be merged" }, lang)}>
        <p>
          {t(
            {
              fa: "آمیختن فاز اضطراری کوتاه با افق بازسازی نهادی، معمولاً به دائمی‌شدن اختیارات اضطراری می‌انجامد. این نمونه هر دو را جدا نگه می‌دارد و برای هر اختیار، شرط خاتمه پیشنهاد می‌کند. هیچ‌یک از این گام‌ها اجرا نشده است.",
              en: "Merging a short emergency phase with the institutional rebuilding horizon usually ends in emergency powers becoming permanent. This prototype keeps them separate and proposes a sunset clause for each authority."
            },
            lang
          )}
        </p>
        <p className="muted">
          {t(
            {
              fa: "هیچ بخشی از این صفحه پیش‌بینی قطعی، تضمین نتیجه یا وعدهٔ زمانی نیست.",
              en: "No part of this page is a definitive forecast, a guarantee of outcome, or a promise about timing."
            },
            lang
          )}
        </p>
      </Disclosure>
    </>
  );
}
