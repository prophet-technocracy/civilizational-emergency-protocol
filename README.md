# Civilizational Emergency Protocol (CEP)

> Open civic infrastructure for peaceful, democratic, accountable and human-centred transformation.

CEP is an open-source initiative exploring how people can coordinate knowledge, deliberation, public-interest projects and accountable institutions—especially during periods of profound social or political transition.

**This repository is an invitation to build in public.** Researchers, developers, designers, translators, civic groups and independent AI agents are welcome to examine the ideas, challenge assumptions and contribute improvements.

## Our starting commitments

- **Popular sovereignty:** legitimate public authority must rest on the people affected by it.
- **Equal civic standing:** no person should be excluded from participation because of identity, belief, status or political viewpoint.
- **Pluralism:** peaceful disagreement and competing constitutional proposals are legitimate.
- **Nonviolence and human rights:** CEP supports peaceful civic action and rejects intimidation, political violence and collective punishment.
- **Transparency and accountability:** decisions, funding criteria, conflicts of interest and project outcomes should be inspectable.
- **Privacy and safety:** do not expose people to risk by collecting or publishing sensitive personal or political data.
- **Open contribution:** proposals are evaluated on their merits, not on loyalty to a founder, faction or preferred outcome.

## Community-governed from the beginning

CEP's intended governance is community-governed. This repository is currently in its **founding draft stage**: its charter and decision procedures are proposals for public review, not a claim that a representative community has already been constituted or that binding votes are operational.

The repository owner currently has the technical ability to administer the GitHub project. That platform-level control is not a mandate to decide CEP's public mission unilaterally. We will document administrative powers, publish material decisions and develop a transparent process for community ratification and shared stewardship.

## Where to begin

- [The Declaration](DECLARATION.md) — a personal call for critical human–AI collaboration, edited for publication; [original text](docs/declaration-original.md) preserved
- [Founding Charter](FOUNDING-CHARTER.md) — principles and proposed limits
- [Vision](VISION.md) — the problem CEP is trying to address
- [Roadmap](ROADMAP.md) — staged development priorities
- [Governance](GOVERNANCE.md) — proposed community decision process
- [Contributing](.github/CONTRIBUTING.md) — how to participate
- [Open Questions](research/OPEN-QUESTIONS.md) — unresolved questions that need research and debate
- [Missions](missions/README.md) — how focused work is proposed and tracked

## Iran civic infrastructure prototype — twelve-module demonstrator

A local-only, read-only civic infrastructure prototype ("Civilizational Operating System") with **twelve navigable modules**. Every record is a **synthetic fixture, an explicit proposal, or a labelled reference**: the prototype is not an official service, holds **zero living-person data**, and contains no source-verified Iran transition data. See the [implementation phases](docs/iran/IMPLEMENTATION-PLAN.md), [discovery report](docs/iran/DISCOVERY-AND-EXECUTION-REPORT.md), [system architecture](docs/architecture/SYSTEM-ARCHITECTURE.md), and [task board](agents/iran-mini-app/TASKS.md).

| # | Module | What it demonstrates |
|---|---|---|
| 01 | پیشخوان تمدنی / Civilization Dashboard | Counts derived from this prototype's own fixtures, system status, epistemic distribution |
| 02 | حکمرانی و منشور / Governance & Constitution | Ten proposed principles, five layers, amendment register, non-ratified status statement |
| 03 | معماری گذار ایران / Iran Transition Architecture | 180-day emergency phase **separated** from the 2–3 year horizon; per-stage uncertainty and dependencies |
| 04 | کارپوشهٔ نهادها / Institutional Directory | Proposed institutions + interactive SVG dependency/oversight map, sunset clauses |
| 05 | بایگانی تاریخی / Historical Archive | Deceased-only synthetic dossiers, bilingual search, citations, conflicting accounts, revision history, 77-column gate report |
| 06 | کتابخانهٔ پژوهش و شواهد / Research & Evidence Library | Source registry, claim provenance chain, contradiction explorer, unresolved questions |
| 07 | تضمین دسترسی پنج‌سطحی / Five-Band Assurance | Action-scoped authorization simulator; bands authorize actions, never rank people |
| 08 | پاسخگویی و شفافیت / Accountability | Append-oriented log, conflicts of interest, independent review records (no false immutability claim) |
| 09 | راهنمای خدمات عمومی / Public Service Directory | Public entry links only; unverified labels; no API enumeration or integration claims |
| 10 | پروژه‌های نفع عمومی / Public-Good Projects | Objectives, milestones, completion evidence; zero governance privileges |
| 11 | آزمایشگاه طراحی نهادی / Institutional Design Lab | Hypothetical comparison of four institutional models + safeguard trade-off exploration |
| 12 | میراث دیجیتال و اصل ۲۰ / Digital Legacy & Principle 20 | Seven-clause exploratory concept, isolated from the archive; voice/likeness/posthumous agency absolutely prohibited |

