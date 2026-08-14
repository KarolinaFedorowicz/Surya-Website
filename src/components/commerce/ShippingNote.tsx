// C11 — ShippingNote. SURYA_CACAO_BUILD_PLAN.md §3.4
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";

/** "North America & EU" — a small gold-icon line under the CTA. brief §5.4 */
export function ShippingNote({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "text-muted font-body text-caption flex items-center gap-2",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="text-accent size-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
      </svg>
      Ships to {SITE.shippingRegions.join(" and the ")}
    </p>
  );
}
