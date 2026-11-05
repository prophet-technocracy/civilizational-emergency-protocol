import { MODULES, DEPARTMENTS, t, formatNumber } from "../i18n.js";
import { localeStrings } from "../locales/index.js";
import { Icon } from "./icons.jsx";
import { LEVELS_VIEW, PRINCIPLES_VIEW, PROGRAMME_VIEW, REFERENDUM_VIEW, PRINCIPLES_MODULE } from "../lib/routes.js";

// The permanent landmark navigation: the work surfaces, then the twelve library
// modules. Extracted from App.jsx (issue #49).
export default function Sidebar({ lang, dict, route, isNarrow, navOpen, navRef, onClose }) {
  const strings = localeStrings(lang);
  return (
    <nav
      id="primary-navigation"
      ref={navRef}
      className={`sidebar ${navOpen ? "is-open" : ""}`}
      aria-label={dict.modules}
      inert={isNarrow && !navOpen ? true : undefined}
    >
      {/* The levels and the bank live on the key dock at the bottom edge.
          The sidebar keeps one way into the chooser and says where the rest
          went, so there are not two navigations pretending to be one. */}
      <p className="sidebar__label">{strings.hub.navLabel}</p>
      <ul>
        <li>
          <a
            href={`#/${LEVELS_VIEW}`}
            className={`nav-item nav-item--levels ${route.view === LEVELS_VIEW ? "is-active" : ""}`}
            aria-current={route.view === LEVELS_VIEW ? "page" : undefined}
            onClick={onClose}
          >
            <span className="nav-item__num" aria-hidden="true">۵</span>
            <span className="nav-item__glyph" aria-hidden="true"><Icon name="layers" size={15} /></span>
            <span className="nav-item__title">{dict.levelsNav}</span>
          </a>
        </li>
      </ul>
      <p className="sidebar__hint">{strings.hub.dockHint}</p>
      <p className="sidebar__label">{strings.principles.navLabel}</p>
      <ul>
        <li>
          <a
            href={`#/${PRINCIPLES_VIEW}`}
            className={`nav-item nav-item--levels ${route.view === PRINCIPLES_VIEW ? "is-active" : ""}`}
            aria-current={route.view === PRINCIPLES_VIEW ? "page" : undefined}
            onClick={onClose}
          >
            <span className="nav-item__num" aria-hidden="true" />
            <span className="nav-item__glyph" aria-hidden="true"><Icon name="governance" size={15} /></span>
            <span className="nav-item__title">{t(PRINCIPLES_MODULE.title, lang)}</span>
          </a>
        </li>
      </ul>
      <p className="sidebar__label">{strings.programme.navLabel}</p>
      <ul>
        <li>
          <a
            href={`#/${PROGRAMME_VIEW}`}
            className={`nav-item nav-item--levels ${route.view === PROGRAMME_VIEW ? "is-active" : ""}`}
            aria-current={route.view === PROGRAMME_VIEW ? "page" : undefined}
            onClick={onClose}
          >
            <span className="nav-item__num" aria-hidden="true" />
            <span className="nav-item__glyph" aria-hidden="true"><Icon name="projects" size={15} /></span>
            <span className="nav-item__title">{strings.programme.navLabel}</span>
          </a>
        </li>
        <li>
          <a
            href={`#/${REFERENDUM_VIEW}`}
            className={`nav-item nav-item--levels ${route.view === REFERENDUM_VIEW ? "is-active" : ""}`}
            aria-current={route.view === REFERENDUM_VIEW ? "page" : undefined}
            onClick={onClose}
          >
            <span className="nav-item__num" aria-hidden="true" />
            <span className="nav-item__glyph" aria-hidden="true"><Icon name="ballot" size={15} /></span>
            <span className="nav-item__title">{strings.referendum.navLabel}</span>
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
                onClick={onClose}
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
  );
}
