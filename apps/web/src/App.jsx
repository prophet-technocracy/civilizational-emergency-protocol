import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UI, MODULES, DEPARTMENTS, EPISTEMIC, t, formatNumber } from "./i18n.js";
import { useDebounced, readStored, writeStored } from "./lib/api.js";
import { Drawer, ProvenanceBody, Badge } from "./components/ui.jsx";
import { useFocusTrap, prefersReducedMotion } from "./lib/focus.js";
import { Icon } from "./components/icons.jsx";
import { localeStrings } from "./locales/index.js";
import Dashboard from "./modules/Dashboard.jsx";
import Governance from "./modules/Governance.jsx";
import Transition from "./modules/Transition.jsx";
import Institutions from "./modules/Institutions.jsx";
import Archive from "./modules/Archive.jsx";
import Research from "./modules/Research.jsx";
import Verification from "./modules/Verification.jsx";
import Accountability from "./modules/Accountability.jsx";
import PublicServices from "./modules/PublicServices.jsx";
import Projects from "./modules/Projects.jsx";
import Simulations from "./modules/Simulations.jsx";
import DigitalLegacy from "./modules/DigitalLegacy.jsx";
import LevelHome from "./modules/LevelHome.jsx";
import Level from "./modules/Level.jsx";
import Bank from "./modules/Bank.jsx";
import Principles from "./modules/Principles.jsx";

const VIEWS = {
  dashboard: Dashboard,
  governance: Governance,
  transition: Transition,
  institutions: Institutions,
  "historical-archive": Archive,
  research: Research,
  verification: Verification,
  accountability: Accountability,
  "public-services": PublicServices,
  projects: Projects,
  simulations: Simulations,
  "digital-legacy": DigitalLegacy,
  bank: Bank,
  principles: Principles
};

// The five civic levels are the entry point; the twelve modules remain the
// library behind them. `#/levels` is the profile chooser, `#/levels/3` one level.
export const LEVELS_VIEW = "levels";
export const BANK_VIEW = "bank";
// The mother file's principles are read against the prototype on their own page.
export const PRINCIPLES_VIEW = "principles";

const BANK_MODULE = {
  id: BANK_VIEW,
  number: null,
  icon: "bank",
  title: { fa: "بانک HMMT", en: "HMMT Bank" },
  short: { fa: "بانک", en: "Bank" }
};

const PRINCIPLES_MODULE = {
  id: PRINCIPLES_VIEW,
  number: null,
  icon: "governance",
  title: { fa: "اصول سند مادر", en: "Mother-file principles" },
  short: { fa: "اصول", en: "Principles" }
};

const LEVEL_HOME_MODULE = {
  id: LEVELS_VIEW,
  number: null,
  icon: "layers",
  title: { fa: "پنج سطح شهروندی", en: "Five civic levels" },
  short: { fa: "سطوح", en: "Levels" }
};

