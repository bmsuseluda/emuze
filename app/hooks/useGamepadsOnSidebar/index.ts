import type { ElementRef } from "react";
import { useCallback, useEffect, useRef } from "react";
import {
  useDirectionalInputDown,
  useDirectionalInputUp,
} from "../useDirectionalInput";

// TODO: write tests
export const useGamepadsOnSidebar = (isInFocus: boolean) => {
  const categoryLinksRefs = useRef<ElementRef<"a">[]>([]);

  const selectLink = useCallback((index: number) => {
    const currentLink = categoryLinksRefs.current.at(index);
    if (currentLink && document.activeElement !== currentLink) {
      currentLink.focus();
      currentLink.click();
    }
  }, []);

  const getCurrentIndex = useCallback(
    () => categoryLinksRefs.current.findIndex((element) => element.ariaCurrent),
    [],
  );

  /* Set element focus on the selected link again if focus is set on sidebar again */
  useEffect(() => {
    const selectedLink = categoryLinksRefs.current[getCurrentIndex()];
    if (isInFocus && selectedLink) {
      selectedLink.focus();
    }
  }, [isInFocus, getCurrentIndex]);

  const onDown = useCallback(() => {
    if (isInFocus) {
      const currentIndex = getCurrentIndex();
      if (currentIndex < categoryLinksRefs.current.length - 1) {
        selectLink(currentIndex + 1);
      } else if (currentIndex === categoryLinksRefs.current.length - 1) {
        selectLink(0);
      }
    }
  }, [isInFocus, selectLink, getCurrentIndex]);

  const onUp = useCallback(() => {
    if (isInFocus) {
      const currentIndex = getCurrentIndex();
      if (currentIndex > 0) {
        selectLink(currentIndex - 1);
      } else if (currentIndex === 0) {
        selectLink(-1);
      }
    }
  }, [isInFocus, selectLink, getCurrentIndex]);

  useDirectionalInputUp(onUp);
  useDirectionalInputDown(onDown);

  const categoryLinksRefCallback = useCallback(
    (index: number) => (ref: ElementRef<"a">) => {
      categoryLinksRefs.current[index] = ref;
    },
    [],
  );

  return {
    categoryLinksRefCallback,
  };
};
