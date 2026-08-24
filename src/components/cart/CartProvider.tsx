"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  addToCart,
  changeCartLineQuantity,
  getAvailableSellingPlans,
  getCurrentCart,
  removeFromCart,
  subscribeCartLine,
} from "@/app/cart/actions";
import type { Cart, SellingPlan } from "@/lib/shopify";
import CartDrawer from "./CartDrawer";
import SubscribeUpsellModal from "@/components/marketing/SubscribeUpsellModal";

/**
 * Cart state, shared by the header's item-count badge, the drawer, and
 * ProductPurchase's "Add to cart" button. One fetch on mount reads whatever
 * cart the surya_cart_id cookie points at (see app/cart/actions.ts); every
 * mutation after that goes through a server action and replaces `cart`
 * wholesale with whatever Shopify returns, so the UI is never out of sync
 * with the store's own idea of price, stock or line count.
 */

type AddItemResult = { error: string } | { error?: undefined };

/** The line just added, offered a subscription upgrade — see
 * SubscribeUpsellModal. Null when the modal isn't showing. */
export type UpsellPrompt = { lineId: string; quantity: number };

type CartContextValue = {
  cart: Cart | null;
  itemCount: number;
  isOpen: boolean;
  isLoading: boolean;
  /** Empty until Shopify Subscriptions is configured in admin — see
   * SellingPlan in lib/shopify.ts. */
  sellingPlans: SellingPlan[];
  upsell: UpsellPrompt | null;
  open: () => void;
  close: () => void;
  addItem: (
    variantId: string,
    quantity: number,
    sellingPlanId?: string,
  ) => Promise<AddItemResult>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  subscribeLine: (
    lineId: string,
    quantity: number,
    sellingPlanId: string,
  ) => Promise<void>;
  dismissUpsell: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sellingPlans, setSellingPlans] = useState<SellingPlan[]>([]);
  const [upsell, setUpsell] = useState<UpsellPrompt | null>(null);

  useEffect(() => {
    getCurrentCart().then(setCart);
    getAvailableSellingPlans().then(setSellingPlans);
  }, []);

  const addItem = useCallback(
    async (variantId: string, quantity: number, sellingPlanId?: string) => {
      setIsLoading(true);
      const result = await addToCart(variantId, quantity, sellingPlanId);
      setIsLoading(false);
      if ("error" in result) return { error: result.error };
      setCart(result);

      // Only prompt on a fresh one-time add — not when the line already
      // carries a subscription, and not when addToCart itself was passed a
      // sellingPlanId (there is nothing left to upsell).
      if (!sellingPlanId) {
        const line = result.lines.find((l) => l.merchandiseId === variantId);
        if (line && !line.sellingPlanName) {
          setUpsell({ lineId: line.id, quantity: line.quantity });
        }
      }

      return {};
    },
    [],
  );

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    setIsLoading(true);
    const result = await changeCartLineQuantity(lineId, quantity);
    setIsLoading(false);
    if (!("error" in result)) setCart(result);
  }, []);

  const removeItem = useCallback(async (lineId: string) => {
    setIsLoading(true);
    const result = await removeFromCart(lineId);
    setIsLoading(false);
    if (!("error" in result)) setCart(result);
  }, []);

  const subscribeLine = useCallback(
    async (lineId: string, quantity: number, sellingPlanId: string) => {
      setIsLoading(true);
      const result = await subscribeCartLine(lineId, quantity, sellingPlanId);
      setIsLoading(false);
      if (!("error" in result)) setCart(result);
    },
    [],
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount: cart?.totalQuantity ?? 0,
        isOpen,
        isLoading,
        sellingPlans,
        upsell,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        addItem,
        updateQuantity,
        removeItem,
        subscribeLine,
        dismissUpsell: () => setUpsell(null),
      }}
    >
      {children}
      <CartDrawer />
      <SubscribeUpsellModal />
    </CartContext.Provider>
  );
}
