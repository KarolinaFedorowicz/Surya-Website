// S10 — StoryThroughline. SURYA_CACAO_BUILD_PLAN.md §3.5
import { Button, Display, Section } from "@/components/primitives";
import { getCopy } from "@/lib/mdx";

/**
 * The close, plus the soft CTA into Retreats — brief §5.3.
 *
 * The two lines are fixed by the brief rather than by the copy source, but they
 * live in story-throughline.mdx like everything else: §2.4 leaves no real copy
 * in JSX regardless of who authored it.
 */
export function StoryThroughline() {
  const copy = getCopy("story-throughline");
  const cta = (copy.ctas ?? []).find((c) => c.href);

  return (
    <Section tone="dark" space="spacious">
      <Display as="h2" size="section" color="emphasis" className="max-w-[16ch]">
        {copy.headline ?? copy.title}
      </Display>

      {copy.lead ? (
        <p className="text-muted font-body text-body mt-12 max-w-[46ch]">
          {copy.lead}
        </p>
      ) : null}

      {cta ? (
        <Button
          href={cta.href as string}
          variant="secondary"
          size="lg"
          className="mt-14"
        >
          {cta.label}
        </Button>
      ) : null}
    </Section>
  );
}
