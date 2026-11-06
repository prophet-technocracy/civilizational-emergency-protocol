// The partial-coverage programme: the queue that turns an amber light green.
//
// Every claim on this page is computed from the payload, not typed by hand: the
// cap check comes from the same ladder the bank publishes, and a project that
// fails a gate is listed as blocked rather than dressed up as in progress.
import { useState } from "react";
import { useApi } from "../lib/api.js";
import { t, formatNumber, formatDate } from "../i18n.js";
import { localeStrings } from "../locales/index.js";
import { principleHref } from "../lib/routes.js";
import { onLinkClick } from "../lib/links.js";
import { SectionHeader, Card, Callout, StateBlock, Badge, Stat, Empty } from "../components/ui.jsx";
import { LightDot } from "../components/lights.jsx";

const BALLOT_TONE = {
  passed: "good",
  pending: "neutral",
  "failed-quorum": "danger",
  "failed-threshold": "danger"
};

const STATE_TONE = {
  proposed: "neutral",
  balloted: "info",
  funded: "warn",
  "in-execution": "info",
  delivered: "good"
};

const share = (value, lang) => `${formatNumber(Math.round(value * 1000) / 10, lang)}${t({ fa: "٪", en: "%" }, lang)}`;

function Gate({ label, ok, copy }) {
  return (
    <li className={`gate ${ok ? "gate--open" : "gate--closed"}`}>
      <span aria-hidden="true">{ok ? "✓" : "×"}</span>
      <span>{label}</span>
      <span className="sr-only">{ok ? copy.gateOpen : copy.gateClosed}</span>
    </li>
  );
}

function ProjectCard({ project, copy, lang, stateLabel }) {
  const ballotLabel = {
    passed: copy.ballotPassed,
    pending: copy.ballotPending,
    "failed-quorum": copy.ballotFailedQuorum,
    "failed-threshold": copy.ballotFailedThreshold
  }[project.ballot.result];

  return (
    <article className={`prj prj--${project.state}`} aria-labelledby={`prj-${project.id}`}>
      <header className="prj__head">
        <div>
          <p className="prj__id mono muted">{project.id}</p>
          <h3 id={`prj-${project.id}`} className="prj__title">
            {t(project.title, lang)}
          </h3>
        </div>
        <Badge tone={STATE_TONE[project.state] ?? "neutral"}>{stateLabel}</Badge>
      </header>

      {/* One link, one announcement: the id and the title are the same
          destination, so they are the same anchor (issue #38). */}
      <p className="prj__principle small">
        <LightDot light={project.principle.light} label={copy.principleLight} />
        <a className="link-button" href={principleHref(project.principleId)}>
          <span className="mono">{project.principleId}</span> · {t(project.principle.title, lang)}
        </a>
      </p>
      <p className="prj__scope">{t(project.scope, lang)}</p>
      <p className="prj__deliverable small">
        <strong>{copy.deliverableLabel}:</strong> {t(project.deliverable, lang)}
      </p>

      <dl className="prj__facts">
        <div>
          <dt>{copy.budgetLabel}</dt>
          <dd>
            {formatNumber(project.estimate.tokens, lang)} {copy.tokensUnit} · {formatNumber(project.estimate.months, lang)} {copy.monthsLabel}
          </dd>
        </div>
        <div>
          <dt>{copy.contractorLabel}</dt>
          <dd>
            {t(project.cap.entityName, lang)} · {copy.levelLabel} {formatNumber(project.contractor.level, lang)}
          </dd>
        </div>
        <div>
          <dt>{copy.profitShareLabel}</dt>
          <dd>{share(project.contractor.profitShare, lang)}</dd>
        </div>
        <div>
          <dt>{copy.capLabel}</dt>
          <dd>
            <Badge tone={project.cap.allowed ? "good" : "danger"}>{project.cap.allowed ? copy.capOk : copy.capFail}</Badge>{" "}
            <span className="small muted">
              {copy.capHeadroom}: {formatNumber(project.cap.headroomTokens, lang)} {copy.tokensUnit}
            </span>
          </dd>
        </div>
      </dl>

      <div className="prj__ballot">
        <p className="prj__ballot-head">
          <span>{copy.ballotLabel}</span>
          <Badge tone={BALLOT_TONE[project.ballot.result] ?? "neutral"}>{ballotLabel}</Badge>
          <span className="mono muted small">{project.ballot.id}</span>
        </p>
        <ul className="prj__ballot-facts">
          <li>
            {copy.quorumLabel}: {share(project.ballot.quorum, lang)}
          </li>
          <li>
            {copy.thresholdLabel}: {share(project.ballot.threshold, lang)}
          </li>
          <li>
            {copy.turnoutLabel}: {share(project.ballot.cast, lang)}
          </li>
          <li>
            {copy.inFavourLabel}: {share(project.ballot.inFavour, lang)}
          </li>
        </ul>
      </div>

      <ul className="prj__gates" aria-label={copy.gatesTitle}>
        <Gate label={copy.gateBallot} ok={project.gates.ballotPassed} copy={copy} />
        <Gate label={copy.gateCap} ok={project.gates.capCleared} copy={copy} />
        <Gate label={copy.gateLevel} ok={project.gates.levelFour} copy={copy} />
        <Gate label={copy.gateContract} ok={project.gates.mudarabah} copy={copy} />
        <Gate label={copy.gateAudit} ok={project.gates.auditOnDelivery} copy={copy} />
      </ul>

      <p className="prj__flips">
        <LightDot light="amber" label={copy.flipFrom} />
        <span className="prj__arrow" aria-hidden="true">
          →
        </span>
        <LightDot light="green" label={copy.flipTo} />
        <span className="small">
          {copy.flipsLabel}: {copy.flipsAmberToGreen} · {copy.flipsOnlyOnDelivery}
        </span>
      </p>

      <details className="prj__audit">
        <summary>
          {copy.auditTitle} · {formatNumber(project.audit.length, lang)}
        </summary>
        <ol>
          {project.audit.map((row) => (
            <li key={`${project.id}-${row.date}-${row.actor}`}>
              <span className="mono muted">{formatDate(row.date, lang)}</span> · <span className="mono small">{row.actor}</span> ·{" "}
              {t(row.note, lang)}
            </li>
          ))}
        </ol>
      </details>
    </article>
  );
}

