import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { readGeneral } from "~/server/settings.server";

export const loader: LoaderFunction = () => {
  const general = readGeneral();

  if (general?.applicationsPath || general?.categoriesPath) {
    throw redirect("/categories");
  }

  throw redirect("/settings/general");
};
