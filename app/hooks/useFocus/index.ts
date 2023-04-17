import { useCallback, useContext, useMemo } from "react";
import { FocusContext } from "~/provider/FocusProvider";

export const useFocus = <FocusElement extends string>(
  elementId: FocusElement
) => {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error("useFocus must be used within a FocusProvider");
  }

  const { elementInFocus, setElementInFocus } = context;

  const isInFocus = useMemo(
    () => elementInFocus === elementId,
    [elementId, elementInFocus]
  );

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
