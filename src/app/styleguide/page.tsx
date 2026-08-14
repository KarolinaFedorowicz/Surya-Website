import type { Metadata } from "next";

import {
  Button,
  Display,
  Eyebrow,
  Field,
  Frame,
  HairlineRule,
  Input,
  Pill,
  Prose,
  Section,
  Select,
  Textarea,
  TextLink,
  type Tone,
} from "@/components/primitives";
import { MdxContent } from "@/components/mdx/MdxContent";
import { getCopy, getFamilies, getFeaturedRecipes } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Styleguide",
  description: "Design system verification surface — not a public page.",
  robots: { index: false, follow: false },
};

/* --------------------------------------------------------------------------
   Local scaffolding for this page only. Deliberately NOT promoted into
   primitives/ — the styleguide documents the system, it isn't part of it.
   -------------------------------------------------------------------------- */

function Row({
  id,
  name,
  children,
}: {
  id: string;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <HairlineRule />
      <div className="grid gap-5 py-10 md:grid-cols-[10rem_1fr] md:gap-10">
        <div>
          <p className="text-emphasis font-body text-caption">{id}</p>
          <p className="text-muted font-body text-caption mt-1">{name}</p>
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </>
  );
}

/**
 * Named against the CSS custom property rather than a hex literal, so the
 * styleguide stays honest with the "zero hardcoded hex outside globals.css"
 * rule — including in its own documentation.
 */
const SWATCHES = [
  { name: "Aubergine Ink", token: "--color-aubergine", bg: "bg-aubergine", role: "Primary — ink on light, filled buttons" },
  { name: "Sand Paper", token: "--color-sand", bg: "bg-sand", role: "Page and section surfaces" },
  { name: "Deep Cacao Night", token: "--color-night", bg: "bg-night", role: "Dark surface — hero, footer, retreats" },
  { name: "Warm Ivory", token: "--color-ivory", bg: "bg-ivory", role: "Cards layered on Sand Paper" },
  { name: "Gilded Gold", token: "--color-gold", bg: "bg-gold", role: "Accent only. Never a fill." },
] as const;

const TYPE_SCALE = [
  { step: "text-h1", face: "Gilda Display", spec: "40 → 96px", sample: "Beyond cacao." },
  { step: "text-h2", face: "Gilda Display", spec: "40 → 56px", sample: "Three families." },
  { step: "text-h3", face: "Marcellus", spec: "20 → 24px", sample: "A ritual, remembered" },
  { step: "text-body", face: "Marcellus", spec: "17 → 19px / 1.6", sample: "Cacao offers a lift from ceremony, not stimulation." },
  { step: "text-caption", face: "Marcellus", spec: "14px / +0.05em", sample: "Ships to North America and the EU" },
  { step: "text-eyebrow", face: "Marcellus", spec: "13px / +0.15em / small caps", sample: "Why now" },
] as const;

const TONES: { tone: Tone; label: string; recipe: string }[] = [
  { tone: "sand", label: "Sand", recipe: "Sand Paper surface · Aubergine ink · Gold accent" },
  { tone: "ivory", label: "Ivory", recipe: "Warm Ivory surface · Aubergine ink · Gold accent" },
  { tone: "dark", label: "Dark", recipe: "Deep Cacao Night surface · Sand Paper ink · Gold accent" },
];

const SPACE_TYPES = [
  { value: "events", label: "Events" },
  { value: "retail", label: "Retail shelf" },
  { value: "both", label: "Both" },
];

