import { createServer as createHttpServer } from "node:http";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { demoPayload } from "./content.mjs";

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(JSON.stringify(payload));
}

export function createServer() {
  return createHttpServer((request, response) => {
    const method = request.method ?? "GET";
    const pathname = new URL(request.url ?? "/", "http://local.invalid").pathname;

    if (method !== "GET") {
      sendJson(response, 405, { error: "method_not_allowed" });
      return;
    }

    if (pathname === "/health") {
      sendJson(response, 200, { status: "ok" });
      return;
    }

    if (pathname === "/api/v1/demo") {
      sendJson(response, 200, demoPayload);
      return;
    }

    sendJson(response, 404, { error: "not_found" });
  });
}

const isEntrypoint =
  process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isEntrypoint) {
  const port = Number.parseInt(process.env.PORT ?? "3001", 10);
  const server = createServer();
  server.listen(port, "0.0.0.0", () => {
    console.log(`CEP demo API listening on 0.0.0.0:${port} (synthetic, read-only)`);
  });
}
