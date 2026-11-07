# The master engineering specification, read against this repository

**Status:** Phase 1 assessment, for review. **Date:** 2026-11-07.
**Answers:** `docs/engineering/MASTER-SPEC.md` — §1.2 (initial assessment) and the first half of §16 (Phase 1), in the shape §18 asks for.
**Files read:** `apps/api/src/server.mjs` and `apps/api/src/data/*`, `packages/domain-models/{influence,hmmt}.mjs`, `packages/schemas`, `apps/web/src/{App.jsx,i18n.js,demo-contract.mjs}`, `apps/web/src/modules/*`, `apps/web/src/platform/telegram/*`, `scripts/audit/guardrails.mjs`, `docs/architecture/*`.
**AI disclosure:** written by an AI agent after reading the code; every claim below is either a file reference or marked as an interpretation.

Labels, as the project requires: **Fact** (verifiable in the repository), **Interpretation**, **Proposal**, **Open question**.

---

## 0. What this document is, and what it is not

It is the assessment §1.2 demands, written down instead of discussed, so the next engineer can disagree with a paragraph rather than with a chat log. It is **not** an implementation: nothing under `apps/` or `packages/` was changed for it.

It also does not pretend the specification and the repository are the same kind of thing. They are not, and the distance between them is the finding.

---

## 1. The finding, in four sentences

**Fact.** The specification describes a multi-user institutional platform: authenticated identities, a user record per person, per-user balances, real ballots with eligibility, treasury accounts, and a contractor workflow with funding and audit.

**Fact.** This repository is a single-user, read-only, synthetic demonstrator: 32 `GET` endpoints under `/api/v1`, no `POST` (`apps/api/src/server.mjs:826` answers `405` with `Allow: GET`), no database driver in any `package.json`, no cookie, no session, no user table, and a transport contract that rejects personal-data keys outright (`apps/web/src/demo-contract.mjs`).

**Fact.** Roughly half of what the specification asks an engineer to *design* — the five levels, action-scoped authority, professional qualification scoped to a domain, the HMMT cap ladder, referendum arithmetic, the programme state ladder — is already written as pure, tested domain code in `packages/domain-models/` and `apps/api/src/data/`.

**Interpretation.** So the work is not "build the specification". It is: **decide whether this repository may become a system that holds real people, and in the meantime build everything that does not require a person.** This document separates those two piles.

---

## 2. Architecture and stack (Fact)

| Layer | What is there | Consequence for the specification |
| --- | --- | --- |
| Runtime | Node 22, ESM everywhere, no transpiler on the server | §12.1's "reuse existing schemas" means plain `.mjs` modules, not an ORM |
| API | `node:http`, one `createServer()` in `apps/api/src/server.mjs`, a route table plus two dynamic paths | §12.2's conventions: envelope + `epistemicNotice`, `sendJson`, 400 on a bad query, 405 on a write |
| Persistence | **None.** No `writeFile`, no driver, no migrations. Data is `Object.freeze`d constants in `apps/api/src/data/` | §12.1's twenty concepts have nowhere to live yet. This is the biggest single gap |
| Web | React 18 + Vite 6, 17 views in `VIEWS` plus the level chooser and a not-found view; hash routing | §13.2's journey starts at a Telegram login this app does not have |
| Domain | `packages/domain-models` — pure functions, no clock, no network, no globals (`influence.mjs` states this in its header) | Directly reusable as the authorization core §11 asks for |
| Schemas | `packages/schemas` — validators with 24 tests | The natural home for §12.1's record shapes |
| Localization | `packages/localization` + `apps/web/src/locales/`, machine-checked glossary, tests fail on an Arabic `ي`/`ك` | §3.1 is **already satisfied**; that is not a small thing |
| Tests | **394 passing**: api 111, web 184, domain-models 68, schemas 24, localization 7 | §15's suites for auth, voting and treasury have no subject yet |
| Telegram | Adapter + signature validation (`HMAC-SHA-256`, `Ed25519`), no identity storage, `GET /api/v1/telegram/session` returns `501` until a token exists | §4.1's step 2 ("associate with the CEP user record") is the missing half — deliberately |

