import type { ElementRef } from "react";
import { useCallback, useEffect, useRef } from "react";
import {
  useDirectionalInputDown,
  useDirectionalInputUp,
  useInputBack,
} from "../useDirectionalInput/index.js";
import type { FocusElement } from "../../types/focusElement.js";

// TODO: write tests
export const useGamepadsOnSidebar = (
  isInFocus: boolean,
  switchFocus: (nextFocusElement: FocusElement) => void,
  inputBack: boolean = true,
) => {
  const categoryLinksRefs = useRef<ElementRef<"a">[]>([]);

  const selectLink = useCallback((index: number) => {
    const currentLink = categoryLinksRefs.current.at(index);
    if (currentLink && document.activeElement !== currentLink) {
      currentLink.focus();
      currentLink.click();
    }
  }, []);

  const getCurrentIndex = () =>
    categoryLinksRefs.current.findIndex((element) => element?.ariaCurrent);

  /* Set element focus on the selected link again if focus is set on sidebar again */
  useEffect(() => {
    // The timeout is necessary to wait for page change on mouse click on a sidebar link
    setTimeout(() => {
      const selectedLink = categoryLinksRefs.current[getCurrentIndex()];
      if (
        isInFocus &&
        selectedLink &&
        document.activeElement !== selectedLink
      ) {
        selectedLink.focus();
      }
    }, 100);
  }, [isInFocus]);

  const onDown = useCallback(() => {
    if (isInFocus) {
      const currentIndex = getCurrentIndex();
      if (currentIndex < categoryLinksRefs.current.length - 1) {
        selectLink(currentIndex + 1);
      } else if (currentIndex === categoryLinksRefs.current.length - 1) {
        selectLink(0);
      }
    }
  }, [isInFocus, selectLink]);

  const onUp = useCallback(() => {
    if (isInFocus) {
      const currentIndex = getCurrentIndex();
      if (currentIndex > 0) {
        selectLink(currentIndex - 1);
      } else if (currentIndex === 0) {
        selectLink(-1);
      }
    }
  }, [isInFocus, selectLink]);

  const onBack = useCallback(() => {
    if (inputBack && isInFocus) {
      const currentIndex = getCurrentIndex();
      if (currentIndex === 0) {
        switchFocus("closeDialog");
      } else {
        selectLink(0);
      }
    }
  }, [inputBack, isInFocus, selectLink, switchFocus]);

  useDirectionalInputUp(onUp);
  useDirectionalInputDown(onDown);
  useInputBack(onBack);

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
