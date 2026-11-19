import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Download,
  FileText,
  Pencil,
  RotateCcw,
} from "lucide-react";
import s from "./Dashboard.module.css";

import {
  field,
  choice,
  company,
  notes,
  audience,
  budget,
  deadline,
  success,
  owner,
  faqsFor,
} from "./fields";

const assignments = {
  "Comparison page":
    "Write a decision guide covering who each product suits, material trade-offs, verified feature differences and the next step for each buyer.",
  "Customer case study":
    "Show the customer’s starting situation, why they changed, what they implemented and the measured outcome. Flag quotes and numbers for customer approval.",
  "Product-led guide":
    "Walk the reader through one real task. Show the inputs, product steps, example output and how the reader can reproduce it.",
  "Landing page":
    "Lead with the buying situation, demonstrate the product against that use case, answer objections and finish with one primary action.",
};
const steps = [
  {
    title: "Reader and context",
    prompt: "Who needs this piece, and why now?",
    fields: [company, notes, audience],
  },
  {
    title: "Content assignment",
    prompt: "What should the agency create?",
    fields: [
      choice("format", "Asset format", Object.keys(assignments)),
      field(
        "topic",
        "Working title or topic",
        "Give the writer a specific question to answer.",
        { required: true },
      ),
      field(
        "action",
        "What should the reader do next?",
        "For example, compare plans or book a technical demo.",
      ),
      field(
        "angle",
        "Angle and objections",
        "What should this cover that existing articles miss?",
        { extra: true },
      ),
      field(
        "quantity",
        "Quantity and length",
        "For example, one page plus a sales email.",
        { extra: true },
      ),
    ],
  },
  {
    title: "Evidence and quality",
    prompt: "What can the writer use as proof?",
    fields: [
      field(
        "sources",
        "Source pack",
        "Paste URLs, approved quotes or interview notes.",
        { long: true },
      ),
      field(
        "expert",
        "Subject expert and availability",
        "Who can answer follow-up questions?",
      ),
      field(
        "voice",
        "Voice and examples",
        "Link one piece to emulate and say why.",
        { extra: true },
      ),
      field(
        "avoid",
        "Restricted claims or competitors",
        "List anything requiring legal or customer approval.",
        { extra: true },
      ),
    ],
  },
  {
    title: "Handoff and review",
    prompt: "What makes the draft ready to publish?",
    fields: [
      owner,
      deadline,
      field(
        "reviewer",
        "Approver and revision process",
        "Who owns final sign-off and how many review rounds?",
      ),
      success,
      budget,
    ],
  },
];
const config = {
  id: "content",
  title: "Content agency brief",
  steps,
  sample: {
    company: "RelayLedger",
    audience:
      "UK finance directors replacing spreadsheets before their annual billing review.",
    format: "Comparison page",
    topic: "Billing software vs spreadsheets for usage-based pricing",
    action: "Book a demo using a sample invoice.",
    sources:
      "Use the approved pricing sheet and an anonymised finance-team interview. Confirm product limits with the product owner.",
    expert: "Head of Product, available for a 20-minute interview.",
    owner: "Internal team",
    deadline: "First draft by 12 January",
    reviewer: "Product checks accuracy, then marketing signs off.",
    success: "Track demo requests from the page in HubSpot.",
  },
  build(v) {
    return [
      [
        "Commissioned assignment",
        assignments[v.format] ||
          "Confirm the asset format before commissioning a first draft.",
      ],
      [
        "Editorial acceptance checks",
        [
          "Answer the reader’s decision in the opening section.",
          v.format === "Customer case study"
            ? "Attach approval for each attributed quote and verify the outcome against its source."
            : v.format === "Comparison page"
              ? "Cite sources for material differences and date-check pricing and plan limits."
              : v.format === "Product-led guide"
                ? "Test the steps against the current product and supply captioned screenshots."
                : "Back each material product claim with a named source.",
          v.action
            ? "End with the agreed action — " + v.action
            : "Agree one next step for the reader before drafting.",
        ].join("\n"),
      ],
      [
        "Delivery and pricing request",
        [
          v.owner === "Agency"
            ? "Include CMS upload, metadata, accessibility checks and preview sign-off in the quote."
            : v.owner === "Internal team"
              ? "Supply clean copy, metadata, alt text and original assets to the internal publishing team."
              : "Quote CMS publishing separately until ownership is agreed.",
          "Itemise research, interviews, writing, design and revisions. Specify what the fee includes.",
        ].join("\n"),
      ],
    ];
  },
};
export const faqs = faqsFor({
  question: "Can I brief more than a blog post?",
  answer:
    "Choose a comparison page, customer case study, product-led guide or landing page. Each format has its own assignment and acceptance criteria.",
});

