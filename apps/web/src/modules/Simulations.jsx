import { useEffect, useState } from "react";
import { useApi, useDebounced } from "../lib/api.js";
import { t, formatNumber } from "../i18n.js";
import { SectionHeader, Card, StateBlock, Callout, Empty, Toggle, BarRow, EpistemicBadge } from "../components/ui.jsx";

const MODEL_DEFAULT = {
  executiveSelection: "",
  accountability: "",
  stability: "",
  minorityProtection: ""
};

export default function Simulations({ lang, dict }) {
  const { status, payload, error, reload } = useApi("/api/v1/simulations");
  const [selectedModels, setSelectedModels] = useState([]);
  const [params, setParams] = useState({ sunsetDays: 180, reviewIntervalDays: 90, supermajority: 66, decentralization: 35 });
  const [profile, setProfile] = useState(null);
  const [busy, setBusy] = useState(false);
  const debounced = useDebounced(params, 260);

  useEffect(() => {
    if (status !== "ready") return;
    setSelectedModels(payload.data.models.slice(0, 2).map((model) => model.id));
    setProfile(payload.data.defaultProfile);
  }, [status, payload]);

  useEffect(() => {
    if (status !== "ready" || !debounced) return undefined;
    let alive = true;
    setBusy(true);
    const query = new URLSearchParams({
      sunsetDays: String(debounced.sunsetDays),
      reviewIntervalDays: String(debounced.reviewIntervalDays),
      supermajority: String(debounced.supermajority),
      decentralization: String(debounced.decentralization)
    });
    fetch(`/api/v1/simulations/evaluate?${query.toString()}`, { headers: { Accept: "application/json" }, credentials: "omit" })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("bad"))))
      .then((body) => {
        if (alive) setProfile(body.data.profile);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setBusy(false);
      });
    return () => {
      alive = false;
    };
  }, [debounced, status]);

  if (status !== "ready") {
    return (
      <>
        <SectionHeader eyebrow={`${dict.modules} ۱۱`} title={dict.breadcrumbHome} />
        <StateBlock status={status} lang={lang} onRetry={reload} error={error} />
      </>
    );
  }

  const { models, parameters, notice, comparisonDisclaimer } = payload.data;
  const compared = selectedModels.map((id) => models.find((model) => model.id === id)).filter(Boolean);
  const maxIndicator = 100;

  function toggleModel(id) {
    setSelectedModels((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 3) return [...current.slice(1), id];
      return [...current, id];
    });
  }

  return (
    <>
      <SectionHeader
        eyebrow={`${dict.modules} ۱۱ · ${t({ fa: "مقایسهٔ فرضی", en: "Hypothetical comparison" }, lang)}`}
        title={t({ fa: "آزمایشگاه طراحی نهادی", en: "Institutional Design Lab" }, lang)}
        lede={t(
          {
            fa: "مقایسهٔ ساختاری مدل‌های نهادی و آزمون بده‌بستان حفاظ‌ها. هیچ مدلی «برنده» نیست و هیچ نتیجه‌ای توصیهٔ قطعی نیست.",
            en: "Structural comparison of institutional models and an exploration of safeguard trade-offs. No model 'wins' and no result is a definitive recommendation."
          },
          lang
        )}
      />

      <Callout tone="warn" title={t({ fa: "محدودیت این آزمایشگاه", en: "Limits of this lab" }, lang)}>
        <p>{t(notice, lang)}</p>
        <p className="muted">{t(comparisonDisclaimer, lang)}</p>
      </Callout>

      <Card
        title={t({ fa: "انتخاب مدل‌ها برای مقایسه", en: "Select models to compare" }, lang)}
        subtitle={t({ fa: "حداکثر سه مدل هم‌زمان.", en: "Up to three models at once." }, lang)}
      >
        <div className="chip-row chip-row--wrap">
          {models.map((model) => (
            <Toggle key={model.id} active={selectedModels.includes(model.id)} onClick={() => toggleModel(model.id)}>
              {t(model.name, lang)}
            </Toggle>
          ))}
        </div>
      </Card>

      {compared.length === 0 ? (
        <Empty lang={lang}>{t({ fa: "برای مقایسه، دست‌کم یک مدل را انتخاب کنید.", en: "Select at least one model to compare." }, lang)}</Empty>
      ) : (
        <div className={`compare-grid compare-grid--${compared.length}`}>
          {compared.map((model) => (
            <article key={model.id} className="compare">
              <div className="compare__head">
                <h2>{t(model.name, lang)}</h2>
                <EpistemicBadge status={model.epistemicStatus} lang={lang} />
              </div>
              <p>{t(model.summary, lang)}</p>
              <dl className="trait-list">
                {Object.entries(MODEL_DEFAULT).map(([key]) => (
                  <div key={key} className="trait">
                    <dt>{t(TRAIT_LABELS[key], lang)}</dt>
                    <dd>{t(model.traits[key], lang)}</dd>
                  </div>
                ))}
              </dl>
              <h3 className="minor-heading">{t({ fa: "مزیت‌های ساختاری", en: "Structural strengths" }, lang)}</h3>
              <ul className="tight-list">
                {model.strengths.map((item, index) => (
                  <li key={index}>{t(item, lang)}</li>
                ))}
              </ul>
              <h3 className="minor-heading">{t({ fa: "خطرهای شناخته‌شده", en: "Known risks" }, lang)}</h3>
              <ul className="tight-list">
                {model.risks.map((item, index) => (
                  <li key={index}>{t(item, lang)}</li>
                ))}
              </ul>
              <h3 className="minor-heading">{t({ fa: "حفاظ‌های لازم", en: "Required safeguards" }, lang)}</h3>
              <ul className="tight-list">
                {model.safeguardsNeeded.map((item, index) => (
                  <li key={index}>{t(item, lang)}</li>
                ))}
              </ul>
              <p className="muted">{t(model.historicalExamples, lang)}</p>
            </article>
          ))}
        </div>
      )}

      <Card
        title={t({ fa: "تنظیم پارامترهای حفاظتی", en: "Tune safeguard parameters" }, lang)}
        subtitle={t({ fa: "هر تغییر بلافاصله در نمایش شاخص‌ها بازتاب می‌یابد.", en: "Each change immediately reflects in the indicator view." }, lang)}
      >
        <div className="param-grid">
          {parameters.map((parameter) => (
            <label key={parameter.id} className="field param">
              <span className="param__label">
                {t(parameter.label, lang)}
                <strong>
                  {formatNumber(params[PARAM_KEYS[parameter.id]], lang)} {t(parameter.unit, lang)}
                </strong>
              </span>
              <input
                type="range"
                min={parameter.min}
                max={parameter.max}
                step={parameter.id === "SUPERMAJORITY-THRESHOLD" || parameter.id === "DECENTRALIZATION-SHARE" ? 1 : 5}
                value={params[PARAM_KEYS[parameter.id]]}
                onChange={(event) =>
                  setParams((current) => ({ ...current, [PARAM_KEYS[parameter.id]]: Number(event.target.value) }))
                }
                aria-valuemin={parameter.min}
                aria-valuemax={parameter.max}
                aria-valuenow={params[PARAM_KEYS[parameter.id]]}
              />
              <p className="muted">{t(parameter.effect, lang)}</p>
            </label>
          ))}
        </div>
        <div className="chip-row">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setParams({ sunsetDays: 180, reviewIntervalDays: 90, supermajority: 66, decentralization: 35 })}
          >
            {dict.reset}
          </button>
          {busy ? <span className="muted">{dict.loading}</span> : null}
        </div>
      </Card>

      <Card
        title={t({ fa: "نمای شاخص‌های حفاظتی (نمایشی)", en: "Safeguard indicator view (illustrative)" }, lang)}
        subtitle={t({ fa: "این شاخص‌ها محاسبهٔ شفاف رابط‌اند، نه سنجهٔ عملکرد.", en: "These indicators are transparent interface arithmetic, not performance measures." }, lang)}
      >
        {profile ? (
          <>
            {profile.indicators.map((indicator) => (
              <BarRow
                lang={lang}
                key={indicator.id}
                label={t(indicator.label, lang)}
                value={indicator.value}
                max={maxIndicator}
                tone="info"
                display={`${formatNumber(indicator.value, lang)}%`}
              />
            ))}
            <details className="disclosure">
              <summary>{t({ fa: "معنای هر شاخص", en: "What each indicator means" }, lang)}</summary>
              <ul className="tight-list">
                {profile.indicators.map((indicator) => (
                  <li key={indicator.id}>
                    <strong>{t(indicator.label, lang)}:</strong> {t(indicator.direction, lang)}
                  </li>
                ))}
              </ul>
            </details>
            <Callout tone="danger" title={t({ fa: "تنش‌های ساختاری در این ترکیب", en: "Structural tensions in this combination" }, lang)}>
              <ul className="tight-list">
                {profile.tensionPairs.map((tension, index) => (
                  <li key={index}>{t(tension, lang)}</li>
                ))}
              </ul>
            </Callout>
            <p className="muted">{t(profile.disclaimer, lang)}</p>
          </>
        ) : (
          <StateBlock status="loading" lang={lang} />
        )}
      </Card>
    </>
  );
}

const PARAM_KEYS = {
  "EMERGENCY-SUNSET-DAYS": "sunsetDays",
  "REVIEW-INTERVAL-DAYS": "reviewIntervalDays",
  "SUPERMAJORITY-THRESHOLD": "supermajority",
  "DECENTRALIZATION-SHARE": "decentralization"
};

const TRAIT_LABELS = {
  executiveSelection: { fa: "شیوهٔ تعیین اجرا", en: "Executive selection" },
  accountability: { fa: "پاسخگویی", en: "Accountability" },
  stability: { fa: "ثبات", en: "Stability" },
  minorityProtection: { fa: "حفاظت از اقلیت", en: "Minority protection" }
};
