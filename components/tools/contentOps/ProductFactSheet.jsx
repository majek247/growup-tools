import React, { useEffect, useMemo, useState } from "react";

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
  width: 100%;
  max-width: 1320px;
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

.prg-body {
  padding: 28px;
}

.prg-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: 24px;
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
  flex: 1;
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  color: #607979;
  font-size: 11px;
  font-weight: 750;
  padding: 13px 10px;
  text-align: center;
  transition: color .15s, background .15s;
}

.prg-tabs button:hover {
  background: #eef5f3;
  color: #0c6262;
}
.prg-tabs button.active {
  color: #0c6262;
  border-color: var(--teal);
}
.prg-preview-content {
  height: 580px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px;
  scrollbar-width: thin;
  scrollbar-color: #c8dcd7 transparent;
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
  padding: 22px 0;
  border-bottom: 1px solid #e5eeeb;
}

.prg-doc-fact:first-of-type {
  padding-top: 8px;
}

.prg-doc-fact:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.prg-fact-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.prg-fact-title {
  font-size: 13px;
  font-weight: 800;
  line-height: 1.45;
  color: var(--ink);
  margin: 0;
}

.prg-fact-claim {
  font-size: 13px;
  line-height: 1.75;
  color: var(--ink);
  margin: 0 0 13px;
  overflow-wrap: anywhere;
}

.prg-fact-details {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 13px;
}

.prg-fact-detail {
  font-size: 10px;
  color: #52716d;
  background: #eef5f3;
  border-radius: 5px;
  padding: 5px 8px;
}

.prg-fact-source {
  background: #f7faf9;
  border: 1px solid #e5eeeb;
  border-radius: 8px;
  padding: 12px 13px;
  margin-top: 10px;
}

.prg-fact-source-label {
  display: block;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--teal);
  margin-bottom: 5px;
}

