"use client";

import React, { useMemo, useState } from "react";

// Standalone component. No Workspace dependency or third-party packages.
const TEAL = "#167273";

const blankItem = () => ({
  id: `${Date.now()}-${Math.random()}`,
  title: "",
  quantity: 1,
  type: "Article",
  words: "",
  rate: "",
  draft: "",
  final: "",
  details: "",
});

const EXAMPLE = {
  project: "RelayLedger Q1 buyer-intent content sprint",
  client: "RelayLedger",
  provider: "Northstar Content Studio",
  contact: "Amelia Grant, Head of Demand Generation",
  approver: "Amelia Grant",
  purpose:
    "Help UK finance teams evaluating invoice automation understand integration requirements, total cost and alternatives before booking a demo.",
  audience:
    "Finance Directors and AP Managers at UK companies with 100–1,000 employees",
  success:
    "Each piece answers the assigned buyer question, supports claims with approved evidence and directs relevant readers to a product demo.",
  items: [
    {
      id: "ex1",
      title: "RelayLedger vs. manual invoice processing",
      quantity: 1,
      type: "Comparison page",
      words: "1,400–1,800",
      rate: "525",
      draft: "12 Jan 2027",
      final: "19 Jan 2027",
      details:
        "Include implementation effort, 3 use cases, a comparison table and approved product screenshots.",
    },
    {
      id: "ex2",
      title: "Best invoice automation software for UK mid-market teams",
      quantity: 1,
      type: "Buyer guide",
      words: "1,800–2,200",
      rate: "650",
      draft: "19 Jan 2027",
      final: "27 Jan 2027",
      details:
        "Evaluate 6 vendors using consistent criteria. Separate verified product facts from editorial assessments.",
    },
  ],
  included: [
    "Research and outline",
    "One SME interview",
    "SEO title and meta description",
    "Internal link recommendations",
    "Two consolidated revision rounds",
  ],
  customIncluded:
    "One 30-minute product interview; one comparison table per article; up to two annotated screenshots using assets supplied by RelayLedger.",
  excluded:
    "New product photography, custom illustrations, original survey research, CMS publishing and changes to the approved angle after outline sign-off.",
  clientInputs:
    "Demo account, approved integrations list, current pricing sheet, brand voice guide, 3 customer proof points and named SME.",
  inputsDue: "8 Jan 2027",
  interviewOwner: "RelayLedger Product Marketing",
  handoff:
    "Google Docs with suggestion access; final copy plus metadata in the same document",
  dependencies:
    "Draft dates move by the number of working days that required product access, SME time or consolidated feedback is delayed.",
  revisionRounds: "2",
  feedbackDays: "3",
  feedbackRules:
    "One consolidated document of comments per round. Feedback must reference the approved brief; conflicting stakeholder notes are resolved by the final approver.",
  acceptance:
    "All mandatory sections are present; factual claims have sources; product statements match approved documentation; links and metadata are supplied; comments from included review rounds are resolved.",
  changePolicy:
    "Changes to the topic, target audience, format or approved outline are quoted separately. No extra work starts without written approval of fee and revised date.",
  payment:
    "50% on kickoff; 50% within 14 days of final delivery. Additional approved work billed separately.",
  currency: "GBP",
};

const EMPTY = {
  project: "",
  client: "",
  provider: "",
  contact: "",
  approver: "",
  purpose: "",
  audience: "",
  success: "",
  items: [blankItem()],
  included: [
    "Research and outline",
    "SEO title and meta description",
    "Two consolidated revision rounds",
  ],
  customIncluded: "",
  excluded: "",
  clientInputs: "",
  inputsDue: "",
  interviewOwner: "",
  handoff: "",
  dependencies: "",
  revisionRounds: "2",
  feedbackDays: "3",
  feedbackRules: "",
  acceptance: "",
  changePolicy: "",
  payment: "",
  currency: "GBP",
};

const SERVICES = [
  "Research and outline",
  "One SME interview",
  "SEO title and meta description",
  "Internal link recommendations",
  "Two consolidated revision rounds",
  "Product screenshots",
  "Comparison table",
  "CMS upload",
  "Custom graphics",
  "Fact-checking and citations",
];

const STEPS = [
  {
    short: "Project",
    heading: "Set the commission",
    sub: "Give the supplier enough commercial and buyer context to understand the work.",
  },
  {
    short: "Deliverables",
    heading: "Define exactly what's included",
    sub: "Add each asset, its price and deadlines. Make extras explicit before work starts.",
  },
  {
    short: "Handoff",
    heading: "Remove the delivery bottlenecks",
    sub: "Record what the client provides, how files are delivered and what happens when inputs are late.",
  },
  {
    short: "Approval",
    heading: "Agree how the work gets signed off",
    sub: "Set review boundaries, acceptance criteria, payment terms and change control.",
  },
];

const money = (n, currency) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency || "GBP",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

