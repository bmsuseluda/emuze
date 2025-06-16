import { use, useCallback, useMemo } from "react";
import { FocusContext } from "../../provider/FocusProvider/index.js";

export const useFocus = <FocusElement extends string>(
  focusElement: FocusElement,
) => {
  const context = use(FocusContext);
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
      const actualFocus = elementInFocus || focusElement;
      if (focusHistory.current.at(-1) !== actualFocus) {
        focusHistory.current.push(actualFocus);
      }
      if (focusHistory.current.length > 10) {
        focusHistory.current.shift();
      }
      setElementInFocus(nextFocusElement);
    },
    [setElementInFocus, focusHistory, elementInFocus, focusElement],
  );

  const switchFocusBack = useCallback(() => {
    // TODO: Should i check on isInFocus?
    if (focusHistory.current.length > 0) {
      const lastFocusElement = focusHistory.current.pop();
      if (lastFocusElement === focusElement) {
        setElementInFocus(focusHistory.current.pop());
      } else {
        setElementInFocus(lastFocusElement);
      }
    }
  }, [focusHistory, setElementInFocus, focusElement]);

  const switchFocusBackMultiple = useCallback(
    (...elementsToRemove: FocusElement[]) => {
      if (focusHistory.current.length > 0) {
        elementsToRemove.forEach((elementToRemove) => {
          const index = focusHistory.current.indexOf(elementToRemove);
          if (index !== -1) {
            focusHistory.current.splice(index, 1);
          }
        });
        setElementInFocus(focusHistory.current.pop());
      }
    },
    [focusHistory, setElementInFocus],
  );

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
    switchFocusBackMultiple,
    disableFocus,
    enableFocus,
    focusHistory,
  };
};
