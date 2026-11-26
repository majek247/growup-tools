// Place at pages/api/serp-inspect.js (Next.js Pages Router).
// Server-side fetch is required because browsers cannot reliably read
// arbitrary sites' HTML due to cross-origin restrictions.
import dns from "node:dns/promises";
import net from "node:net";

const privateIPv4 = (ip) => {
  const [a, b] = ip.split(".").map(Number);
  return a === 0 || a === 10 || a === 127 || a >= 224 ||
    (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) ||
    (a === 192 && b === 0) || (a === 198 && (b === 18 || b === 19));
};
const privateIPv6 = (ip) => {
  const v = ip.toLowerCase();
  return v === "::" || v === "::1" || v.startsWith("fc") || v.startsWith("fd") ||
    /^fe[89ab]/.test(v) || v.startsWith("::ffff:") || v.startsWith("2001:db8:");
};

async function validatePublicUrl(value) {
  let u;
  try { u = new URL(value); } catch { throw new Error("Enter a valid website URL."); }
  if (!["http:", "https:"].includes(u.protocol)) throw new Error("Only HTTP and HTTPS URLs are supported.");
  if (u.username || u.password) throw new Error("URLs with credentials are not supported.");
  if (u.port && !["80", "443"].includes(u.port)) throw new Error("Custom ports are not supported.");
  if (net.isIP(u.hostname) || /(^localhost$|\.localhost$|\.local$|\.internal$)$/i.test(u.hostname)) {
    throw new Error("Only public domain names can be inspected.");
  }
  const addresses = await dns.lookup(u.hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(({ address, family }) =>
    family === 4 ? privateIPv4(address) : privateIPv6(address)
  )) throw new Error("This domain does not resolve to a permitted public address.");
  return u;
}

function decode(value = "") {
  return value.replace(/&(?:amp|lt|gt|quot|apos|nbsp|#(\d+)|#x([\da-f]+));/gi, (match, decimal, hex) => {
    if (decimal || hex) {
      const n = parseInt(decimal || hex, hex ? 16 : 10);
      return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : match;
    }
    return { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'", "&nbsp;": " " }[match.toLowerCase()] || match;
  }).replace(/\s+/g, " ").trim();
}
function attributes(tag) {
  const attrs = {};
  for (const m of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    attrs[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? "";
  }
  return attrs;
}
function metaValue(html, key, value) {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const a = attributes(match[0]);
    if (a[key]?.toLowerCase() === value.toLowerCase()) return decode(a.content);
  }
  return "";
}
function canonicalValue(html, url) {
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const a = attributes(match[0]);
    if ((a.rel || "").toLowerCase().split(/\s+/).includes("canonical") && a.href) {
      try { return new URL(a.href, url).href; } catch { return ""; }
    }
  }
  return "";
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed." });
  const raw = typeof req.query.url === "string" ? req.query.url : "";
  if (raw.length > 2048) return res.status(400).json({ error: "URL is too long." });
  try {
    let target = await validatePublicUrl(raw);
    let response;
    for (let redirects = 0; redirects <= 2; redirects++) {
      response = await fetch(target, {
        redirect: "manual",
        headers: { "user-agent": "Mozilla/5.0 (compatible; GrowUpSERPInspector/1.0)", accept: "text/html,application/xhtml+xml" },
        signal: AbortSignal.timeout(9000),
      });
      if (![301, 302, 303, 307, 308].includes(response.status)) break;
      if (redirects === 2) throw new Error("Too many redirects.");
      const location = response.headers.get("location");
      if (!location) throw new Error("Redirect was missing a destination.");
      target = await validatePublicUrl(new URL(location, target).href);
    }
    const type = response.headers.get("content-type") || "";
    if (!/text\/html|application\/xhtml\+xml/i.test(type)) throw new Error("This URL did not return an HTML page.");
    if (Number(response.headers.get("content-length")) > 750000) throw new Error("Page is too large to inspect.");
    const reader = response.body?.getReader();
    if (!reader) throw new Error("Unable to read the page.");
    const parts = []; let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 750000) { await reader.cancel(); throw new Error("Page is too large to inspect."); }
      parts.push(value);
    }
    const html = new TextDecoder().decode(Buffer.concat(parts.map(p => Buffer.from(p))));
    const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/i);
    const title = decode(titleMatch?.[1] || "");
    const description = metaValue(html, "name", "description");
    const robots = [metaValue(html, "name", "robots"), metaValue(html, "name", "googlebot"), response.headers.get("x-robots-tag") || ""].join(",");
    return res.status(200).json({
      status: response.status,
      finalUrl: target.href,
      title,
      description,
      canonical: canonicalValue(html, target.href),
      robots,
      noindex: /(?:^|[,\s])noindex(?:[,\s]|$)/i.test(robots),
      ogTitle: metaValue(html, "property", "og:title"),
      ogDescription: metaValue(html, "property", "og:description"),
    });
  } catch (error) {
    return res.status(422).json({ error: error?.message || "Unable to inspect this page." });
  }
}
