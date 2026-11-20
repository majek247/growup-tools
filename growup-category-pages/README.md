# GrowUp – dedicated tool category pages

This package uses your existing **Next.js Pages Router** and **components/Layout.jsx**.

## Install

Copy these files into your project, preserving their paths:

- `components/ToolCategoryPage.jsx`
- `pages/tools/revenue-planning.jsx`
- `pages/tools/ai-search.jsx`
- `pages/tools/technical-seo.jsx`
- `pages/tools/agency-hiring.jsx`
- `pages/tools/content-operations.jsx`

The existing files `pages/tools/[slug].jsx`, `pages/tools/index.jsx`, `lib/catalog.mjs`, and your tool components stay unchanged.

Then run `npm run dev` or your standard build command.

## URLs

- `/tools/revenue-planning/`
- `/tools/ai-search/`
- `/tools/technical-seo/`
- `/tools/agency-hiring/`
- `/tools/content-operations/`

Each page reads your existing `tools` catalog and automatically filters by the same `topic` names used in the catalog. Static pages take priority over your existing `[slug].jsx` route, so current tool URLs remain usable.

## Make the five tabs on `/tools/` into links

The directory file is `components/Directory.jsx` (confirmed by `pages/tools/index.jsx`), **not** `components/tools/Directory.jsx`. Its code was not included in the upload, so no safe automatic patch is provided.

In that file, replace the FIVE category filter buttons with links to the URLs above; keep `All topics` as a link to `/tools/#directory`. Example:

```jsx
import Link from "next/link";

const CATEGORY_LINKS = [
  { name: "Revenue planning", href: "/tools/revenue-planning/" },
  { name: "AI search", href: "/tools/ai-search/" },
  { name: "Technical SEO", href: "/tools/technical-seo/" },
  { name: "Agency hiring", href: "/tools/agency-hiring/" },
  { name: "Content Operations", href: "/tools/content-operations/" },
];

// Put this inside your EXISTING category tabs container:
<Link href="/tools/#directory">All topics</Link>
{CATEGORY_LINKS.map(({ name, href }) => (
  <Link key={href} href={href}>{name}</Link>
))}
```

Keep the directory's existing classes on the links to preserve its original styling. If you want an exact copy-paste patch for that file, provide `components/Directory.jsx`.

## Notes

- Your catalog currently includes some `Content strategy` tools but excludes those marked retired in `hiringCatalog.mjs`. These pages map exactly to your five requested tabs; no new sixth category is created.
- Category SEO titles and descriptions live in `components/ToolCategoryPage.jsx`.
- Featured cards reference actual slugs from your uploaded catalog.
- No duplicate site header/footer or per-tool FAQ is rendered.
- The styling is scoped with `gtc-` class names and requires no extra packages beyond the project's existing `lucide-react` dependency.
