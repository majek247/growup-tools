import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Calculator,
  Check,
  ChevronDown,
  FileText,
  Filter,
  Search,
  SlidersHorizontal,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import Layout from "./Layout";

// This component is intentionally self-contained. Your existing Layout renders
// the site header/footer and the category pages do NOT repeat those elements.
export const TOOL_CATEGORIES = [
  {
    slug: "revenue-planning",
    topic: "Revenue planning",
    label: "Revenue planning",
    eyebrow: "FORECAST, BUDGET & MEASURE",
  title: "Revenue planning tools",
directoryTitle: "Plan Your Organic Revenue.",
directoryDescription:
  "Calculate pipeline targets, forecast content returns, and assess the investment needed to reach your goals.",
intro:
  "Work backwards from revenue targets, pressure-test your content budget, and see what organic growth needs to deliver.",
    description:
      "Free revenue planning calculators for B2B SaaS marketers. Model organic pipeline, content ROI, and campaign performance with practical inputs.",
    detail:
      "Turn growth targets into numbers you can actually plan against.",
    featured: "organic-revenue-calculator",
  },
  {
    slug: "ai-search",
    topic: "AI search",
    label: "AI search",
    eyebrow: "AI SEARCH & DISCOVERABILITY",

title: "AI Search Tools",
  metaTitle: "Free AI Search Visibility & Optimisation Tools | GrowUp",
directoryTitle: "Free Tools to Make AI Search Easier.",
directoryDescription:
  "Explore free tools to simplify your everyday AI search tasks.",
intro:
  "Getting your website ready for AI search doesn’t have to be complicated. Our free tools help you handle the practical work more easily.",

    description:
      "Explore free AI search tools built for B2B SaaS marketers. Prepare your website for AI search and save time on everyday optimisation work.",
    detail:
      "Useful starting points for understanding how buyers discover software in AI search.",
    featured: "buyer-prompt-generator",
  },
  {
    slug: "technical-seo",
    topic: "Technical SEO",
    label: "Technical SEO",
    eyebrow: "MARKUP, SNIPPETS & SITE HEALTH",
 title: "Technical SEO Tools",
 metaTitle: "Free Technical SEO Tools & Generators | GrowUp",
directoryTitle: "Everything You Need for Technical SEO Tasks.",
directoryDescription:
  "Browse free tools designed to simplify technical SEO, reduce manual work and improve your website.",
intro:
  "From checking your website to fixing common SEO issues, our free tools make it easier to handle technical SEO without spending hours doing everything manually.",

    description:
      "Use our free technical SEO tools to check your website, find common issues and handle everyday SEO tasks faster. No complicated setup required.",
    detail: "Small technical tasks, made much less fiddly.",
    featured: "serp-snippet-preview",
  },
  {
    slug: "agency-hiring",
    topic: "Agency hiring",
    label: "Agency hiring",
    eyebrow: "BRIEFS, PROPOSALS & SHORTLISTS",

title: "Agency Hiring Tools",
directoryTitle: "Make Better Agency Decisions.",
directoryDescription:
  "Compare agency proposals, define project requirements, and assess potential partners before committing your budget.",
intro:
  "Write better agency briefs, compare proposals on the same terms, and run paid trials that actually help you choose.",


    description:
      "Free agency hiring tools for B2B SaaS teams. Build SEO and content briefs, compare agency proposals, and assess paid trials.",
    detail:
      "Make the shortlist decision with clearer scope and fewer surprises.",
    featured: "agency-proposal-comparison",
  },
  {
    slug: "content-operations",
    topic: "Content Operations",
    label: "Content operations",
    eyebrow: "BRIEFS, REVIEWS & EDITORIAL WORKFLOWS",
    title: "Content Production & Workflow Tools",
    directoryTitle: "Everything You Need for Content Production.",
directoryDescription: "Give your team practical tools to simplify everyday content work.",
    metaTitle: "Content Production & Workflow Tools for Marketing Teams",
    intro:
      "Manage content production, standardise agency deliverables, streamline approvals, and reduce the time your marketing team spends reviewing work.",
    description:
      "Free content production and workflow tools for marketing teams. Brief writers, control costs, manage agencies and speed up content reviews and approvals.",
    detail:
      "Give writers what they need before the first draft lands.",
    featured: "content-brief-template",
  },
];


