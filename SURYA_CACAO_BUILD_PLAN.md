# Surya Cacao — Build Plan & Component Inventory

**Phase 1 scope:** DTC online \+ wellness third-space partnerships. Café model (Phase 2\) is out of scope but must not require a rebuild.

**Status:** architecture decided, brief written, nothing built. **Blocking items:** 4 assets, 2 decisions. See §6.

---

## 1\. Where the effort actually goes

Rough distribution across the whole build, so expectations are calibrated:

| Layer | Share of effort | Why |
| :---- | :---- | :---- |
| Design system (primitives) | 15% | Small, but everything downstream depends on it |
| Page sections | 30% | The largest surface, mostly layout \+ content |
| Motion system | 30% | Two custom scroll systems — this is the differentiator and the risk |
| Commerce | 15% | Mostly wiring borrowed plumbing to custom UI |
| Accessibility \+ fallbacks | 10% | Non-negotiable, and cheap only if built in from Phase 1 |

The uncomfortable number is motion at 30%. If the pour system gets cut, this becomes a five-week build instead of an eight-week one. Worth knowing before you commit to the shoot.

---

## 2\. Site structure

```
Surya Cacao
│
├── /                        Home — long-scroll brand narrative
├── /story                   Three families, three continents
├── /shop                    150g · 300g · 500g + coming-soon capsule
│   └── /shop/[handle]       Product detail
├── /recipes                 Signature drinks — drag carousel
│   └── /recipes/[slug]      Recipe detail
├── /retreats                DR sanctuary + working farm — inquiry
├── /partnerships            Brands, wellness spaces, studios — inquiry
│
└── (legal)                  No URL segment, footer-linked only
    ├── /shipping
    ├── /faq
    ├── /privacy
    └── /terms
```

**Dropped for v1:** `/studio`. Its audience (yoga studios, bathhouses, practitioners) becomes a collaboration-type option inside the Partnerships inquiry form. Its closing line — *"The ritual doesn't end with us."* — moves to the footer, above the newsletter block, where it bookends the hero's *"Beyond cacao."*

**Added for v1:** `/story`. In DTC, origin is the conversion mechanism, not decoration. A partnerships buyer reads it before the product page, it's the only brand content that can rank or be linked in press, and Retreats depends on it emotionally. A section buried at 60% scroll on Home does none of that.

**Navigation:** `[mark]  Story · Recipes · Retreats · Partnerships · [Shop]` Sticky, transparent over hero → solid on scroll. Shop raised as a filled pill — retail is the primary conversion. Quick-view dropdown on hover/tap showing three bag sizes with price. Legal links live in the footer only.

**Cart is a drawer, not a route.** A page navigation mid-purchase breaks the scroll continuity the entire site is built around.

**Phase 2 hook:** nav is defined as data in `config/site.ts`. Adding `/locations` when the café opens is a one-line change.

---

## 3\. Component inventory

**68 components across 7 categories.** Reusable \= built once, used everywhere. Unique \= built once, used once.

### 3.1 Primitives — the design system (14, all reusable)

Nothing else in the codebase defines a color, a font, or a spacing value.

| \# | Component | What it does | Blocked by |
| :---- | :---- | :---- | :---- |
| P1 | `Section` | Wraps every page block. Takes `tone="dark"|"sand"|"ivory"` and emits the correct 3-token color combination \+ consistent vertical rhythm. **This is how the "max 3 colors per section" rule becomes enforceable.** | — |
| P2 | `Display` | Gilda Display headlines. 64–96px desktop → 40–48px mobile. Deliberately restrictive — cannot render at body size. | — |
| P3 | `Eyebrow` | Small gold label above headlines ("WHY NOW", "OUR STANCE"). 12–13px, small caps, \+0.15em tracking. | — |
| P4 | `Prose` | Body copy container. Marcellus 17–19px, 1.6 line-height, capped reading width. Also renders MDX output. | — |
| P5 | `Button` | Primary (filled aubergine/gold) \+ secondary (text-only). Padding, hover, focus ring. Magnetic hover comes from wrapping, not from inside. | — |
| P6 | `TextLink` | Inline link with left-to-right underline draw. | — |
| P7 | `HairlineRule` | 1px gold divider. Trivial, but appears \~20× and must be identical every time. | — |
| P8 | `GrainOverlay` | 2–4% paper texture on light surfaces. Pointer-events none, GPU-safe. Replaces drop shadows as the depth mechanism. | Grain texture PNG |
| P9 | `Frame` | Art-directed image wrapper — aspect ratio, Next/Image config, warm placeholder blur, no white lightbox backgrounds. | — |
| P10 | `Field` | Label \+ error \+ required state. Wraps any control. | — |
| P11 | `Input` | Single-line text control. | — |
| P12 | `Textarea` | Multi-line control. | — |
| P13 | `Select` | Dropdown — used for space type, group size. | — |
| P14 | `Pill` | Small gold/aubergine tag. Coming-soon state, shipping region, recipe mood. | — |

