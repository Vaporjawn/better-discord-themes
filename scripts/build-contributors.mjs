#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import contributorsHtml from "./lib/contributorsHtml.mjs";
import replaceBetweenMarkers from "./lib/replaceBetweenMarkers.mjs";

const BEGIN = "<!-- BEGIN CONTRIBUTORS -->";
const END = "<!-- END CONTRIBUTORS -->";
const REPO = process.env.GITHUB_REPOSITORY || "Vaporjawn/better-discord-themes";

/**
 * Rewrites the README Contributors avatars from the live GitHub contributors list.
 * Reads GITHUB_TOKEN when set so the request is not rate limited.
 */
const main = async () => {
  const headers = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(`https://api.github.com/repos/${REPO}/contributors?per_page=100`, { headers });
  if (!response.ok) throw new Error(`Contributors request failed: ${response.status}`);
  const html = contributorsHtml(await response.json());
  if (!html) throw new Error("No contributors returned; leaving README unchanged");
  const root = resolve(join(dirname(fileURLToPath(import.meta.url)), ".."));
  const path = join(root, "README.md");
  const before = readFileSync(path, "utf8");
  const after = replaceBetweenMarkers(before, BEGIN, END, html);
  if (after !== before) writeFileSync(path, after);
  console.log(after === before ? "Contributors already up to date" : "Contributors updated");
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