// These questions are specific to each toolkit. Keep answers factual and
// avoid promising rankings, traffic, pipeline or publication results.
const CATEGORY_EXTRAS = {
  "content-operations": {
    ctaLabel: "CONTENT MARKETING SUPPORT",
    ctaTitle: "Need content production\noff your plate?",
    ctaCopy: "GrowUp helps B2B SaaS teams plan, write and improve content, with clear briefs, senior editorial oversight and a focus on qualified pipeline.",
    ctaButton: "Explore our content services",
 faqs: [
  {
    q: "Are these content production and workflow tools free to use?",
    a: "Yes. Every tool in this directory is free to use. Whether you’re managing content in-house or working with freelancers and agencies, you can use the tools without paying for a subscription or purchasing a template.",
  },
  {
    q: "Do I need to create an account to use these tools?",
    a: "No. You don’t need to create an account or sign up for anything. Just choose the tool you want to use, enter the relevant information, and get started.",
  },
  {
    q: "How do I choose the right content production tools for my team?",
    a: "Start with the task taking up the most time. Use the content delivery planner to define deliverables, the cost calculator to compare production options, or the content brief template to prepare writing assignments. Each tool handles a specific part of content production, so you don’t need to use everything.",
  },
  {
    q: "What information do I need before using these content production tools?",
    a: "It depends on the tool. You might need your content budget, planned deliverables, writer rates, product information, brand guidelines, or approval requirements. Each tool is designed around a specific task, so you can start with the information you already have and complete the relevant fields.",
  },
  {
    q: "Can I use these tools to manage an entire content production workflow?",
    a: "You can use several tools together to support your content workflow, from planning deliverables and preparing briefs to documenting product facts and reviewing writing standards. They help organise the work, but they don’t replace your project management system, publishing platform, or the people responsible for approvals.",
  },
  {
    q: "Can I download, edit, and share the outputs with my team?",
    a: "The tools are designed to create practical working resources for your marketing team. Available export and sharing options depend on the individual tool. Where supported, you can save or copy the output, make changes, and share it with internal writers, freelancers, or agencies.",
  },
  {
    q: "Do I need technical knowledge to use these content production tools?",
    a: "No coding or technical SEO knowledge is required. The tools are built for marketers, founders, content managers, and people coordinating writers or agencies. You’ll mainly be entering business information, selecting options, and reviewing the resulting templates, calculations, or documents.",
  },
],
  },
  "revenue-planning": {
    ctaLabel: "CONTENT-LED GROWTH",
    ctaTitle: "Turn your content budget into a plan.",
    ctaCopy: "Work with GrowUp to prioritise buyer-intent content and connect SEO investment to qualified opportunities, pipeline and revenue.",
    ctaButton: "Explore our content services",
    faqs: [
      { q: "What can I calculate with these revenue planning tools?", a: "Use the calculators to explore planning scenarios around organic visits, opportunities, conversion rates, content costs and potential returns. Results depend on the assumptions you enter." },
      { q: "Do these tools predict actual SEO revenue?", a: "No. Forecasts are planning scenarios, not guarantees. Validate inputs with your analytics and CRM data and revise them as real performance becomes available." },
      { q: "Who should use revenue planning calculators?", a: "Marketing leaders, founders and teams preparing SEO budgets, investment cases or performance targets can use them to make assumptions visible and easier to discuss." },
    ],
  },
"ai-search": {
  ctaLabel: "B2B SAAS AI SEARCH SUPPORT",
  ctaTitle: "Want More Buyers Finding Your SaaS Through AI Search?",
  ctaCopy:
    "We help B2B SaaS companies appear in more relevant AI results, reach buyers comparing software and generate more qualified leads.",
  ctaButton: "Explore our AI search services",

    
faqs: [
  {
    q: "What are AI search tools, and what can I use them for?",
    a: "AI search tools help you manage different parts of your AI search optimisation work, from checking how your brand appears in AI-generated answers to finding opportunities to improve your visibility. They can also help you save time on repetitive tasks and make your website easier for AI platforms to understand.",
  },
  {
    q: "Are GrowUp's AI search tools completely free to use?",
    a: "Yes. All the AI search tools in this directory are free to use. You don't need to pay for a subscription, create an account or hire GrowUp to access them. Just choose a tool, enter the required information and use the results.",
  },
  {
    q: "Do I need technical knowledge to use these AI search tools?",
    a: "No. Our tools are designed for marketers, founders and website owners, including people who don't know how to code. Each tool walks you through the information you need to provide. Some tasks, like publishing a generated file on your website, may require access to your website settings or help from a developer.",
  },
  {
    q: "Can these free tools replace a full AI search visibility audit?",
    a: "No. These tools help with individual tasks, but they don't analyse your overall AI search performance. A full audit looks at whether AI platforms mention your brand, which competitors they recommend, what sources they cite and where your website could improve. You'll need a broader review to understand those gaps.",
  },
],


    
  },
"technical-seo": {
  ctaLabel: "B2B SAAS SEO SUPPORT",
  ctaTitle: "Need More Hands-On Support With Your SEO?",
  ctaCopy: "Our team helps B2B SaaS companies improve technical SEO, develop stronger content and increase visibility across Google and AI search.",
  ctaButton: "Explore our SEO services",

faqs: [
  {
    q: "Do I need coding experience to use these technical SEO tools?",
    a: "No. Most of our tools are designed for marketers, founders and website owners who don't write code. Just enter the information requested, and the tool will generate the output for you. Some tasks, like adding code to your website, may require access to your CMS or help from a developer.",
  },
  {
    q: "Which technical SEO tasks can I handle without a developer?",
    a: "You can handle plenty of smaller tasks yourself, including generating schema markup, checking page titles and descriptions, and reviewing common website issues. More complicated changes, like fixing crawling problems, server errors or website performance issues, may need someone with technical experience.",
  },
  {
    q: "Are these technical SEO tools completely free to use?",
    a: "Yes. All the tools in this directory are free to use, with no subscription or payment required. You can choose a tool, enter your information and use the generated results. There's no need to hire GrowUp or purchase any of our services to access them.",
  },
  {
    q: "How do I know which technical SEO tool my website needs?",
    a: "Start with what you're trying to accomplish. If you're publishing a blog post, use the Article Schema Generator. If you're adding customer reviews, try the Review Schema Generator. Each tool has a short description explaining what it does, so you can choose the one that matches your task.",
  },
  {
    q: "Can I fix technical SEO issues myself, or should I hire an expert?",
    a: "It depends on the issue. Smaller tasks, like adding schema markup or updating page information, are often manageable without an expert. But if Google isn't indexing important pages, your website has recurring technical errors, or you're unsure what's causing a problem, getting professional help can save time and prevent costly mistakes.",
  },
],


  },
  "agency-hiring": {
    ctaLabel: "WORK WITH GROWUP",
    ctaTitle: "Want an agency that owns the content work?",
    ctaCopy: "See how GrowUp approaches B2B SaaS content strategy, production and measurement before you make your next agency decision.",
    ctaButton: "Explore our content services",
    faqs: [
      { q: "How can I compare SEO or content agency proposals fairly?", a: "Ask each agency to respond to the same brief. Compare scope, deliverables, team ownership, review time, reporting and commercial terms rather than headline price alone." },
      { q: "What should an agency trial include?", a: "Set a defined deliverable, a shared briefing process, named reviewers, a budget and clear acceptance criteria. Evaluate both the output and how the agency works with your team." },
      { q: "Can these tools choose an agency for me?", a: "No. They structure the information needed for a better decision. Check references, capabilities and fit directly with shortlisted agencies before committing." },
    ],
  },
};


