import {
  useGamepadButtonPressEvent,
  useKeyboardEvent,
} from "../../hooks/useGamepadEvent";
import { layout } from "../../hooks/useGamepads/layouts";
import { useCallback } from "react";

export const openSettingsId = "openSettings";

export const useOpenSettings = (isInFocus: boolean) => {
  const onOpenSettings = useCallback(() => {
    if (isInFocus) {
      document.getElementById(openSettingsId)?.click();
    }
  }, [isInFocus]);

  useGamepadButtonPressEvent(layout.buttons.Start, onOpenSettings);
  useKeyboardEvent("Escape", onOpenSettings);
};
