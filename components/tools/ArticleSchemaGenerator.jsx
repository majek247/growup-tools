import SchemaStudio, {
  field,
  address,
  identifier,
  required,
  date,
} from "./SchemaStudio";
const groups = [
  {
    title: "Article details",
    fields: [
      field("type", "Article type", "select", [
        "BlogPosting",
        "Article",
        "NewsArticle",
      ]),
      field("headline", "Headline *"),
      field("url", "Canonical article URL *", "url"),
      field("images", "Image URLs (one per line)", "textarea"),
    ],
  },
  {
    title: "Byline and publication",
    fields: [
      field("author", "Author name *"),
      field("authorType", "Author type", "select", ["Person", "Organization"]),
      field("profile", "Author profile URL", "url"),
      field("publisher", "Publisher name"),
      field(
        "publisherId",
        "Publisher organization ID (URL with fragment)",
        "url",
      ),
      field("published", "Publication date *", "date"),
      field("updated", "Last modified date", "date"),
    ],
  },
];
const example = {
  type: "BlogPosting",
  headline: "How to trace organic demos back to content",
  url: "https://example.com/blog/organic-demos",
  author: "Alex Reed",
  authorType: "Person",
  publisher: "Cedar Metrics",
  publisherId: "https://example.com/#organization",
  images: "https://example.com/images/organic-demos.jpg",
  published: "2026-01-12",
  updated: "2026-02-03",
};
export const faqs = [
  {
    question: "Which type should I choose?",
    answer:
      "Use BlogPosting for a blog entry, NewsArticle for reporting, or Article for a general editorial piece.",
  },
  {
    question: "What if the post has never been updated?",
    answer:
      "Leave the modified date empty. When you enter an update, the generator checks it against the original publication date.",
  },
  {
    question: "Which images should I include?",
    answer:
      "Use accessible URLs for images that represent this article. Add one per line, including alternative crops when available.",
  },
];

export function build(v) {
  const url = address(required(v.url, "the article URL"), "article URL");
  const published = date(
    required(v.published, "the publication date"),
    "publication date",
  );
  const modified = date(v.updated, "last modified date");
  if (modified && modified < published)
    throw Error("The modified date is earlier than the publication date.");
  const images = [
    ...new Set(
      v.images
        .split(/\r?\n/)
        .filter((s) => s.trim())
        .map((s) => address(s, "an image")),
    ),
  ];
  const publisherId = address(v.publisherId, "publisher ID");
  if (publisherId && !v.publisher.trim())
    throw Error("Enter the publisher name for the supplied ID.");
  return {
    node: {
      "@type": v.type,
      "@id": identifier(url, "article"),
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      headline: required(v.headline, "the headline"),
      author: {
        "@type": v.authorType,
        name: required(v.author, "the author name"),
        url: address(v.profile, "author profile"),
      },
      publisher: v.publisher.trim()
        ? {
            "@type": "Organization",
            name: v.publisher.trim(),
            "@id": publisherId,
          }
        : undefined,
      datePublished: published,
      dateModified: modified,
      image: images.length ? images : undefined,
    },
  };
}
export default function ArticleSchemaGenerator() {
  return (
    <SchemaStudio
      name="Article"
      groups={groups}
      example={example}
      build={build}
      guide="article"
    />
  );
}
