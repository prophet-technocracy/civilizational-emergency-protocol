// axe-core sweep: every view x light/dark, WCAG 2.1 A/AA + best practice.
// "" is the landing hash, which now resolves to the hub.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { launch } from "./launch.mjs";

const require = createRequire(import.meta.url);

const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const routes = [
  "",
  "hub",
  "levels",
  "levels/3",
  "dashboard",
  "bank",
  "principles",
  "programme",
  "referendum",
  "governance",
  "transition",
  "institutions",
  "historical-archive",
  "research",
  "verification",
  "accountability",
  "public-services",
  "projects",
  "simulations",
  "digital-legacy"
];
const url = process.env.CEP_URL ?? "http://127.0.0.1:5173";

const browser = await launch();
const page = await browser.newPage();
const summary = {};

for (const theme of ["light", "dark"]) {
  await page.goto(`${url}/#/dashboard`, { waitUntil: "networkidle0" });
  await page.evaluate((t) => {
    localStorage.setItem("cep.theme", t);
    localStorage.setItem("cep.lang", "fa");
  }, theme);
  for (const route of routes) {
    await page.goto(`${url}/#/${route}`, { waitUntil: "networkidle0" });
    await page.reload({ waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 400));
    await page.evaluate(axeSource);
    const violations = await page.evaluate(async () => {
      const out = await axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] }
      });
      return out.violations.map((v) => ({
        id: v.id, impact: v.impact, nodes: v.nodes.length,
        sample: v.nodes[0]?.target?.join(" ")?.slice(0, 80),
        msg: v.nodes[0]?.failureSummary?.slice(0, 140)
      }));
    });
    if (violations.length) summary[`${theme}:${route}`] = violations;
  }
}

// The mobile drawer is a separate state: audit it open, at phone width.
await page.setViewport({ width: 390, height: 844 });
await page.goto(`${url}/#/dashboard`, { waitUntil: "networkidle0" });
await page.reload({ waitUntil: "networkidle0" });
await page.click(".nav-toggle");
await new Promise((r) => setTimeout(r, 350));
await page.evaluate(axeSource);
const mobile = await page.evaluate(async () => {
  const out = await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] } });
  return out.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, sample: v.nodes[0]?.target?.join(" ")?.slice(0, 80) }));
});
if (mobile.length) summary["390:nav-open"] = mobile;

await browser.close();
console.log(JSON.stringify(summary, null, 1));
