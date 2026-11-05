// The route table and the small module descriptors every navigation surface
// needs. This lives outside App.jsx so the header, the sidebar, the search
// overlay and the tests can read the same shapes without importing the whole
// shell (issue #49). Rendering components stay in App.jsx: importing them here
// would make a cycle, and the map of view -> component is the shell's job.
import { MODULES } from "../i18n.js";

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
    return { view: LEVELS_VIEW, recordId: levelIdFromRecord(recordId) };
  }
  if (viewId === BANK_VIEW) {
    return { view: BANK_VIEW, recordId: null };
  }
  if (viewId === PRINCIPLES_VIEW) {
    return { view: PRINCIPLES_VIEW, recordId: null };
  }
  if (viewId === HUB_VIEW) {
    return { view: HUB_VIEW, recordId: null };
  }
  if (viewId === PROGRAMME_VIEW) {
    return { view: PROGRAMME_VIEW, recordId: recordId ? decodeURIComponent(recordId) : null };
  }
  if (viewId === REFERENDUM_VIEW) {
    return { view: REFERENDUM_VIEW, recordId: null };
  }
  const known = MODULES.some((module) => module.id === viewId);
  return {
    view: known ? viewId : raw === "" ? HUB_VIEW : "dashboard",
    recordId: recordId ? decodeURIComponent(recordId) : null
  };
}

/** The descriptor (number, icon, bilingual title) for a parsed route. */
export function moduleFor(route) {
  if (route.view === LEVELS_VIEW) return LEVEL_HOME_MODULE;
  if (route.view === BANK_VIEW) return BANK_MODULE;
  if (route.view === PRINCIPLES_VIEW) return PRINCIPLES_MODULE;
  if (route.view === HUB_VIEW) return HUB_MODULE;
  if (route.view === PROGRAMME_VIEW) return PROGRAMME_MODULE;
  if (route.view === REFERENDUM_VIEW) return REFERENDUM_MODULE;
  return MODULES.find((module) => module.id === route.view) ?? MODULES[0];
}

/** An in-app URL for a view (and optional record), used by every link. */
export function hrefFor(viewId, recordId) {
  return recordId ? `#/${viewId}/${encodeURIComponent(recordId)}` : `#/${viewId}`;
}
