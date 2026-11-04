# CEP-IRAN-014 — Safe Public Directory of Government Services

**Status:** Review — scope and safety plan are proposed; human review is required before acceptance.
**Priority:** P2.
**Issue:** [#7](https://github.com/prophet-technocracy/civilizational-emergency-protocol/issues/7).
**Deliverable:** [`docs/iran/PUBLIC-SERVICE-DIRECTORY-PLAN.md`](../docs/iran/PUBLIC-SERVICE-DIRECTORY-PLAN.md).

## Objective and question

Assess whether CEP can help people find publicly listed service entry points through a human-reviewed, source-cited directory without probing or exposing the underlying systems.

**Question:** Can a useful public directory be produced from official published links and documentation, without reverse-engineering hidden APIs, authenticated flows, or technical dependencies?

## Context

The user proposed using [REA](https://github.com/morluto/rea) to inspect the current `my.gov.ir` portal, its API connections, and related government service sites, including `tax.gov.ir`, `eservices.tamin.ir`, and `amak.mrud.ir`. These names are candidate examples from the request only; this task has not verified their ownership, current status, or relationship.

REA's public README describes website inspection and browser/network observation. Its browser guide describes CDP attachment and live page evidence; its saved-capture guide describes offline HAR/SAZ inspection. The proposal to enumerate live government APIs is outside this task's authorized scope. Public accessibility is not authorization to map hidden endpoints or test access controls.

## Scope and method

1. Use public, official directory pages and published service documentation as the only source for catalogue entries.
2. Document exact public links and provenance; do not infer ownership, API relationships, or hidden routes from a domain, redirect, script, or network behavior.
3. Design a static, read-only directory with explicit candidate / source-listed / human-checked / unverified / disputed / retired states and review dates.
4. Do not automate crawling, availability checks, endpoint discovery, fuzzing, login, form submission, credential testing, or API probing.
5. REA may be considered for documentation review or local static assets only. Live-browser and network-capture tools are excluded from this task. Offline HAR/SAZ processing requires separate written authorization and prior sanitization; captures are sensitive by default.
6. A future technical assessment requires a separate task, verifiable written authorization naming asset owners, exact hosts/paths, methods, time limits, test accounts, data handling, stop conditions, and contacts, plus independent security review.

## Deliverable

A safe phased plan and a reusable task definition, with no actual service inventory, API endpoint list, or claims about current service behavior. Suggested future catalogue fields are specified in the plan.

## Risks and safeguards

- **Attack-surface disclosure:** limit this work to public service links; no API/host/route inventory.
- **False attribution:** require human verification against an official published source; do not infer the owner from domain names alone.
- **Capture exposure:** no live capture in this task; treat HAR/SAZ as sensitive even when read offline.
- **Stale or misleading links:** display provenance, check date, uncertainty, correction route, and non-affiliation notice.
- **User privacy:** no click tracking, embedded third-party portals, account creation, or visitor profiling.

## Acceptance criteria

- The plan clearly separates a public-service directory from technical reconnaissance.
- It explicitly states that no government website was accessed or verified and that user-suggested domain examples remain unverified.
- The proposed schema is provenance-first and exposes no hidden API details.
- REA's permitted and excluded use is clear, including the offline/sensitive-capture boundary.
- A written-authorization and independent-review gate is defined for any future active testing.
- Privacy, legal/permission, security, misinformation, accessibility, correction, and maintenance risks are addressed.
- Relative links and formatting pass; no credentials, private traffic, or personal data are included.

## Open questions

- Which official public service directories are available and reusable?
- Who will curate and independently review catalogue entries?
- What non-identifying correction/takedown contact can be maintained?
- Is there written authorization from any system owner for a separate, narrowly scoped technical assessment? None is assumed by this task.

## Self-critique

A directory based only on officially published links may be incomplete and could still be stale or falsely attributed. Human verification and uncertainty labels reduce but do not remove those risks. This plan intentionally does not satisfy the original request to expose all API connections; that would require owner authorization and a separate security-reviewed scope.
