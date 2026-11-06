# HMMT red team: what the design has to survive if it launches on TON through a Telegram Mini App

**Task:** CEP-T016, companion deliverable (PR B). Depends on [TOKENIZATION-TRANSITION-STRATEGY.md](TOKENIZATION-TRANSITION-STRATEGY.md).
**Status:** Red-team draft for review. Attacks the design; proposes changes; changes nothing in code.
**Date:** 2026-11-06.
**AI disclosure:** written by an AI agent. Sources retrieved 2026-11-06; `[R1]`…`[R8]` are listed in §12.
**Revision 2 (2026-11-06):** the maintainer has fixed the Track 0 instrument: **non-transferable claim NFTs on TON, with verification deferred to after the transition, no RWA, no liquidity minting, no redemption.** §7.1 assesses that direction against this red team and amends D7. The attacks in §§2–6 are unaffected — they are about a token with a price, which Track 0 now explicitly is not.

> HMMT is not legal tender, not a deposit, not a security, and not authorised. Nothing in this document is a plan to issue anything, and several of its findings argue that the current design should not be issued in its current form at all.

---

## 0. The constraint I was given, and what I do with it

The maintainer's position, recorded verbatim in substance: **the project cannot drop TON now; the HMMT tokenization effort can only start on TON; Iranians will not trust an independent app or a new chain before a specific IPP-related political transformation; therefore, up to that transformation, the design stays on TON and ships as a Telegram Mini App.**

Three things follow, and I will not pretend otherwise:

1. **This is a distribution constraint, and it is legitimate to treat it as one.** The strongest verified fact in the strategy report is that a tokenized instrument's binding constraint is not cryptography but whether people can hold it, and whether anyone will. TON inside Telegram is, for the Iranian diaspora and for VPN-using residents, the lowest-friction channel that exists. An architecture that is legally clean and cannot reach a user is not a strategy; it is a memorandum.
2. **The constraint changes the instrument's *phase*, not just its chain.** The strategy report's Stage 1 assumed a legitimately constituted government that may lawfully issue. A pre-transformation project has no such issuer. So the TON/Telegram build is **not Stage 1 of that roadmap** — it is a separate track, Track 0, with a different legal status, a different purpose and different success criteria. §1 states it. This is a correction to my own report, and it is the most useful thing this document does.
3. **I still disagree on one point, and I record the dissent rather than resolving it by silence.** "Iranians will not trust an independent app before the political transformation" is an argument about legitimacy, and a chain does not supply legitimacy — it supplies reach. If the underlying claim is unenforceable and unbacked, a trusted distribution channel makes the failure arrive faster and to more people. The design change in §7 exists because of that disagreement: keep the channel, remove the promise the channel cannot support.

**What this document is not.** It is not a plan to migrate off TON, and it does not recommend one. Every attack below assumes TON and the Mini App stay, and asks what the design must do *inside* that constraint.

---

## 1. Track 0: what a pre-legitimacy build actually is

**(Proposal)** Split the programme in two and stop pretending one roadmap covers both.

| | **Track 0 — before legitimacy** | **Track 1 — after legitimacy** |
| --- | --- | --- |
| Issuer | No lawful issuer exists. A civic/community body with no statutory power | The state's debt office or central bank, under statute |
| Instrument | A claim on a published arithmetic, or nothing | A bill, bond or deposit token under existing law |
| Chain | TON, via a Telegram Mini App (given) | Permissioned, supervised, central-bank-anchored |
| Money | No fiat redemption promise, no yield, no market price the project supports | Par redemption in domestic money, settlement finality |
| Purpose | Demonstrate the arithmetic, test the channel, build a verified constituency | Fund the state, settle the market |
| Success test | People can verify the rules; nothing of value is lost; no participant is exposed | The state borrows cheaper or settles faster; measured against a matched conventional issue |
| Failure mode | Becomes a money-like object with no law behind it | Petro |

