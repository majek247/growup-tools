"use client";

import React, { useEffect, useMemo, useState } from "react";

/**
 * GrowUp SME Interview Kit
 * Standalone Next.js client component. Uses browser localStorage for drafts.
 * Excel export uses `exceljs` (npm install exceljs).
 * Does not record interviews, validate claims, or send information to a server.
 * Sample company, people, and evidence are fictional.
 */

const BRAND = {
  dark: "#073b3b",
  ink: "#011522",
  teal: "#167273",
  pale: "#eef4f3",
  muted: "#57716e",
};

const STORAGE_KEY = "growup-sme-interview-kit-v2";

const STEPS = ["Prepare", "Interview questions", "Review & export"];

const ROLES = [
  "Product",
  "Sales",
  "Customer success",
  "Engineering",
  "Founder / leadership",
  "Customer",
  "Other",
];

const FORMATS = [
  "Comparison page",
  "How-to guide",
  "Case study",
  "Product / integration page",
  "Thought leadership",
  "Blog article",
  "Video script",
  "Other",
];

const DURATIONS = [15, 20, 30, 45, 60];

const COMMON = [
  {
    category: "Experience",
    label: "Recent example",
    question:
      "Walk me through the most recent time you dealt with this problem. What happened from start to finish?",
    probe:
      "Who was involved, what triggered the work and what happened next?",
  },
  {
    category: "Process",
    label: "Actual workflow",
    question:
      "Which steps matter most in practice, and where does the process usually slow down?",
    probe:
      "Ask for the exact sequence, responsible team and any exceptions.",
  },
  {
    category: "Point of view",
    label: "What standard advice misses",
    question:
      "What common advice about this topic do you disagree with, and what have you seen instead?",
    probe: "Request a specific example, not a general opinion.",
  },
  {
    category: "Buyer insight",
    label: "Where readers get stuck",
    question:
      "What do prospects or customers most often misunderstand when evaluating this approach?",
    probe:
      "Capture their actual language from a recent conversation.",
  },
  {
    category: "Proof",
    label: "Evidence and measures",
    question:
      "What would you measure to know this approach is working, and what evidence can we use?",
    probe:
      "Confirm the baseline, timeframe, original source and owner.",
  },
  {
    category: "Experience",
    label: "Unexpected result",
    question:
      "What surprised you in a recent project or customer situation involving this problem?",
    probe: "Ask what changed and what the team learned.",
  },
  {
    category: "Clarity",
    label: "Explain the terminology",
    question:
      "How would you explain the most confusing part of this topic to a knowledgeable buyer without specialist jargon?",
    probe:
      "Ask for a short explanation grounded in a real workflow.",
  },
  {
    category: "Wrap-up",
    label: "What we missed",
    question:
      "What important question have I not asked, and what should we verify before publishing?",
    probe: "Assign an owner and date for each open item.",
  },
];

const ROLE_QUESTIONS = {
  Product: [
    {
      category: "Product",
      label: "Capability in practice",
      question:
        "Show me how a customer completes this task today. Which steps can we describe accurately?",
      probe: "Ask for the latest documentation or a live demo.",
    },
    {
      category: "Product",
      label: "Limitations",
      question:
        "Which capabilities depend on a plan, configuration, integration or permission?",
      probe: "Record the exact restriction and product owner.",
    },
  ],
  Sales: [
    {
      category: "Sales",
      label: "Buyer objections",
      question:
        "What objection keeps coming up in real deals, and what evidence changes the conversation?",
      probe:
        "Ask for a recent anonymised discovery-call example.",
    },
    {
      category: "Sales",
      label: "Buying criteria",
      question:
        "Which two or three criteria most often determine whether a buyer progresses to a demo or shortlist?",
      probe:
        "Distinguish actual buyer statements from interpretation.",
    },
  ],
  "Customer success": [
    {
      category: "Customer success",
      label: "Where adoption fails",
      question:
        "Where do customers get stuck after they start, and which intervention usually makes a difference?",
      probe: "Capture a support or onboarding example.",
    },
    {
      category: "Customer success",
      label: "Measured outcomes",
      question:
        "What changed for a customer, and how was that improvement measured?",
      probe:
        "Verify the before-and-after figures and publication permission.",
    },
  ],
  Engineering: [
    {
      category: "Engineering",
      label: "Technical workflow",
      question:
        "What happens behind the scenes when this workflow runs, including dependencies and failure cases?",
      probe: "Request current technical documentation.",
    },
    {
      category: "Engineering",
      label: "Implementation effort",
      question:
        "What does implementation genuinely require from a customer's technical team?",
      probe:
        "Separate typical effort from commitments that cannot be guaranteed.",
    },
  ],
  "Founder / leadership": [
    {
      category: "Leadership",
      label: "Market point of view",
      question:
        "What assumption about this market has changed based on your experience?",
      probe:
        "Request a concrete customer, product or market example.",
    },
    {
      category: "Leadership",
      label: "Trade-offs",
      question:
        "When is the commonly recommended approach actually the wrong choice?",
      probe:
        "Establish the conditions under which your advice would change.",
    },
  ],
  Customer: [
    {
      category: "Customer",
      label: "Before the change",
      question:
        "What was the problem like before you started looking for a different approach?",
      probe: "Capture the original process and constraints.",
    },
    {
      category: "Customer",
      label: "Decision and result",
      question:
        "What alternatives did you consider, what did you choose and what changed?",
      probe:
        "Verify outcomes and request permission before quoting.",
    },
  ],
  Other: [
    {
      category: "Experience",
      label: "What worked",
      question:
        "Which approach has been most effective in your experience, and in what circumstances?",
      probe: "Ask for a repeatable process and a recent example.",
    },
    {
      category: "Limitations",
      label: "Exceptions",
      question:
        "When does that approach stop working, and what would you do instead?",
      probe: "Document the assumptions and trade-offs.",
    },
  ],
};

const FORMAT_QUESTIONS = {
  "Comparison page": [
    {
      category: "Comparison",
      label: "Decision criteria",
      question:
        "What should determine which option a buyer chooses, and when is each option a poor fit?",
      probe:
        "Build a side-by-side comparison using real requirements.",
    },
    {
      category: "Comparison",
      label: "Meaningful differences",
      question:
        "Which product or workflow differences actually change the buying decision?",
      probe:
        "Ask for examples and current supporting documentation.",
    },
  ],
  "How-to guide": [
    {
      category: "How-to",
      label: "Sequence",
      question:
        "What steps should readers follow, in what order, and which steps do people commonly skip?",
      probe:
        "Collect the prerequisites and consequences of skipping a step.",
    },
    {
      category: "How-to",
      label: "Failure and recovery",
      question:
        "What usually goes wrong, and what should the reader check before escalating?",
      probe: "Ask for a tested fallback, not a guessed workaround.",
    },
  ],
  "Case study": [
    {
      category: "Case study",
      label: "Starting situation",
      question:
        "What was the customer's baseline, team setup and business problem before the project?",
      probe: "Request an approved timeline and baseline measurement.",
    },
    {
      category: "Case study",
      label: "Intervention and impact",
      question:
        "What changed, who was responsible and which outcomes can we substantiate?",
      probe:
        "Check attribution, timeframe and naming permissions.",
    },
  ],
  "Product / integration page": [
    {
      category: "Product page",
      label: "Actual use case",
      question:
        "Which customer workflow does this feature or integration support, and for whom?",
      probe:
        "Ask for real product steps, supported systems and setup requirements.",
    },
    {
      category: "Product page",
      label: "Boundaries",
      question:
        "What does the product or integration not do, and what prerequisites are easy to miss?",
      probe:
        "Verify plan, market and permission restrictions.",
    },
  ],
  "Thought leadership": [
    {
      category: "Point of view",
      label: "Clear thesis",
      question:
        "What is your specific view on this issue that a knowledgeable peer could reasonably challenge?",
      probe:
        "Ask for the evidence or firsthand experience behind the position.",
    },
    {
      category: "Point of view",
      label: "Counterargument",
      question:
        "Where might someone with a different view have a valid point?",
      probe:
        "Capture nuance rather than forcing a provocative claim.",
    },
  ],
  "Blog article": [
    {
      category: "Article",
      label: "Reader question",
      question:
        "What is the main question buyers need answered before taking the next step?",
      probe:
        "Ask for common misconceptions and a recent example.",
    },
    {
      category: "Article",
      label: "Practical application",
      question:
        "What should the reader do differently after reading this article?",
      probe:
        "Identify a specific checklist, decision rule or process.",
    },
  ],
  "Video script": [
    {
      category: "Video",
      label: "What to demonstrate",
      question:
        "Which part of this subject is easiest to explain by showing it rather than describing it?",
      probe:
        "Request a suitable demo, visual or approved example.",
    },
    {
      category: "Video",
      label: "One takeaway",
      question:
        "What is the one point the viewer must remember after watching?",
      probe:
        "Capture a concise explanation in the expert's own words.",
    },
  ],
  Other: [
    {
      category: "Content",
      label: "Main outcome",
      question:
        "What should the audience understand or decide after consuming this content?",
      probe: "Clarify one practical outcome.",
    },
    {
      category: "Content",
      label: "Missing details",
      question:
        "What details are normally missing from public explanations of this topic?",
      probe: "Capture verifiable examples.",
    },
  ],
};

