import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Outlet, useLoaderData } from "@remix-run/react";
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
import { useGamepadsOnSidebar } from "~/hooks/useGamepadsOnSidebar";
import { readGeneral } from "~/server/settings.server";
import { useCallback, useEffect, useState } from "react";
import {
  useGamepadButtonPressEvent,
  useGamepadStickDirectionEvent,
  useKeyboardEvent,
} from "~/hooks/useGamepadEvent";
import { layout } from "~/hooks/useGamepads/layouts";
import { useFocus } from "~/hooks/useFocus";
import type { FocusElements } from "~/types/focusElements";

type CategoryLinks = Array<{ id: PlatformId; name: string; to: string }>;
type LoaderData = {
  selectedCategoryId: string;
  categoryLinks: CategoryLinks;
};

export const loader: LoaderFunction = ({ params }) => {
  const general = readGeneral();
  if (general?.applicationsPath || general?.categoriesPath) {
    const categories = readCategories();

    const { category } = params;
    if (!category) {
      return redirect(`/categories/${categories[0].id}`);
    }

    const categoryLinks = categories.map(({ id, name }) => ({
      to: `/categories/${id}`,
      id,
      name,
    }));

    return json({ categoryLinks, selectedCategoryId: category });
  }

  return redirect("/settings/general");
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
  const { categoryLinks, selectedCategoryId } = useLoaderData<LoaderData>();
  const { getTestId } = useTestId("categories");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [categoryLinks]);

  const { isInFocus, switchFocus } = useFocus<FocusElements>("sidebar");

  const { refCallback } = useGamepadsOnSidebar(
    categoryLinks.findIndex(({ id }) => id === selectedCategoryId),
    isInFocus
  );

  const switchToMain = useCallback(() => {
    if (isInFocus) {
      switchFocus("main");
    }
  }, [isInFocus, switchFocus]);

  // TODO: add tests
  useGamepadButtonPressEvent(layout.buttons.DPadRight, switchToMain);
  useGamepadStickDirectionEvent("leftStickRight", switchToMain);
  useKeyboardEvent("ArrowRight", switchToMain);
  useGamepadButtonPressEvent(layout.buttons.A, switchToMain);
  useKeyboardEvent("Enter", switchToMain);

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
              value="import"
              icon={<IoMdRefresh />}
              onClick={() => {
                setLoading(true);
              }}
              loading={loading}
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
