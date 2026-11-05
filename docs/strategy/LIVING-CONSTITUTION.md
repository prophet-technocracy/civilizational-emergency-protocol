# The living covenant: a light beside every principle

`#/principles` used to be a coverage map: 113 rows, four statuses, one honest
disclaimer. It said what the prototype *does not* demonstrate, which was right,
and stopped there — which was the problem. A map without a route out of itself
is a diagnosis, and a diagnosis left alone becomes an excuse.

This layer adds three things and removes none of the honesty:

1. **A light beside every principle.** Green, amber, red, grey — one dot per row,
   named for a screen reader, never colour alone.
2. **A readiness score with harsh weights.** Not a count, a score that cannot
   flatter the project.
3. **A route from amber to green.** `#/programme` is the queue of balloted,
   budgeted, contracted projects that can actually turn a light on.

## The weights

| Light | Status it marks | Weight | What it means |
|---|---|---|---|
| Green | Covered | **1.0** | A working surface demonstrates the mechanism, with synthetic data |
| Amber | Partial | **0.1** | Present in data or design, enacted nowhere |
| Red | Gap | **0.0** | Software could show it and does not yet |
| Grey | Beyond software | **excluded** | Needs law, courts, forces or a real budget; out of the denominator |

The `0.1` is the argument. A principle "in the design" is not half done. Half
would let a prototype with nothing enforced anywhere declare itself two-thirds
complete; a tenth produces the number that is actually true:

```
(۲۱ green + ۰٫۱ × ۴۷ amber) ÷ ۸۴ countable = ۰٫۳۰۶   →   band: «در ساخت» / under construction
```

Twenty-nine principles sit outside the denominator because no interface can
deliver them — and counting them as failures would be as dishonest as counting
them as wins.

## The bands, and the top one

| Band | Range | Meaning |
|---|---|---|
| طرح / Draft | ≤ 0.25 | Mostly a map |
| در ساخت / Under construction | ≤ 0.50 | **where the covenant is now (0.306)** |
| نزدیک / Nearing | ≤ 0.80 | Most mechanisms demonstrated |
| تقریباً کامل / Almost complete | ≤ 0.999 | All but a handful |
| زنده / Live | 1.0 | Every principle green *and* a real ratification outside this system |

`Live` is unreachable in this repository **by construction**, and the page says
so in words: this prototype never claims it. A light rail that could reach
"live" through code alone would be the most dangerous thing in the project.

## How a light turns green (and how it cannot)

Only one path exists, and it runs through `#/programme`:

1. a project is scoped to one amber principle, with a named deliverable;
2. a **ballot** passes — quorum and threshold published before the count;
3. the budget **passes the level-4 entity cap** in the HMMT cap ladder;
4. a level-4 contractor works under a **mudarabah** contract (loss on the
   capital side, not the contractor);
5. the delivery is **audited**, and only then does the light move.

Nothing else moves a light. Editing copy does not. Adding a route with a
screenshot of a table does not. The API tests assert the gates as invariants, so
a project that is "funded" without a passed ballot fails the build rather than
appearing on the page.

Grey never moves. A principle that needs a court, a police force or a real budget
stays grey however many screens are built, and the page states that next to the
dot rather than in a footnote.

## What this is not

- Not a compliance claim. The mother file is a **draft**; no vote, quorum or
  ratification is recorded for it. Coverage of a prototype ≠ compliance with a
  law.
- Not a measure of the world. Every weight, band and threshold here is a draft
  of this repository and is configurable in one place
  (`apps/api/src/data/principles.mjs`).
- Not a promise that the amber queue empties. The programme targets 14 of 47
  amber principles and says so on the page; the remaining 33 are named as
  outside the queue.

## Files

| Layer | Where |
|---|---|
| Lights, weights, bands, readiness | `apps/api/src/data/principles.mjs` (`PRINCIPLE_LIGHTS`, `READINESS_BANDS`, `readinessOf`) |
| The queue, the gates, the contract | `apps/api/src/data/programme.mjs` |
| The dot component | `apps/web/src/components/lights.jsx` |
| The screens | `#/principles` (rail + dial), `#/programme` (queue) |
| Tests | `apps/api/test/strategy.test.mjs`, `apps/web/test/render.test.mjs` |
