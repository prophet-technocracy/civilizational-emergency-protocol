// Simulated civic session — the interactive layer of the five levels.
//
// Everything here happens in this browser tab and nowhere else: no request is
// written back to the API, nothing is persisted, and no action claims a legal
// effect. The reducer is a pure function so the behaviour (including every
// refusal) is unit-testable without rendering anything.
//
// Two rules shape the whole module:
//   1. A refused action changes nothing except the audit entry that records the
//      refusal. The demo is allowed to fail visibly, never silently.
//   2. Arithmetic is imported from @cep/domain-models, not re-implemented, so an
//      interactive ballot uses the same formula as the server-side view.

import {
  authorizeAction,
  computePoliticalBallot,
  computeProfessionalWeight,
  validateDelegation
} from "@cep/domain-models";

export const DEMO_CLOCK_START = "2026-01-04T09:12:00Z";
const MAX_AUDIT = 60;

/** Bilingual copy for every refusal and acknowledgement. */
export const SIM_MESSAGES = {
  recorded: { fa: "ثبت شد در همین نشست", en: "Recorded in this session" },
  ballotCast: { fa: "برگهٔ رأی سیاسی ثبت شد (شبیه‌سازی)", en: "Political ballot recorded (simulated)" },
  ballotWithdrawn: { fa: "برگهٔ رأی پس‌گرفته شد", en: "Ballot withdrawn" },
  alreadyCast: { fa: "برگهٔ رأی یک‌بار ثبت شده است", en: "The ballot was already cast" },
  noFranchise: { fa: "این نشست صلاحیت رأی ندارد", en: "This session holds no franchise" },
  pollRecorded: { fa: "پاسخ نظرسنجی ثبت شد", en: "Poll answer recorded" },
  proposalRecorded: { fa: "پیشنهاد شهروندی ثبت شد (شبیه‌سازی)", en: "Citizen proposal recorded (simulated)" },
  proposalTooShort: { fa: "عنوان پیشنهاد دست‌کم ۶ نویسه باشد", en: "A proposal title needs at least 6 characters" },
  consentUpdated: { fa: "وضعیت رضایت به‌روزرسانی شد", en: "Consent updated" },
  attributeToggled: { fa: "فهرست ویژگی‌های افشاشده تغییر کرد", en: "Disclosed attribute list changed" },
  requestRecorded: { fa: "درخواست خصوصی ثبت شد (شبیه‌سازی)", en: "Private request recorded (simulated)" },
  requestTooShort: { fa: "موضوع درخواست دست‌کم ۳ نویسه باشد", en: "A request subject needs at least 3 characters" },
  taskAccepted: { fa: "کار پذیرفته شد", en: "Task accepted" },
  spendLogged: { fa: "هزینهٔ ساختگی ثبت شد", en: "Synthetic spend logged" },
  spendInvalid: { fa: "مبلغ باید عددی مثبت و در سقف بودجه باشد", en: "The amount must be positive and within budget" },
  deliverableSubmitted: { fa: "تحویل‌شدنی ثبت شد (شبیه‌سازی)", en: "Deliverable submitted (simulated)" },
  requireAcceptedTask: { fa: "نخست کار را بپذیرید", en: "Accept the task first" },
  decisionRecorded: { fa: "تصمیم دامنه‌دار ثبت شد (غیرالزام‌آور)", en: "Scoped decision recorded (non-binding)" },
  reasonTooShort: { fa: "دلیل تصمیم دست‌کم ۲۰ نویسه باشد", en: "A decision reason needs at least 20 characters" },
  conflictDeclared: { fa: "تعارض منافع اعلام و عضو کنار گذاشته شد", en: "Conflict declared and the member recused" },
  conflictCleared: { fa: "اعلام تعارض برداشته شد", en: "Conflict declaration withdrawn" },
  taskCommissioned: { fa: "کار به گرهٔ سازمانی واگذار شد (شبیه‌سازی)", en: "Task commissioned to an organizational node (simulated)" },
  blockedMemberBallot: {
    fa: "سازمان نمی‌تواند برگهٔ رأی اعضای خود را اعمال کند",
    en: "An organization cannot exercise its members' ballots"
  },
  blockedOutOfScope: { fa: "این کنش بیرون از اختیار این سطح است", en: "This action is outside this level's authority" },
  unknownAction: { fa: "کنش ناشناخته است", en: "Unknown action" }
};

