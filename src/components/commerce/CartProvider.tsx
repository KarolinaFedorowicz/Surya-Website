"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

import {
  addItem,
  readCart,
  removeItem,
  updateItemQuantity,
} from "./actions";
import type { Cart } from "@/lib/shopify/types";

/**
 * Cart state + optimistic updates.
 *
 * Optimism is done by hand rather than with `useOptimistic`: that hook resets
 * to the base value when its transition ends, which is right for a form but
 * wrong here — the drawer must keep showing the item after the action settles.
 * So we apply a local guess immediately, then replace it with the server's
 * authoritative cart when the action returns, and roll back on failure.
 */
type CartContextValue = {
  cart: Cart | undefined;
  open: boolean;
  pending: boolean;
  error: string | null;
  setOpen: (open: boolean) => void;
  add: (merchandiseId: string, quantity?: number) => void;
  remove: (lineId: string) => void;
  setQuantity: (lineId: string, merchandiseId: string, quantity: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Hydrate from the server on mount so a refresh keeps the cart.
  useEffect(() => {
    readCart().then((r) => {
      if (r.ok) setCart(r.cart);
    });
  }, []);

  const run = useCallback(
    (optimistic: (c: Cart | undefined) => Cart | undefined, action: () => Promise<import("./actions").CartResult>) => {
      const rollback = cart;
      setError(null);
      setCart(optimistic);
      startTransition(async () => {
        const result = await action();
        if (result.ok) {
          setCart(result.cart);
        } else {
          setCart(rollback);
          setError(result.error);
        }
      });
    },
    [cart],
  );

  const add = useCallback(
    (merchandiseId: string, quantity = 1) => {
      setOpen(true);
      run(
        (c) => bumpQuantity(c, merchandiseId, quantity),
        () => addItem(merchandiseId, quantity),
      );
    },
    [run],
  );

  const remove = useCallback(
    (lineId: string) => {
      run(
        (c) =>
          c && { ...c, lines: c.lines.filter((l) => l.id !== lineId) },
        () => removeItem(lineId),
      );
    },
    [run],
  );

  const setQuantity = useCallback(
    (lineId: string, merchandiseId: string, quantity: number) => {
      run(
        (c) =>
          c && {
            ...c,
            lines:
              quantity <= 0
                ? c.lines.filter((l) => l.id !== lineId)
                : c.lines.map((l) =>
                    l.id === lineId ? { ...l, quantity } : l,
                  ),
          },
        () => updateItemQuantity(lineId, merchandiseId, quantity),
      );
    },
    [run],
  );

  const value = useMemo(
    () => ({ cart, open, pending, error, setOpen, add, remove, setQuantity }),
    [cart, open, pending, error, add, remove, setQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Optimistic guess for "add". Only the quantity and totalQuantity are
 * adjusted — money is deliberately NOT recomputed locally, because the server
 * is the only thing that should ever decide a price. The line total settles a
 * moment later when the real cart arrives.
 */
function bumpQuantity(
  cart: Cart | undefined,
  merchandiseId: string,
  quantity: number,
): Cart | undefined {
  if (!cart) return cart;
  const existing = cart.lines.find((l) => l.merchandise.id === merchandiseId);
  if (!existing) return { ...cart, totalQuantity: cart.totalQuantity + quantity };

  return {
    ...cart,
    totalQuantity: cart.totalQuantity + quantity,
    lines: cart.lines.map((l) =>
      l.merchandise.id === merchandiseId
        ? { ...l, quantity: l.quantity + quantity }
        : l,
    ),
  };
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
