/**
 * Shopify sends "25.0"; whole prices read better as $25 than $25.00, and a
 * subtotal needs cents the instant a price isn't whole. Same rule
 * ProductPurchase already applied locally — shared here so the cart drawer
 * doesn't restate it.
 */
export function formatMoney(amount: string | number, currencyCode: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}
