// Section 8 — Join our community.
//
// Reduced to a banner. This was a full section with a headline and a paragraph
// of copy; it is now a 300×250 medium rectangle carrying one line and one
// button, per your instruction. The old headline and body are gone rather than
// commented out — if you want them back they are in the git history, not here.

import type { Cta } from "./types";

export const joinTheTribe: {
  id: string;
  headline: string;
  cta: Cta;
} = {
  id: "join-our-tribe",
  headline: "Join our community",

  // Leaves the site for a WhatsApp group invite. Anything pointing at this
  // href must open in a new tab and say where it goes — see JoinTheTribe.tsx.
  cta: {
    label: "Join on WhatsApp",
    href: "https://chat.whatsapp.com/IjnBldAGXf44oLGeLW4DFQ",
  },
};
