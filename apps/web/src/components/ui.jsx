import { useEffect, useId, useRef, useState } from "react";
import { useFocusTrap } from "../lib/focus.js";
import { useDataHealth } from "../lib/api.js";
import { EPISTEMIC, UI, t, formatNumber } from "../i18n.js";
import { Icon } from "./icons.jsx";

export function Badge({ tone = "neutral", children, title }) {
  return (
    <span className={`badge badge--${tone}`} title={title}>
      {children}
    </span>
  );
}

export function EpistemicBadge({ status, lang }) {
  const meta = EPISTEMIC[status] ?? { fa: status, en: status, tone: "neutral" };
  return (
    <Badge tone={meta.tone} title={`${UI[lang].epistemicStatus}: ${t(meta, lang)}`}>
      <span aria-hidden="true" className="badge__dot" />
      {t(meta, lang)}
    </Badge>
  );
}

export function SectionHeader({ eyebrow, title, lede, actions }) {
  return (
    <header className="section-head">
      <div className="section-head__text">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {lede ? <p className="lede">{lede}</p> : null}
      </div>
      {actions ? <div className="section-head__actions">{actions}</div> : null}
    </header>
  );
}

export function Card({ title, subtitle, actions, children, className = "", as: Tag = "section" }) {
  return (
    <Tag className={`card ${className}`.trim()}>
      {title || actions ? (
        <div className="card__head">
          <div>
            {title ? <h2 className="card__title">{title}</h2> : null}
            {subtitle ? <p className="card__subtitle">{subtitle}</p> : null}
          </div>
          {actions ? <div className="card__actions">{actions}</div> : null}
        </div>
      ) : null}
      <div className="card__body">{children}</div>
    </Tag>
  );
}

export function Callout({ tone = "info", title, children }) {
  return (
    <div className={`callout callout--${tone}`} role={tone === "danger" ? "alert" : "note"}>
      {title ? <p className="callout__title">{title}</p> : null}
      <div className="callout__body">{children}</div>
    </div>
  );
}

// Which sentence a failure gets. The kind comes from lib/request.mjs, which is
// the only place that knows the difference between a dead connection, a slow
// server, a 500 and a payload that breaks the demo contract (#44).
const ERROR_COPY = {
  offline: "errorOffline",
  timeout: "errorTimeout",
  http: "errorServer",
  contract: "errorContract",
  network: "errorNetwork"
};

export function StateBlock({ status, lang, onRetry, error = null, stale = false }) {
  const dict = UI[lang];
  if (status === "loading") {
    // A skeleton rather than a bare spinner: the bar has a shape, so the page
    // does not jump when the data lands, and the announcement happens once, in
    // text, for readers who are not looking at the animation.
    return (
      <div className="state-block" role="status" aria-live="polite">
        <div className="skeleton" aria-hidden="true">
          <span className="skeleton__line skeleton__line--wide" />
          <span className="skeleton__line" />
          <span className="skeleton__line skeleton__line--short" />
        </div>
        <p className="sr-only">{dict.loading}</p>
      </div>
    );
  }
  if (status === "error") {
    const detail = [
      error?.status ? `${dict.errorStatus}: ${error.status}` : null,
      error?.detail ?? null
    ].filter(Boolean).join(" · ");
    return (
      <div className="state-block state-block--error" role="alert">
        <p>{dict[ERROR_COPY[error?.kind] ?? "loadError"] ?? dict.loadError}</p>
        {detail ? (
          // Developer detail behind a disclosure: the reader gets a sentence and
          // a button, the person debugging gets the status code and the reason.
          <details className="state-block__detail">
            <summary>{dict.errorDetails}</summary>
            <p className="mono small">{detail}</p>
          </details>
        ) : null}
        <button type="button" className="btn btn--ghost" onClick={onRetry}>
          {dict.retry}
        </button>
      </div>
    );
  }
  if (status === "ready" && stale) {
    // Data is on screen and the refresh failed. Saying so is the whole point of
    // keeping the data instead of replacing it with an error page.
    return (
      <p className="stale-note" role="status" aria-live="polite">
        {dict.staleData}
      </p>
    );
  }
  return null;
}

