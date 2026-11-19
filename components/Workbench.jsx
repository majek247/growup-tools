import { useState } from "react";
import { Copy, Download, RotateCcw } from "lucide-react";
import { run } from "../lib/run.mjs";
function Result({ output, device, setDevice }) {
  if (output.kind === "stats")
    return (
      <dl className="stats">
        {output.entries.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    );
  if (output.kind === "table")
    return output.rows.length ? (
      <div className="tableScroll">
        <table>
          <thead>
            <tr>
              {output.headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {output.rows.map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => (
                  <td key={j}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p>No overlapping queries in these rows.</p>
    );
  if (output.kind === "snippet")
    return (
      <>
        <div className="pills">
          {["Desktop", "Mobile"].map((d) => (
            <button
              key={d}
              aria-pressed={device === d}
              onClick={() => setDevice(d)}
            >
              {d}
            </button>
          ))}
        </div>
        <div className={"snippet " + device}>
          <small>{output.url}</small>
          <strong>{output.title}</strong>
          <p>{output.description}</p>
        </div>
        <small>
          {output.title.length} title characters · {output.description.length}{" "}
          description characters
        </small>
      </>
    );
  return <pre>{output.text}</pre>;
}
export default function Workbench({ tool }) {
  const example = Object.fromEntries(tool.fields.map((f) => [f.key, f.value]));
  const [values, setValues] = useState(example),
    [status, setStatus] = useState(""),
    [device, setDevice] = useState("Desktop");
  let output, error;
  try {
    output = run(tool, values);
  } catch (e) {
    error = e.message;
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(output.text);
      setStatus("Result copied.");
    } catch {
      setStatus("Clipboard unavailable. Use Download to save your result.");
    }
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([output.text], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = output.name || tool.slug + ".txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    setStatus("Download started.");
  }
  return (
    <div className="bench">
      <section className="panel">
        <div className="panelHead">
          <h2>Your inputs</h2>
          <button
            className="plain"
            onClick={() => {
              setValues(example);
              setStatus("Example restored.");
            }}
          >
            <RotateCcw size={14} /> Reset example
          </button>
        </div>
        <p className="muted">
          Replace the example values to update your result.
        </p>
        {tool.fields.map((f) => {
          const props = {
            id: f.key,
            value: values[f.key],
            onChange: (e) => {
              setValues({ ...values, [f.key]: e.target.value });
              setStatus("");
            },
          };
          return (
            <div className="field" key={f.key}>
              <label htmlFor={f.key}>{f.label}</label>
              {f.type === "textarea" ? (
                <textarea
                  {...props}
                  rows={f.key === "csv" ? 7 : 3}
                  spellCheck={f.key !== "csv"}
                />
              ) : (
                <input
                  {...props}
                  type={f.type}
                  step={f.type === "number" ? "any" : undefined}
                  min={f.type === "number" ? 0 : undefined}
                />
              )}
            </div>
          );
        })}
      </section>
      <section className="panel resultPanel">
        <div className="eyebrow ink">
          <i /> Live output
        </div>
        <h2>Your result</h2>
        {error ? (
          <p role="status" className="error">
            {error}
          </p>
        ) : (
          <>
            <Result output={output} device={device} setDevice={setDevice} />
            <div className="outputActions">
              <button className="button dark" onClick={copy}>
                <Copy size={15} /> Copy result
              </button>
              <button className="secondary" onClick={download}>
                <Download size={15} /> Download
              </button>
            </div>
          </>
        )}
        <small role="status">{status}</small>
      </section>
    </div>
  );
}
