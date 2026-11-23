"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Head from "next/head";
import {
  ArrowRight, Check, CircleHelp, Code2, Copy, Download, ExternalLink,
  Eye, FileCode2, FileJson, RotateCcw, ShieldCheck, Sparkles,
  CalendarDays, Newspaper, UserRound, Image as ImageIcon, Building2,
} from "lucide-react";
import { address, identifier, required, date } from "./SchemaStudio";

const EMPTY = {
  type: "BlogPosting", headline: "", url: "", images: "",
  author: "", authorType: "Person", profile: "", publisher: "",
  publisherId: "", published: "", updated: "",
};
const EXAMPLE = {
  type: "BlogPosting",
  headline: "How to trace organic demos back to content",
  url: "https://example.com/blog/organic-demos",
  author: "Alex Reed", authorType: "Person",
  profile: "https://example.com/authors/alex-reed",
  publisher: "Cedar Metrics",
  publisherId: "https://example.com/#organization",
  images: "https://example.com/images/organic-demos.jpg",
  published: "2026-01-12", updated: "2026-02-03",
};
const TYPES = [
  { value: "BlogPosting", label: "Blog post" },
  { value: "Article", label: "Article" },
  { value: "NewsArticle", label: "News article" },
];

export const faqs = [
  {
    question: "Which article schema type should I choose?",
    answer: "Use BlogPosting if you're publishing a blog post, NewsArticle if you're reporting news, or Article for other content like guides, tutorials and editorial articles. For example, most posts on a company blog should use BlogPosting. Just choose whichever type best describes the content on your page.",
  },
  {
    question: "Where should I add Article JSON-LD?",
    answer: "Add the code to the HTML of the article page, usually through your CMS's custom code or SEO settings. The headline, byline, dates and images in your schema should match the published article.",
  },
  {
    question: "How do I validate Article schema?",
    answer: "Click Validate schema, then paste the copied code into Schema.org Validator's Code Snippet test. You can also use Google's Rich Results Test to check supported search features. Valid schema doesn't guarantee a rich result.",
  },
];

// Retain the named build export for existing registry and programmatic usage.
export function build(v) {
  const url = address(required(v.url, "the article URL"), "article URL");
  const published = date(required(v.published, "the publication date"), "publication date");
  const modified = date(v.updated || "", "last modified date");
  if (modified && modified < published) {
    throw Error("The last modified date cannot be earlier than the publication date.");
  }
  const images = [...new Set(
    (v.images || "").split(/\r?\n/)
      .map(s => s.trim()).filter(Boolean)
      .map(s => address(s, "an image URL")),
  )];
  const publisherId = address(v.publisherId || "", "publisher organization ID");
  if (publisherId && !(v.publisher || "").trim()) {
    throw Error("Enter a publisher name if you add a publisher organization ID.");
  }
  const authorType = ["Person", "Organization"].includes(v.authorType)
    ? v.authorType : "Person";
  const type = ["BlogPosting", "Article", "NewsArticle"].includes(v.type)
    ? v.type : "BlogPosting";
  return {
    node: {
      "@type": type,
      "@id": identifier(url, "article"),
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      headline: required(v.headline, "the headline"),
      author: {
        "@type": authorType,
        name: required(v.author, "the author name"),
        url: address(v.profile || "", "author profile URL"),
      },
      publisher: (v.publisher || "").trim()
        ? { "@type": "Organization", name: v.publisher.trim(), "@id": publisherId }
        : undefined,
      datePublished: published,
      dateModified: modified,
      image: images.length ? images : undefined,
    },
  };
}

function Field({ id, label, value, onChange, placeholder, type = "text", hint, mandatory = false }) {
  return (
    <div className="ar-field">
      <label htmlFor={id}>{label}{mandatory && <span>Required</span>}</label>
      <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      {hint && <small>{hint}</small>}
    </div>
  );
}

