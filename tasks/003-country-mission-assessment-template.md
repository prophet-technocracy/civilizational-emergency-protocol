# CEP-T003 — Reusable Country-Mission Assessment and Safety Template

**Status:** Review — template and brief are proposed in PR; human review is required before the task is complete.
**Priority:** P1.
**Issue:** [#5](https://github.com/prophet-technocracy/civilizational-emergency-protocol/issues/5).
**Deliverable:** [`missions/COUNTRY-MISSION-TEMPLATE.md`](../missions/COUNTRY-MISSION-TEMPLATE.md).

## Objective and research question

Create a reusable screening and planning template that helps a country-specific mission state its purpose, scope, evidence, authority limits, affected-community engagement, risks, safeguards, review gates, and exit plan before substantial work or deployment.

**Question:** What minimum information and independent review should a proposed country mission document before CEP contributors decide whether to proceed, narrow, defer, or not build?

## Context and non-goals

The repository’s mission guidance already calls for bounded scope, affected communities, evidence, risks, resources, acceptance criteria, stewardship, and exit. The Charter, Governance proposal, Research Standards, and Security Policy add requirements concerning pluralism, human review, privacy, rights, source traceability, and non-harm. A reusable, safety-first form makes those requirements easier to apply consistently.

This task does **not**:
- approve any country mission or political programme;
- determine who represents an affected population or establish a national mandate;
- replace legal, security, rights, accessibility, or affected-community review;
- certify that a project is safe because a checklist is complete;
- authorize collection of sensitive data, political organizing, elections, or public-service operation.

## Scope and method

1. Review existing mission lifecycle guidance, task requirements, research standards, Charter, Governance proposal, and Security Policy.
2. Map the current required topics and identify gaps: evidence/claim provenance, authority, safe consultation, alternatives including no-build, misuse, data minimization, threat modeling, stop/defer triggers, operational response, and exit.
3. Produce a blank Markdown template with concise prompts, reusable tables, and explicit caveats. Do not fill it with country-specific claims or personal data.
4. Add this task brief and link the template from `missions/README.md` and the task board.
5. Make a small, related clarification to agent merge instructions: an agent cannot self-approve or bypass review, but may execute a merge after explicit authorization from an authorized human maintainer and satisfaction of required review, branch-protection, safety, and community-governance gates. This applies equally to all agents; no founder-agent exception is created.
6. Validate links, formatting, and consistency with existing contributor guidance.

### Source-selection criteria

Use only current repository governance, mission, evidence, and security documents for this template-design task. They are normative project proposals, not external evidence that any process is effective. No external policy claim is introduced. Any future mission must supply its own traceable factual sources and source-selection method.

## Risks and safeguards

| Risk | Safeguard |
|---|---|
| A completed form is mistaken for safety, legality, or legitimacy | Repeated disclaimer; explicit human, independent, and community gates; checklist is not a certification. |
| The form encourages risky outreach or the collection of identities | Require aggregate descriptions, safe consultation plans, minimization, and “not safe yet” as an option; prohibit unnecessary identifying details. |
| The template embeds a predetermined political outcome | State political neutrality and separate proposals from authorization; include dissent and no-build alternatives. |
| A merge-policy edit weakens human accountability | No self-approval or bypass; only authorized explicit human instruction after applicable checks/reviews; no exception by agent identity. |
| Generic prompts become box-ticking bureaucracy | Keep fields proportionate, allow “unknown/not applicable,” and require rationale, named owners, stop conditions, and reviewer judgment. |

## Dependencies

None. The template should be used alongside `missions/README.md`, `agents/RESEARCH-STANDARDS.md`, `GOVERNANCE.md`, and `.github/SECURITY.md`.

## Acceptance criteria

- Template covers mission objective, user/beneficiary limits, scope/non-goals, sources/claims, affected-community engagement, authority, alternatives, rights/privacy/security/misuse, data handling, accessibility, method/evaluation, operations, incident/correction, review gates, open questions, and exit.
- It contains actionable high-risk stop/defer triggers and preserves “do not proceed” as a valid recommendation.
- It clearly states that a form or repository acceptance does not create a mandate, authorization, or safety certification.
- It does not ask contributors to include identifying details of people at risk.
- Merge guidance continues to require human review and explicit authorized maintainer approval; agents cannot self-approve or merge without that approval.
- Markdown links and formatting pass; a human reviewer reviews the template and policy wording.

## Open questions

- Should the project later publish a separate, ratified safety-review rubric with severity definitions and named review roles?
- Which mission types require affected-community consultation before issue-level scoping, and when could consultation itself create risk?
- Should high-risk mission approval require independent external review or a community-level process beyond repository maintainers?

## Self-critique

This template is comprehensive and may be too long for low-risk desk research. Future reviewers should consider a concise intake form plus optional risk annexes, but must not remove stop/defer, authority, privacy, evidence, and review requirements. The form’s wording has not been validated with affected communities or tested for accessibility in other languages. It should remain a draft until those limitations are reviewed.
