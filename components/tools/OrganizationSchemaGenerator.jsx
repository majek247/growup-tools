"use client";

import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import {
  ArrowRight, Check, CircleHelp, Code2, Copy, Download, ExternalLink,
  FileCode2, FileJson2, Globe2, Link2, RotateCcw, ShieldCheck,
  AlertCircle, Building2, Eye, Sparkles,
} from "lucide-react";
import { address, identifier, required } from "./SchemaStudio";

const EMPTY = {
  name: "", website: "", legal: "", logo: "", summary: "",
  email: "", phone: "", profiles: "",
};

const EXAMPLE = {
  name: "Cedar Metrics",
  website: "https://example.com",
  legal: "Cedar Metrics Ltd",
  logo: "https://example.com/logo.png",
  summary: "Product analytics software for B2B SaaS teams.",
  email: "support@example.com",
  phone: "",
  profiles: "https://www.linkedin.com/company/example\nhttps://www.g2.com/products/example",
};

// Keep the same export used by the existing schema registry / tests.
export function build(v) {
  const website = address(required(v.website, "the company website"), "website");
  const profiles = [
    ...new Set(
      (v.profiles || "")
        .split(/\r?\n/)
        .filter((value) => value.trim())
        .map((value) => address(value.trim(), "a profile"))
    ),
  ];
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) {
    throw Error("Check the public email address.");
  }
  return {
    node: {
      "@type": "Organization",
      "@id": identifier(website, "organization"),
      name: required(v.name, "a company name"),
      url: website,
      legalName: (v.legal || "").trim() || undefined,
      description: (v.summary || "").trim() || undefined,
      logo: address(v.logo || "", "logo"),
      email: (v.email || "").trim() || undefined,
      telephone: (v.phone || "").trim() || undefined,
      sameAs: profiles.length ? profiles : undefined,
    },
  };
}

export const faqs = [
  {
    question: "How do I generate Organization schema for my website?",
    answer: "Enter your public company name and website URL, then add any available legal name, logo, description, contact details and official profiles. The generator creates Organization JSON-LD as you type. Copy the HTML embed or download the JSON-LD file, then add it to your website and validate the published markup.",
  },
  {
    question: "Where should I add Organization schema markup?",
    answer: "Add Organization schema to your website's homepage, preferably inside the HTML <head> section. You can paste the generated JSON-LD directly into your website's code or use your CMS's custom code settings. Make sure the company name, website, logo and contact details match your actual business information.",
  },
  {
    question: "Which company profile links should I include?",
    answer: "Include your company's official LinkedIn page, software review profiles on G2 or Capterra, and other verified business listings. Paste one URL per line. Only include pages that represent your company, not individual employees or unrelated websites.",
  },
  {
    question: "What's the difference between Organization schema and LocalBusiness schema?",
    answer: "Organization schema describes a company as an entity, including its name, website, logo and official profiles. LocalBusiness schema adds details relevant to a physical business location, such as an address and opening hours. Choose the type that reflects the business and the page instead of adding extra properties that do not apply.",
  },
  {
    question: "Does Organization schema improve Google rankings or AI visibility?",
    answer: "Organization schema helps describe your company in a machine-readable format, but it does not guarantee higher Google rankings, a knowledge panel or mentions in AI search results. ",
  },
  {
    question: "How do I validate Organization JSON-LD?",
    answer: "Copy the HTML embed, open Schema.org Validator, choose its code snippet option and paste the markup. Review the reported properties and correct any errors. After publishing, also inspect your live page to confirm the structured data appears in its HTML and matches the information visitors can find on the website.",
  },
];

function Field({ id, label, value, onChange, placeholder, hint, required: isRequired, type = "text", multi = false }) {
  return (
    <div className="org-field">
      <label htmlFor={`org-${id}`}>{label} {isRequired && <span className="org-required">Required</span>}</label>
      {multi ? (
        <textarea id={`org-${id}`} value={value} onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder} rows={id === "profiles" ? 4 : 3} spellCheck={false} />
      ) : (
        <input id={`org-${id}`} type={type} value={value} onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder} spellCheck={false} />
      )}
      {hint && <small>{hint}</small>}
    </div>
  );
}

