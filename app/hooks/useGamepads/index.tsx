import type { MutableRefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { StickDirection } from "./layouts";
import { layout } from "./layouts";
import type { GamepadType } from "./gamepadTypeMapping";
import { identifyGamepadType } from "./gamepadTypeMapping";

const isStickPressed = (stickValue: number) => {
  const normalizedStickValue = stickValue < 0 ? stickValue * -1 : stickValue;
  return normalizedStickValue > 0.5;
};

const dispatchStickDirectionEvent = (stickDirection: StickDirection) => {
  dispatchEvent(new CustomEvent(`gamepadon${stickDirection}`));
};

const filterValveGamepads = (gamepads: (Gamepad | null)[]) =>
  gamepads.filter(isValveGamepad);

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

/**
 * Will return true if the oldGamepad is not set or the timestamp of the oldGamepad is older than 200ms.
 * This throttles firing an event on holding a button.
 *
 * @param oldGamepad Needs to be set only after an event should be fired.
 */
const isThrottled = (oldGamepad?: Gamepad | null) =>
  !oldGamepad || new Date().getTime() - oldGamepad.timestamp > 200;

/**
 * The timestamp of the tempGamepad will be set on every button press.
 * If the timestamp of the tempGamepad is older than 50ms, it is considered a single button press without holding the button.
 *
 * @param tempGamepad Needs to be set on every button press.
 */
const isSingleButtonPress = (tempGamepad?: Gamepad | null) =>
  !tempGamepad || new Date().getTime() - tempGamepad.timestamp > 50;

export const useGamepads = () => {
  const oldGamepads = useRef<Record<number, Gamepad>>({});
  const tempGamepads = useRef<Record<number, Gamepad>>({});
  const requestAnimationFrameRef = useRef<number>();
  const focusRef = useRef<boolean>(true);
  const [gamepadType, setGamepadType] = useState<GamepadType>();

  const addGamepad = (
    gamepadsRef: MutableRefObject<Record<number, Gamepad>>,
    gamepad: Gamepad,
  ) => {
    gamepadsRef.current = {
      ...gamepadsRef.current,
      [gamepad.index]: {
        ...gamepad,
        timestamp: new Date().getTime(),
      },
    };
  };

  // TODO: split function
  const fireEventOnButtonPress = useCallback((gamepads: (Gamepad | null)[]) => {
    if (!document.hidden && document.visibilityState === "visible") {
      gamepads.forEach((gamepad) => {
        if (gamepad) {
          const oldGamepad = oldGamepads.current[gamepad.index];
          const tempGamepad = tempGamepads.current[gamepad.index];

          gamepad.buttons.forEach((button, index) => {
            if (button.pressed) {
              if (isThrottled(oldGamepad) || isSingleButtonPress(tempGamepad)) {
                setGamepadType(identifyGamepadTypeUnmasked(gamepad));
                dispatchEvent(new CustomEvent(`gamepadonbutton${index}press`));

                addGamepad(oldGamepads, gamepad);
              }
              addGamepad(tempGamepads, gamepad);
            }
          });

          gamepad.axes.forEach((stickValue, index) => {
            if (isStickPressed(stickValue)) {
              if (isThrottled(oldGamepad) || isSingleButtonPress(tempGamepad)) {
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
                addGamepad(oldGamepads, gamepad);
              }
              addGamepad(tempGamepads, gamepad);
            }
          });
        }
      });
    }
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
