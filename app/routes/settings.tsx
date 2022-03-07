import { MetaFunction, LoaderFunction, Outlet } from "remix";
import { useLoaderData, json } from "remix";
import { SidebarMainLayout } from "~/components/layouts/SidebarMainLayout";
import { Header } from "~/containers/Header";
import { Link } from "~/containers/Link";
import { Categories, categories } from "~/server/settings.server";

export const meta: MetaFunction = () => {
  return {
    title: "Settings",
    description: "Configure to your needs",
  };
};

export const loader: LoaderFunction = () => {
  return json(categories);
};

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
