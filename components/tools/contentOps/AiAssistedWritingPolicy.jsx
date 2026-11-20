import React, { useMemo, useState } from "react";

/**
 * GrowUp — AI-Assisted Writing Policy
 * Standalone React component. No Workspace or third-party packages required.
 * Keeps the existing registry slug: ai-assisted-writing-policy
 * All example companies, tool permissions and documents are illustrative, not verified.
 */

const C = {
  teal: "#167273",
  dark: "#011522",
  pale: "#eef4f3",
  line: "#dbe7e4",
  muted: "#597071",
  white: "#ffffff",
  amber: "#ad671b",
  red: "#a43c37",
};

const TASKS = [
  {
    id: "ideas",
    title: "Topic ideas & angles",
    group: "Planning",
    desc: "Brainstorm themes, objections and content angles.",
  },
  {
    id: "research",
    title: "Research assistance",
    group: "Planning",
    desc: "Find possible sources and questions to investigate; verify separately.",
  },
  {
    id: "outline",
    title: "Outlines & briefs",
    group: "Planning",
    desc: "Organise approved research and propose article structure.",
  },
  {
    id: "interviews",
    title: "SME interview preparation",
    group: "Planning",
    desc: "Draft questions using only information permitted for the selected tool.",
  },
  {
    id: "draft",
    title: "First-draft writing",
    group: "Production",
    desc: "Generate article or landing-page copy for human rewriting and review.",
  },
  {
    id: "rewrite",
    title: "Editing & rewriting",
    group: "Production",
    desc: "Improve clarity, structure, grammar and concision.",
  },
  {
    id: "seo",
    title: "Titles, metadata & FAQs",
    group: "Production",
    desc: "Suggest search snippets and supporting page copy.",
  },
  {
    id: "quotes",
    title: "Customer quotes & case studies",
    group: "Sensitive",
    desc: "Work with customer testimony, results or identifiable stories.",
  },
  {
    id: "product",
    title: "Product, pricing & security claims",
    group: "Sensitive",
    desc: "Describe capabilities, plans, integrations, SLAs or compliance.",
  },
  {
    id: "publish",
    title: "Final approval & publishing",
    group: "Approval",
    desc: "Approve factual accuracy, attribution and final release.",
  },
];

const STATES = ["Allowed", "Approval required", "Prohibited"];

const DEFAULT_TASK_RULES = {
  ideas: "Allowed",
  research: "Allowed",
  outline: "Allowed",
  interviews: "Allowed",
  draft: "Approval required",
  rewrite: "Allowed",
  seo: "Allowed",
  quotes: "Approval required",
  product: "Approval required",
  publish: "Prohibited",
};

const DATA_TYPES = [
  {
    id: "public",
    label: "Published public information",
    hint: "Public webpages, approved announcements",
  },
  {
    id: "internal",
    label: "Internal drafts & playbooks",
    hint: "Unpublished copy, internal SOPs",
  },
  {
    id: "customer",
    label: "Customer information",
    hint: "Interviews, support tickets, usage data",
  },
  {
    id: "commercial",
    label: "Commercial & roadmap details",
    hint: "Pricing negotiations, pipeline, future releases",
  },
  {
    id: "personal",
    label: "Personal or regulated data",
    hint: "Personal identifiers, credentials, sensitive records",
  },
];

const DEFAULT_DATA_RULES = {
  public: "Allowed",
  internal: "Approval required",
  customer: "Prohibited",
  commercial: "Prohibited",
  personal: "Prohibited",
};

const EMPTY = {
  company: "",
  team: "Content marketing, freelance writers and agencies",
  owner: "",
  approver: "",
  effective: "",
  review: "",
  contact: "",
  toolList: [
    { id: "tool-1", name: "", environment: "", owner: "", notes: "" },
  ],
  taskRules: { ...DEFAULT_TASK_RULES },
  dataRules: { ...DEFAULT_DATA_RULES },
  drafting:
    "Human-led drafting; AI can assist on tasks explicitly allowed in the matrix.",
  instructions: "",
  restrictions: "",
  dataHandling:
    "Do not input passwords, unreleased customer information, personal data or confidential documents into an unapproved AI environment.",
  verification:
    "Check every statistic, quotation and externally verifiable claim against the original source. Check current product features, plan limits and integrations with the product owner.",
  attribution:
    "Record sources and distinguish confirmed facts from unverified suggestions. Never invent a customer quote, testimonial, result or citation.",
  disclosure:
    "Record AI tools and material uses in the internal draft handoff. External disclosure must follow client agreements, applicable requirements and an editor's documented decision.",
  reviewer: "",
  reviewerChecks: {
    sources: true,
    product: true,
    originality: true,
    privacy: true,
    tone: true,
    disclosure: true,
  },
  exceptions:
    "Request an exception before doing the work. The policy owner records the task, data involved, tool, reason, safeguards, decision and expiry.",
  incident:
    "Stop using the affected tool, preserve the relevant record without spreading the sensitive material, notify the policy owner, and follow the organisation's incident process.",
  acknowledgement: "",
  notes: "",
};

const SAMPLE = {
  ...EMPTY,
  company: "RelayLedger",
  team: "Content team, freelance writers, specialist content agency",
  owner: "Maya Chen — Head of Content",
  approver: "Priya Shah — Product Marketing Lead",
  effective: "2026-11-20",
  review: "2027-02-20",
  contact: "Maya Chen in the content operations channel",
  toolList: [
    {
      id: "tool-1",
      name: "Company-managed AI workspace",
      environment: "Approved enterprise workspace",
      owner: "IT / Security",
      notes:
        "Use company accounts only. Contractual data-handling review required before customer material is permitted.",
    },
    {
      id: "tool-2",
      name: "Approved editorial assistant",
      environment: "Company-managed CMS integration",
      owner: "Content Operations",
      notes:
        "For public-source outlines, edits and metadata; no customer exports.",
    },
  ],
  taskRules: {
    ...DEFAULT_TASK_RULES,
    draft: "Approval required",
    quotes: "Prohibited",
  },
  dataRules: { ...DEFAULT_DATA_RULES },
  drafting:
    "AI-generated paragraphs may be used as working material only after the commissioning editor approves that use; writers remain responsible for the full draft.",
  instructions:
    "For comparison pages, ask AI to propose evaluation criteria from the approved brief. For SEO metadata, give it the approved page text only. For interview questions, use the public product overview and the agreed buyer persona.",
  restrictions:
    "Do not manufacture quotes, rewrite a customer story as if witnessed, generate citations without opening the source, or describe unreleased integrations as available.",
  dataHandling:
    "Only public or explicitly approved, de-identified material may enter an approved workspace. Do not paste customer calls, CRM exports, unreleased roadmap slides, passwords or personal information. Ask IT / Security before expanding access.",
  verification:
    "The writer opens every primary source and records its URL and date. Product Marketing signs off on plan limits, integrations and feature availability. Customer outcomes require customer-approved evidence and usage permission.",
  attribution:
    "Attach source URLs beside numerical claims. Label any unverified figure as an evidence gap. Quotes must match approved source material exactly and must not be generated by AI.",
  disclosure:
    "In the handoff, list the AI tool, permitted task, and whether output was reused. Product Marketing decides any external disclosure in line with the client contract and applicable requirements.",
  reviewer:
    "Maya Chen — final editorial sign-off; Priya Shah — product and claims approval",
  exceptions:
    "Submit requests to Maya before work starts. Include task, intended input, AI environment and alternative. Maya and IT / Security must approve data-related exceptions in writing; approval expires on the recorded date.",
  incident:
    "Stop processing and notify Maya and IT / Security immediately if restricted information is uploaded. Record the incident in the internal reporting process and follow remediation instructions.",
  acknowledgement:
    "Agency editor confirms receipt before the first assignment; freelancers acknowledge at onboarding.",
  notes:
    "This example is fictional. Replace tool permissions with your organisation's actual security and procurement decisions.",
};

