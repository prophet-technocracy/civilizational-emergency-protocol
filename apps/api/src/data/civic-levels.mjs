// Shared synthetic records for the five-level civic operating system.
//
// One record set backs every level, so the connected workflow (proposal →
// qualification → committee decision → task → deliverable → public report) is
// the same data seen from five different access contexts. Nothing here is a
// claim about a real person, institution or proceeding.

import {
  CIVIC_LEVELS,
  INFLUENCE_GUARDS,
  POLICY_IDS,
  WEIGHTING_POLICIES,
  authorizeAction,
  computeEndorsementReach,
  computePoliticalBallot,
  computeProfessionalWeight,
  evaluatePosthumousMandate,
  qualifyProposal,
  validateDelegation
} from "@cep/domain-models";

export const DEMO_AS_OF = "2026-01-04T09:12:00Z";

export const committee = Object.freeze({
  id: "COM-SYN-01",
  name: { fa: "کمیتهٔ زیرساخت عمومی (ساختگی)", en: "Public Infrastructure Committee (synthetic)" },
  mandate: {
    fa: "بررسی پیشنهادهای زیرساختی در چارچوب اختیار محدود و ثبت دلیل هر تصمیم.",
    en: "Review infrastructure proposals within a limited mandate and record the reason for every decision."
  },
  members: [
    { id: "COM-M-01", role: { fa: "رئیس دوره‌ای", en: "Rotating chair" }, appointedBy: "DEC-SYN-0011", termEnds: "2026-09-30" },
    { id: "COM-M-02", role: { fa: "عضو فنی", en: "Technical member" }, appointedBy: "DEC-SYN-0012", termEnds: "2026-06-30" },
    { id: "COM-M-03", role: { fa: "عضو مستقل", en: "Independent member" }, appointedBy: "DEC-SYN-0013", termEnds: "2026-12-31" }
  ],
  separationOfDuties: {
    fa: "ثبت تصمیم، بازبینی تحویل و حسابرسی سه نقش جدا هستند؛ یک عضو هر سه را هم‌زمان ندارد.",
    en: "Recording a decision, reviewing a delivery and auditing it are three separate roles; no member holds all three."
  }
});

export const organizations = Object.freeze([
  {
    id: "ORG-SYN-01",
    name: { fa: "گروه فنی نمونهٔ آب و فاضلاب", en: "Sample Water & Sanitation Technical Group" },
    kind: "contractor",
    members: 14,
    joined: "2025-04-02",
    disclaimer: { fa: "سازمان ساختگی؛ هیچ رابطهٔ واقعی با هیچ شرکت موجود ندارد.", en: "Synthetic organization; not related to any existing company." }
  },
  {
    id: "ORG-SYN-02",
    name: { fa: "گروه پژوهشی نمونهٔ ایمنی سازه", en: "Sample Structural Safety Research Group" },
    kind: "research-group",
    members: 9,
    joined: "2025-07-19",
    disclaimer: { fa: "سازمان ساختگی.", en: "Synthetic organization." }
  }
]);

export const proposals = Object.freeze([
  {
    id: "PROP-SYN-001",
    title: { fa: "بازسازی شبکهٔ آب شهری — فاز نمونه", en: "Urban Water Network Rebuild — Sample Phase" },
    domain: "infrastructure",
    stage: "committee-review",
    synthetic: true,
    summary: {
      fa: "نمونهٔ ساختگی یک پیشنهاد زیرساختی: برآورد هزینه، دامنهٔ کار، و مسیر بررسی در کمیته.",
      en: "A synthetic infrastructure proposal: cost estimate, scope of work and the committee's review path."
    },
    budget: { requested: 4200000, committed: 2650000, currency: "SYN-USD" },
    evidence: ["EVD-SYN-001", "EVD-SYN-002"],
    contributions: { political: 40, professional: 6, endorsement: 48000, mobilization: 30, sponsorship: 2 }
  },
  {
    id: "PROP-SYN-002",
    title: { fa: "شبکهٔ مراقبت اولیهٔ سلامت — پایلوت", en: "Primary Health Care Network — Pilot" },
    domain: "healthcare",
    stage: "consultation",
    synthetic: true,
    summary: {
      fa: "پایلوت ساختگی برای سنجش دسترسی به مراقبت اولیه در سه منطقهٔ نمونه.",
      en: "Synthetic pilot to measure primary-care access across three sample districts."
    },
    budget: { requested: 1900000, committed: 0, currency: "SYN-USD" },
    evidence: ["EVD-SYN-003"],
    contributions: { political: 26, professional: 9, endorsement: 12000, mobilization: 4, sponsorship: 1 }
  },
  {
    id: "PROP-SYN-003",
    title: { fa: "میز خدمت دیجیتال شهروندی — نمونه", en: "Citizen Digital Service Desk — Sample" },
    domain: "civic-services",
    stage: "qualified",
    synthetic: true,
    summary: {
      fa: "میز خدمت ساختگی برای آزمودن درخواست‌های شخصی بدون ساختن پروفایل عمومی.",
      en: "Synthetic service desk for testing private requests without creating a public profile."
    },
    budget: { requested: 640000, committed: 120000, currency: "SYN-USD" },
    evidence: ["EVD-SYN-004"],
    contributions: { political: 48, professional: 3, endorsement: 6000, mobilization: 8, sponsorship: 1 }
  }
]);

export const politicalContributions = Object.freeze([
  { contributorId: "CIT-SYN-001", proposalId: "PROP-SYN-001", counted: true, recordedAt: "2025-11-14T10:02:00Z" },
  { contributorId: "CIT-SYN-002", proposalId: "PROP-SYN-001", counted: true, recordedAt: "2025-11-14T10:06:00Z" },
  { contributorId: "CIT-SYN-003", proposalId: "PROP-SYN-001", counted: true, recordedAt: "2025-11-15T18:41:00Z" }
]);

