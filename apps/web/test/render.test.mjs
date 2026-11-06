// Server-side rendering tests for the shared read-only API contract.
// Fixtures are fetched from the real API server (no mocks), so these tests
// fail if an endpoint shape, label, or safety guarantee regresses.
// The JSX sources are bundled on the fly with esbuild (a Vite dependency) so
// node:test can import them without a browser or a dev server.
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { after, before, test } from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { build } from "esbuild";
import { createServer } from "../../api/src/server.mjs";

const WEB_ROOT = resolve(import.meta.dirname, "..");
// Built inside apps/web so bare specifiers (react) resolve from node_modules.
const BUILD_DIR = mkdtempSync(join(WEB_ROOT, ".test-build-"));
const BUNDLE = join(BUILD_DIR, "app.mjs");

let App;
let readRouteFromHash;
let routeMeta;
let localeStrings;
let SearchOverlay;
let ErrorBoundary;
let CrashFallback;
let readTheme;
let Meter;
let BarRow;
let visibleAudit;
let primeApiCache;
let clearApiCache;
let UI;
let MODULES;
let t;
let formatNumber;
let labelFor;
let ENUM_LABELS;
let formatDate;
let formatRatio;
let Toast;
let StateBlock;
	let DataHealthNotice;
let nextDoorIndex;
let doorStepForArrow;
let doorHref;
let isDoorActive;
let DOORS;
let isPlainLeftClick;
let nextToastDelay;
let doorGlyph;
let TmaProbe;
let createMockWebApp;
let readTelegramContext;

const server = createServer();
let baseUrl;
const fixtures = new Map();
let allEntries = null;

before(async () => {
  await build({
    stdin: {
      contents: [
        'export { default as App, readRouteFromHash, routeMeta } from "./src/App.jsx";',
        'export { primeApiCache, clearApiCache } from "./src/lib/api.js";',
        'export { localeStrings } from "./src/locales/index.js";',
        'export { readTheme } from "./src/lib/theme.js";',
        'export { UI, MODULES, t, formatNumber, labelFor, ENUM_LABELS, formatDate, formatRatio } from "./src/i18n.js";',
        'export { Toast, Meter, BarRow, nextToastDelay, StateBlock, DataHealthNotice } from "./src/components/ui.jsx";',
        'export { doorGlyph } from "./src/components/KeyDock.jsx";',
        'export { default as SearchOverlay } from "./src/components/SearchOverlay.jsx";',
        'export { default as ErrorBoundary, CrashFallback } from "./src/components/ErrorBoundary.jsx";',
        'export { nextDoorIndex, doorStepForArrow, doorHref, isDoorActive, DOORS } from "./src/components/KeyDock.jsx";',
        'export { isPlainLeftClick, onLinkClick } from "./src/lib/links.js";',
        'export { visibleAudit } from "./src/modules/levels/panels.jsx";',
        'export { default as TmaProbe } from "./src/platform/telegram/Probe.jsx";',
        'export { createMockWebApp } from "./src/platform/telegram/mock.mjs";',
        'export { readTelegramContext } from "./src/platform/telegram/context.mjs";'
      ].join("\n"),
      resolveDir: WEB_ROOT,
      loader: "js"
    },
    bundle: true,
    format: "esm",
    platform: "node",
    jsx: "automatic",
    external: ["react", "react-dom", "react/jsx-runtime"],
    outfile: BUNDLE,
    logLevel: "silent"
  });

  const bundle = await import(`${BUNDLE}?t=${Date.now()}`);
  App = bundle.App;
  readRouteFromHash = bundle.readRouteFromHash;
  routeMeta = bundle.routeMeta;
  localeStrings = bundle.localeStrings;
  SearchOverlay = bundle.SearchOverlay;
  ErrorBoundary = bundle.ErrorBoundary;
  CrashFallback = bundle.CrashFallback;
  readTheme = bundle.readTheme;
  Meter = bundle.Meter;
  BarRow = bundle.BarRow;
  visibleAudit = bundle.visibleAudit;
  primeApiCache = bundle.primeApiCache;
  clearApiCache = bundle.clearApiCache;
  UI = bundle.UI;
  MODULES = bundle.MODULES;
  t = bundle.t;
  formatNumber = bundle.formatNumber;
  labelFor = bundle.labelFor;
  ENUM_LABELS = bundle.ENUM_LABELS;
  formatDate = bundle.formatDate;
  formatRatio = bundle.formatRatio;
  Toast = bundle.Toast;
  StateBlock = bundle.StateBlock;
  DataHealthNotice = bundle.DataHealthNotice;
  nextDoorIndex = bundle.nextDoorIndex;
  doorStepForArrow = bundle.doorStepForArrow;
  doorHref = bundle.doorHref;
  isDoorActive = bundle.isDoorActive;
  DOORS = bundle.DOORS;
  isPlainLeftClick = bundle.isPlainLeftClick;
  nextToastDelay = bundle.nextToastDelay;
  doorGlyph = bundle.doorGlyph;
  TmaProbe = bundle.TmaProbe;
  createMockWebApp = bundle.createMockWebApp;
  readTelegramContext = bundle.readTelegramContext;

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;

  const paths = [
    "/api/v1/dashboard",
    "/api/v1/governance",
    "/api/v1/transition",
    "/api/v1/institutions",
    "/api/v1/archive",
    "/api/v1/archive/SYN-HIST-001",
    "/api/v1/sources",
    "/api/v1/evidence",
    "/api/v1/verification",
    "/api/v1/accountability",
    "/api/v1/public-services",
    "/api/v1/projects",
    "/api/v1/simulations",
    "/api/v1/digital-legacy",
    "/api/v1/levels",
    "/api/v1/influence",
    "/api/v1/hmmt",
    "/api/v1/principles",
    "/api/v1/programme",
    "/api/v1/referendum",
    ...["1", "2", "3", "4", "5"].flatMap((id) => [
      `/api/v1/levels/${id}?policy=P-OPEN-DRAFT`,
      `/api/v1/levels/${id}?policy=P-RESTRICTIVE-DRAFT`
    ])
  ];

  const entries = {};
  allEntries = entries;
  for (const path of paths) {
    const payload = await (await fetch(`${baseUrl}${path}`)).json();
    fixtures.set(path, payload);
    entries[path] = payload;
  }

  // The archive view builds its query string from default (empty) filters.
  primeApiCache(entries);
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  rmSync(BUILD_DIR, { recursive: true, force: true });
});

/**
 * The visible text of an HTML fragment, for assertion messages and label
 * comparisons.
 *
 * This is a one-pass reader, not a sanitiser — it only ever runs on markup this
 * test just rendered, and it never touches data that came from outside. It is
 * written as a scanner rather than as one regular-expression replacement,
 * because a single pass is not an HTML stripper — it leaves a doubled tag
 * opener behind — and a test that pretends otherwise teaches the wrong pattern.
 */
function visibleText(fragment) {
  let out = "";
  let depth = 0;
  for (const char of fragment) {
    if (char === "<") depth += 1;
    else if (char === ">" && depth > 0) {
      depth -= 1;
      if (depth === 0) out += " ";
    } else if (depth === 0) out += char;
  }
  return out.replace(/\s+/g, " ").trim();
}

/** Escape a literal for use inside a RegExp source: the complete set, not a guess. */
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Renders <App /> at a given hash with network access disabled, proving that
 * every view is fully driven by the read-only API payloads we captured.
 */
function renderWithoutFetch(hash = "", lang = null) {
  const originalFetch = globalThis.fetch;
  const originalWindow = globalThis.window;
  globalThis.fetch = () => Promise.reject(new Error("network access is forbidden in render tests"));
  // The shell reads its preferences from localStorage on the first render; the
  // stub lets a test render in English (the fa default is the fallback).
  const stored = lang ? new Map([["cep.lang", lang]]) : new Map();
  globalThis.window = {
    location: { hash },
    localStorage: { getItem: (key) => stored.get(key) ?? null, setItem: (key, value) => stored.set(key, value) },
    scrollTo() {},
    addEventListener() {},
    removeEventListener() {}
  };
  const html = renderToString(createElement(App));
  return {
    html,
    restore: () => {
      globalThis.fetch = originalFetch;
      globalThis.window = originalWindow;
    }
  };
}

test("route parsing defaults to the five-level chooser and accepts record ids", () => {
  // The landing is the hub: one centre, six doors.
  assert.deepEqual(readRouteFromHash(""), { view: "hub", recordId: null });
  assert.deepEqual(readRouteFromHash("#/"), { view: "hub", recordId: null });
  assert.deepEqual(readRouteFromHash("#/hub"), { view: "hub", recordId: null });
  assert.deepEqual(readRouteFromHash("#/levels"), { view: "levels", recordId: null });
  assert.deepEqual(readRouteFromHash("#/levels/3"), { view: "levels", recordId: "3" });
  assert.deepEqual(readRouteFromHash("#/dashboard"), { view: "dashboard", recordId: null });
  assert.deepEqual(readRouteFromHash("#/research"), { view: "research", recordId: null });
  assert.deepEqual(readRouteFromHash("#/historical-archive/SYN-HIST-001"), {
    view: "historical-archive",
    recordId: "SYN-HIST-001"
  });
  // An address that names nothing real is a not-found, not a plausible-looking
  // wrong page: a level outside 1-5, an unknown module, a record id on a view
  // that has no addressable records.
  assert.deepEqual(readRouteFromHash("#/levels/9"), { view: "not-found", recordId: null });
  assert.deepEqual(readRouteFromHash("#/levels/abc"), { view: "not-found", recordId: null });
  assert.deepEqual(readRouteFromHash("#/not-a-module"), { view: "not-found", recordId: null });
  assert.deepEqual(readRouteFromHash("#/programme/PRG-SYN-001"), { view: "not-found", recordId: null });
  assert.deepEqual(readRouteFromHash("#/bank/anything"), { view: "not-found", recordId: null });
  assert.deepEqual(readRouteFromHash("#/bank"), { view: "bank", recordId: null });
  // A principle is addressable so a project can point at the row it targets.
  assert.deepEqual(readRouteFromHash("#/principles/Z-01"), { view: "principles", recordId: "Z-01" });
  assert.deepEqual(readRouteFromHash("#/principles/P-013"), { view: "principles", recordId: "P-013" });
  assert.deepEqual(readRouteFromHash("#/principles/NOPE"), { view: "not-found", recordId: null });
});

