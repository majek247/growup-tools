"use client";

import React, { useMemo, useState } from "react";

/**
 * GrowUp SME Interview Template — standalone Next.js client component.
 * No Workspace or third-party packages. Exports `faqs` for the existing registry.
 * No built-in recording, transcription, server calls or automatic saving.
 */

const C = {
  teal: "#167273",
  dark: "#011522",
  pale: "#eef4f3",
  line: "#dbe7e4",
  muted: "#5c7074",
};

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
  "Other",
];

const DURATIONS = [15, 20, 30, 45];

const BANK = {
  roles: {
    Product: [
      [
        "Workflow",
        "Talk me through the exact steps a user takes, from the first screen to the finished task.",
        "Ask for a screen recording or approved screenshot.",
      ],
      [
        "Limitations",
        "Which steps change by plan, permissions, market or integration?",
        "Ask for the current product matrix.",
      ],
      [
        "Accuracy",
        "What do customers routinely assume this feature does that it actually cannot do?",
        "Record the wording writers must avoid.",
      ],
    ],
    Sales: [
      [
        "Buyer language",
        "What was the exact question a prospect asked recently about this topic?",
        "Ask for an anonymised call note or quote.",
      ],
      [
        "Alternatives",
        "What alternatives were on their shortlist, and which difference actually mattered?",
        "Separate a buyer's stated reason from your interpretation.",
      ],
      [
        "Objections",
        "What objection delayed a deal, and what evidence helped the buyer move forward?",
        "Ask for the source of the example and permission to use it.",
      ],
    ],
    "Customer success": [
      [
        "Adoption",
        "At what point do customers get stuck after onboarding, and what usually fixes it?",
        "Ask for an anonymised support example.",
      ],
      [
        "Outcomes",
        "What has changed for a customer, and how do we know?",
        "Confirm baseline, period and how the outcome was measured.",
      ],
      [
        "Limitations",
        "Which use cases need extra setup, services or a different plan?",
        "Ask for approved help-centre references.",
      ],
    ],
    Engineering: [
      [
        "Technical reality",
        "What happens behind the scenes when a user completes this workflow?",
        "Keep the explanation at the reader's technical level.",
      ],
      [
        "Constraints",
        "What rate limits, data requirements or failure modes would materially change a buyer's decision?",
        "Ask for a current technical reference.",
      ],
      [
        "Implementation",
        "Which parts typically require engineering time or administrator access?",
        "Separate typical from guaranteed timelines.",
      ],
    ],
    "Founder / leadership": [
      [
        "Point of view",
        "What commonly accepted advice in this category do you disagree with, and why?",
        "Ask for a concrete example, not a slogan.",
      ],
      [
        "Decision",
        "What trade-off should a buyer understand before choosing an approach?",
        "Request evidence that supports the recommendation.",
      ],
      [
        "Experience",
        "Which customer or market experience changed your mind?",
        "Confirm whether the story is publishable.",
      ],
    ],
    Customer: [
      [
        "Before",
        "What was happening before you looked for a different approach?",
        "Ask for the actual process and its constraints.",
      ],
      [
        "Decision",
        "What options did you compare, and why did you choose this one?",
        "Avoid putting words in the customer's mouth.",
      ],
      [
        "Outcome",
        "What changed, how did you measure it, and over what period?",
        "Verify figures and usage permission.",
      ],
    ],
    Other: [
      [
        "Experience",
        "Describe the last time you handled this problem in practice.",
        "Ask for a specific, verifiable example.",
      ],
      [
        "Trade-offs",
        "Which conditions make your usual recommendation less useful?",
        "Capture exceptions.",
      ],
      [
        "Evidence",
        "What document, example or source could substantiate this?",
        "Record where to find it.",
      ],
    ],
  },
  formats: {
    "Comparison page": [
      [
        "Selection criteria",
        "Who should choose each option, and who should not?",
        "Seek the decision criteria a buyer uses.",
      ],
      [
        "Meaningful differences",
        "Which two or three differences matter in a real purchasing decision?",
        "Ask for a side-by-side example.",
      ],
      [
        "Proof",
        "What evidence would you show a sceptical buyer to validate those differences?",
        "Request approved proof, not an unverified claim.",
      ],
    ],
    "How-to guide": [
      [
        "Prerequisites",
        "What must the reader have ready before they begin?",
        "Capture tools, access and dependencies.",
      ],
      [
        "Steps",
        "What is the correct sequence, and where do people usually take a wrong turn?",
        "Request actual workflow examples.",
      ],
      [
        "Recovery",
        "If the usual approach fails, what should the reader check first?",
        "Include a safe fallback or escalation.",
      ],
    ],
    "Case study": [
      [
        "Starting point",
        "What was the customer's starting situation, including baseline and constraints?",
        "Ask for an approved timeline.",
      ],
      [
        "Intervention",
        "What exactly changed and who did what?",
        "Distinguish the product's role from other factors.",
      ],
      [
        "Results",
        "Which outcomes can be verified, over what period, and what else may have contributed?",
        "Confirm permission to name customer and quote results.",
      ],
    ],
    "Product / integration page": [
      [
        "Use case",
        "What user problem does this capability actually solve?",
        "Ask for a real workflow.",
      ],
      [
        "Setup",
        "What needs to be configured, and what permissions or plans are required?",
        "Ask for a current setup document.",
      ],
      [
        "Boundaries",
        "What does this integration or capability not support?",
        "Check version and market restrictions.",
      ],
    ],
    "Thought leadership": [
      [
        "Thesis",
        "What specific argument would you make that a credible peer might challenge?",
        "Ask for a defensible point of view.",
      ],
      [
        "Experience",
        "What first-hand experience illustrates this argument?",
        "Use examples, not generic predictions.",
      ],
      [
        "Counterargument",
        "When would the opposing position be reasonable?",
        "Capture the limits of the thesis.",
      ],
    ],
    Other: [
      [
        "Main question",
        "What should the reader be able to decide or do after reading?",
        "Ask for one practical outcome.",
      ],
      [
        "Details",
        "What is usually omitted from other explanations of this subject?",
        "Ask for specifics.",
      ],
      [
        "Proof",
        "Which examples or primary sources establish the main point?",
        "Record access and permission.",
      ],
    ],
  },
};

const id = () => Math.random().toString(36).slice(2, 10);

const blank = {
  brand: "",
  title: "",
  topic: "",
  format: "Comparison page",
  role: "Sales",
  person: "",
  reader: "",
  decision: "",
  known: "",
  unknown: "",
  artifacts: "",
  reviewer: "",
  quotePolicy: "Needs explicit approval",
  duration: 15,
  scheduled: "",
  interviewer: "",
  interviewDate: "",
  consent: "Not confirmed",
  questions: [],
  notes: {},
  evidence: [],
  approvals: {
    content: "Not requested",
    claims: "Not requested",
    quote: "Not requested",
  },
  nextAction: "",
  nextOwner: "",
  nextDate: "",
  meetingNotes: "",
};

