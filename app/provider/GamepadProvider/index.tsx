import type { ReactNode } from "react";
import { createContext } from "react";
import { useGamepads } from "~/hooks/useGamepads";
import type { GamepadType } from "~/hooks/useGamepads/gamepadTypeMapping";

type GamepadContextState = {
  isGamepadConnected: boolean;
  gamepadType?: GamepadType;
  enableGamepads: () => void;
  disableGamepads: () => void;
};

const defaultState: GamepadContextState = {
  isGamepadConnected: false,
  gamepadType: "XBox",
  enableGamepads: () => {},
  disableGamepads: () => {},
};

export const GamepadContext = createContext<GamepadContextState>(defaultState);

type Props = {
  children: ReactNode;
};

export const GamepadProvider = ({ children }: Props) => {
  const { isGamepadConnected, gamepadType, enableGamepads, disableGamepads } =
    useGamepads();

  return (
    <GamepadContext.Provider
      value={{
        isGamepadConnected,
        gamepadType,
        enableGamepads,
        disableGamepads,
      }}
    >
      {children}
    </GamepadContext.Provider>
  );
};
