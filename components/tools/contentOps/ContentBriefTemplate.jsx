import React, { useMemo, useState } from "react";

/**
 * GrowUp Content Brief Template — standalone React/Next.js component.
 * No Workspace dependency, no additional packages, no duplicated page hero.
 * All example names, customer scenarios and product information are fictional.
 */

const STEPS = [
  {
    title: "Assignment",
    short: "Assignment",
    desc: "What are we commissioning, when, and why?",
  },
  {
    title: "Buyer & objective",
    short: "Buyer & goal",
    desc: "Which decision and commercial outcome does this support?",
  },
  {
    title: "Angle & search",
    short: "Angle & SEO",
    desc: "Set the argument, intent, and competitive differentiation.",
  },
  {
    title: "Outline",
    short: "Outline",
    desc: "Approve the structure before anyone starts drafting.",
  },
  {
    title: "Evidence & product",
    short: "Evidence",
    desc: "Assign proof, SME gaps, product claims and permissions.",
  },
  {
    title: "Writing & links",
    short: "Writing rules",
    desc: "Make editorial requirements specific enough to enforce.",
  },
  {
    title: "Review & export",
    short: "Export",
    desc: "Check handoff risks and share the complete working brief.",
  },
];

const EMPTY = {
  company: "",
  title: "",
  purpose: "",
  format: "Comparison page",
  briefOwner: "",
  writer: "",
  expert: "",
  requested: "",
  outlineDue: "",
  outlineApprover: "",
  outlineApprovalDate: "",
  outlineStatus: "Not submitted",
  draftDue: "",
  publishDue: "",
  words: "",
  wordReason: "",
  businessGoal: "",
  funnel: "Decision",
  conversion: "",
  leading: "",
  lagging: "",
  measurement: "",
  supports: "",
  reader: "",
  buying: "Shortlisting",
  readerProblem: "",
  knows: "",
  knowledgeGap: "",
  decision: "",
  stakeholders: "",
  objections: "",
  audienceEvidence: "",
  primaryKeyword: "",
  searchIntent: "Commercial investigation",
  secondary: "",
  serp: "",
  competitorGap: "",
  argument: "",
  takeaway: "",
  nextStep: "",
  notArguing: "",
  whyAngle: "",
  opening: "",
  questions: "",
  reviewRules: "",
  revisionTurnaround: "",
  escalation: "",
  tone: "",
  pov: "Second person",
  spelling: "UK English",
  headingStyle: "Sentence case",
  formatting: "",
  banned: "",
  mustFix: "",
  leaveAlone: "",
  avoidLinks: "",
  outline: [],
  approvals: [],
  evidence: [],
  questionsForSme: [],
  usableExamples: [],
  productRefs: [],
  terminology: [],
  links: [],
  reviews: [],
  feedback: [],
};

const ROWS = {
  outline: {
    heading: "",
    coverage: "",
    proof: "",
    product: "None",
    words: "",
  },
  approvals: {
    reviewer: "",
    decision: "Pending",
    date: "",
    changes: "",
  },
  evidence: {
    claim: "",
    proof: "",
    source: "",
    status: "Needs checking",
    owner: "",
  },
  questionsForSme: {
    topic: "",
    known: "",
    question: "",
    expert: "",
    due: "",
  },
  usableExamples: {
    example: "",
    origin: "",
    permission: "Pending",
    naming: "Anonymised",
  },
  productRefs: {
    placement: "",
    capability: "",
    depth: "Short explanation",
    expected: "",
    reviewer: "",
    restriction: "",
  },
  terminology: {
    say: "",
    avoid: "",
    reason: "",
  },
  links: {
    kind: "Internal",
    anchor: "",
    url: "",
    placement: "",
    purpose: "",
  },
  reviews: {
    stage: "",
    owner: "",
    deadline: "",
    check: "",
    exit: "",
  },
  feedback: {
    issue: "",
    category: "Product accuracy",
    fix: "",
    guide: "No",
  },
};