export function createSession() {
  return {
    seq: 0,
    ballot: { cast: false, castAt: null, delegationIds: [] },
    polls: {},
    proposals: [],
    consents: {},
    disclosedAttributes: null,
    requests: [],
    tasks: {},
    decisions: [],
    conflicts: {},
    commissions: [],
    audit: []
  };
}

const stamp = (seq) => {
  const start = Date.parse(DEMO_CLOCK_START);
  return new Date(start + seq * 60_000).toISOString();
};

const note = (key) => SIM_MESSAGES[key] ?? SIM_MESSAGES.unknownAction;

function record(state, { level, action, target, outcome, message, blocked = false }) {
  const seq = state.seq + 1;
  const entry = {
    id: `SIM-${String(seq).padStart(3, "0")}`,
    seq,
    at: stamp(seq),
    level,
    action,
    target,
    outcome,
    blocked,
    message
  };
  return { ...state, seq, audit: [entry, ...state.audit].slice(0, MAX_AUDIT) };
}

/** A refusal: only the audit entry changes. */
function refuse(state, details) {
  return record(state, { ...details, outcome: "blocked", blocked: true });
}

function accept(state, details, patch) {
  const withEntry = record(state, { ...details, outcome: "recorded", blocked: false });
  return { ...withEntry, ...patch };
}

/**
 * The reducer. `context` carries the fixtures a decision needs (franchise,
 * delegations, budget, committee id) so the reducer never reads module state.
 */
