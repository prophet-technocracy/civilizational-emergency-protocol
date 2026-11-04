# CEP Civilizational Operating System — System Architecture & Final Assessment Report

**Document ID:** `CEP-ARCH-001`  
**Department:** Department A — Executive Architecture Office  
**Status:** Implemented Prototype Architecture (Local Read-Only Demonstrator; Awaiting Human Review)  
**Date:** 2026-11-04  

---

## 1. Executive Summary

The **Civilizational Emergency Protocol (CEP) Civic Operating System Prototype** transforms the existing repository scaffold into a cohesive, modular, twelve-module civic infrastructure demonstrator. It is engineered to communicate institutional sophistication, epistemic rigor, historical continuity, privacy-preserving access assurance, and constitutional neutrality while remaining strictly within the safety and governance boundaries defined in `FOUNDING-CHARTER.md`, `GOVERNANCE.md`, `AGENTS.md`, and `docs/iran/DISCOVERY-AND-EXECUTION-REPORT.md`.

### Core Architectural Tenets
1. **Strict Constitutional Non-Authority:** The software never claims to be a government, representative body, election authority, or ratified mandate. A persistent top-level banner and module-level notices distinguish repository bootstrap proposals from community ratification.
2. **Epistemic Traceability First:** Every institutional description, transition stage, historical dossier, and analytical claim carries a machine-validated epistemic status (`source-verified`, `source-reported`, `proposed`, `hypothetical`, `disputed`, `unverified`, or `synthetic-fixture`) and links to a structured provenance record.
3. **Read-Only Zero-PII Architecture:** The backend (`apps/api`) uses Node.js's built-in HTTP server with zero external runtime dependencies, enforcing `GET`-only operations (`405 Method Not Allowed` on all mutations), strict query validation, defensive HTTP headers, and zero user data collection.
4. **Deceased-Only Synthetic Archive with 77-Column Gate:** Module 05 demonstrates the full 77-column dossier architecture using clearly labelled fictional/synthetic historical records, backed by an executable validation pipeline (`scripts/validation/validate-historical-csv.mjs`) that programmatically rejects any `status=living` rows or unapproved datasets.
5. **Action-Scoped Assurance (Five Bands):** Module 07 separates Authentication, Attribute Assurance, Authorization, and Audit—evaluating minimum necessary proofs per action rather than ranking human worth or inferring citizenship.
6. **Intentional Persian-First RTL + English LTR:** Built with semantic HTML, accessible keyboard navigation, localized numeral and dual-calendar formatting, and instant switching between Persian (`fa`, `dir="rtl"`) and English (`en`, `dir="ltr"`).

---

## 2. High-Level System Blueprint

```text
┌───────────────────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER (Persian RTL / English LTR)                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │ Persistent Constitutional & Synthetic-Demo Transparency Banner              │  │
│  ├──────────────────┬──────────────────────────────────────────────────────────┤  │
│  │ Collapsible      │ Top Command Bar: Global Search · Breadcrumbs · Lang/Theme│  │
│  │ Institutional    ├──────────────────────────────────────────────────────────┤  │
│  │ Sidebar          │ Active Module Viewport (Modules 01 – 12)                 │  │
│  │ (Modules 01–12)  │  • Interactive SVG Dependency Maps & Timeline Engine     │  │
│  │                  │  • Deceased-Only Dossier Inspector & Conflict Comparator │  │
│  │                  │  • Five-Band Policy Simulator & Constitutional Lab       │  │
│  │                  ├──────────────────────────────────────────────────────────┤  │
│  │                  │ Slide-Over Provenance & Citation Inspector Drawer        │  │
│  └──────────────────┴──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────┬─────────────────────────────────────────┘
                                          │ Same-Origin Read-Only GET (/api/v1/*)
                                          ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                     VITE DEV SERVER / SAME-ORIGIN PROXY (:5173)                   │
└─────────────────────────────────────────┬─────────────────────────────────────────┘
                                          │ Proxies /api/* and /health
                                          ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                   CEP READ-ONLY NODE.JS HTTP API SERVER (:3001)                   │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │ Security & Method Middleware: GET-only (405) · Query Sanitizer (400)        │  │
│  │ Headers: Cache-Control: no-store · X-Content-Type-Options: nosniff          │  │
│  ├─────────────────────────────────────────────────────────────────────────────┤  │
│  │ Versioned Route Router (/health, /api/v1/demo, /api/v1/dashboard ... /v1/*) │  │
│  └──────────────┬───────────────────────────────┬──────────────────────────────┘  │
└─────────────────┼───────────────────────────────┼─────────────────────────────────┘
                  │                               │
                  ▼                               ▼
┌───────────────────────────────────┐ ┌─────────────────────────────────────────────┐
│   SHARED WORKSPACE PACKAGES       │ │   SYNTHETIC FIXTURES & VALIDATION SCRIPTS   │
│ • packages/domain-models          │ │ • apps/api/src/data/fixtures.mjs            │
│ • packages/schemas                │ │ • data/synthetic/*.csv                      │
│ • packages/localization           │ │ • scripts/validation/validate-historical... │
└───────────────────────────────────┘ └─────────────────────────────────────────────┘
```

