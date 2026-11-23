"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Head from "next/head";
import {
  ArrowRight, Check, CircleHelp, Code2, Copy, Download, ExternalLink,
  Eye, FileCode2, FileJson, RotateCcw, ShieldCheck, Sparkles,
  Star, MessageSquareText, Plus, Trash2, AlertTriangle, Building2,
} from "lucide-react";
import { address, identifier, required, amount } from "./SchemaStudio";

const blankReview = () => ({ author: "", score: "", body: "" });
const EMPTY = {
  type: "SoftwareApplication", name: "", url: "", control: "Choose one",
  reviews: [blankReview()],
};
const EXAMPLE = {
  type: "SoftwareApplication", name: "Cedar Analytics",
  url: "https://example.com/software/cedar",
  control: "An independent publisher",
  reviews: [
    { author: "Example reviewer A", score: "4", body: "The reusable reports made our weekly review quicker." },
    { author: "Example reviewer B", score: "5", body: "We exported the report without rebuilding it in Sheets." },
  ],
};
const TYPES = ["Product", "SoftwareApplication", "Organization", "LocalBusiness"];
const CONTROL_OPTIONS = ["Choose one", "The reviewed business", "An independent publisher"];

export const faqs = [

  {
    question: "Which reviewed item type should I choose?",
    answer: "Choose SoftwareApplication for SaaS products, Product for other products, Organization for a company and LocalBusiness for a local business. Pick the type that best describes what people are reviewing.",
  },
  {
    question: "Where should I add Review JSON-LD?",
    answer: "Add the generated script to the HTML of the page where those reviews are published. The review text, reviewer names, scores and overall rating in the markup should match what visitors can see.",
  },
  {
    question: "How do I validate Review schema?",
    answer: "Click Validate schema and paste the copied HTML into Schema.org Validator's Code Snippet test. Use Google's Rich Results Test separately if you want to check eligibility for supported Google search features.",
  },
];

export function build(v) {
  const url = address(required(v.url, "the reviewed item URL"), "reviewed item");
  const name = required(v.name, "the reviewed item name");
  if (!TYPES.includes(v.type)) throw Error("Choose a supported reviewed item type.");
  if (!CONTROL_OPTIONS.includes(v.control) || v.control === "Choose one") {
    throw Error("Choose who controls the review page.");
  }
  if (!Array.isArray(v.reviews) || !v.reviews.length) {
    throw Error("Add at least one published review.");
  }
  const review = v.reviews.map((r, i) => ({
    "@type": "Review",
    author: { "@type": "Person", name: required(r.author, `the reviewer name for review ${i + 1}`) },
    reviewBody: required(r.body, `the text for review ${i + 1}`),
    reviewRating: {
      "@type": "Rating",
      ratingValue: amount(r.score, `rating for review ${i + 1}`, 1, 5),
      bestRating: 5, worstRating: 1,
    },
  }));
  const average = Number((review.reduce((sum, r) => sum + r.reviewRating.ratingValue, 0) / review.length).toFixed(2));
  const warnings = [];
  if (["Organization", "LocalBusiness"].includes(v.type) && v.control === "The reviewed business") {
    warnings.push("Google generally excludes review stars when an organization or local business controls reviews about itself, even when the reviews appear through third-party widgets.");
  }
  return {
    node: {
      "@type": v.type,
      "@id": identifier(url, v.type === "Product" ? "product" : v.type === "Organization" ? "organization" : "item"),
      name, url, review,
      aggregateRating: {
        "@type": "AggregateRating", ratingValue: average,
        reviewCount: review.length, bestRating: 5, worstRating: 1,
      },
    },
    warnings,
  };
}

function Field({ id, label, value, onChange, placeholder, type = "text", hint, mandatory = false }) {
  return (
    <div className="rv-field">
      <label htmlFor={id}>{label}{mandatory && <span>Required</span>}</label>
      <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      {hint && <small>{hint}</small>}
    </div>
  );
}

