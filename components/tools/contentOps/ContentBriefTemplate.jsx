import Workspace from "./Workspace";


const spec = {
  "slug": "content-brief-template",
  "title": "Content Brief Template",
  "output": "Writer-ready brief",
  "steps": [
    {
      "title": "Assignment",
      "prompt": "What decision should this piece help with?",
      "fields": [
        {
          "id": "project",
          "label": "Project or company",
          "hint": "e.g. RelayLedger"
        },
        {
          "id": "title",
          "label": "Working title"
        },
        {
          "id": "format",
          "label": "Format",
          "options": [
            "Comparison page",
            "Guide",
            "Case study",
            "Landing page"
          ]
        },
        {
          "id": "reader",
          "label": "Target reader"
        },
        {
          "id": "intent",
          "label": "Search intent and primary query"
        },
        {
          "id": "angle",
          "label": "Angle and takeaway",
          "long": true
        }
      ]
    },
    {
      "title": "Coverage",
      "prompt": "What must the writer answer?",
      "fields": [
        {
          "id": "questions",
          "label": "Required questions, one per line",
          "long": true
        },
        {
          "id": "gaps",
          "label": "Competitor pages and gaps to address",
          "long": true
        },
        {
          "id": "product",
          "label": "Where and how to mention the product",
          "long": true
        },
        {
          "id": "links",
          "label": "Internal links and why each belongs",
          "long": true
        }
      ]
    },
    {
      "title": "Handoff",
      "prompt": "What will make the draft acceptable?",
      "fields": [
        {
          "id": "expert",
          "label": "SME to interview"
        },
        {
          "id": "sources",
          "label": "Approved sources and proof",
          "long": true
        },
        {
          "id": "cta",
          "label": "Primary CTA"
        },
        {
          "id": "due",
          "label": "Draft deadline and reviewer"
        }
      ]
    }
  ],
  "sample": {
    "project": "RelayLedger",
    "title": "Usage billing software vs spreadsheets",
    "format": "Comparison page",
    "reader": "SaaS finance director",
    "intent": "Commercial comparison for usage-based billing software",
    "angle": "Show how adjustments move from product events to approved invoices.",
    "questions": "Who approves adjustments?\nWhich records can finance audit?",
    "gaps": "Shortlisted vendor pages omit approval workflows.",
    "product": "Show the approval screen only after describing the workflow.",
    "links": "/billing — product overview\n/pricing — plan limits",
    "expert": "Finance operations lead",
    "sources": "Approved invoice example and product walkthrough",
    "cta": "Book a billing demo",
    "due": "20 January, reviewed by Product Marketing"
  }
,
require: v => v.title.trim() ? "" : "Enter the working title to export."
};
export const faqs = [
  {
    "question": "How is this different from an agency brief?",
    "answer": "Use this template to commission a single deliverable. The agency brief covers the wider engagement, responsibilities and commercial terms."
  },
  {
    "question": "How do I share the result?",
    "answer": "Open Review & export to copy the output or download a PDF. Your entries stay in this browser tab while you work."
  }
];
export default function ContentBriefTemplate() {
  return <Workspace spec={spec} />;
}
