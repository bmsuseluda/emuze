import { Headline } from "../../Headline";
import type { ElementRef, ForwardedRef, ReactNode } from "react";
import { useCallback, useRef } from "react";
import { styled } from "../../../../styled-system/jsx";
import { useFullscreen } from "../../../hooks/useFullscreen";

interface Props {
  headline?: ReactNode;
  children: ReactNode;
}

const Layout = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    width: "100%",
  },
});

const Wrapper = styled("div", { base: { position: "relative", flex: 6 } });
const Absolute = styled("div", {
  base: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
  },
});

const List = styled("div", {
  base: {
    flex: 15,
    overflowY: "auto",

    maskImage:
      "linear-gradient(" +
      "to bottom, " +
      "transparent, " +
      "{colors.backgroundColor} {sizes.scrollMask} calc(100% - {sizes.scrollMask}), " +
      "transparent)," +
      "linear-gradient({colors.backgroundColor}, {colors.backgroundColor})",
    maskSize:
      "calc(100% - {sizes.scrollbarWidth}) 100%, {sizes.scrollbarWidth} 100%",
    maskPosition: "0 0, 100% 0",
    maskRepeat: "no-repeat, no-repeat",

    padding: "{sizes.scrollMask} 0",

    "&::-webkit-scrollbar": {
      display: "none",
    },
  },

  variants: {
    scrollSmooth: {
      true: {
        scrollBehavior: "smooth",
        scrollPadding: "scrollPadding",
      },
    },
    // TODO: remove if not necessary anymore. Right now all props you want to use in compoundVariants need to be in variants as well.
    fullscreen: {
      true: {},
    },
    collapse: {
      true: {},
    },
  },

  compoundVariants: [
    {
      collapse: false,
      fullscreen: false,
      css: {
        paddingRight: "{sizes.scrollbarWidth}",

        scrollbarColor: "sidebarBackgroundColor transparent",

        "&::-webkit-scrollbar": {
          display: "initial",
          width: "scrollbarWidth",
        },

        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "transparent",
          borderRadius: "1",
        },

        "&:hover": {
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "sidebarBackgroundColor",
          },
        },
      },
    },
  ],
});

const ActionBar = styled("div", {
  base: {
    flex: 1,
    display: "flex",
    gap: "1",
    alignItems: "center",
  },

  variants: {
    collapse: {
      true: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      },
    },
  },
});

interface ContainerProps {
  list: ReactNode;
  actions?: ReactNode;
  scrollSmooth?: boolean;
  collapse?: boolean;
  listRef?: ForwardedRef<HTMLDivElement>;
}

const ListActionBarContainer = ({
  list: listEntries,
  actions,
  scrollSmooth,
  collapse = false,
  listRef: listRefDefault,
}: ContainerProps) => {
  const fullscreen = useFullscreen();
  const listRef = useRef<ElementRef<"div">>();

  const onClick = useCallback(() => {
    const list = listRef.current;
    if (list) {
      // Remove scrollPadding if entry is clicked by mouse to prevent centering the element, otherwise it would be difficult to double click a entry.
      list.style.scrollPadding = "inherit";

      setTimeout(() => {
        // Add scrollPadding if entry was selected by gamepad to center the element.
        // Needs to be in a timeout to reactivate the feature afterwards
        // If you change this value, change it in panda config as well
        list.style.scrollPadding = "50% 0";
      }, 10);
    }
  }, []);

  return (
    <Absolute>
      <List
        ref={(element: HTMLInputElement) => {
          if (typeof listRefDefault === "function") {
            listRefDefault(element);
          } else if (listRefDefault) {
            listRefDefault.current = element;
          }
          listRef.current = element;
        }}
        scrollSmooth={scrollSmooth}
        collapse={collapse}
        fullscreen={fullscreen}
        onClick={onClick}
      >
        {listEntries}
      </List>
      {actions && <ActionBar collapse={collapse}>{actions}</ActionBar>}
    </Absolute>
  );
};
ListActionBarContainer.displayName = "ListActionBarContainer";

export const ListActionBarLayout = ({ headline, children }: Props) => (
  <Layout>
    {headline && <Headline>{headline}</Headline>}
    <Wrapper>{children}</Wrapper>
  </Layout>
);

ListActionBarLayout.ListActionBarContainer = ListActionBarContainer;
