import { useState } from "react";
import { createPortal } from "react-dom";
import { FormRow } from "../../components/FormRow/index.js";
import { SelectDialog, focus } from "../../components/SelectDialog/index.js";
import type { Option } from "../../components/OptionList/index.js";
import { TiArrowSortedDown } from "react-icons/ti";
import { useFocus } from "../../hooks/useFocus/index.js";
import { FocusElement } from "../../types/focusElement.js";
import { CheckboxLabel } from "../../components/CheckboxLabel/index.js";
import { SettingsIcon } from "../../components/SettingsIcon/index.js";

interface Props {
  label: string;
  options: Option[];
  defaultSelectedOption: Option;
  ref: (ref: HTMLButtonElement) => void;
}

export const SelectRow = ({
  label,
  options,
  defaultSelectedOption,
  ref,
}: Props) => {
  const { enableFocus } = useFocus<FocusElement>(focus);
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option>(
    defaultSelectedOption,
  );

  return (
    <FormRow>
      {open &&
        createPortal(
          <SelectDialog
            open={open}
            setOpen={setOpen}
            options={options}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            headline={{
              title: label,
              icon: <SettingsIcon id="general" />,
            }}
          />,
          document.body,
        )}
      <CheckboxLabel>
        {label}
        <div>
          {selectedOption.name}
          <button
            ref={ref}
            onClick={() => {
              setOpen(true);
              enableFocus();
            }}
          >
            <TiArrowSortedDown />
          </button>
        </div>
      </CheckboxLabel>
    </FormRow>
  );
};
