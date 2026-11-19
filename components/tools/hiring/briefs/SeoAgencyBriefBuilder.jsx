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

const programme = choice("programme", "What should the agency own?", [
  "Managed SEO",
  "Technical recovery",
  "Strategy and advisory",
]);
const scopes = {
  "Managed SEO": [
    "Interview sales and audit the pages buyers visit before booking a demo.",
    "Ship the agreed fixes and priority commercial pages with named owners.",
    "Review indexed pages, qualified enquiries and opportunities with sales.",
  ],
  "Technical recovery": [
    "Baseline affected URL groups and reproduce the indexing or crawling issue.",
    "Pilot the fix on one template and document validation and rollback steps.",
    "Recheck coverage and affected landing-page performance before wider rollout.",
  ],
  "Strategy and advisory": [
    "Review the backlog, team capacity and measurement gaps.",
    "Deliver briefs and acceptance checks for the internal implementation team.",
    "Review shipped work and agree the next quarter’s priorities.",
  ],
};
const steps = [
  {
    title: "Business context",
    prompt: "What is the agency walking into?",
    fields: [
      company,
      notes,
      audience,
      field(
        "alternatives",
        "Competitors and alternatives",
        "Name the vendors buyers shortlist, or the manual workaround you replace.",
        { extra: true },
      ),
      field(
        "trigger",
        "Buying trigger and barriers",
        "What starts an evaluation? Which objections slow a deal?",
        { extra: true },
      ),
      field(
        "site",
        "Website and markets",
        "Domain, countries and languages in scope.",
        { extra: true },
      ),
    ],
  },
  {
    title: "Commercial goal",
    prompt: "What should change for the business?",
    fields: [
      field(
        "goal",
        "Primary objective",
        "For example, grow qualified demo requests from organic search.",
        { required: true },
      ),
      success,
      field(
        "baseline",
        "Baseline and target",
        "Current value, target and measurement period.",
        { extra: true },
      ),
      field(
        "qualified",
        "Qualified enquiry definition",
        "Specify the CRM stage, exclusion rules and person who checks lead quality.",
        { extra: true },
      ),
      field(
        "systems",
        "Data sources and access",
        "GSC, analytics, CRM and who can grant access.",
        { extra: true },
      ),
    ],
  },
  {
    title: "Scope and ownership",
    prompt: "Who will actually ship the work?",
    fields: [
      programme,
      owner,
      field(
        "priorities",
        "Priority pages or problems",
        "Add page URLs, template names or known blockers.",
        { long: true },
      ),
      field(
        "inventory",
        "Existing work to reuse",
        "Link previous audits, briefs, content inventory or keyword research.",
        { extra: true },
      ),
      field(
        "engineering",
        "Engineering capacity",
        "Who can release technical changes and how often?",
        { extra: true },
      ),
      field(
        "approval",
        "Who approves product claims?",
        "Name a reviewer and a realistic turnaround.",
        { extra: true },
      ),
    ],
  },
  {
    title: "Fees and timing",
    prompt: "What should every agency price?",
    fields: [
      budget,
      deadline,
      field(
        "comparison",
        "How proposals will be evaluated",
        "For example, named delivery team, relevant work and evidence behind priorities.",
        { extra: true },
      ),
      field(
        "limits",
        "Exclusions and constraints",
        "Migration dates, restricted pages or procurement requirements.",
        { extra: true },
      ),
      field(
        "lead",
        "Decision owner and proposal deadline",
        "Who will compare bids and when?",
        { extra: true },
      ),
    ],
  },
];
const config = {
  id: "seo",
  title: "SEO agency brief",
  steps,
  sample: {
    company: "RelayLedger",
    audience:
      "Finance directors at UK SaaS companies evaluating billing software.",
    notes:
      "Sales uses our comparison pages. Marketing has no CMS time. Engineering releases fortnightly.",
    goal: "Increase qualified organic demo requests over two quarters.",
    programme: "Managed SEO",
    owner: "Agency",
    priorities: "/billing-software and our two most-used comparison pages",
    baseline: "12 qualified demos per month today. Target 20 by the end of Q2.",
    systems: "Search Console and HubSpot, owned by Marketing Ops.",
    budget: "£4,500 per month",
    deadline: "Kick off in January",
    success: "Monthly qualified demos and new opportunities in HubSpot.",
  },
  build(v) {
    const plan = scopes[v.programme];
    return [
      [
        "Proposed first 90 days",
        plan
          ? plan
              .map((line, i) => "Day " + [30, 60, 90][i] + " — " + line)
              .join("\n")
          : "Ask the agency for a 30-, 60- and 90-day plan once programme scope is confirmed.",
      ],
      [
        "Pricing response requested",
        [
          "Quote discovery separately from recurring delivery.",
          v.owner === "Agency"
            ? "Itemise CMS upload, formatting and QA per page."
            : v.owner === "Internal team"
              ? "Quote handoff and CMS-ready assets. The internal team will publish."
              : "Price agency publishing as an optional line item.",
          v.programme === "Technical recovery"
            ? "Separate diagnosis, implementation and post-release validation."
            : v.programme === "Strategy and advisory"
              ? "Specify consultant hours, review rounds and delivery-team dependencies."
              : "State monthly volumes for new pages, updates and technical implementation.",
          "List third-party fees, minimum term and exclusions.",
        ].join("\n"),
      ],
      [
        "Reporting and sign-off",
        "Ask the agency to name the owner, data source and reporting cadence for each agreed metric. Record shipped work and outstanding dependencies at each review.",
      ],
    ];
  },
};
export const faqs = faqsFor({
  question: "What goes into the 90-day plan?",
  answer:
    "Your programme determines the proposed discovery, delivery and review milestones. Publishing ownership also changes the pricing request. Edit the suggested milestones on the final review screen before sharing.",
});
const captions = {
  company: "Company",
  audience: "Target buyers",
  alternatives: "Alternatives",
  trigger: "Buying trigger",
  site: "Website and markets",
  goal: "Objective",
  success: "Success measure",
  baseline: "Baseline and target",
  qualified: "Qualified enquiry",
  systems: "Measurement sources",
  programme: "Programme",
  owner: "Publishing owner",
  priorities: "Priority pages",
  inventory: "Existing material",
  engineering: "Engineering capacity",
  approval: "Product approval",
  budget: "Budget",
  deadline: "Timing",
  comparison: "Selection criteria",
  limits: "Constraints",
  lead: "Decision owner and deadline",
};

