/**
 * Site configuration — nav as data, not markup (plan §2, constraint §6.12).
 *
 * Phase 2 hook from the plan: "adding /locations when the café opens is a
 * one-line change." That line is in NAV_LINKS below.
 */

export type NavLink = {
  href: string;
  label: string;
  /** Rendered as the raised pill rather than an inline link. */
  emphasis?: boolean;
};

export const SITE = {
  name: "Surya Cacao",
  url: "https://suryacenters.com",
  description:
    "Beyond cacao — a return to ritual, shared by three families across three continents.",
  /** brief §5.7 / plan L4 — restated in the footer and beside the size selector. */
  shippingRegions: ["North America", "European Union"],
  /** WhatsApp community invite — Hero's "Join Our Tribe" and the footer's "Join our community". */
  communityUrl: "https://chat.whatsapp.com/IjnBldAGXf44oLGeLW4DFQ",
  /** Every /contact inquiry, regardless of type, delivers here. */
  contactEmail: "karolina.f.cacao@gmail.com",
} as const;

/**
 * Nav per the copy source's "Global Navigation" block:
 * Home | Shop | Retreats | About Us | Recipes.
 *
 * Two things this changed, both deliberate:
 *
 * - "About Us" points at /story rather than a new route or a Home anchor. The
 *   copy source offered the anchor option, but /story is already a built page
 *   carrying the three-families narrative the label promises; pointing a nav
 *   item at an anchor while a fuller page sits unlinked would bury it.
 * - /partnerships left the nav and is reached from the footer's "Bring Our
 *   Cacao to Your Studio" contact route instead. The route itself is untouched.
 *
 * Shop keeps `emphasis`, so L1 renders it as the ShopDropdown pill at the end
 * of the bar rather than inline in second position. The pill is the primary
 * conversion and its dropdown is what carries the 150/300/500g breakdown.
 */
export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/retreats", label: "Retreats" },
  { href: "/story", label: "About Us" },
  { href: "/recipes", label: "Recipes" },
  // Phase 2 (café): { href: "/locations", label: "Locations" },
  { href: "/shop", label: "Shop", emphasis: true },
];

/** Footer-only. Legal never appears in the main nav — plan §2. */
export const LEGAL_LINKS: NavLink[] = [
  { href: "/shipping", label: "Shipping" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export type SocialLink = { label: string; href: string };

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Instagram", href: "https://www.instagram.com/karolinakaylani/" },
  { label: "TikTok", href: "https://www.tiktok.com/@suryacenters" },
  {
    label: "LinkedIn",
    // Normalized to the company root — the supplied URL carried a feed filter.
    href: "https://www.linkedin.com/company/surya-centers-cacao/",
  },
];

/**
 * L4 footer's Contact block — the copy source's spec is one link to one
 * unified form (/contact), whose inquiry-type dropdown replaces the five
 * separate routes this used to fan out to.
 */
export const CONTACT_LINK: NavLink = { href: "/contact", label: "Contact" };

/**
 * Routes whose hero is a dark, full-bleed surface, so the nav can sit
 * transparent over it until the visitor scrolls. Every other route gets a
 * solid nav from the first paint — a transparent nav over Sand Paper would be
 * unreadable. Phase 4 adds routes here as their heroes are built.
 */
/**
 * Routes whose FIRST section is a dark hero that pads past the nav itself.
 * Only these get a transparent overlay nav; everywhere else it is solid from
 * first paint and reserves its own height, because a transparent nav over Sand
 * Paper is unreadable.
 *
 * A trailing slash means "this prefix", which is how dynamic routes are
 * covered: "/recipes/" matches a recipe detail (dark hero) but NOT the
 * "/recipes" index (sand carousel). Same trick keeps "/shop" overlaying while
 * "/shop/[handle]" does not.
 */
const OVERLAY_ROUTES = [
  "/",
  "/story",
  "/shop",
  "/retreats",
  "/partnerships",
  "/recipes/",
];

export function isOverlayRoute(pathname: string): boolean {
  return OVERLAY_ROUTES.some((r) =>
    r.endsWith("/") && r !== "/" ? pathname.startsWith(r) : pathname === r,
  );
}

/** L4 Footer's closing line — inherited from the dropped /studio page. */
export const CLOSING_LINE = "The ritual doesn't end with us.";
