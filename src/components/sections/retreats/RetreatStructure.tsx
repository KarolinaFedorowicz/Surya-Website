// S16 — RetreatStructure. SURYA_CACAO_BUILD_PLAN.md §3.5
import { Display, Eyebrow, Frame, Section } from "@/components/primitives";
import { MdxContent } from "@/components/mdx/MdxContent";
import { getCopy } from "@/lib/mdx";

/** Broad strokes — inquiry-based, never instant checkout. brief §5.6 */
export function RetreatStructure() {
  const copy = getCopy("retreat-structure");

  return (
    <Section tone="sand" space="normal">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <Eyebrow>The shape of it</Eyebrow>
          <Display as="h2" size="section" className="mt-4 max-w-[14ch]">
            {copy.title}
          </Display>
          <MdxContent source={copy.body} className="mt-8" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:self-center">
          <Frame ratio="portrait" label="The sanctuary — A12 pending" />
          <Frame ratio="portrait" label="The farm — A12 pending" className="sm:mt-12" />
        </div>
      </div>
    </Section>
  );
}