const SAMPLE = {
  ...EMPTY,
  company: "RelayLedger (fictional)",
  title:
    "Usage-based billing software vs spreadsheets: what finance teams need to compare",
  purpose:
    "Help SaaS finance leaders decide when spreadsheet-based usage billing becomes too risky and what to evaluate before buying software.",
  format: "Comparison page",
  briefOwner: "Maya Chen · Head of Content",
  writer: "Northstar Content Studio · Senior editor",
  expert: "Elena Brooks · Billing Operations Lead (30 min)",
  requested: "2027-01-05",
  outlineDue: "2027-01-08",
  outlineApprover: "Maya Chen · Head of Content",
  outlineApprovalDate: "",
  outlineStatus: "Awaiting approval",
  draftDue: "2027-01-15",
  publishDue: "2027-01-25",
  words: "1800",
  wordReason:
    "Enough space for a process comparison, controls checklist, worked scenario, and decision criteria; avoid a generic 3,000-word guide.",
  businessGoal:
    "Increase qualified billing-operations demo requests from organic search this quarter.",
  funnel: "Decision",
  conversion: "Book a billing workflow demo",
  leading:
    "Pricing-page clicks and demo CTA clicks from this article",
  lagging:
    "CRM-attributed demos and qualified opportunities influenced",
  measurement:
    "Marketing Ops reviews 30/60/90 days after publication using GA4 and CRM journey reports.",
  supports:
    "/usage-billing and /pricing; avoid duplicating the usage-based billing overview.",
  reader:
    "Finance Director or RevOps leader at a 50–300-person B2B SaaS business",
  buying: "Comparing",
  readerProblem:
    "Every month-end, finance reconciles product events, exception spreadsheets and manually adjusted invoices.",
  knows:
    "Usage metrics, revenue recognition basics, billing cycles and the current approval chain",
  knowledgeGap:
    "What audit trail, approval controls and data-handling workflow dedicated billing software changes",
  decision:
    "Keep spreadsheets with stronger controls, or shortlist billing software for a pilot",
  stakeholders:
    "CFO, billing operations, product engineering and security",
  objections:
    "Migration effort; exception handling; proving invoice accuracy; how approvals will work",
  audienceEvidence:
    "Three anonymised discovery call summaries (internal research folder, Jan 2027); confirm themes with Sales before publishing.",
  primaryKeyword: "usage based billing software vs spreadsheets",
  searchIntent: "Commercial investigation",
  secondary:
    "usage billing spreadsheet; SaaS invoice reconciliation; billing approval workflow",
  serp: "Review the top five relevant comparison pages on briefing day; record URLs and current assertions before outline approval.",
  competitorGap:
    "Competitor pages list features but rarely show who signs off usage adjustments before the invoice is issued.",
  argument:
    "Dedicated billing software becomes worth evaluating when exception volume makes manual reconciliation and approvals difficult to audit.",
  takeaway:
    "Identify the operational triggers, compare control requirements, and build a shortlist based on workflow fit.",
  nextStep:
    "Book a 20-minute billing workflow demo if the buyer needs configurable approval controls.",
  notArguing:
    "Spreadsheets are always wrong; every finance team needs new software; software eliminates reconciliation work.",
  whyAngle:
    "Show a month-end invoice journey and the approval decision, not another generic spreadsheet-versus-software feature list.",
  opening:
    "Open with a month-end scenario: 18 usage adjustments, three approvers, two disconnected spreadsheets and an invoice deadline.",
  questions:
    "At what volume do manual exception workflows become hard to control?\nWho can change an adjustment after review?\nWhat evidence should an auditor be able to retrieve?\nWhich billing integrations and permissions must buyers check?\nWhat makes a two-week pilot useful?",
  outline: [
    {
      heading: "Introduction",
      coverage:
        "Start with the adjustment-approval bottleneck; state the decision this guide helps make.",
      proof: "Anonymised month-end scenario (obtain approval)",
      product: "None",
      words: "150",
    },
    {
      heading: "H2: When spreadsheets are still enough",
      coverage:
        "Explain the small-team conditions under which a controlled workbook remains workable.",
      proof: "SME examples, clearly labelled",
      product: "None",
      words: "250",
    },
    {
      heading: "H2: Where manual billing starts breaking down",
      coverage:
        "Walk through events, adjustments, reviewer handoffs and invoice sign-off.",
      proof: "Process diagram + SME notes",
      product: "None",
      words: "350",
    },
    {
      heading: "H2: What to compare in billing software",
      coverage:
        "Evaluate audit logs, approvals, correction paths, access and integration boundaries.",
      proof: "Product demos and vendor documentation",
      product: "Light",
      words: "450",
    },
    {
      heading: "H2: A short evaluation checklist",
      coverage:
        "Offer a pilot plan with five questions finance can ask vendors.",
      proof: "Reviewed buying checklist",
      product: "Light",
      words: "350",
    },
    {
      heading: "Conclusion and next step",
      coverage:
        "Restate the decision trigger and invite qualified readers to view a real workflow.",
      proof: "None",
      product: "Light",
      words: "150",
    },
  ],
  approvals: [
    {
      reviewer: "Maya Chen · Content",
      decision: "Pending",
      date: "",
      changes: "Check decision criteria and commercial angle.",
    },
    {
      reviewer: "Elena Brooks · Billing Ops",
      decision: "Pending",
      date: "",
      changes: "Verify the adjustment and approval workflow.",
    },
  ],
  evidence: [
    {
      claim: "Manual adjustments create more review handoffs",
      proof:
        "Use an approved internal process example; no generalised percentage",
      source: "Internal discovery-call notes (permission required)",
      status: "Needs checking",
      owner: "Maya Chen",
    },
    {
      claim: "Audit logs retain approval actions",
      proof:
        "Product feature walkthrough and approved capability notes",
      source:
        "Internal product reference; ask Product to supply link",
      status: "Needs checking",
      owner: "Elena Brooks",
    },
    {
      claim: "Current plan supports role-based approvals",
      proof: "Exact plan entitlement and any exclusions",
      source: "Approved pricing/entitlement matrix",
      status: "Missing proof",
      owner: "Product Marketing",
    },
  ],
  questionsForSme: [
    {
      topic: "Adjustment review",
      known:
        "Finance currently checks exception rows before approving invoices.",
      question:
        "What audit events are retained after a rejected adjustment is resubmitted?",
      expert: "Elena Brooks",
      due: "2027-01-07",
    },
    {
      topic: "Realistic example",
      known:
        "We have a fictional month-end scenario; no customer quote cleared.",
      question:
        "Can you supply an anonymised, approved example with the exact reviewer sequence?",
      expert: "Elena Brooks",
      due: "2027-01-07",
    },
  ],
  usableExamples: [
    {
      example: "Anonymised invoice-adjustment scenario",
      origin: "Product training environment",
      permission: "Pending",
      naming: "Anonymised",
    },
  ],
  productRefs: [
    {
      placement: "Software comparison",
      capability: "Approval queue and adjustment history",
      depth: "Short explanation",
      expected:
        "Show which user sees a pending adjustment and what an approval records.",
      reviewer: "Product Marketing",
      restriction:
        "Do not claim every subscription includes these permissions.",
    },
  ],
  terminology: [
    {
      say: "Adjustment approval queue",
      avoid: "Automated end-to-end finance",
      reason:
        "Specific capability versus sweeping automation claim.",
    },
    {
      say: "Selected billing events",
      avoid: "Every product event",
      reason:
        "Integration and event availability depend on configuration.",
    },
  ],
  links: [
    {
      kind: "Internal",
      anchor: "usage-based billing workflows",
      url: "/usage-billing",
      placement: "Controls comparison",
      purpose: "Let readers inspect the feature context.",
    },
    {
      kind: "Internal",
      anchor: "available plans and limits",
      url: "/pricing",
      placement: "Vendor checklist",
      purpose: "Check plan-dependent features before a demo.",
    },
    {
      kind: "External",
      anchor: "original reference on financial controls",
      url: "",
      placement: "Review controls",
      purpose:
        "Find a primary source rather than citing a vendor roundup.",
    },
  ],
  tone:
    "Direct, commercially literate, practical; write for a busy finance decision-maker.",
  pov: "Second person",
  spelling: "UK English",
  headingStyle: "Sentence case",
  formatting:
    "Short paragraphs; use comparison tables only when the dimensions are genuinely comparable. Explain acronyms once.",
  banned:
    "seamless, revolutionary, game-changing, leverage, unlock efficiencies",
  mustFix:
    "Unverified product claims; unapproved examples; inaccurate comparison; missing evidence; unapproved outline changes; broken links.",
  leaveAlone:
    "Different but clear word choices, minor sentence rhythm preferences, and harmless paragraph ordering within an approved section.",
  avoidLinks:
    "Unverified competitor pricing pages, unsourced benchmark roundups, and expired product claims.",
  reviewRules:
    "Editors comment on missing information and expected correction; do not rewrite entire sections. Writer resolves each comment and lists open questions explicitly.",
  revisionTurnaround:
    "Client: 2 working days for consolidated review. Agency: 2 working days for revision.",
  escalation:
    "Maya Chen owns overdue reviews and scope disputes; if outline approval is late, revise the delivery schedule rather than assuming consent.",
  reviews: [
    {
      stage: "Brief agreed",
      owner: "Maya Chen + agency editor",
      deadline: "Before outline",
      check: "Audience, angle, inputs, ownership",
      exit: "Agency confirms inputs are sufficient",
    },
    {
      stage: "Outline approval",
      owner: "Maya Chen + Elena Brooks",
      deadline: "1 working day",
      check: "Argument, sections, proof, product mentions",
      exit: "Written approval before drafting",
    },
    {
      stage: "Agency pre-delivery QA",
      owner: "Agency editor",
      deadline: "Before first draft submission",
      check: "Claims, outline, sources, links, voice",
      exit: "QA checklist complete",
    },
    {
      stage: "Client draft review",
      owner: "Maya Chen",
      deadline: "2 working days",
      check: "Must-fix items, not stylistic preferences",
      exit: "Consolidated comments or approval",
    },
    {
      stage: "Revision & publish",
      owner: "Agency writer + Content",
      deadline: "Per publishing plan",
      check: "Resolved comments, final product accuracy",
      exit: "Approved and published",
    },
  ],
  feedback: [],
};

const CHECKS = [
  "Draft follows the approved outline, with changes explicitly flagged.",
  "Opening states the argument and helps the defined buyer make the intended decision.",
  "Evidence supports each material claim; missing proof is flagged, never invented.",
  "Product names, plan entitlements and limitations have been reviewed by the owner.",
  "Any SME questions are resolved or marked as unresolved.",
  "The must-fix style rules, structure and required word count have been checked.",
  "All internal and external links have been verified.",
  "Banned phrases and unsupported customer examples are absent.",
  "A second reviewer checked the draft before client delivery.",
  "The CTA, metadata requirements and handoff instructions are clear.",
];

const THEMES = {
  ink: "#011522",
  dark: "#073b3b",
  teal: "#167273",
  aqua: "#75d6c1",
  pale: "#eef4f3",
  line: "#d6e5e1",
  muted: "#57716e",
  white: "#ffffff",
};

