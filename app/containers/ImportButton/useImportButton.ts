import { useCallback } from "react";
import { useGamepadButtonPressEvent } from "../../hooks/useGamepadEvent";
import type { ImportButtonId } from "./importButtonId";
import { importButtonGamepadButtonIndex } from "./importButtonId";
import { useKeyboardEvent } from "../../hooks/useKeyboardEvent";

export const useImportButton = (
  isInFocus: boolean,
  importButtonId: ImportButtonId,
) => {
  const onImport = useCallback(() => {
    if (isInFocus) {
      document.getElementById(importButtonId)?.click();
    }
  }, [isInFocus, importButtonId]);

  useGamepadButtonPressEvent(importButtonGamepadButtonIndex, onImport);
  useKeyboardEvent("i", onImport);
};
