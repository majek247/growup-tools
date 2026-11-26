import ToolCategoryPage from "../components/ToolCategoryPage";
import { tools } from "../lib/catalog.mjs";

export default function RevenuePlanningCategoryPage() {
  return <ToolCategoryPage category="revenue-planning" tools={tools} />;
}
