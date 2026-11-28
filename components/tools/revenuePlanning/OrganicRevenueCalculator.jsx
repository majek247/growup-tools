import { useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Copy,
  Download,
  Info,
  RotateCcw,
} from "lucide-react";
import styles from "./OrganicRevenueCalculator.module.css";

export const faqs = [
  {
    question: "How does the organic revenue calculator work?",
    answer:
      "The calculator works backwards from your new ARR target using your average annual contract value and funnel conversion rates. It calculates the number of customers, qualified opportunities and MQLs required, along with the total organic visits needed to generate them. Your current monthly traffic and planning period determine how much additional traffic growth is required.",
  },
  {
    question:
      "What is the difference between an SEO revenue calculator and an SEO forecasting tool?",
    answer:
      "An SEO revenue calculator works backwards from a commercial target to establish what your organic search programme needs to deliver. An SEO forecasting tool typically works in the opposite direction, using historical performance, search demand, ranking assumptions and projected traffic growth to estimate future results. The two can be used together: the revenue calculator establishes your acquisition requirements, while an SEO forecast helps assess whether those requirements are achievable.  ",
  },
  {
    question:
      "How can an organic revenue calculator help with annual marketing planning?",
    answer:
      "An organic revenue calculator helps you assess whether your annual SEO targets are realistic before committing to them. You can test different revenue targets, contract values and conversion rates to understand what your marketing team needs to deliver and whether additional budget or resources may be necessary.",
  },
  {
    question:
      "Can I use this SEO revenue calculator to build a business case for additional SEO investment?",
    answer:
      "Yes. You can use the calculator to demonstrate the potential commercial implications of maintaining your current organic search performance versus investing in traffic growth and conversion improvements. This gives your CFO a clearer basis for evaluating additional SEO expenditure.",
  },
];

const EXAMPLE = {
  currency: "GBP",
  currentArr: "1000000",
  targetArr: "2000000",
  share: "30",
  months: "12",
  acv: "20000",
  visitToMql: "1.2",
  mqlToSql: "35",
  sqlToCustomer: "25",
  currentVisits: "850",
};
const EMPTY = Object.fromEntries(Object.keys(EXAMPLE).map((key) => [key, key === "currency" ? "GBP" : ""]));
const SYMBOLS = { GBP: "£", USD: "$", EUR: "€", NGN: "₦" };
const compact = (value) => new Intl.NumberFormat("en-GB", { notation: "compact", maximumFractionDigits: 1 }).format(value);
const whole = (value) => new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(value);
const decimal = (value) => new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 }).format(value);
const money = (value, currency, short = false) => `${SYMBOLS[currency]}${short ? compact(value) : whole(value)}`;
const numeric = (raw) => raw === "" || raw == null ? NaN : Number(raw);
const finite = (value) => Number.isFinite(value);

