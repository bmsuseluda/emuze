import { SettingsLink as SettingsLinkComponent } from "../../components/SettingsLink";
import { useFullscreen } from "../../hooks/useFullscreen";
import type { ElementRef } from "react";
import { useCallback, useRef } from "react";
import type { FocusElement } from "../../types/focusElement";
import {
  useGamepadButtonPressEvent,
  useKeyboardEvent,
} from "../../hooks/useGamepadEvent";
import { layout } from "../../hooks/useGamepads/layouts";

interface Props {
  isInFocus: boolean;
  switchFocus: (nextFocusElement: FocusElement) => void;
}

export const SettingsLink = ({ isInFocus, switchFocus }: Props) => {
  const isFullscreen = useFullscreen();
  const settingsButtonRef = useRef<ElementRef<"a">>(null);

  const onSettings = useCallback(() => {
    if (isInFocus) {
      settingsButtonRef.current?.click();
    }
  }, [isInFocus]);

  useGamepadButtonPressEvent(layout.buttons.Start, onSettings);
  useKeyboardEvent("Escape", onSettings);

  return (
    <SettingsLinkComponent
      isFullscreen={isFullscreen}
      onClick={() => {
        switchFocus("settingsSidebar");
      }}
      ref={settingsButtonRef}
    />
  );
};
