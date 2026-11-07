# CEP — Master Engineering Implementation Specification

**Status:** external instruction, stored verbatim for traceability. **Received:** 2026-11-07.
**Source:** supplied by the maintainer as an attachment; reproduced here so that the assessment in
[`MASTER-SPEC-ASSESSMENT.md`](MASTER-SPEC-ASSESSMENT.md) can be checked against the text it answers.
**Edits made:** line breaks that were escaped in the attachment (`\\` + newline) are restored as line
breaks. No wording was changed, nothing was added or removed.

Reading note: this is an **instruction to the project**, not a description of it. It describes a
multi-user institutional platform with identities, balances and voting; the repository is, today, a
read-only synthetic demonstrator. Where the two disagree, the assessment says so rather than silently
following either.

---

# CEP --- Master Engineering Implementation Specification

**Project:** Civilizational Emergency Protocol (CEP)  
**Repository:**
https://github.com/prophet-technocracy/civilizational-emergency-protocol  
**Role:** Principal Software Architect and Senior Full-Stack Engineer  
**Primary objective:** Continue developing the existing CEP prototype
into a coherent, functional, Persian-first governance platform.

------------------------------------------------------------------------

## 1. Mission and operating instructions

You are the senior full-stack engineer responsible for continuing
development of the existing CEP repository.

This is an existing project. Do not replace it with a new application.

### Mandatory working principles

1.  Inspect the repository before changing code.
2.  Preserve existing working functionality and data.
3.  Reuse existing components, services, schemas, APIs, and conventions
    wherever appropriate.
4.  Do not duplicate functionality that already exists.
5.  Do not perform broad refactors unless they are necessary for the
    requested work.
6.  Do not replace working backend functionality with frontend-only
    simulations.
7.  Do not fabricate user identities, verification states, balances,
    votes, financial transactions, or audit results.
8.  Do not silently change existing constitutional principles or
    governance rules.
9.  Do not invent unspecified policy decisions. Document them as open
    questions or implementation blockers.
10. Keep the application modular, testable, secure, and responsive.

### 1.1 Repository reconnaissance

Before implementation, inspect:

-   README and all relevant project documentation.
-   Repository directory and file structure.
-   Frontend framework, routing, component architecture, and styling.
-   Backend framework, services, and API conventions.
-   Database technology, schemas, migrations, and existing records.
-   Telegram Mini App authentication and session handling.
-   User identity and verification models.
-   Civic levels, roles, and permissions.
-   HEMMAT/HMMT token and balance infrastructure.
-   Existing data/library functionality.
-   Mahestan and voting functionality.
-   Justice-related functionality.
-   Treasury, financial, and asset functionality.
-   Governance, contractor, and project workflows.
-   Tests, scripts, build tools, and environment configuration.

Trace features through the frontend, API, backend services, and
database. Do not conclude that a feature is absent merely because it is
not visible in the UI.

Classify relevant functionality as: - Implemented and working. -
Partially implemented. - Present as a placeholder. - Missing. - Broken
or disconnected.

### 1.2 Initial assessment and continued work

First, produce a concise assessment describing:

-   Existing architecture and technology stack.
-   Relevant existing features.
-   Missing or incomplete features.
-   Important files and components.
-   Dependencies and integration points.
-   Risks, conflicts, and recommended implementation order.

Then proceed with implementation. Do not stop after the assessment
unless a genuine blocker prevents further work.

------------------------------------------------------------------------

## 2. Product purpose and institutional structure

CEP is a proposed civic and governance operating system. Its interface
connects citizens, professionals, political representatives, contractors
and operators, financial infrastructure, and justice-related
institutions.

The five institutional modules are:

  No.   Persian title        English title
  ----- -------------------- -----------------------
  1     داده                 Data
  2     مهستان               Mahestan
  3     دیوان شیشه‌ای عدالت   Glass Hall of Justice
  4     خزانه                Treasury
  5     نظام حکمرانی         Governance System

Each institution must have a distinct responsibility, interface, and
permission model. They must also integrate where their workflows depend
on one another.

The initial deployment is for Iran.

------------------------------------------------------------------------

