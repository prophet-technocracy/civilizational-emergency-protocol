# HMMT fact-check: what the numbers are, and what they are not

**Status: design note. Nothing in this file is a claim about a live currency.**
Every figure below is labelled with its source, its date and its epistemic
status. The machine-readable copy lives in `packages/domain-models/hmmt.mjs`
(`REFERENCE_DATA`, `ASSET_TIERS`, `HAIRCUT_POLICY`); the arithmetic there is
asserted by `packages/domain-models/test/hmmt.test.mjs`.

The unit: **1 HMMT = 1,000,000,000,000 toman** («هزار میلیارد تومان»). That is a
definition, not an estimate, and it is the only number on this page that needs
no source.

---

## 1. The question, stated exactly

> "Estimate the whole economic value of Iran (probably 20–30 trillion dollars)
> and convert it to HMMT to set the total supply."

The guess of 20–30 trillion dollars is traceable to one prominent official
figure, and it is a **gross in-situ resource valuation**, not "the whole
economy". Four different quantities get confused in that sentence, and they
have four different answers:

| Quantity asked for | What it actually is | Figure used | Status |
|---|---|---|---|
| "Value of Iran" (popular) | Gross in-situ natural + mineral wealth | **USD 27.3 tn** | source-reported |
| Economic output | Nominal GDP, annual flow | **USD 371.1 bn** (2025) | source-reported |
| Household wealth | Private net worth | **USD 3 tn** | source-reported |
| Public assets available to back a token | Liquid reserves + marketable state assets | **no credible public figure** | unverified |

The 27.3 tn figure is the source of the user's 20–30 tn guess, and it is the
only figure in the same order of magnitude. It is also the one figure that
**must not** be used as backing. Sections 3 and 4 show why, in arithmetic.

---

## 2. Source register

Each row is reproduced in `REFERENCE_DATA.sources` with a bilingual note.

| Id | Figure | Value used | Source | Date | Status |
|---|---|---|---|---|---|
| `SRC-FX` | Free-market USD rate | 269,305 toman/USD | Market trackers (e.g. dolarchand, Middle East Monitor reporting) | 2026-10-29 | source-reported |
| — | Official USD rate | 173,661 toman/USD | Central bank published rate, same day | 2026-10-29 | source-reported |
| `SRC-GDP` | Nominal GDP | USD 371.1 bn | IMF / World Bank WDI, as compiled by Global Economy Intel | 2025 | source-reported |
| `SRC-RESOURCES` | Natural and mineral wealth | USD 27.3 tn | Official Iranian estimate (Iranian Geological Survey), reported by IRNA/ANA | 2025 | source-reported, **gross in-situ** |
| `SRC-OIL` | Proven oil reserves | 208.6 bn barrels | OPEC Annual Statistical Bulletin 2025 (end-2024 data) | 2025 | source-reported |
| — | Proven gas reserves | 34 tcm | Same | 2025 | source-reported |
| `SRC-WEALTH` | Private household wealth | USD 3 tn | UBS Global Wealth Report 2025 | 2025 | source-reported |
| `SRC-RESERVES` | Accessible central-bank FX reserves | modelled at USD 15 bn | none: no credible public figure | 2026 | **unverified-estimate, weight 0** |

Two honest observations about the register itself:

1. **The rial moves faster than any annual statistic.** One IMF vintage put 2025
   nominal GDP at USD 341 bn and another at USD 371.1 bn — a USD 30 bn swing
   with no change in real output, purely because the rial depreciated. Any
   ceiling fixed in dollars therefore drifts when the rial moves; that is why
   the design reports the ceiling in tokens *and* in toman *and* in dollars.
2. **The published estimates of Iranian wealth disagree by an order of
   magnitude.** USD 2 tn (realised/accessible wealth), USD 3 tn (household
   wealth), USD 27.3 tn (gross resources), USD 35 tn (a number that circulates
   in commentary with no traceable primary source). The disagreement is itself
   the finding: none of these is a valuation a currency can be issued against
   without a registry and an audit.

---

## 3. Why the gross figure cannot be the supply basis

USD 27.3 tn in the ground is not USD 27.3 tn available to redeem a token. The
haircut chain in `HAIRCUT_POLICY` (`HC-DRAFT-01`, authorised by the synthetic
record `DEC-SYN-0041`) applies five visible steps to the resource tier:

