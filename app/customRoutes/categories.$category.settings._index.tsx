import type { LoaderFunction } from "react-router";
import { redirect } from "react-router";
import { SystemId } from "../server/categoriesDB.server/systemId.js";
import { categories } from "../server/categoriesDB.server/index.js";

export const loader: LoaderFunction = ({ params }) => {
  const { category } = params;
  if (category) {
    const systemId = category as SystemId;
    const system = categories[systemId];
    const application = system.getApplication();

    if (system.settings || application.settings) {
      throw redirect("advanced");
    }
  }

  throw redirect("general");
};
