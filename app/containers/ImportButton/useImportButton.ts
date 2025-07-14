import { useCallback } from "react";
import { useGamepadButtonPressEvent } from "../../hooks/useGamepadEvent/index.js";
import type { ImportButtonId } from "./importButtonId.js";
import { importButtonGamepadButtonId } from "./importButtonId.js";
import { useKeyboardEvent } from "../../hooks/useKeyboardEvent/index.js";
import { useGamepadConnected } from "../../hooks/useGamepadConnected/index.js";
import { useEnableFocusAfterAction } from "../../hooks/useEnableFocusAfterAction/index.js";

export const useImportButton = (
  isInFocus: boolean,
  importButtonId: ImportButtonId,
) => {
  const { enableGamepads, disableGamepads } = useGamepadConnected();

  /* Set focus again after launching */
  useEnableFocusAfterAction(() => enableGamepads(), [importButtonId]);

  const onImport = useCallback(() => {
    if (isInFocus) {
      disableGamepads();
      document.getElementById(importButtonId)?.click();
    }
  }, [isInFocus, importButtonId, disableGamepads]);

  useGamepadButtonPressEvent(importButtonGamepadButtonId, onImport);
  useKeyboardEvent("i", onImport);
};
