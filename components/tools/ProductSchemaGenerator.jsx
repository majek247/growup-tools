"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Head from "next/head";
import {
  ArrowRight, Check, CircleHelp, Code2, Copy, Download, ExternalLink,
  Eye, FileCode2, FileJson, Laptop, RotateCcw, ShieldCheck, Plus, Trash2,
  Sparkles, Star, AlertCircle, Globe2,
} from "lucide-react";
import { address, identifier, required, amount } from "./SchemaStudio";

const EMPTY = {
  name: "", url: "", provider: "", description: "", image: "",
  category: "BusinessApplication", operatingSystem: "Web browser",
  features: "",
  plans: [{ id: 1, name: "", price: "", currency: "USD", offerUrl: "", billing: "month" }],
  rating: "", count: "",
};

const EXAMPLE = {
  name: "Cedar Analytics", url: "https://example.com/product",
  provider: "Cedar Metrics", description: "Product analytics software for B2B SaaS teams.",
  image: "", category: "BusinessApplication", operatingSystem: "Web browser",
  features: "Product dashboards\nCRM integrations\nUsage reports",
  plans: [
    { id: 1, name: "Starter", price: "0", currency: "GBP", offerUrl: "https://example.com/pricing", billing: "month" },
    { id: 2, name: "Growth", price: "49", currency: "GBP", offerUrl: "https://example.com/pricing", billing: "month" },
    { id: 3, name: "Business", price: "129", currency: "GBP", offerUrl: "https://example.com/pricing", billing: "month" },
  ],
  rating: "4.6", count: "28",
};

const CURRENCIES = ["GBP", "USD", "EUR", "NGN", "CAD", "AUD", "INR"];
const CATEGORIES = [
  { value: "BusinessApplication", label: "Business software" },
  { value: "FinanceApplication", label: "Finance software" },
  { value: "EducationalApplication", label: "Education software" },
  { value: "DeveloperApplication", label: "Developer tools" },
  { value: "ProductivityApplication", label: "Productivity software" },
  { value: "CommunicationApplication", label: "Communication software" },
  { value: "SecurityApplication", label: "Security software" },
  { value: "OtherApplication", label: "Other software" },
];

export const faqs = [
  {
    question: "Is SoftwareApplication schema suitable for B2B SaaS products?",
    answer: "Yes. SoftwareApplication schema works for B2B SaaS products, including software that runs in a web browser. You can use it to describe your product, its features, pricing and supported platforms.",
  },
  {
    question: "Where should I add SoftwareApplication JSON-LD?",
    answer: "Your SaaS product page is the best place for it. Copy the generated code and paste it into the page's HTML, ideally in the <head> section. Most platforms, including WordPress, Webflow and HubSpot, have somewhere you can add custom code without editing the whole website.",
  },

  {
    question: "How do I validate the generated software schema?",
    answer: "Click Validate schema in the generator. It'll open Schema.org Validator in a new tab. Select Code Snippet, paste the code and run the test. If there are any errors, fix them before adding the schema to your website.",
  },
];

