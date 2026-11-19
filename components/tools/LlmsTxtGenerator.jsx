import { useRef, useState } from "react";
import Papa from "papaparse";

export const faqs = [
  {
    question: "Which pages should I include?",
    answer:
      "Start with the pages you would send a buyer who asked what your product does, what it costs and how it integrates. Use the description to say what each page answers. Add documentation and support links where they help.",
  },
  {
    question: "Can I paste links from Google Sheets?",
    answer:
      "Yes. Copy columns headed section, title, url and description into Import links. The description column is optional. Rows are appended to matching sections. Use Optional as a section name for secondary resources.",
  },
  {
    question: "Can I use paths like /pricing?",
    answer:
      "Enter your website URL in Site details. The editor resolves paths from that website’s root. Use a full HTTPS URL for documentation hosted on another domain.",
  },
  {
    question: "What does marking a section optional do?",
    answer:
      "Its links are collected under one final heading named Optional. This follows the convention for resources a reader can skip when a shorter context is needed.",
  },
  {
    question: "Where do I publish the download?",
    answer:
      "Serve the file as plain text at /llms.txt on your own domain. In a Next.js project hosted at the domain root, save it as public/llms.txt and deploy. Open the public URL to check that it serves the text file.",
  },
  {
    question: "Does this guarantee AI citations?",
    answer:
      "The file is a curated guide. Each platform decides whether and how to use it. The generator checks the entries you supply locally. It does not crawl the URLs or check their HTTP status.",
  },
];

