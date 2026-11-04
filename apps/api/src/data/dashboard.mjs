// Module 01 — Civilization Dashboard data.
// All figures derive from the fixtures actually loaded by this API, or are
// explicitly labelled illustrative. Nothing here is a metric of real-world progress.

import { evidenceClaims, sourceDocuments, unresolvedQuestions } from "./evidence.mjs";
import { archiveDossiers } from "./archive.mjs";
import { institutions, transitionStages, publicServices } from "./iran.mjs";
import { accountabilityRecords, publicGoodProjects, constitutionalPrinciples } from "./governance.mjs";
import { accessPolicies, verificationBands } from "./assurance.mjs";
import { HISTORICAL_DOSSIER_77_HEADERS } from "@cep/schemas";

export const moduleRegistry = Object.freeze([
  { id: "dashboard", number: 1, route: "dashboard", title: { fa: "پیشخوان تمدنی", en: "Civilization Dashboard" }, department: "DEPT-G", api: "/api/v1/dashboard" },
  { id: "governance", number: 2, route: "governance", title: { fa: "حکمرانی و منشور", en: "Governance & Constitution" }, department: "DEPT-B", api: "/api/v1/governance" },
  { id: "transition", number: 3, route: "transition", title: { fa: "معماری گذار ایران", en: "Iran Transition Architecture" }, department: "DEPT-C", api: "/api/v1/transition" },
  { id: "institutions", number: 4, route: "institutions", title: { fa: "کارپوشهٔ نهادها", en: "Institutional Directory" }, department: "DEPT-C", api: "/api/v1/institutions" },
  { id: "historical-archive", number: 5, route: "historical-archive", title: { fa: "بایگانی تاریخی", en: "Historical Archive" }, department: "DEPT-D", api: "/api/v1/archive" },
  { id: "research", number: 6, route: "research", title: { fa: "کتابخانهٔ پژوهش و شواهد", en: "Research & Evidence Library" }, department: "DEPT-F", api: "/api/v1/sources" },
  { id: "verification", number: 7, route: "verification", title: { fa: "تضمین دسترسی پنج‌سطحی", en: "Five-Band Assurance" }, department: "DEPT-E", api: "/api/v1/verification" },
  { id: "accountability", number: 8, route: "accountability", title: { fa: "پاسخگویی و شفافیت", en: "Accountability & Transparency" }, department: "DEPT-H", api: "/api/v1/accountability" },
  { id: "public-services", number: 9, route: "public-services", title: { fa: "راهنمای خدمات عمومی", en: "Public Service Directory" }, department: "DEPT-C", api: "/api/v1/public-services" },
  { id: "projects", number: 10, route: "projects", title: { fa: "پروژه‌های نفع عمومی", en: "Public-Good Projects" }, department: "DEPT-B", api: "/api/v1/projects" },
  { id: "simulations", number: 11, route: "simulations", title: { fa: "آزمایشگاه طراحی نهادی", en: "Institutional Design Lab" }, department: "DEPT-B", api: "/api/v1/simulations" },
  { id: "digital-legacy", number: 12, route: "digital-legacy", title: { fa: "میراث دیجیتال و اصل ۲۰", en: "Digital Legacy & Principle 20" }, department: "DEPT-B", api: "/api/v1/digital-legacy" }
]);

function countBy(items, selector) {
  const out = {};
  for (const item of items) {
    const key = selector(item);
    out[key] = (out[key] || 0) + 1;
  }
  return out;
}

