import assert from "node:assert/strict";
import test from "node:test";
import { isDemoPayload, readDemoResponse } from "../src/demo-contract.mjs";

const validPayload = {
  mode: "synthetic-demo",
  notice: "Synthetic placeholder only",
  modules: [
    {
      id: "module-one",
      title: "Example module",
      description: "No verified content is included.",
      status: "planned"
    }
  ]
};

test("accepts only the synthetic read-only content contract", () => {
  assert.equal(isDemoPayload(validPayload), true);
  assert.equal(isDemoPayload({ ...validPayload, mode: "verified" }), false);
  assert.equal(isDemoPayload({ ...validPayload, modules: [{ ...validPayload.modules[0], status: "live" }] }), false);
});

test("rejects malformed modules and duplicate identifiers", () => {
  assert.equal(isDemoPayload(null), false);
  assert.equal(isDemoPayload({ ...validPayload, modules: [null] }), false);
  assert.equal(
    isDemoPayload({ ...validPayload, modules: [validPayload.modules[0], validPayload.modules[0]] }),
    false
  );
});

test("response reader rejects HTTP failures and malformed payloads", async () => {
  await assert.rejects(readDemoResponse({ ok: false }), /request failed/);
  await assert.rejects(readDemoResponse({ ok: true, json: async () => ({}) }), /Unexpected/);
  await assert.rejects(readDemoResponse({ ok: true, json: async () => { throw new Error("bad json"); } }), /valid JSON/);
});

test("response reader returns a validated payload", async () => {
  assert.deepEqual(await readDemoResponse({ ok: true, json: async () => validPayload }), validPayload);
});