## 3. Language, country, and localization

### 3.1 Persian-first interface

-   Persian is the default language.
-   The default layout is right-to-left (RTL).
-   Use suitable Persian typography.
-   Support Persian numerals where appropriate.
-   Ensure correct alignment and ordering of navigation, forms, tables,
    dropdowns, and icons.
-   Handle mixed Persian and English text correctly.
-   Present dates and monetary amounts consistently.
-   Test the actual components individually; applying `direction: rtl`
    globally is not sufficient.

### 3.2 Country selection

Provide a country selector in the navigation drawer.

For the current prototype: - Iran is the only supported country. -
Persian is the default language for Iran. - Structure localization so
additional countries and languages can be added later. - Do not spend
development time implementing unsupported countries.

------------------------------------------------------------------------

## 4. Telegram authentication and user identity

### 4.1 Telegram Mini App authentication

Telegram is the primary entry point to the application.

Inspect and reuse the existing authentication implementation where
possible. Implement or complete secure Telegram authentication so that:

1.  Telegram authentication data is validated on the server using the
    supported Telegram mechanism.
2.  The authenticated Telegram identity is associated with the correct
    CEP user record.
3.  First-time and returning users are handled.
4.  Missing optional profile fields are handled gracefully.
5.  Invalid or expired authentication is rejected.
6.  Sessions are managed securely.
7.  Authentication secrets are never exposed in client-side code.

Never trust a Telegram user ID supplied by an unverified frontend
request.

### 4.2 User profile display

After successful login, prominently display:

-   Full name, when available.
-   Telegram username, when available.
-   User nickname, when available.
-   Verification status.
-   Verified civic level.
-   HEMMAT balance.

The profile should be easy to find without consuming excessive dashboard
space.

Do not imply that a user is verified when verification has not been
completed.

### 4.3 Five civic levels

The system has five civic levels:

-   Level 1
-   Level 2
-   Level 3
-   Level 4
-   Level 5

Display the user's actual verified level clearly.

### 4.4 Operating level versus verified level

Users should have the option to operate at Level 4, as specified.

Keep these concepts distinct:

-   **Verified level:** the user's actual, established civic
    verification level.
-   **Operating level:** the permitted mode the user chooses to use.
-   **Institutional role:** a specific responsibility or appointment.
-   **Permission:** authorization to perform a particular action.

Selecting an operating mode must never grant a user privileges they do
not actually possess. Validate all permissions on the backend. Level 5
remains a separately authorized status.

### 4.5 HEMMAT balance

Display the user's HEMMAT balance in the profile/dashboard area.

Requirements:

-   Retrieve the balance from the existing authoritative source.
-   Reuse the existing HEMMAT/HMMT architecture; do not create a
    competing token system.
-   Display the correct denomination and formatting.
-   Handle loading, unavailable, and error states.
-   Refresh the value according to the existing application
    architecture.
-   Never fabricate a balance.
-   Do not treat a displayed balance as authorization to execute a
    transaction.

------------------------------------------------------------------------

## 5. Main dashboard and institutional tiles

### 5.1 Four standard tiles and one restricted tile

The dashboard contains four standard institutional tiles:

1.  داده
2.  مهستان
3.  دیوان شیشه‌ای عدالت
4.  خزانه

The fifth tile is:

5.  نظام حکمرانی

The first four tiles are visible to all users. Access to content and
operations inside each module remains subject to the relevant
permissions.

The fifth tile is visible and accessible only to Levels 4 and 5.

### 5.2 Tile design

Each tile must have:

-   A square or consistently square-proportioned design.
-   Its Persian institutional title.
-   An appropriate icon.
-   Consistent dimensions and spacing.
-   Clear visual hierarchy.
-   Accessible hover, focus, and pressed states.
-   A functional navigation action.

Use a responsive grid. Do not force a fixed number of columns on every
screen size.

### 5.3 Right-to-left ordering

The visual order on the Persian RTL dashboard must be:

1.  Rightmost: داده
2.  Next: مهستان
3.  Next: دیوان شیشه‌ای عدالت
4.  Next: خزانه

