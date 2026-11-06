// The one place a request is made, and the one place it is allowed to fail.
//
// Issue #44: `fetch` had no timeout, so a stalled connection left the spinner
// running for as long as the reader was willing to wait; the response cache was
// a Map that never expired; and every failure — offline, timeout, 500, or a
// payload that broke the demo contract — collapsed into "could not be loaded".
// A contract failure is a data-integrity event and looked exactly like a flaky
// network, which is how a defect stays invisible.
//
// So: a pure function that returns a discriminated result, never throws, and
// names what went wrong. No React in this file, which is what makes the four
// failure modes testable without a browser.
//
// The kinds, and what each one means:
//
//   offline   the browser says it has no connection
//   timeout   no answer within the deadline (the request is aborted)
//   http      the server answered, and the answer was a status other than 2xx
//   contract  the server answered 2xx with a payload that breaks the envelope
//   network   the request never completed and none of the above explain it
//   aborted   we cancelled it (navigation, unmount) — not a failure to report

/** Twelve seconds: long enough for a slow mobile network, short enough to admit failure. */
export const DEFAULT_TIMEOUT_MS = 12_000;

/** Five minutes. Past that the data is old enough that the reader should know. */
export const CACHE_TTL_MS = 5 * 60_000;

export const ERROR_KINDS = Object.freeze(["offline", "timeout", "http", "contract", "network", "aborted"]);

const failure = (kind, extra = {}) => ({
  ok: false,
  error: { kind, status: null, detail: null, ...extra }
});

const isOffline = () => typeof navigator !== "undefined" && navigator.onLine === false;

/**
 * Perform one read-only JSON request.
 *
 * @param {string} path
 * @param {object} [options]
 * @param {typeof fetch} [options.fetchImpl]
 * @param {number} [options.timeoutMs]
 * @param {AbortSignal} [options.signal] external cancellation (unmount, route change)
 * @param {(payload: unknown) => {valid: boolean, errors?: string[]}} [options.validate]
 * @returns {Promise<{ok: true, payload: unknown} | {ok: false, error: {kind: string, status: number|null, detail: string|null}}>}
 */
export async function requestJson(path, {
  fetchImpl = typeof fetch === "function" ? fetch : null,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  signal,
  validate
} = {}) {
  if (signal?.aborted) return failure("aborted");
  if (!fetchImpl) return failure("network", { detail: "no fetch available" });
  if (isOffline()) return failure("offline");

  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const forwardAbort = () => controller.abort();
  signal?.addEventListener("abort", forwardAbort, { once: true });

  try {
    const response = await fetchImpl(path, {
      headers: { Accept: "application/json" },
      credentials: "omit",
      signal: controller.signal
    });

    if (!response.ok) {
      return failure("http", { status: response.status, detail: `HTTP ${response.status}` });
    }

    let payload;
    try {
      payload = await response.json();
    } catch {
      // A 2xx with a body that is not JSON is a contract problem, not a network
      // problem: something answered, and what it answered was not the format.
      return failure("contract", { detail: "response body is not JSON" });
    }

    if (validate) {
      const result = validate(payload) ?? { valid: true };
      if (!result.valid) {
        return failure("contract", {
          detail: (result.errors ?? []).join("; ").slice(0, 500) || "envelope rejected"
        });
      }
    }

    return { ok: true, payload };
  } catch (error) {
    if (signal?.aborted && !timedOut) return failure("aborted");
    if (timedOut || error?.name === "AbortError") {
      return failure("timeout", { detail: `${Math.round(timeoutMs / 1000)} s` });
    }
    if (isOffline()) return failure("offline");
    return failure("network", { detail: String(error?.message ?? error).slice(0, 200) });
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", forwardAbort);
  }
}

/**
 * A response cache with an age, so "cached" stops meaning "unknown how old".
 *
 * @param {object} [options]
 * @param {number} [options.ttlMs]
 * @param {() => number} [options.now]
 */
export function createApiCache({ ttlMs = CACHE_TTL_MS, now = () => Date.now() } = {}) {
  const entries = new Map();
  return {
    /** @returns {{payload: unknown, ageMs: number, stale: boolean}|null} */
    read(path) {
      const entry = entries.get(path);
      if (!entry) return null;
      const ageMs = now() - entry.storedAt;
      // At the TTL the entry is stale, not fresh: the boundary belongs to the
      // side that tells the reader something they need to know.
      return { payload: entry.payload, ageMs, stale: ageMs >= ttlMs };
    },
    write(path, payload) {
      entries.set(path, { payload, storedAt: now() });
    },
    delete(path) {
      return entries.delete(path);
    },
    clear() {
      entries.clear();
    },
    get size() {
      return entries.size;
    },
    ttlMs
  };
}
