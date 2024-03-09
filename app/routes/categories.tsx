import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { readCategories } from "~/server/categories.server";
import { SidebarMainLayout } from "~/components/layouts/SidebarMainLayout";
import { Link } from "~/containers/Link";
import { Header } from "~/containers/Header";
import { useTestId } from "~/hooks/useTestId";
import { SystemIcon } from "app/components/SystemIcon";
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
import type { SystemId } from "~/server/categoriesDB.server/types";
import { Typography } from "~/components/Typography";
import { styled } from "../../styled-system/jsx";
import type { DataFunctionArgs } from "~/context";

type CategoryLinks = Array<{ id: SystemId; name: string; to: string }>;
type LoaderData = {
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
      collapseSidebar,
    });
  }

  return json({
    categoryLinks: [],
    collapseSidebar,
  });
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

const Name = styled(Typography, {
  base: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
});

export default function Categories() {
  const { categoryLinks, collapseSidebar } = useLoaderData<LoaderData>();
  const { getTestId } = useTestId("categories");

  const { isInFocus, switchFocus, enableFocus } =
    useFocus<FocusElement>("sidebar");

  const { categoryLinksRefCallback } = useGamepadsOnSidebar(isInFocus);

  const switchToMain = useCallback(() => {
    if (isInFocus) {
      switchFocus("main");
    }
  }, [isInFocus, switchFocus]);

  const onSettings = useCallback(() => {
    if (isInFocus) {
      document.getElementById("settings")?.click();
    }
  }, [isInFocus]);

  // TODO: add tests
  useGamepadButtonPressEvent(layout.buttons.DPadRight, switchToMain);
  useGamepadStickDirectionEvent("leftStickRight", switchToMain);
  useGamepadStickDirectionEvent("extraStickRight", switchToMain);
  useKeyboardEvent("ArrowRight", switchToMain);
  useGamepadButtonPressEvent(layout.buttons.A, switchToMain);
  useKeyboardEvent("Enter", switchToMain);
  useGamepadButtonPressEvent(layout.buttons.Start, onSettings);
  useKeyboardEvent("Escape", onSettings);

  const onLinkClick = useCallback(() => {
    if (!isInFocus) {
      enableFocus();
    }
  }, [isInFocus, enableFocus]);

  return (
    <SidebarMainLayout>
      <SidebarMainLayout.Sidebar
        header={<Header collapse={collapseSidebar} />}
        collapse={collapseSidebar}
      >
        {categoryLinks.map(({ id, name, to }, index) => (
          <li key={to}>
            <Link
              to={to}
              icon={<SystemIcon id={id} />}
              aria-label={name}
              ref={categoryLinksRefCallback(index)}
              onClick={onLinkClick}
              {...getTestId(["link", to])}
            >
              {collapseSidebar ? undefined : <Name>{name}</Name>}
            </Link>
          </li>
        ))}
      </SidebarMainLayout.Sidebar>
      <SidebarMainLayout.Main>
        <Outlet />
      </SidebarMainLayout.Main>
    </SidebarMainLayout>
  );
}
