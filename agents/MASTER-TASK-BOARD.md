# CEP Master Task Board — Civilizational Operating System Prototype

**Status:** Active Execution & Review Register  
**Session Branch:** none — this register is branch-agnostic; each row names its own PR.  
**Backlog of record:** [`agent/tasks.json`](../agent/tasks.json), read with `node scripts/agent/tasks.mjs list`. This board keeps the dependency graph and the review narrative; the JSON keeps the executable specs, and the two must agree.  
**Last Updated:** 2026-11-06  

> **Governance & Review Notice:** Completion of a task on this board indicates that the engineering deliverable has been implemented, verified by automated tests, and cross-reviewed by an independent agent department. It does **not** constitute community ratification, public mandate, or authorization to merge into `main` without explicit human maintainer approval.

---

## 1. Task Dependency Graph

```text
[PHASE 0: RECONNAISSANCE]
   └── CEP-OS-001 (Repo & Dataset Reconnaissance)
          │
[PHASE 1: FOUNDATION & ARCHITECTURE (DEPT-A)]
          ├── CEP-OS-002 (Departments & Master Task Board)
          ├── CEP-OS-003 (System Architecture, Module Map, Data Flow & ADRs)
          └── CEP-OS-004 (Domain Models, Validation Schemas & Bilingual Localization)
                 │
[PHASE 2 & 3: CORE ENGINES, MODULES & SYNTHETIC DATA (DEPTS B, C, D, E, F, G)]
                 ├── CEP-OS-005 [DEPT-F] Evidence Provenance Engine & Source/Claim Registry (Mod 06)
                 ├── CEP-OS-006 [DEPT-B] Governance, Charter, Amendments & Accountability (Mod 02, 08, 10)
                 ├── CEP-OS-007 [DEPT-C] Iran Transition Timeline & Institutional Dependency Map (Mod 03, 04)
                 ├── CEP-OS-008 [DEPT-D] Deceased-Only Historical Archive & 77-Col CSV Validator (Mod 05)
                 ├── CEP-OS-009 [DEPT-E] Five-Band Assurance Matrix & Action Policy Simulator (Mod 07)
                 ├── CEP-OS-010 [DEPT-C] Safe Public Service Directory & REA Boundary (Mod 09)
                 ├── CEP-OS-011 [DEPT-B] Institutional Design Lab & Digital Legacy Principle 20 (Mod 11, 12)
                 └── CEP-OS-012 [DEPT-G] Civilization Dashboard, Persian RTL / English LTR Design System (Mod 01)
                        │
[PHASE 4 & 5: INTEGRATION, SECURITY AUDIT & VERIFICATION (DEPT-H)]
                        ├── CEP-OS-013 [DEPT-H] Read-Only API Hardening, Threat Model & Security Audit
                        └── CEP-OS-014 [DEPT-H] Unit, Contract, Security, RTL/Accessibility & Build Suite
```

---

## 2. Master Task Registry

