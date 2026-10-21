/**
 * The shopper's country, as told to the Storefront API.
 *
 * Shopify decides price, availableForSale and which location's stock a cart
 * line draws from per MARKET, and a request that names no country is treated
 * as the primary market (US). The 500g is stocked only at the Warsaw location,
 * which only serves EU shipping zones — so without a country, every cart was
 * a US cart and Shopify clamped that line to quantity 0.
 *
 * Plain module, no server-only and no next/headers: proxy.ts imports it, and
 * so does lib/shopper-country.ts, which is the server-component side.
 *
 * Resolution order, in proxy.ts:
 *   1. ?country=PL   manual override — the private EU drop link. Kept for 30
 *                    days so the shopper stays in that market while browsing.
 *   2. surya_country the cookie from an earlier request.
 *   3. x-vercel-ip-country, Vercel's geo header. Stored as a session cookie,
 *                    so it is re-detected next browser session.
 *   4. "US"          no header locally, or outside Vercel.
 */

export const COUNTRY_COOKIE = "surya_country";
export const COUNTRY_OVERRIDE_MAX_AGE = 60 * 60 * 24 * 30;
export const DEFAULT_COUNTRY = "US";

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

/**
 * Uppercased ISO 3166-1 alpha-2 code, or null. Anything Intl doesn't know as
 * a region is rejected: an unknown CountryCode is a GraphQL error, and that
 * would take the shop page down to its offline fallback.
 */
export function normalizeCountry(value: string | null | undefined): string | null {
  const code = value?.trim().toUpperCase();
  if (!code || !/^[A-Z]{2}$/.test(code)) return null;

  try {
    const name = regionNames.of(code);
    return name && name !== code && name !== "Unknown Region" ? code : null;
  } catch {
    return null;
  }
}
