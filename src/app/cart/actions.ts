"use server";

import { cookies } from "next/headers";
import {
  addCartLine,
  createCart,
  getCart,
  getProduct,
  removeCartLine,
  updateCartLine,
  type Cart,
  type SellingPlan,
} from "@/lib/shopify";

/**
 * Cart identity lives in a plain cookie, not a database — Shopify's cart IS
 * the database, this just remembers which one belongs to this browser. The
 * ID is a random unguessable GID scoped to a single buyer's cart, so it
 * carries no more risk sitting in a readable cookie than in localStorage;
 * HttpOnly would only stop this module's own client code from reading it.
 */
const COOKIE = "surya_cart_id";
const COOKIE_OPTIONS = {
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 30,
  path: "/",
};

const VARIANT_GID = /^gid:\/\/shopify\/ProductVariant\/\d+$/;
const SELLING_PLAN_GID = /^gid:\/\/shopify\/SellingPlan\/\d+$/;

export async function getCurrentCart(): Promise<Cart | null> {
  const store = await cookies();
  const cartId = store.get(COOKIE)?.value;
  if (!cartId) return null;
  return getCart(cartId);
}

/**
 * Same GID validation as the old startCheckout action, for the same reason:
 * this is a public entry point, not just a call from our own UI.
 */
export async function addToCart(
  variantId: string,
  quantity: number,
  sellingPlanId?: string,
): Promise<Cart | { error: string }> {
  if (!VARIANT_GID.test(variantId)) {
    return { error: "That size isn't available." };
  }
  if (sellingPlanId && !SELLING_PLAN_GID.test(sellingPlanId)) {
    return { error: "That subscription option isn't available." };
  }

  const safeQuantity = Math.min(Math.max(Math.trunc(quantity) || 1, 1), 20);
  const store = await cookies();
  const cartId = store.get(COOKIE)?.value;

  let result = cartId
    ? await addCartLine(cartId, variantId, safeQuantity, sellingPlanId)
    : await createCart(variantId, safeQuantity, sellingPlanId);

  // A cart ID can go stale — expired, or already converted to an order — in
  // which case cartLinesAdd comes back with a userError rather than a
  // network failure. Start one fresh cart rather than surfacing that.
  if ("error" in result && cartId) {
    result = await createCart(variantId, safeQuantity, sellingPlanId);
  }

  if ("error" in result) return result;

  store.set(COOKIE, result.id, COOKIE_OPTIONS);
  return result;
}

export async function changeCartLineQuantity(
  lineId: string,
  quantity: number,
): Promise<Cart | { error: string }> {
  const store = await cookies();
  const cartId = store.get(COOKIE)?.value;
  if (!cartId) return { error: "Your cart has expired — add the item again." };

  const safeQuantity = Math.min(Math.max(Math.trunc(quantity), 0), 20);
  if (safeQuantity === 0) return removeCartLine(cartId, lineId);
  return updateCartLine(cartId, lineId, safeQuantity);
}

export async function removeFromCart(
  lineId: string,
): Promise<Cart | { error: string }> {
  const store = await cookies();
  const cartId = store.get(COOKIE)?.value;
  if (!cartId) return { error: "Your cart has expired — add the item again." };
  return removeCartLine(cartId, lineId);
}

/** Upgrades an existing one-time line to a subscription — the cart drawer's
 * "Subscribe & save" control on a line that's already in the cart. */
export async function subscribeCartLine(
  lineId: string,
  quantity: number,
  sellingPlanId: string,
): Promise<Cart | { error: string }> {
  if (!SELLING_PLAN_GID.test(sellingPlanId)) {
    return { error: "That subscription option isn't available." };
  }

  const store = await cookies();
  const cartId = store.get(COOKIE)?.value;
  if (!cartId) return { error: "Your cart has expired — add the item again." };

  return updateCartLine(cartId, lineId, quantity, sellingPlanId);
}

/** The subscription options configured in Shopify admin, if any — see the
 * SellingPlan note in lib/shopify.ts. Empty until that's set up. */
export async function getAvailableSellingPlans(): Promise<SellingPlan[]> {
  const product = await getProduct();
  return product?.sellingPlans ?? [];
}
