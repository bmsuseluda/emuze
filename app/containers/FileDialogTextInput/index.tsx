import { FormRow } from "../../components/FormRow";
import { Label } from "../../components/Label";
import { TextInput } from "../../components/TextInput";
import { FaFolderOpen } from "react-icons/fa";
import type { ElementRef, MouseEvent } from "react";
import { useEffect, useState } from "react";

interface Props {
  id: string;
  label: string;
  defaultValue?: string;
  newValue?: string;
  defaultError?: string;
  newError?: string;
  actionId: string;
  openDialogButtonRef: (ref: HTMLButtonElement) => void;
  onOpenFileDialog: (event: MouseEvent<ElementRef<"button">>) => void;
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
  const [value, setValue] = useState(defaultValue || "");
  const [error, setError] = useState(defaultError);

  useEffect(() => {
    if (newValue) {
      setValue(newValue);
      setError(undefined);
    }
  }, [newValue]);

  useEffect(() => {
    if (newError) {
      setError(newError);
    }
  }, [newError]);

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
