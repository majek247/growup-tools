import { useState } from "react";
import Papa from "papaparse";
import s from "./Hiring.module.css";
export { s };
export function Field({
  label,
  value,
  change,
  options,
  area = false,
  ...props
}) {
  const input = { value, onChange: (e) => change(e.target.value), ...props };
  return (
    <label className={s.field}>
      <span>{label}</span>
      {options ? (
        <select {...input}>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : area ? (
        <textarea rows={4} {...input} />
      ) : (
        <input {...input} />
      )}
    </label>
  );
}
export function Tabs({ names, active, change }) {
  return (
    <div className={s.tabs} role="group" aria-label="Workspace view">
      {names.map((n) => (
        <button key={n} aria-pressed={n === active} onClick={() => change(n)}>
          {n}
        </button>
      ))}
    </div>
  );
}
export function csv(rows) {
  return Papa.unparse(rows, { escapeFormulae: true });
}
export function Export({
  text,
  name,
  copyLabel = "Copy text",
  downloadLabel = "Download",
  csvFile = false,
}) {
  const [message, setMessage] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setMessage("Copied.");
    } catch {
      setMessage("Use Download to save a copy.");
    }
  }
  function save() {
    const u = URL.createObjectURL(
      new Blob([csvFile ? "\uFEFF" : "", text], {
        type: csvFile ? "text/csv;charset=utf-8" : "text/plain;charset=utf-8",
      }),
    );
    const a = document.createElement("a");
    a.href = u;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(u), 2000);
    setMessage("Download started.");
  }
  return (
    <div className={s.actions}>
      <button onClick={copy}>{copyLabel}</button>
      <button className={s.primary} onClick={save}>
        {downloadLabel}
      </button>
      <small role="status">{message}</small>
    </div>
  );
}
