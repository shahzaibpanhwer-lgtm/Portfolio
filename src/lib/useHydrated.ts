"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * False during SSR and the hydrating render, true after. For UI that
 * depends on the visitor's clock or time zone, which the server can't know.
 */
export function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