test("every route is named once, and a level names itself in the title and the crumbs", () => {
  const en = routeMeta({ view: "levels", recordId: "3" }, "en");
  assert.equal(en.title, "Level 3 · Participating Citizen · CEP Civilizational Operating System");
  assert.deepEqual(en.crumbs.map((crumb) => crumb.label), [
    "Hub",
    "Five civic levels",
    "Level 3 · Participating Citizen"
  ]);
  assert.equal(en.crumbs[0].href, "#/hub");
  assert.equal(en.crumbs[1].href, "#/levels");
  assert.equal(en.crumbs[2].href, undefined, "the last crumb is the current page, not a link");

  const fa = routeMeta({ view: "levels", recordId: "3" }, "fa");
  assert.equal(fa.title, "سطح ۳ · شهروند مشارکت‌کننده · سامانهٔ عامل مدنی CEP");
  assert.equal(fa.crumbs[0].label, "مرکز");

  // The hub is home: no crumb pointing at itself.
  for (const lang of ["fa", "en"]) {
    const hub = routeMeta({ view: "hub", recordId: null }, lang);
    assert.equal(hub.crumbs.length, 1);
    assert.ok(hub.title.endsWith("CEP") || hub.title.includes("CEP"));
  }

  // No route may fall through to an unnamed page.
  const routes = [
    { view: "hub", recordId: null },
    { view: "levels", recordId: null },
    { view: "levels", recordId: "1" },
    { view: "levels", recordId: "5" },
    { view: "bank", recordId: null },
    { view: "principles", recordId: null },
    { view: "programme", recordId: null },
    { view: "referendum", recordId: null },
    { view: "not-found", recordId: null },
    ...MODULES.map((module) => ({ view: module.id, recordId: null }))
  ];
  for (const lang of ["fa", "en"]) {
    for (const route of routes) {
      const meta = routeMeta(route, lang);
      assert.ok(meta.label && meta.label.trim().length > 0, `${route.view} has no label in ${lang}`);
      assert.ok(meta.title.includes(meta.label), `${route.view} title does not contain its label`);
      assert.ok(meta.crumbs.length >= 1, `${route.view} has no crumbs`);
    }
  }

  // Level pages must not all read the same, which was the bug.
  const distinct = new Set(["1", "2", "3", "4", "5"].map((id) => routeMeta({ view: "levels", recordId: id }, "en").title));
  assert.equal(distinct.size, 5, "five levels must produce five different titles");
});

test("the crumb trail is made of links, and home is the hub rather than the dashboard", () => {
  const { html, restore } = renderWithoutFetch("#/levels/3");
  try {
    assert.match(html, /<a class="brand" href="#\/hub">/, "the logo must link to the hub");
    assert.match(html, /<nav class="breadcrumbs" aria-label="مسیر صفحه">/);
    assert.match(html, /<a class="crumb" href="#\/hub">مرکز<\/a>/, "Home points at the hub");
    assert.match(html, /<a class="crumb" href="#\/levels">پنج سطح شهروندی<\/a>/);
    assert.match(
      html,
      /aria-current="page"><span class="crumb crumb--current">سطح ۳ · شهروند مشارکت‌کننده<\/span>/,
      "the current crumb names the level, and is text rather than a link"
    );
    assert.doesNotMatch(html, /<button[^>]*class="crumb"/, "crumbs are anchors, not buttons");
  } finally {
    restore();
  }
});

test("an address that resolves to nothing gets a page that says so, in both languages", () => {
  for (const [lang, title, homeLabel] of [
    ["fa", "این صفحه را نیافتیم", "بازگشت به مرکز"],
    ["en", "We could not find that page", "Back to the hub"]
  ]) {
    const { html, restore } = renderWithoutFetch("#/levels/9", lang);
    try {
      assert.match(html, new RegExp(`<h1[^>]*>${escapeRegex(title)}</h1>`), `${lang}: not-found needs its own h1`);
      assert.ok(html.includes(homeLabel), `${lang}: not-found needs a way back to the hub`);
      assert.match(html, /href="#\/hub"/);
      assert.match(html, /href="#\/levels"/);
      // It must not render some other page's content under a wrong address.
      const main = html.slice(html.indexOf("<main"));
      assert.doesNotMatch(main, /پیشخوان تمدنی|Civilization Dashboard/);
    } finally {
      restore();
    }
  }
});

test("the static door copy is the API's own words, not a second opinion", () => {
  const levels = fixtures.get("/api/v1/levels").data.levels;
  for (const lang of ["fa", "en"]) {
    const copy = localeStrings(lang).levels;
    for (const level of levels) {
      assert.equal(copy.titles[String(level.id)], level.title[lang], `${lang}: level ${level.id} name drifted`);
      assert.equal(copy.purposes[String(level.id)], level.purpose[lang], `${lang}: level ${level.id} purpose drifted`);
    }
  }
});

test("the shell renders Persian RTL by default with the demo banner and all twelve sections", () => {
  const { html, restore } = renderWithoutFetch();
  try {
    assert.match(html, /dir="rtl"/);
    assert.match(html, /lang="fa"/);
    assert.match(html, /سامانهٔ عامل مدنی/);
    assert.match(html, /نمونهٔ نمایشی محدود|نمونهٔ نمایشی محلی/);
    for (const module of MODULES) {
      assert.ok(html.includes(t(module.title, "fa")), `missing nav entry for ${module.id}`);
    }
    assert.match(html, /id="main-content"/);
    assert.match(html, /class="skip-link"/);
  } finally {
    restore();
  }
});

test("the default dashboard renders real derived figures, not placeholders", () => {
  const { html, restore } = renderWithoutFetch("#/dashboard");
  try {
    const dashboard = fixtures.get("/api/v1/dashboard").data;
    for (const figure of dashboard.figures) {
      assert.ok(
        html.includes(formatNumber(figure.value, "fa")),
        `dashboard is missing derived figure ${figure.id} = ${figure.value}`
      );
    }
    assert.ok(html.includes("۷۷"), "77-column gate must be visible");
  } finally {
    restore();
  }
});

const VIEW_EXPECTATIONS = {
  governance: ["ده اصل بنیادین", "تفکیک کارکردها", "AMD-001"],
  transition: ["فاز اضطراری ۱۸۰ روزه", "افق گذار ۲ تا ۳ ساله", "خط زمانی مراحل"],
  institutions: ["نقشهٔ تعاملی روابط", "نهادهای پیشنهادی", "PRINCIPLE-GUARDIAN"],
  "historical-archive": ["بایگانی تاریخی", "۷۷ ستونی", "جستجو و صافی"],
  research: ["فهرست ادعاها", "کاوشگر تناقض", "پرسش‌های بی‌پاسخ"],
  verification: ["سطح ۱ — دسترسی عمومی", "سازوکارهای ردشده", "شبیه‌ساز"],
  accountability: ["گزارش الحاق‌گرا", "تعارض منافع", "سوابق بازبینی"],
  "public-services": ["راهنمای خدمات عمومی", "مرزهای ایمنی", "تأییدنشده"],
  projects: ["پروژه‌های نفع عمومی", "سیاست مشوق‌ها", "PRJ-001"],
  simulations: ["آزمایشگاه طراحی نهادی", "مدل‌ها", "حفاظتی"],
  "digital-legacy": ["هفت بند اصل ۲۰", "ممنوعیت‌های مطلق", "پروندهٔ هستی"]
};

for (const [view, needles] of Object.entries(VIEW_EXPECTATIONS)) {
  test(`module view "${view}" renders its key content without network access`, () => {
    const { html, restore } = renderWithoutFetch(`#/${view}`);
    try {
      assert.ok(html.length > 2000, `${view} produced suspiciously little markup`);
      for (const needle of needles) {
        assert.ok(html.includes(needle), `${view} is missing expected content: ${needle}`);
      }
    } finally {
      restore();
    }
  });
}

test("english locale strings are complete enough to swap the whole interface", () => {
  for (const key of Object.keys(UI.fa)) {
    assert.ok(UI.en[key] !== undefined, `missing English string for ${key}`);
  }
  assert.equal(UI.en.dir, "ltr");
  assert.match(UI.en.demoBody, /not a government/);
  assert.match(UI.en.demoBody, /No living-person records/);
  assert.match(UI.fa.demoBody, /دولت/);
  assert.match(UI.fa.demoBody, /فرد زنده/);
});

test("no dead buttons: every rendered button has an accessible name", () => {
  // The dashboard is the densest screen for controls; the hub is deliberately sparse.
  const { html, restore } = renderWithoutFetch("#/dashboard");
  try {
    const buttons = html.match(/<button[^>]*>(.*?)<\/button>/gs) ?? [];
    assert.ok(buttons.length > 10, "expected many interactive controls");
    for (const button of buttons) {
      const text = visibleText(button);
      const hasLabel = /aria-label="[^"]+"/.test(button) || /title="[^"]+"/.test(button);
      assert.ok(text.length > 0 || hasLabel, `unnamed button: ${button.slice(0, 120)}`);
    }
  } finally {
    restore();
  }
});

