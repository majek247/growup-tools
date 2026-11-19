import Link from "next/link";
import Head from "next/head";
import { ArrowUpRight, Layers3 } from "lucide-react";
import { absolute } from "../lib/site.mjs";
export default function Layout({ title, description, path, children }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={absolute(path)} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={absolute(path)} />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#083b39" />
      </Head>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header>
        <div className="wrap nav">
          <a className="brand" href="https://www.seo-growup.com/">
            <span className="mark" aria-hidden="true" />
            GrowUp
          </a>
          <span className="navDivider" />
          <Link className="toolkit" href="/tools/">
            <Layers3 size={16} /> Toolkit
          </Link>
          <a className="navCta" href="https://customseoplan.seo-growup.com/">
            Get my free SEO plan <ArrowUpRight size={16} />
          </a>
        </div>
      </header>
      <main id="main">{children}</main>
      <footer>
        <div className="wrap foot">
          <b>GrowUp</b>
          <span>B2B SaaS SEO &amp; content</span>
          <Link href="/tools/">All tools ↑</Link>
        </div>
      </footer>
    </>
  );
}