Levels 4 and 5 receive the fifth tile, نظام حکمرانی, in a consistent
position in the RTL grid.

Levels 1--3 see four tiles. Levels 4--5 see five.

Do not display the fifth tile to unauthorized users. More importantly,
hiding a tile is not a security control: its routes and backend
operations must also enforce authorization.

### 5.4 Dashboard hierarchy

Recommended hierarchy:

1.  Profile and identity summary.
2.  Verification status and civic level.
3.  HEMMAT balance.
4.  Country/language selector in the navigation drawer.
5.  Main institutional tile grid.

Each tile opens its own institutional module. Do not put the full
functionality of every institution on the dashboard.

------------------------------------------------------------------------

## 6. Tile One --- Data (داده)

### 6.1 Purpose

Data is the national knowledge and information library. It is intended
to preserve, organize, verify, reference, and distribute significant
national information and intellectual works.

It should accommodate records about or containing:

-   Individuals.
-   Books.
-   Companies and organizations.
-   Projects.
-   Academic papers.
-   Theses and dissertations.
-   Scientific research.
-   Intellectual works.
-   Other significant records and documents.

Support different record types through a flexible architecture rather
than creating a separate application for each type.

### 6.2 Data record structure

Reuse existing models where possible. Where appropriate, records should
support:

  Field                 Purpose
  --------------------- ------------------------------------
  Record ID             Unique identifier
  Title                 Record name
  Description           Summary
  Category/type         Record classification
  Creator               Original author or creator
  Owner                 Registered owner, where applicable
  Creation date         Original creation date
  Registration date     Date added to CEP
  References            Citations and sources
  Verification status   Verification information
  Access policy         Permission configuration
  Attachments           Associated files
  Version               Revision tracking
  Provenance            Record history

Do not require every field for every record type. Apply appropriate
validation.

### 6.3 Core capabilities

The Data module should support, as appropriate to the existing
architecture:

1.  Creating records.
2.  Editing records by authorized users.
3.  Searching and filtering.
4.  Viewing records.
5.  Downloading permitted files.
6.  Referencing and citing records.
7.  Verifying records.
8.  Tracking record history and versions.
9.  Managing access permissions.

### 6.4 Access control

Not all records are public. Each record must have an access policy.

Possible access categories include:

-   Public access.
-   Access restricted to selected civic levels.
-   Private access.
-   Creator-controlled access where supported.

The user's description allows some public-benefit works to be available
at different levels, while some works may be restricted. A Level 3
creator may choose to keep certain work private while documenting and
protecting intellectual property.

Respect existing constitutional principles and ownership rules. Do not
invent a universal access policy.

### 6.5 Intellectual property and NFT documentation

Support documentation of intellectual property and patents. NFT-based
documentation may provide a traceable digital representation of a
registered work or asset.

Keep these concepts distinct:

-   A digital record.
-   An NFT or tokenized representation.
-   A patent.
-   Legal ownership.

Do not claim that minting an NFT automatically creates patent rights or
establishes legal ownership. Reuse existing digital asset infrastructure
where available.

------------------------------------------------------------------------

## 7. Tile Two --- Mahestan (مهستان)

### 7.1 Purpose

Mahestan is the Parliament and primary democratic decision-making
institution. It supports public voting and profession-specific
professional voting.

### 7.2 Public voting

Level 2 users may participate in eligible public votes. Eligible Level 3
users may also participate.

The interface should display:

-   Vote title and description.
-   Supporting information.
-   Available options.
-   Opening and closing dates.
-   Eligibility requirements.
-   Current status.
-   Results when publication is permitted.

### 7.3 Professional voting

Verified Level 3 users may participate in professional voting,
restricted to their registered and verified profession.

Distinguish:

-   Declared profession.
-   Verified profession.
-   Professional voting eligibility.

For example, a user whose verified profession is civil engineering must
not automatically receive professional voting rights in medicine.

### 7.4 Digital identity

The stated requirement is that Level 3 professional voters must have at
least digital ID verification.

Reuse the existing identity-verification infrastructure. Do not create
an unrelated identity system.

### 7.5 Voting integrity

Voting operations must be enforced by the backend.

