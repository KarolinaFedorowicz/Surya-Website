// L7 — SkipLink. SURYA_CACAO_BUILD_PLAN.md §3.3
/**
 * First focusable element on every page.
 *
 * Deliberately NOT `sr-only` + `focus:not-sr-only`: `not-sr-only` resets
 * `padding: 0`, which lands after `px-6` in Tailwind's utility order and
 * collapses the pill so its label overflows on both sides. Translating a
 * fully-styled element off-screen has no such conflict, keeps it in the tab
 * order, and gives the reveal a real transition.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      data-tone="sand"
      className="bg-surface text-ink border-accent fixed top-4 left-4 z-[100] -translate-y-[200%] rounded-full border px-6 py-3 font-body text-caption uppercase tracking-[0.12em] whitespace-nowrap [font-variant-caps:all-small-caps] transition-transform duration-[600ms] ease-surya focus:translate-y-0"
    >
      Skip to content
    </a>
  );
}