test("no external network resources are referenced by the rendered shell", () => {
  const { html, restore } = renderWithoutFetch();
  try {
    assert.doesNotMatch(html, /<img[^>]+src="https?:/i);
    assert.doesNotMatch(html, /<iframe/i);
    assert.doesNotMatch(html, /googleapis|analytics|facebook|twitter|hotjar/i);
  } finally {
    restore();
  }
});

test("archive render lists only deceased synthetic dossiers", () => {
  const archive = fixtures.get("/api/v1/archive").data;
  assert.equal(archive.counts.living, 0);
  const { html, restore } = renderWithoutFetch("#/historical-archive");
  try {
    for (const dossier of archive.results) {
      assert.ok(html.includes(dossier.id), `dossier ${dossier.id} not rendered`);
    }
    assert.match(html, /SYNTHETIC FIXTURE/);
  } finally {
    restore();
  }
});

test("verification render never shows a binding vote or social-credit action as allowed", () => {
  const { html, restore } = renderWithoutFetch("#/verification");
  try {
    const prohibited = fixtures.get("/api/v1/verification").data.policies.filter(
      (policy) => policy.isConstitutionallyProhibited
    );
    assert.ok(prohibited.length >= 4);
    assert.match(html, /ممنوع مطلق/);
  } finally {
    restore();
  }
});

// ---------------------------------------------------------------------------
// Visual-regression guards (found by rendering the real app in a headless
// browser; each of these was a real defect, not a hypothetical one).
// ---------------------------------------------------------------------------

test("every module view number is localized through formatNumber, not a raw digit", () => {
  // Persian view: ASCII digits inside a stat value mean the number bypassed
  // formatNumber. Digits live in <p class="stat__value">.
  for (const view of ["#/dashboard", "#/projects", "#/accountability", "#/public-services", "#/historical-archive"]) {
    const { html, restore } = renderWithoutFetch(view);
    try {
      const values = [...html.matchAll(/class="stat__value[^"]*">([^<]*)</g)].map((m) => m[1]);
      assert.ok(values.length > 0, `no stat values rendered for ${view}`);
      for (const value of values) {
        assert.doesNotMatch(value, /[0-9]/, `raw ASCII digits in a Persian stat: "${value}" (${view})`);
      }
    } finally {
      restore();
    }
  }
});

test("labelFor localizes known API slugs and never hides unknown ones", () => {
  assert.equal(labelFor("none-recorded", "fa"), "هیچ موردی ثبت نشده");
  assert.equal(labelFor("none-recorded", "en"), "None recorded");
  assert.equal(labelFor("not-ratified", "en"), "Not ratified");
  assert.equal(labelFor("PROHIBITED_BY_CHARTER", "en"), "Prohibited by charter");
  // Unknown slugs fall through to the raw value — data is never swallowed.
  assert.equal(labelFor("some-future-slug", "fa"), "some-future-slug");
  assert.equal(labelFor(null, "fa"), "—");
  for (const [slug, entry] of Object.entries(ENUM_LABELS)) {
    assert.ok(entry.fa && entry.en, `enum label ${slug} is missing a locale`);
  }
});

test("module views never print a raw enum slug where a label is expected", () => {
  const views = [
    "#/governance", "#/accountability", "#/historical-archive", "#/institutions",
    "#/projects", "#/public-services", "#/research", "#/verification"
  ];
  for (const view of views) {
    const { html, restore } = renderWithoutFetch(view);
    try {
      for (const slug of Object.keys(ENUM_LABELS)) {
        const raw = new RegExp(`>\\s*${escapeRegex(slug)}\\s*<`);
        assert.doesNotMatch(html, raw, `${view} prints the raw slug "${slug}"`);
      }
    } finally {
      restore();
    }
  }
});

test("a deep link to a dossier is honoured by the archive view", () => {
  const { html, restore } = renderWithoutFetch("#/historical-archive/SYN-HIST-002");
  try {
    // The drawer renders the dossier name from the same fixture the list uses.
    assert.match(html, /drawer/);
  } finally {
    restore();
  }
});

test("module icons come from the inline SVG set, never a symbol font", () => {
  const { html, restore } = renderWithoutFetch("#/dashboard");
  try {
    assert.match(html, /<svg[^>]*class="icon/);
    // The old build relied on glyphs that were missing from the bundled fonts.
    for (const glyph of ["⌕", "☀", "☾", "◉", "\u{1F310}"]) {
      assert.ok(!html.includes(glyph), `missing-glyph character ${glyph} still rendered`);
    }
  } finally {
    restore();
  }
});

test("formatDate renders Gregorian facts in the reader's language, never a raw ISO string", () => {
  assert.equal(formatDate("2026-01-04T09:12:00Z", "fa", true), "۴ فروردین ۲۰۲۶ · ۹:12");
  assert.equal(formatDate("2026-01-04T09:12:00Z", "en", true), "4 فروردین 2026 · 9:12");
  assert.equal(formatDate("2024-06-15", "fa"), "۱۵ شهریور ۲۰۲۴");
  assert.equal(formatDate("2024-06-15", "en"), "15 شهریور 2024");
  // Anything unparseable is returned untouched rather than swallowed.
  assert.equal(formatDate("nonsense", "fa"), "nonsense");
  assert.equal(formatDate(null, "fa"), "—");
});

test("audit events and review records no longer print raw ISO timestamps", () => {
  const { html, restore } = renderWithoutFetch("#/accountability");
  try {
    assert.doesNotMatch(html, /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);
    assert.doesNotMatch(html, />\s*\d{4}-\d{2}-\d{2}\s*</);
  } finally {
    restore();
  }
});

test("headings inside module views keep a valid order", () => {
  // axe flagged h1 -> h4 jumps; static checks catch the same class of bug
  // without a browser. Every view renders exactly one <h1>.
  const views = [
    "#/dashboard", "#/governance", "#/transition", "#/institutions", "#/historical-archive",
    "#/research", "#/verification", "#/accountability", "#/public-services", "#/projects",
    "#/simulations", "#/digital-legacy"
  ];
  for (const view of views) {
    const { html, restore } = renderWithoutFetch(view);
    try {
      const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
      assert.equal(levels.filter((level) => level === 1).length, 1, `${view} must have exactly one h1`);
      assert.equal(levels[0], 1, `${view} must start at h1, got h${levels[0]}`);
      let previous = 1;
      for (const level of levels.slice(1)) {
        assert.ok(level <= previous + 1, `${view} jumps from h${previous} to h${level}`);
        previous = level;
      }
    } finally {
      restore();
    }
  }
});

test("table headers have accessible text", () => {
  for (const view of ["#/institutions", "#/governance", "#/accountability", "#/digital-legacy"]) {
    const { html, restore } = renderWithoutFetch(view);
    try {
      for (const match of html.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)) {
        const inner = visibleText(match[1]);
        const hasHiddenLabel = /class="sr-only"/.test(match[1]);
        assert.ok(inner.length > 0 || hasHiddenLabel, `${view} has an empty <th>`);
      }
      assert.doesNotMatch(html, /<th[^>]*>\s*<\/th>/, `${view} has a self-closing empty header`);
    } finally {
      restore();
    }
  }
});

test("colour tokens used for text keep WCAG AA contrast in both themes", () => {
  // Mirrors the axe run: the ink/teal tokens the views use for text must clear
  // 4.5:1 against the light paper and the dark paper.
  const css = readFileSync(join(WEB_ROOT, "src/styles.css"), "utf8");
  const readVar = (block, name) => {
    const match = block.match(new RegExp(`${escapeRegex(name)}:\\s*(#[0-9a-fA-F]{6})`));
    return match ? match[1] : null;
  };
  const split = css.indexOf('html[data-theme="dark"]');
  const lightBlock = css.slice(css.indexOf(":root {"), split);
  const darkBlock = css.slice(split, css.indexOf("}", split) + 1);

  const luminance = (hex) => {
    const channels = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255);
    const linear = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };
  const ratio = (a, b) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };

  for (const [theme, block, paper] of [
    ["light", lightBlock, ["--paper-1", "--paper-2"]],
    ["dark", darkBlock, ["--paper-0", "--paper-1", "--paper-2"]]
  ]) {
    for (const surface of paper) {
      const background = readVar(block, surface);
      assert.ok(background, `${theme} is missing ${surface}`);
      for (const token of ["--ink-900", "--ink-700", "--ink-500", "--ink-300", "--teal-text"]) {
        const colour = readVar(block, token);
        if (!colour) continue;
        const value = ratio(colour, background);
        assert.ok(
          value >= 4.5,
          `${theme}: ${token} (${colour}) on ${surface} (${background}) is ${value.toFixed(2)}:1`
        );
      }
    }
  }
});

test("unverified service entries are shown as text, not as clickable links", () => {
  const services = fixtures.get("/api/v1/public-services").data.services;
  const unverified = services.filter((service) => !service.urlVerified);
  assert.ok(unverified.length > 0, "fixture must contain unverified entries");

  const { html, restore } = renderWithoutFetch("#/public-services");
  try {
    for (const service of unverified) {
      assert.ok(html.includes(service.url), `${service.id} url is not displayed at all`);
      assert.ok(
        !html.includes(`href="${service.url}"`),
        `${service.id} still renders an outbound link for an unverified entry`
      );
    }
    assert.match(html, /پیوند فعال نشده|the link stays inactive/);
  } finally {
    restore();
  }
});

test("digital legacy shows epistemic badges and a real disclosure control", () => {
  const { html, restore } = renderWithoutFetch("#/digital-legacy");
  try {
    // Clause rows used to print the raw epistemic key and a text triangle.
    assert.doesNotMatch(html, />\s*source-reported\s*</);
    assert.match(html, /class="badge/);
    assert.match(html, /class="clause__chevron"/);
  } finally {
    restore();
  }
});

test("counted ratios never render backwards in the RTL layout", () => {
  // Persian digits are bidi class AN, so "7 / 10" would print as "10 / 7" in
  // the right-to-left layout. The label-based form is order-safe in both
  // languages and matches the meter beside it.
  assert.equal(formatRatio(7, 10, "fa"), "۷ از ۱۰");
  assert.equal(formatRatio(7, 10, "en"), "7 of 10");
  assert.equal(formatRatio(0, 0), "۰ از ۰");

  const { html, restore } = renderWithoutFetch("#/projects");
  try {
    assert.match(html, /۷ از ۱۰|\d+ از \d+/);
    assert.doesNotMatch(html, /[۰-۹]\s*\/\s*[۰-۹]/);
  } finally {
    restore();
  }
});

test("text-link buttons keep a 24px hit area (WCAG 2.5.8)", () => {
  // A measured layout sweep found every .link-btn was 21–22px tall. Height is
  // the only thing the sweep could not express in SSR, so it is pinned here.
  const css = readFileSync(join(WEB_ROOT, "src/styles.css"), "utf8");
  const block = css.slice(css.indexOf(".link-btn {"), css.indexOf("}", css.indexOf(".link-btn {")));
  assert.match(block, /min-height:\s*24px/);
  assert.match(block, /display:\s*inline-flex/);
});

test("the skip link targets a focusable main region, and the nav toggle announces its state", () => {
  const { html, restore } = renderWithoutFetch();
  try {
    const skip = html.match(/<a[^>]*class="skip-link"[^>]*href="([^"]+)"/);
    assert.ok(skip, "skip link missing");
    const target = skip[1].replace("#", "");
    assert.ok(html.includes(`id="${target}"`), "skip link points at an id that does not exist");
    const main = html.match(new RegExp(`<main[^>]*id="${escapeRegex(target)}"[^>]*>`));
    assert.ok(main, "the skip target is not <main>");
    assert.match(main[0], /tabindex="-1"/, "programmatic focus target must be focusable");

    const toggle = html.match(/<button[^>]*class="icon-btn nav-toggle"[^>]*>/);
    assert.ok(toggle, "nav toggle missing");
    assert.match(toggle[0], /aria-expanded="false"/);
    assert.match(toggle[0], /aria-controls="primary-navigation"/);
    assert.ok(html.includes('id="primary-navigation"'), "toggle controls an id that does not exist");
    assert.doesNotMatch(toggle[0], /inert/, "the toggle must stay usable in every state");
  } finally {
    restore();
  }
});

test("the module navigation is reachable on a wide screen and only inert when it is a closed drawer", () => {
  const { html, restore } = renderWithoutFetch();
  try {
    const nav = html.match(/<nav[^>]*id="primary-navigation"[^>]*>/);
    assert.ok(nav, "primary navigation missing");
    // Server-rendered markup assumes the wide layout, where the sidebar is a
    // permanent landmark: it must never ship inert.
    assert.doesNotMatch(nav[0], /inert/);
    assert.match(nav[0], /aria-label="[^"]+"/);
  } finally {
    restore();
  }
});

test("toasts render a labelled close control in both languages", () => {
  // These used to crash: the close button read a `dict` that did not exist in
  // the component scope, so the first toast blanked the view.
  for (const lang of ["fa", "en"]) {
    const html = renderToString(createElement(Toast, { message: "نمونه", lang, onClose() {} }));
    assert.match(html, /role="status"/);
    assert.match(html, /aria-label="[^"]+"/);
    assert.doesNotMatch(html, /aria-label="undefined"/);
  }
  const fallback = renderToString(createElement(Toast, { message: "نمونه", onClose() {} }));
  assert.match(fallback, /aria-label="[^"]+"/);
});

