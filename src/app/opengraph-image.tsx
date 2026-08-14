import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { BRAND } from "@/config/brand";
import { SITE } from "@/config/site";

export const alt = "Surya Cacao — beyond cacao.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * A4 (the designed OG image) doesn't exist yet. Rather than ship a broken link
 * preview, this generates one from the tokens and the real typeface.
 *
 * Satori cannot read CSS custom properties, so colors come from config/brand.ts
 * — the one sanctioned JS mirror of globals.css. It also cannot parse woff2,
 * so the type comes from a TrueType build of the same OFL font kept in
 * src/lib/og/ (outside public/, build-time only). Replace this file when the
 * designed asset lands.
 */
export default async function OpengraphImage() {
  const gilda = await readFile(
    join(process.cwd(), "src/lib/og/GildaDisplay-Regular.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BRAND.night,
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: BRAND.gold,
          }}
        >
          Ceremonial Cacao
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              fontFamily: "Gilda Display",
              fontSize: 132,
              lineHeight: 1,
              color: BRAND.sand,
            }}
          >
            Beyond cacao.
          </div>
          <div style={{ fontSize: 30, color: BRAND.gold }}>
            {SITE.url.replace("https://", "")}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Gilda Display",
          data: Uint8Array.from(gilda).buffer as ArrayBuffer,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
