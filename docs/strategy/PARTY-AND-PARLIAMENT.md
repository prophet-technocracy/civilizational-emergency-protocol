# From protocol to a party list in a future parliament

The stated direction of this project: CEP works under the guidance of the Crown
Prince's office («مجموعهٔ شاهزاده»), builds the instruments a transition needs,
and eventually stands as a party list in a future parliament («مهستان»). This
document turns that direction into stages, states what each stage requires, and
keeps the one line that must not blur: **infrastructure that can carry any
list's questions is worth more than a party's private dashboard.**

## The premise register

Everything below rests on a premise, not on a fact verified in this repository:

| # | Premise | Consequence if true | Consequence if false |
|---|---|---|---|
| P1 | The project operates in alignment with the Crown Prince's office and its roadmap | The referendum sequence and the "first 100 days" framing may follow the published roadmap | Those two choices become one option among several; nothing else in the code changes |
| P2 | A future parliament («مهستان») is the venue for a party list | The party surfaces are preparation, not campaigning | The party layer is dormant; the protocol layer stands alone |
| P3 | The mother file («فن‌سالاری اصلاح‌شده») remains the constitutional reference | Lights track a 113-principle draft | The light rail points at a different text; the mechanism survives |

P1–P3 live in this file and in copy, never in the API payload as if they were
facts. The API ships `isGovernment: false`, `isElectionAuthority: false`,
`hasPublicMandate: false` on every relevant endpoint, and tests assert them.

## The stages

| Stage | What it is | What CEP can honestly supply | What it cannot |
|---|---|---|---|
| 0 — Now | A public, read-only prototype | The lights, the queue, the referendum arithmetic, the guards | Any authority, any real ballot, any appointment |
| 1 — Instrument | Tools the transition can pick up | `#/referendum` (four questions, quorum maths, seven gates), `#/transition` (dated phases, sunset powers), `#/principles` (a covenant read honestly) | Certification of a real vote |
| 2 — Party formation | A list formed around a programme | The programme with numbers: `#/programme` (12 projects, budgets, gates), `#/bank` (as a demonstration only), `#/levels` (who decides what) | Membership records, donations, candidate vetting — none of it belongs in a read-only civic protocol |
| 3 — Campaign | Contesting seats in مهستان | Public, auditable claims: every promise linked to a light and a project | Targeting, profiling, ad micro-segmentation — refused by design |
| 4 — Mandate | Seats held | Nothing. A mandate is held by people, not by software | Any claim that this system confers legitimacy |

### Why stage 2 is not in this repository

Party membership data is personal data. The whole protocol rests on
"no living-person data", and the moment a membership list enters the same
codebase, that guarantee dies. Stage 2 therefore stays **outside** CEP: a
separate system with its own consent model, its own retention rules, and no
write path into this one. What CEP gives the party is the programme and the
lights; what the party gives CEP is nothing it can enforce.

## The product: what a party can actually use from here

1. **A promise ledger.** Each campaign promise maps to one principle, one
   project and one budget line — all of them already in `#/programme`. A promise
   with no project is visibly a promise with no project.
2. **A quorum calculator**, published before any internal vote, so a party
   ballot is as auditable as the referendum instrument.
3. **A covenant the party cannot silently rewrite.** Amending a principle
   requires a diff, a threshold and a version chain (`#/governance`,
   `docs/strategy/LIVING-CONSTITUTION.md`).
4. **A refusal surface.** The seven gates in `#/referendum` are also a public
   answer to "why can't you just hold the vote" — useful in opposition, and more
   useful once in office.

## Risks this design accepts

- **Capture.** A protocol aligned with one office is easier to capture by that
  office. Mitigation: read-only, no write path, no personal data, and the
  guards printed on the landing page rather than in a footnote.
- **Legitimacy inflation.** A polished interface implies authority it does not
  have. Mitigation: the posture is in the payload and the copy, and "Live" is
  unreachable in code.
- **Category error.** A "party in a future parliament" is not a software
  feature. Mitigation: stage 4 explicitly supplies nothing.
- **Premise drift.** If P1 changes, the copy that leans on it must change too.
  Mitigation: this register is the list — one file, four rows, no hidden
  assumptions in the data layer.

## What would make this document wrong

A published programme from the Crown Prince's office that contradicts the four
questions; an official name for the future parliament that is not «مهستان»; or
a decision to run the party inside this codebase. Any of the three should send
the reader back to this file first.
