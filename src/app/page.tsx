import type { Metadata } from "next";

import { Hero } from "@/components/sections/home/Hero";
import { RitualReimagined } from "@/components/sections/home/RitualReimagined";
import { OnGatekeeping } from "@/components/sections/home/OnGatekeeping";
import { WhatsInside } from "@/components/sections/home/WhatsInside";
import { FamiliesTeaser } from "@/components/sections/home/FamiliesTeaser";
import { RecipesTeaser } from "@/components/sections/home/RecipesTeaser";
import { PourWipe } from "@/components/motion";
import { getCopy } from "@/lib/mdx";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ path: "/" });

/** Long-scroll brand narrative — S1 · S2 · S3 · S4 · S5 · S6. */
export default function HomePage() {
  const inside = getCopy("whats-inside");

  return (
    <>
      <Hero />
      <RitualReimagined />
      <OnGatekeeping />
      {/* M10 at a real section boundary: Deep Cacao Night → Warm Ivory. */}
      <PourWipe />
      <WhatsInside
        title={inside.headline ?? inside.title}
        eyebrow={inside.eyebrow ?? "What's inside"}
        compounds={inside.compounds ?? []}
        lead={inside.lead}
        paragraphs={inside.paragraphs}
        closing={inside.closing}
      />
      <FamiliesTeaser />
      <RecipesTeaser />
    </>
  );
}
