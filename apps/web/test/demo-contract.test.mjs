import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "../../api/src/server.mjs";
import { readApiResponse, validateEnvelope, isApiPayload, ENVELOPE_MODE } from "../src/demo-contract.mjs";

const basePayload = {
  mode: ENVELOPE_MODE,
  schemaVersion: "1.0.0",
  generatedAt: "2026-01-04T09:12:00.000Z",
  epistemicNotice: {
    fa: "همهٔ محتوا ساختگی، پیشنهادی یا ارجاعی است.",
    en: "All content is synthetic, proposed, or referential."
  },
  data: { items: [] }
};

// Live server: this suite validates the real envelope, not a mock of it.
const server = createServer();

test.before(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

function baseUrl() {
  const { port } = server.address();
  return `http://127.0.0.1:${port}`;
}

test("accepts the envelope shape and rejects a drifted one", () => {
  assert.equal(validateEnvelope(basePayload).valid, true);
  assert.equal(isApiPayload(basePayload), true);

  assert.equal(isApiPayload({ ...basePayload, mode: "verified" }), false);
  assert.equal(isApiPayload({ ...basePayload, schemaVersion: "" }), false);
  assert.equal(isApiPayload({ ...basePayload, generatedAt: "yesterday" }), false);
  assert.equal(
    isApiPayload({ ...basePayload, epistemicNotice: { fa: "فقط فارسی", en: "" } }),
    false
  );
  const { data, ...withoutData } = basePayload;
  assert.equal(isApiPayload(withoutData), false);
});

test("rejects personal-data keys and living-person records anywhere in the payload", () => {
  const withId = { ...basePayload, data: { dossier: { national_id: "1234567890" } } };
  assert.match(validateEnvelope(withId).errors.join(" "), /national_id/);

  const living = { ...basePayload, data: { dossier: { status: "living" } } };
  assert.match(validateEnvelope(living).errors.join(" "), /living-person/);

  const flagged = { ...basePayload, data: { rows: [{ isLiving: true }] } };
  assert.match(validateEnvelope(flagged).errors.join(" "), /isLiving/);

  const nested = { ...basePayload, data: { list: [{ deep: [{ biometric_template: "x" }] }] } };
  assert.match(validateEnvelope(nested).errors.join(" "), /biometric_template/);
});

test("response reader rejects transport failures and malformed bodies", async () => {
  await assert.rejects(readApiResponse({ ok: false, status: 500 }), /API request failed \(500\)/);
  await assert.rejects(
    readApiResponse({ ok: true, json: async () => ({ mode: "other" }) }),
    /Unexpected API payload/
  );
  await assert.rejects(
    readApiResponse({
      ok: true,
      json: async () => {
        throw new Error("bad json");
      }
    }),
    /not valid JSON/
  );
  const parsed = await readApiResponse({ ok: true, json: async () => basePayload });
  assert.deepEqual(parsed, basePayload);
});

test("/api/v1/demo keeps its original scaffold shape (no envelope)", async () => {
  const response = await fetch(`${baseUrl()}/api/v1/demo`);
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.deepEqual(Object.keys(payload).sort(), ["mode", "modules", "notice"]);
  assert.equal(payload.mode, ENVELOPE_MODE);
  assert.match(payload.notice, /نمونهٔ محلی/);
  assert.ok(payload.modules.every((module) => module.status === "planned"));
  // It is deliberately not an envelope payload; the guard must reject it.
  assert.equal(isApiPayload(payload), false);
});

test("every live endpoint satisfies the envelope contract", async () => {
  const paths = [
    "/api/v1/health",
    "/api/v1/dashboard",
    "/api/v1/modules",
    "/api/v1/governance",
    "/api/v1/transition",
    "/api/v1/institutions",
    "/api/v1/archive",
    "/api/v1/archive/SYN-HIST-001",
    "/api/v1/sources",
    "/api/v1/evidence",
    "/api/v1/verification",
    "/api/v1/accountability",
    "/api/v1/public-services",
    "/api/v1/projects",
    "/api/v1/simulations",
    "/api/v1/digital-legacy",
    "/api/v1/search?q=پرونده"
  ];

  for (const path of paths) {
    const response = await fetch(`${baseUrl()}${path}`);
    assert.equal(response.status, 200, `${path} did not return 200`);
    const payload = await readApiResponse(response);
    assert.equal(payload.mode, ENVELOPE_MODE, `${path} has the wrong mode`);
    assert.equal(payload.generatedAt.includes("T"), true, `${path} has no ISO generatedAt`);
  }
});
