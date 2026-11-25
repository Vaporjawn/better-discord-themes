import { readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Lists every BetterDiscord theme file that the repo ships: `*.theme.css` in the
 * root folder and in the `New Themes` folder. `archive/` and `vendor/` are skipped on purpose.
 * @param {string} root Absolute path of the repo (or fixture) root.
 * @returns {string[]} Paths relative to `root`, sorted, using forward slashes.
 */
const listThemeFiles = (root) => {
  const folders = ["", "New Themes"];
  const found = [];
  for (const folder of folders) {
    let names = [];
    try {
      names = readdirSync(join(root, folder));
    } catch {
      continue;
    }
    for (const name of names) {
      if (name.endsWith(".theme.css")) found.push(folder ? `${folder}/${name}` : name);
    }
  }
  return found.sort((a, b) => a.localeCompare(b));
};

export default listThemeFiles;
