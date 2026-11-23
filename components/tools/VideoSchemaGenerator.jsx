"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Head from "next/head";
import {
  ArrowRight, Check, CircleHelp, Code2, Copy, Download, ExternalLink,
  Eye, FileCode2, FileJson, RotateCcw, ShieldCheck, Sparkles,
  CalendarDays, Film, PlayCircle, Image as ImageIcon, Clock3, Link2,
} from "lucide-react";
import { address, identifier, required, date } from "./SchemaStudio";

const EMPTY = {
  name: "", description: "", page: "", thumb: "", uploaded: "",
  duration: "", file: "", embed: "",
};

const EXAMPLE = {
  name: "Cedar Analytics product walkthrough",
  description: "See how to build and export a pipeline report.",
  page: "https://example.com/watch/walkthrough",
  thumb: "https://example.com/images/walkthrough.jpg",
  uploaded: "2026-01-12T09:00:00+01:00",
  duration: "04:35",
  embed: "https://player.example.com/embed/cedar-demo",
  file: "",
};

export const faqs = [
  {
    question: "What is VideoObject schema used for?",
    answer: "VideoObject schema gives search engines details about a video on your website, including its title, thumbnail, upload date, duration and playback URL. You can use it for product demos, tutorials, interviews or other videos that visitors can actually watch on the page.",
  },
  {
    question: "Do I need a separate thumbnail URL?",
    answer: "Yes. Add a public image URL for the thumbnail that represents your video. Make sure the image loads and matches the video on the page. A thumbnail page or a link to a video player isn't the same as an image URL.",
  },
  {
    question: "How do I validate VideoObject schema?",
    answer: "Click Validate schema to copy the generated code and open Schema.org Validator. Select Code Snippet, paste the code and run the test. You can also check Google's Rich Results Test for supported video search features. Valid markup doesn't guarantee a rich result.",
  },
];

// Keep the named build export for existing scripts and tool integrations.
export function build(v) {
  const url = address(required(v.page, "the watch page URL"), "watch page URL");
  const time = required(v.uploaded, "the upload timestamp");
  const timestampPattern = /^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:Z|[+-](?:0\d|1[0-4]):[0-5]\d)$/;
  if (!timestampPattern.test(time) || !Number.isFinite(Date.parse(time))) {
    throw Error("Enter an upload timestamp with a timezone, such as 2026-01-12T09:00:00+01:00.");
  }
  date(time.slice(0, 10), "upload date");
  // Guard against overflows and invalid calendar dates that Date.parse may normalize.
  const [year, month, day] = time.slice(0, 10).split("-").map(Number);
  const check = new Date(Date.UTC(year, month - 1, day));
  if (check.getUTCFullYear() !== year || check.getUTCMonth() + 1 !== month || check.getUTCDate() !== day) {
    throw Error("Enter a valid calendar date in the upload timestamp.");
  }

  const rawDuration = required(v.duration, "the running time");
  if (!/^(?:\d+:[0-5]\d:[0-5]\d|\d+:[0-5]\d)$/.test(rawDuration)) {
    throw Error("Enter the video duration as m:ss or h:mm:ss.");
  }
  const total = rawDuration.split(":").reduce((seconds, part) => seconds * 60 + Number(part), 0);
  if (!Number.isSafeInteger(total) || total <= 0) {
    throw Error("Enter a video duration longer than zero.");
  }
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const duration = "PT" + (hours ? `${hours}H` : "") + (minutes ? `${minutes}M` : "") + (seconds ? `${seconds}S` : "");

  const contentUrl = address(v.file || "", "direct video file URL");
  const embedUrl = address(v.embed || "", "embeddable player URL");
  if (!contentUrl && !embedUrl) {
    throw Error("Add a direct video file URL or an embeddable player URL.");
  }

  return {
    node: {
      "@type": "VideoObject",
      "@id": identifier(url, "video"),
      url,
      name: required(v.name, "the video title"),
      description: (v.description || "").trim() || undefined,
      thumbnailUrl: address(required(v.thumb, "the thumbnail image URL"), "thumbnail image URL"),
      uploadDate: time,
      duration,
      contentUrl,
      embedUrl,
    },
  };
}

