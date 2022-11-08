import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Outlet,
  useLoaderData,
  useMatches,
  useTransition,
} from "@remix-run/react";
import { IoMdRefresh } from "react-icons/io";
import { Button } from "~/components/Button";
import { importCategories, readCategories } from "~/server/categories.server";
import { SidebarMainLayout } from "~/components/layouts/SidebarMainLayout";
import { Link } from "~/containers/Link";
import { Header } from "~/containers/Header";
import { useTestId } from "~/hooks/useTestId";
import { importApplications } from "~/server/applications.server";
import { PlatformIcon } from "~/components/PlatformIcon";
import type { PlatformId } from "~/types/platforms";
import { useGamepads } from "~/hooks/useGamepads";
import layout from "~/hooks/useGamepads/layouts/xbox";
import { useRef, useState } from "react";

type CategoryLinks = Array<{ id: PlatformId; name: string; to: string }>;

export const loader: LoaderFunction = () => {
  const categories = readCategories();
  const categoryLinks = categories.map(({ id, name }) => ({
    to: `/categories/${id}`,
    id,
    name,
  }));

  return json(categoryLinks);
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const _actionId = form.get("_actionId");
  if (_actionId === "import") {
    importApplications();
    await importCategories();
    return redirect("/categories");
  }

  return null;
};

export const meta: MetaFunction = () => {
  return {
    title: "Library",
    description: "Your library",
  };
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

export default function Index() {
  const categoryLinks = useLoaderData<CategoryLinks>();
  const categoryLinksRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const { state } = useTransition();
  const { getTestId } = useTestId("categories");
  const [focusOnGames, setFocusOnGames] = useState(false);

  const selectLink = (index: number) => {
    categoryLinksRefs.current[index]?.focus();
    categoryLinksRefs.current[index]?.click();
  };

  const matches = useMatches();
  useGamepads([
    {
      gamepadIndex: 0,
      onButtonPress: (buttonId) => {
        const pathname = matches[matches.length - 1].pathname;
        if (!focusOnGames) {
          if (layout.buttons.DPadDown === buttonId) {
            if (pathname === "/categories/") {
              selectLink(0);
            } else {
              const currentIndex = categoryLinks.findIndex(
                ({ to }) => to === pathname
              );
              if (currentIndex < categoryLinks.length - 1) {
                selectLink(currentIndex + 1);
              } else {
                selectLink(0);
              }
            }
          }

          if (layout.buttons.DPadUp === buttonId) {
            if (pathname === "/categories/") {
              selectLink(categoryLinks.length - 1);
            } else {
              const currentIndex = categoryLinks.findIndex(
                ({ to }) => to === pathname
              );
              if (currentIndex === 0) {
                selectLink(categoryLinks.length - 1);
              } else {
                selectLink(currentIndex - 1);
              }
            }
          }

          if (
            [layout.buttons.DPadRight, layout.buttons.A].includes(buttonId) &&
            pathname !== "/categories/"
          ) {
            setFocusOnGames(true);
          }
        } else {
          if (layout.buttons.B === buttonId) {
            setFocusOnGames(false);
          }
        }
      },
    },
  ]);

  return (
    <SidebarMainLayout>
      <SidebarMainLayout.Sidebar
        header={<Header />}
        headline="Platforms"
        actions={
          <Form method="post">
            <Button
              type="submit"
              name="_actionId"
              disabled={state !== "idle"}
              value="import"
              icon={<IoMdRefresh />}
            >
              Import all
            </Button>
          </Form>
        }
      >
        {categoryLinks.map(({ id, name, to }) => (
          <Link
            to={to}
            icon={<PlatformIcon id={id} />}
            key={to}
            ref={(ref) => {
              categoryLinksRefs.current.push(ref);
            }}
            {...getTestId(["link", to])}
          >
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
