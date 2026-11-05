import { useApi } from "../lib/api.js";
import { t, formatNumber, UI, MODULES, EPISTEMIC, formatDate } from "../i18n.js";
import { SectionHeader, Card, Stat, BarRow, EpistemicBadge, StateBlock, Callout, Badge, Empty, Disclosure } from "../components/ui.jsx";
import { Icon } from "../components/icons.jsx";

const TONE_BY_KEY = {
  good: "good",
  neutral: "neutral",
  warning: "warn"
};

export default function Dashboard({ lang, dict, navigate, openProvenance }) {
  const { status, payload, reload } = useApi("/api/v1/dashboard");

  if (status !== "ready") {
    return (
      <>
        <SectionHeader eyebrow={`${dict.modules} ۰۱`} title={dict.breadcrumbHome} />
        <StateBlock status={status} lang={lang} onRetry={reload} />
      </>
    );
  }

  const data = payload.data;
  const maxEpistemic = Math.max(...data.epistemicDistribution.map((row) => row.count), 1);

  return (
    <>
      <SectionHeader
        eyebrow={`${dict.modules} ۰۱ · ${t({ fa: "نمای فرماندهی", en: "Command overview" }, lang)}`}
        title={t(MODULES[0].title, lang)}
        lede={t(
          {
            fa: "نمایی از وضعیت این نمونهٔ مهندسی: چه چیزی ساخته شده، چه چیزی ساختگی است، و چه چیزی هنوز به بازبینی انسانی نیاز دارد.",
            en: "A view of this engineering prototype: what is built, what is synthetic, and what still requires human review."
          },
          lang
        )}
      />

      <div className="grid grid--stats">
        {data.figures.map((figure) => (
          <Stat
            key={figure.id}
            label={t(figure.label, lang)}
            value={figure.value}
            lang={lang}
            note={t(figure.note, lang)}
            tone={figure.derived ? "good" : "neutral"}
          />
        ))}
      </div>

      <div className="grid grid--two">
        <Card
          title={t({ fa: "وضعیت سامانه", en: "System status" }, lang)}
          subtitle={t({ fa: "هر مقدار از پیکربندی واقعی این نمونه خوانده می‌شود.", en: "Each value is read from this prototype's real configuration." }, lang)}
        >
          <ul className="status-list">
            {data.systemStatus.map((row) => (
              <li key={row.id}>
                <span className="status-list__label">{t(row.label, lang)}</span>
                <Badge tone={TONE_BY_KEY[row.tone] ?? "neutral"}>{t(row.value, lang)}</Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title={t({ fa: "توزیع وضعیت معرفتی ادعاها", en: "Claim epistemic distribution" }, lang)}
          subtitle={t({ fa: "پایهٔ اعتبار هر گزاره، نه تکرار آن.", en: "The basis of each statement's credibility, not its repetition." }, lang)}
        >
          {data.epistemicDistribution.map((row) => (
            <BarRow
              lang={lang}
              key={row.status}
              label={t(EPISTEMIC[row.status] ?? { fa: row.status, en: row.status }, lang)}
              value={row.count}
              max={maxEpistemic}
              tone={EPISTEMIC[row.status]?.tone ?? "info"}
              display={formatNumber(row.count, lang)}
            />
          ))}
        </Card>
      </div>

      <Card
        title={t({ fa: "یکپارچگی بایگانی", en: "Archive integrity" }, lang)}
        subtitle={t(
          { fa: "دروازهٔ ۷۷ ستونی و قاعدهٔ حذف کامل پروندهٔ افراد زنده.", en: "The 77-column gate and the absolute living-person exclusion rule." },
          lang
        )}
      >
        <div className="grid grid--inline">
          <Stat label={t({ fa: "ستون‌های لازم", en: "Required columns" }, lang)} value={data.archiveIntegrity.requiredColumns} lang={lang} />
          <Stat label={t({ fa: "پرونده‌های بارگذاری‌شده", en: "Dossiers loaded" }, lang)} value={data.archiveIntegrity.dossiersLoaded} lang={lang} />
          <Stat
            label={t({ fa: "پروندهٔ فرد زنده", en: "Living-person records" }, lang)}
            value={data.archiveIntegrity.livingPersonRecords}
            lang={lang}
            tone="good"
          />
          <Stat
            label={t({ fa: "پروندهٔ ساختگی", en: "Synthetic dossiers" }, lang)}
            value={data.archiveIntegrity.syntheticDossiers}
            lang={lang}
          />
        </div>
        <Callout tone="warn" title={t({ fa: "وضعیت دروازه", en: "Gate state" }, lang)}>
          <p>{t(data.archiveIntegrity.gateState, lang)}</p>
        </Callout>
      </Card>

      <div className="grid grid--two">
        <Card title={t({ fa: "کنش‌های سریع", en: "Quick actions" }, lang)}>
          <div className="quick-grid">
            {data.quickActions.map((action) => (
              <button
                key={action.id}
                type="button"
                className="quick-btn"
                onClick={() => navigate(action.target)}
              >
                <span>{t(action.label, lang)}</span>
                <span aria-hidden="true" className="quick-btn__arrow">
                  <Icon name="arrowRight" size={14} />
                </span>
              </button>
            ))}
          </div>
        </Card>

        <Card title={t({ fa: "مرزهای صریح این نمونه", en: "Explicit boundaries of this prototype" }, lang)}>
          <ul className="notice-list">
            {data.boundaryNotices.map((notice) => (
              <li key={notice.id}>{t(notice.text, lang)}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card
        title={t({ fa: "آخرین تغییرات ثبت‌شده", en: "Most recent recorded changes" }, lang)}
        subtitle={dict.governanceNote}
        actions={
          <button type="button" className="btn btn--ghost" onClick={() => navigate("accountability")}>
            {t({ fa: "گزارش کامل", en: "Full log" }, lang)}
          </button>
        }
      >
        {data.recentActivity.length === 0 ? (
          <Empty lang={lang} />
        ) : (
          <ol className="timeline">
            {data.recentActivity.map((event) => (
              <li key={event.id}>
                <span className="timeline__dot" aria-hidden="true" />
                <div>
                  <p className="timeline__title">{t(event.changeSummary, lang)}</p>
                  <p className="timeline__meta">
                    {formatDate(event.timestamp, lang)} · {t(event.responsibleProcessOrRole, lang)} · {event.newVersion}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </Card>

      <Disclosure
        summary={t({ fa: "دربارهٔ منشأ و اعتبار این اعداد", en: "About the origin and validity of these figures" }, lang)}
        meta={t({ fa: "شفافیت داده", en: "Data transparency" }, lang)}
      >
        <p>
          {t(
            {
              fa: "هیچ‌یک از اعداد این صفحه از منبع بیرونی، نظرسنجی، پایگاه‌دادهٔ ملی یا آمار دولتی گرفته نشده است. هر عدد یا شمارش مستقیم از فهرست‌های همین نمونه است یا به‌صراحت به‌عنوان نمایشی برچسب خورده است.",
              en: "None of the figures on this page comes from an external source, poll, national database, or government statistic. Each number is either a direct count from this prototype's own lists or explicitly labelled illustrative."
            },
            lang
          )}
        </p>
        <p className="muted">
          {t(
            {
              fa: "هیچ سنجهٔ «پیشرفت تمدنی» یا «اعتبار اجتماعی» در این سامانه تعریف نمی‌شود.",
              en: "No 'civilizational progress' or 'social credit' metric is defined anywhere in this system."
            },
            lang
          )}
        </p>
      </Disclosure>

      <Card title={t({ fa: "دوازده بخش سامانه", en: "The twelve sections" }, lang)}>
        <div className="module-grid">
          {MODULES.map((module) => (
            <button key={module.id} type="button" className="module-tile" onClick={() => navigate(module.id)}>
              <span className="module-tile__glyph" aria-hidden="true">
                <Icon name={module.icon} size={16} />
              </span>
              <span className="module-tile__num">{formatNumber(String(module.number).padStart(2, "0"), lang)}</span>
              <span className="module-tile__title">{t(module.title, lang)}</span>
            </button>
          ))}
        </div>
      </Card>

      <Callout tone="danger" title={dict.demoTitle}>
        <p>{t(data.constitutionalPosture.notice, lang)}</p>
        <p className="muted">
          {t({ fa: "وضعیت معرفتی این صفحه:", en: "Epistemic status of this page:" }, lang)}{" "}
          <EpistemicBadge status="synthetic-fixture" lang={lang} />
        </p>
      </Callout>

      <div className="page-foot">
        <button type="button" className="link-btn" onClick={() => openProvenance({ id: "dashboard-metrics", label: dict.breadcrumbHome, rows: [
          { label: dict.source, value: t({ fa: "فهرست‌های داخلی این نمونه (apps/api/src/data/*)", en: "This prototype's internal lists (apps/api/src/data/*)" }, lang) },
          { label: dict.sourceVersion, value: "schema v1.0.0" },
          { label: dict.section, value: "/api/v1/dashboard" },
          { label: dict.reviewer, value: UI[lang].notRecorded }
        ], epistemicStatus: "synthetic-fixture", confidence: t({ fa: "شمارش مستقیم، نه برآورد", en: "Direct count, not an estimate" }, lang), contradictions: [] })}>
          {dict.inspectProvenance}
        </button>
      </div>
    </>
  );
}
