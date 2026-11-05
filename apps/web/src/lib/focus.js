import { useEffect, useRef } from "react";

// Everything a keyboard user can land on inside a container.
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "summary",
  "[tabindex]:not([tabindex='-1'])"
].join(",");

/**
 * Focusable children of `root`, in DOM order, skipping anything that is hidden
 * (off-screen, `display: none`, `visibility: hidden`, or inside an `inert`
 * subtree) so a trap never sends focus somewhere it cannot be seen.
 */
export function focusableWithin(root) {
  if (!root || typeof root.querySelectorAll !== "function") return [];
  return [...root.querySelectorAll(FOCUSABLE_SELECTOR)].filter((element) => {
    if (element.hasAttribute("disabled")) return false;
    if (element.getAttribute("tabindex") === "-1") return false;
    if (element.closest("[inert]")) return false;
    if (element.getAttribute("aria-hidden") === "true") return false;
    if (typeof element.getClientRects === "function" && element.getClientRects().length === 0) return false;
    return true;
  });
}

/**
 * Keeps keyboard focus inside an overlay while it is open.
 *
 * - On activation, remembers what had focus and moves focus to `initialFocus`
 *   (or the first focusable child).
 * - Tab / Shift+Tab wrap around inside the container instead of walking into the
 *   page behind the overlay.
 * - Escape calls `onEscape`.
 * - On close (or unmount) focus returns to whatever opened the overlay, so a
 *   keyboard user is never dropped back at the top of the document.
 *
 * Returns a ref to attach to the container that must hold the focus.
 */
export function useFocusTrap({ active, onEscape, initialFocus } = {}) {
  const containerRef = useRef(null);
  const escapeRef = useRef(onEscape);
  const initialRef = useRef(initialFocus);

  escapeRef.current = onEscape;
  initialRef.current = initialFocus;

  useEffect(() => {
    if (!active || typeof document === "undefined") return undefined;
    const container = containerRef.current;
    const previouslyFocused = document.activeElement;

    const focusFirst = () => {
      const target = initialRef.current?.current ?? focusableWithin(container)[0] ?? container;
      target?.focus?.();
    };
    const timer = setTimeout(focusFirst, 0);

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        escapeRef.current?.();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusableWithin(container);
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      const inside = container?.contains(current);
      if (event.shiftKey) {
        if (!inside || current === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (!inside || current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown, true);
      if (previouslyFocused && previouslyFocused !== document.body && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [active]);

  return containerRef;
}

/**
 * True when the reader asked for reduced motion. Used for the programmatic
 * scroll after a route change, because `scrollTo({behavior})` ignores the CSS
 * `prefers-reduced-motion` block.
 */
export function prefersReducedMotion() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
