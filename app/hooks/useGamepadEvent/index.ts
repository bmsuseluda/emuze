import { useEffect } from "react";
import type { StickDirection } from "../useGamepads/layouts";

export const useGamepadButtonPressEvent = (
  index: number,
  onGamepadEvent: (event: Event) => void,
) => {
  useEffect(() => {
    addEventListener(`gamepadonbutton${index}press`, onGamepadEvent);

    return () => {
      removeEventListener(`gamepadonbutton${index}press`, onGamepadEvent);
    };
  }, [index, onGamepadEvent]);
};

export const useGamepadStickDirectionEvent = (
  stickDirection: StickDirection,
  onGamepadEvent: (event: Event) => void,
) => {
  useEffect(() => {
    addEventListener(`gamepadon${stickDirection}`, onGamepadEvent);

    return () => {
      removeEventListener(`gamepadon${stickDirection}`, onGamepadEvent);
    };
  }, [stickDirection, onGamepadEvent]);
};

export const useKeyboardEvent = (
  keyboardKey: string,
  onKeyboardEvent: (e: KeyboardEvent) => void,
) => {
  useEffect(() => {
    const handleKeyboardEvent = (e: KeyboardEvent) => {
      if (e.key === keyboardKey) {
        e.preventDefault();
        onKeyboardEvent(e);
      }
    };

    addEventListener("keydown", handleKeyboardEvent);

    return () => {
      removeEventListener("keydown", handleKeyboardEvent);
    };
  }, [keyboardKey, onKeyboardEvent]);
};
