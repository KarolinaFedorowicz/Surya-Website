import type { Metadata } from "next";

import { RecipeCarousel } from "@/components/sections/recipes/RecipeCarousel";
import { getCopy, getRecipes } from "@/lib/mdx";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Recipes & Rituals",
  path: "/recipes",
  description:
    "Signature ways to drink ceremonial cacao — for the slow Sunday, the first cold morning, and the long table.",
});

/** S12 · S13 */
export default function RecipesPage() {
  const copy = getCopy("recipes-intro");

  return (
    <RecipeCarousel
      recipes={getRecipes()}
      eyebrow={copy.eyebrow ?? "Recipes"}
      headline={copy.headline ?? copy.title}
      lead={copy.lead}
    />
  );
}