export function readRouteFromHash(hash) {
  const raw = String(hash ?? "").replace(/^#\/?/, "");
  const [viewId, recordId] = raw.split("/");
  if (viewId === LEVELS_VIEW) {
    const id = recordId ? decodeURIComponent(recordId) : null;
    return { view: LEVELS_VIEW, recordId: id && /^[1-5]$/.test(id) ? id : null };
  }
  if (viewId === BANK_VIEW) {
    return { view: BANK_VIEW, recordId: null };
  }
  if (viewId === PRINCIPLES_VIEW) {
    return { view: PRINCIPLES_VIEW, recordId: null };
  }
  const known = MODULES.some((module) => module.id === viewId);
  return {
    view: known ? viewId : raw === "" ? LEVELS_VIEW : "dashboard",
    recordId: recordId ? decodeURIComponent(recordId) : null
  };
}

export default function App() {
  const [lang, setLang] = useState(() => readStored("cep.lang", "fa"));
  const [theme, setTheme] = useState(() => readStored("cep.theme", "light"));
  const [route, setRoute] = useState(() =>
    readRouteFromHash(typeof window === "undefined" ? "" : window.location.hash)
  );
  const [navOpen, setNavOpen] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [provenance, setProvenance] = useState(null);
  const searchInputRef = useRef(null);
  const navToggleRef = useRef(null);
  const mainRef = useRef(null);
  const routeMovedRef = useRef(false);
  const [isNarrow, setIsNarrow] = useState(false);
  const [policyId, setPolicyId] = useState("P-OPEN-DRAFT");
  const debouncedSearch = useDebounced(searchTerm, 220);

  const dict = UI[lang];
  const activeModule = useMemo(() => {
    if (route.view === LEVELS_VIEW) return LEVEL_HOME_MODULE;
    if (route.view === BANK_VIEW) return BANK_MODULE;
    if (route.view === PRINCIPLES_VIEW) return PRINCIPLES_MODULE;
    return MODULES.find((module) => module.id === route.view) ?? MODULES[0];
  }, [route.view]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("lang", lang);
    root.setAttribute("dir", lang === "fa" ? "rtl" : "ltr");
    root.setAttribute("data-theme", theme);
    writeStored("cep.lang", lang);
    writeStored("cep.theme", theme);
    document.title =
      lang === "fa"
        ? `${t(activeModule.title, "fa")} · سامانهٔ عامل مدنی CEP`
        : `${t(activeModule.title, "en")} · CEP Civilizational Operating System`;
  }, [lang, theme, activeModule]);

  // The module drawer only exists below 900px; above it the sidebar is a
  // permanent landmark and must stay reachable.
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return undefined;
    const query = window.matchMedia("(max-width: 900px)");
    const sync = () => {
      setIsNarrow(query.matches);
      if (!query.matches) setNavOpen(false);
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      // Marks a real navigation (not the first paint) so the effect below can
      // move focus to the new view once it has rendered.
      routeMovedRef.current = true;
      setRoute(readRouteFromHash(window.location.hash));
      setNavOpen(false);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus follows the route: after an in-app jump, keyboard and screen-reader
  // users are placed at the start of the new view instead of staying on a link
  // whose target has been replaced.
  useEffect(() => {
    if (!routeMovedRef.current) return;
    routeMovedRef.current = false;
    mainRef.current?.focus({ preventScroll: true });
  }, [route.view, route.recordId]);

  useEffect(() => {
    if (!searchOpen) return undefined;
    const term = debouncedSearch.trim();
    if (term.length < 2) {
      setSearchResults(null);
      return undefined;
    }
    let alive = true;
    fetch(`/api/v1/search?q=${encodeURIComponent(term)}`, { headers: { Accept: "application/json" }, credentials: "omit" })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("search failed"))))
      .then((payload) => {
        if (alive) setSearchResults(payload.data);
      })
      .catch(() => {
        if (alive) setSearchResults({ query: term, total: 0, results: [], error: true });
      });
    return () => {
      alive = false;
    };
  }, [debouncedSearch, searchOpen]);

  const navigate = useCallback((viewId, recordId) => {
    const target = recordId ? `#/${viewId}/${encodeURIComponent(recordId)}` : `#/${viewId}`;
    routeMovedRef.current = true;
    if (window.location.hash === target) {
      setRoute({ view: viewId, recordId: recordId ?? null });
    } else {
      window.location.hash = target;
    }
    setNavOpen(false);
    setSearchOpen(false);
    setSearchTerm("");
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchTerm("");
  }, []);

  // Below 900px the module list is a modal drawer: it traps focus while open,
  // Escape closes it, and focus goes back to the toggle. Closed, it is inert so
  // the off-canvas links cannot be tabbed into.
  const navRef = useFocusTrap({
    active: navOpen && isNarrow,
    onEscape: () => setNavOpen(false)
  });

  const openProvenance = useCallback((record) => setProvenance(record), []);

  const ViewComponent = VIEWS[route.view] ?? Dashboard;
  const isLevels = route.view === LEVELS_VIEW;
  // While a modal layer is open the page behind it is inert for assistive
  // technology as well as for Tab, which is what aria-modal promises.
  const overlayOpen = searchOpen || Boolean(provenance);

  return (
    <div className="app-shell" lang={lang} dir={lang === "fa" ? "rtl" : "ltr"}>
      <a className="skip-link" href="#main-content">
        {dict.skip}
      </a>

      <header className="app-header" inert={overlayOpen || undefined}>
        <div className="app-header__top">
          <button
            type="button"
            className="icon-btn nav-toggle"
            ref={navToggleRef}
            aria-expanded={navOpen}
            aria-controls="primary-navigation"
            aria-label={dict.menu}
            onClick={() => setNavOpen((value) => !value)}
          >
            <Icon name="menu" size={18} />
          </button>

          <button type="button" className="brand" onClick={() => navigate("dashboard")}>
            <span className="brand__mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="12" cy="12" r="3.1" />
                <path d="M12 2.6v3.2M12 18.2v3.2M2.6 12h3.2M18.2 12h3.2M5.4 5.4l2.3 2.3M16.3 16.3l2.3 2.3M18.6 5.4l-2.3 2.3M7.7 16.3l-2.3 2.3" />
              </svg>
            </span>
            <span className="brand__text">
              <span className="brand__name">
                {dict.brand} <span className="brand__accent">{dict.brandAccent}</span>
              </span>
              <span className="brand__sub">{dict.subtitle}</span>
            </span>
          </button>

          <div className="app-header__tools">
            <button type="button" className="search-trigger" onClick={() => setSearchOpen(true)}>
              <Icon name="search" size={15} />
              <span className="search-trigger__label">{dict.searchPlaceholder}</span>
              {/* The shortcut hint is decorative: keeping it out of the
                  accessible name makes the label match the visible label. */}
              <kbd aria-hidden="true">{dict.searchHint}</kbd>
            </button>

            <div className="tool-group" role="group" aria-label={dict.theme}>
              <button
                type="button"
                className={`seg ${theme === "light" ? "is-active" : ""}`}
                aria-pressed={theme === "light"}
                onClick={() => setTheme("light")}
                title={dict.themeLight}
              >
                <Icon name="sun" size={15} />
              </button>
              <button
                type="button"
                className={`seg ${theme === "dark" ? "is-active" : ""}`}
                aria-pressed={theme === "dark"}
                onClick={() => setTheme("dark")}
                title={dict.themeDark}
              >
                <Icon name="moon" size={15} />
              </button>
            </div>

            <button
              type="button"
              className="lang-btn"
              onClick={() => setLang(lang === "fa" ? "en" : "fa")}
              aria-label={`${dict.language}: ${dict.languageSwitch}`}
            >
              <Icon name="globe" size={15} />
              {dict.languageSwitch}
            </button>
          </div>
        </div>

        {bannerOpen ? (
          <div className="demo-banner" role="note">
            <span className="demo-banner__dot" aria-hidden="true" />
            <p>
              <strong>{dict.demoTitle}.</strong> {dict.demoBody}
            </p>
            <span className="demo-banner__meta">{dict.readOnly}</span>
            <button type="button" className="icon-btn icon-btn--sm" onClick={() => setBannerOpen(false)} aria-label={dict.demoDismiss}>
              <Icon name="close" size={13} />
            </button>
          </div>
        ) : (
          <button type="button" className="demo-banner demo-banner--collapsed" onClick={() => setBannerOpen(true)}>
            <span className="demo-banner__dot" aria-hidden="true" />
            {dict.demoReopen}
          </button>
        )}

        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <button type="button" className="crumb" onClick={() => navigate("dashboard")}>
                {dict.breadcrumbHome}
              </button>
            </li>
            <li aria-current="page">
              {activeModule.number ? `${formatNumber(activeModule.number, lang)} · ` : ""}
              {t(activeModule.title, lang)}
            </li>
          </ol>
        </nav>
      </header>

      <div className="app-body" inert={overlayOpen || undefined}>
        <nav
          id="primary-navigation"
          ref={navRef}
          className={`sidebar ${navOpen ? "is-open" : ""}`}
          aria-label={dict.modules}
          inert={isNarrow && !navOpen ? true : undefined}
        >
          <p className="sidebar__label">{dict.levelsNav}</p>
          <ul>
            <li>
              <a
                href={`#/${LEVELS_VIEW}`}
                className={`nav-item nav-item--levels ${route.view === LEVELS_VIEW ? "is-active" : ""}`}
                aria-current={route.view === LEVELS_VIEW ? "page" : undefined}
                onClick={() => setNavOpen(false)}
              >
                <span className="nav-item__num" aria-hidden="true">۵</span>
                <span className="nav-item__glyph" aria-hidden="true"><Icon name="layers" size={15} /></span>
                <span className="nav-item__title">{dict.levelsNav}</span>
              </a>
            </li>
          </ul>
          <p className="sidebar__label">{localeStrings(lang).bank.navLabel}</p>
          <ul>
            <li>
              <a
                href={`#/${BANK_VIEW}`}
                className={`nav-item nav-item--levels ${route.view === BANK_VIEW ? "is-active" : ""}`}
                aria-current={route.view === BANK_VIEW ? "page" : undefined}
                onClick={() => setNavOpen(false)}
              >
                <span className="nav-item__num" aria-hidden="true" />
                <span className="nav-item__glyph" aria-hidden="true"><Icon name="bank" size={15} /></span>
                <span className="nav-item__title">{t(BANK_MODULE.title, lang)}</span>
              </a>
            </li>
          </ul>
          <p className="sidebar__label">{localeStrings(lang).principles.navLabel}</p>
          <ul>
            <li>
              <a
                href={`#/${PRINCIPLES_VIEW}`}
                className={`nav-item nav-item--levels ${route.view === PRINCIPLES_VIEW ? "is-active" : ""}`}
                aria-current={route.view === PRINCIPLES_VIEW ? "page" : undefined}
                onClick={() => setNavOpen(false)}
              >
                <span className="nav-item__num" aria-hidden="true" />
                <span className="nav-item__glyph" aria-hidden="true"><Icon name="governance" size={15} /></span>
                <span className="nav-item__title">{t(PRINCIPLES_MODULE.title, lang)}</span>
              </a>
            </li>
          </ul>
          <p className="sidebar__label">{dict.modules}</p>
          <ul>
            {MODULES.map((module) => {
              const active = module.id === route.view;
              return (
                <li key={module.id}>
                  <a
                    href={`#/${module.id}`}
                    className={`nav-item ${active ? "is-active" : ""}`}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setNavOpen(false)}
                  >
                    <span className="nav-item__num">{formatNumber(String(module.number).padStart(2, "0"), lang)}</span>
                    <span className="nav-item__glyph" aria-hidden="true">
                      <Icon name={module.icon} size={15} />
                    </span>
                    <span className="nav-item__title">{t(module.title, lang)}</span>
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="sidebar__foot">
            <p className="mono">CEP · v1.0.0</p>
            <p>{DEPARTMENTS["DEPT-G"][lang]} · {DEPARTMENTS["DEPT-H"][lang]}</p>
          </div>
        </nav>

        {navOpen ? <button type="button" className="nav-scrim" aria-label={dict.close} onClick={() => setNavOpen(false)} /> : null}

        <main id="main-content" className="content" tabIndex={-1} ref={mainRef}>
          {isLevels ? (
            route.recordId ? (
              <Level
                key={`level-${route.recordId}`}
                lang={lang}
                dict={dict}
                navigate={navigate}
                levelId={route.recordId}
                policyId={policyId}
                onPolicyChange={setPolicyId}
              />
            ) : (
              <LevelHome key="levels" lang={lang} dict={dict} navigate={navigate} />
            )
          ) : (
            <ViewComponent
              key={route.view}
              lang={lang}
              dict={dict}
              navigate={navigate}
              openProvenance={openProvenance}
              initialRecordId={route.recordId}
            />
          )}

          <footer className="app-footer">
            <p>{dict.footer}</p>
            <p className="app-footer__meta">{dict.footerMeta}</p>
            <p className="app-footer__meta">
              <Badge tone="warn">{dict.governanceNote}</Badge>
            </p>
          </footer>
        </main>
      </div>

      {searchOpen ? (
        <SearchOverlay
          lang={lang}
          dict={dict}
          term={searchTerm}
          onTerm={setSearchTerm}
          results={searchResults}
          inputRef={searchInputRef}
          onClose={closeSearch}
          onPick={(result) => navigate(result.target.view, result.target.recordId)}
        />
      ) : null}

      <Drawer
        open={Boolean(provenance)}
        onClose={() => setProvenance(null)}
        title={dict.provenanceTitle}
        subtitle={provenance ? `${provenance.id} — ${provenance.label ?? ""}` : ""}
        lang={lang}
      >
        {provenance ? <ProvenanceBody record={provenance} lang={lang} /> : null}
      </Drawer>

    </div>
  );
}

function SearchOverlay({ lang, dict, term, onTerm, results, inputRef, onClose, onPick }) {
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
