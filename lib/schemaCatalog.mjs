
const records = [
  [
    "Organization",
    "Generate Organization schema without writing code. Add your business details, social profiles and website URL, then copy or download the JSON-LD.",
  ],
  [
    "SoftwareApp",
    "Enter your SaaS info, select its category and supported platforms, and generate ready-to-use SoftwareApplication schema for your website.",
  ],
  [
    "Article",
    "Create schema markup for your blog posts, articles or news stories. Enter your article details and get ready-to-use JSON-LD for your website.",
  ],
  [
    "Video",
    "Generate VideoObject schema for your product demos, tutorials and other videos. Enter your video details, then copy or download the JSON-LD for free.",
  ],
  [
    "Review",
    "Create Review JSON-LD for your products or software. Add genuine customer reviews, preview the overall rating and copy the generated code.",
  ],
];

export const schemaTools = records.map(([name, description]) => ({
  slug: name.toLowerCase() + "-schema-generator",
  name: name + " Schema Generator",
  title: "Free " + name + " Schema Generator (JSON-LD) | GrowUp",
  description,
  type: "Generator",
  topic: "Technical SEO",
  fields: [],
}));