/** P1–P14, rendered identically across all three tones. */
function ToneSpecimen({ tone, label, recipe }: (typeof TONES)[number]) {
  return (
    <Section tone={tone} space="normal" id={`tone-${tone}`}>
      <Eyebrow>{`Tone — ${label}`}</Eyebrow>
      <Display as="h2" size="section" className="mt-4">
        {label} surface
      </Display>
      <p className="text-muted font-body text-caption mt-4">{recipe}</p>
      <p className="text-muted font-body text-caption mt-2">
        P1 Section is the container around all of this — it sets the tone every
        primitive below reads from.
      </p>

      <div className="mt-12">
        <Row id="P2" name="Display">
          <div className="space-y-8">
            <Display as="p" size="hero">
              Beyond.
            </Display>
            <Display as="p" size="section">
              Three families, three continents
            </Display>
            <Display as="p" size="quote" color="emphasis">
              &ldquo;The ritual doesn&rsquo;t end with us.&rdquo;
            </Display>
          </div>
        </Row>

        <Row id="P3" name="Eyebrow">
          <Eyebrow>Our stance</Eyebrow>
        </Row>

        <Row id="P4" name="Prose">
          <Prose>
            <p>
              Placeholder copy. Ceremonial cacao has become trendy and diluted —
              fillers, over-processed beans, ritual sold as an aesthetic. Our
              position is that{" "}
              <strong>quality and access aren&rsquo;t in tension</strong>.
            </p>
            <h2>A subsection heading</h2>
            <p>
              Prose headings are Marcellus, not Gilda, so a long page can&rsquo;t
              drift past the two-or-three-display-instances rule.
            </p>
            <ul>
              <li>Dominican Republic — the farm and the raw material</li>
              <li>Poland and India — eight years of daily ritual</li>
            </ul>
            <blockquote>
              Not a supply-chain story. A relationship story.
            </blockquote>
          </Prose>
        </Row>

        <Row id="P5" name="Button">
          <div className="flex flex-wrap items-center gap-5">
            <Button variant="primary" size="lg">
              Shop the ritual
            </Button>
            <Button variant="primary" size="md">
              Add to cart
            </Button>
            <Button variant="secondary" size="md">
              Notify me
            </Button>
            <Button variant="quiet" size="md">
              Our story ↓
            </Button>
            <Button variant="primary" size="sm" disabled>
              Sold out
            </Button>
            <Button href="/styleguide" variant="secondary" size="sm">
              As a link
            </Button>
          </div>
        </Row>

        <Row id="P6" name="TextLink">
          <p className="font-body text-body text-ink max-w-[46rem]">
            Every bean is grown and harvested by hand on a{" "}
            <TextLink href="/story">family-owned farm</TextLink> in the
            Dominican Republic. You can also{" "}
            <TextLink href="/retreats">meet the farm in person</TextLink>, or{" "}
            <TextLink>trigger an action</TextLink> without navigating. Hover to
            see the rule draw left to right.
          </p>
        </Row>

        <Row id="P7" name="HairlineRule">
          <div className="space-y-6">
            <HairlineRule />
            <div className="flex h-16 items-center gap-6">
              <span className="text-muted font-body text-caption">150g</span>
              <HairlineRule orientation="vertical" />
              <span className="text-muted font-body text-caption">300g</span>
              <HairlineRule orientation="vertical" />
              <span className="text-muted font-body text-caption">500g</span>
            </div>
          </div>
        </Row>

        <Row id="P8" name="GrainOverlay">
          <p className="text-muted font-body text-caption max-w-prose">
            {tone === "dark"
              ? "Off by default on dark surfaces — brief §3.4 scopes paper grain to Sand Paper and Warm Ivory. Pass grain to override."
              : "On by default at 3.5% opacity across this whole section. Generated from fractal noise in CSS, not an image asset — so A5 is not actually blocking."}
          </p>
        </Row>

        <Row id="P9" name="Frame">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            <Frame ratio="portrait" label="300g bag" />
            <Frame ratio="square" label="Square" />
            <Frame ratio="tall" label="Portrait" />
            <Frame ratio="landscape" label="Farm" />
          </div>
          <p className="text-muted font-body text-caption mt-4">
            No photography exists, so Frame renders brand-colored blocks at the
            real aspect ratios. Passing src swaps in Next/Image.
          </p>
        </Row>

        <Row id="P10–P13" name="Field · Input · Textarea · Select">
          <div className="grid max-w-xl gap-8">
            <Input label="Name" name={`name-${tone}`} placeholder="Your name" />
            <Input
              label="Email"
              name={`email-${tone}`}
              type="email"
              required
              hint="We only write when there's something worth saying."
            />
            <Input
              label="Group size"
              name={`group-${tone}`}
              defaultValue="not a number"
              error="Enter a number between 2 and 40."
            />
            <Select
              label="Space type"
              name={`space-${tone}`}
              placeholder="Choose one"
              options={SPACE_TYPES}
            />
            <Select
              label="Collaboration type"
              name={`collab-${tone}`}
              options={SPACE_TYPES}
              error="Select a collaboration type."
            />
            <Input
              label="Locked"
              name={`locked-${tone}`}
              defaultValue="Coming soon"
              disabled
            />
            <Textarea
              label="Message"
              name={`message-${tone}`}
              placeholder="Tell us about the group you'd like to bring."
            />
            <Field
              htmlFor={`raw-${tone}`}
              label="Field, unwrapped"
              hint="Field used directly around a custom control."
            >
              <div
                id={`raw-${tone}`}
                className="border-hairline text-muted font-body text-caption border border-dashed px-4 py-6"
              >
                arbitrary child control
              </div>
            </Field>
          </div>
        </Row>

        <Row id="P14" name="Pill">
          <div className="flex flex-wrap items-center gap-4">
            <Pill>For the slow Sunday</Pill>
            <Pill dot>North America &amp; EU</Pill>
            <Pill variant="soon">Coming soon</Pill>
            <Pill variant="solid">In stock</Pill>
          </div>
        </Row>

        <HairlineRule />
      </div>
    </Section>
  );
}

