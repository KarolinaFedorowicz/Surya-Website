// M13 — ReducedMotionProvider. SURYA_CACAO_BUILD_PLAN.md §3.2
"use client";

import { createContext, useContext } from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * Single source of truth for the motion preference. Every M-component reads
 * from here rather than calling matchMedia itself — one listener for the whole
 * tree, and one place to force-disable motion if we ever need to.
 *
 * Defaults to `true` (reduced) until the effect in useMediaQuery resolves. The
 * safe default is "no motion": a component that briefly renders its resting
 * state and then animates is fine, whereas one that animates and then discovers
 * the visitor asked it not to has already broken the promise.
 */
const ReducedMotionContext = createContext(true);

export function ReducedMotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const resolved = useMediaQuery("(prefers-reduced-motion: no-preference)");

  // `resolved` tells us the query has actually been evaluated client-side.
  // Until then we stay reduced.
  const reduced = resolved ? prefersReduced : true;

  return (
    <ReducedMotionContext.Provider value={reduced}>
      {children}
    </ReducedMotionContext.Provider>
  );
}

export function useReducedMotion(): boolean {
  return useContext(ReducedMotionContext);
}