.prg-fact-source-text {
  font-size: 11px;
  line-height: 1.6;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.prg-fact-caveat {
  margin-top: 11px;
  font-size: 11px;
  line-height: 1.65;
  color: #657d79;
}

.prg-fact-caveat strong {
  color: #375b57;
  font-weight: 750;
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
  @page {
    size: A4;
    margin: 14mm;
  }

  body,
  html {
    background: #ffffff !important;
  }

  body * {
    visibility: hidden !important;
  }

  .prg-print-document,
  .prg-print-document * {
    visibility: visible !important;
  }

  .prg-print-document {
    display: block !important;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: #ffffff;
    color: #073738;
    font-family: Arial, sans-serif;
    font-size: 10pt;
    line-height: 1.6;
    padding: 0;
  }

  .prg-print-header {
    background: #073738 !important;
    color: #ffffff !important;
    padding: 28px 30px;
    margin-bottom: 25px;
    border-radius: 6px;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .prg-print-brand {
    font-size: 10pt;
    font-weight: 800;
    letter-spacing: .06em;
    margin-bottom: 24px;
  }

  .prg-print-eyebrow {
    color: #a5dfd3 !important;
    font-size: 8pt;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
  }

  .prg-print-header h1 {
    font-size: 27pt;
    line-height: 1.2;
    margin: 9px 0;
    color: #ffffff !important;
    letter-spacing: -.035em;
  }

  .prg-print-subtitle {
    color: #d5eeea !important;
    margin: 0;
    font-size: 11pt;
  }

  .prg-print-meta {
    margin: 0 0 28px;
    padding: 12px 0;
    border-bottom: 1px solid #d7e5e2;
    font-size: 9pt;
    color: #52716d;
  }

  .prg-print-document h2 {
    font-size: 13pt;
    font-weight: 800;
    color: #073738;
    margin: 28px 0 14px;
    padding-bottom: 9px;
    border-bottom: 1px solid #d7e5e2;
    break-after: avoid;
  }

  .prg-print-document h3 {
    font-size: 11pt;
    font-weight: 800;
    color: #073738;
    margin: 0 0 8px;
    break-after: avoid;
  }

  .prg-print-document p {
    font-size: 10pt;
    line-height: 1.65;
    margin: 7px 0 12px;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
    orphans: 3;
    widows: 3;
  }

  .prg-print-document section {
    border: 1px solid #dce9e5;
    border-radius: 7px;
    padding: 15px 17px;
    margin: 13px 0;
    background: #f8fbfa !important;
    break-inside: avoid;
    page-break-inside: avoid;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .prg-print-document section p {
    margin-bottom: 0;
  }

  .prg-print-document strong {
    font-weight: 700;
    color: #073738;
  }

  .prg-print-footer {
    margin-top: 30px;
    padding-top: 12px;
    border-top: 1px solid #d7e5e2;
    display: flex;
    justify-content: space-between;
    font-size: 8pt;
    color: #637b7b;
  }

  .prg-root {
    border: 0 !important;
  }
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
    "RelayLedger helps finance teams manage supplier invoices, route them through approval workflows and track payment status from one platform.",

  audience:
    "CFOs, finance directors, financial controllers and accounts payable managers at UK companies with 100–1,000 employees.",

  market: "United Kingdom",

  version:
    "Starter, Growth and Enterprise plans. UK customers only.",

  owner: "Priya Shah · Product Marketing",
  ownerEmail: "",
  lastUpdated: "2026-11-21",
  reviewCadence: "30",

  claimsPolicy:
    "Do not promise that RelayLedger eliminates invoice errors, prevents fraud or guarantees time savings. Only mention features and integrations available on the relevant plan. Customer results must come from approved case studies, and pricing must be checked against the latest pricing document before publication.",

  approvalProcess:
    "Product Marketing checks product descriptions and feature claims. The Product Manager confirms integrations, technical capabilities and plan restrictions. Commercial Operations approves pricing information. Legal reviews security, compliance and customer claims that require legal approval before publication.",

  useCases:
    "Product pages, feature pages, competitor comparisons, SEO articles, customer case studies and sales materials.",

  positioning:
    "Position RelayLedger as an accounts payable platform for managing supplier invoices and approvals. Focus on specific capabilities such as invoice tracking, approval routing and accounting system connections. Explain how these support finance workflows without promising unverified savings or results.",

  terms: [
    {
      id: "term-1",
      avoid: "Seamlessly integrates with all accounting software",
      use: "Connects with supported accounting systems, including Xero",
      note:
        "Name only integrations confirmed in the current product documentation. Check which plans support each connection and whether additional setup is required.",
    },
    {
      id: "term-2",
      avoid: "Unlimited invoice approvals for every customer",
      use: "Manage invoice approvals within the limits of your subscription plan",
      note:
        "Check the latest plan comparison before describing approval limits or advanced routing features. Do not imply that Starter customers have Enterprise functionality.",
    },
    {
      id: "term-3",
      avoid: "Guaranteed to cut invoice processing time by 80%",
      use: "Reduce manual invoice administration through centralised approval workflows",
      note:
        "Only use percentages or time-saving figures when supported by an approved customer case study. Include the customer, measurement period and relevant context.",
    },
  ],

  facts: [
    {
      id: "fact-1",
      category: "Feature",
      title: "Invoice approval workflows",

      claim:
        "Finance teams can assign supplier invoices to approvers, track their approval status and review outstanding invoices from a shared workspace.",

      status: "Approved",

      sourceTitle:
        "Product documentation · Invoice management and approvals",

      sourceUrl: "",

      verifiedBy: "Priya Shah, Product Marketing",
      checked: "2026-11-21",

      market: "United Kingdom",
      plan: "Starter, Growth and Enterprise",

      caveat:
        "All plans support basic invoice approvals. Custom approval routing and multi-level approval workflows are available on Enterprise only.",

      forbidden:
        "Every RelayLedger customer can create unlimited custom approval workflows.",

      nextReview: "2026-12-21",
    },

    {
      id: "fact-2",
      category: "Integration",
      title: "Xero accounting integration",

      claim:
        "RelayLedger supports a Xero integration that allows Growth and Enterprise customers to synchronise supported supplier and invoice information between the two platforms.",

      status: "Approved",

      sourceTitle:
        "Integrations documentation · Xero connection and supported fields",

      sourceUrl: "",

      verifiedBy: "Elliot Brooks, Product Manager",
      checked: "2026-11-21",

      market: "United Kingdom",
      plan: "Growth and Enterprise",

      caveat:
        "The integration requires administrator setup and only synchronises supported fields. It is not available on Starter, and not every record or field is synchronised automatically.",

      forbidden:
        "RelayLedger connects to Xero instantly and automatically synchronises every invoice, payment and accounting record.",

      nextReview: "2026-12-21",
    },

    {
      id: "fact-3",
      category: "Pricing",
      title: "Subscription plans and pricing",

      claim:
        "RelayLedger offers Starter, Growth and Enterprise subscription plans for UK businesses. Features and usage limits vary by plan.",

      status: "Needs review",

      sourceTitle:
        "Commercial pricing document · UK subscription plans",

      sourceUrl: "",

      verifiedBy: "",
      checked: "",

      market: "United Kingdom",
      plan: "Starter, Growth and Enterprise",

      caveat:
        "The available plans are documented, but current prices, invoice limits and any additional implementation fees still require confirmation from Commercial Operations before publication.",

      forbidden:
        "RelayLedger starts at £49 per month with unlimited invoices and no setup fees.",

      nextReview: "",
    },

    {
      id: "fact-4",
      category: "Limitation",
      title: "API access and plan restrictions",

      claim:
        "API access is available to Growth and Enterprise customers. Starter customers cannot use the API to connect RelayLedger with external systems.",

      status: "Approved",

      sourceTitle:
        "Developer documentation · API access and plan permissions",

      sourceUrl: "",

      verifiedBy: "Elliot Brooks, Product Manager",
      checked: "2026-11-21",

      market: "United Kingdom",
      plan: "Growth and Enterprise",

      caveat:
        "API access requires administrator configuration. Available endpoints and usage limits may differ between Growth and Enterprise plans. Confirm specific integration requirements before describing API capabilities.",

      forbidden:
        "All RelayLedger plans include unlimited API access and support integrations with any third-party system.",

      nextReview: "2026-12-21",
    },

    {
      id: "fact-5",
      category: "Security",
      title: "Security and compliance statements",

      claim:
        "No public claims about RelayLedger holding SOC 2 or ISO 27001 certification have been approved for publication. Security certifications and compliance statements must be confirmed by Legal before use.",

      status: "Restricted",

      sourceTitle:
        "Internal security claims register · Pending legal approval",

      sourceUrl: "",

      verifiedBy: "",
      checked: "",

      market: "United Kingdom",
      plan: "Starter, Growth and Enterprise",

      caveat:
        "Do not claim SOC 2 or ISO 27001 certification, guaranteed fraud prevention, complete GDPR compliance or specific data residency arrangements without current supporting evidence and Legal approval.",

      forbidden:
        "RelayLedger is SOC 2 certified, fully GDPR compliant and guarantees complete protection against invoice fraud.",

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
    `# ${data.product || "Untitled product"}: Product Reference Guide`,
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
    ` Target buyers ${data.audience || "Not specified"}`,
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
    question: "What should a B2B SaaS product fact sheet include?",
    answer:
      "A B2B SaaS product fact sheet should include product features, supported integrations, pricing, subscription plan restrictions and approved marketing claims. Each claim should have a supporting source, verification date and named approver. Also document unsupported claims, feature limitations and restrictions on customer results or security statements.",
  },
  {
    question: "What's the difference between a product fact sheet and brand writing guidelines?",
    answer:
      "A product fact sheet documents what writers can accurately say about your product, including features, integrations, pricing and approved claims. Brand writing guidelines define how that information should be communicated, covering tone, terminology, formatting and writing style. B2B SaaS companies should use both to maintain product accuracy and consistent brand messaging.",
  },
  {
    question: "How detailed should a product fact sheet be?",
    answer:
      "Your product fact sheet should be detailed enough for a new writer to produce an accurate first draft without needing a product demo or several clarification calls. Document the features, integrations, pricing and restrictions relevant to your marketing content. For each important claim, include its approved wording, supporting source and verification details.",
  },
  {
    question: "Who should be responsible for maintaining our product fact sheet?",
    answer:
      "I'd put someone in Product Marketing or Content Marketing in charge of maintaining the fact sheet. They don't need to verify everything themselves. Product managers can confirm features and integrations, Commercial can check pricing, and Legal can approve security claims. The important thing is having one person responsible for making sure those updates actually happen.",
  },
  {
    question: "How do I know which product claims are safe to publish?",
    answer:
      "A product claim is safe to publish when it's supported by a reliable source, approved by the appropriate person and still accurate. Check that the claim applies to the intended market, subscription plan and product version.",
  },
  {
    question: "What evidence should we collect before approving a product claim?",
    answer:
      "Before approving a product claim, collect evidence that supports the exact wording you plan to publish. That could be a product specification, integration document, or verified customer case study. Record the source, who approved it, when it was checked and any plan or market restrictions. If the evidence doesn't support the statement, revise the claim before approving it.",
  },
  {
    question: "How often should we review and update our product fact sheet?",
    answer:
      "Set a review schedule of 30, 60 or 90 days based on how frequently your product changes. Assign an owner to check approved claims against current documentation, especially pricing, integrations and plan restrictions. Update any outdated information immediately, and add recurring corrections from editorial reviews to prevent the same errors appearing in future drafts.",
  },
];





const STORAGE_KEY = "growup-product-fact-sheet-v1";

export default function ProductReferenceGuide() {
const [data, setData] = useState(newSample);
const [step, setStep] = useState(0);
const [tab, setTab] = useState("guide");
const [filter, setFilter] = useState("All");
const [showOnlyIssues, setShowOnlyIssues] = useState(false);
const [copied, setCopied] = useState(false);
const [confirmReset, setConfirmReset] = useState(false);
const [notice, setNotice] = useState("");

const [storageReady, setStorageReady] = useState(false);



useEffect(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (
        parsed.data &&
        typeof parsed.data === "object" &&
        !Array.isArray(parsed.data) &&
        Array.isArray(parsed.data.facts) &&
        Array.isArray(parsed.data.terms)
      ) {
        setData(parsed.data);
      }

      if (
        Number.isInteger(parsed.step) &&
        parsed.step >= 0 &&
        parsed.step < sections.length
      ) {
        setStep(parsed.step);
      }

      if (["guide", "facts", "checks"].includes(parsed.tab)) {
        setTab(parsed.tab);
      }

      if (typeof parsed.filter === "string") {
        setFilter(parsed.filter);
      }

      if (typeof parsed.showOnlyIssues === "boolean") {
        setShowOnlyIssues(parsed.showOnlyIssues);
      }
    }
  } catch (error) {
    console.error("Unable to restore product fact sheet:", error);
  } finally {
    setStorageReady(true);
  }
}, []);

useEffect(() => {
  if (!storageReady) return;

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        data,
        step,
        tab,
        filter,
        showOnlyIssues,
      })
    );
  } catch (error) {
    console.error("Unable to save product fact sheet:", error);
  }
}, [data, step, tab, filter, showOnlyIssues, storageReady]);


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




