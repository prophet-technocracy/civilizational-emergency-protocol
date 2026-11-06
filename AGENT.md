# AGENT.md — the operating contract for an autonomous contributor

You are an AI agent with a checkout of **CEP (Civilizational Emergency Protocol)**, a
civic-infrastructure prototype: a React application, a read-only synthetic API, three
shared packages, and a documentation set that makes claims about governance.

This file is written to be *executed*, not admired. Every section ends in something you
can run or check. If you only read one thing, read §1 and §4.

```
WHO YOU ARE HERE      a contributor with repository rights, not an author with authority
WHAT YOU MAY DO       fix, test, document, translate, audit, and open a pull request
WHAT YOU MAY NOT DO   claim truth, invent data, self-approve, merge, or speak for a population
HOW YOU PROVE WORK    node scripts/agent/run.mjs --full   (exit 0 = CI will pass)
WHERE WORK COMES FROM agent/tasks.json                    (node scripts/agent/tasks.mjs list)
```

---

## 1. Verify your environment (do this first, it takes 40 seconds)

```sh
npm install            # required after every fresh checkout: node_modules is not in git
npm test               # expect 300 passing tests across 5 workspaces, 0 failures
npm run check          # the full gate; also prints the per-step table CI uses
```

| Command | What it proves | Typical time |
| --- | --- | --- |
| `npm test` | 300 unit/render/localization tests | 4 s |
| `npm run lint` | ESLint flat config, zero errors | 3 s |
| `npm run check` | lint + tests + guardrails + CSV + build + doc drift + link integrity | 15 s |
| `node scripts/agent/run.mjs --browser` | axe, keyboard and layout audits against a running dev server | 60 s |
| `node scripts/agent/tasks.mjs list` | the claimable backlog, priority first | instant |

If `npm test` fails with `ERR_MODULE_NOT_FOUND: @cep/schemas`, you skipped `npm install`.
If a port is taken: `npm run dev` needs `5173` (web) and `3001` (API); `WEB_PORT`,
`API_PORT`, `PORT` override them. Do not kill processes you did not start.

---

## 2. Architecture in one screen

```
browser ──▶ apps/web (React 18, Vite, hash routing, no client state library)
              │  fetch /api/v1/...  (proxied by Vite to :3001)
              ▼
            apps/api (node:http, read-only, synthetic data, no auth, no writes)
              │  imports
              ▼
            packages/schemas  (payload contracts)   packages/domain-models  (arithmetic:
                                                   caps, haircuts, HMMT, ballot, referendum)
            packages/localization (locale loading, parity checks)
```

```
apps/web/src/
  App.jsx              routes, theme, shell composition (~370 lines, the only router)
  main.jsx             mount + the crash fallback
  i18n.js              non-translatable shared vocabulary (module names, numerals, decimals)
  locales/{fa,en}/     all user-visible copy, one file per area: shell, hub, levels, bank,
                       principles, programme, referendum
  components/          ui.jsx (primitives), icons.jsx, Header.jsx, KeyDock.jsx,
                       SearchOverlay.jsx, StateBlock is in ui.jsx
  modules/             one file per view; modules/levels/panels.jsx holds Level 1-5 panels
  lib/                 api.js (useApi + cache), routes.js (route table), decimal.mjs
                       (amount parsing), focus.js, theme.js, build.js
  styles.css           5,700 lines, the single stylesheet (see task ENG-053)

apps/api/src/          server.mjs (http, query sanitising) + data/*.mjs (synthetic payloads)
packages/*/            pure logic + node:test suites, no browser dependencies
scripts/audit/         guardrails.mjs (claims), a11y.mjs (axe), keyboard.mjs, layout.mjs
scripts/agent/         run.mjs (self-check), tasks.mjs (backlog CLI), docs-links.mjs
agent/tasks.json       the machine-readable backlog
data/synthetic/        fixtures; never replace with real personal data
docs/                  architecture, strategy, ux, principles, security, localization, telegram
```

**Data flow to respect.** `packages/domain-models` computes, `apps/api` serves the result,
`apps/web` renders it and never recomputes a rule. A number that appears in two places is
a bug waiting to disagree with itself.

**Routing.** `apps/web/src/lib/routes.js` is the single route table: `parseHash`,
`routeMeta`, `hrefFor`, `principleAnchor`. Adding a view means adding it there and in
`App.jsx`, not inventing a second lookup.

---

## 3. Code style — enforced, then expected

Lint decides the first list; a reviewer decides the second.

**Enforced by `eslint.config.js`** (do not disable a rule to pass; fix the code):