export default function StyleguidePage() {
  // Real content off disk — if any of this fails to validate, the page fails
  // to build, which is the point of the Phase 3 checkpoint.
  const copy = getCopy("on-gatekeeping");
  const recipes = getFeaturedRecipes(3);
  const families = getFamilies();
  const compounds = getCopy("whats-inside").compounds ?? [];

  return (
    <>
      <Section tone="dark" space="spacious">
        <Eyebrow>Internal · Phase 1</Eyebrow>
        <Display as="h1" size="hero" className="mt-6">
          Styleguide
        </Display>
        <p className="text-muted font-body text-body mt-8 max-w-[46rem]">
          All 14 primitives (P1–P14), rendered in all three tones. If a
          component looks wrong on any one of these surfaces, it is the
          component that is wrong — page sections are never allowed to patch
          color locally.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Pill dot>14 of 14 primitives</Pill>
          <Pill variant="soon">M · L · C · S pending</Pill>
        </div>
      </Section>

      {/* ---- Tokens ---------------------------------------------------- */}
      <Section tone="ivory" space="normal">
        <Eyebrow>Foundation</Eyebrow>
        <Display as="h2" size="section" className="mt-4">
          Colour
        </Display>
        <p className="text-muted font-body text-caption mt-4 max-w-[46rem]">
          Five named values, defined once in globals.css. Max three per section.
        </p>

        <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {SWATCHES.map((s) => (
            <li key={s.token}>
              <div
                className={`${s.bg} border-hairline h-28 w-full rounded-sm border`}
              />
              <p className="text-ink font-body text-h3 mt-4">{s.name}</p>
              <p className="text-emphasis font-body text-caption mt-1">
                {s.token}
              </p>
              <p className="text-muted font-body text-caption mt-2">{s.role}</p>
            </li>
          ))}
        </ul>

        <HairlineRule className="mt-20" />

        <div className="mt-20">
          <Eyebrow>Foundation</Eyebrow>
          <Display as="h2" size="section" className="mt-4">
            Type
          </Display>
          <p className="text-muted font-body text-caption mt-4 max-w-[46rem]">
            Two faces. Hierarchy comes from size, tracking and case — never a
            third typeface.
          </p>

          <div className="mt-12">
            {TYPE_SCALE.map((t) => (
              <div key={t.step}>
                <HairlineRule />
                <div className="grid gap-3 py-8 md:grid-cols-[14rem_1fr] md:gap-10">
                  <div>
                    <p className="text-ink font-body text-caption">{t.step}</p>
                    <p className="text-muted font-body text-caption mt-1">
                      {t.face}
                    </p>
                    <p className="text-emphasis font-body text-caption mt-1">
                      {t.spec}
                    </p>
                  </div>
                  <p
                    className={`${t.step} min-w-0 ${
                      t.face === "Gilda Display" ? "font-display" : "font-body"
                    } ${
                      t.step === "text-eyebrow"
                        ? "text-emphasis uppercase [font-variant-caps:all-small-caps]"
                        : "text-ink"
                    }`}
                  >
                    {t.sample}
                  </p>
                </div>
              </div>
            ))}
            <HairlineRule />
          </div>
        </div>
      </Section>

      {/* ---- The accent rule ------------------------------------------- */}
      <Section tone="sand" space="normal">
        <Eyebrow>Foundation</Eyebrow>
        <Display as="h2" size="section" className="mt-4">
          Gold, and where it can go
        </Display>
        <Prose className="mt-8">
          <p>
            Gilded Gold clears WCAG AA as text only on Deep Cacao Night
            (5.96:1). On Sand Paper it measures 1.65:1 and on Warm Ivory 2.48:1
            — below even the 3:1 large-text floor. So the system splits gold
            into two roles.
          </p>
          <ul>
            <li>
              <strong>accent</strong> — literal gold. Hairline rules, borders,
              list markers, decorative strokes. Not text, so no minimum applies.
            </li>
            <li>
              <strong>emphasis</strong> — the tone-safe accent for anything a
              reader has to read. Gold on dark, Aubergine on light. Eyebrows
              (P3), Pills (P14), required markers and focus states route here.
            </li>
          </ul>
          <p>
            The practical consequence:{" "}
            <strong>gold reads as gold only on dark surfaces.</strong> If a
            section needs visible gold, it wants to be a dark section. Flagged
            for review.
          </p>
        </Prose>
      </Section>

      {/* ---- Phase 3: the content layer, rendering for real -------------- */}
      <Section tone="ivory" space="normal">
        <Eyebrow>Phase 3 · CT1–CT3</Eyebrow>
        <Display as="h2" size="section" className="mt-4">
          Content layer
        </Display>
        <p className="text-muted font-body text-caption mt-4 max-w-[46rem]">
          Real MDX off disk, validated against its schema and rendered through
          P4 Prose. This is the Phase 3 checkpoint — Phase 4 consumes these
          same loaders.
        </p>

        <div className="mt-12">
          <Row id="CT3" name="Page copy → Prose">
            <div className="flex flex-wrap gap-3">
              <Pill variant="soon">{copy.slug}.mdx</Pill>
              {copy.section ? <Pill>{copy.section}</Pill> : null}
              {copy.placeholder ? <Pill variant="soon">placeholder</Pill> : null}
            </div>
            <MdxContent source={copy.body} className="mt-8" />
          </Row>

          <Row id="CT1" name="Recipe">
            <ul className="grid gap-6 sm:grid-cols-3">
              {recipes.map((r) => (
                <li key={r.slug}>
                  <Frame ratio="tall" label={r.title} />
                  <p className="text-ink font-display text-h3 mt-4">{r.title}</p>
                  <p className="text-muted font-body text-caption mt-1 italic">
                    {r.mood}
                  </p>
                  <p className="text-muted font-body text-caption mt-3">
                    {r.ingredients.length} ingredients · {r.method.length} steps
                  </p>
                </li>
              ))}
            </ul>
          </Row>

          <Row id="CT2" name="Family">
            <ul className="grid gap-6 sm:grid-cols-3">
              {families.map((f) => (
                <li key={f.slug}>
                  <p className="text-ink font-display text-h3">{f.country}</p>
                  <p className="text-emphasis font-body text-caption mt-1">
                    {f.coordinates[0].toFixed(4)}, {f.coordinates[1].toFixed(4)}
                  </p>
                  <p className="text-muted font-body text-caption mt-3">
                    {f.narrative}
                  </p>
                </li>
              ))}
            </ul>
            <p className="text-muted font-body text-caption mt-8">
              Coordinates are real and range-checked — they become S8
              FamilyMap&rsquo;s waypoints.
            </p>
          </Row>

          <Row id="S4" name="Compound sequence">
            <ol className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {compounds.map((c, i) => (
                <li key={c.name} className="flex gap-4">
                  <span className="text-emphasis font-body text-caption pt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="text-ink font-body text-h3 block">
                      {c.name}
                    </span>
                    <span className="text-muted font-body text-caption">
                      {c.note}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </Row>

          <HairlineRule />
        </div>
      </Section>

      {/* ---- Every primitive, every tone -------------------------------- */}
      {TONES.map((t) => (
        <ToneSpecimen key={t.tone} {...t} />
      ))}

      {/* ---- Nesting check --------------------------------------------- */}
      <Section tone="sand" space="normal">
        <Eyebrow>Composition</Eyebrow>
        <Display as="h2" size="section" className="mt-4">
          Ivory on Sand
        </Display>
        <p className="text-muted font-body text-caption mt-4 max-w-[46rem]">
          Warm Ivory exists to be layered on Sand Paper. A nested P1 re-scopes
          the tone, so the card&rsquo;s children pick up Ivory&rsquo;s roles
          without anyone passing a color down.
        </p>

        <Section
          as="div"
          tone="ivory"
          space="compact"
          width="full"
          className="px-8 md:px-12"
        >
          <div className="grid items-center gap-10 md:grid-cols-[1fr_16rem]">
            <div>
              <Pill variant="soon">Coming soon</Pill>
              <Display as="p" size="section" className="mt-5">
                Vanilla Bean Cacao
              </Display>
              <p className="text-muted font-body text-body mt-4 max-w-[34rem]">
                A nested card on a Sand Paper page. Same primitives, different
                surface, no local overrides.
              </p>
              <Button variant="secondary" size="sm" className="mt-8">
                Notify me
              </Button>
            </div>
            <Frame ratio="portrait" label="Product" />
          </div>
        </Section>
      </Section>
    </>
  );
}
