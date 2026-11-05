// Theme resolution, in one place so the inline pre-paint script in index.html
// and the React shell cannot disagree (issue #34).
import { readStored } from "./api.js";

export const THEME_COLOR = { light: "#f3f6f4", dark: "#101a24" };

/** What the operating system asks for, or light when it cannot say. */
export function systemTheme() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return "light";
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

/**
 * The theme to paint with: an explicit choice wins, otherwise the OS decides.
 * `null` means "nothing stored", which is not the same as "light".
 */
export function readTheme() {
  const stored = readStored("cep.theme", null);
  if (stored === "light" || stored === "dark") return stored;
  return systemTheme();
}

/** True when the reader has made an explicit choice we must not override. */
export function hasStoredTheme() {
  const stored = readStored("cep.theme", null);
  return stored === "light" || stored === "dark";
}
