import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Calculator,
  Check, ChevronDown, FileText, Filter, Search, SlidersHorizontal,
  Sparkles, Wrench, X,
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
    intro: "Work backwards from revenue targets, pressure-test your content budget, and see what organic growth needs to deliver.",
    description: "Free revenue planning calculators for B2B SaaS marketers. Model organic pipeline, content ROI, and campaign performance with practical inputs.",
    detail: "Turn growth targets into numbers you can actually plan against.",
    featured: "organic-revenue-calculator",
  },
  {
    slug: "ai-search",
    topic: "AI search",
    label: "AI search",
    eyebrow: "AI SEARCH & DISCOVERABILITY",
    title: "AI search tools",
    intro: "Prepare your website for AI-assisted discovery, build buyer prompts, and give answer engines clearer product information.",
    description: "Free AI search tools for B2B SaaS. Generate buyer evaluation prompts and prepare useful AI-facing content resources.",
    detail: "Useful starting points for understanding how buyers discover software in AI search.",
    featured: "buyer-prompt-generator",
  },
  {
    slug: "technical-seo",
    topic: "Technical SEO",
    label: "Technical SEO",
    eyebrow: "MARKUP, SNIPPETS & SITE HEALTH",
    title: "Technical SEO tools",
    intro: "Create structured data, check search snippets, and handle routine technical SEO tasks without starting from a blank file.",
    description: "Free technical SEO tools for creating schema markup, checking SERP snippets, and preparing search-ready page metadata.",
    detail: "Small technical tasks, made much less fiddly.",
    featured: "serp-snippet-preview",
  },
  {
    slug: "agency-hiring",
    topic: "Agency hiring",
    label: "Agency hiring",
    eyebrow: "BRIEFS, PROPOSALS & SHORTLISTS",
    title: "Agency hiring tools",
    intro: "Write better agency briefs, compare proposals on the same terms, and run paid trials that actually help you choose.",
    description: "Free agency hiring tools for B2B SaaS teams. Build SEO and content briefs, compare agency proposals, and assess paid trials.",
    detail: "Make the shortlist decision with clearer scope and fewer surprises.",
    featured: "agency-proposal-comparison",
  },
  {
    slug: "content-operations",
    topic: "Content Operations",
    label: "Content operations",
    eyebrow: "BRIEFS, REVIEWS & EDITORIAL WORKFLOWS",
    title: "Content operations tools",
    intro: "Spend less time chasing inputs, correcting first drafts, and explaining the same writing rules to every new contributor.",
    description: "Free content operations templates and calculators for B2B SaaS marketers. Manage briefs, writing guidelines, product facts, and editorial workflows.",
    detail: "Give writers what they need before the first draft lands.",
    featured: "content-brief-template",
  },
];

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
    return tools.filter((t) => (t.topic || "").toLowerCase() === config.topic.toLowerCase());
  }, [tools, config]);

  const types = useMemo(() => ["All types", ...new Set(categoryTools.map((t) => t.type).filter(Boolean))], [categoryTools]);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categoryTools.filter((t) =>
      (selectedType === "All types" || t.type === selectedType) &&
      (!q || [t.name, t.description, t.type].some((s) => (s || "").toLowerCase().includes(q)))
    );
  }, [categoryTools, selectedType, query]);

  if (!config) return null;
  const featured = categoryTools.find((t) => t.slug === config.featured) || categoryTools[0];
  const otherCategories = TOOL_CATEGORIES.filter((c) => c.slug !== category);
  const hasFilters = query || selectedType !== "All types";

  return (
    <Layout title={`${config.title} | Free GrowUp Tools`} description={config.description} path={`/tools/${category}/`}>
      <div className="gtc-root">
        <section className="gtc-hero">
          <div className="gtc-wrap">
            <nav className="gtc-crumbs" aria-label="Breadcrumb">
              <Link href="/tools/">All tools</Link><span aria-hidden="true">/</span><span>{config.label}</span>
            </nav>
            <div className="gtc-hero-grid">
              <div className="gtc-hero-main">
                <div className="gtc-eyebrow"><span className="gtc-dot" /> GROWUP TOOLKIT / {config.eyebrow}</div>
                <h1>{config.title}</h1>
                <p>{config.intro}</p>
                <div className="gtc-hero-meta">
                  <span><Check size={15} /> {categoryTools.length} free {categoryTools.length === 1 ? "tool" : "tools"}</span>
                  <span><Check size={15} /> No signup</span>
                </div>
                <a className="gtc-hero-button" href="#category-tools">Browse {config.label.toLowerCase()} tools <ArrowRight size={17} /></a>
              </div>
              {featured && (
                <Link className="gtc-feature" href={`/tools/${featured.slug}/`}>
                  <div className="gtc-feature-kicker"><span className="gtc-dot" /> START HERE <ArrowUpRight size={18} /></div>
                  <div className="gtc-feature-label">FEATURED TOOL</div>
                  <h2>{featured.name}</h2>
                  <p>{featured.description}</p>
                  <div className="gtc-feature-footer"><span>{featured.type}</span><span>Open tool <ArrowRight size={16} /></span></div>
                </Link>
              )}
            </div>
          </div>
        </section>

        <main className="gtc-wrap gtc-main" id="category-tools">
          <div className="gtc-section-heading">
            <div>
              <div className="gtc-eyebrow gtc-eyebrow-light"><span className="gtc-dot" /> TOOL DIRECTORY</div>
              <h2>Explore {config.label.toLowerCase()} tools<span>.</span></h2>
              <p>{config.detail}</p>
            </div>
            <div className="gtc-search" role="search">
              <Search size={18} aria-hidden="true" />
              <input aria-label={`Search ${config.label.toLowerCase()} tools`} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tools..." />
              {query && <button aria-label="Clear search" onClick={() => setQuery("")}><X size={16} /></button>}
            </div>
          </div>

          <div className="gtc-toolbar">
            <div className="gtc-count" aria-live="polite">{visible.length} {visible.length === 1 ? "tool" : "tools"}{hasFilters && ` found`}</div>
            <div className="gtc-filter"><Filter size={15} aria-hidden="true" /><select aria-label="Filter by tool type" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>{types.map((t) => <option key={t}>{t}</option>)}</select><ChevronDown size={15} aria-hidden="true" /></div>
          </div>

          {visible.length ? (
            <div className="gtc-grid">
              {visible.map((tool, index) => {
                const Icon = getTypeIcon(tool.type);
                return (
                  <Link className="gtc-card" href={`/tools/${tool.slug}/`} key={tool.slug}>
                    <div className="gtc-card-top">
                      <span className={`gtc-card-icon gtc-accent-${index % 4}`}><Icon size={20} strokeWidth={1.9} /></span>
                      <span className="gtc-pill">{tool.type}</span>
                    </div>
                    <h3>{tool.name}</h3>
                    <p>{tool.description}</p>
                    <div className="gtc-card-bottom"><span>{config.label}</span><ArrowRight size={18} aria-hidden="true" /></div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="gtc-empty"><Search size={24} /><h3>No matching tools</h3><p>Try a shorter search or show all tool types.</p><button onClick={() => { setQuery(""); setSelectedType("All types"); }}>Clear filters <ArrowRight size={16} /></button></div>
          )}

          <section className="gtc-explore" aria-labelledby="gtc-explore-heading">
            <div className="gtc-explore-heading"><div><span className="gtc-small-label">MORE FROM GROWUP</span><h2 id="gtc-explore-heading">Explore other toolkits</h2></div><Link href="/tools/#directory">View all tools <ArrowRight size={16} /></Link></div>
            <div className="gtc-other-grid">{otherCategories.map((c) => <Link href={`/tools/${c.slug}/`} key={c.slug}><span>{c.label}</span><ArrowUpRight size={18} /></Link>)}</div>
          </section>
        </main>
      </div>
      <style jsx global>{`
        .gtc-root { --gtc-ink:#063736; --gtc-dark:#073b39; --gtc-teal:#167273; --gtc-mint:#a9eed6; --gtc-line:#d5e4df; --gtc-muted:#506b69; font-family:inherit; background:#fcfefd; color:var(--gtc-ink); }
        .gtc-root * { box-sizing:border-box; }
        .gtc-wrap { width:min(1020px,calc(100% - 40px)); margin:0 auto; }
        .gtc-hero { color:#fff; background:radial-gradient(circle at 83% 35%,rgba(37,131,119,.19),transparent 35%), linear-gradient(125deg,#073532,#063a38 60%,#04312f); position:relative; overflow:hidden; }
        .gtc-hero:before { content:"";position:absolute;inset:0 0 0 52%;background-image:linear-gradient(rgba(193,255,232,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(193,255,232,.035) 1px,transparent 1px);background-size:28px 28px;pointer-events:none; }
        .gtc-crumbs { display:flex;align-items:center;gap:10px;padding-top:28px;font-size:13px;color:#bfdbd3;position:relative; }
        .gtc-crumbs a { text-decoration:none;color:#d4f4e6; } .gtc-crumbs a:hover { text-decoration:underline; }
        .gtc-hero-grid { position:relative;display:grid;grid-template-columns:minmax(0,1.3fr) minmax(260px,.86fr);gap:62px;align-items:center;padding:55px 0 66px; }
        .gtc-eyebrow { display:flex;align-items:center;gap:9px;color:#afebdb;letter-spacing:.13em;font-weight:750;font-size:10px;line-height:1.5; }
        .gtc-dot { width:6px;height:6px;display:inline-block;flex-shrink:0;border-radius:100%;background:#6bd2b0; }
        .gtc-hero h1 { font-size:clamp(38px,5vw,64px);letter-spacing:-.055em;line-height:1.065;margin:18px 0 18px;font-weight:800;max-width:650px; }
        .gtc-hero-main>p { margin:0;max-width:590px;color:#e2f3ee;font-size:16px;line-height:1.75; }
        .gtc-hero-meta { display:flex;gap:22px;flex-wrap:wrap;margin-top:22px;color:#c4e4da;font-size:12px;font-weight:650; }
        .gtc-hero-meta span { display:inline-flex;align-items:center;gap:6px; }
        .gtc-hero-button { margin-top:26px;display:inline-flex;gap:18px;align-items:center;justify-content:center;background:#b2f0d9;color:#073d39;text-decoration:none;padding:13px 17px;border-radius:7px;font-size:13px;font-weight:800;transition:background .2s,transform .2s; }
        .gtc-hero-button:hover { background:#d0fae9;transform:translateY(-2px); }
        .gtc-feature { display:flex;flex-direction:column;min-height:270px;background:#f2faf4;color:#073a38;border-radius:12px;box-shadow:9px 10px 0 rgba(104,215,166,.26);padding:26px;text-decoration:none;transition:transform .2s; }
        .gtc-feature:hover { transform:translateY(-3px); }
        .gtc-feature-kicker { display:flex;align-items:center;gap:8px;font-size:10px;letter-spacing:.11em;font-weight:800;color:#116d67; }
        .gtc-feature-kicker svg { margin-left:auto; }
        .gtc-feature-label { font-size:10px;letter-spacing:.08em;color:#63837b;font-weight:750;margin-top:25px; }
        .gtc-feature h2 {font-size:25px;letter-spacing:-.035em;line-height:1.2;margin:8px 0 10px;font-weight:800;}
        .gtc-feature p {color:#486662;font-size:13px;line-height:1.65;margin:0 0 24px;flex:1;}
        .gtc-feature-footer {display:flex;align-items:center;justify-content:space-between;border-top:1px solid #cfdfd8;padding-top:17px;font-size:11px;color:#35746c;font-weight:700;}
        .gtc-feature-footer span:last-child {display:inline-flex;align-items:center;gap:8px;}
        .gtc-main {padding-top:52px;padding-bottom:86px;}
        .gtc-section-heading { display:flex;gap:25px;justify-content:space-between;align-items:flex-end; }
        .gtc-eyebrow-light {color:#177270;}
        .gtc-section-heading h2 {font-size:clamp(28px,3.2vw,39px);letter-spacing:-.045em;line-height:1.2;margin:10px 0 8px;font-weight:800;}
        .gtc-section-heading h2 span {color:#59b399;}
        .gtc-section-heading p {font-size:14px;color:var(--gtc-muted);margin:0;line-height:1.65;}
        .gtc-search {border:1px solid #cbded9;background:#fff;border-radius:8px;display:flex;align-items:center;gap:9px;min-width:245px;height:43px;padding:0 12px;color:#24625f;}
        .gtc-search:focus-within {outline:2px solid #8bd4bf;outline-offset:1px;}
        .gtc-search input {flex:1;min-width:0;border:0;outline:none;background:transparent;font-size:13px;color:#063736;}
        .gtc-search button {display:flex;align-items:center;border:0;background:none;cursor:pointer;color:#497b73;padding:0;}
        .gtc-toolbar {display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--gtc-line);margin-top:28px;padding:17px 0 18px;gap:12px;}
        .gtc-count {font-size:11px;letter-spacing:.07em;color:#4c6c68;font-weight:750;}
        .gtc-filter {display:flex;align-items:center;gap:8px;padding:0 9px 0 12px;border:1px solid #cee0d9;border-radius:7px;background:#fff;height:36px;color:#0c5b58;}
        .gtc-filter select {appearance:none;border:0;background:transparent;min-width:90px;outline:none;font:inherit;color:#143f3c;font-size:12px;cursor:pointer;}
        .gtc-grid {display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;}
        .gtc-card {display:flex;flex-direction:column;min-height:225px;padding:20px 20px 16px;border:1px solid var(--gtc-line);border-radius:10px;background:#fff;color:var(--gtc-ink);text-decoration:none;transition:border-color .18s,box-shadow .18s,transform .18s;}
        .gtc-card:hover {border-color:#76c2ad;box-shadow:0 13px 32px rgba(11,77,72,.09);transform:translateY(-3px);}
        .gtc-card-top {display:flex;align-items:center;justify-content:space-between;margin-bottom:15px;gap:10px;}
        .gtc-card-icon {display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:9px;background:#e0f2eb;color:#166c66;}
        .gtc-accent-1 {background:#ecf1d5;color:#667b24;} .gtc-accent-2{background:#e3eff4;color:#316e87;} .gtc-accent-3 {background:#e7f4eb;color:#347b5c;}
        .gtc-pill {font-size:9px;letter-spacing:.055em;text-transform:uppercase;border:1px solid #d1e3dd;border-radius:30px;padding:4px 7px;color:#4b6c67;font-weight:750;}
        .gtc-card h3 {font-size:19px;line-height:1.25;letter-spacing:-.03em;font-weight:800;margin:0 0 9px;}
        .gtc-card p {font-size:13px;line-height:1.63;color:#56716d;margin:0 0 18px;flex:1;}
        .gtc-card-bottom {display:flex;justify-content:space-between;align-items:center;gap:8px;border-top:1px solid #e1ebe7;padding-top:13px;font-size:11px;color:#19726d;font-weight:650;}
        .gtc-card-bottom svg {transition:transform .18s;} .gtc-card:hover .gtc-card-bottom svg{transform:translateX(4px);}
        .gtc-empty {display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;padding:70px 15px;border:1px dashed #b3d3c9;border-radius:11px;color:#346a64;}
        .gtc-empty h3 {margin:0;font-size:19px;} .gtc-empty p {margin:0;color:#5c7670;font-size:13px;}
        .gtc-empty button {display:inline-flex;gap:8px;align-items:center;margin-top:8px;background:#0c6663;border:0;border-radius:7px;padding:10px 13px;color:#fff;font-weight:700;cursor:pointer;}
        .gtc-explore {margin-top:65px;padding:29px 0 0;border-top:1px solid var(--gtc-line);}
        .gtc-explore-heading {display:flex;justify-content:space-between;align-items:center;gap:15px;margin-bottom:18px;}
        .gtc-small-label {color:#287d73;letter-spacing:.11em;font-size:10px;font-weight:800;}
        .gtc-explore h2 {font-size:23px;letter-spacing:-.03em;margin:7px 0 0;}
        .gtc-explore-heading>a {display:inline-flex;gap:8px;align-items:center;color:#126b66;font-weight:750;text-decoration:none;font-size:12px;}
        .gtc-other-grid {display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;}
        .gtc-other-grid a {display:flex;justify-content:space-between;align-items:center;gap:9px;border:1px solid #cfe1da;background:#f6faf7;padding:17px 14px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:750;color:#0b5550;transition:background .2s,border-color .2s;}
        .gtc-other-grid a:hover {background:#e4f3ec;border-color:#91cbb5;}
        @media(max-width:800px) { .gtc-hero-grid{grid-template-columns:1fr;gap:26px;padding:42px 0 48px}.gtc-feature{min-height:230px}.gtc-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.gtc-other-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.gtc-section-heading{align-items:stretch;flex-direction:column}.gtc-search{min-width:0;width:100%;} }
        @media(max-width:540px) { .gtc-wrap{width:min(100% - 30px,1020px)}.gtc-hero h1{font-size:41px}.gtc-hero-grid{padding-top:38px}.gtc-grid{grid-template-columns:1fr}.gtc-hero-meta{gap:10px 20px}.gtc-other-grid{grid-template-columns:1fr 1fr}.gtc-other-grid a{padding:14px 11px}.gtc-explore-heading{align-items:flex-start;flex-direction:column}.gtc-main{padding-top:40px;} }
        @media(prefers-reduced-motion:reduce) { .gtc-root * {transition:none !important;} }
      `}</style>
    </Layout>
  );
}
