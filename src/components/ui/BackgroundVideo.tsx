"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";

/**
 * A looping video used as a section ground.
 *
 * Client-side because of the one rule this site does not bend: reduced motion.
 * A background video is the largest piece of motion on the page and CSS cannot
 * stop it, so when the reader has asked for less movement we render the poster
 * frame instead and never mount the <video> at all. That also saves them the
 * download.
 *
 * The resting state is the poster: it renders on the server, during hydration,
 * and if the video never loads. Nothing here is load-bearing for the content —
 * the type on top is readable against either.
 *
 * muted + playsInline are what make autoplay legal in every browser; without
 * both, Safari and Chrome refuse to start and the reader gets a frozen frame.
 */

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * useSyncExternalStore rather than useEffect + setState. matchMedia is exactly
 * the "external store" this hook exists for, and reading it this way keeps the
 * server render and the first client render agreeing on the poster instead of
 * setting state during the first effect and re-rendering everything under it.
 */
const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const motionAllowed = () => !window.matchMedia(QUERY).matches;

/** The server cannot know the preference, so it renders the safe branch. */
const motionAllowedOnServer = () => false;

export default function BackgroundVideo({
  src,
  poster,
  alt,
  className = "",
}: {
  src: string;
  poster: string;
  /** Describes the poster, which is the accessible representation of both. */
  alt: string;
  className?: string;
}) {
  const motionOk = useSyncExternalStore(
    subscribe,
    motionAllowed,
    motionAllowedOnServer,
  );

  if (!motionOk) {
    return (
      <Image
        src={poster}
        alt={alt}
        fill
        sizes="100vw"
        preload
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <video
      src={src}
      poster={poster}
      aria-label={alt}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    />
  );
}
