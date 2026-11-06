// English copy for the HMMT bank screen. Structure is identical to `fa/bank.js`
// so the localization test can compare key paths one to one.
export const bankEn = {
  navLabel: "HMMT bank",
  eyebrow: "Monetary infrastructure · design proposal",
  title: "HMMT: one unit, three numbers",
  lede:
    "One HMMT is exactly one thousand billion toman. Circulating supply never exceeds the audited backing ceiling, and every new token is minted only against deposited toman.",
  proposalBadge: "Design proposal, not legal tender",
  asOf: "Data as of",
  currency: "USD",
  networks: {
    TON: "TON",
    "permissioned sovereign chain": "Permissioned sovereign chain"
  },
  syntheticLedger: "Synthetic ledger",
  tableRegion: "Table",
  notTender: "This screen shows a design: no token exists on any chain and no deposit is accepted.",
  notTenderTitle: "This screen is a design, not a financial system",
  statuses: {
    audited: "Audited",
    "source-reported": "Source-reported",
    "unverified-estimate": "Unverified estimate"
  },

  definition: {
    title: "Unit definition",
    name: "Name",
    tomanPerToken: "Face value",
    decimals: "Decimals",
    baseUnit: "Smallest unit",
    networkFirst: "Stage-one network",
    networkTarget: "Target network",
    pegNote:
      "The unit is fixed in toman, so its dollar value floats with the free-market rate. The ceiling is therefore reported in both toman and USD.",
    exitCriteria: "Exit criteria from the first chain"
  },

  supply: {
    title: "Supply ceiling and circulating supply",
    lede: "These two numbers are not the same number, and the distance between them is the thing that needs explaining.",
    ceiling: "Supply ceiling",
    circulating: "Circulating supply",
    utilisation: "Ceiling utilisation",
    remaining: "Remaining capacity",
    ceilingNote: "The most backing allows, not a growth target.",
    circulatingNote: "Minted only from settled toman deposits.",
    phase: "Distribution phase",
    perPersonCap: "Personal cap",
    perPersonCapNote: "Levels 2 and 3 share the same personal cap, and it does not grow with participation; no data is retained to identify anyone.",
    usdValue: "USD value",
    tomanValue: "Toman value",
    fxRate: "Reference FX rate",
    fxRateUnit: "toman for every US dollar",
    formula: "Formula",
    sourceTitle: "Where each figure comes from",
    source: "Source",
    status: "Status",
    value: "Value",
    note: "Note"
  },

  chain: {
    title: "From the gross resource figure to the supply ceiling",
    lede: "The USD 27.3 trillion figure is in-situ resource value, not backing. The haircut chain shows the distance one number at a time.",
    gross: "Gross in-situ resource value",
    grossNote: "Counted tier only (T3) · USD",
    net: "Net backing after haircuts",
    survival: "Share of the gross figure that survives",
    ceiling: "Supply ceiling",
    perToken: "USD value of one unit",
    openTable: "Show the haircut chain",
    closeTable: "Hide the table",
    excludedTitle: "What is not counted",
    excludedGdp: "Nominal GDP",
    excludedWealth: "Private household wealth"
  },

  haircut: {
    title: "Haircut chain",
    lede: "Every step carries its own factor and its own reason. These parameters are a draft and configurable; none is a magic number.",
    policy: "Policy",
    draft: "Configurable draft",
    tier: "Asset tier",
    gross: "Gross figure",
    step: "Step",
    factor: "Factor",
    net: "Net",
    status: "Verification status",
    excluded: "Not counted",
    counted: "Counted",
    verification: "Verification multiplier",
    rationale: "Rationale",
    tierNote: "Tier note",
    chainNote: "The order is fixed: recovery, then cost, then time value, then legal transferability, and last the verification multiplier."
  },

  reserve: {
    title: "Proof of reserve",
    lede: "Two different questions: is there toman behind every circulating token, and does the ceiling have assets behind it?",
    reserveRatio: "Toman reserve ratio",
    assetCoverage: "Asset coverage",
    utilisation: "Share of the ceiling in use",
    tomanReserve: "Toman reserve",
    netBacking: "Net backing",
    queued: "In the redemption queue",
    invariantsTitle: "Rules that must not bend",
    ok: "Holds",
    broken: "Broken",
    design: "Structural rule",
    statusHealthy: "Healthy",
    statusReserve: "Toman reserve shortfall",
    statusAsset: "Asset coverage shortfall",
    hashRoot: "Published hash root",
    hashRootNote: "Proof of reserve publishes one hash root; no identity data is written on-chain."
  },

  caps: {
    title: "The cap on each level",
    lede: "What a holder may acquire follows the level's role and proof, not a person's worth. Three draft policies sit side by side so the difference is visible; none has been adopted.",
    level: "Level",
    cap: "Acquisition cap",
    requires: "Required proof",
    noProof: "No extra proof",
    disclosure: "Declared holding and recusal",
    notEligible: "Holds nothing",
    noBudget: "Not computed without an audited budget",
    hardCap: "Hard cap applied",
    draft: "Configurable draft",
    defaultPolicy: "Default policy",
    basis: "Basis",
    basedOn: "Based on",
    invariantsTitle: "Rules of capping",
    recordedUnder:
      "The ledger rows were recorded under the default policy and each one carries its own cap; the other policies would not have allowed those rows."
  },

  requirements: {
    "ballot-credential": "Ballot credential",
    "entity-registration": "Entity registration with an accountable officer",
    "audited-budget": "Audited annual budget",
    "mandate-record": "Mandate record"
  },

  sim: {
    title: "Convert and redeem simulator",
    lede: "Enter an amount in HMMT. Every answer either happens or says why it did not.",
    action: "Action",
    level: "Civic level",
    capPolicy: "Cap policy",
    entity: "Entity",
    capForLevel: "This level's cap",
    noCapForRedeem: "Redemption has no level cap",
    excess: "Above the cap",
    presetOverCap: "Above this level's cap",
    convert: "Convert toman into HMMT",
    redeem: "Redeem HMMT for toman",
    amount: "Amount (HMMT)",
    amountHint: "1 HMMT is one thousand billion toman.",
    tomanEquivalent: "Toman equivalent",
    presets: "Presets",
    presetCap: "This level's cap",
    presetOne: "One unit",
    presetHalf: "Half a unit",
    presetFive: "Five units",
    presetOver: "More than circulating",
    presetOverCeiling: "More than the ceiling",
    submit: "Run the simulation",
    running: "Calculating…",
    reset: "Clear",
    resultTitle: "Result",
    fee: "Fee",
    reserveRequired: "Deposit value (USD)",
    netTokens: "Net tokens",
    netToman: "Net toman",
    newCirculating: "Circulating supply after this action",
    afterTitle: "Reserve state after this action",
    failureTitle: "Not performed",
    parsedAs: "Read as",
    amountProblem: {
      empty: "No amount has been entered.",
      "not-a-number": "That is not a number; use Latin, Persian or Arabic-Indic digits.",
      "zero-or-negative": "The amount must be greater than zero.",
      "ambiguous-separator": "One separator with three digits after it can mean 1000 or 1.000. Use ٫ or . for decimals, and ٬ between groups of three."
    },
    error: "The API could not be reached. Try again.",
    codes: {
      converted: "Converted",
      redeemed: "Redeemed",
      queue: "Queued for redemption",
      "ceiling-reached": "The backing ceiling does not allow it",
      "over-level-cap": "Above this level's cap",
      "level-not-eligible": "This level holds no units",
      "entity-budget-required": "The entity cap needs an audited budget",
      "exceeds-circulating": "More than the circulating supply",
      "invalid-amount": "Invalid amount",
      "unknown-action": "Unknown action"
    },
    codeNotes: {
      queue: "Not a refusal: it is paid in timestamp order.",
      "ceiling-reached": "The remaining capacity is reported next to the answer.",
      "exceeds-circulating": "A token that does not exist cannot be redeemed.",
      "invalid-amount": "The amount must be positive."
    }
  },

  ledger: {
    title: "Synthetic ledger",
    lede: "Every row is a synthetic deposit or redemption; the totals are built from these rows.",
    entries: "Entries",
    kind: "Kind",
    id: "Id",
    at: "Time",
    deposit: "Deposit",
    redemption: "Redemption",
    toman: "Toman",
    tokens: "Tokens",
    status: "Status",
    settled: "Settled",
    pending: "Pending",
    queued: "Queued",
    totals: "Totals",
    depositsSettled: "Settled deposits",
    depositsPending: "Pending deposits",
    minted: "Tokens minted",
    burned: "Tokens burned",
    queuedToman: "Toman queued",
    feeRevenue: "Fee revenue",
    cashWindow: "Daily cash window"
  },

  phases: {
    title: "Distribution phases",
    lede: "No phase opens before its own gate is passed; there is no premine, no initial sale and no free allocation.",
    phase: "Phase",
    window: "This phase",
    cumulative: "Cumulative ceiling",
    gate: "Gate",
    current: "Current phase",
    notYet: "Not open"
  },

  rate: {
    title: "The exchange rate in force",
    lede:
      "One HMMT is fixed in toman, so the supply ceiling moves with the dollar rate. This panel shows the rate the calculations would use, when it was read, and what the ceiling becomes when the rate moves.",
    rateLabel: "Free-market dollar",
    statusLabel: "State of the reading",
    asOfLabel: "Read at",
    sourceLabel: "Source",
    ageLabel: "Age",
    ageSeconds: "seconds ago",
    ageMinutes: "minutes ago",
    never: "not read from the source",
    liveCeiling: "Ceiling at this rate",
    referenceCeiling: "Ceiling at the reference rate",
    difference: "Difference",
    referenceLine: "Reference rate",
    ladderTitle: "The ceiling at other rates",
    ladderLede:
      "Assumptions, not forecasts: the same backing, the rate moved by a fixed percentage, the ceiling recomputed.",
    shock: "Rate change",
    rateColumn: "Toman per USD",
    ceilingColumn: "Ceiling (HMMT)",
    ratifiedColumn: "Against the ratified ceiling",
    ratifiedAgrees: "Agrees",
    ratifiedAbove: "Headroom lost",
    limitationsTitle: "What this reading cannot tell you",
    refresh: "Re-read the source",
    states: {
      fresh: "Fresh — read from the source",
      stale: "Stale — last good read, source unreachable",
      suspect: "Suspect — reading rejected, previous rate still in force",
      reference: "Reference — the committed figure, not a live rate"
    }
  },

  design: {
    title: "Architecture and governance",
    lede: "The chain, the governance rules and the structural invariants in one place.",
    networkTitle: "Chain",
    firstStage: "Stage one",
    targetStage: "Target stage",
    reason: "Reason",
    exitTitle: "Exit criteria from stage one",
    governanceTitle: "Governance asymmetry",
    invariantsTitle: "Structural invariants",
    ledgerNoteTitle: "What this screen does not do",
    ledgerNote:
      "No token is created, no payment is made, no wallet is used, and no personal data is read at any point."
  }
};
