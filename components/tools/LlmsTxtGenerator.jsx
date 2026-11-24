"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import Papa from "papaparse";
import {
  ArrowDown, ArrowUp, Check, CheckCircle2, ChevronDown, ChevronUp,
  Clipboard, Copy, Download, ExternalLink, FileText, FolderPlus,
  Info, Link2, Plus, RotateCcw, ShieldCheck, Trash2, Upload,
  AlertCircle, X, Eye, Code2,
} from "lucide-react";


export const faqs = [
  {
    question: "What is an llms.txt file, and what does it actually do?",
    answer:
      "An llms.txt file is a plain text file that lists your website's most important pages and explains what they contain. It's designed to help AI tools find relevant information about your business, products or services. ",
  },
  {
    question: "Do I need an llms.txt file for my website?",
    answer:
      "No. You don’t need an llms.txt file for your website to appear in Google or AI search results. It’s an optional file that lists your key pages for AI tools that choose to read it. It doesn’t replace good content or regular SEO.",
  },
  {
    question: "How is llms.txt different from robots.txt and sitemap.xml?",
    answer:
      "Robots.txt controls which pages compliant crawlers are allowed to access. Sitemap.xml helps search engines find your website's URLs. Llms.txt gives AI tools a shorter, more organised list of important pages, along with descriptions of what they contain. Unlike the other two, llms.txt isn't widely adopted as a standard.",
  },
  {
    question: "Does ChatGPT, Claude or Perplexity actually use llms.txt files?",
    answer:
      "Not officially. ChatGPT, Claude and Perplexity haven't confirmed that their search systems routinely use llms.txt files. Some AI tools support the format, but adding the file to your website doesn't mean these platforms will read or use it.",
  },
  {
    question: "Will adding llms.txt help my website appear more often in AI search results?",
    answer:
      "Not necessarily. There's no reliable evidence that adding an llms.txt file improves your visibility in AI search results. AI platforms don't automatically recommend websites because they have one. It's more important to publish useful content, make your website accessible and answer questions your potential customers are searching for.",
  },
  {
    question: "Which pages should I include in my llms.txt file?",
    answer:
      "Include the pages someone would need to understand your product. If you run a SaaS company, that usually means your product pages, pricing, features and documentation. You can also include customer stories and useful guides. Focus on pages with valuable information rather than adding every link you have.",
  },
  {
    question: "Where should I upload the llms.txt file on my website?",
    answer:
      "Upload your llms.txt file to your website's main directory so it's accessible at https://yourdomain.com/llms.txt. You can usually do this through your hosting provider's file manager. Once uploaded, open the link in your browser to make sure the file is publicly accessible.",
  },
];



let nextId = 0;
function uid() { nextId += 1; return `llms-${nextId}`; }
const freshLink = () => ({ id: uid(), title: "", url: "", description: "" });
const freshSection = (name = "") => ({ id: uid(), name, optional: false, links: [freshLink()] });
const BLANK = () => ({ name: "", site: "", summary: "", context: "", sections: [freshSection("Product")] });
const EXAMPLE = () => ({
  name: "Cedar Analytics", site: "https://example.com",
  summary: "Revenue reporting software for B2B teams using HubSpot.",
  context: "Start with Product for capabilities and pricing. Use Documentation for setup and integration details.",
  sections: [
    { id: uid(), name: "Product", optional: false, links: [
      { id: uid(), title: "Product overview", url: "/product", description: "Account-level reporting and supported CRM workflows." },
      { id: uid(), title: "Pricing", url: "/pricing", description: "Plans, billing periods and included seats." },
    ] },
    { id: uid(), name: "Documentation", optional: false, links: [
      { id: uid(), title: "HubSpot setup", url: "/docs/hubspot", description: "Connect your CRM and map deal stages." },
    ] },
    { id: uid(), name: "Resources", optional: true, links: [
      { id: uid(), title: "Reporting glossary", url: "/resources/glossary", description: "Definitions used in pipeline reports." },
    ] },
  ],
});

