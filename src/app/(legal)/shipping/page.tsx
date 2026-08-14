import type { Metadata } from "next";

import { LegalPage, legalMetadata } from "../LegalPage";

export const metadata: Metadata = legalMetadata("shipping");

export default function Page() {
  return <LegalPage slug="shipping" />;
}
