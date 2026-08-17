import "server-only";

/**
 * Shopify Storefront API client.
 *
 * SERVER ONLY, enforced by the "server-only" import above — that is not a
 * comment, it is a build error if any client component ever imports this file.
 * The token below is a Storefront token, which is public-safe by design, but
 * keeping the whole module server-side means the credential never appears in a
 * bundle, product reads happen once on the server instead of once per visitor,
 * and there is no path by which an Admin token could be swapped in and leak.
 * That last point is the reason for the strictness: the failure mode of
 * getting this wrong is unrecoverable, so the guard is structural.
 *
 * Env, per your spec — no NEXT_PUBLIC_ prefix on either:
 *   SHOPIFY_STORE_DOMAIN      ex: surya-cacao.myshopify.com
 *   SHOPIFY_STOREFRONT_TOKEN  Storefront API access token
 *   SHOPIFY_PRODUCT_HANDLE    optional, defaults below
 *
 * If domain or token is missing, `shopifyConfigured` is false and every export
 * here returns null. The shop page then renders from content/product.ts with
 * purchase disabled rather than showing a broken or empty store.
 */

const API_VERSION = "2025-07";

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;

export const PRODUCT_HANDLE =
  process.env.SHOPIFY_PRODUCT_HANDLE ?? "ceremonial-cacao";

export const shopifyConfigured = Boolean(DOMAIN && TOKEN);

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: string;
  currencyCode: string;
  image: { url: string; altText: string | null } | null;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  /** The variant option's own name in the admin — "size" on this product. */
  optionName: string;
  images: { url: string; altText: string | null }[];
  variants: ProductVariant[];
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

async function storefront<T>(
  query: string,
  variables: Record<string, unknown> = {},
  /** Reads are cached; cart mutations must never be. */
  cache: RequestCache = "force-cache",
): Promise<T | null> {
  if (!DOMAIN || !TOKEN) return null;

  try {
    const res = await fetch(
      `https://${DOMAIN}/api/${API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": TOKEN,
        },
        body: JSON.stringify({ query, variables }),
        cache,
        // Prices and stock should not be an hour stale, and should not require
        // a redeploy to change. Ten minutes is the compromise.
        next: cache === "force-cache" ? { revalidate: 600 } : undefined,
      },
    );

    if (!res.ok) {
      console.error(`Shopify Storefront API: HTTP ${res.status}`);
      return null;
    }

    const body: GraphQLResponse<T> = await res.json();

    if (body.errors?.length) {
      console.error(
        "Shopify Storefront API:",
        body.errors.map((e) => e.message).join("; "),
      );
      return null;
    }

    return body.data ?? null;
  } catch (error) {
    // A store outage must not take the whole page down with it — the caller
    // falls back to the static copy.
    console.error("Shopify Storefront API: request failed", error);
    return null;
  }
}

const PRODUCT_QUERY = /* GraphQL */ `
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      options {
        name
        values
      }
      images(first: 10) {
        nodes {
          url
          altText
        }
      }
      variants(first: 20) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

type ProductQueryResult = {
  product: {
    id: string;
    title: string;
    description: string;
    options: { name: string; values: string[] }[];
    images: { nodes: { url: string; altText: string | null }[] };
    variants: {
      nodes: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: { amount: string; currencyCode: string };
        image: { url: string; altText: string | null } | null;
      }[];
    };
  } | null;
};

/**
 * Variant IDs, prices and stock all come from here rather than from any
 * hardcoded table, so a change in the Shopify admin shows up without a deploy.
 */
export async function getProduct(
  handle: string = PRODUCT_HANDLE,
): Promise<Product | null> {
  const data = await storefront<ProductQueryResult>(PRODUCT_QUERY, { handle });
  const product = data?.product;
  if (!product) return null;

  return {
    id: product.id,
    title: product.title,
    description: product.description,
    // Shopify capitalises nothing; "size" becomes "Size" for display. Falls
    // back rather than throwing if a product somehow has no options.
    optionName: product.options[0]?.name
      ? product.options[0].name.charAt(0).toUpperCase() +
        product.options[0].name.slice(1)
      : "Size",
    images: product.images.nodes,
    variants: product.variants.nodes.map((v) => ({
      id: v.id,
      title: v.title,
      availableForSale: v.availableForSale,
      price: v.price.amount,
      currencyCode: v.price.currencyCode,
      image: v.image,
    })),
  };
}

const CART_CREATE = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

type CartCreateResult = {
  cartCreate: {
    cart: { id: string; checkoutUrl: string } | null;
    userErrors: { field: string[] | null; message: string }[];
  };
};

/**
 * Creates a cart with one line and hands back Shopify's hosted checkout URL.
 *
 * Deliberately not a custom checkout: payment, tax and shipping are Shopify's
 * problem, and re-implementing them would put this site in PCI scope for no
 * gain.
 *
 * `no-store` because a cached cart mutation would hand two different buyers
 * the same cart.
 */
export async function createCheckout(
  variantId: string,
  quantity = 1,
): Promise<{ checkoutUrl: string } | { error: string }> {
  const data = await storefront<CartCreateResult>(
    CART_CREATE,
    { lines: [{ merchandiseId: variantId, quantity }] },
    "no-store",
  );

  if (!data) return { error: "Could not reach the store." };

  const { cart, userErrors } = data.cartCreate;

  if (userErrors.length) {
    console.error("Shopify cartCreate:", userErrors);
    return { error: userErrors[0].message };
  }

  if (!cart) return { error: "The cart could not be created." };

  return { checkoutUrl: cart.checkoutUrl };
}
