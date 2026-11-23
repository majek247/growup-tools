import React, { useEffect, useMemo, useState } from "react";

/**
 * GrowUp Content Brief Template — standalone React/Next.js component.
 * No Workspace dependency, no additional packages, no duplicated page hero.
 * All example names, customer scenarios and product information are fictional.
 */

const STEPS = [
{
  title: "Content Overview",
  short: "Overview",
  desc: "Document what needs to be written, the purpose of the content and the people responsible for delivery and approval.",
},
 {
  title: "Buyer & Business Goals",
  short: "Buyer & goal",
  desc: "Establish who the content should reach, which buying decision it supports and how its contribution to pipeline will be measured.",
},
{
  title: "Content Angle & SEO",
  short: "Angle & SEO",
  desc: "Establish the main argument, what readers should take away and how your content will differ from competing pages.",
},
{
  title: "Content Outline",
  short: "Outline",
  desc: "Plan what each section should cover, the evidence writers need and how much detail to include before drafting.",
},
 
{
  title: "Writing & Links",
  short: "Writing rules",
  desc: "Define your preferred writing style, formatting requirements and the links writers should include or avoid.",
},
{
  title: "Final Review & Export",
  short: "Export",
  desc: "Check that your writer has everything needed to produce the first draft, then export and share the completed brief.",
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
  competitors: [],
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
  company: "RelayLedger",
  title:
    "Usage-Based Billing Software vs Spreadsheets: Which Makes More Sense for Growing SaaS Companies?",
  purpose:
    "Help finance teams understand when spreadsheets stop being practical for managing usage-based billing and what to look for in a replacement.",
  format: "Comparison page",

  briefOwner: "Tory Gray · Head of Content",
  writer: "Northstar Content Studio · Senior Editor",
  expert: "Elena Brooks · Billing Operations Lead",
  requested: "2027-01-05",
  outlineDue: "2027-01-08",
  outlineApprover: "Tory Gray · Head of Content",
  outlineApprovalDate: "",
  outlineStatus: "Awaiting approval",
  draftDue: "2027-01-15",
  publishDue: "2027-01-25",

  words: "1800",
  wordReason:
    "The article needs enough room to explain where spreadsheets fall short, what software changes and which features buyers should evaluate.",

  businessGoal:
    "Increase organic-sourced demo requests from 25 to 40 per month (+60%) by the end of Q2 2027, with at least 30% qualifying as SQLs.",

  funnel: "Decision",
  conversion: "Book a product demo",

  leading:
    "Organic visits from relevant searches, clicks to product pages and demo CTA clicks",

  lagging:
    "Demo requests, sales-qualified opportunities and pipeline influenced by the article",

  measurement:
    "Marketing Ops will monitor organic traffic and demo conversions in GA4, then review SQLs and influenced pipeline in the CRM at 30, 60 and 90 days after publication.",

  supports:
    "Link to /usage-billing when discussing product capabilities and /pricing when covering costs. Don't repeat the general explanation of usage-based billing already covered on the overview page. Focus this article on the spreadsheet-versus-software decision.",

  reader:
    "Finance Directors and Heads of Revenue Operations at B2B SaaS companies with 50–300 employees",

  buying: "Comparing",

  readerProblem:
    "The finance team spends too much time checking billing adjustments, resolving discrepancies and getting invoices approved.",

  knows:
    "How their current billing process works, where manual adjustments happen and which teams approve invoices.",

  knowledgeGap:
    "Which billing problems justify dedicated software, what capabilities to compare and how to evaluate potential replacements.",

  decision:
    "Decide whether to improve their spreadsheet process or invest in dedicated billing software.",

  stakeholders:
    "CFO, Finance Operations, RevOps and Engineering",

  objections:
    "Implementation time, integration requirements, migration costs and whether the software can handle their existing workflows",

  audienceEvidence:
    "Anonymised finance and RevOps discovery-call notes, supported by input from Sales and Billing Operations. Verify buyer concerns before publication.",
  primaryKeyword: "usage based billing software vs spreadsheets",
  searchIntent: "Commercial investigation",
  secondary:
    "usage billing spreadsheet; SaaS invoice reconciliation; billing approval workflow",
  competitors: [
    {
      id: "sample-competitor-1",
      name: "Example Competitor A",
      url: "",
      gap: "Explains billing features but does not show who approves usage adjustments before invoices are issued.",
    },
    {
      id: "sample-competitor-2",
      name: "Example Competitor B",
      url: "",
      gap: "Does not explain how finance teams investigate exceptions or retrieve an approval history.",
    },
  ],
  argument:
    "Spreadsheets become harder to manage as billing complexity increases. Finance teams need to know which problems justify switching to dedicated software.",

  takeaway:
    "Understand the warning signs, compare available options and identify the capabilities worth testing in a demo.",

  nextStep:
    "Book a RelayLedger demo to see how invoice approvals and billing adjustments work.",
  notArguing:
    "Spreadsheets are always wrong; every finance team needs new software; software eliminates reconciliation work.",
  whyAngle:
    "Finance leaders evaluating billing software aren't necessarily looking to replace spreadsheets immediately. They're trying to understand whether their current process is becoming too expensive, time-consuming or risky to maintain. We chose this angle to address that decision directly, rather than pushing software as the obvious answer.",
  opening:
    "Open with a month-end scenario: 18 usage adjustments, three approvers, two disconnected spreadsheets and an invoice deadline.",
  questions:
    "At what volume do manual exception workflows become hard to control?\nWho can change an adjustment after review?\nWhat evidence should an auditor be able to retrieve?\nWhich billing integrations and permissions must buyers check?\nWhat makes a two-week pilot useful?",
  
  
    outline: [
    {
      heading: "Introduction",
      coverage:
        "Open with a growing SaaS company's month-end billing process: usage data arriving from different systems, invoice adjustments awaiting approval and finance checking multiple spreadsheets before invoices can be sent. Establish the commercial consequences of these delays and explain that the article will help buyers assess whether their existing process can support continued growth.",
      product: "None",
      words: "150",
      evidenceItems: [
        {
          evidence:
            "An anonymised operational scenario, with any time or cost estimates validated by the SME.",
          source:
            "Internal Billing Operations discovery-call notes and month-end workflow examples. Elena Brooks (Billing Operations Lead) to select and approve an anonymised scenario before drafting.",
        },
      ],
    },
    {
      heading: "H2: When spreadsheets are still enough",
      coverage:
        "Identify the conditions where spreadsheet-based billing remains economical and manageable. Consider transaction volume, pricing complexity, number of people involved and frequency of manual exceptions. Explain which simple controls can extend the usefulness of spreadsheets. Make clear that buying software before operational complexity warrants it may introduce unnecessary cost.",
      product: "None",
      words: "250",
      evidenceItems: [
        {
          evidence:
            "SME-validated examples illustrating low-complexity billing environments.",
          source:
            "Internal customer discovery notes covering spreadsheet-based billing and the Billing Operations team's process documentation. Elena Brooks to confirm which examples can be used and whether anonymisation is required.",
        },
      ],
    },
    {
      heading: "H2: Where manual billing starts breaking down",
      coverage:
        "Focus on the operational and financial costs of the current process. Explain how repeated reconciliations, manual corrections, delayed approvals and limited audit trails affect finance-team capacity and billing accuracy. Give readers a practical way to estimate time spent resolving exceptions and identify which recurring problems warrant further investigation.",
      product: "None",
      words: "350",
      evidenceItems: [
        {
          evidence:
            "A documented month-end workflow, SME input and an illustrative calculation with clearly stated assumptions.",
          source:
            "Billing Operations process documentation, anonymised reconciliation examples and SME interview notes. Elena Brooks to validate the workflow and any assumptions used in the time-cost calculation.",
        },
      ],
    },
    {
      heading: "H2: What to compare in billing software",
      coverage:
        "Organise the comparison around measurable operational requirements rather than generic feature names. Cover how vendors handle usage-data imports, adjustment approvals, exception resolution, permissions and audit records. For each capability, explain the business problem it addresses, a question buyers should ask and what to verify in a product demonstration.",
      product: "Light",
      words: "450",
      evidenceItems: [
        {
          evidence:
            "Verified feature documentation, product walkthroughs and approved implementation details.",
          source:
            "RelayLedger's current product feature documentation, integration specifications and internal demo environment. Product Marketing to confirm supported capabilities, plan restrictions and implementation requirements before publication.",
        },
      ],
    },
    {
      heading: "H2: A short evaluation checklist",
      coverage:
        "Provide a five-point vendor evaluation framework that finance leaders can share with colleagues. Include must-have requirements, integration dependencies, expected implementation effort, security considerations and potential process improvements. Recommend using the same test scenarios across shortlisted vendors to make comparisons more consistent.",
      product: "Light",
      words: "350",
      evidenceItems: [
        {
          evidence:
            "An evaluation framework reviewed by Sales Engineering and Billing Operations.",
          source:
            "Internal sales discovery-question framework, product demo checklist and Billing Operations evaluation notes. Sales Engineering and Elena Brooks to review the five criteria and approve the final checklist.",
        },
      ],
    },
    {
      heading: "Conclusion and next step",
      coverage:
        "Give readers a clear decision rule: maintain spreadsheets when the process remains controlled and efficient, but investigate dedicated software when recurring exceptions, approvals and reconciliation work create measurable friction. Invite buyers with these challenges to request a RelayLedger demonstration focused on their current billing workflow.",
      product: "Light",
      words: "150",
      evidenceItems: [
        {
          evidence:
            "Approved positioning and verified product capabilities.",
          source:
            "RelayLedger's product positioning guide, approved feature descriptions and current demo messaging. Tory Gray (Head of Content) and Product Marketing to verify the recommendation and CTA before publication.",
        },
      ],
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
    "Write like a senior billing operations consultant advising a Finance Director. Be direct, commercially informed and specific. Explain the operational consequences of each problem, use realistic examples and acknowledge when spreadsheets remain a sensible choice. Avoid exaggerated claims about automation or efficiency.",

  pov: "Second person",

  spelling: "UK English",

  headingStyle: "Sentence case",

  formatting:
    "Keep paragraphs to three or four sentences where practical. Use descriptive H2s, short bullet lists for evaluation criteria and one comparison table covering the main buying considerations. Explain technical terms on first use. Include specific examples instead of repeating generic software benefits.",

  banned:
    "seamless, revolutionary, game-changing, leverage, unlock efficiencies, best-in-class, future-proof, robust solution, effortlessly scale, single source of truth",

  mustFix:
    "Unsupported product claims, inaccurate feature or integration descriptions, invented statistics, missing citations, misleading competitor comparisons, unapproved customer examples, broken links and sections that fail to answer the buyer questions in the approved outline.",

  leaveAlone:
    "Minor differences in sentence structure, paragraph length or word choice when the writing is accurate, clear and consistent with the agreed tone. Don't request rewrites purely to match personal preferences.",

  avoidLinks:
    "Avoid competitor pricing pages with unverified information, outdated feature comparisons, affiliate software roundups and statistics without an identifiable original source. Don't link to pages that repeat information without helping readers make a buying decision.",
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
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');

.cbt,
.cbt * {
  box-sizing: border-box;
}

.cbt {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 12px 0 48px;
  font-family: "Montserrat", sans-serif;
  color: ${THEMES.ink};
  line-height: 1.6;
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


.cbt-section-plain {
  border-top: 0;
  padding-top: 0;
  margin-top: 0;
}

.cbt-btn.danger { color: #a43d33 }
.cbt-btn:hover:not(:disabled) { filter: brightness(.97) }
.cbt-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, .85fr);
  gap: 24px;
  align-items: start;
}
.cbt-panel {
  border: 1px solid ${THEMES.line};
  border-radius: 15px;
  background: white;
  min-width: 0;
  overflow: hidden;
}
.cbt-editor {
  padding: 28px;
}
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
.cbt-section:first-of-type {
  border-top: 0;
  padding-top: 0;
  margin-top: 0;
}
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
  border: 0;
  border-radius: 0;
  margin: 0 0 12px;
  padding: 8px 0 0;
  background: transparent;
}

.cbt-rowcard:last-of-type {
  margin-bottom: 10px;
  padding-bottom: 12px;
}

.cbt-rowcard .cbt-rowtop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  margin-bottom: 18px;
}

.cbt-rowcard .cbt-rowtop strong {
  display: block;
  font-family: "Montserrat", sans-serif;
  font-size: 15px;
  font-weight: 800;
  line-height: 1.4;
  letter-spacing: -0.3px;
  color: #073b3b;
}

.cbt-outline-divider {
  display: block;
  width: 100%;
  height: 1px;
  background: #e5efec;
  margin: 24px 0 18px;
  border: 0;
}

.cbt-rowcard:has(.cbt-outline-divider) {
  padding-bottom: 4px;
}


.cbt-outline-evidence {
margin-top: 24px;
padding-top: 18px;
border-top: 1px solid #e5efec;
}

.cbt-outline-evidence-head {
margin-bottom: 14px;
}

.cbt-outline-evidence-head h4 {
font-family: "Montserrat", sans-serif;
font-size: 13px;
font-weight: 800;
color: #073b3b;
margin: 0 0 5px;
}

.cbt-outline-evidence-head p {
font-size: 11px;
color: #57716e;
margin: 0;
}

.cbt-outline-evidence-row {
position: relative;
padding: 12px 34px 12px 0;
border-bottom: 1px solid #e5efec;
}

.cbt-outline-evidence-fields {
display: grid;
grid-template-columns: repeat(2, minmax(0, 1fr));
gap: 12px;
}

.cbt-outline-evidence-fields .cbt-area {
min-height: 80px;
}

.cbt-outline-evidence-remove {
position: absolute;
top: 38px;
right: 0;
display: inline-flex;
align-items: center;
justify-content: center;
width: 25px;
height: 25px;
padding: 0;
border: 1px solid #d6e5e1;
border-radius: 50%;
background: #fff;
color: #78918d;
cursor: pointer;
}

.cbt-outline-evidence-remove:hover {
background: #fff4f2;
border-color: #e4b7b1;
color: #b44b42;
}

.cbt-outline-evidence .cbt-add {
margin-top: 14px;
}

@media (max-width: 560px) {
.cbt-outline-evidence-fields {
grid-template-columns: 1fr;
}
}
 
 


.cbt-competitor-card {
  border: 1px solid #d6e5e1;
  border-radius: 10px;
  padding: 14px 16px;
  margin: 10px 0;
  background: #fbfdfc;
  transition: border-color 0.2s ease;
}

.cbt-competitor-card:focus-within {
  border-color: #91c7bd;
}


.cbt-competitor-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  margin-left: auto;
  border: 1px solid #d6e5e1;
  border-radius: 50%;
  background: #ffffff;
  color: #78918d;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.cbt-competitor-remove svg {
  width: 14px;
  height: 14px;
}

.cbt-competitor-remove:hover {
  border-color: #d9a8a1;
  background: #fff4f2;
  color: #b44b42;
}

.cbt-competitor-remove:focus-visible {
  outline: 2px solid #167273;
  outline-offset: 2px;
}



.cbt-competitor-card .cbt-rowtop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 12px;
}