export default function Programme({ lang, navigate }) {
  const copy = localeStrings(lang).programme;
  const { status, payload, reload } = useApi("/api/v1/programme");
  const [filter, setFilter] = useState("all");

  if (status !== "ready") {
    return (
      <>
        <SectionHeader eyebrow={copy.eyebrow} title={copy.title} />
        <StateBlock status={status} lang={lang} onRetry={reload} />
      </>
    );
  }

  const { projects, contract, rules, states, summary, notice, method } = payload.data;
  const stateCopy = (id) => t(states.find((entry) => entry.id === id)?.label ?? { fa: id, en: id }, lang);
  const visible = projects.filter((project) => filter === "all" || project.state === filter);
  const blocked = projects.filter((project) => project.blockedBy.length > 0);

  return (
    <>
      <SectionHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        lede={copy.lede}
        actions={<Badge tone="warn">{copy.draftBadge}</Badge>}
      />

      <Callout tone="warn" title={copy.noticeTitle}>
        <p>{t(notice, lang)}</p>
      </Callout>

      <div className="grid grid--inline grid--six">
        <Stat label={copy.summaryProjects} value={summary.projects} lang={lang} />
        <Stat label={copy.summaryTokens} value={summary.tokens} tone="info" lang={lang} />
        <Stat label={copy.summaryDelivered} value={summary.delivered} tone="good" lang={lang} />
        <Stat label={copy.summaryWouldFlip} value={summary.wouldFlip} tone="good" lang={lang} />
        {/* Two numbers, said in words: a slash reads in the wrong order in RTL,
            and "12 / 5" does not say which is which (issue #60). */}
        <Stat
          label={copy.summaryTargets}
          value={summary.targeted}
          note={copy.summaryTargetsNote.replace("{partial}", formatNumber(summary.partialTargets, lang))}
          lang={lang}
        />
        <Stat label={copy.summaryUncovered} value={summary.uncoveredByProgramme} tone="warn" lang={lang} />
      </div>

      <Card title={copy.contractTitle} subtitle={t(contract.label, lang)}>
        <ul className="contract-terms">
          {contract.terms[lang].map((term) => (
            <li key={term}>{term}</li>
          ))}
        </ul>
        <p className="small muted">{t(contract.profitShareNote, lang)}</p>
      </Card>

      <Card title={copy.rulesTitle} subtitle={copy.rulesLede}>
        <ol className="rule-list">
          {rules.map((rule) => (
            <li key={rule.id}>
              <p>
                <span className="mono small muted rule-list__id">{rule.id}</span> {t(rule, lang)}
              </p>
              <p className="mono small muted">
                {copy.ruleCheck}: {rule.check}
              </p>
            </li>
          ))}
        </ol>
      </Card>

      <div className="filter-row" role="group" aria-label={copy.stateFilter}>
        <span className="filter-row__label">{copy.stateFilter}</span>
        {["all", ...states.map((entry) => entry.id)].map((id) => (
          <button
            key={id}
            type="button"
            className={`chip ${filter === id ? "is-active" : ""}`}
            aria-pressed={filter === id}
            onClick={() => setFilter(id)}
          >
            {id === "all" ? copy.all : stateCopy(id)}
            {id === "all"
              ? ` · ${formatNumber(projects.length, lang)}`
              : ` · ${formatNumber(projects.filter((project) => project.state === id).length, lang)}`}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <Empty lang={lang}>{copy.empty}</Empty>
      ) : (
        <div className="prj-grid">
          {visible.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              copy={copy}
              lang={lang}
              stateLabel={stateCopy(project.state)}
            />
          ))}
        </div>
      )}

      <Card title={copy.blockedTitle}>
        {blocked.length === 0 ? (
          <p>{copy.blockedNone}</p>
        ) : (
          <ul>
            {blocked.map((project) => (
              <li key={project.id}>
                <span className="mono">{project.id}</span> · {project.blockedBy.join(", ")}
              </li>
            ))}
          </ul>
        )}
        <p className="small muted">
          {copy.uncoveredNote.replace("{uncovered}", formatNumber(summary.uncoveredByProgramme, lang))}
        </p>
      </Card>

      <Card title={copy.methodTitle}>
        <p>{t(method, lang)}</p>
        <p className="small muted">
          <strong>{copy.riskTitle}:</strong> {copy.riskBody}
        </p>
        <p className="small">
          <a
            className="link-button"
            href="#/principles"
            onClick={navigate ? onLinkClick(navigate, "principles") : undefined}
          >
            ← {localeStrings(lang).principles.navLabel}
          </a>
        </p>
      </Card>
    </>
  );
}
