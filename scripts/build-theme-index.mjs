#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import listThemeFiles from "./lib/listThemeFiles.mjs";
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
 * Builds themes.json and the README themes table from the meta header of every theme file.
 * Writes themes.json (repo root), docs/themes.json (served by GitHub Pages) and rewrites the
 * README between the BEGIN THEMES and END THEMES markers.
 */
const main = () => {
  const root = resolve(join(dirname(fileURLToPath(import.meta.url)), ".."));
  const themes = listThemeFiles(root).map((file) => {
    const meta = parseMeta(readFileSync(join(root, file), "utf8")) ?? {};
    return {
      file,
      name: meta.name ?? file,
      author: meta.author ?? "",
      version: meta.version ?? "",
      description: meta.description ?? "",
      source: meta.source ?? "",
      raw: rawUrl(file),
    };
  });
  const json = JSON.stringify(themes, null, 2) + "\n";
  writeFileSync(join(root, "themes.json"), json);
  mkdirSync(join(root, "docs"), { recursive: true });
  writeFileSync(join(root, "docs/themes.json"), json);

  const rows = themes.map(
    (t) =>
      `| ${cell(t.name)} | ${cell(t.author)} | ${cell(t.version)} | ${cell(t.description)} | [raw](${t.raw}) | ${t.source ? `[source](${t.source})` : ""} |`,
  );
  const table = [BEGIN, "| Name | Author | Version | Description | Raw link | Original source |", "| --- | --- | --- | --- | --- | --- |", ...rows, END].join("\n");
  const readmePath = join(root, "README.md");
  const readme = readFileSync(readmePath, "utf8");
  const start = readme.indexOf(BEGIN);
  const stop = readme.indexOf(END);
  if (start === -1 || stop === -1) throw new Error("README.md is missing the BEGIN THEMES / END THEMES markers");
  writeFileSync(readmePath, readme.slice(0, start) + table + readme.slice(stop + END.length));
  console.log(`${themes.length} themes written to themes.json, docs/themes.json and README.md`);
};

main();
