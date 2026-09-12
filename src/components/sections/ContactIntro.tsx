import { contact } from "@content/contact";
import Section from "@/components/layout/Section";
import Divider from "@/components/ui/Divider";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "./ContactForm";

/**
 * /contact — page opener and form in one section, same dark recipe and
 * header-clearance pattern as RetreatsIntro. No collage: unlike Retreats
 * there's no photo set for "contact," so the form just gets the full width
 * up to its own max-w rather than sharing a two-column grid with something.
 */
export default function ContactIntro() {
  return (
    <Section
      tone="dark"
      className="pt-[calc(var(--header-h)+var(--banner-h)+var(--space-section))]"
    >
      <Reveal index={0}>
        <h1 className="font-display text-h1 tracking-h1 leading-h1 text-warm-ivory">
          {contact.pageTitle}
        </h1>
      </Reveal>

      <Reveal index={1}>
        <Divider className="my-[var(--space-block)]" />
      </Reveal>

      <Reveal index={2}>
        <p className="text-body leading-body max-w-[var(--measure)]">
          {contact.intro}
        </p>
      </Reveal>

      <div className="mt-[var(--space-section)]">
        <ContactForm />
      </div>
    </Section>
  );
}
