import { useCallback, useEffect, useRef } from "react";
import { layout } from "~/hooks/useGamepads/layouts";
import type { StickDirection } from "~/hooks/useGamepads/layouts";

const findGamepad = (gamepads: (Gamepad | null)[], gamepadIndex: number) =>
  gamepads.find((gamepad) => gamepad?.index === gamepadIndex);

const stickPressed = (stickValue: number) => {
  const normalizedStickValue = stickValue < 0 ? stickValue * -1 : stickValue;
  return normalizedStickValue > 0.5;
};

const dispatchStickDirectionEvent = (stickDirection: StickDirection) => {
  dispatchEvent(new CustomEvent(`gamepadon${stickDirection}`));
};

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
        gamepad.axes.forEach((stickValue, index) => {
          if (
            !(
              oldGamepad?.axes[index] && stickPressed(oldGamepad.axes[index])
            ) &&
            stickPressed(stickValue)
          ) {
            switch (index) {
              case layout.axes.leftStickX: {
                if (stickValue > 0) {
                  dispatchStickDirectionEvent("leftStickRight");
                } else {
                  dispatchStickDirectionEvent("leftStickLeft");
                }
                break;
              }
              case layout.axes.leftStickY: {
                if (stickValue > 0) {
                  dispatchStickDirectionEvent("leftStickDown");
                } else {
                  dispatchStickDirectionEvent("leftStickUp");
                }
                break;
              }
              case layout.axes.rightStickX: {
                if (stickValue > 0) {
                  dispatchStickDirectionEvent("rightStickRight");
                } else {
                  dispatchStickDirectionEvent("rightStickLeft");
                }
                break;
              }
              case layout.axes.rightStickY: {
                if (stickValue > 0) {
                  dispatchStickDirectionEvent("rightStickDown");
                } else {
                  dispatchStickDirectionEvent("rightStickUp");
                }
                break;
              }
            }
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

  // TODO: runs all the time. it only needs to run when a gamepad is connected
  useEffect(() => {
    requestAnimationFrameRef.current = requestAnimationFrame(update);
    return () => {
      if (requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }
    };
  }, [update]);
};
