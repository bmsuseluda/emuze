import { useEffect } from "react";
import layout from "~/hooks/useGamepads/layouts/xbox";

export const useGamepadEvent = (index: number, onGamepadEvent: () => void) => {
  useEffect(() => {
    addEventListener(`gamepadonbutton${index}press`, onGamepadEvent);

    return () => {
      removeEventListener(`gamepadonbutton${index}press`, onGamepadEvent);
    };
  }, []);
};