**(Interpretation)** Almost every serious risk in this document comes from mixing the two rows. A Track 0 build that behaves like Track 1 — promises redemption, supports a price, advertises backing — inherits Track 1's legal exposure without Track 1's lawful issuer. A Track 1 design that keeps Track 0's marketing inherits the appearance of a movement treasury.

**(Proposal) The Track 0 gate: nothing of value may be at risk.** If a participant can lose money, Track 0 has ended and the project is in Track 1 territory without a mandate. That single rule disciplines most of the design choices below.

---

## 2. Attack 1 — the Petro comparison, done properly

**(Fact — secondary)** The Petro was launched in February 2018 by the Venezuelan government, was required for some state services (passport fees, aviation fuel), was financed in part by a sanctioned bank, was called illegal by the opposition-controlled legislature because it borrowed against oil reserves, and was shut down in January 2024 with remaining holdings liquidated, after a corruption scandal at the crypto regulator and the petroleum ministry `[R1]`.

**(Interpretation)** Six distinct failure modes are bundled in that history. HMMT answers three and a half of them, and the half it does not answer is the one Track 0 makes more dangerous, not less.

| Petro failure mode | HMMT as designed | Verdict |
| --- | --- | --- |
| Issued by an authority nobody could hold to account | One issuer, published reserves, committee with recorded votes, external auditor with rotating mandate (`HMMT-DESIGN.md` §2, §8) | **Partially answered.** A committee is not accountability if its members are self-appointed; the design says so itself in §11 ("a legal mandate… an independent auditor… a supervisory relationship") |
| Claimed backing it could not evidence | Haircut chain, verification multipliers, unverified tiers weigh zero (`HMMT-FACT-CHECK.md` §4) | **Answered.** This is the design's strongest feature and the reason its ceiling is 189,544 and not 7.3 million |
| Imposed rather than adopted | Caps by civic level, no premine, open redemption (`HMMT-DESIGN.md` §5–6) | **Answered on paper**, untested in practice: a movement-issued token is adopted by a self-selected group by construction |
| Graft at the issuer and the supervisor | Separation of minting, valuation and audit; no mint function in the contract surface | **Partially answered.** Separation of duties constrains process, not appointment. Who appoints the auditor in Track 0? |
| Sanctioned financing | No bank partner is proposed; the design deliberately has none | **Not answered** — and out of the project's control (§4) |
| A price the state defended, then abandoned | No peg defence is proposed; the unit floats (`HMMT-DESIGN.md` §1) | **Answered**, at the cost of the unit being unattractive as money |

**The failure mode the Petro analysis does not cover, and that Track 0 creates.** **(Interpretation)** Petro was a *state* capturing a currency. A pre-transformation HMMT is a *movement* capturing one: an organisation with a political programme issues a unit whose value and rules it also administers, to people who support the programme. Every governance guard in the design assumes a separation between issuer and political authority that Track 0 cannot have. The honest name for that structure is a movement treasury with a public ledger, and the honest question is whether the project wants that name. If it does not, §7's answer — a non-transferable claim with no market — is the only design that avoids it.

---

## 3. Attack 2 — the TON dependency, itemised

The design lists three accepted risks in `HMMT-DESIGN.md` §9 (validator concentration and liveness, jetton upgrade authority, mempool privacy). A red team's job is to say what is missing from that list.

| Dependency | Why it can hurt | Present in the design? |
| --- | --- | --- |
| **Jetton admin key** | Whoever holds it can mint, freeze or reassign the jetton master. If that key is a project key, the "no token without a deposit" rule is a policy, not a property | Named, not specified: no key ceremony, no threshold, no published holder list, no procedure for what happens if the holder is coerced |
| **Contract upgrade authority** | An upgrade can change the supply rules after holders have priced them | Named in §10.3 ("any contract upgrade is the attack surface"), with no rule attached |
| **Validator liveness and censorship** | TON validators are outside national control; a transaction can be delayed or a jetton blacklisted at the platform layer | Named |
| **Bridge and custodial exposure** | Any bridge that gives HMMT an exit into other assets reintroduces a custodian, a foreign jurisdiction and a freeze surface | **Missing.** The design's exit path is about migrating chains, not about bridges |
| **Telegram itself** | A Mini App runs inside Telegram's client. Telegram can restrict, geoblock, or be removed from app stores | **Missing.** In August 2026 a worldwide App Store removal briefly blocked new iOS installs — a distribution action by a platform, unrelated to the project, that a Mini App would have felt |
| **Filtering in the target market** | Telegram has been blocked in Iran since 2018 and remains blocked per multiple 2026 sources, reached through proxies | **Missing, and decisive for the reach claim.** See §3.1 |
| **Foundation posture** | A foundation with reputational and regulatory exposure in the US and EU can be pressured to distance itself from an Iranian political project; the chain stays up, the ecosystem around it cools | **Missing** |