export const professionalAssessments = Object.freeze([
  { id: "PA-SYN-001", assessorId: "CIT-SYN-004", proposalId: "PROP-SYN-001", credentialDomain: "infrastructure", decisionDomain: "infrastructure", verified: true, experienceYears: 12, conflict: false, evidence: "EVD-SYN-001" },
  { id: "PA-SYN-002", assessorId: "CIT-SYN-005", proposalId: "PROP-SYN-001", credentialDomain: "infrastructure", decisionDomain: "infrastructure", verified: true, experienceYears: 4, conflict: false, evidence: "EVD-SYN-002" },
  { id: "PA-SYN-003", assessorId: "CIT-SYN-004", proposalId: "PROP-SYN-001", credentialDomain: "economic-policy", decisionDomain: "infrastructure", verified: true, experienceYears: 20, conflict: false, evidence: "EVD-SYN-005" },
  { id: "PA-SYN-004", assessorId: "CIT-SYN-004", proposalId: "PROP-SYN-001", credentialDomain: "infrastructure", decisionDomain: "infrastructure", verified: true, experienceYears: 25, conflict: true, evidence: "EVD-SYN-001" },
  { id: "PA-SYN-005", assessorId: "CIT-SYN-005", proposalId: "PROP-SYN-002", credentialDomain: "healthcare", decisionDomain: "healthcare", verified: true, experienceYears: 18, conflict: false, evidence: "EVD-SYN-003" },
  { id: "PA-SYN-006", assessorId: "CIT-SYN-005", proposalId: "PROP-SYN-002", credentialDomain: "healthcare", decisionDomain: "healthcare", verified: false, experienceYears: 6, conflict: false, evidence: "EVD-SYN-003" }
]);

export const advocates = Object.freeze([
  {
    id: "ADV-SYN-01",
    handle: "@sample-voice-01",
    declaredIdentity: { fa: "تأییدکنندهٔ ساختگی ۱ — رسانهٔ نمونه", en: "Synthetic endorser 1 — sample media" },
    declaredReach: 120000,
    engagementRate: 0.4,
    sponsorshipDisclosed: true,
    affiliation: { fa: "همکاری اعلام‌شده با یک نهاد ساختگی", en: "Declared association with a synthetic body" },
    conflicts: [{ id: "COI-SYN-01", declared: true, summary: { fa: "مشاورهٔ پرداخت‌شده در همان حوزه", en: "Paid advisory in the same field" } }],
    synthetic: true
  },
  {
    id: "ADV-SYN-02",
    handle: "@sample-voice-02",
    declaredIdentity: { fa: "تأییدکنندهٔ ساختگی ۲ — پژوهشگر عمومی", en: "Synthetic endorser 2 — public researcher" },
    declaredReach: 18000,
    engagementRate: 0.25,
    sponsorshipDisclosed: false,
    affiliation: { fa: "بدون وابستگی اعلام‌شده", en: "No declared affiliation" },
    conflicts: [],
    synthetic: true
  }
]);

export const endorsements = Object.freeze([
  { id: "END-SYN-001", advocateId: "ADV-SYN-01", targetId: "PROP-SYN-001", targetType: "proposal", issuedAt: "2025-11-20T08:15:00Z", reasoning: { fa: "کاهش نشت شبکه در فاز نمونه.", en: "Network leakage reduction in the sample phase." }, status: "active" },
  { id: "END-SYN-002", advocateId: "ADV-SYN-02", targetId: "PROP-SYN-001", targetType: "proposal", issuedAt: "2025-11-22T13:40:00Z", reasoning: { fa: "شفافیت برآورد هزینه.", en: "Transparency of the cost estimate." }, status: "active" },
  { id: "END-SYN-003", advocateId: "ADV-SYN-02", targetId: "PROP-SYN-002", targetType: "proposal", issuedAt: "2025-12-01T09:00:00Z", reasoning: { fa: "دسترسی مناطق کم‌برخوردار.", en: "Access in underserved districts." }, status: "corrected", correction: { fa: "رقم دسترسی اصلاح شد؛ نسخهٔ پیشین بازگردانی نشد.", en: "A reach figure was corrected; the earlier version was not deleted." } }
]);

export const mobilizations = Object.freeze([
  { id: "MOB-SYN-001", proposalId: "PROP-SYN-001", kind: "verified-attendance", count: 30, verifiedBy: "OBS-SYN-01", note: { fa: "حضور تأییدشده در نشست عمومی نمونه.", en: "Verified attendance at a sample public meeting." } }
]);

export const sponsorships = Object.freeze([
  { id: "SPN-SYN-001", sponsorId: "ORG-SYN-02", proposalId: "PROP-SYN-001", amount: 150000, currency: "SYN-USD", disclosed: true },
  { id: "SPN-SYN-002", sponsorId: "ORG-SYN-01", proposalId: "PROP-SYN-001", amount: 50000, currency: "SYN-USD", disclosed: true }
]);

export const delegations = Object.freeze([
  {
    id: "DLG-SYN-001",
    delegatingParty: "CIT-SYN-001",
    recipient: "CIT-SYN-004",
    scope: ["cast-political-ballot"],
    weight: 1,
    consentGiven: true,
    revoked: false,
    startsAt: "2025-10-01T00:00:00Z",
    expiresAt: "2026-10-01T00:00:00Z",
    auditTrail: ["created:2025-09-28", "consented:2025-09-29", "activated:2025-10-01"]
  },
  {
    id: "DLG-SYN-002",
    delegatingParty: "CIT-SYN-002",
    recipient: "CIT-SYN-004",
    scope: ["cast-political-ballot"],
    weight: 1,
    consentGiven: true,
    revoked: false,
    startsAt: "2025-02-01T00:00:00Z",
    expiresAt: "2025-12-31T00:00:00Z",
    auditTrail: ["created:2025-01-28", "expired:2026-01-01"]
  },
  {
    id: "DLG-SYN-003",
    delegatingParty: "CIT-SYN-003",
    recipient: "CIT-SYN-004",
    scope: ["submit-citizen-proposal"],
    weight: 1,
    consentGiven: true,
    revoked: false,
    startsAt: "2025-05-01T00:00:00Z",
    expiresAt: "2027-05-01T00:00:00Z",
    auditTrail: ["created:2025-04-30", "consented:2025-04-30"]
  }
]);

