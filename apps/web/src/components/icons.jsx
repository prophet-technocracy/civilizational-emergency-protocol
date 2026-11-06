// Inline SVG icon set — no icon-font dependency, no runtime network request,
// inherits `currentColor`, and always has an explicit accessible name.

const PATHS = {
  menu: "M3 6h18M3 12h18M3 18h18",
  layers: "M12 3 3 7.5 12 12l9-4.5L12 3ZM3 12.5 12 17l9-4.5M3 17 12 21.5 21 17",
  search: "M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM15.5 15.5 21 21",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM3 12h18M12 3c2.5 2.5 3.8 5.6 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3Z",
  sun: "M12 6.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM12 1.5v2M12 20.5v2M1.5 12h2M20.5 12h2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M19.4 4.6 18 6M6 18l-1.4 1.4",
  moon: "M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z",
  close: "M6 6l12 12M18 6 6 18",
  chevronDown: "M6 9.5 12 15l6-5.5",
  chevronLeft: "M14.5 6 9 12l5.5 6",
  arrowRight: "M4 12h15M13 6l6 6-6 6",
  // A chevron drawn as a path, not typed as U+2039: that character is
  // bidi-mirrored, so RTL mirrored it once and the CSS flip mirrored it twice.
  chevron: "M9 5.5 15.5 12 9 18.5",
  check: "M5 12.5 10 17.5 19 7",
  external: "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
  dashboard: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 12l4.5-4.5",
  governance: "M12 3v18M5.5 8.5h13M4 17.5h16M7.5 8.5l-3 6h6l-3-6ZM16.5 8.5l-3 6h6l-3-6Z",
  transition: "M3 17c3.5 0 3.5-10 7-10s3.5 10 7 10M17 13.5 21 17l-4 3.5",
  institutions: "M4 9.5 12 4l8 5.5M6 10v9M10 10v9M14 10v9M18 10v9M3 20.5h18",
  archive: "M4 4h7a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H4ZM20 4h-3a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H20Z",
  research: "M5 4h9l3 3v13H5ZM14 4v3h3M8 12h6M8 16h4",
  verification: "M12 3 4.5 6v6c0 4.2 3 7.4 7.5 9 4.5-1.6 7.5-4.8 7.5-9V6L12 3ZM9 12l2.2 2.2L15.5 10",
  accountability: "M20 12a8 8 0 1 1-2.6-5.9M20 4v4h-4M8 12h8M8 15.5h5",
  services: "M9.5 14.5 14.5 9.5M7.5 11 5 13.5a3.5 3.5 0 1 0 5 5l2.5-2.5M16.5 13l2.5-2.5a3.5 3.5 0 1 0-5-5L11.5 8",
  projects: "M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3ZM12 21v-9M12 12l8-4.5M12 12 4 7.5",
  lab: "M12 3v5M12 16a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM5 8h14M12 3l-7 5M12 3l7 5",
  bank: "M4 20.5h16M5.5 20.5V10M9.5 20.5V10M14.5 20.5V10M18.5 20.5V10M12 3.5 3.5 8.5h17L12 3.5ZM12 8.5v2M10.4 10.5h3.2",
  legacy: "M12 3.5 13.8 9l5.7.3-4.5 3.5 1.6 5.5-4.6-3.4-4.6 3.4L9 12.8 4.5 9.3 10.2 9Z",
  flag: "M6 3v18M6 4h10l-1.5 4L16 12H6",
  info: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 11v5M12 7.6v.9",
  warning: "M12 3.5 21 20H3l9-16.5ZM12 10v4.5M12 17.4v.6",
  lock: "M6.5 10.5h11v9h-11zM9 10.5V8a3 3 0 0 1 6 0v2.5",
  filter: "M3.5 5.5h17l-6.5 7.5v5.5l-4 2v-7.5Z",
  copy: "M9 9h10v10H9zM5 15V5h10",
  // The five level glyphs. They existed only as names in the level chooser, so
  // every one of them rendered as an empty box until now.
  eye: "M2.5 12S6.2 5.5 12 5.5 21.5 12 21.5 12S17.8 18.5 12 18.5 2.5 12 2.5 12ZM12 9.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Z",
  shield: "M12 3 5 6v5.4c0 4 2.7 7.1 7 8.6 4.3-1.5 7-4.6 7-8.6V6l-7-3Z",
  ballot: "M5 4.5h14v15H5ZM8.4 11.6l2.2 2.2 4.4-4.4",
  org: "M12 3v4.5M4.5 21v-5h4v5M10 21v-5h4v5M15.5 21v-5h4v5M6.5 12.5h11L12 7.5l-5.5 5Z",
  gavel: "M14.6 3.4l6 6M9.4 5.6l8.9 8.9M4 21l7.6-7.6M3.5 14.5l5.9 5.9"
};

export function Icon({ name, size = 16, title, className = "" }) {
  const path = PATHS[name];
  if (!path) return null;

  return (
    <svg
      className={`icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : "true"}
      role={title ? "img" : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <path d={path} />
    </svg>
  );
}

export const MODULE_ICONS = {
  dashboard: "dashboard",
  governance: "governance",
  transition: "transition",
  institutions: "institutions",
  "historical-archive": "archive",
  research: "research",
  verification: "verification",
  accountability: "accountability",
  "public-services": "services",
  projects: "projects",
  simulations: "lab",
  "digital-legacy": "legacy"
};
