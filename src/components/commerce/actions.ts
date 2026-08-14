"use server";

import { revalidateTag } from "next/cache";

import { addToCart, getCart, removeFromCart, updateCart } from "@/lib/commerce";

/**
 * Cart mutations as server actions.
 *
 * The client never talks to Shopify directly — the storefront token stays on
 * the server. Each action returns the authoritative cart so the provider can
 * reconcile its optimistic state rather than guessing.
 *
 * Errors are returned, not thrown: a thrown server action surfaces as an
 * unhandled rejection and the drawer would sit there looking successful. C5
 * renders whatever `error` comes back.
 */
export type CartResult =
  | { ok: true; cart: Awaited<ReturnType<typeof getCart>> }
  | { ok: false; error: string };

export async function addItem(
  merchandiseId: string,
  quantity = 1,
): Promise<CartResult> {
  try {
    const cart = await addToCart([{ merchandiseId, quantity }]);
    revalidateTag("cart");
    return { ok: true, cart };
  } catch (e) {
    return { ok: false, error: message(e, "Could not add that to your cart.") };
  }
}

export async function removeItem(lineId: string): Promise<CartResult> {
  try {
    const cart = await removeFromCart([lineId]);
    revalidateTag("cart");
    return { ok: true, cart };
  } catch (e) {
    return { ok: false, error: message(e, "Could not remove that item.") };
  }
}

export async function updateItemQuantity(
  lineId: string,
  merchandiseId: string,
  quantity: number,
): Promise<CartResult> {
  try {
    const cart =
      quantity <= 0
        ? await removeFromCart([lineId])
        : await updateCart([{ id: lineId, merchandiseId, quantity }]);
    revalidateTag("cart");
    return { ok: true, cart };
  } catch (e) {
    return { ok: false, error: message(e, "Could not update the quantity.") };
  }
}

export async function readCart(): Promise<CartResult> {
  try {
    return { ok: true, cart: await getCart() };
  } catch (e) {
    return { ok: false, error: message(e, "Could not load your cart.") };
  }
}

function message(e: unknown, fallback: string) {
  // Never surface a raw Shopify error to a visitor.
  console.error("[cart]", e);
  return fallback;
}
