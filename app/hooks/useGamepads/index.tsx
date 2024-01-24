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

const isValveGamepad = (gamepad: Gamepad | null) =>
  gamepad && gamepad.id.includes("Vendor: 28de");

const isMaskedGamepad = (valveGamepads: (Gamepad | null)[], gamepad: Gamepad) =>
  valveGamepads.find(
    (valveGamepad) =>
      valveGamepad &&
      Math.abs(valveGamepad.timestamp - gamepad.timestamp) <= 10,
  );

export const excludeMaskedGamepads = (gamepads: (Gamepad | null)[]) => {
  const valveGamepads = filterValveGamepads(gamepads);

  return gamepads.filter(
    (gamepad) =>
      gamepad &&
      (isValveGamepad(gamepad) || !isMaskedGamepad(valveGamepads, gamepad)),
  );
};

const filterValveGamepads = (gamepads: (Gamepad | null)[]) =>
  gamepads.filter(isValveGamepad);

export const identifyGamepadTypeUnmasked = (gamepad: Gamepad) => {
  if (isValveGamepad(gamepad)) {
    const maskedGamepad = navigator
      .getGamepads()
      .find(
        (otherGamepad) =>
          otherGamepad && isMaskedGamepad([gamepad], otherGamepad),
      );

    if (maskedGamepad) {
      return identifyGamepadType(maskedGamepad.id);
    }
  } else {
    return identifyGamepadType(gamepad.id);
  }
};

export const useGamepads = () => {
  const oldGamepads = useRef<(Gamepad | null)[]>([]);
  const requestAnimationFrameRef = useRef<number>();
  const focusRef = useRef<boolean>(true);
  const [gamepadType, setGamepadType] = useState<GamepadType>();

  // TODO: split function
  const fireEventOnButtonPress = useCallback((gamepads: (Gamepad | null)[]) => {
    if (!document.hidden && document.visibilityState === "visible") {
      gamepads.forEach((gamepad) => {
        if (gamepad) {
          const oldGamepad = findGamepad(oldGamepads.current, gamepad.index);
          gamepad.buttons.forEach((button, index) => {
            if (!oldGamepad?.buttons[index]?.pressed && button.pressed) {
              setGamepadType(identifyGamepadTypeUnmasked(gamepad));
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
              setGamepadType(identifyGamepadTypeUnmasked(gamepad));

              // TODO: simplify with generic function
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
                case layout.axes.extraStickX: {
                  if (stickValue > 0) {
                    dispatchStickDirectionEvent("extraStickRight");
                  } else {
                    dispatchStickDirectionEvent("extraStickLeft");
                  }
                  break;
                }
                case layout.axes.extraStickY: {
                  if (stickValue > 0) {
                    dispatchStickDirectionEvent("extraStickDown");
                  } else {
                    dispatchStickDirectionEvent("extraStickUp");
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
    if (focusRef.current) {
      const gamepads = navigator.getGamepads();
      if (gamepads.length > 0 && gamepads.find(Boolean)) {
        fireEventOnButtonPress(excludeMaskedGamepads(gamepads));
      }
      requestAnimationFrameRef.current = requestAnimationFrame(update);
    }
  }, [fireEventOnButtonPress]);

  const disableGamepads = useCallback(() => {
    focusRef.current = false;
    if (requestAnimationFrameRef.current) {
      cancelAnimationFrame(requestAnimationFrameRef.current);
    }
  }, []);

  const enableGamepads = useCallback(() => {
    focusRef.current = true;
    requestAnimationFrameRef.current = requestAnimationFrame(update);
  }, [update]);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      disableGamepads();
    } else {
      enableGamepads();
    }
  }, [enableGamepads, disableGamepads]);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  useEffect(() => {
    enableGamepads();

    return () => {
      if (requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }
    };
  }, [enableGamepads]);

  return {
    gamepadType,
    disableGamepads,
    enableGamepads,
  };
};
