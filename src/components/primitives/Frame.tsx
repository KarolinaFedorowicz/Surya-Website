import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * P9 — Frame. Art-directed image wrapper: fixed aspect ratio, Next/Image
 * config, warm placeholder, never a white lightbox background.
 *
 * Right now the placeholder path is the MAIN path. Per §7, no farm, family or
 * product photography exists, and stock and AI stand-ins are both ruled out —
 * so a Frame with no `src` renders a brand-colored block at the correct ratio.
 * That keeps every page's layout honest about its real proportions, and
 * dropping real photography in later is purely additive.
 *
 * The placeholder is built from tone roles, so it re-colors per Section
 * automatically and can never 404.
 */
const RATIO = {
  square: "aspect-square",
  /** Product bags and portraits. */
  portrait: "aspect-[3/4]",
  /** Tall editorial crop — the meadow stills in the brief are roughly this. */
  tall: "aspect-[4/5]",
  landscape: "aspect-[4/3]",
  /** Full-bleed section media. */
  wide: "aspect-[16/9]",
  /** Hero banding. */
  cinematic: "aspect-[21/9]",
} as const;

export type FrameProps = {
  ratio?: keyof typeof RATIO;
  /** Omit while photography is outstanding — renders the placeholder. */
  src?: string;
  /**
   * Required whenever `src` is set. Placeholders are decorative by definition,
   * so they are marked aria-hidden rather than given invented alt text.
   */
  alt?: string;
  /** Shown inside the placeholder so a layout review can read what goes here. */
  label?: string;
  priority?: boolean;
  /** Next/Image `sizes`. Defaults to full-width, which is safe but not optimal. */
  sizes?: string;
  className?: string;
};

export function Frame({
  ratio = "portrait",
  src,
  alt,
  label,
  priority = false,
  sizes = "100vw",
  className,
}: FrameProps) {
  const shell = cn(
    "relative isolate w-full overflow-hidden bg-surface",
    RATIO[ratio],
    className,
  );

  if (!src) {
    return (
      <div className={shell} aria-hidden="true" data-placeholder="true">
        {/* Warm tonal wash — two brand surfaces, no new color, no shadow. */}
        <div className="from-ink/12 to-ink/5 absolute inset-0 bg-gradient-to-br" />
        <div className="border-hairline absolute inset-0 border" />
        {label ? (
          <span className="text-muted font-body text-caption absolute bottom-4 left-4 uppercase [font-variant-caps:all-small-caps]">
            {label}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className={shell}>
      <Image
        src={src}
        alt={alt ?? ""}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
