# Phase 0: claim NFTs before legitimacy

**Task:** CEP-T016, track 0 (pre-legitimacy). **Status:** specification draft, **N1–N6 decided by the maintainer on 2026-11-06** (§11). Still no contract, no key, no deployment. **Date:** 2026-11-06.
**Relationship to the rest of the programme:** supersedes the "arithmetic with nothing transferable" framing of §8.5 in [`TOKENIZATION-TRANSITION-STRATEGY.md`](../economics/TOKENIZATION-TRANSITION-STRATEGY.md) for the Phase-0 instrument only. It changes no HMMT rule, no cap ladder, and no structural invariant.
**AI disclosure:** drafted by an AI agent from the maintainer's standing direction and from public TON documentation. No contract has been deployed, no wallet exists, no key is held anywhere in this repository, and nothing here has been reviewed by a lawyer.

> **Standing direction this document implements, 2026-11-06.** Phase 0 happens *before* a regime change. It issues no RWA, mints no liquidity, promises no redemption, and puts no asset of any kind behind the instrument. What it issues is an **NFT whose backing can only be verified after the transition**. The instrument is a claim *record*, not a claim *on* something. This document turns that direction into something an engineer can build and a critic can attack.

---

## 1. The one-sentence design

**A Phase-0 NFT is a free, publicly verifiable receipt that a named claim was recorded on a date, whose verification key a future legitimate registry can check and whose contents nobody — including the issuer — can convert into money before that registry exists.**

That sentence contains five commitments, and each one is falsifiable:

| # | Commitment | What breaks it |
| --- | --- | --- |
| 1 | **Free** — minting costs the holder nothing beyond network fees | Any price, deposit, donation floor or "membership tier" attached to minting |
| 2 | **Publicly verifiable** — anyone can read the claim's existence and hash | Metadata held only in a database the issuer controls |
| 3 | **Named claim, dated** — the NFT points at a specific assertion and a timestamp | Vague "membership" tokens that mean whatever the issuer says later |
| 4 | **Verification deferred** — honouring the claim requires an institution that does not yet exist | Any redemption path today, however informal |
| 5 | **No conversion** — no sale, no swap, no market, no cash-out, no yield | A secondary market forming at a non-zero price, whatever the issuer intended |

Commitment 5 is the hard one, and §6 is about it.

**Label:** everything above is a **Proposal**. The technical statements about TON are **Fact (secondary)** where cited to TON documentation, which this repository has not tested against a live network.

---

## 2. What the NFT is, precisely

### 2.1 The claim record

Each Phase-0 NFT is a TEP-62 NFT on TON whose metadata is a **claim record** with these fields and no others:

| Field | Content | Why it is there |
| --- | --- | --- |
| `claimClass` | One of a closed, versioned set (see §2.3) | Stops the meaning of a token drifting after mint |
| `claimHash` | `sha256` of the canonical claim document | The only thing that has to survive to the far side of a transition |
| `claimUri` | Content-addressed location of the claim document (or "withheld", see §5) | Makes the claim auditable without publishing identity |
| `recordedAt` | Unix time, set by the contract | A timestamp the issuer cannot backdate afterwards |
| `specVersion` | e.g. `cep-phase0/1` | Lets a future verifier know which rules applied |
| `saltCommitment` | `sha256(salt)` supplied by the holder | Lets the holder later prove ownership of the underlying claim without ever having published it |
| `supersedes` | Optional previous NFT id | Withdrawal is a new record, never a deletion |

**Deliberately absent:** any name, national identifier, address, phone number, Telegram handle, asset reference, valuation, expected return, or jurisdiction of the holder. §5 explains why each of those is a liability rather than a feature.

### 2.2 The claim document

The document the hash commits to is a short, machine-readable statement of the form *"the holder asserts X, as of date D, under the rules of specification version V"*. It is written by the holder, held by the holder, and **never uploaded by the protocol**. The NFT stores a hash of it; the holder can produce the document later and any verifier can check that the hash matches.

**Interpretation.** This is the whole trick, and it is not a new one: commitment schemes separate *proof that something was recorded* from *disclosure of what was recorded*. A registry that stores only hashes cannot leak what it does not have. The cost is that a claim whose document is lost is unverifiable — which is why §4 defines the recovery procedure rather than pretending it will not happen.

### 2.3 The closed set of claim classes

Open-ended token types are how a recording instrument becomes a promise. Phase 0 admits exactly four classes, each of which must be defensible as *"a record, not a right"*:

