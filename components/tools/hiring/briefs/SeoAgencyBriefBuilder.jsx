import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronDown, ClipboardCheck,
  Copy, Download, FileText, Plus, RotateCcw, ShieldCheck, Trash2,
} from "lucide-react";

/**
 * GrowUp — SEO agency brief builder
 * Drop-in replacement for the original SeoAgencyBriefBuilder.jsx.
 * No extra UI or CSS package required. Uses the existing ./saveBrief PDF helper.
 * Client-side only: draft is saved to sessionStorage; no data is uploaded.
 * Does not render a second page title/hero or FAQ section.
 */

const THEME = { ink: "#011522", dark: "#073b3b", teal: "#167273", pale: "#eef4f3", line: "#d6e5e1", aqua: "#75d6c1" };
const PROGRAMMES = ["Fully managed SEO", "Technical SEO recovery", "SEO strategy & advisory", "Content-led SEO growth"];
const OWNERS = ["Agency", "Internal team", "Shared responsibility", "Not decided"];
const STAGES = [
  { label: "Business context", short: "Business", heading: "Define Your Business and Target Market.", intro: "Document the key aspects of your business that agencies should consider when developing their proposed SEO strategy and scope of work." },
  { label: "Commercial outcomes", short: "Outcomes", heading: "Define what better performance looks like.", intro: "Connect the programme to measurable demand, qualified opportunities and the systems used to verify results." },
  { label: "Scope & priorities", short: "Scope", heading: "Be precise about what must be delivered.", intro: "Identify priority problems and set a clear division of responsibility before agencies start pricing." },
  { label: "Delivery & governance", short: "Delivery", heading: "Make delivery and approvals predictable.", intro: "Specify available resources, sign-off owners, meeting cadence and what counts as completed work." },
  { label: "Proposal requirements", short: "Proposal", heading: "Make every agency respond to the same brief.", intro: "Set consistent commercial and evaluation criteria so proposals can be compared fairly." },
  { label: "Review & export", short: "Export", heading: "A decision-ready brief, not a questionnaire.", intro: "Review the commercial requirements, resolve missing details and export a consistent request for proposal." },
];
const FIELDS = [
  { id: "company", step: 0, label: "Company name", required: true, placeholder: "e.g. RelayLedger" },
  { id: "website", step: 0, label: "Website", placeholder: "https://example.com" },
  { id: "product", step: 0, label: "What do you sell?", required: true, long: true, placeholder: "What the platform does, who pays for it, typical use cases and any important limitations." },
  { id: "icp", step: 0, label: "Target buyers and accounts", required: true, long: true, placeholder: "Roles, industries, company size, geography and the buying committee." },
  { id: "acv", step: 0, label: "Typical deal value / ACV", placeholder: "e.g. £18k ARR" },
  { id: "trigger", step: 0, label: "Buying triggers and objections", long: true, placeholder: "What starts a search? What makes buyers delay or reject a purchase?" },
  { id: "competitors", step: 0, label: "Competitors and alternatives", long: true, placeholder: "Vendors buyers shortlist, plus manual or in-house alternatives." },
  { id: "markets", step: 0, label: "Target markets and languages", placeholder: "e.g. UK and US; English" },

  { id: "objective", step: 1, label: "Primary commercial objective", required: true, long: true, placeholder: "e.g. Increase sales-qualified demo requests from organic search." },
  { id: "baseline", step: 1, label: "Current baseline", required: true, placeholder: "e.g. 12 qualified organic demos per month" },
  { id: "target", step: 1, label: "Target and deadline", required: true, placeholder: "e.g. 20 qualified demos/month by end of Q2" },
  { id: "qualified", step: 1, label: "What counts as a qualified lead?", long: true, placeholder: "CRM lifecycle stage, company fit, exclusions and who approves lead quality." },
  { id: "attribution", step: 1, label: "Measurement and attribution", long: true, placeholder: "GA4, GSC, CRM, account-level reporting and known data gaps." },
  { id: "secondary", step: 1, label: "Secondary indicators", placeholder: "e.g. Priority-page impressions, demo conversion, sourced opportunities" },

  { id: "programme", step: 2, label: "Programme type", required: true, kind: "select", options: PROGRAMMES },
  { id: "priorities", step: 2, label: "Priority opportunities or blockers", required: true, long: true, placeholder: "Specific page groups, technical issues, commercial content gaps and the evidence behind them." },
  { id: "existing", step: 2, label: "Existing assets and work to reuse", long: true, placeholder: "Previous audits, content, product docs, buyer research or keyword mappings." },
  { id: "publishing", step: 2, label: "Who publishes website changes?", kind: "select", options: OWNERS },
  { id: "content", step: 2, label: "Who writes and reviews content?", kind: "select", options: OWNERS },
  { id: "technical", step: 2, label: "Who implements technical fixes?", kind: "select", options: OWNERS },
  { id: "exclusions", step: 2, label: "Out of scope", long: true, placeholder: "e.g. Website migration, paid media, PR, CMS redesign, additional languages." },

  { id: "sponsor", step: 3, label: "Executive sponsor / decision owner", required: true, placeholder: "Name and role" },
  { id: "dayowner", step: 3, label: "Day-to-day marketing contact", placeholder: "Name and role" },
  { id: "expert", step: 3, label: "Product / sales SME access", placeholder: "e.g. 1 hour per fortnight with Product Marketing" },
  { id: "engineering", step: 3, label: "Engineering and CMS capacity", long: true, placeholder: "Available people, release cadence and expected lead times." },
  { id: "approvals", step: 3, label: "Approval process", long: true, placeholder: "Who signs off briefs, technical changes and claims? Expected review SLA." },
  { id: "cadence", step: 3, label: "Working and reporting cadence", kind: "select", options: ["Weekly delivery + monthly performance", "Fortnightly delivery + monthly performance", "Monthly performance review", "Propose a cadence"] },
  { id: "dependencies", step: 3, label: "Known blockers or constraints", long: true, placeholder: "Upcoming launches, procurement, legal reviews, platform migration or security requirements." },

  { id: "budget", step: 4, label: "Indicative budget", required: true, placeholder: "e.g. £4,500–£6,500 per month" },
  { id: "start", step: 4, label: "Preferred start date", placeholder: "e.g. January 2027" },
  { id: "term", step: 4, label: "Initial engagement term", kind: "select", options: ["3 months", "6 months", "12 months", "Agency to recommend"] },
  { id: "proposalDue", step: 4, label: "Proposal deadline", placeholder: "e.g. 18 December 2026" },
  { id: "reviewers", step: 4, label: "Who will evaluate proposals?", placeholder: "e.g. CMO, VP Marketing, Marketing Ops" },
  { id: "selection", step: 4, label: "What will distinguish the winning proposal?", long: true, placeholder: "e.g. Delivery team, evidence-based priorities, CRM reporting, senior ownership." },
  { id: "procurement", step: 4, label: "Procurement, legal and security requirements", long: true, placeholder: "e.g. DPA, insurance, MSA, access and data protection reviews." },
];
const WEIGHTS = [
  { id: "approach", label: "Strategy grounded in business needs", defaultWeight: 25 },
  { id: "delivery", label: "Delivery plan, capacity and ownership", defaultWeight: 25 },
  { id: "measurement", label: "Measurement and commercial accountability", defaultWeight: 20 },
  { id: "expertise", label: "Relevant SaaS experience and team", defaultWeight: 20 },
  { id: "commercial", label: "Commercial terms and transparency", defaultWeight: 10 },
];
const DEFAULT_VALUES = { programme: PROGRAMMES[0], publishing: "Shared responsibility", content: "Agency", technical: "Shared responsibility", cadence: "Weekly delivery + monthly performance", term: "3 months" };
const EXAMPLE = {
  ...DEFAULT_VALUES,
  company: "RelayLedger", website: "https://relayledger.example", product: "B2B usage-based billing software for finance and revenue operations teams. Handles usage import, billing adjustments, approval workflows and invoice controls.",
  icp: "Finance directors, CFOs and RevOps leaders at UK and US B2B SaaS companies with 50–300 employees. Finance, RevOps and Engineering participate in the buying decision.",
  acv: "£22,000 ARR", trigger: "Spreadsheet approvals and month-end reconciliations become difficult as pricing complexity grows. Objections include implementation effort, integration risk and finance-team adoption.",
  competitors: "Billing platforms, ERP modules and internal spreadsheet workflows.", markets: "UK and US; English",
  objective: "Increase sales-qualified demo requests generated by organic search.", baseline: "12 qualified organic demos/month", target: "20 qualified organic demos/month by the end of Q2 2027", qualified: "ICP-fit finance or RevOps contact who has requested a relevant product demo and is accepted as an SQL by Sales in HubSpot.",
  attribution: "Google Search Console + GA4 for search and website activity; HubSpot for SQLs, opportunities and sourced/influenced pipeline. Marketing Ops validates the monthly numbers.", secondary: "Commercial landing-page traffic; demo CTA clicks; new opportunities linked to organic", priorities: "Prioritise usage-based billing category pages, comparison pages and implementation/integration use cases. Audit crawlability and page indexing before new content production.",
  existing: "Product specs, existing sales decks, past keyword research and three months of demo-call notes.", exclusions: "Paid media, website redesign and PR campaigns.",
  sponsor: "CMO", dayowner: "Head of Content", expert: "Product Marketing: 2 hours/month. Sales Engineering: 1 hour/month.", engineering: "One engineering release window every two weeks. Agency must provide tested tickets and acceptance criteria.", approvals: "Head of Content approves briefs within 2 working days. Product Marketing verifies feature claims. Engineering approves production deployments.",
  dependencies: "No major website migration planned. Agency access requires security approval.", budget: "£4,500–£6,500/month", start: "January 2027", proposalDue: "18 December 2026", reviewers: "CMO, Head of Content and Marketing Ops", selection: "Show the first 90 days with real deliverables, named team members, ownership boundaries and evidence for the priority pages.", procurement: "DPA, MSA, references and standard security review required.",
};
const DELIVERABLES = {
  "Fully managed SEO": [
    ["Days 1–30", "Diagnosis & prioritisation", "Product/sales discovery, organic and AI visibility baselines, technical audit, commercial-page opportunity map and a ranked execution backlog."],
    ["Days 31–60", "Ship priority work", "Implement the agreed high-impact technical fixes and first commercial pages; document ownership, approvals and release QA."],
    ["Days 61–90", "Validate & expand", "Review shipped changes, search visibility, qualified enquiries and CRM opportunities; reprioritise the next quarter based on evidence."],
  ],
  "Technical SEO recovery": [
    ["Days 1–30", "Reproduce issues", "Audit affected URL templates, crawl/index signals, releases and analytics; agree severity, impact, owners and recovery baselines."],
    ["Days 31–60", "Pilot fixes", "Ship tested fixes on a representative template, define QA and rollback checks, then roll out across approved affected sections."],
    ["Days 61–90", "Verify recovery", "Re-crawl impacted URLs and track index coverage, priority landing pages, organic performance and unresolved dependencies."],
  ],
  "SEO strategy & advisory": [
    ["Days 1–30", "Audit the operating model", "Assess the backlog, in-house delivery capacity, buyer research, measurement and technical/content dependencies."],
    ["Days 31–60", "Enable delivery", "Provide prioritised briefs, implementation specifications and acceptance criteria; review team output and unblock decisions."],
    ["Days 61–90", "Review execution", "Audit what shipped, compare leading and commercial metrics, coach the team and reset the next 90-day plan."],
  ],
  "Content-led SEO growth": [
    ["Days 1–30", "Map buying decisions", "Review ICP, sales conversations, search intent, existing content and priority comparison/category/use-case opportunities."],
    ["Days 31–60", "Publish commercial assets", "Produce and QA the agreed decision-stage pages with approved product claims, internal links and conversion paths."],
    ["Days 61–90", "Optimise & measure", "Review indexing, buyer engagement, demo conversions and CRM opportunity impact; refine and plan the next content batch."],
  ],
};

