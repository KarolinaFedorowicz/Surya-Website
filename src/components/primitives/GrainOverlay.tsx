// P8 — GrainOverlay. SURYA_CACAO_BUILD_PLAN.md §3.1
import { cn } from "@/lib/utils";

const OPACITY = {
  /** brief §3.4: 2–4%. Two steps inside that band, nothing outside it. */
  faint: "opacity-[0.02]",
  normal: "opacity-[0.035]",
} as const;

export type GrainStrength = keyof typeof OPACITY;

/**
 * Faint warm paper grain. Purely decorative and never interactive.
 *
 * Depth on this site comes from grain, layered surface tones, and negative
 * space — never drop shadows. — brief §3.4
 *
 * Renders a generated fractal-noise texture (`--grain-image` in globals.css),
 * not an asset, so it costs no request and cannot 404.
 */
export function GrainOverlay({
  strength = "normal",
  className,
}: {
  strength?: GrainStrength;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 bg-repeat mix-blend-multiply",
        "bg-[image:var(--grain-image)] bg-[length:140px_140px]",
        OPACITY[strength],
        className,
      )}
    />
  );
}
