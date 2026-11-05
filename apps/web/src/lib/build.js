// What the footer is allowed to say about this build.
//
// The values are injected by Vite at build time (`__CEP_VERSION__` from
// apps/web/package.json, `__CEP_COMMIT__` from git). Under `node --test` and any
// other bundler these globals do not exist, so every read is guarded and the
// fallback is the honest one: no version, `dev` instead of a hash (issue #40).
export const BUILD = Object.freeze({
  version: typeof __CEP_VERSION__ === "undefined" ? null : __CEP_VERSION__,
  commit: typeof __CEP_COMMIT__ === "undefined" ? "dev" : __CEP_COMMIT__
});
