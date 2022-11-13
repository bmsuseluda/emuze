import { useCallback, useEffect, useRef } from "react";

const findGamepad = (gamepads: (Gamepad | null)[], gamepadIndex: number) =>
  gamepads.find((gamepad) => gamepad?.index === gamepadIndex);

export const useGamepads = () => {
  const oldGamepads = useRef<(Gamepad | null)[]>([]);
  const requestAnimationFrameRef = useRef<number>();

  const fireEventOnButtonPress = useCallback((gamepads: (Gamepad | null)[]) => {
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
  }, []);

  const updateGamepads = useCallback(() => {
    const gamepads = navigator.getGamepads();
    if (gamepads) {
      fireEventOnButtonPress(gamepads);
    }
  }, [fireEventOnButtonPress]);

  const update = useCallback(() => {
    updateGamepads();
    requestAnimationFrameRef.current = requestAnimationFrame(update);
  }, [updateGamepads]);

  useEffect(() => {
    requestAnimationFrameRef.current = requestAnimationFrame(update);
    return () => {
      if (requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }
    };
  }, [update]);
};
