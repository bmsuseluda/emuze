import type { ComponentRef } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Entry } from "../../types/jsonFiles/category.js";

const entriesCountForChunk = 40;

export const useAddEntriesToRenderOnScrollEnd = (entries: Entry[]) => {
  const [entriesToRender, setEntriesToRender] = useState(entries.slice(0, 60));
  const inViewRef = useRef<ComponentRef<"div">>(null);

  const addEntriesToRender = useCallback(() => {
    setEntriesToRender((entriesToRender) => {
      if (entriesToRender.length < entries.length) {
        return [
          ...entriesToRender,
          ...entries.slice(
            entriesToRender.length,
            entriesToRender.length + entriesCountForChunk,
          ),
        ];
      }
      return entriesToRender;
    });
  }, [entries]);

  useEffect(() => {
    const inViewRefCopy = inViewRef.current;
    if (!inViewRefCopy) {
      return;
    }
    const observer = new IntersectionObserver(([intersectionEntry]) => {
      if (intersectionEntry?.isIntersecting) {
        addEntriesToRender();
      }
    });
    observer.observe(inViewRefCopy);

    return () => {
      observer.disconnect();
    };
  }, [addEntriesToRender]);

  return {
    entriesToRender,
    inViewRef,
  };
};
