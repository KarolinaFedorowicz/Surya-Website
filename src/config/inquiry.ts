import type { InquiryConfig } from "@/components/sections/InquiryForm";

/**
 * The three configurations S18 serves. Kept as data beside site.ts for the
 * same reason nav is: adding a field should never mean opening JSX.
 */

export const RETREAT_INQUIRY: InquiryConfig = {
  eyebrow: "Inquire",
  heading: "Tell us about the group you'd like to bring.",
  intro:
    "We'll help you build the retreat around it. Nothing longer than this — a real conversation follows.",
  submitLabel: "Send inquiry",
  formName: "Retreat inquiry",
  fields: [
    { kind: "text", name: "name", label: "Name", required: true },
    { kind: "email", name: "email", label: "Email", required: true },
    {
      kind: "select",
      name: "groupSize",
      label: "Group size",
      placeholder: "Roughly how many",
      options: [
        { value: "2-6", label: "2–6" },
        { value: "7-12", label: "7–12" },
        { value: "13-20", label: "13–20" },
        { value: "20+", label: "More than 20" },
      ],
    },
    {
      kind: "text",
      name: "dates",
      label: "When",
      hint: "A season is enough — nothing needs to be fixed yet.",
    },
    { kind: "textarea", name: "message", label: "Message" },
  ],
};

/**
 * The studio-stocking audience from the dropped /studio page lives here as a
 * collaboration type — plan §2 and §4.
 */
export const PARTNERSHIP_INQUIRY: InquiryConfig = {
  eyebrow: "Work with us",
  heading: "Start a conversation.",
  intro:
    "Brands, wellness spaces, studios and practitioners. Tell us what you have in mind and who it's for.",
  submitLabel: "Send inquiry",
  formName: "Partnership inquiry",
  fields: [
    { kind: "text", name: "name", label: "Name", required: true },
    { kind: "email", name: "email", label: "Email", required: true },
    { kind: "text", name: "organisation", label: "Space or brand" },
    {
      kind: "select",
      name: "collaborationType",
      label: "Collaboration type",
      placeholder: "Choose one",
      required: true,
      options: [
        { value: "ceremony", label: "Co-branded ceremony" },
        { value: "event", label: "Event cacao service" },
        { value: "product", label: "Product collaboration" },
        { value: "stocking", label: "Studio stocking — retail or events" },
        { value: "other", label: "Something else" },
      ],
    },
    { kind: "textarea", name: "message", label: "Message" },
  ],
};

/**
 * The unified /contact form — copy source's footer spec: one form, one
 * inquiry-type selector, every submission to SITE.contactEmail regardless of
 * type. `inquiryType`'s value IS the email subject label (see
 * api/inquiry/route.ts), so no separate `formName` is set here.
 */
export const CONTACT_INQUIRY: InquiryConfig = {
  eyebrow: "Contact",
  heading: "Get in touch.",
  intro: "Tell us what this is about, and we'll route it to the right person.",
  submitLabel: "Send message",
  fields: [
    { kind: "text", name: "name", label: "Name", required: true },
    { kind: "email", name: "email", label: "Email", required: true },
    {
      kind: "select",
      name: "inquiryType",
      label: "What's this about",
      placeholder: "Choose one",
      required: true,
      options: [
        { value: "Customer Service", label: "Customer Service" },
        { value: "Partnerships", label: "Partnerships" },
        { value: "PR", label: "PR" },
        { value: "Retreats", label: "Retreats" },
        { value: "Wholesale", label: "Wholesale" },
      ],
    },
    { kind: "textarea", name: "message", label: "Message", required: true },
  ],
};
