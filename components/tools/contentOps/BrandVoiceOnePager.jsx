import Workspace from "./Workspace";


const spec = {
  "slug": "brand-voice-one-pager",
  "title": "Brand Voice One-Pager",
  "output": "Brand voice reference",
  "steps": [
    {
      "title": "Voice rules",
      "prompt": "How should this brand sound?",
      "fields": [
        {
          "id": "project",
          "label": "Project or company",
          "hint": "e.g. RelayLedger"
        },
        {
          "id": "tone",
          "label": "Voice in three short instructions",
          "long": true
        },
        {
          "id": "banned",
          "label": "Banned phrases and replacements",
          "long": true
        },
        {
          "id": "claims",
          "label": "Claim and attribution rules",
          "long": true
        }
      ]
    },
    {
      "title": "Ten examples",
      "prompt": "Show the edit you want the writer to make",
      "fields": [
        {
          "id": "pairs",
          "label": "Ten before-and-after sentences",
          "item": "Example",
          "columns": [
            {
              "id": "before",
              "label": "Before"
            },
            {
              "id": "after",
              "label": "After"
            }
          ],
          "initial": [
            {
              "before": "",
              "after": ""
            },
            {
              "before": "",
              "after": ""
            },
            {
              "before": "",
              "after": ""
            },
            {
              "before": "",
              "after": ""
            },
            {
              "before": "",
              "after": ""
            },
            {
              "before": "",
              "after": ""
            },
            {
              "before": "",
              "after": ""
            },
            {
              "before": "",
              "after": ""
            },
            {
              "before": "",
              "after": ""
            },
            {
              "before": "",
              "after": ""
            }
          ],
          "fixed": true
        }
      ]
    }
  ],
  "sample": {
    "project": "RelayLedger",
    "tone": "Use plain English. Lead with the task. Name the buyer.",
    "banned": "Avoid seamless, revolutionary and leverage.",
    "claims": "Use verified plan limits. Attribute customer results to the named customer.",
    "pairs": [
      {
        "before": "Unlock unprecedented efficiency.",
        "after": "Cut the invoice review from five steps to two."
      },
      {
        "before": "Leverage our platform.",
        "after": "Use the billing dashboard."
      },
      {
        "before": "Seamlessly integrates.",
        "after": "Connect it to HubSpot in Settings."
      },
      {
        "before": "Transform your workflow.",
        "after": "Approve invoices in one queue."
      },
      {
        "before": "Our powerful solution",
        "after": "The reconciliation report"
      },
      {
        "before": "Best-in-class support",
        "after": "Email support is included on Pro."
      },
      {
        "before": "Drive meaningful results.",
        "after": "Track demos from each page."
      },
      {
        "before": "It is important to note that",
        "after": "Delete the introductory phrase."
      },
      {
        "before": "All customers save hours.",
        "after": "In the pilot, the finance team saved two hours."
      },
      {
        "before": "Book a call to learn more.",
        "after": "Book a 20-minute billing walkthrough."
      }
    ]
  }
,
compute(v) {
 const pairs=v.pairs.filter(r=>r.before.trim() || r.after.trim());
 const complete=pairs.filter(r=>r.before.trim() && r.after.trim()).length;
 const rules=[v.tone, v.banned && 'Avoid: '+v.banned, v.claims && 'Claims: '+v.claims].filter(Boolean);
 return {stat:[complete+' / 10','sentence examples complete'],sections:[
   ['House style',rules.join('\n') || 'Add your voice rules.'],
   ['Sentence edits',pairs.map((r,i)=>(i+1)+'. '+(r.before || '[original]')+'\n     Write: '+(r.after || '[replacement]')).join('\n') || 'Add examples from your own copy.']
 ],problem: !v.project.trim()?'Enter the brand name.':complete<10?'Complete all ten sentence edits.':!v.banned.trim() || !v.claims.trim()?'Add banned phrases and claim rules.':''};
 },

};
export const faqs = [
  {
    "question": "How should I use the examples?",
    "answer": "Replace the sample edits with sentences taken from your own copy. Use specific replacements that a writer could apply on their next draft."
  },
  {
    "question": "How do I share the result?",
    "answer": "Open Review & export to copy the output or download a PDF. Your entries stay in this browser tab while you work."
  }
];
export default function BrandVoiceOnePager() {
  return <Workspace spec={spec} />;
}