const exportExcel = async () => {
  try {
    const ExcelJSModule = await import("exceljs");
    const ExcelJS = ExcelJSModule.default || ExcelJSModule;

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "GrowUp";
    workbook.subject = "Product Reference Guide";

    const factsSheet = workbook.addWorksheet("Product Claims");
    const termsSheet = workbook.addWorksheet("Terminology");
    const guideSheet = workbook.addWorksheet("Product Reference");

    factsSheet.columns = [
      { header: "Category", key: "category", width: 20 },
      { header: "Product fact", key: "title", width: 34 },
      { header: "Status", key: "status", width: 18 },
      { header: "Approved or proposed claim", key: "claim", width: 65 },
      { header: "Source", key: "sourceTitle", width: 40 },
      { header: "Documentation URL", key: "sourceUrl", width: 36 },
      { header: "Verified by", key: "verifiedBy", width: 28 },
      { header: "Date verified", key: "checked", width: 18 },
      { header: "Review due", key: "nextReview", width: 18 },
      { header: "Market", key: "market", width: 22 },
      { header: "Applicable plans", key: "plan", width: 30 },
      { header: "Restrictions", key: "caveat", width: 55 },
      { header: "Claims to avoid", key: "forbidden", width: 55 },
    ];

    data.facts.forEach((fact) => {
      factsSheet.addRow(fact);
    });

    termsSheet.columns = [
      { header: "Wording to avoid", key: "avoid", width: 48 },
      { header: "Approved wording", key: "use", width: 55 },
      { header: "Usage notes or exceptions", key: "note", width: 70 },
    ];

    data.terms.forEach((term) => {
      termsSheet.addRow(term);
    });

    guideSheet.columns = [
      { header: "Field", key: "field", width: 32 },
      { header: "Details", key: "value", width: 100 },
    ];

    [
      ["Product", data.product],
      ["Company", data.company],
      ["Product description", data.summary],
      ["Target audience", data.audience],
      ["Market", data.market],
      ["Applicable plans", data.version],
      ["Content assets", data.useCases],
      ["Product positioning", data.positioning],
      ["Restricted claims", data.claimsPolicy],
      ["Reference owner", data.owner],
      ["Contact email", data.ownerEmail],
      ["Last reviewed", data.lastUpdated],
      ["Review frequency", `Every ${data.reviewCadence} days`],
      ["Approval responsibilities", data.approvalProcess],
    ].forEach(([field, value]) => {
      guideSheet.addRow({ field, value: value || "Not specified" });
    });

    [factsSheet, termsSheet, guideSheet].forEach((sheet) => {
      sheet.views = [{ state: "frozen", ySplit: 1 }];

      sheet.getRow(1).height = 32;

      sheet.getRow(1).eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF073738" },
        };

        cell.font = {
          name: "Aptos",
          bold: true,
          color: { argb: "FFFFFFFF" },
          size: 11,
        };

        cell.alignment = {
          vertical: "middle",
          wrapText: true,
        };
      });

      for (let i = 2; i <= sheet.rowCount; i++) {
        const row = sheet.getRow(i);
        row.height = 60;

        row.eachCell((cell) => {
          cell.font = {
            name: "Aptos",
            size: 10,
            color: { argb: "FF073738" },
          };

          cell.alignment = {
            vertical: "top",
            wrapText: true,
          };

          if (i % 2 === 0) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFEEF4F3" },
            };
          }
        });
      }

      if (sheet.rowCount > 1) {
        sheet.autoFilter = {
          from: { row: 1, column: 1 },
          to: { row: sheet.rowCount, column: sheet.columnCount },
        };
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `${suffix(data.product)}-product-reference.xlsx`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);

    setNotice("Excel reference downloaded.");
  } catch (error) {
    console.error("Excel export failed:", error);
    setNotice("Excel export failed. Please try again.");
  }
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
<h2>Establish the Product and Audience Context</h2>
<p className="prg-muted">
  Document the product, target buyers, markets and applicable
  plans so writers have an accurate reference when producing
  content.
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
  label="What does your product do?"
  hint="Describe its core functionality and the workflows it supports."
