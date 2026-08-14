import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RecipeDetail } from "@/components/sections/recipes/RecipeDetail";
import { getRecipe, getRecipes } from "@/lib/mdx";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getRecipes().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) return buildMetadata({ title: "Not found", noIndex: true });

  return buildMetadata({
    title: recipe.title,
    path: `/recipes/${slug}`,
    description: recipe.mood,
    /* Placeholder recipes carry invented quantities — see the ⚠ in
       cardamom-and-rose.mdx. Keeping them out of the index avoids publishing
       a method nobody has tested. Drop this once real recipes land. */
    noIndex: recipe.placeholder,
  });
}

/** S14 */
export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  return <RecipeDetail recipe={recipe} body={recipe.body} />;
}
