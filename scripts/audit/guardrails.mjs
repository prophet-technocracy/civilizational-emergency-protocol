// Guardrails: the handful of claims that must never regress quietly.
//
// This is not a style check and not a test suite — those live next to the code.
// It is the short list of sentences the project would be lying if it printed:
// "this is a government", "this election was held", "this charter is ratified",
// "this covenant is live". They are checked against the API payloads and the
// interface copy, so a well-meaning edit to a locale file fails the build
// instead of shipping.
//
// Run: node scripts/audit/guardrails.mjs   (also wired into CI)

import { createServer } from "../../apps/api/src/server.mjs";
import { LOCALES } from "../../apps/web/src/locales/index.js";
import { UI } from "../../apps/web/src/i18n.js";

const failures = [];
const notes = [];

const fail = (scope, message) => failures.push(`${scope}: ${message}`);
const note = (message) => notes.push(message);

/* ------------------------------ the payloads ------------------------------ */

const server = createServer();
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const get = async (path) => {
  const response = await fetch(`${base}${path}`);
  if (!response.ok) throw new Error(`${path} answered ${response.status}`);
  return (await response.json()).data;
};

try {
  const governance = await get("/api/v1/governance");
  const posture = governance.constitutionalPosture ?? {};
  if (posture.isGovernment !== false) fail("governance", "isGovernment must be false");
  if (posture.isElectionAuthority !== false) fail("governance", "isElectionAuthority must be false");
  if (posture.hasPublicMandate !== false) fail("governance", "hasPublicMandate must be false");
  if (posture.ratificationStatus !== "none-recorded") fail("governance", "ratificationStatus must be none-recorded");
  if (!posture.notice?.fa || !posture.notice?.en) fail("governance", "the draft notice must exist in both locales");

  const referendum = await get("/api/v1/referendum");
  const rp = referendum.posture ?? {};
  for (const flag of ["isElectionAuthority", "isGovernment", "holdsVoterRoll", "recordsRealBallots"]) {
    if (rp[flag] !== false) fail("referendum", `${flag} must be false`);
  }
  if (referendum.rehearsals?.some((row) => row.synthetic !== true)) {
    fail("referendum", "every rehearsal must be marked synthetic");
  }
  if (referendum.summary?.accepted === referendum.rehearsals?.length) {
    fail("referendum", "an instrument whose every rehearsal passes is not an instrument");
  }

  const programme = await get("/api/v1/programme");
  for (const project of programme.projects ?? []) {
    if (project.principle?.coverage !== "partial") fail(project.id, "targets a principle that is not partial");
    if (project.contractor?.level !== 4) fail(project.id, "contractor is not level 4");
    if (project.contractor?.contract !== "mudarabah") fail(project.id, "contract is not mudarabah");
    if (project.cap?.allowed !== true) fail(project.id, "budget exceeds the level-4 cap");
    if (project.blockedBy?.length) fail(project.id, `is blocked by ${project.blockedBy.join(", ")}`);
    if (["funded", "in-execution", "delivered"].includes(project.state) && project.ballot?.result !== "passed") {
      fail(project.id, "money moved before a passed ballot");
    }
  }
  if (programme.summary?.uncoveredByProgramme <= 0) {
    fail("programme", "the queue must admit principles it does not cover");
  }

  const principles = await get("/api/v1/principles");
  if (principles.lights?.band?.id === "live") fail("principles", "the covenant claims the Live band");
  if (principles.lights?.readiness >= 1) fail("principles", "readiness is 1.0 — nothing here is finished");
  const lightSum = Object.values(principles.lights?.counts ?? {}).reduce((sum, value) => sum + value, 0);
  if (lightSum !== principles.principles.length) fail("principles", "light counts do not add up to the principle count");
  if (principles.principles.some((row) => row.coverage === "covered" && !row.surface)) {
    fail("principles", "a covered principle has no surface");
  }

  const demo = await (await fetch(`${base}/api/v1/demo`)).json();
  if (demo.mode !== "synthetic-demo") fail("demo", "the demo endpoint must declare itself synthetic");
  note(`payloads checked: governance, referendum, programme (${programme.projects.length}), principles (${principles.principles.length}), demo`);
} finally {
  await new Promise((resolve) => server.close(resolve));
}

/* -------------------------------- the copy -------------------------------- */

// Deliberately narrow: phrases that would be a lie if present, not phrases that
// merely sound confident. Each one names a claim the project cannot make.
const FORBIDDEN = [
  { fa: "دولت رسمی ایران", because: "CEP is not a government" },
  { fa: "مرجع رسمی انتخابات", because: "CEP is not an electoral authority" },
  { fa: "همه‌پرسی برگزار شد", because: "no referendum has been held" },
  { fa: "تصویب شده است", because: "no ratification is recorded" },
  { fa: "قانون اساسی تصویب‌شده", because: "no constitution has been ratified here" },
  { en: "official government of iran", because: "CEP is not a government" },
  { en: "official election authority", because: "CEP is not an electoral authority" },
  { en: "the referendum was held", because: "no referendum has been held" },
  { en: "has been ratified", because: "no ratification is recorded" }
];

function walk(value, path, visit) {
  if (typeof value === "string") return visit(value, path);
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) walk(child, `${path}.${key}`, visit);
  }
}

let stringsScanned = 0;
for (const [lang, table] of Object.entries(LOCALES)) {
  walk(table, `locales.${lang}`, (text, path) => {
    stringsScanned += 1;
    const haystack = text.toLowerCase();
    for (const rule of FORBIDDEN) {
      const needle = (rule.fa ?? rule.en).toLowerCase();
      if (haystack.includes(needle)) {
        fail(path, `contains a forbidden claim («${needle}»): ${rule.because}`);
      }
    }
  });
}
for (const lang of Object.keys(UI)) {
  walk(UI[lang], `ui.${lang}`, (text, path) => {
    stringsScanned += 1;
    const haystack = text.toLowerCase();
    for (const rule of FORBIDDEN) {
      const needle = (rule.fa ?? rule.en).toLowerCase();
      if (haystack.includes(needle)) {
        fail(path, `contains a forbidden claim («${needle}»): ${rule.because}`);
      }
    }
  });
}
note(`copy scanned: ${stringsScanned} strings across ${Object.keys(LOCALES).length} locales and the shared dictionary`);

/* -------------------------------- the report ------------------------------- */

for (const line of notes) console.log(`ok  ${line}`);
if (failures.length) {
  for (const line of failures) console.error(`FAIL ${line}`);
  console.error(`\n${failures.length} guardrail failure(s). These are claims, not style points.`);
  process.exit(1);
}
console.log("\nAll guardrails hold: no government, no election authority, no ratification, no Live claim.");
