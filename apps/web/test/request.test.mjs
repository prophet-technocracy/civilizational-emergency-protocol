// Issue #44: four failure modes that used to look identical.
//
// These tests drive the request layer with a mocked `fetch`, a mocked clock and
// a stubbed `navigator`, so every branch is exercised without a browser and
// without waiting twelve real seconds for a timeout.
import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { requestJson, createApiCache, DEFAULT_TIMEOUT_MS, CACHE_TTL_MS } from "../src/lib/request.mjs";
import { reportSuccess, reportFailure, getHealth, resetHealth, subscribeHealth } from "../src/lib/health.mjs";

const jsonResponse = (body, { ok = true, status = 200 } = {}) => ({
  ok,
  status,
  json: async () => body
});

const GOOD = { mode: "synthetic-demo", epistemicNotice: { fa: "x", en: "x" }, data: {} };
const validate = (payload) => ({ valid: payload?.mode === "synthetic-demo", errors: ["mode"] });

afterEach(() => resetHealth());

/* ------------------------------- success path ------------------------------ */

test("a good response is returned with its payload and passes validation", async () => {
  let seen = null;
  const result = await requestJson("/api/v1/x", {
    fetchImpl: async (path, options) => {
      seen = { path, options };
      return jsonResponse(GOOD);
    },
    validate
  });
  assert.equal(result.ok, true);
  assert.deepEqual(result.payload, GOOD);
  assert.equal(seen.path, "/api/v1/x");
  assert.equal(seen.options.credentials, "omit");
  assert.equal(seen.options.headers.Accept, "application/json");
  assert.ok(seen.options.signal, "every request carries an abort signal");
});

/* --------------------------------- http ----------------------------------- */

test("a 500 is an http failure carrying the status code", async () => {
  const result = await requestJson("/api/v1/x", { fetchImpl: async () => jsonResponse({}, { ok: false, status: 500 }) });
  assert.equal(result.ok, false);
  assert.equal(result.error.kind, "http");
  assert.equal(result.error.status, 500);
});

test("a 404 is an http failure, not a contract failure", async () => {
  const result = await requestJson("/api/v1/nope", { fetchImpl: async () => jsonResponse({}, { ok: false, status: 404 }) });
  assert.equal(result.error.kind, "http");
  assert.equal(result.error.status, 404);
});

/* -------------------------------- contract -------------------------------- */

test("a 2xx that breaks the envelope is a contract failure, with the reasons", async () => {
  const result = await requestJson("/api/v1/x", {
    fetchImpl: async () => jsonResponse({ mode: "something-else" }),
    validate
  });
  assert.equal(result.ok, false);
  assert.equal(result.error.kind, "contract");
  assert.match(result.error.detail, /mode/);
  assert.equal(result.error.status, null, "a contract failure is not an HTTP status");
});

test("a 2xx whose body is not JSON is a contract failure", async () => {
  const result = await requestJson("/api/v1/x", {
    fetchImpl: async () => ({ ok: true, status: 200, json: async () => { throw new SyntaxError("Unexpected token <"); } })
  });
  assert.equal(result.error.kind, "contract");
});

/* --------------------------------- timeout -------------------------------- */

test("a request that never answers times out and is aborted", async () => {
  let aborted = false;
  const result = await requestJson("/api/v1/slow", {
    timeoutMs: 25,
    fetchImpl: (path, { signal }) =>
      new Promise((_, reject) => {
        signal.addEventListener("abort", () => {
          aborted = true;
          reject(Object.assign(new Error("aborted"), { name: "AbortError" }));
        });
      })
  });
  assert.equal(result.ok, false);
  assert.equal(result.error.kind, "timeout");
  assert.equal(aborted, true, "the deadline must abort the fetch, not merely give up listening");
});

test("the default deadline is the documented one", () => {
  assert.equal(DEFAULT_TIMEOUT_MS, 12_000);
});

/* --------------------------- offline and network -------------------------- */

test("no connection is reported as offline, not as a server problem", async () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  Object.defineProperty(globalThis, "navigator", { value: { onLine: false }, configurable: true });
  try {
    const result = await requestJson("/api/v1/x", {
      fetchImpl: async () => {
        throw new TypeError("Failed to fetch");
      }
    });
    assert.equal(result.error.kind, "offline");
  } finally {
    if (original) Object.defineProperty(globalThis, "navigator", original);
    else delete globalThis.navigator;
  }
});

