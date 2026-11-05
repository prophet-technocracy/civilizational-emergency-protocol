import { useEffect, useMemo, useState } from "react";
import { useApi } from "../lib/api.js";
import { t, formatNumber } from "../i18n.js";
import { localeStrings } from "../locales/index.js";
import { SectionHeader, Card, StateBlock, Badge, Callout, Empty, Stat } from "../components/ui.jsx";
import { LightDot } from "../components/lights.jsx";
import { principleAnchor, principleHref, PROGRAMME_VIEW, hrefFor } from "../lib/routes.js";
import { prefersReducedMotion } from "../lib/focus.js";

// The four statuses map onto badge tones; anything unknown stays neutral rather
// than inventing a colour the reader would have to guess at.
const TONE = { covered: "good", partial: "warn", gap: "info", outside: "neutral" };

const STATUS_ORDER = ["covered", "partial", "gap", "outside"];

export default function Principles({ lang, route }) {
  const copy = localeStrings(lang).principles;
  const { status, payload, reload } = useApi("/api/v1/principles");
  // The queue that targets these principles: cached, and allowed to fail
  // quietly — a missing programme must not take the mother file down.
  const programme = useApi("/api/v1/programme");
  const [filter, setFilter] = useState("all");
  const targetId = route?.recordId ?? null;
  const targetedBy = useMemo(() => {
    const map = new Map();
    for (const project of programme.payload?.data?.projects ?? []) {
      if (!map.has(project.principleId)) map.set(project.principleId, []);
      map.get(project.principleId).push(project.id);
    }
    return map;
  }, [programme.payload]);

  // A deep link from a project lands on the row it is working on.
  useEffect(() => {
    if (!targetId || status !== "ready") return;
    const row = document.getElementById(principleAnchor(targetId));
    row?.scrollIntoView?.({ block: "center", behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [targetId, status]);

  if (status !== "ready") {
    return (
      <>
        <SectionHeader eyebrow={copy.eyebrow} title={copy.title} />
        <StateBlock status={status} lang={lang} onRetry={reload} />
      </>
    );
  }

  const { motherFile, chapters, summary, method, statuses, lights } = payload.data;
  const statusCopy = (id) => copy.status[id] ?? id;

  const percent = (value) => `${formatNumber(Math.round(value * 100), lang)}${t({ fa: "٪", en: "%" }, lang)}`;
  const lightCopy = (id) => copy.lightName[id] ?? id;

  const shown = filter === "all" ? null : filter;
  // A deep link to a principle that is not in this file must say so rather than
  // quietly showing the top of the page.
  const targetMissing =
    Boolean(targetId) && !chapters.some((chapter) => chapter.principles.some((principle) => principle.id === targetId));
  const visibleChapters = chapters
    .map((chapter) => ({
      ...chapter,
      rows: chapter.principles.filter((principle) => !shown || principle.coverage === shown)
    }))
    .filter((chapter) => chapter.rows.length > 0);

  return (
    <>
      <SectionHeader
        eyebrow={`${copy.eyebrow} · ${formatNumber(motherFile.principles, lang)} ${copy.total}`}
        title={copy.title}
        lede={copy.lede}
        actions={<Badge tone="warn">{copy.draftBadge}</Badge>}
      />

      {targetMissing ? (
        <Callout tone="warn" title={copy.targetMissingTitle ?? copy.draftTitle}>
          <p>{copy.targetMissing}</p>
        </Callout>
      ) : null}

      <Callout tone="warn" title={copy.draftTitle}>
        <p>{t(motherFile.sourceNote, lang)}</p>
        <p className="small muted">{copy.draftBody}</p>
      </Callout>

      <h2 className="h2">{copy.summaryTitle}</h2>
      <div className="grid grid--inline grid--six">
        <Stat label={copy.total} value={formatNumber(summary.total, lang)} lang={lang} />
        <Stat label={copy.status.covered} value={formatNumber(summary.demonstrated, lang)} tone="good" lang={lang} />
        <Stat label={copy.status.partial} value={formatNumber(summary.represented, lang)} tone="warn" lang={lang} />
        <Stat label={copy.status.gap} value={formatNumber(summary.gaps, lang)} tone="info" lang={lang} />
        <Stat label={copy.status.outside} value={formatNumber(summary.beyondSoftware, lang)} lang={lang} />
        <Stat label={copy.chaptersWith} value={formatNumber(chapters.length, lang)} lang={lang} />
      </div>

      <Card title={copy.livingTitle} className="living">
        <p className="living__lede">{copy.livingLede}</p>
        <div className="living__grid">
          <div className="living__body">
            <p>
              <Badge tone={lights.band.id === "building" ? "warn" : lights.band.id === "draft" ? "info" : "good"}>
                {copy.bandLabel}: {t(lights.band.label, lang)}
              </Badge>
            </p>
            <p className="small muted">
              {copy.readinessContext.replace("{counted}", formatNumber(lights.counted, lang))}
            </p>
            <p className="mono small living__formula">
              {copy.readinessFormula
                .replace("{green}", formatNumber(lights.counts.green, lang))
                .replace("{amber}", formatNumber(lights.counts.amber, lang))
                .replace("{counted}", formatNumber(lights.counted, lang))}
            </p>
            <ul className="light-legend" aria-label={copy.lightLegendTitle}>
              {lights.definitions.map((definition) => (
                <li key={definition.id} className="light-legend__row">
                  <LightDot light={definition.id} label={lightCopy(definition.id)} />
                  <span className="light-legend__name">{lightCopy(definition.id)}</span>
                  <span className="light-legend__count">
                    {formatNumber(lights.counts[definition.id], lang)} · {copy.lightCountLabel}
                  </span>
                  <span className="light-legend__weight">
                    {definition.excluded ? copy.weightExcluded : `${copy.weightLabel} ${formatNumber(definition.weight, lang)}`}
                  </span>
                </li>
              ))}
            </ul>
            <p className="small living__live">{copy.liveNote}</p>
            <p className="living__cta">
              <a className="link-button" href="#/programme">
                {copy.programCta}
              </a>
            </p>
            <p className="small muted">
              {copy.programHint.replace("{partial}", formatNumber(lights.counts.amber, lang))}
            </p>
          </div>
          <div
            className="living__dial"
            style={{ "--value": lights.readiness }}
            role="img"
            aria-label={`${copy.readinessLabel}: ${percent(lights.readiness)}`}
          >
            <span className="living__value">{percent(lights.readiness)}</span>
            <span className="living__caption">{copy.readinessLabel}</span>
          </div>
        </div>
      </Card>

      <Card title={copy.methodTitle}>
        <p>{t(method, lang)}</p>
        <dl className="principles-legend">
          {statuses.map((entry) => (
            <div key={entry.id} className="principles-legend__row">
              <dt>
                <Badge tone={TONE[entry.id] ?? "neutral"}>{statusCopy(entry.id)}</Badge>
              </dt>
              <dd className="small">{copy.statusNote[entry.id] ?? t(entry.note, lang)}</dd>
            </div>
          ))}
        </dl>
        <p className="small muted">{copy.honestNote}</p>
      </Card>

      <div className="filter-row" role="group" aria-label={copy.filterLabel}>
        <span className="filter-row__label">{copy.filterLabel}</span>
        {["all", ...STATUS_ORDER].map((id) => (
          <button
            key={id}
            type="button"
            className={`chip ${filter === id ? "is-active" : ""}`}
            aria-pressed={filter === id}
            onClick={() => setFilter(id)}
          >
            {id === "all" ? copy.all : statusCopy(id)}
            {id === "all" ? ` · ${formatNumber(summary.total, lang)}` : ` · ${formatNumber(summary.counts[id], lang)}`}
          </button>
        ))}
      </div>

      {visibleChapters.length === 0 ? (
        <Empty lang={lang}>{copy.emptyFilter}</Empty>
      ) : (
        visibleChapters.map((chapter) => (
          <section key={chapter.id} aria-labelledby={`principle-chapter-${chapter.id}`}>
            <div className="section-head">
              <div>
                <h2 id={`principle-chapter-${chapter.id}`} className="h2">
                  {t(chapter.title, lang)}
                </h2>
                <p className="small muted">
                  {t(chapter.range, lang)} · {copy.chapterReadiness}: {percent(chapter.readiness)}
                </p>
              </div>
            </div>

            <div className="table-wrap" tabIndex={0} role="region" aria-label={`${copy.surfaceLabel}: ${t(chapter.title, lang)}`}>
              <table className="data-table principles-table">
                <caption className="sr-only">{t(chapter.title, lang)}</caption>
                <thead>
                  <tr>
                    <th scope="col">{copy.statusColumn}</th>
                    <th scope="col">{copy.principleColumn}</th>
                    <th scope="col">{copy.surfaceColumn}</th>
                  </tr>
                </thead>
                <tbody>
                  {chapter.rows.map((principle) => (
                    <tr
                      key={principle.id}
                      id={principleAnchor(principle.id)}
                      className={targetId === principle.id ? "is-targeted" : undefined}
                    >
                      <td>
                        <span className="principles-status">
                          <LightDot light={principle.light} label={`${copy.lightColumn}: ${lightCopy(principle.light)}`} />
                          <Badge tone={TONE[principle.coverage] ?? "neutral"}>{statusCopy(principle.coverage)}</Badge>
                        </span>
                      </td>
                      <th scope="row" className="principles-table__body">
                        <span className="principles-table__title">
                          <span className="mono muted">{t(principle.label, lang)}</span> · {t(principle.title, lang)}
                        </span>
                        <span className="small muted principles-table__note">{t(principle.note, lang)}</span>
                        {targetedBy.get(principle.id)?.length ? (
                          <span className="small principles-table__target">
                            {copy.targetedBy}:{" "}
                            {targetedBy.get(principle.id).map((projectId, index) => (
                              <span key={projectId}>
                                {index > 0 ? " · " : ""}
                                <a className="link-button mono" href={hrefFor(PROGRAMME_VIEW)}>
                                  {projectId}
                                </a>
                              </span>
                            ))}
                          </span>
                        ) : targetId === principle.id ? (
                          <span className="small muted principles-table__target">{copy.targetedByNone}</span>
                        ) : null}
                        {/* On a phone the surface moves under the note instead of
                            taking a column of its own. */}
                        <span className="small principles-inline-surface">
                          {principle.surface?.route ? (
                            <a href={`#/${principle.surface.route}`} className="link-button">
                              {copy.openSurface}: {t(principle.surface.label, lang)}
                            </a>
                          ) : principle.surface ? (
                            <span>{t(principle.surface.label, lang)}</span>
                          ) : (
                            <span className="muted">{copy.noSurface}</span>
                          )}
                        </span>
                      </th>
                      <td className="principles-table__surface">
                        {principle.surface?.route ? (
                          <a href={`#/${principle.surface.route}`} className="link-button">
                            {t(principle.surface.label, lang)}
                          </a>
                        ) : principle.surface ? (
                          <span className="small">{t(principle.surface.label, lang)}</span>
                        ) : (
                          <span className="small muted">{copy.noSurface}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))
      )}
    </>
  );
}
