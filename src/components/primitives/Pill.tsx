import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * P14 — Pill. Small tag: coming-soon state, shipping region, recipe mood.
 *
 * The plan calls this a "gold/aubergine tag", but §6.1 says gold is never a
 * fill — so gold appears as the hairline border and the text routes through
 * `emphasis` (gold on dark, aubergine on light, always legible). Outline only,
 * never a filled chip.
 */
const VARIANT = {
  /** Default — gold hairline, emphasis text. */
  outline: "border-accent text-emphasis",
  /** C9 ComingSoonCapsule's locked state. Deliberately recessive. */
  soon: "border-hairline text-muted",
  /** Highest-contrast option, for a state that must not be missed. */
  solid: "border-transparent bg-btn text-btn-ink",
} as const;

export type PillProps = {
  children: ReactNode;
  variant?: keyof typeof VARIANT;
  /** Optional leading dot — used for shipping regions and stock states. */
  dot?: boolean;
  className?: string;
};

export function Pill({
  children,
  variant = "outline",
  dot = false,
  className,
}: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5",
        "font-body text-caption uppercase [font-variant-caps:all-small-caps]",
        "tracking-[0.1em] whitespace-nowrap",
        VARIANT[variant],
        className,
      )}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className={cn(
            "size-1 shrink-0 rounded-full",
            variant === "solid" ? "bg-btn-ink" : "bg-accent",
          )}
        />
      ) : null}
      {children}
    </span>
  );
}
