// Layout sweep: horizontal overflow, offscreen nodes, clipped text and
// undersized controls, every view at five widths and both themes.
import { launch } from "./launch.mjs";

// Every view the router can reach, not just the twelve library modules: the hub,
// the level chooser, a level, the bank, the principles, the programme and the
// referendum are all part of the interface, and until this list was widened they
// were the four places a 320 px overflow could hide (it did).
const routes = [
  "hub", "levels", "levels/3", "dashboard", "bank", "principles", "programme", "referendum",
  "governance", "transition", "institutions", "historical-archive", "research", "verification",
  "accountability", "public-services", "projects", "simulations", "digital-legacy"
];
const url = process.env.CEP_URL ?? "http://127.0.0.1:5173";

const browser = await launch();
const page = await browser.newPage();
const problems = [];

// 320 px is the WCAG 1.4.10 reflow width (400% zoom of a 1280 px window); it is
// narrower than any phone the audit used to test, and it is where fixed-width
// rows and non-wrapping labels break first.
for (const width of [1440, 1024, 768, 390, 320]) {
  await page.setViewport({ width, height: 900 });
  await page.goto(`${url}/#/dashboard`, { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    localStorage.setItem("cep.theme", "light");
    localStorage.setItem("cep.lang", "fa");
  });
  for (const route of routes) {
    await page.goto(`${url}/#/${route}`, { waitUntil: "networkidle0" });
    await page.reload({ waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 300));
    const out = await page.evaluate(() => {
      const scrollX = (() => {
        window.scrollTo({ left: -2000, top: 0 });
        const left = window.scrollX;
        window.scrollTo({ left: 2000, top: 0 });
        const right = window.scrollX;
        window.scrollTo({ left: 0, top: 0 });
        return Math.max(Math.abs(left), Math.abs(right));
      })();
      const label = (el) => `${el.tagName.toLowerCase()}${el.className ? `.${String(el.className).split(" ").filter(Boolean).slice(0, 2).join(".")}` : ""}`;
      const offscreen = [];
      const clipped = [];
      const tiny = [];
      for (const el of document.querySelectorAll("main *")) {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        if (el.closest(".table-wrap")) continue; // scrolls on purpose
        if (r.right > window.innerWidth + 1 || r.left < -1) offscreen.push(label(el));
        const cs = getComputedStyle(el);
        if (
          (el.textContent || "").trim() &&
          (cs.overflow === "hidden" || cs.overflowX === "hidden") &&
          el.scrollWidth > el.clientWidth + 2 &&
          cs.textOverflow !== "ellipsis"
        ) {
          clipped.push(label(el));
        }
        if ((el.tagName === "BUTTON" || el.tagName === "A") && (r.width < 24 || r.height < 24) && !el.closest(".skip-link")) {
          tiny.push(`${label(el)} ${Math.round(r.width)}x${Math.round(r.height)}`);
        }
      }
      return {
        scrollX,
        offscreen: [...new Set(offscreen)].slice(0, 5),
        clipped: [...new Set(clipped)].filter((c) => !c.includes("sr-only")).slice(0, 5),
        tiny: [...new Set(tiny)].slice(0, 5)
      };
    });
    if (out.scrollX > 1 || out.offscreen.length || out.clipped.length || out.tiny.length) {
      problems.push({ width, route, ...out });
    }
  }
}

await browser.close();
for (const p of problems) console.log(JSON.stringify(p));
console.log(problems.length === 0 ? "layout sweep clean" : `${problems.length} problems`);
process.exit(problems.length ? 1 : 0);