export function buildDashboard() {
  const epistemicDistribution = countBy(evidenceClaims, (claim) => claim.verificationStatus);

  const figures = [
    {
      id: "fig-sources",
      label: { fa: "اسناد منبع ثبت‌شده", en: "Registered source documents" },
      value: sourceDocuments.length,
      derived: true,
      note: { fa: "شمارش واقعی از فهرست منابع این نمونه.", en: "Actual count from this prototype's source list." }
    },
    {
      id: "fig-claims",
      label: { fa: "ادعاهای دارای زنجیرهٔ منشأ", en: "Claims with provenance chains" },
      value: evidenceClaims.length,
      derived: true,
      note: { fa: "هر ادعا به سند، نسخه، بخش و وضعیت بازبینی متصل است.", en: "Each claim links to a document, version, section, and review status." }
    },
    {
      id: "fig-dossiers",
      label: { fa: "پروندهٔ ساختگی بایگانی", en: "Synthetic archive dossiers" },
      value: archiveDossiers.length,
      derived: true,
      note: { fa: "همهٔ پرونده‌ها ساختگی‌اند؛ صفر پروندهٔ فرد زنده.", en: "All dossiers are synthetic; zero living-person records." }
    },
    {
      id: "fig-institutions",
      label: { fa: "نهاد پیشنهادی", en: "Proposed institutions" },
      value: institutions.length,
      derived: true,
      note: { fa: "هیچ‌یک از این نهادها وجود خارجی یا اختیار قانونی ندارد.", en: "None of these institutions has real existence or legal authority." }
    },
    {
      id: "fig-stages",
      label: { fa: "مرحلهٔ گذار طراحی‌شده", en: "Designed transition stages" },
      value: transitionStages.length,
      derived: true,
      note: { fa: "همه در وضعیت پیشنهادی/فرضی؛ هیچ مرحله‌ای اجرا نشده است.", en: "All are proposed/hypothetical; no stage has been executed." }
    },
    {
      id: "fig-policies",
      label: { fa: "سیاست دسترسی ارزیابی‌شده", en: "Evaluated access policies" },
      value: accessPolicies.length,
      derived: true,
      note: { fa: "شامل سیاست‌های ممنوعِ آزمون مرز قانونی.", en: "Includes prohibited policies that test the constitutional boundary." }
    },
    {
      id: "fig-open-questions",
      label: { fa: "پرسش بی‌پاسخ باز", en: "Open unresolved questions" },
      value: unresolvedQuestions.filter((q) => q.status !== "partially-answered").length,
      derived: true,
      note: { fa: "فهرست کامل در ماژول ۶.", en: "Full list in Module 6." }
    },
    {
      id: "fig-projects",
      label: { fa: "پروژهٔ نفع عمومی", en: "Public-good projects" },
      value: publicGoodProjects.length,
      derived: true,
      note: { fa: "هیچ پروژه‌ای حق حکمرانی نمی‌دهد.", en: "No project grants governance rights." }
    }
  ];

  const systemStatus = [
    {
      id: "st-mode",
      label: { fa: "حالت اجرا", en: "Runtime mode" },
      value: { fa: "نمایشی محلی · فقط خواندنی", en: "Local synthetic · read-only" },
      tone: "neutral"
    },
    {
      id: "st-living",
      label: { fa: "پروندهٔ فرد زنده", en: "Living-person records" },
      value: { fa: "۰ — ممنوع و مسدود", en: "0 — prohibited and blocked" },
      tone: "good"
    },
    {
      id: "st-ratification",
      label: { fa: "تصویب عمومی", en: "Public ratification" },
      value: { fa: "ثبت نشده", en: "None recorded" },
      tone: "warning"
    },
    {
      id: "st-authority",
      label: { fa: "قدرت اجرایی یا انتخاباتی", en: "Executive or electoral authority" },
      value: { fa: "ندارد", en: "None" },
      tone: "warning"
    },
    {
      id: "st-deployment",
      label: { fa: "استقرار عمومی", en: "Public deployment" },
      value: { fa: "مسدود تا دروازه‌های انسانی", en: "Gated pending human review" },
      tone: "warning"
    },
    {
      id: "st-telemetry",
      label: { fa: "ردیابی بازدیدکننده", en: "Visitor tracking" },
      value: { fa: "صفر (بدون کوکی و بدون لاگ)", en: "Zero (no cookies, no logs)" },
      tone: "good"
    }
  ];

  const evidenceTone = {
    "source-verified": "good",
    "source-reported": "neutral",
    proposed: "neutral",
    hypothetical: "warning",
    disputed: "warning",
    unverified: "warning",
    "synthetic-fixture": "neutral"
  };

  return {
    modules: moduleRegistry,
    figures,
    systemStatus,
    epistemicDistribution: Object.entries(epistemicDistribution)
      .map(([status, count]) => ({ status, count, tone: evidenceTone[status] ?? "neutral" }))
      .sort((a, b) => b.count - a.count),
    archiveIntegrity: {
      requiredColumns: HISTORICAL_DOSSIER_77_HEADERS.length,
      dossiersLoaded: archiveDossiers.length,
      livingPersonRecords: 0,
      syntheticDossiers: archiveDossiers.filter((d) => d.epistemicStatus === "synthetic-fixture").length,
      rejectedRowsInGate: 0,
      gateState: { fa: "باز برای داده‌های ساختگی؛ بسته برای داده‌های واقعی", en: "Open for synthetic data; closed for real data" }
    },
    constitutionalPosture: {
      isGovernment: false,
      isElectionAuthority: false,
      hasPublicMandate: false,
      hasOperationalProgress: false,
      principlesCount: constitutionalPrinciples.length,
      notice: {
        fa: "این سامانه یک نمونهٔ مهندسی است. نه دولتی است، نه مرجع انتخابات، نه نهاد نمایندگی و نه دارای قیمومیت عمومی.",
        en: "This system is an engineering prototype. It is not a government, election authority, representative body, or holder of a public mandate."
      }
    },
    recentActivity: accountabilityRecords.auditEvents.slice(-5).reverse(),
    quickActions: [
      { id: "qa-1", label: { fa: "بررسی زنجیرهٔ منشأ یک ادعا", en: "Inspect a claim's provenance chain" }, target: "research", action: "open-source" },
      { id: "qa-2", label: { fa: "جستجوی پروندهٔ ساختگی", en: "Search a synthetic dossier" }, target: "historical-archive", action: "focus-search" },
      { id: "qa-3", label: { fa: "آزمودن مجوز یک کنش", en: "Simulate an action authorization" }, target: "verification", action: "focus-simulator" },
      { id: "qa-4", label: { fa: "مقایسهٔ دو مدل نهادی", en: "Compare two institutional models" }, target: "simulations", action: "open-lab" }
    ],
    boundaryNotices: [
      { id: "bn-1", text: { fa: "هیچ آمار پیشرفت واقعی در این سامانه وجود ندارد؛ همهٔ اعداد از فهرست‌های همین نمونه مشتق شده‌اند.", en: "No real-world progress statistic exists here; every number is derived from this prototype's own lists." } },
      { id: "bn-2", text: { fa: "پیوندهای خدمات عمومی تأییدنشده‌اند و هیچ یکپارچگی فنی وجود ندارد.", en: "Public-service links are unverified and there is no technical integration." } },
      { id: "bn-3", text: { fa: "ترکیب آرا، نظرسنجی یا حمایت مردمی در هیچ بخشی ساخته نمی‌شود.", en: "No vote tally, poll, or public endorsement is manufactured anywhere." } },
      { id: "bn-4", text: { fa: "پرونده‌های بایگانی ساختگی‌اند و هیچ شخص واقعی را توصیف نمی‌کنند.", en: "Archive dossiers are synthetic and describe no real person." } }
    ],
    servicesCount: publicServices.length,
    bandsCount: verificationBands.length,
    suggestions: [
      { id: "sg-1", label: { fa: "نهادهای پیشنهادی با اختیارات محدود", en: "Proposed institutions with bounded mandates" }, module: "institutions" },
      { id: "sg-2", label: { fa: "چهار مدل نهادی قابل مقایسه", en: "Four comparable institutional models" }, module: "simulations" },
      { id: "sg-3", label: { fa: "بایگانی فاقد دادهٔ افراد زنده", en: "Archive free of living-person data" }, module: "historical-archive" }
    ]
  };
}
