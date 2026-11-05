// HMMT monetary arithmetic tests.
//
// The point of these tests is not that the numbers are pretty: it is that the
// supply cannot be inflated by a headline figure, that no token can exist
// without a toman deposit, and that the two "coverage" questions stay distinct.
import assert from "node:assert/strict";
import test from "node:test";
import {
  ASSET_TIERS,
  HAIRCUT_POLICY,
  HMMT_DEFINITION,
  HMMT_INVARIANTS,
  REFERENCE_DATA,
  applyHaircuts,
  computeBasket,
  computeSupplyCeiling,
  convertTomanToHmmt,
  distributionPhases,
  proofOfReserve,
  redeemHmmtToToman
} from "../hmmt.mjs";

const basket = computeBasket();
const ceiling = computeSupplyCeiling({ basket });

test("one HMMT is exactly one trillion toman", () => {
  assert.equal(HMMT_DEFINITION.tomanPerToken, 1e12);
  assert.equal(HMMT_DEFINITION.decimals, 9);
  // Nine decimals with a 1,000-toman base unit keeps 1 HMMT = 1e12 toman.
  assert.equal(HMMT_DEFINITION.baseUnitToman * 10 ** HMMT_DEFINITION.decimals, 1e12);
  assert.match(HMMT_DEFINITION.nameFa, /هزار میلیارد تومان/);
});

test("the definition refuses to present itself as legal tender", () => {
  assert.equal(HMMT_DEFINITION.status, "proposed-design");
  assert.match(HMMT_DEFINITION.legalPosture.en, /not legal tender/i);
  assert.match(HMMT_DEFINITION.legalPosture.en, /no governmental body/i);
});

test("every reference figure carries a source, a date and a status", () => {
  for (const source of REFERENCE_DATA.sources) {
    assert.ok(source.status, `${source.id} has no status`);
    assert.ok(source.asOf, `${source.id} has no date`);
    assert.ok(source.value.fa && source.value.en, `${source.id} is not bilingual`);
    assert.ok(["audited", "source-reported", "unverified-estimate"].includes(source.status), source.id);
  }
  assert.equal(REFERENCE_DATA.oilReservesBillionBarrels, 208.6);
  assert.equal(REFERENCE_DATA.fxFreeMarketTomanPerUsd, 269305);
});

test("an in-situ resource headline survives the haircut chain at a few percent", () => {
  const resources = basket.lines.find((line) => line.tierId === "T3");
  assert.ok(resources.steps.length >= 5, "the chain must be visible step by step");
  // 27.3 trillion in the ground is not 27.3 trillion of backing.
  assert.ok(basket.survivalRatio < 0.05, `survival ratio ${basket.survivalRatio} is too generous`);
  // The ratio is measured against the counted tier, not against a basket that
  // silently includes tiers contributing zero.
  assert.equal(basket.countedGrossUsd, 27.3e12);
  assert.ok(Math.abs(basket.survivalRatio - basket.netUsd / basket.countedGrossUsd) < 1e-5);
  assert.ok(basket.netUsd < 1e12, "net backing must be far below the gross figure");
  assert.ok(basket.netUsd > 1e11, "the chain must not annihilate the figure either");
});

test("haircut steps are ordered, monotonic and bilingual", () => {
  for (const line of basket.lines) {
    let previous = line.grossUsd;
    for (const step of line.steps) {
      // A verification multiplier of 0 is the excluded-tier case, not a bug.
      assert.ok(step.factor >= 0 && step.factor <= 1, `${line.tierId}/${step.id} factor out of range`);
      assert.ok(step.before >= step.after, `${line.tierId}/${step.id} increased the figure`);
      assert.ok(Math.abs(step.before - previous) < 1, `${line.tierId}/${step.id} does not continue the chain`);
      assert.ok(step.label.fa && step.label.en, `${line.tierId}/${step.id} is not bilingual`);
      previous = step.after;
    }
    assert.ok(Math.abs(previous - line.netUsd) < 1, `${line.tierId} net does not match its last step`);
  }
});

test("unverified tiers contribute nothing, however large they are", () => {
  const unverified = basket.lines.filter((line) => line.status === "unverified-estimate");
  assert.ok(unverified.length > 0);
  for (const line of unverified) {
    assert.equal(line.netUsd, 0, `${line.tierId} contributed without verification`);
    assert.equal(line.counted, false);
  }
  assert.deepEqual(basket.excludedTiers, ["T1", "T2"]);
});

