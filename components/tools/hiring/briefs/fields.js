export const field = (id, label, hint, options = {}) => ({
  id,
  label,
  hint,
  ...options,
});
export const choice = (id, label, choices, hint = "") =>
  field(id, label, hint, { choices });
export const company = field(
  "company",
  "Company or product",
  "The name the agency should put on its proposal.",
  { required: true },
);
export const audience = field(
  "audience",
  "Who are you trying to reach?",
  "Include the buyer, market and buying situation.",
  { required: true },
);
export const notes = field(
  "notes",
  "Paste your planning notes",
  "Optional. Keep messy notes here and use them as the source for your decisions.",
  { long: true },
);
export const budget = field(
  "budget",
  "Budget or fee range",
  "Include currency and whether the amount is monthly or one-off.",
);
export const deadline = field(
  "deadline",
  "Delivery window",
  "A date, a launch milestone or a preferred start week.",
);
export const success = field(
  "success",
  "How will you judge success?",
  "Name the metric and the source your team trusts.",
);
export const owner = choice("owner", "Who publishes the approved work?", [
  "Agency",
  "Internal team",
  "Decide at kickoff",
]);
export const faqsFor = (specific) => [
  specific,
  {
    question: "Can I leave a decision open?",
    answer:
      "Yes. The review shows unanswered items, and the PDF marks them for confirmation. You can edit each section before exporting.",
  },
  {
    question: "Where does my draft go?",
    answer:
      "The builder saves your draft in this browser tab when session storage is available. Download the PDF before closing the tab.",
  },
];