const uid = () => Math.random().toString(36).slice(2, 10);
const clean = (v) => String(v ?? "").trim();

const clone = (v) => JSON.parse(JSON.stringify(v));

const mkQuestion = (q) => ({
  ...q,
  id: uid(),
  include: true,
  minutes: 0,
  manualMinutes: false,
});

function buildQuestions(role, format) {
  const suggested = [
    COMMON[0],
    ...(ROLE_QUESTIONS[role] || ROLE_QUESTIONS.Other),
    ...(FORMAT_QUESTIONS[format] || FORMAT_QUESTIONS.Other),
    COMMON[4],
  ];
  return suggested.map(mkQuestion);
}

function agendaFor(questions, minutes) {
  const active = questions.filter(
    (q) => q.include && clean(q.question)
  );

  const fixed = active.reduce(
    (s, q) =>
      s +
      (q.manualMinutes ? Math.max(0, Number(q.minutes) || 0) : 0),
    0
  );

  const flexible = active.filter((q) => !q.manualMinutes);

  let remainder = Math.max(0, minutes - fixed);

  const each = flexible.length
    ? Math.floor(remainder / flexible.length)
    : 0;

  let extra = flexible.length
    ? remainder - each * flexible.length
    : 0;

  let clock = 0;

  return active.map((q) => {
    const allocated = q.manualMinutes
      ? Math.max(0, Number(q.minutes) || 0)
      : each + (extra-- > 0 ? 1 : 0);

    const result = {
      ...q,
      start: clock,
      end: clock + allocated,
      allocated,
    };

    clock += allocated;
    return result;
  });
}

const clockFmt = (m) => `${String(m).padStart(2, "0")}:00`;

const BLANK = {
  company: "",
  title: "",
  format: "Comparison page",
  role: "Sales",
  expertName: "",
  expertTitle: "",
  interviewer: "",
  interviewDate: "",
  duration: 30,
  audience: "",
  buyerDecision: "",
  objective: "",
  commercialGoal: "",
  scopeIn: "",
  scopeOut: "",
  known: "",
  unknown: "",
  priorMaterials: "",
  preRead: "",
  proofRequested: "",
  consent: "Not confirmed",
  quotePolicy: "Permission required",
  prep: {},
  questions: [],
  notes: {},
  evidence: [],
  highlights: [],
  openActions: [],
  approvals: {
    editorial: "Pending",
    claims: "Pending",
    quotes: "Pending",
  },
  summary: "",
  playbook: { opening: "" },
  draftUse: "",
  repurpose: "",
  reviewer: "",
  reviewDue: "",
  transcriptNote: "",
};



function initialData() {
  return {
    ...clone(BLANK),
    questions: buildQuestions("Sales", "Comparison page"),
  };
}



function exampleData() {
  return {
    ...initialData(),

    questions: [
      mkQuestion({
        category: "Buyer context",
        label: "Start with a recent prospect",
        question:
          "Can you think of a recent prospect who was still managing usage-based billing in spreadsheets? What was going wrong?",
        probe:
          "What had happened that made them start looking for software instead of fixing their existing process?",
      }),

      mkQuestion({
        category: "Buyer problems",
        label: "Understand the actual pain points",
        question:
          "When you speak to finance teams still managing billing manually, which parts of their process are causing the most trouble?",
        probe:
          "What do they say makes the process difficult, and how does it affect their day-to-day work?",
      }),

      mkQuestion({
        category: "Alternatives",
        label: "Find out what buyers compare",
        question:
          "Before prospects approach RelayLedger, what have they typically tried to fix their billing problems, and why are they still looking?",
        probe:
          "When they explain why they're looking for something new, what specific requirements or frustrations tend to come up in those conversations?",
      }),

      mkQuestion({
        category: "Buying triggers",
        label: "Identify what moves a deal forward",
        question:
          "What tends to convince a finance leader that their spreadsheet setup isn't worth maintaining anymore?",
        probe:
          "Think about a recent deal. Was there a particular problem, product demonstration or conversation that changed their mind?",
      }),

      mkQuestion({
        category: "Evaluation criteria",
        label: "Understand what buyers actually care about",
        question:
          "Which RelayLedger features do prospects spend the most time asking about during demos?",
        probe:
          "What are they trying to solve with those features? Are there questions about limitations or integrations that keep coming up?",
      }),

      mkQuestion({
        category: "Evidence and examples",
        label: "Get evidence the writer can use",
        question:
          "Do we have a recent deal that shows the problems a buyer had, what they compared and why they chose their next step?",
        probe:
          "Could you share anonymised call notes or a specific example we can check with Product Marketing before using it in the article?",
      }),
    ],

    company: "RelayLedger",
    title:
      "Usage-based billing software vs spreadsheets: what finance leaders should compare",
    format: "Comparison page",
    role: "Sales",
    expertName: "Jamie Ellis",
    expertTitle: "Account Executive",
    interviewer: "Content Manager",
    duration: 30,
    audience:
      "Finance Directors and Heads of RevOps at B2B SaaS companies with 50–300 employees",
    buyerDecision:
      "Determine when manual billing controls warrant dedicated software and which features to evaluate.",
    objective:
      "Collect first-hand buyer objections, decision criteria and an accurate example of month-end adjustment approvals.",
    commercialGoal:
      "Increase organic-sourced demo requests from 25 to 40 per month (+60%) by the end of Q2 2027, with at least 30% qualifying as SQLs.",


    playbook: {
      opening: "We're preparing a comparison page for finance leaders evaluating whether to keep managing usage-based billing in spreadsheets or move to dedicated software. I'd like to understand what you're hearing from prospects, what they've tried and which problems eventually lead them to evaluate other options. Recent deal examples would be especially useful. We'll check any product claims and customer details before publication.",
    },

    known:
  "Finance teams struggle with late usage data, manual invoice adjustments and unclear approvals. We know RelayLedger tracks changes, but not which problems drive evaluations.",

unknown:
  "Which billing problems finally push finance leaders beyond spreadsheets? We need a recent prospect example, their alternatives and the deciding factor behind their shortlist.",

scopeIn:
  "Focus on month-end bottlenecks, approval ownership, spreadsheet workarounds and what buyers compare during actual evaluations. Prioritise specific sales conversations over general product claims.",

scopeOut:
  "Exclude implementation walkthroughs, integration architecture and unsupported ROI claims.",

priorMaterials:
  "Review three recent discovery-call summaries, the current product demo, RelayLedger's feature matrix and existing billing pages.",

proofRequested:
  "Request an anonymised deal example, the buyer's actual objections, shortlist criteria and relevant call notes.",


    preRead:
      "A 30-minute discussion on buyer concerns, common objections and real approval workflows. Bring one recent anonymised example.",
    consent: "No recording planned",
    reviewer: "Product Marketing and Sales Lead",
    quotePolicy: "Permission required",
    evidence: [
      {
        id: uid(),
        insight:
          "Finance teams need a clear approval history for invoice adjustments",
        source: "Sales discovery notes: link pending",
        owner: "Sales Lead",
        status: "Needs source",
        permission: "Pending",
      },
    ],
  };
}

const valueOrDash = (s) => clean(s) || "Not provided";

function buildText(d, agenda) {
  const lines = [
    `# SME Interview Preparation Pack: ${valueOrDash(d.title)}`,
    `Company: ${valueOrDash(d.company)}`,
    `Expert: ${valueOrDash(d.expertName)} · ${valueOrDash(d.expertTitle)} (${d.role})`,
    `Interviewer: ${valueOrDash(d.interviewer)}`,
    `Content format: ${d.format}`,
    `Interview date: ${valueOrDash(d.interviewDate)}`,
    `Interview length: ${d.duration} minutes`, "",
    "## 1. Interview preparation",
    `Target reader: ${valueOrDash(d.audience)}`,
    `Reader decision: ${valueOrDash(d.buyerDecision)}`,
    `Interview objective: ${valueOrDash(d.objective)}`,
    `Commercial goal: ${valueOrDash(d.commercialGoal)}`,
    `What we already know: ${valueOrDash(d.known)}`,
    `Information gaps: ${valueOrDash(d.unknown)}`,
    `In scope: ${valueOrDash(d.scopeIn)}`,
    `Out of scope: ${valueOrDash(d.scopeOut)}`,
    `Materials to review: ${valueOrDash(d.priorMaterials)}`,
    `Documents, examples or figures to request: ${valueOrDash(d.proofRequested)}`, "",
    "## 2. Interview questions and timing",
    ...agenda.flatMap((q, i) => [
      `${i + 1}. ${q.question} (${clockFmt(q.start)}–${clockFmt(q.end)})`,
      `Follow-up: ${valueOrDash(q.probe)}`, "",
    ]),
    "Optional opening script:",
    valueOrDash(d.playbook?.opening), "",
    "## 3. Blank interview notes worksheet (complete during or after the call)",
    ...agenda.flatMap((q, i) => [
      `${i + 1}. ${q.question}`,
      "Key insight / example: ______________________________",
      "Exact quote / timestamp: _____________________",
      "Source / follow-up owner: _______________________", "",
    ]),
    "Only record or share interview materials with appropriate consent. Verify claims and publication permissions before use.",
  ];
  return lines.join("\n");
}
function safeFilename(s) {
  return (
    clean(s)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 65) || "sme-interview"
  );
}

