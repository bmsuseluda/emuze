import debounce from "lodash.debounce";
import type { ComponentRef, RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";

/**
 * @param onCreateGrid callback when entriesRefsGrid will be created or updated
 **/
export const useRefsGrid = <T extends HTMLElement>(
  onCreateGrid: (entriesRefsGrid: RefObject<T[][]>) => () => void,
) => {
  const entriesRefsGrid = useRef<T[][]>([]);
  const entriesRefs = useRef<T[]>([]);
  const entryListRef = useRef<ComponentRef<"ul">>(null);
  const gamesPerRowRef = useRef<number>(0);

  const addEntryToRefsGrid = useCallback(
    (entry: T, indexFromEntriesRef: number) => {
      const rowIndex = Math.floor(
        (indexFromEntriesRef + 1) / gamesPerRowRef.current,
      );
      const entryIndexPerRow =
        ((indexFromEntriesRef + 1) % gamesPerRowRef.current) - 1;

      if (!entriesRefsGrid.current[rowIndex]) {
        entriesRefsGrid.current[rowIndex] = [];
      }

      entriesRefsGrid.current[rowIndex][entryIndexPerRow] = entry;
    },
    [gamesPerRowRef],
  );

  const createRefsGrid = useCallback(() => {
    gamesPerRowRef.current = 0;
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

    const addToNextRow = (entry: T) => {
      rowIndex = rowIndex + 1;
      addToRow(rowIndex, entry);
    };

    entriesRefs.current.forEach((entry, index) => {
      if (!gamesPerRowRef.current) {
        const top = entry?.getBoundingClientRect().top;
        if (index > 0) {
          const topPrevious =
            entriesRefs.current[index - 1]?.getBoundingClientRect().top;
          if (top && topPrevious && top > topPrevious) {
            gamesPerRowRef.current = entriesGrid[rowIndex].length;
            addToNextRow(entry);
            return;
          }
        }
      } else {
        if (entriesGrid[rowIndex].length === gamesPerRowRef.current) {
          addToNextRow(entry);
          return;
        }
      }
      addToRow(rowIndex, entry);
    });
    entriesRefsGrid.current = entriesGrid;
    onCreateGrid(entriesRefsGrid)();
  }, [entriesRefs, entriesRefsGrid, onCreateGrid, gamesPerRowRef]);

  useEffect(() => {
    const entryListCopy = entryListRef.current;
    if (!entryListCopy) {
      return;
    }

    const resizeObserver = new ResizeObserver(
      debounce(createRefsGrid, 200, { leading: false, trailing: true }),
    );
    resizeObserver.observe(entryListCopy.parentElement!);

    return () => {
      resizeObserver.unobserve(entryListCopy.parentElement!);
      resizeObserver.disconnect();
    };
  }, [createRefsGrid, entryListRef]);

  const entriesRefCallback = useCallback(
    (index: number) => (ref: T) => {
      addEntryToRefsGrid(ref, index);
      entriesRefs.current[index] = ref;
    },
    [entriesRefs, addEntryToRefsGrid],
  );

  return {
    /* Array containing entries refs structured on their rendered rows. The first array contains the rows on y-axis and the second array contains the entries refs in the row on x-axis [y-axis][x-axis] */
    entriesRefsGrid,
    /* List Element that contains the entries */
    entryListRef,
    /* Array of all entries */
    entriesRefs,
    /* Ref callback for all entries */
    entriesRefCallback,
  };
};
