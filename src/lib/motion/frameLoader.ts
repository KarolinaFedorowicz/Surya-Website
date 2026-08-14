/**
 * IntersectionObserver frame preloading for M10 PourWipe.
 *
 * Indexes the exact naming the brief specifies (§4.3):
 *   wipe-frame-0001.webp … wipe-frame-0030.webp
 *
 * ⛔ A9 does not exist yet. `load()` resolves with `available: false` when the
 * first frame 404s, and PourWipe falls back to its procedural stand-in. When
 * the real sequence lands, dropping the files into /assets/cacao-motion/ is
 * the whole integration — no code change.
 *
 * Constraint §4.3.6: don't block first paint on frames. Nothing is fetched
 * until the observer says the wipe zone is approaching.
 */

export type FrameSequence = {
  available: boolean;
  frames: HTMLImageElement[];
};

export type FrameLoaderOptions = {
  /** Directory the sequence lives in. */
  dir?: string;
  basename?: string;
  extension?: string;
  count?: number;
  /** Digits in the zero-padded index. `0001` is 4. */
  pad?: number;
};

export const DEFAULT_FRAMES: Required<FrameLoaderOptions> = {
  dir: "/assets/cacao-motion",
  basename: "wipe-frame",
  extension: "webp",
  count: 30,
  pad: 4,
};

export function frameUrl(index: number, options: FrameLoaderOptions = {}) {
  const o = { ...DEFAULT_FRAMES, ...options };
  return `${o.dir}/${o.basename}-${String(index).padStart(o.pad, "0")}.${o.extension}`;
}

function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/**
 * Loads the sequence. Probes frame 1 first: if it isn't there, we skip the
 * other 29 requests entirely rather than firing a wall of 404s at the network
 * panel every time someone scrolls past a wipe.
 */
export async function loadFrames(
  options: FrameLoaderOptions = {},
): Promise<FrameSequence> {
  const o = { ...DEFAULT_FRAMES, ...options };

  const probe = await loadImage(frameUrl(1, o));
  if (!probe) return { available: false, frames: [] };

  const rest = await Promise.all(
    Array.from({ length: o.count - 1 }, (_, i) => loadImage(frameUrl(i + 2, o))),
  );

  const frames = [probe, ...rest].filter((f): f is HTMLImageElement => !!f);
  // A partial sequence would stutter; treat it as unavailable.
  return { available: frames.length === o.count, frames };
}

/**
 * Starts loading shortly before `element` enters view, then disconnects.
 * Returns a cleanup function.
 */
export function preloadOnApproach(
  element: HTMLElement,
  onLoaded: (sequence: FrameSequence) => void,
  options: FrameLoaderOptions & { rootMargin?: string } = {},
): () => void {
  const { rootMargin = "100% 0px", ...frameOptions } = options;
  let cancelled = false;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      loadFrames(frameOptions).then((seq) => {
        if (!cancelled) onLoaded(seq);
      });
    },
    { rootMargin },
  );

  observer.observe(element);

  return () => {
    cancelled = true;
    observer.disconnect();
  };
}
