// The light that sits beside a principle. Four colours, and the colour is never
// the only signal: callers pass a label so the dot is either named for a screen
// reader or hidden as decoration when the text already says it.

export const LIGHT_TONE = { green: "good", amber: "warn", red: "danger", grey: "neutral" };

export function LightDot({ light, label, size = 12 }) {
  const style = { inlineSize: `${size}px`, blockSize: `${size}px` };
  if (!label) {
    return <span className={`light light--${light}`} style={style} aria-hidden="true" />;
  }
  return <span className={`light light--${light}`} style={style} role="img" aria-label={label} />;
}

export function LightRail({ lights, labels, size = 10 }) {
  // A compact string of four dots, in the canonical order, for headers.
  return (
    <span className="light-rail">
      {lights.map((entry) => (
        <LightDot key={entry.id} light={entry.id} label={`${labels[entry.id]}: ${entry.count}`} size={size} />
      ))}
    </span>
  );
}
