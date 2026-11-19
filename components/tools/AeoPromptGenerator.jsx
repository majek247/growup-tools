import { useState } from "react";
import Papa from "papaparse";

export const faqs = [
  {
    question: "Which parts of a sales call should I paste?",
    answer:
      "Use the discovery, product evaluation and procurement discussion. Keep speaker labels when available. Enter the names of your team’s speakers to exclude their turns, including continuation lines. Review unlabelled notes before copying prompts.",
  },
  {
    question: "Can I use the website mode with just a URL?",
    answer:
      "Paste relevant product, pricing or integration copy alongside the website address. The generator reads the text you supply locally. The address identifies the source in the editor.",
  },
  {
    question: "How are the prompts generated?",
    answer:
      "The editor uses local rules to extract questions, identify common buying requirements and build tests around your category, audience and competitors. Open Source note to see which wording informed a prompt. Suggested tests fill the remaining slots.",
  },
  {
    question: "Which prompts should count towards my AI visibility baseline?",
    answer:
      "Start with Unbranded prompts. These let you record whether your brand appears without being named in the question. Track competitor-led comparisons and named-brand research separately.",
  },
  {
    question: "How do I repeat the test next month?",
    answer:
      "Export the test sheet. Record the platform, date, run, brand recommendation and cited URLs for each response. Repeat with the same wording, platform and number of runs. If an AI Overview does not appear, record that in Notes.",
  },
  {
    question: "Where are my transcripts stored?",
    answer:
      "The component processes pasted text in this tab without an API request or browser storage. Refreshing clears the draft. Exports contain your prompts, which can reuse source wording. Check them before sharing.",
  },
];
const blank = {
  brand: "",
  category: "",
  audience: "",
  competitors: "",
  team: "",
  calls: "",
  url: "",
  website: "",
};
const example = {
  brand: "Harbour Benefits",
  category: "employee benefits software",
  audience: "UK HR teams with 500 employees",
  competitors: "Ben, Humaans, Zest",
  team: "Alex",
  calls:
    "Alex: What prompted the search?\nPriya: Can you sync enrolment changes with Workday?\nPriya: We need to compare benefit allowances across three countries.\nSam: How do you handle employees who join halfway through the year?\nSam: What does implementation cost if we migrate during open enrolment?\nAlex: Shall I send a proposal?\nPriya: Is single sign-on included in the base plan?",
  url: "https://example.com/benefits",
  website:
    "Sync employee eligibility with Workday. Compare benefit allowances across countries. Single sign-on and audit logs are included on the enterprise plan.",
};
const stages = ["Discovery", "Requirements", "Shortlist", "Brand research"];
const quotas = [6, 7, 7, 5];
const normal = (s) =>
  s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
const list = (s) =>
  Array.from(
    new Map(
      s
        .split(/[,;\n]/)
        .map((x) => x.trim())
        .filter(Boolean)
        .map((x) => [normal(x), x]),
    ).values(),
  );
const contains = (s, name) =>
  (" " + normal(s) + " ").includes(" " + normal(name) + " ");

