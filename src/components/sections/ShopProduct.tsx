import { product } from "@content/product";
import Section from "@/components/layout/Section";
import Reveal from "@/components/ui/Reveal";
import ProductPurchase, {
  type PurchaseVariant,
} from "@/components/shop/ProductPurchase";
import { getProduct, shopifyConfigured } from "@/lib/shopify";

/**
 * The purchase block on /shop. Server component: the Storefront read happens
 * here, on the server, once per revalidation window rather than once per
 * visitor, and the token never crosses into the bundle.
 *
 * SHOPIFY IS THE SOURCE OF TRUTH for everything transactional — variant IDs,
 * the option's name and values, prices, currency and stock. Change a price in
 * the admin and it appears here without a deploy. The table in
 * content/product.ts is the fallback only, used when the keys are absent or
 * the store is unreachable, and in that state purchase is disabled rather than
 * pointed at a checkout that cannot exist.
 *
 * THE PHOTOGRAPHS ARE THE EXCEPTION, and deliberately so. The live product
 * carries three images on Shopify's CDN, but the gallery below uses the two
 * local files you named instead. That means an image uploaded to Shopify will
 * NOT appear here — edit PHOTOGRAPHS to change what the gallery shows.
 *
 * DISCREPANCY REPORTING: live data wins and the difference is logged
 * server-side rather than shown to a shopper. Grep deploy logs for
 * "Shopify/content mismatch". As of wiring up the live store there is none:
 * 150g/300g/500g at $25/$35/$60 USD match content/product.ts exactly.
 */

/**
 * The gallery, in scroll order. Both frames are the pouch in a wildflower
 * meadow at golden hour and both are near-3:4 natively, so they sit in one
 * plate without either being cropped into.
 *
 * The studio packshot (Ceremonial_Cacao_Package.png) is no longer used here.
 * It is still in public/assets/photos if you want it back in the run.
 *
 * NOTE: both bags read "300g". They show on the 150g and 500g variants too,
 * which is fine for a brand shot and wrong for a size guide.
 */
const PHOTOGRAPHS = [
  {
    src: "/assets/photos/cacao-shop1.jpg",
    alt: "The kraft Surya Ceremonial Cacao pouch standing in a wildflower meadow at golden hour",
  },
  {
    src: "/assets/photos/cacao-shop2.png",
    alt: "The aubergine Surya Ceremonial Cacao pouch in the same meadow, cacao paste visible through the window",
  },
];

/** Writes a server-side warning when live data disagrees with the repo copy. */
function flagDiscrepancies(live: PurchaseVariant[]) {
  for (const fallback of product.variants) {
    const match = live.find((v) => v.label === fallback.size);

    if (!match) {
      console.warn(
        `Shopify/content mismatch: content/product.ts lists size "${fallback.size}", which the live product has no variant for.`,
      );
      continue;
    }

    const listed = Number(fallback.price.replace(/[^0-9.]/g, ""));
    if (Number.isFinite(listed) && listed !== match.amount) {
      console.warn(
        `Shopify/content mismatch: "${fallback.size}" is ${match.amount} ${match.currencyCode} in Shopify but ${fallback.price} in content/product.ts. Shopify wins; update the file.`,
      );
    }
  }
}

export default async function ShopProduct() {
  const live = shopifyConfigured ? await getProduct() : null;

  const variants: PurchaseVariant[] = live
    ? live.variants.map((v) => ({
        id: v.id,
        label: v.title,
        amount: Number(v.price),
        currencyCode: v.currencyCode,
        available: v.availableForSale,
      }))
    : product.variants.map((v) => ({
        id: null,
        label: v.size,
        amount: Number(v.price.replace(/[^0-9.]/g, "")) || 0,
        currencyCode: "USD",
        available: false,
      }));

  if (live) flagDiscrepancies(variants);

  // Shopify's own option name ("size"), so renaming it in the admin renames
  // the field label here. Falls back to a sensible default when offline.
  const optionName = live?.optionName ?? "Size";

  // The live description is long-form marketing copy — several paragraphs of
  // it. The short line from content/product.ts is what belongs beside a price
  // field, so that stays the on-page description and the full Shopify copy is
  // left for the checkout and the product page on the store itself.
  const description = product.description;

  const specs = [
    { label: "Origin", value: "Samaná, Dominican Republic" },
    { label: "Sourcing", value: "Single partner family" },
    { label: "Certification", value: "100% organic" },
    { label: "Shipping", value: product.shippingTimeline },
  ];

  return (
    /* Only --space-block of air above the title, not --space-section. This is
       a landing page for a single product: the job of the first screen is to
       show the thing, its name and its price, and a full section's worth of
       padding at the top was spending 70px of that screen on nothing. */
    <Section className="pt-[calc(var(--header-h)+var(--banner-h)+var(--space-block))]">
      {/* The eyebrow and title block that used to sit here is gone. It printed
          "Ceremonial Cacao" directly above a product detail that then printed
          the size in the same display face at the same size, so the page led
          with the name twice and the product itself started below the fold.
          The name is now the detail's own h1. */}
      <ProductPurchase
        productName={live?.title ?? product.name}
        variants={variants}
        optionName={optionName}
        description={description}
        specs={specs}
        images={PHOTOGRAPHS}
        purchasable={Boolean(live)}
      />

      {!live && (
        <Reveal index={2}>
          <p className="text-caption text-aubergine-ink/70 mt-[var(--space-block)] max-w-[var(--measure)]">
            {shopifyConfigured
              ? "The store didn't respond, so these are the last known sizes and prices. Checkout is disabled until it's reachable."
              : "Checkout isn't connected yet — SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN are missing from this deployment."}
          </p>
        </Reveal>
      )}
    </Section>
  );
}
