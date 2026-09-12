import "server-only";
import nodemailer from "nodemailer";

/**
 * Retreat enquiry delivery.
 *
 * SMTP was chosen over a third-party form service (Formspree, Typeform) or a
 * transactional API (Resend, SendGrid) because the destination address is on a
 * domain you already control — riftartech.com — so this needs credentials you
 * already have rather than a new account and a new vendor relationship.
 *
 * Required environment variables, set in .env.local (see .env.example):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 *   RETREAT_INBOX  — defaults to k.fedorowicz@riftartech.com
 *
 * Without those, sendRetreatEnquiry throws and the form shows its error state,
 * which names the fallback address. It never silently swallows a submission.
 */

export type RetreatEnquiry = {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  interest: string;
};

export type ContactMessage = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

const INBOX = process.env.RETREAT_INBOX ?? "k.fedorowicz@riftartech.com";

// The general contact form has its own destination, deliberately separate
// from RETREAT_INBOX — this is the address a customer expects a reply from,
// not the retreat-booking inbox.
const CONTACT_INBOX = process.env.CONTACT_INBOX ?? "karolina@suryacacao.com";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is not set. Retreat enquiries cannot be delivered until SMTP credentials are configured — see .env.example.`,
    );
  }
  return value;
}

function transport() {
  return nodemailer.createTransport({
    host: requireEnv("SMTP_HOST"),
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: {
      user: requireEnv("SMTP_USER"),
      pass: requireEnv("SMTP_PASS"),
    },
  });
}

export async function sendRetreatEnquiry(enquiry: RetreatEnquiry) {
  const name = `${enquiry.firstName} ${enquiry.lastName}`.trim();

  await transport().sendMail({
    from: `"Surya Cacao — Retreats" <${requireEnv("SMTP_USER")}>`,
    to: INBOX,
    replyTo: enquiry.email,
    subject: `Retreat enquiry — ${name}`,
    text: [
      `Name:    ${name}`,
      `Email:   ${enquiry.email}`,
      `Contact: ${enquiry.contact || "—"}`,
      "",
      "Why are you interested?",
      enquiry.interest,
    ].join("\n"),
  });
}

/**
 * The "only a couple of bags left" popup on the home page collects an email
 * so we can notify a shopper if the product sells out before they order.
 * Same SMTP transport as the retreat form — one delivery mechanism, not two.
 */
export async function sendStockNotifySignup(email: string) {
  await transport().sendMail({
    from: `"Surya Cacao — Website" <${requireEnv("SMTP_USER")}>`,
    to: INBOX,
    replyTo: email,
    subject: `Stock notify signup — ${email}`,
    text: `${email} signed up on the home page popup to be notified if Ceremonial Cacao sells out.`,
  });
}

/**
 * The general contact form at /contact. Delivered to CONTACT_INBOX, not
 * RETREAT_INBOX — see the constant above.
 */
export async function sendContactMessage(message: ContactMessage) {
  const name = `${message.firstName} ${message.lastName}`.trim();

  await transport().sendMail({
    from: `"Surya Cacao — Contact" <${requireEnv("SMTP_USER")}>`,
    to: CONTACT_INBOX,
    replyTo: message.email,
    subject: `Contact form — ${name}`,
    text: [
      `Name:  ${name}`,
      `Email: ${message.email}`,
      "",
      message.message,
    ].join("\n"),
  });
}
