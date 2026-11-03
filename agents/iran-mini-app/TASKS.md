# Iran Civic Infrastructure and Mini App — Task Board

**Status:** Proposed work plan; not an approved mission, mandate, or endorsement of either source document.
**Last updated:** 2026-11-03.
**Starting point:** [`Discovery and Execution Report`](../../docs/iran/DISCOVERY-AND-EXECUTION-REPORT.md).

Do not start implementation tasks until their dependencies and safety gates are met. A task's completion means repository review, not public consent or institutional authorization. No task authorizes collection of sensitive political or personal data.

## Priorities and status

- **P0:** required before any public MVP or source-data reuse.
- **P1:** required to define and build a read-only demonstrator.
- **P2:** follow-up capabilities that require additional governance and safety review.
- **P3:** research-only or explicitly deferred future capabilities.
- **Proposed:** not yet claimed; **In progress:** publicly claimed; **Review:** deliverable awaits review; **Blocked:** prerequisite/authority missing; **Complete:** reviewed and accepted.

| ID | Task | Workstream | Priority | Dependencies | Deliverable | Status | Suggested owner |
|---|---|---|---|---|---|---|---|
| CEP-IRAN-001 | Inventory the supplied sources, repository, and dataset; record a safe execution recommendation | Source audit / privacy | P0 | None | `docs/iran/DISCOVERY-AND-EXECUTION-REPORT.md` | Review | Research coordinator + human reviewer |
| CEP-IRAN-002 | Confirm source provenance, versions, publication rights, and permitted citation/reuse | Source governance | P0 | 001 | `docs/iran/SOURCE-REGISTER.md` | Blocked: confirmations needed | Source custodian + maintainer |
| CEP-IRAN-003 | Approve data-classification and publication gates; exclude all living-person records | Privacy / data governance | P0 | 001 | `docs/iran/DATA-PUBLICATION-GATE.md` | Proposed | Privacy reviewer + human maintainer |
| CEP-IRAN-004 | Map the emergency booklet's exact institutions, roles, stages, and timeline | Source analysis / translation | P0 | 002; qualified Persian review | `docs/iran/EMERGENCY-SOURCE-MAP.md` | Blocked: provenance and reviewer needed | Bilingual source analyst |
| CEP-IRAN-005 | Validate the deceased-only CSV and produce a sourced data-quality/import plan | Historical data | P0 | 002, 003 | `data/historical-archive/validation/` and report | Blocked: publication approval and row-level sources | Historical data reviewer |
| CEP-IRAN-006 | Compare constitutional/technocracy proposals with CEP commitments and the emergency framework | Governance / legitimacy | P0 | 002, 004 | `docs/iran/SOURCE-COMPATIBILITY-MATRIX.md` | Proposed | Governance researcher + human reviewer |
| CEP-IRAN-007 | Create a threat model, data-flow inventory, and deployment safety gate | Security / privacy | P0 | 001, draft MVP scope | `docs/iran/THREAT-MODEL.md` | Proposed | Security reviewer |
| CEP-IRAN-008 | Define Persian-first accessible read-only MVP requirements and explicit non-goals | Product / accessibility | P1 | 001, 004, 006, 007 | `docs/iran/MVP-SCOPE.md` | Proposed | Product + accessibility reviewers |
| CEP-IRAN-009 | Specify source-linked content schema and content lifecycle | Architecture / data governance | P1 | 002, 004, 005, 008 | `docs/iran/CONTENT-MODEL.md` | Proposed | Software architect + editor |
| CEP-IRAN-010 | Prototype static Persian RTL/English navigation with synthetic content only | UX / engineering | P1 | 007, 008, 009; review gate passed | Small static prototype + tests | Blocked until gates pass | Frontend engineer + accessibility reviewer |
| CEP-IRAN-011 | Assess historical archive coverage and human correction workflow | Historical research / governance | P2 | 005, 009 | Coverage and editorial proposal | Proposed | Historian + editor |
| CEP-IRAN-012 | Research whether a safe, non-identifying correction channel is viable | Participation / safety | P2 | 007, 008, community review | Decision memo; may recommend not building | Privacy + moderation reviewers |
| CEP-IRAN-013 | Research Principle 20 feasibility, consent, deletion, and legal dependencies | Digital legacy / rights | P3 | 001; independent legal and affected-community review | Feasibility memo only; no product implementation | Proposed | Digital-rights researcher |

## Task briefs and acceptance criteria

### CEP-IRAN-001 — Discovery audit (P0)

