// Section 9 — Footer.

import type { NavLink } from "./types";

export const footer: {
  socials: NavLink[];
  policies: NavLink[];
  legalName: string;
  copyrightYear: string;
} = {
  // Footer only — no social icons in the top nav.
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/karolinakaylani/" },
    { label: "TikTok", href: "https://www.tiktok.com/@suryacenters" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/surya-centers-cacao/",
    },
  ],

  // PLACEHOLDER: shipping, return and privacy policy. Still open — a store
  // selling a physical product generally needs all three before launch.
  policies: [],

  legalName: "Surya Cacao",
  copyrightYear: "2026",
};
