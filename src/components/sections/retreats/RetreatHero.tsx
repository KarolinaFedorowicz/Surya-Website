// S15 — RetreatHero. SURYA_CACAO_BUILD_PLAN.md §3.5
import { Button, Display, Eyebrow, Section } from "@/components/primitives";
import { getCopy } from "@/lib/mdx";

/**
 * Deep Cacao Night dominant — "should feel like golden hour on the farm."
 *
 * A12 farm photography is missing and §7 rules out stock and AI stand-ins, so
 * this leans on the dark surface and negative space instead of a placeholder
 * block behind the headline. An empty brand-colored rectangle at hero scale
 * would look like a broken image; restraint reads as intent.
 */
export function RetreatHero() {
  const copy = getCopy("retreat-hero");
  const cta = (copy.ctas ?? []).find((c) => c.href);

  return (
    <Section tone="dark" space="spacious" className="pt-40 md:pt-56">
      <Eyebrow>{copy.eyebrow ?? "Dominican Republic"}</Eyebrow>
      <Display as="h1" size="hero" className="mt-8 max-w-[12ch]">
        {copy.headline ?? copy.title}
      </Display>
      {copy.lead ? (
        <p className="text-muted font-body text-body mt-10 max-w-[48ch]">
          {copy.lead}
        </p>
      ) : null}
      {cta ? (
        <Button href={cta.href as string} size="lg" className="mt-12">
          {cta.label}
        </Button>
      ) : null}
    </Section>
  );
}
