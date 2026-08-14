import "server-only";

import * as mock from "@/lib/mock/products";
import * as shopify from "@/lib/shopify";

/**
 * THE ONE-FILE SWAP (§1.A).
 *
 * Everything in the app imports commerce from here, never from `mock/` or
 * `shopify/` directly. When the store exists, set the two env vars and this
 * module starts resolving to the real client — no component changes.
 *
 * The selection is made at module load from server-only env vars, so the
 * decision is identical for every request and can't be spoofed from a client.
 */
export const USING_MOCK = !(
  process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
);

const impl = USING_MOCK ? mock : shopify;

export const getProduct = impl.getProduct;
export const getProducts = impl.getProducts;
export const getCart = impl.getCart;
export const createCart = impl.createCart;
export const addToCart = impl.addToCart;
export const removeFromCart = impl.removeFromCart;
export const updateCart = impl.updateCart;

/**
 * Mock-only helpers. The real client has no equivalent — `getPrimaryProduct`
 * becomes `getProduct("ceremonial-cacao")` and coming-soon becomes a Shopify
 * tag query. Kept separate so the swap surface above stays exactly the
 * Shopify API.
 */
export async function getPrimaryProduct() {
  if (USING_MOCK) return mock.getPrimaryProduct();
  const p = await shopify.getProduct("ceremonial-cacao");
  if (!p) throw new Error("Primary product 'ceremonial-cacao' not found");
  return p;
}

export async function getComingSoonProducts() {
  if (USING_MOCK) return mock.getComingSoonProducts();
  return shopify.getProducts({ query: "tag:coming-soon" });
}

export { isComingSoon } from "@/lib/mock/products";
/* formatPrice / VARIANT_WEIGHT live in lib/money.ts — client-safe, no server-only. */