export default function ArticleSchemaGenerator() {
  const [values, setValues] = useState(EMPTY);
  const [view, setView] = useState("embed");
  const [notice, setNotice] = useState("");
  const uid = useId().replace(/:/g, "");
  const idFor = name => `ar-${uid}-${name}`;

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function update(field, value) {
    setValues(previous => ({ ...previous, [field]: value }));
    setNotice("");
  }
  function reset() { setValues({ ...EMPTY }); setView("embed"); setNotice("New article started."); }
  function loadExample() { setValues({ ...EXAMPLE }); setNotice("Example article loaded."); }

  const hasStarted = Object.keys(values).some(key =>
    !["type", "authorType"].includes(key) && String(values[key] || "").trim());

  const generated = useMemo(() => {
    try {
      const node = build(values).node;
      const json = JSON.stringify({ "@context": "https://schema.org", ...node }, null, 2).replace(/</g, "\\u003c");
      return { json, embed: `<script type="application/ld+json">\n${json}\n</script>`, node, error: "" };
    } catch (error) {
      return { json: "", embed: "", node: null, error: error.message || "Check your article details." };
    }
  }, [values]);

  const canExport = Boolean(generated.node);
  const selectedCode = view === "json" ? generated.json : generated.embed;

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
    } catch {
      setNotice("Validator opened. Copy the HTML embed and paste it into CODE SNIPPET.");
    }
  }

  function downloadJson() {
    if (!canExport) return;
    const blob = new Blob([generated.json], { type: "application/ld+json;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = "article-schema.jsonld";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
    setNotice("JSON-LD download started.");
  }

  return (
    <div className="ar-studio">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <div className="ar-hero">
        <div>
          <span className="ar-kicker">GROWUP / TECHNICAL SEO</span>
          <h2>Generate your Article JSON-LD</h2>
          <p>Add your article details, author, images and publication dates, then copy or download the generated schema.</p>
        </div>
        <button className="ar-reset" type="button" onClick={reset}><RotateCcw size={15} /> Start fresh</button>
      </div>

      <div className="ar-workspace">
        <section className="ar-panel" aria-labelledby={idFor("editor-title")}>
          <div className="ar-panel-top">
            <span className="ar-index">01</span>
            <div className="ar-heading"><span>ARTICLE EDITOR</span><h3 id={idFor("editor-title")}>Your Article Details</h3><p>Use the same information readers can see on your published page.</p></div>
          </div>
          <div className="ar-toolbar"><button className="ar-outline" type="button" onClick={loadExample}><Sparkles size={15} /> Load example</button></div>

          <div className="ar-section">
            <div className="ar-section-heading"><span className="ar-icon"><Newspaper size={17}/></span><div><h4>Article information</h4><p>Choose the article type and enter its published details.</p></div></div>
            <div className="ar-fields">
              <div className="ar-field"><label htmlFor={idFor("type")}>Article type</label><select id={idFor("type")} value={values.type} onChange={e=>update("type",e.target.value)}>{TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}</select><small>Blog post, news story or general editorial article.</small></div>
              <Field id={idFor("headline")} label="Article headline" mandatory value={values.headline} onChange={v=>update("headline",v)} placeholder="e.g. How to trace organic demos back to content" />
              <Field id={idFor("url")} label="Canonical article URL" mandatory type="url" value={values.url} onChange={v=>update("url",v)} placeholder="https://example.com/blog/article" hint="Use the full URL of the article you're marking up." />
              <div className="ar-field"><label htmlFor={idFor("images")}>Article image URLs <span>Optional</span></label><textarea id={idFor("images")} rows={3} value={values.images} onChange={e=>update("images",e.target.value)} placeholder={"https://example.com/images/article-cover.jpg\nhttps://example.com/images/article-square.jpg"}/><small>One public image URL per line. Different crops are fine.</small></div>
            </div>
          </div>

          <div className="ar-section">
            <div className="ar-section-heading"><span className="ar-icon"><UserRound size={17}/></span><div><h4>Author details</h4><p>Identify who wrote the article.</p></div></div>
            <div className="ar-fields">
              <div className="ar-field"><label htmlFor={idFor("author-type")}>Author type</label><select id={idFor("author-type")} value={values.authorType} onChange={e=>update("authorType",e.target.value)}><option value="Person">Person</option><option value="Organization">Organization</option></select></div>
              <Field id={idFor("author")} label={values.authorType === "Person" ? "Author name" : "Author organization name"} mandatory value={values.author} onChange={v=>update("author",v)} placeholder={values.authorType === "Person" ? "e.g. Alex Reed" : "e.g. Cedar Editorial Team"} />
              <Field id={idFor("profile")} label="Author profile URL" type="url" value={values.profile} onChange={v=>update("profile",v)} placeholder="https://example.com/authors/alex-reed" hint="Optional. Link to a relevant author bio or profile." />
            </div>
          </div>

          <div className="ar-section">
            <div className="ar-section-heading"><span className="ar-icon"><Building2 size={17}/></span><div><h4>Publisher</h4><p>Add the company or publication behind the article.</p></div></div>
            <div className="ar-fields">
              <Field id={idFor("publisher")} label="Publisher name" value={values.publisher} onChange={v=>update("publisher",v)} placeholder="e.g. Cedar Metrics" />
              <Field id={idFor("publisher-id")} label="Publisher organization ID" type="url" value={values.publisherId} onChange={v=>update("publisherId",v)} placeholder="https://example.com/#organization" hint="Optional. Use the same @id as your Organization schema, if you have one." />
            </div>
          </div>

          <div className="ar-section">
            <div className="ar-section-heading"><span className="ar-icon"><CalendarDays size={17}/></span><div><h4>Publication dates</h4><p>Add the original date and any later update.</p></div></div>
            <div className="ar-fields">
              <div className="ar-two">
                <Field id={idFor("published")} label="Publication date" mandatory type="date" value={values.published} onChange={v=>update("published",v)}/>
                <Field id={idFor("updated")} label="Last modified date" type="date" value={values.updated} onChange={v=>update("updated",v)}/>
              </div>
              <div className="ar-note"><CircleHelp size={16}/><span>Never updated the article? Leave the modified date blank. If you enter one, it must be the same as or later than the publication date.</span></div>
              {values.updated && values.published && values.updated < values.published && <div className="ar-date-error" role="alert">The modified date is earlier than the publication date. Please correct it before exporting.</div>}
            </div>
          </div>
        </section>

        <section className="ar-panel ar-output" aria-labelledby={idFor("output-title")}>
          <div className="ar-panel-top"><span className="ar-index">02</span><div className="ar-heading"><span>LIVE OUTPUT</span><h3 id={idFor("output-title")}>Your Article Markup</h3><p>Review the schema before adding it to your article page.</p></div></div>
          <div className="ar-ready"><div><strong>{canExport ? "Ready for your website" : "Complete your article details"}</strong><small>{canExport ? `${values.type} JSON-LD generated` : "Add a headline, article URL, author and publication date"}</small></div><span className={canExport ? "ar-pill ready" : "ar-pill"}>{canExport ? <Check size={13}/> : <CircleHelp size={13}/>} {canExport ? "Ready to export" : "In progress"}</span></div>
          <div className="ar-tabs" role="group" aria-label="Output format">
            <button type="button" aria-pressed={view === "embed"} onClick={()=>setView("embed")}><Code2 size={15}/> HTML embed</button>
            <button type="button" aria-pressed={view === "json"} onClick={()=>setView("json")}><FileJson size={15}/> JSON-LD</button>
            <button type="button" aria-pressed={view === "preview"} onClick={()=>setView("preview")}><Eye size={15}/> Article preview</button>
          </div>

          {view === "preview" ? (
            <div className="ar-preview">
              <div className="ar-preview-head"><Eye size={15}/> Article details preview</div>
              {hasStarted ? (
                <div className="ar-preview-body">
                  <div className="ar-preview-icon"><Newspaper size={26}/></div>
                  <span className="ar-preview-provider">{TYPES.find(t=>t.value===values.type)?.label || values.type}</span>
                  <h4>{values.headline || "Article headline"}</h4>
                  <p>By {values.author || "Author name"}{values.publisher ? ` · ${values.publisher}` : ""}</p>
                  <div className="ar-chips"><span>{values.published ? `Published ${values.published}` : "Publication date not added"}</span>{values.updated && <span>Updated {values.updated}</span>}</div>
                  {values.images.trim() && <div className="ar-image-caption"><ImageIcon size={15}/> {values.images.split(/\r?\n/).filter(s=>s.trim()).length} image URL(s) included</div>}
                  {values.url && /^https?:\/\//i.test(values.url) && <a href={values.url} target="_blank" rel="noopener noreferrer">Open article <ExternalLink size={13}/></a>}
                </div>
              ) : <div className="ar-empty"><Newspaper size={26}/><strong>Your article preview goes here</strong><p>Fill in the fields or load the example to see a preview.</p></div>}
            </div>
          ) : (
            <div className="ar-codebox"><div className="ar-codehead"><span><FileCode2 size={14}/> {view === "embed" ? "HTML / SCRIPT TAG" : "RAW JSON-LD"}</span><span>{values.type}</span></div>{canExport ? <pre tabIndex={0} aria-label="Generated article JSON-LD"><code>{selectedCode}</code></pre> : <div className="ar-code-empty"><FileCode2 size={26}/><strong>Schema will appear here</strong><p>{hasStarted ? generated.error : "Add your article details to generate the markup."}</p></div>}</div>
          )}

          <div className="ar-guidance"><CircleHelp size={16}/><p>{view === "embed" ? "Paste this script into the HTML of your published article page." : view === "json" ? "Use raw JSON-LD if your CMS has a structured data field." : "This is a content preview, not an exact Google search result."}</p></div>
          <div className="ar-actions">
            {view !== "preview" && <button type="button" className="ar-primary" disabled={!canExport} onClick={copyCode}><Copy size={15}/> {view === "json" ? "Copy JSON-LD" : "Copy HTML embed"}</button>}
            <button type="button" className="ar-validate" disabled={!canExport} onClick={validateSchema}><ArrowRight size={15}/> Validate schema</button>
            <button type="button" className="ar-secondary" disabled={!canExport} onClick={downloadJson}><Download size={15}/> Download JSON-LD</button>
          </div>
          {canExport && <div className="ar-included"><strong>Included in this schema</strong><span><Check size={13}/> {values.type} details</span><span><Check size={13}/> Author &amp; publication date</span>{generated.node.publisher && <span><Check size={13}/> Publisher</span>}{generated.node.image && <span><Check size={13}/> Article images</span>}</div>}
          <div className="ar-privacy"><ShieldCheck size={15}/> Your draft stays in this browser tab. No account or upload required.</div>
        </section>
      </div>
      {notice && <div className="ar-toast" role="status"><Check size={16}/>{notice}</div>}

      <style jsx global>{`

        .ar-studio{--teal:#167273;--deep:#073b3b;--ink:#011522;--muted:#667e78;--line:#dce9e5;width:100%;max-width:1240px;margin:0 auto;padding:8px 0 42px;background:#fff;color:var(--ink);font-family:"Montserrat",Arial,sans-serif!important}
        .ar-studio,.ar-studio *,.ar-studio *::before,.ar-studio *::after{box-sizing:border-box;font-family:"Montserrat",Arial,sans-serif!important}
        .ar-studio button{cursor:pointer}.ar-studio button:disabled{opacity:.45;cursor:not-allowed}.ar-studio button:focus-visible,.ar-studio input:focus-visible,.ar-studio textarea:focus-visible,.ar-studio select:focus-visible{outline:3px solid #a2ddd0;outline-offset:2px}
        .ar-studio .ar-hero{display:flex;justify-content:space-between;align-items:flex-start;gap:24px;margin-bottom:24px;background:#fff!important;border:0!important;box-shadow:none!important}
        .ar-studio .ar-kicker{font-size:10px;font-weight:800;letter-spacing:.1em;color:var(--teal)}
        .ar-studio .ar-hero h2{font-size:clamp(24px,2.6vw,34px)!important;line-height:1.2!important;letter-spacing:-.045em!important;font-weight:800!important;color:var(--ink)!important;margin:9px 0!important}
        .ar-studio .ar-hero p{font-size:13px;line-height:1.8;color:var(--muted);max-width:740px;margin:0}
        .ar-studio .ar-reset,.ar-studio .ar-outline{display:inline-flex;gap:8px;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:9px;background:#fff;color:var(--deep);padding:11px 14px;font-size:11px;font-weight:750;white-space:nowrap}.ar-studio .ar-reset:hover,.ar-studio .ar-outline:hover{background:#f2f8f5}
        .ar-studio .ar-workspace{display:grid;grid-template-columns:minmax(0,1.06fr) minmax(0,.94fr);gap:16px;align-items:start}.ar-studio .ar-panel{min-width:0;border:1px solid var(--line);border-radius:15px;background:#fff;padding:22px;box-shadow:0 6px 24px rgba(6,60,48,.025)}
        .ar-studio .ar-panel-top{display:flex;gap:12px;align-items:flex-start;margin-bottom:19px}.ar-studio .ar-index{width:30px;height:30px;flex:0 0 30px;display:grid;place-items:center;border-radius:8px;background:#e9f5f0;color:var(--teal);font-size:11px;font-weight:800}.ar-studio .ar-heading>span{display:block;color:var(--teal);font-size:9px;font-weight:800;letter-spacing:.09em;margin-bottom:5px}.ar-studio .ar-heading h3{color:var(--ink)!important;font-size:19px!important;font-weight:800!important;letter-spacing:-.03em!important;line-height:1.3!important;margin:0 0 5px!important}.ar-studio .ar-heading p{color:var(--muted);font-size:11px;line-height:1.7;margin:0}
        .ar-studio .ar-toolbar{border-bottom:1px solid #e8efeb;padding-bottom:18px;display:flex}.ar-studio .ar-section{padding:23px 0;border-bottom:1px solid #e8efeb}.ar-studio .ar-section:last-child{border-bottom:0;padding-bottom:0}.ar-studio .ar-section-heading{display:flex;gap:10px;align-items:flex-start;margin-bottom:17px}.ar-studio .ar-icon{display:grid;place-items:center;width:32px;height:32px;flex:0 0 32px;border-radius:9px;background:#eaf5ef;color:var(--teal)}.ar-studio .ar-section-heading h4{font-size:12px;font-weight:800;color:var(--ink);margin:0 0 5px}.ar-studio .ar-section-heading p{font-size:10px;line-height:1.6;color:var(--muted);margin:0}.ar-studio .ar-fields{display:grid;gap:16px}.ar-studio .ar-two{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .ar-studio .ar-field{min-width:0}.ar-studio .ar-field label{display:block;color:#294c45;font-size:10px;font-weight:800;margin:0 0 8px}.ar-studio .ar-field label span{color:#9aaea5;font-size:9px;font-weight:600;margin-left:5px}.ar-studio .ar-field input,.ar-studio .ar-field textarea,.ar-studio .ar-field select{display:block;width:100%;min-width:0;border:1px solid #d5e2dc;border-radius:8px;background:#fff;color:var(--ink);padding:12px 13px;outline:0;font-size:12px!important;line-height:1.65}.ar-studio .ar-field textarea{min-height:94px;resize:vertical}.ar-studio .ar-field input:focus,.ar-studio .ar-field textarea:focus,.ar-studio .ar-field select:focus{border-color:var(--teal);box-shadow:0 0 0 3px rgba(22,114,115,.09)}.ar-studio .ar-field input::placeholder,.ar-studio .ar-field textarea::placeholder{color:#9eafa7}.ar-studio .ar-field small{display:block;margin-top:6px;color:#839b92;font-size:9px;line-height:1.6}
        .ar-studio .ar-note{display:flex;align-items:flex-start;gap:9px;border:1px solid #dcece4;border-radius:9px;background:#f5faf7;padding:13px;color:#607f74;font-size:10px;line-height:1.7}.ar-studio .ar-note svg{flex:0 0 16px;color:var(--teal)}
        .ar-studio .ar-output{position:sticky;top:16px}.ar-studio .ar-ready{display:flex;justify-content:space-between;align-items:center;gap:12px;background:#f1f8f4;border:1px solid #dcece4;border-radius:10px;padding:14px}.ar-studio .ar-ready>div{display:grid;gap:5px}.ar-studio .ar-ready strong{font-size:11px;color:var(--deep)}.ar-studio .ar-ready small{font-size:9px;color:#719184}.ar-studio .ar-pill{display:inline-flex;align-items:center;gap:5px;white-space:nowrap;border:1px solid #d3e6dc;border-radius:30px;padding:6px 9px;background:#fff;color:#7b9187;font-size:9px;font-weight:750}.ar-studio .ar-pill.ready{color:#13734d}
        .ar-studio .ar-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px;padding:4px;margin:16px 0;background:#f2f6f4;border:1px solid #e5efea;border-radius:10px}.ar-studio .ar-tabs button{display:inline-flex;align-items:center;justify-content:center;gap:6px;background:transparent;border:0;border-radius:7px;color:#728b82;padding:11px 5px;font-size:10px;font-weight:700}.ar-studio .ar-tabs button[aria-pressed=true]{background:#fff;color:var(--deep);box-shadow:0 1px 5px #193e321a}
        .ar-studio .ar-codebox{background:#0b2029;border:1px solid #1d3a41;border-radius:11px;overflow:hidden}.ar-studio .ar-codehead{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 15px;background:#102f37;color:#b2d5cf;font-size:9px;font-weight:750;letter-spacing:.07em}.ar-studio .ar-codehead span:first-child{display:flex;align-items:center;gap:7px}.ar-studio .ar-codebox pre{min-height:230px;max-height:420px;overflow:auto;margin:0;padding:18px;color:#d8f5e8;font-size:10px;line-height:1.8;white-space:pre-wrap;overflow-wrap:anywhere}.ar-studio .ar-code-empty{min-height:230px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;padding:25px}.ar-studio .ar-code-empty svg{color:#68968b}.ar-studio .ar-code-empty strong{color:#e6faf2;font-size:12px}.ar-studio .ar-code-empty p{color:#a3bdb8;font-size:10px;line-height:1.7;max-width:280px;margin:0}
        .ar-studio .ar-preview{background:#fff;border:1px solid var(--line);border-radius:11px;min-height:245px;overflow:hidden}.ar-studio .ar-preview-head{display:flex;align-items:center;gap:7px;color:#6b857a;font-size:10px;font-weight:800;padding:13px 15px;border-bottom:1px solid #e8f0ec}.ar-studio .ar-preview-body{padding:22px;display:grid;gap:11px}.ar-studio .ar-preview-icon{width:50px;height:50px;border-radius:13px;background:#e9f5f0;color:var(--teal);display:grid;place-items:center}.ar-studio .ar-preview-provider{font-size:10px;color:var(--teal);font-weight:800}.ar-studio .ar-preview h4{font-size:18px;color:var(--ink);margin:0;font-weight:800}.ar-studio .ar-preview-body p{font-size:11px;color:var(--muted);margin:0;line-height:1.8}.ar-studio .ar-chips{display:flex;flex-wrap:wrap;gap:6px}.ar-studio .ar-chips span{border-radius:20px;background:#f1f7f4;color:#3e7565;font-size:9px;font-weight:700;padding:6px 9px}.ar-studio .ar-preview-price{font-size:21px;font-weight:850;color:var(--deep)}.ar-studio .ar-rating{display:flex;align-items:center;gap:5px;color:#a8772e;font-size:11px}.ar-studio .ar-preview ul{margin:0;padding-left:20px;color:var(--muted);font-size:10px;line-height:1.8}.ar-studio .ar-preview a{display:inline-flex;align-items:center;gap:5px;color:var(--teal);font-size:10px;font-weight:800;text-decoration:none}.ar-studio .ar-empty{min-height:220px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:10px;text-align:center;padding:24px;color:#839b90}.ar-studio .ar-empty strong{font-size:12px;color:var(--deep)}.ar-studio .ar-empty p{font-size:10px;color:var(--muted);max-width:280px;margin:0;line-height:1.7}
        .ar-studio .ar-guidance{display:flex;align-items:flex-start;gap:9px;margin:14px 0;color:#69827a}.ar-studio .ar-guidance svg{flex:0 0 16px;color:var(--teal)}.ar-studio .ar-guidance p{margin:0;font-size:10px;line-height:1.7}.ar-studio .ar-actions{display:flex;flex-wrap:wrap;gap:9px}.ar-studio .ar-primary,.ar-studio .ar-secondary,.ar-studio .ar-validate{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:39px;padding:12px 14px;border-radius:8px;font-size:10px;font-weight:800}.ar-studio .ar-primary{background:var(--deep);color:#fff;border:1px solid var(--deep)}.ar-studio .ar-primary:hover:not(:disabled){background:var(--teal)}.ar-studio .ar-secondary{background:#fff;color:var(--deep);border:1px solid var(--line)}.ar-studio .ar-validate{background:#eef7f3;color:var(--teal);border:1px solid #cce5dc}.ar-studio .ar-validate:hover:not(:disabled){background:#dff1e9}
        .ar-studio .ar-included{display:flex;flex-wrap:wrap;gap:9px;margin-top:18px;padding:14px;border:1px solid #e5ede9;border-radius:9px;background:#f8faf9}.ar-studio .ar-included strong{display:block;width:100%;font-size:10px;color:var(--deep)}.ar-studio .ar-included span{display:flex;gap:5px;align-items:center;font-size:9px;font-weight:700;color:#437b63}.ar-studio .ar-privacy{display:flex;gap:7px;align-items:flex-start;color:#83968e;font-size:9px;line-height:1.6;margin-top:19px;padding-top:14px;border-top:1px solid #e9efec}.ar-studio .ar-privacy svg{flex:0 0 15px}.ar-studio .ar-toast{position:sticky;bottom:14px;display:flex;align-items:center;gap:8px;margin:14px 0 0 auto;width:max-content;max-width:100%;padding:11px 15px;border:1px solid #b5dbcb;border-radius:9px;background:#ebf8f1;color:#135643;font-size:11px;font-weight:700;box-shadow:0 8px 22px rgba(11,71,48,.1)}
        @media(max-width:1020px){.ar-studio .ar-workspace{grid-template-columns:1fr}.ar-studio .ar-output{position:static}}
        @media(max-width:580px){.ar-studio .ar-hero{flex-direction:column;gap:14px}.ar-studio .ar-panel{padding:17px}.ar-studio .ar-two{grid-template-columns:1fr}.ar-studio .ar-tabs button{font-size:9px;gap:4px}.ar-studio .ar-tabs svg{display:none}.ar-studio .ar-actions{display:grid}.ar-studio .ar-actions button{width:100%}}
      
        .ar-studio .ar-date-error{padding:11px 13px;border:1px solid #efb8b8;border-radius:8px;background:#fff5f5;color:#a12b2b;font-size:11px;font-weight:700;line-height:1.6}
        .ar-studio .ar-image-caption{display:flex;align-items:center;gap:7px;color:#4a7d6c;font-size:10px;font-weight:700}
      `}</style>
    </div>
  );
}
