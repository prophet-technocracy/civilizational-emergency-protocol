# One centre, six doors

The interface the reader lands on, and why it looks like this. Written after a
round of self-criticism that is reproduced at the end, ratings included — the
criticism is the part worth keeping.

## The diagnosis

The prototype had grown twelve library modules, a five-profile chooser, a bank
with six sub-views, and a 113-row principle coverage map. Every one of them was
reachable, and none of them told the reader **where they were standing**. A
first-time visitor got a sidebar of twelve numbered rows, a chooser that opened
on a second navigation problem, and no answer to the only question that matters
before anything else: *what am I allowed to do here, and what am I not?*

That is not a styling problem. It is an orientation problem, and adding a
thirteenth card does not solve it.

## The shape

One centre, six doors.

```
┌── کليد شهروندی ──────────────────────────────────────────┐
│  ۱ ناظر  ۲ خصوصی  ۳ مشارکت  [ MY.X ]  ۴ گره  ۵ تصمیم  ﷼ بانک │
└──────────────────────────────────────────────────────────┘
```

- **`MY.X` in the centre** is the hub (`#/hub`): one page that states the
  station, the promise («یک کلید، شش در») and the guard — the hub grants
  nothing, verifies no identity, and the records are synthetic.
- **Six doors** flank it: levels 1–5 and the HMMT bank. Each door carries only
  what its own node moderates — the level number, its name, its purpose in one
  sentence, how many actions that level allows, and whether it holds a ballot.
  The bank door carries the unit and the two ceilings instead.
- **The bar is a switch, not a menu.** It rides on every route, is fixed to the
  bottom edge, and marks the pressed door with `aria-current="page"`. The
  landing hash (`""` or `#/`) resolves to the hub.
- **The twelve modules are still there** — as a compact strip under the six
  doors, and in the sidebar. They are the library behind the doors, not a
  competing navigation.

### What each door says, and why only that

| Door | Shown | Deliberately not shown |
|---|---|---|
| Levels 1–5 | level number, name, one-line purpose, action count, ballot yes/no | the action ids (they are on the level page), the guards, the workflow |
| Bank | unit («یک واحد = هزار میلیارد تومان»), supply ceiling, purchase ceiling by level | the haircut chain, the reserve proof, the ladder — all `#/bank` |

The rule: a door states **what the threshold allows**. Everything else is one
click deeper. Six doors repeating a twelve-item list would be the old sidebar
with better lighting.

## Keyboard and assistive technology

- The rail is a single tab stop (roving `tabindex`). `ArrowLeft`/`ArrowRight`
  follow reading order and are **mirrored in RTL**; `Home`/`End` jump to the
  rail's ends; `Enter` opens. The pure helpers (`nextDoorIndex`,
  `doorStepForArrow`, `doorHref`, `isDoorActive`) are exported and unit-tested.
- The pressed door is the route, not a guess: `#/levels/3` presses door 3,
  `#/bank` presses the bank, `#/levels` (the chooser) presses none — and says
  so, rather than lighting up a door that is not open.
- `axe-core`: **0 violations** across 18 routes × light/dark × fa/en
  (`scripts/audit/a11y.mjs`). Accessible names come from the visible text; no
  `aria-label` contradicts what the eye sees (`label-content-name-mismatch` was
  the first thing the sweep caught, on all six keys).

## Verification

- `npm test` → **260 tests, 0 failures** (api 66, web 95, domain 68, schemas 24,
  localization 7). New: the landing resolves to the hub, six doors with the
  real per-level counts and exactly one ballot, the rail on every route, and the
  wrap/direction/pressed-route helpers.
- Build: 526 kB JS (149 kB gzip), 76 kB CSS (15 kB gzip).
- 390 px: no horizontal overflow; the rail keeps **seven slots on one row**
  (glyph above label, ellipsis on the label) instead of wrapping the bank onto
  a stray second row.
- Footer clearance at the bottom of the page: 44 px on a 1440 px viewport,
  109 px at 390 px, against a dock of 99 px / 76 px.

![The hub, light](docs/screenshots/hub.png)
![The hub, dark](docs/screenshots/hub-dark.png)
![The hub on a phone](docs/screenshots/hub-mobile.png)

## The self-criticism, with ratings

Ratings are my own, on a 1–10 scale, for **this prototype against its own
promise**, not against commercial software. They are meant to be uncomfortable.

Before this change: **orientation 3/10, visual identity 5/10, honesty of the
door metaphor 2/10** (there was no door metaphor — there was a sidebar).

After it:

| Dimension | Rating | Why not higher |
|---|---|---|
| Orientation (do I know where I stand?) | **9/10** | The station pill, the pressed key and the guard are on the landing page. The sidebar no longer repeats the doors: it keeps the level chooser, the principles and the twelve modules, and says in one line that the levels and the bank live on the key below. The missing point is that a reader who arrives on a deep module page still has no breadcrumb telling them which door that module sits behind. |
| Visual identity | **7/10** | The medallion, the level rails and the keycaps give the project a face. It is still a designed document, not a place: the hub's stage is beautiful and static, and there is no motion beyond the rings. |
| The door metaphor actually bears weight | **7/10** | Each door states its own action count and ballot — real, API-driven, not decoration. But the *consequences* of a level (what breaks, what is refused) are still one click away, and the words «مجاز» / «ندارد» do the work that an example would do better. |
| Accessibility | **9/10** | 0 axe violations × 18 routes × 2 themes × 2 languages, one tab stop, RTL-mirrored arrows, no label that lies. A point lost for the level accents: they are decorative in dark theme after the contrast fix, and colour alone distinguishes the six doors' rails. |
| Performance | **7/10** | 149 kB gzip JS, 15 kB CSS, no new dependency, no font added. A point lost for the 526 kB raw bundle, which is mostly one file and has no route-level split. |
| Copy (fa/en) | **6/10** | The Persian is mine, checked against the style guide and the glossary, and «یک کلید، شش در» earns its place. It is still *explaining* a metaphor instead of letting the reader use it — a page that has to say "this is a station, not a page" has not finished the job. |
| Trust / restraint | **9/10** | The hub states what it does not do, in a callout, before the reader asks. The fake branch hash in the footer is the only cosmetic lie left, and it is cosmetic. |

What I would do next, in order: (1) give each door one concrete consequence in
place of the word «مجاز»; (2) a breadcrumb on every module page naming the door
it sits behind; (3) put the level comparison table *behind* the doors instead of
above them on the chooser. None of those are styling.

Done in the same pass, after writing the first draft of this list: the sidebar
was demoted. It now holds the chooser, the principles and the twelve modules —
not a second copy of the six doors — and carries `sidebar__hint` pointing at the
key. The render test enforces it: no `#/levels/1` and no `#/bank` inside
`id="primary-navigation"`.
