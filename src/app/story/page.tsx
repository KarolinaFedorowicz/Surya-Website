import type { Metadata } from "next";

import { StoryHero } from "@/components/sections/story/StoryHero";
import { FamilyMap } from "@/components/sections/story/FamilyMap";
import { FamilyVignette } from "@/components/sections/story/FamilyVignette";
import { StoryThroughline } from "@/components/sections/story/StoryThroughline";
import { getFamilies, getFamily } from "@/lib/mdx";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Our Story",
  path: "/story",
  description:
    "Three families, three continents — the Dominican farm, and the Polish and Indian households who drank its cacao for years before it had a label.",
});

/** S7 · S8 · S9 ×3 · S10 */
export default function StoryPage() {
  const families = getFamilies();

  return (
    <>
      <StoryHero />
      <FamilyMap families={families} />
      {families.map((f, i) => {
        const full = getFamily(f.slug);
        return (
          <FamilyVignette
            key={f.slug}
            family={f}
            body={full?.body ?? ""}
            index={i}
          />
        );
      })}
      <StoryThroughline />
    </>
  );
}
