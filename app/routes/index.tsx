import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import type { DataFunctionArgs } from "@remix-run/server-runtime/dist/routeModules";
import { readGeneral } from "~/server/settings.server";

export const loader: LoaderFunction = ({ params }: DataFunctionArgs) => {
  const general = readGeneral();

  if (general?.applicationsPath || general?.categoriesPath) {
    return redirect("/categories");
  }

  console.log("init");
  return redirect("/settings/general");
};

export const meta: MetaFunction = () => {
  return {
    title: "Library",
    description: "Your library",
  };
};
