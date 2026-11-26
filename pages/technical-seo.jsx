import ToolCategoryPage from "../components/ToolCategoryPage";
import { tools } from "../lib/catalog.mjs";

export default function TechnicalSeoCategoryPage() {
  return <ToolCategoryPage category="technical-seo" tools={tools} />;
}
