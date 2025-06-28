import { useEffect } from "react";
import { useThrottlePress } from "../useThrottlePress/index.js";
import { useGamepadConnected } from "../useGamepadConnected/index.js";

export const useKeyboardEvent = (
  keyboardKey: string,
  onKeyboardEvent: (e: KeyboardEvent) => void,
  keyboardEventType: "keydown" | "keyup" = "keyup",
) => {
  const { throttleFunction } = useThrottlePress();
  const { isEnabled } = useGamepadConnected();

  useEffect(() => {
    const handleKeyboardEvent = (e: KeyboardEvent) => {
      if (e.key === keyboardKey) {
        e.preventDefault();

        const functionToThrottle = () => {
          if (isEnabled.current) {
            onKeyboardEvent(e);
          }
        };
        throttleFunction(functionToThrottle, 0);
      }
    };
    const preventDefault = (e: KeyboardEvent) => {
      e.preventDefault();
    };

    addEventListener(keyboardEventType, handleKeyboardEvent);
    if (keyboardEventType === "keyup") {
      addEventListener("keydown", preventDefault);
    }

    return () => {
      removeEventListener(keyboardEventType, handleKeyboardEvent);
      if (keyboardEventType === "keyup") {
        removeEventListener("keydown", preventDefault);
      }
    };
  }, [
    keyboardKey,
    onKeyboardEvent,
    throttleFunction,
    isEnabled,
    keyboardEventType,
  ]);
};
