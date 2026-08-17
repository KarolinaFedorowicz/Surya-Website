// Section 6 — Product and Purchase.
// Shared by the home page and /shop so pricing is never written twice.

export const product: {
  name: string;
  description: string;
  variants: { size: string; price: string }[];
  shippingTimeline: string;
} = {
  name: "Surya Ceremonial Cacao",
  description: "100% Organic Ceremonial Cacao",

  // FALLBACK ONLY. Once the Shopify keys are set, /shop renders live prices
  // from the Buy Button embed and never reads this list — see ShopProduct.tsx
  // on why two prices must not be printed from two sources. These values are
  // what the page shows when the store is not connected, and what the home
  // page summary panel shows. Keep them in step with Shopify by hand.
  variants: [
    { size: "150g", price: "$25" },
    { size: "300g", price: "$35" },
    { size: "500g", price: "$60" },
  ],

  shippingTimeline: "Ships in 5–7 days",
};
