import { writeFileSync } from "node:fs";
import nextEnv from "@next/env";
import { tools } from "../lib/catalog.mjs";
nextEnv.loadEnvConfig(process.cwd());
const { absolute } = await import("../lib/site.mjs");
const paths = ["/", ...tools.map((t) => "/" + t.slug + "/")];
const xml = paths
  .map((path) => "<url><loc>" + absolute(path) + "</loc></url>")
  .join("\n");
writeFileSync(
  "public/sitemap.xml",
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    xml +
    "\n</urlset>",
);
writeFileSync(
  "public/robots.txt",
  "User-agent: *\nAllow: /\nSitemap: " + absolute("/sitemap.xml") + "\n",
);
writeFileSync("public/.nojekyll", "");
