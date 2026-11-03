# Mini App Backend and Frontend: Phased Implementation Plan

**Status:** Working engineering plan; proposed, local-only prototype work in progress.
**Date:** 2026-11-04.
**Related:** [Discovery and Execution Report](DISCOVERY-AND-EXECUTION-REPORT.md), [Iran task board](../../agents/iran-mini-app/TASKS.md).

## Objective

Begin a Persian-first, read-only Mini App with a replaceable backend and frontend while the source-rights, translation, and data-publication questions remain open. The initial implementation must use only clearly labelled synthetic content, collect no user information, and make no claim that CEP is an official partner or that any transition institution or timeline is established.

## Implementation phases and gates

| Phase | Backend | Frontend | Exit criteria / gate | Status |
|---|---|---|---|---|
| 0. Discovery and risk boundary | Inventory data and services; identify sensitive-data risks | Confirm no current user flows or design system | Discovery report exists; living-person datasets excluded; human review still required | Complete as a draft; review pending |
| 1. Local development foundation | Node.js read-only HTTP service; health route; versioned synthetic demo-content route; no persistence, auth, personal-data logging, or write operations | React + Vite shell; Persian RTL, English-ready structure, accessible responsive layout; same-origin API calls | Starts locally with one command; API and contract tests and production build pass; no actual dossier/source content included | Ready for human review |
| 2. Content contract and editorial surfaces | Define versioned schemas for source documents, source passages, claims, institutions, and stages; distinguish source assertion from reviewed fact | Add content views and persistent status labels for proposed, unverified, disputed, and source-checked records | Bilingual human review of labels; source/version and permission metadata agreed; contract tests pass | Planned; no source content until approved |
| 3. Approved read-only content | Serve only reviewed/public content from a version-controlled catalogue; consider database only if a real maintenance need is demonstrated | Timeline/institution/library views; search only over approved public content | Rights and data-publication gates pass; every factual claim has a source path; privacy/accessibility/security review | Blocked on source and human review |
| 4. Persistence and editorial administration (conditional) | If needed, select PostgreSQL or another justified store, add migrations, immutable review history, backups, access controls | Add maintainer-only editorial tools only after a separate threat model | Written need, roles, retention, recovery, audit and incident plans; independent security review | Not started; may be omitted |
| 5. Public contribution workflows (conditional) | Research a minimal correction intake; no identity data by default; moderation and abuse protections | Add clearly non-binding corrections/questions only if safe and accessible | Affected-community input, legal/privacy/security review, moderation/appeal/takedown procedures, explicit consent and retention rules | Deferred; “do not build” remains an option |
| 6. Deployment and operations | Harden headers, rate/abuse controls as appropriate, observability with privacy-minimal telemetry, backup/incident runbooks | Test real low-bandwidth devices, RTL and screen readers; publish limitations | Maintainer ownership, hosting/data-jurisdiction decision, threat review, release checklist and rollback tested | Not started; local scaffold is not production-ready |

## Technical starting point

- **Repository layout:** npm workspaces with `apps/api` and `apps/web`.
- **Backend:** Node.js built-in HTTP server to keep the initial API small and dependency-light. Routes are read-only: `GET /health` and `GET /api/v1/demo`. No database, authentication, user identifiers, analytics, file uploads, or mutation endpoints.
- **Frontend:** React and Vite, with `lang="fa"`, RTL as the default, semantic landmarks, keyboard-visible focus, responsive layout, and reduced-motion support. The UI calls only relative `/api/...` URLs; Vite proxies those requests server-side during development.
- **Data:** synthetic product/module placeholders only. Do not ingest attached CSVs or PDFs. No living-person records, stable person codes, or political participation records enter the app.
- **Persistence:** intentionally absent. Use version-controlled content only after publication approval. Add a database only if reviewed requirements prove that static content is inadequate.
- **API contract:** explicit `mode: "synthetic-demo"`, a visible notice, and runtime-validated fields; the response must never be presented as source-verified data.
- **Operations:** bind development services to `0.0.0.0` for preview access; browser code remains same-origin and must not call localhost. Development proxy accepts the Arena preview host. Do not deploy publicly from this scaffold.

## Initial work in this change

1. Add a local API with `GET /health` and `GET /api/v1/demo`, both read-only.
2. Add tests for API response shape, method restrictions, and not-found behavior.
3. Add a Persian RTL frontend that displays the API's synthetic modules, loading/error states, and a prominent non-verified-data notice.
4. Add one-command development and build/test scripts.
5. Run API and frontend contract tests, production build, and the app in the Arena preview; inspect served output and verify that only synthetic text is exposed.

## Explicit non-goals for this phase

No source-data import; no real transition timeline or institution claims; no user accounts or submissions; no database; no AI content generation; no search over people; no electoral, deliberative, or binding functions; no private «پرونده هستی» feature; no public deployment. Those require separate evidence, authority, safety, privacy, and human-review gates.

## Risks and rollback

The main risks are that a placeholder looks authoritative, the backend becomes a route for collecting data by accident, or local scaffolding is mistaken for production readiness. Keep a persistent demo banner, reject all non-GET API requests, ship no user-data fields, and state the local-only status in the interface and README. Rollback is a simple removal of `apps/` and workspace scripts because the scaffold has no persistent data or migrations.