>
                      <textarea
                        rows={3}
                        placeholder="Explain the problem, workflow and outcome without making unsupported promises."
                        {...setExampleField("summary")}
                      />
                    </Field>

                    <Field label="Who are your target buyers?">
                      <textarea
                        rows={2}
                        placeholder="Roles, company sizes, industries and buying context"
                        {...setExampleField("audience")}
                      />
                    </Field>

                    <div className="prg-grid">
                      <Field label="Target markets or regions">
                        <input
                          placeholder="e.g. United Kingdom"
                          {...setExampleField("market")}
                        />
                      </Field>
                      <Field label="Applicable plans or product versions">
                        <input
                          placeholder="e.g. UK plans, v2.1"
                          {...setExampleField("version")}
                        />
                      </Field>
                    </div>

                    <Field label="Which content assets will use this reference?">
                      <textarea
                        rows={2}
                        placeholder="Comparison pages, website copy, blog posts, sales material…"
                        {...setExampleField("useCases")}
                      />
                    </Field>

                    <div className="prg-info">
                      <strong>Why market and plan details matter:</strong> Features, integrations and pricing can differ across subscription plans and regions. Document these differences so writers don't make claims about capabilities your customers can't access.
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
        <span className="prg-kicker">02 / MESSAGING & CLAIMS</span>
