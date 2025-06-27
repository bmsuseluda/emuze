import type { RefObject, ReactNode } from "react";
import { createContext } from "react";
import { useGamepads } from "../../hooks/useGamepads/index.js";
import type { GamepadType } from "../../types/gamepad.js";

type GamepadContextState = {
  gamepadType?: GamepadType;
  enableGamepads: () => void;
  disableGamepads: () => void;
  isEnabled: RefObject<boolean>;
};

const defaultState: GamepadContextState = {
  gamepadType: "XBox",
  enableGamepads: () => {},
  disableGamepads: () => {},
  isEnabled: { current: true },
};

export const GamepadContext = createContext<GamepadContextState>(defaultState);

type Props = {
  children: ReactNode;
};

export const GamepadProvider = ({ children }: Props) => {
  const { gamepadType, enableGamepads, disableGamepads, isEnabled } =
    useGamepads();

  return (
    <GamepadContext
      value={{
        gamepadType,
        enableGamepads,
        disableGamepads,
        isEnabled,
      }}
    >
      {children}
    </GamepadContext>
  );
};
