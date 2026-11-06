# CEP-T016 — Tokenization-led economic transition: strategy, preconditions, kill criteria

**Status:** Ready for review (report drafted, PR open).
**Deliverable:** [`docs/economics/TOKENIZATION-TRANSITION-STRATEGY.md`](../docs/economics/TOKENIZATION-TRANSITION-STRATEGY.md).
**Suggested lead:** Economics + research agents, with a sanctions lawyer and a debt-management practitioner as human reviewers.

## Objective and research question

How could a new, legitimately constituted government of a country in transition use asset and public-finance tokenization to rebuild its economy — and what must be true, legally, institutionally, technically and geopolitically, for that to work, fail safely, or be abandoned?

Refined into four answerable sub-questions in the report (§2): which designs sovereigns have actually used and what their legal instrument, settlement asset and record-keeper were; which claimed benefits survive a weak-institution, post-sanctions setting and what would falsify each; the correct sequence and its stop points; and what the answer implies for this repository's existing HMMT design.

## Context

The repository is Persian-first and already contains a tokenization design (HMMT) plus a five-level civic structure. Iran is used as the worked example because that is the repository's case, not because a transition is assumed. The report is country-parametric: its readiness framework (§8) takes six inputs — sanctions status, legal tradition and existing issuance authority, central-bank independence, registry quality, connectivity, institutional trust — so the analysis transfers.

## Non-goals

- No operational sanctions advice, no structure or sequencing whose purpose is to move value in breach of OFAC, UN, EU or FATF controls, no counterparty obfuscation. The strategy is compliance-first and treats sanctions relief as a hard gate.
- No legal opinion. "Legal certainty" means a lawyer can point to a statute and a court that would enforce the claim.
- No claim about what Iranians want, and no claim that CEP, HMMT or any institution here is adopted, ratified or lawful.
- No code, no chain interaction, no token, no wallet, no real data.

## Scope and subtasks

1. Market and precedent evidence: what tokenization has actually been used for, by whom, under what law, with what settlement asset (§4, §5).
2. Causal mechanisms with falsifiers for six claimed benefits: settlement cost, fiscal transparency, financial inclusion, capital attraction, registry integrity, diaspora capital (§6).
3. Four-architecture comparison on nine criteria, with reasons and a sensitivity note (§7).
4. Country-parametric readiness framework with five binary hard gates (§8).
5. Sequenced roadmap, Stages 0–4, each with entry gates, success metrics and pre-registered kill criteria (§9).
6. Failure-mode catalogue with early-warning indicators and priced mitigations (§10).
7. Distributional and rights analysis, including the surveillance flag (§11).
8. Assessment of the repository's own design against all of the above (§12), pointing to a separate red-team deliverable.

## Evidence and method requirements

Follows [`agents/RESEARCH-STANDARDS.md`](../agents/RESEARCH-STANDARDS.md): every statement labelled Fact / Author statement / Interpretation / Hypothesis / Proposal / Speculation; a source table with author, title, date, URL, type and limitation; a claims-and-evidence table; a search log with queries and dates; explicit statement of what could not be checked. A source counts as verified only if the page was opened and the relied-on sentence is visible in it; search snippets are not evidence.

## Risks and safeguards

| Risk | Safeguard |
| --- | --- |
| The report becomes a how-to for sanctions evasion | Compliance-first framing; no operational detail; sanctions relief as a hard gate |
| A press claim is promoted to a fact | Six leads left explicitly unverified, with consequences stated; no recommendation rests on one |
| The programme is read as endorsed by CEP | Status block, non-governmental posture, "do not build" among the recommendations |
| A ledger becomes a surveillance instrument | §11 states the risk as a rights requirement, not a compliance checkbox; recommended surfaces carry no per-recipient identity |
| Vendor market-size numbers are treated as data | Provider disagreement named as the finding; the IMF aggregate used instead, with its own limits |

## Dependencies

- None for the report. The companion red team (`docs/economics/HMMT-REDTEAM-vs-TOKENIZATION.md`) depends on this report; any prototype surface depends on both being reviewed and on an explicit maintainer request.

## Acceptance criteria

- [x] `npm run check` passes with no code changes; baseline and final output recorded.
- [x] Every figure has a source, a date, the claim it supports and its limitations.
- [x] At least three findings argue against the proposal or for narrowing scope, with what would change the author's mind (report §13).
- [x] No proposal, hypothesis or press claim is presented as a fact.
- [x] Unverified leads are marked, and the sections that depend on them say so.
- [ ] Human review by someone with sanctions and/or debt-management expertise.
- [ ] Maintainer decision on whether the companion red team proceeds.

## Open questions

The report's §15 lists eight, each with a cheapest decisive test. The two that gate everything else: whether the unverified precedent claims (Thailand, Marshall Islands, UK, South Korea, Japan, Saudi Arabia, Pakistan) hold up against primary documents, and whether any investor states that the token format was necessary to their participation.
