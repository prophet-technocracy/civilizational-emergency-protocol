# Tokenization-led economic transition: a strategy, its preconditions, and its kill criteria

**Task:** CEP-T016 (research task; brief in [tasks/016-tokenization-transition-strategy.md](../../tasks/016-tokenization-transition-strategy.md); tracking issue #66).
**Status:** Research draft for review. Not adopted, not endorsed, not a plan of any government or movement.
**Date:** 2026-11-06.
**AI disclosure:** drafted by an AI agent (Arena Agent Mode) working from public sources retrieved on 2026-11-06 and from this repository's own documents. Every source was opened, not quoted from a search snippet, except where marked. No interview, dataset or endorsement was invented.

> This document is a proposal-shaped analysis, not a program. CEP is non-governmental; HMMT is not legal tender, not a deposit and not a security; nothing here confers legitimacy on CEP, on any transition institution, or on any instrument. A well-supported conclusion that a design should not be built is treated as a valid result and is one of the outcomes this report reaches for part of the programme.

---

## 0. How to read this document

Statements that carry evidence, judgement or recommendation are labelled with one of the six categories required by [`agents/RESEARCH-STANDARDS.md`](../../agents/RESEARCH-STANDARDS.md):

| Label | Meaning here |
| --- | --- |
| **Fact (verified)** | The cited document was retrieved and says this. Verified on 2026-11-06. |
| **Fact (secondary)** | Several independent reports agree; the primary document was not retrieved. Weaker, and marked. |
| **Unverified lead** | A claim I could not check. It is a lead, not evidence, and no conclusion rests on it alone. |
| **Interpretation** | My reading of verified facts. Arguable. |
| **Hypothesis** | Testable proposition, with a test named. |
| **Proposal** | A design or course of action I recommend, subject to political decision by people with standing to make it. |

Sources are cited as `[S1]`…`[S15]`; §3.2 gives author, title, date, URL, type and limitation for each. A claim without a source tag is a statement about this repository's own files, which are cited by path.

---

## 1. Executive summary

**The short version.** Tokenization is a change in how claims are recorded and settled. It is not a source of value, credit or legitimacy. Where the underlying claim is already legally clean, enforceable, and held through supervised institutions, tokenization can cut settlement friction. Where those conditions are missing — which is the normal condition in a country emerging from sanctions and authoritarian rule — tokenization does not fix the claim; it only makes the defect faster, more legible and harder to unwind.

**The findings that matter, in order of consequence for Iran:**

1. **(Fact — verified) The sanctions gate is closed, and it is now activity-based, not name-based.** On 2026-08-24 OFAC issued determinations under E.O. 13902 §1(a)(i) covering the **aviation, digital asset, gold, shipping and technology** sectors of the Iranian economy, effective the same day; automotive and rail followed on 2026-10-01 [S1][S2]. Any person, anywhere, determined to "operate in" those sectors is designatable. A tokenized debt programme marketed to foreign investors is, on its face, an operating presence in the digital-asset sector.
2. **(Fact — secondary) Settlement assets have kill switches.** Stablecoin issuers froze roughly USD 550m of Iran-linked USDT during 2026, including USD 344m across two addresses attributed to the Central Bank of Iran in April [S14]. A sovereign that settles its debt or its transfers in someone else's token has handed a foreign private company a veto over its fiscal operations.
3. **(Fact — verified) The market is small and legally boring.** The IMF puts tokenized assets at roughly USD 65bn against USD 300tn of global capital markets [S9]. What works, works because the underlying instrument was already standard — government bills, money-market funds, private credit. Tokenized real estate is a rounding error.
4. **(Fact — verified, with one inference marked) Every sovereign success is a mirrored instrument, not a digital-native currency.** Hong Kong's HK$800m tokenized green bond (February 2023) was issued under the Government Green Bond Programme, with the HKMA's Central Moneymarkets Unit handling settlement [S11]. **(Interpretation)** That the token was therefore a wrapper on an instrument whose legal identity, venue and investor base were conventional — which is what "mirrored" means and what makes the precedent usable.
5. **(Fact — verified via analyses) Regulators have said, explicitly, that tokenization changes plumbing and not law** [S10], and the BIS has said, explicitly, that the settlement asset determines whether any of this is sound: a unified ledger anchored in central-bank money, not a private stablecoin [S4][S5][S6].
6. **(Fact — secondary) The two famous failures are not technology failures.** Venezuela's Petro was a resource-backed unit issued by an unaccountable issuer and ended in January 2024 in a graft scandal, after the opposition legislature called borrowing against the oil reserves illegal [S12]. Honduras's Factom pilot stalled in 2015 before it was deployed, because the registry was a political instrument and the government stopped answering [S13].
7. **(Interpretation) There is no verified case of a sovereign raising material external capital *because* it tokenized.** The capital came from the same institutional buyers, through the same custodians, at prices set by the same risk assessment. Tokenization changed the plumbing's cost, not the borrower's risk.
8. **(Interpretation) For a transition economy the premium that prices the borrowing is legal and political risk, not settlement mechanics.** The two are not commensurable until someone measures them in the same units, which nobody in this literature does — including this report, which proposes the measurement instead of asserting the result.

**Recommendation (Proposal).** Reorder the programme: **legal recognition and registry repair first, mirrored tokenized bills second, tokenized deposits and a central-bank-anchored wholesale ledger as the destination, and a resource-backed national unit (HMMT) as a later, ring-fenced instrument at best — not the first one.** A "do not build" outcome is coherent for HMMT specifically, and this report states the conditions under which I would endorse it and the conditions under which I would abandon it.

**What this report is not.** It is not an issuance plan, not a sanctions-avoidance scheme, not a legal opinion, and not a claim that any of this is permitted today. Section 9 Stage 0 is a gate that no later stage may skip.

---

## 2. The research question, and what is out of scope

**Question (as set):** how could a new, legitimately constituted government of a country in transition use asset and public-finance tokenization to rebuild its economy, and what must be true — legally, institutionally, technically, geopolitically — for that to work, fail safely, or be abandoned?

**Refined into four answerable sub-questions:**

- **Q1.** Which tokenization designs have actually been used by sovereigns and public bodies, and what did the underlying legal instrument, the settlement asset and the record-keeping authority look like in each?
- **Q2.** Which of the claimed benefits have a mechanism that survives contact with a weak-institution, post-sanctions economy, and what would falsify each?
- **Q3.** What is the correct sequence, and where are the points at which the programme should stop rather than continue?
- **Q4.** Where does this repository's existing design (HMMT, the five civic levels, the read-only prototype) support that sequence, where does it contradict it, and what should change?

**Out of scope, stated so it is not assumed:**

- No operational sanctions advice. No structure, jurisdiction, intermediary, wallet pattern or sequencing whose purpose is to move value in breach of OFAC, UN, EU or FATF controls, or to obscure counterparties. Historical description of evasion for analysis is included only where a public source already published it, and never at operational depth.
- No legal opinion. "Legal certainty" here means *a lawyer can point to a statute and a court that would enforce the claim*, not that this report has obtained advice.
- No country-specific recommendation for any country other than the parametric framework in §8. Iran is the worked example because the repository is Persian-first.
- No claim about what Iranians want. Legitimacy is decided by a political process this report cannot substitute for, and the instruments here are worthless without it.

---

## 3. Method, sources, and what could not be checked

### 3.1 Method

1. **Order of reading.** Repository documents first (§3.3), then primary institutional sources, then secondary reporting, then vendor and crypto-media pieces only for context and only with a label.
2. **Retrieval rule.** A source counts as verified only if the page was opened and the sentence relied on is visible in it. A search snippet is never evidence in this document.
3. **Cross-check rule.** Every claim that a conclusion depends on was checked in at least two sources, or in one source of record (a Treasury determination, a statute, a central-bank press release).
4. **Adversarial rule.** Before drafting, I wrote down the three strongest arguments *against* the programme and searched for evidence supporting them. Two of the three are in §13.
5. **Falsification rule.** Every causal claim in §6 carries a stated result that would count against it, and §9 states the kill criteria as pre-registered thresholds rather than retrospective judgement.

**Search log (searches executed 2026-11-06; English queries unless noted):**

| # | Query (abridged) | Outcome |
| --- | --- | --- |
| 1 | OFAC Iran digital asset sectoral determination June 2026 treasury.gov | Found the June designation press release text (mirror) and pointers to an August sectoral package |
| 2 | treasury.gov press release 24 August 2026 sectoral determinations digital assets technology gold aviation shipping | Confirmed the five determinations, the effective date, and the "regardless of where located" scope |
| 3 | BIS unified ledger tokenization annual economic report central bank money site:bis.org | Confirmed 2023 blueprint, 2025 "trilogy", 2026 chapter and Project Agorá |
| 4 | IMF 2026 tokenization risks paper site:imf.org | Confirmed IMF Notes 2026/001 (2 Apr 2026) and GFSR October 2026 chapter 3 with the ~USD 65bn figure |
| 5 | SEC staff statement January 2026 tokenization classification | Confirmed date, divisions and content; sec.gov page itself not retrieved |
| 6 | sec.gov "tokenized securities" staff statement January 28 2026 | Did not surface the sec.gov URL (see §3.4) |
| 7 | HKMA tokenised green bond HK$800 million 2023 … Thailand G-Token | Confirmed the HKMA issuance and report; Thailand **not** confirmed |
| 8 | Venezuela Petro shut down 2024 | Confirmed shutdown date and the graft scandal |
| 9 | Honduras blockchain land title Factom 2015 what happened | Confirmed "stalled" in December 2015, pre-deployment |
| 10 | Tether froze $344 million Iran central bank IRGC April 2026 | Confirmed amount, dates, and the further USD 131m in July |

The full primary retrieval for the OFAC determinations page (`ofac.treasury.gov/.../iran-sanctions`) was read in two chunks and lists, verbatim, the four E.O. 13902 determinations with their effective dates: financial (2020-10-08), petroleum and petrochemical (2024-10-11), aviation/digital asset/gold/shipping/technology (2026-08-24), automotive and rail (2026-10-01) [S1].

### 3.2 Sources

| ID | Source | Date | Type | Supports | Limitation |
| --- | --- | --- | --- | --- | --- |
| S1 | U.S. Treasury, OFAC, *Iran Sanctions* programme page (ofac.treasury.gov/sanctions-programs-and-country-information/iran-sanctions), retrieved 2026-11-06 | live page, 2026-11-06 | Primary (regulator) | Existence, scope and effective dates of the E.O. 13902 determinations; advisories and general-licence suspensions | A listing page: it does not interpret the determinations |
| S2 | U.S. Treasury, press release *Treasury Launches Unprecedented Campaign Against Iranian Regime* (SB0613), 2026-08-24, read via the FRASER PDF mirror (fraser.stlouisfed.org/files/docs/publications/treaspr/2026/2026-08-24_sb0613.pdf) | 2026-08-24 | Primary, mirror | The five sectoral determinations; "any person, regardless of where they are located"; suspension of general licences | Canonical treasury.gov page not opened directly |
| S3 | U.S. Treasury, press release on the designation of Nobitex and three other Iranian exchanges, 2026-06-02, read as full text via globalsecurity.org mirror | 2026-06-02 | Primary, mirror | June designations and their legal authorities (E.O. 13224, E.O. 13902) | Mirror; canonical page not opened |
| S4 | BIS, *Annual Economic Report 2023*, special chapter on the unified ledger (press release 2023-06-20) | 2023-06-20 | Primary (BIS) | Origin of the unified-ledger blueprint | Design proposal, not a result |
| S5 | BIS, *Annual Economic Report 2025*, special chapter; press release 2025-06-24 | 2025-06-24 | Primary (BIS) | "Trilogy" of tokenised reserves, tokenised deposits, tokenised government bonds; stablecoins fall short of sound money | Institutional position, not empirical test |
| S6 | BIS, *Annual Economic Report 2026*, chapter on tokenisation / *Anchoring trust in money* (bis.org/publications/anchoring-trust-money.pdf) | 2026 | Primary (BIS) | Unified ledger as system of interoperable networks; Project Agorá; legal analysis that tokenisation does not change the nature of deposits or reserves | Same |
| S7 | H. S. Shin (BIS), *Tokenisation for the real world*, OCC symposium, 2024-02-08 | 2024-02-08 | Primary (speech) | "Tokenisation continuum": legal and governance difficulty vary by asset | Slides, not a study |
| S8 | IMF, *Tokenized Finance*, IMF Notes 2026/001 (T. Adrian), 2026-04-02, doi:10.5089/9798229042468.068 | 2026-04-02 | Primary (IMF) | Structural-shift framing; anchors (legal certainty, code governance, safe settlement assets, coordination); concentration/fragmentation/speed risks; EMDE exposure | Policy note, 23 pages, no new dataset |
| S9 | IMF, *Global Financial Stability Report*, October 2026, Chapter 3 *Scaling Tokenization* (+ IMF blog 2026-10-08) | 2026-10 | Primary (IMF) | ~USD 65bn of tokenized assets; four constraints (legal certainty, regulatory clarity, interoperability, settlement assets); markets illiquid and fragmented | Flagship chapter, aggregate figures |
| S10 | SEC, joint staff statement on tokenized securities, Divisions of Corporation Finance, Investment Management, and Trading and Markets, 2026-01-28 | 2026-01-28 | Primary (regulator), **content verified via three law-firm analyses** (A&O Shearman; Dechert; JD Supra/Mondaq reprints) | "The format in which a security is issued … does not affect application of the federal securities laws"; issuer-sponsored vs third-party-sponsored taxonomy | Staff statement, not a rule, not binding; sec.gov text not retrieved |
| S11 | HKMA, press release *Report on Bond Tokenisation in Hong Kong*, 2023-08-24 | 2023-08-24 | Primary (central bank) | HK$800m tokenized green bond, February 2023, first by a government, under the Government Green Bond Programme, recorded in CMU | A pilot report; no cost-benefit numbers published |
| S12 | Reporting on the shutdown of the Petro (Reuters-derived; AFP), January 2024, plus the encyclopaedic summary of the 2018 launch | 2024-01 | Secondary, consistent | Shutdown 2024-01-15/16; remaining holdings liquidated; graft scandal; 2019 sanctions on a financing bank; opposition legislature called the oil-reserve borrowing illegal | Primary Venezuelan instruments not retrieved |
| S13 | Contemporaneous reporting on the Factom–Epigraph Honduras land-registry project, December 2015 and 2016 | 2015-12 / 2016 | Secondary, contemporaneous | Announced May 2015; "stalled" by December 2015; never deployed; government declined to comment | The government never published its reasons |
| S14 | Reporting on Tether freezes of Iran-linked USDT, April 2026 (USD 344m) and July 2026 (USD 131m); ~USD 550m for 2026 | 2026-04 → 2026-11 | Secondary, multiple, consistent | Issuer-level freeze of a settlement asset at the direction of a foreign authority; a proposed rule under the GENIUS Act would require US-regulated issuers to be able to freeze | Tether's own announcements not retrieved |
| S15 | This repository: [`HMMT-DESIGN.md`](HMMT-DESIGN.md), [`HMMT-FACT-CHECK.md`](HMMT-FACT-CHECK.md), `packages/domain-models/hmmt.mjs` | 2026 | Internal design | The instrument being assessed: 189,544 HMMT ceiling, three structural rules, cap ladder, TON stage 1 | A design; no token exists |

### 3.3 Repository documents read before drafting

`AGENT.md`, `AGENTS.md`, `README.md`, `DECLARATION.md`, `FOUNDING-CHARTER.md`, `GOVERNANCE.md`, `VISION.md`, `ROADMAP.md`, `agents/RESEARCH-STANDARDS.md`, `agents/WORKSTREAMS.md`, `TASKS.md`, `tasks/README.md`, `tasks/001-iran-democratic-transition-research.md`, `docs/economics/HMMT-DESIGN.md`, `docs/economics/HMMT-FACT-CHECK.md`, `packages/domain-models/hmmt.mjs`, `docs/strategy/IPP-RECONCILIATION.md`, `docs/iran/IMPLEMENTATION-PLAN.md`, `docs/security/THREAT-MODEL-AND-AUDIT.md`.

Baseline recorded before any change: `npm run check` → `ok 8/8 checks passed` (lint, backlog, docs, test, guardrails, csv, build, drift). Lint reports 2 pre-existing `react-hooks/exhaustive-deps` warnings, unchanged by this work.

### 3.4 What could not be checked

| Item | Status | Consequence |
| --- | --- | --- |
| sec.gov text of the 2026-01-28 staff statement | Not retrieved (the search surfaced only law-firm analyses) | Marked **Fact — content verified via analyses**. The wording quoted is from those analyses |
| Thailand G-Token (5bn baht, 100-baht minimum, Public Debt Management Act authority) | **Unverified lead** | Excluded from the precedent count in §5; used only as an example of what would strengthen the retail-access argument if confirmed |
| Marshall Islands USDM1/ENRA universal-basic-income disbursement | **Unverified lead** | Not used as evidence. It is the most interesting precedent in the brief precisely because it is a *disbursement* use, and it is the first thing a reviewer with access should check |
| UK DIGIT digital gilt; South Korea tokenized-deposit pilot; Japan's national settlement plan; Saudi land registry; Kazakhstan; Pakistan; Germany's simulated Bund | **Unverified leads** | Each is consistent with the "mirrored, regulated, existing-law" pattern, but none is used to establish it |
| Market-size figures from RWA.xyz ($38.6bn), Token Terminal ($46bn), BeInCrypto (~$60bn) | **Unverified leads** (vendor/provider) | Replaced in this report by the IMF's ~$65bn figure [S9], which is itself an aggregate of unspecified method. The *disagreement between providers* is the finding: treat any single provider number as a marketing surface |
| Tokenized Treasury/MMF/private-credit/gold sub-totals; "7–12% of tokenized assets in DeFi" | **Unverified leads** | Not used. Nothing in this report depends on them |
| MiCA review, GENIUS Act implementing rules | **Unverified leads** | Referenced only as "the US and EU are actively building stablecoin regimes", which is uncontroversial and not load-bearing |
| Venezuelan primary instruments (Petro decree, liquidation order) | Not retrieved | Marked **Fact — secondary** |

**This is the honest weakness of the report, stated numerically.** Six source clusters were verified against a primary document or an official mirror: the OFAC determinations page, the 24 August Treasury release, the 2 June Treasury release, the BIS chapters, the IMF note and GFSR chapter, and the HKMA report. Three more rest on consistent secondary reporting: the Petro collapse, the Honduras stall, and the 2026 stablecoin freezes. Everything else in the brief — Thailand, the Marshall Islands, the UK, South Korea, Japan, Saudi Arabia, Kazakhstan, Pakistan, Germany, the provider market-size figures, the class sub-totals, the MiCA review and the GENIUS Act rules — remains an unverified lead. The sections that would change if those leads turn out false are marked in the table above, and no recommendation in §14 rests on one of them.

---

## 4. Findings

### F1. The sanctions gate is closed, and it is now activity-based

**(Fact — verified)** The E.O. 13902 determinations in force are: financial sector (2020-10-08), petroleum and petrochemical (2024-10-11), **aviation, digital asset, gold, shipping and technology (2026-08-24)**, automotive and rail (2026-10-01) [S1]. The 2026-08-24 package is described by Treasury as authorising designation of "any person, regardless of where they are located, that operates in" the determined sectors [S2].

**(Fact — verified)** On 2026-06-02, Treasury designated Nobitex — described as processing over 50 percent of Iranian digital-asset inflows in 2025 — plus three other Iranian exchanges, under E.O. 13224 and E.O. 13902 [S3]. **(Fact — secondary)** In 2026 OFAC also designated wallet addresses attributed to the Central Bank of Iran, and approximately USD 550m of Iran-linked USDT was frozen by the issuer [S14].

**Why this is the first finding and not a footnote.** A tokenized sovereign instrument is, structurally, a digital asset issued by an Iranian state entity and sold to foreign holders. Every one of those words is inside the determined sector. This is true regardless of who governs Iran: a government with a fresh democratic mandate has more legitimacy and exactly the same sanctions exposure. **(Interpretation)** Therefore the programme's sequence cannot begin with an instrument. It begins with relief, and relief is a diplomatic outcome that no technical design accelerates — the only thing a design can do is avoid making relief harder, which rules out anything that looks like offshore distribution to unscreened holders.

**A second-order point that is easy to miss.** **(Interpretation)** An activity-based determination changes the compliance question from "is this counterparty listed?" to "is this activity inside a determined sector?", which is a question a foreign bank cannot answer cheaply. The practical result is de-risking by correspondents even where a transaction might be technically permissible. A programme whose first artefact is a token therefore buys itself correspondent-bank refusal before it has a single investor — and correspondent access, not investor appetite, is the binding constraint on a post-sanctions economy.

### F2. The settlement asset has a kill switch

**(Fact — secondary)** Stablecoin issuers froze Iran-linked balances at the direction of US authorities in 2026: USD 344m across two Tron addresses attributed to the Central Bank of Iran in April, a further USD 131m in July [S14]. **(Unverified lead)** A rule proposed in 2026 under the GENIUS Act would require US-regulated issuers to be able to freeze tokens wherever they trade.

**(Interpretation)** For a private holder this is a compliance feature. For a sovereign treasury it is disqualifying: it means the national settlement asset can be immobilised by a foreign company applying foreign law, without a court in the issuing country, without notice, and without a remedy that the sovereign can enforce. Any architecture whose cash leg is a third-party token inherits that.

**The uncomfortable version of this point.** **(Interpretation)** The same property is what makes stablecoins attractive to the very users this report is analysing: they are dollars you can hold without a US bank account. The design conflict is not between "good" and "bad" money; it is between a settlement asset that is *credible abroad* and one that is *controllable at home*, and a sovereign cannot have both from a private issuer.

### F3. The market is small, concentrated, and legally boring

**(Fact — verified)** The IMF's October 2026 *Global Financial Stability Report* puts tokenized assets at roughly **USD 65bn**, against roughly **USD 300tn** of global capital markets and about **USD 13tn** of daily US repo [S9]. Its chapter identifies four constraints on growth: legal certainty, regulatory clarity, interoperability, and the availability of settlement assets, and describes tokenized markets as "small and fragmented", less liquid and more volatile than their conventional counterparts [S9].

**(Fact — verified)** The BIS frames the same state of affairs as a "tokenisation continuum" in which the easy cases are those whose legal and governance questions are already settled [S7], and as a system that must be anchored in central-bank money to preserve singleness, elasticity and integrity [S5][S6].

**(Interpretation)** The composition of the market is more informative than its size. What works is what was already a standard, legally simple, cash-flow-defined claim with an institutional buyer: Treasury bills, money-market fund shares, short-dated private credit. What does not work is what requires a court to decide who owns what: real estate, unregistered land, revenue shares in an unbuilt project.

### F4. Every sovereign success is a mirrored instrument

**(Fact — verified)** The Hong Kong government's HK$800m tokenized green bond (February 2023) was issued under the Government Green Bond Programme, and the HKMA's Central Moneymarkets Unit handled settlement; the report the HKMA published afterwards is titled *Bond Tokenisation in Hong Kong* and frames the exercise as a bond issuance whose recording technology changed [S11].

**(Interpretation)** Everything else that made the issue work — the governing law, the programme's statutory basis, the depository, the custody chain — was already there. That is what "mirrored" means, and it is the part the HKMA's report does not have to argue because it was never in doubt.

**(Interpretation)** The token was a wrapper on an instrument whose legal identity, governing law, listing venue and investor base were all conventional. The reported benefit was process efficiency inside the issuance — fewer manual handoffs, one platform for the parties — not a new class of buyer and not a lower risk premium.

**(Unverified lead)** The brief's Thailand, UK, South Korean, Japanese, Saudi, Kazakh, Pakistani and German examples, if confirmed, would all fit this pattern: a public debt office or central bank tokenizing an instrument it already has statutory authority to issue. That is precisely why they are worth checking: the pattern's predictive content is that *a tokenization programme's first question is "what may this issuer lawfully issue tomorrow?"*, and the answer is almost always "the same instrument as yesterday, recorded differently".

### F5. Regulators have separated plumbing from law, in writing

**(Fact — verified via analyses)** On 2026-01-28 the SEC's Divisions of Corporation Finance, Investment Management, and Trading and Markets issued a joint staff statement holding that the format in which a security is issued — including on-chain — does not change the application of the federal securities laws, distinguishing issuer-sponsored from third-party-sponsored tokenization, and treating certain synthetic wrappers as security-based swaps subject to additional restrictions [S10]. It is staff guidance, not a rule, and not binding [S10].

**(Interpretation)** Two consequences follow for a transition government. First, the legal work is prior: a token that is not a lawful instrument is not made lawful by a ledger, and a token that is a lawful instrument needs no special regime to exist — it needs a statute that recognises the record. Second, the "record" is the fight: recognising a distributed ledger as an official record (shareholder register, debt register, land register) is a legislative act with winners and losers, and it is where the political economy lives.

### F6. The failures are institutional, not technical

**(Fact — secondary)** Venezuela's Petro, launched February 2018 as an oil-backed token issued by the government, was shut down in January 2024; remaining holdings were liquidated, and its end was accelerated by a corruption scandal at the crypto regulator and the petroleum ministry [S12]. Before launch, the opposition-controlled legislature said borrowing against the oil reserves was illegal, and in 2019 the US sanctioned a bank for financing the Petro [S12].

**(Fact — secondary)** The Factom–Epigraph land-title project in Honduras was announced in May 2015 and reported as "stalled" by December 2015; it was never deployed, and the government declined to comment to reporters [S13].

**(Interpretation)** The Petro failed at four things that had nothing to do with cryptography: it was issued by an unaccountable authority, it claimed backing it could not evidence, it was imposed rather than adopted (mandatory payments for passports and aviation fuel), and it was captured by graft. Honduras failed at one thing: the registry was a source of political power, and the incumbent power did not want an immutable one. In both cases the technology worked as specified and the institution did not.

**A caution about the Honduras story.** **(Interpretation)** It is routinely cited as a blockchain failure, and it was not one: no system was deployed and failed. It is evidence about the politics of registries, and citing it as a technology failure is a category error that this literature makes constantly — which is itself a reason to distrust the genre.

### F7. The claimed benefits do not have the same evidentiary standing

**(Interpretation)** Reading [S4]–[S13] together, the claims sort into three tiers:

| Claim | Evidentiary standing |
| --- | --- |
| Faster, cheaper settlement and reconciliation inside a supervised market | Supported by pilots and by the design literature; benefit measured in process steps, not yet published in bps at scale |
| Lower primary-issuance cost for a sovereign | Asserted; no public before/after measurement found, including in the HKMA report |
| Broader investor base / capital attraction | Not supported. Every verified sovereign case sold to the same institutional buyers through the same custodians |
| Financial inclusion via fractional tickets | Plausible mechanism, no verified sovereign evidence; the retail-access arguments rest on platforms, not on sovereign issuance |
| Fiscal transparency | Mechanically plausible (one shared record), but transparency is a disclosure decision, not a ledger property |
| Registry integrity | Falsified as a standalone claim by Honduras; conditioning on registry reform is the only defensible form |
| Diaspora capital | Plausible and under-tested; the strongest candidate for a narrow pilot |

This table is the report's central analytic result: **four of the six benefits this programme would be sold on do not have the evidence their advocates imply.**

### F8. Digital exclusion and surveillance are not side effects; they are design choices

**(Interpretation)** A national ledger that records who received a transfer, when, and in what amount is a targeting instrument in a country that has experienced internet shutdowns, asset freezes and politically selective enforcement. The repository already treats this as a critical threat (`docs/security/THREAT-MODEL-AND-AUDIT.md`, TM-02) rather than a compliance checklist, and this report adopts that posture: **privacy law and disclosure design precede the ledger, or the ledger becomes a surveillance device with an economic justification.**

**(Hypothesis, testable)** Where a disbursement ledger identifies recipients at the point of payment, the risk of politically selective exclusion rises with the ledger's centrality to the payment of salaries and transfers; the observable signature is a correlation between payment delays and political geography. The test is in §11.

---

## 5. Claims and evidence

| # | Claim | Type | Evidence | Counterevidence | Confidence | Next test |
| --- | --- | --- | --- | --- | --- | --- |
| C1 | Digital assets are a determined sector of the Iranian economy; designation exposure is activity-based and extraterritorial | Fact (verified) | [S1] determination list with effective dates; [S2] "any person, regardless of where they are located" | A future rescission, waiver or licensing arrangement could change it; none was in force on 2026-11-06 | High — primary regulator documents | Re-read [S1] at each stage gate; treat as a hard gate in §9 |
| C2 | A tokenized Iranian sovereign instrument is inside that sector | Interpretation | Composition of the instrument (digital asset, issued by an Iranian entity, held abroad) against [S1][S2] | A licensed, whitelisted, sovereign-to-sovereign or multilateral structure might fall outside; counsel would have to say so | Medium-high | Obtain written analysis from sanctions counsel before any issuance design; the analysis is itself a gate |
| C3 | Private stablecoin settlement inherits an issuer-level freeze risk | Fact (secondary) + Interpretation | [S14] USD 344m and USD 131m freezes; ~USD 550m for 2026 | Freezes were of *sanctioned* wallets; a lawful sovereign might never be frozen | High for the mechanism, medium for the sovereign scenario | Stress-test: pick the settlement asset, name the entity that can freeze it, name the court that would hear the sovereign's objection |
| C4 | Tokenization does not change legal classification | Fact (verified via analyses) | [S10] | A future SEC rule could differ; other jurisdictions (EU DLT pilot) offer targeted relief | High for the US position as stated | Check ESMA/EU DLT Pilot Regime text for the European equivalent before relying on it cross-border |
| C5 | Every verified sovereign issuance is a mirrored instrument under existing law | Fact (verified, n=1 primary + unverified leads) | [S11] and the pattern across [S2]–[S9] | One case is not a pattern; the unverified leads could contradict it | Medium-high | Verify Thailand, UK, South Korea, Marshall Islands against primary documents |
| C6 | Tokenization has not demonstrably raised external capital for a sovereign | Interpretation | Absence of evidence in [S9][S11]; IMF's four constraints | Absence of evidence is not evidence of absence; private placements are not always public | Medium | Interview/ask a debt-management office that ran a tokenized issue what changed in its book |
| C7 | The tokenized market's composition tracks legal simplicity, not asset glamour | Interpretation | [S9] composition; [S7] continuum | Composition may reflect regulatory arbitrage rather than legal quality | Medium-high | Compare issuance cost and time-to-issue for tokenized vs conventional bills at one DMO |
| C8 | A resource-backed unit issued before registry and audit reform reproduces the Petro failure modes | Hypothesis | [S12] four failure modes; [S15] HMMT's structural rules answer three of them | HMMT's rules are genuinely stronger than the Petro's (no premine, ceiling, gross-not-backing); the analogy may be unfair | Medium | Red-team HMMT against each Petro failure mode explicitly (PR B) |
| C9 | Registry reform, not ledger adoption, is the binding constraint on land and collateral | Fact (secondary) + Interpretation | [S13]; [S9] legal-certainty constraint | Some jurisdictions have digitised registries successfully without blockchains, which supports rather than refutes the point | High | Read one successful registry digitisation (e.g. a World Bank case) and test what the ledger would add |
| C10 | The marginal effect of settlement technology on a transition economy's cost of capital is small relative to legal and political risk | Hypothesis | No quantified comparison exists in the literature reviewed; [S9] treats legal certainty as a constraint, not a cost | If a tokenized issue priced inside the conventional curve by a large margin, this would be refuted | Low-medium — the weakest load-bearing claim in this report | Pre-register the measurement in §6.1 before any issuance, so the result cannot be rationalised afterwards |
| C11 | A payment ledger that identifies recipients becomes a targeting instrument | Hypothesis | [S15] TM-02 posture; historical pattern of shutdowns and freezes in the region (not separately verified here) | Privacy-preserving designs (zero-knowledge eligibility, batched disbursement) may materially reduce it | Medium | Design a disbursement with no per-recipient on-ledger identity and see whether audit integrity survives |
| C12 | Sequencing (relief → law → registry → mirrored instrument → wholesale ledger) dominates instrument-first sequencing | Proposal supported by F1–F6 | [S1]–[S13] | A narrow pilot could generate political momentum that sequencing never does | Medium-high as a proposal; untestable as a fact | Run the roadmap's Stage 0 gate as a desk exercise with real statutes and see what fails first |
| C13 | HMMT should not be the first instrument | Proposal | §7 scoring; [S12]; [S15] §9 TON stage 1 and §10 threat model | HMMT's structural rules are stronger than any comparable design reviewed; a ring-fenced pilot could be safe | Medium — and it is a judgement, not a measurement | PR B's red team; a pilot with a hard 2 % ceiling and an external, funded validator review |
| C14 | The repo's five-level civic structure is a usable wrapper for staged gates | Interpretation | [S15]; `apps/web/src/modules/Bank.jsx` cap ladder | Civic levels are a governance proposal with no adopted meaning; gate semantics may be confused with enfranchisement | Medium | Check that no stage gate can be satisfied by level progression alone |

---

## 6. Causal mechanisms, each with a falsifier

The point of this section is that a benefit claim without a mechanism and a falsifier is marketing. Each subsection states the outcome, the mechanism, the confounders, the baseline, the horizon, and the result that would count against the claim.

### 6.1 Settlement cost

- **Outcome (definition).** All-in cost of issuing and servicing a government instrument, in basis points of face value, from announcement to settlement, plus the operational cost of reconciliation per issue; and, for payments, cost per transfer and time to finality.
- **Mechanism.** One shared record replaces sequential messaging between issuer, arranger, custodian, paying agent and registry; atomic delivery-versus-payment removes a reconciliation window; smart-contract coupon payment removes manual steps.
- **Confounders.** Issue size, tenor, investor mix, market conditions, syndicate structure, and the currency of issue move cost more than plumbing does. A pilot that is also a debut issue will attribute a debut premium to the technology.
- **Baseline.** The same issuer's conventional auction of the same tenor in the same quarter, with cost decomposed into underwriting, legal, custody, settlement and servicing.
- **Horizon.** Two years, minimum four matched issues.
- **Falsifier.** If the matched-pair saving is below the pre-registered threshold (proposal: **5 bps** of face value, or below the cost of the added legal and audit work, whichever is larger) after four issues, the settlement-cost claim is not supported and Stage 1's expansion stops.

### 6.2 Fiscal transparency

- **Outcome.** Share of budgeted expenditure and public debt disclosed with transaction-level traceability, and the time from transaction to publication; measured by an external auditor's checklist, not by the presence of a ledger.
- **Mechanism.** A ledger produces a by-construction audit trail, and publishing a hash root makes silence detectable: a missing entry breaks the chain rather than merely being absent from a report.
- **Confounders.** Disclosure is a legal and political decision; a government that wants to hide a payment can keep it off-ledger, split it, or classify it. Tokenization does not compel disclosure.
- **Baseline.** The pre-existing publication regime (central bank bulletins, budget execution reports) and its measured lag.
- **Horizon.** One budget cycle.
- **Falsifier.** If, after one budget cycle, the publication lag and coverage are not measurably better than the conventional regime — or if any material class of expenditure is off-ledger by design — the transparency claim fails for that programme.

### 6.3 Financial inclusion

- **Outcome.** Number and value of first-time holders of a government instrument from outside the top income decile; share of rural and women holders; measured by stratified survey, not by wallet counts (one person can hold many wallets, and one custodian can hold for many people).
- **Mechanism.** Fractional tickets lower the entry price; direct distribution removes a minimum-balance gate; secondary trading allows exit without a bank branch.
- **Confounders.** Smartphone and identity-document penetration, connectivity, literacy, trust after a currency collapse, and the opportunity cost of holding a domestic-currency claim during inflation. Iran's history of retail participation in equity and in informal FX markets suggests demand exists where returns are positive, not where tokens are novel.
- **Baseline.** Retail participation in the existing bill/paper market and in bank deposits, at the same maturities and yields.
- **Horizon.** 18 months.
- **Falsifier.** If the holder distribution is not materially different from the conventional market after 18 months, the inclusion claim is decoration on an institutional-investor product, and the small-ticket feature should be dropped rather than defended.

### 6.4 Capital attraction

- **Outcome.** New committed foreign capital that would not have been lent on conventional terms — measured by the investor's own counterfactual statement in a subscription document, not by the amount raised.
- **Mechanism (claimed).** Programmability and 24/7 settlement widen the buyer universe to funds with digital-asset mandates.
- **Confounders.** Sanctions, sovereign risk, currency risk, custody eligibility, index inclusion and mandate constraints. A fund with a digital-asset mandate can buy a tokenized bill only if its custodian, auditor and compliance function accept it; most do not, today.
- **Baseline.** The same issuance offered conventionally to the same investors.
- **Horizon.** Three years.
- **Falsifier.** If no investor states that the token format was necessary to their participation, the claim is refuted for that programme — regardless of how much money arrived. **(Interpretation)** On the evidence in §4, I expect this claim to fail first, and it is the claim most often used to justify the programme.

### 6.5 Registry integrity

- **Outcome.** Rate of successful title challenges, time to register a transfer, and count of disputed parcels, in a defined district, with a pre-reform baseline.
- **Mechanism.** A tamper-evident record plus a published change log makes backdated alteration detectable; conditional on the *off-chain* title being adjudicated and the cadastre being geometrically correct.
- **Confounders.** Adjudication campaigns, court capacity, survey accuracy, and local political settlements matter more than the ledger. Honduras is the case that isolates this: the ledger was not the obstacle.
- **Baseline.** The same district's pre-reform registry performance.
- **Horizon.** Three years, because title disputes outlive pilots.
- **Falsifier.** If recorded disputes or transfer times do not improve in the treated district relative to a matched control district, the ledger added nothing to the reform — and the reform alone should be continued without it.

### 6.6 Diaspora capital

- **Outcome.** Net inflow through the tokenized channel, net of round-tripping, plus the cost per transfer and its reliability, measured against informal hawala-equivalent pricing.
- **Mechanism.** Small tickets, direct custody, and the ability to hold a claim rather than a bank deposit that can be frozen or repriced.
- **Confounders.** Sanctions compliance of the sending-side intermediaries; trust in the issuer; the exchange rate at both ends; tax treatment. **(Interpretation)** This is the strongest candidate for a narrow pilot, because it needs the least new legal infrastructure — a claim on an existing instrument, sold to individuals who already want exposure — and the weakest for a broad programme, because it is the channel most exposed to correspondent and sanctions friction.
- **Baseline.** Remittance cost and volume through licensed channels and through the informal market, as reported by the recipient households.
- **Horizon.** Two years.
- **Falsifier.** If the channel's cost is not below the informal benchmark, or if its inflows substitute for (rather than add to) existing formal remittances, the diaspora argument fails.

---

## 7. Four architectures, one comparison

The four architectures are compared as designs, not as vendors. Scoring is 1–5 where 5 is best for a transition government, and the scores are **Interpretation** — judgements with reasons attached, not measurements. A reader who disagrees with a score should be able to see exactly which reason to attack.

| Criterion | (a) Mirrored tokenized sovereign debt | (b) Tokenized deposits + wholesale CBDC | (c) T-bill/fiat stablecoin on a public chain | (d) Resource-backed national unit (HMMT) |
| --- | --- | --- | --- | --- |
| Sanctions exposure | 3 — inside the determined sector, but a conventional instrument with a conventional issuer; the exposure is the issuer, not the design | 3 — same, but the participants are supervised banks, which makes compliance legible | 5 — worst: a public-chain, offshore-issued bearer-like asset with a foreign issuer able to freeze it | 4 — worst of both: a national unit on a public chain, with the added political salience of a "national currency" |
| Monetary sovereignty | 4 — no new money is created; debt is debt | 5 — the central bank anchors the settlement asset; the BIS's preferred architecture [S5][S6] | 2 — the settlement asset is foreign private money; currency substitution risk [S8][S9] | 2 — a second unit competing with the national currency before the central bank has credibility |
| Run risk | 4 — a bond can fall in price; it cannot be "run" in the deposit sense | 4 — deposits can run, but into central-bank money, which is the point of the design | 3 — stablecoin runs are issuer runs, and the issuer is not the sovereign | 2 — HMMT's redemption queue is fair but it is a queue; a falling resource price with a fixed ceiling invites it |
| Issuer-freeze risk | 5 — the issuer is the sovereign | 5 — the anchor is the central bank | 1 — demonstrated at USD 344m scale [S14] | 3 — HMMT itself is not freezable by a foreign issuer, but its TON stage 1 depends on validators and a jetton admin key outside national control [S15] §9 |
| Legal certainty | 5 — the instrument exists under existing law; the ledger is a record [S10][S11] | 4 — requires deposit-law and settlement-finality amendments, which are well-charted | 2 — bearer-like claims, unclear property law, unresolved insolvency treatment | 1 — a new unit with no statutory basis, no redemption law, and a valuation chain that is not a legal claim |
| Privacy | 4 — holders are institutions or custody-account holders; disclosure can be tiered | 4 — bank-intermediated, so existing secrecy and reporting rules apply | 2 — public ledger, address clustering, and issuer-level surveillance | 2 — the design avoids on-chain identity, but deposit timing and branch data re-identify (the repo says so itself, §10.5) |
| Cost to build | 4 — uses existing market infrastructure; the DMO needs a platform, not a state | 3 — the most expensive: requires a wholesale ledger, bank participation and legal reform | 3 — cheap to issue, expensive to supervise, and the cost lands on the central bank's credibility | 2 — the most expensive: registry, valuation office, auditor, custody, legal mandate, chain operations, all before the first token |
| Reversibility | 5 — stop issuing; the outstanding bonds still exist | 4 — unwind is possible; the ledger is infrastructure and can be retired | 3 — a stablecoin in circulation is hard to recall | 2 — a national unit with holders, a queue and a political constituency is nearly impossible to abandon |
| **Total (unweighted)** | **34** | **32** | **21** | **18** |

**Reading the table.**

- **(Interpretation)** Architecture (a) wins on the criteria that a transition government cannot afford to lose: legal certainty, reversibility, issuer control. It is also the only one with a verified sovereign precedent [S11].
- **(Interpretation)** Architecture (b) is the destination, not the start: it is the BIS's design and it solves the settlement-asset problem properly [S5][S6], but it requires a functioning central bank, supervised banks and amended law — the three things a transition lacks in month one.
- **(Interpretation)** Architecture (c) is disqualified for sovereign settlement by the freeze evidence [S14] and by the monetary-sovereignty findings [S8][S9]. It remains a legitimate *retail* instrument under a licensed issuer for small-value cross-border payments, and pretending otherwise would be unserious — but a treasury must not stand on it.
- **(Interpretation)** Architecture (d) — HMMT — scores last, and not because the design is sloppy. It scores last because it asks a state with no functioning registry, no adopted legal mandate and no settlement asset to carry the most demanding instrument in the set. §12 and PR B address what would make it defensible.

**Sensitivity.** If a reader weights "monetary sovereignty" and "cost to build" at zero and weights "political salience" heavily — a defensible political judgement in a legitimacy transition — the ranking changes: (d) rises because a national unit is a visible symbol of sovereignty, and symbols have political value that this table prices at zero. The report therefore does not claim the ranking is objective; it claims the criteria are explicit and the reasons are attached.

---

## 8. Country-parametric readiness framework

### 8.1 The inputs

Six inputs, each with an observable proxy a researcher can check without access to the government:

| Input | Proxy | Why it dominates |
| --- | --- | --- |
| Sanctions status | OFAC/EU/UN programme listings; sectoral determinations; correspondent access for the sovereign's banks | Sets whether foreign holders can exist at all (§F1) |
| Legal tradition and existing authority | Whether the DMO/central bank may lawfully issue the instrument *today*; whether a ledger may be an official record | Determines whether the instrument is a bond or an experiment (§F5) |
| Central-bank independence | Statutory Governor tenure; limits on monetary financing; publication of the balance sheet | Determines whether the settlement asset is credible or political |
| Registry quality | Title adjudication coverage; cadastre geometry; time to register a transfer; dispute rate | Determines whether asset-backed designs mean anything (§F6) |
| Connectivity and exclusion | Mobile data coverage; smartphone penetration; national ID coverage; electricity reliability | Determines who can hold and who is excluded by design (§6.3) |
| Institutional trust | Survey measures of trust in courts, banks and the currency; recent history of freezes or confiscation | Determines run dynamics more than any parameter |

### 8.2 Hard gates, which no score can override

**(Proposal)** A programme may not proceed past Stage 0 unless all five hold. They are deliberately binary, because a weighted score can always be gamed and a gate cannot:

1. **Sanctions:** either no applicable prohibition on the instrument and its holders, or a written licence/permitted structure confirmed by the relevant authorities and by counsel. "We think it is fine" is not a gate.
2. **Legal mandate:** a statute or regulation that names the issuer, the instrument, the record and the redemption obligation, and a court that would enforce it.
3. **Settlement-asset control:** the cash leg is central-bank money or a supervised deposit that the sovereign's own law can reach, with no foreign private entity able to freeze it unilaterally.
4. **Registry and audit:** an independent auditor under a multi-year mandate with a published methodology, and a registry whose title is adjudicated — not merely digitised.
5. **Privacy and disclosure design:** a published rule for what is written on the ledger, who can correlate it, and what is never written, reviewed by someone with standing to object.

### 8.3 Worked example: Iran, 2026

**(Interpretation, from [S1] and [S15])** Iran fails gates 1, 2, 3 and 4 today, and passes 5 only in the sense that the repository's own design already states the rule. That is not a statement about Iranians; it is a statement about the instruments. A transition government inherits the same gate failures and can only fix gate 2 and part of gate 4 quickly. Gate 1 is diplomatic, gate 3 requires a central bank with credibility and a settlement system it controls, and gate 4 requires years.

**The correct inference is not "therefore tokenize later" but "therefore build the things the gates measure".** Registry digitisation, audit capacity, payment-system supervision and sanctions-compliance architecture are all useful without a token, and they are the only work that makes a token mean anything.

### 8.4 Reusing the framework elsewhere

**(Proposal)** The framework is deliberately country-blind: a country with a functioning DMO, an investment-grade rating and a clean registry can start at Stage 1 or 2 and skip most of the diagnostic work; a country with a sanctions programme and a disputed cadastre should not start at all. The framework's only strong claim is that the six inputs are ordered: sanctions and legal mandate gate everything, and connectivity gates nothing until an instrument exists.

---

## 9. A sequenced roadmap, with kill criteria

Stated as **Proposal**. Each stage has entry gates, success metrics and the conditions under which it is abandoned rather than extended. The kill criteria are pre-registered deliberately: a programme that decides at the end whether it worked has already decided that it worked.

### Stage 0 — Legal and institutional foundation, no token

**Entry gate:** a legitimate government with a mandate to legislate (this report cannot supply or judge that), and a decision to treat the programme as a legal project rather than a technology project.

**Work:** securities and debt-management law recognition of distributed-ledger records; issuer mandate and redemption obligation; central-bank position on the settlement asset; registry title adjudication and cadastre repair programme; privacy statute and disclosure design; sanctions-compliance architecture with correspondent banks; independent audit mandate; supervisory MoU between the DMO, the central bank and the securities regulator.

**Success metrics:** statutes and regulations enacted with published text; an auditor appointed with a published methodology; a written sanctions opinion; a documented decision on the settlement asset; a registry baseline measured (dispute rate, transfer time) before any change.

**Kill criteria (any one stops the programme):** the legal mandate cannot be enacted within two legislative sessions; the settlement asset cannot be made domestic; an audit mandate is refused or made advisory; sanctions counsel concludes the instrument is prohibited and no licence path exists.

**What this stage explicitly does not do:** issue anything, procure a chain, or announce a currency.

### Stage 1 — Tokenize what is already legally clean

**Entry gate:** all five hard gates from §8.2 satisfied; Stage 0 metrics published.

**Instrument:** short-dated government bills and bonds in the mirrored model — the instrument the DMO may already issue, recorded on a permissioned ledger operated by, or under the supervision of, the central securities depository; small minimum tickets; a diaspora tranche under the same prospectus as the domestic tranche; tokenized-deposit settlement for treasury operations once banks can participate; transparent disbursement of a defined transfer programme **with a cash fallback and no per-recipient on-ledger identity**.

**Success metrics (pre-registered):** matched-pair issuance cost (§6.1); settlement cycle; failed-settlement rate; investor counterfactual statements (§6.4); holder distribution (§6.3); disbursement leakage measured by the auditor; zero privacy incidents.

**Kill criteria:** matched-pair saving below the pre-registered threshold after four issues; any material class of expenditure off-ledger; a freeze or immobilisation of the settlement asset by a foreign entity; a privacy incident affecting identifiable recipients; any evidence that the token format narrowed rather than widened the buyer base while adding cost.

### Stage 2 — Registries, then credit

**Entry gate:** Stage 1 survives its first review; the registry reform is funded and staffed independently of the ledger programme.

**Work:** title adjudication and cadastre repair first, then land, company and collateral registries as *registries* — with the ledger as a change log, not as the source of truth until a court says otherwise; trade-receivable and SME-credit tokenization only where the receivable is already assignable under law and insured or guaranteed.

**Success metrics:** treated-versus-control district dispute rates and transfer times (§6.5); receivables discount rate versus conventional factoring; default and dispute rates.

**Kill criteria:** no measurable improvement over control districts after three years; registry capture by an incumbent interest (the Honduras signature); receivables default rates above the conventional benchmark.

### Stage 3 — Public assets and revenue claims

**Entry gate:** Stage 2 registry metrics positive; a valuation methodology published and peer-reviewed; a legal opinion that the instrument is a claim on an audited cash flow and not a share in an unbuilt asset.

**Work:** infrastructure and PPP revenue instruments; resource-revenue sharing **structured as claims on audited, deposited cash flows, never as barrels in the ground** (§F6, and [S15]'s own invariant 3); any privatisation-by-token assessed against the historical voucher-privatisation record before it is designed, not after.

**Not researched here, and it matters.** The brief asks for the historical voucher-privatisation lessons (Czech, Russian, Polish, and the Iranian justice-shares experience) before any privatisation-by-token is designed. I did not retrieve that literature in this pass, so this report does not summarise it. The one thing that can be said without it: voucher schemes distributed *claims to assets whose ownership and value were not yet settled*, which is the same defect §6.5 identifies in registry-first sequencing, and the Iranian case in particular is remembered as a redistribution of rents rather than of ownership. Flagging this instead of gesturing at it is deliberate; O9 in §15 names it as the next retrieval.

**Success metrics:** realised cash-flow coverage of promised distributions; independent valuation error; secondary-market depth; distributional outcomes by decile.

**Kill criteria:** valuation error above a pre-registered band in the first audited year; distributions paid from new subscriptions rather than cash flow (a Ponzi signature that is easy to detect and easy to rationalise); any design in which the instrument's value depends on the sovereign's own price forecast.

### Stage 4 — Wholesale settlement on a central-bank-anchored ledger, and cross-border links

**Entry gate:** Stages 1–3 sustained; a central bank with a functioning monetary-operations framework; interoperability standards adopted with at least one foreign counterpart.

**Work:** the BIS's architecture — tokenized reserves, tokenized deposits and tokenized government bonds on one venue or as interoperable networks [S4][S5][S6]; cross-border links with jurisdictions that satisfy the same gates.

**Success metrics:** settlement finality under domestic law; cross-border payment cost and time against the correspondent baseline; incident and outage record.

**Kill criteria:** settlement finality cannot be established in law; a cross-border partner fails the same gates; the operational record shows outages that a conventional system would not have had.

**The option that must remain open (Proposal):** at every stage, "continue the conventional system and stop the programme" must be the default rather than the failure mode. The programme should be *renewed* at each gate, not assumed.

---

## 10. What would make this fail

Each failure mode names the mechanism, the early-warning indicator that a supervisor could actually observe, and the mitigation that is worth its cost. Mitigations that are not worth their cost are marked as such — the honesty is the point.

| # | Failure | Mechanism | Early-warning indicator | Mitigation, and its cost |
| --- | --- | --- | --- | --- |
| 1 | **Weak title** | The ledger records a claim that a court will not enforce; the token is a receipt for nothing | Title challenges rising in the treated district; insurers refusing to write | Adjudicate before digitising (**high cost, unavoidable**) |
| 2 | **Oracle and valuation fraud** | Asset values enter the ledger through a report someone can edit; haircuts become negotiating instruments | Valuation revisions that cluster before issuance windows; one valuer used repeatedly | Separate valuer from haircut-setter; publish methodology; rotate mandate (**medium**) |
| 3 | **Governance capture** | The committee that sets parameters becomes the thing it regulates; caps and ceilings become patronage tools | Parameter changes concentrating benefit in one institution; recusals not recorded | Asymmetric rules (fast to tighten, slow to loosen), published dissent, no mint function (**low cost, high value**) |
| 4 | **Sanctions and correspondent access** | Any tokenized presence raises the compliance cost of every counterparty, and banks de-risk before lawyers opine | Correspondent refusals or enhanced due diligence requests for unrelated business | Compliance-first design; no offshore distribution to unscreened holders; written opinions before announcements (**high cost, unavoidable**) |
| 5 | **Issuer freeze** | The settlement asset is someone else's liability and they can immobilise it | Issuer policy changes; new freeze capability requirements | Anchor in central-bank or supervised domestic money (**high**) |
| 6 | **FX and run dynamics** | A fixed ceiling with a floating exchange rate and a resource price: when the backing falls, the unit looks over-issued and holders queue | Queue length; premium of unit over official rate; redemption requests per day | Publish the reserve statement daily; price the queue transparently; state the haircut rule in advance (**medium**) |
| 7 | **Smart-contract and key risk** | An upgrade path or an admin key is a single point of compromise; an audit is a snapshot, not a guarantee | Unreviewed contract changes; key-holder concentration; incident postmortems that stay internal | No upgrade path without timelock and review; multi-signature with published holders; a published exit path before launch (**medium**) |
| 8 | **Connectivity and shutdown** | The system assumes networks the state can switch off, and a shutdown becomes a payment failure with political consequences | Payment failures correlated with network events | Offline fallback for essential payments; delay-tolerant design; cash fallback in statute (**medium-high**) |
| 9 | **Digital exclusion** | Requirements (smartphone, identity document, literacy, address) exclude exactly the people a transition most needs to include | Holder distribution skewed by geography and income | Assisted channels; paper-equivalent claims; explicit exclusion reporting (**medium**) |
| 10 | **Politicisation of the ledger** | The unit becomes the government's project; critics are framed as economic saboteurs; the ledger's centrality converts a technical failure into a legitimacy crisis | Rhetoric linking the unit to loyalty; selective enforcement of rules against critics | Institutional distance between the issuer and the political programme; independent supervision (**low cost, politically hard**) |
| 11 | **Petro failure mode** | A resource-backed unit issued by an unaccountable authority, with claimed backing that cannot be evidenced, imposed rather than adopted | Mandatory acceptance for state services; backing that is "reported" rather than audited; graft investigation at the issuer or supervisor | HMMT's three structural rules answer three of these four; the fourth — political accountability of the issuer — is not answerable by design (**see PR B**) |

---

## 11. Distributional and rights analysis

**Who gains (Interpretation).**

- **Institutional investors** in a tokenized bill gain optionality and, if settlement improves, a small cost saving. They gain most and bear least.
- **The sovereign** gains a cheaper settlement process if the claim in §6.1 holds, and a new political symbol. It bears the programme risk.
- **Banks** lose float, fee income and, in the deposit-token architecture, some balance-sheet flexibility. Their cooperation is a precondition and their loss is real; a design that pretends otherwise will be sabotaged quietly.
- **Retail holders** gain access if tickets are small and custody is direct; they bear duration, currency and platform risk with less capacity to assess it.
- **Diaspora savers** gain a lawful way to hold a domestic claim; they bear sanctions and freeze risk that they cannot influence.

**Who loses.**

- **The informal economy** loses the opacity that lets it function under sanctions and inflation. Some of that opacity is evasion; some is survival. A ledger that ends informal settlement also ends the buffer that many households use.
- **Rural and low-connectivity populations** lose relative to urban ones if access requires connectivity, and they know it.
- **Currency-holders** lose if a parallel national unit fragments the money already in use, and they have no vote in the design.

**Rights, stated as requirements rather than values (Proposal):**

1. **No per-recipient identity on the ledger for disbursements.** Eligibility is proven without publishing who received what; the repository's own threat model (TM-02) already takes this position.
2. **A published disclosure rule** naming what is written, who can correlate it, and the retention period, with an independent reviewer who may object in public.
3. **A redemption right in statute**, not in a policy document: a holder can exit, and a queue's ordering is published and auditable.
4. **Fallbacks that are real**: cash and offline channels for essential payments, tested, not merely specified.
5. **No linkage between civic participation and economic access.** The repository's cap ladder is careful about this (participation never buys headroom, `CAP_INVARIANTS` in `packages/domain-models/hmmt.mjs`), and any real programme must be held to the same rule: the ledger must not become a loyalty programme.
6. **The right to be wrong about the programme.** Public criticism of the design must not be treated as sabotage; the report recommends a published dissent channel and that the programme's own metrics be published before the first issuance.

**The surveillance flag, stated plainly.** A ledger of who received what is the most useful instrument a coercive state can be handed. In a country where asset freezes and internet shutdowns have been used politically, the burden of proof is on the designers to show the ledger cannot be used that way — not on critics to show that it can.

---

## 12. What this means for the CEP prototype

The repository is a Persian-first, read-only, synthetic prototype with a five-level civic structure, a key dock, twelve library modules and the HMMT bank. This section assesses it against the strategy above. The detailed red team is PR B; this is the mapping.

### 12.1 Where the prototype supports the strategy

- **The three structural rules are the discipline the market lacks.** No token without a matching deposit, supply never above the asset-backed ceiling, and a gross in-situ figure never used as backing (`HMMT-DESIGN.md` §3) are exactly the rules that the Petro and most tokenized "asset-backed" schemes violate. Whatever happens to HMMT, those invariants should survive into any instrument the repository describes.
- **The evidence tiering is honest and rare.** The ceiling is 189,544 HMMT because only tier T3 is counted, at a 0.5 verification multiplier on a source-reported USD 27.3tn headline, discounted to USD 703.8bn (`HMMT-FACT-CHECK.md`). That is a live statement about evidence quality — the single most transferable idea in the repository.
- **Redemption queues rather than freezes, and pause that cannot stop redemption** (`HMMT-DESIGN.md` §5) match the run-risk analysis in §7: fairness plus transparency is the best available answer to a run, and it should be stated in statute, not in a design document.
- **The five civic levels are a usable gate wrapper**, provided they never become an entitlement. The cap ladder's invariant that "participation never pays" (levels 2 and 3 have identical caps) is the guard rail that keeps a civic ladder from becoming a loyalty programme.
- **The threat model already names the right threats** — sanctions and correspondent access, insider minting, FX manipulation, privacy leakage through timing (`HMMT-DESIGN.md` §10; `docs/security/THREAT-MODEL-AND-AUDIT.md`).

### 12.2 Where it conflicts with the strategy

- **Instrument order.** The prototype's most developed economic artefact is the one this report ranks last for a first instrument (§7, architecture d). A resource-backed unit requires the registry, the valuation office, the legal mandate and the settlement asset that Stages 0–2 exist to build.
- **Resource backing.** The design uses in-situ resources as backing, discounted but still in-situ. The strategy's Stage 3 rule is stronger: a claim on **audited, deposited cash flows**, never on barrels in the ground. The evidence chain in `HMMT-FACT-CHECK.md` is unusually careful, but carefulness about a gross figure is not the same as a legal claim on cash.
- **TON as stage 1.** A public chain whose validators and jetton admin key sit outside national control is a dependency the design itself lists as accepted risk (`HMMT-DESIGN.md` §9). Under this report's freeze and sovereignty criteria, stage 1 should be a permissioned environment operated under supervision, or the programme should wait.
- **The bank surface implies a payments layer that does not exist.** `#/bank` models conversion, redemption, caps and proof of reserve. Those are the operations of a licensed deposit-taking institution with a supervisory relationship; no such institution is in the plan, and the interface's precision may read to a viewer as readiness.
- **"Not legal tender" is necessary but not sufficient.** The design is careful to disclaim legal tender, deposit and security status. The strategy adds the missing disclaimers: not licensed, not supervised, not audited, and not lawful to issue today under the determinations in [S1].

### 12.3 What should change (Proposal, for maintainer review)

1. **Reorder the surfaces, not the code.** Add a staging surface that presents the roadmap, gates and kill criteria of §9 — including the option "do not build" — so the repository's most visible economic claim is the sequencing rather than the unit.
2. **Restate HMMT's scope in `HMMT-DESIGN.md`**: a ring-fenced instrument for resource-revenue claims, at Stage 3 or later, not a national unit at Stage 1. Keep every structural rule and every invariant; change the position in the sequence, not the arithmetic.
3. **Replace in-situ backing with deposited-cash-flow backing** in the tier table, or add a fourth tier for it and require it before T3 counts above zero at any phase above P0.
4. **State the gate outcome on screen**: which of the five hard gates in §8.2 are unsatisfied today, so no viewer can mistake a synthetic demonstration for a lawful programme.
5. **Keep the ledger out of recipient identity** for any disbursement surface, and say so on the screen rather than only in the threat model.
6. **Do not add a token, a wallet or a chain integration.** The repository's value is the arithmetic, the invariants and the evidence discipline; a real chain would add risk without adding truth.

---

## 13. Findings against the proposal, and what would change my mind

**A1. The programme may be unnecessary.** **(Interpretation)** The verified benefits are settlement efficiency inside a supervised market. A transition government can get most of that by joining an existing regional platform or by improving its own depository, at a fraction of the cost and risk of a national tokenization programme. If the settlement saving in §6.1 turns out to be under a few basis points, the correct decision is to not run the programme, and this report would support that.

**A2. The capital-attraction claim is probably false.** **(Interpretation)** No verified sovereign case shows new capital attracted by format. If investors do not state that tokenization was necessary to their participation (§6.4), the main political argument for the programme disappears, and what remains is a plumbing upgrade that should be judged as procurement.

**A3. HMMT is the wrong first instrument and possibly the wrong instrument.** **(Interpretation)** It scores last in §7 on the criteria a transition cannot lose, and its resource backing is the mechanism the Petro used and the market has never validated. Its structural rules are genuinely better than the Petro's, which is the strongest thing that can be said for it — and it is not enough to make it first.

**What would change my mind, item by item:**

| If this happened | I would move to |
| --- | --- |
| Sanctions relief that expressly permits tokenized sovereign issuance, with correspondent access restored | Stage 1 becomes plausible within 12–18 months |
| A verified sovereign issue that priced inside its conventional curve by a material margin, with the counterfactual documented | The capital-attraction finding (C6) would need revision, and the case for prioritizing issuance strengthens |
| A verified disbursement programme (e.g. the Marshall Islands claim, if confirmed) that cut leakage without exposing recipients | The inclusion and transparency arguments would strengthen materially |
| An HMMT pilot with a 2 % ceiling, an external funded code review, a permissioned supervised environment and a published reserve statement — and a year of clean operation | My ranking of (d) would move above (c), though not above (a) |
| Evidence that a resource-backed unit with audit-grade deposited-cash-flow backing has ever held its value through a commodity cycle | The core objection to resource backing would weaken |

---

## 14. Recommendations

Ranked, with the smallest defensible action first.

1. **(Proposal) Do not issue anything in 2026–2027.** Run Stage 0 as a legal and institutional programme. Publish what fails.
2. **(Proposal) Build the things the gates measure**: registry adjudication, audit capacity, payment-system supervision, sanctions-compliance architecture. All are useful without a token and are the only work that makes one meaningful.
3. **(Proposal) If an instrument is issued, make it a mirrored bill or bond under existing law**, settled in domestic supervised money, sold through existing custodians, with a small-ticket diaspora tranche as the only novelty.
4. **(Proposal) Pre-register the measurements in §6 before the first issuance**, including the falsifiers, and publish the results whether or not they favour the programme.
5. **(Proposal) Treat the resource-backed unit as a Stage 3 instrument at the earliest**, ring-fenced, with deposited-cash-flow backing preferred to in-situ backing, and with the repository's structural rules retained verbatim.
6. **(Proposal) Keep CEP's role documentary and diagnostic.** The repository's comparative advantage is honest arithmetic, explicit invariants and evidence labels — not issuance, custody or supervision. A prototype that drifts toward being an issuer's front end would lose the only asset it has.
7. **(Proposal) State "do not build" as a legitimate outcome in the programme's own documents**, so that stopping is a decision someone can make without losing face.

---

## 15. Open questions and next tests

| # | Question | Cheapest decisive test |
| --- | --- | --- |
| O1 | Are the Thailand, UK, South Korean, Marshall Islands, Japanese, Saudi and Pakistani cases what the brief says? | Retrieve each primary document (debt-office release, statute, platform report) and record the instrument, the law, the record-keeper and the settlement asset |
| O2 | What did a tokenized sovereign issue actually cost, decomposed? | Ask one DMO that has done both; if refused, reconstruct from published fees and compare with the same issuer's conventional issue |
| O3 | Does any investor state that tokenization was necessary to participation? | Read subscription documents and investor statements; the claim is either documented or it is marketing |
| O4 | What does a registry digitisation deliver without a ledger? | Compare a World Bank–supported digitisation with a ledger pilot in the same country |
| O5 | Can a disbursement be audited without identifying recipients? | Design one: batched eligibility proofs, no per-recipient on-ledger identity, auditor verifies totals and inclusion, not individuals |
| O6 | What happens to HMMT's ceiling under a 30 % FX move and a 20 % resource-price fall? | Run the repository's own model with those shocks and publish the queue length; the engine already supports the inputs |
| O7 | Is the five-level civic structure load-bearing for gates, or decorative? | Try to satisfy Stage 1's hard gates using only level progression; if it is possible, the ladder is entangled with economic access and must be re-cut |
| O8 | What is the smallest lawful pilot that would produce evidence rather than publicity? | A single mirrored bill, sold to a licensed diaspora tranche, with pre-registered metrics and a published kill decision |
| O9 | What did voucher privatisation actually do — in Czechoslovakia, Russia, Poland and Iran's justice shares — to ownership, value and legitimacy? | Retrieve that literature before any privatisation-by-token proposal is written; §9 Stage 3 depends on it and this report does not supply it |

---

## 16. Reproducibility

- **Searches:** §3.1 lists the ten queries, the engine (general web search), and the date (2026-11-06). Nothing was retrieved from a paywalled source.
- **Retrievals:** S1 was read in two chunks of a live page; S2 and S3 as mirrors of Treasury releases; S8 and S9 on elibrary.imf.org; S4–S7 and S11 on the issuing institutions' own sites. S10's content was verified through three law-firm analyses because the sec.gov page did not surface.
- **Repository baseline:** `npm run check` → `ok 8/8` before and after; no code was changed by this PR.
- **Arithmetic:** all figures used from this repository are traceable to `HMMT-FACT-CHECK.md` (ceiling 189,544 HMMT; USD 3,713,261.91 per unit at 269,305 toman/USD, 2026-10-29, source-reported). No new arithmetic is introduced here.
- **What another researcher needs to repeat this:** the ten queries, the source table in §3.2, and a decision about the six unverified leads. Nothing else in this report depends on private access.

---

**Companion deliverable (not in this PR):** `docs/economics/HMMT-REDTEAM-vs-TOKENIZATION.md` — the red team of the HMMT design against §7 and §12, with a proposed minimal diff to `HMMT-DESIGN.md` that does not touch the three structural rules.
