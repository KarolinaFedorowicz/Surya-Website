"use client";

import { useEffect, useState } from "react";

/**
 * Subscribes to a media query.
 *
 * Starts `false` on the server and on first client render, then corrects in an
 * effect — matching during render would produce a hydration mismatch. Callers
 * must therefore treat `false` as "not yet known", which is why every motion
 * component defaults to its non-animated state.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