### 3.2 Motion (13, all reusable)

**Hard rule: nothing outside this folder imports GSAP or Framer Motion.** Each component owns its own `prefers-reduced-motion` fallback internally. This is the single decision that keeps accessibility from becoming a rewrite in week eight.

| \# | Component | What it does | Blocked by |
| :---- | :---- | :---- | :---- |
| M1 | `SmoothScroll` | Lenis provider. Weighted scroll physics site-wide. | — |
| M2 | `Reveal` | Fade up 8–12px on entry. `stagger` prop for \~80ms per-line sequencing. The workhorse — used \~80× across the site. | — |
| M3 | `KenBurns` | 2–3% scale drift over 8–10s on static photography. No hero image is ever hard-static. | — |
| M4 | `MagneticButton` | Cursor-pull on primary CTAs. Wraps `Button`. | — |
| M5 | `UnderlineLink` | Left-to-right underline draw. Wraps `TextLink`. | — |
| M6 | `TiltCard` | Subtle 3D tilt. Shared by recipe cards and product cards. | — |
| M7 | `CustomCursor` | Small ring echoing the sun mark. Desktop only — gated behind `useIsTouch`. | Logo SVG |
| M8 | `SunriseMark` | The gold mark, stroke-drawing itself on load. Doubles as the nav scroll-progress indicator (rays fill in as you descend). | ⛔ Logo SVG |
| M9 | `HeroPour` | Pinned, scroll-scrubbed pour video. `scrollTrigger.progress` → `video.currentTime`. **Never calls `.play()`.** | ⛔ Footage |
| M10 | `PourWipe` | Canvas alpha frame sequence. Chocolate sweeps across a section boundary, revealing the next section underneath. Reused at every boundary. | ⛔ Frame sequence |
| M11 | `Scrollytelling` | Shared pin \+ scrub wrapper. Serves both the cacao cross-section and the family map. | — |
| M12 | `PageTransition` | Framer `AnimatePresence` route transitions. | — |
| M13 | `ReducedMotionProvider` | Single source of truth for the motion preference. Every M-component reads from it. | — |

**Plus one shared function, not a component:** `lib/motion/scrollProgress.ts` — element → 0–1 float. Consumed by M8, M9, M10, M11, and the nav progress ring. Five features, one implementation. Writing a second one is the most likely way this codebase rots.

### 3.3 Layout & chrome (9, all reusable)

| \# | Component | What it does | Blocked by |
| :---- | :---- | :---- | :---- |
| L1 | `Nav` | Sticky, transparent → solid on scroll. Houses the progress mark. | — |
| L2 | `ShopDropdown` | Quick-view: three bag sizes, thumbnails, price. | Product photography |
| L3 | `MobileMenu` | Full-screen overlay. Gold linework, generous spacing. | — |
| L4 | `Footer` | Deep Cacao Night. Mark, six links, shipping regions restated, closing line. | — |
| L5 | `Newsletter` | Framed as *joining the ritual*, never "subscribe". | — |
| L6 | `SocialLinks` | Small gold icons only. Understated. | — |
| L7 | `SkipLink` | Keyboard accessibility. First focusable element. | — |
| L8 | `Container` | Max-width \+ responsive gutters. | — |
| L9 | `SeoHead` | Per-page metadata, OG tags, JSON-LD product schema. | OG image |

