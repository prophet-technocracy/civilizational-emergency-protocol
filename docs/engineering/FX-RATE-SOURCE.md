# The exchange rate: where the number comes from, and what happens when it is wrong

**Status:** implementation note for review. **Date:** 2026-11-06. **Files:** `apps/api/src/fx/navasan.mjs`, `apps/api/src/fx/service.mjs`, `apps/api/src/data/fx.mjs`, `apps/api/test/fx.test.mjs`.
**AI disclosure:** written by an AI agent alongside the code it describes.

One HMMT is exactly 1,000,000,000,000 toman. Its toman value is fixed by definition and its dollar value floats, so **every dollar figure in the bank screen is a function of the free-market rate**. This note is about the rate, not about the bank.

## 1. The source

`https://www.navasan.tech/module.php` documents a widget. The script URL behind it is

```
https://www.navasan.tech/wp-navasan.php?usd&usd_shakhs&usd_sherkat&usdt
```

which answers with a single JavaScript call whose argument is a JSON-encoded HTML table:

```js
navasanret('"…<tr id=\"usd\">…<td class=\"val\">۲۶۷,۵۰۰</td>…"');
```

Three properties of that payload drive the design:

1. **It is escaped twice.** Quotes arrive as `\\\"`, newlines as `\\r\\n`, non-ASCII as `\u06f2`-style escapes. The decoder unwraps in passes until the text stops changing, and a single-escaped payload decodes identically (tested).
2. **Numbers are in Persian digits with ASCII thousands separators.** `۲۶۷,۵۰۰` is 267,500.
3. **It contains a `<style>` block.** `#bd0a0a` is a colour, not a price. The decoder strips style and script blocks before reading rows, so a hex colour can never become a rate.

`wp-navasan.php` sends no CORS headers suitable for a browser fetch from another origin, and this repository's API sets `Cross-Origin-Resource-Policy: same-origin` on its own responses. **The reading is therefore server-side only, proxied through `/api/v1/fx`.** No browser calls navasan directly, and no third-party script is embedded in the Mini App.

There is also a keyed API at `navasan.tech/api` with a registered key. **It is not used.** Adopting it would mean a credential, a commercial relationship and a terms-of-use review — decisions for the maintainer, not for a pull request.

## 2. Four states, and only four

| State | Meaning | What the screen shows |
| --- | --- | --- |
| `fresh` | Read from the source within the TTL (60 s) | The rate, its age, its source time |
| `stale` | Last good reading, source currently unreachable | The last rate **with its original timestamp** — the age is the disclosure |
| `suspect` | The source answered, the number failed a gate, the previous rate stays in force | The previous rate, plus the rejected value and the reason |
| `reference` | Nothing has been read; the committed figure from `HMMT-FACT-CHECK.md` (SRC-FX), 269,305 toman/USD at 2026-10-29 | That figure, labelled as a committed reference and not a live rate |

The service never returns a bare number without its state.

## 3. The gates

A reading is compared against the last **accepted** value only. Two gates, both deliberately blunt:

- **Bounds.** `10,000 ≤ rate ≤ 20,000,000`. Outside that band the reading is a parse error or an attack, not a price.
- **Jump.** A move of more than 50 % against the last accepted value is rejected as `implausible-jump`.

The reasoning is not statistical. A feed that doubles overnight is either a redenomination (which changes the unit and invalidates the whole arithmetic anyway) or a manipulation. In both cases the correct behaviour is to stop calculating and say so, not to re-price a supply ceiling. Rejected readings are counted and exposed as `rejectCount`, so a sustained attack is visible rather than silent.

**Limitation, stated:** this makes the system hard to push *up* fast and useless against a slow drift. A patient adversary moving the rate 5 % per hour would be accepted every hour. The mitigation is not a better gate; it is that every figure derived from the rate is labelled derived.

## 4. Live reading is opt-in

`CEP_FX_LIVE=1` enables network reads. **Without it, the code performs no I/O at all** and serves the committed reference. This is why `npm run check`, the guardrails script and every test can assert exact figures: they never depend on a number that came off the internet once. It is also why CI cannot silently start publishing live prices after a maintainer enables the flag in production.

The process-wide service is a singleton (`getFxService()`); tests replace it with `setFxService(createFxService({ read, now, ttlMs }))`, which is how the live path is tested end to end without a socket.

## 5. Endpoints

| Path | Content |
| --- | --- |
| `GET /api/v1/fx` | Rate, state, provenance, source rows (free-market, corporate and personal dollars, tether), reference comparison, notes, limitations |
| `GET /api/v1/fx/sensitivity` | The same, plus the ceiling recomputed at the rate in force and at ±10/20/30 %, each row checked against circulating supply and against the ratified ceiling |

`/api/v1/hmmt*` **stays on the frozen reference rate.** Those payloads are pinned by `scripts/audit/guardrails.mjs` and by tests, and the HMMT design has an unresolved question about who may re-state a ceiling (`docs/economics/HMMT-REDTEAM-vs-TOKENIZATION.md`, D5). Moving them onto a live rate before that question is decided would let a price feed change a governance number.

## 6. The finding the panel surfaces

The ceiling is `net backing in USD ÷ (1e12 / rate)`. When the rial **strengthens**, the ceiling in tokens **falls**. At the reference rate the ceiling is 189,544 HMMT; at a rate 30 % stronger it is 132,681.

Circulating supply is ~1,357 HMMT, so no solvency rule is breached today. But a *ratified* ceiling fixed in toman terms would sit above the backed ceiling in that scenario, and the difference — 56,863 HMMT at the 30 % row — is headroom that looks real and is not. `/api/v1/fx/sensitivity` reports it per row as `belowRatifiedCeiling` and `overIssueRiskTokens`. This is the FX-ceiling defect from the red team, made visible in the product instead of argued in a document.

## 7. What is not done

- No retry/backoff beyond the 60 s TTL and a 4 s timeout; no circuit breaker across restarts.
- No persistence: a restart forgets the last accepted rate and falls back to the reference. That is a deliberate choice (no stored price history to seize), not an oversight.
- No cross-check against a second source. If navasan is wrong in a plausible way, this system believes it.
- The Mini App's live preview runs in an environment without outbound network access to navasan, so the panel will show `reference` or `stale` there. That is the honest state, and it is the state a blocked user in Iran will also see.
- No terms-of-use review of reading a third-party public endpoint from a server. That is a maintainer decision, recorded as an open question.
