// M5 — UnderlineLink. SURYA_CACAO_BUILD_PLAN.md §3.2
"use client";

import type { ReactNode } from "react";

import { useReducedMotion } from "./ReducedMotionProvider";
import { cn } from "@/lib/utils";

/**
 * Left-to-right underline draw. Wraps P6 TextLink.
 *
 * P6 already ships a CSS-only draw so links work before hydration and without
 * JS. This wrapper's job is only to switch that off under reduced motion —
 * which it does by setting a data attribute the primitive's styles key off,
 * rather than by re-implementing the animation in GSAP.
 *
 * That looks like a thin component, and it is. It exists so page sections
 * never have to know about the motion preference themselves (constraint §6.3),
 * and so M5 has a real home in the inventory rather than being an invisible
 * behaviour buried in a primitive.
 */
export function UnderlineLink({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <span
      data-reduced={reduced ? "true" : undefined}
      className={cn(
        // Cancels the draw; the resting rule stays, so the link is still
        // obviously a link — it just appears rather than sweeps.
        "[&[data-reduced]_a::after]:transition-none [&[data-reduced]_a::after]:scale-x-100",
        className,
      )}
    >
      {children}
    </span>
  );
}
