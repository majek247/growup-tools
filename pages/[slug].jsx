import { contentOpsComponents } from "../components/tools/contentOps/registry";

import { hiringComponents } from "../components/tools/hiring/registry";
import { schemaComponents } from "../components/tools/schemaRegistry";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { tools } from "../lib/catalog.mjs";
import Layout from "../components/Layout";
import Workbench from "../components/Workbench";

import FaqSchemaGenerator, {
  faqs as faqSchemaFaqs,
} from "../components/tools/FaqSchemaGenerator";

import LlmsTxtGenerator, {
  faqs as llmsTxtFaqs,
} from "../components/tools/LlmsTxtGenerator";


 



const TOOL_SEO = {
  "llms-txt-generator": {
    title: "Free llms.txt File Generator & Builder | GrowUp",
    description:
      "Build an llms.txt file for your website with our free generator. Organise important pages, import links, preview your file and download it without coding.",
  },




"review-schema-generator": {
  title: "Free Review Schema Generator (JSON-LD) | GrowUp",
  description:
    "Generate Review schema for products, software and businesses. Add customer reviews, calculate average ratings, then copy or download the JSON-LD for free.",
},



"video-schema-generator": {
  title: "Free Video Schema Generator (JSON-LD) | GrowUp",
  description:
    "Generate VideoObject schema for your product demos, tutorials and other videos. Enter your video details, then copy or download the JSON-LD for free.",
},


"article-schema-generator": {
  title: "Free Article Schema Generator (JSON-LD) | GrowUp",
  description:
    "Generate Article schema for your blog posts and news articles. Add your title, author and publication details, then copy or download the JSON-LD for free.",
},


"softwareapp-schema-generator": {
  title: "Free SoftwareApplication Schema Generator (JSON-LD) | GrowUp",
  description:
    "Generate SoftwareApplication schema for your SaaS product without coding. Add software details, pricing and features, then copy or download the JSON-LD.",
},


  "organization-schema-generator": {
  title: "Free Organization Schema Generator (JSON-LD) | GrowUp",
  description:
    "Generate Organization schema without coding. Add your company name, website, logo, contact details and social profiles, then copy or download the JSON-LD.",
},


  "faq-schema-generator": {
    title: "FAQ Schema Markup Generator (Free Tool) | GrowUp",
    description:
      "Create FAQ schema markup without coding. Enter your questions and answers, preview the JSON-LD, and copy or download the code for your website.",
  },
  "content-delivery-planner": {
    title: "Free Content Delivery Plan & Scope Template | GrowUp",
    description:
      "Build a clear content delivery plan covering deliverables, project fees, handoff dates, revision caps, and final approvals. Export to PDF or copy free.",
  },

  "content-cost-calculator": {
    title: "Free Content Production Cost Calculator | GrowUp",
    description:
      "See how much you're spending on content production. Compare in-house, freelance and agency costs, including the additional time your team spends reviewing drafts.",
  },

  "brand-writing-guidelines": {
    title: "Free Brand Writing Guidelines Template | GrowUp",
    description:
      "Create brand writing guidelines for your team, freelancers or agency. Define your writing style, approved terminology, product claims and editorial rules.",
  },

  "product-fact-sheet": {
    title: "Free Product Fact Sheet Template for SaaS | GrowUp",
    description:
      "Keep product claims accurate across your content. Document approved wording, supporting sources, verification dates and plan restrictions in one reference.",
  },

  "content-brief-template": {
    title: "Free Content Brief Template Builder for SaaS | GrowUp",
    description:
      "Create detailed B2B SaaS content briefs in minutes. Our free content brief template covers buyer intent, SEO requirements, product information and article outlines.",
  },

  "sme-interview-kit": {
    title: "Free SME Interview Prep Kit for B2B Content | GrowUp",
    description:
      "Create a structured SME interview plan in minutes. Define what your article needs, prepare relevant questions and export an interview pack as PDF or Excel.",
  },

  "ai-assisted-writing-policy": {
    title: "AI Writing Policy Template for Marketing Teams | GrowUp",
    description:
      "Build an AI writing policy for your marketing team, freelancers and agencies. Set rules for AI tools, content creation, fact-checking and approvals.",
  },
};

const categoryPages = {
  "Revenue planning": {
    name: "Revenue Planning",
    href: "/revenue-planning/",
  },
  "AI search": {
    name: "AI Search",
    href: "/ai-search/",
  },
  "Technical SEO": {
    name: "Technical SEO",
    href: "/technical-seo/",
  },
  "Agency hiring": {
    name: "Agency Hiring",
    href: "/agency-hiring/",
  },
  "Content Operations": {
    name: "Content Operations",
    href: "/content-operations/",
  },
};

const CONTENT_SERVICE_URL =
  "https://www.seo-growup.com/b2b-saas-content-marketing-agency";


