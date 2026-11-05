// The referendum instrument: the arithmetic of a future vote, and nothing more.
//
// The published transition roadmap this prototype works alongside sets out a
// sequence of at least four votes — the form of government, a constituent
// assembly, the ratification of a constitution, and then a government. (See
// `docs/strategy/IPP-RECONCILIATION.md` for what is sourced and what is not.)
// What software can do about that sequence is narrow and worth doing exactly:
// publish the rule before the count, show the quorum arithmetic, count invalid
// ballots apart, and refuse to declare a winner when the rule says there is none.
//
// What software cannot do is also stated, in `gates`: a real referendum needs a
// legal mandate, a voter roll, ballot secrecy, accredited observers and a dispute
// body. CEP is none of those, and this module refuses to pretend otherwise.

export const REFERENDUM_POSTURE = Object.freeze({
  isElectionAuthority: false,
  isGovernment: false,
  holdsVoterRoll: false,
  recordsRealBallots: false,
  status: "rehearsal-only",
  notice: {
    fa: "این ابزار یک تمرین حساب است، نه یک مرجع انتخاباتی. هیچ رأی واقعی ثبت نمی‌شود، هیچ فهرست رأی‌دهنده‌ای وجود ندارد و هیچ نتیجه‌ای الزام‌آور نیست.",
    en: "This tool is an arithmetic rehearsal, not an electoral authority. No real ballot is recorded, there is no voter roll, and no result is binding."
  }
});

export const DECISION_RULES = Object.freeze([
  {
    id: "plurality",
    label: { fa: "بیشترین رأی", en: "Plurality" },
    note: {
      fa: "گزینهٔ اول پذیرفته می‌شود، به شرط عبور از نصاب مشارکت؛ برای پرسش چندگزینه‌ای به دور دوم نیاز نیست.",
      en: "The leading option is accepted provided turnout clears the quorum; a multi-option question needs no runoff."
    }
  },
  {
    id: "majority-of-valid",
    label: { fa: "اکثریت آرای معتبر", en: "Majority of valid votes" },
    note: {
      fa: "گزینهٔ برنده باید بیش از نیمی از آرای معتبر را بگیرد؛ وگرنه به دور دوم می‌رود.",
      en: "The winning option must take more than half of the valid votes, or the question goes to a runoff."
    }
  },
  {
    id: "supermajority",
    label: { fa: "اکثریت ویژه", en: "Supermajority" },
    note: {
      fa: "آستانهٔ بالاتر از نیمی از آرا، برای پرسش‌هایی که تغییر بنیادین را می‌سنجند؛ برنده باید از آستانه بگذرد، نه آنکه به آن برسد.",
      en: "A threshold above half the valid votes, for questions that measure fundamental change; the winner must pass the threshold, not reach it."
    }
  }
]);

