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

/**
 * A subscription option ("Deliver every month"), configured in Shopify admin
 * via the Subscriptions app — not something this codebase can create. When
 * the product has none, sellingPlans is empty and the cart drawer disables
 * the subscribe option rather than offering a plan that doesn't exist.
 */
export type SellingPlan = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  /** The variant option's own name in the admin — "size" on this product. */
  optionName: string;
  images: { url: string; altText: string | null }[];
  variants: ProductVariant[];
  sellingPlans: SellingPlan[];
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
      sellingPlanGroups(first: 5) {
        nodes {
          sellingPlans(first: 5) {
            nodes {
              id
              name
            }
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
    sellingPlanGroups: {
      nodes: { sellingPlans: { nodes: { id: string; name: string }[] } }[];
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
    sellingPlans: product.sellingPlanGroups.nodes.flatMap((group) =>
      group.sellingPlans.nodes,
    ),
  };
}

/**
 * Cart, kept as real Shopify cart state rather than the previous pattern of
 * creating a fresh cart and redirecting straight to checkout on every click.
 * The cart ID is a random unguessable string scoped to one buyer, so it is
 * safe to hold in a plain (non-HttpOnly) cookie — see cart-actions.ts, which
 * is the only thing that reads or writes that cookie.
 *
 * Deliberately not a custom checkout: payment, tax and shipping are Shopify's
 * problem, and re-implementing them would put this site in PCI scope for no
 * gain. Every function here ends at a Shopify-hosted checkoutUrl, never at a
 * card field of our own.
 */
export type CartLine = {
  id: string;
  quantity: number;
  merchandiseId: string;
  productTitle: string;
  variantTitle: string;
  price: string;
  currencyCode: string;
  image: { url: string; altText: string | null } | null;
  /** Null means a one-time purchase — the line has no subscription attached. */
  sellingPlanName: string | null;
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: string;
  currencyCode: string;
  lines: CartLine[];
};

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 50) {
      nodes {
        id
        quantity
        sellingPlanAllocation {
          sellingPlan {
            name
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            price {
              amount
              currencyCode
            }
            image {
              url
              altText
            }
            product {
              title
            }
          }
        }
      }
    }
  }
`;

type RawCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: { amount: string; currencyCode: string } };
  lines: {
    nodes: {
      id: string;
      quantity: number;
      sellingPlanAllocation: { sellingPlan: { name: string } } | null;
      merchandise: {
        id: string;
        title: string;
        price: { amount: string; currencyCode: string };
        image: { url: string; altText: string | null } | null;
        product: { title: string };
      };
    }[];
  };
};

function mapCart(raw: RawCart): Cart {
  return {
    id: raw.id,
    checkoutUrl: raw.checkoutUrl,
    totalQuantity: raw.totalQuantity,
    subtotal: raw.cost.subtotalAmount.amount,
    currencyCode: raw.cost.subtotalAmount.currencyCode,
    lines: raw.lines.nodes.map((line) => ({
      id: line.id,
      quantity: line.quantity,
      merchandiseId: line.merchandise.id,
      productTitle: line.merchandise.product.title,
      variantTitle: line.merchandise.title,
      price: line.merchandise.price.amount,
      currencyCode: line.merchandise.price.currencyCode,
      image: line.merchandise.image,
      sellingPlanName: line.sellingPlanAllocation?.sellingPlan.name ?? null,
    })),
  };
}

const CART_QUERY = /* GraphQL */ `
  query Cart($id: ID!) {
    cart(id: $id) {
      ...CartFields
    }
  }
  ${CART_FRAGMENT}
`;

/** Null return means the cart ID is stale (expired or already converted to an
 * order) — the caller starts a fresh cart rather than erroring. */
export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await storefront<{ cart: RawCart | null }>(
    CART_QUERY,
    { id: cartId },
    "no-store",
  );
  const raw = data?.cart;
  return raw ? mapCart(raw) : null;
}

const CART_CREATE = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

const CART_LINES_ADD = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

const CART_LINES_UPDATE = /* GraphQL */ `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

const CART_LINES_REMOVE = /* GraphQL */ `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

type CartMutationResult<K extends string> = {
  [key in K]: {
    cart: RawCart | null;
    userErrors: { field: string[] | null; message: string }[];
  };
};

function unwrap<K extends string>(
  data: CartMutationResult<K> | null,
  key: K,
): Cart | { error: string } {
  if (!data) return { error: "Could not reach the store." };

  const { cart, userErrors } = data[key];
  if (userErrors.length) {
    console.error(`Shopify ${key}:`, userErrors);
    return { error: userErrors[0].message };
  }
  if (!cart) return { error: "The cart could not be updated." };

  return mapCart(cart);
}

/** `sellingPlanId` attaches a subscription (from Product.sellingPlans) to the
 * line; omit it for a one-time purchase. */
export async function createCart(
  variantId: string,
  quantity: number,
  sellingPlanId?: string,
): Promise<Cart | { error: string }> {
  const data = await storefront<CartMutationResult<"cartCreate">>(
    CART_CREATE,
    {
      lines: [
        { merchandiseId: variantId, quantity, sellingPlanId },
      ],
    },
    "no-store",
  );
  return unwrap(data, "cartCreate");
}

export async function addCartLine(
  cartId: string,
  variantId: string,
  quantity: number,
  sellingPlanId?: string,
): Promise<Cart | { error: string }> {
  const data = await storefront<CartMutationResult<"cartLinesAdd">>(
    CART_LINES_ADD,
    {
      cartId,
      lines: [
        { merchandiseId: variantId, quantity, sellingPlanId },
      ],
    },
    "no-store",
  );
  return unwrap(data, "cartLinesAdd");
}

/**
 * `sellingPlanId`, when passed, attaches a subscription to an existing
 * one-time line — this is how the cart drawer's "Subscribe & save" control
 * upgrades a line without removing and re-adding it.
 */
export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
  sellingPlanId?: string,
): Promise<Cart | { error: string }> {
  const data = await storefront<CartMutationResult<"cartLinesUpdate">>(
    CART_LINES_UPDATE,
    { cartId, lines: [{ id: lineId, quantity, sellingPlanId }] },
    "no-store",
  );
  return unwrap(data, "cartLinesUpdate");
}

export async function removeCartLine(
  cartId: string,
  lineId: string,
): Promise<Cart | { error: string }> {
  const data = await storefront<CartMutationResult<"cartLinesRemove">>(
    CART_LINES_REMOVE,
    { cartId, lineIds: [lineId] },
    "no-store",
  );
  return unwrap(data, "cartLinesRemove");
}
