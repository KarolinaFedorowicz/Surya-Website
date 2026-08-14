import type { Money } from "@/lib/shopify/types";

/**
 * Client-safe money helpers.
 *
 * Separate from `lib/commerce.ts` because that module is `server-only` — it
 * touches the storefront token. Formatting is a pure function the cart drawer
 * and price counter need in the browser, so it lives here instead. Keeping it
 * out of `lib/mock/` means deleting the mock cannot break client components,
 * which is the whole point of the one-file swap.
 */
export function formatPrice(money: Money, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currencyCode,
    // Whole-dollar pricing reads calmer than trailing zeroes on a luxury page.
    minimumFractionDigits: Number(money.amount) % 1 === 0 ? 0 : 2,
  }).format(Number(money.amount));
}

/**
 * Grams per variant title. Shopify's Product type carries no weight, and C3
 * PriceCounter counts it alongside the price. Replace with a Shopify metafield
 * when the store exists.
 */
export const VARIANT_WEIGHT: Record<string, number> = {
  "150g": 150,
  "300g": 300,
  "500g": 500,
};
