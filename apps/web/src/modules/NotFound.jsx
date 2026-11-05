import { localeStrings } from "../locales/index.js";
import { SectionHeader, Card } from "../components/ui.jsx";
import { Icon } from "../components/icons.jsx";
import { hrefFor, HUB_VIEW, LEVELS_VIEW } from "../lib/routes.js";

// A wrong address deserves a page that says so (issue #39). The links are real
// anchors, so the browser's own affordances — new tab, copy link, middle click —
// work on the two ways out of a dead end.
export default function NotFound({ lang, onSearch }) {
  const copy = localeStrings(lang).shell.notFound;
  return (
    <div className="not-found">
      <SectionHeader eyebrow={copy.eyebrow} title={copy.title} lede={copy.body} />
      <Card>
        <div className="btn-row">
          <a className="btn btn--primary" href={hrefFor(HUB_VIEW)}>
            {copy.hub}
          </a>
          <a className="btn btn--ghost" href={hrefFor(LEVELS_VIEW)}>
            {copy.levels}
          </a>
          <button type="button" className="btn btn--ghost" onClick={onSearch}>
            <Icon name="search" size={15} /> {copy.search}
          </button>
        </div>
      </Card>
    </div>
  );
}
