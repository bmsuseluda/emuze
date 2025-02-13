import type { MutableRefObject, ReactNode } from "react";
import { createContext } from "react";
import { useGamepads } from "../../hooks/useGamepads";
import type { GamepadType } from "../../hooks/useGamepads/gamepadTypeMapping";

type GamepadContextState = {
  gamepadType?: GamepadType;
  enableGamepads: () => void;
  disableGamepads: () => void;
  isEnabled: MutableRefObject<boolean>;
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