export default function ReviewSchemaGenerator() {
  const [values, setValues] = useState(EMPTY);
  const [view, setView] = useState("embed");
  const [notice, setNotice] = useState("");
  const uid = useId().replace(/:/g, "");
  const idFor = name => `rv-${uid}-${name}`;

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function update(field, value) {
    setValues(previous => ({ ...previous, [field]: value }));
    setNotice("");
  }
  function updateReview(index, field, value) {
    setValues(previous => ({ ...previous, reviews: previous.reviews.map((r, i) => i === index ? { ...r, [field]: value } : r) }));
    setNotice("");
  }
  function addReview() {
    setValues(previous => ({ ...previous, reviews: [...previous.reviews, blankReview()] }));
    setNotice("");
  }
  function removeReview(index) {
    setValues(previous => ({ ...previous, reviews: previous.reviews.filter((_, i) => i !== index) }));
    setNotice("");
  }
  function reset() { setValues({ ...EMPTY, reviews: [blankReview()] }); setView("embed"); setNotice("New review set started."); }
  function loadExample() { setValues({ ...EXAMPLE, reviews: EXAMPLE.reviews.map(r => ({ ...r })) }); setNotice("Example reviews loaded. Replace them with your published reviews before using the markup."); }

  const hasStarted = Boolean(values.name.trim() || values.url.trim() || values.reviews.some(r => r.author.trim() || r.score.trim() || r.body.trim()));

  const generated = useMemo(() => {
    try {
      const result = build(values);
      const json = JSON.stringify({ "@context": "https://schema.org", ...result.node }, null, 2).replace(/</g, "\\u003c");
      return { json, embed: `<script type="application/ld+json">\n${json}\n</script>`, node: result.node, warnings: result.warnings, error: "" };
    } catch (error) {
      return { json: "", embed: "", node: null, warnings: [], error: error.message || "Check your review details." };
    }
  }, [values]);

  const canExport = Boolean(generated.node);
  const selectedCode = view === "json" ? generated.json : generated.embed;
  const previewScores = values.reviews.map(r => Number(r.score)).filter((n, i) => values.reviews[i].score.trim() && Number.isFinite(n) && n >= 1 && n <= 5);
  const previewAverage = previewScores.length ? (previewScores.reduce((a,b) => a + b,0) / previewScores.length).toFixed(2).replace(/\.00$/, "") : null;
  const showSelfServing = ["Organization", "LocalBusiness"].includes(values.type) && values.control === "The reviewed business";

  async function copyCode() {
    if (!canExport) return;
    try {
      await navigator.clipboard.writeText(selectedCode);
      setNotice(view === "json" ? "JSON-LD copied." : "HTML embed copied.");
    } catch { setNotice("Clipboard unavailable. Select and copy the code manually."); }
  }
  async function validateSchema() {
    if (!canExport) return;
    window.open("https://validator.schema.org/", "_blank", "noopener,noreferrer");
    try {
      await navigator.clipboard.writeText(generated.embed);
      setNotice("Schema copied. Choose CODE SNIPPET in Schema.org Validator, paste it and run the test.");
    } catch { setNotice("Validator opened. Copy the HTML embed and paste it into CODE SNIPPET."); }
  }
  function downloadJson() {
    if (!canExport) return;
    const blob = new Blob([generated.json], { type: "application/ld+json;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl; a.download = "review-schema.jsonld";
    document.body.appendChild(a); a.click(); a.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
    setNotice("JSON-LD download started.");
  }

  return (
    <div className="rv-studio">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>
      <div className="rv-hero">
        <div>
          <span className="rv-kicker">GROWUP / TECHNICAL SEO</span>
          <h2>Generate your Review JSON-LD</h2>
          <p>Add the reviews you've published, check the overall rating and copy or download the markup for your website.</p>
        </div>
        <button className="rv-reset" type="button" onClick={reset}><RotateCcw size={15} /> Start fresh</button>
      </div>
      <div className="rv-workspace">
        <section className="rv-panel" aria-labelledby={idFor("editor-title")}>
          <div className="rv-panel-top"><span className="rv-index">01</span><div className="rv-heading"><span>REVIEW EDITOR</span><h3 id={idFor("editor-title")}>Your Review Details</h3><p>Only use real reviews that visitors can see on your page.</p></div></div>
          <div className="rv-toolbar"><button className="rv-outline" type="button" onClick={loadExample}><Sparkles size={15}/> Load example</button></div>
          <div className="rv-section">
            <div className="rv-section-heading"><span className="rv-icon"><Building2 size={17}/></span><div><h4>Reviewed item</h4><p>Tell us what's being reviewed and who publishes the page.</p></div></div>
            <div className="rv-fields">
              <div className="rv-field"><label htmlFor={idFor("type")}>Item type</label><select id={idFor("type")} value={values.type} onChange={e => update("type", e.target.value)}>{TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select><small>Choose SoftwareApplication for SaaS products.</small></div>
              <Field id={idFor("name")} label="Item or business name" mandatory value={values.name} onChange={v => update("name",v)} placeholder="e.g. Cedar Analytics"/>
              <Field id={idFor("url")} label="Reviewed item URL" mandatory type="url" value={values.url} onChange={v => update("url",v)} placeholder="https://example.com/software/cedar" hint="Use the published page where these reviews appear." />
              <div className="rv-field"><label htmlFor={idFor("control")}>Who controls the page publishing these reviews?</label><select id={idFor("control")} value={values.control} onChange={e => update("control",e.target.value)}>{CONTROL_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}</select><small>Google has special restrictions for reviews published by businesses about themselves.</small></div>
              {showSelfServing && <div className="rv-warning" role="alert"><AlertTriangle size={17}/><span><strong>Self-serving review warning.</strong> Google generally won't show review stars for Organization or LocalBusiness reviews controlled by the reviewed business. Valid JSON-LD doesn't override this rule.</span></div>}
            </div>
          </div>
          <div className="rv-section">
            <div className="rv-section-heading"><span className="rv-icon"><MessageSquareText size={17}/></span><div><h4>Published reviews</h4><p>Add the reviews that are visible on your website.</p></div></div>
            <div className="rv-fields">
              {values.reviews.map((r,i) => (
                <div className="rv-review-card" key={i}>
                  <div className="rv-review-top"><strong>Review {i+1}</strong><button className="rv-remove" type="button" onClick={() => removeReview(i)} aria-label={`Remove review ${i+1}`}><Trash2 size={14}/> Remove</button></div>
                  <Field id={idFor(`author-${i}`)} label="Reviewer name" mandatory value={r.author} onChange={value => updateReview(i,"author",value)} placeholder="e.g. Sam Taylor"/>
                  <Field id={idFor(`score-${i}`)} label="Rating (1–5)" mandatory type="number" value={r.score} onChange={value => updateReview(i,"score",value)} placeholder="5" hint="Enter a rating between 1 and 5."/>
                  <div className="rv-field"><label htmlFor={idFor(`body-${i}`)}>Review text <span>Required</span></label><textarea id={idFor(`body-${i}`)} rows={3} value={r.body} onChange={e => updateReview(i,"body",e.target.value)} placeholder="Write the review exactly as it appears on your website."/></div>
                </div>
              ))}
              <button className="rv-add" type="button" onClick={addReview}><Plus size={16}/> Add another review</button>
              {previewAverage && <div className="rv-note"><Star size={16}/><span>Current average: <strong>{previewAverage}/5</strong> across {previewScores.length} {previewScores.length === 1 ? "review" : "reviews"}. Only completed reviews are included in the final JSON-LD.</span></div>}
              <div className="rv-note"><CircleHelp size={16}/><span>Keep reviewer names, review text and ratings consistent with what readers can see. Do not publish the sample reviews as real testimonials.</span></div>
            </div>
          </div>
        </section>
        <section className="rv-panel rv-output" aria-labelledby={idFor("output-title")}>
          <div className="rv-panel-top"><span className="rv-index">02</span><div className="rv-heading"><span>LIVE OUTPUT</span><h3 id={idFor("output-title")}>Your Review Markup</h3><p>Check the ratings and schema before adding it to your page.</p></div></div>
          <div className="rv-ready"><div><strong>{canExport ? "Ready for your website" : "Complete your review details"}</strong><small>{canExport ? `${generated.node.aggregateRating.ratingValue}/5 from ${generated.node.review.length} reviews` : "Add an item, page owner and at least one complete review"}</small></div><span className={canExport ? "rv-pill ready" : "rv-pill"}>{canExport ? <Check size={13}/> : <CircleHelp size={13}/>} {canExport ? "Ready to export" : "In progress"}</span></div>
          <div className="rv-tabs" role="group" aria-label="Output format">
            <button type="button" aria-pressed={view === "embed"} onClick={() => setView("embed")}><Code2 size={15}/> HTML embed</button>
            <button type="button" aria-pressed={view === "json"} onClick={() => setView("json")}><FileJson size={15}/> JSON-LD</button>
            <button type="button" aria-pressed={view === "preview"} onClick={() => setView("preview")}><Eye size={15}/> Review preview</button>
          </div>
          {view === "preview" ? (
            <div className="rv-preview">
              <div className="rv-preview-head"><Eye size={15}/> Review details preview</div>
              {hasStarted ? <div className="rv-preview-body">
                <div className="rv-preview-icon"><Star size={25}/></div>
                <span className="rv-preview-provider">{values.type}</span>
                <h4>{values.name || "Item being reviewed"}</h4>
                <div className="rv-score">{previewAverage || "—"} <small>/ 5 · {previewScores.length} rated</small></div>
                {values.reviews.filter(r => r.author || r.body).slice(0,3).map((r,i) => <div key={i} className="rv-review-excerpt"><strong>{r.author || "Reviewer"}{r.score ? ` · ${r.score}/5` : ""}</strong>{r.body || "Review text not added yet."}</div>)}
                {values.url && /^https?:\/\//i.test(values.url) && <a href={values.url} target="_blank" rel="noopener noreferrer">Open reviewed page <ExternalLink size={13}/></a>}
              </div> : <div className="rv-empty"><Star size={26}/><strong>Your review preview goes here</strong><p>Add your published reviews or load the example to get started.</p></div>}
            </div>
          ) : (
            <div className="rv-codebox"><div className="rv-codehead"><span><FileCode2 size={14}/> {view === "embed" ? "HTML / SCRIPT TAG" : "RAW JSON-LD"}</span><span>{values.type}</span></div>{canExport ? <pre tabIndex={0} aria-label="Generated review JSON-LD"><code>{selectedCode}</code></pre> : <div className="rv-code-empty"><FileCode2 size={26}/><strong>Schema will appear here</strong><p>{hasStarted ? generated.error : "Add your review details to generate the markup."}</p></div>}</div>
          )}
          {showSelfServing && <div className="rv-warning" role="alert" style={{marginTop:14}}><AlertTriangle size={17}/><span>Google generally excludes review stars for this self-serving review setup. Schema.org validation alone does not establish Google eligibility.</span></div>}
          <div className="rv-guidance"><CircleHelp size={16}/><p>{view === "embed" ? "Paste this script into the HTML of the page displaying these reviews." : view === "json" ? "Use raw JSON-LD if your CMS has a structured data field." : "This is a preview of the entered reviews, not a Google search result."}</p></div>
          <div className="rv-actions">
            {view !== "preview" && <button type="button" className="rv-primary" disabled={!canExport} onClick={copyCode}><Copy size={15}/> {view === "json" ? "Copy JSON-LD" : "Copy HTML embed"}</button>}
            <button type="button" className="rv-validate" disabled={!canExport} onClick={validateSchema}><ArrowRight size={15}/> Validate schema</button>
            <button type="button" className="rv-secondary" disabled={!canExport} onClick={downloadJson}><Download size={15}/> Download JSON-LD</button>
          </div>
          {canExport && <div className="rv-included"><strong>Included in this schema</strong><span><Check size={13}/> {generated.node["@type"]} details</span><span><Check size={13}/> {generated.node.review.length} reviews</span><span><Check size={13}/> Average rating {generated.node.aggregateRating.ratingValue}/5</span></div>}
          <div className="rv-privacy"><ShieldCheck size={15}/> Your draft stays in this browser tab. No account or upload required.</div>
        </section>
      </div>
      {notice && <div className="rv-toast" role="status"><Check size={16}/>{notice}</div>}
      <style jsx global>{`

        .rv-studio{--teal:#167273;--deep:#073b3b;--ink:#011522;--muted:#667e78;--line:#dce9e5;width:100%;max-width:1240px;margin:0 auto;padding:8px 0 42px;background:#fff;color:var(--ink);font-family:"Montserrat",Arial,sans-serif!important}
        .rv-studio,.rv-studio *,.rv-studio *::before,.rv-studio *::after{box-sizing:border-box;font-family:"Montserrat",Arial,sans-serif!important}
        .rv-studio button{cursor:pointer}.rv-studio button:disabled{opacity:.45;cursor:not-allowed}.rv-studio button:focus-visible,.rv-studio input:focus-visible,.rv-studio textarea:focus-visible,.rv-studio select:focus-visible{outline:3px solid #a2ddd0;outline-offset:2px}
        .rv-studio .rv-hero{display:flex;justify-content:space-between;align-items:flex-start;gap:24px;margin-bottom:24px;background:#fff!important;border:0!important;box-shadow:none!important}
        .rv-studio .rv-kicker{font-size:10px;font-weight:800;letter-spacing:.1em;color:var(--teal)}
        .rv-studio .rv-hero h2{font-size:clamp(24px,2.6vw,34px)!important;line-height:1.2!important;letter-spacing:-.045em!important;font-weight:800!important;color:var(--ink)!important;margin:9px 0!important}
        .rv-studio .rv-hero p{font-size:13px;line-height:1.8;color:var(--muted);max-width:740px;margin:0}
        .rv-studio .rv-reset,.rv-studio .rv-outline{display:inline-flex;gap:8px;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:9px;background:#fff;color:var(--deep);padding:11px 14px;font-size:11px;font-weight:750;white-space:nowrap}.rv-studio .rv-reset:hover,.rv-studio .rv-outline:hover{background:#f2f8f5}
        .rv-studio .rv-workspace{display:grid;grid-template-columns:minmax(0,1.06fr) minmax(0,.94fr);gap:16px;align-items:start}.rv-studio .rv-panel{min-width:0;border:1px solid var(--line);border-radius:15px;background:#fff;padding:22px;box-shadow:0 6px 24px rgba(6,60,48,.025)}
        .rv-studio .rv-panel-top{display:flex;gap:12px;align-items:flex-start;margin-bottom:19px}.rv-studio .rv-index{width:30px;height:30px;flex:0 0 30px;display:grid;place-items:center;border-radius:8px;background:#e9f5f0;color:var(--teal);font-size:11px;font-weight:800}.rv-studio .rv-heading>span{display:block;color:var(--teal);font-size:9px;font-weight:800;letter-spacing:.09em;margin-bottom:5px}.rv-studio .rv-heading h3{color:var(--ink)!important;font-size:19px!important;font-weight:800!important;letter-spacing:-.03em!important;line-height:1.3!important;margin:0 0 5px!important}.rv-studio .rv-heading p{color:var(--muted);font-size:11px;line-height:1.7;margin:0}
        .rv-studio .rv-toolbar{border-bottom:1px solid #e8efeb;padding-bottom:18px;display:flex}.rv-studio .rv-section{padding:23px 0;border-bottom:1px solid #e8efeb}.rv-studio .rv-section:last-child{border-bottom:0;padding-bottom:0}.rv-studio .rv-section-heading{display:flex;gap:10px;align-items:flex-start;margin-bottom:17px}.rv-studio .rv-icon{display:grid;place-items:center;width:32px;height:32px;flex:0 0 32px;border-radius:9px;background:#eaf5ef;color:var(--teal)}.rv-studio .rv-section-heading h4{font-size:12px;font-weight:800;color:var(--ink);margin:0 0 5px}.rv-studio .rv-section-heading p{font-size:10px;line-height:1.6;color:var(--muted);margin:0}.rv-studio .rv-fields{display:grid;gap:16px}.rv-studio .rv-two{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .rv-studio .rv-field{min-width:0}.rv-studio .rv-field label{display:block;color:#294c45;font-size:10px;font-weight:800;margin:0 0 8px}.rv-studio .rv-field label span{color:#9aaea5;font-size:9px;font-weight:600;margin-left:5px}.rv-studio .rv-field input,.rv-studio .rv-field textarea,.rv-studio .rv-field select{display:block;width:100%;min-width:0;border:1px solid #d5e2dc;border-radius:8px;background:#fff;color:var(--ink);padding:12px 13px;outline:0;font-size:12px!important;line-height:1.65}.rv-studio .rv-field textarea{min-height:94px;resize:vertical}.rv-studio .rv-field input:focus,.rv-studio .rv-field textarea:focus,.rv-studio .rv-field select:focus{border-color:var(--teal);box-shadow:0 0 0 3px rgba(22,114,115,.09)}.rv-studio .rv-field input::placeholder,.rv-studio .rv-field textarea::placeholder{color:#9eafa7}.rv-studio .rv-field small{display:block;margin-top:6px;color:#839b92;font-size:9px;line-height:1.6}
        .rv-studio .rv-note{display:flex;align-items:flex-start;gap:9px;border:1px solid #dcece4;border-radius:9px;background:#f5faf7;padding:13px;color:#607f74;font-size:10px;line-height:1.7}.rv-studio .rv-note svg{flex:0 0 16px;color:var(--teal)}
        .rv-studio .rv-output{position:sticky;top:16px}.rv-studio .rv-ready{display:flex;justify-content:space-between;align-items:center;gap:12px;background:#f1f8f4;border:1px solid #dcece4;border-radius:10px;padding:14px}.rv-studio .rv-ready>div{display:grid;gap:5px}.rv-studio .rv-ready strong{font-size:11px;color:var(--deep)}.rv-studio .rv-ready small{font-size:9px;color:#719184}.rv-studio .rv-pill{display:inline-flex;align-items:center;gap:5px;white-space:nowrap;border:1px solid #d3e6dc;border-radius:30px;padding:6px 9px;background:#fff;color:#7b9187;font-size:9px;font-weight:750}.rv-studio .rv-pill.ready{color:#13734d}
        .rv-studio .rv-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px;padding:4px;margin:16px 0;background:#f2f6f4;border:1px solid #e5efea;border-radius:10px}.rv-studio .rv-tabs button{display:inline-flex;align-items:center;justify-content:center;gap:6px;background:transparent;border:0;border-radius:7px;color:#728b82;padding:11px 5px;font-size:10px;font-weight:700}.rv-studio .rv-tabs button[aria-pressed=true]{background:#fff;color:var(--deep);box-shadow:0 1px 5px #193e321a}
        .rv-studio .rv-codebox{background:#0b2029;border:1px solid #1d3a41;border-radius:11px;overflow:hidden}.rv-studio .rv-codehead{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 15px;background:#102f37;color:#b2d5cf;font-size:9px;font-weight:750;letter-spacing:.07em}.rv-studio .rv-codehead span:first-child{display:flex;align-items:center;gap:7px}.rv-studio .rv-codebox pre{min-height:230px;max-height:420px;overflow:auto;margin:0;padding:18px;color:#d8f5e8;font-size:10px;line-height:1.8;white-space:pre-wrap;overflow-wrap:anywhere}.rv-studio .rv-code-empty{min-height:230px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;padding:25px}.rv-studio .rv-code-empty svg{color:#68968b}.rv-studio .rv-code-empty strong{color:#e6faf2;font-size:12px}.rv-studio .rv-code-empty p{color:#a3bdb8;font-size:10px;line-height:1.7;max-width:280px;margin:0}
        .rv-studio .rv-preview{background:#fff;border:1px solid var(--line);border-radius:11px;min-height:245px;overflow:hidden}.rv-studio .rv-preview-head{display:flex;align-items:center;gap:7px;color:#6b857a;font-size:10px;font-weight:800;padding:13px 15px;border-bottom:1px solid #e8f0ec}.rv-studio .rv-preview-body{padding:22px;display:grid;gap:11px}.rv-studio .rv-preview-icon{width:50px;height:50px;border-radius:13px;background:#e9f5f0;color:var(--teal);display:grid;place-items:center}.rv-studio .rv-preview-provider{font-size:10px;color:var(--teal);font-weight:800}.rv-studio .rv-preview h4{font-size:18px;color:var(--ink);margin:0;font-weight:800}.rv-studio .rv-preview-body p{font-size:11px;color:var(--muted);margin:0;line-height:1.8}.rv-studio .rv-chips{display:flex;flex-wrap:wrap;gap:6px}.rv-studio .rv-chips span{border-radius:20px;background:#f1f7f4;color:#3e7565;font-size:9px;font-weight:700;padding:6px 9px}.rv-studio .rv-preview-price{font-size:21px;font-weight:850;color:var(--deep)}.rv-studio .rv-rating{display:flex;align-items:center;gap:5px;color:#a8772e;font-size:11px}.rv-studio .rv-preview ul{margin:0;padding-left:20px;color:var(--muted);font-size:10px;line-height:1.8}.rv-studio .rv-preview a{display:inline-flex;align-items:center;gap:5px;color:var(--teal);font-size:10px;font-weight:800;text-decoration:none}.rv-studio .rv-empty{min-height:220px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:10px;text-align:center;padding:24px;color:#839b90}.rv-studio .rv-empty strong{font-size:12px;color:var(--deep)}.rv-studio .rv-empty p{font-size:10px;color:var(--muted);max-width:280px;margin:0;line-height:1.7}
        .rv-studio .rv-guidance{display:flex;align-items:flex-start;gap:9px;margin:14px 0;color:#69827a}.rv-studio .rv-guidance svg{flex:0 0 16px;color:var(--teal)}.rv-studio .rv-guidance p{margin:0;font-size:10px;line-height:1.7}.rv-studio .rv-actions{display:flex;flex-wrap:wrap;gap:9px}.rv-studio .rv-primary,.rv-studio .rv-secondary,.rv-studio .rv-validate{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:39px;padding:12px 14px;border-radius:8px;font-size:10px;font-weight:800}.rv-studio .rv-primary{background:var(--deep);color:#fff;border:1px solid var(--deep)}.rv-studio .rv-primary:hover:not(:disabled){background:var(--teal)}.rv-studio .rv-secondary{background:#fff;color:var(--deep);border:1px solid var(--line)}.rv-studio .rv-validate{background:#eef7f3;color:var(--teal);border:1px solid #cce5dc}.rv-studio .rv-validate:hover:not(:disabled){background:#dff1e9}
        .rv-studio .rv-included{display:flex;flex-wrap:wrap;gap:9px;margin-top:18px;padding:14px;border:1px solid #e5ede9;border-radius:9px;background:#f8faf9}.rv-studio .rv-included strong{display:block;width:100%;font-size:10px;color:var(--deep)}.rv-studio .rv-included span{display:flex;gap:5px;align-items:center;font-size:9px;font-weight:700;color:#437b63}.rv-studio .rv-privacy{display:flex;gap:7px;align-items:flex-start;color:#83968e;font-size:9px;line-height:1.6;margin-top:19px;padding-top:14px;border-top:1px solid #e9efec}.rv-studio .rv-privacy svg{flex:0 0 15px}.rv-studio .rv-toast{position:sticky;bottom:14px;display:flex;align-items:center;gap:8px;margin:14px 0 0 auto;width:max-content;max-width:100%;padding:11px 15px;border:1px solid #b5dbcb;border-radius:9px;background:#ebf8f1;color:#135643;font-size:11px;font-weight:700;box-shadow:0 8px 22px rgba(11,71,48,.1)}
        @media(max-width:1020px){.rv-studio .rv-workspace{grid-template-columns:1fr}.rv-studio .rv-output{position:static}}
        @media(max-width:580px){.rv-studio .rv-hero{flex-direction:column;gap:14px}.rv-studio .rv-panel{padding:17px}.rv-studio .rv-two{grid-template-columns:1fr}.rv-studio .rv-tabs button{font-size:9px;gap:4px}.rv-studio .rv-tabs svg{display:none}.rv-studio .rv-actions{display:grid}.rv-studio .rv-actions button{width:100%}}
      
        .rv-studio .rv-review-card{border:1px solid #dce9e3;border-radius:11px;padding:16px;background:#fcfefd;display:grid;gap:13px}.rv-studio .rv-review-top{display:flex;align-items:center;justify-content:space-between;gap:8px}.rv-studio .rv-review-top strong{font-size:11px;color:var(--deep)}.rv-studio .rv-remove{display:flex;align-items:center;gap:5px;border:0;background:transparent;color:#a04444;font-size:10px;font-weight:700;cursor:pointer}.rv-studio .rv-add{display:inline-flex;align-items:center;justify-content:center;gap:8px;width:100%;border:1px dashed #98c7b2;border-radius:9px;background:#f5faf7;color:var(--teal);font-size:11px;font-weight:800;padding:13px}.rv-studio .rv-warning{display:flex;gap:10px;align-items:flex-start;border:1px solid #edd9a9;border-radius:10px;background:#fffbef;padding:13px;color:#795c25;font-size:10px;line-height:1.8}.rv-studio .rv-warning svg{flex:0 0 17px}.rv-studio .rv-score{display:flex;align-items:baseline;gap:8px;font-size:28px;font-weight:800;color:var(--deep)}.rv-studio .rv-score small{font-size:11px;color:#8ba098;font-weight:600}.rv-studio .rv-review-excerpt{padding:11px 0;border-top:1px solid #e8f0ec;font-size:11px;color:#5b736a;line-height:1.7}.rv-studio .rv-review-excerpt strong{display:block;color:var(--deep);font-size:10px}.rv-studio .rv-date-error{padding:11px 13px;border:1px solid #efb8b8;border-radius:8px;background:#fff5f5;color:#a12b2b;font-size:11px;font-weight:700;line-height:1.6}
        .rv-studio .rv-image-caption{display:flex;align-items:center;gap:7px;color:#4a7d6c;font-size:10px;font-weight:700}
      `}</style>
    </div>
  );
}
