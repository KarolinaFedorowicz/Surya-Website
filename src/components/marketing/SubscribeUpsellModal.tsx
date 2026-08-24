"use client";

import Image from "next/image";
import { useEffect } from "react";
import { subscribeUpsell } from "@content/subscribe-upsell";
import { useCart } from "@/components/cart/CartProvider";
import { buttonBase, buttonSize, buttonSkin } from "@/components/ui/buttonStyles";

/**
 * Fires once, automatically, right after a one-time "Add to cart" succeeds —
 * see CartProvider's addItem. Offers to upgrade the line just added into a
 * subscription rather than collecting any payment detail itself: choosing a
 * plan calls subscribeCartLine, which attaches a Shopify selling plan to the
 * existing cart line, and the actual card entry still happens on Shopify's
 * hosted checkout — same rule as everywhere else in this codebase.
 *
 * PLAN MATCHING: Shopify selling plans are named whatever was typed into the
 * admin when they were created — confirmed live as "Deliver every month, 15%
 * off" and "Deliver every 3 months, 10% off" — so matching is by substring
 * ("month" in the name) rather than an exact string, and the two are told
 * apart by whether "3" appears. Any plan name containing "every month" and
 * "every 3 months" (or "quarter") in that shape will match; something
 * unrelated falls back to disabled rather than guessing at a plan it can't
 * confirm.
 */
export default function SubscribeUpsellModal() {
  const { upsell, sellingPlans, subscribeLine, dismissUpsell, isLoading } =
    useCart();

  useEffect(() => {
    if (!upsell) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismissUpsell();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [upsell, dismissUpsell]);

  if (!upsell) return null;

  const hasThreeMonthMarker = (name: string) =>
    /\b3\b|three|quarter/.test(name);

  const monthlyPlan = sellingPlans.find((p) => {
    const name = p.name.toLowerCase();
    return name.includes("month") && !hasThreeMonthMarker(name);
  });

  const everyThreeMonthsPlan = sellingPlans.find((p) => {
    const name = p.name.toLowerCase();
    return name.includes("month") && hasThreeMonthMarker(name);
  });

  const configured = sellingPlans.length > 0;

  function choose(planId: string) {
    subscribeLine(upsell!.lineId, upsell!.quantity, planId);
    dismissUpsell();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={subscribeUpsell.headline}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
    >
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={dismissUpsell}
        className="bg-deep-cacao-night/70 absolute inset-0"
      />

      <div className="relative w-full max-w-[26rem] overflow-hidden">
        <div className="relative aspect-[3/4] w-full">
          <Image
            src="/assets/photos/Karo_cup.jpg"
            alt=""
            fill
            sizes="26rem"
            className="object-cover"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in srgb, var(--color-deep-cacao-night) 58%, transparent) 0%, color-mix(in srgb, var(--color-deep-cacao-night) 42%, transparent) 45%, color-mix(in srgb, var(--color-deep-cacao-night) 70%, transparent) 100%)",
            }}
          />

          <button
            type="button"
            onClick={dismissUpsell}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 text-2xl leading-none text-white transition-opacity hover:opacity-70"
          >
            &times;
          </button>

          {/* z-0, explicitly — see the matching note in StockPopup: this
              spans the whole card and would otherwise paint over, and
              swallow clicks on, the close button despite being later in the
              DOM but stacking-order-less. */}
          <div className="relative z-0 flex h-full flex-col justify-center px-7 py-8">
            <p className="text-caption tracking-caption text-gilded-gold text-center uppercase">
              {subscribeUpsell.addedMessage}
            </p>

            <h2 className="font-display text-h3 leading-h3 text-warm-ivory mt-2 text-center">
              {subscribeUpsell.headline}
            </h2>

            <div className="border-gilded-gold/50 mt-6 flex flex-col gap-4 border-t border-b py-6">
              <div>
                <button
                  type="button"
                  onClick={() => monthlyPlan && choose(monthlyPlan.id)}
                  disabled={!monthlyPlan || isLoading}
                  title={
                    !configured ? subscribeUpsell.notConfiguredMessage : undefined
                  }
                  className={`${buttonBase} ${buttonSize.default} ${buttonSkin("primary", true)} w-full disabled:cursor-not-allowed disabled:opacity-45`}
                >
                  {subscribeUpsell.monthly.label}
                </button>
                <p className="text-caption text-sand-paper/85 mt-2 text-center">
                  {subscribeUpsell.monthly.description}
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() =>
                    everyThreeMonthsPlan && choose(everyThreeMonthsPlan.id)
                  }
                  disabled={!everyThreeMonthsPlan || isLoading}
                  title={
                    !configured ? subscribeUpsell.notConfiguredMessage : undefined
                  }
                  className={`${buttonBase} ${buttonSize.default} ${buttonSkin("ghost", true)} w-full disabled:cursor-not-allowed disabled:opacity-45`}
                >
                  {subscribeUpsell.everyThreeMonths.label}
                </button>
                <p className="text-caption text-sand-paper/85 mt-2 text-center">
                  {subscribeUpsell.everyThreeMonths.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={dismissUpsell}
              className="link-draw text-caption text-sand-paper mt-5 text-center"
            >
              {subscribeUpsell.continueLabel}
            </button>

            {!configured && (
              <p className="text-caption text-sand-paper/60 mt-3 text-center">
                {subscribeUpsell.notConfiguredMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
