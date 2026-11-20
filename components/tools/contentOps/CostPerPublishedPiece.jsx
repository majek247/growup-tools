"use client";

import React, { useMemo, useState } from "react";

/**
 * GrowUp Content Cost Calculator
 * Standalone React/Next.js client component. No Workspace, charts, or icon packages required.
 * Replace the old tool component with this file; retain your existing route.
 */
const COLORS = {
  teal: "#167273",
  deep: "#011522",
  forest: "#073b3b",
  pale: "#eef4f3",
};

const ROUTES = [
  {
    id: "inhouse",
    name: "In-house team",
    short: "In-house",
    description:
      "Allocated loaded payroll for the people producing content, excluding review time counted separately.",
  },
  {
    id: "freelancer",
    name: "Freelance writers",
    short: "Freelancer",
    description:
      "Writer invoices and commissioned production fees, excluding internal team reviews.",
  },
  {
    id: "agency",
    name: "Content agency",
    short: "Agency",
    description:
      "Agency invoices or retained production fees, excluding internal team reviews.",
  },
];

const EMPTY_ROUTE = {
  enabled: true,
  base: "",
  hours: "",
  extra: "",
  published: "",
  notes: "",
};

const INITIAL = {
  currency: "GBP",
  rate: "",
  period: "Monthly",
  target: "6",
  context: "",
  routes: Object.fromEntries(
    ROUTES.map((r) => [r.id, { ...EMPTY_ROUTE }])
  ),
};

const EXAMPLE = {
  currency: "GBP",
  rate: "55",
  period: "Monthly",
  target: "6",
  context:
    "B2B SaaS buyer-intent programme: product comparisons, integration guides and bottom-of-funnel articles (1,400–2,000 words). Comparable research and editorial standards across routes.",
  routes: {
    inhouse: {
      enabled: true,
      base: "3600",
      hours: "8",
      extra: "160",
      published: "6",
      notes:
        "60% allocation of content specialist's loaded pay (£3,600); £160 for research tools and specialist design. Reviews by Head of Marketing.",
    },
    freelancer: {
      enabled: true,
      base: "2700",
      hours: "20",
      extra: "180",
      published: "5",
      notes:
        "Six commissioned articles at £450 each; five published within the month. £180 for editing and creative support. More internal fact-checking and product corrections.",
    },
    agency: {
      enabled: true,
      base: "3450",
      hours: "6",
      extra: "0",
      published: "6",
      notes:
        "Monthly six-piece package with briefing, copyediting, SEO metadata and two revision rounds included. Internal time covers factual sign-off.",
    },
  },
};

const number = (v) => {
  if (v === "" || v == null) return NaN;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : NaN;
};

const fmt = (n, currency) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n || 0);

const whole = (n) =>
  new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 }).format(n);

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

const validRoute = (r) =>
  r.enabled &&
  [r.base, r.hours, r.extra, r.published].every((v) =>
    Number.isFinite(number(v))
  ) &&
  number(r.published) > 0 &&
  Number.isInteger(number(r.published));

