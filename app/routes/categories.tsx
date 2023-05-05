import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { IoMdRefresh } from "react-icons/io";
import { Button } from "~/components/Button";
import { importCategories, readCategories } from "~/server/categories.server";
import { SidebarMainLayout } from "~/components/layouts/SidebarMainLayout";
import { Link } from "~/containers/Link";
import { Header } from "~/containers/Header";
import { useTestId } from "~/hooks/useTestId";
import { PlatformIcon } from "~/components/PlatformIcon";
import { useGamepadsOnSidebar } from "~/hooks/useGamepadsOnSidebar";
import { readAppearance } from "~/server/settings.server";
import { useCallback } from "react";
import {
  useGamepadButtonPressEvent,
  useGamepadStickDirectionEvent,
  useKeyboardEvent,
} from "~/hooks/useGamepadEvent";
import { layout } from "~/hooks/useGamepads/layouts";
import { useFocus } from "~/hooks/useFocus";
import type { FocusElement } from "~/types/focusElement";
import { styled } from "~/stitches";
import type { DataFunctionArgs } from "@remix-run/server-runtime/dist/routeModules";
import { useFullscreen } from "~/hooks/useFullscreen";
import type { PlatformId } from "~/server/categoriesDB.server";

type CategoryLinks = Array<{ id: PlatformId; name: string; to: string }>;
type LoaderData = {
  selectedCategoryId: string;
  categoryLinks: CategoryLinks;
  collapseSidebar?: boolean;
};

export const loader = ({ params }: DataFunctionArgs) => {
  const { category } = params;
  const { collapseSidebar } = readAppearance();
  const categories = readCategories();

  if (categories && categories.length > 0) {
    if (!category) {
      throw redirect(categories[0].id);
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

  return json({
    categoryLinks: [],
    selectedCategoryId: category,
    collapseSidebar,
  });
};

const actionIds = {
  import: "import",
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const _actionId = form.get("_actionId");
  if (_actionId === actionIds.import) {
    await importCategories();
    throw redirect("/categories");
  }

  return null;
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

export default function Categories() {
  const { categoryLinks, selectedCategoryId, collapseSidebar } =
    useLoaderData<LoaderData>();
  const { getTestId } = useTestId("categories");
  const isFullscreen = useFullscreen();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { state, formData } = useNavigation();

  const { isInFocus, switchFocus } = useFocus<FocusElement>("sidebar");

  const { refCallback } = useGamepadsOnSidebar(
    categoryLinks.findIndex(({ id }) => id === selectedCategoryId),
    isInFocus
  );

  const switchToMain = useCallback(() => {
    if (isInFocus) {
      switchFocus("main");
    }
  }, [isInFocus, switchFocus]);

  const onSettings = useCallback(() => {
    if (isInFocus) {
      // TODO: check how to trigger settings button click instead like $category
      navigate(`${pathname}/settings`);
    }
  }, [isInFocus, pathname, navigate]);

  // TODO: add tests
  useGamepadButtonPressEvent(layout.buttons.DPadRight, switchToMain);
  useGamepadStickDirectionEvent("leftStickRight", switchToMain);
  useKeyboardEvent("ArrowRight", switchToMain);
  useGamepadButtonPressEvent(layout.buttons.A, switchToMain);
  useKeyboardEvent("Enter", switchToMain);
  useGamepadButtonPressEvent(layout.buttons.Start, onSettings);
  useKeyboardEvent("Escape", onSettings);

  return (
    <SidebarMainLayout>
      <SidebarMainLayout.Sidebar
        header={<Header />}
        collapse={collapseSidebar}
        isFullscreen={isFullscreen}
        actions={
          <Form method="post">
            <Button
              type="submit"
              name="_actionId"
              value={actionIds.import}
              icon={<IoMdRefresh />}
              loading={
                state === "submitting" &&
                formData?.get("_actionId") === actionIds.import
              }
            >
              {!collapseSidebar ? "Import all" : null}
            </Button>
          </Form>
        }
      >
        {categoryLinks.map(({ id, name, to }, index) => (
          <li key={to}>
            <Link
              to={to}
              icon={<PlatformIcon id={id} />}
              aria-label={name}
              ref={refCallback(index)}
              {...getTestId(["link", to])}
            >
              {collapseSidebar ? undefined : <Name>{name}</Name>}
            </Link>
          </li>
        ))}
      </SidebarMainLayout.Sidebar>
      <SidebarMainLayout.Main isFullscreen={isFullscreen}>
        <Outlet />
      </SidebarMainLayout.Main>
    </SidebarMainLayout>
  );
}
