const REQUIRED_TAGS = ["name", "author", "version", "description", "source"];

/**
 * Checks a parsed meta block against the repo's requirements.
 * @param {Record<string, string> | null} meta Result of `parseMeta`.
 * @returns {string[]} Human-readable problems; empty when the header is valid.
 */
const validateMeta = (meta) => {
  if (!meta) return ["no /** ... */ meta block with @name"];
  const problems = [];
  for (const tag of REQUIRED_TAGS) {
    if (!meta[tag]) problems.push(`missing @${tag}`);
  }
  if (meta.source && !/^https:\/\//.test(meta.source)) problems.push("@source is not an https URL");
  return problems;
};

export default validateMeta;
