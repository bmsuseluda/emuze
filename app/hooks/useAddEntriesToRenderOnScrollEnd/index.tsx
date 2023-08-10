import type { RefObject } from "react";
import { useCallback, useEffect, useState } from "react";
import type { Entry } from "~/types/jsonFiles/category";

const entriesNumberForChunk = 60;

export const useAddEntriesToRenderOnScrollEnd = (
  listRef: RefObject<HTMLDivElement>,
  entries: Entry[],
) => {
  const [entriesToRender, setEntriesToRender] = useState(
    entries.slice(0, entriesNumberForChunk),
  );

  useEffect(() => {
    setEntriesToRender(entries.slice(0, entriesNumberForChunk));
  }, [entries]);

  const addEntriesToRender = useCallback(() => {
    if (entriesToRender.length < entries.length) {
      setEntriesToRender((entriesToRender) => [
        ...entriesToRender,
        ...entries.slice(
          entriesToRender.length,
          entriesToRender.length + entriesNumberForChunk,
        ),
      ]);
    }
  }, [entries, entriesToRender]);

  useEffect(() => {
    const listRefCopy = listRef;
    const addEntriesOnScrollEnd = () => {
      if (listRef.current) {
        const { scrollHeight, scrollTop } = listRef.current;
        if (scrollTop >= scrollHeight * 0.7) {
          addEntriesToRender();
        }
      }
    };
    listRef.current?.addEventListener("scroll", addEntriesOnScrollEnd);

    return () => {
      listRefCopy.current?.removeEventListener("scroll", addEntriesOnScrollEnd);
    };
  }, [addEntriesToRender, listRef]);

  return {
    listRef,
    entriesToRender,
  };
};
