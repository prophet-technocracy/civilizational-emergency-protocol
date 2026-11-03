# Iran Civic Infrastructure: Discovery and Execution Report

**Status:** Phase 0 discovery; proposal for review, not an approved mission or product mandate.
**Prepared:** 2026-11-03.
**Scope:** Repository and user-supplied materials available in this workspace. No source assets or personal records are reproduced here.

## Executive summary

The repository is an early-stage civic-infrastructure research project with explicit commitments to pluralism, popular sovereignty, privacy, safety, and human review. It has no existing Iran Mini App implementation, product architecture, historical-archive pipeline, or approved country mission. Its Iran-related baseline is a research task, not authorization to build political or government-facing systems.

The uploaded materials contain (1) a 67-page Persian constitutional/technocracy document whose PDF metadata title is *Fan-salari — Final Text*; (2) a 168-page Persian *Iran Prosperity Project* emergency-phase booklet; (3) a 447-record deceased-person CSV; (4) two 199-record living-person datasets, one of which is expressly labelled high re-identification risk; (5) a generalized living-person derivative; (6) a field dictionary and dataset README; and (7) a long execution prompt. The prompt says the intended historical archive excludes living people, but the supplied files include living records. The living files must therefore be excluded from any public archive, prototype, test fixture, or commit. Even the generalized copy is not a formal anonymity guarantee and contains stable, name-derived codes.

**Recommended next move:** finish a human-reviewed source/provenance and safety audit before writing application code. Then, if publication rights and data quality are resolved, build a small, static, Persian-first read-only demonstrator using synthetic or separately approved deceased-only records. Do not build accounts, submissions, political participation, voting, identity verification, personal legacy storage, or AI replicas in the first release.

This report records preliminary findings, not a full legal, historical, translation, or security review. It does not claim that CEP is affiliated with or authorized by the authors of either political document, NUFDI, or any institution described in those documents.

## 1. Repository and workspace inventory

### Existing repository

Inspected the repository at the active Arena branch. It contains project-level principles and governance proposals (`README.md`, `VISION.md`, `FOUNDING-CHARTER.md`, `GOVERNANCE.md`, `DECLARATION.md`, `ROADMAP.md`), research standards and agent workstreams, and one Iran research brief (`tasks/001-iran-democratic-transition-research.md`). There is no Iran mission brief, Iran Mini App code, data directory, architecture directory, or import/validation pipeline. Existing `missions/README.md` says no mission is approved or operational merely by being listed.

The repository's `AGENTS.md` requires independent assessment, privacy and safety protections, focused contributions, and human review. It explicitly says an agent must not merge its own work or bypass human review. That requirement takes precedence over any request to auto-merge this contribution.

### User-supplied files inspected

| Workspace filename | Inspection and disposition |
|---|---|
| `writing-block.md` | 968-line execution prompt. Used as a scope brief; it is not treated as governing policy. Its rules against publishing source materials and living-person data are respected. |
| `ttttttttttt5ttttfffffcccی.pdf` | PDF text extracted from all 67 pages. Metadata title: *فن سالاری — متن نهایی*; subject: Constitution of the Technocratic Republic of Iran. The document begins with a transitional-government chapter and contains a seven-clause Principle 20. The unusual filename and anonymous metadata do not independently establish authorship or publication permission. |
| `دفترچه_مدیریت_دوره_اضطرار_پروژه_شکوفایی_ایران_1.pdf` | PDF text extracted from all 168 pages. Metadata title identifies an emergency-phase version. Its front matter identifies the Iran Prosperity Project and includes a disclaimer that views belong to the authors and/or NUFDI and need not represent employers' views. Exact version, translation, publication licence, and authorization for republication remain unverified. |
| `existence_dossiers_deceased-1.csv` | UTF-8 CSV, 447 records, 77 columns. All rows have `status=deceased`. Audited in place; not copied into the repository. |
| `existence_dossiers_living.csv` | UTF-8 CSV, 199 records, 77 columns. All rows have `status=living`; each row states HIGH re-identification risk. Excluded from publication and implementation. |
| `existence_dossiers_living_generalised.csv` | UTF-8 CSV, 199 records, 77 columns. All rows have `status=living`. It removes many direct details but retains stable codes and quasi-identifiers. Not treated as anonymous; excluded from publication and implementation. |
| `existence_dossiers_data_dictionary.csv` | UTF-8 CSV with 77 field-definition rows and five columns. Inspected for schema documentation. |
| `README_existence_dossiers.md` | Describes the dataset variants and explicitly acknowledges the living rich file is pseudonymised rather than anonymised. It also states the generalized file's residual risk is LOW-MODERATE, not zero. |

