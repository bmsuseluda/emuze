import type { CSS } from "@stitches/react";
import { styled } from "~/stitches";
import { Main } from "./components/Main";
import { Sidebar } from "./components/Sidebar";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  css?: CSS;
}

const Layout = styled("div", {
  display: "flex",
  flex: 1,
  color: "$color",
  height: "100%",
});

export const SidebarMainLayout = ({ children, ...rest }: Props) => (
  <Layout {...rest}>{children}</Layout>
);

SidebarMainLayout.Sidebar = Sidebar;
SidebarMainLayout.Main = Main;
