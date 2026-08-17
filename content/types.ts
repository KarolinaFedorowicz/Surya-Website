/**
 * Shared content primitives. Every content file in this directory exports a
 * typed object; components read from these objects and never hold copy inline.
 */

export type Cta = {
  label: string;
  href: string;
};

export type NavLink = {
  label: string;
  /** "#section-id" for an on-page anchor, "/route" for its own page. */
  href: string;
};