const captions = {
 company: 'Company', audience: 'Target reader', format: 'Asset format', topic: 'Working title',
 action: 'Reader’s next step', angle: 'Angle and objections', quantity: 'Deliverables',
 sources: 'Source material', expert: 'Subject expert', voice: 'Voice and examples',
 avoid: 'Claims to check', owner: 'Publishing owner', deadline: 'Delivery window',
 reviewer: 'Approval and revisions', success: 'Success measure', budget: 'Budget'
};
function AgencyPreview({ values, step, sections, overrides, go }) {
  const review = step === steps.length;
  const index = review ? 0 : step;
  const current = steps[index];
  const rows = current.fields.filter(
    (f) => !["company", "notes"].includes(f.id) && values[f.id]?.trim(),
  );
  const extra = steps.length + Math.max(0,index - 1);
  return (
    <aside className="content-proof" aria-label="Live brief preview">
      <header>
        <div>
          <FileText size={15} /> Brief preview
        </div>
        <h3>{values.company?.trim() || "Your company"}</h3>
        <p>Content agency brief</p>
      </header>
      <div className="sheet">
        <section>
          <h4>{current.title}</h4>
          {overrides[index] ? (
            <p className="copy">{sections[index][1]}</p>
          ) : rows.length ? (
            <dl>
              {rows.map((f) => (
                <div key={f.id}>
                  <dt>{captions[f.id]}</dt>
                  <dd>{values[f.id].trim()}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="hint">
              Your answers for this section will appear here.
            </p>
          )}
        </section>
        <section>
          <h4>{sections[extra][0]}</h4>
          {overrides[extra] || extra === steps.length ? (
            <p className="copy">{sections[extra][1]}</p>
          ) : (
            <ul>{sections[extra][1].split("\n").map((line,i)=><li key={i}>{line}</li>)}</ul>
          )}
        </section>
        {!review && (
          <button type="button" onClick={() => go(steps.length)}>
            Review full brief <ArrowRight size={15} />
          </button>
        )}
      </div>
      <style jsx>{`
        .content-proof {
          min-width: 0;
          overflow: hidden;
          overflow-wrap: anywhere;
          border: 1px solid #bfd5cc;
          border-radius: 14px;
          background: white;
          color: #113b3a;
        }
        header {
          padding: 22px;
          background: #e6f2eb;
          border-bottom: 1px solid #c9ded4;
        }
        header div {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #176667;
        }
        header h3 {
          margin: 14px 0 3px;
          font-size: 25px;
          letter-spacing: -0.04em;
        }
        header p {
          margin: 0;
          color: #3d6660;
          font-size: 14px;
        }
        .sheet {
          padding: 0 20px 16px;
        }
        .sheet section {
          padding: 18px 0;
        }
        .sheet section + section {
          border-top: 1px solid #d7e5df;
        }
        h4 {
          font-size: 16px;
          margin: 0 0 12px;
        }
        dl,
        dd,
        ol,
        ul {
          margin: 0;
        }
        dl div + div {
          margin-top: 12px;
        }
        dt,
        ol span {
          font-size: 12px;
          font-weight: 700;
          color: #176667;
        }
        dd,
        .copy,
        li p,
        ul li,
        .hint {
          font-size: 14px;
          line-height: 1.55;
        }
        dd,
        .copy {
          white-space: pre-wrap;
        }
        dd {
          margin-top: 2px;
        }
        .hint,
        .copy {
          margin: 0;
        }
        .hint {
          color: #526d68;
        }
        ol {
          list-style: none;
          padding: 0;
        }
        ol li {
          position: relative;
          padding: 0 0 13px 18px;
          border-left: 2px solid #cde4da;
          margin-left: 4px;
        }
        ol li:last-child {
          border-color: transparent;
          padding-bottom: 0;
        }
        ol li:before {
          content: "";
          position: absolute;
          left: -5px;
          top: 6px;
          width: 8px;
          height: 8px;
          background: #167273;
          border-radius: 50%;
        }
        ol p {
          margin: 3px 0 0;
        }
        ul {
          padding-left: 17px;
        }
        ul li + li {
          margin-top: 8px;
        }
        .sheet button {
          width: 100%;
        }
        @media (min-width: 701px) and (max-width: 1050px) {
          .content-proof {
            grid-column: 2;
          }
        }
      `}</style>
    </aside>
  );
}
function readDraft(key, count) {
  try {
    const data = JSON.parse(sessionStorage.getItem(key));
    if (data && data.values && typeof data.values === "object") {
      const values = Object.fromEntries(
        Object.entries(data.values).filter(
          ([, value]) => typeof value === "string",
        ),
      );
      return {
        values,
        edits: data.edits || {},
        step: Math.max(0, Math.min(count, Number(data.step) || 0)),
      };
    }
  } catch {
    /* Storage may be unavailable in a private tab. */
  }
  return { values: {}, edits: {}, step: 0 };
}
function noteSuggestions(notes, fields, values) {
  const pairs = notes
    .split(/\n/)
    .map((line) => line.match(/^\s*([^:]{2,50}):\s*(.+)$/))
    .filter(Boolean);
  const suggestions = [];
  for (const f of fields) {
    if (values[f.id]?.trim() || f.id === "notes") continue;
    const match = pairs.find(([, key]) =>
      [f.id, f.label, ...(f.id === "goal" ? ["objective"] : [])].some(
        (name) => name.toLowerCase() === key.toLowerCase().trim(),
      ),
    );
    let value = match?.[2]?.trim();
    if (f.choices && value)
      value = f.choices.find(
        (item) => item.toLowerCase() === value.toLowerCase(),
      );
    if (value) suggestions.push([f, value]);
    else if (
      f.id === "owner" &&
      /no CMS time|agency (?:to |will )?publish/i.test(notes)
    )
      suggestions.push([f, "Agency"]);
  }
  return suggestions;
}
function Input({ f, value, setValue }) {
  const id = "brief-" + f.id;
  if (f.choices)
    return (
      <fieldset className={s.choice}>
        <legend>{f.label}</legend>
        <div>
          {f.choices.map((item) => (
            <label key={item}>
              <input
                type="radio"
                name={id}
                checked={value === item}
                onChange={() => setValue(item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  return (
    <div className={s.field}>
      <label htmlFor={id}>
        {f.label}
        {f.required && <small>Required</small>}
      </label>
      {f.long ? (
        <textarea
          id={id}
          rows={3}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-describedby={id + "-hint"}
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-describedby={id + "-hint"}
        />
      )}
      <small id={id + "-hint"}>{f.hint}</small>
    </div>
  );
}
export default function ContentAgencyBriefBuilder() {
  const { steps, title } = config;
  const key = "growup:briefs:v1:" + config.id;
  const [draft, setDraft] = useState({ values: {}, edits: {}, step: 0 });
  const [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const [editing, setEditing] = useState(null);
  const heading = useRef(null);
  useEffect(() => {
    setDraft(readDraft(key, steps.length));
    setReady(true);
  }, [key, steps]);
  useEffect(() => {
    if (ready) {
      try {
        sessionStorage.setItem(key, JSON.stringify(draft));
      } catch {
        /* Draft still works in memory. */
      }
    }
  }, [ready, key, draft]);
  const { values, edits, step } = draft;
  const review = step === steps.length;
  const fields = steps.flatMap((item) => item.fields);
  const missing = fields.filter((f) => f.required && !values[f.id]?.trim());
  const complete = steps.filter(
    (st) =>
      st.fields.filter((f) => f.required).every((f) => values[f.id]?.trim()) &&
      st.fields.some((f) => values[f.id]?.trim()),
  ).length;
  const groups = steps.map((st) => [
    st.title,
    st.fields
      .filter((f) => f.id !== "notes" && (values[f.id]?.trim() || !f.extra))
      .map((f) => f.label + " — " + (values[f.id]?.trim() || "To confirm"))
      .join("\n"),
  ]);
  const compiled = [...groups, ...config.build(values)];
  // Keep the previous section signatures so saved editorial changes still match.
  const overrides = compiled.map(
    ([name, base]) =>
      edits[name]?.base === base && typeof edits[name]?.text === "string",
  );
  const sections = compiled.map(([name, base], i) => {
    if (overrides[i]) return [name, edits[name].text];
    if (i < steps.length) {
      const rows = steps[i].fields.filter(
        (f) => f.id !== "notes" && (values[f.id]?.trim() || !f.extra),
      );
      return [
        name,
        rows
          .map(
            (f) =>
              captions[f.id] + "\n" + (values[f.id]?.trim() || "To confirm"),
          )
          .join("\n\n"),
      ];
    }
    if (name === "Editorial acceptance checks" && values.action) {
      return [name, base.replace("End with the agreed action — ", "Close with this next step: ")];
    }
    return [name, base];
  });
  const suggestions = noteSuggestions(values.notes || "", fields, values);
  function update(id, value) {
    setDraft((old) => ({ ...old, values: { ...old.values, [id]: value } }));
    setMessage("");
  }
  function go(index) {
    setDraft((old) => ({ ...old, step: index }));
    setEditing(null);
    setMessage("");
    requestAnimationFrame(() => heading.current?.focus());
  }
  function replace(values) {
    if (
      Object.values(draft.values).some(Boolean) &&
      !window.confirm("Replace the current draft in this tab?")
    )
      return;
    setDraft({ values: { ...values }, step: 0, edits: {} });
    setEditing(null);
    setMessage("");
  }
  async function download() {
    setBusy(true);
    setMessage("");
    try {
      const { saveBrief } = await import("./saveBrief");
      await saveBrief(title, values.company, sections);
      setMessage("Your PDF is ready.");
    } catch {
      setMessage("PDF export failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  const drawInput = (f) => (
    <Input
      key={f.id}
      f={f}
      value={values[f.id] || ""}
      setValue={(value) => update(f.id, value)}
    />
  );
  const current = steps[step];
  return (
    <div className={s.shell}>
      <aside className={s.rail}>
        <div className={s.kicker}>Brief workspace</div>
        <h2>{title}</h2>
        <div className={s.meter}>
          <i style={{ width: (100 * complete) / steps.length + "%" }} />
        </div>
        <small>
          {complete} of {steps.length} sections started
        </small>
        <nav aria-label="Brief sections">
          {[...steps, { title: "Review & download" }].map((item, i) => (
            <button
              type="button"
              key={item.title}
              aria-current={step === i ? "step" : undefined}
              onClick={() => go(i)}
            >
              <b>{i === steps.length ? <FileText size={14} /> : i + 1}</b>
              {item.title}
              <ChevronRight size={14} />
            </button>
          ))}
        </nav>
        <div className={s.utilities}>
          <button onClick={() => replace(config.sample)}>Load example</button>
          <button onClick={() => replace({})}>
            <RotateCcw size={13} /> Start fresh
          </button>
        </div>
      </aside>
      <section className={s.body}>
        <div className={s.kicker}>
          {review
            ? "Final review"
            : "Step " + (step + 1) + " of " + steps.length}
        </div>
        <h2 ref={heading} tabIndex={-1}>
          {review ? "Review your agency brief" : current.prompt}
        </h2>
        {review ? (
          <>
            <p>
              Check the wording below. Select a section to edit the version your
              agency receives.
            </p>
            {missing.length > 0 && (
              <div className={s.note}>
                Complete {missing.map((f) => f.label).join(", ")} before
                downloading.{" "}
                <button
                  onClick={() =>
                    go(steps.findIndex((st) => st.fields.includes(missing[0])))
                  }
                >
                  Go to first missing field →
                </button>
              </div>
            )}
            {sections.map(([name, body], i) => (
              <article className={s.doc} key={name}>
                <div>
                  <h3>{name}</h3>
                  <button
                    className={s.textBtn}
                    aria-label={
                      (editing === name ? "Finish editing " : "Edit ") + name
                    }
                    onClick={() => setEditing(editing === name ? null : name)}
                  >
                    {editing === name ? (
                      <Check size={16} />
                    ) : (
                      <Pencil size={14} />
                    )}
                  </button>
                </div>
                {editing === name ? (
                  <textarea
                    aria-label={name + " text"}
                    rows={7}
                    value={body}
                    onChange={(e) => {
                      const text = e.target.value;
                      setDraft((old) => ({
                        ...old,
                        edits: {
                          ...old.edits,
                          [name]: { base: compiled[i][1], text },
                        },
                      }));
                    }}
                  />
                ) : (
                  <p>{body}</p>
                )}
              </article>
            ))}
            <button
              className={s.primary}
              disabled={
                busy ||
                missing.length > 0 ||
                sections.some(([, v]) => !v.trim())
              }
              onClick={download}
            >
              <Download size={16} />
              {busy ? "Preparing PDF…" : "Download brief as PDF"}
            </button>
            {sections.some(([, v]) => !v.trim()) && (
              <p>Fill in the empty review section before downloading.</p>
            )}
          </>
        ) : (
          <>
            {step > 0 && values.notes?.trim() && (
              <details className={s.detail}>
                <summary>Your original notes</summary>
                <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                  {values.notes}
                </p>
              </details>
            )}
            {current.fields.filter((f) => !f.extra).map(drawInput)}
            {step === 0 && suggestions.length > 0 && (
              <div className={s.note}>
                <strong>Use a detail from your notes</strong>
                {suggestions.map(([f, v]) => (
                  <button key={f.id} onClick={() => update(f.id, v)}>
                    {f.label} · {v}　＋
                  </button>
                ))}
              </div>
            )}
            {current.fields.some((f) => f.extra) && (
              <details key={step} className={s.detail}>
                <summary>Additional detail</summary>
                {current.fields.filter((f) => f.extra).map(drawInput)}
              </details>
            )}
            <div className={s.actions}>
              {step > 0 && (
                <button onClick={() => go(step - 1)}>
                  <ArrowLeft size={15} /> Back
                </button>
              )}
              <button className={s.primary} onClick={() => go(step + 1)}>
                {step === steps.length - 1 ? "Review brief" : "Continue"}{" "}
                <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}
        <div role="status">{message}</div>
      </section>
      <AgencyPreview
        values={values}
        step={step}
        sections={sections}
        overrides={overrides}
        go={go}
      />
    </div>
  );
}
