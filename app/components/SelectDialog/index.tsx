import { ReactNode, useCallback } from "react";
import { useFocus } from "../../hooks/useFocus/index.js";
import { FocusElement } from "../../types/focusElement.js";
import { Dialog } from "../Dialog/index.js";
import { useInputSettings } from "../../hooks/useDirectionalInput/index.js";
import { SidebarMainLayout } from "../layouts/SidebarMainLayout/index.js";
import { ListActionBarLayout } from "../layouts/ListActionBarLayout/index.js";
import { OptionList, Option } from "../OptionList/index.js";

export const focus: FocusElement = "selectDialog";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedOption: Option;
  setSelectedOption: (option: Option) => void;
  options: Option[];
  headline?: {
    title: string;
    icon?: ReactNode;
  };
}

export const SelectDialog = ({
  options,
  open = false,
  setOpen,
  selectedOption,
  setSelectedOption,
  headline,
}: Props) => {
  const { isInFocus, switchFocusBack } = useFocus<FocusElement>(focus);

  const handleClose = useCallback(() => {
    setOpen(false);
    switchFocusBack();
  }, [switchFocusBack, setOpen]);

  const onSelectOption = useCallback(
    (option: Option) => {
      setSelectedOption(option);
    },
    [setSelectedOption],
  );

  const onBack = useCallback(() => {
    if (isInFocus) {
      handleClose();
    }
  }, [handleClose, isInFocus]);

  const onOptionClick = useCallback(() => {
    onBack();
  }, [onBack]);

  useInputSettings(onBack);

  return (
    <Dialog size="dynamic" open={open} onClose={handleClose}>
      <SidebarMainLayout>
        <SidebarMainLayout.Main dynamicWidth>
          <ListActionBarLayout headline={headline} paddingLeft="none">
            <ListActionBarLayout.ListActionBarContainer
              scrollSmooth
              dynamicHeight
              paddingSide={false}
              list={
                options && (
                  <OptionList
                    options={options}
                    defaultSelectedOption={selectedOption}
                    groupName="select"
                    onConfirmation={onBack}
                    onBack={onBack}
                    isInFocus={isInFocus}
                    onOptionClick={onOptionClick}
                    onSelectOption={onSelectOption}
                  />
                )
              }
            />
          </ListActionBarLayout>
        </SidebarMainLayout.Main>
      </SidebarMainLayout>
    </Dialog>
  );
};
