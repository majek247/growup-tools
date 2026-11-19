import { useState } from "react";
import { Copy, Download, RotateCcw } from "lucide-react";
import { run } from "../../lib/run.mjs";

export const faqs = [
  {
    question: "Will Google display this exact title and description?",
    answer:
      "Google can generate a different title or snippet depending on the query and the content of your page. Use the preview to check whether your main selling point is clear and appears early enough to be seen.",
  },
  {
    question: "Why does my title fit on desktop but wrap on mobile?",
    answer:
      "The mobile preview has less horizontal space. Two titles with the same character count can also take up different widths. Switch between both previews to check which words a reader sees first.",
  },
  {
    question: "Does entering a URL pull in the page’s existing meta tags?",
    answer:
      "The URL sets the address shown in the preview. Paste your current title and meta description into the fields to review them, or enter a new draft to see how it reads before publishing.",
  },
  {
    question: "How do I publish the title and description I’ve drafted?",
    answer:
      "Copy your finished snippet, then enter the title and description into the corresponding SEO fields in your CMS. If you manage the HTML directly, update the page’s title element and meta description tag.",
  },
];

export default function SerpSnippetPreview({ tool }) {
  // Use the same example values as the tool directory and tests.
  const example = Object.fromEntries(
    tool.fields.map(({ key, value }) => [key, value])
  );

  const [draft, setDraft] = useState(example);
  const [device, setDevice] = useState("Desktop");
  const [notice, setNotice] = useState("");

  // Reuse the existing URL validation and export format.
  let result;
  let error;

  try {
    result = run(tool, draft);
  } catch (err) {
    error = err.message;
  }

  function update(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
    setNotice("");
  }

  function resetExample() {
    setDraft(example);
    setDevice("Desktop");
    setNotice("Example restored.");
  }

  async function copyResult() {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result.text);
      setNotice("Snippet copied.");
    } catch {
      setNotice("Clipboard access is unavailable. Use Download to save your snippet.");
    }
  }

  function downloadResult() {
    if (!result) return;

    const blob = new Blob([result.text], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "serp-snippet.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
    setNotice("Download started.");
  }

  return (
    <div className="bench">
      <section className="panel" aria-labelledby="snippet-inputs">
        <div className="panelHead">
          <h2 id="snippet-inputs">Your page details</h2>

          <button type="button" className="plain" onClick={resetExample}>
            <RotateCcw size={14} aria-hidden="true" />
            Reset example
          </button>
        </div>

        <p className="muted">
          Enter the URL, title and description you plan to publish.
          The preview updates as you type.
        </p>

        <div className="field">
          <label htmlFor="snippet-url">Page URL</label>
          <input
            id="snippet-url"
            type="url"
            spellCheck={false}
            placeholder="https://example.com/your-page"
            value={draft.url}
            onChange={(event) => update("url", event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="snippet-title">Page title</label>
          <input
            id="snippet-title"
            type="text"
            value={draft.title}
            onChange={(event) => update("title", event.target.value)}
            aria-describedby="snippet-title-count"
          />
          <small id="snippet-title-count" className="muted">
            {draft.title.trim().length} characters
          </small>
        </div>

        <div className="field">
          <label htmlFor="snippet-description">Meta description</label>
          <textarea
            id="snippet-description"
            rows={4}
            value={draft.description}
            onChange={(event) => update("description", event.target.value)}
            aria-describedby="snippet-description-count"
          />
          <small id="snippet-description-count" className="muted">
            {draft.description.trim().length} characters
          </small>
        </div>
      </section>

      <section className="panel resultPanel" aria-labelledby="snippet-output">
        <h2 id="snippet-output">Search result preview</h2>

        <div className="pills" role="group" aria-label="Preview device">
          {["Desktop", "Mobile"].map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={device === option}
              onClick={() => setDevice(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {error ? (
          <p className="error" role="status">{error}</p>
        ) : (
          <>
            <div className={`snippet ${device}`}>
              <small>{result.url}</small>
              <strong>{result.title}</strong>
              <p>{result.description}</p>
            </div>

            <p className="muted">
              This preview uses your draft. The title and description shown
              in search can vary by query and device.
            </p>

            <div className="outputActions">
              <button type="button" className="button dark" onClick={copyResult}>
                <Copy size={15} aria-hidden="true" />
                Copy snippet
              </button>

              <button type="button" className="secondary" onClick={downloadResult}>
                <Download size={15} aria-hidden="true" />
                Download
              </button>
            </div>
          </>
        )}

        <small role="status">{notice}</small>
      </section>
    </div>
  );
}