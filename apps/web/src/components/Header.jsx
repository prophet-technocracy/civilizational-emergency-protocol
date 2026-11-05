import { t, formatNumber } from "../i18n.js";
import { Icon } from "./icons.jsx";

// The application header: brand, language and theme, the demo banner and the
// breadcrumb. Extracted from App.jsx (issue #49) so the shell only owns state.
export default function Header({
  dict,
  lang,
  theme,
  onTheme,
  onLangToggle,
  bannerOpen,
  onBannerToggle,
  navOpen,
  onNavToggle,
  navToggleRef,
  onSearch,
  onNavigate,
  activeModule,
  inert
}) {
  return (
    <header className="app-header" inert={inert || undefined}>
      <div className="app-header__top">
        <button
          type="button"
          className="icon-btn nav-toggle"
          ref={navToggleRef}
          aria-expanded={navOpen}
          aria-controls="primary-navigation"
          aria-label={dict.menu}
          onClick={onNavToggle}
        >
          <Icon name="menu" size={18} />
        </button>

        <button type="button" className="brand" onClick={() => onNavigate("dashboard")}>
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
          <button type="button" className="search-trigger" onClick={onSearch}>
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
              onClick={() => onTheme("light")}
              title={dict.themeLight}
            >
              <Icon name="sun" size={15} />
            </button>
            <button
              type="button"
              className={`seg ${theme === "dark" ? "is-active" : ""}`}
              aria-pressed={theme === "dark"}
              onClick={() => onTheme("dark")}
              title={dict.themeDark}
            >
              <Icon name="moon" size={15} />
            </button>
          </div>

          <button
            type="button"
            className="lang-btn"
            onClick={onLangToggle}
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
          <button type="button" className="icon-btn icon-btn--sm" onClick={onBannerToggle} aria-label={dict.demoDismiss}>
            <Icon name="close" size={13} />
          </button>
        </div>
      ) : (
        <button type="button" className="demo-banner demo-banner--collapsed" onClick={onBannerToggle}>
          <span className="demo-banner__dot" aria-hidden="true" />
          {dict.demoReopen}
        </button>
      )}

      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li>
            <button type="button" className="crumb" onClick={() => onNavigate("dashboard")}>
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
  );
}
