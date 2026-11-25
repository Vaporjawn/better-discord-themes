# Contributing

Thanks for helping. This repo is a collection of BetterDiscord themes, so most
contributions are one of: add a theme, fix a theme, or improve the docs.

## Quick start

1. Fork the repo and clone your fork.
2. Create a branch in your fork for the change.
3. Make the change, then run the checks: `python3 scripts/validate-themes.py`.
4. Push and open a pull request using the template.

## Adding a theme

- Put the file in the repo root as `<Name>.theme.css`.
- Start it with a BetterDiscord meta block. These fields are required:

  ```css
  /**
   * @name Example
   * @author Your Name
   * @version 1.0.0
   * @source https://github.com/you/example
   */
  ```

- You may only add a theme you wrote or one whose license allows redistribution.
  State the license in the pull request and add a row to
  [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) with the author, source and
  license. Themes with no license cannot be accepted without the author's
  permission.
- Do not add the old `//META{...}*//` header; BetterDiscord no longer lists
  themes that use it.

## Fixing a theme

Discord changes its class names often. When you fix a broken selector, say in
the pull request which Discord client version you tested against and attach a
before and after screenshot. If the theme has an upstream repository, send the
fix there too.

## Style

- Two-space indentation, LF line endings (see `.editorconfig`).
- Prefer CSS variables at the top of the file for anything a user may want to
  change.
- Keep changes to one theme per pull request.

## Reporting problems

Use the issue templates. For a broken theme include the theme name, your
BetterDiscord version, your operating system and a screenshot.

## Conduct

By taking part you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
Contributions to original material are accepted under the MIT license in
[LICENSE](LICENSE).
