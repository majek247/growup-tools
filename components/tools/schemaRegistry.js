import Organization, {
  faqs as organizationFaqs,
} from "./OrganizationSchemaGenerator";
import Product, { faqs as productFaqs } from "./ProductSchemaGenerator";
import Article, { faqs as articleFaqs } from "./ArticleSchemaGenerator";
import Video, { faqs as videoFaqs } from "./VideoSchemaGenerator";
import Review, { faqs as reviewFaqs } from "./ReviewSchemaGenerator";

export const schemaComponents = {
  "organization-schema-generator": {
    Component: Organization,
    faqs: organizationFaqs,
  },
  "product-schema-generator": { Component: Product, faqs: productFaqs },
  "article-schema-generator": { Component: Article, faqs: articleFaqs },
  "video-schema-generator": { Component: Video, faqs: videoFaqs },
  "review-schema-generator": { Component: Review, faqs: reviewFaqs },
};
