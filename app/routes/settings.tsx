import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { SidebarMainLayout } from "~/components/layouts/SidebarMainLayout";
import { Header } from "~/containers/Header";
import { Link } from "~/containers/Link";
import { categories, readAppearance } from "~/server/settings.server";
import { useGamepadsOnSidebar } from "~/hooks/useGamepadsOnSidebar";
import { SettingsIcon } from "~/components/SettingsIcon";
import { useFocus } from "~/hooks/useFocus";
import type { FocusElements } from "~/types/focusElements";
import { useCallback } from "react";
import {
  useGamepadButtonPressEvent,
  useGamepadStickDirectionEvent,
  useKeyboardEvent,
} from "~/hooks/useGamepadEvent";
import { layout } from "~/hooks/useGamepads/layouts";

export const meta: MetaFunction = () => {
  return {
    title: "Settings",
    description: "Configure to your needs",
  };
};

export const loader = () => {
  const { collapseSidebar } = readAppearance();

  return json({ categories, collapseSidebar });
};

export default function Index() {
  const { categories, collapseSidebar } = useLoaderData<typeof loader>();

  const { isInFocus, switchFocus } = useFocus<FocusElements>("sidebar");

  const { refCallback } = useGamepadsOnSidebar(0, isInFocus);

  const switchToMain = useCallback(() => {
    if (isInFocus) {
      switchFocus("main");
    }
  }, [isInFocus, switchFocus]);

  // TODO: add tests
  useGamepadButtonPressEvent(layout.buttons.DPadRight, switchToMain);
  useGamepadStickDirectionEvent("leftStickRight", switchToMain);
  useKeyboardEvent("ArrowRight", switchToMain);
  useGamepadButtonPressEvent(layout.buttons.A, switchToMain);
  useKeyboardEvent("Enter", switchToMain);

  return (
    <SidebarMainLayout>
      <SidebarMainLayout.Sidebar
        header={<Header collapse={collapseSidebar} />}
        headline="Settings"
        collapse={collapseSidebar}
      >
        {categories.map(({ id, name }, index) => (
          <Link
            to={id}
            key={id}
            ref={refCallback(index)}
            icon={<SettingsIcon id={id} />}
          >
            {collapseSidebar ? undefined : name}
          </Link>
        ))}
      </SidebarMainLayout.Sidebar>
      <SidebarMainLayout.Main>
        <Outlet />
      </SidebarMainLayout.Main>
    </SidebarMainLayout>
  );
}
