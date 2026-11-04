# Public Government-Service Directory: Safe Scope and REA Use

**Status:** Proposed research plan; no service inventory or active testing has been performed.
**Date:** 2026-11-04.
**Related task:** [CEP-IRAN-014](../../tasks/014-public-service-directory.md).
**Issue:** [#7](https://github.com/prophet-technocracy/civilizational-emergency-protocol/issues/7).

## Summary and boundary

A human-reviewed directory of service links that an official public page intentionally publishes could help people navigate services. That is different from reverse-engineering an aggregator's hidden API surface, enumerating every endpoint, probing access controls, or crawling services behind login.

I cannot plan or conduct broad reconnaissance of live Iranian government portals and their APIs without explicit written authorization from the systems' owners. Such mapping could expose government attack surface and service dependencies. Public availability of a webpage is not permission to test, enumerate, or capture its underlying APIs.

This plan therefore limits the initial task to a **public-link directory** derived from official public documentation and visible navigation, verified by a human. It does not describe or collect API endpoints, internal routes, network topologies, authentication behavior, or service data. No live targets were contacted or verified while preparing this plan. The named domains below are user-suggested candidates only, not verified members of a government network.

## What REA is, and what it is not being used for here

The public [`morluto/rea` README](https://github.com/morluto/rea) describes REA as a local reverse-engineering toolset that can inspect websites, scripts, browser observations, and saved network captures. Its [browser-observation guide](https://github.com/morluto/rea/blob/main/docs/browser-observation.md) describes attaching to a browser through CDP and collecting page/network evidence; the [network-capture guide](https://github.com/morluto/rea/blob/main/docs/web-network-captures.md) says retained HAR/SAZ captures can be inspected offline without fetching recorded URLs.

For this directory task:

- **Do not** attach REA to `my.gov.ir` or any linked government service to discover requests, hidden routes, API calls, WebMCP declarations, authenticated behavior, or page-to-page flows.
- **Do not** crawl, fuzz, enumerate, replay, probe, test credentials, bypass controls, or capture a user's authenticated session.
- **Do not** run a proxy or browser instrumentation against the live portals as part of a public-directory effort.
- If a future, separately authorized security assessment exists, scope it in a new task. Written authorization must identify the owner, exact hosts and paths, permitted methods, test accounts, dates/time window, traffic limits, data handling, emergency contact, and stop conditions. An independent security reviewer must approve the plan before any testing.
- For an offline REA demonstration, prefer a purpose-built local fixture. A locally saved, static public JavaScript file may be analyzed only if its acquisition and reuse are authorized and the analysis stays static. A HAR/SAZ should be considered sensitive: do not accept or process it unless the owner explicitly authorizes its use and it has been reviewed and sanitized for cookies, authorization headers, tokens, personal data, and sensitive query/body values. Offline parsing does not make sensitive capture contents safe to publish.
- Pin and review the REA release and setup diff before use. REA's setup can modify agent configuration; no installer or configuration changes are part of this directory task.

The current repository's Node runtime and REA's current documented requirements must be checked before a future local-only tool trial. This is not a reason to update tooling or access a target now.

## Safe product outcome

Build a source-cited list of **human-readable service entry points**, not a technical integration map. Each item should describe only what a public authoritative source says and link to the normal service entry URL. Keep outgoing links clearly marked as external; do not embed government portals in iframes or relay user traffic through CEP.

Suggested record fields:

| Field | Meaning |
|---|---|
| `entry_id` | Random, stable catalogue key; not derived from a person or account. |
| `public_label_fa` / `public_label_en` | Display names exactly as shown in an authorized public source; translations separately reviewed. |
| `service_category` | Broad, neutral category with a controlled vocabulary and human review. |
| `public_entry_url` | Public entry link as listed; never a guessed API path. Reject URLs containing session IDs, tokens, or user-specific values. Remove tracking parameters only when their purpose is known and the clean link is verified; otherwise defer the listing. |
| `listing_source_url` | Public official page or published directory where the link appeared. |
| `publisher_as_stated` | Organization label used by the source; do not infer control from a domain alone. |
| `relationship_note` | Source-attributed statement only, e.g. “linked from this directory”; not “shares an API” unless officially documented. |
| `verification_status` | `candidate`, `listed-in-source`, `human-checked`, `unverified`, `disputed`, or `retired`. |
| `checked_at` / `reviewer_role` | Date and role for human verification; avoid publishing reviewer identity if it creates risk. |
| `limitations` | Outage, language, accessibility, account requirement, or uncertainty only when observed and appropriate to publish. |

Never display an unverified candidate as official or operational. “Human-checked” means that the link and its source were checked; it is not a security certification, endorsement, uptime guarantee, or validation of the service's underlying data practices.

## Work phases

### Phase 0 — Scope and authority (current)

- Record the user’s goal as improving public navigation, not establishing a technical attack-surface inventory.
- Keep the work blocked from active endpoint analysis unless a separate written authorization is provided.
- Confirm whether CEP is allowed to republish link labels, logos, descriptions, or translations; link rather than copy where permission is unknown.
- No target contact or automated network activity.

### Phase 1 — Source-based inventory design

- Identify official public directory pages or service catalogues from source material supplied by the user or maintainers.
- Record only links explicitly published on those pages. Do not infer links from URL patterns, scripts, redirects, DNS, certificates, or API traffic.
- Keep candidate links and their provenance in a human review queue; do not include credentials, cookies, or personal data.
- Use two-person review for disputed publisher attribution or sensitive service categories.

### Phase 2 — Human link verification

- A human reviewer checks each listing through ordinary, non-authenticated navigation, within a declared scope and without scripted crawling.
- Confirm that the authoritative listing page itself names or links the destination; record observed date and limitations.
- Do not submit forms, create accounts, enter personal identifiers, or attempt to inspect protected pages.
- If a service requires authentication to understand its purpose, record “details unavailable without authorization” rather than probing it.

### Phase 3 — Read-only directory prototype

- Store approved entries as static, version-controlled catalogue content; serve only through the existing read-only app path.
- Provide source links, verification dates, language labels, external-link indicators, and a correction contact that does not require a user account.
- Do not proxy, scrape, embed, or make automatic availability checks against listed services.
- Do not collect visitor click histories or derive political, financial, health, or benefits-related user profiles.

### Phase 4 — Maintenance and takedown

- Recheck links on a documented human schedule, not by automated probing.
- Provide a safe correction/takedown path and retain only the minimum moderation data needed.
- Preserve change history, source provenance, dissent, and reasons for removing an entry.
- Publish limitations: the directory is incomplete, may become stale, and is not an official government catalogue unless formal authorization is later documented.

### Separate future security-assessment gate (not part of this plan)

If a competent owner later authorizes technical integration/security work, create a separate scope and threat model before using REA live-browser or capture tools. Authorization must be verifiable and limited to named assets and methods. Do not broaden scope from a public link or redirect. Stop immediately on unexpected personal data, an out-of-scope host, service instability, access-control barriers, or an owner request. Publish no endpoint inventories or sensitive captures without explicit owner approval and an independent disclosure review.

## Candidate domains from the request — unverified

The user mentioned `my.gov.ir`, `tax.gov.ir`, `eservices.tamin.ir`, and `amak.mrud.ir` as examples. This plan does not verify their ownership, current availability, public listing, affiliation, behavior, APIs, or security. A future curator must verify each against a trustworthy public source before any directory entry is added.

## Risks and safeguards

| Risk | Safeguard |
|---|---|
| Revealing a useful attack-surface or dependency map | Public-link catalogue only; no API, route, host, or dependency enumeration. Separate written authorization required for testing. |
| Misattributing a site or falsely claiming government endorsement | Record what the official source says; keep candidate/unverified labels; never infer ownership solely from a hostname. |
| Personal data or credentials exposed through captures | No live capture; treat HAR/SAZ as sensitive; use only authorized, sanitized offline artifacts in a separate review. |
| A directory entry becomes stale or redirects unexpectedly | Human re-verification, visible check date/status, no automated fetcher, clear correction/takedown path. |
| Users assume CEP is official or that links are safe/available | Persistent non-affiliation and limitation notice; external-link labeling; no security or uptime claims. |
| Analytics or embedded portals reveal user activity | No click tracking, third-party embeds, proxying, or account collection. |

## Questions that block implementation

1. Which authoritative public directory pages may be cited and linked, and what reuse terms apply to their names/descriptions/logos?
2. Who will act as human curator and independent reviewer for service attribution and changes?
3. Is there any written authorization from the service owners for a separate, bounded technical assessment? None is provided in the current task; therefore no live API analysis is authorized here.
4. What privacy-safe correction contact and takedown responsibility can the project maintain?
5. Which accessibility and language reviews are available for Persian labels and descriptions?

## Methods, limitations, and self-critique

This is a repository planning document based on CEP's existing mission, privacy, security, and governance rules, and a reading of REA's public README and browser/network-capture documentation. No government website was accessed. The described candidate domains come only from the user's message and remain unverified. No API endpoints, site relationships, current service availability, or technical integrations are claimed.

The safe directory could still mislead users if a public listing source is compromised, stale, or not authoritative. Human source review and visible uncertainty reduce but cannot eliminate that risk. A public-link directory may also be less complete than the requested technical map; that limitation is intentional unless system owners authorize a separate security/integration assessment.