const isFilled = (value) => String(value ?? "").trim().length > 0;
const clean = (value) => isFilled(value) ? String(value).trim() : "To confirm";
const readSaved = () => { try { const d = JSON.parse(sessionStorage.getItem("growup:seo-agency-brief:v2")); return d && typeof d.values === "object" ? d : null; } catch { return null; } };
const fieldsFor = (step) => FIELDS.filter(f => f.step === step);
const escapeMd = (s) => String(s).replace(/\|/g, "\\|");

function makeSections(v, weights) {
  const line = (id) => clean(v[id]);
  const rows = (ids) => ids.map(id => { const field = FIELDS.find(f => f.id === id); return `**${field.label}:** ${line(id)}`; }).join("\n\n");
  const plan = DELIVERABLES[v.programme] || DELIVERABLES[PROGRAMMES[0]];
  const responsibility = ["publishing", "content", "technical"].map(id => `${FIELDS.find(f => f.id === id).label}: ${line(id)}`).join("\n");
  return [
    { title: "01 / Business and buyer context", body: rows(["company", "website", "product", "icp", "acv", "trigger", "competitors", "markets"]) },
    { title: "02 / Commercial objectives and measurement", body: rows(["objective", "baseline", "target", "qualified", "attribution", "secondary"]) },
    { title: "03 / Programme scope and ownership", body: `**Programme:** ${line("programme")}\n\n**Priority opportunities and blockers:** ${line("priorities")}\n\n**Assets to reuse:** ${line("existing")}\n\n**Responsibility matrix**\n${responsibility}\n\n**Explicit exclusions:** ${line("exclusions")}` },
    { title: "04 / Proposed 90-day plan (agency to validate)", body: plan.map(([period, label, copy]) => `**${period} — ${label}**\n${copy}`).join("\n\n") + "\n\nAgency must state the proposed owner, approval dependencies, acceptance criteria and estimated workload for each milestone. These milestones are a starting framework, not a promise of results." },
    { title: "05 / Operating model and governance", body: rows(["sponsor", "dayowner", "expert", "engineering", "approvals", "cadence", "dependencies"]) + "\n\n**Delivery acceptance:** A deliverable counts as complete when the agreed asset or change is accessible, relevant technical/product checks pass and the named reviewer signs off. Agency reports outstanding dependencies separately." },
    { title: "06 / Pricing and proposal instructions", body: rows(["budget", "start", "term", "proposalDue", "reviewers", "selection", "procurement"]) + "\n\n**Agency must provide:** (1) a 30/60/90-day plan with priorities and evidence; (2) named senior and delivery team members; (3) monthly deliverable quantities or available hours; (4) agency vs client responsibilities; (5) price by workstream, setup fees, third-party fees and exclusions; (6) reporting sources and cadence; (7) relevant examples with attributable results; (8) risks, assumptions and proposed start date." },
    { title: "07 / Proposal evaluation scorecard", body: `Score each response from 1 (weak) to 5 (strong). Multiply the score by the weight.\n\n${weights.map(w => `- ${w.label}: ${w.weight}%`).join("\n")}\n\nEvidence matters more than slide design. Request clarification when proposals use undefined outcomes, broad delivery promises or unnamed resources.` },
  ];
}
function toMarkdown(v, sections) {
  return `# SEO agency brief — ${clean(v.company)}\n\nPrepared using GrowUp's SEO agency brief builder.\n\n${sections.map(s => `## ${s.title}\n\n${s.body}`).join("\n\n")}\n`;
}
function formQuality(v) {
  const mandatory = FIELDS.filter(f => f.required);
  const missing = mandatory.filter(f => !isFilled(v[f.id]));
  const flags = [
    { label: "Buyer and product context", ready: ["product", "icp"].every(id => isFilled(v[id])), step: 0 },
    { label: "Commercial baseline and target", ready: ["objective", "baseline", "target"].every(id => isFilled(v[id])), step: 1 },
    { label: "Qualified lead and attribution definition", ready: ["qualified", "attribution"].every(id => isFilled(v[id])), step: 1 },
    { label: "Specific priorities and delivery owners", ready: isFilled(v.priorities) && ["publishing", "content", "technical"].every(id => isFilled(v[id]) && v[id] !== "Not decided"), step: 2 },
    { label: "Approvals and delivery capacity", ready: ["approvals", "engineering"].every(id => isFilled(v[id])), step: 3 },
    { label: "Budget, decision owner and timing", ready: ["budget", "sponsor", "proposalDue"].every(id => isFilled(v[id])), step: 4 },
  ];
  return { mandatory, missing, flags, readyCount: flags.filter(f => f.ready).length };
}

