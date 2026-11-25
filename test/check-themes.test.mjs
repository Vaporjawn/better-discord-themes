import { strictEqual } from "node:assert";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const script = join(here, "..", "scripts", "check-themes.mjs");

/**
 * Runs the validator against a fixture folder.
 * @param {string} fixture Folder name under test/fixtures.
 * @returns {{status: number | null, stdout: string}} Exit status and output.
 */
const run = (fixture) => {
  const result = spawnSync("node", [script, join(here, "fixtures", fixture)], { encoding: "utf8" });
  return { status: result.status, stdout: result.stdout };
};

test("a theme with a complete header passes", () => {
  strictEqual(run("good").status, 0);
});

test("a theme missing @source fails and names the tag", () => {
  const result = run("bad");
  strictEqual(result.status, 1);
  strictEqual(result.stdout.includes("missing @source"), true);
});
