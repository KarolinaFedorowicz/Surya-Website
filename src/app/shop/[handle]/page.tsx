import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Display, Eyebrow, Section } from "@/components/primitives";
import { JsonLd } from "@/components/layout/JsonLd";
import { ProductBlock } from "@/components/commerce/ProductBlock";
import { getProduct, getProducts, isComingSoon } from "@/lib/commerce";
import { getProductCopy } from "@/lib/mdx";
import { SITE } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

/** Static params so every handle prerenders — route table: "ISR + static params". */
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return buildMetadata({ title: "Not found", noIndex: true });

  return buildMetadata({
    title: product.title,
    path: `/shop/${handle}`,
    description: product.description,
  });
}

/** C1 · C2 · C3 · C4 · C5 */
export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  /* Product schema. Offers are omitted for coming-soon items rather than
     published at 0.00 — a price of zero in structured data is a lie search
     engines will happily repeat. */
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    url: `${SITE.url}/shop/${product.handle}`,
    ...(isComingSoon(product)
      ? {}
      : {
          offers: product.variants.map((v) => ({
            "@type": "Offer",
            name: v.title,
            price: v.price.amount,
            priceCurrency: v.price.currencyCode,
            availability: v.availableForSale
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          })),
        }),
  };

  if (isComingSoon(product)) {
    return (
      <Section tone="dark" space="spacious">
        <Eyebrow>Coming soon</Eyebrow>
        <Display as="h1" size="hero" className="mt-8 max-w-[14ch]">
          {product.title}
        </Display>
        <p className="text-muted font-body text-body mt-10 max-w-[44ch]">
          {product.description}
        </p>
        <JsonLd schema={schema} />
      </Section>
    );
  }

  return (
    <>
      <Section tone="sand" space="normal">
        <ProductBlock
          product={product}
          as="h1"
          ritual={getProductCopy(product.handle)?.ritual ?? []}
        />
      </Section>
      <JsonLd schema={schema} />
    </>
  );
}
