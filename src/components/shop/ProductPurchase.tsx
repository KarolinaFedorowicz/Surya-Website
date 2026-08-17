"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { startCheckout } from "@/app/shop/actions";
import Divider from "@/components/ui/Divider";
import { buttonBase, buttonSize, buttonSkin } from "@/components/ui/buttonStyles";

/**
 * The purchase block on /shop — one product, three sizes, presented as a
 * considered object rather than a grid of SKUs.
 *
 * Structure follows the reference you sent: a numbered index, one variant
 * enlarged at a time with its own display-size name, a spec table under a
 * hairline, and the object photographed large beside it. What it does NOT
 * borrow is the reference's typography or palette — that page is a cold grey
 * sans, this one stays in Gilda Display, Marcellus and the five colours. The
 * structure is the reference; the surface is Surya.
 *
 * SIZE AND QUANTITY ARE REAL FIELDS. Size replaced the 01/02/03 pager that
 * used to sit at the foot: two controls selecting the same thing is a way to
 * get someone to buy 150g while looking at 500g. The numbered index and the
 * ghosted numeral both still track the selection, so the reference's counting
 * survives — it just no longer pretends to be the input.
 *
 * The option name and its values come from Shopify, not from a list here, so
 * renaming "size" or adding a fourth size in the admin flows straight through.
 *
 * PRICING IS COMPUTED, NOT LOOKED UP. The unit price is the live variant
 * price; the total is unit × quantity, formatted in the store's own currency.
 * Nothing about money is hardcoded — but note the total is a *subtotal*: tax
 * and shipping are Shopify's to calculate, and they appear at checkout. It is
 * labelled Subtotal for that reason and must not be relabelled "Total".
 */

export type PurchaseVariant = {
  /** Shopify merchandise GID, or null when the store isn't connected. */
  id: string | null;
  /** "150g" — the size, used as the display name and the option value. */
  label: string;
  /** Numeric so the total can be computed rather than string-matched. */
  amount: number;
  currencyCode: string;
  available: boolean;
};

const MAX_QUANTITY = 20;

