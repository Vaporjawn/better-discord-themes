#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import bannerSvg from "./lib/bannerSvg.mjs";
import extractPalette from "./lib/extractPalette.mjs";
import listThemeFiles from "./lib/listThemeFiles.mjs";
import paletteSvg from "./lib/paletteSvg.mjs";
import parseMeta from "./lib/parseMeta.mjs";
import rawUrl from "./lib/rawUrl.mjs";

const BEGIN = "<!-- BEGIN THEMES -->";
const END = "<!-- END THEMES -->";

/**
 * Escapes characters that would break a Markdown table cell.
 * @param {string} text Cell text.
 * @returns {string} Safe cell text.
 */
const cell = (text) => String(text ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");

/**
 * Builds docs/themes.json, one palette strip per theme, the README banner and the README themes table
 * from the theme files in curated/. The README is rewritten between the BEGIN THEMES and END THEMES markers.
 */
const main = () => {
  const root = resolve(join(dirname(fileURLToPath(import.meta.url)), ".."));
  mkdirSync(join(root, "assets/palettes"), { recursive: true });
  const themes = listThemeFiles(root).map((file) => {
    const css = readFileSync(join(root, file), "utf8");
    const meta = parseMeta(css) ?? {};
    const slug = basename(file, ".theme.css").toLowerCase();
    const palette = extractPalette(css);
    if (palette.length) writeFileSync(join(root, `assets/palettes/${slug}.svg`), paletteSvg(palette));
    return {
      file,
      slug,
      name: meta.name ?? file,
      author: meta.author ?? "",
      version: meta.version ?? "",
      description: meta.description ?? "",
      source: meta.source ?? "",
      raw: rawUrl(file),
      palette,
    };
  });
  writeFileSync(join(root, "docs/themes.json"), JSON.stringify(themes, null, 2) + "\n");
  writeFileSync(join(root, "assets/banner.svg"), bannerSvg(themes.map((t) => t.palette), themes.length));

  const rows = themes.map((t) => {
    const preview = t.palette.length ? `<img src="assets/palettes/${t.slug}.svg" width="96" alt="${cell(t.name)} colors">` : "";
    const links = [`[Raw](${t.raw})`, t.source ? `[Source](${t.source})` : ""].filter(Boolean).join(" · ");
    const by = t.author ? `<br><sub>by ${cell(t.author)}</sub>` : "";
    return `| ${preview} | **${cell(t.name)}** ${cell(t.version)}${by} | ${cell(t.description)} | ${links} |`;
  });
  const table = [BEGIN, "| Colors | Theme | About | Links |", "| --- | --- | --- | --- |", ...rows, END].join("\n");
  const readmePath = join(root, "README.md");
  const readme = readFileSync(readmePath, "utf8");
  const start = readme.indexOf(BEGIN);
  const stop = readme.indexOf(END);
  if (start === -1 || stop === -1) throw new Error("README.md is missing the BEGIN THEMES / END THEMES markers");
  writeFileSync(readmePath, readme.slice(0, start) + table + readme.slice(stop + END.length));
  console.log(`${themes.length} themes indexed; ${themes.filter((t) => t.palette.length).length} have a palette`);
};

main();
