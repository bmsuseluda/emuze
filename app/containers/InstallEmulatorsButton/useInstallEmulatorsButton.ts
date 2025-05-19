import { layout } from "../../hooks/useGamepads/layouts/index.js";
import { useCallback } from "react";
import { useGamepadButtonPressEvent } from "../../hooks/useGamepadEvent/index.js";
import { useKeyboardEvent } from "../../hooks/useKeyboardEvent/index.js";

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
