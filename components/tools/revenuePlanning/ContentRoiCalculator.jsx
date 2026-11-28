import { useId, useMemo, useState } from "react";
import { ArrowRight, Copy, Download, Info, RotateCcw } from "lucide-react";
import styles from "./ContentRoiCalculator.module.css";

export const faqs = [
  {
    question: "How does the content ROI calculator work?",
    answer: "Enter your total content programme cost, the number of customers attributed to content, first-year revenue per customer and gross margin. The calculator deducts your content investment from attributed gross profit to calculate net return and ROI. It also calculates your content acquisition cost and the number of customers needed to break even or reach your target ROI.",
  },
  {
    question: "How do you calculate content marketing ROI?",
    answer: "Content marketing ROI is calculated as (attributed gross profit − content marketing cost) ÷ content marketing cost × 100. For example, if a £60,000 content programme generates £115,200 in gross profit, the net return is £55,200 and the ROI is 92%.",
  },
  {
    question: "What costs should I include in a content marketing ROI calculator?",
    answer: "Include agency and freelance fees, internal production and review time, content research, design, relevant software and distribution costs. Include only costs associated with the programme being measured, and avoid counting costs already deducted in your gross margin.",
  },
  {
    question: "How do I calculate how many customers my content programme needs to break even?",
    answer: "Divide your total content programme cost by the first-year gross profit per new customer and round up to the nearest whole customer. A £60,000 programme with £18,000 in first-year revenue per customer and an 80% gross margin needs five customers to break even.",
  },
  {
    question: "Can I use this content ROI calculator to justify additional content marketing investment?",
    answer: "Yes. The calculator shows the gross profit, net return and customer acquisition requirements associated with a proposed content budget. Use these figures alongside historical acquisition performance to assess whether the investment can achieve your target ROI and support a budget request.",
  },
  {
    question: "Does the content ROI calculator include customer lifetime value?",
    answer: "No. It measures the first 12 months of revenue from each attributed customer against the entered content programme cost. It does not model lifetime value, renewals, cash collection or the time between content engagement and customer acquisition.",
  },
];

const EXAMPLE = {
  currency: "GBP",
  cost: "60000",
  targetRoi: "100",
  customers: "8",
  revenuePerCustomer: "18000",
  margin: "80",
};
const EMPTY = Object.fromEntries(
  Object.keys(EXAMPLE).map((key) => [key, key === "currency" ? "GBP" : ""])
);
const SYMBOLS = { GBP: "£", USD: "$", EUR: "€", NGN: "₦" };
const whole = (value) => new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(value);
const decimal = (value) => new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 }).format(value);
const compact = (value) => new Intl.NumberFormat("en-GB", { notation: "compact", maximumFractionDigits: 1 }).format(value);
const money = (value, currency, short = false) => {
  const amount = Math.abs(value);
  return `${value < 0 ? "−" : ""}${SYMBOLS[currency]}${short ? compact(amount) : decimal(amount)}`;
};
const percent = (value) => `${decimal(value)}%`;

