import { MetaFunction, LoaderFunction, redirect } from "remix";
import { readGeneral } from "~/server/settings.server";

export const loader: LoaderFunction = () => {
  const general = readGeneral();
  if (general?.applicationsPath && general?.categoriesPath) {
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
