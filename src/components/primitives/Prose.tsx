// P4 — Prose. SURYA_CACAO_BUILD_PLAN.md §3.1
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Long-form body copy — the render target for MDX in `src/content` (Phase 3).
 *
 * Deliberately NOT @tailwindcss/typography: that plugin ships its own gray
 * ramp and font sizing, which would compete with the token system and smuggle
 * non-brand colors in. This styles descendants against tone roles instead.
 *
 * Headings inside prose are Marcellus at the H3 step, never Gilda. brief §3.2
 * caps Gilda at 2–3 visible instances; a long legal or story page would blow
 * straight past that if every `##` rendered as display type. Page-level
 * headlines use <Display>; prose headings stay quiet subsection markers.
 */
export function Prose({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "font-body text-body text-ink max-w-[46rem]",

        // Vertical rhythm
        "[&>*+*]:mt-6",
        "[&>h2]:mt-16 [&>h3]:mt-12 [&>hr]:my-16",

        // Headings — Marcellus, see note above
        "[&_h2]:text-h3 [&_h2]:text-ink [&_h2]:tracking-[0.03em]",
        "[&_h3]:text-body [&_h3]:text-ink [&_h3]:uppercase",
        "[&_h3]:tracking-[0.12em] [&_h3]:[font-variant-caps:all-small-caps]",

        // Body
        "[&_p]:text-muted",
        "[&_strong]:text-ink",
        "[&_em]:italic",

        // Links. The underline is the affordance, so it is drawn in ink rather
        // than gold — gold underlines vanish on Sand Paper (1.65:1). Hover
        // thickens the rule instead of recoloring the text, which keeps the
        // link legible in both states. Left-to-right draw arrives in Phase 6.
        "[&_a]:text-ink [&_a]:underline [&_a]:decoration-ink/50",
        "[&_a]:decoration-1 [&_a]:underline-offset-[0.3em]",
        "[&_a]:transition-all [&_a]:duration-[600ms] [&_a]:ease-surya",
        "[&_a:hover]:decoration-ink [&_a:hover]:decoration-2",

        // Lists — markers use `emphasis`, so they stay visible on light
        // surfaces and still read gold on Deep Cacao Night.
        "[&_ul]:list-none [&_ul]:pl-0 [&_ol]:pl-6 [&_ol]:list-decimal",
        "[&_li]:text-muted [&_li+li]:mt-3",
        "[&_ol_li]:marker:text-emphasis",
        "[&_ul>li]:relative [&_ul>li]:pl-6",
        "[&_ul>li]:before:absolute [&_ul>li]:before:left-0",
        "[&_ul>li]:before:top-[0.65em] [&_ul>li]:before:size-1",
        "[&_ul>li]:before:rounded-full [&_ul>li]:before:bg-emphasis",

        // Pull quote — one of Gilda's two sanctioned uses
        "[&_blockquote]:font-display [&_blockquote]:text-h3",
        "[&_blockquote]:italic [&_blockquote]:text-ink",
        "[&_blockquote]:border-l [&_blockquote]:border-accent",
        "[&_blockquote]:pl-6 [&_blockquote]:my-12",

        "[&_hr]:border-0 [&_hr]:h-px [&_hr]:bg-hairline",

        // Inline code keeps the body face — a monospace would be the third
        // typeface brief §3.2 forbids. Set apart by tracking and a rule.
        "[&_code]:font-body [&_code]:text-[0.9em] [&_code]:tracking-[0.02em]",
        "[&_code]:text-ink [&_code]:border-b [&_code]:border-hairline",

        className,
      )}
    >
      {children}
    </div>
  );
}
