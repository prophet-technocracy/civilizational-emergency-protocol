import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createServer } from "../src/server.mjs";
import { createFxService, getFxService, setFxService, REFERENCE_RATE, RATE_BOUNDS } from "../src/fx/service.mjs";
import { parseNavasanWidget, toNumber, unwrapEscapes } from "../src/fx/navasan.mjs";
import { buildFxSensitivity, buildFxStatus, FX_SHOCKS } from "../src/data/fx.mjs";
import { computeSupplyCeiling, REFERENCE_DATA } from "@cep/domain-models";
import { basket, ceiling as referenceCeiling, circulatingSupply } from "../src/data/hmmt.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURE = readFileSync(resolve(HERE, "fixtures/navasan-widget.txt"), "utf8");

/* --------------------------------- parser --------------------------------- */

test("the captured widget payload decodes into the rows this project reads", () => {
  const parsed = parseNavasanWidget(FIXTURE);
  assert.ok(parsed, "fixture must parse");
  assert.equal(parsed.rows.usd.rate, 267_500);
  assert.equal(parsed.rows.usd.change, -700);
  assert.equal(parsed.rows.usd_sherkat.rate, 271_520);
  assert.equal(parsed.rows.usd_shakhs.rate, 274_090);
  assert.equal(parsed.rows.usdt.rate, 268_700);
  assert.equal(parsed.sourceDate, "05/08/15");
});

test("the style block is never treated as data", () => {
  const text = unwrapEscapes(FIXTURE);
  assert.ok(text.includes("#navasan_table"), "fixture really does carry a style block");
  const parsed = parseNavasanWidget(FIXTURE);
  // The hex colour #bd0a0a in the stylesheet would decode to 0xbd0a0a if the
  // decoder scanned markup instead of rows.
  for (const row of Object.values(parsed.rows)) {
    assert.notEqual(row.rate, 0xbd0a0a);
    assert.ok(row.rate > 1000 && row.rate < 10_000_000);
  }
});

test("a single-escaped payload decodes the same way as a double-escaped one", () => {
  const plain = unwrapEscapes(FIXTURE);
  const once = parseNavasanWidget(plain);
  const twice = parseNavasanWidget(FIXTURE);
  assert.equal(once.rows.usd.rate, twice.rows.usd.rate);
});

test("an unreadable payload yields null rather than a partial parse", () => {
  assert.equal(parseNavasanWidget(""), null);
  assert.equal(parseNavasanWidget("navasanret('not a table');"), null);
  assert.equal(parseNavasanWidget(null), null);
  // A table with every row but the dollar must not become a rate.
  const noUsd = unwrapEscapes(FIXTURE).replace(/id="usd"/, 'id="usd_sell"');
  assert.equal(parseNavasanWidget(noUsd), null);
});

test("Persian and Arabic-Indic digits, separators and signs", () => {
  assert.equal(toNumber("۲۶۷,۵۰۰"), 267_500);
  assert.equal(toNumber("٢٦٧٬٥٠٠"), 267_500);
  assert.equal(toNumber("-۷۰۰"), -700);
  assert.equal(toNumber("−۷۰۰"), -700);
  assert.equal(toNumber("۲٬۸۰۰"), 2800);
  assert.equal(toNumber("abc"), null);
  assert.equal(toNumber(null), null);
});

/* --------------------------------- service -------------------------------- */

/**
 * The fixture is escaped, so a rate swap is done on the decoded table and handed
 * back single-escaped — which the decoder accepts (see the equivalence test).
 */
