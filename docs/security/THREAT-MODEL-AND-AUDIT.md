# CEP Security, Privacy, Accessibility & Human-Rights Audit Report

**Document ID:** `CEP-SEC-001`  
**Department:** Department H — Security, Privacy and Independent Audit  
**Status:** Independent Department Review Complete; Awaiting Human Maintainer Sign-Off  
**Date:** 2026-11-04  

---

## 1. Audit Scope & Methodology

Department H audited the architecture, domain models, API server (`apps/api`), frontend application (`apps/web`), CSV validation script (`scripts/validation/validate-historical-csv.mjs`), and synthetic fixtures against:
1. `FOUNDING-CHARTER.md` & `GOVERNANCE.md`
2. `AGENTS.md` & `agents/RESEARCH-STANDARDS.md`
3. `docs/iran/DISCOVERY-AND-EXECUTION-REPORT.md`
4. `docs/iran/VERIFICATION-AND-ACCESS-CONTROL-DESIGN.md`
5. `docs/iran/PUBLIC-SERVICE-DIRECTORY-PLAN.md`

---

## 2. Threat Model & Control Verification Matrix

| Threat ID | Threat Scenario | Affected Asset / Population | Severity | Implemented Control in Prototype | Verification Status |
|---|---|---|---|---|---|
| **TM-01** | Exposure or re-identification of living individuals from external datasets | Living subjects (199-row CSVs) | Critical | External CSVs excluded from repository; `validate-historical-csv.mjs` hard-fails on `status=living` or `reidentification_risk=HIGH`; only synthetic fixtures exist in codebase. | Verified by unit & CLI tests |
| **TM-02** | Surveillance or profiling of civic visitors | Application visitors | Critical | Zero accounts, zero cookies, zero analytics/telemetry, zero IP/user-agent logging, read-only `GET` API with `Cache-Control: no-store`. | Verified by API inspection & tests |
| **TM-03** | False impression of governmental or electoral authority | Public trust & affected communities | High | Persistent top-level constitutional disclaimer; module-level non-authority notices; binding voting/referendum actions explicitly blocked in Module 07. | Verified in UI & API contracts |
| **TM-04** | Unverified source claims presented as established facts | Epistemic integrity | High | Mandatory epistemic status badges (`source-reported`, `proposed`, `hypothetical`, `disputed`, `unverified`, `synthetic-fixture`) and clickable Provenance Inspector. | Verified by schema tests |
| **TM-05** | Unauthorized mutation, XSS, or query injection against API | `apps/api` & `apps/web` | High | Non-`GET` methods return `405 Method Not Allowed`; query strings validated for length and control/injection characters (`400 Bad Request`); React auto-escaping + `X-Content-Type-Options: nosniff`. | Verified by security test suite |
| **TM-06** | Unlawful reconnaissance or API enumeration of live portals | External public services | High | Module 09 implements static public-link directory architecture only; REA live probing/capture prohibited; candidate domains marked `unverified`. | Verified in Module 09 fixture |
| **TM-07** | Deceptive posthumous simulation or estate data harvesting under Principle 20 | Deceased individuals & families | High | Module 12 is strictly isolated from Module 05; prohibits AI voice/likeness generation, cognitive data ingestion, and posthumous political voting. | Verified in Module 12 contract |

---

## 3. Accessibility & Localization Audit

- **RTL / LTR Parity:** `<html lang="fa" dir="rtl">` by default; switching to English updates `<html lang="en" dir="ltr">` and switches numerals and directional icons appropriately.
- **Keyboard Navigation:** Skip-to-content link (`.skip-link`), logical tab order across sidebar, command bar, module tabs, interactive simulators, and modal/drawer close buttons (`Escape` key supported).
- **Semantic Landmarks:** `<header>`, `<nav>`, `<main id="main-content">`, `<aside>`, `<section aria-labelledby>`, and `<footer role="contentinfo">`.
- **Visual Contrast & Motion:** High-contrast color tokens in both Light Institutional Paper and Dark Mission-Control themes; full `@media (prefers-reduced-motion: reduce)` support.

---

## 4. Dependency & Supply-Chain Audit

- `@cep/api`: **0 runtime dependencies** (uses Node.js built-in `node:http`, `node:url`, `node:path`).
- `@cep/web`: Minimal runtime dependencies (`react`, `react-dom` only; all charts, dependency graphs, and UI components are purpose-built accessible SVG/React components with zero heavy charting or icon bloat).
- `npm audit`: **0 vulnerabilities** across all 95 workspace packages.

---

## 5. Independent Auditor Determination

Department H certifies that the local prototype satisfies all engineering, safety, privacy, epistemic, and constitutional constraints for **local demonstration and human review**. Per `AGENTS.md`, human maintainer review is required before merging into `main` or authorizing any public deployment.
