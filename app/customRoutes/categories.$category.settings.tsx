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
import { useCallback, useEffect, useMemo } from "react";
import { Dialog } from "../components/Dialog";
import { useImportButton } from "../containers/ImportButton/useImportButton";
import { useInstallEmulatorsButton } from "../containers/InstallEmulatorsButton/useInstallEmulatorsButton";
import {
  useDirectionalInputRight,
  useInputBack,
  useInputConfirmation,
  useInputSettings,
} from "../hooks/useDirectionalInput";
import { CloseDialogContainer } from "../containers/CloseDialog";

export const loader = () => {
  const { collapseSidebar } = readAppearance();

  return json({ categories, collapseSidebar });
};

export default function Index() {
  const { categories, collapseSidebar } = useLoaderData<typeof loader>();

  const { pathname } = useLocation();

  const closable = useMemo(() => !pathname.startsWith("/settings"), [pathname]);

  const {
    isInFocus,
    switchFocus,
    switchFocusBackMultiple,
    enableFocus,
    focusHistory,
  } = useFocus<FocusElement>("settingsSidebar");

  useEffect(() => {
    if (!isInFocus && !focusHistory.current.at(-1)?.includes("settings")) {
      enableFocus();
    }
    // Should be executed only once, therefore isInFocus can not be part of the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { categoryLinksRefCallback } = useGamepadsOnSidebar(
    isInFocus,
    switchFocus,
    false,
  );
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    if (closable) {
      switchFocusBackMultiple("settingsMain", "settingsSidebar");
      // TODO: replace with robust solution
      navigate(pathname.split("/settings")[0]);
    } else {
      switchFocus("closeDialog");
    }
  }, [pathname, navigate, switchFocusBackMultiple, closable, switchFocus]);

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
      size={collapseSidebar ? "small" : "medium"}
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
      <CloseDialogContainer />
    </Dialog>
  );
}