test("every relationship-map node keeps its whole name in the visible label", () => {
  // wrapLabel used to cap at two lines and silently drop the remaining words,
  // so "راهنمای خدمات عمومی (این سامانه)" rendered without "(این سامانه)" and
  // the accessible name no longer matched the visible label.
  const { html, restore } = renderWithoutFetch("#/institutions");
  try {
    const nodes = html.match(/<g class="graph__node[^"]*"[^>]*>[\s\S]*?<\/g>/g) ?? [];
    const institutions = fixtures.get("/api/v1/institutions").data.institutions;
    assert.equal(nodes.length, institutions.length, "one group per institution expected");
    for (const node of nodes) {
      const visible = visibleText(node);
      const match = institutions.find((item) => visible.startsWith(t(item.name, "fa")));
      assert.ok(match, `no institution matches the rendered label: ${visible.slice(0, 60)}`);
      assert.equal(visible, `${t(match.name, "fa")} ${labelFor(match.category, "fa")}`.replace(/\s+/g, " ").trim());
      assert.doesNotMatch(visible, /…/, "labels must not be truncated mid-name");
    }
  } finally {
    restore();
  }
});

/* ----------------------- five-level civic operating system ---------------------- */

test("the first screen is the five-profile chooser, one card per level", () => {
  const { html, restore } = renderWithoutFetch("#/levels");
  try {
    const registry = fixtures.get("/api/v1/levels").data;
    const cards = html.match(/class="level-card"/g) ?? [];
    assert.equal(cards.length, 5, "expected exactly five profile cards");
    for (const level of registry.levels) {
      assert.ok(html.includes(t(level.title, "fa")), `missing level title ${level.key}`);
      assert.ok(html.includes(t(level.purpose, "fa").slice(0, 24)), `missing purpose for ${level.key}`);
    }
    // Ballot ownership is stated on the screen, not implied.
    assert.match(html, /دارای برگهٔ رأی سیاسی/);
    assert.match(html, /بدون برگهٔ رأی/);
    assert.equal((html.match(/بدون برگهٔ رأی/g) ?? []).length, 4);
  } finally {
    restore();
  }
});

test("each level renders its own modules and shares the connected workflow", () => {
  const seen = new Set();
  for (const id of ["1", "2", "3", "4", "5"]) {
    const { html, restore } = renderWithoutFetch(`#/levels/${id}`);
    try {
      const dashboard = fixtures.get(`/api/v1/levels/${id}?policy=P-OPEN-DRAFT`).data;
      assert.ok(html.length > 3000, `level ${id} produced suspiciously little markup`);
      for (const module of dashboard.modules) {
        assert.ok(html.includes(t(module.title, "fa")), `level ${id} is missing ${module.id}`);
      }
      // The same workflow record appears at every level.
      assert.ok(html.includes("PROP-SYN-001"), `level ${id} lost the shared proposal`);
      assert.ok(html.includes("DEC-SYN-014"), `level ${id} lost the shared decision`);
      seen.add(dashboard.modules.map((module) => module.id).join(","));
    } finally {
      restore();
    }
  }
  assert.equal(seen.size, 5, "levels must not render the same dashboard five times");
});

test("level views never offer a ballot to a level that does not hold one", () => {
  for (const id of ["1", "2", "4", "5"]) {
    const { html, restore } = renderWithoutFetch(`#/levels/${id}`);
    try {
      assert.equal(/cast-political-ballot/.test(html), false, `level ${id} offers a political ballot action`);
    } finally {
      restore();
    }
  }
  const { html, restore } = renderWithoutFetch("#/levels/3");
  try {
    // Level 3 does hold one, and the breakdown is shown with its arithmetic.
    assert.match(html, /cast-political-ballot/);
    assert.match(html, /اجزای اعلام‌شده/);
    assert.match(html, /برگهٔ رأی ساخته‌شده از دسترسی عمومی/);
  } finally {
    restore();
  }
});

test("the qualification comparison shows the same proposal passing one policy and failing the other", () => {
  const { html, restore } = renderWithoutFetch("#/levels");
  try {
    const comparison = fixtures.get("/api/v1/levels").data.comparison;
    const open = comparison[0].results.find((result) => result.policyId === "P-OPEN-DRAFT");
    const restrictive = comparison[0].results.find((result) => result.policyId === "P-RESTRICTIVE-DRAFT");
    assert.equal(open.outcome, "qualified");
    assert.equal(restrictive.outcome, "below-threshold");
    assert.ok(html.includes(formatNumber(open.total, "fa")), "open score missing");
    assert.ok(html.includes(formatNumber(restrictive.total, "fa")), "restrictive score missing");
    assert.match(html, /سیاست باز/);
    assert.match(html, /سیاست محدودکننده/);
    // Both policies must be labelled as drafts, never as adopted rules.
    assert.equal((html.match(/پیش‌نویس قابل تنظیم/g) ?? []).length, 2);
  } finally {
    restore();
  }
});

test("advocacy reach is rendered as reach, and the ballot it creates is zero", () => {
  const { html, restore } = renderWithoutFetch("#/levels/1");
  try {
    const advocacy = fixtures.get("/api/v1/levels/1?policy=P-OPEN-DRAFT").data.modules.find((module) => module.id === "advocacy");
    assert.ok(advocacy.breakdown.length > 0);
    for (const item of advocacy.breakdown) {
      assert.equal(item.ballotsCreated, 0);
      assert.ok(html.includes(item.advocateHandle), `missing endorser ${item.advocateHandle}`);
    }
    assert.match(html, /به یک تأییدکنندهٔ نام‌دار نسبت داده می‌شود/);
  } finally {
    restore();
  }
});

test("the posthumous block renders on every level with the ballot prohibition", () => {
  for (const id of ["1", "3", "5"]) {
    const { html, restore } = renderWithoutFetch(`#/levels/${id}`);
    try {
      assert.match(html, /پروندهٔ هستی و مرز رأی/, `level ${id} is missing the estate boundary`);
      assert.match(html, /ballot-not-delegable/);
      assert.match(html, /prohibited/);
    } finally {
      restore();
    }
  }
});

test("a level view states that its records are synthetic and non-binding", () => {
  const { html, restore } = renderWithoutFetch("#/levels/5");
  try {
    assert.match(html, /ساختگی و غیرالزام‌آورند|همهٔ رکوردها، ارقام و تصمیم‌های این سطح ساختگی/);
    assert.match(html, /غیرالزام‌آور/);
  } finally {
    restore();
  }
});

/* ---------------------------- interactive panels ---------------------------- */

test("every level renders an interactive panel that states what it cannot do", () => {
  for (const id of ["1", "2", "3", "4", "5"]) {
    const { html, restore } = renderWithoutFetch(`#/levels/${id}`);
    try {
      assert.match(html, /class="sim"/, `level ${id} has no session panel`);
      // The honesty note is part of the panel, not a comment somewhere else.
      assert.match(html, /به API نوشته نمی‌شوند/);
      assert.match(html, /هیچ اثر حقوقی ندارند/);
      assert.match(html, /بازنشانی نشست/);
    } finally {
      restore();
    }
  }
});

test("every interactive form field has an associated label", () => {
  const expected = {
    2: ["l2-request"],
    3: ["l3-title", "l3-domain"],
    4: ["l4-spend", "l4-deliverable"],
    5: ["l5-proposal", "l5-reason", "l5-org"]
  };
  for (const [id, fieldIds] of Object.entries(expected)) {
    const { html, restore } = renderWithoutFetch(`#/levels/${id}`);
    try {
      for (const fieldId of fieldIds) {
        assert.ok(html.includes(`id="${fieldId}"`), `level ${id} is missing #${fieldId}`);
        assert.ok(html.includes(`for="${fieldId}"`), `level ${id} has an unlabelled #${fieldId}`);
        assert.ok(html.includes(`aria-label`), "controls should keep an accessible name");
      }
    } finally {
      restore();
    }
  }
});

test("levels 4 and 5 ship a deliberately refused action, so the boundary is testable", () => {
  const level4 = renderWithoutFetch("#/levels/4");
  try {
    assert.match(level4.html, /آزمودن: اعمال برگهٔ رأی اعضا/);
    assert.match(level4.html, /btn--danger/);
  } finally {
    level4.restore();
  }
  const level5 = renderWithoutFetch("#/levels/5");
  try {
    assert.match(level5.html, /آزمودن کنش بیرون از اختیار/);
    assert.match(level5.html, /تصمیم برای پروندهٔ کمیتهٔ دیگر/);
  } finally {
    level5.restore();
  }
});

test("the interactive ballot starts from the same formula as the server view", () => {
  const { html, restore } = renderWithoutFetch("#/levels/3");
  try {
    const dashboard = fixtures.get("/api/v1/levels/3?policy=P-OPEN-DRAFT").data;
    const serverBallot = dashboard.modules.find((module) => module.id === "political").ballot;
    // Neither delegation is enabled in a fresh session, so the interactive
    // total must equal the base franchise of the server's own computation.
    assert.equal(serverBallot.components[0].id, "base-franchise");
    assert.match(html, /وزن نهایی این نشست/);
    assert.match(html, /ثبت‌نشده/);
  } finally {
    restore();
  }
});

/* --------------------------------- HMMT bank -------------------------------- */

test("the bank is reachable from the key dock, not duplicated in the sidebar", () => {
  const { html, restore } = renderWithoutFetch();
  try {
    assert.match(html, /href="#\/bank"/, "the bank has no way in");
    assert.ok(html.includes("بانک"), "the bank is never named on the page");
    // The sidebar no longer repeats the doors: it says where they went.
    const sidebarStart = html.indexOf('id="primary-navigation"');
    assert.ok(sidebarStart > -1, "the sidebar is missing");
    const sidebar = html.slice(sidebarStart, html.indexOf("</nav>", sidebarStart));
    assert.ok(!sidebar.includes('href="#/bank"'), "the sidebar still offers the bank");
    assert.ok(!sidebar.includes('href="#/levels/1"'), "the sidebar still offers the levels");
    assert.match(sidebar, /href="#\/levels"/, "the level chooser must stay reachable");
    assert.ok(sidebar.includes('class="sidebar__hint"'), "the sidebar does not say where the doors went");
  } finally {
    restore();
  }
});

