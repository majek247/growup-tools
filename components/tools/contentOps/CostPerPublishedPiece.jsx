import Workspace from "./Workspace";
import { costReport } from "./calculations.mjs";

const spec = {
  "slug": "cost-per-published-piece-calculator",
  "title": "Cost-per-Published-Piece Calculator",
  "output": "Production cost comparison",
  "steps": [
    {
      "title": "Assumptions",
      "prompt": "What does a reviewer hour cost?",
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
          "id": "rate",
          "label": "Fully loaded internal review rate per hour",
          "number": true
        }
      ]
    },
    {
      "title": "Production routes",
      "prompt": "Use the same month and comparable formats",
      "fields": [
        {
          "id": "models",
          "label": "For in-house production, enter allocated loaded payroll. For outside production, enter invoice fees. Exclude reviewer cost from both.",
          "item": "Option",
          "columns": [
            {
              "id": "name",
              "label": "Route",
              "readOnly": true,
              "options": [
                "In-house",
                "Freelancer",
                "Agency"
              ]
            },
            {
              "id": "base",
              "label": "Monthly production spend",
              "number": true
            },
            {
              "id": "hours",
              "label": "Total internal review hours",
              "number": true
            },
            {
              "id": "extra",
              "label": "Other monthly costs",
              "number": true
            },
            {
              "id": "published",
              "label": "Pieces actually published",
              "number": true
            }
          ],
          "initial": [
            {
              "name": "In-house",
              "base": "",
              "hours": "",
              "extra": "0",
              "published": ""
            },
            {
              "name": "Freelancer",
              "base": "",
              "hours": "",
              "extra": "0",
              "published": ""
            },
            {
              "name": "Agency",
              "base": "",
              "hours": "",
              "extra": "0",
              "published": ""
            }
          ],
          "fixed": true
        }
      ]
    }
  ],
  "sample": {
    "currency": "GBP",
    "rate": "50",
    "models": [
      {
        "name": "In-house",
        "base": "3600",
        "hours": "8",
        "extra": "100",
        "published": "6"
      },
      {
        "name": "Freelancer",
        "base": "2600",
        "hours": "18",
        "extra": "120",
        "published": "5"
      },
      {
        "name": "Agency",
        "base": "3150",
        "hours": "6",
        "extra": "0",
        "published": "6"
      }
    ]
  }
,
compute: costReport
};
export const faqs = [
  {
    "question": "How is cost per piece calculated?",
    "answer": "Add production spend, review hours multiplied by hourly cost, and other costs. Divide by the number actually published in the same period."
  },
  {
    "question": "How do I share the result?",
    "answer": "Open Review & export to copy the output or download a PDF. Your entries stay in this browser tab while you work."
  }
];
export default function CostPerPublishedPiece() {
  return <Workspace spec={spec} />;
}
