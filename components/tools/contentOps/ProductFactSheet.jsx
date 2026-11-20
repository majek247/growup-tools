import React, { useMemo, useState } from "react";

/**
 * GrowUp Product Reference Guide — standalone client-side React component.
 * Place in components/tools/contentOps/ProductReferenceGuide.jsx.
 * No Workspace or third-party packages required.
 * Designed to sit below the EXISTING tool-page heading (no repeated hero).
 * Example company, product details and source citations are fictional demonstrations.
 */

const css = `
.prg-root {
  --ink: #073738;
  --deep: #011522;
  --teal: #167273;
  --aqua: #8bd8c5;
  --soft: #eef4f3;
  --edge: #d7e5e2;
  --muted: #637b7b;
  --paper: #fff;
  --amber: #9c5c15;
  --rose: #a14340;
  color: var(--ink);
  font-family: inherit;
  line-height: 1.5;
}
.prg-root * { box-sizing: border-box }
.prg-root button,
.prg-root input,
.prg-root select,
.prg-root textarea { font: inherit }
.prg-root button { cursor: pointer }
.prg-root button:disabled { opacity: .45; cursor: not-allowed }
.prg-root input,
.prg-root textarea,
.prg-root select {
  width: 100%;
  border: 1px solid #c9dad6;
  border-radius: 9px;
  background: #fff;
  color: var(--ink);
  outline: none;
  padding: 11px 12px;
  font-size: 14px;
  min-height: 43px;
  transition: border-color .15s, box-shadow .15s;
}
.prg-root textarea {
  min-height: 92px;
  resize: vertical;
}
.prg-root input:focus,
.prg-root textarea:focus,
.prg-root select:focus {
  border-color: var(--teal);
  box-shadow: 0 0 0 3px rgba(22, 114, 115, .12);
}
.prg-root input::placeholder,
.prg-root textarea::placeholder { color: #96aaa7 }

.prg-wrap {
  max-width: 1120px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid var(--edge);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 16px 45px rgba(1, 21, 34, .04);
}
.prg-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  background: #f8fbfa;
  padding: 18px 22px;
  border-bottom: 1px solid var(--edge);
}
.prg-toolbar-note {
  font-size: 12px;
  color: var(--muted);
  display: flex;
  gap: 7px;
  align-items: center;
}
.prg-stepbar {
  padding: 18px 22px;
  border-bottom: 1px solid var(--edge);
  display: flex;
  gap: 8px;
  overflow-x: auto;
}
.prg-step {
  white-space: nowrap;
  border: 1px solid #d9e6e3;
  border-radius: 9px;
  background: #fff;
  padding: 9px 12px;
  color: var(--ink);
  font-size: 12px;
  font-weight: 750;
  display: flex;
  gap: 8px;
  align-items: center;
}
.prg-step[aria-current="step"] {
  background: #0e5d5e;
  border-color: #0e5d5e;
  color: white;
}
.prg-step .prg-num {
  border: 1px solid currentColor;
  border-radius: 50%;
  font-size: 10px;
  width: 20px;
  height: 20px;
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
}
.prg-progress {
  height: 3px;
  background: #e5efec;
}
.prg-progress span {
  display: block;
  height: 100%;
  background: var(--teal);
  transition: width .2s;
}

.prg-body { padding: 25px 22px 30px }
.prg-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.18fr) minmax(310px, .82fr);
  gap: 22px;
  align-items: start;
}
.prg-editor,
.prg-preview { min-width: 0 }
.prg-pane {
  border: 1px solid var(--edge);
  border-radius: 14px;
  background: #fff;
  padding: 24px;
}
.prg-kicker {
  font-size: 10px;
  letter-spacing: .14em;
  text-transform: uppercase;
  font-weight: 850;
  color: var(--teal);
}
.prg-pane h2 {
  font-size: 25px;
  letter-spacing: -.035em;
  line-height: 1.22;
  margin: 8px 0;
  color: var(--ink);
  font-weight: 850;
}
.prg-muted {
  color: var(--muted);
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
}
.prg-field { display: block; margin-top: 17px }
.prg-label {
  font-size: 12px;
  font-weight: 800;
  display: block;
  margin-bottom: 7px;
}
.prg-hint {
  font-size: 11px;
  color: var(--muted);
  display: block;
  margin-top: 5px;
  line-height: 1.5;
}
.prg-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 15px;
}
.prg-grid3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0 14px;
}
.prg-section {
  border-top: 1px solid var(--edge);
  margin-top: 22px;
  padding-top: 22px;
}
.prg-section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.prg-section-head h3 { font-size: 15px; font-weight: 850; margin: 0 }
.prg-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}
.prg-button {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  justify-content: center;
  background: var(--teal);
  border: 1px solid var(--teal);
  border-radius: 9px;
  color: white;
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 800;
  line-height: 1.3;
}
.prg-button:hover:not(:disabled) { filter: brightness(.94) }
.prg-button.alt {
  background: white;
  color: var(--ink);
  border-color: #c8ded9;
}
.prg-button.ghost {
  background: transparent;
  color: var(--teal);
  border-color: transparent;
}
.prg-button.danger {
  background: #fff7f6;
  color: #a3423e;
  border-color: #f3d9d6;
}
.prg-button.small { padding: 7px 10px; font-size: 11px }
.prg-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 23px;
  padding-top: 20px;
  border-top: 1px solid var(--edge);
}
.prg-actions > div { display: flex; gap: 8px }
.prg-card {
  border: 1px solid #dbe7e4;
  border-radius: 11px;
  background: #fcfefd;
  padding: 16px;
  margin-top: 14px;
}
.prg-cardtop {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 8px;
}
.prg-cardtop strong { font-size: 14px }
.prg-cardmeta {
  font-size: 11px;
  color: var(--muted);
  margin-top: 4px;
}
.prg-info {
  padding: 11px 13px;
  border: 1px solid #cfe2dd;
  background: #eff7f5;
  color: #245f5e;
  border-radius: 9px;
  font-size: 12px;
  line-height: 1.6;
  margin-top: 14px;
}
.prg-warning {
  padding: 12px 14px;
  background: #fff7ea;
  border: 1px solid #f0debd;
  color: #80541f;
  border-radius: 9px;
  font-size: 12px;
  margin-top: 13px;
}
.prg-badge {
  font-size: 10px;
  font-weight: 800;
  white-space: nowrap;
  border-radius: 999px;
  padding: 5px 9px;
  background: #eef4f3;
  color: #416b68;
}
.prg-badge.approved { background: #e5f3ed; color: #1a7356 }
.prg-badge.review { background: #fff0d8; color: #88581c }
.prg-badge.restricted { background: #fdecea; color: #a34140 }
.prg-count { font-size: 11px; font-weight: 800; color: var(--teal) }

.prg-preview {
  position: sticky;
  top: 20px;
  border: 1px solid var(--edge);
  border-radius: 14px;
  overflow: hidden;
  background: white;
}
.prg-preview-head {
  background: linear-gradient(120deg, #063f40, #012d30);
  color: white;
  padding: 23px;
}
.prg-preview-head .prg-kicker { color: #a5dfd3 }
.prg-preview-head h3 {
  font-size: 23px;
  line-height: 1.2;
  margin: 8px 0 3px;
  letter-spacing: -.035em;
  color: white;
}
.prg-preview-head p {
  margin: 0;
  font-size: 12px;
  color: #c2e0dd;
}
.prg-score {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;
  font-size: 12px;
}
.prg-score strong { font-size: 23px; color: white }
.prg-meter {
  height: 5px;
  background: rgba(255, 255, 255, .2);
  border-radius: 9px;
  overflow: hidden;
  margin-top: 8px;
}
.prg-meter span {
  display: block;
  background: #8bd8c5;
  height: 100%;
}
.prg-tabs {
  display: flex;
  gap: 0;
  background: #f7fbf9;
  border-bottom: 1px solid var(--edge);
}
.prg-tabs button {
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  color: #607979;
  font-size: 11px;
  font-weight: 800;
  padding: 11px 15px;
}
.prg-tabs button.active {
  color: #0c6262;
  border-color: var(--teal);
}
.prg-preview-content {
  height: 520px;
  overflow: auto;
  padding: 19px;
}
.prg-doc-section {
  padding-bottom: 17px;
  margin-bottom: 17px;
  border-bottom: 1px solid var(--edge);
}
.prg-doc-section:last-child {
  border: 0;
  margin: 0;
  padding: 0;
}
.prg-doc-section h4 {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .065em;
  margin: 0 0 9px;
  color: #0c6262;
}
.prg-doc-section p {
  font-size: 12px;
  line-height: 1.65;
  margin: 6px 0;
  color: var(--ink);
  overflow-wrap: anywhere;
}
.prg-doc-mini {
  font-size: 10px !important;
  color: #6f8784 !important;
}
.prg-doc-fact {
  padding: 11px 0;
  border-bottom: 1px solid #edf2f0;
}
.prg-doc-fact:last-child { border: 0 }
.prg-doc-fact strong {
  font-size: 12px;
  display: block;
  margin-bottom: 3px;
  overflow-wrap: anywhere;
}
.prg-preview-foot {
  padding: 13px 17px;
  border-top: 1px solid var(--edge);
  background: #fafdfc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--muted);
}
.prg-minirow {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 0;
  border-bottom: 1px solid #ebf1ef;
  font-size: 12px;
}
.prg-minirow:last-child { border: 0 }
.prg-minirow span { color: var(--muted) }
.prg-minirow strong { color: var(--ink); text-align: right }
.prg-check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  border: 1px solid var(--edge);
  border-radius: 9px;
  padding: 12px;
  margin-top: 10px;
  font-size: 12px;
  background: #fff;
}
.prg-check input {
  width: 16px;
  min-height: 16px;
  margin: 2px 0 0;
  accent-color: var(--teal);
  flex-shrink: 0;
}
.prg-empty {
  padding: 23px;
  border: 1px dashed #b8d2cb;
  border-radius: 11px;
  text-align: center;
  color: var(--muted);
  font-size: 12px;
}
.prg-list {
  padding: 0;
  margin: 12px 0 0;
  list-style: none;
}
.prg-list li {
  display: flex;
  gap: 8px;
  padding: 9px 0;
  font-size: 12px;
  border-bottom: 1px solid var(--edge);
}
.prg-list li:last-child { border: 0 }
.prg-dot {
  height: 7px;
  width: 7px;
  border-radius: 100%;
  background: var(--teal);
  margin-top: 6px;
  flex-shrink: 0;
}
.prg-pillrow {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  margin-top: 12px;
}
.prg-pill {
  border-radius: 999px;
  background: #e9f3f0;
  color: #255b59;
  padding: 5px 10px;
  font-size: 11px;
  font-weight: 750;
}
.prg-subtle { color: var(--muted); font-size: 11px }
.prg-review-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 18px;
}
.prg-stat {
  border: 1px solid var(--edge);
  border-radius: 11px;
  background: #f8fbfa;
  padding: 13px;
}
.prg-stat strong {
  display: block;
  font-size: 23px;
  letter-spacing: -.04em;
}
.prg-stat span { font-size: 10px; color: var(--muted) }
.prg-print-document { display: none }

@media (max-width: 880px) {
  .prg-layout { grid-template-columns: 1fr }
  .prg-preview { position: static }
  .prg-preview-content { height: 370px }
  .prg-review-grid { grid-template-columns: 1fr 1fr }
}
@media (max-width: 600px) {
  .prg-body { padding: 14px }
  .prg-pane { padding: 18px }
  .prg-grid,
  .prg-grid3 { grid-template-columns: 1fr }
  .prg-stepbar { padding: 13px; gap: 6px }
  .prg-step { padding: 8px 10px }
  .prg-toolbar { padding: 13px }
  .prg-actions { align-items: stretch; flex-direction: column }
  .prg-actions > div { justify-content: space-between }
  .prg-button { padding: 10px 11px }
  .prg-preview-head { padding: 17px }
  .prg-review-grid { grid-template-columns: 1fr 1fr }
}
@media print {
  body * { visibility: hidden !important }
  .prg-print-document,
  .prg-print-document * { visibility: visible !important }
  .prg-print-document {
    display: block !important;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background: white;
    color: #111;
    padding: 20px 28px;
    font-family: Arial, sans-serif;
    font-size: 11pt;
  }
  .prg-print-document h1 { font-size: 23pt; color: #063f40 }
  .prg-print-document h2 {
    font-size: 14pt;
    color: #063f40;
    margin-top: 22px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 5px;
  }
  .prg-print-document h3 { font-size: 11pt; margin-bottom: 5px }
  .prg-print-document p {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
  .prg-print-document section { break-inside: avoid }
  .prg-print-document .prg-print-meta { font-size: 9pt; color: #555 }
  .prg-root { border: 0 !important }
}
`;

