import { useContext } from "react";
import { GamepadContext } from "~/provider/GamepadProvider";

export const useGamepadConnected = () => {
  const context = useContext(GamepadContext);
  if (!context) {
    throw new Error(
      "useGamepadConnected must be used within a GamepadProvider",
    );
  }

  const { isGamepadConnected, gamepadType, disableGamepads, enableGamepads } =
    context;

  return {
    isGamepadConnected,
    gamepadType,
    disableGamepads,
    enableGamepads,
  };
};
