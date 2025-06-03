import { CloseDialog } from "../../components/CloseDialog/index.js";
import { useFocus } from "../../hooks/useFocus/index.js";
import type { FocusElement } from "../../types/focusElement.js";
import { useGamepadsOnGrid } from "../../hooks/useGamepadsOnGrid/index.js";
import { useCallback } from "react";
import {
  useInputBack,
  useInputConfirmation,
  useInputSettings,
} from "../../hooks/useDirectionalInput/index.js";

export const CloseDialogContainer = () => {
  const { isInFocus, switchFocusBack } = useFocus<FocusElement>("closeDialog");

  const selectEntry = useCallback((entry: HTMLButtonElement) => {
    entry.focus();
  }, []);

  const { entryListRef, entriesRefCallback, selectedEntry } = useGamepadsOnGrid(
    {
      onSelectEntry: selectEntry,
      isInFocus,
    },
  );

  const onClick = useCallback(() => {
    if (isInFocus) {
      selectedEntry.current?.click();
    }
  }, [isInFocus, selectedEntry]);

  const onCancel = useCallback(() => {
    if (isInFocus) {
      switchFocusBack();
    }
  }, [isInFocus, switchFocusBack]);

  useInputConfirmation(onClick);
  useInputBack(onCancel);
  useInputSettings(onCancel);

  const onClose = useCallback(() => {
    if (isInFocus) {
      window.electronAPI && window.electronAPI.closeEmuze();
    }
  }, [isInFocus]);

  return (
    <CloseDialog
      open={isInFocus}
      onClose={onClose}
      onCancel={onCancel}
      entryListRef={entryListRef}
      entriesRefCallback={entriesRefCallback}
    />
  );
};
