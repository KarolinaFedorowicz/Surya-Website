import { shop } from "@content/shop";
import Section from "@/components/layout/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import Divider from "@/components/ui/Divider";
import Reveal from "@/components/ui/Reveal";

/**
 * /shop page intro, above the shared product block.
 *
 * MISSING CONTENT: no shop-page copy exists in the content draft. Renders
 * nothing until it does, so /shop currently opens straight into the product
 * block. No filler headline invented.
 */
export default function ShopIntro() {
  if (!shop.headline && !shop.intro) return null;

  return (
    <Section className="pt-[calc(var(--header-h)+var(--space-section))]">
      <Reveal index={0}>
        <Eyebrow>Shop</Eyebrow>
      </Reveal>

      {shop.headline && (
        <Reveal index={1}>
          <h1 className="font-display text-h2 tracking-h2 leading-h2 mt-4">
            {shop.headline}
          </h1>
        </Reveal>
      )}

      <Reveal index={2}>
        <Divider className="my-[var(--space-block)]" />
      </Reveal>

      {shop.intro && (
        <Reveal index={3}>
          <p className="text-body leading-body max-w-[var(--measure)]">
            {shop.intro}
          </p>
        </Reveal>
      )}
    </Section>
  );
}
