import { useState, useRef } from "react";
import { Check, Plus, Copy, Download, ExternalLink } from "lucide-react";
import styles from "./SchemaStudio.module.css";

export function required(value, label) {
  if (!value?.trim()) throw Error("Enter " + label + ".");
  return value.trim();
}
export function address(value, label) {
  if (!value?.trim()) return undefined;
  try {
    const parsed = new URL(value.trim());
    if (
      ["http:", "https:"].includes(parsed.protocol) &&
      parsed.hostname &&
      !parsed.username &&
      !parsed.password
    )
      return parsed.href;
  } catch {}
  throw Error("Enter a full https:// or http:// URL for " + label + ".");
}
export function amount(value, label, min, max = Infinity, integer = false) {
  const raw = required(value, label);
  const n = Number(raw);
  if (
    !Number.isFinite(n) ||
    n < min ||
    n > max ||
    (integer && !Number.isInteger(n))
  )
    throw Error(
      "Check " +
        label +
        " (" +
        min +
        (max === Infinity ? " or more" : " to " + max) +
        (integer ? ", whole numbers" : "") +
        ").",
    );
  return n;
}
export function date(value, label) {
  if (!value) return undefined;
  const d = new Date(value + "T00:00:00Z");
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    !Number.isFinite(+d) ||
    d.toISOString().slice(0, 10) !== value
  )
    throw Error("Enter a valid calendar date for " + label + ".");
  return value;
}
export function identifier(url, fragment) {
  const id = new URL(url);
  id.hash = fragment;
  return id.href;
}
export function field(key, label, type = "text", options) {
  return { key, label, type, options };
}
const emptyFields = (fields) =>
  Object.fromEntries(
    fields.map((f) => [f.key, f.type === "select" ? f.options[0] : ""]),
  );

function Input({ field: f, value, onChange, id }) {
  const props = { id, value, onChange: (e) => onChange(e.target.value) };
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{f.label}</label>
      {f.type === "select" ? (
        <select {...props}>
          {f.options.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      ) : f.type === "textarea" ? (
        <textarea {...props} rows={3} />
      ) : (
        <input
          {...props}
          type={f.type}
          step={f.type === "number" ? "any" : undefined}
        />
      )}
    </div>
  );
}

