import Link from "next/link";
import { footer } from "@content/footer";
import { navigation } from "@content/navigation";
import LogoMark from "@/components/ui/LogoMark";
import SocialIcon, { hasIcon } from "@/components/ui/SocialIcon";
import Container from "./Container";
import Divider from "@/components/ui/Divider";

/**
 * Site footer. Dark surface recipe: Deep Cacao Night ground, Sand Paper text,
 * gold accents — which is the one place gold clears AA as lettering (5.96:1).
 *
 * MISSING (Input 4): shipping, return and privacy policy have no destinations.
 * Per your instruction they render as visibly inert labels rather than links,
 * so the gap is legible on the page instead of hidden. Nothing is guessed at.
 */

const linkClass = "link-draw text-caption tracking-caption";

export default function Footer() {
  return (
    <footer className="bg-deep-cacao-night text-sand-paper mt-auto py-[var(--space-section)]">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          {/* Identity */}
          <div>
            <div className="flex items-center gap-3">
              <LogoMark className="text-gilded-gold text-h3 h-9 w-[4rem] -translate-y-[0.142em]" />
              <span className="font-display text-h3 text-warm-ivory leading-none">
                {navigation.wordmark}
              </span>
            </div>

            <Divider className="my-6" />
          </div>

          {/* Site links */}
          <nav aria-label="Footer">
            <p className="text-eyebrow tracking-eyebrow text-gilded-gold mb-5 uppercase">
              Site
            </p>
            <ul className="flex flex-col gap-3">
              {navigation.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Socials — glyphs, not names.
              The name still has to reach a screen reader, so it moves to
              aria-label and title: an icon-only link with no accessible name
              is announced as just "link". The row is horizontal because three
              24px marks stacked vertically read as a column of debris, and
              each target keeps a 44px touch box via the padding, which the
              text version got for free from its line height. */}
          <div>
            <p className="text-eyebrow tracking-eyebrow text-gilded-gold mb-5 uppercase">
              Socials
            </p>
            <ul className="flex flex-wrap items-center gap-2">
              {footer.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className="hover:text-gilded-gold focus-visible:text-gilded-gold flex min-h-11 min-w-11 items-center justify-center px-1 transition-colors duration-[var(--dur-hover)] ease-[var(--ease-exhale)]"
                  >
                    {hasIcon(social.label) ? (
                      <SocialIcon name={social.label} />
                    ) : (
                      <span className={linkClass}>{social.label}</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-gilded-gold/30 mt-[var(--space-block)] flex flex-wrap items-center justify-between gap-6 border-t pt-8">
          <p className="text-caption tracking-caption opacity-70">
            © {footer.copyrightYear} {footer.legalName}
          </p>

          {/* Inert until the policies exist. Not links — there is nowhere to go. */}
          <ul className="flex flex-wrap gap-6">
            {["Shipping", "Returns", "Privacy"].map((label) => (
              <li key={label}>
                <span
                  title="Not written yet"
                  aria-disabled="true"
                  className="text-caption tracking-caption cursor-not-allowed opacity-40"
                >
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
