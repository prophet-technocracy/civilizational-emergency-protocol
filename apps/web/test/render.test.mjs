// Server-side rendering tests for the shared read-only API contract.
// Fixtures are fetched from the real API server (no mocks), so these tests
// fail if an endpoint shape, label, or safety guarantee regresses.
// The JSX sources are bundled on the fly with esbuild (a Vite dependency) so
// node:test can import them without a browser or a dev server.
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
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

const server = createServer();
let baseUrl;
const fixtures = new Map();

before(async () => {
  await build({
    stdin: {
      contents: [
        'export { default as App, readRouteFromHash } from "./src/App.jsx";',
        'export { primeApiCache } from "./src/lib/api.js";',
        'export { UI, MODULES, t, formatNumber } from "./src/i18n.js";'
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
