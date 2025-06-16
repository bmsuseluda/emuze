import { useCallback } from "react";
import { useGamepadButtonPressEvent } from "../../hooks/useGamepadEvent/index.js";
import type { ImportButtonId } from "./importButtonId.js";
import { importButtonGamepadButtonId } from "./importButtonId.js";
import { useKeyboardEvent } from "../../hooks/useKeyboardEvent/index.js";

export const useImportButton = (
  isInFocus: boolean,
  importButtonId: ImportButtonId,
) => {
  const onImport = useCallback(() => {
    if (isInFocus) {
      document.getElementById(importButtonId)?.click();
    }
  }, [isInFocus, importButtonId]);

  useGamepadButtonPressEvent(importButtonGamepadButtonId, onImport);
  useKeyboardEvent("i", onImport);
};
