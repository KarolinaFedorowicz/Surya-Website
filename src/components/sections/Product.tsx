import { product } from "@content/product";
import Section from "@/components/layout/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";

/**
 * Section 6 — Product and Purchase. The home page's summary panel.
 *
 * This is no longer the purchase surface: /shop is, and it carries the Shopify
 * embed. So this panel states the sizes and hands off, which is also what the
 * header and hero CTAs do. One route transacts; everything else points at it.
 *
 * That replaced two permanently-disabled "Add to Cart" / "Buy Now" buttons.
 * They were honest when there was no store to send anyone to, but a live
 * checkout one click away makes a dead control on the home page just a defect.
 *
 * The Warm Ivory panel carries a gold hairline because Ivory on Sand Paper is
 * 1.50:1 — without the rule the panel has no visible edge. Structural, not
 * decorative.
 *
 * MISSING ASSET: the transparent packshot belongs on this panel.
 */

export default function Product() {
  return (
    <Section>
      <Reveal index={0}>
        <Eyebrow>Product</Eyebrow>
      </Reveal>

      <Reveal index={1}>
        <h2 className="font-display text-h2 tracking-h2 leading-h2 mt-4">
          {product.name}
        </h2>
      </Reveal>

      <Reveal index={2}>
        <p className="text-caption tracking-caption mt-3 uppercase opacity-75">
          {product.description}
        </p>
      </Reveal>

      <Reveal index={3}>
        <TiltCard className="bg-warm-ivory border-gilded-gold mt-[var(--space-block)] max-w-[420px] border p-8">
          <ul>
            {product.variants.map((v) => (
              <li
                key={v.size}
                className="border-aubergine-ink/15 flex justify-between border-b py-3 last:border-b-0"
              >
                <span>{v.size}</span>
                <span>{v.price}</span>
              </li>
            ))}
          </ul>

          {product.shippingTimeline && (
            <p className="text-caption tracking-caption mt-5 opacity-75">
              {product.shippingTimeline}
            </p>
          )}

          <div className="mt-7">
            <Button href="/shop">Shop Cacao</Button>
          </div>
        </TiltCard>
      </Reveal>
    </Section>
  );
}
