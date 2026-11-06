// Validating `initData` — the only part of a Telegram Mini App that is a
// security boundary.
//
// Everything the client says about itself is attacker-controlled except this:
// a query string that Telegram signed. The platform documentation is explicit
// that `initDataUnsafe` must never be trusted and that `initData` must be
// validated on the server before use. This module is that validation, in two
// forms:
//
//   verifyInitData              HMAC-SHA-256, for us, with our bot token.
//   verifyThirdPartySignature   Ed25519, for anyone we hand data to, using the
//                               public key Telegram publishes.
//
// Pure and dependency-free apart from `node:crypto`: no network, no storage, no
// clock of its own. The route that calls it is deliberately dumb.
//
// Two rules that will look pedantic until they are not:
//
//   * The `hash` is compared in constant time. An HMAC compared with `===` is a
//     timing oracle, and this is the one place in the project where an attacker
//     can iterate.
//   * Duplicate keys are rejected rather than resolved. If `user` appears twice,
//     two correct implementations can disagree about which one was signed —
//     which is exactly the confusion a forged payload wants.

import { createHmac, createPublicKey, timingSafeEqual, verify as verifySignature } from "node:crypto";

/** The public keys Telegram publishes for third-party validation (Bot API 8.0+). */
export const TELEGRAM_SIGNATURE_KEYS = Object.freeze({
  production: "e7bf03a2fa4602af4580703d88dda5bb59f32ed8b02a56c187fe7d34caed242d",
  test: "40055058a4ee38156a06562e52eece92a771bcd8346a8c4615cb7376eddf72ec"
});

/** A day-old signed statement is a replay waiting to happen. */
export const DEFAULT_MAX_AGE_SECONDS = 86_400;

/** Long enough for any real payload, short enough to refuse a nuisance. */
const MAX_INIT_DATA_LENGTH = 8_192;

/**
 * Parse the raw query string into fields plus the signature material.
 * @returns {{ok: true, fields: Record<string,string>, order: string[], hash: string|null, signature: string|null} | {ok: false, reason: string}}
 */
export function parseInitData(raw) {
  if (typeof raw !== "string" || raw.trim() === "") return { ok: false, reason: "missing" };
  if (raw.length > MAX_INIT_DATA_LENGTH) return { ok: false, reason: "too-long" };

  let params;
  try {
    params = new URLSearchParams(raw);
  } catch {
    return { ok: false, reason: "malformed" };
  }

  const fields = {};
  const order = [];
  for (const [key, value] of params.entries()) {
    if (Object.hasOwn(fields, key)) return { ok: false, reason: "duplicate-field" };
    if (key === "") return { ok: false, reason: "malformed" };
    fields[key] = value;
    order.push(key);
  }

  const hash = fields.hash ?? null;
  const signature = fields.signature ?? null;
  delete fields.hash;
  delete fields.signature;

  return { ok: true, fields, order, hash, signature };
}

/**
 * The data-check-string: every field as `key=value`, sorted by key, joined with
 * a line feed. `exclude` lets the third-party form leave out `hash`/`signature`
 * (they are already removed) and prepend its own prefix.
 */
export function dataCheckString(fields, { prefix = "" } = {}) {
  const body = Object.keys(fields)
    .sort()
    .map((key) => `${key}=${fields[key]}`)
    .join("\n");
  return prefix ? `${prefix}\n${body}` : body;
}

/** hex(HMAC_SHA256(key = HMAC_SHA256(key = "WebAppData", msg = token), msg = checkString)) */
export function computeHash(checkString, botToken) {
  const secret = createHmac("sha256", "WebAppData").update(botToken, "utf8").digest();
  return createHmac("sha256", secret).update(checkString, "utf8").digest("hex");
}

function equalHex(left, right) {
  if (typeof left !== "string" || typeof right !== "string") return false;
  if (left.length !== right.length || left.length === 0) return false;
  try {
    return timingSafeEqual(Buffer.from(left, "hex"), Buffer.from(right, "hex"));
  } catch {
    return false;
  }
}

