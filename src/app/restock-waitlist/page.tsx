// ROUTE — restock waitlist ("/restock-waitlist").
// A private link: not in the nav, the footer or any sitemap, and marked
// noindex so search engines leave it out. It's shared directly (Instagram,
// DMs, emails) with people who want the next harvest. Signups land in
// RESTOCK_INBOX — see submitRestockWaitlist in src/app/actions.ts.

import RestockWaitlist from "@/components/sections/RestockWaitlist";

export const metadata = {
  title: "Restock Waitlist — Surya Cacao",
  robots: { index: false, follow: false },
};

export default function RestockWaitlistPage() {
  return <RestockWaitlist />;
}
