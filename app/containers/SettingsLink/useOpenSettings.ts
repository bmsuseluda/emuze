import { useCallback } from "react";
import { useInputSettings } from "../../hooks/useDirectionalInput";

export const openSettingsId = "openSettings";

export const useOpenSettings = (isInFocus: boolean) => {
  const onOpenSettings = useCallback(() => {
    if (isInFocus) {
      document.getElementById(openSettingsId)?.click();
    }
  }, [isInFocus]);

  useInputSettings(onOpenSettings);
};
