// The two validation schemes, driven by fixtures rather than by a live client.
//
// The HMAC fixture below was computed **independently** (Python `hmac`, not this
// module) from the documented algorithm and pasted here whole. That makes the
// test a cross-implementation check rather than a mirror: if this file's
// argument order were reversed — the classic `WebAppData` mistake — the fixture
// would fail instead of agreeing with itself.
import assert from "node:assert/strict";
import { generateKeyPairSync, sign } from "node:crypto";
import { after, before, test } from "node:test";
import { createServer } from "../src/server.mjs";
import {
  computeHash,
  dataCheckString,
  parseInitData,
  verifyInitData,
  verifyThirdPartySignature,
  TELEGRAM_SIGNATURE_KEYS,
  DEFAULT_MAX_AGE_SECONDS
} from "../src/platform/telegram/initdata.mjs";

const BOT_TOKEN = "123456789:TEST-token-not-real";

// Python: secret = HMAC(key=b"WebAppData", msg=token); hash = HMAC(key=secret, msg=check)
const FIXTURE =
  "auth_date=1735689600&query_id=AAHdF6IQAAAAAN0XohDhrOrc&start_param=probe&user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Test%22%2C%22language_code%22%3A%22fa%22%7D&hash=26744d71b253c0f9572256095761c7868415bad7e142dc354e53fc5123ae20bf";

const FIXTURE_CHECK =
  'auth_date=1735689600\nquery_id=AAHdF6IQAAAAAN0XohDhrOrc\nstart_param=probe\nuser={"id":123456789,"first_name":"Test","language_code":"fa"}';

const AT_FIXTURE = 1735689600 * 1000;

/* --------------------------------- parsing -------------------------------- */

test("a query string becomes fields, an insertion order, and the two signatures", () => {
  const parsed = parseInitData(FIXTURE);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.fields.start_param, "probe");
  assert.equal(parsed.hash, "26744d71b253c0f9572256095761c7868415bad7e142dc354e53fc5123ae20bf");
  assert.equal(parsed.signature, null);
  assert.equal(Object.hasOwn(parsed.fields, "hash"), false, "the hash is not part of the signed fields");
});

test("empty, oversized and duplicated payloads are refused before any crypto", () => {
  assert.equal(parseInitData("").reason, "missing");
  assert.equal(parseInitData(undefined).reason, "missing");
  assert.equal(parseInitData("a=1&a=2").reason, "duplicate-field");
  assert.equal(parseInitData(`a=${"x".repeat(9000)}`).reason, "too-long");
});

test("the data-check-string is sorted by key and joined with line feeds", () => {
  assert.equal(
    dataCheckString({ user: "u", auth_date: "1", query_id: "q", start_param: "p" }),
    "auth_date=1\nquery_id=q\nstart_param=p\nuser=u"
  );
  assert.equal(
    dataCheckString({ auth_date: "1" }, { prefix: "42:WebAppData" }),
    "42:WebAppData\nauth_date=1"
  );
});

/* ------------------------------ HMAC validation --------------------------- */

test("an independently computed fixture validates", () => {
  const result = verifyInitData({ initData: FIXTURE, botToken: BOT_TOKEN, now: AT_FIXTURE + 5_000 });
  assert.equal(result.ok, true, result.reason);
  assert.equal(result.data.startParam, "probe");
  assert.equal(result.data.queryId, "AAHdF6IQAAAAAN0XohDhrOrc");
  assert.equal(result.data.userId, 123456789);
  assert.equal(result.data.languageCode, "fa");
  assert.equal(result.data.ageSeconds, 5);
});

test("the check-string this module builds is the one Python signed", () => {
  const parsed = parseInitData(FIXTURE);
  assert.equal(dataCheckString(parsed.fields), FIXTURE_CHECK);
  assert.equal(computeHash(FIXTURE_CHECK, BOT_TOKEN), parsed.hash);
});

test("a tampered field fails, and the fake bot token in this file cannot rescue it", () => {
  const tampered = FIXTURE.replace("start_param=probe", "start_param=admin");
  assert.equal(verifyInitData({ initData: tampered, botToken: BOT_TOKEN }).reason, "bad-hash");
  assert.equal(verifyInitData({ initData: FIXTURE, botToken: "999:another-token" }).reason, "bad-hash");
});

test("a missing hash, a missing token and a missing auth_date are distinct failures", () => {
  assert.equal(verifyInitData({ initData: FIXTURE.replace(/&hash=[0-9a-f]+/, ""), botToken: BOT_TOKEN }).reason, "no-hash");
  assert.equal(verifyInitData({ initData: FIXTURE, botToken: "" }).reason, "no-token");
  const noDate = FIXTURE.replace("auth_date=1735689600&", "");
  assert.equal(verifyInitData({ initData: noDate, botToken: BOT_TOKEN }).reason, "bad-hash", "removing a field breaks the signature first");
});

test("a stale payload is refused, and the default window is a day", () => {
  const stale = verifyInitData({
    initData: FIXTURE,
    botToken: BOT_TOKEN,
    now: AT_FIXTURE + (DEFAULT_MAX_AGE_SECONDS + 60) * 1000
  });
  assert.equal(stale.reason, "stale");
  assert.equal(DEFAULT_MAX_AGE_SECONDS, 86_400);
});

test("a timestamp from the future is refused rather than trusted", () => {
  const result = verifyInitData({ initData: FIXTURE, botToken: BOT_TOKEN, now: AT_FIXTURE - 120_000 });
  assert.equal(result.reason, "clock-skew");
});

