"use client";

import { useMediaQuery } from "./useMediaQuery";

/**
 * True when the primary input has no hover — phones, tablets.
 *
 * Gates M7 CustomCursor (constraint §6.12) and the magnetic pull, both of
 * which are meaningless without a pointer. `(hover: none)` is the right query
 * rather than a width breakpoint: a touchscreen laptop is wide but still has
 * no useful cursor to be magnetic toward.
 */
export function useIsTouch(): boolean {
  return useMediaQuery("(hover: none), (pointer: coarse)");
}
