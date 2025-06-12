import type { RefObject, ReactNode } from "react";
import { createContext } from "react";
import { useGamepads } from "../../hooks/useGamepads/index.js";
import type { GamepadType } from "../../hooks/useGamepads/gamepadTypeMapping.js";

type GamepadContextState = {
  gamepadType?: GamepadType;
  enableGamepads: (gameIsNotRunningAnymore?: boolean) => void;
  disableGamepads: (gameIsRunning?: boolean) => void;
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
    <GamepadContext.Provider
      value={{
        gamepadType,
        enableGamepads,
        disableGamepads,
        isEnabled,
      }}
    >
      {children}
    </GamepadContext.Provider>
  );
};
