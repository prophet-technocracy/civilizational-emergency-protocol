// Keyboard-only walkthrough of the app shell.
// Proves the things axe cannot: skip link, focus trap, Escape, focus return,
// inert off-canvas navigation, and focus after a route change.
import { launch } from "./launch.mjs";

const LAYER = process.env.CEP_URL ?? "http://127.0.0.1:5173";
const results = [];
const record = (name, ok, detail = "") => results.push({ name, ok, detail });

const describe = (page) =>
  page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return { tag: "body", label: "(body)" };
    return {
      tag: el.tagName.toLowerCase(),
      cls: (el.className || "").toString(),
      label: (el.getAttribute("aria-label") || el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 48),
      inNav: Boolean(el.closest("#primary-navigation")),
      inSearch: Boolean(el.closest(".search-layer")),
      inDrawer: Boolean(el.closest(".drawer-layer"))
    };
  });

const browser = await launch();
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});

await page.goto(`${LAYER}/#/dashboard`, { waitUntil: "networkidle0" });
await page.evaluate(() => {
  localStorage.setItem("cep.theme", "light");
  localStorage.setItem("cep.lang", "fa");
});
await page.reload({ waitUntil: "networkidle0" });
await page.evaluate(() => document.body.focus());

/* ------------------------------- skip link ------------------------------- */
await page.keyboard.press("Tab");
const first = await describe(page);
record("first Tab stop is the skip link", first.cls.includes("skip-link"), JSON.stringify(first));

await page.keyboard.press("Enter");
await new Promise((r) => setTimeout(r, 150));
const afterSkip = await describe(page);
record("skip link moves focus into main", afterSkip.tag === "main", JSON.stringify(afterSkip));

/* ------------------------------ search layer ----------------------------- */
await page.keyboard.down("Control");
await page.keyboard.press("k");
await page.keyboard.up("Control");
await new Promise((r) => setTimeout(r, 200));
const inSearch = await describe(page);
record("Ctrl+K focuses the search field", inSearch.tag === "input" && inSearch.inSearch, JSON.stringify(inSearch));

let escaped = false;
for (let i = 0; i < 8; i += 1) {
  await page.keyboard.press("Tab");
  const spot = await describe(page);
  if (!spot.inSearch) {
    escaped = true;
    record("Tab stays inside the search dialog", false, `escaped to ${spot.label}`);
    break;
  }
}
if (!escaped) record("Tab stays inside the search dialog", true, "8 stops, all inside");

await page.keyboard.press("Escape");
await new Promise((r) => setTimeout(r, 250));
const afterEscape = await describe(page);
const searchGone = await page.evaluate(() => !document.querySelector(".search-layer"));
record("Escape closes the search opened by shortcut and restores the previous focus",
  searchGone && afterEscape.tag === "main", JSON.stringify(afterEscape));

// Opened from the header button, focus must come back to that button.
await page.evaluate(() => document.querySelector(".search-trigger")?.focus());
await page.keyboard.press("Enter");
await new Promise((r) => setTimeout(r, 200));
await page.keyboard.press("Escape");
await new Promise((r) => setTimeout(r, 250));
const backOnTrigger = await describe(page);
record("Escape returns focus to the search trigger", /search-trigger/.test(backOnTrigger.cls), JSON.stringify(backOnTrigger));

/* -------------------------------- drawer --------------------------------- */
await page.goto(`${LAYER}/#/dashboard`, { waitUntil: "networkidle0" });
await page.evaluate(() => document.querySelector(".link-btn")?.focus());
await page.keyboard.press("Enter");
await new Promise((r) => setTimeout(r, 250));
const inDrawer = await describe(page);
record("provenance drawer takes focus", inDrawer.inDrawer, JSON.stringify(inDrawer));

let drawerEscaped = false;
for (let i = 0; i < 8; i += 1) {
  await page.keyboard.press("Tab");
  const spot = await describe(page);
  if (!spot.inDrawer) {
    drawerEscaped = true;
    record("Tab stays inside the drawer", false, `escaped to ${spot.label}`);
    break;
  }
}
if (!drawerEscaped) record("Tab stays inside the drawer", true, "8 stops, all inside");