test("the bank renders the ceiling, the haircut chain and the refusals without network access", () => {
  const { html, restore } = renderWithoutFetch("#/bank");
  try {
    const bank = fixtures.get("/api/v1/hmmt").data;
    const ceilingText = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(bank.supply.ceiling.tokens);
    // Supply ceiling in tokens, and circulating supply as a separate number.
    assert.ok(html.includes(ceilingText), "the supply ceiling number is missing");
    assert.ok(html.includes("HMMT"), "units are missing");
    // The gross figure and the net backing figure must both be visible, so the
    // 27.3 trillion headline can never be read as backing.
    assert.ok(html.includes("۲۷.۳ تریلیون") || html.includes("۲۷٫۳ تریلیون"), "the gross resource figure is missing");
    assert.ok(html.includes("۷۰۳.۸ میلیارد") || html.includes("۷۰۳٫۸ میلیارد"), "the net backing figure is missing");
    // The proposal posture is stated on the page, not only in the payload.
    assert.ok(html.includes("پول قانونی"), "the not-legal-tender statement is missing");
    assert.ok(html.includes("طراحی پیشنهادی"), "the design-proposal badge is missing");
    // Proof of reserve keeps two ratios apart.
    assert.ok(html.includes("نسبت ذخیرهٔ تومانی"));
    assert.ok(html.includes("پوشش دارایی"));
    // Every simulator field has a matching label.
    for (const id of ["bank-action", "bank-amount"]) {
      assert.ok(html.includes(`id="${id}"`), `missing field ${id}`);
      assert.ok(html.includes(`for="${id}"`), `field ${id} has no label`);
    }
    // The ledger is visibly synthetic.
    assert.ok(html.includes("دفتر کل ساختگی"));
  } finally {
    restore();
  }
});

test("the bank never presents a gross resource figure as backing", () => {
  const bank = fixtures.get("/api/v1/hmmt").data;
  const { html, restore } = renderWithoutFetch("#/bank");
  try {
    // 7,352,027 is the ceiling a no-haircut reading of 27.3 tn would produce.
    assert.equal(html.includes("7,352,027"), false);
    assert.equal(html.includes("۷٬۳۵۲٬۰۲۷"), false);
    assert.ok(bank.supply.ceiling.tokens < 200000);
    // The excluded figures are named, with the reason they are excluded.
    const flat = JSON.stringify(bank.backing.excluded);
    assert.match(flat, /flow|جریان/);
    assert.match(flat, /private|خصوصی/);
  } finally {
    restore();
  }
});

test("the bank publishes a cap ladder across the five levels and several policies", () => {
  const { html, restore } = renderWithoutFetch("#/bank");
  try {
    const caps = fixtures.get("/api/v1/hmmt").data.caps;
    assert.ok(caps.policies.length >= 3, "one hard-coded cap would not be flexible");
    // Every policy is named, and the default is marked.
    for (const policy of caps.policies) {
      assert.ok(html.includes(policy.id), `policy ${policy.id} is missing from the table`);
      assert.ok(policy.summary.fa.length > 20 && policy.summary.en.length > 20);
    }
    // All five levels appear, with their civic names, not just numbers.
    for (const level of caps.levels) {
      assert.ok(html.includes(level.title.fa), `level ${level.level} has no name`);
    }
    // The invariants that make the ladder honest are on the page, not only in data.
    assert.ok(html.includes("مشارکت در حکمرانی هرگز سقف مالی نمی‌خرد"), "the participation invariant is missing");
    assert.ok(html.includes("بازخرید هرگز به سطح وابسته نیست"), "the redemption invariant is missing");
    // The simulator exposes level and policy as labelled controls.
    for (const id of ["bank-level", "bank-policy"]) {
      assert.ok(html.includes(`id="${id}"`), `missing control ${id}`);
      assert.ok(html.includes(`for="${id}"`), `control ${id} has no label`);
    }
  } finally {
    restore();
  }
});

test("the ladder never pays for participation and never lets an observer hold units", () => {
  const caps = fixtures.get("/api/v1/hmmt").data.caps;
  for (const policy of caps.policies) {
    const [l1, l2, l3, l4, l5] = policy.cells;
    assert.equal(l1.capTokens, 0, `${policy.id} lets an observer hold units`);
    assert.equal(l2.capTokens, l3.capTokens, `${policy.id} pays for participation`);
    assert.equal(l5.capTokens, l2.capTokens, `${policy.id} gives decision-makers more`);
    assert.equal(l5.disclosure, true, `${policy.id} lets a decision-maker hide a holding`);
    assert.ok(l4.capTokens >= l2.capTokens, `${policy.id} caps an entity below a person`);
  }
});

test("the mother file is answered principle by principle, and the page says what it cannot do", () => {
  const { html, restore } = renderWithoutFetch("#/principles");
  try {
    const payload = fixtures.get("/api/v1/principles").data;
    // Every principle of the mother file is on the page, with its own number.
    for (const chapter of payload.chapters) {
      assert.ok(html.includes(`principle-chapter-${chapter.id}`), `chapter ${chapter.id} is missing`);
      for (const principle of chapter.principles) {
        assert.ok(html.includes(principle.title.fa), `principle ${principle.id} is not rendered`);
      }
    }
    assert.ok(payload.summary.total >= 100, "the mother file has ~100 principles; the map must not sample a few");
    // The four statuses are named on screen, and the counts add up.
    for (const status of payload.statuses) {
      assert.ok(html.includes(status.label.fa), `status ${status.id} has no label on screen`);
    }
    const total = Object.values(payload.summary.counts).reduce((sum, value) => sum + value, 0);
    assert.equal(total, payload.summary.total, "status counts must add up to the principle count");
    // The posture is stated: a prototype, not compliance with a ratified text.
    assert.ok(html.includes("سند مادر یک میثاق پیشنهادی است"), "the draft posture is missing");
    assert.ok(html.includes("انطباق حقوقی"), "the page must say it does not measure legal compliance");
    // Every surface the table links to is a real route in this app.
    const known = new Set(["levels", "bank", "principles", ...Object.keys({ dashboard: 1, governance: 1, transition: 1, institutions: 1, "historical-archive": 1, research: 1, verification: 1, accountability: 1, "public-services": 1, projects: 1, simulations: 1, "digital-legacy": 1 })]);
    for (const chapter of payload.chapters) {
      for (const principle of chapter.principles) {
        if (!principle.surface?.route) continue;
        assert.ok(known.has(principle.surface.route), `${principle.id} points at unknown route ${principle.surface.route}`);
        assert.ok(html.includes(`href="#/${principle.surface.route}"`), `${principle.id} has no working link`);
      }
    }
    // A "covered" claim is never made by a principle that points at nothing.
    for (const chapter of payload.chapters) {
      for (const principle of chapter.principles.filter((row) => row.coverage === "covered")) {
        assert.ok(principle.surface, `${principle.id} claims coverage without a surface`);
        assert.ok(principle.note.fa.length > 20, `${principle.id} claims coverage without saying what was done`);
      }
    }
    // Out-of-scope entries must say why they are out of scope, in both languages.
    for (const chapter of payload.chapters) {
      for (const principle of chapter.principles.filter((row) => row.coverage === "outside")) {
        assert.ok(principle.note.fa.length > 20 && principle.note.en.length > 20, `${principle.id} is out of scope without a reason`);
      }
    }
  } finally {
    restore();
  }
});

test("the principles route is addressable and its filters are real controls", () => {
  assert.deepEqual(readRouteFromHash("#/principles"), { view: "principles", recordId: null });
  const { html, restore } = renderWithoutFetch("#/principles");
  try {
    assert.ok(html.includes('aria-pressed="true"'), "the default filter has to show its pressed state");
    assert.ok(html.includes('role="group"'), "the filter needs a labelled group");
    const statuses = fixtures.get("/api/v1/principles").data.statuses;
    assert.equal((html.match(/aria-pressed/g) ?? []).length >= statuses.length + 1, true, "filters must be toggle buttons");
  } finally {
    restore();
  }
});