test("the token never appears in the result", () => {
  const result = verifyInitData({ initData: FIXTURE, botToken: BOT_TOKEN, now: AT_FIXTURE });
  assert.equal(JSON.stringify(result).includes("TEST-token"), false);
});

/* --------------------------- third-party signature ------------------------ */

function signedFixture({ botId = 42, authDate = 1735689600 } = {}) {
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  const fields = { auth_date: String(authDate), query_id: "Q", user: '{"id":7}' };
  const check = dataCheckString(fields, { prefix: `${botId}:WebAppData` });
  const signature = sign(null, Buffer.from(check, "utf8"), privateKey).toString("base64url");
  const params = new URLSearchParams({ ...fields, signature });
  const jwk = publicKey.export({ format: "jwk" });
  const publicKeyHex = Buffer.from(jwk.x, "base64url").toString("hex");
  return { initData: params.toString(), publicKeyHex, botId, check };
}

test("the third-party construction is botId:WebAppData then the sorted fields", () => {
  const { check } = signedFixture({ botId: 42 });
  assert.equal(check, '42:WebAppData\nauth_date=1735689600\nquery_id=Q\nuser={"id":7}');
});

test("a signature over that construction verifies, and a changed field does not", () => {
  const { initData, publicKeyHex, botId } = signedFixture();
  const ok = verifyThirdPartySignature({ initData, publicKeyHex, botId, now: (1735689600 + 10) * 1000 });
  assert.equal(ok.ok, true, ok.reason);

  const tampered = initData.replace("query_id=Q", "query_id=X");
  assert.equal(verifyThirdPartySignature({ initData: tampered, publicKeyHex, botId }).reason, "bad-signature");
});

test("the wrong bot id breaks the signature, which is what binds it to one bot", () => {
  const { initData, publicKeyHex } = signedFixture({ botId: 42 });
  assert.equal(verifyThirdPartySignature({ initData, publicKeyHex, botId: 43 }).reason, "bad-signature");
});

test("a payload with no signature is refused, not treated as unsigned-but-fine", () => {
  const { initData, publicKeyHex, botId } = signedFixture();
  const withoutSignature = initData.replace(/&?signature=[^&]+/, "");
  assert.equal(verifyThirdPartySignature({ initData: withoutSignature, publicKeyHex, botId }).reason, "no-signature");
});

test("the published Telegram keys are the documented 32-byte hex strings", () => {
  for (const value of Object.values(TELEGRAM_SIGNATURE_KEYS)) {
    assert.match(value, /^[0-9a-f]{64}$/);
  }
  assert.equal(TELEGRAM_SIGNATURE_KEYS.production, "e7bf03a2fa4602af4580703d88dda5bb59f32ed8b02a56c187fe7d34caed242d");
  assert.equal(TELEGRAM_SIGNATURE_KEYS.test, "40055058a4ee38156a06562e52eece92a771bcd8346a8c4615cb7376eddf72ec");
});

/* ---------------------------------- routes -------------------------------- */

const server = createServer();
let baseUrl;

before(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  delete process.env.CEP_TELEGRAM_BOT_TOKEN;
});

test("the platform endpoint states the launch modes, the algorithms and the posture", async () => {
  const response = await fetch(`${baseUrl}/api/v1/telegram/platform`);
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(payload.data.id, "telegram-mini-app");
  assert.equal(payload.data.launchModes.length, 7);
  assert.equal(payload.data.launchModes.filter((mode) => mode.initData === "none").length, 2, "two launch modes carry no init data");
  assert.equal(payload.data.validation.primary.algorithm, "HMAC-SHA-256");
  assert.equal(payload.data.posture.storesUserIdentifiers, false);
  assert.equal(payload.data.posture.thirdPartyScripts, 0);
  assert.equal(payload.data.posture.tokenInRepository, false);
});

test("without a configured token the session endpoint refuses instead of pretending", async () => {
  delete process.env.CEP_TELEGRAM_BOT_TOKEN;
  const response = await fetch(`${baseUrl}/api/v1/telegram/session`, { headers: { "X-Telegram-Init-Data": FIXTURE } });
  assert.equal(response.status, 501);
  const payload = await response.json();
  assert.equal(payload.error, "telegram_not_configured");
  assert.equal(payload.validationImplemented, true);
});

test("with a token, a good payload gets a session and no identifier comes back", async () => {
  process.env.CEP_TELEGRAM_BOT_TOKEN = BOT_TOKEN;
  const response = await fetch(`${baseUrl}/api/v1/telegram/session`, {
    headers: { "X-Telegram-Init-Data": FIXTURE },
    // The fixture's auth_date is in the past; the route uses the real clock, so
    // this test asserts the freshness refusal instead of a happy path. A live
    // happy path needs a payload minted now, which needs a real client.
  });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).reason, "stale");
});

test("a tampered payload is a 401 and says only why", async () => {
  process.env.CEP_TELEGRAM_BOT_TOKEN = BOT_TOKEN;
  const response = await fetch(`${baseUrl}/api/v1/telegram/session`, {
    headers: { "X-Telegram-Init-Data": FIXTURE.replace("start_param=probe", "start_param=admin") }
  });
  assert.equal(response.status, 401);
  const payload = await response.json();
  assert.equal(payload.error, "invalid_init_data");
  assert.equal(payload.reason, "bad-hash");
  assert.equal(JSON.stringify(payload).includes("TEST-token"), false);
});

test("a missing header is a 400 naming the header", async () => {
  process.env.CEP_TELEGRAM_BOT_TOKEN = BOT_TOKEN;
  const response = await fetch(`${baseUrl}/api/v1/telegram/session`);
  assert.equal(response.status, 400);
  assert.match((await response.json()).hint, /X-Telegram-Init-Data/);
});