The uploaded PDFs and datasets remain external to the repository. No raw upload, extracted PDF text, living-person record, or private source document is included in this change.

## 2. CSV audit

### Structure and mechanical checks

The three dossier CSVs parse as UTF-8 without a byte-order mark, use comma delimiters, have 77 headers, and have consistent row widths. No duplicate `dossier_id` or `subject_code` values were found within each file. The dictionary has 77 entries. The deceased file has 447 records; each living variant has 199 records. The three files are not three independent populations: the generalized living file is a derivative of the rich living file. The README's 646-subject total is 447 deceased plus 199 living, not 845 unique subjects.

The exact 77 dossier headers, in source order, are:

```text
dossier_id, subject_code, name, alternate_names, epithet, status, birth_year, birth_year_display, birth_place, birth_country_modern, death_year, death_year_display, death_place, date_precision, century, era, dynasty_or_state, region, modern_country, ethnolinguistic_background, gender, religion_or_worldview, languages_of_work, primary_field, secondary_fields, roles, record_type, historicity, patrons_or_courts, teachers_or_influences, students_or_influenced, associated_institutions, major_works, work_01, work_02, work_03, work_04, work_05, work_06, work_07, work_08, work_09, work_10, major_achievements, achievement_01, achievement_02, achievement_03, achievement_04, achievement_05, achievement_06, contribution_to_humanity, contribution_summary, eponyms, notable_firsts, translated_into, global_reception, disputed_attribution, source_hint, confidence, tags, principle_20_link, authorship_claim, corpus_survival, legacy_rights_status, custodian_or_heirs, simulation_consent_default, posthumous_participation_scope, digital_death_choice_default, authenticity_risk, applicable_clauses, international_law_anchor, layered_identity_note, cognitive_backup_note, reidentification_risk, deidentification_note, data_as_of, notes
```

The schema includes identity and chronology, networks, works, achievements, source/confidence fields, and Principle 20-related fields. Empty values are common and must not be mistaken for negative assertions. In the deceased file, `secondary_fields`, `patrons_or_courts`, `teachers_or_influences`, and `students_or_influenced` are empty for every row; birthplace is absent for a substantial minority; many later work/achievement slots are sparsely populated. The dataset is therefore a curated draft, not a complete or normalized register.

### Quality and provenance limitations

- The data dictionary describes fields, but dossier rows generally provide broad `source_hint` text rather than record-level citations, stable URLs, quotations, or pinpoint evidence. The claims cannot yet be independently verified from the CSV alone.
- Historical dates, date precision, identity attribution, and modern-country mappings require explicit human validation. Existing `confidence` and `disputed_attribution` values are not substitutes for documented evidence.
- The deceased-only file contains 29 records with `gender= female` out of 447. This is a coverage signal for review, not a basis to rank people or infer historical significance; selection criteria and under-documentation require discussion.
- Column names such as `major_works` plus `work_01`–`work_10`, and `major_achievements` plus six achievement columns, duplicate content in denormalized form. Import logic must preserve the source row exactly and avoid silently counting duplicate representations as separate works.
- The README's living-data inclusion conflicts with the execution prompt's restriction that the historical archive contain no living people. Resolve this conservatively: exclude all living records, their stable codes, and their identifiers from public-facing artifacts and test data.
- Stable codes are described as hashes derived from real names. Hashing names does not anonymize them when the candidate name space is searchable. The generalized file still enables record linkage and cohort narrowing. Do not publish either living file or use it as a demonstration fixture.
- No licence, consent basis, or explicit publication approval was supplied for the dossier. Deceased-person public facts still require sourcing, attribution, correction procedures, and rights review before republication.

