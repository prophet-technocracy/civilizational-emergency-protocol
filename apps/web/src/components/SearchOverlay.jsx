import { MODULES, EPISTEMIC, t, formatNumber } from "../i18n.js";
import { Badge } from "./ui.jsx";
import { Icon } from "./icons.jsx";
import { useFocusTrap } from "../lib/focus.js";

// The command palette. Extracted from App.jsx (issue #49) so its states — idle,
// loading, results, empty, error — can be fixed without touching the shell.
export default function SearchOverlay({ lang, dict, term, onTerm, results, inputRef, onClose, onPick, retry }) {
  // Same trap as the drawer: Escape closes and hands focus back to whatever
  // opened the search, and Tab cycles through the results instead of escaping
  // into the page behind the scrim.
  const layerRef = useFocusTrap({ active: true, onEscape: onClose, initialFocus: inputRef });

  return (
    <div className="search-layer" role="dialog" aria-modal="true" aria-label={dict.searchLabel} ref={layerRef}>
      <button type="button" className="search-scrim" aria-label={dict.closeSearch} onClick={onClose} tabIndex={-1} />
      <div className="search-panel">
        <div className="search-panel__head">
          <Icon name="search" size={17} />
          <input
            ref={inputRef}
            type="search"
            value={term}
            onChange={(event) => onTerm(event.target.value)}
            placeholder={dict.searchPlaceholder}
            aria-label={dict.searchLabel}
            autoComplete="off"
          />
          <button type="button" className="icon-btn" onClick={onClose} aria-label={dict.closeSearch}>
            <Icon name="close" size={15} />
          </button>
        </div>
        <div className="search-panel__body">
          {term.trim().length < 2 ? (
            <p className="muted">{dict.searchPrompt}</p>
          ) : !results ? (
            <p className="muted">{dict.loading}</p>
          ) : results.total === 0 ? (
            <p className="muted">{dict.searchEmpty}</p>
          ) : (
            <>
              <p className="search-count">
                {formatNumber(results.total, lang)} {dict.searchResults}
              </p>
              <ul className="search-results">
                {results.results.map((result) => (
                  <li key={`${result.module}-${result.id}`}>
                    <button type="button" className="search-result" onClick={() => onPick(result)}>
                      <span className="search-result__mod">
                        {formatNumber(result.moduleNumber, lang)} · {t({ fa: MODULES[result.moduleNumber - 1].short.fa, en: MODULES[result.moduleNumber - 1].short.en }, lang)}
                      </span>
                      <span className="search-result__title">{t(result.title, lang)}</span>
                      <span className="search-result__sub">{t(result.subtitle, lang)}</span>
                      <span className="search-result__meta">
                        {t(result.kind, lang)} · <Badge tone={EPISTEMIC[result.epistemicStatus]?.tone ?? "neutral"}>{t(EPISTEMIC[result.epistemicStatus] ?? { fa: result.epistemicStatus, en: result.epistemicStatus }, lang)}</Badge>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
