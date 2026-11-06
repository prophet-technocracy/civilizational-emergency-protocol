# Browser audit scripts

Three scripts that drive the real build in headless Chromium. They are **not part
of `npm test`** — the test suite stays browser-free and hermetic — but they are
the checks that produced the accessibility, keyboard and layout claims in the
root `README.md`, and they should be re-run after any UI change.

| script | what it proves |
| --- | --- |
| `a11y.mjs` | axe-core (WCAG 2.1 A/AA + best practice) over twenty routes in light and dark, plus the open mobile navigation drawer and the bank at 390 px. Runs in Persian only; English is covered by the render tests. Prints `{}` when clean. |
| `keyboard.mjs` | 29 keyboard-only checks: arrows and Enter in the search palette, Escape clearing the query before it closes, toast timing included; skip link, focus trap and Escape in the search overlay and provenance drawer, focus returned to the opening control, an inert key dock and header behind a modal layer, inert off-canvas navigation, focus after a route change, modified clicks staying with the browser, labelled toasts, and a toast whose clock stops while it holds focus. |
| `layout.mjs` | nineteen routes × five widths (1440 / 1024 / 768 / 390 / 320), including the header and the key dock: page-level horizontal scroll, offscreen nodes, clipped text, controls under 24 × 24. One theme and one language — see issue #64. |

## Setup (once per machine)

The scripts need three packages that are deliberately **not** in `package.json`
(they would pull a ~200 MB browser into CI):

```sh
npm i --no-save puppeteer-core axe-core @sparticuz/chromium
```

`@sparticuz/chromium` carries the Chromium binary in its npm tarball, so no CDN
download is involved (useful when only registry.npmjs.org is reachable). Its
AL2023 shared libraries ship in the same package and must be extracted once:

```sh
node --input-type=module -e '
import { readFileSync, writeFileSync } from "node:fs";
import { brotliDecompressSync } from "node:zlib";
writeFileSync("/tmp/al2023.tar", brotliDecompressSync(readFileSync("node_modules/@sparticuz/chromium/bin/al2023.tar.br")));
'
mkdir -p /tmp/al2023libs && tar -xf /tmp/al2023.tar -C /tmp/al2023libs
```

`launch.mjs` then finds the browser through `chromium.executablePath()`, sets
`LD_LIBRARY_PATH=/tmp/al2023libs/lib` and `FONTCONFIG_PATH=/tmp/fonts` (the fonts
archive is `bin/fonts.tar.br` in the same package — extract it to `/tmp/fonts` if
Persian text renders as boxes).

## Running

Both servers must be up (`npm run dev` in the repository root: API on 3001, web
on 5173), then:

```sh
node scripts/audit/a11y.mjs
node scripts/audit/keyboard.mjs
node scripts/audit/layout.mjs
```

`CEP_URL` overrides the default `http://127.0.0.1:5173`.

## Traps worth remembering

- The SPA keeps theme and language in `localStorage`: always `page.reload()`
  after writing them, or you measure the previous theme.
- Persian and Arabic-Indic digits are bidi class AN. A neutral `/` between two
  numbers flips visual order in the RTL layout — never render slash ratios.
- Chromium counts a right-to-left scroll container's left overflow as page
  overflow; `.table-wrap` relies on `contain: paint` because of it.
- `sr-only` captions always look like "clipped text" to a naive check; filter
  them out.
- Focus rectangles are clipped by `contain: paint`, so check focus visibility
  inside tables by hand.
