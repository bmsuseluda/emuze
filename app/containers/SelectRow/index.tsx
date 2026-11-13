import { ComponentProps, MouseEventHandler, ReactNode, useState } from "react";
import { createPortal } from "react-dom";
import { FormRow } from "../../components/FormRow/index.js";
import { SelectDialog, focus } from "../../components/SelectDialog/index.js";
import type { Option } from "../../components/OptionList/index.js";
import { TiArrowSortedDown } from "react-icons/ti";
import { useFocus } from "../../hooks/useFocus/index.js";
import { FocusElement } from "../../types/focusElement.js";
import { Label } from "../../components/Label/index.js";

interface Props extends Omit<ComponentProps<"button">, "onChange"> {
  label: string;
  icon: ReactNode;
  options: Option[];
  defaultValue?: string;
  onChange?: () => void;
}

export const SelectRow = ({
  id,
  label,
  icon,
  options,
  defaultValue,
  ref,
  onClick,
  onChange,
}: Props) => {
  const { enableFocus } = useFocus<FocusElement>(focus);
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option>(
    options.find(({ value }) => value === defaultValue) || options[0],
  );

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event);
    setOpen(true);
    enableFocus();
  };

  return (
    <FormRow>
      {open &&
        createPortal(
          <SelectDialog
            open={open}
            setOpen={setOpen}
            options={options}
            onClose={onChange}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            headline={{
              title: label,
              icon,
            }}
          />,
          document.body,
        )}
      <input
        type="text"
        name={id}
        id={id}
        value={selectedOption.value}
        style={{ display: "none" }}
      />
      <Label>
        {label}
        <div>
          <button ref={ref} onClick={handleClick} style={{ opacity: 0 }}>
            <TiArrowSortedDown />
          </button>
          {selectedOption.name}
        </div>
      </Label>
    </FormRow>
  );
};
