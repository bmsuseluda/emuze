import type { HTMLAttributes, MutableRefObject } from "react";
import React, { useCallback, useRef, useState } from "react";
import { useTestId } from "~/hooks/useTestId";
import { styled } from "~/stitches";
import type { Entry as EntryType } from "~/types/category";
import { Ul } from "../Ul";
import { Entry } from "./components/Entry";
import { useRefsGrid } from "~/hooks/useRefsGrid";
import { useGamepadsOnGrid } from "~/hooks/useGamepadsOnGrid";
import {
  useGamepadButtonPressEvent,
  useKeyboardEvent,
} from "~/hooks/useGamepadEvent";
import { layout } from "~/hooks/useGamepads/layouts";

type Props = {
  entries: EntryType[];
  alwaysGameNames?: boolean;
  isInFocus: boolean;
  onBack: () => void;
  onExecute: () => void;
  "data-testid"?: string;
} & HTMLAttributes<HTMLUListElement>;

const List = styled(Ul, {
  display: "grid",
  gap: "$1",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
});

const entriesNumberForChunk = 100;

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

  const [entriesToRender, setEntriesToRender] = useState(
    entries.slice(0, entriesNumberForChunk)
  );

  const { entriesRefsGrid } = useRefsGrid(
    entryListRef,
    entriesRefs,
    entriesToRender
  );

  const selectEntry = (entry: HTMLInputElement) => {
    entry.checked = true;
    entry.focus();
  };

  /* on down selectedY is entriesRefsGrid.length -2 ->
   *   add next chunk at the end of entriesToRender (third chunk)
   *   TODO: remove first chunk
   */
  const onDown = (
    entriesRefsGrid: MutableRefObject<HTMLInputElement[][]>,
    selectedY: MutableRefObject<number | undefined>
  ) => {
    if (selectedY.current === entriesRefsGrid.current.length - 2) {
      setEntriesToRender((entriesToRender) => [
        ...entriesToRender,
        ...entries.slice(
          entriesToRender.length,
          entriesToRender.length + entriesNumberForChunk
        ),
      ]);
    }
  };

  /*
   * TODO: implement
   * on up selectedY is 2 ->
   *   add first chunk at the beginning of entriesToRender (first chunk)
   *   remove third chunk
   * */
  const onUp = () => {};

  const { selectedEntry, resetSelected } = useGamepadsOnGrid(
    entriesRefsGrid,
    selectEntry,
    isInFocus,
    onDown,
    onUp
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
      {entriesToRender.map(({ id, name, imageUrl }, index) => (
        <Entry
          id={id}
          name={name}
          imageUrl={imageUrl}
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
