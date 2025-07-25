import { styled } from "../../../styled-system/jsx/index.js";
import type { Entry } from "../../types/jsonFiles/category.js";
import { useGamepadsOnGrid } from "../../hooks/useGamepadsOnGrid/index.js";
import type { ComponentRef, RefObject } from "react";
import { useCallback } from "react";
import {
  useInputBack,
  useInputConfirmation,
} from "../../hooks/useDirectionalInput/index.js";

const List = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    margin: "4px",
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

    borderRadius: "1",
    outlineWidth: "2px",
    outlineStyle: "solid",
    outlineColor: "transparent",
    transition: "outline-color 0.1s ease-in-out",

    "&:has(*:checked)": {
      outlineColor: "accent",
    },
  },
});

const GameVerion = styled("input", {
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

interface Props {
  gameVersions: Entry[];
  isInFocus: boolean;
  onBack: () => void;
  onGameClick: () => void;
  onExecute: () => void;
}

export const GameVersions = ({
  gameVersions,
  isInFocus,
  onExecute,
  onGameClick,
  onBack,
}: Props) => {
  const selectEntry = (game: ComponentRef<"input">) => {
    if (!game.checked) {
      game.checked = true;
    }
    if (document.activeElement !== game) {
      game.focus();
    }
  };

  const goBack = useCallback(
    (selectedGame: RefObject<ComponentRef<"input"> | undefined>) => {
      if (selectedGame.current) {
        selectedGame.current.checked = false;
      }
      onBack();
    },
    [onBack],
  );

  const {
    entryListRef,
    entriesRefs,
    entriesRefCallback,
    selectedEntry,
    updatePosition,
  } = useGamepadsOnGrid({
    onSelectEntry: selectEntry,
    isInFocus,
  });

  const handleBack = useCallback(() => {
    if (isInFocus) {
      goBack(selectedEntry);
    }
  }, [isInFocus, selectedEntry, goBack]);

  const handleExecute = useCallback(() => {
    if (isInFocus) {
      if (selectedEntry.current) {
        onExecute();
      }
    }
  }, [isInFocus, selectedEntry, onExecute]);

  useInputConfirmation(handleExecute);
  useInputBack(handleBack);

  return (
    <List ref={entryListRef}>
      {gameVersions.map(({ name, id }, index) => {
        const handleClick = () => {
          onGameClick();
          selectedEntry.current = entriesRefs.current[index];
          updatePosition();
        };
        const handleDoubleClick = () => {
          onExecute();
        };

        return (
          <Wrapper key={id}>
            <Label onClick={handleClick} onDoubleClick={handleDoubleClick}>
              <GameVerion
                type="radio"
                name="gameVersion"
                value={id}
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