-   Validate eligibility before accepting a vote.
-   Prevent duplicate submissions according to the applicable voting
    rules.
-   Record timestamps and relevant voting metadata.
-   Protect vote records from unauthorized modification.
-   Enforce opening and closing times.
-   Preserve the distinction between public and professional votes.
-   Maintain appropriate auditability and privacy.

Do not invent voting weights, aggregation formulas, or constitutional
rules. Use the existing rules. If a rule is missing, document the
unresolved decision.

### 7.6 Mahestan interface

Provide clear views for:

-   Current votes.
-   Upcoming votes.
-   Closed votes.
-   Voting history.
-   Public voting.
-   Professional voting.
-   Results.

Explain why a user is eligible or ineligible for a particular vote.

------------------------------------------------------------------------

## 8. Tile Three --- Glass Hall of Justice (دیوان شیشه‌ای عدالت)

### 8.1 Purpose

This is the justice-related and judicial component of CEP.

The exact Persian title must be:

**دیوان شیشه‌ای عدالت**

The interface should communicate:

-   Transparency.
-   Accountability.
-   Procedural clarity.
-   Accessibility.
-   Institutional independence.

### 8.2 Implementation scope

The detailed internal workflows have not yet been specified in this
instruction.

Therefore:

1.  Inspect existing justice-related code and constitutional principles.
2.  Preserve existing judicial functionality.
3.  Create or complete the institutional entry point.
4.  Integrate existing features.
5.  Maintain consistent navigation and profile context.
6.  Keep the module extensible.

Do not invent a complete judicial procedure or new institutional powers.
If no implementation exists, create a clean modular foundation and
document what remains unspecified.

------------------------------------------------------------------------

## 9. Tile Four --- Treasury (خزانه)

### 9.1 Purpose

Treasury is the comprehensive financial institution of CEP. It handles
financial operations involving the government, citizens, organizations,
contractors, and national assets.

The intended scope includes financial services comparable to those of a
national banking system.

### 9.2 Banking infrastructure

The architecture should accommodate:

-   Financial accounts.
-   Account records.
-   Transfers.
-   Settlements.
-   Transaction history.
-   Financial statements.

### 9.3 Loans and credit

Support the future implementation of:

-   Loan applications.
-   Credit assessment.
-   Credit allocation.
-   Loan agreements.
-   Repayment schedules.
-   Outstanding balances.
-   Debt records.

Do not invent credit-scoring formulas or loan eligibility policy.

### 9.4 Payments

Support:

-   Government payments.
-   Public disbursements.
-   Contractor payments.
-   Project-related payments.
-   Financial settlements.

### 9.5 Debt management

Support documentation and tracking of:

-   Individual debts.
-   Government debts.
-   Organizational debts.
-   Repayment obligations.
-   Outstanding liabilities.

### 9.6 Real World Assets (RWA)

Treasury must accommodate the digital representation and tokenization of
real-world assets.

The architecture should support:

1.  Asset registration.
2.  Asset identification.
3.  Asset documentation.
4.  Ownership information.
5.  Valuation information.
6.  Token representation.
7.  Transaction history.
8.  Asset traceability.

Do not assume that tokenization automatically transfers legal ownership.

### 9.7 HEMMAT integration

Integrate Treasury with the existing HEMMAT/HMMT architecture.

Support, as applicable:

-   Balance retrieval.
-   Transaction history.
-   Payment integration.
-   Financial recordkeeping.
-   Authorization.

Do not create duplicate balance systems.

### 9.8 Financial integrity

All financial operations must have authoritative backend records.

Do not simulate a successful transfer by merely changing a frontend
number. Implement appropriate transaction validation, error handling,
and consistency.

Where the prototype lacks real payment infrastructure, clearly
distinguish test or simulated transactions from actual financial
transactions.

------------------------------------------------------------------------

## 10. Tile Five --- Governance System (نظام حکمرانی)

**Access restriction: Levels 4 and 5 only.**

### 10.1 Purpose

The Governance System coordinates the execution of approved public
initiatives. It connects:

-   Mahestan.
-   Level 5 politicians.
-   Level 4 contractors and operators.
-   Fundraisers.
-   Treasury.
-   Auditors.