function saveBlob(bytes, filename, type) {
  const blob = new Blob([bytes], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const InfoTooltip = ({ text }) => (
  <span
    className="sme-info-tooltip"
    tabIndex={0}
    role="note"
    aria-label={text}
    data-tooltip={text}
  >
    ⓘ
  </span>
);

const Field = ({
  label,
  value,
  onChange,
  placeholder = "",
  multiline = false,
  help = "",
  tooltip = "",
  type = "text",
  rows = 3,
}) => (
  <label className="sme-field">
    <span className="sme-field-label">
      {label}
      {tooltip && <InfoTooltip text={tooltip} />}
    </span>
    {multiline ? (
      <textarea
        rows={rows}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    ) : (
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    )}
    {help && <small>{help}</small>}
  </label>
);

const Select = ({
  label,
  value,
  onChange,
  options,
  help = "",
}) => (
  <label className="sme-field">
    <span>{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((x) => (
        <option key={x} value={x}>
          {x}
        </option>
      ))}
    </select>
    {help && <small>{help}</small>}
  </label>
);

const Section = ({ title, detail, children, kicker }) => (
  <section className="sme-section">
    {kicker && <div className="sme-kicker">{kicker}</div>}
    <h3>{title}</h3>
    {detail && <p className="sme-section-desc">{detail}</p>}
    {children}
  </section>
);

const Arrow = () => <span aria-hidden="true">→</span>;




export const faqs = [
  {
    question: "What is an SME interview, and why is it important for B2B SaaS content?",
    answer:
      "An SME interview is a conversation with a subject-matter expert to gather information that isn't available in existing research. For B2B SaaS content, it helps writers understand product workflows, customer problems, buyer objections and real examples, so they can produce accurate articles that answer prospective customers' questions.",
  },
  {
    question: "How do I prepare for a subject-matter expert interview?",
    answer:
      "To prepare for a subject-matter expert interview, define the content objective, target audience and information you need from the expert. Review existing product documentation and research, identify unanswered questions and prepare a focused interview agenda. Share the discussion topics beforehand so the expert knows what to expect.",
  },
  {
    question: "How long should an SME interview last?",
    answer:
      "An SME interview should typically last 30 minutes, which is enough to cover five or six focused questions with follow-ups. More complex topics, such as technical workflows or customer case studies, may require 45–60 minutes. Allocate time to each question and prioritise information missing from your existing research.",
  },
  {
    question: "What questions should I ask a subject-matter expert for a B2B SaaS article?",
    answer:
      "Ask questions about the buyer's problem, how the product works, common objections and what influences purchasing decisions. Request specific examples from recent customer or sales conversations. For comparison articles, ask what buyers evaluate between solutions. For product guides, focus on workflows, technical requirements and limitations.",
  },
  {
    question: "How can I keep an SME interview focused when the expert goes off-topic?",
    answer:
      "To keep an SME interview focused, prepare a timed agenda with the most important questions first. If the expert goes off-topic, acknowledge their point and bring the discussion back to an unanswered question. Record useful tangents for follow-up and avoid spending too much time on topics already covered.",
  },
  {
    question: "What should I do when an SME cannot provide evidence for a claim?",
    answer:
      "If an SME cannot provide evidence for a claim, ask where the information came from and whether supporting documentation exists. Record the claim as unverified and assign someone to check it. If reliable evidence cannot be found, remove the claim or rewrite it without making unsupported assertions.",
  },
];





export default function SmeInterviewKit() {
  const [d, setD] = useState(initialData);
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState("prepare");
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      if (raw) {
        const obj = JSON.parse(raw);

        if (
          obj &&
          obj.data &&
          typeof obj.data === "object" &&
          Array.isArray(obj.data.questions)
        ) {
          setD({
            ...initialData(),
            ...obj.data,
            playbook: { ...BLANK.playbook, ...obj.data.playbook },
            prep: { ...obj.data.prep },
            notes: { ...obj.data.notes },
            approvals: {
              ...BLANK.approvals,
              ...obj.data.approvals,
            },
          });

          setStep(Math.max(0, Math.min(2, Number(obj.step) || 0)));
        }
      }
    } catch (error) {
      console.error("Unable to restore SME interview draft", error);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          data: d,
          step,
          savedAt: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error("Unable to save SME interview draft", error);
    }
  }, [d, step, loaded]);

  const set = (key, value) =>
    setD((old) => ({ ...old, [key]: value }));

  const setQuestion = (id, key, value) =>
    setD((old) => ({
      ...old,
      questions: old.questions.map((q) =>
        q.id === id ? { ...q, [key]: value } : q
      ),
    }));

  const setNote = (id, key, value) =>
    setD((old) => ({
      ...old,
      notes: {
        ...old.notes,
        [id]: { ...old.notes[id], [key]: value },
      },
    }));

  const setRecord = (collection, id, key, value) =>
    setD((old) => ({
      ...old,
      [collection]: old[collection].map((r) =>
        r.id === id ? { ...r, [key]: value } : r
      ),
    }));

  const dropRecord = (collection, id) =>
    setD((old) => ({
      ...old,
      [collection]: old[collection].filter((r) => r.id !== id),
    }));

  const agenda = useMemo(
    () => agendaFor(d.questions, d.duration),
    [d.questions, d.duration]
  );

  const allocated = agenda.reduce(
    (total, q) => total + q.allocated,
    0
  );

  const filled = agenda.filter(
    (q) => clean(d.notes[q.id]?.answer)
  ).length;

  const outstanding = d.evidence.filter(
    (e) =>
      clean(e.insight) &&
      (e.status !== "Verified" || e.permission !== "Approved")
  ).length;

  const report = useMemo(
    () => buildText(d, agenda),
    [d, agenda]
  );

  const filename = safeFilename(d.company || d.title);
  const canExport = !exporting;

  const reset = (example) => {
    if (
      !window.confirm(
        example
          ? "Replace this interview kit with the fictional example? Your current draft will be overwritten."
          : "Start a new interview kit? Your current saved draft will be replaced."
      )
    )
      return;

    setD(example ? exampleData() : initialData());
    setStep(0);
    setPreview("prepare");
    setNotice(
      example
        ? "Example loaded. Its evidence and permissions still need verification."
        : "New interview kit started."
    );
  };

  const changeRoleFormat = (key, value) => {
    const changed = { ...d, [key]: value };

    if (
      d.questions.some((q) => clean(d.notes[q.id]?.answer))
    ) {
      if (
        !window.confirm(
          "Rebuild questions for this selection? Existing question-specific notes will be cleared."
        )
      )
        return;
    }

    setD((old) => ({
      ...old,
      [key]: value,
      questions: buildQuestions(changed.role, changed.format),
      notes: {},
    }));
  };

  const rebuild = () => {
    if (
      !window.confirm(
        "Rebuild the question set? Manually edited questions and their notes will be replaced."
      )
    )
      return;

    setD((old) => ({
      ...old,
      questions: buildQuestions(old.role, old.format),
      notes: {},
    }));
  };

  const moveQuestion = (id, direction) =>
    setD((old) => {
      const next = [...old.questions];
      const i = next.findIndex((q) => q.id === id);
      const j = i + direction;

      if (i < 0 || j < 0 || j >= next.length) return old;

      [next[i], next[j]] = [next[j], next[i]];

      return { ...old, questions: next };
    });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setNotice("Interview handoff copied.");
    } catch {
      setNotice(
        "Clipboard is unavailable. Use Excel or PDF export instead."
      );
    }
  };

  const downloadExcel = async () => {
    setExporting(true);

    try {
      const ExcelJS = (await import("exceljs")).default;
      const wb = new ExcelJS.Workbook();
      wb.creator = "GrowUp";
      wb.title = "SME interview kit";

      const navy = "073B3B";
      const teal = "167273";
      const pale = "EEF4F3";

      function sheet(name, heads, rows) {
        const ws = wb.addWorksheet(name);
        ws.addRow(heads);

        ws.columns = heads.map((h) => ({
          header: h,
          key: h,
          width: Math.max(20, Math.min(56, h.length + 16)),
        }));

        const header = ws.getRow(1);
        header.height = 31;

        header.eachCell((c) => {
          c.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: `FF${navy}` },
          };
          c.font = {
            name: "Montserrat",
            bold: true,
            color: { argb: "FFFFFFFF" },
            size: 11,
          };
          c.alignment = {
            vertical: "middle",
            wrapText: true,
          };
        });

        rows.forEach((values, i) => {
          const r = ws.addRow(
            values.map((x) => (x == null ? "" : x))
          );

          r.height = 56;

          r.eachCell(
            { includeEmpty: true },
            (c) => {
              c.font = {
                name: "Montserrat",
                size: 10,
                color: { argb: "FF173431" },
              };
              c.alignment = {
                vertical: "top",
                wrapText: true,
              };

              if (i % 2 === 0) {
                c.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: `FF${pale}` },
                };
              }
            }
          );
        });

        ws.views = [{ state: "frozen", ySplit: 1 }];
        ws.autoFilter = {
          from: "A1",
          to: `${String.fromCharCode(64 + heads.length)}1`,
        };

        return ws;
      }

      sheet("START HERE", ["Item", "Details"], [
        ["Company", d.company],
        ["Article", d.title],
        ["Expert", `${d.expertName} · ${d.expertTitle}`],
        ["Format", d.format],
        [
          "Purpose",
          "Editable interview preparation and question pack. Complete the notes sheet during or after the interview.",
        ],
        [
          "Important",
          "Excel changes do not sync back to the browser. The kit does not verify evidence or grant publication permission.",
        ],
      ]);

      sheet(
        "Interview preparation",
        ["Field", "Response"],
        [
          ["Target reader", d.audience],
          ["Reader decision", d.buyerDecision],
          ["Interview objective", d.objective],
          ["Commercial goal", d.commercialGoal],
          ["In scope", d.scopeIn],
          ["Out of scope", d.scopeOut],
          ["What is known", d.known],
          ["What remains unknown", d.unknown],
          ["Existing material", d.priorMaterials],
          ["Requested evidence", d.proofRequested],
          ["Interviewer", d.interviewer],
          ["Interview date", d.interviewDate],
          ["Length (minutes)", d.duration],
        ]
      );

      sheet(
        "Interview questions",
        [
          "Order",
          "Category",
          "Question",
          "Follow-up",
          "Start",
          "End",
          "Minutes",
        ],
        agenda.map((q, i) => [
          i + 1,
          q.category,
          q.question,
          q.probe,
          clockFmt(q.start),
          clockFmt(q.end),
          q.allocated,
        ])
      );

      sheet(
        "Blank interview notes",
        [
          "Question",
          "Key insight or example",
          "Exact quote / timestamp",
          "Source",
          "Follow-up / owner",
        ],
        agenda.map((q) => [q.question, "", "", "", ""])
      );

      sheet("Opening script", ["Field", "Text"], [
        ["Optional opening script", d.playbook?.opening || ""],
      ]);

      const buffer = await wb.xlsx.writeBuffer();

      saveBlob(
        buffer,
        `${filename}-sme-interview-kit.xlsx`,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      setNotice("Editable Excel workbook downloaded.");
    } catch (error) {
      console.error(error);
      setNotice(
        "Excel export failed. Install exceljs with: npm install exceljs"
      );
    } finally {
      setExporting(false);
    }
  };

  const prepReady = Boolean(
    clean(d.objective) &&
      clean(d.audience) &&
      clean(d.unknown) &&
      agenda.length
  );

  return (
    <div className="sme-root">
      <style>{CSS}</style>

      <div className="sme-toolbar">
        <span className="sme-toolbar-label">
          SME INTERVIEW KIT
        </span>
        <div className="sme-toolbar-actions">
          <button
            className="sme-light"
            type="button"
            onClick={() => reset(true)}
          >
            ↺ Use example
          </button>
          <button
            className="sme-light"
            type="button"
            onClick={() => reset(false)}
          >
            ＋ Start fresh
          </button>
        </div>
      </div>

      <nav
        className="sme-steps"
        aria-label="Interview kit sections"
      >
        {STEPS.map((label, i) => (
          <button
            key={label}
            type="button"
            className={`sme-step ${
              step === i ? "active" : ""
            }`}
            onClick={() => setStep(i)}
          >
            <span>{i < step ? "✓" : i + 1}</span>
            {label}
          </button>
        ))}
      </nav>

      <div className="sme-layout">
        <main className="sme-editor">
          <div className="sme-step-intro">
            <div className="sme-kicker">
              {String(step + 1).padStart(2, "0")} /{" "}
              {STEPS[step].toUpperCase()}
            </div>
            <h2>
              {
                [
                  "Prepare for a Focused SME Interview",
                  "Set Up Your SME Interview Questions",
                  "Review Your SME Interview Pack Before Exporting",
                ][step]
              }
            </h2>
            <p>
              {
                [
                  "Define the content assignment, identify gaps that require expert input and establish exactly what needs to be answered and verified.",
                  "Use the suggested questions as a starting point, then adjust them to cover the specific workflows, buyer concerns and claims your article needs.",
                  "Review the assignment, questions and timing before sending the pack to your writer or interviewer.",
                ][step]
              }
            </p>
          </div>

          {step === 0 && (
            <>
              <Section
                title="The content assignment"
                detail="Establish why the interview is needed before drafting questions."
              >
                <div className="sme-grid">
                  <Field
                    label="Company or project"
                    value={d.company}
                    onChange={(v) => set("company", v)}
                    placeholder="Company name"
                  />
                  <Field
                    label="Working content title"
                    value={d.title}
                    onChange={(v) => set("title", v)}
                    placeholder="Working article or video title"
                  />
                  <Select
                    label="Content format"
                    value={d.format}
                    options={FORMATS}
                    onChange={(v) =>
                      changeRoleFormat("format", v)
                    }
                  />
                  <Select
                    label="SME team or role"
                    value={d.role}
                    options={ROLES}
                    onChange={(v) =>
                      changeRoleFormat("role", v)
                    }
                  />
                  <Field
                    label="Expert name"
                    value={d.expertName}
                    onChange={(v) => set("expertName", v)}
                  />
                  <Field
                    label="Expert position"
                    value={d.expertTitle}
                    onChange={(v) => set("expertTitle", v)}
                  />
                  <Field
                    label="Interviewer"
                    value={d.interviewer}
                    onChange={(v) => set("interviewer", v)}
                  />
                  <Field
                    label="Interview date"
                    type="date"
                    value={d.interviewDate}
                    onChange={(v) => set("interviewDate", v)}
                  />
                </div>

                <div className="sme-grid">
                  <Field
                    label="Who is the target reader?"
                    value={d.audience}
                    onChange={(v) => set("audience", v)}
                    multiline
                  />
                  <Field
                    label="What decision should the content support?"
                    value={d.buyerDecision}
                    onChange={(v) => set("buyerDecision", v)}
                    multiline
                  />
                  <Field
                    label="What do we need from this interview?"
                    value={d.objective}
                    onChange={(v) => set("objective", v)}
                    multiline
                  />
                  <Field
                    label="Which business or pipeline goal does the content support?"
                    value={d.commercialGoal}
                    onChange={(v) => set("commercialGoal", v)}
                    multiline
                  />
                </div>
              </Section>

              <Section
                title="Pre-interview research and content gaps"
                detail="Gather everything available from existing product docs first, and save SME interviews for nuances that require specialist input"
              >
                <div className="sme-grid">
                  <Field
                    label="What do we already know?"
                    value={d.known}
                    onChange={(v) => set("known", v)}
                    multiline
                  />
                  <Field
                    label="What still needs an answer?"
                    value={d.unknown}
                    onChange={(v) => set("unknown", v)}
                    multiline
                  />
                  <Field
                    label="Topics in scope"
                    value={d.scopeIn}
                    onChange={(v) => set("scopeIn", v)}
                    multiline
                  />
                  <Field
                    label="Topics outside scope"
                    value={d.scopeOut}
                    onChange={(v) => set("scopeOut", v)}
                    multiline
                  />
                  <Field
                    label="Existing materials to review"
                    value={d.priorMaterials}
                    onChange={(v) => set("priorMaterials", v)}
                    multiline
                  />
                  <Field
                    label="Documents, examples or figures to request"
                    value={d.proofRequested}
                    onChange={(v) => set("proofRequested", v)}
                    multiline
                  />
                </div>
              </Section>






            </>
          )}

          {step === 1 && (
            <>
              <Section
                title="Interview plan"
                detail="Reorder or edit the questions, then remove anything already answered in your background research."
              >
                <div className="sme-plan-top">
                  <div>
                    <strong>
                      {agenda.length} active questions
                    </strong>
                    <span>
                      {allocated} of {d.duration} minutes scheduled
                    </span>
                  </div>
                  <button
                    type="button"
                    className="sme-light"
                    onClick={rebuild}
                  >
                    Rebuild suggested questions
                  </button>
                </div>

                <div className="sme-duration">
                  <span>Interview length</span>
                  <div>
                    {DURATIONS.map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={
                          d.duration === n ? "selected" : ""
                        }
                        onClick={() => set("duration", n)}
                      >
                        {n} min
                      </button>
                    ))}
                  </div>
                </div>

                {allocated !== d.duration && (
                  <div className="sme-warning">
                    The active questions total {allocated}{" "}
                    minutes. Adjust manually assigned minutes or
                    increase the interview length.
                  </div>
                )}

                {d.questions.map((q, i) => (
                  <article
                    key={q.id}
                    className={`sme-question ${
                      !q.include ? "disabled" : ""
                    }`}
                  >
                    <div className="sme-item-head">
                      <strong>
                        {String(i + 1).padStart(2, "0")} ·{" "}
                        {q.category}
                      </strong>
                      <div className="sme-actions">
                        <label>
                          <input
                            type="checkbox"
                            checked={q.include}
                            onChange={(e) =>
                              setQuestion(
                                q.id,
                                "include",
                                e.target.checked
                              )
                            }
                          />{" "}
                          Include
                        </label>
                        <button
                          type="button"
                          aria-label="Move question up"
                          onClick={() => moveQuestion(q.id, -1)}
                          disabled={i === 0}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          aria-label="Move question down"
                          onClick={() => moveQuestion(q.id, 1)}
                          disabled={
                            i === d.questions.length - 1
                          }
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          aria-label="Remove question"
                          onClick={() =>
                            setD((old) => ({
                              ...old,
                              questions: old.questions.filter(
                                (x) => x.id !== q.id
                              ),
                            }))
                          }
                        >
                          ×
                        </button>
                      </div>
                    </div>

            <Field
  label="Question label"
  tooltip="Give this question a short name so it's easy to identify and reorder."
  value={q.label}
                      onChange={(v) =>
                        setQuestion(q.id, "label", v)
                      }
                    />

             <Field
  label="Main interview question"
  tooltip="Write the question you'll ask the expert. Focus on information missing from your research."
  value={q.question}
                      onChange={(v) =>
                        setQuestion(q.id, "question", v)
                      }
                      multiline
                      rows={2}
                    />

                    <div className="sme-grid">
                   <Field
  label="Follow-up probe or evidence request"
  tooltip="Add a follow-up that asks for specific examples, clarification or supporting evidence."
  value={q.probe}
                        onChange={(v) =>
                          setQuestion(q.id, "probe", v)
                        }
                        multiline
                        rows={2}
                      />
                      <div className="sme-stack">
                        <label className="sme-checkline small">
                          <input
                            type="checkbox"
                            checked={q.manualMinutes}
                            onChange={(e) =>
                              setQuestion(
                                q.id,
                                "manualMinutes",
                                e.target.checked
                              )
                            }
                          />
                  <span className="sme-manual-time-label">
  <strong>Set time manually</strong>
  <InfoTooltip text="Choose how many minutes to spend on this question. Other questions will share the remaining interview time." />
</span>
                        </label>
                        {q.manualMinutes && (
                          <Field
                            label="Minutes"
                            type="number"
                            value={q.minutes}
                            onChange={(v) =>
                              setQuestion(
                                q.id,
                                "minutes",
                                Math.max(0, Number(v) || 0)
                              )
                            }
                          />
                        )}
                      </div>
                    </div>
                  </article>
                ))}

                <button
                  type="button"
                  className="sme-add"
                  onClick={() =>
                    setD((old) => ({
                      ...old,
                      questions: [
                        ...old.questions,
                        mkQuestion({
                          category: "Custom",
                          label: "New question",
                          question: "",
                          probe: "",
                        }),
                      ],
                    }))
                  }
                >
                  ＋ Add another question
                </button>
              </Section>
              <Section
                title="Optional opening script"
                detail="Prepare a short introduction for the SME. Leave this blank if you prefer to open the call naturally."
              >
                <Field
                  label="How will you introduce the interview?"
                  value={d.playbook?.opening || ""}
                  onChange={(v) =>
                    set("playbook", { ...d.playbook, opening: v })
                  }
                  placeholder="We're preparing a [content format] for [audience] about [topic]. I'd like to learn [specific gaps]. A recent example would help us get the details right."
                  multiline
                  rows={5}
                />
              </Section>
            </>
          )}

          {step === 2 && (
            <>
              <div className="sme-metrics">
                <div><b>{agenda.length}</b><span>Interview questions</span></div>
                <div><b>{allocated}/{d.duration}</b><span>Minutes scheduled</span></div>
                <div><b>{clean(d.playbook?.opening) ? "Yes" : "Optional"}</b><span>Opening script</span></div>
              </div>



<Section
  title="Final preparation review"
  detail="Make sure the essential details are covered before the interview takes place."
>
  <div className="sme-playbook-line">
    {clean(d.objective) ? "✓" : "○"} Interview objective
    is clearly defined
  </div>

  <div className="sme-playbook-line">
    {clean(d.audience) && clean(d.buyerDecision)
      ? "✓"
      : "○"}{" "}
    Target audience and buying decision are documented
  </div>

  <div className="sme-playbook-line">
    {clean(d.unknown) ? "✓" : "○"} Research gaps
    are identified
  </div>

  <div className="sme-playbook-line">
    {agenda.length &&
    agenda.every((q) => clean(q.question) && clean(q.probe))
      ? "✓"
      : "○"}{" "}
    Interview questions and follow-ups are ready
  </div>

  <div className="sme-playbook-line">
    {allocated === d.duration && agenda.length
      ? "✓"
      : "○"}{" "}
    Question timings fit the interview duration
  </div>

  {!prepReady && (
    <p className="sme-playbook-note">
      Complete the core assignment details before
      sharing the interview pack.
    </p>
  )}
</Section>

<Section
  title="What's included in your interview pack"
  detail="Everything your writer or interviewer needs to prepare for the conversation."
>
  {[
    "Content assignment, audience and research gaps",
    "Selected questions, follow-ups and timings",
    "Optional opening script",
    "Existing materials and evidence requests",
  ].map((x) => (
    <div key={x} className="sme-playbook-line">
      ✓ {x}
    </div>
  ))}
</Section>

              <Section
                title="Export your SME interview pack"
                detail="Share the preparation and agenda with your interviewer or download an editable pack for the call."
              >
                <div className="sme-export">
                  <button type="button" onClick={copy}>
                    Copy interview pack
                  </button>
                  <button
                    type="button"
                    onClick={downloadExcel}
                    disabled={!canExport}
                  >
                    {exporting
                      ? "Preparing Excel…"
                      : "Download Excel"}
                  </button>
                  <button
                    type="button"
                    className="sme-primary"
                    onClick={() => window.print()}
                  >
                    Save as PDF
                  </button>
                </div>
                <p className="sme-disclaimer">
                  Changes save automatically in this browser.
                  Excel edits do not sync back. This kit does not
                  record or transcribe interviews.
                </p>
              </Section>
            </>
          )}

          <div className="sme-bottom-nav">
            <button
              type="button"
              className="sme-light"
              disabled={step === 0}
              onClick={() =>
                setStep((s) => Math.max(0, s - 1))
              }
            >
              ← Back
            </button>
            <span>Step {step + 1} of 3</span>
            {step < 2 && (
              <button
                type="button"
                className="sme-primary"
                onClick={() =>
                  setStep((s) => Math.min(2, s + 1))
                }
              >
                Continue <Arrow />
              </button>
            )}
          </div>

          {notice && (
            <div className="sme-notice" role="status">
              {notice}
            </div>
          )}

        </main>