const TOOL_CTAS = {
  "llms-txt-generator": {
    label: "B2B SAAS AI SEARCH SUPPORT",
    title: "Want more buyers finding your SaaS through AI search?",
    description:
      "We help B2B SaaS companies appear in more relevant AI search results, reach buyers comparing software and generate more qualified sales opportunities.",
    button: "Explore our AI search services",
    url: "https://www.seo-growup.com/llm-seo-agency-for-b2b-saas-companies",
  },

  "content-delivery-planner": {
    label: "CONTENT MARKETING SUPPORT",
    title: "Outsource content production with clear accountability.",
    description:
      "From strategy and product research to writing, editing and final delivery, GrowUp manages execution against agreed priorities, timelines and quality requirements.",
    button: "Explore our content services",
  },

  "content-cost-calculator": {
    label: "CONTENT PRODUCTION SUPPORT",
    title: "Make your content budget accountable to pipeline.",
    description:
      "Make better use of your content budget with pages built around commercial goals, predictable production costs and reporting that shows their contribution to pipeline.",
    button: "Explore our content services",
  },

  "brand-writing-guidelines": {
    label: "EDITORIAL SUPPORT",
    title: "Tired of rewriting every single draft your writers submit?",
    description:
      "We work with your team to create content that follows your brand guidelines, explains your product properly and brings in qualified leads.",
    button: "Explore our content services",
  },

  "product-fact-sheet": {
    label: "PRODUCT-LED CONTENT",
    title: "Need content writers who understand your product?",
    description:
      "GrowUp works with your team to produce technically accurate content that addresses buyer requirements and supports your pipeline goals.",
    button: "Explore our content services",
  },

  "content-brief-template": {
    label: "CONTENT WRITING SUPPORT",
    title: "End-to-end content production for B2B SaaS marketing teams",
    description:
      "From identifying content opportunities and preparing writer-ready briefs to producing and optimising articles, GrowUp manages the entire process with clear accountability to pipeline goals.",
    button: "Explore our content services",
  },

  "sme-interview-kit": {
    label: "EXPERT-LED CONTENT",
    title: "Fully managed content writing for B2B SaaS teams",
    description:
      "From interviewing SMEs and developing detailed briefs to writing, reviewing and optimising articles, GrowUp manages delivery against your pipeline goals",
    button: "Explore our content services",
  },

"ai-assisted-writing-policy": {
  label: "CONTENT QUALITY SUPPORT",
  title: "Responsible AI-assisted content production for B2B SaaS",
  description:
    "GrowUp handles everything from content research and briefing to writing, fact-checking and optimisation, with every piece tied to pipeline goals.",
  button: "Explore our content services",
},

"faq-schema-generator": {
  label: "B2B SAAS SEO SUPPORT",
  title: "Need help improving your SEO and AI search visibility?",
  description:
    "",
  button: "Explore our SEO services",
  url: "https://www.seo-growup.com/seo-consultancy-for-b2b-saas-companies?hsLang=en",
},

"organization-schema-generator": {
  label: "B2B SAAS SEO SUPPORT",
  title: "Need help improving your SEO and AI search visibility?",
  description:
    "From technical SEO to content strategy and execution, we help B2B SaaS companies improve search performance and generate more qualified sales opportunities.",
  button: "Explore our SEO services",
  url: "https://www.seo-growup.com/seo-consultancy-for-b2b-saas-companies?hsLang=en",
},


"softwareapp-schema-generator": {
  label: "B2B SAAS SEO SUPPORT",
  title: "Need help improving your SEO and AI search visibility?",
  description:
    "From technical SEO to content strategy and execution, we help B2B SaaS companies improve search performance and generate more qualified sales opportunities.",
  button: "Explore our SEO services",
  url: "https://www.seo-growup.com/seo-consultancy-for-b2b-saas-companies?hsLang=en",
},


"article-schema-generator": {
  label: "B2B SAAS SEO SUPPORT",
  title: "Need help improving your SEO and AI search visibility?",
  description:
    "From technical SEO to content strategy and execution, we help B2B SaaS companies improve search performance and generate more qualified sales opportunities.",
  button: "Explore our SEO services",
  url: "https://www.seo-growup.com/seo-consultancy-for-b2b-saas-companies?hsLang=en",
},



"video-schema-generator": {
  label: "B2B SAAS SEO SUPPORT",
  title: "Need help improving your SEO and AI search visibility?",
  description:
    "From technical SEO to content strategy and execution, we help B2B SaaS companies improve search performance and generate more qualified sales opportunities.",
  button: "Explore our SEO services",
  url: "https://www.seo-growup.com/seo-consultancy-for-b2b-saas-companies?hsLang=en",
},


"review-schema-generator": {
  label: "B2B SAAS SEO SUPPORT",
  title: "Need help improving your SEO and AI search visibility?",
  description:
    "From technical SEO to content strategy and execution, we help B2B SaaS companies improve search performance and generate more qualified sales opportunities.",
  button: "Explore our SEO services",
  url: "https://www.seo-growup.com/seo-consultancy-for-b2b-saas-companies?hsLang=en",
},




};

