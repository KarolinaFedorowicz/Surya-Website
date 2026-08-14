import type { Cart, CartItem, Product } from "@/lib/shopify/types";

export { formatPrice, VARIANT_WEIGHT } from "@/lib/money";

/**
 * Mock commerce module — §1.A.
 *
 * Types are imported from `lib/shopify/types` rather than redefined, so the
 * mock cannot drift from the real client's shape. Every exported function
 * matches the corresponding export in `lib/shopify/index.ts`, which is what
 * makes going live a one-line change in `lib/commerce.ts`.
 *
 * ⚠ PRICES ARE PLACEHOLDER — $28 / $48 / $72, agreed as stand-ins. They live
 * only here. Do not copy them into a component.
 */

const usd = (amount: string) => ({ amount, currencyCode: "USD" });

const BAG_CUTOUT = {
  url: "/assets/product/bag-300g-transparent-cutout.png",
  altText: "Surya Cacao ceremonial cacao bag",
  width: 432,
  height: 577,
};
const BAG_STUDIO = {
  url: "/assets/product/bag-300g-studio-cream-bg.png",
  altText: "Surya Cacao ceremonial cacao bag on a warm cream backdrop",
  width: 1085,
  height: 1450,
};
const BAG_MEADOW = {
  url: "/assets/product/bag-300g-meadow-goldenhour.png",
  altText: "Surya Cacao bag in a wildflower meadow at golden hour",
  width: 1085,
  height: 1449,
};


/**
 * One product, three variants — plan C1: "the three sizes as ONE elegant
 * block, not three cards."
 */
const CEREMONIAL_CACAO: Product = {
  id: "gid://mock/Product/ceremonial-cacao",
  handle: "ceremonial-cacao",
  availableForSale: true,
  title: "Ceremonial Cacao",
  description:
    "Placeholder description. Single-origin, stone-ground, nothing added. Final copy lives in content/copy/.",
  descriptionHtml:
    "<p>Placeholder description. Single-origin, stone-ground, nothing added.</p>",
  options: [{ id: "opt-size", name: "Size", values: ["150g", "300g", "500g"] }],
  priceRange: { maxVariantPrice: usd("72.00"), minVariantPrice: usd("28.00") },
  variants: [
    {
      id: "gid://mock/ProductVariant/150",
      title: "150g",
      availableForSale: true,
      selectedOptions: [{ name: "Size", value: "150g" }],
      price: usd("28.00"),
    },
    {
      id: "gid://mock/ProductVariant/300",
      title: "300g",
      availableForSale: true,
      selectedOptions: [{ name: "Size", value: "300g" }],
      price: usd("48.00"),
    },
    {
      id: "gid://mock/ProductVariant/500",
      title: "500g",
      availableForSale: true,
      selectedOptions: [{ name: "Size", value: "500g" }],
      price: usd("72.00"),
    },
  ],
  featuredImage: BAG_STUDIO,
  images: [BAG_STUDIO, BAG_CUTOUT, BAG_MEADOW],
  seo: { title: "Ceremonial Cacao", description: "Single-origin ceremonial cacao." },
  tags: [],
  updatedAt: "2026-01-01T00:00:00Z",
};

const comingSoon = (id: string, handle: string, title: string): Product => ({
  id: `gid://mock/Product/${id}`,
  handle,
  availableForSale: false,
  title,
  description: "Placeholder. Coming soon.",
  descriptionHtml: "<p>Placeholder. Coming soon.</p>",
  options: [],
  priceRange: { maxVariantPrice: usd("0.00"), minVariantPrice: usd("0.00") },
  variants: [],
  featuredImage: { ...BAG_CUTOUT, altText: title },
  images: [],
  seo: { title, description: "Coming soon." },
  /* Tagged so the real client's reshapeProduct would treat them the same way. */
  tags: ["coming-soon"],
  updatedAt: "2026-01-01T00:00:00Z",
});

const COMING_SOON = [
  comingSoon("vanilla-bean-cacao", "vanilla-bean-cacao", "Vanilla Bean Cacao"),
  comingSoon(
    "vanilla-cacao-body-butter",
    "vanilla-cacao-body-butter",
    "Vanilla Cacao Body Butter",
  ),
];

