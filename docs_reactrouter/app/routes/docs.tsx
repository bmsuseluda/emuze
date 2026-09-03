import { Outlet } from "react-router";
import { SidebarMainLayout } from "../../../app/components/layouts/SidebarMainLayout/index.js";
import { SidebarNavigationLink } from "../../../app/containers/SidebarNavigationLink/index.js";
import { Header } from "../../../app/containers/Header/index.js";
import { SystemIcon } from "../../../app/components/SystemIcon/index.js";
import { Typography } from "../../../app/components/Typography/index.js";
import { styled } from "../../../styled-system/jsx/index.js";
import { categories as categoriesFromServer } from "../../../app/server/categoriesDB.server/index.js";
import type { SystemId } from "../../../app/server/categoriesDB.server/systemId.js";

export const loader = () => {
  const categoryLinks: LinkList[] = [];
  Object.entries(categoriesFromServer).forEach(([id, { names }]) => {
    if (id !== "lastPlayed") {
      categoryLinks.push({
        id: id as SystemId,
        name: names.at(0)!,
        to: `/systems/${id}`,
      });
    }
  });

  return {
    categoryLinks,
  };
};

const Name = styled(Typography, {
  base: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
});

interface LinkList {
  id: SystemId;
  name: string;
  to: string;
}

export default function Docs({ loaderData: { categoryLinks } }) {
  const collapseSidebar = false;
  return (
    <>
      <SidebarMainLayout>
        <SidebarMainLayout.Sidebar
          header={<Header collapse={collapseSidebar} />}
          collapse={collapseSidebar}
        >
          {categoryLinks.map(({ id, name, to }) => (
            <li key={to}>
              <SidebarNavigationLink
                to={to}
                icon={<SystemIcon id={id} />}
                aria-label={name}
                //   onClick={onLinkClick}
                //   isFocused={isInFocus}
              >
                {collapseSidebar ? undefined : <Name>{name}</Name>}
              </SidebarNavigationLink>
            </li>
          ))}
        </SidebarMainLayout.Sidebar>
        <SidebarMainLayout.Main>
          <Outlet />
        </SidebarMainLayout.Main>
      </SidebarMainLayout>
    </>
  );
}
