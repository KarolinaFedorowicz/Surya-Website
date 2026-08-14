import "server-only";

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { z } from "zod";

/**
 * Content layer — CT1/CT2/CT3, SURYA_CACAO_BUILD_PLAN.md §3.6.
 *
 * Content is MDX on disk, no CMS. Frontmatter is untyped YAML, so TypeScript
 * on its own cannot catch a missing field — the plan's stated reason each type
 * needs its own schema. These Zod schemas validate at read time and throw with
 * the offending file named, which turns a malformed recipe into a build
 * failure rather than a blank card in production.
 *
 * Listing uses gray-matter only (frontmatter, no compile). Compiling every
 * file just to render a carousel would be wasteful; bodies compile on demand
 * in the detail loaders.
 */

const CONTENT_DIR = join(process.cwd(), "src/content");

/* -------------------------------------------------------------------------
   Schemas
   ------------------------------------------------------------------------- */

/** Marks copy awaiting the client's real words. Surfaced by `npm run check`. */
const placeholder = z.boolean().default(false);

export const RecipeSchema = z.object({
  title: z.string().min(1),
  /** brief §5.5: a mood/occasion line, never a category tag. */
  mood: z.string().min(1),
  ingredients: z.array(z.string().min(1)).min(1),
  method: z.array(z.string().min(1)).min(1),
  /** Null until real photography exists — P9 Frame renders a placeholder. */
  image: z.string().nullable().default(null),
  featured: z.boolean().default(false),
  /** Deterministic carousel order; filesystem order is not meaningful. */
  order: z.number().int().default(99),
  placeholder,
});

export const FamilySchema = z.object({
  country: z.string().min(1),
  /**
   * [lat, lng] — drives S8 FamilyMap's waypoints. Tupled and range-checked so
   * a transposed pair fails the build instead of putting Poland in the sea.
   */
  coordinates: z.tuple([z.number().min(-90).max(90), z.number().min(-180).max(180)]),
  portrait: z.string().nullable().default(null),
  /** One-line summary for S5 FamiliesTeaser; the MDX body is the long form. */
  narrative: z.string().min(1),
  order: z.number().int(),
  placeholder,
});

export const CopySchema = z.object({
  title: z.string().min(1),
  /** Plan section ID this copy feeds, e.g. "S3". Keeps content traceable. */
  section: z.string().optional(),
  eyebrow: z.string().optional(),
  /**
   * The four prose fields below exist because §2.4 of the copy pass requires
   * that no real copy live in JSX, and every section previously hardcoded its
   * paragraphs. They are positional ROLES, not a generic bucket — each maps to
   * one element a section already renders, so copy moves without any component
   * changing its layout or type scale.
   *
   * `headline` is separate from `title` because they genuinely differ: `title`
   * names the file for metadata and the content audit ("On Gatekeeping"), while
   * `headline` is the Gilda line on screen ("Quality and access were never in
   * tension.").
   */
  headline: z.string().optional(),
  /** The paragraph directly beneath the headline. */
  lead: z.string().optional(),
  /** Body paragraphs, in order, for sections that run more than one. */
  paragraphs: z.array(z.string().min(1)).optional(),
  /** The final paragraph, which several sections style distinctly from `lead`. */
  closing: z.string().optional(),
  /**
   * Call-to-action labels with their destinations. Kept together because a
   * button label is copy and separating it from its href is how the two drift.
   *
   * `href` is nullable so a CTA whose destination is still an open item can be
   * recorded in full without rendering a button that goes nowhere — sections
   * skip any entry without an href.
   */
  ctas: z
    .array(
      z.object({
        label: z.string().min(1),
        href: z.string().min(1).nullable().default(null),
      }),
    )
    .optional(),
  /**
   * S4 WhatsInside's seven compounds. Structured rather than prose because
   * they're a scroll-sequenced callout list, not a paragraph — the
   * Scrollytelling wrapper (M11) indexes them. Zod strips unknown keys, so
   * omitting this would silently drop the data at read time.
   */
  compounds: z
    .array(z.object({ name: z.string().min(1), note: z.string().min(1) }))
    .optional(),
  /**
   * Repeated sub-blocks a section lays out itself — S2's generational
   * triptych, S17's collaboration types. Structured for the same reason as
   * `compounds`: they're a layout the component owns, but words the copy pass
   * must be able to edit without opening JSX.
   */
  items: z
    .array(z.object({ label: z.string().min(1), note: z.string().min(1) }))
    .optional(),
  placeholder,
});

/**
 * CT4 — product copy. Field names are FIXED: they become Shopify metafields in
 * the next pass, so `tasting_notes`, `origin`, `ritual`, `ingredients` and
 * `weight_note` are a contract, not a naming preference. Renaming one here
 * silently breaks the migration.
 *
 * Deliberately five fields rather than one description: each renders in its own
 * designed slot. `ritual` is structured per size because that is exactly what
 * C4 RitualQuantity consumes — one framing line per variant title.
 *
 * Nullable rather than required: the copy source supplies three of the five,
 * and an invented tasting note is worse than a visibly absent one.
 */
