import { layout } from "~/hooks/useGamepads/layouts";
import { useCallback, useRef } from "react";
import {
  useGamepadButtonPressEvent,
  useGamepadStickDirectionEvent,
  useKeyboardEvent,
} from "~/hooks/useGamepadEvent";
import { useFocus } from "~/hooks/useFocus";
import type { FocusElements } from "~/types/focusElements";

export const useGamepadsOnSidebar = (selectedCategoryId: number) => {
  const categoryLinksRefs = useRef<HTMLAnchorElement[]>([]);

  const { isInFocus, switchFocus } = useFocus<FocusElements>("sidebar");
  const selected = useRef<number>(selectedCategoryId);

  const selectLink = useCallback((index: number) => {
    categoryLinksRefs.current[index]?.focus();
    categoryLinksRefs.current[index]?.click();
    return index;
  }, []);

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

  const switchToMain = useCallback(() => {
    if (isInFocus) {
      switchFocus("main");
    }
  }, []);

  useGamepadButtonPressEvent(layout.buttons.DPadRight, switchToMain);
  useGamepadStickDirectionEvent("leftStickRight", switchToMain);
  useKeyboardEvent("ArrowRight", switchToMain);
  useGamepadButtonPressEvent(layout.buttons.A, switchToMain);
  useKeyboardEvent("Enter", switchToMain);

  return {
    refCallback: (index: number) => (ref: HTMLAnchorElement) => {
      if (index === 0) {
        categoryLinksRefs.current = [ref];
      } else {
        categoryLinksRefs.current.push(ref);
      }
    },
  };
};