export const posthumousMandate = Object.freeze({
  id: "PMD-SYN-001",
  subjectId: "SUBJ-SYN-001",
  priorConsent: true,
  scopes: ["publish-memoir", "cast-political-ballot"],
  reviewRecords: 2,
  archived: false,
  estate: [
    { id: "EST-01", kind: "memoir", note: { fa: "خاطرات شخصی؛ انتشار پس از مرگ با رضایت پیشین.", en: "Personal memoir, published posthumously under prior consent." } },
    { id: "EST-02", kind: "pseudonymous-archive", note: { fa: "آرشیو با نام مستعار.", en: "Pseudonymous archive." } },
    { id: "EST-03", kind: "simulation-consent", note: { fa: "شبیه‌سازی صدای فرد: ممنوع مطلق.", en: "Voice simulation: absolutely prohibited." } }
  ],
  boundary: {
    fa: "این پرونده خصوصی است و با بایگانی تاریخی یکی نیست. برگهٔ رأی فرد فوت‌شده به هیچ وارثی منتقل نمی‌شود.",
    en: "This estate is private and is not the historical archive. A deceased person's ballot transfers to no heir."
  }
});

export const privateCitizen = Object.freeze({
  citizenId: "CIT-SYN-004",
  label: { fa: "کاربر نمونهٔ سطح ۲", en: "Sample level-2 user" },
  requests: [
    { id: "REQ-SYN-001", service: { fa: "گواهی اشتغال ساختگی", en: "Synthetic employment attestation" }, state: "in-review", updatedAt: "2026-01-02T11:20:00Z" },
    { id: "REQ-SYN-002", service: { fa: "استعلام سابقهٔ ساختگی", en: "Synthetic record enquiry" }, state: "ready", updatedAt: "2025-12-28T16:05:00Z" }
  ],
  documents: [
    { id: "DOC-SYN-001", title: { fa: "برگهٔ وضعیت درخواست", en: "Request status sheet" }, state: "available", updatedAt: "2026-01-03T08:00:00Z" },
    { id: "DOC-SYN-002", title: { fa: "رسید ساختگی", en: "Synthetic receipt" }, state: "available", updatedAt: "2025-12-28T16:06:00Z" }
  ],
  selectiveCredential: {
    claim: { fa: "دارای صلاحیت حرفه‌ای در دامنهٔ زیرساخت", en: "Holds a professional qualification in infrastructure" },
    disclosedAttributes: ["qualification-domain", "verification-status"],
    withheldAttributes: ["legal-name", "residence", "birth-date", "contact-details"],
    proofKind: "zero-knowledge-style-assertion (simulated)",
    publicProfileCreated: false
  },
  consents: [
    { id: "CNS-SYN-001", purpose: { fa: "مشارکت در مشاورهٔ تخصصی زیرساخت", en: "Participation in the infrastructure consultation" }, granted: true, expiresAt: "2026-06-30" },
    { id: "CNS-SYN-002", purpose: { fa: "نمایش عمومی نام", en: "Public display of name" }, granted: false, expiresAt: null },
    { id: "CNS-SYN-003", purpose: { fa: "استفاده از داده در شبیه‌سازی", en: "Use of data in simulation" }, granted: false, expiresAt: null }
  ],
  notifications: [
    { id: "NTF-SYN-001", text: { fa: "درخواست شما به مرحلهٔ بازبینی رسید.", en: "Your request reached the review stage." }, at: "2026-01-02T11:20:00Z" },
    { id: "NTF-SYN-002", text: { fa: "مهلت یک رضایت در ۳۰ ژوئن پایان می‌یابد.", en: "One consent expires on 30 June." }, at: "2026-01-01T07:00:00Z" }
  ],
  eligibility: {
    participationPossible: true,
    publicProfileRequired: false,
    note: { fa: "مشارکت تخصصی بدون ساختن پروفایل عمومی ممکن است.", en: "Scoped professional participation is possible without a public profile." }
  }
});

export const participantProfile = Object.freeze({
  citizenId: "CIT-SYN-004",
  label: { fa: "کاربر نمونهٔ سطح ۳", en: "Sample level-3 user" },
  franchise: true,
  delegations: ["DLG-SYN-001", "DLG-SYN-002", "DLG-SYN-003"],
  taxes: [
    { id: "TAX-SYN-001", period: "2025-Q3", assessed: 2400, paid: 2400, currency: "SYN-USD", state: "settled" },
    { id: "TAX-SYN-002", period: "2025-Q4", assessed: 2650, paid: 1200, currency: "SYN-USD", state: "part-paid" }
  ],
  judicial: [
    { id: "JUD-SYN-001", kind: { fa: "پروندهٔ ساختگی حقوقی", en: "Synthetic civil matter" }, stage: "filed", notice: { fa: "اطلاعات شبیه‌سازی‌شده؛ توصیهٔ حقوقی نیست.", en: "Simulated information; not legal advice." } }
  ],
  qualifications: [
    { id: "QLF-SYN-001", domain: "infrastructure", verified: true, public: false, experienceYears: 10 },
    { id: "QLF-SYN-002", domain: "education", verified: false, public: false, experienceYears: 3 }
  ],
  polls: [
    { id: "POLL-SYN-001", question: { fa: "اولویت بازسازی شبکهٔ آب در فاز بعدی؟", en: "Priority of the water-network rebuild in the next phase?" }, options: [{ id: "yes", label: { fa: "موافق", en: "Support" } }, { id: "no", label: { fa: "مخالف", en: "Oppose" } }, { id: "abstain", label: { fa: "ممتنع", en: "Abstain" } }], answered: false },
    { id: "POLL-SYN-002", question: { fa: "پایلوت سلامت در کدام منطقه آغاز شود؟", en: "Which district should start the health pilot?" }, options: [{ id: "north", label: { fa: "شمال", en: "North" } }, { id: "south", label: { fa: "جنوب", en: "South" } }], answered: true }
  ],
  history: [
    { id: "ACT-SYN-001", kind: { fa: "پیشنهاد شهروندی", en: "Citizen proposal" }, target: "PROP-SYN-003", at: "2025-12-11T12:00:00Z" },
    { id: "ACT-SYN-002", kind: { fa: "پاسخ به نظرسنجی", en: "Poll answer" }, target: "POLL-SYN-002", at: "2025-12-19T09:30:00Z" }
  ]
});

