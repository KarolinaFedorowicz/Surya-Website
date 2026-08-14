// L6 — SocialLinks. SURYA_CACAO_BUILD_PLAN.md §3.3
import { SOCIAL_LINKS } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Small gold icons only. Understated — plan L4/L6.
 *
 * Icons are inline single-path SVGs at `currentColor` rather than an icon
 * package: three glyphs don't justify a dependency, and `currentColor` keeps
 * them inside the tone system. Drawn as strokes to match the brand's linework.
 */
const ICONS: Record<string, React.ReactNode> = {
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </>
  ),
  TikTok: (
    <path d="M14 4v9.5a3.5 3.5 0 1 1-3.5-3.5M14 4c.4 2.2 1.9 3.7 4.2 3.9M14 4h.2" />
  ),
  LinkedIn: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7.5 10.5v6M7.5 7.6v.1M11.5 16.5v-6M11.5 13c0-1.4.9-2.5 2.4-2.5s2.6.9 2.6 2.8v3.2" />
    </>
  ),
};

export function SocialLinks({ className }: { className?: string }) {
  if (SOCIAL_LINKS.length === 0) return null;

  return (
    <ul className={cn("flex items-center gap-5", className)}>
      {SOCIAL_LINKS.map((s) => (
        <li key={s.label}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-ink block transition-colors duration-[600ms] ease-surya"
          >
            <span className="sr-only">{`${s.label} — opens in a new tab`}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {ICONS[s.label]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