### 3.4 Commerce (11)

The plumbing is borrowed from `vercel/commerce`. Every component below is custom-built against it.

| \# | Component | Type | What it does | Blocked by |
| :---- | :---- | :---- | :---- | :---- |
| C1 | `ProductBlock` | Reusable | The three sizes as **one elegant block**, not three cards. | Product photography |
| C2 | `SizeSelector` | Reusable | 150g / 300g / 500g. Cross-fades photography rather than hard-cutting. | — |
| C3 | `PriceCounter` | Reusable | Price and weight count up on size change. Never a hard swap. | — |
| C4 | `RitualQuantity` | Reusable | Framing beside the selector — 150g \= "the first pour", 500g \= "the standing ritual". | — |
| C5 | `AddToCart` | Reusable | Optimistic update, loading state, error state. | — |
| C6 | `CartDrawer` | Reusable | Slides over. Redirects to `cart.checkoutUrl` on checkout. | — |
| C7 | `CartLineItem` | Reusable | Thumbnail, quantity stepper, remove. | — |
| C8 | `CartSummary` | Reusable | Subtotal, shipping note, checkout CTA. | — |
| C9 | `ComingSoonCapsule` | Unique | Vanilla Bean Cacao \+ Body Butter. Desaturated, locked, no price. | — |
| C10 | `NotifyMeForm` | Reusable | Email capture for locked products. | — |
| C11 | `ShippingNote` | Reusable | "North America & EU" — small gold-icon line under the CTA. | — |

### 3.5 Page sections (18, mostly unique)

These are the pages. Each composes primitives \+ motion \+ content.

| \# | Component | Page | What it is | Blocked by |
| :---- | :---- | :---- | :---- | :---- |
| S1 | `Hero` | Home | Full-bleed. Mark draws on load. *"Beyond cacao."* | ⛔ Footage, ⛔ SVG |
| S2 | `RitualReimagined` | Home | Eyebrow "WHY NOW". Three generations reaching for the same thing from different directions. Horizontal triptych with a light connecting treatment. | Final copy |
| S3 | `OnGatekeeping` | Home | Eyebrow "OUR STANCE". The one pointed section. Deep Cacao Night, gold text, 1–2 Gilda lines, heavy negative space. **The simplest section on the site.** | Final copy |
| S4 | `WhatsInside` | Home | Pinned scrollytelling. Gold line-art bean opens in cross-section; seven compounds call out in sequence. | ⛔ Bean line art |
| S5 | `FamiliesTeaser` | Home | Condensed three-families block → *"Read our story →"* | Family photography |
| S6 | `RecipesTeaser` | Home | Three-card preview → `/recipes` | Recipe content |
| S7 | `StoryHero` | Story | Page opener. | — |
| S8 | `FamilyMap` | Story | Thin gold-line world map. Poland · India · Dominican Republic. Each point pauses into a vignette on scroll. | ⛔ Map SVG |
| S9 | `FamilyVignette` | Story | **Reusable ×3.** Portrait \+ narrative per family. | ⛔ Family photography |
| S10 | `StoryThroughline` | Story | The close: not a supply-chain story, a relationship story. Soft CTA → Retreats. | Final copy |
| S11 | `ShopHero` | Shop | Product-forward opener. | Product photography |
| S12 | `RecipeCarousel` | Recipes | Horizontal drag/swipe, magnetic snap. Not a grid. | Recipe content |
| S13 | `RecipeCard` | Recipes | **Reusable.** Name in Gilda, mood line instead of a category tag, full-bleed image, tilt on hover. | Recipe content |
| S14 | `RecipeDetail` | Recipes | Ingredients \+ method. | Recipe content |
| S15 | `RetreatHero` | Retreats | Deep Cacao Night dominant. Should feel like golden hour on the farm. | ⛔ Farm photography |
| S16 | `RetreatStructure` | Retreats | Broad strokes — inquiry-based, not instant checkout. | Final copy |
| S17 | `PartnershipTypes` | Partnerships | Co-branded ceremony · event service · product collab · **studio stocking** (absorbed from the dropped page). | Final copy |
| S18 | `InquiryForm` | Both | **One component, config-driven.** Retreats and Partnerships pass different field sets and copy. | — |

