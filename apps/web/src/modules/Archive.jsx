import { useEffect, useMemo, useState } from "react";
import { useApi, useDebounced } from "../lib/api.js";
import { t, formatNumber, FLAG_TYPES, REVIEW_STATUS, labelFor, formatDate } from "../i18n.js";
import { SectionHeader, Card, StateBlock, EpistemicBadge, Badge, Callout, Empty, FieldList, Drawer, Stat, Disclosure, Toast } from "../components/ui.jsx";

function buildArchiveQuery({ q, era, field, region }) {
  const params = new URLSearchParams();
  if (q.trim()) params.set("q", q.trim());
  if (era !== "all") params.set("era", era);
  if (field !== "all") params.set("field", field);
  if (region !== "all") params.set("region", region);
  const query = params.toString();
  return query ? `/api/v1/archive?${query}` : "/api/v1/archive";
}

export default function Archive({ lang, dict, openProvenance, navigate, initialRecordId = null }) {
  const [q, setQ] = useState("");
  const [era, setEra] = useState("all");
  const [field, setField] = useState("all");
  const [region, setRegion] = useState("all");
  // A deep link (search result, shared URL) opens the dossier drawer directly.
  const [detailId, setDetailId] = useState(initialRecordId);
  const [flagNote, setFlagNote] = useState("");
  const [toast, setToast] = useState("");

  const debouncedQuery = useDebounced(q, 220);
  const listPath = useMemo(
    () => buildArchiveQuery({ q: debouncedQuery, era, field, region }),
    [debouncedQuery, era, field, region]
  );
  const { status, payload, error, reload } = useApi(listPath);
  const detailState = useApi(detailId ? `/api/v1/archive/${detailId}` : null);

  useEffect(() => {
    setDetailId(initialRecordId ?? null);
  }, [initialRecordId]);

  return (
    <>
      <SectionHeader
        eyebrow={`${dict.modules} ۰۵ · ${t({ fa: "فقط فوت‌شدگان · دادهٔ ساختگی", en: "Deceased only · synthetic data" }, lang)}`}
        title={t({ fa: "بایگانی تاریخی", en: "Historical Archive" }, lang)}
        lede={t(
          {
            fa: "پرونده‌های ساختاریافته با جستجوی دوزبانه، استناد، روایت‌های متناقض و تاریخچهٔ بازبینی. همهٔ پرونده‌های این نمونه خیالی‌اند.",
            en: "Structured dossiers with bilingual search, citations, conflicting accounts, and revision history. Every dossier here is fictional."
          },
          lang
        )}
      />

      {status === "ready" ? (
        <>
          <Callout tone="danger" title={t({ fa: "قاعدهٔ بنیادین", en: "Foundational rule" }, lang)}>
            <p>{t(payload.data.boundary.notice, lang)}</p>
            <ul className="tight-list">
              {payload.data.boundary.rules.map((rule, index) => (
                <li key={index}>{t(rule, lang)}</li>
              ))}
            </ul>
          </Callout>

          <div className="grid grid--inline">
            <Stat label={t({ fa: "پروندهٔ کل", en: "Total dossiers" }, lang)} value={formatNumber(payload.data.counts.total, lang)} lang={lang} />
            <Stat label={t({ fa: "نتایج صافی", en: "Filtered results" }, lang)} value={formatNumber(payload.data.counts.matched, lang)} lang={lang} />
            <Stat label={t({ fa: "پروندهٔ فرد زنده", en: "Living-person records" }, lang)} value={formatNumber(0, lang)} tone="good" lang={lang} />
            <Stat
              label={t({ fa: "ستون‌های اسکیما", en: "Schema columns" }, lang)}
              value={formatNumber(payload.data.schema.requiredColumns, lang)} lang={lang} />
          </div>
        </>
      ) : null}

      <Card
        title={t({ fa: "جستجو و صافی", en: "Search and filters" }, lang)}
        subtitle={t(
          { fa: "جستجو در نام فارسی و انگلیسی، نام‌های جایگزین، آثار و برچسب‌ها انجام می‌شود.", en: "Search covers Persian and English names, alternate names, works, and tags." },
          lang
        )}
        actions={
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              setQ("");
              setEra("all");
              setField("all");
              setRegion("all");
            }}
          >
            {dict.reset}
          </button>
        }
      >
        <div className="filter-grid">
          <label className="field field--wide">
            <span>{dict.searchInModule}</span>
            <input
              type="search"
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder={t({ fa: "مثلاً: کاشانی، Nishaburi، مشروطه، پزشکی…", en: "e.g. Kashani, نیشابوری, constitutional, medicine…" }, lang)}
              aria-describedby="archive-search-help"
            />
          </label>
          <label className="field">
            <span>{t({ fa: "دوران", en: "Era" }, lang)}</span>
            <select value={era} onChange={(event) => setEra(event.target.value)}>
              <option value="all">{dict.all}</option>
              {(payload?.data.filters.periods ?? []).map((item) => (
                <option key={item.id} value={item.id}>
                  {t(item.label, lang)}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>{t({ fa: "حوزه", en: "Discipline" }, lang)}</span>
            <select value={field} onChange={(event) => setField(event.target.value)}>
              <option value="all">{dict.all}</option>
              {(payload?.data.filters.disciplines ?? []).map((item) => (
                <option key={item.id} value={item.id}>
                  {t(item.label, lang)}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>{t({ fa: "منطقه", en: "Region" }, lang)}</span>
            <select value={region} onChange={(event) => setRegion(event.target.value)}>
              <option value="all">{dict.all}</option>
              {(payload?.data.filters.regions ?? []).map((item) => (
                <option key={item.id} value={item.id}>
                  {t(item.label, lang)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p id="archive-search-help" className="muted">
          {t(
            {
              fa: "جستجو نسبت به «ی/ك» عربی، نیم‌فاصله و اعداد فارسی/لاتین تحمل دارد.",
              en: "Search tolerates Arabic yeh/kaf, zero-width non-joiners, and Persian/Latin numerals."
            },
            lang
          )}
        </p>
      </Card>

      {status !== "ready" ? (
        <StateBlock status={status} lang={lang} onRetry={reload} error={error} />
      ) : payload.data.results.length === 0 ? (
        <Empty lang={lang}>{t({ fa: "هیچ پرونده‌ای با این صافی‌ها یافت نشد.", en: "No dossier matches these filters." }, lang)}</Empty>
      ) : (
        <div className="dossier-grid">
          {payload.data.results.map((dossier) => (
            <article key={dossier.id} className="dossier-card">
              <div className="dossier-card__top">
                <span className="dossier-card__id mono">{dossier.id}</span>
                <EpistemicBadge status={dossier.epistemicStatus} lang={lang} />
              </div>
              <h3>{t(dossier.name, lang)}</h3>
              <p className="dossier-card__alt">{dossier.alternateNames.map((n) => t(n, lang)).join(" · ")}</p>
              <p className="dossier-card__period">
                {t(dossier.period.label, lang)} · {t(dossier.discipline.label, lang)} · {t(dossier.region.label, lang)}
              </p>
              <p className="dossier-card__dates">
                {t(dossier.birth, lang)} — {t(dossier.death, lang)}
              </p>
              <div className="chip-row">
                <Badge tone="neutral">
                  {t({ fa: "آثار:", en: "Works:" }, lang)} {formatNumber(dossier.worksCount, lang)}
                </Badge>
                <Badge tone="info">
                  {t({ fa: "استناد:", en: "Citations:" }, lang)} {formatNumber(dossier.citationsCount, lang)}
                </Badge>
                {dossier.conflictCount > 0 ? (
                  <Badge tone="danger">
                    {t({ fa: "تناقض:", en: "Conflicts:" }, lang)} {formatNumber(dossier.conflictCount, lang)}
                  </Badge>
                ) : null}
                {dossier.openFlags > 0 ? (
                  <Badge tone="warn">
                    {t({ fa: "علامت باز:", en: "Open flags:" }, lang)} {formatNumber(dossier.openFlags, lang)}
                  </Badge>
                ) : null}
              </div>
              <div className="dossier-card__actions">
                <button type="button" className="btn btn--primary" onClick={() => setDetailId(dossier.id)}>
                  {t({ fa: "گشودن پرونده", en: "Open dossier" }, lang)}
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() =>
                    openProvenance({
                      id: dossier.id,
                      label: t(dossier.name, lang),
                      rows: [
                        { label: dict.source, value: t({ fa: "منابع ساختگی فهرست‌شده در پرونده", en: "Synthetic sources listed in the dossier" }, lang) },
                        { label: dict.reviewer, value: t(REVIEW_STATUS[dossier.editorialReview.status] ?? { fa: dossier.editorialReview.status, en: dossier.editorialReview.status }, lang) },
                        { label: dict.publicationDate, value: formatDate(dossier.editorialReview.lastReviewDate, lang) }
                      ],
                      epistemicStatus: dossier.epistemicStatus,
                      contradictions: []
                    })
                  }
                >
                  {dict.inspectProvenance}
                </button>
              </div>
              <p className="dossier-card__label">{dossier.syntheticLabel}</p>
            </article>
          ))}
        </div>
      )}

      <Card
        title={t({ fa: "دروازهٔ اعتبارسنجی ۷۷ ستونی", en: "77-column validation gate" }, lang)}
        subtitle={t(
          { fa: "گزارش اجرای واقعی اسکریپت روی فایل نمونهٔ ساختگی.", en: "The real output of the validator running on the synthetic sample file." },
          lang
        )}
      >
        {status !== "ready" ? null : (
          <>
            <FieldList
              rows={[
                { label: t({ fa: "فایل", en: "File" }, lang), value: payload.data.gate.file },
                {
                  label: t({ fa: "اسکیما معتبر است؟", en: "Schema valid?" }, lang),
                  value: payload.data.gate.schemaValid ? dict.yes : dict.no
                },
                { label: t({ fa: "ردیف‌های بررسی‌شده", en: "Rows validated" }, lang), value: formatNumber(payload.data.gate.rowCount, lang) },
                { label: t({ fa: "ردیف فرد زنده", en: "Living rows" }, lang), value: formatNumber(payload.data.gate.livingRows, lang) },
                {
                  label: t({ fa: "ریسک بازشناسی بالا", en: "High re-identification rows" }, lang),
                  value: formatNumber(payload.data.gate.highReidentificationRows, lang)
                },
                {
                  label: t({ fa: "دروازهٔ انتشار عمومی", en: "Public release gate" }, lang),
                  value: t(payload.data.gate.gateState, lang)
                }
              ]}
            />
            {payload.data.gate.warnings.length > 0 ? (
              <details className="disclosure">
                <summary>{t({ fa: "هشدارهای اعتبارسنج", en: "Validator warnings" }, lang)} ({formatNumber(payload.data.gate.warnings.length, lang)})</summary>
                <ul className="tight-list">
                  {payload.data.gate.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </details>
            ) : null}
            <p className="muted mono">{payload.data.schema.validatorScript}</p>
          </>
        )}
      </Card>

      <Disclosure
        summary={t({ fa: "گردش‌کار ویرایشی و مراحل انتشار", en: "Editorial workflow and publication stages" }, lang)}
        meta={
          status === "ready"
            ? `${t({ fa: "مرحلهٔ جاری:", en: "Current stage:" }, lang)} ${payload.data.editorialWorkflow.currentStage}`
            : undefined
        }
      >
        {status === "ready" ? (
          <>
            <p>{t(payload.data.editorialWorkflow.notice, lang)}</p>
            <ol className="wf">
              {payload.data.editorialWorkflow.stages.map((stage) => (
                <li key={stage.id} className={stage.id === payload.data.editorialWorkflow.currentStage ? "wf--current" : ""}>
                  <p className="wf__label">
                    <span className="mono">{stage.id}</span> {t(stage.label, lang)}
                  </p>
                  <p className="wf__desc">{t(stage.description, lang)}</p>
                  <p className="muted">
                    {t({ fa: "گام بعدی مجاز:", en: "Allowed next:" }, lang)} {stage.allowedNext.join(", ") || dict.none}
                  </p>
                </li>
              ))}
            </ol>
          </>
        ) : null}
      </Disclosure>

      <Drawer
        open={Boolean(detailId)}
        onClose={() => {
          setDetailId(null);
          setFlagNote("");
          if (initialRecordId && navigate) navigate("historical-archive");
        }}
        title={detailState.status === "ready" ? t(detailState.payload.data.dossier.name, lang) : dict.loading}
        subtitle={detailId ?? ""}
        lang={lang}
      >
        {detailState.status === "ready" ? (
          <DossierDetail
            dossier={detailState.payload.data.dossier}
            lang={lang}
            dict={dict}
            openProvenance={openProvenance}
            navigate={navigate}
            onClose={() => setDetailId(null)}
            toast={setToast}
            flagNote={flagNote}
            setFlagNote={setFlagNote}
          />
        ) : (
          <StateBlock status={detailState.status} lang={lang} onRetry={detailState.reload} error={detailState.error} />
        )}
      </Drawer>

      <Toast message={toast} lang={lang} onClose={() => setToast("")} />
    </>
  );
}

function DossierDetail({ dossier, lang, dict, openProvenance, navigate, onClose, toast, flagNote, setFlagNote }) {
  const [tab, setTab] = useState("bio");
  const tabs = [
    { id: "bio", label: { fa: "زندگی‌نامه", en: "Biography" } },
    { id: "works", label: { fa: "آثار", en: "Works" } },
    { id: "citations", label: { fa: "استنادها", en: "Citations" } },
    { id: "conflicts", label: { fa: "روایت‌های متناقض", en: "Conflicting accounts" } },
    { id: "relations", label: { fa: "روابط", en: "Relationships" } },
    { id: "history", label: { fa: "تاریخچه و علامت‌ها", en: "History & flags" } }
  ];

  return (
    <div className="drawer-stack">
      <div className="chip-row">
        <EpistemicBadge status={dossier.epistemicStatus} lang={lang} />
        <Badge tone="danger">{dossier.syntheticLabel}</Badge>
        <Badge tone="neutral">
          {t({ fa: "وضعیت:", en: "Status:" }, lang)} {labelFor(dossier.status, lang)}
        </Badge>
      </div>

      <FieldList
        rows={[
          { label: t({ fa: "زادروز", en: "Birth" }, lang), value: `${t(dossier.birth.display, lang)} — ${t(dossier.birth.place, lang)}` },
          { label: t({ fa: "درگذشت", en: "Death" }, lang), value: `${t(dossier.death.display, lang)} — ${t(dossier.death.place, lang)}` },
          { label: t({ fa: "دقت تاریخ", en: "Date precision" }, lang), value: dossier.birth.precision },
          { label: t({ fa: "پیشه‌ها", en: "Occupations" }, lang), value: dossier.occupations.map((o) => t(o, lang)).join(" · ") },
          { label: t({ fa: "منطقه", en: "Region" }, lang), value: t(dossier.region.label, lang) },
          { label: t({ fa: "بازبینی ویرایشی", en: "Editorial review" }, lang), value: `${t(REVIEW_STATUS[dossier.editorialReview.status] ?? { fa: dossier.editorialReview.status, en: dossier.editorialReview.status }, lang)} · ${dossier.editorialReview.lastReviewDate}` }
        ]}
      />

      <div className="tabs" role="tablist" aria-label={t({ fa: "بخش‌های پرونده", en: "Dossier sections" }, lang)}>
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={tab === item.id}
            aria-controls={`panel-${item.id}`}
            className={`tab ${tab === item.id ? "is-active" : ""}`}
            onClick={() => setTab(item.id)}
          >
            {t(item.label, lang)}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="tab-panel">
        {tab === "bio" ? (
          <>
            <p>{t(dossier.biography, lang)}</p>
            <h4 className="minor-heading">{t({ fa: "رویدادهای مهم", en: "Important events" }, lang)}</h4>
            <ol className="timeline timeline--compact">
              {dossier.importantEvents.map((event) => (
                <li key={event.id}>
                  <span className="timeline__dot" aria-hidden="true" />
                  <div>
                    <p className="timeline__title">{event.year}</p>
                    <p className="timeline__body">{t(event.event, lang)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </>
        ) : null}

        {tab === "works" ? (
          <ul className="tight-list">
            {dossier.majorWorks.map((work) => (
              <li key={work.id}>
                <strong>{t(work.title, lang)}</strong> — {work.year} <Badge tone="synthetic">{work.authenticity}</Badge>
              </li>
            ))}
          </ul>
        ) : null}

        {tab === "citations" ? (
          <ul className="citation-list">
            {dossier.citations.map((citation) => (
              <li key={citation.id}>
                <p className="citation__title">{t(citation.sourceTitle, lang)}</p>
                <p className="citation__meta">
                  <span className="mono">{citation.sourceId}</span> · {citation.pageOrSection} · {citation.sourceType} ·{" "}
                  <Badge tone="warn">{citation.reliability}</Badge>
                </p>
                <p className="muted">{t(citation.note, lang)}</p>
              </li>
            ))}
            <li className="citation-list__reliability">
              <strong>{t({ fa: "ارزیابی اعتبار منابع", en: "Source reliability assessment" }, lang)}:</strong>{" "}
              {labelFor(dossier.sourceReliability.level, lang)} — {t(dossier.sourceReliability.rationale, lang)}
            </li>
          </ul>
        ) : null}

        {tab === "conflicts" ? (
          dossier.conflictingAccounts.length === 0 ? (
            <p className="muted">{t({ fa: "روایت متناقضی ثبت نشده است.", en: "No conflicting account is recorded." }, lang)}</p>
          ) : (
            <div className="conflict-stack">
              {dossier.conflictingAccounts.map((conflict) => (
                <div key={conflict.id} className="conflict">
                  <h4>{t(conflict.topic, lang)}</h4>
                  <div className="conflict__compare">
                    <div className="conflict__side">
                      <Badge tone="info">{t({ fa: "روایت الف", en: "Account A" }, lang)}</Badge>
                      <p>{t(conflict.accountA.claim, lang)}</p>
                      <p className="mono muted">{conflict.accountA.sourceId}</p>
                    </div>
                    <div className="conflict__side">
                      <Badge tone="info">{t({ fa: "روایت ب", en: "Account B" }, lang)}</Badge>
                      <p>{t(conflict.accountB.claim, lang)}</p>
                      <p className="mono muted">{conflict.accountB.sourceId}</p>
                    </div>
                  </div>
                  <p className="conflict__status">
                    <Badge tone="danger">{labelFor(conflict.status, lang)}</Badge> {t(conflict.note, lang)}
                  </p>
                </div>
              ))}
            </div>
          )
        ) : null}

        {tab === "relations" ? (
          <ul className="tight-list">
            {dossier.relationships.map((relation) => (
              <li key={relation.id}>
                <Badge tone="neutral">{labelFor(relation.type, lang)}</Badge> <strong>{t(relation.targetName, lang)}</strong>
                <p className="muted">{t(relation.note, lang)}</p>
              </li>
            ))}
          </ul>
        ) : null}

        {tab === "history" ? (
          <>
            <h4 className="minor-heading">{dict.revisionHistory}</h4>
            <ol className="timeline timeline--compact">
              {dossier.revisionHistory.map((revision, index) => (
                <li key={index}>
                  <span className="timeline__dot" aria-hidden="true" />
                  <div>
                    <p className="timeline__title">
                      {labelFor(revision.version, lang)} · {formatDate(revision.date, lang)}
                    </p>
                    <p className="timeline__body">{t(revision.change, lang)}</p>
                    <p className="muted">{t(revision.author, lang)}</p>
                  </div>
                </li>
              ))}
            </ol>
            <h4 className="minor-heading">{t({ fa: "علامت‌های باز", en: "Open flags" }, lang)}</h4>
            <ul className="tight-list">
              {dossier.flags.map((flag) => (
                <li key={flag.id}>
                  <Badge tone={flag.type === "contradictory-information" ? "danger" : "warn"}>
                    {t(FLAG_TYPES[flag.type] ?? { fa: flag.type, en: flag.type }, lang)}
                  </Badge>{" "}
                  {t(flag.note, lang)}
                </li>
              ))}
            </ul>
            <div className="flag-form">
              <label className="field">
                <span>{t({ fa: "ثبت علامت کمبود یا تناقض (فقط در مرورگر شما)", en: "Flag missing or contradictory information (browser only)" }, lang)}</span>
                <textarea
                  rows={3}
                  value={flagNote}
                  onChange={(event) => setFlagNote(event.target.value)}
                  placeholder={t({ fa: "توضیح کوتاه…", en: "Short description…" }, lang)}
                />
              </label>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => {
                  if (!flagNote.trim()) return;
                  toast(
                    t(
                      {
                        fa: "علامت در حافظهٔ مرورگر ثبت شد — هیچ داده‌ای ارسال نشد و هیچ پرونده‌ای تغییر نکرد.",
                        en: "Flag held in browser memory only — no data was sent and no dossier was changed."
                      },
                      lang
                    )
                  );
                  setFlagNote("");
                }}
              >
                {t({ fa: "ثبت نمایشی علامت", en: "Record flag (demo)" }, lang)}
              </button>
              <p className="muted">{dict.demoActionNotice}</p>
            </div>
          </>
        ) : null}
      </div>

      <div className="drawer__foot">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() =>
            openProvenance({
              id: dossier.id,
              label: t(dossier.name, lang),
              rows: [
                { label: dict.source, value: dossier.citations.map((c) => c.sourceId).join(", ") || dict.none },
                { label: dict.reviewer, value: t(REVIEW_STATUS[dossier.editorialReview.status] ?? { fa: "—", en: "—" }, lang) },
                { label: dict.section, value: t({ fa: "پروندهٔ ساختگی کامل", en: "Full synthetic dossier" }, lang) }
              ],
              epistemicStatus: dossier.epistemicStatus,
              contradictions: dossier.conflictingAccounts.map((c) => ({ topic: t(c.topic, lang), note: c.note })),
              revisions: dossier.revisionHistory
            })
          }
        >
          {dict.inspectProvenance}
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => navigate("research")}>
          {dict.openInResearch}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onClose}>
          {dict.close}
        </button>
      </div>
    </div>
  );
}
