import { useCallback } from "react";
import { useInputReleaseNotes } from "../../hooks/useDirectionalInput/index.js";

export const openReleaseNotesId = "openReleaseNotes";

export const useOpenReleaseNotes = (isInFocus: boolean) => {
  const onOpenReleaseNotes = useCallback(() => {
    if (isInFocus) {
      document.getElementById(openReleaseNotesId)?.click();
    }
  }, [isInFocus]);

  useInputReleaseNotes(onOpenReleaseNotes);
};
