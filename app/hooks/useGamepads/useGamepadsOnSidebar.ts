import { layout } from "~/hooks/useGamepads/layouts";
import { useCallback, useRef } from "react";
import {
  useGamepadButtonPressEvent,
  useGamepadStickDirectionEvent,
  useKeyboardEvent,
} from "~/hooks/useGamepadEvent";

type CategoryLink = {
  id: string;
  name: string;
  to: string;
};

export const useGamepadsOnSidebar = (categoryLinks: CategoryLink[]) => {
  const categoryLinksRefs = useRef<HTMLAnchorElement[]>([]);
  // TODO: use a context for this instead
  const focusOnMain = useRef(false);
  const selected = useRef<number>();

  const selectLink = useCallback((index: number) => {
    categoryLinksRefs.current[index]?.focus();
    categoryLinksRefs.current[index]?.click();
    return index;
  }, []);

  const onDown = useCallback(() => {
    if (!focusOnMain.current) {
      if (typeof selected.current === "undefined") {
        selected.current = selectLink(0);
      } else if (selected.current < categoryLinksRefs.current.length - 1) {
        selected.current = selectLink(selected.current + 1);
      } else if (selected.current === categoryLinksRefs.current.length - 1) {
        selected.current = selectLink(0);
      }
    }
  }, [selectLink]);

  const onUp = useCallback(() => {
    if (!focusOnMain.current) {
      if (typeof selected.current === "undefined") {
        selected.current = selectLink(categoryLinksRefs.current.length - 1);
      } else if (selected.current > 0) {
        selected.current = selectLink(selected.current - 1);
      } else if (selected.current === 0) {
        selected.current = selectLink(categoryLinksRefs.current.length - 1);
      }
    }
  }, [selectLink]);

  useGamepadButtonPressEvent(layout.buttons.DPadDown, onDown);
  useGamepadButtonPressEvent(layout.buttons.DPadUp, onUp);
  useGamepadStickDirectionEvent("leftStickDown", onDown);
  useGamepadStickDirectionEvent("leftStickUp", onUp);
  useKeyboardEvent("ArrowUp", onUp);
  useKeyboardEvent("ArrowDown", onDown);

  const onFocusToMain = useCallback(() => {
    if (!focusOnMain.current) {
      focusOnMain.current = true;
    }
  }, []);

  useGamepadButtonPressEvent(layout.buttons.DPadRight, onFocusToMain);
  useGamepadStickDirectionEvent("leftStickRight", onFocusToMain);
  useKeyboardEvent("ArrowRight", onFocusToMain);

  const onBack = useCallback(() => {
    focusOnMain.current = false;
  }, []);

  useGamepadButtonPressEvent(layout.buttons.B, onBack);
  useKeyboardEvent("Backspace", onBack);

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
