import SchemaStudio, {
  field,
  address,
  identifier,
  required,
} from "./SchemaStudio";
const groups = [
  {
    title: "Company identity",
    fields: [
      field("name", "Public company name *"),
      field("website", "Company website *", "url"),
      field("legal", "Registered legal name"),
      field("logo", "Logo image URL", "url"),
      field("summary", "Company description", "textarea"),
    ],
  },
  {
    title: "Contact and profiles",
    fields: [
      field("email", "Public contact email", "email"),
      field("phone", "Public phone number"),
      field("profiles", "Official profile URLs (one per line)", "textarea"),
    ],
  },
];
const example = {
  name: "Cedar Metrics",
  website: "https://example.com",
  legal: "Cedar Metrics Ltd",
  logo: "https://example.com/logo.png",
  email: "support@example.com",
  profiles:
    "https://www.linkedin.com/company/example\nhttps://www.g2.com/products/example",
};
export const faqs = [
  {
    question: "Which profiles belong here?",
    answer:
      "Use pages that identify the same business, such as its LinkedIn company profile or G2 listing. Paste one full URL per line. Duplicate URLs are removed.",
  },
  {
    question: "How can an article reference the same publisher?",
    answer:
      "Copy the organization’s @id into the publisher ID field in the article generator. Both records will identify the same company.",
  },
  {
    question: "Where should I publish this markup?",
    answer:
      "Use your homepage or a page describing your company. Include public contact details that belong to the business.",
  },
];

export function build(v) {
  const website = address(
    required(v.website, "the company website"),
    "website",
  );
  const profiles = [
    ...new Set(
      v.profiles
        .split(/\r?\n/)
        .filter((s) => s.trim())
        .map((s) => address(s, "a profile")),
    ),
  ];
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
    throw Error("Check the public email address.");
  return {
    node: {
      "@type": "Organization",
      "@id": identifier(website, "organization"),
      name: required(v.name, "a company name"),
      url: website,
      legalName: v.legal.trim() || undefined,
      description: v.summary.trim() || undefined,
      logo: address(v.logo, "logo"),
      email: v.email.trim() || undefined,
      telephone: v.phone.trim() || undefined,
      sameAs: profiles.length ? profiles : undefined,
    },
  };
}
export default function OrganizationSchemaGenerator() {
  return (
    <SchemaStudio
      name="Organization"
      groups={groups}
      example={example}
      build={build}
      guide="organization"
    />
  );
}
