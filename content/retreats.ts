// Retreats page (/retreats).
//
// Two blocks now: the page opener (title, the Surya Center copy, and a button
// down to the form) and the enquiry block that owns the form itself.
//
// Your copy arrived as one paragraph. It is split into three here on its own
// sentence breaks — what the Center is, what the place and the food are, and
// the farm visit — because a 90-word block set at --measure is a wall, and the
// three ideas are already distinct. No words were changed, added or cut.
//
// CLOSED: this page previously named no location. The copy now says Samaná,
// Dominican Republic, which was the gap flagged here. Dates and pricing are
// still absent.

import type { Cta } from "./types";

export const retreats: {
  /** Page opener. */
  pageTitle: string;
  body: string[];
  contactPrompt: string;
  contactCta: Cta;
  /** The enquiry block further down the same page. */
  headline: string;
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
  pageTitle: "Retreats",

  body: [
    "Surya Center is our facility in the Dominican Republic, where we invite you to build your own personalized retreat.",
    "Set in the Samaná region, surrounded by turquoise sea and jungle, Surya Center is an ecological facility — built to hold space, not perform luxury. All food on site is grown in collaboration with local farmers: pesticide-free, GMO-free, and truly nourishing. A real farm-to-table experience, from the same land your cacao comes from.",
    "As part of your retreat, we'll also bring you to our ceremonial cacao farm, where you can see the source firsthand and try the variety of beans for yourself.",
  ],

  contactPrompt: "To build your retreat, get in touch:",

  // Same page, not a separate contact route — the enquiry form is a screen
  // down. #retreat-enquiry is rendered by RetreatsIntro.
  contactCta: { label: "Contact", href: "#retreat-enquiry" },

  headline: "Sit with us in person.",

  form: {
    eyebrow: "Book a retreat",
    submit: { label: "Send", href: "" },
    successMessage: "Thank you — we've got your details and we'll be in touch.",
    errorMessage:
      "That didn't send. Email us directly at k.fedorowicz@riftartech.com and we'll pick it up from there.",

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
        name: "contact",
        label: "Contact number",
        type: "tel",
        required: false,
        autoComplete: "tel",
      },
      {
        name: "interest",
        label: "Why are you interested?",
        type: "textarea",
        required: true,
      },
    ],
  },
};
