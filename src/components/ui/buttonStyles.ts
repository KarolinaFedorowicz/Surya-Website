/**
 * The shape of every button-type element on the site, defined once.
 *
 * Split out of Button.tsx, which is a client component: these are pure strings
 * with no React and no browser dependency, but exporting them from a
 * "use client" module made them unreachable from a server component — calling
 * one is a build error, not a runtime one. Anything that only needs the *look*
 * of a button (a real <button>, an outbound <a>) imports from here; only the
 * magnetic-hover component itself needs Button.tsx.
 *
 * Every variant carries a 1px border — transparent on the filled one — so the
 * box measures identically whether or not the border is visible. Without that
 * a ghost button is 2px taller and wider than the primary sitting next to it.
 *
 * inline-flex + centering, a fixed line-height and a min-width give paired
 * CTAs matching dimensions; nowrap keeps a long label from wrapping out of the
 * box. The right padding is trimmed by one tracking step because letter-spacing
 * adds a trailing space after the final character, which otherwise pushes the
 * label optically left of centre.
 */
export const buttonBase =
  "btn-magnetic inline-flex items-center justify-center whitespace-nowrap " +
  "border text-caption uppercase tracking-caption leading-none text-center";

/**
 * Two sizes, not two buttons. "default" is the page CTA with a 12rem minimum
 * so paired buttons match. "compact" drops the minimum and tightens the
 * padding for the header, where a 12rem box would dominate the bar.
 * Shape, border, easing and hover behaviour are identical.
 */
export const buttonSize = {
  default: "min-w-[12rem] py-4 pl-8 pr-[calc(2rem-0.05em)]",
  compact: "py-3 pl-5 pr-[calc(1.25rem-0.05em)]",
} as const;

/**
 * Colors come from tokens only:
 *   primary  — Aubergine fill, Sand Paper text (Aubergine is the primary token)
 *   ghost    — gold hairline, no fill (gold is never a fill)
 *
 * On dark surfaces `onDark` swaps the pairing so contrast holds: gold fill
 * with Night text, since Aubergine on Night is too close to read.
 */
export function buttonSkin(
  variant: "primary" | "ghost",
  onDark: boolean,
): string {
  if (variant === "primary") {
    return onDark
      ? "border-transparent bg-gilded-gold text-deep-cacao-night hover:bg-warm-ivory"
      : "border-transparent bg-aubergine-ink text-sand-paper hover:bg-deep-cacao-night";
  }
  return onDark
    ? "border-gilded-gold text-gilded-gold hover:bg-gilded-gold hover:text-deep-cacao-night"
    : "border-gilded-gold text-aubergine-ink hover:bg-warm-ivory";
}
