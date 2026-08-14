// M4 — MagneticButton. SURYA_CACAO_BUILD_PLAN.md §3.2
"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";

import { useReducedMotion } from "./ReducedMotionProvider";
import { useIsTouch } from "@/hooks/useIsTouch";
import { MAGNETIC, DURATION, EASE_SURYA } from "@/config/motion";

/**
 * Cursor-pull on primary CTAs. Wraps P5 Button rather than modifying it —
 * plan M4: "magnetic hover comes from wrapping, not from inside", which is
 * what keeps GSAP out of primitives/.
 *
 * Listens on the WRAPPER, not the button, so the pull begins slightly before
 * the cursor arrives — that anticipation is the whole effect. The wrapper is
 * inline-block and padded by the pull radius so it doesn't change layout.
 *
 * gsap.quickTo gives an interruptible tween that reuses one instance instead
 * of allocating a new tween per mousemove.
 *
 * Off entirely on touch (no cursor to be magnetic toward) and under reduced
 * motion, where the button simply sits still.
 */
export function MagneticButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const targetRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const isTouch = useIsTouch();

  useEffect(() => {
    if (reduced || isTouch) return;
    const wrap = wrapRef.current;
    const target = targetRef.current;
    if (!wrap || !target) return;

    const xTo = gsap.quickTo(target, "x", {
      duration: DURATION.base,
      ease: `cubic-bezier(${EASE_SURYA.join(",")})`,
    });
    const yTo = gsap.quickTo(target, "y", {
      duration: DURATION.base,
      ease: `cubic-bezier(${EASE_SURYA.join(",")})`,
    });

    const onMove = (e: PointerEvent) => {
      const rect = target.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy);
      const falloff = Math.max(0, 1 - distance / (MAGNETIC.radius + rect.width / 2));

      xTo(dx * falloff * (MAGNETIC.strength / 40));
      yTo(dy * falloff * (MAGNETIC.strength / 40));
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(target);
    };
  }, [reduced, isTouch]);

  return (
    <span
      ref={wrapRef}
      className={className}
      style={{ display: "inline-block", padding: MAGNETIC.strength }}
    >
      <span ref={targetRef} style={{ display: "inline-block" }}>
        {children}
      </span>
    </span>
  );
}
