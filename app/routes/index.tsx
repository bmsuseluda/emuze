import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { readGeneral } from "~/server/settings.server";

export const loader: LoaderFunction = () => {
  const general = readGeneral();
  if (general?.applicationsPath || general?.categoriesPath) {
    return redirect("/categories");
  }

  return redirect("/settings/general");
};

export const meta: MetaFunction = () => {
  return {
    title: "Library",
    description: "Your library",
  };
};
