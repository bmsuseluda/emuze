import layout from "~/hooks/useGamepads/layouts/xbox";
import { useCallback, useRef } from "react";
import { useGamepadEvent } from "~/hooks/useGamepadEvent";

type CategoryLink = {
  id: string;
  name: string;
  to: string;
};

export const useGamepadsOnSidebar = (categoryLinks: CategoryLink[]) => {
  const categoryLinksRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  // TODO: use a context for this instead
  const focusOnMain = useRef(false);
  const selected = useRef<number>();

  const selectLink = useCallback((index: number) => {
    categoryLinksRefs.current[index]?.focus();
    categoryLinksRefs.current[index]?.click();
    return index;
  }, []);

  useGamepadEvent(
    layout.buttons.DPadDown,
    useCallback(() => {
      if (!focusOnMain.current) {
        if (typeof selected.current === "undefined") {
          selected.current = selectLink(0);
        } else if (selected.current < categoryLinksRefs.current.length - 1) {
          selected.current = selectLink(selected.current + 1);
        } else if (selected.current === categoryLinksRefs.current.length - 1) {
          selected.current = selectLink(0);
        }
      }
    }, [selectLink])
  );

  useGamepadEvent(
    layout.buttons.DPadUp,
    useCallback(() => {
      if (!focusOnMain.current) {
        if (typeof selected.current === "undefined") {
          selected.current = selectLink(categoryLinksRefs.current.length - 1);
        } else if (selected.current > 0) {
          selected.current = selectLink(selected.current - 1);
        } else if (selected.current === 0) {
          selected.current = selectLink(categoryLinksRefs.current.length - 1);
        }
      }
    }, [selectLink])
  );

  useGamepadEvent(
    layout.buttons.DPadRight,
    useCallback(() => {
      if (!focusOnMain.current) {
        focusOnMain.current = true;
      }
    }, [])
  );

  useGamepadEvent(
    layout.buttons.B,
    useCallback(() => {
      focusOnMain.current = false;
    }, [])
  );

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
