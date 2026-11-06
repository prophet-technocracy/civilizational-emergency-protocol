import { useRef } from "react";
import { MODULES, EPISTEMIC, t, formatNumber } from "../i18n.js";
import { localeStrings } from "../locales/index.js";
import { Badge } from "./ui.jsx";
import { Icon } from "./icons.jsx";
import { useFocusTrap } from "../lib/focus.js";
import { hrefFor } from "../lib/routes.js";
import { isPlainLeftClick } from "../lib/links.js";

// The command palette. Extracted from App.jsx (issue #49) and given five
// distinct states (issue #29): a prompt, a load, results, an empty answer that
// names the query, and an outage. An API error must never read as "nothing
// found", and a stale list must never stay on screen under a new query.
export default function SearchOverlay({ lang, term, onTerm, state, inputRef, onClose, onPick, onRetry }) {
  const listRef = useRef(null);
  const copy = localeStrings(lang).shell.search;
  const status = state?.status ?? "idle";
  const payload = state?.payload ?? null;
  const query = (state?.term ?? term).trim();
  const results = status === "ready" && payload?.total > 0 ? payload.results : [];
  const hasResults = results.length > 0;

  // Escape clears the query first and closes second: a reader who typed a word,
  // read the results, and wants to try another word should not lose the palette.
  const onEscape = () => {
    if (term) {
      onTerm("");
      inputRef.current?.focus();
      return;
    }
    onClose();
  };

  // Same trap as the drawer: Escape closes and hands focus back to whatever
  // opened the search, and Tab cycles through the results instead of escaping
  // into the page behind the scrim.
  const layerRef = useFocusTrap({ active: true, onEscape, initialFocus: inputRef });

  // No role="combobox"/"listbox" here on purpose. Each result is a destination
  // with its own href, and an option may not contain a link — claiming a listbox
  // would either strip the link behaviour from every result or lie about the
  // markup. The count lives in a polite live region instead, which is what a
  // reader needs to know the palette answered.
  const resultNodes = () => [...(listRef.current?.querySelectorAll("a.search-result") ?? [])];

  // Arrows walk the palette vertically in both languages: the results are a
  // column, so nothing here mirrors in RTL.
  const onInputKeyDown = (event) => {
    if (!hasResults) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      resultNodes()[0]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const nodes = resultNodes();
      nodes[nodes.length - 1]?.focus();
    } else if (event.key === "Enter") {
      event.preventDefault();
      onPick(results[0]);
    }
  };

  const onListKeyDown = (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const nodes = resultNodes();
    const index = nodes.indexOf(document.activeElement);
    if (index < 0) return;
    event.preventDefault();
    const step = event.key === "ArrowDown" ? 1 : -1;
    const next = nodes[index + step];
    // Off either end the arrows return to the field they came from, so the
    // palette never traps a reader mid-list.
    if (next) next.focus();
    else inputRef.current?.focus();
  };

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
            aria-controls={hasResults ? "search-results" : undefined}
            onKeyDown={onInputKeyDown}
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

          {hasResults ? (
            <ul className="search-results" id="search-results" ref={listRef} onKeyDown={onListKeyDown}>
              {payload.results.map((result) => {
                // Not every result is a library module (principles, projects and
                // the referendum are not), so the chip is optional: an unknown
                // module number must render without a chip, never throw.
                const module = MODULES[result.moduleNumber - 1];
                return (
                  <li key={`${result.module}-${result.id}`}>
                    {/* A destination, so it is an anchor with a real href: the
                        browser keeps its own behaviour (new tab, copy link) and
                        Enter works because links activate natively. */}
                    <a
                      className="search-result"
                      href={hrefFor(result.target.view, result.target.recordId)}
                      onClick={(event) => {
                        if (!isPlainLeftClick(event)) return;
                        event.preventDefault();
                        onPick(result);
                      }}
                    >
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
                    </a>
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
