#!/usr/bin/env python3
"""Check that every root-level *.theme.css has a valid BetterDiscord meta block.

Usage: python3 scripts/validate-themes.py [folder]   (default: repo root)
Exits 1 and lists problems if any theme lacks a required field.
"""
import pathlib
import re
import sys

REQUIRED = ("name", "author", "version")


def check(path: pathlib.Path) -> list[str]:
    """Return the problems found in one theme file."""
    head = path.read_text(encoding="utf-8", errors="replace")[:4000]
    if head.lstrip().startswith("//META"):
        return ["legacy //META header (BetterDiscord will not list it)"]
    block = re.match(r"\s*/\*\*(.*?)\*/", head, re.S)
    if not block:
        return ["no /** ... */ meta block at the top"]
    found = set(re.findall(r"@(\w+)", block.group(1)))
    return [f"missing @{field}" for field in REQUIRED if field not in found]


def main() -> int:
    """Validate all themes under the given folder and print a report."""
    root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    themes = sorted(root.glob("*.theme.css"))
    failed = 0
    for theme in themes:
        for problem in check(theme):
            failed += 1
            print(f"{theme.name}: {problem}")
    print(f"checked {len(themes)} theme(s), {failed} problem(s)")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
