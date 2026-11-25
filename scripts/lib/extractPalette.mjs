/**
 * Converts an HSL color to RGB.
 * @param {number} h Hue in degrees.
 * @param {number} s Saturation, 0 to 1.
 * @param {number} l Lightness, 0 to 1.
 * @returns {number[]} Red, green and blue, 0 to 255.
 */
const hslToRgb = (h, s, l) => {
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
};

/**
 * Pulls every literal color out of a stylesheet: hex, rgb(), hsl() and the bare
 * `--name: r, g, b;` custom-property form that many Discord themes use.
 * @param {string} css Stylesheet text.
 * @returns {number[][]} One [r, g, b] entry per occurrence.
 */
const findColors = (css) => {
  const out = [];
  for (const m of css.matchAll(/#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g)) {
    const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join("") : m[1].slice(0, 6);
    out.push([0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)));
  }
  for (const m of css.matchAll(/rgba?\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})/g)) out.push([+m[1], +m[2], +m[3]]);
  for (const m of css.matchAll(/--[\w-]+\s*:\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*[;}]/g)) out.push([+m[1], +m[2], +m[3]]);
  for (const m of css.matchAll(/hsla?\(\s*(\d{1,3}(?:\.\d+)?)(?:deg)?\s*[, ]\s*(\d{1,3}(?:\.\d+)?)%\s*[, ]\s*(\d{1,3}(?:\.\d+)?)%/g)) {
    out.push(hslToRgb(+m[1], +m[2] / 100, +m[3] / 100));
  }
  return out.filter((c) => c.every((v) => v >= 0 && v <= 255));
};

/**
 * Picks the colors a theme actually uses most, for a preview strip. Pure white and
 * pure black are ignored, near-duplicates are merged, and the result is ordered dark to light.
 * @param {string} css Stylesheet text of one theme.
 * @param {number} [limit] Maximum number of colors.
 * @returns {string[]} Up to `limit` hex colors such as "#1e1f22"; empty when the file has few literal colors.
 */
const extractPalette = (css, limit = 5) => {
  const counts = new Map();
  for (const c of findColors(css)) {
    if (c.every((v) => v >= 250) || c.every((v) => v <= 5)) continue;
    const key = c.join(",");
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k.split(",").map(Number));
  const picked = [];
  for (const c of ranked) {
    if (picked.every((p) => Math.hypot(p[0] - c[0], p[1] - c[1], p[2] - c[2]) > 56)) picked.push(c);
    if (picked.length === limit) break;
  }
  if (picked.length < 2) return [];
  const luma = (c) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return picked.sort((a, b) => luma(a) - luma(b)).map((c) => "#" + c.map((v) => v.toString(16).padStart(2, "0")).join(""));
};

export default extractPalette;