const sample = {
  name: "Cedar Analytics",
  site: "https://example.com",
  summary: "Revenue reporting software for B2B teams using HubSpot.",
  context:
    "Start with Product for plans and capabilities. Use Documentation for setup and integration details.",
  sections: [
    {
      id: "product",
      name: "Product",
      optional: false,
      links: [
        {
          id: "overview",
          title: "Product overview",
          url: "/product",
          description: "Account-level reporting and supported CRM workflows.",
        },
        {
          id: "pricing",
          title: "Pricing",
          url: "/pricing",
          description: "Plan limits, billing periods and included seats.",
        },
      ],
    },
    {
      id: "docs",
      name: "Documentation",
      optional: false,
      links: [
        {
          id: "integration",
          title: "HubSpot setup",
          url: "/docs/hubspot",
          description: "Connect your CRM and map deal stages.",
        },
      ],
    },
    {
      id: "extra",
      name: "Resources",
      optional: true,
      links: [
        {
          id: "glossary",
          title: "Reporting glossary",
          url: "/resources/glossary",
          description: "Definitions used in pipeline reports.",
        },
      ],
    },
  ],
};
const empty = { name: "", site: "", summary: "", context: "", sections: [] };
const newLink = (id) => ({ id, title: "", url: "", description: "" });
const line = (text) => text.trim().replace(/\s+/g, " ");
const markdown = (text) => line(text).replace(/[\\`*_\[\]<>#]/g, "\\$&");

function parseAddress(value, origin) {
  const input = value.trim();
  if (!input || /[\s\\]/.test(input)) throw Error();
  const relative = input.startsWith("/") && !input.startsWith("//");
  if (!relative && !/^https?:\/\//i.test(input)) throw Error();
  const parsed = relative ? new URL(input, origin) : new URL(input);
  if (!parsed.hostname || parsed.username || parsed.password) throw Error();
  return parsed;
}

function renderFile(draft) {
  const issues = [],
    blocks = [],
    optionalLinks = [],
    seen = new Set();
  let base,
    count = 0;
  if (draft.name.trim()) blocks.push("# " + markdown(draft.name));
  else issues.push("Enter a company or product name.");
  if (draft.site.trim()) {
    try {
      base = parseAddress(draft.site).origin;
    } catch {
      issues.push("Use a full HTTP or HTTPS website URL.");
    }
  }
  if (draft.summary.trim()) blocks.push("> " + markdown(draft.summary));
  if (draft.context.trim())
    blocks.push(
      draft.context
        .trim()
        .split(/\n\s*\n/)
        .map(markdown)
        .join("\n\n"),
    );
  draft.sections.forEach((section, index) => {
    const label = line(section.name);
    if (!label) issues.push("Give section " + (index + 1) + " a name.");
    const links = [];
    section.links.forEach((link, i) => {
      const where = (label || "Section " + (index + 1)) + ", link " + (i + 1);
      if (!link.title.trim() || !link.url.trim()) {
        issues.push(where + " needs a title and URL.");
        return;
      }
      let url;
      try {
        url = parseAddress(link.url, base);
      } catch {
        issues.push(
          where + " needs a full URL, or a /path and a valid website URL.",
        );
        return;
      }
      if (seen.has(url.href)) {
        issues.push(where + " repeats " + url.href);
        return;
      }
      seen.add(url.href);
      const destination = url.href.replace(/\(/g, "%28").replace(/\)/g, "%29");
      links.push(
        "- [" +
          markdown(link.title) +
          "](" +
          destination +
          ")" +
          (link.description.trim() ? ": " + markdown(link.description) : ""),
      );
      count++;
    });
    if (links.length) {
      if (section.optional || label.toLowerCase() === "optional")
        optionalLinks.push(...links);
      else if (label)
        blocks.push("## " + markdown(label) + "\n\n" + links.join("\n"));
    }
  });
  if (optionalLinks.length)
    blocks.push("## Optional\n\n" + optionalLinks.join("\n"));
  return {
    text: blocks.join("\n\n") + (blocks.length ? "\n" : ""),
    issues,
    count,
    base,
  };
}

function parseImport(raw) {
  const parsed = Papa.parse(raw.trim(), {
    header: true,
    skipEmptyLines: "greedy",
    delimitersToGuess: [",", "\t"],
    transformHeader: (h) => h.trim().toLowerCase(),
    transform: (v) => v.trim(),
  });
  if (
    parsed.errors.length ||
    !["section", "title", "url"].every((h) => parsed.meta.fields?.includes(h))
  )
    throw Error(
      "Use headers section, title and url, plus description if needed. Quote CSV values containing commas.",
    );
  if (!parsed.data.length)
    throw Error("Include at least one row below the headers.");
  parsed.data.forEach((r, i) => {
    if (!r.section || !r.title || !r.url)
      throw Error(
        "Complete the section, title and URL on data row " + (i + 1) + ".",
      );
  });
  return parsed.data;
}

function Field({ label, value, onChange, area = false, placeholder }) {
  const props = {
    value,
    onChange: (e) => onChange(e.target.value),
    placeholder,
  };
  return (
    <label className="field" style={{ display: "block" }}>
      <span
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 650,
          marginBottom: 5,
        }}
      >
        {label}
      </span>
      {area ? <textarea {...props} rows={3} /> : <input {...props} />}
    </label>
  );
}

export default function LlmsTxtGenerator() {
  const [draft, setDraft] = useState(sample),
    [dirty, setDirty] = useState(false);
  const [importOpen, setImportOpen] = useState(false),
    [paste, setPaste] = useState(""),
    [importError, setImportError] = useState("");
  const [notice, setNotice] = useState("");
  const seq = useRef(0);
  const id = () => "edit-" + ++seq.current;
  const result = renderFile(draft);
  const ready = result.issues.length === 0;
  const size = new TextEncoder().encode(result.text).length;

  function change(patch) {
    setDraft({ ...draft, ...patch });
    setDirty(true);
    setNotice("");
  }
  function sections(next) {
    change({ sections: next });
  }
  function editSection(key, patch) {
    sections(
      draft.sections.map((s) => (s.id === key ? { ...s, ...patch } : s)),
    );
  }
  function editLink(section, key, patch) {
    editSection(section.id, {
      links: section.links.map((l) => (l.id === key ? { ...l, ...patch } : l)),
    });
  }
  function move(index, step) {
    const next = [...draft.sections];
    [next[index], next[index + step]] = [next[index + step], next[index]];
    sections(next);
  }
  function reset(next) {
    if (
      (dirty || paste.trim()) &&
      !window.confirm("Replace the current draft?")
    )
      return;
    setDraft(next);
    setDirty(false);
    setNotice("");
    setPaste("");
    setImportError("");
    setImportOpen(false);
  }
  function importLinks() {
    try {
      const incoming = parseImport(paste);
      const next = draft.sections.map((s) => ({ ...s, links: [...s.links] }));
      for (const row of incoming) {
        const key = line(row.section).toLowerCase();
        let section = next.find((s) => line(s.name).toLowerCase() === key);
        if (!section) {
          section = {
            id: id(),
            name: line(row.section),
            optional: key === "optional",
            links: [],
          };
          next.push(section);
        }
        section.links.push({
          id: id(),
          title: row.title,
          url: row.url,
          description: row.description || "",
        });
      }
      sections(next);
      setPaste("");
      setImportError("");
      setImportOpen(false);
      setNotice("Imported " + incoming.length + " links.");
    } catch (e) {
      setImportError(e.message);
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(result.text);
      setNotice("File contents copied.");
    } catch {
      setNotice(
        "Clipboard unavailable. Download the file or select the preview text.",
      );
    }
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([result.text], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "llms.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    setNotice("Downloaded llms.txt.");
  }

  return (
    <div className="studio">
      <section className="panel editor">
        <h2>Your site</h2>
        <p className="intro">
          Choose the pages you want readers to start with. Add a short note
          explaining what each page covers.
        </p>
        <div className="actions">
          <button onClick={() => reset(sample)}>B2B SaaS example</button>
          <button onClick={() => reset(empty)}>Start blank</button>
        </div>
        <fieldset>
          <legend>Site details</legend>
          <Field
            label="Company or product name"
            value={draft.name}
            onChange={(name) => change({ name })}
          />
          <Field
            label="Website URL"
            placeholder="https://yourcompany.com"
            value={draft.site}
            onChange={(site) => change({ site })}
          />
          <Field
            label="One-line summary"
            value={draft.summary}
            onChange={(summary) => change({ summary })}
          />
          <Field
            label="More context (optional)"
            area
            value={draft.context}
            onChange={(context) => change({ context })}
          />
        </fieldset>
        <div className="heading">
          <h3>Sections and links</h3>
          <button
            onClick={() => setImportOpen(!importOpen)}
            aria-expanded={importOpen}
          >
            Import links
          </button>
        </div>
        {importOpen && (
          <div className="importBox">
            <Field
              area
              label="Paste CSV or Google Sheets rows"
              placeholder={
                "section,title,url,description\nProduct,Pricing,/pricing,Plans and limits"
              }
              value={paste}
              onChange={(v) => {
                setPaste(v);
                setImportError("");
              }}
            />
            <p>
              Include the headers section, title and url. Imported links are
              added to matching sections.
            </p>
            <button onClick={importLinks}>Add imported links</button>
            {importError && <p role="alert">{importError}</p>}
          </div>
        )}
        {draft.sections.map((s, i) => (
          <fieldset key={s.id}>
            <legend>{s.name.trim() || "New section"}</legend>
            <Field
              label="Section name"
              value={s.name}
              onChange={(name) => editSection(s.id, { name })}
            />
            <label className="check">
              <input
                type="checkbox"
                checked={s.optional}
                onChange={(e) =>
                  editSection(s.id, { optional: e.target.checked })
                }
              />{" "}
              List these links under Optional
            </label>
            <div className="actions compact">
              <button disabled={i === 0} onClick={() => move(i, -1)}>
                Move up
              </button>
              <button
                disabled={i === draft.sections.length - 1}
                onClick={() => move(i, 1)}
              >
                Move down
              </button>
              <button
                onClick={() => {
                  if (
                    !s.links.length ||
                    window.confirm("Remove this section and its links?")
                  )
                    sections(draft.sections.filter((x) => x.id !== s.id));
                }}
              >
                Remove section
              </button>
            </div>
            {s.links.map((l, j) => (
              <div key={l.id} className="linkBox">
                <div className="heading">
                  <strong>Link {j + 1}</strong>
                  <button
                    onClick={() =>
                      editSection(s.id, {
                        links: s.links.filter((x) => x.id !== l.id),
                      })
                    }
                  >
                    Remove link
                  </button>
                </div>
                <Field
                  label="Page title"
                  value={l.title}
                  onChange={(title) => editLink(s, l.id, { title })}
                />
                <Field
                  label="URL or /path"
                  value={l.url}
                  onChange={(url) => editLink(s, l.id, { url })}
                />
                <Field
                  label="Description (optional)"
                  value={l.description}
                  onChange={(description) => editLink(s, l.id, { description })}
                />
              </div>
            ))}
            <button
              onClick={() =>
                editSection(s.id, { links: [...s.links, newLink(id())] })
              }
            >
              + Add link
            </button>
          </fieldset>
        ))}
        <button
          className="add"
          onClick={() =>
            sections([
              ...draft.sections,
              { id: id(), name: "", optional: false, links: [newLink(id())] },
            ])
          }
        >
          + Add a section
        </button>
      </section>
      <section className="panel output">
        <h2>Your llms.txt</h2>
        <div className="fileHead">
          <strong>/llms.txt</strong>
          <span>
            {result.count} {result.count === 1 ? "link" : "links"} ·{" "}
            {size.toLocaleString("en-GB")} bytes
          </span>
        </div>
        <pre tabIndex={0} aria-label="Live file preview">
          {result.text || "Your file preview will appear here."}
        </pre>
        {result.issues.length > 0 && (
          <div className="issues">
            <strong>Before exporting</strong>
            <ul>
              {result.issues.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="actions">
          <button disabled={!ready} onClick={copy}>
            Copy contents
          </button>
          <button className="primary" disabled={!ready} onClick={download}>
            Download llms.txt
          </button>
        </div>
        <p>
          Publish at{" "}
          <code>
            {(result.base || "https://your-domain.com") + "/llms.txt"}
          </code>
          .
        </p>
        <small role="status">{notice}</small>
      </section>
      <style jsx>{`
        .studio {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
          gap: 22px;
          align-items: start;
        }
        .panel {
          min-width: 0;
        }
        .intro,
        .importBox p,
        .output p {
          font-size: 14px;
          line-height: 1.6;
          margin: 10px 0;
        }
        .intro {
          color: #486661;
        }
        .actions,
        .heading,
        .fileHead,
        .check {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .actions {
          flex-wrap: wrap;
          margin: 15px 0;
        }
        .heading,
        .fileHead {
          justify-content: space-between;
          flex-wrap: wrap;
        }
        .editor > .heading {
          margin-top: 24px;
        }
        button {
          background: #fff;
          color: #105852;
          border: 1px solid #bfd3ca;
          border-radius: 6px;
          padding: 8px 12px;
          font: inherit;
          font-size: 12px;
          font-weight: 650;
          cursor: pointer;
        }
        button:disabled {
          opacity: 0.45;
          cursor: default;
        }
        fieldset {
          min-width: 0;
          border: 1px solid #caddd5;
          border-radius: 10px;
          margin: 16px 0;
          padding: 12px 16px 17px;
        }
        legend {
          padding: 0 6px;
          color: #167273;
          font-weight: 680;
        }
        .check {
          font-size: 12px;
          margin: 12px 0;
        }
        .check input {
          accent-color: #167273;
        }
        .compact button,
        .linkBox button {
          font-size: 11px;
          padding: 5px 8px;
        }
        .linkBox,
        .importBox {
          background: #eef4f3;
          padding: 13px;
          margin: 12px 0;
          border-radius: 8px;
        }
        .linkBox strong {
          font-size: 13px;
        }
        .add {
          width: 100%;
          border-style: dashed;
        }
        .output {
          background: #093637;
          color: #f0faf5;
          position: sticky;
          top: 16px;
        }
        .fileHead {
          margin: 20px 0 0;
          padding: 10px 13px;
          background: #1a4b46;
          border-radius: 8px 8px 0;
          font:
            12px ui-monospace,
            monospace;
        }
        pre {
          margin: 0;
          max-height: 50vh;
          overflow: auto;
          padding: 15px;
          background: #06292a;
          border-radius: 0 0 8px 8px;
          color: #d6f4e4;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
          font:
            13px/1.6 ui-monospace,
            monospace;
        }
        .primary {
          background: #b8f3d9;
        }
        .output p,
        .output small {
          color: #d4e5db;
          overflow-wrap: anywhere;
        }
        .issues {
          font-size: 13px;
          color: #ffdfac;
          margin-top: 12px;
        }
        .issues ul {
          margin: 3px 0;
          padding-left: 20px;
        }
        .issues li {
          overflow-wrap: anywhere;
        }
        @media (max-width: 800px) {
          .studio {
            grid-template-columns: 1fr;
          }
          .output {
            position: static;
          }
        }
      `}</style>
    </div>
  );
}
