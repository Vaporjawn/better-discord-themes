const RAW_BASE = "https://raw.githubusercontent.com/Vaporjawn/better-discord-themes/main/";

/**
 * Builds the raw.githubusercontent.com URL for a file in this repo.
 * @param {string} relativePath Path relative to the repo root, with forward slashes.
 * @returns {string} URL-encoded raw URL on the main branch.
 */
const rawUrl = (relativePath) => RAW_BASE + relativePath.split("/").map(encodeURIComponent).join("/");

export default rawUrl;
