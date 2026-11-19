export const retiredPlannerSlugs = new Set([
  "content-refresh-planner",
  "editorial-capacity-planner",
  "ctr-opportunity-calculator",
]);
export const hiringTools = [
  ["content-agency-brief-builder","Content agency brief builder","Builder","Commission a comparison page, case study, guide or landing page. Agree the audience, evidence and approval criteria, then download the writing brief as a PDF."],
  ["link-building-brief-builder","Link building agency brief builder","Builder","Brief an outreach agency on target pages, editorial standards, prospect approval and placement reporting. Download your campaign brief as a PDF."],
  [
    "agency-proposal-comparison",
    "Agency proposal comparison",
    "Comparison",
    "Compare SEO and content agency proposals side by side. Check fees, minimum terms, publishing responsibilities and missing scope before sending follow-up questions.",
  ],
  [
    "content-agency-paid-trial-kit",
    "Content agency paid trial kit",
    "Template",
    "Create a paid writing assignment for shortlisted content agencies. Compare submissions against the same editorial criteria and export evidence for your decision.",
  ],
  [
    "seo-agency-brief-builder",
    "SEO agency brief builder",
    "Builder",
    "Turn your marketing notes into an SEO agency brief. Set responsibilities, outline your first 90 days and request comparable fees and deliverables from each agency.",
  ],
].map(([slug, name, type, description]) => ({
  slug,
  name,
  type,
  description,
  topic: "Agency hiring",
  title: name + " | Free GrowUp Tools",
  fields: [],
}));