const toolComponents = {
  ...contentOpsComponents,
  ...hiringComponents,
  "llms-txt-generator": {
    Component: LlmsTxtGenerator,
    faqs: llmsTxtFaqs,
  },
  ...schemaComponents,
  "faq-schema-generator": {
    Component: FaqSchemaGenerator,
    faqs: faqSchemaFaqs,
  },
};



export function getStaticPaths() {
  return {
    paths: tools.map((t) => ({ params: { slug: t.slug } })),
    fallback: false,
  };
}
export function getStaticProps({ params }) {
  const tool = tools.find((t) => t.slug === params.slug);

  if (!tool) {
    return { notFound: true };
  }

  return { props: { tool } };
}
export default function ToolPage({ tool }) {

  const category = categoryPages[tool.topic];

const toolCta = {
  label: "B2B SAAS MARKETING SUPPORT",
  title: `Need help beyond the ${tool.name}?`,
  description:
    `GrowUp helps B2B SaaS teams put their ${tool.topic.toLowerCase()} work into practice, with research, content production and SEO execution.`,
  button: "Explore our services",
  url: CONTENT_SERVICE_URL,
  ...TOOL_CTAS[tool.slug],
};

    const customTool = toolComponents[tool.slug];
const ToolComponent = customTool?.Component ?? Workbench;

const fallbackFaqs = [
  {
    question: tool.question || `How do I use ${tool.name}?`,
    answer:
      tool.answer ||
      `Open ${tool.name}, complete the relevant fields, and review the output before using it.`,
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. You can use this tool without creating an account or signing up for a subscription.",
  },
  {
    question: "Can I save or share my results?",
    answer:
      "Available export options depend on the tool. Check the options provided to copy, download, or save your results.",
  },
];

const rawFaqs =
  Array.isArray(customTool?.faqs) && customTool.faqs.length > 0
    ? customTool.faqs
    : fallbackFaqs;

const pageFaqs = rawFaqs.map((faq) => ({
  question: faq.question || faq.q,
  answer: faq.answer || faq.a,
}));


  return (

<Layout
  title={
    TOOL_SEO[tool.slug]?.title ||
    `Free ${tool.name} | GrowUp`
  }
  description={
    TOOL_SEO[tool.slug]?.description ||
    tool.description
  }
  path={"/" + tool.slug + "/"}
>

      <section className="detailHead">
        <div className="wrap">

<nav
  className="toolBreadcrumbs"
  aria-label="Breadcrumb"
>
  <Link href="/">
    All Tools
  </Link>

  {category && (
    <>
      <span aria-hidden="true">/</span>

      <Link href={category.href}>
        {category.name}
      </Link>
    </>
  )}

  <span aria-hidden="true">/</span>

  <span aria-current="page">
    {tool.name}
  </span>
</nav>


<h1>{tool.name}</h1>
<p>{tool.description}</p>

        </div>
      </section>
      <div className="wrap detailBody">
        <ToolComponent key={tool.slug} tool={tool} />




{/* TOOL-SPECIFIC SERVICE CTA */}
<section
  className="tool-service"
  aria-labelledby="tool-service-heading"
>
  <div className="tool-service-copy">
    <div className="tool-service-kicker">
      <span className="tool-service-dot" />
      {toolCta.label}
    </div>

    <h2 id="tool-service-heading">
      {toolCta.title}
    </h2>

    <p>{toolCta.description}</p>
  </div>

  <a
    className="tool-service-link"
    href={toolCta.url}
    target="_blank"
    rel="noopener noreferrer"
  >
    <span>{toolCta.button}</span>
    <span className="tool-service-arrow">
      <ArrowUpRight size={19} strokeWidth={2} />
    </span>
  </a>
</section>

{/* TOOL-SPECIFIC FAQS */}
<section
  className="tool-faq"
  aria-labelledby="tool-faq-heading"
>
  <div className="tool-faq-intro">
    <span className="tool-faq-kicker">
      HOW IT WORKS
    </span>

    <h2 id="tool-faq-heading">
      Frequently asked questions<span>.</span>
    </h2>

    <p>
Everything you need to know, from getting started to making the most of this tool.
    </p>
  </div>

  <div className="tool-faq-items">
    {pageFaqs.map(({ question, answer }) => (
      <details
        className="tool-faq-item"
        key={question}
        name="growup-individual-tool-faq"
      >
        <summary>
          <span>{question}</span>

          <span
            className="tool-faq-chevron"
            aria-hidden="true"
          >
            <ChevronDown size={19} strokeWidth={1.8} />
          </span>
        </summary>

        <div className="tool-faq-answer">
          <p>{answer}</p>
        </div>
      </details>
    ))}
  </div>
</section>



      </div>
    </Layout>
  );
}
