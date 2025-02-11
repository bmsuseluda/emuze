import type { MutableRefObject, ReactNode } from "react";
import { createContext, useRef, useState } from "react";

interface FocusContextState {
  // TODO: Check how to use generics to make it type safe
  elementInFocus?: string;
  setElementInFocus: (elementInFocus?: string) => void;
  focusHistory: MutableRefObject<string[]>;
}

const defaultState: FocusContextState = {
  setElementInFocus: () => {},
  focusHistory: { current: [] },
};

export const FocusContext = createContext<FocusContextState>(defaultState);

interface Props {
  focusDefault?: string;
  focusHistoryDefault?: string[];
  children: ReactNode;
}

export const FocusProvider = ({
  focusDefault,
  focusHistoryDefault,
  children,
}: Props) => {
  const [elementInFocus, setElementInFocus] = useState<string | undefined>(
    focusDefault,
  );
  const focusHistory = useRef<string[]>(focusHistoryDefault || []);

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