export const workflow = Object.freeze({
  id: "WF-SYN-001",
  title: { fa: "چرخهٔ کامل یک پیشنهاد تا گزارش عمومی", en: "One proposal from committee queue to public report" },
  proposalId: "PROP-SYN-001",
  steps: [
    { id: "WF-1", actor: "COM-SYN-01", level: 5, kind: "proposal-created", at: "2025-11-02T09:00:00Z", text: { fa: "کمیته پیشنهاد ساختگی را ثبت کرد.", en: "The committee registered a synthetic proposal." }, recordId: "PROP-SYN-001" },
    { id: "WF-2", actor: "PUBLIC", level: 1, kind: "contributions", at: "2025-11-24T00:00:00Z", text: { fa: "حمایت سیاسی، ارزیابی تخصصی و تأیید عمومی ثبت شد.", en: "Political support, professional assessments and public endorsements were recorded." }, recordId: "PROP-SYN-001" },
    { id: "WF-3", actor: "ENGINE", level: 1, kind: "qualification", at: "2025-11-25T00:00:00Z", text: { fa: "موتور آستانه، امتیاز را زیر دو سیاست محاسبه کرد.", en: "The threshold engine scored the proposal under both policies." }, recordId: "PROP-SYN-001" },
    { id: "WF-4", actor: "COM-SYN-01", level: 5, kind: "decision", at: "2025-11-27T14:10:00Z", text: { fa: "تصمیم ساختگی با دلیل ثبت شد (غیرالزام‌آور).", en: "A synthetic decision was recorded with reasons (non-binding)." }, recordId: "DEC-SYN-014" },
    { id: "WF-5", actor: "ORG-SYN-01", level: 4, kind: "task-assigned", at: "2025-11-28T08:00:00Z", text: { fa: "کار به گرهٔ سازمانی واگذار شد.", en: "The task was assigned to an organizational node." }, recordId: "TASK-SYN-021" },
    { id: "WF-6", actor: "ORG-SYN-01", level: 4, kind: "deliverable", at: "2025-12-15T17:40:00Z", text: { fa: "تحویل‌شدنی و گزارش هزینه ارائه شد.", en: "A deliverable and a cost report were submitted." }, recordId: "DEL-SYN-021" },
    { id: "WF-7", actor: "COM-SYN-01", level: 5, kind: "review", at: "2025-12-18T10:25:00Z", text: { fa: "کمیته تحویل را بازبینی و ایراد ثبت کرد.", en: "The committee reviewed the delivery and logged one objection." }, recordId: "REV-SYN-021" },
    { id: "WF-8", actor: "PUBLIC", level: 1, kind: "public-report", at: "2026-01-03T09:15:00Z", text: { fa: "گزارش پیشرفت و هزینه در سطح عمومی منتشر شد.", en: "A progress and expenditure report was published publicly." }, recordId: "REP-SYN-021" }
  ]
});

export const committeeDecisions = Object.freeze([
  {
    id: "DEC-SYN-014",
    proposalId: "PROP-SYN-001",
    actor: "COM-M-01",
    scope: "infrastructure/sample-phase",
    reason: { fa: "امتیاز زیر سیاست باز از آستانه گذشت و شواهد کافی بود.", en: "The score passed the threshold under the open policy and the evidence was sufficient." },
    at: "2025-11-27T14:10:00Z",
    kind: "synthetic-not-binding",
    authorizedBy: "DEC-SYN-0011",
    reviewRequired: true,
    reviewedBy: "REV-SYN-021"
  },
  {
    id: "DEC-SYN-015",
    proposalId: "PROP-SYN-002",
    actor: "COM-M-02",
    scope: "healthcare/pilot",
    reason: { fa: "نیاز به مشاورهٔ عمومی بیشتر پیش از هر تصمیم.", en: "Further public consultation required before any decision." },
    at: "2025-12-02T11:45:00Z",
    kind: "synthetic-not-binding",
    authorizedBy: "DEC-SYN-0012",
    reviewRequired: false,
    reviewedBy: null
  }
]);

export const conflictDeclarations = Object.freeze([
  { id: "COI-DECL-01", actor: "COM-M-02", summary: { fa: "مشاورهٔ ساختگی در حوزهٔ سلامت", en: "Synthetic advisory role in healthcare" }, recused: true, declaredAt: "2025-12-02T11:30:00Z" },
  { id: "COI-DECL-02", actor: "COM-M-03", summary: { fa: "هیچ تعارضی اعلام نشده", en: "No conflict declared" }, recused: false, declaredAt: "2025-11-30T09:00:00Z" }
]);

export const tasks = Object.freeze([
  {
    id: "TASK-SYN-021",
    organizationId: "ORG-SYN-01",
    proposalId: "PROP-SYN-001",
    title: { fa: "برداشت میدانی و برآورد نشت شبکه", en: "Field survey and leakage estimate" },
    state: "delivered",
    dueAt: "2025-12-20",
    budget: { allocated: 320000, spent: 298400, currency: "SYN-USD" },
    members: [{ id: "MEM-SYN-01", role: { fa: "مسئول پروژه", en: "Project lead" } }, { id: "MEM-SYN-02", role: { fa: "کارشناس داده", en: "Data specialist" } }],
    deliverableId: "DEL-SYN-021",
    responsibility: { fa: "این کار به سازمان واگذار شده است، نه به اعضای آن به‌صورت فردی.", en: "The work is assigned to the organization, not to its members individually." }
  },
  {
    id: "TASK-SYN-022",
    organizationId: "ORG-SYN-02",
    proposalId: "PROP-SYN-002",
    title: { fa: "مرور ایمنی سازهٔ مراکز نمونه", en: "Structural safety review of sample clinics" },
    state: "in-progress",
    dueAt: "2026-02-10",
    budget: { allocated: 180000, spent: 74000, currency: "SYN-USD" },
    members: [{ id: "MEM-SYN-03", role: { fa: "مهندس سازه", en: "Structural engineer" } }],
    deliverableId: null,
    responsibility: { fa: "کار در جریان است؛ تحویل‌شدنی هنوز ثبت نشده.", en: "Work in progress; no deliverable recorded yet." }
  }
]);