const FLOW = ["Set scope", "AI permissions", "Data & safeguards", "Review & export"];

const rand = () => `id-${Math.random().toString(36).slice(2, 10)}`;

const filled = (v) => Boolean(String(v ?? "").trim());

const fmtDate = (s) =>
  s
    ? new Date(`${s}T12:00:00`).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not set";

const mdSafe = (s) => String(s ?? "").replace(/\r/g, "").trim();

const yesNo = (bool) => (bool ? "Required" : "Not selected");

const CHECKS = [
  {
    id: "sources",
    title: "Sources and figures",
    desc: "Every stat, quote and citation checked against an original source",
  },
  {
    id: "product",
    title: "Product accuracy",
    desc: "Features, prices, plans, integrations and results confirmed by an owner",
  },
  {
    id: "originality",
    title: "Originality & substance",
    desc: "No fabricated examples, invented references or unreviewed copied output",
  },
  {
    id: "privacy",
    title: "Data-handling compliance",
    desc: "No prohibited inputs; tool and use matched the policy",
  },
  {
    id: "tone",
    title: "Editorial standards",
    desc: "Writer checked positioning, audience, usefulness and voice",
  },
  {
    id: "disclosure",
    title: "AI-use record",
    desc: "Internal disclosure complete; external obligation assessed",
  },
];

function buildDocument(v) {
  const lines = [
    `# ${v.company || "[Company]"} — AI-Assisted Writing Policy`,
    "",
    `**Policy owner:** ${v.owner || "Not assigned"}`,
    `**Final approver:** ${v.approver || "Not assigned"}`,
    `**Applies to:** ${v.team || "Not specified"}`,
    `**Effective:** ${fmtDate(v.effective)}`,
    `**Next review:** ${fmtDate(v.review)}`,
    `**Questions / escalation:** ${v.contact || "Not specified"}`,
    "",
    "## 1. Approved AI environments",
    "",
    ...(v.toolList.filter((t) => filled(t.name)).length
      ? v.toolList
          .filter((t) => filled(t.name))
          .map(
            (t) =>
              `- **${t.name}** — ${
                t.environment || "Environment not specified"
              }; owner: ${t.owner || "not assigned"}${
                t.notes ? `; ${t.notes}` : ""
              }`
          )
      : [
          "No AI tools have been listed as approved. Do not treat any tool as approved without confirmation.",
        ]),
    "",
    "## 2. AI use by editorial task",
    "",
    "| Task | Decision |",
    "| --- | --- |",
    ...TASKS.map((t) => `| ${t.title} | ${v.taskRules[t.id]} |`),
    "",
    "**Drafting standard:** " + (v.drafting || "Not defined"),
    "",
    "**Specific permitted workflows:** " + (v.instructions || "Not specified"),
    "",
    "**Explicit prohibitions:** " + (v.restrictions || "Not specified"),
    "",
    "## 3. Information allowed in AI tools",
    "",
    "| Information category | Decision |",
    "| --- | --- |",
    ...DATA_TYPES.map((d) => `| ${d.label} | ${v.dataRules[d.id]} |`),
    "",
    "**Data-handling instructions:** " + (v.dataHandling || "Not specified"),
    "",
    "## 4. Verification and attribution",
    "",
    "**Fact-checking:** " + (v.verification || "Not defined"),
    "",
    "**Sources, customer evidence and claims:** " +
      (v.attribution || "Not defined"),
    "",
    "## 5. Disclosure and handoff",
    "",
    v.disclosure || "Not specified",
    "",
    "## 6. Human review and release",
    "",
    `**Review responsibility:** ${v.reviewer || "Not assigned"}`,
    "",
    ...CHECKS.map(
      (c) => `- ${yesNo(v.reviewerChecks[c.id])}: ${c.title} — ${c.desc}`
    ),
    "",
    "**Final publication rule:** An authorised human must approve content before publication. The task matrix does not authorise automated final approval.",
    "",
    "## 7. Exceptions and incidents",
    "",
    `**Exceptions:** ${v.exceptions || "Not specified"}`,
    "",
    `**Incident response:** ${v.incident || "Not specified"}`,
    "",
    "## 8. Adoption",
    "",
    `**Acknowledgement:** ${v.acknowledgement || "Not specified"}`,
    ...(filled(v.notes) ? ["", `**Additional notes:** ${v.notes}`] : []),
    "",
    "---",
    "Prepared as an editable internal policy. Have relevant legal, security and compliance owners review requirements for your organisation.",
  ];

  return lines.map(mdSafe).join("\n").replace(/\n{3,}/g, "\n\n");
}

function copyText(text) {
  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard?.writeText
  )
    return navigator.clipboard.writeText(text);
  return Promise.reject(new Error("Clipboard unavailable"));
}

