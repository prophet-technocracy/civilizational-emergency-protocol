import { useEffect, useId, useRef } from "react";
import { useFocusTrap } from "../lib/focus.js";
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

export function StateBlock({ status, lang, onRetry }) {
  const dict = UI[lang];
  if (status === "loading") {
    return (
      <div className="state-block" role="status" aria-live="polite">
        <span className="spinner" aria-hidden="true" />
        <p>{dict.loading}</p>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="state-block state-block--error" role="alert">
        <p>{dict.loadError}</p>
        <button type="button" className="btn btn--ghost" onClick={onRetry}>
          {dict.retry}
        </button>
      </div>
    );
  }
  return null;
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

export function Toast({ message, tone = "info", onClose, lang = "fa" }) {
  const dict = UI[lang];

  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(onClose, 5200);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div className={`toast toast--${tone}`} role="status" aria-live="polite">
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
