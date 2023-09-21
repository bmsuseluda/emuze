import {
  useGamepadButtonPressEvent,
  useGamepadStickDirectionEvent,
  useKeyboardEvent,
} from "~/hooks/useGamepadEvent";
import { layout } from "~/hooks/useGamepads/layouts";
import type { MutableRefObject } from "react";
import { useCallback, useEffect, useRef } from "react";
import { useRefsGrid } from "~/hooks/useRefsGrid";

export const useGamepadsOnGrid = <T extends HTMLElement>(
  onSelectEntry: (entry: T) => void,
  // TODO: add function callback for leftOverTheEdge
  isInFocus: boolean,
) => {
  const selectedX = useRef<number>();
  const selectedY = useRef<number>();
  const selectedEntry = useRef<T>();

  const updatePosition = useCallback(
    (entriesRefsGrid: MutableRefObject<T[][]>) => () => {
      if (selectedEntry.current) {
        entriesRefsGrid.current.forEach((row, indexY) => {
          const indexX = row.findIndex(
            (entry) => entry === selectedEntry.current,
          );
          if (indexX >= 0) {
            selectedX.current = indexX;
            selectedY.current = indexY;
          }
        });
      }
    },
    [],
  );

  const { entriesRefsGrid, entryListRef, entriesRefs } =
    useRefsGrid(updatePosition);

  const handleSelectEntry = useCallback(
    (x: number, y: number) => {
      if (entriesRefsGrid.current[y] && entriesRefsGrid.current[y][x]) {
        const entry = entriesRefsGrid.current[y][x];
        selectedEntry.current = entry;
        onSelectEntry(entry);
      }
    },
    [onSelectEntry, selectedEntry, entriesRefsGrid],
  );

  // TODO: Check if this could be done without useEffect
  useEffect(() => {
    if (isInFocus) {
      if (
        typeof selectedX.current === "undefined" ||
        typeof selectedY.current === "undefined" ||
        typeof selectedEntry.current === "undefined"
      ) {
        selectedX.current = 0;
        selectedY.current = 0;
      }
      handleSelectEntry(selectedX.current, selectedY.current);
    }
  }, [isInFocus, handleSelectEntry]);

  const getLastIndex = useCallback(
    (array: T[] | T[][]) => array.length - 1,
    [],
  );

  const handleRight = useCallback(() => {
    if (isInFocus && entriesRefsGrid.current) {
      if (
        typeof selectedX.current !== "undefined" &&
        typeof selectedY.current !== "undefined" &&
        entriesRefsGrid.current[selectedY.current]
      ) {
        if (
          selectedX.current <
          getLastIndex(entriesRefsGrid.current[selectedY.current])
        ) {
          selectedX.current = selectedX.current + 1;
          handleSelectEntry(selectedX.current, selectedY.current);
        }
      }
    }
  }, [handleSelectEntry, getLastIndex, entriesRefsGrid, isInFocus]);

  const handleLeft = useCallback(() => {
    if (isInFocus && entriesRefsGrid.current) {
      if (
        typeof selectedX.current !== "undefined" &&
        typeof selectedY.current !== "undefined" &&
        entriesRefsGrid.current[selectedY.current]
      ) {
        if (selectedX.current > 0) {
          selectedX.current = selectedX.current - 1;
          handleSelectEntry(selectedX.current, selectedY.current);
        }
      }
    }
  }, [handleSelectEntry, entriesRefsGrid, isInFocus]);

  const handleDown = useCallback(() => {
    if (isInFocus && entriesRefsGrid.current) {
      if (
        typeof selectedX.current !== "undefined" &&
        typeof selectedY.current !== "undefined" &&
        entriesRefsGrid.current[selectedY.current]
      ) {
        if (selectedY.current < getLastIndex(entriesRefsGrid.current)) {
          selectedY.current = selectedY.current + 1;
          if (!entriesRefsGrid.current[selectedY.current][selectedX.current]) {
            selectedX.current = getLastIndex(
              entriesRefsGrid.current[selectedY.current],
            );
          }
          handleSelectEntry(selectedX.current, selectedY.current);
        }
      }
    }
  }, [handleSelectEntry, getLastIndex, entriesRefsGrid, isInFocus]);

  const handleUp = useCallback(() => {
    if (isInFocus && entriesRefsGrid.current) {
      if (
        typeof selectedX.current !== "undefined" &&
        typeof selectedY.current !== "undefined" &&
        entriesRefsGrid.current[selectedY.current]
      ) {
        if (selectedY.current > 0) {
          selectedY.current = selectedY.current - 1;
          handleSelectEntry(selectedX.current, selectedY.current);
        }
      }
    }
  }, [handleSelectEntry, entriesRefsGrid, isInFocus]);

  useGamepadButtonPressEvent(layout.buttons.DPadRight, handleRight);
  useGamepadButtonPressEvent(layout.buttons.DPadLeft, handleLeft);
  useGamepadButtonPressEvent(layout.buttons.DPadDown, handleDown);
  useGamepadButtonPressEvent(layout.buttons.DPadUp, handleUp);

  useGamepadStickDirectionEvent("leftStickRight", handleRight);
  useGamepadStickDirectionEvent("leftStickLeft", handleLeft);
  useGamepadStickDirectionEvent("leftStickDown", handleDown);
  useGamepadStickDirectionEvent("leftStickUp", handleUp);

  useKeyboardEvent("ArrowRight", handleRight);
  useKeyboardEvent("ArrowLeft", handleLeft);
  useKeyboardEvent("ArrowDown", handleDown);
  useKeyboardEvent("ArrowUp", handleUp);

  const resetSelected = useCallback(() => {
    selectedX.current = undefined;
    selectedY.current = undefined;
    selectedEntry.current = undefined;
  }, []);

  return {
    selectedEntry,
    resetSelected,
    updatePosition: updatePosition(entriesRefsGrid),
    entryListRef,
    entriesRefs,
    // TODO: only for tests for now. is it possible without?
    entriesRefsGrid,
  };
};
