/**
 * Draws a small rounded strip made of equal vertical bands, one per color.
 * @param {string[]} colors Hex colors, dark to light.
 * @returns {string} SVG markup, 120 by 16.
 */
const paletteSvg = (colors) => {
  const w = 120;
  const h = 16;
  const band = w / colors.length;
  const rects = colors.map((c, i) => `<rect x="${(i * band).toFixed(2)}" y="0" width="${(band + 0.5).toFixed(2)}" height="${h}" fill="${c}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Theme colors"><clipPath id="r"><rect width="${w}" height="${h}" rx="4"/></clipPath><g clip-path="url(#r)">${rects}</g></svg>\n`;
};

export default paletteSvg;