| Class | The claim | Verify-after-transition means |
| --- | --- | --- |
| `P0-RECORD` | "I recorded this statement on this date." | Nothing is owed. The record is evidence of participation, nothing more. |
| `P0-CONTRIB` | "I contributed work of this description to the public record, and here is the hash of the work." | A future body may choose to recognise the contribution; the NFT creates no entitlement to that recognition. |
| `P0-HARM` | "I assert a harm, with the evidence hashed and held by me." | A future truth or restitution process may use it as a filing; the NFT is not a filing and does not start a clock. |
| `P0-REGISTRY-KEY` | "This key will be presented to a future registry to claim the underlying record." | The only class with a defined mechanical use, and it is a *key*, not a balance. |

**Decided (N1, 2026-11-06): the four classes above are authorised as written.**

A fifth class is proposed and **not** admitted: `P0-ASSET-INTENT` — a statement of intent to register an asset after the transition. It is excluded because a hash pointing at an asset starts to look like a claim *on* the asset, which is exactly the RWA that Phase 0 forbids. It should not be admitted until a lawyer can say what it is. N1 authorised the four-class set; adding a class is a separate decision, not an exercise of the same one.

---

## 3. Why not an RWA, in one page

**(Fact — verified, from the companion report)** The sanctions architecture is activity-based: on 2026-08-24 OFAC designated the digital-asset sector of the Iranian economy under E.O. 13902, so "operating in" it is itself designatable. A Phase-0 instrument that tokenised a real asset would therefore be an operating presence in exactly the sector named — before any legitimate issuer exists to obtain a licence.

**(Fact — verified)** Issuers of the settlement assets freeze addresses: roughly USD 550m of Iran-linked USDT was frozen during 2026, including USD 344m attributed to the central bank. An RWA token on a public chain inherits that kill switch, because the token's liquidity depends on the stablecoin rails around it.

**(Interpretation)** Beyond sanctions, an RWA needs four things Phase 0 does not have: a legally identified owner, an enforceable transfer mechanism, a valuation that a court would accept, and a registry that says who holds what. The NFT design keeps only the fourth — and keeps it as a *hash* rather than a register. That is not a weaker version of an RWA; it is a different object, and pretending otherwise is how a civic project ends up issuing unregistered securities.

**(Proposal)** Phase 0 therefore holds a hard line: **no reference to an asset, no valuation, no yield, no redemption.** The NFT's only claim is about the existence of a record.

---

## 4. Deferred verification: what happens on the far side

The design is only honest if it says what a future, legitimate institution would have to do to make an NFT mean anything:

1. **Recognise the specification.** A ratified body adopts `cep-phase0/1` (or a successor) as a recognised evidence format — a statute, a regulation, or a truth-commission rule. Without this step the NFT is a souvenir, and saying so is the point.
2. **Run a registry.** A public registrar accepts a claim document plus its salt, checks `sha256(document) == claimHash` and `sha256(salt) == saltCommitment`, and records the *result* in a legal register.
3. **Decide honour, not entitlement.** Recognition of `P0-CONTRIB` or `P0-HARM` is a political and judicial decision. The NFT supplies evidence; it does not supply a right, and no wording in this specification may be read to create one.
4. **Publish the mapping.** The registrar publishes which claim classes it recognises, with what evidentiary weight, and how a holder contests a refusal.

**Hypothesis (testable).** If the four steps are specified in advance and published, a holder can evaluate the NFT's future value *before* minting, because that value is entirely a function of a rule set they can read. **Test:** present the specification to a sample of prospective holders and check whether they can predict, correctly, what a future registry would and would not do with each class. If they cannot, the specification is not doing its job.

**Failure that must be stated plainly:** if the transition does not happen, or happens and the new institutions decline to recognise the format, **nothing is honoured and the NFT is worth nothing**. There is no fallback, no escrow, no treasury, and no promise. A holder who cannot accept that should not mint.

---

## 5. The surveillance problem, and the mitigations that survive it

A public registry of people who recorded claims about a regime is a list of people. The mitigations are structural, not cosmetic, and each has a cost:

| Threat | Mitigation in this specification | The cost |
| --- | --- | --- |
| On-chain identity exposure | Only `claimHash`, `saltCommitment` and class are public; the wallet is not linked to a name by the protocol | The holder must keep their own document and salt; a lost salt is unrecoverable |
| Correlation across claims | Each claim uses a fresh TON wallet; the spec forbids any issuer-side table linking wallets | The issuer cannot help a holder prove continuity of participation; only the holder's own record can |
| Issuer-side aggregation | The mint contract has no admin function that enumerates holders; indexers are public and permissionless | Abuse response becomes slow: the issuer cannot retroactively blacklist a wallet |
| Client-side surveillance (Telegram, network) | Verification is designed to work **offline**: a signed claim document plus the published contract address, checkable without the Mini App | The Mini App remains the easiest path, so the easiest path is the surveilled one. This is stated in the interface, not hidden |
| Volume analysis | Minting is batched in fixed-size epochs, so a mint does not broadcast a moment of personal significance | An epoch delay before the NFT appears |

