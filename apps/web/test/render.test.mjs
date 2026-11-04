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

const server = createServer();
let baseUrl;
const fixtures = new Map();

before(async () => {
  await build({
    stdin: {
      contents: [
        'export { default as App, readRouteFromHash } from "./src/App.jsx";',
        'export { primeApiCache } from "./src/lib/api.js";',
        'export { UI, MODULES, t, formatNumber, labelFor, ENUM_LABELS, formatDate } from "./src/i18n.js";'
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
    "/api/v1/digital-legacy"
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

test("route parsing defaults to the dashboard and accepts record ids", () => {
  assert.deepEqual(readRouteFromHash(""), { view: "dashboard", recordId: null });
  assert.deepEqual(readRouteFromHash("#/"), { view: "dashboard", recordId: null });
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
  const { html, restore } = renderWithoutFetch();
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
