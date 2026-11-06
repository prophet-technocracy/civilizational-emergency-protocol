// The HMMT bank screen: supply ceiling, the haircut chain, proof of reserve,
// a conversion/redemption simulator and the synthetic ledger behind them.
//
// Every number on this page comes from the API payload. The screen deliberately
// shows the gross resource figure and the net backing figure side by side, so
// the haircut chain is never hidden behind a headline.
import { useMemo, useState } from "react";
import { useApi } from "../lib/api.js";
import { parseDecimalInput } from "../lib/decimal.mjs";
import { t, formatNumber, formatDate, formatRatio } from "../i18n.js";
import { localeStrings } from "../locales/index.js";
import { SectionHeader, Card, Callout, StateBlock, Badge, Stat, BarRow } from "../components/ui.jsx";

const numberFormat = (value, lang, digits = 2) => {
  // Coerce first: preset buttons pass numeric strings, and `Number.isFinite`
  // rejects a string, which silently rendered every preset as zero.
  const amount = Number(value);
  return new Intl.NumberFormat(lang === "fa" ? "fa-IR" : "en-US", { maximumFractionDigits: digits }).format(
    Number.isFinite(amount) ? amount : 0
  );
};

const UNIT = {
  fa: { tn: "تریلیون", bn: "میلیارد", m: "میلیون" },
  en: { tn: "tn", bn: "bn", m: "m" }
};

/** Compact money: 27.3 tn, 703.8 bn, 4.2 m. */
function compact(value, lang) {
  const units = UNIT[lang];
  const size = Math.abs(value);
  if (size >= 1e12) return `${numberFormat(value / 1e12, lang, 2)} ${units.tn}`;
  if (size >= 1e9) return `${numberFormat(value / 1e9, lang, 1)} ${units.bn}`;
  if (size >= 1e6) return `${numberFormat(value / 1e6, lang, 1)} ${units.m}`;
  return numberFormat(value, lang, 0);
}

const STATUS_TONE = { audited: "good", "source-reported": "info", "unverified-estimate": "warn" };
const RESERVE_TONE = { healthy: "good", "reserve-shortfall": "danger", "asset-shortfall": "warn" };
const dateOnly = (iso, lang) => {
  if (!iso) return "—";
  const value = String(iso);
  // A bare year is not an ISO date, and leaving it Latin would break the
  // Persian-numeral rule for one column only.
  if (/^\d{4}$/.test(value)) return formatNumber(Number(value), lang);
  return formatDate(value, lang);
};

function StatusLabel({ status, copy }) {
  return <Badge tone={STATUS_TONE[status] ?? "neutral"}>{copy.statuses[status] ?? status}</Badge>;
}

function DefinitionCard({ definition, copy, lang }) {
  const network = definition.network;
  return (
    <Card title={copy.definition.title}>
      <dl className="kv">
        <div className="kv__row">
          <dt>{copy.definition.name}</dt>
          <dd>
            <strong>{t({ fa: definition.nameFa, en: definition.nameEn }, lang)}</strong>
            <span className="mono muted"> · {definition.code}</span>
          </dd>
        </div>
        <div className="kv__row">
          <dt>{copy.definition.tomanPerToken}</dt>
          <dd className="mono">{numberFormat(definition.tomanPerToken, lang, 0)}</dd>
        </div>
        <div className="kv__row">
          <dt>{copy.definition.decimals}</dt>
          <dd className="mono">{formatNumber(definition.decimals, lang)}</dd>
        </div>
        <div className="kv__row">
          <dt>{copy.definition.baseUnit}</dt>
          <dd className="mono">
            {numberFormat(definition.baseUnitToman, lang, 0)} {lang === "fa" ? "تومان" : "toman"}
          </dd>
        </div>
        <div className="kv__row">
          <dt>{copy.definition.networkFirst}</dt>
          <dd>
            {network.firstStage.chain} · {network.firstStage.standard}
          </dd>
        </div>
        <div className="kv__row">
          <dt>{copy.definition.networkTarget}</dt>
          <dd>{copy.networks[network.targetStage.chain] ?? network.targetStage.chain}</dd>
        </div>
      </dl>
      <p className="card__subtitle">{copy.definition.pegNote}</p>
    </Card>
  );
}