const CSS = `
.cbt,
.cbt * { box-sizing: border-box }
.cbt {
  font-family: Montserrat, Inter, system-ui, -apple-system, sans-serif;
  color: ${THEMES.ink};
  line-height: 1.55;
  max-width: 1120px;
  margin: 0 auto;
  padding: 8px 0 48px;
}
.cbt button,
.cbt input,
.cbt select,
.cbt textarea { font: inherit }
.cbt button { cursor: pointer }
.cbt button:disabled { cursor: not-allowed; opacity: .5 }
.cbt button:focus-visible,
.cbt input:focus-visible,
.cbt select:focus-visible,
.cbt textarea:focus-visible {
  outline: 3px solid #69c6bd;
  outline-offset: 2px;
}
.cbt-steps {
  display: flex;
  gap: 7px;
  overflow-x: auto;
  padding: 8px 0 15px;
  border-bottom: 1px solid ${THEMES.line};
  scrollbar-width: thin;
}
.cbt-step {
  border: 1px solid ${THEMES.line};
  border-radius: 9px;
  background: white;
  white-space: nowrap;
  min-height: 40px;
  padding: 8px 11px;
  font-size: 12px;
  font-weight: 750;
  color: ${THEMES.dark};
}
.cbt-step.active {
  background: ${THEMES.dark};
  color: #fff;
  border-color: ${THEMES.dark};
}
.cbt-step b {
  display: inline-grid;
  place-items: center;
  border: 1px solid currentColor;
  border-radius: 50%;
  width: 19px;
  height: 19px;
  font-size: 10px;
  margin-right: 6px;
}
.cbt-step.ready:not(.active) { border-color: #8ecdc2 }
.cbt-util {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin: 18px 0;
}
.cbt-eyebrow {
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 1.7px;
  color: ${THEMES.teal};
  text-transform: uppercase;
}
.cbt-util-actions {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
}
.cbt-btn {
  border: 1px solid ${THEMES.line};
  color: ${THEMES.dark};
  background: #fff;
  border-radius: 9px;
  padding: 9px 12px;
  font-weight: 750;
  font-size: 12px;
}
.cbt-btn.primary {
  background: ${THEMES.teal};
  color: #fff;
  border-color: ${THEMES.teal};
}
.cbt-btn.dark {
  background: ${THEMES.dark};
  color: #fff;
  border-color: ${THEMES.dark};
}
.cbt-btn.ghost {
  border-color: transparent;
  background: transparent;
  color: ${THEMES.teal};
}
.cbt-btn.danger { color: #a43d33 }
.cbt-btn:hover:not(:disabled) { filter: brightness(.97) }
.cbt-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.27fr) minmax(310px, .83fr);
  gap: 17px;
  align-items: start;
}
.cbt-panel {
  border: 1px solid ${THEMES.line};
  border-radius: 15px;
  background: white;
  min-width: 0;
  overflow: hidden;
}
.cbt-editor { padding: 25px }
.cbt-kicker {
  font-size: 10px;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  font-weight: 850;
  color: ${THEMES.teal};
  margin: 0 0 8px;
}
.cbt-h2 {
  font-size: 25px;
  letter-spacing: -.8px;
  font-weight: 850;
  line-height: 1.2;
  color: ${THEMES.dark};
  margin: 0;
}
.cbt-intro {
  font-size: 13px;
  color: ${THEMES.muted};
  margin: 10px 0 22px;
  max-width: 560px;
}
.cbt-section {
  margin: 19px 0;
  padding-top: 17px;
  border-top: 1px solid #e5efec;
}
.cbt-section:first-of-type { border-top: 0 }
.cbt-section h3 {
  font-size: 15px;
  margin: 0 0 8px;
  color: ${THEMES.dark};
  letter-spacing: -.25px;
}
.cbt-section p {
  font-size: 12px;
  color: ${THEMES.muted};
  margin: 0 0 15px;
}
.cbt-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 13px;
}
.cbt-field { min-width: 0 }
.cbt-field.wide { grid-column: 1 / -1 }
.cbt-label {
  display: block;
  color: ${THEMES.dark};
  font-size: 11.5px;
  font-weight: 800;
  margin: 0 0 5px;
}
.cbt-hint {
  color: ${THEMES.muted};
  font-size: 11px;
  margin: 4px 0 0;
}
.cbt-input,
.cbt-select,
.cbt-area {
  display: block;
  width: 100%;
  border: 1px solid #bfd6d1;
  background: #fbfdfc;
  border-radius: 8px;
  padding: 10px 11px;
  color: ${THEMES.ink};
  font-size: 12.5px;
  min-height: 41px;
}
.cbt-area {
  min-height: 87px;
  resize: vertical;
}
.cbt-input:focus,
.cbt-area:focus,
.cbt-select:focus {
  border-color: ${THEMES.teal};
  outline: 2px solid #b6e7df;
  outline-offset: 0;
}
.cbt-rowcard {
  border: 1px solid ${THEMES.line};
  border-radius: 11px;
  margin: 12px 0;
  padding: 15px;
  background: #fbfdfc;
}
.cbt-rowtop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
.cbt-rowtop strong {
  font-size: 12px;
  color: ${THEMES.dark};
}
.cbt-rowactions {
  display: flex;
  gap: 4px;
}
.cbt-rowactions button {
  border: 0;
  background: transparent;
  color: ${THEMES.teal};
  font-size: 11px;
  font-weight: 800;
}
.cbt-add {
  margin-top: 6px;
  border: 1px dashed #84bcb3;
  background: #f0f8f5;
  color: ${THEMES.teal};
  font-size: 12px;
  font-weight: 800;
  padding: 10px 13px;
  border-radius: 9px;
  width: 100%;
}
.cbt-tip {
  margin: 15px 0 0;
  border-left: 3px solid ${THEMES.teal};
  background: ${THEMES.pale};
  padding: 12px 13px;
  font-size: 12px;
  color: ${THEMES.dark};
  border-radius: 0 8px 8px 0;
}
.cbt-foot {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid ${THEMES.line};
  padding-top: 17px;
  margin-top: 25px;
}
.cbt-preview {
  position: sticky;
  top: 15px;
}
.cbt-preview-head {
  background: ${THEMES.dark};
  padding: 18px 20px;
  color: white;
}
.cbt-preview-head small {
  color: #9bd4c7;
  font-size: 9px;
  font-weight: 850;
  letter-spacing: 1.5px;
}
.cbt-preview-head h3 {
  font-size: 19px;
  line-height: 1.2;
  margin: 7px 0 4px;
  overflow-wrap: anywhere;
  color: white;
}
.cbt-preview-head p {
  color: #d3ece7;
  font-size: 11px;
  margin: 0;
}
.cbt-progress-track {
  height: 5px;
  border-radius: 12px;
  background: #33615e;
  margin: 14px 0 5px;
  overflow: hidden;
}
.cbt-progress-fill {
  background: ${THEMES.aqua};
  height: 100%;
  transition: width .2s;
}
.cbt-preview-body {
  padding: 18px 19px;
  max-height: 600px;
  overflow: auto;
}
.cbt-statrow {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
}
.cbt-stat {
  border: 1px solid ${THEMES.line};
  border-radius: 9px;
  padding: 10px;
  background: #f7faf9;
}
.cbt-stat b {
  display: block;
  font-size: 17px;
  line-height: 1.2;
  color: ${THEMES.dark};
}
.cbt-stat span {
  font-size: 10px;
  color: ${THEMES.muted};
}
.cbt-preview-section {
  border-top: 1px solid ${THEMES.line};
  padding: 12px 0;
}
.cbt-preview-section h4 {
  color: ${THEMES.dark};
  margin: 0 0 7px;
  font-size: 12px;
}
.cbt-preview-section p {
  font-size: 11px;
  margin: 0 0 8px;
  color: #365452;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
.cbt-preview-section dl {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 5px 8px;
  margin: 0;
}
.cbt-preview-section dt {
  color: ${THEMES.muted};
  font-size: 10px;
}
.cbt-preview-section dd {
  font-size: 11px;
  margin: 0;
  color: ${THEMES.dark};
  overflow-wrap: anywhere;
}
.cbt-mini {
  background: #f0f7f5;
  border-radius: 8px;
  padding: 9px;
  margin: 7px 0;
  font-size: 11px;
  overflow-wrap: anywhere;
}
.cbt-mini b {
  display: block;
  color: ${THEMES.dark};
  font-size: 11px;
}
.cbt-warning {
  display: flex;
  gap: 9px;
  border: 1px solid #e9d6aa;
  background: #fffaf0;
  border-radius: 9px;
  padding: 10px 11px;
  margin: 8px 0;
  font-size: 11px;
  color: #75551a;
}
.cbt-good {
  display: flex;
  gap: 9px;
  border: 1px solid #b9ddd2;
  background: #f1faf6;
  border-radius: 9px;
  padding: 10px;
  font-size: 11px;
  color: ${THEMES.dark};
  margin: 8px 0;
}
.cbt-check {
  display: flex;
  gap: 9px;
  align-items: start;
  padding: 10px 0;
  border-bottom: 1px solid #ebf0ee;
  font-size: 12px;
}
.cbt-check input {
  margin-top: 3px;
  accent-color: ${THEMES.teal};
}
.cbt-review-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.cbt-review-kpi {
  background: ${THEMES.pale};
  padding: 13px;
  border-radius: 10px;
}
.cbt-review-kpi strong {
  font-size: 21px;
  display: block;
  color: ${THEMES.dark};
}
.cbt-review-kpi span {
  font-size: 11px;
  color: ${THEMES.muted};
}
.cbt-exportbar {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 14px;
}
.cbt-note {
  font-size: 11px;
  color: ${THEMES.muted};
  line-height: 1.5;
}
.cbt-toast {
  font-size: 12px;
  font-weight: 750;
  color: ${THEMES.teal};
  margin: 9px 0;
}
.cbt-faq { margin-top: 20px }
.cbt-faq details {
  border-top: 1px solid ${THEMES.line};
  padding: 12px 0;
}
.cbt-faq summary {
  cursor: pointer;
  font-size: 12px;
  font-weight: 800;
  color: ${THEMES.dark};
}
.cbt-faq p {
  font-size: 12px;
  color: ${THEMES.muted};
}
.cbt-print { display: none }
@media (max-width: 900px) {
  .cbt-layout { grid-template-columns: 1fr }
  .cbt-preview { position: static }
  .cbt-preview-body { max-height: 480px }
  .cbt-editor { padding: 19px }
}
@media (max-width: 560px) {
  .cbt-fields { grid-template-columns: 1fr }
  .cbt-editor { padding: 15px }
  .cbt-h2 { font-size: 22px }
  .cbt-util { align-items: flex-start }
  .cbt-review-grid { grid-template-columns: 1fr }
  .cbt-step { font-size: 11px }
  .cbt-preview-section dl { grid-template-columns: 85px 1fr }
}
@media print {
  body * { visibility: hidden !important }
  .cbt-print,
  .cbt-print * { visibility: visible !important }
  .cbt-print {
    display: block !important;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    font-family: Arial, sans-serif;
    color: #132b29;
    padding: 24px 35px;
    white-space: pre-wrap;
    font-size: 10pt;
    line-height: 1.45;
  }
  .cbt-print h1 {
    font-size: 21pt;
    line-height: 1.15;
    color: ${THEMES.dark};
    border-bottom: 3px solid ${THEMES.teal};
    padding-bottom: 8px;
  }
  .cbt-print pre {
    white-space: pre-wrap;
    font: inherit;
  }
  .cbt-print h2 {
    color: ${THEMES.dark};
    font-size: 13pt;
    margin-top: 19px;
    break-after: avoid;
  }
  .cbt-print section { break-inside: avoid }
}
`;

