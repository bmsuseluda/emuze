import {
  useGamepadButtonPressEvent,
  useGamepadStickDirectionEvent,
} from "../useGamepadEvent";
import { layout } from "../useGamepads/layouts";
import type { MutableRefObject, RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";
import { useRefsGrid } from "../useRefsGrid";
import { useKeyboardEvent } from "../useKeyboardEvent";

export interface Result<T> {
  selectedEntry: MutableRefObject<T | undefined>;
  resetSelected: () => void;
  updatePosition: () => void;
  entryListRef: RefObject<HTMLUListElement>;
  entriesRefs: MutableRefObject<T[]>;
  entriesRefCallback: (index: number) => (ref: T) => void;
  // TODO: only for tests for now. is it possible without?
  entriesRefsGrid: MutableRefObject<T[][]>;
}

interface Props<T> {
  onSelectEntry: (entry: T) => void;
  isInFocus: boolean;
  onLeftOverTheEdge?: (props: Result<T>) => void;
  onRightOverTheEdge?: (props: Result<T>) => void;
  onTopOverTheEdge?: (props: Result<T>) => void;
  onBottomOverTheEdge?: (props: Result<T>) => void;
}

export const useGamepadsOnGrid = <T extends HTMLElement>({
  onSelectEntry,
  isInFocus,
  onLeftOverTheEdge,
  onRightOverTheEdge,
  onTopOverTheEdge,
  onBottomOverTheEdge,
}: Props<T>): Result<T> => {
  const selectedX = useRef<number>();
  const selectedY = useRef<number>();
  const selectedEntry = useRef<T>();

  const handleSelectEntry = useCallback(
    (entriesRefsGrid: MutableRefObject<T[][]>, x: number, y: number) => {
      if (entriesRefsGrid.current[y] && entriesRefsGrid.current[y][x]) {
        const entry = entriesRefsGrid.current[y][x];
        selectedEntry.current = entry;
        onSelectEntry(entry);
      }
    },
    [onSelectEntry, selectedEntry],
  );

  const selectFirstEntry = useCallback(
    (entriesRefsGrid: MutableRefObject<T[][]>) => {
      if (isInFocus) {
        selectedX.current = 0;
        selectedY.current = 0;
        handleSelectEntry(
          entriesRefsGrid,
          selectedX.current,
          selectedY.current,
        );
      }
    },
    [isInFocus, handleSelectEntry],
  );

  const updatePosition = useCallback(
    (entriesRefsGrid: MutableRefObject<T[][]>) => () => {
      if (selectedEntry.current) {
        const selectedEntryInGrid = entriesRefsGrid.current.find(
          (row, indexY) => {
            const indexX = row.findIndex(
              (entry) => entry === selectedEntry.current,
            );
            if (indexX >= 0) {
              selectedX.current = indexX;
              selectedY.current = indexY;
              return true;
            }
            return false;
          },
        );

        // entry is not in the grid anymore
        if (!selectedEntryInGrid) {
          // select entry in the old position if possible, else select first entry
          if (
            selectedX.current &&
            selectedY.current &&
            entriesRefsGrid.current[selectedY.current] &&
            entriesRefsGrid.current[selectedY.current][selectedX.current]
          ) {
            handleSelectEntry(
              entriesRefsGrid,
              selectedX.current,
              selectedY.current,
            );
          } else {
            selectFirstEntry(entriesRefsGrid);
          }
        }
      } else {
        selectFirstEntry(entriesRefsGrid);
      }
    },
    [selectFirstEntry, handleSelectEntry],
  );

  const { entriesRefsGrid, entryListRef, entriesRefs, entriesRefCallback } =
    useRefsGrid(updatePosition);

  useEffect(() => {
    if (isInFocus) {
      if (
        typeof selectedX.current === "undefined" ||
        typeof selectedY.current === "undefined" ||
        typeof selectedEntry.current === "undefined"
      ) {
        selectFirstEntry(entriesRefsGrid);
      } else {
        handleSelectEntry(
          entriesRefsGrid,
          selectedX.current,
          selectedY.current,
        );
      }
    }
  }, [isInFocus, handleSelectEntry, selectFirstEntry, entriesRefsGrid]);

  const getLastIndex = useCallback(
    (array: T[] | T[][]) => array.length - 1,
    [],
  );

  const resetSelected = useCallback(() => {
    selectedX.current = undefined;
    selectedY.current = undefined;
    selectedEntry.current = undefined;
  }, []);

  const createResult = useCallback(
    (): Result<T> => ({
      entriesRefCallback,
      entriesRefs,
      entriesRefsGrid,
      entryListRef,
      resetSelected,
      selectedEntry,
      updatePosition: updatePosition(entriesRefsGrid),
    }),
    [
      entriesRefCallback,
      entriesRefs,
      entriesRefsGrid,
      entryListRef,
      resetSelected,
      selectedEntry,
      updatePosition,
    ],
  );

  const onRight = useCallback(() => {
    if (isInFocus && entriesRefsGrid.current) {
      if (
        typeof selectedX.current !== "undefined" &&
        typeof selectedY.current !== "undefined" &&
        entriesRefsGrid.current[selectedY.current]
      ) {
        const lastIndex = getLastIndex(
          entriesRefsGrid.current[selectedY.current],
        );
        if (selectedX.current < lastIndex) {
          selectedX.current = selectedX.current + 1;
          handleSelectEntry(
            entriesRefsGrid,
            selectedX.current,
            selectedY.current,
          );
        } else if (selectedX.current === lastIndex && onRightOverTheEdge) {
          onRightOverTheEdge(createResult());
        }
      }
    }
  }, [
    handleSelectEntry,
    getLastIndex,
    entriesRefsGrid,
    isInFocus,
    onRightOverTheEdge,
    createResult,
  ]);

  const onLeft = useCallback(() => {
    if (isInFocus && entriesRefsGrid.current) {
      if (
        typeof selectedX.current !== "undefined" &&
        typeof selectedY.current !== "undefined" &&
        entriesRefsGrid.current[selectedY.current]
      ) {
        if (selectedX.current > 0) {
          selectedX.current = selectedX.current - 1;
          handleSelectEntry(
            entriesRefsGrid,
            selectedX.current,
            selectedY.current,
          );
        } else if (selectedX.current === 0 && onLeftOverTheEdge) {
          onLeftOverTheEdge(createResult());
        }
      }
    }
  }, [
    handleSelectEntry,
    entriesRefsGrid,
    isInFocus,
    onLeftOverTheEdge,
    createResult,
  ]);

  const onDown = useCallback(() => {
    if (isInFocus && entriesRefsGrid.current) {
      if (
        typeof selectedX.current !== "undefined" &&
        typeof selectedY.current !== "undefined" &&
        entriesRefsGrid.current[selectedY.current]
      ) {
        const lastIndex = getLastIndex(entriesRefsGrid.current);
        if (selectedY.current < lastIndex) {
          selectedY.current = selectedY.current + 1;
          if (!entriesRefsGrid.current[selectedY.current][selectedX.current]) {
            selectedX.current = getLastIndex(
              entriesRefsGrid.current[selectedY.current],
            );
          }
          handleSelectEntry(
            entriesRefsGrid,
            selectedX.current,
            selectedY.current,
          );
        } else if (selectedY.current === lastIndex && onBottomOverTheEdge) {
          onBottomOverTheEdge(createResult());
        }
      }
    }
  }, [
    handleSelectEntry,
    getLastIndex,
    entriesRefsGrid,
    isInFocus,
    onBottomOverTheEdge,
    createResult,
  ]);

  const onUp = useCallback(() => {
    if (isInFocus && entriesRefsGrid.current) {
      if (
        typeof selectedX.current !== "undefined" &&
        typeof selectedY.current !== "undefined" &&
        entriesRefsGrid.current[selectedY.current]
      ) {
        if (selectedY.current > 0) {
          selectedY.current = selectedY.current - 1;
          handleSelectEntry(
            entriesRefsGrid,
            selectedX.current,
            selectedY.current,
          );
        } else if (selectedY.current === 0 && onTopOverTheEdge) {
          onTopOverTheEdge(createResult());
        }
      }
    }
  }, [
    handleSelectEntry,
    entriesRefsGrid,
    isInFocus,
    onTopOverTheEdge,
    createResult,
  ]);

  useGamepadButtonPressEvent(layout.buttons.DPadRight, onRight);
  useGamepadButtonPressEvent(layout.buttons.DPadLeft, onLeft);
  useGamepadButtonPressEvent(layout.buttons.DPadDown, onDown);
  useGamepadButtonPressEvent(layout.buttons.DPadUp, onUp);

  useGamepadStickDirectionEvent("leftStickRight", onRight);
  useGamepadStickDirectionEvent("leftStickLeft", onLeft);
  useGamepadStickDirectionEvent("leftStickDown", onDown);
  useGamepadStickDirectionEvent("leftStickUp", onUp);

  useGamepadStickDirectionEvent("extraStickRight", onRight);
  useGamepadStickDirectionEvent("extraStickLeft", onLeft);
  useGamepadStickDirectionEvent("extraStickDown", onDown);
  useGamepadStickDirectionEvent("extraStickUp", onUp);

  useKeyboardEvent("ArrowRight", onRight);
  useKeyboardEvent("ArrowLeft", onLeft);
  useKeyboardEvent("ArrowDown", onDown);
  useKeyboardEvent("ArrowUp", onUp);

  return createResult();
};
