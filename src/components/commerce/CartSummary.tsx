// C8 — CartSummary. SURYA_CACAO_BUILD_PLAN.md §3.4
"use client";

import { Button, HairlineRule } from "@/components/primitives";
import { ShippingNote } from "./ShippingNote";
import { formatPrice } from "@/lib/money";
import type { Cart } from "@/lib/shopify/types";

/**
 * Subtotal, shipping note, checkout CTA.
 *
 * Checkout is a plain <a> to `cart.checkoutUrl`, not a router push: it leaves
 * the app for Shopify's hosted checkout, and the build prompt is explicit that
 * we do not build a checkout UI.
 *
 * Tax and shipping are shown as "calculated at checkout" rather than as a
 * total we invent here — Shopify computes them from the destination, and
 * printing a confident number we can't stand behind is worse than deferring.
 */
export function CartSummary({ cart }: { cart: Cart }) {
  const empty = cart.lines.length === 0;

  return (
    <div>
      <HairlineRule />

      <dl className="mt-6 space-y-3">
        <div className="flex items-baseline justify-between">
          <dt className="text-muted font-body text-caption">Subtotal</dt>
          <dd className="text-ink font-body text-body tabular-nums">
            {formatPrice(cart.cost.subtotalAmount)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between">
          <dt className="text-muted font-body text-caption">
            Shipping &amp; tax
          </dt>
          <dd className="text-muted font-body text-caption">
            Calculated at checkout
          </dd>
        </div>
      </dl>

      <a
        href={empty ? undefined : cart.checkoutUrl}
        aria-disabled={empty}
        tabIndex={empty ? -1 : 0}
        className={empty ? "pointer-events-none" : undefined}
      >
        <Button size="lg" className="mt-8 w-full" disabled={empty}>
          Checkout
        </Button>
      </a>

      <ShippingNote className="mt-6" />
    </div>
  );
}