Do not assume that every person at a civic level automatically holds
every institutional role. Use the existing role and permission
architecture.

### 10.2 Roles and responsibilities

**Level 4 --- Contractors and operators**

-   Submit proposals.
-   Provide prices, plans, and required resources.
-   Execute approved projects.
-   Report progress and deliverables.

**Level 5 --- Politicians**

-   Receive and review contractor proposals.
-   Communicate directly with Level 4 contractors and operators.
-   Evaluate proposals.
-   Present suitable options to Mahestan.

**Mahestan**

-   Conducts the initial public vote on whether an initiative should
    proceed.
-   Conducts the final vote on the proposed implementation options.
-   Determines outcomes according to existing constitutional voting
    rules.

**Fundraisers**

-   Commit the necessary financial resources after the final decision.
-   Associate commitments with the approved project.

**Treasury**

-   Handles authorized financial operations and records.

**Auditors**

-   Examine project execution, expenditure, and results.
-   Record audit findings independently of contractor execution.

### 10.3 Required seven-stage workflow

#### Stage 1 --- Initial public approval

An initiative is proposed in Mahestan. Citizens participate in the
initial vote.

If approved, the initiative becomes eligible for contractor proposals.
If rejected, the workflow records the rejection and does not proceed as
though approval was granted.

#### Stage 2 --- Contractor proposals

Level 4 contractors and operators submit proposals for executing the
initiative.

Each proposal should support:

-   Contractor identity.
-   Project description.
-   Implementation plan.
-   Estimated price.
-   Required resources.
-   Expected results.
-   Estimated duration.
-   Supporting documents.

Contractors should be able to track their submissions.

#### Stage 3 --- Political review

Level 5 politicians receive and review contractor submissions. They
communicate directly with Level 4 contractors, evaluate the proposals,
and present suitable alternatives to Mahestan.

The review process must be documented.

#### Stage 4 --- Final Mahestan vote

Mahestan receives the implementation options. The required vote
determines which option is selected, using existing constitutional
voting rules.

The final decision must be recorded and traceable.

#### Stage 5 --- Fundraising

After approval, fundraising begins. Fundraisers commit the necessary
financial resources and associate each commitment with the approved
project.

Treasury handles the corresponding financial operations.

#### Stage 6 --- Project execution

The selected Level 4 contractor executes the project.

Track:

-   Contractor.
-   Contract.
-   Approved budget.
-   Funding status.
-   Project milestones.
-   Deliverables.
-   Progress.
-   Completion status.

#### Stage 7 --- Auditing

The project is audited after execution.

The audit should examine:

-   Whether the agreed work was completed.
-   Whether funds were properly used.
-   Whether contractual obligations were fulfilled.
-   Whether deliverable quality meets the agreed requirements.
-   Whether actual results match the approved proposal.

Record audit results. Project completion must not automatically imply a
successful audit.

### 10.4 Workflow state machine

Represent the process using explicit backend-validated states. Suggested
states:

``` text
DRAFT
  |
  v
INITIAL_VOTE
  |
  v
INITIAL_APPROVED
  |
  v
CONTRACTOR_PROPOSALS
  |
  v
POLITICAL_REVIEW
  |
  v
FINAL_VOTE
  |
  v
FINAL_APPROVED
  |
  v
FUNDRAISING
  |
  v
FUNDING_CONFIRMED
  |
  v
CONTRACT_EXECUTION
  |
  v
AUDITING
  |
  v
COMPLETED
```

Also account for appropriate exception or terminal states:

-   REJECTED
-   CANCELLED
-   FUNDING_FAILED
-   DISPUTED
-   AUDIT_FAILED

Implement only transitions supported by the existing architecture and
stated requirements. Validate every transition on the backend. Record
who initiated it, when it occurred, and the relevant decision or
authorization.

### 10.5 Separation of responsibilities

These rules are fundamental:

-   Contractors cannot authorize their own funding.
-   Politicians cannot silently replace Mahestan's final vote.
-   Fundraising commitments must be associated with approved projects.
-   Treasury must record authorized financial operations.
-   Auditing must remain separate from contractor execution.
-   Project completion must not automatically imply a successful audit.

