import { FormRow } from "../../components/FormRow/index.js";
import { Label } from "../../components/Label/index.js";
import { TextInput } from "../../components/TextInput/index.js";
import { FaFolderOpen } from "react-icons/fa";
import type { ComponentRef, MouseEvent } from "react";
import { useState } from "react";

interface Props {
  id: string;
  label: string;
  defaultValue?: string;
  newValue?: string;
  defaultError?: string;
  newError?: string;
  actionId: string;
  openDialogButtonRef: (ref: HTMLButtonElement) => void;
  onOpenFileDialog: (event: MouseEvent<ComponentRef<"button">>) => void;
}

export const FileDialogInputField = ({
  id,
  label,
  defaultValue,
  newValue,
  defaultError,
  newError,
  actionId,
  openDialogButtonRef,
  onOpenFileDialog,
}: Props) => {
  const [prevNewValue, setPrevNewValue] = useState(newValue);
  const [value, setValue] = useState(defaultValue || "");

  if (newValue !== prevNewValue) {
    setPrevNewValue(newValue);
    if (newValue) {
      setValue(newValue);
    }
  }

  const error = newValue ? undefined : (newError ?? defaultError);

  return (
    <FormRow>
      <Label htmlFor={id}>{label}</Label>
      <TextInput label={label} error={error}>
        <TextInput.Input
          type="text"
          name={id}
          id={id}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          iconButton
          autoComplete="off"
        />
        <TextInput.IconButton
          type="submit"
          name="_actionId"
          value={actionId}
          ref={openDialogButtonRef}
          onClick={onOpenFileDialog}
        >
          <FaFolderOpen />
        </TextInput.IconButton>
      </TextInput>
    </FormRow>
  );
};
