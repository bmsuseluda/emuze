import {
  useGamepadButtonPressEvent,
  useGamepadStickDirectionEvent,
  useKeyboardEvent,
} from "~/hooks/useGamepadEvent";
import { layout } from "~/hooks/useGamepads/layouts";
import type { MutableRefObject } from "react";
import { useCallback, useEffect, useRef } from "react";

export const useGamepadsOnGrid = <T>(
  entriesRefsGrid: MutableRefObject<T[][]>,
  onSelectEntry: (entry: T) => void,
  isInFocus: boolean,
  onDown: (
    entriesRefsGrid: MutableRefObject<T[][]>,
    selectedY: MutableRefObject<number | undefined>
  ) => void,
  onUp: (
    entriesRefsGrid: MutableRefObject<T[][]>,
    selectedY: MutableRefObject<number | undefined>
  ) => void
) => {
  const selectedX = useRef<number>();
  const selectedY = useRef<number>();
  const selectedEntry = useRef<T>();

  const handleSelectEntry = useCallback(
    (x: number, y: number) => {
      if (entriesRefsGrid.current[y] && entriesRefsGrid.current[y][x]) {
        const entry = entriesRefsGrid.current[y][x];
        selectedEntry.current = entry;
        onSelectEntry(entry);
      }
    },
    [onSelectEntry, selectedEntry, entriesRefsGrid]
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
    []
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
        } else if (
          selectedX.current ===
          getLastIndex(entriesRefsGrid.current[selectedY.current])
        ) {
          selectedX.current = 0;
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
        } else if (selectedX.current === 0) {
          selectedX.current = getLastIndex(
            entriesRefsGrid.current[selectedY.current]
          );
          handleSelectEntry(selectedX.current, selectedY.current);

          //   TODO: Check how to switch to main if first element
        }
      }
    }
  }, [handleSelectEntry, getLastIndex, entriesRefsGrid, isInFocus]);

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
              entriesRefsGrid.current[selectedY.current]
            );
          }
          handleSelectEntry(selectedX.current, selectedY.current);
        } else if (
          selectedY.current === getLastIndex(entriesRefsGrid.current)
        ) {
          selectedY.current = 0;
          handleSelectEntry(selectedX.current, selectedY.current);
        }
      }

      onDown(entriesRefsGrid, selectedY);
    }
  }, [handleSelectEntry, getLastIndex, entriesRefsGrid, isInFocus, onDown]);

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
        } else if (selectedY.current === 0) {
          selectedY.current = getLastIndex(entriesRefsGrid.current);
          if (!entriesRefsGrid.current[selectedY.current][selectedX.current]) {
            selectedX.current = getLastIndex(
              entriesRefsGrid.current[selectedY.current]
            );
          }
          handleSelectEntry(selectedX.current, selectedY.current);
        }
      }

      onUp(entriesRefsGrid, selectedY);
    }
  }, [handleSelectEntry, getLastIndex, entriesRefsGrid, isInFocus, onUp]);

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

  return { selectedEntry, resetSelected, selectedX };
};
