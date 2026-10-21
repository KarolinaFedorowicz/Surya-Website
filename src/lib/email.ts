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

// Restock signups from /shop — which size, from where — go to the shop's own
// inbox, not RETREAT_INBOX. The home page popup below still uses INBOX.
const RESTOCK_INBOX = process.env.RESTOCK_INBOX ?? "karolina@suryacacao.com";

export type RestockSignup = {
  email: string;
  /** The size that's sold out, e.g. "500g". */
  variant: string;
  /** What the shopper typed in "Country / city" — prefilled, editable. */
  location: string;
  /** The market the site placed them in (proxy.ts), e.g. "PL". */
  detectedCountry: string;
};

/**
 * The "notify me" form under a sold-out size on /shop. The shopper's own
 * location and the detected country are both included: stock is per market
 * (only Warsaw holds the 500g), so where they are decides whether a restock
 * can reach them, and the two disagreeing is worth seeing.
 */
export async function sendRestockSignup(signup: RestockSignup) {
  await transport().sendMail({
    from: `"Surya Cacao — Website" <${requireEnv("SMTP_USER")}>`,
    to: RESTOCK_INBOX,
    replyTo: signup.email,
    subject: `Restock signup — ${signup.variant} — ${signup.location}`,
    text: [
      `Email:            ${signup.email}`,
      `Size:             ${signup.variant}`,
      `Country / city:   ${signup.location}`,
      `Detected country: ${signup.detectedCountry}`,
      "",
      `Asked to be notified when the ${signup.variant} Ceremonial Cacao is back in stock.`,
    ].join("\n"),
  });
}

/**
 * The "only a couple of bags left" popup on the home page — no size, the
 * product overall is running low. Same SMTP transport as the retreat form —
 * one delivery mechanism, not two.
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
