import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { SidebarMainLayout } from "~/components/layouts/SidebarMainLayout";
import { Header } from "~/containers/Header";
import { Link } from "~/containers/Link";
import { categories } from "~/server/settings.server";
import { useGamepadsOnSidebar } from "~/hooks/useGamepads/useGamepadsOnSidebar";

export const meta: MetaFunction = () => {
  return {
    title: "Settings",
    description: "Configure to your needs",
  };
};

export const loader = () => {
  return json(categories);
};

export default function Index() {
  const categories = useLoaderData<typeof loader>();
  const { refCallback } = useGamepadsOnSidebar(categories, "/settings/");

  return (
    <SidebarMainLayout>
      <SidebarMainLayout.Sidebar header={<Header />} headline="Settings">
        {categories.map(({ id, name }) => (
          <Link to={id} key={id} ref={refCallback}>
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
