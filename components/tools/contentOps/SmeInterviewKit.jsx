import Workspace from "./Workspace";

const roleQuestions = {
 'Product':['Walk me through the exact workflow on screen.','Which plan, integration or product limit changes the answer?'],
 'Sales':['What did a buyer actually ask on the last call?','Which alternative did they consider, and what changed their mind?'],
 'Customer success':['Which step do customers struggle with after purchase?','Describe one observed outcome and how the customer measured it.']
};
const formatQuestions = {
 'Comparison page':['Who should choose each option?','Which two differences matter in a real purchasing decision?'],
 'Guide':['What must the reader have before starting?','What is the common failure point, and how would you recover?'],
 'Case study':['What was happening before the customer changed approach?','What changed afterwards, over which period, and what else could explain the change?']
};
const spec = {
  "slug": "sme-interview-kit",
  "title": "SME Interview Kit",
  "output": "Interview script and notes prompt",
  "steps": [
    {
      "title": "Interview",
      "prompt": "Who are you interviewing and for what piece?",
      "fields": [
        {
          "id": "project",
          "label": "Project or company",
          "hint": "e.g. RelayLedger"
        },
        {
          "id": "format",
          "label": "Content type",
          "options": [
            "Comparison page",
            "Guide",
            "Case study"
          ]
        },
        {
          "id": "role",
          "label": "Interviewee team",
          "options": [
            "Product",
            "Sales",
            "Customer success"
          ]
        },
        {
          "id": "topic",
          "label": "Piece or question to investigate"
        },
        {
          "id": "reader",
          "label": "Target reader"
        }
      ]
    },
    {
      "title": "Follow-up",
      "prompt": "What should the interviewer bring?",
      "fields": [
        {
          "id": "unknown",
          "label": "Specific gaps to resolve",
          "long": true
        },
        {
          "id": "evidence",
          "label": "Evidence or example to request"
        },
        {
          "id": "approval",
          "label": "Who approves quotes and claims?"
        }
      ]
    }
  ],
  "sample": {
    "project": "RelayLedger",
    "format": "Comparison page",
    "role": "Sales",
    "topic": "Spreadsheet reconciliation vs billing software",
    "reader": "Finance director",
    "unknown": "How do prospects evaluate adjustment approvals?",
    "evidence": "Anonymised buyer objection and pricing comparison",
    "approval": "Product Marketing"
  }
,
compute(v) {
 const r=roleQuestions[v.role],f=formatQuestions[v.format];
 const script=['0–2 min · Context','Who is facing '+(v.topic||'this problem')+', and what triggered it?',
 '2–6 min · '+v.role,r.join(' '),'6–10 min · '+v.format,f.join(' '),
 '10–13 min · Evidence','Which example supports this? '+(v.evidence||'Ask for a shareable source.')+' '+(v.unknown||''),
 '13–15 min · Approval','Which details can we publish? Confirm wording with '+(v.approval||'the named reviewer')+'.'].join('\n');
 return {problem:!v.topic.trim()?'Add a topic before exporting.':'',sections:[['15-minute interview',script],['Recording-to-notes prompt','Using only the transcript below, prepare notes for a '+v.format+' on '+(v.topic||'[topic]')+' for '+(v.reader||'[reader]')+'. Identify each claim, exact quote, speaker and timestamp if supplied. Separate observed facts from opinion. List missing evidence and permissions. Do not invent details. Transcript: [paste approved transcript here].'],['Interview details',[v.project,v.role,v.approval].filter(Boolean).join(' · ')]]};
 }
};
export const faqs = [
  {
    "question": "Does the kit transcribe a recording?",
    "answer": "It produces a script and a copyable prompt. Use a transcript from your approved recording workflow, then paste it into the prompt in your permitted writing tool."
  },
  {
    "question": "How do I share the result?",
    "answer": "Open Review & export to copy the output or download a PDF. Your entries stay in this browser tab while you work."
  }
];
export default function SmeInterviewKit() {
  return <Workspace spec={spec} />;
}