<h2>Set Clear Rules for Product Messaging</h2>
<p className="prg-muted">
  Establish how your product should be described, which
  statements require verification and what language writers
  should use instead.
</p>
                    <Field
                      label="Core product positioning"
                      hint="Describe the product's value, use cases and messages writers should communicate consistently"
                    >
                      <textarea
                        rows={3}
                        placeholder="Describe the workflow and ideal buyer without exaggeration."
                        {...setExampleField("positioning")}
                      />
                    </Field>

                   <Field
  label="Restricted and unsupported claims"
  hint="Specify claims about performance, pricing, integrations or security that writers must avoid."
>


                      <textarea
                        rows={4}
                        placeholder="e.g. Never say all plans have API access or that users are guaranteed to save X hours."
                        {...setExampleField("claimsPolicy")}
                      />
                    </Field>

                    <div className="prg-section">
                      <div className="prg-section-head">
                        <h3>Approved Language and Terminology</h3>
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
                          ＋ Add language rule
                        </Button>
                      </div>
                    <p className="prg-muted">
  Record phrases that need replacing and specify the wording
  approved for publication.
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
                            ＋ Add language rule
                            <Button
                              small
                              kind="danger"
                              onClick={() => removeTerm(t.id)}
                            >
                              Remove
                            </Button>
                          </div>
                          <div className="prg-grid">
                            <Field label="Wording to avoid">
                              <input
                                placeholder="e.g. Seamless integration"
                                value={t.avoid}
                                onChange={(e) =>
                                  updateTerm(t.id, "avoid", e.target.value)
                                }
                              />
                            </Field>
                            <Field label="Approved wording">
                              <input
                                placeholder="Name the system and method"
                                value={t.use}
                                onChange={(e) =>
                                  updateTerm(t.id, "use", e.target.value)
                                }
                              />
                            </Field>
                          </div>
                          <Field label="Usage notes or exceptions">
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
  03 / VERIFIED PRODUCT INFORMATION
