import React, { useEffect, useMemo, useRef, useState } from "react";
import { openSeoBriefPrintPreview } from "./seoBriefPrintPreview";
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronDown, ClipboardCheck,
     Copy, Download, FileText, Plus, RotateCcw, Trash2,
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

{
  label: "Commercial objectives",
  short: "Objectives",
  heading: "Establish Your SEO Performance Goals.",
  intro: "Specify the business results you expect from SEO and how your team will measure progress against those expectations.",
},

  
 
{
  label: "Scope & priorities",
  short: "Scope",
  heading: "Set Clear Expectations for Delivery.",
  intro: "Specify where agency involvement is required, which priorities need attention and how implementation responsibilities should be allocated.",
},


{
  label: "Delivery & governance",
  short: "Delivery",
  heading: "Establish Roles and Responsibilities.",
  intro: "Define how your internal team and the agency will work together, including who manages delivery, reviews work and approves key decisions.",
},


{
  label: "Proposal requirements",
  short: "Proposal",
  heading: "Define Your Agency Selection Criteria.",
  intro: "Specify the commercial requirements and evaluation criteria agencies should address in their proposals to support an informed selection decision.",
},

 

{
  label: "Review & export",
  short: "Export",
  heading: "Finalise Your SEO Agency Requirements.",
  intro: "Check that your business objectives, delivery expectations and proposal requirements are accurately documented before sharing the brief with shortlisted agencies.",
},




];
const FIELDS = [
  { id: "company", step: 0, label: "Company name", required: true, placeholder: "e.g. RelayLedger" },
  { id: "website", step: 0, label: "Website", placeholder: "https://example.com" },
  { id: "product", step: 0, label: "What do you sell?", required: true, long: true, placeholder: "What the platform does, who pays for it, typical use cases and any important limitations." },
  { id: "icp", step: 0, label: "Target buyers and accounts", required: true, long: true, placeholder: "Roles, industries, company size, geography and the buying committee." },
  
{
  id: "acv",
  step: 0,
  label: "Typical deal value / ACV",
  long: true,
  placeholder: "e.g. £24,000–£60,000 annually, depending on billing volume and integration requirements.",
},

  { id: "trigger", step: 0, label: "Buying triggers and objections", long: true, placeholder: "What starts a search? What makes buyers delay or reject a purchase?" },
  { id: "competitors", step: 0, label: "Competitors and alternatives", long: true, placeholder: "Vendors buyers shortlist, plus manual or in-house alternatives." },
  
{
  id: "markets",
  step: 0,
  label: "Target markets and languages",
  long: true,
  placeholder: "e.g. United Kingdom and United States. English-language website and content.",
},


  { id: "objective", step: 1, label: "Primary commercial objective", required: true, long: true, placeholder: "e.g. Increase sales-qualified demo requests from organic search." },
  { id: "qualified", step: 1, label: "What counts as a qualified lead?", long: true, placeholder: "CRM lifecycle stage, company fit, exclusions and who approves lead quality." },
  { id: "attribution", step: 1, label: "Measurement and attribution", long: true, placeholder: "GA4, GSC, CRM, account-level reporting and known data gaps." },
  
{
  id: "secondary",
  step: 1,
  label: "Secondary indicators",
  long: true,
  placeholder: "e.g. Organic traffic to commercial landing pages, demo conversion rates and sales opportunities associated with priority pages.",
},


  { id: "programme", step: 2, label: "Programme type", required: true, kind: "select", options: PROGRAMMES },
  { id: "priorities", step: 2, label: "Priority opportunities or blockers", required: true, long: true, placeholder: "Specific page groups, technical issues, commercial content gaps and the evidence behind them." },
  { id: "existing", step: 2, label: "Existing assets and work to reuse", long: true, placeholder: "Previous audits, content, product docs, buyer research or keyword mappings." },
  { id: "publishing", step: 2, label: "Who publishes website changes?", kind: "select", options: OWNERS },
  { id: "content", step: 2, label: "Who writes and reviews content?", kind: "select", options: OWNERS },
  { id: "technical", step: 2, label: "Who implements technical fixes?", kind: "select", options: OWNERS },
  { id: "exclusions", step: 2, label: "Out of scope", long: true, placeholder: "e.g. Website migration, paid media, PR, CMS redesign, additional languages." },

  { id: "sponsor", step: 3, label: "Executive sponsor / decision owner", required: true, placeholder: "Name and role" },
  { id: "dayowner", step: 3, label: "Day-to-day marketing contact", placeholder: "Name and role" },
  
{
  id: "expert",
  step: 3,
  label: "Product / sales SME access",
  long: true,
  placeholder: "e.g. Product Marketing: 2 hours/month. Sales Engineering: 1 hour/month.",
},

  { id: "engineering", step: 3, label: "Engineering and CMS capacity", long: true, placeholder: "Available people, release cadence and expected lead times." },
  { id: "approvals", step: 3, label: "Approval process", long: true, placeholder: "Who signs off briefs, technical changes and claims? Expected review SLA." },
  
{
  id: "cadence",
  step: 3,
  label: "Working and reporting cadence",
  kind: "select",
  fullWidth: true,
  options: [
    "Weekly delivery + monthly performance",
    "Fortnightly delivery + monthly performance",
    "Monthly performance review",
    "Propose a cadence",
  ],
},

  { id: "dependencies", step: 3, label: "Known blockers or constraints", long: true, placeholder: "Upcoming launches, procurement, legal reviews, platform migration or security requirements." },

  { id: "budget", step: 4, label: "Indicative budget", required: true, placeholder: "e.g. £4,500–£6,500 per month" },
  { id: "start", step: 4, label: "Preferred start date", placeholder: "e.g. January 2027" },
  { id: "term", step: 4, label: "Initial engagement term", kind: "select", options: ["3 months", "6 months", "12 months", "Agency to recommend"] },
  { id: "proposalDue", step: 4, label: "Proposal deadline", placeholder: "e.g. 18 December 2026" },
  
{
  id: "reviewers",
  step: 4,
  label: "Who will evaluate proposals?",
  fullWidth: true,
  placeholder: "e.g. CMO, VP Marketing, Marketing Ops",
},

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

  // 01 / BUSINESS CONTEXT

  company: "RelayLedger",

  website: "https://relayledger.example",

  product:
    "RelayLedger provides usage-based billing software for B2B SaaS companies. Finance and RevOps teams use it to manage customer usage data, calculate charges, review billing adjustments and prepare invoices.",

  icp:
    "Finance Directors, CFOs and Heads of Revenue Operations at UK and US SaaS companies with 100–1,000 employees, particularly those managing usage-based or hybrid subscription pricing.",

  acv:
    "£24,000–£60,000 annually, depending on billing volume and integration requirements.",

  trigger:
    "Companies typically begin evaluating software when their pricing becomes more complex or finance teams spend too much time reconciling usage data. Common objections include implementation effort, integration with existing finance systems and the cost of migrating billing workflows.",

  competitors:
    "Chargebee, Maxio, Metronome and internally developed billing systems. Some prospects continue using spreadsheets alongside their subscription management platform.",

  markets:
    "United Kingdom and United States. English-language website and content.",

  // 02 / COMMERCIAL OBJECTIVES

  objective:
    "Increase monthly organic demo requests from 12 to 20 by 30 June 2027, with at least 80% accepted as sales-qualified leads.",

  baseline:
    "12 sales-qualified demo requests per month from organic search, based on the previous three months. Approximately 25% of these opportunities progress to a sales meeting.",

  target:
    "Increase sales-qualified organic demo requests from 12 to 20 per month by the end of Q2 2027, while maintaining or improving lead quality.",

  qualified:
    "A qualified lead must come from a B2B SaaS company with 100–1,000 employees, have a relevant finance or RevOps role, and demonstrate an active requirement for billing software. Sales must accept the enquiry as an SQL in HubSpot. Students, job seekers, agencies and businesses outside our target market are excluded.",

  attribution:
    "Marketing Ops uses Google Search Console to monitor search performance, GA4 to track website engagement and demo submissions, and HubSpot to validate SQLs, opportunities and pipeline. Organic-sourced opportunities are reported separately from opportunities influenced by organic content. Results are reviewed monthly with Sales.",

  secondary:
    "Rankings for relevant category and comparison searches, demo conversion rates, and the number of sales opportunities associated with priority pages.",

  // 03 / SCOPE & PRIORITIES

  programme:
    "Fully managed SEO",

  priorities:
    "We want to attract more companies actively evaluating billing software and increase the number of qualified enquiries coming through our website. Our existing product pages aren't generating enough demos, and we need the agency to identify where improvements would make the biggest difference.",

  existing:
    "We've invested in content over the past 18 months, including product pages, competitor comparisons and educational articles. Some pages generate enquiries, but many haven't been reviewed since publication. Previous agency reports, content briefs and performance data are available.",

  publishing:
    "Shared responsibility",

  content:
    "Agency",

  technical:
    "Shared responsibility",

  exclusions:
    "Paid advertising, website redesign, brand repositioning, general PR campaigns and multilingual content production are excluded from the initial engagement. Any additional work must be proposed and approved separately.",

  // 04 / DELIVERY & GOVERNANCE

  sponsor:
    "Chief Marketing Officer (CMO). Responsible for budget approval, strategic direction and final agency selection.",

  dayowner:
    "Head of Content Marketing. Main contact for the agency, responsible for coordinating internal reviews, providing access to existing resources and managing the publishing schedule.",

  expert:
    "Product Marketing can provide up to two hours per month for product accuracy reviews and interviews. Sales Engineering can provide one hour per month for technical product questions. The Sales team can share anonymised discovery-call insights and recurring buyer objections.",

  engineering:
    "The internal engineering team has a scheduled release window every two weeks. The agency is expected to provide clearly documented technical recommendations, implementation requirements and acceptance criteria. Engineering will review and deploy approved changes. Routine CMS updates can be handled by the agency with appropriate access.",

  approvals:
    "The Head of Content Marketing reviews and approves content briefs and drafts within two working days. Product Marketing verifies feature descriptions, integrations and product claims. Engineering approves technical changes before deployment. The CMO signs off material changes to programme scope, budget or commercial priorities.",

  cadence:
    "Weekly delivery + monthly performance",

  dependencies:
    "CMS access and analytics permissions require internal approval. Product Marketing availability is limited during major releases, and engineering changes must follow the fortnightly deployment schedule. No website migration is currently planned. The agency should identify dependencies and confirm realistic delivery timelines before work begins.",

  // 05 / PROPOSAL REQUIREMENTS

  budget:
    "£4,500–£6,500 per month, excluding any separately approved development costs or third-party software fees.",

  start:
    "January 2027, subject to completing procurement, contract approval and onboarding.",

  term:
    "3 months",

  proposalDue:
    "18 December 2026",

  reviewers:
    "The CMO will lead the selection process, supported by the Head of Content Marketing and Marketing Operations. Product Marketing and Engineering may review proposals where specialist implementation requirements are involved.",

  selection:
    "The preferred agency should demonstrate relevant B2B SaaS experience, a credible approach to increasing qualified organic demand, and a clear understanding of our buyers and billing software market. Proposals will be assessed on the quality of the recommended priorities, proposed delivery team, division of responsibilities, measurement approach, relevant client results and overall commercial value.",

  procurement:
    "The selected agency must provide a master services agreement, data processing agreement, confidentiality provisions, relevant client references and a clear breakdown of fees. Any third-party costs, minimum commitments, termination terms and access requirements must be disclosed before the contract is signed.",
};



