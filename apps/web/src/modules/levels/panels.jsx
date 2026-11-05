// Interactive panels for the five civic levels. Each panel is a small, honest
// simulator: it reads the fixtures, runs the shared reducer, and shows every
// result together with the session audit trail. Nothing leaves the tab.
import { useMemo, useState } from "react";
import { t, formatNumber } from "../../i18n.js";
import { policyLabel } from "../../locales/index.js";
import { Badge, Callout, Stat, Toggle } from "../../components/ui.jsx";

const dateOnly = (iso) => (iso ? String(iso).slice(0, 10) : "—");
const num = (value, lang) => formatNumber(value, lang);

/**
 * Which audit entries the log shows. The reducer keeps the full history (newest
 * first, capped at 60); the panel used to slice(0, 8) and drop the rest without
 * saying so (issue #30).
 */
export function visibleAudit(audit, expanded, limit = 8) {
  return expanded ? audit : audit.slice(0, limit);
}

function SimShell({ lang, copy, session, level, children, title, hint }) {
  const audit = session.state.audit.filter((entry) => entry.level === level);
  // The newest entry is the answer to the button the reader just pressed. It is
  // announced from a region that stays visible while the panel scrolls, because
  // a refusal below the fold teaches nobody anything.
  const latest = audit[0] ?? null;
  const [expanded, setExpanded] = useState(false);
  const shown = visibleAudit(audit, expanded);
  return (
    <section className="sim" aria-labelledby={`sim-heading-${level}`}>
      <header className="sim__head">
        <div>
          <p className="eyebrow">{copy.title}</p>
          <h2 id={`sim-heading-${level}`} className="h2">{title}</h2>
          {hint ? <p className="lede small">{hint}</p> : null}
        </div>
        <button type="button" className="btn btn--ghost" onClick={session.reset}>
          {copy.reset}
        </button>
      </header>

      <Callout tone="info">{copy.note}</Callout>

      <div
        className={`sim__outcome ${latest?.blocked ? "is-blocked" : ""}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {latest ? (
          <>
            <Badge tone={latest.blocked ? "danger" : "good"}>
              {latest.blocked ? copy.blocked : copy.recorded}
            </Badge>
            <span className="sim__outcome-action mono small">{latest.action}</span>
            <span className="sim__outcome-msg">{t(latest.message, lang)}</span>
          </>
        ) : (
          <span className="muted small">{copy.outcomeIdle}</span>
        )}
      </div>

      <div className="sim__grid">{children}</div>

      <div className="sim__audit">
        <h3 className="sim__audit-title">{copy.auditTitle}</h3>
        {audit.length === 0 ? (
          <p className="muted small">{copy.auditEmpty}</p>
        ) : (
          <>
            <p className="sim__audit-count small muted">
              {copy.auditShowing
                .replace("{shown}", num(shown.length, lang))
                .replace("{total}", num(audit.length, lang))}
            </p>
            <ol className="sim-log">
              {shown.map((entry) => (
                <li key={entry.id} className={`sim-log__item ${entry.blocked ? "is-blocked" : "is-recorded"}`}>
                  <span className="mono muted small">{entry.id} · {dateOnly(entry.at)}</span>
                  <span className="sim-log__action mono">{entry.action}</span>
                  <Badge tone={entry.blocked ? "danger" : "good"}>{entry.blocked ? copy.blocked : copy.recorded}</Badge>
                  <span className="sim-log__msg small">{t(entry.message, lang)}</span>
                </li>
              ))}
            </ol>
            {audit.length > 8 ? (
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setExpanded((value) => !value)}>
                {expanded
                  ? copy.auditCollapse
                  : copy.auditShowAll.replace("{total}", num(audit.length, lang))}
              </button>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}

function Field({ id, label, hint, children }) {
  return (
    <p className="field">
      <label htmlFor={id} className="field__label">{label}</label>
      {children}
      {hint ? <span className="field__hint small">{hint}</span> : null}
    </p>
  );
}

/* --------------------------------- level 1 --------------------------------- */

export function Level1Panel({ lang, copy, session, data }) {
  const proposals = data.modules.find((module) => module.id === "proposals")?.items ?? [];
  const domains = useMemo(() => [...new Set(proposals.map((proposal) => proposal.domain))], [proposals]);
  const [domain, setDomain] = useState("all");
  const [inspected, setInspected] = useState(null);

  const visible = domain === "all" ? proposals : proposals.filter((proposal) => proposal.domain === domain);
  const inspectedProposal = proposals.find((proposal) => proposal.id === inspected) ?? null;

  return (
    <SimShell lang={lang} copy={copy} session={session} level={1} title={t({ fa: "بررسی و مقایسهٔ عمومی", en: "Inspect and compare" }, lang)}>
      <div className="sim__block">
        <p className="mini-label">{copy.filterDomain}</p>
        <div className="seg-row" role="group" aria-label={copy.filterDomain}>
          <Toggle active={domain === "all"} onClick={() => setDomain("all")}>{copy.filterAll}</Toggle>
          {domains.map((item) => (
            <Toggle key={item} active={domain === item} onClick={() => setDomain(item)}>
              <span className="mono">{item}</span>
            </Toggle>
          ))}
        </div>
        <ul className="feed">
          {visible.map((proposal) => (
            <li key={proposal.id} className="feed__item">
              <span className="mono muted small">{proposal.id}</span>
              <span>{t(proposal.title, lang)}</span>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setInspected(proposal.id)}>
                {copy.inspect}
              </button>
            </li>
          ))}
        </ul>
        <p className="muted small">
          {num(visible.length, lang)} / {num(proposals.length, lang)}
        </p>
      </div>

      {inspectedProposal ? (
        <div className="sim__block">
          <div className="sim__block-head">
            <h3 className="sim__block-title">{t(inspectedProposal.title, lang)}</h3>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setInspected(null)}>{copy.close}</button>
          </div>
          <div className="table-wrap" tabIndex={0}>
            <table className="data-table data-table--compact">
              <caption className="sr-only">{copy.inspect}</caption>
              <thead>
                <tr>
                  <th scope="col">{copy.attributes}</th>
                  {inspectedProposal.qualification.map((result) => (
                    <th key={result.policyId} scope="col">{policyLabel(result.policyId, lang)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">{t({ fa: "امتیاز / آستانه", en: "Score / threshold" }, lang)}</th>
                  {inspectedProposal.qualification.map((result) => (
                    <td key={result.policyId} className="mono">
                      {num(result.total, lang)} / {num(result.threshold, lang)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">{t({ fa: "اختلاف", en: "Margin" }, lang)}</th>
                  {inspectedProposal.qualification.map((result) => (
                    <td key={result.policyId} className="mono">{num(result.margin, lang)}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">{t({ fa: "نتیجه", en: "Outcome" }, lang)}</th>
                  {inspectedProposal.qualification.map((result) => (
                    <td key={result.policyId}>
                      <Badge tone={result.outcome === "qualified" ? "good" : "warn"}>
                        {result.outcome === "qualified" ? copy.qualified : copy.below}
                      </Badge>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </SimShell>
  );
}

/* --------------------------------- level 2 --------------------------------- */

export function Level2Panel({ lang, copy, session, data }) {
  const privacy = data.modules.find((module) => module.id === "privacy")?.selectiveCredential;
  const consents = data.modules.find((module) => module.id === "consent")?.items ?? [];
  const disclosed = session.state.disclosedAttributes ?? privacy.disclosedAttributes;
  const [subject, setSubject] = useState("");

  return (
    <SimShell lang={lang} copy={copy} session={session} level={2} title={t({ fa: "اثبات گزینشی و رضایت", en: "Selective proof and consent" }, lang)}>
      <div className="sim__block">
        <h3 className="sim__block-title">{copy.attributes}</h3>
        <p className="muted small">{copy.attributeHint}</p>
        <div className="seg-row" role="group" aria-label={copy.attributes}>
          {privacy.disclosedAttributes.map((attribute) => (
            <Toggle
              key={attribute}
              active={disclosed.includes(attribute)}
              onClick={() => session.run({ type: "toggle-attribute", attribute, fallbackAttributes: privacy.disclosedAttributes })}
            >
              <span className="mono">{attribute}</span>
            </Toggle>
          ))}
        </div>
        <div className="preview">
          <p className="mini-label">{copy.preview}</p>
          {disclosed.length === 0 ? (
            <p className="muted small">{copy.previewEmpty}</p>
          ) : (
            <ul className="chip-list">
              <li><span className="chip">{t(privacy.claim, lang)}</span></li>
              {disclosed.map((attribute) => (
                <li key={attribute}><span className="chip mono">{attribute}</span></li>
              ))}
            </ul>
          )}
          <p className="muted small">
            {t({ fa: "پروفایل عمومی ساخته‌شده", en: "Public profile created" }, lang)}:{" "}
            <strong>{t({ fa: "خیر", en: "No" }, lang)}</strong>
          </p>
        </div>
      </div>

      <div className="sim__block">
        <h3 className="sim__block-title">{copy.consent}</h3>
        <ul className="toggle-list">
          {consents.map((consent) => {
            const granted = session.state.consents[consent.id] ?? consent.granted;
            return (
              <li key={consent.id}>
                <Toggle
                  active={granted}
                  onClick={() => session.run({ type: "set-consent", consentId: consent.id, granted: !granted })}
                  title={consent.id}
                >
                  {t(consent.purpose, lang)}
                </Toggle>
                <span className="muted small mono"> {consent.id}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="sim__block">
        <form
          className="form"
          onSubmit={(event) => {
            event.preventDefault();
            session.run({ type: "request-service", subject });
            setSubject("");
          }}
        >
          <Field id="l2-request" label={copy.requestSubject}>
            <input id="l2-request" value={subject} onChange={(event) => setSubject(event.target.value)} maxLength={80} />
          </Field>
          <button type="submit" className="btn btn--primary">{copy.submit}</button>
        </form>
        {session.state.requests.length ? (
          <ul className="feed">
            {session.state.requests.map((request) => (
              <li key={request.id} className="feed__item">
                <span className="mono muted small">{request.id}</span>
                <span>{request.subject}</span>
                <Badge tone="info">{request.state}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </SimShell>
  );
}

/* --------------------------------- level 3 --------------------------------- */

export function Level3Panel({ lang, copy, session, data, ballot, franchise }) {
  const delegations = data.modules.find((module) => module.id === "delegations")?.items ?? [];
  const polls = data.modules.find((module) => module.id === "polls")?.items ?? [];
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("civic-services");

  return (
    <SimShell lang={lang} copy={copy} session={session} level={3} title={t({ fa: "برگهٔ رأی و مشارکت", en: "Ballot and participation" }, lang)}>
      <div className="sim__block">
        <div className="sim__stats">
          <Stat label={copy.ballotTotal} value={ballot.total} lang={lang} />
          <p className="sim__state">
            <span className="mini-label">{copy.castState}</span>
            <Badge tone={ballot.cast ? "good" : "neutral"}>{ballot.cast ? copy.castYes : copy.castNo}</Badge>
          </p>
        </div>

        <h3 className="sim__block-title">{copy.delegation}</h3>
        <p className="muted small">{copy.delegationHint}</p>
        <ul className="toggle-list">
          {delegations.map((delegation) => (
            <li key={delegation.id}>
              <Toggle
                active={session.state.ballot.delegationIds.includes(delegation.id)}
                onClick={() => session.run({ type: "toggle-delegation", delegationId: delegation.id })}
              >
                <span className="mono">{delegation.id}</span> {delegation.scope.join(", ")}
              </Toggle>
              <Badge tone={delegation.check.allowed ? "good" : "warn"}>
                {delegation.check.allowed ? t({ fa: "معتبر", en: "valid" }, lang) : t({ fa: "نامعتبر", en: "invalid" }, lang)}
              </Badge>
              <span className="muted small"> {t(delegation.check.reason, lang)}</span>
            </li>
          ))}
        </ul>

        <div className="btn-row">
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => session.run({ type: "cast-ballot" }, { franchise })}
            disabled={!franchise}
          >
            {copy.cast}
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => session.run({ type: "withdraw-ballot" })}>
            {copy.withdraw}
          </button>
        </div>

        <div className="table-wrap" tabIndex={0}>
          <table className="data-table data-table--compact">
            <caption className="sr-only">{copy.ballotTotal}</caption>
            <thead>
              <tr>
                <th scope="col">{copy.attributes}</th>
                <th scope="col">{t({ fa: "وزن", en: "Weight" }, lang)}</th>
              </tr>
            </thead>
            <tbody>
              {ballot.components.map((component) => (
                <tr key={component.id}>
                  <th scope="row">{t(component.label, lang)}</th>
                  <td className="mono">{num(component.weight, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="sim__block">
        <h3 className="sim__block-title">{copy.poll}</h3>
        <p className="muted small">{copy.pollHint}</p>
        {polls.map((poll) => (
          <fieldset key={poll.id} className="radio-set">
            <legend className="small">{t(poll.question, lang)}</legend>
            <div className="seg-row">
              {poll.options.map((option) => (
                <Toggle
                  key={option.id}
                  active={session.state.polls[poll.id] === option.id}
                  onClick={() => session.run({ type: "answer-poll", pollId: poll.id, optionId: option.id })}
                >
                  {t(option.label, lang)}
                </Toggle>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="sim__block">
        <h3 className="sim__block-title">{copy.proposalBlock}</h3>
        <form
          className="form"
          onSubmit={(event) => {
            event.preventDefault();
            session.run({ type: "submit-proposal", title, domain });
            setTitle("");
          }}
        >
          <Field id="l3-title" label={copy.proposalTitle}>
            <input id="l3-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={90} />
          </Field>
          <Field id="l3-domain" label={copy.proposalDomain}>
            <select id="l3-domain" value={domain} onChange={(event) => setDomain(event.target.value)}>
              {["infrastructure", "healthcare", "economic-policy", "education", "civic-services"].map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </Field>
          <button type="submit" className="btn btn--primary">{copy.submit}</button>
        </form>
        {session.state.proposals.length ? (
          <ul className="feed">
            {session.state.proposals.map((proposal) => (
              <li key={proposal.id} className="feed__item">
                <span className="mono muted small">{proposal.id}</span>
                <span>{proposal.title}</span>
                <Badge tone="info">{proposal.domain}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </SimShell>
  );
}

/* --------------------------------- level 4 --------------------------------- */

export function Level4Panel({ lang, copy, session, data }) {
  const tasks = data.modules.find((module) => module.id === "tasks")?.items ?? [];
  const openTask = tasks.find((task) => task.state !== "delivered") ?? tasks[0];
  const current = session.state.tasks[openTask.id] ?? { accepted: false, spend: openTask.budget.spent };
  const [amount, setAmount] = useState(String(openTask.budget.spent));
  const [deliverable, setDeliverable] = useState("");

  return (
    <SimShell lang={lang} copy={copy} session={session} level={4} title={t({ fa: "اجرای کار واگذارشده", en: "Perform the assigned work" }, lang)}>
      <div className="sim__block">
        <h3 className="sim__block-title">{t(openTask.title, lang)}</h3>
        <div className="calc__head">
          <Stat label={t({ fa: "بودجه", en: "Budget" }, lang)} value={openTask.budget.allocated} lang={lang} />
          <Stat label={copy.spend} value={current.spend} lang={lang} />
          <p className="sim__state">
            <span className="mini-label">{copy.accepted}</span>
            <Badge tone={current.accepted ? "good" : "neutral"}>
              {current.accepted ? copy.acceptedYes : copy.acceptedNo}
            </Badge>
          </p>
        </div>

        <div className="btn-row">
          <button type="button" className="btn btn--primary" onClick={() => session.run({ type: "accept-task", taskId: openTask.id }, { tasks })}>
            {copy.acceptTask}
          </button>
        </div>

        <form
          className="form"
          onSubmit={(event) => {
            event.preventDefault();
            session.run({ type: "log-spend", taskId: openTask.id, amount: Number(amount) }, { tasks });
          }}
        >
          <Field id="l4-spend" label={copy.spend}>
            <input id="l4-spend" type="number" min="1" max={openTask.budget.allocated} value={amount} onChange={(event) => setAmount(event.target.value)} />
          </Field>
          <button type="submit" className="btn btn--ghost">{copy.logSpend}</button>
        </form>

        <form
          className="form"
          onSubmit={(event) => {
            event.preventDefault();
            session.run({ type: "submit-deliverable", taskId: openTask.id, title: deliverable }, { tasks });
            setDeliverable("");
          }}
        >
          <Field id="l4-deliverable" label={copy.deliverable}>
            <input id="l4-deliverable" value={deliverable} onChange={(event) => setDeliverable(event.target.value)} maxLength={90} />
          </Field>
          <button type="submit" className="btn btn--primary">{copy.deliverableSubmit}</button>
        </form>

        {current.deliverable ? (
          <p className="small">
            <Badge tone="good">{copy.deliverableDone}</Badge> {current.deliverable}
          </p>
        ) : null}
      </div>

      <div className="sim__block sim__block--boundary">
        <h3 className="sim__block-title">{t({ fa: "آزمودن مرز اختیار", en: "Test the boundary" }, lang)}</h3>
        <p className="muted small">
          {t(
            {
              fa: "این دکمه عمداً کاری را می‌آزماید که سازمان مجاز به آن نیست؛ پاسخ باید «رد شد» باشد.",
              en: "This button deliberately attempts something the organization may not do; the answer must be a refusal."
            },
            lang
          )}
        </p>
        <button type="button" className="btn btn--danger" onClick={() => session.run({ type: "attempt-member-ballot", taskId: openTask.id })}>
          {copy.attemptBallot}
        </button>
      </div>
    </SimShell>
  );
}

/* --------------------------------- level 5 --------------------------------- */

export function Level5Panel({ lang, copy, session, data }) {
  const proposals = data.modules.find((module) => module.id === "queue")?.items ?? [];
  const committee = data.modules.find((module) => module.id === "committee")?.committee;
  const organizations = [{ id: "ORG-SYN-01" }, { id: "ORG-SYN-02" }];
  const [proposalId, setProposalId] = useState(proposals[0]?.id ?? "");
  const [reason, setReason] = useState("");
  const [organizationId, setOrganizationId] = useState(organizations[0].id);
  const recused = session.state.conflicts["COM-M-02"] === true;

  return (
    <SimShell lang={lang} copy={copy} session={session} level={5} title={t({ fa: "ثبت تصمیم دامنه‌دار", en: "Record a scoped decision" }, lang)}>
      <div className="sim__block">
        <form
          className="form"
          onSubmit={(event) => {
            event.preventDefault();
            session.run({ type: "record-decision", proposalId, reason, actor: "COM-M-01", committeeId: committee.id }, { committeeId: committee.id });
            setReason("");
          }}
        >
          <Field id="l5-proposal" label={copy.decisionProposal}>
            <select id="l5-proposal" value={proposalId} onChange={(event) => setProposalId(event.target.value)}>
              {proposals.map((proposal) => (
                <option key={proposal.id} value={proposal.id}>{t(proposal.title, lang)}</option>
              ))}
            </select>
          </Field>
          <Field id="l5-reason" label={copy.decisionReason}>
            <textarea id="l5-reason" rows={3} value={reason} onChange={(event) => setReason(event.target.value)} maxLength={300} />
          </Field>
          <button type="submit" className="btn btn--primary">{copy.decisionSubmit}</button>
        </form>

        {session.state.decisions.length ? (
          <ul className="feed">
            {session.state.decisions.map((decision) => (
              <li key={decision.id} className="feed__item">
                <span className="mono muted small">{decision.id} · {decision.proposalId}</span>
                <span>{decision.reason}</span>
                <Badge tone="synthetic">{t({ fa: "غیرالزام‌آور", en: "non-binding" }, lang)}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="sim__block">
        <h3 className="sim__block-title">{copy.conflict}</h3>
        <Toggle active={recused} onClick={() => session.run({ type: "declare-conflict", actorId: "COM-M-02" })}>
          COM-M-02 · {t({ fa: "تعارض در حوزهٔ سلامت", en: "conflict in healthcare" }, lang)}
        </Toggle>
        <p className="small">
          {recused ? <Badge tone="danger">{copy.conflictRecused}</Badge> : <Badge tone="neutral">{t({ fa: "بدون تعارض اعلام‌شده", en: "no declared conflict" }, lang)}</Badge>}{" "}
          <span className="muted">
            {t(
              {
                fa: "عضو کنارگذاشته‌شده در تصمیم‌های همان دامنه شمرده نمی‌شود.",
                en: "A recused member does not count in decisions within that domain."
              },
              lang
            )}
          </span>
        </p>
      </div>

      <div className="sim__block">
        <h3 className="sim__block-title">{copy.commission}</h3>
        <form
          className="form"
          onSubmit={(event) => {
            event.preventDefault();
            session.run(
              { type: "commission-task", organizationId, proposalId },
              { committeeId: committee.id }
            );
          }}
        >
          <Field id="l5-org" label={t({ fa: "گرهٔ سازمانی", en: "Organizational node" }, lang)}>
            <select id="l5-org" value={organizationId} onChange={(event) => setOrganizationId(event.target.value)}>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>{org.id}</option>
              ))}
            </select>
          </Field>
          <button type="submit" className="btn btn--primary">{copy.commissionSubmit}</button>
        </form>
        {session.state.commissions.length ? (
          <ul className="feed">
            {session.state.commissions.map((commission) => (
              <li key={commission.id} className="feed__item">
                <span className="mono muted small">{commission.id}</span>
                <span className="mono">{commission.organizationId} ← {commission.proposalId}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="sim__block sim__block--boundary">
        <h3 className="sim__block-title">{t({ fa: "آزمودن مرز اختیار", en: "Test the boundary" }, lang)}</h3>
        <p className="muted small">
          {t(
            {
              fa: "دو کنش بیرون از اختیار این کمیته؛ هر دو باید با دلیل رد شوند.",
              en: "Two actions outside this committee's authority; both must be refused with a reason."
            },
            lang
          )}
        </p>
        <div className="btn-row">
          <button type="button" className="btn btn--danger" onClick={() => session.run({ type: "attempt-out-of-scope", actionId: "read-own-private-record" })}>
            {copy.attemptOutOfScope}
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => session.run({ type: "record-decision", proposalId, reason, actor: "COM-M-09", committeeId: "COM-SYN-99" }, { committeeId: committee.id })}>
            {t({ fa: "تصمیم برای پروندهٔ کمیتهٔ دیگر", en: "Decide another committee's case" }, lang)}
          </button>
        </div>
      </div>
    </SimShell>
  );
}

export const Panels = { 1: Level1Panel, 2: Level2Panel, 3: Level3Panel, 4: Level4Panel, 5: Level5Panel };
