/**
 * The sun mark, drawn as a CSS mask so it takes its color from `currentColor`
 * like any other glyph — Aubergine on light chrome, Sand Paper on dark.
 *
 * An <img> would render the SVG's own fill and ignore the surrounding token,
 * and inlining the path would put ~10KB of path data into every page.
 *
 * Optical centring: when the mark sits beside a wordmark, box-centre alignment
 * looks low, because the word's descender pulls its box down while the eye
 * centres on the cap block. Gilda's descender measures 0.284em, so callers
 * lift the mark by half of that — hence `text-h3 -translate-y-[0.142em]`,
 * where text-h3 makes the em resolve against the wordmark's own size so the
 * correction scales with the fluid type rather than being a fixed nudge.
 */
export default function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block bg-current ${className ?? ""}`}
      style={{
        WebkitMaskImage: "url(/assets/logos/surya-logo-mark-only.svg)",
        maskImage: "url(/assets/logos/surya-logo-mark-only.svg)",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
