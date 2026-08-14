#!/usr/bin/env node
/**
 * Guardrails for the non-negotiable constraints in the build prompt §5 / §8.
 * Run via `npm run check`. Fails the build on violation.
 *
 * These are cheap to enforce continuously and expensive to retrofit at Phase 9,
 * which is the whole reason they exist.
 *
 * A line may opt out with a `token-exception:` comment on it or the line above,
 * which must state why. There is currently exactly one (see layout.tsx).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SRC = join(ROOT, "src");

const RULES = [
  {
    id: "no-hex-outside-globals",
    why: "§5.1 — the five colors are defined once, in globals.css.",
    // #abc, #aabbcc, #aabbccdd
    pattern: /#[0-9a-fA-F]{3,8}\b/,
    appliesTo: (f) => /\.(ts|tsx|css)$/.test(f) && !f.endsWith("globals.css"),
  },
  {
    id: "no-font-family-outside-globals",
    why: "§5.1 — two typefaces, declared once, in globals.css.",
    pattern: /font-family\s*:|next\/font/,
    appliesTo: (f) => /\.(ts|tsx|css)$/.test(f) && !f.endsWith("globals.css"),
  },
  {
    id: "no-motion-libs-outside-motion",
    why: "§5.3 — GSAP/Framer stay inside components/motion/.",
    pattern: /from\s+["'](gsap|framer-motion|motion\/react)/,
    appliesTo: (f) =>
      /\.(ts|tsx)$/.test(f) && !f.includes(`components${sep}motion${sep}`),
  },
  {
    id: "no-watermarked-reference",
    why: "brief §2.4 — the watermarked stock reference must never be imported.",
    pattern: /DO-NOT-SHIP|reference-mood-only/,
    appliesTo: (f) => /\.(ts|tsx|css|mdx)$/.test(f),
  },
];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const files = walk(SRC);
const violations = [];

for (const file of files) {
  const rel = relative(ROOT, file);
  const applicable = RULES.filter((r) => r.appliesTo(file));
  if (applicable.length === 0) continue;

  const lines = readFileSync(file, "utf8").split("\n");

  // File-level exception: a `token-exception:` in the leading comment block
  // excuses the whole file. Currently config/brand.ts only — the JS mirror
  // for APIs that cannot read CSS custom properties.
  if (lines.slice(0, 15).some((l) => l.includes("token-exception:"))) continue;

  lines.forEach((line, i) => {
    // The marker may sit anywhere in the comment block immediately above.
    const excused = lines
      .slice(Math.max(0, i - 6), i + 1)
      .some((l) => l.includes("token-exception:"));
    if (excused) return;

    for (const rule of applicable) {
      if (rule.pattern.test(line)) {
        violations.push({ rel, line: i + 1, rule, text: line.trim() });
      }
    }
  });
}

/* The watermarked reference must never reach the served directory. Root
   assets/ is the drop zone; public/ is the build output. */
const PUBLIC = join(ROOT, "public");
let publicFiles = [];
try {
  publicFiles = walk(PUBLIC);
} catch {
  /* no public/ yet */
}
for (const f of publicFiles) {
  if (/DO-NOT-SHIP|reference-mood-only/i.test(f)) {
    violations.push({
      rel: relative(ROOT, f),
      line: 0,
      rule: {
        id: "watermarked-asset-in-public",
        why: "brief §2.4 — unlicensed asset would be served publicly.",
      },
      text: "present in public/",
    });
  }
}

/* Constraint §5.4: one and only one scrollProgress implementation. */
const progressImpls = files.filter((f) => /scrollProgress\.(ts|tsx|js)$/.test(f));
if (progressImpls.length > 1) {
  violations.push({
    rel: progressImpls.map((f) => relative(ROOT, f)).join(", "),
    line: 0,
    rule: { id: "one-scroll-progress", why: "§5.4 — exactly one implementation." },
    text: `found ${progressImpls.length}`,
  });
}

if (violations.length === 0) {
  console.log(`✓ token guardrails clean (${files.length} files checked)`);
  process.exit(0);
}

console.error(`✗ ${violations.length} violation(s):\n`);
for (const v of violations) {
  console.error(`  ${v.rel}:${v.line}  [${v.rule.id}]`);
  console.error(`    ${v.text}`);
  console.error(`    ${v.rule.why}\n`);
}
process.exit(1);
