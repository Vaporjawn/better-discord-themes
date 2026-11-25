import assert from "node:assert/strict";
import test from "node:test";
import contributorsHtml from "../scripts/lib/contributorsHtml.mjs";
import replaceBetweenMarkers from "../scripts/lib/replaceBetweenMarkers.mjs";

test("contributorsHtml lists people in order and skips bots and odd logins", () => {
  const html = contributorsHtml([
    { login: "alice", type: "User" },
    { login: "dependabot[bot]", type: "Bot" },
    { login: 'x"><script>', type: "User" },
    { login: "bob", type: "User" },
  ]);
  assert.equal(html.split("\n").length, 2);
  assert.ok(html.indexOf("alice") < html.indexOf("bob"));
  assert.ok(!html.includes("dependabot") && !html.includes("script"));
});

test("replaceBetweenMarkers swaps only the marked block", () => {
  const out = replaceBetweenMarkers("a\n<!-- B -->\nold\n<!-- E -->\nz", "<!-- B -->", "<!-- E -->", "new");
  assert.equal(out, "a\n<!-- B -->\nnew\n<!-- E -->\nz");
  assert.throws(() => replaceBetweenMarkers("none", "<!-- B -->", "<!-- E -->", "x"));
});
