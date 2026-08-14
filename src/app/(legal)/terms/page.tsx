import type { Metadata } from "next";

import { LegalPage, legalMetadata } from "../LegalPage";

export const metadata: Metadata = legalMetadata("terms");

export default function Page() {
  return <LegalPage slug="terms" />;
}
