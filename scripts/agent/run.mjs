#!/usr/bin/env node
// The self-check an agent runs before it opens a pull request, and the same
// thing CI runs (see .github/workflows/ci.yml). One entry point, one verdict.
//
//   node scripts/agent/run.mjs              # fast: lint, backlog, docs, tests, guardrails
//   node scripts/agent/run.mjs --full       # + CSV validation, build, generated-doc drift
//   node scripts/agent/run.mjs --browser    # + axe / keyboard / layout against a dev server
//   node scripts/agent/run.mjs --only lint,test
//   node scripts/agent/run.mjs --json       # machine-readable; exit code still means something
//
// Exit codes: 0 all good, 1 something failed, 2 bad usage. A skipped step is not
// a failure: the browser checks are skipped, loudly, when nothing is listening.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { connect } from "node:net";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const PREVIEW = process.env.CEP_PREVIEW ?? "http://127.0.0.1:5173";

const npm = (script) => ({ command: process.platform === "win32" ? "npm.cmd" : "npm", args: ["run", script], shell: process.platform === "win32" });
const node = (script) => ({ command: process.execPath, args: [script] });

/** @type {Array<{name: string, group: 'fast'|'full'|'browser', run: () => object, hint: string}>} */
const STEPS = [
  {
    name: "lint",
    group: "fast",
    run: () => ({ command: process.platform === "win32" ? "npx.cmd" : "npx", args: ["eslint", "."] }),
    hint: "Fix the reported rule violations. `npm run lint:fix` handles the mechanical ones; do not disable a rule to pass."
  },
  {
    name: "backlog",
    group: "fast",
    run: () => node("scripts/agent/tasks.mjs"),
    args: ["validate"],
    hint: "agent/tasks.json is the contract. A missing path or an unrunnable verify command means the task is not executable."
  },
  {
    name: "docs",
    group: "fast",
    run: () => node("scripts/agent/docs-links.mjs"),
    hint: "A front-door document points at something that is not there. Fix the link or restore the file."
  },
  {
    name: "test",
    group: "fast",
    run: () => npm("test"),
    hint: "A test failed. Read the assertion message: every test in this repository states its rule in words."
  },
  {
    name: "guardrails",
    group: "fast",
    run: () => npm("audit:guardrails"),
    hint: "A claim in the payload stopped matching its guardrail. Never weaken the guardrail to pass; fix the claim."
  },
  {
    name: "csv",
    group: "full",
    run: () => npm("validate:csv"),
    hint: "The synthetic archive fixture no longer matches its schema."
  },
  {
    name: "build",
    group: "full",
    run: () => npm("build"),
    hint: "The bundle does not build. Run it directly for the full Vite output."
  },
  {
    name: "drift",
    group: "full",
    run: () => ({ command: process.execPath, args: ["scripts/docs/generate-principles-coverage.mjs"] }),
    after: () => {
      // The generated document may not differ from the committed one.
      const diff = spawnSync("git", ["status", "--porcelain", "--", "docs/principles/PRINCIPLES-COVERAGE.md"], { cwd: ROOT, encoding: "utf8" });
      if (!diff.stdout.trim()) return null;
      spawnSync("git", ["checkout", "--", "docs/principles/PRINCIPLES-COVERAGE.md"], { cwd: ROOT });
      return "docs/principles/PRINCIPLES-COVERAGE.md is out of date; run `npm run docs:principles` and commit the result (the file has been restored for you).";
    },
    hint: "Generated docs must be committed, not produced at review time."
  },
  ...[
    ["a11y", "axe-core over every route in both languages"],
    ["keyboard", "tab order, focus visibility and the skip link"],
    ["layout", "horizontal overflow and control sizes at four widths"]
  ].map(([script, what]) => ({
    name: script,
    group: "browser",
    run: () => node(`scripts/audit/${script}.mjs`),
    needsServer: true,
    hint: `The ${what} check failed. Reproduce with: node scripts/audit/${script}.mjs (see scripts/audit/README.md for the browser dependency).`
  }))
];

function parseArgs(argv) {
  const flags = { full: false, browser: false, json: false, quiet: false, only: null, list: false };
  for (const argument of argv) {
    if (argument === "--full") flags.full = true;
    else if (argument === "--browser") flags.browser = true;
    else if (argument === "--json") flags.json = true;
    else if (argument === "--quiet") flags.quiet = true;
    else if (argument === "--list") flags.list = true;
    else if (argument.startsWith("--only=")) flags.only = argument.slice("--only=".length).split(",").map((s) => s.trim()).filter(Boolean);
    else if (argument === "--help" || argument === "-h") flags.help = true;
    else flags.unknown = argument;
  }
  return flags;
}

