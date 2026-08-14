// M1 — SmoothScroll. SURYA_CACAO_BUILD_PLAN.md §3.2
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "./ReducedMotionProvider";
import { LENIS } from "@/config/motion";

/**
 * Lenis provider — weighted scroll physics site-wide (brief §4.1).
 *
 * Three things worth knowing:
 *
 * 1. Lenis is driven from GSAP's ticker rather than its own rAF loop. Two
 *    independent loops would tear against each other on a pinned section;
 *    sharing one keeps ScrollTrigger's pin and the scroll position on the same
 *    frame. Constraint §6.6 — one pass per paint.
 *
 * 2. `ScrollTrigger.update` is subscribed to Lenis's scroll event, because
 *    Lenis moves the page with a transform and ScrollTrigger would otherwise
 *    never hear about it.
 *
 * 3. Under reduced motion Lenis is not instantiated at all — native scrolling
 *    is the readable resting state, and smoothing a scroll someone asked to be
 *    plain is exactly the kind of thing the preference exists to prevent.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: LENIS.duration,
      wheelMultiplier: LENIS.wheelMultiplier,
      // Never smooth touch — it fights the platform's own momentum and is the
      // usual reason smooth-scroll libraries feel broken on phones.
      smoothWheel: true,
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [reduced]);

  return <>{children}</>;
}
