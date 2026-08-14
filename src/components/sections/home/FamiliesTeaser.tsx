// S5 — FamiliesTeaser. SURYA_CACAO_BUILD_PLAN.md §3.5
import {
  Display,
  Eyebrow,
  Frame,
  Section,
  TextLink,
} from "@/components/primitives";
import { Reveal } from "@/components/motion";
import { getCopy, getFamilies } from "@/lib/mdx";

/** Condensed three-families block → "Read our story →". A12 photography pending. */
export function FamiliesTeaser() {
  const families = getFamilies();
  const copy = getCopy("who-we-are");

  return (
    <Section tone="sand" space="normal">
      <Eyebrow>{copy.eyebrow ?? "Origin"}</Eyebrow>
      <Display as="h2" size="section" className="mt-4 max-w-[16ch]">
        {copy.headline ?? copy.title}
      </Display>

      {copy.lead ? (
        <p className="text-muted font-body text-body mt-8 max-w-[52ch]">
          {copy.lead}
        </p>
      ) : null}

      <Reveal as="ul" stagger className="mt-16 grid gap-12 md:grid-cols-3">
        {families.map((f) => (
          <li key={f.slug}>
            <Frame
              ratio="tall"
              src={f.portrait ?? undefined}
              alt={f.portrait ? `The ${f.country} family` : undefined}
              label={f.country}
            />
            <h3 className="text-ink font-display text-h3 mt-6">{f.country}</h3>
            <p className="text-emphasis font-body text-caption mt-1 tabular-nums">
              {f.coordinates[0].toFixed(2)}, {f.coordinates[1].toFixed(2)}
            </p>
            <p className="text-muted font-body text-body mt-4 max-w-[36ch]">
              {f.narrative}
            </p>
          </li>
        ))}
      </Reveal>

      <p className="mt-16">
        <TextLink href="/story">Read our story →</TextLink>
      </p>
    </Section>
  );
}