const SERVICE_URL =
  "https://www.seo-growup.com/b2b-saas-content-marketing-agency";

const AI_SEARCH_SERVICE_URL =
  "https://www.seo-growup.com/llm-seo-agency-for-b2b-saas-companies";


const SEO_SERVICE_URL =
  "https://www.seo-growup.com/seo-consultancy-for-b2b-saas-companies";

const getTypeIcon = (type) => {
  const t = (type || "").toLowerCase();
  if (t.includes("calculat")) return Calculator;
  if (t.includes("generator")) return Sparkles;
  if (t.includes("check")) return Check;
  if (t.includes("planner")) return SlidersHorizontal;
  if (t.includes("template") || t.includes("brief")) return FileText;
  return Wrench;
};

export default function ToolCategoryPage({ category, tools = [] }) {
  const config = TOOL_CATEGORIES.find((c) => c.slug === category);
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All types");

  const categoryTools = useMemo(() => {
    if (!config) return [];
    return tools.filter(
      (t) =>
        (t.topic || "").toLowerCase() === config.topic.toLowerCase()
    );
  }, [tools, config]);

  const types = useMemo(
    () => [
      "All types",
      ...new Set(
        categoryTools.map((t) => t.type).filter(Boolean)
      ),
    ],
    [categoryTools]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categoryTools.filter(
      (t) =>
        (selectedType === "All types" || t.type === selectedType) &&
        (!q ||
          [t.name, t.description, t.type].some((s) =>
            (s || "").toLowerCase().includes(q)
          ))
    );
  }, [categoryTools, selectedType, query]);

  if (!config) return null;

