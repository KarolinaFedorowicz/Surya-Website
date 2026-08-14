import type { Metadata, Viewport } from "next";

import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/layout/JsonLd";
import { Nav } from "@/components/layout/Nav";
import { SkipLink } from "@/components/layout/SkipLink";
import { BRAND } from "@/config/brand";
import { SITE } from "@/config/site";
import {
  CustomCursor,
  PageTransition,
  ReducedMotionProvider,
  SmoothScroll,
} from "@/components/motion";
import { CartProvider } from "@/components/commerce/CartProvider";
import { CartDrawer } from "@/components/commerce/CartDrawer";
import { getPrimaryProduct } from "@/lib/commerce";
import { buildMetadata, organizationSchema } from "@/lib/seo";

import "./globals.css";

export const metadata: Metadata = {
  ...buildMetadata(),
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s · ${SITE.name}` },
};

export const viewport: Viewport = {
  /* Browser chrome cannot read a CSS custom property, so it reads the one
     sanctioned JS mirror instead. See config/brand.ts. */
  themeColor: BRAND.sand,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Server-side today; in Phase 5 this same call hits lib/shopify/ instead.
  const product = await getPrimaryProduct();

  return (
    <html lang="en">
      <head>
        {/* Both faces are display serifs used above the fold. Preloading only
            the `latin` subsets keeps first paint honest without shipping
            latin-ext to visitors who will never render those glyphs. */}
        <link
          rel="preload"
          href="/fonts/marcellus-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/gilda-display-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {/* M13 first: every other motion component reads the preference from
            it, so it has to be above them in the tree. M1 then owns scroll
            physics for everything inside. */}
        <ReducedMotionProvider>
          <SmoothScroll>
            <CartProvider>
              <SkipLink />
              <Nav product={product} />
              {/* SkipLink target. tabIndex -1 so focus can actually land here. */}
              <main id="main" tabIndex={-1}>
                <PageTransition>{children}</PageTransition>
              </main>
              <Footer />
              <CartDrawer />
              <CustomCursor />
            </CartProvider>
          </SmoothScroll>
        </ReducedMotionProvider>
        <JsonLd schema={organizationSchema()} />
        {/* M1 SmoothScroll and M12 PageTransition wrap this in Phase 6. */}
      </body>
    </html>
  );
}