- ESM everywhere, `type: module`, `.mjs` for pure logic and scripts, `.jsx` for components.
- `react-hooks/rules-of-hooks` (error), `react-hooks/exhaustive-deps` (warn, currently 2).
- `no-unused-vars`: unused bindings are a false claim about the code; prefix with `_` only
  for a deliberately unused parameter.
- `prefer-const`, `eqeqeq` (smart), `no-var`, `no-duplicate-imports`, `no-self-compare`,
  `no-throw-literal`, `no-unreachable`.
- `no-console` in `apps/web/src` and `packages/**` (the error boundary may use `console.error`).

**Expected, not lintable — match the file you are editing:**

1. **Two-space indent, double quotes, semicolons, trailing commas.** Look at the neighbours.
2. **Comments explain *why*, in one sentence, above the line that needs it.** No changelog
   comments, no `// TODO` without an issue number.
3. **Copy never lives in a component.** User-visible strings belong in
   `apps/web/src/locales/{fa,en}/…`; `t({ fa, en }, lang)` inline calls are a known debt
   (task ENG-035), not a pattern to copy.
4. **Persian numerals in `fa`.** Use `formatNumber(value, lang)`; never hard-code `۱`/`1`.
   Slash ratios are not used; state the denominator in words.
5. **No new dependency without a stated reason** in the PR body. The budget is zero for
   runtime dependencies unless a task says otherwise.
6. **Errors are values here.** `useApi` returns `{status, payload, error}`; views render
   `StateBlock`, they do not throw.
7. **`aria` before `div`.** A new control needs: a role if it is not a native element, a
   name that does not duplicate its visible text, and a visible focus ring from the
   existing tokens.

---

## 4. The contribution protocol (this is the part that matters)

### 4.1 Pick a task

```sh
node scripts/agent/tasks.mjs list            # open tasks, priority first
node scripts/agent/tasks.mjs show ENG-058    # input, output, acceptance, verify
node scripts/agent/tasks.mjs issue ENG-058   # a GitHub issue body, ready to paste
```

A task is *claimable* when `status` is `ready`. `proposed` means a maintainer decision is
missing — do not implement it; ask in the linked issue. `blocked` means someone is on it or
it waits on another task. One task per pull request. If you find work that is not on the
list, add it to `agent/tasks.json` in the same PR that solves it; `node
scripts/agent/tasks.mjs validate` is the contract that keeps the file honest.

### 4.2 Branch, work, verify

```sh
git switch -c agent/ENG-058-exhaustive-deps
# ... the change, plus the test that proves it ...
npm run check                       # must exit 0
node scripts/agent/run.mjs --browser   # for anything visible; needs `npm run dev` in another shell
```

Every behaviour change ships with a test in the same PR. A claim in the interface with no
test and no script is treated as unproven: that is the standing rule from
`docs/ux/AGENT-UX-CHECKLIST.md`, and a reviewer will ask for it.

### 4.3 Open the pull request

Title: `ENG-058: clear the two exhaustive-deps warnings`. Body, in this order:

