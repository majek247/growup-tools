import { useState } from "react";
import { Field, Tabs, Export, csv, s } from "./Shared";
export const faqs = [
  {
    question: "What if our team has not decided the scope?",
    answer:
      "Choose Ask the agency to recommend for an open responsibility. That decision becomes an explicit request in the brief so suppliers can price the same scenario.",
  },
  {
    question: "How do I compare what comes back?",
    answer:
      "Send the same brief and CSV response table to each agency. Ask them to specify fees, quantities, owners and dependencies. Return to the proposal comparison tool when quotes arrive.",
  },
  {
    question: "Can I use this if I only need a strategy?",
    answer:
      "Yes. Strategy, production and fully managed programmes have different 90-day deliverables, responsibility questions and response table rows. Adjust the milestone text to match your procurement timeline.",
  },
];
const recommend = "Ask the agency to recommend";
const types = {
  "SEO strategy": {
    roles: [
      "Provide analytics and CRM access",
      "Own roadmap implementation",
      "Approve commercial priorities",
    ],
    milestones:
      "First 30 days: audit the funnel, search performance and tracking.\nBy day 60: agree on buyer priorities and page opportunities.\nBy day 90: hand over a prioritised roadmap with owners and reporting definitions.",
    ask: "Roadmap format, commercial prioritisation and handover",
  },
  "Content production": {
    roles: [
      "Provide product expert interviews",
      "Approve claims and drafts",
      "Publish approved content",
    ],
    milestones:
      "First 30 days: agree on briefs, sources and editorial standards.\nBy day 60: deliver pilot assets and incorporate feedback.\nBy day 90: ship the agreed production schedule and review conversions.",
    ask: "Monthly assets by format, revisions and SME interview allowance",
  },
  "Fully managed SEO": {
    roles: [
      "Implement technical fixes",
      "Approve product claims",
      "Publish in the CMS",
      "Maintain CRM attribution",
    ],
    milestones:
      "First 30 days: baseline the site, agree on priority pages and audit measurement.\nBy day 60: ship priority fixes and the first agreed pages.\nBy day 90: review shipped work, qualified demand and the next quarter’s priorities.",
    ask: "Technical delivery, production volume, publishing and reporting ownership",
  },
};
const initial = {
  type: "Fully managed SEO",
  company: "",
  notes: "",
  goal: "",
  budget: "",
  timing: "",
};
export default function SeoAgencyBriefBuilder() {
  const [v, setV] = useState(initial),
    [roles, setRoles] = useState({}),
    [plans, setPlans] = useState({}),
    [tab, setTab] = useState("Agency brief");
  const set = (k, x) => setV({ ...v, [k]: x });
  const spec = types[v.type],
    plan = plans[v.type] ?? spec.milestones;
  const owner = (r) => roles[v.type + "|" + r] || recommend;
  const org = v.company.trim(),
    ready = Boolean(org && v.goal.trim() && plan.trim());
  const brief = [
    (org || "[Company]") + " — " + v.type + " agency brief",
    "Business objective\n" + (v.goal || "[Add an objective]"),
    "Current situation\n" +
      (v.notes.trim() || "Please identify the discovery inputs you need."),
    "Budget: " + (v.budget.trim() || "Please propose options with trade-offs."),
    "Timing: " + (v.timing.trim() || "Propose a start date and dependencies."),
    "First 90 days — proposed deliverables\n" + plan,
    "Responsibilities\n" +
      spec.roles.map((r) => r + ": " + owner(r)).join("\n"),
    "Proposal requested\nReturn the response table with itemised fees, minimum commitment and named delivery owners. Separate one-off fees from recurring costs and explain how results will be measured.",
  ].join("\n\n");
  const prompts = [
    ["Commercial", "One-off discovery or setup fees"],
    ["Commercial", "Monthly retainer and billing currency"],
    ["Commercial", "Minimum term, total committed fees and notice period"],
    ["Delivery", spec.ask],
    [
      "Delivery",
      "Milestones, quantities and acceptance criteria for the first 90 days",
    ],
    ...spec.roles.map((r) => ["Ownership", r + " — requested: " + owner(r)]),
    ["Capacity", "Client SME hours and review turnaround per month"],
    ["Measurement", "Reporting example, CRM dependencies and success metrics"],
  ];
  const response = csv([
    [
      "Category",
      "Please specify",
      "Agency response",
      "Fee or quantity",
      "Owner / dependencies",
    ],
    ...prompts.map(([c, q]) => [c, q, "", "", ""]),
  ]);
  function example() {
    if (
      (v.company || v.notes || v.goal) &&
      !confirm("Replace the brief inputs with the example?")
    )
      return;
    setV({
      ...initial,
      company: "Cedar Analytics",
      goal: "Generate more qualified demos from UK finance teams. Agree on the organic-sourced opportunity definition with sales.",
      notes:
        "Our team has one marketer, uses HubSpot and can offer one product interview per month.",
      budget: "£4,000–£6,000 per month",
      timing: "Kick off next quarter",
    });
    setPlans({});
    setRoles({});
  }
  return (
    <section className={s.shell}>
      <div className={s.grid}>
        <div className={s.panel}>
          <div className={s.head}>
            <h2>Your agency brief</h2>
            <button onClick={example}>Try sample brief</button>
          </div>
          <Field
            label="Programme"
            options={Object.keys(types)}
            value={v.type}
            change={(x) => set("type", x)}
          />
          <Field
            label="Company"
            value={v.company}
            change={(x) => set("company", x)}
          />
          <Field
            label="What business result should the agency help deliver?"
            area
            value={v.goal}
            change={(x) => set("goal", x)}
          />
          <Field
            label="Existing marketing notes (optional)"
            area
            value={v.notes}
            change={(x) => set("notes", x)}
          />
          <Field
            label="Budget range (optional)"
            value={v.budget}
            change={(x) => set("budget", x)}
          />
          <Field
            label="Target start or deadline (optional)"
            value={v.timing}
            change={(x) => set("timing", x)}
          />
          <div className={s.item}>
            <h3>Who owns the work?</h3>
            {spec.roles.map((r) => (
              <Field
                label={r}
                key={r}
                options={[recommend, "Our team", "Agency team", "Shared"]}
                value={owner(r)}
                change={(x) => setRoles({ ...roles, [v.type + "|" + r]: x })}
              />
            ))}
          </div>
          <Field
            label="First 90 days"
            area
            value={plan}
            change={(x) => setPlans({ ...plans, [v.type]: x })}
          />
        </div>
        <div className={s.side}>
          <Tabs
            names={["Agency brief", "Pricing response table"]}
            active={tab}
            change={setTab}
          />
          {tab === "Agency brief" ? (
            <>
              <h2>Brief preview</h2>
              <pre>{brief}</pre>
              {ready ? (
                <Export
                  name="seo-agency-brief.txt"
                  text={brief}
                  copyLabel="Copy agency brief"
                />
              ) : (
                <p>Add a company, objective and 90-day scope to export.</p>
              )}
            </>
          ) : (
            <>
              <h2>Agency response table</h2>
              <p>
                Send the same spreadsheet to every agency. Each row asks for a
                specific answer, cost or owner.
              </p>
              <ol>
                {prompts.map(([c, q]) => (
                  <li key={q}>{q}</li>
                ))}
              </ol>
              <Export
                name="agency-pricing-response.csv"
                text={response}
                csvFile
                downloadLabel="Download response table"
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
