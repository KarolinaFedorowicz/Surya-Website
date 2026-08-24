"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { stockPopup } from "@content/stock-popup";
import { submitStockNotifySignup, type FormState } from "@/app/actions";

/**
 * Home page only. Appears once the reader has scrolled past the hero — not
 * on load, which is the popup pattern people bounce off — and only once per
 * browser session, tracked in sessionStorage so it doesn't reappear on every
 * navigation back to "/" within the same visit.
 *
 * The photograph is the same lifestyle shot used elsewhere in the site
 * (Karo_cup2.jpg), scrimmed for the type the same way Hero scrims its
 * footage: dark enough for Warm Ivory to clear AA, not so dark the photo
 * reads as a texture.
 */

const DISMISSED_KEY = "surya-stock-popup-dismissed";
const initial: FormState = { status: "idle" };

function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 0c.6 4.8 2.2 8 6 9.5-3.8 1.5-5.4 4.7-6 9.5-.6-4.8-2.2-8-6-9.5 3.8-1.5 5.4-4.7 6-9.5Z" />
    </svg>
  );
}

export default function StockPopup() {
  const [visible, setVisible] = useState(false);
  const [state, action, pending] = useActionState(
    submitStockNotifySignup,
    initial,
  );

  useEffect(() => {
    if (sessionStorage.getItem(DISMISSED_KEY)) return;

    function onScroll() {
      if (window.scrollY > window.innerHeight * 0.6) {
        setVisible(true);
        window.removeEventListener("scroll", onScroll);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!visible) return;

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
  }, [visible]);

  function close() {
    setVisible(false);
    sessionStorage.setItem(DISMISSED_KEY, "1");
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={stockPopup.headline}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
    >
      {/* Backdrop — click through to dismiss. */}
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={close}
        className="bg-deep-cacao-night/70 absolute inset-0"
      />

      <div className="relative w-full max-w-[26rem] overflow-hidden">
        <div className="relative aspect-[3/4] w-full">
          <Image
            src="/assets/photos/Karo_cup2.jpg"
            alt=""
            fill
            sizes="26rem"
            className="object-cover"
          />

          {/* Scrim — matches Hero's approach: dark enough for the type to
              clear AA over a bright, busy photograph. */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in srgb, var(--color-deep-cacao-night) 55%, transparent) 0%, color-mix(in srgb, var(--color-deep-cacao-night) 40%, transparent) 55%, color-mix(in srgb, var(--color-deep-cacao-night) 68%, transparent) 100%)",
            }}
          />

          {/* Decorative sparkles — gold, the accent token, never a fill. */}
          <Sparkle className="text-gilded-gold absolute top-6 left-6 h-6 w-6" />
          <Sparkle className="text-gilded-gold absolute top-10 right-10 h-4 w-4" />
          <Sparkle className="text-gilded-gold absolute bottom-28 left-8 h-5 w-5" />
          <Sparkle className="text-gilded-gold absolute right-8 bottom-40 h-7 w-7" />

          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 text-2xl leading-none text-white transition-opacity hover:opacity-70"
          >
            &times;
          </button>

          {/* z-0, explicitly: this fills the whole card (h-full) including
              the corner the close button sits in, and without a stacking
              order of its own it would paint over — and swallow clicks on —
              the button above despite coming later in the DOM. */}
          <div className="relative z-0 flex h-full flex-col justify-center px-7 py-8 text-center">
            <h2 className="font-display text-h3 leading-h3 text-warm-ivory">
              {stockPopup.headline}
            </h2>

            <p className="font-display text-body mt-4 text-sand-paper italic">
              {stockPopup.welcome}
            </p>

            <div className="mt-4 space-y-3">
              {stockPopup.body.map((para, i) => (
                <p key={i} className="text-caption leading-body text-sand-paper/90">
                  {para}
                </p>
              ))}
            </div>

            <p className="font-display text-caption mt-4 text-sand-paper italic">
              {stockPopup.signoff[0]}
              <br />
              {stockPopup.signoff[1]}
            </p>

            {state.status === "sent" ? (
              <p className="text-caption text-gilded-gold mt-5">
                {stockPopup.successMessage}
              </p>
            ) : (
              <form action={action} className="mt-5">
                <div className="border-gilded-gold/60 flex border bg-black/20">
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder={stockPopup.emailPlaceholder}
                    className="text-caption placeholder-sand-paper/50 text-sand-paper w-full bg-transparent px-4 py-3 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={pending}
                    className="text-caption tracking-caption bg-gilded-gold text-deep-cacao-night hover:bg-warm-ivory shrink-0 px-4 uppercase whitespace-nowrap transition-colors disabled:cursor-wait disabled:opacity-60"
                  >
                    {pending ? "…" : stockPopup.submitLabel}
                  </button>
                </div>
                {state.status === "error" && (
                  <p role="alert" className="text-caption text-gilded-gold mt-2">
                    {stockPopup.errorMessage}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
