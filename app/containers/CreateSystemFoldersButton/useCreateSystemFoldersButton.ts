import { useCallback } from "react";
import { useGamepadButtonPressEvent } from "../../hooks/useGamepadEvent/index.js";
import { useKeyboardEvent } from "../../hooks/useKeyboardEvent/index.js";
import { useGamepadConnected } from "../../hooks/useGamepadConnected/index.js";
import { useEnableFocusAfterAction } from "../../hooks/useEnableFocusAfterAction/index.js";
import {
  createSystemFoldersButtonGamepadButtonId,
  type CreateSystemFoldersButtonId,
} from "./createSystemFoldersButtonId.js";

export const useCreateSystemFoldersButton = (
  isInFocus: boolean,
  createSystemFoldersButtonId: CreateSystemFoldersButtonId,
) => {
  const { enableGamepads, disableGamepads } = useGamepadConnected();

  /* Set focus again after launching */
  useEnableFocusAfterAction(
    () => enableGamepads(),
    [createSystemFoldersButtonId],
  );

  const onCreateSystemFolders = useCallback(() => {
    if (isInFocus) {
      disableGamepads();
      document.getElementById(createSystemFoldersButtonId)?.click();
    }
  }, [isInFocus, createSystemFoldersButtonId, disableGamepads]);

  useGamepadButtonPressEvent(
    createSystemFoldersButtonGamepadButtonId,
    onCreateSystemFolders,
  );
  useKeyboardEvent("s", onCreateSystemFolders);
};
