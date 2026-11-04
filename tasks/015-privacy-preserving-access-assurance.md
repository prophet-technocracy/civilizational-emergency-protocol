# CEP-IRAN-015 — Privacy-Preserving, Task-Specific Access Assurance

**Status:** Review — safety-first design proposal; human review is required before acceptance.  
**Priority:** P0 before any identity, account, wallet, role, or private-data feature.  
**Issue:** [#9](https://github.com/prophet-technocracy/civilizational-emergency-protocol/issues/9).  
**Deliverable:** [`docs/iran/VERIFICATION-AND-ACCESS-CONTROL-DESIGN.md`](../docs/iran/VERIFICATION-AND-ACCESS-CONTROL-DESIGN.md).

## Objective and question

Review the proposed five-level verification hierarchy and define safer privacy-first alternatives for any future non-political product actions.

**Question:** Can CEP determine the minimum evidence and authorization needed for a specific action without creating a general-purpose citizenship, reputation, political-rights, or social-credit ranking?

## Scope

- Separate authentication, attribute assurance, authorization, and audit.
- Propose five assurance bands for public access, optional pseudonymous account control, specific credentials, organization/contract roles, and tightly controlled privileged operations.
- Assess proposed Telegram identity, citizenship checks, AI/photo/location tasks, interviews, wallets, social-credit scoring, private-database access, contractor permissions, voting, and official accounts.
- Define data minimization, revocation, expiry, access review, appeals, audit, and implementation gates.
- Use only synthetic examples. This is a design review, not implementation authorization.

## Explicit non-goals and restrictions

This task does not implement or authorize:
- AI citizenship/personhood assessments, photo/location challenges, biometrics, identity-document collection, or national identity registries;
- social-credit, trustworthiness, political loyalty, or general reputation scores;
- political voting, referendum, election, or voter-eligibility features;
- access to private or government databases based on another user’s tier or approval;
- wallets, deposits, tokens, or spendable credits that grant civic or governance influence;
- a government-contractor role with blanket access;
- a public official role with unrestricted powers or full-life disclosure.

## Method and source criteria

Review the user's proposed tiers against the repository's Mini-App Vision, Technical Architecture, Charter, Governance proposal, Security Policy, and research standards. Treat all technical/issuer examples as proposals, not facts about Iranian law or available systems. Do not invent a lawful issuer, public mandate, available integration, or user consent.

## Risks and safeguards

| Risk | Safeguard |
|---|---|
| Identity or location surveillance, retaliation, or exclusion | No real identity or location collection; reject AI/photo challenges; default to public anonymous access. |
| Reuse of a general score to exclude people | Prohibit social-credit and cross-context trust scores; authorize actions per resource and purpose. |
| Unauthorized private-data exposure | Require resource-owner authority, documented legal basis, least privilege, purpose limitation, expiry, and audit; otherwise deny and do not connect. |
| Political manipulation or false legitimacy | Exclude voting and political rights; no wallet, status, account age, or profession confers public authority. |
| Privileged-role abuse | Narrow delegated roles, dual control, expiration, review, appeal, and break-glass process. |
| Credential technology overclaims privacy | Require independent review of issuer, linkability, revocation, metadata, coercion, and recovery before any pilot. |

## Acceptance criteria

- The design distinguishes identity assurance from action authorization and from social status.
- It provides a five-band model where higher bands never automatically grant broader rights or data access.
- Telegram proves only account control; it is not citizenship/personhood verification.
- AI interviews and location/photo tasks are rejected as citizenship checks.
- Social-credit scoring, civic voting, identity-based political privilege, and unrestricted official access are explicitly out of scope.
- Private data requires owner authority, purpose limitation, applicable legal basis, least privilege, and audit; higher-tier peer approval alone is insufficient.
- Contractors/organizations receive narrow, delegated, expiring access; officials receive no “do anything” account and no blanket full-life disclosure.
- Privacy, security, human-rights, accessibility, legal, issuer, revocation, appeal, retention, and stop/defer gates are documented.
- Human reviewers may recommend that no verification or identity feature be built.

## Open questions

- Does any low-risk feature genuinely require accounts if public content remains open?
- Is any trustworthy credential issuer and lawful basis identified for a narrowly required attribute? None is assumed.
- Can work compensation be separated from civic identity and governance influence?
- Who is the owner and authority for any proposed private data resource?

## Self-critique

Even a task-specific credential can be linkable, coerced, or repurposed. The five-band vocabulary may still be mistaken for a hierarchy of human worth; future reviewers should consider fewer bands or no account feature. This design has not been reviewed by a privacy engineer, legal expert, or affected community and must not be implemented as written without those reviews.