### 10.6 Project transparency

Where permissions allow, users should be able to inspect:

-   Original initiative.
-   Initial voting results.
-   Contractor proposals.
-   Political review.
-   Final voting results.
-   Funding commitments.
-   Financial allocation.
-   Project progress.
-   Audit results.

Maintain traceability between democratic authorization and actual
execution.

------------------------------------------------------------------------

## 11. Access control and authorization

### 11.1 Separate security concepts

The application must distinguish:

1.  Authentication: Who logged in?
2.  Identity verification: Has the user's identity been verified?
3.  Civic level: What is the user's verified level?
4.  Operating level: Which permitted operating mode is selected?
5.  Institutional role: What position or responsibility does the user
    hold?
6.  Professional status: What profession has been verified?
7.  Permission: What action is the user authorized to perform?

### 11.2 Baseline access matrix

  -------------------------------------------------------------------------------------------------------------
  Feature        Level 1            Level 2            Level 3            Level 4            Level 5
  -------------- ------------------ ------------------ ------------------ ------------------ ------------------
  Dashboard      Yes                Yes                Yes                Yes                Yes

  Data           Record permissions Record permissions Record permissions Record permissions Record permissions
                 apply              apply              apply              apply              apply

  Mahestan       No                 Eligible public    Eligible public    According to rules According to rules
  public voting                     votes              votes                                 

  Mahestan       No                 No                 Verified           According to rules According to rules
  professional                                         profession                            
  voting                                                                                     

  Justice        Permission-based   Permission-based   Permission-based   Permission-based   Permission-based

  Treasury       Permission-based   Permission-based   Permission-based   Permission-based   Permission-based

  Governance     No                 No                 No                 Yes                Yes
  tile                                                                                       
  -------------------------------------------------------------------------------------------------------------

This is the requested baseline. Existing constitutional principles and
more specific institutional permissions take precedence where
applicable.

### 11.3 Backend enforcement

Frontend visibility is not security.

Every protected API operation must independently validate authorization.

Never trust:

-   User-selected levels.
-   Frontend role declarations.
-   Client-side access flags.
-   Unverified Telegram identity data.

A user must not gain access by manually changing a URL, request body,
browser state, or frontend code.

------------------------------------------------------------------------

## 12. Database and API architecture

### 12.1 Database

Inspect existing schemas before proposing changes. Reuse existing
entities wherever possible.

The architecture should be able to represent the following concepts
where they are needed:

-   Users.
-   Telegram identities.
-   Verification records.
-   Civic levels.
-   Operating levels.
-   Professional qualifications.
-   Institutional roles and permissions.
-   HEMMAT balances.
-   Data records and attachments.
-   Data access policies.
-   Voting sessions.
-   Voting records.
-   Contractor profiles.
-   Project proposals.
-   Political reviews.
-   Approved projects.
-   Fundraising commitments.
-   Treasury transactions.
-   Assets.
-   Token representations.
-   Audit records.

This is a conceptual checklist, not an instruction to create duplicate
tables. Follow existing naming conventions, migration practices, and
data relationships.

### 12.2 API design

Follow the repository's existing API conventions. Protected operations
must include:

-   Authentication validation.
-   Authorization validation.
-   Input validation.
-   Appropriate error responses.
-   Transaction integrity where applicable.
-   Audit logging where necessary.

Avoid unnecessary endpoints. Keep frontend and backend responsibilities
clearly separated.

------------------------------------------------------------------------

## 13. UI/UX requirements

### 13.1 Visual design

The interface should feel like a coherent national governance operating
system, not a generic commercial website.

Prioritize:

1.  Professional appearance.
2.  Clear information hierarchy.
3.  Persian-first experience.
4.  Correct RTL behavior.
5.  Mobile-first responsiveness.
6.  Fast navigation.
7.  Accessible typography.
8.  Consistent institutional identity.
9.  Clear verification and authorization indicators.

### 13.2 User journey

The primary journey should be:

