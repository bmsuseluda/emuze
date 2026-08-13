import { useCallback } from "react";
import { useGamepadButtonPressEvent } from "../../hooks/useGamepadEvent/index.js";
import { useKeyboardEvent } from "../../hooks/useKeyboardEvent/index.js";
import {
  createSystemFoldersButtonGamepadButtonId,
  type CreateSystemFoldersButtonId,
} from "./createSystemFoldersButtonId.js";

export const useCreateSystemFoldersButton = (
  isInFocus: boolean,
  createSystemFoldersButtonId: CreateSystemFoldersButtonId,
) => {
  const onCreateSystemFolders = useCallback(() => {
    if (isInFocus) {
      document.getElementById(createSystemFoldersButtonId)?.click();
    }
  }, [isInFocus, createSystemFoldersButtonId]);

  useGamepadButtonPressEvent(
    createSystemFoldersButtonGamepadButtonId,
    onCreateSystemFolders,
  );
  useKeyboardEvent("s", onCreateSystemFolders);
};
