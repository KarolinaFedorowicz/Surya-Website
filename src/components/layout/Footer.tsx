// L4 — Footer. SURYA_CACAO_BUILD_PLAN.md §3.3
import Link from "next/link";

import { Display, HairlineRule, Pill, Section } from "@/components/primitives";
import { Mark } from "./Mark";
import { Newsletter } from "./Newsletter";
import { SocialLinks } from "./SocialLinks";
import {
  CLOSING_LINE,
  CONTACT_LINK,
  LEGAL_LINKS,
  NAV_LINKS,
  SITE,
} from "@/config/site";
import { getCopy } from "@/lib/mdx";

/**
 * Deep Cacao Night. Mark, links, shipping regions restated, closing line.
 *
 * The closing line — "The ritual doesn't end with us." — is inherited from the
 * dropped /studio page and sits ABOVE the newsletter (plan §2), where it
 * bookends the hero's "Beyond cacao." It is the last Gilda instance on the
 * page, deliberately alone.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const newsletter = getCopy("newsletter");

  return (
    <Section as="footer" tone="dark" space="normal">
      {/* The closing line, above the newsletter — plan §2. */}
      <Display as="p" size="section" className="max-w-[22ch]">
        {CLOSING_LINE}
      </Display>

      <div className="mt-16 grid gap-14 lg:grid-cols-[1fr_auto]">
        <Newsletter title={newsletter.title} lead={newsletter.lead} />

        <div className="lg:text-right">
          {/* Full lockup here rather than the emblem — the footer is the one
              place with room for the wordmark to be legible. */}
          <Mark
            variant="lockup"
            className="text-accent h-40 w-auto lg:ml-auto"
          />
        </div>
      </div>

      <HairlineRule className="mt-20" />

      {/* Contact — one link to the unified form (/contact), whose inquiry-type
          dropdown covers what five separate footer routes used to. */}
      <nav aria-label="Contact" className="mt-10">
        <Link
          href={CONTACT_LINK.href}
          className="text-ink hover:text-emphasis font-body text-eyebrow uppercase tracking-[0.15em] [font-variant-caps:all-small-caps]"
        >
          {CONTACT_LINK.label}
        </Link>
      </nav>

      <HairlineRule className="mt-14" />

      <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <nav aria-label="Footer">
          <p className="text-muted font-body text-eyebrow uppercase tracking-[0.15em] [font-variant-caps:all-small-caps]">
            Explore
          </p>
          <ul className="mt-4 space-y-2.5">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-ink hover:text-emphasis font-body text-caption transition-colors duration-[600ms] ease-surya"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={SITE.communityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:text-emphasis font-body text-caption transition-colors duration-[600ms] ease-surya"
              >
                Join our community
              </a>
            </li>
          </ul>
        </nav>

        <nav aria-label="Legal">
          <p className="text-muted font-body text-eyebrow uppercase tracking-[0.15em] [font-variant-caps:all-small-caps]">
            Information
          </p>
          <ul className="mt-4 space-y-2.5">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-ink hover:text-emphasis font-body text-caption transition-colors duration-[600ms] ease-surya"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-muted font-body text-eyebrow uppercase tracking-[0.15em] [font-variant-caps:all-small-caps]">
            Shipping
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {SITE.shippingRegions.map((r) => (
              <li key={r}>
                <Pill dot>{r}</Pill>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-muted font-body text-eyebrow uppercase tracking-[0.15em] [font-variant-caps:all-small-caps]">
            Elsewhere
          </p>
          <SocialLinks className="mt-4" />
        </div>
      </div>

      <p className="text-muted font-body text-caption mt-16">
        © {year} {SITE.name}
      </p>
    </Section>
  );
}
