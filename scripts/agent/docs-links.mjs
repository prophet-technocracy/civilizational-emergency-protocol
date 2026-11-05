#!/usr/bin/env node
// Link integrity for the documents an agent is expected to trust.
//
//   node scripts/agent/docs-links.mjs [--quiet]
//
// A dead relative link in AGENT.md or llms.txt costs a visiting agent a whole
// turn, and it is the one documentation failure that is mechanically checkable.
// This checks: every relative markdown link, every `path` mentioned inside
// backticks in llms.txt, and every root-level file those documents promise.
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

/** Documents whose links a reader is expected to follow. */
const DOCS = [
  "README.md",
  "AGENT.md",
  "AGENTS.md",
  "llms.txt",
  "TASKS.md",
  ".github/CONTRIBUTING.md",
  ".github/PULL_REQUEST_TEMPLATE.md",
  "docs/ux/AGENT-UX-CHECKLIST.md",
  "scripts/audit/README.md"
];

const LINK = /(!?)\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
// A path in backticks that looks like a file in this repository.
const CODE_PATH = /`((?:apps|packages|scripts|docs|agent|tasks|data|schemas|\.github)\/[A-Za-z0-9._/-]+|(?:AGENT|AGENTS|TASKS|README|CONTRIBUTING|LICENSE)\.md)`/g;

function isExternal(target) {
  return /^(?:https?:|mailto:|tel:|#)/.test(target);
}

function checkTarget(fromFile, target) {
  const clean = target.split("#")[0];
  if (!clean) return null;
  // `../../issues` is a GitHub web-relative link: it resolves on github.com, not
  // on disk, so there is nothing here to check.
  if (clean.startsWith("../")) return null;
  if (isExternal(clean)) return null;
  const resolved = clean.startsWith("/") ? join(ROOT, clean) : resolve(dirname(fromFile), clean);
  return existsSync(resolved) ? null : target;
}

function main() {
  const problems = [];
  let checked = 0;
  for (const relative of DOCS) {
    const file = join(ROOT, relative);
    if (!existsSync(file)) {
      problems.push(`${relative}: document is missing (it is listed in scripts/agent/docs-links.mjs)`);
      continue;
    }
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(LINK)) {
      const target = match[2];
      checked += 1;
      const missing = checkTarget(file, target);
      if (missing) problems.push(`${relative}: link target does not exist: ${missing}`);
    }
    for (const match of text.matchAll(CODE_PATH)) {
      const target = match[1];
      checked += 1;
      if (!existsSync(join(ROOT, target))) problems.push(`${relative}: backticked path does not exist: ${target}`);
    }
  }

  // The three commands the front door promises an agent can run.
  const promised = ["scripts/agent/run.mjs", "scripts/agent/tasks.mjs", "agent/tasks.json"];
  for (const relative of promised) {
    if (!existsSync(join(ROOT, relative))) problems.push(`front door promises ${relative}, which does not exist`);
    else if (statSync(join(ROOT, relative)).isDirectory()) problems.push(`${relative} is a directory, not a file`);
  }

  if (problems.length > 0) {
    console.error(`docs: ${problems.length} broken reference(s) in ${DOCS.length} documents`);
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exitCode = 1;
    return;
  }
  console.log(`ok  ${checked} references in ${DOCS.length} documents resolve`);
}

main();
