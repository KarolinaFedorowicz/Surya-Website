// M7 — CustomCursor. SURYA_CACAO_BUILD_PLAN.md §3.2
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

import { useReducedMotion } from "./ReducedMotionProvider";
import { useIsTouch } from "@/hooks/useIsTouch";
import { DURATION, EASE_SURYA } from "@/config/motion";

/**
 * A small ring echoing the sun mark. DESKTOP ONLY — constraint §6.12, gated
 * behind useIsTouch.
 *
 * The native cursor is NOT hidden. Replacing it entirely is a common flourish
 * and a genuine accessibility regression: it removes the pointer shape that
 * signals text-select, link, disabled and resize. The ring trails alongside
 * it, scaling up over interactive targets, so the affordance survives.
 *
 * Position is written with gsap.quickTo on transform only — no layout, and one
 * interruptible tween instance rather than one per mousemove.
 */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isTouch = useIsTouch();

  useEffect(() => {
    // brief §4.1: parallax and cursor effects disable entirely under reduced
    // motion. Nothing is even mounted.
    if (reduced || isTouch) return;

    const ring = ringRef.current;
    if (!ring) return;

    const ease = `cubic-bezier(${EASE_SURYA.join(",")})`;
    const xTo = gsap.quickTo(ring, "x", { duration: DURATION.base, ease });
    const yTo = gsap.quickTo(ring, "y", { duration: DURATION.base, ease });

    let visible = false;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!visible) {
        visible = true;
        gsap.to(ring, { autoAlpha: 1, duration: DURATION.base, ease });
      }
      xTo(e.clientX);
      yTo(e.clientY);

      const target = e.target as HTMLElement | null;
      const interactive = !!target?.closest(
        'a, button, [role="button"], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      gsap.to(ring, {
        scale: interactive ? 1.8 : 1,
        duration: DURATION.base,
        ease,
      });
    };

    const onLeave = () => {
      visible = false;
      gsap.to(ring, { autoAlpha: 0, duration: DURATION.base, ease });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(ring);
    };
  }, [reduced, isTouch]);

  if (reduced || isTouch) return null;

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="border-accent pointer-events-none fixed top-0 left-0 z-[200] size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border opacity-0 mix-blend-difference"
      style={{ willChange: "transform" }}
    />
  );
}
