import { contentOpsComponents } from "../../components/tools/contentOps/registry";

import { hiringComponents } from "../../components/tools/hiring/registry";
import { schemaComponents } from "../../components/tools/schemaRegistry";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { tools } from "../../lib/catalog.mjs";
import Layout from "../../components/Layout";
import Workbench from "../../components/Workbench";

import SerpSnippetPreview, {
  faqs as serpSnippetFaqs,
} from "../../components/tools/SerpSnippetPreview";

import FaqSchemaGenerator, {
  faqs as faqSchemaFaqs,
} from "../../components/tools/FaqSchemaGenerator";

import LlmsTxtGenerator, {
  faqs as llmsTxtFaqs,
} from "../../components/tools/LlmsTxtGenerator";


import AeoPromptGenerator, {
  faqs as aeoPromptFaqs,
} from "../../components/tools/AeoPromptGenerator";


const TOOL_SEO = {
  "content-delivery-planner": {
    title: "Free Content Delivery Plan & Scope Template | GrowUp",
    description:
      "Build a clear content delivery plan covering deliverables, project fees, handoff dates, revision caps, and final approvals. Export to PDF or copy free.",
  },

  "content-cost-calculator": {
    title: "Free Content Production Cost Calculator | GrowUp",
    description:
      "Calculate what content production really costs. Compare in-house writers, freelancers and agencies, including the time your team spends reviewing drafts.",
  },

  "brand-writing-guidelines": {
    title: "Free Brand Writing Guidelines Template | GrowUp",
    description:
      "Create brand writing guidelines your team can follow. Document tone of voice, writing examples, preferred terminology and rules for product claims.",
  },

  "product-fact-sheet": {
    title: "Free Product Fact Sheet Template for SaaS | GrowUp",
    description:
      "Create a product fact sheet for your writers and agencies. Keep product features, pricing, integrations and approved marketing claims in one reference.",
  },

  "content-brief-template": {
    title: "Free Content Brief Template for B2B SaaS | GrowUp",
    description:
      "Create detailed content briefs for freelance writers, agencies and internal teams. Include buyer context, product information and writing requirements.",
  },

  "sme-interview-kit": {
    title: "Free SME Interview Template for Content Teams | GrowUp",
    description:
      "Prepare subject-matter expert interviews with focused questions, capture product insights and organise answers into useful notes for content production.",
  },

  "ai-assisted-writing-policy": {
    title: "Free AI Writing Policy Template for Teams | GrowUp",
    description:
      "Create an AI writing policy for your marketing team, freelancers and agencies. Define permitted AI use, human review requirements and content restrictions.",
  },
};

const categoryPages = {
  "Revenue planning": {
    name: "Revenue Planning",
    href: "/tools/revenue-planning/",
  },
  "AI search": {
    name: "AI Search",
    href: "/tools/ai-search/",
  },
  "Technical SEO": {
    name: "Technical SEO",
    href: "/tools/technical-seo/",
  },
  "Agency hiring": {
    name: "Agency Hiring",
    href: "/tools/agency-hiring/",
  },
  "Content Operations": {
    name: "Content Operations",
    href: "/tools/content-operations/",
  },
};

const CONTENT_SERVICE_URL =
  "https://www.seo-growup.com/b2b-saas-content-marketing-agency";

const TOOL_CTAS = {
  "content-delivery-planner": {
    label: "CONTENT MARKETING SUPPORT",
    title: "Outsource content production with clear accountability.",
    description:
      "From strategy and product research to writing, editing and final delivery, GrowUp manages execution against agreed priorities, timelines and quality requirements.",
    button: "Explore our content services",
  },

  "content-cost-calculator": {
    label: "CONTENT PRODUCTION SUPPORT",
    title: "Know your costs. Need the content delivered?",
    description:
      "Get a content production programme with agreed deliverables, transparent monthly costs and fewer hours spent managing external writers.",
    button: "Explore our content services",
  },

  "brand-writing-guidelines": {
    label: "EDITORIAL SUPPORT",
    title: "Tired of rewriting every agency draft?",
    description:
      "GrowUp works from your product documentation and writing standards to produce content your marketing team can review without starting again.",
    button: "Explore our content services",
  },

  "product-fact-sheet": {
    label: "PRODUCT-LED CONTENT",
    title: "Need writers who understand your product?",
    description:
      "We turn your product features, customer use cases and technical documentation into content written for buyers evaluating your software.",
    button: "Explore our content services",
  },

  "content-brief-template": {
    label: "CONTENT WRITING SUPPORT",
    title: "Got the briefs. Need the articles written?",
    description:
      "GrowUp researches, writes and optimises comparison pages, alternatives pages and product-led articles for B2B SaaS marketing teams.",
    button: "Explore our content services",
  },

  "sme-interview-kit": {
    label: "EXPERT-LED CONTENT",
    title: "Got the experts. Need someone to write?",
    description:
      "We interview your product experts, extract the details buyers care about and turn those conversations into publishable content.",
    button: "Explore our content services",
  },

  "ai-assisted-writing-policy": {
    label: "CONTENT QUALITY SUPPORT",
    title: "Need content that meets your standards?",
    description:
      "GrowUp handles product research, factual checks and editorial reviews instead of handing your team AI-generated drafts to clean up.",
    button: "Explore our content services",
  },
};

const toolComponents = {
  ...contentOpsComponents,
  ...hiringComponents,
  "buyer-prompt-generator": {
    Component: AeoPromptGenerator,
    faqs: aeoPromptFaqs,
  },
  "llms-txt-generator": {
    Component: LlmsTxtGenerator,
    faqs: llmsTxtFaqs,
  },
  ...schemaComponents,
  "serp-snippet-preview": {
    Component: SerpSnippetPreview,
    faqs: serpSnippetFaqs,
  },
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
  ...TOOL_CTAS[tool.slug],
  url: CONTENT_SERVICE_URL,
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
  path={"/tools/" + tool.slug + "/"}
>

      <section className="detailHead">
        <div className="wrap">

<nav
  className="toolBreadcrumbs"
  aria-label="Breadcrumb"
>
  <Link href="/tools/">
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
      Answers to common questions about using this tool.
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
