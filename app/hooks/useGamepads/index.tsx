import { useCallback, useEffect, useRef, useState } from "react";
import type { StickDirection } from "~/hooks/useGamepads/layouts";
import { layout } from "~/hooks/useGamepads/layouts";
import type { GamepadType } from "~/hooks/useGamepads/gamepadTypeMapping";
import { identifyGamepadType } from "~/hooks/useGamepads/gamepadTypeMapping";

const findGamepad = (gamepads: (Gamepad | null)[], gamepadIndex: number) =>
  gamepads.find((gamepad) => gamepad?.index === gamepadIndex);

const isStickPressed = (stickValue: number) => {
  const normalizedStickValue = stickValue < 0 ? stickValue * -1 : stickValue;
  return normalizedStickValue > 0.5;
};

const dispatchStickDirectionEvent = (stickDirection: StickDirection) => {
  dispatchEvent(new CustomEvent(`gamepadon${stickDirection}`));
};

export const useGamepads = () => {
  const oldGamepads = useRef<(Gamepad | null)[]>([]);
  const requestAnimationFrameRef = useRef<number>();
  const focusRef = useRef<boolean>(true);
  const [isGamepadConnected, setGamepadConnected] = useState(false);
  const [gamepadType, setGamepadType] = useState<GamepadType>();

  const fireEventOnButtonPress = useCallback((gamepads: (Gamepad | null)[]) => {
    if (!document.hidden && document.visibilityState === "visible") {
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
    }

    oldGamepads.current = gamepads;
  }, []);

  const update = useCallback(() => {
    if (requestAnimationFrameRef.current) {
      const gamepads = navigator.getGamepads();
      if (gamepads && gamepads.length > 0 && gamepads.find(Boolean)) {
        fireEventOnButtonPress(gamepads);
        if (focusRef.current) {
          requestAnimationFrameRef.current = requestAnimationFrame(update);
        }
      } else {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }
    }
  }, [fireEventOnButtonPress]);

  useEffect(() => {
    window.addEventListener("gamepadconnected", ({ gamepad: { id } }) => {
      setGamepadConnected(true);
      setGamepadType((gamepadType) => gamepadType || identifyGamepadType(id));

      requestAnimationFrameRef.current = requestAnimationFrame(update);
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden && requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      } else {
        requestAnimationFrameRef.current = requestAnimationFrame(update);
      }
    });

    // TODO: find a way to move electron specific functions out of here
    window.electronAPI &&
      window.electronAPI.onBlur(() => {
        if (requestAnimationFrameRef.current) {
          console.log("blur");
          focusRef.current = false;
          cancelAnimationFrame(requestAnimationFrameRef.current);
        }
      });

    window.electronAPI &&
      window.electronAPI.onFocus(() => {
        console.log("focus");
        focusRef.current = true;
        requestAnimationFrameRef.current = requestAnimationFrame(update);
      });

    return () => {
      if (requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }
    };
  }, [update]);

  return {
    isGamepadConnected,
    gamepadType,
  };
};