---

## 3. The five institutions against what exists

The specification names five institutions; the repository has a different (and older) vocabulary — six doors and twelve library modules. Naming is the first thing that must be agreed, because "% complete" means nothing across two different taxonomies.

| Specification (Persian) | Nearest surfaces today | State | Evidence |
| --- | --- | --- | --- |
| **داده** — Data | `Archive` (historical dossiers), `Research` (evidence library), `DigitalLegacy`, `apps/api/src/data/{archive,evidence}.mjs` | **Partial** — curated read-only collections; no record CRUD, no access policy per record, no attachments, no versions, no provenance chain | module files, `GET /api/v1/{archive,evidence,digital-legacy}` |
| **مهستان** — Mahestan | `Referendum` (instrument, gates, outcome arithmetic), `Programme` (queue whose money cannot move before a passed ballot), `Simulations` (design lab) | **Partial** — the *arithmetic* of a ballot and the *rules* of a queue exist; no ballot a person can cast, no voter roll, by design | `apps/api/src/data/referendum.mjs`, `programme.mjs:404`, guardrails asserting `holdsVoterRoll === false` |
| **دیوان شیشه‌ای عدالت** — Justice | `Accountability`, `Principles` (113-row coverage), `Verification` (assurance bands) | **Missing as an institution** — the transparency surfaces exist, the judicial one does not; no procedures, no case model | §8.2 of the spec allows "a clean modular foundation and documented gaps", which is precisely the right instruction here |
| **خزانه** — Treasury | `Bank` (HMMT ceiling, net backing, cap ladder, fee note), `Projects`, `apps/api/src/data/hmmt.mjs`, `packages/domain-models/hmmt.mjs` | **Partial, and deliberately narrow** — supply, backing, caps and conversions are modelled and tested; there are no accounts, no transfers, no loans, no debts, and no RWA (the maintainer's Phase-0 direction excludes RWA, liquidity minting and any redemption promise) | `hmmt.mjs` invariants, `docs/economics/HMMT-DESIGN.md` |
| **نظام حکمرانی** — Governance system | `Governance` (charter, layers, accountability records), `Programme` (contractor projects with cap checks) | **Partial** — a 5-state ladder with rules and separation-of-duties invariants; not the specification's 12-state machine, and nothing transitions | `apps/api/src/data/programme.mjs:404`, `CONTRACT_TERMS`, `PROGRAMME_RULES` |

**Interpretation.** Four of five institutions are "partial" in the same way: the *reasoning* exists as data and pure functions; the *institution* — identities, permissions, writes — does not. That is a consistent posture, not an accident, and §15 of the specification would test the parts that are absent.

---

## 4. Section-by-section conformance

`I` = implemented, `P` = partial, `M` = missing, `X` = conflicts with a standing project rule. "Blocked by" names a decision in §7.

| Spec | Requirement | State | What exists / what is missing | Blocked by |
| --- | --- | --- | --- | --- |
| §3.1 | Persian-first, RTL, numerals, mixed text | **I** | Whole interface; localization tests fail the build on an Arabic glyph or a discouraged synonym | — |
| §3.2 | Country selector in the drawer, Iran only | **M** | No country concept anywhere; a one-file change once named | — |
| §4.1 | Validate Telegram auth on the server | **I** | `apps/api/src/platform/telegram/initdata.mjs`: HMAC in constant time, Ed25519 for third parties, 24 h window, duplicate-key refusal; 20 tests | — |
| §4.1 | Associate identity with a CEP user record; first-time vs returning | **X** | No user record exists, and the project's rule is that one does not: `demo-contract.mjs` rejects personal-data keys, `principles` states zero living-person data | D10, D11 |
| §4.1 | Secure session management | **M** | No session of any kind; every route is public by construction | D12 |
| §4.2 | Profile: name, username, nickname, verification, level, balance | **X** | Requires storing a person's name and username | D10 |
| §4.3 | Five civic levels, displayed | **P** | `CIVIC_LEVELS` in `packages/domain-models/influence.mjs:21` — five levels, each with purpose, `holdsBallot`, and an action list; pages at `#/levels` | D13 (who verifies a level) |
| §4.4 | Operating level ≠ verified level ≠ role ≠ permission | **P** | The distinction is modelled (`authorizeAction({level, actionId, actor, resource})` returns `{allowed, code, reason, audit}`), but there is no actor to hold a verified level | D12, D13 |
| §4.5 | HEMMAT balance from the authoritative source | **X** | The bank shows entity-level caps and synthetic deposits; there is no per-person balance and inventing one is explicitly forbidden | D15 |
| §5.1–5.3 | Four tiles, fifth only for Levels 4–5, RTL order | **M** | The Hub is six doors; no institutional tile grid, no level-gated tile | — (buildable) |
| §5.4 | Dashboard hierarchy | **P** | A dashboard module exists (module 1) with different content; the hierarchy the spec asks for needs the profile and balance above it | D10, D15 |
| §6.2–6.3 | Data record structure, create/edit, versions, provenance, attachments | **M** | Read-only collections; the *shape* of a record is the buildable part | — (schema only) |
| §6.4 | Per-record access policy | **M** | Assurance bands describe what evidence a band needs; no record carries a policy | D10 if policy is per person |
| §6.5 | IP/NFT documentation, keeping record ≠ token ≠ patent ≠ ownership | **P** | `docs/strategy/…` and the HMMT design already refuse to conflate these; no record-level integration | — |
| §7.2–7.4 | Public and professional voting with eligibility | **P** | `computeReferendumOutcome`, `DECISION_RULES`, domain-scoped `computeProfessionalWeight` — the rules exist; no ballots are recorded (`recordsRealBallots: false` is asserted by the guardrails) | D14 (thresholds are drafts, issue #21) |
| §7.5 | Backend-enforced voting integrity | **M** | Nothing accepts a vote, so nothing enforces one; the invariant "money never moves before a passed ballot" is checked, which is the moral equivalent | D14 |
| §8 | Justice entry point; preserve what exists; document what is unspecified | **M** | No entry point; procedures unspecified in the spec itself | D16 (who holds judicial authority) |
| §9.2–9.5 | Accounts, transfers, loans, debts, payments | **X** | No ledger, no accounts; the bank is a policy simulator | D15 |
| §9.6 | RWA tokenisation | **X** | The maintainer's Phase-0 direction excludes RWA, liquidity minting and redemption promises | D15 |
| §9.8 | No simulated transfer by editing a frontend number | **I** | Structurally impossible: there is no number to edit | — |
| §10.3–10.4 | Seven-stage workflow, 12 states, backend-validated transitions | **P** | `PROGRAMME_STATES` has five (`proposed → balloted → funded → in-execution → delivered`); rules and contract terms exist; nothing transitions | — (buildable as pure code) |
| §10.5 | Separation of responsibilities | **P** | Encoded as data invariants (contractor level 4, mudarabah contract, cap check, ballot before money) and asserted by the guardrails | — |
| §10.6 | Project transparency | **P** | `#/programme` shows the queue, cap, ballot and audit state | — |
| §11 | Seven separate security concepts; backend enforcement | **P** | The seven concepts are named and modelled in `authorizeAction`; there is no authenticated actor, so enforcement has no subject | D10, D12 |
| §11.3 | Hiding a tile is not a control | **I** (as a rule) | The project already states this; nothing today claims otherwise | — |
| §12 | Database and API architecture | **M** | No database at all | D11 |
| §13.1–13.2 | Persian-first institutional UI; journey starts at Telegram auth | **P** | Design system, RTL, light/dark, 390–1440, axe-clean; the journey's first three steps do not exist | D10 |
| §13.3 | Loading, empty, unauthorized, auth-failure, network, invalid, server-error states | **P** | Loading, timeout, offline, stale and contract errors were built and tested (PR #68); *unauthorized* and *empty* have no subject | — |
| §13.4 | Mini App mobile targets | **P** | Adapter, probe, mock harness and reviewer page exist; no client, no token | — |
| §14 | Sessions, permissions, vote/financial record protection, audit trail | **M** | `authorizeAction` returns an `audit` field; nothing persists it | D11, D12 |
| §15 | Test suites for auth, levels, authorization, Mahestan, treasury, governance, UI | **P** | 394 tests exist and pass; the seven suites the spec names need subjects that do not exist | D10–D15 |
| §16 | Implementation sequence | — | Re-sequenced in §8 below, because Phase 2 as written begins with a login | — |
| §17 | Acceptance table | — | Ten of fifteen rows are gated behind identity or money | D10–D15 |

---

## 5. What already exists, that the specification would otherwise ask someone to design

This is the part worth protecting. Each line is a Fact with a path.

1. **Five levels with action-scoped authority** — `packages/domain-models/influence.mjs:21` and `authorizeAction` at `:533`. Levels are *not* ranks: an action is permitted to a set of levels, and a refusal carries a reason in both languages. §11.1's first four concepts are already separated here.
2. **Professional authority scoped to a domain** — `computeProfessionalWeight`, `DECISION_DOMAINS`. §7.3's example ("a civil engineer must not receive medical voting rights") is a test, not a design question.
3. **Delegation with limits** — `validateDelegation`; and `ballotsCreated` is a constant zero, so public reach can never silently become individual ballots.
4. **HMMT supply, backing and the cap ladder** — `packages/domain-models/hmmt.mjs`: haircuts, basket, ceiling, conversion, cap policies per level, invariants that fail the build when broken. §9.7's "do not create duplicate balance systems" has a concrete referent.
5. **Ballot arithmetic** — `computeReferendumOutcome` with explicit decision rules, quorum and thresholds; `comparePolicies` for two configurations on one proposal.
6. **A programme state ladder with separation of duties** — `apps/api/src/data/programme.mjs:404`, `PROGRAMME_RULES`, `CONTRACT_TERMS`; the guardrail that money cannot move before a passed ballot is checked on every build.
7. **A transport contract that refuses person-shaped data** — `apps/web/src/demo-contract.mjs`: an envelope mode, a forbidden-key list, and a test that every payload is clean.
8. **Guardrails over claims and copy** — `scripts/audit/guardrails.mjs` fails the build if a payload claims to be a government, an election authority, or a ratified charter.
9. **Persian-first, RTL, accessible** — a design system with logical properties, two audited themes, an axe-clean sweep and a Persian glossary enforced by tests.

---

## 6. What is genuinely missing, and is *not* blocked

Each of these can be built today without an identity, a balance or a database, and each leaves the app working. Ordered by risk.

| # | Work | Why it is unblocked | Acceptance test |
| --- | --- | --- | --- |
| A | **Country selector** (spec §3.2): Iran only, in the drawer, labelled as the only supported country | Presentation and a static list | The drawer shows Iran, selected; a test asserts only one country is offered and that unsupported values are refused |
| B | **Institutional tile grid** (§5): four tiles in RTL order, fifth present but gated by the *rule*, not by a hidden `div` | `authorizeAction` already decides; the grid renders what it decides | Four tiles for levels 1–3, five for 4–5, from a table-driven test; the gated route answers a labelled refusal, not a blank page |
| C | **Governance transitions as pure code** (§10.4): extend the five states to the specification's ladder, with `canTransition(from, to, actor)` and terminal states | Pure function, no storage | Every allowed transition has a test; every forbidden one returns a reasoned refusal; `GET` shows the table |
| D | **Data record schema** (§6.2): `packages/schemas` gains a record with category, provenance, version and access policy | Schema + validators only | Valid record passes; missing required fields fail with named errors; an access policy value outside the enum is refused |
| E | **Justice entry point** (§8): a page assembling accountability, principles and assurance, with an explicit "procedure unspecified" notice | The surfaces exist; the spec allows a foundation | The route renders, names what is unspecified, and does not imply jurisdiction |
| F | **Unauthorized and empty states** (§13.3) | The health/error machinery from #44 already exists | A refused action renders a reasoned state in fa and en, never a blank screen |

**Proposal.** Take **B + C** first: they are the two rows the specification calls "authorization" and "governance", they are pure logic plus a table, and they make every later row cheap. A and E are visible wins that can ride along.

---

## 7. Decisions only the maintainer can make

Numbered from D10 because D1–D9 are already recorded in the strategy documents. Each is phrased so that "no" is a complete answer.

| # | Question | Why it blocks | If it stays unanswered |
| --- | --- | --- | --- |
| **D10** | May this repository ever hold a real Telegram identity — a name, a username, an id? Today the answer is enforced as *no* (`demo-contract.mjs`, the principles page, the guardrails) | §4.1, §4.2, §5.4, §13.2 all begin there | The dashboard's profile, verification and balance stay unbuilt; the app stays a demonstrator |
| **D11** | If yes: where does it live? A SQLite file, a Postgres instance, or a service someone else runs? And who holds the key | §12 needs a store before any record can exist | Every write-shaped feature is blocked, not just identity |
| **D12** | Session model: a signed cookie, a bearer token in `localStorage`, or nothing | §4.1's steps 6–7, §14 | No authorization can be enforced, only illustrated |
| **D13** | Who verifies a civic level, with what evidence, and who may revoke it | §4.3–4.4 and §7.4 all assume a verifier | A user's "verified level" would be a number we invented — forbidden |
| **D14** | Voting rules: thresholds, weights, duplicate handling (issue #21 open) | §7.5 forbids inventing them; the code comments call the current ones drafts | Mahestan can show arithmetic but cannot accept a ballot |
| **D15** | Treasury: is there an authoritative ledger anywhere? And does the Phase-0 refusal of RWA, liquidity and redemption (which §9.6 contradicts) still stand | §4.5, §9.2–9.7 | The balance line stays a labelled zero; the RWA section stays unimplemented |
| **D16** | Justice: who holds the authority the module would be a window onto? | §8.2 says do not invent procedures or powers | The entry point can exist; nothing beyond a foundation can |

**Interpretation.** D10 is the gate. D11–D16 only become urgent if D10 is answered *yes*, and D10 has a legitimate "no": this repository may be the *specification and simulation* layer, with the live system elsewhere. That would keep every guardrail intact and still allow the whole interface to be built against synthetic actors.

---

## 8. A re-sequenced plan (adjusting §16, with the reason)

§16's Phase 2 starts with a login, which is the one thing D10 may forbid. The same objectives are reachable in this order:

| Phase | Work | Depends on |
| --- | --- | --- |
| **A** (now) | Country selector; tile grid; governance transitions; record schema; justice foundation; unauthorized/empty states | Nothing |
| **B** | A labelled **synthetic actor**: a demo actor whose level is chosen in the interface and marked as fabricated everywhere it appears, so that a gated tile and a refused action can be *seen* without a real person | D10 = "synthetic only" |
| **C** | The seven-stage workflow as a state machine over fixtures, with the audit stage kept separate and the completion ≠ audit-passed rule tested | Phase A, and #21 for the vote thresholds |
| **D** | Identity, session, verification — the real ones | D10–D13, and a data-protection design before a line of code |
| **E** | Treasury accounts and transfers | D15, and a ledger decision |
| **F** | Data module writes, versions, provenance | D11 |

Phase B is the one that needs a sentence of caution: a synthetic actor that *looks* like a login is the most tempting lie in this whole plan. It must be labelled in the payload (not only in the copy), refused by the guardrails if the label is missing, and impossible to mistake for a real session.

---

## 9. Conflicts stated plainly

| Specification | Project rule | Reading |
| --- | --- | --- |
| §4.1 associate a Telegram identity with a user record | Zero living-person data; `demo-contract.mjs` rejects the keys | Not reconcilable by code. Needs D10 and, if yes, a new posture document that supersedes the old one openly |
| §4.5 display HEMMAT balance | Never fabricate a balance | Safe only with a ledger; until then the honest display is "no balance exists in this build" |
| §7.2–7.5 real ballots | `holdsVoterRoll: false`, `recordsRealBallots: false`, asserted every build | A vote here can be a *rehearsal* on fixtures, labelled; not a ballot |
| §9.6 RWA tokenisation | Phase-0: no RWA, no liquidity, no redemption promise | The specification is behind the maintainer's own later decision; §9.6 should be marked superseded rather than implemented |
| §14 audit logging | No persistence, so no log | Follows D11 |

**Interpretation.** None of these is an engineering disagreement. Each is a decision about what the artefact *is*, and the repository has already answered them once — loudly, in tests. Changing the answers is legitimate; changing them silently is what the guardrails exist to prevent.

---

## 10. Code scanning: four open alerts

**Fact (observed in a screenshot supplied by the maintainer; the API refuses this integration with 403, so the alert metadata could not be read directly).** Four open `High` alerts, all `Incomplete multi-character sanitization` or `Incomplete string escaping or encoding`, all in `apps/web/test/render.test.mjs`.

**Interpretation.** They point at test helpers that normalise text for assertions — `out.replace(/\s+/g, " ").trim()` at `:199` and a regex-escape helper at `:204`, used to compare rendered HTML. No untrusted input reaches them and nothing ships from that file. **Proposal:** dismiss as "used in tests" with a comment, or replace the regex with a small explicit helper whose intent is obvious; either is a five-minute change and neither belongs in this PR.

---

## 11. The §18 report, for this phase

| §18 section | Status at Phase 1 |
| --- | --- |
| A. Architecture assessment | This document §2–§3 |
| B. Frontend | §2, §4 rows for §13–§14 |
| C. Backend | §2, §4 rows for §12 and §11 |
| D. Database | **Nothing to report**: none exists. That is the finding |
| E. Testing | 394 pass, 0 fail, `npm run check` 8/8. The specification's §15 suites have no subject |
| F. Remaining work | §6 (unblocked), §7 (decisions), §8 (sequence) |
| G. Modified files | **None.** No application code was changed for this assessment |

---

## 12. What this assessment could not verify

- **Whether the specification's authors intend a real user base now, or a fully built interface against synthetic actors.** D10 decides; nothing in the text settles it, and §4's "associate with the correct CEP user record" reads as if a record already exists.
- **The five institutions' relationship to the twelve modules.** §19 says "distinct but integrated"; the repository has two overlapping taxonomies and no document that reconciles them. This is a naming decision before it is a code decision, and it should be made before any route is renamed.
- **The state of "justice" outside this repository.** §8.2 defers to existing judicial functionality; none was found here, and none was searched for elsewhere.
- **Anything about live deployments, hosting, or who would operate a real version.** Out of scope of an assessment that only reads a repository.
- **The four code-scanning alerts' exact rule metadata** — see §10.

---

**Next step, if this is accepted:** implement rows **B** (institutional tile grid, RTL order, rule-gated fifth tile) and **C** (governance transitions as pure code with reasoned refusals), each with its own tests, and neither touching the read-only posture. If D10 is answered *yes* first, do **D** before anything else — an interface built on an identity shape that then changes is the expensive version of this work.
