# CEP Civilizational Operating System — Module Map & API Contracts

**Document ID:** `CEP-ARCH-002`  
**Department:** Department A — Executive Architecture Office  
**Date:** 2026-11-04  

---

## 1. Twelve-Module Architecture Map

Every navigable module in the CEP Civic Operating System operates as a vertical slice connecting a shared domain model (`packages/domain-models`), a read-only API endpoint (`apps/api`), and a bilingual RTL/LTR frontend experience (`apps/web`).

| Module # | Module ID | Title (Persian / English) | Responsible Dept | API Route(s) | Key Interactive Capabilities |
|---|---|---|---|---|---|
| **01** | `dashboard` | پیشخوان تمدنی / Civilization Dashboard | `DEPT-G` / `DEPT-A` | `GET /api/v1/dashboard` | System status, epistemic distribution chart, milestone tracker, module launcher, recent revisions feed |
| **02** | `governance` | حکمرانی و منشور / Governance & Constitution | `DEPT-B` | `GET /api/v1/governance` | Founding Charter 10 principles, separation-of-powers diagram, governance layers, amendment registry, deliberation demo |
| **03** | `transition` | معماری گذار ایران / Iran Transition Architecture | `DEPT-C` | `GET /api/v1/transition` | Dual-horizon timeline (180-day emergency vs 2–3 yr transition), sector filter, milestone dependencies, uncertainty tags |
| **04** | `institutions` | کارپوشهٔ نهادها / Institutional Directory | `DEPT-C` | `GET /api/v1/institutions` | Searchable directory, interactive SVG institutional dependency & oversight map, sunset clause & mandate inspector |
| **05** | `historical-archive` | بایگانی تاریخی / Historical Archive | `DEPT-D` | `GET /api/v1/archive`, `GET /api/v1/archive/:id` | Deceased-only synthetic dossiers, bilingual search, era/discipline/region filters, conflicting accounts comparator, 77-col CSV gate report, discrepancy flagger |
| **06** | `research` | کتابخانهٔ پژوهش و شواهد / Research & Evidence Library | `DEPT-F` | `GET /api/v1/sources`, `GET /api/v1/evidence` | Source registry, claim provenance table, contradiction explorer, confidence breakdown, unresolved questions dashboard |
| **07** | `verification` | تضمین دسترسی پنج‌سطحی / Five-Band Assurance | `DEPT-E` | `GET /api/v1/verification`, `GET /api/v1/verification/evaluate` | Visual 5-band matrix, real-time action authorization simulator, rejected anti-patterns inspector (Telegram/biometrics/social credit) |
| **08** | `accountability` | پاسخگویی و شفافیت / Accountability & Transparency | `DEPT-B` / `DEPT-H` | `GET /api/v1/accountability` | Append-oriented audit event log, decision history, conflict-of-interest disclosures, independent review gates |
| **09** | `public-services` | راهنمای خدمات عمومی / Public Service Directory | `DEPT-C` | `GET /api/v1/public-services` | Safe public entry-link catalogue, verification status filter, REA safety boundary notice, unverified domain warnings |
| **10** | `projects` | پروژه‌های نفع عمومی / Public-Good Projects | `DEPT-B` | `GET /api/v1/projects` | Project catalogue, deliverables, milestone progress, evidence of completion, non-political incentive guardrails |
| **11** | `simulations` | آزمایشگاه طراحی نهادی / Institutional Design Lab | `DEPT-B` | `GET /api/v1/simulations` | Side-by-side constitutional model comparator (Parliamentary, Presidential, Constitutional Monarchy, Federal) & interactive safeguard parameter sliders |
| **12** | `digital-legacy` | میراث دیجیتال و اصل ۲۰ / Digital Legacy & Principle 20 | `DEPT-B` | `GET /api/v1/digital-legacy` | Explanatory prototype for `پرونده هستی` isolated from Module 05, 7-clause explorer, consent/revocation matrix, anti-replica safeguards |

---

## 2. Preserved Legacy Endpoints (Backward Compatibility)

| Endpoint | Method | Purpose | Contract Guarantee |
|---|---|---|---|
| `GET /health` | `GET` | Lightweight liveness check | Returns `200 { "status": "ok" }` with `Cache-Control: no-store` |
| `GET /api/v1/demo` | `GET` | Initial scaffold contract | Returns `mode: "synthetic-demo"`, Persian notice, and planned `modules` array |

---

## 3. Versioned API Route Specifications (`/api/v1/*`)

All `/api/v1/*` routes return UTF-8 JSON with envelope metadata:
```json
{
  "mode": "synthetic-demo",
  "schemaVersion": "1.0.0",
  "generatedAt": "2026-11-04T00:00:00.000Z",
  "epistemicNotice": "...",
  "data": { ... }
}
```

### Query Parameter Contracts
- `GET /api/v1/archive`:
  - `q` (optional string, max 120 chars): Bilingual search across Persian/English names, aliases, works, and tags.
  - `era` (optional enum): `all` | `classical` | `medieval` | `constitutional` | `modern-deceased`
  - `field` (optional string): Discipline filter (`constitutionalism`, `mathematics`, `medicine`, `literature`, `philosophy`, `engineering`, `human-rights`, `social-reform`).
  - `region` (optional string): Geographical region filter.
- `GET /api/v1/verification/evaluate`:
  - `action` (required string): Action ID from the assurance policy catalogue.
  - `band` (optional integer `1..5`): Simulated user assurance band.
  - `proofs` (optional comma-separated list): e.g., `passkey,telegram,selective_credential,org_contract,dual_control`.
- `GET /api/v1/search`:
  - `q` (required string, 1–120 chars): Cross-module search across dossiers, institutions, claims, governance items, projects, and public services.