const sample = {
  ...blank,
  brand: "RelayLedger (fictional example)",
  title: "Usage-based billing software vs spreadsheets",
  topic:
    "How finance leaders evaluate invoice adjustments, reconciliation controls, and auditability",
  format: "Comparison page",
  role: "Sales",
  person: "Jamie Ellis, Account Executive (fictional)",
  reader:
    "Finance directors at B2B SaaS companies moving beyond manual usage billing",
  decision:
    "Understand when spreadsheets stop being a defensible billing process and which controls to compare in software.",
  known:
    "Our sales team hears concerns about late adjustments, sign-off ownership and reconciling usage data before invoicing.",
  unknown:
    "Which approval step buyers find riskiest; whether they need a history of edits; what their current spreadsheet process costs in review time.",
  artifacts:
    "An anonymised buyer objection, an approved sample adjustment trail and any validated comparison of review time.",
  reviewer:
    "Product Marketing (claims); Sales Lead (call examples)",
  quotePolicy:
    "Anonymise buyer accounts; get explicit permission for verbatim quotes",
  duration: 20,
  scheduled: "",
  interviewer: "Content Manager",
  consent: "Not confirmed",
  notes: {},
  evidence: [
    {
      id: id(),
      claim: "Buyers ask who signs off late invoice adjustments",
      source: "Sales discovery notes — link still needed",
      owner: "Sales Lead",
      status: "Needs source",
      permission: "Internal use only",
    },
    {
      id: id(),
      claim: "An example adjustment audit trail can be shown",
      source:
        "Sample product walkthrough — Product Marketing to supply",
      owner: "Product Marketing",
      status: "Needs source",
      permission: "Approval pending",
    },
  ],
  approvals: {
    content: "Not requested",
    claims: "Not requested",
    quote: "Not requested",
  },
  nextAction:
    "Request anonymised discovery notes and approval-trail screenshot before outline sign-off.",
  nextOwner: "Content Manager",
  nextDate: "",
  meetingNotes:
    "Example only: no actual interview has taken place.",
};

const STEPS = ["Set up", "Interview plan", "Notes & evidence", "Review & export"];

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

const text = (v) => String(v ?? "").trim();

const md = (v) => String(v ?? "").replace(/\|/g, "\\|");

const qFrom = (role, format, duration) => {
  const r = BANK.roles[role] || BANK.roles.Other;
  const f = BANK.formats[format] || BANK.formats.Other;

  const points = [
    {
      type: "Context",
      title: "Set the scene",
      question:
        "Think of the last real example of this problem. Who was involved and what triggered it?",
      prompt: "Follow up: what happened next?",
    },
    ...r.map(([title, question, prompt]) => ({
      type: role,
      title,
      question,
      prompt,
    })),
    ...f.map(([title, question, prompt]) => ({
      type: format,
      title,
      question,
      prompt,
    })),
    {
      type: "Evidence",
      title: "Ask for proof",
      question:
        "Which specific example, document or number can we check before publishing this?",
      prompt: "Get the source owner and approval requirements.",
    },
    {
      type: "Close",
      title: "Check accuracy and permission",
      question:
        "What have we missed, what is uncertain, and which claims or quotations need your approval?",
      prompt: "Agree the follow-up owner and date.",
    },
  ];

  const selected =
    duration <= 15
      ? [
          points[0],
          points[1],
          points[2],
          points[4],
          points[5],
          points[7],
          points[8],
        ]
      : duration <= 20
      ? [points[0], ...points.slice(1, 7), points[7], points[8]]
      : points;

  return selected.map((p, i) => ({
    id: id(),
    ...p,
    enabled: true,
    minutes: i === 0 || i === selected.length - 1 ? 2 : 0,
  }));
};

function schedule(qs, duration) {
  const active = qs.filter((q) => q.enabled && text(q.question));
  if (!active.length) return [];

  const fixed = active.reduce(
    (s, q) => s + Math.max(0, Number(q.minutes) || 0),
    0
  );
  const flex = active.filter((q) => !(Number(q.minutes) > 0));
  const remaining = Math.max(0, duration - fixed);
  const base = flex.length
    ? Math.floor(remaining / flex.length)
    : 0;
  let spare = flex.length ? remaining - base * flex.length : 0;
  let cursor = 0;

  return active.map((q) => {
    let mins =
      Number(q.minutes) > 0
        ? Number(q.minutes)
        : base + (spare-- > 0 ? 1 : 0);
    if (!Number(q.minutes) && !flex.length) mins = 0;

    const entry = {
      ...q,
      start: cursor,
      end: cursor + mins,
      allocated: mins,
    };
    cursor += mins;
    return entry;
  });
}

const fmtMinute = (n) => `${String(n).padStart(2, "0")}:00`;

const clean = (s) => text(s) || "Not supplied";

function buildReport(d, agenda) {
  const lines = [
    `# SME Interview Brief — ${clean(d.title)}`,
    "",
    `Prepared for: ${clean(d.brand)}`,
    `Content format: ${d.format} | Expert: ${clean(d.person)} (${d.role})`,
    `Interviewer: ${clean(d.interviewer)} | Interview date: ${clean(
      d.interviewDate || d.scheduled
    )}`,
    `Duration: ${d.duration} minutes | Audience: ${clean(d.reader)}`,
    "",
    "## 1. What the article needs",
    `Topic: ${clean(d.topic)}`,
    `Reader decision: ${clean(d.decision)}`,
    `What we already know: ${clean(d.known)}`,
    `Gaps this interview must close: ${clean(d.unknown)}`,
    `Proof to request: ${clean(d.artifacts)}`,
    "",
    "## 2. Interview agenda",
    ...agenda.flatMap((q, i) => [
      `${i + 1}. [${fmtMinute(q.start)}–${fmtMinute(q.end)}] ${
        q.title
      } (${q.allocated} min)`,
      `   Question: ${q.question}`,
      `   Follow-up: ${q.prompt || "—"}`,
    ]),
    "",
    "## 3. Interview notes — not fact-checked",
    ...agenda.flatMap((q, i) => [
      `### ${i + 1}. ${q.title}`,
      `Question: ${q.question}`,
      `Notes: ${clean(d.notes[q.id]?.answer)}`,
      `Exact quote / timestamp: ${clean(d.notes[q.id]?.quote)}`,
      `Open issue: ${clean(d.notes[q.id]?.gap)}`,
    ]),
    `Additional notes: ${clean(d.meetingNotes)}`,
    "",
    "## 4. Evidence and permissions",
    ...(d.evidence.length
      ? d.evidence.map(
          (e, i) =>
            `${i + 1}. ${clean(e.claim)} | Source: ${clean(
              e.source
            )} | Owner: ${clean(e.owner)} | Verification: ${
              e.status
            } | Permission: ${e.permission}`
        )
      : ["No evidence records yet."]),
    "",
    "## 5. Handoff and sign-off",
    `Recording / consent: ${d.consent}`,
    `Quote policy: ${clean(d.quotePolicy)}`,
    `Reviewer: ${clean(d.reviewer)}`,
    `Editorial review: ${d.approvals.content} | Claim verification: ${d.approvals.claims} | Quote permission: ${d.approvals.quote}`,
    `Next action: ${clean(d.nextAction)} | Owner: ${clean(
      d.nextOwner
    )} | Due: ${clean(d.nextDate)}`,
    "",
    "## 6. Transcript-to-notes prompt (for an approved transcript)",
    `Use only the transcript supplied below to prepare writer-ready notes for a ${d.format.toLowerCase()} about ${clean(
      d.topic
    )}, written for ${clean(
      d.reader
    )}. Organise notes by buyer question and the interview agenda. For every factual claim, include the exact supporting quote and timestamp if supplied. Separate directly observed facts, the speaker's opinion, and your own open questions. Mark numerical results as unverified until matched to an approved source. List product limitations, missing proof, follow-up questions, potential quotes and permission needed. Do not invent events, names, statistics, links or citations. If an answer is missing, write “Not answered.” Do not claim the transcript is approved for publication.`,
    "[Paste a transcript you have permission to process here.]",
    "",
    "This document is a working interview record. Approval labels are user-entered, not independently verified by the tool.",
  ];
  return lines.join("\n");
}

