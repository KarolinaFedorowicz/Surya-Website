import type { Metadata } from "next";

import { RetreatHero } from "@/components/sections/retreats/RetreatHero";
import { RetreatStructure } from "@/components/sections/retreats/RetreatStructure";
import { InquiryForm } from "@/components/sections/InquiryForm";
import { RETREAT_INQUIRY } from "@/config/inquiry";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Retreats",
  path: "/retreats",
  description:
    "A sanctuary in the Dominican Republic and a day on the working farm. Inquiry-based, built around your group.",
});

/** S15 · S16 · S18(retreat) */
export default function RetreatsPage() {
  return (
    <>
      <RetreatHero />
      <RetreatStructure />
      <InquiryForm config={RETREAT_INQUIRY} tone="dark" id="inquire" />
    </>
  );
}