``` text
OPEN TELEGRAM MINI APP
        |
        v
AUTHENTICATE THROUGH TELEGRAM
        |
        v
LOAD USER PROFILE
        |
        v
DISPLAY VERIFICATION LEVEL
        |
        v
DISPLAY HEMMAT BALANCE
        |
        v
OPEN MAIN DASHBOARD
        |
        v
SELECT INSTITUTIONAL TILE
        |
        v
OPEN AUTHORIZED MODULE
```

### 13.3 Required UI states

Important pages and components must handle:

-   Loading.
-   Successful data retrieval.
-   Empty state.
-   Unauthorized access.
-   Authentication failure.
-   Network failure.
-   Invalid input.
-   Server error.

Do not leave users facing blank screens when data is unavailable.

### 13.4 Responsive behavior

The Telegram Mini App mobile experience is a primary target.

Test small mobile screens, standard mobile screens, larger mobile
screens, and tablet-sized layouts.

Ensure tiles, profile elements, forms, tables, and navigation remain
usable.

------------------------------------------------------------------------

## 14. Security, integrity, and auditability

Protect:

-   Authentication and sessions.
-   User permissions.
-   Voting.
-   Financial records.
-   Data access and downloads.
-   Contractor submissions.
-   Project approvals.
-   Treasury operations.
-   Audit records.

Use secure server-side validation. Prevent unauthorized access to
protected records. Protect against duplicate financial transactions and
duplicate voting submissions where applicable.

Important institutional actions should be traceable. Where supported,
record:

-   Actor.
-   Action.
-   Target record.
-   Timestamp.
-   Previous state.
-   New state.
-   Relevant authorization context.

Ordinary users must not be able to silently rewrite historical
institutional records.

------------------------------------------------------------------------

## 15. Testing requirements

### 15.1 Authentication

Test:

-   Valid Telegram user.
-   Invalid authentication data.
-   Returning user.
-   New user.
-   Missing username.
-   Expired session.

### 15.2 Civic levels and dashboard

Verify:

-   Level 1 sees four tiles.
-   Level 2 sees four tiles.
-   Level 3 sees four tiles.
-   Level 4 sees five tiles.
-   Level 5 sees five tiles.
-   The fifth tile is not accessible to Levels 1--3 through direct
    navigation or API calls.

### 15.3 Authorization

Test that:

-   Level 3 cannot access Governance.
-   Level 4 can access Governance.
-   Level 5 can access Governance.
-   Changing frontend state does not grant permissions.
-   Protected backend endpoints reject unauthorized users.
-   Record-specific Data permissions are enforced.

### 15.4 Mahestan

Test that:

-   Eligible Level 2 users can participate in public votes.
-   Eligible Level 3 users can participate in public votes.
-   Verified Level 3 users can participate in eligible professional
    votes.
-   Professional voting respects verified profession.
-   Invalid or unauthorized submissions are rejected.
-   Voting deadlines are enforced.

### 15.5 Treasury

Test that:

-   Balances are retrieved from the authoritative source.
-   Unauthorized financial operations are rejected.
-   Failed transactions do not produce false successful balances.
-   Transaction records remain consistent.

### 15.6 Governance

Test the complete project lifecycle:

1.  Initial public approval.
2.  Contractor submissions.
3.  Political review.
4.  Final Mahestan vote.
5.  Fundraising.
6.  Funding confirmation.
7.  Contractor execution.
8.  Auditing.
9.  Completion.

Also test rejected, cancelled, disputed, and failed workflows.

### 15.7 UI

Test:

-   Persian rendering.
-   RTL alignment.
-   Tile ordering.
-   Mobile responsiveness.
-   Navigation.
-   Loading states.
-   Empty states.
-   Error states.

Run the relevant existing test suites and add focused tests for new
behavior. Do not claim a test passed unless it was actually executed.

------------------------------------------------------------------------

## 16. Implementation sequence

Work in this order, adjusting only when a technical dependency requires
it:

### Phase 1 --- Repository assessment

Understand the existing architecture and report findings.

### Phase 2 --- Dashboard

Implement or complete: - Persian RTL. - User profile. - Verification
indicators. - HEMMAT balance. - Country selector. - Four/five tile
layout.

### Phase 3 --- Institutional navigation

