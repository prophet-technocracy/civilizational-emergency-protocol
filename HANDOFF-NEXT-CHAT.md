# Handoff — five-level civic operating system

Replace this note when it goes stale. Scope authority: `README.md`, `docs/**`, `AGENTS.md`, `TASKS.md`.

## State

- Branch: `arena/1a0e7968-civilizational-emergency-proto`.
- `npm test` → **176 tests, 0 failures**; `npm run check` PASS; CSV gate PASS; release **GATED**.
- axe-core over the six level views × light/dark × 1440/390 px + the twelve legacy modules: **0 violations**.
- Bundle: JS 408 kB (118 kB gzip), CSS 58 kB (11 kB gzip).

## What exists now

| Layer | Where | Note |
|---|---|---|
| Influence / authority engine | `packages/domain-models/influence.mjs` (+ `test/influence.test.mjs`, 27 tests) | pure, deterministic: ballots, professional weight, endorsement reach, qualification, delegation, posthumous mandate, `authorizeAction` |
| Shared synthetic records | `apps/api/src/data/civic-levels.mjs` | one record set behind all five levels; connected workflow `WF-SYN-001` |
| API | `/api/v1/levels`, `/api/v1/levels/:id?policy=`, `/api/v1/influence`, `/api/v1/influence/qualify`, `/api/v1/influence/authorize` (403 on scope violation) | boundary enforced server-side, not just in the UI |
| Five-profile home + level views | `apps/web/src/modules/LevelHome.jsx`, `Level.jsx` | route `#/levels`, `#/levels/1..5`; policy switch re-queries with `?policy=` |
| Locale files | `apps/web/src/locales/{fa,en}/levels.js`, `locales/index.js` | legacy UI dictionary still in `i18n.js`, migrating module by module |
| Glossary + style guide | `docs/localization/*.md`, `packages/localization/glossary.mjs` | glossary is machine-read by `apps/web/test/localization.test.mjs` |
| Screenshots | `docs/screenshots/*.png` | home, levels 1 / 3 / 5 |

## Next, in order

1. **Level 2 depth.** The selective-credential panel proves the claim; make it interactive (choose attributes → see the assertion preview). No real verification.
2. **Advocacy accountability surface.** Endorsement history, corrections, withdrawals and disclosure status exist as data (`endorsements`, `advocates`) but only summary rows are rendered; correction/withdrawal timeline is missing.
3. **Node explorer.** Individual/group/institution/project/evidence/proposal/advocacy/decision nodes and scoped relationships are modelled implicitly; an explicit explorer is not built.
4. **Phase G polish.** Mobile: header brand still wraps to four lines at 390 px; stat rows are uneven at 390 px; the level header badge is cramped in dark mode.
5. **Legacy module migration.** Move `i18n.js` strings into `locales/{fa,en}/` module by module; each move keeps the 12 modules rendering identically.
6. **Print/PDF pass** on the level views (not yet attempted).

## Rules that still apply

- Never weaken a guarantee for a nicer screen: no living-person data, no ratified-authority claim, no unverified outbound link, no number the fixtures do not contain.
- Every new formula stays a labelled configurable draft until something is formally adopted.
- Add a render/API test for anything assertable without a browser; update the README test count.
- Persian copy goes in locale files only, and the glossary tests must stay green.
