import { useEffect } from "react";
import type { StickDirection } from "../useGamepads/layouts/index.js";

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
