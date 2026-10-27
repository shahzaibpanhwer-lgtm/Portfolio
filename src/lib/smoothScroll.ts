import type Lenis from "lenis";

/**
 * The one Lenis instance, shared through a module rather than context so
 * that components outside the provider subtree (the navbar sheet, which
 * locks scroll) can reach it without prop-drilling.
 */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}