**Question:** What source materials, repository foundations, data risks, and genuine blockers exist before product design?
**Scope:** Inspect available project documents and user-supplied materials; perform non-destructive file/schema checks; do not publish personal records or private source text.
**Deliverable:** `docs/iran/DISCOVERY-AND-EXECUTION-REPORT.md`.
**Acceptance criteria:** exact supplied filenames and repository baseline are recorded; CSV formats/counts/schema and material quality limitations are described; source summaries are clearly marked preliminary; living datasets are explicitly excluded; product scope is bounded; blockers and next milestone are stated; a human reviewer validates the report.
**Risk:** accidentally reproducing sensitive or rights-restricted material. **Safeguard:** report aggregate findings only and keep source files outside Git.
**Status:** Review; acceptance requires a human reviewer.

### CEP-IRAN-002 — Source provenance and publication rights (P0)

**Question:** Which document versions can be cited, linked, translated, or quoted, and under what terms?
**Scope:** Record source-provided title, publisher/author as stated, date/version, language, canonical public location if any, licence/permission, translation status, and uncertainty. Do not infer authorship from PDF metadata.
**Deliverable:** `docs/iran/SOURCE-REGISTER.md` plus an explicit reuse decision per source.
**Acceptance criteria:** each source has a stable identifier and version; permissions are documented or the source is marked “reference only / no reproduction”; the 67-page technocracy PDF's provenance is resolved or remains explicitly unknown; emergency booklet version and errata status are recorded; citations point to exact pages/sections; an editor confirms all public quotation is permitted.
**Risk:** copyright or false attribution. **Safeguard:** link to authorized sources; do not commit the PDFs or full extracted text.
**Status:** Blocked pending source-custodian confirmation.

### CEP-IRAN-003 — Data classification and publication gate (P0)

**Question:** What source data, if any, can safely and lawfully enter a public archive?
**Scope:** Classify public, private, sensitive, and unverified fields; document the explicit ban on supplied living-person records and derived identifiers.
**Deliverable:** `docs/iran/DATA-PUBLICATION-GATE.md`.
**Acceptance criteria:** both living CSVs and their derived generalized copy are excluded from public builds, commits, demos, analytics, and tests; stable codes derived from names are treated as linkable identifiers; no dataset is approved absent documented rights, source quality, and human review; default fixtures are synthetic; review, retention, takedown, and incident responsibilities are assigned before launch.
**Risk:** re-identification or political targeting. **Safeguard:** data minimization and no living-person records.
**Status:** Proposed.

### CEP-IRAN-004 — Emergency booklet source map (P0)

**Question:** What does the supplied emergency-phase booklet actually propose about institutions, responsibilities, dependencies, and sequencing?
**Scope:** Work from an authorized, versioned source with qualified Persian-language review. Keep the source's terms distinct; label translation and interpretation separately.
**Deliverable:** `docs/iran/EMERGENCY-SOURCE-MAP.md`, including a source-linked institution table and timeline only where explicit.
**Acceptance criteria:** exact page/section references are checked against the source; the 180-day emergency phase and broader transition horizon are not conflated; proposed vs. existing institutions are distinguished; dependencies and ambiguities are preserved; no inferred election date or CEP affiliation appears; a bilingual human reviewer signs off.
**Risk:** mistranslation or presenting a proposal as adopted policy. **Safeguard:** double-check critical passages and use source-attributed wording.
**Status:** Blocked pending 002 and bilingual reviewer.

### CEP-IRAN-005 — Deceased-only CSV validation and import plan (P0)

**Question:** Can an expressly approved deceased-only subset be validated and represented without losing provenance or implying completeness?
**Scope:** Do not import living data. Preserve any approved original unchanged. Define schema and checks before executable ingestion.
**Deliverable:** validation report and reversible import/validation plan under `data/historical-archive/validation/`.
**Acceptance criteria:** approved source file and licence recorded; schema and types documented; tests cover row shape, ID uniqueness, date precision, controlled values, duplicate candidates, required source citations, and exclusion of any `status=living` row; raw and normalized values remain traceable; no generated biography is treated as fact; human correction/appeal procedure documented.
**Risk:** false historical claims and unlawful reuse. **Safeguard:** no publication until review/permission gate passes; use synthetic fixtures for tests.
**Status:** Blocked pending source approval and record-level citations.

### CEP-IRAN-006 — Compatibility and legitimacy matrix (P0)