function Field({ def, value, onChange }) {
  const common = { id: `gab-${def.id}`, value: value || "", onChange: e => onChange(e.target.value), "aria-label": def.label };
  return <div className={`gab-field ${def.long ? "gab-wide" : ""}`}>
    <label htmlFor={common.id}>{def.label}{def.required && <span className="gab-req">Required</span>}</label>
    {def.kind === "select" ? <select {...common}>{def.options.map(o => <option key={o}>{o}</option>)}</select>
      : def.long ? <textarea {...common} rows={3} placeholder={def.placeholder} />
      : <input {...common} placeholder={def.placeholder} />}
    {def.hint && <small>{def.hint}</small>}
  </div>;
}

function Preview({ v, stage, quality, weights, go }) {
  const plan = DELIVERABLES[v.programme] || DELIVERABLES[PROGRAMMES[0]];
  const hasGoal = isFilled(v.objective);
  return <aside className="gab-preview" aria-label="Live brief preview">
    <div className="gab-preview-head">
      <div className="gab-eyebrow light"><FileText size={13}/> LIVE AGENCY BRIEF</div>
      <h3>{clean(v.company) === "To confirm" ? "Your company" : v.company}</h3>
      <p>{v.programme || "SEO agency programme"}</p>
      <div className="gab-progress"><i style={{ width: `${quality.readyCount / quality.flags.length * 100}%` }}/></div>
      <small>{quality.readyCount} of {quality.flags.length} decision criteria covered</small>
    </div>
    <div className="gab-preview-body">
      <div className="gab-kpi-row">
        <div><b>{quality.readyCount}/{quality.flags.length}</b><span>Ready checks</span></div>
        <div><b>{quality.missing.length}</b><span>Required gaps</span></div>
        <div><b>90</b><span>Day framework</span></div>
      </div>
      <div className="gab-preview-section">
        <div className="gab-section-head"><h4>Commercial objective</h4><button onClick={() => go(1)}>Edit</button></div>
        {hasGoal ? <><p className="gab-highlight">{v.objective}</p><dl><dt>Baseline</dt><dd>{clean(v.baseline)}</dd><dt>Target</dt><dd>{clean(v.target)}</dd></dl></> : <p className="gab-empty">Define the outcome your agency is accountable for.</p>}
      </div>
      <div className="gab-preview-section">
        <div className="gab-section-head"><h4>Scope ownership</h4><button onClick={() => go(2)}>Edit</button></div>
        <dl><dt>Publishing</dt><dd>{clean(v.publishing)}</dd><dt>Content</dt><dd>{clean(v.content)}</dd><dt>Technical</dt><dd>{clean(v.technical)}</dd></dl>
      </div>
      <div className="gab-preview-section">
        <div className="gab-section-head"><h4>First 90 days</h4><button onClick={() => go(2)}>Review</button></div>
        <div className="gab-timeline">{plan.map(([time, title, copy]) => <div key={time}><span>{time}</span><strong>{title}</strong><p>{copy}</p></div>)}</div>
      </div>
      <div className="gab-preview-section">
        <div className="gab-section-head"><h4>Proposal readiness</h4><button onClick={() => go(5)}>Full review</button></div>
        <div className="gab-checks">{quality.flags.map(f => <button key={f.label} onClick={() => go(f.step)} className="gab-check"><span className={f.ready ? "ok" : "pending"}>{f.ready ? <Check size={12}/> : "!"}</span>{f.label}</button>)}</div>
      </div>
      <button className="gab-preview-action" onClick={() => go(5)}>Review the full agency brief <ArrowRight size={15}/></button>
    </div>
  </aside>;
}

