import "server-only";

import { cookies } from "next/headers";
import { COUNTRY_COOKIE, DEFAULT_COUNTRY, normalizeCountry } from "./country";

/**
 * The country proxy.ts resolved for this request. proxy.ts also writes it
 * onto the incoming request's cookies, so this is right on a visitor's very
 * first request, before the browser has stored anything.
 */
export async function getShopperCountry(): Promise<string> {
  const store = await cookies();
  return normalizeCountry(store.get(COUNTRY_COOKIE)?.value) ?? DEFAULT_COUNTRY;
}
