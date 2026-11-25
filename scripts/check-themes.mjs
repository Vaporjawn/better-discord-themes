#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import listThemeFiles from "./lib/listThemeFiles.mjs";
import parseMeta from "./lib/parseMeta.mjs";
import validateMeta from "./lib/validateMeta.mjs";

/**
 * Validates the meta header of every theme and prints the @import hosts each theme depends on.
 * Usage: node scripts/check-themes.mjs [rootDir]. Exits 1 when any header fails.
 */
const main = () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const root = resolve(process.argv[2] ?? join(here, ".."));
  const files = listThemeFiles(root);
  let failures = 0;
  for (const file of files) {
    const text = readFileSync(join(root, file), "utf8");
    const problems = validateMeta(parseMeta(text));
    const hosts = new Set();
    for (const m of text.matchAll(/@import\s+url\(\s*["']?(https?:\/\/[^/"')\s]+)/g)) hosts.add(m[1]);
    const hostNote = hosts.size ? `  [imports: ${[...hosts].join(", ")}]` : "";
    if (problems.length) {
      failures += 1;
      console.log(`FAIL ${file}: ${problems.join("; ")}${hostNote}`);
    } else {
      console.log(`ok   ${file}${hostNote}`);
    }
  }
  console.log(`\n${files.length} themes checked, ${failures} failing`);
  process.exit(failures ? 1 : 0);
};

main();
