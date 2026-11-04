import { useMemo, useState } from "react";
import { useApi } from "../lib/api.js";
import { t, formatNumber, RELATION_TYPES, labelFor } from "../i18n.js";
import { SectionHeader, Card, StateBlock, EpistemicBadge, Badge, Callout, Empty, FieldList, Drawer } from "../components/ui.jsx";

// Wraps a label into at most two short lines so text stays inside its node circle.
function wrapLabel(text, maxChars = 15) {
  const clean = String(text ?? "").trim();
  if (clean.length <= maxChars) return [clean];
  const words = clean.split(/\s+/);
  const lines = [""];
  for (const word of words) {
    const current = lines[lines.length - 1];
    if (current.length + word.length + 1 <= maxChars || current.length === 0) {
      lines[lines.length - 1] = current ? `${current} ${word}` : word;
    } else if (lines.length < 2) {
      lines.push(word);
    } else {
      break;
    }
  }
  const last = lines[lines.length - 1];
  if (lines.join(" ").length < clean.length && last.length > maxChars - 1) {
    lines[lines.length - 1] = `${last.slice(0, maxChars - 1)}…`;
  }
  return lines;
}

// Deterministic radial layout — no graph library, no runtime network access.
function layoutNodes(items, width, height) {
  const radius = Math.min(width, height) / 2 - 96;
  const cx = width / 2;
  const cy = height / 2;
  return items.map((item, index) => {
    const angle = (index / items.length) * Math.PI * 2 - Math.PI / 2;
    return {
      ...item,
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius
    };
  });
}

