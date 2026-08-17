# Surya Cacao — Design System Rationale

**Direction B, "Sand Ground"** — approved at Gate 1.
Token file: [`src/styles/tokens.css`](src/styles/tokens.css). Tailwind mapping: [`src/app/globals.css`](src/app/globals.css).

**Who this is for:** the already-converted ritualist — someone who keeps a morning practice and should come away believing this is the real thing, made by people who actually drink it. Every decision below traces to that sentence.

---

## What came from the earlier locked decisions

Carried through unchanged from the palette and type spec written before this stage:

- All five color values, exactly as specified. Nothing was added, dropped, or re-tinted.
- Gold is accent only, never a fill.
- Max three palette tokens per section.
- Sand Paper is the page ground — the packaging color, full-bleed.
- Gilda Display for headlines, Marcellus for everything else. No third face.
- Hierarchy from size, tracking and case rather than from adding weight.

## What this stage changed

Three things. None of them silently.

### 1. Eyebrows on light sections are Aubergine, not Gold

The original spec put eyebrow labels at 12–13px small caps in Gilded Gold. On Sand Paper that measures **1.65:1** and on Warm Ivory **2.48:1**, against a 4.5:1 floor. It's the smallest text on the page and would have been the least readable thing on it.

Eyebrows on light sections are now Aubergine Ink, still distinguished by size, uppercase and 0.15em tracking, and typically preceded by a gold hairline so the accent still appears — as linework rather than lettering, which is what the "never a fill" rule was already pointing at.

**Gold as text survives on dark sections only** (5.96:1 on Deep Cacao Night), which is where the eyebrow spec runs exactly as originally written.

### 2. Warm Ivory panels get a structural gold border

Warm Ivory against Sand Paper is **1.50:1** — below the threshold where an edge is visible at all. A panel defined only by its fill would not read as a panel. Panels now carry a 1px gold hairline, which is what makes them exist. This is the accent doing structural work, consistent with the original rule.

### 3. Rhythm tokens added

Spacing, measure and container width weren't in the original decisions. They're here because the reference — Vero Studio — carries its editorial feel through whitespace and a narrow text column, not through color. `--measure: 46ch` and `--space-section` are what transfer that.

## Why this direction, specifically

**What it avoids:** the high-contrast startup default — white page, near-black text, one saturated accent. Nearly every DTC wellness site resolves to that, and it reads as software. A fully tinted ground signals a physical object instead: someone holding the bag sees the same color behind the website. That's the single strongest argument for Sand Ground over the alternatives, and it's an argument about credibility, which is what the ritualist audience is judging.

**What it costs, stated plainly:** Aubergine on Sand Paper is 4.61:1 — passing AA, but the floor. Body type therefore has a hard 17px minimum, and long passages will feel weightier than on an ivory ground. The dark sections are not decorative; they're the release valve that keeps the page from becoming monotonous.

**Type:** the pairing was already locked and needs no revision. Both faces ship a single 400 weight, which is a constraint worth naming — there is no bold to reach for, so emphasis has to come from scale and space. That is what forces the discipline the "large and rare" Gilda rule was already asking for.

---

## Art direction — where images go

Photography carries the warmth in this direction, since the palette itself stays restrained. The ground is already tinted, so images should be **warm but not oversaturated**; anything cool-toned will fight the Sand Paper.

**Full-bleed** means edge to edge, breaking the container. **Contained** means inside `--container`, aligned to the text column.

| Section | Image | Why |
|---|---|---|
| **1. Hero** | One image, contained right, tall portrait crop. Type left. | Vero's asymmetry. A full-bleed hero would bury the Sand Paper ground before it's established. `surya_pack_white_portrait.png` (1600×2000) is the right shape. |
| **2. Beyond Cacao** *(dark)* | **None.** | The one text-only moment. It's a manifesto section — an image dilutes it, and the dark ground is already the visual event. |
| **3. From Tree to Cup** | Full-bleed, 2–3 image sequence. | The documentary moment: Samaná, pods, drying beds, hands. Full-bleed here is the payoff for holding back in the hero. **This is your biggest gap — you have no origin photography.** |
| **4. The Ritual, Step by Step** | Three images, one per step, equal contained columns. | Whisking, the pause, the first sip. Photography rather than icons — icons would read as a supplement brand, which is the exact thing the copy denies. |
| **5. Founder / Three Families** | Three portraits, contained, in a row. | The three-continents story is the credibility claim. Faces prove it; a stock cacao pod doesn't. Second-biggest gap. |
| **6. Product & Purchase** | Packshot on a Warm Ivory panel, contained. | `surya_pack_clean_transparent.png` on Ivory with the gold hairline. Transparent PNG is why this works — the panel becomes the product's ground. |
| **7. Community Proof** | Real customer photos, small, irregular. | Deliberately lower-fidelity than the rest. Polished testimonial photography reads as fabricated. |
| **8. Join our Tribe** *(dark)* | Optional full-bleed atmospheric behind the dark ground, heavily darkened. | Or nothing. This section is a CTA; the image must not compete with it. |
| **9. Footer** | None. | |

### What you have vs. what you need

**Have:** packshots (`surya_pack_clean_transparent.png`, `Surya_ceremonial_cacao_300g.png`, `surya_pouch_white.png`), lifestyle (`Surya Cacao cups.jpg`, `Surya_bags.jpg`, `surya cacao bag.png`). Enough for sections 1 and 6.

**Need:** origin photography from Samaná (section 3) and three family portraits (section 5). These are the two sections making the claims that distinguish Surya from any other cacao brand, and they're the two with no imagery. If neither can be shot, section 3 works as type-only over a dark ground and section 5 becomes a pull quote — but the story lands materially weaker, and it's worth knowing that before building rather than after.

**Format:** everything goes in `public/assets/photos/`. Serve AVIF/WebP through `next/image`, and give every image an explicit width and height so the Sand Paper ground doesn't flash and reflow while photography loads.
