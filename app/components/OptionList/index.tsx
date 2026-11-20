import { styled } from "../../../styled-system/jsx/factory.js";
import { useGamepadsOnGrid } from "../../hooks/useGamepadsOnGrid/index.js";
import type { ComponentRef, RefObject } from "react";
import { useCallback, useMemo } from "react";
import {
  useInputBack,
  useInputConfirmation,
} from "../../hooks/useDirectionalInput/index.js";

const List = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    margin: "0.25rem",
    gap: 1,
  },
});

const Wrapper = styled("li", {
  base: {
    position: "relative",
  },
});

const Label = styled("label", {
  base: {
    display: "block",
    padding: "1",
    color: "color",
    fontSize: "small",

    borderRadius: "1",
    outline: "outlineInitial",
    transition: "outline-color 0.1s ease-in-out",

    "&:hover": {
      cursor: "pointer",
    },

    "&:has(*:checked)": {
      outlineColor: "accent",
    },
  },
});

const Option = styled("input", {
  base: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: "-2",
    opacity: 0,
  },
});

export interface Option {
  name: string;
  value: string;
}

interface Props {
  options: Option[];
  defaultSelectedOption?: Option;
  groupName: string;
  isInFocus: boolean;
  onBack: () => void;
  onOptionClick: () => void;
  onSelectOption?: (option: Option) => void;
  onConfirmation: () => void;
}

export const OptionList = ({
  options,
  defaultSelectedOption,
  groupName,
  isInFocus,
  onConfirmation,
  onOptionClick,
  onSelectOption,
  onBack,
}: Props) => {
  const selectEntry = (option: ComponentRef<"input">) => {
    if (!option.checked) {
      option.checked = true;

      if (onSelectOption) {
        const name =
          options.find(({ value }) => value === option.value)?.name ||
          option.value;
        onSelectOption({ name, value: option.value });
      }
    }
    if (document.activeElement !== option) {
      option.focus();
    }
  };

  const goBack = useCallback(
    (selectedOption: RefObject<ComponentRef<"input"> | undefined>) => {
      if (selectedOption.current) {
        selectedOption.current.checked = false;
      }
      onBack();
    },
    [onBack],
  );

  const selectedYDefault = useMemo<number>(() => {
    if (defaultSelectedOption?.value) {
      const index = options.findIndex(
        (option) => option.value === defaultSelectedOption?.value,
      );
      if (index > 0) {
        return index;
      }
    }

    return 0;
  }, [options, defaultSelectedOption]);

  const {
    entryListRef,
    entriesRefs,
    entriesRefCallback,
    selectedEntry,
    setSelectedEntry,
  } = useGamepadsOnGrid({
    onSelectEntry: selectEntry,
    isInFocus,
    loop: true,
    selectedXDefault: 0,
    selectedYDefault,
  });

  const handleBack = useCallback(() => {
    if (isInFocus) {
      goBack(selectedEntry);
    }
  }, [isInFocus, selectedEntry, goBack]);

  const handleConfirmation = useCallback(() => {
    if (isInFocus) {
      if (selectedEntry.current) {
        onConfirmation();
      }
    }
  }, [isInFocus, selectedEntry, onConfirmation]);

  useInputConfirmation(handleConfirmation);
  useInputBack(handleBack);

  return (
    <List ref={entryListRef}>
      {options.map((option, index) => {
        const { name, value } = option;
        const handleClick = () => {
          onSelectOption?.(option);
          onOptionClick();
          setSelectedEntry(entriesRefs.current[index]);
        };
        const handleDoubleClick = () => {
          onConfirmation();
        };

        return (
          <Wrapper key={value}>
            <Label onClick={handleClick} onDoubleClick={handleDoubleClick}>
              <Option
                type="radio"
                name={groupName}
                value={value}
                defaultChecked={option === defaultSelectedOption}
                ref={entriesRefCallback(index)}
              />
              {name}
            </Label>
          </Wrapper>
        );
      })}
    </List>
  );
};