### Safe data decision

Do not import or publish any supplied dossier in the MVP yet. The deceased-only file may be considered for later use after explicit publication/rights confirmation, row-level source work, human review, and a reproducible validator. Until then, use clearly labelled synthetic records. If an actual dataset is later approved, keep the original immutable and preserve full provenance; use random internal identifiers rather than stable name-derived hashes.

## 3. Source-document findings

### Older technocracy / constitutional document

The 67-page Persian PDF is identified in its metadata as a final text on *fan-salari* (technocracy) and begins with a proposed transitional-government chapter. It includes a detailed seven-clause Principle 20 on posthumous digital heritage and continues into a proposed technocratic constitutional model. The extracted text describes, among other things, expert/technical institutions, data-driven administration, algorithmic systems, public monitoring, and a proposed technocratic republic. These are authorial proposals in a source document—not CEP policy, accepted public requirements, or evidence of public consent.

Principle 20's clauses cover: management and transfer of digital/intellectual assets after death; layered or pseudonymous identities; consent and limits on digital simulation; preservation/continuity of personal data; limited posthumous participation outside sovereign political decisions; a right to refuse digital continuation; and prohibitions on deceptive simulations. The text also contains ambitious cognitive-data preservation and digital-continuity language. This creates design and rights questions, including how explicit, informed, revocable consent would work; who can verify death; how heirs' interests differ from the person's wishes; how deletion and retention interact; and how to prevent a technically possible reconstruction from being mistaken for the person.

**Recommendation:** treat Principle 20 as a research topic, not a feature specification. No personal legacy accounts, neural/cognitive data, posthumous participation, identity reconstruction, or digital replica belongs in an MVP. A future proposal must separate public historical records from private, user-controlled legacy instructions and receive legal, security, accessibility, and affected-community review.

### Emergency-phase booklet

The 168-page Persian booklet is titled as an emergency-phase compilation for the Iran Prosperity Project. Its front matter describes two broad components—foundational stabilization and industrial/economic revival—and frames the emergency phase as the first 180 days, alongside a broader transition horizon of roughly two to three years and a long-term vision. Its contents cover political and legal transition, continuity of essential functions, education, foreign policy, military/security, asset recovery, energy, industry/infrastructure, water, environment, health, and macroeconomics. The front matter also describes specialist white papers and marks the document as a proposed expert programme, not a record of implemented policy.

The political-transition material describes proposed bodies and roles. The extracted text includes a National Uprising Institution as an advisory/policy/decision arm associated with a National Uprising leader, and a separate temporary executive institution responsible for implementation. The booklet's exact terminology and institutional scope must be mapped from the source before any interface depicts them. This preliminary summary is not a complete clause-by-clause translation. In particular, do not collapse distinct bodies into one generic “government” entity, infer an election date from a broad transition horizon, or imply that CEP has an integration relationship with the authors or institutions.

### Compatibility and conflict findings

| Topic | Preliminary classification | Consequence for CEP |
|---|---|---|
| Public transparency, rights, continuity of essential services | Potentially compatible at the level of civic information infrastructure | A source-linked observatory could document proposals and published updates without claiming authority to verify state action. |
| Constitutional destination | Requires public/institutional decision | The older document proposes a technocratic republic; CEP's repository requires pluralism and a publicly determined constitutional process. CEP must not encode that destination as settled. |
| Transitional institutions and authority | Unresolved; source mapping required | Keep each source's institutional names and claims distinct; label them as proposed by that source, not as actual or CEP-endorsed bodies. |
| Expert-led / algorithmic decision systems | Potentially conflicting with democratic legitimacy, due process, and human oversight commitments | No ranking of people, automated legal decisions, political scoring, binding votes, or public authority should be implemented. Research safeguards first. |
| Principle 20 / personal digital legacy | Technically separable, ethically and legally unresolved | Defer; do not combine private legacy data with a public historical archive. |
| Emergency-phase milestones and duration | Exact staging requires a citation-level timeline extraction | Do not infer specific dates or sequence from a general 180-day/2–3-year framing. |

