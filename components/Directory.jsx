import { contentOpsIcons } from "./tools/contentOps/icons";
import { Columns3, ClipboardCheck, FilePenLine } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  ChartNoAxesColumnIncreasing,
  RefreshCw,
  FileCode2,
  Coins,
  CalendarRange,
  ScanEye,
  MessagesSquare,
  SearchCheck,
  Braces,
  Link2,
  MousePointerClick,
  Shapes,
  Check,
  X,
} from "lucide-react";
import { tools, topics, types, workbenchTools } from "../lib/catalog.mjs";
import Layout from "./Layout";

const icons = [
  ChartNoAxesColumnIncreasing,
  RefreshCw,
  FileCode2,
  Coins,
  CalendarRange,
  ScanEye,
  MessagesSquare,
  SearchCheck,
  Braces,
  Link2,
  MousePointerClick,
];

const hiringIcons = {
  "seo-agency-brief-builder": FilePenLine,
};

// Each category now has a dedicated page. Add categories here if you create new pages.
const CATEGORY_LINKS = [
  { label: "Revenue planning", href: "/revenue-planning/" },
  { label: "AI search", href: "/ai-search/" },
  { label: "Technical SEO", href: "/technical-seo/" },
  { label: "Agency hiring", href: "/agency-hiring/" },
  { label: "Content Operations", href: "/content-operations/" },
];

export function ToolIcon({ slug, size = 22 }) {
  const Icon =
    contentOpsIcons[slug] ||
    hiringIcons[slug] ||
    icons[workbenchTools.findIndex((t) => t.slug === slug)] ||
    Shapes;
  return <Icon size={size} strokeWidth={1.8} aria-hidden />;
}

function Featured() {
  return (
    <Link href="/organic-revenue-calculator/" className="feature">
      <div className="featTop">
        <span className="eyebrow"><i /> Featured tool</span>
        <ArrowUpRight size={20} />
      </div>
      <div className="featName">Organic revenue calculator</div>
      <div className="featMeta">Example ARR target</div>
      <strong className="featNum">£240,000</strong>
      <div className="funnel" aria-hidden="true"><i /><i /><i /></div>
      <div className="featMetrics">
        <div><strong>8,000</strong><small>Organic visits</small></div>
        <div><strong>40</strong><small>Opportunities</small></div>
        <div><strong>10</strong><small>Deals</small></div>
      </div>
    </Link>
  );
}

const initially = { q: "", topic: "", type: "" };

export default function Directory() {
  const [filters, set] = useState(initially);

  useEffect(() => {
    // Preserve older deep links such as /tools/?topic=AI+search.
    const load = () => {
      const p = new URLSearchParams(window.location.search);
      set({
        q: p.get("q") || "",
        topic: topics.includes(p.get("topic")) ? p.get("topic") : "",
        type: types.includes(p.get("type")) ? p.get("type") : "",
      });
    };
    load();
    window.addEventListener("popstate", load);
    return () => window.removeEventListener("popstate", load);
  }, []);

  function change(next) {
    set(next);
    const url = new URL(window.location.href);
    for (const [key, value] of Object.entries(next)) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    window.history.replaceState(window.history.state, "", url);
  }

  const matches = tools.filter(
    (t) =>
      (!filters.topic || filters.topic === t.topic) &&
      (!filters.type || filters.type === t.type) &&
      [t.name, t.topic, t.type, t.description]
        .join(" ")
        .toLowerCase()
        .includes(filters.q.trim().toLowerCase()),
  );

  return (
    <Layout
      title="Free SEO & Content Tools for B2B SaaS | GrowUp"
      description="Explore free tools for B2B SaaS teams. Plan organic pipeline, compare agencies, brief writers and generate SEO files without signing up."
      path="/"
    >
      <section className="hero">
        <div className="wrap heroGrid">
          <div>
            <div className="eyebrow"><i /> GrowUp toolkit</div>
            <h1>Free SEO &amp;<br /><em>content tools.</em></h1>
            <p>Plan organic revenue, compare agency proposals and prepare a paid content trial for your shortlist.</p>
            <div className="heroActions">
              <a href="#directory" className="button">Browse tools <span>↓</span></a>
              <small><Check size={15} /> No sign-up</small>
            </div>
          </div>
          <Featured />
        </div>
      </section>

      <section id="directory" className="wrap directory">
        <div className="directoryTop">
          <div>
            <div className="eyebrow ink"><i /> Tool directory</div>
            <h2>Find a tool<span>.</span></h2>
          </div>
          <label className="search">
            <Search size={18} />
            <input
              type="search"
              aria-label="Search tools"
              placeholder="Search tools…"
              value={filters.q}
              onChange={(e) => change({ ...filters, q: e.target.value })}
            />
          </label>
        </div>

        <div className="filterRow">
          <nav className="pills directoryCategoryLinks" aria-label="Browse tools by category">
            <Link
              href="/#directory"
              className={`topicLink ${!filters.topic ? "isActive" : ""}`}
              aria-current={!filters.topic ? "page" : undefined}
            >
              All topics
            </Link>
            {CATEGORY_LINKS.map(({ label, href }) => (
              <Link key={href} href={href} className="topicLink">
                {label}
              </Link>
            ))}
          </nav>
          <label className="select">
            <SlidersHorizontal size={15} />
            <select
              aria-label="Filter by tool type"
              value={filters.type}
              onChange={(e) => change({ ...filters, type: e.target.value })}
            >
              <option value="">All types</option>
              {types.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
        </div>

        <div className="results">
          <span role="status">{matches.length} {matches.length === 1 ? "tool" : "tools"}</span>
          {Object.values(filters).some(Boolean) && (
            <button onClick={() => change(initially)}><X size={12} /> Clear filters</button>
          )}
        </div>

        <div className="cards">
          {matches.map((t) => (
            <Link
              href={`/${t.slug}/`}
              key={t.slug}
              className={`card color${topics.indexOf(t.topic)}`}
            >
              <div className="cardTop">
                <span className="icon"><ToolIcon slug={t.slug} /></span>
                <span className="type">{t.type}</span>
              </div>
              <h3>{t.name}</h3>
              <p>{t.description}</p>
              <div className="cardBot"><span>{t.topic}</span><ArrowRight size={18} /></div>
            </Link>
          ))}
        </div>

        {!matches.length && (
          <div className="empty">
            <h3>No matching tools</h3>
            <p>Try another search or clear your filters.</p>
          </div>
        )}
      </section>

      <style jsx>{`
        .directoryCategoryLinks {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 7px;
        }
        .directoryCategoryLinks :global(.topicLink) {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 31px;
          padding: 7px 13px;
          border: 1px solid #d1e2df;
          border-radius: 999px;
          background: #fff;
          color: #083638;
          font: inherit;
          font-size: 12px;
          font-weight: 650;
          line-height: 1.2;
          text-decoration: none;
          transition: background .16s ease, border-color .16s ease, color .16s ease;
        }
        .directoryCategoryLinks :global(.topicLink:hover),
        .directoryCategoryLinks :global(.topicLink:focus-visible) {
          border-color: #167273;
          background: #eef4f3;
          outline-offset: 3px;
        }
        .directoryCategoryLinks :global(.topicLink.isActive) {
          background: #0b4746;
          color: #fff;
          border-color: #0b4746;
        }
      `}</style>
    </Layout>
  );
}
