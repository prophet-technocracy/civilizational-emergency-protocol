import { MODULES, EPISTEMIC, t, formatNumber } from "../i18n.js";
import { localeStrings } from "../locales/index.js";
import { Badge } from "./ui.jsx";
import { Icon } from "./icons.jsx";
import { useFocusTrap } from "../lib/focus.js";

// The command palette. Extracted from App.jsx (issue #49) and given five
// distinct states (issue #29): a prompt, a load, results, an empty answer that
// names the query, and an outage. An API error must never read as "nothing
// found", and a stale list must never stay on screen under a new query.
export default function SearchOverlay({ lang, term, onTerm, state, inputRef, onClose, onPick, onRetry }) {
  // Same trap as the drawer: Escape closes and hands focus back to whatever
  // opened the search, and Tab cycles through the results instead of escaping
  // into the page behind the scrim.
  const layerRef = useFocusTrap({ active: true, onEscape: onClose, initialFocus: inputRef });
  const copy = localeStrings(lang).shell.search;
  const status = state?.status ?? "idle";
  const payload = state?.payload ?? null;
  const query = (state?.term ?? term).trim();

  return (
    <div className="search-layer" role="dialog" aria-modal="true" aria-label={copy.label} ref={layerRef}>
      <button type="button" className="search-scrim" aria-label={copy.close} onClick={onClose} tabIndex={-1} />
      <div className="search-panel">
        <div className="search-panel__head">
          <Icon name="search" size={17} />
          <input
            ref={inputRef}
            type="search"
            value={term}
            onChange={(event) => onTerm(event.target.value)}
            placeholder={copy.placeholder}
            aria-label={copy.label}
            autoComplete="off"
            aria-describedby="search-status"
          />
          <button type="button" className="icon-btn" onClick={onClose} aria-label={copy.close}>
            <Icon name="close" size={15} />
          </button>
        </div>
        <div className="search-panel__body" aria-busy={status === "loading" || undefined}>
          {/* A polite live region carries the quiet states, so a screen reader
              hears the change instead of re-reading the panel. The outage is an
              alert of its own: it is the one state a reader must not miss. */}
          <div id="search-status" role="status" aria-live="polite">
            {status === "idle" ? <p className="muted">{copy.prompt}</p> : null}

            {status === "loading" ? (
              <p className="muted search-state--loading">
                <span className="spinner" aria-hidden="true" /> {copy.searching}
              </p>
            ) : null}

            {status === "ready" && payload?.total === 0 ? (
              <p className="muted">{copy.emptyFor.replace("{query}", query)}</p>
            ) : null}

            {status === "ready" && payload?.total > 0 ? (
              <p className="search-count">
                {formatNumber(payload.total, lang)} {copy.results}
              </p>
            ) : null}
          </div>

          {status === "error" ? (
            <div className="search-state search-state--error" role="alert">
              <p>{copy.error}</p>
              <button type="button" className="btn btn--ghost btn--sm" onClick={onRetry}>
                {copy.retry}
              </button>
            </div>
          ) : null}

          {status === "ready" && payload?.total > 0 ? (
            <ul className="search-results">
              {payload.results.map((result) => {
                // Not every result is a library module (principles, projects and
                // the referendum are not), so the chip is optional: an unknown
                // module number must render without a chip, never throw.
                const module = MODULES[result.moduleNumber - 1];
                return (
                  <li key={`${result.module}-${result.id}`}>
                    <button type="button" className="search-result" onClick={() => onPick(result)}>
                      {module ? (
                        <span className="search-result__mod">
                          {formatNumber(result.moduleNumber, lang)} · {t(module.short, lang)}
                        </span>
                      ) : null}
                      <span className="search-result__title">{t(result.title, lang)}</span>
                      <span className="search-result__sub">{t(result.subtitle, lang)}</span>
                      <span className="search-result__meta">
                        {t(result.kind, lang)} · <Badge tone={EPISTEMIC[result.epistemicStatus]?.tone ?? "neutral"}>{t(EPISTEMIC[result.epistemicStatus] ?? { fa: result.epistemicStatus, en: result.epistemicStatus }, lang)}</Badge>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
