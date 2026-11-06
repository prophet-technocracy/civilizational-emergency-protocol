// The rate the interface calculates with, and the four things that can be true
// about it.
//
// The maintainer's instruction: the toman/dollar rate is one of the most
// volatile prices in the world, so the app must read a live source and every
// calculation that depends on the rate must use the same number the screen
// prints. The source is navasan.tech's public widget payload.
//
// Four statuses, and only four:
//
//   fresh     read from the source within the TTL
//   stale     last good read, older than the TTL, source currently unreachable
//   suspect   the source answered with a number that failed a sanity gate, so it
//             was rejected and the last good rate is still in force
//   reference the committed reference from HMMT-FACT-CHECK.md (SRC-FX),
//             2026-10-29. The floor, not a live claim.
//
// Two design rules matter more than the code:
//
// 1. **Live reading is opt-in.** Without CEP_FX_LIVE=1 nothing is fetched, so
//    tests, CI and the guardrails script never touch the network and never
//    publish a number that came from the internet once. The default is the
//    committed reference, labelled as such.
// 2. **A rejected rate never reaches a calculation.** If a reading jumps more
//    than JUMP_LIMIT from the last accepted value it is recorded as suspect and
//    not adopted. A manipulated or mis-parsed feed must not silently re-price a
//    ceiling, and a project with no legal existence has no business being a soft
//    target for that.

import { parseNavasanWidget } from "./navasan.mjs";

export const NAVASAN_WIDGET_URL = "https://www.navasan.tech/wp-navasan.php?usd&usd_shakhs&usd_sherkat&usdt";

/** The committed reference, straight out of HMMT-FACT-CHECK.md (SRC-FX). */
export const REFERENCE_RATE = Object.freeze({
  rate: 269305,
  asOf: "2026-10-29",
  source: "HMMT-FACT-CHECK.md SRC-FX (free-market toman/USD, source-reported)"
});

/** Reject readings outside this band; nothing plausible sits outside it. */
export const RATE_BOUNDS = Object.freeze({ min: 10_000, max: 20_000_000 });

/** Reject a reading that moves more than this share from the last accepted one. */
export const JUMP_LIMIT = 0.5;

export const DEFAULT_TTL_MS = 60_000;

const iso = (ms) => new Date(ms).toISOString();

/**
 * Build a service. Every dependency is injectable so the tests can drive it
 * without a socket or a clock.
 *
 * @param {object} [options]
 * @param {() => Promise<string>} [options.read] raw payload reader
 * @param {() => number} [options.now]
 * @param {number} [options.ttlMs]
 * @param {{rate:number, asOf:string, source:string}} [options.reference]
 * @param {(payload: string) => object|null} [options.parse]
 */
export function createFxService({
  read = defaultRead,
  now = () => Date.now(),
  ttlMs = DEFAULT_TTL_MS,
  reference = REFERENCE_RATE,
  parse = parseNavasanWidget
} = {}) {
  let current = {
    rate: reference.rate,
    previousRate: null,
    change: null,
    sourceTime: null,
    sourceDate: null,
    rows: null,
    source: reference.source,
    status: "reference",
    fetchedAt: null,
    asOf: reference.asOf,
    rejects: 0,
    lastReject: null,
    error: null
  };
  let inFlight = null;
  let epoch = 0;

  // Only a value that came from the source can be compared against a new one.
  const accepted = () => (current.status === "reference" ? null : current.rate);

  function reject(rate) {
    if (!Number.isFinite(rate) || rate <= 0) return "not-a-number";
    if (rate < RATE_BOUNDS.min || rate > RATE_BOUNDS.max) return "out-of-bounds";
    const last = accepted();
    if (last && Math.abs(rate / last - 1) > JUMP_LIMIT) return "implausible-jump";
    return null;
  }

  async function refresh() {
    if (inFlight) return inFlight;
    const ticket = ++epoch;
    inFlight = (async () => {
      try {
        const parsed = parse(await read());
        if (!parsed?.rows?.usd) throw new Error("unparseable payload");
        const row = parsed.rows.usd;
        const rejection = reject(row.rate);
        if (rejection) {
          current = {
            ...current,
            status: "suspect",
            rejects: current.rejects + 1,
            lastReject: { rate: row.rate, reason: rejection, at: iso(now()) },
            error: null
          };
          return current;
        }
        current = {
          rate: row.rate,
          previousRate: accepted(),
          change: row.change ?? null,
          sourceTime: row.time ?? null,
          sourceDate: parsed.sourceDate ?? null,
          // Every row the source published travels with the rate: the personal
          // and corporate dollars are the spread a reader needs to see.
          rows: parsed.rows,
          source: "navasan.tech widget (source-reported, not an official rate)",
          status: "fresh",
          fetchedAt: iso(now()),
          asOf: iso(now()),
          rejects: current.rejects,
          lastReject: current.lastReject,
          error: null
        };
        return current;
      } catch (error) {
        const keepStale = current.status === "fresh" || current.status === "stale" || current.status === "suspect";
        if (ticket === epoch) {
          current = {
            ...current,
            status: keepStale ? "stale" : "reference",
            error: String(error?.message ?? error)
          };
        }
        return current;
      }
    })().finally(() => {
      inFlight = null;
    });
    return inFlight;
  }

  function snapshot() {
    const age = current.fetchedAt ? now() - Date.parse(current.fetchedAt) : null;
    return {
      ...current,
      ageMs: age,
      expired: age === null ? true : age > ttlMs,
      ttlMs,
      bounds: RATE_BOUNDS,
      jumpLimit: JUMP_LIMIT,
      live: current.status === "fresh" || current.status === "stale",
      usdToman: current.rate,
      reference: { rate: reference.rate, asOf: reference.asOf, source: reference.source }
    };
  }

  return {
    /** The current snapshot, with no I/O. Safe to call per request. */
    snapshot,
    /** Refresh now; resolves to the snapshot either way. Never throws. */
    async update() {
      await refresh();
      return snapshot();
    },
    /** For tests: the raw internal state, without derived fields. */
    _state() {
      return { ...current };
    }
  };
}

/** Reads the widget payload, with a hard timeout. */
async function defaultRead() {
  const response = await fetch(NAVASAN_WIDGET_URL, {
    headers: { Accept: "text/javascript, text/plain, */*" },
    redirect: "error",
    signal: AbortSignal.timeout(4000)
  });
  if (!response.ok) throw new Error(`navasan answered ${response.status}`);
  return response.text();
}

let singleton = null;

/**
 * The process-wide service. Live reads happen only when CEP_FX_LIVE=1, so the
 * default behaviour of every test, script and CI job is the committed reference.
 */
export function getFxService() {
  if (!singleton) {
    const live = process.env.CEP_FX_LIVE === "1";
    singleton = createFxService(
      live
        ? {}
        : {
            read: async () => {
              throw new Error("live FX disabled (set CEP_FX_LIVE=1 to read the source)");
            }
          }
    );
  }
  return singleton;
}

/** Tests and scripts replace the process-wide service with this. */
export function setFxService(service) {
  singleton = service;
  return singleton;
}
