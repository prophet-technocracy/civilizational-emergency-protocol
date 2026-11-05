import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UI } from "./i18n.js";
import { useDebounced, readStored, writeStored } from "./lib/api.js";
import { Drawer, ProvenanceBody, Badge } from "./components/ui.jsx";
import { useFocusTrap, prefersReducedMotion } from "./lib/focus.js";
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
import Programme from "./modules/Programme.jsx";
import Referendum from "./modules/Referendum.jsx";
import Hub from "./modules/Hub.jsx";
import NotFound from "./modules/NotFound.jsx";
import KeyDock from "./components/KeyDock.jsx";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import SearchOverlay from "./components/SearchOverlay.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import {
  LEVELS_VIEW,
  BANK_VIEW,
  PRINCIPLES_VIEW,
  HUB_VIEW,
  PROGRAMME_VIEW,
  REFERENDUM_VIEW,
  NOT_FOUND_VIEW,
  readRouteFromHash,
  routeMeta,
  hrefFor
} from "./lib/routes.js";

// Re-exported so existing imports (tests, modules, the key dock) keep working
// after the route table moved into lib/routes.js (issue #49).
export {
  LEVELS_VIEW,
  BANK_VIEW,
  PRINCIPLES_VIEW,
  HUB_VIEW,
  PROGRAMME_VIEW,
  REFERENDUM_VIEW,
  NOT_FOUND_VIEW,
  readRouteFromHash,
  routeMeta
};

const VIEWS = {
  hub: Hub,
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
  principles: Principles,
  programme: Programme,
  referendum: Referendum,
  "not-found": NotFound
};

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
  // idle | loading | ready | error, plus the payload and the term it answers.
  const [search, setSearch] = useState({ status: "idle", term: "", payload: null });
  const [searchNonce, setSearchNonce] = useState(0);
  const [provenance, setProvenance] = useState(null);
  const searchInputRef = useRef(null);
  const navToggleRef = useRef(null);
  const mainRef = useRef(null);
  const routeMovedRef = useRef(false);
  const [isNarrow, setIsNarrow] = useState(false);
  const [policyId, setPolicyId] = useState("P-OPEN-DRAFT");
  const debouncedSearch = useDebounced(searchTerm, 220);

  const dict = UI[lang];
  // Where the reader is, named once and shared by the title and the breadcrumb.
  const meta = useMemo(() => routeMeta(route, lang), [route, lang]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("lang", lang);
    root.setAttribute("dir", lang === "fa" ? "rtl" : "ltr");
    root.setAttribute("data-theme", theme);
    writeStored("cep.lang", lang);
    writeStored("cep.theme", theme);
    document.title = meta.title;
  }, [lang, theme, meta]);

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
      setSearch({ status: "idle", term: "", payload: null });
      return undefined;
    }
    // A new query clears the previous answer instead of leaving a stale list
    // (and its count) under the new word: loading is a state of its own.
    let alive = true;
    setSearch((previous) =>
      previous.term === term && previous.status === "ready" && searchNonce === 0
        ? previous
        : { status: "loading", term, payload: null }
    );
    fetch(`/api/v1/search?q=${encodeURIComponent(term)}`, { headers: { Accept: "application/json" }, credentials: "omit" })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("search failed"))))
      .then((payload) => {
        if (alive) setSearch({ status: "ready", term, payload: payload.data });
      })
      .catch(() => {
        // An outage is not an empty answer (issue #29).
        if (alive) setSearch({ status: "error", term, payload: null });
      });
    return () => {
      alive = false;
    };
  }, [debouncedSearch, searchOpen, searchNonce]);

  const navigate = useCallback((viewId, recordId) => {
    const target = hrefFor(viewId, recordId);
    routeMovedRef.current = true;
    if (window.location.hash === target) {
      setRoute({ view: viewId, recordId: recordId ?? null });
    } else {
      window.location.hash = target;
    }
    setNavOpen(false);
    setSearchOpen(false);
    setSearchTerm("");
    setSearch({ status: "idle", term: "", payload: null });
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchTerm("");
    setSearch({ status: "idle", term: "", payload: null });
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

      <Header
        dict={dict}
        lang={lang}
        theme={theme}
        onTheme={setTheme}
        onLangToggle={() => setLang(lang === "fa" ? "en" : "fa")}
        bannerOpen={bannerOpen}
        onBannerToggle={() => setBannerOpen((value) => !value)}
        navOpen={navOpen}
        onNavToggle={() => setNavOpen((value) => !value)}
        navToggleRef={navToggleRef}
        onSearch={() => setSearchOpen(true)}
        crumbs={meta.crumbs}
        crumbLabel={localeStrings(lang).shell.breadcrumb}
        inert={overlayOpen}
      />

      <div className="app-body" inert={overlayOpen || undefined}>
        <Sidebar
          lang={lang}
          dict={dict}
          route={route}
          isNarrow={isNarrow}
          navOpen={navOpen}
          navRef={navRef}
          onClose={() => setNavOpen(false)}
        />

        {navOpen ? <button type="button" className="nav-scrim" aria-label={dict.close} onClick={() => setNavOpen(false)} /> : null}

        <main id="main-content" className="content" tabIndex={-1} ref={mainRef}>
          {/* One boundary per route: a broken view must not take the header,
              the navigation or the frame with it, and moving to another page
              must start from a clean state. */}
          <ErrorBoundary key={`${route.view}-${route.recordId ?? ""}`} lang={lang}>
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
              route={route}
              openProvenance={openProvenance}
              onSearch={() => setSearchOpen(true)}
              initialRecordId={route.recordId}
            />
          )}
          </ErrorBoundary>

          <footer className="app-footer">
            <p>{dict.footer}</p>
            <p className="app-footer__meta">{dict.footerMeta}</p>
            <p className="app-footer__meta">
              <Badge tone="warn">{dict.governanceNote}</Badge>
            </p>
          </footer>
        </main>
      </div>

      <KeyDock lang={lang} route={route} navigate={navigate} />

      {searchOpen ? (
        <SearchOverlay
          lang={lang}
          term={searchTerm}
          onTerm={setSearchTerm}
          state={search}
          inputRef={searchInputRef}
          onClose={closeSearch}
          onRetry={() => setSearchNonce((value) => value + 1)}
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
