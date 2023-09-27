import type { ElementRef } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDeepCompareEffect } from "react-use";
import type { Entry } from "~/types/jsonFiles/category";

const entriesCountForChunk = 20;

export const useAddEntriesToRenderOnScrollEnd = (entries: Entry[]) => {
  const [entriesToRender, setEntriesToRender] = useState(
    entries.slice(0, entriesCountForChunk),
  );

  useDeepCompareEffect(() => {
    setEntriesToRender(
      entries.slice(
        0,
        entriesCountForChunk < entriesToRender.length
          ? entriesToRender.length
          : entriesCountForChunk,
      ),
    );
  }, [entries]);

  const addEntriesToRender = useCallback(() => {
    if (entriesToRender.length < entries.length) {
      setEntriesToRender((entriesToRender) => [
        ...entriesToRender,
        ...entries.slice(
          entriesToRender.length,
          entriesToRender.length + entriesCountForChunk,
        ),
      ]);
    }
  }, [entries, entriesToRender]);

  const inViewRef = useRef<ElementRef<"div">>(null);

  const intersectionCallback: IntersectionObserverCallback = useCallback(
    (entries) => {
      if (entries.length === 1 && entries[0].isIntersecting) {
        addEntriesToRender();
      }
    },
    [addEntriesToRender],
  );

  useEffect(() => {
    const inViewRefCopy = inViewRef;
    const observer = new IntersectionObserver(intersectionCallback);

    if (inViewRefCopy.current) {
      observer.observe(inViewRefCopy.current);
    }

    return () => {
      if (inViewRefCopy.current) {
        observer.unobserve(inViewRefCopy.current);
      }
    };
  }, [intersectionCallback, inViewRef]);

  return {
    entriesToRender,
    inViewRef,
  };
};
