import { json } from "@remix-run/node";
import { Outlet, redirect, useLoaderData } from "@remix-run/react";
import { readCategories } from "../server/categories.server";
import { SidebarMainLayout } from "../components/layouts/SidebarMainLayout";
import { Link } from "../containers/Link";
import { Header } from "../containers/Header";
import { SystemIcon } from "../components/SystemIcon";
import { useGamepadsOnSidebar } from "../hooks/useGamepadsOnSidebar";
import { readAppearance } from "../server/settings.server";
import { useCallback } from "react";
import {
  useGamepadButtonPressEvent,
  useGamepadStickDirectionEvent,
  useKeyboardEvent,
} from "../hooks/useGamepadEvent";
import { layout } from "../hooks/useGamepads/layouts";
import { useFocus } from "../hooks/useFocus";
import type { FocusElement } from "../types/focusElement";
import { Typography } from "../components/Typography";
import { styled } from "../../styled-system/jsx";
import type { DataFunctionArgs } from "../context";
import type { SystemId } from "../server/categoriesDB.server/systemId";
import { readLastPlayed } from "../server/lastPlayed.server";
import { useOpenSettings } from "../containers/SettingsLink/useOpenSettings";
import { useImportButton } from "../containers/ImportButton/useImportButton";

type CategoryLinks = Array<{ id: SystemId; name: string; to: string }>;
type LoaderData = {
  categoryLinks: CategoryLinks;
  collapseSidebar?: boolean;
};

export const loader = ({ params, request }: DataFunctionArgs) => {
  const { category } = params;
  const { collapseSidebar } = readAppearance();
  const categories = readCategories();

  if (categories?.length > 0) {
    const isLastPlayedAvailable = readLastPlayed().length > 0;

    if (isLastPlayedAvailable && categories[0].id !== "lastPlayed") {
      categories.unshift({ id: "lastPlayed", name: "Last Played" });
    }

    if (!request.url.includes("lastPlayed") && !category) {
      if (isLastPlayedAvailable) {
        throw redirect("lastPlayed");
      }

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

  return redirect("/settings/general");
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  console.error(error);
  return (
    <>
      <h2>Error!</h2>
      <p>{error?.message}</p>
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

  const { isInFocus, switchFocus, enableFocus } =
    useFocus<FocusElement>("sidebar");

  const { categoryLinksRefCallback } = useGamepadsOnSidebar(isInFocus);

  const switchToMain = useCallback(() => {
    if (isInFocus) {
      switchFocus("main");
    }
  }, [isInFocus, switchFocus]);

  // TODO: add tests
  useGamepadButtonPressEvent(layout.buttons.DPadRight, switchToMain);
  useGamepadStickDirectionEvent("leftStickRight", switchToMain);
  useGamepadStickDirectionEvent("extraStickRight", switchToMain);
  useKeyboardEvent("ArrowRight", switchToMain);
  useGamepadButtonPressEvent(layout.buttons.A, switchToMain);
  useKeyboardEvent("Enter", switchToMain);
  useOpenSettings(isInFocus);
  useImportButton(isInFocus, "importGames");

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
