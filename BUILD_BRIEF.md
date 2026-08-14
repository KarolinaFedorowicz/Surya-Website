# Surya Cacao — Website Build Brief (Claude Code Handoff)

This is the single reference document for building the Surya Cacao site. It
consolidates the brand/design brief, the signature animation spec, and an
asset manifest into one place, in build order. Paste this whole file into
Claude Code as your starting prompt, with the `/assets` folder alongside it
in the repo.

**How this doc is organized:**
1. Project snapshot
2. Asset manifest — what exists, what's missing, what NOT to ship
3. Design token system (colors / type / logo / texture)
4. Motion & animation system (general rules + the full cacao-pour spec)
5. Site architecture & page-by-page content
6. Tech stack & dependencies to install
7. Suggested build order
8. Open items — decisions/assets still needed from me

---

## 1. Project Snapshot

**Brand:** Surya Cacao — ceremonial cacao, positioned as a luxury wellness
brand (closer to Aesop/Diptyque than a supplement DTC site).

**Positioning line:** *Surya Cacao is beyond cacao — a return to ritual,
shared by three families across three continents.*

**Tone:** warm, unhurried, reverent, restrained. No exclamation points, no
countdown urgency, no stock-photo positivity. Full tone guidance is in
Section 5.

**The signature device:** a gold sun/crown-chakra line-mark that is both the
logo and the site's core transition animation (the "Sunrise Reveal" and, per
the separate motion spec, a chocolate-pour wipe — see Section 4 for how
these two ideas relate and a flagged conflict to resolve).

---

## 2. Asset Manifest

All files are in `/assets` next to this doc, organized into four folders.
**Read the flags below before using anything** — a few of these are not
launch-ready.

### 2.1 Logo — `/assets/logo/`

| File | Notes |
|---|---|
| `surya-sun-crown-logo-raster.png` | 513×487, PNG with transparency. This is a **raster image, not a vector file.** |

🚩 **Blocker for the signature animation.** Section 3.3 of the design brief
specifies the logo as fine gold linework (1–1.5px stroke, never filled) that
draws itself stroke-by-stroke on load and redraws as a scroll-progress
indicator. That requires an actual **SVG with real `<path>` data** (so
`stroke-dasharray`/`stroke-dashoffset` animation works). A flattened PNG
cannot be stroke-animated. **This needs to be re-exported as SVG from the
original vector source (Illustrator/Figma) before the load-animation and
scroll-progress-mark features can be built.** Until then, Claude Code should
use the PNG as a static mark and stub the draw-on animation, clearly
commented as pending the SVG.

🚩 **Style mismatch to resolve.** This raster logo is rendered in solid
brown/tan fill on white. The design brief calls for gold, unfilled linework.
The gold-foil-on-aubergine version stamped on the product bags (see product
photography below) is actually closer to the brief's intent. Before building
the header/footer lockup, confirm which version is canonical — ideally the
bag's gold linework becomes the source SVG.

### 2.2 Product Photography — `/assets/product-photography/`

| File | Notes |
|---|---|
| `bag-300g-studio-cream-bg.png` | 1085×1449. Bag on a plain warm-cream backdrop. Good source for Shop page hero product shot. |
| `bag-300g-transparent-cutout.png` | 432×577, background removed, alpha channel. Lower resolution — fine for small UI (e.g. nav Shop-dropdown thumbnail) but will look soft if scaled up large. |
| `bag-300g-meadow-goldenhour.png` | 1086×1448. Bag styled in a wildflower meadow, low golden-hour light. This matches the brief's "warm, low, late-afternoon light" direction well — strong candidate for Home hero or Shop page mood shot. |

Note: these three appear to be the same generated bag asset in different
settings/crops (same label, same 300g size) rather than three distinct
photoshoots. Fine for a first build pass; see Section 8 re: real product
photography.

### 2.3 Lifestyle Photography — `/assets/lifestyle-photography/`

