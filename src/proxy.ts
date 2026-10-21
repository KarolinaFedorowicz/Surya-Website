import { NextResponse, type NextRequest } from "next/server";
import {
  COUNTRY_COOKIE,
  COUNTRY_OVERRIDE_MAX_AGE,
  DEFAULT_COUNTRY,
  normalizeCountry,
} from "@/lib/country";

/**
 * Resolves the shopper's country once per request — see lib/country.ts for
 * the order — and writes it to the surya_country cookie.
 *
 * Also retires surya_cart_id. Carts made under that cookie were created with
 * no buyer country, so they are US carts that may hold 0-quantity lines.
 * Dropping the cookie gives those visitors a fresh cart, made in their own
 * market, on their next add; app/cart/actions.ts uses a new cookie name.
 */
const LEGACY_CART_COOKIE = "surya_cart_id";

export function proxy(request: NextRequest) {
  const override = normalizeCountry(request.nextUrl.searchParams.get("country"));
  const saved = normalizeCountry(request.cookies.get(COUNTRY_COOKIE)?.value);
  const detected = normalizeCountry(request.headers.get("x-vercel-ip-country"));
  const country = override ?? saved ?? detected ?? DEFAULT_COUNTRY;

  // Written onto the request too, so server components and actions rendering
  // THIS request already see it — the response cookie only arrives next time.
  request.cookies.set(COUNTRY_COOKIE, country);
  const hadLegacyCart = request.cookies.has(LEGACY_CART_COOKIE);
  if (hadLegacyCart) request.cookies.delete(LEGACY_CART_COOKIE);

  const response = NextResponse.next({ request: { headers: request.headers } });

  if (override) {
    response.cookies.set(COUNTRY_COOKIE, country, {
      sameSite: "lax",
      path: "/",
      maxAge: COUNTRY_OVERRIDE_MAX_AGE,
    });
  } else if (!saved) {
    response.cookies.set(COUNTRY_COOKIE, country, { sameSite: "lax", path: "/" });
  }

  if (hadLegacyCart) response.cookies.delete(LEGACY_CART_COOKIE);

  return response;
}

export const config = {
  // Pages and server actions only — not build assets or files in /public.
  matcher: ["/((?!_next/static|_next/image|assets/|favicon.ico|icon.svg).*)"],
};