**Question:** Where do source proposals align with or differ from CEP's commitments, and who has authority to resolve the differences?
**Scope:** Compare only cited provisions; include alternatives, uncertainty, practical consequences, and whether a read-only product can proceed without deciding the political question.
**Deliverable:** `docs/iran/SOURCE-COMPATIBILITY-MATRIX.md`.
**Acceptance criteria:** each row cites both sources where applicable; the technocracy proposal is not treated as a mandate; constitutional destination and institutional authority remain publicly determined; AI/algorithmic governance proposals receive rights and accountability analysis; disagreements are not flattened; human governance review is recorded.
**Risk:** embedding a contested constitutional outcome in software. **Safeguard:** source-attributed and reversible content model.
**Status:** Proposed.

### CEP-IRAN-007 — Security and privacy threat model (P0)

**Question:** What harms can arise from publishing or operating an Iran-focused civic information service?
**Scope:** Model participants, maintainers, hosts, sources, and public content; cover surveillance, retaliation, data breach, impersonation, malicious submissions, defacement, denial of service, and supply-chain compromise.
**Deliverable:** `docs/iran/THREAT-MODEL.md` and data-flow diagram.
**Acceptance criteria:** threats include likelihood/impact rationale, controls, residual risks, and an owner; telemetry and third-party services are minimized; MVP stores no user profile or political participation data; incident and takedown process is defined; an independent security reviewer signs off before deployment.
**Risk:** harm to people in a sensitive political context. **Safeguard:** static/no-account MVP and no sensitive-data collection.
**Status:** Proposed.

### CEP-IRAN-008 — Accessible MVP scope (P1)

**Question:** What is the smallest useful interface that communicates sourced information without creating new authority or data-collection risks?
**Scope:** Persian-first RTL, English option, low bandwidth, assistive technology, content status labels, and clear source links. Exclude submissions and accounts.
**Deliverable:** `docs/iran/MVP-SCOPE.md` with user journeys and explicit non-goals.
**Acceptance criteria:** journeys cover reading a stage, reading an institution record, and exploring a synthetic historical record; status terms distinguish proposals from verified reports; keyboard/screen-reader and contrast criteria are testable; no feature implies representativeness, official affiliation, or binding participation; scope receives safety and human review.
**Status:** Proposed.

### CEP-IRAN-009 — Provenance-first content model (P1)

**Question:** How can public content retain source lineage, translation state, disputes, and review history?
**Scope:** Source documents/versions/passages, claims, institutions, milestones, and optional approved deceased historical records. Private legacy data is outside this model.
**Deliverable:** `docs/iran/CONTENT-MODEL.md` and a readable entity/relationship diagram.
**Acceptance criteria:** every published factual claim resolves to a source passage or is labelled unverified; source versions and translations are distinct; history is auditable; stable subject identifiers are random, not name-derived; raw imports are reversible; no private-person entity or account table is introduced in the MVP.
**Dependencies:** 002, 004, 005, 008.

### CEP-IRAN-010 — Static read-only demonstrator (P1)

**Question:** Can people use a low-risk Persian-first interface to navigate sourced information?
**Scope:** Static frontend and synthetic content only until all data/safety gates pass; no API, login, user tracking, or submission backend.
**Deliverable:** small prototype and accessibility/RTL tests.
**Acceptance criteria:** all content has clear source/status labels; synthetic content is visibly marked; no living-person data or unapproved PDF text is bundled; Persian RTL, keyboard navigation, reduced motion, mobile layout, and low-bandwidth behavior are checked; security review and human product approval precede public deployment.
**Dependencies:** 007, 008, 009.

### CEP-IRAN-011 — Coverage and correction research (P2)

Assess historical coverage, selection criteria, under-documentation, language/transliteration variants, contested identity, and a human-reviewed correction and appeal process. Do not create popularity or political-worth scores. Recommend whether the archive should be built at all.

### CEP-IRAN-012 — Safe correction channel research (P2)

Study whether a low-risk correction channel is feasible without exposing contributors. Deliver a decision memo; “do not build” is an acceptable result. No submission service may be implemented before threat, retention, moderation, appeals, and affected-community review.

### CEP-IRAN-013 — Principle 20 feasibility research (P3)

Research consent, revocation, posthumous rights, data minimization, death verification, inheritance conflicts, retention/deletion, and deception risks. This is research only. It does not authorize accounts, personal archives, neural-data collection, AI replicas, or posthumous participation.

## Review and governance gates

1. A human maintainer reviews each document before it is treated as accepted.
2. Source-rights and data-publication gates must pass before source text or records are published.
3. Privacy/security review must pass before any service collects information from people.
4. Community review and affected-party consultation are separate from repository review; neither is implied by a merged PR.
5. No agent may merge its own contribution or bypass required human review.
