// ROUTE STUB — home page ("/").
// Section order comes straight from the site content draft. Every child is an
// empty shell at this stage, so this route renders nothing on purpose.

import Hero from "@/components/sections/Hero";
import RitualMeaning from "@/components/sections/RitualMeaning";
import TreeToCup from "@/components/sections/TreeToCup";
import RitualSteps from "@/components/sections/RitualSteps";
import About from "@/components/sections/About";
import Product from "@/components/sections/Product";
import JoinTheTribe from "@/components/sections/JoinTheTribe";

// Community Proof (section 7) is intentionally not on the page yet — there are
// no real testimonials. The component and its content file stay in place for
// when there are. See CONTENT_QUESTIONS.md #8.

export default function HomePage() {
  return (
    <>
      <Hero />
      <RitualMeaning />
      <TreeToCup />
      <RitualSteps />
      <About />
      <Product />
      <JoinTheTribe />
    </>
  );
}
