// Section 1 — Hero.

import type { Cta } from "./types";

export const hero: {
  headline: string;
  subhead: string;
  body: string;
  primaryCta: Cta;
  secondaryCta: Cta;
} = {
  headline: "Surya Ceremonial Cacao.",
  subhead: "Love your Love. Your morning cup is your ceremony.",
  body: "Surya Cacao is ceremonial cacao, made for the first hour of your day.",
  primaryCta: { label: "Shop Cacao", href: "/shop" },
  secondaryCta: { label: "Join our Tribe", href: "#join-our-tribe" },
};
