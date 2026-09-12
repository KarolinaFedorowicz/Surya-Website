// Contact page (/contact).
//
// Same form shape as content/retreats.ts's enquiry form — same fields
// pattern, same success/error copy style — so ContactForm.tsx can reuse
// RetreatForm.tsx's structure exactly rather than inventing a second one.

import type { Cta } from "./types";

export const contact: {
  pageTitle: string;
  intro: string;
  form: {
    eyebrow: string;
    submit: Cta;
    successMessage: string;
    errorMessage: string;
    fields: {
      name: string;
      label: string;
      type: "text" | "email" | "tel" | "textarea";
      required: boolean;
      autoComplete?: string;
    }[];
  };
} = {
  pageTitle: "Contact",

  intro:
    "Questions about an order, a retreat, or anything else — we'd love to hear from you.",

  form: {
    eyebrow: "Get in touch",
    submit: { label: "Send", href: "" },
    successMessage:
      "Thank you — your message is on its way. We'll be in touch soon.",
    errorMessage:
      "That didn't send. Email us directly at karolina@suryacacao.com and we'll pick it up from there.",

    fields: [
      {
        name: "firstName",
        label: "First name",
        type: "text",
        required: true,
        autoComplete: "given-name",
      },
      {
        name: "lastName",
        label: "Last name",
        type: "text",
        required: true,
        autoComplete: "family-name",
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        autoComplete: "email",
      },
      {
        name: "message",
        label: "Message",
        type: "textarea",
        required: true,
      },
    ],
  },
};
