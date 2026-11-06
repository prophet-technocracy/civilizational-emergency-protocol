// The referendum instrument: the arithmetic of a future vote, and the boundary
// around it. The page shows the rule before the count, the quorum arithmetic on
// synthetic rehearsals, and the seven gates that would have to close before any
// of this could mean anything.
import { useApi } from "../lib/api.js";
import { t, formatNumber } from "../i18n.js";
import { localeStrings } from "../locales/index.js";
import { SectionHeader, Card, Callout, StateBlock, Badge, Stat, BarRow } from "../components/ui.jsx";

const OUTCOME_TONE = { accepted: "good", "failed-quorum": "danger", runoff: "warn" };

const pct = (value, lang) => `${formatNumber(Math.round(value * 1000) / 10, lang)}${t({ fa: "٪", en: "%" }, lang)}`;

const optionLabel = (question, id, lang) => t(question.options.find((option) => option.id === id)?.label ?? { fa: id, en: id }, lang);

export default function Referendum({ lang }) {
  const copy = localeStrings(lang).referendum;
  const { status, payload, reload } = useApi("/api/v1/referendum");

  if (status !== "ready") {
    return (
      <>
        <SectionHeader eyebrow={copy.eyebrow} title={copy.title} />
        <StateBlock status={status} lang={lang} onRetry={reload} />
      </>
    );
  }

  const { posture, decisionRules, sequence, gateList, rehearsals, summary, method } = payload.data;
  const questionById = new Map(sequence.map((question) => [question.id, question]));

  return (
    <>
      <SectionHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        lede={copy.lede}
        actions={<Badge tone="warn">{copy.postureBadge}</Badge>}
      />

      <Callout tone="warn" title={copy.postureTitle}>
        <p>{t(posture.notice, lang)}</p>
        <p className="small muted">
          {copy.summaryGates}: {formatNumber(gateList.length, lang)}
        </p>
      </Callout>

      <div className="grid grid--inline">
        <Stat label={copy.summaryQuestions} value={summary.questions} lang={lang} />
        <Stat label={copy.summaryAccepted} value={summary.accepted} tone="good" lang={lang} />
        <Stat label={copy.summaryRefused} value={summary.refused} tone="danger" lang={lang} />
        <Stat label={copy.summaryGates} value={summary.openGates} tone="warn" lang={lang} />
      </div>

      <Card title={copy.gatesTitle} subtitle={copy.gatesLede}>
        <ul className="gate-list gate-list--rows">
          {gateList.map((gate) => (
            <li key={gate.id}>
              <span className="gate gate--closed" aria-hidden="true">
                ×
              </span>
              <span>{t(gate, lang)}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card title={copy.sequenceTitle} subtitle={copy.sequenceLede}>
        <ol className="ref-sequence">
          {sequence.map((question) => {
            const rule = decisionRules.find((entry) => entry.id === question.decisionRule);
            return (
              <li key={question.id} className="ref-question" aria-labelledby={`ref-${question.id}`}>
                <p className="ref-question__order" aria-hidden="true">
                  {formatNumber(question.order, lang)}
                </p>
                <h3 id={`ref-${question.id}`} className="ref-question__title">
                  {t(question.question, lang)}
                </h3>
                <p className="small muted">{t(question.why, lang)}</p>
                <ul className="ref-question__options">
                  {question.options.map((option) => (
                    <li key={option.id} className="chip">
                      {t(option.label, lang)}
                    </li>
                  ))}
                </ul>
                <dl className="ref-question__facts">
                  <div>
                    <dt>{copy.ruleLabel}</dt>
                    <dd>{t(rule.label, lang)}</dd>
                  </div>
                  <div>
                    <dt>{copy.quorumLabel}</dt>
                    <dd>{pct(question.quorum, lang)}</dd>
                  </div>
                  <div>
                    <dt>{copy.thresholdLabel}</dt>
                    <dd>{question.threshold > 0 ? pct(question.threshold, lang) : "—"}</dd>
                  </div>
                  <div>
                    <dt>{copy.observersLabel}</dt>
                    <dd>{copy.observersRequired}</dd>
                  </div>
                  <div>
                    <dt>{copy.dependsOn}:</dt>
                    <dd className="small muted">{question.dependsOn.length > 0 ? question.dependsOn.join(", ") : copy.dependsNone}</dd>
                  </div>
                </dl>
              </li>
            );
          })}
        </ol>
      </Card>

      <Card title={copy.rehearsalTitle} subtitle={copy.rehearsalLede}>
        <div className="ref-rehearsals">
          {rehearsals.map((rehearsal) => {
            const question = questionById.get(rehearsal.questionId);
            return (
              <article key={rehearsal.id} className={`ref-rehearsal ref-rehearsal--${rehearsal.outcome}`}>
                <header className="ref-rehearsal__head">
                  <h3>{t(rehearsal.question, lang)}</h3>
                  <Badge tone={OUTCOME_TONE[rehearsal.outcome] ?? "neutral"}>
                    {rehearsal.outcome === "accepted"
                      ? copy.outcomeAccepted
                      : rehearsal.outcome === "failed-quorum"
                        ? copy.outcomeFailedQuorum
                        : copy.outcomeRunoff}
                  </Badge>
                </header>
                <p className="ref-rehearsal__stats small muted">
                  {copy.turnout}: {pct(rehearsal.turnout, lang)} · {copy.quorumLabel} {pct(rehearsal.quorum, lang)} ·{" "}
                  {rehearsal.quorumMet ? copy.quorumMet : copy.quorumMissed} · {copy.invalid}: {pct(rehearsal.invalid, lang)}
                </p>
                <div className="ref-rehearsal__shares">
                  {Object.entries(rehearsal.shares).map(([optionId, value]) => (
                    <BarRow
                      lang={lang}
                      key={optionId}
                      label={optionLabel(question, optionId, lang)}
                      value={value}
                      max={1}
                      tone={optionId === rehearsal.leader.id ? "good" : "info"}
                      display={pct(value, lang)}
                    />
                  ))}
                </div>
                <p className="small">
                  {copy.leading}: {optionLabel(question, rehearsal.leader.id, lang)} · {copy.margin}: {pct(Math.abs(rehearsal.margin ?? 0), lang)}
                </p>
                {rehearsal.reasons.length > 0 ? (
                  <ul className="ref-rehearsal__reasons">
                    {rehearsal.reasons.map((reason) => (
                      <li key={reason.fa}>{t(reason, lang)}</li>
                    ))}
                  </ul>
                ) : null}
                <p className="small muted">{t(rehearsal.note, lang)}</p>
              </article>
            );
          })}
        </div>
      </Card>

      <Card title={copy.methodTitle}>
        <p>{t(method, lang)}</p>
        <p className="small muted">
          <strong>{copy.sourceTitle}:</strong> {copy.sourceBody}
        </p>
        <p className="small muted">
          <a className="link-button" href="#/principles">
            {copy.principlesLink}
          </a>
        </p>
      </Card>
    </>
  );
}
