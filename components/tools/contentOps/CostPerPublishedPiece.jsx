"use client";

import React, { useMemo, useRef, useState } from "react";

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
      "Calculate what your internal team spends producing content, including additional review and approval time.",
  },
  {
    id: "freelancer",
    name: "Freelance writers",
    short: "Freelancer",
    description:
      "Compare what you pay freelance writers, including the additional time your team spends reviewing their work.",
  },
  {
    id: "agency",
    name: "Content agency",
    short: "Agency",
    description:
      "Compare agency fees alongside the internal time and additional costs involved in managing content delivery.",
  },
];

const EMPTY_ROUTE = {
  enabled: false,
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
  context: "",
  routes: Object.fromEntries(
    ROUTES.map((r) => [r.id, { ...EMPTY_ROUTE, enabled: r.id === "agency" }])
  ),
};

const EXAMPLE = {
  currency: "GBP",
  rate: "55",
  period: "Monthly",
  context:
    "We’re comparing the cost of producing six SEO articles per month, each around 1,500 words. All articles require product research, SEO optimisation and two rounds of revisions.",
  routes: {
    inhouse: {
      enabled: true,
      base: "3600",
      hours: "8",
      extra: "160",
      published: "6",
      notes:
        "Our content writer spends roughly 60% of their working week producing articles. The remaining time goes towards campaigns and other marketing work. We've included research tools and design costs separately, with final reviews handled by our Head of Marketing.",
    },
    freelancer: {
      enabled: true,
      base: "2700",
      hours: "20",
      extra: "180",
      published: "5",
      notes:
        "We commissioned six articles from freelance writers this month, but only five made it through to publishing. Our marketing team handled the final edits and product fact-checking, with some additional design support needed before the articles went live.",
    },
    agency: {
      enabled: true,
      base: "3450",
      hours: "6",
      extra: "0",
      published: "6",
      notes:
        "We pay our agency a monthly retainer covering six articles, including research, writing, editing and SEO metadata. Two revision rounds are included. Our Head of Marketing reviews the final drafts and checks product claims before anything gets published.",
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

// Only production spend and published output are required.
// Blank optional fields count as zero; a nonzero review-hours value
// requires an hourly rate so we never silently omit its cost.
const optionalNumber = (v) => v === "" || v == null ? 0 : number(v);
const validRoute = (r, rate) =>
  r.enabled &&
  Number.isFinite(number(r.base)) &&
  Number.isInteger(number(r.published)) && number(r.published) > 0 &&
  Number.isFinite(optionalNumber(r.hours)) &&
  Number.isFinite(optionalNumber(r.extra)) &&
  (optionalNumber(r.hours) === 0 || Number.isFinite(number(rate)));

// Convert only monetary fields. Published counts, hours and text stay unchanged.
// Preserve enough decimal precision for conversion across currencies.
const convertMoney = (value, fxRate) => {
  if (value === "" || value == null) return value;
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) return value;
  return String(Number((amount * fxRate).toFixed(4)));
};

const convertCurrencyData = (previous, toCurrency, fxRate) => ({
  ...previous,
  currency: toCurrency,
  rate: convertMoney(previous.rate, fxRate),
  routes: Object.fromEntries(
    Object.entries(previous.routes).map(([id, route]) => [
      id,
      {
        ...route,
        base: convertMoney(route.base, fxRate),
        extra: convertMoney(route.extra, fxRate),
      },
    ])
  ),
});

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
  const [fxStatus, setFxStatus] = useState(null);
  const [fxPending, setFxPending] = useState(false);
  const fxBusy = useRef(false);

  const changeCurrency = async (toCurrency) => {
    const fromCurrency = data.currency;
    if (toCurrency === fromCurrency || fxBusy.current) return;

    fxBusy.current = true;
    setFxPending(true);
    setFxStatus(null);
    try {
      const response = await fetch(
        `https://open.er-api.com/v6/latest/${encodeURIComponent(fromCurrency)}`,
        { cache: "no-store" }
      );
      if (!response.ok) throw new Error("Exchange rate service unavailable");
      const payload = await response.json();
      const fxRate = Number(payload?.rates?.[toCurrency]);
      if (payload?.result !== "success" || !Number.isFinite(fxRate) || fxRate <= 0) {
        throw new Error("No valid exchange rate returned");
      }

      setData((previous) =>
        previous.currency === fromCurrency
          ? convertCurrencyData(previous, toCurrency, fxRate)
          : previous
      );
      setAdjust(0);
      setFxStatus({
        type: "success",
        message: `Converted ${fromCurrency} to ${toCurrency} at 1 ${fromCurrency} = ${new Intl.NumberFormat("en-GB", { maximumFractionDigits: 4 }).format(fxRate)} ${toCurrency}${payload.time_last_update_utc ? ` · Rate updated ${payload.time_last_update_utc}` : ""}. All monetary inputs and results have been updated.`,
      });
    } catch {
      // Never change the currency label unless its monetary values converted.
      setFxStatus({
        type: "error",
        message: `Couldn't load a live ${fromCurrency} to ${toCurrency} exchange rate. Values remain in ${fromCurrency}. Check your connection and try again.`,
      });
    } finally {
      fxBusy.current = false;
      setFxPending(false);
    }
  };


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

  const selectedRoutes = ROUTES.filter((route) => data.routes[route.id].enabled);
  const rows = useMemo(
    () => ROUTES.map((route) => {
      const r = data.routes[route.id];
      const valid = validRoute(r, data.rate);
      const production = number(r.base);
      const reviewHours = optionalNumber(r.hours);
      const other = optionalNumber(r.extra);
      const published = number(r.published);
      const reviewRate = number(data.rate);
      const review = reviewHours === 0 ? 0 : reviewHours * reviewRate;
      const total = production + review + other;
      return {
        ...route, ...r, valid, production, reviewHours, other,
        published, review, total, perPiece: total / published,
        reviewShare: total > 0 ? (100 * review) / total : 0,
        basePerPiece: production / published,
      };
    }),
    [data]
  );

  const ready = rows.filter((r) => r.valid);

  const comparing = ready.length > 1;

  const winner =
    ready.length > 0
      ? [...ready].sort((a, b) => a.perPiece - b.perPiece)[0]
      : null;

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
                Math.max(0, (Number.isFinite(number(data.rate)) ? number(data.rate) : 0) + adjust)) /
            r.published,
        }
      : { ...r, adjusted: NaN }
  );

  const fullReport = () => {
    const parts = [
      "GROWUP: CONTENT COST COMPARISON",
      `Period: ${data.period} | Currency: ${currency} | Internal review rate: ${Number.isFinite(number(data.rate)) ? `${fmt(number(data.rate), currency)}/hour` : "Not provided (no review hours counted)"}`,
      `Comparable content: ${data.context || "Not specified"}`,
      ...(fxStatus?.type === "success" ? [`Exchange-rate conversion: ${fxStatus.message}`] : []),
      "",
      "ROUTE COMPARISON",
    ];

    ready.forEach((r) =>
      parts.push(
        `${r.name}: ${r.published} published | Production ${fmt(
          r.production,
          currency
        )} | Review ${whole(r.reviewHours)} h × ${fmt(
          (Number.isFinite(number(data.rate)) ? number(data.rate) : 0),
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
        ? `${comparing ? "LOWEST MODELED COST PER PUBLISHED PIECE" : "COST PER PUBLISHED PIECE"}: ${winner.name} (${fmt(winner.perPiece, currency)})`
        : "No complete routes yet."
    );

    parts.push(
      !comparing
        ? "Single-route cost breakdown; add another production route to compare."
        : equalVolume
          ? "All included routes have the same published output."
          : "Different output volumes: cost-per-piece is comparable, but total capacity is not equal. Check like-for-like complexity and quality."
    );

    parts.push(
      "Method: (production spend + additional internal review hours × hourly rate + other costs) ÷ published pieces. Do not double-count work included in salaries or invoices. Ensure costs and published output relate to the same work; spending on unfinished pieces may distort the comparison. Lowest cost is not a quality or ROI ranking."
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



const downloadXlsx = async () => {
  try {
    const ExcelJS = (await import("exceljs")).default;
    const workbook = new ExcelJS.Workbook();

    workbook.creator = "GrowUp";
    workbook.title = "Content Production Cost Comparison";
    workbook.subject = "Content production costs and published output";

    const moneyFormat = {
      GBP: '"£"#,##0.00',
      USD: '"$"#,##0.00',
      EUR: '"€"#,##0.00',
      NGN: '"₦"#,##0.00',
    }[currency] || '#,##0.00';

    const dark = "073B3B";
    const teal = "167273";
    const pale = "EEF4F3";

    const styleHeading = (cell) => {
      cell.font = {
        name: "Montserrat",
        size: 16,
        bold: true,
        color: { argb: "FFFFFFFF" },
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: `FF${dark}` },
      };
      cell.alignment = {
        vertical: "middle",
      };
    };

    const styleTable = (sheet, headerRow, lastColumn) => {
      const row = sheet.getRow(headerRow);

      for (let col = 1; col <= lastColumn; col++) {
        const cell = row.getCell(col);

        cell.font = {
          name: "Montserrat",
          bold: true,
          color: { argb: "FFFFFFFF" },
        };

        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: `FF${teal}` },
        };

        cell.alignment = {
          vertical: "middle",
          wrapText: true,
        };
      }

      row.height = 30;
    };

    // SHEET 1 — SUMMARY
    const summary = workbook.addWorksheet("Summary", {
      views: [{ state: "frozen", ySplit: 3 }],
    });

    summary.columns = [
      { width: 28 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
    ];

    summary.mergeCells("A1:D2");
    summary.getCell("A1").value = "GROWUP / CONTENT COST COMPARISON";
    styleHeading(summary.getCell("A1"));
    summary.getRow(1).height = 25;

    summary.addRow([]);
    summary.addRow(["Comparison period", data.period]);
    summary.addRow(["Currency", currency]);
    summary.addRow(["Production routes", ready.length]);
    summary.addRow([
      "Internal review hourly rate",
      Number.isFinite(number(data.rate)) ? number(data.rate) : 0,
    ]);
    summary.getCell("B7").numFmt = moneyFormat;

    summary.addRow([]);
    summary.addRow(["Content being compared"]);
    summary.mergeCells("A10:D12");
    summary.getCell("A10").value = data.context || "Not specified";
    summary.getCell("A10").alignment = {
      wrapText: true,
      vertical: "top",
    };

    summary.addRow([]);

    summary.addRow([
      "Production route",
      "Published pieces",
      "Total cost",
      "Cost per piece",
    ]);

    styleTable(summary, 14, 4);

    ready.forEach((r, index) => {
      const rowNumber = 15 + index;

      summary.getRow(rowNumber).values = [
        r.name,
        r.published,
        r.total,
        r.perPiece,
      ];

      summary.getCell(`C${rowNumber}`).numFmt = moneyFormat;
      summary.getCell(`D${rowNumber}`).numFmt = moneyFormat;

      if (comparing && r.id === winner?.id) {
        ["A", "B", "C", "D"].forEach((col) => {
          summary.getCell(`${col}${rowNumber}`).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: `FF${pale}` },
          };

          summary.getCell(`${col}${rowNumber}`).font = {
            name: "Montserrat",
            bold: true,
            color: { argb: `FF${dark}` },
          };
        });
      }
    });

    // SHEET 2 — DETAILED COST BREAKDOWN
    const breakdown = workbook.addWorksheet("Cost Breakdown", {
      views: [{ state: "frozen", ySplit: 1 }],
    });

    breakdown.columns = [
      { header: "Production route", width: 24 },
      { header: "Production spend", width: 22 },
      { header: "Review hours", width: 18 },
      { header: "Hourly review cost", width: 22 },
      { header: "Total review cost", width: 22 },
      { header: "Other costs", width: 18 },
      { header: "Published pieces", width: 19 },
      { header: "Total cost", width: 22 },
      { header: "Cost per piece", width: 22 },
    ];

    styleTable(breakdown, 1, 9);

    ready.forEach((r) => {
      const row = breakdown.addRow([
        r.name,
        r.production,
        r.reviewHours,
        Number.isFinite(number(data.rate)) ? number(data.rate) : 0,
        r.review,
        r.other,
        r.published,
        r.total,
        r.perPiece,
      ]);

      [2, 4, 5, 6, 8, 9].forEach((col) => {
        row.getCell(col).numFmt = moneyFormat;
      });
    });

    breakdown.autoFilter = {
      from: "A1",
      to: `I${Math.max(2, ready.length + 1)}`,
    };

    // SHEET 3 — ASSUMPTIONS
    const assumptions = workbook.addWorksheet("Assumptions");

    assumptions.columns = [
      { header: "Production route", width: 27 },
      { header: "Notes and assumptions", width: 95 },
    ];

    styleTable(assumptions, 1, 2);

    ready.forEach((r) => {
      const row = assumptions.addRow([
        r.name,
        r.notes || "No assumptions provided.",
      ]);

      row.getCell(2).alignment = {
        wrapText: true,
        vertical: "top",
      };

      row.height = 70;
    });

    assumptions.addRow([]);
    assumptions.addRow([
      "Calculation method",
      "(Production spend + internal review costs + other costs) / published pieces",
    ]);

    assumptions.addRow([
      "Important",
      "Compare similar content and matching cost periods. Lowest cost does not necessarily mean best quality or ROI.",
    ]);

    // Apply consistent typography to all populated cells.
    workbook.worksheets.forEach((sheet) => {
      sheet.eachRow((row) => {
        row.eachCell((cell) => {
          if (!cell.font?.name) {
            cell.font = {
              ...(cell.font || {}),
              name: "Montserrat",
            };
          }
        });
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "growup-content-cost-comparison.xlsx";

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);

    setNotice("Excel workbook downloaded.");
  } catch (error) {
    console.error("Excel export failed:", error);
    setNotice("Could not create the Excel file. Please try again.");
  }
};


  const reset = () => {
    setData(structuredClone(INITIAL));
    setStep(0);
    setView("comparison");
    setAdjust(0);
    setFxStatus(null);
    setNotice("Started fresh. Content agency is selected; choose another route if needed.");
  };

  const example = () => {
    setData(structuredClone(EXAMPLE));
    setStep(0);
    setView("comparison");
    setAdjust(0);
    setFxStatus(null);
    setNotice("Example loaded: a realistic B2B SaaS content programme.");
  };

  const print = () => window.print();

  const field = (label, value, onChange, opts = {}) => (
    <label className="cc-field">
      <span className="cc-label">
        {label}
        
        
{opts.tooltip && (
  <span className="cc-info-wrap">
    <span
      className="cc-info"
      tabIndex={0}
      role="button"
      aria-label={`More information about ${label}`}
    >
      ⓘ
    </span>
    <span className="cc-tooltip" role="tooltip">
      {opts.tooltip}
    </span>
  </span>
)}

      </span>
      <div className={`cc-input-wrap ${opts.prefix ? "cc-has-prefix" : ""}`}>
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


  {/* TOOL HEADER */}
<div className="cc-topbar">
  <div>
    <span className="cc-overline">
      GROWUP / CONTENT OPERATIONS
    </span>
    <h2>Compare Your Content Production Costs.</h2>
  </div>
</div>


        {/* STEP NAV */}
        <div className="cc-steps" aria-label="Calculator steps">
          {[
            ["1", "Choose routes"],
            ["2", "Enter costs"],
            ["3", "Review & export"],
          ].map(([n, name], i) => (
            <button
              key={n}
              type="button"
              className={`cc-step ${step === i ? "active" : ""}`}
              disabled={i > 0 && selectedRoutes.length === 0}
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
                  ? "Choose what you use"
                  : step === 1
                  ? "Costs and published output"
                  : "Your decision summary"}
              </span>
            </div>

            {/* STEP 0: choose routes and comparison assumptions */}
            {step === 0 && (
              <>
                <h2>How do you produce content?</h2>
                <p className="cc-intro">
                  Select the options you use or want to compare. You only need one
                  to calculate your cost per published piece.
                </p>
                <div className="cc-route-picker">
                  {ROUTES.map((route) => (
                    <label key={route.id} className={`cc-route-option ${data.routes[route.id].enabled ? "selected" : ""}`}>
                      <input
                        type="checkbox"
                        checked={data.routes[route.id].enabled}
                        onChange={(e) => routeUpdate(route.id, "enabled", e.target.checked)}
                      />
                      <span>
                        <strong>{route.name}</strong>
                        <small>{route.id === "inhouse" ? "Your employees write the content" : route.id === "freelancer" ? "Independent writers produce content" : "An external agency produces content"}</small>
                      </span>
                    </label>
                  ))}
                </div>
                <div className="cc-grid2 cc-basics">
                  <label className="cc-field">
                    <span className="cc-label">Currency</span>
                    <select value={data.currency} disabled={fxPending} onChange={(e) => changeCurrency(e.target.value)}>
                      <option value="GBP">GBP</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="NGN">NGN</option>
                    </select>
                  </label>
                  <label className="cc-field">
                    <span className="cc-label">Comparison period</span>
                    <select value={data.period} onChange={(e) => update("period", e.target.value)}>
                      <option>Monthly</option>
                      <option>Quarterly</option>
                    </select>
                  </label>
                </div>
                {fxPending && <p className="cc-fx-note" role="status">Converting monetary values using the latest available exchange rate…</p>}
                {fxStatus && <p className={`cc-fx-note ${fxStatus.type === "error" ? "cc-fx-error" : ""}`} role="status">{fxStatus.message}</p>}
                <label className="cc-field cc-full">
                  <span className="cc-label">What content are you comparing? <span className="cc-optional">optional</span></span>
                  <textarea
                    rows={3}
                    value={data.context}
                    onChange={(e) => update("context", e.target.value)}
                    placeholder="e.g. B2B SaaS comparison pages and buyer guides of similar complexity"
                  />
                  <span className="cc-help">For a fair comparison, use similar content types, research requirements and quality standards.</span>
                </label>
                {!selectedRoutes.length && <div className="cc-warning">Select at least one production route to continue.</div>}
              </>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <h2>Enter your content production costs</h2>
                <p className="cc-intro">
   Add your production costs and the number of articles published for each option. Remember to include any internal review costs that aren’t already covered.
                </p>
                <div className="cc-grid2 cc-review-rate">
                
             {field("Internal reviewer hourly cost", data.rate, (v) => update("rate", v), {
prefix: {
  GBP: "£",
  USD: "$",
  EUR: "€",
  NGN: "₦",
}[data.currency],
suffix: "/ hour",
placeholder: "e.g. 55",
  tooltip:
    "This is the cost of one hour of your team’s time, not a monthly salary. Divide annual salary plus employer costs by annual working hours. For example, £80,000 ÷ 1,600 hours = £50/hour. Use a blended rate if several people review content.",
  help: "Enter the hourly cost of the person reviewing your content.",
})}

                </div>
                <div className="cc-route-stack">
                  {selectedRoutes.map((route) => {
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
    prefix: {
      GBP: "£",
      USD: "$",
      EUR: "€",
      NGN: "₦",
    }[data.currency],
 tooltip:
  route.id === "inhouse"
    ? "Enter the portion of your employees' fully loaded pay spent producing content during the selected period. Exclude review hours counted separately."
    : route.id === "freelancer"
    ? "Enter the total amount paid to freelance writers for content produced during the selected period. Include article fees and freelance retainers, but exclude internal review costs and additional expenses entered separately."
    : "Enter the total amount paid to your content agency during the selected period. Include monthly retainers and additional production fees, but exclude internal review costs and other expenses entered separately.",
    
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
  tooltip:
    "Enter the total hours your internal team spends reviewing, editing, fact-checking and approving content during the selected period. For example, 6 articles requiring 2 hours of review each = 12 hours. Only include additional review time that hasn't already been counted in production costs.",
  help: "Optional. Additional review, SME checks and approvals by your team.",
}
                              )}
                             
                             
                     {field(
  "Other costs",
  r.extra,
  (v) => routeUpdate(route.id, "extra", v),
  {
    prefix: {
      GBP: "£",
      USD: "$",
      EUR: "€",
      NGN: "₦",
    }[data.currency],
    tooltip:
      "Include additional expenses such as design, publishing or software costs that aren't already included in production fees. Leave empty if there are no additional costs.",
    help: "Optional. Design, publishing, tools or costs not already included.",
  }
)}

                              {field(
                                "Actually published",
                                r.published,
                                (v) => routeUpdate(route.id, "published", v),
                            
                        {
  suffix: "pieces",
  step: "1",
  tooltip:
    "Enter the number of finished content pieces published during the selected period and covered by the costs you've entered. For example, if you paid for 8 articles but only 6 were published, enter 6. Check that your spending and publication figures cover comparable work and periods.",
  help: "Use published pieces covered by these costs, not just drafts.",
}
                              )}
                            </div>

                            <label className="cc-field cc-full">


<span className="cc-label">
  Notes & assumptions{" "}
  <span className="cc-optional">optional</span>

  <span className="cc-info-wrap">
    <span
      className="cc-info"
      tabIndex={0}
      aria-label="More information about notes and assumptions"
    >
      ⓘ
    </span>

    <span className="cc-tooltip" role="tooltip">
      Add any details that explain your figures, such as what the production
      fee includes, how employee costs were allocated, the type of content
      produced or why one provider requires more review time. These notes
      help you interpret and share your comparison.
    </span>
  </span>
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
                                  : "Enter spend and published pieces; add a reviewer rate if necessary"}
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
                <div className="cc-tip">
                  <span>✦</span>
                  <div><strong>Count each cost once.</strong> If an employee’s pay or an agency invoice already covers certain editing or review work, don’t add the same hours again. Leave optional fields blank if they don’t apply.</div>
                </div>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <h2>{comparing ? "Review your cost comparison" : "Review your content costs"}</h2>
                <p className="cc-intro">
  See how much each published piece costs across your selected options. Remember that lower production costs don’t always mean better content.
                </p>

                {selectedRoutes.length > ready.length && (
                  <div className="cc-warning">
                    {selectedRoutes.length - ready.length} selected route(s) still need complete figures and are excluded from the comparison.
                  </div>
                )}
                {winner ? (
                  <>
                    <div className="cc-winner">
                      <span className="cc-kicker">
                        {comparing ? "LOWEST COST / PIECE" : "YOUR COST / PIECE"}
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

                 <div className="cc-full-comparison">
  <h3>{comparing ? "Your full cost comparison" : "Your cost breakdown"}</h3>

  <div className="cc-full-table">
    <div className="cc-full-table-head">
      <span>Production route</span>
      <span>Total cost</span>
      <span>Cost / piece</span>
    </div>

    {ready.map((r) => (
      <div
        key={r.id}
        className={`cc-full-table-row ${
          comparing && winner?.id === r.id ? "is-lowest" : ""
        }`}
      >
        <span>
          <strong>{r.short}</strong>
          <small>{r.published} published</small>
        </span>

        <span>{fmt(r.total, currency)}</span>

        <strong>{fmt(r.perPiece, currency)}</strong>
      </div>
    ))}
  </div>


</div>

<div className="cc-audit">
  <strong>
    {comparing
      ? "Before choosing a route, check:"
      : "Before using this cost to make a decision, check:"}
  </strong>

  <ul>
    <li>Make sure the included costs relate to the pieces published in this period.</li>
    <li>Check content quality, research depth and turnaround time.</li>
    <li>Consider qualified leads and pipeline, not just cost.</li>
  </ul>
</div>


                  </>
                ) : (
                  <div className="cc-empty-state">
                    Complete production spend and published output for at least one selected route.
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
  onClick={downloadXlsx}
>
  ↓ Download Excel
</button>


                  <button
                    disabled={!ready.length}
                    className="cc-secondary"
                    onClick={print}
                  >
                    Print / Save PDF
                  </button>
                </div>
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
                  disabled={step === 0 && selectedRoutes.length === 0}
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
                ● LIVE COST BREAKDOWN
              </span>
              <h2>{comparing ? "Your production costs" : "Your content costs"}</h2>
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

              {selectedRoutes.length > ready.length && (
                <div className="cc-warning">Incomplete routes are excluded until you enter their required costs and published output.</div>
              )}
              {ready.length ? (
                <>
                  <div className="cc-stat-grid">
                    <div className="cc-stat">
                      <span>{comparing ? "Lowest cost / piece" : "Cost per published piece"}</span>
                      <strong>{fmt(winner.perPiece, currency)}</strong>
                      <small>{winner.name}</small>
                    </div>
                    <div className="cc-stat">
                      <span>Included routes</span>
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
                                {comparing && r.id === winner.id && <em>Lowest</em>}
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

                      {!equalVolume && comparing && (
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

                  {ready.some((r) => r.reviewHours > 0) && <div className="cc-sensitivity">
                    <div className="cc-sensitivity-head">
                      <strong>How would a higher review rate change costs?</strong>
                      <span>
                        {adjust >= 0 ? "+" : ""}
                        {fmt(adjust, currency)}/hour
                      </span>
                    </div>
                    <input
                      aria-label="Adjust internal review hourly rate"
                      type="range"
                      min={-Number(data.rate) * 0.5}
                      max={Number(data.rate)}
                      step={Math.max(0.01, Number(data.rate) / 20)}
                      value={adjust}
                      onChange={(e) => setAdjust(Number(e.target.value))}
                    />
                    <p>
                      Scenario rate:{" "}
                      {fmt(
                        Math.max(0, number(data.rate) + adjust),
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
                  </div>}

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
                    Select a route, then enter its production spend and published pieces. Add an hourly rate only if you enter review hours.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>

        
      </div>

   <div className="cc-print-only">
  <div className="cc-pdf-document">

    {/* COVER */}
    <div className="cc-pdf-cover">
      <span className="cc-pdf-eyebrow">
        GROWUP / CONTENT COST COMPARISON
      </span>

      <h1>Content Production Cost Comparison</h1>

      <p>
        A breakdown of your content production costs,
        internal review time and published output.
      </p>

      <div className="cc-pdf-meta">
        <div>
          <small>COMPARISON PERIOD</small>
          <strong>{data.period}</strong>
        </div>

        <div>
          <small>CURRENCY</small>
          <strong>{currency}</strong>
        </div>

        <div>
          <small>PRODUCTION ROUTES</small>
          <strong>{ready.length}</strong>
        </div>
      </div>
    </div>

    <div className="cc-pdf-body">

      {/* SUMMARY */}
      <div className="cc-pdf-section">
        <span className="cc-pdf-eyebrow">
          01 / OVERVIEW
        </span>

        <h2>Your cost summary</h2>

        <div className="cc-pdf-stats">
          <div>
            <small>
              {comparing ? "LOWEST COST PER PIECE" : "COST PER PIECE"}
            </small>
            <strong>
              {winner ? fmt(winner.perPiece, currency) : "—"}
            </strong>
          </div>

          <div>
            <small>
              {comparing ? "LOWEST-COST ROUTE" : "SELECTED ROUTE"}
            </small>
            <strong>{winner?.name || "—"}</strong>
          </div>

          <div>
            <small>ROUTES INCLUDED</small>
            <strong>{ready.length}</strong>
          </div>
        </div>

        <div className="cc-pdf-context">
          <strong>Content being compared</strong>
          <p>{data.context || "Not specified."}</p>
        </div>
      </div>

      {/* COMPARISON TABLE */}
      <div className="cc-pdf-section">
        <span className="cc-pdf-eyebrow">
          02 / COST COMPARISON
        </span>

        <h2>Cost per published piece</h2>

        <table className="cc-pdf-table">
          <thead>
            <tr>
              <th>Production route</th>
              <th>Published</th>
              <th>Total cost</th>
              <th>Cost / piece</th>
            </tr>
          </thead>

          <tbody>
            {ready.map((r) => (
              <tr
                key={r.id}
                className={
                  comparing && r.id === winner?.id
                    ? "cc-pdf-lowest"
                    : ""
                }
              >
                <td>{r.name}</td>
                <td>{r.published}</td>
                <td>{fmt(r.total, currency)}</td>
                <td>
                  <strong>{fmt(r.perPiece, currency)}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {comparing && !equalVolume && (
          <p className="cc-pdf-note">
            Published output differs between routes. Consider
            delivery capacity and content quality alongside cost.
          </p>
        )}
      </div>

      {/* DETAILED COSTS */}
      <div className="cc-pdf-section">
        <span className="cc-pdf-eyebrow">
          03 / COST BREAKDOWN
        </span>

        <h2>How your costs are distributed</h2>

        {ready.map((r) => (
          <div className="cc-pdf-route" key={r.id}>
            <h3>{r.name}</h3>

            <div className="cc-pdf-detail">
              <span>Production spend</span>
              <strong>{fmt(r.production, currency)}</strong>
            </div>

            <div className="cc-pdf-detail">
              <span>Internal review</span>
              <strong>
                {whole(r.reviewHours)} hours · {fmt(r.review, currency)}
              </strong>
            </div>

            <div className="cc-pdf-detail">
              <span>Other costs</span>
              <strong>{fmt(r.other, currency)}</strong>
            </div>

            <div className="cc-pdf-detail cc-pdf-total">
              <span>Total production cost</span>
              <strong>{fmt(r.total, currency)}</strong>
            </div>

            <div className="cc-pdf-assumptions">
              <strong>Notes and assumptions</strong>
              <p>{r.notes || "No additional notes provided."}</p>
            </div>
          </div>
        ))}
      </div>

      {/* METHODOLOGY */}
      <div className="cc-pdf-section">
        <span className="cc-pdf-eyebrow">
          04 / METHODOLOGY
        </span>

        <h2>How these costs are calculated</h2>

        <p className="cc-pdf-explanation">
          Production spend, additional internal review costs
          and other expenses are added together, then divided
          by the number of published pieces.
        </p>

        <p className="cc-pdf-explanation">
          Avoid counting review time already included in payroll
          or supplier fees. Keep spending and published output
          within comparable periods.
        </p>

        <div className="cc-pdf-disclaimer">
          This comparison measures production costs, not content
          quality, qualified leads, pipeline or return on investment.
        </div>
      </div>

      <div className="cc-pdf-footer">
        Prepared using GrowUp's Content Cost Calculator
      </div>

    </div>
  </div>
</div>


    </div>
  );
}

export const faqs = [
  {
    question: "How do I calculate the true cost of producing a blog post?",
    answer:
      "To calculate your cost per blog post, add everything spent producing and publishing your articles, including internal reviews. For example, if you spend £3,000 producing five articles and £500 on additional reviews, your actual cost is £700 per published article, assuming all five are published.",
  },
  {
    question: "What costs should I include when calculating content production expenses?",
    answer:
      "Include everything your business spends getting content from the initial brief to publication. This covers writing fees, employee time, research, editing, design and internal approvals. If your agency already includes editing or SEO optimisation in its fee, don’t add those costs again unless you’ve paid separately for them.",
  },
  {
    question: "Why does my content cost more than the writer’s or agency’s quoted fee?",
    answer:
      "Your content costs more than the quoted fee because your business still spends time managing production. Briefing writers, reviewing drafts, checking product accuracy and approving content all have associated costs. For example, 10 hours of internal review at £50 per hour adds £500 to your original production fee.",
  },
  {
    question: "How much should a B2B SaaS company budget for content production each month?",
    answer:
      "It depends on your content goals, the number of articles you need and how much research each piece requires. At GrowUp, we charge £525 per article, so producing four to eight articles monthly would cost between £2,100 and £4,200. You'll also need to account for internal reviews, design and publishing costs where applicable.",
  },
  {
    question: "When does hiring an in-house content writer make more financial sense?",
    answer:
      "Hiring in-house can make financial sense when you have enough consistent work to justify a full-time writer. If your content needs fluctuate, outsourcing may offer more flexibility because you're paying for agreed deliverables rather than maintaining a permanent salary.",
  },
  {
    question: "How can I reduce content production costs without compromising quality?",
    answer:
      "The easiest place to reduce content production costs is often your review process. If your marketing team spends hours rewriting drafts, better briefs and access to accurate product information can reduce that workload. For example, cutting review time from four hours to two per article saves £100 at a £50 hourly rate. You can also cut costs by updating existing articles before commissioning new ones.",
  },
  {
    question: "How do I know whether I’m spending too much on content production?",
    answer:
      "You’re spending too much on content if the production costs are rising without a corresponding improvement in quality, qualified leads or pipeline. For example, paying £800 per article may be reasonable for a technical comparison page that influences demos, but expensive for a generic blog post attracting little relevant traffic. Compare your cost per published article with the results it generates before deciding where to cut spending.",
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
  font-family: "Montserrat Variable", Montserrat, Arial, sans-serif;

  background: transparent;
  width: 100%;
  max-width: none;
  margin: 0;
  min-height: 100%;

  font-size: 14px;
  line-height: 1.5;
}
.cc-root * {
  box-sizing: border-box;
  font-family: inherit;
}

.cc-root button,
.cc-root input,
.cc-root select,
.cc-root textarea {
  font: inherit;
  font-family: inherit;
}
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
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 28px 0 50px;
}
.cc-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 0 0 28px;
}
.cc-topbar h2 {
  font-family: "Montserrat Variable", Montserrat, sans-serif;
  font-size: clamp(24px, 2.5vw, 28px);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 1.25;
  margin: 8px 0 0;
  color: #011522;
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
  letter-spacing: .12em;
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
  grid-template-columns: minmax(0, 1.08fr) minmax(350px, .92fr);
  gap: 22px;
  align-items: start;
}
.cc-panel,
.cc-results {
  border: 1px solid var(--cc-line);
  border-radius: 14px;
  overflow: hidden;
  background: white;
}
.cc-editor {
  padding: 27px 29px;
  overflow: visible;
}
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
.cc-info-wrap {
  display: inline-flex;
  position: relative;
  margin-left: 5px;
  vertical-align: middle;
}

.cc-info {
  display: inline-grid;
  place-items: center;
  width: 15px;
  height: 15px;
  color: #167273;
  font-size: 13px;
  cursor: pointer;
}

.cc-tooltip {
  position: absolute;
  bottom: calc(100% + 9px);
  left: 50%;
  transform: translateX(-50%);

  width: 265px;
  max-width: calc(100vw - 40px);
  padding: 12px 14px;

  background: #011522;
  color: #ffffff;
  border-radius: 8px;

  font-size: 11px;
  font-weight: 500;
  line-height: 1.6;
  letter-spacing: normal;
  text-transform: none;
  text-align: left;

  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: none;
  z-index: 100;
}

.cc-info-wrap:hover .cc-tooltip,
.cc-info-wrap:focus-within .cc-tooltip {
  opacity: 1;
  visibility: visible;
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



.cc-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.cc-input-wrap input {
  width: 100%;
  min-width: 0;
  border-radius: 8px;
}

.cc-input-wrap.cc-has-prefix input {
  padding-left: 32px;
}

.cc-input-wrap .cc-affix:first-child {
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  border: 0;
  background: transparent;
  padding: 0;
  color: #557570;
  font-size: 12px;
  pointer-events: none;
}

.cc-input-wrap .cc-affix:last-child:not(:first-child) {
  position: relative;
  align-self: stretch;
  display: flex;
  align-items: center;
  margin-left: -1px;
  padding: 0 12px;
  border: 1px solid #bad2cc;
  border-radius: 0 8px 8px 0;
  background: #f0f6f4;
  color: #5f7775;
  white-space: nowrap;
  font-size: 12px;
}

.cc-input-wrap:has(.cc-affix:last-child:not(:first-child)) input {
  border-radius: 8px 0 0 8px;
}


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

.cc-route-picker { display: grid; gap: 10px; margin-bottom: 24px; }
.cc-route-option {
  display: flex; align-items: center; gap: 13px; cursor: pointer;
  padding: 15px; border: 1px solid #d5e3df; border-radius: 10px;
  background: #fff; transition: background .15s, border-color .15s;
}
.cc-route-option.selected { border-color: #167273; background: #f0f8f6; }
.cc-route-option input { width: 18px; height: 18px; accent-color: #167273; flex: none; }
.cc-route-option span { display: flex; flex-direction: column; gap: 3px; }
.cc-route-option strong { font-size: 13px; color: #173f3f; }
.cc-route-option small { font-size: 11px; line-height: 1.5; color: #647e79; }
.cc-basics { margin-top: 4px; }
.cc-review-rate {
  grid-template-columns: minmax(0, 1fr);
  width: 75%;
  max-width: 100%;
  margin-bottom: 23px;
}

@media (max-width: 640px) {
  .cc-review-rate {
    width: 100%;
  }
}
.cc-fx-note {
  margin: 10px 0 0;
  font-size: 11px;
  line-height: 1.6;
  color: #256660;
}
.cc-fx-error { color: #9a3f30; }


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


.cc-full-comparison {
  margin-top: 24px;
}

.cc-full-comparison h3 {
  font-size: 14px;
  font-weight: 800;
  color: #011522;
  margin: 0 0 14px;
}

.cc-full-table {
  border: 1px solid #d5e3df;
  border-radius: 10px;
  overflow: hidden;
}

.cc-full-table-head,
.cc-full-table-row {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) 1fr 1fr;
  gap: 10px;
  align-items: center;
  padding: 13px 14px;
}

.cc-full-table-head {
  background: #f0f6f4;
  color: #607b76;
  font-size: 10px;
  font-weight: 750;
}

.cc-full-table-row {
  border-top: 1px solid #e3ece9;
  color: #294e4b;
  font-size: 12px;
}

.cc-full-table-row > :not(:first-child),
.cc-full-table-head > :not(:first-child) {
  text-align: right;
}

.cc-full-table-row > span:first-child {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.cc-full-table-row small {
  color: #7b918d;
  font-size: 10px;
}

.cc-full-table-row.is-lowest {
  background: #edf6f3;
}

.cc-full-table-row.is-lowest > strong:last-child {
  color: #167273;
}

.cc-comparison-note {
  margin: 12px 0 0;
  font-size: 11px;
  line-height: 1.6;
  color: #637e78;
}

@media (max-width: 480px) {
  .cc-full-table-head,
  .cc-full-table-row {
    padding: 12px 9px;
    gap: 6px;
    font-size: 11px;
  }
}

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
.cc-print-only { display: none; }

@media (max-width: 950px) {
  .cc-layout { grid-template-columns: 1fr; }
  .cc-results { position: static; }
  .cc-wrap { padding: 24px 0 45px; }
  .cc-brandmark { display: none; }
}
@media (max-width: 560px) {
  .cc-wrap { padding: 18px 0 35px; }
  .cc-topbar { padding-bottom: 24px; }
  .cc-topbar h2 { font-size: 24px; }
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
/* PDF DOCUMENT */

.cc-print-only {
  display: none;
}

@media print {
  @page {
    size: A4;
    margin: 13mm;
  }

  body * {
    visibility: hidden !important;
  }

  .cc-root .cc-print-only,
  .cc-root .cc-print-only * {
    visibility: visible !important;
  }

  .cc-root {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    min-height: 0 !important;
    background: #fff !important;
  }

  .cc-wrap {
    display: none !important;
  }

  .cc-print-only {
    display: block !important;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 0;
    margin: 0;
    background: #fff;
    color: #011522;
  }

  .cc-pdf-document {
    width: 100%;
    font-family: "Montserrat Variable", Montserrat, Arial, sans-serif;
    font-size: 10px;
    line-height: 1.6;
  }

  .cc-pdf-cover {
    padding: 26px 28px 23px;
    background: #eef6f3 !important;
    border-bottom: 1px solid #dce9e4;
  }

  .cc-pdf-eyebrow {
    display: block;
    color: #167273;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: .12em;
  }

  .cc-pdf-cover h1 {
    margin: 12px 0 8px;
    font-size: 25px;
    line-height: 1.2;
    letter-spacing: -.045em;
    font-weight: 800;
    color: #011522;
  }

  .cc-pdf-cover p {
    max-width: 480px;
    margin: 0;
    color: #5c7972;
    font-size: 11px;
    line-height: 1.7;
  }

  .cc-pdf-meta {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 25px;
  }

  .cc-pdf-meta div,
  .cc-pdf-stats div {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .cc-pdf-meta small,
  .cc-pdf-stats small {
    color: #6d9088;
    font-size: 8px;
    font-weight: 800;
    letter-spacing: .08em;
  }

  .cc-pdf-meta strong {
    font-size: 11px;
    color: #011522;
  }

  .cc-pdf-body {
    padding: 5px 28px 25px;
  }

  .cc-pdf-section {
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px solid #e1eae7;
    break-inside: auto;
  }

  .cc-pdf-section h2 {
    margin: 8px 0 16px;
    color: #011522;
    font-size: 16px;
    font-weight: 800;
    letter-spacing: -.035em;
  }

  .cc-pdf-stats {
    display: grid;
    grid-template-columns: 1fr 1.2fr .7fr;
    gap: 14px;
    padding: 17px;
    border: 1px solid #e0ece8;
    border-radius: 9px;
    background: #f4f9f7 !important;
    break-inside: avoid;
  }

  .cc-pdf-stats strong {
    font-size: 15px;
    color: #073b3b;
  }

  .cc-pdf-context {
    margin-top: 18px;
  }

  .cc-pdf-context strong,
  .cc-pdf-assumptions strong {
    color: #174c4b;
    font-size: 10px;
  }

  .cc-pdf-context p,
  .cc-pdf-assumptions p,
  .cc-pdf-explanation {
    margin: 6px 0 0;
    font-size: 10px;
    line-height: 1.75;
    color: #486765;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .cc-pdf-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 10px;
  }

  .cc-pdf-table th {
    padding: 12px 9px;
    background: #edf5f2 !important;
    color: #436963;
    font-size: 9px;
    text-align: left;
  }

  .cc-pdf-table td {
    padding: 12px 9px;
    border-bottom: 1px solid #e3ece9;
    color: #294e4b;
  }

  .cc-pdf-table th:not(:first-child),
  .cc-pdf-table td:not(:first-child) {
    text-align: right;
  }

  .cc-pdf-table thead {
    display: table-header-group;
  }

  .cc-pdf-table tr {
    break-inside: avoid;
  }

  .cc-pdf-lowest {
    background: #edf6f3 !important;
  }

  .cc-pdf-lowest td:last-child {
    color: #167273;
  }

  .cc-pdf-note {
    margin-top: 12px;
    color: #647e78;
    font-size: 9px;
    line-height: 1.6;
  }

  .cc-pdf-route {
    padding: 16px 0 18px;
    border-bottom: 1px solid #e3ece9;
    break-inside: avoid;
  }

  .cc-pdf-route h3 {
    margin: 0 0 12px;
    font-size: 13px;
    font-weight: 800;
    color: #073b3b;
  }

  .cc-pdf-detail {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    padding: 5px 0;
    color: #54726b;
    font-size: 10px;
  }

  .cc-pdf-detail strong {
    color: #193f3d;
    text-align: right;
  }

  .cc-pdf-total {
    margin-top: 8px;
    padding-top: 11px;
    border-top: 1px solid #dce8e4;
    font-weight: 800;
  }

  .cc-pdf-assumptions {
    margin-top: 13px;
    padding: 12px 14px;
    background: #f4f9f7 !important;
    border-radius: 8px;
  }

  .cc-pdf-disclaimer {
    margin-top: 18px;
    padding: 12px 14px;
    border-radius: 8px;
    background: #f4f9f7 !important;
    color: #52726c;
    font-size: 9px;
    line-height: 1.7;
  }

  .cc-pdf-footer {
    margin-top: 26px;
    padding-top: 12px;
    border-top: 1px solid #e3ece9;
    color: #809691;
    font-size: 9px;
  }

  .cc-pdf-cover,
  .cc-pdf-stats,
  .cc-pdf-lowest,
  .cc-pdf-assumptions,
  .cc-pdf-disclaimer,
  .cc-pdf-table th {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
`;