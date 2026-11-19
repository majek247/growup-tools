import Workspace from "./Workspace";


const spec = {
  "slug": "buyer-and-icp-brief",
  "title": "Buyer and ICP Brief",
  "output": "Buyer and ICP brief",
  "steps": [
    {
      "title": "Account fit",
      "prompt": "Which accounts should this piece attract?",
      "fields": [
        {
          "id": "project",
          "label": "Project or company",
          "hint": "e.g. RelayLedger"
        },
        {
          "id": "industry",
          "label": "Industry and company profile"
        },
        {
          "id": "market",
          "label": "Geography and constraints"
        },
        {
          "id": "exclude",
          "label": "Poor-fit accounts and why",
          "long": true
        }
      ]
    },
    {
      "title": "Buying situation",
      "prompt": "What makes the reader act now?",
      "fields": [
        {
          "id": "role",
          "label": "Primary reader and role"
        },
        {
          "id": "job",
          "label": "Task or decision they face",
          "long": true
        },
        {
          "id": "trigger",
          "label": "Trigger event",
          "long": true
        },
        {
          "id": "alternative",
          "label": "Current workaround"
        },
        {
          "id": "distrust",
          "label": "What they distrust and why",
          "long": true
        }
      ]
    },
    {
      "title": "Evidence",
      "prompt": "What would convince this buyer?",
      "fields": [
        {
          "id": "quote",
          "label": "Buyer’s own words and source",
          "long": true
        },
        {
          "id": "proof",
          "label": "Evidence they will trust",
          "long": true
        },
        {
          "id": "committee",
          "label": "Other people involved"
        },
        {
          "id": "next",
          "label": "Next useful action"
        }
      ]
    }
  ],
  "sample": {
    "project": "UK billing guide",
    "industry": "B2B SaaS with usage-based billing",
    "market": "UK finance teams",
    "exclude": "Pre-revenue companies without usage billing",
    "role": "Finance director",
    "job": "Close the month without reconciling three exports.",
    "trigger": "A new usage-based product launches next quarter.",
    "alternative": "Spreadsheets and manual checks",
    "distrust": "Generic time-saving claims with no workflow shown.",
    "quote": "“Show me how adjustments are approved.” Sales discovery notes, call 4.",
    "proof": "Annotated invoice and audit trail.",
    "committee": "Finance ops and engineering",
    "next": "Request a sample reconciliation walkthrough."
  }
,
require: v => v.role.trim() ? "" : "Name the primary reader before exporting."
};
export const faqs = [
  {
    "question": "What distinguishes ICP and reader?",
    "answer": "The ICP identifies companies that fit. The reader section identifies the person, task and evidence the writer needs to address."
  },
  {
    "question": "How do I share the result?",
    "answer": "Open Review & export to copy the output or download a PDF. Your entries stay in this browser tab while you work."
  }
];
export default function BuyerAndIcpBrief() {
  return <Workspace spec={spec} />;
}
