import Workspace from "./Workspace";

const completed="Verified";
const excluded="Not applicable";
const spec = {
  "slug": "writer-self-qa-checklist",
  "title": "Writer Self-QA Checklist",
  "output": "Writer handoff",
  "steps": [
    {
      "title": "Assignment",
      "prompt": "Who owns the handoff?",
      "fields": [
        {
          "id": "project",
          "label": "Project or company",
          "hint": "e.g. RelayLedger"
        },
        {
          "id": "lead",
          "label": "Handoff owner"
        },
        {
          "id": "date",
          "label": "Required by"
        }
      ]
    },
    {
      "title": "Checks",
      "prompt": "Record the status and evidence for each item",
      "fields": [
        {
          "id": "checks",
          "label": "Record a source, test result or exception for each check.",
          "item": "Check",
          "columns": [
            {
              "id": "name",
              "label": "Item"
            },
            {
              "id": "status",
              "label": "Status",
              "options": [
                "To check",
                "Verified",
                "Needs changes",
                "Not applicable"
              ]
            },
            {
              "id": "owner",
              "label": "Responsible person"
            },
            {
              "id": "evidence",
              "label": "Evidence or next action",
              "long": true
            }
          ],
          "initial": [
            {
              "name": "Material claims have named sources",
              "status": "To check",
              "owner": "",
              "evidence": ""
            },
            {
              "name": "Statistics match original source, date and denominator",
              "status": "To check",
              "owner": "",
              "evidence": ""
            },
            {
              "name": "Features, pricing and limits match product fact sheet",
              "status": "To check",
              "owner": "",
              "evidence": ""
            },
            {
              "name": "Internal and external links open at intended destination",
              "status": "To check",
              "owner": "",
              "evidence": ""
            },
            {
              "name": "Buyer questions from the brief are answered",
              "status": "To check",
              "owner": "",
              "evidence": ""
            },
            {
              "name": "Quotes and screenshots have approval",
              "status": "To check",
              "owner": "",
              "evidence": ""
            },
            {
              "name": "CTA, metadata and handoff assets are complete",
              "status": "To check",
              "owner": "",
              "evidence": ""
            }
          ],
          "fixed": false
        }
      ]
    }
  ],
  "sample": {
    "project": "RelayLedger comparison page",
    "lead": "Content lead",
    "date": "Before editor handoff",
    "checks": [
      {
        "name": "Material claims have named sources",
        "status": "Verified",
        "owner": "Marketing",
        "evidence": "Pricing checked against the approved plan sheet."
      },
      {
        "name": "Statistics match original source, date and denominator",
        "status": "Needs changes",
        "owner": "Product lead",
        "evidence": ""
      },
      {
        "name": "Features, pricing and limits match product fact sheet",
        "status": "To check",
        "owner": "Marketing",
        "evidence": ""
      },
      {
        "name": "Internal and external links open at intended destination",
        "status": "To check",
        "owner": "Marketing",
        "evidence": ""
      },
      {
        "name": "Buyer questions from the brief are answered",
        "status": "To check",
        "owner": "Marketing",
        "evidence": ""
      },
      {
        "name": "Quotes and screenshots have approval",
        "status": "To check",
        "owner": "Marketing",
        "evidence": ""
      },
      {
        "name": "CTA, metadata and handoff assets are complete",
        "status": "To check",
        "owner": "Marketing",
        "evidence": ""
      }
    ]
  }
,
compute(v) {
    const rows=v.checks, applicable=rows.filter(r=>r.status!==excluded);
    const done=applicable.filter(r=>r.status===completed);
    const entry=r=>[r.name,r.status,r.owner,r.evidence].filter(Boolean).join(' · ');
    const list=rs=>rs.map(entry).join('\n') || 'None';
    return {stat:[done.length+' / '+applicable.length,'applicable checks confirmed'],problem: !v.project.trim()?'Enter a project name to export.':rows.some(r=>!r.name.trim())?'Name each check or remove the empty row.':'',sections:[
      ['Open actions',list(applicable.filter(r=>r.status!==completed))],['Confirmed',list(done)],['Excluded',list(rows.filter(r=>r.status===excluded))],['Handoff',[v.project,v.lead,v.date].filter(Boolean).join(' · ') || 'To confirm']]};
  }
};
export const faqs = [
  {
    "question": "Does the tool verify items automatically?",
    "answer": "The owner records each check manually. The handoff separates completed work, open actions and exclusions and retains the evidence you enter."
  },
  {
    "question": "How do I share the result?",
    "answer": "Open Review & export to copy the output or download a PDF. Your entries stay in this browser tab while you work."
  }
];
export default function WriterSelfQa() {
  return <Workspace spec={spec} />;
}
