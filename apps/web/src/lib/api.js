import { useEffect, useState, useSyncExternalStore } from "react";
import { validateEnvelope } from "../demo-contract.mjs";
import { requestJson, createApiCache } from "./request.mjs";
import { getHealth, subscribeHealth, reportFailure, reportSuccess } from "./health.mjs";

// One cache for the whole app, with an age. A cached payload is reused while it
// is fresh, and revalidated in the background once it is older than the TTL —
// the screen keeps showing data it already has instead of flashing a skeleton
// every time a reader changes route and comes back.
const cache = createApiCache();

/**
 * Read-only data hook.
 *
 * Returns `{ status, payload, error, stale, reload }` where:
 *   status  "loading" | "ready" | "error"
 *   error   `{ kind, status, detail }` from request.mjs, or null
 *   stale   true when the payload on screen is older than the TTL and the
 *           refresh that was supposed to replace it failed
 *
 * A failed refresh with usable cached data stays `ready` on purpose: replacing
 * five-minute-old content with an error page loses more than it tells. The
 * staleness travels on `stale` and is announced by the shell.
 */
export function useApi(path) {
  const [state, setState] = useState(() => initial(path));
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!path) return undefined;
    const entry = cache.read(path);
    if (entry && !entry.stale && nonce === 0) {
      setState({ status: "ready", payload: entry.payload, error: null, stale: false });
      return undefined;
    }

    let alive = true;
    const controller = new AbortController();
    const fallback = entry?.payload ?? null;
    if (!fallback) setState({ status: "loading", payload: null, error: null, stale: false });

    requestJson(path, { signal: controller.signal, validate: validateEnvelope }).then((result) => {
      if (!alive) return;
      if (result.ok) {
        cache.write(path, result.payload);
        reportSuccess(path);
        setState({ status: "ready", payload: result.payload, error: null, stale: false });
        return;
      }
      if (result.error.kind === "aborted") return;
      reportFailure(result.error.kind, path);
      setState((previous) => {
        const usable = previous.payload ?? fallback;
        return usable
          ? { status: "ready", payload: usable, error: result.error, stale: true }
          : { status: "error", payload: null, error: result.error, stale: false };
      });
    });

    return () => {
      alive = false;
      controller.abort();
    };
  }, [path, nonce]);

  return {
    ...state,
    reload: () => {
      cache.delete(path);
      setNonce((value) => value + 1);
    }
  };
}

function initial(path) {
  const entry = path ? cache.read(path) : null;
  if (!entry) return { status: "loading", payload: null, error: null, stale: false };
  return { status: "ready", payload: entry.payload, error: null, stale: entry.stale };
}

/** Live view of whether the app can reach its API. Used by the shell notice. */
export function useDataHealth() {
  return useSyncExternalStore(subscribeHealth, getHealth, getHealth);
}

// The schema version is a property of the server, not of this file: it is read
// from an /api/v1/health envelope once per page load (issue #40). Until it
// answers there is no version to print, and nothing is guessed.
let schemaVersionPromise = null;

export function useSchemaVersion() {
  const [version, setVersion] = useState(null);
  useEffect(() => {
    let alive = true;
    if (!schemaVersionPromise) {
      // Same deadline as every other request: a version string is not worth a
      // hung connection, and "no version" is a valid answer to print nothing.
      schemaVersionPromise = requestJson("/api/v1/health", { timeoutMs: 5_000 })
        .then((result) => (result.ok ? result.payload?.schemaVersion ?? null : null));
    }
    schemaVersionPromise.then((value) => {
      if (alive) setVersion(value);
    });
    return () => {
      alive = false;
    };
  }, []);
  return version;
}

export function useDebounced(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function readStored(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeStored(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage disabled — the interface still works, preferences are just not remembered */
  }
}

/** Test seam: pre-populate the read-only response cache (used by render tests). */
export function primeApiCache(entries) {
  for (const [path, payload] of Object.entries(entries)) {
    cache.write(path, payload);
  }
}

export function clearApiCache() {
  cache.clear();
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
