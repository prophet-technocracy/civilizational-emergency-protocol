// Transport contract for the read-only demo API.
//
// Every /api/v1 response is wrapped in the same envelope. The interface relies
// on this in three places, so it is enforced here instead of being trusted:
//   1. the epistemic notice shown on every module view,
//   2. the "synthetic demo" badge in the shell,
//   3. the guarantee that no payload carries a living-person record.
//
// Nothing in this module talks to the network: it validates a parsed payload.

export const ENVELOPE_MODE = "synthetic-demo";

/** Fields that must never appear anywhere in a demo payload. */
const FORBIDDEN_KEYS = [
  "national_id",
  "social_security_number",
  "biometric_template",
  "home_address",
  "personal_phone",
  "passport_number",
  "bank_account"
];

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const isLocalizedText = (value) =>
  isPlainObject(value) &&
  typeof value.fa === "string" &&
  value.fa.length > 0 &&
  typeof value.en === "string" &&
  value.en.length > 0;

/**
 * Deep scan for personal-data keys, a "living" record status, or an
 * external URL that would leak a request off the local demonstrator.
 */
function findViolation(value, path = "$") {
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const violation = findViolation(value[index], `${path}[${index}]`);
      if (violation) return violation;
    }
    return null;
  }

  if (!isPlainObject(value)) return null;

  for (const [key, nested] of Object.entries(value)) {
    if (FORBIDDEN_KEYS.includes(key)) return `${path}.${key} carries a personal-data field`;
    if (key === "status" && nested === "living") return `${path}.status is a living-person record`;
    if (key === "isLiving" && nested === true) return `${path}.isLiving contradicts the exclusion rule`;
    const violation = findViolation(nested, `${path}.${key}`);
    if (violation) return violation;
  }

  return null;
}

/**
 * Validates the shared response envelope.
 *
 * @returns {{valid: boolean, errors: string[]}}
 */
export function validateEnvelope(payload) {
  const errors = [];

  if (!isPlainObject(payload)) {
    return { valid: false, errors: ["payload is not an object"] };
  }

  if (payload.mode !== ENVELOPE_MODE) {
    errors.push(`mode must be "${ENVELOPE_MODE}"`);
  }
  if (typeof payload.schemaVersion !== "string" || payload.schemaVersion.length === 0) {
    errors.push("schemaVersion is required");
  }
  if (typeof payload.generatedAt !== "string" || Number.isNaN(Date.parse(payload.generatedAt))) {
    errors.push("generatedAt must be an ISO timestamp");
  }
  if (!isLocalizedText(payload.epistemicNotice)) {
    errors.push("epistemicNotice must be bilingual {fa, en}");
  }
  if (!("data" in payload)) {
    errors.push("data is required");
  }

  const violation = findViolation(payload);
  if (violation) errors.push(violation);

  return { valid: errors.length === 0, errors };
}

/**
 * Parses a Response object (or a Response-like test double) into a payload,
 * rejecting anything that does not satisfy the envelope contract.
 */
export async function readApiResponse(response) {
  if (!response?.ok) {
    const status = response?.status ?? "network";
    throw new Error(`API request failed (${status})`);
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error("API response was not valid JSON");
  }

  const { valid, errors } = validateEnvelope(payload);
  if (!valid) throw new Error(`Unexpected API payload: ${errors.join("; ")}`);
  return payload;
}

/** Convenience guard for a payload that is already parsed (SSR, tests). */
export function isApiPayload(payload) {
  return validateEnvelope(payload).valid;
}
