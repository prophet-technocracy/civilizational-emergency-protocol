# Handoff — five levels + the HMMT bank

Replace this note when it goes stale. Scope authority: `README.md`, `docs/**`, `AGENTS.md`, `TASKS.md`.

## State

- Branch: `arena/a8e95163-civilizational-emergency-proto`, branched from `main` at `a78a1ed` (PR #13 merged).
- `npm test` → **237 tests, 0 failures** (api 60, web 88, domain-models 58, schemas 24, localization 7, demo-contract 5).
- `npm run build` → 490 kB JS (139 kB gzip), 62 kB CSS (12 kB gzip).
- axe-core over `#/bank` × light/dark × 1440/390 px + English: **0 violations** (with the haircut chain expanded). Level views re-checked in the previous batch: 0 violations.
- No open PR. PRs are opened only when asked; never merge them.

## What exists now

| Layer | Where | Note |
|---|---|---|
| Influence / authority engine | `packages/domain-models/influence.mjs` (36 tests) | ballots, professional weight, endorsement reach, qualification, delegation, posthumous mandate, `authorizeAction` |
| HMMT monetary engine | `packages/domain-models/hmmt.mjs` (22 tests) | definition, `REFERENCE_DATA`, tiers, `HAIRCUT_POLICY` (HC-DRAFT-01), basket, ceiling, convert, redeem, proof of reserve, phases, invariants |
| Shared synthetic records | `apps/api/src/data/civic-levels.mjs` | one record set behind all five levels, workflow `WF-SYN-001` |
| HMMT demo data | `apps/api/src/data/hmmt.mjs` | synthetic deposit/redemption ledger, supply/backing/reserve views, simulator |
| API | `/api/v1/levels`, `/api/v1/levels/:id?policy=`, `/api/v1/influence[/qualify|/authorize]`, `/api/v1/hmmt[/supply|/backing|/reserve|/ledger|/simulate]` | scope checks and amount validation enforced server-side |
| Five-profile home + levels | `apps/web/src/modules/LevelHome.jsx`, `Level.jsx`, `levels/panels.jsx` | `#/levels`, `#/levels/1..5` |
| HMMT bank | `apps/web/src/modules/Bank.jsx` | `#/bank`: ceiling vs circulating, haircut chain, proof of reserve, convert/redeem simulator, ledger, phases, architecture |
| Locales | `apps/web/src/locales/{fa,en}/{levels,bank}.js` | 164 bank keys per locale; legacy dictionary still in `i18n.js` |
| Docs | `docs/economics/HMMT-FACT-CHECK.md`, `docs/economics/HMMT-DESIGN.md`, `docs/localization/*` | figures with sources/dates/statuses; architecture and threat model |
| Screenshots | `docs/screenshots/*.png` | five-level home, levels 1/3/5, `hmmt-haircut-chain`, `hmmt-proof-of-reserve`, `hmmt-simulator` |

## Key numbers (do not restate them without the source)

- 1 HMMT = 1e12 toman. At 269,305 toman/USD (2026-10-29) that is **USD 3,713,261.91**.
- Gross in-situ resources USD 27.3 tn → haircut chain → net **USD 703.8 bn** (2.58 %) → ceiling **189,544 HMMT**.
- Without haircuts the same headline would yield **7,352,027 HMMT**; the screen and the tests assert that number is never presented.
- Two ratios stay apart: `reserveRatio` (toman per circulating token) and `assetCoverage` (backing per ceiling token).
- Unverified figures: central-bank reserves (USD 15 bn modelled, weight 0), marketable state assets incl. real estate (USD 120 bn modelled, weight 0), broad money (no figure used).

## Next, in order

1. **Bank depth.** Reserve history over time (a small sparkline of the two ratios), and a "what if" control that re-runs the ceiling under a haircut scenario from `HAIRCUT_POLICY.stress` — already modelled, not yet rendered.
2. **Level 2 depth.** The selective-credential panel proves the claim; make it fully interactive (choose attributes → assertion preview). No real verification.
3. **Advocacy accountability surface.** Endorsement corrections and withdrawals exist as data; the timeline is not rendered.
4. **Node explorer.** Individual/group/institution/project/evidence/proposal/advocacy/decision nodes with scoped relationships — modelled implicitly, not explorable.
5. **Phase G polish.** Mobile: header brand wraps at 390 px; stat rows uneven; the bank's simulator labels crowd on narrow screens.
6. **Legacy module migration.** Move `i18n.js` strings into `locales/{fa,en}/` module by module.
7. **Print/PDF pass** on the level and bank views (not yet attempted).

## Rules that still apply

- Never weaken a guarantee for a nicer screen: no living-person data, no ratified-authority claim, no unverified outbound link, no number the fixtures do not contain.
- HMMT stays a design proposal: no real issuance, no wallet custody, no payment path, no mainnet deployment, no KYC or identity.
- Every new formula and every monetary parameter stays a labelled configurable draft until something is formally adopted.
- A gross figure is never presented as backing; the haircut chain is the disclosure.
- Add a render/API/domain test for anything assertable without a browser; update the README test count and the interface-check list.
- Persian copy goes in locale files only, and the glossary tests must stay green (new terms: پشتوانه، سقف عرضه، عرضهٔ در گردش، بازخرید، اثبات ذخیره، زنجیرهٔ کسر).