export function reduceSession(state, action, fallbackContext = {}) {
  const { level } = action;
  // Context travels with the action (the React hook dispatches it) with a
  // fallback for direct calls from tests.
  const context = action.context ?? fallbackContext;
  const base = { level, target: action.target ?? null };

  switch (action.type) {
    case "reset":
      return createSession();

    case "toggle-delegation": {
      const delegation = (context.delegations ?? []).find((item) => item.id === action.delegationId);
      if (!delegation) return refuse(state, { ...base, action: action.type, message: note("unknownAction") });
      const enabled = state.ballot.delegationIds.includes(delegation.id);
      const check = validateDelegation(delegation, { at: DEMO_CLOCK_START, actionId: "cast-political-ballot" });
      if (!enabled && !check.allowed) {
        return refuse(state, { ...base, action: action.type, target: delegation.id, message: check.reason });
      }
      if (check.allowed === false && enabled) {
        // Switching off an invalid delegation is always allowed.
      }
      const delegationIds = enabled
        ? state.ballot.delegationIds.filter((id) => id !== delegation.id)
        : [...state.ballot.delegationIds, delegation.id];
      return accept(
        state,
        { ...base, action: action.type, target: delegation.id, message: note("recorded") },
        { ballot: { ...state.ballot, delegationIds } }
      );
    }

    case "cast-ballot": {
      const authorization = authorizeAction({ level, actionId: "cast-political-ballot", actor: context.citizenId });
      if (!authorization.allowed) {
        return refuse(state, { ...base, action: action.type, message: authorization.reason });
      }
      if (state.ballot.cast) return refuse(state, { ...base, action: action.type, message: note("alreadyCast") });
      if (context.franchise === false) return refuse(state, { ...base, action: action.type, message: note("noFranchise") });
      const seqStamp = stamp(state.seq + 1);
      return accept(state, { ...base, action: action.type, message: note("ballotCast") }, {
        ballot: { ...state.ballot, cast: true, castAt: seqStamp }
      });
    }

    case "withdraw-ballot": {
      if (!state.ballot.cast) return refuse(state, { ...base, action: action.type, message: note("alreadyCast") });
      return accept(state, { ...base, action: action.type, message: note("ballotWithdrawn") }, {
        ballot: { ...state.ballot, cast: false, castAt: null }
      });
    }

    case "answer-poll": {
      if (!action.pollId || !action.optionId) {
        return refuse(state, { ...base, action: action.type, message: note("unknownAction") });
      }
      return accept(state, { ...base, action: action.type, target: action.pollId, message: note("pollRecorded") }, {
        polls: { ...state.polls, [action.pollId]: action.optionId }
      });
    }

    case "submit-proposal": {
      const title = String(action.title ?? "").trim();
      if (title.length < 6) return refuse(state, { ...base, action: action.type, message: note("proposalTooShort") });
      const id = `CIT-PROP-${String(state.proposals.length + 1).padStart(3, "0")}`;
      const proposal = { id, title, domain: action.domain ?? "civic-services", submittedAt: stamp(state.seq + 1) };
      return accept(state, { ...base, action: action.type, target: id, message: note("proposalRecorded") }, {
        proposals: [proposal, ...state.proposals]
      });
    }

    case "set-consent": {
      return accept(state, { ...base, action: action.type, target: action.consentId, message: note("consentUpdated") }, {
        consents: { ...state.consents, [action.consentId]: Boolean(action.granted) }
      });
    }

    case "toggle-attribute": {
      // First interaction starts from the fixture's disclosed set, which the
      // panel passes along, so the toggle never has to guess an empty list.
      const current = state.disclosedAttributes ?? action.fallbackAttributes ?? null;
      if (!current) return refuse(state, { ...base, action: action.type, message: note("unknownAction") });
      const next = current.includes(action.attribute)
        ? current.filter((attribute) => attribute !== action.attribute)
        : [...current, action.attribute];
      return accept(state, { ...base, action: action.type, target: action.attribute, message: note("attributeToggled") }, {
        disclosedAttributes: next
      });
    }

    case "request-service": {
      const subject = String(action.subject ?? "").trim();
      if (subject.length < 3) return refuse(state, { ...base, action: action.type, message: note("requestTooShort") });
      const id = `REQ-SIM-${String(state.requests.length + 1).padStart(3, "0")}`;
      return accept(state, { ...base, action: action.type, target: id, message: note("requestRecorded") }, {
        requests: [{ id, subject, state: "submitted-simulated", requestedAt: stamp(state.seq + 1) }, ...state.requests]
      });
    }

    case "accept-task": {
      const task = (context.tasks ?? []).find((item) => item.id === action.taskId);
      if (!task) return refuse(state, { ...base, action: action.type, message: note("unknownAction") });
      return accept(state, { ...base, action: action.type, target: task.id, message: note("taskAccepted") }, {
        tasks: { ...state.tasks, [task.id]: { ...(state.tasks[task.id] ?? {}), accepted: true, spend: state.tasks[task.id]?.spend ?? task.budget.spent } }
      });
    }

    case "log-spend": {
      const task = (context.tasks ?? []).find((item) => item.id === action.taskId);
      const current = state.tasks[action.taskId] ?? {};
      if (!task || !current.accepted) return refuse(state, { ...base, action: action.type, message: note("requireAcceptedTask") });
      const amount = Number(action.amount);
      if (!Number.isFinite(amount) || amount <= 0 || amount > task.budget.allocated) {
        return refuse(state, { ...base, action: action.type, target: task.id, message: note("spendInvalid") });
      }
      return accept(state, { ...base, action: action.type, target: task.id, message: note("spendLogged") }, {
        tasks: { ...state.tasks, [task.id]: { ...current, spend: amount } }
      });
    }

    case "submit-deliverable": {
      const current = state.tasks[action.taskId] ?? {};
      if (!current.accepted) return refuse(state, { ...base, action: action.type, message: note("requireAcceptedTask") });
      const title = String(action.title ?? "").trim();
      if (title.length < 6) return refuse(state, { ...base, action: action.type, message: note("proposalTooShort") });
      return accept(state, { ...base, action: action.type, target: action.taskId, message: note("deliverableSubmitted") }, {
        tasks: { ...state.tasks, [action.taskId]: { ...current, deliverable: title, submittedAt: stamp(state.seq + 1) } }
      });
    }

    case "attempt-member-ballot": {
      // A structural refusal, not a permission setting: the check is first.
      return refuse(state, { ...base, action: action.type, target: action.taskId ?? null, message: note("blockedMemberBallot") });
    }

    case "record-decision": {
      // The acting body is the committee; the individual member is recorded on
      // the decision, because separation of duties lives at the committee level.
      const authorization = authorizeAction({
        level,
        actionId: "record-scoped-decision",
        actor: action.committeeId ?? context.committeeId,
        resource: { committeeId: action.committeeId ?? context.committeeId }
      });
      if (!authorization.allowed) {
        return refuse(state, { ...base, action: action.type, message: authorization.reason });
      }
      if (action.committeeId && context.committeeId && action.committeeId !== context.committeeId) {
        return refuse(state, { ...base, action: action.type, message: note("blockedOutOfScope") });
      }
      const reason = String(action.reason ?? "").trim();
      if (reason.length < 20) return refuse(state, { ...base, action: action.type, message: note("reasonTooShort") });
      if (!action.proposalId) return refuse(state, { ...base, action: action.type, message: note("unknownAction") });
      const id = `DEC-SIM-${String(state.decisions.length + 1).padStart(3, "0")}`;
      return accept(state, { ...base, action: action.type, target: id, message: note("decisionRecorded") }, {
        decisions: [
          {
            id,
            proposalId: action.proposalId,
            reason,
            by: action.actor ?? null,
            actor: action.committeeId ?? context.committeeId,
            at: stamp(state.seq + 1),
            kind: "synthetic-not-binding"
          },
          ...state.decisions
        ]
      });
    }

    case "declare-conflict": {
      const actor = String(action.actorId ?? "").trim();
      if (!actor) return refuse(state, { ...base, action: action.type, message: note("unknownAction") });
      const next = { ...state.conflicts };
      const clearing = next[actor] === true;
      if (clearing) delete next[actor];
      else next[actor] = true;
      return accept(state, { ...base, action: action.type, target: actor, message: note(clearing ? "conflictCleared" : "conflictDeclared") }, {
        conflicts: next
      });
    }

    case "commission-task": {
      const authorization = authorizeAction({ level, actionId: "commission-task", actor: context.committeeId, resource: { committeeId: context.committeeId } });
      if (!authorization.allowed) {
        return refuse(state, { ...base, action: action.type, message: authorization.reason });
      }
      if (!action.organizationId) return refuse(state, { ...base, action: action.type, message: note("unknownAction") });
      const id = `TASK-SIM-${String(state.commissions.length + 1).padStart(3, "0")}`;
      return accept(state, { ...base, action: action.type, target: id, message: note("taskCommissioned") }, {
        commissions: [{ id, proposalId: action.proposalId ?? null, organizationId: action.organizationId, at: stamp(state.seq + 1) }, ...state.commissions]
      });
    }

    case "attempt-out-of-scope": {
      const authorization = authorizeAction({ level, actionId: action.actionId });
      return refuse(state, {
        ...base,
        action: action.actionId ?? action.type,
        message: authorization.allowed ? note("blockedOutOfScope") : authorization.reason
      });
    }

    default:
      return refuse(state, { ...base, action: action.type, message: note("unknownAction") });
  }
}

