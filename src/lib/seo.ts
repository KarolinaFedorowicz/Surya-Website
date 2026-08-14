// L9 — SeoHead. SURYA_CACAO_BUILD_PLAN.md §3.3
import type { Metadata } from "next";

import { SITE } from "@/config/site";

/**
 * The plan calls L9 a `SeoHead` component. In the App Router there is no head
 * component to render — metadata is data, returned from `metadata` or
 * `generateMetadata`. So L9 ships as this builder plus the `<JsonLd>`
 * component alongside it; same responsibility, correct shape for the framework.
 * Flagged in the Phase 2 summary.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const url = new URL(path, SITE.url).toString();
  const desc = description ?? SITE.description;

  return {
    // Only set `title` when we have one. Passing `title: undefined` overrides
    // the root layout's `title.default`, which left "/" with no <title>.
    ...(title ? { title } : {}),
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title: title ? `${title} · ${SITE.name}` : SITE.name,
      description: desc,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} · ${SITE.name}` : SITE.name,
      description: desc,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

/** Organization schema. Product schema (JSON-LD) arrives with C1 in Phase 5. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
  };
}
