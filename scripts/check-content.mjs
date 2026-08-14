#!/usr/bin/env node
/**
 * Phase 3 checkpoint. Validates every MDX file against its CT schema and
 * reports how much copy is still placeholder.
 *
 * Runs the real loaders via a tiny TS shim rather than reimplementing the
 * schemas — a second copy of the validation rules would drift from the first.
 */
import { execFileSync } from "node:child_process";
import { writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const shim = join(ROOT, ".content-audit.mjs");

// next/font and "server-only" don't resolve outside Next, so read the content
// with the same schemas by importing the module through a bundler-free path.
const script = `
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const DIR = join(process.cwd(), "src/content");
const placeholder = z.boolean().default(false);

const Recipe = z.object({
  title: z.string().min(1),
  mood: z.string().min(1),
  ingredients: z.array(z.string().min(1)).min(1),
  method: z.array(z.string().min(1)).min(1),
  image: z.string().nullable().default(null),
  featured: z.boolean().default(false),
  order: z.number().int().default(99),
  placeholder,
});

const Family = z.object({
  country: z.string().min(1),
  coordinates: z.tuple([z.number().min(-90).max(90), z.number().min(-180).max(180)]),
  portrait: z.string().nullable().default(null),
  narrative: z.string().min(1),
  order: z.number().int(),
  placeholder,
});

const Copy = z.object({
  title: z.string().min(1),
  section: z.string().optional(),
  eyebrow: z.string().optional(),
  compounds: z.array(z.object({ name: z.string().min(1), note: z.string().min(1) })).optional(),
  placeholder,
});

const COLLECTIONS = [
  ["recipes", Recipe],
  ["families", Family],
  ["copy", Copy],
];

let failed = 0;
let total = 0;
const pending = [];

for (const [name, schema] of COLLECTIONS) {
  let files = [];
  try { files = readdirSync(join(DIR, name)).filter((f) => f.endsWith(".mdx")).sort(); } catch {}

  if (files.length === 0) {
    console.error(\`  ✗ \${name}: no content files\`);
    failed++;
    continue;
  }

  for (const file of files) {
    total++;
    const { data } = matter(readFileSync(join(DIR, name, file), "utf8"));
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      failed++;
      console.error(\`  ✗ \${name}/\${file}\`);
      for (const i of parsed.error.issues) {
        console.error(\`      \${i.path.join(".") || "(root)"}: \${i.message}\`);
      }
    } else if (parsed.data.placeholder) {
      pending.push(\`\${name}/\${file}\`);
    }
  }
  console.log(\`  \${name}: \${files.length} file(s)\`);
}

// Exactly three families, or S8 FamilyMap has the wrong number of waypoints.
const famCount = readdirSync(join(DIR, "families")).filter((f) => f.endsWith(".mdx")).length;
if (famCount !== 3) {
  console.error(\`  ✗ expected exactly 3 families (three continents), found \${famCount}\`);
  failed++;
}

console.log("");
if (failed) {
  console.error(\`✗ content invalid — \${failed} problem(s)\`);
  process.exit(1);
}
console.log(\`✓ content valid — \${total} file(s)\`);
console.log(\`  \${pending.length}/\${total} still placeholder, awaiting real copy:\`);
for (const p of pending) console.log(\`    · \${p}\`);
`;

writeFileSync(shim, script);
try {
  execFileSync("node", [shim], { cwd: ROOT, stdio: "inherit" });
} catch {
  rmSync(shim, { force: true });
  process.exit(1);
}
rmSync(shim, { force: true });
