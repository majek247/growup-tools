import Workspace from "./Workspace";


const spec = {
  "slug": "ai-assisted-writing-policy",
  "title": "AI-Assisted Writing Policy",
  "output": "Editorial AI policy",
  "steps": [
    {
      "title": "Coverage",
      "prompt": "Who and what does the policy cover?",
      "fields": [
        {
          "id": "project",
          "label": "Project or company",
          "hint": "e.g. RelayLedger"
        },
        {
          "id": "owner",
          "label": "Policy owner"
        },
        {
          "id": "effective",
          "label": "Effective date and review date"
        },
        {
          "id": "tools",
          "label": "Approved tools or environments"
        }
      ]
    },
    {
      "title": "Permitted use",
      "prompt": "Where may writers use AI?",
      "fields": [
        {
          "id": "mode",
          "label": "Drafting rule",
          "options": [
            "Planning and editing only",
            "Drafting allowed with human review",
            "No AI in production"
          ]
        },
        {
          "id": "allowed",
          "label": "Permitted tasks within the selected rule",
          "long": true
        },
        {
          "id": "forbidden",
          "label": "Prohibited tasks and inputs",
          "long": true
        }
      ]
    },
    {
      "title": "Verification",
      "prompt": "What must happen before publication?",
      "fields": [
        {
          "id": "verify",
          "label": "Source and fact-check requirements",
          "long": true
        },
        {
          "id": "disclose",
          "label": "Internal and external disclosure rules",
          "long": true
        },
        {
          "id": "approval",
          "label": "Final reviewer and exceptions process"
        }
      ]
    }
  ],
  "sample": {
    "project": "RelayLedger editorial team",
    "owner": "Head of Content",
    "effective": "Effective 1 February. Review quarterly.",
    "tools": "Company-approved writing workspace",
    "mode": "Planning and editing only",
    "allowed": "Brainstorm interview questions and tighten approved copy.",
    "forbidden": "Customer transcripts, private roadmap data and invented quotes.",
    "verify": "Open the original source for every statistic. Product checks all plan limits.",
    "disclose": "Record tool and purpose in the draft handoff. Editor confirms any reader-facing disclosure.",
    "approval": "Head of Content approves exceptions in writing."
  }
,
require:v=>!v.project.trim() || !v.owner.trim() || !v.verify.trim() || !v.disclose.trim()?'Add the team, policy owner, verification and disclosure rules before exporting.':v.mode==='No AI in production' && v.allowed.trim()?'Clear permitted tasks or select a rule that allows AI.':''
};
export const faqs = [
  {
    "question": "Who is responsible for final copy?",
    "answer": "Name the human reviewer and exceptions process. The export records your selected use rule together with the team’s verification and disclosure requirements."
  },
  {
    "question": "How do I share the result?",
    "answer": "Open Review & export to copy the output or download a PDF. Your entries stay in this browser tab while you work."
  }
];
export default function AiAssistedWritingPolicy() {
  return <Workspace spec={spec} />;
}