// Keep this named export: the existing schema registry can still call build(v).
export function build(v) {
  const url = address(required(v.url, "a software page URL"), "software URL");
  const name = required(v.name, "a software name");
  const node = {
    "@type": "SoftwareApplication",
    "@id": identifier(url, "software-application"),
    name,
    url,
    description: (v.description || "").trim() || undefined,
    applicationCategory: (v.category || "").trim() || undefined,
    operatingSystem: (v.operatingSystem || "").trim() || undefined,
    image: address(v.image || "", "software image"),
    provider: (v.provider || "").trim()
      ? { "@type": "Organization", name: v.provider.trim() }
      : undefined,
    featureList: (v.features || "").split(/\r?\n/).map(s => s.trim()).filter(Boolean).join("; ") || undefined,
  };

  // Multiple public SaaS tiers become separate Offer objects.
  // Still accept legacy price fields if another part of the toolkit calls build(v).
  const plans = Array.isArray(v.plans)
    ? v.plans
    : [{ name: "", price: v.price || "", currency: v.currency || "USD", offerUrl: v.offerUrl || "", billing: "" }];
  const activePlans = plans.filter(plan =>
    [plan.name, plan.price, plan.offerUrl].some(value => String(value ?? "").trim())
  );

  if (activePlans.length > 1 && activePlans.some(plan => !String(plan.name || "").trim())) {
    throw Error("Give each pricing plan a name, such as Starter, Pro or Enterprise.");
  }

  const offers = activePlans.map((plan, index) => {
    const label = String(plan.name || `Plan ${index + 1}`).trim();
    const priceText = String(plan.price ?? "").trim();
    if (!priceText) {
      throw Error(`Enter a public price for ${label}, or remove this plan if pricing is quote-only.`);
    }
    const price = amount(priceText, `${label} price`, 0);
    const offerUrl = String(plan.offerUrl || "").trim()
      ? address(plan.offerUrl, `${label} pricing URL`)
      : url;
    const currency = plan.currency || "USD";
    const period = plan.billing || "";
    return {
      "@type": "Offer",
      name: String(plan.name || "").trim() || undefined,
      url: offerUrl,
      price,
      priceCurrency: currency,
      ...(period === "month" || period === "year"
        ? { priceSpecification: {
            "@type": "UnitPriceSpecification",
            price,
            priceCurrency: currency,
            billingDuration: period === "month" ? "P1M" : "P1Y",
          } }
        : {}),
    };
  });

  if (offers.length) node.offers = offers.length === 1 ? offers[0] : offers;

  const hasRating = (v.rating || "").trim() !== "";
  const hasCount = (v.count || "").trim() !== "";
  if (hasRating !== hasCount) {
    throw Error("Enter both the published average rating and review count, or leave both blank.");
  }
  if (hasRating) {
    node.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: amount(v.rating, "average rating", 1, 5),
      reviewCount: amount(v.count, "review count", 1, Infinity, true),
      bestRating: 5,
      worstRating: 1,
    };
  }
  return { node };
}

function Field({ id, label, value, onChange, placeholder, type = "text", hint, mandatory = false }) {
  return (
    <div className="sa-field">
      <label htmlFor={id}>{label}{mandatory && <span>Required</span>}</label>
      <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} step={type === "number" ? "any" : undefined} min={type === "number" ? "0" : undefined} />
      {hint && <small>{hint}</small>}
    </div>
  );
}

