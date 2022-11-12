import layout from "~/hooks/useGamepads/layouts/xbox";
import { useRef } from "react";
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

  const selectLink = (index: number) => {
    categoryLinksRefs.current[index]?.focus();
    categoryLinksRefs.current[index]?.click();
    return index;
  };

  useGamepadEvent(layout.buttons.DPadDown, () => {
    if (!focusOnMain.current) {
      if (typeof selected.current === "undefined") {
        selected.current = selectLink(0);
      } else if (selected.current < categoryLinks.length - 1) {
        selected.current = selectLink(selected.current + 1);
      } else if (selected.current === categoryLinks.length - 1) {
        selected.current = selectLink(0);
      }
    }
  });

  useGamepadEvent(layout.buttons.DPadUp, () => {
    if (!focusOnMain.current) {
      if (typeof selected.current === "undefined") {
        selected.current = selectLink(categoryLinks.length - 1);
      } else if (selected.current > 0) {
        selected.current = selectLink(selected.current - 1);
      } else if (selected.current === 0) {
        selected.current = selectLink(categoryLinks.length - 1);
      }
    }
  });

  useGamepadEvent(layout.buttons.DPadRight, () => {
    if (!focusOnMain.current) {
      focusOnMain.current = true;
    }
  });
  useGamepadEvent(layout.buttons.B, () => {
    focusOnMain.current = false;
  });

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
