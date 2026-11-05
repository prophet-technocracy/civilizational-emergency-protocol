import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Defaults keep `npm run dev` on 5173 (web) + 3001 (API), which is what the
// README documents. The env overrides exist so a preview environment can put the
// application itself on a fixed port while the API moves one port along — the
// API alone serves JSON, so pointing an app preview at it shows a 404.
const WEB_PORT = Number(process.env.WEB_PORT ?? 5173);
const API_PORT = Number(process.env.API_PORT ?? 3001);
const API_TARGET = process.env.API_TARGET ?? `http://127.0.0.1:${API_PORT}`;

export default defineConfig({
  plugins: [react()],
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
