import { Main } from "./components/Main/index.js";
import { Sidebar } from "./components/Sidebar/index.js";
import type { ReactNode } from "react";
import { styled } from "../../../../styled-system/jsx/index.js";

interface Props {
  children: ReactNode;
}

const Layout = styled("div", {
  base: {
    display: "flex",
    flex: 1,
    color: "color",
    height: "100%",
  },
});

export const SidebarMainLayout = ({ children, ...rest }: Props) => (
  <Layout {...rest}>{children}</Layout>
);

SidebarMainLayout.Sidebar = Sidebar;
SidebarMainLayout.Main = Main;
