import Workspace from "./Workspace";


const spec = {
  "slug": "product-fact-sheet",
  "title": "Product Fact Sheet",
  "output": "Product fact sheet",
  "steps": [
    {
      "title": "Product",
      "prompt": "Which product and version is covered?",
      "fields": [
        {
          "id": "project",
          "label": "Project or company",
          "hint": "e.g. RelayLedger"
        },
        {
          "id": "version",
          "label": "Version or market"
        },
        {
          "id": "owner",
          "label": "Product owner"
        },
        {
          "id": "restrictions",
          "label": "Claims writers must avoid",
          "long": true
        }
      ]
    },
    {
      "title": "Verified facts",
      "prompt": "Document the exact wording writers can use",
      "fields": [
        {
          "id": "facts",
          "label": "Use a separate entry for each material claim.",
          "item": "Fact",
          "columns": [
            {
              "id": "type",
              "label": "Category",
              "options": [
                "Feature",
                "Pricing",
                "Integration",
                "Limitation"
              ]
            },
            {
              "id": "claim",
              "label": "Approved wording"
            },
            {
              "id": "source",
              "label": "Source or document"
            },
            {
              "id": "checked",
              "label": "Verified on"
            },
            {
              "id": "caveat",
              "label": "Limitations or plan restrictions"
            }
          ],
          "initial": [
            {
              "type": "Feature",
              "claim": "",
              "source": "",
              "checked": "",
              "caveat": ""
            }
          ],
          "fixed": false
        }
      ]
    }
  ],
  "sample": {
    "project": "RelayLedger",
    "version": "UK pricing",
    "owner": "Product Marketing",
    "restrictions": "Never imply all plans include API access.",
    "facts": [
      {
        "type": "Pricing",
        "claim": "Starter includes CSV export.",
        "source": "Approved UK plan matrix, row 3",
        "checked": "12 January",
        "caveat": "UK plan only"
      },
      {
        "type": "Integration",
        "claim": "API access is included on Enterprise.",
        "source": "API documentation, access section",
        "checked": "12 January",
        "caveat": "Enterprise subscription required"
      }
    ]
  }
,
require:v=>!v.project.trim()?'Enter the product name.':!v.facts.length || v.facts.some(r=>!r.claim.trim()||!r.source.trim()||!r.checked.trim())?'Each fact needs wording, a source and a verification date.':''
};
export const faqs = [
  {
    "question": "How do we keep facts current?",
    "answer": "Record the source, market, plan and verification date. Ask the product owner to recheck material claims before publishing."
  },
  {
    "question": "How do I share the result?",
    "answer": "Open Review & export to copy the output or download a PDF. Your entries stay in this browser tab while you work."
  }
];
export default function ProductFactSheet() {
  return <Workspace spec={spec} />;
}
