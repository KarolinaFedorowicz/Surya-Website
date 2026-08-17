// Section 0 — Navigation.
// Anchor targets are ids rendered by the corresponding section component.

import type { Cta, NavLink } from "./types";

export const navigation: {
  /** The logo mark carries "CEREMONIAL CACAO"; the header sets "Surya" beside
   *  it rather than repeating the full string. Confirmed. */
  wordmark: string;
  links: NavLink[];
  cta: Cta;
} = {
  wordmark: "Surya",

  links: [
    { label: "Home", href: "/" },
    { label: "Our Ritual", href: "/#our-ritual" },
    { label: "About Us", href: "/#about-us" },
    { label: "Shop", href: "/shop" },
    { label: "Retreats", href: "/retreats" },
    // "Join our Tribe" was removed from the nav. The section it pointed at is
    // now a small banner rather than a destination worth a nav slot, and it
    // sends people off-site to WhatsApp — which is not what a nav link should
    // do without warning. The banner still carries id="join-our-tribe", so any
    // existing /#join-our-tribe link continues to resolve.
  ],

  cta: { label: "Shop Cacao", href: "/shop" },
};

// Social icons live in the footer only — confirmed, not in the top nav.
