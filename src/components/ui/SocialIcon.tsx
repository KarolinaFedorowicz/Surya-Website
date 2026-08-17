/**
 * The three social glyphs, inline as SVG.
 *
 * Inline rather than files in /public because these are lettering, not
 * imagery: they take `currentColor`, so they inherit the footer's Sand Paper
 * and shift to gold on hover with the surrounding text, which an <img> cannot
 * do. Three small paths do not justify a network request each.
 *
 * Keyed off the label in content/footer.ts. An unrecognised label returns null
 * rather than a placeholder box — Footer falls back to the platform name as
 * text in that case, so adding a fourth social to the content file degrades to
 * a readable link instead of an empty square.
 */

const paths: Record<string, React.ReactNode> = {
  Instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),

  TikTok: (
    <path d="M15.6 3.2c.5 2.4 1.9 3.9 4.2 4.2v2.7c-1.5.1-2.9-.3-4.2-1.1v5.9c0 3.4-2.6 5.9-5.8 5.9-2.6 0-4.9-1.9-5.4-4.4-.6-3 1.4-5.9 4.4-6.4.5-.1 1-.1 1.5 0v2.9c-1.4-.3-2.6.6-2.9 1.8-.3 1.4.7 2.8 2.2 2.9 1.4.1 2.7-1 2.8-2.4V3.2h3.2Z" />
  ),

  LinkedIn: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="2" />
      <line x1="7" y1="10" x2="7" y2="17" />
      <circle cx="7" cy="6.7" r="1.2" fill="currentColor" stroke="none" />
      <path d="M11 17v-4a2.6 2.6 0 0 1 5.2 0v4" />
      <line x1="11" y1="10" x2="11" y2="17" />
    </>
  ),
};

/** Lets a caller pick a text fallback before rendering an empty icon slot. */
export function hasIcon(name: string): boolean {
  return name in paths;
}

export default function SocialIcon({ name }: { name: string }) {
  const glyph = paths[name];
  if (!glyph) return null;

  const filled = name === "TikTok";

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className="h-6 w-6"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {glyph}
    </svg>
  );
}