</span>
<h2>Establish Clear Standards for Product Claims</h2>
<p className="prg-muted">
Document what writers can say about your product, where the information comes from and who verified it. Include plan restrictions to prevent inaccurate claims.
</p>

             <div className="prg-pillrow">
  <span className="prg-pill">
    {stats.total} recorded facts
  </span>
  <span className="prg-pill">
    {stats.approved} approved
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
  Show only claims requiring review or additional evidence
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
    ? "Approved for publication, subject to documented restrictions"
    : stats.overdue(f)
    ? "Review overdue"
    : "Not approved for publication"}
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
                            <Field label="Product information category">
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
                            <Field label="Verification status">
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

                          <Field label="Product fact title">
                            <input
                              placeholder="e.g. API access on Enterprise"
                              value={f.title}
                              onChange={(e) =>
                                updateFact(f.id, "title", e.target.value)
                              }
                            />
                          </Field>
<Field
  label="Approved or proposed claim"
  hint="Write the precise statement writers may publish once verification is complete."
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
                            <Field label="Source of information">
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
                            <Field label="Documentation link (optional)">
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
                            <Field label="Reviewed and verified by">
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
                            <Field label="Date verified">
                              <input
                                type="date"
                                value={f.checked}
                                onChange={(e) =>
                                  updateFact(f.id, "checked", e.target.value)
                                }
                              />
                            </Field>
                            <Field label="Review due">
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
                            <Field label="Market availability">
                              <input
                                placeholder="e.g. UK only"
                                value={f.market}
                                onChange={(e) =>
                                  updateFact(f.id, "market", e.target.value)
                                }
                              />
                            </Field>
                            <Field label="Applicable subscription plans">
                              <input
                                placeholder="e.g. Growth, Enterprise"
                                value={f.plan}
                                onChange={(e) =>
                                  updateFact(f.id, "plan", e.target.value)
                                }
                              />
                            </Field>
                          </div>

                          <Field label="Restrictions and exceptions">
                            <textarea
                              rows={2}
                              placeholder="e.g. Administrator setup required; does not sync invoice line items."
                              value={f.caveat}
                              onChange={(e) =>
                                updateFact(f.id, "caveat", e.target.value)
                              }
                            />
                          </Field>

                          <Field label="Claims writers must avoid">
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
  Approval requires a verified source, named reviewer and
  confirmation of all relevant restrictions.
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
                  <span className="prg-kicker">04 / OWNERSHIP & APPROVALS</span>