const id = () => Math.random().toString(36).slice(2, 10);

const blankFact = () => ({
  id: id(),
  category: "Feature",
  title: "",
  claim: "",
  status: "Draft",
  sourceTitle: "",
  sourceUrl: "",
  verifiedBy: "",
  checked: "",
  market: "",
  plan: "",
  caveat: "",
  forbidden: "",
  nextReview: "",
});

const blankTerm = () => ({
  id: id(),
  avoid: "",
  use: "",
  note: "",
});

const iso = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || "");

const safeUrl = (url) => {
  try {
    const u = new URL(url);
    return ["http:", "https:"].includes(u.protocol) ? u.href : null;
  } catch {
    return null;
  }
};

const trim = (v) => String(v ?? "").trim();

const example = {
  product: "RelayLedger",
  company: "RelayLedger Ltd",
  summary:
    "A fictional accounts payable platform for UK finance teams that centralises invoice approvals and supplier records.",
  audience:
    "Finance directors, AP managers and financial controllers at UK companies with 50–500 employees.",
  market: "United Kingdom",
  version: "UK commercial plans · example v2.1",
  owner: "Priya Shah · Product Marketing",
  ownerEmail: "",
  lastUpdated: "2026-11-10",
  reviewCadence: "30",
  claimsPolicy:
    "Do not describe projected time savings as customer results. Never imply every plan includes API access, unlimited usage, or native accounting integrations. Use the current plan matrix for pricing statements; pricing is not approved for publication in this example.",
  approvalProcess:
    "Product Marketing reviews feature and integration claims. Commercial Operations approves plan descriptions. Legal approves security/compliance language before publication.",
  useCases:
    "Comparison pages, solution pages, sales one-pagers, product-led blog articles and agency briefs.",
  positioning:
    "Describe specific accounts payable workflows, not unsubstantiated efficiency gains.",
  terms: [
    {
      id: "term-1",
      avoid: "Seamless integration",
      use: "Connects to [named system] using [verified method]",
      note: "Name the system and confirm whether the connection is native, API-based or manual.",
    },
    {
      id: "term-2",
      avoid: "Unlimited approvals",
      use: "Approval limits depend on the subscribed plan",
      note: "Check the plan matrix before claiming a usage allowance.",
    },
    {
      id: "term-3",
      avoid: "Guaranteed time savings",
      use: "Describe the supported workflow without promising a result",
      note: "Quantified outcomes require an approved, sourced customer example.",
    },
  ],
  facts: [
    {
      id: "fact-1",
      category: "Feature",
      title: "Invoice approval queues",
      claim:
        "Teams can review and assign supplier invoices from a shared approval queue.",
      status: "Approved",
      sourceTitle: "Example product spec · Invoice workflow §2",
      sourceUrl: "",
      verifiedBy: "Priya Shah, Product Marketing",
      checked: "2026-11-10",
      market: "UK",
      plan: "Starter, Growth, Enterprise",
      caveat:
        "Approval routing options vary by plan; avoid saying all customers have custom workflows.",
      forbidden: "Automatically approves every invoice",
      nextReview: "2026-12-10",
    },
    {
      id: "fact-2",
      category: "Integration",
      title: "HubSpot record sync",
      claim:
        "The Growth plan supports syncing selected company fields with HubSpot using an API connector.",
      status: "Approved",
      sourceTitle: "Example integrations matrix · HubSpot row",
      sourceUrl: "",
      verifiedBy: "Elliot Brooks, Product Manager",
      checked: "2026-11-10",
      market: "UK",
      plan: "Growth and Enterprise",
      caveat:
        "Requires administrator setup and does not sync invoice line items.",
      forbidden: "One-click, bidirectional sync of every record",
      nextReview: "2026-12-10",
    },
    {
      id: "fact-3",
      category: "Pricing",
      title: "Commercial plan availability",
      claim:
        "RelayLedger offers Starter, Growth and Enterprise plans in the UK.",
      status: "Needs review",
      sourceTitle: "Example UK plan matrix · version 2.1",
      sourceUrl: "",
      verifiedBy: "",
      checked: "",
      market: "UK",
      plan: "All",
      caveat:
        "Specific prices and limits must be confirmed by Commercial Operations before publishing.",
      forbidden: "Starts at £X/month (without an approved price)",
      nextReview: "",
    },
    {
      id: "fact-4",
      category: "Limitation",
      title: "API availability",
      claim: "API access is not included with the Starter plan.",
      status: "Approved",
      sourceTitle: "Example API permissions · access table",
      sourceUrl: "",
      verifiedBy: "Elliot Brooks, Product Manager",
      checked: "2026-11-10",
      market: "UK",
      plan: "Starter restriction",
      caveat:
        "Do not frame Enterprise-only permissions as universally available.",
      forbidden: "API access on every plan",
      nextReview: "2026-12-10",
    },
    {
      id: "fact-5",
      category: "Security",
      title: "Security certifications",
      claim:
        "No public security certification statement is approved for use in marketing copy yet.",
      status: "Restricted",
      sourceTitle: "Example legal review tracker · SEC-04",
      sourceUrl: "",
      verifiedBy: "",
      checked: "",
      market: "UK",
      plan: "All",
      caveat:
        "Escalate requests for SOC 2, ISO 27001, GDPR or data residency claims to Legal.",
      forbidden: "SOC 2 certified; fully GDPR compliant",
      nextReview: "",
    },
  ],
};

