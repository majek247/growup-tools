export const retiredPlannerSlugs = new Set([
  "content-refresh-planner",
  "editorial-capacity-planner",
  "ctr-opportunity-calculator",
]);
export const hiringTools = [
   
  [
    "seo-agency-brief-builder",
    "SEO Agency Brief Builder",
    "Builder",
    "Define what you need from an SEO agency, who’s responsible for what, how success will be measured and what should happen in the first 90 days.",
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
