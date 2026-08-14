// S9 — FamilyVignette. SURYA_CACAO_BUILD_PLAN.md §3.5 (reusable ×3)
import { Display, Eyebrow, Frame, Section } from "@/components/primitives";
import { MdxContent } from "@/components/mdx/MdxContent";
import type { Family } from "@/lib/mdx";

/**
 * Portrait + narrative, one per family. A12 photography is missing, so P9
 * Frame renders a brand-colored block at the right ratio — never stock, never
 * AI (§7).
 *
 * Alternating sides give the three a rhythm without three different layouts.
 * Tones alternate sand/ivory so consecutive vignettes don't merge into one
 * long surface.
 */
export function FamilyVignette({
  family,
  body,
  index,
}: {
  family: Family;
  body: string;
  index: number;
}) {
  const flipped = index % 2 === 1;

  return (
    <Section tone={flipped ? "ivory" : "sand"} space="normal">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div className={flipped ? "lg:order-2" : undefined}>
          <Frame
            ratio="portrait"
            src={family.portrait ?? undefined}
            alt={family.portrait ? `The ${family.country} family` : undefined}
            label={`${family.country} — A12 pending`}
          />
        </div>

        <div className={flipped ? "lg:order-1" : undefined}>
          <Eyebrow>{`0${index + 1} · ${family.country}`}</Eyebrow>
          <Display as="h2" size="section" className="mt-4 max-w-[14ch]">
            {family.country}
          </Display>
          <p className="text-emphasis font-body text-caption mt-3 tabular-nums">
            {family.coordinates[0].toFixed(4)}, {family.coordinates[1].toFixed(4)}
          </p>
          <MdxContent source={body} className="mt-8" />
        </div>
      </div>
    </Section>
  );
}
