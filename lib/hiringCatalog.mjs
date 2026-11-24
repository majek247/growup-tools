export const retiredPlannerSlugs = new Set([
  "content-refresh-planner",
  "editorial-capacity-planner",
  "ctr-opportunity-calculator",
]);
export const hiringTools = [
   
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
