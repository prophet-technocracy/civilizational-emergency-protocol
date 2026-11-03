import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer } from "../src/server.mjs";

const server = createServer();
let baseUrl;

before(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("health endpoint reports service status without exposing environment details", async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("demo endpoint is explicitly synthetic and contains no person records", async () => {
  const response = await fetch(`${baseUrl}/api/v1/demo`);
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(payload.mode, "synthetic-demo");
  assert.match(payload.notice, /نمونهٔ محلی/);
  assert.ok(Array.isArray(payload.modules));
  assert.ok(payload.modules.every((module) => module.status === "planned"));
  assert.ok(payload.modules.every((module) => !("person" in module)));
});

test("API routes reject non-GET requests", async () => {
  const response = await fetch(`${baseUrl}/api/v1/demo`, { method: "POST" });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "GET");
  assert.deepEqual(await response.json(), { error: "method_not_allowed" });
});

test("unknown routes do not disclose server internals", async () => {
  const response = await fetch(`${baseUrl}/api/v1/unknown`);
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: "not_found" });
});
