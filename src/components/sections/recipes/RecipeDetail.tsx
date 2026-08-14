// S14 — RecipeDetail. SURYA_CACAO_BUILD_PLAN.md §3.5
import {
  Display,
  Eyebrow,
  Frame,
  HairlineRule,
  Pill,
  Section,
  TextLink,
} from "@/components/primitives";
import { MdxContent } from "@/components/mdx/MdxContent";
import type { Recipe } from "@/lib/mdx";

/**
 * Ingredients + method.
 *
 * Marked up as a real <ol> for the method and <ul> for ingredients rather than
 * styled divs — it's a recipe, so the semantics carry actual meaning for
 * assistive tech and for anything that parses the page.
 */
export function RecipeDetail({
  recipe,
  body,
}: {
  recipe: Recipe & { body?: string };
  body: string;
}) {
  return (
    <>
      <Section tone="dark" space="spacious" className="pt-40 md:pt-56">
        <Eyebrow>Ritual</Eyebrow>
        <Display as="h1" size="hero" className="mt-8 max-w-[14ch]">
          {recipe.title}
        </Display>
        <p className="text-muted font-body text-body mt-8 max-w-[42ch] italic">
          {recipe.mood}
        </p>
        {recipe.placeholder ? (
          <Pill variant="soon" className="mt-8">
            Placeholder recipe
          </Pill>
        ) : null}
      </Section>

      <Section tone="sand" space="normal">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div>
            <Frame
              ratio="tall"
              src={recipe.image ?? undefined}
              alt={recipe.image ? recipe.title : undefined}
              label={recipe.title}
            />
          </div>

          <div>
            <h2 className="text-ink font-body text-h3 uppercase tracking-[0.12em] [font-variant-caps:all-small-caps]">
              Ingredients
            </h2>
            <ul className="mt-6">
              {recipe.ingredients.map((line) => (
                <li key={line}>
                  <HairlineRule />
                  <p className="text-muted font-body text-body py-3.5">{line}</p>
                </li>
              ))}
            </ul>
            <HairlineRule />

            <h2 className="text-ink font-body text-h3 mt-16 uppercase tracking-[0.12em] [font-variant-caps:all-small-caps]">
              Method
            </h2>
            <ol className="mt-6">
              {recipe.method.map((step, i) => (
                <li key={step} className="flex gap-6 py-4">
                  <span className="text-emphasis font-body text-caption pt-1.5 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-muted font-body text-body max-w-[48ch]">
                    {step}
                  </p>
                </li>
              ))}
            </ol>

            <MdxContent source={body} className="mt-14" />

            <p className="mt-16">
              <TextLink href="/recipes">← All rituals</TextLink>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
