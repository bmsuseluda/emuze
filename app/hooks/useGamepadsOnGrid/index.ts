import { useGamepadEvent } from "~/hooks/useGamepadEvent";
import layout from "~/hooks/useGamepads/layouts/xbox";
import type { MutableRefObject } from "react";
import { useCallback, useRef } from "react";

export const useGamepadsOnGrid = <T>(
  entriesRefsGrid: MutableRefObject<T[][]>,
  onSelectEntry: (entry: T) => void
) => {
  const selectedX = useRef<number>();
  const selectedY = useRef<number>();
  const selectedEntry = useRef<T>();

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

  useGamepadEvent(
    layout.buttons.DPadRight,
    useCallback(() => {
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
        } else {
          selectedX.current = 0;
          selectedY.current = 0;
          handleSelectEntry(selectedX.current, selectedY.current);
        }
      }
    }, [handleSelectEntry, getLastIndex, entriesRefsGrid])
  );

  useGamepadEvent(
    layout.buttons.DPadLeft,
    useCallback(() => {
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
          }
        }
      }
    }, [handleSelectEntry, getLastIndex, entriesRefsGrid])
  );

  useGamepadEvent(
    layout.buttons.DPadDown,
    useCallback(() => {
      if (entriesRefsGrid.current) {
        if (
          typeof selectedX.current !== "undefined" &&
          typeof selectedY.current !== "undefined"
        ) {
          if (selectedY.current < getLastIndex(entriesRefsGrid.current)) {
            selectedY.current = selectedY.current + 1;
            if (
              !entriesRefsGrid.current[selectedY.current][selectedX.current]
            ) {
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
    }, [handleSelectEntry, getLastIndex, entriesRefsGrid])
  );

  useGamepadEvent(
    layout.buttons.DPadUp,
    useCallback(() => {
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
            if (
              !entriesRefsGrid.current[selectedY.current][selectedX.current]
            ) {
              selectedX.current = getLastIndex(
                entriesRefsGrid.current[selectedY.current]
              );
            }
            handleSelectEntry(selectedX.current, selectedY.current);
          }
        }
      }
    }, [handleSelectEntry, getLastIndex, entriesRefsGrid])
  );

  const resetSelected = useCallback(() => {
    selectedX.current = undefined;
    selectedY.current = undefined;
    selectedEntry.current = undefined;
  }, []);

  return { selectedEntry, resetSelected };
};
