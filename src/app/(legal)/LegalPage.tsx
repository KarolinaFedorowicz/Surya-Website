import type { Metadata } from "next";

import { Display, Eyebrow, Pill, Section } from "@/components/primitives";
import { MdxContent } from "@/components/mdx/MdxContent";
import { getCopy } from "@/lib/mdx";
import { buildMetadata } from "@/lib/seo";

/**
 * All four legal pages share one component — they differ only by which copy
 * file they read. A route group with no URL segment (plan §2: "no URL segment,
 * footer-linked only") gives them a common shell without a `/legal` prefix.
 *
 * Privacy and Terms are deliberately undrafted (see the copy files). They are
 * marked noindex while that's true: publishing an unreviewed policy that reads
 * as finished is worse than not publishing one, and letting it get indexed
 * compounds that.
 */
export function legalMetadata(slug: string): Metadata {
  const copy = getCopy(slug);
  const undrafted = slug === "privacy" || slug === "terms";

  return buildMetadata({
    title: copy.title,
    path: `/${slug}`,
    noIndex: undrafted,
  });
}

export function LegalPage({ slug }: { slug: string }) {
  const copy = getCopy(slug);
  const undrafted = slug === "privacy" || slug === "terms";

  return (
    <Section tone="sand" space="normal" width="prose">
      <Eyebrow>Information</Eyebrow>
      <Display as="h1" size="section" className="mt-4">
        {copy.title}
      </Display>

      {undrafted ? (
        <Pill variant="soon" className="mt-6">
          Not drafted — do not launch
        </Pill>
      ) : copy.placeholder ? (
        <Pill variant="soon" className="mt-6">
          Placeholder copy
        </Pill>
      ) : null}

      <MdxContent source={copy.body} className="mt-12" />
    </Section>
  );
}
