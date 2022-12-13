import type { MutableRefObject } from "react";
import { useCallback, useEffect, useRef } from "react";

export const useRefsGrid = <T extends HTMLElement, R>(
  entriesRefs: MutableRefObject<T[]>,
  entries?: R[]
) => {
  const entriesRefsGrid = useRef<T[][]>([]);

  const createRefsGrid = useCallback(() => {
    const entriesGrid: T[][] = [];

    const addToRow = (rowIndex: number, entry: T) => {
      if (!entriesGrid[rowIndex]) {
        // create new row
        entriesGrid[rowIndex] = [entry];
      } else {
        // add to existing row
        entriesGrid[rowIndex].push(entry);
      }
    };

    let rowIndex = 0;
    entriesRefs.current.forEach((entry, index) => {
      const top = entry?.getBoundingClientRect().top;
      if (index > 0) {
        const topPrevious =
          entriesRefs.current[index - 1]?.getBoundingClientRect().top;
        if (top && topPrevious && top > topPrevious) {
          // nextRow
          rowIndex = rowIndex + 1;
          addToRow(rowIndex, entry);
          return;
        }
      }
      addToRow(rowIndex, entry);
    });
    entriesRefsGrid.current = entriesGrid;
  }, [entriesRefs]);

  useEffect(() => {
    createRefsGrid();
  }, [entries, createRefsGrid]);

  useEffect(() => {
    window.addEventListener("resize", createRefsGrid);

    return () => {
      window.removeEventListener("resize", createRefsGrid);
    };
  });

  return { entriesRefsGrid };
};
