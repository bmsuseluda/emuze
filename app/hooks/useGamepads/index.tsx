import { useEffect, useRef, useState } from "react";

type GamepadsConfig = Array<{
  gamepadIndex: number;
  onButtonPress: (buttonId: number) => void;
}>;

export const useGamepads = (
  config: GamepadsConfig,
  deps: React.DependencyList | undefined = []
) => {
  const [gamepads, setGamepads] = useState<Record<number, Gamepad>>({});
  const [oldGamepads, setOldGamepads] = useState<Record<number, Gamepad>>({});
  const requestAnimationFrameRef = useRef<number>();

  const addGamepad = (gamepad: Gamepad) => {
    setGamepads((gamepads) => ({
      ...gamepads,
      [gamepad.index]: gamepad,
    }));
  };

  const removeGamepad = (gamepad: Gamepad) => {
    setGamepads(
      ({ [gamepad.index]: toBeRemoved, ...otherGamepads }) => otherGamepads
    );
  };

  const handleGamepadConnected = ({ gamepad }: GamepadEvent) => {
    addGamepad(gamepad);
  };

  useEffect(() => {
    window.addEventListener("gamepadconnected", handleGamepadConnected);

    return window.removeEventListener(
      "gamepadconnected",
      handleGamepadConnected
    );
  }, []);

  const handleGamepadDisconnected = ({ gamepad }: GamepadEvent) => {
    removeGamepad(gamepad);
  };

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
            !oldGamepads[gamepadIndex]?.buttons[index].pressed
          ) {
            onButtonPress(index);
          }
        });
      }
    });
    setOldGamepads(gamepads);
  }, [gamepads, ...deps]);
};