const transcriptPrompt = (d) =>
  `You are preparing factual writer notes for a ${d.format.toLowerCase()} on ${clean(
    d.topic
  )} for ${clean(
    d.reader
  )}. The decision this content must support is: ${clean(
    d.decision
  )}. Known gaps: ${clean(
    d.unknown
  )}.\n\nUse ONLY the transcript below. Group answers by the questions asked. Include: (1) key takeaways; (2) precise facts with verbatim quotes and timestamps only where supplied; (3) product, plan and market limitations; (4) examples and their owners; (5) all unsupported claims and missing evidence; (6) publishable quotes requiring explicit approval; (7) follow-up questions, suggested owner and priority. Separate speaker opinion from verified facts. Never invent numbers, sources, timestamps or quotes. If a question was not answered, say so. Do not treat a transcript as proof of customer permission.\n\nTRANSCRIPT:\n[Paste an approved transcript here]`;

const CSV = (entries) =>
  entries
    .map((row) =>
      row
        .map((s) => `"${String(s ?? "").replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\r\n");

const download = (content, filename, type = "text/plain") => {
  const blob = new Blob(["\ufeff", content], {
    type: `${type};charset=utf-8`,
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const Icon = ({ name, size = 17 }) => {
  const path =
    {
      arrow: (
        <>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </>
      ),
      check: <path d="m4 12 5 5L20 6" />,
      plus: (
        <>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </>
      ),
      trash: (
        <>
          <path d="M4 7h16" />
          <path d="M10 11v6M14 11v6" />
          <path d="M6 7l1 13h10l1-13M9 7V4h6v3" />
        </>
      ),
      copy: (
        <>
          <rect x="8" y="8" width="12" height="12" rx="2" />
          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
        </>
      ),
      file: (
        <>
          <path d="M6 3h9l4 4v14H6z" />
          <path d="M15 3v5h4M9 13h7M9 17h7" />
        </>
      ),
      clock: (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v6l4 2" />
        </>
      ),
      note: (
        <>
          <path d="M5 4h14v16H5zM9 9h6M9 13h6M9 17h4" />
        </>
      ),
      alert: (
        <>
          <path d="M12 3 2 21h20L12 3Z" />
          <path d="M12 9v5M12 18h.01" />
        </>
      ),
      wand: (
        <>
          <path d="m4 20 12-12 4 4L8 24M16 3v3M21 8h-3M9 5l2 2" />
        </>
      ),
      chevron: <path d="m9 18 6-6-6-6" />,
    }[name] || <circle cx="12" cy="12" r="8" />;

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {path}
    </svg>
  );
};

export const faqs = [
  {
    question: "Does this record or transcribe interviews?",
    answer:
      "No. The tool creates a tailored interview agenda and a transcript-to-notes prompt. Use your approved recording and transcription process, with appropriate consent.",
  },
  {
    question: "Can I change the questions and interview length?",
    answer:
      "Yes. Choose 15, 20, 30 or 45 minutes; change roles and formats; then edit, remove, add and time questions yourself.",
  },
  {
    question: "How do I share the interview notes?",
    answer:
      "Copy or download the complete interview guide as Markdown, export evidence as CSV, or use your browser's Print / Save as PDF option.",
  },
];

const Field = ({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  rows = 3,
  help,
}) => (
  <label className="si-field">
    <span className="si-label">{label}</span>
    {multiline ? (
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Add details..."}
      />
    ) : (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Enter details..."}
      />
    )}
    {help && <small>{help}</small>}
  </label>
);

const Select = ({ label, value, onChange, options, help }) => (
  <label className="si-field">
    <span className="si-label">{label}</span>
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    {help && <small>{help}</small>}
  </label>
);

const Section = ({ eyebrow, title, desc, children }) => (
  <section className="si-panel">
    <div className="si-panel-head">
      <div>
        <div className="si-eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
        {desc && <p>{desc}</p>}
      </div>
    </div>
    {children}
  </section>
);

export default function SmeInterviewTemplate() {
  const [data, setData] = useState(() => ({
    ...blank,
    questions: qFrom(blank.role, blank.format, blank.duration),
  }));
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState("agenda");
  const [notice, setNotice] = useState("");
  const [advanced, setAdvanced] = useState(false);

  const update = (key, value) => {
    setData((d) => ({ ...d, [key]: value }));
    setNotice("");
  };

  const updateQ = (qid, key, value) => {
    setData((d) => ({
      ...d,
      questions: d.questions.map((q) =>
        q.id === qid ? { ...q, [key]: value } : q
      ),
    }));
    setNotice("");
  };

  const updateN = (qid, key, value) =>
    setData((d) => ({
      ...d,
      notes: { ...d.notes, [qid]: { ...d.notes[qid], [key]: value } },
    }));

  const updateE = (eid, key, value) =>
    setData((d) => ({
      ...d,
      evidence: d.evidence.map((e) =>
        e.id === eid ? { ...e, [key]: value } : e
      ),
    }));

  const regen = (
    role = data.role,
    format = data.format,
    duration = data.duration
  ) => {
    if (
      data.questions.some(
        (q) => data.notes[q.id]?.answer || data.notes[q.id]?.quote
      )
    ) {
      if (
        !window.confirm(
          "Replace the current questions? Existing notes will remain in memory but will no longer be attached to the new question list."
        )
      )
        return;
    }
    setData((d) => ({
      ...d,
      role,
      format,
      duration,
      questions: qFrom(role, format, duration),
      notes: {},
    }));
    setNotice("Interview questions updated for the selected role and format.");
  };

  const agenda = useMemo(
    () => schedule(data.questions, data.duration),
    [data.questions, data.duration]
  );

  const allocated = agenda.reduce((sum, q) => sum + q.allocated, 0);
  const completedNotes = agenda.filter((q) =>
    text(data.notes[q.id]?.answer)
  ).length;
  const missingSource = data.evidence.filter(
    (e) => e.status !== "Verified" || e.permission !== "Approved"
  ).length;

  const checks = [
    { ok: !!text(data.topic), label: "Interview topic specified" },
    {
      ok: !!text(data.reader) && !!text(data.decision),
      label: "Reader and decision recorded",
    },
    {
      ok: !!text(data.unknown),
      label: "Information gaps identified",
    },
    {
      ok: agenda.length >= 3,
      label: "Interview agenda contains at least three questions",
    },
    {
      ok: allocated === data.duration,
      label: `Agenda fits ${data.duration}-minute slot`,
    },
    { ok: !!text(data.reviewer), label: "Claims reviewer named" },
    {
      ok:
        data.consent === "Confirmed" ||
        data.consent === "No recording planned",
      label: "Recording consent status resolved",
    },
    {
      ok: missingSource === 0 && data.evidence.length > 0,
      label: "Evidence sources and permissions cleared",
    },
  ];

  const prepScore = checks.slice(0, 6).filter((c) => c.ok).length;
  const report = useMemo(() => buildReport(data, agenda), [data, agenda]);

  const safeFile =
    text(data.brand)
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase() || "interview";

  const copy = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      setNotice("Copied to clipboard.");
    } catch {
      setNotice("Clipboard unavailable. Use Download instead.");
    }
  };

  const startFresh = () => {
    setData({
      ...blank,
      questions: qFrom(blank.role, blank.format, blank.duration),
    });
    setStep(0);
    setNotice("Started a blank interview plan.");
  };

  const useExample = () => {
    setData({
      ...sample,
      questions: qFrom(sample.role, sample.format, sample.duration).map(
        (q, i) =>
          i === 3
            ? {
                ...q,
                question:
                  "When buyers compare spreadsheet approvals with software, what exact control do they ask to see?",
                prompt:
                  "Capture their words and a recent anonymised example.",
              }
            : q
      ),
      notes: {},
      evidence: sample.evidence.map((e) => ({ ...e, id: id() })),
    });
    setStep(0);
    setNotice(
      "Fictional RelayLedger example loaded. Proof and permissions remain intentionally unresolved."
    );
  };

  return (
    <div className="si-root">
      <style>{CSS}</style>

      <div className="si-layout">
        <main className="si-editor">
          <div className="si-toolbar">
            <div className="si-toolbar-label">
              <Icon name="note" /> INTERVIEW WORKSPACE
            </div>
            <div className="si-toolbar-actions">
              <button
                type="button"
                className="si-light"
                onClick={useExample}
              >
                Use example
              </button>
              <button
                type="button"
                className="si-ghost"
                onClick={startFresh}
              >
                Start fresh
              </button>
            </div>
          </div>

          <nav className="si-progress" aria-label="Interview template steps">
            {STEPS.map((s, i) => (
              <button
                type="button"
                key={s}
                className={`si-step ${step === i ? "active" : ""} ${
                  step > i ? "done" : ""
                }`}
                onClick={() => setStep(i)}
              >
                <span>
                  {step > i ? <Icon name="check" size={13} /> : i + 1}
                </span>
                <b>{s}</b>
              </button>
            ))}
          </nav>

          {step === 0 && (
            <>
              <Section
                eyebrow="01 / THE ASSIGNMENT"
                title="Start with the article, not the questions"
                desc="The role and format shape the questions automatically. Add the missing information so the interview has a clear purpose."
              >
                <div className="si-fields two">
                  <Field
                    label="Company or project"
                    value={data.brand}
                    onChange={(v) => update("brand", v)}
                    placeholder="e.g. RelayLedger"
                  />
                  <Field
                    label="Working article title"
                    value={data.title}
                    onChange={(v) => update("title", v)}
                    placeholder="e.g. Billing software vs spreadsheets"
                  />
                </div>

                <div className="si-fields two">
                  <Select
                    label="Interviewee's team / role"
                    value={data.role}
                    options={ROLES}
                    onChange={(v) => {
                      update("role", v);
                    }}
                  />
                  <Select
                    label="Content format"
                    value={data.format}
                    options={FORMATS}
                    onChange={(v) => update("format", v)}
                  />
                </div>

                <div className="si-fields two">
                  <Field
                    label="Interviewee name / position"
                    value={data.person}
                    onChange={(v) => update("person", v)}
                    placeholder="Name and job title"
                  />
                  <Field
                    label="Interviewer"
                    value={data.interviewer}
                    onChange={(v) => update("interviewer", v)}
                    placeholder="Marketing manager or writer"
                  />
                </div>

                <Field
                  label="What are we investigating?"
                  multiline
                  rows={2}
                  value={data.topic}
                  onChange={(v) => update("topic", v)}
                  placeholder="A particular buyer question or workflow—not just 'billing'"
                />

                <div className="si-fields two">
                  <Field
                    label="Who will read this?"
                    multiline
                    rows={2}
                    value={data.reader}
                    onChange={(v) => update("reader", v)}
                    placeholder="Role, company type and situation"
                  />
                  <Field
                    label="What decision should the piece help them make?"
                    multiline
                    rows={2}
                    value={data.decision}
                    onChange={(v) => update("decision", v)}
                    placeholder="What can they choose or do after reading?"
                  />
                </div>

                <div className="si-duration">
                  <span className="si-label">Interview length</span>
                  <div role="group" aria-label="Interview duration">
                    {DURATIONS.map((n) => (
                      <button
                        type="button"
                        key={n}
                        className={data.duration === n ? "selected" : ""}
                        onClick={() => update("duration", n)}
                      >
                        {n} min
                      </button>
                    ))}
                  </div>
                  <p>
                    Changing duration redistributes untimed questions. It
                    won't change a question's manually assigned minutes.
                  </p>
                </div>

                <div className="si-fields two">
                  <Field
                    label="What do we already know?"
                    multiline
                    rows={3}
                    value={data.known}
                    onChange={(v) => update("known", v)}
                    placeholder="Existing notes, established product facts, buyer language..."
                  />
                  <Field
                    label="What still needs an answer?"
                    multiline
                    rows={3}
                    value={data.unknown}
                    onChange={(v) => update("unknown", v)}
                    placeholder="Specific unknowns the expert can resolve"
                  />
                </div>

                <button
                  type="button"
                  className="si-primary si-wide"
                  onClick={() => {
                    regen(data.role, data.format, data.duration);
                    setStep(1);
                  }}
                >
                  Build my interview plan <Icon name="arrow" />
                </button>
              </Section>
            </>
          )}

          {step === 1 && (
            <>
              <Section
                eyebrow="02 / QUESTION DESIGN"
                title="Questions worth using the expert's time on"
                desc="Role-specific and format-specific questions are a starting point. Edit the words, add probes and prioritise the gaps that matter."
              >
                <div className="si-plan-summary">
                  <div>
                    <Icon name="clock" />
                    <strong>{data.duration}-minute interview</strong>
                    <span>
                      {agenda.length} questions · {allocated} minutes allocated
                    </span>
                  </div>
                  <button
                    type="button"
                    className="si-light"
                    onClick={() => regen()}
                  >
                    Rebuild question set
                  </button>
                </div>

                {allocated !== data.duration && (
                  <div className="si-warning">
                    <Icon name="alert" /> Your question timings total{" "}
                    {allocated} minutes. Adjust fixed minutes or the interview
                    length before using the script.
                  </div>
                )}

                <div className="si-questions">
                  {data.questions.map((q, i) => (
                    <article
                      className={`si-question ${
                        !q.enabled ? "muted" : ""
                      }`}
                      key={q.id}
                    >
                      <div className="si-question-top">
                        <span className="si-chip">
                          {String(i + 1).padStart(2, "0")} · {q.type}
                        </span>
                        <div className="si-inline">
                          <label className="si-mini-check">
                            <input
                              type="checkbox"
                              checked={q.enabled}
                              onChange={(e) =>
                                updateQ(
                                  q.id,
                                  "enabled",
                                  e.target.checked
                                )
                              }
                            />{" "}
                            Include
                          </label>
                          <button
                            aria-label={`Remove question ${i + 1}`}
                            type="button"
                            className="si-iconbtn"
                            onClick={() =>
                              setData((d) => ({
                                ...d,
                                questions: d.questions.filter(
                                  (x) => x.id !== q.id
                                ),
                              }))
                            }
                          >
                            <Icon name="trash" size={15} />
                          </button>
                        </div>
                      </div>

                      <div className="si-fields two">
                        <Field
                          label="Question label"
                          value={q.title}
                          onChange={(v) => updateQ(q.id, "title", v)}
                        />
                        <label className="si-field">
                          <span className="si-label">
                            Minutes (0 = automatic)
                          </span>
                          <input
                            min="0"
                            max="45"
                            type="number"
                            value={q.minutes}
                            onChange={(e) =>
                              updateQ(
                                q.id,
                                "minutes",
                                clamp(Number(e.target.value) || 0, 0, 45)
                              )
                            }
                          />
                        </label>
                      </div>

                      <Field
                        label="Main question"
                        multiline
                        rows={2}
                        value={q.question}
                        onChange={(v) =>
                          updateQ(q.id, "question", v)
                        }
                      />
                      <Field
                        label="Probe / what to ask them to show"
                        value={q.prompt}
                        onChange={(v) =>
                          updateQ(q.id, "prompt", v)
                        }
                      />
                    </article>
                  ))}
                </div>

                <button
                  type="button"
                  className="si-add"
                  onClick={() =>
                    setData((d) => ({
                      ...d,
                      questions: [
                        ...d.questions,
                        {
                          id: id(),
                          type: "Custom",
                          title: "My question",
                          question: "",
                          prompt: "",
                          enabled: true,
                          minutes: 0,
                        },
                      ],
                    }))
                  }
                >
                  <Icon name="plus" /> Add my own question
                </button>
              </Section>

              <Section
                eyebrow="INTERVIEW PREPARATION"
                title="Ask for something you can actually cite"
                desc="Keep proof requests and permission rules explicit so the writer doesn't need another meeting afterwards."
              >
                <Field
                  label="Documents, examples or numbers to request"
                  multiline
                  rows={3}
                  value={data.artifacts}
                  onChange={(v) => update("artifacts", v)}
                  placeholder="Named asset, source owner, date, and permitted use"
                />
                <div className="si-fields two">
                  <Field
                    label="Who signs off claims and quotes?"
                    value={data.reviewer}
                    onChange={(v) => update("reviewer", v)}
                  />
                  <Select
                    label="Quote / customer permission policy"
                    value={data.quotePolicy}
                    onChange={(v) => update("quotePolicy", v)}
                    options={[
                      "Needs explicit approval",
                      "Internal use only",
                      "Anonymise by default",
                      "Approved quotes only",
                    ]}
                  />
                </div>
              </Section>
            </>
          )}

          {step === 2 && (
            <>
              <Section
                eyebrow="03 / LIVE NOTES"
                title="Capture answers next to the question"
                desc="Use this during or after the conversation. Quotes and timestamps are separate from paraphrased notes so nothing is accidentally presented as a verbatim statement."
              >
                <div className="si-fields two">
                  <Field
                    label="Interview date"
                    value={data.interviewDate}
                    onChange={(v) => update("interviewDate", v)}
                    placeholder="e.g. 20 November 2026"
                  />
                  <Select
                    label="Recording / consent status"
                    value={data.consent}
                    onChange={(v) => update("consent", v)}
                    options={[
                      "Not confirmed",
                      "Confirmed",
                      "No recording planned",
                      "Declined",
                    ]}
                  />
                </div>

                <div className="si-progressline">
                  <span>
                    {completedNotes} of {agenda.length} question notes
                    captured
                  </span>
                  <div>
                    <i
                      style={{
                        width: `${
                          agenda.length
                            ? (100 * completedNotes) / agenda.length
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {agenda.map((q, i) => (
                  <article className="si-note" key={q.id}>
                    <div className="si-note-head">
                      <span className="si-chip">
                        {fmtMinute(q.start)}–{fmtMinute(q.end)}
                      </span>
                      <strong>
                        {i + 1}. {q.question}
                      </strong>
                    </div>

                    <Field
                      label="Answer / useful details"
                      multiline
                      rows={3}
                      value={data.notes[q.id]?.answer || ""}
                      onChange={(v) => updateN(q.id, "answer", v)}
                      placeholder="What the expert actually explained; distinguish fact from opinion"
                    />

                    <div className="si-fields two">
                      <Field
                        label="Exact quote and timestamp (if available)"
                        multiline
                        rows={2}
                        value={data.notes[q.id]?.quote || ""}
                        onChange={(v) => updateN(q.id, "quote", v)}
                        placeholder="Only copy verbatim words"
                      />
                      <Field
                        label="Unanswered question / follow-up"
                        multiline
                        rows={2}
                        value={data.notes[q.id]?.gap || ""}
                        onChange={(v) => updateN(q.id, "gap", v)}
                        placeholder="What still needs verifying?"
                      />
                    </div>
                  </article>
                ))}

                <Field
                  label="Other meeting notes"
                  multiline
                  rows={3}
                  value={data.meetingNotes}
                  onChange={(v) => update("meetingNotes", v)}
                />
              </Section>

              <Section
                eyebrow="EVIDENCE TRACKER"
                title="Separate a good quote from a verified claim"
                desc="The tool never validates evidence itself. You mark what has a source and what is approved for publication."
              >
                {data.evidence.map((e, i) => (
                  <article className="si-evidence" key={e.id}>
                    <div className="si-question-top">
                      <strong>Evidence {i + 1}</strong>
                      <button
                        type="button"
                        aria-label={`Remove evidence ${i + 1}`}
                        className="si-iconbtn"
                        onClick={() =>
                          setData((d) => ({
                            ...d,
                            evidence: d.evidence.filter(
                              (x) => x.id !== e.id
                            ),
                          }))
                        }
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    </div>

                    <Field
                      label="Claim, example or quoted result"
                      value={e.claim}
                      onChange={(v) => updateE(e.id, "claim", v)}
                    />

                    <div className="si-fields two">
                      <Field
                        label="Source / link / timestamp"
                        value={e.source}
                        onChange={(v) => updateE(e.id, "source", v)}
                      />
                      <Field
                        label="Who can verify it?"
                        value={e.owner}
                        onChange={(v) => updateE(e.id, "owner", v)}
                      />
                    </div>

                    <div className="si-fields two">
                      <Select
                        label="Verification status"
                        value={e.status}
                        onChange={(v) => updateE(e.id, "status", v)}
                        options={[
                          "Needs source",
                          "Under review",
                          "Verified",
                          "Not usable",
                        ]}
                      />
                      <Select
                        label="Publication permission"
                        value={e.permission}
                        onChange={(v) => updateE(e.id, "permission", v)}
                        options={[
                          "Approval pending",
                          "Internal use only",
                          "Approved",
                          "Not permitted",
                        ]}
                      />
                    </div>
                  </article>
                ))}

                <button
                  type="button"
                  className="si-add"
                  onClick={() =>
                    setData((d) => ({
                      ...d,
                      evidence: [
                        ...d.evidence,
                        {
                          id: id(),
                          claim: "",
                          source: "",
                          owner: "",
                          status: "Needs source",
                          permission: "Approval pending",
                        },
                      ],
                    }))
                  }
                >
                  <Icon name="plus" /> Add evidence item
                </button>
              </Section>
            </>
          )}

          {step === 3 && (
            <>
              <Section
                eyebrow="04 / HANDOFF"
                title="Make the next steps unambiguous"
                desc="This isn't an automated approval system. Statuses reflect what your team has recorded, not independent verification."
              >
                <div className="si-reviewgrid">
                  <div className="si-reviewbox">
                    <span>Interview preparation</span>
                    <strong>{prepScore}/6</strong>
                    <small>Core setup checks satisfied</small>
                  </div>
                  <div className="si-reviewbox">
                    <span>Questions with notes</span>
                    <strong>
                      {completedNotes}/{agenda.length}
                    </strong>
                    <small>Active interview questions</small>
                  </div>
                  <div className="si-reviewbox">
                    <span>Evidence needing attention</span>
                    <strong>{missingSource}</strong>
                    <small>Unverified or not approved</small>
                  </div>
                </div>

                <div className="si-checklist">
                  {checks.map((c, i) => (
                    <div key={i}>
                      <span
                        className={`si-checkmark ${
                          c.ok ? "ok" : "pending"
                        }`}
                      >
                        {c.ok ? <Icon name="check" size={13} /> : "!"}
                      </span>
                      {c.label}
                    </div>
                  ))}
                </div>

                <div className="si-fields two">
                  <Select
                    label="Editorial sign-off"
                    value={data.approvals.content}
                    onChange={(v) =>
                      setData((d) => ({
                        ...d,
                        approvals: { ...d.approvals, content: v },
                      }))
                    }
                    options={[
                      "Not requested",
                      "In review",
                      "Approved",
                      "Changes needed",
                    ]}
                  />
                  <Select
                    label="Product and claims sign-off"
                    value={data.approvals.claims}
                    onChange={(v) =>
                      setData((d) => ({
                        ...d,
                        approvals: { ...d.approvals, claims: v },
                      }))
                    }
                    options={[
                      "Not requested",
                      "In review",
                      "Approved",
                      "Changes needed",
                    ]}
                  />
                </div>

                <Select
                  label="Quote / customer permission sign-off"
                  value={data.approvals.quote}
                  onChange={(v) =>
                    setData((d) => ({
                      ...d,
                      approvals: { ...d.approvals, quote: v },
                    }))
                  }
                  options={[
                    "Not requested",
                    "In review",
                    "Approved",
                    "Changes needed",
                    "Not applicable",
                  ]}
                />

                <div className="si-fields two">
                  <Field
                    label="Next action"
                    multiline
                    rows={2}
                    value={data.nextAction}
                    onChange={(v) => update("nextAction", v)}
                    placeholder="e.g. Ask Product for approved permissions matrix"
                  />
                  <Field
                    label="Action owner"
                    value={data.nextOwner}
                    onChange={(v) => update("nextOwner", v)}
                  />
                </div>

                <Field
                  label="Due date"
                  value={data.nextDate}
                  onChange={(v) => update("nextDate", v)}
                  placeholder="e.g. 24 November 2026"
                />
              </Section>

              <Section
                eyebrow="EXPORT"
                title="A usable handoff, not just meeting notes"
                desc="The full document includes the agenda, every answer, evidence statuses, approvals, actions, and a transcript-processing prompt."
              >
                <div className="si-export">
                  <button type="button" onClick={() => copy(report)}>
                    <Icon name="copy" /> Copy full guide
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      download(
                        report,
                        `${safeFile}-sme-interview.md`,
                        "text/markdown"
                      )
                    }
                  >
                    <Icon name="file" /> Download Markdown
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      download(
                        CSV([
                          [
                            "Claim",
                            "Source",
                            "Owner",
                            "Verification",
                            "Permission",
                          ],
                          ...data.evidence.map((e) => [
                            e.claim,
                            e.source,
                            e.owner,
                            e.status,
                            e.permission,
                          ]),
                        ]),
                        `${safeFile}-evidence.csv`,
                        "text/csv"
                      )
                    }
                  >
                    <Icon name="file" /> Evidence CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                  >
                    <Icon name="file" /> Print / Save PDF
                  </button>
                </div>

                <button
                  type="button"
                  className="si-copy-prompt"
                  onClick={() => copy(transcriptPrompt(data))}
                >
                  <Icon name="copy" /> Copy transcript-to-notes prompt
                </button>

                <p className="si-smallprint">
                  Only paste interview transcripts into services approved by
                  your organisation and the participants. This tool does not
                  upload or process recordings.
                </p>
              </Section>
            </>
          )}

          <div className="si-footer-nav">
            <button
              type="button"
              className="si-light"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              Back
            </button>
            <span>
              Step {step + 1} of {STEPS.length}
            </span>
            {step < STEPS.length - 1 && (
              <button
                type="button"
                className="si-primary"
                onClick={() => setStep((s) => Math.min(3, s + 1))}
              >
                Continue <Icon name="arrow" />
              </button>
            )}
          </div>

          {notice && (
            <div role="status" className="si-toast">
              {notice}
            </div>
          )}
        </main>

        <aside className="si-preview">
          <div className="si-preview-sticky">
            <div className="si-preview-head">
              <div>
                <div className="si-eyebrow">LIVE PREVIEW</div>
                <h3>Interview handoff</h3>
              </div>
              <span className="si-preview-badge">Editable</span>
            </div>

            <div
              className="si-preview-tabs"
              role="tablist"
              aria-label="Preview content"
            >
              {[
                ["agenda", "Agenda"],
                ["notes", "Notes"],
                ["handoff", "Handoff"],
              ].map(([key, label]) => (
                <button
                  type="button"
                  key={key}
                  role="tab"
                  aria-selected={preview === key}
                  className={preview === key ? "active" : ""}
                  onClick={() => setPreview(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="si-paper">
              <div className="si-paper-kicker">
                GROWUP / INTERVIEW BRIEF
              </div>
              <h4>{data.title || "Untitled content assignment"}</h4>
              <p className="si-paper-sub">
                {data.brand || "Your company"} · {data.format}
              </p>
              <div className="si-paper-stat">
                <span>
                  <Icon name="clock" size={14} /> {data.duration} minutes
                </span>
                <span>{data.role} expert</span>
              </div>

              {preview === "agenda" && (
                <>
                  <div className="si-paper-section">QUESTIONS & TIMING</div>
                  {agenda.length ? (
                    agenda.map((q, i) => (
                      <div className="si-paper-item" key={q.id}>
                        <span>
                          {fmtMinute(q.start)}–{fmtMinute(q.end)}
                        </span>
                        <div>
                          <b>
                            {i + 1}. {q.title}
                          </b>
                          <p>{q.question}</p>
                          {q.prompt && <small>{q.prompt}</small>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Add questions to build the agenda.</p>
                  )}
                </>
              )}

              {preview === "notes" && (
                <>
                  <div className="si-paper-section">CAPTURED ANSWERS</div>
                  {agenda.map((q, i) => (
                    <div className="si-paper-item" key={q.id}>
                      <span>{i + 1}.</span>
                      <div>
                        <b>{q.title}</b>
                        <p>{data.notes[q.id]?.answer || "No notes yet"}</p>
                        {data.notes[q.id]?.quote && (
                          <small>
                            Quote: {data.notes[q.id].quote}
                          </small>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {preview === "handoff" && (
                <>
                  <div className="si-paper-section">
                    INTERVIEW OBJECTIVE
                  </div>
                  <p>
                    {data.decision ||
                      "Add the buyer decision in Setup."}
                  </p>
                  <div className="si-paper-section">
                    OPEN INFORMATION GAPS
                  </div>
                  <p>
                    {data.unknown ||
                      "Add the questions this interview needs to resolve."}
                  </p>
                  <div className="si-paper-section">EVIDENCE STATUS</div>
                  <p>
                    {data.evidence.length} evidence entries ·{" "}
                    {missingSource} requiring verification or permission
                  </p>
                  <div className="si-paper-section">NEXT ACTION</div>
                  <p>{data.nextAction || "No follow-up recorded."}</p>
                  <div className="si-paper-section">SIGN-OFF</div>
                  <p>
                    Editorial: {data.approvals.content}
                    <br />
                    Claims: {data.approvals.claims}
                    <br />
                    Quotes: {data.approvals.quote}
                  </p>
                </>
              )}
            </div>

            <div className="si-preview-bottom">
              <span>
                {agenda.length} questions · {completedNotes} answers captured
              </span>
              <button type="button" onClick={() => setStep(3)}>
                Review & export <Icon name="chevron" size={14} />
              </button>
            </div>
          </div>
        </aside>
      </div>

      <div className="si-print-only">
        <pre>{report}</pre>
      </div>
    </div>
  );
}

const CSS = `
.si-root {
  --si-teal: #167273;
  --si-dark: #011522;
  --si-muted: #5c7074;
  --si-line: #dbe7e4;
  --si-pale: #eef4f3;
  color: var(--si-dark);
  font-family: Montserrat, ui-sans-serif, system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 14px;
  line-height: 1.5;
}
.si-root * { box-sizing: border-box }
.si-root button,
.si-root input,
.si-root textarea,
.si-root select { font: inherit }
.si-root button {
  cursor: pointer;
  transition: background .16s, border-color .16s, transform .16s;
}
.si-root button:focus-visible,
.si-root input:focus-visible,
.si-root textarea:focus-visible,
.si-root select:focus-visible {
  outline: 3px solid #94cfcb;
  outline-offset: 2px;
}
.si-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.37fr) minmax(320px, .83fr);
  gap: 23px;
  align-items: start;
}
.si-editor { min-width: 0 }
.si-preview { min-width: 0 }
.si-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0 20px;
}
.si-toolbar-label {
  display: flex;
  align-items: center;
  gap: 7px;
  letter-spacing: 1.4px;
  font-size: 10px;
  font-weight: 800;
  color: var(--si-teal);
}
.si-toolbar-actions { display: flex; gap: 8px }
.si-light,
.si-ghost {
  border: 1px solid var(--si-line);
  background: #fff;
  color: var(--si-dark);
  border-radius: 9px;
  padding: 9px 12px;
  font-size: 12px;
  font-weight: 700;
}
.si-light:hover,
.si-ghost:hover { background: var(--si-pale) }
.si-ghost {
  background: transparent;
  border-color: transparent;
  color: var(--si-muted);
}
.si-progress {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 7px;
  margin-bottom: 16px;
}
.si-step {
  display: flex;
  align-items: center;
  gap: 7px;
  text-align: left;
  border: 1px solid var(--si-line);
  background: #fff;
  border-radius: 11px;
  padding: 12px 8px;
  font-size: 11px;
  color: #6d7f82;
  min-width: 0;
}
.si-step b {
  font-size: 11px;
  white-space: normal;
  font-weight: 700;
}
.si-step > span {
  flex: 0 0 23px;
  height: 23px;
  width: 23px;
  border-radius: 7px;
  background: #f0f4f4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
}
.si-step.active {
  border-color: #8bbbbb;
  background: #edf6f4;
  color: var(--si-teal);
}
.si-step.active > span,
.si-step.done > span {
  background: var(--si-teal);
  color: #fff;
}
.si-panel {
  background: #fff;
  border: 1px solid var(--si-line);
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 17px;
  box-shadow: 0 8px 28px rgba(2, 30, 35, .025);
}
.si-panel-head {
  margin-bottom: 23px;
  border-bottom: 1px solid #e9eeee;
  padding-bottom: 19px;
}
.si-eyebrow {
  font-size: 10px;
  color: var(--si-teal);
  font-weight: 850;
  letter-spacing: 1.5px;
  margin-bottom: 6px;
}
.si-panel h2 {
  font-size: 22px;
  letter-spacing: -.5px;
  line-height: 1.2;
  font-weight: 800;
  margin: 0 0 8px;
  color: var(--si-dark);
}
.si-panel-head p {
  color: var(--si-muted);
  max-width: 580px;
  font-size: 13px;
  margin: 0;
  line-height: 1.65;
}
.si-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
  margin-bottom: 16px;
}
.si-label {
  font-size: 12px;
  font-weight: 750;
  color: #253c42;
}
.si-field input,
.si-field textarea,
.si-field select {
  border: 1px solid #cfdddb;
  color: var(--si-dark);
  background: #fff;
  width: 100%;
  border-radius: 10px;
  padding: 11px 12px;
  line-height: 1.5;
  min-height: 42px;
  outline: none;
  font-size: 13px;
}
.si-field textarea {
  resize: vertical;
  min-height: 70px;
}
.si-field input::placeholder,
.si-field textarea::placeholder { color: #99a8aa }
.si-field input:hover,
.si-field textarea:hover,
.si-field select:hover { border-color: #9ab9b5 }
.si-field small {
  color: #78888a;
  line-height: 1.4;
}
.si-fields {
  display: grid;
  gap: 14px;
}
.si-fields.two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.si-duration { margin: 3px 0 22px }
.si-duration > div {
  display: flex;
  gap: 8px;
  margin: 9px 0;
}
.si-duration button {
  padding: 9px 15px;
  border: 1px solid var(--si-line);
  border-radius: 9px;
  background: #fff;
  color: #475f62;
  font-size: 12px;
  font-weight: 700;
}
.si-duration button.selected {
  border-color: var(--si-teal);
  background: var(--si-pale);
  color: var(--si-teal);
}
.si-duration p {
  font-size: 11px;
  color: var(--si-muted);
  margin: 0;
}
.si-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  background: var(--si-teal);
  border: 1px solid var(--si-teal);
  color: #fff;
  border-radius: 10px;
  padding: 12px 18px;
  font-size: 12px;
  font-weight: 800;
}
.si-primary:hover { background: #105c5d }
.si-primary.si-wide {
  width: 100%;
  margin-top: 6px;
}
.si-footer-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 18px 0 25px;
}
.si-footer-nav > span {
  color: var(--si-muted);
  font-size: 11px;
}
.si-footer-nav button:disabled {
  cursor: not-allowed;
  opacity: .45;
}
.si-plan-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background: var(--si-pale);
  border-radius: 12px;
  padding: 13px 15px;
  margin: 0 0 17px;
}
.si-plan-summary > div {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  color: var(--si-teal);
}
.si-plan-summary strong { font-size: 12px }
.si-plan-summary span {
  color: var(--si-muted);
  font-size: 11px;
}
.si-plan-summary button { background: #fff }
.si-warning {
  border: 1px solid #efc89b;
  border-radius: 10px;
  background: #fff8ed;
  color: #845d26;
  padding: 11px;
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 0 0 12px;
  font-size: 12px;
}
.si-question,
.si-note,
.si-evidence {
  border: 1px solid var(--si-line);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  background: #fff;
}
.si-question.muted { opacity: .57 }
.si-question-top,
.si-note-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}
.si-chip {
  display: inline-flex;
  align-items: center;
  padding: 5px 9px;
  background: var(--si-pale);
  color: var(--si-teal);
  border-radius: 6px;
  font-weight: 800;
  font-size: 10px;
  letter-spacing: .3px;
}
.si-inline {
  display: flex;
  gap: 7px;
  align-items: center;
}
.si-mini-check {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--si-muted);
}
.si-mini-check input { accent-color: var(--si-teal) }
.si-iconbtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: #fff;
  color: #8a5d5d;
  border: 1px solid var(--si-line);
  border-radius: 8px;
}
.si-iconbtn:hover {
  background: #fff1f1;
  border-color: #ebb;
}
.si-add {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px dashed #a5c7c3;
  border-radius: 10px;
  background: #f7fbfa;
  color: var(--si-teal);
  font-weight: 800;
  padding: 13px;
  font-size: 12px;
}
.si-add:hover { background: var(--si-pale) }
.si-note-head {
  justify-content: flex-start;
  align-items: start;
}
.si-note-head strong {
  font-size: 13px;
  line-height: 1.5;
}
.si-progressline {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 18px;
  color: var(--si-muted);
  font-size: 11px;
}
.si-progressline > div {
  height: 7px;
  background: var(--si-pale);
  border-radius: 9px;
  flex: 1;
  overflow: hidden;
}
.si-progressline i {
  display: block;
  height: 100%;
  background: var(--si-teal);
  border-radius: 9px;
}
.si-reviewgrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
  margin: 0 0 18px;
}
.si-reviewbox {
  background: var(--si-pale);
  border: 1px solid var(--si-line);
  padding: 15px 10px;
  border-radius: 11px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.si-reviewbox span,
.si-reviewbox small {
  font-size: 10px;
  color: var(--si-muted);
}
.si-reviewbox strong {
  font-size: 25px;
  color: var(--si-dark);
  line-height: 1.25;
}
.si-checklist {
  border: 1px solid var(--si-line);
  border-radius: 11px;
  margin: 0 0 22px;
  overflow: hidden;
}
.si-checklist > div {
  display: flex;
  gap: 9px;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid var(--si-line);
  font-size: 12px;
}
.si-checklist > div:last-child { border-bottom: 0 }
.si-checkmark {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 11px;
  flex: none;
}
.si-checkmark.ok {
  background: #e6f6ef;
  color: #16815f;
}
.si-checkmark.pending {
  background: #fff1df;
  color: #a37233;
}
.si-export {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.si-export button,
.si-copy-prompt {
  display: flex;
  gap: 9px;
  align-items: center;
  justify-content: center;
  background: #fff;
  color: var(--si-teal);
  padding: 12px 10px;
  border: 1px solid #bdd7d2;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 800;
}
.si-export button:hover,
.si-copy-prompt:hover { background: var(--si-pale) }
.si-copy-prompt {
  width: 100%;
  margin-top: 10px;
  background: var(--si-pale);
}
.si-smallprint {
  font-size: 11px;
  color: var(--si-muted);
  line-height: 1.6;
  margin-top: 15px;
}
.si-preview-sticky {
  position: sticky;
  top: 20px;
  border: 1px solid var(--si-line);
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 26, 31, .055);
}
.si-preview-head {
  padding: 19px 19px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.si-preview-head h3 {
  font-size: 17px;
  margin: 0;
  letter-spacing: -.3px;
}
.si-preview-badge {
  padding: 5px 9px;
  background: var(--si-pale);
  border-radius: 20px;
  color: var(--si-teal);
  font-size: 10px;
  font-weight: 800;
}
.si-preview-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 0 19px 16px;
  padding: 4px;
  background: #f0f5f4;
  border-radius: 10px;
  gap: 4px;
}
.si-preview-tabs button {
  border: 0;
  border-radius: 8px;
  background: transparent;
  padding: 8px 3px;
  font-size: 11px;
  color: var(--si-muted);
  font-weight: 800;
}
.si-preview-tabs button.active {
  background: #fff;
  box-shadow: 0 2px 7px rgba(0, 36, 40, .08);
  color: var(--si-teal);
}
.si-paper {
  margin: 0 19px 15px;
  padding: 22px 20px;
  max-height: 580px;
  overflow: auto;
  border: 1px solid #e2e9e8;
  border-radius: 10px;
  background: #fdfefe;
  box-shadow: 0 3px 16px rgba(0, 0, 0, .025);
}
.si-paper-kicker {
  color: var(--si-teal);
  font-size: 9px;
  letter-spacing: 1.5px;
  font-weight: 850;
}
.si-paper h4 {
  font-size: 19px;
  margin: 9px 0 5px;
  line-height: 1.25;
  overflow-wrap: anywhere;
}
.si-paper-sub {
  font-size: 11px;
  color: var(--si-muted);
  margin: 0 0 12px;
}
.si-paper-stat {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  color: var(--si-teal);
  font-weight: 750;
  font-size: 11px;
  margin-bottom: 20px;
}
.si-paper-stat span {
  display: flex;
  align-items: center;
  gap: 5px;
}
.si-paper-section {
  border-top: 1px solid var(--si-line);
  margin: 18px 0 9px;
  padding-top: 15px;
  letter-spacing: 1px;
  color: var(--si-muted);
  font-size: 9px;
  font-weight: 850;
}
.si-paper-item {
  display: grid;
  grid-template-columns: 67px 1fr;
  gap: 9px;
  padding: 9px 0;
  border-bottom: 1px solid #edf1f0;
}
.si-paper-item > span {
  font-size: 9px;
  color: var(--si-teal);
  font-weight: 800;
  padding-top: 3px;
}
.si-paper-item b { font-size: 11px }
.si-paper-item p,
.si-paper > p {
  font-size: 11px;
  line-height: 1.6;
  margin: 3px 0;
  color: #3c5357;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
.si-paper-item small {
  font-size: 10px;
  color: #76878a;
  line-height: 1.45;
  display: block;
}
.si-preview-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 19px;
  border-top: 1px solid var(--si-line);
  gap: 8px;
}
.si-preview-bottom span {
  font-size: 10px;
  color: var(--si-muted);
}
.si-preview-bottom button {
  border: 0;
  background: transparent;
  color: var(--si-teal);
  display: flex;
  align-items: center;
  font-size: 11px;
  font-weight: 800;
  gap: 3px;
}
.si-toast {
  position: sticky;
  bottom: 12px;
  margin: 10px auto;
  background: var(--si-dark);
  color: #fff;
  border-radius: 9px;
  padding: 10px 14px;
  text-align: center;
  font-size: 12px;
  max-width: max-content;
  z-index: 5;
}
.si-print-only { display: none }
@media (max-width: 1080px) {
  .si-layout { grid-template-columns: minmax(0, 1fr) }
  .si-preview-sticky { position: static }
  .si-paper { max-height: 420px }
}
@media (max-width: 640px) {
  .si-panel { padding: 17px }
  .si-panel h2 { font-size: 19px }
  .si-fields.two,
  .si-export { grid-template-columns: 1fr }
  .si-progress { grid-template-columns: repeat(2, 1fr) }
  .si-toolbar { flex-direction: column; align-items: stretch }
  .si-toolbar-actions { justify-content: space-between }
  .si-reviewgrid { grid-template-columns: repeat(3, 1fr) }
  .si-reviewbox strong { font-size: 20px }
  .si-plan-summary { align-items: start; flex-direction: column }
  .si-note-head { flex-direction: column }
  .si-paper { padding: 15px }
  .si-paper-item { grid-template-columns: 55px 1fr }
}
@media print {
  body * { visibility: hidden !important }
  .si-root .si-print-only,
  .si-root .si-print-only * { visibility: visible !important }
  .si-root .si-print-only {
    display: block !important;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    color: #111;
  }
  .si-root .si-print-only pre {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    font: 11pt/1.5 Georgia, serif;
  }
  .si-layout { display: none !important }
  @page { size: A4; margin: 18mm }
}
`;