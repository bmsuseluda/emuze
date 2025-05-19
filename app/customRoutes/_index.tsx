import type { LoaderFunction } from "react-router";
import { redirect } from "react-router";
import { readGeneral } from "../server/settings.server.js";

export const loader: LoaderFunction = () => {
  const general = readGeneral();

  if (general?.applicationsPath || general?.categoriesPath) {
    throw redirect("/categories");
  }

  throw redirect("/settings/general");
};
