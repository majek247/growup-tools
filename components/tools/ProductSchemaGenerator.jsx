import SchemaStudio, {
  field,
  address,
  identifier,
  required,
  amount,
} from "./SchemaStudio";
const groups = [
  {
    title: "Product details",
    fields: [
      field("name", "Product name *"),
      field("url", "Product page URL *", "url"),
      field("brand", "Brand"),
      field("sku", "SKU"),
      field("image", "Product image URL", "url"),
      field("description", "Description", "textarea"),
    ],
  },
  {
    title: "Published offer",
    fields: [
      field("price", "Offer price", "number"),
      field("currency", "Price currency", "select", [
        "GBP",
        "USD",
        "EUR",
        "NGN",
        "CAD",
        "AUD",
        "INR",
      ]),
      field("stock", "Availability", "select", [
        "Unspecified",
        "InStock",
        "OutOfStock",
        "PreOrder",
        "BackOrder",
        "Discontinued",
      ]),
    ],
  },
  {
    title: "Published review summary",
    fields: [
      field("rating", "Average score (1–5)", "number"),
      field("count", "Number of written reviews", "number"),
    ],
  },
];
const example = {
  name: "Cedar Analytics Starter",
  url: "https://example.com/starter",
  brand: "Cedar Metrics",
  sku: "CEDAR-STARTER",
  price: "49",
  currency: "GBP",
  stock: "InStock",
  rating: "4.6",
  count: "28",
};
export const faqs = [
  {
    question: "Can I generate markup without reviews?",
    answer:
      "Yes. Enter a published offer and leave both rating fields empty. The generator omits the rating object.",
  },
  {
    question: "Should I enter zero for a quote-only product?",
    answer:
      "Use zero only for a genuinely free offer. For a quote-only product, leave price and availability empty. You can generate a product snippet candidate if the page has a qualifying review summary.",
  },
  {
    question: "What does the generator check?",
    answer:
      "It checks product name, page URL, price or a complete rating summary, currency selection and rating range. Test the published page separately for Google eligibility and crawlability.",
  },
];

export function build(v) {
  const url = address(required(v.url, "a product page URL"), "product URL");
  const node = {
    "@type": "Product",
    "@id": identifier(url, "product"),
    url,
    name: required(v.name, "a product name"),
    brand: v.brand.trim()
      ? { "@type": "Brand", name: v.brand.trim() }
      : undefined,
    sku: v.sku.trim() || undefined,
    image: address(v.image, "product image"),
    description: v.description.trim() || undefined,
  };
  if (v.price.trim())
    node.offers = {
      "@type": "Offer",
      url,
      price: amount(v.price, "offer price", 0),
      priceCurrency: v.currency,
      availability:
        v.stock === "Unspecified" ? undefined : "https://schema.org/" + v.stock,
    };
  else if (v.stock !== "Unspecified")
    throw Error(
      "Add the price for this offer or choose Unspecified availability.",
    );
  if (v.rating || v.count)
    node.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: amount(v.rating, "average score", 1, 5),
      reviewCount: amount(v.count, "review count", 1, Infinity, true),
      bestRating: 5,
      worstRating: 1,
    };
  if (!node.offers && !node.aggregateRating)
    throw Error(
      "Enter a published offer price or the visible average score and review count.",
    );
  return { node };
}
export default function ProductSchemaGenerator() {
  return (
    <SchemaStudio
      name="Product"
      groups={groups}
      example={example}
      build={build}
      guide="product-snippet"
    />
  );
}
