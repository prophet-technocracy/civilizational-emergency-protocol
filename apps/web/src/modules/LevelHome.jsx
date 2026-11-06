import { useApi } from "../lib/api.js";
import { t, formatNumber } from "../i18n.js";
import { localeStrings } from "../locales/index.js";
import { Badge, StateBlock, Callout } from "../components/ui.jsx";

const LEVEL_GLYPH = ["۱", "۲", "۳", "۴", "۵"];
const LEVEL_ICON = ["eye", "shield", "ballot", "org", "gavel"];

function PolicyStrip({ lang, copy, policies, comparison, navigate }) {
  const levelCopy = localeStrings(lang).levels.level;
  return (
    <section className="level-policies" aria-labelledby="policy-heading">
      <div className="section-head">
        <div>
          <p className="eyebrow">{copy.policyTitle}</p>
          <h2 id="policy-heading" className="h2">{copy.policyTitle}</h2>
          <p className="lede">{copy.policyLede}</p>
        </div>
        <button type="button" className="btn btn--ghost" onClick={() => navigate("levels", "5")}>
          {copy.openConfigs}
        </button>
      </div>

      <div className="policy-grid">
        {policies.map((policy) => (
          <article key={policy.id} className="policy-card">
            <header>
              <h3 className="policy-card__title">{t(policy.label, lang)}</h3>
              <Badge tone="synthetic">{copy.syntheticBadge}</Badge>
            </header>
            <p className="policy-card__meta">
              {policy.status === "proposed-configurable" ? levelCopy.draft : policy.status} · {policy.authorizedBy}
            </p>
            <dl className="kv">
              {Object.entries(policy.categories).map(([category, config]) => (
                <div key={category} className="kv__row">
                  <dt>{t(policyCategoryLabel[category], lang)}</dt>
                  <dd className="mono">
                    {config.counted ? `×${config.weight} / ${config.unit}` : levelCopy.notCounted}
                    {config.capPoints ? ` · ${t({ fa: "سقف", en: "cap" }, lang)} ${formatNumber(config.capPoints, lang)}` : ""}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="policy-card__note">{t(policy.limits.note, lang)}</p>
          </article>
        ))}
      </div>

      <div className="table-wrap comparison" tabIndex={0}>
        <table className="data-table">
          <caption className="sr-only">{copy.policyTitle}</caption>
          <thead>
            <tr>
              <th scope="col">{t({ fa: "پیشنهاد", en: "Proposal" }, lang)}</th>
              {policies.map((policy) => (
                <th key={policy.id} scope="col">{t(policy.label, lang)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.map((proposal) => (
              <tr key={proposal.id}>
                <th scope="row" className="cell-stack">
                  <span>{t(proposal.title, lang)}</span>
                  <span className="mono muted">{proposal.id}</span>
                </th>
                {proposal.results.map((result) => (
                  <td key={result.policyId}>
                    <span className="calc-outcome">
                      <strong className="mono">{formatNumber(result.total, lang)}</strong>
                      <span className="muted"> / {formatNumber(result.threshold, lang)}</span>
                    </span>{" "}
                    <Badge tone={result.outcome === "qualified" ? "good" : "warn"}>
                      {result.outcome === "qualified" ? copyOutcome.qualified[lang] : copyOutcome.below[lang]}
                    </Badge>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="muted small">{copy.policyLede}</p>
    </section>
  );
}

const policyCategoryLabel = {
  political: { fa: "حمایت سیاسی (برگه)", en: "Political support (ballot)" },
  professional: { fa: "ارزیابی تخصصی", en: "Professional assessment" },
  endorsement: { fa: "تأیید عمومی (دسترسی)", en: "Public endorsement (reach)" },
  mobilization: { fa: "بسیج تأییدشده", en: "Verified mobilisation" },
  sponsorship: { fa: "حمایت نهادی", en: "Institutional sponsorship" }
};

const copyOutcome = {
  qualified: { fa: "واجد آستانه", en: "Qualified" },
  below: { fa: "زیر آستانه", en: "Below threshold" }
};

export default function LevelHome({ lang, navigate }) {
  const levelsState = useApi("/api/v1/levels");
  const copy = localeStrings(lang).levels.home;

  // The heading is static copy: a slow or failed /api/v1/levels must not take
  // the page's only <h1> with it (issue #19).
  const hero = (
    <header className="level-hero">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h1 className="h1">{copy.title}</h1>
      <p className="lede">{copy.lede}</p>
      <ul className="hero-chips">
        <li><Badge tone="synthetic">{copy.syntheticBadge}</Badge></li>
        <li className="muted small">{copy.noRankNotice}</li>
      </ul>
    </header>
  );

  if (levelsState.status !== "ready") {
    return (
      <div className="level-home">
        {hero}
        <StateBlock status={levelsState.status} lang={lang} onRetry={levelsState.reload} error={levelsState.error} />
      </div>
    );
  }

  const { levels, workflow, policies, comparison, guards } = levelsState.payload.data;

  return (
    <div className="level-home">
      {hero}

      <ul className="level-grid">
        {levels.map((level, index) => (
          <li key={level.id}>
            <button
              type="button"
              className="level-card"
              onClick={() => navigate("levels", String(level.id))}
              aria-describedby={`level-${level.id}-purpose`}
            >
              <span className={`level-card__glyph level-card__glyph--${LEVEL_ICON[index]}`} aria-hidden="true">
                {LEVEL_GLYPH[index]}
              </span>
              <span className="level-card__body">
                <span className="level-card__kicker">{formatNumber(level.id, lang)} · {level.key}</span>
                <span className="level-card__title">{t(level.title, lang)}</span>
                <span className="level-card__purpose" id={`level-${level.id}-purpose`}>{t(level.purpose, lang)}</span>
                <span className="level-card__meta">
                  <Badge tone={level.holdsBallot ? "good" : "neutral"}>
                    {level.holdsBallot ? copy.ballotHeld : copy.noBallot}
                  </Badge>
                  <span className="muted small">
                    {formatNumber(level.actionCount, lang)} {copy.actionsCount}
                  </span>
                </span>
                <span className="level-card__cta">{copy.enter} →</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <section className="workflow-rail" aria-labelledby="workflow-heading">
        <div className="section-head">
          <div>
            <p className="eyebrow">{t({ fa: "پیوند سطوح", en: "Connecting the levels" }, lang)}</p>
            <h2 id="workflow-heading" className="h2">{copy.workflowTitle}</h2>
            <p className="lede">{copy.workflowLede}</p>
          </div>
        </div>
        <ol className="rail">
          {workflow.steps.map((step) => (
            <li key={step.id} className="rail__step">
              <span className="rail__level" aria-hidden="true">{formatNumber(step.level, lang)}</span>
              <span className="rail__body">
                <span className="rail__text">{t(step.text, lang)}</span>
                <span className="rail__meta mono">{step.recordId} · {step.at.slice(0, 10)}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <PolicyStrip lang={lang} copy={copy} policies={policies} comparison={comparison} navigate={navigate} />

      <section aria-labelledby="guards-heading" className="level-guards">
        <h2 id="guards-heading" className="h2">{copy.guardsTitle}</h2>
        <ul className="guard-list">
          {guards.map((guard) => (
            <li key={guard.id}>{t({ fa: guard.fa, en: guard.en }, lang)}</li>
          ))}
        </ul>
        <Callout tone="info" title={t({ fa: "چه چیزی این‌جا وجود ندارد", en: "What this is not" }, lang)}>
          {t(
            {
              fa: "این صفحه یک سامانهٔ دولتی، مرجع انتخابات یا نهاد دارای اختیار قانونی نیست. هیچ رأی واقعی شمرده نمی‌شود و هیچ تصمیم ساختگی الزام‌آور نیست.",
              en: "This is not a government system, an electoral authority or a body with legal power. No real vote is counted and no synthetic decision is binding."
            },
            lang
          )}
        </Callout>
      </section>
    </div>
  );
}
