import type { ActionFunction, MetaFunction } from "@remix-run/node";
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
import { readAppearance, readGeneral } from "~/server/settings.server";
import { useCallback, useEffect, useState } from "react";
import {
  useGamepadButtonPressEvent,
  useGamepadStickDirectionEvent,
  useKeyboardEvent,
} from "~/hooks/useGamepadEvent";
import { layout } from "~/hooks/useGamepads/layouts";
import { useFocus } from "~/hooks/useFocus";
import type { FocusElements } from "~/types/focusElements";
import { styled } from "~/stitches";
import type { DataFunctionArgs } from "@remix-run/server-runtime/dist/routeModules";

type CategoryLinks = Array<{ id: PlatformId; name: string; to: string }>;
type LoaderData = {
  selectedCategoryId: string;
  categoryLinks: CategoryLinks;
  collapseSidebar?: boolean;
};

export const loader = ({ params }: DataFunctionArgs) => {
  console.log("loader");
  const general = readGeneral();
  const { collapseSidebar } = readAppearance();
  if (general?.applicationsPath || general?.categoriesPath) {
    const categories = readCategories();

    const { category } = params;
    if (!category) {
      return redirect(`/categories/${categories[0].id}`);
    }

    const categoryLinks = categories.map(({ id, name }) => ({
      to: id,
      id,
      name,
    }));

    return json({
      categoryLinks,
      selectedCategoryId: category,
      collapseSidebar,
    });
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

const Name = styled("div", {
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});

export default function Index() {
  const { categoryLinks, selectedCategoryId, collapseSidebar } =
    useLoaderData<LoaderData>();
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

  console.log("rerender");

  return (
    <SidebarMainLayout>
      <SidebarMainLayout.Sidebar
        header={<Header collapse={collapseSidebar} />}
        headline="Platforms"
        collapse={collapseSidebar}
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
              {!collapseSidebar ? "Import all" : null}
            </Button>
          </Form>
        }
      >
        {categoryLinks.map(({ id, name, to }, index) => (
          <Link
            to={to}
            icon={<PlatformIcon id={id} />}
            aria-label={name}
            key={to}
            ref={refCallback(index)}
            {...getTestId(["link", to])}
          >
            {collapseSidebar ? undefined : <Name>{name}</Name>}
          </Link>
        ))}
      </SidebarMainLayout.Sidebar>
      <SidebarMainLayout.Main>
        <Outlet />
      </SidebarMainLayout.Main>
    </SidebarMainLayout>
  );
}
