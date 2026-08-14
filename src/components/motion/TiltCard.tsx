// M6 — TiltCard. SURYA_CACAO_BUILD_PLAN.md §3.2
"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";

import { useReducedMotion } from "./ReducedMotionProvider";
import { useIsTouch } from "@/hooks/useIsTouch";
import { TILT, DURATION, EASE_SURYA } from "@/config/motion";
import { cn } from "@/lib/utils";

/**
 * Subtle 3D tilt. Shared by recipe cards, product cards and partnership type
 * cards — plan §4 consolidates three hover implementations into this one.
 *
 * Capped at 4° (config/motion.ts): enough to register as a response, not
 * enough to read as a gimmick on a luxury page.
 *
 * Transform only, on the compositor, killed on unmount. Off on touch — a tilt
 * that needs a hovering pointer has no meaning on a phone and would fire
 * spuriously on tap.
 */
export function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isTouch = useIsTouch();

  useEffect(() => {
    if (reduced || isTouch) return;
    const el = ref.current;
    if (!el) return;

    const ease = `cubic-bezier(${EASE_SURYA.join(",")})`;
    const rotX = gsap.quickTo(el, "rotationX", { duration: DURATION.base, ease });
    const rotY = gsap.quickTo(el, "rotationY", { duration: DURATION.base, ease });

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      // -0.5 … 0.5 from the card's centre.
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      rotY(px * TILT.max * 2);
      rotX(-py * TILT.max * 2);
    };

    const onLeave = () => {
      gsap.to(el, {
        rotationX: 0,
        rotationY: 0,
        duration: TILT.settle,
        ease,
      });
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [reduced, isTouch]);

  return (
    <div style={{ perspective: 900 }} className={cn(className)}>
      <div ref={ref} style={{ transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </div>
  );
}
