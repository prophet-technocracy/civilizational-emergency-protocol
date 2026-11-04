import { useState } from "react";
import { useApi } from "../lib/api.js";
import { t, formatNumber, MILESTONE_STATUS, labelFor } from "../i18n.js";
import { SectionHeader, Card, StateBlock, Badge, Callout, Empty, Stat, Meter, FieldList } from "../components/ui.jsx";

const REVIEW_TONE = {
  verified: "good",
  "partially-verified": "warn",
  "blocked-on-gate": "danger"
};

export default function Projects({ lang, dict }) {
  const { status, payload, reload } = useApi("/api/v1/projects");
  const [open, setOpen] = useState(null);

  if (status !== "ready") {
    return (
      <>
        <SectionHeader eyebrow={`${dict.modules} ۱۰`} title={dict.breadcrumbHome} />
        <StateBlock status={status} lang={lang} onRetry={reload} />
      </>
    );
  }

  const { projects, incentivePolicy } = payload.data;
  const totals = projects.reduce(
    (acc, project) => {
      acc.milestones += project.milestones.length;
      acc.complete += project.milestones.filter((m) => m.status === "complete").length;
      acc.blocked += project.milestones.filter((m) => m.status === "blocked").length;
      return acc;
    },
    { milestones: 0, complete: 0, blocked: 0 }
  );

  return (
    <>
      <SectionHeader
        eyebrow={`${dict.modules} ۱۰ · ${t({ fa: "کار عمومی، بدون امتیاز حکمرانی", en: "Public work, no governance reward" }, lang)}`}
        title={t({ fa: "پروژه‌های نفع عمومی", en: "Public-Good Projects" }, lang)}
        lede={t(
          {
            fa: "هدف‌ها، تحویل‌شدنی‌ها، نقاط عطف و شواهد تکمیل. مشارکت در هیچ پروژه‌ای حق حکمرانی، رأی وزنی یا دسترسی ویژه ایجاد نمی‌کند.",
            en: "Objectives, deliverables, milestones, and evidence of completion. Contributing to any project grants no governance right, weighted vote, or privileged access."
          },
          lang
        )}
      />

      <div className="grid grid--inline">
        <Stat label={t({ fa: "پروژه‌ها", en: "Projects" }, lang)} value={formatNumber(projects.length, lang)} lang={lang} />
        <Stat label={t({ fa: "نقاط عطف کامل", en: "Milestones complete" }, lang)} value={`${formatNumber(totals.complete, lang)} / ${formatNumber(totals.milestones, lang)}`} tone="good" lang={lang} />
        <Stat label={t({ fa: "نقاط عطف مسدود", en: "Milestones blocked" }, lang)} value={formatNumber(totals.blocked, lang)} tone="danger" lang={lang} />
        <Stat label={t({ fa: "حق حکمرانی اعطاشده", en: "Governance rights granted" }, lang)} value={formatNumber(0, lang)} tone="good" lang={lang} />
      </div>

      <Callout tone="warn" title={t({ fa: "سیاست مشوق‌ها", en: "Incentive policy" }, lang)}>
        <p>{t(incentivePolicy.notice, lang)}</p>
        <ul className="tight-list">
          <li>
            {t({ fa: "خرید حکمرانی با پول:", en: "Governance purchasable with money:" }, lang)}{" "}
            {incentivePolicy.governancePurchasable ? dict.yes : dict.no}
          </li>
          <li>
            {t({ fa: "رأی وزنی:", en: "Weighted voting:" }, lang)} {incentivePolicy.weightedVoting ? dict.yes : dict.no}
          </li>
          <li>
            {t({ fa: "نفوذ مالی:", en: "Financial influence:" }, lang)} {incentivePolicy.financialInfluence ? dict.yes : dict.no}
          </li>
        </ul>
      </Callout>

      <div className="project-stack">
        {projects.map((project) => {
          const isOpen = open === project.id;
          const complete = project.milestones.filter((m) => m.status === "complete").length;
          return (
            <Card
              key={project.id}
              className="project"
              title={t(project.title, lang)}
              subtitle={`${project.id} · ${project.workstream}`}
              actions={
                <div className="chip-row">
                  <Badge tone={REVIEW_TONE[project.reviewStatus] ?? "neutral"}>{labelFor(project.reviewStatus, lang)}</Badge>
                  <button type="button" className="btn btn--ghost" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : project.id)}>
                    {isOpen ? dict.hide : dict.viewDetails}
                  </button>
                </div>
              }
            >
              <p>{t(project.objectives, lang)}</p>
              <div className="progress-row">
                <span>
                  {t({ fa: "پیشرفت نقاط عطف", en: "Milestone progress" }, lang)}: {formatNumber(complete, lang)} /{" "}
                  {formatNumber(project.milestones.length, lang)}
                </span>
                <Meter value={complete} max={project.milestones.length} label={t({ fa: "نقاط عطف کامل", en: "Milestones complete" }, lang)} />
              </div>

              {isOpen ? (
                <div className="project__detail">
                  <h4 className="minor-heading">{t({ fa: "تحویل‌شدنی‌ها", en: "Deliverables" }, lang)}</h4>
                  <ul className="tight-list">
                    {project.deliverables.map((item, index) => (
                      <li key={index}>{t(item, lang)}</li>
                    ))}
                  </ul>

                  <h4 className="minor-heading">{t({ fa: "نقاط عطف و شواهد", en: "Milestones and evidence" }, lang)}</h4>
                  <ul className="milestone-list">
                    {project.milestones.map((milestone) => (
                      <li key={milestone.id}>
                        <div className="milestone__head">
                          <span className="mono">{milestone.id}</span>
                          <strong>{t(milestone.title, lang)}</strong>
                          <Badge tone={MILESTONE_STATUS[milestone.status]?.tone ?? "neutral"}>
                            {t(MILESTONE_STATUS[milestone.status] ?? { fa: milestone.status, en: milestone.status }, lang)}
                          </Badge>
                        </div>
                        <p className="muted mono">{t(milestone.evidence, lang)}</p>
                      </li>
                    ))}
                  </ul>

                  <h4 className="minor-heading">{t({ fa: "شواهد تکمیل", en: "Evidence of completion" }, lang)}</h4>
                  <p>{t(project.evidenceOfCompletion, lang)}</p>

                  <FieldList
                    rows={[
                      { label: t({ fa: "مستندات عمومی", en: "Public documentation" }, lang), value: project.publicDocumentation },
                      { label: t({ fa: "جریان کاری", en: "Workstream" }, lang), value: project.workstream },
                      {
                        label: t({ fa: "امتیاز حکمرانی اعطا می‌کند؟", en: "Grants governance privilege?" }, lang),
                        value: project.governancePrivilegeGranted ? dict.yes : dict.no
                      }
                    ]}
                  />

                  <Callout tone="info" title={t({ fa: "سیاست مشوق این پروژه", en: "Incentive policy for this project" }, lang)}>
                    {t(project.incentiveNotice, lang)}
                  </Callout>
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>

      {projects.length === 0 ? <Empty lang={lang} /> : null}
    </>
  );
}
