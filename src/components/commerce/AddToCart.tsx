// C5 — AddToCart. SURYA_CACAO_BUILD_PLAN.md §3.4
"use client";

import { Button } from "@/components/primitives";
import { useCart } from "./CartProvider";
import type { ProductVariant } from "@/lib/shopify/types";

/**
 * Optimistic update, loading state, error state.
 *
 * The error is rendered here rather than swallowed: if a line fails to add,
 * the visitor has to know before they walk away thinking it worked.
 */
export function AddToCart({
  variant,
  className,
}: {
  variant: ProductVariant | undefined;
  className?: string;
}) {
  const { add, pending, error } = useCart();
  const unavailable = !variant || !variant.availableForSale;

  return (
    <div className={className}>
      <Button
        size="lg"
        disabled={unavailable || pending}
        aria-busy={pending}
        onClick={() => variant && add(variant.id)}
      >
        {unavailable ? "Sold out" : pending ? "Adding…" : "Add to cart"}
      </Button>

      {error ? (
        <p role="alert" className="text-ink font-body text-caption mt-4 max-w-[34ch]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