function model(input) {
  const keys = ["cost", "targetRoi", "customers", "revenuePerCustomer", "margin"];
  if (keys.some((key) => String(input[key] ?? "").trim() === "")) {
    return { message: "Enter your numbers to calculate your content ROI." };
  }
  const v = Object.fromEntries(keys.map((key) => [key, Number(input[key])]));
  if (keys.some((key) => !Number.isFinite(v[key]) || v[key] < 0)) {
    return { message: "Enter valid, non-negative figures in every field." };
  }
  if (v.cost <= 0) return { message: "Programme cost must be greater than zero." };
  if (!Number.isSafeInteger(v.customers)) return { message: "Enter a whole number of customers." };
  if (v.revenuePerCustomer <= 0) return { message: "First-year revenue per customer must be greater than zero." };
  if (v.margin > 100) return { message: "Gross margin cannot exceed 100%." };

  const attributedRevenue = v.customers * v.revenuePerCustomer;
  const profitPerCustomer = v.revenuePerCustomer * (v.margin / 100);
  const grossProfit = attributedRevenue * (v.margin / 100);
  const netReturn = grossProfit - v.cost;
  const roi = (netReturn / v.cost) * 100;
  const contentCac = v.customers > 0 ? v.cost / v.customers : null;
  const breakEvenCustomers = profitPerCustomer > 0 ? Math.ceil(v.cost / profitPerCustomer) : null;
  const targetProfit = v.cost * (1 + v.targetRoi / 100);
  const targetCustomers = profitPerCustomer > 0 ? Math.ceil(targetProfit / profitPerCustomer) : null;
  const additionalCustomers = targetCustomers === null ? null : Math.max(0, targetCustomers - v.customers);
  const targetGap = roi - v.targetRoi;
  const numbers = [attributedRevenue, profitPerCustomer, grossProfit, netReturn, roi, contentCac, breakEvenCustomers, targetProfit, targetCustomers, additionalCustomers, targetGap];
  if (numbers.some((n) => n !== null && !Number.isFinite(n)) || [breakEvenCustomers, targetCustomers].some((n) => n !== null && !Number.isSafeInteger(n))) {
    return { message: "These figures are too large to calculate reliably. Check your inputs." };
  }
  return { v, attributedRevenue, profitPerCustomer, grossProfit, netReturn, roi, contentCac, breakEvenCustomers, targetProfit, targetCustomers, additionalCustomers, targetGap };
}

function InfoTip({ label, description, formula, calculation, answer, note }) {
  const id = useId();
  return (
    <span className={styles.infoWrap}>
      <button type="button" className={styles.infoButton} aria-label={`About ${label}`} aria-describedby={id}>
        <Info size={13} aria-hidden="true" />
      </button>
      <span id={id} className={styles.tooltip} role="tooltip">
        <strong className={styles.tooltipHeading}>{label}</strong>
        <span>{description}</span>
        {formula && <span className={styles.tooltipFormula}><small>CALCULATION</small>{formula}</span>}
        {calculation && <span className={styles.tooltipExample}><small>YOUR NUMBERS</small><span>{calculation}</span>{answer && <strong>{answer}</strong>}</span>}
        {note && <span className={styles.tooltipNote}>{note}</span>}
      </span>
    </span>
  );
}

function Field({ label, hint, value, onChange, prefix, suffix, integer = false, format = false }) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const displayValue = format && !focused && value !== "" && Number.isFinite(Number(value))
    ? new Intl.NumberFormat("en-GB", { maximumFractionDigits: 10 }).format(Number(value))
    : value;
  return (
    <div className={styles.field}>
      <div className={styles.fieldLabel}>
        <label htmlFor={id}>{label}</label>
        <InfoTip label={label} description={hint} />
      </div>
      <div className={styles.control}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <input id={id} type="text" inputMode={integer ? "numeric" : "decimal"} autoComplete="off" value={displayValue}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          onChange={(event) => {
            const raw = event.target.value.replace(/,/g, "");
            if ((integer ? /^\d*$/ : /^\d*\.?\d*$/).test(raw)) onChange(raw);
          }} />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
    </div>
  );
}

function Metric({ label, value, description, hint, formula, calculation, answer, note }) {
  return (
    <div className={styles.metricCell}>
      <div className={styles.metricLabel}>
        <span>{label}</span>
        <InfoTip label={label} description={hint} formula={formula} calculation={calculation} answer={answer} note={note} />
      </div>
      <strong className={styles.metricValue}>{value}</strong>
      <small className={styles.metricDescription}>{description}</small>
    </div>
  );
}

