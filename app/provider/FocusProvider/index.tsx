import type { ReactNode } from "react";
import { createContext, useState } from "react";

type FocusContextState = {
  elementInFocus?: string;
  setElementInFocus: (elementInFocus?: string) => void;
};

const defaultState: FocusContextState = {
  setElementInFocus: () => {},
};

export const FocusContext = createContext<FocusContextState>(defaultState);

type Props = {
  focusDefault?: string;
  children: ReactNode;
};

export const FocusProvider = ({ focusDefault, children }: Props) => {
  const [elementInFocus, setElementInFocus] = useState<string | undefined>(
    focusDefault
  );

  return (
    <FocusContext.Provider value={{ elementInFocus, setElementInFocus }}>
      {children}
    </FocusContext.Provider>
  );
};