/**
 * A raw TCP connect, not fetch: an HTTP_PROXY in the environment would happily
 * answer a request for a port nothing is listening on, and a skipped browser
 * check must not be reported as a failed one (or the reverse).
 */
function serverUp(url = PREVIEW) {
  const { hostname, port } = new URL(url);
  return new Promise((done) => {
    const socket = connect({ host: hostname, port: Number(port) || 80 });
    const finish = (value) => { socket.destroy(); done(value); };
    socket.setTimeout(1500, () => finish(false));
    socket.once("connect", () => finish(true));
    socket.once("error", () => finish(false));
  });
};

/** The browser checks need three packages that are deliberately not installed by default. */
function browserReady() {
  return ["puppeteer-core", "axe-core"].every((name) => existsSync(join(ROOT, "node_modules", name)));
}

async function runStep(step) {
  if (step.needsServer) {
    if (!browserReady()) {
      return { status: "skip", ms: 0, output: "", reason: "browser dependency missing: run `npm run audit:setup` (see scripts/audit/README.md)" };
    }
    if (!(await serverUp())) {
      return { status: "skip", ms: 0, output: "", reason: `nothing is listening on ${PREVIEW}; start it with npm run dev` };
    }
  }
  const command = step.run();
  const started = Date.now();
  const result = spawnSync(command.command, [...(command.args ?? []), ...(step.args ?? [])], {
    cwd: ROOT,
    encoding: "utf8",
    timeout: 15 * 60 * 1000,
    env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" }
  });
  const ms = Date.now() - started;
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
  if (result.error) return { status: "fail", ms, output: output || result.error.message, reason: result.error.message };
  if (result.status !== 0) return { status: "fail", ms, output };
  const warning = step.after?.();
  if (warning) return { status: "fail", ms, output: output || warning, reason: warning };
  return { status: "pass", ms, output };
}

const SYMBOL = { pass: "PASS", fail: "FAIL", skip: "SKIP", running: "...." };

async function main() {
  const flags = parseArgs(process.argv.slice(2));
  if (flags.help || flags.unknown) {
    if (flags.unknown) console.error(`Unknown argument: ${flags.unknown}`);
    console.log(`Usage: node scripts/agent/run.mjs [--full] [--browser] [--json] [--quiet] [--only=a,b] [--list]`);
    return flags.unknown ? 2 : 0;
  }
  if (flags.list) {
    for (const step of STEPS) console.log(`${step.group.padEnd(8)}${step.name}${step.needsServer ? "   (needs a dev server)" : ""}`);
    return 0;
  }

  const selected = STEPS.filter((step) => {
    if (flags.only) return flags.only.includes(step.name);
    if (step.group === "fast") return true;
    if (step.group === "full") return flags.full;
    return flags.browser;
  });

  const results = [];
  for (const step of selected) {
    if (!flags.json && !flags.quiet) process.stderr.write(`  ${SYMBOL.running} ${step.name} …\r`);
    const result = await runStep(step);
    results.push({ step, ...result });
    if (!flags.json && !flags.quiet) {
      process.stderr.write(`  ${SYMBOL[result.status]} ${step.name.padEnd(12)}${String(result.ms).padStart(6)} ms${result.reason ? `  ${result.reason}` : ""}\n`);
    }
    if (result.status === "fail" && !flags.json) {
      const tail = result.output.split("\n").slice(-25).join("\n");
      if (tail) process.stderr.write(`${tail.replace(/^/gm, "      | ")}\n`);
      process.stderr.write(`      → ${step.hint}\n\n`);
    }
  }

  const failed = results.filter((result) => result.status === "fail");
  const skipped = results.filter((result) => result.status === "skip");
  const ok = failed.length === 0;

  if (flags.json) {
    console.log(JSON.stringify({
      ok,
      steps: results.map(({ step, status, ms, reason }) => ({ name: step.name, group: step.group, status, ms, reason: reason ?? null }))
    }, null, 2));
  } else if (!flags.quiet) {
    console.log("");
    console.log(ok
      ? `ok  ${results.length - skipped.length}/${results.length} checks passed${skipped.length ? `, ${skipped.length} skipped` : ""} — this is what CI will say.`
      : `${failed.length} check(s) failed: ${failed.map((result) => result.step.name).join(", ")}`);
    if (ok && !flags.browser) console.log("Next: --full before a PR that touches data or the build, --browser for anything visible.");
  }

  return ok ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  // `node --test` in this repository is synchronous; a top-level await is fine here.
  main().then((code) => { process.exitCode = code; });
}

export { STEPS, parseArgs };
