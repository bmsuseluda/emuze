import { useCallback, useEffect, useRef, useState } from "react";

type GamepadsConfig = Array<{
  gamepadIndex: number;
  onButtonPress: (buttonId: number) => void;
}>;

const hasButtonPressChanged = (oldGamepad: Gamepad, newGamepad: Gamepad) =>
  oldGamepad?.buttons.find(
    ({ pressed }, index) => pressed !== newGamepad?.buttons[index].pressed
  );
const isButtonPressed = (gamepad: Gamepad) =>
  gamepad?.buttons.find(({ pressed }) => pressed);

// TODO: check useEffect deps, see eslint warnings
export const useGamepads = (config: GamepadsConfig) => {
  const [gamepads, setGamepads] = useState<Record<number, Gamepad>>({});
  const oldGamepads = useRef<Record<number, Gamepad>>({});
  const requestAnimationFrameRef = useRef<number>();

  const addGamepad = useCallback((gamepad: Gamepad) => {
    setGamepads((gamepads) => {
      if (
        (!gamepads[gamepad.index] && isButtonPressed(gamepad)) ||
        hasButtonPressChanged(gamepads[gamepad.index], gamepad)
      ) {
        return {
          ...gamepads,
          [gamepad.index]: gamepad,
        };
      }
      return gamepads;
    });
  }, []);

  const removeGamepad = useCallback((gamepad: Gamepad) => {
    setGamepads(
      ({ [gamepad.index]: toBeRemoved, ...otherGamepads }) => otherGamepads
    );
  }, []);

  const handleGamepadConnected = useCallback(({ gamepad }: GamepadEvent) => {
    addGamepad(gamepad);
  }, []);

  useEffect(() => {
    window.addEventListener("gamepadconnected", handleGamepadConnected);

    return window.removeEventListener(
      "gamepadconnected",
      handleGamepadConnected
    );
  }, []);

  const handleGamepadDisconnected = useCallback(({ gamepad }: GamepadEvent) => {
    removeGamepad(gamepad);
  }, []);

  useEffect(() => {
    window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);

    return window.removeEventListener(
      "gamepaddisconnected",
      handleGamepadDisconnected
    );
  }, []);

  const updateGamepads = () => {
    navigator.getGamepads().forEach((connectedGamepad) => {
      if (connectedGamepad) {
        addGamepad(connectedGamepad);
      }
    });
  };

  const update = () => {
    updateGamepads();
    requestAnimationFrameRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    requestAnimationFrameRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestAnimationFrameRef.current!);
  }, []);

  useEffect(() => {
    config.forEach(({ gamepadIndex, onButtonPress }) => {
      const gamepad = gamepads[gamepadIndex];
      if (gamepad) {
        gamepad.buttons.forEach((button, index) => {
          if (
            button.pressed &&
            !oldGamepads.current[gamepadIndex]?.buttons[index].pressed
          ) {
            onButtonPress(index);
          }
        });
      }
    });
    oldGamepads.current = gamepads;
  }, [gamepads]);
};
