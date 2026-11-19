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
export default function Dashboard({ config }) {
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
  const sections = compiled.map(([name, base]) => [
    name,
    edits[name]?.base === base ? edits[name].text : base,
  ]);
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
      <aside className={s.snapshot}>
        <div className={s.kicker}>
          <FileText size={15} /> Agency copy
        </div>
        <h3>{values.company || "Your company"}</h3>
        <p>{title}</p>
        <div className={s.paper}>
          {(review
            ? sections.slice(-2)
            : [
                sections[step],
                sections[
                  config.id === "seo" && (step === 2 || step === 3)
                    ? steps.length + 1
                    : step === steps.length - 1
                      ? sections.length - 1
                      : steps.length
                ],
              ]
          ).map(([name, body]) => (
            <section key={name}>
              <h4>{name}</h4>
              <p>{body}</p>
            </section>
          ))}
        </div>
        <small>
          Planning notes stay in your workspace. Only the reviewed sections
          appear in the PDF.
        </small>
      </aside>
    </div>
  );
}
