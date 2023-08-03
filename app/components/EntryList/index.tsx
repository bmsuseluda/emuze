import type { HTMLAttributes, RefObject } from "react";
import React, { useCallback, useRef } from "react";
import { useTestId } from "~/hooks/useTestId";
import type { Entry as EntryType } from "~/types/jsonFiles/category";
import { Ul } from "../Ul";
import { Entry } from "./components/Entry";
import { useRefsGrid } from "~/hooks/useRefsGrid";
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
  onExecute: () => void;
  "data-testid"?: string;
} & HTMLAttributes<HTMLUListElement>;

const List = styled(Ul, {
  base: {
    display: "grid",
    gap: "1",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  },
});

export const EntryListDynamic = ({
  entries,
  listRef,
  ...rest
}: Props & { listRef: RefObject<HTMLDivElement> }) => {
  const { entriesToRender } = useAddEntriesToRenderOnScrollEnd(
    listRef,
    entries || [],
  );

  return <EntryList entries={entriesToRender} {...rest} />;
};

export const EntryList = ({
  entries,
  alwaysGameNames = false,
  isInFocus,
  onBack,
  onExecute,
  "data-testid": dataTestid,
}: Props) => {
  const { getTestId } = useTestId(dataTestid);

  const entriesRefs = useRef<HTMLInputElement[]>([]);
  const entryListRef = useRef<HTMLUListElement>(null);

  const { entriesRefsGrid } = useRefsGrid(entryListRef, entriesRefs, entries);

  const selectEntry = (entry: HTMLInputElement) => {
    entry.checked = true;
    entry.focus();
  };

  const { selectedEntry, resetSelected } = useGamepadsOnGrid(
    entriesRefsGrid,
    selectEntry,
    isInFocus,
  );

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
      // TODO: selectedEntry.current won't set with mouse click, therefore doubleClick does not work
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
      {entries.map(({ id, name, metaData }, index) => (
        <Entry
          id={id}
          name={name}
          imageUrl={metaData?.imageUrl}
          alwaysGameName={alwaysGameNames}
          onDoubleClick={handleExecute}
          ref={(ref) => {
            if (ref) {
              entriesRefs.current[index] = ref;
            }
          }}
          key={id}
          {...getTestId("entry")}
        />
      ))}
    </List>
  );
};
