"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, ArrowUpRight, Check, CheckCircle2, ChevronDown,
  ClipboardCopy, Code2, Download, Globe2, Loader2,
  Monitor, RotateCcw, ShieldCheck, Smartphone, Sparkles, AlertCircle,
} from "lucide-react";
import { run } from "../../lib/run.mjs";

const trim = (value) => String(value ?? "").trim();
const normaliseUrl = (value) => {
  const input = trim(value);
  if (!input) return "";
  return /^https?:\/\//i.test(input) ? input : `https://${input}`;
};
const getPage = (value) => {
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    return url;
  } catch { return null; }
};
const escapeHtml = (value) => String(value ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const approximateWidth = (value) => [...value].reduce((total, char) =>
  total + (/[MW@%]/.test(char) ? 13 : /[il.,:;'!| ]/.test(char) ? 4 : 8.5), 0);
const fileSafe = (value) => value.replace(/[^a-z0-9-]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "page";

export const faqs = [
  {
    question: "Will Google display this exact title and description?",
    answer: "Not necessarily. Google can generate different titles or snippets depending on the query and page content. This tool previews your proposed metadata and identifies common issues, but it cannot guarantee how Google will display a result.",
  },
  {
    question: "Does checking a URL retrieve its current SEO tags?",
    answer: "Yes, if the public page can be inspected. Use Check live page to retrieve the title, meta description, canonical URL and robots directives. You can still edit the preview manually when a site blocks inspection or the request fails.",
  },
  {
    question: "Why might my title be shortened on mobile?",
    answer: "Search results depend on available pixel width, not a fixed character limit. Wider letters and longer phrases may be cut off sooner. Compare both preview sizes and put the most useful information first.",
  },
  {
    question: "How do I publish the changes?",
    answer: "Copy your revised title and description into the SEO settings of your CMS, or use the HTML tags provided. Publish, then inspect the live URL again to confirm the update. Google may take time to reflect changes.",
  },
];

function SearchAppearance({ url, title, description, mobile = false, dimmed = false }) {
  const parsed = getPage(normaliseUrl(url));
  const host = parsed?.hostname.replace(/^www\./, "") || "example.com";
  const path = parsed ? `${parsed.pathname === "/" ? "" : parsed.pathname}${parsed.search}` : "";
  return (
    <div className={`gs-search-result ${mobile ? "mobile" : ""} ${dimmed ? "dimmed" : ""}`}>
      <div className="gs-result-source">
        <span className="gs-favicon"><Globe2 size={15} /></span>
        <span><strong>{host}</strong><small>{host}{path}</small></span>
      </div>
      <div className="gs-result-title">{trim(title) || "Your page title will appear here"}</div>
      <p>{trim(description) || "Add a description to see how your search listing could appear."}</p>
    </div>
  );
}

export default function SerpSnippetPreview({ tool }) {
  const example = useMemo(() => Object.fromEntries(
    (tool?.fields || []).map(({ key, value }) => [key, value ?? ""])
  ), [tool]);
  const [draft, setDraft] = useState(example);
  const [keyword, setKeyword] = useState("");
  const [device, setDevice] = useState("Desktop");
  const [baseline, setBaseline] = useState(null);
  const [inspection, setInspection] = useState(null);
  const [inspectedUrl, setInspectedUrl] = useState("");
  const [inspectionError, setInspectionError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [showHtml, setShowHtml] = useState(false);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const url = normaliseUrl(draft.url);
  const parsed = getPage(url);
  const title = trim(draft.title);
  const description = trim(draft.description);
  const searchTerm = trim(keyword);
  const inspected = Boolean(inspection && inspectedUrl === url);
  const pixelWidth = Math.round(approximateWidth(title));
  const htmlTags = `<title>${escapeHtml(title)}</title>\n<meta name="description" content="${escapeHtml(description)}" />`;
  const snippetText = `${title}\n${url}\n${description}`;
  let runnerOutput = null;
  try { runnerOutput = run(tool, { ...draft, url }); } catch { /* Edit mode works without a valid export. */ }

  const checks = [
    {
      id: "title", group: "Search appearance", label: "Make the title specific",
      state: !title ? "fix" : title.length > 65 || title.length < 30 || pixelWidth > 580 ? "review" : "pass",
      detail: !title ? "Add a title that names the page and its main value." :
        title.length > 65 || pixelWidth > 580 ? "Your title may be shortened. Lead with the product, topic or main benefit." :
        title.length < 30 ? "Consider adding context so buyers know what the page offers." :
        "The title is a reasonable length. Check whether it clearly describes this page.",
    },
    {
      id: "description", group: "Search appearance", label: "Give buyers a reason to click",
      state: !description ? "fix" : description.length < 90 || description.length > 160 ? "review" : "pass",
      detail: !description ? "Write a description of what the visitor will find on this page." :
        description.length < 90 ? "The description is brief. Add a concrete benefit, detail or next step." :
        description.length > 160 ? "Your description may be truncated. Move the key point earlier." :
        "The description has enough room for a clear, useful message.",
    },
    {
      id: "keyword", group: "Buyer relevance", label: "Match the searcher's language",
      state: !searchTerm ? "neutral" : title.toLowerCase().includes(searchTerm.toLowerCase()) ? "pass" : "review",
      detail: !searchTerm ? "Optional: add a target phrase to check how your title addresses it." :
        title.toLowerCase().includes(searchTerm.toLowerCase()) ? "The target phrase appears naturally in the title. Check that it fits the page." :
        "The target phrase is absent from the title. Add it only if it makes the title clearer.",
    },
    {
      id: "url", group: "Technical checks", label: "Check the destination URL",
      state: parsed ? "pass" : "fix",
      detail: parsed ? `Your preview uses ${parsed.hostname}.` : "Enter a valid HTTP or HTTPS URL.",
    },
    {
      id: "response", group: "Technical checks", label: "Confirm the page responds",
      state: !inspected ? "neutral" : inspection.status >= 200 && inspection.status < 300 ? "pass" : "fix",
      detail: !inspected ? "Not checked. Inspect the live URL to see its HTTP response." : `The inspected page returned HTTP ${inspection.status}.`,
    },
    {
      id: "indexing", group: "Technical checks", label: "Review indexing directives",
      state: !inspected ? "neutral" : inspection.noindex ? "fix" : "pass",
      detail: !inspected ? "Not checked. Live inspection reads available robots directives." :
        inspection.noindex ? "A noindex directive was detected. Check whether it is intentional." :
        "No noindex directive detected in inspected headers or HTML. Indexing is not guaranteed.",
    },
    {
      id: "canonical", group: "Technical checks", label: "Review the canonical tag",
      state: !inspected ? "neutral" : !inspection.canonical || inspection.canonical !== inspection.finalUrl ? "review" : "pass",
      detail: !inspected ? "Not checked. Inspect the page to find its declared canonical." :
        !inspection.canonical ? "No canonical URL was found in the inspected HTML." :
        inspection.canonical === inspection.finalUrl ? "Canonical points to the inspected page." :
        `Canonical points to ${inspection.canonical}. Confirm this is intended.`,
    },
    {
      id: "og", group: "Technical checks", label: "Check sharing metadata",
      state: !inspected ? "neutral" : inspection.ogTitle && inspection.ogDescription ? "pass" : "review",
      detail: !inspected ? "Not checked. Live inspection reads Open Graph title and description." :
        inspection.ogTitle && inspection.ogDescription ? "Open Graph title and description were found." :
        "Review Open Graph tags if the page is shared on social platforms.",
    },
  ];
  const priorities = checks.filter((item) => item.state === "fix" || item.state === "review");
  const technical = checks.filter((item) => item.group === "Technical checks");
  const changes = baseline ? [
    baseline.title !== draft.title ? "Page title revised" : null,
    baseline.description !== draft.description ? "Meta description revised" : null,
  ].filter(Boolean) : [];

  function update(field, value) {
    setDraft((old) => ({ ...old, [field]: value }));
    if (field === "url") {
      setInspection(null); setInspectedUrl(""); setInspectionError("");
      setBaseline(null);
    }
  }
  async function inspectPage() {
    if (!parsed) { setInspectionError("Enter a valid public HTTP or HTTPS URL."); return; }
    setLoading(true); setInspectionError(""); setInspection(null);
    try {

const response = await fetch(
  `/api/serp-inspect?url=${encodeURIComponent(url)}`,
  {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  }
);

const contentType = response.headers.get("content-type") || "";

if (!contentType.toLowerCase().includes("application/json")) {
  throw new Error(
    "Live inspection is unavailable. Check that the API endpoint is running."
  );
}

const data = await response.json();

if (!response.ok) {
  throw new Error(
    data.error || `Unable to inspect this page (HTTP ${response.status}).`
  );
}


      setInspection(data); setInspectedUrl(url);
      setBaseline({ title: data.title || "", description: data.description || "" });
      setDraft((old) => ({ ...old, url, title: data.title || "", description: data.description || "" }));
      setNotice("Live metadata loaded. Your edits will not change the website.");
    } catch (error) {
      setInspectionError(`${error?.message || "Inspection failed."} You can still edit the fields manually.`);
    } finally { setLoading(false); }
  }
  function reset() {
    setDraft(example); setKeyword(""); setBaseline(null); setInspection(null);
    setInspectedUrl(""); setInspectionError(""); setDevice("Desktop"); setShowHtml(false);
    setNotice("Example restored.");
  }
  async function copy(value, label) {
    try { await navigator.clipboard.writeText(value); setNotice(`${label} copied.`); }
    catch { setNotice("Clipboard access is unavailable. Use the download option."); }
  }
  function downloadResult() {
    const content = [
      `Page: ${url}`, `Target phrase: ${searchTerm || "Not specified"}`, "",
      "PROPOSED SEO TITLE", title, "", "PROPOSED META DESCRIPTION", description,
      "", "HTML TAGS", htmlTags, "", "REVIEW NOTES",
      ...priorities.map((item) => `- ${item.label}: ${item.detail}`),
      "", ...(changes.length ? ["CHANGES FROM INSPECTED PAGE", ...changes] : []),
    ].join("\n");
    const objectUrl = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a"); link.href = objectUrl;
    link.download = `${fileSafe(parsed?.hostname || "serp")}-seo-handoff.txt`;
    document.body.appendChild(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
    setNotice("Publishing handoff downloaded.");
  }

  return (
    <div className="gs-root">

 <div className="gs-heading">
  <div className="gs-heading-copy">
    <span className="gs-kicker">
      <Sparkles size={14} />
      GROWUP SEO WORKSPACE
    </span>

    <h2>Make every search impression count.</h2>

    <p>
      Inspect your page's current metadata, improve your search listing
      and prepare the changes for publication.
    </p>
  </div>

  <button
    type="button"
    className="gs-outline gs-reset"
    onClick={reset}
  >
    <RotateCcw size={15} />
    Reset example
  </button>
</div>

      <section className="gs-inspect gs-surface" aria-labelledby="gs-inspect-title">
        <div className="gs-section-intro"><span className="gs-step">01</span><div>
          <h3 id="gs-inspect-title">Start with the page</h3>
          <p>Check a public URL to load its current metadata, or work directly with your draft below.</p>
        </div></div>
        <div className="gs-inspect-form">
          <label><span>Page URL</span><input type="url" value={draft.url || ""} onChange={(e) => update("url", e.target.value)} placeholder="https://example.com/page" spellCheck={false}/></label>
          <label><span>Target search phrase <em>(optional)</em></span><input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. B2B SEO agency"/></label>
          <button type="button" className="gs-primary" disabled={loading} onClick={inspectPage}>{loading ? <Loader2 className="gs-spin" size={16}/> : <ArrowRight size={16}/>} {loading ? "Inspecting" : "Inspect page"}</button>
        </div>
        {inspectionError && <p className="gs-error" role="alert"><AlertCircle size={15}/>{inspectionError}</p>}
        {inspected && <div className="gs-inspected"><CheckCircle2 size={15}/> Inspected HTTP {inspection.status}. Original metadata saved for comparison.</div>}
      </section>

      <section className="gs-appearance gs-surface" aria-labelledby="gs-appearance-title">
        <div className="gs-section-intro"><span className="gs-step">02</span><div>
          <h3 id="gs-appearance-title">Compare what buyers see</h3>
          <p>Your current search appearance alongside the version you want to publish.</p>
        </div><div className="gs-device" role="group" aria-label="Preview device">
          <button type="button" aria-pressed={device === "Desktop"} onClick={() => setDevice("Desktop")}><Monitor size={14}/> Desktop</button>
          <button type="button" aria-pressed={device === "Mobile"} onClick={() => setDevice("Mobile")}><Smartphone size={14}/> Mobile</button>
        </div></div>
        <div className="gs-comparison">
          <div className="gs-comparison-panel"><div className="gs-compare-label"><span>Current page</span>{!baseline && <small>Inspect a URL to load this</small>}</div>
            {baseline ? <SearchAppearance mobile={device === "Mobile"} url={url} title={baseline.title} description={baseline.description} dimmed/> :
              <div className="gs-empty">No live metadata loaded yet. Inspect a URL to compare its current snippet with your edits.</div>}
          </div>
          <div className="gs-comparison-panel proposed"><div className="gs-compare-label"><span>Your proposed version</span><small>Updates as you type</small></div>
            <SearchAppearance mobile={device === "Mobile"} url={url} title={title} description={description}/>
          </div>
        </div>
        <p className="gs-disclaimer">Illustrative Google-style preview. Search engines may generate different titles or snippets for different queries and devices.</p>
      </section>

      <section className="gs-workflow" aria-label="Improve and publish">
        <div className="gs-edit gs-surface">
          <div className="gs-section-intro"><span className="gs-step">03</span><div><h3>Improve your listing</h3><p>Edit your draft. Changes are not published to your website.</p></div></div>
          <div className="gs-edit-fields">
            <label><span className="gs-label-line"><strong>SEO title</strong><small>{title.length} characters · approx. {pixelWidth}px</small></span>
              <input value={draft.title || ""} onChange={(e) => update("title", e.target.value)} placeholder="Describe the page and its value"/></label>
            <label><span className="gs-label-line"><strong>Meta description</strong><small>{description.length} characters</small></span>
              <textarea rows={4} value={draft.description || ""} onChange={(e) => update("description", e.target.value)} placeholder="Tell buyers what they will find on this page"/></label>
          </div>
          {runnerOutput?.text && <p className="gs-small-note">Your existing snippet export format remains available through the tool's original data model.</p>}
        </div>
        <aside className="gs-priorities gs-surface">
          <div className="gs-section-intro"><span className="gs-step">04</span><div><h3>Optimisation priorities</h3><p>Focus on the changes most likely to improve clarity and accuracy.</p></div></div>
          <div className="gs-priority-count">{priorities.length ? `${priorities.length} item${priorities.length === 1 ? "" : "s"} worth reviewing` : "No immediate draft issues flagged"}</div>
          <div className="gs-priority-list">
            {(priorities.length ? priorities : [{ id: "done", state: "pass", label: "Draft checks look good", detail: "Review accuracy and usefulness before publication." }]).slice(0, 4).map((item, index) =>
              <div className="gs-priority" key={item.id}><span className={`gs-priority-icon ${item.state}`}>{item.state === "pass" ? <Check size={15}/> : index + 1}</span>
                <div><strong>{item.label}</strong><p>{item.detail}</p></div></div>
            )}
          </div>
          <details className="gs-tech"><summary>Full technical checklist <ChevronDown size={16}/></summary>
            {technical.map((item) => <div className="gs-tech-row" key={item.id}><span className={`gs-tech-state ${item.state}`}>{item.state === "pass" ? "✓" : item.state === "neutral" ? "·" : "!"}</span><div><strong>{item.label}</strong><p>{item.detail}</p></div></div>)}
          </details>
        </aside>
      </section>

      <section className="gs-handoff gs-surface" aria-labelledby="gs-handoff-title">
        <div className="gs-section-intro"><span className="gs-step">05</span><div>
          <h3 id="gs-handoff-title">Ready for your publishing handoff</h3>
          <p>Copy the final metadata, grab the HTML tags, or download the proposed changes and review notes.</p>
        </div><span className="gs-handoff-icon"><ShieldCheck size={20}/></span></div>
        {baseline && <p className="gs-change-note">{changes.length ? changes.join(" · ") : "No changes from the inspected metadata yet."}</p>}
        <div className="gs-actions">
          <button className="gs-primary" type="button" onClick={() => copy(snippetText, "Snippet")}><ClipboardCopy size={16}/> Copy snippet</button>
          <button className="gs-outline" type="button" onClick={() => setShowHtml((old) => !old)}><Code2 size={16}/> {showHtml ? "Hide HTML" : "View HTML"}</button>
          <button className="gs-outline" type="button" onClick={downloadResult}><Download size={16}/> Download handoff</button>
        </div>
        {showHtml && <div className="gs-code"><div><strong>Meta tags for your CMS or developer</strong><button type="button" onClick={() => copy(htmlTags, "HTML")}><ClipboardCopy size={14}/> Copy HTML</button></div><pre>{htmlTags}</pre></div>}
        <p className="gs-small-note">These checks are editorial guidance, not ranking or indexing guarantees. Verify the updated live page after publishing.</p>
      </section>
      {notice && <div role="status" className="gs-toast"><CheckCircle2 size={16}/>{notice}</div>}
      <style jsx global>{`
        .gs-root {
  --teal: #167273;
  --dark: #073b3b;
  --ink: #011522;
  --line: #dce9e6;
  --muted: #627c75;

  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 8px 0 50px;
  background: #ffffff;
  color: var(--ink);

  font-family: "Montserrat", Arial, sans-serif !important;
}

.gs-root,
.gs-root * {
  font-family: "Montserrat", Arial, sans-serif !important;
}

.gs-root button,
.gs-root input,
.gs-root textarea {
  font-family: "Montserrat", Arial, sans-serif !important;
}
        .gs-root *{box-sizing:border-box}.gs-root button,.gs-root input,.gs-root textarea{font:inherit}.gs-root button{cursor:pointer}
        .gs-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
  padding: 4px 0 12px;
  background: #ffffff !important;
  color: #011522 !important;
  border: 0 !important;
  box-shadow: none !important;
  min-height: 0 !important;
}

.gs-heading-copy {
  flex: 1;
  min-width: 0;
}
        .gs-heading h2{font-size:clamp(25px,3vw,37px)!important;line-height:1.12!important;letter-spacing:-.045em!important;margin:10px 0!important;color:var(--ink)!important;font-weight:800!important}
        .gs-heading p{margin:0;font-size:13px;color:var(--muted);line-height:1.7;max-width:750px}
        .gs-kicker{display:inline-flex;gap:7px;align-items:center;font-size:10px;color:var(--teal);letter-spacing:.13em;font-weight:800}
        .gs-surface{border:1px solid var(--line);border-radius:14px;background:white;box-shadow:0 6px 28px rgba(1,35,27,.035)}
        .gs-inspect,.gs-appearance,.gs-edit,.gs-priorities,.gs-handoff{padding:22px 24px;margin-bottom:14px}
        .gs-section-intro{display:flex;gap:12px;align-items:flex-start;margin-bottom:19px}.gs-section-intro>div{min-width:0;flex:1}
        .gs-section-intro h3{font-size:17px!important;letter-spacing:-.035em!important;line-height:1.3!important;color:var(--ink)!important;margin:0 0 4px!important;font-weight:800!important}
        .gs-section-intro p{font-size:11px;margin:0;color:var(--muted);line-height:1.6}
        .gs-step{width:33px;height:33px;display:grid;place-items:center;border-radius:10px;background:#e8f5f0;color:var(--teal);font-size:11px;font-weight:850;flex-shrink:0}
        .gs-inspect-form{display:grid;grid-template-columns:minmax(0,1.8fr) minmax(0,.8fr) auto;gap:10px;align-items:end}
        .gs-inspect-form label,.gs-edit-fields label{min-width:0;display:block}
        .gs-inspect-form label>span,.gs-label-line{display:block;margin-bottom:7px;font-size:10px;font-weight:800;color:#244945}
        .gs-inspect-form em{font-weight:500;color:#80958e;font-style:normal}
        .gs-root input,.gs-root textarea{width:100%;min-width:0;border:1px solid #d1e2dc;border-radius:8px;background:#fff;padding:11px 13px;font-size:12px!important;color:var(--ink);outline:none}
        .gs-root textarea{resize:vertical;line-height:1.65}.gs-root input:focus,.gs-root textarea:focus{border-color:var(--teal);box-shadow:0 0 0 3px #1672731a}
        .gs-primary,.gs-outline{display:inline-flex;align-items:center;justify-content:center;gap:9px;border-radius:9px;font-size:11px!important;font-weight:800;padding:11px 14px;text-decoration:none;white-space:nowrap}
        .gs-primary{background:var(--dark);border:1px solid var(--dark);color:white}.gs-primary:hover{background:#115753}.gs-primary:disabled{opacity:.6;cursor:wait}
        .gs-outline{border:1px solid #d1e2dc;background:#fff;color:var(--dark)}.gs-outline:hover{background:#eff8f4}
        .gs-inspected,.gs-error{display:flex;gap:8px;align-items:center;font-size:11px;margin:12px 0 0}.gs-inspected{color:var(--teal)}.gs-error{color:#b04435}
        .gs-device{display:flex;gap:3px;padding:3px;background:#f1f6f4;border:1px solid var(--line);border-radius:9px;margin-left:auto;flex-shrink:0}
        .gs-device button{display:flex;align-items:center;gap:6px;border:0;border-radius:6px;background:transparent;color:#617972;font-size:10px!important;font-weight:700;padding:8px}
        .gs-device button[aria-pressed=true]{background:white;color:var(--dark);box-shadow:0 2px 7px #123f3215}
        .gs-comparison{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
        .gs-comparison-panel{border:1px solid #e0ebe6;background:#f8faf9;border-radius:11px;padding:14px;min-width:0}.gs-comparison-panel.proposed{border-color:#acd2c5;background:#f4faf7}
        .gs-compare-label{display:flex;justify-content:space-between;gap:9px;align-items:center;min-height:19px;margin-bottom:12px}.gs-compare-label span{font-size:11px;font-weight:800;color:#234e47}.gs-compare-label small{font-size:9px;color:#79928b}
        
        
        
/* Search result preview */

.gs-search-result {
  width: 100%;
  max-width: 100%;
  min-height: 175px;
  padding: 18px;
  background: #ffffff;
  border: 1px solid #dce9e6;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 12px rgba(1, 21, 34, 0.025);
}

.gs-search-result.mobile {
  max-width: 360px;
}

.gs-search-result.dimmed {
  opacity: 0.85;
}

.gs-result-source {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  margin-bottom: 13px;
}

.gs-result-source > span:last-child {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  flex: 1;
}

.gs-favicon {
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #eaf5f1;
  color: #167273;
}

.gs-result-source strong {
  display: block;
  color: #202124;
  font-size: 11px !important;
  font-weight: 700;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gs-result-source small {
  display: block;
  max-width: 100%;
  color: #65716f;
  font-size: 9px !important;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gs-result-title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;

  margin: 0 0 8px;
  color: #1a0dab;
  font-size: 16px !important;
  font-weight: 600;
  line-height: 1.45;
  overflow: hidden;
  overflow-wrap: anywhere;
}

.gs-search-result p {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;

  margin: 0 !important;
  color: #4d5156;
  font-size: 11px !important;
  font-weight: 400;
  line-height: 1.65;
  overflow: hidden;
  overflow-wrap: anywhere;
}
     
     
     
        .gs-empty{min-height:153px;display:grid;place-items:center;border:1px dashed #cbded5;padding:20px;text-align:center;font-size:11px;color:#6d8880;line-height:1.65;border-radius:9px;background:white}
        .gs-disclaimer{font-size:10px;color:#728a83;margin:13px 0 0;line-height:1.5}
        .gs-workflow{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(320px,.95fr);gap:14px;align-items:start}.gs-edit,.gs-priorities{height:100%}
        .gs-edit-fields{display:grid;gap:18px}.gs-label-line{display:flex;align-items:center;justify-content:space-between;gap:10px}.gs-label-line strong{font-size:10px}.gs-label-line small{font-size:9px;color:#7b9088;font-weight:600}
        .gs-priority-count{background:#edf7f2;border-radius:8px;padding:11px 12px;font-weight:800;font-size:11px;color:#0d645e;margin:0 0 12px}
        .gs-priority-list{display:grid;gap:0}.gs-priority{display:flex;gap:11px;padding:13px 0;border-bottom:1px solid #e8efec}.gs-priority-icon{width:25px;height:25px;border-radius:8px;background:#fef1df;color:#986322;display:grid;place-items:center;font-size:11px;font-weight:800;flex-shrink:0}.gs-priority-icon.fix{background:#fbe9e6;color:#b04435}.gs-priority-icon.pass{background:#e2f4e9;color:#167273}
        .gs-priority strong,.gs-tech-row strong{font-size:11px;color:#173e39}.gs-priority p,.gs-tech-row p{color:#6b8079;font-size:10px;line-height:1.55;margin:4px 0 0;overflow-wrap:anywhere}
        .gs-tech{margin-top:14px}.gs-tech summary{display:flex;align-items:center;justify-content:space-between;gap:9px;color:var(--teal);font-size:11px;font-weight:800;cursor:pointer;list-style:none;padding:11px 0}.gs-tech summary::-webkit-details-marker{display:none}.gs-tech[open] summary svg{transform:rotate(180deg)}
        .gs-tech-row{display:flex;gap:9px;align-items:flex-start;padding:10px 0;border-top:1px solid #edf3ef}.gs-tech-state{width:18px;height:18px;display:grid;place-items:center;border-radius:50%;font-size:11px;background:#fff1d8;color:#9a6b29;flex-shrink:0}.gs-tech-state.pass{background:#e1f5e9;color:#10794c}.gs-tech-state.neutral{background:#eef2f0;color:#81978f}.gs-tech-state.fix{background:#fee8e6;color:#b04336}
        .gs-handoff{margin-top:0}.gs-handoff .gs-section-intro{align-items:center}.gs-handoff-icon{color:var(--teal)}.gs-actions{display:flex;flex-wrap:wrap;gap:9px}.gs-change-note{font-size:10px;color:#426b62;margin:0 0 16px}
        .gs-code{border:1px solid var(--line);margin-top:16px;border-radius:9px;overflow:hidden}.gs-code>div{background:#f0f7f3;padding:10px 13px;display:flex;justify-content:space-between;align-items:center;gap:10px;font-size:11px}.gs-code button{display:flex;gap:5px;align-items:center;border:0;background:transparent;font-size:10px;color:var(--teal);font-weight:800}.gs-code pre{font-size:11px;color:#22463e;padding:15px;white-space:pre-wrap;overflow-wrap:anywhere;margin:0}
        .gs-small-note{font-size:10px;color:#758e87;line-height:1.6;margin:14px 0 0}.gs-toast{position:sticky;bottom:14px;margin:12px 0 0 auto;display:flex;align-items:center;gap:8px;width:max-content;max-width:100%;border:1px solid #bcded2;border-radius:9px;background:#edfaf4;padding:11px 14px;color:var(--dark);font-size:11px;font-weight:750;box-shadow:0 8px 22px #123f3214}.gs-spin{animation:gs-spin 1s linear infinite}@keyframes gs-spin{to{transform:rotate(360deg)}}
        @media(max-width:900px){.gs-workflow{grid-template-columns:1fr}.gs-inspect-form{grid-template-columns:1fr 1fr}.gs-inspect-form .gs-primary{grid-column:1/-1}}
        @media(max-width:680px){.gs-heading{flex-direction:column}.gs-inspect,.gs-appearance,.gs-edit,.gs-priorities,.gs-handoff{padding:17px}.gs-comparison{grid-template-columns:1fr}.gs-section-intro{flex-wrap:wrap}.gs-device{margin-left:45px}.gs-inspect-form{grid-template-columns:1fr}.gs-inspect-form .gs-primary{grid-column:auto}.gs-label-line{align-items:flex-start;flex-direction:column;gap:2px}.gs-actions{display:grid}.gs-actions button{width:100%}}
      `}</style>
    </div>
  );
}
