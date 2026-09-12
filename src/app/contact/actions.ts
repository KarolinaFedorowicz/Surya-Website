"use server";

import { sendContactMessage } from "@/lib/email";

export type FormState = { status: "idle" | "sent" | "error" };

/**
 * Server action for the /contact form. Same shape as submitRetreatEnquiry —
 * minimal validation, a delivery failure returns an error state rather than
 * throwing. No honeypot here: unlike the retreats form this one isn't a
 * public target the way a booking form is, but the field-driven structure
 * matches so ContactForm.tsx can reuse RetreatForm.tsx's layout as-is.
 */
export async function submitContactMessage(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const get = (key: string) => String(formData.get(key) ?? "").trim();

  const message = {
    firstName: get("firstName"),
    lastName: get("lastName"),
    email: get("email"),
    message: get("message"),
  };

  const missing =
    !message.firstName ||
    !message.lastName ||
    !message.message ||
    !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(message.email);

  if (missing) return { status: "error" };

  try {
    await sendContactMessage(message);
    return { status: "sent" };
  } catch (error) {
    console.error("Contact message failed to send:", error);
    return { status: "error" };
  }
}
