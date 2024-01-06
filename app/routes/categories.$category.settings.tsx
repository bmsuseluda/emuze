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
import { useCallback, useMemo } from "react";
import {
  useGamepadButtonPressEvent,
  useGamepadStickDirectionEvent,
  useKeyboardEvent,
} from "~/hooks/useGamepadEvent";
import { layout } from "~/hooks/useGamepads/layouts";
import { Dialog } from "~/components/Dialog";
import { readCategories } from "~/server/categories.server";

export const loader = () => {
  const { collapseSidebar } = readAppearance();
  const platforms = readCategories();

  return json({ categories, collapseSidebar, platforms });
};

export default function Index() {
  // TODO: check if collapse is good here
  const { categories, collapseSidebar, platforms } =
    useLoaderData<typeof loader>();

  const closable = useMemo(() => platforms.length > 0, [platforms]);

  const { isInFocus, switchFocus, switchFocusBack, enableFocus } =
    useFocus<FocusElement>("settingsSidebar");

  const { categoryLinksRefCallback } = useGamepadsOnSidebar(isInFocus);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    if (closable) {
      switchFocusBack();
      // TODO: use useState for dialog open and add some delay to show close animation
      // TODO: replace with robust solution
      navigate(pathname.split("/settings")[0]);
    }
  }, [pathname, navigate, switchFocusBack, closable]);

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

  // TODO: think about if this should be a callback from useGamepadsOnSidebar
  const onLinkClick = useCallback(() => {
    if (!isInFocus) {
      enableFocus();
    }
  }, [isInFocus, enableFocus]);

  return (
    <Dialog open onClose={handleClose} closable={closable}>
      <SidebarMainLayout>
        <SidebarMainLayout.Sidebar
          headline="Settings"
          collapse={collapseSidebar}
        >
          {categories.map(({ id, name }, index) => (
            <li key={id}>
              <Link
                to={id}
                ref={categoryLinksRefCallback(index)}
                icon={<SettingsIcon id={id} />}
                onClick={onLinkClick}
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