const empty = () => ({
  product: "",
  company: "",
  summary: "",
  audience: "",
  market: "",
  version: "",
  owner: "",
  ownerEmail: "",
  lastUpdated: "",
  reviewCadence: "30",
  claimsPolicy: "",
  approvalProcess: "",
  useCases: "",
  positioning: "",
  terms: [],
  facts: [blankFact()],
});

const newSample = () => JSON.parse(JSON.stringify(example));

const sections = [
  "Product context",
  "Claims & language",
  "Verified facts",
  "Governance",
  "Review & export",
];

function formatDocument(data) {
  const l = [];
  const put = (...lines) => l.push(...lines);

  put(
    `# ${data.product || "Untitled product"} — Product Reference Guide`,
    "",
    `Example data: ${
      data.product === "RelayLedger"
        ? "This is a fictional demonstration. All source names are illustrative and must be replaced with real documentation."
        : "Verify all facts against your own authoritative sources before sharing."
    }`,
    "",
    "## Product context",
    `Company: ${data.company || "Not specified"}`,
    `Product: ${data.product || "Not specified"}`,
    `Market: ${data.market || "Not specified"}`,
    `Version / plan matrix: ${data.version || "Not specified"}`,
    `Product owner: ${data.owner || "Not specified"}`,
    `Last updated: ${data.lastUpdated || "Not specified"}`,
    "",
    `What it does: ${data.summary || "Not specified"}`,
    `Who it's for: ${data.audience || "Not specified"}`,
    `Content uses: ${data.useCases || "Not specified"}`,
    "",
    "## Messaging and claim boundaries",
    `Positioning: ${data.positioning || "Not specified"}`,
    `Claims to avoid: ${data.claimsPolicy || "Not specified"}`,
    "",
    "## Terminology"
  );

  if (!data.terms.length) put("No terminology rules added.");
  data.terms.forEach((t, i) =>
    put(
      `${i + 1}. Avoid: ${t.avoid || "—"}\n   Use: ${
        t.use || "—"
      }${t.note ? `\n   Note: ${t.note}` : ""}`
    )
  );

  put("", "## Product facts");
  if (!data.facts.length) put("No facts added.");

  data.facts.forEach((f, i) =>
    put(
      `### ${i + 1}. ${f.title || "Untitled fact"} [${f.category}]`,
      `Status: ${f.status}`,
      `Approved / proposed wording: ${f.claim || "Not supplied"}`,
      `Source: ${f.sourceTitle || "Missing"}${
        f.sourceUrl ? ` (${f.sourceUrl})` : ""
      }`,
      `Verified by: ${f.verifiedBy || "Not verified"}`,
      `Verified date: ${f.checked || "Not verified"}`,
      `Review due: ${f.nextReview || "Not scheduled"}`,
      `Market: ${f.market || "Not specified"}`,
      `Plan: ${f.plan || "Not specified"}`,
      `Caveats: ${f.caveat || "None recorded"}`,
      `Never say: ${f.forbidden || "None recorded"}`,
      ""
    )
  );

  put(
    "## Publishing controls",
    `Owner: ${data.owner || "Not specified"}`,
    `Review cadence: Every ${data.reviewCadence || "?"} days`,
    `Approval process: ${data.approvalProcess || "Not specified"}`,
    "",
    "Publishing rule: Only use Approved facts with a named source, reviewer and verification date, subject to their market, plan, caveats and review date. Needs review and Restricted entries are not approved for publication."
  );

  return l.join("\n");
}

