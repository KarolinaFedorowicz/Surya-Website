"use server";

import { sendStockNotifySignup } from "@/lib/email";
import { appendSignupToSheet } from "@/lib/sheets";

export type FormState = { status: "idle" | "sent" | "error" };

/**
 * Server action for the "only a couple of bags left" popup's email field.
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

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { status: "error" };
  }

  await appendSignupToSheet(email);

  try {
    await sendStockNotifySignup(email);
  } catch (error) {
    console.error("Stock notify signup email failed to send:", error);
  }

  return { status: "sent" };
}
