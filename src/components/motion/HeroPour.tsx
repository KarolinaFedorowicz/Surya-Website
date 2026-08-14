// M9 — HeroPour. SURYA_CACAO_BUILD_PLAN.md §3.2
"use client";

import { useEffect, useRef, useState } from "react";

import { KenBurns } from "./KenBurns";
import { useReducedMotion } from "./ReducedMotionProvider";
import { cn } from "@/lib/utils";

/**
 * Autoplay loop. NOT scroll-scrubbed and NOT pinned — the hero holds its
 * position and the page scrolls over it normally.
 *
 * Playback is entirely declarative: `autoPlay muted loop playsInline`. We never
 * call `.play()`. `muted` and `playsInline` are both load-bearing — iOS refuses
 * to autoplay without either one, and an imperative play() would just surface a
 * rejected promise on the browsers that already handle this correctly.
 *
 * Two states only:
 *
 * 1. VIDEO   — the footage, faded in once it can actually play.
 * 2. POSTER  — the still, with no <video> in the tree at all. Entered on
 *              reduced motion, Save-Data, a decode/network error, or no
 *              `canplay` inside 3s.
 *
 * The poster is mounted unconditionally underneath, so every path off the video
 * simply uncovers it. Constraint §6.8: never a blank hero.
 */
const SOURCES = {
  webm: "/assets/motion/hero.webm",
  mp4: "/assets/motion/hero.mp4",
  poster: "/assets/motion/hero-poster.jpg",
};

/** How long we let the video try before falling back to the poster. */
const CANPLAY_TIMEOUT_MS = 3000;

type Mode = "poster" | "video";

/**
 * `saveData` lives on the Network Information API, which is not in lib.dom and
 * is absent in Safari and Firefox. Absent means "not requested", so anything
 * other than an explicit `true` lets the video through.
 */
function prefersSaveData(): boolean {
  if (typeof navigator === "undefined") return false;
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  return connection?.saveData === true;
}

export function HeroPour({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const reduced = useReducedMotion();
  const [mode, setMode] = useState<Mode>("poster");
  const [ready, setReady] = useState(false);

  /* ---- Decide whether the video is allowed to mount at all. ----
     Poster on the server and on first paint, then upgraded in an effect.
     useReducedMotion defaults to `true` until matchMedia resolves, so this
     also avoids mounting a video we may be about to discard. */
  useEffect(() => {
    if (reduced || prefersSaveData()) {
      setMode("poster");
      setReady(false);
      return;
    }
    setMode("video");
  }, [reduced]);

  /* ---- The 3s deadline. ----
     Also the real safety net for a missing or undecodable file: a <video> with
     <source> children does NOT fire `error` on the media element when the
     sources fail — `video.error` stays null and only networkState goes to
     NETWORK_NO_SOURCE. Rather than poll for that, we let the same timeout that
     covers a slow connection cover a broken one. */
  useEffect(() => {
    if (mode !== "video" || ready) return;
    const id = window.setTimeout(() => setMode("poster"), CANPLAY_TIMEOUT_MS);
    return () => window.clearTimeout(id);
  }, [mode, ready]);

  useEffect(() => {
    if (mode !== "video") return;
    const video = videoRef.current;
    if (!video) return;

    /* React applies `muted` as a DOM PROPERTY and never writes the content
       attribute — verified in the rendered DOM, where `playsinline` serialises
       and `muted` does not. The spec gates autoplay on the IDL state, so the
       property alone is correct by the letter of it, but iOS has a long history
       of consulting the attribute and silently refusing to autoplay without it.
       Setting both costs nothing. Still no .play() anywhere. */
    video.muted = true;
    if (!video.hasAttribute("muted")) video.setAttribute("muted", "");

    /* If the file is already in the HTTP cache, `canplay` can fire before React
       attaches the handler, which would strand us at opacity 0 until the
       timeout drops us to the poster. Trust readyState, not just the event. */
    if (video.readyState >= video.HAVE_FUTURE_DATA) setReady(true);
  }, [mode]);

  return (
    <div className={cn("relative isolate", className)}>
      <div className="absolute inset-0">
        {/* The required static fallback, always beneath everything. Wrapped in
            M3 because brief §4.1 is explicit that no hero image is ever
            hard-static; M3 owns its own reduced-motion case, so nothing is
            gated here.

            object-position is CENTER, not top. The footage is a locked-off
            pour — pot in the upper third, stream through the middle, receiving
            bowl across the bottom half. Anchoring top crops the bowl away on
            short viewports and leaves a pot pouring into nothing. */}
        <KenBurns className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SOURCES.poster}
            alt=""
            className="size-full object-cover object-center"
          />
        </KenBurns>

        {mode === "video" ? (
          <video
            ref={videoRef}
            poster={SOURCES.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            onCanPlay={() => setReady(true)}
            onError={() => setMode("poster")}
            className={cn(
              "absolute inset-0 size-full object-cover object-center transition-opacity duration-[600ms]",
              ready ? "opacity-100" : "opacity-0",
            )}
          >
            <source src={SOURCES.webm} type="video/webm" />
            <source src={SOURCES.mp4} type="video/mp4" />
          </video>
        ) : null}
      </div>
      {children}
    </div>
  );
}
