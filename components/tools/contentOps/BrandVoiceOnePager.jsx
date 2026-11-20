"use client";

import React, { useMemo, useState } from "react";

/**
 * GrowUp — Brand Writing Guidelines
 * Standalone React/Next.js client component. No external dependencies.
 * Replace the old <Workspace spec={spec} /> implementation with this file.
 */

const EMPTY_EXAMPLE = () => ({
  before: "",
  after: "",
  why: "",
  category: "Clarity",
});

const EXAMPLE = {
  brand: "RelayLedger",
  product: "A fictional B2B accounts payable platform for finance teams",
  audience:
    "Finance managers, controllers and operations leads at growing B2B companies",
  writerContext:
    "Comparison pages, product explainers, implementation guides and email nurture content",
  owner: "Head of Marketing",
  updated: "2026-11-20",
  voiceSummary:
    "Precise, calm and useful. Write like a knowledgeable colleague explaining an operational task, not a software advertisement.",
  perspective: "you",
  locale: "British English",
  reading:
    "Short sentences where possible. Use headings that describe the task. Explain finance terms on first use.",
  principles: [
    {
      title: "Lead with the buyer's task",
      detail:
        "Start with what the finance team needs to complete, then show how the workflow works.",
    },
    {
      title: "Use specific nouns and verbs",
      detail:
        "Name the report, approval, data field or action rather than saying ‘solution’ or ‘optimise’.",
    },
    {
      title: "Make claims verifiable",
      detail:
        "Attach a source to numbers, integrations, plan limits and customer outcomes before publishing.",
    },
  ],
  terms: [
    {
      avoid: "seamless",
      use: "describe the steps or integration requirements",
      note: "Don't imply zero setup.",
    },
    {
      avoid: "leverage",
      use: "use",
      note: "Prefer a natural verb.",
    },
    {
      avoid: "powerful solution",
      use: "name the feature or report",
      note: "Specify what the user gets.",
    },
    {
      avoid: "revolutionary",
      use: "omit unless supported by evidence",
      note: "Avoid unverifiable superlatives.",
    },
  ],
  claims: {
    capabilities:
      "Check every feature statement against the current product documentation. Never imply a feature is available on all plans without verification.",
    integrations:
      "Only name an integration if it appears on the approved integrations list. Describe whether the connection is native, via API or third-party automation.",
    metrics:
      "Use customer results only with a named customer, approved number, timeframe and a link to the original case study. No blanket savings claims.",
    pricing:
      "Link to the current pricing page. State the currency, billing basis and plan where relevant; do not invent plan limits.",
    prohibited:
      "No ‘guaranteed ROI’, ‘100% accurate’, ‘all customers’, ‘instant setup’ or ‘best-in-class’ without documented support.",
    evidence:
      "Approved product docs, pricing page, integration directory, reviewed customer case studies and a named internal approver.",
    approver:
      "Head of Product for capabilities and integrations; Head of Marketing for tone and final publication.",
  },
  examples: [
    {
      category: "Headlines",
      before: "Unlock unprecedented efficiency in accounts payable.",
      after: "Review supplier invoices in one queue.",
      why: "Names the workflow instead of making a vague promise.",
    },
    {
      category: "Features",
      before: "Leverage our powerful platform to streamline operations.",
      after:
        "Use the approvals dashboard to assign an invoice to the right reviewer.",
      why: "Specifies the action and the feature.",
    },
    {
      category: "Integrations",
      before: "Seamlessly connects with all your tools.",
      after:
        "Check the integrations directory for supported accounting systems and setup requirements.",
      why: "Avoids claiming unsupported compatibility or effortless setup.",
    },
    {
      category: "Benefits",
      before: "Transform the way your team works forever.",
      after: "Keep invoice comments, documents and approvals together.",
      why: "Describes a practical change without hyperbole.",
    },
    {
      category: "Product claims",
      before: "Our AI eliminates every invoice error.",
      after: "Use validation flags to spot missing fields before approval.",
      why: "Doesn't promise perfect accuracy.",
    },
    {
      category: "Support",
      before: "Enjoy best-in-class customer support.",
      after:
        "Check your plan for its included support channels and response commitments.",
      why: "Directs readers to verifiable terms.",
    },
    {
      category: "Results",
      before: "Every finance team saves hours each week.",
      after:
        "In the approved case study, the named team reported the time saved over the stated period.",
      why: "Requires customer-specific evidence; replace with sourced numbers before publication.",
    },
    {
      category: "Clarity",
      before:
        "It is important to note that users have the ability to export reports.",
      after: "You can export the report.",
      why: "Removes an unnecessary introduction and passive phrasing.",
    },
    {
      category: "Calls to action",
      before: "Book a call to learn more about our solution.",
      after: "Book a 20-minute walkthrough of invoice approvals.",
      why: "Sets a specific expectation for the next step.",
    },
    {
      category: "Comparisons",
      before: "We're better than every competitor on the market.",
      after:
        "Compare approval rules, integrations and pricing before choosing a platform.",
      why: "Gives buyers useful evaluation criteria rather than an unsupported ranking.",
    },
  ],
  checklist: [
    "The opening sentence names a buyer problem or task.",
    "Generic promotional phrases have been replaced with specific language.",
    "Feature, integration and pricing claims have an approved source.",
    "Numbers and customer outcomes have attribution and a timeframe.",
    "Headings tell readers what each section helps them do.",
    "The CTA explains what will happen next.",
  ],
};

const EMPTY = {
  brand: "",
  product: "",
  audience: "",
  writerContext: "",
  owner: "",
  updated: "",
  voiceSummary: "",
  perspective: "you",
  locale: "British English",
  reading: "",
  principles: [{ title: "", detail: "" }],
  terms: [{ avoid: "", use: "", note: "" }],
  claims: {
    capabilities: "",
    integrations: "",
    metrics: "",
    pricing: "",
    prohibited: "",
    evidence: "",
    approver: "",
  },
  examples: Array.from({ length: 10 }, EMPTY_EXAMPLE),
  checklist: [""],
};

const STEPS = [
  { key: "identity", title: "Brand & audience", kicker: "01" },
  { key: "voice", title: "Writing rules", kicker: "02" },
  { key: "language", title: "Words & claims", kicker: "03" },
  { key: "examples", title: "Sentence examples", kicker: "04" },
  { key: "review", title: "Review & export", kicker: "05" },
];

const CATEGORIES = [
  "Clarity",
  "Headlines",
  "Features",
  "Benefits",
  "Integrations",
  "Product claims",
  "Results",
  "Support",
  "Calls to action",
  "Comparisons",
  "Other",
];

const clone = (data) => JSON.parse(JSON.stringify(data));
const filled = (s) => String(s ?? "").trim().length > 0;

const esc = (s) =>
  String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const today = () => new Date().toISOString().slice(0, 10);

function Icon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const paths = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    left: (
      <>
        <path d="M19 12H5" />
        <path d="m11 18-6-6 6-6" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
      </>
    ),
    print: (
      <>
        <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <path d="M6 14h12v7H6z" />
      </>
    ),
    file: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6M8 13h8M8 17h8" />
      </>
    ),
    reset: (
      <>
        <path d="M3 11a9 9 0 1 1 2.6 6.4" />
        <path d="M3 4v7h7" />
      </>
    ),
    alert: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 7v6M12 17h.01" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  };

  return <svg {...common}>{paths[name] || paths.file}</svg>;
}