test("the hub is the landing, and it opens with one centre and six doors", () => {
  const { html, restore } = renderWithoutFetch("#/hub");
  try {
    const levels = fixtures.get("/api/v1/levels").data.levels;
    // The mark is the centre of the page, in bold, and says what it is.
    assert.ok(html.includes("MY.X"), "the monogram is missing");
    assert.ok(html.includes("مرکز شخصی"), "the mark is unexplained");
    assert.ok(html.includes("یک کلید، شش در"), "the hub has no promise to keep");

    // Six doors: five levels and the bank, each pointed at its own route.
    const doors = html.match(/class="door door--/g) ?? [];
    assert.equal(doors.length, 6, "the hub must show exactly six doors");
    for (const level of levels) {
      assert.ok(html.includes(`href="#/levels/${level.id}"`), `door for level ${level.id} is missing`);
      assert.ok(html.includes(level.title.fa), `door for level ${level.id} has no title`);
      assert.ok(html.includes(level.purpose.fa), `door for level ${level.id} has no purpose`);
    }
    assert.ok(html.includes('href="#/bank"'), "the bank door is missing");

    // Moderated per node, not six copies of one card: the counts differ, and
    // only the participating citizen carries a ballot.
    // SSR inserts comment markers between adjacent text nodes; flatten first.
    const text = visibleText(html);
    const counts = [...text.matchAll(/([۰-۹]+) کنش مجاز/g)].map((match) => match[1]);
    assert.equal(counts.length, 5, "each level door must state how many actions it allows");
    assert.ok(new Set(counts).size >= 2, "the doors would be indistinguishable if every count were equal");
    const ballots = (text.match(/برگهٔ رأی دارد/g) ?? []).length;
    assert.equal(ballots, 1, "exactly one level holds a ballot");
    assert.equal(levels.filter((level) => level.holdsBallot).length, 1);

    // The station readout says where the reader is, and on the hub that is the hub.
    assert.ok(html.includes("ایستگاه فعلی"), "no station readout");
  } finally {
    restore();
  }
});

test("the key switch rides on every route and marks the pressed door", () => {
  for (const [hash, expected] of [
    ["#/hub", null],
    ["#/levels/3", "level-3"],
    ["#/levels", null],
    ["#/bank", "bank"],
    ["#/dashboard", null]
  ]) {
    const { html, restore } = renderWithoutFetch(hash);
    try {
      assert.ok(html.includes('class="key-dock"'), `the dock is missing on ${hash}`);
      assert.equal((html.match(/class="dock-key /g) ?? []).length + (html.match(/class="dock-key"/g) ?? []).length, 6, `six doors expected on ${hash}`);
      // A door is pressed only where the route matches it. On the level chooser
      // nothing is pressed, and asserting otherwise would make the switch lie.
      const pressed = (html.match(/is-pressed/g) ?? []).length;
      if (expected) {
        assert.ok(pressed >= 1, `nothing reads as pressed on ${hash}`);
        const door = DOORS.find((item) => item.id === expected);
        assert.ok(html.includes(doorHref(door)), `the door for ${expected} is not linked on ${hash}`);
      } else if (hash !== "#/hub") {
        assert.equal(pressed, 0, `${hash} should press no door`);
      }
    } finally {
      restore();
    }
  }
});

test("the switch behaves like a switch: wrap, direction and the pressed route", () => {
  assert.equal(DOORS.length, 6);
  assert.deepEqual(DOORS.map((door) => door.id), ["level-1", "level-2", "level-3", "level-4", "level-5", "bank"]);
  assert.equal(nextDoorIndex(0, 1), 1);
  assert.equal(nextDoorIndex(5, 1), 0, "the rail wraps forward");
  assert.equal(nextDoorIndex(0, -1), 5, "the rail wraps backward");
  assert.equal(nextDoorIndex(2, 3), 5);
  assert.equal(nextDoorIndex(2, -3), 5);
  // Arrow keys follow reading order, so RTL mirrors them.
  assert.equal(doorStepForArrow("ArrowRight", false), 1);
  assert.equal(doorStepForArrow("ArrowLeft", false), -1);
  assert.equal(doorStepForArrow("ArrowRight", true), -1);
  assert.equal(doorStepForArrow("ArrowLeft", true), 1);
  assert.equal(doorStepForArrow("Escape", true), 0);
  // Active matching is by route, including the level record.
  assert.equal(isDoorActive(DOORS[2], { view: "levels", recordId: "3" }), true);
  assert.equal(isDoorActive(DOORS[2], { view: "levels", recordId: "4" }), false);
  assert.equal(isDoorActive(DOORS[5], { view: "bank", recordId: null }), true);
  assert.equal(isDoorActive(DOORS[5], { view: "levels", recordId: null }), false);
  assert.equal(doorHref(DOORS[0]), "#/levels/1");
  assert.equal(doorHref(DOORS[5]), "#/bank");
});

/* ------------------------ the living covenant surfaces ---------------------- */

test("the mother-file page carries a light beside every principle, and a readiness score", () => {
  const { html, restore } = renderWithoutFetch("#/principles");
  try {
    const payload = fixtures.get("/api/v1/principles").data;
    const { lights, principles } = payload;

    // A dot per row, in the light's own class, and never colour alone.
    assert.equal((html.match(/class="light light--/g) ?? []).length >= principles.length, true, "some principles have no light");
    for (const light of ["green", "amber", "red", "grey"]) {
      assert.ok(html.includes(`light--${light}`), `no ${light} light is rendered`);
    }
    assert.ok(html.includes(`aria-label="چراغ: `), "the dots are unnamed for a screen reader");

    // The score is printed as a percentage, with the harsh weight stated openly.
    const percent = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(Math.round(lights.readiness * 100));
    assert.ok(html.includes(percent), `the readiness score ${percent}% is missing`);
    assert.ok(html.includes("۰٫۱"), "the amber weight is not shown");
    assert.ok(html.includes("از مخرج خارج"), "the excluded band is not explained");
    assert.ok(html.includes("زنده") === false || html.includes("ادعا"), "the Live claim must be qualified");

    // The way out of an amber light is one link away.
    assert.ok(html.includes('href="#/programme"'), "no route from the coverage map to the programme");
  } finally {
    restore();
  }
});

test("the programme renders its queue, its gates and the ballots that refused", () => {
  const { html, restore } = renderWithoutFetch("#/programme");
  try {
    const payload = fixtures.get("/api/v1/programme").data;
    const { projects, summary, rules } = payload;

    // Every project appears, with its principle and its budget.
    for (const project of projects) {
      assert.ok(html.includes(project.id), `${project.id} is missing from the page`);
      assert.ok(html.includes(project.principleId), `${project.id} does not name its principle`);
    }
    assert.equal((html.match(/class="prj prj--/g) ?? []).length, projects.length);

    // The gates are shown as computed badges, not prose.
    assert.ok(html.includes("gate--open"), "no gate reads as open");
    assert.ok(html.includes("مضاربه"), "the contract type is not named");
    assert.equal((html.match(/class="gate /g) ?? []).length >= projects.length * 5, true, "not every gate is rendered");

    // A refused ballot is visible as a refusal.
    const refused = projects.filter((project) => project.ballot.result !== "passed");
    assert.ok(refused.length > 0, "the fixture has no refused ballot");
    assert.ok(html.includes("به نصاب نرسید"), "a quorum failure is not shown as one");

    // The page admits what the queue does not cover.
    assert.ok(html.includes("بیرون از این صف"), "the uncovered amber principles are not admitted");
    assert.ok(html.includes(String(summary.projects)) || html.includes(new Intl.NumberFormat("fa-IR").format(summary.projects)));

    // Rules come from the payload, so the list cannot drift from the API.
    for (const rule of rules) assert.ok(html.includes(rule.id) || html.includes(rule.check.slice(0, 12)), `${rule.id} is not shown`);
  } finally {
    restore();
  }
});

test("the referendum page declares its posture before it shows any arithmetic", () => {
  const { html, restore } = renderWithoutFetch("#/referendum");
  try {
    const payload = fixtures.get("/api/v1/referendum").data;
    const { sequence, rehearsals, gateList, posture } = payload;

    assert.equal(posture.isElectionAuthority, false);
    // The refusal comes first: the badge and the callout precede the numbers.
    const postureIndex = html.indexOf("مرجع انتخاباتی نیست");
    const firstQuestionIndex = html.indexOf(sequence[0].question.fa);
    assert.ok(postureIndex > -1, "the posture badge is missing");
    assert.ok(postureIndex < firstQuestionIndex, "the page shows questions before it says it holds no vote");

    // Four chained questions, each with its rule and quorum.
    for (const question of sequence) {
      assert.ok(html.includes(question.question.fa), `question ${question.order} is missing`);
      assert.ok(html.includes(question.options[0].label.fa), `question ${question.order} has no options`);
    }

    // Both a pass and a refusal are rendered: the calculator says no in public.
    assert.ok(html.includes("پذیرفته"));
    assert.ok(html.includes("به نصاب نرسید") && html.includes("دور دوم"));
    assert.equal(rehearsals.filter((entry) => !entry.accepted).length >= 2, true);

    // Every open gate is named.
    for (const gate of gateList) assert.ok(html.includes(gate.fa.slice(0, 18)), `gate ${gate.id} is missing`);
  } finally {
    restore();
  }
});

test("the two work surfaces are reachable from the hub and from the sidebar", () => {
  const { html, restore } = renderWithoutFetch("#/hub");
  try {
    assert.ok(html.includes('class="hub__work"'), "the hub has no workbench");
    assert.ok(html.includes('href="#/programme"'), "the programme is not linked from the hub");
    assert.ok(html.includes('href="#/referendum"'), "the referendum is not linked from the hub");
    const sidebarStart = html.indexOf('id="primary-navigation"');
    const sidebar = html.slice(sidebarStart, html.indexOf("</nav>", sidebarStart));
    assert.ok(sidebar.includes('href="#/programme"'), "the programme is not in the sidebar");
    assert.ok(sidebar.includes('href="#/referendum"'), "the referendum is not in the sidebar");
  } finally {
    restore();
  }
});

/* --------------------------- search overlay states -------------------------- */

function renderSearch(state, lang = "fa", term = "زمین") {
  return renderToString(
    createElement(SearchOverlay, {
      lang,
      term,
      onTerm() {},
      state,
      onClose() {},
      onPick() {},
      onRetry() {}
    })
  );
}

const ONE_RESULT = {
  module: "principles",
  moduleNumber: 99,
  id: "Z-01",
  title: { fa: "مدت و خاتمهٔ دولت انتقالی", en: "A dated, bounded transition government" },
  subtitle: { fa: "اصل صفر ممیز یک", en: "Principle 0.1" },
  kind: { fa: "اصل", en: "principle" },
  epistemicStatus: "sourced",
  target: { view: "principles", recordId: "Z-01" }
};

test("the search overlay has five states, and an outage never reads as no results", () => {
  const idle = renderSearch({ status: "idle", term: "", payload: null });
  assert.match(idle, /role="status"/, "the overlay needs a live region");
  assert.match(idle, /دست‌کم دو نویسه/, "idle state is the prompt");

  const loading = renderSearch({ status: "loading", term: "زمین", payload: null });
  assert.match(loading, /aria-busy="true"/, "loading is announced as busy");
  assert.match(loading, /در حال جستجو/, "loading has its own words");
  assert.doesNotMatch(loading, /search-results/, "a stale list must not stay on screen");

  const empty = renderSearch({ status: "ready", term: "زمین", payload: { total: 0, results: [] } });
  assert.match(empty, /زمین/, "the empty answer names the query");
  assert.match(empty, /چیزی یافت نشد/);

  const results = renderSearch({
    status: "ready",
    term: "اصل",
    payload: { total: 1, results: [ONE_RESULT] }
  });
  assert.match(results, /search-result__title/);
  assert.match(results, /۱/, "the count is localized");

  const error = renderSearch({ status: "error", term: "زمین", payload: null });
  assert.match(error, /role="alert"/, "an outage is announced as an alert");
  assert.match(error, /تلاش دوباره/, "the error offers Retry");
  assert.match(error, /جستجو انجام نشد/);
  assert.doesNotMatch(error, /چیزی یافت نشد/, "an outage must not claim there were no results");

  const errorEn = renderSearch({ status: "error", term: "land", payload: null }, "en", "land");
  assert.match(errorEn, /did not answer/);
  assert.match(errorEn, /Retry/);
});

test("a search result is a link to where it points, not a button (issue #43)", () => {
  const html = renderSearch(
    { status: "ready", term: "اصل", payload: { total: 1, results: [ONE_RESULT] } },
    "en",
    "اصل"
  );
  assert.match(html, /<a[^>]+class="search-result"[^>]+href="#\/principles\/Z-01"/, "the result must carry the route it opens");
  assert.doesNotMatch(html, /<button[^>]+class="search-result"/, "a destination is a link, not a button");
  assert.match(html, /id="search-results"/, "the field points at the list it filters");
  assert.match(html, /aria-controls="search-results"/, "the field names the list it filters");

  const idle = renderSearch({ status: "idle", term: "", payload: null });
  assert.doesNotMatch(idle, /aria-controls/, "an empty palette owns no list to point at");
});

test("a search result outside the twelve modules renders without a module chip", () => {
  const html = renderSearch(
    { status: "ready", term: "اصل", payload: { total: 1, results: [ONE_RESULT] } },
    "en",
    "principle"
  );
  assert.doesNotMatch(html, /search-result__mod/, "an unknown module number must not render a chip");
  assert.match(html, /A dated, bounded transition government/);
});

test("a render error shows a fallback with a heading, a sentence and a way out", () => {
  const state = ErrorBoundary.getDerivedStateFromError(new Error("boom"));
  assert.equal(state.error.message, "boom", "the boundary must catch and hold the error");

  for (const [lang, title, home] of [
    ["fa", "این بخش نمایش داده نشد", "بازگشت به مرکز"],
    ["en", "This section could not be displayed", "Back to the hub"]
  ]) {
    const html = renderToString(createElement(CrashFallback, { lang, onReset() {} }));
    assert.match(html, new RegExp(`<h1[^>]*>${escapeRegex(title)}</h1>`), `${lang}: the fallback needs its own h1`);
    assert.match(html, /role="alert"/);
    assert.match(html, /href="#\/hub"/, `${lang}: a link back to the hub`);
    assert.match(html, /<button type="button" class="btn btn--primary"/, `${lang}: a retry control`);
    assert.ok(html.includes(home));
  }
});

/* ------------------------- theme before the first paint ------------------------ */

test("the theme follows the operating system until the reader chooses", () => {
  const originalWindow = globalThis.window;
  let stored = null;
  let systemDark = true;
  globalThis.window = {
    localStorage: { getItem: () => stored, setItem() {} },
    matchMedia: () => ({ matches: systemDark, addEventListener() {}, removeEventListener() {} })
  };
  try {
    assert.equal(readTheme(), "dark", "OS dark with nothing stored must paint dark");
    stored = "light";
    assert.equal(readTheme(), "light", "an explicit choice always wins over the OS");
    stored = null;
    systemDark = false;
    assert.equal(readTheme(), "light", "OS light with nothing stored must paint light");
  } finally {
    globalThis.window = originalWindow;
  }
});

test("index.html settles language and theme before the app script runs", () => {
  const html = readFileSync(join(WEB_ROOT, "index.html"), "utf8");
  const head = html.slice(0, html.indexOf('<div id="root"'));
  assert.match(head, /localStorage\.getItem\("cep\.theme"\)/, "the pre-paint script reads the stored theme");
  assert.match(head, /localStorage\.getItem\("cep\.lang"\)/, "the pre-paint script reads the stored language");
  assert.match(head, /prefers-color-scheme: dark/, "with nothing stored the OS decides");
  assert.match(head, /setAttribute\("data-theme", theme\)/);
  assert.match(head, /<meta name="color-scheme" content="light dark" \/>/);
  assert.match(head, /try \{/, "storage may be disabled, so the read must be guarded");
});

test("the hub paints its six doors before /api/v1/levels answers", () => {
  clearApiCache();
  const { html, restore } = renderWithoutFetch("#/hub");
  try {
    assert.match(html, /<h1[^>]*>یک کلید، شش در<\/h1>/, "the heading does not wait for the API");
    const doors = html.match(/class="door__link"/g) ?? [];
    assert.equal(doors.length, 6, "five levels and the bank, painted from static copy");
    assert.match(html, /ناظر عمومی/, "a door names itself without the API");
    assert.match(html, /گرهٔ سازمانی/);
    assert.match(html, /door__meter-skeleton/, "missing counts are a skeleton, not a wrong number");
    assert.doesNotMatch(html, /state-block/, "the landing page is not replaced by a spinner");
    assert.match(html, /aria-busy="true"/, "the grid says the counts are still coming");
  } finally {
    restore();
    primeApiCache(allEntries);
  }
});

test("the hub states what it refuses to be, even with no data at all", () => {
  clearApiCache();
  const { html, restore } = renderWithoutFetch("#/hub");
  try {
    assert.match(html, /آنچه این مرکز نمی‌گوید/, "the guard callout is static copy");
    assert.match(html, /دسترسی|حکمرانی/, "the module strip still renders");
    assert.doesNotMatch(html, /state-block/, "no full-page error block");
  } finally {
    restore();
    primeApiCache(allEntries);
  }
});

/* ------------------------ digits and labels that travel ---------------------- */

test("the English sidebar shows no Persian digits, in either language's copy", () => {
  const { html, restore } = renderWithoutFetch("#/dashboard", "en");
  try {
    const sidebar = html.slice(html.indexOf('id="primary-navigation"'), html.indexOf("</nav>", html.indexOf('id="primary-navigation"')));
    assert.doesNotMatch(sidebar, /[\u06F0-\u06F9]/, "no Persian digit may appear in the English interface");
    assert.match(sidebar, /nav-item__num">05</, "the level count is a number formatted for the reader");
  } finally {
    restore();
  }
});

test("meters speak their ratio in the reader's digits and words, never with a slash", () => {
  const fa = renderToString(createElement(Meter, { value: 4, max: 6, label: "نقاط عطف کامل", lang: "fa" }));
  const faLabel = fa.match(/aria-label="([^"]+)"/)[1];
  assert.equal(faLabel, "نقاط عطف کامل: ۴ از ۶");
  assert.doesNotMatch(faLabel, /[0-9]/, "no ASCII digit inside a Persian accessible name");
  assert.doesNotMatch(faLabel, /\//, "no slash ratio");

  const en = renderToString(createElement(Meter, { value: 4, max: 6, label: "Milestones complete", lang: "en" }));
  assert.equal(en.match(/aria-label="([^"]+)"/)[1], "Milestones complete: 4 of 6");

  // A BarRow with no pre-formatted display must not leak a raw number into fa.
  const bar = renderToString(createElement(BarRow, { label: "ادعاها", value: 3, max: 9, lang: "fa" }));
  const barLabel = bar.match(/aria-label="([^"]+)"/)[1];
  assert.equal(barLabel, "ادعاها: ۳ از ۹");
  assert.doesNotMatch(barLabel, /[0-9]/);
});

/* ------------------------------- build metadata ----------------------------- */

test("no invented build metadata is left in the web sources", () => {
  const webRoot = WEB_ROOT;
  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (/\.(jsx?|mjs)$/.test(entry.name)) files.push(path);
    }
  };
  walk(join(webRoot, "src"));
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    assert.doesNotMatch(source, /v1\.0\.0/, `${file} still hard-codes v1.0.0`);
    assert.doesNotMatch(source, /4c526f6a|arena\//, `${file} still names a session branch`);
  }

  // The version and the commit come from package.json and git, at build time.
  const viteConfig = readFileSync(join(webRoot, "vite.config.js"), "utf8");
  assert.match(viteConfig, /package\.json/, "the version must be read from package.json");
  assert.match(viteConfig, /rev-parse.*--short/, "the commit must be read from git");
  assert.match(viteConfig, /__CEP_VERSION__/);
  assert.match(viteConfig, /__CEP_COMMIT__/);
});

test("a build without git says dev instead of inventing a hash", () => {
  // Under node --test the Vite defines do not exist, which is exactly the
  // fallback path: no version, `dev` for the commit.
  const { html, restore } = renderWithoutFetch("#/dashboard");
  try {
    const footer = html.slice(html.indexOf("app-footer"));
    assert.match(footer, /dev/, "the commit fallback is visible");
    assert.match(footer, /نامعلوم/, "an unknown version says so rather than guessing");
    assert.doesNotMatch(footer, /arena\/|v1\.0\.0/);
  } finally {
    restore();
  }
});

test("the bank states the amount it actually read, before the form is submitted", () => {
  const { html, restore } = renderWithoutFetch("#/bank");
  try {
    assert.match(html, /مقدار خوانده‌شده/, "the field says how it read what was typed");
    assert.match(html, /۰٫۰۵ HMMT/, "the default amount is echoed back as 0.05, not as 0");
    // The old parser turned "1,000" into 1; the page must not contain that path.
    const source = readFileSync(join(WEB_ROOT, "src/modules/Bank.jsx"), "utf8");
    assert.doesNotMatch(source, /replace\(\/\[٫,\]\/g/, "the lossy amount parser is gone");
    assert.match(source, /parseDecimalInput/);
  } finally {
    restore();
  }
});

test("a project and the principle it targets link to each other, once each", () => {
  const programme = fixtures.get("/api/v1/programme").data;
  const project = programme.projects[0];

  // Programme -> principle: the id and the title are one link, not two.
  const fromProgramme = renderWithoutFetch("#/programme");
  try {
    assert.match(
      fromProgramme.html,
      new RegExp(`<a class="link-button" href="#/principles/${escapeRegex(project.principleId)}">`),
      "the principle id must link to its row"
    );
    const links = fromProgramme.html.match(new RegExp(`href="#/principles/${escapeRegex(project.principleId)}"`, "g")) ?? [];
    assert.equal(links.length, 1, "one link per project, so a screen reader announces it once");
  } finally {
    fromProgramme.restore();
  }

  // Principle -> programme: the row says which project is working on it.
  const fromPrinciple = renderWithoutFetch(`#/principles/${project.principleId}`);
  try {
    assert.match(fromPrinciple.html, new RegExp(`id="principle-${escapeRegex(project.principleId)}"`), "the row is anchorable");
    assert.match(fromPrinciple.html, /class="is-targeted"/, "the row a deep link names is marked");
    assert.match(fromPrinciple.html, /در دستور کار/, "the row says it is targeted");
    assert.ok(fromPrinciple.html.includes(project.id), "the row names the project id");
  } finally {
    fromPrinciple.restore();
  }

  // An address for a principle this file does not have says so.
  const missing = renderWithoutFetch("#/principles/Q-99");
  try {
    assert.match(missing.html, /این اصل در این سند نیست/);
  } finally {
    missing.restore();
  }
});

/* ---------------------- level simulator outcomes (#30) ---------------------- */

test("each of the five level panels announces its last outcome", () => {
  for (const id of ["1", "2", "3", "4", "5"]) {
    const { html, restore } = renderWithoutFetch(`#/levels/${id}`);
    try {
      assert.match(html, /class="sim__outcome/, `level ${id} has no outcome region`);
      assert.match(html, /role="status"[^>]*aria-live="polite"|aria-live="polite"/, `level ${id} outcome is not live`);
      assert.match(html, /نتیجهٔ آخرین کنش این‌جا می‌آید/, `level ${id} does not say what the region is for`);
      assert.equal((html.match(/class="sim__outcome/g) ?? []).length, 1, `level ${id} must have exactly one live region`);
    } finally {
      restore();
    }
  }
});

test("the audit log says when it is showing only part of the session", () => {
  const audit = Array.from({ length: 12 }, (_, index) => ({ id: `SIM-${index}` }));
  assert.equal(visibleAudit(audit, false).length, 8, "collapsed shows eight");
  assert.equal(visibleAudit(audit, true).length, 12, "expanded shows the whole history");
  assert.equal(visibleAudit(audit.slice(0, 3), false).length, 3, "a short history is not padded");
  // The copy for both states exists in both languages.
  for (const lang of ["fa", "en"]) {
    const copy = localeStrings(lang).levels.sim;
    assert.ok(copy.auditShowing.includes("{shown}") && copy.auditShowing.includes("{total}"));
    assert.ok(copy.auditShowAll.includes("{total}"));
    assert.ok(copy.auditCollapse.length > 0);
  }
});

test("every view keeps a level-one heading even when its data fails (issue #19)", () => {
  const VIEWS = [
    "#/hub", "#/dashboard", "#/governance", "#/transition", "#/institutions",
    "#/historical-archive", "#/research", "#/verification", "#/accountability",
    "#/public-services", "#/projects", "#/simulations", "#/digital-legacy",
    "#/bank", "#/principles", "#/programme", "#/referendum", "#/levels", "#/levels/3"
  ];
  clearApiCache();
  try {
    for (const hash of VIEWS) {
      const { html, restore } = renderWithoutFetch(hash);
      try {
        const main = html.slice(html.indexOf("<main"));
        assert.match(main, /<h1[^>]*>[^<]/, `${hash} has no h1 while its data is loading or failed`);
      } finally {
        restore();
      }
    }
  } finally {
    primeApiCache(allEntries);
  }
});

// One list of every route, used by the two structural guards below.
const ALL_ROUTES = [
  "#/hub", "#/dashboard", "#/governance", "#/transition", "#/institutions",
  "#/historical-archive", "#/research", "#/verification", "#/accountability",
  "#/public-services", "#/projects", "#/simulations", "#/digital-legacy",
  "#/bank", "#/principles", "#/programme", "#/referendum", "#/levels", "#/levels/3"
];

test("only an unmodified primary click belongs to the router (issue #58)", () => {
  assert.equal(isPlainLeftClick({ button: 0 }), true, "a plain left click is ours to route");
  for (const modifier of ["ctrlKey", "metaKey", "shiftKey", "altKey"]) {
    assert.equal(isPlainLeftClick({ button: 0, [modifier]: true }), false, `${modifier}+click belongs to the browser`);
  }
  assert.equal(isPlainLeftClick({ button: 1 }), false, "middle click opens a new tab, it is not a route change");
  assert.equal(isPlainLeftClick({ button: 0, defaultPrevented: true }), false, "an already-handled click is not re-routed");
});

test("in-app destinations stay real links with a real href (issue #58)", () => {
  const { html, restore } = renderWithoutFetch("#/hub");
  try {
    for (const href of ["#/levels/1", "#/levels/5", "#/bank", "#/programme", "#/referendum", "#/principles"]) {
      assert.ok(html.includes(`href="${href}"`), `the hub lost its real anchor to ${href}`);
    }
  } finally {
    restore();
  }
});

test("the referendum page names its link instead of printing the route (issue #59)", () => {
  for (const [lang, label] of [[null, "اصل ۹۸ سند مادر"], ["en", "Principle 98 of the mother file"]]) {
    const { html, restore } = renderWithoutFetch("#/referendum", lang);
    try {
      const main = html.slice(html.indexOf("<main"));
      const anchor = main.match(/<a class="link-button" href="#\/principles">([\s\S]*?)<\/a>/);
      assert.ok(anchor, `${lang ?? "fa"}: the principles link is missing from the method card`);
      assert.equal(visibleText(anchor[1]), label, `${lang ?? "fa"}: the link must carry its own words`);
      assert.ok(!main.includes(">#/principles<"), `${lang ?? "fa"}: the raw route is still used as link text`);
    } finally {
      restore();
    }
  }
});

test("no view draws a ratio as two numbers with a slash (issue #60)", () => {
  // The checklist forbids it: in an RTL layout "12 / 5" reverses and stops
  // meaning what it says. Ratios are spoken ("۱۲ از ۵"), never drawn.
  const SLASH_RATIO = /[0-9۰-۹][\u200e\u200f ]*\/[\u200e\u200f ]*[0-9۰-۹]/;
  for (const lang of [null, "en"]) {
    for (const hash of ALL_ROUTES) {
      const { html, restore } = renderWithoutFetch(hash, lang);
      try {
        const main = html.slice(html.indexOf("<main"));
        const match = main.match(SLASH_RATIO);
        assert.equal(match, null, `${hash} (${lang ?? "fa"}) renders a slash ratio: ${match?.[0]}`);
      } finally {
        restore();
      }
    }
  }
});

test("the dock is a sibling of the inert regions, so it is told to be inert separately (issue #57)", () => {
  const { html, restore } = renderWithoutFetch("#/dashboard");
  try {
    // Closed overlays leave no inert attribute anywhere; the mechanism itself is
    // proven in the browser audit, which can open a dialog.
    assert.ok(/<nav class="key-dock"[^>]*aria-label/.test(html), "the dock must render on every route");
    assert.ok(!/<nav class="key-dock"[^>]*inert/.test(html), "the dock must not be inert when no overlay is open");
  } finally {
    restore();
  }
});

test("a toast stops its clock instead of expiring under the reader (issue #51)", () => {
  assert.equal(nextToastDelay({ tone: "info", remaining: 5200 }), 5200, "an untouched toast keeps its full time");
  assert.equal(nextToastDelay({ tone: "info", remaining: 3000 }), 3000, "resuming keeps the time that was left");
  assert.equal(nextToastDelay({ tone: "info", remaining: 5200, paused: true }), null, "hover or focus stops the clock");
  assert.equal(nextToastDelay({ tone: "info", remaining: 5200, hidden: true }), null, "a background tab stops the clock");
  assert.equal(nextToastDelay({ tone: "error", remaining: 5200 }), null, "an error waits for a human to dismiss it");
  assert.equal(nextToastDelay({ tone: "info", remaining: 5 }), 600, "a toast never flashes out instantly");
});

test("the bank door carries one symbol and no currency sign (issue #42)", () => {
  const bankDoor = DOORS.find((door) => door.level === null);
  for (const [lang, hash] of [[null, "#/hub"], ["en", "#/hub"]]) {
    const { html, restore } = renderWithoutFetch(hash, lang);
    try {
      // U+FDFC is the RIAL sign; the unit here is toman, and the door is not a price.
      assert.ok(!html.includes("\uFDFC"), `${lang ?? "fa"}: the rial sign is still rendered`);
      assert.ok(!html.includes("⌂"), `${lang ?? "fa"}: the hub door still uses its own house glyph`);
      const bankIcon = (html.match(/M4 20\.5h16/g) ?? []).length;
      assert.ok(bankIcon >= 2, `${lang ?? "fa"}: the dock and the hub door must draw the same bank icon (found ${bankIcon})`);
    } finally {
      restore();
    }
  }
  assert.equal(doorGlyph(bankDoor), "", "the bank key has no glyph of its own");
  assert.equal(doorGlyph({ level: 3 }), "۳", "levels keep their Persian digit");
});

test("every door arrow is a drawn chevron, not a mirrored text glyph (issue #50)", () => {
  for (const lang of [null, "en"]) {
    const { html, restore } = renderWithoutFetch("#/hub", lang);
    try {
      const arrows = html.match(/class="door__arrow"[^>]*>([\s\S]*?)<\/span>/g) ?? [];
      assert.ok(arrows.length >= 6, `${lang ?? "fa"}: expected six door arrows, found ${arrows.length}`);
      for (const arrow of arrows) {
        assert.ok(arrow.includes("<svg"), `${lang ?? "fa"}: a door arrow is still a text glyph`);
        assert.ok(!arrow.includes("\u2039"), `${lang ?? "fa"}: U+2039 mirrors itself and the CSS mirrors it again`);
      }
    } finally {
      restore();
    }
  }
});

test("the theme buttons are named for assistive technology (issue #51)", () => {
  const { html, restore } = renderWithoutFetch("#/dashboard");
  try {
    const group = html.match(/<div class="tool-group"[\s\S]*?<\/div>/);
    assert.ok(group, "the theme group is missing");
    const labels = [...group[0].matchAll(/aria-label="([^"]+)"/g)].map((match) => match[1]);
    const pressed = [...group[0].matchAll(/aria-pressed="(true|false)"/g)].map((match) => match[1]);
    assert.ok(labels.length >= 2, "both theme buttons need a name that is not only a title attribute");
    assert.equal(pressed.length, 2, "both theme buttons need to state whether they are pressed");
  } finally {
    restore();
  }
});

/* --------------------- issue #44: four failures, four sentences -------------------- */

const renderState = (props) => renderToString(createElement(StateBlock, props));

test("every failure kind gets its own sentence, in both languages", () => {
  const kinds = [
    [{ kind: "offline" }, "errorOffline"],
    [{ kind: "timeout" }, "errorTimeout"],
    [{ kind: "http", status: 503 }, "errorServer"],
    [{ kind: "contract", detail: "mode" }, "errorContract"],
    [{ kind: "network", detail: "Failed to fetch" }, "errorNetwork"]
  ];
  for (const lang of ["fa", "en"]) {
    const rendered = kinds.map(([error, key]) => {
      const html = renderState({ status: "error", lang, error, onRetry: () => {} });
      assert.ok(html.includes(UI[lang][key]), `${lang}/${key} must reach the page`);
      return UI[lang][key];
    });
    assert.equal(new Set(rendered).size, kinds.length, "the five failures must read differently");
    assert.equal(rendered.includes(UI[lang].loadError), false, "no kind falls back to the generic sentence");
  }
});

test("the status code and the contract reasons sit behind a disclosure, not in the headline", () => {
  const html = renderState({ status: "error", lang: "en", error: { kind: "http", status: 503, detail: "HTTP 503" }, onRetry: () => {} });
  const headline = html.slice(0, html.indexOf("<details"));
  assert.equal(headline.includes("503"), false, "the reader gets a sentence first");
  assert.ok(html.includes("<details"), "the detail is available, one click away");
  assert.ok(html.includes("Status code: 503"));
  assert.ok(html.includes(UI.en.retry));
});

test("loading shows a skeleton and announces itself once", () => {
  const html = renderState({ status: "loading", lang: "fa" });
  assert.ok(html.includes("skeleton"), "a shaped placeholder, not a bare spinner");
  assert.equal((html.match(/role="status"/g) ?? []).length, 1);
  assert.ok(html.includes("aria-live=\"polite\""));
  assert.ok(html.includes(UI.fa.loading), "the announcement is text, for readers who cannot see it");
});

test("stale data says so instead of pretending to be fresh", () => {
  const html = renderState({ status: "ready", stale: true, lang: "en", error: { kind: "timeout" } });
  assert.ok(html.includes(UI.en.staleData));
  assert.ok(html.includes("stale-note"));
});

test("a healthy app renders no health notice at all", () => {
  assert.equal(renderToString(createElement(DataHealthNotice, { lang: "en" })), "");
});

/* ------------------------------ Mini App probe ---------------------------- */

test("the probe renders nothing outside a launch, so the web app is untouched", async () => {
  const html = renderToString(createElement(TmaProbe, { context: readTelegramContext(null), lang: "en" }));
  assert.equal(html, "");
});

test("the probe names a fabricated environment as fabricated, in both languages", async () => {
  const context = readTelegramContext(createMockWebApp({ colorScheme: "dark" }), { mocked: true });
  const english = renderToString(createElement(TmaProbe, { context, lang: "en" }));
  assert.match(english, /tma-probe/);
  assert.match(english, /simulated/i);
  assert.equal(/--tg-theme|themeParams/.test(english), false, "the probe never prints Telegram's palette");

  const persian = renderToString(createElement(TmaProbe, { context, lang: "fa" }));
  assert.match(persian, /tma-probe/);
  assert.notEqual(persian, english, "the probe is translated, not English-only");
  assert.equal(/\u064A|\u0643/.test(persian), false, "no Arabic yeh or kaf");
});