/**
 * Validate a payload we received from our own Mini App.
 *
 * @param {object} options
 * @param {string} options.initData raw `Telegram.WebApp.initData`
 * @param {string} options.botToken the bot token; never logged, never returned
 * @param {number} [options.now] milliseconds since epoch
 * @param {number} [options.maxAgeSeconds]
 * @returns {{ok: true, data: {authDate: number, ageSeconds: number, startParam: string|null, chatType: string|null, queryId: string|null, userId: number|null, languageCode: string|null}} | {ok: false, reason: string}}
 */
export function verifyInitData({
  initData,
  botToken,
  now = Date.now(),
  maxAgeSeconds = DEFAULT_MAX_AGE_SECONDS
} = {}) {
  if (typeof botToken !== "string" || botToken === "") return { ok: false, reason: "no-token" };

  const parsed = parseInitData(initData);
  if (!parsed.ok) return { ok: false, reason: parsed.reason };
  if (!parsed.hash) return { ok: false, reason: "no-hash" };

  const expected = computeHash(dataCheckString(parsed.fields), botToken);
  if (!equalHex(expected, parsed.hash)) return { ok: false, reason: "bad-hash" };

  const authDate = Number(parsed.fields.auth_date);
  if (!Number.isFinite(authDate) || authDate <= 0) return { ok: false, reason: "no-auth-date" };

  const ageSeconds = Math.floor(now / 1000) - authDate;
  // A future timestamp is as suspect as an old one: it means a clock we do not
  // control, or a payload replayed from a different context.
  if (ageSeconds < -60) return { ok: false, reason: "clock-skew" };
  if (ageSeconds > maxAgeSeconds) return { ok: false, reason: "stale" };

  const user = readJson(parsed.fields.user);
  return {
    ok: true,
    data: {
      authDate,
      ageSeconds,
      startParam: parsed.fields.start_param ?? null,
      chatType: parsed.fields.chat_type ?? null,
      queryId: parsed.fields.query_id ?? null,
      // Returned to the caller, never persisted here: this project's rule is
      // that no module stores an identifier for a person (see the platform note).
      userId: Number.isFinite(user?.id) ? Number(user.id) : null,
      languageCode: typeof user?.language_code === "string" ? user.language_code : null
    }
  };
}

/**
 * Validate a payload handed to us by someone else, without their bot token.
 *
 * @param {object} options
 * @param {string} options.initData
 * @param {string|number} options.botId the bot whose Mini App produced the data
 * @param {string} [options.publicKeyHex] defaults to Telegram's production key
 * @param {number} [options.now]
 * @param {number} [options.maxAgeSeconds]
 */
export function verifyThirdPartySignature({
  initData,
  botId,
  publicKeyHex = TELEGRAM_SIGNATURE_KEYS.production,
  now = Date.now(),
  maxAgeSeconds = DEFAULT_MAX_AGE_SECONDS
} = {}) {
  if (botId === undefined || botId === null || String(botId) === "") return { ok: false, reason: "no-bot-id" };

  const parsed = parseInitData(initData);
  if (!parsed.ok) return { ok: false, reason: parsed.reason };
  if (!parsed.signature) return { ok: false, reason: "no-signature" };

  const checkString = dataCheckString(parsed.fields, { prefix: `${botId}:WebAppData` });
  let valid = false;
  try {
    const key = createPublicKey({
      key: { kty: "OKP", crv: "Ed25519", x: Buffer.from(publicKeyHex, "hex").toString("base64url") },
      format: "jwk"
    });
    valid = verifySignature(null, Buffer.from(checkString, "utf8"), key, Buffer.from(parsed.signature, "base64url"));
  } catch {
    return { ok: false, reason: "bad-signature-encoding" };
  }
  if (!valid) return { ok: false, reason: "bad-signature" };

  const authDate = Number(parsed.fields.auth_date);
  if (!Number.isFinite(authDate) || authDate <= 0) return { ok: false, reason: "no-auth-date" };
  const ageSeconds = Math.floor(now / 1000) - authDate;
  if (ageSeconds > maxAgeSeconds) return { ok: false, reason: "stale" };

  return {
    ok: true,
    data: { authDate, ageSeconds, startParam: parsed.fields.start_param ?? null, botId: String(botId) }
  };
}

function readJson(value) {
  if (typeof value !== "string" || value === "") return null;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}
