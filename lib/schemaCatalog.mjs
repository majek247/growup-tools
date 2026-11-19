const records = [
  [
    "Organization",
    "Create Organization JSON-LD with your company website, logo, public contact details and verified social profiles. Reuse your organization ID across pages.",
  ],
  [
    "Product",
    "Generate Product JSON-LD from your published price, currency, stock status and review totals. Check offer and rating details before exporting.",
  ],
  [
    "Article",
    "Build Article, BlogPosting or NewsArticle markup with author, publisher, canonical URL and images. Check publication and update dates before export.",
  ],
  [
    "Video",
    "Generate VideoObject JSON-LD for a demo or tutorial. Convert its running time, check its upload timestamp and add the thumbnail and playback URLs.",
  ],
  [
    "Review",
    "Build review JSON-LD for software, products or businesses. Add individual reviews, calculate their average and check for self-serving review issues.",
  ],
];
export const schemaTools = records.map(([name, description]) => ({
  slug: name.toLowerCase() + "-schema-generator",
  name: name + " schema generator",
  title: "Free " + name + " Schema Generator (JSON-LD) | GrowUp",
  description,
  type: "Generator",
  topic: "Technical SEO",
  fields: [],
}));
