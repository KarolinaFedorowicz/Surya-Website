// C9 — ComingSoonCapsule. SURYA_CACAO_BUILD_PLAN.md §3.4 (the one unique commerce component)
import { Display, Eyebrow, Frame, Pill, Section } from "@/components/primitives";
import { NotifyMeForm } from "./NotifyMeForm";
import type { Product } from "@/lib/shopify/types";

/**
 * Vanilla Bean Cacao + Body Butter. "Quieter, desaturated module, locked/soon
 * state, no price shown." — brief §5.4
 *
 * Deliberately renders P9 Frame's placeholder rather than reusing the existing
 * bag photography: these are different products and showing the cacao bag for
 * a body butter would misrepresent what's coming. Desaturation comes from the
 * Ivory tone plus muted text, not a CSS filter over real product shots.
 *
 * C10 NotifyMeForm sits under each item — the only way to express interest in
 * something that has no price and no date.
 */
export function ComingSoonCapsule({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <Section tone="ivory" space="normal">
      <Eyebrow>Not yet</Eyebrow>
      <Display as="h2" size="section" className="mt-4">
        Coming soon
      </Display>
      <p className="text-muted font-body text-caption mt-4 max-w-[46rem]">
        Two additions in progress. No date, and no price until there is one.
      </p>

      <ul className="mt-14 grid gap-12 sm:grid-cols-2">
        {products.map((p) => (
          <li key={p.id} className="opacity-75">
            <Frame ratio="landscape" label={p.title} />
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <Display as="h3" size="section" className="text-h3">
                {p.title}
              </Display>
              <Pill variant="soon">Locked</Pill>
            </div>
            <p className="text-muted font-body text-caption mt-3">
              {p.description}
            </p>
            <NotifyMeForm handle={p.handle} title={p.title} className="mt-6" />
          </li>
        ))}
      </ul>
    </Section>
  );
}
