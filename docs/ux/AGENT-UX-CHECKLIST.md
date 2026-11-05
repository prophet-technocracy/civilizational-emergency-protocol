# Agent UX checklist

One page of definition-of-done for interface work in `apps/web`. It collects the
traps that were scattered across `scripts/audit/README.md`,
`docs/ux/ONE-CENTRE-SIX-DOORS.md`, `docs/localization/PERSIAN-STYLE-GUIDE.md`
and the root `README.md`. If a change cannot satisfy an item here, say so in the
pull request instead of quietly skipping it.

The rule behind the whole page: **never claim without a test or a script.**

## 1. The matrix

Every UX change is checked in all eight cells before it is called done:

| axis | values |
| --- | --- |
| language | `fa` (RTL, the default) and `en` (LTR) |
| theme | light and dark |
| width | 390 px (phone) and 1440 px (desktop) |

A screenshot set is part of the pull request: 390/1440 in `fa` and in `en`, in
the theme the change most affects. Dark-only or English-only verification is not
verification.

## 2. Copy and digits

- Persian copy lives in `apps/web/src/locales/fa/`, English in `.../en/`, key for
  key; `apps/web/test/localization.test.mjs` enforces parity, glossary terms,
  half-spaces (ZWNJ) and the absence of Arabic `ي` / `ك`.
- Numbers in the interface go through `formatNumber(value, lang)`: Persian digits
  in `fa`, Latin in `en`. Identifiers stay Latin in both — policy codes
  (`P-OPEN-DRAFT`), record ids (`PROP-SYN-001`), versions and schema names.
- **Never render a slash ratio** (`7/10`, `4/6`). In RTL a neutral slash between
  two numbers reverses the reading order. Write `۷ از ۱۰` / `4 of 6`, including
  inside `aria-label` and `aria-valuetext`.
- Text that is identical in both languages (a keyboard shortcut, a unit) does not
  belong in a locale file — the parity test rejects it. Keep it in the component.
- A new string is added in both locales in the same commit, or the build of the
  interface is considered incomplete.

## 3. Keyboard and focus

- Focus order follows the visual order; nothing important is reachable only by
  pointer.
- After an in-app navigation, focus moves to the new view's container, not to the
  top of the document.
- A modal layer (search overlay, provenance drawer, mobile nav) traps Tab,
  closes on Escape and **returns focus to the control that opened it**, while the
  page behind it is `inert`.
- Overlays never steal focus from a control the reader is still using; outcomes
  are announced (`role="status"` / `aria-live`) instead.
- Every interactive target is at least 24 × 24 px (WCAG 2.5.8).
- Real destinations are `<a href>`. A button that navigates loses middle-click,
  open-in-new-tab and copy-link.

## 4. Structure and semantics

- Exactly one `<h1>` per view, and the heading order never skips a level.
- Every rendered `<button>` has an accessible name; an `aria-label` must contain
  the visible text (`label-content-name-mismatch`).
- Tables have a `<caption>` (may be `sr-only`) and `scope` on headers.
- Charts and meters are `role="img"` with a name that states the value in words
  and the reader's digits.
- Colour is never the only carrier of meaning: every light, badge and gate also
  has text.
- `contain: paint` on scroll containers clips focus rings — check focus visibility
  inside tables by hand.

## 5. Layout

- No horizontal page scroll at any of the four widths in `layout.mjs`.
- No clipped text and no off-screen nodes at 390 px.
- `sr-only` captions look like clipped text to a naive check; exclude them.
- Long Persian and English strings are tested with the longest realistic value,
  not the shortest.

## 6. Running the audits

The browser scripts are not part of `npm test` (the suite stays hermetic). With
both servers up (`npm run dev`: API 3001, web 5173) and the one-time setup from
`scripts/audit/README.md`:

```sh
node scripts/audit/a11y.mjs      # axe, every view, light + dark, open mobile nav
node scripts/audit/keyboard.mjs  # 15 keyboard checks, focus return, inertness
node scripts/audit/layout.mjs    # 12 views x 4 widths
```

`a11y.mjs` prints `{}` when clean. `CEP_URL` overrides the default origin. Always
`page.reload()` after writing theme or language to `localStorage`, or the audit
measures the previous theme.

## 7. Reporting the change

In the pull request:

1. State the **before/after rating** for the screen you changed (see the scale in
   `docs/ux/ONE-CENTRE-SIX-DOORS.md`).
2. List what you verified: the matrix cells, the audit scripts and their output.
3. State plainly what is **not** done yet, and why.
4. Link the tests that would fail if the change were reverted.

An honest "not done" is accepted. An unverified "done" is not.

## 8. Definition of done, in one list

- [ ] `npm test` green, including the localization parity test.
- [ ] `npm run check` green (tests, CSV validation, build, guardrails).
- [ ] `node scripts/audit/a11y.mjs` prints `{}`.
- [ ] `node scripts/audit/keyboard.mjs` passes all 15 checks.
- [ ] `node scripts/audit/layout.mjs` is clean.
- [ ] Checked fa/en × light/dark × 390/1440, with screenshots in the PR.
- [ ] No slash ratio, no Latin digits in Persian accessible names, no Arabic
      `ي`/`ك`, ZWNJ where the glossary requires it.
- [ ] Every new string exists in both locales.
- [ ] Before/after rating and the "not done yet" list are in the PR.