<aside className="sme-aside">
  <div className="sme-preview-head">
    <small>LIVE INTERVIEW PACK</small>

    <h3>{d.title || "SME interview preparation"}</h3>

    <p>
      {d.company || "Your company"} · {d.format}
    </p>

    <div className="sme-preview-metrics">
      <div>
        <b>{agenda.length}</b>
        <span>Questions</span>
      </div>

      <div>
        <b>{d.duration} min</b>
        <span>Duration</span>
      </div>

      <div>
        <b>{allocated}/{d.duration}</b>
        <span>Minutes scheduled</span>
      </div>
    </div>
  </div>

  <div className="sme-preview-inner">
    <div className="sme-tabs">
      {[
        ["prepare", "Preparation"],
        ["agenda", "Questions"],
        ["handoff", "Review"],
      ].map(([key, label]) => (
        <button
          key={key}
          type="button"
          className={preview === key ? "active" : ""}
          onClick={() => setPreview(key)}
        >
          {label}
        </button>
      ))}
    </div>

    {/* TAB 1 — COMPLETE PREPARATION */}

    {preview === "prepare" && (
      <>
        <div className="sme-preview-section">
          <h4>Content assignment</h4>

          {[
            ["Company or project", d.company],
            ["Working content title", d.title],
            ["Content format", d.format],
            ["SME team or role", d.role],
            ["Expert name", d.expertName],
            ["Expert position", d.expertTitle],
            ["Interviewer", d.interviewer],
            ["Interview date", d.interviewDate],
            ["Interview duration", `${d.duration} minutes`],
          ].map(([label, value]) => (
            <div className="sme-preview-detail" key={label}>
              <span>{label}</span>
              <strong>{valueOrDash(value)}</strong>
            </div>
          ))}
        </div>

        <div className="sme-preview-section">
          <h4>Audience and commercial objectives</h4>

          {[
            ["Target reader", d.audience],
            ["Buyer decision", d.buyerDecision],
            ["Interview objective", d.objective],
            ["Business or pipeline goal", d.commercialGoal],
          ].map(([label, value]) => (
            <div className="sme-preview-detail" key={label}>
              <span>{label}</span>
              <strong>{valueOrDash(value)}</strong>
            </div>
          ))}
        </div>

        <div className="sme-preview-section">
          <h4>Pre-interview research and content gaps</h4>

          {[
            ["What we already know", d.known],
            ["What still needs an answer", d.unknown],
            ["Topics in scope", d.scopeIn],
            ["Topics outside scope", d.scopeOut],
            ["Existing materials to review", d.priorMaterials],
            [
              "Documents, examples or figures to request",
              d.proofRequested,
            ],
          ].map(([label, value]) => (
            <div className="sme-preview-detail" key={label}>
              <span>{label}</span>
              <strong>{valueOrDash(value)}</strong>
            </div>
          ))}
        </div>
      </>
    )}

    {/* TAB 2 — ALL SELECTED INTERVIEW QUESTIONS */}

    {preview === "agenda" && (
      <>
        <div className="sme-preview-section">
          <h4>Interview overview</h4>

          <div className="sme-preview-detail">
            <span>Interview duration</span>
            <strong>{d.duration} minutes</strong>
          </div>

          <div className="sme-preview-detail">
            <span>Active questions</span>
            <strong>{agenda.length}</strong>
          </div>

          <div className="sme-preview-detail">
            <span>Minutes scheduled</span>
            <strong>
              {allocated} of {d.duration} minutes
            </strong>
          </div>

          <div className="sme-preview-detail">
            <span>Interview objective</span>
            <strong>{valueOrDash(d.objective)}</strong>
          </div>

          <div className="sme-preview-detail">
            <span>Research gaps</span>
            <strong>{valueOrDash(d.unknown)}</strong>
          </div>
        </div>

        <div className="sme-preview-section">
          <h4>Selected questions and timing</h4>

          {agenda.length ? (
            agenda.map((q, i) => (
              <div
                key={q.id}
                className="sme-preview-question"
              >
                <small>
                  {clockFmt(q.start)}–{clockFmt(q.end)}
                  {" · "}
                  {q.category}
                </small>

                <strong>
                  {i + 1}. {q.question}
                </strong>

                <p>
                  <b>Follow-up:</b>{" "}
                  {q.probe ||
                    "Ask for a specific example and its source."}
                </p>

                <div className="sme-preview-question-meta">
                  {q.allocated} minutes allocated
                </div>
              </div>
            ))
          ) : (
            <p>
              No questions selected. Return to Step 2 to build
              the interview agenda.
            </p>
          )}
        </div>
        <div className="sme-preview-section">
          <h4>Optional opening script</h4>
          <p className="sme-preview-script">
            {d.playbook?.opening || "No opening script added."}
          </p>
        </div>
      </>
    )}

    {/* TAB 3 — FINAL REVIEW AND EXPORT CONTENTS */}

    {/* TAB 4 — FINAL REVIEW AND EXPORT CONTENTS */}

    {preview === "handoff" && (
      <>
        <div className="sme-preview-section">
          <h4>Final preparation review</h4>

          {[
            {
              ok: Boolean(clean(d.objective)),
              label: "Interview objective is defined",
            },
            {
              ok: Boolean(
                clean(d.audience) &&
                clean(d.buyerDecision)
              ),
              label:
                "Target reader and buying decision are recorded",
            },
            {
              ok: Boolean(clean(d.unknown)),
              label: "Research gaps are documented",
            },
            {
              ok: agenda.length > 0,
              label:
                "At least one interview question is included",
            },
            {
              ok:
                agenda.length > 0 &&
                allocated === d.duration,
              label:
                "Question timings fit the interview duration",
            },
          ].map((item, i) => (
            <div
              className="sme-preview-check"
              key={i}
            >
              <span
                className={
                  item.ok ? "complete" : "incomplete"
                }
              >
                {item.ok ? "✓" : "○"}
              </span>

              <p>{item.label}</p>
            </div>
          ))}
        </div>

        <div className="sme-preview-section">
          <h4>What the interview pack includes</h4>

          {[
            "Content assignment, target reader and business objective",
            "Existing research, information gaps and interview scope",
            "Selected interview questions and timed agenda",
            "Optional opening script",
            "Evidence and materials to request",
            "Blank notes worksheet for the interview",
          ].map((item, i) => (
            <div
              className="sme-preview-check"
              key={i}
            >
              <span className="complete">✓</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="sme-preview-section">
          <h4>Export options</h4>

          <div className="sme-preview-detail">
            <span>Copy interview pack</span>
            <strong>
              Copy the prepared interview information
              and agenda.
            </strong>
          </div>

          <div className="sme-preview-detail">
            <span>Download Excel</span>
            <strong>
              Edit the interview pack and complete the
              notes worksheet.
            </strong>
          </div>

          <div className="sme-preview-detail">
            <span>Save as PDF</span>
            <strong>
              Share a fixed, branded copy of the
              interview preparation pack.
            </strong>
          </div>
        </div>
      </>
    )}
  </div>

  <div className="sme-preview-foot">
    <span>Changes saved locally</span>

    <button
      type="button"
      onClick={() => {
        setStep(2);
        setPreview("handoff");
      }}
    >
      Review & export <Arrow />
    </button>
  </div>
</aside>




      </div>

      <div className="sme-print">
        <header className="sme-print-cover">
          <div className="sme-print-brand">
            GrowUp<span>.</span>
          </div>
          <div className="sme-print-eyebrow">
            SME INTERVIEW PREPARATION PACK
          </div>
          <h1>{d.title || "Subject Matter Expert Interview"}</h1>
          <p>
            {d.company || "Your company"} · {d.format}
          </p>
          <div className="sme-print-meta">
            <span>{d.duration} minutes</span>
            <span>{d.expertName || "Expert not specified"}</span>
            <span>
              {d.interviewDate || "Date not specified"}
            </span>
          </div>
        </header>

        <section>
          <h2>01 / Interview preparation</h2>
          <PrintRow label="Target reader" value={d.audience} />
          <PrintRow
            label="Buyer decision"
            value={d.buyerDecision}
          />
          <PrintRow
            label="Interview objective"
            value={d.objective}
          />
          <PrintRow
            label="Commercial goal"
            value={d.commercialGoal}
          />
          <PrintRow label="Known information" value={d.known} />
          <PrintRow label="Research gaps" value={d.unknown} />
          <PrintRow label="In scope" value={d.scopeIn} />
          <PrintRow label="Out of scope" value={d.scopeOut} />
          <PrintRow
            label="Materials reviewed"
            value={d.priorMaterials}
          />
          <PrintRow
            label="Evidence requested"
            value={d.proofRequested}
          />

        </section>

        <section>
          <h2>02 / Interview questions and timing</h2>
          {agenda.map((q, i) => (
            <div className="sme-print-card" key={q.id}>
              <small>
                {clockFmt(q.start)}–{clockFmt(q.end)} ·{" "}
                {q.category}
              </small>
              <h3>
                {i + 1}. {q.question}
              </h3>
              <p>
                <b>Follow-up:</b>{" "}
                {q.probe || "Ask for a specific example."}
              </p>
            </div>
          ))}
        </section>

        {clean(d.playbook?.opening) && (
          <section>
            <h2>03 / Optional opening script</h2>
            <PrintRow label="Opening" value={d.playbook.opening} />
          </section>
        )}
        <section>
          <h2>04 / Blank interview notes</h2>
          {agenda.map((q, i) => (
            <div className="sme-print-card" key={q.id}>
              <h3>
                {i + 1}. {q.question}
              </h3>
              <p>
                Key insight / example:
                ________________________________________
              </p>
              <p>
                Exact quote / timestamp:
                ____________________________________
              </p>
              <p>
                Source / follow-up owner:
                ___________________________________
              </p>
            </div>
          ))}
        </section>

        <footer>
          GrowUp · Interview preparation pack · Verify claims
          and obtain permissions before publication.
        </footer>
      </div>
    </div>
  );
}

const PrintRow = ({ label, value }) => (
  <div className="sme-print-row">
    <b>{label}</b>
    <span>{valueOrDash(value)}</span>
  </div>
);

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');
.sme-root, .sme-root * { box-sizing: border-box; }
.sme-root { --sme-teal:#167273; --sme-dark:#073b3b; --sme-line:#d6e5e1; --sme-muted:#57716e; font-family:'Montserrat',sans-serif; width:100%; max-width:1320px; margin:0 auto; padding:12px 0 48px; color:#011522; font-size:12px; line-height:1.6; }
.sme-root button,.sme-root input,.sme-root select,.sme-root textarea { font:inherit; }
.sme-root button { cursor:pointer; }
.sme-root button:disabled { opacity:.42;cursor:not-allowed; }
.sme-root :is(button,input,select,textarea):focus-visible { outline:3px solid #8ecfc4; outline-offset:2px; }
.sme-toolbar { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:8px 0 18px; }
.sme-toolbar-label { font-size:11px;font-weight:850;letter-spacing:1.5px;color:#167273; }
.sme-toolbar-actions { display:flex;flex-wrap:wrap;gap:8px; }
.sme-light,.sme-primary { display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 13px;border-radius:9px;font-size:11px;font-weight:800;border:1px solid #d6e5e1;background:#fff;color:#073b3b; }
.sme-primary { background:#167273;color:#fff;border-color:#167273; }
.sme-steps { display:flex;gap:8px;overflow-x:auto;padding:0 0 16px;margin-bottom:24px;border-bottom:1px solid #d6e5e1; }
.sme-step { display:flex;align-items:center;gap:8px;white-space:nowrap;padding:9px 12px;border:1px solid #d6e5e1;border-radius:9px;background:#fff;color:#073b3b;font-size:11px;font-weight:800; }
.sme-step span { border:1px solid currentColor;border-radius:50%;width:20px;height:20px;display:grid;place-items:center;font-size:10px; }
.sme-step.active { background:#073b3b;color:#fff;border-color:#073b3b; }
.sme-layout { display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:24px;align-items:start; }
.sme-editor,.sme-aside { background:#fff;border:1px solid #d6e5e1;border-radius:15px;overflow:hidden;min-width:0; }
.sme-editor {
  padding: 28px;
  overflow: visible;
}
.sme-kicker { font-size:10px;text-transform:uppercase;font-weight:850;letter-spacing:1.6px;color:#167273;margin-bottom:9px; }
.sme-step-intro h2 { font-size:24px;line-height:1.25;color:#073b3b;margin:0;letter-spacing:-.6px; }
.sme-step-intro>p { color:#57716e;font-size:12px;line-height:1.75;margin:10px 0 24px; }
.sme-section { border-top:1px solid #e5efec;padding-top:22px;margin-top:22px; }
.sme-section h3 { color:#073b3b;font-size:15px;letter-spacing:-.2px;margin:0 0 5px;font-weight:800; }
.sme-section-desc { font-size:11.5px;color:#57716e;margin:0 0 19px; }
.sme-grid { display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-bottom:14px; }
.sme-stack { display:grid;gap:12px;align-content:start; }
.sme-field { display:flex;flex-direction:column;gap:6px;min-width:0;margin-bottom:13px; }
.sme-field>span {
  font-weight: 750;
  color: #073b3b;
  font-size: 11px;
}

.sme-field-label,
.sme-manual-time-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sme-info-tooltip {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 15px;
  height: 15px;
  color: #167273;
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
}

.sme-info-tooltip:hover,
.sme-info-tooltip:focus-visible {
  color: #073b3b;
}

.sme-info-tooltip::after {
  content: attr(data-tooltip);
  position: absolute;

  /* Position beneath the icon, aligned to its left */
  top: calc(100% + 9px);
  bottom: auto;
  left: 0;
  right: auto;
  transform: none;

  width: 250px;
  max-width: min(250px, 70vw);
  box-sizing: border-box;

  padding: 11px 13px;
  background: #073b3b;
  color: #ffffff;
  border-radius: 8px;

  font-family: "Montserrat", sans-serif;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.6;
  white-space: normal;
  text-align: left;

  box-shadow: 0 6px 20px rgba(1, 21, 34, 0.18);

  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  z-index: 1000;
}
.sme-info-tooltip:hover::after,
.sme-info-tooltip:focus-visible::after {
  opacity: 1;
  visibility: visible;
}

/* Keep the manual timing tooltip inside its column */
.sme-manual-time-label {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  width: fit-content;
  gap: 5px;
}

.sme-manual-time-label .sme-info-tooltip::after {
  left: auto;
  right: 0;
  transform: none;
}

/* Prevent the tooltip from appearing in PDF exports */
@media print {
  .sme-info-tooltip::after {
    display: none !important;
  }
}
.sme-field input,.sme-field textarea,.sme-field select { display:block;width:100%;border:1px solid #bfd6d1;border-radius:8px;background:#fbfdfc;color:#011522;min-height:41px;padding:10px 11px;font-size:12px;resize:vertical; }
.sme-field textarea { min-height:85px; }
.sme-field small { font-size:10px;color:#57716e; }
.sme-checklist { margin-bottom:20px; }
.sme-checkline { display:flex;align-items:start;gap:11px;border-bottom:1px solid #eaf0ee;padding:12px 0;cursor:pointer; }
.sme-checkline input { accent-color:#167273;margin-top:3px; }
.sme-checkline > span {
  flex: 1;
}

.sme-checkline.small > .sme-manual-time-label {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  width: auto;
  gap: 5px;
}

.sme-manual-time-label .sme-info-tooltip {
  flex: 0 0 15px;
}
.sme-checkline strong { display:block;font-size:11px;color:#073b3b;font-weight:700; }
.sme-checkline small { display:block;font-size:10px;color:#57716e;margin-top:4px; }
.sme-checkline.small { border:0;padding:0 0 8px; }
.sme-plan-top { display:flex;align-items:center;justify-content:space-between;gap:15px;margin-bottom:17px; }
.sme-plan-top strong { display:block;color:#073b3b;font-size:12px; }
.sme-plan-top span { display:block;color:#57716e;font-size:10px; }
.sme-duration { padding:13px;background:#eef4f3;border-radius:9px;margin-bottom:16px; }
.sme-duration>span { display:block;font-weight:800;color:#073b3b;margin-bottom:9px; }
.sme-duration>div { display:flex;flex-wrap:wrap;gap:7px; }
.sme-duration button { border:1px solid #c7dcd6;background:white;color:#073b3b;border-radius:7px;font-size:11px;padding:8px 12px;font-weight:750; }
.sme-duration button.selected { background:#073b3b;border-color:#073b3b;color:white; }
.sme-question,.sme-note,.sme-record { padding:18px 0;border-bottom:1px solid #e5efec; }
.sme-question.disabled { opacity:.6; }
.sme-item-head { display:flex;align-items:start;justify-content:space-between;gap:12px;margin-bottom:13px; }
.sme-item-head strong { font-weight:800;font-size:12px;line-height:1.5;color:#073b3b; }
.sme-actions { display:flex;gap:5px;align-items:center;flex-shrink:0; }
.sme-actions label { font-size:10px;color:#57716e;white-space:nowrap; }
.sme-actions input { accent-color:#167273; }
.sme-actions button { width:25px;height:25px;border:1px solid #d6e5e1;border-radius:6px;background:#fff;color:#57716e; }
.sme-add { width:100%;border:1px dashed #89beb6;background:#f1faf6;color:#167273;border-radius:9px;padding:11px;font-weight:800;font-size:11px;margin-top:15px; }
.sme-probe { margin:0 0 15px;font-size:11px;color:#57716e; }

.sme-playbook-agenda { display:grid;grid-template-columns:95px minmax(0,1fr);gap:14px;padding:13px 0;border-bottom:1px solid #e5efec;align-items:start; }
.sme-playbook-agenda strong { display:block;font-size:12px;color:#073b3b;line-height:1.5; }
.sme-playbook-agenda p { margin:5px 0 0;font-size:11px;color:#57716e; }
.sme-script { background:#eef4f3;border-left:3px solid #167273;border-radius:0 8px 8px 0;padding:17px 18px;color:#073b3b;font-size:12px;line-height:1.8; }
.sme-playbook-note { color:#57716e;font-size:11px;line-height:1.6;margin:12px 0 4px; }
.sme-playbook-focus { border:1px solid #d6e5e1;border-radius:9px;padding:13px 15px;margin-bottom:10px;background:#fbfdfc; }
.sme-playbook-focus strong,.sme-playbook-subheading { color:#073b3b;font-size:12px;font-weight:800; }
.sme-playbook-focus p { color:#57716e;font-size:11px;margin:6px 0 0; }
.sme-playbook-subheading { margin:22px 0 9px; }
.sme-playbook-line { padding:11px 0;border-bottom:1px solid #e5efec;font-size:11px;color:#365452;line-height:1.6; }
.sme-playbook-prompt { display:grid;grid-template-columns:145px minmax(0,1fr);gap:15px;padding:12px 0;border-bottom:1px solid #e5efec; }
.sme-playbook-prompt span { color:#57716e;font-size:10px; }
.sme-playbook-prompt strong { color:#073b3b;font-size:11px;font-weight:700; }
@media(max-width:620px) { .sme-playbook-agenda,.sme-playbook-prompt { grid-template-columns:1fr;gap:5px; } }

.sme-chip { color:#167273;background:#eef4f3;padding:5px 8px;border-radius:6px;font-size:10px;font-weight:750;white-space:nowrap; }
.sme-linkbtn { color:#a34b42;border:0;background:transparent;font-size:10px;font-weight:700; }
.sme-metrics { display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px; }
.sme-metrics>div { padding:14px;background:#eef4f3;border-radius:9px; }
.sme-metrics b { display:block;font-size:20px;color:#073b3b;line-height:1.3; }
.sme-metrics span { display:block;font-size:9px;color:#57716e;margin-top:3px; }
.sme-warning { background:#fff7eb;color:#835b1b;border:1px solid #ecd7a4;border-radius:8px;padding:11px;font-size:11px; }
.sme-export { display:flex;gap:8px;flex-wrap:wrap; }
.sme-export button { background:#fff;color:#073b3b;border:1px solid #d6e5e1;border-radius:8px;padding:11px 13px;font-weight:800;font-size:11px; }
.sme-export button.sme-primary { background:#167273;color:#fff;border-color:#167273; }
.sme-disclaimer { color:#57716e;font-size:10px;margin:13px 0 0; }
.sme-bottom-nav { display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:28px;padding-top:18px;border-top:1px solid #d6e5e1; }
.sme-bottom-nav span { font-size:10px;color:#57716e; }
.sme-notice { margin-top:12px;padding:11px;border-radius:8px;color:#073b3b;background:#eef4f3;font-size:11px; }
.sme-aside { position:sticky;top:16px; }
.sme-preview-head { background:#073b3b;padding:20px;color:#fff; }
.sme-preview-head small { font-size:9px;color:#a8d9cf;font-weight:800;letter-spacing:1.3px; }
.sme-preview-head h3 { font-size:18px;line-height:1.3;margin:9px 0 5px;color:#fff;overflow-wrap:anywhere; }
.sme-preview-head p { font-size:10px;margin:0;color:#d4e7e1; }
.sme-preview-metrics { display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:17px; }
.sme-preview-metrics>div { background:#174b49;padding:10px;border-radius:7px; }
.sme-preview-metrics b { display:block;font-size:15px;line-height:1.3; }
.sme-preview-metrics span { display:block;color:#c1dfd8;font-size:9px;margin-top:3px; }
.sme-preview-inner { padding:18px;max-height:680px;overflow:auto; }
.sme-tabs { display:flex;gap:5px;padding-bottom:12px;border-bottom:1px solid #d6e5e1; }
.sme-tabs button { background:#fff;color:#073b3b;border:1px solid #d6e5e1;border-radius:7px;padding:7px 10px;font-size:10px;font-weight:750; }
.sme-tabs button.active { background:#073b3b;color:#fff;border-color:#073b3b; }
.sme-preview-section { padding:14px 0;border-bottom:1px solid #e5efec; }
.sme-preview-section h4 { font-size:11px;color:#073b3b;margin:0 0 7px; }
.sme-preview-section>p { color:#57716e;font-size:10px;white-space:pre-wrap; }
.sme-preview-question { padding:12px;background:#f4f8f6;border-radius:8px;margin:8px 0; }
.sme-preview-question small { display:block;color:#167273;font-size:9px; }
.sme-preview-question strong { display:block;color:#073b3b;font-size:10.5px;margin-top:4px; }
.sme-preview-question p { margin:6px 0 0;color:#57716e;font-size:10px;white-space:pre-wrap; }
.sme-preview-foot { display:flex;align-items:center;justify-content:space-between;padding:12px 18px;border-top:1px solid #d6e5e1;gap:10px; }
.sme-preview-foot span { color:#57716e;font-size:9px; }
.sme-preview-foot button { color:#167273;background:transparent;border:0;font-weight:800;font-size:10px; }
.sme-print { display:none; }
@media(max-width:1080px) { .sme-layout { grid-template-columns:1fr; } .sme-aside { position:static; } .sme-preview-inner { max-height:440px; } }
@media(max-width:620px) { .sme-editor { padding:17px; } .sme-grid { grid-template-columns:1fr;gap:0; } .sme-step-intro h2 { font-size:21px; } .sme-toolbar { align-items:flex-start;flex-direction:column; } .sme-steps { gap:6px; } .sme-step { padding:8px; } .sme-item-head { flex-wrap:wrap; } .sme-plan-top { align-items:flex-start;flex-direction:column; } .sme-metrics { gap:5px; } .sme-metrics>div { padding:9px; } .sme-metrics b { font-size:16px; } }
@page { size:A4; margin:13mm 16mm 16mm; }
@media print {
  html,body { margin:0!important;padding:0!important;background:white!important; }
  body * { visibility:hidden!important; }
  .sme-root {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  max-width: none !important;
  width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
  transform: none !important;
}
  .sme-root > :not(.sme-print) { display:none!important; }
  .sme-root .sme-print,.sme-root .sme-print * { visibility:visible!important; }
  .sme-print { display:block!important;position:relative!important;width:100%;font-family:'Montserrat',Arial,sans-serif;color:#173431;font-size:9pt;line-height:1.55;print-color-adjust:exact;-webkit-print-color-adjust:exact; }
  .sme-print-cover {
  background: #073b3b !important;
  color: white !important;
  border-radius: 3mm;
  padding: 12mm 13mm;
  margin: 0 0 8mm 0 !important;
  break-inside: avoid;
  page-break-inside: avoid;
}
  .sme-print-brand { font-size:20pt;font-weight:900;color:white; }.sme-print-brand span { color:#75d6c1; }
  .sme-print-eyebrow { font-size:8pt;letter-spacing:2pt;color:#a6d9ca;margin-top:11mm;font-weight:800; }
  .sme-print-cover h1 { color:white;font-size:22pt;line-height:1.25;margin:4mm 0; }
  .sme-print-cover p { color:#d6ece7; }
  .sme-print-meta { display:flex;flex-wrap:wrap;gap:7mm;border-top:1px solid #7aa69b;padding-top:5mm;margin-top:7mm; }
  .sme-print section {
  margin: 8mm 0;
}

.sme-print section:first-of-type {
  margin-top: 0;
}
  .sme-print section h2 { font-size:13pt;color:#073b3b;border-bottom:1px solid #cddfdb;padding-bottom:2mm;break-after:avoid; }
  .sme-print-row { display:grid;grid-template-columns:34% 66%;gap:2mm;padding:2mm 0;border-bottom:1px solid #e5efec;white-space:pre-wrap;overflow-wrap:anywhere; }
  .sme-print-row b { color:#57716e; }
  .sme-print-line { padding:2mm 0;border-bottom:1px solid #e5efec; }
  .sme-print-card { break-inside:avoid;background:#eef4f3!important;border-left:3px solid #167273;padding:4mm 5mm;margin:3mm 0; }
  .sme-print-card small { color:#167273; }.sme-print-card h3 { font-size:10pt;color:#073b3b;margin:1mm 0 2mm; }
  .sme-print-card p { margin:1mm 0;white-space:pre-wrap;overflow-wrap:anywhere; }
  .sme-print footer { font-size:7pt;color:#57716e;border-top:1px solid #d6e5e1;padding-top:3mm;margin-top:10mm; }
}


/* Expanded live interview preview */

.sme-preview-detail {
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr);
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #e8f0ed;
  align-items: start;
}

.sme-preview-detail:last-child {
  border-bottom: 0;
}

.sme-preview-detail > span {
  color: #68817b;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.6;
}

.sme-preview-detail > strong {
  color: #073b3b;
  font-size: 10.5px;
  font-weight: 600;
  line-height: 1.7;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.sme-preview-script {
  padding: 15px;
  border-left: 3px solid #167273;
  background: #eef4f3;
  border-radius: 0 8px 8px 0;
  color: #073b3b;
  font-size: 11px;
  line-height: 1.85;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.sme-preview-list-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #e8f0ed;
}

.sme-preview-list-item > span {
  color: #167273;
  font-size: 11px;
  font-weight: 800;
  min-width: 17px;
}

.sme-preview-list-item p {
  color: #173431;
  font-size: 10.5px;
  line-height: 1.75;
  margin: 0;
  overflow-wrap: anywhere;
}

.sme-preview-question-meta {
  color: #68817b;
  font-size: 9px;
  margin-top: 9px;
  font-weight: 650;
}

.sme-preview-check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 9px 0;
  border-bottom: 1px solid #e8f0ed;
}

.sme-preview-check span {
  font-weight: 800;
  font-size: 12px;
  flex-shrink: 0;
}

.sme-preview-check span.complete {
  color: #167273;
}

.sme-preview-check span.incomplete {
  color: #a77c34;
}

.sme-preview-check p {
  margin: 0;
  font-size: 10.5px;
  line-height: 1.7;
  color: #173431;
}

.sme-preview-section h4 {
  color: #073b3b;
  font-size: 12px;
  font-weight: 800;
  line-height: 1.5;
  margin-bottom: 12px;
}

@media (max-width: 560px) {
  .sme-preview-detail {
    grid-template-columns: 1fr;
    gap: 3px;
  }

  .sme-tabs {
    flex-wrap: wrap;
  }
}


`;
