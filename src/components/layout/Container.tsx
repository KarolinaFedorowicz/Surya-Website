// L8 — Container. SURYA_CACAO_BUILD_PLAN.md §3.3
import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Max-width + responsive gutters. The single place those numbers are decided.
 *
 * P1 Section composes this rather than duplicating the measurements, so a
 * Section's inner column and a bare Container always agree. Chrome that sits
 * outside a Section — L1 Nav, L4 Footer — uses it directly.
 */
export const WIDTH = {
  /** Long-form reading measure — roughly 68 characters. */
  prose: "max-w-[46rem]",
  /** Standard content column. */
  default: "max-w-[var(--container-max)]",
  /** Edge-to-edge; the caller handles its own insets. */
  full: "max-w-none",
} as const;

export type ContainerWidth = keyof typeof WIDTH;

export function Container({
  children,
  as: Tag = "div",
  width = "default",
  /** Drops the horizontal gutter, for full-bleed media. */
  bleed = false,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  width?: ContainerWidth;
  bleed?: boolean;
  className?: string;
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full",
        WIDTH[width],
        !bleed && "px-[var(--gutter)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
