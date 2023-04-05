import type { HTMLAttributes } from "react";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
  useEffect(() => {
    let timer: number;
    if (entriesToRender.length < entries.length) {
      timer = window?.setTimeout(() => {
        setEntriesToRender((entriesToRender) => [
          ...entriesToRender,
          ...entries.slice(
            entriesToRender.length,
            entriesToRender.length + 400
          ),
        ]);
      }, 500);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [entriesToRender, entries]);

  const { entriesRefsGrid } = useRefsGrid(
    entryListRef,
    entriesRefs,
    entriesToRender
  );

  const selectEntry = useCallback((entry: HTMLInputElement) => {
    entry.checked = true;
    entry.focus();
  }, []);

  const { selectedEntry, resetSelected } = useGamepadsOnGrid(
    entriesRefsGrid,
    selectEntry,
    isInFocus
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