---

## 3. Repository Structure

```text
civilizational-emergency-protocol/
├── agents/
│   ├── departments/                 # 8 Engineering Department charters (Depts A–H)
│   ├── iran-mini-app/TASKS.md       # Iran-specific gated task board
│   ├── MASTER-TASK-BOARD.md         # Master engineering task board & dependency graph
│   ├── RESEARCH-STANDARDS.md        # Epistemic & citation standards
│   └── WORKSTREAMS.md               # Research workstreams
├── apps/
│   ├── api/                         # Read-only Node.js HTTP API (@cep/api)
│   │   ├── src/
│   │   │   ├── content.mjs          # Preserved legacy /api/v1/demo synthetic payload
│   │   │   ├── data/
│   │   │   │   └── fixtures.mjs     # Comprehensive synthetic dataset for Modules 01–12
│   │   │   └── server.mjs           # Modular read-only router, query validator, security headers
│   │   └── test/
│   │       └── server.test.mjs      # Unit, contract, and security tests for all API routes
│   └── web/                         # Persian RTL / English LTR React + Vite app (@cep/web)
│       ├── src/
│       │   ├── App.jsx              # Complete 12-module Civic Operating System shell & views
│       │   ├── demo-contract.mjs    # Runtime contract validators (legacy + v1 modular)
│       │   ├── main.jsx             # Application entrypoint
│       │   └── styles.css           # Institutional design system (RTL/LTR, Light/Dark, A11y)
│       └── test/
│           └── demo-contract.test.mjs # Frontend contract, schema, localization, and policy tests
├── data/
│   ├── schemas/
│   │   └── historical-dossier-77col.schema.json
│   └── synthetic/
│       └── synthetic-deceased-archive-sample.csv
├── docs/
│   ├── architecture/
│   │   ├── SYSTEM-ARCHITECTURE.md
│   │   ├── MODULE-MAP.md
│   │   ├── DATA-FLOW.md
│   │   └── TECHNICAL-DECISIONS.md
│   ├── iran/                        # Discovery, implementation, public-service & assurance plans
│   └── security/
│       └── THREAT-MODEL-AND-AUDIT.md
├── packages/
│   ├── domain-models/index.mjs      # 17 database-ready domain entity schemas & factories
│   ├── localization/index.mjs       # Bilingual (fa/en) strings, numerals, dates, search helpers
│   └── schemas/index.mjs            # Epistemic validators, 77-col CSV checker, assurance evaluator
└── scripts/
    └── validation/
        └── validate-historical-csv.mjs # CLI & programmatic 77-column CSV safety gate validator
```

---

## 4. Deployment-Readiness Assessment

### Current Prototype State: **READY FOR LOCAL DEMONSTRATION & HUMAN REVIEW**
- **Local Execution:** Fully functional via `npm run dev` (API on `:3001`, Vite web preview on `:5173`) with zero external API keys or database servers required.
- **Automated Verification:** Unit, API contract, security, CSV safety-gate, and production bundle (`npm run check`) suites execute deterministically and pass.

### Public Production Deployment Status: **INTENTIONALLY GATED (BLOCKED PENDING HUMAN GATES)**
Per `agents/iran-mini-app/TASKS.md` and `docs/iran/IMPLEMENTATION-PLAN.md`, this prototype must **not** be deployed as a public production service until the following human-governed gates are formally satisfied:
1. **Gate G-01 (Source Provenance & Rights — `CEP-IRAN-002`):** Written confirmation from source custodians regarding publication licenses, canonical versions, and quotation permissions for external PDFs and datasets.
2. **Gate G-02 (Data Publication & Living-Person Exclusion — `CEP-IRAN-003` & `005`):** Independent human verification that living-person datasets remain permanently excluded and that any deceased-only historical records have row-level source citations before replacing synthetic fixtures.
3. **Gate G-03 (Bilingual Editorial Verification — `CEP-IRAN-004`):** Qualified bilingual human review of all institutional and timeline terminology against primary Persian sources.
4. **Gate G-04 (Independent Security, Privacy & Rights Sign-Off — `CEP-IRAN-007` & `015`):** External human security reviewer sign-off on hosting jurisdiction, DDoS protection, incident response runbooks, and takedown procedures.
5. **Gate G-05 (Community Governance Ratification):** Per `GOVERNANCE.md`, repository merges represent code publication only, not community ratification.
