Build-time only. Satori (next/og) cannot parse woff2, so the OG image renders
from this TrueType build of Gilda Display — same OFL font as `public/fonts/`,
different container. Deliberately outside `public/` so it is never served to
browsers; `app/opengraph-image.tsx` reads it at build time and emits a PNG.

Source: github.com/google/fonts/ofl/gildadisplay (OFL 1.1)
Delete this once A4 (the designed OG image) lands.
