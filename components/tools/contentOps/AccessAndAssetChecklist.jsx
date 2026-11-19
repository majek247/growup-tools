import Workspace from "./Workspace";

const completed="Confirmed";
const excluded="Not needed";
const spec = {
  "slug": "access-and-asset-checklist",
  "title": "Access and Asset Checklist",
  "output": "Access handoff",
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
          "label": "Use secure sharing for access. Record a reference or owner here.",
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
                "Not requested",
                "Requested",
                "Confirmed",
                "Blocked",
                "Not needed"
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
              "name": "CMS publishing access",
              "status": "Not requested",
              "owner": "",
              "evidence": ""
            },
            {
              "name": "Search Console property",
              "status": "Not requested",
              "owner": "",
              "evidence": ""
            },
            {
              "name": "GA4 reporting access",
              "status": "Not requested",
              "owner": "",
              "evidence": ""
            },
            {
              "name": "CRM attribution reports",
              "status": "Not requested",
              "owner": "",
              "evidence": ""
            },
            {
              "name": "Product demo account",
              "status": "Not requested",
              "owner": "",
              "evidence": ""
            },
            {
              "name": "Brand assets and image permissions",
              "status": "Not requested",
              "owner": "",
              "evidence": ""
            },
            {
              "name": "Product claim approver",
              "status": "Not requested",
              "owner": "",
              "evidence": ""
            },
            {
              "name": "Final publishing approver",
              "status": "Not requested",
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
    "date": "Before first draft",
    "checks": [
      {
        "name": "CMS publishing access",
        "status": "Requested",
        "owner": "Marketing",
        "evidence": "Workspace invite sent to agency lead."
      },
      {
        "name": "Search Console property",
        "status": "Confirmed",
        "owner": "Product lead",
        "evidence": ""
      },
      {
        "name": "GA4 reporting access",
        "status": "Not requested",
        "owner": "Marketing",
        "evidence": ""
      },
      {
        "name": "CRM attribution reports",
        "status": "Not requested",
        "owner": "Marketing",
        "evidence": ""
      },
      {
        "name": "Product demo account",
        "status": "Not requested",
        "owner": "Marketing",
        "evidence": ""
      },
      {
        "name": "Brand assets and image permissions",
        "status": "Not requested",
        "owner": "Marketing",
        "evidence": ""
      },
      {
        "name": "Product claim approver",
        "status": "Not requested",
        "owner": "Marketing",
        "evidence": ""
      },
      {
        "name": "Final publishing approver",
        "status": "Not requested",
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
export default function AccessAndAssetChecklist() {
  return <Workspace spec={spec} />;
}
