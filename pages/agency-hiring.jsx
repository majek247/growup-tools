import ToolCategoryPage from "../components/ToolCategoryPage";
import { tools } from "../lib/catalog.mjs";

export default function AgencyHiringCategoryPage() {
  return <ToolCategoryPage category="agency-hiring" tools={tools} />;
}