export const deliverables = Object.freeze([
  {
    id: "DEL-SYN-021",
    taskId: "TASK-SYN-021",
    organizationId: "ORG-SYN-01",
    title: { fa: "گزارش برداشت میدانی و برآورد نشت", en: "Field survey and leakage estimate report" },
    submittedAt: "2025-12-15T17:40:00Z",
    evidence: ["EVD-SYN-001", "EVD-SYN-006"],
    review: { id: "REV-SYN-021", outcome: "accepted-with-objection", objection: { fa: "یک بخش از دادهٔ نمونه ناقص بود.", en: "One sample dataset was incomplete." } }
  }
]);

export const publicReports = Object.freeze([
  {
    id: "REP-SYN-021",
    proposalId: "PROP-SYN-001",
    title: { fa: "گزارش پیشرفت و هزینهٔ فاز نمونه", en: "Sample-phase progress and expenditure" },
    publishedAt: "2026-01-03T09:15:00Z",
    figures: { committed: 2650000, spent: 298400, currency: "SYN-USD" },
    note: { fa: "همهٔ ارقام ساختگی‌اند و از همین مجموعهٔ داده مشتق می‌شوند.", en: "All figures are synthetic and derived from this same dataset." }
  }
]);

export const auditLog = Object.freeze([
  { id: "AUD-SYN-001", actor: "COM-M-01", action: "record-scoped-decision", target: "DEC-SYN-014", at: "2025-11-27T14:10:00Z", scope: "infrastructure/sample-phase" },
  { id: "AUD-SYN-002", actor: "COM-M-02", action: "declare-conflict", target: "COI-DECL-01", at: "2025-12-02T11:30:00Z", scope: "self" },
  { id: "AUD-SYN-003", actor: "COM-M-03", action: "review-deliverable", target: "REV-SYN-021", at: "2025-12-18T10:25:00Z", scope: "committee" },
  { id: "AUD-SYN-004", actor: "ORG-SYN-01", action: "submit-deliverable", target: "DEL-SYN-021", at: "2025-12-15T17:40:00Z", scope: "organization" }
]);

export const announcements = Object.freeze([
  { id: "ANN-SYN-001", at: "2026-01-03T09:15:00Z", text: { fa: "گزارش پیشرفت فاز نمونهٔ شبکهٔ آب منتشر شد.", en: "The sample water-network progress report is published." }, ref: "REP-SYN-021" },
  { id: "ANN-SYN-002", at: "2025-12-20T10:00:00Z", text: { fa: "مشاورهٔ عمومی دربارهٔ پایلوت سلامت آغاز شد.", en: "Public consultation on the health pilot opened." }, ref: "PROP-SYN-002" },
  { id: "ANN-SYN-003", at: "2025-12-05T08:30:00Z", text: { fa: "دو سیاست وزن‌دهی برای مقایسه منتشر شد.", en: "Two weighting policies published for comparison." }, ref: "P-OPEN-DRAFT" }
]);

export const evidenceRecords = Object.freeze([
  { id: "EVD-SYN-001", kind: "dataset", title: { fa: "دادهٔ نمونهٔ نشت شبکه", en: "Sample leakage dataset" }, synthetic: true },
  { id: "EVD-SYN-002", kind: "report", title: { fa: "گزارش برآورد اولیه", en: "Preliminary estimate report" }, synthetic: true },
  { id: "EVD-SYN-003", kind: "dataset", title: { fa: "شاخص دسترسی سلامت (نمونه)", en: "Health access index (sample)" }, synthetic: true },
  { id: "EVD-SYN-004", kind: "spec", title: { fa: "مشخصات میز خدمت", en: "Service-desk specification" }, synthetic: true },
  { id: "EVD-SYN-005", kind: "note", title: { fa: "یادداشت اقتصادی نمونه", en: "Sample economic note" }, synthetic: true },
  { id: "EVD-SYN-006", kind: "annex", title: { fa: "پیوست دادهٔ برداشت میدانی", en: "Field-survey data annex" }, synthetic: true }
]);

export const evidenceReviews = Object.freeze([
  { id: "EVR-SYN-001", evidenceId: "EVD-SYN-001", reviewer: "COM-M-03", state: "sufficient", note: { fa: "داده کامل است.", en: "The data is complete." } },
  { id: "EVR-SYN-002", evidenceId: "EVD-SYN-002", reviewer: "COM-M-02", state: "incomplete", note: { fa: "یک جدول ناقص است.", en: "One table is incomplete." } }
]);

/** Endorsement reach, computed per endorsement and per policy. */
export function endorsementBreakdown(policyId = "P-OPEN-DRAFT") {
  return endorsements.map((endorsement) => {
    const advocate = advocates.find((item) => item.id === endorsement.advocateId);
    const reach = computeEndorsementReach(
      {
        endorsementId: endorsement.id,
        advocateId: endorsement.advocateId,
        declaredReach: advocate.declaredReach,
        engagementRate: advocate.engagementRate,
        sponsorshipDisclosed: advocate.sponsorshipDisclosed,
        conflicts: advocate.conflicts
      },
      policyId
    );
    return { ...reach, advocateHandle: advocate.handle, targetId: endorsement.targetId, status: endorsement.status };
  });
}

export function qualificationFor(proposalId, policyId = "P-OPEN-DRAFT") {
  const proposal = proposals.find((item) => item.id === proposalId);
  if (!proposal) throw new Error(`unknown proposal: ${proposalId}`);
  return qualifyProposal({ proposalId: proposal.id, domain: proposal.domain, contributions: proposal.contributions }, policyId);
}

