import { schemaComponents } from "../../components/tools/schemaRegistry";
import Link from "next/link";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { tools } from "../../lib/catalog.mjs";
import Layout from "../../components/Layout";
import Workbench from "../../components/Workbench";

import SerpSnippetPreview, {
  faqs as serpSnippetFaqs,
} from "../../components/tools/SerpSnippetPreview";

import FaqSchemaGenerator, {
  faqs as faqSchemaFaqs,
} from "../../components/tools/FaqSchemaGenerator";



const toolComponents = {
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
  return { props: { tool: tools.find((t) => t.slug === params.slug) } };
}
export default function ToolPage({ tool }) {

    const customTool = toolComponents[tool.slug];
const ToolComponent = customTool?.Component ?? Workbench;

const pageFaqs = customTool?.faqs ?? [
  { question: tool.question, answer: tool.answer },
  {
    question: "Where does my data go?",
    answer:
      "The tool processes your entries in this browser tab. Copy or download your result before leaving the page.",
  },
];
  const related = tools.filter(
    (t) => t.topic === tool.topic && t.slug !== tool.slug,
  );
  return (
    <Layout
      title={tool.title}
      description={tool.description}
      path={"/tools/" + tool.slug + "/"}
    >
      <section className="detailHead">
        <div className="wrap">
          <Link className="back" href="/tools/#directory">
            <ChevronLeft size={16} /> All tools
          </Link>
          <div className="eyebrow">
            <i />
            {tool.topic} / {tool.type}
          </div>
          <h1>{tool.name}</h1>
          <p>{tool.description}</p>
        </div>
      </section>
      <div className="wrap detailBody">
        <ToolComponent key={tool.slug} tool={tool} />



    <section className="faq" aria-labelledby="tool-faq-heading">
  <h2 id="tool-faq-heading">Frequently asked questions</h2>

  {pageFaqs.map(({ question, answer }, index) => (
    <details key={question} open={index === 0}>
      <summary>{question}</summary>
      <p>{answer}</p>
    </details>
  ))}
</section>



        <section className="related">
          <h2>More in {tool.topic.toLowerCase()}</h2>
          {related.map((t) => (
            <Link key={t.slug} href={"/tools/" + t.slug + "/"}>
              {t.name} <ArrowRight size={16} />
            </Link>
          ))}
        </section>
      </div>
    </Layout>
  );
}