### 3.1 The reach claim is wrong inside Iran, and it matters

**(Fact — secondary, multiple)** Telegram is blocked in Iran at the network level, as it has been since 2018; VPN and proxy use is widespread and carries legal risk; several 2026 sources describe the block as still in force, and one measurement service records TCP resets against `telegram.org` from Iranian networks `[R2]`.

**(Interpretation)** The Mini App is therefore a **diaspora and VPN channel**, not a domestic one. That does not make it useless — the diaspora is the most plausible first holder base, and the strategy report's §6.6 names diaspora capital as the strongest narrow case — but it does make two claims false if left uncorrected:

- "Iranians will not trust an independent app" cannot be fixed by a channel most Iranians cannot open without breaking the law.
- A roadmap that counts domestic reach through Telegram will overstate its addressable users by an order of magnitude.

**(Proposal)** State the primary channel as *diaspora and VPN-capable residents*, publish the constraint in the interface, and treat domestic reach as something a Track 1 build would have to solve separately — because it would.

### 3.2 What a Mini App architecture actually requires

**(Proposal — for the eventual surface, not built here)** A Mini App is a webview inside Telegram, opened from a bot, with a web app manifest and a signed `initData` payload. The design-relevant consequences:

1. **No Telegram identifier may be stored server-side.** `initData` carries a user ID and a signature; using it as an identity anchor turns the app into a participation register that the platform and any server operator can read. The repository's threat model (TM-02, zero accounts, zero telemetry) forbids that, and this is where a Mini App quietly violates it.
2. **The repository's read-only posture is an asset in a Mini App, not a limitation.** A Mini App that only reads and computes is a demonstration; one that takes deposits is a financial service inside a platform with its own rules.
3. **The web bundle must run with the API degraded.** A Mini App in a filtered network has to render the arithmetic from a static bundle, which the current architecture already does with `fetch` disabled.
4. **The store and platform layer is part of the dependency register.** App-store policy and Telegram's own terms have changed distribution before; a build that cannot be reached outside Telegram has one distribution channel and no fallback.

---

## 4. Attack 3 — sanctions, the freeze, and the participation list

**(Fact — verified)** Digital assets became a determined sector of the Iranian economy under E.O. 13902 on 2026-08-24, effective the same day, reaching any person anywhere who "operates in" the sector `[R3]`.

**(Fact — secondary)** In 2026 roughly USD 550m of Iran-linked USDT was frozen by the issuer, including USD 344m across two addresses attributed to the Central Bank of Iran `[R4]`.

**(Fact — secondary, multiple)** In *SEC v. Telegram* the court enjoined delivery of Grams in March 2020 and the June 2020 judgment required USD 1.224bn in disgorgement (credited with amounts repaid to purchasers), a USD 18.5m penalty, a permanent Section 5 injunction, and three years of notice to the SEC before any digital-asset offering `[R5]`. The court's reasoning did not turn on the chain. It turned on the purchaser's expectation of profit and on the issuer's intention to remain the "guiding force" behind the network `[R5]`.

**Three implications that the TON decision does not touch:**

