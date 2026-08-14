// M10 — PourWipe. SURYA_CACAO_BUILD_PLAN.md §3.2
"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "./ReducedMotionProvider";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { observeScrollProgress } from "@/lib/motion/scrollProgress";
import { clamp01 } from "@/lib/motion/easings";
import {
  preloadOnApproach,
  type FrameSequence,
} from "@/lib/motion/frameLoader";
import { BRAND } from "@/config/brand";
import { cn } from "@/lib/utils";

/**
 * Canvas alpha frame sequence. Chocolate sweeps across a section boundary and
 * its trailing edge uncovers the next section — reused at EVERY boundary
 * (plan §4: "one PourWipe, footage mirrored/reused").
 *
 * · Frames lazy-load via IntersectionObserver shortly before the zone
 *   approaches (brief §4.3.6), never on first paint.
 * · Exactly one canvas draw per paint, inside requestAnimationFrame
 *   (constraint §6.6). `Math.floor(progress * (frameCount - 1))` picks the
 *   frame, and a repeat index is skipped rather than redrawn.
 * · Mobile keeps scrubbing at a reduced frame count (brief §4.3.8).
 * · REDUCED MOTION → a cross-fade, not a wipe (constraint §6.7), which here
 *   means the zone simply renders nothing and the two sections meet directly.
 *
 * ⛔ A9 does not exist. `frameLoader` probes frame 1, gets a 404, and reports
 * `available: false` — so the procedural stand-in draws instead. Dropping
 * wipe-frame-0001.webp … 0030.webp into /assets/cacao-motion/ switches it over
 * with no code change.
 */
export function PourWipe({
  className,
  /** Height of the wipe zone, as a fraction of the viewport. brief: 40–60vh. */
  zone = 0.5,
}: {
  className?: string;
  zone?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [sequence, setSequence] = useState<FrameSequence | null>(null);

  /* ---- Lazy-load the frames as the zone approaches. ---- */
  useEffect(() => {
    if (reduced) return;
    const el = wrapRef.current;
    if (!el) return;

    return preloadOnApproach(el, setSequence, {
      // Mobile scrubs at a reduced frame count.
      count: isMobile ? 15 : 30,
    });
  }, [reduced, isMobile]);

  /* ---- Size the canvas to its box, DPR-aware. ---- */
  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // See HeroPour: a one-shot measure can catch the canvas before layout.
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.offsetWidth * dpr);
      const h = Math.round(canvas.offsetHeight * dpr);
      if (w === 0 || h === 0) return;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    return () => observer.disconnect();
  }, [reduced]);

  /* ---- Scrub. ---- */
  useEffect(() => {
    if (reduced) return;
    const el = wrapRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;

    let frame = 0;
    let pending = 0;
    let lastIndex = -1;

    const paint = () => {
      frame = 0;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (sequence?.available && sequence.frames.length) {
        const index = Math.floor(
          clamp01(pending) * (sequence.frames.length - 1),
        );
        // Nothing changed; don't burn a paint redrawing the same bitmap.
        if (index === lastIndex) return;
        lastIndex = index;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(sequence.frames[index], 0, 0, canvas.width, canvas.height);
      } else {
        drawWipeStandIn(canvas, pending);
      }
    };

    const unsubscribe = observeScrollProgress(el, {
      mode: "through",
      lerp: 0.12,
      onChange: (p) => {
        pending = p;
        if (frame) return;
        frame = requestAnimationFrame(paint);
      },
    });

    return () => {
      unsubscribe();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced, sequence]);

  // Reduced motion: the wipe becomes nothing at all — the two sections meet
  // directly, which is the readable resting state.
  if (reduced) return null;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={cn("pointer-events-none relative w-full", className)}
      style={{ height: `${zone * 100}vh` }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  );
}

/**
 * Procedural stand-in for A9 (§1.B).
 *
 * A chocolate mass sweeps left-to-right with an organic trailing edge, so the
 * section below is uncovered behind it. Colours come from the tokens at call
 * time. Deliberately abstract — it demonstrates the wipe MECHANIC without
 * pretending to be the footage.
 */
function drawWipeStandIn(canvas: HTMLCanvasElement, progress: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { width: w, height: h } = canvas;
  ctx.clearRect(0, 0, w, h);

  const p = clamp01(progress);
  if (p <= 0 || p >= 1) return;

  const night =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--color-night")
      .trim() || BRAND.night;

  // The sweep travels 0 → 1 across the width, with the trailing edge lagging
  // so the mass has body rather than being a hard vertical line.
  const lead = p * (w * 1.4) - w * 0.2;
  const trail = lead - w * 0.45;

  ctx.fillStyle = night;
  ctx.beginPath();
  ctx.moveTo(trail, 0);
  ctx.lineTo(lead, 0);

  // Leading edge: a slow curve with two lobes, so it reads as liquid.
  for (let y = 0; y <= h; y += h / 20) {
    const t = y / h;
    const bulge = Math.sin(t * Math.PI) * w * 0.06;
    const ripple = Math.sin(t * Math.PI * 4 + p * 6) * w * 0.015;
    ctx.lineTo(lead + bulge + ripple, y);
  }

  ctx.lineTo(trail, h);
  ctx.closePath();
  ctx.fill();
}
