import { useEffect, useState } from "react";

const cache = new Map();

/**
 * Read-only data hook. Preserves per-path caching so switching modules is
 * instant, and exposes an explicit reload that bypasses the cache.
 */
export function useApi(path) {
  const [state, setState] = useState(() =>
    cache.has(path)
      ? { status: "ready", payload: cache.get(path) }
      : { status: "loading", payload: null }
  );
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!path) return undefined;
    if (cache.has(path) && nonce === 0) return undefined;

    let alive = true;
    setState({ status: "loading", payload: null });
    fetch(path, { headers: { Accept: "application/json" }, credentials: "omit" })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((payload) => {
        if (!alive) return;
        cache.set(path, payload);
        setState({ status: "ready", payload });
      })
      .catch(() => {
        if (alive) setState({ status: "error", payload: null });
      });

    return () => {
      alive = false;
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
    cache.set(path, payload);
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
