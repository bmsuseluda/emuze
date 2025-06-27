import type { ComponentRef } from "react";
import { useCallback, useRef } from "react";
import { useGamepadConnected } from "../useGamepadConnected/index.js";
import { useEnableFocusAfterAction } from "../useEnableFocusAfterAction/index.js";
import { launchId } from "../../containers/LaunchButton/index.js";

export const useLaunchButton = () => {
  const launchButtonRef = useRef<ComponentRef<"button">>(null);

  const { enableGamepads, disableGamepads } = useGamepadConnected();

  /* Set focus again after launching */
  useEnableFocusAfterAction(() => enableGamepads(), [launchId]);

  const onExecute = useCallback(() => {
    if (launchButtonRef.current && !launchButtonRef.current.disabled) {
      disableGamepads();
      launchButtonRef.current.click();
    }
  }, [disableGamepads]);

  return {
    onExecute,
    launchButtonRef,
  };
};
