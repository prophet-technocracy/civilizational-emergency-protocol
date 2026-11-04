# CEP Civilizational Operating System — Technical Decision Records (ADRs)

**Document ID:** `CEP-ARCH-004`  
**Department:** Department A — Executive Architecture Office  
**Date:** 2026-11-04  

---

## ADR-001: Preserve Zero-Dependency Node.js Built-in HTTP Server for `@cep/api`

- **Status:** Accepted
- **Context:** The existing scaffold uses `node:http` (`apps/api/src/server.mjs`) on Node.js >= 22.12. Introducing heavy backend frameworks or ORM libraries increases supply-chain attack surface and bundle complexity without adding value to a read-only synthetic demonstrator.
- **Decision:** Retain `node:http` and extend it with a clean, deterministic route table, query validator, and security header wrapper while keeping `GET /health` and `GET /api/v1/demo` 100% backward compatible.
- **Consequences:** Instant startup, zero backend npm dependencies, trivial security auditing, and complete determinism in `node --test`.

---

## ADR-002: Database-Ready Domain Models with In-Memory Frozen Synthetic Fixtures

- **Status:** Accepted
- **Context:** Part V Section 10 requires database-ready domain models for 17 core entities (`HistoricalPerson`, `HistoricalDossier`, `HistoricalSource`, `SourceDocument`, `EvidenceClaim`, `Institution`, `InstitutionalRole`, `TransitionStage`, `Project`, `ProjectMilestone`, `GovernanceProposal`, `Amendment`, `ReviewRecord`, `VerificationBand`, `AccessPolicy`, `AuditEvent`, `DigitalLegacyConcept`), while `docs/iran/IMPLEMENTATION-PLAN.md` mandates no persistent database or user-data storage until Phase 4 safety gates are approved.
- **Decision:** Implement explicit entity schemas, relationship validators, and normalization factories in `packages/domain-models` and `packages/schemas`, backed by deeply frozen (`Object.freeze`) synthetic datasets in `apps/api/src/data/fixtures.mjs`.
- **Consequences:** Provides a relational-grade schema ready for future PostgreSQL migration while guaranteeing zero accidental persistence or mutation in the prototype.

---

## ADR-003: Synthetic Deceased-Only Dossiers + Executable 77-Column CSV Gate Validator

- **Status:** Accepted
- **Context:** The discovery audit (`docs/iran/DISCOVERY-AND-EXECUTION-REPORT.md`) found that external CSVs include 199 living-person records with high re-identification risk and 447 deceased-person records lacking row-level citations and confirmed publication licenses.
- **Decision:**
  1. Never import or commit the external CSVs.
  2. Build `scripts/validation/validate-historical-csv.mjs` enforcing the exact 77-column schema, rejecting any `status=living` row, flagging name-derived hashes, and detecting denormalized `work_01`..`work_10` duplicates.
  3. Populate Module 05 with rich, clearly marked synthetic historical dossiers (`SYNTHETIC FIXTURE`) that exercise every archival feature (bilingual search, era/discipline/region filtering, citation inspection, conflicting historical interpretations, relationship graphs, and editorial discrepancy flagging).

---

## ADR-004: Task-Specific Action Assurance Over Global User Trust Tiers

- **Status:** Accepted
- **Context:** Early external concepts suggested using Telegram accounts, AI interviews, photo/location tasks, and social-credit scores to rank citizens. `docs/iran/VERIFICATION-AND-ACCESS-CONTROL-DESIGN.md` rejected those mechanisms as unsafe and incompatible with CEP's Founding Charter.
- **Decision:** Implement the Five-Band Assurance Engine (`packages/schemas` + `/api/v1/verification`) as an action-scoped policy evaluator that separates Authentication, Attribute Assurance, Authorization, and Audit, and explicitly flags and rejects citizenship inference, location challenges, social-credit scores, and political voting.

---

## ADR-005: Intentional Persian-First RTL (`fa`) with Instant English LTR (`en`) Switching

- **Status:** Accepted
- **Context:** CEP's Iran demonstrator must be Persian-first (`dir="rtl" lang="fa"`) and English-ready (`dir="ltr" lang="en"`), without naive horizontal mirroring that breaks code blocks, timelines, or numerals.
- **Decision:** Use CSS logical properties (`margin-inline`, `padding-inline`, `inset-inline`, `border-inline-start`), dynamic `<html lang dir>` synchronization, and a dedicated localization helper (`packages/localization/index.mjs`) that formats Persian numerals (`۰-۹`), Solar Hijri / Gregorian dates, and bilingual search aliases.

---

## ADR-006: Append-Oriented Audit Records Without False Cryptographic Claims

- **Status:** Accepted
- **Context:** Part VI Section 15 requires append-oriented audit records attributable to a change, author/process, reason, review status, previous version, and approval status, while explicitly prohibiting calling an ordinary application log "cryptographically immutable."
- **Decision:** Model `AuditEvent` records with `previousEventId` linkage and structured editorial metadata, and display an explicit technical notice in Module 08 distinguishing the prototype's append-oriented log from a future hardware-backed or Merkle-tree tamper-evident log.
