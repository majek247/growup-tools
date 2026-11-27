
/**
 * GrowUp SEO Agency Brief — Branded PDF Preview
 * Browser-only. No additional dependencies.
 */

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));

function inlineMarkdown(text) {
  return escapeHtml(text).replace(
    /\*\*([^*]+)\*\*/g,
    "<strong>$1</strong>"
  );
}

function formatSection(body) {
  const blocks = String(body || "")
    .split(/\n\s*\n/g)
    .map((s) => s.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      const lines = block
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      return lines
        .map((line) => {
          const match = line.match(
            /^\*\*([^*]+):\*\*\s*([\s\S]*)$/
          );

if (match) {
  const label = match[1].trim();
  const answer = (match[2] || "Not provided").trim();

  return `
    <div class="item">
      <div class="label">${escapeHtml(label)}</div>
      <div class="value">${inlineMarkdown(answer)}</div>
    </div>
  `;
}


          if (/^\*\*[^*]+\*\*$/.test(line)) {
            return `<h3 class="subhead">${inlineMarkdown(line)}</h3>`;
          }

          if (/^[-•]\s+/.test(line)) {
            return `
              <div class="bullet">
                ${inlineMarkdown(line.replace(/^[-•]\s+/, ""))}
              </div>
            `;
          }

          return `<p class="para">${inlineMarkdown(line)}</p>`;
        })
        .join("");
    })
    .join("");
}

