import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Shopify product/collection webhook target, so an inventory change busts the
 * ISR cache instead of waiting out the 60s window.
 *
 * Guarded by a shared secret compared in constant time. Without
 * SHOPIFY_REVALIDATION_SECRET set, the route refuses everything rather than
 * defaulting open — an unauthenticated cache-buster is a free denial-of-service.
 */
export async function POST(request: Request) {
  const secret = process.env.SHOPIFY_REVALIDATION_SECRET;
  const provided = request.headers.get("x-shopify-secret") ?? "";

  if (!secret || !timingSafeEqual(secret, provided)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag("products");
  revalidateTag("cart");
  return NextResponse.json({ revalidated: true });
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
