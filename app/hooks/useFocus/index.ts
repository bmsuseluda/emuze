import { useCallback, useContext, useMemo } from "react";
import { FocusContext } from "~/provider/FocusProvider";

export const useFocus = <FocusElement extends string>(
  focusElement: FocusElement,
) => {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error("useFocus must be used within a FocusProvider");
  }

  const { elementInFocus, setElementInFocus, focusHistory } = context;

  const isInFocus = useMemo(
    () => elementInFocus === focusElement,
    [focusElement, elementInFocus],
  );

  const switchFocus = useCallback(
    (nextFocusElement: FocusElement) => {
      if (!focusHistory.current.includes(focusElement)) {
        focusHistory.current.push(focusElement);
      }
      setElementInFocus(nextFocusElement);
    },
    [setElementInFocus, focusHistory, focusElement],
  );

  const switchFocusBack = useCallback(() => {
    if (focusHistory.current.length > 0) {
      const lastFocusElement = focusHistory.current.pop();
      if (lastFocusElement === focusElement) {
        setElementInFocus(focusHistory.current.pop());
      } else {
        setElementInFocus(lastFocusElement);
      }
    }
  }, [focusHistory, setElementInFocus, focusElement]);

  const disableFocus = useCallback(() => {
    setElementInFocus();
  }, [setElementInFocus]);

  const enableFocus = useCallback(() => {
    if (focusElement !== elementInFocus) {
      switchFocus(focusElement);
    }
  }, [switchFocus, focusElement, elementInFocus]);

  return {
    isInFocus,
    switchFocus,
    switchFocusBack,
    disableFocus,
    enableFocus,
  };
};
