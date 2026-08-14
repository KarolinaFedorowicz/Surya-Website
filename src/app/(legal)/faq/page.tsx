import type { Metadata } from "next";

import { LegalPage, legalMetadata } from "../LegalPage";

export const metadata: Metadata = legalMetadata("faq");

export default function Page() {
  return <LegalPage slug="faq" />;
}
