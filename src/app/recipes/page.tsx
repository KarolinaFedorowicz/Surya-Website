import type { Metadata } from "next";

import { RecipeCarousel } from "@/components/sections/recipes/RecipeCarousel";
import { RECIPE_GUIDE_ITEMS, RECIPE_GUIDE_URL } from "@/config/recipeGuide";
import { getCopy } from "@/lib/mdx";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Drink Recipes",
  path: "/recipes",
  description:
    "Eight ways to drink ceremonial cacao — from the traditional pour to chai, chili, and rose.",
});

/** S12 · S13 */
export default function RecipesPage() {
  const copy = getCopy("recipes-intro");

  return (
    <RecipeCarousel
      recipes={RECIPE_GUIDE_ITEMS}
      eyebrow={copy.eyebrow ?? "Recipes"}
      headline={copy.headline ?? copy.title}
      lead={copy.lead}
      guideHref={RECIPE_GUIDE_URL}
    />
  );
}
