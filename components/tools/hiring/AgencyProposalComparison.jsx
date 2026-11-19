import { useState } from "react";
import {
  commitment,
  fields,
  samples,
  suggest,
  unknown,
} from "../../../lib/proposalAnalysis.mjs";
import { Field, Tabs, Export, csv, s } from "./Shared";

export const faqs = [
  {
    question: "Can I compare proposals with different contract lengths?",
    answer:
      "Yes. Minimum fee commitment uses the monthly fee multiplied by the minimum months, plus the one-off setup fee. Confirm zero explicitly when setup is free. A missing component or mismatched currency leaves the total unspecified.",
  },
  {
    question: "How are fees and scope extracted?",
    answer:
      "Paste selectable proposal text. Local rules look for explicit prices, terms and scope statements. Click a cell to inspect the source and correct the suggestion. Statements about complex pricing, tax, discounts and variable costs need your review.",
  },
  {
    question: "Who sees the proposals?",
    answer:
      "Inputs stay in this browser tab. The tool does not upload files or send emails. Copy or download your comparison before leaving.",
  },
];
const blank = () => [
  { name: "Agency A", text: "" },
  { name: "Agency B", text: "" },
];
const views = ["Proposals", "Compare scope", "Follow-up questions"];
export default function AgencyProposalComparison() {
  const [inputs, setInputs] = useState(blank),
    [facts, setFacts] = useState(null),
    [tab, setTab] = useState(views[0]),
    [selected, select] = useState(null),
    [draft, setDraft] = useState(""),
    [priorities, setPriorities] = useState([]),
    [differences, setDiff] = useState(false),
    [error, setError] = useState("");
  function invalidate(next) {
    setInputs(next);
    setFacts(null);
    select(null);
    setError("");
  }
  function start() {
    if (inputs.some((a) => !a.name.trim() || !a.text.trim())) {
      setError("Enter a name and proposal text for each agency.");
      return;
    }
    if (
      new Set(inputs.map((a) => a.name.trim().toLowerCase())).size !==
      inputs.length
    ) {
      setError("Give each proposal a distinct agency name.");
      return;
    }
    if (!facts) setFacts(inputs.map((a) => suggest(a.text)));
    setError("");
    setTab(views[1]);
  }
  function setCell(i, key) {
    select({ i, key });
    setDraft(
      facts[i][key]?.value === unknown ? "" : facts[i][key]?.value || "",
    );
  }
  function apply() {
    const { i, key } = selected;
    const value = draft.trim() || unknown;
    setFacts(
      facts.map((agency, index) =>
        index === i
          ? { ...agency, [key]: { ...agency[key], value, edited: true } }
          : agency,
      ),
    );
    select(null);
  }
  const value = (a, key) => (key === "total" ? commitment(a) : a[key].value);
  const memo = facts
    ? [
        "Agency proposal comparison",
        ...inputs.map((agency, i) =>
          [
            agency.name,
            ...fields.map(
              ([key, label]) => label + ": " + value(facts[i], key),
            ),
          ].join("\n"),
        ),
      ].join("\n\n")
    : "";
  const ordered = [...fields].sort(
    (a, b) =>
      Number(priorities.includes(b[0])) - Number(priorities.includes(a[0])),
  );
  const visible = ordered.filter(
    ([key]) =>
      !differences ||
      new Set(facts?.map((a) => value(a, key).toLowerCase())).size > 1,
  );
  function questions(a) {
    return ordered
      .filter(([key]) => key !== "total" && a[key].value === unknown)
      .map((r) => r[2]);
  }
  function email(i) {
    const qs = questions(facts[i]);
    return (
      "Hi " +
      inputs[i].name.trim() +
      ",\n\n" +
      (qs.length
        ? "Could you clarify these points before we take the proposal to finance?\n\n" +
          qs.map((q, k) => k + 1 + ". " + q).join("\n")
        : "We have answers for each scope item. Could you confirm the final scope and payment schedule in writing?") +
      "\n\nThanks!"
    );
  }
  const chooser = (
    <Tabs
      names={views}
      active={tab}
      change={(v) => {
        if (v === views[0] || facts) setTab(v);
        else setError("Add your proposals and select Compare proposals first.");
      }}
    />
  );
  return (
    <section className={s.shell}>
      {chooser}
      {error && (
        <p role="alert" className={s.error}>
          {error}
        </p>
      )}
      {tab === views[0] && (
        <div className={s.panel}>
          <div className={s.head}>
            <h2>Add your proposals</h2>
            <button
              onClick={() => {
                if (
                  !inputs.some((a) => a.text) ||
                  confirm("Replace your proposal drafts with samples?")
                )
                  invalidate(samples.map((a) => ({ ...a })));
              }}
            >
              Try two sample proposals
            </button>
          </div>
          <p>
            Paste the pricing and scope from each quote. Select a comparison
            cell to check its wording or correct a value.
          </p>
          {inputs.map((a, i) => (
            <div className={s.item} key={i}>
              <Field
                label={"Agency " + (i + 1) + " name"}
                value={a.name}
                change={(v) =>
                  invalidate(
                    inputs.map((x, j) => (i === j ? { ...x, name: v } : x)),
                  )
                }
              />
              <Field
                label={"Proposal " + (i + 1) + " text"}
                area
                value={a.text}
                change={(v) =>
                  invalidate(
                    inputs.map((x, j) => (i === j ? { ...x, text: v } : x)),
                  )
                }
              />
              {i === 2 && (
                <button onClick={() => invalidate(inputs.slice(0, 2))}>
                  Remove third proposal
                </button>
              )}
            </div>
          ))}
          <div className={s.actions}>
            {inputs.length === 2 && (
              <button
                onClick={() =>
                  invalidate([...inputs, { name: "Agency C", text: "" }])
                }
              >
                Add third proposal
              </button>
            )}
            <button className={s.primary} onClick={start}>
              Compare proposals
            </button>
          </div>
        </div>
      )}
      {facts && tab === views[1] && (
        <div className={s.panel}>
          <div className={s.head}>
            <h2>Compare scope</h2>
            <label className={s.check}>
              <input
                type="checkbox"
                checked={differences}
                onChange={(e) => setDiff(e.target.checked)}
              />
              Show differences only
            </label>
          </div>
          <p>
            Move your priorities to the top. Select any value to review the
            source.
          </p>
          <div className={s.actions}>
            {fields
              .filter((r) =>
                ["publishing", "reporting", "interviews"].includes(r[0]),
              )
              .map(([k, l]) => (
                <button
                  key={k}
                  aria-pressed={priorities.includes(k)}
                  onClick={() =>
                    setPriorities(
                      priorities.includes(k)
                        ? priorities.filter((x) => x !== k)
                        : [...priorities, k],
                    )
                  }
                >
                  {l}
                </button>
              ))}
          </div>
          <div className={s.scroll}>
            <table>
              <thead>
                <tr>
                  <th>Scope</th>
                  {inputs.map((a, i) => (
                    <th key={i}>{a.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map(([key, label]) => (
                  <tr key={key}>
                    <th>{label}</th>
                    {facts.map((a, i) => (
                      <td key={i}>
                        <button
                          className={value(a, key) === unknown ? s.missing : ""}
                          aria-label={
                            inputs[i].name +
                            " — " +
                            label +
                            " — " +
                            value(a, key)
                          }
                          aria-pressed={
                            selected?.i === i && selected.key === key
                          }
                          onClick={() => setCell(i, key)}
                        >
                          {value(a, key)}
                          {a[key]?.edited ? " · edited" : ""}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!visible.length && <p>All comparison values match.</p>}
          {selected && (
            <div className={s.side}>
              <h3>
                {inputs[selected.i].name} ·{" "}
                {fields.find((r) => r[0] === selected.key)[1]}
              </h3>
              {selected.key === "total" ? (
                <p>
                  Monthly fee × minimum months + setup fee. Confirm all three
                  values in the table. This covers fixed fees only.
                </p>
              ) : (
                <>
                  <blockquote>
                    {facts[selected.i][selected.key].proof ||
                      "No matching clause found in the pasted text."}
                  </blockquote>
                  <Field
                    label="Confirm or correct value"
                    value={draft}
                    change={setDraft}
                    placeholder={
                      selected.key === "monthly"
                        ? "e.g. £4,000"
                        : selected.key === "term"
                          ? "e.g. 6"
                          : selected.key === "setup"
                            ? "e.g. £500 or 0"
                            : "Enter the agreed scope"
                    }
                  />
                  <div className={s.actions}>
                    <button onClick={apply}>Save correction</button>
                    <button onClick={() => select(null)}>Close</button>
                  </div>
                  {facts[selected.i][selected.key].value === unknown && (
                    <div>
                      <p>
                        <b>Ask the agency</b> ·{" "}
                        {fields.find((r) => r[0] === selected.key)[2]}
                      </p>
                      <Export
                        text={fields.find((r) => r[0] === selected.key)[2]}
                        name="clarification.txt"
                        copyLabel="Copy question"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          <Export
            name="agency-comparison.csv"
            csvFile
            downloadLabel="Export comparison"
            text={csv([
              ["Scope", ...inputs.map((a) => a.name)],
              ...ordered.map(([k, l]) => [l, ...facts.map((a) => value(a, k))]),
            ])}
          />
          <Export
            name="agency-decision-summary.txt"
            text={memo}
            copyLabel="Copy finance summary"
            downloadLabel="Download summary"
          />
        </div>
      )}
      {facts && tab === views[2] && (
        <div className={s.stack}>
          {facts.map((a, i) => (
            <div key={i} className={s.panel}>
              <h3>Questions for {inputs[i].name}</h3>
              <pre>{email(i)}</pre>
              <Export
                name={"agency-" + (i + 1) + "-follow-up.txt"}
                text={email(i)}
                copyLabel="Copy email"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
