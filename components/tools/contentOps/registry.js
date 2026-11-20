import ContentScopeOfWork from "./ContentScopeOfWork";
import CostPerPublishedPiece from "./CostPerPublishedPiece";
import BrandVoiceOnePager from "./BrandVoiceOnePager";

import ProductFactSheet, {
  faqs as ProductFactSheetFaqs
} from "./ProductFactSheet";

import ContentBriefTemplate, {
  faqs as ContentBriefTemplateFaqs
} from "./ContentBriefTemplate";

import StakeholderContentRequest, {
  faqs as StakeholderContentRequestFaqs
} from "./StakeholderContentRequest";

import SmeInterviewKit, {
  faqs as SmeInterviewKitFaqs
} from "./SmeInterviewKit";

import WriterSelfQa, {
  faqs as WriterSelfQaFaqs
} from "./WriterSelfQa";

import AiAssistedWritingPolicy, {
  faqs as AiAssistedWritingPolicyFaqs
} from "./AiAssistedWritingPolicy";

export const contentOpsComponents = {
  "content-delivery-planner": {
    Component: ContentScopeOfWork,
    faqs: []
  },

  "content-cost-calculator": {
    Component: CostPerPublishedPiece,
    faqs: []
  },

  "brand-writing-guidelines": {
    Component: BrandVoiceOnePager,
    faqs: []
  },

  "product-fact-sheet": {
    Component: ProductFactSheet,
    faqs: ProductFactSheetFaqs
  },

  "content-brief-template": {
    Component: ContentBriefTemplate,
    faqs: ContentBriefTemplateFaqs
  },

  "stakeholder-content-request-form": {
    Component: StakeholderContentRequest,
    faqs: StakeholderContentRequestFaqs
  },

  "sme-interview-kit": {
    Component: SmeInterviewKit,
    faqs: SmeInterviewKitFaqs
  },

  "writer-self-qa-checklist": {
    Component: WriterSelfQa,
    faqs: WriterSelfQaFaqs
  },

  "ai-assisted-writing-policy": {
    Component: AiAssistedWritingPolicy,
    faqs: AiAssistedWritingPolicyFaqs
  }
};