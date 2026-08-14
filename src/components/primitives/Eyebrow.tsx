// P3 — Eyebrow. SURYA_CACAO_BUILD_PLAN.md §3.1
import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Small-caps gold label above a section head — "WHY NOW", "OUR STANCE".
 *
 * brief §3.2 specifies this in Gold. That holds on Deep Cacao Night (5.96:1)
 * but NOT on the light surfaces — gold on Sand Paper is 1.65:1 and on Warm
 * Ivory 2.48:1, both below even the 3:1 large-text floor, and this text is
 * 13px. So it renders `text-emphasis`, which is gold on dark and aubergine on
 * light. Flagged in the Phase 1 summary as a brand decision to confirm.
 *
 * Uses real `font-variant-caps: all-small-caps` where the face supports it and
 * falls back to uppercase, so the label never renders at full cap height and
 * shouts.
 */
export function Eyebrow({
  children,
  as: Tag = "p",
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}) {
  return (
    <Tag
      className={cn(
        "font-body text-eyebrow text-emphasis uppercase [font-variant-caps:all-small-caps]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
