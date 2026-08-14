/**
 * Motion tokens. Durations, easings, thresholds — the numbers, in one place.
 *
 * The CSS half of these lives in globals.css (`--ease-surya`). This file is
 * for the JS half: GSAP, Lenis and Framer all need the values as data.
 *
 * brief §4.1: "a slow exhale, never a bounce." Nothing under 500ms, nothing
 * spring or elastic.
 */

/** cubic-bezier(0.22, 1, 0.36, 1) — the site's one easing curve. */
export const EASE_SURYA = [0.22, 1, 0.36, 1] as const;
export const EASE_SURYA_CSS = "cubic-bezier(0.22, 1, 0.36, 1)";

export const DURATION = {
  /** The floor. Nothing is allowed to be faster. */
  base: 0.6,
  slow: 0.9,
  /** Ken Burns drift, page transitions out. */
  glacial: 1.2,
} as const;

export const REVEAL = {
  /** brief §4.1: text blocks fade up 8–12px. */
  distance: 10,
  /** ~80ms per line, consistent, never randomised. */
  stagger: 0.08,
  duration: DURATION.slow,
  /** Fraction of the element that must be in view before it triggers. */
  threshold: 0.15,
  /** Pull the trigger line up so reveals start slightly before the edge. */
  rootMargin: "0px 0px -10% 0px",
} as const;

export const KEN_BURNS = {
  /** 2–3% scale over 8–10s. */
  scale: 1.03,
  duration: 10,
} as const;

export const TILT = {
  /** Degrees at the far corner. Subtle — this is not a novelty card. */
  max: 4,
  /** Seconds to settle back to rest. */
  settle: DURATION.base,
} as const;

export const MAGNETIC = {
  /** Pixels the button may drift toward the cursor. */
  strength: 12,
  /** Radius in px within which the pull applies. */
  radius: 90,
} as const;

export const LENIS = {
  /** Weighted, not native-abrupt. brief §4.1 */
  duration: 1.1,
  wheelMultiplier: 0.9,
} as const;

export const SCROLLYTELLING = {
  /**
   * Pin length as a multiple of viewport height. Long enough that each step
   * gets real scroll distance, short enough that it never feels trapped.
   */
  viewportsPerStep: 0.8,
  /** Damping applied to the raw scroll float. 1 = no smoothing. */
  lerp: 0.12,
} as const;
