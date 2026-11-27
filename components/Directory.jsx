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

 

const initially = { q: "", topic: "", type: "" };


export default function Directory() {
  const [filters, set] = useState(initially);
  const [currentPage, setCurrentPage] = useState(1);

  const TOOLS_PER_PAGE = 12;


  useEffect(() => {
    // Preserve older deep links such as /tools/?topic=AI+search.
    const load = () => {
  setCurrentPage(1);
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
  setCurrentPage(1);

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


const totalPages = Math.ceil(matches.length / TOOLS_PER_PAGE);

const startIndex = (currentPage - 1) * TOOLS_PER_PAGE;

const paginatedTools = matches.slice(
  startIndex,
  startIndex + TOOLS_PER_PAGE
);

const firstVisible = matches.length ? startIndex + 1 : 0;

const lastVisible = Math.min(
  startIndex + TOOLS_PER_PAGE,
  matches.length
);

function goToPage(page) {
  if (page < 1 || page > totalPages || page === currentPage) {
    return;
  }

  setCurrentPage(page);

  document.getElementById("directory")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}



return (
  <Layout
    title="Free SEO & Content Marketing Tools | GrowUp"
    description="Explore free SEO and content marketing tools for B2B SaaS teams. Save time on everyday tasks, simplify workflows and make more informed marketing decisions."
    path="/"
  >



<section className="homeHero">
  <div className="wrap homeHeroInner">

    <div className="homeHeroEyebrow">
      <span className="homeHeroDot" />
      GROWUP TOOLKIT
    </div>

    <h1>
      
Free Tools for 
      <br />
   Smarter Marketing.
    </h1>

    <div className="homeHeroDivider" />

    <div className="homeHeroBottom">
      <p>
A collection of practical SEO and content tools to help B2B SaaS teams work more efficiently and make better commercial decisions.
      </p>

      <a href="#directory" className="homeHeroButton">
        Explore tools
        <ArrowRight size={20} />
      </a>
    </div>

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
          {paginatedTools.map((t) => (
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

        {totalPages > 1 && (
          <nav
            className="toolPagination"
            aria-label="Tool directory pagination"
          >
            <div className="toolPaginationInfo">
              <strong>
                Showing {firstVisible}–{lastVisible}
              </strong>
              <span>of {matches.length} tools</span>
            </div>

            <div className="toolPaginationControls">
              <button
                type="button"
                className="toolPaginationArrow"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <span aria-hidden="true">←</span>
                Previous
              </button>

              <div className="toolPaginationNumbers">
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`toolPaginationNumber ${
                      currentPage === page ? "active" : ""
                    }`}
                    onClick={() => goToPage(page)}
                    aria-label={`Page ${page}`}
                    aria-current={
                      currentPage === page ? "page" : undefined
                    }
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="toolPaginationArrow"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                Next
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </nav>
        )}

        {!matches.length && (
          <div className="empty">

            <h3>No matching tools</h3>
            <p>Try another search or clear your filters.</p>
          </div>
        )}
      </section>

   
<style jsx>{`

  /* HOMEPAGE HERO */


.homeHero {
  position: relative;
  overflow: hidden;
  background: #082e31;
  color: #ffffff;
}


  .homeHeroInner {
    position: relative;
    z-index: 1;
    padding-top: 94px;
    padding-bottom: 105px;
  }

  .homeHeroEyebrow {
    display: flex;
    align-items: center;
    gap: 11px;
    margin-bottom: 36px;
    color: #a9e9dc;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.16em;
  }

  .homeHeroDot {
    display: inline-block;
    flex-shrink: 0;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #86dcc7;
  }

  .homeHero h1 {
    max-width: 1150px;
    margin: 0;
    color: #ffffff;
    font-size: clamp(58px, 7.5vw, 108px);
    line-height: 1.04;
    letter-spacing: -0.065em;
    font-weight: 800;
  }

  .homeHeroDivider {
    width: 100%;
    height: 1px;
    margin: 49px 0 32px;
    background: linear-gradient(
      90deg,
      rgba(205, 238, 232, 0.32),
      rgba(205, 238, 232, 0.08)
    );
  }

  .homeHeroBottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 55px;
  }

  .homeHeroBottom p {
    max-width: 810px;
    margin: 0;
    color: #d9ece7;
    font-size: clamp(17px, 1.55vw, 21px);
    line-height: 1.65;
    font-weight: 400;
  }

  .homeHeroButton {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    gap: 14px;
    padding: 18px 27px;
    border: 1px solid rgba(205, 238, 232, 0.35);
    border-radius: 100px;
    background: transparent;
    color: #ffffff;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    white-space: nowrap;
    transition: background 0.2s, color 0.2s;
  }

  .homeHeroButton:hover {
    background: #eef4f3;
    color: #073b3b;
  }

  .homeHeroNote {
    display: flex;
    align-items: center;
    gap: 9px;
    margin-top: 28px;
    color: #b6dcd2;
    font-size: 12px;
    font-weight: 500;
  }

  @media (max-width: 800px) {
    .homeHeroInner {
      padding-top: 72px;
      padding-bottom: 78px;
    }

    .homeHero h1 {
      font-size: clamp(50px, 9vw, 76px);
    }

    .homeHeroBottom {
      flex-direction: column;
      align-items: flex-start;
      gap: 28px;
    }

    .homeHeroBottom p {
      max-width: 100%;
    }

    .homeHeroDivider {
      margin: 35px 0 26px;
    }
  }

  @media (max-width: 540px) {
    .homeHeroInner {
      padding-top: 58px;
      padding-bottom: 65px;
    }

    .homeHeroEyebrow {
      margin-bottom: 27px;
    }

    .homeHero h1 {
      font-size: clamp(43px, 10vw, 58px);
      letter-spacing: -0.055em;
    }

    .homeHeroBottom p {
      font-size: 16px;
    }

    .homeHeroButton {
      padding: 15px 23px;
    }
  }

/* Premium tool directory pagination */

.toolPagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 38px;
  padding: 25px 0 10px;
  border-top: 1px solid #d6e5e1;
}

.toolPaginationInfo {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #69817a;
  font-size: 12px;
}

.toolPaginationInfo strong {
  color: #073b3b;
  font-weight: 800;
}

.toolPaginationControls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolPaginationNumbers {
  display: flex;
  align-items: center;
  gap: 6px;
}

.toolPaginationNumber {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #d6e5e1;
  border-radius: 10px;
  background: #ffffff;
  color: #496a63;
  font: inherit;
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.toolPaginationNumber:hover:not(.active) {
  background: #eef4f3;
  border-color: #8bbfb2;
  color: #073b3b;
}

.toolPaginationNumber.active {
  background: #073b3b;
  color: #ffffff;
  border-color: #073b3b;
  box-shadow: 0 3px 10px rgba(7, 59, 59, 0.12);
}

.toolPaginationArrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 40px;
  padding: 0 13px;
  border: 1px solid #d6e5e1;
  border-radius: 10px;
  background: #ffffff;
  color: #073b3b;
  font: inherit;
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.toolPaginationArrow span {
  font-size: 17px;
  line-height: 1;
}

.toolPaginationArrow:hover:not(:disabled) {
  background: #eef4f3;
  border-color: #8bbfb2;
}

.toolPaginationArrow:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.toolPagination button:focus-visible {
  outline: 3px solid #86dcc7;
  outline-offset: 3px;
}

@media (max-width: 650px) {
  .toolPagination {
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin-top: 28px;
    padding-top: 22px;
  }

  .toolPaginationControls {
    width: 100%;
    justify-content: space-between;
    gap: 7px;
  }

  .toolPaginationArrow {
    padding: 0 10px;
    font-size: 11px;
  }

  .toolPaginationNumber {
    width: 36px;
    height: 38px;
  }
}

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