/**
 * The shell-level signal: something failed, even if every screen still has data
 * to show. Renders nothing while the app is healthy.
 */
export function DataHealthNotice({ lang }) {
  const health = useDataHealth();
  if (health.state === "ok") return null;
  return (
    <div className="data-health" role="status" aria-live="polite">
      <span className="data-health__dot" aria-hidden="true" />
      <p>{UI[lang].dataHealth}</p>
    </div>
  );
}

export function Empty({ lang, children }) {
  return <p className="empty">{children ?? UI[lang].empty}</p>;
}

export function Stat({ label, value, note, tone = "neutral", lang = "fa" }) {
  const isNumeric = typeof value === "number";
  return (
    <div className={`stat stat--${tone}`}>
      <p className="stat__label">{label}</p>
      <p className={isNumeric ? "stat__value stat__value--num" : "stat__value"}>
        {isNumeric ? formatNumber(value, lang) : value}
      </p>
      {note ? <p className="stat__note">{note}</p> : null}
    </div>
  );
}

// A ratio is spoken, never drawn with a slash: `۷ از ۱۰`, in the reader's own
// digits, because a slash ratio reverses in the RTL layout (issue #36).
export function BarRow({ label, value, max, tone = "info", display, lang = "fa" }) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  const shown = display ?? formatNumber(value, lang);
  return (
    <div className="bar-row">
      <div className="bar-row__head">
        <span>{label}</span>
        <span className="bar-row__value">{shown}</span>
      </div>
      <div
        className="bar"
        role="img"
        aria-label={`${label}: ${shown} ${UI[lang].of} ${formatNumber(max, lang)}`}
      >
        <span className={`bar__fill bar__fill--${tone}`} style={{ inlineSize: `${pct}%` }} />
      </div>
    </div>
  );
}

export function Meter({ value, max = 6, label, tone = "good", lang = "fa" }) {
  const cells = Array.from({ length: max }, (_, index) => index < value);
  return (
    <span
      className="meter"
      role="img"
      aria-label={`${label}: ${formatNumber(value, lang)} ${UI[lang].of} ${formatNumber(max, lang)}`}
    >
      {cells.map((filled, index) => (
        <span key={index} className={`meter__cell ${filled ? `meter__cell--${tone}` : ""}`} />
      ))}
    </span>
  );
}

export function Disclosure({ summary, children, defaultOpen = false, meta }) {
  const id = useId();
  return (
    <details className="disclosure" open={defaultOpen}>
      <summary>
        <span>{summary}</span>
        {meta ? <span className="disclosure__meta">{meta}</span> : null}
      </summary>
      <div className="disclosure__body" id={id}>
        {children}
      </div>
    </details>
  );
}

export function Drawer({ open, onClose, title, subtitle, lang, children }) {
  const closeRef = useRef(null);
  const titleId = useId();
  const dict = UI[lang];
  // Escape, Tab cycling and returning focus to the button that opened the
  // drawer are handled by the shared trap, so the overlay cannot strand a
  // keyboard user behind the scrim.
  const panelRef = useFocusTrap({ active: open, onEscape: onClose, initialFocus: closeRef });

  if (!open) return null;

  return (
    <div className="drawer-layer" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button type="button" className="drawer-scrim" aria-label={dict.close} onClick={onClose} tabIndex={-1} />
      <aside className="drawer" ref={panelRef}>
        <div className="drawer__head">
          <div>
            <p className="eyebrow">{dict.provenance}</p>
            <h2 id={titleId}>{title}</h2>
            {subtitle ? <p className="card__subtitle">{subtitle}</p> : null}
          </div>
          <button type="button" className="icon-btn" onClick={onClose} ref={closeRef} aria-label={dict.close}>
            <Icon name="close" size={15} />
          </button>
        </div>
        <div className="drawer__body">{children}</div>
      </aside>
    </div>
  );
}