function Field({
  label,
  hint,
  value,
  onChange,
  rows = 1,
  placeholder = "",
  required = false,
}) {
  const props = {
    value: value ?? "",
    onChange: (e) => onChange(e.target.value),
    placeholder,
    className: "bwg-input",
    "aria-label": label,
  };

  return (
    <label className="bwg-field">
      <span className="bwg-label">
        {label}
        {required && <span className="bwg-required"> *</span>}
      </span>
      {hint && <span className="bwg-hint">{hint}</span>}
      {rows > 1 ? (
        <textarea {...props} rows={rows} />
      ) : (
        <input {...props} />
      )}
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="bwg-field">
      <span className="bwg-label">{label}</span>
      <select
        className="bwg-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((x) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </select>
    </label>
  );
}

function Stat({ value, label }) {
  return (
    <div className="bwg-stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="bwg-section-heading">
      <div className="bwg-eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function EmptyLine({ children }) {
  return <p className="bwg-empty">{children}</p>;
}

export const faqs = [
  {
    question: "Can I share this with freelancers and agencies?",
    answer:
      "Yes. Complete the guide, then copy the document or print it as a PDF to send to any external or internal writer.",
  },
  {
    question: "Do I have to write exactly ten examples?",
    answer:
      "No. Ten is a useful starting point; you can add or remove examples. Before-and-after edits are usually more actionable than adjectives alone.",
  },
  {
    question: "Does this check whether my product claims are accurate?",
    answer:
      "No. This is a documentation tool. Confirm claims with your internal sources and approvers before publishing.",
  },
  {
    question: "Where is my information stored?",
    answer:
      "This version keeps entries in the current page state. It does not send your entries to a server. Copy or export the guide before leaving or reloading.",
  },
];

export default function BrandWritingGuidelines() {
  const [data, setData] = useState(() => clone(EXAMPLE));
  const [active, setActive] = useState("identity");
  const [previewTab, setPreviewTab] = useState("guide");
  const [notice, setNotice] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [showFaq, setShowFaq] = useState(-1);

  const update = (key, value) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const updateClaim = (key, value) =>
    setData((prev) => ({
      ...prev,
      claims: { ...prev.claims, [key]: value },
    }));

  const updateRow = (key, index, field, value) =>
    setData((prev) => ({
      ...prev,
      [key]: prev[key].map((r, i) =>
        i === index ? { ...r, [field]: value } : r
      ),
    }));

  const appendRow = (key, defaultItem) =>
    setData((prev) => ({
      ...prev,
      [key]: [...prev[key], defaultItem],
    }));

  const deleteRow = (key, index) =>
    setData((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));

  const completeExamples = data.examples.filter(
    (r) => filled(r.before) && filled(r.after)
  ).length;

  const completePrinciples = data.principles.filter(
    (r) => filled(r.title) && filled(r.detail)
  ).length;

  const completeTerms = data.terms.filter(
    (r) => filled(r.avoid) && filled(r.use)
  ).length;

  const claimCount = Object.values(data.claims).filter(filled).length;

  const checks = [
    filled(data.brand),
    filled(data.audience),
    filled(data.voiceSummary),
    completePrinciples >= 2,
    completeTerms >= 2,
    claimCount >= 4,
    completeExamples >= 5,
  ];

  const completeness = Math.round(
    (checks.filter(Boolean).length / checks.length) * 100
  );

  const missing = [
    !filled(data.brand) && "Add a brand name",
    !filled(data.audience) && "Identify your audience",
    !filled(data.voiceSummary) && "Write a voice summary",
    completePrinciples < 2 && "Add at least two complete writing principles",
    completeTerms < 2 && "Add at least two language replacements",
    claimCount < 4 && "Complete at least four claim policy sections",
    completeExamples < 5 && "Complete at least five before-and-after examples",
  ].filter(Boolean);

  const stepIndex = STEPS.findIndex((x) => x.key === active);
  const notify = (message) => {
    setNotice(message);
  };

  const buildText = useMemo(() => {
    const lines = [
      `${data.brand || "Brand"} — Brand Writing Guidelines`,
      `Owner: ${data.owner || "Not specified"} | Updated: ${
        data.updated || "Not specified"
      }`,
      "",
      "01 / WHO WE WRITE FOR",
      `Product: ${data.product || "Not specified"}`,
      `Audience: ${data.audience || "Not specified"}`,
      `Typical content: ${data.writerContext || "Not specified"}`,
      "",
      "02 / BRAND VOICE",
      data.voiceSummary || "No voice summary supplied.",
      `Point of view: ${data.perspective}`,
      `Language: ${data.locale}`,
      `Writing conventions: ${data.reading || "Not specified"}`,
      "",
      "03 / WRITING PRINCIPLES",
      ...data.principles
        .filter((x) => filled(x.title) || filled(x.detail))
        .map((x, i) => `${i + 1}. ${x.title}\n   ${x.detail}`),
      "",
      "04 / WORDS TO REPLACE",
      ...data.terms
        .filter((x) => filled(x.avoid) || filled(x.use))
        .map(
          (x) =>
            `Avoid: ${x.avoid}\nUse: ${x.use}\nReason: ${x.note || "—"}`
        ),
      "",
      "05 / CLAIMS AND APPROVALS",
      ...Object.entries({
        capabilities: "Features and capabilities",
        integrations: "Integrations",
        metrics: "Results and statistics",
        pricing: "Pricing and plans",
        prohibited: "Claims to avoid",
        evidence: "Approved evidence sources",
        approver: "Approval owners",
      }).map(
        ([key, label]) =>
          `${label}: ${data.claims[key] || "Not specified"}`
      ),
      "",
      "06 / BEFORE → AFTER EXAMPLES",
      ...data.examples
        .filter((r) => filled(r.before) || filled(r.after))
        .map(
          (r, i) =>
            `${i + 1}. [${r.category}]\nBefore: ${r.before}\nAfter: ${
              r.after
            }\nWhy: ${r.why || "Not specified"}`
        ),
      "",
      "07 / PRE-PUBLISHING CHECKLIST",
      ...data.checklist.filter(filled).map((x) => `☐ ${x}`),
      "",
      "Note: Verify all external-facing product claims and numbers before publication.",
    ];
    return lines.join("\n");
  }, [data]);

  async function copyGuide() {
    try {
      await navigator.clipboard.writeText(buildText);
      notify("Guidelines copied to clipboard.");
    } catch {
      notify(
        "Copy wasn't available in this browser. Use Print / PDF instead."
      );
    }
  }

  function exportMarkdown() {
    const md =
      `# ${data.brand || "Brand"} — Brand Writing Guidelines\n\n` +
      buildText.split("\n").slice(1).join("\n");

    const blob = new Blob([md], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(data.brand || "brand")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}-writing-guidelines.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    notify("Markdown file downloaded.");
  }

  function printGuide() {
    setActive("review");
    setPreviewTab("guide");
    window.setTimeout(() => window.print(), 60);
  }

  function loadExample() {
    setData(clone(EXAMPLE));
    setActive("identity");
    setNotice(
      "Illustrative B2B SaaS example loaded. Replace it with your own verified details."
    );
    setConfirmReset(false);
  }

  function startFresh() {
    setData({ ...clone(EMPTY), updated: today() });
    setActive("identity");
    setNotice("Blank guide started. Your previous entries were replaced.");
    setConfirmReset(false);
  }

  return (
    <div className="bwg-root">
      <style>{CSS}</style>

      {/* TOPLINE */}
      

      <div className="bwg-shell">
        {/* STEP NAV */}
        <nav className="bwg-steps" aria-label="Tool steps">
          {STEPS.map((step, i) => (
            <button
              type="button"
              key={step.key}
              onClick={() => setActive(step.key)}
              className={`bwg-step ${
                active === step.key ? "active" : ""
              }`}
              aria-current={
                active === step.key ? "step" : undefined
              }
            >
              <span className="bwg-step-number">{i + 1}</span>
              <span>{step.title}</span>
            </button>
          ))}
        </nav>

        {/* TOOLBAR */}
        <div className="bwg-toolbar">
          <div className="bwg-toolbar-caption">
            BUILD YOUR GUIDELINES <span>·</span> STEP {stepIndex + 1} OF{" "}
            {STEPS.length}
          </div>
          <div className="bwg-tool-actions">
            <button className="bwg-link-btn" onClick={loadExample}>
              <Icon name="reset" size={15} /> Use example
            </button>
            <button
              className="bwg-link-btn"
              onClick={() => setConfirmReset((v) => !v)}
            >
              <Icon name="plus" size={15} /> Start fresh
            </button>
          </div>
        </div>

        {confirmReset && (
          <div className="bwg-confirm">
            <span>
              Start a blank guide? This will replace your current entries.
            </span>
            <div>
              <button
                className="bwg-btn bwg-outline"
                onClick={() => setConfirmReset(false)}
              >
                Cancel
              </button>
              <button className="bwg-btn bwg-danger" onClick={startFresh}>
                Replace entries
              </button>
            </div>
          </div>
        )}

        {notice && (
          <div className="bwg-notice" role="status">
            <Icon name="check" size={15} />
            {notice}
            <button onClick={() => setNotice("")} aria-label="Dismiss notice">
              ×
            </button>
          </div>
        )}

        <div className="bwg-layout">
          {/* EDITOR */}
          <main className="bwg-editor">
            {active === "identity" && (
              <>
                <SectionHeading
                  eyebrow="01 / THE CONTEXT"
                  title="Who are we writing for?"
                  description="Give every writer the same starting point: what you sell, who buys it and which work this guide applies to."
                />

                <div className="bwg-two">
                  <Field
                    label="Brand / company"
                    value={data.brand}
                    onChange={(v) => update("brand", v)}
                    placeholder="e.g. RelayLedger"
                    required
                  />
                  <Field
                    label="Document owner"
                    value={data.owner}
                    onChange={(v) => update("owner", v)}
                    placeholder="e.g. Head of Marketing"
                  />
                </div>

                <Field
                  label="Product in one sentence"
                  value={data.product}
                  onChange={(v) => update("product", v)}
                  placeholder="What does the product actually do?"
                  rows={2}
                />

                <Field
                  label="Primary audience"
                  hint="Roles, company types and buyer maturity — not just 'everyone'."
                  value={data.audience}
                  onChange={(v) => update("audience", v)}
                  rows={2}
                  placeholder="e.g. Finance controllers at 100–1,000 person B2B companies"
                  required
                />

                <Field
                  label="Where these guidelines apply"
                  value={data.writerContext}
                  onChange={(v) => update("writerContext", v)}
                  rows={2}
                  placeholder="e.g. SEO articles, comparison pages, landing pages and email"
                />

                <Field
                  label="Last reviewed"
                  value={data.updated}
                  onChange={(v) => update("updated", v)}
                  placeholder="YYYY-MM-DD"
                />

                <div className="bwg-tip">
                  <Icon name="alert" size={17} />
                  <span>
                    <strong>Useful distinction:</strong> A content writer
                    doesn't need your entire company history. They need the
                    product, reader and job the content must perform.
                  </span>
                </div>
              </>
            )}

            {active === "voice" && (
              <>
                <SectionHeading
                  eyebrow="02 / THE HOUSE STYLE"
                  title="How should your brand sound?"
                  description="Replace vague adjectives like ‘professional’ with practical instructions a writer can follow while editing."
                />

                <Field
                  label="Voice summary"
                  value={data.voiceSummary}
                  onChange={(v) => update("voiceSummary", v)}
                  rows={3}
                  hint="2–3 sentences describing the actual writing style."
                  required
                  placeholder="e.g. Plain-spoken, precise, commercially aware..."
                />

                <div className="bwg-two">
                  <SelectField
                    label="Default point of view"
                    value={data.perspective}
                    onChange={(v) => update("perspective", v)}
                    options={["you", "we", "third person"]}
                  />
                  <SelectField
                    label="Language convention"
                    value={data.locale}
                    onChange={(v) => update("locale", v)}
                    options={[
                      "British English",
                      "American English",
                      "International English",
                      "Other / defined below",
                    ]}
                  />
                </div>

                <Field
                  label="Sentence, structure and formatting rules"
                  value={data.reading}
                  onChange={(v) => update("reading", v)}
                  rows={3}
                  placeholder="e.g. Use sentence-case headings. Explain acronyms once. Keep paragraphs under four lines."
                />

                <div className="bwg-subhead">
                  <div>
                    <h3>Writing principles</h3>
                    <p>
                      Three or four memorable rules work better than a page
                      of adjectives.
                    </p>
                  </div>
                  <span className="bwg-count">
                    {completePrinciples} complete
                  </span>
                </div>

                {data.principles.map((r, i) => (
                  <div className="bwg-repeat" key={i}>
                    <div className="bwg-repeat-head">
                      <strong>
                        PRINCIPLE {String(i + 1).padStart(2, "0")}
                      </strong>
                      <button
                        className="bwg-icon-btn"
                        onClick={() => deleteRow("principles", i)}
                        aria-label={`Remove principle ${i + 1}`}
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    </div>

                    <Field
                      label="Rule"
                      value={r.title}
                      onChange={(v) => updateRow("principles", i, "title", v)}
                      placeholder="e.g. Lead with the buyer's task"
                    />

                    <Field
                      label="What this means in practice"
                      value={r.detail}
                      onChange={(v) =>
                        updateRow("principles", i, "detail", v)
                      }
                      rows={2}
                      placeholder="Explain how to apply the rule to a real draft."
                    />
                  </div>
                ))}

                <button
                  className="bwg-add"
                  onClick={() =>
                    appendRow("principles", { title: "", detail: "" })
                  }
                >
                  <Icon name="plus" size={16} /> Add writing principle
                </button>
              </>
            )}

            {active === "language" && (
              <>
                <SectionHeading
                  eyebrow="03 / EDITORIAL GUARDRAILS"
                  title="What can writers say?"
                  description="Make prohibited language and product claims explicit, so fewer inaccuracies reach the approval stage."
                />

                <div className="bwg-subhead">
                  <div>
                    <h3>Words and preferred replacements</h3>
                    <p>Give an alternative, not just a blacklist.</p>
                  </div>
                  <span className="bwg-count">
                    {completeTerms} replacements
                  </span>
                </div>

                {data.terms.map((r, i) => (
                  <div className="bwg-repeat" key={i}>
                    <div className="bwg-repeat-head">
                      <strong>
                        LANGUAGE RULE {String(i + 1).padStart(2, "0")}
                      </strong>
                      <button
                        className="bwg-icon-btn"
                        onClick={() => deleteRow("terms", i)}
                        aria-label={`Remove language rule ${i + 1}`}
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    </div>

                    <div className="bwg-two">
                      <Field
                        label="Avoid saying"
                        value={r.avoid}
                        onChange={(v) => updateRow("terms", i, "avoid", v)}
                        placeholder="e.g. seamless"
                      />
                      <Field
                        label="Say this instead"
                        value={r.use}
                        onChange={(v) => updateRow("terms", i, "use", v)}
                        placeholder="e.g. Explain the setup steps"
                      />
                    </div>

                    <Field
                      label="Reason or exception (optional)"
                      value={r.note}
                      onChange={(v) => updateRow("terms", i, "note", v)}
                      placeholder="Why this matters"
                    />
                  </div>
                ))}

                <button
                  className="bwg-add"
                  onClick={() =>
                    appendRow("terms", { avoid: "", use: "", note: "" })
                  }
                >
                  <Icon name="plus" size={16} /> Add phrase replacement
                </button>

                <div className="bwg-rule" />

                <div className="bwg-subhead">
                  <div>
                    <h3>Product claims & approvals</h3>
                    <p>Set evidence standards before anyone drafts or publishes.</p>
                  </div>
                  <span className="bwg-count">
                    {claimCount} / 7 complete
                  </span>
                </div>

                {[
                  [
                    "capabilities",
                    "Features and capabilities",
                    "When can a writer say a feature exists or is available?",
                  ],
                  [
                    "integrations",
                    "Integrations",
                    "What must they check before naming an integration?",
                  ],
                  [
                    "metrics",
                    "Customer outcomes and statistics",
                    "How should results, percentages and savings be sourced?",
                  ],
                  [
                    "pricing",
                    "Pricing and plan limits",
                    "Where should pricing details come from?",
                  ],
                  [
                    "prohibited",
                    "Claims that need to be avoided",
                    "List absolute claims, guarantees and unsupported superlatives.",
                  ],
                  [
                    "evidence",
                    "Approved sources of truth",
                    "Link or name your product docs, pricing pages and approved case studies.",
                  ],
                  [
                    "approver",
                    "Who verifies product claims?",
                    "Name the person or function responsible for sign-off.",
                  ],
                ].map(([key, label, hint]) => (
                  <Field
                    key={key}
                    label={label}
                    hint={hint}
                    value={data.claims[key]}
                    onChange={(v) => updateClaim(key, v)}
                    rows={2}
                  />
                ))}
              </>
            )}

            {active === "examples" && (
              <>
                <SectionHeading
                  eyebrow="04 / SHOW, DON'T JUST TELL"
                  title="Show writers the exact edit"
                  description="Before-and-after examples are the most useful part of the guide. Use sentences from your own marketing copy where possible."
                />

                <div className="bwg-example-progress">
                  <div>
                    <strong>
                      {completeExamples} / {data.examples.length}
                    </strong>{" "}
                    complete examples
                  </div>
                  <div className="bwg-meter">
                    <div
                      style={{
                        width: `${
                          data.examples.length
                            ? (100 * completeExamples) / data.examples.length
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {data.examples.map((r, i) => (
                  <div className="bwg-example" key={i}>
                    <div className="bwg-repeat-head">
                      <strong>
                        EXAMPLE {String(i + 1).padStart(2, "0")}
                      </strong>
                      <div className="bwg-repeat-tools">
                        <span
                          className={`bwg-mini-status ${
                            filled(r.before) && filled(r.after) ? "done" : ""
                          }`}
                        >
                          {filled(r.before) && filled(r.after)
                            ? "Complete"
                            : "Needs edit"}
                        </span>
                        <button
                          className="bwg-icon-btn"
                          onClick={() => deleteRow("examples", i)}
                          aria-label={`Remove example ${i + 1}`}
                        >
                          <Icon name="trash" size={16} />
                        </button>
                      </div>
                    </div>

                    <SelectField
                      label="What this example teaches"
                      value={r.category}
                      onChange={(v) =>
                        updateRow("examples", i, "category", v)
                      }
                      options={CATEGORIES}
                    />

                    <div className="bwg-before-after">
                      <div className="bwg-before">
                        <Field
                          label="BEFORE · Don't write this"
                          value={r.before}
                          onChange={(v) =>
                            updateRow("examples", i, "before", v)
                          }
                          rows={3}
                          placeholder="Paste an unhelpful sentence"
                        />
                      </div>
                      <div className="bwg-after">
                        <Field
                          label="AFTER · Write this instead"
                          value={r.after}
                          onChange={(v) =>
                            updateRow("examples", i, "after", v)
                          }
                          rows={3}
                          placeholder="Show a better, more specific version"
                        />
                      </div>
                    </div>

                    <Field
                      label="Why this version works"
                      hint="Optional, but useful for teaching the underlying rule."
                      value={r.why}
                      onChange={(v) =>
                        updateRow("examples", i, "why", v)
                      }
                      rows={2}
                      placeholder="e.g. Names the buyer's task and removes an unverified claim."
                    />
                  </div>
                ))}

                <button
                  className="bwg-add"
                  onClick={() =>
                    appendRow("examples", EMPTY_EXAMPLE())
                  }
                >
                  <Icon name="plus" size={16} /> Add another sentence example
                </button>
              </>
            )}

            {active === "review" && (
              <>
                <SectionHeading
                  eyebrow="05 / FINAL CHECK"
                  title="Ready for the next writer?"
                  description="Review the gaps, add your final editorial checks, then copy or export the reference for your team."
                />

                <div className="bwg-readiness">
                  <div>
                    <span className="bwg-eyebrow">GUIDE READINESS</span>
                    <strong>{completeness}%</strong>
                    <p>
                      This is an editorial completeness check, not an
                      automated verification of your product claims.
                    </p>
                  </div>
                  <div className="bwg-meter">
                    <div style={{ width: `${completeness}%` }} />
                  </div>
                </div>

                <div className="bwg-subhead">
                  <div>
                    <h3>Before sharing</h3>
                    <p>Optional improvements that make this easier to use.</p>
                  </div>
                </div>

                {missing.length ? (
                  <ul className="bwg-missing">
                    {missing.map((m) => (
                      <li key={m}>
                        <Icon name="alert" size={15} />
                        {m}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="bwg-success">
                    <Icon name="check" size={18} /> All core sections have
                    enough detail for a first draft. Verify facts before
                    publishing.
                  </div>
                )}

                <div className="bwg-rule" />

                <div className="bwg-subhead">
                  <div>
                    <h3>Pre-publishing checklist</h3>
                    <p>
                      What should a writer or editor check before handoff?
                    </p>
                  </div>
                </div>

                {data.checklist.map((item, i) => (
                  <div key={i} className="bwg-check-edit">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <input
                      className="bwg-input"
                      value={item}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          checklist: prev.checklist.map((x, j) =>
                            j === i ? e.target.value : x
                          ),
                        }))
                      }
                      aria-label={`Checklist item ${i + 1}`}
                      placeholder="Add a final quality check"
                    />
                    <button
                      className="bwg-icon-btn"
                      onClick={() =>
                        setData((prev) => ({
                          ...prev,
                          checklist: prev.checklist.filter(
                            (_, j) => j !== i
                          ),
                        }))
                      }
                      aria-label={`Remove checklist item ${i + 1}`}
                    >
                      <Icon name="trash" size={15} />
                    </button>
                  </div>
                ))}

                <button
                  className="bwg-add"
                  onClick={() =>
                    setData((prev) => ({
                      ...prev,
                      checklist: [...prev.checklist, ""],
                    }))
                  }
                >
                  <Icon name="plus" size={16} /> Add checklist item
                </button>

                <div className="bwg-export">
                  <h3>Export your guidelines</h3>
                  <p>
                    Send the finished reference to your writer, agency or
                    internal content team.
                  </p>
                  <div className="bwg-export-actions">
                    <button className="bwg-btn bwg-primary" onClick={copyGuide}>
                      <Icon name="copy" size={16} /> Copy document
                    </button>
                    <button
                      className="bwg-btn bwg-outline"
                      onClick={exportMarkdown}
                    >
                      <Icon name="file" size={16} /> Download .md
                    </button>
                    <button
                      className="bwg-btn bwg-outline"
                      onClick={printGuide}
                    >
                      <Icon name="print" size={16} /> Print / PDF
                    </button>
                  </div>
                  <small>
                    Everything stays on this page until you leave or reload.
                    Export to keep a copy.
                  </small>
                </div>
              </>
            )}

            <div className="bwg-bottom-nav">
              <button
                className="bwg-btn bwg-outline"
                disabled={stepIndex === 0}
                onClick={() => setActive(STEPS[stepIndex - 1].key)}
              >
                <Icon name="left" size={16} /> Back
              </button>

              {stepIndex < STEPS.length - 1 ? (
                <button
                  className="bwg-btn bwg-primary"
                  onClick={() => setActive(STEPS[stepIndex + 1].key)}
                >
                  Continue <Icon name="arrow" size={16} />
                </button>
              ) : (
                <button className="bwg-btn bwg-primary" onClick={copyGuide}>
                  <Icon name="copy" size={16} /> Copy guidelines
                </button>
              )}
            </div>
          </main>

          {/* ASIDE PREVIEW */}
          <aside className="bwg-aside">
            <div className="bwg-preview-header">
              <div className="bwg-preview-kicker">
                <Icon name="file" size={15} /> LIVE DOCUMENT
              </div>
              <h2>{data.brand || "Your brand"}</h2>
              <p>Brand Writing Guidelines</p>
              <div className="bwg-preview-tabs">
                <button
                  className={previewTab === "guide" ? "active" : ""}
                  onClick={() => setPreviewTab("guide")}
                >
                  Document
                </button>
                <button
                  className={previewTab === "examples" ? "active" : ""}
                  onClick={() => setPreviewTab("examples")}
                >
                  Rewrites ({completeExamples})
                </button>
              </div>
            </div>

            <div className="bwg-preview-body" id="bwg-print-area">
              <div className="bwg-print-heading">
                <div className="bwg-eyebrow">
                  GROWUP TOOLKIT / EDITORIAL REFERENCE
                </div>
                <h1>{data.brand || "Your brand"}</h1>
                <p>Brand Writing Guidelines</p>
              </div>

              {previewTab === "guide" ? (
                <>
                  <div className="bwg-preview-meta">
                    <span>OWNER</span>
                    <strong>{data.owner || "Not specified"}</strong>
                    <span>REVIEWED</span>
                    <strong>{data.updated || "Not specified"}</strong>
                  </div>

                  <section className="bwg-doc-section">
                    <h3>
                      <span>01</span> Audience & context
                    </h3>
                    <p>
                      <b>Product:</b>{" "}
                      {data.product || "Add your product description."}
                    </p>
                    <p>
                      <b>Audience:</b>{" "}
                      {data.audience || "Add the intended reader."}
                    </p>
                    <p>
                      <b>Content:</b>{" "}
                      {data.writerContext || "Add the content formats."}
                    </p>
                  </section>

                  <section className="bwg-doc-section">
                    <h3>
                      <span>02</span> The house style
                    </h3>
                    {filled(data.voiceSummary) ? (
                      <p className="bwg-doc-emphasis">
                        {data.voiceSummary}
                      </p>
                    ) : (
                      <EmptyLine>Add a voice summary.</EmptyLine>
                    )}
                    <p>
                      <b>Point of view:</b> {data.perspective}
                    </p>
                    <p>
                      <b>Language:</b> {data.locale}
                    </p>
                    <p>
                      {data.reading ||
                        "Add structure and grammar rules."}
                    </p>
                    {data.principles
                      .filter((x) => filled(x.title) || filled(x.detail))
                      .map((r, i) => (
                        <div className="bwg-doc-principle" key={i}>
                          <b>{r.title}</b>
                          <p>{r.detail}</p>
                        </div>
                      ))}
                  </section>

                  <section className="bwg-doc-section">
                    <h3>
                      <span>03</span> Preferred language
                    </h3>
                    {data.terms.filter(
                      (x) => filled(x.avoid) || filled(x.use)
                    ).length ? (
                      data.terms
                        .filter(
                          (x) => filled(x.avoid) || filled(x.use)
                        )
                        .map((r, i) => (
                          <div className="bwg-doc-term" key={i}>
                            <span>{r.avoid || "—"}</span>
                            <Icon name="arrow" size={13} />
                            <strong>{r.use || "—"}</strong>
                            {r.note && <small>{r.note}</small>}
                          </div>
                        ))
                    ) : (
                      <EmptyLine>
                        Add prohibited phrases and preferred alternatives.
                      </EmptyLine>
                    )}
                  </section>

                  <section className="bwg-doc-section">
                    <h3>
                      <span>04</span> Product claims
                    </h3>
                    {Object.entries({
                      capabilities: "Features",
                      integrations: "Integrations",
                      metrics: "Results",
                      pricing: "Pricing",
                      prohibited: "Avoid",
                      evidence: "Sources",
                      approver: "Approvers",
                    })
                      .filter(([key]) => filled(data.claims[key]))
                      .map(([key, label]) => (
                        <div className="bwg-doc-claim" key={key}>
                          <b>{label}</b>
                          <p>{data.claims[key]}</p>
                        </div>
                      ))}
                    {claimCount === 0 && (
                      <EmptyLine>
                        Set the rules for evidence and product claims.
                      </EmptyLine>
                    )}
                  </section>

                  <section className="bwg-doc-section">
                    <h3>
                      <span>05</span> Sentence examples
                    </h3>
                    <p>
                      {completeExamples} fully rewritten examples. Open the
                      Rewrites tab to inspect them.
                    </p>
                    {data.examples
                      .filter((r) => filled(r.before) && filled(r.after))
                      .slice(0, 2)
                      .map((r, i) => (
                        <div className="bwg-doc-example" key={i}>
                          <small>{r.category}</small>
                          <div className="bwg-doc-wrong">{r.before}</div>
                          <div className="bwg-doc-right">{r.after}</div>
                        </div>
                      ))}
                  </section>

                  <section className="bwg-doc-section">
                    <h3>
                      <span>06</span> Final checks
                    </h3>
                    {data.checklist.filter(filled).map((r, i) => (
                      <p className="bwg-preview-check" key={i}>
                        <span>□</span>
                        {r}
                      </p>
                    ))}
                  </section>
                </>
              ) : (
                <section className="bwg-doc-section bwg-all-examples">
                  <h3>
                    <span>01</span> Before-and-after library
                  </h3>
                  {data.examples.filter(
                    (r) => filled(r.before) || filled(r.after)
                  ).length ? (
                    data.examples
                      .filter(
                        (r) => filled(r.before) || filled(r.after)
                      )
                      .map((r, i) => (
                        <div className="bwg-doc-example" key={i}>
                          <small>
                            EXAMPLE {String(i + 1).padStart(2, "0")} /{" "}
                            {r.category}
                          </small>
                          <div className="bwg-doc-wrong">
                            <span>BEFORE</span>
                            {r.before || "Add original sentence"}
                          </div>
                          <div className="bwg-doc-right">
                            <span>AFTER</span>
                            {r.after || "Add better wording"}
                          </div>
                          {r.why && (
                            <p>
                              <b>Why:</b> {r.why}
                            </p>
                          )}
                        </div>
                      ))
                  ) : (
                    <EmptyLine>
                      Use the Sentence examples step to create your library.
                    </EmptyLine>
                  )}
                </section>
              )}
            </div>

            <div className="bwg-preview-footer">
              <span>
                <span className="bwg-dot" /> Live preview updates as you
                type
              </span>
              <button onClick={() => setActive("review")}>
                Review & export <Icon name="arrow" size={15} />
              </button>
            </div>

            <div className="bwg-print-complete">
              <h1>
                {data.brand || "Brand"} — Brand Writing Guidelines
              </h1>
              <pre>{buildText}</pre>
            </div>
          </aside>
        </div>

        {/* FAQ */}
        <section className="bwg-faq">
          <div className="bwg-eyebrow">HELP & GUIDANCE</div>
          <h2>Frequently asked questions</h2>
          {faqs.map((item, i) => (
            <div className="bwg-faq-item" key={i}>
              <button
                aria-expanded={showFaq === i}
                onClick={() => setShowFaq(showFaq === i ? -1 : i)}
              >
                {item.question}
                <span>{showFaq === i ? "−" : "+"}</span>
              </button>
              {showFaq === i && <p>{item.answer}</p>}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

const CSS = `
.bwg-print-complete { display: none }
.bwg-root {
  --ink: #011522;
  --deep: #063b3a;
  --teal: #167273;
  --teal-dark: #105c5d;
  --mint: #eef4f3;
  --line: #d8e5e2;
  --text: #12393a;
  --muted: #607a7a;
  --white: #fff;
  font-family: Montserrat, Inter, ui-sans-serif, system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: var(--text);
  font-size: 14px;
  background: #fff;
  line-height: 1.55;
}
.bwg-root * { box-sizing: border-box }
.bwg-root button,
.bwg-root input,
.bwg-root textarea,
.bwg-root select { font: inherit }
.bwg-root button { cursor: pointer }
.bwg-root button:focus-visible,
.bwg-root input:focus-visible,
.bwg-root textarea:focus-visible,
.bwg-root select:focus-visible {
  outline: 3px solid #8bd1c9;
  outline-offset: 2px;
}
.bwg-root h1,
.bwg-root h2,
.bwg-root h3,
.bwg-root p { margin-top: 0 }

/* Topline */
.bwg-topline {
  background: #062e2e;
  color: #a9d4cd;
  display: flex;
  justify-content: space-between;
  padding: 12px max(24px, calc((100% - 1160px) / 2));
  font-size: 10px;
  letter-spacing: .12em;
  font-weight: 800;
}
.bwg-topline > div { display: flex; align-items: center; gap: 10px }
.bwg-dot {
  display: inline-block;
  height: 7px;
  width: 7px;
  background: #6ac4b2;
  border-radius: 50%;
  flex-shrink: 0;
}
.bwg-slash { opacity: .35 }
.bwg-top-tag {
  letter-spacing: 0;
  text-transform: none;
  font-size: 11px;
  color: #d9f0e9;
}

/* Hero */
.bwg-hero {
  background: linear-gradient(120deg, #063a38 2%, #073230 65%, #052c2d);
  color: white;
  padding: 46px max(24px, calc((100% - 1160px) / 2)) 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 38px;
}
.bwg-hero-copy { max-width: 780px }
.bwg-hero-eyebrow,
.bwg-eyebrow {
  font-size: 10px;
  letter-spacing: .15em;
  font-weight: 850;
  color: var(--teal);
  margin-bottom: 12px;
}
.bwg-hero-eyebrow { color: #91d6c9 }
.bwg-hero h1 {
  font-size: clamp(30px, 4vw, 46px);
  line-height: 1.12;
  letter-spacing: -.05em;
  margin: 0 0 14px;
  font-weight: 850;
}
.bwg-hero-copy > p {
  font-size: 15px;
  color: #d8ece9;
  line-height: 1.7;
  max-width: 710px;
  margin-bottom: 20px;
}
.bwg-hero-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 11px;
  font-weight: 700;
  color: #a8d5cf;
}
.bwg-hero-meta span { display: flex; align-items: center; gap: 8px }
.bwg-hero-score {
  width: 190px;
  flex: 0 0 190px;
  border: 1px solid #326967;
  background: #ffffff0c;
  border-radius: 15px;
  padding: 20px;
}
.bwg-hero-score > span {
  font-size: 10px;
  letter-spacing: .14em;
  font-weight: 800;
  color: #bdddd6;
}
.bwg-hero-score > strong {
  display: block;
  font-size: 38px;
  line-height: 1.3;
  margin: 8px 0;
  color: #fff;
}
.bwg-hero-score > strong small { font-size: 18px; color: #a7d1ca }
.bwg-hero-score > em {
  font-style: normal;
  font-size: 11px;
  color: #bdddd6;
  display: block;
  margin-top: 10px;
}

/* Meter */
.bwg-meter {
  width: 100%;
  height: 7px;
  overflow: hidden;
  border-radius: 50px;
  background: #d9e7e4;
}
.bwg-meter > div {
  background: #1f8f87;
  height: 100%;
  border-radius: inherit;
  transition: width .2s ease;
}
.bwg-hero-score .bwg-meter { background: #ffffff30 }
.bwg-hero-score .bwg-meter > div { background: #7edac7 }

/* Shell */
.bwg-shell {
  max-width: 1208px;
  padding: 36px 24px 70px;
  margin: auto;
}

/* Step nav */
.bwg-steps {
  display: flex;
  gap: 9px;
  border-bottom: 1px solid var(--line);
  padding-bottom: 17px;
  overflow-x: auto;
}
.bwg-step {
  display: flex;
  align-items: center;
  gap: 9px;
  white-space: nowrap;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 10px 14px;
  background: #fff;
  color: var(--text);
  font-weight: 800;
  font-size: 12px;
  transition: background .2s;
}
.bwg-step:hover { background: var(--mint) }
.bwg-step.active {
  background: #0d5958;
  color: white;
  border-color: #0d5958;
}
.bwg-step-number {
  width: 21px;
  height: 21px;
  border: 1.5px solid currentColor;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 11px;
}

/* Toolbar */
.bwg-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 18px 0;
}
.bwg-toolbar-caption {
  font-size: 10px;
  font-weight: 850;
  letter-spacing: .13em;
  color: var(--teal);
}
.bwg-toolbar-caption span { color: #b0c4c1; padding: 0 7px }
.bwg-tool-actions { display: flex; gap: 16px; flex-wrap: wrap }
.bwg-link-btn {
  background: transparent;
  border: 0;
  color: var(--teal);
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 750;
  padding: 5px;
}
.bwg-link-btn:hover { text-decoration: underline }

/* Confirms/notices */
.bwg-confirm,
.bwg-notice {
  padding: 12px 16px;
  border: 1px solid #e3cba8;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  background: #fff9ed;
  font-size: 12px;
}
.bwg-confirm > div { display: flex; gap: 8px }
.bwg-notice {
  border-color: var(--line);
  background: var(--mint);
  justify-content: flex-start;
}
.bwg-notice button {
  margin-left: auto;
  border: 0;
  background: none;
  font-size: 20px;
  color: var(--text);
}

/* Layout */
.bwg-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.27fr) minmax(340px, .93fr);
  gap: 20px;
  align-items: start;
}

/* Editor */
.bwg-editor {
  background: white;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 30px;
  min-width: 0;
}
.bwg-section-heading { margin-bottom: 27px }
.bwg-section-heading h2 {
  font-size: clamp(24px, 2.5vw, 30px);
  letter-spacing: -.04em;
  color: var(--deep);
  line-height: 1.24;
  margin-bottom: 9px;
}
.bwg-section-heading p {
  font-size: 13px;
  color: var(--muted);
  margin: 0;
  line-height: 1.65;
}

/* Fields */
.bwg-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 17px;
  min-width: 0;
}
.bwg-label { font-size: 12px; font-weight: 800; color: var(--deep) }
.bwg-required { color: #be6046 }
.bwg-hint { font-size: 11px; color: var(--muted); line-height: 1.5 }
.bwg-input {
  width: 100%;
  padding: 12px 13px;
  border: 1px solid #bbd5d0;
  background: #fbfdfc;
  border-radius: 8px;
  color: var(--ink);
  font-size: 13px;
  outline: none;
  transition: border-color .2s, box-shadow .2s;
  min-width: 0;
}
.bwg-input::placeholder { color: #92aaa5 }
.bwg-input:focus {
  border-color: var(--teal);
  box-shadow: 0 0 0 3px #16727320;
}
.bwg-root textarea.bwg-input { resize: vertical; min-height: 78px }
.bwg-root select.bwg-input { appearance: auto }
.bwg-two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.bwg-two > .bwg-field { min-width: 0 }

/* Tip */
.bwg-tip {
  display: flex;
  gap: 12px;
  padding: 15px;
  background: var(--mint);
  border: 1px solid var(--line);
  border-radius: 9px;
  font-size: 12px;
  color: #3e6662;
  line-height: 1.6;
  margin-top: 7px;
}
.bwg-tip svg { flex-shrink: 0; color: var(--teal) }

/* Subhead */
.bwg-subhead {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 14px;
  margin: 20px 0 15px;
}
.bwg-subhead h3 {
  font-size: 17px;
  color: var(--deep);
  margin: 0 0 4px;
  letter-spacing: -.03em;
}
.bwg-subhead p { color: var(--muted); font-size: 12px; margin: 0 }
.bwg-count {
  font-size: 10px;
  font-weight: 800;
  color: var(--teal);
  border: 1px solid var(--line);
  background: var(--mint);
  border-radius: 30px;
  padding: 5px 10px;
  white-space: nowrap;
}

/* Repeat rows */
.bwg-repeat,
.bwg-example {
  border: 1px solid var(--line);
  border-radius: 11px;
  padding: 16px;
  margin-bottom: 13px;
  background: #fff;
}
.bwg-repeat-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 13px;
}
.bwg-repeat-head > strong {
  color: var(--teal);
  font-size: 10px;
  letter-spacing: .12em;
}
.bwg-repeat .bwg-field:last-child,
.bwg-example .bwg-field:last-child { margin-bottom: 0 }
.bwg-icon-btn {
  background: transparent;
  border: 0;
  color: #72918a;
  padding: 5px;
  display: flex;
  align-items: center;
}
.bwg-icon-btn:hover { color: #b54438 }
.bwg-add {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px dashed #81b3a9;
  color: var(--teal);
  font-weight: 800;
  border-radius: 9px;
  padding: 12px;
  width: 100%;
  background: #f7fbfa;
  font-size: 12px;
}
.bwg-add:hover { background: var(--mint) }
.bwg-rule { height: 1px; background: var(--line); margin: 29px 0 }

/* Example progress */
.bwg-example-progress {
  background: var(--mint);
  padding: 14px 16px;
  border-radius: 9px;
  margin-bottom: 16px;
  font-size: 12px;
  color: var(--text);
}
.bwg-example-progress strong { color: var(--teal) }
.bwg-example-progress .bwg-meter { margin-top: 9px }
.bwg-repeat-tools { display: flex; align-items: center; gap: 10px }
.bwg-mini-status {
  font-size: 10px;
  font-weight: 800;
  color: #a27854;
  background: #fdf2e6;
  padding: 4px 8px;
  border-radius: 40px;
}
.bwg-mini-status.done { background: var(--mint); color: var(--teal) }

/* Before/after */
.bwg-before-after {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.bwg-before,
.bwg-after {
  padding: 10px;
  border-radius: 8px;
  background: #fcf7f5;
  border: 1px solid #f1e2db;
  margin-bottom: 14px;
}
.bwg-after { background: #f3f9f6; border-color: #cfe5dc }
.bwg-before .bwg-label { color: #a04b42 }
.bwg-after .bwg-label { color: #137461 }
.bwg-before .bwg-field,
.bwg-after .bwg-field { margin: 0 }

/* Bottom nav */
.bwg-bottom-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--line);
  margin-top: 28px;
  padding-top: 20px;
  gap: 10px;
}
.bwg-btn {
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 11px 16px;
  font-size: 12px;
  font-weight: 800;
  border: 1px solid transparent;
}
.bwg-primary {
  background: #0e6564;
  border-color: #0e6564;
  color: #fff;
}
.bwg-primary:hover { background: #084d4c }
.bwg-outline {
  background: white;
  border-color: #b9d1cc;
  color: var(--deep);
}
.bwg-outline:hover { background: var(--mint) }
.bwg-btn:disabled { opacity: .4; cursor: not-allowed }
.bwg-danger { background: #9b3c32; color: white }

/* Aside / preview */
.bwg-aside {
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: hidden;
  position: sticky;
  top: 18px;
  background: #fff;
  min-width: 0;
}
.bwg-preview-header {
  background: #073e3c;
  color: white;
  padding: 23px 24px 0;
}
.bwg-preview-kicker {
  display: flex;
  gap: 8px;
  align-items: center;
  color: #9ed9ce;
  font-size: 10px;
  font-weight: 850;
  letter-spacing: .13em;
  margin-bottom: 10px;
}
.bwg-preview-header h2 {
  font-size: 26px;
  line-height: 1.2;
  letter-spacing: -.04em;
  color: white;
  margin: 0 0 2px;
  overflow-wrap: anywhere;
}
.bwg-preview-header > p {
  font-size: 12px;
  color: #bfded7;
  margin-bottom: 22px;
}
.bwg-preview-tabs { display: flex; gap: 20px }
.bwg-preview-tabs button {
  background: transparent;
  border: 0;
  border-bottom: 3px solid transparent;
  color: #b5d3cd;
  font-size: 12px;
  font-weight: 800;
  padding: 0 0 12px;
}
.bwg-preview-tabs button.active {
  border-bottom-color: #84d4bf;
  color: white;
}
.bwg-preview-body {
  padding: 25px 23px;
  max-height: 720px;
  overflow: auto;
  scrollbar-color: #b9cac6 #f6faf8;
}
.bwg-print-heading { display: none }

/* Preview meta */
.bwg-preview-meta {
  display: grid;
  grid-template-columns: 75px 1fr;
  column-gap: 10px;
  row-gap: 6px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--line);
}
.bwg-preview-meta span {
  font-size: 9px;
  font-weight: 850;
  letter-spacing: .12em;
  color: var(--teal);
}
.bwg-preview-meta strong {
  font-size: 11px;
  font-weight: 700;
  overflow-wrap: anywhere;
}

/* Doc sections */
.bwg-doc-section {
  padding: 19px 0;
  border-bottom: 1px solid var(--line);
}
.bwg-doc-section:last-child { border-bottom: 0 }
.bwg-doc-section h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--deep);
  margin: 0 0 12px;
  letter-spacing: -.025em;
}
.bwg-doc-section h3 span {
  font-size: 10px;
  letter-spacing: .06em;
  color: var(--teal);
  background: var(--mint);
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  flex-shrink: 0;
}
.bwg-doc-section p {
  font-size: 11px;
  line-height: 1.65;
  color: #446562;
  margin-bottom: 8px;
  overflow-wrap: anywhere;
}
.bwg-doc-section p b { color: var(--deep) }
.bwg-doc-emphasis {
  font-size: 13px !important;
  font-weight: 700;
  color: var(--deep) !important;
}
.bwg-empty { color: #8a9d99 !important; font-style: italic }
.bwg-doc-principle {
  border-left: 2px solid #aed7cc;
  padding: 3px 0 3px 12px;
  margin: 12px 0;
}
.bwg-doc-principle > b,
.bwg-doc-claim > b {
  font-size: 11px;
  color: var(--deep);
}
.bwg-doc-principle p,
.bwg-doc-claim p { margin: 3px 0 0 }
.bwg-doc-term {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 14px minmax(0, 1fr);
  gap: 8px;
  padding: 10px 0;
  border-bottom: 1px solid #e8efec;
  align-items: center;
  font-size: 11px;
  overflow-wrap: anywhere;
}
.bwg-doc-term > span { color: #a15045; text-decoration: line-through }
.bwg-doc-term > strong { color: #136a5b }
.bwg-doc-term > small { grid-column: 1 / -1; color: var(--muted) }
.bwg-doc-claim { margin-bottom: 13px }
.bwg-doc-example {
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  margin: 10px 0;
}
.bwg-doc-example > small {
  display: block;
  font-size: 9px;
  letter-spacing: .1em;
  font-weight: 850;
  color: var(--teal);
  text-transform: uppercase;
  margin-bottom: 8px;
}
.bwg-doc-wrong,
.bwg-doc-right {
  padding: 9px 10px;
  font-size: 11px;
  border-radius: 6px;
  overflow-wrap: anywhere;
}
.bwg-doc-wrong {
  background: #fcf1ed;
  color: #924e43;
  margin-bottom: 6px;
}
.bwg-doc-right {
  background: #eaf5ef;
  color: #116958;
  font-weight: 650;
}
.bwg-doc-wrong span,
.bwg-doc-right span {
  display: block;
  letter-spacing: .11em;
  font-size: 8px;
  font-weight: 850;
  margin-bottom: 5px;
}
.bwg-all-examples .bwg-doc-example > p { margin-top: 7px }
.bwg-preview-check { display: flex; gap: 8px }
.bwg-preview-check span { font-size: 16px; color: var(--teal) }

/* Preview footer */
.bwg-preview-footer {
  border-top: 1px solid var(--line);
  padding: 13px 17px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  background: #f8fbfa;
}
.bwg-preview-footer > span {
  display: flex;
  gap: 7px;
  align-items: center;
  font-size: 10px;
  color: var(--muted);
}
.bwg-preview-footer button {
  border: 0;
  background: transparent;
  color: var(--teal);
  font-size: 11px;
  font-weight: 800;
  display: flex;
  gap: 6px;
  align-items: center;
}

/* Readiness */
.bwg-readiness {
  border: 1px solid var(--line);
  background: var(--mint);
  border-radius: 11px;
  padding: 20px;
}
.bwg-readiness strong {
  display: block;
  font-size: 37px;
  color: var(--deep);
  line-height: 1.2;
}
.bwg-readiness p { color: var(--muted); font-size: 12px; margin: 4px 0 14px }
.bwg-missing { list-style: none; margin: 0; padding: 0 }
.bwg-missing li {
  display: flex;
  gap: 9px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
  font-size: 12px;
  color: var(--text);
}
.bwg-missing svg { color: #af7752; flex-shrink: 0 }
.bwg-success {
  display: flex;
  gap: 8px;
  background: var(--mint);
  border-radius: 9px;
  padding: 13px;
  font-size: 12px;
  color: var(--teal);
}

/* Checklist */
.bwg-check-edit {
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 9px 0;
}
.bwg-check-edit > span {
  font-size: 10px;
  font-weight: 850;
  color: var(--teal);
  width: 23px;
}
.bwg-check-edit .bwg-input { flex: 1 }

/* Export */
.bwg-export {
  background: #073e3c;
  border-radius: 12px;
  color: white;
  padding: 23px;
  margin-top: 28px;
}
.bwg-export h3 { font-size: 18px; margin-bottom: 5px }
.bwg-export p { font-size: 12px; color: #c6dfd9 }
.bwg-export-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 17px 0;
}
.bwg-export .bwg-outline { color: #0d5654 }
.bwg-export .bwg-primary {
  background: #d1f4e8;
  color: #063e3d;
  border-color: #d1f4e8;
}
.bwg-export small { font-size: 10px; color: #c6dfd9 }

/* FAQ */
.bwg-faq { max-width: 750px; padding: 65px 0 0 }
.bwg-faq h2 {
  font-size: 24px;
  letter-spacing: -.04em;
  color: var(--deep);
  margin-bottom: 22px;
}
.bwg-faq-item { border-bottom: 1px solid var(--line) }
.bwg-faq-item button {
  display: flex;
  width: 100%;
  padding: 16px 0;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  border: 0;
  background: transparent;
  text-align: left;
  font-size: 13px;
  font-weight: 800;
  color: var(--deep);
}
.bwg-faq-item button span { font-size: 20px; color: var(--teal) }
.bwg-faq-item > p {
  font-size: 12px;
  color: var(--muted);
  max-width: 650px;
  margin: 0 0 15px;
  line-height: 1.7;
}

/* Responsive */
@media (max-width: 980px) {
  .bwg-layout { grid-template-columns: minmax(0, 1fr) }
  .bwg-aside { position: static }
  .bwg-preview-body { max-height: 550px }
  .bwg-hero-score { display: none }
}
@media (max-width: 650px) {
  .bwg-topline { padding: 12px 18px }
  .bwg-top-tag { display: none !important }
  .bwg-hero { padding: 34px 18px }
  .bwg-shell { padding: 22px 14px 45px }
  .bwg-editor { padding: 20px 16px }
  .bwg-step { font-size: 11px; padding: 9px 10px }
  .bwg-steps { gap: 6px }
  .bwg-step span:nth-child(2) { display: none }
  .bwg-step.active span:nth-child(2) { display: inline }
  .bwg-toolbar { align-items: flex-start; flex-direction: column }
  .bwg-two,
  .bwg-before-after { grid-template-columns: 1fr; gap: 0 }
  .bwg-preview-body { padding: 20px 16px }
  .bwg-confirm { flex-direction: column; align-items: flex-start }
  .bwg-export-actions { flex-direction: column }
  .bwg-export-actions .bwg-btn { width: 100% }
}

/* Print */
@media print {
  body * { visibility: hidden !important }
  .bwg-root .bwg-aside,
  .bwg-root .bwg-aside * { visibility: visible !important }
  .bwg-root .bwg-aside {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    overflow: visible;
  }
  .bwg-root .bwg-preview-header,
  .bwg-root .bwg-preview-footer { display: none !important }
  .bwg-root .bwg-preview-body { display: none !important }
  .bwg-root .bwg-print-complete {
    display: block !important;
    padding: 12mm 10mm;
  }
  .bwg-root .bwg-print-complete h1 { font-size: 23px; color: #063b3a }
  .bwg-root .bwg-print-complete pre {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    font: 11px/1.65 Arial, sans-serif;
    color: #12393a;
  }
  .bwg-root .bwg-print-heading { display: block; margin-bottom: 15mm }
  .bwg-root .bwg-print-heading h1 {
    font-size: 29px;
    color: #063b3a;
    margin: 4px 0;
  }
  .bwg-root .bwg-print-heading p { font-size: 14px }
  .bwg-root .bwg-doc-section { break-inside: avoid }
  .bwg-root .bwg-doc-section p { font-size: 11px }
  .bwg-root .bwg-doc-section h3 { font-size: 14px }
  @page { size: A4; margin: 12mm }
}
`;