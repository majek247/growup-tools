export const retiredPlannerSlugs = new Set([
  "content-refresh-planner",
  "editorial-capacity-planner",
  "ctr-opportunity-calculator",
]);
export const hiringTools = [
   
  [
    "seo-agency-brief-builder",
    "SEO Agency Brief Template",
    "Builder",
    "Give SEO agencies the context they need to recommend a realistic scope of work, estimate costs and explain how they’ll measure results.",
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