function download(name, content, type) {
  const b = new Blob([content], { type });
  const u = URL.createObjectURL(b);
  const a = document.createElement("a");
  a.href = u;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}

function Field({ label, hint, children }) {
  return (
    <label className="prg-field">
      <span className="prg-label">{label}</span>
      {children}
      {hint && <span className="prg-hint">{hint}</span>}
    </label>
  );
}

function Button({ children, kind = "alt", small = false, ...props }) {
  return (
    <button
      type="button"
      className={`prg-button ${kind} ${small ? "small" : ""}`}
      {...props}
    >
      {children}
    </button>
  );
}

const suffix = (s) =>
  String(s || "product")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 45) || "product";

export const faqs = [
  {
    question: "Can writers use every fact in the guide?",
    answer:
      "No. Only facts marked Approved with a named source, reviewer, verification date and relevant plan or market restrictions should be considered for publication. Draft, Needs review and Restricted entries must not be published as approved claims.",
  },
  {
    question: "How should we keep the guide current?",
    answer:
      "Assign an owner, add authoritative source references and verification dates, and recheck pricing, integrations and plan limits whenever the product changes. The guide flags incomplete and overdue claims.",
  },
  {
    question: "How can I share the guide?",
    answer:
      "Copy the complete document, download a Markdown file, or print/save a PDF using your browser. Your changes stay in this page unless you export them; the example sources are fictional.",
  },
];

