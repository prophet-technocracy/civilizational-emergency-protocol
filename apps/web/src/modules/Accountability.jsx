import { useState } from "react";
import { useApi } from "../lib/api.js";
import { t, formatNumber, labelFor, formatDate } from "../i18n.js";
import { SectionHeader, Card, StateBlock, Badge, Callout, Empty, Stat, FieldList } from "../components/ui.jsx";

const REVIEW_OUTCOME_TONE = {
  approved: "good",
  "approved-with-conditions": "warn",
  "dissent-recorded": "danger"
};

export default function Accountability({ lang, dict }) {
  const { status, payload, error, reload } = useApi("/api/v1/accountability");
  const [openEvent, setOpenEvent] = useState(null);

  if (status !== "ready") {
    return (
      <>
        <SectionHeader eyebrow={`${dict.modules} ۰۸`} title={dict.breadcrumbHome} />
        <StateBlock status={status} lang={lang} onRetry={reload} error={error} />
      </>
    );
  }

  const { auditEvents, immutabilityNotice, conflictsOfInterest, reviewRecords, decisions, honestyGuards } = payload.data;

  return (
    <>
      <SectionHeader
        eyebrow={`${dict.modules} ۰۸ · ${t({ fa: "گزارش الحاق‌گرا", en: "Append-oriented log" }, lang)}`}
        title={t({ fa: "پاسخگویی و شفافیت", en: "Accountability & Transparency" }, lang)}
        lede={t(
          {
            fa: "هر تغییر با عامل، دلیل، نسخهٔ پیشین و وضعیت بازبینی ثبت می‌شود. این گزارش «تغییرناپذیر رمزنگاری‌شده» نیست و چنین ادعایی نمی‌کند.",
            en: "Every change records its actor, reason, previous version, and review status. This log is not 'cryptographically immutable' and makes no such claim."
          },
          lang
        )}
      />

      <Callout tone="warn" title={t({ fa: "صداقت فنی دربارهٔ این گزارش", en: "Technical honesty about this log" }, lang)}>
        <p>{t(immutabilityNotice, lang)}</p>
        <ul className="tight-list">
          {honestyGuards.map((guard, index) => (
            <li key={index}>{t(guard, lang)}</li>
          ))}
        </ul>
      </Callout>

      <div className="grid grid--inline">
        <Stat label={t({ fa: "رویدادهای ثبت‌شده", en: "Recorded events" }, lang)} value={formatNumber(auditEvents.length, lang)} lang={lang} />
        <Stat label={t({ fa: "تعارض منافع اعلام‌شده", en: "Declared conflicts" }, lang)} value={formatNumber(conflictsOfInterest.length, lang)} lang={lang} />
        <Stat label={t({ fa: "سوابق بازبینی مستقل", en: "Independent reviews" }, lang)} value={formatNumber(reviewRecords.length, lang)} lang={lang} />
        <Stat label={t({ fa: "تصویب‌شده عمومی", en: "Publicly ratified" }, lang)} value={formatNumber(0, lang)} tone="warn" lang={lang} />
      </div>

      <Card
        title={t({ fa: "گزارش رویدادها", en: "Event log" }, lang)}
        subtitle={t({ fa: "زنجیرهٔ ارجاع بین رویدادها با previousEventId حفظ می‌شود.", en: "Referential links between events are preserved via previousEventId." }, lang)}
      >
        {auditEvents.length === 0 ? (
          <Empty lang={lang} />
        ) : (
          <ol className="event-list">
            {auditEvents.map((event) => {
              const isOpen = openEvent === event.id;
              return (
                <li key={event.id} className="event">
                  <div className="event__head">
                    <span className="mono event__id">{event.id}</span>
                    <Badge tone="info">{labelFor(event.actionType, lang)}</Badge>
                    <Badge tone={event.approvalStatus.includes("approved") ? "good" : "warn"}>{labelFor(event.approvalStatus, lang)}</Badge>
                    <span className="event__time">{formatDate(event.timestamp, lang, true)}</span>
                  </div>
                  <p className="event__summary">{t(event.changeSummary, lang)}</p>
                  <p className="event__meta mono">{event.targetEntity}</p>
                  <button type="button" className="link-btn" aria-expanded={isOpen} onClick={() => setOpenEvent(isOpen ? null : event.id)}>
                    {isOpen ? dict.hide : dict.viewDetails}
                  </button>
                  {isOpen ? (
                    <div className="event__detail">
                      <FieldList
                        rows={[
                          { label: t({ fa: "رویداد پیشین", en: "Previous event" }, lang), value: event.previousEventId ?? dict.none },
                          { label: t({ fa: "عامل / نقش", en: "Actor / role" }, lang), value: t(event.responsibleProcessOrRole, lang) },
                          { label: t({ fa: "دلیل", en: "Reason" }, lang), value: t(event.reason, lang) },
                          { label: t({ fa: "نسخهٔ پیشین", en: "Previous version" }, lang), value: event.previousVersion },
                          { label: t({ fa: "نسخهٔ تازه", en: "New version" }, lang), value: event.newVersion },
                          { label: t({ fa: "وضعیت بازبینی", en: "Review status" }, lang), value: event.reviewStatus },
                          {
                            label: t({ fa: "ادعای تغییرناپذیری رمزنگاری", en: "Cryptographic immutability claim" }, lang),
                            value: event.cryptographicImmutabilityClaim ? dict.yes : `${dict.no} — ${t({ fa: "گزارش الحاق‌گرای معمولی", en: "ordinary append-oriented log" }, lang)}`
                          }
                        ]}
                      />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
        )}
      </Card>

      <div className="grid grid--two">
        <Card
          title={t({ fa: "ثبت تعارض منافع", en: "Conflict-of-interest register" }, lang)}
          subtitle={t({ fa: "اعلام و مهار تعارض، شرط بازبینی معتبر است.", en: "Declaring and mitigating conflicts is a condition of valid review." }, lang)}
        >
          {conflictsOfInterest.length === 0 ? (
            <Empty lang={lang} />
          ) : (
            <ul className="coi-list">
              {conflictsOfInterest.map((item) => (
                <li key={item.id}>
                  <div className="coi__head">
                    <span className="mono">{item.id}</span>
                    <Badge tone={item.status === "mitigated" ? "good" : "warn"}>{labelFor(item.status, lang)}</Badge>
                  </div>
                  <p>
                    <strong>{t(item.person, lang)}</strong>
                  </p>
                  <p>{t(item.declaredInterest, lang)}</p>
                  <p className="muted">
                    {t({ fa: "اقلام متأثر:", en: "Affected items:" }, lang)} {item.affectedItems.join(", ")}
                  </p>
                  <p className="coi__mitigation">
                    <strong>{t({ fa: "مهار:", en: "Mitigation:" }, lang)}</strong> {t(item.mitigation, lang)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          title={t({ fa: "سوابق بازبینی مستقل", en: "Independent review records" }, lang)}
          subtitle={t({ fa: "بازبین نباید سازندهٔ همان اثر باشد.", en: "The reviewer must not be the author of the same work." }, lang)}
        >
          <ul className="review-list">
            {reviewRecords.map((record) => (
              <li key={record.id}>
                <div className="coi__head">
                  <span className="mono">{record.id}</span>
                  <Badge tone={REVIEW_OUTCOME_TONE[record.outcome] ?? "neutral"}>{labelFor(record.outcome, lang)}</Badge>
                </div>
                <p>
                  <strong>{record.targetId}</strong> · {record.targetType}
                </p>
                <p className="muted">
                  {t(record.reviewerRole, lang)} · {labelFor(record.reviewType, lang)} · {formatDate(record.reviewedAt, lang)}
                </p>
                <p>{t(record.conditionsOrDissent, lang)}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title={t({ fa: "سابقهٔ تصمیم‌ها", en: "Decision history" }, lang)}>
        <div className="table-wrap">
          <table className="data-table">
            <caption className="sr-only">{t({ fa: "سابقهٔ تصمیم‌ها", en: "Decision history" }, lang)}</caption>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">{t({ fa: "بخش", en: "Section" }, lang)}</th>
                <th scope="col">{t({ fa: "خلاصه", en: "Summary" }, lang)}</th>
                <th scope="col">{t({ fa: "وضعیت مخزن", en: "Repository" }, lang)}</th>
                <th scope="col">{t({ fa: "تصویب", en: "Ratification" }, lang)}</th>
              </tr>
            </thead>
            <tbody>
              {decisions.map((decision) => (
                <tr key={decision.id}>
                  <td className="mono">{decision.id}</td>
                  <td>{decision.section}</td>
                  <td>{t(decision.summary, lang)}</td>
                  <td>
                    <Badge tone="info">{labelFor(decision.repositoryStatus, lang)}</Badge>
                  </td>
                  <td>
                    <Badge tone="danger">{labelFor(decision.ratificationStatus, lang)}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Callout tone="danger" title={dict.governanceNote}>
        {t(
          {
            fa: "هیچ رویداد این صفحه نشان‌دهندهٔ رأی، انتصاب یا تصمیم عمومی الزام‌آور نیست. همهٔ رویدادها در جریان مهندسی این نمونه ثبت شده‌اند.",
            en: "No event on this page represents a vote, appointment, or binding public decision. All events were recorded during the engineering of this prototype."
          },
          lang
        )}
      </Callout>
    </>
  );
}
