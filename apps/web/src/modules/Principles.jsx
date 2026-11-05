import { useState } from "react";
import { useApi } from "../lib/api.js";
import { t, formatNumber } from "../i18n.js";
import { localeStrings } from "../locales/index.js";
import { SectionHeader, Card, StateBlock, Badge, Callout, Empty, Stat } from "../components/ui.jsx";

// The four statuses map onto badge tones; anything unknown stays neutral rather
// than inventing a colour the reader would have to guess at.
const TONE = { covered: "good", partial: "warn", gap: "info", outside: "neutral" };

const STATUS_ORDER = ["covered", "partial", "gap", "outside"];

export default function Principles({ lang }) {
  const copy = localeStrings(lang).principles;
  const { status, payload, reload } = useApi("/api/v1/principles");
  const [filter, setFilter] = useState("all");

  if (status !== "ready") {
    return (
      <>
        <SectionHeader eyebrow={copy.eyebrow} title={copy.title} />
        <StateBlock status={status} lang={lang} onRetry={reload} />
      </>
    );
  }

  const { motherFile, chapters, summary, method, statuses } = payload.data;
  const statusCopy = (id) => copy.status[id] ?? id;

  const shown = filter === "all" ? null : filter;
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

      <Callout tone="warn" title={copy.draftTitle}>
        <p>{t(motherFile.sourceNote, lang)}</p>
        <p className="small muted">{copy.draftBody}</p>
      </Callout>

      <h2 className="h2">{copy.summaryTitle}</h2>
      <div className="grid grid--inline">
        <Stat label={copy.total} value={formatNumber(summary.total, lang)} lang={lang} />
        <Stat label={copy.status.covered} value={formatNumber(summary.demonstrated, lang)} tone="good" lang={lang} />
        <Stat label={copy.status.partial} value={formatNumber(summary.represented, lang)} tone="warn" lang={lang} />
        <Stat label={copy.status.gap} value={formatNumber(summary.gaps, lang)} tone="info" lang={lang} />
        <Stat label={copy.status.outside} value={formatNumber(summary.beyondSoftware, lang)} lang={lang} />
        <Stat label={copy.chaptersWith} value={formatNumber(chapters.length, lang)} lang={lang} />
      </div>

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
                <p className="small muted">{t(chapter.range, lang)}</p>
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
                    <tr key={principle.id}>
                      <td>
                        <Badge tone={TONE[principle.coverage] ?? "neutral"}>{statusCopy(principle.coverage)}</Badge>
                      </td>
                      <th scope="row" className="principles-table__body">
                        <span className="principles-table__title">
                          <span className="mono muted">{t(principle.label, lang)}</span> · {t(principle.title, lang)}
                        </span>
                        <span className="small muted principles-table__note">{t(principle.note, lang)}</span>
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
