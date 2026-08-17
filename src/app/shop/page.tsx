// ROUTE — shop page ("/shop").
// Its own route per the nav: the "Shop" link and the nav CTA both point here,
// and here is where the Shopify checkout lives. Everything upstream of this
// page sells; this page is the only one that transacts.
//
// The ShopIntro block ("Shop / Choose your size.") was removed — it said in a
// headline what the size field below now says as a control, and it pushed the
// product itself below the fold. ShopIntro.tsx and content/shop.ts are left in
// place, unreferenced, so the copy is recoverable if you want it back.
//
// RitualSteps is reused from the home page rather than rewritten. A reader who
// arrives here from an ad has not seen it, and "what do I actually do with a
// bag of this" is a purchase question as much as a ritual one.

import ShopProduct from "@/components/sections/ShopProduct";
import RitualSteps from "@/components/sections/RitualSteps";

export default function ShopPage() {
  return (
    <>
      <ShopProduct />
      <RitualSteps />
    </>
  );
}
