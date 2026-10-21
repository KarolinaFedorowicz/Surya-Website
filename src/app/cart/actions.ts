"use server";

import { cookies } from "next/headers";
import {
  addCartLine,
  createCart,
  getCart,
  getProduct,
  removeCartLines,
  updateCartCountry,
  updateCartLine,
  type Cart,
  type SellingPlan,
} from "@/lib/shopify";
import { getShopperCountry } from "@/lib/shopper-country";

/**
 * Cart identity lives in a plain cookie, not a database — Shopify's cart IS
 * the database, this just remembers which one belongs to this browser. The
 * ID is a random unguessable GID scoped to a single buyer's cart, so it
 * carries no more risk sitting in a readable cookie than in localStorage;
 * HttpOnly would only stop this module's own client code from reading it.
 *
 * "surya_cart", not the old "surya_cart_id": carts under the old name were
 * made with no buyer country, and proxy.ts deletes that cookie on sight.
 * surya_cart_country remembers which market the cart is in, so an add only
 * pays for a cartBuyerIdentityUpdate when the shopper's country has changed.
 */
const COOKIE = "surya_cart";
const COUNTRY_COOKIE = "surya_cart_country";
const COOKIE_OPTIONS = {
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 30,
  path: "/",
};

const VARIANT_GID = /^gid:\/\/shopify\/ProductVariant\/\d+$/;
const SELLING_PLAN_GID = /^gid:\/\/shopify\/SellingPlan\/\d+$/;

/**
 * A cart plus anything removed from it on the way back. `notices` are shown
 * at the top of the cart drawer in place of the line that would otherwise
 * have sat there at quantity 0 and $0.
 */
export type CartView = Cart & { notices: string[] };

type CartActionResult = CartView | { error: string };

/**
 * Removes every line that can't actually be bought: one Shopify left at
 * quantity 0, or one a stock warning names. A 0-quantity line is what a
 * cart in the wrong market produces — no location serving that market has
 * the stock — so it reads "Not available in your region". A partial-stock
 * warning reads "Out of stock".
 *
 * The Storefront API can't say WHY a variant has no sellable stock in a
 * market, so a size that is genuinely sold out everywhere also gets the
 * region message here. The product page already marks it Sold out and
 * disables its button, so this path is mostly the wrong-market case.
 */
async function prune(cart: Cart, country: string): Promise<CartActionResult> {
  const stockWarning = (lineId: string, merchandiseId: string) =>
    cart.warnings.find(
      (w) =>
        (w.code === "MERCHANDISE_NOT_ENOUGH_STOCK" ||
          w.code === "MERCHANDISE_OUT_OF_STOCK") &&
        (w.target === lineId || w.target === merchandiseId),
    );

  const unbuyable = cart.lines.filter(
    (line) => line.quantity === 0 || stockWarning(line.id, line.merchandiseId),
  );
  if (!unbuyable.length) return { ...cart, notices: [] };

  const notices = unbuyable.map((line) => {
    const warning = stockWarning(line.id, line.merchandiseId);
    const reason =
      warning?.code === "MERCHANDISE_NOT_ENOUGH_STOCK"
        ? "Out of stock"
        : "Not available in your region";
    return `${line.productTitle} · ${line.variantTitle}: ${reason}`;
  });

  const cleaned = await removeCartLines(
    cart.id,
    unbuyable.map((line) => line.id),
    country,
  );
  if ("error" in cleaned) return cleaned;
  return { ...cleaned, notices };
}

async function remember(cart: Cart, country: string) {
  const store = await cookies();
  store.set(COOKIE, cart.id, COOKIE_OPTIONS);
  store.set(COUNTRY_COOKIE, country, COOKIE_OPTIONS);
}

