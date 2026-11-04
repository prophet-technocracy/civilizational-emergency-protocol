import { useEffect, useMemo, useState } from "react";
import { useApi } from "../lib/api.js";
import { t, formatNumber, BAND_TONES, labelFor } from "../i18n.js";
import { SectionHeader, Card, StateBlock, Badge, Callout, Empty, FieldList, Disclosure } from "../components/ui.jsx";

const PROOF_OPTIONS = [
  { id: "passkey_session", label: { fa: "کلید نشست شبه‌ناشناس", en: "Pseudonymous session key" } },
  { id: "selective_credential", label: { fa: "گواهی ویژگی انتخابی", en: "Selective attribute credential" } },
  { id: "org_role_contract", label: { fa: "قرارداد نقش سازمانی", en: "Organizational role contract" } },
  { id: "dual_control_approval", label: { fa: "تأیید دوگانهٔ مستقل", en: "Independent dual approval" } },
  { id: "telegram_citizenship", label: { fa: "حساب تلگرام (ردشده)", en: "Telegram account (rejected)" } },
  { id: "ai_location_photo_challenge", label: { fa: "چالش عکس/مکان (ردشده)", en: "Photo/location challenge (rejected)" } },
  { id: "social_credit_score", label: { fa: "امتیاز اجتماعی (ردشده)", en: "Social-credit score (rejected)" } }
];

const DECISION_TONE = {
  ALLOW: "good",
  PROHIBITED_BY_CHARTER: "danger",
  DENY_INSUFFICIENT_ASSURANCE: "warn",
  DENY: "danger"
};