// The four questions, in the order the published roadmap puts them. `dependsOn`
// is the part that makes this a chain rather than four unrelated surveys.
export const REFERENDUM_SEQUENCE = Object.freeze([
  {
    id: "REF-Q1",
    order: 1,
    slug: "form-of-government",
    question: {
      fa: "شکل حکومت آیندهٔ ایران چه باشد؟",
      en: "What form of government should Iran have?"
    },
    why: {
      fa: "پرسش نخست، پیش از هر نهادسازی، خودِ شکل حکومت را می‌پرسد؛ گزینه‌ها از پیش برنده اعلام نمی‌شوند.",
      en: "The first question asks the form of government itself, before any institution-building; no option is declared the winner in advance."
    },
    options: [
      { id: "parliamentary-republic", label: { fa: "جمهوری پارلمانی", en: "Parliamentary republic" } },
      { id: "presidential-republic", label: { fa: "جمهوری ریاستی", en: "Presidential republic" } },
      { id: "constitutional-monarchy", label: { fa: "پادشاهی مشروطه", en: "Constitutional monarchy" } },
      { id: "assembly-decides", label: { fa: "واگذاری به مجمع مؤسسان", en: "Leave it to the constituent assembly" } }
    ],
    decisionRule: "plurality",
    quorum: 0.5,
    threshold: 0,
    dependsOn: [],
    observers: "required"
  },
  {
    id: "REF-Q2",
    order: 2,
    slug: "constituent-assembly",
    question: {
      fa: "مجمع مؤسسان چگونه انتخاب شود؟",
      en: "How should the constituent assembly be elected?"
    },
    why: {
      fa: "روش انتخاب، پیش از انتخاب تعیین می‌شود؛ تغییر آن پس از آغاز نام‌نویسی مجاز نیست.",
      en: "The method is fixed before the election; changing it after nominations open is not allowed."
    },
    options: [
      { id: "proportional", label: { fa: "فهرست‌های نسبی", en: "Proportional lists" } },
      { id: "districts", label: { fa: "حوزه‌های تک‌نماینده", en: "Single-member districts" } },
      { id: "mixed", label: { fa: "ترکیبی", en: "Mixed" } }
    ],
    decisionRule: "plurality",
    quorum: 0.5,
    threshold: 0,
    dependsOn: ["REF-Q1"],
    observers: "required"
  },
  {
    id: "REF-Q3",
    order: 3,
    slug: "ratification",
    question: {
      fa: "قانون اساسی پیشنهادی مجمع مؤسسان تصویب شود؟",
      en: "Should the constitution proposed by the constituent assembly be ratified?"
    },
    why: {
      fa: "تصویب، پرسشی دوگزینه‌ای با آستانهٔ بالاست؛ متن پیش از رأی منتشر می‌شود و پس از آن تغییر نمی‌کند.",
      en: "Ratification is a two-option question at a high threshold; the text is published before the vote and does not change after it."
    },
    options: [
      { id: "ratify", label: { fa: "تصویب", en: "Ratify" } },
      { id: "reject", label: { fa: "رد", en: "Reject" } }
    ],
    decisionRule: "majority-of-valid",
    quorum: 0.5,
    threshold: 0.55,
    dependsOn: ["REF-Q2"],
    observers: "required"
  },
  {
    id: "REF-Q4",
    order: 4,
    slug: "government",
    question: {
      fa: "نخستین دولت پس از تصویب، چگونه شکل بگیرد؟",
      en: "How should the first government after ratification be formed?"
    },
    why: {
      fa: "پس از تصویب، نوبت به دولت می‌رسد؛ اگر آستانهٔ اکثریت برآورده نشود، دور دوم اعلام می‌شود و نه برنده.",
      en: "After ratification comes the government; if the majority threshold is not met, a runoff is declared and not a winner."
    },
    options: [
      { id: "elected-list", label: { fa: "دولت برآمده از فهرست‌های انتخاباتی", en: "A government from elected lists" } },
      { id: "caretaker", label: { fa: "دولت موقت تا انتخابات بعدی", en: "A caretaker until the next election" } }
    ],
    decisionRule: "supermajority",
    quorum: 0.5,
    threshold: 0.55,
    dependsOn: ["REF-Q3"],
    observers: "required"
  }
]);

// What would have to exist before any of this counted. Written as gates rather
// than as a disclaimer, because a disclaimer is what a project writes when it
// does not want to be held to anything.
export const REFERENDUM_GATES = Object.freeze([
  { id: "legal-mandate", fa: "مبنای حقوقی روشن برای برگزاری و برای پذیرش نتیجه.", en: "A clear legal basis for holding the vote and for accepting the result." },
  { id: "voter-roll", fa: "فهرست رأی‌دهندهٔ مستقل و قابل اعتراض، بیرون از این سامانه.", en: "An independent, challengeable voter roll, outside this system." },
  { id: "ballot-secrecy", fa: "رأی مخفی با تضمین فنی و انسانی؛ این نمونه هیچ رأیی ثبت نمی‌کند.", en: "A secret ballot with technical and human guarantees; this prototype records no ballot." },
  { id: "observers", fa: "ناظران مستقل با دسترسی به همهٔ صندوق‌ها و همهٔ شمارش‌ها.", en: "Independent observers with access to every box and every count." },
  { id: "published-rules", fa: "انتشار نصاب، آستانه و آیین شمارش پیش از آغاز رأی‌گیری.", en: "Publication of quorum, threshold and counting rules before voting opens." },
  { id: "dispute-body", fa: "مرجع رسیدگی به شکایت با اختیار ابطال و بازشماری.", en: "A dispute body with the power to annul and recount." },
  { id: "no-standing-power", fa: "هیچ مقام صاحب‌منصبی از دل این سامانه بیرون نمی‌آید.", en: "No office-holder emerges from this system." }
]);

