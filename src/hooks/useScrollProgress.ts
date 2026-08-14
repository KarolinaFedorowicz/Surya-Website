"use client";

import { useEffect, useState, type RefObject } from "react";

import {
  observeScrollProgress,
  type ProgressMode,
} from "@/lib/motion/scrollProgress";
import { useReducedMotion } from "./useReducedMotion";

/**
 * React binding for the ONE scrollProgress implementation. It adds no maths of
 * its own — it only subscribes and unsubscribes.
 *
 * Under reduced motion it returns a static 1: every consumer then paints its
 * completed state, which is the readable resting state constraint §6.7 asks
 * for, rather than freezing at frame zero.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  options: { mode?: ProgressMode; distance?: number; lerp?: number } = {},
): number {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const { mode = "through", distance = 0, lerp = 0.12 } = options;

  useEffect(() => {
    if (reduced) {
      setProgress(1);
      return;
    }
    const el = ref.current;
    if (!el) return;

    return observeScrollProgress(el, {
      mode,
      distance,
      lerp,
      onChange: setProgress,
    });
  }, [ref, mode, distance, lerp, reduced]);

  return progress;
}
