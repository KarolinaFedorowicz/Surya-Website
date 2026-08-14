// S6 — RecipesTeaser. SURYA_CACAO_BUILD_PLAN.md §3.5
import {
  Display,
  Eyebrow,
  Section,
  TextLink,
} from "@/components/primitives";
import { Reveal } from "@/components/motion";
import { RecipeCard } from "@/components/sections/recipes/RecipeCard";
import { getCopy, getFeaturedRecipes } from "@/lib/mdx";

/** Three-card preview → /recipes. Reuses S13 rather than a bespoke card. */
export function RecipesTeaser() {
  const recipes = getFeaturedRecipes(3);
  const copy = getCopy("recipes-teaser");
  const cta = (copy.ctas ?? []).find((c) => c.href);

  return (
    <Section tone="ivory" space="normal">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <Eyebrow>{copy.eyebrow ?? "Rituals"}</Eyebrow>
          <Display as="h2" size="section" className="mt-4 max-w-[14ch]">
            {copy.headline ?? copy.title}
          </Display>
          {copy.lead ? (
            <p className="text-muted font-body text-body mt-6 max-w-[46ch]">
              {copy.lead}
            </p>
          ) : null}
        </div>
        {cta ? (
          <TextLink href={cta.href as string}>{cta.label}</TextLink>
        ) : null}
      </div>

      <Reveal as="ul" stagger className="mt-16 grid gap-12 md:grid-cols-3">
        {recipes.map((r) => (
          <li key={r.slug}>
            <RecipeCard recipe={r} />
          </li>
        ))}
      </Reveal>
    </Section>
  );
}
