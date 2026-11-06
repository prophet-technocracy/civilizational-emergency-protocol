// Whether the app is currently able to reach its own API.
//
// Stale-while-revalidate means a screen may be showing five-minute-old data
// while a refresh fails in the background. That is the right behaviour on a
// throttled or filtered connection, but it is only honest if the interface says
// so. The modules each render their own error state when they have nothing to
// show; this store exists for the case where they *do* have something to show.
//
// Health is tracked **per path**, because one successful request must not paper
// over a different endpoint that is failing. A screen showing cached data while
// its own refresh fails is exactly the case a single boolean would hide.
//
// A tiny external store rather than context: `useApi` is imported by modules all
// over the tree, and threading a provider through every one of them to report a
// network fact would be more coupling than the fact deserves.

const listeners = new Set();
const failing = new Map();
let lastKind = null;
let lastAt = null;
let snapshot = Object.freeze({ state: "ok", kind: null, at: null, failures: 0 });

function emit() {
  for (const listener of listeners) listener();
}

function recompute() {
  snapshot = Object.freeze({
    state: failing.size === 0 ? "ok" : "degraded",
    kind: failing.size === 0 ? null : lastKind,
    at: failing.size === 0 ? null : lastAt,
    failures: failing.size
  });
  emit();
}

/**
 * A request succeeded. Only that path recovers; the others keep their failure.
 * @param {string} [path]
 */
export function reportSuccess(path) {
  if (path === undefined) {
    if (failing.size === 0) return;
    failing.clear();
    recompute();
    return;
  }
  if (!failing.delete(path)) return;
  recompute();
}

/**
 * A request failed. `aborted` is our own cancellation and never degrades the app.
 * @param {"offline"|"timeout"|"http"|"contract"|"network"|"aborted"} kind
 * @param {string} [path]
 */
export function reportFailure(kind, path = "*") {
  if (kind === "aborted") return;
  const previous = failing.get(path);
  failing.set(path, kind);
  lastKind = kind;
  lastAt = new Date().toISOString();
  // Repeating the same failure changes nothing a reader can see; rebuilding the
  // snapshot would only churn every subscriber.
  if (previous === kind) return;
  recompute();
}

export function getHealth() {
  return snapshot;
}

export function subscribeHealth(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Test seam: the store is module-level, so tests must be able to reset it. */
export function resetHealth() {
  failing.clear();
  lastKind = null;
  lastAt = null;
  recompute();
}
