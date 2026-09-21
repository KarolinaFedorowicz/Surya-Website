"use client";

import { useActionState } from "react";
import { submitStockNotifySignup, type FormState } from "@/app/actions";

/**
 * Shown under a sold-out size on /shop, in place of a working "Add to cart".
 * Parent keys this by variant label (key={variant.label}) so switching sizes
 * remounts it — otherwise a "you're on the list" success state from one
 * sold-out size would keep showing after switching to a different one.
 */
export default function RestockNotifyForm({
  variantLabel,
}: {
  variantLabel: string;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    submitStockNotifySignup,
    { status: "idle" },
  );

  if (state.status === "sent") {
    return (
      <p className="text-caption text-aubergine-ink">
        You&rsquo;re on the list — we&rsquo;ll email you the moment {variantLabel}{" "}
        is back in stock.
      </p>
    );
  }

  return (
    <form action={action}>
      <input type="hidden" name="variant" value={variantLabel} />
      <p className="text-eyebrow tracking-eyebrow mb-3 uppercase opacity-70">
        Notify me when {variantLabel} is back
      </p>
      <div className="border-gilded-gold flex border">
        <input
          name="email"
          type="email"
          required
          placeholder="Your email"
          className="text-caption text-aubergine-ink placeholder-aubergine-ink/45 w-full bg-transparent px-4 py-3 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="text-caption tracking-caption bg-aubergine-ink text-sand-paper hover:bg-deep-cacao-night shrink-0 px-4 uppercase whitespace-nowrap transition-colors disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? "…" : "Sign up with email"}
        </button>
      </div>
      {state.status === "error" && (
        <p role="alert" className="text-caption text-aubergine-ink mt-2">
          That didn&rsquo;t go through. Try again in a moment.
        </p>
      )}
    </form>
  );
}
