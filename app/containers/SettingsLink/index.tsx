import { SettingsLink as SettingsLinkComponent } from "../../components/SettingsLink";
import { useFullscreen } from "../../hooks/useFullscreen";
import type { FocusElement } from "../../types/focusElement";
import { openSettingsId, useOpenSettings } from "./useOpenSettings";

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
