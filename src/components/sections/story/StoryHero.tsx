// S7 — StoryHero. SURYA_CACAO_BUILD_PLAN.md §3.5
import { Display, Eyebrow, Section } from "@/components/primitives";
import { getCopy } from "@/lib/mdx";

/** Page opener. Dark, so the nav can overlay it — see OVERLAY_ROUTES. */
export function StoryHero() {
  const copy = getCopy("story-hero");

  return (
    <Section tone="dark" space="spacious" className="pt-40 md:pt-56">
      <Eyebrow>{copy.eyebrow ?? "Our story"}</Eyebrow>
      <Display as="h1" size="hero" className="mt-8 max-w-[13ch]">
        {copy.headline ?? copy.title}
      </Display>
      {copy.lead ? (
        <p className="text-muted font-body text-body mt-10 max-w-[50ch]">
          {copy.lead}
        </p>
      ) : null}
    </Section>
  );
}
