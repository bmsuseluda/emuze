import { useMatches } from "@remix-run/react";
import { useGamepads } from "~/hooks/useGamepads/index";
import layout from "~/hooks/useGamepads/layouts/xbox";
import { useRef, useState } from "react";

type CategoryLink = {
  id: string;
  name: string;
  to: string;
};

export const useGamepadsOnSidebar = (
  categoryLinks: CategoryLink[],
  pathname: string
) => {
  const categoryLinksRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  // TODO: use a context for this instead
  const focusOnMain = useRef(false);

  const selectLink = (index: number) => {
    categoryLinksRefs.current[index]?.focus();
    categoryLinksRefs.current[index]?.click();
  };

  const matches = useMatches();
  useGamepads([
    {
      gamepadIndex: 0,
      onButtonPress: (buttonId) => {
        const lastPathname = matches[matches.length - 1].pathname;
        if (!focusOnMain.current) {
          if (layout.buttons.DPadDown === buttonId) {
            if (lastPathname === pathname) {
              selectLink(0);
            } else {
              const currentIndex = categoryLinks.findIndex(
                ({ to }) => to === lastPathname
              );
              if (currentIndex < categoryLinks.length - 1) {
                selectLink(currentIndex + 1);
              } else {
                selectLink(0);
              }
            }
          }

          if (layout.buttons.DPadUp === buttonId) {
            if (lastPathname === pathname) {
              selectLink(categoryLinks.length - 1);
            } else {
              const currentIndex = categoryLinks.findIndex(
                ({ to }) => to === lastPathname
              );
              if (currentIndex === 0) {
                selectLink(categoryLinks.length - 1);
              } else {
                selectLink(currentIndex - 1);
              }
            }
          }

          if (
            [layout.buttons.DPadRight, layout.buttons.A].includes(buttonId) &&
            lastPathname !== pathname
          ) {
            focusOnMain.current = true;
          }
        } else {
          if (layout.buttons.B === buttonId) {
            focusOnMain.current = false;
          }
        }
      },
    },
  ]);

  return {
    refCallback: (ref: HTMLAnchorElement) => {
      categoryLinksRefs.current.push(ref);
    },
  };
};
