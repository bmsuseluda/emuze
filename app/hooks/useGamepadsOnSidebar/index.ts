import { layout } from "~/hooks/useGamepads/layouts";
import type { ElementRef } from "react";
import { useCallback, useEffect, useRef } from "react";
import {
  useGamepadButtonPressEvent,
  useGamepadStickDirectionEvent,
  useKeyboardEvent,
} from "~/hooks/useGamepadEvent";

// TODO: write tests
export const useGamepadsOnSidebar = (
  selectedCategoryId: number,
  isInFocus: boolean,
) => {
  const categoryLinksRefs = useRef<ElementRef<"a">[]>([]);

  const selected = useRef<number>(selectedCategoryId);

  const selectLink = useCallback((index: number) => {
    categoryLinksRefs.current[index]?.focus();
    categoryLinksRefs.current[index]?.click();
    return index;
  }, []);

  useEffect(() => {
    const selectedLink = categoryLinksRefs.current[selected.current];
    if (isInFocus && selectedLink) {
      selectedLink.focus();
    }
  }, [isInFocus]);

  const onDown = useCallback(() => {
    if (isInFocus) {
      if (typeof selected.current === "undefined") {
        selected.current = selectLink(0);
      } else if (selected.current < categoryLinksRefs.current.length - 1) {
        selected.current = selectLink(selected.current + 1);
      } else if (selected.current === categoryLinksRefs.current.length - 1) {
        selected.current = selectLink(0);
      }
    }
  }, [isInFocus, selectLink]);

  const onUp = useCallback(() => {
    if (isInFocus) {
      if (typeof selected.current === "undefined") {
        selected.current = selectLink(categoryLinksRefs.current.length - 1);
      } else if (selected.current > 0) {
        selected.current = selectLink(selected.current - 1);
      } else if (selected.current === 0) {
        selected.current = selectLink(categoryLinksRefs.current.length - 1);
      }
    }
  }, [isInFocus, selectLink]);

  useGamepadButtonPressEvent(layout.buttons.DPadDown, onDown);
  useGamepadButtonPressEvent(layout.buttons.DPadUp, onUp);
  useGamepadStickDirectionEvent("leftStickDown", onDown);
  useGamepadStickDirectionEvent("leftStickUp", onUp);
  useKeyboardEvent("ArrowUp", onUp);
  useKeyboardEvent("ArrowDown", onDown);

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
