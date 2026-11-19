import Workspace from "./Workspace";
import { outputReport } from "./calculations.mjs";

const spec = {
  "slug": "monthly-output-planner",
  "title": "Monthly Output Planner",
  "output": "Monthly production plan",
  "steps": [
    {
      "title": "Monthly limits",
      "prompt": "How much can you spend and review?",
      "fields": [
        {
          "id": "currency",
          "label": "Currency",
          "options": [
            "GBP",
            "USD",
            "EUR",
            "NGN"
          ]
        },
        {
          "id": "budget",
          "label": "Monthly budget",
          "number": true
        },
        {
          "id": "fixed",
          "label": "Fixed monthly costs",
          "number": true
        },
        {
          "id": "hours",
          "label": "Available reviewer hours this month",
          "number": true
        }
      ]
    },
    {
      "title": "Format mix",
      "prompt": "What goes into one repeatable batch?",
      "fields": [
        {
          "id": "mix",
          "label": "Set quantity to zero to skip a format. The plan repeats this mix in complete batches.",
          "item": "Format",
          "columns": [
            {
              "id": "name",
              "label": "Format name"
            },
            {
              "id": "qty",
              "label": "Pieces per batch",
              "number": true
            },
            {
              "id": "price",
              "label": "Production fee per piece",
              "number": true
            },
            {
              "id": "time",
              "label": "Review hours per piece",
              "number": true
            }
          ],
          "initial": [
            {
              "name": "Comparison page",
              "qty": "1",
              "price": "",
              "time": "1"
            },
            {
              "name": "Guide",
              "qty": "1",
              "price": "",
              "time": "1"
            },
            {
              "name": "Case study",
              "qty": "0",
              "price": "",
              "time": "1"
            }
          ],
          "fixed": false
        }
      ]
    }
  ],
  "sample": {
    "currency": "GBP",
    "budget": "5000",
    "fixed": "500",
    "hours": "15",
    "mix": [
      {
        "name": "Comparison page",
        "qty": "2",
        "price": "525",
        "time": "1.5"
      },
      {
        "name": "Guide",
        "qty": "1",
        "price": "600",
        "time": "2"
      },
      {
        "name": "Case study",
        "qty": "1",
        "price": "850",
        "time": "2"
      }
    ]
  }
,
compute: outputReport
};
export const faqs = [
  {
    "question": "Why might money be left over?",
    "answer": "The planner preserves the requested mix in whole batches and caps output at the available review hours. Change quantities or unit costs to test a different order."
  },
  {
    "question": "How do I share the result?",
    "answer": "Open Review & export to copy the output or download a PDF. Your entries stay in this browser tab while you work."
  }
];
export default function MonthlyOutputPlanner() {
  return <Workspace spec={spec} />;
}
