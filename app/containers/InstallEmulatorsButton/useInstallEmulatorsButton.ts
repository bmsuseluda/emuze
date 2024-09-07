import { layout } from "../../hooks/useGamepads/layouts";
import { useCallback } from "react";
import { useGamepadButtonPressEvent } from "../../hooks/useGamepadEvent";
import { useKeyboardEvent } from "../../hooks/useKeyboardEvent";

export const installEmulatorsId = "installMissingEmulators";
export const installEmulatorsButtonGamepadButtonIndex = layout.buttons.Y;

export const useInstallEmulatorsButton = (isInFocus: boolean) => {
  const onInstallEmulators = useCallback(() => {
    if (isInFocus) {
      document.getElementById(installEmulatorsId)?.click();
    }
  }, [isInFocus]);

  useGamepadButtonPressEvent(
    installEmulatorsButtonGamepadButtonIndex,
    onInstallEmulators,
  );
  useKeyboardEvent("e", onInstallEmulators);
};