function publicProposalView(proposal) {
  const perPolicy = POLICY_IDS.map((policyId) => qualificationFor(proposal.id, policyId));
  return {
    id: proposal.id,
    title: proposal.title,
    domain: proposal.domain,
    stage: proposal.stage,
    summary: proposal.summary,
    budget: proposal.budget,
    evidence: proposal.evidence,
    qualification: perPolicy.map((result) => ({
      policyId: result.policyId,
      total: result.total,
      threshold: result.threshold,
      outcome: result.outcome,
      margin: result.margin,
      policyStatus: result.policyStatus
    }))
  };
}

const ballotView = (policyId) =>
  computePoliticalBallot(
    {
      voterId: participantProfile.citizenId,
      franchise: participantProfile.franchise,
      delegations: participantProfile.delegations.map((id) => delegations.find((item) => item.id === id)).filter(Boolean)
    },
    policyId
  );

const levelModule = (id, title, kind, data) => ({ id, title, kind, ...data });

/**
 * Builds one level dashboard. Every number here comes from the shared records
 * above, so a figure shown at level 1 matches the same figure at level 4.
 */
export function buildLevelDashboard(levelId, { policyId = "P-OPEN-DRAFT" } = {}) {
  const level = CIVIC_LEVELS.find((item) => item.id === Number(levelId));
  if (!level) throw new Error(`unknown level: ${levelId}`);
  const policy = WEIGHTING_POLICIES[policyId];
  const modules = [];

  if (level.id === 1) {
    modules.push(
      levelModule("announcements", { fa: "اطلاعیه‌های عمومی", en: "Public announcements" }, "feed", { items: announcements }),
      levelModule("proposals", { fa: "پیشنهادهای عمومی", en: "Public proposals" }, "proposals", { items: proposals.map(publicProposalView) }),
      levelModule("projects", { fa: "پیشرفت پروژه‌ها", en: "Project progress" }, "progress", { reports: publicReports, tasks: tasks.map((task) => ({ id: task.id, title: task.title, state: task.state, budget: task.budget })) }),
      levelModule("decisions", { fa: "تصمیم‌های منتشرشده", en: "Published decisions" }, "decisions", { items: committeeDecisions }),
      levelModule("directory", { fa: "کارپوشهٔ عمومی نهادها", en: "Public institutional directory" }, "directory", { committee: { id: committee.id, name: committee.name, mandate: committee.mandate }, organizations: organizations.map((org) => ({ id: org.id, name: org.name, kind: org.kind })) }),
      levelModule("finance", { fa: "خلاصهٔ مالی منتشرشده", en: "Released financial summaries" }, "finance", { reports: publicReports, sponsorships }),
      levelModule("accountability", { fa: "گزارش‌های پاسخگویی", en: "Accountability reports" }, "audit", { auditLog, decisions: committeeDecisions }),
      levelModule("advocacy", { fa: "تأییدهای عمومی و منشأ اثر", en: "Public endorsements and their reach" }, "advocacy", { advocates, endorsements, breakdown: endorsementBreakdown(policyId) }),
      levelModule("evidence", { fa: "شواهد و اسناد منبع", en: "Evidence and source documents" }, "evidence", { items: evidenceRecords })
    );
  }

  if (level.id === 2) {
    modules.push(
      levelModule("requests", { fa: "درخواست‌های خدمت خصوصی", en: "Private service requests" }, "requests", { items: privateCitizen.requests }),
      levelModule("documents", { fa: "وضعیت اسناد شخصی", en: "Personal document status" }, "documents", { items: privateCitizen.documents }),
      levelModule("privacy", { fa: "کنترل حریم خصوصی و افشا", en: "Privacy and disclosure controls" }, "privacy", { selectiveCredential: privateCitizen.selectiveCredential }),
      levelModule("credentials", { fa: "ارائهٔ گزینشی صلاحیت", en: "Selective credential presentation" }, "credentials", { selectiveCredential: privateCitizen.selectiveCredential, consultations: [proposals[0]].map((proposal) => ({ id: proposal.id, title: proposal.title, domain: proposal.domain })) }),
      levelModule("notifications", { fa: "مرکز اطلاع‌رسانی شخصی", en: "Personal notification centre" }, "feed", { items: privateCitizen.notifications }),
      levelModule("eligibility", { fa: "صلاحیت مشارکت خصوصی", en: "Private participation eligibility" }, "eligibility", { eligibility: privateCitizen.eligibility }),
      levelModule("consent", { fa: "رضایت و مجوزها", en: "Consent and permissions" }, "consent", { items: privateCitizen.consents })
    );
  }

  if (level.id === 3) {
    const ballot = ballotView(policyId);
    modules.push(
      levelModule("overview", { fa: "پیشخوان مدنی شخصی", en: "Personal civic dashboard" }, "summary", {
        ballot,
        openRequests: privateCitizen.requests.filter((request) => request.state !== "ready").length,
        consents: privateCitizen.consents.length
      }),
      levelModule("taxes", { fa: "مدیریت مالیات ساختگی", en: "Synthetic tax management" }, "finance", { items: participantProfile.taxes }),
      levelModule("judicial", { fa: "امور قضایی ساختگی", en: "Synthetic judicial affairs" }, "legal", { items: participantProfile.judicial }),
      levelModule("qualifications", { fa: "حرفه و صلاحیت‌ها", en: "Profession and qualifications" }, "qualifications", {
        items: participantProfile.qualifications.map((qualification) => ({
          ...qualification,
          weightNow: computeProfessionalWeight(
            {
              credentialDomain: qualification.domain,
              decisionDomain: proposals[0].domain,
              verified: qualification.verified,
              experienceYears: qualification.experienceYears
            },
            policyId
          ).total
        }))
      }),
      levelModule("professional", { fa: "مشارکت حرفه‌ای", en: "Professional participation" }, "professional", {
        // Only this citizen's own assessments: a level-3 view is not a window
        // into other people's professional records.
        assessments: professionalAssessments
          .filter((assessment) => assessment.assessorId === participantProfile.citizenId)
          .map((assessment) => ({ ...assessment, weight: computeProfessionalWeight(assessment, policyId) })),
        proposals: proposals.map((proposal) => ({ id: proposal.id, title: proposal.title, domain: proposal.domain }))
      }),
      levelModule("political", { fa: "مشارکت سیاسی", en: "Political participation" }, "ballot", { ballot, policy: { id: policy.id, label: policy.label, status: policy.status, authorizedBy: policy.authorizedBy, note: policy.limits.note } }),
      levelModule("polls", { fa: "جدول نظرسنجی", en: "Poll table" }, "polls", { items: participantProfile.polls }),
      levelModule("fame", { fa: "وزن شهرت و رأی", en: "Fame and vote weight" }, "fame", { ballot, endorsements: endorsementBreakdown(policyId), policyNote: policy.limits.note }),
      levelModule("delegations", { fa: "واگذاری و رضایت", en: "Delegation and consent" }, "delegations", {
        items: participantProfile.delegations.map((id) => {
          const delegation = delegations.find((item) => item.id === id);
          return { ...delegation, check: validateDelegation(delegation, { at: DEMO_AS_OF, actionId: "cast-political-ballot" }) };
        })
      }),
      levelModule("proposals", { fa: "پیشنهادهای شهروندی", en: "Citizen proposals" }, "proposals", { items: proposals.map(publicProposalView) }),
      levelModule("history", { fa: "تاریخ مشارکت", en: "Participation history" }, "history", { items: participantProfile.history })
    );
  }

  if (level.id === 4) {
    const myTasks = tasks.filter((task) => task.organizationId === "ORG-SYN-01");
    const myOrg = organizations.find((org) => org.id === "ORG-SYN-01");
    modules.push(
      levelModule("identity", { fa: "هویت سازمانی", en: "Organizational identity" }, "identity", { organization: myOrg }),
      levelModule("members", { fa: "اعضا و نقش‌ها", en: "Members and roles" }, "members", { members: myTasks.flatMap((task) => task.members) }),
      levelModule("tasks", { fa: "مدیریت کار", en: "Task management" }, "tasks", { items: myTasks }),
      levelModule("contracts", { fa: "کارپوشهٔ قرارداد", en: "Contract registry" }, "contracts", { items: myTasks.map((task) => ({ id: `CTR-${task.id}`, taskId: task.id, organizationId: task.organizationId, budget: task.budget })) }),
      levelModule("deliverables", { fa: "تحویل‌شدنی‌ها", en: "Deliverables" }, "deliverables", { items: deliverables.filter((item) => item.organizationId === "ORG-SYN-01") }),
      levelModule("budget", { fa: "بودجهٔ ساختگی", en: "Synthetic budget" }, "finance", { items: myTasks.map((task) => task.budget) }),
      levelModule("audits", { fa: "حسابرسی‌ها", en: "Audits" }, "audit", { items: auditLog.filter((entry) => entry.actor === "ORG-SYN-01") }),
      levelModule("accountability", { fa: "پاسخگویی عمومی", en: "Public accountability" }, "reports", { reports: publicReports, note: myOrg.disclaimer }),
      levelModule("boundary", { fa: "مرز اختیار سازمان", en: "Limits of the organization" }, "boundary", {
        can: [
          { fa: "ارسال پیشنهاد فنی", en: "Submit technical proposals" },
          { fa: "پاسخ به فرصت‌های خرید خدمت", en: "Respond to procurement opportunities" },
          { fa: "ارائهٔ شواهد و گزارش هزینه", en: "Provide evidence and cost reports" }
        ],
        cannot: [
          { fa: "اعمال برگهٔ رأی اعضای خود", en: "Exercise its members' individual ballots" },
          { fa: "تصاحب اختیار نهاد ناظر", en: "Assume oversight authority" }
        ]
      })
    );
  }

  if (level.id === 5) {
    modules.push(
      levelModule("queue", { fa: "صف پیشنهادها", en: "Proposal queue" }, "queue", {
        // The full arithmetic travels with the queue item, so the committee can
        // open the calculation instead of being told to trust a score.
        items: proposals.map((proposal) => ({
          ...publicProposalView(proposal),
          calcs: POLICY_IDS.map((policyId) => qualificationFor(proposal.id, policyId))
        }))
      }),
      levelModule("committee", { fa: "کارپوشهٔ کمیته", en: "Committee directory" }, "committee", { committee }),
      levelModule("evidence", { fa: "بازبینی شواهد", en: "Evidence review" }, "evidence", { reviews: evidenceReviews, items: evidenceRecords }),
      levelModule("consultation", { fa: "نتایج مشاورهٔ عمومی", en: "Public consultation results" }, "consultation", {
        contributions: proposals.map((proposal) => ({ proposalId: proposal.id, ...proposal.contributions })),
        polls: participantProfile.polls,
        mobilizations
      }),
      levelModule("participation", { fa: "خلاصهٔ مشارکت سیاسی", en: "Political participation summary" }, "ballot", { ballot: ballotView(policyId), totals: proposals.map((proposal) => ({ proposalId: proposal.id, political: proposal.contributions.political })) }),
      levelModule("professional", { fa: "ارزیابی‌های تخصصی", en: "Professional assessments" }, "professional", { assessments: professionalAssessments.map((assessment) => ({ ...assessment, weight: computeProfessionalWeight(assessment, policyId) })), proposals: proposals.map((proposal) => ({ id: proposal.id, title: proposal.title, domain: proposal.domain })) }),
      levelModule("impact", { fa: "تحلیل اثر مالی", en: "Financial impact analysis" }, "finance", { proposals: proposals.map((proposal) => ({ id: proposal.id, budget: proposal.budget })), reports: publicReports }),
      levelModule("decisions", { fa: "تأییدهای ساختگی", en: "Simulated approvals" }, "decisions", { items: committeeDecisions, policy: { id: policy.id, status: policy.status } }),
      levelModule("tasks", { fa: "آغاز کار و نظارت سطح ۴", en: "Task initiation and level-4 oversight" }, "tasks", { items: tasks }),
      levelModule("conflicts", { fa: "اعلام تعارض منافع", en: "Conflict-of-interest declarations" }, "conflicts", { items: conflictDeclarations, rule: committee.separationOfDuties }),
      levelModule("audit", { fa: "گزارش حسابرسی", en: "Audit log" }, "audit", { items: auditLog })
    );
  }

  return {
    level: { ...level, actions: level.actions.map((actionId) => ({ id: actionId, ...ACTION_SUMMARY[actionId] })) },
    policy: { id: policy.id, label: policy.label, status: policy.status, authorizedBy: policy.authorizedBy, note: policy.limits.note },
    modules,
    guards: INFLUENCE_GUARDS,
    workflow,
    posthumous: {
      mandate: posthumousMandate,
      ballotAttempt: evaluatePosthumousMandate({ ...posthumousMandate, requestedAction: "cast-political-ballot" }),
      memoirAttempt: evaluatePosthumousMandate({ ...posthumousMandate, requestedAction: "publish-memoir" })
    }
  };
}