const asCsv = (rows) =>
  rows
    .map((row) =>
      row
        .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\r\n");

export default function ContentCostCalculator() {
  const [data, setData] = useState(() => structuredClone(EXAMPLE));
  const [step, setStep] = useState(0);
  const [view, setView] = useState("comparison");
  const [notice, setNotice] = useState("");
  const [adjust, setAdjust] = useState(0);
  const [expanded, setExpanded] = useState({
    inhouse: true,
    freelancer: true,
    agency: true,
  });

  const update = (key, value) => {
    setData((d) => ({ ...d, [key]: value }));
    setNotice("");
  };

  const routeUpdate = (id, key, value) => {
    setData((d) => ({
      ...d,
      routes: {
        ...d.routes,
        [id]: { ...d.routes[id], [key]: value },
      },
    }));
    setNotice("");
  };

  const rows = useMemo(
    () =>
      ROUTES.map((route) => {
        const r = data.routes[route.id];
        const valid =
          validRoute(r) && Number.isFinite(number(data.rate));

        const production = number(r.base);
        const reviewHours = number(r.hours);
        const other = number(r.extra);
        const published = number(r.published);
        const review = reviewHours * number(data.rate);
        const total = production + review + other;

        return {
          ...route,
          ...r,
          valid,
          production,
          reviewHours,
          other,
          published,
          review,
          total,
          perPiece: total / published,
          reviewShare: total > 0 ? (100 * review) / total : 0,
          basePerPiece: production / published,
        };
      }),
    [data]
  );

  const ready = rows.filter((r) => r.valid);

  const winner =
    ready.length > 0
      ? [...ready].sort((a, b) => a.perPiece - b.perPiece)[0]
      : null;

  const expensive =
    ready.length > 0
      ? [...ready].sort((a, b) => b.perPiece - a.perPiece)[0]
      : null;

  const spread =
    winner && expensive && expensive.perPiece > 0
      ? ((expensive.perPiece - winner.perPiece) / expensive.perPiece) * 100
      : 0;

  const equalVolume =
    ready.length >= 2 &&
    ready.every((r) => r.published === ready[0].published);

  const maxPerPiece = Math.max(1, ...ready.map((r) => r.perPiece));

  const currency = data.currency;

  const projections = rows.map((r) =>
    r.valid
      ? {
          ...r,
          adjusted:
            (r.production +
              r.other +
              r.reviewHours *
                clamp(number(data.rate) + adjust, 0, 10000)) /
            r.published,
        }
      : { ...r, adjusted: NaN }
  );

  const fullReport = () => {
    const parts = [
      "GROWUP — CONTENT COST COMPARISON",
      `Period: ${data.period} | Currency: ${currency} | Internal review cost: ${fmt(
        number(data.rate),
        currency
      )}/hour`,
      `Comparable content: ${data.context || "Not specified"}`,
      "",
      "ROUTE COMPARISON",
    ];

    ready.forEach((r) =>
      parts.push(
        `${r.name}: ${r.published} published | Production ${fmt(
          r.production,
          currency
        )} | Review ${whole(r.reviewHours)} h × ${fmt(
          number(data.rate),
          currency
        )} = ${fmt(r.review, currency)} | Other ${fmt(
          r.other,
          currency
        )} | Total ${fmt(r.total, currency)} | Cost/published piece ${fmt(
          r.perPiece,
          currency
        )}`,
        `Assumptions: ${r.notes || "Not specified"}`
      )
    );

    parts.push(
      "",
      winner
        ? `LOWEST MODELED COST PER PUBLISHED PIECE: ${winner.name} (${fmt(
            winner.perPiece,
            currency
          )})`
        : "No complete routes yet."
    );

    parts.push(
      equalVolume
        ? "All included routes have the same published output."
        : "Different output volumes: cost-per-piece is comparable, but total capacity is not equal. Check like-for-like complexity and quality."
    );

    parts.push(
      "Method: (production spend + internal review hours × fully loaded review rate + other costs) ÷ pieces actually published. Do not double-count review time inside payroll/fees. This is a cost comparison, not a quality or ROI ranking."
    );

    return parts.join("\n");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullReport());
      setNotice("Report copied to clipboard.");
    } catch {
      setNotice("Clipboard unavailable. Use Download CSV or Print / PDF.");
    }
  };

  const csv = () => {
    const csvText = asCsv([
      [
        "Route",
        "Period",
        "Currency",
        "Production spend",
        "Internal review hours",
        "Review hourly rate",
        "Internal review cost",
        "Other costs",
        "Published pieces",
        "Total cost",
        "Cost per published piece",
        "Assumptions",
      ],
      ...ready.map((r) => [
        r.name,
        data.period,
        currency,
        r.production,
        r.reviewHours,
        number(data.rate),
        r.review,
        r.other,
        r.published,
        r.total,
        r.perPiece.toFixed(2),
        r.notes,
      ]),
    ]);

    const blob = new Blob(["\ufeff" + csvText], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "growup-content-cost-comparison.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setNotice("CSV downloaded.");
  };

  const reset = () => {
    setData(structuredClone(INITIAL));
    setStep(0);
    setView("comparison");
    setAdjust(0);
    setNotice("Started fresh. Fill in your own assumptions.");
  };

  const example = () => {
    setData(structuredClone(EXAMPLE));
    setStep(0);
    setView("comparison");
    setAdjust(0);
    setNotice("Example loaded: a realistic B2B SaaS content programme.");
  };

  const print = () => window.print();

  const field = (label, value, onChange, opts = {}) => (
    <label className="cc-field">
      <span className="cc-label">
        {label}
        {opts.tooltip && (
          <small title={opts.tooltip} className="cc-info">
            ⓘ
          </small>
        )}
      </span>
      <div className="cc-input-wrap">
        {opts.prefix && <span className="cc-affix">{opts.prefix}</span>}
        <input
          aria-label={label}
          type={opts.type || "number"}
          min={opts.type === "text" ? undefined : 0}
          step={opts.step || (opts.type === "text" ? undefined : "any")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={opts.placeholder || "0"}
        />
        {opts.suffix && <span className="cc-affix">{opts.suffix}</span>}
      </div>
      {opts.help && <span className="cc-help">{opts.help}</span>}
    </label>
  );

  return (
    <div className="cc-root">
      <style>{styles}</style>
      <div className="cc-wrap">
        {/* TOP BAR */}
        <div className="cc-topbar">
          <div>
            <span className="cc-overline">
              <span className="cc-dot" /> CONTENT OPERATIONS / CALCULATOR
            </span>
            <h1>Content Cost Calculator</h1>
            <p>
              Calculate the true cost of producing content in-house or
              outsourcing to freelancers and agencies, including internal
              review time.
            </p>
          </div>
          <span className="cc-brandmark">
            GROWUP <span>TOOLKIT</span>
          </span>
        </div>

        {/* STEP NAV */}
        <div className="cc-steps" aria-label="Calculator steps">
          {[
            ["1", "Set assumptions"],
            ["2", "Compare routes"],
            ["3", "Review & export"],
          ].map(([n, name], i) => (
            <button
              key={n}
              type="button"
              className={`cc-step ${step === i ? "active" : ""}`}
              onClick={() => setStep(i)}
            >
              <b>{n}</b>
              {name}
            </button>
          ))}
          <span className="cc-step-spacer" />
          <button className="cc-textbtn" onClick={example}>
            ↺ Use example
          </button>
          <button className="cc-textbtn" onClick={reset}>
            Start fresh
          </button>
        </div>

        <div className="cc-layout">
          {/* EDITOR PANEL */}
          <section className="cc-panel cc-editor" aria-label="Calculator inputs">
            <div className="cc-section-head">
              <span className="cc-kicker">STEP {step + 1} OF 3</span>
              <span className="cc-stepnote">
                {step === 0
                  ? "Set your baseline"
                  : step === 1
                  ? "Same period, comparable content"
                  : "Your decision summary"}
              </span>
            </div>

            {/* STEP 0 */}
            {step === 0 && (
              <>
                <h2>Start with the hidden cost</h2>
                <p className="cc-intro">
                  What does one hour of internal review actually cost? Include
                  salary, employer contributions and reasonable overhead, not
                  just take-home pay.
                </p>

                <div className="cc-grid2">
                  <label className="cc-field">
                    <span className="cc-label">Currency</span>
                    <select
                      value={data.currency}
                      onChange={(e) => update("currency", e.target.value)}
                    >
                      <option value="GBP">GBP — British pound</option>
                      <option value="USD">USD — US dollar</option>
                      <option value="EUR">EUR — Euro</option>
                      <option value="NGN">NGN — Nigerian naira</option>
                    </select>
                  </label>

                  <label className="cc-field">
                    <span className="cc-label">Comparison period</span>
                    <select
                      value={data.period}
                      onChange={(e) => update("period", e.target.value)}
                    >
                      <option>Monthly</option>
                      <option>Quarterly</option>
                    </select>
                  </label>

                  {field("Fully loaded reviewer cost", data.rate, (v) =>
                    update("rate", v)
                  , {
                    suffix: "/ hour",
                    placeholder: "e.g. 55",
                    help: "Use a blended rate if multiple colleagues review content.",
                  })}

                  {field("Target published pieces", data.target, (v) =>
                    update("target", v)
                  , {
                    suffix: "pieces",
                    step: "1",
                    placeholder: "e.g. 6",
                    help: "Planning target only — actual output drives the calculation.",
                  })}
                </div>

                <label className="cc-field cc-full">
                  <span className="cc-label">
                    What type of content are you comparing?
                  </span>
                  <textarea
                    rows={4}
                    value={data.context}
                    onChange={(e) => update("context", e.target.value)}
                    placeholder="e.g. SEO comparison pages and buyer guides for the same target market, 1,400–2,000 words each..."
                  />
                  <span className="cc-help">
                    Important: compare content with similar research, complexity,
                    quality and approval standards.
                  </span>
                </label>

                <div className="cc-tip">
                  <span>✦</span>
                  <div>
                    <strong>Avoid double-counting.</strong> If a salary or
                    supplier fee already includes a person's review time, don't
                    count those same hours again. The separate review field is
                    for additional internal oversight.
                  </div>
                </div>
              </>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <h2>What does each route really cost?</h2>
                <p className="cc-intro">
                  Enter actual spend and output for the same{" "}
                  {data.period.toLowerCase()} period. Leave a route switched off
                  if you don't use it.
                </p>

                <div className="cc-route-stack">
                  {ROUTES.map((route) => {
                    const r = data.routes[route.id];
                    const row = rows.find((x) => x.id === route.id);

                    return (
                      <div
                        key={route.id}
                        className={`cc-route-card ${
                          r.enabled ? "" : "disabled"
                        }`}
                      >
                        <div className="cc-route-head">
                          <div className="cc-route-icon">
                            {route.id === "inhouse"
                              ? "⌂"
                              : route.id === "freelancer"
                              ? "✎"
                              : "▦"}
                          </div>
                          <div className="cc-route-name">
                            <strong>{route.name}</strong>
                            <span>{route.description}</span>
                          </div>
                          <label className="cc-toggle">
                            <input
                              type="checkbox"
                              checked={r.enabled}
                              onChange={(e) =>
                                routeUpdate(
                                  route.id,
                                  "enabled",
                                  e.target.checked
                                )
                              }
                            />
                            <span className="cc-track" />
                            <span className="cc-sr">
                              Include {route.name}
                            </span>
                          </label>
                        </div>

                        {r.enabled && (
                          <>
                            <div className="cc-route-fields">
                              {field(
                                route.id === "inhouse"
                                  ? "Allocated production payroll"
                                  : "Production fees / invoices",
                                r.base,
                                (v) => routeUpdate(route.id, "base", v),
                                {
                                  help:
                                    route.id === "inhouse"
                                      ? "Only the portion attributable to producing these pieces."
                                      : "Fees for the content produced in this period.",
                                }
                              )}
                              {field(
                                "Internal review hours",
                                r.hours,
                                (v) => routeUpdate(route.id, "hours", v),
                                {
                                  suffix: "hours",
                                  help: "Briefing, SME checks, editing, approvals and rework by your team.",
                                }
                              )}
                              {field(
                                "Other costs",
                                r.extra,
                                (v) => routeUpdate(route.id, "extra", v),
                                {
                                  help: "Design, publishing, tools or additional costs not already included.",
                                }
                              )}
                              {field(
                                "Actually published",
                                r.published,
                                (v) => routeUpdate(route.id, "published", v),
                                {
                                  suffix: "pieces",
                                  step: "1",
                                  help: "Use completed, approved, live pieces — not drafts or commissions.",
                                }
                              )}
                            </div>

                            <label className="cc-field cc-full">
                              <span className="cc-label">
                                Notes & assumptions{" "}
                                <span className="cc-optional">optional</span>
                              </span>
                              <textarea
                                rows={2}
                                value={r.notes}
                                onChange={(e) =>
                                  routeUpdate(
                                    route.id,
                                    "notes",
                                    e.target.value
                                  )
                                }
                                placeholder="What was included? Why might this route need more reviews?"
                              />
                            </label>

                            <div className="cc-mini-summary">
                              <span>
                                {row.valid
                                  ? `${fmt(row.total, currency)} total`
                                  : "Complete the four cost fields to calculate"}
                              </span>
                              <strong>
                                {row.valid
                                  ? `${fmt(
                                      row.perPiece,
                                      currency
                                    )} / published piece`
                                  : "—"}
                              </strong>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <h2>Make the comparison useful</h2>
                <p className="cc-intro">
                  Cost per published piece tells you where spend goes. It
                  doesn't measure commercial impact, editorial quality or speed
                  on its own.
                </p>

                {winner ? (
                  <>
                    <div className="cc-winner">
                      <span className="cc-kicker">
                        LOWEST MODELED COST / PIECE
                      </span>
                      <h3>{winner.name}</h3>
                      <div className="cc-winner-price">
                        {fmt(winner.perPiece, currency)}{" "}
                        <span>per published piece</span>
                      </div>
                      <p>
                        Based on {winner.published} published pieces and{" "}
                        {fmt(winner.total, currency)} in total{" "}
                        {data.period.toLowerCase()} costs.
                      </p>
                    </div>

                    <div className="cc-audit">
                      <strong>Before choosing a route, check:</strong>
                      <ul>
                        <li>
                          Are research depth and editorial standards actually
                          comparable?
                        </li>
                        <li>
                          Do deadlines, revisions and SME availability differ?
                        </li>
                        <li>
                          Is the lower-cost route producing qualified leads and
                          pipeline?
                        </li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="cc-empty-state">
                    Add a review rate and complete at least one production route
                    to create your cost comparison.
                  </div>
                )}

                <h3 className="cc-small-heading">Share or export</h3>
                <div className="cc-actions">
                  <button
                    disabled={!ready.length}
                    className="cc-primary"
                    onClick={copy}
                  >
                    Copy summary
                  </button>
                  <button
                    disabled={!ready.length}
                    className="cc-secondary"
                    onClick={csv}
                  >
                    ↓ Download CSV
                  </button>
                  <button
                    disabled={!ready.length}
                    className="cc-secondary"
                    onClick={print}
                  >
                    Print / Save PDF
                  </button>
                </div>
                <p className="cc-help">
                  Your numbers stay in this browser tab. Print / Save PDF uses
                  your browser's print dialog.
                </p>
              </>
            )}

            <div className="cc-footer-nav">
              <button
                className="cc-secondary"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                ← Back
              </button>
              {step < 2 && (
                <button
                  className="cc-primary"
                  onClick={() => setStep((s) => s + 1)}
                >
                  Continue <span>→</span>
                </button>
              )}
            </div>

            {notice && (
              <div role="status" className="cc-notice">
                {notice}
              </div>
            )}
          </section>

          {/* RESULTS PANEL */}
          <aside className="cc-results" aria-label="Live cost comparison">
            <div className="cc-results-head">
              <span className="cc-kicker cc-kicker-light">
                ● LIVE COMPARISON
              </span>
              <h2>Your production costs</h2>
              <p>Updated as you change your assumptions.</p>
            </div>

            <div className="cc-results-body">
              <div className="cc-segment" role="group" aria-label="Result view">
                <button
                  className={view === "comparison" ? "selected" : ""}
                  onClick={() => setView("comparison")}
                >
                  Comparison
                </button>
                <button
                  className={view === "breakdown" ? "selected" : ""}
                  onClick={() => setView("breakdown")}
                >
                  Cost breakdown
                </button>
              </div>

              {ready.length ? (
                <>
                  <div className="cc-stat-grid">
                    <div className="cc-stat">
                      <span>Lowest cost / piece</span>
                      <strong>{fmt(winner.perPiece, currency)}</strong>
                      <small>{winner.name}</small>
                    </div>
                    <div className="cc-stat">
                      <span>Compared routes</span>
                      <strong>{ready.length}</strong>
                      <small>{data.period.toLowerCase()} basis</small>
                    </div>
                  </div>

                  {view === "comparison" ? (
                    <>
                      <div className="cc-graph-heading">
                        <strong>Cost per published piece</strong>
                        <span>{currency}</span>
                      </div>

                      <div className="cc-bar-chart">
                        {ready.map((r) => (
                          <div className="cc-bar-row" key={r.id}>
                            <div className="cc-bar-top">
                              <span>
                                {r.short}
                                {r.id === winner.id && <em>Lowest</em>}
                              </span>
                              <strong>{fmt(r.perPiece, currency)}</strong>
                            </div>
                            <div className="cc-bar-track">
                              <span
                                style={{
                                  width: `${Math.max(
                                    1,
                                    (r.perPiece / maxPerPiece) * 100
                                  )}%`,
                                  background:
                                    r.id === winner.id
                                      ? COLORS.teal
                                      : "#96b5b2",
                                }}
                              />
                            </div>
                            <small>
                              {r.published} published ·{" "}
                              {fmt(r.total, currency)} total
                            </small>
                          </div>
                        ))}
                      </div>

                      <div className="cc-divider" />

                      <div className="cc-compare-table">
                        <div className="cc-table-head">
                          <span>Route</span>
                          <span>Review time</span>
                          <span>Total cost</span>
                        </div>
                        {ready.map((r) => (
                          <div className="cc-table-row" key={r.id}>
                            <span>{r.short}</span>
                            <span>{whole(r.reviewHours)} h</span>
                            <strong>{fmt(r.total, currency)}</strong>
                          </div>
                        ))}
                      </div>

                      {!equalVolume && ready.length > 1 && (
                        <div className="cc-warning">
                          ⚑ Output volumes differ. Cost per piece is comparable,
                          but total delivery capacity isn't equal.
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="cc-graph-heading">
                        <strong>Where each route spends money</strong>
                        <span>{currency}</span>
                      </div>

                      {ready.map((r) => (
                        <div className="cc-breakdown" key={r.id}>
                          <div className="cc-bar-top">
                            <strong>{r.name}</strong>
                            <strong>{fmt(r.total, currency)}</strong>
                          </div>
                          <div
                            className="cc-stacked"
                            aria-label={`${r.name} cost composition`}
                          >
                            <span
                              style={{
                                width: `${
                                  (r.production / (r.total || 1)) * 100
                                }%`,
                                background: COLORS.teal,
                              }}
                            />
                            <span
                              style={{
                                width: `${
                                  (r.review / (r.total || 1)) * 100
                                }%`,
                                background: "#d7a661",
                              }}
                            />
                            <span
                              style={{
                                width: `${
                                  (r.other / (r.total || 1)) * 100
                                }%`,
                                background: "#abc6c1",
                              }}
                            />
                          </div>
                          <div className="cc-breakdown-lines">
                            <span>
                              Production{" "}
                              <b>{fmt(r.production, currency)}</b>
                            </span>
                            <span>
                              Internal review{" "}
                              <b>{fmt(r.review, currency)}</b>
                            </span>
                            <span>
                              Other <b>{fmt(r.other, currency)}</b>
                            </span>
                          </div>
                        </div>
                      ))}

                      <div className="cc-legend">
                        <span>
                          <i style={{ background: COLORS.teal }} />
                          Production
                        </span>
                        <span>
                          <i style={{ background: "#d7a661" }} />
                          Review
                        </span>
                        <span>
                          <i style={{ background: "#abc6c1" }} />
                          Other
                        </span>
                      </div>
                    </>
                  )}

                  <div className="cc-sensitivity">
                    <div className="cc-sensitivity-head">
                      <strong>What if review time costs more?</strong>
                      <span>
                        {adjust >= 0 ? "+" : ""}
                        {fmt(adjust, currency)}/hour
                      </span>
                    </div>
                    <input
                      aria-label="Adjust internal review hourly rate"
                      type="range"
                      min="-40"
                      max="100"
                      step="5"
                      value={adjust}
                      onChange={(e) => setAdjust(Number(e.target.value))}
                    />
                    <p>
                      Scenario rate:{" "}
                      {fmt(
                        clamp(number(data.rate) + adjust, 0, 10000),
                        currency
                      )}
                      /hour
                    </p>
                    <div className="cc-scenario-list">
                      {projections
                        .filter((r) => r.valid)
                        .map((r) => (
                          <div key={r.id}>
                            <span>{r.short}</span>
                            <b>{fmt(r.adjusted, currency)}/piece</b>
                          </div>
                        ))}
                    </div>
                    <button
                      className="cc-link-btn"
                      onClick={() => setAdjust(0)}
                    >
                      Reset scenario ↺
                    </button>
                  </div>

                  <div className="cc-method">
                    <strong>The formula</strong>
                    <p>
                      (Production spend + internal review hours × loaded hourly
                      rate + other costs) ÷ pieces actually published.
                    </p>
                  </div>
                </>
              ) : (
                <div className="cc-empty-state">
                  <div className="cc-empty-icon">▤</div>
                  <strong>Your comparison will appear here</strong>
                  <p>
                    Enter a valid review rate and the costs and published output
                    for at least one route.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>

        <div className="cc-bottom">
          <strong>Know the cost. Then judge the value.</strong>
          <p>
            Two articles with the same price can demand very different research,
            SME time and editorial work. Use this calculator to expose the cost
            structure — not as a substitute for evaluating quality and pipeline
            contribution.
          </p>
        </div>
      </div>

      <div className="cc-print-only">
        <h1>GrowUp — Content Cost Comparison</h1>
        <pre>{fullReport()}</pre>
      </div>
    </div>
  );
}

export const faqs = [
  {
    question: "How is the cost per published piece calculated?",
    answer:
      "Add production spend, internal review hours multiplied by the fully loaded hourly rate, and any other costs. Divide by the number of pieces actually published in the same period. Avoid counting review costs twice.",
  },
  {
    question:
      "Can I compare in-house, freelancers and agencies fairly?",
    answer:
      "Yes, provided you compare the same period and similar content types, quality standards and research complexity. Use allocated loaded payroll for in-house production, supplier invoices for outsourced production, and count additional internal reviews separately.",
  },
  {
    question:
      "What if some commissioned pieces haven't been published yet?",
    answer:
      "Use only pieces published during the period. Make a note if spending includes work that will publish in a later period, as timing differences can distort the comparison.",
  },
  {
    question: "How can I share the results?",
    answer:
      "Use Copy summary for a written breakdown, Download CSV for a spreadsheet-ready comparison, or Print / Save PDF through your browser.",
  },
];

const styles = `
.cc-root {
  --cc-teal: #167273;
  --cc-deep: #011522;
  --cc-dark: #073b3b;
  --cc-muted: #557070;
  --cc-line: #d5e3df;
  --cc-bg: #eef4f3;
  color: var(--cc-deep);
  font-family: Montserrat, Inter, ui-sans-serif, system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #f8faf9;
  min-height: 100%;
  font-size: 14px;
  line-height: 1.5;
}
.cc-root * { box-sizing: border-box; }
.cc-root button,
.cc-root input,
.cc-root select,
.cc-root textarea { font: inherit; }
.cc-root button { cursor: pointer; }
.cc-root button:disabled { cursor: not-allowed; opacity: .4; }
.cc-root button:focus-visible,
.cc-root input:focus-visible,
.cc-root textarea:focus-visible,
.cc-root select:focus-visible {
  outline: 3px solid #7ac5ba;
  outline-offset: 2px;
}
.cc-wrap {
  max-width: 1240px;
  margin: 0 auto;
  padding: 38px 26px 72px;
}
.cc-topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 32px;
  padding: 4px 0 34px;
}
.cc-topbar h1 {
  font-size: clamp(32px, 3.6vw, 49px);
  letter-spacing: -.048em;
  line-height: 1.12;
  margin: 12px 0 14px;
  font-weight: 800;
  color: #082f30;
}
.cc-topbar p {
  max-width: 720px;
  color: #3d6360;
  font-size: 15px;
  line-height: 1.75;
  margin: 0;
}
.cc-overline,
.cc-kicker {
  font-size: 10px;
  letter-spacing: .17em;
  color: var(--cc-teal);
  font-weight: 800;
}
.cc-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--cc-teal);
  margin-right: 7px;
}
.cc-brandmark {
  white-space: nowrap;
  color: var(--cc-teal);
  font-weight: 900;
  letter-spacing: -.02em;
}
.cc-brandmark span {
  font-size: 10px;
  color: #577b78;
  font-weight: 700;
  letter-spacing: .13em;
  border-left: 1px solid #c5d7d3;
  padding-left: 12px;
  margin-left: 7px;
}
.cc-steps {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 21px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--cc-line);
}
.cc-step {
  border: 1px solid #cbded9;
  background: #fff;
  border-radius: 9px;
  padding: 10px 13px;
  display: flex;
  align-items: center;
  gap: 9px;
  color: #284b4a;
  font-weight: 750;
  font-size: 12px;
}
.cc-step b {
  border: 1.5px solid currentColor;
  width: 21px;
  height: 21px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  font-size: 11px;
}
.cc-step.active {
  background: #0b5b5c;
  color: #fff;
  border-color: #0b5b5c;
}
.cc-step-spacer { flex: 1; }
.cc-textbtn {
  border: 0;
  background: transparent;
  color: #167273;
  font-weight: 750;
  font-size: 12px;
  padding: 9px;
}
.cc-textbtn:hover { text-decoration: underline; }
.cc-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.23fr) minmax(360px, .9fr);
  gap: 20px;
  align-items: start;
}
.cc-panel,
.cc-results {
  border: 1px solid var(--cc-line);
  border-radius: 14px;
  overflow: hidden;
  background: white;
}
.cc-editor { padding: 27px 29px; }
.cc-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.cc-stepnote { font-size: 11px; color: #7a918d; font-weight: 600; }
.cc-editor h2 {
  font-size: 25px;
  line-height: 1.25;
  letter-spacing: -.045em;
  margin: 16px 0 9px;
  font-weight: 800;
  color: #0c3536;
}
.cc-intro {
  color: #5b7672;
  font-size: 13px;
  line-height: 1.7;
  margin: 0 0 24px;
  max-width: 600px;
}
.cc-grid2,
.cc-route-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 17px 16px;
}
.cc-field { display: flex; flex-direction: column; gap: 7px; min-width: 0; }
.cc-label { font-size: 12px; font-weight: 750; color: #173f3f; }
.cc-info {
  display: inline-grid;
  place-items: center;
  margin-left: 6px;
  border-radius: 50%;
  color: #678b87;
  font-size: 12px;
  cursor: help;
}
.cc-field input,
.cc-field select,
.cc-field textarea {
  width: 100%;
  border: 1px solid #bad2cc;
  background: #fcfefd;
  color: #123a3a;
  border-radius: 8px;
  padding: 12px 13px;
  outline: none;
  min-height: 45px;
  transition: border-color .15s, box-shadow .15s;
}
.cc-field textarea { resize: vertical; min-height: 82px; }
.cc-input-wrap {
  display: flex;
  align-items: stretch;
  position: relative;
}
.cc-input-wrap input { min-width: 0; }
.cc-affix {
  display: flex;
  align-items: center;
  padding: 0 12px;
  white-space: nowrap;
  background: #f0f6f4;
  color: #5f7775;
  font-size: 12px;
  border: 1px solid #bad2cc;
  border-left: 0;
  border-radius: 0 8px 8px 0;
}
.cc-input-wrap:has(.cc-affix) input { border-radius: 8px 0 0 8px; }
.cc-help { color: #7b918d; font-size: 11px; line-height: 1.55; }
.cc-full { margin-top: 18px; }
.cc-optional { font-weight: 500; color: #839994; }
.cc-tip {
  display: flex;
  gap: 11px;
  padding: 15px;
  background: #edf6f4;
  border: 1px solid #d4e6e1;
  border-radius: 9px;
  margin-top: 24px;
  color: #3d6460;
  font-size: 12px;
  line-height: 1.65;
}
.cc-tip span { font-size: 20px; color: var(--cc-teal); }
.cc-tip strong { color: #194c4b; }
.cc-route-stack { display: flex; flex-direction: column; gap: 15px; }
.cc-route-card {
  border: 1px solid #d5e4df;
  border-radius: 11px;
  padding: 19px;
  background: #fff;
}
.cc-route-card.disabled { background: #f8faf9; opacity: .77; }
.cc-route-head { display: flex; align-items: center; gap: 12px; }
.cc-route-icon {
  width: 39px;
  height: 39px;
  background: #e9f3f0;
  display: grid;
  place-items: center;
  color: var(--cc-teal);
  border-radius: 10px;
  flex: none;
  font-size: 20px;
}
.cc-route-name {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.cc-route-name strong { font-size: 14px; color: #153f3f; }
.cc-route-name span { color: #738b86; font-size: 11px; line-height: 1.45; }
.cc-route-fields { margin-top: 18px; }
.cc-toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  flex: none;
}
.cc-toggle input {
  opacity: 0;
  position: absolute;
  width: 1px;
  height: 1px;
}
.cc-track {
  width: 37px;
  height: 22px;
  border-radius: 30px;
  background: #c9d9d5;
  position: relative;
  transition: background .18s;
}
.cc-track:after {
  content: "";
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  position: absolute;
  top: 3px;
  left: 3px;
  transition: transform .18s;
}
.cc-toggle input:checked + .cc-track { background: var(--cc-teal); }
.cc-toggle input:checked + .cc-track:after { transform: translateX(15px); }
.cc-toggle input:focus-visible + .cc-track {
  outline: 3px solid #7ac5ba;
  outline-offset: 3px;
}
.cc-sr {
  position: absolute;
  clip: rect(0 0 0 0);
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.cc-mini-summary {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  border-top: 1px solid #e3ebe8;
  margin-top: 19px;
  padding-top: 15px;
  color: #637e78;
  font-size: 11px;
}
.cc-mini-summary strong {
  color: var(--cc-teal);
  font-size: 13px;
  white-space: nowrap;
}
.cc-footer-nav {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 27px;
}
.cc-primary,
.cc-secondary {
  padding: 11px 16px;
  border-radius: 8px;
  font-weight: 750;
  font-size: 12px;
  border: 1px solid #bcd2cc;
  background: #fff;
  color: #28514e;
}
.cc-primary {
  color: #fff;
  background: #0c5c5d;
  border-color: #0c5c5d;
}
.cc-primary:hover:not(:disabled) { background: #084748; }
.cc-secondary:hover:not(:disabled) { background: #f0f7f5; }
.cc-primary span { margin-left: 7px; }
.cc-notice {
  margin-top: 14px;
  padding: 11px 13px;
  border-radius: 8px;
  background: #e6f4f0;
  color: #145d57;
  font-weight: 700;
  font-size: 12px;
}
.cc-actions { display: flex; flex-wrap: wrap; gap: 9px; }
.cc-small-heading { font-size: 15px; margin: 24px 0 13px; }
.cc-winner {
  background: linear-gradient(145deg, #e6f4ee, #f4faf8);
  border: 1px solid #c9dfd5;
  border-radius: 12px;
  padding: 20px;
}
.cc-winner h3 { font-size: 21px; letter-spacing: -.03em; margin: 7px 0; }
.cc-winner-price {
  font-weight: 850;
  font-size: 29px;
  letter-spacing: -.04em;
  color: #126565;
}
.cc-winner-price span {
  font-size: 12px;
  letter-spacing: 0;
  color: #557a72;
  font-weight: 600;
}
.cc-winner p { font-size: 12px; color: #607c77; margin: 10px 0 0; }
.cc-audit { padding: 15px 2px; font-size: 12px; color: #486a65; }
.cc-audit ul { padding-left: 19px; line-height: 1.95; }
.cc-results { position: sticky; top: 20px; }
.cc-results-head {
  background: #073b3b;
  color: #fff;
  padding: 23px 23px 20px;
}
.cc-kicker-light { color: #96dbce; }
.cc-results-head h2 {
  font-size: 23px;
  letter-spacing: -.04em;
  line-height: 1.2;
  margin: 8px 0 5px;
}
.cc-results-head p { margin: 0; color: #afcfca; font-size: 11px; }
.cc-results-body { padding: 20px; }
.cc-segment {
  display: flex;
  gap: 2px;
  background: #edf3f0;
  border-radius: 9px;
  padding: 4px;
  margin-bottom: 19px;
}
.cc-segment button {
  flex: 1;
  border: 0;
  background: transparent;
  border-radius: 7px;
  padding: 9px 6px;
  color: #6b8681;
  font-size: 11px;
  font-weight: 750;
}
.cc-segment button.selected {
  background: #fff;
  color: #165d5b;
  box-shadow: 0 1px 5px #163b3b12;
}
.cc-stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.cc-stat {
  padding: 14px;
  border-radius: 10px;
  background: #f0f6f4;
  display: flex;
  flex-direction: column;
}
.cc-stat > span { font-size: 10px; color: #607b76; font-weight: 700; }
.cc-stat strong {
  font-size: 24px;
  color: #0d5756;
  letter-spacing: -.045em;
  margin: 5px 0 1px;
}
.cc-stat small { font-size: 11px; color: #63827b; }
.cc-graph-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 24px 0 15px;
  color: #294e4b;
  font-size: 12px;
}
.cc-graph-heading span { color: #8ca19d; font-size: 11px; }
.cc-bar-chart { display: flex; flex-direction: column; gap: 17px; }
.cc-bar-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  color: #2b5150;
}
.cc-bar-top em {
  font-style: normal;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: .08em;
  border-radius: 4px;
  background: #e4f2ed;
  color: #176a60;
  padding: 3px 5px;
  margin-left: 7px;
  font-weight: 800;
}
.cc-bar-track {
  height: 12px;
  border-radius: 5px;
  background: #edf3f1;
  overflow: hidden;
  margin-top: 7px;
}
.cc-bar-track span {
  height: 100%;
  display: block;
  border-radius: 5px;
  transition: width .25s;
}
.cc-bar-row small {
  font-size: 10px;
  color: #80948e;
  display: block;
  margin-top: 6px;
}
.cc-divider {
  height: 1px;
  background: #e4eeea;
  margin: 22px 0;
}
.cc-compare-table { font-size: 11px; }
.cc-table-head,
.cc-table-row {
  display: grid;
  grid-template-columns: 1.1fr .8fr 1fr;
  gap: 7px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #edf2ef;
}
.cc-table-head { color: #7c928c; font-size: 10px; font-weight: 750; }
.cc-table-head span:last-child,
.cc-table-row strong { text-align: right; }
.cc-table-row { color: #335b56; }
.cc-table-row strong { color: #133e3d; }
.cc-warning {
  margin-top: 17px;
  border-radius: 8px;
  background: #fdf5e8;
  padding: 11px 12px;
  color: #7f5932;
  font-size: 11px;
  line-height: 1.6;
}
.cc-breakdown { margin: 0 0 23px; }
.cc-stacked {
  height: 14px;
  display: flex;
  border-radius: 5px;
  overflow: hidden;
  background: #edf4f1;
  margin: 9px 0;
}
.cc-stacked span { height: 100%; }
.cc-breakdown-lines {
  display: grid;
  gap: 4px;
  font-size: 10px;
  color: #728a85;
}
.cc-breakdown-lines span {
  display: flex;
  justify-content: space-between;
}
.cc-breakdown-lines b { color: #31534e; }
.cc-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 10px;
  color: #6c8c84;
}
.cc-legend span { display: flex; align-items: center; gap: 5px; }
.cc-legend i {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}
.cc-sensitivity {
  margin-top: 25px;
  padding: 17px;
  background: #f6faf8;
  border: 1px solid #e2ece7;
  border-radius: 10px;
}
.cc-sensitivity-head {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 12px;
}
.cc-sensitivity-head span {
  color: #167273;
  font-weight: 800;
  white-space: nowrap;
}
.cc-sensitivity input {
  width: 100%;
  accent-color: #167273;
  margin: 16px 0 1px;
}
.cc-sensitivity p { font-size: 10px; color: #748d87; margin: 0 0 12px; }
.cc-scenario-list { display: grid; gap: 8px; }
.cc-scenario-list > div {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 11px;
  color: #52766d;
}
.cc-scenario-list b { color: #174e4c; }
.cc-link-btn {
  margin-top: 11px;
  border: 0;
  background: none;
  padding: 0;
  color: #167273;
  font-size: 11px;
  font-weight: 700;
}
.cc-method {
  border-top: 1px solid #e3ece9;
  margin-top: 22px;
  padding-top: 17px;
  font-size: 11px;
  color: #5c7972;
}
.cc-method strong { color: #244e4a; }
.cc-method p { line-height: 1.7; margin: 6px 0 0; }
.cc-empty-state {
  border: 1px dashed #bfd5ce;
  border-radius: 11px;
  padding: 25px 20px;
  text-align: center;
  color: #6b8881;
  font-size: 12px;
  line-height: 1.7;
  background: #f8fbfa;
}
.cc-empty-state strong { display: block; color: #224c47; font-size: 14px; }
.cc-empty-state p { margin: 5px 0 0; }
.cc-empty-icon { font-size: 31px; color: #abc7bc; margin-bottom: 9px; }
.cc-bottom { max-width: 800px; padding: 32px 2px 0; }
.cc-bottom strong { font-size: 17px; color: #164c4a; }
.cc-bottom p { font-size: 12px; color: #748e87; line-height: 1.85; }
.cc-print-only { display: none; }

@media (max-width: 950px) {
  .cc-layout { grid-template-columns: 1fr; }
  .cc-results { position: static; }
  .cc-wrap { padding: 28px 18px 55px; }
  .cc-brandmark { display: none; }
}
@media (max-width: 560px) {
  .cc-wrap { padding: 20px 12px 40px; }
  .cc-topbar { padding-bottom: 24px; }
  .cc-topbar h1 { font-size: 32px; }
  .cc-grid2,
  .cc-route-fields { grid-template-columns: 1fr; }
  .cc-editor { padding: 19px 16px; }
  .cc-results-body { padding: 16px; }
  .cc-step { font-size: 10px; padding: 8px; }
  .cc-step-spacer { display: none; }
  .cc-route-card { padding: 14px; }
  .cc-mini-summary { flex-wrap: wrap; }
  .cc-actions { flex-direction: column; }
  .cc-actions button { width: 100%; }
  .cc-stepnote { display: none; }
}
@media print {
  body * { visibility: hidden !important; }
  .cc-root .cc-print-only,
  .cc-root .cc-print-only * { visibility: visible !important; }
  .cc-print-only {
    display: block !important;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 30px;
    background: white;
    color: black;
  }
  .cc-print-only h1 { font: 700 23px Arial, sans-serif; }
  .cc-print-only pre {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    font: 12px/1.8 Arial, sans-serif;
  }
  .cc-wrap { display: none !important; }
  @page { margin: 16mm; }
}
`;