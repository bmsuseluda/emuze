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
import type { FocusElement } from "~/types/focusElement";
import { useCallback, useEffect } from "react";
import {
  useGamepadButtonPressEvent,
  useGamepadStickDirectionEvent,
  useKeyboardEvent,
} from "~/hooks/useGamepadEvent";
import { layout } from "~/hooks/useGamepads/layouts";
import { Dialog } from "~/components/Dialog";

export const loader = () => {
  const { collapseSidebar } = readAppearance();

  return json({ categories, collapseSidebar });
};

export default function Index() {
  // TODO: check if collapse is good here
  const { categories, collapseSidebar } = useLoaderData<typeof loader>();

  const { isInFocus, switchFocus } = useFocus<FocusElement>("settingsSidebar");

  useEffect(() => {
    switchFocus("settingsSidebar");
  }, [switchFocus]);

  const { refCallback } = useGamepadsOnSidebar(0, isInFocus);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    // TODO: should be the element where we came from
    switchFocus("main");
    // TODO: use useState for dialog open and add some delay to show close animation
    // TODO: replace with robust solution
    navigate(pathname.split("/settings")[0]);
  }, [pathname, navigate, switchFocus]);

  const handleCloseOnFocus = useCallback(() => {
    if (isInFocus) {
      handleClose();
    }
  }, [isInFocus, handleClose]);

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
  useGamepadButtonPressEvent(layout.buttons.B, handleCloseOnFocus);
  useKeyboardEvent("Backspace", handleCloseOnFocus);

  return (
    <Dialog open onClose={handleClose}>
      <SidebarMainLayout>
        <SidebarMainLayout.Sidebar
          headline="Settings"
          collapse={collapseSidebar}
          isFullscreen
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
        <SidebarMainLayout.Main isFullscreen>
          <Outlet />
        </SidebarMainLayout.Main>
      </SidebarMainLayout>
    </Dialog>
  );
}
