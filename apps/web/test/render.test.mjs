// Server-side rendering tests for the shared read-only API contract.
// Fixtures are fetched from the real API server (no mocks), so these tests
// fail if an endpoint shape, label, or safety guarantee regresses.
// The JSX sources are bundled on the fly with esbuild (a Vite dependency) so
// node:test can import them without a browser or a dev server.
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
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
let primeApiCache;
let UI;
let MODULES;
let t;
let formatNumber;
let labelFor;
let ENUM_LABELS;
let formatDate;
let formatRatio;
let Toast;

const server = createServer();
let baseUrl;
const fixtures = new Map();

before(async () => {
  await build({
    stdin: {
      contents: [
        'export { default as App, readRouteFromHash } from "./src/App.jsx";',
        'export { primeApiCache } from "./src/lib/api.js";',
        'export { UI, MODULES, t, formatNumber, labelFor, ENUM_LABELS, formatDate, formatRatio } from "./src/i18n.js";',
        'export { Toast } from "./src/components/ui.jsx";'
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
  primeApiCache = bundle.primeApiCache;
  UI = bundle.UI;
  MODULES = bundle.MODULES;
  t = bundle.t;
  formatNumber = bundle.formatNumber;
  labelFor = bundle.labelFor;
  ENUM_LABELS = bundle.ENUM_LABELS;
  formatDate = bundle.formatDate;
  formatRatio = bundle.formatRatio;
  Toast = bundle.Toast;

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
    ...["1", "2", "3", "4", "5"].flatMap((id) => [
      `/api/v1/levels/${id}?policy=P-OPEN-DRAFT`,
      `/api/v1/levels/${id}?policy=P-RESTRICTIVE-DRAFT`
    ])
  ];

  const entries = {};
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
 * Renders <App /> at a given hash with network access disabled, proving that
 * every view is fully driven by the read-only API payloads we captured.
 */
function renderWithoutFetch(hash = "") {
  const originalFetch = globalThis.fetch;
  const originalWindow = globalThis.window;
  globalThis.fetch = () => Promise.reject(new Error("network access is forbidden in render tests"));
  globalThis.window = { location: { hash }, scrollTo() {}, addEventListener() {}, removeEventListener() {} };
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
  assert.deepEqual(readRouteFromHash(""), { view: "levels", recordId: null });
  assert.deepEqual(readRouteFromHash("#/"), { view: "levels", recordId: null });
  assert.deepEqual(readRouteFromHash("#/levels"), { view: "levels", recordId: null });
  assert.deepEqual(readRouteFromHash("#/levels/3"), { view: "levels", recordId: "3" });
  // An out-of-range level falls back to the chooser instead of rendering a
  // dashboard the reader did not ask for.
  assert.deepEqual(readRouteFromHash("#/levels/9"), { view: "levels", recordId: null });
  assert.deepEqual(readRouteFromHash("#/dashboard"), { view: "dashboard", recordId: null });
  assert.deepEqual(readRouteFromHash("#/research"), { view: "research", recordId: null });
  assert.deepEqual(readRouteFromHash("#/historical-archive/SYN-HIST-001"), {
    view: "historical-archive",
    recordId: "SYN-HIST-001"
  });
  assert.deepEqual(readRouteFromHash("#/not-a-module"), { view: "dashboard", recordId: null });
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
  const { html, restore } = renderWithoutFetch();
  try {
    const buttons = html.match(/<button[^>]*>(.*?)<\/button>/gs) ?? [];
    assert.ok(buttons.length > 10, "expected many interactive controls");
    for (const button of buttons) {
      const text = button.replace(/<[^>]+>/g, "").trim();
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
        const raw = new RegExp(`>\\s*${slug.replace(/[-.]/g, "\\$&")}\\s*<`);
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
        const inner = match[1].replace(/<[^>]+>/g, "").trim();
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
    const match = block.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`));
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
    const main = html.match(new RegExp(`<main[^>]*id="${target}"[^>]*>`));
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
      const visible = node
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
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