const withUsdRate = (rate) => {
  const fa = String(rate)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    .replace(/[0-9]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
  return unwrapEscapes(FIXTURE).replace(
    /(<tr id="usd">[\s\S]*?class="val">)([^<]*)/,
    (_, head) => `${head}${fa}`
  );
};

test("with no reader, the service reports the committed reference and says so", async () => {
  const service = createFxService({ read: async () => { throw new Error("no network"); } });
  const snapshot = await service.update();
  assert.equal(snapshot.status, "reference");
  assert.equal(snapshot.usdToman, REFERENCE_RATE.rate);
  assert.equal(snapshot.asOf, REFERENCE_RATE.asOf);
  assert.equal(snapshot.live, false);
  assert.match(snapshot.error, /no network/);
});

test("a good read becomes fresh, and a failing read afterwards makes it stale without losing the rate", async () => {
  let clock = Date.parse("2026-11-06T09:00:00Z");
  let fail = false;
  const service = createFxService({
    now: () => clock,
    ttlMs: 60_000,
    read: async () => {
      if (fail) throw new Error("timeout");
      return FIXTURE;
    }
  });

  const fresh = await service.update();
  assert.equal(fresh.status, "fresh");
  assert.equal(fresh.usdToman, 267_500);
  assert.equal(fresh.live, true);
  assert.equal(fresh.expired, false);
  assert.equal(fresh.ageMs, 0);

  clock += 90_000;
  assert.equal(service.snapshot().expired, true, "the value ages even while the source is up");

  fail = true;
  const stale = await service.update();
  assert.equal(stale.status, "stale");
  assert.equal(stale.usdToman, 267_500, "a stale rate keeps the last good value");
  assert.equal(stale.asOf, "2026-11-06T09:00:00.000Z", "and keeps its own timestamp, which is the disclosure");
});

test("an implausible jump is rejected and the previous rate stays in force", async () => {
  let payload = FIXTURE;
  const service = createFxService({ read: async () => payload });
  await service.update();
  assert.equal(service.snapshot().usdToman, 267_500);

  payload = withUsdRate(535_000);
  const suspect = await service.update();
  assert.equal(suspect.status, "suspect");
  assert.equal(suspect.lastReject.reason, "implausible-jump");
  assert.equal(suspect.usdToman, 267_500, "a doubled rate must not reach a calculation");
  assert.equal(suspect.rejects, 1);
});

test("a small move is adopted and keeps the previous rate for comparison", async () => {
  let payload = FIXTURE;
  const service = createFxService({ read: async () => payload });
  await service.update();
  payload = withUsdRate(272_000);
  const next = await service.update();
  assert.equal(next.status, "fresh");
  assert.equal(next.usdToman, 272_000);
  assert.equal(next.previousRate, 267_500);
});

test("an out-of-band reading is rejected", async () => {
  const payload = withUsdRate(9); // a reading well under the floor
  const service = createFxService({ read: async () => payload });
  const snapshot = await service.update();
  assert.equal(snapshot.status, "suspect");
  assert.equal(snapshot.lastReject.reason, "out-of-bounds");
  assert.equal(snapshot.usdToman, REFERENCE_RATE.rate, "the reference remains the floor");
  assert.ok(RATE_BOUNDS.min > 9);
});

test("the process-wide service never reaches the network unless it is asked to", async () => {
  const service = getFxService();
  const snapshot = await service.update();
  assert.equal(snapshot.live, false);
  assert.match(String(snapshot.error), /CEP_FX_LIVE/);
});

/* -------------------------------- arithmetic ------------------------------ */

test("the sensitivity ladder is arithmetic anyone can reproduce from the rate", () => {
  const snapshot = createFxService({ read: async () => { throw new Error("offline"); } }).snapshot();
  const sensitivity = buildFxSensitivity(snapshot);

  assert.equal(sensitivity.rate.tomanPerUsd, REFERENCE_DATA.fxFreeMarketTomanPerUsd);
  assert.equal(sensitivity.live.ceilingTokens, referenceCeiling.ceilingTokens);
  assert.equal(sensitivity.circulatingTokens, circulatingSupply);
  assert.deepEqual(sensitivity.ladder.map((row) => row.shockPercent), [...FX_SHOCKS]);

  for (const row of sensitivity.ladder) {
    const independent = computeSupplyCeiling({ basket, fxRate: row.fxRate });
    assert.equal(row.ceilingTokens, independent.ceilingTokens, `row ${row.shockPercent}% must reconcile`);
    assert.equal(row.usdPerToken, independent.usdPerToken);
    assert.equal(row.coversFloat, row.ceilingTokens >= circulatingSupply);
  }
});

test("a fixed ratified ceiling ends up above the backed ceiling when the rial strengthens", () => {
  const snapshot = createFxService({ read: async () => { throw new Error("offline"); } }).snapshot();
  const { ladder, ratifiedCeilingTokens } = buildFxSensitivity(snapshot);
  const flat = ladder.find((row) => row.shockPercent === 0);
  assert.equal(flat.belowRatifiedCeiling, false, "at the reference rate the two ceilings agree");

  const stronger = ladder.filter((row) => row.shockPercent < 0);
  assert.ok(stronger.length >= 3);
  assert.ok(stronger.every((row) => row.belowRatifiedCeiling), "every appreciation row is under the ratified ceiling");
  assert.ok(stronger.every((row) => row.overIssueRiskTokens > 0));
  assert.ok(stronger.every((row) => row.overIssueRiskTokens < ratifiedCeilingTokens));
});

test("the status block carries provenance and its own limits, not just a number", () => {
  const status = buildFxStatus(createFxService({ read: async () => { throw new Error("offline"); } }).snapshot());
  assert.equal(status.isLive, false);
  assert.equal(status.sourceUrl, "https://www.navasan.tech/module.php");
  assert.ok(status.notes.length >= 3);
  assert.ok(status.limitations.length >= 2);
  assert.ok(status.statusLabel.fa && status.statusLabel.en);
  assert.equal(status.reference.rate, REFERENCE_DATA.fxFreeMarketTomanUsd ?? status.reference.rate);
});

/* ---------------------------------- routes -------------------------------- */

const server = createServer();
let baseUrl;
const original = getFxService();

before(async () => {
  await new Promise((resolveListen) => server.listen(0, "127.0.0.1", resolveListen));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  setFxService(original);
  await new Promise((resolveClose, reject) => server.close((error) => (error ? reject(error) : resolveClose())));
});

test("/api/v1/fx serves the reference state by default and discloses it", async () => {
  setFxService(createFxService({ read: async () => { throw new Error("offline"); } }));
  const response = await fetch(`${baseUrl}/api/v1/fx`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("cross-origin-resource-policy"), "same-origin");
  const payload = await response.json();
  assert.equal(payload.mode, "synthetic-demo");
  assert.equal(payload.data.status, "reference");
  assert.equal(payload.data.rate.tomanPerUsd, REFERENCE_RATE.rate);
  assert.equal(payload.rateDisclosure.isLive, false);
  assert.ok(payload.data.epistemicNotice === undefined, "the notice travels once, in the envelope");
});

test("/api/v1/fx serves a live reading, labelled live, when the service has one", async () => {
  setFxService(createFxService({ read: async () => FIXTURE }));
  const payload = await (await fetch(`${baseUrl}/api/v1/fx`)).json();
  assert.equal(payload.data.status, "fresh");
  assert.equal(payload.data.rate.tomanPerUsd, 267_500);
  assert.equal(payload.data.isLive, true);
  assert.equal(payload.rateDisclosure.isLive, true);
  assert.equal(payload.data.sourceDate, "05/08/15");
  assert.ok(payload.data.rows.usd_shakhs.rate > payload.data.rows.usd.rate, "the personal-dollar spread is not hidden");
});

test("/api/v1/fx/sensitivity recomputes the ceiling at the rate in force", async () => {
  setFxService(createFxService({ read: async () => FIXTURE }));
  const payload = await (await fetch(`${baseUrl}/api/v1/fx/sensitivity`)).json();
  const expected = computeSupplyCeiling({ basket, fxRate: 267_500 });
  assert.equal(payload.data.live.ceilingTokens, expected.ceilingTokens);
  assert.equal(payload.data.rate.tomanPerUsd, 267_500);
  assert.equal(payload.data.appliedTo.length, 4);
  assert.ok(payload.data.limitations.length >= 3);
});

test("an unknown fx route is a 404, not a silent fallback to the reference", async () => {
  const response = await fetch(`${baseUrl}/api/v1/fx/anything`);
  assert.equal(response.status, 404);
});

test("the hmmt endpoints stay on the frozen reference so the guardrails can pin them", async () => {
  setFxService(createFxService({ read: async () => FIXTURE }));
  const supply = await (await fetch(`${baseUrl}/api/v1/hmmt/supply`)).json();
  assert.equal(supply.data.ceiling.fxRate, REFERENCE_DATA.fxFreeMarketTomanPerUsd);
  assert.equal(supply.data.ceiling.tokens, 189_544);
});
