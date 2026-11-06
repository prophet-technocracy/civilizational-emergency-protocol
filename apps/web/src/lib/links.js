// In-app anchors stay real anchors.
//
// A link that always calls preventDefault() looks like a link, reads like a
// link, and then refuses to do what a link does: open in a new tab, be copied
// from the context menu, or be opened with Ctrl/Cmd/Shift/middle click (issue
// #58). The router only owns the one gesture it can honestly claim — an
// unmodified primary click — and everything else is left to the browser.

/** True only for an unmodified primary click that nothing has handled yet. */
export function isPlainLeftClick(event) {
  if (!event || event.defaultPrevented) return false;
  if (event.button !== undefined && event.button !== 0) return false;
  return !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey);
}

/**
 * The click handler for an in-app destination.
 *
 *   <a href={hrefFor("programme")} onClick={onLinkClick(navigate, "programme")}>
 *
 * Modified clicks fall through to the browser, including the `href` that makes
 * "copy link address" and "open in new tab" work.
 */
export function onLinkClick(navigate, view, recordId) {
  return (event) => {
    if (!isPlainLeftClick(event)) return;
    event.preventDefault();
    navigate(view, recordId ?? undefined);
  };
}
