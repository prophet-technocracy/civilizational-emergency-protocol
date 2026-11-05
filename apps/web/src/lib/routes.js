// The route table and the small module descriptors every navigation surface
// needs. This lives outside App.jsx so the header, the sidebar, the search
// overlay and the tests can read the same shapes without importing the whole
// shell (issue #49). Rendering components stay in App.jsx: importing them here
// would make a cycle, and the map of view -> component is the shell's job.
import { MODULES, t, formatNumber } from "../i18n.js";
import { localeStrings } from "../locales/index.js";

// The five civic levels are the entry point; the twelve modules remain the
// library behind them. `#/levels` is the profile chooser, `#/levels/3` one level.
export const LEVELS_VIEW = "levels";
export const BANK_VIEW = "bank";
// The mother file's principles are read against the prototype on their own page.
export const PRINCIPLES_VIEW = "principles";
// The hub is the landing: one centre, six doors. `#/levels` stays the chooser.
export const HUB_VIEW = "hub";
// The two work surfaces the light rail promises: the queue that turns an amber
// principle green, and the arithmetic of a future vote. They hang off the hub,
// not off the six doors — the doors are levels, these are work.
export const PROGRAMME_VIEW = "programme";
export const REFERENDUM_VIEW = "referendum";
// An address that resolves to nothing gets a page that says so, instead of a
// plausible-looking wrong page (issue #39).
export const NOT_FOUND_VIEW = "not-found";

export const BANK_MODULE = {
  id: BANK_VIEW,
  number: null,
  icon: "bank",
  title: { fa: "بانک HMMT", en: "HMMT Bank" },
  short: { fa: "بانک", en: "Bank" }
};

export const HUB_MODULE = {
  id: HUB_VIEW,
  number: 0,
  icon: "layers",
  title: { fa: "مرکز", en: "Hub" },
  short: { fa: "مرکز", en: "Hub" }
};

export const PRINCIPLES_MODULE = {
  id: PRINCIPLES_VIEW,
  number: null,
  icon: "governance",
  title: { fa: "اصول سند مادر", en: "Mother-file principles" },
  short: { fa: "اصول", en: "Principles" }
};

export const LEVEL_HOME_MODULE = {
  id: LEVELS_VIEW,
  number: null,
  icon: "layers",
  title: { fa: "پنج سطح شهروندی", en: "Five civic levels" },
  short: { fa: "سطوح", en: "Levels" }
};

export const PROGRAMME_MODULE = {
  id: PROGRAMME_VIEW,
  number: null,
  icon: "projects",
  title: { fa: "برنامهٔ پوشش جزئی", en: "Partial-coverage programme" },
  short: { fa: "برنامه", en: "Programme" }
};

export const REFERENDUM_MODULE = {
  id: REFERENDUM_VIEW,
  number: null,
  icon: "ballot",
  title: { fa: "ابزار همه‌پرسی", en: "Referendum instrument" },
  short: { fa: "همه‌پرسی", en: "Referendum" }
};

/** The level id a hash may address, or null. Levels are 1-5 and nothing else. */
export function levelIdFromRecord(recordId) {
  const id = recordId ? decodeURIComponent(recordId) : null;
  return id && /^[1-5]$/.test(id) ? id : null;
}

