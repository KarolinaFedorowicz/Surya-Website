"use client";

import { useCart } from "./CartProvider";

/**
 * Opens the drawer rather than navigating — there is no /cart route, the
 * drawer is the cart page. Shows a count once something's in it; before that
 * it's just the word "Cart", matching Nav's other plain-text links.
 */
export default function CartButton() {
  const { itemCount, open } = useCart();

  return (
    <button
      type="button"
      onClick={open}
      className="link-draw text-caption tracking-caption uppercase whitespace-nowrap"
    >
      Cart{itemCount > 0 ? ` (${itemCount})` : ""}
    </button>
  );
}