function Field({ id, label, value, onChange, placeholder, type = "text", hint, mandatory = false }) {
  return (
    <div className="vd-field">
      <label htmlFor={id}>{label}{mandatory && <span>Required</span>}</label>
      <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      {hint && <small>{hint}</small>}
    </div>
  );
}

export default function VideoSchemaGenerator() {
  const [values, setValues] = useState(EMPTY);
  const [view, setView] = useState("embed");
  const [notice, setNotice] = useState("");
  const uid = useId().replace(/:/g, "");
  const idFor = name => `vd-${uid}-${name}`;

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function update(field, value) {
    setValues(previous => ({ ...previous, [field]: value }));
    setNotice("");
  }
  function reset() { setValues({ ...EMPTY }); setView("embed"); setNotice("New video started."); }
  function loadExample() { setValues({ ...EXAMPLE }); setNotice("Example video loaded."); }

  const hasStarted = Object.values(values).some(value => String(value || "").trim());
  const generated = useMemo(() => {
    try {
      const node = build(values).node;
      const json = JSON.stringify({ "@context": "https://schema.org", ...node }, null, 2).replace(/</g, "\\u003c");
      return { json, embed: `<script type="application/ld+json">\n${json}\n</script>`, node, error: "" };
    } catch (error) {
      return { json: "", embed: "", node: null, error: error.message || "Check your video details." };
    }
  }, [values]);

  const canExport = Boolean(generated.node);
  const selectedCode = view === "json" ? generated.json : generated.embed;

  async function copyCode() {
    if (!canExport || view === "preview") return;
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
      setNotice("Code copied. Choose CODE SNIPPET in Schema.org Validator, paste it and run the test.");
    } catch { setNotice("Validator opened. Copy the HTML embed and paste it into CODE SNIPPET."); }
  }

  function downloadJson() {
    if (!canExport) return;
    const blob = new Blob([generated.json], { type: "application/ld+json;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = "video-schema.jsonld";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
    setNotice("JSON-LD download started.");
  }

  return (
    <div className="vd-studio">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <div className="vd-hero">
        <div>
          <span className="vd-kicker">GROWUP / TECHNICAL SEO</span>
          <h2>Generate your VideoObject JSON-LD</h2>

        </div>
        <button className="vd-reset" type="button" onClick={reset}><RotateCcw size={15} /> Start fresh</button>
      </div>

      <div className="vd-workspace">
        <section className="vd-panel" aria-labelledby={idFor("editor-title")}>
          <div className="vd-panel-top"><span className="vd-index">01</span><div className="vd-heading"><span>VIDEO EDITOR</span><h3 id={idFor("editor-title")}>Your Video Details</h3><p>Use information that matches the video on your website.</p></div></div>
          <div className="vd-toolbar"><button className="vd-outline" type="button" onClick={loadExample}><Sparkles size={15}/> Load example</button></div>

          <div className="vd-section">
            <div className="vd-section-heading"><span className="vd-icon"><Film size={17}/></span><div><h4>Video information</h4><p>Add the title, description and page where viewers can watch the video.</p></div></div>
            <div className="vd-fields">
              <Field id={idFor("name")} label="Video title" mandatory value={values.name} onChange={v=>update("name",v)} placeholder="e.g. Cedar Analytics product walkthrough" />
              <div className="vd-field"><label htmlFor={idFor("description")}>Video description <span>Optional</span></label><textarea id={idFor("description")} rows={3} value={values.description} onChange={e=>update("description",e.target.value)} placeholder="A short summary of what the video covers"/><small>Describe the video itself, not just the page around it.</small></div>
              <Field id={idFor("page")} label="Watch page URL" mandatory type="url" value={values.page} onChange={v=>update("page",v)} placeholder="https://example.com/watch/walkthrough" hint="The full URL of the page where visitors can watch this video." />
              <Field id={idFor("thumb")} label="Thumbnail image URL" mandatory type="url" value={values.thumb} onChange={v=>update("thumb",v)} placeholder="https://example.com/images/walkthrough.jpg" hint="Use a public image URL for the video's thumbnail." />
            </div>
          </div>

          <div className="vd-section">
            <div className="vd-section-heading"><span className="vd-icon"><CalendarDays size={17}/></span><div><h4>Upload date and duration</h4><p>Enter when you published the video and how long it runs.</p></div></div>
            <div className="vd-fields">
              <Field id={idFor("uploaded")} label="Upload date and time" mandatory value={values.uploaded} onChange={v=>update("uploaded",v)} placeholder="2026-01-12T09:00:00+01:00" hint="Include a timezone offset, such as +01:00, or use Z for UTC." />
              <Field id={idFor("duration")} label="Video duration" mandatory value={values.duration} onChange={v=>update("duration",v)} placeholder="4:35" hint="Use m:ss for short videos or h:mm:ss for longer recordings." />
              <div className="vd-note"><Clock3 size={16}/><span>For example, 4:35 becomes PT4M35S. A recording lasting 1:02:09 becomes PT1H2M9S. The generator handles the conversion.</span></div>
            </div>
          </div>

          <div className="vd-section">
            <div className="vd-section-heading"><span className="vd-icon"><PlayCircle size={17}/></span><div><h4>Video playback</h4><p>Add at least one link that points to the player or video file.</p></div></div>
            <div className="vd-fields">
              <Field id={idFor("embed")} label="Embeddable player URL" type="url" value={values.embed} onChange={v=>update("embed",v)} placeholder="https://player.example.com/embed/walkthrough" hint="The iframe or player URL for your video (not the watch page URL)." />
              <Field id={idFor("file")} label="Direct video file URL" type="url" value={values.file} onChange={v=>update("file",v)} placeholder="https://cdn.example.com/videos/walkthrough.mp4" hint="Optional if you supplied a player URL. Use a direct link to the video file." />
              <div className="vd-note"><CircleHelp size={16}/><span>You only need one playback link. Don't paste a YouTube watch-page URL into the direct video file field.</span></div>
            </div>
          </div>
        </section>

        <section className="vd-panel vd-output" aria-labelledby={idFor("output-title")}>
          <div className="vd-panel-top"><span className="vd-index">02</span><div className="vd-heading"><span>LIVE OUTPUT</span><h3 id={idFor("output-title")}>Your Video Markup</h3><p>Check your generated schema before adding it to the watch page.</p></div></div>
          <div className="vd-ready"><div><strong>{canExport ? "Ready for your website" : "Complete your video details"}</strong><small>{canExport ? "VideoObject JSON-LD generated" : "Add the video title, watch page, thumbnail, upload time, duration and playback URL"}</small></div><span className={canExport ? "vd-pill ready" : "vd-pill"}>{canExport ? <Check size={13}/> : <CircleHelp size={13}/>} {canExport ? "Ready to export" : "In progress"}</span></div>
          <div className="vd-tabs" role="group" aria-label="Output format">
            <button type="button" aria-pressed={view === "embed"} onClick={()=>setView("embed")}><Code2 size={15}/> HTML embed</button>
            <button type="button" aria-pressed={view === "json"} onClick={()=>setView("json")}><FileJson size={15}/> JSON-LD</button>
            <button type="button" aria-pressed={view === "preview"} onClick={()=>setView("preview")}><Eye size={15}/> Video preview</button>
          </div>

          {view === "preview" ? (
            <div className="vd-preview">
              <div className="vd-preview-head"><Eye size={15}/> Video details preview</div>
              {hasStarted ? (
                <div className="vd-preview-body">
                  <div className="vd-preview-icon"><Film size={26}/></div>
                  <span className="vd-preview-provider">Video</span>
                  <h4>{values.name || "Video title"}</h4>
                  {values.description && <p className="vd-preview-description">{values.description}</p>}
                  <div className="vd-chips"><span><Clock3 size={12}/> {values.duration || "Duration not added"}</span><span>{values.uploaded ? `Uploaded ${values.uploaded.slice(0,10)}` : "Upload date not added"}</span></div>
                  {values.thumb && <div className="vd-image-caption"><ImageIcon size={15}/> Thumbnail URL added</div>}
                  <div className="vd-links">
                    {values.page && /^https?:\/\//i.test(values.page) && <a href={values.page} target="_blank" rel="noopener noreferrer">Watch page <ExternalLink size={13}/></a>}
                    {values.embed && /^https?:\/\//i.test(values.embed) && <a href={values.embed} target="_blank" rel="noopener noreferrer">Player link <ExternalLink size={13}/></a>}
                    {values.file && /^https?:\/\//i.test(values.file) && <a href={values.file} target="_blank" rel="noopener noreferrer">Video file <ExternalLink size={13}/></a>}
                  </div>
                </div>
              ) : <div className="vd-empty"><Film size={26}/><strong>Your video preview goes here</strong><p>Fill in the fields or load the example to see a preview.</p></div>}
            </div>
          ) : (
            <div className="vd-codebox"><div className="vd-codehead"><span><FileCode2 size={14}/> {view === "embed" ? "HTML / SCRIPT TAG" : "RAW JSON-LD"}</span><span>VideoObject</span></div>{canExport ? <pre tabIndex={0} aria-label="Generated video JSON-LD"><code>{selectedCode}</code></pre> : <div className="vd-code-empty"><FileCode2 size={26}/><strong>Schema will appear here</strong><p>{hasStarted ? generated.error : "Add your video details to generate the markup."}</p></div>}</div>
          )}

          <div className="vd-guidance"><CircleHelp size={16}/><p>{view === "embed" ? "Paste this script into the HTML of the page where visitors watch your video." : view === "json" ? "Use raw JSON-LD if your CMS provides a structured data field." : "This is a content preview, not an exact Google search result."}</p></div>
          <div className="vd-actions">
            {view !== "preview" && <button type="button" className="vd-primary" disabled={!canExport} onClick={copyCode}><Copy size={15}/> {view === "json" ? "Copy JSON-LD" : "Copy HTML embed"}</button>}
            <button type="button" className="vd-validate" disabled={!canExport} onClick={validateSchema}><ArrowRight size={15}/> Validate schema</button>
            <button type="button" className="vd-secondary" disabled={!canExport} onClick={downloadJson}><Download size={15}/> Download JSON-LD</button>
          </div>
          {canExport && <div className="vd-included"><strong>Included in this schema</strong><span><Check size={13}/> Video title and thumbnail</span><span><Check size={13}/> Upload time and duration</span><span><Check size={13}/> Playback URL</span></div>}
          <div className="vd-privacy"><ShieldCheck size={15}/> Your draft stays in this browser tab. No account or upload required.</div>
        </section>
      </div>
      {notice && <div className="vd-toast" role="status"><Check size={16}/>{notice}</div>}

      <style jsx global>{`


        .vd-studio{--teal:#167273;--deep:#073b3b;--ink:#011522;--muted:#667e78;--line:#dce9e5;width:100%;max-width:1240px;margin:0 auto;padding:8px 0 42px;background:#fff;color:var(--ink);font-family:"Montserrat",Arial,sans-serif!important}
        .vd-studio,.vd-studio *,.vd-studio *::before,.vd-studio *::after{box-sizing:border-box;font-family:"Montserrat",Arial,sans-serif!important}
        .vd-studio button{cursor:pointer}.vd-studio button:disabled{opacity:.45;cursor:not-allowed}.vd-studio button:focus-visible,.vd-studio input:focus-visible,.vd-studio textarea:focus-visible,.vd-studio select:focus-visible{outline:3px solid #a2ddd0;outline-offset:2px}
        .vd-studio .vd-hero{display:flex;justify-content:space-between;align-items:flex-start;gap:24px;margin-bottom:24px;background:#fff!important;border:0!important;box-shadow:none!important}
        .vd-studio .vd-kicker{font-size:10px;font-weight:800;letter-spacing:.1em;color:var(--teal)}
        .vd-studio .vd-hero h2{font-size:clamp(24px,2.6vw,34px)!important;line-height:1.2!important;letter-spacing:-.045em!important;font-weight:800!important;color:var(--ink)!important;margin:9px 0!important}
        .vd-studio .vd-hero p{font-size:13px;line-height:1.8;color:var(--muted);max-width:740px;margin:0}
        .vd-studio .vd-reset,.vd-studio .vd-outline{display:inline-flex;gap:8px;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:9px;background:#fff;color:var(--deep);padding:11px 14px;font-size:11px;font-weight:750;white-space:nowrap}.vd-studio .vd-reset:hover,.vd-studio .vd-outline:hover{background:#f2f8f5}
        .vd-studio .vd-workspace{display:grid;grid-template-columns:minmax(0,1.06fr) minmax(0,.94fr);gap:16px;align-items:start}.vd-studio .vd-panel{min-width:0;border:1px solid var(--line);border-radius:15px;background:#fff;padding:22px;box-shadow:0 6px 24px rgba(6,60,48,.025)}
        .vd-studio .vd-panel-top{display:flex;gap:12px;align-items:flex-start;margin-bottom:19px}.vd-studio .vd-index{width:30px;height:30px;flex:0 0 30px;display:grid;place-items:center;border-radius:8px;background:#e9f5f0;color:var(--teal);font-size:11px;font-weight:800}.vd-studio .vd-heading>span{display:block;color:var(--teal);font-size:9px;font-weight:800;letter-spacing:.09em;margin-bottom:5px}.vd-studio .vd-heading h3{color:var(--ink)!important;font-size:19px!important;font-weight:800!important;letter-spacing:-.03em!important;line-height:1.3!important;margin:0 0 5px!important}.vd-studio .vd-heading p{color:var(--muted);font-size:11px;line-height:1.7;margin:0}
        .vd-studio .vd-toolbar{border-bottom:1px solid #e8efeb;padding-bottom:18px;display:flex}.vd-studio .vd-section{padding:23px 0;border-bottom:1px solid #e8efeb}.vd-studio .vd-section:last-child{border-bottom:0;padding-bottom:0}.vd-studio .vd-section-heading{display:flex;gap:10px;align-items:flex-start;margin-bottom:17px}.vd-studio .vd-icon{display:grid;place-items:center;width:32px;height:32px;flex:0 0 32px;border-radius:9px;background:#eaf5ef;color:var(--teal)}.vd-studio .vd-section-heading h4{font-size:12px;font-weight:800;color:var(--ink);margin:0 0 5px}.vd-studio .vd-section-heading p{font-size:10px;line-height:1.6;color:var(--muted);margin:0}.vd-studio .vd-fields{display:grid;gap:16px}.vd-studio .vd-two{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .vd-studio .vd-field{min-width:0}.vd-studio .vd-field label{display:block;color:#294c45;font-size:10px;font-weight:800;margin:0 0 8px}.vd-studio .vd-field label span{color:#9aaea5;font-size:9px;font-weight:600;margin-left:5px}.vd-studio .vd-field input,.vd-studio .vd-field textarea,.vd-studio .vd-field select{display:block;width:100%;min-width:0;border:1px solid #d5e2dc;border-radius:8px;background:#fff;color:var(--ink);padding:12px 13px;outline:0;font-size:12px!important;line-height:1.65}.vd-studio .vd-field textarea{min-height:94px;resize:vertical}.vd-studio .vd-field input:focus,.vd-studio .vd-field textarea:focus,.vd-studio .vd-field select:focus{border-color:var(--teal);box-shadow:0 0 0 3px rgba(22,114,115,.09)}.vd-studio .vd-field input::placeholder,.vd-studio .vd-field textarea::placeholder{color:#9eafa7}.vd-studio .vd-field small{display:block;margin-top:6px;color:#839b92;font-size:9px;line-height:1.6}
        .vd-studio .vd-note{display:flex;align-items:flex-start;gap:9px;border:1px solid #dcece4;border-radius:9px;background:#f5faf7;padding:13px;color:#607f74;font-size:10px;line-height:1.7}.vd-studio .vd-note svg{flex:0 0 16px;color:var(--teal)}
        .vd-studio .vd-output{position:sticky;top:16px}.vd-studio .vd-ready{display:flex;justify-content:space-between;align-items:center;gap:12px;background:#f1f8f4;border:1px solid #dcece4;border-radius:10px;padding:14px}.vd-studio .vd-ready>div{display:grid;gap:5px}.vd-studio .vd-ready strong{font-size:11px;color:var(--deep)}.vd-studio .vd-ready small{font-size:9px;color:#719184}.vd-studio .vd-pill{display:inline-flex;align-items:center;gap:5px;white-space:nowrap;border:1px solid #d3e6dc;border-radius:30px;padding:6px 9px;background:#fff;color:#7b9187;font-size:9px;font-weight:750}.vd-studio .vd-pill.ready{color:#13734d}
        .vd-studio .vd-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px;padding:4px;margin:16px 0;background:#f2f6f4;border:1px solid #e5efea;border-radius:10px}.vd-studio .vd-tabs button{display:inline-flex;align-items:center;justify-content:center;gap:6px;background:transparent;border:0;border-radius:7px;color:#728b82;padding:11px 5px;font-size:10px;font-weight:700}.vd-studio .vd-tabs button[aria-pressed=true]{background:#fff;color:var(--deep);box-shadow:0 1px 5px #193e321a}
        .vd-studio .vd-codebox{background:#0b2029;border:1px solid #1d3a41;border-radius:11px;overflow:hidden}.vd-studio .vd-codehead{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 15px;background:#102f37;color:#b2d5cf;font-size:9px;font-weight:750;letter-spacing:.07em}.vd-studio .vd-codehead span:first-child{display:flex;align-items:center;gap:7px}.vd-studio .vd-codebox pre{min-height:230px;max-height:420px;overflow:auto;margin:0;padding:18px;color:#d8f5e8;font-size:10px;line-height:1.8;white-space:pre-wrap;overflow-wrap:anywhere}.vd-studio .vd-code-empty{min-height:230px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;padding:25px}.vd-studio .vd-code-empty svg{color:#68968b}.vd-studio .vd-code-empty strong{color:#e6faf2;font-size:12px}.vd-studio .vd-code-empty p{color:#a3bdb8;font-size:10px;line-height:1.7;max-width:280px;margin:0}
        .vd-studio .vd-preview{background:#fff;border:1px solid var(--line);border-radius:11px;min-height:245px;overflow:hidden}.vd-studio .vd-preview-head{display:flex;align-items:center;gap:7px;color:#6b857a;font-size:10px;font-weight:800;padding:13px 15px;border-bottom:1px solid #e8f0ec}.vd-studio .vd-preview-body{padding:22px;display:grid;gap:11px}.vd-studio .vd-preview-icon{width:50px;height:50px;border-radius:13px;background:#e9f5f0;color:var(--teal);display:grid;place-items:center}.vd-studio .vd-preview-provider{font-size:10px;color:var(--teal);font-weight:800}.vd-studio .vd-preview h4{font-size:18px;color:var(--ink);margin:0;font-weight:800}.vd-studio .vd-preview-body p{font-size:11px;color:var(--muted);margin:0;line-height:1.8}.vd-studio .vd-chips{display:flex;flex-wrap:wrap;gap:6px}.vd-studio .vd-chips span{border-radius:20px;background:#f1f7f4;color:#3e7565;font-size:9px;font-weight:700;padding:6px 9px}.vd-studio .vd-preview-price{font-size:21px;font-weight:850;color:var(--deep)}.vd-studio .vd-rating{display:flex;align-items:center;gap:5px;color:#a8772e;font-size:11px}.vd-studio .vd-preview ul{margin:0;padding-left:20px;color:var(--muted);font-size:10px;line-height:1.8}.vd-studio .vd-preview a{display:inline-flex;align-items:center;gap:5px;color:var(--teal);font-size:10px;font-weight:800;text-decoration:none}.vd-studio .vd-empty{min-height:220px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:10px;text-align:center;padding:24px;color:#839b90}.vd-studio .vd-empty strong{font-size:12px;color:var(--deep)}.vd-studio .vd-empty p{font-size:10px;color:var(--muted);max-width:280px;margin:0;line-height:1.7}
        .vd-studio .vd-guidance{display:flex;align-items:flex-start;gap:9px;margin:14px 0;color:#69827a}.vd-studio .vd-guidance svg{flex:0 0 16px;color:var(--teal)}.vd-studio .vd-guidance p{margin:0;font-size:10px;line-height:1.7}.vd-studio .vd-actions{display:flex;flex-wrap:wrap;gap:9px}.vd-studio .vd-primary,.vd-studio .vd-secondary,.vd-studio .vd-validate{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:39px;padding:12px 14px;border-radius:8px;font-size:10px;font-weight:800}.vd-studio .vd-primary{background:var(--deep);color:#fff;border:1px solid var(--deep)}.vd-studio .vd-primary:hover:not(:disabled){background:var(--teal)}.vd-studio .vd-secondary{background:#fff;color:var(--deep);border:1px solid var(--line)}.vd-studio .vd-validate{background:#eef7f3;color:var(--teal);border:1px solid #cce5dc}.vd-studio .vd-validate:hover:not(:disabled){background:#dff1e9}
        .vd-studio .vd-included{display:flex;flex-wrap:wrap;gap:9px;margin-top:18px;padding:14px;border:1px solid #e5ede9;border-radius:9px;background:#f8faf9}.vd-studio .vd-included strong{display:block;width:100%;font-size:10px;color:var(--deep)}.vd-studio .vd-included span{display:flex;gap:5px;align-items:center;font-size:9px;font-weight:700;color:#437b63}.vd-studio .vd-privacy{display:flex;gap:7px;align-items:flex-start;color:#83968e;font-size:9px;line-height:1.6;margin-top:19px;padding-top:14px;border-top:1px solid #e9efec}.vd-studio .vd-privacy svg{flex:0 0 15px}.vd-studio .vd-toast{position:sticky;bottom:14px;display:flex;align-items:center;gap:8px;margin:14px 0 0 auto;width:max-content;max-width:100%;padding:11px 15px;border:1px solid #b5dbcb;border-radius:9px;background:#ebf8f1;color:#135643;font-size:11px;font-weight:700;box-shadow:0 8px 22px rgba(11,71,48,.1)}
        @media(max-width:1020px){.vd-studio .vd-workspace{grid-template-columns:1fr}.vd-studio .vd-output{position:static}}
        @media(max-width:580px){.vd-studio .vd-hero{flex-direction:column;gap:14px}.vd-studio .vd-panel{padding:17px}.vd-studio .vd-two{grid-template-columns:1fr}.vd-studio .vd-tabs button{font-size:9px;gap:4px}.vd-studio .vd-tabs svg{display:none}.vd-studio .vd-actions{display:grid}.vd-studio .vd-actions button{width:100%}}
      
        .vd-studio .vd-date-error{padding:11px 13px;border:1px solid #efb8b8;border-radius:8px;background:#fff5f5;color:#a12b2b;font-size:11px;font-weight:700;line-height:1.6}
        .vd-studio .vd-image-caption{display:flex;align-items:center;gap:7px;color:#4a7d6c;font-size:10px;font-weight:700}
      
        .vd-studio .vd-preview-description{color:#667e78;font-size:11px;line-height:1.8;white-space:pre-wrap}.vd-studio .vd-error{padding:11px 13px;border:1px solid #efb8b8;border-radius:8px;background:#fff5f5;color:#a12b2b;font-size:11px;font-weight:700;line-height:1.6}.vd-studio .vd-links{display:flex;gap:12px;flex-wrap:wrap}.vd-studio .vd-field textarea{min-height:110px}.vd-studio .vd-preview-thumb{width:100%;max-height:180px;object-fit:cover;border-radius:9px;border:1px solid #e5efea}
      `}</style>
    </div>
  );
}
