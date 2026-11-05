import { useMemo } from "react";
import { useApi } from "../lib/api.js";
import { useDemoSession } from "../lib/useDemoSession.js";
import { selectBallot } from "../lib/demoSession.mjs";
import { Panels } from "./levels/panels.jsx";
import { t, formatNumber } from "../i18n.js";
import { localeStrings, policyLabel } from "../locales/index.js";
import { Badge, Callout, StateBlock, Empty, Card, Stat, Disclosure } from "../components/ui.jsx";

const POLICY_IDS = ["P-OPEN-DRAFT", "P-RESTRICTIVE-DRAFT"];

const label = (lang, fa, en) => t({ fa, en }, lang);

const dateOnly = (iso) => (iso ? String(iso).slice(0, 10) : "—");

function OutcomeBadge({ outcome, copy }) {
  return (
    <Badge tone={outcome === "qualified" ? "good" : "warn"}>
      {outcome === "qualified" ? copy.qualified : copy.below}
    </Badge>
  );
}

function CalcTable({ result, copy, lang }) {
  return (
    <div className="calc">
      <div className="calc__head">
        <Stat label={copy.total} value={result.total} lang={lang} />
        <Stat label={copy.threshold} value={result.threshold} lang={lang} />
        <Stat label={copy.margin} value={result.margin} tone={result.margin >= 0 ? "good" : "warn"} lang={lang} />
        <Stat label={copy.outcome} value={result.outcome === "qualified" ? copy.qualified : copy.below} tone={result.outcome === "qualified" ? "good" : "warn"} />
      </div>
      <div className="table-wrap" tabIndex={0}>
        <table className="data-table">
          <caption className="sr-only">{copy.components}</caption>
          <thead>
            <tr>
              <th scope="col">{copy.category}</th>
              <th scope="col">{copy.count}</th>
              <th scope="col">{copy.unitWeight}</th>
              <th scope="col">{copy.points}</th>
              <th scope="col">{copy.counted}</th>
            </tr>
          </thead>
          <tbody>
            {result.lines.map((line) => (
              <tr key={line.category}>
                <th scope="row">{categoryLabel(line.category, lang)}</th>
                <td className="mono">{formatNumber(line.count, lang)}</td>
                <td className="mono">×{line.unitWeight}</td>
                <td className="mono">{formatNumber(line.points, lang)}</td>
                <td>{line.counted ? copy.counted : <span className="muted">{copy.notCounted}</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {result.adjustments.length ? (
        <ul className="calc__adjustments">
          {result.adjustments.map((adjustment) => (
            <li key={adjustment.id}>
              −{formatNumber(adjustment.reduction, lang)} · {t(adjustment.note, lang)}
            </li>
          ))}
        </ul>
      ) : null}
      <p className="muted small">{t(result.formula, lang)}</p>
    </div>
  );
}

const reasonLabel = (reason, lang, copy) =>
  ({
    qualified: copy.scopeMatch,
    "domain-mismatch": copy.scopeMismatch,
    "conflict-recused": copy.recused,
    unverified: label(lang, "تأییدنشده", "Unverified")
  }[reason] ?? reason);

const categoryLabel = (category, lang) =>
  t(
    {
      political: { fa: "حمایت سیاسی", en: "Political support" },
      professional: { fa: "ارزیابی تخصصی", en: "Professional assessment" },
      endorsement: { fa: "تأیید عمومی", en: "Public endorsement" },
      mobilization: { fa: "بسیج تأییدشده", en: "Verified mobilisation" },
      sponsorship: { fa: "حمایت نهادی", en: "Institutional sponsorship" }
    }[category] ?? { fa: category, en: category },
    lang
  );

function BallotPanel({ ballot, copy, lang, policy }) {
  return (
    <div className="ballot-panel">
      <div className="calc__head">
        <Stat label={copy.total} value={ballot.total} lang={lang} />
        <Stat label={copy.components} value={ballot.components.length} lang={lang} />
        <Stat label={copy.ballotsCreated} value={0} tone="good" lang={lang} />
      </div>
      <div className="table-wrap" tabIndex={0}>
        <table className="data-table">
          <caption className="sr-only">{copy.components}</caption>
          <thead>
            <tr>
              <th scope="col">{copy.category}</th>
              <th scope="col">{copy.unitWeight}</th>
              <th scope="col">{t({ fa: "توجیه", en: "Justification" }, lang)}</th>
            </tr>
          </thead>
          <tbody>
            {ballot.components.map((component) => (
              <tr key={component.id}>
                <th scope="row">{t(component.label, lang)}</th>
                <td className="mono">{formatNumber(component.weight, lang)}</td>
                <td>{t(component.justification, lang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="muted small">{t(ballot.formula, lang)}</p>
      <p className="mono muted small">
        {policy.id} · {policy.status} · {policy.authorizedBy}
      </p>
    </div>
  );
}

function AdvocacyTable({ breakdown, copy, lang }) {
  return (
    <div className="stack">
      <p className="muted small">
      {t(
        {
          fa: "هر رقم به یک تأییدکنندهٔ نام‌دار نسبت داده می‌شود و برابر با برگهٔ رأی نیست.",
          en: "Each figure is attributed to a named endorser and is not a ballot."
        },
        lang
      )}
      </p>
      <div className="table-wrap" tabIndex={0}>
      <table className="data-table">
        <caption className="sr-only">{label(lang, "تأییدها و دسترسی", "Endorsements and reach")}</caption>
        <thead>
          <tr>
            <th scope="col">{label(lang, "تأییدکننده", "Endorser")}</th>
            <th scope="col">{copy.reach}</th>
            <th scope="col">{copy.engagement}</th>
            <th scope="col">{copy.points}</th>
            <th scope="col">{copy.ballotsCreated}</th>
            <th scope="col">{copy.disclosure}</th>
          </tr>
        </thead>
        <tbody>
          {breakdown.map((item) => (
            <tr key={item.endorsementId}>
              <th scope="row" className="cell-stack">
                <span className="mono">{item.advocateHandle}</span>
                <span className="muted small">{item.endorsementId} → {item.targetId}</span>
              </th>
              <td className="mono">{formatNumber(item.declaredReach, lang)}</td>
              <td className="mono">{Math.round(item.engagementRate * 100)}%</td>
              <td className="mono">{formatNumber(item.points, lang)}</td>
              <td className="mono">۰</td>
              <td>
                <Badge tone={item.disclosureComplete ? "good" : "warn"}>
                  {item.disclosureComplete ? copy.disclosureComplete : copy.disclosureIncomplete}
                </Badge>
                {item.counted ? null : <div className="muted small">{copy.notCounted}</div>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

function ModuleBody({ module, copy, lang, navigate, policy }) {
  const data = module;

  switch (module.kind) {
    case "feed":
      return (
        <ul className="feed">
          {data.items.map((item) => (
            <li key={item.id} className="feed__item">
              <span className="mono muted small">{dateOnly(item.at)}</span>
              <span>{t(item.text, lang)}</span>
              {item.ref ? <span className="mono muted small">{item.ref}</span> : null}
            </li>
          ))}
        </ul>
      );

    case "proposals":
    case "queue":
      return (
        <ul className="proposal-list">
          {data.items.map((proposal) => (
            <li key={proposal.id} className="proposal">
              <div className="proposal__head">
                <h3 className="proposal__title">{t(proposal.title, lang)}</h3>
                <Badge tone="neutral">{proposal.domain}</Badge>
              </div>
              <p className="proposal__summary">{t(proposal.summary, lang)}</p>
              <div className="proposal__meta">
                <span className="mono">{proposal.id}</span>
                <span className="muted small">
                  {label(lang, "درخواستی", "Requested")}: {formatNumber(proposal.budget.requested, lang)} {proposal.budget.currency}
                </span>
                <span className="muted small">{label(lang, "مرحله", "Stage")}: {proposal.stage}</span>
              </div>
              <div className="proposal__outcomes">
                {proposal.qualification.map((result) => (
                  <span key={result.policyId} className="proposal__outcome">
                    <span className="muted small">{policyLabel(result.policyId, lang)}</span>
                    <span className="mono">{formatNumber(result.total, lang)} / {formatNumber(result.threshold, lang)}</span>
                    <OutcomeBadge outcome={result.outcome} copy={copy} />
                  </span>
                ))}
              </div>
              {proposal.calcs ? (
                <Disclosure summary={`${copy.openCalculation} · ${policyLabel(policy.id, lang)}`}>
                  <CalcTable
                    result={proposal.calcs.find((calc) => calc.policyId === policy.id) ?? proposal.calcs[0]}
                    copy={copy}
                    lang={lang}
                  />
                </Disclosure>
              ) : null}
            </li>
          ))}
        </ul>
      );

    case "progress":
      return (
        <div className="stack">
          {data.reports.map((report) => (
            <article key={report.id} className="mini-card">
              <h3>{t(report.title, lang)}</h3>
              <p className="muted small">{dateOnly(report.publishedAt)} · {report.id}</p>
              <dl className="kv">
                <div className="kv__row"><dt>{label(lang, "تعهد", "Committed")}</dt><dd className="mono">{formatNumber(report.figures.committed, lang)}</dd></div>
                <div className="kv__row"><dt>{label(lang, "هزینه‌شده", "Spent")}</dt><dd className="mono">{formatNumber(report.figures.spent, lang)}</dd></div>
              </dl>
              <p className="muted small">{t(report.note, lang)}</p>
            </article>
          ))}
          <ul className="feed">
            {data.tasks.map((task) => (
              <li key={task.id} className="feed__item">
                <span className="mono muted small">{task.id}</span>
                <span>{t(task.title, lang)}</span>
                <Badge tone="neutral">{task.state}</Badge>
              </li>
            ))}
          </ul>
        </div>
      );

    case "decisions":
      // A feed rather than a table: the card is narrow, and a 620px table would
      // have to be scrolled sideways inside it to read a decision.
      return (
        <ul className="feed">
          {data.items.map((decision) => (
            <li key={decision.id} className="decision">
              <div className="decision__head">
                <span className="mono muted small">{decision.id} · {decision.proposalId}</span>
                <Badge tone="synthetic">{label(lang, "غیرالزام‌آور", "non-binding")}</Badge>
              </div>
              <p className="decision__reason">{t(decision.reason, lang)}</p>
              <p className="mono muted small">
                {dateOnly(decision.at)} · {label(lang, "بازبینی", "review")}: {decision.reviewedBy ?? "—"}
              </p>
            </li>
          ))}
        </ul>
      );

    case "directory":
      return (
        <div className="stack">
          <article className="mini-card">
            <h3>{t(data.committee.name, lang)}</h3>
            <p className="muted small">{t(data.committee.mandate, lang)}</p>
          </article>
          <ul className="feed">
            {data.organizations.map((org) => (
              <li key={org.id} className="feed__item">
                <span className="mono muted small">{org.id}</span>
                <span>{t(org.name, lang)}</span>
                <Badge tone="neutral">{org.kind}</Badge>
              </li>
            ))}
          </ul>
        </div>
      );

    case "finance":
      return (
        <div className="stack">
          {data.reports ? data.reports.map((report) => (
            <article key={report.id} className="mini-card">
              <h3>{t(report.title, lang)}</h3>
              <dl className="kv">
                <div className="kv__row"><dt>{label(lang, "تعهد", "Committed")}</dt><dd className="mono">{formatNumber(report.figures.committed, lang)} {report.figures.currency}</dd></div>
                <div className="kv__row"><dt>{label(lang, "هزینه", "Spent")}</dt><dd className="mono">{formatNumber(report.figures.spent, lang)}</dd></div>
              </dl>
            </article>
          )) : null}
          {data.sponsorships ? (
            <ul className="feed">
              {data.sponsorships.map((sponsorship) => (
                <li key={sponsorship.id} className="feed__item">
                  <span className="mono muted small">{sponsorship.id}</span>
                  <span>{sponsorship.sponsorId} → {sponsorship.proposalId}</span>
                  <span className="mono">{formatNumber(sponsorship.amount, lang)} {sponsorship.currency}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {data.proposals ? (
            <ul className="feed">
              {data.proposals.map((proposal) => (
                <li key={proposal.id} className="feed__item">
                  <span className="mono muted small">{proposal.id}</span>
                  <span>{label(lang, "برآورد", "Estimate")}</span>
                  <span className="mono">{formatNumber(proposal.budget.requested, lang)} / {formatNumber(proposal.budget.committed, lang)}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      );

    case "audit":
    case "conflicts":
      return (
        <div className="stack">
          {data.rule ? <p className="muted small">{t(data.rule, lang)}</p> : null}
          <div className="table-wrap" tabIndex={0}>
            <table className="data-table">
              <caption className="sr-only">{label(lang, "سابقه", "Trail")}</caption>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">{label(lang, "کنشگر", "Actor")}</th>
                  <th scope="col">{label(lang, "کنش", "Action")}</th>
                  <th scope="col">{label(lang, "هدف", "Target")}</th>
                  <th scope="col">{label(lang, "دامنه", "Scope")}</th>
                  <th scope="col">{label(lang, "زمان", "Time")}</th>
                </tr>
              </thead>
              <tbody>
                {(data.items ?? []).map((entry) => (
                  <tr key={entry.id}>
                    <th scope="row" className="mono">{entry.id}</th>
                    <td className="mono">{entry.actor}</td>
                    <td className="mono">{entry.action ?? (entry.recused ? "recused" : "declared")}</td>
                    <td>{entry.summary ? t(entry.summary, lang) : <span className="mono">{entry.target ?? "—"}</span>}</td>
                    <td className="mono">{entry.scope ?? "—"}</td>
                    <td className="mono">{dateOnly(entry.at ?? entry.declaredAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case "advocacy":
      return (
        <div className="stack">
          <AdvocacyTable breakdown={data.breakdown} copy={copy} lang={lang} />
          <ul className="chip-list">
            {data.advocates.map((advocate) => (
              <li key={advocate.id}>
                <span className="chip mono">{advocate.handle}</span>
                <span className="muted small"> {t(advocate.declaredIdentity, lang)}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "evidence":
      return (
        <div className="stack">
          {data.reviews ? (
            <ul className="feed">
              {data.reviews.map((review) => (
                <li key={review.id} className="feed__item">
                  <span className="mono muted small">{review.evidenceId}</span>
                  <span>{t(review.note, lang)}</span>
                  <Badge tone={review.state === "sufficient" ? "good" : "warn"}>{review.state}</Badge>
                </li>
              ))}
            </ul>
          ) : null}
          <ul className="chip-list">
            {data.items.map((item) => (
              <li key={item.id}>
                <span className="chip">{t(item.title, lang)}</span>
                <span className="mono muted small"> {item.id} · {item.kind}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "requests":
    case "documents":
      return (
        <div className="table-wrap" tabIndex={0}>
          <table className="data-table">
            <caption className="sr-only">{label(lang, "درخواست‌ها", "Requests")}</caption>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">{label(lang, "موضوع", "Subject")}</th>
                <th scope="col">{label(lang, "وضعیت", "State")}</th>
                <th scope="col">{label(lang, "به‌روزرسانی", "Updated")}</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr key={item.id}>
                  <th scope="row" className="mono">{item.id}</th>
                  <td>{t(item.service ?? item.title, lang)}</td>
                  <td><Badge tone="info">{item.state}</Badge></td>
                  <td className="mono">{dateOnly(item.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "privacy":
    case "credentials": {
      const credential = data.selectiveCredential;
      return (
        <div className="stack">
          <article className="mini-card">
            <h3>{t(credential.claim, lang)}</h3>
            <p className="muted small">{credential.proofKind}</p>
            <div className="split">
              <div>
                <p className="mini-label">{label(lang, "افشا می‌شود", "Disclosed")}</p>
                <ul className="chip-list">
                  {credential.disclosedAttributes.map((attribute) => (
                    <li key={attribute}><span className="chip">{attribute}</span></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mini-label">{label(lang, "افشا نمی‌شود", "Withheld")}</p>
                <ul className="chip-list">
                  {credential.withheldAttributes.map((attribute) => (
                    <li key={attribute}><span className="chip chip--muted">{attribute}</span></li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="muted small">
              {label(lang, "پروفایل عمومی ساخته شد؟", "Public profile created?")}: <strong>{credential.publicProfileCreated ? "—" : label(lang, "خیر", "No")}</strong>
            </p>
          </article>
          {data.consultations ? (
            <ul className="feed">
              {data.consultations.map((consultation) => (
                <li key={consultation.id} className="feed__item">
                  <span className="mono muted small">{consultation.id}</span>
                  <span>{t(consultation.title, lang)}</span>
                  <Badge tone="info">{consultation.domain}</Badge>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      );
    }

    case "eligibility":
      return (
        <div className="stack">
          <p>{t(data.eligibility.note, lang)}</p>
          <dl className="kv kv--inline">
            <div className="kv__row"><dt>{label(lang, "مشارکت ممکن است", "Participation possible")}</dt><dd>{data.eligibility.participationPossible ? label(lang, "بله", "Yes") : label(lang, "خیر", "No")}</dd></div>
            <div className="kv__row"><dt>{label(lang, "پروفایل عمومی لازم است", "Public profile required")}</dt><dd>{data.eligibility.publicProfileRequired ? label(lang, "بله", "Yes") : label(lang, "خیر", "No")}</dd></div>
          </dl>
        </div>
      );

    case "consent":
      return (
        <div className="table-wrap" tabIndex={0}>
          <table className="data-table">
            <caption className="sr-only">{label(lang, "رضایت‌ها", "Consents")}</caption>
            <thead>
              <tr>
                <th scope="col">{label(lang, "هدف", "Purpose")}</th>
                <th scope="col">{label(lang, "وضعیت", "State")}</th>
                <th scope="col">{label(lang, "پایان", "Expiry")}</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr key={item.id}>
                  <th scope="row">{t(item.purpose, lang)}</th>
                  <td><Badge tone={item.granted ? "good" : "neutral"}>{item.granted ? label(lang, "داده‌شده", "Granted") : label(lang, "داده‌نشده", "Not granted")}</Badge></td>
                  <td className="mono">{item.expiresAt ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "summary":
      return (
        <div className="stack">
          <div className="stat-row">
            <Stat label={copy.total} value={data.ballot.total} lang={lang} />
            <Stat label={label(lang, "درخواست باز", "Open requests")} value={data.openRequests} lang={lang} />
            <Stat label={label(lang, "رضایت‌ها", "Consents")} value={data.consents} lang={lang} />
          </div>
          <Disclosure summary={copy.openCalculation}>
            <BallotPanel ballot={data.ballot} copy={copy} lang={lang} policy={policy} />
          </Disclosure>
        </div>
      );

    case "legal":
      return (
        <ul className="feed">
          {data.items.map((item) => (
            <li key={item.id} className="feed__item">
              <span className="mono muted small">{item.id}</span>
              <span>{t(item.kind, lang)}</span>
              <Badge tone="warn">{item.stage}</Badge>
              <span className="muted small">{t(item.notice, lang)}</span>
            </li>
          ))}
        </ul>
      );

    case "qualifications":
      return (
        <div className="table-wrap" tabIndex={0}>
          <table className="data-table">
            <caption className="sr-only">{label(lang, "صلاحیت‌ها", "Qualifications")}</caption>
            <thead>
              <tr>
                <th scope="col">{label(lang, "دامنه", "Domain")}</th>
                <th scope="col">{label(lang, "تأییدشده", "Verified")}</th>
                <th scope="col">{label(lang, "عمومی", "Public")}</th>
                <th scope="col">{copy.weightNow}</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr key={item.id}>
                  <th scope="row" className="mono">{item.domain}</th>
                  <td>{item.verified ? label(lang, "بله", "Yes") : label(lang, "خیر", "No")}</td>
                  <td>{item.public ? label(lang, "بله", "Yes") : label(lang, "خیر", "No")}</td>
                  <td className="mono">
                    {formatNumber(item.weightNow, lang)}{" "}
                    <span className="muted small">{item.weightNow > 0 ? copy.scopeMatch : copy.scopeMismatch}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "professional":
      return (
        <div className="table-wrap" tabIndex={0}>
          <table className="data-table">
            <caption className="sr-only">{label(lang, "ارزیابی‌های تخصصی", "Professional assessments")}</caption>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">{label(lang, "پیشنهاد", "Proposal")}</th>
                <th scope="col">{label(lang, "دامنهٔ گواهی", "Credential domain")}</th>
                <th scope="col">{copy.weightNow}</th>
                <th scope="col">{label(lang, "دلیل", "Reason")}</th>
              </tr>
            </thead>
            <tbody>
              {data.assessments.map((assessment) => {
                const weight = assessment.weight && typeof assessment.weight === "object" ? assessment.weight : null;
                const reasonKey = weight ? weight.reason : assessment.verified ? "qualified" : "unverified";
                return (
                  <tr key={assessment.id}>
                    <th scope="row" className="mono">{assessment.id}</th>
                    <td className="mono">{assessment.proposalId}</td>
                    <td className="mono">{assessment.credentialDomain}</td>
                    <td className="mono">{formatNumber(weight ? weight.total : 0, lang)}</td>
                    <td>
                      <Badge tone={reasonKey === "qualified" ? "good" : "warn"}>
                        {reasonLabel(reasonKey, lang, copy)}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );

    case "ballot":
      return (
        <div className="stack">
          <BallotPanel ballot={data.ballot} copy={copy} lang={lang} policy={data.policy ?? policy} />
          {data.totals ? (
            <ul className="feed">
              {data.totals.map((row) => (
                <li key={row.proposalId} className="feed__item">
                  <span className="mono muted small">{row.proposalId}</span>
                  <span>{label(lang, "حمایت سیاسی", "Political support")}</span>
                  <span className="mono">{formatNumber(row.political, lang)}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      );

    case "polls":
      return (
        <ul className="poll-list">
          {data.items.map((poll) => (
            <li key={poll.id} className="poll">
              <p className="poll__question">{t(poll.question, lang)}</p>
              <ul className="chip-list">
                {poll.options.map((option) => (
                  <li key={option.id}><span className="chip">{t(option.label, lang)}</span></li>
                ))}
              </ul>
              <p className="muted small">
                {poll.answered ? label(lang, "پاسخ داده شده", "Answered") : label(lang, "بدون پاسخ", "Not answered")} · {poll.id}
              </p>
            </li>
          ))}
        </ul>
      );

    case "fame":
      return (
        <div className="stack">
          <Callout tone="info" title={label(lang, "شهرت، دسترسی است؛ برگهٔ رأی نیست", "Fame is reach, not a ballot")}>
            {t(data.policyNote, lang)}
          </Callout>
          <AdvocacyTable breakdown={data.endorsements} copy={copy} lang={lang} />
          <BallotPanel ballot={data.ballot} copy={copy} lang={lang} policy={policy} />
        </div>
      );

    case "delegations":
      return (
        <div className="table-wrap" tabIndex={0}>
          <table className="data-table">
            <caption className="sr-only">{label(lang, "واگذاری‌ها", "Delegations")}</caption>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">{label(lang, "واگذارکننده", "Delegator")}</th>
                <th scope="col">{label(lang, "دامنه", "Scope")}</th>
                <th scope="col">{label(lang, "پایان", "Expiry")}</th>
                <th scope="col">{label(lang, "اعتبار", "Validity")}</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr key={item.id}>
                  <th scope="row" className="mono">{item.id}</th>
                  <td className="mono">{item.delegatingParty}</td>
                  <td className="mono">{item.scope.join(", ")}</td>
                  <td className="mono">{dateOnly(item.expiresAt)}</td>
                  <td>
                    <Badge tone={item.check.allowed ? "good" : "warn"}>{item.check.allowed ? copy.allowed : copy.denied}</Badge>{" "}
                    <span className="muted small">{t(item.check.reason, lang)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "history":
      return (
        <ul className="feed">
          {data.items.map((item) => (
            <li key={item.id} className="feed__item">
              <span className="mono muted small">{dateOnly(item.at)}</span>
              <span>{t(item.kind, lang)}</span>
              <span className="mono">{item.target}</span>
            </li>
          ))}
        </ul>
      );

    case "identity":
      return (
        <article className="mini-card">
          <h3>{t(data.organization.name, lang)}</h3>
          <dl className="kv">
            <div className="kv__row"><dt>ID</dt><dd className="mono">{data.organization.id}</dd></div>
            <div className="kv__row"><dt>{label(lang, "گونه", "Kind")}</dt><dd className="mono">{data.organization.kind}</dd></div>
            <div className="kv__row"><dt>{label(lang, "اعضا", "Members")}</dt><dd className="mono">{formatNumber(data.organization.members, lang)}</dd></div>
          </dl>
          <p className="muted small">{t(data.organization.disclaimer, lang)}</p>
        </article>
      );

    case "members":
      return (
        <ul className="feed">
          {data.members.map((member) => (
            <li key={member.id} className="feed__item">
              <span className="mono muted small">{member.id}</span>
              <span>{t(member.role, lang)}</span>
            </li>
          ))}
        </ul>
      );

    case "tasks":
      return (
        <ul className="proposal-list">
          {data.items.map((task) => (
            <li key={task.id} className="proposal">
              <div className="proposal__head">
                <h3 className="proposal__title">{t(task.title, lang)}</h3>
                <Badge tone="info">{task.state}</Badge>
              </div>
              <div className="proposal__meta">
                <span className="mono">{task.id}</span>
                <span className="mono muted small">{task.organizationId}</span>
                <span className="muted small">{formatNumber(task.budget.allocated, lang)} / {formatNumber(task.budget.spent, lang)}</span>
                <span className="muted small">{label(lang, "سررسید", "Due")}: {task.dueAt}</span>
              </div>
              {task.responsibility ? <p className="muted small">{t(task.responsibility, lang)}</p> : null}
              {task.members ? (
                <ul className="chip-list">
                  {task.members.map((member) => (
                    <li key={member.id}><span className="chip">{t(member.role, lang)}</span></li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      );

    case "contracts":
      return (
        <ul className="feed">
          {data.items.map((item) => (
            <li key={item.id} className="feed__item">
              <span className="mono muted small">{item.id}</span>
              <span>{item.taskId}</span>
              <span className="mono">{formatNumber(item.budget.allocated, lang)}</span>
            </li>
          ))}
        </ul>
      );

    case "deliverables":
      return data.items.length ? (
        <ul className="proposal-list">
          {data.items.map((item) => (
            <li key={item.id} className="proposal">
              <div className="proposal__head">
                <h3 className="proposal__title">{t(item.title, lang)}</h3>
                <Badge tone={item.review.outcome === "accepted-with-objection" ? "warn" : "good"}>{item.review.outcome}</Badge>
              </div>
              <p className="muted small">{item.review.objection ? t(item.review.objection, lang) : null}</p>
              <p className="mono muted small">{item.id} · {dateOnly(item.submittedAt)} · {item.evidence.join(", ")}</p>
            </li>
          ))}
        </ul>
      ) : (
        <Empty lang={lang}>{copy.emptyState}</Empty>
      );

    case "reports":
      return (
        <div className="stack">
          {data.reports.map((report) => (
            <article key={report.id} className="mini-card">
              <h3>{t(report.title, lang)}</h3>
              <p className="muted small">{dateOnly(report.publishedAt)} · {report.id}</p>
              <p className="muted small">{t(report.note, lang)}</p>
            </article>
          ))}
          {data.note ? <p className="muted small">{t(data.note, lang)}</p> : null}
        </div>
      );

    case "boundary":
      return (
        <div className="split">
          <div>
            <p className="mini-label">{copy.canDo}</p>
            <ul className="guard-list">
              {data.can.map((item) => <li key={item.en}>{t(item, lang)}</li>)}
            </ul>
          </div>
          <div>
            <p className="mini-label">{copy.cannotDo}</p>
            <ul className="guard-list guard-list--deny">
              {data.cannot.map((item) => <li key={item.en}>{t(item, lang)}</li>)}
            </ul>
          </div>
        </div>
      );

    case "committee":
      return (
        <div className="stack">
          <article className="mini-card">
            <h3>{t(data.committee.name, lang)}</h3>
            <p className="muted small">{t(data.committee.mandate, lang)}</p>
            <p className="muted small">{t(data.committee.separationOfDuties, lang)}</p>
          </article>
          <ul className="feed">
            {data.committee.members.map((member) => (
              <li key={member.id} className="feed__item">
                <span className="mono muted small">{member.id}</span>
                <span>{t(member.role, lang)}</span>
                <span className="mono muted small">
                  {member.appointedBy} · {label(lang, "تا", "until")} {member.termEnds}
                </span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "consultation":
      return (
        <div className="stack">
          <div className="table-wrap" tabIndex={0}>
            <table className="data-table">
              <caption className="sr-only">{label(lang, "مشارکت‌ها", "Contributions")}</caption>
              <thead>
                <tr>
                  <th scope="col">{label(lang, "پیشنهاد", "Proposal")}</th>
                  {Object.keys(data.contributions[0] ?? {})
                    .filter((key) => key !== "proposalId")
                    .map((key) => (
                      <th key={key} scope="col">{categoryLabel(key, lang)}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {data.contributions.map((row) => (
                  <tr key={row.proposalId}>
                    <th scope="row" className="mono">{row.proposalId}</th>
                    {Object.entries(row)
                      .filter(([key]) => key !== "proposalId")
                      .map(([key, value]) => (
                        <td key={key} className="mono">{formatNumber(value, lang)}</td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="feed">
            {data.mobilizations.map((row) => (
              <li key={row.id} className="feed__item">
                <span className="mono muted small">{row.id}</span>
                <span>{t(row.note, lang)}</span>
                <span className="mono">{formatNumber(row.count, lang)}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    default:
      return <Empty lang={lang}>{copy.emptyState}</Empty>;
  }
}

export default function Level({ lang, dict, navigate, levelId, policyId, onPolicyChange }) {
  const copy = localeStrings(lang).levels.level;
  const state = useApi(`/api/v1/levels/${levelId}?policy=${policyId}`);
  const levelNumber = Number(levelId);

  // Fixtures the reducer needs to decide; it never reads them from module scope.
  const baseContext = useMemo(() => {
    if (state.status !== "ready") return {};
    const modules = state.payload.data.modules;
    const committee = modules.find((module) => module.id === "committee")?.committee;
    return {
      franchise: true,
      citizenId: "CIT-SYN-004",
      committeeId: committee?.id ?? "COM-SYN-01",
      delegations: modules.find((module) => module.id === "delegations")?.items ?? [],
      tasks: modules.find((module) => module.id === "tasks")?.items ?? []
    };
  }, [state]);

  const session = useDemoSession(levelNumber, baseContext);

  const sessionBallot = useMemo(() => {
    if (state.status !== "ready" || levelNumber !== 3) return null;
    const delegations = state.payload.data.modules.find((module) => module.id === "delegations")?.items ?? [];
    return selectBallot(session.state, { franchise: true, delegations }, policyId);
  }, [state, levelNumber, session.state, policyId]);

  if (state.status !== "ready") {
    return <StateBlock status={state.status} lang={lang} onRetry={state.reload} />;
  }

  const data = state.payload.data;
  const { level, modules, policy, posthumous, workflow, guards } = data;
  const Panel = Panels[levelNumber];

  return (
    <div className="level-view">
      <nav className="level-back" aria-label={copy.back}>
        <button type="button" className="btn btn--ghost" onClick={() => navigate("levels")}>
          ← {copy.back}
        </button>
      </nav>

      <header className="level-head">
        <div>
          <p className="eyebrow">{formatNumber(level.id, lang)} · {level.key}</p>
          <h1 className="h1">{t(level.title, lang)}</h1>
          <p className="lede">{t(level.purpose, lang)}</p>
          <ul className="chip-list">
            {level.actions.map((action) => (
              <li key={action.id}><span className="chip mono">{action.id}</span></li>
            ))}
          </ul>
        </div>
        <div className="level-head__side">
          <Badge tone="synthetic">{copy.syntheticNotice}</Badge>
          <div className="policy-switch" role="group" aria-label={copy.policySwitch}>
            {POLICY_IDS.map((id) => (
              <button
                key={id}
                type="button"
                className={`seg seg--wide ${policyId === id ? "is-active" : ""}`}
                aria-pressed={policyId === id}
                onClick={() => onPolicyChange(id)}
              >
                {policyLabel(id, lang)}
              </button>
            ))}
          </div>
          <p className="muted small">
            {copy.policyStatus}: {policy.status} · {copy.authorizedBy}: {policy.authorizedBy}
          </p>
        </div>
      </header>

      {Panel ? (
        <Panel
          lang={lang}
          copy={localeStrings(lang).levels.sim}
          session={session}
          data={data}
          ballot={sessionBallot}
          franchise
        />
      ) : null}

      <div className="module-grid">
        {modules.map((module) => (
          <Card key={module.id} title={t(module.title, lang)} className={`module-card module-card--${module.kind}`}>
            <ModuleBody module={module} copy={copy} lang={lang} navigate={navigate} policy={policy} />
          </Card>
        ))}
      </div>

      <Card title={copy.posthumousTitle} className="module-card">
        <div className="split">
          <div className="mini-card">
            <h3>{copy.posthumousBallot}</h3>
            <p>
              <Badge tone="danger">{copy.prohibited}</Badge>{" "}
              <span className="muted small">{t(posthumous.ballotAttempt.reason, lang)}</span>
            </p>
            <p className="mono muted small">{posthumous.ballotAttempt.code} · {posthumous.ballotAttempt.ballotTransfer}</p>
          </div>
          <div className="mini-card">
            <h3>{copy.posthumousMemoir}</h3>
            <p>
              <Badge tone="good">{copy.permitted}</Badge>{" "}
              <span className="muted small">{t(posthumous.memoirAttempt.reason, lang)}</span>
            </p>
            <p className="mono muted small">{posthumous.memoirAttempt.code} · {posthumous.mandate.id}</p>
          </div>
        </div>
        <p className="muted small">{t(posthumous.mandate.boundary, lang)}</p>
      </Card>

      <section className="level-workflow" aria-labelledby="level-workflow-heading">
        <h2 id="level-workflow-heading" className="h2">{copy.steps} · {t(workflow.title, lang)}</h2>
        <ol className="rail">
          {workflow.steps.map((step) => (
            <li key={step.id} className="rail__step">
              <span className="rail__level" aria-hidden="true">{formatNumber(step.level, lang)}</span>
              <span className="rail__body">
                <span className="rail__text">{t(step.text, lang)}</span>
                <span className="rail__meta mono">{step.recordId} · {dateOnly(step.at)}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="level-guards-heading" className="level-guards">
        <h2 id="level-guards-heading" className="h2">{localeStrings(lang).levels.home.guardsTitle}</h2>
        <ul className="guard-list">
          {guards.map((guard) => (
            <li key={guard.id}>{t({ fa: guard.fa, en: guard.en }, lang)}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