1. **The Gram precedent is about the promise, not the platform.** HMMT's governance model — one issuer, one ledger, a committee that sets parameters, a project that publishes the rules — is the "guiding force" posture in its most explicit form. Choosing TON does not change that analysis, and choosing a permissioned chain would not either. What changes it is issuing something no one can expect to profit from (§7).
2. **The activity determination is not a chain question either.** A token issued by an Iranian entity and held abroad is inside the digital-asset sector on TON, on a permissioned chain, or on paper. This is why the strategy report's Stage 0 is a gate and not a formality, and why a Track 0 build must be *nothing of value* rather than "small value".
3. **A Telegram-distributed token creates a participation list.** **(Interpretation)** The same properties that make the channel attractive — phone-number-linked accounts, an in-app wallet, a group graph — also make participation legible to anyone who can compel or buy that data. In a country whose security services have a documented interest in diaspora networks, an app that records who joined a political-economic project is a targeting aid. This is the single most serious ethical objection to the plan as stated, it is not solved by TON, and it is partly solved by issuing nothing transferable and storing no identifiers.

**(Proposal)** A published answer to four questions before any Track 0 build: what identifiers exist server-side (answer: none), what the platform can see (answer: Telegram sees the bot's traffic; say so), what a seizure of project infrastructure would reveal (answer: it must reveal nothing about participants), and what happens to participants if the project is designated (answer: nothing of theirs is at risk).

---

## 5. Attack 4 — the ceiling is not stable under FX appreciation, and the design does not say what happens

This is the sharpest technical finding in the document. It uses the repository's own arithmetic and needs no external source.

The design defines (`HMMT-DESIGN.md` §4):

```
USD value of one unit = 1e12 toman / FX rate
Ceiling (HMMT)       = net backing in USD / USD value of one unit
                     = net backing (USD) × FX / 1e12
```

With the fact-check's inputs — net backing USD 703,828,125,000 and FX 269,305 toman/USD on 2026-10-29 — the ceiling is 189,544 HMMT (`HMMT-FACT-CHECK.md` §5). Now move the exchange rate, holding the resource valuation constant:

| FX move | FX (toman/USD) | USD value of one unit | Ceiling (HMMT) | Change |
| --- | --- | --- | --- | --- |
| Base | 269,305 | 3,713,261.91 | 189,544 | — |
| Rial −30 % (depreciation) | 350,097 | 2,856,355 | 246,411 | **+30 %** |
| Rial +20 % (appreciation) | 215,444 | 4,641,578 | 151,632 | **−20 %** |

**Two consequences, one of which contradicts an invariant.**

1. **Depreciation manufactures headroom.** A 30 % fall in the rial raises the lawful token ceiling by 30 % with no new asset, no audit and no decision — and the design's own text says so ("a currency collapse mechanically raises the token ceiling"). The 30-day timelock in §4 applies to a committee *raising* the ceiling; it does not apply to arithmetic raising it. **(Proposal)** FX-driven headroom should be *published but unavailable* until the backing is revalued at the new rate and an auditor signs it. Otherwise the programme's most expansionary moments are exactly the moments nobody voted for.
2. **Appreciation breaks invariant 2.** If supply has been issued up to the ceiling and the rial appreciates 20 %, the ceiling falls to 151,632 while 189,544 is circulating — so "circulating supply never exceeds the asset-backed ceiling" becomes false through no act of any party. The design says lowering takes effect immediately ("safety should not wait"), which means the invariant is violated immediately. **(Interpretation)** The invariant is stated in a direction the mechanism cannot guarantee. This is not a rounding problem; it is a missing state.

**This is already visible in the code, and the code disagrees with itself.** `packages/domain-models/hmmt.mjs` computes the ceiling from the basket and the FX rate, and `apps/api/src/data/hmmt.mjs:96` publishes that computed value directly (`export const ceiling = computeSupplyCeiling({ basket })`). Meanwhile `packages/domain-models/test/hmmt.test.mjs` asserts — correctly — that a weaker toman *raises* the token ceiling, and its comment says the token ceiling "may only be re-stated through governance (see the timelock invariant)". There is no mechanism between those two sentences: the value the API serves is recomputed arithmetic, and the governance requirement lives in a test comment. A design that says "the committee may not raise this" while the data layer raises it with the exchange rate is not rule-bound in the way it claims.

**(Proposal) A minimal fix that does not touch the three structural rules.** Add an explicit **over-ceiling regime** to §4 and §7:

- Define `coverage = net backing ÷ (circulating × unit USD value)` and publish it daily next to the ceiling.
- If `coverage < 1`, the unit enters `under-collateralised` state: issuance stops automatically, the state and its cause are published, and a restoration plan is required within 30 days (raise backing, redeem pro rata, or restate the ceiling).
- The pre-commitment must be made *before* the first issuance, because at the moment of breach every option favours whoever holds power.
- Separate the two numbers the design currently conflates: an **arithmetic ceiling** (what the arithmetic implies at today's rate — publish it) and a **ratified ceiling** (what the committee has adopted — enforce it in `convertTomanToHmmt` capacity checks and in the API payload). The ratified value must not move when `fxRate` moves.
- A test in `packages/domain-models/test/hmmt.test.mjs` asserting the behaviour of the engine in that state, in both FX directions, at the boundary — and a second test asserting that the *ratified* ceiling is invariant to `fxRate` while the arithmetic one is not.

**Why this matters more than the chain choice.** A chain dependency degrades the project's reach. An invariant that breaks under appreciation degrades its claim to be rule-bound, which is the only thing the project has that a hundred other tokens do not.

---

## 6. Attack 5 — the cap ladder and the citizenship problem

The cap ladder is well built: caps follow civic level, observers hold nothing, participation never buys headroom, caps limit acquisition and never redemption (`HMMT-DESIGN.md` §5.1; `CAP_INVARIANTS` in `packages/domain-models/hmmt.mjs`). Four attacks survive that design.

1. **Enforcement channel versus level verification.** The design says caps are enforced "by the deposit channel, not by an on-chain profile" (`HMMT-DESIGN.md` §5). In Track 0 there is no deposit channel — there is a Telegram app and a payment rail. If levels are verified to enforce caps, the project has built a **register of political affiliation with economic consequences**, in a country where that list is the most dangerous artefact in the system. If levels are self-declared, the caps are self-enforced and the ladder is decoration.
2. **Sybil resistance.** A Telegram account is cheap; a phone number is cheap. Per-person caps with self-declared identity are per-account caps. The design's own answer in Track 1 (deposit channel) does not exist here.
3. **Level 4 is a different animal.** Organised nodes with budget-derived caps are the tier that a real programme would be captured through: an entity that can show a published budget gets 240–1,000 HMMT of headroom. Pre-legitimacy, "published budget" is an honour system.
4. **The ladder's good invariant is the wrong invariant for Track 0.** "Participation never pays" prevents the ladder becoming a loyalty programme in *price* terms. It does not prevent it becoming one in *access* terms, if higher levels see more, vote on parameters, or get earlier allocation.

**(Proposal)** For Track 0: cap at level 2 for everyone, no level verification collected, no per-person cap enforcement beyond what the payment rail already does, and a published statement that Track 0 grants no civic status of any kind. The ladder is a Track 1 instrument and should be labelled as such in the interface, not merely in the design doc.

---

## 7. Attack 6 — is a resource-backed transferable unit the right first instrument? No

**(Interpretation)** Under the constraint, the real choice is not "TON versus a sovereign chain". It is:

| Option | What it is | What it costs | What it buys |
| --- | --- | --- | --- |
| **A. Transferable token with a price** (current design) | A jetton on TON, convertible against toman, with a ceiling and a redemption queue | Every legal exposure in §4; a market price the project cannot support; a participation list worth seizing | Reach, market signal, the appearance of a currency |
| **B. Non-transferable claim, no redemption promise, no yield** | A key: it records that a person holds a verified position in the published arithmetic; it cannot be sold, transferred or redeemed for fiat; the arithmetic updates; nothing of value is at stake | Loses the "money" story and most of the excitement; the project must argue its value in coordination terms | The Gram problem largely disappears (no expected profit, no market); the freeze problem disappears (nothing to freeze); the run problem disappears (no queue); the participation list becomes much less valuable to a hostile reader |
| **C. Build nothing on-chain; publish the arithmetic, the invariants and the audit tooling** | The repository as it stands, plus Track 1 preparation | No direct constituency | All of the credibility, none of the exposure; and the strategy report's §14 recommendation |

**(Proposal)** **B for Track 0, A only in Track 1, C as the fallback if the maintainer concludes that even B's participation list is too dangerous.** B is the only option that satisfies the Track 0 gate in §1 ("nothing of value may be at risk") while keeping TON and the Mini App, because it keeps the channel and drops the promise.

**What B costs, stated honestly.** A non-transferable claim does not demonstrate monetary economics. It demonstrates governance arithmetic, evidence discipline and verification UX. If the project's purpose is to show that a token can work as money in Iran before the transformation, B does not do it — and nothing else does either, because there is no lawful issuer and no settlement asset. The argument for B is that a demonstration of rules plus a verified constituency is worth more to the post-transformation programme than a token with no law behind it, and that the second can destroy the first.

**(Interpretation) Where I would concede A.** If the maintainer's judgement is that a transferable unit is politically necessary — that the project cannot recruit without a tradeable instrument — then A is a political decision that evidence cannot settle, and the minimum conditions are: TON only, no bridge, no fiat redemption promise, no market-making, a hard supply cap below 2 % of the ceiling, an external funded audit, and the over-ceiling regime of §5 in place before the first mint.

### 7.1 The maintainer's direction: claim NFTs, verified after the transition

The direction is **B carried in an NFT**: a free, publicly readable record of a hashed assertion, whose honouring requires an institution that does not exist yet. The specification is [`PHASE-0-NFT-CLAIMS.md`](../strategy/PHASE-0-NFT-CLAIMS.md). Read against §§2–6, it is a genuine improvement and it does not escape the red team.

**What it fixes, attributed correctly.** The Gram comparison in §7 held that a unit carrying an expectation of profit is a security whatever the issuer calls it; a claim record with no price, no yield and no redemption has nothing for the expectation to attach to. The freeze exposure in §4 largely disappears because there is nothing to freeze and no stablecoin rail in the loop. The run and the queue disappear with the redemption promise. Non-transferability means a secondary market cannot form without an off-chain over-the-counter workaround, and the specification forbids marketplace integration precisely so that workaround has no venue.

**What it does not fix, in descending order of severity.**

1. **The participation list survives, and the NFT makes it more durable.** §3 called this the most serious ethical objection. A claim NFT is a permanent public artefact; a Telegram-linked mint still ties an account to a claim at the moment of minting, and the offline export mitigates the client dependency without changing the on-chain set. The specification's answer — fresh wallets, hashes only, no issuer-side table — reduces correlation but cannot remove it, because the chain remembers.
2. **"Verified after the transition" is a promise about a government that does not exist.** The specification says so before minting, which is the right place, but the sentence a holder will remember is not the one in §4. **Hypothesis:** the comprehension test in the specification (§4) will show people over-reading the NFT as a future entitlement. **Test:** run it before any contract exists. If holders cannot restate what the NFT does *not* do, the design fails ethically even if it succeeds technically.
3. **`P0-REGISTRY-KEY` is a bearer instrument** and therefore the most legally exposed object in the set. My recommendation: drop it from Phase 0, or accept that the project is issuing an unregistered bearer claim keyed to a hash and say so in the interface.
4. **A free mint is still a mint.** Network fees, wallet setup and a Telegram account are not free for a user under sanctions, and any subsidy reintroduces a treasury, which reintroduces the movement-treasury problem of §2.
5. **The tax and reporting question is untouched.** If a future market ever prices these NFTs, holders acquire a reportable asset in jurisdictions that have no idea what it is. Phase 0 cannot solve that; it can only avoid creating the price.

**Verdict (Interpretation).** The direction survives §7's test and fails none of §1's gate. It is the first version of this project's on-chain plan I would not argue against in principle. The residual objections are ethical and legal rather than economic, they are narrower than for a transferable unit, and two of the five are reasons to *narrow* Phase 0 further rather than to abandon it: drop `P0-REGISTRY-KEY`, and publish the comprehension test result before the first contract.

**What would change this verdict.** Evidence that claim records are being read as entitlements at scale; a legal analysis that recording assertions about the state is itself an offence for participants; or an engineer showing the offline verification path cannot exist without an issuer-controlled component. Any one of those turns this into a "do not build" for Phase 0 as specified.

---

## 8. What survives the red team untouched

These are not concessions; they are the parts I would defend against the project's own advocates.

1. **The three structural rules** (`HMMT_INVARIANTS`): no token without a matching deposit, supply never above the asset-backed ceiling, a gross in-situ figure never used as backing. Every recommendation in this document is compatible with them, and §5 adds a state rather than relaxing an invariant.
2. **The haircut chain and the evidence tiering.** A ceiling of 189,544 rather than 7.3 million is the single most honest number in the repository.
3. **Redemption queues rather than freezes**, and pause that cannot stop redemption — in Track 1. In Track 0, B removes the question.
4. **No on-chain identity, and the threat model that says why.**
5. **Read-only synthetic surfaces.** A prototype that cannot take a deposit cannot lose one.

---

## 9. Proposed minimal diff to `HMMT-DESIGN.md` (for review, not applied)

Nine changes. None touches the three structural rules, the cap invariants or the arithmetic.

| # | Where | Change | Why |
| --- | --- | --- | --- |
| D1 | New §0 | "Track 0 / Track 1" split with the gate *nothing of value at risk* | §1; the design currently describes one instrument with one legal status |
| D2 | §9 | Replace "chain: TON first, then a chain we control" with "TON is the chain until a ratified transition; migration is a Track 1 decision" | The maintainer's constraint, recorded as a design fact rather than an aspiration |
| D3 | §9 | Add a **dependency register** table: jetton admin key (ceremony, threshold, published holders), upgrade authority, validator liveness, bridges (none), Telegram platform, foundation posture, filtering | §3; the current list of accepted risks is three items long and omits the two that can end the project |
| D4 | §4 and §7 | Add the **over-ceiling regime**: `coverage` published daily, `under-collateralised` state, automatic issuance stop, pre-committed restoration options, 30-day plan | §5; invariant 2 is currently unenforceable in the appreciation direction |
| D5 | §4, and `apps/api/src/data/hmmt.mjs:96` | Split **arithmetic ceiling** (published, moves with FX) from **ratified ceiling** (adopted, enforced, invariant to FX). FX-driven headroom is unavailable until revalued and signed | §5; the data layer currently raises the ceiling with the exchange rate while a test comment says only governance may |
| D6 | §5.1 | Track 0: level 2 cap for everyone, no level verification collected, no civic status granted | §6; a verified ladder before legitimacy is a political register |
| D7 | §5, §7.1 | Track 0: non-transferable claim NFTs, free to mint, no RWA, no redemption for fiat, no yield, no market support — and `P0-REGISTRY-KEY` excluded unless the maintainer says otherwise | §7, §7.1 |
| D8 | §11 | Add "a participation list worth seizing" and "platform removal (App Store, Telegram policy)" to the list of things that would be required for this to be real | §4.3, §3 |
| D9 | §12, and `packages/domain-models/test/hmmt.test.mjs` | Add tests: over-ceiling in both FX directions; the ratified ceiling is invariant to `fxRate`; no mint path; cap invariants under Track 0 configuration | §5, §6 |

**Not proposed:** removing TON, adding a chain, adding a bridge, changing the ceiling arithmetic, changing the haircut chain, or adding any code.

---

## 10. What would make me withdraw an objection

| Objection | Withdraw if |
| --- | --- |
| The participation list is a targeting aid | A build with no server-side identifiers, no stored `initData`, and a published statement about what the platform sees is reviewed by someone with security standing, and none of the above is contradicted |
| Appreciation breaks invariant 2 | The over-ceiling regime is specified and tested in both directions |
| A resource-backed transferable unit is the wrong first instrument | The maintainer states the political necessity, accepts §7's minimum conditions in writing, and the first mint is bounded at 2 % of the ceiling |
| Telegram reach is overstated | The interface states the diaspora-and-VPN channel honestly, and domestic reach is not claimed |
| The Gram posture applies | The instrument is a non-transferable claim NFT with no expectation of profit — §7 B, now specified in `PHASE-0-NFT-CLAIMS.md` |

---

## 11. Self-critique of this red team

1. **I have not modelled the queue.** §5 shows the ceiling breaking and shows that the API serves a recomputed ceiling while a test comment says governance must ratify it; I have not simulated what holders do in the `under-collateralised` state. The repository's engine could, and should, before anyone relies on this analysis.
2. **The Telegram reach claim rests on secondary sources.** I found no primary Iranian regulator document, and none would be published. The measurement-service evidence is thin (confidence 0.24 in the source itself).
3. **The "participation list" objection is a judgement about risk, not a measurement.** It is the strongest ethical objection I make and the least evidenced. Someone who knows the Iranian security landscape should overrule me if they think it is overstated.
4. **I have not costed B.** A non-transferable claim is cheap to build but may be worthless politically; I have asserted the trade-off rather than tested it. §7.1 makes this worse, not better: I have assessed the NFT direction on paper and have run no comprehension test, no legal review and no contract review.
5. **The Gram precedent is US law.** Its reasoning is persuasive elsewhere, not binding, and a project with no US nexus may discount it. I think that discount is a mistake for a project that wants diaspora participation, and I cannot prove it.

---

## 12. Sources

| ID | Source | Date | Type | Supports | Limitation |
| --- | --- | --- | --- | --- | --- |
| R1 | Reporting on the Petro's shutdown (Reuters-derived; AFP), January 2024, plus the encyclopaedic summary of the 2018 launch | 2024-01 | Secondary, consistent | The six failure modes in §2 | Venezuelan primary instruments not retrieved |
| R2 | Multiple 2026 sources on Telegram's accessibility in Iran, including a measurement service recording TCP resets from Iranian networks | 2026-05 → 2026-11 | Secondary, multiple | Telegram blocked since 2018 and still blocked; VPN use widespread and legally risky | No primary regulator document; the measurement source itself reports low confidence |
| R3 | U.S. Treasury, OFAC, *Iran Sanctions* programme page, retrieved 2026-11-06 | live | Primary | The 2026-08-24 five-sector determination | A listing page |
| R4 | Reporting on the 2026 Tether freezes (USD 344m April, USD 131m July, ~USD 550m for the year) | 2026-04 → 2026-11 | Secondary, multiple | The issuer kill switch | Issuer's own statements not retrieved |
| R5 | *SEC v. Telegram Group Inc.*, No. 19-cv-9439 (S.D.N.Y.): preliminary injunction 2020-03-24, final judgment 2020-06; SEC press release 2020-146 | 2020 | Secondary, multiple, quoting the judgment | Disgorgement, penalty, notice obligation, and the "guiding force" reasoning | Judgment text not retrieved from the court; the SEC release was cited by the sources, not opened |
| R6 | App-store removal of Telegram, August 2026 | 2026-08 | Secondary | Platform-level distribution risk for a Mini-App-only build | One report |
| R7 | This repository: `HMMT-DESIGN.md`, `HMMT-FACT-CHECK.md`, `packages/domain-models/hmmt.mjs`, `docs/security/THREAT-MODEL-AND-AUDIT.md` | 2026 | Internal design | The arithmetic in §5 and the invariants in §6 | A design; no token exists |
| R8 | [TOKENIZATION-TRANSITION-STRATEGY.md](TOKENIZATION-TRANSITION-STRATEGY.md) (PR A) | 2026-11-06 | Internal research | The sanctions, settlement-asset and precedent findings this document assumes | Its limitations carry over |