const ACTION_SUMMARY = Object.freeze({
  "read-public-record": { leadsTo: { fa: "سوابق عمومی", en: "Public records" } },
  "inspect-financial-summary": { leadsTo: { fa: "خلاصهٔ مالی", en: "Financial summary" } },
  "inspect-endorsement-record": { leadsTo: { fa: "سابقهٔ تأیید", en: "Endorsement record" } },
  "compare-policy-configurations": { leadsTo: { fa: "مقایسهٔ سیاست‌ها", en: "Policy comparison" } },
  "read-own-private-record": { leadsTo: { fa: "رکورد شخصی خود", en: "Own private record" } },
  "present-selective-credential": { leadsTo: { fa: "اثبات گزینشی", en: "Selective proof" } },
  "manage-consent": { leadsTo: { fa: "مدیریت رضایت", en: "Consent management" } },
  "join-scoped-consultation": { leadsTo: { fa: "مشاورهٔ دامنه‌دار", en: "Scoped consultation" } },
  "cast-political-ballot": { leadsTo: { fa: "برگهٔ رأی سیاسی", en: "Political ballot" } },
  "answer-poll": { leadsTo: { fa: "نظرسنجی", en: "Poll" } },
  "submit-citizen-proposal": { leadsTo: { fa: "پیشنهاد شهروندی", en: "Citizen proposal" } },
  "delegate-scoped-authority": { leadsTo: { fa: "واگذاری اختیار", en: "Delegation" } },
  "read-own-assignment": { leadsTo: { fa: "کار واگذارشده", en: "Assigned work" } },
  "submit-deliverable": { leadsTo: { fa: "تحویل‌شدنی", en: "Deliverable" } },
  "respond-to-procurement": { leadsTo: { fa: "فرصت خرید خدمت", en: "Procurement opportunity" } },
  "publish-progress-report": { leadsTo: { fa: "گزارش پیشرفت", en: "Progress report" } },
  "read-committee-queue": { leadsTo: { fa: "صف کمیته", en: "Committee queue" } },
  "record-scoped-decision": { leadsTo: { fa: "تصمیم دامنه‌دار", en: "Scoped decision" } },
  "commission-task": { leadsTo: { fa: "واگذاری کار", en: "Task commission" } },
  "review-deliverable": { leadsTo: { fa: "بازبینی تحویل", en: "Deliverable review" } },
  "declare-conflict": { leadsTo: { fa: "اعلام تعارض", en: "Conflict declaration" } },
  "publish-decision-report": { leadsTo: { fa: "گزارش تصمیم", en: "Decision report" } }
});

