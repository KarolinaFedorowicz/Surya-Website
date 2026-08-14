// M11 — Scrollytelling. SURYA_CACAO_BUILD_PLAN.md §3.2
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "./ReducedMotionProvider";
import { observeScrollProgress } from "@/lib/motion/scrollProgress";
import { SCROLLYTELLING } from "@/config/motion";
import { cn } from "@/lib/utils";

/**
 * Shared pin + scrub wrapper. Serves BOTH pinned moments — S4's cacao
 * cross-section and S8's family map (plan §4: "saves a second pin/scrub
 * system").
 *
 * Division of labour, which matters because two constraints meet here:
 *
 * · GSAP ScrollTrigger does the PINNING only (constraint: "GSAP + ScrollTrigger
 *   for all pinning and scroll-scrubbing"). It is good at exactly this and
 *   handles the spacer and refresh-on-resize for free.
 *
 * · The 0–1 float comes from lib/motion/scrollProgress (constraint §6.4).
 *   ScrollTrigger's own `self.progress` is deliberately NOT used — it would be
 *   a second implementation of the same number, which is the thing the plan
 *   calls the most likely way this codebase rots. Both read the same scroll
 *   over the same range, so they stay in step.
 *
 * The render prop receives `{ progress, step, stepProgress }` so a consumer
 * can drive a continuous value, a discrete index, or both.
 *
 * REDUCED MOTION: no pin, no ScrollTrigger, no rAF subscription. The section
 * renders as a static, single-viewport-height block with progress locked at 1,
 * so every step shows its finished state and the content is fully readable by
 * scrolling normally (constraint §6.7 — "pins become static single-viewport
 * sections", and never trap scroll).
 */
export type ScrollytellingRender = (state: {
  /** 0–1 across the whole pinned range. */
  progress: number;
  /** Active step index, 0-based. */
  step: number;
  /** 0–1 within the active step. */
  stepProgress: number;
  /** True when motion is disabled; render the resting state. */
  reduced: boolean;
}) => ReactNode;

export function Scrollytelling({
  steps,
  children,
  className,
  id,
}: {
  /** Number of discrete beats. Drives pin length and step maths. */
  steps: number;
  children: ScrollytellingRender;
  className?: string;
  id?: string;
}) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const trigger = triggerRef.current;
    const pin = pinRef.current;
    if (!trigger || !pin) return;

    gsap.registerPlugin(ScrollTrigger);

    const distance =
      window.innerHeight * SCROLLYTELLING.viewportsPerStep * steps;

    const st = ScrollTrigger.create({
      trigger,
      start: "top top",
      end: `+=${distance}`,
      pin,
      pinSpacing: true,
      // Progress comes from scrollProgress, not from here. See the note above.
      anticipatePin: 1,
    });

    const unsubscribe = observeScrollProgress(trigger, {
      mode: "pin",
      distance,
      lerp: SCROLLYTELLING.lerp,
      onChange: setProgress,
    });

    return () => {
      unsubscribe();
      st.kill();
    };
  }, [reduced, steps]);

  const effective = reduced ? 1 : progress;
  const scaled = effective * steps;
  const step = Math.min(steps - 1, Math.floor(scaled));
  const stepProgress = Math.min(1, scaled - step);

  if (reduced) {
    return (
      <div id={id} className={cn(className)}>
        {children({ progress: 1, step: steps - 1, stepProgress: 1, reduced })}
      </div>
    );
  }

  return (
    <div ref={triggerRef} id={id} className={cn(className)}>
      <div ref={pinRef} className="min-h-svh">
        {children({ progress: effective, step, stepProgress, reduced })}
      </div>
    </div>
  );
}