export default function ProductReferenceGuide() {
  const [data, setData] = useState(newSample);
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState("guide");
  const [filter, setFilter] = useState("All");
  const [showOnlyIssues, setShowOnlyIssues] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [notice, setNotice] = useState("");

  const update = (field, value) =>
    setData((d) => ({ ...d, [field]: value }));

  const updateFact = (fid, key, value) =>
    setData((d) => ({
      ...d,
      facts: d.facts.map((f) =>
        f.id === fid ? { ...f, [key]: value } : f
      ),
    }));

  const updateTerm = (tid, key, value) =>
    setData((d) => ({
      ...d,
      terms: d.terms.map((t) =>
        t.id === tid ? { ...t, [key]: value } : t
      ),
    }));

  const removeFact = (fid) =>
    setData((d) => ({
      ...d,
      facts: d.facts.filter((f) => f.id !== fid),
    }));

  const removeTerm = (tid) =>
    setData((d) => ({
      ...d,
      terms: d.terms.filter((t) => t.id !== tid),
    }));

  const stats = useMemo(() => {
    const total = data.facts.length;
    const today = new Date().toISOString().slice(0, 10);

    const complete = (f) =>
      Boolean(
        trim(f.title) &&
          trim(f.claim) &&
          trim(f.sourceTitle) &&
          trim(f.verifiedBy) &&
          iso(f.checked) &&
          trim(f.market) &&
          trim(f.plan)
      );

    const overdue = (f) =>
      f.status === "Approved" &&
      !!f.nextReview &&
      iso(f.nextReview) &&
      f.nextReview < today;

    const approved = data.facts.filter(
      (f) => f.status === "Approved" && complete(f) && !overdue(f)
    ).length;

    const flagged = data.facts.filter(
      (f) => f.status !== "Approved" || !complete(f) || overdue(f)
    ).length;

    const scoreItems = [
      !!trim(data.product),
      !!trim(data.summary),
      !!trim(data.audience),
      !!trim(data.market),
      !!trim(data.owner),
      !!trim(data.claimsPolicy),
      !!trim(data.approvalProcess),
      data.terms.some((t) => trim(t.avoid) && trim(t.use)),
      total > 0,
      total > 0 && flagged === 0,
    ];

    return {
      total,
      approved,
      flagged,
      complete,
      overdue,
      readiness: Math.round(
        (scoreItems.filter(Boolean).length / scoreItems.length) * 100
      ),
      today,
    };
  }, [data]);

  const filteredFacts = data.facts.filter(
    (f) =>
      (filter === "All" || f.category === filter) &&
      (!showOnlyIssues ||
        f.status !== "Approved" ||
        !stats.complete(f) ||
        stats.overdue(f))
  );

  const fullText = useMemo(() => formatDocument(data), [data]);

  const useExample = () => {
    setData(newSample());
    setStep(0);
    setFilter("All");
    setShowOnlyIssues(false);
    setNotice(
      "Fictional RelayLedger example loaded. Replace all demonstration sources before using it publicly."
    );
    setConfirmReset(false);
  };

  const fresh = () => {
    setData(empty());
    setStep(0);
    setFilter("All");
    setShowOnlyIssues(false);
    setNotice("New blank product reference started.");
    setConfirmReset(false);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setNotice("Complete reference copied.");
    } catch {
      setNotice("Clipboard unavailable. Use Download .md instead.");
    }
  };

  const exportCSV = () => {
    const rows = [
      [
        "Category",
        "Title",
        "Status",
        "Approved wording",
        "Source",
        "Source URL",
        "Verified by",
        "Verified date",
        "Review due",
        "Market",
        "Plan",
        "Caveat",
        "Never say",
      ],
      ...data.facts.map((f) => [
        f.category,
        f.title,
        f.status,
        f.claim,
        f.sourceTitle,
        f.sourceUrl,
        f.verifiedBy,
        f.checked,
        f.nextReview,
        f.market,
        f.plan,
        f.caveat,
        f.forbidden,
      ]),
    ];

    const csv = rows
      .map((r) =>
        r.map((v) => '"' + String(v ?? "").replaceAll('"', '""') + '"').join(",")
      )
      .join("\r\n");

    download(
      `${suffix(data.product)}-product-facts.csv`,
      "\uFEFF" + csv,
      "text/csv;charset=utf-8;"
    );
  };

  const setExampleField = (key) => ({
    value: data[key],
    onChange: (e) => update(key, e.target.value),
  });

  const warnings = [];
  if (!trim(data.product)) warnings.push("Add a product name.");
  if (!trim(data.owner))
    warnings.push("Name the owner responsible for keeping the guide current.");
  if (!trim(data.claimsPolicy))
    warnings.push("Document claims that content teams must avoid.");
  if (!trim(data.approvalProcess))
    warnings.push("Set a review and approval process.");
  if (!data.facts.length) warnings.push("Add at least one product fact.");

  data.facts.forEach((f, i) => {
    if (f.status === "Approved" && !stats.complete(f))
      warnings.push(
        `Fact ${i + 1}: Approved status requires wording, source, verifier, verification date, market and plan.`
      );
    if (stats.overdue(f))
      warnings.push(
        `Fact ${i + 1}: Review date has passed; reverify this fact.`
      );
  });

  return (
    <div className="prg-root">
      <style>{css}</style>
      <div className="prg-wrap">
        <div className="prg-toolbar">
          <div className="prg-toolbar-note">
            <strong style={{ color: "#0f6262" }}>PRODUCT REFERENCE</strong>
            <span>·</span>One source of truth for content teams
          </div>
          <div className="prg-row">
            <Button kind="ghost" small onClick={useExample}>
              ↻ Use example
            </Button>
            <Button kind="ghost" small onClick={() => setConfirmReset(true)}>
              ＋ Start fresh
            </Button>
          </div>
        </div>

        {notice && (
          <div
            role="status"
            style={{
              background: "#eef7f4",
              color: "#185f5d",
              fontSize: 12,
              padding: "9px 22px",
              borderBottom: "1px solid #d7e5e2",
            }}
          >
            {notice}{" "}
            <button
              type="button"
              style={{
                border: 0,
                background: "none",
                float: "right",
                color: "inherit",
              }}
              onClick={() => setNotice("")}
            >
              ×
            </button>
          </div>
        )}

        <div className="prg-stepbar" aria-label="Reference guide sections">
          {sections.map((s, i) => (
            <button
              key={s}
              type="button"
              className="prg-step"
              aria-current={step === i ? "step" : undefined}
              onClick={() => setStep(i)}
            >
              <span className="prg-num">{i + 1}</span>
              {s}
            </button>
          ))}
        </div>

        <div className="prg-progress">
          <span style={{ width: `${((step + 1) / sections.length) * 100}%` }} />
        </div>

        <div className="prg-body">
          <div className="prg-layout">
            <main className="prg-editor">
              <div className="prg-pane">
                {step === 0 && (
                  <>
                    <span className="prg-kicker">01 / THE PRODUCT</span>
                    <h2>Give writers the right context.</h2>
                    <p className="prg-muted">
                      Make it obvious which product, audience, market and
                      release these guidelines apply to. The information here
                      appears at the top of the reference.
                    </p>

                    <div className="prg-grid">
                      <Field label="Product name">
                        <input
                          placeholder="e.g. RelayLedger"
                          {...setExampleField("product")}
                        />
                      </Field>
                      <Field label="Company">
                        <input
                          placeholder="e.g. RelayLedger Ltd"
                          {...setExampleField("company")}
                        />
                      </Field>
                    </div>

                    <Field
                      label="What does the product actually do?"
                      hint="Write a factual description, not a tagline."
                    >
                      <textarea
                        rows={3}
                        placeholder="Explain the problem, workflow and outcome without making unsupported promises."
                        {...setExampleField("summary")}
                      />
                    </Field>

                    <Field label="Who is the content written for?">
                      <textarea
                        rows={2}
                        placeholder="Roles, company sizes, industries and buying context"
                        {...setExampleField("audience")}
                      />
                    </Field>

                    <div className="prg-grid">
                      <Field label="Market / geography">
                        <input
                          placeholder="e.g. United Kingdom"
                          {...setExampleField("market")}
                        />
                      </Field>
                      <Field label="Version or applicable plans">
                        <input
                          placeholder="e.g. UK plans, v2.1"
                          {...setExampleField("version")}
                        />
                      </Field>
                    </div>

                    <Field label="Where will writers use this guide?">
                      <textarea
                        rows={2}
                        placeholder="Comparison pages, website copy, blog posts, sales material…"
                        {...setExampleField("useCases")}
                      />
                    </Field>

                    <div className="prg-info">
                      <strong>Why market and version matter:</strong> a feature
                      available to Enterprise customers in the UK may not be
                      available on Starter or in another region. Record those
                      boundaries before content is commissioned.
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <span className="prg-kicker">02 / MESSAGING GUARDRAILS</span>
                    <h2>What can writers safely say?</h2>
                    <p className="prg-muted">
                      Separate approved product positioning from wording that
                      can create inaccurate or misleading claims.
                    </p>

                    <Field
                      label="Core product positioning"
                      hint="What should every writer understand about the product, in plain English?"
                    >
                      <textarea
                        rows={3}
                        placeholder="Describe the workflow and ideal buyer without exaggeration."
                        {...setExampleField("positioning")}
                      />
                    </Field>

                    <Field
                      label="Claims writers must avoid"
                      hint="Be specific about unsupported outcomes, guarantees, plan access, security and certification statements."
                    >
                      <textarea
                        rows={4}
                        placeholder="e.g. Never say all plans have API access or that users are guaranteed to save X hours."
                        {...setExampleField("claimsPolicy")}
                      />
                    </Field>

                    <div className="prg-section">
                      <div className="prg-section-head">
                        <h3>Words and phrases to control</h3>
                        <Button
                          kind="alt"
                          small
                          onClick={() =>
                            setData((d) => ({
                              ...d,
                              terms: [...d.terms, blankTerm()],
                            }))
                          }
                        >
                          ＋ Add phrase
                        </Button>
                      </div>
                      <p className="prg-muted">
                        Give a concrete replacement instead of simply banning
                        buzzwords.
                      </p>

                      {!data.terms.length && (
                        <div className="prg-empty" style={{ marginTop: 14 }}>
                          No terminology rules yet. Add a phrase writers should
                          replace.
                        </div>
                      )}

                      {data.terms.map((t, i) => (
                        <div className="prg-card" key={t.id}>
                          <div className="prg-cardtop">
                            <strong>Phrase {i + 1}</strong>
                            <Button
                              small
                              kind="danger"
                              onClick={() => removeTerm(t.id)}
                            >
                              Remove
                            </Button>
                          </div>
                          <div className="prg-grid">
                            <Field label="Avoid">
                              <input
                                placeholder="e.g. Seamless integration"
                                value={t.avoid}
                                onChange={(e) =>
                                  updateTerm(t.id, "avoid", e.target.value)
                                }
                              />
                            </Field>
                            <Field label="Write instead">
                              <input
                                placeholder="Name the system and method"
                                value={t.use}
                                onChange={(e) =>
                                  updateTerm(t.id, "use", e.target.value)
                                }
                              />
                            </Field>
                          </div>
                          <Field label="When this rule applies">
                            <input
                              placeholder="e.g. Check whether connection is native or API-based"
                              value={t.note}
                              onChange={(e) =>
                                updateTerm(t.id, "note", e.target.value)
                              }
                            />
                          </Field>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <span className="prg-kicker">
                      03 / PRODUCT FACT LIBRARY
                    </span>
                    <h2>Build a source-backed fact library.</h2>
                    <p className="prg-muted">
                      One fact per entry. Record what can be said, who checked
                      it, and which customers or markets it applies to.
                    </p>

                    <div className="prg-pillrow">
                      <span className="prg-pill">{stats.total} facts</span>
                      <span className="prg-pill">
                        {stats.approved} publish-ready
                      </span>
                      <span className="prg-pill">
                        {stats.flagged} need attention
                      </span>
                    </div>

                    <div className="prg-row" style={{ marginTop: 18 }}>
                      <div style={{ minWidth: 160, flex: 1 }}>
                        <select
                          aria-label="Filter fact category"
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                        >
                          {[
                            "All",
                            "Feature",
                            "Pricing",
                            "Integration",
                            "Limitation",
                            "Security",
                            "Customer result",
                            "Other",
                          ].map((v) => (
                            <option key={v}>{v}</option>
                          ))}
                        </select>
                      </div>
                      <Button
                        kind="alt"
                        small
                        onClick={() => {
                          setData((d) => ({
                            ...d,
                            facts: [...d.facts, blankFact()],
                          }));
                          setFilter("All");
                          setShowOnlyIssues(false);
                        }}
                      >
                        ＋ Add fact
                      </Button>
                    </div>

                    <label className="prg-check">
                      <input
                        type="checkbox"
                        checked={showOnlyIssues}
                        onChange={(e) => setShowOnlyIssues(e.target.checked)}
                      />
                      <span>
                        Show only facts that need review or have missing
                        evidence
                      </span>
                    </label>

                    {filteredFacts.length === 0 && (
                      <div className="prg-empty">
                        No facts match this filter. Clear the filter or add
                        another fact.
                      </div>
                    )}

                    {filteredFacts.map((f) => {
                      const number =
                        data.facts.findIndex((x) => x.id === f.id) + 1;
                      const ready =
                        stats.complete(f) &&
                        f.status === "Approved" &&
                        !stats.overdue(f);

                      return (
                        <div className="prg-card" key={f.id}>
                          <div className="prg-cardtop">
                            <div>
                              <strong>
                                Fact {String(number).padStart(2, "0")} ·{" "}
                                {f.title || "Untitled"}
                              </strong>
                              <div className="prg-cardmeta">
                                {ready
                                  ? "Publish-ready, subject to stated caveats"
                                  : stats.overdue(f)
                                  ? "Review overdue"
                                  : "Not ready for publication"}
                              </div>
                            </div>
                            <span
                              className={`prg-badge ${
                                ready
                                  ? "approved"
                                  : f.status === "Restricted"
                                  ? "restricted"
                                  : "review"
                              }`}
                            >
                              {ready ? "Approved" : f.status}
                            </span>
                          </div>

                          <div className="prg-grid">
                            <Field label="Category">
                              <select
                                value={f.category}
                                onChange={(e) =>
                                  updateFact(
                                    f.id,
                                    "category",
                                    e.target.value
                                  )
                                }
                              >
                                {[
                                  "Feature",
                                  "Pricing",
                                  "Integration",
                                  "Limitation",
                                  "Security",
                                  "Customer result",
                                  "Other",
                                ].map((v) => (
                                  <option key={v}>{v}</option>
                                ))}
                              </select>
                            </Field>
                            <Field label="Review status">
                              <select
                                value={f.status}
                                onChange={(e) =>
                                  updateFact(f.id, "status", e.target.value)
                                }
                              >
                                {[
                                  "Draft",
                                  "Needs review",
                                  "Approved",
                                  "Restricted",
                                ].map((v) => (
                                  <option key={v}>{v}</option>
                                ))}
                              </select>
                            </Field>
                          </div>

                          <Field label="Internal fact title">
                            <input
                              placeholder="e.g. API access on Enterprise"
                              value={f.title}
                              onChange={(e) =>
                                updateFact(f.id, "title", e.target.value)
                              }
                            />
                          </Field>

                          <Field
                            label="Approved or proposed wording"
                            hint="Use exactly what writers are permitted to publish, subject to approval status."
                          >
                            <textarea
                              rows={2}
                              value={f.claim}
                              onChange={(e) =>
                                updateFact(f.id, "claim", e.target.value)
                              }
                              placeholder="e.g. Enterprise customers can access the public API."
                            />
                          </Field>

                          <div className="prg-grid">
                            <Field label="Authoritative source">
                              <input
                                placeholder="Document title, section or ticket ID"
                                value={f.sourceTitle}
                                onChange={(e) =>
                                  updateFact(
                                    f.id,
                                    "sourceTitle",
                                    e.target.value
                                  )
                                }
                              />
                            </Field>
                            <Field label="Source URL (optional)">
                              <input
                                placeholder="https://…"
                                type="url"
                                value={f.sourceUrl}
                                onChange={(e) =>
                                  updateFact(
                                    f.id,
                                    "sourceUrl",
                                    e.target.value
                                  )
                                }
                              />
                            </Field>
                          </div>

                          {f.sourceUrl && !safeUrl(f.sourceUrl) && (
                            <span
                              className="prg-hint"
                              style={{ color: "#a14340" }}
                            >
                              Use a complete http:// or https:// URL.
                            </span>
                          )}

                          <div className="prg-grid3">
                            <Field label="Verified by">
                              <input
                                placeholder="Name and team"
                                value={f.verifiedBy}
                                onChange={(e) =>
                                  updateFact(
                                    f.id,
                                    "verifiedBy",
                                    e.target.value
                                  )
                                }
                              />
                            </Field>
                            <Field label="Verified on">
                              <input
                                type="date"
                                value={f.checked}
                                onChange={(e) =>
                                  updateFact(f.id, "checked", e.target.value)
                                }
                              />
                            </Field>
                            <Field label="Next review">
                              <input
                                type="date"
                                value={f.nextReview}
                                onChange={(e) =>
                                  updateFact(
                                    f.id,
                                    "nextReview",
                                    e.target.value
                                  )
                                }
                              />
                            </Field>
                          </div>

                          <div className="prg-grid">
                            <Field label="Market / region">
                              <input
                                placeholder="e.g. UK only"
                                value={f.market}
                                onChange={(e) =>
                                  updateFact(f.id, "market", e.target.value)
                                }
                              />
                            </Field>
                            <Field label="Plans / tiers">
                              <input
                                placeholder="e.g. Growth, Enterprise"
                                value={f.plan}
                                onChange={(e) =>
                                  updateFact(f.id, "plan", e.target.value)
                                }
                              />
                            </Field>
                          </div>

                          <Field label="Caveats, limits and exceptions">
                            <textarea
                              rows={2}
                              placeholder="e.g. Administrator setup required; does not sync invoice line items."
                              value={f.caveat}
                              onChange={(e) =>
                                updateFact(f.id, "caveat", e.target.value)
                              }
                            />
                          </Field>

                          <Field label="What writers must NOT say">
                            <textarea
                              rows={2}
                              placeholder="e.g. Available to every customer"
                              value={f.forbidden}
                              onChange={(e) =>
                                updateFact(f.id, "forbidden", e.target.value)
                              }
                            />
                          </Field>

                          <div className="prg-row" style={{ marginTop: 12 }}>
                            <span className="prg-subtle">
                              Use “Approved” only after checking the source and
                              caveats.
                            </span>
                            <Button
                              kind="danger"
                              small
                              onClick={() => removeFact(f.id)}
                            >
                              Remove fact
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}

                {step === 3 && (
                  <>
                    <span className="prg-kicker">04 / OWNER & REVIEW</span>
                    <h2>Keep claims current.</h2>
                    <p className="prg-muted">
                      Product information changes. Name the people who sign it
                      off and establish when content must be checked again.
                    </p>

                    <Field label="Guide owner">
                      <input
                        placeholder="e.g. Product Marketing Lead"
                        {...setExampleField("owner")}
                      />
                    </Field>

                    <Field label="Owner's email (optional)">
                      <input
                        type="email"
                        placeholder="owner@company.com"
                        {...setExampleField("ownerEmail")}
                      />
                    </Field>

                    <div className="prg-grid">
                      <Field label="Last reviewed">
                        <input
                          type="date"
                          {...setExampleField("lastUpdated")}
                        />
                      </Field>
                      <Field label="Default review interval">
                        <select {...setExampleField("reviewCadence")}>
                          <option value="14">Every 14 days</option>
                          <option value="30">Every 30 days</option>
                          <option value="60">Every 60 days</option>
                          <option value="90">Every 90 days</option>
                        </select>
                      </Field>
                    </div>

                    <Field
                      label="Who approves which claims?"
                      hint="E.g. Product: feature capabilities; Commercial: pricing; Legal: security and compliance."
                    >
                      <textarea
                        rows={5}
                        placeholder="Define a practical review workflow and the final sign-off owner."
                        {...setExampleField("approvalProcess")}
                      />
                    </Field>

                    <div className="prg-info">
                      <strong>Recommended publishing rule:</strong> A fact
                      marked Approved should still be held if its source is
                      missing, review date is overdue, or its market and plan
                      restrictions do not match the intended page.
                    </div>

                    <div className="prg-section">
                      <div className="prg-section-head">
                        <h3>Fact health</h3>
                        <span className="prg-count">
                          {stats.approved} of {stats.total} publish-ready
                        </span>
                      </div>

                      {data.facts.map((f, i) => (
                        <div className="prg-minirow" key={f.id}>
                          <span>
                            {String(i + 1).padStart(2, "0")}.{" "}
                            {f.title || "Untitled fact"}
                          </span>
                          <strong
                            style={{
                              color:
                                stats.complete(f) &&
                                f.status === "Approved" &&
                                !stats.overdue(f)
                                  ? "#1a7356"
                                  : "#9c5c15",
                            }}
                          >
                            {stats.overdue(f)
                              ? "Overdue"
                              : stats.complete(f) && f.status === "Approved"
                              ? "Ready"
                              : f.status}
                          </strong>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <span className="prg-kicker">05 / FINAL REVIEW</span>
                    <h2>Check before you share.</h2>
                    <p className="prg-muted">
                      The reference can be exported at any time. Publish-ready
                      facts must have complete verification details; the rest
                      remain clearly marked as drafts or restricted.
                    </p>

                    <div className="prg-review-grid">
                      <div className="prg-stat">
                        <strong>{stats.readiness}%</strong>
                        <span>Guide completeness</span>
                      </div>
                      <div className="prg-stat">
                        <strong>{stats.approved}</strong>
                        <span>Publish-ready facts</span>
                      </div>
                      <div className="prg-stat">
                        <strong>{stats.flagged}</strong>
                        <span>Facts to review</span>
                      </div>
                    </div>

                    <div className="prg-section">
                      <div className="prg-section-head">
                        <h3>Pre-sharing checks</h3>
                        <span className="prg-count">
                          {warnings.length} alerts
                        </span>
                      </div>

                      {warnings.length ? (
                        <ul className="prg-list">
                          {warnings.map((w, i) => (
                            <li key={i}>
                              <span
                                className="prg-dot"
                                style={{ background: "#ca8c43" }}
                              />{" "}
                              {w}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="prg-info">
                          The guide has its required governance information
                          and no Approved facts are missing mandatory evidence.
                          Confirm facts are suitable for the intended content
                          before publishing.
                        </div>
                      )}
                    </div>

                    <div className="prg-section">
                      <div className="prg-section-head">
                        <h3>Export your reference</h3>
                      </div>
                      <p className="prg-muted">
                        Export the full guide—including statuses, sources,
                        reviewer names, dates, restrictions and phrase
                        rules—not just the preview shown alongside this form.
                      </p>

                      <div
                        className="prg-row"
                        style={{ marginTop: 16, justifyContent: "flex-start" }}
                      >
                        <Button kind="primary" onClick={copy}>
                          {copied ? "✓ Copied" : "Copy full guide"}
                        </Button>
                        <Button
                          onClick={() =>
                            download(
                              `${suffix(data.product)}-product-reference.md`,
                              fullText,
                              "text/markdown;charset=utf-8"
                            )
                          }
                        >
                          ↓ Download Markdown
                        </Button>
                        <Button onClick={exportCSV}>↓ Export facts CSV</Button>
                        <Button onClick={() => window.print()}>
                          ↗ Save as PDF
                        </Button>
                      </div>
                    </div>

                    <div className="prg-warning">
                      <strong>Important:</strong> This is an editorial
                      reference, not an automatic fact-checker. A status
                      selected by a user does not establish that the
                      underlying product claim is true. Check authoritative
                      sources before publication.
                    </div>
                  </>
                )}

                <div className="prg-actions">
                  <div>
                    <Button
                      disabled={step === 0}
                      onClick={() => setStep((s) => Math.max(0, s - 1))}
                    >
                      ← Back
                    </Button>
                  </div>
                  <div>
                    {step < 4 ? (
                      <Button
                        kind="primary"
                        onClick={() => setStep((s) => Math.min(4, s + 1))}
                      >
                        Continue →
                      </Button>
                    ) : (
                      <Button kind="primary" onClick={copy}>
                        Copy guide ↗
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </main>

            <aside className="prg-preview" aria-label="Live product reference preview">
              <div className="prg-preview-head">
                <div className="prg-kicker">● LIVE DOCUMENT</div>
                <h3>{data.product || "Your product"}</h3>
                <p>
                  Product Reference Guide · {data.market || "Market not specified"}
                </p>
                <div className="prg-score">
                  <span>Reference readiness</span>
                  <strong>{stats.readiness}%</strong>
                </div>
                <div className="prg-meter">
                  <span style={{ width: `${stats.readiness}%` }} />
                </div>
              </div>

              <div className="prg-tabs">
                <button
                  className={tab === "guide" ? "active" : ""}
                  onClick={() => setTab("guide")}
                >
                  Reference
                </button>
                <button
                  className={tab === "facts" ? "active" : ""}
                  onClick={() => setTab("facts")}
                >
                  Facts ({stats.total})
                </button>
                <button
                  className={tab === "checks" ? "active" : ""}
                  onClick={() => setTab("checks")}
                >
                  Checks ({stats.flagged})
                </button>
              </div>

              <div className="prg-preview-content">
                {tab === "guide" && (
                  <>
                    <div className="prg-doc-section">
                      <h4>Product at a glance</h4>
                      <p>
                        <strong>What it does:</strong>{" "}
                        {data.summary || "Add a factual product description."}
                      </p>
                      <p>
                        <strong>Who it's for:</strong>{" "}
                        {data.audience || "Add your target audience."}
                      </p>
                      <p>
                        <strong>Applies to:</strong>{" "}
                        {[data.market, data.version].filter(Boolean).join(" · ") ||
                          "Not specified"}
                      </p>
                    </div>

                    <div className="prg-doc-section">
                      <h4>Messaging</h4>
                      <p>{data.positioning || "Add the core positioning."}</p>
                      <p>
                        <strong>Do not claim:</strong>{" "}
                        {data.claimsPolicy || "Add restrictions on marketing claims."}
                      </p>
                    </div>

                    <div className="prg-doc-section">
                      <h4>Approved terminology</h4>
                      {data.terms.length ? (
                        data.terms.map((t) => (
                          <p key={t.id}>
                            <strong>{t.avoid || "Unspecified phrase"}</strong> →{" "}
                            {t.use || "Add replacement"}
                          </p>
                        ))
                      ) : (
                        <p>Add preferred phrases and forbidden language.</p>
                      )}
                    </div>

                    <div className="prg-doc-section">
                      <h4>Publishing control</h4>
                      <p>Owner: {data.owner || "Not assigned"}</p>
                      <p>Review: every {data.reviewCadence} days</p>
                      <p>{data.approvalProcess || "Set an approval process."}</p>
                    </div>
                  </>
                )}

                {tab === "facts" && (
                  <>
                    <div className="prg-doc-section">
                      <h4>Product claims</h4>
                      <p className="prg-doc-mini">
                        {stats.approved} publish-ready / {stats.total} total.
                        Draft or restricted claims are shown for reference only.
                      </p>
                    </div>

                    {data.facts.length ? (
                      data.facts.map((f) => (
                        <div className="prg-doc-fact" key={f.id}>
                          <div
                            className="prg-row"
                            style={{ marginBottom: 4 }}
                          >
                            <strong>{f.title || "Untitled fact"}</strong>
                            <span
                              className={`prg-badge ${
                                stats.complete(f) &&
                                !stats.overdue(f) &&
                                f.status === "Approved"
                                  ? "approved"
                                  : "review"
                              }`}
                            >
                              {f.status}
                            </span>
                          </div>
                          <p>{f.claim || "No wording entered"}</p>
                          <p className="prg-doc-mini">
                            {f.category} · {f.plan || "Plan unknown"} ·{" "}
                            {f.market || "Market unknown"}
                          </p>
                          <p className="prg-doc-mini">
                            Source: {f.sourceTitle || "Missing"} · Checked:{" "}
                            {f.checked || "Not verified"}
                          </p>
                          {f.caveat && (
                            <p className="prg-doc-mini">Caveat: {f.caveat}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="prg-empty">No product facts yet.</div>
                    )}
                  </>
                )}

                {tab === "checks" && (
                  <>
                    <div className="prg-doc-section">
                      <h4>Readiness checks</h4>
                      <div className="prg-minirow">
                        <span>Fully evidenced, approved facts</span>
                        <strong>{stats.approved}</strong>
                      </div>
                      <div className="prg-minirow">
                        <span>Entries needing attention</span>
                        <strong>{stats.flagged}</strong>
                      </div>
                      <div className="prg-minirow">
                        <span>Terminology rules</span>
                        <strong>{data.terms.length}</strong>
                      </div>
                    </div>

                    {warnings.length ? (
                      warnings.map((w, i) => (
                        <div key={i} className="prg-warning">
                          {w}
                        </div>
                      ))
                    ) : (
                      <div className="prg-info">
                        No required-data alerts. Continue checking live product
                        changes before publishing.
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="prg-preview-foot">
                <span>Changes update immediately</span>
                <button
                  type="button"
                  style={{
                    border: 0,
                    background: "none",
                    color: "#167273",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                  onClick={() => setStep(4)}
                >
                  Review & export →
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {confirmReset && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Start a fresh guide"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(1, 21, 34, .58)",
            display: "grid",
            placeItems: "center",
            padding: 15,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 14,
              padding: 25,
              maxWidth: 410,
              width: "100%",
              boxShadow: "0 20px 70px rgba(0,0,0,.2)",
            }}
          >
            <h3 style={{ margin: "0 0 9px", fontSize: 20 }}>
              Start with a blank guide?
            </h3>
            <p className="prg-muted">
              This clears the current entries in this tab. Export anything you
              want to keep first.
            </p>
            <div
              className="prg-row"
              style={{ marginTop: 22, justifyContent: "flex-end" }}
            >
              <Button onClick={() => setConfirmReset(false)}>Cancel</Button>
              <Button kind="danger" onClick={fresh}>
                Clear and start fresh
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="prg-print-document">
        <h1>{data.product || "Untitled product"} — Product Reference Guide</h1>
        <p className="prg-print-meta">
          {data.market || "Market unspecified"} ·{" "}
          {data.version || "Version unspecified"} · Owner:{" "}
          {data.owner || "Unassigned"}
        </p>

        <h2>Product context</h2>
        <p>
          <strong>What it does:</strong> {data.summary}
        </p>
        <p>
          <strong>Audience:</strong> {data.audience}
        </p>
        <p>
          <strong>Content uses:</strong> {data.useCases}
        </p>

        <h2>Messaging boundaries</h2>
        <p>{data.positioning}</p>
        <p>
          <strong>Claims to avoid:</strong> {data.claimsPolicy}
        </p>

        <h2>Terminology</h2>
        {data.terms.map((t) => (
          <section key={t.id}>
            <p>
              <strong>Avoid:</strong> {t.avoid}
              <br />
              <strong>Use:</strong> {t.use}
              <br />
              {t.note}
            </p>
          </section>
        ))}

        <h2>Product facts</h2>
        {data.facts.map((f) => (
          <section key={f.id}>
            <h3>
              {f.title || "Untitled"} — {f.category} [{f.status}]
            </h3>
            <p>
              <strong>Wording:</strong> {f.claim}
              <br />
              <strong>Source:</strong> {f.sourceTitle} {f.sourceUrl}
              <br />
              <strong>Verified by:</strong> {f.verifiedBy || "Not verified"} |{" "}
              <strong>Date:</strong> {f.checked || "Not verified"} |{" "}
              <strong>Review due:</strong> {f.nextReview || "Not set"}
              <br />
              <strong>Market:</strong> {f.market || "Not specified"} |{" "}
              <strong>Plan:</strong> {f.plan || "Not specified"}
              <br />
              <strong>Caveat:</strong> {f.caveat || "None recorded"}
              <br />
              <strong>Never say:</strong> {f.forbidden || "None recorded"}
            </p>
          </section>
        ))}

        <h2>Governance</h2>
        <p>{data.approvalProcess}</p>
        <p>
          Review cadence: Every {data.reviewCadence} days. Only publish Approved
          claims backed by sources and current verification.
        </p>
        <p style={{ fontSize: "9pt" }}>
          RelayLedger examples are fictional demonstration data. Replace all
          sample sources with actual product records before publication.
        </p>
      </div>
    </div>
  );
}