const countWords = (s) =>
  String(s || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

const escapeHtml = (s) =>
  String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

export default function ContentDeliveryPlanner() {
  const [data, setData] = useState(() => structuredClone(EXAMPLE));
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [previewMode, setPreviewMode] = useState("document");

  const set = (key, value) => {
    setData((d) => ({ ...d, [key]: value }));
    setError("");
  };

  const changeItem = (id, key, value) => {
    setData((d) => ({
      ...d,
      items: d.items.map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      ),
    }));
  };

  const addItem = () => {
    setData((d) => ({ ...d, items: [...d.items, blankItem()] }));
  };

  const removeItem = (id) => {
    setData((d) => ({ ...d, items: d.items.filter((i) => i.id !== id) }));
  };

  const toggle = (item) => {
    setData((d) => ({
      ...d,
      included: d.included.includes(item)
        ? d.included.filter((x) => x !== item)
        : [...d.included, item],
    }));
  };

  const total = useMemo(
    () =>
      data.items.reduce(
        (sum, i) =>
          sum + (Number(i.rate) || 0) * (Number(i.quantity) || 0),
        0
      ),
    [data.items]
  );

  const issues = useMemo(
    () => [
      ...(!data.client.trim() ? ["Client/company name"] : []),
      ...(!data.provider.trim() ? ["Writer or agency name"] : []),
      ...(!data.items.some((i) => i.title.trim())
        ? ["At least one deliverable"]
        : []),
      ...(data.items.some((i) => i.title.trim() && !i.final.trim())
        ? ["Final delivery date for each asset"]
        : []),
      ...(!data.approver.trim() ? ["Final approver"] : []),
      ...(!data.payment.trim() ? ["Payment terms"] : []),
    ],
    [data]
  );

  const done = 6 - issues.length;

  const updateAll = (obj) => {
    setData(structuredClone(obj));
    setStep(0);
    setError("");
    setCopied(false);
  };

  const outputText = () => {
    const lines = [
      "CONTENT DELIVERY PLAN",
      data.project || "Untitled content commission",
      "",
      `Client: ${data.client || "Not set"}`,
      `Content partner: ${data.provider || "Not set"}`,
      `Project contact: ${data.contact || "Not set"}`,
      `Final approver: ${data.approver || "Not set"}`,
      "",
      "01 / PROJECT CONTEXT",
      `Purpose: ${data.purpose || "Not set"}`,
      `Audience: ${data.audience || "Not set"}`,
      `Success criteria: ${data.success || "Not set"}`,
      "",
      "02 / DELIVERABLES",
      ...data.items.map(
        (i, n) =>
          `${n + 1}. ${i.title || "Untitled asset"} (${i.type}; ${
            i.quantity || 1
          } × ${money(i.rate, data.currency)})\nLength: ${
            i.words || "TBD"
          } words\nDraft: ${i.draft || "TBD"} | Final: ${
            i.final || "TBD"
          }\nRequirements: ${i.details || "TBD"}`
      ),
      `\nEstimated project fee: ${money(total, data.currency)}`,
      "",
      "03 / INCLUDED WORK",
      ...data.included.map((x) => `• ${x}`),
      `Additional included work: ${data.customIncluded || "None specified"}`,
      `Excluded: ${data.excluded || "None specified"}`,
      "",
      "04 / CLIENT INPUTS & HANDOFF",
      `Client supplies: ${data.clientInputs || "TBD"}`,
      `Inputs due: ${data.inputsDue || "TBD"}`,
      `SME/owner: ${data.interviewOwner || "TBD"}`,
      `File handoff: ${data.handoff || "TBD"}`,
      `Dependencies: ${data.dependencies || "TBD"}`,
      "",
      "05 / REVIEWS, APPROVAL & CHANGES",
      `Revision rounds: ${data.revisionRounds || "TBD"}`,
      `Feedback window: ${data.feedbackDays || "TBD"} working days`,
      `Feedback process: ${data.feedbackRules || "TBD"}`,
      `Acceptance criteria: ${data.acceptance || "TBD"}`,
      `Change requests: ${data.changePolicy || "TBD"}`,
      `Payment: ${data.payment || "TBD"}`,
      "",
      "Prepared using GrowUp Content Delivery Planner. Review and confirm with both parties before work starts.",
    ];
    return lines.join("\n");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(outputText());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setError(
        "Copy failed. Please check clipboard permissions or use Print / Save PDF."
      );
    }
  };

  const printable = () => {
    if (issues.length) {
      setError(`Before exporting, complete: ${issues.join(", ")}.`);
      setStep(
        issues.includes("Client/company name") ||
          issues.includes("Writer or agency name")
          ? 0
          : issues.includes("At least one deliverable") ||
            issues.includes("Final delivery date for each asset")
          ? 1
          : 3
      );
      return;
    }
    setError("");
    window.print();
  };

  const field = (key, label, props = {}) => (
    <label
      className={`cdp-field ${props.wide ? "cdp-wide" : ""}`}
      key={key}
    >
      <span>
        {label}
        {props.required && <b className="cdp-req"> *</b>}
      </span>
      {props.multiline ? (
        <textarea
          value={data[key]}
          rows={props.rows || 3}
          placeholder={props.placeholder || "Add details..."}
          onChange={(e) => set(key, e.target.value)}
        />
      ) : (
        <input
          value={data[key]}
          placeholder={props.placeholder || "Enter details"}
          onChange={(e) => set(key, e.target.value)}
        />
      )}
      {props.help && <small>{props.help}</small>}
    </label>
  );

  const value = (s, empty = "Not specified") =>
    s?.trim() ? s : <span className="cdp-empty">{empty}</span>;

  return (
    <div className="cdp-root">
      <style>{styles}</style>

      {/* TOP BAR */}
      <div className="cdp-topbar">
        <div>
          <span className="cdp-eyebrow">GROWUP / CONTENT OPERATIONS</span>
          <h2>Content delivery, without the guesswork.</h2>
          <p>
            Build a clear brief for your writer or agency—deliverables, fees,
            responsibilities, reviews and sign-off in one place.
          </p>
        </div>
        <div className="cdp-top-actions">
          <button
            className="cdp-ghost"
            type="button"
            onClick={() => updateAll(EXAMPLE)}
          >
            ↺ Use example
          </button>
          <button
            className="cdp-ghost"
            type="button"
            onClick={() => updateAll(EMPTY)}
          >
            Start fresh
          </button>
        </div>
      </div>

      <div className="cdp-layout">
        {/* EDITOR PANEL */}
        <div className="cdp-editor">
          <div className="cdp-stepper" aria-label="Planner steps">
            {STEPS.map((s, i) => (
              <button
                type="button"
                key={s.short}
                className={step === i ? "active" : ""}
                onClick={() => {
                  setStep(i);
                  setError("");
                }}
              >
                <span className="cdp-step-number">{i + 1}</span>
                <span>{s.short}</span>
              </button>
            ))}
          </div>

          <section className="cdp-panel">
            <div className="cdp-panel-header">
              <div>
                <span className="cdp-eyebrow">STEP {step + 1} OF 4</span>
                <h3>{STEPS[step].heading}</h3>
                <p>{STEPS[step].sub}</p>
              </div>
            </div>

            {/* STEP 0: PROJECT */}
            {step === 0 && (
              <div className="cdp-form-grid">
                {field("project", "Project name", {
                  wide: true,
                  placeholder: "e.g. Q1 buyer-intent content sprint",
                })}
                {field("client", "Client / commissioning company", {
                  required: true,
                })}
                {field("provider", "Writer / agency delivering the work", {
                  required: true,
                })}
                {field("contact", "Project contact")}
                {field("approver", "Who gives final approval?", {
                  required: true,
                })}
                {field("purpose", "Why are you commissioning this content?", {
                  wide: true,
                  multiline: true,
                  help: "Connect the work to a buyer problem or measurable commercial objective.",
                })}
                {field("audience", "Who is the content for?", {
                  wide: true,
                  multiline: true,
                })}
                {field(
                  "success",
                  "What does a successful delivery look like?",
                  {
                    wide: true,
                    multiline: true,
                    placeholder:
                      "e.g. Accurate product claims, covered buyer objections, clear CTA...",
                  }
                )}
              </div>
            )}

            {/* STEP 1: DELIVERABLES */}
            {step === 1 && (
              <>
                <div className="cdp-section-label">
                  <strong>Content deliverables</strong>
                  <span>
                    {data.items.length} asset type
                    {data.items.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="cdp-items">
                  {data.items.map((item, idx) => (
                    <div className="cdp-item" key={item.id}>
                      <div className="cdp-item-head">
                        <strong>
                          Deliverable {String(idx + 1).padStart(2, "0")}
                        </strong>
                        <button
                          className="cdp-text-button"
                          type="button"
                          onClick={() => removeItem(item.id)}
                          disabled={data.items.length === 1}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="cdp-form-grid">
                        <label className="cdp-field cdp-wide">
                          <span>Working title / commissioned asset</span>
                          <input
                            value={item.title}
                            onChange={(e) =>
                              changeItem(item.id, "title", e.target.value)
                            }
                            placeholder="e.g. Best invoice automation tools for UK teams"
                          />
                        </label>
                        <label className="cdp-field">
                          <span>Format</span>
                          <select
                            value={item.type}
                            onChange={(e) =>
                              changeItem(item.id, "type", e.target.value)
                            }
                          >
                            {[
                              "Article",
                              "Buyer guide",
                              "Comparison page",
                              "Alternatives page",
                              "Case study",
                              "Landing page",
                              "Email sequence",
                              "Other",
                            ].map((x) => (
                              <option key={x}>{x}</option>
                            ))}
                          </select>
                        </label>
                        <label className="cdp-field">
                          <span>Target length</span>
                          <input
                            value={item.words}
                            onChange={(e) =>
                              changeItem(item.id, "words", e.target.value)
                            }
                            placeholder="e.g. 1,400–1,800 words"
                          />
                        </label>
                        <label className="cdp-field">
                          <span>Quantity</span>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              changeItem(item.id, "quantity", e.target.value)
                            }
                          />
                        </label>
                        <label className="cdp-field">
                          <span>Price per piece ({data.currency})</span>
                          <input
                            type="number"
                            min="0"
                            value={item.rate}
                            onChange={(e) =>
                              changeItem(item.id, "rate", e.target.value)
                            }
                            placeholder="525"
                          />
                        </label>
                        <label className="cdp-field">
                          <span>First draft date</span>
                          <input
                            value={item.draft}
                            onChange={(e) =>
                              changeItem(item.id, "draft", e.target.value)
                            }
                            placeholder="e.g. 12 Jan 2027"
                          />
                        </label>
                        <label className="cdp-field">
                          <span>Final delivery date *</span>
                          <input
                            value={item.final}
                            onChange={(e) =>
                              changeItem(item.id, "final", e.target.value)
                            }
                            placeholder="e.g. 19 Jan 2027"
                          />
                        </label>
                        <label className="cdp-field cdp-wide">
                          <span>Must-have sections, proof and assets</span>
                          <textarea
                            rows="3"
                            value={item.details}
                            onChange={(e) =>
                              changeItem(item.id, "details", e.target.value)
                            }
                            placeholder="Specify comparisons, claims, examples, required sections and any non-negotiables."
                          />
                        </label>
                      </div>
                      <div className="cdp-item-total">
                        Line total{" "}
                        <strong>
                          {money(
                            (Number(item.quantity) || 0) *
                              (Number(item.rate) || 0),
                            data.currency
                          )}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="cdp-add" type="button" onClick={addItem}>
                  ＋ Add another deliverable
                </button>
                <div className="cdp-total-bar">
                  <div>
                    <span>Estimated project fee</span>
                    <strong>{money(total, data.currency)}</strong>
                  </div>
                  <label>
                    Currency{" "}
                    <select
                      value={data.currency}
                      onChange={(e) => set("currency", e.target.value)}
                    >
                      <option value="GBP">GBP</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="NGN">NGN</option>
                    </select>
                  </label>
                </div>
                <div className="cdp-section-label">
                  <strong>Services included in the fee</strong>
                  <span>Select all that apply</span>
                </div>
                <div className="cdp-check-grid">
                  {SERVICES.map((x) => (
                    <label
                      key={x}
                      className={data.included.includes(x) ? "checked" : ""}
                    >
                      <input
                        type="checkbox"
                        checked={data.included.includes(x)}
                        onChange={() => toggle(x)}
                      />
                      <span>{x}</span>
                    </label>
                  ))}
                </div>
                <div className="cdp-form-grid cdp-spaced">
                  {field("customIncluded", "Other work included", {
                    wide: true,
                    multiline: true,
                  })}
                  {field("excluded", "Explicitly out of scope", {
                    wide: true,
                    multiline: true,
                    help: "This is where you prevent surprise extras and competing assumptions.",
                  })}
                </div>
              </>
            )}

            {/* STEP 2: HANDOFF */}
            {step === 2 && (
              <div className="cdp-form-grid">
                {field("clientInputs", "What must the client supply?", {
                  wide: true,
                  multiline: true,
                  help: "Think CMS access, approved facts, SMEs, brand guidelines and past performance data.",
                })}
                {field("inputsDue", "When are those inputs due?")}
                {field("interviewOwner", "Who coordinates SMEs and access?")}
                {field(
                  "handoff",
                  "Where and how is the finished work delivered?",
                  {
                    wide: true,
                    multiline: true,
                    placeholder:
                      "Google Docs, Figma, CMS draft, shared drive...",
                  }
                )}
                {field(
                  "dependencies",
                  "What happens if feedback or access is late?",
                  { wide: true, multiline: true }
                )}
              </div>
            )}

            {/* STEP 3: APPROVAL */}
            {step === 3 && (
              <div className="cdp-form-grid">
                {field("revisionRounds", "Included revision rounds")}
                {field("feedbackDays", "Feedback turnaround (working days)")}
                {field("feedbackRules", "How should feedback be submitted?", {
                  wide: true,
                  multiline: true,
                  help: "Consolidated notes from one approver usually avoid conflicting edit requests.",
                })}
                {field(
                  "acceptance",
                  "What counts as completed and approved?",
                  { wide: true, multiline: true }
                )}
                {field("changePolicy", "What happens if the brief changes?", {
                  wide: true,
                  multiline: true,
                })}
                {field("payment", "Payment terms", {
                  wide: true,
                  multiline: true,
                  required: true,
                })}
              </div>
            )}

            {error && (
              <div className="cdp-error" role="alert">
                {error}
              </div>
            )}

            <div className="cdp-footer">
              <button
                className="cdp-ghost"
                type="button"
                disabled={!step}
                onClick={() => {
                  setStep((s) => s - 1);
                  setError("");
                }}
              >
                ← Back
              </button>
              <div className="cdp-footer-right">
                <span>Auto-updating preview →</span>
                {step < 3 ? (
                  <button
                    className="cdp-primary"
                    type="button"
                    onClick={() => {
                      setStep((s) => s + 1);
                      setError("");
                    }}
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    className="cdp-primary"
                    type="button"
                    onClick={printable}
                  >
                    Print / Save PDF ↗
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* PREVIEW PANEL */}
        <aside className="cdp-preview-wrap">
          <div className="cdp-preview-tools">
            <div>
              <span className="cdp-eyebrow">LIVE OUTPUT</span>
              <strong>Your delivery plan</strong>
            </div>
            <span className="cdp-status">
              {issues.length
                ? `${issues.length} to complete`
                : "Ready to export"}
            </span>
          </div>

          <div className="cdp-preview-actions">
            <button
              type="button"
              className={previewMode === "document" ? "active" : ""}
              onClick={() => setPreviewMode("document")}
            >
              Document
            </button>
            <button
              type="button"
              className={previewMode === "checklist" ? "active" : ""}
              onClick={() => setPreviewMode("checklist")}
            >
              Readiness check
            </button>
          </div>

          {previewMode === "document" ? (
            <div className="cdp-paper" id="cdp-print-area">
              <div className="cdp-paper-cover">
                <span>GROWUP / CONTENT DELIVERY PLAN</span>
                <h2>{value(data.project, "Untitled content commission")}</h2>
                <p>
                  A shared reference for the commissioning team and content
                  partner.
                </p>
                <div className="cdp-paper-people">
                  <div>
                    <small>PREPARED FOR</small>
                    <strong>{value(data.client)}</strong>
                  </div>
                  <div>
                    <small>DELIVERED BY</small>
                    <strong>{value(data.provider)}</strong>
                  </div>
                </div>
              </div>

              <div className="cdp-paper-body">
                <div className="cdp-mini-stats">
                  <div>
                    <small>ASSETS</small>
                    <b>
                      {data.items.reduce(
                        (s, i) => s + (Number(i.quantity) || 0),
                        0
                      )}
                    </b>
                  </div>
                  <div>
                    <small>PROJECT FEE</small>
                    <b>{money(total, data.currency)}</b>
                  </div>
                  <div>
                    <small>FINAL APPROVER</small>
                    <b>{value(data.approver, "TBD")}</b>
                  </div>
                </div>

                <div className="cdp-paper-section">
                  <span className="cdp-paper-num">01 / CONTEXT</span>
                  <h3>What we're producing and why</h3>
                  <div className="cdp-def">
                    <b>Commercial objective</b>
                    <p>{value(data.purpose)}</p>
                  </div>
                  <div className="cdp-def">
                    <b>Intended audience</b>
                    <p>{value(data.audience)}</p>
                  </div>
                  <div className="cdp-def">
                    <b>Success looks like</b>
                    <p>{value(data.success)}</p>
                  </div>
                </div>

                <div className="cdp-paper-section">
                  <span className="cdp-paper-num">02 / COMMISSION</span>
                  <h3>Deliverables & investment</h3>
                  {data.items.map((i, idx) => (
                    <div className="cdp-preview-item" key={i.id}>
                      <div className="cdp-preview-item-title">
                        <b>
                          {idx + 1}. {value(i.title, "Untitled deliverable")}
                        </b>
                        <strong>
                          {money(
                            (Number(i.rate) || 0) * (Number(i.quantity) || 0),
                            data.currency
                          )}
                        </strong>
                      </div>
                      <small>
                        {i.quantity || 1} × {i.type} ·{" "}
                        {value(i.words, "Length TBD")}{" "}
                        {i.words ? "words" : ""}
                      </small>
                      <p>{value(i.details, "Specific requirements not yet defined")}</p>
                      <div className="cdp-dates">
                        <span>Draft: {value(i.draft, "TBD")}</span>
                        <span>Final: {value(i.final, "TBD")}</span>
                      </div>
                    </div>
                  ))}
                  <div className="cdp-preview-grand">
                    <span>Total project fee</span>
                    <strong>{money(total, data.currency)}</strong>
                  </div>
                </div>

                <div className="cdp-paper-section">
                  <span className="cdp-paper-num">03 / BOUNDARIES</span>
                  <h3>Included vs. excluded</h3>
                  <div className="cdp-included">
                    <b>Included in the fee</b>
                    <ul>
                      {data.included.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                    <p>
                      {value(
                        data.customIncluded,
                        "No further included work specified"
                      )}
                    </p>
                  </div>
                  <div className="cdp-excluded">
                    <b>Not included</b>
                    <p>{value(data.excluded)}</p>
                  </div>
                </div>

                <div className="cdp-paper-section">
                  <span className="cdp-paper-num">04 / DELIVERY</span>
                  <h3>Inputs & handoff</h3>
                  {[
                    ["Client supplies", data.clientInputs],
                    ["Inputs required by", data.inputsDue],
                    ["SME / access owner", data.interviewOwner],
                    ["Delivery format", data.handoff],
                    ["If inputs or feedback are delayed", data.dependencies],
                  ].map(([label, val]) => (
                    <div className="cdp-def" key={label}>
                      <b>{label}</b>
                      <p>{value(val)}</p>
                    </div>
                  ))}
                </div>

                <div className="cdp-paper-section">
                  <span className="cdp-paper-num">05 / APPROVAL</span>
                  <h3>Review, changes & payment</h3>
                  <div className="cdp-rule-stats">
                    <div>
                      <b>{value(data.revisionRounds, "TBD")}</b>
                      <small>Revision rounds</small>
                    </div>
                    <div>
                      <b>{value(data.feedbackDays, "TBD")}</b>
                      <small>Working days for feedback</small>
                    </div>
                  </div>
                  {[
                    ["How feedback works", data.feedbackRules],
                    ["Acceptance criteria", data.acceptance],
                    ["Changes outside this plan", data.changePolicy],
                    ["Payment terms", data.payment],
                  ].map(([label, val]) => (
                    <div className="cdp-def" key={label}>
                      <b>{label}</b>
                      <p>{value(val)}</p>
                    </div>
                  ))}
                  <div className="cdp-signoff">
                    <div>
                      Client approval{" "}
                      <span>________________________</span>
                    </div>
                    <div>
                      Content partner{" "}
                      <span>________________________</span>
                    </div>
                  </div>
                  <p className="cdp-disclaimer">
                    Practical project planning document, not a substitute for
                    a signed services contract.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="cdp-readiness">
              <div className="cdp-readiness-score">
                <strong>{done}/6</strong>
                <span>Core details completed</span>
              </div>
              {[
                "Client/company name",
                "Writer or agency name",
                "At least one deliverable",
                "Final delivery date for each asset",
                "Final approver",
                "Payment terms",
              ].map((x) => (
                <div className="cdp-check-row" key={x}>
                  <span>{issues.includes(x) ? "○" : "✓"}</span>
                  <b>{x}</b>
                  <small>{issues.includes(x) ? "Missing" : "Ready"}</small>
                </div>
              ))}
              <p>
                This check covers the essentials. Review your included work,
                exclusions and feedback rules before sharing.
              </p>
            </div>
          )}

          <div className="cdp-preview-bottom">
            <button className="cdp-ghost" type="button" onClick={copy}>
              {copied ? "✓ Copied" : "Copy plan"}
            </button>
            <button className="cdp-primary" type="button" onClick={printable}>
              Print / Save PDF ↗
            </button>
          </div>
        </aside>
      </div>

      <div className="cdp-bottom-note">
        No account required. Your entries remain in this page while it's open.
        Printing uses your browser's “Save as PDF” option.
      </div>
    </div>
  );
}

export const faqs = [
  {
    question: "Can I use this with an agency or a freelancer?",
    answer:
      "Yes. List any external writer, specialist or content agency as the delivery partner, then specify the assets, fee, dependencies and approval owner.",
  },
  {
    question: "What counts as a revision?",
    answer:
      "Agree the number of consolidated feedback rounds in advance. A new audience, format or approved angle should be handled as a change request, not automatically treated as a revision.",
  },
  {
    question: "How do I share the plan?",
    answer:
      "Use Copy plan to paste the full text into an email or document, or Print / Save PDF to produce a clean version using your browser's print dialog.",
  },
];

const styles = `
.cdp-root {
  --cdp: #167273;
  --cdp-dark: #011f24;
  --cdp-deep: #073538;
  --cdp-light: #eef4f3;
  --cdp-border: #d5e4e1;
  --cdp-muted: #587373;
  font-family: Montserrat, Inter, system-ui, -apple-system, sans-serif;
  color: var(--cdp-dark);
  max-width: 1320px;
  margin: 0 auto;
  padding: 28px 20px 50px;
  box-sizing: border-box;
}
.cdp-root * { box-sizing: border-box; }
.cdp-root button, .cdp-root input, .cdp-root select, .cdp-root textarea { font: inherit; }
.cdp-root button { cursor: pointer; }
.cdp-root button:disabled { opacity: .35; cursor: not-allowed; }
.cdp-topbar { display: flex; justify-content: space-between; gap: 25px; align-items: end; margin-bottom: 27px; }
.cdp-eyebrow { display: block; font-size: 10px; letter-spacing: .15em; font-weight: 850; color: var(--cdp); text-transform: uppercase; }
.cdp-topbar h2 { font-size: clamp(22px, 2.6vw, 32px); margin: 10px 0 8px; letter-spacing: -.055em; font-weight: 800; line-height: 1.12; }
.cdp-topbar p { font-size: 13px; line-height: 1.7; color: #52706c; max-width: 720px; margin: 0; }
.cdp-top-actions { display: flex; gap: 8px; flex-shrink: 0; }
.cdp-ghost { border: 1px solid #c8ddda; background: #fff; color: #194d4d; padding: 11px 14px; border-radius: 9px; font-size: 12px; font-weight: 750; white-space: nowrap; }
.cdp-ghost:hover { border-color: var(--cdp); background: #f3f8f7; }
.cdp-primary { border: 1px solid var(--cdp); background: var(--cdp); color: white; padding: 12px 17px; border-radius: 9px; font-weight: 800; font-size: 12px; white-space: nowrap; }
.cdp-primary:hover { background: #105e60; }
.cdp-layout { display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(350px, .92fr); gap: 22px; align-items: start; }
.cdp-stepper { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; margin-bottom: 12px; }
.cdp-stepper button { display: flex; justify-content: center; align-items: center; gap: 7px; border: 1px solid #d3e2df; background: #fff; padding: 13px 6px; border-radius: 9px; font-size: 11px; font-weight: 800; color: #315354; }
.cdp-stepper button.active { background: #0e5758; color: #fff; border-color: #0e5758; }
.cdp-step-number { display: flex; justify-content: center; align-items: center; border-radius: 50%; height: 20px; width: 20px; flex: 0 0 20px; border: 1.5px solid currentColor; font-size: 10px; }
.cdp-panel { background: #fff; border: 1px solid var(--cdp-border); border-radius: 14px; padding: 27px 27px 19px; box-shadow: 0 8px 30px rgba(1, 40, 42, .025); }
.cdp-panel-header { margin-bottom: 26px; }
.cdp-panel-header h3 { font-size: 24px; letter-spacing: -.045em; margin: 11px 0 8px; line-height: 1.2; }
.cdp-panel-header p { color: #597373; font-size: 12px; line-height: 1.7; margin: 0; }
.cdp-form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.cdp-wide { grid-column: 1 / -1; }
.cdp-field { display: flex; flex-direction: column; gap: 7px; min-width: 0; }
.cdp-field > span { font-weight: 800; font-size: 11px; line-height: 1.5; }
.cdp-req { color: #d05641; }
.cdp-field input, .cdp-field select, .cdp-field textarea { width: 100%; background: #fbfdfc; border: 1px solid #bed3cf; border-radius: 8px; min-height: 43px; padding: 11px 12px; outline: 0; color: #143b3a; font-size: 12px; transition: border-color .15s, box-shadow .15s; }
.cdp-field textarea { resize: vertical; line-height: 1.6; }
.cdp-field input:focus, .cdp-field select:focus, .cdp-field textarea:focus { border-color: var(--cdp); box-shadow: 0 0 0 3px #1672731c; }
.cdp-field small { font-size: 10px; color: #6d8580; line-height: 1.5; }
.cdp-footer { border-top: 1px solid #e0ebea; margin-top: 27px; padding-top: 18px; display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.cdp-footer-right { display: flex; align-items: center; gap: 13px; }
.cdp-footer-right > span { font-size: 10px; color: #77918e; }
.cdp-error { margin-top: 18px; padding: 12px 14px; color: #8c3d25; background: #fff3ee; border: 1px solid #f3c7b6; border-radius: 8px; font-size: 11px; line-height: 1.6; }
.cdp-section-label { display: flex; justify-content: space-between; align-items: center; margin: 24px 0 12px; gap: 12px; }
.cdp-section-label strong { font-size: 13px; }
.cdp-section-label span { font-size: 10px; color: #6d8580; }
.cdp-items { display: grid; gap: 13px; }
.cdp-item { padding: 18px; border: 1px solid #d9e8e4; background: #f9fcfb; border-radius: 11px; }
.cdp-item-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 17px; font-size: 12px; }
.cdp-text-button { border: 0; background: transparent; color: #ab6554; font-size: 11px; font-weight: 750; padding: 3px; }
.cdp-item-total { display: flex; justify-content: flex-end; gap: 9px; border-top: 1px solid #e0eae7; padding-top: 12px; margin-top: 15px; font-size: 11px; color: #5b7672; }
.cdp-item-total strong { color: #073d3d; }
.cdp-add { width: 100%; margin-top: 12px; padding: 13px; border: 1px dashed #8dbab1; border-radius: 9px; background: #f6fbf9; color: var(--cdp); font-size: 12px; font-weight: 800; }
.cdp-add:hover { background: #eaf5f1; }
.cdp-total-bar { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin: 16px 0 25px; padding: 18px 19px; border-radius: 10px; background: #0b3b3d; color: #fff; }
.cdp-total-bar > div { display: flex; flex-direction: column; gap: 5px; }
.cdp-total-bar span { font-size: 10px; color: #bbd4cf; }
.cdp-total-bar strong { font-size: 23px; letter-spacing: -.04em; }
.cdp-total-bar label { font-size: 10px; color: #c2d7d2; }
.cdp-total-bar select { display: block; margin-top: 6px; background: #174d4f; color: #fff; border: 1px solid #517d7a; padding: 7px; border-radius: 7px; font-size: 11px; }
.cdp-check-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.cdp-check-grid label { display: flex; align-items: flex-start; gap: 8px; padding: 12px; border: 1px solid #dce9e6; border-radius: 8px; font-size: 11px; line-height: 1.45; cursor: pointer; }
.cdp-check-grid label.checked { background: #eff8f5; border-color: #b5d8cf; }
.cdp-check-grid input { accent-color: var(--cdp); margin-top: 1px; flex-shrink: 0; }
.cdp-spaced { margin-top: 18px; }
.cdp-preview-wrap { position: sticky; top: 16px; border: 1px solid #d5e4e1; border-radius: 14px; overflow: hidden; background: #fff; box-shadow: 0 10px 40px rgba(1, 40, 42, .045); }
.cdp-preview-tools { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 17px 19px; background: #073b3d; color: #fff; }
.cdp-preview-tools .cdp-eyebrow { color: #90d3c7; font-size: 9px; }
.cdp-preview-tools strong { display: block; font-size: 17px; letter-spacing: -.04em; margin-top: 5px; }
.cdp-status { font-size: 10px; color: #c4e5df; background: #195558; border: 1px solid #387173; border-radius: 20px; padding: 7px 9px; white-space: nowrap; }
.cdp-preview-actions { display: flex; background: #f1f7f5; border-bottom: 1px solid #dce7e3; padding: 6px; gap: 6px; }
.cdp-preview-actions button { flex: 1; padding: 9px; border: 0; background: transparent; border-radius: 7px; font-size: 11px; font-weight: 750; color: #587570; }
.cdp-preview-actions button.active { background: white; color: #0c5454; box-shadow: 0 1px 4px #114e4e1c; }
.cdp-paper { max-height: 660px; overflow-y: auto; background: #fff; scrollbar-color: #abc5bf transparent; scrollbar-width: thin; }
.cdp-paper-cover { background: #eef6f3; padding: 26px 27px 20px; border-bottom: 1px solid #dce9e4; }
.cdp-paper-cover > span { color: #117071; letter-spacing: .14em; font-size: 9px; font-weight: 850; }
.cdp-paper-cover h2 { font-size: 23px; line-height: 1.2; letter-spacing: -.05em; margin: 13px 0 7px; }
.cdp-paper-cover > p { font-size: 11px; color: #66817d; margin: 0; line-height: 1.6; }
.cdp-paper-people { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 23px; }
.cdp-paper-people div { display: flex; flex-direction: column; gap: 6px; }
.cdp-paper-people small, .cdp-mini-stats small { font-size: 8px; font-weight: 800; letter-spacing: .1em; color: #6d9088; }
.cdp-paper-people strong { font-size: 11px; line-height: 1.5; }
.cdp-paper-body { padding: 23px 27px 32px; }
.cdp-mini-stats { display: grid; grid-template-columns: .65fr 1fr 1.1fr; background: #f4f9f7; border: 1px solid #e0ece8; border-radius: 9px; padding: 13px; gap: 10px; }
.cdp-mini-stats div { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.cdp-mini-stats b { font-size: 12px; overflow-wrap: anywhere; }
.cdp-paper-section { margin-top: 27px; padding-top: 22px; border-top: 1px solid #e1eae7; }
.cdp-paper-num { font-size: 9px; font-weight: 850; letter-spacing: .12em; color: #167273; }
.cdp-paper-section h3 { font-size: 16px; letter-spacing: -.03em; margin: 8px 0 18px; }
.cdp-def { margin-top: 14px; }
.cdp-def b { font-size: 10px; color: #174c4b; }
.cdp-def p, .cdp-preview-item p, .cdp-included p, .cdp-excluded p { font-size: 11px; line-height: 1.7; color: #486765; margin: 5px 0 0; white-space: pre-wrap; overflow-wrap: anywhere; }
.cdp-empty { color: #9aaca8; font-style: italic; font-weight: 400; }
.cdp-preview-item { padding: 13px 0; border-bottom: 1px solid #e5eeea; }
.cdp-preview-item-title { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; font-size: 11px; }
.cdp-preview-item-title b { line-height: 1.4; }
.cdp-preview-item-title strong { white-space: nowrap; }
.cdp-preview-item > small { color: #7a918d; font-size: 10px; display: block; margin: 6px 0; }
.cdp-dates { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 9px; font-size: 10px; font-weight: 700; color: #326e6b; }
.cdp-preview-grand { display: flex; justify-content: space-between; padding: 15px 0; font-size: 12px; font-weight: 800; }
.cdp-preview-grand strong { font-size: 16px; }
.cdp-included, .cdp-excluded { padding: 13px 15px; background: #f4f9f7; border-radius: 8px; margin-bottom: 10px; }
.cdp-excluded { background: #fbf6f3; }
.cdp-included b, .cdp-excluded b { font-size: 11px; }
.cdp-included ul { columns: 2; list-style: disc; margin: 9px 0 0 17px; padding: 0; color: #42605e; font-size: 10px; line-height: 1.8; }
.cdp-rule-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.cdp-rule-stats > div { display: flex; flex-direction: column; gap: 4px; padding: 12px; background: #edf6f3; border-radius: 8px; }
.cdp-rule-stats b { font-size: 21px; }
.cdp-rule-stats small { font-size: 9px; color: #5a7772; }
.cdp-signoff { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 28px; padding-top: 16px; border-top: 1px dashed #c4d7d0; font-size: 10px; font-weight: 700; }
.cdp-signoff span { display: block; margin-top: 16px; color: #abbab6; }
.cdp-disclaimer { font-size: 9px; line-height: 1.6; color: #819591; margin-top: 20px; }
.cdp-preview-bottom { display: flex; gap: 8px; padding: 14px 18px; background: #f7faf9; border-top: 1px solid #dce8e4; }
.cdp-preview-bottom button { flex: 1; }
.cdp-readiness { padding: 22px; min-height: 390px; }
.cdp-readiness-score { display: flex; gap: 12px; align-items: center; background: #eaf5f0; padding: 18px; border-radius: 10px; margin-bottom: 12px; }
.cdp-readiness-score strong { font-size: 31px; letter-spacing: -.07em; color: var(--cdp); }
.cdp-readiness-score span { font-size: 12px; color: #3e6661; }
.cdp-check-row { display: flex; gap: 10px; align-items: center; padding: 13px 0; border-bottom: 1px solid #e3ece8; font-size: 11px; }
.cdp-check-row span { color: var(--cdp); font-size: 18px; }
.cdp-check-row b { flex: 1; }
.cdp-check-row small { color: #67857d; }
.cdp-readiness > p { font-size: 11px; line-height: 1.7; color: #65807a; }
.cdp-bottom-note { font-size: 10px; line-height: 1.7; color: #77908a; margin-top: 17px; text-align: center; }

@media (max-width: 1050px) {
  .cdp-layout { grid-template-columns: 1fr; }
  .cdp-preview-wrap { position: static; }
  .cdp-paper { max-height: 720px; }
}
@media (max-width: 600px) {
  .cdp-root { padding: 18px 12px 35px; }
  .cdp-topbar { display: block; }
  .cdp-top-actions { margin-top: 15px; }
  .cdp-top-actions button { flex: 1; }
  .cdp-stepper button { font-size: 10px; gap: 4px; flex-direction: column; }
  .cdp-panel { padding: 19px 15px; }
  .cdp-form-grid { grid-template-columns: 1fr; }
  .cdp-wide { grid-column: auto; }
  .cdp-check-grid { grid-template-columns: 1fr; }
  .cdp-footer-right > span { display: none; }
  .cdp-paper-cover, .cdp-paper-body { padding-left: 19px; padding-right: 19px; }
}
@media print {
  body * { visibility: hidden !important; }
  .cdp-preview-wrap, .cdp-preview-wrap * { visibility: visible !important; }
  .cdp-preview-wrap { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; border: 0 !important; box-shadow: none !important; overflow: visible !important; }
  .cdp-preview-tools, .cdp-preview-actions, .cdp-preview-bottom { display: none !important; }
  .cdp-paper { display: block !important; max-height: none !important; overflow: visible !important; }
  .cdp-paper-cover, .cdp-included, .cdp-excluded, .cdp-mini-stats, .cdp-rule-stats > div { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  .cdp-paper-section, .cdp-preview-item { break-inside: avoid; }
  .cdp-root { padding: 0 !important; margin: 0 !important; max-width: none !important; }
  @page { size: A4; margin: 13mm; }
}
`;