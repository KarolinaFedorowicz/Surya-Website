// P7 — HairlineRule. SURYA_CACAO_BUILD_PLAN.md §3.1
import { cn } from "@/lib/utils";

/**
 * A single hairline. Gold on dark, aubergine-tinted on light — both come from
 * the tone's `--hairline`, so this never picks a color itself.
 *
 * brief §3.1 lists hairline rules as one of Gold's four sanctioned accent uses.
 * Kept to 1px: this is the same linework language as the sun mark.
 */
export function HairlineRule({
  orientation = "horizontal",
  className,
}: {
  orientation?: "horizontal" | "vertical";
  className?: string;
}) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "bg-hairline shrink-0",
        orientation === "horizontal" ? "h-px w-full" : "w-px self-stretch",
        className,
      )}
    />
  );
}
