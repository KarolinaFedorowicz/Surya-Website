import Section from "@/components/layout/Section";
import Divider from "@/components/ui/Divider";
import Reveal from "@/components/ui/Reveal";
import RestockWaitlistForm from "@/components/shop/RestockWaitlistForm";
import { getShopperCountry } from "@/lib/shopper-country";

/**
 * /restock-waitlist — same dark recipe and header-clearance pattern as
 * ContactIntro. The country field is prefilled from the detected country so
 * most people only confirm it; it stays editable since IP detection can be
 * wrong (VPNs, travel).
 */
export default async function RestockWaitlist() {
  const country = await getShopperCountry();
  const countryName =
    new Intl.DisplayNames(["en"], { type: "region" }).of(country) ?? country;

  return (
    <Section
      tone="dark"
      className="pt-[calc(var(--header-h)+var(--banner-h)+var(--space-section))]"
    >
      <Reveal index={0}>
        <h1 className="font-display text-h1 tracking-h1 leading-h1 text-warm-ivory">
          Restock Waitlist
        </h1>
      </Reveal>

      <Reveal index={1}>
        <Divider className="my-[var(--space-block)]" />
      </Reveal>

      <Reveal index={2}>
        <p className="text-body leading-body max-w-[var(--measure)]">
          Our ceremonial cacao comes from a single partner family in Pimentel,
          one small harvest at a time. Leave your email and where you are, and
          we&rsquo;ll write to you the moment the next batch can ship to you.
        </p>
      </Reveal>

      <div className="mt-[var(--space-section)]">
        <RestockWaitlistForm defaultLocation={countryName} />
      </div>
    </Section>
  );
}
