import type { CSS } from "@stitches/react";
import { Box } from "~/components/Box";
import { styled } from "~/stitches";
import { Main } from "./components/Main";
import { Sidebar } from "./components/Sidebar";

interface Props {
  children: React.ReactNode;
  css?: CSS;
}

const Layout = styled(Box, {
  display: "flex",
  flex: 1,
  backgroundColor: "$backgroundColor",
  color: "$color",
});

export const SidebarMainLayout = ({ children, ...rest }: Props) => (
  <Layout {...rest}>{children}</Layout>
);

SidebarMainLayout.Sidebar = Sidebar;
SidebarMainLayout.Main = Main;
