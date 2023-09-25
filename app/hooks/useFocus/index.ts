import { useCallback, useContext, useMemo } from "react";
import { FocusContext } from "~/provider/FocusProvider";

export const useFocus = <FocusElement extends string>(
  focusElement: FocusElement,
) => {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error("useFocus must be used within a FocusProvider");
  }

  const { elementInFocus, setElementInFocus } = context;

  const isInFocus = useMemo(
    () => elementInFocus === focusElement,
    [focusElement, elementInFocus],
  );

  const switchFocus = useCallback(
    (element: FocusElement) => {
      setElementInFocus(element);
    },
    [setElementInFocus],
  );

  const disableFocus = useCallback(() => {
    setElementInFocus();
  }, [setElementInFocus]);

  const enableFocus = useCallback(() => {
    setElementInFocus(focusElement);
  }, [setElementInFocus, focusElement]);

  return {
    isInFocus,
    switchFocus,
    disableFocus,
    enableFocus,
  };
};