function model(input) {
  const fields = ["currentArr", "targetArr", "share", "months", "acv", "visitToMql", "mqlToSql", "sqlToCustomer", "currentVisits"];
if (fields.some((field) => String(input[field] ?? "").trim() === "")) return { message: "Enter your numbers to generate your revenue plan." };
  const v = Object.fromEntries(fields.map((field) => [field, numeric(input[field])]));
  if (fields.some((field) => !finite(v[field]) || v[field] < 0)) return { message: "Enter valid, non-negative figures in every field." };
  if (!Number.isInteger(v.months) || v.months < 2 || v.months > 36) return { message: "Choose a whole number between 2 and 36 months." };
  if (v.targetArr < v.currentArr) return { message: "Target ARR must be at least as high as current ARR." };
  if (v.acv <= 0) return { message: "Average annual contract value must be greater than zero." };
  if (v.share > 100 || v.visitToMql > 100 || v.mqlToSql > 100 || v.sqlToCustomer > 100) return { message: "Conversion rates and organic share cannot exceed 100%." };
  if (v.visitToMql <= 0 || v.mqlToSql <= 0 || v.sqlToCustomer <= 0) return { message: "Conversion rates must be greater than zero." };
  const gap = v.targetArr - v.currentArr;
  const organicArr = gap * v.share / 100;
  const customers = Math.ceil(organicArr / v.acv);
  const sqls = Math.ceil(customers / (v.sqlToCustomer / 100));
  const mqls = Math.ceil(sqls / (v.mqlToSql / 100));
  const requiredVisits = Math.ceil(mqls / (v.visitToMql / 100));
  const existingVisits = v.currentVisits * v.months;
  const alreadyOnTrack = requiredVisits <= existingVisits;
  // Straight-line traffic growth from the current monthly baseline to month N.
  // Summation: N * baseline + (end - baseline) * (N + 1) / 2.
  const endpointExact = alreadyOnTrack ? v.currentVisits : v.currentVisits + 2 * (requiredVisits - existingVisits) / (v.months + 1);
  const endpoint = Math.ceil(endpointExact);
  const monthly = Array.from({ length: v.months }, (_, index) => {
    const month = index + 1;
    const visits = alreadyOnTrack ? v.currentVisits : v.currentVisits + (endpoint - v.currentVisits) * month / v.months;
    return { month, visits };
  });
  let cumulativeVisits = 0;
  for (const row of monthly) {
    cumulativeVisits += row.visits;
    row.mqls = row.visits * v.visitToMql / 100;
    row.sqls = row.mqls * v.mqlToSql / 100;
    row.customers = row.sqls * v.sqlToCustomer / 100;
    row.cumulativeArr = cumulativeVisits * v.visitToMql / 100 * v.mqlToSql / 100 * v.sqlToCustomer / 100 * v.acv;
  }
  return {
    v, gap, organicArr, customers, sqls, mqls, requiredVisits, existingVisits,
    endpoint, alreadyOnTrack, monthly,
    pipeline: sqls * v.acv,
    expectedArr: monthly[monthly.length - 1].cumulativeArr,
    totalPlannedVisits: cumulativeVisits,
    multiple: v.currentVisits > 0 ? endpoint / v.currentVisits : null,
  };
}

function Field({
  label,
  hint,
  value,
  onChange,
  suffix,
  prefix,
  min = 0,
  max,
  step = "any",
}) {
  const [focused, setFocused] = useState(false);

  const shouldFormat =
    Boolean(prefix) || label === "Current monthly organic visits";

  const displayValue =
    shouldFormat &&
    !focused &&
    value !== "" &&
    Number.isFinite(Number(value))
      ? Number(value).toLocaleString("en-GB", {
          maximumFractionDigits: 10,
        })
      : value;

  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>
        {label}

        <span
          className={styles.infoWrap}
          tabIndex={0}
          aria-label={hint}
        >
          <Info size={13} />
          <span className={styles.tooltip}>{hint}</span>
        </span>
      </span>

      <span className={styles.control}>
        {prefix && (
          <span className={styles.prefix}>{prefix}</span>
        )}

        <input
          aria-label={label}
          value={displayValue}
          type={shouldFormat ? "text" : "number"}
          inputMode="decimal"
          min={shouldFormat ? undefined : min}
          max={shouldFormat ? undefined : max}
          step={shouldFormat ? undefined : step}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(event) => {
            const raw = event.target.value.replace(/,/g, "");

            if (!shouldFormat || /^\d*\.?\d*$/.test(raw)) {
              onChange(raw);
            }
          }}
        />

        {suffix && (
          <span className={styles.suffix}>{suffix}</span>
        )}
      </span>
    </label>
  );
}