const ALL = [CEREMONIAL_CACAO, ...COMING_SOON];

export const isComingSoon = (p: Product) => p.tags.includes("coming-soon");

/* -------------------------------------------------------------------------
   Products — signatures match lib/shopify/index.ts
   ------------------------------------------------------------------------- */

export async function getProduct(handle: string): Promise<Product | undefined> {
  return ALL.find((p) => p.handle === handle);
}

export async function getProducts(): Promise<Product[]> {
  return ALL;
}

export async function getPrimaryProduct(): Promise<Product> {
  return CEREMONIAL_CACAO;
}

export async function getComingSoonProducts(): Promise<Product[]> {
  return COMING_SOON;
}

/* -------------------------------------------------------------------------
   Cart — in-memory, module-scoped.
   ------------------------------------------------------------------------- */

/**
 * A module-level cart is correct ONLY because this is a single-user dev mock.
 * In a real deployment this would be shared across every visitor hitting the
 * same server instance. The Shopify client stores the cart id in a cookie
 * instead; nothing outside this file depends on which it is.
 */
let cart: Cart | null = null;

const money = (n: number) => usd(n.toFixed(2));

function recalculate(c: Cart): Cart {
  const subtotal = c.lines.reduce(
    (sum, l) => sum + Number(l.cost.totalAmount.amount),
    0,
  );
  return {
    ...c,
    totalQuantity: c.lines.reduce((sum, l) => sum + l.quantity, 0),
    cost: {
      subtotalAmount: money(subtotal),
      totalAmount: money(subtotal),
      totalTaxAmount: money(0),
    },
  };
}

function emptyCart(): Cart {
  return {
    id: "gid://mock/Cart/1",
    /* The real checkoutUrl is Shopify-hosted. Pointed at a local explainer so
       a click during development lands somewhere honest instead of 404ing or
       silently doing nothing. */
    checkoutUrl: "/checkout-unavailable",
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: money(0),
      totalAmount: money(0),
      totalTaxAmount: money(0),
    },
  };
}

function lineFor(
  product: Product,
  merchandiseId: string,
  quantity: number,
): CartItem {
  const variant = product.variants.find((v) => v.id === merchandiseId)!;
  return {
    id: `line-${merchandiseId}`,
    quantity,
    cost: { totalAmount: money(Number(variant.price.amount) * quantity) },
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage,
      },
    },
  };
}

export async function createCart(): Promise<Cart> {
  cart = emptyCart();
  return cart;
}

export async function getCart(): Promise<Cart | undefined> {
  return cart ?? undefined;
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  if (!cart) cart = emptyCart();

  for (const { merchandiseId, quantity } of lines) {
    const product = ALL.find((p) =>
      p.variants.some((v) => v.id === merchandiseId),
    );
    if (!product) continue;

    const existing = cart.lines.find((l) => l.merchandise.id === merchandiseId);
    if (existing) {
      const next = existing.quantity + quantity;
      cart.lines = cart.lines.map((l) =>
        l.merchandise.id === merchandiseId
          ? lineFor(product, merchandiseId, next)
          : l,
      );
    } else {
      cart.lines = [...cart.lines, lineFor(product, merchandiseId, quantity)];
    }
  }

  cart = recalculate(cart);
  return cart;
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  if (!cart) cart = emptyCart();
  cart = recalculate({
    ...cart,
    lines: cart.lines.filter((l) => !lineIds.includes(l.id ?? "")),
  });
  return cart;
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  if (!cart) cart = emptyCart();

  for (const { merchandiseId, quantity } of lines) {
    const product = ALL.find((p) =>
      p.variants.some((v) => v.id === merchandiseId),
    );
    if (!product) continue;

    cart.lines =
      quantity <= 0
        ? cart.lines.filter((l) => l.merchandise.id !== merchandiseId)
        : cart.lines.map((l) =>
            l.merchandise.id === merchandiseId
              ? lineFor(product, merchandiseId, quantity)
              : l,
          );
  }

  cart = recalculate(cart);
  return cart;
}
