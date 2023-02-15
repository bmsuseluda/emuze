import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import { SidebarMainLayout } from "~/components/layouts/SidebarMainLayout";
import { Link } from "~/containers/Link";
import { categories, readAppearance } from "~/server/settings.server";
import { useGamepadsOnSidebar } from "~/hooks/useGamepadsOnSidebar";
import { SettingsIcon } from "~/components/SettingsIcon";
import { useFocus } from "~/hooks/useFocus";
import type { FocusElements } from "~/types/focusElements";
import { useCallback, useEffect } from "react";
import {
  useGamepadButtonPressEvent,
  useGamepadStickDirectionEvent,
  useKeyboardEvent,
} from "~/hooks/useGamepadEvent";
import { layout } from "~/hooks/useGamepads/layouts";
import { Dialog } from "~/components/Dialog";

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
  // TODO: check if collapse is good here
  const { categories, collapseSidebar } = useLoaderData<typeof loader>();

  const { isInFocus, switchFocus } = useFocus<FocusElements>("settingsSidebar");

  useEffect(() => {
    switchFocus("settingsSidebar");
  }, [switchFocus]);

  const { refCallback } = useGamepadsOnSidebar(0, isInFocus);
  const location = useLocation();
  const navigate = useNavigate();

  const handleClose = () => {
    switchFocus("main");
    // TODO: use useState for dialog open and add some delay to show close animation
    // TODO: replace with robust solution
    navigate(location.pathname.split("/settings")[0]);
  };

  const switchToMain = useCallback(() => {
    if (isInFocus) {
      switchFocus("settingsMain");
    }
  }, [isInFocus, switchFocus]);

  // TODO: add tests
  useGamepadButtonPressEvent(layout.buttons.DPadRight, switchToMain);
  useGamepadStickDirectionEvent("leftStickRight", switchToMain);
  useKeyboardEvent("ArrowRight", switchToMain);
  useGamepadButtonPressEvent(layout.buttons.A, switchToMain);
  useKeyboardEvent("Enter", switchToMain);
  useKeyboardEvent("Escape", handleClose);
  useGamepadButtonPressEvent(layout.buttons.Start, handleClose);

  return (
    <Dialog open={true} onClose={handleClose}>
      <SidebarMainLayout>
        <SidebarMainLayout.Sidebar
          headline="Settings"
          collapse={collapseSidebar}
        >
          {categories.map(({ id, name }, index) => (
            <li key={id}>
              <Link
                to={id}
                ref={refCallback(index)}
                icon={<SettingsIcon id={id} />}
              >
                {collapseSidebar ? undefined : name}
              </Link>
            </li>
          ))}
        </SidebarMainLayout.Sidebar>
        <SidebarMainLayout.Main>
          <Outlet />
        </SidebarMainLayout.Main>
      </SidebarMainLayout>
    </Dialog>
  );
}