const FIELD = (label, key, opts = {}) => ({ label, key, ...opts });

const CONFIG = {
  outline: [
    FIELD("Heading / H2 / H3", "heading"),
    FIELD("What the section argues", "coverage", {
      long: true,
      wide: true,
    }),
    FIELD("Evidence or example", "proof", { long: true }),
    FIELD("Product mention", "product", {
      options: ["None", "Light", "Full walkthrough"],
    }),
    FIELD("Target words", "words", { type: "number" }),
  ],
  approvals: [
    FIELD("Reviewer", "reviewer"),
    FIELD("Decision", "decision", {
      options: ["Pending", "Changes requested", "Approved"],
    }),
    FIELD("Approval date", "date", { type: "date" }),
    FIELD("Changes requested", "changes", { long: true, wide: true }),
  ],
  evidence: [
    FIELD("Claim to support", "claim", { long: true, wide: true }),
    FIELD("Evidence / proof", "proof", { long: true }),
    FIELD("Original source and date", "source", { long: true }),
    FIELD("Status", "status", {
      options: ["Confirmed", "Needs checking", "Missing proof"],
    }),
    FIELD("Who will resolve it", "owner"),
  ],
  questionsForSme: [
    FIELD("Topic", "topic"),
    FIELD("What we already know", "known", { long: true }),
    FIELD("Exact question to answer", "question", {
      long: true,
      wide: true,
    }),
    FIELD("Expert", "expert"),
    FIELD("Answer due", "due", { type: "date" }),
  ],
  usableExamples: [
    FIELD("Customer / operational example", "example", {
      long: true,
      wide: true,
    }),
    FIELD("Origin of example", "origin"),
    FIELD("Permission to use", "permission", {
      options: ["Pending", "Approved", "Not permitted"],
    }),
    FIELD("Naming permission", "naming", {
      options: ["Anonymised", "Named", "Do not use"],
    }),
  ],
  productRefs: [
    FIELD("Where in the article", "placement"),
    FIELD("Feature / workflow", "capability"),
    FIELD("Depth", "depth", {
      options: ["Mention", "Short explanation", "Full walkthrough"],
    }),
    FIELD("What reader should see or understand", "expected", {
      long: true,
      wide: true,
    }),
    FIELD("Product reviewer", "reviewer"),
    FIELD("Plan or claim restriction", "restriction", { long: true }),
  ],
  terminology: [
    FIELD("Say this", "say"),
    FIELD("Don't say this", "avoid"),
    FIELD("Reason", "reason", { long: true, wide: true }),
  ],
  links: [
    FIELD("Link type", "kind", {
      options: ["Internal", "External"],
    }),
    FIELD("Suggested anchor", "anchor"),
    FIELD("URL", "url", { wide: true }),
    FIELD("Placement", "placement"),
    FIELD("Why it belongs / supported claim", "purpose", {
      long: true,
    }),
  ],
  reviews: [
    FIELD("Stage", "stage"),
    FIELD("Owner", "owner"),
    FIELD("Turnaround", "deadline"),
    FIELD("What they check", "check", { long: true, wide: true }),
    FIELD("Exit criteria", "exit", { long: true, wide: true }),
  ],
  feedback: [
    FIELD("Specific issue", "issue", { long: true, wide: true }),
    FIELD("Category", "category", {
      options: [
        "Product accuracy",
        "Audience",
        "Missing substance",
        "Agreed standard",
        "Preference",
      ],
    }),
    FIELD("Fix needed in", "fix"),
    FIELD("Added to shared guide?", "guide", {
      options: ["No", "Yes"],
    }),
  ],
};

const txt = (x) => String(x ?? "").trim();

const escapeMd = (x) =>
  String(x ?? "").replace(/\r/g, "").trim() || "Not provided";

const filled = (x) => Boolean(txt(x));