export default function ProductPurchase({
  productName,
  variants,
  optionName,
  description,
  specs,
  images,
  purchasable,
}: {
  productName: string;
  variants: PurchaseVariant[];
  optionName: string;
  description: string;
  specs: { label: string; value: string }[];
  images: { src: string; alt: string }[];
  purchasable: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  /* ---- Gallery scrollbar ----
     The native bar is hidden (see .gallery-scroll in globals.css); this is the
     one you actually see. It is driven BY the scroll position rather than
     owning it, so swiping the photograph, using a trackpad, tabbing in and
     pressing an arrow key, and dragging the bar all end up in the same place. */
  const scroller = useRef<HTMLDivElement>(null);
  const [bar, setBar] = useState({ width: 100, left: 0 });

  const syncBar = useCallback(() => {
    const el = scroller.current;
    if (!el) return;

    const visible = Math.min(1, el.clientWidth / el.scrollWidth);
    const scrollable = el.scrollWidth - el.clientWidth;
    const progress = scrollable > 0 ? el.scrollLeft / scrollable : 0;

    setBar({
      width: visible * 100,
      // The thumb travels the track's leftover width, not its whole width,
      // so its right edge lands flush at the end instead of overshooting.
      left: progress * (100 - visible * 100),
    });
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;

    syncBar();
    // Re-measure on resize: the plate is sized in svh, so rotating a phone or
    // dragging a window edge changes both clientWidth and scrollWidth.
    const observer = new ResizeObserver(syncBar);
    observer.observe(el);
    return () => observer.disconnect();
  }, [syncBar]);

  /** Maps a pointer x within the track onto a scroll position. */
  function seek(clientX: number, track: HTMLElement) {
    const el = scroller.current;
    if (!el) return;

    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    el.scrollLeft = ratio * (el.scrollWidth - el.clientWidth);
  }

  const variant = variants[index];

  const format = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: variant?.currencyCode ?? "USD",
        // Shopify sends "25.0"; whole prices read better as $25 than $25.00,
        // and the subtotal needs cents the moment a price isn't whole.
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
    [variant?.currencyCode],
  );

  if (!variant) return null;

  const subtotal = variant.amount * quantity;
  const ordinal = String(index + 1).padStart(2, "0");

  function buy() {
    if (!variant.id) return;
    setError(null);

    startTransition(async () => {
      const result = await startCheckout(variant.id!, quantity);

      if ("error" in result) {
        setError(result.error);
        return;
      }

      // Shopify's hosted checkout. Same tab: a checkout that opens in a new
      // window loses the back button, which people rely on to change their mind.
      window.location.href = result.checkoutUrl;
    });
  }

  return (
    <div>
      {/* Index row */}
      <div className="border-gilded-gold/40 flex items-baseline justify-between border-b pb-3">
        <p className="text-eyebrow tracking-eyebrow uppercase">
          <span className="text-gilded-gold">{ordinal}</span>
          <span className="opacity-45"> / </span>
          {variants.length === 3 ? "Three sizes" : `${variants.length} sizes`}
        </p>
        <p className="text-caption tracking-caption opacity-60">
          {index + 1} / {variants.length}
        </p>
      </div>

      {/* items-start, not items-center: the copy column is far taller than the
          photograph, and centring the photograph against it pushed the product
          most of a screen down the page. Starting both at the top is what puts
          the object beside its name instead of below its spec table. */}
      <div className="mt-8 grid items-start gap-[var(--space-block)] lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:gap-16">
        {/* Left — the variant, at size */}
        <div>
          {/* The page's only h1. The block above it that used to carry the
              product name was removed, so this heading is now the name rather
              than the selected size — the size lives in its own field below,
              and is echoed in the subtotal line. */}
          <h1 className="font-display text-h1 tracking-h1 leading-h1">
            {productName}
            <span className="text-gilded-gold">.</span>
          </h1>

          <p className="font-display text-h3 mt-3">
            {format.format(variant.amount)}
            <span className="text-caption ml-2 opacity-55">
              each · {variant.label}
            </span>
          </p>

          <p className="text-body leading-body mt-6 max-w-[var(--measure)]">
            {description}
          </p>

          <Divider className="my-[var(--space-block)]" />

          <dl className="max-w-[26rem]">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="border-aubergine-ink/12 flex items-baseline justify-between gap-6 border-b py-3 last:border-b-0"
              >
                <dt className="text-caption tracking-caption uppercase opacity-60">
                  {spec.label}
                </dt>
                <dd className="text-body text-right">{spec.value}</dd>
              </div>
            ))}
          </dl>

          {/* ---- Fields ---- */}
          <fieldset className="mt-9">
            <legend className="text-eyebrow tracking-eyebrow mb-3 uppercase opacity-70">
              {optionName}
            </legend>

            <div className="flex flex-wrap gap-3">
              {variants.map((v, i) => (
                <button
                  key={v.label}
                  type="button"
                  onClick={() => setIndex(i)}
                  disabled={!v.available}
                  aria-pressed={i === index}
                  className={`text-caption tracking-caption min-w-[5.5rem] border px-5 py-3 uppercase transition-colors duration-[var(--dur-hover)] ease-[var(--ease-exhale)] ${
                    i === index
                      ? "border-aubergine-ink bg-aubergine-ink text-sand-paper"
                      : "border-gilded-gold text-aubergine-ink hover:bg-warm-ivory"
                  } ${!v.available ? "cursor-not-allowed opacity-40" : ""}`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-7">
            <label
              htmlFor="quantity"
              className="text-eyebrow tracking-eyebrow mb-3 block uppercase opacity-70"
            >
              Quantity
            </label>

            {/* A stepper, plus a real number input so it stays usable by
                keyboard and by anyone typing 12 rather than pressing + eleven
                times. aria-live on the subtotal announces the recalculation. */}
            <div className="border-gilded-gold inline-flex items-stretch border">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="hover:bg-warm-ivory w-12 text-lg leading-none transition-colors disabled:cursor-not-allowed disabled:opacity-35"
              >
                −
              </button>

              <input
                id="quantity"
                type="number"
                min={1}
                max={MAX_QUANTITY}
                value={quantity}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  if (!Number.isFinite(next)) return;
                  setQuantity(Math.min(Math.max(Math.trunc(next), 1), MAX_QUANTITY));
                }}
                className="border-gilded-gold text-body w-16 border-x bg-transparent py-3 text-center [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />

              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
                disabled={quantity >= MAX_QUANTITY}
                aria-label="Increase quantity"
                className="hover:bg-warm-ivory w-12 text-lg leading-none transition-colors disabled:cursor-not-allowed disabled:opacity-35"
              >
                +
              </button>
            </div>
          </div>

          {/* ---- Subtotal ---- */}
          <div className="border-gilded-gold/40 mt-8 max-w-[26rem] border-t pt-5">
            <div className="flex items-baseline justify-between gap-6">
              <p className="text-caption tracking-caption uppercase opacity-60">
                Subtotal
              </p>
              <p
                aria-live="polite"
                className="font-display text-h3"
              >
                {format.format(subtotal)}
              </p>
            </div>
            <p className="text-caption mt-2 opacity-55">
              {quantity} × {variant.label} · tax and shipping at checkout
            </p>
          </div>

          <div className="mt-8">
            {purchasable && variant.id ? (
              <button
                type="button"
                onClick={buy}
                disabled={pending || !variant.available}
                className={`${buttonBase} ${buttonSize.default} ${buttonSkin("primary", false)} disabled:cursor-not-allowed disabled:opacity-55`}
              >
                {!variant.available
                  ? "Sold out"
                  : pending
                    ? "Opening checkout…"
                    : "Add to cart"}
              </button>
            ) : (
              <button
                type="button"
                disabled
                title="Shopify keys are missing from this deployment"
                className={`${buttonBase} ${buttonSize.default} border-gilded-gold/60 text-aubergine-ink/50 cursor-not-allowed`}
              >
                Checkout not connected
              </button>
            )}

            {error && (
              <p role="alert" className="text-caption text-aubergine-ink mt-4">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Right — the object.
            order-first below lg: stacked, the photograph would otherwise sit
            after the whole copy column and land a screen and a half down, so
            on a phone you'd scroll past name, price, specs and the buy button
            before ever seeing what you're buying. On lg it returns to the
            right-hand column. */}
        <div className="relative order-first lg:order-none">
          {/* Sits behind the plate and pokes out of its bottom-left corner.
              Hidden below lg, where the columns stack and there is no margin
              for it to occupy. */}
          <span
            aria-hidden="true"
            className="font-display text-aubergine-ink/15 pointer-events-none absolute -bottom-8 -left-12 z-0 hidden select-none text-[13rem] leading-none lg:block"
          >
            {index + 1}
          </span>

          {/* Gallery.
              A scroll container, not a slider with arrows: the scrollbar
              underneath IS the control, so the mechanism is the same whether
              you drag it, swipe the image, use a trackpad, or tab in and press
              an arrow key. Nothing to learn and nothing to mis-click.

              snap-mandatory means it always comes to rest on a photograph
              rather than halfway between two. tabIndex makes the region
              keyboard-scrollable, which a scroll container does not get for
              free, and the label tells a screen reader what it is scrolling.

              Sized off viewport HEIGHT rather than column width, because what
              has to fit is the fold, not the grid: 34svh wide on mobile and
              50svh on desktop, which at 3:4 makes the plate 45svh and 67svh
              tall — it shrinks on a short laptop instead of running off the
              bottom, and the aspect never changes, so the bag is never
              squashed. 3:4 is within a hair of both files' native ratio. */}
          <div className="relative z-10 mx-auto w-[min(100%,34svh)] lg:mx-0 lg:w-[min(100%,50svh)]">
            <div
              ref={scroller}
              onScroll={syncBar}
              tabIndex={0}
              role="group"
              aria-label={`${productName} photographs — scroll for more`}
              className="gallery-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto"
            >
              {images.map((photo, i) => (
                <figure
                  key={photo.src}
                  className="w-full shrink-0 snap-center"
                  aria-label={`${i + 1} of ${images.length}`}
                >
                  <div className="border-gilded-gold/45 relative aspect-[3/4] w-full border">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 1024px) 90vw, 32rem"
                      /* Only the first is preloaded — the second is one scroll
                         away and does not belong in the critical path. */
                      preload={i === 0}
                      className="object-cover"
                    />
                  </div>
                </figure>
              ))}
            </div>

            {/* The bar. Click anywhere on the track to jump, or drag the thumb.
                setPointerCapture keeps the drag alive when the cursor leaves
                the track, which is what makes it feel like a scrollbar rather
                than a row of buttons. Hidden when everything already fits. */}
            {bar.width < 100 && (
              <div
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  seek(e.clientX, e.currentTarget);
                }}
                onPointerMove={(e) => {
                  if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                    seek(e.clientX, e.currentTarget);
                  }
                }}
                className="bg-aubergine-ink/12 relative mt-5 h-1 w-full cursor-pointer touch-none"
              >
                <div
                  className="bg-gilded-gold absolute inset-y-0"
                  style={{ width: `${bar.width}%`, left: `${bar.left}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
