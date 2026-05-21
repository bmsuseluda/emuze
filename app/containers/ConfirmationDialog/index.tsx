import { useFocus } from "../../hooks/useFocus/index.js";
import type { FocusElement } from "../../types/focusElement.js";
import { useGamepadsOnGrid } from "../../hooks/useGamepadsOnGrid/index.js";
import type { Props as ButtonProps } from "../../components/Button/index.js";

import { useCallback } from "react";
import {
  useInputBack,
  useInputConfirmation,
  useInputSettings,
} from "../../hooks/useDirectionalInput/index.js";
import { ConfirmationDialog } from "../../components/ConfirmationDialog/index.js";

interface ConfirmationDialogContainerProps {
  headline: string;
  focusElement: FocusElement;
  cancelButtonDefinition: ButtonProps;
  confirmButtonDefinition: ButtonProps;
  onConfirm: () => void;
}

export const ConfirmationDialogContainer = ({
  headline,
  focusElement,
  cancelButtonDefinition,
  confirmButtonDefinition,
  onConfirm,
}: ConfirmationDialogContainerProps) => {
  const { isInFocus, switchFocusBack } = useFocus<FocusElement>(focusElement);

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

  const handleConfirm = useCallback(() => {
    if (isInFocus) {
      onConfirm();
    }
  }, [isInFocus, onConfirm]);

  return (
    <ConfirmationDialog
      headline={headline}
      open={isInFocus}
      onDialogClose={onCancel}
      cancelButtonDefinition={{
        ...cancelButtonDefinition,
        onClick: onCancel,
      }}
      confirmButtonDefinition={{
        ...confirmButtonDefinition,
        onClick: handleConfirm,
      }}
      entryListRef={entryListRef}
      entriesRefCallback={entriesRefCallback}
    />
  );
};
