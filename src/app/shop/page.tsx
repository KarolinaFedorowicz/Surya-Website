import type { Metadata } from "next";

import { Section } from "@/components/primitives";
import { ShopHero } from "@/components/sections/shop/ShopHero";
import { ProductBlock } from "@/components/commerce/ProductBlock";
import { ComingSoonCapsule } from "@/components/commerce/ComingSoonCapsule";
import { getComingSoonProducts, getPrimaryProduct } from "@/lib/commerce";
import { getProductCopy } from "@/lib/mdx";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Shop",
  path: "/shop",
  description:
    "Ceremonial cacao in 150g, 300g and 500g. Ships to North America and the European Union.",
});

/** ISR per the route table — harmless on the mock, correct once Shopify lands. */
export const revalidate = 60;

/** S11 · C1 · C9 */
export default async function ShopPage() {
  const product = await getPrimaryProduct();
  const comingSoon = await getComingSoonProducts();
  const copy = getProductCopy(product.handle);

  return (
    <>
      <ShopHero />
      <Section tone="sand" space="normal">
        <ProductBlock product={product} ritual={copy?.ritual ?? []} />
      </Section>
      <ComingSoonCapsule products={comingSoon} />
    </>
  );
}