const otherCategories = TOOL_CATEGORIES.filter(
    (c) => c.slug !== category
  );

  const extras = CATEGORY_EXTRAS[category];
  const hasFilters = query || selectedType !== "All types";

  const headingMain = config.title;

  return (
    <Layout
      title={config.metaTitle || `${config.title} | GrowUp`}
      description={config.description}
      path={`/tools/${category}/`}
    >
      <div className="gtc-root">
        <section className="gtc-hero">
          <div className="wrap gtc-wrap">

      <nav className="gtc-crumbs" aria-label="Breadcrumb">
  <Link href="/tools/">All Tools</Link>
  <span aria-hidden="true">/</span>
  <span>
    {config.label.replace(/\b\w/g, (char) => char.toUpperCase())}
  </span>
</nav>

            <div className="gtc-hero-grid">
              <div className="gtc-hero-main">

<h1>{headingMain}</h1>




<div className="gtc-hero-rule" aria-hidden="true" />

<div className="gtc-hero-bottom">
  <p className="gtc-hero-description">
    {config.intro}
  </p>

  <a
    className="gtc-hero-button"
    href="#category-tools"
  >
    Explore tools
    <ArrowRight size={17} />
  </a>
</div>



              </div>




            </div>
          </div>
        </section>

        <main
          className="wrap gtc-wrap gtc-main"
          id="category-tools"
        >
          <div className="gtc-section-heading">
            <div>


       <div className="gtc-eyebrow gtc-eyebrow-light">
  <span className="gtc-dot" /> TOOL DIRECTORY
</div>

<h2>
  {config.directoryTitle || `Explore ${config.label.toLowerCase()} tools.`}
</h2>

<p>{config.directoryDescription || config.detail}</p>



            </div>

            <div className="gtc-search" role="search">
              <Search size={18} aria-hidden="true" />
              <input
                aria-label={`Search ${config.label.toLowerCase()} tools`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools..."
              />
              {query && (
                <button
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="gtc-toolbar">
            <div className="gtc-count" aria-live="polite">
              {visible.length}{" "}
              {visible.length === 1 ? "tool" : "tools"}
              {hasFilters && ` found`}
            </div>
            <div className="gtc-filter">
              <Filter size={15} aria-hidden="true" />
              <select
                aria-label="Filter by tool type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {types.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <ChevronDown size={15} aria-hidden="true" />
            </div>
          </div>

          {visible.length ? (
            <div className="gtc-grid">
              {visible.map((tool, index) => {
                const Icon = getTypeIcon(tool.type);
                return (
                  <Link
                    className="gtc-card"
                    href={`/tools/${tool.slug}/`}
                    key={tool.slug}
                  >
                    <div className="gtc-card-top">
                      <span
                        className={`gtc-card-icon gtc-accent-${
                          index % 4
                        }`}
                      >
                        <Icon size={20} strokeWidth={1.9} />
                      </span>
                      <span className="gtc-pill">{tool.type}</span>
                    </div>
                    <h3>{tool.name}</h3>
                    <p>{tool.description}</p>
<div className="gtc-card-bottom">
  <span>
    {(() => {
      const type = (tool.type || "").toLowerCase();

      if (type.includes("template")) return "View template";
      if (type.includes("calculat")) return "Open calculator";
      if (type.includes("generat")) return "Open generator";
      if (type.includes("check")) return "Run checker";
      if (type.includes("planner")) return "Open planner";

      return "Explore tool";
    })()}
  </span>
  <ArrowRight size={18} aria-hidden="true" />
</div>


                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="gtc-empty">
              <Search size={24} />
              <h3>No matching tools</h3>
              <p>Try a shorter search or show all tool types.</p>
              <button
                onClick={() => {
                  setQuery("");
                  setSelectedType("All types");
                }}
              >
                Clear filters <ArrowRight size={16} />
              </button>
            </div>
          )}

          {extras && (
            <>
              <section className="gtc-service" aria-labelledby="gtc-service-title">
                <div className="gtc-service-copy">
                  <div className="gtc-service-kicker">
                    <span className="gtc-dot" aria-hidden="true" />
                    {extras.ctaLabel}
                  </div>
                  <h2 id="gtc-service-title">{extras.ctaTitle}</h2>
                  <p>{extras.ctaCopy}</p>
                </div>
<a
  className="gtc-service-link"
  href={category === "technical-seo" ? SEO_SERVICE_URL : SERVICE_URL}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={`${extras.ctaButton} (opens in a new tab)`}
>
                  <span>{extras.ctaButton}</span>
                  <span className="gtc-service-arrow" aria-hidden="true">
                    <ArrowUpRight size={19} strokeWidth={2} />
                  </span>
                </a>



              </section>

              <section className="gtc-faq" aria-labelledby="gtc-faq-heading">
                <div className="gtc-faq-intro">
                  <span className="gtc-faq-kicker">HOW IT WORKS</span>
                  <h2 id="gtc-faq-heading">Frequently asked questions<span>.</span></h2>
                  <p>Answers to the questions teams ask before using these tools.</p>
                </div>


<div className="gtc-faq-items">
  {extras.faqs.map((faq) => (
    <details
      className="gtc-faq-item"
      key={faq.q}
      name="growup-category-faq"
    >
                      <summary>
                        <span>{faq.q}</span>
                        <span className="gtc-faq-chevron" aria-hidden="true">
                          <ChevronDown size={19} strokeWidth={1.8} />
                        </span>
                      </summary>
                      <div className="gtc-faq-answer"><p>{faq.a}</p></div>
                    </details>
                  ))}
                </div>
              </section>
            </>
          )}
        </main>
      </div>

      <style jsx global>{`
        .gtc-root {
          --gtc-ink: #063736;
          --gtc-dark: #0a2e2e;
          --gtc-teal: #167273;
          --gtc-mint: #86dcc7;
          --gtc-line: #d5e4df;
          --gtc-muted: #506b69;
          font-family: inherit;
          background: #fcfefd;
          color: var(--gtc-ink);
        }
        .gtc-root * { box-sizing: border-box }
        .gtc-wrap {
          margin-left: auto;
          margin-right: auto;
        }
        .gtc-hero {
          color: #f2fbf9;
          background: linear-gradient(
              145deg,
              rgba(2, 47, 49, .6),
              rgba(2, 47, 49, .6)
            ),
            linear-gradient(180deg, #0a2e2e 0%, #041b1c 100%);
          position: relative;
          overflow: hidden;
        }
        .gtc-hero:before {
          content: "";
          position: absolute;
          inset: 0 0 0 56%;
          background-image: linear-gradient(
              rgba(193, 255, 232, .028) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(193, 255, 232, .028) 1px,
              transparent 1px
            );
          background-size: 30px 30px;
          pointer-events: none;
          mask-image: linear-gradient(90deg, transparent, #000 48%);
        }
        .gtc-crumbs {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-top: 28px;
          font-size: 13px;
          color: #bfded8;
          position: relative;
        }
        .gtc-crumbs a {
          text-decoration: none;
          color: #d4f4e6;
        }
        .gtc-crumbs a:hover { text-decoration: underline }
       .gtc-hero-grid {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: center;
  padding: 48px 0 62px;
}

.gtc-hero-main {
  width: 100%;
  max-width: 100%;
}
        .gtc-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #7fb8ae;
          letter-spacing: .17em;
          font-weight: 750;
          font-size: 11px;
          line-height: 1.5;
          text-transform: uppercase;
        }
        .gtc-dot {
          width: 7px;
          height: 7px;
          display: inline-block;
          flex-shrink: 0;
          border-radius: 100%;
          background: #86dcc7;
          box-shadow: 0 0 0 3px rgba(134, 220, 199, .08);
        }
       .gtc-hero h1 {
  font-size: clamp(44px, 5.1vw, 74px);
  letter-spacing: -0.052em;
  line-height: 1.07;
  margin: 0 0 26px;
  font-weight: 800;
  max-width: 1100px;
  color: #f2fbf9;
}

.gtc-hero-rule {
  width: 100%;
  height: 1px;
  max-width: none;
  background: linear-gradient(
    90deg,
    rgba(205, 238, 232, 0.25),
    rgba(205, 238, 232, 0.06)
  );
  margin-bottom: 30px;
}





/* Description + CTA on one row */

.gtc-hero-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
  width: 100%;
}

.gtc-hero-description {
  flex: 1;
  max-width: 900px;
  margin: 0;
  color: #fafafa;
  font-size: clamp(17px, 1.55vw, 21px);
  font-weight: 400;
  line-height: 1.55;
  letter-spacing: -0.005em;
}

/* Transparent portfolio-style CTA */

.gtc-hero-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  flex-shrink: 0;
  margin: 0;
  padding: 18px 28px;

  border: 1px solid rgba(205, 238, 232, 0.28);
  border-radius: 100px;

  background: transparent;
  color: #cdeee8;

  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
  text-decoration: none;
  white-space: nowrap;

  cursor: pointer;

  transition:
    background 0.25s ease,
    color 0.25s ease,
    border-color 0.25s ease,
    transform 0.25s ease;
}

.gtc-hero-button:hover {
  background: #f2fbf9;
  color: #04201f;
  border-color: #f2fbf9;
  transform: translateY(-2px);
}

.gtc-hero-button:focus-visible {
  outline: 2px solid #86dcc7;
  outline-offset: 4px;
}




        .gtc-main {
          padding-top: 52px;
          padding-bottom: 86px;
        }
        .gtc-section-heading {
          display: flex;
          gap: 25px;
          justify-content: space-between;
          align-items: flex-end;
        }
        .gtc-eyebrow-light { color: #177270 }
        .gtc-section-heading h2 {
          font-size: clamp(28px, 3.2vw, 39px);
          letter-spacing: -.045em;
          line-height: 1.2;
          margin: 10px 0 8px;
          font-weight: 800;
        }
        .gtc-section-heading h2 span { color: #59b399 }
        .gtc-section-heading p {
          font-size: 14px;
          color: var(--gtc-muted);
          margin: 0;
          line-height: 1.65;
        }
        .gtc-search {
          border: 1px solid #cbded9;
          background: #fff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 245px;
          height: 43px;
          padding: 0 12px;
          color: #24625f;
        }
        .gtc-search:focus-within {
          outline: 2px solid #8bd4bf;
          outline-offset: 1px;
        }
        .gtc-search input {
          flex: 1;
          min-width: 0;
          border: 0;
          outline: none;
          background: transparent;
          font-size: 13px;
          color: #063736;
        }
        .gtc-search button {
          display: flex;
          align-items: center;
          border: 0;
          background: none;
          cursor: pointer;
          color: #497b73;
          padding: 0;
        }
        .gtc-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--gtc-line);
          margin-top: 28px;
          padding: 17px 0 18px;
          gap: 12px;
        }
        .gtc-count {
          font-size: 11px;
          letter-spacing: .07em;
          color: #4c6c68;
          font-weight: 750;
        }
        .gtc-filter {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 9px 0 12px;
          border: 1px solid #cee0d9;
          border-radius: 7px;
          background: #fff;
          height: 36px;
          color: #0c5b58;
        }
        .gtc-filter select {
          appearance: none;
          border: 0;
          background: transparent;
          min-width: 90px;
          outline: none;
          font: inherit;
          color: #143f3c;
          font-size: 12px;
          cursor: pointer;
        }
        .gtc-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }
        .gtc-card {
          display: flex;
          flex-direction: column;
          min-height: 225px;
          padding: 20px 20px 16px;
          border: 1px solid var(--gtc-line);
          border-radius: 10px;
          background: #fff;
          color: var(--gtc-ink);
          text-decoration: none;
          transition: border-color .18s, box-shadow .18s, transform .18s;
        }
        .gtc-card:hover {
          border-color: #76c2ad;
          box-shadow: 0 13px 32px rgba(11, 77, 72, .09);
          transform: translateY(-3px);
        }
        .gtc-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
          gap: 10px;
        }
        .gtc-card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 9px;
          background: #e0f2eb;
          color: #166c66;
        }
        .gtc-accent-1 {
          background: #ecf1d5;
          color: #667b24;
        }
        .gtc-accent-2 {
          background: #e3eff4;
          color: #316e87;
        }
        .gtc-accent-3 {
          background: #e7f4eb;
          color: #347b5c;
        }
        .gtc-pill {
          font-size: 9px;
          letter-spacing: .055em;
          text-transform: uppercase;
          border: 1px solid #d1e3dd;
          border-radius: 30px;
          padding: 4px 7px;
          color: #4b6c67;
          font-weight: 750;
        }
        .gtc-card h3 {
          font-size: 19px;
          line-height: 1.25;
          letter-spacing: -.03em;
          font-weight: 800;
          margin: 0 0 9px;
        }
        .gtc-card p {
          font-size: 13px;
          line-height: 1.63;
          color: #56716d;
          margin: 0 0 18px;
          flex: 1;
        }
        .gtc-card-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          border-top: 1px solid #e1ebe7;
          padding-top: 13px;
          font-size: 11px;
          color: #19726d;
          font-weight: 650;
        }
        .gtc-card-bottom svg { transition: transform .18s }
        .gtc-card:hover .gtc-card-bottom svg {
          transform: translateX(4px);
        }
        .gtc-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 10px;
          padding: 70px 15px;
          border: 1px dashed #b3d3c9;
          border-radius: 11px;
          color: #346a64;
        }
        .gtc-empty h3 { margin: 0; font-size: 19px }
        .gtc-empty p {
          margin: 0;
          color: #5c7670;
          font-size: 13px;
        }
        .gtc-empty button {
          display: inline-flex;
          gap: 8px;
          align-items: center;
          margin-top: 8px;
          background: #0c6663;
          border: 0;
          border-radius: 7px;
          padding: 10px 13px;
          color: #fff;
          font-weight: 700;
          cursor: pointer;
        }
        /* Conversion section, shared across all category pages */
        .gtc-service {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 42px;
          margin-top: 72px;
          padding: clamp(30px, 4vw, 52px);
          border: 1px solid rgba(134, 220, 199, .2);
          border-radius: 16px;
          background: linear-gradient(125deg, #073432 0%, #082929 62%, #062021 100%);
          color: #f2fbf9;
        }
        .gtc-service:after {
          content: "";
          position: absolute;
          inset: 0 0 0 52%;
          z-index: -1;
          pointer-events: none;
          opacity: .5;
          background: linear-gradient(rgba(134,220,199,.07) 1px, transparent 1px),
                      linear-gradient(90deg,rgba(134,220,199,.07) 1px,transparent 1px);
          background-size: 29px 29px;
          mask-image: linear-gradient(90deg, transparent, black);
        }
        .gtc-service-copy { max-width: 690px; }
        .gtc-service-kicker {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          color: #a3e1d0;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .15em;
        }

.gtc-service h2 {
  margin: 0 0 14px;
  font-size: clamp(27px, 3.2vw, 41px);
  line-height: 1.12;
  letter-spacing: -.045em;
  font-weight: 800;
  color: #f2fbf9;
  white-space: pre-line;
}

        .gtc-service p {
          margin: 0;
          max-width: 610px;
          color: #c6dfd9;
          font-size: clamp(14px, 1.2vw, 16px);
          line-height: 1.65;
        }
        .gtc-service-link {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 18px;
          padding: 7px 7px 7px 19px;
          border-radius: 9px;
          background: #f2fbf9;
          color: #073432;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
          transition: transform .2s ease, background .2s ease;
        }
        .gtc-service-link:hover { background: #dff7ed; transform: translateY(-2px); }
        .gtc-service-link:focus-visible { outline: 3px solid #86dcc7; outline-offset: 3px; }
        .gtc-service-arrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 38px;
          width: 38px;
          border-radius: 6px;
          background: #86dcc7;
          color: #04201f;
        }

        /* SEO FAQs: native, accessible details rather than JS accordion state */
        .gtc-faq {
          display: grid;
          grid-template-columns: minmax(0, .75fr) minmax(0, 1.25fr);
          gap: clamp(24px, 5vw, 80px);
          padding-top: 94px;
          padding-bottom: 15px;
        }
        .gtc-faq-intro { align-self: start; }
        .gtc-faq-kicker {
          color: #167273;
          letter-spacing: .14em;
          font-size: 10px;
          font-weight: 800;
        }
        .gtc-faq h2 {
          margin: 15px 0 15px;
          max-width: 370px;
          color: #063736;
          font-size: clamp(31px, 3.8vw, 49px);
          line-height: 1.08;
          letter-spacing: -.052em;
          font-weight: 800;
        }
        .gtc-faq h2 span { color: #67c4ab; }
        .gtc-faq-intro > p {
          max-width: 330px;
          margin: 0;
          color: #57736e;
          line-height: 1.65;
          font-size: 14px;
        }
        .gtc-faq-items { min-width: 0; border-top: 1px solid #d5e4df; }
        .gtc-faq-item { border-bottom: 1px solid #d5e4df; }
        .gtc-faq-item summary {
          list-style: none;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 25px;
          padding: 24px 4px;
          color: #063736;
          font-size: 15px;
          line-height: 1.45;
          font-weight: 750;
        }
        .gtc-faq-item summary::-webkit-details-marker { display: none; }
        .gtc-faq-chevron {
          display: inline-flex;
          flex-shrink: 0;
          justify-content: center;
          align-items: center;
          color: #167273;
          transition: transform .2s ease;
        }
        .gtc-faq-item[open] .gtc-faq-chevron { transform: rotate(180deg); }
        .gtc-faq-item summary:hover { color: #167273; }
        .gtc-faq-item summary:focus-visible { outline: 2px solid #167273; outline-offset: -2px; }
        .gtc-faq-answer p {
          max-width: 620px;
          padding: 0 32px 22px 4px;
          margin: 0;
          color: #506b69;
          font-size: 14px;
          line-height: 1.75;
        }
        @media (max-width: 800px) {
          .gtc-hero-grid {
            grid-template-columns: 1fr;
            gap: 26px;
            padding: 42px 0 48px;
          }
          .gtc-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .gtc-service { flex-direction: column; align-items: flex-start; gap: 28px; }
          .gtc-faq { grid-template-columns: 1fr; padding-top: 65px; gap: 30px; }
          .gtc-faq h2 { max-width: 550px; }
          .gtc-section-heading {
            align-items: stretch;
            flex-direction: column;
          }
          .gtc-search {
            min-width: 0;
            width: 100%;
          }
        }
        @media (max-width: 540px) {
          .gtc-hero h1 {
            font-size: clamp(38px, 10vw, 53px);
          }
          .gtc-hero-grid { padding-top: 38px }
          .gtc-grid { grid-template-columns: 1fr }
          .gtc-service { margin-top: 48px; padding: 28px 22px; }
          .gtc-service-link { width: 100%; justify-content: space-between; }
          .gtc-faq { padding-top: 55px; }
          .gtc-faq-item summary { padding: 20px 2px; font-size: 14px; }
          .gtc-hero-meta { gap: 10px 20px }
          .gtc-main { padding-top: 40px }
        }



        @media (max-width: 800px) {
  .gtc-hero-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }

  .gtc-hero-description {
    max-width: 100%;
  }

  .gtc-hero-button {
    padding: 15px 24px;
  }
}

@media (max-width: 540px) {
  .gtc-hero-bottom {
    gap: 22px;
  }

  .gtc-hero-description {
    font-size: 17px;
    line-height: 1.6;
  }
}

        @media (prefers-reduced-motion: reduce) {
          .gtc-root * { transition: none !important }
        }
      `}</style>
    </Layout>
  );
}