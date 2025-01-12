import { useEffect } from "react";
import { useThrottlePress } from "../useThrottlePress";
import { useGamepadConnected } from "../useGamepadConnected";

export const useKeyboardEvent = (
  keyboardKey: string,
  onKeyboardEvent: (e: KeyboardEvent) => void,
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
    addEventListener("keydown", handleKeyboardEvent);

    return () => {
      removeEventListener("keydown", handleKeyboardEvent);
    };
  }, [keyboardKey, onKeyboardEvent, throttleFunction, isEnabled]);
};
