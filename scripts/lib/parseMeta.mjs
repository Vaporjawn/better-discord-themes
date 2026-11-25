/**
 * Reads the leading BetterDiscord meta block (the first slash-star comment) of a theme file.
 * Handles a UTF-8 byte-order mark and the indentation variants used by different authors.
 * @param {string} cssText Full text of a theme file.
 * @returns {Record<string, string> | null} Map of tag name to value, or null when there is no meta block with `@name`.
 */
const parseMeta = (cssText) => {
  const text = cssText.replace(/^﻿/, "");
  const block = text.match(/\/\*[\s\S]*?\*\//);
  if (!block || !/@name\b/.test(block[0])) return null;
  const meta = {};
  for (const line of block[0].split("\n")) {
    const tag = line.match(/^\s*(?:\/\*+|\*)?\s*@(\w+)[ \t]+(.*?)\s*(?:\*\/)?$/);
    if (tag && !(tag[1] in meta)) meta[tag[1]] = tag[2];
  }
  return meta;
};

export default parseMeta;