function MetricInfo({
  label,
  description,
  formula,
  calculation,
  answer,
  note,
}) {
  return (
    <span
      className={styles.metricInfo}
      tabIndex={0}
      aria-label={`${label}: ${description}${formula ? `. Calculation: ${formula}` : ""}${calculation ? `. Your numbers: ${calculation}` : ""}${answer ? `. Result: ${answer}` : ""}${note ? `. ${note}` : ""}`}
    >
      <Info size={12} aria-hidden="true" />

      <span
        className={styles.metricTooltip}
        role="tooltip"
      >
        <span className={styles.tooltipHeading}>
          {label}
        </span>

        <span className={styles.tooltipDefinition}>
          {description}
        </span>

        {formula && (
          <span className={styles.tooltipFormula}>
            <span className={styles.tooltipCaption}>
              CALCULATION
            </span>

            <span>{formula}</span>
          </span>
        )}

        {calculation && (
          <span className={styles.tooltipWorkedExample}>
            <span className={styles.tooltipCaption}>
              YOUR NUMBERS
            </span>

            <span className={styles.tooltipCalculation}>
              {calculation}
            </span>

            {answer && (
              <strong className={styles.tooltipAnswer}>
                = {answer}
              </strong>
            )}
          </span>
        )}

        {note && (
          <span className={styles.tooltipNote}>
            {note}
          </span>
        )}
      </span>
    </span>
  );
}

function PreviewMetric({
  label,
  value,
  description,
  hint,
  formula,
  calculation,
  answer,
  note,
}) {
  return (
    <div className={styles.metricCell}>
      <div className={styles.metricLabel}>
        <span>{label}</span>

        <MetricInfo
          label={label}
          description={hint}
          formula={formula}
          calculation={calculation}
          answer={answer}
          note={note}
        />
      </div>

      <strong className={styles.metricValue}>
        {value}
      </strong>

      {description && (
        <small className={styles.metricDescription}>
          {description}
        </small>
      )}
    </div>
  );
}


function Chart({
  rows,
  baseline,
  view,
  currency,
  arrTarget,
}) {
  const isRevenue = view === "arr";

  const width = 940;
  const height = 260;
  const left = 65;
  const right = 24;
  const top = 26;
  const bottom = 40;

  const innerWidth = width - left - right;
  const innerHeight = height - top - bottom;

  const getValue = (row) =>
    isRevenue ? row.cumulativeArr : row.visits;

  const reference = isRevenue ? arrTarget : baseline;

  const peak =
    Math.max(reference, ...rows.map(getValue), 1) * 1.12;

  const rawStep = peak / 4;

  const magnitude =
    10 ** Math.floor(Math.log10(rawStep));

  const step =
    ([1, 2, 2.5, 5, 10].find(
      (n) => n * magnitude >= rawStep
    ) || 10) * magnitude;

  const maximum = Math.ceil(peak / step) * step;

  const ticks = Array.from(
    { length: Math.round(maximum / step) + 1 },
    (_, i) => i * step
  );

  const scaleY = (value) =>
    top + innerHeight - (value / maximum) * innerHeight;

  const barSlot = innerWidth / rows.length;
  const barWidth = Math.min(65, barSlot * 0.72);

  const formatAxis = (value) =>
    isRevenue
      ? money(value, currency, true)
      : compact(value);

  const formatValue = (value) =>
    isRevenue
      ? money(value, currency)
      : whole(value);

  return (
    <div className={styles.chartScroll}>
      <svg
        className={styles.chart}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={
          isRevenue
            ? "Cumulative new ARR by month"
            : "Monthly organic traffic requirements"
        }
      >
        {ticks.map((tick) => {
          const y = scaleY(tick);

          return (
            <g key={tick}>
              <line
                x1={left}
                x2={width - right}
                y1={y}
                y2={y}
                stroke="#e3eae7"
                strokeWidth="1"
              />

              <text
                x={left - 12}
                y={y + 4}
                fontSize="11"
                fill="#718481"
                textAnchor="end"
              >
                {formatAxis(tick)}
              </text>
            </g>
          );
        })}

        {rows.map((row, index) => {
          const value = getValue(row);
          const active = index === rows.length - 1;

          const x =
            left +
            index * barSlot +
            (barSlot - barWidth) / 2;

          const y = scaleY(value);

          return (
            <g key={row.month}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={top + innerHeight - y}
                rx="3"
                fill={active ? "#167273" : "#12323e"}
                tabIndex={0}
                aria-label={`Month ${row.month}: ${formatValue(value)}`}
              >
                <title>
                  {`Month ${row.month}: ${formatValue(value)}`}
                </title>
              </rect>

              {(rows.length <= 18 ||
                index % Math.ceil(rows.length / 12) === 0 ||
                active) && (
                <text
                  x={x + barWidth / 2}
                  y={height - 16}
                  fontSize="11"
                  textAnchor="middle"
                  fill="#60736f"
                >
                  {row.month}
                </text>
              )}

              {active && (
                <text
                  x={Math.min(x + barWidth / 2, width - 45)}
                  y={Math.max(13, y - 9)}
                  fontSize="13"
                  fontWeight="700"
                  textAnchor="middle"
                  fill="#167273"
                >
                  {formatAxis(value)}
                </text>
              )}
            </g>
          );
        })}

        <line
          x1={left}
          x2={width - right}
          y1={scaleY(reference)}
          y2={scaleY(reference)}
          stroke="#82aaa3"
          strokeWidth="1.5"
          strokeDasharray="5 5"
        />
      </svg>

      <div className={styles.chartLegend}>
        <span>
          <i className={styles.legendBars} />
          {isRevenue ? "Cumulative new ARR" : "Monthly visits"}
        </span>

        <span>
          <i className={styles.legendFinal} />
          Final month
        </span>

        <span>
          <i className={styles.legendBase} />
          {isRevenue ? "ARR target" : "Current traffic"}
        </span>
      </div>
    </div>
  );
}

