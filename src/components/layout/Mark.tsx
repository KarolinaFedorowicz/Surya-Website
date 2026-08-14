// A1/A2 — static mark. M8 SunriseMark replaces the animation half in Phase 8.
import Link from "next/link";

import { cn } from "@/lib/utils";

/** A1 as delivered: an auto-traced compound path, mark only, no wordmark. */
const MARK_SVG = "/assets/logo/surya-mark.svg";
/** A2: the full lockup. Still only the raster — no vector version exists. */
const LOCKUP_PNG = "/assets/logo/surya-lockup.png";

/**
 * Rendered as a CSS mask filled with `currentColor`, not an <img>.
 *
 * Why: the artwork is single-color on transparency. As an image the lockup is
 * brown-on-brown and nearly invisible on Deep Cacao Night — exactly where the
 * nav-over-hero and the footer live. Masking the alpha and filling with
 * currentColor lets the mark take the tone's ink or accent, so it reads on all
 * three surfaces and hardcodes no color.
 *
 * The `emblem` variant now points at the SVG, so it is resolution-independent;
 * `lockup` still uses the raster because no vector of the wordmark exists.
 * When M8 needs to animate the mark it will have to be inlined rather than
 * masked — masks can't be addressed per-subpath — so that swap is Phase 8's.
 */
const ASPECT = {
  /** viewBox 83 92 828 460 */
  emblem: "aspect-[828/460]",
  lockup: "aspect-[513/487]",
} as const;

export type MarkProps = {
  variant?: "emblem" | "lockup";
  className?: string;
  href?: string;
  title?: string;
};

export function Mark({
  variant = "emblem",
  className,
  href,
  title = "Surya Cacao",
}: MarkProps) {
  const src = variant === "emblem" ? MARK_SVG : LOCKUP_PNG;

  const glyph = (
    <span
      role="img"
      aria-label={title}
      className={cn("block bg-current", ASPECT[variant], className)}
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );

  if (!href) return glyph;

  return (
    <Link
      href={href}
      className="text-ink hover:text-emphasis inline-block transition-colors duration-[600ms] ease-surya"
    >
      {glyph}
    </Link>
  );
}
