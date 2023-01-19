import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const loader: LoaderFunction = () => {
  return redirect("/categories");
};

export const meta: MetaFunction = () => {
  return {
    title: "Library",
    description: "Your library",
  };
};