export async function getCurrentCart(): Promise<CartView | null> {
  const store = await cookies();
  const cartId = store.get(COOKIE)?.value;
  if (!cartId) return null;

  const country = await getShopperCountry();
  let cart: Cart | { error: string } | null = await getCart(cartId, country);
  if (!cart) return null;

  // The shopper's country changed since this cart was made — move the cart
  // into their market so its lines, prices and checkout match what the
  // product page is now showing them.
  if (cart.countryCode !== country) {
    cart = await updateCartCountry(cartId, country);
    if ("error" in cart) return null;
    await remember(cart, country);
  }

  const result = await prune(cart, country);
  return "error" in result ? null : result;
}

/**
 * Same GID validation as the old startCheckout action, for the same reason:
 * this is a public entry point, not just a call from our own UI.
 */
export async function addToCart(
  variantId: string,
  quantity: number,
  sellingPlanId?: string,
): Promise<CartActionResult> {
  if (!VARIANT_GID.test(variantId)) {
    return { error: "That size isn't available." };
  }
  if (sellingPlanId && !SELLING_PLAN_GID.test(sellingPlanId)) {
    return { error: "That subscription option isn't available." };
  }

  const safeQuantity = Math.min(Math.max(Math.trunc(quantity) || 1, 1), 20);
  const store = await cookies();
  const country = await getShopperCountry();
  let cartId = store.get(COOKIE)?.value;

  // Move the cart BEFORE adding, so the new line is stocked from the right
  // market. If the move fails the cart is unusable here; start a fresh one.
  if (cartId && store.get(COUNTRY_COOKIE)?.value !== country) {
    const moved = await updateCartCountry(cartId, country);
    if ("error" in moved) cartId = undefined;
  }

  let result = cartId
    ? await addCartLine(cartId, variantId, safeQuantity, country, sellingPlanId)
    : await createCart(variantId, safeQuantity, country, sellingPlanId);

  // A cart ID can go stale — expired, or already converted to an order — in
  // which case cartLinesAdd comes back with a userError rather than a
  // network failure. Start one fresh cart rather than surfacing that.
  if ("error" in result && cartId) {
    result = await createCart(variantId, safeQuantity, country, sellingPlanId);
  }

  if ("error" in result) return result;

  await remember(result, country);
  return prune(result, country);
}

export async function changeCartLineQuantity(
  lineId: string,
  quantity: number,
): Promise<CartActionResult> {
  const store = await cookies();
  const cartId = store.get(COOKIE)?.value;
  if (!cartId) return { error: "Your cart has expired — add the item again." };

  const country = await getShopperCountry();
  const safeQuantity = Math.min(Math.max(Math.trunc(quantity), 0), 20);
  const result =
    safeQuantity === 0
      ? await removeCartLines(cartId, [lineId], country)
      : await updateCartLine(cartId, lineId, safeQuantity, country);
  return "error" in result ? result : prune(result, country);
}

export async function removeFromCart(
  lineId: string,
): Promise<CartActionResult> {
  const store = await cookies();
  const cartId = store.get(COOKIE)?.value;
  if (!cartId) return { error: "Your cart has expired — add the item again." };

  const country = await getShopperCountry();
  const result = await removeCartLines(cartId, [lineId], country);
  return "error" in result ? result : { ...result, notices: [] };
}

/** Upgrades an existing one-time line to a subscription — the cart drawer's
 * "Subscribe & save" control on a line that's already in the cart. */
export async function subscribeCartLine(
  lineId: string,
  quantity: number,
  sellingPlanId: string,
): Promise<CartActionResult> {
  if (!SELLING_PLAN_GID.test(sellingPlanId)) {
    return { error: "That subscription option isn't available." };
  }

  const store = await cookies();
  const cartId = store.get(COOKIE)?.value;
  if (!cartId) return { error: "Your cart has expired — add the item again." };

  const country = await getShopperCountry();
  const result = await updateCartLine(
    cartId,
    lineId,
    quantity,
    country,
    sellingPlanId,
  );
  return "error" in result ? result : prune(result, country);
}

/** The subscription options configured in Shopify admin, if any — see the
 * SellingPlan note in lib/shopify.ts. Empty until that's set up. */
export async function getAvailableSellingPlans(): Promise<SellingPlan[]> {
  const product = await getProduct(await getShopperCountry());
  return product?.sellingPlans ?? [];
}