const isFilled = (value) => String(value ?? "").trim().length > 0;
const clean = (value) => isFilled(value) ? String(value).trim() : "To confirm";
const readSaved = () => { try { const d = JSON.parse(sessionStorage.getItem("growup:seo-agency-brief:v2")); return d && typeof d.values === "object" ? d : null; } catch { return null; } };
const fieldsFor = (step) => FIELDS.filter(f => f.step === step);
const escapeMd = (s) => String(s).replace(/\|/g, "\\|");

function makeSections(v) {
  const line = (id) => clean(v[id]);
  const rows = (ids) => ids.map(id => { const field = FIELDS.find(f => f.id === id); return `**${field.label}:** ${line(id)}`; }).join("\n\n");
   
  const responsibility = ["publishing", "content", "technical"].map(id => `${FIELDS.find(f => f.id === id).label}: ${line(id)}`).join("\n");
  return [
    { title: "01 / Business and buyer context", body: rows(["company", "website", "product", "icp", "acv", "trigger", "competitors", "markets"]) },
    { title: "02 / Commercial objectives and measurement", body: rows(["objective", "qualified", "attribution", "secondary"]) },
    { title: "03 / Programme scope and ownership", body: `**Programme:** ${line("programme")}\n\n**Priority opportunities and blockers:** ${line("priorities")}\n\n**Assets to reuse:** ${line("existing")}\n\n**Responsibility matrix**\n${responsibility}\n\n**Explicit exclusions:** ${line("exclusions")}` },
    { title: "04 / Operating model and governance", body: rows(["sponsor", "dayowner", "expert", "engineering", "approvals", "cadence", "dependencies"]) + "\n\n**Delivery acceptance:** A deliverable counts as complete when the agreed asset or change is accessible, relevant technical/product checks pass and the named reviewer signs off. Agency reports outstanding dependencies separately." },
    { title: "05 / Pricing and proposal instructions", body: rows(["budget", "start", "term", "proposalDue", "reviewers", "selection", "procurement"]) + "\n\n**Agency must provide:** (1) a 30/60/90-day plan with priorities and evidence; (2) named senior and delivery team members; (3) monthly deliverable quantities or available hours; (4) agency vs client responsibilities; (5) price by workstream, setup fees, third-party fees and exclusions; (6) reporting sources and cadence; (7) relevant examples with attributable results; (8) risks, assumptions and proposed start date." },
  

  ];
}
function toMarkdown(v, sections) {
  return `# SEO agency brief: ${clean(v.company)}\n\nPrepared using GrowUp's SEO agency brief builder.\n\n${sections.map(s => `## ${s.title}\n\n${s.body}`).join("\n\n")}\n`;
}
function formQuality(v) {
  const mandatory = FIELDS.filter(f => f.required);
  const missing = mandatory.filter(f => !isFilled(v[f.id]));
  const flags = [
    { label: "Buyer and product context", ready: ["product", "icp"].every(id => isFilled(v[id])), step: 0 },
    { label: "Measurable commercial objective", ready: isFilled(v.objective), step: 1 },
    { label: "Qualified lead and attribution definition", ready: ["qualified", "attribution"].every(id => isFilled(v[id])), step: 1 },
    { label: "Specific priorities and delivery owners", ready: isFilled(v.priorities) && ["publishing", "content", "technical"].every(id => isFilled(v[id]) && v[id] !== "Not decided"), step: 2 },
    { label: "Approvals and delivery capacity", ready: ["approvals", "engineering"].every(id => isFilled(v[id])), step: 3 },
    { label: "Budget, decision owner and timing", ready: ["budget", "sponsor", "proposalDue"].every(id => isFilled(v[id])), step: 4 },
  ];
  return { mandatory, missing, flags, readyCount: flags.filter(f => f.ready).length };
}