export default function ContentRoiCalculator() {
  const [values, setValues] = useState(EXAMPLE);
  const [notice, setNotice] = useState("");
  const result = useMemo(() => model(values), [values]);
  const isReady = !result.message;
  const currency = values.currency;
  const setField = (key, value) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setNotice("");
  };
  const loadExample = () => { setValues({ ...EXAMPLE }); setNotice("Example values loaded."); };
  const startFresh = () => { setValues({ ...EMPTY }); setNotice(""); };
  const cash = (value, short = false) => money(value, currency, short);
  const count = (value) => value === null ? "Not achievable" : whole(value);
  const roiStatus = !isReady ? "" : Math.abs(result.targetGap) < 1e-9
    ? "At your target ROI"
    : `${decimal(Math.abs(result.targetGap))} percentage points ${result.targetGap > 0 ? "above" : "below"} your target ROI`;

  const reportRows = () => {
    if (!isReady) return [];
    const { v } = result;
    return [
      ["Currency", currency],
      ["Programme cost", v.cost],
      ["Target ROI (%)", v.targetRoi],
      ["Attributed customers", v.customers],
      ["First-year revenue per customer", v.revenuePerCustomer],
      ["Gross margin (%)", v.margin],
      ["Attributed revenue", result.attributedRevenue],
      ["Attributed gross profit", result.grossProfit],
      ["Net return", result.netReturn],
      ["First-year ROI (%)", result.roi],
      ["Content acquisition cost per customer", result.contentCac ?? "N/A"],
      ["Customers to break even", result.breakEvenCustomers ?? "Not achievable"],
      ["Customers for target ROI", result.targetCustomers ?? "Not achievable"],
      ["Additional customers required", result.additionalCustomers ?? "Not achievable"],
      ["Assumptions", "First 12 months of revenue per attributed customer; fixed programme cost, revenue per customer and gross margin; no lifetime value, cash-flow timing or sales-cycle delays."],
      ["Source", "GrowUp | seo-growup.com"],
    ];
  };
  const copy = async () => {
    if (!isReady) return;
    try {
      await navigator.clipboard.writeText(["GROWUP / CONTENT ROI REPORT", "", ...reportRows().map(([key, value]) => `${key}: ${value}`)].join("\n"));
      setNotice("Results copied to clipboard.");
    } catch { setNotice("Copy failed. Use Export CSV instead."); }
  };
  const download = () => {
    if (!isReady) return;
    const cell = (value) => `"${String(value).replace(/"/g, '""')}"`;
    const csv = [["Metric", "Value"], ...reportRows()].map((row) => row.map(cell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = "growup-content-roi-report.csv";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Content ROI report exported.");
  };

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <div>
          <h2>Calculate Your Content Marketing ROI.</h2>
          <p>Assess the financial return of your content investment and the customers needed to reach your ROI target.</p>
        </div>
        <div className={styles.toolbarActions}>
          <button type="button" onClick={loadExample}><RotateCcw size={14} />Use example</button>
          <button type="button" onClick={startFresh}>Start fresh<ArrowRight size={14} /></button>
        </div>
      </div>

      <div className={styles.layout}>
        <section className={styles.inputCard} aria-label="Content ROI planning assumptions">
          <div className={styles.assumptionsHeader}>
            <h3>Your Planning Assumptions</h3>
            <select aria-label="Reporting currency" className={styles.currencySelect} value={currency} onChange={(event) => setField("currency", event.target.value)}>
              {Object.entries(SYMBOLS).map(([code, symbol]) => <option key={code} value={code}>{code} ({symbol})</option>)}
            </select>
          </div>
          <h4 className={styles.segmentTitle}>Content investment</h4>
          <div className={styles.fieldsGrid}>
            <Field label="Total content programme cost" prefix={SYMBOLS[currency]} format value={values.cost} onChange={(v) => setField("cost", v)} hint="Total cost of the content programme being evaluated, including agency fees, internal production and review time, relevant software and distribution. Do not double-count costs included in gross margin." />
            <Field label="Target ROI" suffix="%" value={values.targetRoi} onChange={(v) => setField("targetRoi", v)} hint="The minimum net return you want relative to programme cost. A target ROI of 100% means gross profit must be twice your content investment." />
          </div>
          <h4 className={styles.segmentTitle}>Customer acquisition & revenue</h4>
          <div className={styles.fieldsGrid}>
            <Field label="New customers attributed to content" integer format value={values.customers} onChange={(v) => setField("customers", v)} hint="Number of new paying customers attributed to this content programme under your chosen attribution rules. Use unique customers and avoid double-counting deals credited to multiple assets." />
            <Field label="First-year revenue per customer" prefix={SYMBOLS[currency]} format value={values.revenuePerCustomer} onChange={(v) => setField("revenuePerCustomer", v)} hint="Average revenue earned or expected from each acquired customer during their first 12 months. Use first-year revenue rather than total multi-year contract value or lifetime value." />
            <Field label="Gross margin" suffix="%" value={values.margin} onChange={(v) => setField("margin", v)} hint="Revenue remaining after direct costs of delivering your product or service, before deducting the content programme cost. For an 80% gross margin, £100 in revenue produces £80 in gross profit." />
          </div>
          <div className={styles.inputFoot}><Info size={15} aria-hidden="true" /><span>Include internal production, agency, software and review costs when calculating your total investment.</span></div>
          <p className={styles.currencyNote}>Changing currency changes the reporting symbol, not the entered amounts.</p>
        </section>

        <section className={styles.resultsCard} aria-label="Your content ROI results">
          <div className={styles.previewHeader}>
            <h3>What your content investment delivers.</h3>
            <p>Your first-year content marketing return.</p>
          </div>
          {isReady ? (
            <>
              <div className={styles.executiveSummary}>
                A <strong>{cash(result.v.cost)}</strong> content investment generating <strong>{whole(result.v.customers)} {result.v.customers === 1 ? "customer" : "customers"}</strong> produces <strong>{cash(result.grossProfit)}</strong> in gross profit and {result.netReturn < 0 ? "a net loss of " : "a net return of "}<strong>{cash(Math.abs(result.netReturn))}.</strong>
              </div>
              <div className={styles.metricsPanel}>
                <div className={styles.heroMetric}>
                  <div className={styles.metricLabel}>
                    <span>First-year content ROI</span>
                    <InfoTip label="First-year content ROI" description="Net return as a percentage of the content programme cost, using gross profit from each attributed customer's first 12 months." formula="(Attributed gross profit − Programme cost) ÷ Programme cost × 100" calculation={`(${cash(result.grossProfit)} − ${cash(result.v.cost)}) ÷ ${cash(result.v.cost)} × 100`} answer={percent(result.roi)} note="This is a cohort-based first-year return, not a cash-flow forecast or a lifetime-value calculation." />
                  </div>
                  <strong className={styles.heroMetricValue} style={result.roi < 0 ? { color: "#ffc2b6" } : undefined}>{percent(result.roi)}</strong>
                  <small className={styles.metricDescription}>{roiStatus}</small>
                </div>
                <div className={styles.commercialMetrics}>
                  <Metric label="Attributed revenue" value={cash(result.attributedRevenue, true)} description={`From ${whole(result.v.customers)} ${result.v.customers === 1 ? "customer" : "customers"}`} hint="First-year revenue from all new customers attributed to the programme, before direct delivery costs." formula="Attributed customers × First-year revenue per customer" calculation={`${whole(result.v.customers)} × ${cash(result.v.revenuePerCustomer)}`} answer={cash(result.attributedRevenue)} />
                  <Metric label="Attributed gross profit" value={cash(result.grossProfit, true)} description={`At a ${percent(result.v.margin)} gross margin`} hint="Attributed first-year revenue after direct product or service delivery costs." formula="Attributed revenue × Gross margin" calculation={`${cash(result.attributedRevenue)} × ${percent(result.v.margin)}`} answer={cash(result.grossProfit)} />
                  <Metric label="Net return" value={cash(result.netReturn, true)} description="After content investment" hint="Gross profit remaining after deducting the content programme cost. A negative result means the programme has not recovered its cost." formula="Attributed gross profit − Programme cost" calculation={`${cash(result.grossProfit)} − ${cash(result.v.cost)}`} answer={cash(result.netReturn)} />
                  <Metric label="Content acquisition cost" value={result.contentCac === null ? "N/A" : cash(result.contentCac, true)} description="Per attributed customer" hint="Average content programme cost per new attributed customer. This is not fully loaded company-wide CAC." formula="Programme cost ÷ Attributed customers" calculation={result.contentCac === null ? "No customers have been attributed to content." : `${cash(result.v.cost)} ÷ ${whole(result.v.customers)}`} answer={result.contentCac === null ? "Not calculable" : cash(result.contentCac)} />
                  <Metric label="Customers to break even" value={count(result.breakEvenCustomers)} description="Recover your content investment" hint="Minimum whole number of customers needed for first-year gross profit to cover the programme cost." formula="Programme cost ÷ First-year gross profit per customer, rounded up" calculation={result.breakEvenCustomers === null ? "Gross profit per customer is zero." : `${cash(result.v.cost)} ÷ (${cash(result.v.revenuePerCustomer)} × ${percent(result.v.margin)})`} answer={count(result.breakEvenCustomers)} />
                  <Metric label="Customers for target ROI" value={count(result.targetCustomers)} description={`At your ${percent(result.v.targetRoi)} ROI target`} hint="Minimum whole number of customers needed to meet your chosen ROI target, assuming programme cost, revenue per customer and margin remain fixed." formula="Programme cost × (1 + Target ROI ÷ 100) ÷ Gross profit per customer, rounded up" calculation={result.targetCustomers === null ? "Gross profit per customer is zero." : `${cash(result.v.cost)} × (1 + ${decimal(result.v.targetRoi)} ÷ 100) ÷ ${cash(result.profitPerCustomer)}`} answer={count(result.targetCustomers)} />
                </div>
              </div>
              <div className={styles.targetSummary}>
                <Info size={16} aria-hidden="true" />
                <div><strong>Your target ROI</strong><p>{result.targetCustomers === null ? "Your target ROI cannot be achieved at a 0% gross margin." : result.additionalCustomers === 0 ? `Your current customer count meets or exceeds your ${percent(result.v.targetRoi)} ROI target under these assumptions.` : `Acquire ${whole(result.additionalCustomers)} additional ${result.additionalCustomers === 1 ? "customer" : "customers"} to meet or exceed your ${percent(result.v.targetRoi)} ROI target, assuming costs and margins remain unchanged.`}</p></div>
              </div>
              <div className={styles.previewFooter}>
                <div className={styles.resultActions}>
                  <button type="button" onClick={copy}><Copy size={14} />Copy results</button>
                  <button type="button" onClick={download}><Download size={14} />Export CSV</button>
                </div>
                {notice && <p role="status" className={styles.notice}>{notice}</p>}
              </div>
              <div className={styles.previewCta}>
                <div className={styles.previewCtaCopy}><strong>Could your content investment deliver more?</strong><p>We’ll identify which content opportunities could generate more qualified pipeline from your existing marketing budget.</p></div>
                <a href="https://www.seo-growup.com/get-in-touch" target="_blank" rel="noopener noreferrer" className={styles.previewCtaButton}><span>Discuss your content ROI</span><span className={styles.ctaArrow}><ArrowRight size={16} /></span></a>
              </div>
            </>
          ) : (
            <div className={styles.emptyState} aria-live="polite"><Info size={26} aria-hidden="true" /><h4>Your content ROI</h4><p>{result.message}</p></div>
          )}
        </section>
      </div>
      <div className={styles.modelNote}><Info size={15} aria-hidden="true" /><p>Results compare the entered programme cost with the first 12 months of revenue from each attributed customer. They assume fixed costs, revenue per customer and gross margin, and do not account for customer lifetime value, cash-flow timing or sales-cycle delays.</p></div>
    </div>
  );
}
