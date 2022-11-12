import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Outlet, useLoaderData, useTransition } from "@remix-run/react";
import { IoMdRefresh } from "react-icons/io";
import { Button } from "~/components/Button";
import { importCategories, readCategories } from "~/server/categories.server";
import { SidebarMainLayout } from "~/components/layouts/SidebarMainLayout";
import { Link } from "~/containers/Link";
import { Header } from "~/containers/Header";
import { useTestId } from "~/hooks/useTestId";
import { importApplications } from "~/server/applications.server";
import { PlatformIcon } from "~/components/PlatformIcon";
import type { PlatformId } from "~/types/platforms";
import { useGamepadsOnSidebar } from "~/hooks/useGamepads/useGamepadsOnSidebar";

type CategoryLinks = Array<{ id: PlatformId; name: string; to: string }>;

export const loader: LoaderFunction = () => {
  const categories = readCategories();
  const categoryLinks = categories.map(({ id, name }) => ({
    to: `/categories/${id}`,
    id,
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
  const { refCallback } = useGamepadsOnSidebar(categoryLinks);

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
              icon={<IoMdRefresh />}
            >
              Import all
            </Button>
          </Form>
        }
      >
        {categoryLinks.map(({ id, name, to }, index) => (
          <Link
            to={to}
            icon={<PlatformIcon id={id} />}
            key={to}
            ref={refCallback(index)}
            {...getTestId(["link", to])}
          >
            {name}
          </Link>
        ))}
      </SidebarMainLayout.Sidebar>
      <SidebarMainLayout.Main>
        <Outlet />
      </SidebarMainLayout.Main>
    </SidebarMainLayout>
  );
}
