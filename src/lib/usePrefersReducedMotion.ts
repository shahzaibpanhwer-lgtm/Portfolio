"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/**
 * Hydration-safe stand-in for motion's useReducedMotion.
 *
 * motion's hook reads the media query on the client's first render, but
 * the server can't know it and renders the animated tree. Under reduced
 * motion the two trees differ and React throws away the server HTML.
 * Here the first client render reports `false` to match the server, then
 * re-renders with the real preference once hydrated.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
