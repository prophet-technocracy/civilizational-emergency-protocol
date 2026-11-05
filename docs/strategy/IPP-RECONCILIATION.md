# CEP against the Iran Prosperity Project (IPP)

The user's premise for this layer: CEP works alongside the Iran Prosperity
Project and the transition roadmap associated with Crown Prince Reza Pahlavi,
and eventually fields a party list in a future parliament («مهستان»). This
document records **what is sourced**, **what is a premise of this repository**,
and **where the two are in tension**. It is written so the premise can be
changed in one place instead of leaking into data.

> Status: first reconciliation, 2026-11-05. Everything in §1 comes from public
> reporting and the project's own site as found on that date; nothing here was
> verified against a primary document held by the project. §3 is this
> repository's own design. Treat §1 rows as **source-reported**, not audited.

## 1. What IPP is, as publicly described

| Claim | Detail | Status |
|---|---|---|
| Name and owner | The **Iran Prosperity Project (IPP)**, an initiative of the National Union for Democracy in Iran (NUFDI), championed by Crown Prince Reza Pahlavi | source-reported |
| Structure | Three groups: (1) financial and social stabilisation in the **first 100 days**, including interim budgeting and currency/financial stabilisation; (2) political and legal stabilisation during the transition; (3) long-term economic reconstruction and investment | source-reported |
| Economic basis | **Ten principles for a prosperous economy** (below) | source-reported |
| Public launch | Presented 30 April 2025, Washington DC, described as "a practical roadmap for rebuilding Iran from day one" | source-reported |
| Transition method | A sequence of **at least four votes with independent observers**: the form of government → a constituent assembly → ratification of a constitution → an elected government | source-reported |
| Stated non-negotiables | Territorial integrity, separation of religion and state, equality of citizens under the law, a democratic political system | source-reported |
| Role claimed | A transitional figure guiding a process, "the form of government must be decided by the Iranian people" | source-reported |

The ten economic principles, in the project's own words (shortened): trust
citizens to decide in their own interest; create opportunity for all; empower
personal responsibility and innovation; respect and protect private property;
let market mechanisms guide interaction; remove barriers for domestic
entrepreneurs; control inflation through fiscal discipline and an independent
central bank; remove barriers to women's labour-market participation; drive
productivity through human capital and technology; rejoin the global economy and
attract foreign investment.

## 2. Where CEP already answers to that, and where it does not

| IPP element | CEP surface | Status |
|---|---|---|
| Four-vote sequence with independent observers | `#/referendum`: four chained questions, quorum + threshold arithmetic, seven gates (legal mandate, voter roll, ballot secrecy, observers, published rules, dispute body, no standing power) | **aligned in shape, explicitly not an authority** |
| First-100-days stabilisation | `#/transition`: dated phases, emergency powers with expiry and revocation | partial — no budget instrument, no currency policy |
| Political and legal stabilisation | `#/governance` (layers, amendments, separation of powers), `#/institutions` | partial — description, not execution |
| Long-term reconstruction | `#/projects`, `#/public-services`, `#/research` | partial — synthetic records |
| Fiscal discipline, independent central bank | `#/bank` (**HMMT**) | **tension — see below** |
| Private property, market mechanisms, FDI | not modelled | gap, and deliberately so |
| Equality under the law | `#/levels` states that professional weight is *not* a vote and levels are not a ranking | aligned, and load-bearing |
| Women's labour participation, human capital | not modelled | gap |
| Territorial integrity | not modelled | gap (and not a software claim) |
| Separation of religion and state | not modelled | gap (constitutional text, outside software) |

### The HMMT tension, stated plainly

`#/bank` models a synthetic unit (1 HMMT = 1e12 toman) with a cap ladder,
haircut chain and proof of reserve. **It is a demonstration of arithmetic, not a
monetary proposal**, and it must not be read as IPP policy: IPP's published
position is fiscal discipline plus an independent central bank, which is a
different instrument. Until the project says otherwise, the bank page is the
weakest link in this alignment and the likeliest to be misread. The page already
carries the banner; this document is the second line of defence.

The same caution applies to "professional weight" in `#/levels`: it is a filter
for qualification, never a multiplier on a ballot, and the glossary forbids
reading it as one.

## 3. What this repository decided (its own design, not IPP's)

- **The referendum instrument mirrors the published sequence, not the published
  text.** Question wording, quorums (0.5 turnout) and thresholds (0.55, 0.57 for
  supermajority rehearsals) are drafts of this repo. They are labelled as drafts
  on the page and in the payload.
- **No electoral authority, ever.** `posture.isElectionAuthority === false` travels
  in the API payload and is tested. Any future move to a real vote requires the
  seven gates, and the gates are not closeable by a pull request to this
  repository.
- **The party is a user of the protocol, not the protocol.** See
  `PARTY-AND-PARLIAMENT.md`: a party list in a future parliament is a political
  actor; CEP is infrastructure that any list — including critics — can use.
- **No real people, no real money, no real mandates.** Every record is synthetic;
  every contract is a data shape; no office-holder emerges.

## 4. Open questions that block a stronger claim

1. The actual text of the **Emergency Phase Booklet** — not read here.
2. Whether IPP has a position on **monetary architecture** beyond "independent
   central bank"; the HMMT demo must not be presented as one.
3. Whether the four referendums have **published thresholds**; our 0.55 and 0.5
   are drafted, not sourced.
4. The **voter-roll and observer** arrangements, which no software layer can
   substitute for.
5. Whether the future parliament's name («مهستان») has an official status, or is
   a working name in the opposition's discourse — we use it as a working name.

## 5. Sources consulted (2026-11-05)

Public reporting and project pages, accessed through web search on that date:
reports on the 30 April 2025 launch and the ten principles; NUFDI's own project
page describing the three groups; reporting on the four-vote transition
sequence; a profile describing the February 2025 designation of Reza Pahlavi as
leader of a transitional government by parts of the opposition.

None of these are primary documents held by the project. Nothing here should be
quoted as the project's own wording beyond the short paraphrase above.