export default function OrganicRevenueCalculator() {
  const [values, setValues] = useState(EXAMPLE);
  const [notice, setNotice] = useState("");
  const [chartView, setChartView] = useState("traffic");
  const result = useMemo(() => model(values), [values]);
  const setField = (key, value) => { setValues((previous) => ({ ...previous, [key]: value })); setNotice(""); };
  const loadExample = () => { setValues({ ...EXAMPLE }); setNotice("Example values loaded."); };
  const startFresh = () => { setValues({ ...EMPTY }); setNotice(""); };
  const isReady = !result.message;
  const currency = values.currency;
  const trafficGrowth =
    isReady && result.v.currentVisits > 0
      ? Math.max(
          0,
          (result.endpoint / result.v.currentVisits - 1) * 100
        )
      : null;
  const report = () => {
    if (!isReady) return "";
    return [
      "GROWUP / ORGANIC REVENUE PLAN", "",
      `Currency: ${currency} (entered amounts; no currency conversion)`,
      `Current ARR: ${money(result.v.currentArr, currency)}`,
      `Target ARR: ${money(result.v.targetArr, currency)}`,
      `New ARR gap: ${money(result.gap, currency)}`,
      `Share from organic and AI search: ${result.v.share}%`,
      `Planning period: ${result.v.months} months`,
      `Average annual contract value: ${money(result.v.acv, currency)}`,
      `Visit-to-MQL rate: ${result.v.visitToMql}%`,
      `MQL-to-SQL rate: ${result.v.mqlToSql}%`,
      `SQL-to-customer rate: ${result.v.sqlToCustomer}%`,
      `Current organic visits/month: ${whole(result.v.currentVisits)}`, "",
      "TARGETS", `New ARR from organic: ${money(result.organicArr, currency)}`,
      `Pipeline required: ${money(result.pipeline, currency)}`,
      `Customers: ${whole(result.customers)}`, `SQLs: ${whole(result.sqls)}`,
      `MQLs: ${whole(result.mqls)}`, `Total visits: ${whole(result.requiredVisits)}`,
      `Month ${result.v.months} traffic target: ${whole(result.endpoint)} visits/month`,
      result.alreadyOnTrack ? "At current visit volume, cumulative traffic is already sufficient under the chosen conversion assumptions." : "Monthly traffic follows a linear growth assumption.", "",
      "Monthly estimates are fractional expected values, not literal people or guaranteed outcomes.",
      "The model assumes no churn, stable conversion rates, a fixed contract value and that new customers contribute full-year ARR.",
      "Created with GrowUp | seo-growup.com",
    ].join("\n");
  };
  const copy = async () => {
    if (!isReady) return;
    try { await navigator.clipboard.writeText(report()); setNotice("Plan copied to clipboard."); }
    catch { setNotice("Copy failed. Use Download CSV instead."); }
  };
  const download = () => {
    if (!isReady) return;
    const header = ["Month", "Organic visits", "MQLs (expected)", "SQLs (expected)", "Customers (expected)", "New ARR cumulative (" + currency + ")", "Qualified pipeline cumulative (" + currency + ")"];
    const lines = [header.join(","), ...result.monthly.map((row) => [row.month, Math.round(row.visits), row.mqls.toFixed(2), row.sqls.toFixed(2), row.customers.toFixed(2), row.cumulativeArr.toFixed(2), (row.cumulativeArr / (result.v.sqlToCustomer / 100)).toFixed(2)].join(","))];
    const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "growup-organic-revenue-plan.csv";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Monthly planning CSV downloaded.");
  };


    return (
    <div className={styles.root}>

      {/* CALCULATOR HEADER */}

      <div className={styles.toolbar}>
        <div>
          <h2>Build Your Organic Revenue Plan.</h2>

          <p>
            Calculate the traffic, leads and pipeline you
            need to reach your revenue target.
          </p>
        </div>

        <div className={styles.toolbarActions}>
          <button type="button" onClick={loadExample}>
            <RotateCcw size={14} />
            Use example
          </button>

          <button type="button" onClick={startFresh}>
            Start fresh
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className={styles.layout}>

        {/* PLANNING ASSUMPTIONS */}

        <section
          className={styles.inputCard}
          aria-label="Revenue planning assumptions"
        >
          <div className={styles.assumptionsHeader}>
            <h3>Your Planning Assumptions</h3>

            <select
              aria-label="Reporting currency"
              className={styles.currencySelect}
              value={currency}
              onChange={(event) =>
                setField("currency", event.target.value)
              }
            >
              {Object.entries(SYMBOLS).map(([code, symbol]) => (
                <option key={code} value={code}>
                  {code} ({symbol})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.segmentTitle}>
            Revenue Goals
          </div>

          <div className={styles.fieldsGrid}>

            <Field
              label="Current ARR"
              prefix={SYMBOLS[currency]}
              value={values.currentArr}
              onChange={(v) => setField("currentArr", v)}
              hint="Your company's annual recurring revenue today, excluding one-off fees and non-recurring income. Use your latest reported ARR figure."
            />

            <Field
              label="Target ARR"
              prefix={SYMBOLS[currency]}
              value={values.targetArr}
              onChange={(v) => setField("targetArr", v)}
              hint="The total ARR your business wants to reach by the end of the planning period, including revenue from existing customers."
            />

            <Field
              label="Planning period"
              suffix="months"
              step="1"
              min={2}
              max={36}
              value={values.months}
              onChange={(v) => setField("months", v)}
              hint="How long your business has to reach its ARR target. Choose a planning window of 2 to 36 months, based on your commercial goals."
            />

            <Field
              label="Organic & AI contribution"
              suffix="%"
              max={100}
              value={values.share}
              onChange={(v) => setField("share", v)}
              hint="How much of your planned ARR growth you expect organic and AI search to generate. For example, if marketing owns 60% of new ARR and organic accounts for half of that, enter 30%."
            />

          </div>

          <div className={styles.segmentTitle}>
            Sales funnel
          </div>

          <div className={styles.fieldsGrid}>

            <Field
              label="Annual contract value"
              prefix={SYMBOLS[currency]}
              value={values.acv}
              onChange={(v) => setField("acv", v)}
              hint="The average annual recurring revenue a new customer brings in. For a three-year contract worth £60,000 in recurring revenue, enter £20,000."
            />

            <Field
              label="Visit-to-MQL rate"
              suffix="%"
              max={100}
              value={values.visitToMql}
              onChange={(v) => setField("visitToMql", v)}
              hint="How often organic and AI search visits turn into leads that meet your marketing qualification criteria. If 1,000 visits generate 12 MQLs, enter 1.2%."
            />

            <Field
              label="MQL-to-SQL rate"
              suffix="%"
              max={100}
              value={values.mqlToSql}
              onChange={(v) => setField("mqlToSql", v)}
              hint="The proportion of marketing-qualified leads that progress into qualified sales opportunities. If 100 MQLs generate 35 opportunities, enter 35%."
            />

            <Field
              label="SQL-to-customer rate"
              suffix="%"
              max={100}
              value={values.sqlToCustomer}
              onChange={(v) => setField("sqlToCustomer", v)}
              hint="Your sales win rate for qualified opportunities generated through organic and AI search. If 20 qualified opportunities result in five closed-won deals, enter 25%."
            />

            <div className={styles.fullField}>
              <Field
                label="Current monthly organic visits"
                value={values.currentVisits}
                onChange={(v) => setField("currentVisits", v)}
                hint="Your current monthly traffic from organic and AI search, before any additional growth. Use an average of the last three months to account for seasonal changes and traffic fluctuations."
              />
            </div>

          </div>

          <div className={styles.inputFoot}>
            <Info size={15} />

            <span>
              Use your actual CRM conversion rates for a
              more reliable plan.
            </span>
          </div>

        </section>



        {/* REVENUE PLAN */}

        <section
          className={styles.resultsCard}
          aria-label="Your organic revenue plan"
        >
          <div className={styles.previewHeader}>
            <h3>What it’ll take to reach your target.

</h3>

            <p>
              {isReady
                ? `Your acquisition plan for the next ${result.v.months} months.`
                : "Your acquisition plan based on your numbers."}
            </p>
          </div>

          {isReady ? (
            <>
              {/* CONVERSATIONAL EXECUTIVE SUMMARY */}

              <div className={styles.executiveSummary}>
                To generate{" "}

                <strong>
                  {money(result.organicArr, currency)} in new ARR
                </strong>

                {" "}from organic and AI search,
                you’ll need approximately{" "}

                <strong>
                  {whole(result.sqls)} qualified opportunities
                </strong>

                {" "}from{" "}

                <strong>
                  {whole(result.mqls)} MQLs
                </strong>

                {result.alreadyOnTrack ? (
                  <>
                    , with your current monthly traffic of{" "}

                    <strong>
                      {whole(result.v.currentVisits)} visits
                    </strong>

                    {" "}already sufficient under your
                    conversion assumptions.
                  </>
                ) : (
                  <>
                    , with monthly traffic growing from{" "}

                    {whole(result.v.currentVisits)}

                    {" "}to{" "}

                    <strong>
                      {whole(result.endpoint)} visits.
                    </strong>
                  </>
                )}
              </div>

              {/* COMMERCIAL METRICS */}

              <div className={styles.metricsPanel}>

                {/* PRIMARY TRAFFIC METRIC */}

                <div className={styles.heroMetric}>
                  <div className={styles.metricLabel}>
                    <span>
                      Monthly organic visits needed by
                      month {result.v.months}
                    </span>


<MetricInfo
  label="Final-month traffic target"
  description="The number of monthly visits organic and AI search need to generate by the end of your planning period to support your ARR target, assuming steady month-on-month growth in traffic volume."
  formula="We work backwards from your required leads, account for the traffic you already generate, and calculate the monthly increase needed to close the gap."
  calculation={
    result.alreadyOnTrack
      ? [
          "1. Total traffic required",
          `${whole(result.mqls)} MQLs ÷ ${result.v.visitToMql}% conversion rate = ${whole(result.requiredVisits)} visits (rounded up)`,

          "",

          "2. Traffic from your existing baseline",
          `${whole(result.v.currentVisits)} × ${result.v.months} months = ${whole(result.existingVisits)} visits`,

          "",

          "Your existing traffic covers the total requirement. No additional traffic growth is needed.",
        ].join("\n")
      : [
          "1. Total traffic required",
          `${whole(result.mqls)} MQLs ÷ ${result.v.visitToMql}% visit-to-MQL rate = ${whole(result.requiredVisits)} visits (rounded up)`,

          "",

          "2. Traffic from your existing baseline",
          `${whole(result.v.currentVisits)} monthly visits × ${result.v.months} months = ${whole(result.existingVisits)} visits`,

          "",

          "3. Additional traffic required",
          `${whole(result.requiredVisits)} − ${whole(result.existingVisits)} = ${whole(result.requiredVisits - result.existingVisits)} additional visits`,

          "",

          "4. Required monthly increase",
          `Because traffic grows cumulatively, month 1 benefits from one increase, month 2 from two increases, and so on up to month ${result.v.months}.`,

          "",

          `Sum of monthly increases: 1 + 2 + ... + ${result.v.months} = ${result.v.months} × (${result.v.months} + 1) ÷ 2 = ${whole(result.v.months * (result.v.months + 1) / 2)}`,

          "",

          `${whole(result.requiredVisits - result.existingVisits)} ÷ ${whole(result.v.months * (result.v.months + 1) / 2)} ≈ ${decimal((result.requiredVisits - result.existingVisits) / (result.v.months * (result.v.months + 1) / 2))} additional visits per month`,

          "",

          "5. Final-month traffic target",
          `${whole(result.v.currentVisits)} + (${decimal((result.requiredVisits - result.existingVisits) / (result.v.months * (result.v.months + 1) / 2))} × ${result.v.months})`,
        ].join("\n")
  }
  answer={`${whole(result.endpoint)} visits/month`}
   
/>



                  </div>

                  <strong className={styles.heroMetricValue}>
                    {whole(result.endpoint)}
                  </strong>

                  <small className={styles.metricDescription}>
                    {result.alreadyOnTrack
                      ? "No additional traffic growth required"
                      : trafficGrowth !== null
                        ? `${decimal(trafficGrowth)}% growth from your current monthly traffic`
                        : "Building from zero monthly visits"}
                  </small>
                </div>

                {/* SUPPORTING COMMERCIAL METRICS */}

                <div className={styles.commercialMetrics}>
<PreviewMetric
  label="New organic ARR"
  value={money(result.organicArr, currency, true)}
  description={`${money(
    result.organicArr / 12,
    currency,
    true
  )} in new MRR`}
  hint="The additional annual recurring revenue that organic and AI search need to contribute towards your company’s growth target."
  formula="(Target ARR − Current ARR) × Organic contribution"
  calculation={`(${money(
    result.v.targetArr,
    currency
  )} − ${money(
    result.v.currentArr,
    currency
  )}) × ${result.v.share}%`}
  answer={money(result.organicArr, currency)}
   note={`An additional ${money(
    result.organicArr,
    currency
  )} in ARR is equivalent to ${money(
    result.organicArr / 12,
    currency
  )} in new MRR once the revenue target is reached, regardless of when customers are invoiced.`}
/>

            <PreviewMetric
  label="Qualified pipeline needed"
  value={money(result.pipeline, currency, true)}
  description={`At a ${decimal(
    result.v.sqlToCustomer
  )}% win rate`}
  hint="The total annual contract value of qualified sales opportunities your organic and AI search programme needs to generate."
  formula="Qualified opportunities × Average annual contract value"
  calculation={`${whole(result.sqls)} × ${money(
    result.v.acv,
    currency
  )}`}
  answer={money(result.pipeline, currency)}
  note={`At your ${result.v.sqlToCustomer}% win rate, this pipeline is expected to generate approximately ${money(
    result.pipeline * result.v.sqlToCustomer / 100,
    currency
  )} in new ARR.`}
/>

  <PreviewMetric
  label="New customers"
  value={whole(result.customers)}
  description={`${decimal(
    result.customers / result.v.months
  )} per month on average`}
  hint="The number of new paying customers you need to acquire through organic and AI search to meet your new ARR target."
  formula="New organic ARR ÷ Average annual contract value"
  calculation={`${money(
    result.organicArr,
    currency
  )} ÷ ${money(result.v.acv, currency)}`}
  answer={`${whole(result.customers)} customers`}
  note={`Rounded up to a whole customer. Monthly average = ${whole(
    result.customers
  )} ÷ ${result.v.months} = ${decimal(
    result.customers / result.v.months
  )}.`}
/>

          <PreviewMetric
  label="Qualified opportunities"
  value={whole(result.sqls)}
  description={`${decimal(
    result.sqls / result.v.months
  )} per month on average`}
  hint="The number of sales-qualified opportunities needed to close enough new customers at your current sales win rate."
  formula="New customers required ÷ SQL-to-customer conversion rate"
  calculation={`${whole(
    result.customers
  )} ÷ ${result.v.sqlToCustomer}%`}
  answer={`${whole(result.sqls)} opportunities`}
  note={`Rounded up to a whole opportunity. At a ${result.v.sqlToCustomer}% win rate, ${whole(
    result.sqls
  )} opportunities are expected to produce approximately ${decimal(
    result.sqls * result.v.sqlToCustomer / 100
  )} customers.`}
/>

            <PreviewMetric
  label="Marketing-qualified leads"
  value={whole(result.mqls)}
  description={`${decimal(
    result.mqls / result.v.months
  )} per month on average`}
  hint="The number of leads meeting your marketing qualification criteria needed to generate the required sales opportunities."
  formula="Qualified opportunities ÷ MQL-to-SQL conversion rate"
  calculation={`${whole(
    result.sqls
  )} ÷ ${result.v.mqlToSql}%`}
  answer={`${whole(result.mqls)} MQLs`}
  note={`The unrounded requirement is ${decimal(
    result.sqls / (result.v.mqlToSql / 100)
  )} MQLs. We round up to ensure the acquisition target is not understated.`}
/>

      <PreviewMetric
  label="Total organic visits"
  value={whole(result.requiredVisits)}
  description={`Across ${result.v.months} months`}
  hint="The minimum total visits from organic and AI search needed throughout your planning period to generate the required marketing-qualified leads."
  formula="Marketing-qualified leads ÷ Visit-to-MQL conversion rate"
  calculation={`${whole(
    result.mqls
  )} ÷ ${result.v.visitToMql}%`}
  answer={`${whole(result.requiredVisits)} visits`}
  note={`Rounded up to a whole visit. Your monthly growth plan totals approximately ${whole(
    result.totalPlannedVisits
  )} visits after accounting for the current traffic baseline and final-month target.`}
/>

                </div>
              </div>

              {/* EXPORT CONTROLS */}

              <div className={styles.previewFooter}>
                <div className={styles.resultActions}>

                  <button type="button" onClick={copy}>
                    <Copy size={14} />
                    Copy plan
                  </button>

                  <button type="button" onClick={download}>
                    <Download size={14} />
                    Export CSV
                  </button>

                </div>

                {notice && (
                  <p
                    role="status"
                    className={styles.notice}
                  >
                    {notice}
                  </p>
                )}
              </div>

              {/* GROWUP CTA */}

              <div className={styles.previewCta}>

                <div className={styles.previewCtaCopy}>
                  <strong>
                   What would it take to hit these targets?
                  </strong>

                  <p>
         We’ll review your current search performance, identify gaps in buyer-facing content and build an SEO roadmap around your revenue goals.
                  </p>
                </div>

                <a
                  href="https://www.seo-growup.com/get-in-touch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.previewCtaButton}
                >
                  <span>Discuss your targets</span>

                  <span className={styles.ctaArrow}>
                    <ArrowRight size={16} />
                  </span>
                </a>

              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <Info size={26} />

              <h4>Your revenue plan</h4>

              <p>{result.message}</p>
            </div>
          )}
        </section>
      </div>


    </div>
  );
}