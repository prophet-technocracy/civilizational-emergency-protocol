#!/usr/bin/env node
// The task backlog, as a command.
//
//   node scripts/agent/tasks.mjs list [--status ready] [--kind code] [--json]
//   node scripts/agent/tasks.mjs show ENG-043
//   node scripts/agent/tasks.mjs issue ENG-043     # a ready-to-paste GitHub issue body
//   node scripts/agent/tasks.mjs stats
//   node scripts/agent/tasks.mjs validate          # run in CI and in `npm run check`
//
// The backlog lives in agent/tasks.json so a machine can read it and a human can
// review it in a diff. `validate` is what keeps the two honest: every path it
// names must exist, every status must be one of five, and every `verify`
// command must actually be runnable in this repository.
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const TASKS_FILE = join(ROOT, "agent/tasks.json");
const PACKAGE_FILE = join(ROOT, "package.json");

export const STATUSES = ["ready", "proposed", "in-progress", "review", "blocked", "complete"];
export const KINDS = ["code", "audit", "docs", "data", "infra"];
export const EFFORTS = ["S", "M", "L"];

const REQUIRED = ["id", "title", "status", "kind", "priority", "issue", "labels", "effort", "paths", "why", "spec", "verify"];

export function loadBacklog(root = ROOT) {
  return JSON.parse(readFileSync(join(root, "agent/tasks.json"), "utf8"));
}

function scripts(root) {
  return Object.keys(JSON.parse(readFileSync(join(root, "package.json"), "utf8")).scripts ?? {});
}

/** Everything wrong with one task, as a list of `id: problem` strings. */
function problemsFor(task, index, knownScripts, root) {
  const problems = [];
  const where = task.id ? task.id : `tasks[${index}]`;
  for (const field of REQUIRED) {
    if (task[field] === undefined || task[field] === null) {
      // `issue: null` is legitimate for an internal task; everything else is not.
      if (field === "issue") continue;
      problems.push(`${where}: missing "${field}"`);
    }
  }
  if (task.id && !/^ENG-\d{3}$/.test(task.id)) problems.push(`${where}: id must look like ENG-043`);
  if (task.status && !STATUSES.includes(task.status)) problems.push(`${where}: status "${task.status}" is not one of ${STATUSES.join(", ")}`);
  if (task.kind && !KINDS.includes(task.kind)) problems.push(`${where}: kind "${task.kind}" is not one of ${KINDS.join(", ")}`);
  if (task.effort && !EFFORTS.includes(task.effort)) problems.push(`${where}: effort "${task.effort}" is not one of ${EFFORTS.join(", ")}`);
  if (task.priority !== undefined && ![1, 2, 3].includes(task.priority)) problems.push(`${where}: priority must be 1, 2 or 3`);
  if (task.issue !== null && task.issue !== undefined && !Number.isInteger(task.issue)) problems.push(`${where}: issue must be an integer or null`);

  for (const path of task.paths ?? []) {
    // A path may be a file or a directory, and may be a directory-plus-slash.
    if (!existsSync(join(root, path.replace(/\/$/, "")))) problems.push(`${where}: path does not exist: ${path}`);
  }

  for (const command of task.verify ?? []) {
    const npmScript = command.match(/^npm (?:run )?([\w:.-]+)$/);
    if (npmScript) {
      if (!knownScripts.includes(npmScript[1])) problems.push(`${where}: verify uses an unknown npm script: ${npmScript[1]}`);
      continue;
    }
    const nodeScript = command.match(/^node ([\w./-]+\.mjs)$/);
    if (nodeScript) {
      if (!existsSync(join(root, nodeScript[1]))) problems.push(`${where}: verify names a missing script: ${nodeScript[1]}`);
      continue;
    }
    problems.push(`${where}: verify command is not in a known form (npm script or node script): ${command}`);
  }

  const spec = task.spec ?? {};
  for (const field of ["input", "output", "acceptance"]) {
    const value = spec[field];
    if (!value) problems.push(`${where}: spec.${field} is missing`);
    else if (field === "acceptance" && (!Array.isArray(value) || value.length === 0)) problems.push(`${where}: spec.acceptance must be a non-empty list`);
  }
  return problems;
}

export function validate(backlog, root = ROOT) {
  const problems = [];
  const tasks = backlog.tasks ?? [];
  if (!Array.isArray(tasks) || tasks.length === 0) problems.push("backlog: no tasks");
  if (backlog.version !== 1) problems.push(`backlog: version must be 1, found ${backlog.version}`);

  const knownScripts = scripts(root);
  const seen = new Map();
  tasks.forEach((task, index) => {
    problems.push(...problemsFor(task, index, knownScripts, root));
    if (task.id) {
      if (seen.has(task.id)) problems.push(`backlog: duplicate id ${task.id}`);
      seen.set(task.id, task);
    }
  });
  return problems;
}

function byStatus(backlog, filter) {
  const tasks = [...backlog.tasks];
  const open = tasks.filter((task) => task.status !== "complete");
  const selected = filter ? tasks.filter((task) => task.status === filter) : open;
  return selected.sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));
}

function pad(value, width) {
  return String(value).padEnd(width);
}

function cmdList(backlog, flags) {
  const rows = byStatus(backlog, flags.status).filter((task) => !flags.kind || task.kind === flags.kind);
  if (flags.json) {
    console.log(JSON.stringify(rows, null, 2));
    return 0;
  }
  if (rows.length === 0) {
    console.log("No tasks match. Try: node scripts/agent/tasks.mjs list");
    return 0;
  }
  console.log(`${pad("ID", 9)}${pad("P", 3)}${pad("STATUS", 13)}${pad("KIND", 7)}${pad("EFFORT", 8)}${pad("ISSUE", 7)}TITLE`);
  for (const task of rows) {
    console.log(
      `${pad(task.id, 9)}${pad(task.priority, 3)}${pad(task.status, 13)}${pad(task.kind, 7)}${pad(task.effort, 8)}${pad(task.issue ? `#${task.issue}` : "-", 7)}${task.title}`
    );
  }
  console.log(`\n${rows.length} task(s). Claim one: node scripts/agent/tasks.mjs show <id>`);
  return 0;
}

