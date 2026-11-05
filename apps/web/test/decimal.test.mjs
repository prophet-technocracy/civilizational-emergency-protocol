// The amount field is a teaching instrument: a wrong parse changes the meaning
// of the refusal the simulator shows, so every accepted input must equal the
// value the interface displays. These cases are the ones from issue #28.
import assert from "node:assert/strict";
import { test } from "node:test";
import { parseDecimalInput, toLatinDigits } from "../src/lib/decimal.mjs";

const accepted = (input, value) => {
  const result = parseDecimalInput(input);
  assert.equal(result.ok, true, `expected ${JSON.stringify(input)} to be accepted, got ${result.reason}`);
  assert.equal(result.value, value, `${JSON.stringify(input)} parsed as ${result.value}`);
};

const refused = (input, reason) => {
  const result = parseDecimalInput(input);
  assert.equal(result.ok, false, `expected ${JSON.stringify(input)} to be refused`);
  assert.equal(result.reason, reason);
};

test("digits from all three scripts become Latin digits", () => {
  assert.equal(toLatinDigits("۰۱۲۳۴۵۶۷۸۹"), "0123456789");
  assert.equal(toLatinDigits("٠١٢٣٤٥٦٧٨٩"), "0123456789");
  assert.equal(toLatinDigits("0.5 HMMT"), "0.5 HMMT");
});

test("a plain decimal is accepted in every script", () => {
  accepted("0.05", 0.05);
  accepted("۰٫۰۵", 0.05);
  accepted("٠٫٥", 0.5);
  accepted("10", 10);
  accepted("۱۰۰۰", 1000);
  accepted("  2.5  ", 2.5);
  accepted("0.000001", 0.000001);
});

test("grouping is accepted only where it is unambiguous", () => {
  accepted("1,000,000", 1_000_000);
  accepted("۱٬۰۰۰٬۰۰۰", 1_000_000);
  accepted("1 000 000", 1_000_000);
  accepted("1\u00A0000\u00A0000", 1_000_000);
  accepted("1\u200C000\u200C000", 1_000_000);

  // A European decimal comma with two digits after it is a decimal, not grouping.
  accepted("0,05", 0.05);
  accepted("1,000.50", 1000.5);
  accepted("1.000,50", 1000.5);
});

test("a separator followed by exactly three digits is refused, not guessed", () => {
  // This is the 1000x bug: "1,000" used to parse as 1.
  refused("1,000", "ambiguous-separator");
  refused("1.000", "ambiguous-separator");
  refused("10,500", "ambiguous-separator");
});

test("empty, non-numeric, zero and negative inputs each say why", () => {
  refused("", "empty");
  refused("   ", "empty");
  refused("abc", "not-a-number");
  refused("0.05 HMMT", "not-a-number");
  refused("1/2", "not-a-number");
  refused("-1", "not-a-number");
  refused("0", "zero-or-negative");
  refused("0.0", "zero-or-negative");
  refused("۰", "zero-or-negative");
  refused("1,2,3", "ambiguous-separator");
});

test("no accepted input is silently reinterpreted", () => {
  for (const input of ["0.05", "۰٫۰۵", "1,000,000", "1 000 000", "0,05", "1234.5"]) {
    const result = parseDecimalInput(input);
    assert.equal(result.ok, true);
    // The displayed number is the parsed number: `normalized` is what the
    // interface prints, so it must round-trip to the same value.
    assert.equal(Number(result.normalized), result.value);
    assert.equal(String(result.value), String(Number(result.normalized)));
  }
});

test("the parser is usable for any free-text numeric field, not just the bank", () => {
  // The level-4 spend field takes the same inputs (see #48).
  assert.deepEqual(parseDecimalInput("۲۵۰"), { ok: true, value: 250, normalized: "250" });
});
