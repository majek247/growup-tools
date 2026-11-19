import SchemaStudio, {
  field,
  address,
  identifier,
  required,
  amount,
} from "./SchemaStudio";
const groups = [
  {
    title: "Reviewed item",
    fields: [
      field("type", "Item type", "select", [
        "Product",
        "SoftwareApplication",
        "Organization",
        "LocalBusiness",
      ]),
      field("name", "Item or business name *"),
      field("url", "Reviewed item URL *", "url"),
      field(
        "control",
        "Who controls the page publishing the reviews?",
        "select",
        ["Choose one", "The reviewed business", "An independent publisher"],
      ),
    ],
  },
];
const example = {
  type: "SoftwareApplication",
  name: "Cedar Analytics",
  url: "https://example.com/software/cedar",
  control: "An independent publisher",
  reviews: [
    {
      author: "Example reviewer A",
      score: "4",
      body: "The reusable reports made our weekly review quicker.",
    },
    {
      author: "Example reviewer B",
      score: "5",
      body: "We exported the whole report without rebuilding it in Sheets.",
    },
  ],
};
export const faqs = [
  {
    question: "How is the average calculated?",
    answer:
      "Each entered review carries equal weight on a five-point scale. The export uses the mean rounded to two decimals and the number of reviews in the editor. The result should match what readers see.",
  },
  {
    question: "What triggers the self-review warning?",
    answer:
      "Select Organization or LocalBusiness and indicate that the reviewed business controls the page. Google treats those reviews as self-serving for review stars, including reviews displayed through third-party widgets.",
  },
  {
    question: "Can I paste reviews from another site?",
    answer:
      "Use original reviews collected on the site you are marking up and visible to its readers. Use the example to explore the editor, then replace every sample with genuine published feedback.",
  },
];
const repeat = {
  key: "reviews",
  title: "Published reviews",
  label: "Review",
  fields: [
    field("author", "Reviewer name *"),
    field("score", "Rating * (1–5)", "number"),
    field("body", "Review text *", "textarea"),
  ],
};
export function build(v) {
  const url = address(
    required(v.url, "the reviewed item URL"),
    "reviewed item",
  );
  const name = required(v.name, "the reviewed item name");
  if (v.control === "Choose one")
    throw Error("Choose who controls the review page.");
  if (!v.reviews.length) throw Error("Add at least one published review.");
  const review = v.reviews.map((r, i) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: required(r.author, "the author for review " + (i + 1)),
    },
    reviewBody: required(r.body, "the text for review " + (i + 1)),
    reviewRating: {
      "@type": "Rating",
      ratingValue: amount(r.score, "score for review " + (i + 1), 1, 5),
      bestRating: 5,
      worstRating: 1,
    },
  }));
  const average = Number(
    (
      review.reduce((sum, r) => sum + r.reviewRating.ratingValue, 0) /
      review.length
    ).toFixed(2),
  );
  const warnings = [];
  if (
    ["Organization", "LocalBusiness"].includes(v.type) &&
    v.control === "The reviewed business"
  )
    warnings.push(
      "Self-serving reviews: Google excludes review stars for an organization or local business that controls reviews about itself.",
    );
  return {
    node: {
      "@type": v.type,
      "@id": identifier(
        url,
        v.type === "Product"
          ? "product"
          : v.type === "Organization"
            ? "organization"
            : "item",
      ),
      name,
      url,
      review,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: average,
        reviewCount: review.length,
        bestRating: 5,
        worstRating: 1,
      },
    },
    warnings,
  };
}
export default function ReviewSchemaGenerator() {
  return (
    <SchemaStudio
      name="Review"
      groups={groups}
      example={example}
      build={build}
      guide="review-snippet"
      repeat={repeat}
    />
  );
}
