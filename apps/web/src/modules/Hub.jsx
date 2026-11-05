import { useApi } from "../lib/api.js";
import { t, formatNumber } from "../i18n.js";
import { localeStrings } from "../locales/index.js";
import { StateBlock, Callout } from "../components/ui.jsx";
import { MODULES } from "../i18n.js";
import { Icon } from "../components/icons.jsx";

// Module 00 — the hub.
//
// One centre (MY.X) and six doors: five civic levels and the bank. Each door is
// moderated by its own node — the number of actions it allows, whether it holds
// a ballot, and what the level is for — so the six bars are not six copies of
// one card with a different number.

const LEVEL_ICON = ["eye", "shield", "ballot", "org", "gavel"];

function LevelDoor({ level, lang, copy, navigate }) {
  return (
    <article className={`door door--l${level.id}`}>
      <a
        className="door__link"
        href={`#/levels/${level.id}`}
        onClick={(event) => {
          event.preventDefault();
          navigate("levels", String(level.id));
        }}
      >
        <span className="door__rail" aria-hidden="true" />
        <header className="door__head">
          <span className="door__num" aria-hidden="true">
            {formatNumber(level.id, lang)}
          </span>
          <span className="door__icon" aria-hidden="true">
            <Icon name={LEVEL_ICON[level.id - 1]} size={20} />
          </span>
          <span className="door__titles">
            <span className="door__kicker">
              {copy.levelWord} {formatNumber(level.id, lang)}
            </span>
            <span className="door__title">{t(level.title, lang)}</span>
          </span>
        </header>
        <p className="door__purpose">{t(level.purpose, lang)}</p>
        <p className="door__meter">
          <span className="door__meter-count">
            {formatNumber(level.actionCount, lang)} {copy.actions}
          </span>
          <span className={`door__meter-ballot ${level.holdsBallot ? "is-yes" : ""}`}>
            {level.holdsBallot ? copy.ballotYes : copy.ballotNo}
          </span>
        </p>
        <span className="door__cta">
          {copy.open}
          <span className="door__arrow" aria-hidden="true">
            ‹
          </span>
        </span>
      </a>
    </article>
  );
}

function BankDoor({ lang, copy, navigate }) {
  return (
    <article className="door door--bank">
      <a
        className="door__link"
        href="#/bank"
        onClick={(event) => {
          event.preventDefault();
          navigate("bank");
        }}
      >
        <span className="door__rail" aria-hidden="true" />
        <header className="door__head">
          <span className="door__num door__num--mark" aria-hidden="true">
            ⌂
          </span>
          <span className="door__icon" aria-hidden="true">
            <Icon name="bank" size={20} />
          </span>
          <span className="door__titles">
            <span className="door__kicker">{copy.bankMeta}</span>
            <span className="door__title">{copy.bankTitle}</span>
          </span>
        </header>
        <p className="door__purpose">{copy.bankPurpose}</p>
        <span className="door__cta">
          {copy.open}
          <span className="door__arrow" aria-hidden="true">
            ‹
          </span>
        </span>
      </a>
    </article>
  );
}

export default function Hub({ lang, navigate, route }) {
  const copy = localeStrings(lang).hub;
  const { status, payload, reload } = useApi("/api/v1/levels");

  if (status !== "ready") {
    return (
      <div className="hub">
        <StateBlock status={status} lang={lang} onRetry={reload} />
      </div>
    );
  }

  const levels = payload.data.levels;
  const currentLevel = route.view === "levels" && route.recordId ? levels.find((level) => String(level.id) === String(route.recordId)) : null;
  const stationLabel = currentLevel
    ? `${copy.levelWord} ${formatNumber(currentLevel.id, lang)} · ${t(currentLevel.title, lang)}`
    : route.view === "bank"
      ? copy.bankTitle
      : route.view === "hub"
        ? `${copy.mark} · ${copy.markLine}`
        : null;

  return (
    <div className="hub">
      <section className="hub__stage" aria-labelledby="hub-title">
        <div className="hub__core" aria-hidden="true">
          <span className="hub__ring hub__ring--outer" />
          <span className="hub__ring hub__ring--inner" />
          <span className="hub__mark">{copy.mark}</span>
          <span className="hub__mark-line">{copy.markLine}</span>
        </div>

        <div className="hub__intro">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 id="hub-title" className="hub__title">
            {copy.title}
          </h1>
          <p className="lede">{copy.lede}</p>

          <div className="hub__station" role="status">
            <span className="hub__station-label">{copy.station}</span>
            <span className="hub__station-value">{stationLabel ?? copy.stationNone}</span>
          </div>

          <div className="hub__links">
            <a
              className="btn btn--ghost"
              href="#/levels"
              onClick={(event) => {
                event.preventDefault();
                navigate("levels");
              }}
            >
              {copy.levels}
            </a>
            <a
              className="btn btn--ghost"
              href="#/principles"
              onClick={(event) => {
                event.preventDefault();
                navigate("principles");
              }}
            >
              {copy.principles}
            </a>
          </div>
        </div>
      </section>

      <section className="hub__doors" aria-labelledby="hub-doors-title">
        <div className="section-head">
          <div>
            <h2 id="hub-doors-title" className="h2">
              {copy.keysTitle}
            </h2>
            <p className="lede">{copy.keysLede}</p>
          </div>
        </div>
        <div className="door-grid">
          {levels.map((level) => (
            <LevelDoor key={level.id} level={level} lang={lang} copy={copy} navigate={navigate} />
          ))}
          <BankDoor lang={lang} copy={copy} navigate={navigate} />
        </div>
      </section>

      <section className="hub__more" aria-labelledby="hub-more-title">
        <h2 id="hub-more-title" className="h3">
          {copy.moreTitle}
        </h2>
        <p className="small muted">{copy.moreLede}</p>
        <ul className="hub__module-strip">
          {MODULES.map((module) => (
            <li key={module.id}>
              <a
                href={`#/${module.id}`}
                className="module-chip"
                onClick={(event) => {
                  event.preventDefault();
                  navigate(module.id);
                }}
              >
                <span className="module-chip__num" aria-hidden="true">
                  {formatNumber(module.number, lang)}
                </span>
                <span>{t(module.short, lang)}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <Callout tone="info" title={copy.guardTitle}>
        <p>{copy.guard}</p>
      </Callout>
    </div>
  );
}
