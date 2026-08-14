// C1 — ProductBlock. SURYA_CACAO_BUILD_PLAN.md §3.4
"use client";

import Image from "next/image";
import { useState } from "react";

import { Display, Eyebrow } from "@/components/primitives";
import { AddToCart } from "./AddToCart";
import { PriceCounter } from "./PriceCounter";
import { RitualQuantity, type RitualFraming } from "./RitualQuantity";
import { ShippingNote } from "./ShippingNote";
import { SizeSelector } from "./SizeSelector";
import { VARIANT_WEIGHT } from "@/lib/money";
import type { Product } from "@/lib/shopify/types";

/**
 * "The three sizes as ONE elegant block, not three cards." — plan C1
 *
 * Selecting a size cross-fades the photography rather than hard-cutting
 * (brief §5.4): every image is stacked and opacity-switched, so there is no
 * decode flash on change and no layout shift. All three are rendered at once —
 * three ~1MB product shots is acceptable; a swap-on-demand would flash.
 *
 * C5 AddToCart handles the mutation; this component owns media and selection
 * only, so the same block serves /shop and /shop/[handle] unchanged.
 */
export function ProductBlock({
  product,
  /**
   * On /shop the block sits under S11's h1, so the title is an h2. On
   * /shop/[handle] the block IS the page and the title has to be the h1 —
   * otherwise the product page ships with no top-level heading at all.
   */
  as = "h2",
  /**
   * C4's per-size framings, from content/product/*.mdx. Passed in rather than
   * read here: this is a client component and the content loader is
   * server-only.
   */
  ritual = [],
}: {
  product: Product;
  as?: "h1" | "h2";
  ritual?: RitualFraming[];
}) {
  const [variant, setVariant] = useState(
    product.variants.find((v) => v.title === "300g") ?? product.variants[0],
  );

  return (
    <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
      {/* Media */}
      <div className="bg-ink/5 relative aspect-[3/4] w-full overflow-hidden">
        {product.images.map((img, i) => (
          <Image
            key={img.url}
            src={img.url}
            alt={(i === 0 ? img.altText : "") ?? ""}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 45vw, 100vw"
            aria-hidden={i !== 0}
            className="object-cover transition-opacity duration-[900ms] ease-surya"
            style={{
              opacity:
                product.images.indexOf(img) ===
                product.variants.indexOf(variant) % product.images.length
                  ? 1
                  : 0,
            }}
          />
        ))}
      </div>

      {/* Detail */}
      <div>
        <Eyebrow>Ceremonial grade</Eyebrow>
        <Display as={as} size={as === "h1" ? "hero" : "section"} className="mt-4">
          {product.title}
        </Display>

        <p className="text-muted font-body text-body mt-6 max-w-[46ch]">
          {product.description}
        </p>

        <PriceCounter
          price={variant.price}
          weight={VARIANT_WEIGHT[variant.title] ?? 0}
          className="mt-10"
        />

        <SizeSelector
          variants={product.variants}
          selected={variant}
          onSelect={setVariant}
          className="mt-8"
        />

        <div className="mt-6">
          <RitualQuantity size={variant.title} ritual={ritual} />
        </div>

        <AddToCart variant={variant} className="mt-10" />

        <ShippingNote className="mt-8" />
      </div>
    </div>
  );
}
