"use server";

import { createCheckout } from "@/lib/shopify";

/**
 * Add-to-cart, as a server action.
 *
 * The variant ID arrives from the client, so it is validated here rather than
 * trusted: a Storefront merchandise ID is always a ProductVariant GID. Passing
 * an arbitrary string straight into the mutation would let a caller aim this
 * at any global ID they liked.
 *
 * Quantity is clamped for the same reason — the control on the page has no way
 * to send 10,000, but the action is a public endpoint and does not get to
 * assume its own UI is the only caller.
 *
 * Returns the checkout URL instead of redirecting, so the client can open it
 * without the action swallowing an error into a thrown redirect.
 */
export async function startCheckout(
  variantId: string,
  quantity: number,
): Promise<{ checkoutUrl: string } | { error: string }> {
  if (!/^gid:\/\/shopify\/ProductVariant\/\d+$/.test(variantId)) {
    return { error: "That size isn't available." };
  }

  const safeQuantity = Math.min(Math.max(Math.trunc(quantity) || 1, 1), 20);

  return createCheckout(variantId, safeQuantity);
}
