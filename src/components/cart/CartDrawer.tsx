"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { formatMoney } from "@/lib/money";
import { buttonBase, buttonSize, buttonSkin } from "@/components/ui/buttonStyles";

/**
 * Slides in from the right over a dark scrim, same dur-hover/ease-exhale as
 * every other transition on the site. Always mounted (CartProvider renders it
 * once, globally) so the transform can animate — a conditionally-rendered
 * drawer would just pop in and out.
 *
 * Per-line subscribe control, not a cart-level one: Shopify attaches a
 * selling plan to a LINE, not to a cart, so "subscribe everything" isn't a
 * real operation to offer. Disabled with an explanatory note when the
 * product has no selling plans yet — see CartProvider's sellingPlans.
 */
export default function CartDrawer() {
  const {
    cart,
    isOpen,
    isLoading,
    sellingPlans,
    close,
    updateQuantity,
    removeItem,
    subscribeLine,
  } = useCart();
  const [subscribingLineId, setSubscribingLineId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [isOpen, close]);

  const isEmpty = !cart || cart.lines.length === 0;

  return (
    <>
      <button
        type="button"
        aria-hidden={!isOpen}
        tabIndex={isOpen ? 0 : -1}
        onClick={close}
        className={`bg-deep-cacao-night/65 fixed inset-0 z-50 transition-opacity duration-[var(--dur-hover)] ease-[var(--ease-exhale)] ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        className={`bg-sand-paper text-aubergine-ink fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col transition-transform duration-[var(--dur-hover)] ease-[var(--ease-exhale)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="border-gilded-gold/40 flex items-center justify-between border-b px-6 py-5">
          <h2 className="font-display text-h3">
            Cart
            {!isEmpty && (
              <span className="text-caption ml-2 opacity-60">
                ({cart.totalQuantity})
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close cart"
            className="text-caption tracking-caption uppercase"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isEmpty ? (
            <p className="text-body opacity-70">Your cart is empty.</p>
          ) : (
            <ul className="space-y-6">
              {cart.lines.map((line) => (
                <li
                  key={line.id}
                  className="border-aubergine-ink/12 flex gap-4 border-b pb-6 last:border-b-0"
                >
                  <div className="border-gilded-gold/40 relative aspect-[3/4] w-16 shrink-0 border">
                    {line.image && (
                      <Image
                        src={line.image.url}
                        alt={line.image.altText ?? ""}
                        fill
                        sizes="4rem"
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-display text-body">{line.productTitle}</p>
                    <p className="text-caption opacity-70">{line.variantTitle}</p>

                    {line.sellingPlanName ? (
                      <p className="text-caption text-gilded-gold mt-1">
                        Subscribed · {line.sellingPlanName}
                      </p>
                    ) : sellingPlans.length > 0 ? (
                      subscribingLineId === line.id ? (
                        <div className="mt-2 flex flex-col items-start gap-1">
                          {sellingPlans.map((plan) => (
                            <button
                              key={plan.id}
                              type="button"
                              onClick={() => {
                                subscribeLine(line.id, line.quantity, plan.id);
                                setSubscribingLineId(null);
                              }}
                              className="link-draw text-caption text-left"
                            >
                              {plan.name}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => setSubscribingLineId(null)}
                            className="text-caption text-left opacity-60"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSubscribingLineId(line.id)}
                          className="link-draw text-caption text-gilded-gold mt-1"
                        >
                          Subscribe & save
                        </button>
                      )
                    ) : null}

                    <div className="mt-3 flex items-center justify-between">
                      <div className="border-gilded-gold inline-flex items-stretch border">
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.id, line.quantity - 1)}
                          disabled={isLoading}
                          aria-label="Decrease quantity"
                          className="hover:bg-warm-ivory w-8 text-sm leading-none transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          −
                        </button>
                        <span className="text-caption flex w-8 items-center justify-center">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.id, line.quantity + 1)}
                          disabled={isLoading}
                          aria-label="Increase quantity"
                          className="hover:bg-warm-ivory w-8 text-sm leading-none transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-caption">
                        {formatMoney(line.price, line.currencyCode)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(line.id)}
                      disabled={isLoading}
                      className="text-caption mt-2 opacity-60 underline disabled:cursor-not-allowed"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!isEmpty && (
          <div className="border-gilded-gold/40 border-t px-6 py-5">
            <div className="flex items-baseline justify-between">
              <p className="text-caption tracking-caption uppercase opacity-60">
                Subtotal
              </p>
              <p className="font-display text-h3">
                {formatMoney(cart.subtotal, cart.currencyCode)}
              </p>
            </div>
            <p className="text-caption mt-2 opacity-55">
              Tax and shipping at checkout. Subscription discounts are applied
              there too.
            </p>

            <a
              href={cart.checkoutUrl}
              className={`${buttonBase} ${buttonSize.default} ${buttonSkin("primary", false)} mt-5 w-full`}
            >
              Checkout
            </a>
          </div>
        )}
      </div>
    </>
  );
}
