import Link from "next/link";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { tools } from "../../lib/catalog.mjs";
import Layout from "../../components/Layout";
import Workbench from "../../components/Workbench";
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
        <Workbench key={tool.slug} tool={tool} />
        <section className="faq">
          <h2>Frequently asked questions</h2>
          <details open>
            <summary>{tool.question}</summary>
            <p>{tool.answer}</p>
          </details>
          <details>
            <summary>Where does my data go?</summary>
            <p>
              The tool processes your entries in this browser tab. Copy or
              download your result before leaving the page.
            </p>
          </details>
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
