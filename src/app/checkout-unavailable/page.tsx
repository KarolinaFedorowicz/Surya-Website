import type { Metadata } from "next";

import { Display, Eyebrow, Pill, Section } from "@/components/primitives";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Checkout unavailable",
  noIndex: true,
});

/**
 * Where the mock cart's `checkoutUrl` points. With a real store this page is
 * never reached — Shopify's hosted checkout is an absolute URL on their
 * domain. It exists so a click during development lands somewhere that
 * explains itself instead of 404ing.
 */
export default function CheckoutUnavailablePage() {
  return (
    <Section tone="sand" space="spacious" width="prose">
      <Eyebrow>Development</Eyebrow>
      <Display as="h1" size="section" className="mt-4">
        Checkout isn&rsquo;t connected yet.
      </Display>
      <p className="text-muted font-body text-body mt-8">
        The cart is running against the mock module because no Shopify store
        exists. Once credentials are set, <code>cart.checkoutUrl</code> becomes
        Shopify&rsquo;s hosted checkout and this page stops being reachable.
      </p>
      <Pill variant="soon" className="mt-8">
        Awaiting Shopify credentials
      </Pill>
    </Section>
  );
}