function SupplySection({ supply, copy, lang }) {
  const { ceiling, circulating, phases, currentPhaseId } = supply;
  const currentPhase = phases.find((phase) => phase.id === currentPhaseId) ?? phases.at(-1);
  return (
    <section aria-labelledby="bank-supply">
      <div className="section-head">
        <div>
          <h2 id="bank-supply" className="h2">
            {copy.supply.title}
          </h2>
          <p className="lede">{copy.supply.lede}</p>
        </div>
      </div>

      <div className="grid grid--stats">
        <Stat
          label={copy.supply.ceiling}
          value={`${numberFormat(ceiling.tokens, lang, 0)} HMMT`}
          note={`${compact(ceiling.usdValue, lang)} ${copy.currency} · ${copy.supply.ceilingNote}`}
        />
        <Stat
          label={copy.supply.circulating}
          value={`${numberFormat(circulating.tokens, lang, 2)} HMMT`}
          note={`${compact(circulating.usdValue, lang)} ${copy.currency} · ${copy.supply.circulatingNote}`}
          tone="info"
        />
        <Stat
          label={copy.supply.utilisation}
          value={`${numberFormat(circulating.utilisation * 100, lang, 1)}٪`}
          note={`${copy.supply.remaining}: ${numberFormat(circulating.remainingTokens, lang, 0)} HMMT`}
        />
        <Stat
          label={copy.supply.phase}
          value={t(currentPhase.label, lang)}
          note={`${copy.supply.perPersonCap}: ${numberFormat(supply.perPersonCapTokens, lang, 2)} HMMT`}
        />
      </div>

      <div className="card">
        <BarRow
          lang={lang}
          label={copy.supply.circulating}
          value={circulating.tokens}
          max={ceiling.tokens}
          tone="info"
          // Two quantities read out in order, never as a slash (issue #60, checklist).
          display={`${formatRatio(circulating.tokens, ceiling.tokens, lang)} HMMT`}
        />
        <dl className="kv kv--inline">
          <div className="kv__row">
            <dt>{copy.supply.fxRate}</dt>
            <dd className="mono">
              {numberFormat(ceiling.fxRate, lang, 0)} {copy.supply.fxRateUnit}
            </dd>
          </div>
          <div className="kv__row">
            <dt>{copy.supply.formula}</dt>
            <dd>{t(ceiling.formula, lang)}</dd>
          </div>
          <div className="kv__row">
            <dt>{copy.supply.perPersonCap}</dt>
            <dd>{copy.supply.perPersonCapNote}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

function ChainSection({ supply, backing, copy, lang }) {
  const [open, setOpen] = useState(false);
  const { basket } = backing;
  const share = Math.round(basket.survivalRatio * 10000) / 100;
  return (
    <section aria-labelledby="bank-chain">
      <div className="section-head">
        <div>
          <h2 id="bank-chain" className="h2">
            {copy.chain.title}
          </h2>
          <p className="lede">{copy.chain.lede}</p>
        </div>
        <button
          type="button"
          className="btn btn--ghost"
          aria-expanded={open}
          aria-controls="bank-haircut-panel"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? copy.chain.closeTable : copy.chain.openTable}
        </button>
      </div>

      <div className="grid grid--stats">
        <Stat label={copy.chain.gross} value={compact(basket.countedGrossUsd ?? basket.grossUsd, lang)} note={copy.chain.grossNote} />
        <Stat label={copy.chain.net} value={compact(basket.netUsd, lang)} note="USD" tone="good" />
        <Stat label={copy.chain.survival} value={`${numberFormat(share, lang, 1)}٪`} note="USD" tone="warn" />
        <Stat
          label={copy.chain.ceiling}
          value={`${numberFormat(supply.ceiling.tokens, lang, 0)} HMMT`}
          note={`${copy.chain.perToken}: ${compact(supply.ceiling.usdPerToken, lang)} USD`}
        />
      </div>

      <div className="card">
        <h3 className="card__title">{copy.chain.excludedTitle}</h3>
        <dl className="kv">
          {backing.excluded.map((item, index) => (
            <div className="kv__row" key={index}>
              <dt>{index === 0 ? copy.chain.excludedGdp : copy.chain.excludedWealth}</dt>
              <dd>
                <span className="mono">{compact(item.valueUsd, lang)}</span> · {t(item.reason, lang)}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div id="bank-haircut-panel" hidden={!open}>
        <HaircutTables backing={backing} copy={copy} lang={lang} />
      </div>
    </section>
  );
}

function HaircutTables({ backing, copy, lang }) {
  return (
    <div className="haircut-stack">
      <p className="small muted">{copy.haircut.chainNote}</p>
      {backing.basket.lines.map((line) => (
        <Card key={line.tierId}>
          <div className="card__head">
            <div>
              <h3 className="card__title">
                <span className="mono">{line.tierId}</span> · {t(line.name, lang)}
              </h3>
              <p className="card__subtitle">
                {t(backing.tiers.find((tier) => tier.id === line.tierId)?.note ?? "", lang)}
              </p>
            </div>
            <Badge tone={line.counted ? "good" : "warn"}>{line.counted ? copy.haircut.counted : copy.haircut.excluded}</Badge>
          </div>

          <div className="table-wrap" tabIndex={0} role="region" aria-label={`${t(line.name, lang)} — ${copy.haircut.title}`}>
            <table className="data-table">
              <caption className="sr-only">{`${t(line.name, lang)} — ${copy.haircut.title}`}</caption>
              <thead>
                <tr>
                  <th scope="col">{copy.haircut.step}</th>
                  <th scope="col">{copy.haircut.factor}</th>
                  <th scope="col">{copy.haircut.net}</th>
                  <th scope="col">{copy.haircut.rationale}</th>
                </tr>
              </thead>
              <tbody>
                {line.steps.map((step) => (
                  <tr key={step.id}>
                    <th scope="row">{t(step.label, lang)}</th>
                    <td className="mono">×{numberFormat(step.factor, lang, 2)}</td>
                    <td className="mono">{compact(step.after, lang)}</td>
                    <td className="small">
                      {step.id === "verification"
                        ? t(backing.verificationRationale[line.status], lang)
                        : t(backing.policy.steps.find((item) => item.id === step.id)?.rationale ?? "", lang)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <dl className="kv kv--inline">
            <div className="kv__row">
              <dt>{copy.haircut.gross}</dt>
              <dd className="mono">{compact(line.grossUsd, lang)}</dd>
            </div>
            <div className="kv__row">
              <dt>{copy.haircut.net}</dt>
              <dd className="mono">
                <strong>{compact(line.netUsd, lang)}</strong>
              </dd>
            </div>
            <div className="kv__row">
              <dt>{copy.haircut.status}</dt>
              <dd>
                <StatusLabel status={line.status} copy={copy} />
              </dd>
            </div>
          </dl>
        </Card>
      ))}
      <p className="small muted">
        {copy.haircut.policy}: <span className="mono">{backing.policy.id}</span> ·{" "}
        {backing.policy.status === "proposed-configurable" ? copy.haircut.draft : backing.policy.status} ·{" "}
        <span className="mono">{backing.policy.authorizedBy}</span>
      </p>
    </div>
  );
}

function ReserveSection({ reserve, copy, lang }) {
  return (
    <section aria-labelledby="bank-reserve">
      <div className="section-head">
        <div>
          <h2 id="bank-reserve" className="h2">
            {copy.reserve.title}
          </h2>
          <p className="lede">{copy.reserve.lede}</p>
        </div>
        <Badge tone={RESERVE_TONE[reserve.status] ?? "neutral"}>
          {reserve.status === "healthy"
            ? copy.reserve.statusHealthy
            : reserve.status === "reserve-shortfall"
              ? copy.reserve.statusReserve
              : copy.reserve.statusAsset}
        </Badge>
      </div>

      <div className="grid grid--stats">
        <Stat
          label={copy.reserve.reserveRatio}
          value={numberFormat(reserve.reserveRatio, lang, 4)}
          note={`${copy.reserve.tomanReserve}: ${compact(reserve.tomanReserve, lang)}`}
          tone={reserve.reserveRatio >= 1 ? "good" : "danger"}
        />
        <Stat
          label={copy.reserve.assetCoverage}
          value={numberFormat(reserve.assetCoverage, lang, 4)}
          note={`${copy.reserve.netBacking}: ${compact(reserve.netBackingUsd, lang)}`}
          tone={reserve.assetCoverage >= 1 ? "good" : "warn"}
        />
        <Stat
          label={copy.reserve.utilisation}
          value={`${numberFormat(reserve.utilisation * 100, lang, 1)}٪`}
          note={`${formatRatio(reserve.circulatingTokens, reserve.ceilingTokens, lang)} HMMT`}
        />
        <Stat label={copy.reserve.queued} value={`${numberFormat(reserve.queuedTokens, lang, 2)} HMMT`} note={compact(reserve.queuedToman, lang)} />
      </div>

      <Card title={copy.reserve.invariantsTitle}>
        <ul className="status-list">
          {reserve.invariants.map((invariant) => (
            <li key={invariant.id}>
              <Badge tone={invariant.ok ? "good" : "danger"}>
                {invariant.ok ? copy.reserve.ok : copy.reserve.broken}
              </Badge>{" "}
              {invariant.design ? <span className="mono muted small">{copy.reserve.design} · </span> : null}
              {t(invariant.statement, lang)}
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}

function capLookup(caps, { policyId, level, entityId }) {
  const numeric = Number(level);
  const rows = caps.matrix.filter((row) => row.policyId === policyId && row.level === numeric);
  if (rows.length === 0) return null;
  const formulaRow = rows.find((row) => row.capKind === "formula");
  if (formulaRow) return rows.find((row) => row.entityId === entityId) ?? formulaRow;
  return rows[0];
}

function capText(entry, copy, lang, numberFormat) {
  if (!entry) return "—";
  if (entry.code === "entity-budget-required") return copy.caps.noBudget;
  if (!(entry.capTokens > 0)) return copy.caps.notEligible;
  const value = `${numberFormat(entry.capTokens, lang, 2)} HMMT`;
  return entry.hardCapApplied ? `${value} · ${copy.caps.hardCap}` : value;
}

function CapsSection({ caps, copy, lang }) {
  const policies = caps.policies;
  return (
    <section aria-labelledby="bank-caps">
      <div className="section-head">
        <div>
          <h2 id="bank-caps" className="h2">
            {copy.caps.title}
          </h2>
          <p className="lede">{copy.caps.lede}</p>
        </div>
        <Badge tone="warn">{copy.caps.draft}</Badge>
      </div>

      <div className="table-wrap" tabIndex={0} role="region" aria-label={`${copy.tableRegion}: ${copy.caps.title}`}>
        <table className="data-table">
          <caption className="sr-only">{copy.caps.title}</caption>
          <thead>
            <tr>
              <th scope="col">{copy.caps.level}</th>
              {policies.map((policy) => (
                <th key={policy.id} scope="col" className="caps-policy-head">
                  <span className="caps-policy-head__name">{t(policy.label, lang)}</span>
                  <span className="caps-policy-head__meta mono">
                    {policy.id}
                    {policy.id === caps.defaultPolicyId ? ` · ${copy.caps.defaultPolicy}` : ""}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {caps.levels.map((level) => (
              <tr key={level.level}>
                <th scope="row" className="caps-level">
                  <span className="mono">{formatNumber(level.level, lang)}</span> · {t(level.title, lang)}
                </th>
                {policies.map((policy) => {
                  const cell = policy.cells.find((item) => item.level === level.level);
                  return (
                    <td key={policy.id}>
                      <span className="caps-value">{capText(cell, copy, lang, numberFormat)}</span>
                      <span className="caps-req small muted">
                        {cell?.requires ? `${copy.caps.requires}: ${copy.requirements[cell.requires] ?? cell.requires}` : copy.caps.noProof}
                        {cell?.disclosure ? ` · ${copy.caps.disclosure}` : ""}
                      </span>
                      {cell?.entityName ? (
                        <span className="caps-req small muted">
                          {copy.caps.basedOn}: {t(cell.entityName, lang)}
                        </span>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="caps-mobile">
        {caps.levels.map((level) => (
          <li key={level.level} className="caps-mobile__level">
            <h3 className="caps-mobile__title">
              <span className="mono">{formatNumber(level.level, lang)}</span> · {t(level.title, lang)}
            </h3>
            <dl className="caps-mobile__rows">
              {policies.map((policy) => {
                const cell = policy.cells.find((item) => item.level === level.level);
                return (
                  <div key={policy.id} className="caps-mobile__row">
                    <dt>
                      {t(policy.label, lang)}
                      {policy.id === caps.defaultPolicyId ? ` · ${copy.caps.defaultPolicy}` : ""}
                    </dt>
                    <dd>
                      <span className="caps-value">{capText(cell, copy, lang, numberFormat)}</span>
                      {cell?.requires ? (
                        <span className="caps-req small muted">
                          {copy.caps.requires}: {copy.requirements[cell.requires] ?? cell.requires}
                          {cell?.disclosure ? ` · ${copy.caps.disclosure}` : ""}
                        </span>
                      ) : null}
                      {cell?.entityName ? (
                        <span className="caps-req small muted">
                          {copy.caps.basedOn}: {t(cell.entityName, lang)}
                        </span>
                      ) : null}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </li>
        ))}
      </ul>

      <Card title={copy.caps.invariantsTitle}>
        <ul className="tight-list">
          {caps.invariants.map((invariant) => (
            <li key={invariant.id}>{t({ fa: invariant.fa, en: invariant.en }, lang)}</li>
          ))}
        </ul>
        <p className="small muted caps-note">{copy.caps.recordedUnder}</p>
      </Card>
    </section>
  );
}

function Simulator({ copy, lang, caps, defaultHint }) {
  const [action, setAction] = useState("convert");
  const [level, setLevel] = useState("2");
  const [policyId, setPolicyId] = useState(caps.defaultPolicyId);
  const [entityId, setEntityId] = useState(caps.entities[0]?.id ?? "");
  const [amount, setAmount] = useState("0.05");
  const [state, setState] = useState({ status: "idle", payload: null });

  const entry = capLookup(caps, { policyId, level, entityId });
  const needsEntity = entry?.capKind === "formula";
  const capValue = entry && entry.code === "resolved" ? entry.capTokens : 0;

  const presets = useMemo(() => {
    if (action === "redeem") {
      return [
        { id: "half", value: "0.5", label: copy.sim.presetHalf },
        { id: "five", value: "5", label: copy.sim.presetFive },
        { id: "over", value: "5000", label: copy.sim.presetOver }
      ];
    }
    if (!(capValue > 0)) {
      return [{ id: "any", value: "0.01", label: copy.sim.presetOver }];
    }
    return [
      { id: "cap", value: String(capValue), label: copy.sim.presetCap },
      { id: "half", value: String(Math.round((capValue / 2) * 1e6) / 1e6), label: copy.sim.presetHalf },
      { id: "over", value: String(capValue * 2), label: copy.sim.presetOverCap }
    ];
  }, [action, capValue, copy.sim]);

  // One parser, one truth: the number shown under the field is the number sent
  // to the API, and an ambiguous separator is a question, not a guess (issue #28).
  const parsed = parseDecimalInput(amount);
  const amountNumber = parsed.ok ? parsed.value : null;

  const submit = async (event) => {
    event.preventDefault();
    if (!parsed.ok) {
      setState({
        status: "ready",
        payload: {
          action,
          result: { allowed: false, code: "invalid-amount", amountProblem: parsed.reason },
          after: null
        }
      });
      return;
    }
    setState({ status: "running", payload: null });
    try {
      const params = new URLSearchParams({ action, amount: String(amountNumber) });
      if (action === "convert") {
        params.set("level", level);
        params.set("policy", policyId);
        if (needsEntity && entityId) params.set("entity", entityId);
      }
      const response = await fetch(`/api/v1/hmmt/simulate?${params.toString()}`, {
        headers: { Accept: "application/json" },
        credentials: "omit"
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      setState({ status: "ready", payload: payload.data });
    } catch {
      setState({ status: "error", payload: null });
    }
  };

  const result = state.payload?.result;
  const code = result?.code;

  return (
    <section aria-labelledby="bank-sim">
      <div className="section-head">
        <div>
          <h2 id="bank-sim" className="h2">
            {copy.sim.title}
          </h2>
          <p className="lede">{copy.sim.lede}</p>
        </div>
      </div>

      <Card>
        <form className="sim-form" onSubmit={submit}>
          <p className="field">
            <label htmlFor="bank-action" className="field__label">
              {copy.sim.action}
            </label>
            <select
              id="bank-action"
              className="input"
              value={action}
              onChange={(event) => {
                setAction(event.target.value);
                setState({ status: "idle", payload: null });
              }}
            >
              <option value="convert">{copy.sim.convert}</option>
              <option value="redeem">{copy.sim.redeem}</option>
            </select>
          </p>

          <p className="field">
            <label htmlFor="bank-level" className="field__label">
              {copy.sim.level}
            </label>
            <select
              id="bank-level"
              className="input"
              value={level}
              disabled={action === "redeem"}
              onChange={(event) => {
                setLevel(event.target.value);
                setState({ status: "idle", payload: null });
              }}
            >
              {caps.levels.map((item) => (
                <option key={item.level} value={String(item.level)}>
                  {formatNumber(item.level, lang)} · {t(item.title, lang)}
                </option>
              ))}
            </select>
          </p>

          <p className="field">
            <label htmlFor="bank-policy" className="field__label">
              {copy.sim.capPolicy}
            </label>
            <select
              id="bank-policy"
              className="input"
              value={policyId}
              disabled={action === "redeem"}
              onChange={(event) => {
                setPolicyId(event.target.value);
                setState({ status: "idle", payload: null });
              }}
            >
              {caps.policies.map((policy) => (
                <option key={policy.id} value={policy.id}>
                  {t(policy.label, lang)}
                </option>
              ))}
            </select>
          </p>

          {action === "convert" && needsEntity ? (
            <p className="field">
              <label htmlFor="bank-entity" className="field__label">
                {copy.sim.entity}
              </label>
              <select
                id="bank-entity"
                className="input"
                value={entityId}
                onChange={(event) => {
                  setEntityId(event.target.value);
                  setState({ status: "idle", payload: null });
                }}
              >
                {caps.entities.map((entity) => (
                  <option key={entity.id} value={entity.id}>
                    {t(entity.name, lang)}
                  </option>
                ))}
              </select>
            </p>
          ) : null}

          <p className="field">
            <label htmlFor="bank-amount" className="field__label">
              {copy.sim.amount}
            </label>
            <input
              id="bank-amount"
              className="input mono"
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
            <span className="field__hint small">{copy.sim.amountHint}</span>
            <span className={`field__hint small ${parsed.ok ? "" : "field__hint--problem"}`}>
              {copy.sim.parsedAs}:{" "}
              {parsed.ok
                ? `${numberFormat(parsed.value, lang, 4)} HMMT`
                : amount.trim() === ""
                  ? "—"
                  : copy.sim.amountProblem[parsed.reason]}
            </span>
            <span className="field__hint small">
              {copy.sim.tomanEquivalent}:{" "}
              {amountNumber === null ? "—" : `${compact(amountNumber * 1e12, lang)} ${lang === "fa" ? "تومان" : "toman"}`}
            </span>
            <span className="field__hint small">
              {action === "convert" ? (
                <>
                  {copy.sim.capForLevel}: <strong className="mono">{capText(entry, copy, lang, numberFormat)}</strong>
                </>
              ) : (
                copy.sim.noCapForRedeem
              )}
            </span>
          </p>

          <div className="field field--presets">
            <span className="field__label">{copy.sim.presets}</span>
            <div className="btn-row">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`btn btn--ghost btn--sm ${amount === preset.value ? "is-active" : ""}`}
                  onClick={() => setAmount(preset.value)}
                >
                  {preset.label} · {numberFormat(preset.value, lang, 2)}
                </button>
              ))}
            </div>
          </div>

          <div className="btn-row">
            <button type="submit" className="btn btn--primary">
              {state.status === "running" ? copy.sim.running : copy.sim.submit}
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setAmount(action === "convert" ? "0.05" : "0.5");
                setState({ status: "idle", payload: null });
              }}
            >
              {copy.sim.reset}
            </button>
          </div>
        </form>

        <div className="sim__result" aria-live="polite">
          {state.status === "error" ? <Callout tone="danger">{copy.sim.error}</Callout> : null}
          {result ? (
            <>
              <h3 className="minor-heading">{result.allowed ? copy.sim.resultTitle : copy.sim.failureTitle}</h3>
              <p>
                <Badge tone={result.allowed ? "good" : code === "queue" ? "warn" : "danger"}>
                  {copy.sim.codes[code] ?? code}
                </Badge>{" "}
                <span className="small muted">{copy.sim.codeNotes[code] ?? ""}</span>
              </p>

              {!result.allowed && result.reason ? <p>{t(result.reason, lang)}</p> : null}
              {!result.allowed && result.amountProblem ? (
                <p className="sim__problem">{copy.sim.amountProblem[result.amountProblem]}</p>
              ) : null}

              <dl className="kv kv--inline">
                {result.allowed && result.netTokens !== undefined ? (
                  <div className="kv__row">
                    <dt>{copy.sim.netTokens}</dt>
                    <dd className="mono">{numberFormat(result.netTokens, lang, 2)} HMMT</dd>
                  </div>
                ) : null}
                {result.allowed && result.feeTokens !== undefined ? (
                  <div className="kv__row">
                    <dt>{copy.sim.fee}</dt>
                    <dd className="mono">
                      {numberFormat(result.feeTokens, lang, 4)} HMMT · {numberFormat(result.feeBps, lang, 0)} bps
                    </dd>
                  </div>
                ) : null}
                {result.allowed && result.reserveRequiredUsd !== undefined ? (
                  <div className="kv__row">
                    <dt>{copy.sim.reserveRequired}</dt>
                    <dd className="mono">{compact(result.reserveRequiredUsd, lang)} USD</dd>
                  </div>
                ) : null}
                {result.netToman !== undefined ? (
                  <div className="kv__row">
                    <dt>{copy.sim.netToman}</dt>
                    <dd className="mono">{compact(result.netToman, lang)}</dd>
                  </div>
                ) : null}
                {result.capTokens !== undefined && result.capTokens !== null ? (
                  <div className="kv__row">
                    <dt>{copy.sim.capForLevel}</dt>
                    <dd className="mono">{numberFormat(result.capTokens, lang, 2)} HMMT</dd>
                  </div>
                ) : null}
                {result.requires ? (
                  <div className="kv__row">
                    <dt>{copy.caps.requires}</dt>
                    <dd>{copy.requirements[result.requires] ?? result.requires}</dd>
                  </div>
                ) : null}
                {result.excessTokens !== undefined && result.capTokens > 0 ? (
                  <div className="kv__row">
                    <dt>{copy.sim.excess}</dt>
                    <dd className="mono">{numberFormat(result.excessTokens, lang, 2)} HMMT</dd>
                  </div>
                ) : null}
                {result.availableToman !== undefined && result.availableToman !== null ? (
                  <div className="kv__row">
                    <dt>{copy.ledger.cashWindow}</dt>
                    <dd className="mono">{compact(result.availableToman, lang)}</dd>
                  </div>
                ) : null}
                {result.capacity !== undefined ? (
                  <div className="kv__row">
                    <dt>{copy.supply.remaining}</dt>
                    <dd className="mono">{numberFormat(result.capacity, lang, 2)} HMMT</dd>
                  </div>
                ) : null}
                {result.newCirculatingTokens !== undefined ? (
                  <div className="kv__row">
                    <dt>{copy.sim.newCirculating}</dt>
                    <dd className="mono">{numberFormat(result.newCirculatingTokens, lang, 2)} HMMT</dd>
                  </div>
                ) : null}
              </dl>

              {state.payload.after ? (
                <>
                  <h4 className="minor-heading">{copy.sim.afterTitle}</h4>
                  <dl className="kv kv--inline">
                    <div className="kv__row">
                      <dt>{copy.reserve.reserveRatio}</dt>
                      <dd className="mono">{numberFormat(state.payload.after.reserveRatio, lang, 4)}</dd>
                    </div>
                    <div className="kv__row">
                      <dt>{copy.reserve.assetCoverage}</dt>
                      <dd className="mono">{numberFormat(state.payload.after.assetCoverage, lang, 4)}</dd>
                    </div>
                    <div className="kv__row">
                      <dt>{copy.reserve.utilisation}</dt>
                      <dd className="mono">{numberFormat(state.payload.after.utilisation * 100, lang, 2)}٪</dd>
                    </div>
                  </dl>
                </>
              ) : null}
            </>
          ) : null}
        </div>
      </Card>
      {defaultHint ? <p className="small muted">{defaultHint}</p> : null}
    </section>
  );
}

function LedgerSection({ ledger, copy, lang }) {
  const totals = ledger.totals;
  return (
    <section aria-labelledby="bank-ledger">
      <div className="section-head">
        <div>
          <h2 id="bank-ledger" className="h2">
            {copy.ledger.title}
          </h2>
          <p className="lede">{copy.ledger.lede}</p>
        </div>
        <Badge tone="synthetic">{copy.syntheticLedger}</Badge>
      </div>

      <div className="table-wrap" tabIndex={0} role="region" aria-label={`${copy.tableRegion}: ${copy.ledger.title}`}>
        <table className="data-table">
          <caption className="sr-only">{copy.ledger.title}</caption>
          <thead>
            <tr>
              <th scope="col">{copy.ledger.id}</th>
              <th scope="col">{copy.ledger.kind}</th>
              <th scope="col">{copy.ledger.at}</th>
              <th scope="col">{copy.ledger.tokens}</th>
              <th scope="col">{copy.ledger.toman}</th>
              <th scope="col">{copy.ledger.status}</th>
            </tr>
          </thead>
          <tbody>
            {ledger.entries.map((entry) => (
              <tr key={entry.id}>
                <th scope="row" className="mono">
                  {entry.id}
                </th>
                <td>{entry.kind === "deposit" ? copy.ledger.deposit : copy.ledger.redemption}</td>
                <td className="mono">{dateOnly(entry.at, lang)}</td>
                <td className="mono">{entry.tokens === null ? "—" : numberFormat(entry.tokens, lang, 4)}</td>
                <td className="mono">{compact(entry.toman, lang)}</td>
                <td>
                  <Badge tone={entry.status === "settled" ? "good" : entry.status === "queued" ? "warn" : "neutral"}>
                    {entry.status === "settled"
                      ? copy.ledger.settled
                      : entry.status === "queued"
                        ? copy.ledger.queued
                        : copy.ledger.pending}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Card title={copy.ledger.totals}>
        <dl className="kv kv--inline">
          <div className="kv__row">
            <dt>{copy.ledger.depositsSettled}</dt>
            <dd className="mono">{compact(totals.depositsSettledToman, lang)}</dd>
          </div>
          <div className="kv__row">
            <dt>{copy.ledger.depositsPending}</dt>
            <dd className="mono">{compact(totals.depositsPendingToman, lang)}</dd>
          </div>
          <div className="kv__row">
            <dt>{copy.ledger.minted}</dt>
            <dd className="mono">{numberFormat(totals.mintedTokens, lang, 2)} HMMT</dd>
          </div>
          <div className="kv__row">
            <dt>{copy.ledger.burned}</dt>
            <dd className="mono">{numberFormat(totals.burnedTokens, lang, 2)} HMMT</dd>
          </div>
          <div className="kv__row">
            <dt>{copy.ledger.queuedToman}</dt>
            <dd className="mono">{compact(totals.queuedToman, lang)}</dd>
          </div>
          <div className="kv__row">
            <dt>{copy.ledger.feeRevenue}</dt>
            <dd className="mono">{compact(totals.feeRevenueToman, lang)}</dd>
          </div>
          <div className="kv__row">
            <dt>{copy.ledger.cashWindow}</dt>
            <dd className="mono">{compact(ledger.cashWindowToman, lang)}</dd>
          </div>
        </dl>
        <ul className="tight-list small">
          {ledger.notes.map((note, index) => (
            <li key={index}>{t(note, lang)}</li>
          ))}
        </ul>
      </Card>
    </section>
  );
}

function PhasesSection({ supply, copy, lang }) {
  return (
    <section aria-labelledby="bank-phases">
      <div className="section-head">
        <div>
          <h2 id="bank-phases" className="h2">
            {copy.phases.title}
          </h2>
          <p className="lede">{copy.phases.lede}</p>
        </div>
      </div>

      <div className="table-wrap" tabIndex={0} role="region" aria-label={`${copy.tableRegion}: ${copy.phases.title}`}>
        <table className="data-table">
          <caption className="sr-only">{copy.phases.title}</caption>
          <thead>
            <tr>
              <th scope="col">{copy.phases.phase}</th>
              <th scope="col">{copy.phases.window}</th>
              <th scope="col">{copy.phases.cumulative}</th>
              <th scope="col">{copy.phases.gate}</th>
              <th scope="col">{copy.phases.current}</th>
            </tr>
          </thead>
          <tbody>
            {supply.phases.map((phase) => (
              <tr key={phase.id}>
                <th scope="row">
                  <span className="mono">{phase.id}</span> · {t(phase.label, lang)}
                </th>
                <td className="mono">{numberFormat(phase.windowTokens, lang, 0)}</td>
                <td className="mono">{numberFormat(phase.cumulativeTokens, lang, 0)}</td>
                <td className="small">{t(phase.gate, lang)}</td>
                <td>
                  {phase.id === supply.currentPhaseId ? (
                    <Badge tone="good">{copy.phases.current}</Badge>
                  ) : (
                    <span className="muted small">{copy.phases.notYet}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DesignSection({ design, copy, lang }) {
  const network = design.network;
  return (
    <section aria-labelledby="bank-design">
      <div className="section-head">
        <div>
          <h2 id="bank-design" className="h2">
            {copy.design.title}
          </h2>
          <p className="lede">{copy.design.lede}</p>
        </div>
      </div>

      <div className="grid grid--two">
        <Card title={copy.design.networkTitle}>
          <dl className="kv">
            <div className="kv__row">
              <dt>{copy.design.firstStage}</dt>
              <dd>
                {copy.networks[network.firstStage.chain] ?? network.firstStage.chain} · {network.firstStage.standard}
                <span className="small muted"> — {t(network.firstStage.reason, lang)}</span>
              </dd>
            </div>
            <div className="kv__row">
              <dt>{copy.design.targetStage}</dt>
              <dd>
                {copy.networks[network.targetStage.chain] ?? network.targetStage.chain}
                <span className="small muted"> — {t(network.targetStage.reason, lang)}</span>
              </dd>
            </div>
          </dl>
          <h3 className="minor-heading">{copy.design.exitTitle}</h3>
          <ul className="tight-list">
            {network.targetStage.exitCriteria.map((criterion, index) => (
              <li key={index}>{t(criterion, lang)}</li>
            ))}
          </ul>
        </Card>

        <Card title={copy.design.governanceTitle}>
          <p>{t(design.governanceAsymmetry, lang)}</p>
          <h3 className="minor-heading">{copy.design.invariantsTitle}</h3>
          <ul className="tight-list">
            {design.invariants.map((invariant) => (
              <li key={invariant.id}>{t({ fa: invariant.fa, en: invariant.en }, lang)}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Callout tone="warn" title={copy.design.ledgerNoteTitle}>
        {copy.design.ledgerNote}
      </Callout>
    </section>
  );
}


// The rate panel. It is a separate fetch from the bank payload on purpose: the
// rate changes while the page is open, and the supply figures on this screen are
// computed at the frozen reference. Showing both, side by side, is the only
// honest way to render a ceiling that depends on a price nobody controls.
function RateSection({ copy, lang }) {
  const { status, payload, error, reload } = useApi("/api/v1/fx/sensitivity");
  const rate = copy.rate;

  if (status !== "ready") {
    return (
      <section aria-labelledby="bank-rate">
        <div className="section-head">
          <div>
            <h2 id="bank-rate" className="h2">
              {rate.title}
            </h2>
            <p className="lede">{rate.lede}</p>
          </div>
        </div>
        <StateBlock status={status} lang={lang} onRetry={reload} error={error} />
      </section>
    );
  }

  const data = payload.data;
  const state = data.status;
  const tone = state === "fresh" ? "good" : state === "stale" ? "warn" : state === "suspect" ? "danger" : "info";
  const stateLabel = rate.states[state] ?? t(data.statusLabel, lang);
  const ageText =
    data.rateContext.ageMs === null || data.rateContext.ageMs === undefined
      ? rate.never
      : data.rateContext.ageMs < 60_000
        ? `${formatNumber(Math.round(data.rateContext.ageMs / 1000), lang)} ${rate.ageSeconds}`
        : `${formatNumber(Math.round(data.rateContext.ageMs / 60_000), lang)} ${rate.ageMinutes}`;

  return (
    <section aria-labelledby="bank-rate">
      <div className="section-head">
        <div>
          <h2 id="bank-rate" className="h2">
            {rate.title}
          </h2>
          <p className="lede">{rate.lede}</p>
        </div>
        <button type="button" className="btn btn--ghost" onClick={reload}>
          {rate.refresh}
        </button>
      </div>

      <div className="grid grid--stats">
        <Stat
          label={rate.rateLabel}
          value={`${numberFormat(data.rate.tomanPerUsd, lang, 0)} ${lang === "fa" ? "تومان" : "toman"}`}
          note={rate.rateColumn}
          tone={state === "fresh" ? "info" : "neutral"}
        />
        <Stat label={rate.liveCeiling} value={`${numberFormat(data.live.ceilingTokens, lang, 0)} HMMT`} note={rate.ceilingColumn} />
        <Stat
          label={rate.referenceCeiling}
          value={`${numberFormat(data.reference.ceilingTokens, lang, 0)} HMMT`}
          note={`${rate.referenceLine}: ${numberFormat(data.rateContext.reference.rate, lang, 0)}`}
          tone="info"
        />
        <Stat
          label={rate.difference}
          value={`${data.deltaFromReferenceTokens > 0 ? "+" : ""}${numberFormat(data.deltaFromReferenceTokens, lang, 0)} HMMT`}
          note={`${rate.asOfLabel}: ${dateOnly(data.asOf, lang)}`}
        />
      </div>

      <Card title={rate.ladderTitle}>
        <p className="card__subtitle">{rate.ladderLede}</p>
        <div className="table-wrap" tabIndex={0} role="region" aria-label={`${copy.tableRegion}: ${rate.ladderTitle}`}>
          <table className="data-table data-table--compact">
            <caption className="sr-only">{rate.ladderTitle}</caption>
            <thead>
              <tr>
                <th scope="col">{rate.shock}</th>
                <th scope="col">{rate.rateColumn}</th>
                <th scope="col">{rate.ceilingColumn}</th>
                <th scope="col">{rate.ratifiedColumn}</th>
              </tr>
            </thead>
            <tbody>
              {data.ladder.map((row) => (
                <tr key={row.shockPercent}>
                  <td className="mono">
                    {row.shockPercent > 0 ? "+" : ""}
                    {formatNumber(row.shockPercent, lang)}%
                  </td>
                  <td className="mono">{numberFormat(row.fxRate, lang, 0)}</td>
                  <td className="mono">{numberFormat(row.ceilingTokens, lang, 0)}</td>
                  <td>
                    {row.belowRatifiedCeiling ? (
                      <Badge tone="warn">
                        {rate.ratifiedAbove} · {numberFormat(row.overIssueRiskTokens, lang, 0)}
                      </Badge>
                    ) : (
                      <span className="small muted">{rate.ratifiedAgrees}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout tone={tone === "danger" ? "warn" : "info"} title={rate.statusLabel}>
          <Badge tone={tone}>{stateLabel}</Badge>
          <span className="small muted">
            {" "}
            · {rate.sourceLabel}: {data.rateContext.source ?? "—"} · {rate.ageLabel}: {ageText}
          </span>
        </Callout>
      </Card>

      <Callout tone="warn" title={rate.limitationsTitle}>
        <ul className="tight-list">
          {data.limitations.map((item, index) => (
            <li key={index}>{t(item, lang)}</li>
          ))}
        </ul>
      </Callout>
    </section>
  );
}

export default function Bank({ lang }) {
  const copy = localeStrings(lang).bank;
  const { status, payload, error, reload } = useApi("/api/v1/hmmt");

  if (status !== "ready") {
    return (
      <>
        <SectionHeader eyebrow={copy.eyebrow} title={copy.title} lede={copy.lede} />
        <StateBlock status={status} lang={lang} onRetry={reload} error={error} />
      </>
    );
  }

  const { notice, asOf, supply, backing, reserve, ledger, caps, design } = payload.data;

  return (
    <article className="bank">
      <SectionHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        lede={copy.lede}
        actions={<Badge tone="warn">{copy.proposalBadge}</Badge>}
      />

      <Callout tone="warn" title={copy.notTenderTitle}>
        {t(notice, lang)}
        <span className="small muted">
          {" "}
          {copy.asOf}: <span className="mono">{dateOnly(asOf, lang)}</span>
        </span>
      </Callout>

      <div className="grid grid--two">
        <DefinitionCard definition={supply.definition} copy={copy} lang={lang} />
        <Card title={copy.supply.sourceTitle}>
          <div className="table-wrap" tabIndex={0} role="region" aria-label={`${copy.tableRegion}: ${copy.supply.sourceTitle}`}>
            <table className="data-table data-table--compact">
              <caption className="sr-only">{copy.supply.sourceTitle}</caption>
              <thead>
                <tr>
                  <th scope="col">{copy.supply.value}</th>
                  <th scope="col">{copy.asOf}</th>
                  <th scope="col">{copy.supply.status}</th>
                </tr>
              </thead>
              <tbody>
                {supply.sources.map((source) => (
                  <tr key={source.id}>
                    <td className="small">{t(source.value, lang)}</td>
                    <td className="mono small">{dateOnly(source.asOf, lang)}</td>
                    <td>
                      <StatusLabel status={source.status} copy={copy} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <RateSection copy={copy} lang={lang} />
      <SupplySection supply={supply} copy={copy} lang={lang} />
      <CapsSection caps={caps} copy={copy} lang={lang} />
      <ChainSection supply={supply} backing={backing} copy={copy} lang={lang} />
      <ReserveSection reserve={reserve} copy={copy} lang={lang} />
      <Simulator copy={copy} lang={lang} caps={caps} defaultHint={copy.caps.recordedUnder} />
      <LedgerSection ledger={ledger} copy={copy} lang={lang} />
      <PhasesSection supply={supply} copy={copy} lang={lang} />
      <DesignSection design={design} copy={copy} lang={lang} />
    </article>
  );
}
