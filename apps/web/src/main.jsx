import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/600.css";
import "@fontsource/vazirmatn/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import "./styles.css";
import { bootstrapTelegramMock } from "./platform/telegram/index.js";

// `?tg-mock=1` installs a fabricated bridge before the first render, so the
// Mini App layout can be worked on in a plain browser (docs/telegram/).
bootstrapTelegramMock();

// The outermost boundary is the last line of defence: if the shell itself
// throws, the reader still gets a heading, a sentence and a way back instead of
// a blank page (issue #32).
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary lang="fa">
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