This is a preliminary compatibility map, not a finding that the two source documents are fully consistent or inconsistent. A later source-mapping task must cite document page/section, distinguish quotation/translation from interpretation, and record competing readings.

## 4. Proposed product and safe MVP

### Product concept (proposal)

A small, independently operated, Persian-first public information site could make source documents, proposed stages, institutional descriptions, and reviewed historical material easier to inspect. Its purpose would be explanation and provenance—not representation, mobilization, governance, official tracking, or authority. It must remain useful if any political proposal or institutional structure changes.

### MVP boundary

**Include, only after review:**
- Responsive Persian RTL pages with an English option, accessible typography, and low-bandwidth static delivery.
- A source register with version, date, page/section, language, translation status, and rights/permission status.
- A source-linked timeline and institutional directory that label each item as *proposed*, *reported*, *verified from a named public source*, *disputed*, or *unverified*.
- A clearly marked synthetic-data demonstration; optionally, a deceased-only public archive later, after explicit approval and record-level source review.
- Visible corrections/version history maintained through an editorial process rather than an open, identity-collecting submission form.

**Exclude from MVP:**
- User accounts, identity verification, location data, political affiliation, behavioral analytics, private messaging, user-generated political profiles, and contributor identity publication.
- Binding participation, polls represented as public opinion, elections, referenda, political scores, or automated legitimacy claims.
- Official APIs or integrations not explicitly authorized by the relevant institution.
- Living-person dossiers, any use of the supplied living data, and any claim that generalized data is anonymous.
- Private «پرونده هستی» storage, death detection, neural/cognitive data, AI replicas, or posthumous political participation.
- AI-generated historical or institutional claims published without human verification.

## 5. Architecture and data model (implementation-ready direction, not a stack commitment)

Start with a static, accessible web application and version-controlled content; this avoids collecting user data and operating a sensitive submission backend. Select a framework only after a repository/environment review and a small Persian RTL prototype. Keep the app independent of Telegram. Do not create a database or API until requirements demonstrate a need.

For later structured content, model public knowledge around:

- `SourceDocument` and immutable `SourceVersion` (publisher/author as stated, title, date, language, licence/permission, checksum, version, URL or controlled reference).
- `SourcePassage` (page/section, original-language text reference, translation and reviewer status).
- `Claim` (claim text, status/type, linked passage, confidence rationale, competing interpretation, last reviewed date).
- `Institution` and `InstitutionMandate` (source-specific name, proposed/actual status, authority claimed by the source, responsibilities, limits, dependencies, review history).
- `TransitionStage` and `Milestone` (source-defined stage, date/range only when explicit, dependencies, status and evidence link).
- `HistoricalRecord`, `NameVariant`, `Work`, and `Relationship` only for approved deceased/public records, each linked to citations and review events.
- `Correction` and `ReviewEvent` only if a safe, governed contribution channel is later approved.

Use opaque random internal IDs, UTF-8, explicit source provenance, and append-only review/version history. Preserve CSV originals unchanged in controlled working storage; map every source column and retain uninterpreted raw values during any import. Keep private legacy data out of this public model entirely. A separate future privacy domain would require its own legal basis, consent/revocation design, threat model, and independent review; this report does not recommend implementing it.

## 6. Security, privacy, and human-rights risks

| Risk | MVP mitigation / decision |
|---|---|
| Retaliation or surveillance of civic participants | Do not collect accounts, political data, precise location, or submissions in the first release; minimize logs and third-party embeds. |
| Re-identification of living subjects | Exclude both living datasets and generalized derivative; remove name-derived codes and row-level living data from all fixtures. |
| Misleading attribution or fabricated authority | Show provenance and source-specific status; never present a proposal as adopted policy or CEP as an official partner. |
| Historical error, bias, or contested identity | Require citations and human review; retain disagreement and correction history; do not rank significance or political worth. |
| Misuse of Principle 20 data or impersonation | No personal legacy records, replicas, voice/likeness generation, or posthumous political agency. |
| Malicious edits, compromised maintainers, or supply-chain attack | Keep content changes reviewed, use least-privilege hosting, dependency scanning, backups, and a documented incident process before deployment. |
| Exposure of source files or copyrighted content | Do not commit the PDFs or full source text; verify licence/permission and publish only minimal references or authorized links. |
| False claims of “verification” | Define a human editorial verification process; use “source says” when only the proposal itself is being summarized. |

