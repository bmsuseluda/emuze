import { useEffect } from "react";
import type { StickDirection } from "~/hooks/useGamepads/layouts";

export const useGamepadButtonPressEvent = (
  index: number,
  onGamepadEvent: () => void
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
  onGamepadEvent: () => void
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
  onKeyboardEvent: () => void
) => {
  useEffect(() => {
    const handleKeyboardEvent = (e: KeyboardEvent) => {
      if (e.key === keyboardKey) {
        e.preventDefault();
        onKeyboardEvent();
      }
    };

    addEventListener("keydown", handleKeyboardEvent);

    return () => {
      removeEventListener("keydown", handleKeyboardEvent);
    };
  }, [keyboardKey, onKeyboardEvent]);
};
