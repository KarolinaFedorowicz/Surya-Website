import type { Metadata } from "next";

import { PartnershipTypes } from "@/components/sections/partnerships/PartnershipTypes";
import { InquiryForm } from "@/components/sections/InquiryForm";
import { PARTNERSHIP_INQUIRY } from "@/config/inquiry";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Partnerships",
  path: "/partnerships",
  description:
    "Co-branded ceremony, event cacao service, product collaborations, and stocking Surya in your studio or space.",
});

/** S17 · S18(partnership) */
export default function PartnershipsPage() {
  return (
    <>
      <PartnershipTypes />
      <InquiryForm config={PARTNERSHIP_INQUIRY} tone="ivory" id="inquire" />
    </>
  );
}
