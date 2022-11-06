import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { SidebarMainLayout } from "~/components/layouts/SidebarMainLayout";
import { Header } from "~/containers/Header";
import { Link } from "~/containers/Link";
import type { Categories } from "~/server/settings.server";
import { categories } from "~/server/settings.server";

export const meta: MetaFunction = () => {
  return {
    title: "Settings",
    description: "Configure to your needs",
  };
};

export const loader: LoaderFunction = () => {
  return json(categories);
};

interface GamepadRef {
  [key: number]: Gamepad;
}
export default function Index() {
  const categories = useLoaderData<Categories>();

  return (
    <SidebarMainLayout>
      <SidebarMainLayout.Sidebar header={<Header />} headline="Settings">
        {categories.map(({ id, name }) => (
          <Link to={id} key={id}>
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