export default function SoftwareApplicationSchemaGenerator() {
  const [values, setValues] = useState(() => ({ ...EMPTY, plans: EMPTY.plans.map(p => ({ ...p })) }));
  const [view, setView] = useState("embed");
  const [notice, setNotice] = useState("");
  const uid = useId().replace(/:/g, "");
  const idFor = name => `sa-${uid}-${name}`;

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function update(field, value) {
    setValues(previous => ({ ...previous, [field]: value }));
    setNotice("");
  }
  function reset() { setValues({ ...EMPTY, plans: EMPTY.plans.map(p => ({ ...p })) }); setView("embed"); setNotice("New software entry started."); }
  function loadExample() { setValues({ ...EXAMPLE, plans: EXAMPLE.plans.map(p => ({ ...p })) }); setNotice("Example SaaS product loaded."); }
  function updatePlan(id, field, value) {
    setValues(previous => ({
      ...previous,
      plans: previous.plans.map(plan => plan.id === id ? { ...plan, [field]: value } : plan),
    }));
    setNotice("");
  }
  function addPlan() {
    setValues(previous => ({
      ...previous,
      plans: [...previous.plans, {
        id: Math.max(0, ...previous.plans.map(plan => plan.id)) + 1,
        name: "", price: "", currency: previous.plans.at(-1)?.currency || "USD", offerUrl: "", billing: "month",
      }],
    }));
  }
  function removePlan(id) {
    setValues(previous => ({
      ...previous,
      plans: previous.plans.length === 1
        ? [{ ...EMPTY.plans[0] }]
        : previous.plans.filter(plan => plan.id !== id),
    }));
    setNotice("Pricing plan removed.");
  }

  const hasStarted = Object.keys(values).some(key =>
    !["category", "operatingSystem", "plans"].includes(key) && String(values[key] || "").trim()
  ) || values.plans.some(plan => [plan.name, plan.price, plan.offerUrl].some(value => String(value || "").trim()));

  const generated = useMemo(() => {
    try {
      const node = build(values).node;
      const json = JSON.stringify({ "@context": "https://schema.org", ...node }, null, 2).replace(/</g, "\\u003c");
      return { json, embed: `<script type="application/ld+json">\n${json}\n</script>`, node, error: "" };
    } catch (error) {
      return { json: "", embed: "", node: null, error: error.message || "Check your software details." };
    }
  }, [values]);

  const canExport = Boolean(generated.node);
  const selectedCode = view === "json" ? generated.json : generated.embed;

  async function copyCode() {
    if (!canExport) return;
    try {
      await navigator.clipboard.writeText(selectedCode);
      setNotice(view === "json" ? "JSON-LD copied." : "HTML embed copied.");
    } catch { setNotice("Clipboard unavailable. Select the code and copy it manually."); }
  }

  async function validateSchema() {
    if (!canExport) return;
    // Open synchronously in the click event to avoid browser popup blockers.
    window.open("https://validator.schema.org/", "_blank", "noopener,noreferrer");
    try {
      await navigator.clipboard.writeText(generated.embed);
      setNotice("Schema copied. In Schema.org Validator, choose CODE SNIPPET, paste it and run the test.");
    } catch {
      setNotice("Schema.org Validator opened. Copy the HTML embed and paste it into CODE SNIPPET.");
    }
  }

  function downloadJson() {
    if (!canExport) return;
    const blob = new Blob([generated.json], { type: "application/ld+json;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl; a.download = "software-application-schema.jsonld";
    document.body.appendChild(a); a.click(); a.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
    setNotice("JSON-LD download started.");
  }

  return (
    <div className="sa-studio">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <div className="sa-hero">
        <div>
          <span className="sa-kicker">GROWUP / TECHNICAL SEO</span>
          <h2>Generate your SoftwareApplication JSON-LD</h2>
          <p>Add your SaaS product details, pricing and supported platforms, then copy or download the generated schema.</p>
        </div>
        <button className="sa-reset" type="button" onClick={reset}><RotateCcw size={15} /> Start fresh</button>
      </div>

      <div className="sa-workspace">
        <section className="sa-panel" aria-labelledby={idFor("editor-title")}>
          <div className="sa-panel-top">
            <span className="sa-index">01</span>
            <div className="sa-heading"><span>SOFTWARE EDITOR</span><h3 id={idFor("editor-title")}>Your Software Details</h3><p>Use information published on your software or pricing page.</p></div>
          </div>
          <div className="sa-toolbar">
            <button className="sa-outline" type="button" onClick={loadExample}><Sparkles size={15} /> Load example</button>
          </div>

          <div className="sa-section">
            <div className="sa-section-heading"><span className="sa-icon"><Laptop size={17} /></span><div><h4>Software information</h4><p>Identify the app, its provider and what it does.</p></div></div>
            <div className="sa-fields">
              <Field id={idFor("name")} label="Software name" mandatory value={values.name} onChange={v=>update("name",v)} placeholder="e.g. Cedar Analytics" />
              <Field id={idFor("url")} label="Software page URL" mandatory type="url" value={values.url} onChange={v=>update("url",v)} placeholder="https://example.com/product" />
              <Field id={idFor("provider")} label="Software provider" value={values.provider} onChange={v=>update("provider",v)} placeholder="e.g. Cedar Metrics" />
              <div className="sa-field"><label htmlFor={idFor("description")}>Software description</label><textarea id={idFor("description")} rows={3} value={values.description} onChange={e=>update("description",e.target.value)} placeholder="Explain what your app does and who it's for." /></div>
              <Field id={idFor("image")} label="Software logo or screenshot URL" type="url" value={values.image} onChange={v=>update("image",v)} placeholder="https://example.com/software.png" hint="Use a public image URL from your website." />
            </div>
          </div>

          <div className="sa-section">
            <div className="sa-section-heading"><span className="sa-icon"><Globe2 size={17} /></span><div><h4>Category & platforms</h4><p>Describe what kind of software it is and where it runs.</p></div></div>
            <div className="sa-fields">
              <div className="sa-field"><label htmlFor={idFor("category")}>Application category</label><select id={idFor("category")} value={values.category} onChange={e=>update("category",e.target.value)}>{CATEGORIES.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
              <Field id={idFor("os")} label="Supported operating systems / platforms" value={values.operatingSystem} onChange={v=>update("operatingSystem",v)} placeholder="e.g. Web browser, iOS, Android" hint="For browser-based SaaS, Web browser is appropriate." />
              <div className="sa-field"><label htmlFor={idFor("features")}>Key software features <span>Optional</span></label><textarea id={idFor("features")} rows={3} value={values.features} onChange={e=>update("features",e.target.value)} placeholder={"One feature per line\nCRM integrations\nProduct analytics dashboards"}/><small>List features shown on your actual product page.</small></div>
            </div>
          </div>

          <div className="sa-section">
            <div className="sa-section-heading"><span className="sa-icon"><FileJson size={17}/></span><div><h4>Published pricing</h4><p>Add each public plan separately. Leave this section blank if all pricing is quote-only.</p></div></div>
            <div className="sa-fields">
              {values.plans.map((plan, index) => (
                <div className="sa-plan" key={plan.id}>
                  <div className="sa-plan-head">
                    <strong>Plan {index + 1}</strong>
                    <button type="button" className="sa-plan-remove" onClick={() => removePlan(plan.id)} aria-label={`Remove plan ${index + 1}`}><Trash2 size={14}/> Remove</button>
                  </div>
                  <Field id={idFor(`plan-name-${plan.id}`)} label="Plan name" value={plan.name} onChange={v => updatePlan(plan.id, "name", v)} placeholder="e.g. Starter, Pro or Enterprise" hint="Recommended when listing more than one plan." />
                  <div className="sa-two">
                    <Field id={idFor(`plan-price-${plan.id}`)} label="Public price" type="number" value={plan.price} onChange={v => updatePlan(plan.id, "price", v)} placeholder="e.g. 49" hint="Use 0 only for a genuinely free plan." />
                    <div className="sa-field"><label htmlFor={idFor(`plan-currency-${plan.id}`)}>Currency</label><select id={idFor(`plan-currency-${plan.id}`)} value={plan.currency} onChange={e => updatePlan(plan.id, "currency", e.target.value)}>{CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                  </div>
                  <div className="sa-field"><label htmlFor={idFor(`plan-billing-${plan.id}`)}>Billing period</label><select id={idFor(`plan-billing-${plan.id}`)} value={plan.billing} onChange={e => updatePlan(plan.id, "billing", e.target.value)}><option value="month">Per month</option><option value="year">Per year</option><option value="one_time">One-time purchase</option></select></div>
                  <Field id={idFor(`plan-url-${plan.id}`)} label="Pricing page URL" type="url" value={plan.offerUrl} onChange={v => updatePlan(plan.id, "offerUrl", v)} placeholder="https://example.com/pricing" hint="Optional. Use the page where this specific plan's price is published." />
                </div>
              ))}
              <button type="button" className="sa-add-plan" onClick={addPlan}><Plus size={16}/> Add another pricing plan</button>
              <div className="sa-note"><CircleHelp size={16}/><span>Each completed plan becomes a separate Offer in your JSON-LD. Only include public prices that match your website. Leave the default plan blank if you use quote-only pricing.</span></div>
            </div>
          </div>

          <div className="sa-section">
            <div className="sa-section-heading"><span className="sa-icon"><Star size={17}/></span><div><h4>Published ratings</h4><p>Only include genuine ratings displayed for this software.</p></div></div>
            <div className="sa-fields">
              <div className="sa-two">
                <Field id={idFor("rating")} label="Average rating (1–5)" type="number" value={values.rating} onChange={v=>update("rating",v)} placeholder="e.g. 4.6" />
                <Field id={idFor("count")} label="Number of written reviews" type="number" value={values.count} onChange={v=>update("count",v)} placeholder="e.g. 28" />
              </div>
              <div className="sa-note"><ShieldCheck size={16}/><span>Both fields are optional, but must be completed together. Never invent customer reviews or ratings.</span></div>
            </div>
          </div>
        </section>

        <section className="sa-panel sa-output" aria-labelledby={idFor("output-title")}>
          <div className="sa-panel-top"><span className="sa-index">02</span><div className="sa-heading"><span>LIVE OUTPUT</span><h3 id={idFor("output-title")}>Your Software Markup</h3><p>Review the schema or copy it into your website.</p></div></div>
          <div className="sa-ready"><div><strong>{canExport ? "Ready for your website" : "Complete your software details"}</strong><small>{canExport ? "SoftwareApplication JSON-LD generated" : "Add a software name and valid URL to get started"}</small></div><span className={canExport ? "sa-pill ready" : "sa-pill"}>{canExport ? <Check size={13}/> : <CircleHelp size={13}/>} {canExport ? "Ready to export" : "In progress"}</span></div>
          <div className="sa-tabs" role="group" aria-label="Output format">
            <button type="button" aria-pressed={view === "embed"} onClick={()=>setView("embed")}><Code2 size={15}/> HTML embed</button>
            <button type="button" aria-pressed={view === "json"} onClick={()=>setView("json")}><FileJson size={15}/> JSON-LD</button>
            <button type="button" aria-pressed={view === "preview"} onClick={()=>setView("preview")}><Eye size={15}/> App preview</button>
          </div>

          {view === "preview" ? (
            <div className="sa-preview">
              <div className="sa-preview-head"><Eye size={15}/> Software details preview</div>
              {hasStarted ? (
                <div className="sa-preview-body">
                  <div className="sa-preview-icon"><Laptop size={26}/></div>
                  <span className="sa-preview-provider">{values.provider || "Software provider"}</span>
                  <h4>{values.name || "Software name"}</h4>
                  <p>{values.description || "Add a description to show what the software does."}</p>
                  <div className="sa-chips"><span>{CATEGORIES.find(c=>c.value===values.category)?.label || values.category}</span><span>{values.operatingSystem || "Platforms unspecified"}</span></div>
                  {values.plans.some(plan => String(plan.price).trim()) && (
                    <div className="sa-preview-plans">
                      {values.plans.filter(plan => String(plan.price).trim()).map(plan => (
                        <div key={plan.id} className="sa-preview-plan"><span>{plan.name || "Software plan"}</span><strong>{plan.currency} {plan.price}</strong><small>{plan.billing === "month" ? "/month" : plan.billing === "year" ? "/year" : "one-time"}</small></div>
                      ))}
                    </div>
                  )}
                  {values.rating.trim() && values.count.trim() && <div className="sa-rating"><Star size={14} fill="currentColor"/> {values.rating}/5 · {values.count} reviews</div>}
                  {values.features.trim() && <ul>{values.features.split(/\r?\n/).map(f=>f.trim()).filter(Boolean).map((f,i)=><li key={i}>{f}</li>)}</ul>}
                  {values.url && /^https?:\/\//i.test(values.url) && <a href={values.url} target="_blank" rel="noopener noreferrer">Open software page <ExternalLink size={13}/></a>}
                </div>
              ) : <div className="sa-empty"><Laptop size={26}/><strong>Your software preview goes here</strong><p>Fill in the fields or load the example to see a preview.</p></div>}
            </div>
          ) : (
            <div className="sa-codebox"><div className="sa-codehead"><span><FileCode2 size={14}/> {view === "embed" ? "HTML / SCRIPT TAG" : "RAW JSON-LD"}</span><span>SoftwareApplication</span></div>{canExport ? <pre tabIndex={0} aria-label="Generated SoftwareApplication JSON-LD"><code>{selectedCode}</code></pre> : <div className="sa-code-empty"><FileCode2 size={26}/><strong>Schema will appear here</strong><p>{hasStarted ? generated.error : "Add your software name and page URL to generate the markup."}</p></div>}</div>
          )}

          <div className="sa-guidance"><CircleHelp size={16}/><p>{view === "embed" ? "Paste this script into the HTML of the page describing your software." : view === "json" ? "Use raw JSON-LD if your CMS provides a structured data field." : "This is a content preview, not an exact Google search result."}</p></div>
          <div className="sa-actions">
            {view !== "preview" && <button type="button" className="sa-primary" disabled={!canExport} onClick={copyCode}><Copy size={15}/> {view === "json" ? "Copy JSON-LD" : "Copy HTML embed"}</button>}
            <button type="button" className="sa-validate" disabled={!canExport} onClick={validateSchema}><ArrowRight size={15}/> Validate schema</button>
            <button type="button" className="sa-secondary" disabled={!canExport} onClick={downloadJson}><Download size={15}/> Download JSON-LD</button>
          </div>
          {canExport && <div className="sa-included"><strong>Included in this schema</strong><span><Check size={13}/> Software identity</span><span><Check size={13}/> Category and platforms</span>{generated.node.offers && <span><Check size={13}/> {Array.isArray(generated.node.offers) ? `${generated.node.offers.length} pricing plans` : "Published price"}</span>}{generated.node.aggregateRating && <span><Check size={13}/> Aggregate rating</span>}</div>}
          <div className="sa-privacy"><ShieldCheck size={15}/> Your draft stays in this browser tab. No account or upload required.</div>
        </section>
      </div>
      {notice && <div className="sa-toast" role="status"><Check size={16}/>{notice}</div>}

      <style jsx global>{`
        .sa-studio{--teal:#167273;--deep:#073b3b;--ink:#011522;--muted:#667e78;--line:#dce9e5;width:100%;max-width:1240px;margin:0 auto;padding:8px 0 42px;background:#fff;color:var(--ink);font-family:"Montserrat",Arial,sans-serif!important}
        .sa-studio,.sa-studio *,.sa-studio *::before,.sa-studio *::after{box-sizing:border-box;font-family:"Montserrat",Arial,sans-serif!important}
        .sa-studio button{cursor:pointer}.sa-studio button:disabled{opacity:.45;cursor:not-allowed}.sa-studio button:focus-visible,.sa-studio input:focus-visible,.sa-studio textarea:focus-visible,.sa-studio select:focus-visible{outline:3px solid #a2ddd0;outline-offset:2px}
        .sa-studio .sa-hero{display:flex;justify-content:space-between;align-items:flex-start;gap:24px;margin-bottom:24px;background:#fff!important;border:0!important;box-shadow:none!important}
        .sa-studio .sa-kicker{font-size:10px;font-weight:800;letter-spacing:.1em;color:var(--teal)}
        .sa-studio .sa-hero h2{font-size:clamp(24px,2.6vw,34px)!important;line-height:1.2!important;letter-spacing:-.045em!important;font-weight:800!important;color:var(--ink)!important;margin:9px 0!important}
        .sa-studio .sa-hero p{font-size:13px;line-height:1.8;color:var(--muted);max-width:740px;margin:0}
        .sa-studio .sa-reset,.sa-studio .sa-outline{display:inline-flex;gap:8px;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:9px;background:#fff;color:var(--deep);padding:11px 14px;font-size:11px;font-weight:750;white-space:nowrap}.sa-studio .sa-reset:hover,.sa-studio .sa-outline:hover{background:#f2f8f5}
        .sa-studio .sa-workspace{display:grid;grid-template-columns:minmax(0,1.06fr) minmax(0,.94fr);gap:16px;align-items:start}.sa-studio .sa-panel{min-width:0;border:1px solid var(--line);border-radius:15px;background:#fff;padding:22px;box-shadow:0 6px 24px rgba(6,60,48,.025)}
        .sa-studio .sa-panel-top{display:flex;gap:12px;align-items:flex-start;margin-bottom:19px}.sa-studio .sa-index{width:30px;height:30px;flex:0 0 30px;display:grid;place-items:center;border-radius:8px;background:#e9f5f0;color:var(--teal);font-size:11px;font-weight:800}.sa-studio .sa-heading>span{display:block;color:var(--teal);font-size:9px;font-weight:800;letter-spacing:.09em;margin-bottom:5px}.sa-studio .sa-heading h3{color:var(--ink)!important;font-size:19px!important;font-weight:800!important;letter-spacing:-.03em!important;line-height:1.3!important;margin:0 0 5px!important}.sa-studio .sa-heading p{color:var(--muted);font-size:11px;line-height:1.7;margin:0}
        .sa-studio .sa-toolbar{border-bottom:1px solid #e8efeb;padding-bottom:18px;display:flex}.sa-studio .sa-section{padding:23px 0;border-bottom:1px solid #e8efeb}.sa-studio .sa-section:last-child{border-bottom:0;padding-bottom:0}.sa-studio .sa-section-heading{display:flex;gap:10px;align-items:flex-start;margin-bottom:17px}.sa-studio .sa-icon{display:grid;place-items:center;width:32px;height:32px;flex:0 0 32px;border-radius:9px;background:#eaf5ef;color:var(--teal)}.sa-studio .sa-section-heading h4{font-size:12px;font-weight:800;color:var(--ink);margin:0 0 5px}.sa-studio .sa-section-heading p{font-size:10px;line-height:1.6;color:var(--muted);margin:0}.sa-studio .sa-fields{display:grid;gap:16px}.sa-studio .sa-two{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .sa-studio .sa-field{min-width:0}.sa-studio .sa-field label{display:block;color:#294c45;font-size:10px;font-weight:800;margin:0 0 8px}.sa-studio .sa-field label span{color:#9aaea5;font-size:9px;font-weight:600;margin-left:5px}.sa-studio .sa-field input,.sa-studio .sa-field textarea,.sa-studio .sa-field select{display:block;width:100%;min-width:0;border:1px solid #d5e2dc;border-radius:8px;background:#fff;color:var(--ink);padding:12px 13px;outline:0;font-size:12px!important;line-height:1.65}.sa-studio .sa-field textarea{min-height:94px;resize:vertical}.sa-studio .sa-field input:focus,.sa-studio .sa-field textarea:focus,.sa-studio .sa-field select:focus{border-color:var(--teal);box-shadow:0 0 0 3px rgba(22,114,115,.09)}.sa-studio .sa-field input::placeholder,.sa-studio .sa-field textarea::placeholder{color:#9eafa7}.sa-studio .sa-field small{display:block;margin-top:6px;color:#839b92;font-size:9px;line-height:1.6}
        .sa-studio .sa-plan{display:grid;gap:15px;border:1px solid #dce9e5;border-radius:11px;background:#fbfdfc;padding:15px}.sa-studio .sa-plan-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.sa-studio .sa-plan-head strong{font-size:11px;color:var(--deep);font-weight:800}.sa-studio .sa-plan-remove{display:flex;align-items:center;gap:5px;color:#9b554c;border:0;background:transparent;font-size:10px;font-weight:700;padding:5px}.sa-studio .sa-plan-remove:hover{color:#bd4638}.sa-studio .sa-add-plan{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:13px;border:1px dashed #8abfb0;border-radius:9px;background:#f2faf6;color:var(--teal);font-size:11px;font-weight:800}.sa-studio .sa-add-plan:hover{background:#e5f5ee}.sa-studio .sa-preview-plans{display:grid;gap:8px}.sa-studio .sa-preview-plan{display:flex;align-items:center;gap:6px;flex-wrap:wrap;border:1px solid var(--line);border-radius:8px;padding:10px 12px}.sa-studio .sa-preview-plan span{flex:1;font-size:10px;font-weight:800;color:var(--deep)}.sa-studio .sa-preview-plan strong{font-size:12px;color:var(--deep)}.sa-studio .sa-preview-plan small{font-size:9px;color:var(--muted)}
        .sa-studio .sa-note{display:flex;align-items:flex-start;gap:9px;border:1px solid #dcece4;border-radius:9px;background:#f5faf7;padding:13px;color:#607f74;font-size:10px;line-height:1.7}.sa-studio .sa-note svg{flex:0 0 16px;color:var(--teal)}
        .sa-studio .sa-output{position:sticky;top:16px}.sa-studio .sa-ready{display:flex;justify-content:space-between;align-items:center;gap:12px;background:#f1f8f4;border:1px solid #dcece4;border-radius:10px;padding:14px}.sa-studio .sa-ready>div{display:grid;gap:5px}.sa-studio .sa-ready strong{font-size:11px;color:var(--deep)}.sa-studio .sa-ready small{font-size:9px;color:#719184}.sa-studio .sa-pill{display:inline-flex;align-items:center;gap:5px;white-space:nowrap;border:1px solid #d3e6dc;border-radius:30px;padding:6px 9px;background:#fff;color:#7b9187;font-size:9px;font-weight:750}.sa-studio .sa-pill.ready{color:#13734d}
        .sa-studio .sa-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px;padding:4px;margin:16px 0;background:#f2f6f4;border:1px solid #e5efea;border-radius:10px}.sa-studio .sa-tabs button{display:inline-flex;align-items:center;justify-content:center;gap:6px;background:transparent;border:0;border-radius:7px;color:#728b82;padding:11px 5px;font-size:10px;font-weight:700}.sa-studio .sa-tabs button[aria-pressed=true]{background:#fff;color:var(--deep);box-shadow:0 1px 5px #193e321a}
        .sa-studio .sa-codebox{background:#0b2029;border:1px solid #1d3a41;border-radius:11px;overflow:hidden}.sa-studio .sa-codehead{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 15px;background:#102f37;color:#b2d5cf;font-size:9px;font-weight:750;letter-spacing:.07em}.sa-studio .sa-codehead span:first-child{display:flex;align-items:center;gap:7px}.sa-studio .sa-codebox pre{min-height:230px;max-height:420px;overflow:auto;margin:0;padding:18px;color:#d8f5e8;font-size:10px;line-height:1.8;white-space:pre-wrap;overflow-wrap:anywhere}.sa-studio .sa-code-empty{min-height:230px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;padding:25px}.sa-studio .sa-code-empty svg{color:#68968b}.sa-studio .sa-code-empty strong{color:#e6faf2;font-size:12px}.sa-studio .sa-code-empty p{color:#a3bdb8;font-size:10px;line-height:1.7;max-width:280px;margin:0}
        .sa-studio .sa-preview{background:#fff;border:1px solid var(--line);border-radius:11px;min-height:245px;overflow:hidden}.sa-studio .sa-preview-head{display:flex;align-items:center;gap:7px;color:#6b857a;font-size:10px;font-weight:800;padding:13px 15px;border-bottom:1px solid #e8f0ec}.sa-studio .sa-preview-body{padding:22px;display:grid;gap:11px}.sa-studio .sa-preview-icon{width:50px;height:50px;border-radius:13px;background:#e9f5f0;color:var(--teal);display:grid;place-items:center}.sa-studio .sa-preview-provider{font-size:10px;color:var(--teal);font-weight:800}.sa-studio .sa-preview h4{font-size:18px;color:var(--ink);margin:0;font-weight:800}.sa-studio .sa-preview-body p{font-size:11px;color:var(--muted);margin:0;line-height:1.8}.sa-studio .sa-chips{display:flex;flex-wrap:wrap;gap:6px}.sa-studio .sa-chips span{border-radius:20px;background:#f1f7f4;color:#3e7565;font-size:9px;font-weight:700;padding:6px 9px}.sa-studio .sa-preview-price{font-size:21px;font-weight:850;color:var(--deep)}.sa-studio .sa-rating{display:flex;align-items:center;gap:5px;color:#a8772e;font-size:11px}.sa-studio .sa-preview ul{margin:0;padding-left:20px;color:var(--muted);font-size:10px;line-height:1.8}.sa-studio .sa-preview a{display:inline-flex;align-items:center;gap:5px;color:var(--teal);font-size:10px;font-weight:800;text-decoration:none}.sa-studio .sa-empty{min-height:220px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:10px;text-align:center;padding:24px;color:#839b90}.sa-studio .sa-empty strong{font-size:12px;color:var(--deep)}.sa-studio .sa-empty p{font-size:10px;color:var(--muted);max-width:280px;margin:0;line-height:1.7}
        .sa-studio .sa-guidance{display:flex;align-items:flex-start;gap:9px;margin:14px 0;color:#69827a}.sa-studio .sa-guidance svg{flex:0 0 16px;color:var(--teal)}.sa-studio .sa-guidance p{margin:0;font-size:10px;line-height:1.7}.sa-studio .sa-actions{display:flex;flex-wrap:wrap;gap:9px}.sa-studio .sa-primary,.sa-studio .sa-secondary,.sa-studio .sa-validate{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:39px;padding:12px 14px;border-radius:8px;font-size:10px;font-weight:800}.sa-studio .sa-primary{background:var(--deep);color:#fff;border:1px solid var(--deep)}.sa-studio .sa-primary:hover:not(:disabled){background:var(--teal)}.sa-studio .sa-secondary{background:#fff;color:var(--deep);border:1px solid var(--line)}.sa-studio .sa-validate{background:#eef7f3;color:var(--teal);border:1px solid #cce5dc}.sa-studio .sa-validate:hover:not(:disabled){background:#dff1e9}
        .sa-studio .sa-included{display:flex;flex-wrap:wrap;gap:9px;margin-top:18px;padding:14px;border:1px solid #e5ede9;border-radius:9px;background:#f8faf9}.sa-studio .sa-included strong{display:block;width:100%;font-size:10px;color:var(--deep)}.sa-studio .sa-included span{display:flex;gap:5px;align-items:center;font-size:9px;font-weight:700;color:#437b63}.sa-studio .sa-privacy{display:flex;gap:7px;align-items:flex-start;color:#83968e;font-size:9px;line-height:1.6;margin-top:19px;padding-top:14px;border-top:1px solid #e9efec}.sa-studio .sa-privacy svg{flex:0 0 15px}.sa-studio .sa-toast{position:sticky;bottom:14px;display:flex;align-items:center;gap:8px;margin:14px 0 0 auto;width:max-content;max-width:100%;padding:11px 15px;border:1px solid #b5dbcb;border-radius:9px;background:#ebf8f1;color:#135643;font-size:11px;font-weight:700;box-shadow:0 8px 22px rgba(11,71,48,.1)}
        @media(max-width:1020px){.sa-studio .sa-workspace{grid-template-columns:1fr}.sa-studio .sa-output{position:static}}
        @media(max-width:580px){.sa-studio .sa-hero{flex-direction:column;gap:14px}.sa-studio .sa-panel{padding:17px}.sa-studio .sa-two{grid-template-columns:1fr}.sa-studio .sa-tabs button{font-size:9px;gap:4px}.sa-studio .sa-tabs svg{display:none}.sa-studio .sa-actions{display:grid}.sa-studio .sa-actions button{width:100%}}
      `}</style>
    </div>
  );
}
