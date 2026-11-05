import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The footer must state real information, so the version and the commit are
// injected here rather than typed into a component (issue #40). A checkout
// without git — an exported tarball, a CI shallow clone without history — says
// `dev` instead of inventing a hash.
const WEB_ROOT = dirname(fileURLToPath(import.meta.url));
const PACKAGE_VERSION = JSON.parse(readFileSync(resolve(WEB_ROOT, "package.json"), "utf-8")).version;

function shortCommit() {
  try {
    return execFileSync("git", ["rev-parse", "--short", "HEAD"], {
      cwd: WEB_ROOT,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim() || "dev";
  } catch {
    return "dev";
  }
}

// Defaults keep `npm run dev` on 5173 (web) + 3001 (API), which is what the
// README documents. The env overrides exist so a preview environment can put the
// application itself on a fixed port while the API moves one port along — the
// API alone serves JSON, so pointing an app preview at it shows a 404.
const WEB_PORT = Number(process.env.WEB_PORT ?? 5173);
const API_PORT = Number(process.env.API_PORT ?? 3001);
const API_TARGET = process.env.API_TARGET ?? `http://127.0.0.1:${API_PORT}`;

export default defineConfig({
  plugins: [react()],
  define: {
    __CEP_VERSION__: JSON.stringify(PACKAGE_VERSION),
    __CEP_COMMIT__: JSON.stringify(shortCommit())
  },
  server: {
    host: "0.0.0.0",
    port: WEB_PORT,
    strictPort: true,
    allowedHosts: [".e2b.app"],
    proxy: {
      "/api": {
        target: API_TARGET,
        changeOrigin: true
      },
      "/health": {
        target: API_TARGET,
        changeOrigin: true
      }
    }
  }
});
