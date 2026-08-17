"use server";

import { sendRetreatEnquiry } from "@/lib/email";

export type FormState = { status: "idle" | "sent" | "error" };

/**
 * Server action for the retreat booking form.
 *
 * Validation is deliberately minimal — required fields and a sane email shape.
 * The honeypot field ("company") is invisible to people and irresistible to
 * bots; anything that fills it gets a success response and is dropped, so the
 * bot doesn't learn it was caught.
 */
export async function submitRetreatEnquiry(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (formData.get("company")) return { status: "sent" };

  const get = (key: string) => String(formData.get(key) ?? "").trim();

  const enquiry = {
    firstName: get("firstName"),
    lastName: get("lastName"),
    email: get("email"),
    contact: get("contact"),
    interest: get("interest"),
  };

  const missing =
    !enquiry.firstName ||
    !enquiry.lastName ||
    !enquiry.interest ||
    !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(enquiry.email);

  if (missing) return { status: "error" };

  try {
    await sendRetreatEnquiry(enquiry);
    return { status: "sent" };
  } catch (error) {
    console.error("Retreat enquiry failed to send:", error);
    return { status: "error" };
  }
}