| File | Notes |
|---|---|
| `drinking-cacao-closeup-meadow.jpeg` | 1179×1549. Close crop, hands + cup + neckline, meadow background, golden hour. Strong hero or "Ritual, Reimagined" section candidate. |
| `woman-meadow-topdown-with-cup.jpeg` | 1179×1484. Top-down, same shoot/wardrobe as above. Pairs well as a two-image sequence for a scroll reveal. |
| `pour-into-vintage-teacup-meadow.png` | 1071×1469. Overhead pour shot into a vintage teacup, meadow background. Good candidate for "What's Inside" section opener or a recipe card. |

None of these are drop-in hero video — they're stills. See Section 4 for
what actual footage still needs to be shot for the pour animation.

### 2.4 Reference Only — `/assets/reference-mood-only/`

| File | Notes |
|---|---|
| `DO-NOT-SHIP-watermarked-stock-pour-reference.jpg` | 366×488. **This is a low-resolution, watermarked stock photo (AllPosters watermark visible), not a licensed or owned asset.** Do not use it anywhere in the shipped site — not as a placeholder, not in a build preview, nothing. It's included here only as a mood/composition reference for what a "pour into cup" shot should feel like when the real footage is shot (see Section 4). Claude Code should not read this file into any component. |

---

## 3. Design Token System

### 3.1 Color — 5 named values

| Token | Hex | Role |
|---|---|---|
| **Aubergine Ink** | `#6C4749` | Primary — logo, headlines on light surfaces, primary buttons (packaging color) |
| **Sand Paper** | `#E0BFA1` | Secondary — page backgrounds, section surfaces (packaging label color) |
| **Deep Cacao Night** | `#2A1719` | Dark surface — hero background, footer, retreat/night sections |
| **Warm Ivory** | `#F6EEE3` | Light surface — one shade lighter than Sand Paper, for cards/panels layered on top of Sand Paper |
| **Gilded Gold** | `#B8935B` | Accent only — hairline rules, logo linework, small CTAs, active states. Never used as a fill. |

**Rule:** max 3 tokens per section. Dark sections = Deep Cacao Night + Sand
Paper text + Gold accent. Light sections = Sand Paper/Ivory + Aubergine text
+ Gold accent.

### 3.2 Typography — 2 typefaces only

- **Gilda Display** — headlines, pull quotes, single-word section openers
  ("Beyond." / "Elevate." / "Origin."). Large and rare only — never body
  size, max 2–3 instances visible on screen at once.
- **Marcellus** — everything else (body, nav, buttons, eyebrows, captions,
  form labels). Hierarchy is built by varying size/tracking/case, not by
  adding a third face.

| Role | Face | Treatment |
|---|---|---|
| Eyebrow / label | Marcellus | 12–13px, small caps, +0.15em tracking, Gold |
| H1 (hero) | Gilda Display | 64–96px desktop / 40–48px mobile |
| H2 (section) | Gilda Display | 40–56px |
| H3 (subsection) | Marcellus | 20–24px, medium tracking |
| Body | Marcellus | 17–19px, 1.6 line-height |
| Caption / UI | Marcellus | 13–14px, +0.05em tracking |

Both faces are self-hostable Google Fonts. Use `font-display: swap` and
subset them — they're heavy display serifs and shouldn't block first paint.

### 3.3 Logo & Mark

Concept: a single radiant line-mark fusing the sun (Surya) with the crown
chakra (Sahasrara) — sun disc at center, rays doubling as a thousand-petal
crown. Fine gold linework only (1–1.5px stroke), never filled, never boxed.
**See the 🚩 flags in Section 2.1 — the current asset doesn't match this
spec yet and isn't in a format the animations need.**

- Full lockup: mark + "SURYA CACAO" wordmark in Gilda Display.
- Simplified mark: sun/crown glyph alone, for favicon + loading state +
  transition signature.
- Must read cleanly as a single-color line at 24px and as a slow-drawn
  200px+ animation.

### 3.4 Texture

Faint warm paper-grain overlay (2–4% opacity) on Sand Paper/Ivory surfaces.
No drop shadows for depth — use grain, layered surface tones, and negative
space instead.

---

## 4. Motion & Animation System

### 4.1 General rules

Motion should feel like a slow exhale, never a bounce. Long easing
(`cubic-bezier(0.22, 1, 0.36, 1)` territory), nothing under ~500ms, nothing
spring/elastic.

