export const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const origin = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.seo-growup.com"
).replace(/\/$/, "");
export const absolute = (path) => origin + base + path;
