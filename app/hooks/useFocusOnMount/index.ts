import { useEffect } from "react";

export const useFocusOnMount = (
  isInFocus: boolean,
  enableFocus: () => void,
) => {
  useEffect(() => {
    if (!isInFocus) {
      enableFocus();
    }
    // Should be executed only once, therefore isInFocus can not be part of the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
