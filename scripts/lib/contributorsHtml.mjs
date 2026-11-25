/**
 * Builds the avatar list for the README Contributors section from GitHub contributor records.
 * Bots are left out and the order of the input (most commits first) is kept.
 * @param {{login: string, type: string}[]} contributors Records from the GitHub contributors API.
 * @returns {string} One linked avatar per line.
 */
const contributorsHtml = (contributors) =>
  contributors
    .filter((person) => person.type === "User" && /^[A-Za-z0-9-]+$/.test(person.login))
    .map(
      ({ login }) =>
        `<a href="https://github.com/${login}"><img src="https://github.com/${login}.png?size=64" width="64" height="64" alt="${login}" title="${login}"></a>`,
    )
    .join("\n");

export default contributorsHtml;
