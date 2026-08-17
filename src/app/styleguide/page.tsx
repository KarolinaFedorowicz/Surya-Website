import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Divider from "@/components/ui/Divider";
import TiltCard from "@/components/ui/TiltCard";
import Reveal from "@/components/ui/Reveal";
import Container from "@/components/layout/Container";

/**
 * Dev-only styleguide. Every primitive rendered live, on both surfaces, so
 * shape and interaction can be judged by hovering rather than by reading code.
 *
 * Returns 404 in production — this is a workbench, not a page of the site.
 * Delete the route before launch if you'd rather it not exist at all.
 */

export const metadata = { title: "Styleguide — Surya Cacao" };

function Row({
  label,
  note,
  children,
  dark = false,
}: {
  label: string;
  note?: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={`border-t py-10 ${
        dark
          ? "bg-deep-cacao-night text-sand-paper border-gilded-gold/25"
          : "bg-sand-paper text-aubergine-ink border-aubergine-ink/20"
      }`}
    >
      <Container>
        <p
          className={`text-eyebrow tracking-eyebrow mb-1 uppercase ${
            dark ? "text-gilded-gold" : "text-aubergine-ink/70"
          }`}
        >
          {label}
        </p>
        {note && (
          <p className="text-caption mb-6 max-w-[54ch] opacity-70">{note}</p>
        )}
        <div className="mt-6 flex flex-wrap items-center gap-5">{children}</div>
      </Container>
    </div>
  );
}

export default function Styleguide() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main>
      <div className="bg-sand-paper text-aubergine-ink pt-24 pb-10">
        <Container>
          <Eyebrow>Workbench</Eyebrow>
          <h1 className="font-display text-h1 tracking-h1 leading-h1 mt-4">
            Primitives.
          </h1>
          <Divider className="my-[var(--space-block)]" />
          <p className="text-body leading-body max-w-[var(--measure)]">
            Every reusable piece, live on both surfaces. Hover the buttons to
            feel the magnetic pull, tab through them to see the focus ring, and
            hover the panel for the tilt. This route 404s in production.
          </p>
        </Container>
      </div>

      <Row
        label="Button — light surface"
        note="Primary is an Aubergine fill with Sand Paper text. Ghost is a gold hairline with no fill, because gold is never a fill. Both share one shape — square, identical box, 12rem minimum — declared once in buttonBase. Every variant carries a 1px border, transparent on the filled one, so the two measure the same."
      >
        <Button href="/shop">Shop Cacao</Button>
        <Button href="/#join-our-tribe" variant="ghost">
          Join our Tribe
        </Button>
      </Row>

      <Row
        label="Button — dark surface"
        note="On Deep Cacao Night the primary flips to a gold fill with Night text, because Aubergine on Night is too close to read. Same shape, different pairing."
        dark
      >
        <Button href="/shop" onDark>
          Shop Cacao
        </Button>
        <Button href="/#join-our-tribe" variant="ghost" onDark>
          Join our Tribe
        </Button>
      </Row>

      <Row
        label="Button — destination not decided"
        note="Pass an empty href and the same primitive renders a disabled control instead of a link to nowhere. This is what both purchase buttons look like right now, until the Shopify URLs land. Hover for the tooltip."
      >
        <Button href="" unavailableReason="Shopify store not connected yet">
          Add to Cart
        </Button>
        <Button
          href=""
          variant="ghost"
          unavailableReason="Shopify store not connected yet"
        >
          Buy Now
        </Button>
      </Row>

      <Row
        label="Eyebrow"
        note="Aubergine on light, gold on dark. The split isn't stylistic — gold at 13px measures 1.65:1 on Sand Paper, so it can't be lettering there."
      >
        <Eyebrow>From Tree to Cup</Eyebrow>
        <span className="bg-deep-cacao-night px-6 py-4">
          <Eyebrow onDark>Our Ritual</Eyebrow>
        </span>
      </Row>

      <Row
        label="Divider"
        note="The gold hairline. 1px, 4rem, the only way gold appears on a light surface."
      >
        <Divider />
      </Row>

      <Row
        label="Text link — underline draws left to right"
        note="Hover or tab to it. 520ms on the same easing as everything else."
      >
        <a href="#" className="link-draw text-body">
          k.fedorowicz@riftartech.com
        </a>
      </Row>

      <Row
        label="TiltCard — the product panel"
        note="Hover it. Tilt caps at 4deg so it reads as weight rather than a gimmick. The gold border is structural: Warm Ivory on Sand Paper is 1.50:1, so without it the panel has no visible edge."
      >
        <TiltCard className="bg-warm-ivory border-gilded-gold w-[340px] border p-8">
          <p className="text-eyebrow tracking-eyebrow mb-4 uppercase opacity-70">
            Surya Ceremonial Cacao
          </p>
          {[
            ["150g", "$25"],
            ["300g", "$35"],
            ["500g", "$60"],
          ].map(([size, price]) => (
            <div
              key={size}
              className="border-aubergine-ink/15 flex justify-between border-b py-3 last:border-b-0"
            >
              <span>{size}</span>
              <span>{price}</span>
            </div>
          ))}
        </TiltCard>
      </Row>

      <Row
        label="Form fields"
        note="Same square corners as the buttons. Gold hairline at 45% at rest, full gold on hover and focus. Used on the retreats form."
        dark
      >
        <div className="grid w-full max-w-[36rem] gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="text-eyebrow tracking-eyebrow text-gilded-gold mb-2 block uppercase">
              First name
            </span>
            <input
              className="border-gilded-gold/45 text-body text-sand-paper hover:border-gilded-gold focus:border-gilded-gold w-full border bg-transparent px-4 py-3 transition-colors duration-[var(--dur-hover)] ease-[var(--ease-exhale)] focus:outline-none"
              defaultValue="Karolina"
            />
          </label>
          <label className="block">
            <span className="text-eyebrow tracking-eyebrow text-gilded-gold mb-2 block uppercase">
              Contact number
              <span className="text-sand-paper/45"> (optional)</span>
            </span>
            <input
              className="border-gilded-gold/45 text-body text-sand-paper placeholder-sand-paper/40 hover:border-gilded-gold focus:border-gilded-gold w-full border bg-transparent px-4 py-3 transition-colors duration-[var(--dur-hover)] ease-[var(--ease-exhale)] focus:outline-none"
              placeholder="Empty state"
            />
          </label>
        </div>
      </Row>

      <Row
        label="Reveal"
        note="Every block on the site enters this way: fade up 10px, 80ms stagger by index, fires once. These three staggered as you scrolled to them."
      >
        {[0, 1, 2].map((i) => (
          <Reveal key={i} index={i}>
            <div className="border-gilded-gold border px-6 py-4">
              index {i} — {i * 80}ms
            </div>
          </Reveal>
        ))}
      </Row>

      <Row
        label="Focus ring"
        note="Tab through this page. 2px gold, 3px offset, and immediate — the one stated exception to the 500ms floor, because a focus indicator that fades in is an accessibility defect."
      >
        <Button href="/shop">Tab to me</Button>
        <Button href="/shop" variant="ghost">
          Then me
        </Button>
      </Row>

      <div className="bg-deep-cacao-night text-sand-paper border-gilded-gold/25 border-t py-14">
        <Container>
          <p className="text-caption max-w-[54ch] leading-relaxed opacity-70">
            Turn on Reduce Motion in System Settings → Accessibility → Display
            and reload. Magnetic pull, tilt and Ken Burns drift all switch off,
            reveals become a 200ms cross-fade, and every element keeps a
            readable resting state.
          </p>
        </Container>
      </div>
    </main>
  );
}
