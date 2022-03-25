import {
  MetaFunction,
  LoaderFunction,
  useLoaderData,
  json,
  Outlet,
  Form,
  ActionFunction,
  redirect,
  useTransition,
} from "remix";
import { Button } from "~/components/button";
import { importCategories, readCategories } from "~/server/categories.server";
import { SidebarMainLayout } from "~/components/layouts/SidebarMainLayout";
import { Link } from "~/containers/Link";
import { Header } from "~/containers/Header";
import { useTestId } from "~/hooks/useTestId";
import { importApplications } from "~/server/applications.server";

type CategoryLinks = Array<{ name: string; to: string }>;

export const loader: LoaderFunction = () => {
  const categories = readCategories();
  const categoryLinks = categories.map(({ id, name }) => ({
    to: `/categories/${id}`,
    name,
  }));

  return json(categoryLinks);
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const _actionId = form.get("_actionId");
  if (_actionId === "import") {
    importApplications();
    await importCategories();
    return redirect("/categories");
  }

  return null;
};

export const meta: MetaFunction = () => {
  return {
    title: "Library",
    description: "Your library",
  };
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  console.error(error);
  return (
    <>
      <h2>Error!</h2>
      <p>{error.message}</p>
    </>
  );
};

export default function Index() {
  const categoryLinks = useLoaderData<CategoryLinks>();
  const { state } = useTransition();
  const { getTestId } = useTestId("categories");

  return (
    <SidebarMainLayout>
      <SidebarMainLayout.Sidebar
        header={<Header />}
        headline="Platforms"
        actions={
          <Form method="post">
            <Button
              type="submit"
              name="_actionId"
              disabled={state !== "idle"}
              value="import"
            >
              import
            </Button>
          </Form>
        }
      >
        {categoryLinks.map((category) => (
          <Link
            to={category.to}
            key={category.to}
            {...getTestId(["link", category.to])}
          >
            {category.name}
          </Link>
        ))}
      </SidebarMainLayout.Sidebar>
      <SidebarMainLayout.Main>
        <Outlet />
      </SidebarMainLayout.Main>
    </SidebarMainLayout>
  );
}