function AgencyPreview({ values, step, sections, overrides, go }) {
  const review = step === steps.length;
  const index = review ? 0 : step;
  const current = steps[index];
  const rows = current.fields.filter(
    (f) => !["company", "notes"].includes(f.id) && values[f.id]?.trim(),
  );
  const roadmap = scopes[values.programme];
  const showPrice = index >= 2;
  const extra = showPrice ? steps.length + 1 : steps.length;
  return (
    <aside className="seo-proof" aria-label="Live brief preview">
      <header>
        <div>
          <FileText size={15} /> Brief preview
        </div>
        <h3>{values.company?.trim() || "Your company"}</h3>
        <p>SEO agency brief</p>
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
          <h4>
            {showPrice ? "What to include in the quote" : "First 90 days"}
          </h4>
          {overrides[extra] ? (
            <p className="copy">{sections[extra][1]}</p>
          ) : showPrice ? (
            <ul>
              {sections[extra][1].split("\n").map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : roadmap ? (
            <ol>
              {roadmap.map((task, i) => (
                <li key={task}>
                  <span>Day {[30, 60, 90][i]}</span>
                  <p>{task}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="hint">
              Choose a programme in Scope and ownership to see its milestones.
            </p>
          )}
        </section>
        {!review && (
          <button type="button" onClick={() => go(steps.length)}>
            Review full brief <ArrowRight size={15} />
          </button>
        )}
      </div>
      <style jsx>{`
        .seo-proof {
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
          .seo-proof {
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
export default function SeoAgencyBriefBuilder() {
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
    if (i === steps.length && scopes[values.programme]) {
      return [
        name,
        scopes[values.programme]
          .map((task, i) => "Day " + [30, 60, 90][i] + "\n" + task)
          .join("\n\n"),
      ];
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