const compact = s => String(s || "").trim().replace(/\s+/g, " ");
const safeText = s => compact(s).replace(/([\\`*_[\]<>#])/g, "\\$1");
function parseURL(value, base) {
  const raw = String(value || "").trim();
  if (!raw || /[\s\\]/.test(raw)) throw Error("Invalid URL");
  const relative = raw.startsWith("/") && !raw.startsWith("//");
  if (!relative && !/^https?:\/\//i.test(raw)) throw Error("Invalid URL");
  if (relative && !base) throw Error("Website URL needed for relative paths");
  const parsed = relative ? new URL(raw, base) : new URL(raw);
  if (!["http:", "https:"].includes(parsed.protocol) || !parsed.hostname || parsed.username || parsed.password) throw Error("Invalid URL");
  return parsed;
}
export function buildLlmsTxt(draft) {
  const issues = [], blocks = [], optional = [], seen = new Set();
  let base = "", linkCount = 0;
  const name = compact(draft.name);
  if (name) blocks.push(`# ${safeText(name)}`);
  else issues.push("Add your company or product name.");
  if (compact(draft.site)) {
    try { base = parseURL(draft.site).origin; }
    catch { issues.push("Enter a valid website URL, such as https://yourcompany.com."); }
  } else issues.push("Add your website URL so we can turn /paths into full links.");
  if (compact(draft.summary)) blocks.push(`> ${safeText(draft.summary)}`);
  if (String(draft.context || "").trim()) {
    blocks.push(draft.context.trim().split(/\n\s*\n/).map(safeText).join("\n\n"));
  }
  (draft.sections || []).forEach((section, index) => {
    const label = compact(section.name);
    if (!label) issues.push(`Section ${index + 1} needs a name.`);
    const lines = [];
    (section.links || []).forEach((link, i) => {
      const where = `${label || `Section ${index + 1}`}, link ${i + 1}`;
      if (!compact(link.title) && !compact(link.url) && !compact(link.description)) return;
      if (!compact(link.title) || !compact(link.url)) { issues.push(`${where} needs a title and URL.`); return; }
      let target;
      try { target = parseURL(link.url, base); }
      catch { issues.push(`${where}: enter a full URL, or a /path with a valid website URL.`); return; }
      if (seen.has(target.href)) { issues.push(`${where} duplicates a link already in the file.`); return; }
      seen.add(target.href);
      const destination = target.href.replace(/\(/g, "%28").replace(/\)/g, "%29");
      lines.push(`- [${safeText(link.title)}](${destination})${compact(link.description) ? `: ${safeText(link.description)}` : ""}`);
      linkCount += 1;
    });
    if (!lines.length) return;
    if (section.optional || label.toLowerCase() === "optional") optional.push(...lines);
    else if (label) blocks.push(`## ${safeText(label)}\n\n${lines.join("\n")}`);
  });
  if (optional.length) blocks.push(`## Optional\n\n${optional.join("\n")}`);
  if (!linkCount) issues.push("Add at least one page to include in the file.");
  return { text: blocks.join("\n\n") + (blocks.length ? "\n" : ""), issues, count: linkCount, base };
}
function parseImport(raw) {
  const parsed = Papa.parse(raw.trim(), {
    header: true, skipEmptyLines: "greedy", delimitersToGuess: [",", "\t"],
    transformHeader: h => h.trim().toLowerCase(), transform: v => typeof v === "string" ? v.trim() : v,
  });
  if (parsed.errors.length || !["section", "title", "url"].every(h => parsed.meta.fields?.includes(h))) {
    throw Error("Use columns named section, title and url. You can also add description.");
  }
  if (!parsed.data.length) throw Error("Paste at least one row below the headers.");
  parsed.data.forEach((r, i) => {
    if (!r.section || !r.title || !r.url) throw Error(`Complete the section, title and URL in row ${i + 2}.`);
  });
  return parsed.data;
}
function Input({ label, hint, value, onChange, placeholder, textarea = false, required = false }) {
  return <label className="ll-field">
    <span className="ll-label">{label}{required && <em>Required</em>}</span>
    {textarea ? <textarea rows={3} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
      : <input value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} />}
    {hint && <small>{hint}</small>}
  </label>;
}

export default function LlmsTxtGenerator() {
  const [draft, setDraft] = useState(BLANK);
  const [preview, setPreview] = useState("file");
  const [expanded, setExpanded] = useState({});
  const [importOpen, setImportOpen] = useState(false);
  const [paste, setPaste] = useState("");
  const [importError, setImportError] = useState("");
  const [notice, setNotice] = useState("");
  const [dirty, setDirty] = useState(false);
  const importRef = useRef(null);
  const result = useMemo(() => buildLlmsTxt(draft), [draft]);
  const ready = result.issues.length === 0;
  const byteSize = useMemo(() => new TextEncoder().encode(result.text).length, [result.text]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(timer);
  }, [notice]);
  function update(transform) { setDraft(previous => transform(previous)); setDirty(true); setNotice(""); }
  function detail(key, value) { update(d => ({ ...d, [key]: value })); }
  function editSection(id, changes) { update(d => ({ ...d, sections: d.sections.map(s => s.id === id ? { ...s, ...changes } : s) })); }
  function editLink(sid, lid, changes) { update(d => ({ ...d, sections: d.sections.map(s => s.id === sid ? { ...s, links: s.links.map(l => l.id === lid ? { ...l, ...changes } : l) } : s) })); }
  function removeLink(sid, lid) { update(d => ({ ...d, sections: d.sections.map(s => s.id === sid ? { ...s, links: s.links.filter(l => l.id !== lid) } : s) })); }
  function addLink(sid) { update(d => ({ ...d, sections: d.sections.map(s => s.id === sid ? { ...s, links: [...s.links, freshLink()] } : s) })); setExpanded(e => ({ ...e, [sid]: true })); }
  function addSection() { const section = freshSection(); update(d => ({ ...d, sections: [...d.sections, section] })); setExpanded(e => ({ ...e, [section.id]: true })); }
  function removeSection(sid) {
    const section = draft.sections.find(s => s.id === sid);
    if (section?.links.some(l => compact(l.title) || compact(l.url)) && !window.confirm("Remove this section and all its links?")) return;
    update(d => ({ ...d, sections: d.sections.filter(s => s.id !== sid) }));
  }
  function moveSection(index, amount) { update(d => { const next = [...d.sections]; const j = index + amount; if (j < 0 || j >= next.length) return d; [next[index], next[j]] = [next[j], next[index]]; return { ...d, sections: next }; }); }
  function reset(which) {
    if (dirty && !window.confirm("Replace the current draft? Your changes won't be saved.")) return;
    setDraft(which === "example" ? EXAMPLE() : BLANK()); setDirty(false); setNotice(which === "example" ? "Example loaded." : "Started a blank file.");
    setImportOpen(false); setPaste(""); setImportError(""); setExpanded({}); setPreview("file");
  }
  function importRows() {
    try {
      const rows = parseImport(paste);
      update(d => {
        const sections = d.sections.map(s => ({ ...s, links: [...s.links] }));
        rows.forEach(row => {
          const key = compact(row.section).toLowerCase();
          let section = sections.find(s => compact(s.name).toLowerCase() === key);
          if (!section) { section = { id: uid(), name: compact(row.section), optional: key === "optional", links: [] }; sections.push(section); }
          section.links.push({ id: uid(), title: row.title, url: row.url, description: row.description || "" });
        });
        return { ...d, sections };
      });
      setImportOpen(false); setImportError(""); setPaste(""); setNotice(`Imported ${rows.length} links.`);
    } catch (error) { setImportError(error.message); }
  }
  async function copy() {
    if (!ready) return;
    try { await navigator.clipboard.writeText(result.text); setNotice("Copied llms.txt contents."); }
    catch { setNotice("Clipboard unavailable. Try downloading the file instead."); }
  }
  function download() {
    if (!ready) return;
    const link = document.createElement("a");
    const url = URL.createObjectURL(new Blob([result.text], { type: "text/plain;charset=utf-8" }));
    link.href = url; link.download = "llms.txt"; document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000); setNotice("Downloaded llms.txt.");
  }