**(Interpretation)** None of this makes the system safe. It makes the *protocol* not the leak, and leaves the client, the network and the holder's own device as the remaining leak paths. The interface must say that once, clearly, and not repeat it until it becomes wallpaper.

### 5.1 The one number that may be published (N4)

**Decided (N4, 2026-11-06): aggregate totals only — one number, no per-person data, no breakdowns, no growth charts.**

What that permits, exactly:

- **Permitted:** a single total count of claim NFTs minted, refreshed at most daily, published with the epoch it covers. Nothing else.
- **Forbidden:** counts by class, by region, by date finer than the epoch, by language or by wallet age; per-claim tracing; a time series published as a chart; any figure that changes fast enough to read as momentum; any list, even of hashes, presented as "holders".
- **Why the line is there.** A total that moves slowly is a scale claim. A total that moves daily is a growth chart, and a growth chart is a campaign. A breakdown by region is a map of risk for the people in those regions.
- **The floor.** Below 200 mints the count is published as "fewer than 200", never as a number. An aggregate of a small set is a shortlist.

**The cost of admitting this at all, stated.** The total is also the number a hostile reader uses to size the set. I argued for publishing nothing; the maintainer's version is narrower than I feared — one number, no segmentation, no cadence — but the residual risk is that a permitted aggregate becomes the thin end of a reporting habit. The specification therefore fixes the *shape* of the number rather than the principle behind it, so widening it later requires an explicit decision rather than a design choice made in a pull request.


---

## 6. Transferability: no

The maintainer's direction is an NFT, and NFTs are conventionally transferable. This specification is **non-transferable** — decided, N2 — and gives the reason, because a transferable Phase-0 token with no legal character is the single cheapest way to manufacture a security:

- **Decided (N2, 2026-11-06): non-transferable, with a pre-committed successor key.** The contract rejects a transfer to any address other than the holder's successor, set once at mint. Recovery from key loss is by that successor, not by sale.
- **Why.** A market price on a claim record converts "a record of participation" into "a priced expectation of future recognition". That is a security in most jurisdictions, issued by nobody with a licence, before any transition. The 2023 Petro lesson was not that resource tokens fail; it was that an instrument priced by its issuer's promises fails *and* discredits the institution around it.
- **The cost, stated.** Non-transferable means no exit, no gift, no inheritance except via the successor key, and no way to compensate a holder who moves jurisdictions. It also means a holder who loses both keys loses the claim permanently.
- **What would change this.** A ratified legal opinion that a transferable record-claim is not a security in the relevant jurisdictions, **and** an exchange or registrar willing to list it under supervision, **and** a decision by the maintainer that the resulting market is acceptable. That is a Phase-1 conversation, not a Phase-0 one.

**(Interpretation)** The red team's earlier recommendation — "publish an arithmetic, keep nothing transferable" — and this specification converge on the same output for opposite reasons: the red team wanted nothing of value at risk, the direction wants a claim record. Non-transferability is where both arguments land, so it should be adopted on the overlap rather than on either argument alone.

---

## 7. Freeze resistance, honestly

Asset freezing is not hypothetical; the direction acknowledges it as likely. The design assumption is therefore that **the front end will be blocked and the chain may be pressured**, and the spec is written so that verification degrades rather than disappears.

| Component | Can it be frozen? | Design response |
| --- | --- | --- |
| The TON smart contract | Not by the issuer; a TON validator set could in principle censor, and that is a risk to state, not to deny | Claims are also published as a Merkle root in the repository and in printed form, so the *set* survives independent of the chain |
| Telegram bot / Mini App | Yes — Telegram can remove a bot, and the app is blocked in Iran since 2018 | The app is a convenience, never the record. Spec §7.3 requires an offline verification path |
| The issuer's keys | Compromise possible | The contract has no mint authority after the epoch closes; a compromised key cannot issue retroactive claims |
| The holder's wallet | Yes, if the wallet is custodial | Only non-custodial wallets are supported; the app never holds a key |
| The claim documents | Yes, if they live on one host | Documents are held by the holder; the protocol stores hashes only |

**§7.3 Offline verification path (Proposal — N6: mandatory before any other feature).** A claim is verifiable by a third party using only: (a) the claim document, (b) the salt, (c) the published contract address and epoch Merkle root, and (d) any `sha256` implementation. No network, no app, no issuer. The Mini App must be able to *export* this bundle, and the export must be the primary button, not a hidden menu item.

**(Interpretation)** This is the strongest part of the design and the part most likely to be dropped under delivery pressure. Dropping it would leave a project whose entire value is verifiability, dependent on a blocked client.

---

## 8. Threat model

