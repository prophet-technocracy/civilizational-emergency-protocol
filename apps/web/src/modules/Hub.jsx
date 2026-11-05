import { useApi } from "../lib/api.js";
import { t, formatNumber, MODULES } from "../i18n.js";
import { localeStrings } from "../locales/index.js";
import { Callout } from "../components/ui.jsx";
import { Icon } from "../components/icons.jsx";

// Module 00 — the hub.
//
// One centre (MY.X) and six doors: five civic levels and the bank. Each door is
// moderated by its own node — the number of actions it allows, whether it holds
// a ballot, and what the level is for — so the six bars are not six copies of
// one card with a different number.

const LEVEL_ICON = ["eye", "shield", "ballot", "org", "gavel"];
const DOOR_IDS = [1, 2, 3, 4, 5];

function LevelDoor({ id, title, purpose, stats, state, lang, copy, navigate }) {
  return (
    <article className={`door door--l${id}`}>
      <a
        className="door__link"
        href={`#/levels/${id}`}
        onClick={(event) => {
          event.preventDefault();
          navigate("levels", String(id));
        }}
      >
        <span className="door__rail" aria-hidden="true" />
        <header className="door__head">
          <span className="door__num" aria-hidden="true">
            {formatNumber(id, lang)}
          </span>
          <span className="door__icon" aria-hidden="true">
            <Icon name={LEVEL_ICON[id - 1]} size={20} />
          </span>
          <span className="door__titles">
            <span className="door__kicker">
              {copy.levelWord} {formatNumber(id, lang)}
            </span>
            <span className="door__title">{title}</span>
          </span>
        </header>
        <p className="door__purpose">{purpose}</p>
        {/* The door, its name and its purpose are static. Only the counts come
            from /api/v1/levels, and when they are missing the door says nothing
            rather than inventing a number. */}
        <p className="door__meter">
          {stats ? (
            <>
              <span className="door__meter-count">
                {formatNumber(stats.actionCount, lang)} {copy.actions}
              </span>
              <span className={`door__meter-ballot ${stats.holdsBallot ? "is-yes" : ""}`}>
                {stats.holdsBallot ? copy.ballotYes : copy.ballotNo}
              </span>
            </>
          ) : state === "loading" ? (
            <span className="door__meter-skeleton" aria-hidden="true">
              <span className="skeleton skeleton--text" />
              <span className="skeleton skeleton--pill" />
            </span>
          ) : null}
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

function BankDoor({ copy, navigate }) {
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
  // The five names and purposes are the design's own definitions, so the six
  // doors paint immediately. The API is the single source of truth for the
  // numbers only (issue #33).
  const staticCopy = localeStrings(lang).levels;
  const { status, payload, reload } = useApi("/api/v1/levels");
  // The workbench under the six doors: two surfaces that are work, not levels.
  // They load beside the doors and degrade quietly — a slow programme endpoint
  // must never take the landing page down with it.
  const programme = useApi("/api/v1/programme");
  const referendum = useApi("/api/v1/referendum");

  const levels = payload?.data?.levels ?? null;
  const statsFor = (id) => levels?.find((level) => String(level.id) === String(id)) ?? null;
  const currentId = route.view === "levels" && route.recordId ? String(route.recordId) : null;
  const stationLabel = currentId
    ? `${copy.levelWord} ${formatNumber(currentId, lang)} · ${staticCopy.titles[currentId] ?? ""}`
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
        <div className="door-grid" aria-busy={status === "loading" || undefined}>
          {DOOR_IDS.map((id) => (
            <LevelDoor
              key={id}
              id={id}
              title={staticCopy.titles[id]}
              purpose={staticCopy.purposes[id]}
              stats={statsFor(id)}
              state={status}
              lang={lang}
              copy={copy}
              navigate={navigate}
            />
          ))}
          <BankDoor lang={lang} copy={copy} navigate={navigate} />
        </div>
        {status === "error" ? (
          <p className="hub__notice small" role="status">
            {copy.countsUnavailable}{" "}
            <button type="button" className="link-button" onClick={reload}>
              {copy.countsRetry}
            </button>
          </p>
        ) : null}
      </section>


      <section className="hub__work" aria-labelledby="hub-work-title">
        <div className="section-head">
          <div>
            <h2 id="hub-work-title" className="h2">
              {copy.workTitle}
            </h2>
            <p className="lede">{copy.workLede}</p>
          </div>
        </div>
        <div className="work-grid">
          <a
            className="work-card work-card--programme"
            href="#/programme"
            onClick={(event) => {
              event.preventDefault();
              navigate("programme");
            }}
          >
            <span className="work-card__icon" aria-hidden="true">
              <Icon name="projects" size={20} />
            </span>
            <span className="work-card__title">{copy.workProgramme}</span>
            <span className="work-card__note">{copy.workProgrammeNote}</span>
            <span className="work-card__meta small">
              {programme.status === "ready"
                ? copy.workProgrammeMeta
                    .replace("{tokens}", formatNumber(programme.payload.data.summary.tokens, lang))
                    .replace("{projects}", formatNumber(programme.payload.data.summary.projects, lang))
                    .replace("{delivered}", formatNumber(programme.payload.data.summary.delivered, lang))
                : copy.workOpen}
            </span>
          </a>
          <a
            className="work-card work-card--referendum"
            href="#/referendum"
            onClick={(event) => {
              event.preventDefault();
              navigate("referendum");
            }}
          >
            <span className="work-card__icon" aria-hidden="true">
              <Icon name="ballot" size={20} />
            </span>
            <span className="work-card__title">{copy.workReferendum}</span>
            <span className="work-card__note">{copy.workReferendumNote}</span>
            <span className="work-card__meta small">
              {referendum.status === "ready"
                ? copy.workReferendumMeta
                    .replace("{questions}", formatNumber(referendum.payload.data.summary.questions, lang))
                    .replace("{gates}", formatNumber(referendum.payload.data.summary.openGates, lang))
                : copy.workOpen}
            </span>
          </a>
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