### 3.6 Content types (3 — data, not components)

| \# | Type | Fields | Feeds | Blocked by |
| :---- | :---- | :---- | :---- | :---- |
| CT1 | Recipe | title, mood, ingredients\[\], method\[\], image, featured | S12, S13, S14, S6 | ⛔ Real recipes \+ spice blend |
| CT2 | Family | country, coordinates\[lat,lng\], portrait, narrative | S8, S9, S5 | ⛔ Photography |
| CT3 | Page copy | MDX per page section | S2, S3, S10, S16, S17 | ⛔ Final copy |

`coordinates` is what drives the map waypoints — the reason families can't share a folder with recipes. Different shape, different rendering, and TypeScript can only catch a missing field if each type has its own schema.

### 3.7 Brand assets (12)

| \# | Asset | Status | Note |
| :---- | :---- | :---- | :---- |
| A1 | Logo SVG, gold linework | ⛔ **Missing** | Current file is a 513×487 raster PNG in solid brown/tan. Stroke animation needs real `<path>` data — a flattened PNG cannot be stroke-animated. **Blocks M8, M7, and the whole identity system.** |
| A2 | Wordmark lockup | ⛔ Missing | Mark \+ "SURYA CACAO" in Gilda Display |
| A3 | Favicon set | ⛔ Missing | Derived from A1 |
| A4 | OG / social share image | ⛔ Missing | Derived from A1 \+ product |
| A5 | Paper grain texture | ⛔ Missing | Seamless tile, used at 2–4% |
| A6 | Cacao bean line art | ⛔ Missing | Cross-section, SVG paths — **blocks S4** |
| A7 | World map linework | ⛔ Missing | Thin gold outline, SVG — **blocks S8** |
| A8 | Hero pour footage | ⛔ Missing | mp4 \+ webm, 4K, one continuous shot, solid backdrop |
| A9 | Wipe frame sequence | ⛔ Missing | 15–30 frames, alpha, `wipe-frame-0001.webp` … |
| A10 | Product photography | ⚠️ Partial | Three files exist but are the same generated asset in different crops. Usable for pass one. |
| A11 | Lifestyle photography | ⚠️ Partial | Three meadow stills. Usable. |
| A12 | Farm & family photography | ⛔ Missing | The brief's own words: *"the single biggest lever on 'expensive vs. templated.'"* — **blocks S9, S15** |

**⛔ Do not ship:** `DO-NOT-SHIP-watermarked-stock-pour-reference.jpg` is unlicensed and watermarked. Not as a placeholder, not in a preview, nowhere.

---

## 4\. Consolidation map

Nine places where things that look distinct are the same component. Each of these is a decision that either saves a week or costs one.

| Consolidate | Into | Saves |
| :---- | :---- | :---- |
| Retreat form \+ Partnership form \+ studio stocking enquiry | **One `InquiryForm`**, config-driven | 2 near-identical components and 2 API routes |
| Recipe cards \+ product cards \+ partnership type cards | **One `TiltCard`** \+ different children | 3 hover implementations that would drift |
| Fade-up \+ stagger \+ section entry | **One `Reveal`** with a `stagger` prop | \~80 one-off animation calls |
| Cacao cross-section \+ family map | **One `Scrollytelling`** wrapper | A second pin/scrub system |
| Every wipe boundary on the site | **One `PourWipe`**, footage mirrored/reused | 4–5 separate footage shoots |
| Nav mark \+ footer mark \+ favicon \+ loading state \+ cursor | **One SVG source** (A1) | 5 assets drifting out of sync |
| Newsletter \+ notify-me \+ both inquiry forms | **Shared `Field`/`Input`/`Textarea`** | 4 sets of validation and error styling |
| Hero pour \+ wipes \+ mark progress \+ both scrollytelling moments | **One `scrollProgress()`** | The most likely source of future bugs |
| All color and type decisions | **One `globals.css`** | Every future "why is this gold slightly different" conversation |

---

