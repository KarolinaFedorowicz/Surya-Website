import type { Metadata } from "next";

import { InquiryForm } from "@/components/sections/InquiryForm";
import { CONTACT_INQUIRY } from "@/config/inquiry";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  path: "/contact",
  description:
    "Customer service, partnerships, press, retreats, or wholesale — one form, routed to the right person.",
});

export default function ContactPage() {
  return <InquiryForm config={CONTACT_INQUIRY} tone="ivory" />;
}
