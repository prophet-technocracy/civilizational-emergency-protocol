# CEP Civilizational Operating System — Data Flow & Provenance Pipeline

**Document ID:** `CEP-ARCH-003`  
**Department:** Department A — Executive Architecture Office & Department F — Data Science and Evidence Office  
**Date:** 2026-11-04  

---

## 1. Read-Only Request & Epistemic Provenance Data Flow

```text
[Browser UI Action (Filter / Inspect / Simulate)]
       │
       │ 1. GET /api/v1/<module>?... (Same-Origin, No Cookies, No PII)
       ▼
[API Security & Method Guard (apps/api/src/server.mjs)]
       ├─► If method !== "GET" ──► 405 Method Not Allowed (Allow: GET)
       ├─► If query invalid/malformed ──► 400 Bad Request
       │
       ▼
[Domain & Provenance Resolver]
       ├─► Loads immutable synthetic fixtures (apps/api/src/data/fixtures.mjs)
       ├─► Resolves linked SourceDocument & EvidenceClaim IDs
       ├─► Validates payload against runtime schema (packages/schemas)
       │
       ▼
[JSON Response with Security Headers]
       │  Cache-Control: no-store
       │  X-Content-Type-Options: nosniff
       ▼
[React UI Renderer + Global Provenance Inspector Drawer]
       └─► Every claim badge is clickable to inspect Source ID, Version,
           Section, Epistemic Status, Confidence Rationale, and Contradictions.
```

---

## 2. Historical Archive 77-Column CSV Validation & Publication Gate Pipeline

Per `docs/iran/DISCOVERY-AND-EXECUTION-REPORT.md` and `agents/iran-mini-app/TASKS.md` (`CEP-IRAN-003` & `CEP-IRAN-005`), external CSV files must never enter the public repository or application runtime until four mandatory gates pass:

```text
[Candidate CSV File (External Working Storage)]
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│ STEP 1: Mechanical & 77-Header Schema Check              │
│ (scripts/validation/validate-historical-csv.mjs)         │
│  • Verifies UTF-8 encoding & exact 77 column headers     │
│  • Checks consistent column count across all rows        │
└───────────────────────────┬──────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│ STEP 2: Hard Living-Person & Privacy Exclusion Gate      │
│  • Rejects immediately if ANY row has status !== deceased│
│  • Rejects if reidentification_risk === "HIGH"           │
│  • Flags name-derived subject_code hashes for replacement│
│    with opaque random UUIDs/IDs                          │
└───────────────────────────┬──────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│ STEP 3: Deduplication & Denormalization Check            │
│  • Detects duplicate dossier_id or subject_code          │
│  • Audits major_works vs work_01..work_10 duplication    │
│  • Audits major_achievements vs achievement_01..06       │
└───────────────────────────┬──────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│ STEP 4: Epistemic & Editorial Publication Gate           │
│  • Verifies record-level primary/secondary citations     │
│  • Requires documented publication rights & license      │
│  • Requires human historian & editorial sign-off         │
└───────────────────────────┬──────────────────────────────┘
                            │
          ┌─────────────────┴─────────────────┐
          │ Gate Open / Unapproved            │ All Gates Passed
          ▼                                   ▼
[Serve Synthetic Fictional Fixtures]   [Eligible for Future Static Catalogue]
 (Current Prototype Mode)
```

---

## 3. Five-Band Action Authorization Evaluation Flow

Unlike conventional RBAC systems that assign a global rank or "trust score" to a user profile, CEP's Five-Band Assurance Evaluator (`evaluateAssurancePolicy`) computes a stateless decision tuple for a single requested action:

```text
Input: (actionId, presentedBand, presentedProofs[])
  │
  ├── 1. Is actionId constitutionally prohibited (e.g., binding political referendum,
  │      social-credit scoring, peer-approved private DB access)?
  │      └──► DENY IMMEDIATELY (Reason: Outside CEP Constitutional Authority)
  │
  ├── 2. Are any presentedProofs rejected anti-patterns (e.g., Telegram account
  │      claimed as proof of citizenship, AI photo/location challenge)?
  │      └──► STRIP INVALID PROOF + EMIT SAFEGUARD WARNING
  │
  ├── 3. Does action require Band 1 (Public Access)?
  │      └──► ALLOW (Zero account or proof required; anonymous browsing preserved)
  │
  └── 4. For Band 2–5 actions:
         ├── Verify minimum required proof type (Passkey, Selective Issuer Proof,
         │   Scoped Contract Role, or Dual-Control Admin Approval)
         ├── Verify purpose-binding and automatic expiration policy
         └── Emit Audit Metadata Requirement (action, scope, expiry — zero PII)
```
