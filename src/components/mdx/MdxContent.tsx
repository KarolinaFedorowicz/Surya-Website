import { MDXRemote } from "next-mdx-remote/rsc";
import type { MDXComponents } from "mdx/types";

import { Display, Prose, TextLink } from "@/components/primitives";

/**
 * The MDX render target. P4 Prose does the typographic work via descendant
 * styles, so this map stays small — it exists to hand a few elements to real
 * primitives rather than let MDX emit bare tags.
 *
 * Links route through P6 TextLink so body copy gets the same underline draw as
 * the rest of the site, and external links get rel/target without every
 * content author remembering to.
 */
const components: MDXComponents = {
  a: ({ href = "", children }) => {
    const external = /^https?:\/\//.test(href);
    return external ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-ink decoration-emphasis underline underline-offset-[0.3em]"
      >
        {children}
      </a>
    ) : (
      <TextLink href={href}>{children}</TextLink>
    );
  },
  /* A pull quote in copy is one of Gilda's two sanctioned uses (brief §3.2).
     Prose styles blockquote already; this keeps a standalone `Lead` available
     to content without exposing the whole Display API to MDX. */
  Lead: ({ children }: { children: React.ReactNode }) => (
    <Display as="p" size="section" className="my-10">
      {children}
    </Display>
  ),
};

export function MdxContent({
  source,
  className,
}: {
  source: string;
  className?: string;
}) {
  return (
    <Prose className={className}>
      <MDXRemote source={source} components={components} />
    </Prose>
  );
}
