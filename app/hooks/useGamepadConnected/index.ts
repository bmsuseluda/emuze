import { use } from "react";
import { GamepadContext } from "../../provider/GamepadProvider/index.js";

export const useGamepadConnected = () => {
  const context = use(GamepadContext);
  if (!context) {
    throw new Error(
      "useGamepadConnected must be used within a GamepadProvider",
    );
  }

  const { gamepadType, disableGamepads, enableGamepads, isEnabled } = context;

  return {
    gamepadType,
    disableGamepads,
    enableGamepads,
    isEnabled,
  };
};