// Pure arithmetic. Kept separate from the data so the rules can be tested
// without a browser, an election, or a claim about the world.
export function computeReferendumOutcome({ castShare, invalidShare = 0, votes, decisionRule = "plurality", quorum = 0.5, threshold = 0 } = {}) {
  const cast = Number(castShare);
  const invalid = Number(invalidShare);
  const voteEntries = Object.entries(votes ?? {});
  const totalVotes = voteEntries.reduce((sum, [, share]) => sum + Number(share), 0);
  const reasons = [];

  if (!(cast >= 0 && cast <= 1)) {
    return { ok: false, code: "invalid-turnout", reasons: [{ fa: "مشارکت باید نسبتی میان صفر و یک باشد.", en: "Turnout must be a share between zero and one." }] };
  }
  if (voteEntries.length < 2) {
    return { ok: false, code: "needs-two-options", reasons: [{ fa: "پرسش رفراندوم به کمینه دو گزینه نیاز دارد.", en: "A referendum question needs at least two options." }] };
  }
  if (!(totalVotes > 0)) {
    return { ok: false, code: "no-votes", reasons: [{ fa: "هیچ رأی معتبری شمرده نشده است.", en: "No valid votes were counted." }] };
  }

  const quorumMet = cast >= quorum;
  if (!quorumMet) {
    reasons.push({
      fa: "نصاب مشارکت برآورده نشد؛ نتیجه هر چه باشد پذیرفته نیست.",
      en: "The turnout quorum was not met; no result is accepted, whatever the count."
    });
  }

  const shares = Object.fromEntries(voteEntries.map(([id, share]) => [id, Number(share) / totalVotes]));
  const ranked = Object.entries(shares).sort((a, b) => b[1] - a[1]);
  const [leaderId, leaderShare] = ranked[0];
  const runnerUp = ranked[1];

  let accepted = quorumMet;
  let outcome = "accepted";
  if (decisionRule === "majority-of-valid" && leaderShare <= 0.5) {
    accepted = false;
    outcome = "runoff";
    reasons.push({ fa: "هیچ گزینه‌ای بیش از نیمی از آرای معتبر را نگرفت؛ دور دوم لازم است.", en: "No option took more than half the valid votes; a runoff is required." });
  }
  // Strictly above the threshold: exactly 60 % does not clear a 60 % bar.
  if (decisionRule === "supermajority" && leaderShare <= threshold) {
    accepted = false;
    outcome = "runoff";
    reasons.push({
      fa: "آستانهٔ اکثریت ویژه برآورده نشد؛ برنده اعلام نمی‌شود.",
      en: "The supermajority threshold was not met; no winner is declared."
    });
  }
  if (!quorumMet) outcome = "failed-quorum";

  return {
    ok: true,
    turnout: cast,
    invalid: invalid,
    validShare: Math.round((cast - invalid) * 1000) / 1000,
    quorum,
    quorumMet,
    threshold,
    decisionRule,
    shares: Object.fromEntries(ranked),
    leader: { id: leaderId, share: Math.round(leaderShare * 1000) / 1000 },
    runnerUp: runnerUp ? { id: runnerUp[0], share: Math.round(runnerUp[1] * 1000) / 1000 } : null,
    margin: runnerUp ? Math.round((leaderShare - runnerUp[1]) * 1000) / 1000 : null,
    accepted,
    outcome,
    reasons
  };
}

