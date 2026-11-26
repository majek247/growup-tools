import ToolCategoryPage from "../components/ToolCategoryPage";
import { tools } from "../lib/catalog.mjs";

export default function AiSearchCategoryPage() {
  return <ToolCategoryPage category="ai-search" tools={tools} />;
}
