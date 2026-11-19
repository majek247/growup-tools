import { useRef, useState } from "react";
import Papa from "papaparse";
import { run } from "../../lib/run.mjs";

const EXAMPLE = [
  {
    question: "Can we connect our existing CRM?",
    answer:
      "Yes. Connect HubSpot or Salesforce from your workspace settings. " +
      "Choose which contacts, companies and deal stages you want to sync.",
  },
  {
    question: "What happens to our data after the trial?",
    answer:
      "You can export your reports as CSV files before the trial ends. " +
      "If you upgrade, your existing reports stay in the same workspace.",
  },
  {
    question: "Can our finance team download invoices?",
    answer:
      "Yes. Give your finance contact billing access so they can " +
      "download invoices without access to customer reports.",
  },
];

function blankRow(id) {
  return { id, question: "", answer: "" };
}

function normaliseQuestion(text) {
  return text.trim().replace(/\s+/g, " ").replace(/[?？]+$/, "").trim().toLowerCase();
}

function inspectRows(rows) {
  const seen = new Map();
  const issues = new Map();

  rows.forEach((row, index) => {
    const question = row.question.trim();
    const answer = row.answer.trim();
    const messages = [];

    if (!question) messages.push("Add a question.");
    if (!answer) messages.push("Add an answer.");

    const key = normaliseQuestion(question);
    if (key) {
      if (seen.has(key)) {
        messages.push(`This repeats question ${seen.get(key)}.`);
      } else {
        seen.set(key, index + 1);
      }
    }

    if (messages.length) issues.set(row.id, messages.join(" "));
  });

  return issues;
}

// Accept a two-column selection from Sheets or Excel, or two-column CSV.
// A question,answer header is optional. Quoted commas and newlines are supported.
function readSpreadsheet(text) {
  if (!text.trim()) throw new Error("Paste your two columns first.");

  const parsed = Papa.parse(text, {
    delimitersToGuess: ["\t", ","],
    skipEmptyLines: "greedy",
  });

  if (parsed.errors.length) {
    throw new Error(
      "Couldn’t read those columns. In Sheets, select both columns and copy them together."
    );
  }

  const data = parsed.data.slice();
  const first = data[0]?.map((cell) => cell.trim().toLowerCase());

  if (first?.length === 2 && first[0] === "question" && first[1] === "answer") {
    data.shift();
  }

  if (!data.length) throw new Error("Include at least one FAQ below the headers.");

  return data.map((cells, index) => {
    if (cells.length !== 2) {
      throw new Error(
        `FAQ row ${index + 1} has ${cells.length} columns. Use one question column and one answer column.`
      );
    }

    return { question: cells[0].trim(), answer: cells[1].trim() };
  });
}

export const faqs = [
  {
    question: "How do I import FAQs from Google Sheets or Excel?",
    answer:
      "Put each question in the first column and its full answer in the second. Select both columns, copy them, then choose Paste from spreadsheet. A header row labelled Question and Answer is optional. Imported FAQs appear below any entries you’ve already written.",
  },
  {
    question: "Should I copy the HTML embed or the raw JSON-LD?",
    answer:
      "Choose HTML embed if you’re adding the code to your page’s HTML. It includes the opening and closing script tags. Choose JSON-LD if your CMS or SEO plugin has a structured data field that accepts a JSON object.",
  },
  {
    question: "Will pasting the schema add a visible FAQ section to my page?",
    answer:
      "The embed adds structured data. Publish the questions and answers in the visible content of the same page as well. The Reader preview lets you review the wording before copying it into your CMS.",
  },
  {
    question: "Why are the copy and download buttons disabled?",
    answer:
      "Check the message underneath each question. Every entry needs a question and an answer, and each question must be unique. Complete the unfinished entries or remove any spare rows to enable export.",
  },
];

