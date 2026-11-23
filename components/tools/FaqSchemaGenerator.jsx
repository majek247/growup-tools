import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { Plus, ClipboardPaste, Sparkles, Trash2, Copy, Download, FileCode2, Eye, Code2, Check, AlertCircle, CircleHelp, ChevronDown, RotateCcw, FileJson, ArrowRight, ShieldCheck } from "lucide-react";
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
    question: "Where exactly should I add FAQ schema markup on my website?",
    answer:
      "Add the FAQPage JSON-LD to the HTML of the specific webpage containing those questions and answers, usually inside its head section or through your CMS’s custom code field. Do not add the same FAQ markup sitewide unless the identical FAQs actually appear on every page where it is included.",
  },
  {
    question: "How do I add FAQ schema to WordPress, Webflow or HubSpot?",
    answer:
      "In WordPress, use your SEO plugin’s schema settings or a custom HTML/code insertion feature. In Webflow, use the page’s custom code settings. In HubSpot, add the script through the page template or available head HTML settings. Publish the same questions and answers visibly, then validate the final markup.",
  },
  {
    question: "Do I need a developer to implement FAQPage JSON-LD?",
    answer:
      "No. You can generate FAQPage JSON-LD without coding and paste the HTML embed into a supported CMS custom code field. You may need a developer if your website restricts script insertion or requires template changes. Always check that the markup appears in the published page source and matches visible content.",
  },
  {
    question: "How do I check whether my FAQ schema is valid?",
    answer:
      "Copy the HTML embed from GrowUp’s generator, open Schema.org Validator, select Code Snippet and paste the markup. Run the test and resolve any reported errors. Then inspect your published page to confirm the JSON-LD is present and matches the visible FAQs. Schema validity does not guarantee Google search enhancements.",
  },
  {
    question: "Does FAQ schema improve Google rankings?",
    answer:
      "No. Adding FAQPage schema is not a direct Google ranking factor and does not automatically increase traffic. It describes your questions and answers in machine-readable form. Focus on useful, accurate FAQ content that addresses buyers’ questions, and judge page performance using organic traffic, engagement and conversions rather than schema presence alone.",
  },
  {
    question: "Are FAQ rich results still available for B2B SaaS websites?",
    answer:
      "No. Google stopped displaying FAQ rich results in Search on May 7, 2026, including for B2B SaaS websites. FAQPage remains a valid Schema.org type, so you can still use the markup to describe visible questions and answers. However, you should not expect expandable FAQ results or extra Google search exposure from it.",
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
  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 4500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

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

  function startFresh() {
    setRows([makeRow({ question: "", answer: "" })]);
    setView("embed");
    setImportOpen(false);
    setImportText("");
    setImportError("");
    setNotice("Started a new FAQ set.");
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



async function validateSchema() {
  if (!canExport) return;

  const validatorUrl = "https://validator.schema.org/";

  // Open first to avoid browser popup blockers.
  const validatorWindow = window.open(
    validatorUrl,
    "_blank"
  );

  if (validatorWindow) {
    validatorWindow.opener = null;
  }

  try {
    await navigator.clipboard.writeText(embed);

    setNotice(
      "Schema copied! In Schema.org Validator, select CODE SNIPPET, paste your schema and click RUN TEST."
    );
  } catch {
    setNotice(
      "Validator opened. Copy your HTML embed, then paste it into the CODE SNIPPET tab."
    );
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
    <div className="faq-studio">
      <div className="faq-hero">
        <div>



          <span className="faq-eyebrow"> GROWUP / TECHNICAL SEO</span>
         <h2>Generate your FAQ JSON-LD</h2>
<p>
 Add your questions and answers, check for errors, and copy the generated schema directly into your website.
</p>

          
        </div>



        <button type="button" className="faq-reset" onClick={startFresh}><RotateCcw size={15} /> Start fresh</button>
      </div>


      <div className="faq-workspace">
        <section className="faq-panel faq-editor" aria-labelledby="faq-editor-title">
          <div className="faq-panel-top">
            <div className="faq-section-id">01</div>
            <div className="faq-panel-heading"><span>CONTENT EDITOR</span><h3 id="faq-editor-title">Your Questions & Answers</h3><p>Use the exact FAQs that visitors can read on your webpage.</p></div>
          </div>

          <div className="faq-toolbar">
            <button type="button" className="faq-toolbar-btn" aria-expanded={importOpen} aria-controls="faq-import" onClick={() => {setImportOpen(!importOpen);setImportError("");}}><ClipboardPaste size={15} /> {importOpen ? "Close import" : "Import from spreadsheet"} <ChevronDown size={13} className={importOpen ? "faq-flip" : ""}/></button>
            <button type="button" className="faq-toolbar-btn faq-example" onClick={loadExample}><Sparkles size={15} /> Load example</button>
          </div>

          {importOpen && (
            <div className="faq-import" id="faq-import">
              <div className="faq-import-title"><FileJson size={17} /><strong>Paste two columns, no formatting needed</strong></div>
              <p>Copy <b>Question</b> and <b>Answer</b> columns from Google Sheets or Excel. CSV also works; a header row is optional.</p>
              <label htmlFor="faq-import-text">Spreadsheet data</label>
              <textarea id="faq-import-text" rows={5} value={importText} placeholder={"Question\tAnswer\nHow long is the trial?\tThe trial lasts 14 days."} onChange={e=>{setImportText(e.target.value);setImportError("");}} />
              {importError && <p className="faq-inline-error" role="alert"><AlertCircle size={14}/>{importError}</p>}
              <div className="faq-import-actions"><button type="button" className="faq-primary" onClick={importRows}>Import FAQs <ArrowRight size={15}/></button><button type="button" className="faq-link" onClick={()=>setImportOpen(false)}>Cancel</button></div>
            </div>
          )}

          <div className="faq-rows">
            {rows.map((row, index) => {
              const issue = issues.get(row.id);
              const showIssue = Boolean(issue) && !isBlank;
              const rowDone = !issue;
              return (
                <div className={`faq-entry ${showIssue ? "faq-entry-warning" : ""}`} key={row.id}>
                  <div className="faq-entry-head"><div className="faq-entry-identity"><span className="faq-entry-index">{String(index + 1).padStart(2,"0")}</span><strong>FAQ {index + 1}</strong></div><div className="faq-entry-actions"><span className={`faq-entry-status ${rowDone ? "is-ready" : ""}`}>{rowDone ? <Check size={12}/> : <CircleHelp size={12}/>} {rowDone ? "Complete" : "Draft"}</span><button type="button" className="faq-delete" aria-label={`Remove FAQ ${index + 1}`} title="Remove FAQ" onClick={()=>removeRow(row.id)}><Trash2 size={15}/></button></div></div>
                  <div className="faq-entry-body">
                    <label htmlFor={`question-${row.id}`}>Question <span>Required</span></label>
                    <input id={`question-${row.id}`} value={row.question} placeholder="e.g. Can we connect our existing CRM?" onChange={event=>updateRow(row.id,"question",event.target.value)} aria-invalid={showIssue && !row.question.trim()} />
                    <div className="faq-label-line"><label htmlFor={`answer-${row.id}`}>Answer <span>Required</span></label><small>{row.answer.length} characters</small></div>
                    <textarea id={`answer-${row.id}`} rows={4} value={row.answer} placeholder="Write the complete answer visitors will see on your website..." onChange={event=>updateRow(row.id,"answer",event.target.value)} aria-invalid={showIssue && !row.answer.trim()} />
                    {showIssue && <p className="faq-row-issue" role="alert"><AlertCircle size={14}/>{issue}</p>}
                  </div>
                </div>
              );
            })}
          </div>
          <button type="button" className="faq-add" onClick={addRow}><Plus size={18}/> Add another question <span>Continue building your FAQ set</span></button>
          <div className="faq-editor-note"><ShieldCheck size={17}/><span>Only add questions and answers that are also visible to visitors on the published page.</span></div>
        </section>

        <section className="faq-panel faq-output" aria-labelledby="faq-output-title">
          <div className="faq-panel-top">
            <div className="faq-section-id">02</div>
            <div className="faq-panel-heading"><span>LIVE OUTPUT</span><h3 id="faq-output-title">Your FAQ markup</h3><p>Review the page content or copy the structured data when it's ready.</p></div>
          </div>
          <div className="faq-output-progress"><div><strong>{canExport ? "Ready for your website" : "Finish your FAQs to export"}</strong><span>{canExport ? `${rows.length} valid ${rows.length===1?"question":"questions"} · FAQPage JSON-LD` : `${completeCount} of ${rows.length} entries ready`}</span></div><span className={`faq-pill ${canExport ? "faq-pill-ready" : ""}`}>{canExport ? <Check size={13}/> : <CircleHelp size={13}/>} {canExport ? "Ready to export" : "In progress"} </span></div>

          <div className="faq-view-tabs" role="group" aria-label="Output format">
            <button type="button" aria-pressed={view==="embed"} onClick={()=>{setView("embed");setNotice("");}}><Code2 size={15}/> HTML embed</button>
            <button type="button" aria-pressed={view==="json"} onClick={()=>{setView("json");setNotice("");}}><FileJson size={15}/> JSON-LD</button>
            <button type="button" aria-pressed={view==="reader"} onClick={()=>{setView("reader");setNotice("");}}><Eye size={15}/> Reader preview</button>
          </div>
          {view === "reader" ? (
            <div className="faq-reader">
              <div className="faq-reader-head"><Eye size={15}/> What visitors will read</div>
              {isBlank ? <div className="faq-empty"><CircleHelp size={25}/><strong>Your FAQ preview goes here</strong><p>Start writing a question and answer on the left to see them here.</p></div> : rows.map((row,index)=>(
                <details key={row.id} open><summary>{row.question.trim() || `Question ${index+1}`}</summary><p>{row.answer.trim() || "Your answer will appear here."}</p></details>
              ))}
            </div>
          ) : (
            <div className="faq-codebox">
              <div className="faq-codehead"><span><FileCode2 size={14}/> {view === "embed" ? "HTML / SCRIPT TAG" : "RAW JSON-LD"}</span><span>FAQPage</span></div>
              {canExport ? <pre tabIndex={0} aria-label="Generated FAQ schema"><code>{selectedCode}</code></pre> : <div className="faq-code-empty"><FileCode2 size={26}/><strong>Schema will appear here</strong><p>{generationError || (isBlank ? "Add your first FAQ to generate the markup automatically." : "Complete the missing fields and resolve duplicates to generate valid markup.")}</p></div>}
            </div>
          )}
          <div className="faq-guidance"><CircleHelp size={16}/><p>{view==="embed" ? "Paste this script into the HTML of the same page that displays your FAQs." : view==="json" ? "Use the raw JSON-LD if your CMS has a dedicated structured data field." : "This preview is for reviewing copy. Your FAQs must also be visible on your actual published page."}</p></div>
        

<div className="faq-export-actions">

  {view !== "reader" && (
    <button
      type="button"
      className="faq-primary"
      disabled={!canExport}
      onClick={copyCode}
    >
      <Copy size={16} />
      {view === "json" ? "Copy JSON-LD" : "Copy HTML embed"}
    </button>
  )}

<button
  type="button"
  className="faq-google-test"
  disabled={!canExport}
  onClick={validateSchema}
  title="Copy your FAQ markup and open Schema.org Validator"
>
  <ArrowRight size={15} />
  Validate schema
</button>


  <button
    type="button"
    className="faq-secondary"
    disabled={!canExport}
    onClick={downloadJson}
  >
    <Download size={16} />
    Download JSON-LD
  </button>

</div>



          <div className="faq-privacy"><ShieldCheck size={15}/> Your draft stays in this browser tab. No account or upload required.</div>
        </section>
      </div>
      {notice && <div className="faq-toast" role="status"><Check size={16}/>{notice}</div>}

      <Head>
  <link
    rel="preconnect"
    href="https://fonts.googleapis.com"
  />
  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossOrigin="anonymous"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap"
    rel="stylesheet"
  />
</Head>

<style jsx global>{`



.faq-studio .faq-google-test {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 39px;
  padding: 12px 15px;

  background: #eef7f3;
  border: 1px solid #cce5dc;
  border-radius: 8px;

  color: #167273;
  font-family: "Montserrat", sans-serif !important;
  font-size: 10px;
  font-weight: 800;

  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.faq-studio .faq-google-test:hover:not(:disabled) {
  background: #dff1e9;
  border-color: #a7d3c2;
}

.faq-studio .faq-google-test:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}


        .faq-studio{--faq-teal:#167273;--faq-dark:#073b3b;--faq-ink:#011522;--faq-muted:#667e78;--faq-border:#dce9e5;font-family:"Montserrat",Arial,sans-serif!important;color:var(--faq-ink);width:100%;max-width:1240px;margin:0 auto;padding:8px 0 42px;background:#fff}
        .faq-studio,
.faq-studio *,
.faq-studio *::before,
.faq-studio *::after {
  box-sizing: border-box;
  font-family: "Montserrat", sans-serif !important;
}

.faq-studio input,
.faq-studio textarea,
.faq-studio button,
.faq-studio select,
.faq-studio pre,
.faq-studio code,
.faq-studio label,
.faq-studio h1,
.faq-studio h2,
.faq-studio h3,
.faq-studio p,
.faq-studio span,
.faq-studio strong {
  font-family: "Montserrat", sans-serif !important;
}
        .faq-studio button{cursor:pointer}.faq-studio button:disabled{cursor:not-allowed;opacity:.45}.faq-studio button:focus-visible,.faq-studio input:focus-visible,.faq-studio textarea:focus-visible,.faq-studio summary:focus-visible{outline:3px solid #a2ddd0;outline-offset:2px}
        .faq-studio .faq-hero{display:flex;justify-content:space-between;align-items:flex-start;gap:24px;margin-bottom:24px;padding:6px 0 4px;background:#fff!important;border:0!important;box-shadow:none!important}
        .faq-studio .faq-eyebrow{display:inline-flex;gap:7px;align-items:center;font-size:10px;font-weight:800;letter-spacing:.11em;color:var(--faq-teal)}
        .faq-studio .faq-hero h2{margin:10px 0 9px!important;font-size:clamp(25px,2.7vw,36px)!important;letter-spacing:-.045em!important;font-weight:800!important;line-height:1.2!important;color:var(--faq-ink)!important}
        .faq-studio .faq-hero p{margin:0;max-width:750px;color:var(--faq-muted);font-size:13px;line-height:1.8}
        .faq-studio .faq-reset{display:inline-flex;align-items:center;gap:8px;padding:11px 14px;background:white;border:1px solid var(--faq-border);border-radius:9px;color:var(--faq-dark);white-space:nowrap;font-size:11px;font-weight:750}
        .faq-studio .faq-reset:hover,.faq-studio .faq-toolbar-btn:hover,.faq-studio .faq-secondary:hover{background:#f2f8f5}






        .faq-studio .faq-workspace{display:grid;grid-template-columns:minmax(0,1.06fr) minmax(0,.94fr);align-items:start;gap:16px}
        .faq-studio .faq-panel{min-width:0;background:#fff;border:1px solid var(--faq-border);border-radius:15px;padding:22px;box-shadow:0 6px 24px rgba(6,60,48,.025)}
        .faq-studio .faq-panel-top{display:flex;gap:12px;align-items:flex-start;margin-bottom:19px}.faq-studio .faq-section-id{width:30px;height:30px;display:grid;place-items:center;border-radius:8px;background:#e9f5f0;color:var(--faq-teal);font-size:11px;font-weight:850;flex:0 0 30px}.faq-studio .faq-panel-heading{min-width:0}.faq-studio .faq-panel-heading>span{display:block;color:var(--faq-teal);letter-spacing:.095em;font-size:9px;font-weight:850;margin-bottom:5px}.faq-studio .faq-panel-heading h3{margin:0 0 5px!important;color:var(--faq-ink)!important;font-size:19px!important;letter-spacing:-.03em!important;font-weight:800!important;line-height:1.3!important}.faq-studio .faq-panel-heading p{margin:0;color:var(--faq-muted);font-size:11px;line-height:1.7}
        .faq-studio .faq-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding-bottom:18px;border-bottom:1px solid #e8efeb}.faq-studio .faq-toolbar-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:1px solid var(--faq-border);background:#fff;color:#28524a;border-radius:8px;padding:10px 12px;font-size:10px;font-weight:750}.faq-studio .faq-toolbar-btn.faq-example{color:var(--faq-teal)}.faq-studio .faq-flip{transform:rotate(180deg)}
        .faq-studio .faq-import{margin-top:16px;padding:17px;background:#f5f9f7;border:1px solid #d9ebe3;border-radius:11px}.faq-studio .faq-import-title{display:flex;align-items:center;gap:8px;color:var(--faq-dark);font-size:12px}.faq-studio .faq-import>p{color:var(--faq-muted);font-size:11px;line-height:1.7;margin:9px 0 14px}.faq-studio .faq-import label{display:block;margin-bottom:7px;font-size:10px;font-weight:800}.faq-studio .faq-import textarea{min-height:115px;font-size:11px!important}.faq-studio .faq-import-actions{display:flex;gap:12px;align-items:center;margin-top:12px}.faq-studio .faq-link{border:0;background:transparent;color:var(--faq-teal);font-size:11px;font-weight:700}
        .faq-studio .faq-rows{display:grid;gap:14px;margin-top:18px}.faq-studio .faq-entry{overflow:hidden;border:1px solid #e1ebe7;border-radius:11px;background:#fff}.faq-studio .faq-entry-warning{border-color:#ebd7bc}.faq-studio .faq-entry-head{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 14px;background:#fafcfb;border-bottom:1px solid #edf2ef}.faq-studio .faq-entry-identity,.faq-studio .faq-entry-actions{display:flex;gap:9px;align-items:center}.faq-studio .faq-entry-index{display:grid;place-items:center;border-radius:6px;background:#e7f3ed;color:var(--faq-teal);font-size:10px;font-weight:800;width:26px;height:26px}.faq-studio .faq-entry-identity strong{font-size:11px;color:#23443e}.faq-studio .faq-entry-status{display:inline-flex;gap:4px;align-items:center;color:#8b9893;font-size:9px;font-weight:750}.faq-studio .faq-entry-status.is-ready{color:#267450}.faq-studio .faq-delete{display:grid;place-items:center;width:28px;height:28px;padding:0;border:1px solid transparent;border-radius:6px;background:transparent;color:#91a49c}.faq-studio .faq-delete:hover{color:#b94d42;background:#fff2f0;border-color:#f0d5d1}
        .faq-studio .faq-entry-body{padding:15px 14px 14px}.faq-studio .faq-entry-body label,.faq-studio .faq-import label{display:block;color:#294c45;font-size:10px;font-weight:800;margin:0 0 8px}.faq-studio .faq-entry-body label span{font-size:9px;color:#a0aca8;font-weight:600;margin-left:5px}.faq-studio .faq-label-line{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:15px}.faq-studio .faq-label-line small{font-size:9px;color:#8a9b96;margin-bottom:8px}.faq-studio .faq-entry input,.faq-studio .faq-entry textarea,.faq-studio .faq-import textarea{display:block;width:100%;border:1px solid #d5e2dc;background:#fff;color:var(--faq-ink);border-radius:8px;padding:12px 13px;outline:none;font-size:12px!important;line-height:1.65;transition:border-color .15s,box-shadow .15s}.faq-studio .faq-entry textarea{min-height:105px;resize:vertical}.faq-studio .faq-entry input:focus,.faq-studio .faq-entry textarea:focus,.faq-studio .faq-import textarea:focus{border-color:var(--faq-teal);box-shadow:0 0 0 3px rgba(22,114,115,.09)}.faq-studio .faq-entry input::placeholder,.faq-studio .faq-entry textarea::placeholder{color:#a4b3ad}.faq-studio .faq-row-issue,.faq-studio .faq-inline-error{display:flex;gap:7px;align-items:flex-start;color:#a45c2d;margin:10px 0 0;font-size:10px;line-height:1.6}
        .faq-studio .faq-add{width:100%;display:flex;align-items:center;justify-content:center;gap:9px;flex-wrap:wrap;margin-top:15px;border:1px dashed #96c3b4;border-radius:10px;padding:14px;background:#f6fbf8;color:var(--faq-teal);font-size:12px;font-weight:800}.faq-studio .faq-add:hover{background:#eaf6ef}.faq-studio .faq-add span{display:block;width:100%;color:#83968f;font-size:9px;font-weight:500}.faq-studio .faq-editor-note{display:flex;gap:9px;align-items:flex-start;padding:16px 2px 2px;color:#728c83;font-size:10px;line-height:1.6}.faq-studio .faq-editor-note svg{flex:0 0 17px;color:var(--faq-teal)}
        .faq-studio .faq-output{position:sticky;top:16px}.faq-studio .faq-output-progress{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px;border:1px solid #dcece4;border-radius:10px;background:#f1f8f4}.faq-studio .faq-output-progress>div{display:grid;gap:5px;min-width:0}.faq-studio .faq-output-progress strong{font-size:11px;color:var(--faq-dark);font-weight:800}.faq-studio .faq-output-progress>div span{font-size:9px;color:#719184}.faq-studio .faq-pill{display:inline-flex;align-items:center;gap:4px;white-space:nowrap;background:#fff;border:1px solid #d3e6dc;border-radius:30px;padding:6px 9px;color:#7b9187;font-size:9px;font-weight:750}.faq-studio .faq-pill-ready{color:#13734d}
        .faq-studio .faq-view-tabs{display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;padding:4px;background:#f2f6f4;border:1px solid #e5efea;border-radius:10px;margin:16px 0}.faq-studio .faq-view-tabs button{display:inline-flex;align-items:center;justify-content:center;gap:6px;background:transparent;border:0;border-radius:7px;color:#728b82;padding:11px 5px;font-size:10px;font-weight:700}.faq-studio .faq-view-tabs button[aria-pressed="true"]{background:#fff;color:var(--faq-dark);box-shadow:0 1px 5px #193e321a}
        .faq-studio .faq-codebox{background:#0b2029;border:1px solid #1d3a41;border-radius:11px;overflow:hidden}.faq-studio .faq-codehead{display:flex;align-items:center;justify-content:space-between;gap:10px;background:#102f37;color:#b2d5cf;padding:12px 15px;font-size:9px;font-weight:750;letter-spacing:.07em}.faq-studio .faq-codehead span:first-child{display:flex;align-items:center;gap:7px}.faq-studio .faq-codebox pre{max-height:420px;min-height:230px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;margin:0;padding:18px;font-family:"Montserrat",Arial,sans-serif!important;font-size:10px;line-height:1.8;color:#d8f5e8}.faq-studio .faq-codebox code{font-family:"Montserrat",Arial,sans-serif!important}.faq-studio .faq-code-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:230px;gap:10px;padding:25px 30px;text-align:center}.faq-studio .faq-code-empty svg{color:#68968b}.faq-studio .faq-code-empty strong{font-size:12px;color:#e6faf2}.faq-studio .faq-code-empty p{margin:0;max-width:280px;color:#a3bdb8;font-size:10px;line-height:1.7}
        .faq-studio .faq-reader{background:#fff;border:1px solid var(--faq-border);border-radius:10px;padding:0 16px;min-height:245px}.faq-studio .faq-reader-head{display:flex;align-items:center;gap:7px;color:#6b857a;font-size:10px;font-weight:800;padding:14px 0;border-bottom:1px solid #e8f0ec}.faq-studio .faq-reader details{border-bottom:1px solid #e7eeea;padding:13px 0}.faq-studio .faq-reader details:last-child{border-bottom:0}.faq-studio .faq-reader summary{cursor:pointer;font-size:12px;font-weight:750;color:var(--faq-ink);line-height:1.6}.faq-studio .faq-reader details p{font-size:11px;color:#627d73;line-height:1.8;white-space:pre-wrap;overflow-wrap:anywhere;margin:10px 0 0}.faq-studio .faq-reader .faq-empty{text-align:center;display:grid;place-items:center;gap:9px;padding:45px 15px;color:#82978f}.faq-studio .faq-reader .faq-empty strong{color:#25463c;font-size:12px}.faq-studio .faq-reader .faq-empty p{margin:0;font-size:10px;line-height:1.65}
        .faq-studio .faq-guidance{display:flex;gap:9px;align-items:flex-start;margin:14px 0;color:#69827a}.faq-studio .faq-guidance svg{flex:0 0 16px;color:var(--faq-teal);margin-top:1px}.faq-studio .faq-guidance p{margin:0;font-size:10px;line-height:1.7}.faq-studio .faq-export-actions{display:flex;gap:9px;flex-wrap:wrap}.faq-studio .faq-primary,.faq-studio .faq-secondary{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:8px;padding:12px 15px;min-height:39px;font-size:10px;font-weight:800}.faq-studio .faq-primary{background:var(--faq-dark);color:#fff;border:1px solid var(--faq-dark)}.faq-studio .faq-primary:not(:disabled):hover{background:var(--faq-teal)}.faq-studio .faq-secondary{background:#fff;border:1px solid var(--faq-border);color:var(--faq-dark)}.faq-studio .faq-privacy{display:flex;gap:7px;align-items:center;color:#83968e;font-size:9px;border-top:1px solid #e9efec;padding-top:14px;margin-top:19px;line-height:1.5}.faq-studio .faq-privacy svg{flex:0 0 15px}
        .faq-studio .faq-toast{position:sticky;bottom:14px;margin:14px 0 0 auto;width:max-content;max-width:100%;display:flex;align-items:center;gap:8px;background:#ebf8f1;border:1px solid #b5dbcb;border-radius:9px;padding:11px 15px;color:#135643;font-size:11px;font-weight:700;box-shadow:0 8px 22px #0b47301a}
        @media(max-width:1020px){
  .faq-studio .faq-workspace{
    grid-template-columns:1fr;
  }

  .faq-studio .faq-output{
    position:static;
  }
}
        @media(max-width:580px){.faq-studio .faq-hero{flex-direction:column;gap:14px}.faq-studio .faq-panel{padding:17px} .faq-studio .faq-view-tabs button{font-size:9px;gap:4px}.faq-studio .faq-view-tabs svg{display:none}.faq-studio .faq-toolbar-btn{flex:1}.faq-studio .faq-export-actions{display:grid}.faq-studio .faq-export-actions button{width:100%}}
      `}</style>
    </div>
  );
}