<h2>Assign Ownership for Product Claims</h2>
<p className="prg-muted">
  Assign responsibility for keeping product information accurate,
  approving claims and reviewing changes before they appear in
  published content.
</p>

                    <Field label="Who owns this reference?">
                      <input
                        placeholder="e.g. Product Marketing Lead"
                        {...setExampleField("owner")}
                      />
                    </Field>

                    <Field label="Contact email (optional)">
                      <input
                        type="email"
                        placeholder="owner@company.com"
                        {...setExampleField("ownerEmail")}
                      />
                    </Field>

                    <div className="prg-grid">
                      <Field label="Date last reviewed">
                        <input
                          type="date"
                          {...setExampleField("lastUpdated")}
                        />
                      </Field>
                      <Field label="How often should claims be reviewed?">
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
  <strong>Before approving a claim:</strong> Confirm the
  source is current, the review date hasn't passed and
  the claim applies to the intended market and subscription
  plan.
</div>

                    <div className="prg-section">
                      
                      
                <div className="prg-section-head">
  <h3>Claim verification summary</h3>
  <span className="prg-count">
    {stats.approved} of {stats.total} claims ready for publication
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
<h2>Review Your Claims Before Sharing</h2>
<p className="prg-muted">
  See what's approved, what still needs attention and whether
  the reference is ready to share with your writers or agency.
</p>

           <div className="prg-review-grid">
  <div className="prg-stat">
    <strong>{stats.readiness}%</strong>
    <span>Reference completeness</span>
  </div>
  <div className="prg-stat">
    <strong>{stats.approved}</strong>
    <span>Verified claims</span>
  </div>
  <div className="prg-stat">
    <strong>{stats.flagged}</strong>
    <span>Claims needing review</span>
  </div>
</div>

                    <div className="prg-section">
                    
            <div className="prg-section-head">
  <h3>Final checks</h3>
  <span className="prg-count">
    {warnings.length} items to address
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
  No verification issues detected. Check that approved
  claims are current and relevant to the content being
  produced.
