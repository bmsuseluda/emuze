import {
  useGamepadButtonPressEvent,
  useGamepadStickDirectionEvent,
  useKeyboardEvent,
} from "~/hooks/useGamepadEvent";
import { layout } from "~/hooks/useGamepads/layouts";
import type { MutableRefObject } from "react";
import { useCallback, useEffect, useRef } from "react";
import { useFocus } from "~/hooks/useFocus";
import type { FocusElements } from "~/types/focusElements";

export const useGamepadsOnGrid = <T>(
  entriesRefsGrid: MutableRefObject<T[][]>,
  onSelectEntry: (entry: T) => void
) => {
  const selectedX = useRef<number>();
  const selectedY = useRef<number>();
  const selectedEntry = useRef<T>();

  const { isInFocus, switchFocus } = useFocus<FocusElements>("main");

  useEffect(() => {
    if (isInFocus) {
      selectedX.current = 0;
      selectedY.current = 0;
      handleSelectEntry(selectedX.current, selectedY.current);
    }
  }, [isInFocus]);

  const getLastIndex = useCallback(
    (array: T[] | T[][]) => array.length - 1,
    []
  );

  const handleSelectEntry = useCallback(
    (x: number, y: number) => {
      const entry = entriesRefsGrid.current[y][x];
      selectedEntry.current = entry;
      if (entry) {
        onSelectEntry(entry);
      }
    },
    [onSelectEntry, selectedEntry, entriesRefsGrid]
  );

  const onRight = useCallback(() => {
    if (entriesRefsGrid.current) {
      if (
        typeof selectedX.current !== "undefined" &&
        typeof selectedY.current !== "undefined"
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
  }, [handleSelectEntry, getLastIndex, entriesRefsGrid]);

  const onLeft = useCallback(() => {
    if (entriesRefsGrid.current) {
      if (
        typeof selectedX.current !== "undefined" &&
        typeof selectedY.current !== "undefined"
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
  }, [handleSelectEntry, getLastIndex, entriesRefsGrid]);

  const onDown = useCallback(() => {
    if (entriesRefsGrid.current) {
      if (
        typeof selectedX.current !== "undefined" &&
        typeof selectedY.current !== "undefined"
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
    }
  }, [handleSelectEntry, getLastIndex, entriesRefsGrid]);

  const onUp = useCallback(() => {
    if (entriesRefsGrid.current) {
      if (
        typeof selectedX.current !== "undefined" &&
        typeof selectedY.current !== "undefined"
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
    }
  }, [handleSelectEntry, getLastIndex, entriesRefsGrid]);

  useGamepadButtonPressEvent(layout.buttons.DPadRight, onRight);
  useGamepadButtonPressEvent(layout.buttons.DPadLeft, onLeft);
  useGamepadButtonPressEvent(layout.buttons.DPadDown, onDown);
  useGamepadButtonPressEvent(layout.buttons.DPadUp, onUp);

  useGamepadStickDirectionEvent("leftStickRight", onRight);
  useGamepadStickDirectionEvent("leftStickLeft", onLeft);
  useGamepadStickDirectionEvent("leftStickDown", onDown);
  useGamepadStickDirectionEvent("leftStickUp", onUp);

  useKeyboardEvent("ArrowRight", onRight);
  useKeyboardEvent("ArrowLeft", onLeft);
  useKeyboardEvent("ArrowDown", onDown);
  useKeyboardEvent("ArrowUp", onUp);

  const resetSelected = useCallback(() => {
    selectedX.current = undefined;
    selectedY.current = undefined;
    selectedEntry.current = undefined;
  }, []);

  return { selectedEntry, resetSelected };
};
