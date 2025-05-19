import { Outlet, redirect, useLoaderData } from "react-router";
import { readCategories } from "../server/categories.server.js";
import { SidebarMainLayout } from "../components/layouts/SidebarMainLayout/index.js";
import { Link } from "../containers/Link/index.js";
import { Header } from "../containers/Header/index.js";
import { SystemIcon } from "../components/SystemIcon/index.js";
import { useGamepadsOnSidebar } from "../hooks/useGamepadsOnSidebar/index.js";
import { readAppearance } from "../server/settings.server.js";
import { useCallback } from "react";
import { useFocus } from "../hooks/useFocus/index.js";
import type { FocusElement } from "../types/focusElement.js";
import { Typography } from "../components/Typography/index.js";
import { styled } from "../../styled-system/jsx/index.js";
import type { DataFunctionArgs } from "../context.js";
import type { SystemId } from "../server/categoriesDB.server/systemId.js";
import { readLastPlayed } from "../server/lastPlayed.server.js";
import { useOpenSettings } from "../containers/SettingsLink/useOpenSettings.js";
import { useImportButton } from "../containers/ImportButton/useImportButton.js";
import {
  useDirectionalInputRight,
  useInputConfirmation,
} from "../hooks/useDirectionalInput/index.js";
import { CloseDialogContainer } from "../containers/CloseDialog/index.js";

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

    return {
      categoryLinks,
      collapseSidebar,
    };
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

  const { categoryLinksRefCallback } = useGamepadsOnSidebar(
    isInFocus,
    switchFocus,
  );

  const switchToMain = useCallback(() => {
    if (isInFocus) {
      switchFocus("main");
    }
  }, [isInFocus, switchFocus]);

  useDirectionalInputRight(switchToMain);
  useInputConfirmation(switchToMain);
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
              isFocused={isInFocus}
            >
              {collapseSidebar ? undefined : <Name>{name}</Name>}
            </Link>
          </li>
        ))}
      </SidebarMainLayout.Sidebar>
      <SidebarMainLayout.Main>
        <Outlet />
      </SidebarMainLayout.Main>
      <CloseDialogContainer />
    </SidebarMainLayout>
  );
}