</div>


                      )}
                    </div>

                    <div className="prg-section">
             <div className="prg-section-head">
  <h3>Share Your Product Reference</h3>
</div>
<p className="prg-muted">
  Copy or download the complete reference, including
  product facts, approved language, sources and restrictions.
</p>
                      <div
                        className="prg-row"
                        style={{ marginTop: 16, justifyContent: "flex-start" }}
                      >



        <Button kind="primary" onClick={copy}>
  {copied ? "✓ Copied" : "Copy guide"}
</Button>

<Button onClick={exportExcel}>
  ↓ Download Excel
</Button>

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
                        <strong> Target buyers:</strong>{" "}
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
        {stats.approved} approved for use out of {stats.total} recorded.
        Other claims remain visible for review.
      </p>
    </div>

    {data.facts.length ? (
      data.facts.map((f) => {
        const ready =
          stats.complete(f) &&
          !stats.overdue(f) &&
          f.status === "Approved";

        return (
          <div className="prg-doc-fact" key={f.id}>
            <div className="prg-fact-top">
              <h5 className="prg-fact-title">
                {f.title || "Untitled fact"}
              </h5>

              <span
                className={`prg-badge ${
                  ready
                    ? "approved"
                    : f.status === "Restricted"
                    ? "restricted"
                    : "review"
                }`}
              >
                {ready
                  ? "Approved"
                  : stats.overdue(f)
                  ? "Overdue"
                  : f.status === "Approved"
                  ? "Needs review"
                  : f.status}
              </span>
            </div>

            <p className="prg-fact-claim">
              {f.claim || "No claim wording entered."}
            </p>

            <div className="prg-fact-details">
              {f.category && (
                <span className="prg-fact-detail">
                  {f.category}
                </span>
              )}

              {f.plan && (
                <span className="prg-fact-detail">
                  {f.plan}
                </span>
              )}

              {f.market && (
                <span className="prg-fact-detail">
                  {f.market}
                </span>
              )}
            </div>

            <div className="prg-fact-source">
              <span className="prg-fact-source-label">
                Source & verification
              </span>

              <div className="prg-fact-source-text">
                {f.sourceTitle || "Source not provided"}
              </div>

              <div
                className="prg-fact-source-text"
                style={{ color: "#708783", marginTop: 4 }}
              >
                {f.checked
                  ? `Checked ${f.checked}`
                  : "Verification pending"}

                {f.verifiedBy
                  ? ` · ${f.verifiedBy}`
                  : ""}
              </div>
            </div>

            {f.caveat && (
              <div className="prg-fact-caveat">
                <strong>Limitation: </strong>
                {f.caveat}
              </div>
            )}
          </div>
        );
      })
    ) : (
      <div className="prg-empty">
        No product facts added yet.
      </div>
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
  This will replace your current guide and its saved progress with
  a blank version. Download a copy first if you want to keep it.
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
  <div className="prg-print-header">
    <div className="prg-print-brand">
      GrowUp
    </div>

    <div className="prg-print-eyebrow">
      Product Reference Guide
    </div>

    <h1>{data.product || "Untitled product"}</h1>

    <p className="prg-print-subtitle">
      Product Claims & Editorial Reference
    </p>
  </div>

  <p className="prg-print-meta">
    {data.market || "Market unspecified"} ·{" "}
    {data.version || "Version unspecified"} · Owner:{" "}
    {data.owner || "Unassigned"} · Last reviewed:{" "}
    {data.lastUpdated || "Not specified"}
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
  {f.title || "Untitled"} · {f.category} · {f.status}
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
  {data.product === "RelayLedger"
    ? "RelayLedger is a fictional demonstration. Replace sample claims and sources with verified product information before publication."
    : "Confirm all product claims against approved sources before publication."}
</p>

<div className="prg-print-footer">
  <span>GROWUP · PRODUCT REFERENCE</span>
  <span>seo-growup.com</span>
</div>
      </div>
    </div>
  );
}