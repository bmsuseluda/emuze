import { useEffect, useRef } from "react";

type GamepadsConfig = Array<{
  gamepadIndex: number;
  onButtonPress: (buttonId: number) => void;
}>;

const hasButtonPressChanged = (oldGamepad: Gamepad, newGamepad: Gamepad) =>
  oldGamepad.buttons.find(
    ({ pressed }, index) => pressed !== newGamepad.buttons[index].pressed
  );
const isButtonPressed = (gamepad: Gamepad) =>
  gamepad.buttons.find(({ pressed }) => pressed);

const findGamepad = (gamepads: (Gamepad | null)[], gamepadIndex: number) =>
  gamepads.find((gamepad) => gamepad?.index === gamepadIndex);

export const useGamepads = (config: GamepadsConfig) => {
  const oldGamepads = useRef<(Gamepad | null)[]>([]);
  const requestAnimationFrameRef = useRef<number>();

  const executeConfigEvents = (gamepads: (Gamepad | null)[]) => {
    const isChange = gamepads.find((gamepad) => {
      if (gamepad) {
        const oldGamepad = findGamepad(oldGamepads.current, gamepad.index);
        if (oldGamepad) {
          return hasButtonPressChanged(oldGamepad, gamepad);
        }
        return true;
      }
      return false;
    });
    if (isChange) {
      console.log("oldGamepads", oldGamepads);
      config.forEach(({ gamepadIndex, onButtonPress }) => {
        const gamepad = findGamepad(gamepads, gamepadIndex);
        if (gamepad) {
          gamepad.buttons.forEach((button, index) => {
            console.log(
              button.pressed,
              !findGamepad(oldGamepads.current, gamepadIndex)?.buttons[index]
                .pressed
            );
            if (
              button.pressed &&
              !findGamepad(oldGamepads.current, gamepadIndex)?.buttons[index]
                .pressed
            ) {
              console.log("click");
              onButtonPress(index);
            }
          });
        }
      });
      oldGamepads.current = gamepads;
    }
  };

  const updateGamepads = () => {
    const gamepads = navigator.getGamepads();
    if (gamepads) {
      executeConfigEvents(gamepads);
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
