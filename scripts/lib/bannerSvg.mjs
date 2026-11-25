const TILE_W = 86;
const TILE_H = 68;
const GAP = 12;
const COLS = 6;
const MAX_ROWS = 3;

/**
 * Draws one theme tile: vertical bands of its palette, or a flat placeholder when it has none.
 * @param {string[]} colors The theme's palette.
 * @param {number} x Left edge.
 * @param {number} y Top edge.
 * @param {number} id Unique number for the clip path.
 * @returns {string} SVG markup.
 */
const tile = (colors, x, y, id) => {
  if (!colors.length) return `<rect x="${x}" y="${y}" width="${TILE_W}" height="${TILE_H}" rx="8" fill="#23252e"/>`;
  const band = TILE_W / colors.length;
  const rects = colors.map((c, i) => `<rect x="${(x + i * band).toFixed(2)}" y="${y}" width="${(band + 0.5).toFixed(2)}" height="${TILE_H}" fill="${c}"/>`).join("");
  return `<clipPath id="t${id}"><rect x="${x}" y="${y}" width="${TILE_W}" height="${TILE_H}" rx="8"/></clipPath><g clip-path="url(#t${id})">${rects}</g>`;
};

/**
 * Builds the README banner: the title on the left and a wall of theme palettes on the right.
 * @param {string[][]} palettes One palette per theme; themes without a palette are left out of the wall.
 * @param {number} count Number of hand-picked themes, shown in the subtitle.
 * @returns {string} SVG markup, 1280 by 360.
 */
const bannerSvg = (palettes, count) => {
  const shown = palettes.filter((p) => p.length).slice(0, COLS * MAX_ROWS);
  const rows = Math.max(1, Math.ceil(shown.length / COLS));
  const gridW = COLS * TILE_W + (COLS - 1) * GAP;
  const gridH = rows * TILE_H + (rows - 1) * GAP;
  const gx = 1280 - 72 - gridW;
  const gy = (360 - gridH) / 2;
  const tiles = [];
  for (let i = 0; i < shown.length; i += 1) {
    tiles.push(tile(shown[i], gx + (i % COLS) * (TILE_W + GAP), gy + Math.floor(i / COLS) * (TILE_H + GAP), i));
  }
  const font = 'font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif"';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="360" viewBox="0 0 1280 360" role="img" aria-label="Better Discord Themes">
<rect width="1280" height="360" rx="20" fill="#14151a"/>
<rect x="0.5" y="0.5" width="1279" height="359" rx="19.5" fill="none" stroke="#2c2f39"/>
<text x="72" y="150" ${font} font-size="62" font-weight="700" fill="#e8e9ee" letter-spacing="-1.5">Better Discord</text>
<text x="72" y="220" ${font} font-size="62" font-weight="700" fill="#e8e9ee" letter-spacing="-1.5">Themes</text>
<text x="72" y="272" ${font} font-size="22" fill="#9a9fae">${count} hand-picked BetterDiscord themes,</text>
<text x="72" y="302" ${font} font-size="22" fill="#9a9fae">each with its author, source and license.</text>
${tiles.join("\n")}
</svg>
`;
};

export default bannerSvg;