| Task ID | Department | Description | Priority | Branch Designation | Dependencies | Owner | Status | Deliverable | Acceptance Criteria | Reviewer |
|---|---|---|---|---|---|---|---|---|---|---|
| `CEP-OS-001` | `DEPT-A` | Inspect repository, foundational charters, existing scaffold, tests, and dataset audit bounds | P0 | `architecture/system-blueprint` | None | Chief Systems Architect | Complete | Reconnaissance findings integrated in `docs/architecture/SYSTEM-ARCHITECTURE.md` | All 14 foundational documents inspected; existing `/health` and `/api/v1/demo` contracts preserved | `DEPT-H` Lead Auditor |
| `CEP-OS-002` | `DEPT-A` | Establish 8 engineering departments and master task board with dependency graph | P0 | `architecture/system-blueprint` | `CEP-OS-001` | Chief Systems Architect | Complete | `agents/departments/*.md`, `agents/MASTER-TASK-BOARD.md` | Every department has mandate, scope, deliverables, acceptance criteria, and reviewer | `DEPT-B` Lead |
| `CEP-OS-003` | `DEPT-A` | Author System Architecture, Module Map, Data Flow, and Technical Decisions (ADRs) | P0 | `architecture/system-blueprint` | `CEP-OS-001` | Chief Systems Architect | Complete | `docs/architecture/SYSTEM-ARCHITECTURE.md`, `MODULE-MAP.md`, `DATA-FLOW.md`, `TECHNICAL-DECISIONS.md` | Clear module boundaries, data flows, epistemic tags, and deployment-readiness assessment | `DEPT-H` Lead Auditor |
| `CEP-OS-004` | `DEPT-A` | Implement database-ready domain models (17 entities), validation schemas, and bilingual localization engine | P0 | `architecture/system-blueprint` | `CEP-OS-003` | Chief Systems Architect | Complete | `packages/domain-models/index.mjs`, `packages/schemas/index.mjs`, `packages/localization/index.mjs` | All 17 entities validated; Persian/English numerals, dates, and RTL/LTR helpers tested | `DEPT-F` & `DEPT-G` Leads |
| `CEP-OS-005` | `DEPT-F` | Build Evidence Provenance Engine, Source Registry, Claim Registry, Contradiction Explorer, and Unresolved Questions (Module 06) | P0 | `feature/evidence-intelligence` | `CEP-OS-004` | Chief Epistemic Scientist | Complete | `/api/v1/sources`, `/api/v1/evidence`, Module 06 UI & Global Provenance Drawer | Every claim resolves to source ID, version, section, reviewer status, and confidence rationale | `DEPT-A` & `DEPT-H` |
| `CEP-OS-006` | `DEPT-B` | Build Governance & Constitution (Module 02), Accountability & Transparency (Module 08), and Public-Good Projects (Module 10) | P1 | `feature/governance-engine` | `CEP-OS-004`, `CEP-OS-005` | Lead Constitutional Engineer | Complete | `/api/v1/governance`, `/api/v1/accountability`, `/api/v1/projects` + UI views | Distinguishes repo bootstrap from community ratification; append-oriented audit events; zero vote fabrication | `DEPT-H` Lead Auditor |
| `CEP-OS-007` | `DEPT-C` | Build Iran Transition Architecture (Module 03) and Institutional Directory with Interactive Dependency Graph (Module 04) | P1 | `feature/iran-transition-system` | `CEP-OS-004`, `CEP-OS-005` | Lead Transition Architect | Complete | `/api/v1/transition`, `/api/v1/institutions` + Timeline & SVG Dependency Graph UI | Separates 180-day emergency phase from 2–3 yr transition horizon; epistemic badges on every node | `DEPT-B` & `DEPT-F` |
| `CEP-OS-008` | `DEPT-D` | Build Deceased-Only Historical Archive (Module 05), 77-column CSV validator script, citation & conflicting-accounts explorer | P0 | `feature/historical-archive` | `CEP-OS-004`, `CEP-OS-005` | Chief Archival Architect | Complete | `/api/v1/archive`, `scripts/validation/validate-historical-csv.mjs`, `data/synthetic/synthetic-deceased-archive-sample.csv` | Rejects `status=living`; clearly labels synthetic dossiers; supports bilingual search, filters, and conflict comparison | `DEPT-H` Lead Auditor |
| `CEP-OS-009` | `DEPT-E` | Build Five-Band Assurance Matrix and Interactive Action Policy Simulator (Module 07) | P0 | `feature/five-band-assurance` | `CEP-OS-004` | Lead Assurance Architect | Complete | `/api/v1/verification`, `/api/v1/verification/evaluate` + Module 07 Simulator UI | Authorizes actions not people; rejects Telegram citizenship, AI photo/location tests, and social-credit scores | `DEPT-H` Lead Auditor |
| `CEP-OS-010` | `DEPT-C` | Build Safe Public Service Directory (Module 09) enforcing the REA boundary | P2 | `feature/iran-transition-system` | `CEP-OS-004` | Lead Transition Architect | Complete | `/api/v1/public-services` + Module 09 UI | Public entry links only; candidate domains marked unverified; no API enumeration or iframe embedding | `DEPT-H` Lead Auditor |
| `CEP-OS-011` | `DEPT-B` | Build Institutional Design Laboratory (Module 11) and Digital Legacy / Principle 20 Explanatory Prototype (Module 12) | P1 | `feature/governance-engine` | `CEP-OS-004`, `CEP-OS-006` | Lead Constitutional Engineer | Complete | `/api/v1/simulations`, `/api/v1/digital-legacy` + Module 11 & 12 UI | Pluralistic constitutional comparison; Principle 20 isolated from archive; prohibits AI replicas | `DEPT-D` & `DEPT-H` |
| `CEP-OS-012` | `DEPT-G` | Build Civilization Dashboard (Module 01), global command/search bar, Persian RTL & English LTR design system | P0 | `feature/cep-experience` | `CEP-OS-005`..`CEP-OS-011` | Principal UX Director | Complete | `/api/v1/dashboard`, `apps/web/src/*`, `apps/web/src/styles.css` | Intentional RTL layout, English LTR switch, dark/light themes, keyboard accessible, zero dead buttons | `DEPT-A` & `DEPT-H` |
| `CEP-OS-013` | `DEPT-H` | Perform threat modeling, read-only enforcement, input sanitization, and independent security/privacy audit | P0 | `feature/security-audit` | `CEP-OS-005`..`CEP-OS-012` | Principal Security Auditor | Complete | `docs/security/THREAT-MODEL-AND-AUDIT.md`, API security headers & input guards | Rejects non-GET requests (`405`), rejects malformed queries (`400`), zero PII or tracking | Human Maintainer (Pending) |
| `CEP-OS-014` | `DEPT-H` | Execute comprehensive unit, integration, contract, security, CSV validation, and production build test suites | P0 | `integration/mini-app-prototype` | `CEP-OS-013` | Principal Security Auditor | Complete | `apps/api/test/server.test.mjs`, `apps/web/test/demo-contract.test.mjs` | 100% of executed unit, contract, security, and build checks pass | Human Maintainer (Pending) |
