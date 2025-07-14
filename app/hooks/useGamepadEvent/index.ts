import { useEffect } from "react";
import {
  getGamepadButtonEventName,
  type ButtonId,
} from "../../types/gamepad.js";

export const useGamepadButtonPressEvent = (
  buttonId: ButtonId,
  onGamepadEvent: (event: Event) => void,
) => {
  useEffect(() => {
    addEventListener(getGamepadButtonEventName(buttonId), onGamepadEvent);

    return () => {
      removeEventListener(getGamepadButtonEventName(buttonId), onGamepadEvent);
    };
  }, [buttonId, onGamepadEvent]);
};
