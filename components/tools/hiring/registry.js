import ContentBrief, { faqs as contentFaqs } from "./briefs/ContentAgencyBriefBuilder";
import LinkBrief, { faqs as linkFaqs } from "./briefs/LinkBuildingBriefBuilder";
import Comparison, { faqs as proposalFaqs } from "./AgencyProposalComparison";
import TrialKit, { faqs as trialFaqs } from "./ContentAgencyPaidTrialKit";
import BriefBuilder, { faqs as briefFaqs } from "./briefs/SeoAgencyBriefBuilder";
export const hiringComponents = {
  "content-agency-brief-builder": { Component: ContentBrief, faqs: contentFaqs },
  "link-building-brief-builder": { Component: LinkBrief, faqs: linkFaqs },
  "agency-proposal-comparison": { Component: Comparison, faqs: proposalFaqs },
  "content-agency-paid-trial-kit": { Component: TrialKit, faqs: trialFaqs },
  "seo-agency-brief-builder": { Component: BriefBuilder, faqs: briefFaqs },
};
