import { useEffect } from "react";
import { useThrottlePress } from "../useThrottlePress";

export const useKeyboardEvent = (
  keyboardKey: string,
  onKeyboardEvent: (e: KeyboardEvent) => void,
) => {
  const { throttleFunction } = useThrottlePress();

  useEffect(() => {
    const handleKeyboardEvent = (e: KeyboardEvent) => {
      if (e.key === keyboardKey) {
        e.preventDefault();

        const functionToThrottle = () => {
          onKeyboardEvent(e);
        };
        throttleFunction(functionToThrottle, 0);
      }
    };
    addEventListener("keydown", handleKeyboardEvent);

    return () => {
      removeEventListener("keydown", handleKeyboardEvent);
    };
  }, [keyboardKey, onKeyboardEvent, throttleFunction]);
};
