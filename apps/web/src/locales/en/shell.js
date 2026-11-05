// Shell copy: the parts of the frame that are not a module — the breadcrumb,
// the way home, and the page shown for an address that does not exist.
export const shellEn = {
  breadcrumb: "Breadcrumb",
  home: "Hub",
  // Global search (the command palette). Every state has its own words: an
  // outage must never read as "nothing found".
  search: {
    label: "Global search",
    placeholder: "Search an institution, a dossier, a claim, a principle or a service…",
    results: "Search results",
    searching: "Searching…",
    prompt: "Type at least two characters to search all twelve sections.",
    emptyFor: "Nothing found for “{query}”. Try another term.",
    error: "The search could not run: the server did not answer.",
    retry: "Retry",
    close: "Close search"
  },
  // The render-error fallback. It says what it knows and what it does not.
  crash: {
    eyebrow: "Display error",
    title: "This section could not be displayed",
    body:
      "Something failed while rendering the page. Nothing was sent or recorded; this prototype is read-only. You can try again, or go back to the hub.",
    retry: "Try again",
    hub: "Back to the hub"
  },
  notFound: {
    eyebrow: "Not found",
    title: "We could not find that page",
    body:
      "The address may be mistyped, or it may point at a record this prototype does not have. Nothing was changed by the attempt.",
    hub: "Back to the hub",
    levels: "See the five civic levels",
    search: "Search the system"
  }
};
