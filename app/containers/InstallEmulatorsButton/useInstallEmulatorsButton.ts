import { useCallback } from "react";
import { useGamepadButtonPressEvent } from "../../hooks/useGamepadEvent/index.js";
import { useKeyboardEvent } from "../../hooks/useKeyboardEvent/index.js";
import type { ButtonId } from "../../types/gamepad.js";

export const installEmulatorsId = "installMissingEmulators";
export const installEmulatorsButtonGamepadButtonId: ButtonId = "y";

export const useInstallEmulatorsButton = (isInFocus: boolean) => {
  const onInstallEmulators = useCallback(() => {
    if (isInFocus) {
      document.getElementById(installEmulatorsId)?.click();
    }
  }, [isInFocus]);

  useGamepadButtonPressEvent(
    installEmulatorsButtonGamepadButtonId,
    onInstallEmulators,
  );
  useKeyboardEvent("e", onInstallEmulators);
};