.cbt-competitor-card .cbt-rowtop strong {
  font-size: 11px;
  font-weight: 700;
  flex: 1;
}

.cbt-competitor-card .cbt-competitor-remove {
  margin-left: auto;
  flex: 0 0 26px;
}


.cbt-competitor-card .cbt-rowtop strong {
  font-size: 11px;
  font-weight: 700;
}

.cbt-competitor-gap {
display: grid;
grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
gap: 14px;
padding: 15px 0;
border-bottom: 1px solid #e5efec;
align-items: start;
}

.cbt-competitor-gap:last-child {
border-bottom: 0;
}

.cbt-competitor-readonly {
min-height: 41px;
padding: 10px 12px;
border: 1px solid #d6e5e1;
border-radius: 8px;
background: #eef4f3;
color: #073b3b;
font-size: 12px;
font-weight: 700;
overflow-wrap: anywhere;
}

.cbt-competitor-empty {
font-size: 12px;
color: #57716e;
}

.cbt-competitor-gap .cbt-area {
min-height: 88px;
}

@media (max-width: 560px) {
  .cbt-competitor-gap {
    grid-template-columns: 1fr;
  }
}

.cbt-rowtop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  margin-bottom: 14px;
}

.cbt-rowtop strong {
  font-size: 12px;
  font-weight: 750;
  color: ${THEMES.dark};
}

.cbt-rowactions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  margin-left: auto;
  flex-shrink: 0;
}

.cbt-rowactions button {
  width: 28px;
  height: 28px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid #d6e5e1;
  border-radius: 7px;
  background: #ffffff;
  color: #57716e;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease,
    border-color 0.2s ease;
}

.cbt-rowactions button svg {
  width: 14px;
  height: 14px;
}

.cbt-rowactions button:hover:not(:disabled) {
  background: #eef4f3;
  border-color: #a8cbc3;
  color: #073b3b;
}

.cbt-rowactions button.danger {
  color: #78918d;
}

.cbt-rowactions button.danger:hover:not(:disabled) {
  background: #fff4f2;
  border-color: #e4b7b1;
  color: #b44b42;
}