test("a network failure with an interface that claims to be online is 'network'", async () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  Object.defineProperty(globalThis, "navigator", { value: { onLine: true }, configurable: true });
  try {
    const result = await requestJson("/api/v1/x", {
      fetchImpl: async () => {
        throw new TypeError("Failed to fetch");
      }
    });
    assert.equal(result.error.kind, "network");
    assert.match(result.error.detail, /Failed to fetch/);
  } finally {
    if (original) Object.defineProperty(globalThis, "navigator", original);
    else delete globalThis.navigator;
  }
});

/* --------------------------------- aborted -------------------------------- */

test("our own cancellation is 'aborted', which is not a failure", async () => {
  const controller = new AbortController();
  controller.abort();
  const result = await requestJson("/api/v1/x", { signal: controller.signal, fetchImpl: async () => jsonResponse(GOOD) });
  assert.equal(result.error.kind, "aborted");
});

test("a route change mid-flight aborts rather than landing on the wrong screen", async () => {
  const controller = new AbortController();
  const pending = requestJson("/api/v1/x", {
    signal: controller.signal,
    fetchImpl: (path, { signal }) =>
      new Promise((_, reject) => {
        signal.addEventListener("abort", () => reject(Object.assign(new Error("aborted"), { name: "AbortError" })));
      })
  });
  controller.abort();
  const result = await pending;
  assert.equal(result.error.kind, "aborted");
});

/* ---------------------------------- cache --------------------------------- */

test("the cache knows how old its entries are, and when they are stale", () => {
  let clock = 1_000;
  const cache = createApiCache({ ttlMs: 60_000, now: () => clock });
  assert.equal(cache.read("/a"), null);

  cache.write("/a", { v: 1 });
  assert.deepEqual(cache.read("/a"), { payload: { v: 1 }, ageMs: 0, stale: false });

  clock += 59_999;
  assert.equal(cache.read("/a").stale, false);
  clock += 1;
  assert.equal(cache.read("/a").stale, true, "at the TTL the entry is stale, not gone");
  assert.equal(cache.read("/a").ageMs, 60_000);
});

test("the cache can be dropped per path, in full, and reports its size", () => {
  const cache = createApiCache();
  cache.write("/a", 1);
  cache.write("/b", 2);
  assert.equal(cache.size, 2);
  assert.equal(cache.delete("/a"), true);
  assert.equal(cache.read("/a"), null);
  assert.equal(cache.size, 1);
  cache.clear();
  assert.equal(cache.size, 0);
});

test("the documented TTL is five minutes", () => {
  assert.equal(CACHE_TTL_MS, 5 * 60_000);
});

/* --------------------------------- health --------------------------------- */

test("health degrades on a real failure and recovers when that path succeeds", () => {
  assert.equal(getHealth().state, "ok");
  reportFailure("timeout", "/a");
  assert.equal(getHealth().state, "degraded");
  assert.equal(getHealth().kind, "timeout");
  assert.equal(getHealth().failures, 1);
  reportSuccess("/a");
  assert.deepEqual(
    { state: getHealth().state, kind: getHealth().kind, failures: getHealth().failures },
    { state: "ok", kind: null, failures: 0 }
  );
});

test("one endpoint recovering does not vouch for another that is still failing", () => {
  reportFailure("timeout", "/slow");
  reportFailure("http", "/broken");
  assert.equal(getHealth().failures, 2);
  assert.equal(getHealth().kind, "http", "the notice names the most recent failure");
  reportSuccess("/slow");
  assert.equal(getHealth().state, "degraded", "a success elsewhere must not clear /broken");
  assert.equal(getHealth().failures, 1);
  reportSuccess("/broken");
  assert.equal(getHealth().state, "ok");
});

test("the same failure repeating does not keep rewriting the snapshot", () => {
  reportFailure("offline", "/a");
  const first = getHealth();
  reportFailure("offline", "/a");
  assert.equal(getHealth(), first, "an unchanged failure must not churn subscribers");
});

test("our own cancellation does not degrade health", () => {
  reportFailure("aborted", "/a");
  assert.equal(getHealth().state, "ok");
});

test("subscribers are told, and can stop listening", () => {
  let calls = 0;
  const unsubscribe = subscribeHealth(() => {
    calls += 1;
  });
  reportFailure("offline", "/a");
  assert.equal(calls, 1);
  reportSuccess("/a");
  assert.equal(calls, 2);
  unsubscribe();
  reportFailure("network", "/b");
  assert.equal(calls, 2);
});