- **Smooth scroll** site-wide, buttery/weighted physics, not native-abrupt.
- **Scroll-triggered reveals:** text blocks fade up 8–12px on entry,
  staggered ~80ms per line. Consistent, never randomized.
- **Product imagery:** slow Ken Burns drift on static photography (2–3%
  scale over 8–10s), never a hard-static hero image.
- **Hover:** magnetic pull on primary buttons, left-to-right underline draw
  on text links, subtle 3D tilt on recipe/product cards.
- **Custom cursor (desktop only):** small ring echoing the sun mark.
- **Accessibility (non-negotiable):** full `prefers-reduced-motion`
  fallback — wipes become cross-fades, scroll-pins become static
  single-viewport sections, parallax/cursor effects disable entirely. Every
  animated element needs a non-animated, fully readable resting state.

### 4.2 🚩 Two signature ideas need reconciling before building

The design brief's signature transition device is the **gold sun-mark**
("Sunrise Reveal" — draws itself, then radial-wipes into the next page/
scroll progress). The separate animation spec below describes a **chocolate
pour** as the page's signature transition device instead (pour wipes between
sections). These are two different visual metaphors for the same job
(the site's one "wow" transition), and the brief is explicit that the
site should have **one** held idea, not several competing ones.

**Recommendation, unless you tell Claude Code otherwise:** treat the
Sunrise Reveal as the mark's identity — its load animation and its role as
the scroll-progress indicator in the nav — and treat the cacao pour as the
**section-to-section wipe transition** described in 4.3. That divides the
labor cleanly (mark = brand/identity/progress, pour = the physical
in-page transition) rather than having both compete for the same moment.
Flag this choice for Claude Code explicitly at the start of the build so it
doesn't try to implement two different full-page wipe systems.

### 4.3 The Cacao Pour System (full spec)

**Concept:** on load, chocolate pours in from the top of the viewport and
splashes at the hero's base — pinned, plays once, scroll-scrubbed like an
Apple product-page hero. From there, the pour becomes the transition
mechanism between sections: as the visitor scrolls from Section N into
Section N+1, chocolate flows across the screen and its trailing edge
uncovers the next section underneath, so each section feels *poured into
place* rather than faded or slid in. On the final section, the chocolate
settles — pools into a textured background element or recedes off-screen.

This is two different animation jobs using two different techniques:

| Moment | Technique | Why |
|---|---|---|
| Hero pour + splash (plays once, full detail) | Scroll-scrubbed **video** | No transparency needed — it *is* the background. Video is far lighter than a frame sequence at this length. |
| Section-boundary wipe (repeats, needs to composite over content) | Scroll-scrubbed **alpha frame sequence** on `<canvas>` | Video can't do a convincing transparent overlay in most browsers; the reveal-wipe needs real alpha per frame. |

**Scroll storyboard**
- **0–100vh, Hero (pinned):** pour begins top-frame, thickens, splashes at
  the bottom. Scroll position maps directly to `video.currentTime` — this is
  a scrubber, not autoplay. Section unpins once the pour completes.
- **Each section boundary (~40–60vh "wipe zone"):** as the zone enters the
  viewport, the alpha frame sequence plays forward tied to scroll progress
  through that zone (0% = frame 1, 100% = last frame). Section N+1 is
  revealed underneath as the chocolate sweeps across — via the sequence's
  own transparency, or a clip-path/canvas mask driven by the same progress
  value if the footage lacks a clean alpha edge.
- **Final section:** pour recedes or settles into a static pooled-chocolate
  background texture. No further scroll-linked pour after this point.

**Mechanics**
- GSAP + ScrollTrigger for all pinning/scrubbing.
- Hero video: bind `scrollTrigger.progress` (0–1) to `video.currentTime`
  (0–duration). Never call `.play()` — set `currentTime` directly so it's
  fully scroll-driven.
- Wipe sequences: preload frames into an array of `Image` objects, draw the
  current frame to `<canvas>` per scroll tick via
  `Math.floor(progress * (frameCount - 1))`, gated by
  `requestAnimationFrame` so it never draws more than once per paint.
- Lightly lerp/damp the raw scroll value so fast scrolls don't skip frames,
  while staying responsive (not laggy).

**Footage specs (to shoot — none of the current photography is usable
footage; see Section 8)**

*Hero pour + splash (video, no transparency needed):*
- One continuous shot: pour begins → thickens → splashes into a pool.
- 24–30fps, 1920×1080 minimum (4K preferred, downscale from there).
- Export both `.mp4` (H.264) and `.webm` (VP9); feature-detect and pick one.
- Shoot against a clean, consistent solid backdrop — pick the color before
  the shoot (needs to color-match into the hero).

*Section wipe transitions (frame sequence, needs alpha):*
- Shot against a keyable green/blue screen, OR pre-keyed and exported with
  transparency already baked in.
- ~15–30 frames per wipe — one clip can be reused/mirrored across multiple
  section boundaries, no need for unique footage per boundary.
- Export as WebP sequence (`wipe-frame-0001.webp` … `wipe-frame-0030.webp`)
  for size, PNG as fallback.

Place footage in `/assets/cacao-motion/` (create this folder once footage
exists) using that numeric naming so frame-loading code can index them
directly.

**Build requirements**
1. Detect the existing stack (or scaffold vanilla JS + GSAP if this is a
   fresh project — lightest, most reliable for scroll-scrubbing) and note
   the choice in a comment at the top of the main animation file.
2. Install GSAP + ScrollTrigger.
3. `HeroPour` — pinned, scroll-scrubbed video, unpins on completion.
4. `PourWipe` — reusable canvas-based scroll-scrubbed frame sequence,
   wrapping each section boundary.
5. One shared helper: scroll-progress-within-an-element → 0–1 float, reused
   by both the hero and every wipe.
6. **Preloading:** don't block first paint on all frames. Hero shows
   immediately; lazy-load each wipe's frames via `IntersectionObserver`
   shortly before that section enters view, with a brand-colored
   placeholder while loading.
7. **Performance:** animate only `transform`/`opacity`/canvas draws (nothing
   layout-triggering), throttle to `requestAnimationFrame`, use
   `will-change` sparingly on actively-animating elements only.
8. **Mobile:** hero → swap for a shorter, lower-res *looped, normally
   playing* video instead of scrub-linked. Wipes → keep scrubbing but
   reduce frame count/resolution. (Deviate only with a documented reason.)
9. **Accessibility:** `prefers-reduced-motion` skips pour/wipe entirely,
   falls back to simple opacity fades. Never trap scroll (no infinite pin).
10. **Fallback:** if video/canvas fails to load, fall back to a static
    "poured chocolate" hero image and plain section fades — never a blank
    hero.

**Suggested file structure**
```
/assets/cacao-motion/
  hero-pour.mp4
  hero-pour.webm
  wipe-frame-0001.webp ... wipe-frame-0030.webp
/src (or /js)
  scrollProgress.js      // shared 0–1 progress helper
  HeroPour.[jsx|js]      // pinned hero video scrub
  PourWipe.[jsx|js]      // reusable canvas frame-sequence wipe
  main.[jsx|js]          // wires ScrollTrigger instances to each section
```

**Definition of done**
- [ ] Hero pour is fully scroll-controlled (scrubs both directions, pauses
      correctly mid-scroll)
- [ ] At least one working `PourWipe` between two real sections
- [ ] Frames/video lazy-load — no blank flash, no layout shift
- [ ] Works on mobile without janky scroll-jacking
- [ ] `prefers-reduced-motion` fallback verified
- [ ] Static fallback verified (simulate failed asset load)
- [ ] No animation logic runs on scroll outside `requestAnimationFrame`

### 4.4 The Sunrise Mark (identity + progress, per 4.2's split)

- **On first load:** the mark draws itself stroke-by-stroke (like tracing a
  mandala) before resolving into the hero. Requires the SVG flagged in 2.1.
- **As scroll progress:** the same mark's rays fill in incrementally in the
  nav as the visitor scrolls down a page.
- **Between pages** (if used as a route transition rather than the pour):
  gold sun-line draws itself center-screen, then radial-wipes to reveal the
  next page — a dawning, not a hard cut or slide.

---

## 5. Site Architecture & Page-by-Page Content

```
Surya Cacao
├── Home  (/)                          — long-scroll brand narrative
├── Shop  (/shop)                      — 150g / 300g / 500g + coming soon
├── Recipes & Rituals  (/recipes)      — signature drinks
├── Retreats  (/retreats)              — Dominican Republic sanctuary + farm
├── Partnerships  (/partnerships)      — brand collaborations + contact
└── Studio  (/studio)                  — "bring Surya to your studio" (wholesale contact)
```

**Nav** (sticky, transparent-over-hero → solid on scroll):
Mark — Recipes — Retreats — Partnerships — **Shop** (raised as a filled
Gold/Aubergine pill, since retail is the primary conversion) — Studio tucked
into footer/utility link (niche B2B audience). Shop gets a quick-view
dropdown on hover/tap showing the three bag sizes as thumbnails with price.

### 5.1 Home

**A. Hero** — full-bleed slow-drift image or looped video (steam rising off
a cup at first light). Sun/crown mark draws itself on load. Headline in
Gilda Display: *"Beyond cacao."* Subhead in Marcellus: *"A ritual,
remembered — brought together by three families, three continents, one
cup."* Primary CTA: **Shop the Ritual** → /shop. Secondary text-only: *Our
story ↓*.
→ Candidate imagery: `drinking-cacao-closeup-meadow.jpeg` or
`bag-300g-meadow-goldenhour.png`.

**B. The Ritual, Reimagined** (eyebrow: "WHY NOW") — the philosophical
core, written as a point of view, not a sales pitch. Boomers, Gen X, and
millennials are each independently reaching for the same thing from a
different direction: a way to gather and slow down without alcohol's
comedown or caffeine's spike/crash. Present as three quiet entry points into
one shared need (horizontal triptych with a light connecting/timeline
treatment, since the generational order is real) — but keep the copy about
the *shared ritual gap*, not stereotypes. Land on: cacao offers elevated
mood and steady energy without cortisol spikes or a caffeine crash — a lift
from ceremony, not stimulation.

**C. On Gatekeeping** (eyebrow: "OUR STANCE") — shorter, more declarative,
the one place the site gets a little pointed. Ceremonial cacao has become
trendy and diluted (fillers, over-processed beans, ritual sold as
aesthetic). Surya's position: quality and access aren't in tension — real
ceremonial-grade cacao should be available to everyone, not gated behind
$40 workshops or performative branding. Visually the simplest section on the
page: Deep Cacao Night background, Gold text, 1–2 Gilda Display lines, lots
of negative space.

**D. What's Actually in the Cup** — full detail in 5.2.

**E. Three Families, Three Continents** — condensed version; full detail
in 5.3.

**F. Recipes teaser** — 3-card preview of signature drinks, "See all
rituals →" to /recipes.
→ Candidate imagery: `pour-into-vintage-teacup-meadow.png`.

**G. Footer** — see 5.7.

### 5.2 What's Inside (composition section, lives on Home)

Frame as education, not a supplement label — traditional, felt effects
described gently, not clinical/medical claims. Format: the pinned
scrollytelling sequence from 4.1 (or a simplified non-pinned version on
mobile) — a fine gold line-art cacao bean opens in cross-section as the
visitor scrolls, with each compound calling out in sequence:

| Compound | Traditionally understood for |
|---|---|
| Theobromine | A gentle, steady lift — cacao's own mild stimulant, without caffeine's sharp edge |
| Magnesium | Muscle ease and a settled nervous system |
| Anandamide | The "bliss" compound — named for the Sanskrit *ananda*, joy |
| PEA (phenylethylamine) | Focus and a lightness of mood |
| Flavanols | Antioxidant support, tied to cacao's centuries-old reputation as medicine |
| Tryptophan | A building block for serotonin — the body's own calm |
| Iron | Grounding, sustained energy |

Close with: *"None of this needs decoding by a nutritionist. It's why your
body already knows what to do with a cup."*

### 5.3 Our Story — three families, three continents

Thin-gold-line world map connecting three points — **Poland, India, the
Dominican Republic** — each pausing into a portrait/vignette on scroll or
click.
- **Dominican Republic** — local, family-owned farm; every bean grown and
  harvested by hand; generational land knowledge; origin of the raw
  material.
- **Poland & India** — a Polish and an Indian family drinking cacao together
  as daily ritual for 8+ years before deciding to share it. The cultural
  cross-pollination (spice blends, ceremony structure) is a genuine point of
  difference — be specific about *what* the blend actually is (real spice
  combinations, not vague placeholders).
- Close on the throughline: not a supply-chain story, a relationship story —
  three families who already knew each other's cacao before it had a label.
- Soft CTA into Retreats: *"Meet the farm in person →"*

### 5.4 Shop (/shop)

- **Three formats** (150g / 300g / 500g) as a single elegant product block
  (not three separate cards), size selector cross-fades photography and
  counts price/weight up rather than hard-cutting. Ritual-quantity framing
  near the selector (150g = "the first pour," 500g = "the standing
  ritual").
- **Coming Soon capsule:** Vanilla Bean Cacao + Vanilla Cacao Body Butter —
  quieter, desaturated module, locked/soon state, email notify-me capture,
  no price shown.
- **Shipping:** North America and EU, stated plainly near the size selector
  (small Gold-icon line under the CTA), full detail in shipping/FAQ footer
  link.
- Product photography on Sand Paper or Ivory, warm low late-afternoon light
  — no white e-commerce lightbox backgrounds.
  → Candidate imagery: `bag-300g-studio-cream-bg.png` for the main product
  shot, `bag-300g-transparent-cutout.png` for the small size-selector
  thumbnails, `bag-300g-meadow-goldenhour.png` for mood/lifestyle framing.

### 5.5 Recipes & Rituals (/recipes)

- Horizontal drag/swipe carousel (magnetic snap) rather than a grid.
- Each card: signature drink name (Gilda Display), one-line mood/occasion
  framing instead of a category tag ("for the slow Sunday," "for the first
  cold morning"), ingredients/method in Marcellus, full-bleed image with the
  shop page's tilt-on-hover treatment.
- Include at least one "design drink" showcasing the Polish/Indian blend
  from the story section — ties the two pages together.

### 5.6 Retreats (/retreats)

- Deep Cacao Night as dominant surface — should feel like golden hour on
  the farm.
- Content: DR retreat sanctuary, a visit to the working farm as part of the
  experience, retreat structure in broad strokes (inquiry-based, not
  instant checkout).
- Primary CTA: short inquiry form or mailto — *"Tell us about the group
  you'd like to bring, and we'll help you build the retreat around it."*
  Name, email, group size/date interest, message — nothing longer.
- Photography: the farm, the land, the family — not stock wellness-retreat
  imagery. **This is real photography this brief currently doesn't have —
  see Section 8.**

### 5.7 Partnerships (/partnerships)

- Audience: brands, wellness spaces, collaborators — more peer-to-peer than
  Studio's "we'll host your class" framing.
- Content: what a Surya collaboration has looked like or could look like
  (co-branded ceremony, event cacao service, product collab) + contact
  path. Keep short: one paragraph on philosophy, a couple of illustrative
  types, a contact form/email.

### 5.8 Bring Surya Cacao to Your Studio (/studio)

- Audience: yoga studios, sauna/bathhouse spaces, wellness practitioners
  wanting Surya as a retail/event partner (wholesale-adjacent).
- Site's final page — the closing note. Single Gilda Display line closing
  the loop with the hero's opener: *"The ritual doesn't end with us."*
- Short form: studio name, location, space type (events / retail shelf /
  both), contact info.

### Footer (site-wide)

Deep Cacao Night background. Small sun/crown mark. Quick links to all six
pages. Shipping regions restated (North America & EU). Newsletter framed as
joining the ritual, not "subscribing." Understated social links — small
Gold icons only.

---

## 6. Tech Stack & Dependencies

**Suggested stack** (verbal preference — detect what's already in the repo
first and adapt; if greenfield, this is the default):
- **Framework:** Next.js (React) — routing, image optimization, easy CMS
  integration.
- **Motion:** Framer Motion for page-transition orchestration
  (`AnimatePresence` for the Sunrise Reveal) + GSAP/ScrollTrigger for the
  two pinned scrollytelling moments (cacao cross-section, family map) *and*
  the cacao-pour system in Section 4.3. Lenis for global smooth-scroll
  physics.
- **Commerce:** headless commerce (Shopify Storefront API is a strong fit)
  for shipping-zone logic (NA + EU), "coming soon" locked-product inventory,
  and size-variant switching.
- **CMS:** Sanity or Contentful for recipes, retreat copy, partnership case
  studies — non-developers can update content without a deploy.
- **Fonts:** self-host Gilda Display and Marcellus (both on Google Fonts)
  with `font-display: swap` and subsetting.

**Packages to install for the animation system specifically:** `gsap` (incl.
ScrollTrigger plugin), `framer-motion`, `lenis` (formerly `@studio-freight/lenis`).

---

## 7. Suggested Build Order

Recommended so Claude Code isn't trying to do the design system, six pages,
and two custom scroll-animation systems all at once:

1. **Scaffold + design tokens** — set up the framework, install fonts, wire
   up the 5-color/2-type token system as CSS variables/Tailwind theme so
   every later page pulls from one source of truth.
2. **Logo & nav** — static version first (using the current raster PNG),
   sticky nav with the Shop quick-view dropdown. Come back and wire the
   stroke-draw animation once the SVG (Section 2.1) exists.
3. **Home page, static** — all sections in Section 5.1–5.3, fully laid out
   and responsive, using placeholder motion (simple fades) so content and
   layout are locked before animation work starts.
4. **Remaining five pages, static** — Shop, Recipes, Retreats, Partnerships,
   Studio, same approach: layout and content first.
5. **Motion pass 1 — supporting motion** — smooth scroll (Lenis),
   scroll-triggered text reveals, hover states, Ken Burns drift on imagery.
6. **Motion pass 2 — the two scrollytelling moments** — cacao
   cross-section (5.2) and the family map (5.3).
7. **Motion pass 3 — the signature system** — build the `HeroPour` and
   `PourWipe` components per Section 4.3 once real footage exists; wire the
   Sunrise Mark draw-on/scroll-progress behavior per 4.4 once the SVG
   exists.
8. **Accessibility + fallback pass** — `prefers-reduced-motion` fallbacks,
   keyboard focus states, alt text, static-image fallback for failed
   video/canvas loads. Treat this as required, not a nice-to-have.

---

## 8. Open Items — Still Needed From Me

Flagging these so Claude Code doesn't stall on them mid-build — it should
build placeholders/stubs where noted and keep moving.

- [ ] **Logo as real SVG**, in the gold-linework style (not filled
      brown/tan), so the stroke-draw and scroll-progress animations can be
      built. Until then: static PNG, stubbed animation.
- [ ] **Actual pour footage** (hero video + wipe frame sequence) per the
      specs in Section 4.3 — nothing currently uploaded is usable footage
      (the closest is a low-res watermarked stock image, explicitly marked
      do-not-ship in `/assets/reference-mood-only/`).
- [ ] **Real farm/family photography** for Retreats and the Three Families
      story section — the brief is explicit that real photography here
      (vs. stock or AI-generated) is "the single biggest lever on
      'expensive vs. templated.'"
- [ ] **Decision on Section 4.2** — confirm the Sunrise Mark vs. cacao-pour
      role split, or tell Claude Code a different division of labor.
- [ ] **Final copy** for all page sections — this brief gives structure and
      tone direction, not final sentences (aside from the specific lines
      quoted throughout, e.g. the hero headline).
- [ ] **Recipe content** — actual signature drink names, ingredients, and
      the Polish/Indian spice-blend specifics referenced in 5.3 and 5.5
      (the design brief flags its own placeholder: "cardamom and rose
      alongside the traditional Latin American chili and cinnamon" needs to
      be swapped for the real blend).
- [ ] **Hero backdrop color** for the pour footage shoot, and a decision on
      green/blue screen vs. pre-keyed export for the wipe footage.
