import { addToCartMutation, createCartMutation, editCartItemsMutation, removeFromCartMutation } from "./mutations/cart";
import { getCartQuery } from "./queries/cart";
import { getProductQuery, getProductsQuery } from "./queries/product";
import type {
  Cart,
  Connection,
  Product,
  ShopifyAddToCartOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCreateCartOperation,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation,
} from "./types";

/**
 * BORROWED PLUMBING — vercel/commerce.
 *
 * `types.ts`, `fragments/`, `queries/` and `mutations/` are verbatim from
 * github.com/vercel/commerce. This file is their `lib/shopify/index.ts`
 * adapted: import paths point at our tree, and the collection/menu/page/
 * webhook surface is dropped because this site has none of those. The fetch
 * wrapper, the edge-flattening and the reshape functions are theirs.
 *
 * Wire it up, never style it. Nothing here renders.
 *
 * ⚠ UNEXERCISED. No store exists yet, so this path has never run against a
 * real endpoint. `lib/commerce.ts` selects the mock until credentials land.
 */

const SHOPIFY_GRAPHQL_API_ENDPOINT = "/api/2023-01/graphql.json";

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, "https://")
  : "";
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

function ensureStartsWith(stringToCheck: string, startsWith: string) {
  return stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`;
}

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

export async function shopifyFetch<T>({
  query,
  variables,
  headers,
  cache = "force-cache",
}: {
  query: string;
  variables?: ExtractVariables<T>;
  headers?: HeadersInit;
  cache?: RequestCache;
}): Promise<{ status: number; body: T }> {
  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": key,
        ...headers,
      },
      body: JSON.stringify({ ...(query && { query }), ...(variables && { variables }) }),
      cache,
    });

    const body = await result.json();
    if (body.errors) throw body.errors[0];

    return { status: result.status, body };
  } catch (e) {
    throw {
      cause: e,
      query,
    };
  }
}

const removeEdgesAndNodes = <T>(array: Connection<T>): T[] =>
  array.edges.map((edge) => edge?.node);

const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = { amount: "0.0", currencyCode: cart.cost.totalAmount.currencyCode };
  }
  return { ...cart, lines: removeEdgesAndNodes(cart.lines) };
};

const reshapeProduct = (product: ShopifyProduct, filterHiddenProducts = true) => {
  if (!product || (filterHiddenProducts && product.tags?.includes("nextjs-frontend-hidden"))) {
    return undefined;
  }
  const { images, variants, ...rest } = product;
  return { ...rest, images: removeEdgesAndNodes(images), variants: removeEdgesAndNodes(variants) };
};

const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshaped: Product[] = [];
  for (const product of products) {
    if (product) {
      const r = reshapeProduct(product);
      if (r) reshaped.push(r);
    }
  }
  return reshaped;
};

/* ---- Cart mutations ---------------------------------------------------- */

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation,
    cache: "no-store",
  });
  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  let cartId = await getCartId();
  if (!cartId) {
    const newCart = await createCart();
    if (!newCart.id) throw new Error("Failed to create cart");
    cartId = newCart.id;
    await setCartId(cartId);
  }
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  const cartId = await getCartId();
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: { cartId, lineIds },
    cache: "no-store",
  });
  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const cartId = await getCartId();
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });
  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function getCart(): Promise<Cart | undefined> {
  const cartId = await getCartId();
  if (!cartId) return undefined;

  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
    cache: "no-store",
  });
  if (!res.body.data.cart) return undefined;
  return reshapeCart(res.body.data.cart);
}

/** Cart id lives in a cookie, as in vercel/commerce. */
async function getCartId(): Promise<string> {
  const { cookies } = await import("next/headers");
  return (await cookies()).get("cartId")?.value ?? "";
}

async function setCartId(cartId: string): Promise<void> {
  const { cookies } = await import("next/headers");
  (await cookies()).set("cartId", cartId);
}

/* ---- Product queries --------------------------------------------------- */

export async function getProduct(handle: string): Promise<Product | undefined> {
  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    variables: { handle },
  });
  return reshapeProduct(res.body.data.product, false);
}

export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
} = {}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    variables: { query, reverse, sortKey },
  });
  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}
