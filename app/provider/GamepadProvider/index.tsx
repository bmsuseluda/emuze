import type { ReactNode } from "react";
import { createContext } from "react";
import { useGamepads } from "../../hooks/useGamepads";
import type { GamepadType } from "../../hooks/useGamepads/gamepadTypeMapping";

type GamepadContextState = {
  gamepadType?: GamepadType;
  enableGamepads: () => void;
  disableGamepads: () => void;
};

const defaultState: GamepadContextState = {
  gamepadType: "XBox",
  enableGamepads: () => {},
  disableGamepads: () => {},
};

export const GamepadContext = createContext<GamepadContextState>(defaultState);

type Props = {
  children: ReactNode;
};

export const GamepadProvider = ({ children }: Props) => {
  const { gamepadType, enableGamepads, disableGamepads } = useGamepads();

  return (
    <GamepadContext.Provider
      value={{
        gamepadType,
        enableGamepads,
        disableGamepads,
      }}
    >
      {children}
    </GamepadContext.Provider>
  );
};