1. **What changed** — files and behaviour, two sentences.
2. **Why** — the task id and the problem it removes.
3. **Proof** — the commands you ran and their verdicts (paste the runner's summary line).
4. **What is not done** — the honest list. An empty list is a claim; make it true.
5. **Self-critique** — what you are least sure about, in one paragraph.

Then wait. **You may not merge, self-approve, or mark a review complete.** Per
`AGENTS.md`, an agent executes a merge only when a human maintainer explicitly instructs
it to, after all required checks pass. If you are unsure who that is, stop and ask.

### 4.4 Definition of done (all six)

- [ ] `node scripts/agent/run.mjs --full` exits 0.
- [ ] The task's own `verify` commands pass.
- [ ] A test fails without your change (state it in the PR body).
- [ ] User-visible strings exist in both locales; `npm test` proves parity.
- [ ] No claim was added that the guardrail script cannot check.
- [ ] The "what is not done" list is explicit.

---

## 5. Audit checklists

Run these before claiming any of these areas. Each row names its own proof.

### 5.1 Accessibility

| Check | How to prove it |
| --- | --- |
| No axe violations on any route in either theme | `node scripts/audit/a11y.mjs` → `{}` (Persian; English is checked by the render tests, not in a browser — #64) |
| Tab order, focus ring, skip link, arrows and Enter in the search palette, escape behaviour | `node scripts/audit/keyboard.mjs` → 29/29 |
| No horizontal overflow and no target under 24 px at 320/390/768/1024/1440 px, header and key dock included | `node scripts/audit/layout.mjs` → clean |
| Every view keeps exactly one `h1`, even when its data fails | `npm test` — "every view keeps a level-one heading" |
| A disabled control is `disabled` and `aria-disabled`, not just grey | read the component; state it in the PR |

### 5.2 Data integrity

| Check | How to prove it |
| --- | --- |
| A number shown twice is computed once | grep the value in `packages/domain-models`; render it from there |
| Boundary semantics: supermajority `<=`, quorum `>=` | `packages/domain-models/test/*.test.mjs` |
| Amounts parse through `parseDecimalInput`, not `Number()` | `apps/web/test/decimal.test.mjs` |
| Generated docs match their source | `npm run docs:principles && git status` (the `drift` step does this) |
| Synthetic fixtures stay synthetic | `npm run validate:csv`; no real personal data, ever |

### 5.3 Copy, locales and claims

| Check | How to prove it |
| --- | --- |
| Both locales carry every key, no identical fa/en string | `apps/web/test/localization.test.mjs` |
| No rial sign for a toman unit, no invented citation | `npm run audit:guardrails` |
| The product never claims authority it does not have | `scripts/audit/guardrails.mjs` (read the assertions) |

### 5.4 Security and privacy

| Check | How to prove it |
| --- | --- |
| No credential, token or personal data in a fixture, test or log | `git grep -nE "(gh[pousr]_|token|password)"` and read the hits |
| No new network destination | read `apps/api/src/server.mjs`; the API is read-only and offline |
| No analytics, no telemetry, no cookies | there are none; do not add any |

---

## 6. Hard stops

Stop and say so, in the issue, if a request would require any of these:

1. **Inventing evidence** — a citation, an interview, an endorsement, a survey, a consensus,
   a test result. There is no acceptable version of this.
2. **Claiming legitimacy** — that the framework is validated, ratified, universally
   accepted, or authorised by a population. Merged ≠ ratified.
3. **Handling real personal or political data** — the archive is synthetic by design.
4. **Political operations** — persuasion, mobilisation, targeting, surveillance, doxxing.
5. **Merging your own work**, editing branch protection, or turning off a required check.
6. **Accepting a credential pasted into a chat.** Tell the user it is compromised, that only
   they can revoke it, and ask them to use the repository's own authentication.

---

## 7. What a contribution is worth here (no bounties)

This project offers **no payment, no token, no governance weight and no credit that implies
authority**. What a merged contribution earns is: a public record attributable to you, a
place in the changelog, and the thing the Declaration actually asks for — an examined
claim instead of an asserted one. Do not accept compensation for a pull request in this
repository, and do not present contribution volume as a substitute for public consent.

Reward-shaped and still honest: the tasks are sized `S`/`M`/`L`, the acceptance criteria are
checkable, and `node scripts/agent/run.mjs` gives you the same verdict a reviewer will get.
Predictability is the incentive.

---

## 8. Where to write things down

| You learned… | Put it in |
| --- | --- |
| A rule an agent must follow | this file, §3-§6 |
| A task someone can execute | `agent/tasks.json` (+ `node scripts/agent/tasks.mjs validate`) |
| A UX decision or a measured before/after | `docs/ux/AGENT-UX-CHECKLIST.md` |
| An architectural fact (a new layer, a new seam) | `docs/architecture/` and `llms.txt` |
| A research finding with sources | `agents/WORKSTREAMS.md` protocol, `docs/strategy/` |
| A check that can be automated | `scripts/audit/` and the `check` script — never a promise in prose |

---

## 9. Troubleshooting (symptoms seen in this repository)

| Symptom | Cause | Fix |
| --- | --- | --- |
| `ERR_MODULE_NOT_FOUND: @cep/schemas` | no `node_modules` | `npm install` at the repository root |
| `npm run dev` exits because the port is in use | a stale Vite or API process | find it: `ss -ltnp \| grep -E '5173\|3001'`, stop that PID |
| The browser audits cannot find a browser | Chromium is not installed | `scripts/audit/README.md`, then `node scripts/agent/run.mjs --browser` |
| A render test fails after a locale edit | key parity, or an identical fa/en string | `apps/web/test/localization.test.mjs` names the key |
| `git diff` is dirty after `npm run check` | generated doc drift | commit `docs/principles/PRINCIPLES-COVERAGE.md` |
| ESLint reports a rule you have never seen | a new rule landed | read `eslint.config.js`; the rule is there with its reason |

---

*This document is a contract about process, not a claim about the framework. It confers no
authority on you, on the author, or on any merged pull request.*
