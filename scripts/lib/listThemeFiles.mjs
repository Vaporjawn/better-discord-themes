import { readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Lists every hand-picked BetterDiscord theme: the `*.theme.css` files in `curated/`.
 * `themes/` (the vendored catalog), `archive/` and `vendor/` are skipped on purpose.
 * @param {string} root Absolute path of the repo (or fixture) root.
 * @returns {string[]} Paths relative to `root`, sorted, using forward slashes.
 */
const listThemeFiles = (root) => {
  let names = [];
  try {
    names = readdirSync(join(root, "curated"));
  } catch {
    return [];
  }
  return names
    .filter((name) => name.endsWith(".theme.css"))
    .map((name) => `curated/${name}`)
    .sort((a, b) => a.localeCompare(b));
};

export default listThemeFiles;
