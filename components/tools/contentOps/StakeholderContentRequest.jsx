import Workspace from "./Workspace";


const spec = {
  "slug": "stakeholder-content-request-form",
  "title": "Stakeholder Content Request Form",
  "output": "Content request for triage",
  "steps": [
    {
      "title": "Request",
      "prompt": "Who needs a piece and why?",
      "fields": [
        {
          "id": "project",
          "label": "Project or company",
          "hint": "e.g. RelayLedger"
        },
        {
          "id": "requester",
          "label": "Requester and team"
        },
        {
          "id": "ask",
          "label": "Requested asset"
        },
        {
          "id": "reason",
          "label": "Business reason and intended audience",
          "long": true
        },
        {
          "id": "when",
          "label": "Date needed and reason for deadline"
        }
      ]
    },
    {
      "title": "Evidence",
      "prompt": "What supports the request?",
      "fields": [
        {
          "id": "evidence",
          "label": "Deal, launch, call or customer evidence",
          "long": true
        },
        {
          "id": "existing",
          "label": "Existing asset considered"
        },
        {
          "id": "owner",
          "label": "Who can supply product details?"
        }
      ]
    },
    {
      "title": "Triage",
      "prompt": "What should Marketing do next?",
      "fields": [
        {
          "id": "decision",
          "label": "Marketing decision",
          "options": [
            "Awaiting triage",
            "Accept",
            "Defer",
            "Decline"
          ]
        },
        {
          "id": "rationale",
          "label": "Reason and impact on the current plan",
          "long": true
        },
        {
          "id": "next",
          "label": "Decision owner and follow-up date"
        }
      ]
    }
  ],
  "sample": {
    "project": "RelayLedger",
    "requester": "Sales, enterprise team",
    "ask": "One-page integration guide",
    "reason": "Two shortlisted accounts need the import workflow before procurement.",
    "when": "Before 18 February, buyer review",
    "evidence": "CRM opportunities RL-84 and RL-91",
    "existing": "Current docs cover setup but omit migration.",
    "owner": "Solutions engineer",
    "decision": "Defer",
    "rationale": "Update the existing migration guide when screenshots are approved.",
    "next": "Product Marketing, 9 February"
  }
,
require: v => v.ask.trim() ? "" : "Name the requested asset to export."
};
export const faqs = [
  {
    "question": "Can requesters submit without knowing the decision?",
    "answer": "Yes. Leave the decision as Awaiting triage and share the output with Marketing. The receiving team can then record its decision."
  },
  {
    "question": "How do I share the result?",
    "answer": "Open Review & export to copy the output or download a PDF. Your entries stay in this browser tab while you work."
  }
];
export default function StakeholderContentRequest() {
  return <Workspace spec={spec} />;
}
