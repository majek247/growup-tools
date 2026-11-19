import { useState } from "react";
import { Field, Tabs, Export, csv, s } from "./Shared";
export const faqs = [
  {
    question: "How large should the trial be?",
    answer:
      "The example asks for one defined section, with a time limit and an agreed fee. Set both before sending it. Give every candidate the same materials, deadline and instructions.",
  },
  {
    question: "How do I keep the review consistent?",
    answer:
      "Use the format-specific checks. Mark each as Missing, Partial or Meets and record a sentence or observation from the submission. Totals appear after every check has a rating.",
  },
  {
    question: "What do I send to candidates?",
    answer:
      "Copy the assignment from the first tab. The reviewer scorecard and decision notes are separate internal exports. Handle any publication or reuse agreement directly with the candidate.",
  },
];
const formats = {
  "Comparison page": {
    task: "Write the “Who each product suits” section for a buyer choosing between two vendors. Explain two differences that change the buying decision. Cite the supplied evidence and flag anything you cannot verify.",
    materials:
      "Product walkthrough, competitor pricing page and target buyer profile",
    checks: [
      "Explains which buyer should choose each product",
      "Links two material differences to source evidence",
      "Distinguishes documented capabilities from assumptions",
      "Makes trade-offs concrete in plain language",
    ],
  },
  "Customer case study": {
    task: "Use the customer interview to write the challenge and results sections. Include one attributable quote and one outcome with its baseline and period. Flag any figure that needs customer approval.",
    materials: "Interview excerpt, approved metrics and customer context",
    checks: [
      "Uses a customer quote accurately and in context",
      "Gives the outcome a baseline and time period",
      "Separates customer evidence from inferred causation",
      "Explains the workflow change behind the result",
    ],
  },
  "Expert-led article": {
    task: "Write one practical section addressing a specific buyer problem using the expert’s interview. Include a worked example, one exception and a verifiable source note.",
    materials: "Expert interview, reader role and product or process notes",
    checks: [
      "Preserves the expert’s meaning",
      "Gives the reader a specific action and example",
      "Explains when the advice does not apply",
      "Makes technical claims traceable to a source",
    ],
  },
};
const levels = ["Unreviewed", "Missing", "Partial", "Meets"];
const score = (level) => levels.indexOf(level) - 1;
const initial = {
  format: "Comparison page",
  audience: "",
  source: "",
  fee: "",
  time: "90 minutes",
  length: "350–500 words",
  due: "",
};
export default function ContentAgencyPaidTrialKit() {
  const [tab, setTab] = useState("Prepare trial"),
    [v, setV] = useState(initial),
    [reviews, setReviews] = useState({}),
    [decision, setDecision] = useState({});
  const set = (k, x) => {
    setV({ ...v, [k]: x });
  };
  const brief = formats[v.format],
    names = ["Sample A", "Sample B"];
  const result =
    v.audience.trim() &&
    v.source.trim() &&
    v.fee.trim() &&
    v.due &&
    v.time.trim() &&
    v.length.trim();
  const assignment = [
    "Paid content trial — " + v.format,
    "Reader: " + v.audience,
    "Assignment\n" + brief.task,
    "Source pack\n" + v.source,
    "Scope: " + v.length + " · Time box: " + v.time,
    "Agreed payment: " + v.fee,
    "Deadline: " + v.due,
    "Submit a draft plus a short list of sources and open questions. We will review evidence, buyer relevance, accuracy and clarity.",
  ].join("\n\n");
  const key = (n, i) => [v.format, n, i].join("/");
  const read = (n, i) =>
    reviews[key(n, i)] || { level: "Unreviewed", note: "" };
  const write = (n, i, k, x) =>
    setReviews({ ...reviews, [key(n, i)]: { ...read(n, i), [k]: x } });
  const total = (n) =>
    brief.checks.every((_, i) => read(n, i).level !== "Unreviewed")
      ? brief.checks.reduce((sum, _, i) => sum + score(read(n, i).level), 0) +
        " / 8"
      : "Incomplete";
  const verdict = decision[v.format] || { choice: "Undecided", reason: "" };
  const decisionCsv = csv([
    ["Assignment", v.format],
    ["Criterion", ...names.flatMap((n) => [n + " rating", n + " evidence"])],
    ...brief.checks.map((q, i) => [
      q,
      ...names.flatMap((n) => [read(n, i).level, read(n, i).note]),
    ]),
    ["Score", total(names[0]), "", total(names[1]), ""],
    ["Decision", verdict.choice],
    ["Reason", verdict.reason],
  ]);
  function example() {
    if (
      (v.source || v.fee || v.audience) &&
      !confirm("Replace the trial inputs with the example?")
    )
      return;
    setV({
      ...initial,
      audience: "UK HR directors choosing benefits software",
      source:
        "Fictional sample pack: Product A supports payroll file export; Product B includes an API on its enterprise tier. A buyer needs automated weekly updates. Pricing and connector availability need confirmation.",
      fee: "£250 fixed, payable on submission",
      due: "Within five working days of accepting the assignment",
    });
  }
  return (
    <section className={s.shell}>
      <Tabs
        names={["Prepare trial", "Review submissions"]}
        active={tab}
        change={setTab}
      />
      {tab === "Prepare trial" ? (
        <div className={s.grid}>
          <div className={s.panel}>
            <div className={s.head}>
              <h2>Set the assignment</h2>
              <button onClick={example}>Try sample trial</button>
            </div>
            <Field
              label="Content format"
              options={Object.keys(formats)}
              value={v.format}
              change={(x) => set("format", x)}
            />
            <Field
              label="Target reader and buying situation"
              value={v.audience}
              change={(x) => set("audience", x)}
            />
            <Field
              label="Source links or supplied extract"
              placeholder={brief.materials}
              area
              value={v.source}
              change={(x) => set("source", x)}
            />
            {Object.entries({
              length: "Submission length",
              time: "Time box",
              fee: "Trial payment and terms",
              due: "Submission deadline",
            }).map(([k, l]) => (
              <Field key={k} label={l} value={v[k]} change={(x) => set(k, x)} />
            ))}
          </div>
          <div className={s.side}>
            <h2>Send to the agency</h2>
            {!result && <p>{brief.task}</p>}
            {result ? (
              <>
                <pre>{assignment}</pre>
                <Export
                  name="paid-trial-assignment.txt"
                  text={assignment}
                  copyLabel="Copy assignment"
                />
              </>
            ) : (
              <p>
                Complete the reader, source pack, scope, payment and deadline to
                export the assignment.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className={s.panel}>
          <h2>Compare submissions</h2>
          <Field
            label="Scorecard format"
            options={Object.keys(formats)}
            value={v.format}
            change={(x) => set("format", x)}
          />
          <p>
            Missing = 0, Partial = 1, Meets = 2. Record the sentence or
            observation behind each rating.
          </p>
          {brief.checks.map((q, i) => (
            <div key={q} className={s.item}>
              <h3>{q}</h3>
              <div className={s.review}>
                {names.map((n) => (
                  <div key={n}>
                    <Field
                      label={n + " rating"}
                      options={levels}
                      value={read(n, i).level}
                      change={(x) => write(n, i, "level", x)}
                    />
                    <Field
                      label={n + " evidence"}
                      value={read(n, i).note}
                      change={(x) => write(n, i, "note", x)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <p>
            <b>Sample A:</b> {total("Sample A")} · <b>Sample B:</b>{" "}
            {total("Sample B")}
          </p>
          <Field
            label="Hiring decision"
            options={[
              "Undecided",
              "Advance Sample A",
              "Advance Sample B",
              "Advance both",
              "Advance neither",
            ]}
            value={verdict.choice}
            change={(choice) =>
              setDecision({ ...decision, [v.format]: { ...verdict, choice } })
            }
          />
          <Field
            label="Decision notes"
            area
            value={verdict.reason}
            change={(reason) =>
              setDecision({ ...decision, [v.format]: { ...verdict, reason } })
            }
          />
          <Export
            name="paid-trial-scorecard.csv"
            text={decisionCsv}
            csvFile
            downloadLabel="Download decision sheet"
          />
        </div>
      )}
    </section>
  );
}
