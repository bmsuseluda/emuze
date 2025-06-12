import { Headline } from "../../Headline/index.js";
import type { ComponentRef, ForwardedRef, ReactNode } from "react";
import { useCallback, useRef } from "react";
import { styled } from "../../../../styled-system/jsx/index.js";

type paddingLeft = "none" | "small" | "medium" | "large";

interface Props {
  headline?: ReactNode;
  paddingLeft?: paddingLeft;
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

const HeadlineWrapper = styled("div", {
  base: {
    paddingLeft: 0,
  },
  variants: {
    paddingLeft: {
      none: {
        paddingLeft: 0,
      },
      small: {
        paddingLeft: "1rem",
      },
      medium: {
        paddingLeft: "1.5rem",
      },
      large: {
        paddingLeft: "calc(1.5rem + 4px)",
      },
    },
  },
});

const Wrapper = styled("div", { base: { position: "relative", flex: 6 } });
const ListWrapper = styled("div", {
  base: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
  },

  variants: {
    dynamicHeight: {
      true: {
        position: "relative",
        // TODO: how to do it without a fixed value
        maxHeight: "70vh",
      },
    },
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
      "transparent)",

    padding: "{sizes.scrollMask} 0",

    "&::-webkit-scrollbar": {
      display: "none",
    },

    scrollbarWidth: "none",
  },

  variants: {
    scrollSmooth: {
      true: {
        scrollBehavior: "smooth",
        scrollPadding: "scrollPadding",
      },
    },
    paddingSide: {
      true: {
        paddingLeft: "1.5rem",
        paddingRight: "0.5rem",
      },
    },
  },
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
    paddingSide: {
      true: {
        paddingLeft: "1.5rem",
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
  paddingSide?: boolean;
  dynamicHeight?: boolean;
}

const ListActionBarContainer = ({
  list: listEntries,
  actions,
  scrollSmooth,
  collapse = false,
  listRef: listRefDefault,
  paddingSide = true,
  dynamicHeight = false,
}: ContainerProps) => {
  const listRef = useRef<ComponentRef<"div">>(undefined);

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
    <ListWrapper dynamicHeight={dynamicHeight}>
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
        onClick={onClick}
        paddingSide={paddingSide}
      >
        {listEntries}
      </List>
      {actions && (
        <ActionBar collapse={collapse} paddingSide={paddingSide}>
          {actions}
        </ActionBar>
      )}
    </ListWrapper>
  );
};

export const ListActionBarLayout = ({
  headline,
  paddingLeft = "medium",
  children,
}: Props) => (
  <Layout>
    {headline && (
      <HeadlineWrapper paddingLeft={paddingLeft}>
        <Headline>{headline}</Headline>
      </HeadlineWrapper>
    )}
    <Wrapper>{children}</Wrapper>
  </Layout>
);

ListActionBarLayout.ListActionBarContainer = ListActionBarContainer;
