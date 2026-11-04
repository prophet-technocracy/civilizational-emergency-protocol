# Department D — Historical Intelligence and Archives

- **Department ID:** `DEPT-D`
- **Lead Role:** Chief Archival Data Architect & Historical Epistemology Lead
- **Designated Branch:** `feature/historical-archive` (tracked on session branch `arena/4c526f6a-civilizational-emergency-proto`)
- **Current Status:** Complete (Awaiting Human Maintainer Review)

## 1. Mission & Mandate

Design and implement **Module 05 — Historical Archive**, a searchable, deceased-only historical knowledge system with full 77-column CSV validation architecture, citation tracking, conflicting historical interpretation preservation, network relationships, and editorial revision histories—using clearly labelled synthetic historical dossiers until external datasets pass all publication and provenance gates.

## 2. Responsibilities

- Implement the 77-column CSV schema validator and import gate (`scripts/validation/validate-historical-csv.mjs` and `packages/schemas`) matching the exact 77 headers audited in `docs/iran/DISCOVERY-AND-EXECUTION-REPORT.md`.
- Enforce the hard security/privacy rule: reject any dataset containing `status=living`, `reidentification_risk=HIGH`, or unapproved name-derived subject hashes; never expose the 199 living-person records or unapproved 447 deceased-person records.
- Populate rich, clearly labelled **synthetic historical dossiers** covering diverse eras (Classical, Medieval, Constitutional Era, Contemporary Deceased) and disciplines (Constitutionalists, Mathematicians, Physicians, Poets & Writers, Philosophers, Engineers, Social Reformers, Human-Rights Figures).
- Preserve historical disagreement by modeling **Conflicting Historical Accounts** side by side without ranking human beings by supposed historical worth.
- Provide an internal editorial discrepancy-flagging workflow demonstration with revision history tracking.

## 3. Dependencies

- `DEPT-A`: `HistoricalPerson`, `HistoricalDossier`, `HistoricalSource` domain models.
- `DEPT-F`: Citation and source reliability models.
- `DEPT-H`: Living-person exclusion verification and privacy audit.

## 4. Deliverables

- `data/schemas/historical-dossier-77col.schema.json`
- `data/synthetic/synthetic-deceased-archive-sample.csv`
- `scripts/validation/validate-historical-csv.mjs`
- Read-only endpoints: `/api/v1/archive` and `/api/v1/archive/:id`
- Module 05 frontend experience with bilingual search, era/discipline/region filters, dossier inspector, relationship explorer, conflicting accounts viewer, and CSV validator status panel.

## 5. Acceptance Criteria

- [x] Zero living-person records or derived identifiers exist anywhere in the repository.
- [x] Every synthetic dossier is prominently marked `SYNTHETIC FIXTURE / پروندهٔ آزمایشی ساختگی`.
- [x] Automated tests verify that `validate-historical-csv.mjs` rejects `status=living` rows, duplicate IDs, missing headers, and denormalized work duplication.
- [x] Search works across Persian names, English names, alternative spellings, eras, regions, and disciplines.
