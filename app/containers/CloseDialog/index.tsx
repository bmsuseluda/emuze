import { CloseDialog } from "../../components/CloseDialog";
import { useFocus } from "../../hooks/useFocus";
import type { FocusElement } from "../../types/focusElement";
import { useGamepadsOnGrid } from "../../hooks/useGamepadsOnGrid";
import { useCallback } from "react";
import { useInputConfirmation } from "../../hooks/useDirectionalInput";

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

  useInputConfirmation(onClick);

  const onCancel = useCallback(() => {
    if (isInFocus) {
      switchFocusBack();
    }
  }, [isInFocus, switchFocusBack]);

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
