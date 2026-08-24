import { announcement } from "@content/announcement";

/**
 * The announcement bar. Fixed directly below the header, on every page,
 * always solid — unlike the header it never goes transparent, because it
 * carries no imagery behind it to read against.
 *
 * Sand Paper ground + Aubergine text is the light-section recipe from
 * tokens.css; Gilda Display per the brief, sized at --text-caption rather
 * than a display size — this is persistent chrome, not a headline, and the
 * type scale's own rule reserves the display face for "large and rare."
 */
export default function Banner() {
  return (
    <div
      className="bg-sand-paper text-aubergine-ink fixed inset-x-0 z-40 flex items-center justify-center px-[var(--gutter)]"
      style={{ top: "var(--header-h)", height: "var(--banner-h)" }}
    >
      <p className="font-display text-caption tracking-caption text-center uppercase">
        {announcement.message}
      </p>
    </div>
  );
}