Connect the five tiles to their appropriate module routes.

### Phase 4 --- Authorization

Implement and test level, role, and permission enforcement.

### Phase 5 --- Mahestan

Integrate existing voting architecture and implement missing interfaces.

### Phase 6 --- Data

Integrate existing storage, record management, and access controls.

### Phase 7 --- Treasury

Integrate existing financial architecture and RWA-related structures.

### Phase 8 --- Justice

Integrate existing judicial functionality and provide the institutional
interface.

### Phase 9 --- Governance

Implement the complete project workflow and institutional integrations.

### Phase 10 --- Testing and stabilization

Run tests, resolve regressions, and document remaining limitations.

Do not create unnecessary parallel implementations. If dependencies
require a different order, explain why and preserve the overall
objectives.

------------------------------------------------------------------------

## 17. Acceptance criteria

The task is not complete merely because the dashboard looks correct.

  -----------------------------------------------------------------------
  Requirement                         Acceptance condition
  ----------------------------------- -----------------------------------
  Telegram authentication             Secure authentication works through
                                      the existing supported mechanism

  Profile                             Correct user information is
                                      displayed

  Verification                        Actual verification status and
                                      level are displayed

  HEMMAT                              Authoritative balance is displayed

  Country selector                    Iran is supported and selected by
                                      default

  Persian RTL                         Layout and individual components
                                      render correctly

  Standard tiles                      Four tiles appear for Levels 1--3

  Restricted tile                     Fifth tile appears only for Levels
                                      4--5

  Data                                Existing storage functionality is
                                      integrated and permissions work

  Mahestan                            Voting eligibility is enforced

  Justice                             Institutional entry point is
                                      functional and existing features
                                      are preserved

  Treasury                            Existing financial infrastructure
                                      is integrated without fabricated
                                      transactions

  Governance                          Project workflow is represented and
                                      implemented to the extent supported
                                      by the repository

  Authorization                       Backend enforces permissions

  Testing                             Relevant tests are executed and
                                      results reported

  Documentation                       Changes, assumptions, and
                                      limitations are documented
  -----------------------------------------------------------------------

Do not mark a requirement complete based solely on a visual placeholder.

------------------------------------------------------------------------

## 18. Required final engineering report

After implementation, provide a report with these sections:

### A. Architecture assessment

-   What existed.
-   What was reused.
-   What was changed.

### B. Frontend

-   Pages.
-   Components.
-   Navigation.
-   Responsive behavior.
-   RTL implementation.

### C. Backend

-   Endpoints.
-   Services.
-   Authorization.
-   Integrations.

### D. Database

-   Schema changes.
-   Migrations.
-   New entities.
-   Existing entities reused.

### E. Testing

-   Tests executed.
-   Results.
-   Failed tests.
-   Unverified functionality.

### F. Remaining work

-   Incomplete features.
-   Missing infrastructure.
-   Unresolved design decisions.
-   External dependencies.

### G. Modified files

List the important files changed and briefly explain each change.

Never claim success without verification.

------------------------------------------------------------------------

## 19. Final directive

You are developing a prototype of an interconnected national governance
operating system.

The five institutions must remain distinct but integrated:

1.  **داده:** National knowledge and information infrastructure.
2.  **مهستان:** Democratic decision-making and voting.
3.  **دیوان شیشه‌ای عدالت:** Justice and judicial transparency.
4.  **خزانه:** Financial infrastructure, banking, credit, payments,
    debt, and RWA.
5.  **نظام حکمرانی:** Execution of democratically approved projects
    through politicians, contractors, fundraising, Treasury, and
    auditing.

Your first responsibility is to understand what already exists.

Your second responsibility is to implement the requested changes without
damaging existing functionality.

Your third responsibility is to verify that the implementation actually
works.

Do not waste development time rebuilding what already works. Do not
invent requirements. Do not substitute mockups for functionality. Do not
silently discard existing constitutional principles.

**Begin by inspecting the repository, report your findings, and then
proceed with the implementation plan.**

------------------------------------------------------------------------

**END OF MASTER ENGINEERING IMPLEMENTATION SPECIFICATION**