export const faqs = [
  { q: "What should an SEO agency brief include?", a: "Include your product and target buyers, the commercial outcome you want, current performance, priority problems, delivery ownership, budget and decision criteria. Agencies can then recommend and price the same scope." },
  { q: "How should I compare SEO agency proposals?", a: "Use the same brief and weighted scorecard for every agency. Check their evidence, proposed team, 90-day deliverables, reporting methods, dependencies and costs before comparing prices." },
  { q: "Can I use this template without a technical SEO background?", a: "Yes. The builder explains what information to include and provides a sample. You can leave unknown technical details for agencies to investigate and confirm during discovery." },
];

export default function SeoAgencyBriefBuilder() {
  const [data, setData] = useState({ values: { ...DEFAULT_VALUES }, weights: WEIGHTS.map(w => ({ ...w, weight: w.defaultWeight })), step: 0 });
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState(-1);
  const [edits, setEdits] = useState({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const heading = useRef(null);
  useEffect(() => { const saved = readSaved(); if (saved) { setData({ values: { ...DEFAULT_VALUES, ...saved.values }, weights: Array.isArray(saved.weights) && saved.weights.length === WEIGHTS.length ? saved.weights : WEIGHTS.map(w => ({ ...w, weight: w.defaultWeight })), step: Math.max(0, Math.min(5, Number(saved.step) || 0)) }); setEdits(saved.edits || {}); } setLoaded(true); }, []);
  useEffect(() => { if (loaded) { try { sessionStorage.setItem("growup:seo-agency-brief:v2", JSON.stringify({ ...data, edits })); } catch {} } }, [loaded, data, edits]);
  const { values: v, weights, step } = data;
  const quality = useMemo(() => formQuality(v), [v]);
  const sections = useMemo(() => makeSections(v, weights).map((s, index) => ({ ...s, body: edits[index] && edits[index].source === s.body ? edits[index].text : s.body })), [v, weights, edits]);
  const percent = Math.round(quality.readyCount / quality.flags.length * 100);
  const weightTotal = weights.reduce((sum, w) => sum + Number(w.weight || 0), 0);
  function update(id, value) { setData(d => ({ ...d, values: { ...d.values, [id]: value } })); setMessage(""); }
  function go(index) { setData(d => ({ ...d, step: index })); setEditing(-1); setMessage(""); if (typeof window !== "undefined") requestAnimationFrame(() => heading.current?.focus()); }
  function reset(sample) { if (Object.keys(v).some(k => !["programme", "publishing", "content", "technical", "cadence", "term"].includes(k) && isFilled(v[k])) && !window.confirm("Replace the current brief in this tab?")) return; setData({ values: sample ? { ...EXAMPLE } : { ...DEFAULT_VALUES }, weights: WEIGHTS.map(w => ({ ...w, weight: w.defaultWeight })), step: 0 }); setEdits({}); setMessage(""); }
  const markdown = useMemo(() => toMarkdown(v, sections), [v, sections]);
  async function copyBrief() { try { await navigator.clipboard.writeText(markdown); setMessage("Complete brief copied."); } catch { setMessage("Copy was blocked by your browser. Use download instead."); } }
  function downloadMarkdown() { const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `${(v.company || "company").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}-seo-agency-brief.md`; link.click(); URL.revokeObjectURL(url); setMessage("Markdown brief downloaded."); }
  async function pdf() { if (quality.missing.length) { setMessage("Complete the required fields before exporting the PDF."); return; } setBusy(true); setMessage(""); try { const { saveBrief } = await import("./saveBrief"); await saveBrief("SEO agency brief", v.company, sections.map(s => [s.title, s.body])); setMessage("PDF exported successfully."); } catch { setMessage("PDF export could not run. Download the Markdown brief instead."); } finally { setBusy(false); } }
  function editBody(index, text) { const fresh = makeSections(v, weights)[index].body; setEdits(d => ({ ...d, [index]: { source: fresh, text } })); }
  return <div className="gab-root">
    <div className="gab-steps" role="navigation" aria-label="SEO brief steps">
      {STAGES.map((st, i) => <button type="button" className={`gab-step ${i === step ? "active" : ""} ${i < step ? "visited" : ""}`} onClick={() => go(i)} key={st.label} aria-current={step === i ? "step" : undefined}>
        <span className="gab-step-num">{i < step ? <Check size={12}/> : String(i + 1).padStart(2, "0")}</span>{st.short}
      </button>)}
    </div>
    <div className="gab-toolbar"><div className="gab-eyebrow">SEO AGENCY BRIEF BUILDER <span>·</span> STEP {step + 1} OF 6</div><div className="gab-tools"><button onClick={() => reset(true)}><Plus size={13}/> Use example</button><button onClick={() => reset(false)}><RotateCcw size={13}/> Start fresh</button></div></div>
    <div className="gab-grid">
      <main className="gab-editor" aria-label="Agency brief editor">
        <div className="gab-panel-top"><div className="gab-eyebrow">{String(step + 1).padStart(2, "0")} / {STAGES[step].label.toUpperCase()}</div><h2 ref={heading} tabIndex={-1}>{STAGES[step].heading}</h2><p>{STAGES[step].intro}</p></div>
        {step < 5 ? <>
          <div className="gab-form">
            {step === 2 && <div className="gab-guidance"><ShieldCheck size={17}/><p><strong>Scope protection:</strong> An agency should propose the work and explain why. Your brief should clarify priorities and ownership—not dictate arbitrary article or backlink quotas.</p></div>}
            {step === 4 && <div className="gab-guidance"><ClipboardCheck size={17}/><p><strong>Comparable proposals:</strong> Ask every agency to itemise what is included, excluded and dependent on your internal team.</p></div>}
            <div className="gab-fields">{fieldsFor(step).map(def => <Field key={def.id} def={def} value={v[def.id]} onChange={value => update(def.id, value)}/>)}</div>
            {step === 2 && <div className="gab-scope"><div className="gab-section-title"><h3>Proposed 90-day delivery structure</h3><p>Framework updates when you choose a programme. The agency should validate scope and milestones.</p></div>{(DELIVERABLES[v.programme] || DELIVERABLES[PROGRAMMES[0]]).map(([time,title,body]) => <div className="gab-scope-row" key={time}><span>{time}</span><div><strong>{title}</strong><p>{body}</p></div></div>)}</div>}
            {step === 4 && <div className="gab-score"><div className="gab-section-title"><h3>Proposal evaluation scorecard</h3><p>Adjust the weights to match how your team will select an agency. Total must equal 100%.</p></div><div className="gab-weight-grid">{weights.map((w, i) => <div key={w.id} className="gab-weight"><label htmlFor={`gab-weight-${w.id}`}>{w.label}</label><div><input id={`gab-weight-${w.id}`} type="number" min="0" max="100" value={w.weight} onChange={e => setData(d => ({ ...d, weights: d.weights.map((a, j) => i === j ? { ...a, weight: Math.min(100, Math.max(0, Number(e.target.value) || 0)) } : a) }))}/><span>%</span></div></div>)}</div><div className={`gab-total ${weightTotal === 100 ? "valid" : "invalid"}`}>Total weighting <strong>{weightTotal}%</strong> {weightTotal !== 100 && <span>— adjust to 100%</span>}</div></div>}
          </div>
          <div className="gab-actions">{step > 0 ? <button className="gab-btn" onClick={() => go(step - 1)}><ArrowLeft size={15}/> Back</button> : <div/>}<button className="gab-btn primary" onClick={() => go(step + 1)}>{step === 4 ? "Review agency brief" : "Continue"}<ArrowRight size={15}/></button></div>
        </> : <div className="gab-review">
          <div className="gab-review-summary"><div><span>Readiness</span><strong>{percent}%</strong><small>{quality.readyCount} of {quality.flags.length} checks complete</small></div><div><span>Required fields missing</span><strong>{quality.missing.length}</strong><small>{quality.missing.length ? "Address these before PDF export" : "All required fields completed"}</small></div><div><span>Scorecard</span><strong>{weightTotal}%</strong><small>{weightTotal === 100 ? "Weights add up correctly" : "Review weighting before sharing"}</small></div></div>
          {quality.missing.length > 0 && <div className="gab-warning"><strong>{quality.missing.length} required {quality.missing.length === 1 ? "field" : "fields"} missing</strong><p>{quality.missing.map(f => f.label).join(" · ")}</p><button onClick={() => go(quality.missing[0].step)}>Complete missing information <ArrowRight size={13}/></button></div>}
          {weightTotal !== 100 && <div className="gab-warning"><strong>Scorecard weighting is {weightTotal}%, not 100%.</strong><button onClick={() => go(4)}>Fix the scorecard <ArrowRight size={13}/></button></div>}
          <div className="gab-section-title"><h3>Final document</h3><p>Every section is editable. Changes to source fields update the corresponding document section.</p></div>
          {sections.map((s, i) => <section className="gab-document" key={s.title}><div className="gab-document-head"><h3>{s.title}</h3><button onClick={() => setEditing(editing === i ? -1 : i)}>{editing === i ? <><Check size={14}/> Done</> : <>Edit <ArrowRight size={13}/></>}</button></div>{editing === i ? <textarea aria-label={`Edit ${s.title}`} rows={10} value={s.body} onChange={e => editBody(i, e.target.value)}/> : <div className="gab-doc-text">{s.body.split("\n").map((line, k) => { if (!line.trim()) return <div className="gab-break" key={k}/>; const parts = line.split(/(\*\*[^*]+\*\*)/g); return <p key={k}>{parts.map((part,j) => part.startsWith("**") && part.endsWith("**") ? <strong key={j}>{part.slice(2,-2)}</strong> : <React.Fragment key={j}>{escapeMd(part).replace(/\\\|/g,"|")}</React.Fragment>)}</p>; })}</div>}</section>)}
          <div className="gab-export"><div><h3>Export and share your brief</h3><p>PDF for procurement or agencies; Markdown for documents and collaborative editing.</p></div><div className="gab-export-buttons"><button className="gab-btn" onClick={copyBrief}><Copy size={15}/> Copy</button><button className="gab-btn" onClick={downloadMarkdown}><FileText size={15}/> Download .md</button><button className="gab-btn primary" onClick={pdf} disabled={busy || quality.missing.length > 0 || weightTotal !== 100}><Download size={15}/>{busy ? "Preparing PDF…" : "Download PDF"}</button></div></div>
          <div className="gab-actions"><button className="gab-btn" onClick={() => go(4)}><ArrowLeft size={15}/> Back to proposal</button></div>
        </div>}
        <div className="gab-message" role="status" aria-live="polite">{message}</div>
      </main>
      <Preview v={v} stage={step} quality={quality} weights={weights} go={go}/>
    </div>
    <style>{CSS}</style>
  </div>;
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');
.gab-root, .gab-root * { box-sizing:border-box; }
.gab-root { width:100%; max-width:1320px; margin:0 auto; padding:8px 0 48px; font-family:Montserrat,system-ui,sans-serif; color:#011522; font-size:13px; line-height:1.6; }
.gab-root button,.gab-root input,.gab-root textarea,.gab-root select { font:inherit; }
.gab-root button { cursor:pointer; }
.gab-root button:disabled { cursor:not-allowed; opacity:.52; }
.gab-root button:focus-visible,.gab-root input:focus-visible,.gab-root textarea:focus-visible,.gab-root select:focus-visible {outline:3px solid #75d6c1;outline-offset:2px;}
.gab-steps { display:flex;gap:7px;overflow-x:auto;padding:7px 0 14px;border-bottom:1px solid #d6e5e1;scrollbar-width:thin; }
.gab-step { display:flex; align-items:center;gap:8px;flex:0 0 auto;min-height:39px;border:1px solid #cddfd9;border-radius:8px;background:#fff;padding:7px 11px;color:#073b3b;font-size:11.5px!important;font-weight:750!important;white-space:nowrap; }
.gab-step:hover { border-color:#167273; } .gab-step.active { background:#073b3b;border-color:#073b3b;color:white; } .gab-step.visited:not(.active) {border-color:#9ed4c7;}
.gab-step-num { display:grid;place-items:center;width:20px;height:20px;border:1px solid currentColor;border-radius:50%;font-size:9px;font-weight:800; }
.gab-toolbar {display:flex;justify-content:space-between;align-items:center;gap:12px;margin:20px 0;flex-wrap:wrap;}
.gab-eyebrow {display:flex;align-items:center;gap:7px;font-size:10px;letter-spacing:1.5px;font-weight:850;color:#167273;}
.gab-eyebrow span {color:#99b6ae;}.gab-eyebrow.light{color:#a4e7d9;font-size:9px;}
.gab-tools {display:flex;gap:18px;}.gab-tools button {display:flex;gap:5px;align-items:center;padding:4px 0;border:0;background:none;color:#167273;font-weight:700;font-size:12px;}
.gab-tools button:hover{text-decoration:underline;}
.gab-grid {display:grid;grid-template-columns:minmax(0,1.16fr) minmax(0,.84fr);gap:20px;align-items:start;}
.gab-editor {border:1px solid #d6e5e1;border-radius:15px;background:#fff;min-width:0;overflow:hidden;}
.gab-panel-top{padding:28px 28px 20px;border-bottom:1px solid #edf1ef;}
.gab-panel-top h2{font-size:25px;line-height:1.24;letter-spacing:-.9px;font-weight:850;color:#073b3b;margin:12px 0 8px;}
.gab-panel-top p {color:#59716e;font-size:12.5px;line-height:1.65;margin:0;}
.gab-form,.gab-review {padding:24px 28px 10px;}
.gab-fields {display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 14px;}
.gab-field {min-width:0;}.gab-wide{grid-column:1/-1;}
.gab-field label,.gab-weight label{display:block;font-size:11.5px;font-weight:800;line-height:1.5;color:#073b3b;margin:0 0 6px;}
.gab-req {margin-left:7px;color:#167273;font-weight:600;font-size:10px;}
.gab-field input,.gab-field textarea,.gab-field select,.gab-weight input {width:100%;border:1px solid #c3d8d1;background:#fbfdfc;color:#011522;border-radius:8px;padding:10px 11px;font-size:12px;min-height:41px;outline:none;}
.gab-field input:focus,.gab-field textarea:focus,.gab-field select:focus,.gab-weight input:focus{border-color:#167273;box-shadow:0 0 0 3px #d0f0e8;}
.gab-field input::placeholder,.gab-field textarea::placeholder{color:#829b95;opacity:1;}
.gab-field textarea {resize:vertical;min-height:95px;}
.gab-guidance{display:flex;gap:11px;background:#f1f8f5;border:1px solid #d7ebe2;padding:13px 15px;border-radius:9px;color:#167273;margin-bottom:22px;}
.gab-guidance svg{flex-shrink:0;margin-top:1px;}.gab-guidance p{font-size:11.5px;color:#315953;margin:0;}.gab-guidance strong{color:#073b3b;}
.gab-section-title{margin:28px 0 14px;padding-top:21px;border-top:1px solid #e3eee9;}
.gab-section-title h3{font-size:15px;font-weight:850;color:#073b3b;letter-spacing:-.35px;margin:0 0 4px;}.gab-section-title p{color:#647d76;font-size:11px;margin:0;}
.gab-scope-row{display:grid;grid-template-columns:94px minmax(0,1fr);gap:10px;padding:13px 0;border-top:1px solid #eaf1ee;}
.gab-scope-row span{font-size:10px;font-weight:800;color:#167273;}.gab-scope-row strong{font-size:12px;color:#073b3b;}.gab-scope-row p{font-size:11.5px;color:#57716e;margin:4px 0 0;}
.gab-weight-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px;}
.gab-weight>div{display:flex;align-items:center;gap:7px;}.gab-weight input{max-width:86px;}.gab-weight span{color:#57716e;font-weight:700;}
.gab-total{padding:13px 0;margin-top:12px;border-top:1px solid #e4efea;color:#496a64;font-size:12px;}.gab-total strong{margin-left:10px;font-size:16px;color:#073b3b;}.gab-total.invalid span{color:#a44f33;}
.gab-actions{display:flex;justify-content:space-between;gap:12px;padding:23px 28px 26px;border-top:1px solid #edf1ef;}
.gab-btn{border:1px solid #ccdeda;border-radius:8px;background:#fff;color:#073b3b;padding:10px 14px;display:inline-flex;align-items:center;justify-content:center;gap:9px;font-size:11.5px!important;font-weight:800!important;min-height:41px;}
.gab-btn:hover:not(:disabled){border-color:#167273;}.gab-btn.primary{background:#167273;border-color:#167273;color:#fff;}.gab-btn.primary:hover:not(:disabled){background:#105d5e;}
.gab-preview{border:1px solid #c9ddd7;border-radius:15px;background:#fff;min-width:0;overflow:hidden;position:sticky;top:16px;}
.gab-preview-head{background:#073b3b;color:white;padding:23px 24px 19px;}
.gab-preview-head h3{font-size:21px;font-weight:850;line-height:1.25;letter-spacing:-.6px;margin:17px 0 4px;overflow-wrap:anywhere;}
.gab-preview-head p{color:#c4e3dc;font-size:11.5px;margin:0 0 17px;}.gab-progress{width:100%;height:5px;background:#2a6159;border-radius:5px;overflow:hidden;}.gab-progress i{display:block;height:100%;background:#75d6c1;border-radius:5px;transition:width .2s;}.gab-preview-head small{display:block;font-size:10px;color:#cce5df;margin-top:7px;}
.gab-preview-body{padding:16px 20px 18px;max-height:700px;overflow-y:auto;}
.gab-kpi-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;}.gab-kpi-row>div{padding:11px 9px;border:1px solid #e0ece7;border-radius:9px;background:#fbfdfc;}.gab-kpi-row b{display:block;font-size:18px;color:#073b3b;line-height:1.1;}.gab-kpi-row span{display:block;color:#69827b;font-size:9px;margin-top:5px;}
.gab-preview-section{border-top:1px solid #e5efea;margin-top:17px;padding-top:17px;}.gab-section-head{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:10px;}.gab-section-head h4{font-size:12px;color:#073b3b;margin:0;font-weight:850;}.gab-section-head button{border:0;background:none;color:#167273;font-weight:800;font-size:10px;}
.gab-highlight{background:#eef4f3;border-radius:7px;color:#073b3b;font-size:11px;font-weight:650;padding:11px;margin:0 0 11px;overflow-wrap:anywhere;}.gab-preview-section dl{display:grid;grid-template-columns:85px 1fr;gap:6px;margin:0;}.gab-preview-section dt{font-size:10px;color:#658079;font-weight:650;}.gab-preview-section dd{font-size:10px;margin:0;color:#163e39;overflow-wrap:anywhere;}.gab-empty{color:#728982;font-size:11px;}
.gab-timeline{border-left:2px solid #d3e9e2;margin-left:4px;padding-left:14px;}.gab-timeline>div{position:relative;padding-bottom:15px;}.gab-timeline>div:last-child{padding-bottom:0;}.gab-timeline>div:before{content:"";width:8px;height:8px;position:absolute;left:-19px;top:6px;background:#167273;border-radius:50%;}.gab-timeline span{font-weight:800;color:#167273;font-size:9px;}.gab-timeline strong{display:block;color:#073b3b;font-size:11px;}.gab-timeline p{font-size:10px;line-height:1.55;color:#607971;margin:4px 0 0;}
.gab-checks{display:flex;flex-direction:column;gap:8px;}.gab-check{display:flex;gap:8px;text-align:left;align-items:flex-start;background:none;border:0;padding:0;color:#375a54;font-size:10.5px;}.gab-check>span{display:grid;place-items:center;flex-shrink:0;width:16px;height:16px;border-radius:50%;font-weight:800;font-size:10px;}.gab-check .ok{background:#def1e9;color:#167273;}.gab-check .pending{background:#f3f0e8;color:#9d7d40;}.gab-preview-action{display:flex;align-items:center;justify-content:space-between;width:100%;background:#f0f8f5;border:1px solid #d7eae3;border-radius:8px;margin-top:19px;padding:10px 12px;color:#073b3b;font-size:11px;font-weight:800;}
.gab-review{padding-bottom:20px;}.gab-review-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin-bottom:18px;}.gab-review-summary>div{background:#f3f8f6;border:1px solid #dcebe5;border-radius:9px;padding:13px;}.gab-review-summary span{display:block;font-size:9.5px;color:#617e75;font-weight:700;}.gab-review-summary strong{display:block;font-size:22px;color:#073b3b;}.gab-review-summary small{display:block;font-size:9px;color:#607b73;}
.gab-warning{background:#fffaf2;border:1px solid #eadcc5;border-radius:9px;padding:13px 15px;margin:12px 0;font-size:11px;color:#644b27;}.gab-warning strong{font-size:11.5px;}.gab-warning p{margin:5px 0;}.gab-warning button{border:0;background:none;color:#167273;font-weight:800;display:inline-flex;align-items:center;gap:6px;padding:3px 0;}
.gab-document{border-top:1px solid #e2eee9;padding:17px 0;}.gab-document-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;}.gab-document-head h3{font-size:12px;color:#073b3b;margin:0;}.gab-document-head button{display:flex;align-items:center;gap:5px;border:0;background:none;color:#167273;font-weight:800;font-size:10.5px;}.gab-doc-text{font-size:11px;line-height:1.7;color:#335550;overflow-wrap:anywhere;}.gab-doc-text p{margin:0;white-space:pre-wrap;}.gab-doc-text strong{color:#073b3b;}.gab-break{height:10px;}.gab-document textarea{width:100%;min-height:160px;border:1px solid #c3d8d1;border-radius:8px;padding:12px;font-size:11px;line-height:1.6;resize:vertical;}
.gab-export{background:#eef4f3;border:1px solid #d6e5e1;border-radius:10px;padding:17px;margin:18px 0;}.gab-export h3{font-size:14px;color:#073b3b;margin:0 0 4px;}.gab-export p{font-size:11px;color:#607971;margin:0 0 14px;}.gab-export-buttons{display:flex;gap:7px;flex-wrap:wrap;}.gab-message{padding:0 28px 14px;font-size:11px;color:#167273;min-height:15px;}
@media(max-width:980px){.gab-grid{grid-template-columns:minmax(0,1fr);}.gab-preview{position:static;}.gab-preview-body{max-height:none;}}
@media(max-width:600px){.gab-panel-top{padding:22px 18px 17px;}.gab-panel-top h2{font-size:22px;}.gab-form,.gab-review{padding:20px 18px;}.gab-actions{padding:18px;}.gab-fields,.gab-weight-grid{grid-template-columns:1fr;}.gab-wide{grid-column:auto;}.gab-review-summary{grid-template-columns:1fr 1fr;}.gab-toolbar{align-items:flex-start;}.gab-tools{gap:10px;}.gab-scope-row{grid-template-columns:75px minmax(0,1fr);}.gab-btn{padding:9px 11px;}}
`;
