# Department H — Security, Privacy and Independent Audit

- **Department ID:** `DEPT-H`
- **Lead Role:** Principal Security, Privacy & Human-Rights Auditor
- **Designated Branch:** `feature/security-audit` (tracked on session branch `arena/4c526f6a-civilizational-emergency-proto`)
- **Current Status:** Complete (Awaiting Human Maintainer Review)

## 1. Mission & Mandate

Conduct independent threat modeling, security hardening, privacy verification, data-minimization enforcement, and automated security/accessibility testing across all CEP modules. Enforce the rule that no agent department may self-approve security-sensitive work or bypass human review gates.

## 2. Responsibilities

- Enforce strict read-only API semantics (`GET` only; `405 Method Not Allowed` for all mutations).
- Validate and sanitize all query parameters against injection, path traversal, and parameter pollution.
- Apply defensive HTTP security headers (`Cache-Control: no-store`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: no-referrer`, `Cross-Origin-Resource-Policy: same-origin`).
- Audit all fixtures and CSV validation scripts to confirm zero living-person records, zero PII collection, zero telemetry/cookies, and zero live government portal probing.
- Author the comprehensive Threat Model and Independent Audit Report (`docs/security/THREAT-MODEL-AND-AUDIT.md`).
- Implement automated unit, integration, security, and accessibility verification tests.

## 3. Dependencies

- All outputs from `DEPT-A` through `DEPT-G`.

## 4. Deliverables

- `docs/security/THREAT-MODEL-AND-AUDIT.md`
- Security middleware and input validation in `apps/api/src/server.mjs`
- Comprehensive test suites in `apps/api/test/server.test.mjs` and `apps/web/test/demo-contract.test.mjs`

## 5. Acceptance Criteria

- [x] All non-GET requests return `405` with `Allow: GET`.
- [x] Malicious or malformed query parameters return `400 Bad Request` without leaking stack traces or server internals.
- [x] Zero npm dependency vulnerabilities (`npm audit` clean).
- [x] Independent audit report documents residual risks and human review gates required before any future production deployment.
