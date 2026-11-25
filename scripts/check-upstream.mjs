#!/usr/bin/env node
import { appendFileSync, readFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import listThemeFiles from "./lib/listThemeFiles.mjs";
import parseMeta from "./lib/parseMeta.mjs";

/**
 * Compares two dotted version strings numerically.
 * @param {string} a First version.
 * @param {string} b Second version.
 * @returns {number} Negative when a is older than b, positive when newer, 0 when equal.
 */
const compareVersions = (a, b) => {
  const pa = a.split(/[.\-]/).map((n) => parseInt(n, 10) || 0);
  const pb = b.split(/[.\-]/).map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff) return diff;
  }
  return 0;
};

/**
 * Builds the candidate raw URLs where a theme's upstream copy might live.
 * @param {string} source The theme's @source URL.
 * @param {string} fileName Local file name of the theme.
 * @returns {string[]} Candidate raw.githubusercontent.com URLs, best guess first.
 */
const candidateUrls = (source, fileName) => {
  const m = source.match(/^https:\/\/github\.com\/([^/]+)\/([^/#?]+)(?:\/(?:blob|tree)\/([^/]+)\/(.+?))?\/?$/);
  if (!m) return [];
  const [, owner, repo, branch, path] = m;
  const base = `https://raw.githubusercontent.com/${owner}/${repo}`;
  const urls = [];
  if (path && /\.css$/.test(path)) urls.push(`${base}/${branch}/${path}`);
  if (path && !/\.css$/.test(path)) urls.push(`${base}/${branch}/${path.replace(/\/$/, "")}/${fileName}`);
  urls.push(`${base}/HEAD/${fileName}`);
  return urls;
};

/**
 * Fetches the first candidate URL that answers with a theme file and returns its @version.
 * @param {string[]} urls Candidate URLs.
 * @returns {Promise<string>} Upstream version, or a status word such as "not found" or "skipped".
 */
const fetchUpstreamVersion = async (urls) => {
  for (const url of urls) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (res.status === 429 || res.status === 403) return "skipped (rate limited)";
      if (!res.ok) continue;
      const meta = parseMeta(await res.text());
      return meta?.version ?? "no @version upstream";
    } catch {
      return "skipped (network)";
    }
  }
  return "not found";
};

/**
 * Prints a table of local versus upstream theme versions. Informational: always exits 0.
 * When GITHUB_STEP_SUMMARY is set, the same table is appended to the job summary.
 */
const main = async () => {
  const root = resolve(join(dirname(fileURLToPath(import.meta.url)), ".."));
  const rows = [];
  for (const file of listThemeFiles(root)) {
    const meta = parseMeta(readFileSync(join(root, file), "utf8"));
    if (!meta?.source) continue;
    const urls = candidateUrls(meta.source, basename(file));
    if (!urls.length) {
      rows.push([file, meta.version ?? "?", "-", "source is not on GitHub"]);
      continue;
    }
    const upstream = await fetchUpstreamVersion(urls);
    let status = "check manually";
    if (/^\d/.test(upstream) && meta.version) {
      const cmp = compareVersions(meta.version, upstream);
      status = cmp === 0 ? "up to date" : cmp < 0 ? "OUTDATED" : "local is newer";
    }
    rows.push([file, meta.version ?? "?", upstream, status]);
  }
  const lines = ["| Theme | Local | Upstream | Status |", "| --- | --- | --- | --- |", ...rows.map((r) => `| ${r.join(" | ")} |`)];
  console.log(lines.join("\n"));
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join("\n") + "\n");
};

await main();
