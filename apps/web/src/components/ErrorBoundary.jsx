import { Component } from "react";
import { localeStrings } from "../locales/index.js";
import { hrefFor, HUB_VIEW } from "../lib/routes.js";

// A render error used to blank the whole application: no heading, no way back,
// nothing in the page to tell a reader what happened (issue #32). This boundary
// keeps the frame alive and says one plain sentence about what it does not know.
//
// It makes no network call and reports nowhere: the project's posture is no
// analytics, so the only trace is the console.

/** The fallback, separately exported so its copy can be rendered and tested. */
export function CrashFallback({ lang, onReset }) {
  const copy = localeStrings(lang).shell.crash;
  return (
    <div className="state-block state-block--error crash" role="alert">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h1 className="crash__title" tabIndex={-1}>
        {copy.title}
      </h1>
      <p>{copy.body}</p>
      <div className="btn-row">
        <button type="button" className="btn btn--primary" onClick={onReset}>
          {copy.retry}
        </button>
        <a className="btn btn--ghost" href={hrefFor(HUB_VIEW)}>
          {copy.hub}
        </a>
      </div>
    </div>
  );
}

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.onReset = this.onReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Console only: nothing leaves the tab.
    console.error("CEP view failed to render:", error, info?.componentStack ?? "");
    // The page has been replaced under the reader's focus, so put it on the
    // heading of the explanation rather than leaving it on a control that no
    // longer exists.
    const heading = document.querySelector(".crash__title");
    heading?.focus?.({ preventScroll: true });
  }

  onReset() {
    this.setState({ error: null });
    this.props.onReset?.();
  }

  render() {
    if (this.state.error) {
      return <CrashFallback lang={this.props.lang ?? "fa"} onReset={this.onReset} />;
    }
    return this.props.children;
  }
}
