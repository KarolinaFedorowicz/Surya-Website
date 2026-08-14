/**
 * Easing functions for values that are tweened in JS rather than CSS —
 * canvas draws, number counters, scroll damping.
 *
 * These are the curve from brief §4.1 expressed as functions. Anything that
 * can be eased in CSS should use `--ease-surya` instead.
 */

/** The site curve, approximated for scalar tweens. Fast out, long settle. */
export function easeSurya(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Frame-rate-independent damping. Use for scroll smoothing, not for tweens. */
export function damp(
  current: number,
  target: number,
  lambda: number,
  deltaSeconds: number,
): number {
  return current + (target - current) * (1 - Math.exp(-lambda * deltaSeconds));
}

export const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Maps `value` from [inMin, inMax] onto [outMin, outMax], clamped. */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  if (inMax === inMin) return outMin;
  const t = clamp01((value - inMin) / (inMax - inMin));
  return outMin + t * (outMax - outMin);
}
