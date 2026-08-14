// P1 — Section. SURYA_CACAO_BUILD_PLAN.md §3.1
import type { ElementType, ReactNode } from "react";

import { GrainOverlay } from "./GrainOverlay";
import { Container, type ContainerWidth } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

/**
 * The three surfaces. Each emits exactly one background + one ink + gold
 * accent, per brief §3.1's "max 3 tokens per section" rule. The mapping itself
 * lives in globals.css under `[data-tone="…"]`; this component only selects.
 *
 * Page sections MUST NOT set background or text color directly — they set a
 * tone and let their children read `text-ink` / `text-muted` / `text-accent`.
 */
export type Tone = "dark" | "sand" | "ivory";

const SPACE = {
  none: "",
  compact: "py-16 md:py-20",
  /** Default rhythm. Generous — negative space is doing structural work here. */
  normal: "py-24 md:py-32",
  /** For the quiet, declarative sections (e.g. Home "On Gatekeeping"). */
  spacious: "py-32 md:py-48",
} as const;

export type SectionProps = {
  tone: Tone;
  children: ReactNode;
  /** Semantic element. Use "div" when nesting a tone inside another Section. */
  as?: ElementType;
  space?: keyof typeof SPACE;
  /** Delegated to L8 Container, so widths are decided in exactly one place. */
  width?: ContainerWidth;
  /**
   * Paper grain. Defaults on for light surfaces, off for dark — brief §3.4
   * scopes the texture to Sand Paper / Warm Ivory.
   */
  grain?: boolean;
  /** Removes the horizontal gutter, for full-bleed media. */
  bleed?: boolean;
  className?: string;
  id?: string;
};

export function Section({
  tone,
  children,
  as: Tag = "section",
  space = "normal",
  width = "default",
  grain,
  bleed = false,
  className,
  id,
}: SectionProps) {
  const showGrain = grain ?? tone !== "dark";

  return (
    <Tag
      id={id}
      data-tone={tone}
      className={cn("relative isolate bg-surface text-ink", SPACE[space])}
    >
      {showGrain ? <GrainOverlay /> : null}
      <Container width={width} bleed={bleed} className={cn("relative", className)}>
        {children}
      </Container>
    </Tag>
  );
}