function Input({
  label,
  value,
  onChange,
  long = false,
  options,
  type = "text",
  hint,
  wide = false,
  placeholder,
}) {
  const id = React.useId();
  return (
    <div className={`cbt-field ${wide ? "wide" : ""}`}>
      <label className="cbt-label" htmlFor={id}>
        {label}
      </label>
      {options ? (
        <select
          id={id}
          className="cbt-select"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        >
          {!options.includes(value) && <option value="">Choose…</option>}
          {options.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
      ) : long ? (
        <textarea
          id={id}
          className="cbt-area"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
        />
      ) : (
        <input
          id={id}
          className="cbt-input"
          type={type}
          min={type === "number" ? "0" : undefined}
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {hint && <p className="cbt-hint">{hint}</p>}
    </div>
  );
}

function Section({ title, desc, children }) {
  return (
    <section className="cbt-section">
      <h3>{title}</h3>
      {desc && <p>{desc}</p>}
      {children}
    </section>
  );
}

function Pairs({ entries, onChange, items }) {
  return (
    <div className="cbt-fields">
      {items.map((x) => (
        <Input
          key={x.key}
          {...x}
          value={entries[x.key]}
          onChange={(v) => onChange(x.key, v)}
        />
      ))}
    </div>
  );
}

function Repeater({
  title,
  help,
  kind,
  data,
  setData,
  button,
  max = 30,
}) {
  const rows = data[kind] || [];

  const update = (index, key, value) =>
    setData((p) => ({
      ...p,
      [kind]: p[kind].map((r, i) =>
        i === index ? { ...r, [key]: value } : r
      ),
    }));

  const drop = (index) =>
    setData((p) => ({
      ...p,
      [kind]: p[kind].filter((_, i) => i !== index),
    }));

  const move = (idx, dir) =>
    setData((p) => {
      const all = [...p[kind]];
      const to = idx + dir;
      if (to < 0 || to >= all.length) return p;
      [all[idx], all[to]] = [all[to], all[idx]];
      return { ...p, [kind]: all };
    });

  return (
    <Section title={title} desc={help}>
      {rows.map((r, i) => (
        <div className="cbt-rowcard" key={`${kind}-${i}`}>
          <div className="cbt-rowtop">
            <strong>
              {button || title} {i + 1}
            </strong>
            <div className="cbt-rowactions">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={!i}
                aria-label={`Move ${title} ${i + 1} up`}
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === rows.length - 1}
                aria-label={`Move ${title} ${i + 1} down`}
              >
                ↓
              </button>
              <button
                type="button"
                className="danger"
                onClick={() => drop(i)}
                aria-label={`Remove ${title} ${i + 1}`}
              >
                Remove
              </button>
            </div>
          </div>

          <div className="cbt-fields">
            {CONFIG[kind].map((c) => (
              <Input
                key={c.key}
                {...c}
                value={r[c.key]}
                onChange={(v) => update(i, c.key, v)}
              />
            ))}
          </div>
        </div>
      ))}

      <button
        className="cbt-add"
        type="button"
        onClick={() =>
          setData((p) => ({
            ...p,
            [kind]: [...p[kind], { ...ROWS[kind] }],
          }))
        }
        disabled={rows.length >= max}
      >
        + Add {button || title.toLowerCase()}
      </button>
    </Section>
  );
}

function quality(v) {
  const essentials = [
    ["Working title", filled(v.title)],
    ["Decision-led purpose", filled(v.purpose)],
    ["Brief owner", filled(v.briefOwner)],
    ["Outline deadline", filled(v.outlineDue)],
    ["Draft deadline", filled(v.draftDue)],
    ["Business objective", filled(v.businessGoal)],
    ["Reader and problem", filled(v.reader) && filled(v.readerProblem)],
    ["Buyer decision", filled(v.decision)],
    ["Main argument", filled(v.argument)],
    ["Reader takeaway", filled(v.takeaway)],
    ["Approved conversion / CTA", filled(v.conversion)],
    [
      "Draft outline",
      v.outline.some((x) => filled(x.heading) && filled(x.coverage)),
    ],
    [
      "Outline approval",
      v.outlineStatus === "Approved" && filled(v.outlineApprover),
    ],
    [
      "Evidence ownership",
      v.evidence.some((x) => filled(x.claim) && filled(x.owner)),
    ],
    [
      "Product guidance",
      v.productRefs.some((x) => filled(x.capability)) ||
        filled(v.notArguing),
    ],
    ["Style rules", filled(v.tone) && filled(v.mustFix)],
    ["Review owner", v.reviews.some((x) => filled(x.owner))],
    ["Links", v.links.some((x) => filled(x.url))],
  ];

  const gaps = [];
  if (!filled(v.title))
    gaps.push("Name the piece and its specific angle.");
  if (!filled(v.decision))
    gaps.push(
      "Specify the decision the target reader should be able to make."
    );
  if (!filled(v.argument))
    gaps.push("Settle the central argument before outlining.");
  if (v.outline.length === 0)
    gaps.push(
      "Add section-level coverage and the evidence each section needs."
    );
  if (v.outlineStatus !== "Approved" || !filled(v.outlineApprover))
    gaps.push(
      "Outline approval is pending. Don't treat the example as sign-off."
    );
  if (v.evidence.some((x) => x.status !== "Confirmed"))
    gaps.push(
      `${v.evidence.filter((x) => x.status !== "Confirmed").length} evidence item(s) still require checking or proof.`
    );
  if (v.evidence.some((x) => !filled(x.source) || !filled(x.owner)))
    gaps.push("Some evidence entries lack a source or gap owner.");
  if (v.usableExamples.some((x) => x.permission !== "Approved"))
    gaps.push(
      "Customer examples without permission must not be published."
    );
  if (
    v.questionsForSme.some((x) => filled(x.question) && !filled(x.expert))
  )
    gaps.push("Assign an expert to every open SME question.");
  if (
    filled(v.outlineDue) &&
    filled(v.draftDue) &&
    v.outlineDue > v.draftDue
  )
    gaps.push(
      "Outline is due after the first draft; check your schedule."
    );
  if (
    filled(v.draftDue) &&
    filled(v.publishDue) &&
    v.draftDue > v.publishDue
  )
    gaps.push(
      "First draft is due after publication; check your schedule."
    );

  const sum = v.outline.reduce(
    (n, r) => n + (Number(r.words) > 0 ? Number(r.words) : 0),
    0
  );

  if (
    sum &&
    Number(v.words) > 0 &&
    Math.abs(sum - Number(v.words)) > Number(v.words) * 0.15
  )
    gaps.push(
      `Outline adds to ${sum.toLocaleString()} words, versus the ${Number(
        v.words
      ).toLocaleString()}-word target.`
    );

  const completed = essentials.filter(([, good]) => good).length;

  return {
    essentials,
    completed,
    pct: Math.round((100 * completed) / essentials.length),
    gaps,
    outlineWords: sum,
  };
}

const KV = (title, val) => `**${title}:** ${escapeMd(val)}\n`;

function listRows(title, rows, keys) {
  if (!rows?.length) return `## ${title}\n\nNot provided.\n\n`;
  return (
    `## ${title}\n\n` +
    rows
      .map(
        (r, i) =>
          `### ${i + 1}. ${escapeMd(r[keys[0][1]])}\n` +
          keys
            .slice(1)
            .map(([label, key]) => KV(label, r[key]))
            .join("") +
          "\n"
      )
      .join("")
  );
}

function makeMarkdown(v, qa) {
  const lines = [
    `# ${escapeMd(v.title || "Content brief")}`,
    `**Company:** ${escapeMd(v.company)}`,
    `**Status:** ${escapeMd(v.outlineStatus)}`,
    `**Brief readiness:** ${qa.pct}% (${qa.completed}/${qa.essentials.length} checks)`,
    "",
    "## 1. Brief at a glance",
    ...[
      ["One-line purpose", "purpose"],
      ["Format", "format"],
      ["Brief owner", "briefOwner"],
      ["Writer / agency editor", "writer"],
      ["Subject-matter expert", "expert"],
      ["Requested", "requested"],
      ["Outline due", "outlineDue"],
      ["Outline approver", "outlineApprover"],
      ["Outline approval date", "outlineApprovalDate"],
      ["First draft due", "draftDue"],
      ["Publish due", "publishDue"],
      ["Word count", "words"],
      ["Why this length", "wordReason"],
    ].map(([l, k]) => KV(l, v[k])),
    "",
    "## 2. Commercial objective",
    ...[
      ["Business goal", "businessGoal"],
      ["Funnel stage", "funnel"],
      ["Primary conversion", "conversion"],
      ["Leading indicator", "leading"],
      ["Lagging indicator", "lagging"],
      ["Measurement and review", "measurement"],
      ["Pages supported or replaced", "supports"],
    ].map(([l, k]) => KV(l, v[k])),
    "",
    "## 3. Reader",
    ...[
      ["Job title and seniority", "reader"],
      ["Buying stage", "buying"],
      ["Problem in reader's words", "readerProblem"],
      ["What they know", "knows"],
      ["What they don't know", "knowledgeGap"],
      ["Decision", "decision"],
      ["Other stakeholders", "stakeholders"],
      ["Objections", "objections"],
      ["Source of audience insight", "audienceEvidence"],
    ].map(([l, k]) => KV(l, v[k])),
    "",
    "## 4. Main point & search",
    ...[
      ["Central argument", "argument"],
      ["What reader can do", "takeaway"],
      ["Next step", "nextStep"],
      ["What we are not arguing", "notArguing"],
      ["Why this angle", "whyAngle"],
      ["Opening approach", "opening"],
      ["Primary keyword", "primaryKeyword"],
      ["Search intent", "searchIntent"],
      ["Secondary topics", "secondary"],
      ["SERP review", "serp"],
      ["Competitor gap", "competitorGap"],
      ["Questions to answer", "questions"],
    ].map(([l, k]) => KV(l, v[k])),
    "",
    listRows("5. Outline for approval", v.outline, [
      ["Heading", "heading"],
      ["Coverage", "coverage"],
      ["Evidence", "proof"],
      ["Product mention", "product"],
      ["Target words", "words"],
    ]),
    listRows("Outline approval record", v.approvals, [
      ["Reviewer", "reviewer"],
      ["Decision", "decision"],
      ["Date", "date"],
      ["Changes requested", "changes"],
    ]),
    listRows("6. Evidence register", v.evidence, [
      ["Claim", "claim"],
      ["Proof", "proof"],
      ["Source and date", "source"],
      ["Status", "status"],
      ["Gap owner", "owner"],
    ]),
    "**Evidence policy:** Prefer primary sources, check freshness and provenance, never invent customer examples or represent unverified claims as fact.\n",
    listRows("7. Expert questions", v.questionsForSme, [
      ["Topic", "topic"],
      ["Existing knowledge", "known"],
      ["Exact question", "question"],
      ["Expert", "expert"],
      ["Due", "due"],
    ]),
    listRows("Approved real-world examples", v.usableExamples, [
      ["Example", "example"],
      ["Origin", "origin"],
      ["Use permission", "permission"],
      ["Naming", "naming"],
    ]),
    listRows("8. Product references", v.productRefs, [
      ["Section", "placement"],
      ["Capability", "capability"],
      ["Depth", "depth"],
      ["Show or explain", "expected"],
      ["Reviewer", "reviewer"],
      ["Restriction", "restriction"],
    ]),
    listRows("Product terminology", v.terminology, [
      ["Say", "say"],
      ["Avoid", "avoid"],
      ["Reason", "reason"],
    ]),
    "## 9. Style rules",
    ...[
      ["Tone", "tone"],
      ["Point of view", "pov"],
      ["Spelling", "spelling"],
      ["Headings", "headingStyle"],
      ["Formatting", "formatting"],
      ["Banned words", "banned"],
      ["Must fix", "mustFix"],
      ["Leave alone", "leaveAlone"],
    ].map(([l, k]) => KV(l, v[k])),
    "",
    listRows("10. Internal & external links", v.links, [
      ["Anchor", "anchor"],
      ["Type", "kind"],
      ["URL", "url"],
      ["Placement", "placement"],
      ["Purpose / claim", "purpose"],
    ]),
    KV("Do not link or mention", v.avoidLinks),
    "",
    "## 11. Review workflow",
    KV("Reviewer feedback rules", v.reviewRules),
    KV("Review / revision turnaround", v.revisionTurnaround),
    KV("Escalation", v.escalation),
    listRows("Review stages", v.reviews, [
      ["Stage", "stage"],
      ["Owner", "owner"],
      ["Turnaround", "deadline"],
      ["Checks", "check"],
      ["Exit criteria", "exit"],
    ]),
    "## 12. Before delivery and after feedback",
    ...CHECKS.map((x, i) => `- [ ] ${x}`),
    "",
    listRows("Feedback log", v.feedback, [
      ["Issue", "issue"],
      ["Category", "category"],
      ["Fix needed in", "fix"],
      ["Guide updated", "guide"],
    ]),
    "## Outstanding handoff risks",
    ...(qa.gaps.length
      ? qa.gaps.map((x) => `- ${x}`)
      : [
          "No automatic handoff warnings; verify all factual claims and approvals manually.",
        ]),
    "",
    "---",
    "Generated with GrowUp's Content Brief Template. No approval or source verification is implied by generation.",
  ];
  return lines.join("\n");
}

export const faqs = [
  {
    question: "Should a writer begin before the outline is approved?",
    answer:
      "No. Agree the argument, section order, evidence plan and product references first. Record named approval before drafting begins.",
  },
  {
    question:
      "What happens when proof or customer permission is missing?",
    answer:
      "Mark it as unresolved, assign an owner and due date, and keep the unsupported claim or example out of the publishable draft.",
  },
  {
    question: "How do I share the brief?",
    answer:
      "Copy the complete brief, download its Markdown file, or use Print / Save as PDF. Edits stay in this browser tab and are not automatically saved to an account.",
  },
];

export default function ContentBriefTemplate() {
  const [data, setData] = useState(() =>
    JSON.parse(JSON.stringify(SAMPLE))
  );
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState("summary");
  const [toast, setToast] = useState("");
  const [checks, setChecks] = useState([]);

  const qa = useMemo(() => quality(data), [data]);
  const markdown = useMemo(() => makeMarkdown(data, qa), [data, qa]);

  const set = (key, value) =>
    setData((p) => ({ ...p, [key]: value }));

  const group = (items) => (
    <Pairs entries={data} onChange={set} items={items} />
  );

  const reset = (example) => {
    if (
      !example &&
      !window.confirm("Clear every field and start a new brief?")
    )
      return;
    setData(JSON.parse(JSON.stringify(example ? SAMPLE : EMPTY)));
    setChecks([]);
    setStep(0);
    setToast("");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setToast("Complete brief copied to clipboard.");
    } catch {
      setToast(
        "Clipboard was blocked. Use Download Markdown instead."
      );
    }
  };

  const download = () => {
    const blob = new Blob([markdown], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      (txt(data.company) || "content")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") + "-content-brief.md";
    a.click();
    URL.revokeObjectURL(url);
    setToast("Complete Markdown brief downloaded.");
  };

  const hasText = (x) => filled(x);

  const stepReady = [
    hasText(data.title) && hasText(data.purpose),
    hasText(data.reader) && hasText(data.decision),
    hasText(data.argument) && hasText(data.primaryKeyword),
    data.outline.some(
      (x) => hasText(x.heading) && hasText(x.coverage)
    ),
    data.evidence.some((x) => hasText(x.claim)),
    hasText(data.tone),
    qa.gaps.length === 0,
  ];

  return (
    <div className="cbt">
      <style>{CSS}</style>

      <nav className="cbt-steps" aria-label="Brief editor steps">
        {STEPS.map((s, i) => (
          <button
            type="button"
            key={s.title}
            onClick={() => setStep(i)}
            aria-current={step === i ? "step" : undefined}
            className={`cbt-step ${step === i ? "active" : ""} ${
              stepReady[i] ? "ready" : ""
            }`}
          >
            <b>{stepReady[i] && step !== i ? "✓" : i + 1}</b>
            {s.short}
          </button>
        ))}
      </nav>

      <div className="cbt-util">
        <div className="cbt-eyebrow">
          CONTENT BRIEF BUILDER{" "}
          <span style={{ color: "#a0b1ad", padding: "0 6px" }}>·</span>{" "}
          STEP {step + 1} OF {STEPS.length}
        </div>
        <div className="cbt-util-actions">
          <button
            type="button"
            className="cbt-btn ghost"
            onClick={() => reset(true)}
          >
            ↺ Use example
          </button>
          <button
            type="button"
            className="cbt-btn ghost"
            onClick={() => reset(false)}
          >
            ＋ Start fresh
          </button>
        </div>
      </div>

      <div className="cbt-layout">
        <main className="cbt-panel cbt-editor">
          <div className="cbt-kicker">
            {String(step + 1).padStart(2, "0")} /{" "}
            {STEPS[step].title.toUpperCase()}
          </div>
          <h2 className="cbt-h2">
            {[
              "Give your writer the complete assignment.",
              "What decision is the buyer making?",
              "What is the article actually arguing?",
              "Agree the outline before drafting.",
              "Where will the claims and examples come from?",
              "Make revisions predictable, not subjective.",
              "Ready to send to your writer?",
            ][step]}
          </h2>
          <p className="cbt-intro">{STEPS[step].desc}</p>

          {step === 0 && (
            <>
              <Section
                title="Brief at a glance"
                desc="Make the purpose decision-led. A topic alone is not an assignment."
              >
                {group([
                  FIELD("Company / product", "company"),
                  FIELD("Content format", "format", {
                    options: [
                      "Comparison page",
                      "Guide",
                      "Case study",
                      "Landing page",
                      "ROI breakdown",
                      "Thought leadership",
                      "Alternatives page",
                      "Other",
                    ],
                  }),
                  FIELD("Working title", "title", { wide: true }),
                  FIELD("One-sentence purpose", "purpose", {
                    long: true,
                    wide: true,
                    hint:
                      "Who does this help decide what, and why does that matter?",
                  }),
                  FIELD("Target words", "words", { type: "number" }),
                  FIELD("Why this length?", "wordReason", {
                    long: true,
                  }),
                ])}
              </Section>
              <Section
                title="People & deadlines"
                desc="The writer needs named owners, not a vague instruction to 'check with Product'."
              >
                {group([
                  FIELD("Brief owner (client)", "briefOwner"),
                  FIELD("Writer / agency editor", "writer"),
                  FIELD("SME and availability", "expert", {
                    wide: true,
                  }),
                  FIELD("Date requested", "requested", {
                    type: "date",
                  }),
                  FIELD("Outline due", "outlineDue", {
                    type: "date",
                  }),
                  FIELD("First draft due", "draftDue", {
                    type: "date",
                  }),
                  FIELD("Target publish date", "publishDue", {
                    type: "date",
                  }),
                  FIELD("Outline approver", "outlineApprover"),
                ])}
              </Section>
              <div className="cbt-tip">
                <b>Commissioning rule:</b> The outline must be approved
                before the first draft begins. Approval status is tracked
                separately in Step 4.
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <Section
                title="Commercial objective"
                desc="Explain what this article contributes beyond ranking for a keyword."
              >
                {group([
                  FIELD("Business outcome", "businessGoal", {
                    long: true,
                    wide: true,
                  }),
                  FIELD("Funnel stage", "funnel", {
                    options: ["Awareness", "Consideration", "Decision"],
                  }),
                  FIELD("Primary conversion", "conversion"),
                  FIELD("Leading indicator", "leading", {
                    long: true,
                  }),
                  FIELD("Lagging indicator", "lagging", {
                    long: true,
                  }),
                  FIELD(
                    "Measurement owner, tool and review date",
                    "measurement",
                    { long: true, wide: true }
                  ),
                  FIELD(
                    "Pages this supports, replaces or must not overlap",
                    "supports",
                    { long: true, wide: true }
                  ),
                ])}
              </Section>
              <Section
                title="The reader"
                desc="Use the reader's actual problem, previous attempts, and buying situation."
              >
                {group([
                  FIELD(
                    "Job title, seniority and company context",
                    "reader",
                    { wide: true }
                  ),
                  FIELD("Buying stage", "buying", {
                    options: [
                      "Researching",
                      "Shortlisting",
                      "Comparing",
                      "Justifying internally",
                    ],
                  }),
                  FIELD(
                    "Problem in the reader's words",
                    "readerProblem",
                    { long: true, wide: true }
                  ),
                  FIELD("What they already know", "knows", {
                    long: true,
                  }),
                  FIELD(
                    "What they still need to understand",
                    "knowledgeGap",
                    { long: true }
                  ),
                  FIELD("Decision they are making", "decision", {
                    long: true,
                    wide: true,
                  }),
                  FIELD("Other people involved", "stakeholders"),
                  FIELD("Likely objections", "objections", {
                    long: true,
                  }),
                  FIELD(
                    "Source of this reader insight",
                    "audienceEvidence",
                    { long: true, wide: true }
                  ),
                ])}
              </Section>
            </>
          )}

          {step === 2 && (
            <>
              <Section
                title="The argument"
                desc="A correct topic can still produce a useless article. Agree what the writer must prove."
              >
                {group([
                  FIELD(
                    "Main argument in one sentence",
                    "argument",
                    { long: true, wide: true }
                  ),
                  FIELD("By the end, the reader can…", "takeaway", {
                    long: true,
                  }),
                  FIELD("Single next step", "nextStep", {
                    long: true,
                  }),
                  FIELD("What we are NOT arguing", "notArguing", {
                    long: true,
                    wide: true,
                  }),
                  FIELD(
                    "Why this angle instead of the obvious one?",
                    "whyAngle",
                    { long: true }
                  ),
                  FIELD("Opening scenario / tension", "opening", {
                    long: true,
                  }),
                ])}
              </Section>
              <Section
                title="Search and competitive context"
                desc="Document search intent and SERP observations only when relevant to this piece."
              >
                {group([
                  FIELD("Primary query", "primaryKeyword"),
                  FIELD("Search intent", "searchIntent", {
                    options: [
                      "Informational",
                      "Commercial investigation",
                      "Transactional",
                      "Navigational",
                      "Not search-led",
                    ],
                  }),
                  FIELD(
                    "Secondary queries or subtopics",
                    "secondary",
                    { long: true, wide: true }
                  ),
                  FIELD(
                    "Current SERP / competitor pages to review",
                    "serp",
                    { long: true, wide: true }
                  ),
                  FIELD(
                    "What competing content misses",
                    "competitorGap",
                    { long: true, wide: true }
                  ),
                  FIELD(
                    "Questions the article must answer (one per line)",
                    "questions",
                    { long: true, wide: true }
                  ),
                ])}
              </Section>
              <div className="cbt-tip">
                Avoid dictating a keyword list without explaining what
                decision the reader is trying to make. The outline should
                follow that decision.
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <Repeater
                title="Section-by-section outline"
                help="Each section needs a claim, intended evidence, product depth and an estimated length. Drag-free arrows let you reorder sections."
                kind="outline"
                data={data}
                setData={setData}
                button="outline section"
              />
              <div className="cbt-tip">
                Outline words: <b>{qa.outlineWords.toLocaleString()}</b>
                {Number(data.words) > 0
                  ? ` / ${Number(data.words).toLocaleString()} target`
                  : ""}
                . Approve the substance, not only the headings.
              </div>
              <Section
                title="Approval gate"
                desc="An approved outline is a recorded editorial decision, not something the tool can infer."
              >
                {group([
                  FIELD("Current outline status", "outlineStatus", {
                    options: [
                      "Not submitted",
                      "Awaiting approval",
                      "Changes requested",
                      "Approved",
                    ],
                  }),
                  FIELD("Final approver", "outlineApprover"),
                  FIELD("Date approved", "outlineApprovalDate", {
                    type: "date",
                  }),
                ])}
              </Section>
              <Repeater
                title="Reviewer decisions"
                help="Record who requested changes and which version was approved."
                kind="approvals"
                data={data}
                setData={setData}
                button="reviewer"
              />
            </>
          )}

          {step === 4 && (
            <>
              <Repeater
                title="Evidence register"
                help="One material claim per entry. Keep original sources, proof gaps, and named owners visible."
                kind="evidence"
                data={data}
                setData={setData}
                button="claim"
              />
              <Repeater
                title="Expert input"
                help="Ask one precise question per gap. Existing expert knowledge should not have to be repeated in review."
                kind="questionsForSme"
                data={data}
                setData={setData}
                button="question"
              />
              <Repeater
                title="Real examples & permission"
                help="Do not publish a customer scenario or name unless permission is recorded."
                kind="usableExamples"
                data={data}
                setData={setData}
                button="example"
              />
              <Repeater
                title="Product references"
                help="Explain the user-facing workflow, exact placement, depth, reviewer and plan limitations."
                kind="productRefs"
                data={data}
                setData={setData}
                button="product reference"
              />
              <Repeater
                title="Approved terminology"
                help="Give writers an actual replacement rather than vague feedback like 'make this more accurate'."
                kind="terminology"
                data={data}
                setData={setData}
                button="wording rule"
              />
            </>
          )}

          {step === 5 && (
            <>
              <Section
                title="Editorial house style"
                desc="Separate genuine content errors from harmless preferences."
              >
                {group([
                  FIELD(
                    "Tone and reader expectations",
                    "tone",
                    { long: true, wide: true }
                  ),
                  FIELD("Point of view", "pov", {
                    options: [
                      "Second person",
                      "First person plural",
                      "Third person",
                      "Mixed by section",
                    ],
                  }),
                  FIELD("Spelling", "spelling", {
                    options: ["UK English", "US English", "Other"],
                  }),
                  FIELD("Heading conventions", "headingStyle", {
                    options: ["Sentence case", "Title Case"],
                  }),
                  FIELD(
                    "Paragraphs, formatting and reading level",
                    "formatting",
                    { long: true, wide: true }
                  ),
                  FIELD("Banned phrases", "banned", {
                    long: true,
                    wide: true,
                  }),
                  FIELD("Must fix in review", "mustFix", {
                    long: true,
                    wide: true,
                  }),
                  FIELD(
                    "Leave alone if accurate and clear",
                    "leaveAlone",
                    { long: true, wide: true }
                  ),
                ])}
              </Section>
              <Repeater
                title="Internal & external links"
                help="Give anchor text, destination, placement and why the link helps the reader."
                kind="links"
                data={data}
                setData={setData}
                button="link"
              />
              <Section title="Link exclusions">
                {group([
                  FIELD("Do not link to or mention", "avoidLinks", {
                    long: true,
                    wide: true,
                  }),
                ])}
              </Section>
              <Section
                title="Review rules"
                desc="Tell agency editors what to check before submission and client reviewers how to leave actionable comments."
              >
                {group([
                  FIELD(
                    "How feedback should be given",
                    "reviewRules",
                    { long: true, wide: true }
                  ),
                  FIELD(
                    "Feedback and revision turnaround",
                    "revisionTurnaround",
                    { long: true, wide: true }
                  ),
                  FIELD(
                    "Escalation and missed deadlines",
                    "escalation",
                    { long: true, wide: true }
                  ),
                ])}
              </Section>
              <Repeater
                title="Review stages and owners"
                help="Name an accountable owner and exit criteria for each stage."
                kind="reviews"
                data={data}
                setData={setData}
                button="stage"
              />
            </>
          )}

          {step === 6 && (
            <>
              <div className="cbt-review-grid">
                <div className="cbt-review-kpi">
                  <strong>{qa.pct}%</strong>
                  <span>Brief completeness checks</span>
                </div>
                <div className="cbt-review-kpi">
                  <strong>{qa.gaps.length}</strong>
                  <span>Handoff warning(s)</span>
                </div>
                <div className="cbt-review-kpi">
                  <strong>{data.outline.length}</strong>
                  <span>Outline sections</span>
                </div>
                <div className="cbt-review-kpi">
                  <strong>
                    {
                      data.evidence.filter(
                        (x) => x.status === "Confirmed"
                      ).length
                    }
                    /{data.evidence.length}
                  </strong>
                  <span>Evidence entries marked confirmed</span>
                </div>
              </div>
              <Section
                title="Before the first draft"
                desc="Completion is a workflow aid, not a substitute for editorial or product approval."
              >
                {qa.gaps.length ? (
                  qa.gaps.map((g, i) => (
                    <div className="cbt-warning" key={i}>
                      <span>!</span>
                      {g}
                    </div>
                  ))
                ) : (
                  <div className="cbt-good">
                    ✓ No automatic handoff warnings. Verify facts and
                    approvals manually.
                  </div>
                )}
              </Section>
              <Section
                title="Agency editor’s pre-delivery checklist"
                desc="Tick each item when the draft has actually been checked—not when the brief is created."
              >
                {CHECKS.map((x, i) => (
                  <label className="cbt-check" key={i}>
                    <input
                      type="checkbox"
                      checked={checks.includes(i)}
                      onChange={(e) =>
                        setChecks((old) =>
                          e.target.checked
                            ? [...old, i]
                            : old.filter((n) => n !== i)
                        )
                      }
                    />
                    <span>{x}</span>
                  </label>
                ))}
              </Section>
              <Repeater
                title="Feedback to carry forward"
                help="Record specific recurring errors so the next article doesn't repeat the same review cycle."
                kind="feedback"
                data={data}
                setData={setData}
                button="feedback item"
              />
              <Section
                title="Export the complete writer-ready brief"
                desc="Exports include every stage, table, approval record, warning and checklist—not merely the preview."
              >
                <div className="cbt-exportbar">
                  <button
                    type="button"
                    className="cbt-btn primary"
                    onClick={copy}
                  >
                    Copy entire brief
                  </button>
                  <button
                    type="button"
                    className="cbt-btn dark"
                    onClick={download}
                  >
                    Download Markdown
                  </button>
                  <button
                    type="button"
                    className="cbt-btn"
                    onClick={() => window.print()}
                  >
                    Print / Save PDF
                  </button>
                </div>
                {toast && (
                  <div className="cbt-toast" role="status">
                    {toast}
                  </div>
                )}
                <p className="cbt-note">
                  Exports represent the information entered. They do not
                  certify facts, permissions or outline approval. Data
                  stays in this browser tab; download before closing it.
                </p>
              </Section>
            </>
          )}

          <div className="cbt-foot">
            <button
              className="cbt-btn"
              onClick={() => setStep((n) => Math.max(n - 1, 0))}
              disabled={step === 0}
            >
              ← Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                className="cbt-btn primary"
                onClick={() =>
                  setStep((n) => Math.min(n + 1, STEPS.length - 1))
                }
              >
                Continue →
              </button>
            ) : (
              <button className="cbt-btn primary" onClick={copy}>
                Copy complete brief
              </button>
            )}
          </div>
        </main>

        <aside className="cbt-panel cbt-preview">
          <div className="cbt-preview-head">
            <small>● LIVE BRIEF · UPDATES AS YOU TYPE</small>
            <h3>{data.title || "Untitled content brief"}</h3>
            <p>
              {data.company || "Company not entered"} · {data.format} ·{" "}
              {data.outlineStatus}
            </p>
            <div className="cbt-progress-track">
              <div
                className="cbt-progress-fill"
                style={{ width: `${qa.pct}%` }}
              />
            </div>
            <p>
              {qa.completed} of {qa.essentials.length} readiness checks
              complete
            </p>
          </div>

          <div className="cbt-preview-body">
            <div className="cbt-statrow">
              <div className="cbt-stat">
                <b>{qa.pct}%</b>
                <span>Brief readiness</span>
              </div>
              <div className="cbt-stat">
                <b>{qa.gaps.length}</b>
                <span>Handoff flags</span>
              </div>
            </div>

            <div
              className="cbt-util-actions"
              style={{ marginBottom: 7 }}
            >
              <button
                type="button"
                className={`cbt-btn ${tab === "summary" ? "dark" : ""}`}
                onClick={() => setTab("summary")}
              >
                Overview
              </button>
              <button
                type="button"
                className={`cbt-btn ${tab === "outline" ? "dark" : ""}`}
                onClick={() => setTab("outline")}
              >
                Outline ({data.outline.length})
              </button>
              <button
                type="button"
                className={`cbt-btn ${tab === "risks" ? "dark" : ""}`}
                onClick={() => setTab("risks")}
              >
                Handoff checks
              </button>
            </div>

            {tab === "summary" && (
              <>
                <div className="cbt-preview-section">
                  <h4>Purpose & business outcome</h4>
                  <p>
                    {data.purpose ||
                      "Describe the decision this piece should enable."}
                  </p>
                  <dl>
                    <dt>Commercial goal</dt>
                    <dd>{data.businessGoal || "—"}</dd>
                    <dt>Primary CTA</dt>
                    <dd>{data.conversion || "—"}</dd>
                    <dt>Draft due</dt>
                    <dd>{data.draftDue || "—"}</dd>
                  </dl>
                </div>
                <div className="cbt-preview-section">
                  <h4>Reader and argument</h4>
                  <dl>
                    <dt>Reader</dt>
                    <dd>{data.reader || "—"}</dd>
                    <dt>Decision</dt>
                    <dd>{data.decision || "—"}</dd>
                    <dt>Argument</dt>
                    <dd>{data.argument || "—"}</dd>
                    <dt>Keyword</dt>
                    <dd>{data.primaryKeyword || "—"}</dd>
                  </dl>
                </div>
                <div className="cbt-preview-section">
                  <h4>Evidence & ownership</h4>
                  <dl>
                    <dt>Claims</dt>
                    <dd>{data.evidence.length} entries</dd>
                    <dt>Confirmed</dt>
                    <dd>
                      {
                        data.evidence.filter(
                          (x) => x.status === "Confirmed"
                        ).length
                      }
                    </dd>
                    <dt>SME questions</dt>
                    <dd>{data.questionsForSme.length}</dd>
                    <dt>Product references</dt>
                    <dd>{data.productRefs.length}</dd>
                  </dl>
                </div>
                <div className="cbt-preview-section">
                  <h4>Review workflow</h4>
                  <dl>
                    <dt>Outline status</dt>
                    <dd>{data.outlineStatus}</dd>
                    <dt>Approver</dt>
                    <dd>{data.outlineApprover || "—"}</dd>
                    <dt>Review stages</dt>
                    <dd>{data.reviews.length}</dd>
                  </dl>
                </div>
              </>
            )}

            {tab === "outline" && (
              <div className="cbt-preview-section">
                <h4>
                  Section plan · {qa.outlineWords.toLocaleString()} words
                </h4>
                {data.outline.length ? (
                  data.outline.map((x, i) => (
                    <div className="cbt-mini" key={i}>
                      <b>{x.heading || `Section ${i + 1}`}</b>
                      {x.coverage || "Coverage not supplied"}
                      <div
                        style={{
                          color: THEMES.muted,
                          marginTop: 5,
                        }}
                      >
                        {x.words || "—"} words · Product:{" "}
                        {x.product || "None"}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Add your first outline section.</p>
                )}
              </div>
            )}

            {tab === "risks" && (
              <div className="cbt-preview-section">
                <h4>What needs attention</h4>
                {qa.gaps.length ? (
                  qa.gaps.map((g, i) => (
                    <div className="cbt-warning" key={i}>
                      <span>!</span>
                      {g}
                    </div>
                  ))
                ) : (
                  <div className="cbt-good">No automatic warnings.</div>
                )}
                <h4 style={{ marginTop: 16 }}>Essential sections</h4>
                {qa.essentials.map(([name, ok]) => (
                  <div
                    key={name}
                    style={{
                      display: "flex",
                      gap: 8,
                      fontSize: 11,
                      padding: "5px 0",
                      color: ok ? THEMES.teal : THEMES.muted,
                    }}
                  >
                    <b>{ok ? "✓" : "○"}</b>
                    {name}
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              className="cbt-btn ghost"
              onClick={() => setStep(6)}
              style={{ marginTop: 12, width: "100%" }}
            >
              Review complete brief & export →
            </button>
          </div>
        </aside>
      </div>
      <div className="cbt-print">
        <h1>{data.title || "Content brief"}</h1>
        <pre>{markdown}</pre>
      </div>
    </div>
  );
}