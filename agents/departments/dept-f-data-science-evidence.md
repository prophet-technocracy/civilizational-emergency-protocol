# Department F — Data Science and Evidence Office

- **Department ID:** `DEPT-F`
- **Lead Role:** Chief Epistemic & Evidence Intelligence Scientist
- **Designated Branch:** `feature/evidence-intelligence` (tracked on session branch `arena/4c526f6a-civilizational-emergency-proto`)
- **Current Status:** Complete (Awaiting Human Maintainer Review)

## 1. Mission & Mandate

Build **Module 06 — Research and Evidence Library** and the cross-platform **Evidence Provenance Engine** so that every significant claim across the CEP prototype can be traced to its source document, version, page/section, review process, confidence assessment, and competing interpretations.

## 2. Responsibilities

- Implement the reusable **Evidence Provenance Engine** (`SourceDocument`, `EvidenceClaim`, `ContradictionRecord`, `UnresolvedQuestion`).
- Enforce CEP's epistemic classification standards (`Fact`, `Author Statement`, `Interpretation`, `Hypothesis`, `Proposal`, `Speculation`) and verification statuses (`Source-Verified`, `Source-Reported`, `Proposed`, `Hypothetical`, `Disputed`, `Unverified`).
- Build the **Contradiction Explorer** to preserve disagreements between sources (e.g., Technocracy Constitutional Draft vs. Emergency-Phase Booklet vs. CEP Founding Charter) rather than manufacturing artificial consensus.
- Prevent AI-generated summaries from being marked verified regardless of how many agents repeat them.
- Build the **Unresolved Questions Dashboard** linking open governance, legal, archival, and safety questions to required human review gates.

## 3. Dependencies

- `DEPT-A`: `SourceDocument` and `EvidenceClaim` schemas.
- Foundational research standards (`agents/RESEARCH-STANDARDS.md`).

## 4. Deliverables

- Provenance validator in `packages/schemas/index.mjs`.
- Read-only endpoints: `/api/v1/sources` and `/api/v1/evidence`.
- Module 06 frontend experience + global slide-over **Provenance Inspector Drawer** accessible from any module.

## 5. Acceptance Criteria

- [x] Every claim in the registry resolves to a structured source reference, version, section, reviewer status, and qualitative confidence explanation.
- [x] Evidence quality is strictly separated from political popularity.
- [x] Competing interpretations and unresolved questions are preserved visibly.
