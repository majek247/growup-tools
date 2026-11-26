import ToolCategoryPage from "../components/ToolCategoryPage";
import { tools } from "../lib/catalog.mjs";

export default function ContentOperationsCategoryPage() {
  return <ToolCategoryPage category="content-operations" tools={tools} />;
}