function cmdShow(backlog, id, flags) {
  const task = backlog.tasks.find((entry) => entry.id === id);
  if (!task) {
    console.error(`No task ${id}. Run: node scripts/agent/tasks.mjs list`);
    return 2;
  }
  if (flags.json) {
    console.log(JSON.stringify(task, null, 2));
    return 0;
  }
  const lines = [
    `${task.id} — ${task.title}`,
    `status: ${task.status} · priority ${task.priority} · kind ${task.kind} · effort ${task.effort}${task.issue ? ` · issue #${task.issue}` : ""}`,
    "",
    `WHY`,
    `  ${task.why}`,
    "",
    `PATHS`,
    ...task.paths.map((path) => `  ${path}`),
    "",
    `INPUT`,
    `  ${task.spec.input}`,
    "",
    `OUTPUT`,
    `  ${task.spec.output}`,
    "",
    `ACCEPTANCE`,
    ...task.spec.acceptance.map((item) => `  - ${item}`),
    "",
    `VERIFY`,
    ...task.verify.map((command) => `  $ ${command}`),
    "",
    `NOTES`,
    `  ${task.notes ?? "—"}`
  ];
  console.log(lines.join("\n"));
  return 0;
}

function cmdIssue(backlog, id) {
  const task = backlog.tasks.find((entry) => entry.id === id);
  if (!task) {
    console.error(`No task ${id}.`);
    return 2;
  }
  const body = [
    `## Why`,
    task.why,
    "",
    `## Scope (input → output)`,
    `**Input:** ${task.spec.input}`,
    "",
    `**Output:** ${task.spec.output}`,
    "",
    `## Files`,
    ...task.paths.map((path) => `- \`${path}\``),
    "",
    `## Acceptance criteria`,
    ...task.spec.acceptance.map((item) => `- [ ] ${item}`),
    "",
    `## How to prove it`,
    "```sh",
    ...task.verify,
    "```",
    "",
    `## Notes`,
    task.notes ?? "—",
    "",
    `---`,
    `Task \`${task.id}\` from [\`agent/tasks.json\`](../blob/main/agent/tasks.json). Effort **${task.effort}**, priority **${task.priority}**, kind **${task.kind}**.`,
    `Read [AGENT.md](../blob/main/AGENT.md) before starting, and \`node scripts/agent/run.mjs\` before opening a PR.`,
    `This issue is a proposal for engineering work; it confers no authority and makes no claim about the project's legitimacy.`
  ].join("\n");
  console.log(`Title: ${task.id}: ${task.title}\n`);
  console.log(body);
  return 0;
}

function cmdStats(backlog, flags) {
  const tasks = backlog.tasks;
  const count = (predicate) => tasks.filter(predicate).length;
  const summary = {
    total: tasks.length,
    byStatus: Object.fromEntries(STATUSES.map((status) => [status, count((task) => task.status === status)])),
    byKind: Object.fromEntries(KINDS.map((kind) => [kind, count((task) => task.kind === kind)])),
    byEffort: Object.fromEntries(EFFORTS.map((effort) => [effort, count((task) => task.effort === effort)])),
    claimable: count((task) => task.status === "ready" && task.priority <= 2),
    withIssue: count((task) => Number.isInteger(task.issue))
  };
  if (flags.json) {
    console.log(JSON.stringify(summary, null, 2));
    return 0;
  }
  console.log(`tasks: ${summary.total} · claimable (ready, P1-P2): ${summary.claimable} · linked to an issue: ${summary.withIssue}`);
  console.log(`by status: ${Object.entries(summary.byStatus).map(([key, value]) => `${key} ${value}`).join(" · ")}`);
  console.log(`by kind:   ${Object.entries(summary.byKind).map(([key, value]) => `${key} ${value}`).join(" · ")}`);
  console.log(`by effort: ${Object.entries(summary.byEffort).map(([key, value]) => `${key} ${value}`).join(" · ")}`);
  return 0;
}

function cmdValidate(backlog) {
  const problems = validate(backlog);
  if (problems.length === 0) {
    console.log(`ok  ${backlog.tasks.length} tasks in agent/tasks.json: ids unique, paths exist, verify commands resolvable`);
    return 0;
  }
  console.error(`agent/tasks.json: ${problems.length} problem(s)`);
  for (const problem of problems) console.error(`  - ${problem}`);
  return 1;
}

function main(argv) {
  const [command = "list", ...rest] = argv;
  const flags = {};
  const positional = [];
  for (const argument of rest) {
    if (argument.startsWith("--")) {
      const [key, value] = argument.slice(2).split("=");
      flags[key] = value ?? true;
    } else positional.push(argument);
  }
  const backlog = loadBacklog();
  switch (command) {
    case "list":
      return cmdList(backlog, flags);
    case "show":
      return cmdShow(backlog, positional[0], flags);
    case "issue":
      return cmdIssue(backlog, positional[0]);
    case "stats":
      return cmdStats(backlog, flags);
    case "validate":
      return cmdValidate(backlog);
    case "help":
    case "--help":
      console.log(readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").slice(1, 12).join("\n").replace(/^\/\/ ?/gm, ""));
      return 0;
    default:
      console.error(`Unknown command "${command}". Use: list | show <id> | issue <id> | stats | validate`);
      return 2;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}

export { main, statSync, PACKAGE_FILE, TASKS_FILE };
