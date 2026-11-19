import Workspace from "./Workspace";


const spec = {
  "slug": "content-scope-of-work",
  "title": "Content Scope of Work",
  "output": "Writing scope of work",
  "steps": [
    {
      "title": "Commission",
      "prompt": "What exactly are you ordering?",
      "fields": [
        {
          "id": "project",
          "label": "Project or company",
          "hint": "e.g. RelayLedger"
        },
        {
          "id": "asset",
          "label": "Deliverable",
          "hint": "e.g. Two buyer guides"
        },
        {
          "id": "length",
          "label": "Length range per piece",
          "hint": "e.g. 1,400–1,800 words"
        },
        {
          "id": "fee",
          "label": "Agreed fee and payment terms"
        },
        {
          "id": "due",
          "label": "First draft and final delivery dates"
        }
      ]
    },
    {
      "title": "Included work",
      "prompt": "What is included in the fee?",
      "fields": [
        {
          "id": "sme",
          "label": "Expert interviews and time allowed"
        },
        {
          "id": "assets",
          "label": "Included assets",
          "hint": "Specify screenshots, graphics, metadata and CMS upload.",
          "long": true
        },
        {
          "id": "client",
          "label": "What the client supplies",
          "long": true
        },
        {
          "id": "excluded",
          "label": "Out of scope",
          "long": true
        }
      ]
    },
    {
      "title": "Approval",
      "prompt": "Who decides when the piece is done?",
      "fields": [
        {
          "id": "rounds",
          "label": "Included revision rounds"
        },
        {
          "id": "owner",
          "label": "Final decision maker"
        },
        {
          "id": "window",
          "label": "Feedback turnaround"
        },
        {
          "id": "change",
          "label": "How additional work is approved",
          "long": true
        }
      ]
    }
  ],
  "sample": {
    "project": "RelayLedger",
    "asset": "One comparison page",
    "length": "1,200–1,600 words",
    "fee": "£525 on delivery",
    "due": "Draft 12 January, final 19 January",
    "sme": "One 25-minute Product interview",
    "assets": "Draft, metadata and two annotated screenshots",
    "client": "Product access and approved pricing sheet",
    "excluded": "Custom illustration and CMS publishing",
    "rounds": "Two consolidated rounds",
    "owner": "Head of Marketing",
    "window": "Three working days per round",
    "change": "Provide a separate estimate. Start after written approval."
  }
,
require: v => v.asset.trim() ? "" : "Describe the deliverable before exporting."
};
export const faqs = [
  {
    "question": "What counts as a revision?",
    "answer": "Use the approval section to agree how many consolidated rounds are included and how you will price a changed brief."
  },
  {
    "question": "How do I share the result?",
    "answer": "Open Review & export to copy the output or download a PDF. Your entries stay in this browser tab while you work."
  }
];
export default function ContentScopeOfWork() {
  return <Workspace spec={spec} />;
}
