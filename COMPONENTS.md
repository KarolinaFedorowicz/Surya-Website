# Surya Cacao — Component Conventions

Shape and interaction aren't covered by the design system, so they're decided here, once, and applied to every primitive. Color and type are never decided here — they come from [`src/styles/tokens.css`](src/styles/tokens.css).

Interaction follows the motion spec supplied as the reference: motion reads as a slow exhale, never a bounce. Implementation lives in [`src/styles/motion.css`](src/styles/motion.css).

## Shape

| Decision | Value | Why |
|---|---|---|
| Corner radius | **0px, everywhere** | Both faces are high-contrast serifs and the packaging label is a rectangle. Rounded corners would soften the one thing carrying the brand's formality. One radius, no scale — there is no element type here that earns an exception. |
| Border | 1px gold hairline | The only permitted appearance of gold on a light surface. Structural on the Ivory panel, which is otherwise invisible at 1.50:1. |
| Section rhythm | `--space-section` (80–152px fluid) | The editorial feel from the reference comes from vertical air, not color. |
| Text measure | `--measure: 46ch` | Body copy never runs wider, on any surface. |

## Interaction

| Element | Behaviour |
|---|---|
| Easing | `cubic-bezier(0.22, 1, 0.36, 1)` — long tail, no overshoot |
| Duration | 520ms hover, 720ms reveal. Nothing under 500ms. |
| Buttons | Magnetic pull toward the cursor, capped at **6px** |
| Text links | Underline draws left to right (`.link-draw`) |
| Cards | 3D tilt, capped at **4deg** — reads as weight, not gimmick |
| Reveals | Fade up 10px on entry, **80ms** stagger by index, fires once |
| Imagery | Ken Burns drift, 3% over 9s (`.ken-burns`) |
| Focus | 2px gold outline, 3px offset — **immediate, never animated** |

**Stated exception:** focus rings ignore the 500ms floor. A focus indicator that fades in is an accessibility defect, so it appears instantly. Everything else obeys the spec.

**Reduced motion:** `prefers-reduced-motion: reduce` disables every transform — magnetic pull, tilt, drift, parallax — and reduces reveals to a 200ms cross-fade. Every animated element has a fully readable, non-animated resting state; the reveal CSS rests *visible*, so content is legible even if JS never runs.

## Consolidations from the step-3 re-run

Three duplications were found and removed once content became real:

1. **Disabled CTA built twice** — inline in both `Product` and `JoinTheTribe`. Now one code path inside `Button`.
2. **Join our Tribe's disabled branch was dead code** — unreachable since the WhatsApp link landed. Removed.
3. **The form's submit button redeclared Button's shape** — `px-8 py-4` existed in two places. Now exactly one, in `buttonBase`.

## Primitives — each built once

- `ui/Button` — two variants (primary, ghost), an `onDark` pairing, magnetic hover, and the **"destination not decided yet"** state. A CTA with an empty `href` renders as a disabled control here rather than each section hand-rolling its own. `buttonBase` / `buttonSkin` are exported so a real `<button>` (the form submit, which can't be a link) shares the same shape instead of redeclaring it.
- `ui/Eyebrow` — Aubergine on light, gold on dark (see the contrast note in DESIGN_SYSTEM.md)
- `ui/Divider` — the gold hairline
- `ui/Reveal` — scroll-triggered fade-up with stagger
- `ui/TiltCard` — 3D tilt, used on the product panel
- `layout/Section` — owns the two surface recipes and the anchor id
- `layout/Container` — max-width and gutters

**Not built: a Ken Burns image primitive.** The CSS convention exists, but no component wraps it, because there are no photographs to wrap. Building an image component with nothing to put in it would be dead code pretending to be progress.

---

# Gaps found during the build

Nothing below was filled in with a stand-in. This list is the stage working correctly.

## Missing assets

| Section | Needs | Status |
|---|---|---|
| 1. Hero | One contained portrait-crop image beside the type | **No photo.** Renders type-only, single column. |
| 3. From Tree to Cup | Full-bleed 2–3 image sequence from Samaná | **No origin photography.** Type-only. No stock cacao imagery substituted. |
| 4. Ritual Steps | Three images, one per step | **None.** Renders as numbered type — deliberately not icons, which would read as a supplement brand. |
| 5. Three Families | Three portraits | **None.** |
| 6. Product | Transparent packshot on the Ivory panel | **Not yet in `public/assets/photos/`.** The file exists on your Desktop but hasn't been moved in or rights-confirmed. |

Logos are in place and used by nothing yet — the header is the next stage's job.

## Missing content

| Field | Section | Effect |
|---|---|---|
| `product.primaryCta.href` / `secondaryCta.href` | 6 | Both render **disabled** — Shopify store not shared yet. The only thing stopping the site taking money. |
| Policies | 9 | Shipping, return and privacy still unwritten |
| Retreat locations | /retreats | The page takes bookings but never says *where*. No dates or pricing either. |
| SMTP credentials | /retreats | Form is built and validated; delivery needs `.env.local`. Untested end to end. |

Closed since the first pass: Join our Tribe destination, Section 5 headline, shipping timeline, shop copy, contact email, socials, legal name and year, testimonials (section pulled), production detail (dropped).

---

# Persistent chrome (step 4)

**Header** — fixed, transparent over the hero, resolving to a Sand Paper bar with a gold hairline past 24px of scroll, on the same 520ms easing as everything else. Sun mark plus "Surya"; the mark already carries "CEREMONIAL CACAO", so the header doesn't repeat it.

**`ui/LogoMark`** — the SVG drawn as a CSS mask, so it takes `currentColor` like a glyph: Aubergine in the header, gold in the footer. An `<img>` would ignore the surrounding token and inlining the path would add ~10KB to every page.

**`buttonSize`** — the header CTA needed a smaller box than the 12rem page buttons. Added as a **size on the existing primitive**, not a nav-specific button: shape, border, easing and hover are identical, only padding and the minimum width differ.

**`--header-h: 5rem`** — new layout token. Sections with an id get `scroll-margin-top` from it so anchor jumps clear the fixed bar. Verified: all three anchors land 16px below the header.

**Footer** — dark recipe, which is the one surface where gold clears AA as lettering (5.96:1). Identity, site links, socials, then the legal line.

## Still not built, deliberately

- **Custom cursor** (a ring echoing the sun mark). This stage's scope boundary forbids introducing interaction patterns Components didn't establish, and Components didn't build it. It's in your motion spec, so it's a real outstanding item — just not one this stage was allowed to add. Say the word and it's a small addition.
- The motion spec's **scroll-pins and wipes** — no section calls for either yet.
