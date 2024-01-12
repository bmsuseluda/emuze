import type { ReactNode } from "react";
import { createContext } from "react";
import { useGamepads } from "~/hooks/useGamepads";

type GamepadContextState = {
  isGamepadConnected: boolean;
};

const defaultState: GamepadContextState = {
  isGamepadConnected: false,
};

export const GamepadContext = createContext<GamepadContextState>(defaultState);

type Props = {
  children: ReactNode;
};

export const GamepadProvider = ({ children }: Props) => {
  const { isGamepadConnected } = useGamepads();

  return (
    <GamepadContext.Provider value={{ isGamepadConnected }}>
      {children}
    </GamepadContext.Provider>
  );
};
