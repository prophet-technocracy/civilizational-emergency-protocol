# HMMT: design of a transparent toman-denominated unit

**Status: design proposal.** HMMT («هزار میلیارد تومان») is not legal tender, not
a deposit, not a security, and not authorised by any governmental body. No token
exists on any chain. The screens and endpoints in this repository are a
synthetic, read-only demonstration of the arithmetic and the controls.

Companion documents:

- `HMMT-FACT-CHECK.md` — every figure, its source, its date, its status, and the
  arithmetic that turns a 27.3 tn headline into a 189,544 HMMT ceiling.
- `packages/domain-models/hmmt.mjs` — the engine; `test/hmmt.test.mjs` asserts it.
- `apps/api/src/data/hmmt.mjs` — the synthetic ledger and the API views.
- `apps/web/src/modules/Bank.jsx` — the `#/bank` screen.

---

## 1. Why the unit is denominated in toman

People price bread, rent and dowries in toman. A unit defined as *one thousand
billion toman* keeps the mental model intact: the number on the note changes
scale, not meaning. Dollars were rejected as the anchor for a practical reason:
the rial's dollar rate moved roughly 25 % in the year covered by the sources in
the fact-check, so a dollar-denominated unit would reprice every debt in the
country on its own.

The trade-off is accepted openly: **the unit's dollar value floats**, and the
supply ceiling therefore has to be restated whenever the exchange rate moves
materially. §5 handles that as a governance event, not as an automatic
adjustment.

---

## 2. The institution: one bank, one ledger, published everything

The design assumes a *single* issuer, not a market of issuers:

| Function | Who | What is published |
|---|---|---|
| Issuance and redemption | The national bank's treasury desk | every deposit and redemption, with amounts and timestamps |
| Reserve custody | A separate custody function, not the desk that issues | daily reserve statement signed by both |
| Asset registry and valuation | An independent valuation office | each asset, each haircut, each method |
| Audit | An external auditor with a rotating mandate | quarterly report plus the proof-of-reserve root |
| Rule changes | A monetary committee under the governance rules in §8 | proposal, dissent, vote record, effective date |

Three separations are structural, not advisory:

1. **The desk that mints does not hold the keys to the reserve.** Minting is an
   entry against a confirmed deposit; a second signature is required for every
   issuance batch.
2. **The office that values assets does not set the haircuts.** Valuation
   produces evidence; the committee sets parameters; the auditor checks both.
3. **The auditor is not paid by the desk it audits.** Budget comes from the
   governance body, published annually.

"One bank" is also a concentration risk: a single issuer is a single point of
failure and a single political target. The design mitigates it with published
reserves and open redemption rather than with competition, because competing
issuers of the same unit is precisely how a peg breaks.

---

## 3. Three structural rules

Everything else is a parameter. These three are not (`HMMT_INVARIANTS`):

1. **No token without a matching toman deposit.** No premine, no pre-sale, no
   airdrop, no grant, no treasury allocation. Minting is a balance-sheet
   exchange: toman in, token out.
2. **Circulating supply never exceeds the asset-backed ceiling.** The ceiling is
   computed from audited net backing (§4); it is not a target, not a promise and
   not a number chosen for presentation.
3. **A gross in-situ figure is never used as backing.** Every asset passes the
   haircut chain, and a tier whose status is `unverified-estimate` contributes
   exactly zero, whatever its size.

The invariants that follow from these are shown on the screen and asserted in
the tests, including: GDP and private wealth are not backing; emergency pause
stops new issuance only; redemption queues rather than freezing; no identity
data is written on-chain; the exit path from the first chain is published before
launch.

---

## 4. Supply: ceiling, tiers and haircuts

```
USD value of one unit = 1e12 toman ÷ FX rate
Ceiling (HMMT)        = net backing in USD ÷ USD value of one unit
```

Net backing is the sum over tiers of `gross × Π(factors) × verification multiplier`:

