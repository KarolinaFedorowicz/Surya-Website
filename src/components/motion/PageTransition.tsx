// M12 — PageTransition. SURYA_CACAO_BUILD_PLAN.md §3.2
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

import { useReducedMotion } from "./ReducedMotionProvider";
import { DURATION, EASE_SURYA } from "@/config/motion";

/**
 * Framer AnimatePresence route transitions. The ONLY place Framer is used —
 * constraint §6.3 and the stack note both scope it to route transitions.
 *
 * A cross-fade, not a slide: the brief's transition device is the pour (M10)
 * and the Sunrise Reveal (M8), and a third competing page-level motion would
 * be exactly the "several competing ideas" the brief warns against. This keeps
 * navigation from feeling like a hard cut without inventing a fourth metaphor.
 *
 * `mode="wait"` would blank the page for the length of the exit, which reads
 * as a stall on a fast connection. Overlapping the two keeps it continuous.
 *
 * Under reduced motion children render directly — no AnimatePresence, no
 * wrapper, no opacity animation at all.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: DURATION.base,
          ease: [...EASE_SURYA] as [number, number, number, number],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
