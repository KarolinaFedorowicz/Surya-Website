// P2 — Display. SURYA_CACAO_BUILD_PLAN.md §3.1
import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Gilda Display — headlines, pull quotes, and single-word section openers
 * ("Beyond." / "Elevate." / "Origin.") ONLY.
 *
 * brief §3.2: large and rare. Never at body size, max 2–3 instances visible on
 * screen at once. If you want emphasis at body size, that is `Prose` with
 * tracking or case — not a second display face and not a smaller Gilda.
 *
 * `size` is visual weight; `as` is document outline. Keep them independent so
 * a visually-large heading can still be an <h2> where the outline requires it.
 */
const SIZE = {
  /** Hero. 40 → 96px. One per page, at most. */
  hero: "text-h1",
  /** Section opener. 40 → 56px. */
  section: "text-h2",
  /** Pull quote — same scale as a section head but set in italic measure. */
  quote: "text-h2 italic",
} as const;

export type DisplayProps = {
  children: ReactNode;
  as?: ElementType;
  size?: keyof typeof SIZE;
  /**
   * Tone-aware color role. `emphasis` is gold on dark and aubergine on light —
   * literal gold is never used for display text because it fails contrast on
   * both light surfaces even at hero size.
   */
  color?: "ink" | "emphasis" | "muted";
  balance?: boolean;
  className?: string;
};

export function Display({
  children,
  as: Tag = "h2",
  size = "section",
  color = "ink",
  balance = true,
  className,
}: DisplayProps) {
  return (
    <Tag
      className={cn(
        "font-display",
        SIZE[size],
        color === "ink" && "text-ink",
        color === "emphasis" && "text-emphasis",
        color === "muted" && "text-muted",
        balance && "text-balance",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
