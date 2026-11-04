# Department C — Iran Transition Architecture

- **Department ID:** `DEPT-C`
- **Lead Role:** Lead Transition Systems & Institutional Mapping Architect
- **Designated Branch:** `feature/iran-transition-system` (tracked on session branch `arena/4c526f6a-civilizational-emergency-proto`)
- **Current Status:** Complete (Awaiting Human Maintainer Review)

## 1. Mission & Mandate

Build an adaptable, source-attributed demonstrator for **Module 03 — Iran Transition Architecture**, **Module 04 — Institutional Directory**, and **Module 09 — Public Service Directory**. Preserve strict epistemic labeling across all proposed stages, institutional mandates, dependencies, and public service entry points.

## 2. Responsibilities

- Distinguish the proposed **180-Day Emergency Stabilization Phase** from the broader **2–3 Year Transition Horizon** and **Long-Term Constitutional Process**.
- Map proposed transitional institutions, oversight bodies, responsibilities, sunset clauses, and inter-institutional dependencies (`depends_on`, `oversees`, `audits`, `sunset_trigger`).
- Assign every institution, responsibility, and timeline milestone an explicit epistemic status (`source-verified`, `source-reported`, `proposed`, `hypothetical`, `disputed`, `unverified`).
- Implement the safe **Public Service Directory** architecture per `docs/iran/PUBLIC-SERVICE-DIRECTORY-PLAN.md`, enforcing the strict REA boundary (no live API enumeration, no HAR capture ingestion, clear candidate/unverified labels).

## 3. Dependencies

- `DEPT-A`: `Institution`, `InstitutionalRole`, `TransitionStage` schemas.
- `DEPT-F`: Source registry entries and page/section provenance structure.
- `DEPT-H`: REA boundary and external-link safety review.

## 4. Deliverables

- Transition timeline, institutional dependency graph, and public service directory fixtures.
- Read-only endpoints: `/api/v1/transition`, `/api/v1/institutions`, `/api/v1/public-services`.
- Interactive Dual-Horizon Timeline Engine and SVG Institutional Dependency & Oversight Map in `apps/web`.

## 5. Acceptance Criteria

- [x] Every institution and timeline item displays its epistemic status badge and source link.
- [x] 180-day emergency phase and multi-year transition horizon are visually and structurally distinct.
- [x] No fictional appointments, election dates, or operational progress claims are invented.
- [x] Public Service Directory contains no scraped API routes and labels candidate domains (`my.gov.ir`, `tax.gov.ir`, `eservices.tamin.ir`, `amak.mrud.ir`) as unverified examples only.