test("GDP and private wealth are reported but excluded from backing", () => {
  assert.equal(basket.gdpExcluded.valueUsd, REFERENCE_DATA.gdpUsd);
  assert.equal(basket.privateWealthExcluded.valueUsd, REFERENCE_DATA.householdWealthUsd);
  assert.match(basket.gdpExcluded.reason.en, /flow/i);
  assert.match(basket.privateWealthExcluded.reason.en, /not a public asset/i);
  const counted = basket.lines.filter((line) => line.counted).reduce((sum, line) => sum + line.grossUsd, 0);
  assert.equal(counted, ASSET_TIERS.find((tier) => tier.id === "T3").grossUsd);
  assert.equal(basket.grossUsd, 27.435e12);
});

test("the ceiling follows from the net basket and the FX rate, not from a chosen round number", () => {
  const expected = Math.floor(basket.netUsd / (1e12 / REFERENCE_DATA.fxFreeMarketTomanPerUsd));
  assert.equal(ceiling.ceilingTokens, expected);
  assert.ok(ceiling.ceilingTokens > 100000 && ceiling.ceilingTokens < 300000, "ceiling should land near 190k HMMT");
  assert.ok(ceiling.usdPerToken > 3.5e6 && ceiling.usdPerToken < 4e6);
  // A weaker toman lowers the dollar value of one token, so the same USD
  // backing covers more tokens. That is unit conversion, not new value: the
  // ceiling's dollar value is unchanged, and the token ceiling may only be
  // re-stated through governance (see the timelock invariant).
  const weaker = computeSupplyCeiling({ basket, fxRate: REFERENCE_DATA.fxFreeMarketTomanPerUsd * 2 });
  assert.ok(weaker.ceilingTokens > ceiling.ceilingTokens);
  assert.ok(Math.abs(weaker.fractionalTokens / ceiling.fractionalTokens - 2) < 1e-4);
});

test("gross headlines cannot be used to inflate the ceiling", () => {
  const naive = computeSupplyCeiling({ basket: { netUsd: basket.grossUsd } });
  assert.ok(naive.ceilingTokens > ceiling.ceilingTokens * 30, "the haircut chain must bind");
});

test("conversion mints tokens only against toman, and charges a visible fee", () => {
  const result = convertTomanToHmmt({ toman: 1e15, ceilingTokens: ceiling.ceilingTokens });
  assert.equal(result.allowed, true);
  assert.equal(result.grossTokens, 1000);
  assert.equal(result.feeBps, 20);
  assert.equal(result.feeTokens, 2);
  assert.equal(result.netTokens, 998);
  assert.ok(result.reserveRequiredUsd > 3.7e9);
  assert.match(result.note.en, /balance-sheet exchange/i);
});

test("the fee survives rounding on a per-person-sized conversion", () => {
  const result = convertTomanToHmmt({ toman: 5e10, ceilingTokens: ceiling.ceilingTokens });
  assert.equal(result.grossTokens, 0.05);
  assert.equal(result.feeTokens, 0.0001);
  assert.equal(result.netTokens, 0.0499);
});

test("conversion is refused once the ceiling binds, with a reason", () => {
  const result = convertTomanToHmmt({ toman: 1e18, ceilingTokens: ceiling.ceilingTokens });
  assert.equal(result.allowed, false);
  assert.equal(result.code, "ceiling-reached");
  assert.ok(result.capacity > 0);
  assert.match(result.reason.fa, /ظرفیت/);
});

test("zero or negative deposits mint nothing", () => {
  for (const toman of [0, -1, Number.NaN, undefined]) {
    const result = convertTomanToHmmt({ toman, ceilingTokens: ceiling.ceilingTokens });
    assert.equal(result.allowed, false);
    assert.equal(result.code, "invalid-amount");
  }
});

test("redemption returns toman and burns the token", () => {
  const result = redeemHmmtToToman({ tokens: 100, circulatingTokens: 1000, tomanReserve: 1e15 });
  assert.equal(result.allowed, true);
  assert.equal(result.grossToman, 100e12);
  assert.equal(result.feeToman, 0.2e12);
  assert.equal(result.netToman, 99.8e12);
  assert.equal(result.newCirculatingTokens, 900);
});

test("redemption is queued rather than blocked when the reserve is short", () => {
  const queued = redeemHmmtToToman({ tokens: 500, circulatingTokens: 1000, tomanReserve: 1e12 });
  assert.equal(queued.allowed, false);
  assert.equal(queued.code, "queue");
  assert.equal(queued.limit, "reserve");
  assert.ok(queued.queuedToman > 0);
  assert.match(queued.reason.en, /redemption queue/i);
});