## 5\. Reusable vs. unique — the honest count

| Category | Reusable | Unique | Total |
| :---- | :---- | :---- | :---- |
| Primitives | 14 | 0 | 14 |
| Motion | 13 | 0 | 13 |
| Layout & chrome | 9 | 0 | 9 |
| Commerce | 10 | 1 | 11 |
| Page sections | 3 | 15 | 18 |
| **Total** | **49** | **16** | **65** |
| Content types | — | — | 3 |
| Brand assets | — | — | 12 |

**72% reusable.** That ratio is the whole argument for building the design system in Phase 1 rather than extracting it later. Every hour spent on `Section` and `Reveal` gets paid back across 65 components.

---

## 6\. What's blocking you

Ordered by how much they hold up.

**Two decisions — free, and needed now:**

1. **Shopify store — does it exist?** If no, the build runs against a mock module with identical function signatures and swaps in one file later.  
2. **Sunrise Mark vs. cacao pour.** The brief specs both as *the* signature transition. Recommendation: mark \= identity \+ nav progress, pour \= section wipes. Confirm or override.

**Four assets — these have lead times:**

3. **Logo as real SVG, gold linework.** Highest leverage single item. Unblocks the mark animation, the cursor, the favicon, the OG image, and the entire identity layer. If your designer has the vector source, this is a 10-minute re-export.  
4. **Farm & family photography.** Blocks the two pages that carry the brand. Longest lead time — it's a trip, not a task.  
5. **Pour footage.** Blocks the signature motion. Needs the backdrop color decided *before* the shoot, and a green/blue-screen vs. pre-keyed decision for the wipes.  
6. **Line art — bean cross-section and world map.** Both SVG, both illustrator work, both block a scrollytelling moment.

**Two content items:**

7. **Final copy** for all sections.  
8. **Real recipes**, including the actual Polish/Indian spice blend. The brief flags its own placeholder — *"cardamom and rose alongside the traditional Latin American chili and cinnamon"* — as needing replacement.

**Nothing here stops the build starting.** Phases 1–7 are fully executable with placeholders. Items 3–8 gate Phase 8 and final polish.

---

## 7\. Build sequence

| Phase | Builds | Gated by |
| :---- | :---- | :---- |
| 1 | Scaffold, tokens, all 14 primitives, `/styleguide` route | — |
| 2 | Nav, Footer, MobileMenu, `config/site.ts` | — |
| 3 | MDX pipeline, all 3 content types, placeholder content | — |
| 4 | All 8 routes laid out, static, responsive. Simple fades only. | — |
| 5 | Commerce — cart drawer, size selector, checkout redirect | Shopify decision |
| 6 | Supporting motion — Lenis, Reveal, KenBurns, hovers, cursor | — |
| 7 | Scrollytelling — bean cross-section, family map | A6, A7 |
| 8 | Signature motion — HeroPour, PourWipe, SunriseMark | A1, A8, A9 |
| 9 | Accessibility, fallbacks, Lighthouse, real content swap | All content |

**Phase 1 ends with a `/styleguide` route** rendering every primitive in all three tones. That page is the cheapest possible checkpoint — it catches a wrong token system before it propagates into 65 components.

---

## 8\. Definition of done

- [ ] `/styleguide` renders all 14 primitives in all 3 tones correctly  
- [ ] Zero hardcoded hex values or font families outside `globals.css`  
- [ ] Zero GSAP or Framer imports outside `components/motion/`  
- [ ] Exactly one `scrollProgress` implementation  
- [ ] Hero pour scrubs both directions, pauses correctly mid-scroll  
- [ ] At least one working `PourWipe` between two real sections  
- [ ] Video and frames lazy-load — no blank flash, no layout shift  
- [ ] Mobile: hero swaps to short looped video; wipes scrub at reduced frames  
- [ ] `prefers-reduced-motion` verified on all 13 motion components  
- [ ] Static fallback verified by simulating a failed asset load  
- [ ] No animation logic outside `requestAnimationFrame`  
- [ ] Lighthouse: performance \> 85 mobile, accessibility \= 100  
- [ ] Watermarked reference asset appears nowhere in build output

