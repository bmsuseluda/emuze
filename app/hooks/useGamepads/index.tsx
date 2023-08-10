import { useCallback, useEffect, useRef } from "react";
import type { StickDirection } from "~/hooks/useGamepads/layouts";
import { layout } from "~/hooks/useGamepads/layouts";

const findGamepad = (gamepads: (Gamepad | null)[], gamepadIndex: number) =>
  gamepads.find((gamepad) => gamepad?.index === gamepadIndex);

const isStickPressed = (stickValue: number) => {
  const normalizedStickValue = stickValue < 0 ? stickValue * -1 : stickValue;
  return normalizedStickValue > 0.5;
};

const dispatchStickDirectionEvent = (stickDirection: StickDirection) => {
  dispatchEvent(new CustomEvent(`gamepadon${stickDirection}`));
};

// TODO: create npm package
export const useGamepads = () => {
  const oldGamepads = useRef<(Gamepad | null)[]>([]);
  const requestAnimationFrameRef = useRef<number>();

  const fireEventOnButtonPress = useCallback((gamepads: (Gamepad | null)[]) => {
    if (!document.hidden && document.visibilityState === "visible")
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
                oldGamepad?.axes[index] &&
                isStickPressed(oldGamepad.axes[index])
              ) &&
              isStickPressed(stickValue)
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

  // TODO: is a debounce necessary?
  const update = useCallback(() => {
    if (requestAnimationFrameRef.current) {
      const gamepads = navigator.getGamepads();
      if (gamepads && gamepads.length > 0 && gamepads.find(Boolean)) {
        fireEventOnButtonPress(gamepads);
        requestAnimationFrameRef.current = requestAnimationFrame(update);
      } else {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }
    }
  }, [fireEventOnButtonPress]);

  useEffect(() => {
    window.addEventListener("gamepadconnected", () => {
      requestAnimationFrameRef.current = requestAnimationFrame(update);
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden && requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      } else {
        requestAnimationFrameRef.current = requestAnimationFrame(update);
      }
    });

    return () => {
      if (requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }
    };
  }, [update]);
};
