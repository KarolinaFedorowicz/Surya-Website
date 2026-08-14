// S17 — PartnershipTypes. SURYA_CACAO_BUILD_PLAN.md §3.5
import {
  Display,
  Eyebrow,
  HairlineRule,
  Section,
} from "@/components/primitives";
import { Reveal } from "@/components/motion";
import { getCopy } from "@/lib/mdx";

/**
 * Co-branded ceremony · event service · product collab · studio stocking.
 *
 * That fourth type is the whole of the dropped /studio page, absorbed as an
 * option rather than a route (plan §2). Types come from the copy file's
 * `items` frontmatter, so adding a fifth needs no code change.
 */
export function PartnershipTypes() {
  const copy = getCopy("partnership-types");
  const types = copy.items ?? [];

  return (
    <>
      <Section tone="dark" space="spacious" className="pt-40 md:pt-56">
        <Eyebrow>{copy.eyebrow ?? "Partnerships"}</Eyebrow>
        <Display as="h1" size="hero" className="mt-8 max-w-[14ch]">
          {copy.headline ?? copy.title}
        </Display>
        {copy.lead ? (
          <p className="text-muted font-body text-body mt-10 max-w-[48ch]">
            {copy.lead}
          </p>
        ) : null}
      </Section>

      <Section tone="sand" space="normal">
        <Eyebrow>Ways in</Eyebrow>
        <Display as="h2" size="section" className="mt-4 max-w-[16ch]">
          {copy.title}
        </Display>

        <Reveal as="ol" stagger className="mt-16">
          {types.map((t, i) => (
            <li key={t.label}>
              <HairlineRule />
              <div className="grid gap-4 py-9 md:grid-cols-[4rem_1fr_auto] md:gap-10">
                <span className="text-emphasis font-body text-caption tabular-nums md:pt-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-ink font-display text-h3">{t.label}</h3>
                <p className="text-muted font-body text-body max-w-[46ch]">
                  {t.note}
                </p>
              </div>
            </li>
          ))}
        </Reveal>
        <HairlineRule />
      </Section>
    </>
  );
}
