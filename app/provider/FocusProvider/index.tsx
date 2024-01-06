import type { MutableRefObject, ReactNode } from "react";
import { createContext, useRef, useState } from "react";

type FocusContextState = {
  // TODO: Check how to use generics to make it type safe
  elementInFocus?: string;
  setElementInFocus: (elementInFocus?: string) => void;
  focusHistory: MutableRefObject<string[]>;
};

const defaultState: FocusContextState = {
  setElementInFocus: () => {},
  focusHistory: { current: [] },
};

export const FocusContext = createContext<FocusContextState>(defaultState);

type Props = {
  focusDefault?: string;
  children: ReactNode;
};

export const FocusProvider = ({ focusDefault, children }: Props) => {
  const [elementInFocus, setElementInFocus] = useState<string | undefined>(
    focusDefault,
  );
  const focusHistory = useRef<string[]>([]);

  return (
    <FocusContext.Provider
      value={{
        elementInFocus,
        setElementInFocus,
        focusHistory,
      }}
    >
      {children}
    </FocusContext.Provider>
  );
};