.cbt-rowactions button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.cbt-rowactions button:focus-visible {
  outline: 2px solid #167273;
  outline-offset: 2px;
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
  padding: 24px;
  max-height: 650px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: #c8dcd7 transparent;
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


.cbt-pv .cbt-preview-body { padding: 17px 18px 20px; }
.cbt-pv-stats { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 7px; margin-bottom: 15px; }
.cbt-pv-stats > div { border: 1px solid #e1ece8; border-radius: 8px; padding: 10px 8px; background: #f8fbfa; min-width: 0; }
.cbt-pv-stats strong { display: block; font-size: 17px; line-height: 1.2; color: #073b3b; }
.cbt-pv-stats span { display: block; font-size: 9px; color: #57716e; margin-top: 4px; }
.cbt-pv-tabs { display: flex; flex-wrap: wrap; gap: 5px; padding-bottom: 12px; border-bottom: 1px solid #e5efec; }
.cbt-pv-tabs button { border: 1px solid #d6e5e1; background: #fff; color: #073b3b; border-radius: 7px; padding: 7px 9px; font-size: 10px; font-weight: 700; }
.cbt-pv-tabs button.active { background: #073b3b; color: #fff; border-color: #073b3b; }
.cbt-pv-section { padding: 15px 0; border-bottom: 1px solid #e5efec; }
.cbt-pv-section:last-child { border-bottom: 0; }
.cbt-pv-section-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
.cbt-pv-section-title h4 { font-size: 12px; margin: 0; font-weight: 800; color: #073b3b; }
.cbt-pv-section-title > span { font-size: 10px; font-weight: 700; color: #57716e; }
.cbt-pv-standout { background: #eef4f3; padding: 11px 12px; border-radius: 8px; font-size: 11px; font-weight: 650; color: #073b3b; margin: 0 0 12px; }
.cbt-pv-detail { display: grid; grid-template-columns: 94px minmax(0,1fr); gap: 9px; padding: 5px 0; border-bottom: 1px solid #f1f5f3; }
.cbt-pv-detail:last-child { border-bottom: 0; }
.cbt-pv-detail > span { font-size: 10px; color: #637c76; }
.cbt-pv-detail > strong { font-size: 10px; font-weight: 600; color: #073b3b; white-space: pre-wrap; overflow-wrap: anywhere; }
.cbt-pv-item { padding: 11px 12px; background: #f4f8f6; border-radius: 8px; margin: 7px 0; overflow-wrap: anywhere; }
.cbt-pv-item b { display: block; font-size: 10.5px; color: #073b3b; }
.cbt-pv-item p { margin: 6px 0 0; font-size: 10px; line-height: 1.6; color: #365452; white-space: pre-wrap; }
.cbt-pv-item-top { display: flex; justify-content: space-between; gap: 10px; align-items: start; }
.cbt-pv-item-top b { flex: 1; }
.cbt-pv-item-top span { white-space: nowrap; color: #57716e; font-size: 9px; }
.cbt-pv-url { display: block; color: #167273; font-size: 9.5px; margin-top: 4px; overflow-wrap: anywhere; }
.cbt-pv-muted, .cbt-pv-summary { color: #57716e; font-size: 10px; }
.cbt-pv-summary { margin-bottom: 10px; }
.cbt-pv-source { margin-top: 9px; padding-top: 8px; border-top: 1px solid #dce8e3; font-size: 10px; color: #365452; }
.cbt-pv-source strong { display: inline; }
.cbt-pv-source > div { margin-top: 3px; overflow-wrap: anywhere; }
.cbt-pv-lines p { border-bottom: 1px solid #eef3f1; padding: 7px 0; font-size: 10px; color: #365452; margin: 0; }
.cbt-pv-empty, .cbt-pv-disclaimer { font-size: 10px; color: #57716e; }
.cbt-pv-check { display: flex; align-items: start; gap: 8px; font-size: 10px; padding: 6px 0; color: #365452; }
.cbt-pv-check span { color: #9aa9a6; font-weight: 800; }
.cbt-pv-check span.complete { color: #167273; }
.cbt-pv-review { display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; padding: 12px 0 3px; border: 0; background: transparent; color: #167273; font-size: 11px; font-weight: 750; text-align: left; }
.cbt-pv-review:hover { color: #073b3b; }







.cbt-print { display: none; }
@media (max-width: 1050px) {
  .cbt-layout { grid-template-columns: 1fr; }
  .cbt-preview { position: static; }
  .cbt-preview-body { max-height: 480px; }
  .cbt-editor { padding: 19px; }
}
@media (max-width: 560px) {
  .cbt-fields { grid-template-columns: 1fr; }
  .cbt-editor { padding: 15px; }
  .cbt-h2 { font-size: 22px; }
  .cbt-util { align-items: flex-start; }
  .cbt-review-grid { grid-template-columns: 1fr; }
  .cbt-step { font-size: 11px; }
  .cbt-preview-section dl { grid-template-columns: 85px 1fr; }
}
@page { size: A4; margin: 10mm 17mm 15mm; }
@media print {
  html, body { background: #fff !important; margin: 0 !important; padding: 0 !important; }
  body * { visibility: hidden !important; }
  .cbt, .cbt-print, .cbt-print * { visibility: visible !important; }
  .cbt {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    display: block !important;
    max-width: none !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    transform: none !important;
  }

  .cbt > :not(.cbt-print) {
    display: none !important;
  }
  .cbt-print {
    display: block !important;
    position: static !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    font-family: "Montserrat", Arial, sans-serif !important;
    font-size: 9pt;
    line-height: 1.55;
    color: #173431;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .cbt-print * { box-sizing: border-box; }


.cbt-print-cover {
  background: #073b3b !important;
  color: #ffffff !important;
  padding: 16mm 14mm 14mm;
  border-radius: 3mm;
  margin-bottom: 8mm;
  break-inside: avoid;
}

  .cbt-print-brand { font-weight: 900; font-size: 20pt; letter-spacing: -.9pt; color: #ffffff !important; }
  .cbt-print-eyebrow { margin-top: 13mm; color: #92d7c5 !important; font-size: 8pt; letter-spacing: 1.5pt; font-weight: 800; text-transform: uppercase; }
  .cbt-print h1 { color: #ffffff !important; font-size: 23pt; line-height: 1.22; letter-spacing: -.6pt; margin: 4mm 0 5mm; border: 0; padding: 0; }
  .cbt-print-subtitle { color: #d2ece5 !important; font-size: 9pt; margin: 0; }
  .cbt-print-meta { display: flex; gap: 5mm; flex-wrap: wrap; padding-top: 8mm; margin-top: 8mm; border-top: 1px solid #5d8580; }
  .cbt-print-meta span { color: #ffffff !important; font-size: 8pt; }
  .cbt-print-section { margin: 8mm 0 0; break-inside: auto; }
  .cbt-print-section h2 { font-size: 13.5pt; line-height: 1.3; color: #073b3b !important; border-bottom: 1px solid #cfe2dc; padding: 0 0 3mm; margin: 0 0 5mm; break-after: avoid; }
  .cbt-print-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  .cbt-print-table tr { break-inside: avoid; }
  .cbt-print-table th { text-align: left; width: 32%; color: #55736e !important; font-size: 8.2pt; font-weight: 700; padding: 2mm 3mm 2mm 0; vertical-align: top; border-bottom: 1px solid #e8f0ed; }
  .cbt-print-table td { color: #173431 !important; font-size: 8.4pt; overflow-wrap: anywhere; white-space: pre-wrap; padding: 2mm 0; vertical-align: top; border-bottom: 1px solid #e8f0ed; }
  .cbt-print-item { break-inside: avoid; margin: 0 0 4mm; padding: 4mm 5mm; background: #f1f7f5 !important; border-left: 2.5pt solid #167273; border-radius: 1.5mm; }
  .cbt-print-item h3 { color: #073b3b !important; font-size: 10pt; margin: 0 0 2mm; line-height: 1.4; }
  .cbt-print-item p { margin: 1.5mm 0; font-size: 8.4pt; white-space: pre-wrap; overflow-wrap: anywhere; }
  .cbt-print-item small { color: #55736e !important; font-size: 7.5pt; }
  .cbt-print-item strong { color: #073b3b !important; }
  .cbt-print-kicker { text-transform: uppercase; letter-spacing: 1pt; color: #167273 !important; font-size: 7pt; font-weight: 800; }
  .cbt-print-footer { border-top: 1px solid #cfe2dc; padding-top: 4mm; margin-top: 11mm; color: #57716e !important; font-size: 7.5pt; }
  .cbt-print-footer strong { color: #073b3b !important; }
  .cbt-print-section, .cbt-print-item, .cbt-print-table { orphans: 2; widows: 2; }
}

`;

const FIELD = (label, key, opts = {}) => ({ label, key, ...opts });

const CONFIG = {



 
outline: [
  FIELD("Section heading", "heading"),
  FIELD("Key points to cover", "coverage", {
    long: true,
    wide: true,
  }),
  FIELD("Level of product detail", "product", {
    options: ["None", "Light", "Full walkthrough"],
  }),
  FIELD("Estimated word count", "words", {
    type: "number",
  }),
],

approvals: [
  FIELD("Reviewer name", "reviewer"),
  FIELD("Review decision", "decision", {
    options: ["Pending", "Changes requested", "Approved"],
  }),
  FIELD("Date reviewed", "date", {
    type: "date",
  }),
  FIELD("Requested changes", "changes", {
    long: true,
    wide: true,
  }),
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
    <section
      className={`cbt-section ${
        !title ? "cbt-section-plain" : ""
      }`}
    >
      {title && <h3>{title}</h3>}
      {desc && <p>{desc}</p>}
      {children}
    </section>
  );
}




function CompetitorResearch({ data, setData }) {
  const competitors = data.competitors || [];

  const addCompetitor = () => {
    setData((previous) => ({
      ...previous,
      competitors: [
        ...(previous.competitors || []),
        {
          id: `competitor-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 9)}`,
          name: "",
          url: "",
          gap: "",
        },
      ],
    }));
  };

  const updateCompetitor = (id, field, value) => {
    setData((previous) => ({
      ...previous,
      competitors: (previous.competitors || []).map((item) =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      ),
    }));
  };

  const removeCompetitor = (id) => {
    setData((previous) => ({
      ...previous,
      competitors: (previous.competitors || []).filter(
        (item) => item.id !== id
      ),
    }));
  };

  return (
    <>
      <Section
        title="Competing Pages to Review"
        desc="Add the competing pages you want your writer to review before preparing the outline."
      >
        {competitors.map((item, index) => (
       
       

<div className="cbt-competitor-card" key={item.id}>
  <div className="cbt-rowtop">
    <strong>Competitor {index + 1}</strong>

    <button
      type="button"
      className="cbt-competitor-remove"
      onClick={() => removeCompetitor(item.id)}
      aria-label={`Remove competitor ${index + 1}`}
      title="Remove competitor"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12h8" />
      </svg>
    </button>
  </div>


            <div className="cbt-fields">
              <Input
                label="Competitor name"
                value={item.name}
                placeholder="Enter competitor name"
                onChange={(value) =>
                  updateCompetitor(item.id, "name", value)
                }
              />

              <Input
                label="Page URL"
                type="url"
                value={item.url}
                placeholder="https://example.com/page"
                onChange={(value) =>
                  updateCompetitor(item.id, "url", value)
                }
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          className="cbt-add"
          onClick={addCompetitor}
          disabled={competitors.length >= 30}
        >
          + Add competitor
        </button>
      </Section>

      <Section
        title="Gaps in Competing Content"
        desc="Note what each competitor hasn't covered and what your writers should address instead."
      >
        {competitors.length === 0 ? (
          <p className="cbt-competitor-empty">
            Add competitors above to start documenting content gaps.
          </p>
        ) : (
          competitors.map((item, index) => (
            <div
              className="cbt-competitor-gap"
              key={item.id}
            >
              <div className="cbt-competitor-name">
                <label className="cbt-label">
                  Competitor
                </label>

                <div className="cbt-competitor-readonly">
                  {item.name.trim() ||
                    `Competitor ${index + 1}`}
                </div>
              </div>

              <Input
                label="What's missing from their content?"
                long
                value={item.gap}
                placeholder="Explain which questions, examples or buyer requirements this page fails to address."
                onChange={(value) =>
                  updateCompetitor(item.id, "gap", value)
                }
              />
            </div>
          ))
        )}
      </Section>
    </>
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
  {kind === "outline"
    ? "Section"
    : kind === "approvals"
      ? "Reviewer"
      : kind === "links"
        ? "Link"
        : button || title}{" "}
  {i + 1}
</strong>

          

<div className="cbt-rowactions">
  <button
    type="button"
    onClick={() => move(i, -1)}
    disabled={i === 0}
    aria-label={`Move item ${i + 1} up`}
    title="Move up"
  >
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  </button>

  <button
    type="button"
    onClick={() => move(i, 1)}
    disabled={i === rows.length - 1}
    aria-label={`Move item ${i + 1} down`}
    title="Move down"
  >
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  </button>

  <button
    type="button"
    className="danger"
    onClick={() => drop(i)}
    aria-label={`Remove item ${i + 1}`}
    title="Remove section"
  >
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 10v6M14 10v6" />
    </svg>
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

          {kind === "outline" && (
            <div className="cbt-outline-evidence">
              <div className="cbt-outline-evidence-head">
                <h4>Supporting Evidence and Examples</h4>
                <p>
                  Add the evidence each section needs and
                  where your writer can find it.
                </p>
              </div>

              {(
                r.evidenceItems ??
                (r.proof
                  ? [{ evidence: r.proof, source: "" }]
                  : [])
              ).map((item, evidenceIndex) => (
                <div
                  className="cbt-outline-evidence-row"
                  key={evidenceIndex}
                >
                  <div className="cbt-outline-evidence-fields">
                    <Input
                      label="Evidence or example"
                      long
                      value={item.evidence}
                      placeholder="Describe the evidence or example"
                      onChange={(value) => {
                        const current =
                          r.evidenceItems ??
                          (r.proof
                            ? [
                                {
                                  evidence: r.proof,
                                  source: "",
                                },
                              ]
                            : []);

                        update(
                          i,
                          "evidenceItems",
                          current.map((entry, index) =>
                            index === evidenceIndex
                              ? {
                                  ...entry,
                                  evidence: value,
                                }
                              : entry
                          )
                        );
                      }}
                    />

                    <Input
                      label="Source URL or description"
                      long
                      value={item.source}
                      placeholder="Paste a URL or describe where to find it"
                      onChange={(value) => {
                        const current =
                          r.evidenceItems ??
                          (r.proof
                            ? [
                                {
                                  evidence: r.proof,
                                  source: "",
                                },
                              ]
                            : []);

                        update(
                          i,
                          "evidenceItems",
                          current.map((entry, index) =>
                            index === evidenceIndex
                              ? {
                                  ...entry,
                                  source: value,
                                }
                              : entry
                          )
                        );
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    className="cbt-outline-evidence-remove"
                    onClick={() => {
                      const current =
                        r.evidenceItems ??
                        (r.proof
                          ? [
                              {
                                evidence: r.proof,
                                source: "",
                              },
                            ]
                          : []);

                      update(
                        i,
                        "evidenceItems",
                        current.filter(
                          (_, index) => index !== evidenceIndex
                        )
                      );
                    }}
                    aria-label={`Remove evidence ${
                      evidenceIndex + 1
                    }`}
                    title="Remove evidence"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14" />
                    </svg>
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="cbt-add"
                onClick={() => {
                  const current =
                    r.evidenceItems ??
                    (r.proof
                      ? [{ evidence: r.proof, source: "" }]
                      : []);

                  if (current.length >= 30) return;

                  update(i, "evidenceItems", [
                    ...current,
                    { evidence: "", source: "" },
                  ]);
                }}
                disabled={
                  (
                    r.evidenceItems ??
                    (r.proof
                      ? [{ evidence: r.proof, source: "" }]
                      : [])
                  ).length >= 30
                }
              >
                + Add evidence or example
              </button>
            </div>
          )}
{(kind === "outline" || kind === "links") &&
  i < rows.length - 1 && (
    <div
      className="cbt-outline-divider"
      aria-hidden="true"
    />
  )}

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
      "Outline supporting evidence",
      v.outline.some((section) =>
        (
          section.evidenceItems ??
          (section.proof
            ? [{ evidence: section.proof, source: "" }]
            : [])
        ).some(
          (item) =>
            filled(item.evidence) &&
            filled(item.source)
        )
      ),
    ],
["Style rules", filled(v.tone) && filled(v.mustFix)],
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
 
const outlineEvidence = v.outline.flatMap(
  (section) =>
    Array.isArray(section.evidenceItems)
      ? section.evidenceItems
      : []
);

if (
outlineEvidence.some(
(item) =>
filled(item.evidence) &&
!filled(item.source)
)
) {
gaps.push(
"Some supporting evidence is missing a source or reference."
);
}

if (
outlineEvidence.some(
(item) =>
!filled(item.evidence) &&
filled(item.source)
)
) {
gaps.push(
"Some evidence sources do not have a description."
);
}
 

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

      ["Questions to answer", "questions"],
    ].map(([l, k]) => KV(l, v[k])),
    "",

    listRows(
      "Competitor Research and Content Gaps",
      v.competitors || [],
      [
        ["Competitor", "name"],
        ["Page URL", "url"],
        ["Gap in competing content", "gap"],
      ]
    ),



    
listRows(
  "5. Content Outline",
  v.outline.map((section) => {
    const entries =
      section.evidenceItems ??
      (section.proof
        ? [{ evidence: section.proof, source: "" }]
        : []);

    return {
      ...section,
      exportedEvidence: entries.length
        ? entries
            .map(
              (item, index) =>
                `${index + 1}. ${
                  item.evidence || "Not provided"
                }\nSource: ${
                  item.source || "Not provided"
                }`
            )
            .join("\n\n")
        : "Not provided",
    };
  }),
  [
    ["Heading", "heading"],
    ["Key points to cover", "coverage"],
    ["Supporting evidence and sources", "exportedEvidence"],
    ["Level of product detail", "product"],
    ["Estimated word count", "words"],
  ]
),
"",



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
    listRows("10. Internal & External Links", v.links, [
      ["Anchor", "anchor"],
      ["Type", "kind"],
      ["URL", "url"],
      ["Placement", "placement"],
      ["Purpose / claim", "purpose"],
    ]),
    KV("Do not link or mention", v.avoidLinks),
    "",
     "## 11. Before delivery and after feedback",
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
    question: "What should a good B2B SaaS content brief include?",
    answer:
      "A B2B SaaS content brief should include the target buyer, business objective, search intent, primary keyword, content angle, detailed outline, supporting evidence, product information, internal links, writing guidelines and approval responsibilities. Each section should help the writer produce an accurate, commercially relevant article.",
  },
  {
    question: "What's the difference between a content brief and a content outline?",
    answer:
      "A content brief defines the article's audience, purpose, search intent, key arguments, supporting evidence and writing requirements. A content outline is one part of that brief. It specifies the headings, what each section should cover and how the information should be organised.",
  },
  {
    question: "How detailed should a content brief be before assigning an article?",
    answer:
      "A content brief should provide enough information for the writer to produce an accurate first draft without guessing. Include section-level instructions, product facts, sources, examples and a clear CTA. Avoid prescribing every sentence or leaving important research and product decisions to the writer.",
  },
  {
    question: "How do I create a content brief that freelance writers can actually follow?",
    answer:
      "Start with the target buyer, article objective and central argument. Build an outline explaining what each section must cover, then attach relevant sources, product documentation and approved examples.  ",
  },
  {
    question: "Who should be responsible for writing and approving a content brief?",
    answer:
      "The content manager or SEO lead should own the brief and its commercial direction. A subject-matter expert should verify technical and product information, while the relevant marketing stakeholder approves the angle and outline.   ",
  },
  {
    question: "How long should it take to prepare a content brief?",
    answer:
      "A straightforward article brief may take 30–60 minutes when buyer research, keyword data and product documentation are available. Complex comparison pages or technical articles can take several hours because they require competitor analysis, product verification and SME input.    ",
  },
  {
    question: "How do you verify that an agency or freelancer followed the brief?",
    answer:
      "Compare the submitted draft against the approved outline, required arguments, sources, product references, internal links and writing guidelines. Verify factual claims and check that the article answers the intended buyer questions.     ",
  },
  {
    question: "Can I export this content brief to share with external writers or agencies?",
    answer:
      "Yes. You can copy the completed brief, download an editable Excel workbook or save a branded PDF. Both exports include the content requirements, outline, supporting evidence, sources and writing instructions. Use Excel for collaborative editing and PDF for a fixed reference copy.",
  },
  {
    question: "Does this content brief template require an account or save my work automatically?",
    answer:
      "No account is required. The template automatically saves your brief in your browser's local storage, allowing you to refresh the page or return later on the same browser and device. Your changes do not sync across devices, and clearing browser site data may remove them.",
  },
];

// Export data is grouped consistently across the printable brief and editable workbook.
const BRIEF_GROUPS = [
  { title: "01 / Brief & ownership", fields: [
    ["Company", "company"], ["Working title", "title"], ["Content purpose", "purpose"], ["Format", "format"],
    ["Brief owner", "briefOwner"], ["Writer / agency", "writer"], ["Subject-matter expert", "expert"],
    ["Requested", "requested"], ["Outline due", "outlineDue"], ["Outline approver", "outlineApprover"],
    ["Outline approval status", "outlineStatus"], ["Outline approval date", "outlineApprovalDate"],
    ["First draft due", "draftDue"], ["Publish target", "publishDue"],
    ["Target word count", "words"], ["Reason for word count", "wordReason"],
  ]},
  { title: "02 / Commercial objective", fields: [
    ["Commercial objective", "businessGoal"], ["Buyer funnel stage", "funnel"], ["Target conversion", "conversion"],
    ["Early indicators", "leading"], ["Pipeline / revenue metrics", "lagging"],
    ["Measurement plan", "measurement"], ["Related pages / overlap", "supports"],
  ]},
  { title: "03 / Target buyer", fields: [
    ["Target buyer", "reader"], ["Buying stage", "buying"], ["Buyer problem", "readerProblem"],
    ["What buyers already know", "knows"], ["Knowledge gaps", "knowledgeGap"],
    ["Decision to support", "decision"], ["Other stakeholders", "stakeholders"],
    ["Key objections", "objections"], ["Audience evidence", "audienceEvidence"],
  ]},
  { title: "04 / SEO & content direction", fields: [
    ["Primary search query", "primaryKeyword"], ["Search intent", "searchIntent"],
    ["Related queries", "secondary"], ["Central argument", "argument"],
    ["Reader takeaway", "takeaway"], ["Recommended next action", "nextStep"],
    ["Arguments to avoid", "notArguing"], ["Why this angle", "whyAngle"],
    ["Questions to answer", "questions"],
  ]},
  { title: "07 / Writing guidelines", fields: [
    ["Tone", "tone"], ["Point of view", "pov"], ["Spelling", "spelling"],
    ["Heading style", "headingStyle"], ["Formatting", "formatting"],
    ["Banned phrases", "banned"], ["Must fix", "mustFix"],
    ["Leave alone if accurate", "leaveAlone"], ["Links to exclude", "avoidLinks"],
  ]},
];
const briefEvidence = (section) =>
  Array.isArray(section.evidenceItems)
    ? section.evidenceItems
    : section.proof && section.proof !== "None"
      ? [{ evidence: section.proof, source: "" }]
      : [];
const exportString = (v) => String(v ?? "");
const briefFileStem = (name) =>
  (exportString(name).trim() || "content")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function PrintableBrief({ data, qa }) {
  const table = (group) => (
    <section className="cbt-print-section" key={group.title}>
      <h2>{group.title}</h2>
      <table className="cbt-print-table"><tbody>
        {group.fields.map(([label, key]) => (
          <tr key={key}><th>{label}</th><td>{exportString(data[key]) || "—"}</td></tr>
        ))}
      </tbody></table>
    </section>
  );
  return (
    <div className="cbt-print">
      <div className="cbt-print-cover">
        <div className="cbt-print-brand">GrowUp<span style={{ color: "#75d6c1" }}>.</span></div>
        <div className="cbt-print-eyebrow">Content strategy / Writer handoff</div>
        <h1>{data.title || "Content brief"}</h1>
        <p className="cbt-print-subtitle">{data.company || "Company not specified"} · {data.format || "Content brief"}</p>
        <div className="cbt-print-meta">
          <span>Readiness: {qa.pct}%</span>
          <span>{data.outline.length} planned sections</span>
          <span>Draft due: {data.draftDue || "TBC"}</span>
        </div>
      </div>
      {BRIEF_GROUPS.slice(0, 4).map(table)}
      <section className="cbt-print-section">
        <h2>05 / Competing pages & content gaps</h2>
        {(data.competitors || []).length ? data.competitors.map((c, i) => (
          <div className="cbt-print-item" key={c.id || i}>
            <h3>{String(i + 1).padStart(2, "0")} · {c.name || "Unnamed competitor"}</h3>
            <p><strong>Page:</strong> {c.url || "Not provided"}</p>
            <p><strong>Content gap:</strong> {c.gap || "Not provided"}</p>
          </div>
        )) : <p>No competing pages added.</p>}
      </section>
      <section className="cbt-print-section">
        <h2>06 / Content outline & evidence</h2>
        {(data.outline || []).length ? data.outline.map((sec, i) => (
          <div className="cbt-print-item" key={i}>
            <div className="cbt-print-kicker">Section {String(i + 1).padStart(2, "0")} · {sec.words || "—"} words · Product detail: {sec.product || "None"}</div>
            <h3>{sec.heading || "Untitled section"}</h3>
            <p>{sec.coverage || "No instructions supplied"}</p>
            {briefEvidence(sec).map((ev, j) => (
              <div key={j} style={{ marginTop: "3mm", borderTop: "1px solid #dce8e3", paddingTop: "2mm" }}>
                <p><strong>Evidence {j + 1}:</strong> {ev.evidence || "Not provided"}</p>
                <p><strong>Source:</strong> {ev.source || "Not provided"}</p>
              </div>
            ))}
          </div>
        )) : <p>No outline sections added.</p>}
      </section>
      {BRIEF_GROUPS.slice(4).map(table)}
      <section className="cbt-print-section">
        <h2>08 / Internal & external links</h2>
        {(data.links || []).length ? data.links.map((link, i) => (
          <div className="cbt-print-item" key={i}>
            <div className="cbt-print-kicker">{link.kind || "Link"} link {String(i + 1).padStart(2, "0")}</div>
            <h3>{link.anchor || "Anchor not provided"}</h3>
            <p><strong>Destination:</strong> {link.url || "Not provided"}</p>
            <p><strong>Placement:</strong> {link.placement || "Not provided"}</p>
            <p><strong>Why it belongs:</strong> {link.purpose || "Not provided"}</p>
          </div>
        )) : <p>No links added.</p>}
      </section>
      <section className="cbt-print-section">
        <h2>09 / Draft quality & handoff</h2>
        <div className="cbt-print-item">
          {CHECKS.map((check, i) => <p key={i}>☐ {check}</p>)}
        </div>
        <h3 style={{ fontSize: "10pt", color: "#073b3b", marginTop: "5mm" }}>Items needing attention</h3>
        {qa.gaps.length ? qa.gaps.map((gap, i) => <p key={i}>• {gap}</p>) : <p>No automatic handoff issues detected.</p>}
        {(data.feedback || []).map((f, i) => (
          <div className="cbt-print-item" key={i}><h3>Feedback {i + 1}: {f.issue || "Untitled"}</h3>
            <p>Category: {f.category || "—"} · Fix: {f.fix || "—"} · Guide updated: {f.guide || "—"}</p>
          </div>
        ))}
      </section>
      <footer className="cbt-print-footer"><strong>GrowUp · seo-growup.com</strong>: Content Brief Template. Review all claims, sources and permissions before publication. Generated content does not imply approval.</footer>
    </div>
  );
}




function BriefPreview({ data, qa, onReview }) {
  const [view, setView] = useState("overview");
  const show = (value) => String(value ?? "").trim() || "Not provided";
  const evidenceFor = (section) =>
    Array.isArray(section.evidenceItems)
      ? section.evidenceItems
      : section.proof && section.proof !== "None"
        ? [{ evidence: section.proof, source: "" }]
        : [];
  const allEvidence = data.outline.flatMap(evidenceFor);
  const sourcedEvidence = allEvidence.filter(
    (item) => filled(item.evidence) && filled(item.source)
  ).length;
  const internalLinks = data.links.filter((link) => link.kind === "Internal");
  const externalLinks = data.links.filter((link) => link.kind === "External");
  const competitors = data.competitors || [];
  const detail = (label, value) => (
    <div className="cbt-pv-detail" key={label}>
      <span>{label}</span>
      <strong>{show(value)}</strong>
    </div>
  );
  const heading = (title, count) => (
    <div className="cbt-pv-section-title">
      <h4>{title}</h4>
      {count !== undefined && <span>{count}</span>}
    </div>
  );

  return (
    <aside className="cbt-panel cbt-preview cbt-pv">
      <div className="cbt-preview-head">
        <small>● LIVE CONTENT BRIEF</small>
        <h3>{data.title || "Untitled content brief"}</h3>
        <p>{show(data.company)} · {show(data.format)}</p>
        <div className="cbt-progress-track">
          <div className="cbt-progress-fill" style={{ width: `${qa.pct}%` }} />
        </div>
        <p>{qa.completed} of {qa.essentials.length} required details completed</p>
      </div>

      <div className="cbt-preview-body">
        <div className="cbt-pv-stats">
          <div><strong>{qa.pct}%</strong><span>Brief completeness</span></div>
          <div><strong>{qa.gaps.length}</strong><span>Items to check</span></div>
          <div><strong>{data.outline.length}</strong><span>Sections planned</span></div>
        </div>

        <div className="cbt-pv-tabs" role="group" aria-label="Brief preview views">
          {[
            ["overview", "Overview"],
            ["seo", "SEO"],
            ["outline", "Outline"],
            ["links", "Links & style"],
            ["checks", "Checks"],
          ].map(([id, label]) => (
            <button
              type="button"
              key={id}
              aria-pressed={view === id}
              className={view === id ? "active" : ""}
              onClick={() => setView(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {view === "overview" && (
          <div className="cbt-pv-view">
            <section className="cbt-pv-section">
              {heading("Commercial objective")}
              <p className="cbt-pv-standout">{show(data.businessGoal)}</p>
              {detail("Content purpose", data.purpose)}
              {detail("Buyer stage", data.funnel)}
              {detail("Target conversion", data.conversion)}
              {detail("Early indicators", data.leading)}
              {detail("Pipeline / revenue metrics", data.lagging)}
            </section>
            <section className="cbt-pv-section">
              {heading("Target buyer & decision")}
              {detail("Target buyer", data.reader)}
              {detail("Buyer problem", data.readerProblem)}
              {detail("Decision to support", data.decision)}
              {detail("Other stakeholders", data.stakeholders)}
              {detail("Key objections", data.objections)}
            </section>
            <section className="cbt-pv-section">
              {heading("Content direction")}
              {detail("Central argument", data.argument)}
              {detail("Reader takeaway", data.takeaway)}
              {detail("Next action", data.nextStep)}
            </section>
            <section className="cbt-pv-section">
              {heading("Delivery & ownership")}
              {detail("Brief owner", data.briefOwner)}
              {detail("Assigned writer", data.writer)}
              {detail("SME", data.expert)}
              {detail("Outline approver", data.outlineApprover)}
              {detail("Outline due", data.outlineDue)}
              {detail("Draft due", data.draftDue)}
              {detail("Publish target", data.publishDue)}
              {detail("Target length", data.words ? `${data.words} words` : "")}
            </section>
          </div>
        )}

        {view === "seo" && (
          <div className="cbt-pv-view">
            <section className="cbt-pv-section">
              {heading("Search strategy")}
              {detail("Primary query", data.primaryKeyword)}
              {detail("Search intent", data.searchIntent)}
              {detail("Related queries", data.secondary)}
              {detail("Supporting pages", data.supports)}
              {detail("Differentiation", data.whyAngle)}
            </section>
            <section className="cbt-pv-section">
              {heading("Competing pages", competitors.length)}
              {competitors.length ? competitors.map((c, i) => (
                <div className="cbt-pv-item" key={c.id || i}>
                  <b>{show(c.name) === "Not provided" ? `Competitor ${i + 1}` : c.name}</b>
                  <span className="cbt-pv-url">{show(c.url)}</span>
                  <p><strong>Content gap:</strong> {show(c.gap)}</p>
                </div>
              )) : <p className="cbt-pv-empty">No competing pages added yet.</p>}
            </section>
            <section className="cbt-pv-section">
              {heading("Questions to answer")}
              {data.questions?.trim() ? (
                <div className="cbt-pv-lines">
                  {data.questions.split("\n").filter((line) => line.trim()).map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              ) : <p className="cbt-pv-empty">No questions added yet.</p>}
            </section>
          </div>
        )}

        {view === "outline" && (
          <div className="cbt-pv-view">
            <section className="cbt-pv-section">
              {heading("Section plan", data.outline.length)}
              <div className="cbt-pv-summary">{qa.outlineWords.toLocaleString()} of {show(data.words)} target words · {sourcedEvidence} sourced evidence entries</div>
              {data.outline.length ? data.outline.map((section, i) => (
                <div className="cbt-pv-item" key={i}>
                  <div className="cbt-pv-item-top"><b>{show(section.heading)}</b><span>{show(section.words)} words</span></div>
                  <p>{show(section.coverage)}</p>
                  <div className="cbt-pv-muted">Product detail: {show(section.product)}</div>
                  {evidenceFor(section).map((item, j) => (
                    <div className="cbt-pv-source" key={j}>
                      <strong>Evidence:</strong> {show(item.evidence)}
                      <div><strong>Source:</strong> {show(item.source)}</div>
                    </div>
                  ))}
                </div>
              )) : <p className="cbt-pv-empty">Add sections in Step 04 to build your outline.</p>}
            </section>
          </div>
        )}

        {view === "links" && (
          <div className="cbt-pv-view">
            <section className="cbt-pv-section">
              {heading("Internal links", internalLinks.length)}
              {internalLinks.length ? internalLinks.map((link, i) => (
                <div className="cbt-pv-item" key={i}>
                  <b>{show(link.anchor)}</b>
                  <span className="cbt-pv-url">{show(link.url)}</span>
                  <p>{show(link.placement)} · {show(link.purpose)}</p>
                </div>
              )) : <p className="cbt-pv-empty">No internal links added.</p>}
            </section>
            <section className="cbt-pv-section">
              {heading("External links", externalLinks.length)}
              {externalLinks.length ? externalLinks.map((link, i) => (
                <div className="cbt-pv-item" key={i}>
                  <b>{show(link.anchor)}</b>
                  <span className="cbt-pv-url">{show(link.url)}</span>
                  <p>{show(link.placement)} · {show(link.purpose)}</p>
                </div>
              )) : <p className="cbt-pv-empty">No external links added.</p>}
              {detail("Links to exclude", data.avoidLinks)}
            </section>
            <section className="cbt-pv-section">
              {heading("Writing guidelines")}
              {detail("Tone", data.tone)}
              {detail("Point of view", data.pov)}
              {detail("Spelling", data.spelling)}
              {detail("Heading style", data.headingStyle)}
              {detail("Formatting", data.formatting)}
              {detail("Banned phrases", data.banned)}
              {detail("Must fix", data.mustFix)}
            </section>
          </div>
        )}

        {view === "checks" && (
          <div className="cbt-pv-view">
            <section className="cbt-pv-section">
              {heading("Items needing attention", qa.gaps.length)}
              {qa.gaps.length ? qa.gaps.map((gap, i) => (
                <div className="cbt-warning" key={i}><span>!</span>{gap}</div>
              )) : <div className="cbt-good">No automatic handoff warnings.</div>}
            </section>
            <section className="cbt-pv-section">
              {heading("Brief completeness", `${qa.completed}/${qa.essentials.length}`)}
              {qa.essentials.map(([name, complete]) => (
                <div className="cbt-pv-check" key={name}>
                  <span className={complete ? "complete" : ""}>{complete ? "✓" : "○"}</span>
                  {name}
                </div>
              ))}
            </section>
            <p className="cbt-pv-disclaimer">Completion reflects entered information, not verification of facts, sources or permissions.</p>
          </div>
        )}

        <button type="button" className="cbt-pv-review" onClick={onReview}>
          Review full brief & export <span aria-hidden="true">→</span>
        </button>
      </div>
    </aside>
  );
}



const CONTENT_BRIEF_STORAGE_KEY = "growup-content-brief-v1";

export default function ContentBriefTemplate() {
  const [data, setData] = useState(() =>
    JSON.parse(JSON.stringify(SAMPLE))
  );

  const [step, setStep] = useState(0);
  const [tab, setTab] = useState("summary");
  const [toast, setToast] = useState("");
  const [checks, setChecks] = useState([]);

  // Prevent autosave from overwriting saved work before it loads.
  const [storageLoaded, setStorageLoaded] = useState(false);

  // Restore the previous session when the tool opens.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(
        CONTENT_BRIEF_STORAGE_KEY
      );

      if (saved) {
        const parsed = JSON.parse(saved);

        if (
          parsed &&
          parsed.data &&
          typeof parsed.data === "object" &&
          !Array.isArray(parsed.data)
        ) {
          setData({
            ...JSON.parse(JSON.stringify(EMPTY)),
            ...parsed.data,
          });

          if (Number.isInteger(parsed.step)) {
            setStep(
              Math.max(
                0,
                Math.min(parsed.step, STEPS.length - 1)
              )
            );
          }

          if (Array.isArray(parsed.checks)) {
            setChecks(
              parsed.checks.filter(
                (item) =>
                  Number.isInteger(item) &&
                  item >= 0 &&
                  item < CHECKS.length
              )
            );
          }
        }
      }
    } catch (error) {
      console.error("Could not restore content brief:", error);
    } finally {
      setStorageLoaded(true);
    }
  }, []);

  // Automatically save every change after restoration finishes.
  useEffect(() => {
    if (!storageLoaded) return;

    try {
      window.localStorage.setItem(
        CONTENT_BRIEF_STORAGE_KEY,
        JSON.stringify({
          data,
          step,
          checks,
          savedAt: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error("Could not save content brief:", error);
    }
  }, [data, step, checks, storageLoaded]);

  const qa = useMemo(() => quality(data), [data]);

  const markdown = useMemo(
    () => makeMarkdown(data, qa),
    [data, qa]
  );

  const set = (key, value) =>
    setData((p) => ({ ...p, [key]: value }));

  const group = (items) => (
    <Pairs entries={data} onChange={set} items={items} />
  );

  const reset = (example) => {
    if (
      !window.confirm(
        example
          ? "Replace your current brief with the example? Your saved changes will be overwritten."
          : "Clear your saved brief and start fresh? This cannot be undone."
      )
    ) {
      return;
    }

    const freshData = JSON.parse(
      JSON.stringify(example ? SAMPLE : EMPTY)
    );

    setData(freshData);
    setChecks([]);
    setStep(0);
    setToast("");

    // Replace the stored version immediately.
    try {
      window.localStorage.setItem(
        CONTENT_BRIEF_STORAGE_KEY,
        JSON.stringify({
          data: freshData,
          step: 0,
          checks: [],
          savedAt: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error("Could not reset saved brief:", error);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setToast("Complete brief copied to clipboard.");
    } catch {
      setToast(
        "Clipboard was blocked. Use Download Excel instead."
      );
    }
  };




  const downloadExcel = async () => {
    try {
      // Install once in your Next.js project: npm install exceljs
      const ExcelJS = (await import("exceljs")).default;
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "GrowUp";
      workbook.subject = "Editable B2B SaaS content brief";
      workbook.title = data.title || "Content brief";
      workbook.properties.date1904 = false;
      const dark = "073B3B";
      const teal = "167273";
      const pale = "EEF4F3";
      const ink = "011522";

      const sheet = (name, columns) => {
        const ws = workbook.addWorksheet(name, { views: [{ state: "frozen", ySplit: 3 }] });
        ws.columns = columns.map(([header, width]) => ({ header, key: header, width }));
        ws.getRow(1).height = 30;
        ws.getRow(1).eachCell((cell) => {
          cell.font = { name: "Arial", bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${dark}` } };
          cell.alignment = { vertical: "middle", wrapText: true };
        });
        ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: columns.length } };
        return ws;
      };
      const append = (ws, values) => {
        const row = ws.addRow(values.map(exportString));
        const longest = Math.max(...values.map((v) => exportString(v).length), 0);
        row.height = Math.min(112, Math.max(26, 17 + Math.ceil(longest / 75) * 13));
        row.eachCell({ includeEmpty: true }, (cell, col) => {
          cell.font = { name: "Arial", size: 10, color: { argb: `FF${ink}` }, bold: col === 1 };
          cell.alignment = { vertical: "top", wrapText: true };
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${row.number % 2 ? "FFFFFF" : pale}` } };
          cell.border = { bottom: { style: "hair", color: { argb: "FFDCE8E3" } } };
        });
        return row;
      };

      const start = sheet("START HERE", [["Field", 29], ["Details / editable value", 94]]);
      append(start, ["GrowUp · Content Brief", data.title || "Untitled brief"]);
      append(start, ["Company", data.company]);
      append(start, ["Format", data.format]);
      append(start, ["Readiness at export", `${qa.pct}% (${qa.completed}/${qa.essentials.length} checks)`]);
      append(start, ["How to use", "Edit any value in the worksheets. The PDF is a fixed snapshot; this Excel workbook is editable. Changes in Excel do not automatically sync back to the online builder."]);
      append(start, ["Source verification", "Source descriptions are not proof of approval. Verify claims, documents and permissions before publication."]);
      for (const group of BRIEF_GROUPS) {
        const ws = sheet(group.title.replace(/^\d+ \/ /, "").slice(0, 31), [["Field", 32], ["Details / editable value", 103]]);
        group.fields.forEach(([label, key]) => append(ws, [label, data[key]]));
      }
      const comp = sheet("Competing Pages", [["Competitor", 27], ["Page URL", 47], ["Content gap / opportunity", 97]]);
      (data.competitors || []).forEach((c) => append(comp, [c.name, c.url, c.gap]));
      const outline = sheet("Content Outline", [["Section", 10], ["Heading", 40], ["Key points to cover", 108], ["Product detail", 18], ["Target words", 16]]);
      (data.outline || []).forEach((r, i) => append(outline, [i + 1, r.heading, r.coverage, r.product, r.words]));
      const ev = sheet("Evidence & Sources", [["Section", 11], ["Section heading", 41], ["Evidence / example", 87], ["Source / reference", 105]]);
      (data.outline || []).forEach((r, i) => briefEvidence(r).forEach((e) => append(ev, [i + 1, r.heading, e.evidence, e.source])));
      const links = sheet("Internal & External Links", [["Type", 17], ["Suggested anchor", 40], ["URL", 57], ["Placement", 40], ["Why it belongs", 90]]);
      (data.links || []).forEach((l) => append(links, [l.kind, l.anchor, l.url, l.placement, l.purpose]));
      const qaSheet = sheet("Checks & Feedback", [["Category", 23], ["Check or feedback", 98], ["Status or action", 62]]);
      CHECKS.forEach((c, i) => append(qaSheet, ["Draft quality check", c, checks.includes(i) ? "Checked" : "Not checked"]));
      qa.gaps.forEach((gap) => append(qaSheet, ["Handoff issue", gap, "Needs attention"]));
      (data.feedback || []).forEach((f) => append(qaSheet, [f.category || "Feedback", f.issue, `Fix: ${f.fix || "—"}; guide updated: ${f.guide || "No"}`]));

      const bytes = await workbook.xlsx.writeBuffer();
      const blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${briefFileStem(data.company)}-content-brief.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setToast("Editable Excel content brief downloaded.");
    } catch (error) {
      console.error("Excel export failed", error);
      setToast("Excel export failed. Make sure exceljs is installed (npm install exceljs).");
    }
  };


  const hasText = (x) => filled(x);

 
  const stepReady = [
    hasText(data.title) && hasText(data.purpose),
    hasText(data.reader) && hasText(data.decision),
    hasText(data.argument) && hasText(data.primaryKeyword),
    data.outline.some(
      (x) => hasText(x.heading) && hasText(x.coverage)
    ),
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
              "Set Clear Expectations for Your Content",
              "Define Your Target Buyer and Goals",
              "Define Your Content Angle and Search Intent",
              "Define Your Content Structure and Requirements",
              "Editorial Standards and Link Guidelines",
              "Review and Share Your Completed Brief",
            ][step]}
          </h2>
          <p className="cbt-intro">{STEPS[step].desc}</p>

          {step === 0 && (
            <>

            <Section title="">

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
                
                  FIELD("Purpose of the content", "purpose", {
  long: true,
  wide: true,
  hint:
    "Explain which buyer decision this content should support.",
}),

                  FIELD("Target word count", "words", { type: "number" }),
                FIELD("Reason for word count", "wordReason", {
  long: true,
}),
                ])}
              </Section>
            
          <Section
  title="Ownership and Delivery Dates"
  desc="Define who writes, reviews and approves the content, with deadlines for each stage."
>
                
{group([
  FIELD("Content brief owner", "briefOwner"),
  FIELD("Assigned writer or agency", "writer"),
  FIELD("Subject matter expert and availability", "expert", {
    wide: true,
  }),
  FIELD("Date commissioned", "requested", {
    type: "date",
  }),
  FIELD("Outline deadline", "outlineDue", {
    type: "date",
  }),
  FIELD("First draft deadline", "draftDue", {
    type: "date",
  }),
  FIELD("Target publication date", "publishDue", {
    type: "date",
  }),
  FIELD("Outline approval owner", "outlineApprover"),
])}
</Section>


            </>
          )}

       
{step === 1 && (
  <>
   <Section title="">


      {group([
        FIELD("Primary business objective", "businessGoal", {
          long: true,
          wide: true,
        }),
        FIELD("Buyer funnel stage", "funnel", {
          options: ["Awareness", "Consideration", "Decision"],
        }),
        FIELD("Target conversion action", "conversion"),
        FIELD("Early performance indicators", "leading", {
          long: true,
        }),
        FIELD("Pipeline and revenue metrics", "lagging", {
          long: true,
        }),
        FIELD(
          "Measurement responsibilities and reporting",
          "measurement",
          { long: true, wide: true }
        ),
        FIELD(
          "Related pages and content overlap",
          "supports",
          { long: true, wide: true }
        ),
      ])}
    </Section>

    <Section
      title="Target Buyer and Decision Context"
      desc="Describe your target buyer, the problem they're trying to solve and the information they need to make a decision."
    >
      {group([
        FIELD("Target buyer profile", "reader", {
          wide: true,
        }),
        FIELD("Current buying stage", "buying", {
          options: [
            "Researching",
            "Shortlisting",
            "Comparing",
            "Justifying internally",
          ],
        }),
        FIELD("Primary buyer problem", "readerProblem", {
          long: true,
          wide: true,
        }),
        FIELD("Existing buyer knowledge", "knows", {
          long: true,
        }),
        FIELD("Information gaps", "knowledgeGap", {
          long: true,
        }),
        FIELD("Buying decision", "decision", {
          long: true,
          wide: true,
        }),
        FIELD(
          "Additional decision-makers",
          "stakeholders"
        ),
        FIELD("Buyer concerns and objections", "objections", {
          long: true,
        }),
        FIELD(
          "Source of buyer research",
          "audienceEvidence",
          { long: true, wide: true }
        ),
      ])}
    </Section>
  </>
)}


{step === 2 && (
  <>
    <Section title="">
      {group([
        FIELD("Central argument", "argument", {
          long: true,
          wide: true,
        }),
        FIELD("Expected reader takeaway", "takeaway", {
          long: true,
        }),
        FIELD("Recommended next action", "nextStep", {
          long: true,
        }),
        FIELD("Claims or arguments to avoid", "notArguing", {
          long: true,
          wide: true,
        }),
      FIELD("Why this angle?", "whyAngle", {
  long: true,
  wide: true,
}),
      ])}
    </Section>

    <Section
      title="Search Intent and Competitive Research"
      desc="Review what buyers are searching for, which pages currently rank and where your content can provide something more useful."
    >
      {group([
        FIELD("Primary search query", "primaryKeyword"),
        FIELD("Search intent", "searchIntent", {
          options: [
            "Informational",
            "Commercial investigation",
            "Transactional",
            "Navigational",
            "Not search-led",
          ],
        }),
        FIELD("Related queries and subtopics", "secondary", {
          long: true,
          wide: true,
        }),

      ])}
    </Section>

    <CompetitorResearch
      data={data}
      setData={setData}
    />


<Section title="Questions the Content Must Answer">
  <div className="cbt-fields">
    <div className="cbt-field wide">
      <textarea
        className="cbt-area"
        aria-label="Questions the content must answer"
        value={data.questions ?? ""}
        onChange={(e) => set("questions", e.target.value)}
        placeholder="List the questions your writer needs to answer."
        rows={5}
      />
      <p className="cbt-hint">Enter one question per line.</p>
    </div>
  </div>
</Section>



    <div className="cbt-tip">
      <b>Before approving the outline:</b> Check that each
      section supports the central argument and addresses a
      question relevant to the buyer's decision.
    </div>
  </>
)}




{step === 3 && (
  <>
    <Repeater
      title=""
      kind="outline"
      data={data}
      setData={setData}
      button="section"
    />

    <div className="cbt-tip">
      Outline word count:{" "}
      <b>{qa.outlineWords.toLocaleString()}</b>
      {Number(data.words) > 0
        ? ` of ${Number(data.words).toLocaleString()} words planned`
        : " words planned"}
      . Check that every section has enough room to cover its key points.
    </div>


  </>
)}

       
       {step === 4 && (
  <>
<Section title="">
      {group([
        FIELD("Tone and reader expectations", "tone", {
          long: true,
          wide: true,
        }),
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
        FIELD("Leave alone if accurate and clear", "leaveAlone", {
          long: true,
          wide: true,
        }),
      ])}
    </Section>

    <Repeater
      title="Internal & External Links"
      help="Give anchor text, destination, placement and why the link helps the reader."
      kind="links"
      data={data}
      setData={setData}
      button="link"
    />

    <Section title="Link Exclusions">
      {group([
        FIELD("Do not link to or mention", "avoidLinks", {
          long: true,
          wide: true,
        }),
      ])}
    </Section>
  </>
)}

{step === 5 && (
  <>
    <div className="cbt-review-grid">
      <div className="cbt-review-kpi">
        <strong>{qa.pct}%</strong>
        <span>Brief completeness</span>
      </div>

      <div className="cbt-review-kpi">
        <strong>{qa.gaps.length}</strong>
        <span>Items needing attention</span>
      </div>

      <div className="cbt-review-kpi">
        <strong>{data.outline.length}</strong>
        <span>Outline sections</span>
      </div>

      <div className="cbt-review-kpi">
        <strong>
          {data.outline.reduce(
            (total, section) =>
              total +
              (
                section.evidenceItems ??
                (section.proof
                  ? [
                      {
                        evidence: section.proof,
                        source: "",
                      },
                    ]
                  : [])
              ).filter(
                (item) =>
                  filled(item.evidence) &&
                  filled(item.source)
              ).length,
            0
          )}
        </strong>
        <span>Evidence and sources</span>
      </div>
    </div>

    <Section
      title="Final Brief Checks"
      desc="Review any missing information before sharing the brief with your writer or agency."
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
          ✓ Your brief has no outstanding checks.
          Review the details before sharing.
        </div>
      )}
    </Section>

    <Section
      title="Writer's Pre-Submission Checklist"
      desc="Use this checklist to review the completed draft before submitting it for approval."
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
      title="Feedback for Future Content"
      help="Record recurring issues or corrections that should be addressed in future briefs."
      kind="feedback"
      data={data}
      setData={setData}
      button="feedback"
    />

    <Section
      title="Export Your Content Brief"
      desc="Download or copy your completed brief, including the outline, supporting evidence, sources and writing guidelines."
    >
      <div className="cbt-exportbar">
        <button
          type="button"
          className="cbt-btn primary"
          onClick={copy}
        >
          Copy brief
        </button>

<button
  type="button"
  className="cbt-btn dark"
  onClick={downloadExcel}
>
  Download Excel
</button>

        <button
          type="button"
          className="cbt-btn"
          onClick={() => window.print()}
        >
          Save as PDF
        </button>
      </div>

      {toast && (
        <div className="cbt-toast" role="status">
          {toast}
        </div>
      )}

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




<BriefPreview
  data={data}
  qa={qa}
  onReview={() => setStep(5)}
/>
      </div>
<PrintableBrief data={data} qa={qa} />


    </div>
  );
}