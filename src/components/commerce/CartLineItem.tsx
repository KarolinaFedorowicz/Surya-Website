// C7 — CartLineItem. SURYA_CACAO_BUILD_PLAN.md §3.4
"use client";

import Image from "next/image";

import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/money";
import type { CartItem } from "@/lib/shopify/types";

/** Thumbnail, quantity stepper, remove. */
export function CartLineItem({ line }: { line: CartItem }) {
  const { remove, setQuantity, pending } = useCart();
  const id = line.id ?? "";
  const label = `${line.merchandise.product.title}, ${line.merchandise.title}`;

  return (
    <li className="flex gap-5 py-6">
      <span className="bg-ink/5 relative size-20 shrink-0 overflow-hidden rounded-sm">
        <Image
          src={line.merchandise.product.featuredImage.url}
          alt=""
          fill
          sizes="80px"
          className="object-contain p-1"
        />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-ink font-body text-body">
          {line.merchandise.product.title}
        </p>
        <p className="text-muted font-body text-caption mt-0.5">
          {line.merchandise.title}
        </p>

        <div className="mt-4 flex items-center gap-4">
          <div className="border-hairline inline-flex items-center rounded-full border">
            <Stepper
              label={`Decrease quantity of ${label}`}
              disabled={pending}
              onClick={() =>
                setQuantity(id, line.merchandise.id, line.quantity - 1)
              }
            >
              −
            </Stepper>
            <span
              aria-live="polite"
              className="text-ink font-body text-caption w-8 text-center tabular-nums"
            >
              {line.quantity}
            </span>
            <Stepper
              label={`Increase quantity of ${label}`}
              disabled={pending}
              onClick={() =>
                setQuantity(id, line.merchandise.id, line.quantity + 1)
              }
            >
              +
            </Stepper>
          </div>

          <button
            type="button"
            disabled={pending}
            onClick={() => remove(id)}
            className="text-muted hover:text-ink font-body text-caption underline decoration-hairline underline-offset-4 transition-colors duration-[400ms] ease-surya disabled:opacity-40"
          >
            <span className="sr-only">{`Remove ${label}`}</span>
            <span aria-hidden="true">Remove</span>
          </button>
        </div>
      </div>

      <p className="text-ink font-body text-body shrink-0 tabular-nums">
        {formatPrice(line.cost.totalAmount)}
      </p>
    </li>
  );
}

function Stepper({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="text-ink hover:text-emphasis size-9 font-body text-body transition-colors duration-[400ms] ease-surya disabled:opacity-40"
    >
      <span className="sr-only">{label}</span>
      <span aria-hidden="true">{children}</span>
    </button>
  );
}
