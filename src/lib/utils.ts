import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge has to be told about our type scale.
 *
 * Out of the box it only knows Tailwind's default font sizes (`text-sm`,
 * `text-2xl`, …). Anything else matching `text-*` it assumes is a text COLOR —
 * so `cn("text-h1", "text-ink")` looked like two competing colors and it
 * silently dropped `text-h1`, rendering every headline at inherited body size.
 *
 * Declaring the scale here puts `text-h1` in the font-size group, where it no
 * longer conflicts with a color. Keep this list in sync with the `--text-*`
 * tokens in globals.css.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["eyebrow", "caption", "body", "h3", "h2", "h1"] },
      ],
    },
  },
});

/**
 * Merge conditional class names, letting later Tailwind utilities win over
 * earlier conflicting ones. Every primitive accepts `className` and funnels it
 * through here so callers can override without `!important`.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
