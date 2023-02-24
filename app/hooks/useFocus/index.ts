import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { FocusContext } from "~/provider/FocusProvider";

export const useFocus = <FocusElement extends string>(
  elementId: FocusElement
) => {
  const context = useContext(FocusContext);
  if (!context) {
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
  }, [elementInFocus, elementId, isInFocus]);

  const switchFocus = useCallback(
    (element: FocusElement) => {
      setElementInFocus(element);
    },
    [setElementInFocus]
  );

  const disableFocus = useCallback(() => {
    setElementInFocus();
  }, [setElementInFocus]);

  const isDisabled = useMemo(
    () => elementInFocus === undefined,
    [elementInFocus]
  );

  return {
    isInFocus,
    isDisabled,
    switchFocus,
    disableFocus,
  };
};
