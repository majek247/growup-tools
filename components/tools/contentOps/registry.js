import ContentScopeOfWork, {
  faqs as ContentScopeOfWorkFaqs
} from "./ContentScopeOfWork";
import CostPerPublishedPiece, {
  faqs as CostPerPublishedPieceFaqs
} from "./CostPerPublishedPiece";

import BrandVoiceOnePager, {
  faqs as BrandVoiceOnePagerFaqs
} from "./BrandVoiceOnePager";

import ProductFactSheet, {
  faqs as ProductFactSheetFaqs
} from "./ProductFactSheet";

import ContentBriefTemplate, {
  faqs as ContentBriefTemplateFaqs
} from "./ContentBriefTemplate";


import SmeInterviewKit, {
  faqs as SmeInterviewKitFaqs
} from "./SmeInterviewKit";


import AiAssistedWritingPolicy, {
  faqs as AiAssistedWritingPolicyFaqs
} from "./AiAssistedWritingPolicy";

export const contentOpsComponents = {
"content-delivery-planner": {
  Component: ContentScopeOfWork,
  faqs: ContentScopeOfWorkFaqs
},

"content-cost-calculator": {
  Component: CostPerPublishedPiece,
  faqs: CostPerPublishedPieceFaqs
},

"brand-writing-guidelines": {
  Component: BrandVoiceOnePager,
  faqs: BrandVoiceOnePagerFaqs
},

  "product-fact-sheet": {
    Component: ProductFactSheet,
    faqs: ProductFactSheetFaqs
  },

  "content-brief-template": {
    Component: ContentBriefTemplate,
    faqs: ContentBriefTemplateFaqs
  },


  "sme-interview-kit": {
    Component: SmeInterviewKit,
    faqs: SmeInterviewKitFaqs
  },



  "ai-assisted-writing-policy": {
    Component: AiAssistedWritingPolicy,
    faqs: AiAssistedWritingPolicyFaqs
  }
};