async function validateFile() {
  if (!ready) return;

  // Open immediately to avoid popup blockers.
  window.open(
    "https://llmstxtchecker.net/",
    "_blank",
    "noopener,noreferrer"
  );

  try {
    await navigator.clipboard.writeText(result.text);

    setNotice(
      "File copied. Paste it into the validator's text input to check it."
    );
  } catch {
    setNotice(
      "Validator opened. Copy your file contents manually and paste them into the validator."
    );
  }
}



  return <div className="ll-studio">
    <Head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;650;700;750;800&display=swap" rel="stylesheet"/></Head>
    <div className="ll-top">
      <div><span className="ll-kicker">FREE AI SEARCH TOOL</span><h2>Build your llms.txt file</h2><p>Add your website's important pages, organise them into sections and download your finished llms.txt file.</p></div>
      <div className="ll-top-actions"><button type="button" className="ll-quiet" onClick={() => reset("example")}><FileText size={15}/> Load example</button><button type="button" className="ll-quiet" onClick={() => reset("blank")}><RotateCcw size={15}/> Start fresh</button></div>
    </div>
    <div className="ll-grid">
      <section className="ll-panel ll-editor" aria-label="File editor">
        <div className="ll-panel-head"><span className="ll-num">01</span><div><span className="ll-overline">FILE DETAILS</span><h3>About your website</h3><p>Add the basics so readers know what your website offers.</p></div></div>
        <div className="ll-fields">
          <Input label="Company or product name" required value={draft.name} onChange={v => detail("name", v)} placeholder="e.g. Acme Analytics" />
          <Input label="Website URL" required value={draft.site} onChange={v => detail("site", v)} placeholder="https://example.com" hint="You can use short paths like /pricing for links on this website." />
          <Input label="One-sentence description" value={draft.summary} onChange={v => detail("summary", v)} placeholder="What does your product or company do?" />
          <Input label="Extra context (optional)" textarea value={draft.context} onChange={v => detail("context", v)} placeholder="What should someone know before exploring these links?" />
        </div>
        <div className="ll-divider"/>
        <div className="ll-list-head"><div><span className="ll-overline">CURATED PAGES</span><h3>Sections and links</h3><p>Group your most useful pages by topic, such as Product or Documentation.</p></div><button type="button" className="ll-small-btn" aria-expanded={importOpen} onClick={() => { setImportOpen(x => !x); setImportError(""); }}><Upload size={14}/> Import links</button></div>
        {importOpen && <div className="ll-import" ref={importRef}>
          <div className="ll-import-title"><strong>Import links from a spreadsheet</strong><button type="button" aria-label="Close import" onClick={() => setImportOpen(false)}><X size={16}/></button></div>
          <p>Paste rows from Google Sheets or CSV. Include column headers: <code>section, title, url</code>. The <code>description</code> column is optional.</p>
          <textarea aria-label="Paste spreadsheet rows" value={paste} onChange={e => { setPaste(e.target.value); setImportError(""); }} placeholder={"section,title,url,description\nProduct,Pricing,/pricing,Compare plans\nDocs,Getting started,/docs/start,Setup guide"} rows={5}/>
          {importError && <p className="ll-error" role="alert"><AlertCircle size={14}/>{importError}</p>}
          <div className="ll-import-actions"><button type="button" className="ll-primary" onClick={importRows}>Add imported links</button><button type="button" className="ll-quiet" onClick={() => setImportOpen(false)}>Cancel</button></div>
        </div>}
        <div className="ll-sections">
          {draft.sections.map((section, index) => {
            const isOpen = expanded[section.id] !== false;
            const validCount = section.links.filter(l => compact(l.title) && compact(l.url)).length;
            return <div className="ll-section" key={section.id}>
              <div className="ll-section-bar">
                <button type="button" className="ll-section-toggle" onClick={() => setExpanded(e => ({ ...e, [section.id]: !isOpen }))} aria-expanded={isOpen}>
                  <span className="ll-section-index">{String(index + 1).padStart(2, "0")}</span><span className="ll-section-title"><strong>{compact(section.name) || "Untitled section"}</strong><small>{validCount} {validCount === 1 ? "link" : "links"}{section.optional ? " · Optional" : ""}</small></span>{isOpen ? <ChevronUp size={17}/> : <ChevronDown size={17}/>}
                </button>
                <div className="ll-order"><button type="button" title="Move section up" aria-label={`Move section ${index + 1} up`} disabled={index === 0} onClick={() => moveSection(index, -1)}><ArrowUp size={14}/></button><button type="button" title="Move section down" aria-label={`Move section ${index + 1} down`} disabled={index === draft.sections.length - 1} onClick={() => moveSection(index, 1)}><ArrowDown size={14}/></button><button type="button" title="Remove section" aria-label={`Remove section ${index + 1}`} onClick={() => removeSection(section.id)}><Trash2 size={14}/></button></div>
              </div>
              {isOpen && <div className="ll-section-body">
                <Input label="Section name" value={section.name} onChange={v => editSection(section.id, { name: v })} placeholder="e.g. Documentation" />
                <label className="ll-checkbox"><input type="checkbox" checked={section.optional} onChange={e => editSection(section.id, { optional: e.target.checked })}/><span>Put these links under <strong>Optional</strong> in the file</span></label>
                {section.links.map((link, j) => <div className="ll-link-card" key={link.id}>
                  <div className="ll-link-top"><strong><Link2 size={13}/> Page {j + 1}</strong><button type="button" className="ll-delete" onClick={() => removeLink(section.id, link.id)} aria-label={`Remove page ${j + 1}`}><Trash2 size={13}/> Remove</button></div>
                  <div className="ll-link-fields"><Input label="Page title" value={link.title} onChange={v => editLink(section.id, link.id, { title: v })} placeholder="e.g. Pricing" /><Input label="URL or /path" value={link.url} onChange={v => editLink(section.id, link.id, { url: v })} placeholder="/pricing" /><Input label="What does this page cover? (optional)" value={link.description} onChange={v => editLink(section.id, link.id, { description: v })} placeholder="Short description for this link" /></div>
                </div>)}
                <button type="button" className="ll-add-link" onClick={() => addLink(section.id)}><Plus size={15}/> Add a page</button>
              </div>}
            </div>;
          })}
        </div>
        <button type="button" className="ll-add-section" onClick={addSection}><FolderPlus size={16}/> Add another section</button>
      </section>

      <section className="ll-panel ll-output" aria-label="Live llms.txt preview">
        <div className="ll-panel-head"><span className="ll-num">02</span><div><span className="ll-overline">LIVE OUTPUT</span><h3>Your llms.txt file</h3><p>Updates as you edit your details and links.</p></div></div>
        <div className="ll-status"><div><strong>{ready ? "Ready to download" : "Needs a few details"}</strong><small>{result.count} {result.count === 1 ? "link" : "links"} · {byteSize.toLocaleString("en-GB")} bytes</small></div><span className={ready ? "ll-status-badge success" : "ll-status-badge"}>{ready ? <CheckCircle2 size={13}/> : <Info size={13}/>} {ready ? "Ready" : "Incomplete"}</span></div>
        <div className="ll-tabs" role="tablist" aria-label="Preview mode"><button type="button" role="tab" aria-selected={preview === "file"} onClick={() => setPreview("file")}><Code2 size={14}/> File contents</button><button type="button" role="tab" aria-selected={preview === "outline"} onClick={() => setPreview("outline")}><Eye size={14}/> Page list</button></div>
        {preview === "file" ? <div className="ll-code"><div className="ll-code-head"><span><FileText size={13}/> llms.txt</span><span>PLAIN TEXT</span></div><pre tabIndex={0} aria-label="Generated llms.txt content">{result.text || "Your file will appear here as you add details."}</pre></div> : <div className="ll-outline"><strong>{draft.name || "Your company"}</strong><p>{draft.summary || "Add a short description of your website."}</p>{draft.sections.filter(s => s.links.some(l => compact(l.url))).map(s => <div className="ll-outline-group" key={s.id}><h4>{s.optional ? "Optional" : s.name || "New section"}</h4>{s.links.filter(l => compact(l.url)).map(l => <div key={l.id}><Link2 size={12}/><span>{l.title || "Untitled page"}</span></div>)}</div>)}</div>}
        {result.issues.length > 0 && <div className="ll-issues" role="status"><div><AlertCircle size={16}/><strong>Before exporting</strong></div><ul>{result.issues.map((message, i) => <li key={i}>{message}</li>)}</ul></div>}
        