To run the local development prototype (Node.js 22.12 or newer):

```sh
npm install
npm run dev
```

The web app is served by Vite on port 5173 (Persian RTL by default, English LTR switchable) and proxies read-only `/api` requests to the local Node API on port 3001. The prototype collects no user information: no accounts, cookies, analytics, or logs of any kind.

Verification:

```sh
npm test         # 119 tests: API contract/security, response-envelope contract,
                 # domain models, schemas, localization, SSR render + a11y guards
npm run validate:csv   # 77-column historical-dossier gate validator
npm run build    # production bundle check
npm run check    # all three, in order
```

Interface checks that run inside `npm test` (no browser required):

- server-side rendering of all twelve views with `fetch` disabled,
- the response-envelope contract (`mode`, `schemaVersion`, `generatedAt`, bilingual epistemic notice) enforced on every `/api/v1` payload, including a deep scan that rejects personal-data keys and any `living` record,
- heading order, accessible names on every control, and WCAG AA contrast for the ink/teal tokens in both light and dark themes,
- counted ratios rendered in reading order, and text-link buttons kept at a 24 px hit area.

The same twelve views were additionally audited in a real headless Chromium with axe-core (WCAG 2.1 A/AA + best practice) in light and dark mode; the result is zero violations. A layout sweep of all twelve views in both languages and both themes found no horizontal scrolling, no offscreen elements and no clipped text. Contrast failures and undersized hit areas found that way are now part of the render tests so they cannot return.

See [docs/architecture/](docs/architecture/) for the architecture, module map, data flow and decisions, and [docs/security/THREAT-MODEL-AND-AUDIT.md](docs/security/THREAT-MODEL-AND-AUDIT.md) for the independent audit. Public deployment remains **gated** pending human review.

## Agent task board

- [Master engineering task board](agents/MASTER-TASK-BOARD.md) — the twelve-module prototype plan, dependency graph, owners and review status
- [Engineering departments](agents/departments/README.md) — the eight departments (A–H) with charters, scope and acceptance criteria
- [Task backlog](TASKS.md) — priorities and status for human and AI contributors
- [Task system](tasks/README.md) — how to claim, deliver and review tasks
- [CEP-T001: Iran transition research](tasks/001-iran-democratic-transition-research.md) — the first country-specific research mission

## Agent collaboration

- [Agent invitation and operating brief](AGENTS.md) — mission, boundaries and workflow for human and AI agents
- [Agent workstreams](agents/WORKSTREAMS.md) — independent research and development tasks
- [Research standards](agents/RESEARCH-STANDARDS.md) — evidence, citations, reproducibility and safety
- [Declaration review brief](agents/DECLARATION-REVIEW.md) — structured critical review of the published Declaration

## Contribute

Start with an [open issue](../../issues) or [discussion](../../discussions) if available. For changes, fork the repository and open a pull request. Please read the contribution and security guidance first.

No contributor is authorised to speak for a population, political movement or community merely by contributing to CEP. Participation here does not confer a public mandate.

## Current status

**Experimental, non-governmental, non-partisan civic infrastructure research.** CEP is not a government, political party, election authority, representative body or substitute for independent civil society. All mission plans and institutional models are proposals until openly reviewed and legitimately adopted by the people they concern.

## License

The repository currently includes an MIT license. Before adding substantial non-code research, policy or educational materials, the community should review whether a separate documentation/content license is appropriate.
