// S11 — ShopHero. SURYA_CACAO_BUILD_PLAN.md §3.5
import { Display, Eyebrow, Section } from "@/components/primitives";
import { getCopy } from "@/lib/mdx";

/** Product-forward opener. Dark, so the nav overlays it — see OVERLAY_ROUTES. */
export function ShopHero() {
  const copy = getCopy("shop-hero");

  return (
    <Section tone="dark" space="spacious" className="pt-40 md:pt-56">
      <Eyebrow>{copy.eyebrow ?? "Shop"}</Eyebrow>
      <Display as="h1" size="hero" className="mt-8 max-w-[12ch]">
        {copy.headline ?? copy.title}
      </Display>
      {copy.lead ? (
        <p className="text-muted font-body text-body mt-10 max-w-[46ch]">
          {copy.lead}
        </p>
      ) : null}
      {copy.closing ? (
        <p className="text-muted font-body text-caption mt-6 max-w-[46ch] italic">
          {copy.closing}
        </p>
      ) : null}
    </Section>
  );
}
