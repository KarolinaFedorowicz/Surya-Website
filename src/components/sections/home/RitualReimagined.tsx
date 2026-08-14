// S2 — RitualReimagined. SURYA_CACAO_BUILD_PLAN.md §3.5
import { Display, Eyebrow, HairlineRule, Section } from "@/components/primitives";
import { Reveal } from "@/components/motion";
import { getCopy } from "@/lib/mdx";
import { cn } from "@/lib/utils";

/**
 * Eyebrow "WHY NOW". Three generations reaching for the same thing from
 * different directions — a horizontal triptych with a light connecting
 * treatment, because the generational order is real (brief §5.1B).
 *
 * The connector is a single hairline running behind the three columns, which
 * is what makes it read as a timeline rather than three unrelated cards. It
 * collapses on mobile where the columns stack and a horizontal rule would be
 * meaningless.
 *
 * The three columns come from the copy file's `items` frontmatter, not from
 * constants here — same reasoning as S4's compounds. The layout is the
 * component's decision; the words stay editable without opening JSX.
 */
export function RitualReimagined() {
  // The copy source's Beyond Cacao block. The triptych below still reads its
  // columns from ritual-reimagined.mdx, which the source does not replace.
  const copy = getCopy("beyond-cacao");
  const columns = getCopy("ritual-reimagined").items ?? [];

  return (
    <Section tone="sand" space="normal">
      <Reveal stagger>
        <Eyebrow>{copy.eyebrow ?? "Why now"}</Eyebrow>
        <Display as="h2" size="section" className="mt-4 max-w-[18ch]">
          {copy.headline ?? copy.title}
        </Display>

        {copy.lead ? (
          <p className="text-muted font-body text-body mt-8 max-w-[52ch]">
            {copy.lead}
          </p>
        ) : null}
      </Reveal>

      <div className="relative mt-20">
        {/* The connecting line. Decorative, so gold at low contrast is fine. */}
        <HairlineRule className="absolute top-1.5 right-0 left-0 hidden md:block" />

        <ol className="grid gap-12 md:grid-cols-3 md:gap-10">
          {columns.map((c) => (
            <li key={c.label} className="relative">
              <span
                aria-hidden="true"
                className="bg-accent absolute -top-0.5 left-0 hidden size-3 rounded-full md:block"
              />
              <div className="md:pt-10">
                <p className="text-ink font-body text-h3">{c.label}</p>
                <p className="text-muted font-body text-body mt-3 max-w-[32ch]">
                  {c.note}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* The first paragraph keeps the section's existing mt-20 break from the
          triptych; any further ones take the normal paragraph gap. No new
          spacing step is introduced. */}
      {(copy.paragraphs ?? []).map((p, i) => (
        <p
          key={i}
          className={cn(
            "text-ink font-body text-body max-w-[54ch]",
            i === 0 ? "mt-20" : "mt-8",
          )}
        >
          {p}
        </p>
      ))}
    </Section>
  );
}
