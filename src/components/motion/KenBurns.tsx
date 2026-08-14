// M3 — KenBurns. SURYA_CACAO_BUILD_PLAN.md §3.2
"use client";

import type { ReactNode } from "react";

import { useReducedMotion } from "./ReducedMotionProvider";
import { KEN_BURNS, EASE_SURYA_CSS } from "@/config/motion";
import { cn } from "@/lib/utils";

/**
 * Slow 2–3% scale drift on static photography. "No hero image is ever
 * hard-static." — plan M3
 *
 * A CSS keyframe animation on `transform` only: no scroll listener, nothing
 * layout-triggering, and the compositor handles it on its own thread. The
 * animation alternates rather than looping, so it eases back out instead of
 * snapping to the start every ten seconds.
 *
 * Reduced motion renders the image plain — which is exactly what a static
 * photograph looks like, so there is no degraded state to design around.
 */
export function KenBurns({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className="size-full"
        style={
          reduced
            ? undefined
            : {
                animation: `surya-ken-burns ${KEN_BURNS.duration}s ${EASE_SURYA_CSS} infinite alternate`,
                willChange: "transform",
              }
        }
      >
        {children}
      </div>
    </div>
  );
}
