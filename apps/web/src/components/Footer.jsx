import { localeStrings } from "../locales/index.js";
import { useSchemaVersion } from "../lib/api.js";
import { BUILD } from "../lib/build.js";
import { Badge } from "./ui.jsx";

// The footer states facts: which build this is, which data schema answered, and
// what the prototype refuses to claim. It used to name a session branch and a
// schema version that never existed (issue #40).
export default function Footer({ lang, dict }) {
  const copy = localeStrings(lang).shell.build;
  const schemaVersion = useSchemaVersion();
  const parts = [];
  parts.push(`${copy.version} ${BUILD.version ? `v${BUILD.version}` : copy.unknown}`);
  parts.push(`${copy.commit} ${BUILD.commit}`);
  if (schemaVersion) parts.push(`${copy.schema} ${schemaVersion}`);

  return (
    <footer className="app-footer">
      <p>{dict.footer}</p>
      <p className="app-footer__meta mono">{parts.join(" · ")}</p>
      <p className="app-footer__meta">
        <Badge tone="warn">{dict.governanceNote}</Badge>
      </p>
    </footer>
  );
}