export default function Verification({ lang, dict }) {
  const { status, payload, reload } = useApi("/api/v1/verification");
  const [action, setAction] = useState("VIEW-PUBLIC-DOCS");
  const [band, setBand] = useState(1);
  const [proofs, setProofs] = useState([]);
  const [result, setResult] = useState(null);
  const [evaluating, setEvaluating] = useState(false);

  const policies = payload?.data.policies ?? [];

  useEffect(() => {
    if (!payload) return;
    const policy = payload.data.policies.find((item) => item.actionId === action);
    if (policy) {
      setBand(policy.minimumBand);
      setProofs([]);
    }
  }, [payload, action]);

  const activePolicy = useMemo(() => policies.find((item) => item.actionId === action), [policies, action]);

  function evaluate() {
    setEvaluating(true);
    const params = new URLSearchParams({ action, band: String(band) });
    if (proofs.length > 0) params.set("proofs", proofs.join(","));
    fetch(`/api/v1/verification/evaluate?${params.toString()}`, {
      headers: { Accept: "application/json" },
      credentials: "omit"
    })
      .then((response) => response.json())
      .then((body) => setResult(body.data))
      .catch(() => setResult(null))
      .finally(() => setEvaluating(false));
  }

  function toggleProof(id) {
    setProofs((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  if (status !== "ready") {
    return (
      <>
        <SectionHeader eyebrow={`${dict.modules} ۰۷`} title={dict.breadcrumbHome} />
        <StateBlock status={status} lang={lang} onRetry={reload} />
      </>
    );
  }

  const { bands, rejectedProofs, simulationNotice, guards } = payload.data;

  return (
    <>
      <SectionHeader
        eyebrow={`${dict.modules} ۰۷ · ${t({ fa: "مجوز کنش، نه رتبهٔ انسان", en: "Action authorization, not human ranking" }, lang)}`}
        title={t({ fa: "تضمین دسترسی پنج‌سطحی", en: "Five-Band Assurance" }, lang)}
        lede={t(
          {
            fa: "پنج سطح، مجوز انجام یک کنش مشخص روی یک منبع مشخص را می‌دهند. هیچ سطحی «ارزش» یا «اعتبار» یک انسان را نمی‌سنجد.",
            en: "Five bands authorize a specific action on a specific resource. No band measures a person's 'worth' or 'credit'."
          },
          lang
        )}
      />

      <Callout tone="warn" title={t({ fa: "محدودهٔ شبیه‌ساز", en: "Simulator scope" }, lang)}>
        {t(simulationNotice, lang)}
      </Callout>

      <div className="band-grid">
        {bands.map((item, index) => (
          <article key={item.id} className={`band band--${BAND_TONES[index]}`}>
            <div className="band__head">
              <span className="band__num">{formatNumber(item.bandNumber, lang)}</span>
              <div>
                <h2 className="band__title">{t(item.name, lang)}</h2>
                <Badge tone={item.isSimulated ? "warn" : "good"}>
                  {item.isSimulated ? t({ fa: "شبیه‌سازی", en: "Simulated" }, lang) : t({ fa: "پیاده‌سازی‌شده (همین سامانه)", en: "Implemented (this system)" }, lang)}
                </Badge>
              </div>
            </div>
            <p className="band__question">{t(item.question, lang)}</p>
            <h3 className="minor-heading">{t({ fa: "حداقل مدرک لازم", en: "Minimum evidence" }, lang)}</h3>
            <p>{t(item.minimumEvidence, lang)}</p>
            <h3 className="minor-heading">{t({ fa: "کنش‌های مجاز نمونه", en: "Sample permitted actions" }, lang)}</h3>
            <ul className="tight-list">
              {item.permittedActions.map((action, i) => (
                <li key={i}>{t(action, lang)}</li>
              ))}
            </ul>
            <h3 className="minor-heading">{t({ fa: "آنچه این سطح اثبات نمی‌کند", en: "What this band does not prove" }, lang)}</h3>
            <p className="band__not">{t(item.notImplied, lang)}</p>
            <p className="muted">{t(item.realImplementation, lang)}</p>
          </article>
        ))}
      </div>

      <Card
        title={t({ fa: "شبیه‌ساز مجوز کنش", en: "Action policy simulator" }, lang)}
        subtitle={t({ fa: "یک کنش، یک سطح و مجموعه‌ای از مدارک را انتخاب کنید.", en: "Choose an action, a band, and a set of proofs." }, lang)}
      >
        <div className="sim-grid">
          <div className="sim-controls">
            <label className="field">
              <span>{t({ fa: "کنش درخواستی", en: "Requested action" }, lang)}</span>
              <select value={action} onChange={(event) => setAction(event.target.value)}>
                {policies.map((policy) => (
                  <option key={policy.actionId} value={policy.actionId}>
                    {t(policy.title, lang)}
                  </option>
                ))}
              </select>
            </label>

            {activePolicy ? (
              <Callout tone={activePolicy.isConstitutionallyProhibited ? "danger" : "info"} title={t(activePolicy.title, lang)}>
                {activePolicy.description ? t(activePolicy.description, lang) : null}
              </Callout>
            ) : null}

            <label className="field">
              <span>
                {t({ fa: "سطح ارائه‌شده", en: "Presented band" }, lang)}: {formatNumber(band, lang)}
              </span>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={band}
                onChange={(event) => setBand(Number(event.target.value))}
                aria-valuemin={1}
                aria-valuemax={5}
                aria-valuenow={band}
              />
              <span className="range-scale" aria-hidden="true">
                <span>۱</span>
                <span>۲</span>
                <span>۳</span>
                <span>۴</span>
                <span>۵</span>
              </span>
            </label>

            <fieldset className="field">
              <legend>{t({ fa: "مدارک ارائه‌شده", en: "Presented proofs" }, lang)}</legend>
              <div className="check-grid">
                {PROOF_OPTIONS.map((proof) => (
                  <label key={proof.id} className={`check ${proof.id.includes("telegram") || proof.id.includes("social") || proof.id.includes("photo") ? "check--rejected" : ""}`}>
                    <input type="checkbox" checked={proofs.includes(proof.id)} onChange={() => toggleProof(proof.id)} />
                    <span>{t(proof.label, lang)}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <button type="button" className="btn btn--primary btn--block" onClick={evaluate} disabled={evaluating}>
              {evaluating ? dict.loading : t({ fa: "ارزیابی سیاست", en: "Evaluate policy" }, lang)}
            </button>
            <p className="muted">{dict.demoActionNotice}</p>
          </div>

          <div className="sim-result">
            {result ? (
              <>
                <div className="decision-head">
                  <Badge tone={DECISION_TONE[result.evaluation.decision] ?? "neutral"}>{labelFor(result.evaluation.decision, lang)}</Badge>
                  <span className="mono">{result.evaluation.code}</span>
                </div>
                <p className="decision-text">{t(result.evaluation.reasonFa ? { fa: result.evaluation.reasonFa, en: result.evaluation.reasonEn } : { fa: "", en: "" }, lang)}</p>

                {result.evaluation.minimumBandRequired ? (
                  <p className="muted">
                    {t({ fa: "حداقل سطح لازم:", en: "Minimum band required:" }, lang)} {formatNumber(result.evaluation.minimumBandRequired, lang)}
                  </p>
                ) : null}

                {result.evaluation.missingProofs && result.evaluation.missingProofs.length > 0 ? (
                  <Callout tone="warn" title={t({ fa: "مدارک ناقص", en: "Missing proofs" }, lang)}>
                    <div className="chip-row">
                      {result.evaluation.missingProofs.map((proof) => (
                        <Badge key={proof} tone="warn">
                          {proof}
                        </Badge>
                      ))}
                    </div>
                  </Callout>
                ) : null}

                {result.evaluation.rejectedProofWarnings.length > 0 ? (
                  <Callout tone="danger" title={t({ fa: "مدرک ردشده", en: "Rejected proof" }, lang)}>
                    {result.evaluation.rejectedProofWarnings.map((warning, index) => (
                      <p key={index}>
                        <span className="mono">{warning.code}</span> — {t({ fa: warning.reasonFa, en: warning.reasonEn }, lang)}
                      </p>
                    ))}
                  </Callout>
                ) : null}

                {result.evaluation.separationOfConcerns ? (
                  <FieldList
                    rows={Object.entries(result.evaluation.separationOfConcerns).map(([key, value]) => ({
                      label: key,
                      value
                    }))}
                  />
                ) : null}
              </>
            ) : (
              <div className="sim-placeholder">
                <p className="sim-placeholder__glyph" aria-hidden="true">
                  ⛨
                </p>
                <p>{t({ fa: "نتیجهٔ ارزیابی اینجا نمایش داده می‌شود.", en: "The evaluation result appears here." }, lang)}</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card
        title={t({ fa: "ماتریس سیاست دسترسی", en: "Access policy matrix" }, lang)}
        subtitle={t({ fa: "هر ردیف یک کنش مشخص است، نه یک گروه از افراد.", en: "Each row is a specific action, not a group of people." }, lang)}
      >
        <div className="table-wrap">
          <table className="data-table">
            <caption className="sr-only">{t({ fa: "ماتریس سیاست دسترسی", en: "Access policy matrix" }, lang)}</caption>
            <thead>
              <tr>
                <th scope="col">{t({ fa: "کنش", en: "Action" }, lang)}</th>
                <th scope="col">{t({ fa: "منبع", en: "Resource" }, lang)}</th>
                <th scope="col">{t({ fa: "حداقل سطح", en: "Min band" }, lang)}</th>
                <th scope="col">{t({ fa: "مدارک لازم", en: "Required proofs" }, lang)}</th>
                <th scope="col">{t({ fa: "انقضا", en: "Expiry" }, lang)}</th>
                <th scope="col">{t({ fa: "وضعیت", en: "Status" }, lang)}</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy.actionId}>
                  <td>
                    <strong>{t(policy.title, lang)}</strong>
                    <p className="mono muted">{policy.actionId}</p>
                  </td>
                  <td>{labelFor(policy.resource, lang)}</td>
                  <td>{policy.isConstitutionallyProhibited ? "—" : formatNumber(policy.minimumBand, lang)}</td>
                  <td>{policy.requiredProofs.join(", ") || dict.none}</td>
                  <td>{t(policy.expiryPolicy, lang)}</td>
                  <td>
                    <Badge tone={policy.isConstitutionallyProhibited ? "danger" : "good"}>
                      {policy.isConstitutionallyProhibited
                        ? t({ fa: "ممنوع مطلق", en: "Absolutely prohibited" }, lang)
                        : t({ fa: "مجاز مشروط", en: "Conditionally allowed" }, lang)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card
        title={t({ fa: "سازوکارهای ردشده", en: "Rejected mechanisms" }, lang)}
        subtitle={t({ fa: "این‌ها هیچ‌گاه به‌عنوان مدرک پذیرفته نمی‌شوند.", en: "These are never accepted as proof." }, lang)}
      >
        <div className="reject-grid">
          {rejectedProofs.map((item) => (
            <article key={item.id} className="reject">
              <h3 className="conflict__title">{t(item.label, lang)}</h3>
              <p>{t(item.whyRejected, lang)}</p>
              <Badge tone="danger">{labelFor(item.category, lang)}</Badge>
            </article>
          ))}
        </div>
      </Card>

      <Disclosure summary={t({ fa: "پنج قاعدهٔ محافظ", en: "Five guard rules" }, lang)}>
        <ul className="tight-list">
          {guards.map((guard, index) => (
            <li key={index}>{t(guard, lang)}</li>
          ))}
        </ul>
        {bands.length === 0 ? <Empty lang={lang} /> : null}
      </Disclosure>
    </>
  );
}