export const ProductCopySchema = z.object({
  title: z.string().min(1),
  tasting_notes: z.string().nullable().default(null),
  origin: z.string().nullable().default(null),
  ritual: z
    .array(z.object({ size: z.string().min(1), note: z.string().min(1) }))
    .default([]),
  ingredients: z.string().nullable().default(null),
  weight_note: z.string().nullable().default(null),
  placeholder,
});

export type Recipe = z.infer<typeof RecipeSchema> & { slug: string };
export type Family = z.infer<typeof FamilySchema> & { slug: string };
export type Copy = z.infer<typeof CopySchema> & { slug: string };
export type ProductCopy = z.infer<typeof ProductCopySchema> & { slug: string };

/* -------------------------------------------------------------------------
   Reading
   ------------------------------------------------------------------------- */

type Collection = "recipes" | "families" | "copy" | "product";

function listFiles(collection: Collection): string[] {
  try {
    return readdirSync(join(CONTENT_DIR, collection))
      .filter((f) => f.endsWith(".mdx"))
      .sort();
  } catch {
    return [];
  }
}

function readOne<T extends z.ZodType>(
  collection: Collection,
  file: string,
  schema: T,
): { data: z.infer<T>; body: string; slug: string } {
  const full = join(CONTENT_DIR, collection, file);
  const { data, content } = matter(readFileSync(full, "utf8"));
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(
      `Invalid frontmatter in src/content/${collection}/${file}\n${issues}`,
    );
  }

  return {
    data: parsed.data,
    body: content,
    slug: file.replace(/\.mdx$/, ""),
  };
}

function readAll<T extends z.ZodType>(collection: Collection, schema: T) {
  return listFiles(collection).map((f) => readOne(collection, f, schema));
}

/* -------------------------------------------------------------------------
   Typed loaders — what Phase 4 sections consume
   ------------------------------------------------------------------------- */

export function getRecipes(): Recipe[] {
  return readAll("recipes", RecipeSchema)
    .map((r) => ({ ...r.data, slug: r.slug }))
    .sort((a, b) => a.order - b.order);
}

export function getFeaturedRecipes(limit = 3): Recipe[] {
  return getRecipes()
    .filter((r) => r.featured)
    .slice(0, limit);
}

export function getRecipe(slug: string) {
  const found = readAll("recipes", RecipeSchema).find((r) => r.slug === slug);
  if (!found) return null;
  return { ...found.data, slug: found.slug, body: found.body };
}

export function getFamilies(): Family[] {
  return readAll("families", FamilySchema)
    .map((f) => ({ ...f.data, slug: f.slug }))
    .sort((a, b) => a.order - b.order);
}

export function getFamily(slug: string) {
  const found = readAll("families", FamilySchema).find((f) => f.slug === slug);
  if (!found) return null;
  return { ...found.data, slug: found.slug, body: found.body };
}

/** CT3 — one file per page section. Throws on a missing key: a section that
 *  silently renders nothing is worse than a build error. */
export function getCopy(slug: string) {
  const files = listFiles("copy");
  const file = `${slug}.mdx`;
  if (!files.includes(file)) {
    throw new Error(
      `Missing copy: src/content/copy/${file}\nAvailable: ${files.join(", ") || "(none)"}`,
    );
  }
  const found = readOne("copy", file, CopySchema);
  return { ...found.data, slug: found.slug, body: found.body };
}

export function getAllCopy(): (Copy & { body: string })[] {
  return readAll("copy", CopySchema).map((c) => ({
    ...c.data,
    slug: c.slug,
    body: c.body,
  }));
}

/**
 * CT4 — product copy, keyed by the same handle Shopify uses. Returns null
 * rather than throwing: the commerce layer owns whether a product exists, and a
 * product without a copy file should render its designed slots empty, not fail
 * the build.
 */
export function getProductCopy(handle: string) {
  const file = `${handle}.mdx`;
  if (!listFiles("product").includes(file)) return null;
  const found = readOne("product", file, ProductCopySchema);
  return { ...found.data, slug: found.slug, body: found.body };
}

export function getAllProductCopy(): (ProductCopy & { body: string })[] {
  return readAll("product", ProductCopySchema).map((p) => ({
    ...p.data,
    slug: p.slug,
    body: p.body,
  }));
}

/** Used by `npm run check` to report how much copy is still placeholder. */
export function contentAudit() {
  return {
    recipes: getRecipes(),
    families: getFamilies(),
    copy: getAllCopy().map(({ body: _body, ...rest }) => rest),
    product: getAllProductCopy().map(({ body: _body, ...rest }) => rest),
  };
}
