import { clamp01, damp } from "./easings";

/**
 * ⚠ THE ONE SCROLL-PROGRESS IMPLEMENTATION — constraint §6.4.
 *
 * M8 SunriseMark, M9 HeroPour, M10 PourWipe, M11 Scrollytelling and the nav
 * progress ring all consume this. The plan is blunt about why: "five features,
 * one implementation. Writing a second one is the most likely way this
 * codebase rots." `npm run check` fails the build if a second file named
 * scrollProgress appears.
 *
 * Design notes:
 *
 * · ONE shared requestAnimationFrame loop for every subscriber, not one each.
 *   Constraint §6.6 — never more than one pass per paint. The loop parks
 *   itself when nothing is subscribed.
 *
 * · ⚠ In "pin" mode the OBSERVED element must NOT be the element GSAP pins.
 *   A pinned element is taken out of flow, so its rect stops moving and
 *   `documentTop` tracks scrollY exactly — progress would sit at 0 forever.
 *   Observe an outer wrapper and pin an inner child. M11 Scrollytelling and
 *   M9 HeroPour both use that two-element shape; this is why.
 *
 * · The raw value is damped toward its target so a fast scroll or a trackpad
 *   fling doesn't skip frames (constraint §6.5). Damping is frame-rate
 *   independent, so a 120Hz display doesn't settle twice as fast as a 60Hz one.
 *
 * · GSAP ScrollTrigger does the PINNING in M11. It deliberately does not
 *   supply the float, because `self.progress` would be a second source of
 *   truth for the same number. Pin and progress are computed from the same
 *   scroll range, so they stay in step.
 */

export type ProgressMode =
  /** 0 when the element's top reaches the viewport bottom, 1 when its bottom
      leaves the viewport top. For reveals, parallax and wipes. */
  | "through"
  /** 0 when the element's top reaches the viewport top, 1 after scrolling
      `distance` further. For pinned sequences and the hero pour. */
  | "pin";

export type ProgressOptions = {
  mode?: ProgressMode;
  /** Pin length in px. Required for mode "pin". */
  distance?: number;
  /** Damping strength. Higher settles faster. 0 disables smoothing. */
  lerp?: number;
  /** Called with 0–1 whenever the damped value moves. */
  onChange: (progress: number) => void;
};

type Subscriber = {
  element: HTMLElement;
  options: Required<Omit<ProgressOptions, "onChange">> & {
    onChange: (p: number) => void;
  };
  current: number;
  settled: boolean;
};

const subscribers = new Set<Subscriber>();
let rafId: number | null = null;
let lastTime = 0;

/** Absolute document offset of an element, independent of current scroll. */
function documentTop(el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  return rect.top + window.scrollY;
}

function rawProgress(sub: Subscriber): number {
  const { element, options } = sub;
  const viewport = window.innerHeight;
  const top = documentTop(element);
  const scroll = window.scrollY;

  if (options.mode === "pin") {
    const distance = options.distance || viewport;
    return clamp01((scroll - top) / distance);
  }

  // "through": spans the element's full pass across the viewport.
  const height = element.offsetHeight;
  const start = top - viewport;
  const end = top + height;
  return clamp01((scroll - start) / (end - start));
}

function tick(now: number) {
  const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.1) : 1 / 60;
  lastTime = now;

  for (const sub of subscribers) {
    const target = rawProgress(sub);
    const { lerp, onChange } = sub.options;

    const next =
      lerp <= 0 ? target : damp(sub.current, target, lerp * 60, delta);

    // Snap once we're within a pixel-ish of the target, so the loop can go
    // quiet instead of asymptotically approaching forever.
    const settled = Math.abs(target - next) < 0.0005;
    const value = settled ? target : next;

    if (value !== sub.current || !sub.settled) {
      sub.current = value;
      sub.settled = settled;
      onChange(value);
    }
  }

  rafId = subscribers.size > 0 ? requestAnimationFrame(tick) : null;
}

function start() {
  if (rafId === null) {
    lastTime = 0;
    rafId = requestAnimationFrame(tick);
  }
}

/**
 * Subscribe an element to scroll progress. Returns an unsubscribe function.
 *
 * Emits once synchronously on subscribe so a consumer paints its correct
 * resting state before any scrolling happens — no flash of frame zero.
 */
export function observeScrollProgress(
  element: HTMLElement,
  { mode = "through", distance = 0, lerp = 0.12, onChange }: ProgressOptions,
): () => void {
  const sub: Subscriber = {
    element,
    options: { mode, distance, lerp, onChange },
    current: 0,
    settled: false,
  };

  sub.current = rawProgress(sub);
  onChange(sub.current);

  subscribers.add(sub);
  start();

  return () => {
    subscribers.delete(sub);
    if (subscribers.size === 0 && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
}

/** One-shot read, for anything that needs a value without subscribing. */
export function readScrollProgress(
  element: HTMLElement,
  options: Omit<ProgressOptions, "onChange"> = {},
): number {
  return rawProgress({
    element,
    options: {
      mode: options.mode ?? "through",
      distance: options.distance ?? 0,
      lerp: options.lerp ?? 0,
      onChange: () => {},
    },
    current: 0,
    settled: false,
  });
}