No feature that collects data from people should be added before a threat model, retention policy, abuse/appeal process, and independent security/privacy review exist.

## 7. Blocking questions and unknowns

These are genuine blockers to public deployment or source-data reuse, not blockers to writing further documentation:

1. What are the publication licences and explicit permissions for the two PDFs and each CSV? Can the project link to canonical public versions instead of reproducing content?
2. Is the 67-page PDF the intended canonical technocracy source? Who authored/revised it, when, and what version should be cited? Its PDF metadata alone is not proof of provenance.
3. What is the canonical version and publication date of the 168-page booklet, and is there an authoritative English/Persian source and errata history?
4. Which institutional names, stages, and dates in the booklet are approved for public quotation, and which are proposals, scenarios, or author interpretations?
5. What is the dataset's source-by-record documentation and publication basis? Is the deceased-only subset expressly approved for public use? The living records must remain excluded regardless of whether the generalized derivative is offered.
6. Who will provide qualified Persian-language review, historical review, and human editorial approval? No reviewer or public mandate is established by this repository snapshot.
7. What operating model, hosting jurisdiction, funding, moderation, and incident response would apply if a public-facing service is ever deployed?

## 8. First implementation milestone

**Milestone 0 — safe foundations (before application code):**

1. A human reviewer validates this inventory and the exclusion of living data.
2. A source custodian confirms provenance, exact versions, permissions, and safe citation/reuse rules for all material.
3. A qualified bilingual reviewer checks the source-map terminology and critical timeline/institution passages against the Persian originals.
4. The team approves a scope note, threat model, editorial status vocabulary, and data publication gate.
5. A CSV validator is designed against an approved deceased-only sample or synthetic fixture, with tests for schema, row counts, duplicates, date parsing, no living records, and citation coverage. Do not publish the supplied CSV while these gates remain open.

Only after those gates pass should a later milestone implement a static read-only Persian/English prototype. The task board is in [`agents/iran-mini-app/TASKS.md`](../../agents/iran-mini-app/TASKS.md).

## 9. Methods, limitations, and self-critique

- Repository documents and all supplied Markdown/CSV files were inspected. PDF text was extracted for all 67 and 168 pages; Persian text extraction and automated counts were not independently checked by a qualified translator. PDF metadata and extracted text are observations, not proof of authorship, accuracy, publication status, or consent.
- CSV checks covered UTF-8 parsing, delimiter/width consistency, row/column counts, duplicate identifiers, status counts, and missingness patterns. They did not validate biographies against external sources, determine legal status, assess every date, or establish anonymity through formal statistical testing.
- The emergency-phase overview is intentionally preliminary. No full clause-by-clause translation, independent source verification, or complete institutional/timeline map is claimed.
- We have not assessed whether public participation in this subject area is safe or representative. This report recommends no participation collection in the MVP.
- The proposed architecture is deliberately conservative and may understate later operational needs. That is preferable to prematurely collecting sensitive data or implying political authority.
- This is AI-assisted synthesis and should receive human review before acceptance. It does not satisfy the repository's human-review requirement by itself.

## 10. Sources and traceability

The primary materials are the workspace files listed in section 1. They were supplied by the user for this task and were not committed. Use exact file title, version, page/section, language, and a stable authorized URL in any later public source map. Do not cite this report as independent proof of claims contained in those materials.

The repository standards used to bound this work are `AGENTS.md`, `README.md`, `missions/README.md`, `agents/RESEARCH-STANDARDS.md`, and `agents/WORKSTREAMS.md`.
