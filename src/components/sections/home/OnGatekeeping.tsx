// S3 — OnGatekeeping. SURYA_CACAO_BUILD_PLAN.md §3.5
import { Display, Eyebrow, Section } from "@/components/primitives";
import { getCopy } from "@/lib/mdx";

/**
 * "The simplest section on the site." — plan S3
 *
 * Deep Cacao Night, one or two Gilda lines, heavy negative space. Gold text is
 * legitimate here because it clears AA on Night (5.96:1) — this is the one
 * section where the brand's gold does what the brief imagines.
 *
 * Deliberately does not render its MDX body: the point of the section is
 * restraint, and the copy file's supporting paragraph is there for the copy
 * pass to promote if they want it. Spacious rhythm, nothing else.
 */
export function OnGatekeeping() {
  const copy = getCopy("on-gatekeeping");

  return (
    <Section tone="dark" space="spacious">
      <Eyebrow>{copy.eyebrow ?? "Our stance"}</Eyebrow>

      <Display as="h2" size="section" color="emphasis" className="mt-10 max-w-[16ch]">
        {copy.headline ?? copy.title}
      </Display>

      {copy.lead ? (
        <p className="text-muted font-body text-body mt-14 max-w-[46ch]">
          {copy.lead}
        </p>
      ) : null}
    </Section>
  );
}
