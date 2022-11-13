import { useEffect } from "react";

export const useGamepadEvent = (index: number, onGamepadEvent: () => void) => {
  useEffect(() => {
    addEventListener(`gamepadonbutton${index}press`, onGamepadEvent);

    return () => {
      removeEventListener(`gamepadonbutton${index}press`, onGamepadEvent);
    };
  }, [index, onGamepadEvent]);
};