| Tier | Content | Status | Multiplier |
|---|---|---|---|
| T1 | Accessible liquid reserves | unverified-estimate | ×0 (modelled at USD 15 bn) |
| T2 | Marketable state assets (incl. real estate) | unverified-estimate | ×0 (modelled at USD 120 bn) |
| T3 | In-situ resources (oil, gas, minerals) | source-reported | ×0.5 on top of four policy steps |

Only T3 is counted today, and it survives at 2.58 % of its headline: **USD 703.8
bn → 189,544 HMMT**. If the tier is ever audited the multiplier rises to ×1 and
the ceiling doubles; if a source is withdrawn the ceiling falls. The chain is
therefore a live statement about evidence quality, not a fixed discount.

**Ceiling asymmetry.** Lowering the ceiling takes effect immediately — safety
should not wait. Raising it requires a supermajority of the monetary committee
and a 30-day timelock during which the proposal, its evidence and its dissent
are public. A currency collapse mechanically raises the token ceiling (see
fact-check §4); this rule is what prevents that from becoming a discretionary
expansion.

---

## 5. Issuance and redemption

**Issuance (convert).** A person or institution deposits toman at a participating
branch or treasury window. On settlement, tokens are minted net of a 20 bps fee
(charged in tokens, so the matching toman stays in reserve as operating
revenue). Rules:

- The amount must fit the remaining ceiling capacity; otherwise the request is
  refused with the capacity stated and moves to the next window, pro-rated.
- A per-person cap (0.05 HMMT = 50 bn toman in the demo) keeps distribution
  dispersed without collecting identity data: the cap is enforced by the
  deposit channel, not by an on-chain profile.
- Pending deposits mint nothing. Only settled deposits count.

**Redemption (redeem).** A holder returns tokens; the bank burns them and pays
toman net of a 20 bps fee. Two limits can delay payment, and neither is a
refusal:

- **the reserve**: if the toman is not there, the request queues;
- **the daily cash window**: liquidity management on top of a healthy reserve.

A queued request is paid in timestamp order and its funds are earmarked. An
emergency pause can stop *new issuance*; it cannot stop redemption. That
asymmetry is the whole point: a holder must always be able to leave.

---

## 6. Distribution in phases

No premine means distribution starts at zero and grows through gates:

| Phase | Cumulative ceiling | Gate |
|---|---|---|
| P0 pilot | 2 % (3,791 HMMT) | independent contract review + two proof-of-reserve reports |
| P1 | 10 % (18,954) | one full quarter of backing audits + a healthy redemption queue |
| P2 | 35 % (66,340) | reserve ratio held for three months + independent review |
| P3 general | 100 % (189,544) | a clear legal mandate + an adopted governance mechanism |

The phases cap *how much of the ceiling may be used*, never how much a person
may hold beyond the per-person cap. P3 is not reachable without a legal mandate,
which is stated in the gate rather than assumed.

---

## 7. Proof of reserve: two questions, one root

Two ratios that are routinely conflated:

- **`reserveRatio`** = toman reserve ÷ (circulating tokens × 1e12). Must be ≥ 1.
  It answers: *can today's holders be paid today?*
- **`assetCoverage`** = net backing ÷ ceiling. Must be ≥ 1. It answers: *is the
  ceiling honest?*

The published artefact is a **hash root** over (a) the reserve statement and
(b) the ledger holdings, published on a fixed cadence. What it deliberately does
**not** contain: names, addresses, account balances, or any per-person data. A
holder can verify their own inclusion against the root without the bank
publishing who they are. Proof of reserve is not proof of solvency in general,
and it is not a claim that the assets are liquid at the stated value — the
haircut table is the disclosure that keeps that distinction visible.

---

## 8. Governance

- The monetary committee sets haircut factors, the reserve ratio floor, the cash
  window and the per-person cap. All are labelled `proposed-configurable` until
  adopted by a recorded decision (`DEC-SYN-0041` in the demo).