function passages(source, mode, team) {
  const skip = new Set(list(team).map(normal));
  let speaker = "";
  const items = [];
  for (const raw of source.split(/\r?\n/)) {
    let line = raw.trim();
    if (!line || /^\d+$|-->|^WEBVTT$/.test(line)) continue;
    if (mode === "calls") {
      line = line.replace(
        /^\[?(?:\d{1,2}:)?\d{1,2}:\d{2}(?:[.,]\d+)?\]?\s*/,
        "",
      );
      const match = line.match(
        /^([\p{L}][\p{L}\p{N} ._'()’-]{0,48}):\s*(.*)$/u,
      );
      if (match) {
        speaker = match[1].trim();
        line = match[2].trim();
      }
      if (skip.has(normal(speaker))) continue;
    }
    for (const sentence of line.match(/[^.!?\n]+[.!?]?/g) || []) {
      const text = sentence.trim();
      if (text.length >= 12 && text.length <= 450)
        items.push({ text, speaker });
    }
  }
  return items;
}

// Each signal has a buyer-facing question and retains the matching source sentence.
const signals = [
  [
    /\b(workday|snowflake|salesforce|hubspot|slack|netsuite|xero|sap|bigquery|okta|zapier)\b/i,
    (m, c) => "Which " + c + " integrates with " + m[0] + "?",
  ],
  [
    /\b(single sign-on|SSO|SAML)\b/i,
    (_, c) => "Which " + c + " includes single sign-on in its base price?",
  ],
  [
    /\b(audit logs?|audit trails?)\b/i,
    (_, c) => "Which " + c + " lets administrators export an audit trail?",
  ],
  [
    /\b(migrat\w*|switching)\b/i,
    (_, c) => "What should we budget to migrate to new " + c + "?",
  ],
  [
    /\b(multiple countries|across (?:\w+ )?countries|multi-country)\b/i,
    (_, c) =>
      "Which " + c + " supports teams operating across several countries?",
  ],
  [
    /\b(GDPR|SOC 2|ISO 27001|data residency)\b/i,
    (m, c) =>
      "How do " + c + " providers document their approach to " + m[0] + "?",
  ],
  [
    /\b(API|webhooks?)\b/i,
    (m, c) =>
      "Which " +
      c +
      " providers publish documentation for " +
      m[0] +
      " access?",
  ],
  [
    /\b(implementation|onboarding)\b/i,
    (_, c) =>
      "How much implementation support is included when buying " + c + "?",
  ],
  [
    /\b(billing|price per seat|per employee|pricing)\b/i,
    (_, c) => "How do " + c + " vendors charge as headcount grows?",
  ],
  [
    /\b(reporting|dashboards?)\b/i,
    (_, c) =>
      "Which " + c + " offers reporting that business users can customise?",
  ],
];

function generate(form, mode) {
  const b = form.brand.trim(),
    c = form.category.trim(),
    a = form.audience.trim();
  if (!b || !c || !a)
    throw Error("Add your brand, software category and target buyer.");
  const rivals = list(form.competitors);
  if (
    rivals.length < 3 ||
    rivals.length > 5 ||
    rivals.some((x) => !normal(x) || normal(x) === normal(b))
  )
    throw Error("Enter 3–5 distinct competitors, excluding your own brand.");
  if (mode === "web") {
    let u;
    try {
      u = new URL(form.url);
    } catch {}
    if (
      !u ||
      !["http:", "https:"].includes(u.protocol) ||
      u.username ||
      u.password
    )
      throw Error("Enter a full website URL, including https://.");
  }
  const source = (mode === "calls" ? form.calls : form.website).trim();
  if (!source)
    throw Error(
      mode === "calls"
        ? "Paste the call transcript or buyer notes."
        : "Paste the website copy you want to use.",
    );
  const lines = passages(source, mode, form.team);
  if (!lines.length)
    throw Error(
      "Add a longer source passage or check the excluded speaker names.",
    );
  const groups = stages.map(() => []),
    seen = new Set();
  const sourceType = mode === "calls" ? "Call text" : "Website copy";
  function add(stage, prompt, evidence = "") {
    const key = normal(prompt);
    if (groups[stage].length >= quotas[stage] || seen.has(key)) return;
    seen.add(key);
    groups[stage].push({
      stage: stages[stage],
      prompt,
      source: evidence ? sourceType : "Suggested test",
      evidence,
    });
  }
  const note = (l) =>
    [mode === "calls" ? l.speaker : form.url.trim(), l.text]
      .filter(Boolean)
      .join(" — ");
  // Preserve specific questions, but give ambiguous vendor questions explicit context.
  for (const l of lines) {
    if (
      !l.text.endsWith("?") ||
      /\b(send a proposal|hear me|share my screen|see my screen|book a call|prompted the search)\b/i.test(
        l.text,
      )
    )
      continue;
    const named = contains(l.text, b);
    const stage = named
      ? 3
      : rivals.some((r) => contains(l.text, r))
        ? 2
        : /\b(shortlist|recommend|best|alternatives)\b/i.test(l.text)
          ? 0
          : 1;
    const question =
      named || contains(l.text, c)
        ? l.text
        : "When evaluating " +
          c +
          " for " +
          a +
          ", " +
          l.text.charAt(0).toLowerCase() +
          l.text.slice(1);
    add(
      stage,
      question
        .replace(/\bcan you\b/i, "can a vendor")
        .replace(/\bdo you\b/i, "do vendors"),
      note(l),
    );
  }
  // Turn stated requirements and unfamiliar product claims into evidence requests.
  // Keep the original wording visible, even when the copy uses niche terminology.
  const statements = lines.filter(
    (l) =>
      !l.text.endsWith("?") &&
      l.text.length <= 220 &&
      (mode === "web" ||
        /\b(need|want|must|struggle|looking for|have to|cannot|can't)\b/i.test(
          l.text,
        )),
  );
  for (const l of statements.slice(0, 3)) {
    const claim = l.text.replace(/[.!]+$/, "");
    const stage = contains(claim, b)
      ? 3
      : rivals.some((r) => contains(claim, r))
        ? 2
        : 1;
    const prompt =
      mode === "web"
        ? "What should " +
          a +
          " ask a " +
          c +
          " vendor to demonstrate for this claim: “" +
          claim +
          "”?"
        : "Which " +
          c +
          " vendors could meet this buyer requirement, and what evidence do they publish: “" +
          claim +
          "”?";
    add(stage, prompt, note(l));
  }
  for (const l of lines) {
    for (const [pattern, make] of signals) {
      const match = l.text.match(pattern);
      if (match) add(1, make(match, c), note(l));
    }
  }
  [
    "Which " + c + " should " + a + " shortlist first?",
    "What problems justify investing in " + c + " for " + a + "?",
    "When should " + a + " replace spreadsheets with " + c + "?",
    "Which categories of tools can " +
      a +
      " use before committing to " +
      c +
      "?",
    "What should a business case for " + c + " include for " + a + "?",
    "Which " +
      c +
      " providers publish customer examples relevant to " +
      a +
      "?",
  ].forEach((p) => add(0, p));
  [
    "Which integrations should " + a + " verify in a " + c + " demo?",
    "What does a typical " + c + " rollout cost for " + a + "?",
    "How should " + a + " evaluate data export options in " + c + "?",
    "What security evidence should " + a + " request from " + c + " vendors?",
    "Which " + c + " plans include onboarding and support?",
    "What acceptance tests should " + a + " run during a " + c + " pilot?",
    "How should " + a + " model the three-year cost of " + c + "?",
  ].forEach((p) => add(1, p));
  rivals.forEach((r) =>
    add(
      2,
      "How do " + b + " and " + r + " compare for " + a + " buying " + c + "?",
    ),
  );
  rivals.forEach((r) =>
    add(
      2,
      "Which alternatives to " +
        r +
        " should " +
        a +
        " consider for " +
        c +
        "?",
    ),
  );
  add(
    2,
    "How do " +
      rivals[0] +
      " and " +
      rivals[1] +
      " compare on rollout effort for " +
      a +
      "?",
  );
  [
    "Who is " + b + " best suited to, and where is it a poor fit?",
    "What does " + b + " charge and which costs depend on usage or team size?",
    "What do published reviews of " + b + " say about onboarding?",
    "Which integrations does " + b + " document for " + a + "?",
    "What evidence supports choosing " + b + " for " + c + "?",
  ].forEach((p) => add(3, p));
  return groups
    .flat()
    .map((row, i) => ({
      ...row,
      id: "P" + String(i + 1).padStart(2, "0"),
      scope: contains(row.prompt, b)
        ? "Brand named"
        : rivals.some((r) => contains(row.prompt, r))
          ? "Competitor named"
          : "Unbranded",
    }));
}
function Field({ label, value, change, area, placeholder }) {
  const props = { value, placeholder, onChange: (e) => change(e.target.value) };
  return (
    <label className="field" style={{ display: "block" }}>
      <strong style={{ fontSize: 13 }}>{label}</strong>
      {area ? <textarea rows={6} {...props} /> : <input {...props} />}
    </label>
  );
}
export default function AeoPromptGenerator() {
  const [form, setForm] = useState(blank),
    [mode, setMode] = useState("calls"),
    [rows, setRows] = useState([]),
    [scope, setScope] = useState("All"),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  function invalidate() {
    setRows([]);
    setScope("All");
    setNotice("");
    setError("");
  }
  function field(key, label, area = false, placeholder = "") {
    return (
      <Field
        label={label}
        value={form[key]}
        change={(value) => {
          setForm({ ...form, [key]: value });
          invalidate();
        }}
        area={area}
        placeholder={placeholder}
      />
    );
  }
  function submit(e) {
    e.preventDefault();
    try {
      const result = generate(form, mode);
      setRows(result);
      setScope("All");
      setNotice("25 prompts ready.");
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }
  function loadExample() {
    if (
      Object.values(form).some(Boolean) &&
      !window.confirm("Replace these inputs with the example?")
    )
      return;
    setForm({ ...example });
    invalidate();
  }
  const visible = rows.filter((r) => scope === "All" || r.scope === scope);
  async function copy() {
    try {
      await navigator.clipboard.writeText(
        visible.map((r) => r.id + " · " + r.prompt).join("\n"),
      );
      setNotice("Copied " + visible.length + " prompts.");
    } catch {
      setNotice("Clipboard unavailable. Use Download test sheet.");
    }
  }
  function download() {
    const fields = [
      "Prompt ID",
      "Buyer stage",
      "Test type",
      "Source",
      "Prompt",
      "Platform",
      "Date",
      "Run",
      "Brand recommended",
      "Cited URLs",
      "Notes",
    ];
    const csv = Papa.unparse(
      {
        fields,
        data: visible.map((r) => [
          r.id,
          r.stage,
          r.scope,
          r.source,
          r.prompt,
          "",
          "",
          "",
          "",
          "",
          "",
        ]),
      },
      { escapeFormulae: true },
    );
    const url = URL.createObjectURL(
      new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "aeo-prompt-tests.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    setNotice("Exported " + visible.length + " prompts.");
  }
  return (
    <div className="aeo">
      <form onSubmit={submit} className="editor panel">
        <div className="head">
          <h2>Your buyer inputs</h2>
          <button type="button" onClick={loadExample}>
            Load SaaS example
          </button>
        </div>
        <div className="modes" role="group" aria-label="Source type">
          {[
            ["calls", "Sales calls"],
            ["web", "Website copy"],
          ].map(([key, name]) => (
            <button
              type="button"
              key={key}
              aria-pressed={mode === key}
              onClick={() => {
                if (mode !== key) {
                  setMode(key);
                  invalidate();
                }
              }}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="pair">
          {field("brand", "Brand name", false, "e.g. Harbour Benefits")}
          {field(
            "category",
            "Software category",
            false,
            "e.g. employee benefits software",
          )}
        </div>
        {field(
          "audience",
          "Who buys it?",
          false,
          "e.g. UK HR teams with 500 employees",
        )}
        {field(
          "competitors",
          "Competitors (3–5, separated by commas)",
          false,
          "e.g. Ben, Humaans, Zest",
        )}
        <div className="sourceBox">
          {mode === "calls" ? (
            <>
              {field(
                "team",
                "Your team’s speaker names (optional)",
                false,
                "Use the labels from the transcript, separated by commas",
              )}
              {field(
                "calls",
                "Transcript or buyer notes",
                true,
                "Priya: Can you sync enrolment changes with Workday?",
              )}
            </>
          ) : (
            <>
              {field("url", "Website URL", false, "https://yourcompany.com")}
              {field(
                "website",
                "Copy from your product, pricing or integration pages",
                true,
                "Paste relevant page text here.",
              )}
            </>
          )}
        </div>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <button className="primary" type="submit">
          Generate 25 buyer prompts →
        </button>
      </form>
      <section className="resultsPanel panel">
        <h2>Your prompt test sheet</h2>
        {!rows.length ? (
          <p className="hint">
            Generate your list to see the buyer stage, wording and source behind
            each prompt. Load the example to try it with a sample buying
            conversation.
          </p>
        ) : (
          <>
            <p className="hint">
              {rows.length} prompts · {rows.filter((r) => r.evidence).length}{" "}
              grounded in {mode === "calls" ? "call text" : "website copy"} ·{" "}
              {list(form.competitors).length} competitors
            </p>
            <div className="modes" role="group" aria-label="Filter tests">
              {["All", "Unbranded", "Competitor named", "Brand named"].map(
                (f) => (
                  <button
                    key={f}
                    aria-pressed={scope === f}
                    onClick={() => {
                      setScope(f);
                      setNotice("");
                    }}
                  >
                    {f} (
                    {f === "All"
                      ? rows.length
                      : rows.filter((r) => r.scope === f).length}
                    )
                  </button>
                ),
              )}
            </div>
            <div className="exports">
              <button disabled={!visible.length} onClick={copy}>
                Copy {visible.length} prompts
              </button>
              <button disabled={!visible.length} onClick={download}>
                Download test sheet
              </button>
            </div>
            {stages.map((stage) => {
              const group = visible.filter((r) => r.stage === stage);
              return (
                group.length > 0 && (
                  <section key={stage} className="group">
                    <h3>{stage}</h3>
                    {group.map((r) => (
                      <article key={r.id}>
                        <small>
                          {r.id} · {r.scope} · {r.source}
                        </small>
                        <p>{r.prompt}</p>
                        {r.evidence && (
                          <details>
                            <summary>Source note</summary>
                            <blockquote>{r.evidence}</blockquote>
                          </details>
                        )}
                      </article>
                    ))}
                  </section>
                )
              );
            })}
          </>
        )}
        <p role="status" className="status">
          {notice}
        </p>
      </section>
      <style jsx>{`
        .aeo {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: 22px;
          align-items: start;
        }
        .panel {
          min-width: 0;
        }
        .head,
        .modes,
        .exports {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }
        .head {
          justify-content: space-between;
          gap: 12px;
        }
        .aeo h2 {
          font-size: 24px;
          letter-spacing: -0.05em;
        }
        .modes,
        .exports {
          margin: 16px 0;
        }
        .pair {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 10px;
        }
        .sourceBox {
          border-top: 1px solid #c6d7cf;
          margin: 20px 0;
        }
        .resultsPanel {
          background: #edf5f1;
        }
        .hint,
        .status {
          font-size: 13px;
          color: #46635d;
          line-height: 1.6;
          margin: 10px 0;
        }
        .aeo button {
          background: white;
          border: 1px solid #b9cec5;
          border-radius: 7px;
          color: #105750;
          padding: 8px 12px;
          font: inherit;
          font-size: 12px;
          font-weight: 650;
          cursor: pointer;
        }
        .aeo button[aria-pressed="true"],
        .aeo .primary {
          background: #105852;
          color: white;
        }
        .aeo .primary {
          width: 100%;
          padding: 12px;
        }
        .group {
          margin: 22px 0;
        }
        .group h3 {
          font-size: 18px;
          margin-bottom: 8px;
        }
        .group article {
          background: white;
          border: 1px solid #cfdfd7;
          border-radius: 8px;
          padding: 12px 14px;
          margin: 7px 0;
          overflow-wrap: anywhere;
        }
        .group small {
          color: #34685e;
          font:
            11px/1.5 ui-monospace,
            monospace;
        }
        .group p {
          font-size: 14px;
          margin: 5px 0;
        }
        .group details {
          border: 0;
          padding: 4px 0;
        }
        .group summary,
        .group blockquote {
          font-size: 12px;
          color: #486661;
        }
        .group blockquote {
          margin: 6px 0;
          border-left: 2px solid #a3c9ba;
          padding-left: 10px;
        }
        .error {
          color: #8f351c;
          font-size: 13px;
          margin: 10px 0;
        }
        @media (max-width: 800px) {
          .aeo {
            grid-template-columns: 1fr;
          }
          .pair {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }
      `}</style>
    </div>
  );
}
