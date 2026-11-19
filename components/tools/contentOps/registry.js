import ContentScopeOfWork, { faqs as ContentScopeOfWorkFaqs } from "./ContentScopeOfWork";
import CostPerPublishedPiece, { faqs as CostPerPublishedPieceFaqs } from "./CostPerPublishedPiece";
import MonthlyOutputPlanner, { faqs as MonthlyOutputPlannerFaqs } from "./MonthlyOutputPlanner";
import AccessAndAssetChecklist, { faqs as AccessAndAssetChecklistFaqs } from "./AccessAndAssetChecklist";
import BrandVoiceOnePager, { faqs as BrandVoiceOnePagerFaqs } from "./BrandVoiceOnePager";
import ProductFactSheet, { faqs as ProductFactSheetFaqs } from "./ProductFactSheet";
import BuyerAndIcpBrief, { faqs as BuyerAndIcpBriefFaqs } from "./BuyerAndIcpBrief";
import ContentBriefTemplate, { faqs as ContentBriefTemplateFaqs } from "./ContentBriefTemplate";
import StakeholderContentRequest, { faqs as StakeholderContentRequestFaqs } from "./StakeholderContentRequest";
import SmeInterviewKit, { faqs as SmeInterviewKitFaqs } from "./SmeInterviewKit";
import WriterSelfQa, { faqs as WriterSelfQaFaqs } from "./WriterSelfQa";
import AiAssistedWritingPolicy, { faqs as AiAssistedWritingPolicyFaqs } from "./AiAssistedWritingPolicy";
export const contentOpsComponents = {
  "content-scope-of-work": { Component: ContentScopeOfWork, faqs: ContentScopeOfWorkFaqs },
  "cost-per-published-piece-calculator": { Component: CostPerPublishedPiece, faqs: CostPerPublishedPieceFaqs },
  "monthly-output-planner": { Component: MonthlyOutputPlanner, faqs: MonthlyOutputPlannerFaqs },
  "access-and-asset-checklist": { Component: AccessAndAssetChecklist, faqs: AccessAndAssetChecklistFaqs },
  "brand-voice-one-pager": { Component: BrandVoiceOnePager, faqs: BrandVoiceOnePagerFaqs },
  "product-fact-sheet": { Component: ProductFactSheet, faqs: ProductFactSheetFaqs },
  "buyer-and-icp-brief": { Component: BuyerAndIcpBrief, faqs: BuyerAndIcpBriefFaqs },
  "content-brief-template": { Component: ContentBriefTemplate, faqs: ContentBriefTemplateFaqs },
  "stakeholder-content-request-form": { Component: StakeholderContentRequest, faqs: StakeholderContentRequestFaqs },
  "sme-interview-kit": { Component: SmeInterviewKit, faqs: SmeInterviewKitFaqs },
  "writer-self-qa-checklist": { Component: WriterSelfQa, faqs: WriterSelfQaFaqs },
  "ai-assisted-writing-policy": { Component: AiAssistedWritingPolicy, faqs: AiAssistedWritingPolicyFaqs },
};