- Raising the ceiling: supermajority + 30-day timelock. Lowering: immediate.
- Pause: time-boxed, must state a reason, only stops issuance, must be renewed
  in public, and is logged with the person and role who invoked it.
- Conflict of interest: a member with holdings above the per-person cap, or any
  relationship with a custodian or valuer, recuses from the relevant votes.
- Every parameter change publishes the old value, the new value, the reason and
  the dissent.

There is no mechanism by which the committee can create tokens for itself. That
is not a policy — it is the absence of a function in the contract surface.

---

## 9. Chain: TON first, then a chain we control

**Stage 1 — TON Jetton (TEP-74).** Chosen for public verifiability and low
transaction cost: a jetton contract is inspectable by anyone, and a retail
holder needs no new wallet software. Risks accepted in this stage:

- validator concentration and network-level liveness are outside our control;
- jetton upgrade authority sits with a key we must govern carefully;
- mempool visibility reveals timing, and timing plus branch deposits is a
  privacy leak that must be modelled before launch, not after.

**Stage 2 — a permissioned sovereign chain.** Migration is not a plan, it is a
set of published exit criteria, all three of which must hold before the move:

1. the proof-of-reserve root is published on **both** chains for the entire
   overlap period;
2. a holder can exit unilaterally — no host permission, no migration window that
   can be closed early;
3. contract code and tests are independently reviewed, with the review published
   alongside the code.

Until all three hold, stage 1 is the system. "We will migrate later" is not a
security property.

---

## 10. Threat model (what breaks it, in order of likelihood)

1. **A fake or double-counted asset.** The haircut chain cannot verify title. The
   mitigation is a registry with independent valuation, and until it exists the
   tier weighs zero — which is why the ceiling is 189k rather than 7.3 m.
2. **A bank run that the cash window cannot meter.** Queuing is fair but it is
   still a queue; the disclosure that matters is the reserve statement, published
   daily, not the promise that runs cannot happen.
3. **Insider minting.** Prevented only by the absence of a mint path plus two
   signatures plus a published ledger. Any contract upgrade is the attack surface.
4. **FX manipulation.** The ceiling depends on the free-market rate; a manipulated
   rate changes the token ceiling. The timelock makes this slow rather than free.
5. **Privacy leakage through timing and amounts.** On-chain amounts plus deposit
   timing can re-identify people in small branches. No identity is written
   on-chain, but correlation is not prevented by that sentence alone.
6. **Sanctions and correspondent access.** A transparent national ledger is easy
   to observe and easy to target. This is a political risk that no design detail
   removes.
7. **Governance capture.** The committee that can lower the ceiling can also
   refuse to raise it. Asymmetry protects holders from dilution; it does not
   protect the treasury from paralysis.

---

## 11. What would be required for this to be real

Not a longer design document. In order: a legal mandate defining the issuer and
the redemption obligation; custody with audited controls; an asset registry with
title checks; an independent auditor under a multi-year mandate; deposit
insurance or an explicit statement that none exists; a supervisory relationship
with the central bank; and a published incident-response plan. Until each exists,
the honest status of HMMT is the one printed on the screen: a design proposal.

---

## 12. Where the code is

| Path | What it holds |
|---|---|
| `packages/domain-models/hmmt.mjs` | definition, reference data, tiers, haircut policy, basket, ceiling, convert, redeem, proof of reserve, phases, invariants |
| `packages/domain-models/test/hmmt.test.mjs` | 22 tests on the arithmetic, the refusals and the disclosure rules |
| `apps/api/src/data/hmmt.mjs` | synthetic ledger, supply/backing/reserve views, simulator |
| `apps/api/src/server.mjs` | `/api/v1/hmmt`, `/supply`, `/backing`, `/reserve`, `/ledger`, `/simulate` |
| `apps/web/src/modules/Bank.jsx` | `#/bank`: ceiling vs circulating, haircut chain, proof of reserve, simulator, ledger, phases, architecture |
| `apps/web/src/locales/{fa,en}/bank.js` | the copy, 164 keys per locale |