function htmlDocument(company, sections) {
  const safeCompany = escapeHtml(
    company?.trim() || "Company"
  );

  const date = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const sectionHtml = sections
    .map(
      ({ title, body }) => `
        <section class="section">
          <h2>${escapeHtml(title)}</h2>
          <div class="content">${formatSection(body)}</div>
        </section>
      `
    )
    .join("");

  return `
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>

<title>${safeCompany} — SEO agency brief</title>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');

:root {
  --dark: #073b3b;
  --teal: #167273;
  --ink: #011522;
  --line: #d6e5e1;
  --pale: #eef4f3;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #eaf0ee;
  color: var(--ink);
  font-family: Montserrat, Arial, sans-serif;
  font-size: 11px;
  line-height: 1.65;
}

/* Preview toolbar */

.toolbar {
  position: sticky;
  top: 0;
  z-index: 5;
  background: #fff;
  border-bottom: 1px solid var(--line);
  padding: 11px max(20px, calc((100vw - 790px)/2));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 2px 14px #01152210;
}

.toolbar strong {
  font-size: 12px;
  color: var(--dark);
}

.toolbar small {
  display: block;
  color: #5b7771;
  font-size: 10px;
}

.toolbar button {
  border: 0;
  border-radius: 7px;
  background: var(--teal);
  color: white;
  padding: 11px 17px;
  font: 700 12px Montserrat, Arial, sans-serif;
  cursor: pointer;
}

.toolbar button:hover {
  background: #105e60;
}

/* Document */

.sheet {
  width: min(100%, 794px);
  margin: 26px auto 38px;
  background: white;
  box-shadow: 0 10px 40px #01152220;
  min-height: 1050px;
}

/* Branded document header */

.cover {
  background: var(--dark);
  color: white;
  padding: 48px 53px 40px;
  position: relative;
  overflow: hidden;
}

.cover:after {
  content: "";
  position: absolute;
  right: -100px;
  top: -115px;
  width: 380px;
  height: 380px;
  border: 1px solid #ffffff20;
  border-radius: 50%;
  box-shadow:
    0 0 0 52px #ffffff06,
    0 0 0 104px #ffffff06;
}

.brand {
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.6px;
  position: relative;
  z-index: 1;
}

.brand small {
  display: inline-block;
  margin-left: 10px;
  padding-left: 10px;
  border-left: 1px solid #ffffff50;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.2px;
  color: #a9e9dc;
  vertical-align: middle;
}

.overline {
  margin: 28px 0 5px;
  color: #93ddcd;
  font-size: 9px;
  letter-spacing: 1.8px;
  font-weight: 800;
  text-transform: uppercase;
  position: relative;
  z-index: 1;
}

h1 {
  font-size: 32px;
  line-height: 1.18;
  letter-spacing: -1.5px;
  margin: 7px 0 15px;
  font-weight: 800;
  position: relative;
  z-index: 1;
}

.company {
  font-size: 16px;
  font-weight: 600;
  color: #d7f3ec;
  position: relative;
  z-index: 1;
}

.cover-footer {
  margin-top: 30px;
  border-top: 1px solid #ffffff3d;
  padding-top: 13px;
  font-size: 9px;
  color: #badbd3;
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

/* Main document sections */

.main {
  padding: 29px 53px 52px;
}

.section {
  margin-bottom: 26px;
  break-inside: auto;
}

.section h2 {
  color: var(--dark);
  font-size: 15px;
  letter-spacing: -0.35px;
  margin: 0 0 16px;
  padding: 0 0 9px;
  border-bottom: 1px solid #bbd7ce;
  break-after: avoid;
}

/* Field labels and answers */


.item {
  display: grid;
  grid-template-columns: 175px minmax(0, 1fr);
  align-items: start;
  column-gap: 18px;
  padding: 11px 0;
  border-bottom: 1px solid #e9f0ed;
  break-inside: avoid;
}



.label {
  color: #5a7971;
  font-size: 9.5px;
  font-weight: 700;
  line-height: 1.65;
  text-align: left;
  align-self: start;
}




.value {
  display: block;
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0;
  color: #173d38;
  font-size: 10px;
  line-height: 1.65;
  text-align: left;
  text-indent: 0;
  justify-self: stretch;
  align-self: start;
  overflow-wrap: anywhere;
  white-space: pre-line;
}



.value strong,
.para strong {
  color: var(--dark);
}

.subhead {
  font-size: 11px;
  color: var(--dark);
  margin: 15px 0 7px;
  break-after: avoid;
}

.para {
  margin: 8px 0;
  font-size: 10px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.bullet {
  padding: 5px 0 5px 13px;
  border-left: 2px solid #a4d7c9;
  margin: 5px 0;
  font-size: 10px;
  overflow-wrap: anywhere;
}

/* Footer */

.footer {
  margin-top: 30px;
  padding-top: 12px;
  border-top: 1px solid var(--line);
  color: #6d817c;
  font-size: 9px;
  display: flex;
  justify-content: space-between;
}


.footer a {
  color: #167273;
  text-decoration: none;
  font-weight: 700;
}

.footer a:hover {
  text-decoration: underline;
}


/* A4 PDF print settings */

@page {
  size: A4;
  margin: 12mm 10mm;
}

@media print {
  html,
  body {
    background: white !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .toolbar {
    display: none !important;
  }

  .sheet {
    width: 100%;
    margin: 0;
    box-shadow: none;
    min-height: 0;
  }

  .cover {
    padding: 24px 25px 23px;
  }

  .cover:after {
    display: none;
  }

  .overline {
    margin-top: 17px;
  }

  h1 {
    font-size: 25px;
  }

  .cover-footer {
    margin-top: 20px;
  }

  .main {
    padding: 22px 24px 12px;
  }

  .section {
    margin-bottom: 20px;
  }

  
.item {
  grid-template-columns: 175px minmax(0, 1fr);
  align-items: start;
  column-gap: 18px;
  padding: 9px 0;
}

.label,
.value {
  text-align: left !important;
  align-self: start;
}


  .footer {
    break-inside: avoid;
  }
}

/* Mobile preview */

@media (max-width: 650px) {
  .toolbar {
    padding: 10px 12px;
  }

  .sheet {
    margin: 0;
  }

  .cover {
    padding: 30px 22px;
  }

  .main {
    padding: 24px 22px;
  }

  .item {
    display: block;
  }

  .value {
    margin-top: 3px;
  }
}
</style>
</head>

<body>
  <div class="toolbar">
    <div>
      <strong>SEO agency brief · ${safeCompany}</strong>
      <small>Review the complete document before saving</small>
    </div>

    <button onclick="window.print()">
      Save as PDF / Print
    </button>
  </div>

  <article class="sheet">


<header class="cover">
  <div class="brand">
    ${safeCompany}
    <small>REQUEST FOR PROPOSAL</small>
  </div>

  <div class="overline">
    SEO AGENCY SELECTION
  </div>

  <h1>SEO Agency Brief</h1>
  <div class="company">${safeCompany}</div>

  <div class="cover-footer">
    <span>Prepared ${escapeHtml(date)}</span>
    <span>Confidential · For prospective agencies</span>
  </div>
</header>




    <main class="main">
      ${sectionHtml}


<div class="footer">
  <span>Confidential · Prepared for prospective SEO agencies</span>
  <span>
    Created with GrowUp ·
    <a
      href="https://www.seo-growup.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      seo-growup.com
    </a>
  </span>
</div>



    </main>
  </article>
</body>
</html>`;
}

/**
 * Open a new tab to review the finished document
 * before saving it as a PDF.
 */
export function openSeoBriefPrintPreview(company, sections) {
  const popup = window.open("", "_blank");

  if (!popup) {
    throw new Error(
      "Your browser blocked the preview window. Please allow popups for this site."
    );
  }

  const doc = htmlDocument(company, sections);

  popup.document.open();
  popup.document.write(doc);
  popup.document.close();
  popup.focus();
}