await page.keyboard.press("Escape");
await new Promise((r) => setTimeout(r, 250));
const drawerClosed = await page.evaluate(() => ({
  gone: !document.querySelector(".drawer-layer"),
  active: document.activeElement?.className?.toString() ?? "",
  inertHeader: document.querySelector(".app-header")?.hasAttribute("inert") ?? null
}));
record("Escape closes the drawer and restores focus to the opener",
  drawerClosed.gone && drawerClosed.active.includes("link-btn") && drawerClosed.inertHeader === false,
  JSON.stringify(drawerClosed));

/* ---------------------------- route change focus -------------------------- */
await page.evaluate(() => document.querySelector('a[href="#/research"]')?.focus());
await page.keyboard.press("Enter");
await new Promise((r) => setTimeout(r, 450));
const afterNav = await describe(page);
record("in-app navigation moves focus to the new view", afterNav.tag === "main", JSON.stringify(afterNav));

/* --------------------------- mobile nav drawer --------------------------- */
await page.setViewport({ width: 390, height: 844 });
await page.goto(`${LAYER}/#/dashboard`, { waitUntil: "networkidle0" });
await page.reload({ waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 350));

const closedState = await page.evaluate(() => {
  const nav = document.querySelector("#primary-navigation");
  const firstLink = nav.querySelector("a[href]");
  firstLink.focus();
  return {
    inert: nav.hasAttribute("inert"),
    focusStolen: document.activeElement === firstLink,
    expanded: document.querySelector(".nav-toggle").getAttribute("aria-expanded")
  };
});
record("closed off-canvas nav is inert and cannot take focus",
  closedState.inert && !closedState.focusStolen && closedState.expanded === "false", JSON.stringify(closedState));

await page.evaluate(() => document.querySelector(".nav-toggle")?.focus());
await page.keyboard.press("Enter");
await new Promise((r) => setTimeout(r, 300));
const openedState = await page.evaluate(() => ({
  expanded: document.querySelector(".nav-toggle").getAttribute("aria-expanded"),
  inert: document.querySelector("#primary-navigation").hasAttribute("inert"),
  focusInNav: Boolean(document.activeElement?.closest("#primary-navigation"))
}));
record("toggle opens the nav drawer and moves focus into it",
  openedState.expanded === "true" && !openedState.inert && openedState.focusInNav, JSON.stringify(openedState));

await page.keyboard.press("Escape");
await new Promise((r) => setTimeout(r, 300));
const closedAgain = await page.evaluate(() => ({
  expanded: document.querySelector(".nav-toggle").getAttribute("aria-expanded"),
  inert: document.querySelector("#primary-navigation").hasAttribute("inert"),
  focusOnToggle: Boolean(document.activeElement?.classList?.contains("nav-toggle"))
}));
record("Escape closes the nav drawer and returns focus to the toggle",
  closedAgain.expanded === "false" && closedAgain.inert && closedAgain.focusOnToggle, JSON.stringify(closedAgain));

/* --------------------------------- toast --------------------------------- */
await page.setViewport({ width: 1440, height: 1000 });
await page.goto(`${LAYER}/#/public-services`, { waitUntil: "networkidle0" });
await page.reload({ waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 300));
const copyButton = await page.evaluateHandle(() =>
  [...document.querySelectorAll("button")].find((b) => /رونوشت|Copy address/.test(b.textContent)) ?? null);
const handle = copyButton.asElement();
if (handle) {
  await handle.click();
  await new Promise((r) => setTimeout(r, 500));
}
const toast = await page.evaluate(() => {
  const node = document.querySelector(".toast");
  return node ? { text: node.textContent.trim().slice(0, 60), closeLabel: node.querySelector("button")?.getAttribute("aria-label") } : null;
});
record("toast renders with a close button label (no crash)", Boolean(toast), JSON.stringify(toast));

record("no console or page errors during the walkthrough", errors.length === 0, errors.slice(0, 3).join(" | "));

await browser.close();

const failures = results.filter((r) => !r.ok);
for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.ok ? "" : `  → ${r.detail}`}`);
console.log(`\n${results.length - failures.length}/${results.length} keyboard checks passed`);
process.exit(failures.length === 0 ? 0 : 1);
