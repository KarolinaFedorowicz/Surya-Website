// S13 — RecipeCard. SURYA_CACAO_BUILD_PLAN.md §3.5 (reusable)
import Link from "next/link";

import { Frame, Pill } from "@/components/primitives";
import { TiltCard } from "@/components/motion";
import type { Recipe } from "@/lib/mdx";
import { cn } from "@/lib/utils";

/**
 * Name in Gilda, a mood line instead of a category tag, full-bleed image.
 *
 * Used by S6 RecipesTeaser and S12 RecipeCarousel — one card, two contexts,
 * per the plan's consolidation map. The tilt-on-hover comes from wrapping this
 * in M6 TiltCard in Phase 6, not from anything inside it.
 *
 * The whole card is one link rather than a link on the title: a 300px image
 * that isn't clickable next to a 20px text target is a worse pointer and touch
 * experience, and it keeps the tab stop count down on a page of nine cards.
 */
export function RecipeCard({
  recipe,
  className,
}: {
  recipe: Recipe;
  className?: string;
}) {
  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className={cn("group block", className)}
    >
      <TiltCard>
        <Frame
          ratio="tall"
          src={recipe.image ?? undefined}
          alt={recipe.image ? recipe.title : undefined}
          label={recipe.title}
        />
      </TiltCard>

      <div className="mt-6 flex items-start justify-between gap-4">
        <h3 className="text-ink font-display text-h3">{recipe.title}</h3>
        {recipe.featured ? <Pill>Signature</Pill> : null}
      </div>

      <p className="text-muted font-body text-body mt-2 max-w-[34ch] italic">
        {recipe.mood}
      </p>

      <p className="text-emphasis font-body text-caption mt-5 uppercase tracking-[0.12em] [font-variant-caps:all-small-caps]">
        The method →
      </p>
    </Link>
  );
}
