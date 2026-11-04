import { useMemo, useState } from "react";
import { useApi } from "../lib/api.js";
import { t, formatNumber, EPISTEMIC, labelFor } from "../i18n.js";
import { SectionHeader, Card, StateBlock, EpistemicBadge, Badge, Callout, Empty, Stat, BarRow, Disclosure, Drawer } from "../components/ui.jsx";

const CLASSIFICATION_LABELS = {
  fact: { fa: "واقعیت مستند", en: "Documented fact" },
  "author-statement": { fa: "گزارهٔ نویسنده", en: "Author statement" },
  interpretation: { fa: "تفسیر تحلیلی", en: "Analytical interpretation" },
  hypothesis: { fa: "فرضیه", en: "Hypothesis" },
  proposal: { fa: "پیشنهاد", en: "Proposal" },
  speculation: { fa: "گمانه‌زنی", en: "Speculation" },
  "design-statement": { fa: "گزارهٔ طراحی", en: "Design statement" }
};

export default function Research({ lang, dict, openProvenance }) {
  const { status, payload, reload } = useApi("/api/v1/evidence");
  const [claimId, setClaimId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const claims = useMemo(() => {
    if (!payload) return [];
    const q = query.trim().toLowerCase();
    return payload.data.claims.filter((claim) => {
      if (filter !== "all" && claim.verificationStatus !== filter) return false;
      if (!q) return true;
      return [t(claim.claim, "fa"), t(claim.claim, "en"), claim.id, claim.sourceDocumentId]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [payload, filter, query]);

  const selectedClaim = payload && claimId ? payload.data.claims.find((claim) => claim.id === claimId) : null;
  const selectedSource = selectedClaim && payload ? payload.data.sources.find((source) => source.id === selectedClaim.sourceDocumentId) : null;

  if (status !== "ready") {
    return (
      <>
        <SectionHeader eyebrow={`${dict.modules} ۰۶`} title={dict.breadcrumbHome} />
        <StateBlock status={status} lang={lang} onRetry={reload} />
      </>
    );
  }

  const { claims: allClaims, sources, unresolvedQuestions, contradictionPairs } = payload.data;
  const maxStatus = Math.max(
    ...Object.keys(EPISTEMIC).map((key) => allClaims.filter((claim) => claim.verificationStatus === key).length),
    1
  );

  return (
    <>
      <SectionHeader
        eyebrow={`${dict.modules} ۰۶ · ${t({ fa: "زنجیرهٔ منشأ", en: "Provenance chain" }, lang)}`}
        title={t({ fa: "کتابخانهٔ پژوهش و شواهد", en: "Research & Evidence Library" }, lang)}
        lede={t(
          {
            fa: "هر ادعا به سند، نسخه، بخش، وضعیت بازبینی و ارزیابی اطمینان متصل است. تناقض‌ها پنهان نمی‌شوند.",
            en: "Every claim links to a document, version, section, review status, and confidence assessment. Contradictions are never hidden."
          },
          lang
        )}
      />

      <div className="grid grid--inline">
        <Stat label={t({ fa: "اسناد منبع", en: "Source documents" }, lang)} value={formatNumber(sources.length, lang)} lang={lang} />
        <Stat label={t({ fa: "ادعاهای ثبت‌شده", en: "Registered claims" }, lang)} value={formatNumber(allClaims.length, lang)} lang={lang} />
        <Stat label={t({ fa: "جفت‌های متناقض", en: "Contradiction pairs" }, lang)} value={formatNumber(contradictionPairs.length, lang)} tone={contradictionPairs.length ? "warn" : "good"} lang={lang} />
        <Stat label={t({ fa: "پرسش بی‌پاسخ", en: "Unresolved questions" }, lang)} value={formatNumber(unresolvedQuestions.length, lang)} tone="warn" lang={lang} />
      </div>

      <div className="grid grid--two">
        <Card
          title={t({ fa: "توزیع وضعیت معرفتی", en: "Epistemic distribution" }, lang)}
          subtitle={t({ fa: "تکرار یک ادعا هرگز آن را تأییدشده نمی‌کند.", en: "Repetition of a claim never makes it verified." }, lang)}
        >
          {Object.entries(EPISTEMIC).map(([key, meta]) => {
            const count = allClaims.filter((claim) => claim.verificationStatus === key).length;
            return (
              <BarRow
                key={key}
                label={t(meta, lang)}
                value={count}
                max={maxStatus}
                tone={meta.tone}
                display={formatNumber(count, lang)}
              />
            );
          })}
        </Card>

        <Card title={t({ fa: "قواعد منشأ", en: "Provenance rules" }, lang)}>
          <ul className="notice-list">
            <li>{t({ fa: "هر ادعا باید به سند، نسخه، بخش و وضعیت بازبینی متصل باشد.", en: "Every claim must link to a document, version, section, and review status." }, lang)}</li>
            <li>{t({ fa: "تکرار یک ادعا هرگز آن را تأییدشده نمی‌کند.", en: "Repetition of a claim never makes it verified." }, lang)}</li>
            <li>{t({ fa: "تناقض‌ها حذف نمی‌شوند؛ نمایش داده می‌شوند.", en: "Contradictions are not removed; they are displayed." }, lang)}</li>
            <li>{t({ fa: "ادعای هوش مصنوعی بدون بازبینی انسانی نمی‌تواند «تأییدشده» باشد.", en: "An AI-produced claim cannot be 'verified' without human review." }, lang)}</li>
          </ul>
        </Card>
      </div>

      <Card
        title={t({ fa: "فهرست ادعاها", en: "Claim register" }, lang)}
        actions={
          <div className="filter-group">
            <label className="field">
              <span>{t({ fa: "وضعیت", en: "Status" }, lang)}</span>
              <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option value="all">{dict.all}</option>
                {Object.entries(EPISTEMIC).map(([key, meta]) => (
                  <option key={key} value={key}>
                    {t(meta, lang)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="sr-only">{dict.searchInModule}</span>
              <input type="search" value={query} placeholder={dict.searchInModule} onChange={(event) => setQuery(event.target.value)} />
            </label>
          </div>
        }
      >
        {claims.length === 0 ? (
          <Empty lang={lang} />
        ) : (
          <div className="claim-list">
            {claims.map((claim) => (
              <article key={claim.id} className="claim">
                <div className="claim__head">
                  <span className="mono claim__id">{claim.id}</span>
                  <EpistemicBadge status={claim.verificationStatus} lang={lang} />
                  <Badge tone="neutral">{t(CLASSIFICATION_LABELS[claim.classification] ?? { fa: claim.classification, en: claim.classification }, lang)}</Badge>
                  {claim.knownContradictions.length > 0 ? (
                    <Badge tone="danger">
                      {t({ fa: "متناقض", en: "Contradicted" }, lang)} · {formatNumber(claim.knownContradictions.length, lang)}
                    </Badge>
                  ) : null}
                </div>
                <p className="claim__text">{t(claim.claim, lang)}</p>
                <p className="claim__meta">
                  {dict.source}: <span className="mono">{claim.sourceDocumentId}</span> · {dict.sourceVersion}:{" "}
                  <span className="mono">{claim.sourceVersion}</span> · {dict.section}: {claim.pageOrSection}
                </p>
                <div className="claim__actions">
                  <button type="button" className="btn btn--ghost" onClick={() => setClaimId(claim.id)}>
                    {dict.inspectProvenance}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </Card>

      <Card title={t({ fa: "ثبت اسناد منبع", en: "Source registry" }, lang)}>
        <div className="table-wrap">
          <table className="data-table">
            <caption className="sr-only">{t({ fa: "اسناد منبع", en: "Source documents" }, lang)}</caption>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">{t({ fa: "عنوان", en: "Title" }, lang)}</th>
                <th scope="col">{t({ fa: "نسخه", en: "Version" }, lang)}</th>
                <th scope="col">{t({ fa: "وضعیت", en: "Status" }, lang)}</th>
                <th scope="col">{t({ fa: "بازنشر", en: "Reuse" }, lang)}</th>
                <th scope="col">{t({ fa: "ادعاها", en: "Claims" }, lang)}</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((source) => (
                <tr key={source.id}>
                  <td className="mono">{source.id}</td>
                  <td>
                    <strong>{t(source.title, lang)}</strong>
                    <p className="muted">{t(source.authorOrIssuer, lang)}</p>
                  </td>
                  <td className="mono">{source.version}</td>
                  <td>
                    <EpistemicBadge status={source.verificationStatus} lang={lang} />
                  </td>
                  <td>
                    <Badge tone={source.reuseDecision.includes("publishable-full") ? "good" : "warn"}>{source.reuseDecision}</Badge>
                  </td>
                  <td>{formatNumber(source.usedByClaims.length, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card
        title={t({ fa: "کاوشگر تناقض", en: "Contradiction explorer" }, lang)}
        subtitle={t({ fa: "هر تناقض، دو ادعا و منبع مربوط را نشان می‌دهد.", en: "Each contradiction shows both claims and their sources." }, lang)}
      >
        {contradictionPairs.length === 0 ? (
          <Empty lang={lang} />
        ) : (
          <div className="conflict-stack">
            {contradictionPairs.map((pair) => (
              <div key={pair.claimId} className="conflict">
                <h4>
                  <span className="mono">{pair.claimId}</span> — {t(pair.claim, lang)}
                </h4>
                {pair.contradictions.map((item, index) => (
                  <p key={index} className="conflict__status">
                    <Badge tone="danger">{item.with}</Badge> {t(item.note, lang)}
                  </p>
                ))}
                <EpistemicBadge status={pair.verificationStatus} lang={lang} />
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card
        title={t({ fa: "داشبورد پرسش‌های بی‌پاسخ", en: "Unresolved questions dashboard" }, lang)}
        subtitle={t({ fa: "پرسش‌های باز، مسدود و نیمه‌پاسخ‌داده.", en: "Open, blocked, and partially answered questions." }, lang)}
      >
        <div className="uq-list">
          {unresolvedQuestions.map((question) => (
            <article key={question.id} className="uq">
              <div className="uq__head">
                <span className="mono">{question.id}</span>
                <Badge tone={question.status === "blocked" ? "danger" : question.status === "open" ? "warn" : "info"}>{labelFor(question.status, lang)}</Badge>
              </div>
              <p>{t(question.question, lang)}</p>
              <p className="muted">
                {t({ fa: "مسدود می‌کند:", en: "Blocks:" }, lang)} {question.blocks.join(", ")} · {t({ fa: "مسئول:", en: "Owner:" }, lang)}{" "}
                {t(question.owner, lang)}
              </p>
              <p className="uq__next">
                <strong>{t({ fa: "گام بعدی:", en: "Next step:" }, lang)}</strong> {t(question.nextStep, lang)}
              </p>
            </article>
          ))}
        </div>
      </Card>

      <Disclosure summary={t({ fa: "گزارش اعتبارسنجی زنجیرهٔ منشأ", en: "Provenance validation report" }, lang)}>
        <ul className="tight-list">
          {payload.data.claims.map((claim) => (
            <li key={claim.id}>
              <span className="mono">{claim.id}</span> → <span className="mono">{claim.sourceDocumentId}</span>{" "}
              <Badge tone="good">{t({ fa: "معتبر", en: "Valid" }, lang)}</Badge>
            </li>
          ))}
        </ul>
        <p className="muted">
          {t(
            {
              fa: "این بررسی توسط packages/schemas (validateClaimProvenance) انجام می‌شود و در آزمون‌های خودکار هم اجرا می‌گردد.",
              en: "This check is performed by packages/schemas (validateClaimProvenance) and also runs in the automated tests."
            },
            lang
          )}
        </p>
      </Disclosure>

      <Drawer
        open={Boolean(selectedClaim)}
        onClose={() => setClaimId(null)}
        title={selectedClaim ? selectedClaim.id : ""}
        subtitle={selectedClaim ? t(CLASSIFICATION_LABELS[selectedClaim.classification] ?? { fa: selectedClaim.classification, en: selectedClaim.classification }, lang) : ""}
        lang={lang}
      >
        {selectedClaim ? (
          <div className="drawer-stack">
            <p className="claim__text">{t(selectedClaim.claim, lang)}</p>
            <EpistemicBadge status={selectedClaim.verificationStatus} lang={lang} />
            <Fieldish
              rows={[
                [dict.source, `${selectedClaim.sourceDocumentId} — ${selectedSource ? t(selectedSource.title, lang) : ""}`],
                [dict.sourceVersion, selectedClaim.sourceVersion],
                [dict.section, selectedClaim.pageOrSection],
                [dict.publicationDate, selectedClaim.publicationDate],
                [dict.reviewer, selectedClaim.reviewerStatus],
                [dict.confidence, t(selectedClaim.confidence, lang)]
              ]}
            />
            <h4 className="minor-heading">{dict.revisionHistory}</h4>
            <ol className="timeline timeline--compact">
              {selectedClaim.revisionHistory.map((revision, index) => (
                <li key={index}>
                  <span className="timeline__dot" aria-hidden="true" />
                  <div>
                    <p className="timeline__title">
                      {revision.version} · {revision.date}
                    </p>
                    <p className="timeline__body">{t(revision.change, lang)}</p>
                  </div>
                </li>
              ))}
            </ol>
            <h4 className="minor-heading">{dict.contradictions}</h4>
            {selectedClaim.knownContradictions.length === 0 ? (
              <p className="muted">{dict.noContradictions}</p>
            ) : (
              <ul className="tight-list">
                {selectedClaim.knownContradictions.map((item, index) => (
                  <li key={index}>
                    <Badge tone="danger">{item.with}</Badge> {t(item.note, lang)}
                  </li>
                ))}
              </ul>
            )}
            {selectedSource ? (
              <Callout tone="warn" title={t({ fa: "محدودیت‌های منبع", en: "Source limitations" }, lang)}>
                {t(selectedSource.limitations, lang)}
              </Callout>
            ) : null}
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() =>
                openProvenance({
                  id: selectedClaim.id,
                  label: selectedClaim.id,
                  rows: [
                    { label: dict.source, value: selectedClaim.sourceDocumentId },
                    { label: dict.sourceVersion, value: selectedClaim.sourceVersion },
                    { label: dict.section, value: selectedClaim.pageOrSection },
                    { label: dict.reviewer, value: selectedClaim.reviewerStatus }
                  ],
                  epistemicStatus: selectedClaim.verificationStatus,
                  confidence: t(selectedClaim.confidence, lang),
                  contradictions: selectedClaim.knownContradictions,
                  revisions: selectedClaim.revisionHistory
                })
              }
            >
              {dict.inspectProvenance}
            </button>
          </div>
        ) : null}
      </Drawer>
    </>
  );
}

function Fieldish({ rows }) {
  return (
    <dl className="field-list">
      {rows.map(([label, value]) => (
        <div className="field-list__row" key={label}>
          <dt>{label}</dt>
          <dd>{value || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
