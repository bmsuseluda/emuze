import { useNavigation } from "@remix-run/react";
import { useEffect } from "react";

export const useEnableFocusAfterAction = (
  enableFocus: () => void,
  actionsIds: string[],
) => {
  const { state, formData } = useNavigation();

  useEffect(() => {
    const actionId = formData?.get("_actionId");
    if (
      state === "loading" &&
      typeof actionId === "string" &&
      actionsIds.includes(actionId)
    ) {
      enableFocus();
    }
  }, [state, formData, enableFocus, actionsIds]);
};
