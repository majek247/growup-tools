# GrowUp Toolkit

A Next.js directory with 12 browser-based SEO and content tools. The directory lives at /tools/ and each tool has a permanent page. The root URL also displays the directory and points its canonical link to /tools/.

## Run locally

Use Node.js 22 or later. From the extracted growup-toolkit folder:

```sh
npm ci
npm run dev
```

Open http://localhost:3000/tools/. No credentials or external services are required.

## Edit

| File | What to change |
| --- | --- |
| lib/catalog.mjs | Tool names, unique metadata, categories, example fields and FAQs |
| lib/run.mjs | Calculations, CSV validation and generated outputs |
| components/Directory.jsx | Directory, featured example and filters |
| components/Workbench.jsx | Inputs, live results, copy and download controls |
| pages/tools/[slug].jsx | Individual tool page, FAQs and related links |
| components/Layout.jsx | Navigation, footer and shared SEO tags |
| styles/site.css | Brand palette, typography, cards and responsive layouts |

When adding a tool, add its catalogue record and calculation, then extend the examples in tests/tools.test.mjs. Tool icons follow catalogue order in Directory.jsx. The featured revenue example uses the first calculator’s defaults.

## Build and preview

```sh
npm test
npm run build
python3 -m http.server 8080 --directory out
```

Visit http://localhost:8080/tools/. A ready-built out/ folder is included in the ZIP for this preview. The production build writes HTML, fonts, JavaScript, robots.txt and sitemap.xml. Tool content and FAQs are in the HTML. JavaScript handles inputs and filters.

## Hosting

For a standalone domain set NEXT_PUBLIC_SITE_URL to that domain's origin before building. The default origin is https://www.seo-growup.com. Set NEXT_PUBLIC_BASE_PATH only when the entire exported project is hosted under an additional path, for example /growup-toolkit on a repository Pages site. Use an empty base path for a dedicated domain. The directory already includes /tools/ in its route.

**GitHub Pages.** Put the contents of the project folder at the repository root, enable GitHub Actions under Settings → Pages, then manually run the included Publish toolkit to GitHub Pages workflow. It derives the production origin and path from GitHub Pages and publishes the export.

**Existing GrowUp website.** The export includes a root index. To serve only /tools/ on a shared domain, integrate the exported tools/ and _next/ paths with the existing host and merge sitemap entries into the existing sitemap. Keep the main site's homepage and robots.txt in place. A dedicated tools subdomain can serve the whole export.

## Working with results

CSV tools accept headers and quoted fields, including values with commas. Replace example rows with your own data. Inputs are processed locally and reset when you leave the page. Directory search and filters are shareable via the address bar. Results can be copied or downloaded. Financial estimates use GBP. SERP previews use draft text, and AI visibility uses manually recorded responses.
