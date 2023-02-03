import { useCallback, useContext, useEffect, useState } from "react";
import { FocusContext } from "~/provider/FocusProvider";

export const useFocus = <FocusElement extends string>(
  elementId: FocusElement
) => {
  const context = useContext(FocusContext);
  if (context === undefined) {
    throw new Error("useFocus must be used within a FocusProvider");
  }

  const { elementInFocus, setElementInFocus } = context;
  // TODO: useRef instead of useState
  const [isInFocus, setIsInFocus] = useState(elementInFocus === elementId);

  useEffect(() => {
    if (isInFocus && elementInFocus !== elementId) {
      setIsInFocus(false);
    }

    if (!isInFocus && elementInFocus === elementId) {
      setIsInFocus(true);
    }
  }, [elementInFocus]);

  const switchFocus = useCallback(
    (element: FocusElement) => {
      setElementInFocus(element);
    },
    [setElementInFocus]
  );

  const disableFocus = useCallback(() => {
    setElementInFocus();
  }, [setElementInFocus]);

  return {
    isInFocus,
    switchFocus,
    disableFocus,
  };
};
