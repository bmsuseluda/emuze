import { json } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import { SidebarMainLayout } from "../components/layouts/SidebarMainLayout";
import { Link } from "../containers/Link";
import { categories, readAppearance } from "../server/settings.server";
import { useGamepadsOnSidebar } from "../hooks/useGamepadsOnSidebar";
import { SettingsIcon } from "../components/SettingsIcon";
import { useFocus } from "../hooks/useFocus";
import type { FocusElement } from "../types/focusElement";
import { useCallback, useMemo } from "react";
import { Dialog } from "../components/Dialog";
import { useImportButton } from "../containers/ImportButton/useImportButton";
import { useInstallEmulatorsButton } from "../containers/InstallEmulatorsButton/useInstallEmulatorsButton";
import {
  useDirectionalInputRight,
  useInputBack,
  useInputConfirmation,
  useInputSettings,
} from "../hooks/useDirectionalInput";

export const loader = () => {
  const { collapseSidebar } = readAppearance();

  return json({ categories, collapseSidebar });
};

export default function Index() {
  const { categories, collapseSidebar } = useLoaderData<typeof loader>();

  const { pathname } = useLocation();

  const closable = useMemo(() => !pathname.startsWith("/settings"), [pathname]);

  const { isInFocus, switchFocus, switchFocusBackMultiple, enableFocus } =
    useFocus<FocusElement>("settingsSidebar");

  const { categoryLinksRefCallback } = useGamepadsOnSidebar(isInFocus);
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    if (closable) {
      switchFocusBackMultiple("settingsMain", "settingsSidebar");
      // TODO: replace with robust solution
      navigate(pathname.split("/settings")[0]);
    }
  }, [pathname, navigate, switchFocusBackMultiple, closable]);

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

  useDirectionalInputRight(switchToMain);
  useInputConfirmation(switchToMain);
  useInputBack(handleCloseOnFocus);
  useInputSettings(handleClose);
  useImportButton(isInFocus, "importAll");
  useInstallEmulatorsButton(isInFocus);

  // TODO: think about if this should be a callback from useGamepadsOnSidebar
  const onLinkClick = useCallback(() => {
    if (!isInFocus) {
      enableFocus();
    }
  }, [isInFocus, enableFocus]);

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      closable={closable}
      smaller={collapseSidebar}
    >
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
                isFocused={isInFocus}
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
