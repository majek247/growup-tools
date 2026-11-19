import Papa from "papaparse";

function fail(message) {
  throw new Error(message);
}
function number(raw, label, max = Infinity) {
  const value = Number(raw);
  if (
    !String(raw).trim() ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > max
  ) {
    fail(
      "Check " +
        label +
        ". Enter a non-negative number" +
        (max === 100 ? " up to 100." : "."),
    );
  }
  return value;
}
function positive(value, label) {
  if (value <= 0) fail(label + " must be greater than zero.");
  return value;
}
function url(value) {
  try {
    const parsed = new URL(value);
    if (["http:", "https:"].includes(parsed.protocol)) return parsed;
  } catch {}
  fail("Enter a full http or https URL.");
}
function csv(raw, headers) {
  const parsed = Papa.parse(raw.trim(), {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (s) => s.trim().toLowerCase(),
    transform: (s) => s.trim(),
  });
  if (
    parsed.errors.length ||
    headers.some((h) => !parsed.meta.fields?.includes(h))
  )
    fail(
      "Use the CSV headers " +
        headers.join(", ") +
        ". Quote values containing commas.",
    );
  if (!parsed.data.length) fail("Add at least one data row.");
  parsed.data.forEach((row, i) => {
    if (headers.some((h) => !row[h])) fail("Complete CSV row " + (i + 2) + ".");
  });
  return parsed.data;
}
const fmt = (n) => n.toLocaleString("en-GB", { maximumFractionDigits: 2 });
const money = (n) => "£" + fmt(n);
const stats = (entries) => ({
  kind: "stats",
  entries,
  text: entries.map(([k, v]) => k + ": " + v).join("\n"),
});
const file = (name, text) => ({ kind: "file", name, text });
function table(headers, rows) {
  return {
    kind: "table",
    headers,
    rows,
    text: Papa.unparse([headers, ...rows], { escapeFormulae: true }),
    name: "results.csv",
  };
}
export function run(tool, values) {
  const v = Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, String(value).trim()]),
  );
  for (const field of tool.fields)
    if (!v[field.key] && field.key !== "content")
      fail("Complete " + field.label + ".");
  const n = (key) =>
    number(v[key], tool.fields.find((f) => f.key === key).label);
  const pct = (key) =>
    number(v[key], tool.fields.find((f) => f.key === key).label, 100) / 100;
  switch (tool.slug) {
    case "organic-revenue-calculator": {
      const deals = Math.ceil(n("arr") / positive(n("acv"), "Contract value"));
      const opps = Math.ceil(deals / positive(pct("win"), "Win rate"));
      return stats([
        [
          "Organic visits needed",
          fmt(Math.ceil(opps / positive(pct("convert"), "Visit conversion"))),
        ],
        ["Qualified opportunities", fmt(opps)],
        ["Closed-won deals", fmt(deals)],
        ["Qualified pipeline", money(opps * n("acv"))],
      ]);
    }
    case "content-refresh-planner": {
      const target = pct("ctr");
      const rows = csv(v.csv, ["page", "impressions", "clicks"]).map((r) => {
        const impressions = number(r.impressions, "impressions");
        const clicks = number(r.clicks, "clicks", impressions);
        return [
          r.page,
          impressions,
          clicks,
          Math.max(0, Math.round(impressions * target) - clicks),
        ];
      });
      return table(
        ["Page", "Impressions", "Clicks", "Potential extra clicks"],
        rows.sort((a, b) => b[3] - a[3]),
      );
    }
    case "llms-txt-generator": {
      const sections = new Map();
      const escape = (text) =>
        text.replace(/[[\]\\]/g, "\\$&").replace(/[\r\n]+/g, " ");
      for (const row of csv(v.csv, [
        "section",
        "title",
        "url",
        "description",
      ])) {
        if (!sections.has(row.section)) sections.set(row.section, []);
        sections
          .get(row.section)
          .push(
            "- [" +
              escape(row.title) +
              "](<" +
              url(row.url).href +
              ">): " +
              escape(row.description),
          );
      }
      const groups = [...sections].map(
        ([k, lines]) => "## " + escape(k) + "\n\n" + lines.join("\n"),
      );
      return file(
        "llms.txt",
        ["# " + v.brand, "> " + v.summary, ...groups].join("\n\n") + "\n",
      );
    }
    case "content-roi-calculator": {
      const cost = positive(n("spend"), "Programme cost");
      const unit = n("acv") * pct("margin");
      const profit = n("wins") * unit;
      return stats([
        ["First-year ROI", fmt(((profit - cost) / cost) * 100) + "%"],
        ["Attributed gross profit", money(profit)],
        ["Net return", money(profit - cost)],
        [
          "Customers to break even",
          unit
            ? fmt(Math.ceil(cost / unit))
            : "Unreachable at zero gross profit",
        ],
      ]);
    }
    case "editorial-capacity-planner": {
      const available = n("hours") * n("weeks");
      const per = positive(
        n("brief") + n("draft") + n("edit"),
        "Total hours per article",
      );
      const articles = Math.floor(available / per);
      return stats([
        ["Articles this cycle", fmt(articles)],
        ["Available hours", fmt(available)],
        ["Hours per article", fmt(per)],
        ["Hours remaining", fmt(available - articles * per)],
      ]);
    }
    
    case "buyer-prompt-generator": {
      const { category: c, buyer: b, integration: i, competitor: k } = v;
      return table(
        ["Intent", "Buyer prompt"],
        [
          ["Shortlist", "Which " + c + " should " + b + " shortlist?"],
          ["Integration", "Which " + c + " integrates with " + i + "?"],
          [
            "Alternatives",
            "What are the best alternatives to " + k + " for " + b + "?",
          ],
          ["Pricing", "What should " + b + " budget for " + c + "?"],
          [
            "Implementation",
            "How long does it take to implement " + c + " alongside " + i + "?",
          ],
          [
            "Proof",
            "Which " +
              c +
              " vendors have published case studies from " +
              b +
              "?",
          ],
          [
            "Comparison",
            "How does " +
              k +
              " compare with other " +
              c +
              " for " +
              i +
              " users?",
          ],
          [
            "Procurement",
            "What should " +
              b +
              " ask " +
              c +
              " vendors before signing a contract?",
          ],
        ],
      );
    }
    case "serp-snippet-preview":
      return {
        kind: "snippet",
        url: url(v.url).href,
        title: v.title,
        description: v.description,
        text: [v.url, v.title, v.description].join("\n"),
      };
    case "faq-schema-generator": {
      const entities = csv(v.csv, ["question", "answer"]).map((r) => ({
        "@type": "Question",
        name: r.question,
        acceptedAnswer: { "@type": "Answer", text: r.answer },
      }));
      return file(
        "faq-schema.json",
        JSON.stringify(
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: entities,
          },
          null,
          2,
        ).replace(/</g, "\\u003c"),
      );
    }
    case "campaign-url-builder": {
      const link = url(v.url);
      for (const key of ["source", "medium", "campaign", "content"]) {
        const tag = "utm_" + key;
        if (v[key]) link.searchParams.set(tag, v[key]);
        else link.searchParams.delete(tag);
      }
      return file("campaign-url.txt", link.href);
    }
    case "ctr-opportunity-calculator": {
      const impressions = positive(n("impressions"), "Impressions");
      const clicks = number(v.clicks, "clicks", impressions);
      const extra = Math.max(0, Math.round(impressions * pct("ctr")) - clicks);
      return stats([
        ["Additional monthly clicks", fmt(extra)],
        ["Current CTR", fmt((100 * clicks) / impressions) + "%"],
        ["Potential extra demos", fmt(extra * pct("demo"))],
      ]);
    }
    default:
      fail("Unknown tool.");
  }
}