export default function FaqSchemaGenerator({ tool }) {
  const nextId = useRef(2);
  const [rows, setRows] = useState(() => [blankRow(1)]);
  const [view, setView] = useState("embed");
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");
  const [notice, setNotice] = useState("");

  const issues = inspectRows(rows);
  const isBlank =
    rows.length === 1 && !rows[0].question.trim() && !rows[0].answer.trim();

  const completeCount = rows.filter((row) => !issues.has(row.id)).length;
  const ready = rows.length > 0 && issues.size === 0;

  let json = "";
  let generationError = "";

  if (ready) {
    try {
      const csv = Papa.unparse({
        fields: ["question", "answer"],
        data: rows.map((row) => [row.question.trim(), row.answer.trim()]),
      });

      // Use the same FAQPage generator as the toolkit's existing tests.
      // Escaping '<' also keeps user text safe inside an HTML script element.
      json = run(tool, { csv }).text.replace(/</g, "\\u003c");
    } catch (error) {
      generationError = error.message;
    }
  }

  const canExport = ready && Boolean(json);
  const embed = canExport
    ? `<script type="application/ld+json">\n${json}\n</script>`
    : "";
  const selectedCode = view === "json" ? json : embed;

  function makeRow(values) {
    return { ...values, id: nextId.current++ };
  }

  function updateRow(id, field, value) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
    setNotice("");
  }

  function addRow() {
    const row = makeRow({ question: "", answer: "" });
    setRows((current) => [...current, row]);
    setNotice("");
    requestAnimationFrame(() => document.getElementById(`question-${row.id}`)?.focus());
  }

  function removeRow(id) {
    const remaining = rows.filter((row) => row.id !== id);
    setRows(remaining.length ? remaining : [makeRow({ question: "", answer: "" })]);
    setNotice("Question removed.");
  }

  function loadExample() {
    setRows(EXAMPLE.map(makeRow));
    setNotice("SaaS example loaded. Replace it with your published FAQs.");
  }

  function importRows() {
    try {
      const incoming = readSpreadsheet(importText).map(makeRow);
      setRows(isBlank ? incoming : [...rows, ...incoming]);
      setImportText("");
      setImportError("");
      setImportOpen(false);
      setNotice(`${incoming.length} ${incoming.length === 1 ? "FAQ" : "FAQs"} imported.`);
    } catch (error) {
      setImportError(error.message);
    }
  }

  async function copyCode() {
    if (!canExport) return;

    try {
      await navigator.clipboard.writeText(selectedCode);
      setNotice(view === "json" ? "JSON-LD copied." : "HTML embed copied.");
    } catch {
      setNotice("Clipboard unavailable. Select the code to copy it manually.");
    }
  }

  function downloadJson() {
    if (!canExport) return;

    const blob = new Blob([json], { type: "application/ld+json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "faq-schema.jsonld";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
    setNotice("JSON-LD download started.");
  }

  return (
    <div className="faqGenerator">
      <section className="editor" aria-labelledby="faq-editor-title">
        <div className="editorHead">
          <h2 id="faq-editor-title">Build your FAQ section</h2>
          <p>Use the questions and answers visitors can read on your page.</p>

          <div className="editorActions">
            <button
              type="button"
              className="outline"
              aria-expanded={importOpen}
              aria-controls="faq-import"
              onClick={() => {
                setImportOpen(!importOpen);
                setImportError("");
              }}
            >
              {importOpen ? "Close import" : "Paste from spreadsheet"}
            </button>

            {isBlank && (
              <button type="button" className="textButton" onClick={loadExample}>
                Try a SaaS example
              </button>
            )}
          </div>
        </div>

        {importOpen && (
          <div id="faq-import" className="importBox">
            <label htmlFor="faq-import-text">Paste your question and answer columns</label>
            <p>
              Copy two columns from Google Sheets or Excel. You can also paste CSV.
              Imported rows are added below your existing FAQs.
            </p>

            <textarea
              id="faq-import-text"
              rows={5}
              value={importText}
              placeholder={"Question\tAnswer\nHow long is the trial?\tThe trial lasts 14 days."}
              onChange={(event) => {
                setImportText(event.target.value);
                setImportError("");
              }}
            />

            {importError && <p className="issue" role="alert">{importError}</p>}

            <button type="button" className="primary" onClick={importRows}>
              Import FAQs
            </button>
          </div>
        )}

        <div className="rows">
          {rows.map((row, index) => {
            const issue = issues.get(row.id);
            const showIssue = Boolean(issue) && !isBlank;

            return (
              <fieldset className="faqRow" key={row.id}>
                <legend>Question {index + 1}</legend>

                <label htmlFor={`question-${row.id}`}>Question</label>
                <input
                  id={`question-${row.id}`}
                  value={row.question}
                  placeholder="What do buyers ask before they sign up?"
                  onChange={(event) => updateRow(row.id, "question", event.target.value)}
                />

                <label htmlFor={`answer-${row.id}`}>Answer</label>
                <textarea
                  id={`answer-${row.id}`}
                  rows={3}
                  value={row.answer}
                  placeholder="Paste the full answer from your page."
                  onChange={(event) => updateRow(row.id, "answer", event.target.value)}
                />

                <div className="rowFoot">
                  <span className={showIssue ? "issue" : "rowStatus"}>
                    {showIssue ? issue : !issue ? "✓ Complete" : ""}
                  </span>

                  {!isBlank && (
                    <button
                      type="button"
                      className="textButton remove"
                      aria-label={`Remove question ${index + 1}`}
                      onClick={() => removeRow(row.id)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </fieldset>
            );
          })}
        </div>

        <button type="button" className="addButton" onClick={addRow}>
          + Add another FAQ
        </button>
      </section>

      <section className="output" aria-labelledby="faq-output-title">
        <div className="outputHead">
          <h2 id="faq-output-title">Your FAQ markup</h2>
          <span className="count">{completeCount}/{rows.length} ready</span>
        </div>

        <div className="switcher" role="group" aria-label="Output format">
          {[
            ["embed", "HTML embed"],
            ["json", "JSON-LD"],
            ["reader", "Reader preview"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={view === key}
              onClick={() => {
                setView(key);
                setNotice("");
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {view === "reader" ? (
          <div className="reader">
            {isBlank ? (
              <p>Your questions and answers will appear here as you type.</p>
            ) : (
              rows.map((row, index) => (
                <details key={row.id} open>
                  <summary>{row.question.trim() || `Question ${index + 1}`}</summary>
                  <p>{row.answer.trim() || "Your answer will appear here."}</p>
                </details>
              ))
            )}
          </div>
        ) : (
          <div className="codeBox">
            <div className="codeHead">
              <span>{view === "embed" ? "HTML" : "JSON-LD"}</span>
              <span>FAQPage</span>
            </div>

            {canExport ? (
              <pre tabIndex={0} aria-label="Generated FAQ schema">
                <code>{selectedCode}</code>
              </pre>
            ) : (
              <p className="placeholder">
                {generationError ||
                  (isBlank
                    ? "Add your first question and answer to generate the markup."
                    : "Complete each question and answer, and resolve any duplicates to generate the markup.")}
              </p>
            )}
          </div>
        )}

        <p className="hint">
          {view === "embed"
            ? "Paste this script into the HTML of the page that contains these FAQs."
            : view === "json"
              ? "Use this version when your CMS asks for raw JSON-LD."
              : "Open and close each question to review the wording before publishing."}
        </p>

        <div className="exportActions">
          {view !== "reader" && (
            <button
              type="button"
              className="copyButton"
              disabled={!canExport}
              onClick={copyCode}
            >
              {view === "json" ? "Copy JSON-LD" : "Copy HTML embed"}
            </button>
          )}

          <button
            type="button"
            className="downloadButton"
            disabled={!canExport}
            onClick={downloadJson}
          >
            Download JSON-LD
          </button>
        </div>

        <p className="notice" role="status">{notice}</p>
      </section>

      <style jsx>{`
        .faqGenerator {
          --teal: #167273;
          --ink: #092f32;
          --line: #cbdcd6;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          align-items: start;
          gap: 22px;
          color: var(--ink);
        }

        .editor, .output {
          min-width: 0;
          border-radius: 14px;
          padding: clamp(18px, 2.2vw, 30px);
        }

        .editor { background: white; border: 1px solid var(--line); }
        .output { background: #092f32; color: #f2faf6; }
        h2 { margin: 0; font-size: clamp(21px, 2vw, 28px); letter-spacing: -.045em; }
        .editorHead p, .importBox p, .hint, .reader p {
          margin: 9px 0;
          font-size: 13px;
          line-height: 1.65;
        }
        .editorHead p, .importBox p { color: #486661; }

        .editorActions, .exportActions, .switcher, .rowFoot, .outputHead {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 9px;
        }
        .editorActions, .exportActions { margin-top: 17px; }
        .rowFoot, .outputHead { justify-content: space-between; }
        button { font: inherit; cursor: pointer; }
        button:disabled { opacity: .48; cursor: default; }
        .outline, .primary, .copyButton, .downloadButton, .addButton {
          padding: 9px 13px;
          border-radius: 7px;
          font-size: 13px;
          font-weight: 650;
        }
        .outline { background: #fff; border: 1px solid var(--line); }
        .primary { background: var(--teal); color: white; border: 0; }
        .textButton {
          background: transparent;
          border: 0;
          color: var(--teal);
          padding: 5px;
          font-size: 12px;
          font-weight: 650;
        }
        .textButton:hover { text-decoration: underline; }
        .importBox {
          margin-top: 18px;
          padding: 15px;
          background: #eef4f3;
          border-radius: 9px;
        }
        .importBox textarea { margin-bottom: 9px; }
        .rows { display: grid; gap: 16px; margin-top: 22px; }
        .faqRow {
          min-width: 0;
          margin: 0;
          border: 1px solid var(--line);
          border-radius: 9px;
          padding: 10px 15px 12px;
        }
        legend, .count, .codeHead {
          font: 600 11px/1.4 ui-monospace, monospace;
        }
        legend { padding: 0 6px; color: var(--teal); }
        label {
          display: block;
          margin: 6px 0;
          font-size: 13px;
          font-weight: 650;
        }
        input, textarea {
          box-sizing: border-box;
          width: 100%;
          padding: 10px;
          border: 1px solid #bacec7;
          border-radius: 6px;
          background: #fff;
          color: var(--ink);
          font: inherit;
          font-size: 14px;
        }
        textarea { display: block; resize: vertical; }
        .rowFoot { margin-top: 6px; font-size: 12px; }
        .rowFoot:has(> span:empty:only-child) { display: none; }
        .rowStatus { color: #246447; }
        .issue, .importBox p.issue { color: #8a391b; }
        .addButton {
          width: 100%;
          margin-top: 16px;
          background: #f4f9f6;
          color: var(--teal);
          border: 1px dashed #90b8ac;
        }
        .count {
          padding: 5px 8px;
          color: #b8f3d9;
          border: 1px solid #446b63;
          border-radius: 20px;
        }
        .switcher { margin: 20px 0 14px; gap: 5px; }
        .switcher button {
          border: 1px solid #466862;
          border-radius: 6px;
          padding: 7px 10px;
          background: transparent;
          color: #d6e9e1;
          font-size: 12px;
        }
        .switcher button[aria-pressed="true"] {
          background: #b8f3d9;
          border-color: #b8f3d9;
          color: #073c34;
          font-weight: 700;
        }
        .codeBox, .reader {
          overflow: hidden;
          border: 1px solid #365a55;
          border-radius: 9px;
          background: #062629;
        }
        .codeHead {
          display: flex;
          justify-content: space-between;
          padding: 9px 13px;
          color: #c4dfd3;
          background: #16403e;
        }
        pre {
          max-height: 440px;
          overflow: auto;
          margin: 0;
          padding: 16px;
          background: transparent;
          color: #d8f5e8;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
          font: 13px/1.65 ui-monospace, monospace;
        }
        .placeholder { padding: 20px 16px; margin: 0; color: #cadfd6; }
        .reader { padding: 8px 15px; color: var(--ink); background: #f5faf6; }
        .reader details { padding: 12px 0; border-bottom: 1px solid var(--line); }
        .reader details:last-child { border-bottom: 0; }
        .reader summary { cursor: pointer; font-weight: 650; }
        .reader p { white-space: pre-wrap; overflow-wrap: anywhere; }
        .hint, .notice { color: #c2d9d1; }
        .copyButton { border: 0; background: #b8f3d9; color: #073c34; }
        .downloadButton { border: 1px solid #76988d; background: transparent; color: white; }
        .notice { min-height: 1.4em; margin: 9px 0 0; font-size: 12px; }
        @media (min-width: 901px) {
          .output { position: sticky; top: 20px; }
        }
        @media (max-width: 800px) {
          .faqGenerator { grid-template-columns: 1fr; gap: 16px; }
        }
      `}</style>
    </div>
  );
}