<div className="ll-actions">
  <button
    type="button"
    className="ll-primary"
    onClick={download}
    disabled={!ready}
  >
    <Download size={15} />
    Download llms.txt
  </button>

  <button
    type="button"
    className="ll-secondary"
    onClick={copy}
    disabled={!ready}
  >
    <Copy size={15} />
    Copy contents
  </button>

  <button
    type="button"
    className="ll-secondary"
    onClick={validateFile}
    disabled={!ready}
  >
    <ExternalLink size={15} />
    Validate file
  </button>
</div>

        <div className="ll-publish"><Info size={16}/><p>Publish the file at <code>{result.base || "https://your-domain.com"}/llms.txt</code> on your website. Check that the URL opens after you publish it.</p></div>
        <div className="ll-privacy"><ShieldCheck size={15}/> Everything is generated in your browser. This tool doesn't crawl or check the URLs you enter.</div>
      </section>
    </div>
    {notice && <div className="ll-toast" role="status"><Check size={15}/>{notice}</div>}
    <style jsx global>{`
      .ll-studio{--ll-teal:#167273;--ll-dark:#073b3b;--ll-ink:#011522;--ll-muted:#667e78;--ll-border:#dce9e5;width:100%;max-width:1240px;margin:0 auto;padding:8px 0 42px;color:var(--ll-ink);background:#fff;font-family:Montserrat,Arial,sans-serif!important}
      .ll-studio,.ll-studio *,.ll-studio *:before,.ll-studio *:after{box-sizing:border-box;font-family:Montserrat,Arial,sans-serif!important}
      .ll-studio button{cursor:pointer}.ll-studio button:disabled{opacity:.35;cursor:not-allowed}.ll-studio button:focus-visible,.ll-studio input:focus-visible,.ll-studio textarea:focus-visible{outline:3px solid #a2ddd0;outline-offset:2px}
      .ll-top{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin:0 0 23px}.ll-kicker,.ll-overline{color:var(--ll-teal);font-size:10px;letter-spacing:.1em;font-weight:800}.ll-top h2{font-size:clamp(24px,2.6vw,34px)!important;line-height:1.2!important;letter-spacing:-.045em!important;color:var(--ll-ink)!important;font-weight:800!important;margin:8px 0!important}
.ll-top p {
  color: var(--ll-muted);
  font-size: 13px;
  line-height: 1.75;
  max-width: 900px;
  margin: 0;
}
.ll-top-actions{display:flex;gap:8px;flex-shrink:0;flex-wrap:wrap}
      .ll-quiet,.ll-small-btn,.ll-secondary{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:10px 13px;border:1px solid var(--ll-border);border-radius:8px;background:#fff;color:var(--ll-dark);font-size:10px;font-weight:750;white-space:nowrap}.ll-quiet:hover,.ll-small-btn:hover,.ll-secondary:hover{background:#f3f8f6}
      .ll-grid{display:grid;grid-template-columns:minmax(0,1.06fr) minmax(0,.94fr);gap:16px;align-items:start}.ll-panel{min-width:0;border:1px solid var(--ll-border);border-radius:15px;background:#fff;padding:22px;box-shadow:0 6px 24px rgba(6,60,48,.025)}.ll-panel-head{display:flex;align-items:flex-start;gap:12px;margin-bottom:20px}.ll-num{width:30px;height:30px;flex:0 0 30px;display:grid;place-items:center;border-radius:8px;background:#e9f5f0;color:var(--ll-teal);font-size:11px;font-weight:800}.ll-panel-head h3,.ll-list-head h3{font-size:19px!important;line-height:1.25!important;letter-spacing:-.03em!important;font-weight:800!important;color:var(--ll-ink)!important;margin:5px 0!important}.ll-panel-head p,.ll-list-head p{font-size:11px;line-height:1.65;color:var(--ll-muted);margin:0}
      .ll-fields,.ll-link-fields{display:grid;gap:16px}.ll-field{display:block;min-width:0}.ll-label{display:block;font-size:10px;font-weight:800;color:#294c45;margin:0 0 7px}.ll-label em{font-size:9px;font-style:normal;color:#9aaea5;font-weight:600;margin-left:6px}.ll-field input,.ll-field textarea,.ll-import textarea{width:100%;min-width:0;border:1px solid #d5e2dc;border-radius:8px;background:#fff;padding:12px 13px;color:var(--ll-ink);font-size:12px!important;line-height:1.6;resize:vertical}.ll-field input:focus,.ll-field textarea:focus,.ll-import textarea:focus{border-color:var(--ll-teal);box-shadow:0 0 0 3px rgba(22,114,115,.08);outline:none}.ll-field input::placeholder,.ll-field textarea::placeholder{color:#9eafa7}.ll-field small{display:block;margin-top:6px;color:#839b92;font-size:9px;line-height:1.6}
      .ll-divider{height:1px;background:#e7efeb;margin:27px 0}.ll-list-head{display:flex;align-items:flex-start;justify-content:space-between;gap:15px;margin-bottom:17px}.ll-small-btn{font-size:10px;flex-shrink:0}
      .ll-import{margin:0 0 17px;padding:17px;border:1px solid #cfe2d8;border-radius:11px;background:#f5faf7}.ll-import-title{display:flex;justify-content:space-between;align-items:center;gap:10px}.ll-import-title strong{font-size:12px}.ll-import-title button{border:0;background:transparent;color:#506b69}.ll-import p{color:#627e72;font-size:10px;line-height:1.75;margin:9px 0}.ll-import code{font-size:10px;background:#e8f3ed;padding:2px 4px;border-radius:3px}.ll-import textarea{margin-top:5px}.ll-import-actions{display:flex;gap:9px;margin-top:11px}.ll-import .ll-error{display:flex;gap:7px;color:#ae4343;font-weight:700}
      .ll-sections{display:grid;gap:11px}.ll-section{border:1px solid #dce9e5;border-radius:11px;overflow:hidden;background:#fff}.ll-section-bar{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;background:#fafcfb}.ll-section-toggle{min-width:0;flex:1;display:flex;align-items:center;text-align:left;gap:10px;border:0;background:transparent;padding:6px 3px;color:var(--ll-dark)}.ll-section-index{display:grid;place-items:center;width:29px;height:29px;flex:0 0 29px;border-radius:7px;background:#e9f5f0;color:var(--ll-teal);font-size:10px;font-weight:800}.ll-section-title{min-width:0;display:grid;gap:4px;flex:1}.ll-section-title strong{font-size:11px;overflow-wrap:anywhere}.ll-section-title small{font-size:9px;color:#748f84}.ll-order{display:flex;gap:1px}.ll-order button{border:0;border-radius:5px;background:transparent;color:#6f8980;display:grid;place-items:center;padding:6px}.ll-order button:hover:not(:disabled){background:#edf5f0;color:var(--ll-teal)}.ll-section-body{padding:17px;display:grid;gap:15px;border-top:1px solid #e9f1ed}.ll-checkbox{display:flex;gap:9px;align-items:flex-start;color:#496f61;font-size:10px;line-height:1.6}.ll-checkbox input{accent-color:var(--ll-teal);margin:2px 0 0}.ll-link-card{padding:14px;border:1px solid #e2ece7;border-radius:9px;background:#f7faf8}.ll-link-top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px}.ll-link-top strong{display:flex;align-items:center;gap:6px;font-size:10px;color:#27685b}.ll-delete{display:inline-flex;align-items:center;gap:5px;padding:5px;background:transparent;border:0;color:#8c6b6b;font-size:9px;font-weight:700}.ll-delete:hover{color:#a63131}.ll-add-link,.ll-add-section{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;border:1px dashed #a7cfc0;border-radius:9px;background:#f8fcfa;color:var(--ll-teal);font-size:11px;font-weight:800;padding:12px}.ll-add-link:hover,.ll-add-section:hover{background:#eaf6ef}.ll-add-section{margin-top:13px;padding:15px}
      .ll-output{position:sticky;top:16px}.ll-status{display:flex;align-items:center;justify-content:space-between;gap:10px;border:1px solid #dcece4;border-radius:10px;background:#f1f8f4;padding:14px}.ll-status>div{display:grid;gap:5px}.ll-status strong{font-size:11px;color:var(--ll-dark)}.ll-status small{font-size:9px;color:#719184}.ll-status-badge{display:inline-flex;align-items:center;gap:4px;border:1px solid #d3e6dc;border-radius:22px;background:#fff;color:#7b9187;padding:6px 8px;font-size:9px;font-weight:750;white-space:nowrap}.ll-status-badge.success{color:#13734d}
      .ll-tabs{display:grid;grid-template-columns:1fr 1fr;gap:5px;padding:4px;margin:16px 0;background:#f2f6f4;border:1px solid #e5efea;border-radius:10px}.ll-tabs button{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:11px;border:0;border-radius:7px;background:transparent;color:#728b82;font-size:10px;font-weight:750}.ll-tabs button[aria-selected=true]{background:#fff;color:var(--ll-dark);box-shadow:0 1px 5px #193e321a}.ll-code{border:1px solid #1d3a41;border-radius:11px;overflow:hidden;background:#0b2029}.ll-code-head{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:12px 14px;background:#102f37;color:#b2d5cf;font-size:9px;font-weight:750;letter-spacing:.05em}.ll-code-head span:first-child{display:flex;align-items:center;gap:7px}.ll-code pre{min-height:270px;max-height:460px;overflow:auto;margin:0;padding:17px;color:#d8f5e8;font:11px/1.85 ui-monospace,SFMono-Regular,Consolas,monospace!important;white-space:pre-wrap;overflow-wrap:anywhere}
      .ll-outline{min-height:310px;max-height:460px;overflow:auto;border:1px solid var(--ll-border);border-radius:11px;padding:22px}.ll-outline>strong{font-size:17px;color:var(--ll-dark)}.ll-outline>p{font-size:11px;line-height:1.7;color:var(--ll-muted)}.ll-outline-group{border-top:1px solid #e8f0eb;padding:12px 0}.ll-outline-group h4{font-size:11px;color:var(--ll-dark);margin:5px 0 10px}.ll-outline-group>div{display:flex;align-items:center;gap:7px;color:#376f60;font-size:10px;padding:5px 0}
      .ll-issues{border:1px solid #efd9b4;border-radius:9px;background:#fffaf0;padding:13px;margin-top:14px}.ll-issues>div{display:flex;align-items:center;gap:8px;color:#976222;font-size:11px}.ll-issues ul{padding-left:19px;margin:10px 0 0}.ll-issues li{color:#896a44;font-size:10px;line-height:1.65;margin:3px 0}.ll-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:15px}.ll-primary{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 14px;border:1px solid var(--ll-dark);border-radius:8px;background:var(--ll-dark);color:#fff;font-size:10px;font-weight:800}.ll-primary:hover:not(:disabled){background:var(--ll-teal)}.ll-secondary{padding:12px 14px}
      .ll-publish{display:flex;align-items:flex-start;gap:9px;margin-top:18px;padding:14px;border-radius:9px;background:#f4f9f6;color:#56796d}.ll-publish svg{flex:0 0 16px;color:var(--ll-teal)}.ll-publish p{font-size:10px;line-height:1.75;margin:0}.ll-publish code{overflow-wrap:anywhere;color:#1d5b51;font:10px ui-monospace,SFMono-Regular,Consolas,monospace!important}.ll-privacy{display:flex;align-items:flex-start;gap:7px;margin-top:16px;padding-top:14px;border-top:1px solid #e9efec;color:#83968e;font-size:9px;line-height:1.6}.ll-privacy svg{flex:0 0 15px}.ll-toast{position:sticky;bottom:12px;margin:14px 0 0 auto;display:flex;gap:7px;align-items:center;width:max-content;max-width:100%;padding:11px 15px;border:1px solid #b5dbcb;border-radius:9px;background:#ebf8f1;color:#135643;font-size:11px;font-weight:750}
      @media(max-width:1020px){.ll-grid{grid-template-columns:1fr}.ll-output{position:static}}@media(max-width:660px){.ll-top{flex-direction:column}.ll-panel{padding:16px}.ll-list-head{flex-direction:column}.ll-small-btn{align-self:flex-start}.ll-actions{display:grid}.ll-actions button{width:100%}.ll-order button{padding:4px}.ll-section-body{padding:12px}.ll-section-bar{padding:7px}.ll-import-actions{flex-wrap:wrap}}
    `}</style>
  </div>;
}
