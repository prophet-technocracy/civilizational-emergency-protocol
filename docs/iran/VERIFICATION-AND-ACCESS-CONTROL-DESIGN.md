# Privacy-Preserving Verification and Access-Control Design

**Status:** Safety-first design proposal for review; not an approved policy or implementation specification.  
**Date:** 2026-11-04.  
**Related task:** [CEP-IRAN-015](../../tasks/015-privacy-preserving-access-assurance.md).  
**Issue:** [#9](https://github.com/prophet-technocracy/civilizational-emergency-protocol/issues/9).

## Executive summary

A five-band assurance model can be useful if it answers a narrow question: **what minimum evidence is necessary for this specific action, and who is authorized to grant it?** It should not sort people into a general hierarchy of citizenship, worth, trust, political rights, or access to unrelated personal records.

This proposal replaces the suggested citizen/social-credit/official ladder with five **access-assurance bands**: public anonymous use; optional pseudonymous account control; a narrowly disclosed, issuer-backed attribute when truly required; a time-limited organization or contract role; and privileged actions protected by dual control and independent review. Moving to a higher band does not unlock all services or public/private databases. Each action gets its own purpose-limited authorization check.

The following are explicitly out of scope: AI interviews or photo/location challenges to infer citizenship; social-credit scoring; using Telegram account possession as proof of citizenship; political voting, referenda, or voter eligibility; private-database access approved by another user; spendable credits that confer governance influence; and an official role with unrestricted powers or “full life transparency.” CEP has no established authority to verify citizenship or determine political rights. The Mini App vision also excludes national election systems, political identity databases, and participant tracking.

## 1. Terminology: separate four different questions

| Concept | Question it answers | Safe design rule |
|---|---|---|
| **Authentication** | Does this session control a particular account or key? | State only what was proved (e.g. “controls this Telegram account”); never infer legal name, personhood, nationality, or citizenship from an account. |
| **Attribute assurance** | Is a specific claim (e.g. professional license) vouched for by a named issuer? | Verify only the attribute needed for the action; prefer selective disclosure; do not retain the underlying ID document. |
| **Authorization** | May this principal perform this specific action on this specific resource now? | Evaluate purpose, scope, issuer, expiry, policy, and resource-owner permission for every action. No global “trust level” grants blanket access. |
| **Audit and accountability** | Can an appropriate reviewer later establish that an authorized action occurred? | Record the minimum necessary metadata, protect logs, set retention, and provide correction/appeal routes. Auditing must not become behavioral or political scoring. |

A person can use a pseudonymous account for one workflow and a separate, narrowly disclosed credential for another. Do not silently link those contexts or construct a persistent cross-service identity graph.

## 2. Five access-assurance bands (proposal)

These bands describe the **evidence and controls for an action**, not rank, citizenship status, reputation, or political rights. A system should always choose the least intrusive band that is sufficient. Public information remains open to everyone regardless of band.

### Band 1 — Public, no account

- Read public documentation, public historical/geographical/scientific datasets, and published service directories.
- No login, nationality check, wallet, identity profile, or visitor tracking.
- This is the default for browsing. A user who cannot or does not want to use Telegram must not lose access to public content.

### Band 2 — Pseudonymous account control (optional)

- A user may prove control of an account or passkey for low-risk, non-binding tasks such as saving preferences or submitting a correction through a reviewed channel.
- Telegram may be offered as one sign-in option, but it proves only control of that Telegram account at that moment. It does not prove Iranian citizenship, nationality, unique personhood, age, profession, trustworthiness, or one-person-one-vote.
- Do not require an account for public browsing. Do not expose the Telegram identifier to employers, other users, or external services by default.

### Band 3 — One specific, selectively disclosed credential (conditional future use)

- Use only when a particular action demonstrably requires a specific attribute (for example, a professional qualification for a professional task), and an authorized, trustworthy issuer exists.
- Verify the minimum claim; do not collect a passport/national ID image, face scan, biometric template, or full credential by default. Prefer a short-lived, audience-bound proof that cannot be reused for unrelated tracking.
- Issuer, legal basis, consent, revocation, error correction, accessibility, and appeal must be reviewed before any integration. CEP currently has no established issuer or authority to issue or verify citizenship credentials.
- Do not infer citizenship from an interview score, photographs of landmarks, a requested angle, GPS, language, contacts, device signals, or behavior.

### Band 4 — Time-limited organization or contract role (conditional future use)

- A verified organization may receive a narrowly scoped workspace for a specific published contract or project, if appropriate legal and procurement authority is established.
- Verify the organization and the representative’s authority through a legitimate source; do not require every board member’s identity unless a documented legal requirement makes that necessary.
- Grant delegated, revocable roles to named work accounts only where needed. Each role is scoped to one contract, expires automatically, and cannot read unrelated private databases.
- A contract or contribution does not confer political authority, public office, citizen status, or governance votes.

### Band 5 — Privileged system operation (not a political rank)

- This band is for a narrow administrative/security action on CEP-controlled infrastructure, not for elected officials, contractors, or public decision-makers.
- Require strong authentication, least privilege, separate operator/reviewer roles, dual approval for consequential changes, time-bounded elevation, tamper-evident audit, and independent review.
- Emergency access must be exceptional, logged, limited, expire automatically, and receive prompt post-event review.
- No account at any band can “do anything.” No band grants general access to private records or the power to define civic eligibility.

## 3. Decision policy: authorize actions, not people

For every proposed operation, document:

1. The exact resource and action requested.
2. Why the action is necessary and what less intrusive alternative was considered.
3. The minimum assurance evidence required and the trusted issuer, if any.
4. The resource owner and lawful authority that can grant access.
5. Scope, expiry, revocation, retention, and appeal.
6. Abuse cases, monitoring that does not become profiling, and a stop condition.

Example decisions:

| Action | Default treatment | Additional proof, if justified | Explicitly not implied |
|---|---|---|---|
| Browse public information | Open at Band 1 | None | Citizenship, account, or payment is never required. |
| Suggest a correction | Public browsing stays open; a low-risk contribution workflow requires separate safety review | Optional Band 2 session token to prevent accidental duplicate submissions; retain no public identity by default | A submission is not a vote or representative opinion. |
| Apply for a professional task | Publish requirements and allow an accessible application route | Band 3 proof of the exact current qualification only if relevant and legally appropriate | No social-credit score, political profile, or nationality inference. |
| Access a contract workspace | No access by default | Band 4 organization and delegated contract role | No cross-contract or government-database access. |
| Change a production policy or security setting | No agent/user account gets unilateral control | Band 5 multi-person, expiring approval under a documented policy | No unrestricted “official” power. |
| Bind a public referendum or specialized political vote | **Not offered by CEP** | Requires a legitimate public authority and a separately authorized, independently reviewed process outside this prototype | Telegram accounts, wallets, credentials, or scores cannot establish voter eligibility or legitimacy. |

## 4. Rejected elements from the initial proposal

### AI interview plus photo/location challenge for citizenship

Do not implement. A timed request to photograph a place from a prescribed angle can reveal location and movement, may expose a person to risk, excludes people with disabilities or limited connectivity, and is not reliable proof of citizenship. An AI “score” can be opaque, biased, spoofed, and difficult to appeal. Asking tasks over two days also creates arbitrary false rejections. If a lawful service genuinely needs citizenship verification, only a competent public authority can define the issuer and process; CEP should not invent a substitute.

### Social-credit score and higher-level user approval for private databases

Do not implement. A cross-context reputation score can turn behavior or political views into a basis for exclusion and coercion. Private records must not be unlocked because a higher-level user clicks approve. Access requires the data owner’s authority, documented legal basis, narrow purpose, least privilege, and auditable review; where those are absent, do not connect the data.

### Wallets and spendable credits

Keep any payments or reimbursements separate from authentication, civic rights, and content access. Credits, deposits, tokens, donations, or transaction history must not buy votes, influence, status, or privileged access. A future payment feature requires separate legal, financial, fraud, privacy, and security review and is not part of the Mini App scaffold.

### Public referenda and profession-specific political voting

Do not build voting eligibility, referenda, or binding/specialized political vote flows in CEP. Profession, wallet balance, account age, citizenship claim, contribution history, or an AI score cannot confer political rights. Any national or binding decision requires legitimate public authority, law, accessibility, independent security, human-rights safeguards, transparent eligibility rules, and affected-community oversight beyond this project.

### Officials, “full life transparency,” and unrestricted powers

Do not collect or publish an official’s full private life. Public transparency should concern official decisions, mandates, meetings, spending, conflicts of interest, and disclosures required by applicable law—subject to due process, safety, and privacy. The system should never grant an official an unrestricted account; official authority is defined outside CEP and any technical access must be narrow, documented, and revocable.

## 5. Data, privacy, and operational controls

- Do not store raw identity documents, facial images, location challenges, citizenship dossiers, political affiliation, or cross-service person identifiers.
- Keep authentication identifiers separate from any task-specific credential proof; use random internal IDs and purpose-bound references.
- Do not create a global trust, reputation, social-credit, or “good citizen” score.
- Minimize audit logs: record the action, scope, decision, approver role, and expiry needed for accountability; avoid logging identity claims or sensitive payloads unless a reviewed, lawful need exists.
- Define retention and deletion before collecting any data. Provide correction, appeal, credential revocation, and account deletion processes.
- Fail closed for sensitive/private resources when issuer, scope, consent, or authority is unclear; provide a human contact for review.
- Use synthetic accounts and fixtures during development. No personal or political information is needed to prototype the model.

## 6. Implementation phases and gates

1. **Research only (now):** human privacy, legal, security, accessibility, and governance review of this model. No accounts, credentials, voting, wallets, or private-data integrations.
2. **Non-sensitive prototype:** optionally show a synthetic access-policy explainer with example actions; no sign-up, identity-provider integration, or user data. Clearly label all roles as fictional.
3. **Low-risk account feature (conditional):** only after an approved threat model and user need; optional pseudonymous authentication, no citizenship claim, no political participation, and a verified deletion/incident process.
4. **Organization/work role (conditional):** only with a legitimate issuer/contract authority, narrow role claims, expiration, revocation, audit, and independent review.
5. **Anything involving legal identity, citizenship, government records, finances, or political participation:** outside the current Mini App scope. Requires separate authorization, legal basis, affected-community process, independent security and rights review, and a specific decision to proceed. “Do not build” remains the default absent those conditions.

## 7. Open questions

- What user need requires any account at all if public browsing remains open?
- Which party would be a legitimate issuer for any professional/organizational claim, and what appeal exists for an erroneous claim?
- What data is truly necessary for a low-risk paid task, and can it be handled by an external regulated provider without connecting payment to civic identity?
- Who owns and authorizes any data resource? If no accountable owner is identified, the resource stays disconnected.
- How will the project avoid implying that a login tier is a measure of citizenship or public legitimacy?

## Methods, limitations, and self-critique

This is a design review based on the user-proposed model and CEP's current public documents: [Mini-App Vision](../../platform/MINIAPP-VISION.md), [Technical Architecture](../../platform/TECHNICAL-ARCHITECTURE.md), [Founding Charter](../../FOUNDING-CHARTER.md), [Governance proposal](../../GOVERNANCE.md), and [Security Policy](../../.github/SECURITY.md). It makes no claim about Iranian law, available credential issuers, public opinion, or the suitability of any specific identity technology. It is not legal or security certification.

The five-band alternative is itself only a conceptual aid; even pseudonymous accounts and role credentials can be linked, coerced, or misused. Human reviewers should test whether bands can be simplified or removed. Any actual identity or payment integration may be inappropriate for CEP altogether.
