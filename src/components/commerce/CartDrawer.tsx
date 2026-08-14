// C6 — CartDrawer. SURYA_CACAO_BUILD_PLAN.md §3.4
"use client";

import { useEffect, useRef } from "react";

import { Display, HairlineRule } from "@/components/primitives";
import { CartLineItem } from "./CartLineItem";
import { CartSummary } from "./CartSummary";
import { useCart } from "./CartProvider";
import { cn } from "@/lib/utils";

/**
 * Slides over. A drawer, not a route — "a page navigation mid-purchase breaks
 * the scroll continuity the entire site is built around" (plan §2).
 *
 * Modal semantics are done properly: focus moves in on open and returns to
 * whatever opened it, Tab is trapped, Escape closes, body scroll locks, and
 * the panel is `inert` when closed so it is unreachable rather than merely
 * invisible.
 */
export function CartDrawer() {
  const { cart, open, setOpen } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      returnTo.current?.focus();
      return;
    }

    returnTo.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("button, a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, setOpen]);

  const lines = cart?.lines ?? [];

  return (
    <>
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-[60] bg-night/50 transition-opacity duration-[600ms] ease-surya",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <div
        ref={panelRef}
        data-tone="ivory"
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        inert={!open}
        className={cn(
          "bg-surface fixed inset-y-0 right-0 z-[70] flex w-full max-w-[28rem] flex-col",
          "transition-transform duration-[600ms] ease-surya",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-6 py-6 md:px-8">
          <Display as="h2" size="section" className="text-h3">
            Your cart
          </Display>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-ink hover:text-emphasis -mr-2 p-2 transition-colors duration-[400ms] ease-surya"
          >
            <span className="sr-only">Close cart</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 md:px-8">
          {lines.length === 0 ? (
            <p className="text-muted font-body text-body py-10">
              Nothing here yet.
            </p>
          ) : (
            <ul>
              {lines.map((line, i) => (
                <li key={line.id ?? i}>
                  {i > 0 ? <HairlineRule /> : null}
                  <ul>
                    <CartLineItem line={line} />
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="px-6 pt-4 pb-8 md:px-8">
          {cart ? <CartSummary cart={cart} /> : null}
        </div>
      </div>
    </>
  );
}