// Four rehearsals, one per question. The third is deliberately a failure: an
// instrument whose only examples pass is a brochure, not a quorum calculator.
const RAW_REHEARSALS = [
  {
    questionId: "REF-Q1",
    castShare: 0.58,
    invalidShare: 0.02,
    votes: { "parliamentary-republic": 0.21, "presidential-republic": 0.14, "constitutional-monarchy": 0.19, "assembly-decides": 0.02 },
    note: { fa: "تمرین: هیچ گزینه‌ای از نیمهٔ آرا نگذشت؛ با قاعدهٔ بیشترین رأی، گزینهٔ اول پذیرفته است.", en: "Rehearsal: no option passed half the votes; under plurality the leading option is accepted." }
  },
  {
    questionId: "REF-Q2",
    castShare: 0.54,
    invalidShare: 0.01,
    votes: { proportional: 0.3, districts: 0.15, mixed: 0.08 },
    note: { fa: "تمرین: روش انتخاب با مشارکت کافی و بدون دور دوم تعیین شد.", en: "Rehearsal: the election method is settled with sufficient turnout and no runoff." }
  },
  {
    questionId: "REF-Q3",
    castShare: 0.47,
    invalidShare: 0.02,
    votes: { ratify: 0.31, reject: 0.14 },
    note: { fa: "تمرین: نصاب مشارکت برآورده نشد؛ تصویب اعلام نمی‌شود، هرچند «تصویب» بیشترین رأی را داشت.", en: "Rehearsal: the turnout quorum failed; ratification is not declared even though 'ratify' led." }
  },
  {
    questionId: "REF-Q4",
    castShare: 0.61,
    invalidShare: 0.03,
    votes: { "elected-list": 0.3, caretaker: 0.28 },
    note: { fa: "تمرین: آستانهٔ اکثریت ویژه برآورده نشد؛ دور دوم اعلام می‌شود و نه برنده.", en: "Rehearsal: the supermajority threshold failed; a runoff is declared, not a winner." }
  }
];

const QUESTION_BY_ID = new Map(REFERENDUM_SEQUENCE.map((question) => [question.id, question]));

function rehearse(raw) {
  const question = QUESTION_BY_ID.get(raw.questionId);
  if (!question) throw new Error(`rehearsal references unknown question: ${raw.questionId}`);
  const outcome = computeReferendumOutcome({
    castShare: raw.castShare,
    invalidShare: raw.invalidShare,
    votes: raw.votes,
    decisionRule: question.decisionRule,
    quorum: question.quorum,
    threshold: question.threshold
  });
  if (!outcome.ok) throw new Error(`rehearsal for ${raw.questionId} is not computable: ${outcome.code}`);
  return {
    id: `REH-${question.id}`,
    questionId: question.id,
    order: question.order,
    question: question.question,
    options: question.options,
    synthetic: true,
    note: raw.note,
    ...outcome
  };
}

export const referendumRehearsals = Object.freeze(RAW_REHEARSALS.map(rehearse));

export function buildReferendum() {
  return {
    posture: REFERENDUM_POSTURE,
    decisionRules: DECISION_RULES,
    sequence: REFERENDUM_SEQUENCE,
    gateList: REFERENDUM_GATES,
    rehearsals: referendumRehearsals.map((entry) => ({ ...entry })),
    summary: {
      questions: REFERENDUM_SEQUENCE.length,
      rehearsed: referendumRehearsals.length,
      accepted: referendumRehearsals.filter((entry) => entry.accepted).length,
      refused: referendumRehearsals.filter((entry) => !entry.accepted).length,
      openGates: REFERENDUM_GATES.length
    },
    method: {
      fa: "برای هر پرسش، قاعده پیش از شمارش منتشر می‌شود: نصاب مشارکت، آستانه و آیین شمارش. آرای باطل جدا شمرده می‌شوند و اگر نصاب یا آستانه برآورده نشود، سامانه برنده اعلام نمی‌کند — حتی اگر یک گزینه بیشترین رأی را داشته باشد.",
      en: "For each question the rule is published before the count: turnout quorum, threshold and counting method. Invalid ballots are counted apart, and when quorum or threshold fails the system declares no winner — even if one option led."
    }
  };
}

export function rehearseQuestion({ castShare, invalidShare = 0, votes, decisionRule = "plurality", quorum = 0.5, threshold = 0 }) {
  return computeReferendumOutcome({ castShare, invalidShare, votes, decisionRule, quorum, threshold });
}