export function FieldList({ rows }) {
  return (
    <dl className="field-list">
      {rows.map((row) => (
        <div className="field-list__row" key={row.label}>
          <dt>{row.label}</dt>
          <dd>{row.value ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ProvenanceBody({ record, lang, onInspectClaim }) {
  const dict = UI[lang];
  return (
    <div className="provenance">
      <div className="provenance__top">
        <EpistemicBadge status={record.epistemicStatus} lang={lang} />
        {record.confidence ? <Badge tone="info">{record.confidence}</Badge> : null}
      </div>
      <FieldList rows={record.rows ?? []} />

      <h3 className="minor-heading">{dict.contradictions}</h3>
      {record.contradictions && record.contradictions.length > 0 ? (
        <ul className="tight-list">
          {record.contradictions.map((item, index) => (
            <li key={index}>
              <strong>{item.with ?? item.topic ?? ""}</strong>
              <p>{t(item.note ?? item.claim, lang)}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">{dict.noContradictions}</p>
      )}

      {record.revisions && record.revisions.length > 0 ? (
        <>
          <h3 className="minor-heading">{dict.revisionHistory}</h3>
          <ol className="timeline timeline--compact">
            {record.revisions.map((revision, index) => (
              <li key={index}>
                <span className="timeline__dot" aria-hidden="true" />
                <div>
                  <p className="timeline__title">
                    {revision.version} · {revision.date}
                  </p>
                  <p className="timeline__body">{t(revision.change, lang)}</p>
                  {revision.author ? <p className="muted">{t(revision.author, lang)}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </>
      ) : null}

      {record.footer ? <div className="provenance__footer">{record.footer}</div> : null}
      {onInspectClaim ? (
        <button type="button" className="btn btn--primary" onClick={onInspectClaim}>
          {dict.openInResearch}
        </button>
      ) : null}
    </div>
  );
}

/**
 * How long a toast may stay, or `null` when it must not close itself.
 *
 * A toast that vanishes while it is being read is a timing failure (WCAG
 * 2.2.1), so the clock stops while the toast is hovered, focused, or while the
 * tab is in the background. An error stays until it is dismissed: the reader
 * decides when the bad news is over (issue #51).
 */
export function nextToastDelay({ tone, remaining, paused = false, hidden = false, duration = 5200 }) {
  if (tone === "error") return null;
  if (paused || hidden) return null;
  const left = Number.isFinite(remaining) ? remaining : duration;
  return Math.max(600, left);
}

export function Toast({ message, tone = "info", onClose, lang = "fa", duration = 5200 }) {
  const dict = UI[lang];
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const remaining = useRef(duration);

  // A toast still open when the tab is hidden would expire unread; the clock
  // waits for the reader to come back.
  useEffect(() => {
    if (typeof document === "undefined" || !document.addEventListener) return undefined;
    const onVisibility = () => setHidden(document.hidden === true);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // A new message starts a new clock; the decrement in the next effect only
  // ever shortens the clock that is already running.
  useEffect(() => {
    remaining.current = duration;
  }, [message, duration]);

  useEffect(() => {
    if (!message) return undefined;
    const delay = nextToastDelay({ tone, remaining: remaining.current, paused, hidden, duration });
    if (delay === null) return undefined;
    const started = Date.now();
    const timer = setTimeout(onClose, delay);
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(600, remaining.current - (Date.now() - started));
    };
  }, [message, tone, paused, hidden, onClose, duration]);

  if (!message) return null;
  return (
    <div
      className={`toast toast--${tone}`}
      role={tone === "error" ? "alert" : "status"}
      aria-live={tone === "error" ? "assertive" : "polite"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <p>{message}</p>
      <button type="button" className="icon-btn icon-btn--sm" onClick={onClose} aria-label={dict.close}>
        <Icon name="close" size={13} />
      </button>
    </div>
  );
}

export function CountPill({ value, lang }) {
  return <span className="count-pill">{formatNumber(value, lang)}</span>;
}

export function Toggle({ active, onClick, children, disabled = false, title }) {
  return (
    <button
      type="button"
      className={`toggle ${active ? "is-active" : ""}`}
      aria-pressed={active}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
}
