import { SettingsLink as SettingsLinkComponent } from "../../components/SettingsLink/index.js";
import { useFullscreen } from "../../hooks/useFullscreen/index.js";
import type { FocusElement } from "../../types/focusElement.js";
import { openSettingsId, useOpenSettings } from "./useOpenSettings.js";

interface Props {
  isInFocus: boolean;
  switchFocus: (nextFocusElement: FocusElement) => void;
}

export const SettingsLink = ({ isInFocus, switchFocus }: Props) => {
  const isFullscreen = useFullscreen();

  useOpenSettings(isInFocus);

  return (
    <SettingsLinkComponent
      id={openSettingsId}
      isFullscreen={isFullscreen}
      onClick={() => {
        switchFocus("settingsSidebar");
      }}
    />
  );
};
