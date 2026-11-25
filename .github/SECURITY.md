# Security policy

Themes are CSS, but a theme can still load remote files (`@import`, `url()`),
which can leak your IP address or load unexpected content.

## Reporting

If you find a theme in this repo that loads a malicious or unexpected remote
resource, or any other security problem, please report it privately through
[GitHub private vulnerability reporting](https://github.com/Vaporjawn/better-discord-themes/security/advisories/new)
or email victor.williams.dev@gmail.com. Do not open a public issue first.

You will get a response within 7 days. Confirmed problems are fixed or the
affected theme is removed.

## Before installing a theme

Read the `@import` and `url(...)` lines. Only trust hosts you recognize.
