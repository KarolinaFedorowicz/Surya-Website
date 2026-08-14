"use client";

import { useCart } from "./CartProvider";

/** Opens C6. Lives in L1 Nav beside the Shop pill. */
export function CartButton() {
  const { cart, setOpen } = useCart();
  const count = cart?.totalQuantity ?? 0;

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="text-ink hover:text-emphasis relative p-2 transition-colors duration-[600ms] ease-surya"
    >
      <span className="sr-only">
        {count > 0 ? `Open cart, ${count} item${count === 1 ? "" : "s"}` : "Open cart"}
      </span>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 8h12l-1 12H7L6 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
      {count > 0 ? (
        <span
          aria-hidden="true"
          className="bg-emphasis text-surface absolute top-0 right-0 flex size-4 items-center justify-center rounded-full font-body text-[0.625rem] tabular-nums"
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}