| Step | Kind | Factor | Why | Running value |
|---|---|---|---|---|
| Gross in-situ value | — | — | official estimate | USD 27,300,000,000,000 |
| `recovery-factor` | multiply | ×0.25 | share economically recoverable at today's prices and technology | 6,825,000,000,000 |
| `extraction-cost` | deduct | −45 % | in-situ value ≠ value delivered to market | 3,753,750,000,000 |
| `time-value` | multiply | ×0.75 | present value of output spread over ~40 years | 2,815,312,500,000 |
| `legal-transfer` | multiply | ×0.5 | sanctions, disputed ownership, export limits | 1,407,656,250,000 |
| `verification` | multiply | ×0.5 | tier status is *source-reported*, not audited | **703,828,125,000** |

So **2.58 %** of the headline survives. That is the number the ceiling is built
from, and the difference between 27.3 tn and 703.8 bn is exactly the difference
between a poster and a balance sheet.

The two tiers that are deliberately excluded, both at weight **0**:

- `T1` accessible liquid reserves (modelled USD 15 bn): no credible public figure exists.
- `T2` marketable state assets (modelled USD 120 bn): no registry, no independent valuation. **Real estate is in this tier**, because no public source used here values Iran's housing stock; leaving it out is more honest than inventing a number for it.

Excluded from backing entirely, and named on the screen:

- **Nominal GDP** (USD 371.1 bn): a flow, not a stock. You cannot redeem a token against this year's output.
- **Private household wealth** (USD 3 tn): private property. A public token cannot be backed by assets the public institution does not own and cannot seize.

---

## 4. The ceiling, and the finding that surprises people

With the free-market rate of 269,305 toman/USD:

```
1 HMMT            = 1e12 toman
USD value of 1    = 1e12 / 269,305          = USD 3,713,261.91
Ceiling           = 703,828,125,000 / 3,713,261.91 = 189,544.43
                  → floor 189,544 HMMT      (ceiling, not target)
```

Sensitivity, all computed from the same formula:

| Scenario | USD / token | Ceiling (HMMT) |
|---|---|---|
| No haircuts, gross 27.3 tn (the mistake) | 3,713,261.91 | **7,352,027** |
| Source-reported, verified at ×0.5 (used) | 3,713,261.91 | **189,544** |
| Audited tier (×1 instead of ×0.5) | 3,713,261.91 | 379,089 |
| Rial halves (538,610 toman/USD) | 1,856,630.96 | 379,089 |
| Rial doubles in value (134,652 toman/USD) | 7,426,523.82 | 94,772 |

Two consequences worth stating plainly:

1. **A weaker rial raises the token ceiling.** The token is a fixed amount of
   toman, so when the rial falls, one token is worth fewer dollars and the same
   dollar backing covers more tokens. This is unit conversion, not new value:
   the ceiling's *dollar* value is unchanged. It is also why raising the ceiling
   requires a supermajority and a 30-day timelock rather than happening as a
   side effect of the exchange rate.
2. **The ceiling is not the binding constraint — verification is.** For the cap
   to bind, circulating supply would have to approach 189,544 HMMT, i.e. about
   USD 704 bn of deposits. No verified estimate of Iranian broad money or
   deposit stock that could be checked for this note comes close, and no such
   estimate is presented here as if it were checked. The design's real problem
   is the one the haircut chain exposes: almost all national wealth is
   unverifiable, illiquid, or not owned by the issuer.

---

## 5. What remains unverified

Stated so that it cannot be forgotten:

- **Accessible central-bank FX reserves.** Modelled at USD 15 bn with zero
  weight. Any published number should be treated as an estimate until an audit
  exists.
- **Marketable state assets.** Modelled at USD 120 bn with zero weight. No
  registry, no valuation method, no title checks.
- **Real estate.** Not valued at all. The largest component of household wealth
  in most countries is simply absent from the basket.
- **Broad money / deposits.** No figure is used. The "would the ceiling bind?"
  question therefore has no verified answer, only the structural observation in
  §4.
- **The haircut factors themselves.** 25 %, 45 %, 75 %, 50 % are *defensible
  drafts*, not measurements. Each is a policy parameter, labelled
  `proposed-configurable`, and each must be re-derived before any real use.
- **The 27.3 tn figure's composition.** The published claim aggregates oil, gas
  and minerals with an undisclosed methodology; the oil and gas sub-figures used
  here come from OPEC and are separately checkable, the aggregate is not.

---

## 6. What the arithmetic does not do

It does not make HMMT money. A currency needs a legal mandate, a supervised
issuer, reserve custody, an audit regime, and a redemption promise someone is
obliged to honour. This repository has none of those and claims none of them;
`HMMT_DEFINITION.legalPosture` says so on every payload, and the interface says
so above the first number. What the arithmetic does do is make the proposal
*falsifiable*: every figure has a source, a date and a status, and the difference
between the headline and the backing is a table rather than a promise.