/* --------------------------------- selectors -------------------------------- */

export function selectBallot(state, { franchise = true, delegations = [] } = {}, policyId = "P-OPEN-DRAFT") {
  const enabled = delegations.filter((delegation) => state.ballot.delegationIds.includes(delegation.id));
  const ballot = computePoliticalBallot({ voterId: "CIT-SYN-004", franchise, delegations: enabled }, policyId);
  return { ...ballot, cast: state.ballot.cast, castAt: state.ballot.castAt };
}

export function selectProfessionalWeight(state, input, policyId = "P-OPEN-DRAFT") {
  return computeProfessionalWeight(input, policyId);
}

export function selectAudit(state, level) {
  return level ? state.audit.filter((entry) => entry.level === level) : state.audit;
}

export function selectDisclosedAttributes(state, fallback = []) {
  return state.disclosedAttributes ?? fallback;
}

export function selectTask(state, task) {
  const current = state.tasks[task.id] ?? {};
  return {
    accepted: Boolean(current.accepted),
    spend: current.spend ?? task.budget.spent,
    deliverable: current.deliverable ?? null,
    submittedAt: current.submittedAt ?? null
  };
}

/** True when a committee member is recused, so the UI can show the effect. */
export function isRecused(state, actorId) {
  return state.conflicts[actorId] === true;
}
