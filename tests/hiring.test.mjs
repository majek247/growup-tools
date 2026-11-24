import test from "node:test";
import assert from "node:assert/strict";
import {
  suggest,
  commitment,
  samples,
  unknown,
} from "../lib/proposalAnalysis.mjs";
import { tools, topics } from "../lib/catalog.mjs";
import { retiredPlannerSlugs } from "../lib/hiringCatalog.mjs";
test("Agency hiring includes the brief builders and omits retired pages", () => {
  for (const slug of ["seo-agency-brief-builder"]) {
    assert.equal(tools.filter(t => t.slug === slug && t.topic === "Agency hiring").length, 1);
  }
  assert.ok(topics.includes("Agency hiring"));
  assert.ok(tools.every((t) => !retiredPlannerSlugs.has(t.slug)));
});
test("Compare minimums and distinguish omitted scope", () => {
  const [a, b] = samples.map((x) => suggest(x.text));
  assert.equal(commitment(a), "£24,000");
  assert.equal(commitment(b), "£15,000");
  assert.equal(a.interviews.value, unknown);
  assert.match(b.interviews.proof, /SME/);
});
test("Unknown setup, tiered fees or different currencies leave the commitment open", () => {
  for (const input of [
    "Monthly fee £4,000.\nMinimum 6 months.",
    "Monthly fee from £4,000.\nMinimum 6 months.\nNo setup fee.",
    "Monthly fee £4,000.\nMinimum 6 months.\nSetup fee $500.",
  ])
    assert.equal(commitment(suggest(input)), unknown);
});
test("Includes a known one-off cost and parses decimal thousands", () => {
  assert.equal(
    commitment(
      suggest(
        "Monthly retainer: £3.5k.\nMinimum term: 3 months.\nSetup fee: £500.",
      ),
    ),
    "£11,000",
  );
});
