# CEP Multidisciplinary Engineering Organization

**Status:** Active Engineering Organization Structure (Prototype Phase)  
**Active Session Branch:** `arena/4c526f6a-civilizational-emergency-proto`  
**Base Commit:** `f0d724dae1d95c88c4c5f0f5dff990fc6dd0392c` (`main`)  
**Last Updated:** 2026-11-04

---

## 1. Organizational Mandate

The Civilizational Emergency Protocol (CEP) Engineering Organization operates as a coordinated, eight-department multidisciplinary structure responsible for designing, building, verifying, and auditing the local, read-only CEP Civic Operating System Prototype.

Every department is bound by the non-negotiable constitutional constraints established in:
- [`FOUNDING-CHARTER.md`](../../FOUNDING-CHARTER.md)
- [`GOVERNANCE.md`](../../GOVERNANCE.md)
- [`VISION.md`](../../VISION.md)
- [`ROADMAP.md`](../../ROADMAP.md)
- [`AGENTS.md`](../../AGENTS.md)
- [`agents/RESEARCH-STANDARDS.md`](../RESEARCH-STANDARDS.md)
- [`docs/iran/DISCOVERY-AND-EXECUTION-REPORT.md`](../../docs/iran/DISCOVERY-AND-EXECUTION-REPORT.md)
- [`docs/iran/VERIFICATION-AND-ACCESS-CONTROL-DESIGN.md`](../../docs/iran/VERIFICATION-AND-ACCESS-CONTROL-DESIGN.md)

**Core Constitutional Guardrails Across All Departments:**
1. **No Claim of Public Authority:** CEP never presents itself as a government, representative body, election commission, or official authority.
2. **Epistemic Discipline:** Every claim, institution, timeline stage, and historical record carries an explicit epistemic status (`source-verified`, `source-reported`, `proposed`, `hypothetical`, `disputed`, `unverified`, or `synthetic-fixture`).
3. **Strict Data Safety:** Living-person datasets (`existence_dossiers_living.csv` and `existence_dossiers_living_generalised.csv`) and unapproved deceased datasets are strictly excluded from public builds, fixtures, and commits. All demonstration records are explicitly synthetic.
4. **Action-Scoped Assurance:** Verification bands evaluate specific actions and minimum required proofs, never human worth, citizenship, or political eligibility.
5. **Independent Human Review:** No agent department may self-approve security-sensitive work or merge into `main` without explicit authorization from an authorized human maintainer.

---

## 2. Department Roster & Branch Architecture

> **Branch Coordination Note:** In standard multi-agent Git workflows, each department operates on its dedicated workstream branch listed below before merging into `integration/mini-app-prototype`. In this Arena execution environment, the session is bound by platform policy to the fixed working branch `arena/4c526f6a-civilizational-emergency-proto`. Therefore, all eight department work packages, cross-department reviews, and integration gates are executed as modular, traceable work packages on `arena/4c526f6a-civilizational-emergency-proto`, with full branch mapping preserved in the Master Task Board and commit history.

| Dept ID | Department Name | Lead Role | Designated Branch | Primary Scope | Status |
|---|---|---|---|---|---|
| **Dept A** | [Executive Architecture Office](dept-a-executive-architecture.md) | Chief Systems Architect | `architecture/system-blueprint` | System blueprint, module boundaries, API contracts, domain models, ADRs | Complete (Review Ready) |
| **Dept B** | [Constitutional & Governance Engineering](dept-b-governance-engineering.md) | Lead Constitutional Engineer | `feature/governance-engine` | Charter explorer, separation of powers, amendment registry, deliberation demo, COI register | Complete (Review Ready) |
| **Dept C** | [Iran Transition Architecture](dept-c-iran-transition-architecture.md) | Lead Transition Systems Architect | `feature/iran-transition-system` | 180-day emergency vs 2–3 yr horizon timeline, institutional directory, dependency graph | Complete (Review Ready) |
| **Dept D** | [Historical Intelligence & Archives](dept-d-historical-intelligence-archives.md) | Chief Archival Data Architect | `feature/historical-archive` | Deceased-only synthetic dossier archive, 77-column CSV validator, conflicting accounts, citations | Complete (Review Ready) |
| **Dept E** | [Five-Band Verification & Access Architecture](dept-e-five-band-assurance.md) | Lead Privacy & Assurance Architect | `feature/five-band-assurance` | Bands 1–5 policy engine, visual assurance matrix, interactive action simulator, anti-pattern guards | Complete (Review Ready) |
| **Dept F** | [Data Science & Evidence Office](dept-f-data-science-evidence.md) | Chief Epistemic & Evidence Scientist | `feature/evidence-intelligence` | Source registry, claim provenance engine, contradiction explorer, confidence & unresolved questions | Complete (Review Ready) |
| **Dept G** | [User Experience & Interface Engineering](dept-g-ux-interface-engineering.md) | Principal Design Systems Director | `feature/cep-experience` | Persian-first RTL + English LTR design system, 12 module interfaces, accessibility, charts | Complete (Review Ready) |
| **Dept H** | [Security, Privacy & Independent Audit](dept-h-security-privacy-audit.md) | Principal Security & Rights Auditor | `feature/security-audit` | Threat modeling, read-only enforcement, input sanitization, privacy/accessibility audit suite | Complete (Review Ready) |

---

## 3. Inter-Department Review & Hand-off Protocol

1. **Architecture Gate (Dept A):** All shared schemas (`packages/schemas`), domain models (`packages/domain-models`), and API contracts (`apps/api/src/routes`) must conform to the Executive Architecture Office specifications before module implementation.
2. **Epistemic & Provenance Gate (Dept F):** Every data fixture created by Depts B, C, D, and E must include structured provenance links (`source_id`, `epistemic_status`, `confidence_level`, `review_status`).
3. **UX & Accessibility Gate (Dept G):** Every module view must support Persian RTL (`dir="rtl" lang="fa"`) and English LTR (`dir="ltr" lang="en"`), keyboard navigation, focus indicators, reduced motion, and explicit synthetic-data badges.
4. **Independent Security & Privacy Gate (Dept H):** Dept H audits all API routes, query parsers, CSV validators, and UI components to ensure zero PII collection, zero mutation routes, and compliance with `AGENTS.md`.