export default function OrganizationSchemaGenerator() {
  const [draft, setDraft] = useState(EMPTY);
  const [view, setView] = useState("embed");
  const [notice, setNotice] = useState("");
  const [showOptional, setShowOptional] = useState(true);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 4500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const hasStarted = Object.values(draft).some((value) => String(value).trim());
  const computed = useMemo(() => {
    if (!draft.name.trim() || !draft.website.trim()) return { json: "", error: "" };
    try {
      const { node } = build(draft);
      // JSON escapes '<' so generated values are safe inside script tags.
      const json = JSON.stringify({ "@context": "https://schema.org", ...node }, null, 2)
        .replace(/</g, "\\u003c");
      return { json, error: "" };
    } catch (error) {
      return { json: "", error: error?.message || "Check your company details." };
    }
  }, [draft]);
  const ready = Boolean(computed.json);
  const embed = ready ? `<script type="application/ld+json">\n${computed.json}\n</script>` : "";
  const selectedCode = view === "json" ? computed.json : embed;
  const profileCount = draft.profiles.split(/\r?\n/).filter((profile) => profile.trim()).length;

  function update(key, value) {
    setDraft((current) => ({ ...current, [key]: value }));
  }
  function loadExample() { setDraft(EXAMPLE); setNotice("Example loaded. Replace it with your company's details."); }
  function startFresh() { setDraft(EMPTY); setView("embed"); setNotice("Started a new Organization schema."); }
  async function copyCode() {
    if (!ready) return;
    try { await navigator.clipboard.writeText(selectedCode); setNotice(view === "json" ? "JSON-LD copied." : "HTML embed copied."); }
    catch { setNotice("Clipboard unavailable. Select the code to copy it manually."); }
  }
  function downloadJson() {
    if (!ready) return;
    const blob = new Blob([computed.json], { type: "application/ld+json;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl; link.download = "organization-schema.jsonld";
    document.body.appendChild(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
    setNotice("JSON-LD download started.");
  }
  async function validateSchema() {
    if (!ready) return;
    const win = window.open("https://validator.schema.org/", "_blank");
    if (win) win.opener = null;
    try {
      await navigator.clipboard.writeText(embed);
      setNotice("Schema copied. In Schema.org Validator, choose CODE SNIPPET, paste and run the test.");
    } catch {
      setNotice("Validator opened. Copy the HTML embed here and paste it into CODE SNIPPET.");
    }
  }

  return (
    <div className="org-studio">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>
      <div className="org-hero">
        <div>
          <span className="org-eyebrow">GROWUP / TECHNICAL SEO</span>
          <h2>Generate your Organization JSON-LD</h2>
          <p>Add your company details and official profiles, then copy or download structured data for your website.</p>
        </div>
        <button type="button" className="org-reset" onClick={startFresh}><RotateCcw size={15} /> Start fresh</button>
      </div>

      <div className="org-workspace">
        <section className="org-panel org-editor" aria-labelledby="org-editor-heading">
          <div className="org-panel-top">
            <span className="org-step">01</span>
            <div><span className="org-kicker">COMPANY DETAILS</span><h3 id="org-editor-heading">Your Organization Information</h3><p>Use the same details visitors can find on your website.</p></div>
          </div>

          <div className="org-toolbar">
            <button type="button" className="org-toolbar-btn" onClick={loadExample}><Sparkles size={15} /> Load example</button>
            <span className="org-toolbar-note"><ShieldCheck size={14} /> No account required</span>
          </div>

          <div className="org-group">
            <div className="org-group-head"><span className="org-group-icon"><Building2 size={16}/></span><div><strong>Company identity</strong><small>Start with your official name and website.</small></div></div>
            <Field id="name" label="Public company name" required value={draft.name} onChange={(value) => update("name", value)} placeholder="e.g. Cedar Metrics" />
            <Field id="website" label="Company website" required type="url" value={draft.website} onChange={(value) => update("website", value)} placeholder="https://example.com" />
            <Field id="legal" label="Registered legal name" value={draft.legal} onChange={(value) => update("legal", value)} placeholder="e.g. Cedar Metrics Ltd" hint="Leave blank if your legal and public names are the same." />
            <Field id="logo" label="Logo image URL" type="url" value={draft.logo} onChange={(value) => update("logo", value)} placeholder="https://example.com/logo.png" hint="Use the public URL of your company logo image." />
            <Field id="summary" label="Company description" multi value={draft.summary} onChange={(value) => update("summary", value)} placeholder="Briefly describe what your company does and who it serves." />
          </div>

          <div className="org-group org-extra">
            <button type="button" className="org-group-toggle" aria-expanded={showOptional} onClick={() => setShowOptional(!showOptional)}>
              <span className="org-group-icon"><Link2 size={16}/></span>
              <span><strong>Contact details & official profiles</strong><small>Optional, include only public business information.</small></span>
              <span className="org-toggle-symbol">{showOptional ? "−" : "+"}</span>
            </button>
            {showOptional && <div className="org-extra-fields">
              <Field id="email" label="Public contact email" type="email" value={draft.email} onChange={(value) => update("email", value)} placeholder="support@example.com" />
              <Field id="phone" label="Public phone number" value={draft.phone} onChange={(value) => update("phone", value)} placeholder="e.g. +44 20 1234 5678" />
              <Field id="profiles" label="Official company profile URLs" multi value={draft.profiles} onChange={(value) => update("profiles", value)} placeholder={"https://www.linkedin.com/company/example\nhttps://www.g2.com/products/example"} hint={`${profileCount} ${profileCount === 1 ? "link" : "links"} entered. Add one full URL per line.`} />
            </div>}
          </div>
          <div className="org-footnote"><ShieldCheck size={16}/><span>Only publish information that accurately represents your business. This tool does not verify ownership of the links you enter.</span></div>
        </section>

        <section className="org-panel org-output" aria-labelledby="org-output-heading">
          <div className="org-panel-top"><span className="org-step">02</span><div><span className="org-kicker">LIVE OUTPUT</span><h3 id="org-output-heading">Your Organization Markup</h3><p>Review the generated data, then copy it into your CMS.</p></div></div>
          <div className="org-status"><div><strong>{ready ? "Ready for your website" : "Add your company name and URL"}</strong><small>{ready ? "Organization JSON-LD generated from your entries" : "The markup updates automatically as you complete the fields."}</small></div><span className={ready ? "org-pill ready" : "org-pill"}>{ready ? <Check size={13}/> : <CircleHelp size={13}/>} {ready ? "Ready to export" : "In progress"}</span></div>
          {computed.error && <div className="org-error" role="alert"><AlertCircle size={15}/>{computed.error}</div>}
          <div className="org-tabs" role="group" aria-label="Output format">
            <button type="button" aria-pressed={view === "embed"} onClick={() => setView("embed")}><Code2 size={15}/> HTML embed</button>
            <button type="button" aria-pressed={view === "json"} onClick={() => setView("json")}><FileJson2 size={15}/> JSON-LD</button>
            <button type="button" aria-pressed={view === "preview"} onClick={() => setView("preview")}><Eye size={15}/> Details preview</button>
          </div>
          {view === "preview" ? (
            <div className="org-preview">
              <div className="org-preview-head"><Globe2 size={15}/> Company record preview</div>
              {!hasStarted ? <div className="org-preview-empty"><Building2 size={28}/><strong>Your company details will appear here</strong><p>Enter a company name and website URL to get started.</p></div> : <>
                <div className="org-preview-company"><div className="org-avatar">{draft.name.slice(0,1).toUpperCase() || "?"}</div><div><h4>{draft.name || "Company name not entered"}</h4><span>{draft.website || "Company website not entered"}</span></div></div>
                {draft.summary && <p className="org-summary">{draft.summary}</p>}
                <dl>{[
                  ["Legal name", draft.legal], ["Public email", draft.email], ["Phone", draft.phone], ["Logo URL", draft.logo],
                ].filter(([,value]) => Boolean(value)).map(([key,value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>
                {!!profileCount && <div className="org-profiles"><strong>Official profiles</strong>{draft.profiles.split(/\r?\n/).filter(Boolean).map((item,index)=><span key={`${item}-${index}`}>{item}</span>)}</div>}
              </>}
            </div>
          ) : <div className="org-codebox">
            <div className="org-codehead"><span><FileCode2 size={15}/> {view === "embed" ? "HTML / SCRIPT TAG" : "RAW JSON-LD"}</span><span>Organization</span></div>
            {ready ? <pre tabIndex={0} aria-label="Generated Organization schema"><code>{selectedCode}</code></pre> : <div className="org-code-empty"><FileCode2 size={27}/><strong>Schema will appear here</strong><p>{computed.error || "Enter your public company name and website URL to generate the markup."}</p></div>}
          </div>}
          <div className="org-guidance"><CircleHelp size={16}/><p>{view === "embed" ? "Add this script to the HTML of your homepage or company page." : view === "json" ? "Use this JSON-LD when your CMS provides a structured data field." : "Check that this information matches the details published on your website."}</p></div>
          <div className="org-actions">
            {view !== "preview" && <button type="button" className="org-primary" disabled={!ready} onClick={copyCode}><Copy size={15}/> {view === "json" ? "Copy JSON-LD" : "Copy HTML embed"}</button>}
            <button type="button" className="org-validate" disabled={!ready} onClick={validateSchema}><ExternalLink size={15}/> Validate schema</button>
            <button type="button" className="org-secondary" disabled={!ready} onClick={downloadJson}><Download size={15}/> Download JSON-LD</button>
          </div>
          <div className="org-privacy"><ShieldCheck size={15}/> Your draft stays in this browser tab. No upload or account required.</div>
        </section>
      </div>
      {notice && <div className="org-toast" role="status"><Check size={16}/>{notice}</div>}
      <style jsx global>{`
        .org-studio{--org-teal:#167273;--org-dark:#073b3b;--org-ink:#011522;--org-muted:#667e78;--org-line:#dce9e5;font-family:"Montserrat",Arial,sans-serif!important;color:var(--org-ink);max-width:1240px;margin:0 auto;padding:8px 0 42px;background:white}
        .org-studio,.org-studio *,.org-studio *::before,.org-studio *::after{box-sizing:border-box;font-family:"Montserrat",Arial,sans-serif!important}
        .org-studio button{font-family:inherit;cursor:pointer}.org-studio button:disabled{opacity:.43;cursor:not-allowed}.org-studio button:focus-visible,.org-studio input:focus-visible,.org-studio textarea:focus-visible{outline:3px solid #a5ded0;outline-offset:2px}
        .org-hero{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;padding:6px 0 4px;margin-bottom:24px;background:#fff!important}.org-eyebrow,.org-kicker{display:block;color:var(--org-teal);font-size:10px;font-weight:800;letter-spacing:.1em}.org-hero h2{font-size:clamp(25px,2.7vw,35px)!important;line-height:1.2!important;letter-spacing:-.045em!important;color:var(--org-ink)!important;margin:10px 0 9px!important;font-weight:800!important}.org-hero p{margin:0;max-width:710px;color:var(--org-muted);font-size:13px;line-height:1.75}.org-reset,.org-toolbar-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:white;border:1px solid var(--org-line);border-radius:9px;padding:11px 13px;color:var(--org-dark);font-size:11px;font-weight:750;white-space:nowrap}.org-reset:hover,.org-toolbar-btn:hover,.org-secondary:hover{background:#f1f8f5}
        .org-workspace{display:grid;grid-template-columns:minmax(0,1.06fr) minmax(0,.94fr);align-items:start;gap:16px}.org-panel{min-width:0;background:white;border:1px solid var(--org-line);border-radius:15px;padding:22px;box-shadow:0 6px 24px #063c3007}.org-panel-top{display:flex;gap:12px;align-items:flex-start;margin-bottom:18px}.org-step{height:30px;width:30px;flex:0 0 30px;display:grid;place-items:center;border-radius:8px;background:#e9f5f0;color:var(--org-teal);font-size:11px;font-weight:800}.org-kicker{font-size:9px;margin-bottom:5px}.org-panel-top h3{font-size:19px!important;color:var(--org-ink)!important;font-weight:800!important;letter-spacing:-.03em!important;margin:0 0 5px!important}.org-panel-top p{font-size:11px;color:var(--org-muted);line-height:1.65;margin:0}.org-toolbar{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;padding-bottom:17px;border-bottom:1px solid #e9f0ec}.org-toolbar-note{display:flex;align-items:center;gap:6px;font-size:10px;color:#7c958a}
        .org-group{padding-top:19px;display:grid;gap:14px}.org-group-head{display:flex;align-items:center;gap:10px;margin-bottom:2px}.org-group-icon{display:grid;place-items:center;width:32px;height:32px;flex:0 0 32px;background:#edf7f2;border-radius:8px;color:var(--org-teal)}.org-group-head strong,.org-group-toggle strong{font-size:12px;color:#163d35;font-weight:800}.org-group-head small,.org-group-toggle small{display:block;font-size:10px;margin-top:4px;line-height:1.5;color:#80978e}.org-field{min-width:0}.org-field label{display:block;font-size:11px;font-weight:800;color:#23443d;margin-bottom:8px}.org-required{font-size:9px;color:#95a59e;font-weight:600;margin-left:5px}.org-field input,.org-field textarea{display:block;width:100%;border:1px solid #d5e2dc;background:#fff;color:var(--org-ink);border-radius:8px;padding:12px 13px;outline:0;font-size:12px!important;line-height:1.7}.org-field textarea{resize:vertical;min-height:92px}.org-field input:focus,.org-field textarea:focus{border-color:var(--org-teal);box-shadow:0 0 0 3px #16727318}.org-field input::placeholder,.org-field textarea::placeholder{color:#a1b0aa}.org-field>small{display:block;color:#7d958a;margin-top:6px;font-size:10px;line-height:1.55}
        .org-extra{border-top:1px solid #e9f0ec;margin-top:20px;padding-top:20px;gap:0}.org-group-toggle{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:none;border:0;padding:0}.org-group-toggle>span:nth-child(2){flex:1}.org-toggle-symbol{font-size:20px;font-weight:600;color:var(--org-teal)}.org-extra-fields{display:grid;gap:14px;padding-top:18px}.org-footnote{display:flex;align-items:flex-start;gap:9px;color:#748c82;font-size:10px;line-height:1.6;margin-top:20px}.org-footnote svg{color:var(--org-teal);flex:0 0 16px}
        .org-output{position:sticky;top:16px}.org-status{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px;border:1px solid #dcece4;border-radius:10px;background:#f1f8f4}.org-status>div{min-width:0;display:grid;gap:5px}.org-status strong{font-size:11px;font-weight:800;color:var(--org-dark)}.org-status small{font-size:9px;line-height:1.5;color:#779387}.org-pill{display:inline-flex;align-items:center;gap:5px;white-space:nowrap;border:1px solid #d3e6dc;border-radius:30px;padding:6px 9px;background:white;color:#7c9488;font-size:9px;font-weight:750}.org-pill.ready{color:#13734d}.org-error{display:flex;gap:8px;align-items:center;color:#a14d29;font-size:10px;line-height:1.5;margin:12px 0}
        .org-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px;border:1px solid #e5efea;border-radius:10px;padding:4px;background:#f2f6f4;margin:16px 0}.org-tabs button{display:flex;align-items:center;justify-content:center;gap:6px;background:none;border:0;border-radius:7px;color:#718c82;padding:11px 5px;font-size:10px;font-weight:700}.org-tabs button[aria-pressed="true"]{background:white;color:var(--org-dark);box-shadow:0 1px 5px #193e321a}.org-codebox{overflow:hidden;background:#0b2029;border:1px solid #1d3a41;border-radius:11px}.org-codehead{display:flex;align-items:center;justify-content:space-between;background:#102f37;color:#b2d5cf;font-size:9px;font-weight:750;letter-spacing:.07em;padding:12px 15px}.org-codehead span:first-child{display:flex;align-items:center;gap:7px}.org-codebox pre{max-height:420px;min-height:240px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;margin:0;padding:18px;color:#d8f5e8;font-size:10px;line-height:1.8}.org-codebox code{font-family:inherit!important}.org-code-empty{display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;gap:10px;min-height:240px;padding:28px}.org-code-empty svg{color:#68968b}.org-code-empty strong{font-size:12px;color:#e6faf2}.org-code-empty p{font-size:10px;line-height:1.65;color:#a3bdb8;max-width:280px;margin:0}
        .org-preview{border:1px solid var(--org-line);border-radius:10px;min-height:240px;padding:15px;background:white}.org-preview-head{display:flex;gap:8px;align-items:center;padding-bottom:12px;border-bottom:1px solid #edf2ef;font-size:10px;font-weight:800;color:#658376}.org-preview-empty{display:flex;min-height:190px;flex-direction:column;justify-content:center;align-items:center;gap:10px;text-align:center;color:#90a99c}.org-preview-empty strong{font-size:11px;color:#23463c}.org-preview-empty p{font-size:10px;line-height:1.65;color:#82998d;margin:0}.org-preview-company{display:flex;gap:10px;align-items:center;margin-top:16px;min-width:0}.org-avatar{width:39px;height:39px;flex:0 0 39px;border-radius:10px;display:grid;place-items:center;background:#e7f5ee;color:var(--org-teal);font-size:16px;font-weight:850}.org-preview-company div:last-child{min-width:0}.org-preview-company h4{margin:0 0 5px;font-size:13px;color:var(--org-ink)}.org-preview-company span{display:block;font-size:10px;overflow-wrap:anywhere;color:#687e75}.org-summary{font-size:11px;line-height:1.75;color:#49655c}.org-preview dl{margin:15px 0 0}.org-preview dl>div{padding:10px 0;border-top:1px solid #edf2ef}.org-preview dt{font-size:9px;font-weight:800;color:#81988c}.org-preview dd{font-size:10px;line-height:1.6;color:#23473c;margin:4px 0 0;overflow-wrap:anywhere}.org-profiles{display:grid;gap:7px;border-top:1px solid #edf2ef;padding-top:12px;font-size:10px}.org-profiles>strong{font-size:10px;color:#294c43}.org-profiles span{overflow-wrap:anywhere;color:var(--org-teal)}
        .org-guidance{display:flex;align-items:flex-start;gap:9px;margin:14px 0;color:#69827a}.org-guidance svg{flex:0 0 16px;color:var(--org-teal)}.org-guidance p{font-size:10px;line-height:1.7;margin:0}.org-actions{display:flex;align-items:center;gap:9px;flex-wrap:wrap}.org-primary,.org-secondary,.org-validate{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:39px;padding:12px 14px;border-radius:8px;font-size:10px;font-weight:800}.org-primary{background:var(--org-dark);border:1px solid var(--org-dark);color:#fff}.org-primary:hover:not(:disabled){background:var(--org-teal)}.org-secondary{border:1px solid var(--org-line);background:white;color:var(--org-dark)}.org-validate{border:1px solid #cce5dc;background:#eef7f3;color:var(--org-teal)}.org-validate:hover:not(:disabled){background:#dff1e9}.org-privacy{display:flex;gap:7px;align-items:center;color:#82978e;font-size:9px;line-height:1.6;border-top:1px solid #e9efec;margin-top:19px;padding-top:14px}.org-privacy svg{flex:0 0 15px}.org-toast{position:sticky;bottom:14px;margin:14px 0 0 auto;width:max-content;max-width:100%;display:flex;align-items:center;gap:8px;padding:11px 15px;background:#ebf8f1;border:1px solid #b5dbcb;border-radius:9px;color:#135643;font-size:11px;font-weight:700;box-shadow:0 8px 22px #0b47301a}
        @media(max-width:1020px){.org-workspace{grid-template-columns:1fr}.org-output{position:static}}@media(max-width:580px){.org-hero{flex-direction:column;gap:14px}.org-panel{padding:17px}.org-tabs button{font-size:9px;gap:4px}.org-tabs button svg{display:none}.org-actions{display:grid}.org-actions button{width:100%}}
      `}</style>
    </div>
  );
}
