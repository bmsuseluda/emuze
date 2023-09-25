import type { ComponentPropsWithoutRef, ElementRef, RefObject } from "react";
import { useCallback } from "react";
import { useTestId } from "~/hooks/useTestId";
import type { Entry as EntryType } from "~/types/jsonFiles/category";
import { Ul } from "../Ul";
import { Entry } from "./components/Entry";
import { useGamepadsOnGrid } from "~/hooks/useGamepadsOnGrid";
import {
  useGamepadButtonPressEvent,
  useKeyboardEvent,
} from "~/hooks/useGamepadEvent";
import { layout } from "~/hooks/useGamepads/layouts";
import { styled } from "../../../styled-system/jsx";
import { useAddEntriesToRenderOnScrollEnd } from "~/hooks/useAddEntriesToRenderOnScrollEnd";

type Props = {
  entries: EntryType[];
  alwaysGameNames?: boolean;
  isInFocus: boolean;
  onBack: () => void;
  onEntryClick: () => void;
  onExecute: () => void;
  "data-testid"?: string;
} & ComponentPropsWithoutRef<"ul">;

const List = styled(Ul, {
  base: {
    position: "relative",
    display: "grid",
    gap: "1",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  },
});

const IntersectionIndicator = styled("div", {
  base: {
    position: "absolute",
    right: 0,
    bottom: "1px",
    zIndex: 0,
    minHeight: "320px",
  },
});

export const EntryListDynamic = ({ entries, ...rest }: Props) => {
  const { entriesToRender, inViewRef } = useAddEntriesToRenderOnScrollEnd(
    entries || [],
  );

  return (
    <EntryList entries={entriesToRender} inViewRef={inViewRef} {...rest} />
  );
};

export const EntryList = ({
  entries,
  alwaysGameNames = false,
  isInFocus,
  onBack,
  onExecute,
  onEntryClick,
  "data-testid": dataTestid,
  inViewRef,
}: Props & { inViewRef?: RefObject<ElementRef<"div">> }) => {
  const { getTestId } = useTestId(dataTestid);

  const selectEntry = (entry: ElementRef<"input">) => {
    entry.checked = true;
    entry.focus();
  };

  const {
    entryListRef,
    entriesRefs,
    entriesRefCallback,
    selectedEntry,
    resetSelected,
    updatePosition,
  } = useGamepadsOnGrid(selectEntry, isInFocus);

  const handleBack = useCallback(() => {
    if (isInFocus) {
      if (selectedEntry.current) {
        selectedEntry.current.checked = false;
        resetSelected();
      }
      onBack();
    }
  }, [isInFocus, resetSelected, selectedEntry, onBack]);

  const handleExecute = useCallback(() => {
    if (isInFocus) {
      if (selectedEntry.current) {
        onExecute();
      }
    }
  }, [isInFocus, selectedEntry, onExecute]);

  useGamepadButtonPressEvent(layout.buttons.B, handleBack);
  useGamepadButtonPressEvent(layout.buttons.A, handleExecute);
  useKeyboardEvent("Backspace", handleBack);
  useKeyboardEvent("Enter", handleExecute);

  return (
    <List ref={entryListRef} {...getTestId()}>
      {entries.map(({ id, name, metaData }, index) => {
        // TODO: think about if this should be a callback from useGamepadsOnGrid
        const handleClick = () => {
          onEntryClick();
          selectedEntry.current = entriesRefs.current[index];
          updatePosition();
        };
        const handleDoubleClick = () => {
          onExecute();
        };

        return (
          <Entry
            id={id}
            name={name}
            imageUrl={metaData?.imageUrl}
            alwaysGameName={alwaysGameNames}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            ref={entriesRefCallback(index)}
            key={id}
            {...getTestId("entry")}
          />
        );
      })}
      <IntersectionIndicator ref={inViewRef} />
    </List>
  );
};