function downloadText(filename, data, mime = "text/markdown;charset=utf-8") {
  const blob = new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function PrintDocument({ text }) {
  return (
    <div className="aip-print">
      {text.split("\n").map((line, i) => {
        if (!line.trim()) return <div key={i} className="aip-print-space" />;
        if (line.startsWith("# "))
          return <h1 key={i}>{line.slice(2)}</h1>;
        if (line.startsWith("## "))
          return <h2 key={i}>{line.slice(3)}</h2>;
        if (line === "---") return <hr key={i} />;
        if (line.startsWith("|"))
          return (
            <div key={i} className="aip-print-table-line">
              {line}
            </div>
          );
        if (line.startsWith("- "))
          return (
            <p key={i} className="aip-print-bullet">
              {line.slice(2)}
            </p>
          );
        return <p key={i}>{line.replace(/\*\*/g, "")}</p>;
      })}
    </div>
  );
}

function fieldLabel(label, helper) {
  return (
    <>
      <span className="aip-label">{label}</span>
      {helper && <small className="aip-helper">{helper}</small>}
    </>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  helper,
  type = "text",
  multiline = false,
  rows = 3,
}) {
  return (
    <label className="aip-field">
      {fieldLabel(label, helper)}
      {multiline ? (
        <textarea
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function Icon({ name, size = 18 }) {
  const p = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...p}
    >
      {name === "check" ? (
        <path d="m5 12 4 4L19 6" />
      ) : name === "arrow" ? (
        <>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </>
      ) : name === "back" ? (
        <>
          <path d="M19 12H5" />
          <path d="m11 6-6 6 6 6" />
        </>
      ) : name === "plus" ? (
        <path d="M12 5v14M5 12h14" />
      ) : name === "trash" ? (
        <>
          <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v6M14 11v6" />
        </>
      ) : name === "copy" ? (
        <>
          <rect x="8" y="8" width="12" height="12" rx="2" />
          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
        </>
      ) : name === "download" ? (
        <>
          <path d="M12 3v12m-4-4 4 4 4-4M4 17v3h16v-3" />
        </>
      ) : name === "file" ? (
        <>
          <path d="M6 3h8l4 4v14H6z" />
          <path d="M14 3v5h4M9 13h6M9 17h6" />
        </>
      ) : name === "shield" ? (
        <>
          <path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6z" />
          <path d="m9 12 2 2 4-4" />
        </>
      ) : name === "alert" ? (
        <>
          <path d="m12 3 10 18H2z" />
          <path d="M12 9v5m0 3v.1" />
        </>
      ) : name === "eye" ? (
        <>
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
          <circle cx="12" cy="12" r="2.5" />
        </>
      ) : name === "edit" ? (
        <>
          <path d="m4 20 4-.8L20 7l-3-3L5 16z" />
        </>
      ) : (
        <circle cx="12" cy="12" r="8" />
      )}
    </svg>
  );
}

function SummaryCard({ number, label, small }) {
  return (
    <div className="aip-summary-card">
      <span>{label}</span>
      <strong>{number}</strong>
      {small && <small>{small}</small>}
    </div>
  );
}

const CSS = String.raw`
.aip-root {
  --aip-red: #a43c37;
  --aip-teal: #167273;
  --aip-dark: #011522;
  --aip-pale: #eef4f3;
  --aip-line: #dbe7e4;
  --aip-muted: #597071;
  color: var(--aip-dark);
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
}
.aip-root * { box-sizing: border-box }
.aip-root button,
.aip-root input,
.aip-root textarea,
.aip-root select { font: inherit }
.aip-root button { cursor: pointer }
.aip-root button:focus-visible,
.aip-root input:focus-visible,
.aip-root textarea:focus-visible,
.aip-root select:focus-visible {
  outline: 3px solid #78b9b6;
  outline-offset: 2px;
}
.aip-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin: 0 0 20px;
  flex-wrap: wrap;
}
.aip-mini {
  font-size: 12px;
  font-weight: 750;
  color: #567473;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.aip-top-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.aip-btn {
  border: 1px solid var(--aip-line);
  background: #fff;
  color: var(--aip-dark);
  padding: 10px 14px;
  min-height: 39px;
  border-radius: 10px;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  transition: background .15s, border .15s, transform .15s;
}
.aip-btn:hover {
  border-color: #a6c9c4;
  background: #f4faf9;
}
.aip-btn-primary {
  color: white;
  background: var(--aip-teal);
  border-color: var(--aip-teal);
}
.aip-btn-primary:hover {
  background: #115e5f;
  color: #fff;
}
.aip-btn-subtle { background: var(--aip-pale) }
.aip-btn-ghost { background: transparent }
.aip-btn:disabled {
  opacity: .45;
  cursor: not-allowed;
}
.aip-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.26fr) minmax(300px, .9fr);
  align-items: start;
  gap: 18px;
}
.aip-panel {
  background: #fff;
  border: 1px solid var(--aip-line);
  border-radius: 17px;
  box-shadow: 0 10px 25px rgba(1, 21, 34, .035);
  overflow: hidden;
}
.aip-panel-pad { padding: 23px }
.aip-editorhead {
  padding: 20px 23px 16px;
  border-bottom: 1px solid var(--aip-line);
}
.aip-section-title {
  font-size: 22px;
  letter-spacing: -.04em;
  line-height: 1.2;
  margin: 3px 0 7px;
  color: var(--aip-dark);
  font-weight: 800;
}
.aip-description {
  color: var(--aip-muted);
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
}
.aip-steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 7px;
  margin: 0 0 17px;
}
.aip-step {
  border: 1px solid var(--aip-line);
  background: #fff;
  border-radius: 11px;
  padding: 10px 8px;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 7px;
  color: #607474;
  min-width: 0;
  font-size: 11px;
  font-weight: 750;
}
.aip-step b {
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  border: 1px solid #d2dfdb;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: inherit;
  font-size: 11px;
}
.aip-step span {
  overflow-wrap: anywhere;
  line-height: 1.25;
}
.aip-step[aria-current=step] {
  background: var(--aip-dark);
  color: #fff;
  border-color: var(--aip-dark);
}
.aip-step[aria-current=step] b { border-color: #7aa6a6 }
.aip-step.aip-done:not([aria-current=step]) {
  color: var(--aip-teal);
  border-color: #bcd6d0;
}
.aip-eyebrow {
  font-size: 11px;
  letter-spacing: .09em;
  color: var(--aip-teal);
  font-weight: 800;
  text-transform: uppercase;
}
.aip-fields { display: grid; gap: 16px }
.aip-two {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.aip-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.aip-label {
  font-size: 12px;
  font-weight: 800;
  color: #213c41;
}
.aip-helper {
  color: #728786;
  font-size: 11px;
  font-weight: 450;
  line-height: 1.45;
  margin-top: -3px;
}
.aip-field input,
.aip-field textarea,
.aip-field select {
  width: 100%;
  border: 1px solid #d7e3e0;
  border-radius: 10px;
  background: #fff;
  color: var(--aip-dark);
  padding: 11px 12px;
  min-height: 42px;
  outline: none;
  resize: vertical;
}
.aip-field textarea { min-height: 88px }
.aip-field input::placeholder,
.aip-field textarea::placeholder { color: #94aaa7 }
.aip-field input:focus,
.aip-field textarea:focus { border-color: var(--aip-teal) }
.aip-callout {
  border: 1px solid #c8dfd9;
  background: #f2f8f6;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 12px;
  color: #39595a;
  line-height: 1.55;
}
.aip-callout strong { color: var(--aip-dark) }
.aip-subtitle {
  font-size: 15px;
  font-weight: 800;
  margin: 0 0 6px;
  color: var(--aip-dark);
  letter-spacing: -.02em;
}
.aip-subline {
  font-size: 12px;
  color: var(--aip-muted);
  margin: 0 0 13px;
}
.aip-divider {
  height: 1px;
  background: var(--aip-line);
  margin: 19px 0;
}
.aip-toolcard {
  padding: 14px;
  border: 1px solid var(--aip-line);
  border-radius: 12px;
  margin-bottom: 11px;
  background: #fcfefd;
}
.aip-tooltop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 11px;
  gap: 8px;
}
.aip-small {
  color: #647a78;
  font-size: 11px;
}
.aip-icon-btn {
  width: 33px;
  height: 33px;
  border-radius: 9px;
  border: 1px solid var(--aip-line);
  background: #fff;
  display: grid;
  place-items: center;
  color: #6b7678;
}
.aip-icon-btn:hover {
  color: var(--aip-red);
  border-color: #dbbbb8;
}
.aip-matrix {
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.aip-matrixrow {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 205px;
  gap: 13px;
  padding: 12px 13px;
  border: 1px solid var(--aip-line);
  border-radius: 12px;
  align-items: center;
  background: #fff;
}
.aip-matrixrow strong {
  font-size: 12px;
  display: block;
}
.aip-matrixrow small {
  color: #728483;
  display: block;
  font-size: 11px;
  margin-top: 2px;
  line-height: 1.4;
}
.aip-matrixrow select {
  min-width: 0;
  width: 100%;
  background: #f8fbfa;
  border: 1px solid #d8e4e0;
  border-radius: 9px;
  padding: 9px;
  color: #23484a;
  font-weight: 750;
  font-size: 12px;
}
.aip-group {
  font-size: 10px;
  color: #69908c;
  text-transform: uppercase;
  letter-spacing: .09em;
  font-weight: 800;
  margin: 14px 0 4px;
}
.aip-verify { display: grid; gap: 8px }
.aip-check {
  display: flex;
  gap: 10px;
  padding: 11px;
  border: 1px solid var(--aip-line);
  border-radius: 10px;
  align-items: flex-start;
}
.aip-check input {
  accent-color: var(--aip-teal);
  margin-top: 3px;
}
.aip-check strong {
  font-size: 12px;
  display: block;
}
.aip-check small {
  display: block;
  color: #6c807f;
  font-size: 11px;
  margin-top: 3px;
}
.aip-editorfoot {
  border-top: 1px solid var(--aip-line);
  padding: 15px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.aip-editorfoot small { color: var(--aip-muted) }
.aip-preview {
  position: sticky;
  top: 18px;
}
.aip-previewhead {
  padding: 18px 18px 15px;
  border-bottom: 1px solid var(--aip-line);
}
.aip-previewtitle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.aip-previewtitle strong { font-size: 14px }
.aip-live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 800;
  color: var(--aip-teal);
  letter-spacing: .06em;
  text-transform: uppercase;
}
.aip-live:before {
  content: "";
  background: #269c8a;
  width: 7px;
  height: 7px;
  border-radius: 100%;
}
.aip-previewbody { padding: 18px }
.aip-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 15px;
}
.aip-summary-card {
  background: var(--aip-pale);
  border: 1px solid #dcebe7;
  padding: 11px 9px;
  border-radius: 10px;
  min-width: 0;
}
.aip-summary-card span {
  color: #5f7d7c;
  text-transform: uppercase;
  letter-spacing: .05em;
  font-size: 9px;
  font-weight: 800;
  display: block;
}
.aip-summary-card strong {
  font-size: 24px;
  letter-spacing: -.05em;
  display: block;
  line-height: 1.4;
}
.aip-summary-card small {
  color: #69817e;
  font-size: 9px;
}
.aip-progress {
  height: 6px;
  background: #e3eeeb;
  border-radius: 6px;
  overflow: hidden;
  margin: 10px 0 6px;
}
.aip-progress>div {
  height: 100%;
  background: var(--aip-teal);
  transition: width .2s;
}
.aip-result-heading {
  font-size: 17px;
  letter-spacing: -.04em;
  margin: 17px 0 6px;
}
.aip-previewp {
  font-size: 12px;
  color: #5d7472;
  margin: 0 0 11px;
  line-height: 1.55;
}
.aip-rulepill {
  font-size: 10px;
  font-weight: 750;
  padding: 4px 7px;
  border-radius: 7px;
  white-space: nowrap;
}
.aip-pill-allowed {
  color: #126458;
  background: #e1f3ed;
}
.aip-pill-approval {
  color: #916019;
  background: #fff1d9;
}
.aip-pill-prohibited {
  color: #983e39;
  background: #fbe9e7;
}
.aip-previewrule {
  display: flex;
  gap: 9px;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 1px solid #e9efed;
  padding: 9px 0;
  font-size: 12px;
}
.aip-previewrule span:first-child { min-width: 0 }
.aip-risk {
  background: #fff8ed;
  border: 1px solid #eedfc8;
  border-radius: 10px;
  padding: 11px 12px;
  color: #8e6028;
  font-size: 12px;
  margin-top: 12px;
}
.aip-issue {
  padding: 10px 11px;
  display: flex;
  align-items: flex-start;
  gap: 9px;
  border: 1px solid #e6e9e6;
  border-radius: 9px;
  margin: 6px 0;
  font-size: 12px;
  color: #465e5d;
}
.aip-issue svg {
  flex: 0 0 auto;
  color: #ab7132;
}
.aip-tabs {
  display: flex;
  gap: 4px;
  background: #f0f5f3;
  border-radius: 10px;
  padding: 4px;
  margin: 0 0 14px;
}
.aip-tabs button {
  flex: 1;
  background: transparent;
  border: none;
  border-radius: 7px;
  padding: 8px 6px;
  color: #637c78;
  font-weight: 750;
  font-size: 11px;
}
.aip-tabs button[aria-selected=true] {
  background: #fff;
  color: var(--aip-dark);
  box-shadow: 0 1px 4px #cbdcd6;
}
.aip-export {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
  margin-top: 14px;
}
.aip-print { display: none }
.aip-toast {
  margin-top: 8px;
  font-size: 12px;
  color: #15726e;
}
.aip-muted { color: #607775 }
.aip-status {
  display: inline-block;
  border-radius: 100px;
  background: #e7f5f1;
  color: #167273;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
}
.aip-root h3 { margin: 0 }
.aip-preview-foot {
  border-top: 1px solid var(--aip-line);
  padding: 14px 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.aip-open {
  display: flex;
  gap: 9px;
  align-items: center;
  color: var(--aip-teal);
  font-weight: 800;
  font-size: 12px;
  background: #f4f9f7;
  border: 1px solid #c7dfd9;
  border-radius: 10px;
  padding: 11px 12px;
  width: 100%;
  justify-content: center;
}
.aip-root p { max-width: none }
.aip-root .aip-white { background: #fff }
.aip-nowrap { white-space: nowrap }
@media (max-width: 1000px) {
  .aip-grid { grid-template-columns: 1fr }
  .aip-preview { position: static }
  .aip-steps { grid-template-columns: repeat(4, minmax(0, 1fr)) }
}
@media (max-width: 590px) {
  .aip-panel-pad { padding: 16px }
  .aip-editorhead { padding: 17px 16px }
  .aip-steps { grid-template-columns: repeat(2, minmax(0, 1fr)) }
  .aip-two { grid-template-columns: 1fr }
  .aip-matrixrow { grid-template-columns: 1fr; gap: 9px }
  .aip-editorfoot { padding: 14px 16px }
  .aip-section-title { font-size: 20px }
  .aip-export { grid-template-columns: 1fr }
  .aip-top { align-items: stretch }
}
@media print {
  body * { visibility: hidden !important }
  .aip-print,
  .aip-print * { visibility: visible !important }
  .aip-print {
    display: block !important;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background: #fff;
    color: #111;
    padding: 8mm 12mm;
    font-family: Arial, sans-serif;
    line-height: 1.42;
    font-size: 9.5pt;
  }
  .aip-root { color: #111 }
  .aip-print h1 {
    font-size: 20pt;
    margin: 0 0 10pt;
  }
  .aip-print h2 {
    font-size: 13pt;
    margin: 16pt 0 7pt;
    border-bottom: 1px solid #dbe7e4;
    padding-bottom: 4pt;
    break-after: avoid;
  }
  .aip-print p { margin: 3pt 0 }
  .aip-print-space { height: 5pt }
  .aip-print-table-line {
    font-family: monospace;
    font-size: 8pt;
    overflow-wrap: anywhere;
  }
  .aip-print-bullet { margin-left: 12pt !important }
  .aip-print hr {
    border: 0;
    border-top: 1px solid #ddd;
    margin: 10pt 0;
  }
}
`;

export const faqs = [
  {
    question:
      "Does this make an AI tool safe to use with customer information?",
    answer:
      "No. The policy records your team's decisions; it cannot verify a provider's security, data-processing terms or contractual permissions. Have the appropriate security, privacy and legal owners review those decisions.",
  },
  {
    question: "Can writers use AI for a first draft?",
    answer:
      "Your team decides. Mark drafting as allowed, approval required or prohibited, then define what human editing, sourcing and sign-off are mandatory.",
  },
  {
    question: "How do I share the policy?",
    answer:
      "Copy the full policy, download a Markdown file, or print and save it as a PDF. The tool does not send information to an external service.",
  },
];

export default function AiAssistedWritingPolicy() {
  const [v, setV] = useState(() => structuredCloneSafe(EMPTY));
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState("Overview");
  const [notice, setNotice] = useState("");

  const set = (key, value) =>
    setV((s) => ({ ...s, [key]: value }));

  const setRule = (category, id, value) =>
    setV((s) => ({
      ...s,
      [category]: { ...s[category], [id]: value },
    }));

  const setTool = (id, key, value) =>
    setV((s) => ({
      ...s,
      toolList: s.toolList.map((t) =>
        t.id === id ? { ...t, [key]: value } : t
      ),
    }));

  const addTool = () =>
    setV((s) => ({
      ...s,
      toolList: [
        ...s.toolList,
        { id: rand(), name: "", environment: "", owner: "", notes: "" },
      ],
    }));

  const removeTool = (id) =>
    setV((s) => ({
      ...s,
      toolList: s.toolList.filter((t) => t.id !== id),
    }));

  const putExample = () => {
    setV(structuredCloneSafe(SAMPLE));
    setStep(0);
    setTab("Overview");
    setNotice(
      "Illustrative example loaded — review and replace all approvals before use."
    );
  };

  const clear = () => {
    if (
      typeof window === "undefined" ||
      window.confirm(
        "Start fresh? This clears all current entries in this tool."
      )
    ) {
      setV(structuredCloneSafe(EMPTY));
      setStep(0);
      setTab("Overview");
      setNotice("");
    }
  };

  const documentText = useMemo(() => buildDocument(v), [v]);

  const enabledTasks = TASKS.filter(
    (t) => v.taskRules[t.id] === "Allowed"
  ).length;

  const needsApproval = TASKS.filter(
    (t) => v.taskRules[t.id] === "Approval required"
  ).length;

  const restrictedData = DATA_TYPES.filter(
    (d) => v.dataRules[d.id] === "Prohibited"
  ).length;

  const issues = useMemo(() => {
    const found = [];
    if (!filled(v.company))
      found.push("Add the company or editorial team name.");
    if (!filled(v.owner))
      found.push(
        "Assign a policy owner who can answer questions and grant exceptions."
      );
    if (!filled(v.approver))
      found.push("Name who can approve exceptions or policy changes.");
    if (!filled(v.effective) || !filled(v.review))
      found.push("Set the effective date and next policy review.");
    if (!v.toolList.some((t) => filled(t.name)))
      found.push(
        "List at least one approved environment, or explicitly confirm AI tools are not permitted."
      );
    if (v.toolList.some((t) => filled(t.name) && !filled(t.owner)))
      found.push("Assign an owner to each named AI environment.");
    if (v.dataRules.personal !== "Prohibited")
      found.push(
        "Review the handling of personal or regulated data with security and privacy owners."
      );
    if (v.dataRules.customer !== "Prohibited")
      found.push(
        "Confirm contractual and privacy permissions before allowing customer information in AI tools."
      );
    if (!filled(v.verification) || !filled(v.attribution))
      found.push(
        "Define both fact-checking and source/quote attribution rules."
      );
    if (!filled(v.disclosure))
      found.push(
        "Specify the internal AI-use record and external disclosure decision process."
      );
    if (!filled(v.reviewer))
      found.push("Name the human reviewer responsible for release.");
    if (!filled(v.exceptions) || !filled(v.incident))
      found.push(
        "Document how to request exceptions and report incidents."
      );
    return found;
  }, [v]);

  const completionItems = [
    v.company,
    v.owner,
    v.approver,
    v.effective,
    v.review,
    v.reviewer,
    v.verification,
    v.attribution,
    v.disclosure,
    v.exceptions,
    v.incident,
    v.toolList.some((t) => filled(t.name)) ? "yes" : "",
  ];

  const completion = Math.round(
    (completionItems.filter(filled).length / completionItems.length) *
      100
  );

  const copy = async () => {
    try {
      await copyText(documentText);
      setNotice("Complete policy copied.");
    } catch {
      setNotice(
        "Copy unavailable in this browser. Use the Markdown download instead."
      );
    }
  };

  const save = () => {
    downloadText(
      `${slugify(v.company || "company")}-ai-writing-policy.md`,
      documentText
    );
    setNotice("Markdown file downloaded.");
  };

  const print = () => {
    if (typeof window !== "undefined") window.print();
  };

  const matrixRow = (id, title, desc, group, category) => (
    <div className="aip-matrixrow" key={id}>
      <div>
        <strong>{title}</strong>
        <small>{desc}</small>
      </div>
      <label className="aip-field">
        <span
          className="aip-label"
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            overflow: "hidden",
            clipPath: "inset(50%)",
          }}
        >
          {title} permission
        </span>
        <select
          value={v[category][id]}
          onChange={(e) => setRule(category, id, e.target.value)}
        >
          {STATES.map((state) => (
            <option key={state}>{state}</option>
          ))}
        </select>
      </label>
    </div>
  );

  const input = (key, label, placeholder = "", helper = "", more = {}) => (
    <Input
      label={label}
      value={v[key]}
      onChange={(value) => set(key, value)}
      placeholder={placeholder}
      helper={helper}
      {...more}
    />
  );

  return (
    <div className="aip-root">
      <style>{CSS}</style>

      <div className="aip-top">
        <span className="aip-mini">Create your editorial AI policy</span>
        <div className="aip-top-actions">
          <button
            type="button"
            className="aip-btn aip-btn-subtle"
            onClick={putExample}
          >
            Use example
          </button>
          <button type="button" className="aip-btn" onClick={clear}>
            Start fresh
          </button>
        </div>
      </div>

      <nav className="aip-steps" aria-label="Policy builder steps">
        {FLOW.map((name, i) => (
          <button
            key={name}
            type="button"
            className={`aip-step ${i < step ? "aip-done" : ""}`}
            aria-current={step === i ? "step" : undefined}
            onClick={() => setStep(i)}
          >
            <b>
              {i < step ? (
                <Icon name="check" size={14} />
              ) : (
                String(i + 1).padStart(2, "0")
              )}
            </b>
            <span>{name}</span>
          </button>
        ))}
      </nav>

      <div className="aip-grid">
        <section className="aip-panel" aria-label="Policy editor">
          <div className="aip-editorhead">
            <span className="aip-eyebrow">
              Step {step + 1} of {FLOW.length}
            </span>
            <h2 className="aip-section-title">
              {
                [
                  "Who's using AI, and where?",
                  "Decide what AI can actually do",
                  "Keep sensitive information out",
                  "Set the human sign-off rules",
                ][step]
              }
            </h2>
            <p className="aip-description">
              {
                [
                  "Set clear ownership and name the approved tools. Never assume a tool is safe just because it is popular.",
                  "Choose a rule for each editorial task. Writers can see exactly what is allowed and when they need permission.",
                  "Match information types to the permissions you have, then define the checks writers must perform.",
                  "Turn these rules into a policy people can follow, approve and share before the next assignment.",
                ][step]
              }
            </p>
          </div>

          <div className="aip-panel-pad">
            {step === 0 && (
              <div className="aip-fields">
                <div className="aip-two">
                  {input("company", "Company or brand", "e.g. RelayLedger")}
                  {input(
                    "team",
                    "Who must follow this policy?",
                    "e.g. Staff writers, freelancers and agencies"
                  )}
                </div>

                <div className="aip-two">
                  {input("owner", "Policy owner", "Name and role")}
                  {input(
                    "approver",
                    "Exceptions approver",
                    "Name and role"
                  )}
                </div>

                <div className="aip-two">
                  {input("effective", "Effective from", "", "", {
                    type: "date",
                  })}
                  {input("review", "Review again on", "", "", {
                    type: "date",
                  })}
                </div>

                {input(
                  "contact",
                  "Where should people ask questions?",
                  "e.g. Editorial lead in #content-ops"
                )}

                <div className="aip-divider" />

                <div>
                  <h3 className="aip-subtitle">
                    Approved AI tools and environments
                  </h3>
                  <p className="aip-subline">
                    Only list tools your organisation has actually approved.
                    Names entered here are not security certifications.
                  </p>
                </div>

                {v.toolList.map((t, i) => (
                  <div key={t.id} className="aip-toolcard">
                    <div className="aip-tooltop">
                      <strong>Environment {i + 1}</strong>
                      <button
                        type="button"
                        className="aip-icon-btn"
                        onClick={() => removeTool(t.id)}
                        aria-label={`Remove tool ${i + 1}`}
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                    <div className="aip-fields">
                      <div className="aip-two">
                        <Input
                          label="Tool or workspace name"
                          value={t.name}
                          onChange={(x) => setTool(t.id, "name", x)}
                          placeholder="e.g. Managed editorial workspace"
                        />
                        <Input
                          label="Environment / access"
                          value={t.environment}
                          onChange={(x) => setTool(t.id, "environment", x)}
                          placeholder="e.g. Company managed accounts"
                        />
                      </div>
                      <Input
                        label="Approving team or owner"
                        value={t.owner}
                        onChange={(x) => setTool(t.id, "owner", x)}
                        placeholder="e.g. IT / Security"
                      />
                      <Input
                        label="Restrictions or conditions"
                        value={t.notes}
                        onChange={(x) => setTool(t.id, "notes", x)}
                        placeholder="What data or use is covered by approval?"
                        multiline
                        rows={2}
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="aip-btn aip-btn-subtle"
                  onClick={addTool}
                >
                  <Icon name="plus" size={16} /> Add approved environment
                </button>

                <div className="aip-callout">
                  <strong>Important:</strong> If your company has not approved
                  any AI environment, leave the list empty and set editorial
                  tasks to prohibited until a decision is made.
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="aip-fields">
                <div className="aip-callout">
                  <strong>Three decisions:</strong> <b>Allowed</b> = can be
                  used within the policy. <b>Approval required</b> = written
                  permission before use. <b>Prohibited</b> = not permitted.
                  Final publishing remains a human responsibility.
                </div>

                <div className="aip-matrix">
                  {["Planning", "Production", "Sensitive", "Approval"].map(
                    (group) => (
                      <div key={group}>
                        <div className="aip-group">{group}</div>
                        {TASKS.filter((t) => t.group === group).map((t) =>
                          matrixRow(
                            t.id,
                            t.title,
                            t.desc,
                            group,
                            "taskRules"
                          )
                        )}
                      </div>
                    )
                  )}
                </div>

                <div className="aip-divider" />

                {input(
                  "drafting",
                  "How should writers handle AI-generated copy?",
                  "Human rewriting, evidence checks, originality…",
                  "Make the rule specific enough to apply to a first draft.",
                  { multiline: true }
                )}

                {input(
                  "instructions",
                  "Examples of permitted workflows",
                  "e.g. AI may suggest headings from approved public materials…",
                  "Concrete examples remove ambiguity for new writers.",
                  { multiline: true }
                )}

                {input(
                  "restrictions",
                  "Explicitly prohibited practices",
                  "e.g. Invented quotes, fabricated citations, unverified customer results…",
                  "Even a permitted task must follow these boundaries.",
                  { multiline: true }
                )}
              </div>
            )}

            {step === 2 && (
              <div className="aip-fields">
                <div>
                  <h3 className="aip-subtitle">
                    What can be pasted into AI?
                  </h3>
                  <p className="aip-subline">
                    Use the most restrictive rule when content contains several
                    kinds of information. Actual access also depends on
                    approval of the tool.
                  </p>
                </div>

                <div className="aip-matrix">
                  {DATA_TYPES.map((d) =>
                    matrixRow(d.id, d.label, d.hint, "Data", "dataRules")
                  )}
                </div>

                {v.dataRules.customer !== "Prohibited" ||
                v.dataRules.personal !== "Prohibited" ? (
                  <div className="aip-risk">
                    <strong>High-risk decision:</strong> Allowing customer or
                    personal data needs documented review of consent,
                    contracts, privacy requirements, and the specific tool's
                    controls. This form does not perform that review.
                  </div>
                ) : null}

                <div className="aip-divider" />

                {input(
                  "dataHandling",
                  "Input handling and redaction rules",
                  "What must be removed, anonymised or withheld?",
                  "Specify what happens before anyone uploads a document or transcript.",
                  { multiline: true }
                )}

                {input(
                  "verification",
                  "Fact-checking rules",
                  "Who checks statistics, links, product specs, and pricing?",
                  "AI output is not independent evidence.",
                  { multiline: true }
                )}

                {input(
                  "attribution",
                  "Quotes, sources and customer outcomes",
                  "Source links, customer permission, proof and date requirements…",
                  "Define what happens when a source is unavailable.",
                  { multiline: true }
                )}
              </div>
            )}

            {step === 3 && (
              <div className="aip-fields">
                {input(
                  "reviewer",
                  "Who signs off the final piece?",
                  "e.g. Head of Content; Product Marketing checks claims"
                )}

                <div>
                  <h3 className="aip-subtitle">
                    Required editorial checks
                  </h3>
                  <p className="aip-subline">
                    Select which checks should appear in every draft handoff.
                    Deselecting one does not remove other legal or contractual
                    obligations.
                  </p>
                </div>

                <div className="aip-verify">
                  {CHECKS.map((c) => (
                    <label key={c.id} className="aip-check">
                      <input
                        type="checkbox"
                        checked={Boolean(v.reviewerChecks[c.id])}
                        onChange={(e) =>
                          setRule(
                            "reviewerChecks",
                            c.id,
                            e.target.checked
                          )
                        }
                      />
                      <span>
                        <strong>{c.title}</strong>
                        <small>{c.desc}</small>
                      </span>
                    </label>
                  ))}
                </div>

                {input(
                  "disclosure",
                  "AI-use disclosure and documentation",
                  "What must writers record? When is reader-facing disclosure assessed?",
                  "Keep internal documentation distinct from any legal or client-facing disclosure requirement.",
                  { multiline: true }
                )}

                {input(
                  "exceptions",
                  "How to request an exception",
                  "Who approves, what evidence is needed, how long does permission last?",
                  "An exception should never be assumed from silence.",
                  { multiline: true }
                )}

                {input(
                  "incident",
                  "What if restricted data is uploaded?",
                  "Stop, notify the policy owner, follow incident steps…",
                  "Keep escalation instructions specific to your organisation.",
                  { multiline: true }
                )}

                {input(
                  "acknowledgement",
                  "How writers confirm they've read this",
                  "e.g. Acknowledge during onboarding before receiving briefs"
                )}

                {input(
                  "notes",
                  "Additional notes (optional)",
                  "Client-specific requirements, links to the full security policy…",
                  "",
                  { multiline: true, rows: 2 }
                )}

                <div className="aip-divider" />

                <div>
                  <h3 className="aip-subtitle">Ready to share?</h3>
                  <p className="aip-subline">
                    Check the flagged gaps before issuing this as your team's
                    policy. The readiness percentage measures form completion,
                    not legal compliance or security approval.
                  </p>
                </div>

                {issues.length ? (
                  issues.map((s, i) => (
                    <div key={i} className="aip-issue">
                      <Icon name="alert" size={16} />
                      <span>{s}</span>
                    </div>
                  ))
                ) : (
                  <div className="aip-callout">
                    <strong>All core sections completed.</strong> Have
                    authorised stakeholders review and approve the policy
                    before adoption.
                  </div>
                )}

                <div className="aip-export">
                  <button
                    type="button"
                    className="aip-btn aip-btn-primary"
                    onClick={copy}
                  >
                    <Icon name="copy" /> Copy full policy
                  </button>
                  <button type="button" className="aip-btn" onClick={save}>
                    <Icon name="download" /> Download Markdown
                  </button>
                  <button type="button" className="aip-btn" onClick={print}>
                    <Icon name="file" /> Print / save PDF
                  </button>
                  <button
                    type="button"
                    className="aip-btn"
                    onClick={() => setTab("Policy")}
                  >
                    <Icon name="eye" /> Preview policy
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="aip-editorfoot">
            <button
              type="button"
              className="aip-btn"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(s - 1, 0))}
            >
              <Icon name="back" size={16} /> Back
            </button>
            <small>
              {step + 1} / {FLOW.length}
            </small>
            {step < FLOW.length - 1 ? (
              <button
                type="button"
                className="aip-btn aip-btn-primary"
                onClick={() =>
                  setStep((s) => Math.min(s + 1, FLOW.length - 1))
                }
              >
                Continue <Icon name="arrow" size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="aip-btn aip-btn-primary"
                onClick={copy}
              >
                <Icon name="copy" size={16} /> Copy policy
              </button>
            )}
          </div>
        </section>

        <aside className="aip-panel aip-preview" aria-label="Live policy preview">
          <div className="aip-previewhead">
            <div className="aip-previewtitle">
              <strong>Live policy preview</strong>
              <span className="aip-live">Updated as you edit</span>
            </div>
            <p className="aip-description" style={{ marginTop: 5 }}>
              See exactly what your writers will receive.
            </p>
          </div>

          <div className="aip-previewbody">
            <div className="aip-metrics">
              <SummaryCard
                label="Readiness"
                number={`${completion}%`}
                small="Fields completed"
              />
              <SummaryCard
                label="Allowed"
                number={enabledTasks}
                small="Editorial tasks"
              />
              <SummaryCard
                label="Needs sign-off"
                number={needsApproval}
                small="Editorial tasks"
              />
            </div>

            <div
              className="aip-progress"
              role="progressbar"
              aria-label="Policy form completeness"
              aria-valuenow={completion}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div style={{ width: `${completion}%` }} />
            </div>

            <p className="aip-previewp">
              {issues.length
                ? `${issues.length} handoff issue${
                    issues.length === 1 ? "" : "s"
                  } to check before adoption.`
                : "Core policy fields are filled. Final stakeholder approval is still required."}
            </p>

            <div
              className="aip-tabs"
              role="tablist"
              aria-label="Preview views"
            >
              {["Overview", "Permissions", "Policy"].map((name) => (
                <button
                  type="button"
                  key={name}
                  role="tab"
                  aria-selected={tab === name}
                  onClick={() => setTab(name)}
                >
                  {name}
                </button>
              ))}
            </div>

            {tab === "Overview" && (
              <>
                <span className="aip-eyebrow">Editorial policy</span>
                <h3 className="aip-result-heading">
                  {v.company || "Your company"}
                </h3>
                <p className="aip-previewp">
                  Applies to: {v.team || "Not set"}
                </p>

                <div className="aip-previewrule">
                  <span>Policy owner</span>
                  <strong>{v.owner || "Not assigned"}</strong>
                </div>
                <div className="aip-previewrule">
                  <span>Effective date</span>
                  <strong>{fmtDate(v.effective)}</strong>
                </div>
                <div className="aip-previewrule">
                  <span>Next review</span>
                  <strong>{fmtDate(v.review)}</strong>
                </div>

                <h3 className="aip-result-heading">At a glance</h3>
                <p className="aip-previewp">
                  {enabledTasks} tasks allowed · {needsApproval} require
                  approval · {restrictedData} information categories
                  prohibited.
                </p>

                <div className="aip-previewrule">
                  <span>AI-written first drafts</span>
                  <span
                    className={`aip-rulepill aip-pill-${
                      v.taskRules.draft === "Allowed"
                        ? "allowed"
                        : v.taskRules.draft === "Prohibited"
                        ? "prohibited"
                        : "approval"
                    }`}
                  >
                    {v.taskRules.draft}
                  </span>
                </div>

                <div className="aip-previewrule">
                  <span>Customer information</span>
                  <span
                    className={`aip-rulepill aip-pill-${
                      v.dataRules.customer === "Allowed"
                        ? "allowed"
                        : v.dataRules.customer === "Prohibited"
                        ? "prohibited"
                        : "approval"
                    }`}
                  >
                    {v.dataRules.customer}
                  </span>
                </div>

                <div className="aip-previewrule">
                  <span>Final publishing</span>
                  <span className="aip-rulepill aip-pill-prohibited">
                    Human approval required
                  </span>
                </div>

                {issues.length > 0 && (
                  <div className="aip-risk">Next to fix: {issues[0]}</div>
                )}
              </>
            )}

            {tab === "Permissions" && (
              <>
                <h3 className="aip-result-heading" style={{ marginTop: 0 }}>
                  Task permissions
                </h3>
                {TASKS.map((t) => (
                  <div key={t.id} className="aip-previewrule">
                    <span>{t.title}</span>
                    <span
                      className={`aip-rulepill aip-pill-${
                        v.taskRules[t.id] === "Allowed"
                          ? "allowed"
                          : v.taskRules[t.id] === "Prohibited"
                          ? "prohibited"
                          : "approval"
                      }`}
                    >
                      {v.taskRules[t.id]}
                    </span>
                  </div>
                ))}

                <h3 className="aip-result-heading">Data permissions</h3>
                {DATA_TYPES.map((d) => (
                  <div key={d.id} className="aip-previewrule">
                    <span>{d.label}</span>
                    <span
                      className={`aip-rulepill aip-pill-${
                        v.dataRules[d.id] === "Allowed"
                          ? "allowed"
                          : v.dataRules[d.id] === "Prohibited"
                          ? "prohibited"
                          : "approval"
                      }`}
                    >
                      {v.dataRules[d.id]}
                    </span>
                  </div>
                ))}
              </>
            )}

            {tab === "Policy" && (
              <>
                <h3 className="aip-result-heading" style={{ marginTop: 0 }}>
                  Export preview
                </h3>
                <div
                  style={{
                    maxHeight: 500,
                    overflowY: "auto",
                    padding: 11,
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                    background: "#f6faf9",
                    border: `1px solid ${C.line}`,
                    borderRadius: 10,
                    fontSize: 11,
                    lineHeight: 1.65,
                  }}
                >
                  {documentText}
                </div>
              </>
            )}
          </div>

          <div className="aip-preview-foot">
            <button
              type="button"
              className="aip-open"
              onClick={() => setStep(3)}
            >
              <Icon name="file" size={16} /> Review and export{" "}
              <Icon name="arrow" size={15} />
            </button>
            {notice && (
              <div className="aip-toast" role="status">
                {notice}
              </div>
            )}
          </div>
        </aside>
      </div>

      <PrintDocument text={documentText} />
    </div>
  );
}

function structuredCloneSafe(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function slugify(s) {
  return (
    String(s)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "company"
  );
}