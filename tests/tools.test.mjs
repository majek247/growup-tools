import test from "node:test";
import assert from "node:assert/strict";
import { workbenchTools as tools } from "../lib/catalog.mjs";
import { run } from "../lib/run.mjs";

const examples = [
  /8,000/,
  /\/integrations,18000,270,270/,
  /## Documentation/,
  /92%/,
  /Articles this cycle: 12/,
  /Workday/,
  /Employee Benefits Software/,
  /FAQPage/,
  /utm_source=linkedin/,
  /Additional monthly clicks: 375/,
];
for (const [i, tool] of tools.entries()) {
  const values = Object.fromEntries(tool.fields.map((f) => [f.key, f.value]));
  test(tool.name, () => {
    assert.match(run(tool, values).text, examples[i]);
    assert.throws(() => run(tool, { ...values, [tool.fields[0].key]: "" }));
  });
}
test("Invalid probability and zero divisor", () => {
  const tool = tools[0];
  assert.throws(() => run(tool, { arr: 1000, acv: 100, win: 101, convert: 1 }));
  assert.throws(() => run(tool, { arr: 1000, acv: 100, win: 0, convert: 1 }));
});
test("Quoted FAQ values round-trip", () => {
  const result = run(tools.find((tool) => tool.slug === "faq-schema-generator"), {
    csv: 'question,answer\n"Is it free, really?","Yes, always."',
  });
  assert.equal(
    JSON.parse(result.text).mainEntity[0].acceptedAnswer.text,
    "Yes, always.",
  );
});
test("Campaign URL preserves existing query and fragment", () => {
  const result = run(tools.find((tool) => tool.slug === "campaign-url-builder"), {
    url: "https://example.com/?a=1&utm_content=old#part",
    source: "x",
    medium: "social",
    campaign: "new",
    content: "",
  });
  const url = new URL(result.text);
  assert.equal(url.searchParams.get("a"), "1");
  assert.equal(url.hash, "#part");
  assert.equal(url.searchParams.has("utm_content"), false);
});