export default function SchemaStudio({
  name,
  groups,
  repeat,
  example,
  build,
  guide,
}) {
  const counter = useRef(0);
  const blank = () => ({
    ...emptyFields(groups.flatMap((g) => g.fields)),
    ...(repeat ? { [repeat.key]: [] } : {}),
  });
  const [values, setValues] = useState(blank);
  const [tab, setTab] = useState("HTML embed");
  const [message, setMessage] = useState("");
  const [dirty, setDirty] = useState(false);
  function update(key, value) {
    setValues((old) => ({ ...old, [key]: value }));
    setDirty(true);
    setMessage("");
  }
  function reset(sample) {
    const draft = sample ? { ...blank(), ...example } : blank();
    if (repeat)
      draft[repeat.key] = (draft[repeat.key] || []).map((row) => ({
        ...row,
        id: ++counter.current,
      }));
    setValues(draft);
    setMessage("");
    setDirty(Boolean(sample));
  }
  let json = "",
    issue = "",
    warnings = [];
  try {
    const output = build(values);
    warnings = output.warnings || [];
    json = JSON.stringify(
      { "@context": "https://schema.org", ...output.node },
      null,
      2,
    ).replace(/</g, "\\u003c");
  } catch (e) {
    issue = e.message;
  }
  const embed = '<script type="application/ld+json">\n' + json + "\n</script>";
  const code = tab === "HTML embed" ? embed : json;
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setMessage("Copied " + tab + ".");
    } catch {
      setMessage("Select the code to copy it, or use Download.");
    }
  }
  function download() {
    const html = tab === "HTML embed";
    const url = URL.createObjectURL(
      new Blob([code], { type: html ? "text/html" : "application/ld+json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = name.toLowerCase() + "-schema." + (html ? "html" : "jsonld");
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    setMessage("Download started.");
  }
  const rows = repeat ? values[repeat.key] : [];
  return (
    <div className={styles.studio}>
      <section className={styles.editor}>
        <h2>{name} details</h2>
        <div className={styles.actions}>
          <button
            onClick={() => {
              if (
                !dirty ||
                window.confirm("Replace your entries with the example?")
              )
                reset(true);
            }}
          >
            Load example
          </button>
          {dirty && (
            <button
              onClick={() => {
                if (window.confirm("Clear your entries?")) reset(false);
              }}
            >
              Start blank
            </button>
          )}
        </div>
        {groups.map((g) => (
          <fieldset key={g.title}>
            <legend>{g.title}</legend>
            {g.fields.map((f) => (
              <Input
                key={f.key}
                id={name + "-" + f.key}
                field={f}
                value={values[f.key]}
                onChange={(v) => update(f.key, v)}
              />
            ))}
          </fieldset>
        ))}
        {repeat && (
          <fieldset>
            <legend>{repeat.title}</legend>
            {rows.map((row, i) => (
              <div className={styles.item} key={row.id}>
                <div className={styles.itemHead}>
                  <strong>
                    {repeat.label} {i + 1}
                  </strong>
                  <button
                    aria-label={"Remove " + repeat.label + " " + (i + 1)}
                    onClick={() =>
                      update(
                        repeat.key,
                        rows.filter((r) => r.id !== row.id),
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
                {repeat.fields.map((f) => (
                  <Input
                    key={f.key}
                    id={repeat.key + "-" + row.id + "-" + f.key}
                    field={f}
                    value={row[f.key] || ""}
                    onChange={(v) =>
                      update(
                        repeat.key,
                        rows.map((r) =>
                          r.id === row.id ? { ...r, [f.key]: v } : r,
                        ),
                      )
                    }
                  />
                ))}
              </div>
            ))}
            <button
              onClick={() =>
                update(repeat.key, [
                  ...rows,
                  { ...emptyFields(repeat.fields), id: ++counter.current },
                ])
              }
            >
              <Plus size={15} /> Add {repeat.label.toLowerCase()}
            </button>
          </fieldset>
        )}
      </section>
      <section className={styles.output}>
        <h2>Your markup</h2>
        <div className={styles.actions}>
          {["HTML embed", "JSON-LD"].map((t) => (
            <button
              key={t}
              aria-pressed={t === tab}
              onClick={() => {
                setTab(t);
                setMessage("");
              }}
            >
              {t}
            </button>
          ))}
        </div>
        {json ? (
          <>
            <span className={styles.ready}>
              <Check size={14} /> Ready to export
            </span>
            <pre tabIndex={0}>
              <code>{code}</code>
            </pre>
          </>
        ) : (
          <p className={styles.issue} role="status">
            {dirty
              ? issue
              : "Enter the details from your page or load the example to see the markup."}
          </p>
        )}
        {warnings.map((w) => (
          <p className={styles.warn} key={w}>
            {w}
          </p>
        ))}
        <div className={styles.actions}>
          <button disabled={!json} onClick={copy}>
            <Copy size={15} /> Copy {tab}
          </button>
          <button disabled={!json} onClick={download}>
            <Download size={15} /> Download
          </button>
        </div>
        <p>
          {tab === "HTML embed"
            ? "Paste the script into the HTML of the page it describes."
            : "Use the JSON object in a CMS field that accepts JSON-LD."}
        </p>
        <a
          href="https://search.google.com/test/rich-results"
          target="_blank"
          rel="noreferrer"
        >
          Open Google’s Rich Results Test <ExternalLink size={13} />
        </a>
        <a
          href={
            "https://developers.google.com/search/docs/appearance/structured-data/" +
            guide
          }
          target="_blank"
          rel="noreferrer"
        >
          {name} markup guidance <ExternalLink size={13} />
        </a>
        <small role="status">{message}</small>
      </section>
    </div>
  );
}
