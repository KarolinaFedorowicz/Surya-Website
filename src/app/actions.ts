"use server";

import { sendRestockSignup, sendStockNotifySignup } from "@/lib/email";
import { appendSignupToSheet } from "@/lib/sheets";
import { getShopperCountry } from "@/lib/shopper-country";

export type FormState = { status: "idle" | "sent" | "error" };

/**
 * Server action for the "only a couple of bags left" popup's email field, and
 * for the "notify me" form under a sold-out size on /shop — the latter sends
 * a hidden "variant" field ("150g", "300g", …) and a "location" field
 * alongside the email; the former sends neither.
 *
 * Two destinations, both best-effort: the Google Sheet is the database of
 * record, the email is just a heads-up. Neither is allowed to throw and take
 * the other down with it, and a failure in either is only logged — not shown
 * to the shopper as an error state — since from their side "sign up with
 * email" either worked as far as they can tell or it didn't, and a delivery
 * hiccup on our end shouldn't read to them as "try again."
 */
export async function submitStockNotifySignup(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const variant = String(formData.get("variant") ?? "").trim() || undefined;
  // Capped: it lands in an email subject and a sheet cell, not a database.
  const location = String(formData.get("location") ?? "").trim().slice(0, 100);

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { status: "error" };
  }
  if (variant && !location) return { status: "error" };

  if (!variant) {
    await appendSignupToSheet(email, "Home page popup");
    try {
      await sendStockNotifySignup(email);
    } catch (error) {
      console.error("Stock notify signup email failed to send:", error);
    }
    return { status: "sent" };
  }

  const detectedCountry = await getShopperCountry();

  await appendSignupToSheet(
    email,
    `Shop page — restock (${variant}) — ${location} [${detectedCountry}]`,
  );

  try {
    await sendRestockSignup({ email, variant, location, detectedCountry });
  } catch (error) {
    console.error("Restock signup email failed to send:", error);
  }

  return { status: "sent" };
}
