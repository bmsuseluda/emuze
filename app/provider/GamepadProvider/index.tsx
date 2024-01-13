import type { ReactNode } from "react";
import { createContext } from "react";
import { useGamepads } from "~/hooks/useGamepads";
import type { GamepadType } from "~/hooks/useGamepads/gamepadTypeMapping";

type GamepadContextState = {
  isGamepadConnected: boolean;
  gamepadType: GamepadType;
};

const defaultState: GamepadContextState = {
  isGamepadConnected: false,
  gamepadType: "XBox",
};

export const GamepadContext = createContext<GamepadContextState>(defaultState);

type Props = {
  children: ReactNode;
};

export const GamepadProvider = ({ children }: Props) => {
  const { isGamepadConnected, gamepadType } = useGamepads();

  return (
    <GamepadContext.Provider value={{ isGamepadConnected, gamepadType }}>
      {children}
    </GamepadContext.Provider>
  );
};