export function readRouteFromHash(hash) {
  const raw = String(hash ?? "").replace(/^#\/?/, "");
  const [viewId, recordId] = raw.split("/");
  if (viewId === LEVELS_VIEW) {
    const id = levelIdFromRecord(recordId);
    // `#/levels/9` names a level that does not exist: say so rather than
    // quietly rendering the chooser the reader did not ask for.
    if (recordId && !id) return { view: NOT_FOUND_VIEW, recordId: null };
    return { view: LEVELS_VIEW, recordId: id };
  }
  if (viewId === BANK_VIEW) {
    return recordId ? { view: NOT_FOUND_VIEW, recordId: null } : { view: BANK_VIEW, recordId: null };
  }
  if (viewId === PRINCIPLES_VIEW) {
    // A principle is addressable (`#/principles/Z-01`) so a project can point at
    // the row it is working on (issue #38).
    if (!recordId) return { view: PRINCIPLES_VIEW, recordId: null };
    const principleId = decodeURIComponent(recordId);
    return /^[A-Za-z]{1,2}-[0-9]{1,3}$/.test(principleId)
      ? { view: PRINCIPLES_VIEW, recordId: principleId }
      : { view: NOT_FOUND_VIEW, recordId: null };
  }
  if (viewId === HUB_VIEW) {
    return { view: HUB_VIEW, recordId: null };
  }
  if (viewId === PROGRAMME_VIEW) {
    // Programme records are not addressable yet: a deep link would land on a
    // page it cannot open, so it is a not-found rather than a silent success.
    return recordId
      ? { view: NOT_FOUND_VIEW, recordId: null }
      : { view: PROGRAMME_VIEW, recordId: null };
  }
  if (viewId === REFERENDUM_VIEW) {
    return { view: REFERENDUM_VIEW, recordId: null };
  }
  if (raw === "") return { view: HUB_VIEW, recordId: null };
  const known = MODULES.some((module) => module.id === viewId);
  if (!known) return { view: NOT_FOUND_VIEW, recordId: null };
  return {
    view: viewId,
    recordId: recordId ? decodeURIComponent(recordId) : null
  };
}

export const NOT_FOUND_MODULE = {
  id: NOT_FOUND_VIEW,
  number: null,
  icon: "search",
  title: { fa: "صفحهٔ یافت‌نشده", en: "Page not found" },
  short: { fa: "یافت نشد", en: "Not found" }
};

/** The descriptor (number, icon, bilingual title) for a parsed route. */
export function moduleFor(route) {
  if (route.view === LEVELS_VIEW) return LEVEL_HOME_MODULE;
  if (route.view === BANK_VIEW) return BANK_MODULE;
  if (route.view === PRINCIPLES_VIEW) return PRINCIPLES_MODULE;
  if (route.view === HUB_VIEW) return HUB_MODULE;
  if (route.view === PROGRAMME_VIEW) return PROGRAMME_MODULE;
  if (route.view === REFERENDUM_VIEW) return REFERENDUM_MODULE;
  if (route.view === NOT_FOUND_VIEW) return NOT_FOUND_MODULE;
  return MODULES.find((module) => module.id === route.view) ?? MODULES[0];
}

/** An in-app URL for a view (and optional record), used by every link. */
export function hrefFor(viewId, recordId) {
  return recordId ? `#/${viewId}/${encodeURIComponent(recordId)}` : `#/${viewId}`;
}

/**
 * Everything the frame says about where the reader is: the label used in the
 * breadcrumb and the document title, the crumbs themselves (last one is the
 * current page), and the composed <title>. Pure, so the shapes can be tested
 * without rendering (issue #31).
 */
export function routeMeta(route, lang) {
  const strings = localeStrings(lang);
  const shell = strings.shell;
  const suffix = lang === "fa" ? "سامانهٔ عامل مدنی CEP" : "CEP Civilizational Operating System";
  const num = (value) => formatNumber(value, lang);
  const home = { label: shell.home, href: hrefFor(HUB_VIEW) };
  const page = (label, crumbs) => ({ label, title: `${label} · ${suffix}`, crumbs });
  const view = route?.view ?? HUB_VIEW;

  if (view === HUB_VIEW) {
    // The hub is home: a crumb pointing at itself would be noise.
    return page(strings.hub.navLabel, [{ label: strings.hub.navLabel }]);
  }
  if (view === NOT_FOUND_VIEW) {
    const label = shell.notFound.title;
    return { label, title: `${label} · ${suffix}`, crumbs: [home, { label }] };
  }
  if (view === LEVELS_VIEW) {
    if (!route.recordId) {
      return page(strings.levels.navLabel, [home, { label: strings.levels.navLabel }]);
    }
    const label = `${strings.hub.levelWord} ${num(route.recordId)} · ${strings.levels.titles[route.recordId] ?? ""}`.trim();
    return page(label, [
      home,
      { label: strings.levels.navLabel, href: hrefFor(LEVELS_VIEW) },
      { label }
    ]);
  }
  if (view === BANK_VIEW) {
    return page(strings.bank.navLabel, [home, { label: strings.bank.navLabel }]);
  }
  if (view === PRINCIPLES_VIEW) {
    if (!route.recordId) {
      return page(strings.principles.navLabel, [home, { label: strings.principles.navLabel }]);
    }
    const label = `${strings.principles.navLabel} · ${route.recordId}`;
    return page(label, [
      home,
      { label: strings.principles.navLabel, href: hrefFor(PRINCIPLES_VIEW) },
      { label: route.recordId }
    ]);
  }
  if (view === PROGRAMME_VIEW) {
    return page(strings.programme.navLabel, [home, { label: strings.programme.navLabel }]);
  }
  if (view === REFERENDUM_VIEW) {
    return page(strings.referendum.navLabel, [home, { label: strings.referendum.navLabel }]);
  }
  const module = moduleFor(route);
  const label = `${num(String(module.number).padStart(2, "0"))} · ${t(module.title, lang)}`;
  return page(label, [home, { label }]);
}

/** The in-app address of one principle row (issue #38). */
export function principleHref(principleId) {
  return hrefFor(PRINCIPLES_VIEW, principleId);
}

/** The DOM id a principle row is anchored by. */
export function principleAnchor(principleId) {
  return `principle-${principleId}`;
}
