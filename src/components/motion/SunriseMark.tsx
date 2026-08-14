// M8 — SunriseMark. SURYA_CACAO_BUILD_PLAN.md §3.2
"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "./ReducedMotionProvider";
import { observeScrollProgress } from "@/lib/motion/scrollProgress";
import { DURATION, EASE_SURYA_CSS } from "@/config/motion";
import { cn } from "@/lib/utils";

/**
 * The gold mark drawing itself on load, and the nav scroll-progress indicator.
 *
 * ⚠ THE A1 SITUATION, stated plainly.
 *
 * brief §3.3 asks for the mark to draw "stroke-by-stroke, like tracing a
 * mandala". That needs open paths with strokes so `stroke-dashoffset` can
 * advance along their length. What was delivered is an AUTO-TRACE: a single
 * compound path, `fill-rule="evenodd"`, 195 sub-paths, no stroke anywhere.
 * Running dashoffset on it would outline 195 shapes simultaneously in
 * arbitrary order — not a mandala being traced, just a shimmer.
 *
 * So this ships TWO code paths:
 *
 * 1. `sweep` (DEFAULT, works today) — a radial mask opens across the filled
 *    mark, so it dawns from the centre outward. brief §4.4 literally describes
 *    the Sunrise Reveal as "gold sun-line draws itself centre-screen, then
 *    radial-wipes", so this is close to the brief's own language and is
 *    achievable with the asset that exists.
 *
 * 2. `stroke` (READY, pending A1) — the real stroke-by-stroke draw, written
 *    and working against `PLACEHOLDER_PATHS` below. Swap those for the real
 *    open-path SVG and pass mode="stroke". Nothing else changes.
 *
 * The nav progress ring uses a real circle, so it is a genuine
 * stroke-dashoffset and needs no placeholder at all.
 */
const MARK_SVG = "/assets/logo/surya-mark.svg";

/**
 * Stand-in geometry for A1 — a sun disc and twelve rays as OPEN paths, which
 * is the shape the real asset needs to be in. Present so the stroke-draw path
 * is genuinely exercised rather than theoretical.
 */
const PLACEHOLDER_PATHS = [
  "M60 34a26 26 0 1 0 0 52 26 26 0 1 0 0-52",
  ...Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    const x1 = 60 + Math.cos(a) * 31;
    const y1 = 60 + Math.sin(a) * 31;
    const x2 = 60 + Math.cos(a) * 44;
    const y2 = 60 + Math.sin(a) * 44;
    return `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }),
];

export function SunriseMark({
  mode = "sweep",
  className,
  title = "Surya Cacao",
}: {
  /** "stroke" requires A1 as open paths. See the note above. */
  mode?: "sweep" | "stroke";
  className?: string;
  title?: string;
}) {
  const reduced = useReducedMotion();
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (reduced) {
      setDrawn(true);
      return;
    }
    // One frame's delay so the transition has a starting state to run from.
    const id = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(id);
  }, [reduced]);

  if (mode === "stroke") {
    const length = 400;
    return (
      <svg
        viewBox="0 0 120 120"
        role="img"
        aria-label={title}
        className={cn("text-accent", className)}
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        >
          {PLACEHOLDER_PATHS.map((d, i) => (
            <path
              key={d}
              d={d}
              strokeDasharray={length}
              strokeDashoffset={drawn ? 0 : length}
              style={{
                transition: reduced
                  ? "none"
                  : `stroke-dashoffset ${DURATION.glacial}s ${EASE_SURYA_CSS}`,
                // Sequenced outward from the disc — the "tracing" quality.
                transitionDelay: reduced ? "0s" : `${i * 0.06}s`,
              }}
            />
          ))}
        </g>
      </svg>
    );
  }

  // Default: radial sweep over the filled trace.
  return (
    <span
      role="img"
      aria-label={title}
      className={cn("block bg-current", className)}
      style={{
        WebkitMaskImage: `url(${MARK_SVG})`,
        maskImage: `url(${MARK_SVG})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        // The dawn: a radial gradient aperture opening from the centre.
        clipPath: drawn ? "circle(75% at 50% 50%)" : "circle(0% at 50% 50%)",
        opacity: drawn ? 1 : 0,
        transition: reduced
          ? "none"
          : `clip-path ${DURATION.glacial}s ${EASE_SURYA_CSS}, opacity ${DURATION.base}s ${EASE_SURYA_CSS}`,
      }}
    />
  );
}

/**
 * The nav scroll-progress indicator — "the mark's rays fill in as you descend"
 * (brief §4.4), expressed as a ring around the mark.
 *
 * Reads the ONE scrollProgress implementation against the document body, so it
 * shares the same rAF loop as every other consumer (constraint §6.4).
 */
export function SunriseProgress({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const ref = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (reduced) return;
    // The whole document is the element being scrolled through.
    return observeScrollProgress(document.body, {
      mode: "through",
      lerp: 0.14,
      onChange: setProgress,
    });
  }, [reduced]);

  // A real circle, so this is a genuine stroke-dashoffset — no placeholder.
  const r = 15;
  const circumference = 2 * Math.PI * r;

  if (reduced) return null;

  return (
    <svg
      viewBox="0 0 34 34"
      aria-hidden="true"
      className={cn("text-accent", className)}
    >
      <circle
        cx="17"
        cy="17"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.2"
      />
      <circle
        ref={ref}
        cx="17"
        cy="17"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - progress)}
        transform="rotate(-90 17 17)"
      />
    </svg>
  );
}