/** Public summary of the influence architecture, used by the comparison view. */
export function buildInfluenceOverview() {
  return {
    policies: POLICY_IDS.map((policyId) => {
      const policy = WEIGHTING_POLICIES[policyId];
      return {
        id: policy.id,
        label: policy.label,
        status: policy.status,
        authorizedBy: policy.authorizedBy,
        authorizedByLabel: policy.authorizedByLabel,
        thresholds: policy.thresholds,
        categories: policy.categories,
        limits: policy.limits
      };
    }),
    proposals: proposals.map((proposal) => ({
      id: proposal.id,
      title: proposal.title,
      domain: proposal.domain,
      contributions: proposal.contributions,
      results: POLICY_IDS.map((policyId) => qualificationFor(proposal.id, policyId))
    })),
    endorsements: endorsementBreakdown("P-OPEN-DRAFT"),
    advocates,
    professionalAssessments: professionalAssessments.map((assessment) => ({
      ...assessment,
      weight: computeProfessionalWeight(assessment, "P-OPEN-DRAFT")
    })),
    guards: INFLUENCE_GUARDS,
    ballots: POLICY_IDS.map((policyId) => ballotView(policyId))
  };
}

export function buildInfluenceGuards() {
  return INFLUENCE_GUARDS;
}

/** Everything the five-level home screen needs, in one payload. */
export function buildLevelsIndex() {
  return {
    levels: buildLevelRegistry(),
    guards: INFLUENCE_GUARDS,
    workflow,
    policies: POLICY_IDS.map((policyId) => {
      const policy = WEIGHTING_POLICIES[policyId];
      return { id: policy.id, label: policy.label, status: policy.status, authorizedBy: policy.authorizedBy, limits: policy.limits, thresholds: policy.thresholds, categories: policy.categories };
    }),
    comparison: proposals.map((proposal) => ({
      id: proposal.id,
      title: proposal.title,
      domain: proposal.domain,
      stage: proposal.stage,
      contributions: proposal.contributions,
      results: POLICY_IDS.map((policyId) => qualificationFor(proposal.id, policyId))
    }))
  };
}

export function buildLevelRegistry() {
  return CIVIC_LEVELS.map((level) => ({
    id: level.id,
    key: level.key,
    title: level.title,
    purpose: level.purpose,
    holdsBallot: level.holdsBallot,
    actionCount: level.actions.length,
    actions: level.actions
  }));
}

export { authorizeAction };
