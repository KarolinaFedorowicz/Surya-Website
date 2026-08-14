/**
 * token-exception: the five brand colors, mirrored for JavaScript consumers
 * that CANNOT read a CSS custom property — Next's `themeColor` metadata and
 * `ImageResponse` (satori), which renders OG images outside the browser.
 *
 * globals.css remains the source of truth for everything that renders in a
 * browser. This file exists so those two APIs don't each grow their own copy.
 * If a value changes in globals.css, change it here too. `npm run check`
 * allows this file and nothing else.
 */
export const BRAND = {
  aubergine: "#6c4749",
  sand: "#e0bfa1",
  night: "#2a1719",
  ivory: "#f6eee3",
  gold: "#b8935b",
} as const;
