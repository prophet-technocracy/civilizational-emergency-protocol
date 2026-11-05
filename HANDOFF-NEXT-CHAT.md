# Handoff — next chat

Working note for whoever picks this up next (human or AI). It records what is
done, what is verified, and what to do next. The repository's own documents —
`README.md`, `docs/**`, `AGENTS.md`, `TASKS.md` — remain the source of truth for
scope; this file is only a session handoff and should be deleted once stale.

## Where things stand

- Branch: `arena/c55f8a61-civilizational-emergency-proto` (Arena tracks the
  session by this branch — never switch, rename or push elsewhere).
- Everything below is pushed. The previous branch's work (twelve views, a11y,
  bidi, layout) is already merged into `main` as PR #11.
- `npm test` → **124 tests, 0 failures**: api 42, web render 37, web
  demo-contract 5, domain-models 9, localization 7, schemas 24.
- `npm run check` → PASS; CSV gate PASS (77 columns, 0 living rows); release
  **GATED**.
- axe-core over 12 views × light/dark **plus the open mobile drawer**: 0 violations.
- Keyboard walkthrough: **15/15** checks pass.
- Layout sweep, 12 views × 4 widths × both languages: clean.

## What the last batch did (keyboard and focus)

- `apps/web/src/lib/focus.js` — new `useFocusTrap({ active, onEscape, initialFocus })`
  and `prefersReducedMotion()`. The trap wraps Tab/Shift+Tab, handles Escape and
  restores focus to the element that had it before the overlay opened.
- `App.jsx` — search overlay and the mobile module drawer use the trap; the page
  behind an open overlay is `inert`; the closed off-canvas drawer is `inert`;
  `navigate()` and hash navigation move focus to the main region; smooth scroll
  is skipped under `prefers-reduced-motion`.
- `components/ui.jsx` — `Drawer` uses the trap and is labelled by its heading;
  **`Toast` used to crash**: its close button read a `dict` that did not exist in
  scope, so the first toast blanked the view. It now takes `lang`.
- `modules/Institutions.jsx` — `wrapLabel()` no longer drops words (it silently
  truncated "راهنمای خدمات عمومی (این سامانه)"), the map node keeps name and
  category in one accessible name, and the line geometry centres three lines.
- `App.jsx` / `styles.css` — the search trigger keeps its accessible name below
  900 px (label visually hidden instead of `display: none`; the `kbd` hint is
  `aria-hidden`).
- `scripts/audit/` — the browser checks now live in the repo with a README, so
  they no longer have to be rewritten from scratch each session.

## Verifying a change

```sh
cd /home/user/civilizational-emergency-protocol
npm install          # first time in a fresh sandbox
npm test             # 124 tests, no browser needed
npm run check        # tests + 77-column CSV gate + production build
npm run dev          # API :3001, web :5173
node scripts/audit/a11y.mjs      # needs the browser setup in scripts/audit/README.md
node scripts/audit/keyboard.mjs
node scripts/audit/layout.mjs
```

In a fresh sandbox `/tmp` is empty: `/tmp/chromium` and `/tmp/al2023libs` must be
recreated with `npm i --no-save puppeteer-core axe-core @sparticuz/chromium` and
the extraction snippet in `scripts/audit/README.md`. If no browser can be
obtained, say so plainly instead of claiming a visual or keyboard pass — the test
suite still covers contrast, headings, names, ratios and hit areas.

## Next batches, in priority order

**B. Interaction states.** The views were built for the happy path.
- Stop the API and load every view: `StateBlock` must say the data is
  unavailable, never fall back to invented numbers.
- Zero-result archive filter, empty search, the verification simulator's
  rejected-action path, the "no disclosure open" state on digital-legacy.
- Confirm the toast auto-dismiss and its `role="status"` announcement (now that
  it renders at all).

**C. English (LTR) typographic pass.** Layout sweeps only prove nothing
overflows. Read the twelve views in `lang=en` for punctuation, direction of mixed
content, and the `formatDate` output ("4 فروردین 2026 · 9:12" keeps Persian month
names by design — confirm that is still intended).

**D. Dark theme composition review.** Contrast is proven; composition is not.
Check the dense views (research distribution bars, verification policy matrix,
archive dossier cards) for muddy bands or invisible borders.

**E. Print / PDF.** `@media print` exists but was never exercised. Print one
dossier page and the verification matrix; check page breaks, that the synthetic
banner survives, and that no control prints as a meaningless box.

**F. Copy review.** Persian terminology consistency across modules
(«اپیستمیک» vs «معرفتی», «سطح» vs «بند», «بازبینی» vs «بازبینی مستقل»), and the
labels that still wrap awkwardly at 390 px (the header brand takes four lines).

## Standing rules

- Work in batches; `git push` after each batch to this branch.
- Never weaken a safety guarantee to make a screen look better: no living-person
  data, no claim of ratified authority, no outbound link that was not verified,
  no number presented as fact that the fixture does not contain.
- Every fix that can be asserted without a browser gets an assertion in
  `apps/web/test/render.test.mjs` (SSR harness bundled with esbuild) or
  `apps/api/test/server.test.mjs`.
- Update the README test count and interface-check list whenever tests change.
- Dates are Gregorian with Persian month names, never a Jalali claim; minutes
  stay Latin (`:04`).
