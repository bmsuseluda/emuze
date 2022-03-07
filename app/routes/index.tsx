import { MetaFunction, LoaderFunction, redirect } from "remix";

export const loader: LoaderFunction = () => {
  return redirect("/categories");
};

export const meta: MetaFunction = () => {
  return {
    title: "Library",
    description: "Your library",
  };
};
