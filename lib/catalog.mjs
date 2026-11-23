import { contentOpsTools } from "./contentOpsCatalog.mjs";
import { hiringTools, retiredPlannerSlugs } from "./hiringCatalog.mjs";
import { schemaTools } from "./schemaCatalog.mjs";
// Field examples power both the first-run preview and the reset action.
const field = (key, label, value, type = "text") => ({
  key,
  label,
  value,
  type,
});
const num = (key, label, value) => field(key, label, String(value), "number");
const area = (key, label, value) => field(key, label, value, "textarea");
const rows = [
  [
    "organic-revenue-calculator",
    "Organic revenue calculator",
    "Revenue planning",
    "Calculator",
    "Work backwards from new ARR to the deals, qualified opportunities and organic visits you need.",
    [
      num("arr", "New ARR target (£)", 240000),
      num("acv", "Average annual contract value (£)", 24000),
      num("win", "Opportunity win rate (%)", 25),
      num("convert", "Visit to qualified opportunity (%)", 0.5),
    ],
    "Which conversion rates should I enter?",
    "Use closed-won deals divided by qualified opportunities for win rate. For visit conversion, divide organic-sourced opportunities by organic visits over a comparable period. The model rounds up at each funnel stage.",
  ],
  [
    "content-refresh-planner",
    "Content refresh planner",
    "Content strategy",
    "Planner",
    "Rank pages by recoverable clicks using impressions, current clicks and a realistic target CTR.",
    [
      area(
        "csv",
        "Page data · CSV",
        "page,impressions,clicks\n/integrations,18000,270\n/pricing-guide,12000,300\n/buyer-guide,9000,90",
      ),
      num("ctr", "Target click-through rate (%)", 3),
    ],
    "How are refresh priorities calculated?",
    "For each page, multiply impressions by target CTR and subtract existing clicks. Positive gaps come first. Use a target from pages with comparable rankings and search intent.",
  ],
  [
    "llms-txt-generator",
    "llms.txt generator",
    "AI search",
    "Generator",
    "Turn your product, pricing and documentation links into a downloadable llms.txt file.",
    [
      field("brand", "Company name", "Acme Analytics"),
      field(
        "summary",
        "What does the product do?",
        "Product analytics for B2B SaaS teams.",
      ),
      area(
        "csv",
        "Page directory · CSV",
        "section,title,url,description\nProduct,Pricing,https://example.com/pricing,Plans and usage limits\nDocumentation,Quickstart,https://example.com/docs,Set up your first report",
      ),
    ],
    "Where should I publish the file?",
    "Download llms.txt and place it at /llms.txt on your domain. It provides a curated Markdown guide to your content. Search inclusion and AI citations are at the discretion of each platform.",
  ],
  [
    "content-roi-calculator",
    "Content ROI calculator",
    "Revenue planning",
    "Calculator",
    "Estimate the first-year gross profit, return and break-even customer count for a content programme.",
    [
      num("spend", "Programme cost (£)", 60000),
      num("wins", "New customers attributed to content", 8),
      num("acv", "First-year revenue per customer (£)", 18000),
      num("margin", "Gross margin (%)", 80),
    ],
    "What period does this model cover?",
    "It compares one programme budget to the first 12 months of revenue from each acquired customer. Enter the full acquisition cost and your own attribution estimate. It excludes renewals.",
  ],
  [
    "editorial-capacity-planner",
    "Editorial capacity planner",
    "Content strategy",
    "Planner",
    "See how many briefs, drafts and edits fit into the hours your team actually has.",
    [
      num("hours", "Available team hours per week", 30),
      num("weeks", "Weeks in production cycle", 4),
      num("brief", "Briefing hours per article", 2),
      num("draft", "Writing hours per article", 6),
      num("edit", "Review hours per article", 2),
    ],
    "Does this account for meetings?",
    "Enter the hours left after meetings and ongoing work. The calculation pools available team hours, so check specialist availability before assigning the resulting articles.",
  ],
  [
    "buyer-prompt-generator",
    "Buyer prompt generator",
    "AI search",
    "Generator",
    "Build a repeatable set of evaluation prompts using your category, buyer and integration requirements.",
    [
      field("category", "Software category", "employee benefits software"),
      field("buyer", "Target buyer", "UK HR teams"),
      field("integration", "Required integration", "Workday"),
      field("competitor", "Alternative under consideration", "Ben"),
    ],
    "Can I use these for a monthly benchmark?",
    "Keep the wording, platform and test conditions consistent. Run each prompt multiple times and record the platform, date and brand recommendation in your exported test sheet. These prompts use editable input-based patterns.",
  ],




  [
    "faq-schema-generator",
    "FAQ Schema Generator",
    "Technical SEO",
    "Generator",
    "Add your questions and answers, generate valid FAQPage JSON-LD instantly, and copy the markup straight into your website.",
    [
      area(
        "csv",
        "Visible FAQs · CSV",
        "question,answer\nHow long is the trial?,The trial lasts 14 days.\nCan I export reports?,Every paid plan includes CSV exports.",
      ),
    ],
    "Which FAQs should I include?",
    "Use the questions and full answers visitors can read on the page. The download contains JSON-LD data to place inside a script element with type application/ld+json.",
  ],
  [
    "campaign-url-builder",
    "Campaign URL builder",
    "Revenue planning",
    "Generator",
    "Build consistent tagged links for content distribution and keep campaign names aligned across channels.",
    [
      field("url", "Destination URL", "https://example.com/report"),
      field("source", "Source", "linkedin"),
      field("medium", "Medium", "organic_social"),
      field("campaign", "Campaign", "annual-benchmark"),
      field("content", "Creative or placement (optional)", "founder-post"),
    ],
    "What happens to existing URL parameters?",
    "The builder keeps unrelated query parameters and the fragment. It replaces source, medium and campaign tags, and removes any existing content tag when the optional field is empty.",
  ],
  [
    "ctr-opportunity-calculator",
    "CTR opportunity calculator",
    "Content strategy",
    "Calculator",
    "Estimate the additional clicks and demos a page could earn from a better search listing.",
    [
      num("impressions", "Monthly impressions", 25000),
      num("clicks", "Current monthly clicks", 375),
      num("ctr", "Target CTR (%)", 3),
      num("demo", "Click to demo conversion (%)", 2),
    ],
    "Which assumptions affect this estimate?",
    "Impressions and click-to-demo conversion stay fixed. Enter a target CTR from a comparable query or page. Additional demos are expected values and can be fractional.",
  ],
];
export const workbenchTools = rows.map(
  ([slug, name, topic, type, description, fields, question, answer]) => ({
    slug,
    name,
    topic,
    type,
    description,
    fields,
    question,
    answer,
    title: name + " | Free GrowUp Tools",
  }),
);





const previousTools = [...workbenchTools, ...schemaTools].filter(tool => !retiredPlannerSlugs.has(tool.slug)).concat(hiringTools);
export const tools = [...previousTools, ...contentOpsTools];
export const topics = [...new Set(tools.map(tool => tool.topic))];
export const types = [...new Set(tools.map(tool => tool.type))];
