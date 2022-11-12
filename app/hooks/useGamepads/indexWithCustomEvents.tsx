import { useEffect, useRef } from "react";

const findGamepad = (gamepads: (Gamepad | null)[], gamepadIndex: number) =>
  gamepads.find((gamepad) => gamepad?.index === gamepadIndex);

export const useGamepads = () => {
  const oldGamepads = useRef<(Gamepad | null)[]>([]);
  const requestAnimationFrameRef = useRef<number>();

  const fireEventOnButtonPress = (gamepads: (Gamepad | null)[]) => {
    gamepads.forEach((gamepad) => {
      if (gamepad) {
        const oldGamepad = findGamepad(oldGamepads.current, gamepad.index);
        gamepad.buttons.forEach((button, index) => {
          if (!oldGamepad?.buttons[index].pressed && button.pressed) {
            dispatchEvent(new CustomEvent(`gamepadonbutton${index}press`));
          }
        });
      }
    });
    oldGamepads.current = gamepads;
  };

  const updateGamepads = () => {
    const gamepads = navigator.getGamepads();
    if (gamepads) {
      fireEventOnButtonPress(gamepads);
    }
  };

  const update = () => {
    updateGamepads();
    requestAnimationFrameRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    console.log("start requestAnimationFrame");
    requestAnimationFrameRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestAnimationFrameRef.current!);
  }, []);
};
