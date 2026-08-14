/**
 * Motion — SURYA_CACAO_BUILD_PLAN.md §3.2, M1–M13.
 *
 * ⚠ HARD RULE (constraint §6.3): nothing outside this folder imports GSAP or
 * Framer Motion. Page sections compose these instead. Enforced by
 * `npm run check`.
 *
 * Each component owns its own prefers-reduced-motion fallback internally —
 * "the single decision that keeps accessibility from becoming a rewrite in
 * week eight."
 */
export { ReducedMotionProvider, useReducedMotion } from "./ReducedMotionProvider"; // M13
export { SmoothScroll } from "./SmoothScroll"; // M1
export { Reveal } from "./Reveal"; // M2
export { KenBurns } from "./KenBurns"; // M3
export { MagneticButton } from "./MagneticButton"; // M4
export { UnderlineLink } from "./UnderlineLink"; // M5
export { TiltCard } from "./TiltCard"; // M6
export { Scrollytelling, type ScrollytellingRender } from "./Scrollytelling"; // M11
export { PageTransition } from "./PageTransition"; // M12
export { CustomCursor } from "./CustomCursor"; // M7
export { SunriseMark, SunriseProgress } from "./SunriseMark"; // M8
export { HeroPour } from "./HeroPour"; // M9
export { PourWipe } from "./PourWipe"; // M10