function Field({ def, value, onChange }) {
  const common = {
    id: `gab-${def.id}`,
    value: value || "",
    onChange: (e) => onChange(e.target.value),
    "aria-label": def.label,
  };

  return (
    <div className={`gab-field ${def.long || def.fullWidth ? "gab-wide" : ""}`}>
      <label htmlFor={common.id}>
        {def.label}
        {def.required && <span className="gab-req">Required</span>}
      </label>

      {def.kind === "select" ? (
        <select {...common}>
          {def.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : def.long ? (
        <textarea
          {...common}
          rows={3}
          placeholder={def.placeholder}
        />
      ) : (
        <input {...common} placeholder={def.placeholder} />
      )}

      {def.hint && <small>{def.hint}</small>}
    </div>
  );
}



function Preview({ v, stage, quality, weights, go }) {
  const groups = [
    { title: "Business context", short: "Business", step: 0 },
    { title: "Commercial objectives", short: "Objectives", step: 1 },
    { title: "Scope & priorities", short: "Scope", step: 2 },
    { title: "Delivery & governance", short: "Delivery", step: 3 },
    { title: "Proposal requirements", short: "Proposal", step: 4 },
  ];

  const countCompleted = (step) => {
    const fields = FIELDS.filter((f) => f.step === step);
    return fields.filter((f) => isFilled(v[f.id])).length;
  };

  return (
    <aside className="gab-preview" aria-label="Live agency brief">
      <div className="gab-preview-head">
        <div className="gab-eyebrow light">
          <FileText size={13} />
          LIVE AGENCY BRIEF
        </div>

        <h3>{v.company?.trim() || "Your company"}</h3>
        <p>{v.programme || "SEO agency programme"}</p>

        <div className="gab-progress">
          <i
            style={{
              width: `${
                (quality.readyCount / quality.flags.length) * 100
              }%`,
            }}
          />
        </div>

        <small>
          {quality.readyCount} of {quality.flags.length} readiness checks
          completed
        </small>
      </div>

      <div className="gab-preview-body">
        <div className="gab-document-status">
          <div>
            <strong>{quality.readyCount}/{quality.flags.length}</strong>
            <span>Readiness checks</span>
          </div>
          <div>
            <strong>{quality.missing.length}</strong>
            <span>Required fields missing</span>
          </div>
          <div>
            <strong>5</strong>
            <span>Brief sections</span>
          </div>
        </div>

        {groups.map((group) => {
          const fields = FIELDS.filter(
            (f) => f.step === group.step
          );
          const completed = countCompleted(group.step);

          return (
            <section
              className="gab-preview-group"
              key={group.step}
            >
              <div className="gab-preview-group-header">
                <div className="gab-preview-group-title">
                  <span className="gab-preview-number">
                    {String(group.step + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4>{group.title}</h4>
                    <small>
                      {completed} of {fields.length} fields completed
                    </small>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => go(group.step)}
                  aria-label={`Edit ${group.title}`}
                >
                  Edit <ArrowRight size={12} />
                </button>
              </div>

              <div className="gab-preview-field-list">
                {fields.map((field) => {
                  const value = v[field.id];
                  const filled = isFilled(value);

                  return (
                    <div
                      key={field.id}
                
className={`gab-preview-field ${
  field.long || field.fullWidth ? "wide" : ""
}`}

                    >
                      <span>{field.label}</span>
                      <p className={filled ? "" : "is-empty"}>
                        {filled ? value : "Not provided"}
                      </p>
                    </div>
                  );
                })}
              </div>

              {group.step === 4 && (
                <div className="gab-preview-scorecard">
                  <div className="gab-preview-scorecard-head">
                    <strong>Proposal evaluation scorecard</strong>
                    <span>
                      {weights.reduce(
                        (sum, w) => sum + Number(w.weight || 0),
                        0
                      )}% total
                    </span>
                  </div>

                  {weights.map((w) => (
                    <div
                      className="gab-preview-score-row"
                      key={w.id}
                    >
                      <span>{w.label}</span>
                      <strong>{w.weight}%</strong>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}

        <div className="gab-preview-footer">
          <div>
            <CheckCircle2 size={17} />
            <span>
              Your brief updates automatically as you complete each section.
            </span>
          </div>

          <button
            type="button"
            className="gab-preview-action"
            onClick={() => go(5)}
          >
            Review the full agency brief
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}





export const faqs = [
  {
    q: "Why do I need a written brief before I contact SEO agencies?",
    a: "Without a written brief, you could receive five SEO proposals with completely different deliverables, timelines and fees. A brief makes agencies respond to the same requirements, so you can compare what each is proposing, what your internal team needs to handle and what you’re actually paying for."
  },
  {
    q: "What should an SEO agency brief include for a B2B SaaS company?",
    a: "Your SEO agency brief should give agencies enough information to recommend a realistic scope of work and price it accurately. Include your product, ideal customers, current performance, commercial targets, budget and delivery constraints. Also explain who handles content, technical changes and approvals, and require agencies to provide specific deliverables, timelines and costs."
  },
  {
    q: "How do I set realistic SEO goals for an agency working with a B2B SaaS company?",
    a: "Review your last 6–12 months of organic traffic, demo requests, qualified leads and conversion rates. Identify how quickly those numbers have grown and where performance has stalled. Use that data to set a target for the next 6–12 months, accounting for your content budget, technical resources and sales cycle."
  },
  {
    q: "Should I include my SEO budget in the agency brief?",
    a: "Yes, I’d include it. If you’re planning to spend £5,000 a month on SEO, there’s little value in receiving proposals built around £10,000 retainers. Giving agencies a budget range helps them work within your constraints and show you what they’d prioritise, what they’d deliver and what might need to wait."
  },
  {
    q: "How many SEO agencies should we send this brief to?",
    a: "I’d recommend sending your brief to three to five SEO agencies. That’s usually enough to compare different approaches, pricing and experience without creating too much work for your team. Make sure you’ve checked that each agency works with B2B SaaS companies and can operate within your budget before requesting proposals."
  },
  {
    q: "How do I compare proposals from different SEO agencies fairly?",
    a: "Keep the inputs identical: same brief, same deadline, same access to ask questions, then strip out the pitch-deck polish. Compare what each agency actually commits to shipping in the first 90 days, the seniority of the delivery team, and the assumptions behind their forecasts. Weigh scope and execution ownership before looking at price, and treat any case study without pipeline or SQL attribution as unverified."
  },
  {
    q: "What red flags should we look for in an SEO agency's proposal or pitch?",
    a: "I’d be wary of any proposal that promises big results without explaining the work or resources needed to achieve them. If an agency can’t show who’s responsible for delivery, what you’ll receive each month, how results will be measured and what your team needs to contribute, I’d want those details clarified before signing anything."
  }
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
   
  
function pdf() {
  if (quality.missing.length > 0) {
    setMessage("Complete the required fields before previewing.");
    return;
  }

  if (weightTotal !== 100) {
    setMessage("Adjust the evaluation scorecard to 100%.");
    return;
  }

  try {
    openSeoBriefPrintPreview(v.company, sections);
    setMessage("Document preview opened in a new tab.");
  } catch (error) {
    setMessage(error.message || "Could not open the PDF preview.");
  }
}

  
  
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
               
             
            <div className="gab-fields">{fieldsFor(step).map(def => <Field key={def.id} def={def} value={v[def.id]} onChange={value => update(def.id, value)}/>)}</div>
             
            {step === 4 && <div className="gab-score"><div className="gab-section-title"><h3>Proposal evaluation scorecard</h3><p>Adjust the weights to match how your team will select an agency. Total must equal 100%.</p></div><div className="gab-weight-grid">{weights.map((w, i) => <div key={w.id} className="gab-weight"><label htmlFor={`gab-weight-${w.id}`}>{w.label}</label><div><input id={`gab-weight-${w.id}`} type="number" min="0" max="100" value={w.weight} onChange={e => setData(d => ({ ...d, weights: d.weights.map((a, j) => i === j ? { ...a, weight: Math.min(100, Math.max(0, Number(e.target.value) || 0)) } : a) }))}/><span>%</span></div></div>)}</div><div className={`gab-total ${weightTotal === 100 ? "valid" : "invalid"}`}>Total weighting <strong>{weightTotal}%</strong> {weightTotal !== 100 && <span>— adjust to 100%</span>}</div></div>}
          </div>
          <div className="gab-actions">{step > 0 ? <button className="gab-btn" onClick={() => go(step - 1)}><ArrowLeft size={15}/> Back</button> : <div/>}<button className="gab-btn primary" onClick={() => go(step + 1)}>{step === 4 ? "Review agency brief" : "Continue"}<ArrowRight size={15}/></button></div>
        </> : <div className="gab-review">
          <div className="gab-review-summary"><div><span>Readiness</span><strong>{percent}%</strong><small>{quality.readyCount} of {quality.flags.length} checks complete</small></div><div><span>Required fields missing</span><strong>{quality.missing.length}</strong><small>{quality.missing.length ? "Address these before PDF export" : "All required fields completed"}</small></div><div><span>Scorecard</span><strong>{weightTotal}%</strong><small>{weightTotal === 100 ? "Weights add up correctly" : "Review weighting before sharing"}</small></div></div>
          {quality.missing.length > 0 && <div className="gab-warning"><strong>{quality.missing.length} required {quality.missing.length === 1 ? "field" : "fields"} missing</strong><p>{quality.missing.map(f => f.label).join(" · ")}</p><button onClick={() => go(quality.missing[0].step)}>Complete missing information <ArrowRight size={13}/></button></div>}
          {weightTotal !== 100 && <div className="gab-warning"><strong>Scorecard weighting is {weightTotal}%, not 100%.</strong><button onClick={() => go(4)}>Fix the scorecard <ArrowRight size={13}/></button></div>}
          <div className="gab-section-title"><h3>Final document</h3><p>Every section is editable. Changes to source fields update the corresponding document section.</p></div>
          {sections.map((s, i) => <section className="gab-document" key={s.title}><div className="gab-document-head"><h3>{s.title}</h3><button onClick={() => setEditing(editing === i ? -1 : i)}>{editing === i ? <><Check size={14}/> Done</> : <>Edit <ArrowRight size={13}/></>}</button></div>{editing === i ? <textarea aria-label={`Edit ${s.title}`} rows={10} value={s.body} onChange={e => editBody(i, e.target.value)}/> : <div className="gab-doc-text">{s.body.split("\n").map((line, k) => { if (!line.trim()) return <div className="gab-break" key={k}/>; const parts = line.split(/(\*\*[^*]+\*\*)/g); return <p key={k}>{parts.map((part,j) => part.startsWith("**") && part.endsWith("**") ? <strong key={j}>{part.slice(2,-2)}</strong> : <React.Fragment key={j}>{escapeMd(part).replace(/\\\|/g,"|")}</React.Fragment>)}</p>; })}</div>}</section>)}
          
<div className="gab-export">
  <div>
    <h3>Export and Share Your Brief</h3>
    <p>
      Review your completed brief, then copy or save it as a PDF
      to share with prospective agencies.
    </p>
  </div>

  <div className="gab-export-buttons">
    <button
      type="button"
      className="gab-btn"
      onClick={copyBrief}
    >
      <Copy size={15} />
      Copy Brief
    </button>

    <button
      type="button"
      className="gab-btn primary"
      onClick={pdf}
      disabled={busy || quality.missing.length > 0 || weightTotal !== 100}
    >
      <Download size={15} />
      Download PDF
    </button>
  </div>
</div>

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
 
 
.gab-section-title{margin:28px 0 14px;padding-top:21px;border-top:1px solid #e3eee9;}
.gab-section-title h3{font-size:15px;font-weight:850;color:#073b3b;letter-spacing:-.35px;margin:0 0 4px;}.gab-section-title p{color:#647d76;font-size:11px;margin:0;}
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
.gab-preview-body{
  padding:20px;
  max-height:750px;
  overflow-y:auto;
  scrollbar-width:thin;
  scrollbar-color:#bdd8d0 transparent;
}
.gab-kpi-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;}.gab-kpi-row>div{padding:11px 9px;border:1px solid #e0ece7;border-radius:9px;background:#fbfdfc;}.gab-kpi-row b{display:block;font-size:18px;color:#073b3b;line-height:1.1;}.gab-kpi-row span{display:block;color:#69827b;font-size:9px;margin-top:5px;}
.gab-preview-section{border-top:1px solid #e5efea;margin-top:17px;padding-top:17px;}.gab-section-head{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:10px;}.gab-section-head h4{font-size:12px;color:#073b3b;margin:0;font-weight:850;}.gab-section-head button{border:0;background:none;color:#167273;font-weight:800;font-size:10px;}
.gab-highlight{background:#eef4f3;border-radius:7px;color:#073b3b;font-size:11px;font-weight:650;padding:11px;margin:0 0 11px;overflow-wrap:anywhere;}.gab-preview-section dl{display:grid;grid-template-columns:85px 1fr;gap:6px;margin:0;}.gab-preview-section dt{font-size:10px;color:#658079;font-weight:650;}.gab-preview-section dd{font-size:10px;margin:0;color:#163e39;overflow-wrap:anywhere;}.gab-empty{color:#728982;font-size:11px;}
   
.gab-checks{display:flex;flex-direction:column;gap:8px;}.gab-check{display:flex;gap:8px;text-align:left;align-items:flex-start;background:none;border:0;padding:0;color:#375a54;font-size:10.5px;}.gab-check>span{display:grid;place-items:center;flex-shrink:0;width:16px;height:16px;border-radius:50%;font-weight:800;font-size:10px;}.gab-check .ok{background:#def1e9;color:#167273;}.gab-check .pending{background:#f3f0e8;color:#9d7d40;}.gab-preview-action{display:flex;align-items:center;justify-content:space-between;width:100%;background:#f0f8f5;border:1px solid #d7eae3;border-radius:8px;margin-top:19px;padding:10px 12px;color:#073b3b;font-size:11px;font-weight:800;}
.gab-review{padding-bottom:20px;}.gab-review-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin-bottom:18px;}.gab-review-summary>div{background:#f3f8f6;border:1px solid #dcebe5;border-radius:9px;padding:13px;}.gab-review-summary span{display:block;font-size:9.5px;color:#617e75;font-weight:700;}.gab-review-summary strong{display:block;font-size:22px;color:#073b3b;}.gab-review-summary small{display:block;font-size:9px;color:#607b73;}
.gab-warning{background:#fffaf2;border:1px solid #eadcc5;border-radius:9px;padding:13px 15px;margin:12px 0;font-size:11px;color:#644b27;}.gab-warning strong{font-size:11.5px;}.gab-warning p{margin:5px 0;}.gab-warning button{border:0;background:none;color:#167273;font-weight:800;display:inline-flex;align-items:center;gap:6px;padding:3px 0;}
.gab-document{border-top:1px solid #e2eee9;padding:17px 0;}.gab-document-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;}.gab-document-head h3{font-size:12px;color:#073b3b;margin:0;}.gab-document-head button{display:flex;align-items:center;gap:5px;border:0;background:none;color:#167273;font-weight:800;font-size:10.5px;}.gab-doc-text{font-size:11px;line-height:1.7;color:#335550;overflow-wrap:anywhere;}.gab-doc-text p{margin:0;white-space:pre-wrap;}.gab-doc-text strong{color:#073b3b;}.gab-break{height:10px;}.gab-document textarea{width:100%;min-height:160px;border:1px solid #c3d8d1;border-radius:8px;padding:12px;font-size:11px;line-height:1.6;resize:vertical;}
.gab-export{background:#eef4f3;border:1px solid #d6e5e1;border-radius:10px;padding:17px;margin:18px 0;}.gab-export h3{font-size:14px;color:#073b3b;margin:0 0 4px;}.gab-export p{font-size:11px;color:#607971;margin:0 0 14px;}.gab-export-buttons{display:flex;gap:7px;flex-wrap:wrap;}.gab-message{padding:0 28px 14px;font-size:11px;color:#167273;min-height:15px;}



/* Complete live brief preview */

.gab-document-status {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e4eeea;
}

.gab-document-status > div {
  min-width: 0;
  padding: 12px 9px;
  border: 1px solid #e0ebe6;
  border-radius: 9px;
  background: #fbfdfc;
}

.gab-document-status strong {
  display: block;
  color: #073b3b;
  font-size: 19px;
  font-weight: 850;
  line-height: 1.25;
}

.gab-document-status span {
  display: block;
  margin-top: 5px;
  color: #647c75;
  font-size: 9px;
  line-height: 1.5;
}

/* Contents */

 

 

/* Section headers */

.gab-preview-group {
  padding: 19px 0 21px;
  border-top: 1px solid #e4eeea;
}

.gab-preview-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.gab-preview-group-title {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
}

.gab-preview-number {
  display: grid;
  place-items: center;
  flex: 0 0 30px;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #e6f3ee;
  color: #167273;
  font-size: 11px;
  font-weight: 850;
}

.gab-preview-group-title h4 {
  margin: 0;
  color: #073b3b;
  font-size: 12px;
  font-weight: 850;
  line-height: 1.4;
}

.gab-preview-group-title small {
  display: block;
  margin-top: 3px;
  color: #778d86;
  font-size: 9px;
}

.gab-preview-group-header button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  border: 0;
  background: transparent;
  color: #167273;
  font-size: 10px;
  font-weight: 800;
}

/* Individual fields */

.gab-preview-field-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 16px;
  row-gap: 14px;
}

.gab-preview-field {
  min-width: 0;
}

.gab-preview-field.wide {
  grid-column: 1 / -1;
}

.gab-preview-field > span {
  display: block;
  margin-bottom: 4px;
  color: #748b83;
  font-size: 9px;
  font-weight: 700;
  line-height: 1.5;
}

.gab-preview-field p {
  margin: 0;
  color: #183f39;
  font-size: 10.5px;
  font-weight: 600;
  line-height: 1.65;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.gab-preview-field p.is-empty {
  color: #a1b0aa;
  font-weight: 500;
  font-style: italic;
}

/* Evaluation scorecard */

.gab-preview-scorecard {
  margin-top: 22px;
  padding: 15px;
  border: 1px solid #dceae4;
  border-radius: 10px;
  background: #f7faf9;
}

.gab-preview-scorecard-head {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 13px;
}

.gab-preview-scorecard-head strong {
  color: #073b3b;
  font-size: 11px;
  font-weight: 800;
}

.gab-preview-scorecard-head > span {
  color: #167273;
  font-size: 10px;
  font-weight: 800;
}

.gab-preview-score-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  padding: 8px 0;
  border-top: 1px solid #e0ebe6;
}

.gab-preview-score-row span {
  color: #42665e;
  font-size: 10px;
  line-height: 1.5;
}

.gab-preview-score-row strong {
  flex-shrink: 0;
  color: #073b3b;
  font-size: 10px;
}

/* Footer */

.gab-preview-footer {
  padding-top: 17px;
  border-top: 1px solid #e4eeea;
}

.gab-preview-footer > div {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #617a72;
  font-size: 10px;
  line-height: 1.6;
}

.gab-preview-footer > div svg {
  flex-shrink: 0;
  color: #167273;
}

.gab-preview-footer .gab-preview-action {
  margin-top: 15px;
}

@media (max-width: 600px) {
  .gab-preview-body {
    max-height: none;
  }

  .gab-preview-field-list {
    column-gap: 12px;
  }

  .gab-document-status {
    gap: 5px;
  }

  .gab-document-status > div {
    padding: 10px 7px;
  }
}



@media(max-width:980px){.gab-grid{grid-template-columns:minmax(0,1fr);}.gab-preview{position:static;}.gab-preview-body{max-height:none;}}
@media(max-width:600px){.gab-panel-top{padding:22px 18px 17px;}.gab-panel-top h2{font-size:22px;}.gab-form,.gab-review{padding:20px 18px;}.gab-actions{padding:18px;}.gab-fields,.gab-weight-grid{grid-template-columns:1fr;}.gab-wide{grid-column:auto;}.gab-review-summary{grid-template-columns:1fr 1fr;}.gab-toolbar{align-items:flex-start;}.gab-tools{gap:10px;}   .gab-btn{padding:9px 11px;}}
`;
