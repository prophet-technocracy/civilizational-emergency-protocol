# Department E — Five-Band Verification and Access Architecture

- **Department ID:** `DEPT-E`
- **Lead Role:** Lead Privacy & Assurance Systems Architect
- **Designated Branch:** `feature/five-band-assurance` (tracked on session branch `arena/4c526f6a-civilizational-emergency-proto`)
- **Current Status:** Complete (Awaiting Human Maintainer Review)

## 1. Mission & Mandate

Develop the safety-first Five-Band Access Assurance proposal (`docs/iran/VERIFICATION-AND-ACCESS-CONTROL-DESIGN.md`) into an interactive policy engine and visual assurance simulator (**Module 07 — Five-Band Assurance**) that authorizes specific actions using minimum necessary proofs while explicitly rejecting citizenship hierarchies, social-credit scoring, biometric/location challenges, and political voting gates.

## 2. Responsibilities

- Model all five access-assurance bands:
  - **Band 1 — Public Access:** Anonymous browsing, zero account requirement, full access to public documentation, archive, and directories.
  - **Band 2 — Pseudonymous Account:** Optional passkey/session control for personal preferences or reviewed low-risk correction workflows; never implies personhood or citizenship.
  - **Band 3 — Selective Attribute Verification:** Purpose-bound, expiring, issuer-validated professional/technical credential with selective disclosure.
  - **Band 4 — Organization & Contract Authorization:** Time-limited, project-scoped organizational role with no cross-database access.
  - **Band 5 — Privileged System Administration:** Dual-control approvals, independent review, time-bounded elevation, and tamper-evident audit requirements.
- Build a deterministic policy evaluation engine separating **Authentication**, **Attribute Assurance**, **Authorization**, and **Audit**.
- Implement the interactive **Visual Assurance Matrix & Action Policy Simulator** in the frontend.
- Document and actively block rejected anti-patterns (Telegram = citizenship, AI photo/location challenges, social-credit scores, peer-unlocked private databases, influence-buying wallets).

## 3. Dependencies

- `DEPT-A`: `VerificationBand` and `AccessPolicy` domain models.
- `DEPT-H`: Threat model and anti-surveillance verification.

## 4. Deliverables

- Assurance policy evaluator in `packages/schemas/index.mjs`.
- Read-only endpoints: `/api/v1/verification` and `/api/v1/verification/evaluate`.
- Interactive Module 07 Assurance Matrix and Real-Time Policy Simulator UI.

## 5. Acceptance Criteria

- [x] Authorizes individual actions on specific resources rather than globally ranking users.
- [x] Higher bands never grant automatic access to unrelated private databases.
- [x] Explicitly rejects Telegram account ownership as proof of citizenship or unique personhood.
- [x] Explicitly blocks political voting/referendum actions as outside CEP's authority.