test("the daily cash window queues a request even when the reserve is ample", () => {
  const queued = redeemHmmtToToman({ tokens: 50, circulatingTokens: 1000, tomanReserve: 1e15, cashWindowToman: 40e12 });
  assert.equal(queued.code, "queue");
  assert.equal(queued.limit, "cash-window");
  assert.equal(queued.availableToman, 40e12);
  // Inside the window the same bank pays immediately.
  assert.equal(redeemHmmtToToman({ tokens: 5, circulatingTokens: 1000, tomanReserve: 1e15, cashWindowToman: 40e12 }).code, "redeemed");
});

test("redeeming more than the circulating supply is refused", () => {
  const result = redeemHmmtToToman({ tokens: 2000, circulatingTokens: 1000 });
  assert.equal(result.code, "exceeds-circulating");
});

test("proof of reserve keeps the toman question and the asset question apart", () => {
  const healthy = proofOfReserve({ circulatingTokens: 1000, tomanReserve: 1e15, ceilingTokens: ceiling.ceilingTokens, netBackingUsd: basket.netUsd });
  assert.equal(healthy.status, "healthy");
  assert.ok(Math.abs(healthy.reserveRatio - 1) < 1e-6);
  assert.ok(Math.abs(healthy.assetCoverage - 1) < 1e-4);
  assert.ok(healthy.utilisation <= 0.01);

  const thinReserve = proofOfReserve({ circulatingTokens: 1000, tomanReserve: 5e14, ceilingTokens: ceiling.ceilingTokens, netBackingUsd: basket.netUsd });
  assert.equal(thinReserve.status, "reserve-shortfall");
  assert.ok(thinReserve.reserveRatio < 1);
  assert.equal(thinReserve.invariants.find((item) => item.id === "reserve-at-least-one").ok, false);

  const overIssued = proofOfReserve({ circulatingTokens: ceiling.ceilingTokens * 2, tomanReserve: 1e18, ceilingTokens: ceiling.ceilingTokens, netBackingUsd: basket.netUsd });
  assert.equal(overIssued.status, "asset-shortfall");
  assert.equal(overIssued.invariants.find((item) => item.id === "no-unbacked-mint").ok, false);
});

test("distribution is phase-gated, cumulative and never exceeds the ceiling", () => {
  const phases = distributionPhases({ ceilingTokens: ceiling.ceilingTokens });
  assert.deepEqual(phases.map((phase) => phase.id), ["P0", "P1", "P2", "P3"]);
  assert.equal(phases.at(-1).cumulativeTokens, ceiling.ceilingTokens);
  for (let index = 1; index < phases.length; index += 1) {
    assert.ok(phases[index].cumulativeTokens > phases[index - 1].cumulativeTokens);
    assert.ok(phases[index].gate.fa && phases[index].gate.en, `${phases[index].id} has no gate`);
  }
  assert.equal(phases[0].perPersonCapTokens, 0.05);
});

test("the invariants that must never bend are stated in both languages", () => {
  assert.ok(HMMT_INVARIANTS.length >= 6);
  const ids = HMMT_INVARIANTS.map((item) => item.id);
  for (const required of ["mint-only-against-deposit", "no-premine", "gdp-not-backing", "redemption-never-frozen", "no-identity-on-chain"]) {
    assert.ok(ids.includes(required), `missing invariant ${required}`);
  }
  for (const invariant of HMMT_INVARIANTS) {
    assert.ok(invariant.fa.length > 10 && invariant.en.length > 10, invariant.id);
  }
});

test("the haircut policy is a labelled draft with an authorising record", () => {
  assert.equal(HAIRCUT_POLICY.status, "proposed-configurable");
  assert.match(HAIRCUT_POLICY.authorizedBy, /^DEC-SYN-/);
  for (const step of HAIRCUT_POLICY.steps) {
    assert.ok(step.rationale.fa && step.rationale.en, `${step.id} has no rationale`);
    assert.ok(step.appliesTo.length > 0, `${step.id} applies to nothing`);
  }
});

test("a tier with no source cannot be audited into the ceiling", () => {
  const fabricated = applyHaircuts({ id: "T9", name: { fa: "نامعلوم", en: "Unknown" }, grossUsd: 1e15, status: "unverified-estimate" }, HAIRCUT_POLICY);
  assert.equal(fabricated.netUsd, 0);
  assert.equal(fabricated.counted, false);
});