| Actor | Capability | What they can do | Residual risk after this spec |
| --- | --- | --- | --- |
| The issuer (us) | Mint per the closed classes, publish roots, no enumeration | Mis-describe the claim classes, overstate future honour | Cannot freeze, cannot re-price, cannot delete a claim; wording is the exposure |
| A hostile state | Block clients, pressure validators, seize devices | Break delivery, not the record | Holder-side device seizure remains; mitigated only by salt secrecy |
| A future government | Refuse recognition | Make every NFT worthless | Real and unresolvable here — this is why §4 says so before minting |
| A third-party indexer | Reconstruct the public set | Publish holder graphs | Unavoidable on a public chain; mitigated by fresh wallets and hashes |
| A speculator | Buy wallets pre-loaded with NFTs | Manufacture a price where none should exist | Non-transferable default; no marketplace integration; no price display |
| A sybil participant | Mint many claims from many wallets | Inflate apparent participation | Participation numbers are never published as a metric, precisely so that sybil resistance does not need to be solved |

---

## 9. What this specification deliberately does not include

- **No contract code, no deployment, no key.** Building it requires the maintainer's explicit instruction and a security review; this repository holds no key material and must not.
- **No legal opinion.** Whether a non-transferable claim record is a regulated crypto-asset in Iran, the EU, the UK or anywhere else is unverified here. The classes are drafted to be as boring as possible; that is not the same as being lawful.
- **No promise of recognition.** §4 step 3 is a decision for a future institution with standing, and the specification says so in the interface text a holder sees before minting.
- **No participation metrics beyond the single aggregate of §5.1, no leaderboard, no referral scheme.** Each of those converts a record into a campaign, and a campaign into a liability.
- **No active use of `P0-REGISTRY-KEY` (N3).** The class is defined and mintable, but the claiming path opens only in Track 1, against a registry that a ratified body has actually constituted. Until then the key is a receipt, not an instrument.
- **No link from Phase 0 to HMMT.** HMMT's three structural rules and cap ladder are untouched. A Phase-0 NFT is not a pre-mine, not an allocation, not a discount and not a whitelist for any future issuance; if HMMT is ever issued, its Phase-0 records confer no priority.

---

## 10. Self-critique, and what would change this design

- **The strongest argument against Phase 0 at all:** it asks people to record claims about a repressive state, in a system run by an unaccountable civic project, in exchange for something that may never be honoured. That is a request with asymmetric downside for the participant and asymmetric upside for the project's legitimacy. **What would change my mind:** evidence that prospective holders understand the asymmetry, measured, not assumed (§4 hypothesis).
- **The strongest technical objection:** non-transferable NFTs with pre-committed successor keys are poorly supported on TON tooling, and the "no admin function" requirement conflicts with the recovery flow. This needs an engineer's review before anyone writes a contract.
- **The strongest legal objection:** a class named `P0-REGISTRY-KEY` is functionally a bearer instrument, and bearer instruments are the most heavily regulated object in the set. **Decision (N3): kept, but inactive until Track 1.** That removes the "instrument with no lawful registry" problem and leaves the smaller one: a defined-but-dormant class is still a published design for a bearer claim, and the specification should be read by a lawyer before it is implemented rather than after.
- **What would make me recommend abandoning Phase 0:** a legal analysis holding that recording claims about the state for later adjudication is itself an offence for participants; or a security review finding that the offline path cannot be built without an issuer-controlled component; or the maintainer concluding that the constituency-building benefit does not justify asking people to bear the risk.

---

## 11. Decisions, as taken

**All six decided by the maintainer on 2026-11-06. They bind the specification; changing one is a new decision, not an implementation detail.**

| # | Question | Decision | Consequence written into the spec |
| --- | --- | --- | --- |
| N1 | Claim classes | **The four as written** (`P0-RECORD`, `P0-CONTRIB`, `P0-HARM`, `P0-REGISTRY-KEY`) | §2.3; `P0-ASSET-INTENT` remains excluded and is not implied by this decision |
| N2 | Transferability | **Non-transferable, with a pre-committed successor key** | §6; no marketplace integration, ever, in Phase 0 |
| N3 | `P0-REGISTRY-KEY` | **In scope, inactive until Track 1** | §9; the claiming path opens only against a ratified registry |
| N4 | Participation metrics | **Aggregate totals only** — one number, no breakdowns, no cadence faster than daily, floor of 200 | §5.1; widening this needs an explicit decision |
| N5 | Mint fees | **Holder pays, no subsidy** | §7; no treasury exists, and none may be created to fund mints |
| N6 | Offline export | **Mandatory before any other feature** | §7.3; no mint ships ahead of it |

**What is still open for the maintainer, and is not covered by N1–N6:** whether to authorise a contract at all (no code exists), who conducts the security review, and the comprehension test of §4 — which should run before the first contract, not after.

**Not done yet:** no contract, no test vectors against a live TON node, no legal review, no user research, no threat-model sign-off. This is a specification to be attacked, not a plan to be executed.