export default function Institutions({ lang, dict, openProvenance }) {
  const { status, payload, reload } = useApi("/api/v1/institutions");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [focusRelation, setFocusRelation] = useState(null);

  const nodes = useMemo(() => {
    if (!payload) return [];
    return layoutNodes(payload.data.institutions, 820, 620);
  }, [payload]);

  const filtered = useMemo(() => {
    if (!payload) return [];
    const q = query.trim().toLowerCase();
    if (!q) return payload.data.institutions;
    return payload.data.institutions.filter((institution) =>
      [t(institution.name, "fa"), t(institution.name, "en"), institution.id, institution.category, t(institution.purpose, "fa"), t(institution.purpose, "en")]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [payload, query]);

  if (status !== "ready") {
    return (
      <>
        <SectionHeader eyebrow={`${dict.modules} ۰۴`} title={dict.breadcrumbHome} />
        <StateBlock status={status} lang={lang} onRetry={reload} />
      </>
    );
  }

  const { institutions, relationships, notice } = payload.data;
  const byId = new Map(institutions.map((institution) => [institution.id, institution]));
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const selected = selectedId ? byId.get(selectedId) : null;

  return (
    <>
      <SectionHeader
        eyebrow={`${dict.modules} ۰۴ · ${t({ fa: "نقشهٔ وابستگی", en: "Dependency map" }, lang)}`}
        title={t({ fa: "کارپوشهٔ نهادها", en: "Institutional Directory" }, lang)}
        lede={t(
          {
            fa: "نهادهای پیشنهادی، دامنهٔ اختیار، سقف زمانی و روابط نظارتی. هیچ نهادی در این فهرست وجود خارجی یا اختیار قانونی ندارد.",
            en: "Proposed institutions, mandate scope, sunset limits, and oversight relations. No institution in this list has real existence or legal authority."
          },
          lang
        )}
      />

      <Callout tone="danger" title={t({ fa: "وضعیت همهٔ نهادها", en: "Status of every institution" }, lang)}>
        {t(notice, lang)}
      </Callout>

      <Card
        title={t({ fa: "نقشهٔ تعاملی روابط", en: "Interactive relationship map" }, lang)}
        subtitle={t(
          { fa: "خطوط، روابط نظارتی و حسابرسی را نشان می‌دهند. روی هر نهاد کلیک کنید تا جزئیات آن را ببینید.", en: "Lines show oversight and audit relationships. Click a node to inspect it." },
          lang
        )}
      >
        <div className="graph-wrap">
          <svg
            viewBox="0 0 820 620"
            className="graph"
            role="group"
            aria-label={t({ fa: "نقشهٔ روابط نهادی", en: "Institutional relationship map" }, lang)}
          >
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" className="graph__arrow" />
              </marker>
            </defs>
            {relationships.map((relation) => {
              const from = nodeById.get(relation.from);
              const to = nodeById.get(relation.to);
              if (!from || !to) return null;
              const active = focusRelation === relation.id;
              return (
                <g key={relation.id} className={`graph__edge ${active ? "is-active" : ""}`}>
                  <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} markerEnd="url(#arrow)" />
                  <title>
                    {t(relation.label, lang)} — {t(RELATION_TYPES[relation.type] ?? { fa: relation.type, en: relation.type }, lang)}
                  </title>
                </g>
              );
            })}
            {nodes.map((node) => {
              const isSelected = selectedId === node.id;
              const related = relationships.some(
                (relation) => relation.from === node.id || relation.to === node.id
              );
              return (
                <g
                  key={node.id}
                  className={`graph__node ${isSelected ? "is-selected" : ""} ${related ? "is-linked" : ""}`}
                  transform={`translate(${node.x}, ${node.y})`}
                  tabIndex={0}
                  role="button"
                  aria-label={t(node.name, lang)}
                  onMouseEnter={() => setFocusRelation(null)}
                  onClick={() => setSelectedId(node.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedId(node.id);
                    }
                  }}
                >
                  <circle r="58" className="graph__circle" />
                  <text className="graph__label" textAnchor="middle">
                    {wrapLabel(t(node.name, lang)).map((line, index, all) => (
                      <tspan key={index} x="0" dy={index === 0 ? (all.length === 1 ? -1 : -12) : 13}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                  <text className="graph__sublabel" textAnchor="middle" dy="26">
                    {labelFor(node.category, lang)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <ul className="legend">
          {Object.entries(RELATION_TYPES).map(([key, value]) => (
            <li key={key}>
              <span className={`legend__swatch legend__swatch--${key}`} aria-hidden="true" />
              {t(value, lang)}
            </li>
          ))}
        </ul>
        <details className="disclosure">
          <summary>{t({ fa: "فهرست متنی روابط (برای دسترس‌پذیری)", en: "Text list of relationships (accessibility)" }, lang)}</summary>
          <ul className="tight-list">
            {relationships.map((relation) => (
              <li key={relation.id}>
                <button
                  type="button"
                  className="link-btn"
                  onMouseEnter={() => setFocusRelation(relation.id)}
                  onFocus={() => setFocusRelation(relation.id)}
                  onClick={() => setFocusRelation(relation.id)}
                >
                  {relation.from} → {relation.to}
                </button>{" "}
                · {t(relation.label, lang)} · {labelFor(relation.epistemicStatus, lang)}
              </li>
            ))}
          </ul>
        </details>
      </Card>

      <Card
        title={t({ fa: "فهرست نهادها", en: "Institution list" }, lang)}
        actions={
          <label className="field">
            <span className="sr-only">{dict.searchInModule}</span>
            <input
              type="search"
              value={query}
              placeholder={dict.searchInModule}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        }
      >
        {filtered.length === 0 ? (
          <Empty lang={lang} />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <caption className="sr-only">{t({ fa: "فهرست نهادهای پیشنهادی", en: "List of proposed institutions" }, lang)}</caption>
              <thead>
                <tr>
                  <th scope="col">{t({ fa: "نهاد", en: "Institution" }, lang)}</th>
                  <th scope="col">{t({ fa: "دسته", en: "Category" }, lang)}</th>
                  <th scope="col">{t({ fa: "وضعیت معرفتی", en: "Epistemic status" }, lang)}</th>
                  <th scope="col">{t({ fa: "شرط خاتمه", en: "Sunset" }, lang)}</th>
                  <th scope="col">
                    <span className="sr-only">{dict.actions}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((institution) => (
                  <tr key={institution.id}>
                    <td>
                      <strong>{t(institution.name, lang)}</strong>
                      <p className="muted mono">{institution.id}</p>
                    </td>
                    <td>{labelFor(institution.category, lang)}</td>
                    <td>
                      <EpistemicBadge status={institution.epistemicStatus} lang={lang} />
                    </td>
                    <td>{t(institution.sunset, lang)}</td>
                    <td>
                      <button type="button" className="btn btn--ghost" onClick={() => setSelectedId(institution.id)}>
                        {dict.viewDetails}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        title={selected ? t(selected.name, lang) : ""}
        subtitle={selected ? selected.id : ""}
        lang={lang}
      >
        {selected ? (
          <div className="drawer-stack">
            <EpistemicBadge status={selected.epistemicStatus} lang={lang} />
            <FieldList
              rows={[
                { label: t({ fa: "هدف", en: "Purpose" }, lang), value: t(selected.purpose, lang) },
                { label: t({ fa: "پایهٔ حقوقی", en: "Basis" }, lang), value: t(selected.basis, lang) },
                { label: t({ fa: "مسئولیت‌ها", en: "Responsibilities" }, lang), value: selected.responsibilities.map((r) => t(r, lang)).join(" · ") },
                { label: t({ fa: "وابسته به", en: "Depends on" }, lang), value: selected.dependsOn.join(", ") || dict.none },
                { label: t({ fa: "سازوکار پاسخگویی", en: "Accountability" }, lang), value: selected.oversight.map((o) => t(o, lang)).join(" · ") },
                { label: t({ fa: "شرط خاتمه", en: "Sunset clause" }, lang), value: t(selected.sunset, lang) },
                { label: t({ fa: "عملیاتی است؟", en: "Operational?" }, lang), value: selected.isOperational ? dict.yes : dict.no }
              ]}
            />
            <div className="chip-row">
              {selected.sourceRefs.map((ref) => (
                <button
                  key={ref}
                  type="button"
                  className="btn btn--ghost"
                  onClick={() =>
                    openProvenance({
                      id: ref,
                      label: t(selected.name, lang),
                      rows: [
                        { label: dict.source, value: ref },
                        { label: dict.reviewer, value: "editorial-reviewed" }
                      ],
                      epistemicStatus: selected.epistemicStatus,
                      contradictions: []
                    })
                  }
                >
                  {dict.inspectProvenance} · {ref}
                </button>
              ))}
            </div>
            <Callout tone="warn">
              {t(
                {
                  fa: "این نهاد فقط یک طرح روی کاغذ است. هیچ‌کس منصوب نشده، هیچ بودجه‌ای تخصیص نیافته و هیچ اختیاری واگذار نشده است.",
                  en: "This institution exists only on paper. Nobody has been appointed, no budget allocated, and no authority delegated."
                },
                lang
              )}
            </Callout>
          </div>
        ) : null}
      </Drawer>

      <p className="page-foot muted">
        {t({ fa: "تعداد نهادها:", en: "Institutions:" }, lang)} {formatNumber(institutions.length, lang)} ·{" "}
        {t({ fa: "روابط ثبت‌شده:", en: "Recorded relations:" }, lang)} {formatNumber(relationships.length, lang)} ·{" "}
        {t({ fa: "عملیاتی:", en: "Operational:" }, lang)} {formatNumber(0, lang)}
      </p>
    </>
  );
}
