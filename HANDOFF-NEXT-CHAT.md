# Handoff — the living covenant, the programme queue, the referendum instrument, one centre and six doors

Replace this note when it goes stale. Scope authority: `README.md`, `docs/**`, `AGENTS.md`, `TASKS.md`.

## State

- Branch: `arena/a214f05b-civilizational-emergency-proto`, branched from `main` at `b3670dc` (PR #15 merged).
- `npm test` → **268 tests, 0 failures** (api 70, web 99, domain-models 68, schemas 24, localization 7).
- `npm run build` → 557 kB JS (157 kB gzip), 85 kB CSS (16 kB gzip).
- axe-core over **20 routes** (landing `""`, `hub`, `levels`, `levels/3`, the bank, principles, the twelve modules) × light/dark × fa/en: **0 violations**. 390 px: no horizontal page overflow, and the key dock keeps seven slots on one row.
- No open PR. PRs are opened only when asked; never merge them.

## What exists now

| Layer | Where | Note |
|---|---|---|
| Living covenant | `apps/api/src/data/principles.mjs` (`PRINCIPLE_LIGHTS`, `READINESS_BANDS`, `readinessOf`), `apps/web/src/components/lights.jsx`, `#/principles` | green 1.0 / amber 0.1 / red 0.0 / grey excluded; readiness **0.306 «در ساخت»**; band «زنده» unreachable in code; tested in `apps/api/test/strategy.test.mjs` |
| Partial-coverage programme | `apps/api/src/data/programme.mjs`, `apps/web/src/modules/Programme.jsx`, `#/programme` | 12 projects, one per amber principle; ballot → level-4 cap (`checkLevelCap`) → mudarabah → audited delivery; gates computed, blocked projects reported; 12 of 47 amber principles targeted |
| Referendum instrument | `apps/api/src/data/referendum.mjs`, `apps/web/src/modules/Referendum.jsx`, `#/referendum` | four chained questions (form → assembly → ratification → government), `computeReferendumOutcome` pure, 4 rehearsals of which 2 refuse, 7 open gates, `isElectionAuthority: false` in the payload |
| Strategy docs | `docs/strategy/{LIVING-CONSTITUTION,IPP-RECONCILIATION,PARTY-AND-PARLIAMENT}.md` | weights and bands; IPP sources + the HMMT tension; premise register and the four stages to a party list |
| Hub + key dock | `apps/web/src/modules/Hub.jsx`, `apps/web/src/components/KeyDock.jsx`, `apps/web/styles.css` dock block, `localeStrings().hub` | `#/hub` is the landing (`""` and `#/` resolve to it): MY.X centre, six doors (levels 1–5 + the bank), station pill, guard callout, twelve-module strip. The fixed dock is on every route, one tab stop, `aria-current` on the pressed door, RTL-mirrored arrows. Pure helpers `nextDoorIndex`, `doorStepForArrow`, `doorHref`, `isDoorActive`, `DOORS` are exported and unit-tested. Rationale + self-criticism with ratings: `docs/ux/ONE-CENTRE-SIX-DOORS.md` |
| Influence / authority engine | `packages/domain-models/influence.mjs` (36 tests) | ballots, professional weight, endorsement reach, qualification, delegation, posthumous mandate, `authorizeAction` |
| HMMT monetary engine | `packages/domain-models/hmmt.mjs` (68 tests) | definition, `REFERENCE_DATA`, tiers, `HAIRCUT_POLICY` (HC-DRAFT-01), basket, ceiling, convert, redeem, proof of reserve, phases, **cap policies** (`CAP_POLICIES`, `CAP_POLICY_DEFAULT_ID`, `CAP_INVARIANTS`, `resolveLevelCap`, `checkLevelCap`, `capLadder`), invariants |
| Shared synthetic records | `apps/api/src/data/civic-levels.mjs` | one record set behind all five levels, workflow `WF-SYN-001` |
| HMMT demo data | `apps/api/src/data/hmmt.mjs` | synthetic entities + deposit/redemption ledger (each row keeps the `capTokens` it was recorded under), supply/backing/reserve views, `buildHmmtCaps`, level-aware simulator |
| API | `/api/v1/levels`, `/api/v1/levels/:id?policy=`, `/api/v1/influence[/qualify|/authorize]`, `/api/v1/hmmt[/supply|/backing|/reserve|/ledger|/caps|/simulate]` | `/simulate` takes `level`, `policy`, `entity`; unknown values return 400 (`invalid_level`, `unknown_policy`, `unknown_entity`) |
| Five-profile home + levels | `apps/web/src/modules/LevelHome.jsx`, `Level.jsx`, `levels/panels.jsx` | `#/levels`, `#/levels/1..5` |
| Mother-file coverage | `apps/api/src/data/principles.mjs`, `apps/web/src/modules/Principles.jsx` | `#/principles`: 113 principles from «فن‌سالاری اصلاح‌شده», four statuses, the surface that answers each, filterable; `GET /api/v1/principles` |
| HMMT bank | `apps/web/src/modules/Bank.jsx` | `#/bank`: ceiling vs circulating, **cap ladder** (3 policies × 5 levels, stacked under 720 px), haircut chain, proof of reserve, level-aware simulator, ledger, phases, architecture |
| Locales | `apps/web/src/locales/{fa,en}/{levels,bank}.js` | 201 bank keys per locale; legacy dictionary still in `i18n.js` |
| Docs | `docs/economics/HMMT-FACT-CHECK.md`, `docs/economics/HMMT-DESIGN.md`, `docs/principles/PRINCIPLES-COVERAGE.md`, `docs/localization/*` | figures with sources/dates/statuses; architecture, threat model, and the principle-by-principle coverage matrix |
| Screenshots | `docs/screenshots/*.png` | five-level home, levels 1/3/5, `hmmt-haircut-chain`, `hmmt-proof-of-reserve`, `hmmt-simulator`, `hmmt-cap-ladder`, `hmmt-cap-ladder-mobile`, `hmmt-level-cap-refusal`, `hmmt-entity-cap-refusal` |

## Key numbers (do not restate them without the source)

- 1 HMMT = 1e12 toman. At 269,305 toman/USD (2026-10-29) that is **USD 3,713,261.91**.
- Gross in-situ resources USD 27.3 tn → haircut chain → net **USD 703.8 bn** (2.58 %) → ceiling **189,544 HMMT**.
- Without haircuts the same headline would yield **7,352,027 HMMT**; the screen and the tests assert that number is never presented.
- Two ratios stay apart: `reserveRatio` (toman per circulating token) and `assetCoverage` (backing per ceiling token).
- Unverified figures: central-bank reserves (USD 15 bn modelled, weight 0), marketable state assets incl. real estate (USD 120 bn modelled, weight 0), broad money (no figure used).
- Cap ladder (`DEC-SYN-0042`, all drafts): `CAP-LADDER-DRAFT` = 0 / 0.05 / 0.05 / 1,000 / 0.05 HMMT; `CAP-ENTITY-SCALED-DRAFT` (**default**) = 0 / 0.05 / 0.05 / min(20 % of audited budget ÷ USD 3.71 m, 1,000, 25 % of ceiling) / 0.05; `CAP-PILOT-STRICT-DRAFT` = 0 / 0.01 / 0.01 / 100 / 0.01. Resolved entity caps in the default policy: ENT-SYN-01 240, 02 480, 03 120, 04 1,000 (hard cap), 05 600, 06 360, 07 160. The 0.05 figure, the 20 % and the 1,000 are **drafts, not findings** (fact-check §7).

## The mother file (coverage map)

`docs/principles/PRINCIPLES-COVERAGE.md` + `#/principles`, data in `apps/api/src/data/principles.mjs`. Source: the user's 84-page draft «فن‌سالاری اصلاح‌شده» (11 chapters, 113 principles: ۰٫۱–۰٫۱۳ and ۱–۱۰۰). Current split: **۲۱ covered, ۴۷ partial, ۱۶ gap, ۲۹ beyond software**. The rule the API test enforces: no principle is "covered" without a surface the API publishes, and every "beyond software" row must give a reason. The sixteen gaps are named in that document with the surface each would land on — that list *is* the backlog for this layer:

1. **Eight principles want data the fixtures do not have** (basic credit اصل ۸/۶۳, employment ۱۶, land registry ۲۸, taxation ۳۳, IP ۳۶, idle-land levy ۳۸, insurance ۶۲, pensions ۶۴). Each is a small fixture + one panel on the module named in the doc.
2. **Four want a page, not new law** (handover protocol ۰٫۱۱, education path ۴۲, elderly care ۶۷, baseline counsel ۸۳).
3. **Two want a register** (children's right-to-be-forgotten ۱۷, the oath ۹۹).
4. **Two want a model** (water ۷۲, asset migration ۹۴ — the second extends the bank's simulate path).

## Next, in order

1. **Bank depth.** Reserve history over time (a small sparkline of the two ratios), and a "what if" control that re-runs the ceiling under a haircut scenario from `HAIRCUT_POLICY.stress` — already modelled, not yet rendered. A cap editor (change one cell, see the ladder and the ledger's recorded rows re-check) is the natural next step on the ladder; it must write nothing but a diff.
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
- Persian copy goes in locale files only, and the glossary tests must stay green (new terms: پشتوانه، سقف عرضه، عرضهٔ در گردش، بازخرید، اثبات ذخیره، زنجیرهٔ کسر، سقف شخصی، سقف هر سطح).
- The cap ladder is data, not markup: a new policy or a changed number belongs in `CAP_POLICIES`, and the tests assert the six invariants for every policy, so a "generous" edit fails rather than ships.
